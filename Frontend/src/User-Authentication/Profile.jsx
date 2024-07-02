import React, { useState } from 'react';

function Profile() {

    return (
        <div>
            <h1>Create Profile</h1>
            <img src='pic.png'/>
            <div className='name'>
            <h2>Complete Legal Name</h2>
            <label>
                <input
                    type="firstName"
                    name="firstName"
                    placeholder="First Name"
                    aria-label="First Name"
                    className="profile-input"
                />
            </label>
            <label>
                <input
                    type="middleName"
                    name="middleName"
                    placeholder="Middle Name"
                    aria-label="Middle Name"
                    className="profile-input"
                />
            </label>
            <label>
                <input
                    type="lastName"
                    name="lastName"
                    placeholder="Last Name"
                    aria-label="Last Name"
                    className="profile-input"
                />
            </label>
            </div>
            <h2>Specialty</h2>
            <label>
                <input
                    type="specialty"
                    name="specialty"
                    placeholder="Specialty"
                    aria-label="Specialty"
                    className="profile-input"
                />
            </label>
            <h2>ID Number</h2>
            <label>
                <input
                    type="idNumber"
                    name="idNumber"
                    placeholder="ID Number"
                    aria-label="ID Number"
                    className="profile-input"
                />
            </label>
            <h2>Date of Birth</h2>
            <label>
                <input
                    type="dateBirth"
                    name="dateBirth"
                    placeholder="mm/dd/year"
                    aria-label="Date of Birth"
                    className="profile-input"
                />
            </label>
            <h2>Gender</h2>
            <select>
                <option value="">Select an option</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Non-binary">Non-binary</option>
                <option value="DeclineToState">Prefer not to say</option>
                <option value="Other">Other</option>
            </select>
            <h2>Language(s)</h2>
            <label>
                <input
                    type="Language"
                    name="Language"
                    placeholder="Language(s)"
                    aria-label="Language"
                    className="profile-input"
                />
            </label>
            <h2>Location(s)</h2>
            <label>
                <input
                    type="Location"
                    name="Location"
                    placeholder="Location(s)"
                    aria-label="Location"
                    className="profile-input"
                />
            </label>
            <h2>Education</h2>
            <label>
                <input
                    type="Education"
                    name="Education"
                    placeholder="Education"
                    aria-label="Education"
                    className="profile-input"
                />
            </label>
            <h2>Tell us more about yourself...</h2>
            <textarea placeholder="Tell us about yourself..." />
        </div>
    );
}

export default Profile;
