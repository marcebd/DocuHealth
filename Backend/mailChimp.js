import express from "express";
import moment from 'moment-timezone';
import fetch from 'node-fetch';
import mailchimp from '@mailchimp/mailchimp_marketing';
import { config as dotenvConfig } from 'dotenv';
dotenvConfig();

const app = express();
const PORT = process.env.PORT || 3004;
const listId = "4b7429611c";

mailchimp.setConfig({
    apiKey: process.env.MAILCHIMP_API_KEY,
    server: "us14",
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

async function fetchAppointments() {
    try {
        const response = await fetch(`http://localhost:3001/appointments/scheduled`, {
            method: 'GET'
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
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
                preview_text: `Hi ${firstName}, just a reminder about your upcoming appointment. Your appointment is ${appointmentTime} ${timeZone}`,
                title: `${firstName}'s Appointment Reminder`,
                template_id: 'your_template_id'
            }
        });

        const campaignId = response.id;
        await mailchimp.campaigns.send(campaignId);
       //console.log(`Email sent successfully: ${campaignId}`);
    } catch (error) {
        console.error('Failed to create or send campaign:', error);
        throw error;
    }
}

async function handleScheduleEmails() {
    try {
        const appointments = await fetchAppointments();
        appointments.forEach(async (appointment) => {
            const { email, appointmentTime, timeZone, firstName, lastName } = appointment;
            if (!email || !timeZone) {
                //console.log(`Skipping appointment for ${firstName} ${lastName} due to missing email or timeZone.`);
                return;
            }
            try {
                const now = moment();
                //console.log("Appointment:", appointment);
                const appointmentMoment = moment.tz(appointmentTime, timeZone);
                //console.log("Appointment After:", appointment);
                if (now.isSame(appointmentMoment, 'minute')) {
                    await scheduleEmail(email, appointmentTime, timeZone, firstName, lastName);
                }
            } catch (error) {
                console.error(`Error scheduling email for ${firstName} ${lastName}:`, error);
            }
        });
    } catch (error) {
        console.error('Failed to handle schedule emails:', error);
    }
}


// Run the scheduling check every minute
setInterval(() => {
    handleScheduleEmails();
}, 6000);
