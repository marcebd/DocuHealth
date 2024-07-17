import React, { useState, useEffect } from 'react';

function Scheduler() {
    const [appointmentTime, setAppointmentTime] = useState('');
    const [timeZone, setTimeZone] = useState('');
    const [timeZoneConfirmed, setTimeZoneConfirmed] = useState(false);
    const [advanceNumber, setAdvanceNumber] = useState(1);
    const [advanceUnit, setAdvanceUnit] = useState('week');

    useEffect(() => {
        const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        setTimeZone(userTimeZone);
    }, []);

    const handleSubmit = async (event) => {
        console.log(appointmentTime);
        console.log(timeZone);
        console.log(timeZoneConfirmed);
        console.log(advanceNumber);
        console.log(advanceNumber);
    };

    return (
        <div style={{ outline: '2px solid black', padding: '20px', margin: '20px' }}>
            <h2>Scheduler</h2>
            <form onSubmit={handleSubmit}>
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
        </div>
    );
}

export default Scheduler;
