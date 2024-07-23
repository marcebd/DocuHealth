import React from 'moment';
import AppointmentGroup from './AppointmentGroup';
import moment from 'moment';

const DayColumn = ({ day, dayIndex, startDate, expandedGroups, navigateToDayView, appointments, toggleGroup }) => {
    const dayDate = moment(startDate).add(dayIndex, 'days');
    const getAppointmentsForHour = (hour) => {
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

    return (
        <div key={day} style={{ flex: 1, display: 'flex', flexDirection: 'column', margin: '0 5px', maxWidth: '100%', height: '100%' }}>
            <h3 onClick={() => navigateToDayView(dayDate)} style={{ cursor: 'pointer' }}>{day} {dayDate.format('D')}</h3>
            {Array.from({ length: 24 }, (_, i) => i).map(hour => {
                const appointmentsForHour = getAppointmentsForHour(hour);
                return (
                    <div key={hour} style={{ width: '14vw', minHeight: '15vh', maxHeight: '15vh', position: 'relative', border: '1px solid #ccc', padding: '10px', margin: '5px 0', overflowY: 'auto' }}>
                        <strong>{moment({ hour }).format('h A')}</strong>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {groupAppointmentsByTime(appointmentsForHour).map(([timeKey, group], idx) => (
                                <AppointmentGroup
                                    key={idx}
                                    dayIndex={dayIndex}
                                    hour={hour}
                                    timeKey={timeKey}
                                    group={group}
                                    expandedGroups={expandedGroups}
                                    toggleGroup={toggleGroup}
                                />
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default DayColumn;
