import moment from 'moment';
const AppointmentGroup = ({ hourIndex, timeKey, group, expandedGroups, toggleGroup }) => {
    const groupKey = `${hourIndex}-${timeKey}`;
    const isExpanded = expandedGroups[groupKey];
    const visibleAppointments = isExpanded ? group : group.slice(0, 1);

    return (
        <div style={{ display: 'flex', gap: '10px', overflowX: isExpanded ? 'auto' : 'hidden' }}>
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
                <div onClick={() => toggleGroup(hourIndex, timeKey)} style={{
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
};

export default AppointmentGroup;
