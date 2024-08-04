import React, { useState, useCallback, useRef, useEffect } from 'react';
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
import CustomGrid from './CustomGrid';
import defaultImage from '../DocuImage/ProfilePicDefault.jpeg';

function DoctorsHome() {
    const [layouts, setLayouts] = useState({ lg: [] });
    const [visibility, setVisibility] = useState({});
    const [headerInfo, setHeaderInfo] = useState({});
    const [zIndexes, setZIndexes] = useState({});
    const containerRef = useRef(null);
    const [containerWidth, setContainerWidth] = useState(0);
    const [selectedPatients, setSelectedPatients] = useState(JSON.parse(localStorage.getItem('selectedPatients')) || []);
    const [selectedPatientObjects, setSelectedPatientObjects] = useState([]);
    const [reFetch, setFetch] = useState(false);

    useEffect(() => {
        if (containerRef.current) {
            setContainerWidth(containerRef.current.clientWidth - 200); // Subtract the width of the Dock
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
                        patients = patients.map(patient => {
                            if (patient.imgSrc && patient.imgSrc.data) {
                                const base64String = btoa(String.fromCharCode(...new Uint8Array(patient.imgSrc.data)));
                                patient.imgSrc = `data:image/jpeg;base64,${base64String}`;
                            } else {
                                patient.imgSrc = defaultImage;
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
            } else {
                setSelectedPatientObjects([]);
            }
        };

        fetchPatientData();
    }, [selectedPatients, reFetch]);

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
                const componentWidth = Math.max(1, Math.round(cols)); // 25% of the container's width
                const componentHeight = Math.max(1, Math.round(100)); //
                const xPosition = Math.floor((cols - componentWidth) / 2);
                const minW = Math.max(1, Math.round(cols));
                const minH = Math.max(1, Math.round(30));
                return { lg: [...prev.lg, { i: componentKey,x: xPosition, y: 0, w: componentWidth, h: componentHeight, minW, minH }] };
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
                    <div style={{ width: '200px', zIndex: 2 }}> {/* Fixed width for Dock */}
                        <Dock onToggleComponent={toggleComponent} />
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        <PatientBar
                            selectedPatients={selectedPatientObjects}
                            setSelectedPatients={setSelectedPatients}
                            setFetch={setFetch}
                        />
                        <div style={{ flex: 1, overflow: 'auto' }}> {/* Ensure this container has flex: 1 */}
                            <CustomGrid
                                components={components}
                                visibility={visibility}
                                headerInfo={headerInfo}
                                zIndexes={zIndexes}
                                bringToFront={bringToFront}
                                toggleComponent={toggleComponent}
                                layouts={layouts}
                                setLayouts={setLayouts}
                                containerWidth={containerWidth}
                            />
                        </div>
                    </div>
                </div>
            );
        }
        export default DoctorsHome;
