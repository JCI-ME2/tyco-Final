import type { Metadata } from "next"
import ChatClient from "@/components/chat/chat-client"

export const metadata: Metadata = {
  title: "Tyco Chat | Johnson Controls",
  description: "Secure team messaging for Johnson Controls.",
}

export default function ChatPage() {
  return <ChatClient />
}
