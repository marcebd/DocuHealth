import React, { useState, useRef } from 'react';
import { useUser } from '../UserContext';

const Notepad = () => {
  const [note, setNote] = useState('');
  const [visitDate, setVisitDate] = useState('');
  const { user } = useUser();
  const handleNoteChange = (event) => {
    setNote(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const userId = user.id;

    const patientData = {
      userId,
      note,
      visitDate
    };

    try {
      const response = await fetch('http://localhost:3000/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(patientData)
      });
      const responseData = await response.json();
      if (!response.ok) {
        console.error('Failed to create patient:', responseData);
      } else {
        onCreate(firstName + " " + lastName);
        onHide();
      }
    } catch (error) {
      console.error("Error creating patient:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
          Visit Date:
          <input type="date" value={visitDate} onChange={(event) => setVisitDate(event.target.value)} />
        </label>
      <textarea value={note} onChange={handleNoteChange} />
      <button type="submit">Save Note</button>
    </form>
  );
};

export default Notepad;
