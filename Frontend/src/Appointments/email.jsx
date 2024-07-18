import React, { useState, useEffect } from 'react';
import mailchimp from '@mailchimp/mailchimp_marketing';
import moment from 'moment-timezone';

function Email({ appointment }) {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const userId = JSON.parse(localStorage.getItem("userId"));
    const listId = "4b7429611c";  // Your Mailchimp list ID

    mailchimp.setConfig({
        apiKey: import.meta.env.VITE_MAILCHIMP_API_KEY,
        server: "us14",
    });

    // Parse appointment if it exists and is a string
    let cleanedAppointment = null;
    if (appointment[0]) {
        try {
            cleanedAppointment = JSON.parse(appointment);
            console.log(cleanedAppointment);
        } catch (error) {
            console.error("Error parsing appointment data:", error);
        }
    }

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:3001/appointments/scheduled/${userId}`, {
                method: 'GET'
            });
            const data = await response.json();
            setAppointments(data);
        } catch (error) {
            console.error('Failed to fetch appointments:', error);
            setError(`${error.message} ${error.error}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
        const interval = setInterval(() => {
            handleScheduleEmails();
        }, 60000);  // Check every minute
        return () => clearInterval(interval);
    }, []);

    const handleScheduleEmails = async () => {
        try {
            console.log(appointments);
            appointments.forEach(async (appt) => {
                const { email, appointmentTime, timeZone, firstName, lastName } = appt;
                const now = moment();
                const appointmentMoment = moment.tz(appointmentTime, timeZone);

                if (now.isSame(appointmentMoment, 'minute')) {
                    await scheduleEmail(email, appointmentTime, timeZone, firstName, lastName);
                }
            });
        } catch (error) {
            console.error("Error scheduling emails:", error);
            setError(error.message);
        }
    };

    const scheduleEmail = async (email, appointmentTime, timeZone, firstName, lastName) => {
        try {
            const response = await mailchimp.campaigns.create({
                type: 'regular',
                recipients: {
                    list_id: listId,
                    email_address: email
                },
                settings: {
                    subject_line: `Appointment Reminder for ${firstName} ${lastName}`,
                    preview_text: `Hi ${firstName}, just a reminder about your upcoming appointment.`,
                    title: `${firstName}'s Appointment Reminder`,
                    template_id: 'your_template_id'  // Replace with your actual Mailchimp template ID
                }
            });

            const campaignId = response.id;
            await mailchimp.campaigns.send(campaignId);
            console.log(`Email sent successfully: ${campaignId}`);
        } catch (error) {
            console.error('Failed to create or send campaign:', error);
            throw error;
        }
    };
    function formatMomentDate(dateString) {
        return moment(dateString).format('MMMM D, YYYY, h:mm:ss A [GMT]ZZ');
    }
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
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

export default Email;
