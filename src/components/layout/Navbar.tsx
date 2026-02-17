import { Link, NavLink } from 'react-router-dom'

type Props = {
  onAskAI?: () => void
}

export function Navbar({ onAskAI }: Props) {
  return (
    <header className="navbar">
      <Link to="/" className="brand">
        KS
      </Link>
      <nav className="nav-links">
        <a href="#experience" className="nav-link">
          Experience
        </a>
        <a href="#fit-check" className="nav-link">
          Fit Check
        </a>
        <NavLink to="/admin" className="nav-link">
          Admin
        </NavLink>
      </nav>
      <button className="btn btn-primary" onClick={onAskAI}>
        Ask AI <span className="new-badge">New</span>
      </button>
    </header>
  )
}

