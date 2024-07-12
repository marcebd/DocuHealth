import React, { useState, useEffect } from 'react';
import NewPatientModal from '../Patient/NewPatientModal';
import Notepad from "./Notepad";
import SearchBar from "./SearchBar";
import Prescriptions from './Prescriptions';

const PatientTabs = ({viewingPatientId}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tabCreated, setTabCreated] = useState(false);
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const storedPatients = JSON.parse(localStorage.getItem('patientTabs'));
    if (storedPatients && storedPatients.length > 0) {
      fetchData(storedPatients);
    }
  }, [isModalOpen]);

  const fetchData = async (patientsIds) => {
    try {
      const response = await fetch(`http://localhost:3001/patients/names`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(patientsIds),
      });
      if (!response.ok) {
        console.error('Failed to fetch patients', response);
      } else {
        const data = await response.json();
        setPatients(prevPatients => {
          const updatedPatients = [...prevPatients, ...data];
          const uniquePatients = updatedPatients.reduce((acc, current) => {
            const x = acc.find(item => item.id === current.id);
            if (!x) {
              return acc.concat([current]);
            } else {
              return acc;
            }
          }, []);
          return uniquePatients;
        });
        handleTabCreate();
      }
    } catch (error) {
      console.error('Error fetching patients', error);
    }
  }

  const handleCreate = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleTabCreate = () => {
    setTabCreated(true);
  };

  const handlePatientClick = (patientId) => {
    localStorage.setItem('viewingPatient', patientId);
  };

  return (
    <div>
      <button onClick={handleCreate}>+</button>
      {isModalOpen && (
        <NewPatientModal onCreate={handleTabCreate} onClose={handleCloseModal} />
      )}
      {tabCreated && patients.map(patient => (
        <div key={patient.id} onClick={() => handlePatientClick(patient.id)}>
          {patient.firstName} {patient.middleName || ''} {patient.lastName}
        </div>
      ))}
      <SearchBar patientId={viewingPatientId}/>
      <Notepad />
      <Prescriptions />
    </div>
  );
};

export default PatientTabs;
