import React from 'react';
import { Bell, User, Search } from 'lucide-react';
import './Header.css';

const Header = ({ title }) => {
    return (
        <header className="header">
            <div className="header-title">
                <h1>{title}</h1>
            </div>

            <div className="header-actions">
                {/* Search Bar */}
                <div className="search-bar">
                    <Search size={18} className="search-icon" />
                    <input type="text" placeholder="Search..." />
                </div>

                {/* Action Buttons */}
                <button className="icon-btn">
                    <Bell size={20} />
                    <span className="badge-dot"></span>
                </button>

                {/* User Profile */}
                <div className="user-profile">
                    <div className="avatar">
                        <User size={20} />
                    </div>
                    <div className="user-info">
                        <span className="user-name">John Doe</span>
                        <span className="user-role">Student</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
