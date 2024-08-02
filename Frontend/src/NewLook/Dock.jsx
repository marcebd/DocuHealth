import React from 'react';
import { FaUserMd, FaPlusSquare, FaTrashAlt, FaEdit, FaUserEdit, FaCog, FaFilePrescription, FaNotesMedical, FaCalendarAlt, FaSearch } from 'react-icons/fa';
import { RiCalendarScheduleFill } from "react-icons/ri";
import './Dock.css';

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
        </div>
    );
};

export default Dock;
