import { NextResponse } from "next/server"

import { SAMPLE_AUTH_COOKIE, SAMPLE_EMAIL, SAMPLE_PASSWORD } from "@/lib/sample-auth"

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const email = String(body?.email ?? "").trim().toLowerCase()
  const password = String(body?.password ?? "")

  if (email !== SAMPLE_EMAIL || password !== SAMPLE_PASSWORD) {
    return NextResponse.json(
      { error: "Invalid sample credentials. Use michael@sample.com / mike12345" },
      { status: 401 },
    )
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set(
    SAMPLE_AUTH_COOKIE,
    JSON.stringify({
      name: "Michael",
      email: SAMPLE_EMAIL,
    }),
    {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
    },
  )

  return response
}
