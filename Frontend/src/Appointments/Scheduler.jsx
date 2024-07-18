import React, { useState, useEffect } from 'react';
import AppointmentConfirmation from './AppointmentConfirmation';

function Scheduler() {
    const [appointmentTime, setAppointmentTime] = useState('');
    const [timeZone, setTimeZone] = useState('');
    const [timeZoneConfirmed, setTimeZoneConfirmed] = useState(false);
    const [notificationSettings, setNotificationSettings] = useState([{ number: 1, frequency: 'week' }]);
    const [error, setError] = useState('');
    const [appointment, setAppointment] = useState([]);
    const patientId = localStorage.getItem('viewingPatient');
    const [showModal, setShowModal] = useState(false);

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
            setShowModal(true)
        } catch (error) {
            setError(`${error.message}${error.error}`)
        }
    };
    const handleCloseModal = () => {
        setShowModal(false);
    };
    return (
        <div style={{ outline: '2px solid black', padding: '20px', margin: '20px' }}>
            <h2>Scheduler</h2>
            <form onSubmit={handleSubmit}>
                {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
                <div>
                    <label htmlFor="appointmentTime">Appointment Time:<span style={{ color: 'red' }}>*</span></label>
                    <input
                        type="datetime-local"
                        id="appointmentTime"
                        value={appointmentTime}
                        onChange={e => setAppointmentTime(e.target.value)}
                    />
                </div>
                <div>
                    <label>Time Zone:<span style={{ color: 'red' }}>*</span> {timeZone}</label>
                    {timeZoneConfirmed ? (
                        <span> - Confirmed</span>
                    ) : (
                        <>
                            <button type="button" onClick={() => setTimeZoneConfirmed(true)}>Is this correct?</button>
                            <select
                                value={timeZone}
                                onChange={e => {
                                    setTimeZone(e.target.value);
                                    setTimeZoneConfirmed(false);
                                }}
                                style={{ marginLeft: '10px' }}
                            >
                                <option value="UTC">UTC</option>
                                <option value="EST">EST</option>
                                <option value="PST">PST</option>
                                <option value="CST">CST</option>
                                <option value="MST">MST</option>
                                <option value="IST">IST</option>
                                <option value="GMT">GMT</option>
                                <option value="CET">CET</option>
                                <option value="EET">EET</option>
                                <option value="JST">JST</option>
                            </select>
                        </>
                    )}
                </div>
                {notificationSettings.map((setting, index) => (
                    <div key={index}>
                        <label htmlFor={`advanceNumber-${index}`}>Advance Notification:</label>
                        <input
                            type="number"
                            id={`advanceNumber-${index}`}
                            min="1"
                            value={setting.number}
                            onChange={e => handleNotificationChange(index, 'number', parseInt(e.target.value))}
                            style={{ width: '50px', marginRight: '10px' }}
                        />
                        <select
                            id={`advanceUnit-${index}`}
                            value={setting.frequency}
                            onChange={e => handleNotificationChange(index, 'frequency', e.target.value)}
                        >
                            <option value="minute">minute</option>
                            <option value="hour">hour</option>
                            <option value="day">day</option>
                            <option value="week">week</option>
                            <option value="month">month</option>
                        </select>
                    </div>
                ))}
                <button type="button" onClick={handleAddNotification}>Add Another Notification</button>
                <button type="submit">Schedule Appointment</button>
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
