import React, { useEffect } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useUser } from '../UserContext';
import { useNavigate } from 'react-router-dom';
import PatientTabs from './PatientTabs';
import DashboardData from './DashboardData';

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
  const { user, setUser } = useUser(); // Use setUser to update the user state
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userData');
    navigate('/login');
  };

  useEffect(() => {
    const retrievedUserData = localStorage.getItem('userData');
    if (retrievedUserData) {
      setUser(JSON.parse(retrievedUserData)); // Update the user state with the retrieved data
    }
  }, [setUser]); // Dependency array includes setUser to ensure it's available
  return (
    <div>
      <HelmetProvider>
        <CustomHelmet />
      </HelmetProvider>
      <h1>Hello, {user && user.profileData ? user.profileData.firstName : 'Guest'}</h1>
      <img src={user && user.profileData ? user.profileData.profilePicture : 'default.jpg'} alt="Profile" />
      <button onClick={handleLogout} aria-label="Logout from Dashboard">Logout</button>
      <div>
        <PatientTabs />
        <DashboardData />
      </div>
    </div>
  );
}

export default Dashboard;
