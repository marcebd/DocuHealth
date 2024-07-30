import React, { useState, useEffect } from 'react';
import moment from 'moment';
import './PatientProfile.css';
import FacialRecognitionModal from '../../FacialRecognition/FacialRecognitionModal';

const PatientProfile = ({ patient, onUpdate }) => {
    const [patientData, setPatientData] = useState({ ...patient });
    const [isEditing, setIsEditing] = useState(false);
    const [image, setImage] = useState(null);
    const [showCameraModal, setShowCameraModal] = useState(false);
    const [error, setError] = useState('');
    const patientId = patient.id;

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
                setPatientData(patientInformation);
                if (patientInformation.picture && patientInformation.picture.data) {
                    const base64String = btoa(String.fromCharCode(...new Uint8Array(patientInformation.picture.data)));
                    setImage(`data:image/jpeg;base64,${base64String}`);
                }
            } catch (error) {
                console.error(error);
                setError('Failed to load patient data: ' + error.message);
            }
        };

        fetchPatientInfo();
    }, [patientId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPatientData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setImage(reader.result);
            setPatientData(prev => ({ ...prev, picture: { data: reader.result } }));
        };
        reader.readAsDataURL(file);
    };

    const onImageCapture = (capturedImage) => {
        setImage(URL.createObjectURL(capturedImage));
        setPatientData(prev => ({ ...prev, picture: { data: capturedImage } }));
        setShowCameraModal(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsEditing(false);
        onUpdate(patientData);
    };

    const toggleEdit = () => {
        setIsEditing(!isEditing);
    };

    return (
        <div className="patient-profile" style={{ width: '95%' }}>
            <div className="header">
                <div className="profile-picture-section">
                    {image && <img src={image} alt="Patient" className="profile-picture" />}
                    {isEditing && (
                        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '5%'}}>
                                <button type="button" onClick={() => setShowCameraModal(true)}>
                                    Take Picture
                                </button>
                            </div>
                            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                <input type="file" style={{marginBottom:'0', width: '7vw'}} onChange={handleImageChange} />
                            </div>
                        </div>
                    )}
                </div>
                <div className="name-details">
                    {isEditing ? (
                        <>
                            <input type="text" name="firstName" value={patientData.firstName || ''} onChange={handleInputChange} />
                            <input type="text" name="middleName" value={patientData.middleName || ''} onChange={handleInputChange} />
                            <input type="text" name="lastName" value={patientData.lastName || ''} onChange={handleInputChange} />
                        </>
                    ) : (
                        <>
                            <h1>{patientData.firstName}</h1>
                            <h2>{patientData.middleName}</h2>
                            <h3>{patientData.lastName}</h3>
                        </>
                    )}
                </div>
            </div>
            <form  style={{ width: '95%' }}>
                <div className="additional-info" >
                    <div className="form-group">
                        <label className="form-label">ID Number:</label>
                        <input type="text" name="idNumber" value={patientData.idNumber || ''} onChange={handleInputChange} disabled={!isEditing} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Email:</label>
                        <input type="email" name="email" value={patientData.email || ''} onChange={handleInputChange} disabled={!isEditing} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Birth Date:</label>
                        <input type="date" name="birthDate" value={moment(patientData.birthDate).format('YYYY-MM-DD')} onChange={handleInputChange} disabled={!isEditing} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Gender:</label>
                        <select name="gender" value={patientData.gender || ''} onChange={handleInputChange} disabled={!isEditing}>
                            <option value="">Select Gender</option>
                            <option value="Female">Female</option>
                            <option value="Male">Male</option>
                            <option value="Nonbinary">Non-binary</option>
                            <option value="DeclineToState">Declined to State</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>
                </form>
                <div  style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    {isEditing ? (
                        <button type="submit" onClick={handleSubmit} className="save-button">Save Changes</button>
                    ) : (
                        <button type="button" onClick={toggleEdit} className="edit-button">Edit Profile</button>
                    )}
                </div>

            {showCameraModal && (
                <FacialRecognitionModal onImageCapture={onImageCapture} onClose={() => setShowCameraModal(false)} />
            )}
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default PatientProfile;
