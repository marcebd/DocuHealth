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

      const responseData = await response.json();
      console.log(responseData);
    } catch (error) {
      console.error("Error creating note:", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Visit Date:
          <input type="date" value={visitDate} onChange={(event) => setVisitDate(event.target.value)} />
        </label>
        <textarea value={note} onChange={handleNoteChange} />
        <button type="submit">Save Note</button>
      </form>
      <PastVisitNotes patientId={viewingPatientId}/>
    </div>
  );
};

export default Notepad;
