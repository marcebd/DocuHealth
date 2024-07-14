import React, { useState } from 'react';
import FacialRecognitionModal from './FacialRecognitionModal';

const FacialRecognitionPatientButton = ({ onImageCapture }) => {
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
    width: 'auto',
    height: '40px',
    background: 'transparent',
    border: '1px solid #ccc',
    borderRadius: '5px',
    marginTop: '1%',
    backgroundColor: hoveredButton ? 'lightgrey' : 'white',
    textOverflow: 'ellipsis'
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
            <FacialRecognitionModal onClose={handleCloseModal} onImageCapture={(imgSrc) => {
            onImageCapture(imgSrc);
            }} />
        </div>
        )}
        <button
        aria-label="Add Face Recognition to this Patient"
        style={buttonStyle}
        onMouseEnter={() => setHoveredButton(true)}
        onMouseLeave={() => setHoveredButton(false)}
        onClick={handleCreate}
        >
        Add Face Recognition to this Patient
        </button>
    </div>
    );
};

export default FacialRecognitionPatientButton;
