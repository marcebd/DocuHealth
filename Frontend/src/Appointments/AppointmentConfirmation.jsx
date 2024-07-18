import React from 'react';
import moment from 'moment-timezone';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

function AppointmentConfirmation({ appointment, show, handleClose }) {
    function formatMomentDate(dateString, timeZone) {
        if (!dateString || !timeZone) {
            return 'Invalid date or time zone';
        }
        return moment(dateString).tz(timeZone).format('MMMM D, YYYY, h:mm:ss A [GMT]ZZ');
    }

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Appointment Confirmation</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div></div>
                <h4>Appointment Scheduled for {appointment.appointment.patientName}</h4>
                <p>Date and Time: {formatMomentDate(appointment.appointment.appointment.appointmentTime, appointment.appointment.appointment.timeZone)}</p>
                {appointment.appointment.appointment.notificationSettings && (
                <div>
                    <p>Patient will be notified: </p>
                    <ul>
                        {appointment.appointment.appointment.notificationSettings.map((setting, index) => (
                            <li key={index}>
                                {setting.number} {setting.frequency} before the appointment
                            </li>
                        ))}
                    </ul>
                </div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default AppointmentConfirmation;
