import React, { useEffect, useState } from 'react';
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
  const { user } = useUser();
  const {userData, setUserData} = useState('');
  const navigate = useNavigate();

  return (
    <div>
      <HelmetProvider>
        <CustomHelmet />
      </HelmetProvider>
      <h1>Hello, {user && user.profileData ? user.profileData.firstName : 'Guest'}</h1>
      <img src={user && user.profileData ? user.profileData.profilePicture : 'default.jpg'} alt="Profile" />
      <button aria-label="Logout from Dashboard">Logout</button>
      <div>
        <PatientTabs />
        <DashboardData />
      </div>
    </div>
  );
}

export default Dashboard;
