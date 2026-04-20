import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import GenerateReport from './pages/GenerateReport';
import WasteSegregationReport from './pages/WasteSegregationReport';
import WasteSegregationCompliance from './pages/WasteSegregationCompliance';
import BulkCollectionReport from './pages/BulkCollectionReport';
import DateWiseCoverageReport from './pages/DateWiseCoverageReport'; // Import the new component
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
                <Route path="waste-segregation-compliance" element={<WasteSegregationCompliance />} />
                <Route path="bulk-collection" element={<BulkCollectionReport />} />
                <Route path="other-reports" element={<Placeholder title="Other IMP Reports" />} />
                <Route path="date-wise-coverage" element={<DateWiseCoverageReport />} /> {/* Add the new route */}
                <Route path="history" element={<Placeholder title="History" />} />
                <Route path="settings" element={<Placeholder title="Settings" />} />
            </Route>
        </Routes>
    );
}

export default App;
