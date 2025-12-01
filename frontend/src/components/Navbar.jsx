import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/dashboard" style={{ textDecoration: 'none' }}>
          <h1>Airtable Form Builder</h1>
        </Link>
        <div className="navbar-actions">
          <span style={{ color: '#6b7280' }}>{user.email || 'User'}</span>
          <button className="btn btn-outline" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}