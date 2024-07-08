import React, { useState } from 'react';

const Notepad = () => {
  const [note, setNote] = useState('');

  const handleNoteChange = (event) => {
    setNote(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle the note submission here
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea value={note} onChange={handleNoteChange} />
      <button type="submit">Save Note</button>
    </form>
  );
};

export default Notepad;
