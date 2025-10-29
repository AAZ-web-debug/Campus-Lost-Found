import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getItems } from '../services/items';

function LoserMode() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    const data = await getItems();
    setItems(Array.isArray(data) ? data : []);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Loser Mode - Browse Lost Items</h1>
        <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>
          Back to Dashboard
        </button>
      </div>
      <div style={styles.content}>
        {items.length === 0 ? (
          <div style={styles.emptyState}>No items found yet</div>
        ) : (
          <div style={styles.grid}>
            {items.map((item) => (
              <div key={item.id} style={styles.itemCard}>
                {item.image_path ? (
                  <img
                    src={`http://localhost:5000${item.image_path}`}
                    alt="Found item"
                    style={styles.itemImage}
                  />
                ) : (
                  <div style={styles.noImage}>No Image</div>
                )}
                <div style={styles.itemInfo}>
                  <p><strong>Location:</strong> {item.address}</p>
                  <p><strong>Found by:</strong> {item.user_id}</p>
                  <p><strong>Date:</strong> {new Date(item.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
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
  backBtn: {
    padding: '8px 16px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  content: {
    padding: '40px'
  },
  emptyState: {
    textAlign: 'center',
    color: '#999',
    padding: '60px',
    backgroundColor: 'white',
    borderRadius: '8px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px'
  },
  itemCard: {
    backgroundColor: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  itemImage: {
    width: '100%',
    height: '200px',
    objectFit: 'cover'
  },
  noImage: {
    width: '100%',
    height: '200px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    color: '#999'
  },
  itemInfo: {
    padding: '15px'
  }
};

export default LoserMode;
