import { ExternalLink, Github } from "lucide-react";
import { Playground } from "@/components/Playground";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Home() {
  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 via-brand-500 to-brand-700 text-lg font-bold text-white shadow-md">
            ♪
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              LoveLive 聚合 API
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              在线演示 · 在右侧自定义参数后点击发送即可
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="http://llapi.shiro.team/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-full border border-brand-200/70 bg-white/70 px-3 py-1.5 text-xs text-brand-700 shadow-sm hover:bg-brand-50 dark:border-brand-900/60 dark:bg-zinc-900/60 dark:text-brand-200 dark:hover:bg-zinc-900"
          >
            llapi.shiro.team
            <ExternalLink className="h-3 w-3" />
          </a>
          <a
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-brand-200/60 bg-white/70 text-zinc-700 shadow-sm hover:bg-brand-50 dark:border-brand-900/60 dark:bg-zinc-900/60 dark:text-zinc-200 dark:hover:bg-zinc-900"
          >
            <Github className="h-4 w-4" />
          </a>
          <ThemeToggle />
        </div>
      </header>

      <Playground />

      <footer className="mt-4 text-center text-xs text-zinc-500 dark:text-zinc-400">
        本站仅作 API 演示 · 数据来源：萌娘百科 / LoveLive 各企划官方页 / LL-CH ·
        <span className="mx-1">部署：Vercel + Cloudflare Workers</span>
      </footer>
    </div>
  );
}
