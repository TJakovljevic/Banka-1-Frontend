import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import Login from './pages/Login';
import Landing from './pages/Landing';  
import { ThemeProvider } from './context/ThemeContext';
import ThemeToggle from './components/common/ThemeToggle';
import CustomerPortal from './pages/CustomerPortal';
import EmployeePortal from './pages/EmployeePortal';
import PasswordReset from './pages/PasswordReset';
import PasswordResetConfirmation from './pages/PasswordResetConfirmation';
import HomePage from './pages/HomePage';
import PasswordSetConfirmation from './pages/PasswordSetConfirmation';

function App() {
  return (
    <ThemeProvider>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} /> 
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/customer-portal" element={<CustomerPortal />} />
          <Route path="/employee-portal" element={<EmployeePortal />} />
          <Route path="/reset-password-email" element={<PasswordReset />} />
          <Route path="/reset-password" element={<PasswordResetConfirmation />} />
          <Route path="/set-password" element={<PasswordSetConfirmation />} />
        </Routes>
        <ThemeToggle />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;