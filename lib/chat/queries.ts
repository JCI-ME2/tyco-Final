import "server-only"
import { and, asc, desc, eq, gt, ne, sql } from "drizzle-orm"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { chatMessages, chatReads, chatUsers } from "@/lib/db/schema"

export const PRESENCE_VALUES = ["Available", "Busy", "Offline"] as const
export type Presence = (typeof PRESENCE_VALUES)[number]
export const OFFLINE_AFTER_MS = 5 * 60 * 1000

export function isPresence(v: unknown): v is Presence {
  return typeof v === "string" && (PRESENCE_VALUES as readonly string[]).includes(v)
}

export async function verifyCredentials(username: string, password: string) {
  const rows = await db.select().from(chatUsers).where(eq(chatUsers.username, username)).limit(1)
  const user = rows[0]
  if (!user) return false
  return bcrypt.compare(password, user.passwordHash)
}

export async function userExists(username: string) {
  const rows = await db
    .select({ username: chatUsers.username })
    .from(chatUsers)
    .where(eq(chatUsers.username, username))
    .limit(1)
  return rows.length > 0
}

/** Mark stale users offline based on last activity. */
export async function sweepOffline() {
  await db
    .update(chatUsers)
    .set({ presence: "Offline" })
    .where(
      and(
        ne(chatUsers.presence, "Offline"),
        sql`${chatUsers.updatedAt} < now() - interval '5 minutes'`,
      ),
    )
}

/** Explicitly set a presence value and bump activity. */
export async function setPresence(username: string, presence: Presence) {
  await db
    .update(chatUsers)
    .set({ presence, updatedAt: new Date() })
    .where(eq(chatUsers.username, username))
}

/**
 * Register activity: bumps last-activity timestamp. If the user had gone
 * Offline, activity revives them to Available. A manual Busy stays Busy.
 */
export async function touchActivity(username: string) {
  await db
    .update(chatUsers)
    .set({
      updatedAt: new Date(),
      presence: sql`CASE WHEN ${chatUsers.presence} = 'Offline' THEN 'Available' ELSE ${chatUsers.presence} END`,
    })
    .where(eq(chatUsers.username, username))
}

export async function getPresence(username: string): Promise<Presence> {
  const rows = await db
    .select({ presence: chatUsers.presence })
    .from(chatUsers)
    .where(eq(chatUsers.username, username))
    .limit(1)
  const p = rows[0]?.presence
  return isPresence(p) ? p : "Offline"
}

export async function changePassword(username: string, currentPassword: string, newPassword: string) {
  const rows = await db.select().from(chatUsers).where(eq(chatUsers.username, username)).limit(1)
  const user = rows[0]
  if (!user) return { ok: false as const, error: "User not found." }
  const valid = await bcrypt.compare(currentPassword, user.passwordHash)
  if (!valid) return { ok: false as const, error: "Current password is incorrect." }
  const hash = await bcrypt.hash(newPassword, 10)
  await db.update(chatUsers).set({ passwordHash: hash }).where(eq(chatUsers.username, username))
  return { ok: true as const }
}

export type Contact = {
  username: string
  presence: Presence
  unread: number
  lastMessageAt: string | null
}

/** Contacts (everyone except me) with live presence and unread counts. */
export async function getContacts(me: string): Promise<{ contacts: Contact[]; totalUnread: number }> {
  await sweepOffline()

  const users = await db
    .select({ username: chatUsers.username, presence: chatUsers.presence })
    .from(chatUsers)
    .where(ne(chatUsers.username, me))
    .orderBy(asc(chatUsers.username))

  // unread per sender: messages to me newer than my read-through for that sender
  const unreadRows = await db.execute(sql`
    SELECT m.sender AS peer, count(*)::int AS unread, max(m.created_at) AS last_at
    FROM chat_messages m
    LEFT JOIN chat_reads r ON r.reader = ${me} AND r.other_user = m.sender
    WHERE m.recipient = ${me}
      AND m.created_at > COALESCE(r.last_read_at, 'epoch'::timestamptz)
    GROUP BY m.sender
  `)

  // last message time per conversation (either direction) for sorting
  const lastRows = await db.execute(sql`
    SELECT peer, max(created_at) AS last_at FROM (
      SELECT recipient AS peer, created_at FROM chat_messages WHERE sender = ${me}
      UNION ALL
      SELECT sender AS peer, created_at FROM chat_messages WHERE recipient = ${me}
    ) t
    GROUP BY peer
  `)

  const unreadMap = new Map<string, number>()
  for (const row of unreadRows.rows as Array<{ peer: string; unread: number }>) {
    unreadMap.set(row.peer, Number(row.unread))
  }
  const lastMap = new Map<string, string>()
  for (const row of lastRows.rows as Array<{ peer: string; last_at: string | null }>) {
    if (row.last_at) lastMap.set(row.peer, new Date(row.last_at).toISOString())
  }

  let totalUnread = 0
  const contacts: Contact[] = users.map((u) => {
    const unread = unreadMap.get(u.username) ?? 0
    totalUnread += unread
    return {
      username: u.username,
      presence: isPresence(u.presence) ? u.presence : "Offline",
      unread,
      lastMessageAt: lastMap.get(u.username) ?? null,
    }
  })

  return { contacts, totalUnread }
}

export type ChatMessageDTO = {
  id: number
  sender: string
  recipient: string
  body: string
  createdAt: string
  read: boolean
}

/** Messages between me and peer, with read status for messages I sent. */
export async function getConversation(me: string, peer: string): Promise<ChatMessageDTO[]> {
  const rows = await db
    .select()
    .from(chatMessages)
    .where(
      sql`(${chatMessages.sender} = ${me} AND ${chatMessages.recipient} = ${peer})
        OR (${chatMessages.sender} = ${peer} AND ${chatMessages.recipient} = ${me})`,
    )
    .orderBy(asc(chatMessages.createdAt))

  // peer's read-through timestamp for messages I sent
  const peerRead = await db
    .select({ lastReadAt: chatReads.lastReadAt })
    .from(chatReads)
    .where(and(eq(chatReads.reader, peer), eq(chatReads.otherUser, me)))
    .limit(1)
  const peerReadAt = peerRead[0]?.lastReadAt ? new Date(peerRead[0].lastReadAt).getTime() : 0

  return rows.map((m) => ({
    id: m.id,
    sender: m.sender,
    recipient: m.recipient,
    body: m.body,
    createdAt: new Date(m.createdAt).toISOString(),
    read: m.sender === me ? new Date(m.createdAt).getTime() <= peerReadAt : true,
  }))
}

/** Mark conversation with peer as read up to now. */
export async function markRead(me: string, peer: string) {
  await db
    .insert(chatReads)
    .values({ reader: me, otherUser: peer, lastReadAt: new Date() })
    .onConflictDoUpdate({
      target: [chatReads.reader, chatReads.otherUser],
      set: { lastReadAt: new Date() },
    })
}

export async function sendMessage(me: string, recipient: string, body: string) {
  const rows = await db
    .insert(chatMessages)
    .values({ sender: me, recipient, body })
    .returning()
  return rows[0]
}

export { and, desc, eq, gt }
