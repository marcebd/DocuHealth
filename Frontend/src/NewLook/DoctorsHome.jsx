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
    const [layouts, setLayouts] = useState({
        lg: [
            { i: 'calendar', x: 0, y: 0, w: 6, h: 4, minW: 3, minH: 3, moved: false },
            { i: 'patientInformation', x: 6, y: 0, w: 6, h: 4, minW: 3, minH: 3, moved: false },
            // Define other components with initial positions and sizes
        ]
    });

    const [visibility, setVisibility] = useState({
        calendar: false,
        patientInformation: false,
        addPatient: false,
        addNote: false,
        addPrescription: false,
        addDiagnosis: false,
        addAppointment: false,
        searchRecords: false,
    });

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
        setVisibility(prev => ({
            ...prev,
            [componentKey]: !prev[componentKey]
        }));
    }, []);

    const containerRef = useRef(null);
    const [containerWidth, setContainerWidth] = useState(0);

    useEffect(() => {
        if (containerRef.current) {
            setContainerWidth(containerRef.current.clientWidth);
        }
    }, []);

    return (
        <div ref={containerRef} style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
            <PatientBar onToggleComponent={toggleComponent}/>
            <ResponsiveGridLayout
                className="layout"
                layouts={layouts}
                breakpoints={{ lg: 1200 }}
                cols={{ lg: 12 }}
                rowHeight={30}
                width={containerWidth - 200} // Adjust width to account for PatientBar
                isDraggable={true}
                isResizable={true}
                onLayoutChange={(newLayout, layouts) => setLayouts(layouts)}
                draggableHandle=".drag-handle"
                resizeHandles={['se']}
                compactType={null}
                preventCollision={false}
                style={{ height: '100%', width: '100%' }}
            >
                {Object.keys(components).map(key => visibility[key] && (
                    <div key={key} data-grid={layouts.lg.find(l => l.i === key)} className="drag-handle" style={{ border: '1px solid #ccc', padding: '10px', position: 'relative' }}>
                        <FaTimes style={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer' }} onClick={() => toggleComponent(key)} />
                        {components[key]}
                    </div>
                ))}
            </ResponsiveGridLayout>
            <Dock onToggleComponent={toggleComponent}/>
        </div>
    );
}

export default DoctorsHome;
