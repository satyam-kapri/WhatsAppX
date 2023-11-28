
import { createContext, useContext, useRef } from 'react';
const SocketContext = createContext();

export function useWebSocket() {
  return useContext(SocketContext);
}

export function SocketProvider({ children }) {
    const socket=useRef(null);
    
  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}
