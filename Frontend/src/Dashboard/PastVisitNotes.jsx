import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import ContentLoader from 'react-content-loader';

const PastVisitNotes = ({ patientId }) => {
  const [visitNotes, setVisitNotes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState('');
  const [updatedNote, setUpdatedNote] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`http://localhost:3002/visitNotes/${patientId}`, {
          method: 'GET',
        });
        if (!response.ok) {
          setError('Failed to fetch visit notes.');
        } else {
          const data = await response.json();
          setVisitNotes(data);
          setIsLoading(false);
        }
      } catch (error) {
        setError('An error occurred while fetching visit notes.');
        setIsLoading(false);
      }
    }
    fetchData();
  }, [patientId]);

  const openModal = (note) => {
    setSelectedNote(note);
    setShowModal(true);
    setError('');
  };

  const closeModal = () => {
    setShowModal(false);
    setError('');
  };

  const handleSubmit = async () => {
    try {
      const notesData = { notes: updatedNote };

      const response = await fetch(`http://localhost:3002/visitNotes/update/${selectedNote.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(notesData)
      });

      if (!response.ok) {
        const responseData = await response.json();
        setError('Failed to save the updated note. Please try again.');
        return;
      }
      setUpdatedNote('');
      closeModal();
      window.location.reload();
    } catch (error) {
      setError(`An error occurred while saving the updated note: ${error}`);
    }
  };

  const NoteLoader = () => (
    <ContentLoader
      speed={2}
      width={400}
      height={60}
      viewBox="0 0 400 60"
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
    >
      <rect x="0" y="0" rx="3" ry="3" width="400" height="20" />
      <rect x="0" y="30" rx="3" ry="3" width="380" height="20" />
    </ContentLoader>
  );

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
        {isLoading ? (
          Array.from({ length: 5 }, (_, index) => <NoteLoader key={index} />)
        ) : visitNotes.length > 0 ? (
          visitNotes.map((note, index) => (
            <div key={note.id} onClick={() => openModal(note)} style={{
              cursor: 'pointer',
              marginBottom: '10px',
              borderBottom: index !== visitNotes.length - 1 ? '1px solid #ccc' : 'none'
            }}>
              <p><strong>Date:</strong> {new Date(note.date).toDateString()}</p>
              <p><strong>Note Preview:</strong> {note.notes ? note.notes.substring(0, 100) + '...' : 'No content available'}</p>
            </div>
          ))
        ) : (
          <p style={{ textAlign: 'center', marginTop: '20px' }}>This patient doesn't have any notes.</p>
        )}

      <Modal show={showModal} onHide={closeModal} centered>
        <Modal.Dialog style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          margin: '0'
        }}>
          <Modal.Header closeButton style={{borderBottom: '1px solid #dee2e6' }}>
            <Modal.Title >Note Details</Modal.Title>
          </Modal.Header>
          <Modal.Body >
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {selectedNote && (
              <>
                <p><strong>Date:</strong> {new Date(selectedNote.date).toLocaleDateString()}</p>
                <p><strong>Note:</strong></p>
                <div style={{display:'flex', justifyContent: 'center', width: '100%'}}>
                  <textarea defaultValue={selectedNote.notes} onChange={(e) => setUpdatedNote(e.target.value)} style={{height:'60vh', width:'25vw'}}/>
                </div>
              </>
            )}
          </Modal.Body>
          <Modal.Footer style={{ width: '100%', borderTop: '1px solid #dee2e6' }}>
            <Button variant="secondary" onClick={handleSubmit}>
              Submit
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal>
      </div>
  </div>
);
};

export default PastVisitNotes;
