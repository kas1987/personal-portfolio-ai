import type { PublicPortfolioDTO } from '../../types/domain'

type Props = {
  profile: PublicPortfolioDTO['profile']
  onAskAI: () => void
}

export function HeroSection({ profile, onAskAI }: Props) {
  return (
    <section className="hero">
      <div className="status-badge">🟢 Open to {profile.targetTitles[0]} at {profile.targetCompanyStages[0]}</div>
      <h1 className="hero-title">{profile.fullName}</h1>
      <h2 className="hero-subtitle">{profile.title}</h2>
      <p className="hero-copy">{profile.elevatorPitch}</p>
      <div className="pill-row">
        {profile.targetCompanyStages.map((stage) => (
          <span key={stage} className="pill">
            {stage}
          </span>
        ))}
      </div>
      <button className="btn btn-primary" onClick={onAskAI}>
        Ask AI About Me <span className="new-badge">New</span>
      </button>
      <div className="scroll-cue">Scroll to explore ↓</div>
    </section>
  )
}

