
import { createContext, useContext, useState } from 'react';
const ContactsContext = createContext();

export function useContacts() {
  return useContext(ContactsContext);
}

export function ContactsProvider({ children }) {
  
    const [contacts,setContacts]=useState([]);
    const updatecontacts=(c)=>{
   
      const sortedContacts = c.sort((a, b) => {
        const createdAtA = a.recentMessage ? a.recentMessage.createdAt : 0;
        const createdAtB = b.recentMessage ? b.recentMessage.createdAt : 0;
        const t1=new Date(createdAtA).getTime();
        const t2=new Date(createdAtB).getTime();
        
        return t2-t1;});
     
      
      setContacts([...sortedContacts]);
      
    }

  return (
    <ContactsContext.Provider value={{contacts,updatecontacts}}>
      {children}
    </ContactsContext.Provider>
  );
}