import React, { useState } from 'react';
import Table from './Table';

const PatientSearchTable = ({ patientsData, handlePatientClick }) => {
    const [sortDirection, setSortDirection] = useState('asc');

    const columns = [
        { key: 'firstName', header: 'First Name' },
        { key: 'middleName', header: 'Middle Name' },
        { key: 'lastName', header: 'Last Name' }
    ];

    const handleSortChange = (event) => {
        setSortDirection(event.target.value);
    };

    return (
        <Table
            data={patientsData}
            columns={columns}
            onRowClick={handlePatientClick}
            sortKey="firstName"
            sortDirection={sortDirection}
            onSortChange={handleSortChange}
            style={{maxHeight: '80vh', overflowY: 'auto'}}
        />
    );
};

export default PatientSearchTable;
