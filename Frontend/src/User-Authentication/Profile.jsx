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
                    aria-label="idNumber"
                    className="profile-input"
                />
            </label>
            <h2>Date of Birth</h2>

            <h2>Gender</h2>

            <h2>Language</h2>

            <h2>Location(s)</h2>

            <h2>Education</h2>

            <h2>Tell us more about yourself...</h2>
        </div>
    );
}

export default Profile;
