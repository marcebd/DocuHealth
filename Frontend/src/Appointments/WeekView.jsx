import React, { useState } from 'react';
import moment from 'moment';

const WeekView = ({ appointments, startDate, endDate, setDate, setView }) => {
    if (!appointments) {
        return <div>Loading appointments...</div>;
    }

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const [expandedGroups, setExpandedGroups] = useState({});

    const getAppointmentsForHour = (dayIndex, hour) => {
        return appointments
            .filter(appointment =>
                moment(appointment.time).isoWeekday() === dayIndex + 1 &&
                moment(appointment.time).hour() === hour
            )
            .sort((a, b) => moment(a.time).minute() - moment(b.time).minute());
    };

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

    const navigateWeek = (direction) => {
        const newStartDate = moment(startDate).add(direction, 'weeks').startOf('isoWeek');
        const newEndDate = moment(newStartDate).endOf('isoWeek');
        setDate(newStartDate.toDate());
    };

    const navigateToDayView = (dayDate) => {
        setDate(dayDate.toDate());
        setView('day');
    };

    const columns = daysOfWeek.map((day, dayIndex) => {
        const dayDate = moment(startDate).add(dayIndex, 'days');
        return (
            <div key={day} style={{ flex: 1, display: 'flex', flexDirection: 'column', margin: '0 5px', maxWidth: '100%', height: '100%' }}>
                <h3 onClick={() => navigateToDayView(dayDate)} style={{ cursor: 'pointer' }}>{day} {dayDate.format('D')}</h3>
                {Array.from({ length: 24 }, (_, i) => i).map(hour => {
                    const appointmentsForHour = getAppointmentsForHour(dayIndex, hour);
                    return (
                        <div key={hour} style={{ width: '14vw', minHeight: '15vh', maxHeight: '15vh', position: 'relative', border: '1px solid #ccc', padding: '10px', margin: '5px 0', overflowY: 'auto' }}>
                            <strong>{moment({ hour }).format('h A')}</strong>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {groupAppointmentsByTime(appointmentsForHour).map(([timeKey, group], idx) => {
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
                    );
                })}
            </div>
        );
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', margin: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
                <button onClick={() => navigateWeek(-1)}>Previous Week</button>
                <h2 onClick={() => setView('month')} style={{ cursor: 'pointer' }}>
                    {moment(startDate).format('MMMM Do')} - {moment(endDate).format('MMMM Do')}
                </h2>
                <button onClick={() => navigateWeek(1)}>Next Week</button>
            </div>
            <div style={{ display: 'flex', flexGrow: 1, overflowX: 'auto' }}>
                {columns}
            </div>
        </div>
    );
};

export default WeekView;
