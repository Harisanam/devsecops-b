import React from 'react';
import PropTypes from 'prop-types';

function SnippetList({ snippets = [], onEdit, onDelete }) { // Set default empty array
  const validSnippets = snippets.filter(snippet => snippet && snippet.id); 
  return (
    <div className="snippet-list">
      {validSnippets.length > 0 ? (
        validSnippets.map((snippet) => (
          <div key={snippet.id} className="p-4 bg-gray-100 rounded-md border border-gray-300 mb-2">
            <p>{snippet.content}</p>
            <button onClick={() => onEdit(snippet.id, snippet.content)} className="text-blue-500">Edit</button>
            <button onClick={() => onDelete(snippet.id)} className="text-red-500">Delete</button>
          </div>
        ))
      ) : (
        <p>No snippets available.</p>
      )}
    </div>
  );
}

SnippetList.propTypes = {
  snippets: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default SnippetList;