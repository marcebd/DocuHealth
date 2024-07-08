import React, { useState } from 'react';
import { useUser } from '../UserContext';
import { isMobilePhone } from 'validator';
import { useNavigate } from 'react-router-dom';


function Profile() {
    const { user, setUser } = useUser();
    console.log(user);
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
        profilePicture: ''
    });


    const handleChange = (event) => {
        const { name, type, value, files } = event.target;
        if (type === 'file') {
            setProfileData(prevState => ({
                ...prevState,
                [name]: files[0]
            }));
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

        // Validate the form
        if (!validateForm()) {
            console.error('Validation errors:', errors);
            return;
        }

        // Prepare FormData for submission
        const formData = new FormData();
        Object.keys(profileData).forEach(key => {
            if (key === 'education' || key === 'languages' || key === 'locations') {
                // Stringify array or object data
                formData.append(key, JSON.stringify(profileData[key]));
            } else if (key === 'profilePicture' && profileData[key]) {
                // Append file data
                formData.append(key, profileData[key], profileData[key].name);
            } else {
                // Append other data
                formData.append(key, profileData[key]);
            }
        });

         // Convert BigInt user ID to string and append to FormData
        if (user && user.id) {
            formData.append('userId', user.id.toString()); // Ensure user ID is a string
        }
        user.profileData = profileData;
        // Send the data to the server
        try {
            const response = await fetch('http://localhost:3000/profile', {
                method: 'POST',
                body: formData, // FormData will be sent as multipart/form-data
            });
            const responseData = await response.json();
            console.log(formData.entries);
            if (!response.ok) {
                console.error('Failed to submit profile:', responseData);
            } else {
                navigate('/dashboard'); // Navigate to the profile page
            }
        } catch (error) {
            console.error('Network or other error:', error);
        }
    };

    return (
        <div>
            <h1>Create Profile</h1>
            <form onSubmit={handleSubmit}>
                <div className='name'>
                    <h2>Complete Legal Name</h2>
                    <input type="text" name="firstName" value={profileData.firstName} onChange={handleChange} placeholder="First Name" aria-label="First Name" className="profile-input" />
                    {errors.firstName && <div className="error">{errors.firstName}</div>}
                    <input type="text" name="middleName" value={profileData.middleName} onChange={handleChange} placeholder="Middle Name" aria-label="Middle Name" className="profile-input" />
                    <input type="text" name="lastName" value={profileData.lastName} onChange={handleChange} placeholder="Last Name" aria-label="Last Name" className="profile-input" />
                    {errors.lastName && <div className="error">{errors.lastName}</div>}
                </div>
                <h2>Specialty</h2>
                <input type="text" name="specialty" value={profileData.specialty} onChange={handleChange} placeholder="Specialty" aria-label="Specialty" className="profile-input" />
                {errors.specialty && <div className="error">{errors.specialty}</div>}
                <h2>ID Number</h2>
                <input type="text" name="idNumber" value={profileData.idNumber} onChange={handleChange} placeholder="ID Number" aria-label="ID Number" className="profile-input" />
                {errors.idNumber && <div className="error">{errors.idNumber}</div>}
                <h2>Date of Birth</h2>
                <input type="date" name="dateBirth" value={profileData.dateBirth} onChange={handleChange} placeholder="mm/dd/year" aria-label="Date of Birth" className="profile-input" />
                {errors.dateBirth && <div className="error">{errors.dateBirth}</div>}
                <h2>Gender</h2>
                <select name="gender" value={profileData.gender} onChange={handleChange}>
                    <option value="">Select an option</option>
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Nonbinary">Non-binary</option>
                    <option value="DeclineToState">Prefer not to say</option>
                    <option value="Other">Other</option>
                </select>
                {errors.gender && <div className="error">{errors.gender}</div>}
                <h2>Language(s)</h2>
                {profileData.languages.map((language, index) => (
                    <div key={index}>
                        <input type="text" value={language} onChange={(e) => handleArrayChange('languages', index, e.target.value)} placeholder="Language" aria-label="Language" className="profile-input" />
                        <button type="button" onClick={() => removeArrayItem('languages', index)}>Remove</button>
                        {errors.languages && <div className="error">{errors.languages}</div>}
                    </div>
                ))}
                <button type="button" onClick={() => addArrayItem('languages')}>Add Language</button>
                <h2>Location(s)</h2>
                {profileData.locations.map((location, index) => (
                    <div key={index}>
                        <input type="text" value={location} onChange={(e) => handleArrayChange('locations', index, e.target.value)} placeholder="Location " aria-label="Location" className="profile-input" />
                        <button type="button" onClick={() => removeArrayItem('locations', index)}>Remove</button>
                    </div>
                ))}
                {errors.locations && <div className="error">{errors.locations}</div>}
                <button type="button" onClick={() => addArrayItem('locations')}>Add Location</button>
                <h2>Education</h2>
                {profileData.education.map((edu, index) => (
                    <div key={index}>
                        <input type="text" name="institution" value={edu.institution} onChange={(e) => handleEducationChange(index, e)} placeholder="Institution" aria-label="Institution" className="profile-input" />
                        <input type="text" name="degree" value={edu.degree} onChange={(e) => handleEducationChange(index, e)} placeholder="Degree" aria-label="Degree" className="profile-input" />
                        <input type="text" name="graduation" value={edu.graduation} onChange={(e) => handleEducationChange(index, e)} placeholder="Year of Graduation" aria-label="Year of Graduation" className="profile-input" />
                        <button type="button" onClick={() => removeEducation(index)}>Remove</button>
                        {errors.education && <div className="error">{errors.education}</div>}
                    </div>
                ))}
                <button type="button" onClick={addEducation}>Add More Education</button>
                <h2>Contact Number</h2>
                <input
                    type="text"
                    name="contactNumber"
                    value={profileData.contactNumber}
                    onChange={handleChange}
                    placeholder="Contact Number"
                    aria-label="Contact Number"
                    className="profile-input"
                />
                {errors.contactNumber && <div className="error">{errors.contactNumber}</div>}
                <h2>Biography</h2>
                <textarea
                    name="biography"
                    value={profileData.biography}
                    onChange={handleChange}
                    placeholder="Write something about yourself..."
                    aria-label="Biography"
                    className="profile-input"
                />
                {errors.biography && <div className="error">{errors.biography}</div>}
                <h2>Profile Picture</h2>
                <input
                    type="file"
                    name="profilePicture"
                    onChange={handleChange}
                    aria-label="Profile Picture"
                    className="profile-input"
                />
                <button type="submit">Submit Profile</button>
            </form>
        </div>
    );
}

export default Profile;
