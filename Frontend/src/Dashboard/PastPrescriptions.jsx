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
          setError('Failed to fetch prescriptions');
          setIsLoading(false);
        }
      } catch (error) {
        setError('Error fetching prescriptions:', error);
        setIsLoading(false);
      }
    };

    fetchPrescriptions();
  }, [patientId]);

  const handleRowClick = (prescription) => {
    setSelectedPrescription(prescription);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    try {
      const updatedPrescription = {
        id: selectedPrescription.id,
        name: selectedPrescription.name,
        dose: selectedPrescription.dose,
        instructions: selectedPrescription.instructions,
        dateStart: new Date(selectedPrescription.dateStart),
        dateEnd: new Date(selectedPrescription.dateEnd)
      };
      const prescription = {prescription: updatedPrescription};
      const response = await fetch(`http://localhost:3002/prescriptions/update/${selectedPrescription.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(prescription)
      });
      if (!response.ok) {
        const responseData = await response.json();
        setError('Failed to save the updated prescription. Please try again.', responseData);
        return;
      }
      setSelectedPrescription(null);
      setShowModal(false);
      window.location.reload();
    } catch (error) {
      setError(`An error occurred while saving the updated prescription: ${error}`);
    }
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

<Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Prescription Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {selectedPrescription && (
            <>
              <label>
                Name:
                <input type="text" value={selectedPrescription.name} onChange={(e) => setSelectedPrescription({ ...selectedPrescription, name: e.target.value })} />
              </label>
              <br />
              <label>
                Dose:
                <input type="text" value={selectedPrescription.dose} onChange={(e) => setSelectedPrescription({ ...selectedPrescription, dose: e.target.value })} />
              </label>
              <br />
              <label>
                Instructions:
                <textarea value={selectedPrescription.instructions} onChange={(e) => setSelectedPrescription({ ...selectedPrescription, instructions: e.target.value })} />
              </label>
              <br />
              <label>
                Date Start:
                <input type="date" defaultValue={selectedPrescription.dateStart.slice(0, 10)}  onChange={(e) => setSelectedPrescription({ ...selectedPrescription, dateStart: e.target.value })} />
              </label>
              <br />
              <label>
                Date End:
                <input type="date" defaultValue={selectedPrescription.dateEnd.slice(0, 10)}  onChange={(e) => setSelectedPrescription({ ...selectedPrescription, dateEnd: e.target.value })} />
              </label>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PastPrescriptions;
