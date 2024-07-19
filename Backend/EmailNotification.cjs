const express = require('express');
const moment = require('moment-timezone');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3004;
const Mailjet = require('node-mailjet');
const mailjet = Mailjet.apiConnect(
    process.env.MJ_APIKEY_PUBLIC,
    process.env.MJ_APIKEY_PRIVATE
);

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
        return appointments;
    } catch (error) {
        console.error('Failed to fetch appointments:', error);
        throw error;
    }
}

async function scheduleEmail(email, appointmentTime, timeZone, firstName, lastName) {
    console.log(`Email will be sent to ${email} for ${firstName} ${lastName} at ${appointmentTime} ${timeZone}`);
    try {
        const request = mailjet
            .post("send", {'version': 'v3.1'})
            .request({
                "Messages":[
                    {
                        "From": {
                            "Email": "marcebd@umich.edu",
                            "Name": "Marcela"
                        },
                        "To": [
                            {
                                "Email": email,
                                "Name": `${firstName} ${lastName}`
                            }
                        ],
                        "Subject": `Doctor's Appointment Reminder for ${firstName} ${lastName}`,
                        "HTMLPart": `<p>Hi ${firstName}, just a reminder about your upcoming appointment at ${appointmentTime} ${timeZone}</p>`
                    }
                ]
            });
        const result = await request;
        console.log(result.body);
        return true;  // Return true on successful email send
    } catch (error) {
        console.error('Failed to create or send campaign:', error);
        return false;  // Return false on failure
    }
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
                    // Calculate the notification time by subtracting the specified number of units (days, weeks, etc.)
                    // from the appointment time based on the frequency specified in the setting
                    const notificationTime = moment.tz(appointmentTime, timeZone)
                        .subtract(setting.number, setting.frequency)
                        .format('YYYY-MM-DD HH:mm');
                    // Get the current time in the same format and timezone as the appointment
                    const currentTime = moment.tz(timeZone).format('YYYY-MM-DD HH:mm');
                    // Create a unique identifier for this particular notification using the appointment ID and the setting details
                    // This ID will help in tracking whether this notification has already been sent
                    const notificationId = `${appointment.id}-${setting.number}-${setting.frequency}`;
                    // Check if the calculated notification time matches the current time and if this notification has not been sent yet
                    if (notificationTime === currentTime && !sentNotifications[notificationId]) {
                        const emailSent = await scheduleEmail(email, appointmentTime, timeZone, firstName, lastName);
                        // If the email was successfully sent, mark this notification as sent in the sentNotifications object
                        // This prevents the same notification from being sent multiple times
                        if (emailSent) {
                            sentNotifications[notificationId] = true;
                        }
                    }
                });
            });
        });
    } catch (error) {
        console.error('Failed to handle schedule emails:', error);
    }
}

setInterval(() => {
    handleScheduleEmails();
}, 60000);  // Run the scheduling check every minute
