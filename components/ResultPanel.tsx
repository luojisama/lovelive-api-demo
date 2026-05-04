"use client";

import { useState } from "react";
import { Code2, LayoutGrid, Loader2, Copy, CheckCircle2, AlertCircle } from "lucide-react";
import type { Endpoint } from "@/lib/endpoints";
import type { CardItem, Character, EventItem, MusicItem } from "@/lib/types";
import { JsonView } from "./JsonView";
import { CardFace, CharacterCard, EventCard, MusicCard } from "./Cards";

interface Props {
  endpoint: Endpoint;
  loading: boolean;
  status: number | null;
  durationMs: number | null;
  data: unknown;
  error: string | null;
  requestUrl: string | null;
  upstreamUrl: string | null;
}

type ViewMode = "pretty" | "raw";

function isApiError(d: unknown): d is { error: { code: string; message: string } } {
  if (!d || typeof d !== "object") return false;
  const e = (d as { error?: unknown }).error;
  return !!e && typeof e === "object" && "code" in e && "message" in e;
}

function extractList(d: unknown): unknown[] {
  if (!d || typeof d !== "object") return [];
  const obj = d as { data?: unknown };
  if (Array.isArray(obj.data)) return obj.data as unknown[];
  if (obj.data && typeof obj.data === "object") {
    const inner = obj.data as Record<string, unknown>;
    for (const k of ["items", "list", "results"]) {
      if (Array.isArray(inner[k])) return inner[k] as unknown[];
    }
  }
  return [];
}

function extractItem(d: unknown): unknown {
  if (!d || typeof d !== "object") return null;
  return (d as { data?: unknown }).data ?? null;
}

function PrettyView({ endpoint, data }: { endpoint: Endpoint; data: unknown }) {
  if (isApiError(data)) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50/70 p-4 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200">
        <div className="flex items-center gap-2 font-semibold">
          <AlertCircle className="h-4 w-4" />
          {data.error.code}
        </div>
        <p className="mt-1 text-xs">{data.error.message}</p>
      </div>
    );
  }

  switch (endpoint.resultKind) {
    case "characters": {
      const list = extractList(data) as Character[];
      if (list.length === 0) return <EmptyHint />;
      return (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {list.map((c, index) => (
            <CharacterCard key={c.id ?? `character-${index}`} c={c} />
          ))}
        </div>
      );
    }
    case "character": {
      const c = extractItem(data) as Character | null;
      if (!c) return <EmptyHint />;
      return <CharacterCard c={c} />;
    }
    case "events": {
      const list = extractList(data) as EventItem[];
      if (list.length === 0) return <EmptyHint />;
      return (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {list.map((e, index) => (
            <EventCard key={e.id ?? `event-${index}`} e={e} />
          ))}
        </div>
      );
    }
    case "event": {
      const e = extractItem(data) as EventItem | null;
      if (!e) return <EmptyHint />;
      return <EventCard e={e} />;
    }
    case "music": {
      const list = extractList(data) as MusicItem[];
      if (list.length === 0) return <EmptyHint />;
      return (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {list.map((m, index) => (
            <MusicCard key={m.id ?? `music-${index}`} m={m} />
          ))}
        </div>
      );
    }
    case "musicItem": {
      const m = extractItem(data) as MusicItem | null;
      if (!m) return <EmptyHint />;
      return <MusicCard m={m} />;
    }
    case "card": {
      const card = extractItem(data) as CardItem | null;
      if (!card) return <EmptyHint />;
      return <CardFace card={card} />;
    }
    default:
      return <JsonView data={data} />;
  }
}

function EmptyHint() {
  return (
    <p className="rounded-xl border border-dashed border-zinc-200 bg-white/40 p-8 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/40">
      没有匹配到任何结果，可以试试其他条件。
    </p>
  );
}

export function ResultPanel(props: Props) {
  const { endpoint, loading, status, durationMs, data, error, requestUrl, upstreamUrl } = props;
  const [view, setView] = useState<ViewMode>("pretty");
  const [copied, setCopied] = useState(false);

  async function copyUrl(url: string | null) {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // 忽略
    }
  }

  return (
    <div className="flex h-full flex-col gap-4">
      {/* 请求信息条 */}
      <div className="rounded-xl border border-brand-100/60 bg-white/70 p-3 text-xs dark:border-brand-900/40 dark:bg-zinc-900/50">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded bg-brand-100 px-2 py-0.5 font-mono text-[11px] font-bold text-brand-700 dark:bg-brand-900/50 dark:text-brand-200">
            {endpoint.method}
          </span>
          <span className="break-all font-mono text-zinc-600 dark:text-zinc-300">
            {upstreamUrl ?? endpoint.pathTemplate}
          </span>
          {upstreamUrl && (
            <button
              type="button"
              onClick={() => copyUrl(upstreamUrl)}
              className="ml-auto inline-flex items-center gap-1 rounded-md border border-brand-100 px-2 py-1 text-[11px] text-zinc-600 hover:bg-brand-50 dark:border-brand-900/40 dark:text-zinc-300 dark:hover:bg-zinc-900"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="h-3 w-3 text-green-500" /> 已复制
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" /> 复制 URL
                </>
              )}
            </button>
          )}
        </div>
        {requestUrl && requestUrl !== upstreamUrl && (
          <div className="mt-2 break-all font-mono text-[11px] text-zinc-400">
            浏览器实际请求 → {requestUrl}
          </div>
        )}
        <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-zinc-500">
          {status !== null && (
            <span
              className={
                status >= 400
                  ? "text-red-600 dark:text-red-400"
                  : "text-green-600 dark:text-green-400"
              }
            >
              {status}
            </span>
          )}
          {durationMs !== null && <span>{durationMs} ms</span>}
        </div>
      </div>

      {/* 视图切换 */}
      <div className="inline-flex items-center gap-1 self-start rounded-full border border-brand-100 bg-white/60 p-1 text-xs dark:border-brand-900/40 dark:bg-zinc-900/50">
        {([
          { v: "pretty" as const, icon: LayoutGrid, label: "卡片" },
          { v: "raw" as const, icon: Code2, label: "原始 JSON" },
        ]).map(({ v, icon: Icon, label }) => (
          <button
            key={v}
            type="button"
            onClick={() => setView(v)}
            className={
              "inline-flex items-center gap-1 rounded-full px-3 py-1 transition " +
              (view === v
                ? "bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-sm"
                : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100")
            }
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        ))}
      </div>

      <div className="min-h-[200px] flex-1">
        {loading && (
          <div className="flex h-40 items-center justify-center text-brand-500">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        )}
        {!loading && error && (
          <div className="rounded-xl border border-red-200 bg-red-50/70 p-4 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200">
            <div className="flex items-center gap-2 font-semibold">
              <AlertCircle className="h-4 w-4" />
              请求失败
            </div>
            <p className="mt-1 text-xs">{error}</p>
          </div>
        )}
        {!loading && !error && data === null && (
          <p className="rounded-xl border border-dashed border-zinc-200 bg-white/40 p-8 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/40">
            选择左侧接口，填写参数后点击 “发送请求”。
          </p>
        )}
        {!loading && !error && data !== null && (
          view === "pretty" ? (
            <PrettyView endpoint={endpoint} data={data} />
          ) : (
            <JsonView data={data} />
          )
        )}
      </div>
    </div>
  );
}
