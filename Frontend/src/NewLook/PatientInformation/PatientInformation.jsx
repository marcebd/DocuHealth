import React, { useState } from 'react';
import PatientSearch from "../PatientSearch/PatientSearch";
import PatientProfile from "./PatientProfile";

const PatientInformation = () => {
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [showTable, setShowTable] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

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

    const handleUpdatePatient = async (updatedPatient) => {
        const formData = new FormData();
        formData.append('firstName', updatedPatient.firstName);
        formData.append('middleName', updatedPatient.middleName);
        formData.append('lastName', updatedPatient.lastName);
        formData.append('idNumber', updatedPatient.idNumber);
        formData.append('email', updatedPatient.email);
        formData.append('birthDate', updatedPatient.birthDate);
        formData.append('gender', updatedPatient.gender);

        if (updatedPatient.picture && updatedPatient.picture.data) {
            const arrayBuffer = new Uint8Array(updatedPatient.picture.data).buffer;
            const blob = new Blob([arrayBuffer], { type: 'image/jpeg' });
            formData.append('picture', blob);
        }

        try {
            const response = await fetch(`http://localhost:3001/patients/${updatedPatient.id}`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to update patient information');
            }

            const result = await response.json();
        } catch (error) {
            console.error(error);
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
            {selectedPatient && <PatientProfile patient={selectedPatient} onUpdate={handleUpdatePatient} />}
        </div>
    );
}

export default PatientInformation;
