import moment from 'moment-timezone';
function AppointmentConfirmation({ appointment }) {
    let cleanedAppointment = null;
    if (appointment[0]) {
        try {
            cleanedAppointment = JSON.parse(appointment);
        } catch (error) {
            console.error("Error parsing appointment data:", error);
        }
    }
    function formatMomentDate(dateString) {
        return moment(dateString).format('MMMM D, YYYY, h:mm:ss A [GMT]ZZ');
    }
    return (
        <div>
            {cleanedAppointment && (
                <div>
                    <h4>Appointment Schedules for:</h4>
                    <p>{cleanedAppointment[1].newAppointmentTime.firstName} {cleanedAppointment[1].newAppointmentTime.lastName}</p>
                    <p>Date and Time: {formatMomentDate(cleanedAppointment[1].newAppointmentTime.appointmentTime)}</p>
                    <p>Notification will be sent {cleanedAppointment[0].newNotificationSettings.number} {cleanedAppointment[0].newNotificationSettings.frequency} before the appointment</p>
                </div>
            )}
        </div>
    );
}

export default AppointmentConfirmation;
