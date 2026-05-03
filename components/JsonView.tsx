"use client";

import { useMemo } from "react";

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function highlight(json: string): string {
  // 先转义，再用正则匹配各类 token
  const escaped = escapeHtml(json);
  return escaped.replace(
    /("(?:\\.|[^"\\])*"(?:\s*:)?|\b(?:true|false|null)\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g,
    (match) => {
      let cls = "json-number";
      if (/^"/.test(match)) {
        cls = /:$/.test(match) ? "json-key" : "json-string";
      } else if (/true|false/.test(match)) {
        cls = "json-bool";
      } else if (/null/.test(match)) {
        cls = "json-null";
      }
      return `<span class="${cls}">${match}</span>`;
    },
  );
}

export function JsonView({ data }: { data: unknown }) {
  const html = useMemo(() => {
    try {
      const text = JSON.stringify(data, null, 2);
      return highlight(text);
    } catch {
      return escapeHtml(String(data));
    }
  }, [data]);

  return (
    <pre
      className="scroll-thin max-h-[60vh] overflow-auto rounded-xl bg-white/70 p-4 text-xs leading-relaxed text-zinc-800 ring-1 ring-brand-100/60 dark:bg-zinc-950/60 dark:text-zinc-200 dark:ring-brand-900/40"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
