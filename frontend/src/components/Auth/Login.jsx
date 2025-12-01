import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { auth } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [usePAT, setUsePAT] = useState(false);
  const [pat, setPat] = useState('');

  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) {
      setError('Authentication failed. Please try again.');
    }
  }, [searchParams]);

  const handleOAuthLogin = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await auth.getAuthUrl();
      window.location.href = response.data.authUrl;
    } catch (err) {
      setError('Failed to initialize authentication');
      setLoading(false);
    }
  };

  const handlePATLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login-pat`, {
        personalAccessToken: pat
      });
      login(response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid personal access token. Please check and try again.');
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backgroundColor: '#f5f5f5' }}>
      <div className="card" style={{ maxWidth: '500px', width: '100%' }}>
        <h1 style={{ marginBottom: '0.5rem', color: '#2563eb', textAlign: 'center' }}>Airtable Form Builder</h1>
        <p style={{ marginBottom: '2rem', color: '#6b7280', textAlign: 'center' }}>
          Connect your Airtable account to create dynamic forms
        </p>
        
        {error && (
          <div style={{ padding: '0.75rem', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '4px', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        {usePAT ? (
          <form onSubmit={handlePATLogin}>
            <div className="form-group">
              <label>Personal Access Token</label>
              <input
                type="password"
                className="form-control"
                value={pat}
                onChange={(e) => setPat(e.target.value)}
                placeholder="patXXX.XXXXXXXXXXXXXXXXXX"
                required
              />
            </div>

            <div style={{ backgroundColor: '#eff6ff', padding: '1rem', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.875rem' }}>
              <strong>How to create a Personal Access Token:</strong>
              <ol style={{ marginTop: '0.5rem', marginBottom: 0, paddingLeft: '1.5rem' }}>
                <li>Go to <a href="https://airtable.com/create/tokens" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb' }}>airtable.com/create/tokens</a></li>
                <li>Click "Create new token"</li>
                <li>Add these scopes:
                  <ul style={{ marginTop: '0.25rem' }}>
                    <li>data.records:read</li>
                    <li>data.records:write</li>
                    <li>schema.bases:read</li>
                  </ul>
                </li>
                <li>Add access to your bases</li>
                <li>Create token and copy it</li>
              </ol>
            </div>

            <button 
              type="submit"
              className="btn btn-primary" 
              disabled={loading}
              style={{ width: '100%', padding: '0.75rem', marginBottom: '0.5rem' }}
            >
              {loading ? 'Logging in...' : 'Login with Personal Access Token'}
            </button>

            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setUsePAT(false)}
              style={{ width: '100%', padding: '0.75rem' }}
            >
              Try OAuth Instead
            </button>
          </form>
        ) : (
          <>
            <button 
              className="btn btn-primary" 
              onClick={handleOAuthLogin}
              disabled={loading}
              style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem' }}
            >
              {loading ? 'Connecting...' : 'Login with Airtable OAuth'}
            </button>

            <button
              className="btn btn-outline"
              onClick={() => setUsePAT(true)}
              style={{ width: '100%', padding: '0.75rem' }}
            >
              Use Personal Access Token Instead
            </button>
          </>
        )}

        <p style={{ marginTop: '1.5rem', fontSize: '0.875rem', color: '#6b7280', textAlign: 'center' }}>
          By logging in, you agree to connect your Airtable account
        </p>
      </div>
    </div>
  );
}