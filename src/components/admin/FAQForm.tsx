import { useState } from 'react'
import type { FAQResponse } from '../../types/domain'

type Props = {
  value: FAQResponse[]
  onSave: (next: FAQResponse[]) => void
}

export function FAQForm({ value, onSave }: Props) {
  const [draft, setDraft] = useState<FAQResponse[]>(value)

  function update(index: number, patch: Partial<FAQResponse>) {
    setDraft((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)))
  }

  return (
    <section className="card policy-card">
      <h3>FAQ / Common Questions</h3>
      {draft.map((faq, idx) => (
        <div key={faq.id} className="sub-card">
          <label>
            Question
            <input
              value={faq.question}
              onChange={(e) => update(idx, { question: e.target.value })}
            />
          </label>
          <label>
            Answer
            <textarea value={faq.answer} onChange={(e) => update(idx, { answer: e.target.value })} />
          </label>
          <label>
            Common Interview Question
            <input
              type="checkbox"
              checked={Boolean(faq.isCommonQuestion)}
              onChange={(e) => update(idx, { isCommonQuestion: e.target.checked })}
            />
          </label>
        </div>
      ))}
      <button className="btn btn-primary" onClick={() => onSave(draft)}>
        Save FAQ
      </button>
    </section>
  )
}

