import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, Modal } from 'react-bootstrap';
import ContentLoader from 'react-content-loader';

const PastConditions = ({ patientId }) => {
  let parsedPatientId = JSON.parse(patientId);
  const [conditions, setConditions] = useState([]);
  const [selectedCondition, setSelectedCondition] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const tableRef = useRef(null);
  const [updatedConditionName, setUpdatedConditionName] = useState('');
  const [updatedConditionDateStart, setUpdatedConditionDateStart] = useState('');
  const [updatedConditionDateEnd, setUpdatedConditionDateEnd] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConditions = async () => {
      try {
        const response = await fetch(`http://localhost:3002/conditions/${parsedPatientId}`);
        if (response.ok) {
          const data = await response.json();
          setConditions(data);
          setIsLoading(false);
        } else {
          console.error('Failed to fetch conditions');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching conditions:', error);
        setIsLoading(false);
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

  const handleSubmit = async () => {
    const updatedCondition = {
      name: updatedConditionName ? updatedConditionName: selectedCondition.name,
      dateStart: updatedConditionDateStart ? updatedConditionDateStart : selectedCondition.dateStart.slice(0, 10),
      dateEnd: updatedConditionDateEnd ? updatedConditionDateEnd : selectedCondition.dateEnd.slice(0, 10)
    };
    const condition = {condition: updatedCondition};

    try{
      const response = await fetch(`http://localhost:3002/conditions/update/${selectedCondition.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(condition)
      });
      if (!response.ok) {
        const responseData = await response.json();
        console.error('Failed to update condition:', responseData);
        setError('Failed to save the updated condition. Please try again.');
        return;
      }
      setShowModal(false);
      window.location.reload();
    } catch (error) {
      console.error("Error updating condition:", error);
      setError(`An error occurred while saving the updated condition: ${error}`);
    }
  };

  const ConditionLoader = () => (
    <ContentLoader
      speed={2}
      width={700}
      height={40}
      viewBox="0 0 700 40"
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
    >
      <rect x="0" y="0" rx="3" ry="3" width="700" height="40" />
    </ContentLoader>
  );

  const maxHeight = tableRef.current ? tableRef.current.parentElement.clientHeight * 0.8 : 'auto';
  return (
    <>
      <div ref={tableRef} style={{ maxHeight: maxHeight, overflowY: 'auto' }}>
      {isLoading ? (
          Array.from({ length: 5 }, (_, index) => <ConditionLoader key={index} />)
        ) : conditions.length > 0 ? (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Date Start</th>
                <th>Date End</th>
              </tr>
            </thead>
            <tbody>
              {conditions.map(condition => (
                <tr key={condition.id} onClick={() => handleRowClick(condition)}>
                  <td>{condition.name}</td>
                  <td>{new Date(condition.dateStart).toLocaleDateString()}</td>
                  <td>{new Date(condition.dateEnd).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p style={{ textAlign: 'center', marginTop: '20px' }}>This patient doesn't have any conditions.</p>
        )}
      </div>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Condition Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {selectedCondition && (
          <>
            <p><strong>Name:</strong> <input type="text" name="idNumber" defaultValue={selectedCondition.name} onChange={(e) => setUpdatedConditionName(e.target.value)}/></p>
            <p><strong>Date Start:</strong> <input type="date" name="dateStart" defaultValue={selectedCondition.dateStart.slice(0, 10)} onChange={(e) => setUpdatedConditionDateStart(e.target.value)}/></p>
            <p><strong>Date End:</strong> <input type="date" name="dateEnd" defaultValue={selectedCondition.dateEnd.slice(0, 10)} onChange={(e) => setUpdatedConditionDateEnd(e.target.value)}/></p>
          </>
        )}
      </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PastConditions;
