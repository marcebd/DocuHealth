import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext({
  user: {
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
    patients: [],
    patientsTabs: []
  },
  setId: (newId) => {
    user.id = newId;
  },
  setEmail: (newEmail) => {
    user.email = newEmail;
  },
  setPassword: (newPassword) => {
    user.password = newPassword;
  },
  setUserData: (newUserData) => {
    user.userData = newUserData;
  },
  setPatients: (newPatients) => {
    user.patients = newPatients;
  },
  setPatientsTabs: (newPatientsTabs) => {
    user.patientsTabs = newPatientsTabs;
  },
  setUser: (newUser) => {
    user = newUser;
  }
});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(UserContext.user);

  // Load user data from local storage when the component mounts
  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      const userData = JSON.parse(storedUserData);
      setUser({ ...userData, patients: [] });
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Export the set functions
export const { user, setId, setEmail, setPassword, setUserData, setPatients, setPatientsTabs, setUser } = UserContext;
export { UserContext };
