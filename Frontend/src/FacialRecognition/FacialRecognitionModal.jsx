import React, { useState, useRef } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Webcam from 'react-webcam';

const FacialRecognitionModal = ({ onClose, onImageCapture }) => {
    const webcamRef = useRef(null);
    const [imgSrc, setImgSrc] = useState(null);
    const [error, setError] = useState(null);

    const capture = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
            setError("Image Taken Correctly, you can close the screen.");
            setImgSrc(imageSrc);
            convertToBlob(imageSrc);
        } else {
            setError("Error Taking Image, try again.");
        }
    };

    const convertToBlob = (base64Image) => {
        const parts = base64Image.split(';base64,');
        const contentType = parts[0].split(':')[1];
        const raw = window.atob(parts[1]);
        const rawLength = raw.length;
        const uInt8Array = new Uint8Array(rawLength);

        for (let i = 0; i < rawLength; ++i) {
            uInt8Array[i] = raw.charCodeAt(i);
        }

        const blob = new Blob([uInt8Array], { type: contentType });
        const file = new File([blob], "captured-image.jpeg", { type: contentType });
        prepareFormData(file);
    };

    const prepareFormData = (file) => {
        const formData = new FormData();
        formData.append('imgSrc', file);
        onImageCapture(formData);
    };

    const deleteImage = () => {
        setImgSrc(null);
        setError(null);
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
                        <img src={imgSrc} alt="Captured" style={{ width: '100%', height: 'auto' }} />
                        <Button
                            variant="danger"
                            style={{ position: 'absolute', top: '10px', right: '10px' }}
                            onClick={deleteImage}
                        >
                            Delete
                        </Button>
                    </div>
                )}
                {error && <p style={{ color: error === "Image Taken Correctly, you can close the screen." ? 'green' : 'red' }}>{error}</p>}
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
