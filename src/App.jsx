import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import GenerateReport from './pages/GenerateReport';
import Placeholder from './pages/Placeholder';

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<GenerateReport />} />
                <Route path="history" element={<Placeholder title="History" />} />
                <Route path="settings" element={<Placeholder title="Settings" />} />
            </Route>
        </Routes>
    );
}

export default App;
