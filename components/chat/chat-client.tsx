"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Send, LogOut, KeyRound, Menu, X, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { LoginForm } from "./login-form"
import { EmojiPicker } from "./emoji-picker"
import { PresenceSelect } from "./presence-select"
import { ChangePasswordForm } from "./change-password-form"
import { presenceDotClass, type Contact, type ChatMessageDTO, type Presence } from "@/lib/chat/types"
import { playNotificationSound } from "@/lib/chat/notification-sound"

type ChatSession = { username: string; presence: Presence }
type ChatContact = Contact
type ChatMessage = ChatMessageDTO

const json = async (url: string, options?: RequestInit) => {
  const response = await fetch(url, options)
  const data = await response.json()
  if (!response.ok) throw new Error(data.error || "Request failed")
  return data
}

function Avatar({ username, presence }: { username: string; presence?: Presence }) {
  return <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-jci-blue text-sm font-semibold text-primary-foreground">
    {username.slice(0, 2).toUpperCase()}
    {presence && <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card ${presenceDotClass(presence)}`} aria-label={presence} />}
  </div>
}

export function ChatClient() {
  const router = useRouter()
  const [session, setSession] = useState<ChatSession | null | undefined>(undefined)
  const [contacts, setContacts] = useState<ChatContact[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [search, setSearch] = useState("")
  const [draft, setDraft] = useState("")
  const [mobileSidebar, setMobileSidebar] = useState(false)
  const [passwordOpen, setPasswordOpen] = useState(false)
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  // Baselines so the chime only fires on genuinely new incoming messages,
  // never when a conversation's existing history first loads.
  const lastMessageIdRef = useRef<number | null>(null)
  const totalUnreadRef = useRef<number | null>(null)
  const selectedRef = useRef<string | null>(null)

  const loadContacts = useCallback(async () => {
    const data = await json("/api/chat/contacts")
    const contacts: ChatContact[] = data.contacts
    // Play a sound when unread grows for conversations that aren't open.
    // The open conversation is excluded — it chimes via message polling.
    const totalUnread = contacts.reduce(
      (sum, contact) => (contact.username === selectedRef.current ? sum : sum + contact.unread),
      0,
    )
    if (totalUnreadRef.current !== null && totalUnread > totalUnreadRef.current) {
      playNotificationSound()
    }
    totalUnreadRef.current = totalUnread
    setContacts(contacts)
  }, [])

  useEffect(() => { selectedRef.current = selected }, [selected])
  useEffect(() => { json("/api/chat/session").then((data) => setSession(data.user ? { username: data.user, presence: data.presence } : null)).catch(() => setSession(null)) }, [])
  useEffect(() => { if (session) { loadContacts(); const id = window.setInterval(loadContacts, 15000); return () => window.clearInterval(id) } }, [session, loadContacts])
  useEffect(() => {
    if (selected && contacts.length > 0 && !contacts.some((contact) => contact.username === selected)) {
      setSelected(null)
      setMessages([])
    }
  }, [contacts, selected])
  useEffect(() => {
    if (!session || !selected || !contacts.some((contact) => contact.username === selected)) return
    // Reset the per-conversation baseline; the first load won't chime.
    lastMessageIdRef.current = null
    const load = async () => {
      try {
        const data = await json(`/api/chat/messages?peer=${encodeURIComponent(selected)}`)
        const incoming: ChatMessage[] = data.messages
        const latest = incoming[incoming.length - 1]
        if (
          latest &&
          lastMessageIdRef.current !== null &&
          latest.id > lastMessageIdRef.current &&
          latest.sender !== session.username
        ) {
          playNotificationSound()
        }
        if (latest) lastMessageIdRef.current = latest.id
        setMessages(incoming)
      } catch {
        // Keep the current conversation visible if a refresh request fails.
      }
    }
    void load()
    const id = window.setInterval(() => void load(), 4000)
    return () => window.clearInterval(id)
  }, [session, selected])
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }) }, [messages])
  useEffect(() => {
    if (!session) return
    const id = window.setInterval(() => { fetch("/api/chat/heartbeat", { method: "POST" }) }, 30000)
    return () => window.clearInterval(id)
  }, [session])

  const filteredContacts = useMemo(() => contacts.filter((contact) => contact.username.toLowerCase().includes(search.toLowerCase())), [contacts, search])
  const activeContact = contacts.find((contact) => contact.username === selected)

  if (session === undefined) return <div className="flex min-h-[100dvh] items-center justify-center bg-background"><MessageCircle className="h-8 w-8 animate-pulse text-jci-blue" /></div>
  if (!session) return <LoginForm onSuccess={(username) => setSession({ username, presence: "Available" })} />

  async function chooseContact(username: string) {
    setSelected(username)
    setMessages([])
    setMobileSidebar(false)
    try {
      const data = await json(`/api/chat/messages?peer=${encodeURIComponent(username)}`)
      setMessages(data.messages)
    } catch {
      setSelected(null)
    }
  }
  async function sendMessage() {
    if (!selected || !draft.trim() || sending) return
    setSending(true)
    try { const data = await json("/api/chat/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ recipient: selected, body: draft.trim() }) }); setMessages((current) => [...current, data.message]); setDraft("") } finally { setSending(false) }
  }
  async function logout() { await fetch("/api/chat/logout", { method: "POST" }); setSession(null); router.refresh() }

  return <div className="flex h-[100dvh] overflow-hidden bg-muted/30">
    <aside className={`${mobileSidebar ? "flex" : "hidden"} absolute inset-y-0 left-0 z-20 w-[min(88vw,360px)] flex-col border-r bg-card md:relative md:flex md:w-80`}>
      <div className="flex items-center justify-between border-b p-4"><div className="flex items-center gap-3"><Avatar username={session.username} presence={session.presence} /><div><p className="font-semibold">{session.username}</p><PresenceSelect value={session.presence} onChange={async (presence: Presence) => { await json("/api/chat/presence", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ presence }) }); setSession({ ...session, presence }); loadContacts() }} /></div></div><Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileSidebar(false)}><X /></Button></div>
      <div className="flex items-center gap-2 border-b p-3"><Search className="h-4 w-4 text-muted-foreground" /><Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search contacts" className="border-0 bg-transparent shadow-none focus-visible:ring-0" /></div>
      <div className="flex-1 overflow-y-auto">{filteredContacts.map((contact) => <button key={contact.username} onClick={() => chooseContact(contact.username)} className={`flex w-full items-center gap-3 border-b px-4 py-3 text-left transition-colors hover:bg-muted/70 ${selected === contact.username ? "bg-muted" : ""}`}><Avatar username={contact.username} presence={contact.presence} /><span className="min-w-0 flex-1 truncate text-sm font-medium">{contact.username}</span>{contact.unread > 0 && <span className="rounded-full bg-jci-teal px-2 py-0.5 text-xs font-semibold text-primary-foreground">{contact.unread}</span>}</button>)}</div>
      <div className="flex gap-2 border-t p-3"><Dialog open={passwordOpen} onOpenChange={setPasswordOpen}><DialogTrigger asChild><Button variant="outline" size="sm" className="flex-1"><KeyRound className="mr-2 h-4 w-4" />Password</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>Change password</DialogTitle></DialogHeader><ChangePasswordForm onSuccess={() => setPasswordOpen(false)} /></DialogContent></Dialog><Button variant="outline" size="sm" onClick={logout}><LogOut className="h-4 w-4" /></Button></div>
    </aside>
    <main className="flex min-w-0 flex-1 flex-col bg-background"><header className="flex items-center gap-3 border-b bg-card p-3 md:p-4"><Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileSidebar(true)}><Menu /></Button>{activeContact ? <><Avatar username={activeContact.username} presence={activeContact.presence} /><div><h1 className="font-semibold">{activeContact.username}</h1><p className="text-xs text-muted-foreground">{activeContact.presence}</p></div></> : <div><h1 className="font-semibold">Tyco Chat</h1><p className="text-xs text-muted-foreground">Select a contact to start a conversation</p></div>}</header><section className="flex flex-1 flex-col overflow-hidden">{selected ? <><div className="flex-1 overflow-y-auto p-4 md:p-6">{messages.length === 0 && <div className="flex h-full items-center justify-center text-sm text-muted-foreground">No messages yet. Say hello.</div>}{messages.map((message) => <div key={message.id} className={`mb-3 flex ${message.sender === session.username ? "justify-end" : "justify-start"}`}><div className={`max-w-[78%] rounded-2xl px-4 py-2 text-sm ${message.sender === session.username ? "rounded-br-sm bg-jci-blue text-primary-foreground" : "rounded-bl-sm bg-muted text-foreground"}`}><p className="whitespace-pre-wrap break-words">{message.body}</p><p className={`mt-1 text-[10px] ${message.sender === session.username ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p></div></div>)}<div ref={bottomRef} /></div><div className="border-t bg-card p-3"><div className="mx-auto flex max-w-4xl items-end gap-2"><EmojiPicker onSelect={(emoji) => setDraft((value) => value + emoji)} /><Textarea value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing && e.keyCode !== 229) { e.preventDefault(); sendMessage() } }} placeholder="Write a message..." rows={1} className="max-h-32 min-h-10 resize-none" /><Button onClick={sendMessage} disabled={!draft.trim() || sending} size="icon" className="h-10 w-10 shrink-0 bg-jci-blue"><Send className="h-4 w-4" /></Button></div></div></> : <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center"><div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-jci-blue/10 text-jci-blue"><MessageCircle className="h-8 w-8" /></div><h2 className="text-xl font-semibold">Your conversations</h2><p className="max-w-sm text-sm text-muted-foreground">Choose a contact from the sidebar to send a secure team message.</p></div>}</section></main>
  </div>
}

export default ChatClient
