import React, { useState, useEffect } from 'react';
import { Modal, Row, Col, Table, Form, FormGroup, FormLabel } from 'react-bootstrap';
import SearchBarPatient from './SearchBarPatient';

const NewPatientModal = ({ onClose, onCreate}) => {
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setlastName] = useState('');
  const [idNumber, setidNumber] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [prescriptions, setPrescriptions] = useState([{ name: '', dose: '', instructions: '', date: '' }]);
  const [conditions, setConditions] = useState([{ name: '', date: '' }]);
  const [searchTerm, setSearchTerm] = useState('');
  const [patientsInTabs, setPatientsInTabs] = useState([]);
  useEffect(() => {
    const storedPatients = localStorage.getItem('patientTabs');
    if (storedPatients) {
      setPatientsInTabs(JSON.parse(storedPatients));
    } else {
      setPatientsInTabs([]);
    }
  }, []);
  let [patientsData, setPatientsData] = useState([]);
  const userId = JSON.parse(localStorage.getItem("userId"));;

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
        localStorage.setItem('viewingPatient',  responseData.patient.id);
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
    <Modal show={true} onHide={handlePatientClick}>
      <Modal.Header>
        <Modal.Title>Find Patient or Create One</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col sm={6}>
            <SearchBarPatient placeholder="Search for a patient" onChange={handleSearch} />
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Middle Name</th>
                  <th>Last Name</th>
                </tr>
              </thead>
              <tbody>
                {patientsData.map((patient) => (
                  <tr key={patient.id}>
                    <td onClick={() => handlePatientClick(patient)}>{patient.firstName}</td>
                    <td onClick={() => handlePatientClick(patient)}>{patient.middleName}</td>
                    <td onClick={() => handlePatientClick(patient)}>{patient.lastName}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
          <Col sm={6}>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <label>First Name:</label>
                <input type="text" value={firstName} onChange={(event) => setFirstName(event.target.value)} />
              </FormGroup>
              <FormGroup>
                <label>Middle Name:</label>
                <input type="text" value={middleName} onChange={(event) => setMiddleName(event.target.value)} />
              </FormGroup>
              <FormGroup>
                <label>last Name:</label>
                <input type="text" value={lastName} onChange={(event) => setlastName(event.target.value)} />
              </FormGroup>
              <FormGroup>
                <label>iD Number:</label>
                <input type="text" value={idNumber} onChange={(event) => setidNumber(event.target.value)} />
              </FormGroup>
              <FormGroup>
                <label>Birth Date:</label>
                <input type="date" value={birthDate} onChange={(event) => setBirthDate(event.target.value)} />
              </FormGroup>
              <FormGroup>
                <label>Prescriptions:</label>
                {prescriptions.map((prescription, index) => (
                  <div key={index}>
                    <input type="text" name="name" value={prescription.name} onChange={(e) => handlePrescriptionChange(index, e)} placeholder="Name" />
                    <input type="text" name="dose" value={prescription.dose} onChange={(e) => handlePrescriptionChange(index, e)} placeholder="Dose" />
                    <input type="text" name="instructions" value={prescription.instructions} onChange={(e) => handlePrescriptionChange(index, e)} placeholder="instructions" />
                    <input type="date" name="date" value={prescription.date} onChange={(e) => handlePrescriptionChange(index, e)} placeholder="Date" />
                  </div>
                ))}
              </FormGroup>
              <FormGroup>
                <label>Conditions:</label>
                {conditions.map((condition, index) => (
                  <div key={index}>
                    <input type="text" name="name" value={condition.name} onChange={(e) => handleConditionChange(index, e)} placeholder="Name" />
                    <input type="date" name="date" value={condition.date} onChange={(e) => handleConditionChange(index, e)} placeholder="Date" />
                  </div>
                ))}
              </FormGroup>
              <button type="submit">Create Patient</button>
            </Form>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
  };

  export default NewPatientModal;
