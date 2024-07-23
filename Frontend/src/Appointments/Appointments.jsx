import React, { useState, useEffect } from 'react';
import Calendar from "./Calendar";
import Scheduler from "./Scheduler";
import TodaysAppointments from './TodaysAppointments';

function Appointments() {
    const [userFirstName, setUserFirstName] = useState('');
    const [userProfilePicture, setUserProfilePicture] = useState('');
    const userId = JSON.parse(localStorage.getItem("userId"));
    useEffect(() => {

        async function fetchUserData() {
            try {
                const response = await fetch(`http://localhost:3000/${userId}/dashboard/name/picture`, {
                    method: 'GET'
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }
                const data = await response.json();
                setUserFirstName(data.first_name);
                const buffer = data.profile_picture.data;
                const base64String = btoa(String.fromCharCode(...new Uint8Array(buffer)));
                setUserProfilePicture(`data:image/jpeg;base64,${base64String}`);
            } catch (error) {
                console.error('Error fetching User Data:', error);
            }
        }
        fetchUserData();
    }, [userId]);

    return (
        <div style={{height: '100vh'}}>
            <div>
            <header style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                height: '80px',
                background: '#f5f5f5',
                padding: '0 20px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img src={userProfilePicture || 'default.jpg'} alt="Profile" style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        marginRight: '20px'
                    }} />
                    <h1>Hello, {userFirstName}</h1>
                </div>
                <button onClick={() => window.location.href = '/dashboard'} style={{
                    padding: '10px 20px',
                    background: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                }}>
                    Back to Dashboard
                </button>
            </header>
            </div>
            <div style={{display:'flex', flexDirection: 'row', marginTop: '1%', maxHeight: '85vh', width:'95%', marginLeft: '2%', marginRight:'2%'}}>
                <Calendar />
                <div style={{display: 'flex', flexDirection: 'column', width: '100%', marginLeft: '2%'}}>
                    <Scheduler patientId={localStorage.getItem('viewingPatient')}/>
                    <TodaysAppointments />
                </div>
            </div>
        </div>
    );
}

export default Appointments;
