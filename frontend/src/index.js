import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App';
import GuildRanking from './components/GuildRanking'; // 需要創建這個組件
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/guild-ranking/:db_root/:guildId" element={<GuildRanking />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

reportWebVitals();