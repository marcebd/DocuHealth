import React, { useState, useEffect } from 'react';
import { Button, TextField, Box, Grid, Typography } from '@mui/material';

const AddPrescription = ({ patient, handleSubmit, resetFormTrigger }) => {
    const [prescription, setPrescription] = useState({
        name: '',
        dose: '',
        instructions: '',
        dateStart: '',
        dateEnd: ''
    });

    useEffect(() => {
        // Reset form when the resetFormTrigger changes
        setPrescription({
            name: '',
            dose: '',
            instructions: '',
            dateStart: '',
            dateEnd: ''
        });
    }, [resetFormTrigger]);

    const handleChange = (event) => {
        setPrescription({ ...prescription, [event.target.name]: event.target.value });
    };

    const submitPrescription = () => {
        handleSubmit({
            ...prescription,
            patientId: patient.id
        });
    };

    const patientName = patient ? `${patient.firstName} ${patient.middleName ? patient.middleName + ' ' : ''}${patient.lastName}` : 'Patient';

    return (
        <Box sx={{ width: '100%', padding: 3, height: '100%', overflow: 'auto' }}>
            <Typography variant="h4" gutterBottom>
                Add a Prescription for {patientName}
            </Typography>
            <TextField label="Name" name="name" value={prescription.name} onChange={handleChange} fullWidth margin="normal" />
            <TextField label="Dose" name="dose" value={prescription.dose} onChange={handleChange} fullWidth margin="normal" />
            <TextField label="Instructions" name="instructions" value={prescription.instructions} onChange={handleChange} fullWidth margin="normal" />
            <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={6}>
                    <TextField
                        label="Start Date"
                        name="dateStart"
                        type="date"
                        value={prescription.dateStart}
                        onChange={handleChange}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label="End Date"
                        name="dateEnd"
                        type="date"
                        value={prescription.dateEnd}
                        onChange={handleChange}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                    />
                </Grid>
            </Grid>
            <Button onClick={submitPrescription} variant="contained" color="primary" sx={{ mt: 2 }}>Submit Prescription</Button>
        </Box>
    );
}

export default AddPrescription;
