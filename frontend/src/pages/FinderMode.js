import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadItem } from '../services/items';

function FinderMode() {
  const [address, setAddress] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!image || !address) {
      setMessage('Please provide both image and address');
      return;
    }

    const formData = new FormData();
    formData.append('image', image);
    formData.append('address', address);

    const result = await uploadItem(formData);
    if (result.message) {
      setMessage('Item uploaded successfully!');
      setTimeout(() => navigate('/dashboard'), 2000);
    } else {
      setMessage(result.error || 'Upload failed');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Finder Mode</h1>
        <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>
          Back to Dashboard
        </button>
      </div>
      <div style={styles.content}>
        <div style={styles.card}>
          <h2>Upload Found Item</h2>
          {message && <div style={styles.message}>{message}</div>}
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.uploadArea}>
              <label style={styles.uploadLabel}>
                {preview ? (
                  <img src={preview} alt="Preview" style={styles.preview} />
                ) : (
                  <div style={styles.uploadPlaceholder}>
                    Click to upload or capture photo
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageChange}
                  style={styles.fileInput}
                />
              </label>
            </div>
            <input
              type="text"
              placeholder="Location/Address where item was found"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={styles.input}
              required
            />
            <button type="submit" style={styles.button}>Submit</button>
          </form>
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
  backBtn: {
    padding: '8px 16px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  content: {
    padding: '40px',
    maxWidth: '600px',
    margin: '0 auto'
  },
  card: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  uploadArea: {
    marginBottom: '10px'
  },
  uploadLabel: {
    display: 'block',
    cursor: 'pointer'
  },
  uploadPlaceholder: {
    border: '2px dashed #ddd',
    borderRadius: '8px',
    padding: '60px 20px',
    textAlign: 'center',
    color: '#999'
  },
  preview: {
    width: '100%',
    maxHeight: '300px',
    objectFit: 'contain',
    borderRadius: '8px'
  },
  fileInput: {
    display: 'none'
  },
  input: {
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px'
  },
  button: {
    padding: '12px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer'
  },
  message: {
    backgroundColor: '#d4edda',
    color: '#155724',
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '15px'
  }
};

export default FinderMode;
