import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import GenerateReport from './pages/GenerateReport';
import WasteSegregationReport from './pages/WasteSegregationReport';
import Placeholder from './pages/Placeholder';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Layout />}>
                <Route index element={<GenerateReport />} />
                <Route path="waste-segregation" element={<WasteSegregationReport />} />
                <Route path="other-reports" element={<Placeholder title="Other IMP Reports" />} />
                <Route path="history" element={<Placeholder title="History" />} />
                <Route path="settings" element={<Placeholder title="Settings" />} />
            </Route>
        </Routes>
    );
}

export default App;
