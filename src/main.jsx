import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'

import { ReportProvider } from './context/ReportContext.jsx'

// Diagnostic logging
console.log('Mounting Report Buddy Aligarh...');

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
