import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useUser } from '../UserContext';
import { useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import Notepad from './Notepad';
import PastVisitNotes from './PastVisitNotes';
import Prescriptions from './Prescriptions';
// Reusable Helmet component for setting head elements
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
  console.log("User information dahsboard", user);
  const navigate = useNavigate();

  // Function to handle logout
  const handleLogout = () => {
    // Implement logout functionality here
    // For example, clearing user context and redirecting
    // setUser(null); // Uncomment if setUser is correctly destructured from useUser
    navigate('/login');
  };

  return (
    <div>
      <HelmetProvider>
        <CustomHelmet />
      </HelmetProvider>
      <h1>Hello, {user ? `${user.profileData.firstName}` : 'Guest'}</h1>
      <img src={user.profileData.profilePicture} />
      <button onClick={handleLogout} aria-label="Logout from Dashboard">Logout</button>
      <div>
        <SearchBar />
        <Notepad />
      </div>
    </div>
  );
}

export default Dashboard;
