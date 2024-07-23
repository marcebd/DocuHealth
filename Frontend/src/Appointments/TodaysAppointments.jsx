import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import Table from '../Patient/Table';

function TodaysAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [error, setError] = useState(null);
    const userId = JSON.parse(localStorage.getItem('userId'));
    const [loading, setLoading] = useState(false);
    const [todaysAppointments, setTodaysAppointments] = useState([]);
    const [sortKey] = useState('time');
    const [sortDirection, setSortDirection] = useState('asc');

    useEffect(() => {
        fetchAppointments();
    }, [userId]);

    useEffect(() => {
        const today = moment();
        const filteredAppointments = appointments.filter(app =>
            moment(app.time, "HH:mm A").isSame(today, 'day')
        );
        setTodaysAppointments(filteredAppointments);
    }, [appointments]);

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
                    middleName: user.middleName || '',
                    lastName: user.lastName,
                    email: user.email,
                    time: moment(appointment.appointmentTime).format('hh:mm A')
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

    const columns = [
        { key: 'time', header: 'Time' },
        { key: 'firstName', header: 'First Name' },
        { key: 'middleName', header: 'Middle Name' },
        { key: 'lastName', header: 'Last Name' },
        { key: 'email', header: 'Email' }
    ];

    const handleRowClick = (item) => {
        console.log('Row clicked:', item);
    };

    const handleSortChange = (event) => {
        const { value } = event.target;
        setSortDirection(value);
    };

    return (
        <div style={{
            outline: 'none',
            padding: '20px',
            margin: '20px auto',
            backgroundColor: 'white',
            width: '100%',
            maxHeight: '100%',
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
                Today's Appointments
            </h2>
            {loading && <p>Loading...</p>}
            {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
            <Table
                data={todaysAppointments}
                columns={columns}
                onRowClick={handleRowClick}
                sortKey={sortKey}
                sortDirection={sortDirection}
                onSortChange={handleSortChange}
            />
        </div>
    );
}

export default TodaysAppointments;
