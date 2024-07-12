import React, { useState, useEffect } from 'react';
import NewPatientModal from '../Patient/NewPatientModal';
import Notepad from "./Notepad";
import SearchBar from "./SearchBar";
import Prescriptions from './Prescriptions';

const PatientTabs = ({viewingPatientId}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tabCreated, setTabCreated] = useState(false);
  const [patients, setPatients] = useState([]);
  const [hoveredButton, setHoveredButton] = useState(false);

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
    window.location.reload();
  };

  const tabStyle = (patientId) => ({
    cursor: 'pointer',
    padding: '10px 20px',
    margin: '5px',
    borderRadius: '10px 10px 0 0',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    backgroundColor: patientId.toString() === viewingPatientId.toString() ? 'white' : 'lightgrey',
    flex: 1,
    textAlign: 'center'
  });

  const buttonStyle = {
    cursor: 'pointer',
    padding: '10px 20px',
    margin: '5px',
    borderRadius: '10px 10px 0 0',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    backgroundColor: hoveredButton ? 'lightgrey' : 'transparent',
    border: 'none',
    flex: '0',
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  };

  return (
    <div>
      {isModalOpen && (
        <NewPatientModal onCreate={handleTabCreate} onClose={handleCloseModal} />
      )}
      <div style={{ display: 'flex', margin: '0 10px' }}>
        {tabCreated && patients.map(patient => (
          <div key={patient.id}
               onClick={() => handlePatientClick(patient.id)}
               style={tabStyle(patient.id)}>
            {patient.firstName} {patient.middleName || ''} {patient.lastName}
          </div>
        ))}
        <div
          onClick={handleCreate}
          onMouseEnter={() => setHoveredButton(true)}
          onMouseLeave={() => setHoveredButton(false)}
          style={buttonStyle}
        >
          +
        </div>
      </div>
      <Notepad />
      <Prescriptions />
    </div>
  );
};

export default PatientTabs;
