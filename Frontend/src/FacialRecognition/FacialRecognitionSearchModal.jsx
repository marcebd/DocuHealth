import React, { useState, useRef, useEffect } from 'react';
import { Modal, Button, Table } from 'react-bootstrap';
import Webcam from 'react-webcam';

const FacialRecognitionSearchModal = ({ onClose }) => {
    const userId = JSON.parse(localStorage.getItem("userId"));
    const webcamRef = useRef(null);
    const [imgSrc, setImgSrc] = useState(null);
    const [error, setError] = useState(null);
    const [matches, setMatches] = useState([]);

    const capture = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
            setImgSrc(imageSrc);
            setError("Image Taken Correctly.");
        } else {
            setError("Error Taking Image, try again.");
        }
    };

    const deleteImage = () => {
        setImgSrc(null);
        setError(null);
        setMatches([]);
    };

    const handleImageProcessing = async () => {
        try {
            // Create a collection
            await fetch('http://localhost:3003/create-collection', { method: 'POST' });
            // Index all patient images for a specific userID
            await fetch(`http://localhost:3003/index-patient-images/${userId}`, { method: 'POST' });
            // Search for a patient by image
            const response = await fetch('http://localhost:3003/search-patient-by-image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ imageBytes: imgSrc.split(',')[1] })
            });
            const data = await response.json();
            setMatches(data.patient ? [data.patient] : []);
            setError("Image processed correctly.");
        } catch (error) {
            setError("Failed to process image.");
            console.error("Error processing image:", error);
        }
    };

    useEffect(() => {
        if (imgSrc) {
            handleImageProcessing();
        }
    }, [imgSrc]);

    return (
        <Modal show={true} onHide={onClose} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Stand in front of the camera and look forward</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div style={{ display: 'flex' }}>
                    <div style={{ flex: 1 }}>
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
                    </div>
                    {matches.length > 0 && (
                        <Table striped bordered hover size="sm" style={{ flex: 1 }}>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Image</th>
                                </tr>
                            </thead>
                            <tbody>
                                {matches.map(match => (
                                    <tr key={match.id}>
                                        <td>{match.id}</td>
                                        <td>{match.name}</td>
                                        <td><img src={match.image} alt="Match" style={{ width: '50px', height: '50px' }} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
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

export default FacialRecognitionSearchModal;
