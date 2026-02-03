import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        // Verify mock credentials
        navigate('/');
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <div className="login-logo">RB</div>
                    <h1>Welcome Back</h1>
                    <p>Sign in to continue to Report Buddy</p>
                </div>

                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label className="input-label">Email Address</label>
                        <input
                            type="email"
                            className="input-field"
                            placeholder="name@university.edu"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">Password</label>
                        <input
                            type="password"
                            className="input-field"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <div className="forgot-password">
                            <a href="#">Forgot password?</a>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary login-btn">
                        Sign In
                    </button>
                </form>

                <div className="login-footer">
                    <p>Don't have an account? <a href="#">Register</a></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
