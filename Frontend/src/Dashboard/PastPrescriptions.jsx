import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, Modal } from 'react-bootstrap';

const PastPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [patientId, setViewingPatientId] = useState(localStorage.getItem('viewingPatient'));
  const tableRef = useRef(null);
  const [updatedPrescriptionName, setUpdatedPrescriptionName] = useState('');
  const [updatedPrescriptionDose, setUpdatedPrescriptionDose] = useState('');
  const [updatedPrescriptionInstructions, setUpdatedPrescriptionInstructions] = useState('');
  const [updatedPrescriptionDateStart, setUpdatedPrescriptionDateStart] = useState('');
  const [updatedPrescriptionDateEnd, setUpdatedPrescriptionDateEnd] = useState('');
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
    setUpdatedPrescriptionName(prescription.name);
    setUpdatedPrescriptionDose(prescription.dose);
    setUpdatedPrescriptionInstructions(prescription.instructions);
    setUpdatedPrescriptionDateStart(prescription.dateStart.slice(0, 10));
    setUpdatedPrescriptionDateEnd(prescription.dateEnd.slice(0, 10));
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSubmit = async () => {
    const updatedPrescription = {
      name: updatedPrescriptionName ? updatedPrescriptionName : selectedPrescription.name,
      dose: updatedPrescriptionDose ? updatedPrescriptionDose : selectedPrescription.dose,
      instructions: updatedPrescriptionInstructions ? updatedPrescriptionInstructions : selectedPrescription.instructions,
      dateStart: updatedPrescriptionDateStart ? updatedPrescriptionDateStart: selectedPrescription.dateStart,
      dateEnd: updatedPrescriptionDateEnd ? updatedPrescriptionDateEnd: selectedPrescription.dateEnd
    };

    const prescription = {prescription: updatedPrescription};

    try {
      const response = await fetch(`http://localhost:3002/prescriptions/update/${selectedPrescription.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(prescription)
      });

      if (!response.ok) {
        const responseData = await response.json();
        console.error('Failed to update prescription:', responseData);
        setError('Failed to save the updated prescription. Please try again.');
        return;
      }
      setShowModal(false);
      window.location.reload();
    } catch (error) {
      console.error("Error updating prescription:", error);
      setError(`An error occurred while saving the updated prescription: ${error}`);
    }
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
        {error && <p style={{ color: 'red' }}>{error}</p>}
          {selectedPrescription && (
            <>
              <p><strong>Name:</strong> <input type="text" defaultValue={updatedPrescriptionName} onChange={(e) => setUpdatedPrescriptionName(e.target.value)} /></p>
              <p><strong>Dose:</strong> <input type="text" defaultValue={updatedPrescriptionDose} onChange={(e) => setUpdatedPrescriptionDose(e.target.value)} /></p>
              <p><strong>Instructions:</strong> <textarea defaultValue={updatedPrescriptionInstructions} onChange={(e) => setUpdatedPrescriptionInstructions(e.target.value)} style={{ width: '100%', height: '100px' }} /></p>
              <p><strong>Start Date:</strong> <input type="date" defaultValue={updatedPrescriptionDateStart} onChange={(e) => setUpdatedPrescriptionDateStart(e.target.value)} /></p>
              <p><strong>End Date:</strong> <input type="date" defaultValue={updatedPrescriptionDateEnd} onChange={(e) => setUpdatedPrescriptionDateEnd(e.target.value)} /></p>
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
