import React, { useState } from 'react';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Typography, Box, InputAdornment } from '@mui/material';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const AddNote = ({ patient, handleSubmit }) => {
    const [noteType, setNoteType] = useState('visit');
    const [patientId] = patient.id;
    const [noteContent, setNoteContent] = useState(`Weight:
Temperature:
Heart Rate:
Blood Oxygen:
Blood Pressure:

Laboratory Data:

Imaging Results:

Patient's Reason For Visit:

Observations:

Assessment:

Plan:`);
    const [noteDate, setNoteDate] = useState(new Date());
    const [noteTime, setNoteTime] = useState(new Date());
    const templates = {
        visit: `Weight:
    Temperature:
    Heart Rate:
    Blood Oxygen:
    Blood Pressure:
    Laboratory Data:
    Imaging Results:
    Patient's Reason For Visit:
    Observations:
    Assessment:
    Plan:`,
    reminder: "Reminder:",
    other: ""
    };

    const handleNoteTypeChange = (event) => {
        const newType = event.target.value;
        setNoteType(newType);
        setNoteContent(templates[newType]);
    };

    const handleNoteContentChange = (event) => {
        setNoteContent(event.target.value);
    };

    const localHandleSubmit = (event) => {
        event.preventDefault();
        const noteData = {
            noteType,
            noteContent,
            noteDate,
            noteTime,
            patientId
        };
        handleSubmit(noteData); 
    };

    const patientName = patient ? `${patient.firstName} ${patient.middleName ? patient.middleName + ' ' : ''}${patient.lastName}` : 'Patient';

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ width: '100%', padding: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Add a Note for {patientName}
                </Typography>
                <form onSubmit={localHandleSubmit}>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>
                            <Typography variant="h6">Note Type</Typography>
                        </InputLabel>
                        <Select
                            value={noteType}
                            label={<Typography variant="h6">Note Type</Typography>}
                            onChange={handleNoteTypeChange}
                        >
                            <MenuItem value="visit">Visit Note</MenuItem>
                            <MenuItem value="reminder">Reminder</MenuItem>
                            <MenuItem value="other">Other</MenuItem>
                        </Select>
                    </FormControl>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
                        <DatePicker
                            value={noteDate}
                            onChange={setNoteDate}
                            textField={(params) => (
                                <TextField {...params} sx={{ width: 220 }} InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <CalendarTodayIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                                        </InputAdornment>
                                    ),
                                }} />
                            )}
                        />
                        <TimePicker
                            value={noteTime}
                            onChange={setNoteTime}
                            textField={(params) => (
                                <TextField {...params} sx={{ width: 220 }} InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <AccessTimeIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                                        </InputAdornment>
                                    ),
                                }} />
                            )}
                        />
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <TextField
                            label={noteType.charAt(0).toUpperCase() + noteType.slice(1) + " Note"}
                            multiline
                            rows={4}
                            fullWidth
                            value={noteContent}
                            onChange={handleNoteContentChange}
                            placeholder={templates[noteType]}
                            variant="outlined"
                            sx={{
                                maxHeight: '70vh',
                                overflow: 'auto' // Ensures content can be scrolled if it exceeds the visible area
                            }}
                        />
                    </Box>
                    <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }}>
                        Save Note
                    </Button>
                </form>
            </Box>
        </LocalizationProvider>
    );
    };
    export default AddNote;
