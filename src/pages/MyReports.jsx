import React from 'react';
import { Search, Filter, MoreHorizontal, FileText, Download, Trash2, Edit2, Eye } from 'lucide-react';
import './MyReports.css';

const MyReports = () => {
    const reports = [
        { id: 1, title: 'Physics Lab Experiment 4', date: 'Feb 4, 2024', status: 'Draft', type: 'Lab Report' },
        { id: 2, title: 'Internship Weekly Report', date: 'Feb 3, 2024', status: 'Completed', type: 'Internship' },
        { id: 3, title: 'Computer Networks Project', date: 'Feb 2, 2024', status: 'Draft', type: 'Project' },
        { id: 4, title: 'Chemistry Final Analysis', date: 'Jan 28, 2024', status: 'Completed', type: 'Lab Report' },
        { id: 5, title: 'Research Methodology', date: 'Jan 25, 2024', status: 'Published', type: 'Research' },
    ];

    return (
        <div className="reports-container">
            {/* Filters */}
            <div className="filters-bar card">
                <div className="search-wrapper">
                    <Search size={18} className="filter-icon" />
                    <input type="text" placeholder="Search reports..." />
                </div>
                <div className="filter-actions">
                    <button className="btn btn-outline">
                        <Filter size={18} />
                        Filter
                    </button>
                    <select className="select-input">
                        <option>All Types</option>
                        <option>Lab Report</option>
                        <option>Project</option>
                    </select>
                </div>
            </div>

            {/* Reports Table */}
            <div className="reports-table-container card">
                <table className="reports-table">
                    <thead>
                        <tr>
                            <th className="th-title">Report Title</th>
                            <th>Type</th>
                            <th>Date Modified</th>
                            <th>Status</th>
                            <th className="th-actions">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.map((report) => (
                            <tr key={report.id}>
                                <td className="td-title">
                                    <div className="title-wrapper">
                                        <div className="file-icon">
                                            <FileText size={18} />
                                        </div>
                                        <span>{report.title}</span>
                                    </div>
                                </td>
                                <td>{report.type}</td>
                                <td>{report.date}</td>
                                <td>
                                    <span className={`badge ${report.status === 'Completed' ? 'badge-success' :
                                            report.status === 'Published' ? 'badge-primary' : 'badge-warning'
                                        }`}>
                                        {report.status}
                                    </span>
                                </td>
                                <td className="td-actions">
                                    <div className="action-buttons">
                                        <button className="action-btn" title="View"><Eye size={18} /></button>
                                        <button className="action-btn" title="Edit"><Edit2 size={18} /></button>
                                        <button className="action-btn" title="Download"><Download size={18} /></button>
                                        <button className="action-btn danger" title="Delete"><Trash2 size={18} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MyReports;
