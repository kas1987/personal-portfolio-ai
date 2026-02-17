import { useState } from 'react'
import type { SkillItem } from '../../types/domain'

type Props = {
  value: SkillItem[]
  onSave: (next: SkillItem[]) => void
}

export function SkillsForm({ value, onSave }: Props) {
  const [draft, setDraft] = useState<SkillItem[]>(value)

  function update(index: number, patch: Partial<SkillItem>) {
    setDraft((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)))
  }

  return (
    <section className="card">
      <h3>Skills Self-Assessment</h3>
      {draft.map((skill, idx) => (
        <div key={skill.id} className="sub-card">
          <label>
            Skill
            <input
              value={skill.skillName}
              onChange={(e) => update(idx, { skillName: e.target.value })}
            />
          </label>
          <label>
            Category
            <select
              value={skill.category}
              onChange={(e) =>
                update(idx, { category: e.target.value as SkillItem['category'] })
              }
            >
              <option value="strong">Strong</option>
              <option value="moderate">Moderate</option>
              <option value="gap">Gap</option>
            </select>
          </label>
          <label>
            Self Rating (1-5)
            <input
              type="number"
              min={1}
              max={5}
              value={skill.selfRating}
              onChange={(e) => update(idx, { selfRating: Number(e.target.value) || 1 })}
            />
          </label>
          <label>
            Evidence
            <textarea value={skill.evidence} onChange={(e) => update(idx, { evidence: e.target.value })} />
          </label>
          <label>
            Years Experience
            <input
              type="number"
              step="0.5"
              value={skill.yearsExperience ?? ''}
              onChange={(e) => update(idx, { yearsExperience: Number(e.target.value) || undefined })}
            />
          </label>
          <label>
            Last Used
            <input
              value={skill.lastUsed || ''}
              onChange={(e) => update(idx, { lastUsed: e.target.value || undefined })}
            />
          </label>
          <label>
            Honest Notes
            <textarea
              value={skill.honestNotes}
              onChange={(e) => update(idx, { honestNotes: e.target.value })}
            />
          </label>
        </div>
      ))}
      <button className="btn btn-primary" onClick={() => onSave(draft)}>
        Save Skills
      </button>
    </section>
  )
}

