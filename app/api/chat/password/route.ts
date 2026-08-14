import { NextResponse } from "next/server"
import { z } from "zod"
import { getSessionUser } from "@/lib/chat/session"
import { changePassword } from "@/lib/chat/queries"

const schema = z
  .object({
    currentPassword: z.string().min(1).max(200),
    newPassword: z.string().min(4, "New password must be at least 4 characters.").max(200),
    confirmPassword: z.string().min(1).max(200),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "New password and confirmation do not match.",
    path: ["confirmPassword"],
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

  const parsed = schema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 400 },
    )
  }

  const result = await changePassword(me, parsed.data.currentPassword, parsed.data.newPassword)
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 })
  }
  return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } })
}
