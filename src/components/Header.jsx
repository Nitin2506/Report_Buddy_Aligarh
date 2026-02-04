import React from 'react';
import { Bell, User, Search } from 'lucide-react';
import './Header.css';

import AuthButtons from './AuthButtons';

const Header = ({ title }) => {
    // In a real app, this would come from an auth context
    const isLoggedIn = false;

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

                {/* User Auth/Profile */}
                {isLoggedIn ? (
                    <div className="user-profile">
                        <div className="avatar">
                            <User size={20} />
                        </div>
                        <div className="user-info">
                            <span className="user-name">John Doe</span>
                            <span className="user-role">Student</span>
                        </div>
                    </div>
                ) : (
                    <AuthButtons />
                )}
            </div>
        </header>
    );
};

export default Header;
