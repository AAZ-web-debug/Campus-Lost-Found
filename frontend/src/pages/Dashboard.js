import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated, logout, getUserId } from '../services/auth';

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
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Campus Lost & Found</h1>
        <div style={styles.userInfo}>
          <span>Welcome, {getUserId()}</span>
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </div>
      </div>
      <div style={styles.content}>
        <h2 style={styles.subtitle}>Select Mode</h2>
        <div style={styles.modeContainer}>
          <div style={styles.modeCard} onClick={() => navigate('/finder')}>
            <h3>Finder Mode</h3>
            <p>Found something? Upload it here</p>
          </div>
          <div style={styles.modeCard} onClick={() => navigate('/loser')}>
            <h3>Loser Mode</h3>
            <p>Lost something? Browse items here</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    fontFamily: 'Arial, sans-serif'
  },
  header: {
    backgroundColor: 'white',
    padding: '20px 40px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    margin: 0,
    color: '#333'
  },
  userInfo: {
    display: 'flex',
    gap: '15px',
    alignItems: 'center'
  },
  logoutBtn: {
    padding: '8px 16px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  content: {
    padding: '40px',
    maxWidth: '900px',
    margin: '0 auto'
  },
  subtitle: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '30px'
  },
  modeContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px'
  },
  modeCard: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'transform 0.2s'
  }
};

export default Dashboard;
