import React, { useState, useEffect } from 'react';
import AppointmentCard from './AppointmentCard';

const VisitTable = () => {
    const [patientId, setViewingPatientId] = useState(localStorage.getItem('viewingPatient'));
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await fetch(`http://localhost:3002/appointments/${patientId}`);
                if (response.ok) {
                    let data = await response.json();
                    data = JSON.parse(data);
                    setAppointments(data.appointments.map(app => ({
                        ...app,
                        appointmentTime: new Date(app.appointmentTime).toLocaleString(),
                        numPrescriptions: app.prescriptions.length,
                        numConditions: app.conditions.length,
                        numVisitNotes: app.visitNotes.length
                    })));
                } else {
                    setError('Failed to fetch appointments');
                }
            } catch (error) {
                setError('Error fetching appointments: ' + error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAppointments();
    }, [patientId]);

    return (
        <div>
            <h2>Appointments</h2>
            {isLoading ? <p>Loading...</p> : error ? <p>{error}</p> : (
                <div>
                    {appointments.length > 0 ? appointments.map(appointment => (
                        <AppointmentCard key={appointment.id} appointment={appointment} />
                    )) : <p>No appointments found.</p>}
                </div>
            )}
        </div>
    );
};

export default VisitTable;
