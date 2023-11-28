
import { createContext, useContext, useEffect, useState } from 'react';

const UserContext = createContext();

export function useUserContext() {
  return useContext(UserContext);
}

export function UserProvider({ children }) {
   const [currUserDetails,setCurrUserDetails]=useState(null);
    
    
  return (
    <UserContext.Provider value={{currUserDetails,setCurrUserDetails}}>
      {children}
    </UserContext.Provider>
  );
}
