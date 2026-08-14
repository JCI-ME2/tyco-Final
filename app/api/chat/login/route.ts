import { NextResponse } from "next/server"
import { z } from "zod"
import { setSessionUser } from "@/lib/chat/session"
import { setPresence, verifyCredentials } from "@/lib/chat/queries"

const schema = z.object({
  username: z.string().min(1).max(120),
  password: z.string().min(1).max(200),
  remember: z.boolean().optional().default(false),
})

export async function POST(request: Request) {
  let json: unknown
  try {
    json = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 })
  }

  const parsed = schema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: "Username and password are required." }, { status: 400 })
  }

  const { username, password, remember } = parsed.data
  const ok = await verifyCredentials(username, password)
  if (!ok) {
    return NextResponse.json({ error: "Invalid username or password." }, { status: 401 })
  }

  await setSessionUser(username, remember)
  await setPresence(username, "Available")

  return NextResponse.json(
    { username },
    { headers: { "Cache-Control": "no-store" } },
  )
}
