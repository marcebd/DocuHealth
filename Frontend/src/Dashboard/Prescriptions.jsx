import React, { useState, useEffect } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import PastPrescriptions from './PastPrescriptions';

const Prescriptions = () => {
  const [viewingPatientId, setViewingPatientId] = useState(localStorage.getItem('viewingPatient'));

  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentPatientId = localStorage.getItem('viewingPatient');
      if (currentPatientId !== viewingPatientId) {
        setViewingPatientId(currentPatientId);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [viewingPatientId]);

  const [showModal, setShowModal] = useState(false);
  const [prescriptions, setPrescriptions] = useState([{
    name: '',
    dose: '',
    instructions: '',
    date: ''
  }]);

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const newPrescriptions = [...prescriptions];
    newPrescriptions[index][name] = value;
    setPrescriptions(newPrescriptions);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:3002/prescriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prescriptions: prescriptions.map(prescription => ({ ...prescription, patientId: viewingPatientId })) })
      });
      if (response.ok) {
        setPrescriptions([{
          name: '',
          dose: '',
          instructions: '',
          date: ''
        }]);
        setShowModal(false);
      } else {
        const errorResponse = await response.json();
        console.error('Failed to add prescriptions:', errorResponse);
      }
    } catch (error) {
      console.error('Error adding prescriptions:', error);
    }
};
  const addPrescriptionForm = () => {
    setPrescriptions([...prescriptions, {
      name: '',
      dose: '',
      instructions: '',
      date: ''
    }]);
  };

  return (
    <>
      <PastPrescriptions patientId={viewingPatientId} />
      <Button variant="primary" onClick={() => setShowModal(true)}>
        Add New Prescription
      </Button>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Prescription</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            {prescriptions.map((prescription, index) => (
              <div key={index}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={prescription.name}
                    onChange={(e) => handleInputChange(index, e)}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Dose</Form.Label>
                  <Form.Control
                    type="text"
                    name="dose"
                    value={prescription.dose}
                    onChange={(e) => handleInputChange(index, e)}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Instructions</Form.Label>
                  <Form.Control
                    type="text"
                    name="instructions"
                    value={prescription.instructions}
                    onChange={(e) => handleInputChange(index, e)}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={prescription.date}
                    onChange={(e) => handleInputChange(index, e)}
                    required
                  />
                </Form.Group>
              </div>
            ))}
            <Button variant="secondary" onClick={addPrescriptionForm} style={{ marginRight: '10px' }}>
              Add Another Prescription
            </Button>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Prescriptions;
