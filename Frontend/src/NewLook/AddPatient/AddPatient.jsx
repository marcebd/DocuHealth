
import React, { useState } from 'react';
import FacialRecognitionModal from '../../FacialRecognition/FacialRecognitionModal';
import defaultImage from '../../DocuImage/ProfilePicDefault.jpeg';
import './AddPatient.css'; // Import the CSS file
const AddPatient = ({ onCreate }) => {
    const [patientData, setPatientData] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        idNumber: '',
        email: '',
        birthDate: '',
        gender: ''
    });
    const [showCameraModal, setShowCameraModal] = useState(false);
    const [image, setImage] = useState(defaultImage);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPatientData(prev => ({ ...prev, [name]: value }));
    };
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setImage(reader.result);
            setPatientData(prev => ({ ...prev, imgSrc: reader.result }));
        };
        reader.readAsDataURL(file);
    };
    const onImageCapture = (capturedImage) => {
        setImage(URL.createObjectURL(capturedImage));
        setPatientData(prev => ({ ...prev, imgSrc: capturedImage }));
        setShowCameraModal(false);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            Object.keys(patientData).forEach(key => {
                formData.append(key, patientData[key]);
            });
            if (image instanceof Blob) {
                formData.append('picture', image);
            }
            const response = await fetch('http://localhost:3001/patients', {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) {
                throw new Error('Failed to create patient');
            }
            const responseData = await response.json();
            onCreate(responseData);
        } catch (error) {
            console.error('Failed to create patient:', error);
        }
    };
    return (
        <div className="patient-profile">
            <div className="header">
                <div className="profile-picture-section">
                    {image && (
                        <div className="profile-picture-container">
                            <img src={image} alt="Patient" className="profile-picture" />
                        </div>
                    )}
                    <div className="image-controls">
                        <button type="button" onClick={() => setShowCameraModal(true)}>
                            Take Picture
                        </button>
                        <input type="file" className="input-file" onChange={handleImageChange} />
                    </div>
                </div>
                <div className="name-details">
                    <input type="text" name="firstName" value={patientData.firstName} onChange={handleInputChange} placeholder="First Name" required style={{ width: '50vw' }} />
                    <input type="text" name="middleName" value={patientData.middleName} onChange={handleInputChange} placeholder="Middle Name" style={{ width: '50vw' }} />
                    <input type="text" name="lastName" value={patientData.lastName} onChange={handleInputChange} placeholder="Last Name" required style={{ width: '50vw' }} />
                    <input type="text" name="idNumber" value={patientData.idNumber} onChange={handleInputChange} placeholder="ID Number" required style={{ width: '50vw' }} />
                    <input type="email" name="email" value={patientData.email} onChange={handleInputChange} placeholder="Email" required style={{ width: '50vw' }} />
                    <input type="date" name="birthDate" value={patientData.birthDate} onChange={handleInputChange} placeholder="Birth Date" required style={{ width: '50vw' }} />
                    <select name="gender" value={patientData.gender} onChange={handleInputChange} required style={{ width: '50vw' }}>
                        <option value="">Select Gender</option>
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Nonbinary">Non-binary</option>

                        <option value="DeclineToState">Declined to State</option>
                        <option value="Other">Other</option>
                    </select>
                    </div>
            </div>
            <div>
                <button type="submit" onClick={handleSubmit} className="save-button">Save Patient</button>
            </div>
            {showCameraModal && (
                <FacialRecognitionModal onImageCapture={onImageCapture} onClose={() => setShowCameraModal(false)} />
            )}
        </div>
    );
};
export default AddPatient;
