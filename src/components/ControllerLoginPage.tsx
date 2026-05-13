import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, saveAuth } from '../services/api';
import { TopNav } from './TopNav';
import { SubNav } from './SubNav';

function ControllerLoginPage() {
  const navigate = useNavigate();

  const [controllerId, setControllerId] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [error, setError] = useState('');

  async function handleLogin() {
    setError('');

    try {
      const data = await login(controllerId + '@ctrl.local', motDePasse);
      saveAuth(data);
    } catch {
      saveAuth({
        token: 'demo-controleur-token',
        user: {
          nom: controllerId,
          email: controllerId + '@ctrl.local',
          role: 'CONTROLEUR',
        },
      });
    }

    navigate('/controller/validate');
  }

  return (
      <>
        <TopNav />
        <SubNav />

        <div className="login-outer">
          <div className="login-card">
            <div className="login-icon">◇</div>

            <h2>Controller access</h2>
            <p className="lsub">Login to validate passenger tickets</p>

            {error && <div className="err">{error}</div>}

            <div className="fld">
              <label>Controller ID</label>
              <input
                  type="text"
                  placeholder="Enter your controller ID"
                  value={controllerId}
                  onChange={(e) => setControllerId(e.target.value)}
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

            <button className="btn-submit" onClick={handleLogin}>
              Login
            </button>

            <div className="demo-box">
              Demo: Use any controller ID and password to access the validation interface
            </div>
          </div>
        </div>
      </>
  );
}
export default ControllerLoginPage;