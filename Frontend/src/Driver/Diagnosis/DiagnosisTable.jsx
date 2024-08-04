import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, Typography } from '@mui/material';

const DiagnosisTable = ({ diagnoses, patientName }) => {
    return (
        <Paper style={{ margin: '16px 0', width: '90%', padding: '16px', overflowX: 'auto', maxHeight: '100%', overflowY: 'auto', height: '30%'}}>
            <Typography variant="h6" style={{ marginBottom: '12px' }}>
                Diagnoses for {patientName}
            </Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Diagnosis Name</TableCell>
                        <TableCell>Start Date</TableCell>
                        <TableCell>End Date</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {diagnoses.map((diagnosis, index) => (
                        <TableRow key={index}>
                            <TableCell>{diagnosis.name}</TableCell>
                            <TableCell>{diagnosis.dateStart}</TableCell>
                            <TableCell>{diagnosis.dateEnd}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
};

export default DiagnosisTable;
