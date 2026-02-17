import { useState } from 'react'
import type { GapWeakness } from '../../types/domain'

type Props = {
  value: GapWeakness[]
  onSave: (next: GapWeakness[]) => void
}

export function GapsForm({ value, onSave }: Props) {
  const [draft, setDraft] = useState<GapWeakness[]>(value)

  function update(index: number, patch: Partial<GapWeakness>) {
    setDraft((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)))
  }

  return (
    <section className="card">
      <h3>Gaps & Weaknesses</h3>
      {draft.map((gap, idx) => (
        <div key={gap.id} className="sub-card">
          <label>
            Description
            <input
              value={gap.description}
              onChange={(e) => update(idx, { description: e.target.value })}
            />
          </label>
          <label>
            Why this is a gap
            <textarea
              value={gap.whyItsAGap}
              onChange={(e) => update(idx, { whyItsAGap: e.target.value })}
            />
          </label>
        </div>
      ))}
      <button className="btn btn-primary" onClick={() => onSave(draft)}>
        Save Gaps
      </button>
    </section>
  )
}

