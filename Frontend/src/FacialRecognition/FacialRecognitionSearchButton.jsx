import React, { useState } from 'react';
import FacialRecognitionSearchModal from './FacialRecognitionSearchModal';



const FacialRecognitionSearchButton = ({ handlePatientClick }) => {
    const [hoveredButton, setHoveredButton] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleCreate = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };



    const buttonStyle = {
    padding: '10px 20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '40px',
    background: 'transparent',
    border: '1px solid #ccc',
    borderRadius: '5px',
    marginTop: '1%',
    backgroundColor: hoveredButton ? 'lightgrey' : 'white',
    textOverflow: 'ellipsis',
    };

    const modalStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000
    };

    return (
    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        {isModalOpen && (
        <div style={modalStyle}>
            <FacialRecognitionSearchModal onClose={handleCloseModal} handlePatientClick={(handlePatientClick)}/>
        </div>
        )}
        <button
            aria-label="Facial Recognition Search"
            style={buttonStyle}
            onMouseEnter={() => setHoveredButton(true)}
            onMouseLeave={() => setHoveredButton(false)}
            onClick={handleCreate}
            >
            Face
        </button>
    </div>
    );
};

export default FacialRecognitionSearchButton;
