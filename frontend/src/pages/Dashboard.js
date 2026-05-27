import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated, logout, getUserId } from '../services/auth';
import "./dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dash-container">
      
      {/* Navbar */}
      <div className="navbar">
        <h2>Campus Lost & Found</h2>
        <div className="nav-right">
          <span>Welcome, {getUserId()} 👋</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* Content */}
      <div className="content">
        <h1>Select Mode</h1>

        <div className="card-container">

          <div className="mode-card" onClick={() => navigate('/finder')}>
            <h2>🔍 Finder Mode</h2>
            <p>Found something? Upload it here</p>
          </div>

          <div className="mode-card" onClick={() => navigate('/loser')}>
            <h2>📦 Loser Mode</h2>
            <p>Lost something? Browse items here</p>
          </div>

        </div>
      </div>

    </div>
  );
}

export default Dashboard;