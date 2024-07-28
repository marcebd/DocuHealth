import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import EditPatientInformationModal from './EditPatientInformationModal';

const EditPatientInformationButton = ({ styles, className }) => {
    const [viewingPatientId, setViewingPatientId] = useState(localStorage.getItem('viewingPatient'));
    const [showModal, setShowModal] = useState(false);
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
    const intervalId = setInterval(() => {
        const currentPatientId = localStorage.getItem('viewingPatient');
        if (currentPatientId !== viewingPatientId) {
        setViewingPatientId(currentPatientId);
        }
    }, 1000);

    return () => clearInterval(intervalId);
    }, [viewingPatientId]);

    return (
    <div style={{width: 'auto', height: 'auto', display:'flex', alignItems:'center'}}>
        <Button onClick={() => setShowModal(true)} style={{fontWeight:'bold'}} className={className} stye={styles}>
            Edit Patient Profile
        </Button>
        {showModal && (
        <div>
            <EditPatientInformationModal
            isHovering={isHovering}
            setIsHovering={setIsHovering}
            setShowModal={setShowModal}
            patientId={viewingPatientId}
            />
        </div>
        )}
    </div>
    );
};

export default EditPatientInformationButton;
