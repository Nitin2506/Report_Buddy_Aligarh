import React from 'react';
import { LayoutTemplate, ArrowRight } from 'lucide-react';
import './Templates.css';

const Templates = () => {
    const templates = [
        {
            id: 1,
            title: 'Lab Experiment',
            description: 'Standard format for physics and chemistry lab reports.',
            sections: ['Aim', 'Apparatus', 'Theory', 'Procedure', 'Observation', 'Result'],
            color: '#3B82F6'
        },
        {
            id: 2,
            title: 'Project Report',
            description: 'Comprehensive structure for semester projects.',
            sections: ['Abstract', 'Introduction', 'Literature Review', 'System Design', 'Implementation', 'Conclusion'],
            color: '#8B5CF6'
        },
        {
            id: 3,
            title: 'Internship Report',
            description: 'Professional layout for industrial training reports.',
            sections: ['Company Profile', 'Training Description', 'Projects Handled', 'Skills Learned'],
            color: '#10B981'
        },
        {
            id: 4,
            title: 'Research Paper',
            description: 'IEEE style format for research publications.',
            sections: ['Abstract', 'Introduction', 'Methodology', 'Results', 'Discussion', 'References'],
            color: '#F59E0B'
        }
    ];

    return (
        <div className="templates-container">
            <div className="templates-header">
                <h2>Choose a Template</h2>
                <p>Start your report with a professional structure</p>
            </div>

            <div className="templates-grid">
                {templates.map((template) => (
                    <div className="card template-card" key={template.id}>
                        <div className="template-icon" style={{ backgroundColor: `${template.color}20`, color: template.color }}>
                            <LayoutTemplate size={32} />
                        </div>
                        <div className="template-content">
                            <h3>{template.title}</h3>
                            <p>{template.description}</p>
                            <div className="template-sections">
                                <span>Includes:</span>
                                <ul>
                                    {template.sections.slice(0, 3).map((sec, i) => (
                                        <li key={i}>{sec}</li>
                                    ))}
                                    {template.sections.length > 3 && <li>+ {template.sections.length - 3} more</li>}
                                </ul>
                            </div>
                        </div>
                        <div className="template-footer">
                            <button className="btn btn-primary full-width">
                                Use Template <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Templates;
