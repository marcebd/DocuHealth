import React, { useState, useRef, useEffect } from 'react';
import { Modal, Button, Table } from 'react-bootstrap';
import Webcam from 'react-webcam';

const FacialRecognitionSearchModal = ({ onClose, handlePatientClick }) => {
    const userId = JSON.parse(localStorage.getItem("userId"));
    const webcamRef = useRef(null);
    const [imgSrc, setImgSrc] = useState(null);
    const [error, setError] = useState(null);
    const [matches, setMatches] = useState([]);

    const capture = async () => {
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
            setError("Image Taken Correctly.");
            setImgSrc(imageSrc);
            await createCollectionAndSearch(imageSrc);
        } else {
            setError("Error Taking Image, try again.");
        }
    };

    function bufferToBase64(buffer) {
        let binary = '';
        const bytes = [].slice.call(new Uint8Array(buffer.data));
        bytes.forEach((b) => binary += String.fromCharCode(b));
        return window.btoa(binary);
    }

    const createCollectionAndSearch = async (imageSrc) => {
        try {
            const blob = await fetch(imageSrc).then(res => res.blob());
            const file = new File([blob], "captured-image.jpeg", { type: 'image/jpeg' });
            const formData = new FormData();
            formData.append('imgSrc', file);

            const indexResponse = await fetch(`http://localhost:3003/index-patient-images/${userId}`, {
                method: 'POST',
                body: formData
            });
            if (!indexResponse.ok) {
                const errorText = await indexResponse.text();
                throw new Error(`Failed to index patient images: ${indexResponse.status} ${errorText}`);
            }

            const searchResponse = await fetch('http://localhost:3003/search-patient-by-image', {
                method: 'POST',
                body: formData
            });
            if (!searchResponse.ok) {
                const errorText = await searchResponse.text();
                const errorJson = JSON.parse(errorText);
                let formattedError = "An error occurred during the search.";
                if (errorJson.message && errorJson.error) {
                    formattedError = `${errorJson.message}: ${errorJson.error}`;
                } else if (errorJson.message) {
                    formattedError = `${errorJson.message}`;
                } else if (errorJson.error) {
                    formattedError = `${errorJson.error}`;
                }
                throw new Error(formattedError);
                }

            const response = await searchResponse.json();
            if (response.patient) {
                const formattedPatient = {
                    ...response.patient,
                    picture: `data:image/jpeg;base64,${bufferToBase64(response.patient.picture)}`
                };
                setMatches([formattedPatient]);
            }
        } catch (error) {
            setError(error.message);
        }
    };

    const deleteImage = () => {
        setImgSrc(null);
        setError(null);
        setMatches([]);
    };

    return (
        <Modal show={true} onHide={onClose} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Patient: Stand in front of the camera and look forward</Modal.Title>
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
                </div>
                {error && <p style={{ color: error === "Image Taken Correctly." ? 'green' : 'red' }}>{error}</p>}
                    {matches.length > 0 && (
                    <Table striped bordered hover size="sm">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Image</th>
                            </tr>
                        </thead>
                        <tbody>
                            {matches.map(match => (
                                <tr key={match.id} onClick={() => handlePatientClick(match)}>
                                    <td>{match.id}</td>
                                    <td>{match.firstName} {match.middleName} {match.lastName}</td>
                                    <td>
                                        <img src={match.picture} alt="Match" style={{ width: '50px', height: '50px' }} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
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
export default FacialRecognitionSearchModal;
