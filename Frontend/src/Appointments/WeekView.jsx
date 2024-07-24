import React, { useState } from 'react';
import moment from 'moment';
import DayColumn from './DayColumn';

const WeekView = ({ appointments, startDate, endDate, setDate, setView }) => {
    if (!appointments) {
        return <div>Loading appointments...</div>;
    }

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const [expandedGroups, setExpandedGroups] = useState({});

    const toggleGroup = (hour, timeKey) => {
        const key = `${hour}-${timeKey}`;
        setExpandedGroups(prev => {
            const newState = { ...prev, [key]: !prev[key] };
            return newState;
        });
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
                {daysOfWeek.map((day, dayIndex) => (
                    <DayColumn
                        key={dayIndex}
                        day={day}
                        dayIndex={dayIndex}
                        startDate={startDate}
                        expandedGroups={expandedGroups}
                        toggleGroup={toggleGroup}
                        navigateToDayView={navigateToDayView}
                        appointments={appointments}
                    />
                ))}
            </div>
        </div>
    );
}

export default WeekView;
