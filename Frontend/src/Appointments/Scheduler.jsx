import React, { useState, useEffect } from 'react';
import Email from "./email";

function Scheduler() {
    const [appointmentTime, setAppointmentTime] = useState('');
    const [timeZone, setTimeZone] = useState('');
    const [timeZoneConfirmed, setTimeZoneConfirmed] = useState(false);
    const [advanceNumber, setAdvanceNumber] = useState(1);
    const [advanceUnit, setAdvanceUnit] = useState('week');
    const [error, setError] = useState('');
    const [appointment, setAppointment]= useState([]);
    const patientId = localStorage.getItem('viewingPatient');

    useEffect(() => {
        const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        setTimeZone(userTimeZone);
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if(!appointmentTime || !timeZone){
            setError("Required fields must be filled.");
            return;
        }
        setError('');
        const data = {
            appointmentTime,
            timeZone,
            advanceNumber,
            advanceUnit
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
        } catch (error) {
            setError(`${error.message}${error.error}`)
        }
    };
    return (
        <div style={{ outline: '2px solid black', padding: '20px', margin: '20px' }}>
            <h2>Scheduler</h2>
            <form onSubmit={handleSubmit}>
            {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
                <div>
                    <label htmlFor="appointmentTime">Appointment Time:</label>
                    <input
                        type="datetime-local"
                        id="appointmentTime"
                        value={appointmentTime}
                        onChange={e => setAppointmentTime(e.target.value)}
                    />
                </div>
                <div>
                    <label>Time Zone: {timeZone}</label>
                    {timeZoneConfirmed ? (
                        <span> - Confirmed</span>
                    ) : (
                        <>
                            <button type="button" onClick={() => setTimeZoneConfirmed(true)}>Is this correct?</button>
                            <select
                                value={timeZone}
                                onChange={e => {
                                    setTimeZone(e.target.value);
                                    setTimeZoneConfirmed(true);
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
                <div>
                    <label htmlFor="advanceNumber">Advance Notification:</label>
                    <input
                        type="number"
                        id="advanceNumber"
                        min="1"
                        value={advanceNumber}
                        onChange={e => setAdvanceNumber(parseInt(e.target.value))}
                        style={{ width: '50px', marginRight: '10px' }}
                    />
                    <select
                        id="advanceUnit"
                        value={advanceUnit}
                        onChange={e => setAdvanceUnit(e.target.value)}
                    >
                        <option value="week">week</option>
                        <option value="day">day</option>
                        <option value="hour">hour</option>
                    </select>
                </div>
                <button type="submit">Schedule Appointment</button>
            </form>
            <Email appointment={appointment}/>
        </div>
    );
}

export default Scheduler;
