import React, { useEffect, useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
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
  const userId = JSON.parse(localStorage.getItem("userId"));
  let [userFirstName, setUserFirstName] = useState('');
  let [userProfilePicture, setUserProfilePicture] = useState('');
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
          setUserProfilePicture(data.profile_picture);

          console.log("User Data", data);
        }
      } catch (error) {
        console.error('Error fetching User Data in dashboard:', error);
      }
    }
    fetchData();
  }, [userId]);

  return (
    <div>
      <HelmetProvider>
        <CustomHelmet />
      </HelmetProvider>
      <h1>Hello, {userFirstName }</h1>
      <img src={userId && userProfilePicture ? userProfilePicture : 'default.jpg'} alt="Profile" />
      <button aria-label="Logout from Dashboard">Logout</button>
      <div>
        <PatientTabs />
        <DashboardData />
      </div>
    </div>
  );
}

export default Dashboard;
