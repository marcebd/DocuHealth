import React from 'react';
import { FaUserMd, FaPlusSquare, FaTrashAlt, FaEdit, FaUserEdit, FaCog, FaFilePrescription, FaNotesMedical, FaCalendarAlt, FaSearch, FaHome } from 'react-icons/fa';
import LogoutIcon from '@mui/icons-material/Logout';
import { RiCalendarScheduleFill } from "react-icons/ri";
import './Dock.css';
import { useNavigate } from 'react-router-dom';

const dockItems = {
    PatientManagement: [
        { icon: <FaUserMd />, name: 'Patient Info', color: '#85C1E9', key: 'patientInformation' },
        { icon: <FaPlusSquare />, name: 'Add Patient', color: '#85C1E9', key: 'addPatient' },
        { icon: <FaTrashAlt />, name: 'Delete Patient', color: '#85C1E9' }
    ],
    MedicalRecords: [
        { icon: <FaEdit />, name: 'Add Note', color: '#58D68D', key: 'addNote' },
        { icon: <FaFilePrescription />, name: 'Add Prescription', color: '#58D68D', key: 'addPrescription' },
        { icon: <FaNotesMedical />, name: 'Add Diagnosis', color: '#58D68D', key: 'addDiagnosis' }
    ],
    Scheduling: [
        { icon: <FaCalendarAlt />, name: 'Calendar', color: '#F4D03F', key: 'calendar' },
        { icon: <RiCalendarScheduleFill />, name: 'Schedule Appointment', color: '#F4D03F', key: 'addAppointment' }
    ],
    ProfileSettings: [
        { icon: <FaUserEdit />, name: 'Edit Profile', color: '#BB8FCE' },
        { icon: <FaCog />, name: 'Settings', color: '#BB8FCE' }
    ],
    PatientFolder: [
        { icon: <FaSearch />, name: 'Search Records', color: '#76D7C4', key: 'searchRecords' }
    ]
};

const Dock = ({ onToggleComponent }) => {
    const navigate = useNavigate();
    const handleHomeClick = () => {
        localStorage.removeItem('viewingPatientId');
    };

    const handleLogOutClick  = async () => {
        try {
            const response = await fetch('`http://localhost:3000/logout', {
                method: 'GET'
            });
            if (!response.ok) {
                console.error('Failed to log out:', response);
            } else {
                localStorage.removeItem('userId');
                localStorage.removeItem('patientTabs');
                localStorage.removeItem('viewingPatient');
                navigate('/');
                window.location.reload();
            }
            } catch (error) {
            console.error('Error logging out:', error);
            }
    };

    return (
        <div className="dock-container">
            {Object.keys(dockItems).map(category => (
                <div key={category} className="dock-category">
                    {dockItems[category].map(item => (
                        <button key={item.name} style={{ backgroundColor: item.color }} className="dock-button" onClick={() => item.key && onToggleComponent(item.key, item.icon, item.color)}>
                            {item.icon}
                            <span>{item.name}</span>
                        </button>
                    ))}
                </div>
            ))}
            <button className="dock-button" style={{ backgroundColor: 'red' }} onClick={handleHomeClick}>
                <FaHome style={{ color: 'white' }} />
                <span>Home</span>
            </button>
            <button className="dock-button" style={{ backgroundColor: 'red' }} onClick={handleLogOutClick}>
                <LogoutIcon style={{ color: 'white' }} />
                <span>Log Out</span>
            </button>
        </div>
    );
};

export default Dock;
