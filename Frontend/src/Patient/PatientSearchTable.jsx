import React, { useState } from 'react';
import Table from './Table';
import defaultImage from '../DocuImage/ProfilePicDefault.jpeg';

const PatientSearchTable = ({ patientsData, handlePatientClick, viewMode }) => {
    const [sortDirection, setSortDirection] = useState('asc');

    const columns = {
        list: [
            { key: 'firstName', header: 'First Name' },
            { key: 'middleName', header: 'Middle Name' },
            { key: 'lastName', header: 'Last Name' }
        ],
        detailed: [
            { key: 'firstName', header: 'First Name' },
            { key: 'middleName', header: 'Middle Name' },
            { key: 'lastName', header: 'Last Name' },
            { key: 'email', header: 'Email' },
            { key: 'birthDate', header: 'Birth Date' }
        ],
        icon: [
            { key: 'photo', header: 'Photo', render: item => <img src={item.imageSrc || defaultImage} alt="Patient" style={{ width: 50, height: 50 }} /> },
            { key: 'fullName', header: 'Full Name', render: item => `${item.firstName} ${item.middleName ? item.middleName + ' ' : ''}${item.lastName}` }
        ]
    };

    const handleSortChange = (event) => {
        setSortDirection(event.target.value);
    };

    return (
        <div style={{height: '100%',}}>
            <label htmlFor="sortSelect">Sort by:</label>
            <select id="sortSelect" onChange={handleSortChange} defaultValue={sortDirection}>
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
            </select>
            <Table
                data={patientsData}
                columns={columns[viewMode]}
                onRowClick={handlePatientClick}
                sortKey={viewMode === 'icon' ? 'fullName' : 'firstName'}
                sortDirection={sortDirection}
                onSortChange={handleSortChange}
                style={{ maxHeight: '65vh', overflowY: 'auto' }}
                viewMode={viewMode}
            />
        </div>
    );
};

export default PatientSearchTable;
