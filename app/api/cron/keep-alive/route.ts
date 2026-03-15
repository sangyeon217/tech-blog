import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const now = new Date().toISOString();
    await kv.set("system:last_ping", now);

    return NextResponse.json({ success: true, message: "KV is now awake", timestamp: now });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
