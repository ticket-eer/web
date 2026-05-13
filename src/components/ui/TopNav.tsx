import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getStoredUser, logout } from '../services/api';

export function TopNav() {
    const navigate = useNavigate();
    const user = getStoredUser();

    function handleLogout() {
        logout();
        navigate('/');
    }

    return (
        <nav className="topnav">
            <div className="brand" onClick={() => navigate('/')}>
                <h1>Ticketeer</h1>
                <p>Railway ticket generation and validation platform</p>
            </div>

            {!user ? (
                <button className="btn-nav-login" onClick={() => navigate('/client/login')}>
                    👤 Login
                </button>
            ) : (
                <div className="nav-user">
                    <span className="nav-username">{user.nom || user.email || 'User'}</span>
                    <span className="nav-role">{(user.role || 'CLIENT').toUpperCase()}</span>
                    <button className="btn-nav-out" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            )}
        </nav>
    );
}