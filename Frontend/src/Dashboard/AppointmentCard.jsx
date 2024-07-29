import React from 'react';

const appointmentTypes = [
    { type: 'Routine', color: 'grey' },
    { type: 'CommonSickness', color: 'green' },
    { type: 'RoutineSickness', color: 'yellow' },
    { type: 'EmergencySickness', color: 'orange' },
    { type: 'Emergency', color: 'red' }
];

const AppointmentCard = ({ appointment }) => {
    const getTypeColor = (type) => {
        const typeObj = appointmentTypes.find(t => t.type === type);
        return typeObj ? typeObj.color : 'white';
    };

    const circleStyle = {
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        backgroundColor: getTypeColor(appointment.type),
        border: appointment.type ? 'none' : '1px solid grey'
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '10px',
            margin: '10px',
            backgroundColor: '#f9f9f9',
            fontSize: '14px'
        }}>
            <div style={circleStyle}></div>
            <span><strong>Time:</strong> {appointment.appointmentTime}</span>
            <span>Prescriptions [{appointment.numPrescriptions}]</span>
            <span>Conditions [{appointment.numConditions}]</span>
            <span>Notes [{appointment.numVisitNotes}]</span>
        </div>
    );
};

export default AppointmentCard;
