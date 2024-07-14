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
    dateStart: '',
    dateEnd: ''
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
          dateStart: '',
          dateEnd: ''
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
    <div id='prescriptions' style={{ width: '100%', height: '50%' }}>
      <h1>Prescriptions</h1>
        <PastPrescriptions patientId={viewingPatientId} />
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            onClick={() => setShowModal(true)}
            style={{
              marginTop: '20px',
              backgroundColor: 'white',
              color: 'black',
              borderColor: '#ccc',
              borderWidth: '1px',
              borderStyle: 'solid',
              boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)'
            }}
          >
            Add New Prescription
          </Button>
        </div>
        <Modal show={showModal} onHide={() => setShowModal(false)} centered
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.5)'
        }}>
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
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="dateStart"
                      value={prescription.dateStart}
                      onChange={(e) => handleInputChange(index, e)}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>End Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="dateEnd"
                      value={prescription.dateEnd}
                      onChange={(e) => handleInputChange(index, e)}
                      required
                    />
                  </Form.Group>
                </div>
              ))}
              <div style={{display:'flex', flexDirection: 'column', alignItems: 'center', height: '40%'}}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  height: '50%',
                  marginTop: '7%'
                }}>
                  <Button variant="secondary" onClick={addPrescriptionForm}>
                    Add Another Prescription
                  </Button>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  height: '50%',

                }}>
              <Button variant="primary" type="submit">
                Submit
              </Button>
              </div>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
  );
};

export default Prescriptions;
