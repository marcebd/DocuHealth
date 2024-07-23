import React, { useEffect, useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import PatientTabs from './PatientTabs';

const CustomHelmet = () => (
  <Helmet>
    <meta charSet="UTF-8" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/skeleton/2.0.4/skeleton.css" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
    <title>Dashboard</title>
  </Helmet>
);

function Dashboard() {
  const userId = JSON.parse(localStorage.getItem("userId"));
  let [userFirstName, setUserFirstName] = useState('');
  let [userProfilePicture, setUserProfilePicture] = useState('');
  const [viewingPatientId] = useState(localStorage.getItem('viewingPatient'));


  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`http://localhost:3000/${userId}/dashboard/name/picture`, {
          method: 'GET'
        });
        if (!response.ok) {
          console.error('Failed to fetch user data in dashboard:', response);
        } else {
          const data = await response.json();
          setUserFirstName(data.first_name);
          const buffer = data.profile_picture.data;
          const base64String = btoa(String.fromCharCode(...new Uint8Array(buffer)));
          setUserProfilePicture(`data:image/jpeg;base64,${base64String}`);
        }
      } catch (error) {
        console.error('Error fetching User Data in dashboard:', error);
      }
    }
    fetchData();
  }, [userId]);

  return (
    <div id="wholePage">
      <HelmetProvider>
        <CustomHelmet />
      </HelmetProvider>
      <header id='header' style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100vw',
        height: '80px',
        background: 'white',
        padding: '0 20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src={userProfilePicture || 'default.jpg'} alt="Profile" style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            marginRight: '20px'
          }} />
          <h1 style={{ margin: '0' }}>Hello, {userFirstName}</h1>
        </div>
        <button aria-label="Logout from Dashboard" style={{
          padding: '10px 20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: 'auto',
          height: '40px',
          background: 'transparent',
          border: '1px solid #ccc',
          borderRadius: '5px',
          marginTop: '1%'
        }}>Logout</button>
      </header>
      <main style={{ paddingTop: '2%', marginTop: '80px' }}>
        <PatientTabs viewingPatientId={viewingPatientId} />
      </main>
    </div>
  );
}

export default Dashboard;
