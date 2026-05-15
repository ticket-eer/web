import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, saveAuth } from '../services/api';
import { TopNav } from './TopNav';
import { SubNav } from './SubNav';

function ClientLoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setError('');
    setLoading(true);

    try {
      const data = await login(email, motDePasse);
      const user = saveAuth(data);

      const role = (user.role || 'CLIENT').toUpperCase();

      if (role === 'ADMIN') navigate('/admin');
      else if (role === 'CONTROLEUR') navigate('/controller/validate');
      else navigate('/my-tickets');
    } catch (err: any) {
      setError(err.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  }

  return (
      <>
        <TopNav />
        <SubNav />

        <div className="login-outer">
          <div className="login-card">
            <div className="login-icon">👤</div>

            <h2>Client login</h2>
            <p className="lsub">Login to access your tickets and dashboard</p>

            {error && <div className="err">{error}</div>}

            <div className="fld">
              <label>Email</label>
              <input
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="fld">
              <label>Password</label>
              <input
                  type="password"
                  placeholder="Enter your password"
                  value={motDePasse}
                  onChange={(e) => setMotDePasse(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleLogin();
                  }}
              />
            </div>

            <button className="btn-submit" onClick={handleLogin} disabled={loading}>
              {loading ? 'Loading...' : 'Login'}
            </button>

            <p className="rlink">
              Don&apos;t have an account?{' '}
              <button onClick={() => navigate('/register')}>Register</button>
            </p>

          </div>
        </div>
      </>
  );
}
export default ClientLoginPage;