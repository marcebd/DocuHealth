import React, { useState } from 'react';
import moment from 'moment';

const WeekView = ({ appointments, startDate, endDate, setDate }) => {
    if (!appointments) {
        return <div>Loading appointments...</div>;
    }

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const [expandedGroups, setExpandedGroups] = useState({});

    // Function to get appointments for a specific hour and day
    const getAppointmentsForHour = (dayIndex, hour) => {
        return appointments
        .filter(appointment =>
            moment(appointment.time).isoWeekday() === dayIndex + 1 &&
            moment(appointment.time).hour() === hour
        )
        .sort((a, b) => moment(a.time).minute() - moment(b.time).minute());
    };

    const hoursOfDay = Array.from({ length: 24 }, (_, i) => i); // Array of hours from 0 to 23

    const groupAppointmentsByTime = (appointments) => {
        const groups = {};
        appointments.forEach(appointment => {
        const timeKey = moment(appointment.time).format('HH:mm');
        if (!groups[timeKey]) {
            groups[timeKey] = [];
        }
        groups[timeKey].push(appointment);
        });
        return Object.entries(groups);
    };

    const toggleGroup = (dayIndex, hour, timeKey) => {
        const key = `${dayIndex}-${hour}-${timeKey}`;
        setExpandedGroups(prev => ({
        ...prev,
        [key]: !prev[key]
        }));
    };

    const columns = daysOfWeek.map((day, dayIndex) => (
        <div key={day} style={{ flex: 1, display: 'flex', flexDirection: 'column', margin: '0 5px', maxWidth: '100%' }}>
        <h3>{day}</h3>
        {hoursOfDay.map(hour => (
            <div key={hour} style={{ width: '14vw', minHeight: '15vh', position: 'relative', border: '1px solid #ccc', padding: '10px', margin: '5px 0' }}>
            <strong>{moment({ hour }).format('h A')}</strong>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {groupAppointmentsByTime(getAppointmentsForHour(dayIndex, hour)).map(([timeKey, group], idx) => {
                const groupKey = `${dayIndex}-${hour}-${timeKey}`;
                const isExpanded = expandedGroups[groupKey];
                const visibleAppointments = isExpanded ? group : group.slice(0, 1);
                return (
                    <div key={idx} style={{ display: 'flex', gap: '10px', overflowX: isExpanded ? 'auto' : 'hidden' }}>
                    {visibleAppointments.map((appointment, subIdx) => (
                        <div key={subIdx} style={{
                        minWidth: '5vw',
                        minHeight: '5vh',
                        height: '10vh',
                        flexGrow: 1,
                        backgroundColor: '#f0f0f0',
                        padding: '5px',
                        borderRadius: '5px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                        }}>
                        <strong>{moment(appointment.time).format('h:mm A')}</strong>
                        <div>{appointment.firstName} {appointment.lastName}</div>
                        <div>{appointment.email}</div>
                        </div>
                    ))}
                    {group.length > 1 && !isExpanded && (
                        <div onClick={() => toggleGroup(dayIndex, hour, timeKey)} style={{
                        cursor: 'pointer',
                        backgroundColor: '#ccc',
                        padding: '5px',
                        borderRadius: '5px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                        }}>
                        +{group.length - 1} more
                        </div>
                    )}
                    </div>
                );
                })}
            </div>
            </div>
        ))}
        </div>
    ));

    const navigateWeek = (direction) => {
        const newStartDate = moment(startDate).add(direction, 'weeks').startOf('week');
        const newEndDate = moment(newStartDate).endOf('week');
        setDate(newStartDate.toDate(), newEndDate.toDate());
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
                <button onClick={() => navigateWeek(-1)}>Previous Week</button>
                <h2>{moment(startDate).format('MMMM Do')} - {moment(endDate).format('MMMM Do')}</h2>
                <button onClick={() => navigateWeek(1)}>Next Week</button>
            </div>
            <div style={{ display: 'flex', overflowX: 'auto' }}>
                {columns}
            </div>
        </div>
    );
}

export default WeekView;
