import React from 'react';

const Prescriptions = ({ prescriptions, onAddNewMedication }) => {
  return (
    <div>
      <h2>Prescriptions</h2>
      {prescriptions.map((prescription) => (
        <div key={prescription.id}>
          <p>{prescription.medicineName} - {prescription.dose}</p>
        </div>
      ))}
      <button onClick={onAddNewMedication}>Add New Medication</button>
    </div>
  );
};

export default Prescriptions;
