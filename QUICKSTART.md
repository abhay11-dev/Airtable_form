# 🚀 Quick Start Guide

> Get the project running in 5 minutes

## Step 1: Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend (in another terminal)
cd ../frontend
npm install
```

## Step 2: Setup Environment

Create `.env` files in both folders:

**backend/.env:**
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/airtable-forms
AIRTABLE_CLIENT_ID=your_id
AIRTABLE_CLIENT_SECRET=your_secret
AIRTABLE_REDIRECT_URI=http://localhost:5000/api/auth/callback
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:5173
WEBHOOK_SECRET=your_webhook_secret
```

**frontend/.env:**
```
VITE_API_URL=http://localhost:5000/api
VITE_APP_URL=http://localhost:5173
```

## Step 3: Start MongoDB

```bash
# Windows
mongod

# Or use MongoDB Atlas (update MONGODB_URI)
```

## Step 4: Run Backend

```bash
cd backend
npm run dev
```

✅ Should see: `Server running on port 5000`

## Step 5: Run Frontend

```bash
cd frontend
npm run dev
```

✅ Should see: `http://localhost:5173/`

## Step 6: Visit Browser

Open: **http://localhost:5173**

---

## 🎯 What You'll See

- **Login Page** → Click "Login with Airtable"
- **OAuth** → Authorize access
- **Dashboard** → View your forms
- **Form Builder** → Create new forms
- **Form Viewer** → Fill and submit forms
- **Response List** → View submissions

---

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| Port 5000 in use | Change `PORT` in `.env` |
| MongoDB error | Start `mongod` or update `MONGODB_URI` |
| CORS error | Verify `FRONTEND_URL` in backend `.env` |
| Module not found | Run `npm install` |
| OAuth error | Check `AIRTABLE_CLIENT_ID` and `REDIRECT_URI` |

---

## 📚 Full Documentation

- **README.md** - Complete project documentation
- **SETUP.md** - Detailed setup guide
- **SUBMISSION.md** - Deployment and submission guide

---

**Everything working?** You're all set! 🎉
