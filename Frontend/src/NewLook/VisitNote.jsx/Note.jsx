import React, { useState } from 'react';
import { FaEdit } from 'react-icons/fa'; // Ensure this icon is imported
import PatientSearch from "../PatientSearch/PatientSearch";
import { Snackbar } from '@mui/material';
import Alert from '@mui/material/Alert'; // For better alert styling
import AddNote from "./AddNote";

const Note = () => {
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [showTable, setShowTable] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false); // State to control Snackbar visibility
    const [snackbarMessage, setSnackbarMessage] = useState(""); // Snackbar message
    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    };

    const handlePatientSelect = (patient) => {
        setSelectedPatient(patient);
        setShowTable(false); // Hide the table and show AddNote
        setSearchQuery(`${patient.firstName} ${patient.middleName} ${patient.lastName}`.trim());
    };

    const handleSearchChange = (query) => {
        setSearchQuery(query);
        if (query !== `${selectedPatient?.firstName} ${selectedPatient?.middleName} ${selectedPatient?.lastName}`.trim()) {
            setShowTable(true);
            setSelectedPatient(null);
        }
    };

    const handleSubmit = async (noteData) => {
        const { noteType, noteContent, noteDate, noteTime, patientId } = noteData;
        const date = new Date(noteDate);
        const time = new Date(noteTime);
        const combinedDateTime = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            time.getHours(),
            time.getMinutes(),
            time.getSeconds()
        );
        if (!noteContent.trim() || !combinedDateTime) {
            setError('Both the visit date and note content are required.');
            return;
        }

        const patientData = {
            patientId: patientId,
            note: noteContent,
            visitDate: combinedDateTime.toISOString()
        };

        try {
            const response = await fetch('http://localhost:3002/visitNotes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(patientData)
            });

            if (!response.ok) {
                const responseData = await response.json();
                setError('Failed to save the note. Please try again.');
                return;
            }
            setSnackbarMessage('Patient note saved correctly');
            setOpenSnackbar(true);
        } catch (error) {
            console.error("Error creating note:", error);
            setError('An error occurred while saving the note.');
        }
    };

    return (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', height: '100%'}}>
            <div style={{
                width: '100%',
                height: '40px',
                backgroundColor: '#58D68D',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: '2%'
            }}>
                <FaEdit style={{ color: 'white', fontSize: '24px' }} />
            </div>
            <PatientSearch
                onPatientSelect={handlePatientSelect}
                showTable={showTable}
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
            />
            {selectedPatient && <AddNote patient={selectedPatient} handleSubmit={handleSubmit}/>}
            <div style={{
                width: '100%',
                height: '40px',
                backgroundColor: '#58D68D',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '2%'
            }}>
            </div>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity="success"
                    sx={{
                        width: '100%',
                        fontSize: '1.2rem'
                    }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
}

export default Note;
