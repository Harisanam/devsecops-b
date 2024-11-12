import React, { useState } from 'react';

const Profile = () => {
  const [profile, setProfile] = useState({
    username: localStorage.getItem('username') || '',
    email: localStorage.getItem('email') || ''
  });

  // Fungsi untuk update profile
  const handleUpdateProfile = () => {
    localStorage.setItem('username', profile.username);
    localStorage.setItem('email', profile.email);
    alert('Profile updated successfully!');
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#f1f6fa]">
      <div className="max-w-6xl mx-auto py-8">
        <div className="w-full p-8 bg-white rounded-lg shadow-lg mb-8">
          <h3 className="text-2xl font-semibold text-[#002b4e] mb-4">Update Your Profile</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              value={profile.username}
              onChange={(e) => setProfile({ ...profile, username: e.target.value })}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring focus:border-[#185cff]"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring focus:border-[#185cff]"
            />
          </div>
          <button
            onClick={handleUpdateProfile}
            className="w-full bg-[#185cff] text-white py-3 rounded-md hover:bg-[#003b6f] transition"
          >
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
