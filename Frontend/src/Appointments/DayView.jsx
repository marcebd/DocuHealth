import React, { useState } from 'react';
import moment from 'moment';
import AppointmentGroup from './AppointmentGroup';
const DayView = ({ appointments, date, setDate, setView }) => {
    if (!appointments) {
        return <div>Loading appointments...</div>;
    }

    const [expandedGroups, setExpandedGroups] = useState({});

    const hours = Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        appointments: []
    }));

    appointments.forEach(appointment => {
        const hour = moment(appointment.time).hour();
        hours[hour].appointments.push(appointment);
    });

    hours.forEach(hour => {
        hour.appointments.sort((a, b) => moment(a.time).minute() - moment(b.time).minute());
    });

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

    const toggleGroup = (hour, timeKey) => {
        const key = `${hour}-${timeKey}`;
        setExpandedGroups(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const navigateDay = (direction) => {
        const newDate = moment(date).add(direction, 'days');
        setDate(newDate.toDate());
    };

    return (
        <div style={{ width: '100%', overflowX: 'auto', padding: '10px', maxWidth: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                <button onClick={() => navigateDay(-1)} style={{ marginRight: '20px' }}>&lt; Previous</button>
                <h3 onClick={() => setView('week')} style={{ width: '100%', textAlign: 'center', cursor: 'pointer' }}>
                    {moment(date).format('dddd, MMMM Do YYYY')}
                </h3>
                <button onClick={() => navigateDay(1)} style={{ marginLeft: '20px' }}> &gt; Next</button>
            </div>
            {hours.map((hour, index) => (
                <div key={index} style={{ minHeight:'15vh', position: 'relative', border: '1px solid #ddd', padding: '5px' }}>
                <strong>{moment({ hour: hour.hour }).format('ha')}</strong>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {groupAppointmentsByTime(hour.appointments).map(([timeKey, group], idx) => (
                        <AppointmentGroup
                            key={idx}
                            hourIndex={index}
                            timeKey={timeKey}
                            group={group}
                            expandedGroups={expandedGroups}
                            toggleGroup={toggleGroup}
                        />
                    ))}
                </div>
            </div>
        ))}
    </div>
);
};

export default DayView;
