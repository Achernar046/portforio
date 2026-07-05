"use client";

/**
 * A lightweight Markdown renderer for Lab READMEs.
 * Handles: headings, bold, italic, inline code, code blocks,
 * tables, unordered/ordered lists, blockquotes, and horizontal rules.
 */

import React from "react";

interface Props {
  content: string;
  accentColor: string;
}

const accentText: Record<string, string> = {
  blue:   "text-blue-400",
  orange: "text-orange-400",
  green:  "text-green-400",
  cyan:   "text-cyan-400",
  yellow: "text-yellow-400",
  purple: "text-purple-400",
  slate:  "text-slate-400",
};

/* ── inline parser (bold, italic, inline code, links) ── */
function parseInline(text: string, key: string | number): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  // Pattern: **bold**, *italic*, `code`, [text](url)
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|`([^`]+)`|\[([^\]]+)\]\(([^)]+)\))/g;
  let last = 0;
  let m: RegExpExecArray | null;

  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    if (m[2] !== undefined) {
      parts.push(<strong key={`b${m.index}`} className="font-semibold text-white">{m[2]}</strong>);
    } else if (m[3] !== undefined) {
      parts.push(<em key={`i${m.index}`} className="italic text-slate-300">{m[3]}</em>);
    } else if (m[4] !== undefined) {
      parts.push(
        <code key={`c${m.index}`} className="px-1.5 py-0.5 rounded bg-white/10 text-xs font-mono text-slate-200">
          {m[4]}
        </code>
      );
    } else if (m[5] !== undefined && m[6] !== undefined) {
      parts.push(
        <a key={`l${m.index}`} href={m[6]} target="_blank" rel="noopener noreferrer"
           className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors">
          {m[5]}
        </a>
      );
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

/* ── block parser ── */
export default function MarkdownRenderer({ content, accentColor }: Props) {
  const ac = accentText[accentColor] ?? accentText.blue;
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    // ── Code block ────────────────────────────────
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        <div key={key++} className="my-3">
          {lang && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-t-lg border border-white/8 border-b-0">
              <span className="w-2 h-2 rounded-full bg-red-500/70" />
              <span className="w-2 h-2 rounded-full bg-yellow-500/70" />
              <span className="w-2 h-2 rounded-full bg-green-500/70" />
              <span className="ml-1 text-[10px] font-mono text-slate-500">{lang}</span>
            </div>
          )}
          <pre className={`bg-black/50 border border-white/8 ${lang ? "rounded-b-lg" : "rounded-lg"} p-4 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed whitespace-pre`}>
            {codeLines.join("\n")}
          </pre>
        </div>
      );
      i++;
      continue;
    }

    // ── Table ─────────────────────────────────────
    if (line.includes("|") && line.trim().startsWith("|")) {
      const tableRows: string[][] = [];
      while (i < lines.length && lines[i].includes("|")) {
        const cells = lines[i].split("|").map((c) => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
        // skip separator rows (---|---|---)
        if (!cells.every((c) => /^[-:]+$/.test(c))) {
          tableRows.push(cells);
        }
        i++;
      }
      const [header, ...body] = tableRows;
      elements.push(
        <div key={key++} className="my-4 overflow-x-auto rounded-xl border border-white/8">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white/5 border-b border-white/8">
                {header?.map((h, j) => (
                  <th key={j} className={`px-4 py-2.5 text-left text-xs font-mono ${ac} uppercase tracking-wider`}>
                    {parseInline(h, j)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {body.map((row, ri) => (
                <tr key={ri} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-4 py-2.5 text-slate-300 text-sm">{parseInline(cell, ci)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    // ── H1 ────────────────────────────────────────
    if (line.startsWith("# ")) {
      elements.push(
        <h1 key={key++} className="text-2xl font-bold text-white mt-2 mb-3 leading-tight">
          {parseInline(line.slice(2), key)}
        </h1>
      );
      i++; continue;
    }

    // ── H2 ────────────────────────────────────────
    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={key++} className={`text-base font-bold mt-6 mb-2.5 flex items-center gap-2 ${ac}`}>
          <span className="w-3 h-px bg-current opacity-60" />
          {parseInline(line.slice(3), key)}
        </h2>
      );
      i++; continue;
    }

    // ── H3 ────────────────────────────────────────
    if (line.startsWith("### ")) {
      elements.push(
        <h3 key={key++} className="text-sm font-semibold text-slate-200 mt-4 mb-1.5">
          {parseInline(line.slice(4), key)}
        </h3>
      );
      i++; continue;
    }

    // ── H4 ────────────────────────────────────────
    if (line.startsWith("#### ")) {
      elements.push(
        <h4 key={key++} className="text-xs font-semibold text-slate-400 mt-3 mb-1 uppercase tracking-wider">
          {parseInline(line.slice(5), key)}
        </h4>
      );
      i++; continue;
    }

    // ── Blockquote ────────────────────────────────
    if (line.startsWith("> ")) {
      elements.push(
        <blockquote key={key++} className={`border-l-2 border-current ${ac} pl-4 py-1 my-3 text-sm text-slate-400 italic`}>
          {parseInline(line.slice(2), key)}
        </blockquote>
      );
      i++; continue;
    }

    // ── Horizontal Rule ───────────────────────────
    if (/^---+$/.test(line.trim())) {
      elements.push(<hr key={key++} className="border-white/10 my-5" />);
      i++; continue;
    }

    // ── Unordered list ────────────────────────────
    if (/^(\s*)[*\-+] /.test(line)) {
      const listItems: React.ReactNode[] = [];
      while (i < lines.length && /^(\s*)[*\-+] /.test(lines[i])) {
        const indent = lines[i].match(/^(\s*)/)?.[1].length ?? 0;
        const text = lines[i].replace(/^\s*[*\-+] /, "");
        listItems.push(
          <li key={i} className={`flex items-start gap-2 text-sm text-slate-300 ${indent > 0 ? "ml-4" : ""}`}>
            <span className={`mt-1.5 shrink-0 text-[8px] ${ac}`}>●</span>
            <span>{parseInline(text, i)}</span>
          </li>
        );
        i++;
      }
      elements.push(<ul key={key++} className="space-y-1.5 my-2">{listItems}</ul>);
      continue;
    }

    // ── Ordered list ──────────────────────────────
    if (/^\d+\. /.test(line)) {
      const listItems: React.ReactNode[] = [];
      let num = 1;
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        const text = lines[i].replace(/^\d+\. /, "");
        listItems.push(
          <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
            <span className={`shrink-0 w-5 h-5 rounded-full ${ac} bg-current/10 flex items-center justify-center text-[10px] font-mono font-bold mt-0.5`}
              style={{ color: "inherit" }}>
              <span className={ac}>{num}</span>
            </span>
            <span>{parseInline(text, i)}</span>
          </li>
        );
        num++;
        i++;
      }
      elements.push(<ol key={key++} className="space-y-2 my-2">{listItems}</ol>);
      continue;
    }

    // ── Empty line ────────────────────────────────
    if (line.trim() === "") {
      elements.push(<div key={key++} className="h-1" />);
      i++; continue;
    }

    // ── Paragraph ─────────────────────────────────
    elements.push(
      <p key={key++} className="text-sm text-slate-300 leading-relaxed">
        {parseInline(line, key)}
      </p>
    );
    i++;
  }

  return <div className="space-y-0.5">{elements}</div>;
}
