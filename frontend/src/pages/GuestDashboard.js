import React, { useEffect, useState } from 'react';

const GuestDashboard = () => {
  const [snippets, setSnippets] = useState([]);

  useEffect(() => {
    const fetchPublicSnippets = async () => {
      try {
        console.log('Fetching public snippets...');
        const response = await fetch('http://localhost:3000/api/snippets/public', {
          method: 'GET',
        });
  
        console.log('Response status:', response.status);
  
        if (!response.ok) {
          throw new Error('Failed to fetch public snippets');
        }
  
        const data = await response.json();
        console.log('Public snippets received:', data);
  
        setSnippets(data);
      } catch (error) {
        console.error('Error fetching public snippets:', error);
      }
    };
  
    fetchPublicSnippets();
  }, []);
  

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Public Snippets</h1>
      {snippets.length === 0 ? (
        <p className="text-gray-500">No public snippets available.</p>
      ) : (
        <ul className="space-y-4">
          {snippets.map((snippet) => (
            <li key={snippet._id} className="p-4 border rounded-lg shadow">
              <h2 className="text-lg font-semibold">{snippet.title}</h2>
              <p className="text-gray-700">{snippet.content}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GuestDashboard;
