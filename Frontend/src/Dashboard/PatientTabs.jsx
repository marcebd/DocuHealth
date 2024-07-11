import React, { useState, useEffect } from 'react';
import NewPatientModal from '../Patient/NewPatientModal';
import { useUser } from '../UserContext';

const PatientTabs = () => {
  const { user} = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tabs, setTabs] = useState([]);
  let {tabCreated} = false;
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    if (isModalOpen) {
      const patientsData = user.patients;
      setPatients(patientsData);
    }
  }, [isModalOpen]);

  const handleCreate = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = (onHide) => {
    setIsModalOpen(false);
  };

  const handleTabCreate = () => {
    tabCreated = true;
    const newTabs = patients.map(patient => (
      <div key={patient.id}>
        {patient.firstName} {patient.lastName}
      </div>
    ));
    setTabs(newTabs);
  };
  console.log("User in Patient Tabs", user);

  return (
    <div>
      <button onClick={handleCreate}>+</button>
      {isModalOpen && (
        <NewPatientModal onCreate={handleTabCreate} onClose={handleCloseModal} />
      )}
      {tabCreated && tabs.map((tab, index) => (
        <div key={index}>{tab}</div>
      ))}
    </div>
  );
};

export default PatientTabs;
