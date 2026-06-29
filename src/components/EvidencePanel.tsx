"use client";

import { useEffect, useRef, useState } from "react";
import { FaArrowUp } from "react-icons/fa6";
import { FaBolt } from "react-icons/fa6";
import { API_BASE, HAS_API } from "@/lib/api";
import { useWorkGraph } from "@/context/WorkGraphContext";
import SectionHeader from "./ui/SectionHeader";
import Reveal from "./ui/Reveal";
import Markdown from "./ui/Markdown";

interface Msg {
  role: "user" | "assistant";
  content: string;
  tools?: string[];
}

// the questions the actual audience asks — not "type a command"
const SUGGESTIONS = [
  "Is Kyle senior enough for an AI-infra role?",
  "What has real, in-production usage?",
  "What is he building right now?",
  "Summarize pdf-reader-mcp's traction.",
];

const TOOL_LABEL: Record<string, string> = {
  get_recent_activity: "reading recent GitHub activity",
  get_repo: "checking the repo",
  search_projects: "searching his projects",
  get_live_stats: "pulling live numbers",
};

/**
 * EvidencePanel — the AI as an *evidence navigator*, not a terminal.
 *
 * It answers the questions a recruiter or founder actually has, grounding every
 * answer in live GitHub/npm data (you watch it reach for the numbers). Clicking
 * "ask about this" on any project hands the thread here (askSeed), so the AI is
 * the way to go deeper on whatever you're looking at — contextual, not a
 * free-floating chatbox.
 */
export default function EvidencePanel() {
  const { askSeed, clearAsk } = useWorkGraph();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const busyRef = useRef(false);
  const pendingSeedRef = useRef<string | null>(null);
  const messagesRef = useRef<Msg[]>([]);

  useEffect(() => {
    messagesRef.current = messages;
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  // a project card handed us a question — clear the seed immediately (so the
  // same question can be clicked again), run it now if free, or queue ONE if a
  // request is in flight; the queue drains when `busy` clears below.
  useEffect(() => {
    if (!askSeed) return;
    const q = askSeed;
    clearAsk();
    document.getElementById("ask")?.scrollIntoView({ behavior: "smooth", block: "center" });
    if (busyRef.current) pendingSeedRef.current = q;
    else void send(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [askSeed]);

  function patchLast(fn: (m: Msg) => Msg) {
    setMessages((prev) => {
      const copy = [...prev];
      copy[copy.length - 1] = fn(copy[copy.length - 1]);
      return copy;
    });
  }

  async function send(text: string) {
    const q = text.trim();
    if (!q || busyRef.current || !HAS_API) return;
    setError(null);
    setInput("");
    const next: Msg[] = [...messagesRef.current, { role: "user", content: q }, { role: "assistant", content: "", tools: [] }];
    setMessages(next);
    messagesRef.current = next;
    setBusy(true);
    busyRef.current = true;
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
      let got = false;
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
            got = true;
            patchLast((m) => ({ ...m, tools: [...(m.tools ?? []), ev.name as string] }));
          } else if (ev.type === "text" && ev.delta) {
            got = true;
            acc += ev.delta;
            patchLast((m) => ({ ...m, content: acc }));
          } else if (ev.type === "error") {
            throw new Error(ev.message || "agent error");
          }
        }
      }
      if (!got) throw new Error("no response");
    } catch (e) {
      setMessages((prev) => prev.slice(0, -1));
      setError(e instanceof Error ? e.message : "something went wrong");
    } finally {
      // clear the ref BEFORE the state so the queued-seed drain below (and any
      // re-entrant send) sees a consistent not-busy state; drain synchronously
      // so a render-timing race can't double-send or drop the queued seed.
      busyRef.current = false;
      setBusy(false);
      const pending = pendingSeedRef.current;
      if (pending) {
        pendingSeedRef.current = null;
        void send(pending);
      }
    }
  }

  const started = messages.length > 0;

  return (
    <div className="container-content">
      <SectionHeader
        index="02"
        eyebrow="Research the work · live agent"
        title="Ask, and it answers with evidence"
        description="A real AI agent — running on Sylphx's own AI Gateway, the platform I build. Ask what you'd actually want to know; it reads my live GitHub & npm before answering, and you watch it do so."
      />

      <Reveal delay={0.05}>
        <div className="card mt-8 overflow-hidden">
          {started && (
            <div ref={scrollRef} className="max-h-[44vh] space-y-4 overflow-y-auto p-5 sm:p-6">
              {messages.map((m, i) => (
                <div key={i} className={m.role === "user" ? "flex justify-end" : "flex flex-col items-start gap-1.5"}>
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
                        ? "max-w-[85%] self-end whitespace-pre-wrap rounded-2xl rounded-br-sm bg-accent px-4 py-2.5 text-sm text-white"
                        : "max-w-[92%] rounded-2xl rounded-bl-sm bg-surface-sunken px-4 py-2.5"
                    }
                  >
                    {m.role === "assistant" ? (
                      m.content ? (
                        <Markdown text={m.content} />
                      ) : (
                        (!m.tools || m.tools.length === 0) && (
                          <span className="inline-flex gap-1">
                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-text-tertiary [animation-delay:-0.3s]" />
                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-text-tertiary [animation-delay:-0.15s]" />
                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-text-tertiary" />
                          </span>
                        )
                      )
                    ) : (
                      m.content
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!started && (
            <div className="flex flex-col gap-4 p-5 sm:p-6">
              <p className="text-sm text-text-tertiary">Try one — it&apos;ll reach for live data before it answers:</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    disabled={!HAS_API}
                    className="rounded-lg border border-border bg-surface px-3.5 py-2.5 text-left text-[13px] text-text-secondary transition-colors hover:border-accent hover:text-text-primary disabled:opacity-50"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-border-subtle bg-surface-sunken/40 p-3 sm:p-4">
            {error && <p className="mb-2 px-1 text-xs text-red-500">{error}</p>}
            {!HAS_API && (
              <p className="mb-2 px-1 text-xs text-text-tertiary">The agent is coming online — everything else here is live.</p>
            )}
            <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex items-end gap-2">
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
            Powered by <strong className="font-semibold text-text-secondary">Sylphx AI Gateway</strong> — the platform I build. Answers cite live GitHub &amp; npm.
          </div>
        </div>
      </Reveal>
    </div>
  );
}
