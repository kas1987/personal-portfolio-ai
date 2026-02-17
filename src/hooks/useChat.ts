import { useState } from 'react'
import type { CandidateContext, ChatMessage } from '../types/domain'
import { sendChatMessage } from '../lib/repository'

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function useChat(context: CandidateContext | undefined) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isSending, setIsSending] = useState(false)
  const sessionId = 'default-session'

  async function send(message: string) {
    if (!context || !message.trim()) return
    const userMsg: ChatMessage = {
      id: createId(),
      role: 'user',
      content: message.trim(),
      createdAt: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, userMsg])
    setIsSending(true)
    try {
      const reply = await sendChatMessage(message, sessionId, context)
      const assistantMsg: ChatMessage = {
        id: createId(),
        role: 'assistant',
        content: reply,
        createdAt: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, assistantMsg])
    } finally {
      setIsSending(false)
    }
  }

  return {
    messages,
    send,
    isSending,
  }
}

