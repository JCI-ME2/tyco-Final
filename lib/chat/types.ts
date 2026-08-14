export const PRESENCE_OPTIONS = ["Available", "Busy", "Offline"] as const
export type Presence = (typeof PRESENCE_OPTIONS)[number]

export type Contact = {
  username: string
  presence: Presence
  unread: number
  lastMessageAt: string | null
}

export type ChatMessageDTO = {
  id: number
  sender: string
  recipient: string
  body: string
  createdAt: string
  read: boolean
}

export function presenceDotClass(presence: Presence): string {
  switch (presence) {
    case "Available":
      return "bg-emerald-500"
    case "Busy":
      return "bg-amber-500"
    default:
      return "bg-muted-foreground/40"
  }
}

export function presenceLabelClass(presence: Presence): string {
  switch (presence) {
    case "Available":
      return "text-emerald-600"
    case "Busy":
      return "text-amber-600"
    default:
      return "text-muted-foreground"
  }
}

export function initials(name: string): string {
  const clean = name.replace(/@.*/, "")
  const parts = clean.split(/[.\s_-]+/).filter(Boolean)
  if (parts.length === 0) return "?"
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

export function displayName(name: string): string {
  return name.replace(/@.*/, "")
}
