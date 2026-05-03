"use client";

import Image from "next/image";
import { Cake, CalendarRange, Disc3, ExternalLink, MapPin, Music2, Users } from "lucide-react";
import type { Character, EventItem, MusicItem } from "@/lib/types";

function formatBirthday(b?: string) {
  if (!b) return "";
  // 形如 1999-09-12，或 09-12
  const m = b.match(/^(?:(\d{4})-)?(\d{1,2})-(\d{1,2})$/);
  if (!m) return b;
  const [, , mo, d] = m;
  return `${Number(mo)} 月 ${Number(d)} 日`;
}

function formatDateTime(s?: string) {
  if (!s) return "";
  // 保留原始时区文本，格式化为 YYYY-MM-DD HH:mm
  const m = s.match(/^(\d{4}-\d{2}-\d{2})(?:[T ](\d{2}:\d{2}))?/);
  if (!m) return s;
  return m[2] ? `${m[1]} ${m[2]}` : m[1];
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
  const display =
    c.names?.zhHans || c.names?.ja || c.names?.en || c.id || "未知角色";
  const sub = c.names?.ja && c.names?.zhHans !== c.names?.ja ? c.names.ja : c.names?.en;
  const accent = c.themeColor && /^#[0-9a-fA-F]{3,8}$/.test(c.themeColor) ? c.themeColor : undefined;

  return (
    <div
      className="group relative overflow-hidden rounded-2xl border border-brand-100/70 bg-white/80 p-4 shadow-sm transition hover:shadow-md dark:border-brand-900/40 dark:bg-zinc-900/60"
      style={accent ? { borderLeft: `4px solid ${accent}` } : undefined}
    >
      <div className="flex gap-4">
        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full bg-brand-50 ring-2 ring-brand-100 dark:bg-zinc-800 dark:ring-brand-900/60">
          {c.avatarIconUrl || c.avatarUrl ? (
            // 使用 unoptimized 避免 next/image 远端域名校验
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
            {c.group && (
              <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200">
                <Users className="h-3 w-3" /> {c.group}
              </span>
            )}
            {c.birthday && (
              <span className="inline-flex items-center gap-1">
                <Cake className="h-3 w-3" /> {formatBirthday(c.birthday)}
              </span>
            )}
            {accent && (
              <span className="inline-flex items-center gap-1">
                <span
                  className="h-3 w-3 rounded-full ring-1 ring-black/10"
                  style={{ background: accent }}
                />
                <span className="font-mono">{accent}</span>
              </span>
            )}
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-zinc-500">
            <span className="font-mono">{c.id}</span>
            <ExtLink href={c.sourceUrl}>来源</ExtLink>
          </div>
        </div>
      </div>
    </div>
  );
}

export function EventCard({ e }: { e: EventItem }) {
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
            {e.series && (
              <span className="text-xs text-zinc-500">{e.series}</span>
            )}
          </div>
          <h3 className="mt-1 truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {e.title}
          </h3>
        </div>
      </div>
      <div className="mt-2 grid grid-cols-1 gap-1 text-xs text-zinc-600 dark:text-zinc-400 sm:grid-cols-2">
        {e.startAt && (
          <div className="inline-flex items-center gap-1">
            <CalendarRange className="h-3 w-3" />
            {formatDateTime(e.startAt)}
            {e.endAt ? ` ~ ${formatDateTime(e.endAt)}` : ""}
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
      <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-500">
        <span className="font-mono">{e.source ?? ""}</span>
        <ExtLink href={e.sourceUrl}>原始链接</ExtLink>
      </div>
    </div>
  );
}

export function MusicCard({ m }: { m: MusicItem }) {
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
            {m.series && <span>{m.series}</span>}
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
