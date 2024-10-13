import React, { useState } from 'react';
import FacialRecognitionModal from '../PatientInformation/FacialRecognitionSearchModal';
import defaultImage from '../../DocuImage/ProfilePicDefault.jpeg';
import { Box, Grid, Typography, FormControl, InputLabel, TextField, Button, Card, CardContent, CardHeader, CardActions, Divider, Stack, Select, MenuItem, Autocomplete } from '@mui/material';
import countryTelephoneData from 'country-telephone-data';
import './AddPatient.css';
const AddPatient = ({ onCreate }) => {
 
  const [patientData, setPatientData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    idNumber: '',
    email: '',
    birthDate: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phoneNumber: '',
    emergencyContactName: '',
    emergencyContactRelationship: '',
    emergencyContactPhoneNumber: '',
    primaryCarePhysicianName: '',
    primaryCarePhysicianPhoneNumber: '',
    medicalHistory: [],
    familyMedicalHistory: [],
    insuranceProvider: '',
    policyNumber: '',
    groupNumber: '',
    billingAddress: '',
    preferredCommunicationMethod: '',
    languagePreference: '',
    ethnicity: '',
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
        <Grid item xs={12} md={12}>
          <Card>
            <CardHeader title="Patient Information" />
            <CardContent>
              <Stack spacing={2}>
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
              </Stack>
            </CardContent>
            <Divider />
            <CardActions>
              <Button variant="contained" onClick={() => setShowCameraModal(true)}>
                Take Picture
              </Button>
              <input type="file" onChange={handleImageChange} />
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} md={12}>
          <Card>
            <CardHeader title="Contact Information" />
            <CardContent>
              <Stack spacing={2}>
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
  <InputLabel id="phone-number-label">Phone Number</InputLabel>
  <Stack direction="row" spacing={1}>
    <Autocomplete
      id="area-code"
      options={areaCodes}
      getOptionLabel={(option) => option.code}
      renderOption={(props, option) => (
        <Box component="li" {...props}>
          <Stack direction="row" spacing={1}>
            <img src={option.flag} width={20} height={15} />
            <Typography>{option.code}</Typography>
          </Stack>
        </Box>
      )}
      renderInput={(params) => <TextField {...params} label="Area Code" />}
      onChange={(event, value) => {
        const selectedAreaCode = value ? value.code : '';
        const phoneNumber = patientData.phoneNumber.replace(/^\d{3}/, selectedAreaCode);
        handleInputChange({ target: { name: 'phoneNumber', value: phoneNumber } });
      }}
    />
    <TextField
      id="phone-number"
      label="Phone Number"
      name="phoneNumber"
      value={patientData.phoneNumber.replace(/^\d{3}/, '')}
      onChange={(event) => {
        const phoneNumber = event.target.value;
        const areaCode = patientData.phoneNumber.match(/^\d{3}/);
        const fullPhoneNumber = (areaCode ? areaCode[0] : '') + phoneNumber;
        handleInputChange({ target: { name: 'phoneNumber', value: fullPhoneNumber } });
      }}
    />
  </Stack>
</FormControl>
                <FormControl fullWidth>
                  <InputLabel id="address-label">Address</InputLabel>
                  <TextField
                    id="address"
                    label="Address"
                    name="address"
                    value={patientData.address}
                    onChange={handleInputChange}
                  />
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel id="city-label">City</InputLabel>
                  <TextField
                    id="city"
                    label="City"
                    name="city"
                    value={patientData.city}
                    onChange={handleInputChange}
                  />
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel id="state-label">State</InputLabel>
                  <TextField
                    id="state"
                    label="State"
                    name="state"
                    value={patientData.state}
                    onChange={handleInputChange}
                  />
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel id="zip-code-label">Zip Code</InputLabel>
                  <TextField
                    id="zip-code"
                    label="Zip Code"
                    name="zipCode"
                    value={patientData.zipCode}
                    onChange={handleInputChange}
                  />
                </FormControl>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={12}>
          <Card>
            <CardHeader title="Emergency Contact" />
            <CardContent>
              <Stack spacing={2}>
                <FormControl fullWidth>
                  <InputLabel id="emergency-contact-name-label">Emergency Contact Name</InputLabel>
                  <TextField
                    id="emergency-contact-name"
                    label="Emergency Contact Name"
                    name="emergencyContactName"
                    value={patientData.emergencyContactName}
                    onChange={handleInputChange}
                  />
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel id="emergency-contact-relationship-label">Emergency Contact Relationship</InputLabel>
                  <Select
                    id="emergency-contact-relationship"
                    label="Emergency Contact Relationship"
                    name="emergencyContactRelationship"
                    value={patientData.emergencyContactRelationship}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="">Select Relationship</MenuItem>
                    <MenuItem value="Family Member">Family Member</MenuItem>
                    <MenuItem value="Friend">Friend</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                    </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="emergency-contact-phone-number-label">Emergency Contact Phone Number</InputLabel>
                <TextField
                  id="emergency-contact-phone-number"
                  label="Emergency Contact Phone Number"
                  name="emergencyContactPhoneNumber"
                  value={patientData.emergencyContactPhoneNumber}
                  onChange={handleInputChange}
                />
              </FormControl>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={12}>
        <Card>
          <CardHeader title="Medical Information" />
          <CardContent>
            <Stack spacing={2}>
              <FormControl fullWidth>
                <InputLabel id="primary-care-physician-name-label">Primary Care Physician Name</InputLabel>
                <TextField
                  id="primary-care-physician-name"
                  label="Primary Care Physician Name"
                  name="primaryCarePhysicianName"
                  value={patientData.primaryCarePhysicianName}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="primary-care-physician-phone-number-label">Primary Care Physician Phone Number</InputLabel>
                <TextField
                  id="primary-care-physician-phone-number"
                  label="Primary Care Physician Phone Number"
                  name="primaryCarePhysicianPhoneNumber"
                  value={patientData.primaryCarePhysicianPhoneNumber}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="medical-history-label">Medical History</InputLabel>
                <Select
                  id="medical-history"
                  label="Medical History"
                  name="medicalHistory"
                  value={patientData.medicalHistory}
                  onChange={handleInputChange}
                  multiple
                >
                  <MenuItem value="Allergies">Allergies</MenuItem>
                  <MenuItem value="Chronic Conditions">Chronic Conditions</MenuItem>
                  <MenuItem value="Previous Surgeries">Previous Surgeries</MenuItem>
                  <MenuItem value="Current Medications">Current Medications</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="family-medical-history-label">Family Medical History</InputLabel>
                <Select
                  id="family-medical-history"
                  label="Family Medical History"
                  name="familyMedicalHistory"
                  value={patientData.familyMedicalHistory}
                  onChange={handleInputChange}
                  multiple
                >
                  <MenuItem value="Heart Disease">Heart Disease</MenuItem>
                  <MenuItem value="Cancer">Cancer</MenuItem>
                  <MenuItem value="Diabetes">Diabetes</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={12}>
        <Card>
          <CardHeader title="Insurance Information" />
          <CardContent>
            <Stack spacing={2}>
              <FormControl fullWidth>
                <InputLabel id="insurance-provider-label">Insurance Provider</InputLabel>
                <TextField
                  id="insurance-provider"
                  label="Insurance Provider"
                  name="insuranceProvider"
                  value={patientData.insuranceProvider}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="policy-number-label">Policy Number</InputLabel>
                <TextField
                  id="policy-number"
                  label="Policy Number"
                  name="policyNumber"
                  value={patientData.policyNumber}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="group-number-label">Group Number</InputLabel>
                <TextField
                  id="group-number"
                  label="Group Number"
                  name="groupNumber"
                  value={patientData.groupNumber}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="billing-address-label">Billing Address</InputLabel>
                <TextField
                  id="billing-address"
                  label="Billing Address"
                  name="billingAddress"
                  value={patientData.billingAddress}
                  onChange={handleInputChange}
                />
              </FormControl>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={12}>
        <Card>
          <CardHeader title="Additional Information" />
          <CardContent>
            <Stack spacing={2}>
              <FormControl fullWidth>
                <InputLabel id="preferred-communication-method-label">Preferred Communication Method</InputLabel>
                <Select
                  id="preferred-communication-method"
                  label="Preferred Communication Method"
                  name="preferredCommunicationMethod"
                  value={patientData.preferredCommunicationMethod}
                  onChange={handleInputChange}
                >
                  <MenuItem value="">Select Method</MenuItem>
                  <MenuItem value="Phone">Phone</MenuItem>
                  <MenuItem value="Email">Email</MenuItem>
                  <MenuItem value="Mail">Mail</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="language-preference-label">Language Preference</InputLabel>
                <Select
                  id="language-preference"
                  label="Language Preference"
                  name="languagePreference"
                  value={patientData.languagePreference}
                  onChange={handleInputChange}
                >
                  <MenuItem value="">Select Language</MenuItem>
                  <MenuItem value="English">English</MenuItem>
                  <MenuItem value="Spanish">Spanish</MenuItem>
                  <MenuItem value="French">French</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="special-instructions-label">Special Instructions</InputLabel>
                <TextField
                  id="special-instructions"
                  label="Special Instructions"
                  name="specialInstructions"
                  value={patientData.specialInstructions}
                  onChange={handleInputChange}
                  multiline
                  rows={4}
                />
              </FormControl>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={12}>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <Button variant="contained" onClick={handleSubmit}>
            Save Patient
          </Button>
        </Box>
      </Grid>
    </Grid>
    {showCameraModal && (
      <FacialRecognitionModal
        onImageCapture={onImageCapture}
        onClose={() => setShowCameraModal(false)}
      />
    )}
  </Box>
);
}
export default AddPatient;
