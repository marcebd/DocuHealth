import React from 'react';
import moment from 'moment';

const WeekView = ({ appointments, date }) => {
    const startOfWeek = moment(date).startOf('isoWeek');
    const endOfWeek = moment(date).endOf('isoWeek');

    return (
        <div>
        <h2>Week of {startOfWeek.format('MMM Do')} to {endOfWeek.format('MMM Do')}</h2>
        <ul>
            {appointments.length > 0 ? (
            appointments.map((appointment, index) => (
                <li key={index}>
                <strong>{moment(appointment.time).format('dddd, h:mm A')}</strong>: {appointment.firstName} {appointment.lastName} - {appointment.email}
                </li>
            ))
            ) : (
            <p>No appointments for this week.</p>
            )}
        </ul>
        </div>
    );
};

export default WeekView;
