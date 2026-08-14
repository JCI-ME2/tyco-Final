import { NextResponse } from "next/server"
import { z } from "zod"
import { getSessionUser } from "@/lib/chat/session"
import { getConversation, getPresence, markRead, sendMessage, userExists } from "@/lib/chat/queries"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const me = await getSessionUser()
  if (!me) return NextResponse.json({ error: "Not signed in." }, { status: 401 })

  const peer = new URL(request.url).searchParams.get("peer")
  // Degrade gracefully: an unknown/stale peer returns an empty conversation
  // instead of an error, so background polling never surfaces a runtime error.
  if (!peer || peer === me || !(await userExists(peer))) {
    return NextResponse.json(
      { messages: [], peerPresence: "Offline" },
      { headers: { "Cache-Control": "no-store" } },
    )
  }

  // Opening/refreshing a conversation marks incoming messages as read.
  await markRead(me, peer)
  const [messages, peerPresence] = await Promise.all([getConversation(me, peer), getPresence(peer)])

  return NextResponse.json(
    { messages, peerPresence },
    { headers: { "Cache-Control": "no-store" } },
  )
}

const sendSchema = z.object({
  recipient: z.string().min(1).max(120),
  body: z.string().trim().min(1, "Message cannot be empty.").max(4000),
})

export async function POST(request: Request) {
  const me = await getSessionUser()
  if (!me) return NextResponse.json({ error: "Not signed in." }, { status: 401 })

  let json: unknown
  try {
    json = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 })
  }

  const parsed = sendSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 400 },
    )
  }

  const { recipient, body } = parsed.data
  if (recipient === me || !(await userExists(recipient))) {
    return NextResponse.json({ error: "Unknown recipient." }, { status: 400 })
  }

  const message = await sendMessage(me, recipient, body)
  return NextResponse.json(
    {
      message: {
        id: message.id,
        sender: message.sender,
        recipient: message.recipient,
        body: message.body,
        createdAt: new Date(message.createdAt).toISOString(),
        read: false,
      },
    },
    { headers: { "Cache-Control": "no-store" } },
  )
}
