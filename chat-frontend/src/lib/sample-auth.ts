import { cookies } from "next/headers"

export const SAMPLE_EMAIL = "michael@sample.com"
export const SAMPLE_PASSWORD = "mike12345"
export const SAMPLE_AUTH_COOKIE = "mss-demo-session"

export type SampleUser = {
  name: string
  email: string
}

export async function getSampleSessionUser(): Promise<SampleUser | null> {
  const store = await cookies()
  const raw = store.get(SAMPLE_AUTH_COOKIE)?.value

  if (!raw) {
    return null
  }

  try {
    const parsed = JSON.parse(raw) as SampleUser
    if (parsed?.email === SAMPLE_EMAIL) {
      return parsed
    }
  } catch {
    return null
  }

  return null
}
