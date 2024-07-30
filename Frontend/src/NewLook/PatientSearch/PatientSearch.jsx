import React, { useState, useEffect } from 'react';
import './PatientSearch.css';
import FacialRecognitionSearchButton from '../../FacialRecognition/FacialRecognitionSearchButton';
import SearchBarPatient from '../../Patient/SearchBarPatient';
import PatientSearchTable from '../../Patient/PatientSearchTable';

const PatientSearch = ({ onPatientSelect, showTable, searchQuery, onSearchChange }) => {
    const [patientsData, setPatientsData] = useState([]);
    const [fetchedPatients, setFetchedPatients] = useState([]);
    const userId = JSON.parse(localStorage.getItem("userId"));
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(`http://localhost:3001/users/${userId}/patients`, {
                    method: 'GET',
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch patients');
                }
                const data = await response.json();
                setPatientsData(data);
                setFetchedPatients(data);
            } catch (error) {
                console.error('Error fetching patients:', error);
                setError('Error fetching patient data. Please try again later.');
            }
        }
        fetchData();
    }, [userId]);

    const handleSearch = (event) => {
        const query = event.target.value.trim().toLowerCase();
        onSearchChange(query);  

        if (query === "") {
            setPatientsData(fetchedPatients);
        } else {
            const filteredPatients = fetchedPatients.filter(patient => {
                const fullName = `${patient.firstName} ${patient.middleName ? patient.middleName + ' ' : ''}${patient.lastName}`.trim().toLowerCase();
                return fullName.includes(query) ||
                    patient.firstName.toLowerCase().includes(query) ||
                    patient.lastName.toLowerCase().includes(query) ||
                    (patient.middleName && patient.middleName.toLowerCase().includes(query)) ||
                    `${patient.firstName.toLowerCase()} ${patient.lastName.toLowerCase()}`.includes(query) ||
                    (patient.middleName && `${patient.firstName.toLowerCase()} ${patient.middleName.toLowerCase()}`.includes(query)) ||
                    (patient.middleName && `${patient.firstName.toLowerCase()} ${patient.middleName.toLowerCase()} ${patient.lastName.toLowerCase()}`.includes(query));
            });
            setPatientsData(filteredPatients);
        }
    };

    const handlePatientClick = (patient) => {
        onPatientSelect(patient);
    };

    return (
        <div className="patient-search-container">
            <div className="search-bar-container">
                <SearchBarPatient value={searchQuery} onChange={handleSearch} />
                <FacialRecognitionSearchButton handlePatientClick={handlePatientClick}/>
            </div>
            {showTable && patientsData.length > 0 ? (
                <PatientSearchTable patientsData={patientsData} handlePatientClick={handlePatientClick}/>
            ) : showTable ? (
                <p>No patients found</p>
            ) : null}
        </div>
    );
};

export default PatientSearch;
