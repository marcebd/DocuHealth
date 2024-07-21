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
        <div style={{ outline: '2px solid black', padding: '20px', margin: '20px', backgroundColor: 'white' }}>
        <h2 style={{ color: 'black' }}>Scheduler</h2>
        <form onSubmit={handleSubmit}>
            {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
            <div>
            <label htmlFor="appointmentTime" style={{ color: 'black' }}>Appointment Time:<span style={{ color: 'red' }}>*</span></label>
            <input
                type="datetime-local"
                id="appointmentTime"
                value={appointmentTime}
                onChange={e => setAppointmentTime(e.target.value)}
                style={{ backgroundColor: 'white', border: '1px solid lightgrey', borderRadius: '5px', padding: '10px' }}
            />
            </div>
            <div>
            <label style={{ color: 'black' }}>Time Zone:<span style={{ color: 'red' }}>*</span> {timeZone}</label>
            <p onClick={() => setShowTimeZoneDropdown(true)} style={{color: 'blue'}}>This is not the patient's timezone.</p>
            {showTimeZoneDropdown && (
                <select
                value={timeZone}
                onChange={e => {
                    setTimeZone(e.target.value);
                    setShowTimeZoneDropdown(false);
                }}
                style={{ marginLeft: '10px', backgroundColor: 'white', border: '1px solid lightgrey', borderRadius: '5px', padding: '10px' }}
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
                <button type="button" onClick={handleConfirmTimeZone}>Confirm Time Zone</button>
            )}
            </div>
            {notificationSettings.map((setting, index) => (
            <div key={index}>
                            <label htmlFor={`advanceNumber-${index}`} style={{ color: 'black' }}>Advance Notification:</label>
                <input
                type="number"
                id={`advanceNumber-${index}`}
                min="1"
                value={setting.number}
                onChange={e => handleNotificationChange(index, 'number', parseInt(e.target.value))}
                style={{ width: '50px', marginRight: '10px', backgroundColor: 'white', border: '1px solid lightgrey', borderRadius: '5px'}}
                />
                <select
                id={`advanceUnit-${index}`}
                value={setting.frequency}
                onChange={e => handleNotificationChange(index, 'frequency', e.target.value)}
                style={{ backgroundColor: 'white', border: '1px solid lightgrey', borderRadius: '5px', padding: '10px' }}
                >
                <option value="minute">minute</option>
                <option value="hour">hour</option>
                <option value="day">day</option>
                <option value="week">week</option>
                <option value="month">month</option>
                </select>
            </div>
            ))}
            <button type="button" onClick={handleAddNotification} style={{ backgroundColor: 'lightgrey', color: 'black', border: 'none', borderRadius: '5px', padding: '10px' }}>Add Another Notification</button>
            <button type="submit" style={{ backgroundColor: 'lightgrey', color: 'black', border: 'none', borderRadius: '5px', padding: '10px' }}>Schedule Appointment</button>
        </form>
        {showModal && (
            <AppointmentConfirmation
            appointment={appointment}
            show={showModal}
            handleClose={handleCloseModal}
            />
        )}
        </div>
    );
}

export default Scheduler;
