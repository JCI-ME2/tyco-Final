import { NextResponse } from "next/server"
import { getSessionUser } from "@/lib/chat/session"
import { getPresence, touchActivity } from "@/lib/chat/queries"

export async function POST() {
  const me = await getSessionUser()
  if (!me) return NextResponse.json({ error: "Not signed in." }, { status: 401 })

  await touchActivity(me)
  const presence = await getPresence(me)
  return NextResponse.json({ presence }, { headers: { "Cache-Control": "no-store" } })
}
