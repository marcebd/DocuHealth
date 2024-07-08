import React, { useState } from 'react';
import NewPatientModal from '../Patient/NewPatientModal';

const PatientTabs = () => {
    const [showModal, setShowModal] = useState(false);
  const [tabs, setTabs] = useState([]);

  const handleCreate = () => {
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleTabCreate = (name) => {
    setTabs([...tabs, name]);
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
    </div>
  );
};

  export default PatientTabs;
