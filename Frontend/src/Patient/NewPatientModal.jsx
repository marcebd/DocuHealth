import React, { useState, useEffect } from 'react';
import { Modal, Row, Col, Table, Form, FormGroup, FormLabel } from 'react-bootstrap';
import SearchBarPatient from './SearchBarPatient';

const NewPatientModal = ({ onClose, onCreate }) => {
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [prescriptions, setPrescriptions] = useState([{ name: '', dose: '', instructions: '', date: '' }]);
  const [conditions, setConditions] = useState([{ name: '', date: '' }]);
  const [searchTerm, setSearchTerm] = useState('');
  const [patientsInTabs, setPatientsInTabs] = useState([]);
  const [patientsData, setPatientsData] = useState([]);
  const userId = JSON.parse(localStorage.getItem("userId"));

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

  const handleSearch = (event) => {
    // Handle search logic here
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const arePrescriptionsValid = prescriptions.every(p => p.name && p.dose && p.instructions && p.date);
    const areConditionsValid = conditions.every(c => c.name && c.date);

    if (!arePrescriptionsValid || !areConditionsValid) {
      console.error("All fields in prescriptions and conditions must be filled.");
      return;
    }
    const patientData = {
      userId,
      firstName,
      middleName,
      lastName,
      idNumber,
      birthDate,
      prescriptions,
      conditions
    };

    try {
      const response = await fetch('http://localhost:3001/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(patientData)
      });
      const responseData = await response.json();
      if (!response.ok) {
        console.error('Failed to create patient:', responseData);
      } else {
        const updatedPatientTabs = [...patientsInTabs, responseData.patient.id];
        setPatientsInTabs(updatedPatientTabs);
        localStorage.setItem('patientTabs', JSON.stringify(updatedPatientTabs));
        localStorage.setItem('viewingPatient', responseData.patient.id);
        window.location.reload();
        onCreate();
        onClose();
      }
    } catch (error) {
      console.error("Error creating patient:", error);
    }
  };

  const handlePatientClick = (patient) => {
    const updatedPatientTabs = [...patientsInTabs, patient.id];
    setPatientsInTabs(updatedPatientTabs);
    localStorage.setItem('patientTabs', JSON.stringify(updatedPatientTabs));
    localStorage.setItem('viewingPatient', patient.id);
    window.location.reload();
    onCreate();
    onClose();
    };

    return (
      <Modal show={true} onHide={onClose} >
      <Modal.Dialog>
        <Modal.Header closeButton>
          <Modal.Title>Find Patient or Create One</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col sm={6} style={{ maxHeight: '90%', overflowY: 'auto' }}>
              <SearchBarPatient placeholder="Search for a patient" onChange={handleSearch} />
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
                      <td>{patient.firstName}</td>
                      <td>{patient.middleName}</td>
                      <td>{patient.lastName}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
          </Col>
          <Col sm={6}>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <FormLabel>First Name:</FormLabel>
                <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="form-control" />
              </FormGroup>
              <FormGroup>
                <FormLabel>Middle Name:</FormLabel>
                <input type="text" value={middleName} onChange={(e) => setMiddleName(e.target.value)} className="form-control" />
              </FormGroup>
              <FormGroup>
                <FormLabel>Last Name:</FormLabel>
                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="form-control" />
              </FormGroup>
              <FormGroup>
                <FormLabel>ID Number:</FormLabel>
                <input type="text" value={idNumber} onChange={(e) => setIdNumber(e.target.value)} className="form-control" />
              </FormGroup>
              <FormGroup>
                <FormLabel>Birth Date:</FormLabel>
                <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="form-control" />
              </FormGroup>
              <FormGroup>
                <FormLabel>Prescriptions:</FormLabel>
                {prescriptions.map((prescription, index) => (
                  <div key={index} className="mb-2">
                    <input type="text" name="name" value={prescription.name} onChange={(e) => handlePrescriptionChange(index, e)} placeholder="Name" className="form-control" />
                    <input type="text" name="dose" value={prescription.dose} onChange={(e) => handlePrescriptionChange(index, e)} placeholder="Dose" className="form-control" />
                    <input type="text" name="instructions" value={prescription.instructions} onChange={(e) => handlePrescriptionChange(index, e)} placeholder="Instructions" className="form-control" />
                    <input type="date" name="date" value={prescription.date} onChange={(e) => handlePrescriptionChange(index, e)} placeholder="Date" className="form-control" />
                  </div>
                ))}
              </FormGroup>
              <FormGroup>
                <FormLabel>Conditions:</FormLabel>
                {conditions.map((condition, index) => (
                  <div key={index} className="mb-2">
                    <input type="text" name="name" value={condition.name} onChange={(e) => handleConditionChange(index, e)} placeholder="Name" className="form-control" />
                    <input type="date" name="date" value={condition.date} onChange={(e) => handleConditionChange(index, e)} placeholder="Date" className="form-control" />
                  </div>
                ))}
              </FormGroup>
              <button type="submit" className="btn btn-primary">Create Patient</button>
            </Form>
          </Col>
        </Row>
      </Modal.Body>
      </Modal.Dialog>
    </Modal>
    );
    };

    export default NewPatientModal;
