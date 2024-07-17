import React, { useState, useEffect } from 'react';
import mailchimp from '@mailchimp/mailchimp_marketing';
import moment from 'moment-timezone';


function Email() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const listId = "4b7429611c";
    mailchimp.setConfig({
        apiKey: import.meta.env.VITE_MAILCHIMP_API_KEY,
        server: "us14",
    });

    const fetchAppointments = async () => {
        try {
            
        } catch (error) {

        }
    };

    useEffect(() => {
        fetchAppointments();
        const interval = setInterval(() => {
            handleScheduleEmails();
        }, 60000); // Runs every minute
        return () => clearInterval(interval);
    }, []);

    const handleScheduleEmails = async () => {
        setLoading(true);
        try {
            appointments.forEach(async (appointment) => {
                const { email, appointmentTime, timeZone, firstName, lastName } = appointment;
                const now = moment();
                const appointmentMoment = moment.tz(appointmentTime, timeZone);

                if (now.isSame(appointmentMoment, 'minute')) {
                    await scheduleEmail(email, appointmentTime, timeZone, firstName, lastName);
                }
            });
            setLoading(false);
        } catch (error) {
            console.error("Error scheduling emails:", error);
            setError(error.message);
            setLoading(false);
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

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    return (
        <div>
            {appointments.map((appointment, index) => (
                <div key={index}>
                    <h4>Appointment Details</h4>
                    <p>Time: {appointment.appointmentTime}</p>
                    <p>TimeZone: {appointment.timeZone}</p>
                    <p>Name: {appointment.firstName} {appointment.lastName}</p>
                </div>
            ))}
        </div>
    );
}

export default Email;
