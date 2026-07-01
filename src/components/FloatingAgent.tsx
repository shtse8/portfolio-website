"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import {
  FaArrowUp,
  FaBolt,
  FaGithub,
  FaMagnifyingGlass,
  FaRegStar,
  FaTerminal,
  FaDownload,
  FaXmark,
  FaWandMagicSparkles,
} from "react-icons/fa6";
import { API_BASE, HAS_API } from "@/lib/api";
import { useWorkGraph } from "@/context/WorkGraphContext";
import Markdown from "./ui/Markdown";

const SUGGESTIONS = [
  "Is Kyle senior enough for an AI-infra role?",
  "What has real, in-production usage?",
  "What is he building right now?",
  "Summarize pdf-reader-mcp's traction.",
];

/**
 * FloatingAgent — a persistent AI agent launcher + overlay panel.
 *
 * Always visible as a floating button (bottom-right). Opens into a full chat
 * panel with live tool-call visualization: when the agent calls list_projects,
 * get_repo, etc., the visitor watches the tool execute in real-time.
 *
 * This is the dogfood wow factor: the chat on this site is a real agent that
 * calls real tools through the Sylphx AI Gateway.
 */
export default function FloatingAgent() {
  const { askSeed, clearAsk } = useWorkGraph();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const reduce = useReducedMotion();
  const pendingSeed = useRef<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showHint, setShowHint] = useState(false);

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: `${API_BASE}/chat` }),
  });
  const busy = status === "submitted" || status === "streaming";

  // Mobile: lock body scroll when bottom sheet is open
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!open) return;
    const isMobile = window.matchMedia("(max-width: 639px)").matches;
    if (!isMobile) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Listen for "open-agent" custom events (e.g. from Hero CTA)
  // + Escape-to-close when panel is open
  useEffect(() => {
    if (typeof window === "undefined") return;
    const openHandler = () => setOpen(true);
    const escapeHandler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) setOpen(false);
    };
    window.addEventListener("open-agent", openHandler);
    if (open) window.addEventListener("keydown", escapeHandler);
    return () => {
      window.removeEventListener("open-agent", openHandler);
      window.removeEventListener("keydown", escapeHandler);
    };
  }, [open]);

  // One-time hint bubble after 3s on first visit
  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = localStorage.getItem("agent-hint-seen");
    if (!seen) {
      const t = setTimeout(() => {
        setShowHint(true);
        localStorage.setItem("agent-hint-seen", "1");
      }, 3000);
      return () => clearTimeout(t);
    }
  }, []);

  const scrollToBottom = useCallback(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const ask = useCallback(
    (text: string) => {
      const q = text.trim();
      if (!q || !HAS_API) return;
      if (status === "ready") sendMessage({ text: q });
      else pendingSeed.current = q;
    },
    [sendMessage, status],
  );

  // A project card handed us a question
  useEffect(() => {
    if (!askSeed) return;
    ask(askSeed);
    clearAsk();
    setOpen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [askSeed]);

  // drain queued question
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

  return (
    <>
      {/* ── Floating launcher button ── */}
      <AnimatePresence>
        {!open && (
          <motion.button
            key="launcher"
            initial={reduce ? { opacity: 0 } : { scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => {
              setOpen(true);
              setShowHint(false);
            }}
            className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-contrast shadow-lg transition-transform hover:scale-105 active:scale-95 sm:bottom-7 sm:right-7"
            aria-label="Ask my AI"
          >
            {/* pulse ring */}
            <span className="absolute inset-0 rounded-full bg-accent/40 animate-ping-soft" />
            <FaWandMagicSparkles className="relative h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── One-time hint bubble ── */}
      <AnimatePresence>
        {showHint && !open && (
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-[5.5rem] right-5 z-50 max-w-[14rem] cursor-pointer rounded-xl border border-border bg-surface px-3.5 py-2.5 text-xs text-text-secondary shadow-md sm:bottom-[6rem] sm:right-7"
            onClick={() => {
              setOpen(true);
              setShowHint(false);
            }}
          >
            <span className="font-medium text-text-primary">Ask about my work →</span>
            <br />
            <span className="text-text-tertiary">Real AI agent with live tools</span>
            {/* arrow pointing down-right */}
            <span className="absolute -bottom-1 right-5 h-3 w-3 rotate-45 border-b border-r border-border bg-surface" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Overlay panel ── */}
      <AnimatePresence>
        {open && (
          <>
            {/* Mobile backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm sm:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.div
              key="panel"
              initial={reduce ? { opacity: 0 } : { y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={reduce ? { opacity: 0 } : { y: 30, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-x-0 bottom-0 z-50 flex max-h-[85vh] flex-col rounded-t-3xl border border-border bg-surface shadow-2xl sm:inset-x-auto sm:bottom-7 sm:right-7 sm:max-h-[600px] sm:w-[400px] sm:rounded-3xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border-subtle px-5 py-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-subtle">
                    <FaWandMagicSparkles className="h-4 w-4 text-accent" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-text-primary">Ask my AI</div>
                    <div className="font-mono text-[10px] text-text-tertiary">
                      Powered by sylphx/lumen · Gateway
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-text-tertiary transition-colors hover:bg-surface-sunken hover:text-text-primary"
                  aria-label="Close"
                >
                  <FaXmark className="h-4 w-4" />
                </button>
              </div>

              {/* Messages / Suggestions */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4">
                {!started && (
                  <div className="space-y-3">
                    <div className="rounded-2xl rounded-bl-sm bg-surface-sunken px-4 py-3 text-sm text-text-secondary">
                      Hi — I&apos;m Kyle&apos;s AI agent. I answer from <strong className="text-text-primary">live data</strong> (real-time GitHub stars, npm downloads, project details).
                      <br /><br />
                      Every answer is grounded — ask me anything about his work.
                    </div>
                    <div className="space-y-2">
                      {SUGGESTIONS.map((s) => (
                        <button
                          key={s}
                          onClick={() => onSubmit(s)}
                          disabled={!HAS_API || busy}
                          className="block w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-left text-[13px] text-text-secondary transition-all hover:border-accent hover:text-text-primary disabled:opacity-50"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {started && (
                  <div className="space-y-4">
                    {messages.map((m) => (
                      <MessageBubble key={m.id} message={m} />
                    ))}
                    {busy && messages[messages.length - 1]?.role === "user" && (
                      <div className="flex flex-col items-start">
                        <div className="rounded-2xl rounded-bl-sm bg-surface-sunken px-4 py-2.5">
                          <TypingDots />
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {error && (
                  <p className="mt-3 px-1 text-xs text-red-500">
                    The agent hit a snag — please try again.
                  </p>
                )}
              </div>

              {/* Input bar */}
              <div className="border-t border-border-subtle p-3">
                {!HAS_API && (
                  <p className="mb-2 px-1 text-[11px] text-text-tertiary">
                    The agent is coming online — everything else here is live.
                  </p>
                )}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    onSubmit(input);
                  }}
                  className="flex items-end gap-2"
                >
                  <input
                    ref={(el) => { if (open && el) setTimeout(() => el.focus(), 100); }}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={!HAS_API || busy}
                    aria-label="Ask the AI agent"
                    placeholder={HAS_API ? "Ask about Kyle's work…" : "Agent coming online…"}
                    className="flex-1 rounded-2xl border border-border bg-surface px-4 py-2.5 text-sm text-text-primary outline-none transition-colors placeholder:text-text-tertiary focus:border-accent disabled:opacity-60"
                  />
                  <button
                    type="submit"
                    disabled={!HAS_API || busy || !input.trim()}
                    aria-label="Send"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-accent p-0 text-accent-contrast transition-transform hover:scale-105 active:scale-95 disabled:opacity-40"
                  >
                    <FaArrowUp className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// ── Message bubble with tool-call rendering ──────────────────────────────────

function MessageBubble({ message }: { message: UIMessage }) {
  const text = (message.parts as Array<{ type: string; text?: string }>)
    .filter((p) => p.type === "text" && typeof p.text === "string")
    .map((p) => p.text as string)
    .join("");

  const toolParts = (message.parts as Array<Record<string, unknown>>).filter(
    (p) => typeof p.type === "string" && p.type.startsWith("tool-"),
  );

  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-sm bg-accent px-4 py-2.5 text-sm text-accent-contrast">
          {text}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start gap-2">
      {toolParts.map((tp, i) => (
        <ToolCall key={`${tp.toolCallId ?? i}-${i}`} part={tp} />
      ))}
      {text && (
        <div className="max-w-[92%] rounded-2xl rounded-bl-sm bg-surface-sunken px-4 py-2.5">
          <Markdown text={text} />
        </div>
      )}
    </div>
  );
}

// ── Tool call visualizer ─────────────────────────────────────────────────────

const TOOL_META: Record<string, { icon: typeof FaMagnifyingGlass; label: string }> = {
  list_projects: { icon: FaMagnifyingGlass, label: "Listing projects" },
  get_repo: { icon: FaRegStar, label: "Fetching repo details" },
  recent_activity: { icon: FaTerminal, label: "Checking recent activity" },
  search_projects: { icon: FaMagnifyingGlass, label: "Searching projects" },
  npm_downloads: { icon: FaDownload, label: "Pulling npm stats" },
};

function ToolCall({ part }: { part: Record<string, unknown> }) {
  const toolName = (part.toolName as string) ?? "tool";
  const state = (part.state as string) ?? "input-available";
  const meta = TOOL_META[toolName] ?? { icon: FaBolt, label: toolName };
  const Icon = meta.icon;
  const input = part.input as Record<string, unknown> | undefined;
  const output = part.output as unknown[] | Record<string, unknown> | undefined;

  const isRunning = state === "input-streaming" || state === "input-available";

  return (
    <div className="max-w-[92%] rounded-xl border border-border-subtle bg-surface-sunken/60 px-3 py-2.5">
      <div className="flex items-center gap-2">
        <div
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
            isRunning ? "bg-accent-subtle" : "bg-positive-subtle"
          }`}
        >
          {isRunning ? (
            <span className="h-2.5 w-2.5 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          ) : (
            <Icon className="h-3.5 w-3.5 text-positive" />
          )}
        </div>
        <span className="font-mono text-[11px] text-text-secondary">
          {meta.label}
        </span>
        {/* show input args briefly */}
        {input && (
          <span className="font-mono text-[10px] text-text-tertiary truncate">
            {Object.entries(input)
              .map(([k, v]) => `${k}: ${String(v)}`)
              .join(", ")}
          </span>
        )}
      </div>
      {/* show compact output when available */}
      {!isRunning && output && (
        <div className="mt-1.5 font-mono text-[10px] text-text-tertiary">
          {Array.isArray(output)
            ? `${output.length} results`
            : typeof output === "object" && output && "stars" in output
              ? `${(output as { stars: number }).stars}★ · ${(output as { forks?: number }).forks ?? 0} forks`
              : "✓ done"}
        </div>
      )}
    </div>
  );
}

// ── Typing indicator ─────────────────────────────────────────────────────────

function TypingDots() {
  return (
    <span className="inline-flex gap-1">
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-text-tertiary [animation-delay:-0.3s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-text-tertiary [animation-delay:-0.15s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-text-tertiary" />
    </span>
  );
}
