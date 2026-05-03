"use client";

import { useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import { ENDPOINTS, buildPath, buildQuery, type Endpoint } from "@/lib/endpoints";
import { EndpointForm } from "./EndpointForm";
import { ResultPanel } from "./ResultPanel";

const UPSTREAM_DISPLAY = "http://llapi.shiro.team";

type Values = Record<string, string>;

function defaultValues(fields?: { name: string; defaultValue?: string }[]): Values {
  if (!fields) return {};
  const v: Values = {};
  for (const f of fields) v[f.name] = f.defaultValue ?? "";
  return v;
}

export function Playground() {
  const [activeId, setActiveId] = useState<string>(ENDPOINTS[0].id);

  const active = useMemo<Endpoint>(
    () => ENDPOINTS.find((e) => e.id === activeId) ?? ENDPOINTS[0],
    [activeId],
  );

  // 每个 endpoint 一份独立状态
  const [pathState, setPathState] = useState<Record<string, Values>>(() => {
    const init: Record<string, Values> = {};
    for (const e of ENDPOINTS) init[e.id] = defaultValues(e.pathParams);
    return init;
  });
  const [queryState, setQueryState] = useState<Record<string, Values>>(() => {
    const init: Record<string, Values> = {};
    for (const e of ENDPOINTS) init[e.id] = defaultValues(e.queryParams);
    return init;
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [data, setData] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);
  const [requestUrl, setRequestUrl] = useState<string | null>(null);
  const [upstreamUrl, setUpstreamUrl] = useState<string | null>(null);

  const pathValues = pathState[active.id];
  const queryValues = queryState[active.id];

  function selectEndpoint(id: string) {
    setActiveId(id);
    setStatus(null);
    setDuration(null);
    setData(null);
    setError(null);
    setRequestUrl(null);
    setUpstreamUrl(null);
  }

  function updatePath(name: string, value: string) {
    setPathState((s) => ({ ...s, [active.id]: { ...s[active.id], [name]: value } }));
  }

  function updateQuery(name: string, value: string) {
    setQueryState((s) => ({ ...s, [active.id]: { ...s[active.id], [name]: value } }));
  }

  async function send() {
    // 校验必填
    for (const f of active.pathParams ?? []) {
      if (f.required && !(pathValues[f.name] ?? "").trim()) {
        setError(`必填参数 ${f.label} 不能为空`);
        setData(null);
        return;
      }
    }
    for (const f of active.queryParams ?? []) {
      if (f.required && !(queryValues[f.name] ?? "").trim()) {
        setError(`必填参数 ${f.label} 不能为空`);
        setData(null);
        return;
      }
    }

    const path = buildPath(active, pathValues);
    const query = buildQuery(active, queryValues);
    // 浏览器走同源代理 /api/v1/...，Edge Function 再转发到上游
    const browserUrl = `/api${path}${query}`;
    const realUrl = `${UPSTREAM_DISPLAY}${path}${query}`;

    setLoading(true);
    setError(null);
    setStatus(null);
    setDuration(null);
    setData(null);
    setRequestUrl(browserUrl);
    setUpstreamUrl(realUrl);

    const start = performance.now();
    try {
      const res = await fetch(browserUrl, { headers: { accept: "application/json" } });
      const ms = Math.round(performance.now() - start);
      setStatus(res.status);
      setDuration(ms);
      const text = await res.text();
      try {
        setData(text ? JSON.parse(text) : null);
      } catch {
        setData(text);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setDuration(Math.round(performance.now() - start));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
      {/* 左侧接口列表 */}
      <aside className="lg:sticky lg:top-6 lg:self-start">
        <div className="rounded-2xl border border-brand-100/70 bg-white/70 p-2 shadow-sm dark:border-brand-900/40 dark:bg-zinc-900/50">
          <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-brand-500 dark:text-brand-300">
            接口列表
          </div>
          <ul className="space-y-1">
            {ENDPOINTS.map((e) => {
              const isActive = e.id === activeId;
              return (
                <li key={e.id}>
                  <button
                    type="button"
                    onClick={() => selectEndpoint(e.id)}
                    className={
                      "group block w-full rounded-xl px-3 py-2 text-left transition " +
                      (isActive
                        ? "bg-gradient-to-r from-brand-500/15 to-brand-500/5 ring-1 ring-brand-300 dark:from-brand-500/25 dark:to-transparent dark:ring-brand-700"
                        : "hover:bg-brand-50/60 dark:hover:bg-zinc-900")
                    }
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={
                          "text-sm font-medium " +
                          (isActive
                            ? "text-brand-700 dark:text-brand-200"
                            : "text-zinc-800 dark:text-zinc-200")
                        }
                      >
                        {e.label}
                      </span>
                      <span className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[10px] text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                        {e.method}
                      </span>
                    </div>
                    <div className="mt-0.5 truncate font-mono text-[11px] text-zinc-500">
                      {e.pathTemplate}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>

      {/* 右侧主区域 */}
      <main className="space-y-5">
        <header className="rounded-2xl border border-brand-100/70 bg-white/70 p-5 shadow-sm dark:border-brand-900/40 dark:bg-zinc-900/50">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                {active.label}
              </h2>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                {active.description}
              </p>
            </div>
          </div>

          <div className="mt-5">
            <EndpointForm
              endpoint={active}
              pathValues={pathValues}
              queryValues={queryValues}
              onPathChange={updatePath}
              onQueryChange={updateQuery}
              onSubmit={send}
              loading={loading}
            />
          </div>
        </header>

        <section className="rounded-2xl border border-brand-100/70 bg-white/40 p-5 shadow-sm dark:border-brand-900/40 dark:bg-zinc-900/30">
          <ResultPanel
            endpoint={active}
            loading={loading}
            status={status}
            durationMs={duration}
            data={data}
            error={error}
            requestUrl={requestUrl}
            upstreamUrl={upstreamUrl}
          />
        </section>
      </main>
    </div>
  );
}
