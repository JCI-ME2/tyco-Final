"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

type Field = "current" | "next" | "confirm"

const FIELDS: { key: Field; label: string; autoComplete: string }[] = [
  { key: "current", label: "Current password", autoComplete: "current-password" },
  { key: "next", label: "New password", autoComplete: "new-password" },
  { key: "confirm", label: "Confirm new password", autoComplete: "new-password" },
]

export function ChangePasswordForm({ onSuccess }: { onSuccess?: () => void }) {
  const [values, setValues] = useState<Record<Field, string>>({ current: "", next: "", confirm: "" })
  const [shown, setShown] = useState<Record<Field, boolean>>({ current: false, next: false, confirm: false })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setSuccess("")
    setSubmitting(true)
    try {
      const response = await fetch("/api/chat/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: values.current,
          newPassword: values.next,
          confirmPassword: values.confirm,
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Unable to update password")
      setValues({ current: "", next: "", confirm: "" })
      setSuccess("Password changed successfully.")
      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update password")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {FIELDS.map((field) => (
        <div key={field.key} className="flex flex-col gap-2">
          <label htmlFor={`pw-${field.key}`} className="text-sm font-semibold text-foreground">
            {field.label}
          </label>
          <div className="relative">
            <input
              id={`pw-${field.key}`}
              type={shown[field.key] ? "text" : "password"}
              autoComplete={field.autoComplete}
              value={values[field.key]}
              onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
              minLength={field.key === "next" ? 4 : undefined}
              required
              className="h-12 w-full rounded-md border border-input bg-muted/40 pl-3 pr-16 text-sm outline-none focus-visible:ring-2 focus-visible:ring-jci-blue/40"
            />
            <button
              type="button"
              onClick={() => setShown((s) => ({ ...s, [field.key]: !s[field.key] }))}
              className="absolute inset-y-0 right-3 flex items-center text-sm font-medium text-jci-blue hover:underline"
              aria-label={`${shown[field.key] ? "Hide" : "Show"} ${field.label.toLowerCase()}`}
            >
              {shown[field.key] ? "Hide" : "Show"}
            </button>
          </div>
        </div>
      ))}

      {error && <p className="text-sm text-destructive">{error}</p>}
      {success && <p className="text-sm text-jci-teal">{success}</p>}

      <Button type="submit" disabled={submitting} className="h-12 w-full bg-jci-blue text-base font-semibold hover:bg-jci-blue/90">
        {submitting ? "Changing..." : "Change password"}
      </Button>
    </form>
  )
}
