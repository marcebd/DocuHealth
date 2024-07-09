import React, { useState } from 'react';
import { useUser } from '../UserContext';

const NewPatientModal = ({ onHide, onCreate }) => {
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [prescriptions, setPrescriptions] = useState([{ name: '', dose: '', instructions: '', date: '' }]);
  const [conditions, setConditions] = useState([{ name: '', date: '' }]);
  const { user } = useUser();

  const handleSave = async (event) => {
    event.preventDefault();

    const arePrescriptionsValid = prescriptions.every(p => p.name && p.dose && p.instructions && p.date);
    const areConditionsValid = conditions.every(c => c.name && c.date);

    if (!arePrescriptionsValid || !areConditionsValid) {
      console.error("All fields in prescriptions and conditions must be filled.");
      return;
    }

    const userId = user.id;  
    const patientData = {
      userId,
      firstName,
      middleName,
      lastName,
      idNumber,
      birthDate,
      prescriptions,
      conditions
    };

    console.log("Frontend", patientData);

    try {
      const response = await fetch('http://localhost:3000/patients', {
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

  const handlePrescriptionChange = (index, event) => {
    const newPrescriptions = prescriptions.map((prescription, i) => {
      if (i === index) {
        return { ...prescription, [event.target.name]: event.target.value };
      }
      return prescription;
    });
    setPrescriptions(newPrescriptions);
  };

  const handleConditionChange = (index, event) => {
    const newConditions = conditions.map((condition, i) => {
      if (i === index) {
        return { ...condition, [event.target.name]: event.target.value };
      }
      return condition;
    });
    setConditions(newConditions);
  };

  const addPrescription = () => {
    setPrescriptions([...prescriptions, { name: '', dose: '', instructions: '', date: '' }]);
  };

  const addCondition = () => {
    setConditions([...conditions, { name: '', date: '' }]);
  };

  return (
    <div>
      <h2>New Patient</h2>
      <form onSubmit={handleSave}>
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
        {prescriptions.map((prescription, index) => (
          <div key={index}>
            <h3>Prescription {index + 1}</h3>
            <input type="text" name="name" value={prescription.name} onChange={(e) => handlePrescriptionChange(index, e)} placeholder="Name" />
            <input type="text" name="dose" value={prescription.dose} onChange={(e) => handlePrescriptionChange(index, e)} placeholder="Dose" />
            <input type="text" name="instructions" value={prescription.instructions} onChange={(e) => handlePrescriptionChange(index, e)} placeholder="Instructions" />
            <input type="date" name="date" value={prescription.date} onChange={(e) => handlePrescriptionChange(index, e)} placeholder="Date" />
          </div>
        ))}
        <button type="button" onClick={addPrescription}>Add Another Prescription</button>
        {conditions.map((condition, index) => (
          <div key={index}>
            <h3>Condition {index + 1}</h3>
            <input type="text" name="name" value={condition.name} onChange={(e) => handleConditionChange(index, e)} placeholder="Name" />
            <input type="date" name="date" value={condition.date} onChange={(e) => handleConditionChange(index, e)} placeholder="Date" />
          </div>
        ))}
        <button type="button" onClick={addCondition}>Add Another Condition</button>
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default NewPatientModal;
