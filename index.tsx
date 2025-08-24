
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './src/index.css';

// Redirect base path '/' to '/login'
if (typeof window !== 'undefined') {
  const { pathname, search } = window.location;
  if (pathname === '/' || pathname === '') {
    const target = '/login' + (search || '');
    window.history.replaceState(null, '', target);
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
