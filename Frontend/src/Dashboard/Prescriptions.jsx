import React, { useState, useEffect } from 'react';
import './AddNewPrescriptionButton.css'
import PastPrescriptions from './PastPrescriptions';
import AddNewPrescriptionButton from './AddNewPrescriptionButton';
const Prescriptions = () => {
  const [viewingPatientId] = useState(localStorage.getItem('viewingPatient'));
  return (
    <div id='prescriptions' style={{ width: '100%', height: '50%' }}>
      <h1>Prescriptions</h1>
      <PastPrescriptions patientId={viewingPatientId} />
      <div style={{ display: 'flex', justifyContent: 'center' }}>
          <AddNewPrescriptionButton className="addPrescription"/>
      </div>
    </div>
  );
};

export default Prescriptions;
