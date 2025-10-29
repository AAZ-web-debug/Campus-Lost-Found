const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5000;
const JWT_SECRET = 'campus-lnf-secret-key-2024';

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Database setup
const db = new sqlite3.Database('./campus_lnf.db', (err) => {
  if (err) console.error(err.message);
  console.log('Connected to SQLite database.');
});

// Create tables
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    image_path TEXT,
    address TEXT NOT NULL,
    status TEXT DEFAULT 'found',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
  )`);
});

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Auth middleware
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Routes
// Register
app.post('/api/register', async (req, res) => {
  const { userId, password } = req.body;
  
  if (!userId || !password) {
    return res.status(400).json({ error: 'User ID and password required' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  db.run('INSERT INTO users (user_id, password) VALUES (?, ?)', 
    [userId, hashedPassword], 
    function(err) {
      if (err) {
        return res.status(400).json({ error: 'User ID already exists' });
      }
      res.json({ message: 'User registered successfully' });
    }
  );
});

// Login
app.post('/api/login', (req, res) => {
  const { userId, password } = req.body;

  db.get('SELECT * FROM users WHERE user_id = ?', [userId], async (err, user) => {
    if (err || !user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.user_id }, JWT_SECRET);
    res.json({ token, userId: user.user_id });
  });
});

// Upload found item
app.post('/api/items', authenticateToken, upload.single('image'), (req, res) => {
  const { address } = req.body;
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  db.run('INSERT INTO items (user_id, image_path, address) VALUES (?, ?, ?)',
    [req.user.userId, imagePath, address],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to save item' });
      }
      res.json({ message: 'Item uploaded successfully', id: this.lastID });
    }
  );
});

// Get all items
app.get('/api/items', authenticateToken, (req, res) => {
  db.all('SELECT * FROM items ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch items' });
    }
    res.json(rows);
  });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
