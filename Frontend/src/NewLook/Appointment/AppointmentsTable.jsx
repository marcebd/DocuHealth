import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, Typography } from '@mui/material';

const AppointmentTable = ({ appointments }) => {
    return (
        <Paper style={{ margin: '16px 0', width: '90%', padding: '16px', overflowX: 'auto', maxHeight: '100%', overflowY: 'auto', height: '30%'}}>
            <Typography variant="h6" sx={{ m: 2 }}>
                Scheduled Appointments
            </Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Appointment Time</TableCell>
                        <TableCell>Time Zone</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {appointments.map((appointment, index) => (
                        <TableRow key={index}>
                            <TableCell>{new Date(appointment.appointmentTime).toLocaleString()}</TableCell>
                            <TableCell>{appointment.timeZone}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
};

export default AppointmentTable;
