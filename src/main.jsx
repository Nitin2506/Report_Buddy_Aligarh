import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'

import { ReportProvider } from './context/ReportContext.jsx'

// Diagnostic logging
console.log('Mounting Report Buddy Aligarh...');

const params = new URLSearchParams(window.location.search);
const redirectPath = params.get('p');
if (redirectPath) {
    const path = redirectPath.startsWith('/') ? redirectPath : `/${redirectPath}`;
    window.history.replaceState(null, '', path);
}

const rootElement = document.getElementById('root');
if (!rootElement) {
    console.error('Failed to find the root element');
} else {
    ReactDOM.createRoot(rootElement).render(
        <React.StrictMode>
            <BrowserRouter>
                <ReportProvider>
                    <App />
                </ReportProvider>
            </BrowserRouter>
        </React.StrictMode>,
    )
}
