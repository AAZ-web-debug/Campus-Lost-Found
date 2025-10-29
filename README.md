# Campus Lost & Found Application

## Project Structure
```
campus-lost-found/
├── backend/
│   ├── server.js           # Express server with REST API
│   ├── package.json
│   └── campus_lnf.db       # SQLite database (created on first run)
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── pages/          # React page components
│   │   ├── services/       # API service functions
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── uploads/                 # Uploaded images stored here
└── README.md
```

## Features
- User registration and authentication with JWT
- Finder Mode: Upload found items with photo and location
- Loser Mode: Browse all found items
- SQLite database for data persistence
- File upload with image preview
- Responsive, minimal UI design

## Running the Application

### Backend (Terminal 1)
```bash
cd backend
npm start
```
Backend runs on: http://localhost:5000

### Frontend (Terminal 2)
```bash
cd frontend
npm start
```
Frontend runs on: http://localhost:3000

## Usage
1. Register a new account
2. Login with your credentials
3. Choose Finder Mode to upload found items
4. Choose Loser Mode to browse lost items

## Tech Stack
- Backend: Node.js + Express + SQLite
- Frontend: React + React Router
- Authentication: JWT + bcrypt
- File Upload: Multer
