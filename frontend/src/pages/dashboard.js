import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import SnippetForm from '../components/SnippetForm';
import SnippetList from '../components/SnippetList';
import { loadSnippets, addSnippet, updateSnippet, deleteSnippet } from '../../public/scripts';
import ErrorBoundary from '../components/ErrorBoundary'; // Sesuaikan path

function Dashboard({ onLogout }) {
  const [snippets, setSnippets] = useState([]); // Pastikan snippets selalu array
  const [inputText, setInputText] = useState(''); // Tambahkan state untuk input text
  const [snippetTitle, setSnippetTitle] = useState(''); // State untuk judul snippet
  const [profile, setProfile] = useState({
    username: localStorage.getItem('username') || '',
    email: localStorage.getItem('email') || ''
  });

  useEffect(() => {
    const fetchSnippets = async () => {
      const fetchedSnippets = await loadSnippets();
      // Pastikan fetchedSnippets adalah array yang valid
      setSnippets(Array.isArray(fetchedSnippets) ? fetchedSnippets : []);
    };
    fetchSnippets();
  }, []);

  const handleAddSnippet = async () => {
    if (inputText.trim() && snippetTitle.trim()) {
      const newSnippet = await addSnippet({ title: snippetTitle, content: inputText });
      setSnippets((prevSnippets) => [...prevSnippets, newSnippet]);
      setInputText(''); // Reset input setelah menambahkan snippet
      setSnippetTitle(''); // Reset title
    }
  };

  const handleEditSnippet = async (id, updatedContent, updatedTitle) => {
    const updatedSnippet = await updateSnippet(id, { content: updatedContent, title: updatedTitle });
    setSnippets((prevSnippets) =>
      prevSnippets.map((snippet) =>
        snippet.id === updatedSnippet.id ? updatedSnippet : snippet
      )
    );
  };

  const handleDeleteSnippet = async (id) => {
    const isDeleted = await deleteSnippet(id);
    if (isDeleted) {
      setSnippets((prevSnippets) => prevSnippets.filter((snippet) => snippet.id !== id));
    }
  };

  // Fungsi untuk update profile
  const handleUpdateProfile = () => {
    localStorage.setItem('username', profile.username);
    localStorage.setItem('email', profile.email);
    alert('Profile updated successfully!');
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#f1f6fa]">
      {/* Navbar */}
      <Navbar onLogout={onLogout} />

      <div className="max-w-6xl mx-auto py-8 flex flex-col w-full">
        {/* Atur Profile */}
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

        {/* Area Input - Snippet Form */}
        <div className="w-full p-8 bg-white rounded-lg shadow-lg mb-8">
          <h3 className="text-2xl font-semibold text-[#002b4e] mb-4">Create New Paste</h3>
          {/* Title input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Snippet Title</label>
            <input
              type="text"
              value={snippetTitle}
              onChange={(e) => setSnippetTitle(e.target.value)}
              placeholder="Enter snippet title..."
              className="w-full p-4 border rounded-md focus:outline-none focus:ring focus:border-[#185cff] mb-4"
            />
          </div>
          {/* Content input */}
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter your text here..."
            className="w-full p-4 border rounded-md focus:outline-none focus:ring focus:border-[#185cff] mb-4"
            rows="6"
          />
          <button
            onClick={handleAddSnippet}
            className="w-full bg-[#185cff] text-white py-3 rounded-md hover:bg-[#003b6f] transition"
          >
            Save Paste
          </button>
        </div>

        {/* Snippet List with ErrorBoundary */}
        <ErrorBoundary>
          <SnippetList
            snippets={snippets}
            onEdit={handleEditSnippet}
            onDelete={handleDeleteSnippet}
          />
        </ErrorBoundary>
      </div>
    </div>
  );
}

export default Dashboard;
