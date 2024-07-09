import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext(null);

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: null,
    email: '',
    password: '',
    userData: {
      id: null,
      firstName: '',
      middleName: '',
      lastName: '',
      phoneNumber: '',
      specialty: [],
      idNumber: '',
      dateOfBirth: '',
      gender: '',
      languages: [],
      location: [],
      education: [],
      biography: '',
      profilePicture: null,
      userId: null,
    },
  });

  // Load user data from local storage when the component mounts
  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      setUser(JSON.parse(storedUserData));
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
