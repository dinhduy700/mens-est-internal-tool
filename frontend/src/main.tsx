import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // 👈 1. Import BrowserRouter
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <BrowserRouter> {/* 👈 2. Bọc ở ngoài cùng */}
        <App />
      </BrowserRouter>
    </React.StrictMode>
);