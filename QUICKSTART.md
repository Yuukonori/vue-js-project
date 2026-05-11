# 🚀 Quick Start Guide

Get the BuilderUI Management System running in 5 minutes!

## Prerequisites

- ✅ Node.js v16+ installed
- ✅ PostgreSQL v12+ installed and running
- ✅ Git installed

## Step-by-Step Setup

### 1️⃣ Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2️⃣ Configure Database

**Option A: Use Default Settings**
```bash
# Create database with default credentials
createdb n8n_db

# Default credentials (already configured):
# - Host: localhost
# - Port: 5432
# - Database: n8n_db
# - User: admin
# - Password: admin@879433
```

**Option B: Use Custom Settings**
```bash
# Copy environment template
cp backend/.env.example backend/.env

# Edit backend/.env with your settings
nano backend/.env
```

### 3️⃣ Start the Application

**Terminal 1 - Backend Server**
```bash
cd backend
npm run dev
```

You should see:
```
============================================================
  BuilderUI Management System - Backend Server
============================================================
  ✓ Server running on http://localhost:5000
  ✓ Database connected
  ✓ API endpoints ready
============================================================
```

**Terminal 2 - Frontend Dev Server**
```bash
cd frontend
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### 4️⃣ Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

### 5️⃣ Login

Use one of the default accounts:

**Administrator Account**
- Email: `nasaaaxd@gmail.com`
- Password: `Ruki@123`
- Role: Administrator
- Department: IT

**Staff Account**
- Email: `riotsukasaaa@gmail.com`
- Password: `Rio@123`
- Role: Staff
- Department: Finance

## 🎉 You're Ready!

The application is now running. You can:

- ✅ View the dashboard
- ✅ Manage assets
- ✅ Create support tickets
- ✅ Manage users (Admin only)
- ✅ Configure access control (Admin only)

## 🔧 Troubleshooting

### Database Connection Error

**Problem:** `Error: connect ECONNREFUSED`

**Solution:**
1. Check PostgreSQL is running: `pg_isready`
2. Verify database exists: `psql -l | grep n8n_db`
3. Check credentials in `backend/.env`

### Port Already in Use

**Problem:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solution:**
```bash
# Stop the process using port 5000
cd backend
npm run stop

# Or manually kill the process
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

### Frontend Build Error

**Problem:** `Error: Cannot find module 'vue'`

**Solution:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### JWT Token Expired

**Problem:** "Invalid or expired token" error

**Solution:**
- Tokens expire after 1 hour
- Simply log out and log back in
- Or use the refresh token endpoint

## 📚 Next Steps

- 📖 Read [README.md](README.md) for full documentation
- 👨‍💻 Check [DEVELOPMENT.md](DEVELOPMENT.md) for development guide
- 🧹 See [CLEANUP_SUMMARY.md](CLEANUP_SUMMARY.md) for project organization

## 🆘 Need Help?

- Check the [DEVELOPMENT.md](DEVELOPMENT.md) debugging section
- Review API documentation in [README.md](README.md)
- Contact the development team

## 🎯 Common Tasks

### Create a New User
1. Login as Administrator
2. Navigate to "Users" page
3. Click "Add User" button
4. Fill in the form and submit

### Submit a Support Ticket
1. Login with any account
2. Navigate to "Support" page
3. Click "New Ticket" button
4. Fill in details and submit

### Manage Assets
1. Login as Administrator or IT staff
2. Navigate to "Assets" page
3. Add, edit, or delete assets
4. Assign assets to users

### Configure Access Control
1. Login as Administrator
2. Navigate to "Access Control" page
3. Select department
4. Configure allowed pages and features

---

**Happy coding! 🚀**
