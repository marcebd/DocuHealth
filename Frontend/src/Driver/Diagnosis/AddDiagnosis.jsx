import React, { useState, useEffect } from 'react';
import { Button, TextField, Box, Grid, Typography } from '@mui/material';

const AddDiagnosis = ({ patient, handleSubmit, resetFormTrigger }) => {
    const [diagnosis, setDiagnosis] = useState({
        name: '',
        dateStart: '',
        dateEnd: ''
    });

    useEffect(() => {
        // Reset form when the resetFormTrigger changes
        setDiagnosis({
            name: '',
            dateStart: '',
            dateEnd: ''
        });
    }, [resetFormTrigger]);

    const handleChange = (event) => {
        setDiagnosis({ ...diagnosis, [event.target.name]: event.target.value });
    };

    const submitDiagnosis = () => {
        handleSubmit({
            ...diagnosis,
            patientId: patient.id
        });
    };

    const patientName = patient ? `${patient.firstName} ${patient.middleName ? patient.middleName + ' ' : ''}${patient.lastName}` : 'Patient';

    return (
        <Box sx={{ width: '100%', padding: 3, height: '100%', overflow: 'auto' }}>
            <Typography variant="h4" gutterBottom>
                Add a Diagnosis for {patientName}
            </Typography>
            <TextField label="Diagnosis Name" name="name" value={diagnosis.name} onChange={handleChange} fullWidth margin="normal" />
            <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={6}>
                    <TextField
                        label="Start Date"
                        name="dateStart"
                        type="date"
                        value={diagnosis.dateStart}
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
                        value={diagnosis.dateEnd}
                        onChange={handleChange}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                    />
                </Grid>
            </Grid>
            <Button onClick={submitDiagnosis} variant="contained" color="primary" sx={{ mt: 2 }}>Submit Diagnosis</Button>
        </Box>
    );
}

export default AddDiagnosis;
