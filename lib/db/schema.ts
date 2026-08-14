import { bigint, index, pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core"

export const chatUsers = pgTable("chat_users", {
  username: text("username").primaryKey(),
  passwordHash: text("password_hash").notNull(),
  presence: text("presence").notNull().default("Offline"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
})

export const chatMessages = pgTable(
  "chat_messages",
  {
    id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
    sender: text("sender").notNull(),
    recipient: text("recipient").notNull(),
    body: text("body").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    pairIdx: index("idx_chat_messages_pair").on(t.sender, t.recipient, t.createdAt),
  }),
)

export const chatReads = pgTable(
  "chat_reads",
  {
    reader: text("reader").notNull(),
    otherUser: text("other_user").notNull(),
    lastReadAt: timestamp("last_read_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.reader, t.otherUser] }),
  }),
)

export type ChatUser = typeof chatUsers.$inferSelect
export type ChatMessage = typeof chatMessages.$inferSelect
