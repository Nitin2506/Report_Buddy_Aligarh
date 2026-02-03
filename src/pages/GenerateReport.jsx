import React, { useState, useMemo } from 'react';
import { Upload, FileText, CheckCircle, AlertTriangle, BarChart2, Download } from 'lucide-react';
import './GenerateReport.css';
import '../components/Select.css';


import { sampleCSV } from '../data/sampleReport';

const GenerateReport = () => {
    const [file, setFile] = useState(null);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({ zone: '', ward: '' });

    const handleFileUpload = (event) => {
        const uploadedFile = event.target.files[0];
        if (uploadedFile) {
            setFile(uploadedFile);
            setLoading(true);

            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target.result;
                parseCSV(text);
            };
            reader.readAsText(uploadedFile);
        }
    };

    const handleLoadDemo = () => {
        setLoading(true);
        // Simulate slight delay for effect
        setTimeout(() => {
            parseCSV(sampleCSV);
        }, 500);
    };

    const parseCSV = (csvText) => {
        const lines = csvText.split('\n');
        const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());

        const parsedData = [];

        for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;

            // Handle commas inside quotes if simple split fails, but acceptable for this specific simple CSV
            // A more robust regex split:
            const values = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || lines[i].split(',');

            const row = {};
            headers.forEach((header, index) => {
                let value = values[index] ? values[index].replace(/"/g, '').trim() : '';
                row[header] = value;
            });
            parsedData.push(row);
        }

        setData(parsedData);
        setLoading(false);
    };

    // Get unique zones and wards for filters
    const uniqueZones = [...new Set(data.map(item => item['Zone & Circle']))].sort();

    // Get wards based on selected zone
    const availableWardsData = filters.zone
        ? data.filter(item => item['Zone & Circle'] === filters.zone)
        : data;
    const uniqueWards = [...new Set(availableWardsData.map(item => item['Ward Name']))].sort();

    // Filter data based on selection
    const filteredData = data.filter(item => {
        return (filters.zone === '' || item['Zone & Circle'] === filters.zone) &&
            (filters.ward === '' || item['Ward Name'] === filters.ward);
    });

    // Calculate summary based on filtered data
    const summary = useMemo(() => {
        if (!filteredData.length) return null;

        const totalRoutes = filteredData.length;
        let totalCovered = 0;
        let totalTarget = 0;
        const lowCoverage = filteredData.filter(r => parseFloat(r['Coverage']) < 50).length;
        const zonesSummary = {};

        filteredData.forEach(row => {
            totalCovered += parseFloat(row['Covered'] || 0);
            totalTarget += parseFloat(row['Total'] || 0);

            const zone = row['Zone & Circle']?.split('-')[0] || 'Unknown';
            if (!zonesSummary[zone]) zonesSummary[zone] = { total: 0, covered: 0, count: 0 };
            zonesSummary[zone].total += parseFloat(row['Total'] || 0);
            zonesSummary[zone].covered += parseFloat(row['Covered'] || 0);
            zonesSummary[zone].count += 1;
        });

        const avgCoverage = totalTarget ? ((totalCovered / totalTarget) * 100).toFixed(2) : 0;

        return {
            totalRoutes,
            avgCoverage,
            lowCoverage,
            zones: zonesSummary
        };
    }, [filteredData]);

    return (
        <div className="report-generator-container">
            <div className="header-section">
                <h2>Generate POI Report</h2>
                <p>Upload your daily CSV report to view insights and summary.</p>
            </div>

            {/* Upload Section */}
            {!data.length && (
                <React.Fragment>
                    <div className="upload-box card">
                        <input
                            type="file"
                            accept=".csv"
                            id="csvUpload"
                            onChange={handleFileUpload}
                            hidden
                        />
                        <label htmlFor="csvUpload" className="upload-label">
                            <div className="upload-icon">
                                <Upload size={48} />
                            </div>
                            <h3>Click to upload CSV</h3>
                            <p>or drag and drop file here</p>
                            <span className="file-hint">Supports POI-Report exports</span>
                        </label>
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                        <button className="btn btn-text" onClick={handleLoadDemo} style={{ color: 'var(--color-primary)' }}>
                            Load Sample Data (POI 04-02-2026)
                        </button>
                    </div>
                </React.Fragment>
            )}

            {/* Report Dashboard */}
            {data.length > 0 && (
                <div className="dashboard-content">
                    {/* Summary Cards */}
                    <div className="summary-cards">
                        <div className="card summary-card">
                            <div className="icon-wrapper blue">
                                <FileText size={24} />
                            </div>
                            <div className="card-info">
                                <span>Total Routes</span>
                                <h3>{summary.totalRoutes}</h3>
                            </div>
                        </div>

                        <div className="card summary-card">
                            <div className="icon-wrapper green">
                                <CheckCircle size={24} />
                            </div>
                            <div className="card-info">
                                <span>Avg Coverage</span>
                                <h3>{summary.avgCoverage}%</h3>
                            </div>
                        </div>

                        <div className="card summary-card">
                            <div className="icon-wrapper red">
                                <AlertTriangle size={24} />
                            </div>
                            <div className="card-info">
                                <span>Low Coverage (&lt;50%)</span>
                                <h3>{summary.lowCoverage} Routes</h3>
                            </div>
                        </div>
                    </div>

                    {/* Zone Performance */}
                    <div className="card zone-performance">
                        <h3>Zone Performance</h3>
                        <div className="zone-grid">
                            {Object.entries(summary.zones).map(([zone, stats]) => (
                                <div key={zone} className="zone-item">
                                    <span className="zone-name">{zone}</span>
                                    <div className="progress-bar">
                                        <div
                                            className="progress-fill"
                                            style={{ width: `${(stats.covered / stats.total) * 100}%` }}
                                        ></div>
                                    </div>
                                    <span className="zone-stat">
                                        {((stats.covered / stats.total) * 100).toFixed(1)}%
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Data Table */}
                    <div className="card table-card">
                        <div className="table-header">
                            <h3>Detailed Report</h3>
                            <div className="table-actions" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <select
                                    className="select-input"
                                    value={filters.zone}
                                    onChange={(e) => setFilters({ ...filters, zone: e.target.value, ward: '' })}
                                >
                                    <option value="">All Zones</option>
                                    {uniqueZones.map(zone => (
                                        <option key={zone} value={zone}>{zone}</option>
                                    ))}
                                </select>
                                <select
                                    className="select-input"
                                    value={filters.ward}
                                    onChange={(e) => setFilters({ ...filters, ward: e.target.value })}
                                >
                                    <option value="">All Wards</option>
                                    {uniqueWards.map(ward => (
                                        <option key={ward} value={ward}>{ward}</option>
                                    ))}
                                </select>
                                <button className="btn btn-primary" onClick={() => window.print()}>
                                    <Download size={16} /> Export PDF
                                </button>
                            </div>
                        </div>
                        <div className="table-responsive">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Zone</th>
                                        <th>Ward</th>
                                        <th>Vehicle</th>
                                        <th>Route Name</th>
                                        <th>Total</th>
                                        <th>Covered</th>
                                        <th>Coverage</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.map((row, index) => (
                                        <tr key={index}>
                                            <td>{row['Zone & Circle']}</td>
                                            <td>{row['Ward Name']}</td>
                                            <td className="font-mono">{row['Vehicle Number']}</td>
                                            <td className="font-mono">{row['Route Name']}</td>
                                            <td>{row['Total']}</td>
                                            <td>{row['Covered']}</td>
                                            <td>
                                                <span className={`coverage-badge ${parseFloat(row['Coverage']) >= 90 ? 'high' : parseFloat(row['Coverage']) >= 80 ? 'medium' : 'low'}`}>
                                                    {row['Coverage']}%
                                                </span>
                                            </td>
                                            <td>
                                                {parseFloat(row['Coverage']) >= 95 ?
                                                    <span className="status-dot success"></span> :
                                                    <span className="status-dot warning"></span>
                                                }
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GenerateReport;
