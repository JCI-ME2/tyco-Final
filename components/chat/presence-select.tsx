"use client"

import { PRESENCE_OPTIONS, presenceDotClass, type Presence } from "@/lib/chat/types"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function PresenceSelect({
  value,
  onChange,
}: {
  value: Presence
  onChange: (p: Presence) => void
}) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as Presence)}>
      <SelectTrigger className="h-8 w-[130px] border-none bg-primary-foreground/10 text-xs text-primary-foreground shadow-none focus:ring-1 focus:ring-primary-foreground/40">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {PRESENCE_OPTIONS.map((p) => (
          <SelectItem key={p} value={p}>
            <span className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${presenceDotClass(p)}`} aria-hidden />
              {p}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
