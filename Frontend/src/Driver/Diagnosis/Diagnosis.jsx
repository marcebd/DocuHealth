import React, { useState, useEffect } from 'react';
import { FaNotesMedical } from 'react-icons/fa';
import PatientSearch from "../PatientSearch/PatientSearch";
import { Snackbar, Typography, Box, Button } from '@mui/material';
import Alert from '@mui/material/Alert';
import AddDiagnosis from "./AddDiagnosis";
import DiagnosisTable from "./DiagnosisTable";

const Diagnosis = () => {
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [diagnoses, setDiagnoses] = useState([]);
    const [showTable, setShowTable] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [error, setError] = useState('');
    const [showAddButton, setShowAddButton] = useState(false);
    const [resetForm, setResetForm] = useState(false);
    const [reFetch, setFetch] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [fullName, setFullName] = useState('');

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    };

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
        const fullName = `${patient.firstName} ${patient.middleName ? patient.middleName + ' ' : ''}${patient.lastName}`;
        setFullName(fullName);
        setSearchQuery(fullName);
    };

    const handleSearchChange = (query) => {
        setSearchQuery(query);
        if (query !== fullName) {
            setShowTable(true);
            setSelectedPatient(null);
        }
    };

    useEffect(() => {
        const fetchDiagnoses = async () => {
            if (selectedPatient && selectedPatient.id) {
                setIsLoading(true);
                try {
                    const response = await fetch(`http://localhost:3002/conditions/${selectedPatient.id}`);
                    if (response.ok) {
                        let data = await response.json();
                        data = data.map(diagnosis => ({
                            ...diagnosis,
                            dateStart: new Date(diagnosis.dateStart).toLocaleDateString('en-US'),
                            dateEnd: diagnosis.dateEnd ? new Date(diagnosis.dateEnd).toLocaleDateString('en-US') : null
                        }));
                        setDiagnoses(data);
                    } else {
                        setError('Failed to fetch diagnoses');
                    }
                } catch (error) {
                    setError(`Error fetching diagnoses: ${error}`);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchDiagnoses();
    }, [selectedPatient, reFetch]);

    const handleDiagnosisSubmit = async (diagnosisData) => {
        const isValid = diagnosisData.name.trim() !== '' &&
                        diagnosisData.dateStart.trim() !== '';

        if (!isValid) {
            setError('All fields are required. Please fill in all data.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:3002/conditions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ conditions: [{ ...diagnosisData, patientId: selectedPatient.id }] })
            });

            if (response.ok) {
                setSnackbarMessage('Diagnosis saved successfully');
                setOpenSnackbar(true);
                setFetch(true);
                setShowAddButton(true);
            } else {
                const errorResponse = await response.json();
                setError(`Failed to add diagnosis: ${errorResponse.message}`);
            }
        } catch (error) {
            setError(`Error adding diagnosis: ${error}`);
        }
    };

    const handleAddAnotherDiagnosis = () => {
        setResetForm(true);
        setTimeout(() => setResetForm(false), 10);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', height: '100%' }}>
            <PatientSearch onPatientSelect={handlePatientSelect} showTable={showTable} searchQuery={searchQuery} onSearchChange={handleSearchChange} />
            {diagnoses.length > 0 && selectedPatient && <DiagnosisTable diagnoses={diagnoses} patientName={fullName} />}
            {selectedPatient && <AddDiagnosis patient={selectedPatient} handleSubmit={handleDiagnosisSubmit} resetFormTrigger={resetForm} />}
            {showAddButton && (
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <Button variant="contained" color="error" onClick={handleAddAnotherDiagnosis}>
                    Add Another Diagnosis
                </Button>
            </Box>
            )}
            {error && <Typography color="error" style={{ marginTop: '20px' }}>{error}</Typography>}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%', fontSize: '1.2rem' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
}
export default Diagnosis;
