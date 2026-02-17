import { useState } from 'react'
import type { Experience } from '../../types/domain'

type Props = {
  value: Experience[]
  onSave: (next: Experience[]) => void
}

export function ExperienceForm({ value, onSave }: Props) {
  const [draft, setDraft] = useState<Experience[]>(value)

  function update(index: number, patch: Partial<Experience>) {
    setDraft((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)))
  }

  return (
    <section className="card">
      <h3>Experience Deep Dive</h3>
      {draft.map((exp, idx) => (
        <div key={exp.id} className="sub-card">
          <label>
            Company
            <input
              value={exp.companyName}
              onChange={(e) => update(idx, { companyName: e.target.value })}
            />
          </label>
          <label>
            Title
            <input value={exp.title} onChange={(e) => update(idx, { title: e.target.value })} />
          </label>
          <label>
            Date Range
            <input
              value={exp.dateRange}
              onChange={(e) => update(idx, { dateRange: e.target.value })}
            />
          </label>
          <label>
            Situation
            <textarea
              value={exp.aiContext.situation}
              onChange={(e) =>
                update(idx, { aiContext: { ...exp.aiContext, situation: e.target.value } })
              }
            />
          </label>
          <label>
            Lessons Learned
            <textarea
              value={exp.aiContext.lessonsLearned}
              onChange={(e) =>
                update(idx, { aiContext: { ...exp.aiContext, lessonsLearned: e.target.value } })
              }
            />
          </label>
        </div>
      ))}
      <button className="btn btn-primary" onClick={() => onSave(draft)}>
        Save Experiences
      </button>
    </section>
  )
}

