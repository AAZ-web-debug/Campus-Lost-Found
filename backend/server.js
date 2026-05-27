const express = require('express');
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5000;
const JWT_SECRET = 'campus-lnf-secret-key-2024';

app.use(cors());
app.use(express.json());

// uploads folder
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
app.use('/uploads', express.static(uploadsDir));

// DB
const db = new Database('campus_lnf.db');

db.prepare(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT UNIQUE,
  password TEXT
)`).run();

db.prepare(`CREATE TABLE IF NOT EXISTS items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT,
  image_path TEXT,
  address TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`).run();

// multer
const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// auth middleware
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// register
app.post('/api/register', async (req, res) => {
  const { userId, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  db.prepare('INSERT INTO users (user_id, password) VALUES (?, ?)').run(userId, hashed);
  res.json({ message: "Registered" });
});

// login
app.post('/api/login', (req, res) => {
  const { userId, password } = req.body;

  const user = db.prepare('SELECT * FROM users WHERE user_id = ?').get(userId);
  if (!user) return res.status(400).json({ error: 'Invalid user' });

  bcrypt.compare(password, user.password).then(valid => {
    if (!valid) return res.status(400).json({ error: 'Wrong password' });

    const token = jwt.sign({ userId }, JWT_SECRET);
    res.json({ token });
  });
});

// upload
app.post('/api/items', authenticateToken, upload.single('image'), (req, res) => {
  const { address } = req.body;

  if (!req.file) return res.status(400).json({ error: "No image uploaded" });

  const imagePath = `/uploads/${req.file.filename}`;

  db.prepare('INSERT INTO items (user_id, image_path, address) VALUES (?, ?, ?)')
    .run(req.user.userId, imagePath, address);

  res.json({ message: "Uploaded successfully" });
});

// get items
app.get('/api/items', authenticateToken, (req, res) => {
  const items = db.prepare('SELECT * FROM items').all();
  res.json(items);
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});