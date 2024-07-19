import React, { useState, useEffect } from 'react';

const PatientSearchTable = ({ patientsData }) => {
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
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                <thead>
                    <tr>
                        <th style={{ backgroundColor: '#f2f2f2', padding: '8px', border: '1px solid #ddd' }}>First Name</th>
                        <th style={{ backgroundColor: '#f2f2f2', padding: '8px', border: '1px solid #ddd' }}>Middle Name</th>
                        <th style={{ backgroundColor: '#f2f2f2', padding: '8px', border: '1px solid #ddd' }}>Last Name</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedData.map((patient) => (
                        <tr key={patient.id}>
                            <td style={{ padding: '8px', border: '1px solid #ddd', maxWidth: '100px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{patient.firstName}</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd', maxWidth: '100px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{patient.middleName}</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd', maxWidth: '100px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{patient.lastName}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PatientSearchTable;
