import { NextResponse } from "next/server"
import { getSessionUser } from "@/lib/chat/session"
import { isPresence, setPresence } from "@/lib/chat/queries"

export async function POST(request: Request) {
  const me = await getSessionUser()
  if (!me) return NextResponse.json({ error: "Not signed in." }, { status: 401 })

  let json: unknown
  try {
    json = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 })
  }

  const presence = (json as { presence?: unknown })?.presence
  if (!isPresence(presence)) {
    return NextResponse.json({ error: "Invalid presence value." }, { status: 400 })
  }

  await setPresence(me, presence)
  return NextResponse.json({ presence }, { headers: { "Cache-Control": "no-store" } })
}
