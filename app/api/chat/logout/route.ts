import { NextResponse } from "next/server"
import { clearSessionUser, getSessionUser } from "@/lib/chat/session"
import { setPresence } from "@/lib/chat/queries"

export async function POST() {
  const me = await getSessionUser()
  if (me) {
    await setPresence(me, "Offline")
  }
  await clearSessionUser()
  return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } })
}
