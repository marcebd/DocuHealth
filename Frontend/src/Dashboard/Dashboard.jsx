import React, { useEffect, useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import PatientTabs from './PatientTabs';
import ContentLoader from 'react-content-loader';
import { useNavigate } from 'react-router-dom';
import DoctorsHome from '../NewLook/DoctorsHome';

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
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

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
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching User Data in dashboard:', error);
      }
    }
    fetchData();
  }, [userId]);

  const ProfileLoader = () => (
    <ContentLoader
      speed={2}
      width={60}
      height={60}
      viewBox="0 0 60 60"
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
    >
      <circle cx="30" cy="30" r="30" />
    </ContentLoader>
  );

  const NameLoader = () => (
    <ContentLoader
      speed={2}
      width={160}
      height={20}
      viewBox="0 0 160 20"
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
    >
      <rect x="0" y="0" rx="4" ry="4" width="160" height="20" />
    </ContentLoader>
  );

  const handleLogout = async () => {
    try {
      const response = await fetch('`http://localhost:3000/logout', {
        method: 'GET'
      });
      if (!response.ok) {
        console.error('Failed to log out:', response);
      } else {
        localStorage.removeItem('userId');
        localStorage.removeItem('patientTabs');
        localStorage.removeItem('viewingPatient');
        navigate('/');
        window.location.reload();
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

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
          {isLoading ? <ProfileLoader /> : <img src={userProfilePicture || 'default.jpg'} alt="Profile" style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            marginRight: '20px'
          }} />}
          <h1 style={{ margin: '0' }}>{isLoading ? <NameLoader /> : `Hello, ${userFirstName}`}</h1>
        </div>
        <button aria-label="Logout from Dashboard" onClick={handleLogout} style={{
          cursor: 'pointer',
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
        <DoctorsHome />
      </main>
    </div>
  );
}
export default Dashboard;
