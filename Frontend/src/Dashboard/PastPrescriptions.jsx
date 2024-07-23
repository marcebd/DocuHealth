import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, Modal } from 'react-bootstrap';
import ContentLoader from 'react-content-loader';

const PastPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [patientId, setViewingPatientId] = useState(localStorage.getItem('viewingPatient'));
  const tableRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
          setIsLoading(false);
        } else {
          console.error('Failed to fetch prescriptions');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching prescriptions:', error);
        setIsLoading(false);
      }
    };

    fetchPrescriptions();
  }, [patientId]);

  const handleRowClick = (prescription) => {
    setSelectedPrescription(prescription);
    setShowModal(true);
  };

  const PrescriptionLoader = () => (
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

  return (
    <div ref={tableRef} style={{ maxHeight: '80vh', overflowY: 'auto' }}>
      {isLoading ? (
        Array.from({ length: 5 }, (_, index) => <PrescriptionLoader key={index} />)
      ) : prescriptions.length > 0 ? (
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

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Prescription Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {selectedPrescription && (
            <>
              <p><strong>Name:</strong> {selectedPrescription.name}</p>
              <p><strong>Dose:</strong> {selectedPrescription.dose}</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PastPrescriptions;
