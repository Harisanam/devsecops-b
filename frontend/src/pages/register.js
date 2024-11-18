import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();  // Prevent default form submission
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Simulasi registrasi, seperti menyimpan data ke server
    localStorage.setItem('Token', 'sampleToken123');
    navigate('/dashboard');  // Redirect ke dashboard setelah registrasi
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f1f6fa]">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-[#002b4e] text-center mb-6">Create an Account</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleRegister} className="space-y-4">
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
            <label htmlFor="email" className="block text-sm font-semibold text-[#607d94]">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-[#607d94]">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring focus:border-[#185cff]"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#185cff] text-white py-3 rounded-md hover:bg-[#003b6f] transition"
          >
            Register
          </button>
        </form>
        
        <p className="text-center text-sm text-[#607d94] mt-4">
          Already have an account? <a href="/login" className="text-[#185cff] font-semibold">Login</a>
        </p>
      </div>
    </div>
  );
}

export default Register;
