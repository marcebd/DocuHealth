import React, { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import moment from 'moment';
import defaultImage from '../DocuImage/ProfilePicDefault.jpeg';
import FacialRecognitionModal from '../FacialRecognition/FacialRecognitionModal';
import { areObjectsEqual } from '../Utils/utils';
import './EditPatientInformationModal.css'

const EditPatientInformationModal = ({ patientId, setShowModal }) => {
    const [initialPatientData, setInitialPatientData] = useState({});
    const [currentPatientData, setCurrentPatientData] = useState({});
    const [firstName, setFirstName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [lastName, setLastName] = useState('');
    const [idNumber, setIdNumber] = useState('');
    const [email, setEmail] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [picture, setPicture] = useState(defaultImage);
    const [imgSrc, setImgSrc] = useState('');
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [hoveredButtonPicture, setHoveredButtonPicture] = useState(false);
    const [hoveredButtonSubmit, setHoveredButtonSubmit] = useState(false);

    useEffect(() => {
        const fetchPatientInfo = async () => {
            try {
                const response = await fetch(`http://localhost:3001/dashboard/patient/information/${patientId}`, {
                    method: 'GET'
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch patient data');
                }
                let patientInformation = await response.json();
                patientInformation = JSON.parse(patientInformation);
                if(isSubmitting === false){
                    setInitialPatientData(patientInformation);
                }
                setCurrentPatientData(patientInformation);
                setFirstName(patientInformation.firstName || '');
                setMiddleName(patientInformation.middleName || '');
                setLastName(patientInformation.lastName || '');
                setIdNumber(patientInformation.idNumber || '');
                setEmail(patientInformation.email || '');
                setBirthDate(moment(patientInformation.birthDate).format('MM/DD/YYYY') || '');
                if (patientInformation.picture && patientInformation.picture.data) {
                    const buffer = patientInformation.picture.data;
                    const base64String = btoa(String.fromCharCode(...new Uint8Array(buffer)));
                    setPicture(`data:image/jpeg;base64,${base64String}`);
                }else {
                    setPicture(defaultImage);
                }
            } catch (error) {
                console.error(error);
                setError(error.message);
            }
        };
        fetchPatientInfo();
    }, [patientId, isSubmitting]);

    const onImageCapture = (image) => {
        const imageUrl = URL.createObjectURL(image);
        setPicture(imageUrl);
        setImgSrc(image);
    };

    const handleCreate = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        const dataHasNotBeenModified = areObjectsEqual(initialPatientData, currentPatientData);

        if (!dataHasNotBeenModified) {
            setError('This patient information is not up to date. Please refresh your data.');
            setIsSubmitting(false);
            return;
        }

        try {
            const formData = new FormData();
            formData.append('firstName', firstName);
            formData.append('middleName', middleName);
            formData.append('lastName', lastName);
            formData.append('idNumber', idNumber);
            formData.append('email', email);
            formData.append('birthDate', moment(birthDate, 'MM/DD/YYYY').format('YYYY-MM-DD'));
            if (imgSrc instanceof File) {
                formData.append('picture', imgSrc, imgSrc.name);
            }

            const response = await fetch(`http://localhost:3001/patients/${patientId}`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to update patient information');
            }

            setError('Patient Data Updated Correctly');
            setShowModal(false);
            window.location.reload();
        } catch (error) {
            console.error(error);
            setError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };
    const buttonStylePicture = {
        backgroundColor: hoveredButtonPicture ? '#ffcccc' : 'white',
        color: 'black',
        borderColor: '#ccc',
        boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
        transition: 'background-color 0.3s',
        justifyContent: 'center'
    };
    const buttonStyleSubmit = {
        backgroundColor: hoveredButtonPicture ? '#ffcccc' : 'white',
        backgroundColor: hoveredButtonSubmit ? '#ffcccc' : 'white',
        color: 'black',
        borderColor: '#ccc',
        boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
        transition: 'background-color 0.3s'
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
                    <FacialRecognitionModal onClose={handleCloseModal} onImageCapture={onImageCapture} />
                </div>
            )}
            <Modal show={true} onHide={() => setShowModal(false)} style={{width: '100%'}}>
                <Modal.Header closeButton style={{width: '100%'}}>
                    <Modal.Title style={{ flex: 1, textAlign: 'center', padding: '2%' }}>Edit Patient Information</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{width: '100%', height: 'auto'}}>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="firstName">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                        </Form.Group>
                        <Form.Group controlId="middleName">
                            <Form.Label>Middle Name</Form.Label>
                            <Form.Control type="text" value={middleName} onChange={(e) => setMiddleName(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId="lastName">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                        </Form.Group>
                        <Form.Group controlId="idNumber">
                            <Form.Label>ID Number</Form.Label>
                            <Form.Control type="text" value={idNumber} onChange={(e) => setIdNumber(e.target.value)} required />
                        </Form.Group>
                        <Form.Group controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </Form.Group>
                        <Form.Group controlId="birthDate">
                            <Form.Label>Birth Date</Form.Label>
                            <Form.Control type="text" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} required placeholder="MM/DD/YYYY" />
                        </Form.Group>
                        <div style={{display: 'flex', flexDirection:'column'}}>
                        <Form.Group controlId="picture">
                            <Form.Label>Patient Image</Form.Label>
                            <div style={{display: 'flex', flexDirection:'column', alignItems:'center' }}>
                                <div style={{ width: '70%', marginBottom: '10px' }}>
                                    <img src={picture} alt="Patient" style={{ width: '100%', height: 'auto' }} />
                                </div>
                                <Button
                                onClick={handleCreate}
                                style={buttonStylePicture}
                                onMouseEnter={() => setHoveredButtonPicture(true)}
                                onMouseLeave={() => setHoveredButtonPicture(false)}>
                                    {picture === defaultImage ? 'Add Picture' : 'Change Picture'}
                                </Button>
                            </div>
                        </Form.Group>
                        <div style={{display: 'flex', flexDirection:'column', alignItems:'center' }}>
                            <Button variant="primary" type="submit"
                            disabled={isSubmitting}
                            style={buttonStyleSubmit}
                            onMouseEnter={() => setHoveredButtonSubmit(true)}
                            onMouseLeave={() => setHoveredButtonSubmit(false)}>
                                Submit
                            </Button>
                        </div>
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer style={{width: '100%'}}>
                    <Button variant="secondary" onClick={() => setShowModal(false)} >
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};
export default EditPatientInformationModal;
