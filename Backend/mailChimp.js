import express from "express";
import moment from 'moment-timezone';
import fetch from 'node-fetch';
import { config as dotenvConfig } from 'dotenv';
dotenvConfig();

const app = express();
const PORT = process.env.PORT || 3004;

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
        const data = await response.text();
        const appointments = JSON.parse(data);
        return appointments;
    } catch (error) {
        console.error('Failed to fetch appointments:', error);
        throw error;
    }
}

async function scheduleEmail(email, appointmentTime, timeZone, firstName, lastName) {
    console.log(`Email will be sent to ${email} for ${firstName} ${lastName} at ${appointmentTime} ${timeZone}`);
}

async function handleScheduleEmails() {
    try {
        const data = await fetchAppointments();  
        const patients = JSON.parse(data);
        if (!Array.isArray(patients)) {
            console.error('Expected an array of patients, received:', patients);
            return;
        }
        patients.forEach(patient => {
            const { firstName, lastName, email } = patient;
            patient.appointments.forEach(async (appointment) => {
                const { appointmentTime, timeZone, notificationSettings } = appointment;

                if (!email || !timeZone) {
                    console.log(`Skipping appointment for ${firstName} ${lastName} due to missing email or timeZone.`);
                    return;
                }

                notificationSettings.forEach(async (setting) => {
                    const notificationTime = moment.tz(appointmentTime, timeZone)
                        .subtract(setting.number, setting.frequency)
                        .format('HH:mm');

                    const currentTime = moment.tz(timeZone).format('HH:mm');

                    if (notificationTime === currentTime) {
                        await scheduleEmail(email, appointmentTime, timeZone, firstName, lastName);
                    } else {
                        console.log(`Not time to send email to ${email} for ${firstName} ${lastName}. Current time: ${currentTime}, Notification time: ${notificationTime}`);
                    }
                });
            });
        });
    } catch (error) {
        console.error('Failed to handle schedule emails:', error);
    }
}

// Run the scheduling check every minute
setInterval(() => {
    handleScheduleEmails();
}, 600);
