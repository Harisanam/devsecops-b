import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/login', { username, password });  // Memanfaatkan proxy di package.json
      const { token } = response.data;
      localStorage.setItem('authToken', token);
      onLogin();
      navigate('/dashboard');  // Arahkan ke dashboard setelah login berhasil
    } catch (error) {
      setError(error.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f1f6fa]">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-[#002b4e] text-center mb-6">Login to Your Account</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-semibold text-[#607d94]">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring focus:border-[#185cff]"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-[#607d94]">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring focus:border-[#185cff]"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#185cff] text-white py-3 rounded-md hover:bg-[#003b6f] transition"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm text-[#607d94] mt-4">
          Don't have an account? <a href="/register" className="text-[#185cff] font-semibold">Register</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
