# Campus Lost & Found Application

## Project Structure
```
campus-lost-found/
│
├── backend/
│   ├── server.js
│   ├── package.json
│   └── campus_lnf.db
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   │
│   └── src/
│       ├── components/
│       │   └── Navbar.js
│       │
│       ├── pages/
│       │   ├── LandingPage.js
│       │   ├── Login.js
│       │   ├── Register.js
│       │   ├── Dashboard.js
│       │   ├── FinderMode.js
│       │   ├── LoserMode.js
│       │   ├── ClaimPage.js
│       │   ├── ReviewClaims.js
│       │   └── ReturnedItems.js
│       │
│       ├── services/
│       ├── App.js
│       └── index.js
│
└── README.md
```


## Features

- User Registration and Login with JWT Authentication
- Secure Protected Routes
- Finder Mode for reporting found items
- Upload item image, description, category, and location
- Browse Found Items with Search and Category Filters
- Fullscreen Image Preview
- Claim Request System
- Ownership Verification Questions
- Finder-only Claim Review
- Approve or Reject Claims
- Returned Items Archive
- Dashboard Statistics
- SQLite Database Storage
- Responsive Modern UI


## Workflow

1. User registers and logs in
2. Finder reports a found item
3. Other users browse available items
4. Owner submits a claim request
5. Finder reviews ownership details
6. Finder approves or rejects the claim
7. Approved items move to the Recovered Items archive

## Security Features

- JWT-based Authentication
- Protected API Routes
- Finder-only Claim Approval
- Finder-only Claim Visibility
- Ownership Verification Process
- Secure Claim Review Workflow

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
2. Login using your credentials
3. Use **Finder Mode** to report a found item
4. Upload the item image, category, description, and location
5. Use **Browse Items** to search through available found items
6. Filter items by category or search by name
7. Submit a claim request for an item you believe belongs to you
8. Provide ownership verification details during the claim process
9. The finder reviews the claim request
10. The finder approves or rejects the claim
11. Approved items are moved to the **Recovered Items** archive
12. View recovered items and platform statistics from the dashboard


## Technologies Used

Frontend:
- React.js
- React Router
- CSS3

Backend:
- Node.js
- Express.js

Database:
- SQLite

Authentication:
- JSON Web Tokens (JWT)

File Uploads:
- Multer


## Future Enhancements

- Admin Dashboard
- Email Notifications
- Advanced Search
- User Profiles
- AI-assisted Ownership Verification
- Campus-wide Analytics