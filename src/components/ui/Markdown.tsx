import { Fragment, type ReactNode } from "react";

/**
 * Markdown — a tiny, dependency-free, SAFE renderer for the AI agent's answers.
 *
 * The agent replies in light Markdown (bold, italic, inline code, links, and
 * ordered/unordered lists). We render only that safe subset into real React
 * nodes — never `dangerouslySetInnerHTML`, and links are restricted to
 * http/https/mailto so a model can't emit a `javascript:` URL.
 */

const SAFE_URL = /^(https?:\/\/|mailto:)/i;

function inline(text: string, keyBase: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  // code | link | bold | italic — code first so ** inside `code` is literal.
  const re = /(`[^`]+`)|(\[[^\]]+\]\([^)\s]+\))|(\*\*[^*]+\*\*)|(\*[^*\s][^*]*\*|_[^_\s][^_]*_)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    const tok = m[0];
    const key = `${keyBase}-${k++}`;
    if (tok.startsWith("`")) {
      nodes.push(
        <code key={key} className="rounded bg-surface-sunken px-1 py-0.5 font-mono text-[0.85em] text-text-primary">
          {tok.slice(1, -1)}
        </code>,
      );
    } else if (tok.startsWith("[")) {
      const lm = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(tok);
      if (lm && SAFE_URL.test(lm[2])) {
        nodes.push(
          <a key={key} href={lm[2]} target="_blank" rel="noopener noreferrer" className="text-accent underline-offset-2 hover:underline">
            {lm[1]}
          </a>,
        );
      } else {
        nodes.push(lm ? lm[1] : tok);
      }
    } else if (tok.startsWith("**")) {
      nodes.push(<strong key={key} className="font-semibold text-text-primary">{tok.slice(2, -2)}</strong>);
    } else {
      nodes.push(<em key={key}>{tok.slice(1, -1)}</em>);
    }
    last = m.index + tok.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

function paragraph(text: string, key: string): ReactNode {
  const lines = text.split("\n");
  return (
    <p key={key} className="leading-relaxed [&:not(:first-child)]:mt-2.5">
      {lines.map((ln, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          {inline(ln, `${key}-${i}`)}
        </Fragment>
      ))}
    </p>
  );
}

const LIST_RE = /^\s*([-*]|\d+\.)\s+/;

export default function Markdown({ text }: { text: string }) {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let i = 0;
  let b = 0;

  while (i < lines.length) {
    if (/^\s*$/.test(lines[i])) { i++; continue; }

    if (LIST_RE.test(lines[i])) {
      const ordered = /^\s*\d+\.\s+/.test(lines[i]);
      const items: string[] = [];
      while (i < lines.length && LIST_RE.test(lines[i])) {
        items.push(lines[i].replace(LIST_RE, ""));
        i++;
      }
      const key = `b${b++}`;
      const inner = items.map((it, j) => (
        <li key={j} className="leading-relaxed">{inline(it, `${key}-${j}`)}</li>
      ));
      blocks.push(
        ordered ? (
          <ol key={key} className="ml-4 list-decimal space-y-1 [&:not(:first-child)]:mt-2.5">{inner}</ol>
        ) : (
          <ul key={key} className="ml-4 list-disc space-y-1 [&:not(:first-child)]:mt-2.5">{inner}</ul>
        ),
      );
    } else {
      const para: string[] = [];
      while (i < lines.length && !/^\s*$/.test(lines[i]) && !LIST_RE.test(lines[i])) {
        para.push(lines[i]);
        i++;
      }
      blocks.push(paragraph(para.join("\n"), `b${b++}`));
    }
  }

  return <div className="text-sm text-text-secondary">{blocks}</div>;
}
