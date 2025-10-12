# Troubleshooting Flowchart: Blank App Page

## Quick Diagnosis Flow

```
┌─────────────────────────────────┐
│   App Shows Blank Page?         │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│ Check: Is Backend Running?      │
│ Test: curl localhost:3001/health│
└────────┬────────────────────────┘
         │
    ┌────┴────┐
    │         │
   YES       NO ◄─── Problem Here!
    │         │
    │         ▼
    │    ┌──────────────────────────┐
    │    │ Check Backend Logs       │
    │    │ Look for startup errors  │
    │    └────────┬─────────────────┘
    │             │
    │             ▼
    │    ┌──────────────────────────┐
    │    │ Database Connection?     │
    │    │ Run: npm run db:test     │
    │    └────────┬─────────────────┘
    │             │
    │        ┌────┴────┐
    │        │         │
    │       FAIL     SUCCESS
    │        │         │
    │        │         ▼
    │        │    ┌──────────────────┐
    │        │    │ Other backend    │
    │        │    │ issue - check    │
    │        │    │ dependencies &   │
    │        │    │ configuration    │
    │        │    └──────────────────┘
    │        │
    │        ▼
    │    ┌──────────────────────────┐
    │    │ ❌ Database Error        │
    │    │                          │
    │    │ Common causes:           │
    │    │ • Wrong password         │
    │    │ • DB not running         │
    │    │ • Wrong host/port        │
    │    └────────┬─────────────────┘
    │             │
    │             ▼
    │    ┌──────────────────────────┐
    │    │ Choose Solution:         │
    │    │                          │
    │    │ A) Local Docker DB       │
    │    │    (Recommended)         │
    │    │                          │
    │    │ B) Fix Neon DB           │
    │    │    Credentials           │
    │    └────────┬─────────────────┘
    │             │
    │             ▼
    │    ┌──────────────────────────┐
    │    │ Apply Fix                │
    │    │ See: BLANK_PAGE_FIX.md   │
    │    └────────┬─────────────────┘
    │             │
    │             ▼
    │    ┌──────────────────────────┐
    │    │ Verify: npm run db:test  │
    │    └────────┬─────────────────┘
    │             │
    │             ▼
    │    ┌──────────────────────────┐
    │    │ ✅ Database Connected    │
    │    └────────┬─────────────────┘
    │             │
    └─────────────┘
                  │
                  ▼
         ┌──────────────────────────┐
         │ Start Backend & Frontend │
         │ Backend: npm run dev     │
         │ Frontend: npm run dev    │
         └────────┬─────────────────┘
                  │
                  ▼
         ┌──────────────────────────┐
         │ ✅ App Working!          │
         │ Open: localhost:5173     │
         │ Shows: Login Page        │
         └──────────────────────────┘
```

---

## Error Decision Tree

### Error: "password authentication failed"

```
Password Auth Failed
        │
        ├─► Using Neon DB?
        │   │
        │   ├─► YES → Get new connection string from Neon dashboard
        │   │        Update backend/.env
        │   │        Test with: npm run db:test
        │   │
        │   └─► NO → Check credentials in DATABASE_URL
        │            Verify username and password are correct
        │
        └─► OR: Switch to Local DB
                docker-compose up -d postgres
                Use: postgresql://white_cross_user:white_cross_password@localhost:5432/white_cross
```

### Error: "ECONNREFUSED" or "connection refused"

```
Connection Refused
        │
        ├─► Using Local DB?
        │   │
        │   ├─► YES → Is Docker running?
        │   │        │
        │   │        ├─► YES → Start container: docker-compose up -d postgres
        │   │        │
        │   │        └─► NO → Install Docker, then start container
        │   │
        │   └─► NO → Check host/port in DATABASE_URL
        │            Verify database server is running
        │
        └─► Firewall blocking connection?
                Check network settings
                Try from different network
```

### Error: "SSL connection required"

```
SSL Error
    │
    ├─► Check NODE_ENV
    │   │
    │   ├─► production → SSL enabled automatically
    │   │                 Add ?sslmode=require to DATABASE_URL
    │   │
    │   └─► development → SSL disabled by default
    │                     Either:
    │                     • Switch NODE_ENV to production
    │                     • Or use local DB without SSL
    │
    └─► Using Neon DB? → Must use SSL
                          Ensure ?sslmode=require in connection string
```

---

## Quick Command Reference

### Diagnostic Commands

```bash
# Test database connection
cd backend && npm run db:test

# Check backend health
curl http://localhost:3001/health

# View backend logs
cd backend && npm run dev

# Check Docker containers
docker ps

# Check if PostgreSQL is running
pg_isready
```

### Fix Commands

```bash
# Option 1: Start Local Database
docker-compose up -d postgres redis

# Option 2: Test new credentials
cd backend
npm run db:test

# Start the application
cd backend && npm run dev  # Terminal 1
cd frontend && npm run dev # Terminal 2
```

---

## Common Patterns & Solutions

### Pattern 1: Fresh Install Issues

**Symptoms:**
- Blank page on first run
- No backend logs
- Frontend loads but nothing happens

**Solution:**
1. Verify dependencies: `npm run setup`
2. Create .env files: Use templates in .env.example
3. Start database: `docker-compose up -d postgres`
4. Test connection: `npm run db:test`
5. Start services

---

### Pattern 2: After Database Credentials Change

**Symptoms:**
- Was working before
- Stopped working after config change
- Database connection error

**Solution:**
1. Verify new credentials are correct
2. Test connection: `npm run db:test`
3. Restart backend: Kill and restart `npm run dev`
4. Clear browser cache/localStorage
5. Refresh browser

---

### Pattern 3: Moving Between Environments

**Symptoms:**
- Works locally, fails in production
- Works in production, fails locally

**Solution:**
1. Check NODE_ENV matches environment
2. Verify DATABASE_URL for that environment
3. For production: Ensure SSL is enabled
4. For development: Can disable SSL or use local DB
5. Test: `npm run db:test`

---

## Success Checklist

Use this to verify everything is working:

- [ ] Dependencies installed (`npm run setup` completed)
- [ ] Environment files exist
  - [ ] `backend/.env` exists with DATABASE_URL
  - [ ] `frontend/.env` exists with VITE_API_URL
- [ ] Database is accessible
  - [ ] Docker container running OR Neon DB credentials correct
  - [ ] `npm run db:test` shows ✅ SUCCESS
- [ ] Backend is running
  - [ ] `npm run dev` in backend directory
  - [ ] No error messages in terminal
  - [ ] `curl http://localhost:3001/health` returns JSON
- [ ] Frontend is running
  - [ ] `npm run dev` in frontend directory
  - [ ] Shows "Local: http://localhost:5173/"
- [ ] Browser loads app
  - [ ] http://localhost:5173 shows login page
  - [ ] No errors in browser console (F12)
  - [ ] Can interact with page elements

---

## Need More Help?

1. **Quick Fix:** [BLANK_PAGE_FIX.md](./BLANK_PAGE_FIX.md)
2. **Detailed Guide:** [DATABASE_CONNECTION_GUIDE.md](./DATABASE_CONNECTION_GUIDE.md)
3. **Full Analysis:** [ISSUE_SUMMARY.md](./ISSUE_SUMMARY.md)

---

## Useful Tips

### Tip 1: Always Test Database First
Before debugging other issues, always test the database connection:
```bash
cd backend && npm run db:test
```

### Tip 2: Check Both Logs
Issues can be in either backend or frontend:
- Backend terminal for database/API errors
- Browser console (F12) for frontend errors

### Tip 3: Verify Environment Variables
Most issues come from missing or incorrect environment variables:
```bash
cat backend/.env | grep DATABASE_URL
cat frontend/.env | grep VITE_API_URL
```

### Tip 4: Clean Start
If all else fails, start fresh:
```bash
# Stop everything
pkill -f "node"
docker-compose down

# Clean install
rm -rf node_modules backend/node_modules frontend/node_modules
npm run setup

# Start fresh
docker-compose up -d postgres redis
cd backend && npm run db:test
cd backend && npm run dev  # Terminal 1
cd frontend && npm run dev # Terminal 2
```

---

**Last Updated:** October 12, 2025
