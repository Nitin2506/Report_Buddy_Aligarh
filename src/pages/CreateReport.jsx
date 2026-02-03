import React, { useState } from 'react';
import { Save, Eye, FileDown, Plus } from 'lucide-react';
import './CreateReport.css';

const CreateReport = () => {
    const [sections, setSections] = useState([
        { id: 1, title: 'Introduction', content: '' },
        { id: 2, title: 'Methodology', content: '' },
        { id: 3, title: 'Results', content: '' },
        { id: 4, title: 'Conclusion', content: '' }
    ]);

    const handleSectionChange = (id, value) => {
        setSections(sections.map(sec => sec.id === id ? { ...sec, content: value } : sec));
    };

    return (
        <div className="create-container">
            {/* Toolbar / Actions */}
            <div className="action-bar">
                <div className="action-left">
                    <span className="last-saved">Last saved: Just now</span>
                </div>
                <div className="action-right">
                    <button className="btn btn-outline">
                        <Save size={18} />
                        Save Draft
                    </button>
                    <button className="btn btn-outline">
                        <Eye size={18} />
                        Preview
                    </button>
                    <button className="btn btn-primary">
                        <FileDown size={18} />
                        Export to PDF
                    </button>
                </div>
            </div>

            <div className="editor-grid">
                {/* Helper Sidebar */}
                <div className="editor-sidebar">
                    <div className="card sidebar-card">
                        <h3>Report Details</h3>
                        <div className="form-group">
                            <label>Report Type</label>
                            <select className="input-field">
                                <option>Lab Experiment</option>
                                <option>Project Report</option>
                                <option>Internship Report</option>
                                <option>Research Paper</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Date</label>
                            <input type="date" className="input-field" />
                        </div>
                        <div className="form-group">
                            <label>Department</label>
                            <input type="text" className="input-field" placeholder="e.g. Computer Science" />
                        </div>
                    </div>

                    <div className="card sidebar-card">
                        <h3>Structure</h3>
                        <ul className="structure-list">
                            {sections.map(sec => (
                                <li key={sec.id}>
                                    <a href={`#section-${sec.id}`}>{sec.title}</a>
                                </li>
                            ))}
                            <li className="add-section">
                                <button className="btn-text">
                                    <Plus size={16} /> Add Section
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Main Editor */}
                <div className="editor-main">
                    <div className="card editor-card">
                        <div className="report-header-inputs">
                            <input
                                type="text"
                                className="report-title-input"
                                placeholder="Report Title"
                                defaultValue="Physics Lab Experiment 4"
                            />
                            <input
                                type="text"
                                className="report-author-input"
                                placeholder="Author Name"
                                defaultValue="John Doe"
                            />
                        </div>

                        <div className="sections-container">
                            {sections.map((section) => (
                                <div key={section.id} id={`section-${section.id}`} className="section-block">
                                    <div className="section-header">
                                        <h4>{section.title}</h4>
                                    </div>
                                    <textarea
                                        className="section-editor"
                                        placeholder={`Write your ${section.title.toLowerCase()} here...`}
                                        value={section.content}
                                        onChange={(e) => handleSectionChange(section.id, e.target.value)}
                                        rows={6}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateReport;
