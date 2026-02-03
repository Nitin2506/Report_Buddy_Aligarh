import React from 'react';
import { Download, Printer, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Preview.css';

const Preview = () => {
    const navigate = useNavigate();

    return (
        <div className="preview-container">
            <div className="preview-toolbar">
                <button className="btn btn-outline" onClick={() => navigate(-1)}>
                    <ArrowLeft size={18} /> Back
                </button>
                <div className="toolbar-actions">
                    <button className="btn btn-outline">
                        <Printer size={18} /> Print
                    </button>
                    <button className="btn btn-primary">
                        <Download size={18} /> Download PDF
                    </button>
                </div>
            </div>

            <div className="preview-area">
                <div className="a4-page">
                    <div className="report-content">
                        <div className="report-header-preview">
                            <h1 className="preview-title">Physics Lab Experiment 4: Ohm's Law</h1>
                            <div className="preview-meta">
                                <p><strong>Author:</strong> John Doe</p>
                                <p><strong>Department:</strong> Physics</p>
                                <p><strong>Date:</strong> February 4, 2024</p>
                            </div>
                        </div>

                        <div className="report-section">
                            <h2>1. Introduction</h2>
                            <p>
                                Ohm's law states that the current through a conductor between two points is directly proportional to the voltage across the two points. Introducing the constant of proportionality, the resistance, one arrives at the usual mathematical equation that describes this relationship: I = V/R, where I is the current through the conductor in units of amperes, V is the voltage measured across the conductor in units of volts, and R is the resistance of the conductor in units of ohms.
                            </p>
                        </div>

                        <div className="report-section">
                            <h2>2. Methodology</h2>
                            <p>
                                The experiment was conducted using a standard circuit setup. A variable DC power supply was connected in series with a resistor and an ammeter. A voltmeter was connected in parallel across the resistor. The voltage was varied in steps of 1V from 0V to 10V, and the corresponding current readings were recorded.
                            </p>
                        </div>

                        <div className="report-section">
                            <h2>3. Results</h2>
                            <p>
                                The data collected showed a linear relationship between voltage and current. plotting V vs I yielded a straight line passing through the origin, confirming the direct proportionality. The slope of the line represents the resistance of the component.
                            </p>
                            <div className="preview-table-placeholder">
                                [Table: Voltage vs Current Readings]
                            </div>
                        </div>

                        <div className="report-section">
                            <h2>4. Conclusion</h2>
                            <p>
                                The experiment successfully verified Ohm's Law for the given ohmic conductor. The calculated resistance from the graph slope matched the theoretical value within the experimental error limits.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Preview;
