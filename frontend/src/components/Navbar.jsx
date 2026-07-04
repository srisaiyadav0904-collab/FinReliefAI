import { Link, useNavigate } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()

  const handleLogout = () => {
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="brand-block">
        <span className="brand-mark">F</span>
        <div>
          <h1>FinRelief AI</h1>
          <p>Debt Relief & Recovery</p>
        </div>
      </div>

      <div className="nav-links">
        <Link to="/dashboard">Dashboard</Link>
        <button type="button" className="ghost-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  )
}

export default Navbar
