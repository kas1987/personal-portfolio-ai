import { useState } from 'react'
import type { ValuesCultureFit } from '../../types/domain'

type Props = {
  value: ValuesCultureFit
  onSave: (next: ValuesCultureFit) => void
}

export function ValuesCultureForm({ value, onSave }: Props) {
  const [draft, setDraft] = useState<ValuesCultureFit>(value)

  function parseList(input: string): string[] {
    return input
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
  }

  return (
    <section className="card">
      <h3>Values & Culture Fit</h3>
      <label>
        Must-Haves (comma-separated)
        <input
          value={draft.mustHaves.join(', ')}
          onChange={(e) => setDraft({ ...draft, mustHaves: parseList(e.target.value) })}
        />
      </label>
      <label>
        Dealbreakers (comma-separated)
        <input
          value={draft.dealbreakers.join(', ')}
          onChange={(e) => setDraft({ ...draft, dealbreakers: parseList(e.target.value) })}
        />
      </label>
      <label>
        Team Size Preference
        <input
          value={draft.teamSizePreference}
          onChange={(e) => setDraft({ ...draft, teamSizePreference: e.target.value })}
        />
      </label>
      <label>
        Conflict Style
        <textarea
          value={draft.conflictStyle}
          onChange={(e) => setDraft({ ...draft, conflictStyle: e.target.value })}
        />
      </label>
      <label>
        Ambiguity Style
        <textarea
          value={draft.ambiguityStyle}
          onChange={(e) => setDraft({ ...draft, ambiguityStyle: e.target.value })}
        />
      </label>
      <label>
        Failure Style
        <textarea
          value={draft.failureStyle}
          onChange={(e) => setDraft({ ...draft, failureStyle: e.target.value })}
        />
      </label>
      <button className="btn btn-primary" onClick={() => onSave(draft)}>
        Save Values & Culture Fit
      </button>
    </section>
  )
}

