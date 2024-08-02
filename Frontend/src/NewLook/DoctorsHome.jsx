import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import './DoctorsHome.css';
import Dock from './Dock';
import PatientBar from './PatientBar';
import MonthlyCalendar from './Calendar/MonthlyCalendar';
import PatientInformation from './PatientInformation/PatientInformation';
import AddPatient from './AddPatient/AddPatient';
import Note from './VisitNote.jsx/Note';
import Prescription from './Prescription/Prescription';
import Diagnosis from './Diagnosis/Diagnosis';
import ScheduleAppointment from './Appointment/ScheduleAppointment';
import PatientManager from './PatientManager';
import { FaTimes } from 'react-icons/fa';
const ResponsiveGridLayout = WidthProvider(Responsive);

function DoctorsHome() {
    const [layouts, setLayouts] = useState({ lg: [] });
    const [visibility, setVisibility] = useState({});
    const [zIndexes, setZIndexes] = useState({});
    const containerRef = useRef(null);
    const [containerWidth, setContainerWidth] = useState(0);

    useEffect(() => {
        if (containerRef.current) {
            setContainerWidth(containerRef.current.clientWidth);
        }
    }, []);

    const components = {
        calendar: <MonthlyCalendar />,
        patientInformation: <PatientInformation />,
        addPatient: <AddPatient />,
        addNote: <Note />,
        addPrescription: <Prescription />,
        addDiagnosis: <Diagnosis />,
        addAppointment: <ScheduleAppointment />,
        searchRecords: <PatientManager />,
    };

    const toggleComponent = useCallback((componentKey) => {
        setVisibility(prev => ({ ...prev, [componentKey]: !prev[componentKey] }));
        setLayouts(prev => {
            const existing = prev.lg.find(l => l.i === componentKey);
            if (existing) {
                return { lg: prev.lg.filter(l => l.i !== componentKey) };
            } else {
                const cols = 12; // Total number of columns in the grid
                const componentWidth = 15; // Default width
                const componentHeight = 30; // Default height
                const xPosition = Math.floor((cols - componentWidth) / 2);
                const minW = Math.max(1, Math.round(cols * 0.3)); // Minimum width as 10% of total columns
                const minH = Math.max(1, Math.round(30 * 0.3)); // Minimum height as 10% of total rows (assuming 30 rows)
                return { lg: [...prev.lg, { i: componentKey, x: xPosition, y: 0, w: componentWidth, h: componentHeight, minW, minH }] };
            }
        });
    }, []);

    const bringToFront = useCallback((componentKey) => {
        setZIndexes(prevZIndexes => {
            const maxZIndex = Object.values(prevZIndexes).reduce((max, current) => Math.max(max, current), 0) + 1;
            return { ...prevZIndexes, [componentKey]: maxZIndex };
        });
    }, []);

    return (
        <div ref={containerRef} style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
            <PatientBar onToggleComponent={toggleComponent}/>
            <div style={{ width: 'calc(100% - 200px)', height: '100%', overflow: 'auto' }}>
            <ResponsiveGridLayout
                className="layout"
                layouts={layouts}
                breakpoints={{ lg: 1200 }}
                cols={{ lg: 12 }}
                rowHeight={30}
                width={containerWidth}
                isDraggable={true}
                isResizable={true}
                onLayoutChange={(newLayout, layouts) => setLayouts(layouts)}
                draggableHandle=".drag-handle"
                resizeHandles={['se', 'ne', 'sw', 'nw']} // Allow resizing from all corners
                compactType={null}
                preventCollision={false}
                style={{ height: '100%', width: '100%' }}
            >
                {Object.keys(components).map(key => (
                    visibility[key] && (
                        <div key={key} className="window-frame" data-grid={layouts.lg.find(l => l.i === key)} onClick={() => bringToFront(key)}>
                            <div className="window-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                <div className="drag-handle" style={{ flexGrow: 1, cursor: 'move' }}></div>
                                <FaTimes style={{ cursor: 'pointer' }} onClick={() => toggleComponent(key)} />
                            </div>
                            <div className="window-content">
                                {components[key]}
                            </div>
                        </div>
                    )
                ))}
            </ResponsiveGridLayout>
                <Dock onToggleComponent={toggleComponent} components={components} />
            </div>
        </div>
    );
}

export default DoctorsHome;
