import React, { useState } from 'react';
import FacialRecognitionModal from '../PatientInformation/FacialRecognitionSearchModal';
import defaultImage from '../../DocuImage/ProfilePicDefault.jpeg';
import { Box, Grid, TextField, Button, Typography, Select, MenuItem, InputLabel, FormControl } from '@mui/material';

const AddPatient = ({ onCreate }) => {
  const [patientData, setPatientData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    idNumber: '',
    email: '',
    birthDate: '',
    gender: ''
  });
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [image, setImage] = useState(defaultImage);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPatientData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
      setPatientData(prev => ({ ...prev, imgSrc: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const onImageCapture = (capturedImage) => {
    setImage(URL.createObjectURL(capturedImage));
    setPatientData(prev => ({ ...prev, imgSrc: capturedImage }));
    setShowCameraModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(patientData).forEach(key => {
        formData.append(key, patientData[key]);
      });
      if (image instanceof Blob) {
        formData.append('picture', image);
      }
      const response = await fetch('http://localhost:3001/patients', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Failed to create patient');
      }
      const responseData = await response.json();
      onCreate(responseData);
    } catch (error) {
      console.error('Failed to create patient:', error);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Add Patient
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <img src={image} alt="Patient" style={{ width: '100%', height: 'auto' }} />
          <Button variant="contained" onClick={() => setShowCameraModal(true)}>
            Take Picture
          </Button>
          <input type="file" onChange={handleImageChange} />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel id="first-name-label">First Name</InputLabel>
            <TextField
              id="first-name"
              label="First Name"
              name="firstName"
              value={patientData.firstName}
              onChange={handleInputChange}
              required
            />
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="middle-name-label">Middle Name</InputLabel>
            <TextField
              id="middle-name"
              label="Middle Name"
              name="middleName"
              value={patientData.middleName}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="last-name-label">Last Name</InputLabel>
            <TextField
              id="last-name"
              label="Last Name"
              name="lastName"
              value={patientData.lastName}
              onChange={handleInputChange}
              required
            />
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="id-number-label">ID Number</InputLabel>
            <TextField
              id="id-number"
              label="ID Number"
              name="idNumber"
              value={patientData.idNumber}
              onChange={handleInputChange}
              required
            />
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="email-label">Email</InputLabel>
            <TextField
              id="email"
              label="Email"
              name="email"
              value={patientData.email}
              onChange={handleInputChange}
              required
            />
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="birth-date-label">Birth Date</InputLabel>
            <TextField
              id="birth-date"
              label="Birth Date"
              name="birthDate"
              value={patientData.birthDate}
              onChange={handleInputChange}
              required
            />
          </FormControl>
                    <FormControl fullWidth>
            <InputLabel id="gender-label">Gender</InputLabel>
            <Select
              id="gender"
              label="Gender"
              name="gender"
              value={patientData.gender}
              onChange={handleInputChange}
              required
            >
              <MenuItem value="">Select Gender</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Nonbinary">Non-binary</MenuItem>
              <MenuItem value="DeclineToState">Declined to State</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
    <Button variant="contained" onClick={handleSubmit}>
      Save Patient
    </Button>
  </Box>
  {showCameraModal && (
    <FacialRecognitionModal onImageCapture={onImageCapture} onClose={() => setShowCameraModal(false)} />
  )}
</Box>
  );
};

export default AddPatient;
