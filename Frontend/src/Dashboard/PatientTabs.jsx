import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NewPatientModal from '../Patient/NewPatientModal';
import Notepad from "./Notepad";
import PatientDetails from './PatientDetails';
import AddNewPrescriptionButton from './AddNewPrescriptionButton';
import './AddNewPrescriptionButton.css';
import ContentLoader from 'react-content-loader';
import DashboardHome from './DashboardHome/DashboardHome';
import PatientIdentification from './PatientIdentification';
import EditPatientInformationButton from './EditPatientInformationButton';
import VisitInfoGeneral from './VisitInfoGeneral';
import DoctorsHome from './NewLook/DoctorsHome';

const PatientTabs = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewingPatientId, setViewingPatientId] = useState(null);
  const navigate = useNavigate();
  const [hoveredButton, setHoveredButton] = useState(false);

  useEffect(() => {
    const storedPatients = JSON.parse(localStorage.getItem('patientTabs'));
    const storedViewingPatient = localStorage.getItem('viewingPatient');
    if (storedPatients && storedPatients.length > 0) {
      fetchData(storedPatients);
      setViewingPatientId(storedViewingPatient);
    } else {
      setIsLoading(false);
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
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error fetching patients', error);
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handlePatientClick = (patientId) => {
    if (patientId !== viewingPatientId) {
      setViewingPatientId(patientId);
      localStorage.setItem('viewingPatient', patientId);
    }
  };

  const handleRemovePatient = (patientId) => {
    const updatedPatients = patients.filter(patient => patient.id !== patientId);
    setPatients(updatedPatients);
    localStorage.setItem('patientTabs', JSON.stringify(updatedPatients.map(patient => patient.id)));
    if (patientId === viewingPatientId) {
        const index = patients.findIndex(patient => patient.id === patientId);
        const newViewingPatientId = (index > 0) ? patients[index - 1].id : (updatedPatients.length > 0 ? updatedPatients[0].id : null);
        setViewingPatientId(newViewingPatientId);
        localStorage.setItem('viewingPatient', newViewingPatientId);
    }
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
    boxShadow: patientId.toString() === viewingPatientId ? '0 4px 0 0 white inset, 0 2px 5px rgba(0, 0, 0, 0.3)' : 'none',
    backgroundColor: patientId.toString() === viewingPatientId ? 'white' : `hsl(${index * 137}, 70%, 85%)`,
    flex: '0 1 auto',
    textAlign: 'center',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    minWidth: '100px',
    maxWidth: '150px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  });

  const buttonStyle = {
    cursor: hoveredButton,
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

  const PatientTabLoader = () => (
    <ContentLoader
      speed={2}
      width={150}
      height={40}
      viewBox="0 0 150 40"
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
    >
      <rect x="0" y="0" rx="10" ry="10" width="150" height="40" />
    </ContentLoader>
  );

  return (
    <div>
      {isModalOpen && (
        <NewPatientModal onCreate={handleCloseModal} onClose={handleCloseModal} />
      )}
      <div style={tabContainerStyle}>
        {isLoading ? (
          Array.from({ length: 5 }, (_, index) => <PatientTabLoader key={index} />)
        ) : (
          patients.map((patient, index) => (
            <div key={patient.id} style={tabStyle(patient.id, index)}>
              <span onClick={() => handlePatientClick(patient.id)} style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                {patient.firstName} {patient.middleName || ''} {patient.lastName}
              </span>
              <button
                onClick={() => handleRemovePatient(patient.id)}
                style={{
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  padding: '0',
                  margin: '0',
                  width: '16px',
                  height: '16px',
                  lineHeight: '16px',
                  textAlign: 'center',
                  fontSize: '14px',
                  display: 'inline-block',
                  color: 'inherit'
                }}
              >
                X
              </button>
            </div>
          ))
        )}
        <div
          onClick={handleCreate}
          onMouseEnter={() => setHoveredButton(true)}
          onMouseLeave={() => setHoveredButton(false)}
          style={buttonStyle}
        >
          +
        </div>
      </div>
      {viewingPatientId === null ? (
        <DoctorsHome />
      ) : (
        <div id='patientFolder' style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-evenly',
          alignItems: 'flex-start',
          border: '1px solid lightgrey',
          borderRadius: '10px',
          padding: '2%',
          background: 'white',
          marginTop: '-4px',
          height: '150vh',
        }}>
          <div style={{display:'flex', alignItems:'center', justifyContent: 'center', padding: '1%', width:'100%'}}>
            <div style={{width: '50%', display:'flex'}}>
              <PatientIdentification />
            </div>
          </div>
          <div style={{display:'flex', flexDirection: 'row', padding:'2%'}}>
              <button onClick={() => navigate('/appointments')} className="addPrescriptionFolder">
                Schedule Appointment
              </button>
              <AddNewPrescriptionButton className="addPrescriptionFolder"/>
              <EditPatientInformationButton className="addPrescriptionFolder" />
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
            width:'100%',
            height: '150vh'
          }}>
            <div style={{width: '50%'}}>
            <VisitInfoGeneral/>
            </div>
            <div style={{width: '50%'}}>
            <PatientDetails />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientTabs;
