import express from "express";
import moment from 'moment';
import momentTimezone from 'moment-timezone';
import mailchimp from '@mailchimp/mailchimp_marketing';
const app = express();
import { config as dotenvConfig } from 'dotenv';
dotenvConfig();

app.listen(3005, () => {
    console.log('Server running on port 3005');
});
mailchimp.setConfig({
    apiKey: process.env.MAILCHIMP_API_KEY,
    server: "us14",  // Adjust as per your Mailchimp server prefix
});

const listId = "4b7429611c";  // Your Mailchimp list ID

async function fetchAppointments() {
    try {
        const response = await fetch(`http://localhost:3001/appointments/scheduled`, {
            method: 'GET'
        });
        const data = await response.json();
        return JSON.parse(data);
    } catch (error) {
        console.error('Failed to fetch appointments:', error);
        throw error;
    }
}

async function scheduleEmail(email, appointmentTime, timeZone, firstName, lastName) {
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
}

async function handleScheduleEmails() {
    const appointments = await fetchAppointments();
    console.log(appointments);
    appointments.forEach(async (appt) => {
        const { email, appointmentTime, timeZone, firstName, lastName } = appt;
        const now = moment();
        const appointmentMoment = momentTimezone(appointmentTime, timeZone);

        if (now.isSame(appointmentMoment, 'minute')) {
            await scheduleEmail(email, appointmentTime, timeZone, firstName, lastName);
        }
    });
}

// Run the scheduling check every minute
setInterval(() => {
    handleScheduleEmails();
}, 60);
