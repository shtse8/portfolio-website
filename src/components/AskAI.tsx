"use client";

import { useEffect, useRef, useState } from "react";
import { FaArrowUp, FaBolt } from "react-icons/fa6";
import { API_BASE, HAS_API } from "@/lib/api";
import Reveal from "./ui/Reveal";
import SectionHeader from "./ui/SectionHeader";

interface Msg {
  role: "user" | "assistant";
  content: string;
  tools?: string[]; // tool calls the agent made for this answer
}

const SUGGESTIONS = [
  "What has Kyle shipped recently?",
  "Tell me about pdf-reader-mcp",
  "What has he built for RAG?",
  "Is he a fit for an AI infra role?",
];

// friendly label for each agent tool, shown live as it runs
const TOOL_LABEL: Record<string, string> = {
  get_recent_activity: "reading his latest GitHub activity",
  get_repo: "looking up the repo",
  search_projects: "searching his projects",
  get_live_stats: "pulling live stats",
};

/**
 * "Ask my AI" — a real agent, not a scripted bot. It runs on Sylphx's own AI
 * Gateway (the platform Kyle builds) and calls live tools (GitHub, projects,
 * stats) before answering; you watch each call happen. The site's centrepiece.
 */
export default function AskAI() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  function patchLast(fn: (m: Msg) => Msg) {
    setMessages((prev) => {
      const copy = [...prev];
      copy[copy.length - 1] = fn(copy[copy.length - 1]);
      return copy;
    });
  }

  async function send(text: string) {
    const q = text.trim();
    if (!q || busy || !HAS_API) return;
    setError(null);
    setInput("");
    const next: Msg[] = [...messages, { role: "user", content: q }, { role: "assistant", content: "", tools: [] }];
    setMessages(next);
    setBusy(true);
    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: next.slice(0, -1).map((m) => ({ role: m.role, content: m.content })) }),
      });
      if (!res.ok || !res.body) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || `request failed (${res.status})`);
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let acc = "";
      let gotAnything = false;
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          const t = line.trim();
          if (!t.startsWith("data:")) continue;
          const raw = t.slice(5).trim();
          if (!raw) continue;
          let ev: { type?: string; name?: string; delta?: string; message?: string };
          try { ev = JSON.parse(raw); } catch { continue; }
          if (ev.type === "tool" && ev.name) {
            gotAnything = true;
            patchLast((m) => ({ ...m, tools: [...(m.tools ?? []), ev.name as string] }));
          } else if (ev.type === "text" && ev.delta) {
            gotAnything = true;
            acc += ev.delta;
            patchLast((m) => ({ ...m, content: acc }));
          } else if (ev.type === "error") {
            throw new Error(ev.message || "agent error");
          }
        }
      }
      if (!gotAnything) throw new Error("no response");
    } catch (e) {
      setMessages((prev) => prev.slice(0, -1));
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
        eyebrow="Ask my AI · live agent"
        title="Don't read the portfolio — interrogate it"
        description="This isn't a scripted bot. It's an AI agent running on Sylphx — the AI-native platform I build — with live tools: it reads my GitHub, searches my projects, and pulls real numbers before it answers. The site, demonstrating the thing it describes."
      />

      <Reveal delay={0.05}>
        <div className="card mt-10 overflow-hidden">
          {/* powered-by ribbon — the meta-point, made visible */}
          <div className="flex items-center gap-2 border-b border-border-subtle bg-accent-subtle/50 px-5 py-2.5 text-xs text-text-secondary">
            <FaBolt className="h-3 w-3 text-accent" />
            <span>
              Powered by <strong className="font-semibold text-text-primary">Sylphx AI Gateway</strong> — the
              platform I build. Tools run against live GitHub &amp; npm.
            </span>
          </div>

          {/* conversation */}
          {started && (
            <div ref={scrollRef} className="max-h-[46vh] space-y-4 overflow-y-auto p-5 sm:p-7">
              {messages.map((m, i) => (
                <div key={i} className={m.role === "user" ? "flex justify-end" : "flex flex-col items-start gap-1.5"}>
                  {/* live tool calls for assistant turns */}
                  {m.role === "assistant" && m.tools && m.tools.length > 0 && (
                    <div className="flex flex-col gap-1">
                      {m.tools.map((tool, ti) => (
                        <div key={ti} className="flex items-center gap-1.5 font-mono text-[11px] text-text-tertiary">
                          <FaBolt className="h-2.5 w-2.5 text-accent" />
                          {TOOL_LABEL[tool] ?? tool}
                          <span className="text-positive">✓</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div
                    className={
                      m.role === "user"
                        ? "max-w-[85%] self-end rounded-2xl rounded-br-sm bg-accent px-4 py-2.5 text-sm text-white"
                        : "max-w-[92%] whitespace-pre-wrap rounded-2xl rounded-bl-sm bg-surface-sunken px-4 py-2.5 text-sm leading-relaxed text-text-secondary"
                    }
                  >
                    {m.content || (m.role === "assistant" && (!m.tools || m.tools.length === 0) && (
                      <span className="inline-flex gap-1">
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-text-tertiary [animation-delay:-0.3s]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-text-tertiary [animation-delay:-0.15s]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-text-tertiary" />
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* empty state — suggestions */}
          {!started && (
            <div className="flex flex-col gap-4 p-5 sm:p-7">
              <p className="text-sm text-text-tertiary">Try asking — watch it reach for live data:</p>
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
                The live agent is coming online — meanwhile, everything about my work is below.
              </p>
            )}
            <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); }
                }}
                rows={1}
                disabled={!HAS_API || busy}
                placeholder={HAS_API ? "Ask anything about Kyle — the agent will dig…" : "Agent coming online…"}
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
