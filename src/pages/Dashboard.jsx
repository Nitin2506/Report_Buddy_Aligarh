import React from 'react';
import { Link } from 'react-router-dom';
import { FilePlus, FileText, Clock, MoreVertical } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
    // Mock data
    const stats = [
        { label: 'Total Reports', value: '12', icon: <FileText size={20} className="text-blue-500" /> },
        { label: 'Drafts', value: '3', icon: <Clock size={20} className="text-orange-500" /> },
        { label: 'Completed', value: '9', icon: <FileText size={20} className="text-green-500" /> },
    ];

    const recentReports = [
        { id: 1, title: 'Physics Lab Experiment 4', date: '2 hours ago', status: 'Draft', type: 'Lab Report' },
        { id: 2, title: 'Internship Weekly Report', date: 'Yesterday', status: 'Completed', type: 'Internship' },
        { id: 3, title: 'Computer Networks Project', date: 'Feb 2, 2024', status: 'Draft', type: 'Project' },
        { id: 4, title: 'Chemistry Final Analysis', date: 'Jan 28, 2024', status: 'Completed', type: 'Lab Report' },
    ];

    return (
        <div className="dashboard-container">
            {/* Stats Row */}
            <div className="stats-grid">
                {stats.map((stat) => (
                    <div className="card stat-card" key={stat.label}>
                        <div className="stat-info">
                            <span className="stat-label">{stat.label}</span>
                            <span className="stat-value">{stat.value}</span>
                        </div>
                        <div className="stat-icon-bg">
                            {stat.icon}
                        </div>
                    </div>
                ))}
                {/* Create New Call to Action */}
                <Link to="/create" className="card create-card">
                    <div className="create-content">
                        <div className="create-icon">
                            <FilePlus size={24} />
                        </div>
                        <span className="create-text">Create New Report</span>
                    </div>
                </Link>
            </div>

            {/* Recent Reports Section */}
            <div className="recent-section">
                <div className="section-header">
                    <h2>Recently Edited</h2>
                    <Link to="/reports" className="btn-text">View All</Link>
                </div>

                <div className="reports-grid">
                    {recentReports.map((report) => (
                        <div className="card report-card" key={report.id}>
                            <div className="report-header">
                                <div className="report-icon">
                                    <FileText size={24} />
                                </div>
                                <button className="more-btn">
                                    <MoreVertical size={18} />
                                </button>
                            </div>
                            <div className="report-body">
                                <h3>{report.title}</h3>
                                <p className="report-meta">{report.type} • {report.date}</p>
                            </div>
                            <div className="report-footer">
                                <span className={`badge ${report.status === 'Completed' ? 'badge-success' : 'badge-warning'}`}>
                                    {report.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
