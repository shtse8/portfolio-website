import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Markdown — renders the AI agent's answers with the industry-standard
 * `react-markdown` (+ GFM), styled to the site's tokens.
 *
 * Safe by default: react-markdown does not render raw HTML (no rehype-raw) and
 * sanitises URLs (its defaultUrlTransform strips `javascript:` etc.), so the
 * model's output can't inject markup. We only restyle the safe element subset
 * the agent uses; links open in a new tab.
 */

const components: Components = {
  a: ({ node, ...props }) => (
    <a {...props} target="_blank" rel="noopener noreferrer" className="text-accent underline-offset-2 hover:underline" />
  ),
  strong: ({ node, ...props }) => <strong {...props} className="font-semibold text-text-primary" />,
  em: ({ node, ...props }) => <em {...props} />,
  code: ({ node, ...props }) => (
    <code {...props} className="rounded bg-surface-sunken px-1 py-0.5 font-mono text-[0.85em] text-text-primary" />
  ),
  pre: ({ node, ...props }) => (
    <pre {...props} className="my-2.5 overflow-x-auto rounded-lg border border-border-subtle bg-surface-sunken p-3 font-mono text-[12px] leading-relaxed" />
  ),
  ul: ({ node, ...props }) => <ul {...props} className="my-2.5 ml-4 list-disc space-y-1" />,
  ol: ({ node, ...props }) => <ol {...props} className="my-2.5 ml-4 list-decimal space-y-1" />,
  li: ({ node, ...props }) => <li {...props} className="leading-relaxed" />,
  p: ({ node, ...props }) => <p {...props} className="leading-relaxed [&:not(:first-child)]:mt-2.5" />,
  h1: ({ node, ...props }) => <p {...props} className="font-semibold text-text-primary [&:not(:first-child)]:mt-3" />,
  h2: ({ node, ...props }) => <p {...props} className="font-semibold text-text-primary [&:not(:first-child)]:mt-3" />,
  h3: ({ node, ...props }) => <p {...props} className="font-semibold text-text-primary [&:not(:first-child)]:mt-3" />,
  blockquote: ({ node, ...props }) => (
    <blockquote {...props} className="my-2.5 border-l-2 border-border pl-3 text-text-tertiary" />
  ),
  hr: () => <hr className="my-3 border-border-subtle" />,
  table: ({ node, ...props }) => (
    <div className="my-2.5 overflow-x-auto">
      <table {...props} className="w-full border-collapse text-left text-[13px]" />
    </div>
  ),
  th: ({ node, ...props }) => <th {...props} className="border-b border-border px-2 py-1 font-semibold text-text-primary" />,
  td: ({ node, ...props }) => <td {...props} className="border-b border-border-subtle px-2 py-1" />,
};

export default function Markdown({ text }: { text: string }) {
  return (
    <div className="text-sm leading-relaxed text-text-secondary">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {text}
      </ReactMarkdown>
    </div>
  );
}
