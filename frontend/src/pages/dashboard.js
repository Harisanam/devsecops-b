import React, { useState, useEffect } from 'react';
import SnippetsForm from '../components/SnippetsForm';
import SnippetsList from '../components/SnippetsList';
import { loadSnippets, addSnippets, updateSnippets, deleteSnippets, shareSnippets } from '../../public/scripts';
import ErrorBoundary from '../components/ErrorBoundary';

function Dashboard() {
  const [snippets, setSnippets] = useState([]);
  const [inputText, setInputText] = useState('');
  const [snippetsTitle, setSnippetsTitle] = useState('');

  useEffect(() => {
    const fetchSnippets = async () => {
      try {
        const fetchedSnippets = await loadSnippets();
        if (Array.isArray(fetchedSnippets)) {
          const validSnippets = fetchedSnippets.filter(
            (snippets) => snippets && snippets._id
          );
          setSnippets(validSnippets);
        } else {
          setSnippets([]);
        }
      } catch (error) {
        console.error('Error fetching snippets:', error);
        if (error.message === 'Access denied. Token might be invalid.') {
          localStorage.clear();
          alert('Session expired. Please log in again.');
          window.location.href = '/login';
        }
      }
    };
  
    fetchSnippets();
  }, []);
  
  
  const handleAddSnippets = async (newSnippets) => {
    if (!newSnippets.title.trim() || !newSnippets.content.trim()) {
      alert('Title and content are required!');
      return;
    }
  
    try {
      const response = await addSnippets(newSnippets);
      if (response) {
        setSnippets((prevSnippets) => [...prevSnippets, response]);
      }
    } catch (error) {
      console.error('Error adding snippet:', error);
      alert('Failed to add snippet.');
    }
  };
  

 const handleUpdateSnippets = async (id, updatedData) => {
  try {
    const result = await updateSnippets(id, updatedData); // Pastikan nama fungsi sesuai
    console.log('Respons dari server:', result);

    if (!result || !result.snippet) {
      throw new Error('Invalid response from server');
    }

    const updateSnippet = result.snippet;
    setSnippets((prevSnippets) =>
      prevSnippets.map((snippet) =>
        snippet._id === id ? { ...snippet, ...updateSnippet } : snippet
      )
    );
  } catch (error) {
    console.error('Error editing snippet:', error);
    alert('Gagal memperbarui snippet.');
  }
};
  
  

  const handleDeleteSnippets = async (id) => {
    try {
      const isDeleted = await deleteSnippets(id);
      if (isDeleted) {
        setSnippets((prevSnippets) => prevSnippets.filter((snippets) => snippets._id !== id));
      }
    } catch (error) {
      console.error('Error deleting snippet:', error);
      alert('Failed to delete snippet.');
    }
  };
  const handleShareSnippet = async (id) => {
    try {
      // Panggil fungsi shareSnippets dari scripts.js
      const result = await shareSnippets(id);
  
      // Pastikan respons memiliki data snippet
      if (!result || !result.snippets) {
        throw new Error('Invalid response from server');
      }
  
      // Tetapkan respons ke `updatedSnippet`
      const updateSnippets = result.snippets;
  
      // Perbarui state `snippets` dengan data yang diperbarui
      setSnippets((prevSnippets) =>
        prevSnippets.map((snippets) =>
          snippets._id === id ? { ...snippets, shared: updateSnippets.shared } : snippets
        )
      );
    } catch (error) {
      console.error('Error sharing snippet:', error);
      alert('Failed to update share status.');
    }
  };
  
  
  
  
  
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="pt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Create New Paste</h3>
          <SnippetsForm
            title={snippetsTitle}
            setTitle={setSnippetsTitle}
            content={inputText}
            setContent={setInputText}
            onSave={handleAddSnippets}
            onSubmit={handleAddSnippets}
          />
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Snippets</h3>
          <ErrorBoundary>
          <SnippetsList
            snippets={snippets}
            onEdit={handleUpdateSnippets}
            onDelete={handleDeleteSnippets}
            onShare={handleShareSnippet} 
          />

          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
