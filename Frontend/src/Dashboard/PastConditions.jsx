import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, Modal } from 'react-bootstrap';

const PastConditions = ({ patientId }) => {
  const [conditions, setConditions] = useState([]);
  const [selectedCondition, setSelectedCondition] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const tableRef = useRef(null);

  useEffect(() => {
    const fetchConditions = async () => {
      try {
        const response = await fetch(`http://localhost:3002/conditions/${patientId}`);
        if (response.ok) {
          const data = await response.json();
          setConditions(data);
        } else {
          console.error('Failed to fetch conditions');
        }
      } catch (error) {
        console.error('Error fetching conditions:', error);
      }
    };

    fetchConditions();
  }, [patientId]);

  const handleRowClick = (condition) => {
    setSelectedCondition(condition);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Calculate and set the maximum height for the table
  const maxHeight = tableRef.current ? tableRef.current.parentElement.clientHeight * 0.8 : 'auto';

  return (
    <>
      <div ref={tableRef} style={{ maxHeight: maxHeight, overflowY: 'auto' }}>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {conditions.map(condition => (
              <tr key={condition.id} onClick={() => handleRowClick(condition)}>
                <td>{condition.name}</td>
                <td>{new Date(condition.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Condition Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCondition && (
            <>
              <p><strong>Name:</strong> {selectedCondition.name}</p>
              <p><strong>Date:</strong> {new Date(selectedCondition.date).toLocaleDateString()}</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PastConditions;
