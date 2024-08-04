import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, Typography } from '@mui/material';

const PrescriptionTable = ({ prescriptions, patientName }) => {
    return (
        <Paper style={{ margin: '16px 0', width: '90%', padding: '16px', overflowX: 'auto', maxHeight: '100%', overflowY: 'auto', height: '30%'}}>
            {/* Display patient's name as a header */}
            <Typography variant="h4" style={{ textAlign: 'center', marginBottom: '16px' }}>
                Prescriptions for {patientName}
            </Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell align="right">Dose</TableCell>
                        <TableCell align="right">Instructions</TableCell>
                        <TableCell align="right">Start Date</TableCell>
                        <TableCell align="right">End Date</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {prescriptions.map((prescription, index) => (
                        <TableRow key={index}>
                            <TableCell component="th" scope="row">
                                {prescription.name}
                            </TableCell>
                            <TableCell align="right">{prescription.dose}</TableCell>
                            <TableCell align="right">{prescription.instructions}</TableCell>
                            <TableCell align="right">{prescription.dateStart}</TableCell>
                            <TableCell align="right">{prescription.dateEnd}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
};

export default PrescriptionTable;
