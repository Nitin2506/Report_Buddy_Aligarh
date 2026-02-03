import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateReport from './pages/CreateReport';
import MyReports from './pages/MyReports';
import Templates from './pages/Templates';
import Preview from './pages/Preview';
import Settings from './pages/Settings'; // I'll create a dummy settings page

function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="create" element={<CreateReport />} />
                <Route path="reports" element={<MyReports />} />
                <Route path="templates" element={<Templates />} />
                <Route path="preview" element={<Preview />} />
                <Route path="settings" element={<Settings />} />
            </Route>
        </Routes>
    );
}
// Placeholder for Settings since I haven't created it yet
function Settings() {
    return (
        <div className="card" style={{ padding: '2rem' }}>
            <h2>Settings</h2>
            <p style={{ marginTop: '1rem', color: 'var(--color-text-secondary)' }}>
                User preferences and application settings would go here.
            </p>
        </div>
    );
}

export default App;
