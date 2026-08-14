import { NextResponse } from "next/server"
import { getSessionUser } from "@/lib/chat/session"
import { getPresence, userExists } from "@/lib/chat/queries"

export const dynamic = "force-dynamic"

export async function GET() {
  const me = await getSessionUser()
  if (!me || !(await userExists(me))) {
    return NextResponse.json({ user: null }, { headers: { "Cache-Control": "no-store" } })
  }
  const presence = await getPresence(me)
  return NextResponse.json(
    { user: me, presence },
    { headers: { "Cache-Control": "no-store" } },
  )
}
