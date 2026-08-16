"use client"

// Lightweight notification chime synthesized with the Web Audio API, so no
// audio asset is required. Produces a soft two-note "ding-dong" similar to
// Microsoft Teams / WhatsApp message alerts.

let audioContext: AudioContext | null = null

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null
  const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Ctor) return null
  if (!audioContext) audioContext = new Ctor()
  return audioContext
}

function playTone(ctx: AudioContext, frequency: number, startAt: number, duration: number, peak: number) {
  const oscillator = ctx.createOscillator()
  const gain = ctx.createGain()
  oscillator.type = "sine"
  oscillator.frequency.setValueAtTime(frequency, startAt)

  // Quick attack, smooth exponential decay for a soft bell-like tone.
  gain.gain.setValueAtTime(0.0001, startAt)
  gain.gain.exponentialRampToValueAtTime(peak, startAt + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration)

  oscillator.connect(gain)
  gain.connect(ctx.destination)
  oscillator.start(startAt)
  oscillator.stop(startAt + duration)
}

/** Play the incoming-message notification chime. Safe to call anytime. */
export function playNotificationSound() {
  try {
    const ctx = getContext()
    if (!ctx) return
    // Browsers may suspend the context until a user gesture; resume it first.
    if (ctx.state === "suspended") void ctx.resume()
    const now = ctx.currentTime
    // Two ascending notes (C6 -> G6) for a bright, recognizable alert.
    playTone(ctx, 1046.5, now, 0.18, 0.18)
    playTone(ctx, 1567.98, now + 0.14, 0.28, 0.16)
  } catch {
    // Never let audio failures affect the chat experience.
  }
}
