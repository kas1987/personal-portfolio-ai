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
        <a href="#experience">Experience</a>
        <a href="#fit-check">Fit Check</a>
        <NavLink to="/admin">Admin</NavLink>
      </nav>
      <button className="btn btn-primary" onClick={onAskAI}>
        Ask AI
      </button>
    </header>
  )
}

