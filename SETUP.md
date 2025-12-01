# Airtable Form Builder - Complete Documentation

A full-stack MERN application that enables users to create dynamic forms using Airtable data with conditional logic, real-time synchronization, and comprehensive response management.

## 🎯 Project Overview

This application allows users to:
- Authenticate via Airtable OAuth 2.0 or Personal Access Tokens
- Create custom forms from any Airtable base and table
- Apply conditional logic to show/hide questions dynamically
- Submit responses that sync to both Airtable and MongoDB
- View and manage all form submissions
- Automatically sync data when Airtable records change via webhooks

## 🚀 Live Demo

- **Frontend:** [Deployed on Vercel/Netlify]
- **Backend API:** [Deployed on Render/Railway]

## 📹 Demo Video

[Link to demo video or screenshots]

---

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Airtable API** integration
- **JWT** for authentication
- **Axios** for HTTP requests

### Frontend
- **React 18** with Hooks
- **Vite** for build tooling
- **React Router v6** for navigation
- **Axios** for API calls
- **CSS3** for responsive styling

---


## 📁 Project Structure

```
airtable-form-builder/
├── backend/
│   ├── src/
│   │   ├── config/         # Database & Airtable config
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # API routes
│   │   ├── controllers/    # Route handlers
│   │   ├── services/       # Business logic
│   │   ├── middleware/     # Auth & validation
│   │   └── server.js       # Entry point
│   ├── package.json
│   ├── .env               # Environment variables
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── services/      # API & logic services
│   │   ├── context/       # Auth context
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── package.json
│   ├── vite.config.js
│   ├── .env              # Environment variables
│   └── index.html
│
└── README.md
```

## 🔧 Available Scripts

### Backend
- `npm run start` - Run production server
- `npm run dev` - Run development server with auto-reload (nodemon)

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🌐 API Endpoints

- **Auth**: `/api/auth/*`
- **Forms**: `/api/forms/*`
- **Responses**: `/api/responses/*`
- **Webhooks**: `/api/webhooks/*`

## 🔐 Environment Variables Reference
---

## ⚙️ Installation & Setup

### Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account or local MongoDB
- Airtable account
- Git

### 1. Clone Repository
```bash