import React, { useState } from 'react';

const FacialRecognitionPatientButton = () => {
    const [hoveredButton, setHoveredButton] = useState(false);
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
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <button
                aria-label="Add Face Recognition to this Patient"
                style={buttonStyle}
                onMouseEnter={() => setHoveredButton(true)}
                onMouseLeave={() => setHoveredButton(false)}
            >
                Add Face Recognition to this Patient
            </button>
        </div>
    );
};

export default FacialRecognitionPatientButton;
