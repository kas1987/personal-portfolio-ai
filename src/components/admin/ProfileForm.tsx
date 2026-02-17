import { useState } from 'react'
import type { CandidateProfile } from '../../types/domain'

type Props = {
  value: CandidateProfile
  onSave: (next: CandidateProfile) => void
}

export function ProfileForm({ value, onSave }: Props) {
  const [draft, setDraft] = useState<CandidateProfile>(value)

  function parseList(input: string): string[] {
    return input
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
  }

  return (
    <section className="card data-entry-card">
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
          Current Title
          <input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
        </label>
        <label>
          Target Titles (comma-separated)
          <input
            value={draft.targetTitles.join(', ')}
            onChange={(e) => setDraft({ ...draft, targetTitles: parseList(e.target.value) })}
          />
        </label>
        <label>
          Target Company Stages (comma-separated)
          <input
            value={draft.targetCompanyStages.join(', ')}
            onChange={(e) => setDraft({ ...draft, targetCompanyStages: parseList(e.target.value) })}
          />
        </label>
        <label>
          Location
          <input value={draft.location} onChange={(e) => setDraft({ ...draft, location: e.target.value })} />
        </label>
        <label>
          Remote Preference
          <input
            value={draft.remotePreference}
            onChange={(e) => setDraft({ ...draft, remotePreference: e.target.value })}
          />
        </label>
        <label>
          Availability Status + Date
          <input
            value={`${draft.availabilityStatus}${draft.availabilityDate ? ` (${draft.availabilityDate})` : ''}`}
            onChange={(e) => {
              const raw = e.target.value
              const dateMatch = raw.match(/\(([^)]+)\)\s*$/)
              setDraft({
                ...draft,
                availabilityStatus: raw.replace(/\s*\([^)]+\)\s*$/, '').trim(),
                availabilityDate: dateMatch ? dateMatch[1] : undefined,
              })
            }}
          />
        </label>
        <label>
          Salary Min
          <input
            type="number"
            value={draft.salaryMin || ''}
            onChange={(e) => setDraft({ ...draft, salaryMin: Number(e.target.value) || undefined })}
          />
        </label>
        <label>
          Salary Max
          <input
            type="number"
            value={draft.salaryMax || ''}
            onChange={(e) => setDraft({ ...draft, salaryMax: Number(e.target.value) || undefined })}
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
        <label>
          GitHub
          <input
            value={draft.socialLinks.github || ''}
            onChange={(e) =>
              setDraft({ ...draft, socialLinks: { ...draft.socialLinks, github: e.target.value } })
            }
          />
        </label>
        <label>
          Email
          <input
            value={draft.socialLinks.email || ''}
            onChange={(e) =>
              setDraft({ ...draft, socialLinks: { ...draft.socialLinks, email: e.target.value } })
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
      <label>
        What You're Known For
        <textarea value={draft.knownFor} onChange={(e) => setDraft({ ...draft, knownFor: e.target.value })} />
      </label>
      <label>
        What You're Looking For
        <textarea value={draft.lookingFor} onChange={(e) => setDraft({ ...draft, lookingFor: e.target.value })} />
      </label>
      <label>
        What You're Not Looking For
        <textarea
          value={draft.notLookingFor}
          onChange={(e) => setDraft({ ...draft, notLookingFor: e.target.value })}
        />
      </label>
      <label>
        Management Style
        <textarea
          value={draft.managementStyle || ''}
          onChange={(e) => setDraft({ ...draft, managementStyle: e.target.value })}
        />
      </label>
      <label>
        Work Style Preferences
        <textarea
          value={draft.workStylePreferences || ''}
          onChange={(e) => setDraft({ ...draft, workStylePreferences: e.target.value })}
        />
      </label>
      <button className="btn btn-primary" onClick={() => onSave(draft)}>
        Save Profile
      </button>
    </section>
  )
}

