import React, { useState } from 'react';

const SnippetsForm = ({ onSave }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validasi input
    if (!title.trim() || !content.trim()) {
      alert('Both title and content are required!');
      return;
    }

    // Kirim data ke fungsi onSave
    onSave({ title, content });
    setTitle('');
    setContent('');
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Snippet</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
        >
          Save Snippets
        </button>
      </form>
    </div>
  );
};

export default SnippetsForm;
