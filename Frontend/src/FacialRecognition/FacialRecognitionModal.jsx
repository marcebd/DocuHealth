import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import Webcam from 'react-webcam';

const FacialRecognitionModal = ({ onClose }) => {
    return (
        <Modal show={true} onHide={onClose} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Stand in front of the camera and look forward</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Webcam
                    audio={false}
                    style={{ width: '100%' }}
                />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default FacialRecognitionModal;
