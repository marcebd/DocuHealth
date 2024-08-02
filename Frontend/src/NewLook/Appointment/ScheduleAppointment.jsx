import React, { useState, useEffect } from 'react';
import { FaCalendarAlt } from 'react-icons/fa';
import PatientSearch from "../PatientSearch/PatientSearch";
import { Snackbar, Typography, Box, Button } from '@mui/material';
import Alert from '@mui/material/Alert';
import AddAppointment from "./AddAppointment";
import AppointmentTable from "./AppointmentsTable";

const ScheduleAppointment = () => {
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [appointments, setAppointments] = useState([]);
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
        if (query !== fullName) {
            setShowTable(true);
            setSelectedPatient(null);
        }
    };

    useEffect(() => {
        const fetchAppointments = async () => {
            if (selectedPatient && selectedPatient.id) {
                setIsLoading(true);
                try {
                    const response = await fetch(`http://localhost:3002/appointments/${selectedPatient.id}`);
                    if (response.ok) {
                        let data = await response.json();
                        data = JSON.parse(data);
                        setAppointments(data.appointments);
                    } else {
                        setError('Failed to fetch appointments');
                    }
                } catch (error) {
                    setError(`Error fetching appointments: ${error}`);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchAppointments();
    }, [selectedPatient, reFetch]);

    const handleAppointmentSubmit = async (appointmentData) => {
        try {
            const response = await fetch(`http://localhost:3002/appointments/schedule/${selectedPatient.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(appointmentData)
            });
            if (response.ok) {
                setSnackbarMessage('Appointment scheduled successfully');
                setOpenSnackbar(true);
                setFetch(true);
                setShowAddButton(true);
            } else {
                setError('Failed to schedule appointment');
            }
        } catch (error) {
            setError(`Error scheduling appointment: ${error.message}`);
        }
    };

    const handleAddAnotherAppointment = () => {
        setResetForm(true);
        setTimeout(() => setResetForm(false), 10);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', height: '100%' }}>
            <PatientSearch onPatientSelect={handlePatientSelect} showTable={showTable} searchQuery={searchQuery} onSearchChange={handleSearchChange} />
            {appointments.length > 0 && selectedPatient && <AppointmentTable appointments={appointments} patientName={fullName} />}
            {selectedPatient && <AddAppointment patient={selectedPatient} handleSubmit={handleAppointmentSubmit} resetFormTrigger={resetForm} />}
        {showAddButton && (
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <Button variant="contained" color="primary" onClick={handleAddAnotherAppointment}>
                    Schedule Another Appointment
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
};
export default ScheduleAppointment;
