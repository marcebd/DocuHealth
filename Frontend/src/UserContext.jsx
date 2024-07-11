import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext({
  user: {
    userId: null,
    patientId: null
  },

  setUserId: (newUserId) => {
    user.userId = newUserId;
  },

  setPatientId: (newPatientId) => {
    user.patientId = newPatientId;
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
export const { user, setUserId, setPatientId, setUser } = UserContext;
export { UserContext };
