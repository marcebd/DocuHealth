import React, { useState, useEffect } from 'react';
import CalendarReact from 'react-calendar';
import axios from 'axios';
import moment from 'moment';
import 'react-calendar/dist/Calendar.css';
import DayView from './DayView';
import WeekView from './WeekView';
import './ReactCalendar.css';

function Calendar() {
    const [date, setDate] = useState(new Date());
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [view, setView] = useState('month');
    const userId = JSON.parse(localStorage.getItem('userId'));

    useEffect(() => {
        fetchAppointments();
    }, [date, view]);

    const fetchAppointments = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`http://localhost:3001/appointments/scheduled/${userId}`);
            const users = JSON.parse(response.data);
            const allAppointments = users.flatMap(user =>
                user.appointments.map(appointment => ({
                    ...appointment,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    time: moment(appointment.appointmentTime)
                }))
            );
            setAppointments(allAppointments);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch appointments:', error);
            setError('Failed to fetch appointments. Please try again later.');
            setLoading(false);
        }
    };

    const onChange = newDate => {
        setDate(newDate);
        setView('week');
    };

    const handleViewChange = (event) => {
        setView(event.target.value);
    };

    const countAppointmentsForDay = (date) => {
        return appointments.filter(app => moment(app.time).isSame(date, 'day')).length;
    };

    const renderCalendar = () => {
        const startOfWeek = moment(date).startOf('isoWeek').toDate();
        const endOfWeek = moment(date).endOf('isoWeek').toDate();

        if (view === 'month') {
            return (
                <CalendarReact
                    onChange={onChange}
                    value={date}
                    tileContent={({ date, view }) => {
                        if (view === 'month') {
                            const count = countAppointmentsForDay(date);
                            return count > 0 ? <div style={{ fontSize: '0.8em', textAlign: 'center', marginTop: '5px' }}>{count} appointments</div> : null;
                        }
                    }}
                />
            );
        } else if (view === 'day') {
            return <DayView
                appointments={appointments.filter(app => moment(app.time).isSame(date, 'day'))}
                date={date}
                setDate={setDate}
                setView={setView}
            />;
        } else if (view === 'week') {
            return <WeekView
                appointments={appointments.filter(app => moment(app.time).isSame(date, 'isoWeek'))}
                startDate={startOfWeek}
                endDate={endOfWeek}
                setDate={setDate}
                setView={setView}
            />;
        }
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: '#fff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            maxWidth: '45vw',
            width: '45vw',
            maxHeight: '90vh',
            overflow: 'auto',
            padding:'20px',
            margin: '20px auto',
            borderRadius: '8px',
            border: '1px solid #ccc',
            boxSizing: 'border-box',
            minWidth: '45vw'
        }}>
            <select value={view} onChange={handleViewChange} style={{ marginBottom: '20px' }}>
                <option value="month">Month</option>
                <option value="day">Day</option>
                <option value="week">Week</option>
            </select>
            {renderCalendar()}
            {loading && <p>Loading appointments...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}

export default Calendar;
