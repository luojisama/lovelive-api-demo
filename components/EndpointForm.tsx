"use client";

import { Send } from "lucide-react";
import type { Endpoint, Field } from "@/lib/endpoints";

type Values = Record<string, string>;

interface Props {
  endpoint: Endpoint;
  pathValues: Values;
  queryValues: Values;
  onPathChange: (name: string, value: string) => void;
  onQueryChange: (name: string, value: string) => void;
  onSubmit: () => void;
  loading: boolean;
}

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: Field;
  value: string;
  onChange: (v: string) => void;
}) {
  const baseClasses =
    "w-full rounded-lg border border-brand-100 bg-white/80 px-3 py-2 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-200 dark:border-brand-900/40 dark:bg-zinc-900/60 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-brand-500 dark:focus:ring-brand-900/50";

  if (field.type === "select" && field.options) {
    return (
      <select
        className={baseClasses}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {field.options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    );
  }

  return (
    <input
      type={field.type === "date" ? "date" : field.type === "number" ? "number" : "text"}
      className={baseClasses}
      value={value}
      placeholder={field.placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export function EndpointForm({
  endpoint,
  pathValues,
  queryValues,
  onPathChange,
  onQueryChange,
  onSubmit,
  loading,
}: Props) {
  const allFields = [...(endpoint.pathParams ?? []), ...(endpoint.queryParams ?? [])];

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="space-y-4"
    >
      {allFields.length === 0 ? (
        <p className="rounded-lg border border-dashed border-brand-200/60 bg-brand-50/40 px-4 py-3 text-xs text-brand-700 dark:border-brand-900/40 dark:bg-brand-950/30 dark:text-brand-200">
          此接口无需参数，直接发送请求即可。
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {endpoint.pathParams?.map((f) => (
            <label key={`path-${f.name}`} className="flex flex-col gap-1">
              <span className="flex items-center gap-1 text-xs font-medium text-zinc-700 dark:text-zinc-300">
                {f.label}
                {f.required && <span className="text-brand-500">*</span>}
                <span className="rounded bg-brand-100/70 px-1.5 py-0.5 font-mono text-[10px] text-brand-700 dark:bg-brand-900/40 dark:text-brand-200">
                  path
                </span>
              </span>
              <FieldInput
                field={f}
                value={pathValues[f.name] ?? ""}
                onChange={(v) => onPathChange(f.name, v)}
              />
              {f.hint && <span className="text-[11px] text-zinc-500">{f.hint}</span>}
            </label>
          ))}
          {endpoint.queryParams?.map((f) => (
            <label key={`query-${f.name}`} className="flex flex-col gap-1">
              <span className="flex items-center gap-1 text-xs font-medium text-zinc-700 dark:text-zinc-300">
                {f.label}
                {f.required && <span className="text-brand-500">*</span>}
                <span className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[10px] text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                  query
                </span>
              </span>
              <FieldInput
                field={f}
                value={queryValues[f.name] ?? ""}
                onChange={(v) => onQueryChange(f.name, v)}
              />
              {f.hint && <span className="text-[11px] text-zinc-500">{f.hint}</span>}
            </label>
          ))}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-500 to-brand-600 px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:from-brand-600 hover:to-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Send className="h-4 w-4" />
        {loading ? "请求中…" : "发送请求"}
      </button>
    </form>
  );
}
