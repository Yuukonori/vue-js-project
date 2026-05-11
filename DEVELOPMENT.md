# Development Guide

## 📋 Table of Contents
- [Getting Started](#getting-started)
- [Code Structure](#code-structure)
- [Backend Development](#backend-development)
- [Frontend Development](#frontend-development)
- [Database Management](#database-management)
- [Best Practices](#best-practices)

## 🚀 Getting Started

### Quick Start
```bash
# 1. Install all dependencies
cd backend && npm install
cd ../frontend && npm install

# 2. Configure environment
cp backend/.env.example backend/.env
# Edit backend/.env with your database credentials

# 3. Start development servers
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

## 🏗️ Code Structure

### Backend Organization

```
backend/
├── routes/              # API route handlers
│   ├── auth.routes.js   # Authentication (login, verify, refresh)
│   ├── users.routes.js  # User CRUD operations
│   ├── assets.routes.js # Asset management
│   ├── tickets.routes.js # Repair ticket management
│   └── misc.routes.js   # Activity feed, policies, etc.
├── utils/               # Shared utilities
│   ├── auth.js          # JWT helpers & middleware
│   └── database.js      # DB connection & helpers
├── server.js            # Main server entry point
└── schema.sql           # Database schema
```

### Frontend Organization

```
frontend/src/
├── components/          # Reusable Vue components
│   └── auth/            # Login, logo, feature items
├── pages/               # Page-level components
│   ├── dashboard.js     # Dashboard page
│   ├── assets.js        # Asset management page
│   ├── support.js       # Support ticket page
│   ├── form/            # Form pages
│   └── aut/             # Auth pages
├── ui/                  # UI builder components
├── utils/               # Frontend utilities
│   └── auth.js          # Auth helpers (token, user)
├── App.vue              # Main app component
├── main.js              # App entry point
└── menu.js              # Navigation configuration
```

## 🔧 Backend Development

### Adding a New Route

1. **Create route file** in `backend/routes/`
   ```javascript
   // backend/routes/example.routes.js
   const express = require("express");
   const { pool } = require("../utils/database");
   const { authenticateToken } = require("../utils/auth");
   
   const router = express.Router();
   
   // Protected route example
   router.get("/protected", authenticateToken, async (req, res) => {
     // req.user contains JWT payload
     res.json({ user: req.user });
   });
   
   module.exports = router;
   ```

2. **Register route** in `backend/server.js`
   ```javascript
   const exampleRoutes = require("./routes/example.routes");
   app.use("/api/example", exampleRoutes);
   ```

### Database Queries

Always use parameterized queries to prevent SQL injection:

```javascript
// ✅ GOOD - Parameterized query
const result = await pool.query(
  "SELECT * FROM users WHERE email = $1",
  [email]
);

// ❌ BAD - String concatenation (SQL injection risk)
const result = await pool.query(
  `SELECT * FROM users WHERE email = '${email}'`
);
```

### Authentication Middleware

```javascript
const { authenticateToken, optionalAuth } = require("../utils/auth");

// Require authentication
router.get("/protected", authenticateToken, (req, res) => {
  // req.user is available
});

// Optional authentication
router.get("/public", optionalAuth, (req, res) => {
  // req.user may or may not be available
});
```

## 🎨 Frontend Development

### Adding a New Page

1. **Create page component** in `frontend/src/pages/`
   ```javascript
   // frontend/src/pages/example.js
   import { h } from 'vue';
   
   export function ExamplePage(user) {
     return {
       setup() {
         return () => h('div', [
           h('h1', 'Example Page'),
           h('p', `Welcome, ${user.name}!`)
         ]);
       }
     };
   }
   ```

2. **Register in menu** in `frontend/src/menu.js`
   ```javascript
   import { ExamplePage } from './pages/example.js';
   
   export const MENU_CONFIG = {
     items: [
       // ... existing items
       {
         label: 'Example',
         icon: 'example-icon',
         path: '/example',
         content: (user) => ExamplePage(user),
       }
     ]
   };
   ```

### Making API Calls

Use the `authFetch` utility for authenticated requests:

```javascript
import { authFetch } from './utils/auth.js';

// Authenticated request
const response = await authFetch('/api/users', {
  method: 'GET'
});

if (response.ok) {
  const data = await response.json();
  console.log(data);
}
```

### Authentication Utilities

```javascript
import { authUtils } from './utils/auth.js';

// Store token and user
authUtils.setToken(token);
authUtils.setUser(userData);

// Get stored data
const token = authUtils.getToken();
const user = authUtils.getUser();

// Clear authentication
authUtils.clearAuth();
```

## 🗄️ Database Management

### Schema Updates

1. **Modify** `backend/schema.sql` for new tables
2. **Add migration logic** in `backend/utils/database.js` → `bootstrapDatabase()`
3. **Test** by restarting the server

### Common Patterns

```javascript
// Sync user asset counts after inventory changes
const { syncUserAssetCounts } = require("../utils/database");
await syncUserAssetCounts();

// Add activity feed entry
await pool.query(
  "INSERT INTO activity_feed (type, title, description, time_label) VALUES ($1, $2, $3, $4)",
  ["update", "Title", "Description", "Just now"]
);
```

## ✅ Best Practices

### Backend

1. **Always use parameterized queries** - Prevent SQL injection
2. **Validate input** - Check required fields and types
3. **Handle errors** - Use try-catch and return appropriate status codes
4. **Log important events** - Use console.log for debugging
5. **Use middleware** - Reuse authentication and validation logic

### Frontend

1. **Component composition** - Break down complex UIs into smaller components
2. **Reactive data** - Use Vue's ref() and computed() for reactive state
3. **Error handling** - Show user-friendly error messages
4. **Loading states** - Indicate when data is being fetched
5. **Validation** - Validate forms before submission

### Security

1. **Never commit secrets** - Use .env files (already in .gitignore)
2. **Hash passwords** - Always use bcrypt for password storage
3. **Validate tokens** - Use authenticateToken middleware for protected routes
4. **Sanitize input** - Validate and sanitize all user input
5. **HTTPS in production** - Always use HTTPS in production environments

### Code Style

1. **Consistent naming** - Use camelCase for variables, PascalCase for components
2. **Comments** - Document complex logic and API endpoints
3. **File organization** - Keep related code together
4. **Error messages** - Provide clear, actionable error messages
5. **Code formatting** - Use consistent indentation and spacing

## 🐛 Debugging

### Backend Debugging

```bash
# View server logs
cd backend
npm run dev

# Check database connection
# Look for "✓ Database connected" message

# Test API endpoint
curl http://localhost:5000/api/test
```

### Frontend Debugging

```bash
# View browser console
# Open DevTools (F12) → Console tab

# Check network requests
# Open DevTools (F12) → Network tab

# Vue DevTools
# Install Vue DevTools browser extension
```

### Common Issues

**Database connection fails**
- Check PostgreSQL is running
- Verify credentials in .env file
- Ensure database exists

**JWT token expired**
- Token expires after 1 hour by default
- Use refresh endpoint or re-login

**CORS errors**
- Backend has CORS enabled by default
- Check frontend is making requests to correct URL

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Vue 3 Documentation](https://vuejs.org/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [JWT Introduction](https://jwt.io/introduction)
- [Vite Documentation](https://vitejs.dev/)

## 🤝 Need Help?

Contact the development team or check the main README.md for more information.
