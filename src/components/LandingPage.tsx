import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TopNav } from './TopNav';
import { getStoredUser } from '../services/api';

function LandingPage() {
  const navigate = useNavigate();

  function guard(path: string, role?: string) {
    const user = getStoredUser();
    const token = sessionStorage.getItem('tt');

    if (!user || !token) {
      navigate('/client/login');
      return;
    }

    if (role && (user.role || '').toUpperCase() !== role) {
      alert('Accès réservé : ' + role);
      return;
    }

    navigate(path);
  }

  return (
      <>
        <TopNav />

        <div className="home-wrap">
          <div className="home-grid">
            <div className="hcard" onClick={() => guard('/search')}>
              <div className="hcard-icon">⌕</div>
              <h3>Search a trip</h3>
              <p>Find and book railway tickets</p>
            </div>

            <div className="hcard" onClick={() => guard('/my-tickets')}>
              <div className="hcard-icon">▣</div>
              <h3>My tickets</h3>
              <p>View your purchased tickets</p>
            </div>

            <div className="hcard" onClick={() => navigate('/controller')}>
              <div className="hcard-icon">◇</div>
              <h3>Controller access</h3>
              <p>Validate passenger tickets</p>
            </div>

            <div className="hcard" onClick={() => guard('/admin', 'ADMIN')}>
              <div className="hcard-icon">☼</div>
              <h3>Admin dashboard</h3>
              <p>Manage system data</p>
            </div>
          </div>
        </div>
      </>
  );
}
export default LandingPage;