import React, { useState } from 'react';

function SnippetsList({ snippets, onEdit, onDelete, onShare }) {
  const [editingId, setEditingId] = useState(null); // ID snippet yang sedang diedit
  const [editedTitle, setEditedTitle] = useState(''); // Judul yang diedit
  const [editedContent, setEditedContent] = useState(''); // Konten yang diedit

  const handleEditClick = (snippets) => {
    setEditingId(snippets._id); // Atur ID snippet yang sedang diedit
    setEditedTitle(snippets.title); // Isi form dengan judul saat ini
    setEditedContent(snippets.content); // Isi form dengan konten saat ini
  };

  const handleSaveClick = () => {
    onEdit(editingId, editedContent, editedTitle); // Simpan perubahan
    setEditingId(null); // Kembali ke mode tampilan
  };

  const handleCancelClick = () => {
    setEditingId(null); // Kembali ke mode tampilan tanpa menyimpan perubahan
  };

  if (!snippets || snippets.length === 0) {
    return <p className="text-center text-gray-500">No snippets available.</p>;
  }

  return (
    <div className="space-y-4">
      {snippets.map((snippets) => {
        // Validasi data snippet
        if (!snippets || !snippets._id) {
          console.warn('Invalid snippet object detected:', snippets);
          return null; // Skip invalid snippets
        }

        return (
          <div key={snippets._id} className="p-4 border rounded-lg shadow">
            {editingId === snippets._id ? (
              <>
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="w-full p-2 border rounded-md mb-2"
                />
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="w-full p-2 border rounded-md mb-2"
                  rows="4"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleSaveClick}
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelClick}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold">{snippets.title}</h3>
                  {snippets.shared && (
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-600 rounded-md">
                      Shared
                    </span>
                  )}
                </div>
                <p className="mt-2 text-gray-700">{snippets.content}</p>
                <div className="mt-4 flex space-x-4">
                  <button
                    onClick={() => handleEditClick(snippets)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(snippets._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => onShare(snippets._id)}
                    className={`px-4 py-2 rounded-md ${
                      snippets.shared
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : 'bg-gray-300 text-black hover:bg-gray-400'
                    }`}
                  >
                    {snippets.shared ? 'Unshare' : 'Share'}
                  </button>
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default SnippetsList;
