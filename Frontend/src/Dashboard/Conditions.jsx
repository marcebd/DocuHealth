import React, { useState, useEffect } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import PastConditions from './PastConditions';

const Conditions = () => {
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
  const [conditions, setConditions] = useState([{
    name: '',
    date: ''
  }]);

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const newConditions = [...conditions];
    newConditions[index][name] = value;
    setConditions(newConditions);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:3002/conditions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prescriptions: conditions.map(condition => ({ ...condition, patientId: viewingPatientId })) })
      });
      if (response.ok) {
        setConditions([{ name: '', date: '' }]);
        setShowModal(false);
      } else {
        const errorResponse = await response.json();
        console.error('Failed to add conditions:', errorResponse);
      }
    } catch (error) {
      console.error('Error adding conditions:', error);
    }
  };

  const addConditionForm = () => {
    setConditions([...conditions, { name: '', date: '' }]);
  };

  return (
    <div id='conditions' style={{ width: '100%', height: '50%' }}>
      <h1>Conditions</h1>
      <PastConditions patientId={viewingPatientId} />
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button variant="primary" onClick={() => setShowModal(true)}
        style={{
          marginTop: '20px',
          backgroundColor: 'white',
          color: 'black',
          borderColor: '#ccc',
          borderWidth: '1px',
          borderStyle: 'solid',
          boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)'
        }}>
          Add New Condition
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
          <Modal.Title>Add New Condition</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            {conditions.map((condition, index) => (
              <div key={index}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={condition.name}
                    onChange={(e) => handleInputChange(index, e)}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={condition.date}
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
              <Button variant="secondary" onClick={addConditionForm} style={{ marginRight: '10px' }}>
                Add Another Condition
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

export default Conditions;
