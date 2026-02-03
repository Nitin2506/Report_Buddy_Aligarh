import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FilePlus, FileText, LayoutTemplate, Eye, Settings, LogOut } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
    const navItems = [
        { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/' },
        { name: 'Create Report', icon: <FilePlus size={20} />, path: '/create' },
        { name: 'My Reports', icon: <FileText size={20} />, path: '/reports' },
        { name: 'Templates', icon: <LayoutTemplate size={20} />, path: '/templates' },
        { name: 'Preview', icon: <Eye size={20} />, path: '/preview' },
        { name: 'Settings', icon: <Settings size={20} />, path: '/settings' },
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <div className="logo-icon">RB</div>
                <span className="logo-text">Report Buddy</span>
            </div>

            <nav className="sidebar-nav">
                <ul>
                    {navItems.map((item) => (
                        <li key={item.name}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
                            >
                                {item.icon}
                                <span>{item.name}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="sidebar-footer">
                <button className="nav-item logout-btn">
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
