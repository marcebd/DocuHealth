import React, { useState, useEffect } from 'react';
import mailchimp from '@mailchimp/mailchimp_marketing';
import moment from 'moment';

function Email({appointment}) {
    const appointmentData = typeof appointment === 'string' ? JSON.parse(appointment) : appointment;
    const notificationSettings = appointmentData.find(item => item.newNotificationSettings)?.newNotificationSettings;
    const appointmentTimeDetails = appointmentData.find(item => item.newAppointmentTime)?.newAppointmentTime;
    const number = notificationSettings?.number;
    const frequency = notificationSettings?.frequency;
    const firstName = appointmentTimeDetails?.firstName;
    const middleName = appointmentTimeDetails?.middleName;
    const lastName = appointmentTimeDetails?.lastName;
    const email = appointmentTimeDetails?.email;
    const appointmentTime = appointmentTimeDetails?.appointmentTime;
    const timeZone = appointmentTimeDetails?.timeZone;
    mailchimp.setConfig({
        apiKey: import.meta.env.VITE_MAILCHIMP_API_KEY,
        server: "us14",
    });

    function getScheduleDate(appointmentDate, number, frequency) {
        let date = moment(appointmentDate);
        switch (frequency) {
            case 'week':
                return date.subtract(number, 'weeks').toISOString();
            case 'month':
                return date.subtract(number, 'months').toISOString();
            case 'minute':
                return date.subtract(number, 'minutes').toISOString();
            default:
                return date.toISOString();
        }
    }
    function convertToUTC(localTime, timeZone) {
        return moment.tz(localTime, timeZone).utc().format();
    }
    async function scheduleEmail(patientEmail, appointmentDate, timeZone, number, frequency, firstName, lastName, templateId, listId) {
        const localAppointmentDate = convertToUTC(appointmentDate, timeZone);
        const scheduleDate = getScheduleDate(localAppointmentDate, number, frequency);
        try {
            const segmentId = await createSegment(listId, patientEmail);
            const response = await mailchimp.campaigns.create({
                type: 'regular',
                recipients: {
                    list_id: listId,
                    segment_opts: {
                        saved_segment_id: segmentId
                    }
                },
                settings: {
                    subject_line: `Appointment Reminder for ${firstName} ${lastName}`,
                    preview_text: `Hi ${firstName}, just a reminder about your upcoming appointment.`,
                    title: `${firstName}'s Appointment Reminder`,
                    template_id: templateId
                }
            });
            const campaignId = response.id;
            await mailchimp.campaigns.schedule(campaignId, {
                schedule_time: scheduleDate
            });
            console.log(`Campaign scheduled successfully: ${campaignId}`);
            return campaignId;
        } catch (error) {
            console.error('Failed to create or schedule campaign:', error);
            throw error;
        }
    }

    const handleScheduleEmails = async () => {
        try {
        const campaignId = await scheduleEmail(email, appointmentTime, timezone, number, frequency, firstName, lastName);
        console.log("Email Scheduled with Campaign ID:", campaignId);
        setButtonColor('green');
        } catch (error) {
        console.error("Failed to schedule email:", error);
        setButtonColor('red');
        }
    };

    return (
        <div>
        {appointmentData.map((item, index) => (
            <div key={index}>
                {item.newNotificationSettings && (
                    <div>
                        <h4>Notification Settings</h4>
                        <p>{item.newNotificationSettings.number} {item.newNotificationSettings.frequency}</p>
                    </div>
                )}
                {item.newAppointmentTime && (
                    <div>
                        <h4>Appointment Time</h4>
                        <p>Name: {item.newAppointmentTime.firstName} {item.newAppointmentTime.middleName} {item.newAppointmentTime.lastName}</p>
                        <p>Email: {item.newAppointmentTime.email}</p>
                        <p>Appointment Time: {item.newAppointmentTime.appointmentTime}</p>
                        <p>Time Zone: {item.newAppointmentTime.timeZone}</p>
                    </div>
                )}
            </div>
        ))}
    </div>
);
}

export default Email;
