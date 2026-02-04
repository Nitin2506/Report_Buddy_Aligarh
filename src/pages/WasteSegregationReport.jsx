import React, { useState, useMemo } from 'react';
import { useReport } from '../context/ReportContext';
import { Upload, FileText, CheckCircle, BarChart2, Download, Trash2, RefreshCcw } from 'lucide-react';
import './GenerateReport.css';

const WasteSegregationReport = () => {
    const {
        iecData, setIecData,
        wasteData, setWasteData,
        resetWasteSegData
    } = useReport();
    const [loading, setLoading] = useState({ iec: false, waste: false });

    const parseCSV = (csvText, type) => {
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

        if (type === 'iec') {
            setIecData(parsedData);
            setLoading(prev => ({ ...prev, iec: false }));
        } else {
            setWasteData(parsedData);
            setLoading(prev => ({ ...prev, waste: false }));
        }
    };

    const handleFileUpload = (event, type) => {
        const uploadedFile = event.target.files[0];
        if (uploadedFile) {
            setLoading(prev => ({ ...prev, [type]: true }));
            const reader = new FileReader();
            reader.onload = (e) => {
                parseCSV(e.target.result, type);
            };
            reader.readAsText(uploadedFile);
        }
    };

    const iecSummary = useMemo(() => {
        if (iecData.length === 0) return null;

        const supervisorCounts = {};
        iecData.forEach(item => {
            const name = item['Supervisor Name'] || 'Unknown';
            if (name !== 'Unknown') {
                supervisorCounts[name] = (supervisorCounts[name] || 0) + 1;
            }
        });

        const supervisorStats = Object.entries(supervisorCounts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count);

        const uniqueWards = new Set(iecData.map(item => item['Ward'])).size;

        return {
            totalEntries: iecData.length,
            uniqueSupervisors: supervisorStats.length,
            uniqueWards,
            supervisorStats
        };
    }, [iecData]);

    const wasteSummary = useMemo(() => {
        if (wasteData.length === 0) return null;

        const supervisorCounts = {};
        wasteData.forEach(item => {
            const name = item['Supervisor Name'] || 'Unknown';
            if (name !== 'Unknown') {
                supervisorCounts[name] = (supervisorCounts[name] || 0) + 1;
            }
        });

        const supervisorStats = Object.entries(supervisorCounts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count);

        const uniqueWards = new Set(wasteData.map(item => item['Ward'])).size;

        return {
            totalEntries: wasteData.length,
            uniqueSupervisors: supervisorStats.length,
            uniqueWards,
            supervisorStats
        };
    }, [wasteData]);

    return (
        <div className="report-generator-container animate-fade">
            <h1 className="print-only" style={{ display: 'none' }}>
                IEC & Waste Segregation Analytics Report
                <div style={{ fontSize: '10pt', fontWeight: '400', marginTop: '5pt', color: '#64748b' }}>
                    Generated on: {new Date().toLocaleDateString('en-IN')} | Aligarh Municipal Corporation
                </div>
            </h1>
            <style>
                {`
                @media print {
                    @page {
                        size: A4 portrait !important;
                        margin: 1.5cm !important;
                    }
                }
                `}
            </style>

            <div className="header-section animate-slide no-print">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                        <h2>IEC & Waste Segregation</h2>
                        <p>Independent performance tracking for awareness campaigns and segregation compliance.</p>
                    </div>
                </div>
            </div>

            <div className="upload-grid no-print animate-scale" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
                {/* IEC Sector */}
                <div className="upload-section">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                        <div style={{ width: '4px', height: '20px', background: '#6366f1', borderRadius: '2px' }}></div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>1. IEC Report</h3>
                    </div>
                    {!iecData.length ? (
                        <div className="upload-box card" style={{ minHeight: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--color-border)' }}>
                            <input type="file" accept=".csv" id="iecUpload" onChange={(e) => handleFileUpload(e, 'iec')} hidden />
                            <label htmlFor="iecUpload" className="upload-label" style={{ cursor: 'pointer', textAlign: 'center' }}>
                                <div style={{ color: '#6366f1', marginBottom: '1rem' }}><Upload size={32} /></div>
                                <h4 style={{ fontSize: '1rem' }}>Upload IEC CSV</h4>
                                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)', marginTop: '0.25rem' }}>Campaign Execution Data</p>
                            </label>
                        </div>
                    ) : (
                        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #6366f1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div className="icon-wrapper" style={{ background: '#eef2ff', color: '#6366f1', width: '42px', height: '42px', borderRadius: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><CheckCircle size={20} /></div>
                                <div>
                                    <h4 style={{ fontSize: '0.95rem', fontWeight: '700' }}>Report Active</h4>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)' }}>{iecData.length} records</p>
                                </div>
                            </div>
                            <button className="btn btn-outline" onClick={() => resetWasteSegData('iec')} style={{ padding: '0.5rem', borderRadius: '8px', color: '#ef4444' }}>
                                <Trash2 size={16} />
                            </button>
                        </div>
                    )}
                </div>

                {/* Waste Segregation Sector */}
                <div className="upload-section">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                        <div style={{ width: '4px', height: '20px', background: '#8b5cf6', borderRadius: '2px' }}></div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>2. Segregation Report</h3>
                    </div>
                    {!wasteData.length ? (
                        <div className="upload-box card" style={{ minHeight: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--color-border)' }}>
                            <input type="file" accept=".csv" id="wasteUpload" onChange={(e) => handleFileUpload(e, 'waste')} hidden />
                            <label htmlFor="wasteUpload" className="upload-label" style={{ cursor: 'pointer', textAlign: 'center' }}>
                                <div style={{ color: '#8b5cf6', marginBottom: '1rem' }}><Upload size={32} /></div>
                                <h4 style={{ fontSize: '1rem' }}>Upload Waste CSV</h4>
                                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)', marginTop: '0.25rem' }}>Segregation Compliance Data</p>
                            </label>
                        </div>
                    ) : (
                        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #8b5cf6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div className="icon-wrapper" style={{ background: '#f5f3ff', color: '#8b5cf6', width: '42px', height: '42px', borderRadius: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><CheckCircle size={20} /></div>
                                <div>
                                    <h4 style={{ fontSize: '0.95rem', fontWeight: '700' }}>Report Active</h4>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)' }}>{wasteData.length} records</p>
                                </div>
                            </div>
                            <button className="btn btn-outline" onClick={() => resetWasteSegData('waste')} style={{ padding: '0.5rem', borderRadius: '8px', color: '#ef4444' }}>
                                <Trash2 size={16} />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* IEC Report View */}
            {iecData.length > 0 && (
                <div className="dashboard-content animate-slide">
                    <div className="card no-padding" style={{ padding: 0, marginBottom: '4rem', overflow: 'hidden' }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ width: '42px', height: '42px', background: 'var(--color-primary-soft)', color: 'var(--color-primary)', borderRadius: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><FileText size={20} /></div>
                                <h3 style={{ fontSize: '1.15rem', fontWeight: '800' }}>IEC Supervisor Performance</h3>
                            </div>
                            <button className="btn btn-primary no-print" onClick={() => window.print()} style={{ padding: '0.6rem 1.25rem' }}>
                                <Download size={16} /> Export IEC PDF
                            </button>
                        </div>

                        <div style={{ padding: '1.5rem' }}>
                            <div className="summary-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
                                <div className="card summary-card" style={{ borderLeftColor: '#6366f1' }}>
                                    <div className="icon-wrapper" style={{ background: '#eef2ff', color: '#6366f1' }}><FileText size={24} /></div>
                                    <div className="card-info">
                                        <span>Total Campaigns</span>
                                        <h3>{iecSummary.totalEntries}</h3>
                                    </div>
                                </div>
                                <div className="card summary-card" style={{ borderLeftColor: '#8b5cf6' }}>
                                    <div className="icon-wrapper" style={{ background: '#f5f3ff', color: '#8b5cf6' }}><BarChart2 size={24} /></div>
                                    <div className="card-info">
                                        <span>Supervisors</span>
                                        <h3>{iecSummary.uniqueSupervisors}</h3>
                                    </div>
                                </div>
                                <div className="card summary-card" style={{ borderLeftColor: '#10b981' }}>
                                    <div className="icon-wrapper" style={{ background: '#ecfdf5', color: '#10b981' }}><CheckCircle size={24} /></div>
                                    <div className="card-info">
                                        <span>Wards Covered</span>
                                        <h3>{iecSummary.uniqueWards}</h3>
                                    </div>
                                </div>
                            </div>

                            <div className="table-responsive">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th style={{ width: '80px', textAlign: 'center' }}>S.No</th>
                                            <th>Supervisor Name</th>
                                            <th style={{ textAlign: 'center' }}>Campaign Count</th>
                                            <th style={{ width: '250px' }}>Performance Metric</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {iecSummary.supervisorStats.map((stat, i) => (
                                            <tr key={i}>
                                                <td style={{ textAlign: 'center', fontWeight: '600', color: 'var(--color-text-light)' }}>{i + 1}</td>
                                                <td style={{ fontWeight: '700' }}>{stat.name}</td>
                                                <td style={{ textAlign: 'center' }}>
                                                    <span style={{ padding: '0.25rem 0.75rem', background: '#eef2ff', color: '#6366f1', borderRadius: '6px', fontWeight: '800', fontSize: '0.85rem' }}>
                                                        {stat.count}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '10px', overflow: 'hidden' }}>
                                                        <div style={{
                                                            height: '100%',
                                                            background: 'linear-gradient(90deg, #6366f1, #818cf8)',
                                                            width: `${Math.min((stat.count / iecSummary.totalEntries) * 200, 100)}%`,
                                                            borderRadius: '10px'
                                                        }}></div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Waste Report View */}
            {wasteData.length > 0 && (
                <div className={`dashboard-content animate-slide ${iecData.length > 0 ? "page-break-before" : ""}`}>
                    <div className="card no-padding" style={{ padding: 0, overflow: 'hidden' }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ width: '42px', height: '42px', background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', borderRadius: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><BarChart2 size={20} /></div>
                                <h3 style={{ fontSize: '1.15rem', fontWeight: '800' }}>Waste Segregation Performance</h3>
                            </div>
                            <button className="btn btn-primary no-print" onClick={() => window.print()} style={{ background: '#8b5cf6', border: 'none', padding: '0.6rem 1.25rem' }}>
                                <Download size={16} /> Export Waste PDF
                            </button>
                        </div>

                        <div style={{ padding: '1.5rem' }}>
                            <div className="summary-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
                                <div className="card summary-card" style={{ borderLeftColor: '#8b5cf6' }}>
                                    <div className="icon-wrapper" style={{ background: '#f5f3ff', color: '#8b5cf6' }}><BarChart2 size={24} /></div>
                                    <div className="card-info">
                                        <span>Inspections</span>
                                        <h3>{wasteSummary.totalEntries}</h3>
                                    </div>
                                </div>
                                <div className="card summary-card" style={{ borderLeftColor: '#6366f1' }}>
                                    <div className="icon-wrapper" style={{ background: '#eef2ff', color: '#6366f1' }}><FileText size={24} /></div>
                                    <div className="card-info">
                                        <span>Supervisors</span>
                                        <h3>{wasteSummary.uniqueSupervisors}</h3>
                                    </div>
                                </div>
                                <div className="card summary-card" style={{ borderLeftColor: '#10b981' }}>
                                    <div className="icon-wrapper" style={{ background: '#ecfdf5', color: '#10b981' }}><CheckCircle size={24} /></div>
                                    <div className="card-info">
                                        <span>Wards Covered</span>
                                        <h3>{wasteSummary.uniqueWards}</h3>
                                    </div>
                                </div>
                            </div>

                            <div className="table-responsive">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th style={{ width: '80px', textAlign: 'center' }}>S.No</th>
                                            <th>Supervisor Name</th>
                                            <th style={{ textAlign: 'center' }}>Compliance Checks</th>
                                            <th style={{ width: '250px' }}>Contribution</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {wasteSummary.supervisorStats.map((stat, i) => (
                                            <tr key={i}>
                                                <td style={{ textAlign: 'center', fontWeight: '600', color: 'var(--color-text-light)' }}>{i + 1}</td>
                                                <td style={{ fontWeight: '700' }}>{stat.name}</td>
                                                <td style={{ textAlign: 'center' }}>
                                                    <span style={{ padding: '0.25rem 0.75rem', background: '#f5f3ff', color: '#8b5cf6', borderRadius: '6px', fontWeight: '800', fontSize: '0.85rem' }}>
                                                        {stat.count}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '10px', overflow: 'hidden' }}>
                                                        <div style={{
                                                            height: '100%',
                                                            background: 'linear-gradient(90deg, #8b5cf6, #a855f7)',
                                                            width: `${Math.min((stat.count / wasteSummary.totalEntries) * 200, 100)}%`,
                                                            borderRadius: '10px'
                                                        }}></div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WasteSegregationReport;
