import React from 'react';
import { useNavigate } from 'react-router-dom'; // Menggunakan React Router untuk navigasi

const Navbar = ({ onLogout }) => {
  const navigate = useNavigate(); // Hook untuk navigasi ke halaman login

  const handleLogout = () => {
    // Menghapus token atau informasi sesi dari localStorage/sessionStorage
    localStorage.removeItem('authToken'); // Gantilah sesuai dengan cara Anda menyimpan token

    // Panggil fungsi onLogout untuk menangani logika tambahan, jika diperlukan
    if (onLogout) {
      onLogout(); // Jika ada fungsi onLogout, panggil untuk menangani logout lebih lanjut
    }

    // Redirect ke halaman login setelah logout
    navigate('/login');
  };

  const goToProfile = () => {
    navigate('/profile'); // Arahkan ke halaman profil
  };

  return (
    <nav className="bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          <div className="flex items-center">
            {/* Logo Section */}
            <div className="flex-shrink-0">
              <img
                className="h-8 w-auto"
                src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=500"
                alt="Logo"
              />
            </div>

            {/* Links Section */}
            <div className="hidden sm:flex sm:ml-6">
              <div className="flex space-x-4">
                {/* Dashboard Link */}
                <a
                  href="#"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </a>

                {/* Snippets Link */}
                <a
                  href="#"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Snippets
                </a>

                {/* Profile Link */}
                <a
                  href="#"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  onClick={goToProfile}
                >
                  <img
                    className="h-8 w-8 rounded-full inline-block mr-2"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt="Profile"
                  />
                  Profile
                </a>
              </div>
            </div>
          </div>

          {/* Profile Dropdown */}
          <div className="ml-3 relative">
            <div>
              <button className="max-w-xs bg-gray-800 rounded-full flex items-center text-sm focus:outline-none">
                <img
                  className="h-8 w-8 rounded-full"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="Profile"
                />
              </button>
            </div>
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg">
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
