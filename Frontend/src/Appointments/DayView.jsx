import React from 'react';
import moment from 'moment';

const DayView = ({ appointments, date, setDate }) => {
    if (!appointments) {
        return <div>Loading appointments...</div>;
    }

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
        return Object.values(groups);
    };
    const navigateDay = (direction) => {
        const newDate = moment(date).add(direction, 'days');
        setDate(newDate.toDate());
    };

    return (
        <div style={{ width: '70%', overflowX: 'auto', padding: '10px', maxWidth: '70vw' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                <button onClick={() => navigateDay(-1)} style={{ marginRight: '20px' }}>&lt; Previous</button>
                <div style={{display:'flex'}}>
                <h3 style={{ width: '100%', textAlign: 'center' }}>
                    {moment(date).format('dddd, MMMM Do YYYY')}
                </h3>
                </div>
                <button onClick={() => navigateDay(1)} style={{ marginLeft: '20px' }}> &gt; Next</button>
            </div>
            {hours.map((hour, index) => (
                <div key={index} style={{ minHeight: '15vh', position: 'relative', border: '1px solid #ddd', padding: '5px' }}>
                    <strong>{moment({ hour: hour.hour }).format('ha')}</strong>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {groupAppointmentsByTime(hour.appointments).map((group, idx) => (
                            <div key={idx} style={{ display: 'flex', gap: '10px' }}>
                                {group.map((appointment, subIdx) => (
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
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DayView;
