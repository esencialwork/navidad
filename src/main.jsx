import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import PrivacyNotice from './pages/PrivacyNotice.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/aviso-de-privacidad" element={<PrivacyNotice />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
