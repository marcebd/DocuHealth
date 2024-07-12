import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';

const PastVisitNotes = ({ patientId }) => {
  const [visitNotes, setVisitNotes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`http://localhost:3002/visitNotes/${patientId}`, {
          method: 'GET',
        });
        if (!response.ok) {
          console.error('Failed to fetch visit notes:', response);
        } else {
          const data = await response.json();
          setVisitNotes(data);
        }
      } catch (error) {
        console.error('Error fetching visit notes:', error);
      }
    }
    fetchData();
  }, [patientId]);

  const openModal = (note) => {
    setSelectedNote(note);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      <h2>Past Visit Notes</h2>
      {visitNotes.map((note) => (
        <div key={note.id} onClick={() => openModal(note)} style={{ cursor: 'pointer', marginBottom: '10px' }}>
          <p><strong>Date:</strong> {new Date(note.date).toLocaleDateString()}</p>
          <p><strong>Note Preview:</strong> {note.notes ? note.notes.substring(0, 100) + '...' : 'No content available'}</p>
        </div>
      ))}

      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Note Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedNote && (
            <>
              <p><strong>Date:</strong> {new Date(selectedNote.date).toLocaleDateString()}</p>
              <p><strong>Note:</strong> {selectedNote.notes || 'No content available'}</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PastVisitNotes;
