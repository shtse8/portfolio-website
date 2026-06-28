"use client";

import { useEffect, useRef, useState } from "react";
import { FaArrowUp, FaRegCommentDots } from "react-icons/fa6";
import { API_BASE, HAS_API } from "@/lib/api";
import Reveal from "./ui/Reveal";
import SectionHeader from "./ui/SectionHeader";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "What does Kyle actually build?",
  "Tell me about pdf-reader-mcp",
  "Is Kyle a fit for an AI infra role?",
  "What's Sylphx?",
];

/**
 * "Ask my AI about Kyle" — a streamed chat backed by Sylphx's own AI Gateway
 * (kylet-api `/chat`). Visitors learn about Kyle by talking to an AI grounded
 * in his real work. The site's centrepiece interaction.
 */
export default function AskAI() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function send(text: string) {
    const q = text.trim();
    if (!q || busy || !HAS_API) return;
    setError(null);
    setInput("");
    const next: Msg[] = [...messages, { role: "user", content: q }, { role: "assistant", content: "" }];
    setMessages(next);
    setBusy(true);
    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          messages: next.slice(0, -1).map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      if (!res.ok || !res.body) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || `request failed (${res.status})`);
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let acc = "";
      // Parse the OpenAI-compatible SSE stream and append deltas live.
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          const t = line.trim();
          if (!t.startsWith("data:")) continue;
          const payload = t.slice(5).trim();
          if (payload === "[DONE]" || !payload) continue;
          try {
            const delta = JSON.parse(payload)?.choices?.[0]?.delta?.content;
            if (typeof delta === "string" && delta) {
              acc += delta;
              setMessages((prev) => {
                const copy = [...prev];
                copy[copy.length - 1] = { role: "assistant", content: acc };
                return copy;
              });
            }
          } catch {
            /* ignore keep-alive / non-JSON frames */
          }
        }
      }
      if (!acc) throw new Error("no response");
    } catch (e) {
      setMessages((prev) => prev.slice(0, -1)); // drop the empty assistant bubble
      setError(e instanceof Error ? e.message : "something went wrong");
    } finally {
      setBusy(false);
    }
  }

  const started = messages.length > 0;

  return (
    <div className="container-content">
      <SectionHeader
        index="01"
        eyebrow="Ask my AI"
        title="Talk to an AI that knows my work"
        description="Powered by Sylphx's own AI Gateway — the AI-native platform I build. Ask anything about my projects, the MCP ecosystem, or whether I'm a fit for what you need."
      />

      <Reveal delay={0.05}>
        <div className="card mt-10 overflow-hidden">
          {/* conversation */}
          {started && (
            <div ref={scrollRef} className="max-h-[42vh] space-y-4 overflow-y-auto p-5 sm:p-7">
              {messages.map((m, i) => (
                <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                  <div
                    className={
                      m.role === "user"
                        ? "max-w-[85%] rounded-2xl rounded-br-sm bg-accent px-4 py-2.5 text-sm text-white"
                        : "max-w-[90%] whitespace-pre-wrap rounded-2xl rounded-bl-sm bg-surface-sunken px-4 py-2.5 text-sm text-text-secondary"
                    }
                  >
                    {m.content || (
                      <span className="inline-flex gap-1">
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-text-tertiary [animation-delay:-0.3s]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-text-tertiary [animation-delay:-0.15s]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-text-tertiary" />
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* empty state — suggestions */}
          {!started && (
            <div className="flex flex-col gap-4 p-5 sm:p-7">
              <div className="flex items-center gap-2 text-sm text-text-tertiary">
                <FaRegCommentDots className="h-4 w-4 text-accent" />
                Try asking
              </div>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    disabled={!HAS_API}
                    className="chip transition-colors hover:border-accent hover:text-text-primary disabled:opacity-50"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* input */}
          <div className="border-t border-border-subtle bg-surface-sunken/40 p-3 sm:p-4">
            {error && <p className="mb-2 px-1 text-xs text-red-500">{error}</p>}
            {!HAS_API && (
              <p className="mb-2 px-1 text-xs text-text-tertiary">
                The live AI chat is warming up — meanwhile, everything about my work is below.
              </p>
            )}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-end gap-2"
            >
              <textarea
                ref={taRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                rows={1}
                disabled={!HAS_API || busy}
                placeholder={HAS_API ? "Ask anything about Kyle…" : "Chat coming online…"}
                className="max-h-32 flex-1 resize-none rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text-primary outline-none transition-colors placeholder:text-text-tertiary focus:border-accent disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={!HAS_API || busy || !input.trim()}
                aria-label="Send"
                className="btn-primary h-11 w-11 shrink-0 rounded-xl p-0 disabled:opacity-40"
              >
                <FaArrowUp className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
