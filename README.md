**# 🎓 Campus Lost & Found**

A full-stack web application that helps students **\*\*report, discover, verify, and recover lost belongings on campus\*\*** through a secure claim-management workflow.

The platform connects students who find lost items with potential owners while keeping claim review under the control of the student who originally reported the item.

**---**

**## 📌 Overview**

Losing personal belongings on campus can be frustrating, while found items often have no reliable way to reach their owners.

**\*\*Campus Lost & Found\*\*** provides a centralized platform where students can:

\- Report items they have found

\- Browse and search reported items

\- Submit ownership claims

\- Provide item-specific verification information

\- Review and approve/reject claims

\- Track the status of their own claims

\- Securely exchange finder contact details after approval

\- View recovered items

\- Monitor platform activity through the dashboard

The application uses **\*\*JWT authentication, protected routes, role-based access logic, Express REST APIs, SQLite storage, and controlled file uploads\*\*** to provide a structured recovery process.

**---**

**## ✨ Key Features**

**### 🔐 Authentication & Security**

\- User registration and login

\- Password hashing with bcrypt

\- JWT-based authentication

\- Protected frontend routes

\- Protected backend API endpoints

\- Role-based access logic

\- Admin-only access to administrative functionality

\- Finder-only claim review

\- Claimant-specific claim history

\- Backend authorization based on the authenticated user's identity

\- Protected contact information for approved claimants

**### 🔎 Found Item Discovery**

\- Browse found items

\- Search by item name or description

\- Filter by category

\- View item details

\- Image preview/fullscreen viewing

\- Location information

\- Recently found items displayed on the landing page

\- Landing page requests only the required number of recent items from the backend

**### 📦 Finder Mode**

Students who find an item can report it by providing:

\- Item name

\- Category

\- Description

\- Found location

\- Item image

\- Hidden verification information

Once submitted, the item becomes available for potential owners to discover.

**### 🙋 Claim System**

Potential owners can submit claims for found items.

A claim can contain:

\- Claim reason

\- Identifier/ownership description

\- Lost location

\- Lost date

\- Additional proof

The backend also prevents important invalid operations such as:

\- Claiming your own reported item

\- Submitting duplicate claims for the same item

\- Claiming an item that is no longer available

**### 🧾 Finder-Side Claim Review**

The student who originally reported an item can review its claims.

The finder can:

\- View claimant information

\- Review ownership reasoning

\- Review verification details

\- Approve a claim

\- Reject a claim

Only the finder associated with the item is authorized to manage its claims.

**### 📋 My Claims**

Claimants have their own **\*\*My Claims\*\*** page.

They can see:

\- Item title

\- Category

\- Location

\- Submission date

\- Pending status

\- Approved status

\- Rejected status

The page is scoped to the authenticated user, meaning users cannot request another user's claim history through the frontend or API.

**### 📞 Secure Contact Sharing**

After approving a claim, the finder can provide:

\- Email

\- Phone number

\- Or both

The contact details are stored separately and are only accessible to the **\*\*approved claimant\*\***.

The approval workflow also:

1\. Approves the selected claim

2\. Rejects other pending claims for the same item

3\. Stores the finder contact details

4\. Marks the item as returned

Contact information is never exposed through the normal claim listing.

**### 🎒 Recovered Items**

Once a claim is approved, the item moves from the active found-item workflow into the **\*\*Recovered Items\*\*** section.

This provides a record of successfully recovered items and keeps returned items separate from active listings.

**### 📊 Dashboard**

The dashboard provides an overview of platform activity, including:

\- Reported items

\- Available items

\- Returned items

\- Pending claims

\- User actions

\- Finder-side claim review

\- My Claims

\- Admin functionality for authorized administrators

**### 🛡️ Admin Access**

Administrators have access to protected administrative functionality.

Admin access is controlled on both the frontend and backend rather than relying only on hiding UI elements.

Normal users cannot access the administrative route or administrative operations simply by navigating directly to the URL.

**### 🔔 User Experience**

The application includes reusable UI components for:

\- Toast notifications

\- Confirmation dialogs

\- Approval/contact dialogs

\- Reusable back navigation

\- Loading and empty states

\- Responsive layouts

**---**

**## 🔄 Application Workflow**

\`\`\`text

┌─────────────────────────┐

│     User Registers      │

│        / Logs In        │

└────────────┬────────────┘

             │

             ▼

┌─────────────────────────┐

│    Finder Reports       │

│      Found Item         │

└────────────┬────────────┘

             │

             ▼

┌─────────────────────────┐

│ Item Appears in Browse  │

│      Found Items        │

└────────────┬────────────┘

             │

             ▼

┌─────────────────────────┐

│ Potential Owner Submits │

│         Claim           │

└────────────┬────────────┘

             │

             ▼

┌─────────────────────────┐

│ Ownership Information   │

│      Is Reviewed        │

└────────────┬────────────┘

             │

       ┌─────┴─────┐

       │           │

       ▼           ▼

┌────────────┐ ┌────────────┐

│  Approve   │ │   Reject   │

│   Claim    │ │   Claim    │

└─────┬──────┘ └────────────┘

      │

      ▼

┌─────────────────────────┐

│ Other Pending Claims    │

│      Are Rejected       │

└────────────┬────────────┘

             │

             ▼

┌─────────────────────────┐

│ Finder Contact Details  │

│   Shared Securely       │

└────────────┬────────────┘

             │

             ▼

┌─────────────────────────┐

│ Item Marked as Returned │

│   / Recovered           │

└─────────────────────────┘

\`\`\`

**---**

**## 🖥️ Application Structure**

The application is divided into a **\*\*React frontend\*\*** and a **\*\*Node.js/Express backend\*\***.

\`\`\`text

campus-lost-found/

│

├── backend/

│   ├── server.js

│   ├── package.json

│   ├── campus_lnf.db

│   └── uploads/

│

├── frontend/

│   ├── public/

│   │   └── index.html

│   │

│   └── src/

│       ├── components/

│       │   ├── AdminRoute.js

│       │   ├── ApproveClaimModal.js

│       │   ├── BackButton.js

│       │   ├── ConfirmModal.js

│       │   └── Toast.js

│       │

│       ├── pages/

│       │   ├── LandingPage.js

│       │   ├── Login.js

│       │   ├── Register.js

│       │   ├── Dashboard.js

│       │   ├── FinderMode.js

│       │   ├── LoserMode.js

│       │   ├── ClaimPage.js

│       │   ├── ReviewClaims.js

│       │   ├── MyClaims.js

│       │   ├── ReturnedItems.js

│       │   └── Admin/

│       │

│       ├── services/

│       │   └── auth.js

│       │

│       ├── App.js

│       └── index.js

│

├── .gitignore

└── README.md

\`\`\`

\> Local database files and uploaded images should remain outside version control. See \`.gitignore\`.

**---**

**## 🛠️ Tech Stack**

\| Layer | Technology |

\| --- | --- |

\| Frontend | React.js |

\| Routing | React Router |

\| Styling | CSS3 |

\| Backend | Node.js |

\| API | Express.js |

\| Database | SQLite |

\| Database Driver | better-sqlite3 |

\| Authentication | JSON Web Tokens (JWT) |

\| Password Security | bcryptjs |

\| File Uploads | Multer |

\| API Communication | REST / HTTP |

\| Version Control | Git / GitHub |

**---**

**## 🏗️ Architecture**

\`\`\`text

                  ┌──────────────────────┐

                  │       React.js       │

                  │      Frontend        │

                  └──────────┬───────────┘

                             │

                        HTTP / REST

                             │

                             ▼

                  ┌──────────────────────┐

                  │      Express.js      │

                  │       Backend       │

                  └──────────┬───────────┘

                             │

              ┌──────────────┼──────────────┐

              │              │              │

              ▼              ▼              ▼

       ┌────────────┐ ┌────────────┐ ┌────────────┐

       │ JWT Auth   │ │   Multer   │ │   REST     │

       │ Middleware │ │ File Upload│ │  Endpoints │

       └────────────┘ └────────────┘ └────────────┘

                             │

                             ▼

                  ┌──────────────────────┐

                  │       SQLite         │

                  │       Database       │

                  └──────────────────────┘

\`\`\`

**---**

**## 🔐 Security**

Security is built into the application's core workflow.

**### JWT Authentication**

Users authenticate through JWT-based login sessions. Protected API endpoints require a valid authentication token.

**### Password Hashing**

Passwords are stored as bcrypt hashes rather than plaintext passwords.

**### Protected Routes**

Sensitive pages and API operations are restricted to authenticated users.

**### Role-Based Authorization**

Administrative functionality is protected using the authenticated user's role.

**### Finder Authorization**

Claim management is restricted to the finder who originally reported the item.

**### Claimant Scoping**

The **\*\*My Claims\*\*** API identifies the claimant from the authenticated JWT rather than accepting an arbitrary user ID from the frontend.

**### Contact Privacy**

Finder contact information is only returned when:

\- The requested claim belongs to the authenticated claimant.

\- The claim has been approved.

This prevents unrelated users from accessing contact details.

**### Controlled Recovery Workflow**

An item is only marked as returned after the associated finder approves a pending claim.

When a claim is approved, other pending claims for that same item are rejected.

**---**

**## 🚀 Getting Started**

**### Prerequisites**

Make sure you have the following installed:

\- Node.js

\- npm

\- Git

**### 1. Clone the Repository**

\`\`\`bash

git clone \<your-repository-url>

cd campus-lost-found

\`\`\`

**### 2. Start the Backend**

Open a terminal:

\`\`\`bash

cd backend

npm install

npm start

\`\`\`

The backend server runs on:

\`\`\`text

http\://localhost:5000

\`\`\`

The application creates the SQLite database and required tables when the backend starts.

**### 3. Start the Frontend**

Open another terminal:

\`\`\`bash

cd frontend

npm install

npm start

\`\`\`

The frontend runs on:

\`\`\`text

http\://localhost:3000

\`\`\`

**---**

**## 🧑‍💻 Usage**

**### 1. Create an Account**

Register using the application and log in with your credentials.

**### 2. Report a Found Item**

Enter **\*\*Finder Mode\*\*** and provide:

\- Item name

\- Category

\- Description

\- Found location

\- Image

\- Verification information

**### 3. Browse Items**

Open **\*\*Browse Items\*\*** to search through reported items.

You can:

\- Search by item name

\- Search descriptions

\- Filter by category

\- View item images

\- Inspect item details

**### 4. Submit a Claim**

If you recognize an item as yours, open the claim page and provide the requested ownership verification details.

**### 5. Track Your Claim**

Open **\*\*My Claims\*\*** to see whether your claim is:

\- Pending

\- Approved

\- Rejected

**### 6. Finder Reviews the Claim**

The student who reported the item reviews the claim and the supplied ownership information.

**### 7. Approve and Share Contact**

If the finder approves the claim, they provide an email address, phone number, or both.

The contact information is then securely available to the approved claimant.

**### 8. Item Recovery**

The approved item is marked as returned and appears in the **\*\*Recovered Items\*\*** section.

**---**

**## 🌐 API Overview**

The backend exposes REST endpoints for authentication, item management, claims, recovery, statistics, and administrative operations.

Important endpoints include:

\| Method | Endpoint | Purpose |

\| --- | --- | --- |

\| POST | \`/api/register\` | Register a user |

\| POST | \`/api/login\` | Authenticate a user |

\| GET | \`/api/me\` | Get authenticated user information |

\| GET | \`/api/items\` | Get authenticated item data |

\| POST | \`/api/items\` | Report a found item |

\| GET | \`/api/public-items\` | Get public recent items |

\| GET | \`/api/returned-items\` | Get recovered items |

\| POST | \`/api/claims\` | Submit a claim |

\| GET | \`/api/claims\` | Get finder-side claims |

\| GET | \`/api/my-claims\` | Get the authenticated user's claims |

\| GET | \`/api/my-claims/\:id/contact\` | Get contact for an approved own claim |

\| POST | \`/api/claims/\:id/approve\` | Approve a claim and share contact |

\| POST | \`/api/claims/\:id/reject\` | Reject a claim |

\| GET | \`/api/stats\` | Get platform statistics |

**---**

**## 👑 Making a User an Admin**

Newly registered users are created with the default role:

\`\`\`text

user

\`\`\`

To make a user an administrator, update the user's \`role\` directly in the local SQLite database.

**### Step 1 — Register the User**

First, create the user normally through the **\*\*Register\*\*** page.

For example:

\`\`\`text

User ID: admin1

Password: \*\*\*\*\*\*\*\*

\`\`\`

**### Step 2 — Open the SQLite Database**

Stop the backend if it is currently running, then open:

\`\`\`text

backend/campus_lnf.db

\`\`\`

You can use a SQLite database viewer such as **\*\*DB Browser for SQLite\*\***, or the SQLite command-line interface.

**### Step 3 — Change the User Role**

Run:

\`\`\`sql

UPDATE users

SET role = 'admin'

WHERE user_id = 'admin1';

\`\`\`

Replace \`admin1\` with the actual user's \`user_id\`.

You can verify the change with:

\`\`\`sql

SELECT id, user_id, role

FROM users

WHERE user_id = 'admin1';

\`\`\`

The result should show:

\`\`\`text

role = admin

\`\`\`

**### Step 4 — Restart the Backend**

Start the backend again:

\`\`\`bash

cd backend

npm start

\`\`\`

**### Step 5 — Log Out and Log In Again**

The user's role is included in the JWT when they log in. Therefore, after changing the database role, the user should **\*\*log out and log in again\*\*** so a new token containing:

\`\`\`text

role: "admin"

\`\`\`

is issued.

**### Step 6 — Access the Admin Panel**

After logging in again, the user will have access to the **\*\*Admin Panel\*\*** from the dashboard.

The application checks the user's role on protected admin routes, so simply navigating to \`/admin\` is not enough for a normal user to gain administrative access.

\> **\*\*Important:\*\*** The database file is local development data and should not be committed to GitHub. The project's \`.gitignore\` excludes \`\*.db\` files.

**## 📂 Main Pages**

\| Page | Purpose |

\| --- | --- |

\| Landing Page | Introduction, platform statistics, recent items, features, FAQ |

\| Login | User authentication |

\| Register | New user registration |

\| Dashboard | Platform statistics and navigation |

\| Finder Mode | Report found items |

\| Loser Mode | Browse and search found items |

\| Claim Page | Submit an ownership claim |

\| My Claims | Track submitted claim statuses |

\| Review Claims | Finder-side claim management |

\| Returned Items | View recovered items |

\| Admin Panel | Protected administrative functionality |

**---**

**## 🎨 UI & UX**

The application includes a reusable component-based interface with:

\- Responsive landing page

\- Glassmorphism-style cards

\- Gradient visual system

\- Toast notifications

\- Confirmation modals

\- Approval/contact modal

\- Reusable back navigation

\- Loading states

\- Empty states

\- Responsive item grids

\- Image previews

\- Protected navigation

The landing page displays a limited number of recent items using the backend's public-items endpoint rather than loading the entire item collection.

**---**

**## 📁 Local Data & Git**

The project uses local SQLite storage and local uploaded images during development.

These should **not be committed to GitHub**.

The \`.gitignore\` should exclude:

\`\`\`gitignore

node_modules/

frontend/node_modules/

backend/node_modules/

\*.db

\*.db-shm

\*.db-wal

.env

uploads/\*

backend/uploads/\*

\`\`\`

This keeps local users, claims, item records, contact records, and uploaded images out of version control.

**---**

**## 🔮 Future Enhancements**

Potential future improvements include:

\- 📧 Email notifications

\- 🔔 Real-time claim notifications

\- 🔍 Advanced search and filtering

\- 👤 User profiles

\- 🤖 AI-assisted ownership verification

\- 📈 Campus-wide analytics

\- 📍 Interactive campus maps

\- 📱 Progressive Web App support

\- 🖼️ AI-powered image similarity matching

\- 🏷️ Automatic item categorization

\- 📊 Recovery-rate analytics

\- 📱 Mobile application

**---**

**## 🎯 Project Goals**

The main goals of Campus Lost & Found are to:

\- Create a centralized campus lost-and-found system

\- Make reporting found items simple

\- Make searching for lost belongings faster

\- Reduce fraudulent ownership claims

\- Provide a structured verification process

\- Give finders control over claim approval

\- Protect claimant and finder information

\- Provide secure contact sharing after approval

\- Maintain a record of successfully recovered items

**---**

**## 📌 Future Vision**

The long-term vision is to turn Campus Lost & Found into an **\*\*intelligent campus recovery platform\*\***.

With AI-powered image matching, smart item categorization, automated notifications, and campus analytics, the platform could reduce the time required to reunite students with their belongings while improving the reliability of the recovery process.

**---**

**## 👥 Project**

**\*\*Campus Lost & Found\*\***

A full-stack web application built to make recovering lost belongings on campus **\*\*faster, safer, and more organized\*\***.

**---**

**## ⭐ If You Like This Project**

If you find this project useful or interesting, consider giving the repository a ⭐ on GitHub.