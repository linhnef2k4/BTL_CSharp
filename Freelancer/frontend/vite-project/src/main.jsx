// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // <- 1. Import nó
import App from './App';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 2. Bọc <App /> của bạn bằng <BrowserRouter> */}
    <BrowserRouter>
      <ToastProvider>
        
      <AuthProvider>
        <App />
      </AuthProvider>
      </ToastProvider>
      
    </BrowserRouter>
  </React.StrictMode>
);