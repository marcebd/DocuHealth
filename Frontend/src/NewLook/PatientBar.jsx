import React, { useState } from 'react';
import { Avatar } from '@mui/material';
import { FaTimes } from 'react-icons/fa';
import './PatientBar.css';
import defaultImage from '../DocuImage/ProfilePicDefault.jpeg';

const PatientBar = ({ onToggleComponent, selectedPatients = [], setSelectedPatients, setFetch }) => {
    const [visible, setVisible] = useState(false);

    // Early return if no patients are selected or if selectedPatients is undefined
    if (!selectedPatients || selectedPatients.length === 0) {
        return null;
    }

    const handlePatientClick = (patientId) => {
        localStorage.setItem('viewingPatientId', patientId);
    };

    const handleRemovePatient = (patientId) => {
        const updatedPatientIds = selectedPatients.filter(patient => patient.id !== patientId);
        setSelectedPatients(updatedPatientIds);
        localStorage.setItem('selectedPatients', JSON.stringify(updatedPatientIds.map(patient => patient.id)));
        if (localStorage.getItem('viewingPatientId') === patientId.toString()) {
            localStorage.removeItem('viewingPatientId');
        }
        setFetch(true);  // Trigger re-fetch in the parent component
    };

    return (
        <div className={`patient-bar ${visible ? 'visible' : 'hidden'}`} onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}>
            <table style={{ borderCollapse: 'collapse' }}>
                <tbody>
                    {selectedPatients.map((patient, index) => (
                        <tr key={index} style={{ cursor: 'pointer', height: '5vh' }} onClick={() => handlePatientClick(patient.id)}>
                            <td style={{ padding: '10px', borderBottom: '1px solid #03055B', borderTop: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Avatar src={patient.imgSrc || defaultImage} alt={`${patient.firstName} ${patient.lastName}`} style={{ width: '80px', height: 'auto', marginRight: '2%' }} />
                                <div style={{ flexGrow: 1, flexShrink: 1, display: 'flex', justifyContent:'flex-start', alignItems: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: '200px', maxWidth: '300px' }}>
                                    <span style={{
                                        fontSize: '16px',
                                        color: '#03055B',
                                        wordWrap: 'break-word',
                                        lineHeight: '20px',
                                        maxWidth: 'calc(100% - 90px)',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        {`${patient.firstName} ${patient.middleName ? patient.middleName + ' ' : ''}${patient.lastName}`}
                                    </span>
                                </div>
                                <FaTimes style={{ color: '#FF0000', cursor: 'pointer' }} onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemovePatient(patient.id);
                                }} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PatientBar;
