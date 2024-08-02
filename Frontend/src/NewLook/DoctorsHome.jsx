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
import defaultImage from '../DocuImage/ProfilePicDefault.jpeg';
const ResponsiveGridLayout = WidthProvider(Responsive);

function DoctorsHome() {
    const [layouts, setLayouts] = useState({ lg: [] });
    const [visibility, setVisibility] = useState({});
    const [headerInfo, setHeaderInfo] = useState({});
    const [zIndexes, setZIndexes] = useState({});
    const containerRef = useRef(null);
    const [containerWidth, setContainerWidth] = useState(0);
    const [selectedPatients, setSelectedPatients] = useState(JSON.parse(localStorage.getItem('selectedPatients')) || []);
    const [selectedPatientObjects, setSelectedPatientObjects] = useState([]);

    useEffect(() => {
        if (containerRef.current) {
            setContainerWidth(containerRef.current.clientWidth);
        }
    }, []);

    useEffect(() => {
        const fetchPatientData = async () => {
            const patientIds = JSON.parse(localStorage.getItem('selectedPatients')) || [];
            if (patientIds.length > 0) {
                try {
                    const response = await fetch('http://localhost:3001/patients/names', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(patientIds)
                    });
                    if (response.ok) {
                        let patients = await response.json();
                        // Process image data for each patient
                        patients = patients.map(patient => {
                            if (patient.imgSrc && patient.imgSrc.data) {
                                const base64String = btoa(String.fromCharCode(...new Uint8Array(patient.imgSrc.data)));
                                patient.imgSrc = `data:image/jpeg;base64,${base64String}`;
                            } else {
                                patient.imgSrc = defaultImage; // Use default image if no image data
                            }
                            return patient;
                        });
                        setSelectedPatientObjects(patients);
                    } else {
                        console.error('Failed to fetch patient data');
                    }
                } catch (error) {
                    console.error('Error fetching patient data:', error);
                }
            }
        };

        fetchPatientData();
    }, [selectedPatients]);

    const handlePatientSelect = useCallback((patient) => {
        const existingPatients = JSON.parse(localStorage.getItem('selectedPatients')) || [];
        const newPatients = [...existingPatients, patient.id];
        localStorage.setItem('selectedPatients', JSON.stringify(newPatients));
        setSelectedPatients(newPatients);
    }, []);

    const components = {
        calendar: <MonthlyCalendar />,
        patientInformation: <PatientInformation />,
        addPatient: <AddPatient />,
        addNote: <Note />,
        addPrescription: <Prescription />,
        addDiagnosis: <Diagnosis />,
        addAppointment: <ScheduleAppointment />,
        searchRecords: <PatientManager onPatientSelect={handlePatientSelect} selectedPatients={selectedPatients} setSelectedPatients={setSelectedPatients} />,
    };

    const toggleComponent = useCallback((componentKey, icon, color) => {
        setVisibility(prev => ({ ...prev, [componentKey]: !prev[componentKey] }));
        setHeaderInfo(prev => ({ ...prev, [componentKey]: { icon, color } }));
        setLayouts(prev => {
            const existing = prev.lg.find(l => l.i === componentKey);
            if (existing) {
                return { lg: prev.lg.filter(l => l.i !== componentKey) };
            } else {
                const cols = 12;
                const componentWidth = 15;
                const componentHeight = 30;
                const xPosition = Math.floor((cols - componentWidth) / 2);
                const minW = Math.max(1, Math.round(cols * 0.3));
                const minH = Math.max(1, Math.round(30 * 0.3));
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
                        <Dock onToggleComponent={toggleComponent} />
                        <div style={{ width: 'calc(100% - 200px)', height: '100%', overflow: 'auto' }}>
                            <ResponsiveGridLayout
                                className="layout"
                                layouts={layouts}
                                breakpoints={{ lg: 1200 }}
                                cols={{ lg: 12 }}
                                rowHeight={30}
                                width={containerWidth}
                                onLayoutChange={(layout, layouts) => setLayouts(layouts)}
                                measureBeforeMount={true}
                            >
                                {Object.keys(components).map(key => (
                                    visibility[key] ? (
                                        <div key={key} className="panel" style={{ zIndex: zIndexes[key] || 1 }} onClick={() => bringToFront(key)}>
                                            <div className="panel-header" style={{ backgroundColor: headerInfo[key]?.color || '#fff' }}>
                                                <span>{headerInfo[key]?.icon}</span>
                                                <FaTimes onClick={() => toggleComponent(key)} />
                                            </div>
                                            <div className="panel-content">
                                                {components[key]}
                                            </div>
                                        </div>
                                    ) : null
                                ))}
                            </ResponsiveGridLayout>
                            <PatientBar onToggleComponent={toggleComponent} selectedPatients={selectedPatientObjects} />
                        </div>

                    </div>
                );
}
export default DoctorsHome;
