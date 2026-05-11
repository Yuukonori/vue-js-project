# 📁 Project Structure Overview

## Directory Tree

```
BuilderUI-Management-System/
│
├── 📄 README.md                    # Main project documentation
├── 📄 QUICKSTART.md                # 5-minute setup guide
├── 📄 DEVELOPMENT.md               # Developer guide & best practices
├── 📄 CLEANUP_SUMMARY.md           # Cleanup details
├── 📄 PROJECT_STRUCTURE.md         # This file
├── 📄 JWT_IMPLEMENTATION_SUMMARY.md # JWT implementation details
├── 📄 .gitignore                   # Git ignore patterns
├── 📄 package.json                 # Root package.json
│
├── 📂 backend/                     # Backend API Server
│   │
│   ├── 📂 routes/                  # API Route Handlers
│   │   ├── 📄 auth.routes.js       # 🔐 Authentication (login, verify, refresh)
│   │   ├── 📄 users.routes.js      # 👥 User CRUD operations
│   │   ├── 📄 assets.routes.js     # 💼 Asset management
│   │   ├── 📄 tickets.routes.js    # 🎫 Repair ticket management
│   │   └── 📄 misc.routes.js       # 📊 Activity, maintenance, policies
│   │
│   ├── 📂 utils/                   # Utility Modules
│   │   ├── 📄 auth.js              # 🔑 JWT utilities & middleware
│   │   └── 📄 database.js          # 🗄️ Database connection & helpers
│   │
│   ├── 📄 server.js                # 🚀 Main server entry point
│   ├── 📄 schema.sql               # 📋 Database schema
│   ├── 📄 .env.example             # ⚙️ Environment variables template
│   ├── 📄 package.json             # Backend dependencies
│   └── 📄 package-lock.json        # Dependency lock file
│
├── 📂 frontend/                    # Frontend Vue.js Application
│   │
│   ├── 📂 src/                     # Source files
│   │   │
│   │   ├── 📂 components/          # Reusable Vue Components
│   │   │   └── 📂 auth/            # Authentication components
│   │   │       ├── 📄 AppLogo.vue
│   │   │       ├── 📄 FeatureItem.vue
│   │   │       └── 📄 LoginCard.vue
│   │   │
│   │   ├── 📂 pages/               # Page Components
│   │   │   ├── 📂 form/            # Form pages
│   │   │   │   ├── 📄 AssetForm.js
│   │   │   │   ├── 📄 newAssetsForm.js
│   │   │   │   └── 📄 userForm.js
│   │   │   ├── 📂 aut/             # Auth pages
│   │   │   │   ├── 📄 login.js
│   │   │   │   └── 📄 forgotPassword.js
│   │   │   ├── 📄 dashboard.js
│   │   │   ├── 📄 dashboardFuturistic.js
│   │   │   ├── 📄 assets.js
│   │   │   ├── 📄 support.js
│   │   │   ├── 📄 repairhistory.js
│   │   │   ├── 📄 monitoring.js
│   │   │   ├── 📄 activitylog.js
│   │   │   ├── 📄 adminUsers.js
│   │   │   ├── 📄 cases.js
│   │   │   ├── 📄 userProfile.js
│   │   │   ├── 📄 accessControl.js
│   │   │   ├── 📄 FuturisticSidebar.vue
│   │   │   └── 📄 FuturisticPageWrapper.vue
│   │   │
│   │   ├── 📂 ui/                  # UI Builder Components
│   │   │   ├── 📂 builders/
│   │   │   ├── 📄 index.js
│   │   │   ├── 📄 ThemesColors.js
│   │   │   └── 📄 utils.js
│   │   │
│   │   ├── 📂 utils/               # Frontend Utilities
│   │   │   └── 📄 auth.js          # Auth helpers (token, user)
│   │   │
│   │   ├── 📂 data/                # Static Data
│   │   │   └── 📄 users.js
│   │   │
│   │   ├── 📄 App.vue              # Main app component
│   │   ├── 📄 main.js              # App entry point
│   │   ├── 📄 menu.js              # Navigation configuration
│   │   ├── 📄 lastUpdate.js        # Time formatting utility
│   │   └── 📄 tailwind.css         # Tailwind styles
│   │
│   ├── 📂 dist/                    # Build output (generated)
│   ├── 📄 index.html               # HTML template
│   ├── 📄 vite.config.js           # Vite configuration
│   ├── 📄 tailwind.config.js       # Tailwind configuration
│   ├── 📄 postcss.config.js        # PostCSS configuration
│   ├── 📄 .env.example             # Frontend env template
│   ├── 📄 package.json             # Frontend dependencies
│   └── 📄 package-lock.json        # Dependency lock file
│
└── 📂 .git/                        # Git repository data

```

## 🎯 Key Directories Explained

### Backend (`/backend`)

#### Routes (`/backend/routes`)
Organized by feature domain. Each route file handles a specific area of functionality:

- **auth.routes.js** - User authentication and token management
- **users.routes.js** - User account CRUD operations
- **assets.routes.js** - Inventory and asset management
- **tickets.routes.js** - Support ticket system
- **misc.routes.js** - Activity feed, maintenance, access policies

#### Utils (`/backend/utils`)
Shared utilities used across the application:

- **auth.js** - JWT token generation, verification, middleware
- **database.js** - PostgreSQL connection pool, bootstrap, helpers

### Frontend (`/frontend/src`)

#### Components (`/frontend/src/components`)
Reusable Vue components that can be used across multiple pages:

- **auth/** - Login card, logo, feature items

#### Pages (`/frontend/src/pages`)
Page-level components representing full screens:

- **form/** - Form pages for creating/editing entities
- **aut/** - Authentication pages (login, forgot password)
- Main pages: dashboard, assets, support, etc.

#### UI (`/frontend/src/ui`)
UI builder system for creating dynamic interfaces:

- **builders/** - Component builders
- Theme and color utilities

#### Utils (`/frontend/src/utils`)
Frontend utility functions:

- **auth.js** - Token storage, user management, authenticated fetch

## 🔄 Data Flow

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       │ HTTP Request
       ▼
┌─────────────────────────────────────┐
│         Frontend (Vue 3)            │
│  ┌──────────────────────────────┐  │
│  │        App.vue               │  │
│  │  ┌────────────────────────┐ │  │
│  │  │   Pages (dashboard,    │ │  │
│  │  │   assets, support)     │ │  │
│  │  └────────────────────────┘ │  │
│  │  ┌────────────────────────┐ │  │
│  │  │   Components (auth,    │ │  │
│  │  │   forms, UI builders)  │ │  │
│  │  └────────────────────────┘ │  │
│  └──────────────────────────────┘  │
└──────────────┬──────────────────────┘
               │
               │ API Call (authFetch)
               ▼
┌─────────────────────────────────────┐
│      Backend (Express.js)           │
│  ┌──────────────────────────────┐  │
│  │       server.js              │  │
│  │  ┌────────────────────────┐ │  │
│  │  │   Middleware           │ │  │
│  │  │   (CORS, JSON, Auth)   │ │  │
│  │  └────────────────────────┘ │  │
│  │  ┌────────────────────────┐ │  │
│  │  │   Routes               │ │  │
│  │  │   (auth, users,        │ │  │
│  │  │    assets, tickets)    │ │  │
│  │  └────────────────────────┘ │  │
│  │  ┌────────────────────────┐ │  │
│  │  │   Utils                │ │  │
│  │  │   (auth, database)     │ │  │
│  │  └────────────────────────┘ │  │
│  └──────────────────────────────┘  │
└──────────────┬──────────────────────┘
               │
               │ SQL Query
               ▼
┌─────────────────────────────────────┐
│      Database (PostgreSQL)          │
│  ┌──────────────────────────────┐  │
│  │   Tables:                    │  │
│  │   - app_users                │  │
│  │   - inventory                │  │
│  │   - repair_tickets           │  │
│  │   - activity_feed            │  │
│  │   - access_policies          │  │
│  │   - maintenance              │  │
│  │   - expiring_assets          │  │
│  └──────────────────────────────┘  │
└─────────────────────────────────────┘
```

## 🔐 Authentication Flow

```
1. User Login
   ├─→ Frontend: LoginCard.vue
   ├─→ POST /api/auth/login
   ├─→ Backend: auth.routes.js
   ├─→ Verify password (bcrypt)
   ├─→ Generate JWT token
   └─→ Return token + user data

2. Authenticated Request
   ├─→ Frontend: authFetch()
   ├─→ Add Authorization header
   ├─→ Backend: authenticateToken middleware
   ├─→ Verify JWT token
   ├─→ Attach user to req.user
   └─→ Process request

3. Token Refresh
   ├─→ POST /api/auth/refresh
   ├─→ Verify old token
   ├─→ Generate new token
   └─→ Return new token
```

## 📊 Database Schema

```
app_users
├── id (PK)
├── full_name
├── email (UNIQUE)
├── password (hashed)
├── role
├── department
├── position_title
├── cost_center
├── company
├── assets_count
├── asset_ids (JSONB)
├── issues_count
├── status
├── avatar
├── is_active
└── created_at

inventory
├── asset_id (PK)
├── category
├── serial_number
├── service_years
├── purchase_date
├── warranty_expiry
├── status
└── assigned_user_id (FK → app_users.id)

repair_tickets
├── ticket_id (PK)
├── category
├── priority
├── subject
├── asset_tag
├── description
├── status
├── submitted_by_id (FK → app_users.id)
├── prepared_by
├── evidence (JSONB)
└── updated_at

access_policies
├── department (PK)
├── allowed_pages (JSONB)
├── allowed_features (JSONB)
└── updated_at

activity_feed
├── id (PK)
├── type
├── title
├── description
└── time_label

maintenance
├── id (PK)
└── ... (maintenance task fields)

expiring_assets
├── id (PK)
└── ... (expiring asset fields)
```

## 🚀 Request Flow Example

### Example: Creating a Support Ticket

```
1. User fills form in Support page
   └─→ frontend/src/pages/support.js

2. Form submission
   └─→ authFetch('/api/repair/tickets', { method: 'POST', body: ... })

3. Frontend auth utility adds JWT token
   └─→ frontend/src/utils/auth.js

4. Backend receives request
   └─→ backend/server.js (Express middleware)

5. Route handler processes request
   └─→ backend/routes/tickets.routes.js

6. Database query
   └─→ backend/utils/database.js (pool.query)

7. Activity feed updated
   └─→ INSERT INTO activity_feed

8. Response sent back
   └─→ { message: "Ticket submitted", ticket_id: 123 }

9. Frontend updates UI
   └─→ Show success message, refresh ticket list
```

## 📝 File Naming Conventions

- **Routes**: `*.routes.js` - Express route handlers
- **Utils**: `*.js` - Utility functions and helpers
- **Components**: `*.vue` - Vue single-file components
- **Pages**: `*.js` or `*.vue` - Page-level components
- **Config**: `*.config.js` - Configuration files
- **Docs**: `*.md` - Markdown documentation

## 🎨 Code Organization Principles

1. **Separation of Concerns** - Each file has one responsibility
2. **Feature-Based** - Routes organized by feature domain
3. **Reusability** - Shared code in utils/
4. **Modularity** - Small, focused modules
5. **Clarity** - Clear naming and structure

## 📚 Related Documentation

- [README.md](README.md) - Main documentation
- [QUICKSTART.md](QUICKSTART.md) - Quick setup guide
- [DEVELOPMENT.md](DEVELOPMENT.md) - Developer guide
- [CLEANUP_SUMMARY.md](CLEANUP_SUMMARY.md) - Cleanup details

---

**Last Updated:** After project cleanup and reorganization
