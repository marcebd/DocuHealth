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
    const addEducation = () => {
        setProfileData(prevState => ({
            ...prevState,
            education: [...prevState.education, { institution: '', degree: '', graduation: '' }]
        }));
    };
    const removeEducation = (index) => {
        setProfileData(prevState => ({
            ...prevState,
            education: prevState.education.filter((_, i) => i !== index)
        }));
    };

    const handleArrayChange = (key, index, value) => {
        const updatedArray = profileData[key].map((item, i) => {
            if (i === index) {
                return value;
            }
            return item;
        });
        setProfileData(prevState => ({
            ...prevState,
            [key]: updatedArray
        }));
    };

    const addArrayItem = (key) => {
        setProfileData(prevState => ({
            ...prevState,
            [key]: [...prevState[key], '']
        }));
    };

    const removeArrayItem = (key, index) => {
        setProfileData(prevState => ({
            ...prevState,
            [key]: prevState[key].filter((_, i) => i !== index)
        }));
    };

    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        // Validate required fields
        if (!profileData.firstName) newErrors.firstName = 'First name is required';
        if (!profileData.lastName) newErrors.lastName = 'Last name is required';
        if (!profileData.specialty) newErrors.specialty = 'Specialty is required';
        if (!profileData.idNumber) newErrors.idNumber = 'ID number is required';
        if (!profileData.dateBirth) newErrors.dateBirth = 'Date of birth is required';
        if (!profileData.gender) newErrors.gender = 'Gender is required';
        if (!profileData.contactNumber) newErrors.contactNumber = 'Contact number is required';
        if (!profileData.biography) newErrors.biography = 'Biography is required';

        // Validate arrays
        if (profileData.languages.some(lang => !lang)) newErrors.languages = 'All language fields must be filled';
        if (profileData.locations.some(loc => !loc)) newErrors.locations = 'All location fields must be filled';
        if (profileData.education.some(edu => !edu.institution || !edu.degree || !edu.graduation)) {
            newErrors.education = 'All fields in education must be filled';

        //Validate real phone number
        if(!isMobilePhone(profileData.contactNumber, 'en-US', {allow_international: true})){
            newErrors.contactNumber = 'Invalid phone number';
        }
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
                body: formData,
            });
            const responseData = await response.json();

            if (!response.ok) {
                console.error('Failed to submit profile:', responseData);
            } else {
                navigate('/login');
            }
        } catch (error) {
            console.error('Network or other error:', error);
        }
    };
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'white' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '800px', padding: '30px', borderRadius: '10px', boxShadow: '0 6px 12px rgba(0,0,0,0.1)', backgroundColor: 'white' }}>
                <h1>Create Profile</h1>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
                    <div style={{ width: '48%' }}>
                        <h2>Name</h2>
                        <input type="text" name="firstName" value={profileData.firstName} onChange={handleChange} placeholder="First Name" required style={{ marginBottom: '15px' }} />
                        <input type="text" name="middleName" value={profileData.middleName} onChange={handleChange} placeholder="Middle Name" style={{ marginBottom: '15px' }} />
                        <input type="text" name="lastName" value={profileData.lastName} onChange={handleChange} placeholder="Last Name" required style={{ marginBottom: '15px' }} />
                        <h3>Specialty</h3>
                        <input type="text" name="specialty" value={profileData.specialty} onChange={handleChange} placeholder="Specialty" required style={{ marginBottom: '15px' }} />
                        <h3>Personal Identification Number</h3>
                        <input type="text" name="idNumber" value={profileData.idNumber} onChange={handleChange} placeholder="ID Number" required style={{ marginBottom: '15px' }} />
                        <h3>Birth Date</h3>
                        <input type="date" name="dateBirth" value={profileData.dateBirth} onChange={handleChange} required style={{ marginBottom: '15px' }} />
                        <h3>Gender</h3>
                        <select name="gender" value={profileData.gender} onChange={handleChange} required style={{ marginBottom: '15px' }}>
                            <option value="">Select Gender</option>
                            <option value="Female">Female</option>
                            <option value="Male">Male</option>
                            <option value="Nonbinary">Non-binary</option>
                            <option value="DeclineToState">Prefer not to say</option>
                            <option value="Other">Other</option>
                        </select>
                        <h3>Contact Number</h3>
                        <input type="text" name="contactNumber" value={profileData.contactNumber} onChange={handleChange} placeholder="Contact Number" required style={{ marginBottom: '15px' }} />
                    </div>
                    <div style={{ width: '48%' }}>
                        <h2>Educational Background</h2>
                        {profileData.education.map((edu, index) => (
                            <div key={index} style={{ marginBottom: '15px' }}>
                                <input type="text" name="institution" value={edu.institution} onChange={(e) => handleEducationChange(index, e)} placeholder="Institution" required style={{ marginBottom: '15px' }} />
                                <input type="text" name="degree" value={edu.degree} onChange={(e) => handleEducationChange(index, e)} placeholder="Degree" required style={{ marginBottom: '15px' }} />
                                <input type="text" name="graduation" value={edu.graduation} onChange={(e) => handleEducationChange(index, e)} placeholder="Year of Graduation" required  style={{ marginBottom: '15px' }}/>
                            </div>
                        ))}
                        <button onClick={addEducation} style={{ marginBottom: '15px' }}>Add More Education</button>
                        <h3>Biography</h3>
                        <textarea name="biography" value={profileData.biography} onChange={handleChange} placeholder="Tells us more about yourself..." required style={{ marginBottom: '15px' }} />
                        <h2>Profile Picture</h2>
                        <input type="file" name="profilePicture" onChange={handleChange} style={{ marginBottom: '15px' }} />
                        {profilePicturePreview && <img src={profilePicturePreview} alt="Profile Preview" style={{ width: '100%', height: 'auto', marginTop: '10px' }} />}
                    </div>
                </div>
                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                    <button type="button" onClick={() => navigate('/register')} style={{ padding: '10px 20px', backgroundColor: 'gray', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                        Cancel
                    </button>
                    <button type="submit" onClick={() => navigate('/login')} style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                        Submit Profile
                    </button>
                </div>
            </form>
        </div>
    );
}
export default Profile;
