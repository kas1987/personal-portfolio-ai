import { useState } from 'react'
import type { AIInstruction } from '../../types/domain'

type Props = {
  value: AIInstruction[]
  onSave: (next: AIInstruction[]) => void
}

export function InstructionsForm({ value, onSave }: Props) {
  const [draft, setDraft] = useState<AIInstruction[]>(value)

  function update(index: number, patch: Partial<AIInstruction>) {
    setDraft((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)))
  }

  return (
    <section className="card">
      <h3>AI Instructions (Brutal Honesty Controls)</h3>
      {draft.map((instruction, idx) => (
        <div key={instruction.id} className="sub-card">
          <label>
            Type
            <select
              value={instruction.instructionType}
              onChange={(e) =>
                update(idx, {
                  instructionType: e.target.value as AIInstruction['instructionType'],
                })
              }
            >
              <option value="honesty">Honesty</option>
              <option value="tone">Tone</option>
              <option value="boundaries">Boundaries</option>
            </select>
          </label>
          <label>
            Instruction
            <textarea
              value={instruction.instruction}
              onChange={(e) => update(idx, { instruction: e.target.value })}
            />
          </label>
          <label>
            Priority
            <input
              type="number"
              value={instruction.priority}
              onChange={(e) => update(idx, { priority: Number(e.target.value) || 0 })}
            />
          </label>
        </div>
      ))}
      <button className="btn btn-primary" onClick={() => onSave(draft)}>
        Save Instructions
      </button>
    </section>
  )
}

