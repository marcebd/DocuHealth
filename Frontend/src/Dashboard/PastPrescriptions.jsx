import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, Modal } from 'react-bootstrap';

const PastPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [patientId, setViewingPatientId] = useState(localStorage.getItem('viewingPatient'));
  const tableRef = useRef(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentPatientId = localStorage.getItem('viewingPatient');
      if (currentPatientId !== patientId) {
        setViewingPatientId(currentPatientId);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [patientId]);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const response = await fetch(`http://localhost:3002/prescriptions/${patientId}`);
        if (response.ok) {
          const data = await response.json();
          setPrescriptions(data);
        } else {
          console.error('Failed to fetch prescriptions');
        }
      } catch (error) {
        console.error('Error fetching prescriptions:', error);
      }
    };

    fetchPrescriptions();
  }, [patientId]);

  const handleRowClick = (prescription) => {
    setSelectedPrescription(prescription);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const maxHeight = tableRef.current ? tableRef.current.parentElement.clientHeight * 0.8 : 'auto';

  return (
    <div ref={tableRef} style={{ maxHeight: maxHeight, overflowY: 'auto' }}>
      {prescriptions.length > 0 ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Dose</th>
            </tr>
          </thead>
          <tbody>
            {prescriptions.map(prescription => (
              <tr key={prescription.id} onClick={() => handleRowClick(prescription)}>
                <td>{prescription.name}</td>
                <td>{prescription.dose}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p style={{ textAlign: 'center', marginTop: '20px' }}>This patient doesn't have any prescriptions.</p>
      )}

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Prescription Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPrescription && (
            <>
              <p><strong>Name:</strong> {selectedPrescription.name}</p>
              <p><strong>Dose:</strong> {selectedPrescription.dose}</p>
              <p><strong>Instructions:</strong> {selectedPrescription.instructions || 'N/A'}</p>
              <p><strong>Date:</strong> {new Date(selectedPrescription.date).toLocaleDateString()}</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PastPrescriptions;
