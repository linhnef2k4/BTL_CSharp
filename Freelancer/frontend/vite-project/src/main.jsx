// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // <- 1. Import nó
import App from './App';
import './index.css';
import { AuthProvider } from './context/AuthContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 2. Bọc <App /> của bạn bằng <BrowserRouter> */}
    <BrowserRouter>
    
      <AuthProvider>
        <App />
      </AuthProvider>
      
    </BrowserRouter>
  </React.StrictMode>
);