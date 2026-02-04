import React, { createContext, useContext, useState } from 'react';

const ReportContext = createContext();

export const ReportProvider = ({ children }) => {
    // State for Generate POI Report
    const [poiData, setPoiData] = useState([]);
    const [poiFile, setPoiFile] = useState(null);
    const [poiFilters, setPoiFilters] = useState({ zone: '', ward: '' });

    // State for IEC & Waste Segregation Report
    const [iecData, setIecData] = useState([]);
    const [wasteData, setWasteData] = useState([]);
    const [iecFile, setIecFile] = useState(null);
    const [wasteFile, setWasteFile] = useState(null);

    const resetPoiData = () => {
        setPoiData([]);
        setPoiFile(null);
        setPoiFilters({ zone: '', ward: '' });
    };

    const resetWasteSegData = (type) => {
        if (type === 'iec') {
            setIecData([]);
            setIecFile(null);
        } else if (type === 'waste') {
            setWasteData([]);
            setWasteFile(null);
        } else {
            setIecData([]);
            setWasteData([]);
            setIecFile(null);
            setWasteFile(null);
        }
    };

    return (
        <ReportContext.Provider value={{
            poiData, setPoiData,
            poiFile, setPoiFile,
            poiFilters, setPoiFilters,
            resetPoiData,
            iecData, setIecData,
            wasteData, setWasteData,
            iecFile, setIecFile,
            wasteFile, setWasteFile,
            resetWasteSegData
        }}>
            {children}
        </ReportContext.Provider>
    );
};

export const useReport = () => {
    const context = useContext(ReportContext);
    if (!context) {
        throw new Error('useReport must be used within a ReportProvider');
    }
    return context;
};
