import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register, saveAuth } from '../services/api';
import { TopNav } from './TopNav';
import { SubNav } from './SubNav';

function RegisterPage() {
    const navigate = useNavigate();

    const [nom, setNom] = useState('');
    const [email, setEmail] = useState('');
    const [motDePasse, setMotDePasse] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleRegister() {
        setError('');
        setLoading(true);

        try {
            const data = await register(nom, email, motDePasse);
            saveAuth(data);
            navigate('/my-tickets');
        } catch (err: any) {
            setError(err.message || 'Erreur inscription');
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <TopNav />
            <SubNav to="/client/login" />

            <div className="login-outer">
                <div className="login-card">
                    <div className="login-icon">👤</div>

                    <h2>Create account</h2>
                    <p className="lsub">Join Ticketeer to book railway tickets</p>

                    {error && <div className="err">{error}</div>}

                    <div className="fld">
                        <label>Full name</label>
                        <input
                            type="text"
                            placeholder="Jean Dupont"
                            value={nom}
                            onChange={(e) => setNom(e.target.value)}
                        />
                    </div>

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
                        />
                    </div>

                    <button className="btn-submit" onClick={handleRegister} disabled={loading}>
                        {loading ? 'Loading...' : 'Create account'}
                    </button>

                    <p className="rlink">
                        Already have an account?{' '}
                        <button onClick={() => navigate('/client/login')}>Login</button>
                    </p>
                </div>
            </div>
        </>
    );
}
export default RegisterPage;