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
    const [other1Data, setOther1Data] = useState([]);
    const [other2Data, setOther2Data] = useState([]);
    const [other3Data, setOther3Data] = useState([]);
    const [other4Data, setOther4Data] = useState([]);
    const [other1File, setOther1File] = useState(null);
    const [other2File, setOther2File] = useState(null);
    const [other3File, setOther3File] = useState(null);
    const [other4File, setOther4File] = useState(null);

    const resetPoiData = () => {
        setPoiData([]);
        setPoiFile(null);
        setPoiFilters({ zone: '', ward: '' });
    };

    const resetWasteSegData = (type) => {
        switch (type) {
            case 'iec':
                setIecData([]); setIecFile(null); break;
            case 'waste':
                setWasteData([]); setWasteFile(null); break;
            case 'other1':
                setOther1Data([]); setOther1File(null); break;
            case 'other2':
                setOther2Data([]); setOther2File(null); break;
            case 'other3':
                setOther3Data([]); setOther3File(null); break;
            case 'other4':
                setOther4Data([]); setOther4File(null); break;
            default:
                setIecData([]); setWasteData([]); setOther1Data([]); setOther2Data([]); setOther3Data([]); setOther4Data([]);
                setIecFile(null); setWasteFile(null); setOther1File(null); setOther2File(null); setOther3File(null); setOther4File(null);
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
            other1Data, setOther1Data,
            other2Data, setOther2Data,
            other3Data, setOther3Data,
            other4Data, setOther4Data,
            other1File, setOther1File,
            other2File, setOther2File,
            other3File, setOther3File,
            other4File, setOther4File,
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
