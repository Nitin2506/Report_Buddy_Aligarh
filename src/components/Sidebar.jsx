import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FilePlus, FileText, LayoutTemplate, Eye, Settings, LogOut } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
    const navigate = useNavigate();
    const navItems = [
        { name: 'Generate POI Report', icon: <FilePlus size={20} />, path: '/' },
        { name: 'IEC & Waste Segregation', icon: <LayoutTemplate size={20} />, path: '/waste-segregation' },
        { name: 'Other IMP Reports', icon: <LayoutDashboard size={20} />, path: '/other-reports' },
        { name: 'History', icon: <FileText size={20} />, path: '/history' },
        { name: 'Settings', icon: <Settings size={20} />, path: '/settings' },
    ];

    const handleLogout = () => {
        // Logic for logout can be added here
        navigate('/login');
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <div className="logo-icon">AMC</div>
                <span className="logo-text">AMC Reports</span>
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
                <button className="nav-item logout-btn" onClick={handleLogout}>
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
