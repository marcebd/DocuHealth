import React, { useState, useEffect } from 'react';
import { Modal, Form, FormGroup, FormLabel, Button } from 'react-bootstrap';
import SearchBarPatient from './SearchBarPatient';
import FacialRecognitionPatientButton from '../FacialRecognition/FacialRecognitionPacientButton';
import FacialRecognitionSearchButton from '../FacialRecognition/FacialRecognitionSearchButton';
import PatientSearchTable from './PatientSearchTable';

const NewPatientModal = ({ onClose, onCreate }) => {
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [prescriptions, setPrescriptions] = useState([]);
  const [conditions, setConditions] = useState([]);
  const userId = JSON.parse(localStorage.getItem("userId"));
  const [patientsInTabs, setPatientsInTabs] = useState([]);
  const [patientsData, setPatientsData] = useState([]);
  const [error, setError] = useState('');
  const [imgSrc, setImgSrc] = useState('');

  useEffect(() => {
    const storedPatients = localStorage.getItem('patientTabs');
    if (storedPatients) {
      setPatientsInTabs(JSON.parse(storedPatients));
    } else {
      setPatientsInTabs([]);
    }
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`http://localhost:3001/users/${userId}/patients`, {
          method: 'GET',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch patients');
        }
        const data = await response.json();
        setPatientsData(data);
      } catch (error) {
        console.error('Error fetching patients:', error);
        setError('Error fetching patient data. Please try again later.');
      }
    }
    fetchData();
  }, [userId]);

  const handlePrescriptionChange = (index, event) => {
    const newPrescriptions = [...prescriptions];
    newPrescriptions[index][event.target.name] = event.target.value;
    setPrescriptions(newPrescriptions);
  };

  const handleConditionChange = (index, event) => {
    const newConditions = [...conditions];
    newConditions[index][event.target.name] = event.target.value;
    setConditions(newConditions);
  };

  const onImageCapture = (image) => {
    setImgSrc(image);
  };

  const handleSearch = (event) => {
    // Handle search logic here
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!firstName || !lastName || !idNumber || !birthDate) {
      setError("Required fields must be filled.");
      return;
    }
    const arePrescriptionsPartiallyFilled = prescriptions.some(p => p.name || p.dose || p.dateStart);
    const areConditionsPartiallyFilled = conditions.some(c => c.name || c.dateStart);

    const arePrescriptionsValid = !arePrescriptionsPartiallyFilled || prescriptions.every(p => p.name && p.dose && p.dateStart);
    const areConditionsValid = !areConditionsPartiallyFilled || conditions.every(c => c.name && c.dateStart);

    if (!arePrescriptionsValid || !areConditionsValid) {
      setError("All required fields in prescriptions and conditions must be filled.");
      return;
    }

    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('firstName', firstName);
    formData.append('middleName', middleName);
    formData.append('lastName', lastName);
    formData.append('idNumber', idNumber);
    formData.append('email', email);
    formData.append('birthDate', birthDate);
    if (imgSrc instanceof File) {
      formData.append('imgSrc', imgSrc, imgSrc.name);
    }
    formData.append('prescriptions', JSON.stringify(prescriptions));
    formData.append('conditions', JSON.stringify(conditions));
    try {
      const response = await fetch('http://localhost:3001/patients', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Failed to create patient');
      }
      const responseData = await response.json();
      const updatedPatientTabs = [...patientsInTabs, responseData];
      setPatientsInTabs(updatedPatientTabs);
      localStorage.setItem('viewingPatient', JSON.parse(responseData));
      localStorage.setItem('patientTabs', JSON.stringify(updatedPatientTabs));
      onCreate(responseData);
      onClose();
      window.location.reload();
    } catch (error) {
      console.error('Failed to create patient:', error);
      setError(`Failed to create patient: ${error.message}`);
    }
  };
  const handlePatientClick = (patient) => {
    const updatedPatientTabs = [...patientsInTabs, patient.id];
    setPatientsInTabs(updatedPatientTabs);
    localStorage.setItem('patientTabs', JSON.stringify(updatedPatientTabs));
    localStorage.setItem('viewingPatient', JSON.parse(patient.id));
    onCreate(patient);
    onClose();
    window.location.reload();
  };
  const addPrescription = () => {
    setPrescriptions([...prescriptions, { name: '', dose: '', instructions: '', dateStart: '', dateEnd: '' }]);
  };
  const removePrescription = (index) => {
    const filteredPrescriptions = prescriptions.filter((_, i) => i !== index);
    setPrescriptions(filteredPrescriptions);
  };
  const addCondition = () => {
    setConditions([...conditions, { name: '', dateStart: '', dateEnd: '' }]);
  };
  const removeCondition = (index) => {
    const filteredConditions = conditions.filter((_, i) => i !== index);
    setConditions(filteredConditions);
  };
  return (
    <Modal show={true} onHide={onClose} centered style={{ display: 'flex', alignItems: 'center', width: '100vw' }}>
      <Modal.Dialog style={{ margin: 0, width: '50vw', maxWidth: '50vw', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Modal.Header closeButton style={{ width: '100%', padding: '0 1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1%' }}>
          <Modal.Title style={{ flex: 1, textAlign: 'center', padding: '2%' }}>Find or Create a New Patient</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ display: 'flex', flexDirection: 'row', width: '100%', padding: '0', justifyContent: 'space-evenly' }}>
          <div style={{ width: '45%', maxHeight: '100%', overflowY: 'auto', padding: '2%' }}>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
              <div>
                <SearchBarPatient placeholder="Search for a patient" onChange={handleSearch} />
              </div>
              <div style={{width: '20%'}} >
                <FacialRecognitionSearchButton handlePatientClick={handlePatientClick}/>
              </div>
            </div>
            {patientsData[0] ? (
              <PatientSearchTable patientsData={patientsData} handlePatientClick={handlePatientClick} />
            ) : (
              <p>No patients found</p>
            )}
          </div>
          <div style={{ width: '45%', maxHeight: '100%', overflowY: 'auto' }}>
            {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
            <Form onSubmit={handleSubmit}>
              <h3>Patient Data</h3>
              <FormGroup>
                <FormLabel>First Name <span style={{color: 'red'}}>*</span></FormLabel>
                <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="form-control" required />
              </FormGroup>
              <FormGroup>
                <FormLabel>Middle Name</FormLabel>
                <input type="text" value={middleName} onChange={(e) => setMiddleName(e.target.value)} className="form-control" />
              </FormGroup>
              <FormGroup>
                <FormLabel>Last Name<span style={{color: 'red'}}>*</span></FormLabel>
                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="form-control" required />
              </FormGroup>
              <FormGroup>
                <FormLabel>ID Number<span style={{color: 'red'}}>*</span></FormLabel>
                <input type="text" value={idNumber} onChange={(e) => setIdNumber(e.target.value)} className="form-control" required />
              </FormGroup>
              <FormGroup>
                <FormLabel>Email<span style={{color: 'red'}}>*</span></FormLabel>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" required />
              </FormGroup>
              <FormGroup>
                <FormLabel>Birth Date<span style={{color: 'red'}}>*</span></FormLabel>
                <input type="date" value={birthDate} onChange={(e) =>setBirthDate(e.target.value)} className="form-control" required />
              </FormGroup>
              <FormGroup>
                <FacialRecognitionPatientButton onImageCapture={(onImageCapture)}/>
              </FormGroup>
              <FormGroup>
                <FormLabel><h3>Prescriptions</h3></FormLabel>
                {prescriptions.map((prescription, index) => (
                  <div key={index} className="mb-2">
                    <label>
                      Name <span style={{ color: 'red' }}>*</span>
                      <input type="text" name="name" value={prescription.name} onChange={(e) => handlePrescriptionChange(index, e)} placeholder="Name" className="form-control" required />
                    </label>
                    <label>
                      Dose <span style={{ color: 'red' }}>*</span>
                      <input type="text" name="dose" value={prescription.dose} onChange={(e) => handlePrescriptionChange(index, e)} placeholder="Dose" className="form-control" required />
                    </label>
                    <label>
                      Frequency <span style={{ color: 'red' }}>*</span>
                      <input type="text" name="frequency" value={prescription.frequency} onChange={(e) => handlePrescriptionChange(index, e)} placeholder="Frequency" className="form-control" required />
                    </label>
                    <button type="button" onClick={() => removePrescription(index)} className="btn btn-danger">Remove</button>
                  </div>
                ))}
                <button type="button" onClick={addPrescription} className="btn btn-primary">Add Prescription</button>
              </FormGroup>
              <FormGroup>
                <FormLabel><h3>Conditions</h3></FormLabel>
                {conditions.map((condition, index) => (
                  <div key={index} className="mb-2">
                    <label>
                      Condition Name <span style={{ color: 'red' }}>*</span>
                      <input type="text" name="name" value={condition.name} onChange={(e) => handleConditionChange(index, e)} placeholder="Condition Name" className="form-control" required />
                    </label>
                    <label>
                      Start Date <span style={{ color: 'red' }}>*</span>
                      <input type="date" name="dateStart" value={condition.dateStart} onChange={(e) => handleConditionChange(index, e)} className="form-control" required />
                    </label>
                    <label>
                      End Date
                      <input type="date" name="dateEnd" value={condition.dateEnd} onChange={(e) => handleConditionChange(index, e)} className="form-control" />
                    </label>
                    <button type="button" onClick={() => removeCondition(index)} className="btn btn-danger">Remove</button>
                  </div>
                ))}
                <button type="button" onClick={addCondition} className="btn btn-primary">Add Condition</button>
              </FormGroup>
              <Button type="submit" className="btn btn-success">Save Patient</Button>
            </Form>
          </div>
        </Modal.Body>
      </Modal.Dialog>
    </Modal>
  );
};

export default NewPatientModal;
