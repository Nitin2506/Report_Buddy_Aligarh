import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';
import './Auth.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Prototype login: Any credentials work for now
        console.log('Login attempt:', { email, password });
        navigate('/');
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-logo">RB</div>
                    <h2>Welcome Back</h2>
                    <p>Enter your credentials to access your account</p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="auth-input-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="name@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="auth-input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div style={{ textAlign: 'right', marginTop: '-0.5rem' }}>
                        <a href="#" style={{ fontSize: '0.75rem', color: 'var(--color-primary)' }}>Forgot Password?</a>
                    </div>

                    <button type="submit" className="btn btn-primary auth-button">
                        <LogIn size={20} />
                        Sign In
                    </button>
                </form>

                <div className="auth-divider">
                    <span>or</span>
                </div>

                <div className="auth-footer">
                    Don't have an account? <Link to="/signup">Create account</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
