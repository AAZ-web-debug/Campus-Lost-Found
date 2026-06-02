import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated, logout, getUserId } from '../services/auth';
import './dashboard.css';

function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    reported: 0,
    available: 0,
    returned: 0,
    pendingClaims: 0
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    fetchStats();
  }, [navigate]);

  const fetchStats = async () => {
    try {
      const res = await fetch(
        'http://localhost:5000/api/stats'
      );

      const data = await res.json();

      setStats(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-page">

      <nav className="dashboard-navbar">

        <div className="dashboard-logo">
          🛡️ Campus Lost & Found
        </div>

        <div className="dashboard-user">

          <span>
            Welcome back, {getUserId()} 👋
          </span>

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </nav>

      <section className="dashboard-hero">

        <h1>
          Dashboard
        </h1>

        <p>
          Manage found items, review claims,
          and help students recover their belongings.
        </p>

      </section>

      <section className="dashboard-stats">

        <div className="stat-box">
          <h2>{stats.reported}</h2>
          <p>Items Reported</p>
        </div>

        <div className="stat-box">
          <h2>{stats.available}</h2>
          <p>Available Items</p>
        </div>

        <div className="stat-box">
          <h2>{stats.returned}</h2>
          <p>Recovered Items</p>
        </div>

        <div className="stat-box">
          <h2>{stats.pendingClaims}</h2>
          <p>Pending Claims</p>
        </div>

      </section>

      <section className="dashboard-actions">

        <div
          className="action-card"
          onClick={() => navigate('/finder')}
        >
          <div className="action-icon">
            🔍
          </div>

          <h2>
            Report Item
          </h2>

          <p>
            Upload found belongings and help
            reconnect them with their owners.
          </p>
        </div>

        <div
          className="action-card"
          onClick={() => navigate('/loser')}
        >
          <div className="action-icon">
            📦
          </div>

          <h2>
            Browse Items
          </h2>

          <p>
            Search through active found items
            across the campus.
          </p>
        </div>

        <div
          className="action-card"
          onClick={() => navigate('/review-claims')}
        >
          <div className="action-icon">
            📋
          </div>

          <h2>
            Review Claims
          </h2>

          <p>
            Verify ownership requests and
            approve or reject claims.
          </p>
        </div>

        <div
          className="action-card"
          onClick={() => navigate('/returned-items')}
        >
          <div className="action-icon">
            ✅
          </div>

          <h2>
            Recovered Items
          </h2>

          <p>
            View items that were successfully
            returned to their owners.
          </p>
        </div>

      </section>

      <section className="activity-section">

        <h2>
          Platform Overview
        </h2>

        <div className="activity-grid">

          <div className="activity-card">
            📸 Upload Found Items
          </div>

          <div className="activity-card">
            📋 Review Ownership Claims
          </div>

          <div className="activity-card">
            🔒 Secure Authentication
          </div>

          <div className="activity-card">
            ✅ Successful Recoveries
          </div>

        </div>

      </section>

    </div>
  );
}

export default Dashboard;