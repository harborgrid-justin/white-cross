# Database Connection Guide

## Issue: Blank App Loading Page

### Problem Summary

The app loading page is blank because the backend cannot connect to the database. The error message indicates:

```
SequelizeConnectionError: password authentication failed for user 'neondb_owner'
```

### Root Cause

The database connection string provided in the issue has **incorrect credentials**. The password or username may be expired, revoked, or mistyped.

---

## Solutions

You have **two options** to fix this issue:

### Option 1: Use Local PostgreSQL with Docker (Recommended for Development)

This is the **easiest and fastest** solution for local development.

#### Steps:

1. **Start Docker Compose services:**
   ```bash
   docker-compose up -d postgres redis
   ```

2. **Update your `.env` file** in the `backend` directory:
   ```env
   # Server Configuration
   NODE_ENV=development
   PORT=3001
   HOST=localhost

   # Database Configuration (Local Docker)
   DATABASE_URL=postgresql://white_cross_user:white_cross_password@localhost:5432/white_cross
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=white_cross
   DB_USERNAME=white_cross_user
   DB_PASSWORD=white_cross_password
   DB_DIALECT=postgres
   DB_POOL_MIN=2
   DB_POOL_MAX=10
   DB_CONNECTION_TIMEOUT=60000
   DB_IDLE_TIMEOUT=10000
   DB_LOGGING=false
   ```

3. **Test the database connection:**
   ```bash
   cd backend
   node test-db-connection.js
   ```

4. **Run database migrations** (if needed):
   ```bash
   cd backend
   npx sequelize-cli db:migrate
   ```

5. **Start the backend:**
   ```bash
   cd backend
   npm run dev
   ```

6. **Start the frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

7. **Access the app:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001
   - API Documentation: http://localhost:3001/docs

---

### Option 2: Fix Neon Database Credentials

If you need to use the Neon hosted database:

#### Steps:

1. **Log in to Neon.tech Dashboard:**
   - Go to https://console.neon.tech/
   - Navigate to your project

2. **Get the correct connection string:**
   - Click on "Connection Details"
   - Copy the **complete** connection string
   - It should look like:
     ```
     postgresql://[username]:[password]@[host]/[database]?sslmode=require
     ```

3. **Update your `.env` file** with the correct credentials:
   ```env
   # Server Configuration
   NODE_ENV=production
   PORT=3001
   HOST=0.0.0.0

   # Database Configuration (Neon)
   DATABASE_URL=postgresql://[your-actual-username]:[your-actual-password]@[your-host]/[your-database]?sslmode=require
   ```

4. **Test the connection:**
   ```bash
   cd backend
   node test-db-connection.js
   ```

5. **If successful, start the app:**
   ```bash
   cd backend
   npm run dev
   ```

---

## Troubleshooting

### Test Database Connection

A test script has been provided to diagnose connection issues:

```bash
cd backend
node test-db-connection.js
```

This script will:
- ✅ Validate the connection string format
- ✅ Show connection details (with password masked)
- ✅ Test the actual connection
- ✅ Display database information if successful
- ✅ Provide specific troubleshooting tips for errors

### Common Error Messages

#### "password authentication failed"
**Solution:**
- Verify username and password are correct
- Get a fresh connection string from Neon dashboard
- Check if the database user exists and has proper permissions

#### "connection refused" or "ECONNREFUSED"
**Solution:**
- Check if the database server is running
- For local Docker: Run `docker-compose up -d postgres`
- For Neon: Verify the database is not paused

#### "SSL connection required"
**Solution:**
- Ensure connection string includes `?sslmode=require`
- For production/Neon, `NODE_ENV` should be `production` to enable SSL

#### Frontend shows blank page
**Solution:**
- Check if backend is running: `curl http://localhost:3001/health`
- Check browser console for errors (F12 → Console tab)
- Verify `.env` file exists in frontend directory
- Ensure `VITE_API_URL=http://localhost:3001/api` in frontend/.env

---

## Environment Configuration Files

### Backend `.env` Template (Local Development)

```env
# Server Configuration
NODE_ENV=development
PORT=3001
HOST=localhost

# Database Configuration (Local Docker)
DATABASE_URL=postgresql://white_cross_user:white_cross_password@localhost:5432/white_cross
DB_HOST=localhost
DB_PORT=5432
DB_NAME=white_cross
DB_USERNAME=white_cross_user
DB_PASSWORD=white_cross_password
DB_DIALECT=postgres
DB_POOL_MIN=2
DB_POOL_MAX=10
DB_CONNECTION_TIMEOUT=60000
DB_IDLE_TIMEOUT=10000
DB_LOGGING=false

# Authentication & Security
JWT_SECRET=your-super-secret-jwt-key-here
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
BCRYPT_ROUNDS=12

# API Configuration
API_VERSION=v1
API_PREFIX=api
CORS_ORIGIN=http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Feature Flags
ENABLE_SWAGGER=true
ENABLE_HEALTH_CHECK=true
ENABLE_METRICS=true
ENABLE_CORS=true
```

### Frontend `.env` Template

```env
# API Configuration
VITE_API_URL=http://localhost:3001/api
VITE_API_TIMEOUT=30000

# Application Configuration
VITE_APP_TITLE="White Cross"
VITE_APP_VERSION=1.0.0
VITE_APP_DESCRIPTION="Enterprise grade platform for school nurses"

# Environment
VITE_NODE_ENV=development
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_ERROR_REPORTING=false

# Development
VITE_ENABLE_REACT_QUERY_DEVTOOLS=true
VITE_ENABLE_DEBUG_TOOLS=true
```

---

## Quick Start (Recommended)

The fastest way to get the app running:

```bash
# 1. Start Docker services
docker-compose up -d postgres redis

# 2. Copy environment templates
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 3. Update backend/.env DATABASE_URL to use local Docker:
# DATABASE_URL=postgresql://white_cross_user:white_cross_password@localhost:5432/white_cross

# 4. Test database connection
cd backend && node test-db-connection.js && cd ..

# 5. Install dependencies (if not already done)
npm run setup

# 6. Start backend
cd backend && npm run dev

# 7. In a new terminal, start frontend
cd frontend && npm run dev
```

---

## Verification Checklist

- [ ] Docker PostgreSQL container is running: `docker ps | grep white-cross-db`
- [ ] Database connection test passes: `node backend/test-db-connection.js`
- [ ] Backend health check responds: `curl http://localhost:3001/health`
- [ ] Frontend loads without errors: Open http://localhost:5173
- [ ] Browser console shows no errors (F12 → Console tab)
- [ ] Can access API documentation: http://localhost:3001/docs

---

## Need Help?

If you're still experiencing issues:

1. Check the backend logs for specific error messages
2. Check the browser console (F12) for frontend errors
3. Verify all environment variables are set correctly
4. Ensure Docker containers are running: `docker-compose ps`
5. Test database connection: `node backend/test-db-connection.js`

---

**Last Updated:** October 12, 2025
