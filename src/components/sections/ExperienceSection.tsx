import type { Experience } from '../../types/domain'
import { ExperienceCard } from './ExperienceCard'

type Props = {
  experiences: Experience[]
}

export function ExperienceSection({ experiences }: Props) {
  return (
    <section id="experience" className="section-shell">
      <h3>Experience</h3>
      <p className="section-subtext">
        Each role includes queryable AI context - the real story behind the bullet points.
      </p>
      <div className="grid">
        {experiences.map((exp) => (
          <ExperienceCard key={exp.id} experience={exp} />
        ))}
      </div>
    </section>
  )
}

