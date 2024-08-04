import React, { useState, useEffect } from 'react';
import PatientSearch from "../PatientSearch/PatientSearch";
import PatientProfile from "./PatientProfile";

const PatientInformation = () => {
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [showTable, setShowTable] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const viewingPatientId = localStorage.getItem('viewingPatientId');
        if (viewingPatientId) {
            fetchPatientById(viewingPatientId);
        }

        const handleStorageChange = (event) => {
            if (event.key === 'viewingPatientId') {
                fetchPatientById(event.newValue);
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const fetchPatientById = async (patientId) => {

        try {
            const response = await fetch(`http://localhost:3001/dashboard/patient/information/${patientId}`, {
                method: 'GET'
            });

            if (!response.ok) {
                throw new Error('Failed to fetch patient data');
            }
            let patientInformation = await response.json();
            patientInformation = JSON.parse(patientInformation);
            handlePatientSelect(patientInformation);
            setShowTable(false);
        } catch (error) {
            console.error(error);
            setError('Failed to load patient data: ' + error.message);
        }
    };

    const handlePatientSelect = (patient) => {
        setSelectedPatient(patient);
        setShowTable(false);
        setSearchQuery(`${patient.firstName} ${patient.middleName} ${patient.lastName}`.trim());
    };

    const handleSearchChange = (query) => {
        setSearchQuery(query);
        if (query !== `${selectedPatient?.firstName} ${selectedPatient?.middleName} ${selectedPatient?.lastName}`.trim()) {
            setShowTable(true);
            setSelectedPatient(null);
        }
    };

    return (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center',  width: '100%' }}>
            <PatientSearch
                onPatientSelect={handlePatientSelect}
                showTable={showTable}
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
            />
            {selectedPatient && <PatientProfile patient={selectedPatient} />}
        </div>
    );
}

export default PatientInformation;
