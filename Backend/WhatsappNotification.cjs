const express = require('express');
const moment = require('moment-timezone');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3007;
const twilio = require('twilio');
const client = new twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);
const cron = require('node-cron');

// Object to track sent notifications
const sentNotifications = {};

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
        console.log('Fetched appointments:', appointments);
        return appointments;
    } catch (error) {
        console.error('Failed to fetch appointments:', error);
        throw error;
    }
}

async function scheduleWhatsapp(phoneNumber, appointmentTime, timeZone, firstName, lastName) {
    try {
        const message = await client.messages.create({
            from: `whatsapp:${process.env.TWILIO_WHATSAPP_SENDER_ID}`,
            to: `whatsapp:${phoneNumber}`,
            templateId: 'HX7a531b0b3e76f444aaf97e249a4d2a02',
            body: `Hi ${firstName}, just a reminder about your upcoming appointment at ${appointmentTime} ${timeZone}`
        });
        console.log(message);
        return true; // Return true on successful whatsapp send
    } catch (error) {
        console.error('Failed to schedule whatsapp:', error);
        return false; // Return false on failure
    }
}

async function handleScheduleWhatsapps() {
    try {
        const data = await fetchAppointments();
        console.log('Received appointments:', data);
        const patients = JSON.parse(data);
        if (!Array.isArray(patients)) {
            console.error('Expected an array of patients, received:', patients);
            return;
        }
        patients.forEach((patient) => {
            const { firstName, lastName, phone_number } = patient;
            patient.appointments.forEach((appointment) => {
                const { appointmentTime, timeZone, notificationSettings } = appointment;
                console.log(`Processing appointment for ${firstName} ${lastName} at ${appointmentTime} ${timeZone}`);
                if (!phone_number || !timeZone) {
                    console.log(`Skipping appointment for ${firstName} ${lastName} due to missing phoneNumber or timeZone.`);
                    return;
                }
                notificationSettings.forEach((setting) => {
                    const notificationTime = moment.tz(appointmentTime, timeZone)
                        .subtract(setting.number, setting.frequency)
                        .format('YYYY-MM-DD HH:mm');
                    const currentTime = moment.tz(timeZone).format('YYYY-MM-DD HH:mm');
                    console.log(`Checking notification setting for ${firstName} ${lastName} at ${notificationTime}`);
                    if (notificationTime === currentTime) {
                        console.log(`Sending notification for ${firstName} ${lastName} at ${notificationTime}`);
                        const notificationId = `${appointment.id}-${setting.number}-${setting.frequency}-${notificationTime}`;
                        if (!sentNotifications[notificationId]) {
                            scheduleWhatsapp(phone_number, appointmentTime, timeZone, firstName, lastName);
                            sentNotifications[notificationId] = true;
                        } else {
                            console.log(`Notification already sent for ${firstName} ${lastName} at ${notificationTime}`);
                        }
                    } else {
                        console.log(`Notification time not reached for ${firstName} ${lastName} at ${notificationTime}`);
                    }
                });
            });
        });
    } catch (error) {
        console.error('Failed to handle schedule whatsapp:', error);
    }
}
// // Run the scheduling check every minute
// cron.schedule('* * * * *', handleScheduleWhatsapps);
