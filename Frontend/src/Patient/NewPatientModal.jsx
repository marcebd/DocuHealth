import React, { useState, useEffect } from 'react';
import { Modal, Row, Col, Table, Form, FormGroup, FormLabel } from 'react-bootstrap';
import { useUser } from '../UserContext';
import SearchBarPatient from './SearchBarPatient';

const NewPatientModal = ({ onHide, onCreate }) => {
  const { user } = useUser();
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [prescriptions, setPrescriptions] = useState([{ name: '', dose: '', instructions: '', date: '' }]);
  const [conditions, setConditions] = useState([{ name: '', date: '' }]);
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userId = user.id;
    async function fetchData() {
      try {
        const response = await fetch(`http://localhost:3000/users/${userId}/patients`, {
          method: 'GET',
        });
        if (!response.ok) {
          console.error('Failed to fetch patients:', response);
        } else {
          const patientsData = await response.json();
          setPatients(patientsData);
        }
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    }
    fetchData();
  }, []);

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

    const userId = user.id;
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

    console.log("Frontend", patientData);

    try {
      const response = await fetch('http://localhost:3000/patients', {
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
        onCreate(firstName + " " + lastName);
        onHide();
      }
    } catch (error) {
      console.error("Error creating patient:", error);
    }
  };

  return (
    <Modal show={true} onHide={onHide}>
      <Modal.Header>
        <Modal.Title>New Patient</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col sm={6}>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>ID Number</th>
                  <th>Birth Date</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient) => (
                  <tr key={patient.id}>
                    <td>{patient.firstName}</td>
                    <td>{patient.id}</td>
                    <td>{patient.birthDate}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <SearchBarPatient placeholder="Search for a patient" onChange={handleSearch} />
          </Col>
          <Col sm={6}>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <FormLabel>First Name:</FormLabel>
                <input type="text" value={firstName} onChange={(event) => setFirstName(event.target.value)} />
              </FormGroup>
              <FormGroup>
                <FormLabel>Middle Name:</FormLabel>
                <input type="text" value={middleName} onChange={(event) => setMiddleName(event.target.value)} />
              </FormGroup>
              <FormGroup>
                <FormLabel>Last Name:</FormLabel>
                <input type="text" value={lastName} onChange={(event) => setLastName(event.target.value)} />
              </FormGroup>
              <FormGroup>
                <FormLabel>ID Number:</FormLabel>
                <input type="text" value={idNumber} onChange={(event) => setIdNumber(event.target.value)} />
              </FormGroup>
              <FormGroup>
                <FormLabel>Birth Date:</FormLabel>
                <input type="date" value={birthDate} onChange={(event) => setBirthDate(event.target.value)} />
                <FormGroup>
                <FormLabel>Prescriptions:</FormLabel>
                {prescriptions.map((prescription, index) => (
                  <div key={index}>
                    <input type="text" name="name" value={prescription.name} onChange={(e) => handlePrescriptionChange(index, e)} placeholder="Name" />
                    <input type="text" name="dose" value={prescription.dose} onChange={(e) => handlePrescriptionChange(index, e)} placeholder="Dose" />
                    <input type="text" name="instructions" value={prescription.instructions} onChange={(e) => handlePrescriptionChange(index, e)} placeholder="Instructions" />
                    <input type="date" name="date" value={prescription.date} onChange={(e) => handlePrescriptionChange(index, e)} placeholder="Date" />
                  </div>
                ))}
              </FormGroup>
              <FormGroup>
                <FormLabel>Conditions:</FormLabel>
                {conditions.map((condition, index) => (
                  <div key={index}>
                    <input type="text" name="name" value={condition.name} onChange={(e) => handleConditionChange(index, e)} placeholder="Name" />
                    <input type="date" name="date" value={condition.date} onChange={(e) => handleConditionChange(index, e)} placeholder="Date" />
                  </div>
                ))}
              </FormGroup>
              <button type="submit">Create Patient</button>
            </FormGroup>
            </Form>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default NewPatientModal;
