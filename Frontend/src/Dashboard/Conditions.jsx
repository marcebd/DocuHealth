import React, { useState, useEffect } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import PastConditions from './PastConditions';

const Conditions = () => {
  const [viewingPatientId, setViewingPatientId] = useState(localStorage.getItem('viewingPatient'));
  const [showModal, setShowModal] = useState(false);
  const [conditions, setConditions] = useState([{
    name: '',
    dateStart: '',
    dateEnd: ''
  }]);
  const [isHovering, setIsHovering] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentPatientId = localStorage.getItem('viewingPatient');
      if (currentPatientId !== viewingPatientId) {
        setViewingPatientId(currentPatientId);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [viewingPatientId]);


  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const newConditions = [...conditions];
    newConditions[index][name] = value;
    setConditions(newConditions);
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const isValid = conditions.every(condition =>
      condition.name.trim() !== '' &&
      condition.dateStart.trim() !== ''
    );
    if (!isValid) {
      setError('All fields are required. Please fill in all data.');
      return;
    }
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
        window.location.reload();
      } else {
        const errorResponse = await response.json();
        console.error('Failed to add conditions:', errorResponse);
      }
    } catch (error) {
      console.error('Error adding conditions:', error);
    }
  };

  const addConditionForm = () => {
    setConditions([...conditions, { name: '', dateStart: '', dateEnd: '' }]);
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
        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
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
                  <Form.Label>Start Date </Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={condition.dateStart}
                    onChange={(e) => handleInputChange(index, e)}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={condition.dateEnd}
                    onChange={(e) => handleInputChange(index, e)}
                    required
                  />
                </Form.Group>
              </div>
            ))}
            <div style={{display:'flex', width: '100%', justifyContent: 'center', marginTop:'0%'}}>
            <Button variant="secondary" onClick={addConditionForm} >
              Add Another Condition
            </Button>
            </div>
            <div style={{display:'flex', width: '100%', justifyContent: 'center'}}>
            <Button
              variant="primary"
              type="submit"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              style={{
                backgroundColor: isHovering ? '#ffcccc' : 'white',
                color: 'black',
                borderColor: '#ccc',
                boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                transition: 'background-color 0.3s' // Smooth transition for background color
              }}>
              Submit
            </Button>
          </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Conditions;
