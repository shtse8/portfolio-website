"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { FaArrowUp, FaBolt } from "react-icons/fa6";
import { API_BASE, HAS_API } from "@/lib/api";
import { useWorkGraph } from "@/context/WorkGraphContext";
import SectionHeader from "./ui/SectionHeader";
import Reveal from "./ui/Reveal";
import Markdown from "./ui/Markdown";

// the questions the actual audience asks — not "type a command"
const SUGGESTIONS = [
  "Is Kyle senior enough for an AI-infra role?",
  "What has real, in-production usage?",
  "What is he building right now?",
  "Summarize pdf-reader-mcp's traction.",
];

/** Pull the rendered text out of an AI SDK UIMessage (its text parts joined). */
function messageText(parts: { type: string; text?: string }[]): string {
  return parts
    .filter((p) => p.type === "text" && typeof p.text === "string")
    .map((p) => p.text as string)
    .join("");
}

/**
 * EvidencePanel — the AI as an evidence navigator, built on the standard Vercel
 * AI SDK (`useChat`). It answers the questions a recruiter/founder actually has,
 * grounded in Kyle's live GitHub & npm (the server injects this minute's numbers
 * before the model answers). Clicking "ask about this" on a project hands the
 * question here. Not a terminal, not a generic chatbox.
 */
export default function EvidencePanel() {
  const { askSeed, clearAsk } = useWorkGraph();
  const [input, setInput] = useState("");
  const pendingSeed = useRef<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: `${API_BASE}/chat` }),
  });
  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  function ask(text: string) {
    const q = text.trim();
    if (!q || !HAS_API) return;
    if (status === "ready") sendMessage({ text: q });
    else pendingSeed.current = q; // queue one; the status effect drains it
  }

  // a project card handed us a question — run it + bring focus here
  useEffect(() => {
    if (!askSeed) return;
    ask(askSeed);
    clearAsk();
    document.getElementById("ask")?.scrollIntoView({ behavior: "smooth", block: "center" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [askSeed]);

  // drain a queued question once the previous answer finishes
  useEffect(() => {
    if (status === "ready" && pendingSeed.current && HAS_API) {
      const q = pendingSeed.current;
      pendingSeed.current = null;
      sendMessage({ text: q });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  function onSubmit(text: string) {
    const q = text.trim();
    if (!q || !HAS_API || busy) return;
    setInput("");
    sendMessage({ text: q });
  }

  const started = messages.length > 0;
  const lastIsUser = messages[messages.length - 1]?.role === "user";

  return (
    <div className="container-content">
      <SectionHeader
        index="02"
        eyebrow="Research the work · live agent"
        title="Ask, and it answers with evidence"
        description="A real AI agent, on Sylphx's own AI Gateway — the platform Kyle builds. It answers grounded in his live GitHub & npm (current numbers, not a static bio), so ask what you'd actually want to know."
      />

      <Reveal delay={0.05}>
        <div className="card mt-8 overflow-hidden">
          {started && (
            <div ref={scrollRef} className="max-h-[44vh] space-y-4 overflow-y-auto p-5 sm:p-6">
              {messages.map((m) => {
                const text = messageText(m.parts as { type: string; text?: string }[]);
                if (m.role === "user") {
                  return (
                    <div key={m.id} className="flex justify-end">
                      <div className="max-w-[85%] self-end whitespace-pre-wrap rounded-2xl rounded-br-sm bg-accent px-4 py-2.5 text-sm text-white">
                        {text}
                      </div>
                    </div>
                  );
                }
                return (
                  <div key={m.id} className="flex flex-col items-start">
                    <div className="max-w-[92%] rounded-2xl rounded-bl-sm bg-surface-sunken px-4 py-2.5">
                      {text ? <Markdown text={text} /> : <TypingDots />}
                    </div>
                  </div>
                );
              })}
              {/* awaiting the first token (assistant message not added yet) */}
              {busy && lastIsUser && (
                <div className="flex flex-col items-start">
                  <div className="max-w-[92%] rounded-2xl rounded-bl-sm bg-surface-sunken px-4 py-2.5">
                    <TypingDots />
                  </div>
                </div>
              )}
            </div>
          )}

          {!started && (
            <div className="flex flex-col gap-4 p-5 sm:p-6">
              <p className="text-sm text-text-tertiary">Try one — it answers from live data:</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => onSubmit(s)}
                    disabled={!HAS_API || busy}
                    className="rounded-lg border border-border bg-surface px-3.5 py-2.5 text-left text-[13px] text-text-secondary transition-colors hover:border-accent hover:text-text-primary disabled:opacity-50"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-border-subtle bg-surface-sunken/40 p-3 sm:p-4">
            {error && <p className="mb-2 px-1 text-xs text-red-500">The agent hit a snag — please try again.</p>}
            {!HAS_API && (
              <p className="mb-2 px-1 text-xs text-text-tertiary">The agent is coming online — everything else here is live.</p>
            )}
            <form onSubmit={(e) => { e.preventDefault(); onSubmit(input); }} className="flex items-end gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={!HAS_API || busy}
                placeholder={HAS_API ? "Ask about Kyle's work…" : "Agent coming online…"}
                className="flex-1 rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text-primary outline-none transition-colors placeholder:text-text-tertiary focus:border-accent disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={!HAS_API || busy || !input.trim()}
                aria-label="Ask"
                className="btn-primary h-11 w-11 shrink-0 rounded-xl p-0 disabled:opacity-40"
              >
                <FaArrowUp className="h-4 w-4" />
              </button>
            </form>
          </div>

          <div className="flex items-center gap-2 border-t border-border-subtle bg-surface px-4 py-2.5 text-[11px] text-text-tertiary">
            <FaBolt className="h-3 w-3 text-accent" />
            Powered by <strong className="font-semibold text-text-secondary">Sylphx AI Gateway</strong> — the platform Kyle builds. Grounded in live GitHub &amp; npm.
          </div>
        </div>
      </Reveal>
    </div>
  );
}

function TypingDots() {
  return (
    <span className="inline-flex gap-1">
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-text-tertiary [animation-delay:-0.3s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-text-tertiary [animation-delay:-0.15s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-text-tertiary" />
    </span>
  );
}
