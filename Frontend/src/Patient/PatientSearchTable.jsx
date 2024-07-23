import React, { useState, useEffect } from 'react';

const PatientSearchTable = ({ patientsData, handlePatientClick }) => {
    const [sortedData, setSortedData] = useState([]);

    useEffect(() => {
        sortData('asc');
    }, [patientsData]);

    const sortData = (direction) => {
        const sorted = [...patientsData].sort((a, b) => {
            const nameA = a.firstName.toUpperCase();
            const nameB = b.firstName.toUpperCase();
            return direction === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
        });
        setSortedData(sorted);
    };

    const handleSortChange = (event) => {
        sortData(event.target.value);
    };

    return (
        <div>
            <label htmlFor="sortSelect">Sort by First Name:</label>
            <select id="sortSelect" onChange={handleSortChange} defaultValue="asc">
                <option value="asc">A-Z</option>
                <option value="desc">Z-A</option>
            </select>
            <div style={{ display: 'flex', flexDirection: 'column', marginTop: '10px' }}>
                <div style={{ display: 'flex', backgroundColor: '#f2f2f2', padding: '8px', border: '1px solid #ddd' }}>
                    <span style={{ flex: 1 }}>First Name</span>
                    <span style={{ flex: 1 }}>Middle Name</span>
                    <span style={{ flex: 1 }}>Last Name</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {sortedData.map((patient) => (
                        <div key={patient.id} onClick={() => handlePatientClick(patient)} style={{ display: 'flex', padding: '8px', border: '1px solid #ddd' }}>
                            <span style={{ flex: 1, maxWidth: '100px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{patient.firstName}</span>
                            <span style={{ flex: 1, maxWidth: '100px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{patient.middleName}</span>
                            <span style={{ flex: 1, maxWidth: '100px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{patient.lastName}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PatientSearchTable;
