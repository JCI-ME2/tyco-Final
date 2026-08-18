import { bigint, boolean, index, pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core"

export const chatUsers = pgTable("chat_users", {
  username: text("username").primaryKey(),
  // Default hash is bcrypt("1234") so new users start with the shared default password.
  passwordHash: text("password_hash")
    .notNull()
    .default("$2b$10$MzzM8Fepfv.E4.54fvWX.Ol/8vWd7LNUG8Zc4jMLzZP9zWQG9E17O"),
  presence: text("presence").notNull().default("Offline"),
  manualOffline: boolean("manual_offline").notNull().default(false),
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
