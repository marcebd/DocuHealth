import React, { useState, useEffect } from 'react';
import { Button, TextField, Box, Grid, MenuItem } from '@mui/material';
import moment from 'moment-timezone';

const AddAppointment = ({ handleSubmit, resetFormTrigger }) => {
    const initialAppointmentData = {
        appointmentTime: '',
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        notificationSettings: []
    };

    const [appointmentData, setAppointmentData] = useState(initialAppointmentData);
    const [error, setError] = useState('');

    const timeZones = moment.tz.names();

    useEffect(() => {
        // Reset the form whenever the resetFormTrigger changes
        if (resetFormTrigger) {
            setAppointmentData(initialAppointmentData);
        }
    }, [resetFormTrigger]);

    const handleChange = (event) => {
        setAppointmentData({ ...appointmentData, [event.target.name]: event.target.value });
    };

    const handleNotificationChange = (index, field, value) => {
        const updatedSettings = [...appointmentData.notificationSettings];
        updatedSettings[index][field] = value;
        setAppointmentData({ ...appointmentData, notificationSettings: updatedSettings });
    };

    const addNotification = () => {
        setAppointmentData({
            ...appointmentData,
            notificationSettings: [...appointmentData.notificationSettings, { number: 1, frequency: 'week' }]
        });
    };

    const submitForm = () => {
        if (!appointmentData.appointmentTime || !appointmentData.timeZone) {
            setError('Please fill in all required fields.');
            return;
        }
        setError('');
        handleSubmit(appointmentData);
    };

    return (
        <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        label="Appointment Time"
                        type="datetime-local"
                        name="appointmentTime"
                        value={appointmentData.appointmentTime}
                        onChange={handleChange}
                        fullWidth
                        InputLabelProps={{
                            shrink: true,
                            style: { fontSize: '0.875rem' }
                        }}
                        error={!appointmentData.appointmentTime}
                        helperText={!appointmentData.appointmentTime ? 'Appointment time is required' : ''}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Time Zone"
                        name="timeZone"
                        value={appointmentData.timeZone}
                        onChange={handleChange}
                        fullWidth
                        select
                        error={!appointmentData.timeZone}
                        helperText={!appointmentData.timeZone ? 'Time zone is required' : ''}
                    >
                        {timeZones.map((zone) => (
                            <MenuItem key={zone} value={zone}>
                                {zone}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                {appointmentData.notificationSettings.map((setting, index) => (
                    <Grid item xs={12} key={index} container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                label="Notification Number"
                                type="number"
                                value={setting.number}
                                onChange={(e) => handleNotificationChange(index, 'number', parseInt(e.target.value))}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Frequency"
                                select
                                value={setting.frequency}
                                onChange={(e) => handleNotificationChange(index, 'frequency', e.target.value)}
                                fullWidth
                                SelectProps={{
                                    native: true,
                                }}
                            >
                                <option value="minute">Minute</option>
                                <option value="hour">Hour</option>
                                <option value="day">Day</option>
                                <option value="week">Week</option>
                                <option value="month">Month</option>
                            </TextField>
                        </Grid>
                    </Grid>
                ))}
                <Grid item xs={12}>
                    <Button onClick={addNotification} variant="contained" color="secondary">
                        Add Notification
                    </Button>
                </Grid>
            </Grid>
            {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
            <Button onClick={submitForm} variant="contained" color="primary" sx={{ mt: 2 }}>
                Schedule Appointment
            </Button>
        </Box>
    );
};

export default AddAppointment;
