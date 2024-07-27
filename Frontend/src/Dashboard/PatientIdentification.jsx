import React, { useState, useEffect } from 'react';
import defaultImage from '../DocuImage/ProfilePicDefault.jpeg';

function PatientIdentification () {
    const viewingPatientId = localStorage.getItem('viewingPatient');
    const [firstName, setFirstName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [picture, setPicture] = useState(defaultImage);
    const [idNumber, setIdNumber] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(`http://localhost:3001/dashboard/patient/information/${viewingPatientId}`, {
                    method: 'GET'
                });
                if (!response.ok) {
                    console.error('Failed to fetch patient data in dashboard:', response);
                } else {
                    let patientInformation = await response.json();
                    patientInformation= JSON.parse(patientInformation);
                    setFirstName(patientInformation.firstName);
                    setMiddleName(patientInformation.middleName);
                    setLastName(patientInformation.lastName);
                    setEmail(patientInformation.email);
                    setIdNumber(patientInformation.idNumber);
                    const dateOfBirth = new Date(patientInformation.birthDate);
                    const formattedDate = dateOfBirth.toLocaleDateString();
                    setBirthDate(formattedDate);
                    if (patientInformation.picture && patientInformation.picture.data) {
                        const buffer = patientInformation.picture.data;
                        const base64String = btoa(String.fromCharCode(...new Uint8Array(buffer)));
                        setPicture(`data:image/jpeg;base64,${base64String}`);
                    }
                    setIsLoading(false);
                }
            } catch (error) {
                console.error('Error fetching patient Data in dashboard:', error);
            }
        }
        fetchData();
    }, [viewingPatientId]);

    return (
        <div className="identification-card" style={{display:'flex'}}>
            {firstName !== "" ? (
                <div style={{display: 'flex', flexDirection: 'row', width: 'auto', alignItems: 'center'}}>
                    <div style={{width: '40%'}}>
                        <img src={picture} style={{width: '100%'}} />
                    </div>
                    <div style={{margin: '1%', width: '100%'}}>
                        <h1>{`${firstName} ${middleName ? middleName + ' ' : ''}${lastName}`}</h1>
                        {birthDate !== "" && (
                            <h4>Date of Birth: {birthDate}</h4>
                        )}
                        {idNumber !== "" && (
                            <h4>Personal Identification Number: {idNumber}</h4>
                        )}
                        {email !== "" && (
                            <h4>Email: {email}</h4>
                        )}
                    </div>
                </div>
            ) : (
                <h1>Loading...</h1>
            )}
        </div>
    )
}

export default PatientIdentification;
