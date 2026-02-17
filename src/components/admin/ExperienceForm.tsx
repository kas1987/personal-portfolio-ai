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
    <section className="card data-entry-card">
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
            Title Progression
            <input
              value={exp.titleProgression || ''}
              onChange={(e) => update(idx, { titleProgression: e.target.value })}
            />
          </label>
          <label>
            Date Range
            <input
              value={exp.dateRange}
              onChange={(e) => update(idx, { dateRange: e.target.value })}
            />
          </label>
          <label>
            Start Date
            <input
              type="date"
              value={exp.startDate || ''}
              onChange={(e) => update(idx, { startDate: e.target.value || undefined })}
            />
          </label>
          <label>
            End Date
            <input
              type="date"
              value={exp.endDate || ''}
              onChange={(e) => update(idx, { endDate: e.target.value || undefined })}
            />
          </label>
          <label>
            Current Role
            <input
              type="checkbox"
              checked={Boolean(exp.isCurrent)}
              onChange={(e) => update(idx, { isCurrent: e.target.checked })}
            />
          </label>
          <label>
            Display Order
            <input
              type="number"
              value={exp.displayOrder ?? ''}
              onChange={(e) => update(idx, { displayOrder: Number(e.target.value) || undefined })}
            />
          </label>
          <label>
            Public Bullets (one per line)
            <textarea
              value={exp.bulletPoints.join('\n')}
              onChange={(e) =>
                update(idx, {
                  bulletPoints: e.target.value
                    .split('\n')
                    .map((item) => item.trim())
                    .filter(Boolean),
                })
              }
            />
          </label>
          <label>
            Why Joined
            <textarea
              value={exp.aiContext.whyJoined || ''}
              onChange={(e) =>
                update(idx, { aiContext: { ...exp.aiContext, whyJoined: e.target.value } })
              }
            />
          </label>
          <label>
            Why Left
            <textarea
              value={exp.aiContext.whyLeft || ''}
              onChange={(e) =>
                update(idx, { aiContext: { ...exp.aiContext, whyLeft: e.target.value } })
              }
            />
          </label>
          <label>
            Actual Contributions
            <textarea
              value={exp.aiContext.actualContributions || ''}
              onChange={(e) =>
                update(idx, { aiContext: { ...exp.aiContext, actualContributions: e.target.value } })
              }
            />
          </label>
          <label>
            Proudest Achievement
            <textarea
              value={exp.aiContext.proudestAchievement || ''}
              onChange={(e) =>
                update(idx, { aiContext: { ...exp.aiContext, proudestAchievement: e.target.value } })
              }
            />
          </label>
          <label>
            Would Do Differently
            <textarea
              value={exp.aiContext.wouldDoDifferently || ''}
              onChange={(e) =>
                update(idx, { aiContext: { ...exp.aiContext, wouldDoDifferently: e.target.value } })
              }
            />
          </label>
          <label>
            Challenges Faced
            <textarea
              value={exp.aiContext.challengesFaced || ''}
              onChange={(e) =>
                update(idx, { aiContext: { ...exp.aiContext, challengesFaced: e.target.value } })
              }
            />
          </label>
          <label>
            Conflicts/People Challenges
            <textarea
              value={exp.aiContext.conflictsOrChallenges || ''}
              onChange={(e) =>
                update(idx, { aiContext: { ...exp.aiContext, conflictsOrChallenges: e.target.value } })
              }
            />
          </label>
          <label>
            Quantified Impact
            <textarea
              value={exp.aiContext.quantifiedImpact || ''}
              onChange={(e) =>
                update(idx, { aiContext: { ...exp.aiContext, quantifiedImpact: e.target.value } })
              }
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
          <label>
            Manager Perspective
            <textarea
              value={exp.aiContext.managerWouldSay || ''}
              onChange={(e) =>
                update(idx, { aiContext: { ...exp.aiContext, managerWouldSay: e.target.value } })
              }
            />
          </label>
          <label>
            Reports Perspective
            <textarea
              value={exp.aiContext.reportsWouldSay || ''}
              onChange={(e) =>
                update(idx, { aiContext: { ...exp.aiContext, reportsWouldSay: e.target.value } })
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

