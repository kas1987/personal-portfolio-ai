import type { PublicPortfolioDTO } from '../../types/domain'

type Props = {
  profile: PublicPortfolioDTO['profile']
}

export function Footer({ profile }: Props) {
  return (
    <footer className="footer">
      <div>
        <strong>{profile.fullName}</strong> · {profile.title}
      </div>
      <div className="footer-links">
        {profile.socialLinks.linkedin && (
          <a href={profile.socialLinks.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        )}
        {profile.socialLinks.github && (
          <a href={profile.socialLinks.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
        )}
        {profile.socialLinks.email && <a href={`mailto:${profile.socialLinks.email}`}>Email</a>}
      </div>
      <small>AI-queryable portfolio with honest-fit assessment</small>
    </footer>
  )
}

