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
      <h1>Past Visit Notes</h1>
      <div style={{
        border: '1px solid lightgrey',
        borderRadius: '10px',
        padding: '3%',
        background: 'transparent',
        marginTop: '-4px',
        height: '50vh',
        overflowY: 'auto'
      }}>
        {visitNotes.length > 0 ? (
          visitNotes.map((note, index) => (
            <div key={note.id} onClick={() => openModal(note)} style={{
              cursor: 'pointer',
              marginBottom: '10px',
              borderBottom: index !== visitNotes.length - 1 ? '1px solid #ccc' : 'none'
            }}>
              <p><strong>Date:</strong> {new Date(note.date).toLocaleDateString()}</p>
              <p><strong>Note Preview:</strong> {note.notes ? note.notes.substring(0, 100) + '...' : 'No content available'}</p>
            </div>
          ))
        ) : (
          <p style={{ textAlign: 'center', marginTop: '20px' }}>This patient doesn't have any notes.</p>
        )}

        <Modal show={showModal} onHide={closeModal} centered>
          <Modal.Dialog style={{
            width: '70vw',
            height: '50vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            margin: '0'
          }}>
            <Modal.Header closeButton style={{ width: '100%', borderBottom: '1px solid #dee2e6' }}>
              <Modal.Title>Note Details</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{
              overflowY: 'auto',
              backgroundColor: 'white',
              flexGrow: 1,
            }}>
              {selectedNote && (
                <>
                  <p><strong>Date:</strong> {new Date(selectedNote.date).toLocaleDateString()}</p>
                  <p><strong>Note:</strong> {selectedNote.notes || 'No content available'}</p>
                </>
              )}
            </Modal.Body>
            <Modal.Footer style={{ width: '100%', borderTop: '1px solid #dee2e6' }}>
              <Button variant="secondary" onClick={closeModal}>
                Close
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal>
      </div>
    </div>
  );
};

export default PastVisitNotes;
