import React, { useState, useEffect } from 'react';
import defaultImage from '../DocuImage/ProfilePicDefault.jpeg';

function PatientIdentification() {
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
                    patientInformation = JSON.parse(patientInformation);
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
                    else{
                        setPicture(defaultImage);
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
        <div className="identification-card" style={{ display: 'flex', backgroundColor: '#f2f2f2', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
            {firstName !== "" ? (
                <div style={{ display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'center' }}>
                    <div style={{ width: '30%', padding: '10px' }}>
                        <img src={picture} alt="Patient" style={{ width: '100%', height: 'auto', borderRadius: '10px' }} />
                    </div>
                    <div style={{ margin: '1%', width: '70%' }}>
                        <h1 style={{ color: 'black', fontSize: '24px', fontWeight: 'bold' }}>{`${firstName} ${middleName ? middleName + ' ' : ''}${lastName}`}</h1>
                        {birthDate !== "" && (
                            <h4 style={{ color: 'black', fontSize: '18px' }}>Date of Birth: {birthDate}</h4>
                        )}
                        {idNumber !== "" && (
                            <h4 style={{ color: 'black', fontSize: '18px' }}>Personal Identification Number: {idNumber}</h4>
                        )}
                        {email !== "" && (
                            <h4 style={{ color: 'black', fontSize: '18px' }}>Email: {email}</h4>
                        )}
                    </div>
                </div>
            ) : (
                <h1 style={{ color: '#e74c3c' }}>Loading...</h1>
            )}
        </div>
    )
}

export default PatientIdentification;
