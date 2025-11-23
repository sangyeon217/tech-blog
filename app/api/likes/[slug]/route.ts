import { kv } from "@vercel/kv";
import { NextRequest, NextResponse } from "next/server";

type Params = { slug: string };
type RouteContext = { params: Promise<Params> };

export const runtime = "edge";

function getClientIp(req: NextRequest) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "0.0.0.0"
  );
}

// Rate Limit 기능:
// - 같은 IP가 특정 시간(ttl초) 동안 요청할 수 있는 횟수를 limit으로 제한
// - 첫 요청이면 ttl 동안 만료 시간 설정
async function rateLimit(key: string, limit = 10, ttl = 60) {
  const count = await kv.incr(key);
  if (count === 1) {
    await kv.expire(key, ttl);
  }
  return count <= limit;
}

export async function GET(_req: NextRequest, { params }: RouteContext) {
  const { slug } = await params;

  try {
    const count = (await kv.get<number>(`likes:${slug}`)) ?? 0;
    return NextResponse.json({ count });
  } catch (error) {
    return NextResponse.json({ count: 0 }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: RouteContext) {
  const { slug } = await params;

  try {
    const ip = getClientIp(req);
    const ok = await rateLimit(`ratelimit:${slug}:${ip}`, 10, 60);
    if (!ok) {
      return new NextResponse("Too Many Requests", { status: 429 });
    }

    const newCount = await kv.incr(`likes:${slug}`);
    return NextResponse.json({ count: newCount });
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
