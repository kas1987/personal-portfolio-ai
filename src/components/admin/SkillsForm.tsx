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

