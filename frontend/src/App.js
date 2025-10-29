import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import FinderMode from './pages/FinderMode';
import LoserMode from './pages/LoserMode';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/finder" element={<FinderMode />} />
        <Route path="/loser" element={<LoserMode />} />
      </Routes>
    </Router>
  );
}

export default App;
