import React from 'react';

const PatientPreview = ({ patients, searchQuery, onClick }) => {
    const filteredPatients = patients.filter((patient) => {
        const fullName = `${patient.firstName} ${patient.middleName} ${patient.lastName}`.toLowerCase();
        return (
            fullName.includes(searchQuery) ||
            patient.firstName.toLowerCase().includes(searchQuery) ||
            patient.middleName.toLowerCase().includes(searchQuery) ||
            patient.lastName.toLowerCase().includes(searchQuery) ||
            patient.email.toLowerCase().includes(searchQuery)
        );
    });

    if (searchQuery === '') {
        return null;
    }

    return (
        <div style={{
            maxHeight: '15vh',
            position: 'absolute',
            backgroundColor: 'white',
            overflowY: 'auto',
            width: '100%',
            border: '1px solid #ccc',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1000,
            marginTop: '3%',
            width: '29%'
        }}>
        {filteredPatients.map((patient) => (
            <div key={patient.id} onClick={() => onClick(patient)}>
            <p>{patient.firstName} {patient.middleName} {patient.lastName} Email: {patient.email}</p>
            </div>
        ))}
        </div>
    );
};

export default PatientPreview;
