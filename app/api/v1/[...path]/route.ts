import { NextRequest } from "next/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";

const UPSTREAM = process.env.LOVELIVE_API_BASE ?? "http://llapi.shiro.team";
const UPSTREAM_ORIGIN = new URL(UPSTREAM).origin;

async function proxy(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  const search = req.nextUrl.search;
  const target = `${UPSTREAM}/v1/${path.join("/")}${search}`;

  try {
    const upstream = await fetch(target, {
      method: req.method,
      headers: { accept: req.headers.get("accept") ?? "application/json" },
      cache: "no-store",
    });

    const contentType = upstream.headers.get("content-type") ?? "application/octet-stream";
    const body = contentType.includes("application/json")
      ? rewriteJsonUrls(await upstream.text())
      : await upstream.arrayBuffer();

    return new Response(body, {
      status: upstream.status,
      headers: {
        "content-type": contentType,
        "cache-control": "no-store",
      },
    });
  } catch (err) {
    return Response.json(
      {
        error: {
          code: "PROXY_FAILED",
          message: err instanceof Error ? err.message : String(err),
        },
      },
      { status: 502 },
    );
  }
}

export const GET = proxy;

function rewriteJsonUrls(text: string): string {
  try {
    return JSON.stringify(rewriteValue(JSON.parse(text)));
  } catch {
    return text;
  }
}

function rewriteValue(value: unknown): unknown {
  if (typeof value === "string") return rewriteUrl(value);
  if (Array.isArray(value)) return value.map(rewriteValue);
  if (!value || typeof value !== "object") return value;

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([key, child]) => [key, rewriteValue(child)]),
  );
}

function rewriteUrl(value: string): string {
  if (!value.startsWith(`${UPSTREAM_ORIGIN}/v1/`)) return value;
  return `/api${value.slice(UPSTREAM_ORIGIN.length)}`;
}
