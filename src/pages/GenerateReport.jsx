import React, { useState, useMemo } from 'react';
import { useReport } from '../context/ReportContext';
import { Upload, FileText, CheckCircle, AlertTriangle, BarChart2, Download, RefreshCcw } from 'lucide-react';
import './GenerateReport.css';
import '../components/Select.css';

import { sampleCSV } from '../data/sampleReport';

const GenerateReport = () => {
    const {
        poiData: data, setPoiData: setData,
        poiFile: file, setPoiFile: setFile,
        poiFilters: filters, setPoiFilters: setFilters,
        resetPoiData
    } = useReport();
    const [loading, setLoading] = useState(false);

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
        setTimeout(() => {
            parseCSV(sampleCSV);
        }, 500);
    };

    const parseCSV = (csvText) => {
        const lines = csvText.split('\n');
        if (lines.length === 0) return;

        const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
        const parsedData = [];

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            const values = [];
            let current = '';
            let inQuotes = false;

            for (let char of line) {
                if (char === '"') {
                    inQuotes = !inQuotes;
                } else if (char === ',' && !inQuotes) {
                    values.push(current.trim());
                    current = '';
                } else {
                    current += char;
                }
            }
            values.push(current.trim());

            const row = {};
            headers.forEach((header, index) => {
                row[header] = values[index] || '';
            });
            parsedData.push(row);
        }

        setData(parsedData);
        setLoading(false);
    };

    const standardData = data.filter(item => {
        const routeName = item['Route Name'] || '';
        return !routeName.includes('CR') && !routeName.includes('ERC');
    });

    const commercialData = data.filter(item => {
        const routeName = item['Route Name'] || '';
        return routeName.includes('CR') || routeName.includes('ERC');
    });

    const uniqueZones = [...new Set(standardData.map(item => item['Zone & Circle']))].sort();

    const availableWardsData = filters.zone
        ? standardData.filter(item => item['Zone & Circle'] === filters.zone)
        : standardData;
    const uniqueWards = [...new Set(availableWardsData.map(item => item['Ward Name']))].sort();

    const filteredStandardData = standardData.filter(item => {
        return (filters.zone === '' || item['Zone & Circle'] === filters.zone) &&
            (filters.ward === '' || item['Ward Name'] === filters.ward);
    });

    const filteredCommercialData = commercialData.filter(item => {
        return (filters.zone === '' || item['Zone & Circle'] === filters.zone) &&
            (filters.ward === '' || item['Ward Name'] === filters.ward);
    });

    const summary = useMemo(() => {
        if (!data.length) return null;

        const totalRoutes = filteredStandardData.length;
        let totalCovered = 0;
        let totalTarget = 0;
        const lowCoverage = filteredStandardData.filter(r => parseFloat(r['Coverage']) < 50).length;
        const zonesSummary = {};

        filteredStandardData.forEach(row => {
            totalCovered += parseFloat(row['Covered'] || 0);
            totalTarget += parseFloat(row['Total'] || 0);

            const zone = row['Zone & Circle'] || 'Unknown';
            if (!zonesSummary[zone]) zonesSummary[zone] = { total: 0, covered: 0, count: 0 };
            zonesSummary[zone].total += parseFloat(row['Total'] || 0);
            zonesSummary[zone].covered += parseFloat(row['Covered'] || 0);
            zonesSummary[zone].count += 1;
        });

        const avgCoverage = totalTarget ? ((totalCovered / totalTarget) * 100).toFixed(2) : 0;
        const unassignedCount = [...filteredStandardData, ...filteredCommercialData].filter(r => !r['Vehicle Number'] || String(r['Vehicle Number']).trim() === '').length;

        const allVehicles = [...filteredStandardData, ...filteredCommercialData]
            .map(r => String(r['Vehicle Number'] || '').trim())
            .filter(v => v !== '');
        const vehicleCounts = {};
        allVehicles.forEach(v => {
            vehicleCounts[v] = (vehicleCounts[v] || 0) + 1;
        });
        const duplicateVehicles = Object.keys(vehicleCounts).filter(v => vehicleCounts[v] > 1);

        const standardVehicles = filteredStandardData
            .map(r => String(r['Vehicle Number'] || '').trim())
            .filter(v => v !== '');
        const commercialVehicles = filteredCommercialData
            .map(r => String(r['Vehicle Number'] || '').trim())
            .filter(v => v !== '');

        const uniqueStandardVehicles = new Set(standardVehicles).size;
        const uniqueCommercialVehicles = new Set(commercialVehicles).size;

        return {
            totalRoutes,
            avgCoverage,
            lowCoverage,
            commercialCount: filteredCommercialData.length,
            unassignedCount,
            uniqueStandardVehicles,
            uniqueCommercialVehicles,
            duplicateVehicleCount: duplicateVehicles.length,
            duplicateVehicles,
            zones: zonesSummary
        };
    }, [filteredStandardData, filteredCommercialData]);

    const resetData = () => {
        resetPoiData();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && droppedFile.name.endsWith('.csv')) {
            setFile(droppedFile);
            setLoading(true);
            const reader = new FileReader();
            reader.onload = (event) => parseCSV(event.target.result);
            reader.readAsText(droppedFile);
        }
    };

    return (
        <div className="report-generator-container animate-fade">
            <h1 className="print-only" style={{ display: 'none' }}>
                Daily POI Coverage Analytics Report
                <div style={{ fontSize: '10pt', fontWeight: '400', marginTop: '5pt', color: '#64748b' }}>
                    Generated on: {new Date().toLocaleDateString('en-IN')} | Aligarh Municipal Corporation
                </div>
            </h1>
            <style>
                {`
                @media print {
                    @page {
                        size: A4 landscape !important;
                        margin: 1cm !important;
                    }
                }
                `}
            </style>
            <div className="header-section animate-slide no-print">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                        <h2>Generate POI Report</h2>
                        <p>Analyze and visualize your point-of-interest coverage data.</p>
                    </div>
                    {data.length > 0 && (
                        <button className="btn btn-outline no-print" onClick={resetData}>
                            <RefreshCcw size={16} /> New Analysis
                        </button>
                    )}
                </div>
            </div>

            {!data.length && (
                <div className="animate-scale">
                    <div
                        className="upload-box card"
                        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                        onDrop={handleDrop}
                        style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--color-border)' }}
                    >
                        <input
                            type="file"
                            accept=".csv"
                            id="csvUpload"
                            onChange={handleFileUpload}
                            hidden
                        />
                        <label htmlFor="csvUpload" className="upload-label" style={{ cursor: 'pointer', textAlign: 'center' }}>
                            <div className="upload-icon" style={{ marginBottom: '1.5rem', color: 'var(--color-primary)' }}>
                                <Upload size={56} />
                            </div>
                            <h3>Drag & Drop Report</h3>
                            <p style={{ color: 'var(--color-text-dim)', marginTop: '0.5rem' }}>or click to browse your files</p>
                            <div style={{ marginTop: '1.5rem', display: 'inline-block', padding: '0.5rem 1rem', background: 'var(--color-primary-soft)', color: 'var(--color-primary)', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '600' }}>
                                POI-Report.csv
                            </div>
                        </label>
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                        <button className="btn btn-text" onClick={handleLoadDemo} style={{ color: 'var(--color-primary)', fontWeight: '700' }}>
                            <FileText size={18} /> Load Demo: Aligarh POI (04-02-2026)
                        </button>
                    </div>
                </div>
            )}

            {data.length > 0 && (
                <div className="dashboard-content animate-slide">
                    <div className="summary-cards" style={{ marginBottom: '1.5rem' }}>
                        <div className="card summary-card" style={{ borderLeftColor: '#6366f1' }}>
                            <div className="icon-wrapper" style={{ background: '#eef2ff', color: '#6366f1' }}><FileText size={24} /></div>
                            <div className="card-info">
                                <span>Total Routes</span>
                                <h3>{summary.totalRoutes}</h3>
                            </div>
                        </div>

                        <div className="card summary-card" style={{ borderLeftColor: '#10b981' }}>
                            <div className="icon-wrapper" style={{ background: '#ecfdf5', color: '#10b981' }}><CheckCircle size={24} /></div>
                            <div className="card-info">
                                <span>Avg Coverage</span>
                                <h3>{summary.avgCoverage}%</h3>
                            </div>
                        </div>

                        <div className="card summary-card" style={{ borderLeftColor: '#f43f5e' }}>
                            <div className="icon-wrapper" style={{ background: '#fff1f2', color: '#f43f5e' }}><AlertTriangle size={24} /></div>
                            <div className="card-info">
                                <span>Low Coverage</span>
                                <h3>{summary.lowCoverage}</h3>
                            </div>
                        </div>

                        <div className="card summary-card" style={{ borderLeftColor: '#f59e0b' }}>
                            <div className="icon-wrapper" style={{ background: '#fffbeb', color: '#f59e0b' }}><BarChart2 size={24} /></div>
                            <div className="card-info">
                                <span>Commercial</span>
                                <h3>{summary.commercialCount}</h3>
                            </div>
                        </div>

                        {/* Additional Summary Cards restored */}
                        <div className="card summary-card" style={{ borderLeftColor: '#7c3aed' }}>
                            <div className="icon-wrapper" style={{ background: '#f5f3ff', color: '#7c3aed' }}><AlertTriangle size={24} /></div>
                            <div className="card-info">
                                <span>Unassigned</span>
                                <h3>{summary.unassignedCount}</h3>
                            </div>
                        </div>

                        <div className="card summary-card" style={{ borderLeftColor: '#1e40af' }}>
                            <div className="icon-wrapper" style={{ background: '#dbeafe', color: '#1e40af' }}><BarChart2 size={24} /></div>
                            <div className="card-info">
                                <span>Std Vehicles</span>
                                <h3>{summary.uniqueStandardVehicles}</h3>
                            </div>
                        </div>

                        <div className="card summary-card" style={{ borderLeftColor: '#ea580c' }}>
                            <div className="icon-wrapper" style={{ background: '#fff7ed', color: '#ea580c' }}><BarChart2 size={24} /></div>
                            <div className="card-info">
                                <span>Comm. Veh.</span>
                                <h3>{summary.uniqueCommercialVehicles}</h3>
                            </div>
                        </div>

                        <div className="card summary-card" style={{ borderLeftColor: '#d97706' }}>
                            <div className="icon-wrapper" style={{ background: '#fffbeb', color: '#d97706' }}><BarChart2 size={24} /></div>
                            <div className="card-info">
                                <span>Duplicates</span>
                                <h3>{summary.duplicateVehicleCount}</h3>
                            </div>
                        </div>
                    </div>

                    <div className="card" style={{ marginBottom: '2.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                            <div style={{ width: '4px', height: '20px', background: 'var(--grad-main)', borderRadius: '2px' }}></div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Zone Wise Performance</h3>
                        </div>
                        <div className="zone-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                            {Object.entries(summary.zones)
                                .sort(([a], [b]) => a.localeCompare(b))
                                .map(([zone, stats]) => (
                                    <div key={zone} style={{ padding: '1rem', background: '#f8fafc', borderRadius: '12px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                            <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>{zone}</span>
                                            <span style={{ fontWeight: '800', color: 'var(--color-primary)' }}>{((stats.covered / stats.total) * 100).toFixed(1)}%</span>
                                        </div>
                                        <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
                                            <div
                                                style={{
                                                    height: '100%',
                                                    background: 'var(--grad-main)',
                                                    width: `${(stats.covered / stats.total) * 100}%`,
                                                    borderRadius: '10px'
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>

                    <div className="card no-padding" style={{ padding: 0, overflow: 'hidden', marginBottom: '2.5rem' }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Detailed Coverage Report (Standard)</h3>
                            <div className="table-actions no-print" style={{ display: 'flex', gap: '1rem' }}>
                                <select
                                    className="select-input"
                                    value={filters.zone}
                                    onChange={(e) => setFilters({ ...filters, zone: e.target.value, ward: '' })}
                                    style={{ padding: '0.5rem 1rem', borderRadius: '8px' }}
                                >
                                    <option value="">All Zones</option>
                                    {uniqueZones.map(zone => <option key={zone} value={zone}>{zone}</option>)}
                                </select>
                                <select
                                    className="select-input"
                                    value={filters.ward}
                                    onChange={(e) => setFilters({ ...filters, ward: e.target.value })}
                                    style={{ padding: '0.5rem 1rem', borderRadius: '8px' }}
                                >
                                    <option value="">All Wards</option>
                                    {uniqueWards.map(ward => <option key={ward} value={ward}>{ward}</option>)}
                                </select>
                                <button className="btn btn-primary" onClick={() => window.print()} style={{ padding: '0.5rem 1.25rem' }}>
                                    <Download size={16} /> Export PDF
                                </button>
                            </div>
                        </div>
                        <div className="table-responsive">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th style={{ width: '60px', textAlign: 'center' }}>S.No</th>
                                        <th>Zone & Circle</th>
                                        <th>Ward Name</th>
                                        <th>Vehicle Number</th>
                                        <th>Route Name</th>
                                        <th style={{ textAlign: 'center' }}>Coverage</th>
                                        <th style={{ width: '80px', textAlign: 'center' }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredStandardData.map((row, index) => (
                                        <tr key={index}>
                                            <td style={{ textAlign: 'center', fontWeight: '600', color: 'var(--color-text-light)' }}>{index + 1}</td>
                                            <td style={{ fontWeight: '600' }}>{row['Zone & Circle']}</td>
                                            <td>{row['Ward Name']}</td>
                                            <td>
                                                <span style={{
                                                    padding: '0.25rem 0.5rem',
                                                    background: summary.duplicateVehicles.includes(String(row['Vehicle Number'] || '').trim()) ? '#fff1f2' : '#f1f5f9',
                                                    color: summary.duplicateVehicles.includes(String(row['Vehicle Number'] || '').trim()) ? '#e11d48' : '#475569',
                                                    borderRadius: '6px',
                                                    fontSize: '0.85rem',
                                                    fontWeight: '700'
                                                }}>
                                                    {row['Vehicle Number'] || 'N/A'}
                                                </span>
                                            </td>
                                            <td style={{ fontSize: '0.85rem' }}>{row['Route Name']}</td>
                                            <td style={{ textAlign: 'center' }}>
                                                <span style={{
                                                    fontWeight: '800',
                                                    color: parseFloat(row['Coverage']) >= 95 ? '#059669' : parseFloat(row['Coverage']) >= 80 ? '#d97706' : '#dc2626'
                                                }}>
                                                    {row['Coverage']}%
                                                </span>
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                <div style={{
                                                    width: '10px',
                                                    height: '10px',
                                                    borderRadius: '50%',
                                                    margin: '0 auto',
                                                    background: parseFloat(row['Coverage']) >= 95 ? '#10b981' : '#f59e0b',
                                                    boxShadow: `0 0 8px ${parseFloat(row['Coverage']) >= 95 ? '#10b981' : '#f59e0b'}`
                                                }}></div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Restored Commercial Routes Section */}
                    {filteredCommercialData.length > 0 && (
                        <div className="card no-padding animate-slide" style={{ padding: 0, overflow: 'hidden' }}>
                            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff7ed' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#ea580c' }}>Commercial Routes (CR & ERC)</h3>
                                <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#ea580c', background: '#ffedd5', padding: '0.25rem 0.75rem', borderRadius: '20px' }}>
                                    {filteredCommercialData.length} Routes
                                </div>
                            </div>
                            <div className="table-responsive">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th style={{ width: '60px', textAlign: 'center' }}>S.No</th>
                                            <th>Zone & Circle</th>
                                            <th>Ward Name</th>
                                            <th>Vehicle Number</th>
                                            <th>Route Name</th>
                                            <th style={{ textAlign: 'center' }}>Coverage</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredCommercialData.map((row, index) => (
                                            <tr key={index}>
                                                <td style={{ textAlign: 'center', fontWeight: '600', color: 'var(--color-text-light)' }}>{index + 1}</td>
                                                <td style={{ fontWeight: '600' }}>{row['Zone & Circle']}</td>
                                                <td>{row['Ward Name']}</td>
                                                <td>
                                                    <span style={{
                                                        padding: '0.25rem 0.5rem',
                                                        background: summary.duplicateVehicles.includes(String(row['Vehicle Number'] || '').trim()) ? '#fff1f2' : '#f8fafc',
                                                        color: summary.duplicateVehicles.includes(String(row['Vehicle Number'] || '').trim()) ? '#e11d48' : '#475569',
                                                        borderRadius: '6px',
                                                        fontSize: '0.85rem',
                                                        fontWeight: '700'
                                                    }}>
                                                        {row['Vehicle Number'] || 'N/A'}
                                                    </span>
                                                </td>
                                                <td style={{ fontSize: '0.85rem' }}>{row['Route Name']}</td>
                                                <td style={{ textAlign: 'center' }}>
                                                    <span style={{
                                                        fontWeight: '800',
                                                        color: parseFloat(row['Coverage']) >= 90 ? '#059669' : '#d97706'
                                                    }}>
                                                        {row['Coverage']}%
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default GenerateReport;
