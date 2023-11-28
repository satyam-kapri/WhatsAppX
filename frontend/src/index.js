import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { SocketProvider } from './context/socketcontext';
import { ContactsProvider } from './context/contactscontext';
import { ThemeProvider } from '@mui/material';
import theme from './context/theme';
import { UserProvider } from './context/usercontext';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <UserProvider>
    <ThemeProvider theme={theme}>
     <ContactsProvider>
    <SocketProvider>
    <App />
    </SocketProvider>
    </ContactsProvider>
    </ThemeProvider>
    </UserProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
