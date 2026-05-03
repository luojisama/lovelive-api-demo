import { NextRequest } from "next/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";

const UPSTREAM = process.env.LOVELIVE_API_BASE ?? "http://llapi.shiro.team";

async function proxy(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  const search = req.nextUrl.search;
  const target = `${UPSTREAM}/v1/${path.join("/")}${search}`;

  try {
    const upstream = await fetch(target, {
      method: req.method,
      headers: { accept: "application/json" },
      cache: "no-store",
    });

    const body = await upstream.text();
    return new Response(body, {
      status: upstream.status,
      headers: {
        "content-type": upstream.headers.get("content-type") ?? "application/json; charset=utf-8",
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
