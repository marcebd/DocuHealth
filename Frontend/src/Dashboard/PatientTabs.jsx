import React, { useState, useEffect } from 'react';
import NewPatientModal from '../Patient/NewPatientModal';
import { useUser } from '../UserContext';

const PatientTabs = () => {
  const { user} = useUser();
  const [showModal, setShowModal] = useState(false);
  const [tabs, setTabs] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    if (showModal) {
      // Fetch patients data here
      const patientsData = user.patients;
      setPatients(patientsData);
    }
  }, [showModal]);

  const handleCreate = () => {
    setShowModal(true);
  };

  const handleClose = (onHide) => {
    onHide();
  };

  const handleTabCreate = (name) => {
    setTabs([...tabs, name]);
  };

  const handlePatientClick = (patient) => {
    setSelectedPatient(patient);
    setTabs([...tabs, patient.firstName]);
  };

  return (
    <div>
      <button onClick={handleCreate}>+</button>
      {showModal && (
        <NewPatientModal onHide={handleClose} onCreate={handleTabCreate} />
      )}
      {tabs.map((tab, index) => (
        <div key={index}>{tab}</div>
      ))}
      {patients.length > 0 && (
        <div>
          {patients.map((patient, index) => (
            <div key={index}>
              <a href="#" onClick={() => handlePatientClick(patient)}>
                {patient.firstName}
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientTabs;
