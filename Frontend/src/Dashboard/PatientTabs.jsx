import React, { useState, useEffect } from 'react';
import NewPatientModal from '../Patient/NewPatientModal';
import { useUser } from '../UserContext';

const PatientTabs = () => {
  const { user} = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tabs, setTabs] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
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

  const handleTabCreate = (name) => {
    setTabs([...tabs, name]);
  };

  const handlePatientClick = (patient) => {
    setSelectedPatient(patient);
    setTabs([...tabs, patient.firstName + " " + patient.middleName + " " + patient.lastName]);
  };

  return (
    <div>
      <button onClick={handleCreate}>+</button>
      {isModalOpen && (
        <NewPatientModal onCreate={handleTabCreate} onClose={handleCloseModal} />
      )}
      {tabs.map((tab, index) => (
        <div key={index}>{tab}</div>
      ))}
    </div>
  );
};

export default PatientTabs;
