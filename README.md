# 🎨 Airtable Form Builder

> A full-stack MERN application that transforms Airtable data into dynamic, interactive forms with conditional logic, real-time synchronization, and comprehensive response management.

![Status](https://img.shields.io/badge/status-active-success?style=flat-square)
![Node](https://img.shields.io/badge/node-18%2B-green?style=flat-square)
![React](https://img.shields.io/badge/react-18-blue?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Key Features & Implementation](#key-features--implementation)
- [Authentication](#authentication)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [Author](#author)

---

## ✨ Features

### Core Functionality
✅ **User Authentication** - Secure OAuth 2.0 login with Airtable  
✅ **Dynamic Form Creation** - Build forms from any Airtable base and table  
✅ **Conditional Logic** - Show/hide fields based on user input  
✅ **Real-time Sync** - Forms automatically reflect changes in Airtable  
✅ **Response Management** - Collect and track all form submissions  
✅ **Webhook Integration** - Real-time updates via Airtable webhooks  
✅ **JWT Authentication** - Secure token-based API access  
✅ **Responsive Design** - Works on desktop, tablet, and mobile  

### Technical Highlights
- 🔐 Secure OAuth 2.0 implementation
- 💾 MongoDB persistence
- 🔄 RESTful API design
- 📱 Mobile-responsive UI
- ⚡ Fast development with Vite
- 🎯 Protected routes & middleware
- 📊 Form validation & error handling

---

## 🛠️ Tech Stack

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | 18+ | JavaScript runtime |
| Express.js | ^4.18 | Web framework |
| MongoDB | Atlas | NoSQL database |
| Mongoose | ^8.0 | ODM for MongoDB |
| JWT | ^9.0 | Authentication tokens |
| Axios | ^1.6 | HTTP client |
| Airtable API | v0 | Form data integration |

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | ^18.2 | UI library |
| Vite | ^5.0 | Build tool & dev server |
| React Router | ^6.21 | Client-side routing |
| Axios | ^1.6 | API communication |
| CSS3 | Native | Styling & responsiveness |

---

## 📁 Project Structure

```
airtable-form-builder/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js         # MongoDB connection
│   │   │   ├── airtable.js         # Airtable API config
│   │   │   └── constants.js        # App constants
│   │   ├── models/
│   │   │   ├── User.js             # User schema
│   │   │   ├── Form.js             # Form schema
│   │   │   └── Response.js         # Response schema
│   │   ├── routes/
│   │   │   ├── auth.routes.js      # Authentication routes
│   │   │   ├── form.routes.js      # Form CRUD routes
│   │   │   ├── response.routes.js  # Response routes
│   │   │   └── webhook.routes.js   # Webhook routes
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── form.controller.js
│   │   │   ├── response.controller.js
│   │   │   └── webhook.controller.js
│   │   ├── services/
│   │   │   ├── airtable.service.js # Airtable API calls
│   │   │   └── conditionalLogic.service.js
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js   # JWT verification
│   │   │   └── validation.middleware.js
│   │   └── server.js                # Express app setup
│   ├── .env
│   ├── package.json
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── AuthSuccess.jsx
│   │   │   ├── FormBuilder/
│   │   │   │   ├── FormBuilder.jsx
│   │   │   │   ├── FieldSelector.jsx
│   │   │   │   └── ConditionalLogic.jsx
│   │   │   ├── FormViewer/
│   │   │   │   ├── FormViewer.jsx
│   │   │   │   └── FormField.jsx
│   │   │   ├── Responses/
│   │   │   │   └── ResponseList.jsx
│   │   │   ├── Dashboard/
│   │   │   │   └── Dashboard.jsx
│   │   │   └── Navbar.jsx
│   │   ├── services/
│   │   │   ├── api.js              # Axios instance & endpoints
│   │   │   └── conditionalLogic.js
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # Auth state management
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
├── SETUP.md                         # Detailed setup guide
└── README.md                        # This file
```

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have:
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)
- **MongoDB Atlas** account ([Create Free](https://www.mongodb.com/cloud/atlas))
- **Airtable** account ([Create Free](https://airtable.com/))
- **Git** (optional)

### Installation Steps

#### 1️⃣ Clone or Download the Project

```bash
cd "your/path/to/assignment"
# Navigate to the project folder
```

#### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

#### 3️⃣ Frontend Setup

```bash
cd ../frontend
npm install
```

#### 4️⃣ Configure Environment Variables

**Backend** (`backend/.env`):
```dotenv
PORT=5000
NODE_ENV=development

MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/airtable-forms

AIRTABLE_CLIENT_ID=your_airtable_client_id
AIRTABLE_CLIENT_SECRET=your_airtable_client_secret
AIRTABLE_REDIRECT_URI=http://localhost:5000/api/auth/callback

JWT_SECRET=your_super_secret_jwt_key

FRONTEND_URL=http://localhost:5173

WEBHOOK_SECRET=your_webhook_secret
```

**Frontend** (`frontend/.env`):
```dotenv
VITE_API_URL=http://localhost:5000/api
VITE_APP_URL=http://localhost:5173
```

#### 5️⃣ Start MongoDB

If using local MongoDB:
```bash
mongod
```

Or use MongoDB Atlas by updating the `MONGODB_URI` in `backend/.env`.

#### 6️⃣ Run Backend (Terminal 1)

```bash
cd backend
npm run dev
```

**Expected output:**
```
Server running on port 5000
MongoDB Connected: localhost
```

#### 7️⃣ Run Frontend (Terminal 2)

```bash
cd frontend
npm run dev
```

**Expected output:**
```
➜  Local:   http://localhost:5173/
```

### ✅ Verification

Visit `http://localhost:5173` in your browser. You should see the login page.

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/auth/auth-url` | Get OAuth authorization URL |
| GET | `/api/auth/callback` | OAuth callback (handled by Airtable) |
| GET | `/api/auth/me` | Get current user (protected) |

### Forms
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/forms/bases` | List all Airtable bases |
| GET | `/api/forms/bases/:baseId/tables` | List tables in base |
| GET | `/api/forms/bases/:baseId/tables/:tableId/fields` | List fields in table |
| POST | `/api/forms` | Create new form |
| GET | `/api/forms` | Get all user forms |
| GET | `/api/forms/:formId` | Get specific form |
| DELETE | `/api/forms/:formId` | Delete form |

### Responses
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/responses/:formId` | Submit form response |
| GET | `/api/responses/:formId` | Get responses for form |
| GET | `/api/responses/detail/:responseId` | Get specific response |

### Webhooks
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/webhooks/airtable` | Airtable webhook receiver |

---

## 💾 Database Schema

### User Model
```javascript
{
  airtableUserId: String,        // Unique Airtable user ID
  email: String,
  accessToken: String,           // OAuth access token
  refreshToken: String,
  tokenExpiresAt: Date,
  profile: Object,               // Airtable user info
  loginTimestamp: Date
}
```

### Form Model
```javascript
{
  userId: ObjectId,              // Reference to User
  formName: String,
  description: String,
  airtableBaseId: String,
  airtableTableId: String,
  fields: [{
    fieldId: String,
    fieldName: String,
    fieldType: String,
    required: Boolean,
    conditionalLogic: [{
      condition: String,
      action: String
    }]
  }],
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Response Model
```javascript
{
  formId: ObjectId,              // Reference to Form
  userId: ObjectId,
  airtableRecordId: String,
  formData: Object,              // User responses
  status: String,                // 'submitted', 'synced'
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔑 Key Features & Implementation

### 1. **Authentication (OAuth 2.0)**

Users authenticate via Airtable OAuth:
- Click "Login with Airtable"
- Airtable redirects to authorization page
- User grants permissions
- Backend exchanges code for access token
- User data stored in MongoDB
- JWT token issued for API access

**Files:**
- `backend/src/controllers/auth.controller.js`
- `backend/src/services/airtable.service.js`
- `frontend/src/components/Auth/Login.jsx`

### 2. **Dynamic Form Builder**

Users create forms from Airtable data:
- Select any Airtable base
- Choose table and fields
- Customize field properties
- Add conditional logic rules

**Files:**
- `frontend/src/components/FormBuilder/FormBuilder.jsx`
- `frontend/src/components/FormBuilder/FieldSelector.jsx`
- `frontend/src/components/FormBuilder/ConditionalLogic.jsx`

### 3. **Conditional Logic**

Show/hide fields based on user input:
```javascript
// Example: Show field2 if field1 equals "yes"
{
  triggerField: "field1",
  condition: "equals",
  value: "yes",
  action: "show",
  targetField: "field2"
}
```

**Files:**
- `frontend/src/services/conditionalLogic.js`
- `backend/src/services/conditionalLogic.service.js`

### 4. **Form Submission & Sync**

Responses saved to both MongoDB and Airtable:
- Validate form data
- Create Airtable record
- Save to MongoDB
- Webhook notification when Airtable changes

**Files:**
- `backend/src/controllers/response.controller.js`
- `backend/src/routes/webhook.routes.js`

### 5. **Real-time Updates**

Webhook integration for live data synchronization:
- Airtable sends updates via webhooks
- Backend processes changes
- Frontend reflects updates

---

## 🔐 Authentication

### OAuth Flow

```
User Login
    ↓
Frontend → Backend (/api/auth/auth-url)
    ↓
Backend generates OAuth URL
    ↓
User redirected to Airtable
    ↓
User grants permissions
    ↓
Airtable redirects to /api/auth/callback
    ↓
Backend exchanges code for token
    ↓
User stored in MongoDB
    ↓
JWT token issued
    ↓
Frontend stores token, redirected to dashboard
```

### JWT Token

- Issued on successful login
- Expires in 7 days
- Sent in `Authorization: Bearer <token>` header
- Verified by `auth.middleware.js`

### Protected Routes

All routes except login require valid JWT token:
- Dashboard (protected)
- Form Builder (protected)
- Form Viewer (public - but requires form ID)
- Responses (protected)

---

## 🐛 Troubleshooting

### Common Issues

#### MongoDB Connection Error
**Problem:** `MongoNetworkError: connect ECONNREFUSED`

**Solutions:**
1. Start MongoDB: `mongod`
2. Or update `MONGODB_URI` with Atlas credentials
3. Check internet connection (for Atlas)

#### Port Already in Use
**Problem:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solution:** Change `PORT` in `backend/.env` or kill process using port 5000

#### CORS Errors
**Problem:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:** Verify `FRONTEND_URL` in `backend/.env` matches your frontend URL

#### OAuth Redirect Error
**Problem:** "You are being redirected... failed to properly construct a request"

**Solutions:**
1. Verify `AIRTABLE_REDIRECT_URI` matches Airtable OAuth settings
2. Check `AIRTABLE_CLIENT_ID` and `CLIENT_SECRET` are correct
3. Test directly: `http://localhost:5000/api/auth/auth-url`

#### Module Not Found
**Problem:** `Error: Cannot find module 'express'`

**Solution:** Run `npm install` in the relevant directory

See **SETUP.md** for detailed troubleshooting guide.

---

## 📝 Available Scripts

### Backend
```bash
npm run start    # Production server
npm run dev      # Development with auto-reload
```

### Frontend
```bash
npm run dev      # Development server
npm run build    # Build for production
npm run preview  # Preview production build
```

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---
