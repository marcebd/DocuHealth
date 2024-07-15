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
        setImgSrc(imageSrc);
        setError("Image Taken Correctly, you can close the screen.");
        const block = imageSrc.split(";");
        const contentType = block[0].split(":")[1];
        const realData = block[1].split(",")[1];
        const blob = b64toBlob(realData, contentType);
        const file = new File([blob], 'captured-image.jpeg', { type: contentType });
        onImageCapture(file);
    } else {
        setError("Error Taking Image, try again.");
    }
    };

    const deleteImage = () => {
    setImgSrc(null);
    setError(null);
    };

    function b64toBlob(b64Data, contentType = '', sliceSize = 512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, {type: contentType});
    }

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
        {error && <p style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '24px', color: error === "Image Taken Correctly, you can close the screen." ? 'green' : 'red' }}>{error}</p>}
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
