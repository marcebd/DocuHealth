import React, { useState, useEffect } from 'react';
import ContentLoader from 'react-content-loader';

const Notepad = () => {
  const [viewingPatientId, setViewingPatientId] = useState(localStorage.getItem('viewingPatient'));
  const [note, setNote] = useState(
`Weight:
Temperature:
Heart Rate:
Blood Oxygen:
Blood Pressure:

Laboratory Data:

Imaging Results:

Patient's Reason For Visit:

Observations:

Assessment:

Plan: `);
  const [visitDate, setVisitDate] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentPatientId = localStorage.getItem('viewingPatient');
      if (currentPatientId !== viewingPatientId) {
        setViewingPatientId(currentPatientId);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [viewingPatientId]);

  useEffect(() => {
    const currentDate = new Date();
    setVisitDate(currentDate.toISOString().split('T')[0]);
    setIsLoading(false);
  }, []);

  const handleNoteChange = (event) => {
    setNote(event.target.value);
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!note.trim() || !visitDate.trim()) {
      setError('Both the visit date and note content are required.');
      return;
    }

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
        setError('Failed to save the note. Please try again.');
        return;
      }
      setNote('');
      setVisitDate('');
      window.location.reload();
    } catch (error) {
      console.error("Error creating note:", error);
      setError('An error occurred while saving the note.');
    }
  };

  const NoteLoader = () => (
    <ContentLoader
      speed={2}
      width={400}
      height={400}
      viewBox="0 0 400 400"
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
    >
      <rect x="0" y="0" rx="3" ry="3" width="400" height="20" />
      <rect x="0" y="30" rx="3" ry="3" width="380" height="350" />
    </ContentLoader>
  );

  return (
    <div id='notes' style={{ width: '100%' }}>
      <h1>Today's Visit Note:</h1>
      {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
      {isLoading ? (
        <NoteLoader />
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <label style={{ alignSelf: 'flex-start', width: '100%' }}>
            <span style={{ fontSize: '1.2em' }}>Visit Date:</span>
            <input type="date" value={visitDate} onChange={(event) => { setVisitDate(event.target.value); setError(''); }} style={{ marginLeft: '10px' }} />
          </label>
          <textarea value={note} onChange={handleNoteChange} style={{ width: '95%', height: '60vh', marginTop: '10px' }}  />
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
            <button type="submit" style={{fontWeight:'bold'}} >Save Note</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Notepad;
