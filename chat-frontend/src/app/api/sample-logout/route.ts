import { NextResponse } from "next/server"

import { SAMPLE_AUTH_COOKIE } from "@/lib/sample-auth"

export async function POST() {
  const response = NextResponse.json({ ok: true })
  response.cookies.set(SAMPLE_AUTH_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  })
  return response
}
