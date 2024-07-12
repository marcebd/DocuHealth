import React, { useState, useEffect } from 'react';

const PastVisitNotes = ({ patientId }) => {
  const [visitNotes, setVisitNotes] = useState([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`http://localhost:3002/visitNotes/${patientId}`, {
          method: 'GET',
        });
        if (!response.ok) {
          console.error('Failed to fetch patients:', response);
        } else {
          const data = await response.json();
          setVisitNotes(data);
        }
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    }
    fetchData();
  }, [patientId]);

  return (
    <div>
      <h2>Past Visit Notes</h2>
      {visitNotes.map((note) => (
        <div key={note.id}>
          <p>{note.date}</p>
          <button onClick={() => openModal(note)}>View Full Note</button>
        </div>
      ))}
    </div>
  );
};

export default PastVisitNotes;
