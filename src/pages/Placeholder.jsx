import React from 'react';

const Placeholder = ({ title }) => {
    return (
        <div className="placeholder-container" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '60vh',
            color: 'var(--color-text-secondary)'
        }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{title}</h2>
            <p>This feature is coming soon.</p>
        </div>
    );
};

export default Placeholder;
