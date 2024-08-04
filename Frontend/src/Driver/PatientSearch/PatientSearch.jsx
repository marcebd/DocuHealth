import React, { useState, useEffect } from 'react';
import './PatientSearch.css';
import FacialRecognitionSearchButton from './FacialRecognitionSearchButton';
import SearchBarPatient from './SearchBarPatient';
import PatientSearchTable from './PatientSearchTable';

const PatientSearch = ({ onPatientSelect, showTable, searchQuery, onSearchChange }) => {
    const [patientsData, setPatientsData] = useState([]);
    const [fetchedPatients, setFetchedPatients] = useState([]);
    const [viewMode, setViewMode] = useState('list'); // 'list', 'detailed', 'icon'
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
                const patients = await response.json();
                const patientsWithImages = patients.map(patient => {
                    if (patient.picture && patient.picture.data) {
                        const base64String = btoa(String.fromCharCode(...new Uint8Array(patient.picture.data)));
                        patient.imageSrc = `data:image/jpeg;base64,${base64String}`;
                    }
                    return patient;
                });
                setPatientsData(patientsWithImages);
                setFetchedPatients(patientsWithImages);
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
                    patient.email.toLowerCase().includes(query) ||
                    patient.birthDate.includes(query);
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
                <FacialRecognitionSearchButton handlePatientClick={handlePatientClick} style={{marginLeft: '2%'}}/>
                <select onChange={(e) => setViewMode(e.target.value)}>
                    <option value="list">List View</option>
                    <option value="detailed">Detailed View</option>
                    <option value="icon">Icon View</option>
                </select>
            </div>
            {showTable && patientsData.length > 0 ? (
                <PatientSearchTable patientsData={patientsData} handlePatientClick={handlePatientClick} viewMode={viewMode}/>
            ) : showTable ? (
                <p>No patients found</p>
            ) : null}
        </div>
    );
};

export default PatientSearch;
