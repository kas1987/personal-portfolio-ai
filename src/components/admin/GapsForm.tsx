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

  function parseList(input: string): string[] {
    return input
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
  }

  return (
    <section className="card risk-card">
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
          <label>
            Role Types That Are Bad Fit (comma-separated)
            <input
              value={(gap.roleTypesBadFit || []).join(', ')}
              onChange={(e) => update(idx, { roleTypesBadFit: parseList(e.target.value) })}
            />
          </label>
          <label>
            Work Environments To Avoid (comma-separated)
            <input
              value={(gap.environmentsToAvoid || []).join(', ')}
              onChange={(e) => update(idx, { environmentsToAvoid: parseList(e.target.value) })}
            />
          </label>
          <label>
            Past Feedback
            <textarea
              value={gap.pastFeedback || ''}
              onChange={(e) => update(idx, { pastFeedback: e.target.value })}
            />
          </label>
          <label>
            Improvement Areas (comma-separated)
            <input
              value={(gap.improvementAreas || []).join(', ')}
              onChange={(e) => update(idx, { improvementAreas: parseList(e.target.value) })}
            />
          </label>
          <label>
            No-Interest Areas (comma-separated)
            <input
              value={(gap.noInterestAreas || []).join(', ')}
              onChange={(e) => update(idx, { noInterestAreas: parseList(e.target.value) })}
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

