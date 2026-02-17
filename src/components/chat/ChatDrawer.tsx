import { useState } from 'react'
import type { CandidateContext } from '../../types/domain'
import { useChat } from '../../hooks/useChat'
import { getSuggestedQuestions } from '../../lib/repository'

type Props = {
  open: boolean
  onClose: () => void
  context: CandidateContext | undefined
}

export function ChatDrawer({ open, onClose, context }: Props) {
  const [input, setInput] = useState('')
  const { messages, send, isSending } = useChat(context)

  if (!open) return null

  return (
    <aside className="chat-drawer">
      <div className="drawer-header">
        <strong>Ask AI</strong>
        <button className="btn btn-secondary" onClick={onClose}>
          Close
        </button>
      </div>

      <div className="suggestions">
        {getSuggestedQuestions().map((q) => (
          <button key={q} className="chip" onClick={() => setInput(q)}>
            {q}
          </button>
        ))}
      </div>

      <div className="chat-history">
        {messages.map((m) => (
          <div key={m.id} className={`msg ${m.role}`}>
            <strong>{m.role === 'user' ? 'You' : 'AI'}:</strong> {m.content}
          </div>
        ))}
      </div>

      <div className="chat-input-row">
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask a question..." />
        <button
          className="btn btn-primary"
          disabled={isSending || !input.trim()}
          onClick={async () => {
            await send(input)
            setInput('')
          }}
        >
          Send
        </button>
      </div>
    </aside>
  )
}

