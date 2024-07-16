import React, { useState, useEffect } from 'react';
import { Modal, Form, FormGroup, FormLabel, Button, Table } from 'react-bootstrap';
import SearchBarPatient from './SearchBarPatient';
import FacialRecognitionPatientButton from '../FacialRecognition/FacialRecognitionPacientButton';
import FacialRecognitionSearchButton from '../FacialRecognition/FacialRecognitionSearchButton';

const NewPatientModal = ({ onClose, onCreate }) => {
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [prescriptions, setPrescriptions] = useState([{ name: '', dose: '', instructions: '', dateStart: '', dateEnd: '' }]);
  const [conditions, setConditions] = useState([{ name: '', dateStart: '', dateEnd: '' }]);
  const userId = JSON.parse(localStorage.getItem("userId"));
  const [patientsInTabs, setPatientsInTabs] = useState([]);
  const [patientsData, setPatientsData] = useState([]);
  const [error, setError] = useState('');
  const [imgSrc, setImgSrc] = useState('');
  //localStorage.removeItem("patientTabs");
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
          console.error('Failed to fetch patients:', response);
        } else {
          console.log(response);
          const data = await response.json();
          setPatientsData(data);
        }
      } catch (error) {
        console.error('Error fetching patients:', error);
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
    const arePrescriptionsValid = prescriptions.every(p => p.name && p.dose && p.dateStart);
    const areConditionsValid = conditions.every(c => c.name && c.dateStart);
    if (!arePrescriptionsValid || !areConditionsValid) {
      setError("All fields in prescriptions and conditions must be filled.");
      return;
    }

    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('firstName', firstName);
    formData.append('middleName', middleName);
    formData.append('lastName', lastName);
    formData.append('idNumber', idNumber);
    formData.append('birthDate', birthDate);
    if (imgSrc) {
      formData.append('imgSrc', imgSrc);
    }
    formData.append('prescriptions', JSON.stringify(prescriptions));
    formData.append('conditions', JSON.stringify(conditions));

    try {
      const response = await fetch('http://localhost:3001/patients', {
        method: 'POST',
        body: formData,
      });
      const responseData = await response.json();
      console.log("Response data", responseData);
      if (!response.ok) {
        setError(`Failed to create patient: ${responseData.message}`);
      } else {
        const updatedPatientTabs = [...patientsInTabs, responseData];
        setPatientsInTabs(updatedPatientTabs);
        console.log("Response Data", responseData);
        console.log("Updates patient tabs", updatedPatientTabs);
        localStorage.setItem('patientTabs', JSON.stringify(updatedPatientTabs));
        localStorage.setItem('viewingPatient', responseData);
        onCreate();
        onClose();
      }
    } catch (error) {
      setError(`Error creating patient: ${error.message}`);
    }
};

  const handlePatientClick = (patient) => {
    console.log("Handle patient click Patient", patient);
    const updatedPatientTabs = [...patientsInTabs, patient.id];
    setPatientsInTabs(updatedPatientTabs);
    console.log("Handle patient click tabs", updatedPatientTabs);
    localStorage.setItem('patientTabs', JSON.stringify(updatedPatientTabs));
    localStorage.setItem('viewingPatient', patient.id);
    onCreate();
    onClose();

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
                <FacialRecognitionSearchButton handlePatientClick={(handlePatientClick)}/>
              </div>
            </div>
            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Middle Name</th>
                  <th>Last Name</th>
                </tr>
              </thead>
              <tbody>
                {patientsData.map((patient) => (
                  <tr key={patient.id} onClick={() => handlePatientClick(patient)}>
                    <td style={{ maxWidth: '100px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{patient.firstName}</td>
                    <td style={{ maxWidth: '100px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{patient.middleName}</td>
                    <td style={{ maxWidth: '100px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{patient.lastName}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          <div style={{ width: '45%', maxHeight: '100%', overflowY: 'auto' }}>
          {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
            <Form onSubmit={handleSubmit}>
              <h3>Patient Data</h3>
              <FormGroup>
                <FormLabel>First Name <span style={{color: 'red'}}>*</span></FormLabel>
                <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="form-control" />
              </FormGroup>
              <FormGroup>
                <FormLabel>Middle Name</FormLabel>
                <input type="text" value={middleName} onChange={(e) => setMiddleName(e.target.value)} className="form-control" />
              </FormGroup>
              <FormGroup>
                <FormLabel>Last Name<span style={{color: 'red'}}>*</span></FormLabel>
                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="form-control" />
              </FormGroup>
              <FormGroup>
                <FormLabel>ID Number<span style={{color: 'red'}}>*</span></FormLabel>
                <input type="text" value={idNumber} onChange={(e) => setIdNumber(e.target.value)} className="form-control" />
              </FormGroup>
              <FormGroup>
                <FormLabel>Birth Date<span style={{color: 'red'}}>*</span></FormLabel>
                <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="form-control" />
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
                      Instructions
                      <input type="text" name="instructions" value={prescription.instructions} onChange={(e) => handlePrescriptionChange(index, e)} placeholder="Instructions" className="form-control" />
                    </label>
                    <label>
                      Start Date <span style={{ color: 'red' }}>*</span>
                      <input type="date" name="dateStart" value={prescription.dateStart} onChange={(e) => handlePrescriptionChange(index, e)} placeholder="Start Date" className="form-control" required />
                    </label>
                    <label>
                      End Date
                      <input type="date" name="dateEnd" value={prescription.dateEnd} onChange={(e) => handlePrescriptionChange(index, e)} placeholder="End Date" className="form-control" />
                    </label>
                  </div>
                ))}
              </FormGroup>
              <FormGroup>
                <FormLabel><h3>Conditions</h3></FormLabel>
                {conditions.map((condition, index) => (
                  <div key={index} className="mb-2">
                    <label>
                      Name <span style={{ color: 'red' }}>*</span>
                      <input type="text" name="name" value={condition.name} onChange={(e) => handleConditionChange(index, e)} placeholder="Name" className="form-control" required />
                    </label>
                    <label>
                      Start Date <span style={{ color: 'red' }}>*</span>
                      <input type="date" name="dateStart" value={condition.dateStart} onChange={(e) => handleConditionChange(index, e)} placeholder="Start Date" className="form-control" required />
                    </label>
                    <label>
                      End Date
                      <input type="date" name="dateEnd" value={condition.dateEnd} onChange={(e) => handleConditionChange(index, e)} placeholder="End Date" className="form-control" />
                    </label>
                  </div>
                ))}
              </FormGroup>
              <button type="submit" className="btn btn-primary">Create Patient</button>
          </Form>
        </div>
      </Modal.Body>
      <Modal.Footer style={{ width: '100%', padding: '0 1rem', display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal.Dialog>
  </Modal>
);
};
export default NewPatientModal;
