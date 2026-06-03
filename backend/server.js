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
const JWT_SECRET = 'campus-lnf-secret-key-2026';

app.use(cors());
app.use(express.json());

/* =========================
   UPLOADS
========================= */

const uploadsDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

app.use('/uploads', express.static(uploadsDir));

/* =========================
   DATABASE
========================= */

const db = new Database('campus_lnf.db');

/* USERS */

db.prepare(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'user',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`).run();

/* ITEMS */

db.prepare(`
CREATE TABLE IF NOT EXISTS items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,

  finder_id TEXT NOT NULL,

  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,

  verification_detail TEXT,

  image_path TEXT,

  location TEXT NOT NULL,

  status TEXT DEFAULT 'found',

  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`).run();

/* CLAIMS */

db.prepare(`
CREATE TABLE IF NOT EXISTS claims (
  id INTEGER PRIMARY KEY AUTOINCREMENT,

  item_id INTEGER NOT NULL,
  claimer_id TEXT NOT NULL,

  claim_reason TEXT,
  identifier_description TEXT,

  lost_location TEXT,
  lost_date TEXT,

  additional_proof TEXT,

  status TEXT DEFAULT 'pending',

  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY(item_id)
  REFERENCES items(id)
)
`).run();

/* =========================
   MULTER
========================= */

const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + '-' + file.originalname
    );
  }
});

const upload = multer({ storage });

/* =========================
   AUTH MIDDLEWARE
========================= */

const authenticateToken = (
  req,
  res,
  next
) => {

  const token =
    req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      error: 'No token'
    });
  }

  jwt.verify(
    token,
    JWT_SECRET,
    (err, user) => {

      if (err) {
        return res.status(403).json({
          error: 'Invalid token'
        });
      }

      req.user = user;
      next();
    }
  );
};

/* =========================
   REGISTER
========================= */

app.post(
  '/api/register',
  async (req, res) => {

    try {

      const {
        userId,
        password
      } = req.body;

      const hashed =
        await bcrypt.hash(
          password,
          10
        );

      db.prepare(`
        INSERT INTO users
        (
          user_id,
          password
        )
        VALUES (?, ?)
      `).run(
        userId,
        hashed
      );

      res.json({
        message: 'Registered'
      });

    } catch {

      res.status(400).json({
        error:
          'User already exists'
      });

    }
  }
);

/* =========================
   LOGIN
========================= */

app.post(
  '/api/login',
  async (req, res) => {

    const {
      userId,
      password
    } = req.body;

    const user = db.prepare(`
      SELECT *
      FROM users
      WHERE user_id = ?
    `).get(userId);

    if (!user) {
      return res.status(400).json({
        error: 'Invalid user'
      });
    }

    const valid =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!valid) {
      return res.status(400).json({
        error: 'Wrong password'
      });
    }

    const token = jwt.sign(
      {
        userId,
        role: user.role
      },
      JWT_SECRET
    );

    res.json({
      token
    });
  }
);

/* =========================
   CURRENT USER
========================= */

app.get(
  '/api/me',
  authenticateToken,
  (req, res) => {

    res.json({
      userId:
        req.user.userId,
      role:
        req.user.role
    });

  }
);

/* =========================
   CREATE ITEM
========================= */

app.post(
  '/api/items',
  authenticateToken,
  upload.single('image'),
  (req, res) => {

    const {
      title,
      category,
      description,
      verification_detail,
      location
    } = req.body;

    if (!req.file) {
      return res.status(400).json({
        error:
          'No image uploaded'
      });
    }

    const imagePath =
      `/uploads/${req.file.filename}`;

    db.prepare(`
      INSERT INTO items (
        finder_id,
        title,
        category,
        description,
        verification_detail,
        image_path,
        location,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      req.user.userId,
      title,
      category,
      description,
      verification_detail,
      imagePath,
      location,
      'found'
    );

    res.json({
      message:
        'Item uploaded successfully'
    });
  }
);

/* =========================
   ALL ITEMS
========================= */

app.get(
  '/api/items',
  authenticateToken,
  (req, res) => {

    const items = db.prepare(`
      SELECT
        id,
        finder_id,
        title,
        category,
        description,
        image_path,
        location,
        status,
        created_at
      FROM items
      WHERE status = 'found'
      ORDER BY created_at DESC
    `).all();

    res.json(items);
  }
);

/* =========================
   SINGLE ITEM
========================= */

app.get(
  '/api/items/:id',
  authenticateToken,
  (req, res) => {

    const item =
      db.prepare(`
        SELECT *
        FROM items
        WHERE id = ?
      `).get(
        req.params.id
      );

    if (!item) {
      return res.status(404).json({
        error:
          'Item not found'
      });
    }

    res.json(item);
  }
);

/* =========================
   PUBLIC ITEMS
========================= */

app.get(
  '/api/public-items',
  (req, res) => {

    const items = db.prepare(`
      SELECT
        id,
        title,
        category,
        description,
        image_path,
        location,
        status,
        created_at
      FROM items
      ORDER BY created_at DESC
      LIMIT 6
    `).all();

    res.json(items);
  }
);

app.get(
  '/api/returned-items',
  (req, res) => {

    const items = db.prepare(`
      SELECT
        id,
        title,
        category,
        description,
        image_path,
        location,
        status,
        created_at
      FROM items
      WHERE status = 'returned'
      ORDER BY created_at DESC
    `).all();

    res.json(items);

  }
);

/* =========================
   CREATE CLAIM
========================= */

app.post(
  '/api/claims',
  authenticateToken,
  (req, res) => {

    const {
      item_id,
      claim_reason,
      identifier_description,
      lost_location,
      lost_date,
      additional_proof
    } = req.body;

    db.prepare(`
      INSERT INTO claims (
        item_id,
        claimer_id,
        claim_reason,
        identifier_description,
        lost_location,
        lost_date,
        additional_proof,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      item_id,
      req.user.userId,
      claim_reason,
      identifier_description,
      lost_location,
      lost_date,
      additional_proof,
      'pending'
    );

    res.json({
      message:
        'Claim submitted'
    });
  }
);

/* =========================
   GET CLAIMS
========================= */

app.get(
  '/api/claims',
  authenticateToken,
  (req, res) => {

    const claims = db.prepare(`
      SELECT
        claims.*,
        items.title,
        items.category,
        items.verification_detail,
        items.finder_id
      FROM claims
      JOIN items
      ON claims.item_id = items.id
      WHERE items.finder_id = ?
      ORDER BY claims.created_at DESC
    `).all(
      req.user.userId
    );

    res.json(claims);

  }
);

/* =========================
   APPROVE CLAIM
========================= */

app.post(
  '/api/claims/:id/approve',
  authenticateToken,
  (req, res) => {

    const claim =
      db.prepare(`
        SELECT *
        FROM claims
        WHERE id = ?
      `).get(req.params.id);

    if (!claim) {
      return res.status(404).json({
        error: 'Claim not found'
      });
    }

    const item =
      db.prepare(`
        SELECT *
        FROM items
        WHERE id = ?
      `).get(claim.item_id);

    if (!item) {
      return res.status(404).json({
        error: 'Item not found'
      });
    }

    if (
      item.finder_id !==
      req.user.userId
    ) {
      return res.status(403).json({
        error:
          'Only the finder can approve claims'
      });
    }

    db.prepare(`
      UPDATE claims
      SET status='approved'
      WHERE id=?
    `).run(req.params.id);

    db.prepare(`
      UPDATE items
      SET status='returned'
      WHERE id=?
    `).run(claim.item_id);

    res.json({
      message:
        'Claim approved'
    });

  }
);

/* =========================
   REJECT CLAIM
========================= */

app.post(
  '/api/claims/:id/reject',
  authenticateToken,
  (req, res) => {

    const claim =
      db.prepare(`
        SELECT *
        FROM claims
        WHERE id = ?
      `).get(req.params.id);

    if (!claim) {
      return res.status(404).json({
        error: 'Claim not found'
      });
    }

    const item =
      db.prepare(`
        SELECT *
        FROM items
        WHERE id = ?
      `).get(claim.item_id);

    if (
      item.finder_id !==
      req.user.userId
    ) {
      return res.status(403).json({
        error:
          'Only the finder can reject claims'
      });
    }

    db.prepare(`
      UPDATE claims
      SET status='rejected'
      WHERE id=?
    `).run(req.params.id);

    res.json({
      message:
        'Claim rejected'
    });

  }
);

/* =========================
   STATS
========================= */

app.get(
  '/api/stats',
  (req, res) => {

    const reported =
      db.prepare(`
        SELECT COUNT(*) count
        FROM items
      `).get();

    const available =
      db.prepare(`
        SELECT COUNT(*) count
        FROM items
        WHERE status='found'
      `).get();

    const returned =
      db.prepare(`
        SELECT COUNT(*) count
        FROM items
        WHERE status='returned'
      `).get();

    const pendingClaims =
      db.prepare(`
        SELECT COUNT(*) count
        FROM claims
        WHERE status='pending'
      `).get();

    res.json({
      reported:
        reported.count,

      available:
        available.count,

      returned:
        returned.count,

      pendingClaims:
        pendingClaims.count
    });
  }
);

/* =========================
   START SERVER
========================= */

app.listen(
  PORT,
  () => {
    console.log(
      `🚀 Campus Lost & Found Backend V3 running on port ${PORT}`
    );
  }
);


/* =========================
    ADMIN ROUTES
========================= */

app.get(
  '/api/admin/stats',
  authenticateToken,
  (req, res) => {

    const user = db.prepare(`
      SELECT *
      FROM users
      WHERE user_id = ?
    `).get(req.user.userId);

    if (
      !user ||
      user.role !== 'admin'
    ) {
      return res.status(403).json({
        error: 'Access denied'
      });
    }

    const totalUsers =
      db.prepare(`
        SELECT COUNT(*) as count
        FROM users
      `).get().count;

    const totalItems =
      db.prepare(`
        SELECT COUNT(*) as count
        FROM items
      `).get().count;

    const pendingClaims =
      db.prepare(`
        SELECT COUNT(*) as count
        FROM claims
        WHERE status='pending'
      `).get().count;

    const returnedItems =
      db.prepare(`
        SELECT COUNT(*) as count
        FROM items
        WHERE status='returned'
      `).get().count;

    res.json({
      totalUsers,
      totalItems,
      pendingClaims,
      returnedItems
    });

  }
);

/* =========================
   ADMIN - ALL USERS
========================= */

app.get(
  '/api/admin/users',
  authenticateToken,
  (req, res) => {

    const user = db.prepare(`
      SELECT *
      FROM users
      WHERE user_id = ?
    `).get(req.user.userId);

    if (
      !user ||
      user.role !== 'admin'
    ) {
      return res.status(403).json({
        error: 'Access denied'
      });
    }

    const users = db.prepare(`
      SELECT
        id,
        user_id,
        role,
        created_at
      FROM users
      ORDER BY created_at DESC
    `).all();

    res.json(users);

  }
);

/* =========================
   ADMIN - ALL ITEMS
========================= */

app.get(
  '/api/admin/items',
  authenticateToken,
  (req, res) => {

    const user = db.prepare(`
      SELECT *
      FROM users
      WHERE user_id = ?
    `).get(req.user.userId);

    if (
      !user ||
      user.role !== 'admin'
    ) {
      return res.status(403).json({
        error: 'Access denied'
      });
    }

    const items = db.prepare(`
      SELECT *
      FROM items
      ORDER BY created_at DESC
    `).all();

    res.json(items);

  }
);

/* =========================
   ADMIN - ALL CLAIMS
========================= */

app.get(
  '/api/admin/claims',
  authenticateToken,
  (req, res) => {

    const user = db.prepare(`
      SELECT *
      FROM users
      WHERE user_id = ?
    `).get(req.user.userId);

    if (
      !user ||
      user.role !== 'admin'
    ) {
      return res.status(403).json({
        error: 'Access denied'
      });
    }

    const claims = db.prepare(`
      SELECT
        claims.*,
        items.title
      FROM claims
      JOIN items
      ON claims.item_id = items.id
      ORDER BY claims.created_at DESC
    `).all();

    res.json(claims);

  }
);


/* =========================
   ADMIN - DELETE USER
========================= */

app.delete(
  '/api/admin/users/:id',
  authenticateToken,
  (req, res) => {

    const admin = db.prepare(`
      SELECT *
      FROM users
      WHERE user_id = ?
    `).get(req.user.userId);

    if (
      !admin ||
      admin.role !== 'admin'
    ) {
      return res.status(403).json({
        error: 'Access denied'
      });
    }

    const targetUser =
      db.prepare(`
        SELECT *
        FROM users
        WHERE id = ?
      `).get(req.params.id);

    if (
      targetUser &&
      targetUser.role === 'admin'
    ) {
      return res.status(400).json({
        error:
          'Cannot delete admin'
      });
    }

    db.prepare(`
      DELETE FROM users
      WHERE id = ?
    `).run(req.params.id);

    res.json({
      message:
        'User deleted'
    });

  }
);


/* =========================
   ADMIN - DELETE ITEM
========================= */

app.delete(
  '/api/admin/items/:id',
  authenticateToken,
  (req, res) => {

    const user = db.prepare(`
      SELECT *
      FROM users
      WHERE user_id = ?
    `).get(req.user.userId);

    if (
      !user ||
      user.role !== 'admin'
    ) {
      return res.status(403).json({
        error: 'Access denied'
      });
    }

    db.prepare(`
      DELETE FROM items
      WHERE id = ?
    `).run(req.params.id);

    res.json({
      message: 'Item deleted'
    });

  }
);