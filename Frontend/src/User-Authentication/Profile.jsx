import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Profile() {
    const userId = JSON.parse(localStorage.getItem("userId"));
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        specialty: '',
        idNumber: '',
        dateBirth: '',
        gender: '',
        languages: [''],
        locations: [''],
        contactNumber: '',
        education: [{ institution: '', degree: '', graduation: '' }],
        biography: '',
        profilePicture: null
    });
    const [profilePicturePreview, setProfilePicturePreview] = useState('');
    const [errors, setErrors] = useState({});

    const handleChange = (event) => {
        const { name, type, value, files } = event.target;
        if (type === 'file') {
            setProfileData(prevState => ({
                ...prevState,
                [name]: files[0]
            }));
            setProfilePicturePreview(URL.createObjectURL(files[0]));
        } else {
            setProfileData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const handleArrayChange = (key, index, event) => {
        const newValues = [...profileData[key]];
        newValues[index] = event.target.value;
        setProfileData({ ...profileData, [key]: newValues });
    };

    const addArrayItem = (key) => {
        setProfileData(prevState => ({
            ...prevState,
            [key]: [...prevState[key], '']
        }));
    };

    const removeArrayItem = (key, index) => {
        const newValues = [...profileData[key]];
        newValues.splice(index, 1);
        setProfileData({ ...profileData, [key]: newValues });
    };

    const handleEducationChange = (index, event) => {
        const { name, value } = event.target;
        const updatedEducation = profileData.education.map((edu, i) => {
            if (i === index) {
                return { ...edu, [name]: value };
            }
            return edu;
        });
        setProfileData(prevState => ({
            ...prevState,
            education: updatedEducation
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        // Required fields validation
        ['firstName', 'lastName', 'specialty', 'idNumber', 'dateBirth', 'gender', 'contactNumber', 'biography', 'profilePicture'].forEach(field => {
            if (!profileData[field]) {
                newErrors[field] = `${field} is required`;
            }
        });

        // Arrays validation
        if (profileData.languages.some(lang => !lang)) newErrors.languages = 'All language fields must be filled';
        if (profileData.locations.some(loc => !loc)) newErrors.locations = 'All location fields must be filled';
        if (profileData.education.some(edu => !edu.institution || !edu.degree || !edu.graduation)) {
            newErrors.education = 'All fields in education must be filled';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            console.error('Validation errors:', errors);
            return;
        }

        const formData = new FormData();
        Object.keys(profileData).forEach(key => {
            if (key === 'education' || key === 'languages' || key === 'locations') {
                formData.append(key, JSON.stringify(profileData[key]));
            } else if (key === 'profilePicture' && profileData[key]) {
                formData.append(key, profileData[key], profileData[key].name);
            } else {
                formData.append(key, profileData[key]);
            }
        });
        if (userId) {
            formData.append('userId', userId.toString());
        }

        try {
            const response = await fetch('http://localhost:3000/profile', {
                method: 'POST',
                body:                 formData
            });
            const result = await response.json();
            if (response.ok) {
                navigate('/login');
            } else {
                setErrors('Failed to update profile. Please try again.' );
            }
        } catch (error) {
            setErrors('Network error. Please try again later.');
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
            <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>First Name:<span style={{color: 'red'}}>*</span></label>
                <input type="text" name="firstName" value={profileData.firstName} onChange={handleChange} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
                {errors.firstName && <p className="error" style={{ color: 'red' }}>{errors.firstName}</p>}
            </div>
            <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Middle Name (Optional):</label>
                <input type="text" name="middleName" value={profileData.middleName} onChange={handleChange} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
            </div>
            <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Last Name:<span style={{color: 'red'}}>*</span></label>
                <input type="text" name="lastName" value={profileData.lastName} onChange={handleChange} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
                {errors.lastName && <p className="error" style={{ color: 'red' }}>{errors.lastName}</p>}
            </div>
            <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Specialty:<span style={{color: 'red'}}>*</span></label>
                <input type="text" name="specialty" value={profileData.specialty} onChange={handleChange} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
                {errors.specialty && <p className="error" style={{ color: 'red' }}>{errors.specialty}</p>}
            </div>
            <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>ID Number:<span style={{color: 'red'}}>*</span></label>
                <input type="text" name="idNumber" value={profileData.idNumber} onChange={handleChange} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
                {errors.idNumber && <p className="error" style={{ color: 'red' }}>{errors.idNumber}</p>}
            </div>
            <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Date of Birth:<span style={{color: 'red'}}>*</span></label>
                <input type="date" name="dateBirth" value={profileData.dateBirth} onChange={handleChange} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
                {errors.dateBirth && <p className="error" style={{ color: 'red' }}>{errors.dateBirth}</p>}
            </div>
            <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Gender:<span style={{color: 'red'}}>*</span></label>
                <select name="gender" value={profileData.gender} onChange={handleChange} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Nonbinary">Nonbinary</option>
                <option value="DeclineToState">Decline to state</option>
                <option value="Other">Other</option>
                </select>
                {errors.gender && <p className="error" style={{ color: 'red' }}>{errors.gender}</p>}
            </div>
            <div>
                <label>Languages:<span style={{color: 'red'}}>*</span></label>
                {profileData.languages.map((language, index) => (
                    <div key={index}>
                        <input type="text" value={language} onChange={(e) => handleArrayChange('languages', index, e)} />
                        {index > 0 && (
                            <button type="button" onClick={() => removeArrayItem('languages', index)}>Remove</button>
                        )}
                    </div>
                ))}
                <button type="button" onClick={() => addArrayItem('languages')}>Add Language</button>
                {errors.languages && <p className="error" style={{ color: 'red' }}>{errors.languages}</p>}
            </div>
            <div>
                <label>Locations:<span style={{color: 'red'}}>*</span></label>
                {profileData.locations.map((location, index) => (
                    <div key={index}>
                        <input type="text" value={location} onChange={(e) => handleArrayChange('locations', index, e)} />
                        {index > 0 && (
                            <button type="button" onClick={() => removeArrayItem('locations', index)}>Remove</button>
                        )}
                    </div>
                ))}
                <button type="button" onClick={() => addArrayItem('locations')}>Add Location</button>
                {errors.locations && <p className="error" style={{ color: 'red' }}>{errors.locations}</p>}
            </div>
            <div>
                <label>Contact Number:<span style={{color: 'red'}}>*</span></label>
                <input type="text" name="contactNumber" value={profileData.contactNumber} onChange={handleChange} />
                {errors.contactNumber && <p className="error" style={{ color: 'red' }}>{errors.contactNumber}</p>}
            </div>
            <div>
                <label>Education:<span style={{color: 'red'}}>*</span></label>
                {profileData.education.map((edu, index) => (
                    <div key={index}>
                        <input type="text" name="institution" value={edu.institution} placeholder="Institution" onChange={(e) => handleEducationChange(index, e)} />
                        <input type="text" name="degree" value={edu.degree} placeholder="Degree" onChange={(e) => handleEducationChange(index, e)} />
                        <input type="text" name="graduation" value={edu.graduation}                         placeholder="Graduation Year" onChange={(e) => handleEducationChange(index, e)} />
                        {index > 0 && (
                            <button type="button" onClick={() => removeEducationItem(index)}>Remove</button>
                        )}
                    </div>
                ))}
                <button type="button" onClick={() => addEducationItem()}>Add Education</button>
                {errors.education && <p className="error" style={{ color: 'red' }}>{errors.education}</p>}
                <h5>Biography<span style={{color: 'red'}}>*</span></h5>
                <textarea name="biography" value={profileData.biography} onChange={handleChange} placeholder="Tells us more about yourself..." required style={{ marginBottom: '15px' }} />
                {errors.biography && <p className="error" style={{ color: 'red' }}>{errors.biography}</p>}
                <h5>Profile Picture<span style={{color: 'red'}}>*</span></h5>
                <input type="file" name="profilePicture" onChange={handleChange} style={{ marginBottom: '15px' }} />
                {profilePicturePreview && <img src={profilePicturePreview} alt="Profile Preview" style={{ width: '100%', height: 'auto', marginTop: '10px' }} />}

            </div>
            <div>
                <button type="submit" >Submit Profile</button>
            </div>
        </form>
    );
}

export default Profile;
