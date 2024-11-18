import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/images/paper-icon.png'; // Path ke logo PNG Anda

const Navbar = ({ isAuthenticated, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    if (onLogout) onLogout();
    navigate('/'); // Redirect ke halaman utama setelah logout
  };

  const goToProfile = () => {
    navigate('/profile'); // Redirect ke halaman profil
  };

  const renderAuthenticatedLinks = () => (
    <>
      {/* Profil dan Logout */}
      <div className="relative group">
        <button
          className="flex items-center space-x-2 focus:outline-none"
          onClick={goToProfile}
        >
          <img
            className="h-8 w-8 rounded-full"
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt="User Profile"
            onError={(e) => (e.target.src = '/fallback-profile.png')}
          />
          <span className="text-gray-300 hover:text-white text-sm font-medium">
            Profile
          </span>
        </button>
      </div>
      <button
        onClick={handleLogout}
        className="text-gray-300 hover:text-white text-sm font-medium focus:outline-none"
      >
        Logout
      </button>
    </>
  );

  const renderGuestLinks = () => (
    <>
      {/* Login dan Register */}
      <button
        onClick={() => navigate('/login')}
        className="text-gray-300 hover:text-white text-sm font-medium focus:outline-none"
      >
        Login
      </button>
      <button
        onClick={() => navigate('/register')}
        className="text-gray-300 hover:text-white text-sm font-medium focus:outline-none"
      >
        Register
      </button>
    </>
  );

  return (
    <nav className="bg-gray-800 shadow-md w-full fixed top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img src={logo} alt="Logo" className="h-8 w-auto" />
            </div>
            <div className="hidden sm:flex sm:ml-6">
              <div className="flex space-x-4">
                <button
                  onClick={() => navigate('/')}
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Home
                </button>
                <button
                  onClick={() => navigate('/snippets')}
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Snippets
                </button>
              </div>
            </div>
          </div>

          {/* Render Links Berdasarkan Status Login */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? renderAuthenticatedLinks() : renderGuestLinks()}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
