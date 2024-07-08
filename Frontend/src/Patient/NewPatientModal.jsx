import React, { useState } from 'react';

const NewPatientModal = ({ onHide }) => {
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [prescriptions, setPrescriptions] = useState([]);
  const [conditions, setConditions] = useState([]);

  const handleSave = () => {
    // Save the new patient data here
  };

  return (
    <div>
      <h2>New Patient</h2>
      <form>
        <label>
          First Name:
          <input type="text" value={firstName} onChange={(event) => setFirstName(event.target.value)} />
        </label>
        <label>
          Middle Name:
          <input type="text" value={middleName} onChange={(event) => setMiddleName(event.target.value)} />
        </label>
        <label>
          Last Name:
          <input type="text" value={lastName} onChange={(event) => setLastName(event.target.value)} />
        </label>
        <label>
          ID Number:
          <input type="text" value={idNumber} onChange={(event) => setIdNumber(event.target.value)} />
        </label>
        <label>
          Birth Date:
          <input type="date" value={birthDate} onChange={(event) => setBirthDate(event.target.value)} />
        </label>
        <label>
          Prescriptions:
          <textarea value={prescriptions} onChange={(event) => setPrescriptions(event.target.value)} />
        </label>
        <label>
          Conditions:
          <textarea value={conditions} onChange={(event) => setConditions(event.target.value)} />
        </label>
        <button type="submit" onClick={handleSave}>Save</button>
      </form>
    </div>
  );
};

export default NewPatientModal;
