import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/dashboard';
import GuestDashboard from './pages/GuestDashboard';
import Login from './pages/login';
import Register from './pages/register';
import Profile from './pages/profile';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    window.location.href = '/';
  };
  
  return (
    <>
      <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={isAuthenticated ? <Dashboard /> : <GuestDashboard />} />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" /> : <Login onLogin={() => setIsAuthenticated(true)} />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/" /> : <Register />}
        />
        <Route
          path="/profile"
          element={isAuthenticated ? <Profile /> : <Navigate to="/login" />}
        />
      </Routes>
    </>
  );
}

export default App;
