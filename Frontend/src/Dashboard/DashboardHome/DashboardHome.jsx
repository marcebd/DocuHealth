import React, { useState, useEffect } from 'react';
import SearchBarPatient from "../../Patient/SearchBarPatient";
import PatientPreview from "./PatientPreview";
import TodaysAppointments from "../../Appointments/TodaysAppointments"
import Scheduler from '../../Appointments/Scheduler'

const DashboardHome = ({ }) => {
    const userId = JSON.parse(localStorage.getItem("userId"));
    const [patientsData, setPatientsData] = useState([]);
    const [fetchedPatients, setFetchedPatients] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [patientId, setPatientId] = useState('');

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
        }
    }
    fetchData();
    }, [userId]);

    const handleSearch = (event) => {
    const searchQuery = event.target.value.trim().toLowerCase();
    setSearchQuery(searchQuery);

    if (searchQuery === "") {
        setPatientsData(fetchedPatients);
    } else {
        const filteredPatients = fetchedPatients.filter((patient) => {
        return (
            patient.firstName.toLowerCase().includes(searchQuery) ||
            patient.middleName.toLowerCase().includes(searchQuery) ||
            patient.lastName.toLowerCase().includes(searchQuery) ||
            patient.email.toLowerCase().includes(searchQuery)
        );
        });
        setPatientsData(filteredPatients);
    }
    };

    const handlePatientClick = (patientId) => {
        setPatientId(patientId);
    };

    return (
    <div style={{width: '95%', display: 'flex'}}>
        <div style={{width: '45%'}}>
            <TodaysAppointments />
        </div>
        <div style={{display:'flex', flexDirection:'column',}}>
            <SearchBarPatient onChange={handleSearch} />
            <PatientPreview patients={patientsData} searchQuery={searchQuery} onClick={handlePatientClick} />
            <Scheduler patientId={patientId} />
        </div>
    </div>
    );
};

export default DashboardHome;
