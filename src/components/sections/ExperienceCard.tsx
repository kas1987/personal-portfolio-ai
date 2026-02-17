import { useState } from 'react'
import type { Experience } from '../../types/domain'

type Props = {
  experience: Experience
}

export function ExperienceCard({ experience }: Props) {
  const [expanded, setExpanded] = useState(false)

  return (
    <article className="card experience-card">
      <div className="card-header">
        <strong>{experience.companyName}</strong>
        <span className="muted">{experience.dateRange}</span>
      </div>
      <div>{experience.title}</div>
      <ul>
        {experience.bulletPoints.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
      <button className="btn btn-secondary" onClick={() => setExpanded((v) => !v)}>
        {expanded ? 'Hide AI Context' : '✨ Show AI Context'}
      </button>
      {expanded && (
        <div className="context-panel">
          <p>
            <strong>Situation:</strong> {experience.aiContext.situation}
          </p>
          <p>
            <strong>Approach:</strong> {experience.aiContext.approach}
          </p>
          <p>
            <strong>Technical Work:</strong> {experience.aiContext.technicalWork}
          </p>
          <p>
            <strong>Lessons Learned:</strong> <em>{experience.aiContext.lessonsLearned}</em>
          </p>
        </div>
      )}
    </article>
  )
}

