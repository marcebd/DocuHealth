import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Avatar, Grid } from '@mui/material';
import PrescriptionTable from './Prescription/PrescriptionTable';
import DiagnosisTable from './Diagnosis/DiagnosisTable';

const PatientCard = ({ patient }) => {
    const [picture, setPicture] = useState('');
    const [prescriptions, setPrescriptions] = useState([]);
    const [diagnoses, setDiagnoses] = useState([]);

    useEffect(() => {
        if (patient && patient.picture && patient.picture.data) {
            const buffer = patient.picture.data;
            const base64String = btoa(String.fromCharCode(...new Uint8Array(buffer)));
            setPicture(`data:image/jpeg;base64,${base64String}`);
        }

        if (patient && patient.id) {
            fetchPrescriptions(patient.id);
            fetchDiagnoses(patient.id);
        }
    }, [patient]);

    const fetchPrescriptions = async (patientId) => {
        const response = await fetch(`http://localhost:3002/prescriptions/${patientId}`);
        const data = await response.json();
        setPrescriptions(data);
    };

    const fetchDiagnoses = async (patientId) => {
        const response = await fetch(`http://localhost:3002/conditions/${patientId}`);
        const data = await response.json();
        setDiagnoses(data);
    };

    if (!patient) return null;

    const { firstName, middleName, lastName, birthDate, email, gender, idNumber } = patient;
    const fullName = `${firstName} ${middleName ? middleName + ' ' : ''}${lastName}`;

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Card sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
                        <Avatar
                            sx={{ width: 100, height: 100, mb: 2 }}
                            src={picture}
                            alt="Patient"
                        />
                        <CardContent>
                            <Typography variant="h5">{fullName}</Typography>
                            <Typography>Date of Birth: {new Date(birthDate).toLocaleDateString()}</Typography>
                            <Typography>Email: {email}</Typography>
                            <Typography>Gender: {gender}</Typography>
                            <Typography>ID Number: {idNumber}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={8}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}}>
                        <DiagnosisTable diagnoses={diagnoses} patientName={fullName} />
                        <PrescriptionTable prescriptions={prescriptions} patientName={fullName} />
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default PatientCard;
