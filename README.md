# BuilderUI Management System

A full-stack web application for IT asset management, repair ticket tracking, and user administration.

## 🚀 Features

- **Asset Management**: Track inventory, warranties, and asset assignments
- **Repair Tickets**: Submit and manage support tickets with evidence uploads
- **User Management**: Role-based access control and user administration
- **Activity Tracking**: Real-time activity feed and monitoring
- **Access Control**: Department-based page and feature permissions
- **JWT Authentication**: Secure token-based authentication

## 📁 Project Structure

```
├── backend/                    # Backend API server
│   ├── routes/                 # API route modules
│   │   ├── auth.routes.js      # Authentication endpoints
│   │   ├── users.routes.js     # User management
│   │   ├── assets.routes.js    # Asset management
│   │   ├── tickets.routes.js   # Repair tickets
│   │   └── misc.routes.js      # Activity, maintenance, policies
│   ├── utils/                  # Utility modules
│   │   ├── auth.js             # JWT authentication utilities
│   │   └── database.js         # Database connection & helpers
│   ├── server.js               # Main server file
│   ├── schema.sql              # Database schema
│   └── package.json            # Backend dependencies
│
├── frontend/                   # Frontend Vue.js application
│   ├── src/
│   │   ├── components/         # Vue components
│   │   │   └── auth/           # Authentication components
│   │   ├── pages/              # Page components
│   │   │   ├── form/           # Form pages
│   │   │   └── aut/            # Auth pages
│   │   ├── ui/                 # UI builder components
│   │   ├── utils/              # Frontend utilities
│   │   ├── data/               # Static data
│   │   ├── App.vue             # Main app component
│   │   ├── main.js             # App entry point
│   │   └── menu.js             # Navigation configuration
│   ├── index.html              # HTML template
│   ├── vite.config.js          # Vite configuration
│   └── package.json            # Frontend dependencies
│
└── package.json                # Root package.json
```

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcrypt** - Password hashing

### Frontend
- **Vue 3** - Frontend framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **PrimeIcons** - Icon library

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Configure database**
   
   Create a PostgreSQL database and update connection settings in `backend/utils/database.js` or use environment variables:
   
   ```bash
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=n8n_db
   DB_USER=admin
   DB_PASSWORD=your_password
   JWT_SECRET=your_secret_key
   ```

4. **Start the application**

   ```bash
   # Terminal 1 - Start backend server
   cd backend
   npm run dev

   # Terminal 2 - Start frontend dev server
   cd frontend
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 🔐 Default Users

The system comes with two default users:

| Email | Password | Role | Department |
|-------|----------|------|------------|
| nasaaaxd@gmail.com | Ruki@123 | Administrator | IT |
| riotsukasaaa@gmail.com | Rio@123 | Staff | Finance |

## 📚 API Documentation

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/verify` - Verify JWT token
- `POST /api/auth/refresh` - Refresh JWT token

### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Assets
- `GET /api/assets/inventory` - Get all assets
- `GET /api/assets/expiring` - Get expiring assets
- `POST /api/assets/add` - Add new asset
- `PUT /api/assets/update` - Update asset
- `DELETE /api/assets/delete` - Delete asset
- `POST /api/assets/assign` - Assign asset to user

### Repair Tickets
- `GET /api/repair/tickets` - Get all tickets
- `POST /api/repair/tickets` - Create ticket
- `PUT /api/repair/tickets/:id` - Update ticket
- `DELETE /api/repair/tickets/:id` - Delete ticket

### Miscellaneous
- `GET /api/activity/feed` - Get activity feed
- `GET /api/maintenance/tasks` - Get maintenance tasks
- `GET /api/access-policies` - Get access policies
- `PUT /api/access-policies/:department` - Update access policy

## 🔧 Development

### Backend Scripts
```bash
npm run dev    # Start development server
npm run stop   # Stop server on port 5000
```

### Frontend Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## 🏗️ Code Organization

### Backend Structure
- **Routes**: Organized by feature (auth, users, assets, tickets)
- **Utils**: Reusable utilities (auth, database)
- **Middleware**: JWT authentication middleware
- **Database**: PostgreSQL with connection pooling

### Frontend Structure
- **Components**: Reusable Vue components
- **Pages**: Page-level components with business logic
- **Utils**: Frontend utilities (auth helpers)
- **UI**: UI builder components and themes

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (RBAC)
- Department-based permissions
- Token expiration and refresh
- SQL injection prevention with parameterized queries

## 📝 License

This project is proprietary software.

## 👥 Authors

BuilderUI Team

## 🤝 Contributing

Please contact the development team for contribution guidelines.
