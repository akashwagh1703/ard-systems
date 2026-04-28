import React, { createContext, useContext, useState } from 'react';

const FarmerAuthContext = createContext();

export const useFarmerAuth = () => {
  const ctx = useContext(FarmerAuthContext);
  if (!ctx) throw new Error('useFarmerAuth must be used within FarmerAuthProvider');
  return ctx;
};

export const FarmerAuthProvider = ({ children }) => {
  const [farmer, setFarmer] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('farmerUser')); } catch { return null; }
  });

  const farmerLogin = (data) => {
    sessionStorage.setItem('farmerUser', JSON.stringify(data));
    setFarmer(data);
  };

  const farmerLogout = () => {
    sessionStorage.removeItem('farmerUser');
    setFarmer(null);
  };

  return (
    <FarmerAuthContext.Provider value={{ farmer, farmerLogin, farmerLogout }}>
      {children}
    </FarmerAuthContext.Provider>
  );
};
