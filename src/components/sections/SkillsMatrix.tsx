import type { SkillItem } from '../../types/domain'

type Props = {
  skills: SkillItem[]
}

function byCategory(skills: SkillItem[], category: SkillItem['category']) {
  return skills.filter((s) => s.category === category)
}

export function SkillsMatrix({ skills }: Props) {
  return (
    <section>
      <h3>Skills Matrix</h3>
      <div className="skill-matrix">
        <div className="card strong">
          <h4>Strong</h4>
          <ul>
            {byCategory(skills, 'strong').map((s) => (
              <li key={s.id}>{s.skillName}</li>
            ))}
          </ul>
        </div>
        <div className="card moderate">
          <h4>Moderate</h4>
          <ul>
            {byCategory(skills, 'moderate').map((s) => (
              <li key={s.id}>{s.skillName}</li>
            ))}
          </ul>
        </div>
        <div className="card gaps">
          <h4>Gaps</h4>
          <ul>
            {byCategory(skills, 'gap').map((s) => (
              <li key={s.id}>{s.skillName}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

