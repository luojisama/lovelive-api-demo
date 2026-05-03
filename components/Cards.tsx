"use client";

import Image from "next/image";
import { Cake, CalendarRange, Disc3, ExternalLink, MapPin, Music2, Users } from "lucide-react";
import type {
  Character,
  CharacterBirthday,
  EventItem,
  MusicItem,
} from "@/lib/types";

function formatBirthday(b?: Character["birthday"]): string {
  if (!b) return "";
  if (typeof b === "string") {
    // 兼容 "1999-09-12" 或 "09-12"
    const m = b.match(/^(?:(\d{4})-)?(\d{1,2})-(\d{1,2})$/);
    if (!m) return b;
    return `${Number(m[2])} 月 ${Number(m[3])} 日`;
  }
  const obj = b as CharacterBirthday;
  if (obj.text) return obj.text;
  if (typeof obj.month === "number" && typeof obj.day === "number") {
    return `${obj.month} 月 ${obj.day} 日`;
  }
  return "";
}

function formatDateTime(s?: string) {
  if (!s) return "";
  const m = s.match(/^(\d{4}-\d{2}-\d{2})(?:[T ](\d{2}:\d{2}))?/);
  if (!m) return s;
  return m[2] ? `${m[1]} ${m[2]}` : m[1];
}

function joinSeries(s?: string | string[]): string {
  if (!s) return "";
  return Array.isArray(s) ? s.join("、") : s;
}

function joinSources(srcs?: { name?: string; url?: string }[]): { name?: string; url?: string } | undefined {
  if (!srcs || srcs.length === 0) return undefined;
  return srcs[0];
}

function getAccent(c: Character): string | undefined {
  if (c.color?.hex && /^#[0-9a-fA-F]{3,8}$/.test(c.color.hex)) return c.color.hex;
  if (c.themeColor && /^#[0-9a-fA-F]{3,8}$/.test(c.themeColor)) return c.themeColor;
  return undefined;
}

function ExtLink({ href, children }: { href?: string; children: React.ReactNode }) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-xs text-brand-600 hover:underline dark:text-brand-300"
    >
      {children}
      <ExternalLink className="h-3 w-3" />
    </a>
  );
}

export function CharacterCard({ c }: { c: Character }) {
  const display = c.names?.zhHans || c.names?.ja || c.names?.en || c.id || "未知角色";
  const sub =
    c.names?.ja && c.names?.zhHans !== c.names?.ja
      ? c.names.ja
      : c.names?.en || c.names?.romaji;
  const accent = getAccent(c);
  const birthdayText = formatBirthday(c.birthday);
  const groupText = c.group || joinSeries(c.series);
  const fallbackSource = c.sourceUrl ?? joinSources(c.sources)?.url;

  return (
    <div
      className="group relative overflow-hidden rounded-2xl border border-brand-100/70 bg-white/80 p-4 shadow-sm transition hover:shadow-md dark:border-brand-900/40 dark:bg-zinc-900/60"
      style={accent ? { borderLeft: `4px solid ${accent}` } : undefined}
    >
      <div className="flex gap-4">
        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full bg-brand-50 ring-2 ring-brand-100 dark:bg-zinc-800 dark:ring-brand-900/60">
          {c.avatarIconUrl || c.avatarUrl ? (
            <Image
              src={c.avatarIconUrl || c.avatarUrl || ""}
              alt={display}
              fill
              sizes="64px"
              unoptimized
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xl text-brand-400">
              ♪
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="truncate text-base font-bold text-zinc-900 dark:text-zinc-100">
              {display}
            </span>
            {sub && <span className="truncate text-xs text-zinc-500">{sub}</span>}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
            {groupText && (
              <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200">
                <Users className="h-3 w-3" /> {groupText}
              </span>
            )}
            {birthdayText && (
              <span className="inline-flex items-center gap-1">
                <Cake className="h-3 w-3" /> {birthdayText}
              </span>
            )}
            {accent && (
              <span className="inline-flex items-center gap-1">
                <span
                  className="h-3 w-3 rounded-full ring-1 ring-black/10"
                  style={{ background: accent }}
                />
                <span className="font-mono">{c.color?.name ?? accent}</span>
              </span>
            )}
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-zinc-500">
            <span className="font-mono">{c.id}</span>
            <ExtLink href={fallbackSource}>来源</ExtLink>
          </div>
        </div>
      </div>
    </div>
  );
}

export function EventCard({ e }: { e: EventItem }) {
  const seriesText = joinSeries(e.series);
  const startText = formatDateTime(e.startAt);
  const endText = formatDateTime(e.endAt);

  return (
    <div className="rounded-2xl border border-brand-100/70 bg-white/80 p-4 shadow-sm transition hover:shadow-md dark:border-brand-900/40 dark:bg-zinc-900/60">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {e.category && (
              <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[11px] font-medium text-brand-700 dark:bg-brand-900/50 dark:text-brand-200">
                {e.category}
              </span>
            )}
            {seriesText && <span className="text-xs text-zinc-500">{seriesText}</span>}
          </div>
          <h3 className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {e.title}
          </h3>
        </div>
      </div>
      <div className="mt-2 grid grid-cols-1 gap-1 text-xs text-zinc-600 dark:text-zinc-400 sm:grid-cols-2">
        {startText && (
          <div className="inline-flex items-center gap-1">
            <CalendarRange className="h-3 w-3" />
            {startText}
            {endText ? ` ~ ${endText}` : ""}
            {e.timezone ? ` (${e.timezone})` : ""}
          </div>
        )}
        {e.venue && (
          <div className="inline-flex items-center gap-1">
            <MapPin className="h-3 w-3" /> {e.venue}
          </div>
        )}
      </div>
      {e.performers && e.performers.length > 0 && (
        <div className="mt-1 text-xs text-zinc-500">出演：{e.performers.join("、")}</div>
      )}
      {e.description && (
        <details className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">
          <summary className="cursor-pointer text-zinc-500 hover:text-brand-600 dark:hover:text-brand-300">
            活动说明
          </summary>
          <pre className="mt-1 whitespace-pre-wrap rounded-md bg-brand-50/60 p-2 font-sans text-[11px] text-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-300">
            {e.description}
          </pre>
        </details>
      )}
      <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-500">
        <span className="font-mono">{e.source ?? ""}</span>
        <ExtLink href={e.sourceUrl}>原始链接</ExtLink>
      </div>
    </div>
  );
}

export function MusicCard({ m }: { m: MusicItem }) {
  const seriesText = joinSeries(m.series);

  return (
    <div className="rounded-2xl border border-brand-100/70 bg-white/80 p-4 shadow-sm transition hover:shadow-md dark:border-brand-900/40 dark:bg-zinc-900/60">
      <div className="flex gap-4">
        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-brand-50 ring-1 ring-brand-100 dark:bg-zinc-800 dark:ring-brand-900/60">
          {m.coverUrl ? (
            <Image
              src={m.coverUrl}
              alt={m.title}
              fill
              sizes="80px"
              unoptimized
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-2xl text-brand-400">
              <Disc3 className="h-8 w-8" />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {m.title}
            </h3>
            {m.releaseDate && (
              <span className="font-mono text-[11px] text-zinc-500">{m.releaseDate}</span>
            )}
          </div>
          {m.artist && (
            <div className="mt-1 inline-flex items-center gap-1 text-xs text-zinc-600 dark:text-zinc-400">
              <Music2 className="h-3 w-3" /> {m.artist}
            </div>
          )}
          <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-zinc-500">
            {seriesText && <span>{seriesText}</span>}
            {m.albumTitle && (
              <span className="inline-flex items-center gap-1">
                <Disc3 className="h-3 w-3" />
                {m.albumTitle}
                {m.albumType ? `（${m.albumType}）` : ""}
              </span>
            )}
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-500">
            <span className="truncate font-mono">{m.id}</span>
            <ExtLink href={m.sourceUrl}>官方页</ExtLink>
          </div>
        </div>
      </div>
    </div>
  );
}
