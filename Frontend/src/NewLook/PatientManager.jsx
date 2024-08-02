import React, { useState, useEffect } from 'react';
import { Box, Typography, Snackbar, Alert } from '@mui/material';
import PatientSearch from './PatientSearch/PatientSearch';
import PatientCard from './PatientCard';
const PatientManager = ({ onPatientSelect, selectedPatients, setSelectedPatients }) => {
    const [showTable, setShowTable] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [error, setError] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const handleSearchChange = (query) => {
        setSearchQuery(query);
        if (query === "") {
            setShowTable(true);
        }
    };

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    };

    const handlePatientSelect = (patientId) => {
        if (!selectedPatients.includes(patientId)) {
            setSelectedPatients([...selectedPatients, patientId]);
            onPatientSelect(patientId); // Assuming this is a prop function to handle selected patient
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', height: '100%' }}>
            <PatientSearch
                onPatientSelect={handlePatientSelect}
                showTable={showTable}
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
            />
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
        </Box>
    );
};
export default PatientManager;
