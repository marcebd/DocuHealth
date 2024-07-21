import React, { useState, useEffect } from 'react';
import AppointmentConfirmation from './AppointmentConfirmation';
import moment from 'moment';

function Scheduler() {
    const [appointmentTime, setAppointmentTime] = useState('');
    const [timeZone, setTimeZone] = useState('');
    const [timeZoneConfirmed, setTimeZoneConfirmed] = useState(false);
    const [notificationSettings, setNotificationSettings] = useState([{ number: 1, frequency: 'week' }]);
    const [error, setError] = useState('');
    const [appointment, setAppointment] = useState([]);
    const patientId = localStorage.getItem('viewingPatient');
    const [showModal, setShowModal] = useState(false);
    const [showTimeZoneDropdown, setShowTimeZoneDropdown] = useState(false);

    useEffect(() => {
        const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        setTimeZone(userTimeZone);
    }, []);

    const handleAddNotification = () => {
        setNotificationSettings([...notificationSettings, { number: 1, frequency: 'week' }]);
    };

    const handleNotificationChange = (index, field, value) => {
        const updatedSettings = [...notificationSettings];
        updatedSettings[index][field] = value;
        setNotificationSettings(updatedSettings);
    };

    const handleConfirmTimeZone = () => {
        setTimeZoneConfirmed(true);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!appointmentTime || !timeZone || !timeZoneConfirmed) {
        setError("Please confirm the time zone and fill all required fields.");
        return;
        }
        setError('');
        const data = {
        appointmentTime,
        timeZone,
        notificationSettings
        };
        try {
        const response = await fetch(`http://localhost:3001/appointments/schedule/${patientId}`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        });
        const scheduledAppointment = await response.json();
        setAppointment(scheduledAppointment);
        setShowModal(true);
        } catch (error) {
        setError(`${error.message}${error.error}`);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <div style={{
            outline: 'none',
            padding: '20px',
            margin: '20px auto',
            backgroundColor: 'white',
            width: '45%',
            maxHeight: '50vh',
            overflowY: 'auto',
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
        }}>
        <h2 style={{
            color: 'black',
            textAlign: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
            padding: '10px',
            borderRadius: '5px'
        }}>
        Scheduler
        </h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
            <div>
            <label htmlFor="appointmentTime" style={{ color: 'black', marginBottom: '5px' }}>Appointment Time:<span style={{ color: 'red' }}>*</span></label>
            <input
                type="datetime-local"
                id="appointmentTime"
                value={appointmentTime}
                onChange={e => setAppointmentTime(e.target.value)}
                style={{ backgroundColor: 'white', border: '1px solid lightgrey', borderRadius: '5px', padding: '10px', width: 'auto', marginLeft:'2%' }}
            />
            </div>
            <div>
            <label style={{ color: 'black', marginBottom: '5px' }}>Time Zone:<span style={{ color: 'red' }}>*</span> {timeZone}</label>
            <p onClick={() => setShowTimeZoneDropdown(true)} style={{color: 'red', cursor: 'pointer', marginBottom: '5px'}}>This is not the patient's timezone.</p>
            {showTimeZoneDropdown && (
                <select
                value={timeZone}
                onChange={e => {
                    setTimeZone(e.target.value);
                    setShowTimeZoneDropdown(false);
                }}
                style={{ marginLeft: '10px', backgroundColor: 'white', border: '1px solid lightgrey', borderRadius: '5px', padding: '10px', width: 'calc(100% - 10px)' }}
                >
                {Object.keys(moment.tz.names()).map((key) => (
                    <option key={key} value={moment.tz.names()[key]}>{moment.tz.names()[key]}</option>
                ))}
                </select>
            )}
            </div>
            <div>
            {timeZoneConfirmed ? (
                <p>Time Zone Confirmed</p>
            ) : (
                <div style={{display:'flex', justifyContent: 'space-around'}}>
                <button type="button" onClick={handleConfirmTimeZone} style={{ backgroundColor: 'lightgrey', color: 'black', border: 'none', borderRadius: '5px', padding: '10px' }}>Confirm Time Zone</button>
                </div>
            )}
            </div>
            {notificationSettings.map((setting, index) => (
            <div key={index} style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
                <label htmlFor={`advanceNumber-${index}`} style={{ color: 'black' }}>Advance Notification:</label>
                <div style={{display:'flex', justifyContent: 'flex-start'}}>
                    <input
                    type="number"
                    id={`advanceNumber-${index}`}
                    min="1"
                    value={setting.number}
                    onChange={e => handleNotificationChange(index, 'number', parseInt(e.target.value))}
                    style={{ marginRight: '10px', backgroundColor: 'white', border: '1px solid lightgrey', borderRadius: '5px', width: '20%'}}
                    />
                    <select
                        id={`advanceUnit-${index}`}
                        value={setting.frequency}
                        onChange={e => handleNotificationChange(index, 'frequency', e.target.value)}
                        style={{
                            backgroundColor: 'white',
                            border: '1px solid lightgrey',
                            borderRadius: '5px',
                            padding: '10px',
                            width: '50%'
                        }}
                        >
                        <option value="minute">minute</option>
                        <option value="hour">hour</option>
                        <option value="day">day</option>
                        <option value="week">week</option>
                        <option value="month">month</option>
                    </select>
                </div>
            </div>
            ))}
            <button
            type="button"
            onClick={handleAddNotification}
            style={{
                backgroundColor: 'white',
                color: 'black',
                border: 'none',
                borderRadius: '5px',
                padding: '10px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer'
            }}
            onMouseOver={e => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.cursor = 'pointer';
            }}
            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
            >
            Add Another Notification
            </button>
            <button
            type="submit"
            style={{
                backgroundColor: 'white',
                color: 'black',
                border: 'none',
                borderRadius: '5px',
                padding: '10px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer'
            }}
            onMouseOver={e => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.cursor = 'pointer';
            }}
            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
            >
            Schedule Appointment
            </button>
            </form>
            {showModal && (
                <AppointmentConfirmation
                appointment={appointment}
                show={showModal}
                handleClose={handleCloseModal}
                style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                    zIndex: 1000
                }}
                />
            )}
            </div>
    );
}

export default Scheduler;
