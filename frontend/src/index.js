import React from 'react';
import ReactDOM from 'react-dom/client';
import '../public/styles/tailwind-output.css';
import App from './app.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);