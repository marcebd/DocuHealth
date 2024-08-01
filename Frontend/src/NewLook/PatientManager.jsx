import React, { useState } from 'react';
import { Box, Typography, Button, Snackbar, Alert } from '@mui/material';
import { FaSearch } from 'react-icons/fa';
import PatientSearch from './PatientSearch/PatientSearch';
import PatientCard from './PatientCard';

const PatientManager = () => {
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [showTable, setShowTable] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [error, setError] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const handlePatientSelect = (patient) => {
        setSelectedPatient(patient);
        localStorage.setItem('viewingPatientId', patient.id);
        const patientTabs = JSON.parse(localStorage.getItem('patientTabs')) || [];
        patientTabs.push(patient.id);
        localStorage.setItem('patientTabs', JSON.stringify(patientTabs));
        setShowTable(false);
        setSearchQuery(`${patient.firstName} ${patient.middleName ? patient.middleName + ' ' : ''}${patient.lastName}`);
    };

    const handleSearchChange = (query) => {
        setSearchQuery(query);
        setShowTable(true);
    };

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', height: '100%' }}>
            <Box sx={{ width: '100%', bgcolor: '#76D7C4', p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2%' }}>
                <FaSearch style={{ color: 'white', marginRight: 2, fontSize: '24px' }} />
                <Typography variant="h5" style={{ color: 'white' }}>
                    Search Records
                </Typography>
            </Box>
            <PatientSearch
                onPatientSelect={handlePatientSelect}
                showTable={showTable}
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
            />
            {selectedPatient && <PatientCard patient={selectedPatient} />}
            {error && (
                <Typography color="error" style={{ marginTop: '20px', textAlign: 'center' }}>{error}</Typography>
            )}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%', fontSize: '1.2rem' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
            <Box sx={{ width: '100%', bgcolor: '#76D7C4', p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '2%' }}>
                <Typography variant="body1" style={{ color: 'white' }}>
                    Ensure all details are correct before submitting.
                </Typography>
            </Box>
        </Box>
    );
};

export default PatientManager;
