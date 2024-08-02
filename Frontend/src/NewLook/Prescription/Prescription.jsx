import React, { useState, useEffect } from 'react';
import { FaFilePrescription } from 'react-icons/fa';
import PatientSearch from "../PatientSearch/PatientSearch";
import { Snackbar, Typography, Box, Button } from '@mui/material';
import Alert from '@mui/material/Alert';
import AddPrescription from "./AddPrescription";
import PrescriptionTable from "./PrescriptionTable";

const Prescription = () => {
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [prescriptions, setPrescriptions] = useState([]);
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

    const handlePatientSelect = (patient) => {
        setSelectedPatient(patient);
        setShowTable(false);
        const fullName = `${patient.firstName} ${patient.middleName ? patient.middleName + ' ' : ''}${patient.lastName}`;
        setFullName(fullName);
        setSearchQuery(fullName);
    };

    const handleSearchChange = (query) => {
        setSearchQuery(query);
        if (query !== `${selectedPatient?.firstName} ${selectedPatient?.middleName} ${selectedPatient?.lastName}`.trim()) {
            setShowTable(true);
            setSelectedPatient(null);
        }
    };

    useEffect(() => {
        const fetchPrescriptions = async () => {
            if (selectedPatient && selectedPatient.id) {
                setIsLoading(true);
                try {
                    const response = await fetch(`http://localhost:3002/prescriptions/${selectedPatient.id}`);
                    if (response.ok) {
                        let data = await response.json();
                        data = data.map(prescription => ({
                            ...prescription,
                            dateStart: new Date(prescription.dateStart).toLocaleDateString('en-US'), // Adjust the locale as needed
                            dateEnd: prescription.dateEnd ? new Date(prescription.dateEnd).toLocaleDateString('en-US') : null
                        }));
                        setPrescriptions(data);
                    } else {
                        setError('Failed to fetch prescriptions');
                    }
                } catch (error) {
                    setError(`Error fetching prescriptions: ${error}`);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchPrescriptions();
    }, [selectedPatient, reFetch]);

    const handlePrescriptionSubmit = async (prescriptionData) => {
        const isValid = prescriptionData.name.trim() !== '' &&
                        prescriptionData.dose.trim() !== '' &&
                        prescriptionData.instructions.trim() !== '' &&
                        prescriptionData.dateStart.trim() !== '';

        if (!isValid) {
            setError('All fields are required. Please fill in all data.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:3002/prescriptions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ prescriptions: [{ ...prescriptionData, patientId: selectedPatient.id }] })
            });

            if (response.ok) {
                setSnackbarMessage('Prescription saved successfully');
                setOpenSnackbar(true);
                setFetch(true);
                setShowAddButton(true);
            } else {
                const errorResponse = await response.json();
                setError(`Failed to add prescription: ${errorResponse.message}`);
            }
        } catch (error) {
            setError(`Error adding prescription: ${error}`);
        }
    };

    const handleAddAnotherPrescription = () => {
        setResetForm(true);
        setTimeout(() => setResetForm(false), 10);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', height: '100%' }}>
            {prescriptions.length > 0 && <PrescriptionTable prescriptions={prescriptions} patientName={fullName} />}
            <PatientSearch
                onPatientSelect={handlePatientSelect}
                showTable={showTable}
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
            />
            {selectedPatient && <AddPrescription patient={selectedPatient} handleSubmit={handlePrescriptionSubmit} resetFormTrigger={resetForm} />}
            {showAddButton && (
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <Button variant="contained" color="error" onClick={handleAddAnotherPrescription}>
                        Add Another Prescription
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
export default Prescription;
