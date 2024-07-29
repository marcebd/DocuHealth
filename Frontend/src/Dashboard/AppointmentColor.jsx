import React, { useState } from 'react';
import './AppointmentColor.css';

const AppointmentColor = () => {
    const [viewingPatientId] = useState(localStorage.getItem('viewingPatient'));
    const [selectedType, setSelectedType] = useState(null);
    const appointmentTypes = [
        { type: 'Routine', color: 'grey' },
        { type: 'CommonSickness', color: 'green' },
        { type: 'RoutineSickness', color: 'yellow' },
        { type: 'EmergencySickness', color: 'orange' },
        { type: 'Emergency', color: 'red' }
    ];

    const handleClick = async (type) => {
        setSelectedType(type);
        const selected = {
            type: type
        };
        try {
            const response = await fetch(`http://localhost:3002/appointment/severity/${viewingPatientId}`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({selected})
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to update appointment');
            }
        } catch (error) {
            console.error('Error updating appointment:', error);
            console.log(error);
        }
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '20px',
            borderRadius: '25px',
            backgroundColor: 'white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
            width: '100%'
        }}>
            <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>Case Severity</h2>
            <div style={{ marginBottom: '10px' }}>{selectedType ? selectedType.replace(/([A-Z])/g, ' $1').trim() : 'Select a type'}</div>
            <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%', alignItems: 'center' }}>
                {appointmentTypes.map((item) => (
                    <div
                        key={item.type}
                        style={{
                            width: selectedType === item.type ? '70px' : '50px',
                            height: selectedType === item.type ? '70px' : '50px',
                            borderRadius: '50%',
                            backgroundColor: item.color,
                            margin: '5px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            position: 'relative',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                        onClick={() => handleClick(item.type)}
                    />
                ))}
            </div>
        </div>
    );
};

export default AppointmentColor;
