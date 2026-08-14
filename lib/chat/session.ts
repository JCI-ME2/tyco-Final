import "server-only"
import { cookies } from "next/headers"
import crypto from "crypto"

const COOKIE_NAME = "tyco_chat_session"

function secret() {
  return process.env.CHAT_SESSION_SECRET || process.env.DATABASE_URL || "tyco-chat-dev-secret"
}

function sign(value: string) {
  return crypto.createHmac("sha256", secret()).update(value).digest("base64url")
}

function serialize(username: string) {
  return `${encodeURIComponent(username)}.${sign(username)}`
}

function deserialize(raw: string | undefined): string | null {
  if (!raw) return null
  const idx = raw.lastIndexOf(".")
  if (idx <= 0) return null
  const encoded = raw.slice(0, idx)
  const sig = raw.slice(idx + 1)
  const username = decodeURIComponent(encoded)
  const expected = sign(username)
  // constant-time compare
  if (sig.length !== expected.length) return null
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null
  return username
}

const REMEMBER_MAX_AGE = 60 * 60 * 24 * 30 // 30 days

export async function getSessionUser(): Promise<string | null> {
  const store = await cookies()
  return deserialize(store.get(COOKIE_NAME)?.value)
}

export async function setSessionUser(username: string, remember: boolean) {
  const store = await cookies()
  store.set(COOKIE_NAME, serialize(username), {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "development" ? "none" : "lax",
    secure: true,
    path: "/",
    ...(remember ? { maxAge: REMEMBER_MAX_AGE } : {}),
  })
}

export async function clearSessionUser() {
  const store = await cookies()
  store.set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "development" ? "none" : "lax",
    secure: true,
    path: "/",
    maxAge: 0,
  })
}
