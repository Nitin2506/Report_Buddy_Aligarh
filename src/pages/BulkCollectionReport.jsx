import React, { useMemo, useState } from 'react';
import ReportGenerator from '../components/ReportGenerator';
import { useReport } from '../context/ReportContext';
import { Download, Trash2, Droplets, Home, Clock, Calendar, MapPin } from 'lucide-react';

const sampleCSV = `"S.No.","Scan ID","QR Code ID","Date Of Scan","Site Name","Supervisor Name","Supervisor ID","Supervisor Mobile Number","Ward Name","Zone","Before Clean Time","Before Image","After Clean Time","After Image","Feedback","Category","Building/Street Name","Latitude","Longitude"
"1","5185","ALNNDG17","20/04/2026","Zonal Ansar Khan","Mohammad Ansar","ALNNE134","9289305340","46.Badar Bagh","Z1-C2","10:49 AM","url","","url","","Dhalao Ghar","Under Jail Pul","27.9","78.0"
"2","5184","ALNNMT36","20/04/2026","GVM Mall Ramghat Road","Gautam Saxena","ALNNE938","9266762573","24.Devsaini","Z2-C3","10:44 AM","url","10:45 AM","url","","Mechanised Urinal / Toilet Cleaning","GVM Mall","27.9","78.1"
"3","5182","ALNNDB42","20/04/2026","Zonal Monu Diwan","Harsh Bharti","ALNNE133","8218402604","33.Kishanpur","Z2-C3","10:22 AM","url","10:36 AM","url","","Dustbin","ADA V.C. Kothi","27.8","78.0"`;

const BulkCollectionReport = () => {
    const {
        bulkData: data, setBulkData: setData,
        bulkFile: file, setBulkFile: setFile,
        bulkFilters: filters, setBulkFilters: setFilters,
        resetBulkData
    } = useReport();

    const [activeTab, setActiveTab] = useState('Dustbin');

    const handleReset = () => {
        resetBulkData();
        setFilters({ zone: '', startDate: '', endDate: '', category: '' });
    };

    const uniqueZones = useMemo(() => {
        if (!data || !data.length) return [];
        return [...new Set(data.map(item => item['Zone']).filter(Boolean))].sort();
    }, [data]);



    const parsedData = useMemo(() => {
        if (!data || !data.length) return [];
        // The CSV parser converts Date to YYYY-MM-DD if header is Date, but here header is "Date Of Scan"
        // Let's standardise the date parsing
        return data.map(item => {
            let parsedDate = null;
            if (item['Date Of Scan']) {
                const parts = item['Date Of Scan'].split('/');
                if (parts.length === 3) {
                    parsedDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
                } else if (item['Date Of Scan'].includes('-')) {
                    parsedDate = new Date(item['Date Of Scan']);
                }
            }
            return {
                ...item,
                parsedDate
            };
        });
    }, [data]);

    const filteredData = useMemo(() => {
        return parsedData.filter(item => {
            let dateMatches = true;
            if (filters.startDate || filters.endDate) {
                const start = filters.startDate ? new Date(filters.startDate) : null;
                const end = filters.endDate ? new Date(filters.endDate) : null;
                if (start && item.parsedDate && item.parsedDate < start) dateMatches = false;
                if (end && item.parsedDate && item.parsedDate > end) dateMatches = false;
            }

            const matchesZone = !filters.zone || item['Zone'] === filters.zone;
            const matchesCategory = item['Category'] === activeTab;

            return dateMatches && matchesZone && matchesCategory;
        });
    }, [parsedData, filters, activeTab]);

    const tabs = [
        { id: 'Dustbin', label: 'Dustbins', icon: <Trash2 size={18} /> },
        { id: 'Mechanised Urinal / Toilet Cleaning', label: 'Toilets', icon: <Droplets size={18} /> },
        { id: 'Dhalao Ghar', label: 'Dhalao Ghar', icon: <Home size={18} /> }
    ];

    const groupedData = useMemo(() => {
        if (!filteredData.length) return [];
        
        const groups = {};
        filteredData.forEach(row => {
            const z = row['Zone'] || 'Unknown Zone';
            const key = z;
            if (!groups[key]) {
                groups[key] = {
                    zone: key,
                    totalScans: 0,
                    beforeScans: 0,
                    afterScans: 0
                };
            }
            groups[key].totalScans += 1;
            if (row['Before Clean Time']) groups[key].beforeScans += 1;
            if (row['After Clean Time']) groups[key].afterScans += 1;
        });
        
        return Object.values(groups).sort((a, b) => a.zone.localeCompare(b.zone));
    }, [filteredData]);

    return (
        <ReportGenerator
            title="Bulk Collection Scans"
            reportType="bulk-collection"
            file={file}
            setFile={setFile}
            setData={setData}
            resetData={handleReset}
            sampleCSV={sampleCSV}
        >
            {data && data.length > 0 && (
                <div className="dashboard-content animate-fade">
                    
                    {/* Tabs */}
                    <div className="no-print" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                        {tabs.map(tab => {
                            const count = parsedData.filter(d => d['Category'] === tab.id).length;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                                        padding: '1rem 1.5rem', borderRadius: '10px',
                                        background: activeTab === tab.id ? 'var(--color-primary)' : '#fff',
                                        color: activeTab === tab.id ? '#fff' : 'var(--color-text)',
                                        border: '1px solid',
                                        borderColor: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-border)',
                                        fontWeight: activeTab === tab.id ? '700' : '600',
                                        cursor: 'pointer', transition: 'all 0.2s', flex: 1,
                                        justifyContent: 'center', fontSize: '1rem'
                                    }}
                                >
                                    {tab.icon} {tab.label} ({count})
                                </button>
                            );
                        })}
                    </div>

                    <div className="card no-padding animate-slide" style={{ padding: 0, overflow: 'hidden', marginBottom: '2.5rem' }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', flexWrap: 'wrap', gap: '1rem' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                {tabs.find(t => t.id === activeTab)?.icon} {activeTab} Records
                            </h3>
                            <div className="table-actions no-print" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                <input
                                    type="date"
                                    className="select-input"
                                    value={filters.startDate}
                                    onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                                />
                                <input
                                    type="date"
                                    className="select-input"
                                    value={filters.endDate}
                                    onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                                />
                                <select
                                    className="select-input"
                                    value={filters.zone}
                                    onChange={(e) => setFilters({ ...filters, zone: e.target.value })}
                                >
                                    <option value="">All Zones</option>
                                    {uniqueZones.map(z => <option key={z} value={z}>{z}</option>)}
                                </select>

                                <button className="btn btn-primary" onClick={() => window.print()}>
                                    <Download size={16} /> Export PDF
                                </button>
                            </div>
                        </div>

                        <div style={{ padding: '1.5rem' }}>
                            <div className="table-responsive">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Zone</th>
                                            <th style={{ textAlign: 'center' }}>Total Scans</th>
                                            <th style={{ textAlign: 'center' }}>Before Clean (B)</th>
                                            <th style={{ textAlign: 'center' }}>After Clean (A)</th>
                                            <th style={{ width: '200px' }}>Completion Rate</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {groupedData.map((row, index) => {
                                            const completionRate = row.totalScans > 0 
                                                ? Math.round((row.afterScans / row.totalScans) * 100) 
                                                : 0;
                                            
                                            return (
                                                <tr key={index}>
                                                    <td>
                                                        <div style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{row.zone}</div>
                                                    </td>
                                                    <td style={{ textAlign: 'center', fontWeight: '800', fontSize: '1.1rem' }}>
                                                        {row.totalScans}
                                                    </td>
                                                    <td style={{ textAlign: 'center' }}>
                                                        <span style={{ padding: '0.25rem 0.75rem', borderRadius: '6px', background: '#fef3c7', color: '#b45309', fontWeight: 700 }}>
                                                            {row.beforeScans}
                                                        </span>
                                                    </td>
                                                    <td style={{ textAlign: 'center' }}>
                                                        <span style={{ padding: '0.25rem 0.75rem', borderRadius: '6px', background: '#ecfdf5', color: '#047857', fontWeight: 700 }}>
                                                            {row.afterScans}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                            <div style={{ flex: 1, height: '8px', background: '#f1f5f9', borderRadius: '10px', overflow: 'hidden' }}>
                                                                <div style={{
                                                                    height: '100%',
                                                                    background: completionRate === 100 ? '#10b981' : 'var(--grad-main)',
                                                                    width: `${completionRate}%`,
                                                                    borderRadius: '10px'
                                                                }}></div>
                                                            </div>
                                                            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-dim)', minWidth: '40px' }}>
                                                                {completionRate}%
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        {groupedData.length === 0 && (
                                            <tr>
                                                <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-dim)' }}>
                                                    No records found for {activeTab}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {!data.length && (
                <p>Upload the Bulk Collection Scan CSV to view reports for Dustbins, Toilets, and Dhalao Ghar.</p>
            )}
        </ReportGenerator>
    );
};

export default BulkCollectionReport;
