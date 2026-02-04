import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus } from 'lucide-react';

const AuthButtons = () => {
    const navigate = useNavigate();

    return (
        <div className="auth-buttons-group" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button
                className="btn btn-text"
                onClick={() => navigate('/login')}
                style={{ color: 'var(--color-primary)', fontWeight: '600' }}
            >
                <LogIn size={18} style={{ marginRight: '0.5rem' }} />
                Sign In
            </button>
            <button
                className="btn btn-primary"
                onClick={() => navigate('/signup')}
                style={{ borderRadius: '999px', padding: '0.5rem 1.5rem' }}
            >
                <UserPlus size={18} style={{ marginRight: '0.5rem' }} />
                Get Started
            </button>
        </div>
    );
};

export default AuthButtons;
