import React, { useState, useEffect } from 'react';
import CalendarReact from 'react-calendar';
import moment from 'moment';
import 'react-calendar/dist/Calendar.css';

function Calendar() {
    const [date, setDate] = useState(new Date());
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAppointments();
    }, [date]);

    const fetchAppointments = async () => {
        setLoading(true);
        setError(null);
        try {

        } catch (error) {
            
        }
        setLoading(false);
    };

    const onChange = newDate => {
        setDate(newDate);
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: '#fff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            width: '45%',
            maxHeight: '80vh',
            overflow: 'auto',
            padding: '20px',
            margin: '20px auto',
            borderRadius: '8px',
            border: '1px solid #ccc',
            boxSizing: 'border-box'
        }}>
            <CalendarReact
                onChange={onChange}
                value={date}
                className="react-calendar"
            />
            {loading && <p>Loading appointments...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {!loading && !error && (
                <div>
                    <h2>Appointments on {moment(date).format('MMMM Do YYYY')}</h2>
                    {appointments.length > 0 ? (
                        <ul>
                            {appointments.map((appointment, index) => (
                                <li key={index}>
                                    {moment(appointment.time).format('h:mm A')} - {appointment.title}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No appointments for this day.</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default Calendar;
