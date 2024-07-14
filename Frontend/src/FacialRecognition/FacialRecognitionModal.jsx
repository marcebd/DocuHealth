import React, { useState, useEffect } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import Webcam from 'react-webcam';


const FacialRecognitionModal= (onClose) => {

    return (
        <div>
            <Modal>
                <Modal.Dialog>
                    <Modal.Header>
                        <Modal.Title>
                            Stand infront of the camera and look forward
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <Webcam />
                    </Modal.Body>
                    <Modal.Footer>
                        Close Button
                    </Modal.Footer>
                </Modal.Dialog>
            </Modal>
        </div>
    );
};

export default FacialRecognitionModal;
