import React, { useMemo } from 'react';
import ReportGenerator from '../components/ReportGenerator';
import { useReport } from '../context/ReportContext';
import { Download, CheckCircle, MapPin, Users, Calendar } from 'lucide-react';

const sampleCSV = `"S.No","Supervisor Name","Supervisor Number","Supervisor Id","Zone-Circle","Ward","Date","Time","Remark"
"1","Bavita","9259813595","ALNNEGA1725","Z3-C6","44.Maqdoom Nagar","03-02-2026","12:57 PM",""
"2","Bavita","9259813595","ALNNEGA1725","Z3-C6","44.Maqdoom Nagar","03-02-2026","12:56 PM",""
"3","Sheelendra Kumar ","8218935171","ALNNEGA2677","Z2-C3","38.Chandaniyan","03-02-2026","12:45 PM",""`;

const WasteSegregationCompliance = () => {
    const {
        compData: data, setCompData: setData,
        compFile: file, setCompFile: setFile,
        compFilters: filters, setCompFilters: setFilters,
        resetCompData
    } = useReport();

    const handleReset = () => {
        resetCompData();
        setFilters({
            startDate: '',
            endDate: '',
            zone: '',
            ward: ''
        });
    };

    const uniqueZones = useMemo(() => {
        if (!data || !data.length) return [];
        return [...new Set(data.map(item => item['Zone-Circle']).filter(Boolean))].sort();
    }, [data]);

    const uniqueWards = useMemo(() => {
        if (!data || !data.length) return [];
        let availableData = data;
        if (filters.zone) {
            availableData = data.filter(item => item['Zone-Circle'] === filters.zone);
        }
        return [...new Set(availableData.map(item => item['Ward']).filter(Boolean))].sort();
    }, [data, filters.zone]);

    const filteredData = useMemo(() => {
        if (!data || !data.length) return [];

        return data.filter(item => {
            let dateMatches = true;
            if (filters.startDate || filters.endDate) {
                const itemDate = new Date(item['Date']);
                const start = filters.startDate ? new Date(filters.startDate) : null;
                const end = filters.endDate ? new Date(filters.endDate) : null;
                if (start && itemDate < start) dateMatches = false;
                if (end && itemDate > end) dateMatches = false;
            }

            const matchesZone = !filters.zone || item['Zone-Circle'] === filters.zone;
            const matchesWard = !filters.ward || item['Ward'] === filters.ward;

            return dateMatches && matchesZone && matchesWard;
        });
    }, [data, filters]);

    const summaryStats = useMemo(() => {
        const uniqueSupervisors = new Set(filteredData.map(d => d['Supervisor Id']).filter(Boolean)).size;
        const totalWards = new Set(filteredData.map(d => d['Ward']).filter(Boolean)).size;
        
        return {
            totalChecks: filteredData.length,
            uniqueSupervisors,
            totalWards,
        };
    }, [filteredData]);

    return (
        <ReportGenerator
            title="Waste Segregation Compliance"
            reportType="waste-segregation-compliance"
            file={file}
            setFile={setFile}
            setData={setData}
            resetData={handleReset}
            sampleCSV={sampleCSV}
        >
            {data && data.length > 0 && (
                <div className="dashboard-content animate-fade">
                    <div className="card no-padding animate-slide" style={{ padding: 0, overflow: 'hidden', marginBottom: '2.5rem' }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Compliance Highlights</h3>
                            <div className="table-actions no-print" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                <input
                                    type="date"
                                    className="select-input"
                                    value={filters.startDate}
                                    onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                                    title="Start Date"
                                />
                                <input
                                    type="date"
                                    className="select-input"
                                    value={filters.endDate}
                                    onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                                    title="End Date"
                                />
                                <select
                                    className="select-input"
                                    value={filters.zone}
                                    onChange={(e) => setFilters({ ...filters, zone: e.target.value, ward: '' })}
                                >
                                    <option value="">All Zones</option>
                                    {uniqueZones.map(z => <option key={z} value={z}>{z}</option>)}
                                </select>
                                <select
                                    className="select-input"
                                    value={filters.ward}
                                    onChange={(e) => setFilters({ ...filters, ward: e.target.value })}
                                >
                                    <option value="">All Wards</option>
                                    {uniqueWards.map(w => <option key={w} value={w}>{w}</option>)}
                                </select>
                                <button className="btn btn-primary" onClick={() => window.print()}>
                                    <Download size={16} /> Export PDF
                                </button>
                            </div>
                        </div>

                        <div style={{ padding: '1.5rem' }}>
                            <div className="summary-cards" style={{ marginBottom: '2rem' }}>
                                <div className="card summary-card" style={{ borderLeftColor: 'var(--color-primary)' }}>
                                    <div className="icon-wrapper" style={{ background: 'var(--color-primary-soft)', color: 'var(--color-primary)' }}><CheckCircle size={24} /></div>
                                    <div className="card-info">
                                        <span>Total Checks</span>
                                        <h3>{summaryStats.totalChecks}</h3>
                                    </div>
                                </div>
                                <div className="card summary-card" style={{ borderLeftColor: 'var(--color-secondary)' }}>
                                    <div className="icon-wrapper" style={{ background: 'rgba(30,64,175,0.1)', color: 'var(--color-secondary)' }}><Users size={24} /></div>
                                    <div className="card-info">
                                        <span>Supervisors Active</span>
                                        <h3>{summaryStats.uniqueSupervisors}</h3>
                                    </div>
                                </div>
                                <div className="card summary-card" style={{ borderLeftColor: '#10b981' }}>
                                    <div className="icon-wrapper" style={{ background: '#ecfdf5', color: '#10b981' }}><MapPin size={24} /></div>
                                    <div className="card-info">
                                        <span>Wards Covered</span>
                                        <h3>{summaryStats.totalWards}</h3>
                                    </div>
                                </div>
                            </div>

                            <div className="table-responsive">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th style={{ width: '60px', textAlign: 'center' }}>S.No</th>
                                            <th>Zone-Circle</th>
                                            <th>Ward</th>
                                            <th>Supervisor Name</th>
                                            <th style={{ textAlign: 'center' }}>Date</th>
                                            <th style={{ textAlign: 'center' }}>Time</th>
                                            <th>Remark</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredData.slice(0, 100).map((row, index) => (
                                            <tr key={index}>
                                                <td style={{ textAlign: 'center', color: 'var(--color-text-light)' }}>{index + 1}</td>
                                                <td><span style={{ fontWeight: 600 }}>{row['Zone-Circle']}</span></td>
                                                <td>{row['Ward']}</td>
                                                <td>
                                                    <div style={{ fontWeight: 600 }}>{row['Supervisor Name']}</div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)' }}>ID: {row['Supervisor Id']}</div>
                                                </td>
                                                <td style={{ textAlign: 'center' }}>
                                                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', background: '#f1f5f9', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.85rem' }}>
                                                        <Calendar size={12} /> {row['Date']}
                                                    </div>
                                                </td>
                                                <td style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--color-text-light)' }}>{row['Time']}</td>
                                                <td style={{ color: 'var(--color-text-dim)', fontSize: '0.9rem' }}>{row['Remark'] || '-'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {filteredData.length > 100 && (
                                    <div style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--color-text-dim)', fontSize: '0.85rem' }}>
                                        Showing first 100 records of {filteredData.length}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {!data.length && (
                <p>Upload a CSV file to view the Waste Segregation Compliance report.</p>
            )}
        </ReportGenerator>
    );
};

export default WasteSegregationCompliance;
