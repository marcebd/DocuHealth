import React, { useState, useEffect } from 'react';
import PastVisitNotes from './PastVisitNotes';

const Notepad = () => {
  const [viewingPatientId, setViewingPatientId] = useState(localStorage.getItem('viewingPatient'));

  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentPatientId = localStorage.getItem('viewingPatient');
      if (currentPatientId !== viewingPatientId) {
        setViewingPatientId(currentPatientId);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [viewingPatientId]);

  const [note, setNote] = useState('');
  const [visitDate, setVisitDate] = useState('');

  const handleNoteChange = (event) => {
    setNote(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const patientData = {
      patientId: viewingPatientId,
      note,
      visitDate
    };

    try {
      const response = await fetch('http://localhost:3002/visitNotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(patientData)
      });
      if (!response.ok) {
        const responseData = await response.json();
        console.error('Failed to create note:', responseData);
        return;
      }
    } catch (error) {
      console.error("Error creating note:", error);
    }
  };

  return (
    <div id='notes' style={{ width: '45%' }}>
      <h1>Today's Visit Note:</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <label style={{ alignSelf: 'flex-start', width: '100%' }}>
          <span style={{ fontSize: '1.2em' }}>Visit Date:</span>
          <input type="date" value={visitDate} onChange={(event) => setVisitDate(event.target.value)} style={{ marginLeft: '10px' }} />
        </label>
        <textarea value={note} onChange={handleNoteChange} style={{ width: '95%', height: '60vh', marginTop: '10px' }} />
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
          <button type="submit">Save Note</button>
        </div>
      </form>
      <PastVisitNotes patientId={viewingPatientId} />
    </div>
  );
};

export default Notepad;
