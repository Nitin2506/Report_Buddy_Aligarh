import React, { useState, useMemo } from 'react';
import ReportGenerator from '../components/ReportGenerator';
import { useReport } from '../context/ReportContext';
import { Download } from 'lucide-react';
import { sampleCSV } from '../data/sampleReport';

const DateWiseCoverageReport = () => {
    const {
        dateWiseData: data, setDateWiseData: setData,
        dateWiseFile: file, setDateWiseFile: setFile,
        dateWiseFilters: filters, setDateWiseFilters: setFilters,
        resetDateWiseData
    } = useReport();

    const handleReset = () => {
        resetDateWiseData();
        setFilters({
            startDate: '',
            endDate: '',
            zone: '',
            ward: ''
        });
    };

    const uniqueZones = useMemo(() => {
        if (!data.length) return [];
        return [...new Set(data.map(item => item['Zone & Circle']))].sort();
    }, [data]);

    const availableWardsData = useMemo(() => {
        if (!data.length) return [];
        return filters.zone
            ? data.filter(item => item['Zone & Circle'] === filters.zone)
            : data;
    }, [data, filters.zone]);

    const uniqueWards = useMemo(() => {
        if (!availableWardsData.length) return [];
        return [...new Set(availableWardsData.map(item => item['Ward Name']))].sort();
    }, [availableWardsData]);

    const filteredData = useMemo(() => {
        if (!data.length) return [];

        return data.filter(item => {
            const itemDate = new Date(item['Date']);
            const startDate = filters.startDate ? new Date(filters.startDate) : null;
            const endDate = filters.endDate ? new Date(filters.endDate) : null;
            const dayAfterEndDate = endDate ? new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate() + 1) : null;

            const matchesDate = (!startDate || itemDate >= startDate) && (!dayAfterEndDate || itemDate < dayAfterEndDate);
            const matchesZone = !filters.zone || item['Zone & Circle'] === filters.zone;
            const matchesWard = !filters.ward || item['Ward Name'] === filters.ward;

            return matchesDate && matchesZone && matchesWard;
        });
    }, [data, filters]);

    const groupedData = useMemo(() => {
        if (!data.length) return { pivotedData: [], uniqueDates: [] };

        const allUniqueDatesSet = new Set();
        const allUniqueRoutesMap = new Map(); // Stores { 'Zone|Ward|Route': { zoneCircle, wardName, routeName } }

        // First pass: collect all unique dates and routes from the entire dataset
        data.forEach(item => {
            allUniqueDatesSet.add(item['Date']);
            const zoneCircle = item['Zone & Circle'];
            const wardName = item['Ward Name'];
            const routeName = item['Route Name'];
            const routeIdentifier = `${zoneCircle}|${wardName}|${routeName}`;
            if (!allUniqueRoutesMap.has(routeIdentifier)) {
                allUniqueRoutesMap.set(routeIdentifier, { zoneCircle, wardName, routeName });
            }
        });

        const routeDateCoverage = {}; // Stores { 'Zone|Ward|Route': { zoneCircle, wardName, routeName, dates: { 'Date': { totalCoverage, count, averageCoverage } } } }

        // Initialize routeDateCoverage with all unique routes
        allUniqueRoutesMap.forEach((routeInfo, routeIdentifier) => {
            routeDateCoverage[routeIdentifier] = {
                ...routeInfo,
                dates: {}
            };
        });

        // Second pass: process filtered data for coverage calculations
        filteredData.forEach(item => {
            const date = item['Date'];
            const zoneCircle = item['Zone & Circle'];
            const wardName = item['Ward Name'];
            const routeName = item['Route Name'];
            const coverage = parseFloat(item['Coverage']);

            const routeIdentifier = `${zoneCircle}|${wardName}|${routeName}`;

            // Ensure the route exists in routeDateCoverage (it should, as we initialized it)
            if (!routeDateCoverage[routeIdentifier]) {
                // This case should ideally not happen if allUniqueRoutesMap is correctly populated
                // but as a safeguard, initialize it if somehow missing
                routeDateCoverage[routeIdentifier] = {
                    zoneCircle,
                    wardName,
                    routeName,
                    dates: {}
                };
            }

            if (!routeDateCoverage[routeIdentifier].dates[date]) {
                routeDateCoverage[routeIdentifier].dates[date] = {
                    totalCoverage: 0,
                    count: 0
                };
            }

            routeDateCoverage[routeIdentifier].dates[date].totalCoverage += coverage;
            routeDateCoverage[routeIdentifier].dates[date].count += 1;
        });

        // Calculate average coverage for each route-date combination
        for (const routeIdentifier in routeDateCoverage) {
            for (const date in routeDateCoverage[routeIdentifier].dates) {
                const dateSummary = routeDateCoverage[routeIdentifier].dates[date];
                dateSummary.averageCoverage = (dateSummary.totalCoverage / dateSummary.count).toFixed(2);
            }
        }

        const sortedAllUniqueDates = Array.from(allUniqueDatesSet).sort((a, b) => new Date(a) - new Date(b));

        return {
            pivotedData: Object.values(routeDateCoverage),
            uniqueDates: sortedAllUniqueDates
        };
    }, [data, filteredData]);

    const { pivotedData, uniqueDates } = groupedData;

    const tableMinWidth = useMemo(() => {
        // Fixed columns width: S.No (60px) + Zone & Circle (150px) + Ward Name (150px) + Route Name (200px)
        const fixedColumnsWidth = 60 + 150 + 150 + 200;
        // Each date column will have a minimum width, e.g., 100px
        const dateColumnWidth = 100;
        const dynamicColumnsWidth = uniqueDates.length * dateColumnWidth;
        // Ensure a minimum width even if there are few dates
        return Math.max(fixedColumnsWidth + dynamicColumnsWidth, 1000); // Minimum 1000px or calculated width
    }, [uniqueDates]);

    return (
        <ReportGenerator
            title="Date Wise Coverage Report"
            reportType="date-wise-coverage"
            file={file}
            setFile={setFile}
            setData={setData}
            resetData={handleReset}
            sampleCSV={sampleCSV}
            showDateRange={true}
            showZoneCircle={true}
            showWard={true}
            showActivityMetric={false}
            showOther1={false}
            showOther2={false}
        >
            {data.length > 0 && (
                <div className="dashboard-content">
                    <div className="card no-padding animate-slide" style={{ padding: 0, overflow: 'hidden', marginBottom: '2.5rem', animationDelay: '1s' }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Detailed Coverage Report</h3>
                            <div className="table-actions no-print" style={{ display: 'flex', gap: '1rem' }}>
                                <input
                                    type="date"
                                    className="select-input"
                                    value={filters.startDate}
                                    onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                                />
                                <input
                                    type="date"
                                    className="select-input"
                                    value={filters.endDate}
                                    onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                                />
                                <select
                                    className="select-input"
                                    value={filters.zone}
                                    onChange={(e) => setFilters({ ...filters, zone: e.target.value, ward: '' })}
                                >
                                    <option value="">All Zones</option>
                                    {uniqueZones.map(zone => <option key={zone} value={zone}>{zone}</option>)}
                                </select>
                                <select
                                    className="select-input"
                                    value={filters.ward}
                                    onChange={(e) => setFilters({ ...filters, ward: e.target.value })}
                                >
                                    <option value="">All Wards</option>
                                    {uniqueWards.map(ward => <option key={ward} value={ward}>{ward}</option>)}
                                </select>
                                <button className="btn btn-primary" onClick={() => window.print()}>
                                    <Download size={16} /> Export PDF
                                </button>
                            </div>
                        </div>
                        <div className="date-wise-coverage-table-wrapper">
                            <table className="data-table" style={{ minWidth: `${tableMinWidth}px` }}>
                                <thead>
                                    <tr>
                                        <th style={{ width: '60px', textAlign: 'center' }}>S.No</th>
                                        <th>Zone & Circle</th>
                                        <th>Ward Name</th>
                                        <th>Route Name</th>
                                        {uniqueDates.map(date => (
                                            <th key={date} style={{ textAlign: 'center' }}>{date}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {pivotedData.map((route, index) => (
                                        <tr key={`${route.zoneCircle}-${route.wardName}-${route.routeName}`}>
                                            <td style={{ textAlign: 'center', fontWeight: '600', color: 'var(--color-text-light)' }}>{index + 1}</td>
                                            <td style={{ fontWeight: '600' }}>{route.zoneCircle}</td>
                                            <td>{route.wardName}</td>
                                            <td>{route.routeName}</td>
                                            {uniqueDates.map(date => (
                                                <td key={date} style={{ textAlign: 'center' }}>
                                                    {route.dates[date] ? `${route.dates[date].averageCoverage}%` : '-'}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
            {!data.length && (
                <p>Upload a CSV file to view the Date Wise Coverage Report.</p>
            )}
        </ReportGenerator>
    );
};

export default DateWiseCoverageReport;
