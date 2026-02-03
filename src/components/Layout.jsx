import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import './Layout.css';

const Layout = () => {
    const location = useLocation();

    // Determine title based on path
    const getPageTitle = (pathname) => {
        if (pathname === '/') return 'Dashboard';
        if (pathname === '/create') return 'Create Report';
        if (pathname === '/reports') return 'My Reports';
        if (pathname === '/templates') return 'Templates';
        if (pathname === '/preview') return 'Preview';
        if (pathname === '/settings') return 'Settings';
        return 'Report Buddy';
    };

    const title = getPageTitle(location.pathname);

    return (
        <div className="app-layout">
            <Sidebar />
            <div className="main-content">
                <Header title={title} />
                <main className="page-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
