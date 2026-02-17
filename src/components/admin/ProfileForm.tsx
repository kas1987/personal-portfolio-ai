import { useState } from 'react'
import type { CandidateProfile } from '../../types/domain'

type Props = {
  value: CandidateProfile
  onSave: (next: CandidateProfile) => void
}

export function ProfileForm({ value, onSave }: Props) {
  const [draft, setDraft] = useState<CandidateProfile>(value)

  return (
    <section className="card">
      <h3>Basic Profile</h3>
      <div className="form-grid">
        <label>
          Full Name
          <input
            value={draft.fullName}
            onChange={(e) => setDraft({ ...draft, fullName: e.target.value })}
          />
        </label>
        <label>
          Title
          <input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
        </label>
        <label>
          Availability Status
          <input
            value={draft.availabilityStatus}
            onChange={(e) => setDraft({ ...draft, availabilityStatus: e.target.value })}
          />
        </label>
        <label>
          LinkedIn
          <input
            value={draft.socialLinks.linkedin || ''}
            onChange={(e) =>
              setDraft({ ...draft, socialLinks: { ...draft.socialLinks, linkedin: e.target.value } })
            }
          />
        </label>
      </div>
      <label>
        Elevator Pitch
        <textarea
          value={draft.elevatorPitch}
          onChange={(e) => setDraft({ ...draft, elevatorPitch: e.target.value })}
        />
      </label>
      <label>
        Career Narrative
        <textarea
          value={draft.careerNarrative}
          onChange={(e) => setDraft({ ...draft, careerNarrative: e.target.value })}
        />
      </label>
      <button className="btn btn-primary" onClick={() => onSave(draft)}>
        Save Profile
      </button>
    </section>
  )
}

