import React from 'react';

const PastVisitNotes = ({ notes }) => {
  return (
    <div>
      <h2>Past Visit Notes</h2>
      {notes.map((note) => (
        <div key={note.id}>
          <p>{note.content}</p>
          <button onClick={() => openModal(note)}>View Full Note</button>
        </div>
      ))}
    </div>
  );
};

export default PastVisitNotes;
