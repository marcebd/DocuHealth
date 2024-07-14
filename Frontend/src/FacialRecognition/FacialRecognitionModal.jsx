import React, { useState, useRef } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Webcam from 'react-webcam';

const FacialRecognitionModal = ({ onClose }) => {
    const webcamRef = useRef(null);
    const [imgSrc, setImgSrc] = useState(null);

    const capture = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImgSrc(imageSrc);
    };

    const deleteImage = () => {
        setImgSrc(null); // Clear the captured image
    };

    return (
        <Modal show={true} onHide={onClose} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Stand in front of the camera and look forward</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {!imgSrc && (
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        style={{ width: '100%' }}
                    />
                )}
                {imgSrc && (
                    <div style={{ position: 'relative', textAlign: 'center' }}>
                        <img src={imgSrc} alt="Captured" style={{ width: '100%' }} />
                        <Button
                            variant="danger"
                            style={{ position: 'absolute', top: '10px', right: '10px' }}
                            onClick={deleteImage}
                        >
                            Delete
                        </Button>
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer>
                {!imgSrc && (
                    <Button variant="primary" onClick={capture}>
                        Take Picture
                    </Button>
                )}
                <Button variant="secondary" onClick={onClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default FacialRecognitionModal;
