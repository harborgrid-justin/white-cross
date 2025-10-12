# Fix: Blank App Loading Page

## 🔍 Problem

The app shows a **blank page** when loading because the **backend cannot connect to the database**.

## 🎯 Root Cause

The Neon database connection string provided has **incorrect or expired credentials**:

```
❌ password authentication failed for user 'neondb_owner'
```

## ✅ Quick Fix (Choose One)

### Option A: Use Local Database (Recommended)

**Best for development - works immediately!**

1. **Start PostgreSQL with Docker:**
   ```bash
   docker-compose up -d postgres redis
   ```

2. **Update `backend/.env`:**
   ```env
   NODE_ENV=development
   DATABASE_URL=postgresql://white_cross_user:white_cross_password@localhost:5432/white_cross
   ```

3. **Test connection:**
   ```bash
   cd backend && node test-db-connection.js
   ```

4. **Start the app:**
   ```bash
   # Terminal 1 - Backend
   cd backend && npm run dev

   # Terminal 2 - Frontend  
   cd frontend && npm run dev
   ```

5. **Open:** http://localhost:5173

---

### Option B: Fix Neon Database Connection

**If you need the production Neon database:**

1. **Get correct credentials from Neon dashboard:**
   - Login to https://console.neon.tech/
   - Go to your project
   - Copy the connection string (should include correct password)

2. **Update `backend/.env`:**
   ```env
   NODE_ENV=production
   DATABASE_URL=postgresql://[correct-username]:[correct-password]@[host]/[database]?sslmode=require
   ```

3. **Test connection:**
   ```bash
   cd backend && node test-db-connection.js
   ```

4. **Start the app** (same as Option A step 4)

---

## 🧪 Verify Everything Works

```bash
# 1. Database connection
cd backend && node test-db-connection.js
# Should show: ✅ SUCCESS: Database connection established!

# 2. Backend health
curl http://localhost:3001/health
# Should return: {"status":"OK",...}

# 3. Frontend loads
# Open http://localhost:5173
# Should show login page (not blank)
```

---

## 🐛 Troubleshooting

### Still seeing blank page?

**Check browser console (F12 → Console):**
- Look for error messages
- Common issues:
  - CORS errors → Check CORS_ORIGIN in backend/.env
  - Network errors → Backend not running
  - 401/403 errors → Authentication issues

**Check backend logs:**
- Look for database connection errors
- Look for server startup messages

### Database connection fails?

**Run the diagnostic script:**
```bash
cd backend
node test-db-connection.js
```

This will show exactly what's wrong and how to fix it.

### Can't start Docker?

**Install Docker:**
- Mac: https://docs.docker.com/desktop/install/mac-install/
- Windows: https://docs.docker.com/desktop/install/windows-install/
- Linux: https://docs.docker.com/engine/install/

**Or use local PostgreSQL:**
```bash
# Install PostgreSQL
# Mac: brew install postgresql
# Ubuntu: sudo apt install postgresql

# Start service
# Mac: brew services start postgresql
# Linux: sudo systemctl start postgresql

# Create database
psql postgres
CREATE DATABASE white_cross;
CREATE USER white_cross_user WITH PASSWORD 'white_cross_password';
GRANT ALL PRIVILEGES ON DATABASE white_cross TO white_cross_user;
\q
```

---

## 📋 Complete Setup Checklist

- [ ] Dependencies installed (`npm run setup`)
- [ ] Backend `.env` file exists with correct DATABASE_URL
- [ ] Frontend `.env` file exists
- [ ] Database is running (Docker or local PostgreSQL)
- [ ] Database connection test passes ✅
- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Can access http://localhost:5173
- [ ] Login page appears (not blank)

---

## 🆘 Still Need Help?

1. **Read the detailed guide:** See `DATABASE_CONNECTION_GUIDE.md`
2. **Check the logs:** Backend and frontend terminal output
3. **Test each component:** Database → Backend → Frontend
4. **Verify environment files:** Both `.env` files should exist and have correct values

---

## 🎉 Success Indicators

When everything works:

✅ **Backend log shows:**
```
✅ Sequelize database initialized successfully
✅ White Cross API Server running on http://localhost:3001
```

✅ **Frontend shows:**
```
➜  Local:   http://localhost:5173/
```

✅ **Browser shows:**
- Login page (not blank!)
- No errors in console (F12)

---

**Need the detailed guide?** See `DATABASE_CONNECTION_GUIDE.md`

**Last Updated:** October 12, 2025
