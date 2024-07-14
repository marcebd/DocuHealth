import React, { useState, useEffect } from 'react';
import NewPatientModal from '../Patient/NewPatientModal';
import Notepad from "./Notepad";
import Prescriptions from './Prescriptions';

const PatientTabs = ({ viewingPatientId }) => {
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

  const tabContainerStyle = {
    display: 'flex',
    overflowX: 'auto',
    flexWrap: 'nowrap',
    margin: '0',
    padding: '0',
    width: '100%',
    maxWidth: '100vw',
  };

  const tabStyle = (patientId, index) => ({
    cursor: 'pointer',
    padding: '10px 20px',
    marginRight: '5px',
    marginLeft: '5px',
    borderRadius: '10px 10px 0 0',
    boxShadow: patientId.toString() === viewingPatientId.toString() ? '0 4px 0 0 white inset, 0 2px 5px rgba(0, 0, 0, 0.3)' : 'none',
    backgroundColor: patientId.toString() === viewingPatientId.toString() ? 'white' : generateLightColor(index),
    flex: '0 1 auto',
    textAlign: 'center',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    minWidth: '120px'
  });

  const buttonStyle = {
    cursor: 'pointer',
    padding: '10px 10px',
    marginRight: '5px',
    marginLeft: '5px',
    borderRadius: '10px 10px 10px 10px',
    backgroundColor: hoveredButton ? 'lightgrey' : 'transparent',
    border: 'none',
    flex: '0',
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  };

  const generateLightColor = (index) => {
    const hue = index * 137;
    return `hsl(${hue}, 70%, 85%)`;
  };

  return (
    <div>
      {isModalOpen && (
        <NewPatientModal onCreate={handleTabCreate} onClose={handleCloseModal} />
      )}
      <div style={tabContainerStyle}>
        {tabCreated && patients.map((patient, index) => (
          <div key={patient.id}
               onClick={() => handlePatientClick(patient.id)}
               style={tabStyle(patient.id, index)}>
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
      <div id='notesPrescriptions' style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          alignItems: 'flex-start',
          border: '1px solid lightgrey',
          borderRadius: '10px',
          padding: '2%',
          background: 'white',
          marginTop: '-4px',
          height: '150vh'
      }}>
          <Notepad />
          <Prescriptions />
      </div>
    </div>
  );
};
export default PatientTabs;
