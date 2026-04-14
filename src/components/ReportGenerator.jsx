import React, { useState } from 'react';
import { Upload, RefreshCcw, FileText } from 'lucide-react';
import parseCSV from '../utils/csvParser';
import './ReportGenerator.css'; // Assuming a CSS file for styling

const ReportGenerator = ({
    title,
    reportType,
    file,
    setFile,
    setData,
    resetData,
    sampleCSV,
    children
}) => {
    const [loading, setLoading] = useState(false);

    const handleFileUpload = (event) => {
        const uploadedFile = event.target.files[0];
        if (uploadedFile) {
            setFile(uploadedFile);
            setLoading(true);

            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target.result;
                setData(parseCSV(text));
                setLoading(false);
            };
            reader.readAsText(uploadedFile);
        }
    };

    const handleLoadDemo = () => {
        setLoading(true);
        setTimeout(() => {
            setData(parseCSV(sampleCSV));
            setLoading(false);
        }, 500);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && droppedFile.name.endsWith('.csv')) {
            setFile(droppedFile);
            setLoading(true);
            const reader = new FileReader();
            reader.onload = (event) => {
                setData(parseCSV(event.target.result));
                setLoading(false);
            };
            reader.readAsText(droppedFile);
        }
    };

    const handleReset = () => {
        resetData();
        setLoading(false);
    };

    return (
        <div className="report-generator-container animate-fade">
            <h1 className="print-only" style={{ display: 'none' }}>
                {title}
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
                        <h2>{title}</h2>
                        <p>Analyze and visualize your {reportType} data.</p>
                    </div>
                    {file && (
                        <button className="btn btn-outline no-print" onClick={handleReset}>
                            <RefreshCcw size={16} /> New Analysis
                        </button>
                    )}
                </div>
            </div>

            {!file && (
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
                                {reportType}.csv
                            </div>
                        </label>
                    </div>

                    {sampleCSV && (
                        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                            <button className="btn btn-text" onClick={handleLoadDemo} style={{ color: 'var(--color-primary)', fontWeight: '700' }}>
                                <FileText size={18} /> Load Demo: {reportType}
                            </button>
                        </div>
                    )}
                </div>
            )}

            {file && !loading && (
                <div className="dashboard-content">
                    {children}
                </div>
            )}

            {loading && (
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <p>Loading report...</p>
                </div>
            )}
        </div>
    );
};

export default ReportGenerator;
