import React, { useState } from 'react';
import { Avatar } from '@mui/material';
import { FaSearch, FaHome } from 'react-icons/fa';
import './PatientBar.css';
import defaultImage from '../DocuImage/ProfilePicDefault.jpeg';

const PatientBar = ({ onToggleComponent, selectedPatients = [] }) => {
    const [visible, setVisible] = useState(false);
    return (
        <div className={`patient-bar ${visible ? 'visible' : 'hidden'}`} onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}>
            <div className="button-container">
                <button onClick={() => onToggleComponent('searchRecords')} className="patient-bar-button">
                    <FaSearch /><span>Search Records</span>
                </button>
                <button onClick={() => {
                    localStorage.removeItem("viewingPatientId");
                }} className="patient-bar-button home-button">
                    <FaHome /><span>Home</span>
                </button>
            </div>
            {selectedPatients && selectedPatients.length > 0 && (
                <table style={{ borderCollapse: 'collapse' }}>
                    <tbody>
                        {selectedPatients.map((patient, index) => (
                            <tr key={index} style={{ cursor: 'pointer', height: '5vh' }}>
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
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default PatientBar;
