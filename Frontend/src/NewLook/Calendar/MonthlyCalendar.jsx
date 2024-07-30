import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import moment from 'moment';
import './MonthlyCalendar.css'

function MonthlyCalendar() {
    const [date, setDate] = useState(new Date());
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [view, setView] = useState('dayGridMonth');
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
                    title: `${user.firstName} ${user.lastName}`,
                    start: moment(appointment.appointmentTime).toISOString(),
                    end: moment(appointment.appointmentTime).add(30, 'minutes').toISOString(), // assuming 30 min slots
                    extendedProps: {
                        email: user.email
                    }
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

    const handleDateClick = (arg) => {
        setDate(new Date(arg.dateStr));
    };

    const handleViewChange = (newView) => {
        setView(newView);
    };

    return (
        <div className="calendar-container" >
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView={view}
                events={appointments}
                dateClick={handleDateClick}
                height="auto"
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                }}
            />
            {loading && <p>Loading appointments...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}

export default MonthlyCalendar;
