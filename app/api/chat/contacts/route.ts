import { NextResponse } from "next/server"
import { getSessionUser } from "@/lib/chat/session"
import { getContacts, getPresence } from "@/lib/chat/queries"

export const dynamic = "force-dynamic"

export async function GET() {
  const me = await getSessionUser()
  if (!me) return NextResponse.json({ error: "Not signed in." }, { status: 401 })

  const [{ contacts, totalUnread }, myPresence] = await Promise.all([
    getContacts(me),
    getPresence(me),
  ])

  return NextResponse.json(
    { contacts, totalUnread, myPresence },
    { headers: { "Cache-Control": "no-store" } },
  )
}
