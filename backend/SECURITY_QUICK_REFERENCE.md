# 🔐 Security Quick Reference Card

## 🚨 BEFORE YOU START DEVELOPING

### 1. Generate Secrets (First Time Setup)
```bash
# Run this 5 times to generate all required secrets
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Create .env File
```bash
cp .env.example .env
# Edit .env and replace ALL placeholder values with real secrets
```

### 3. Configure Required Variables
```bash
JWT_SECRET=<paste-generated-secret-here>
JWT_REFRESH_SECRET=<paste-generated-secret-here>
CSRF_SECRET=<paste-generated-secret-here>
ENCRYPTION_KEY=<paste-generated-secret-here>
SIGNATURE_SECRET=<paste-generated-secret-here>
CORS_ORIGIN=http://localhost:3000
```

---

## ⚡ Common Commands

### Start Development Server
```bash
npm run start:dev
```

**If you see errors like:**
- ❌ `JWT_SECRET is not configured` → Add JWT_SECRET to .env
- ❌ `CORS_ORIGIN is not configured` → Add CORS_ORIGIN to .env
- ❌ `JWT_SECRET must be at least 32 characters` → Generate longer secret

### Test Authentication
```bash
# Register
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123!@#","firstName":"Test","lastName":"User","role":"NURSE"}'

# Login
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123!@#"}'

# Use token in authenticated requests
curl -X GET http://localhost:3001/auth/profile \
  -H "Authorization: Bearer <your-token-here>"
```

---

## 🔒 Security Features You Should Know

### 1. All Routes Are Protected by Default
```typescript
// This route requires authentication (default)
@Get('protected-data')
async getData() { ... }

// Use @Public() decorator for public routes
@Public()
@Get('public-data')
async getPublicData() { ... }
```

### 2. Rate Limiting Is Active
- **Global:** 10 req/sec, 50 req/10sec, 100 req/min
- **Login:** 5 attempts/minute
- **Register:** 3 attempts/minute

**Error:** `429 Too Many Requests` → Wait before retrying

### 3. Token Blacklist (Logout)
When users logout or change password, tokens are immediately revoked.

```typescript
// Tokens are checked against blacklist on every request
// No action needed - it's automatic!
```

### 4. CORS Protection
Only requests from `CORS_ORIGIN` are allowed.

**Error:** CORS blocked → Add origin to `CORS_ORIGIN` in .env

---

## 🛡️ Security Best Practices

### ✅ DO:
- Use `@Public()` decorator for public routes only
- Use strong passwords (8+ chars, uppercase, lowercase, number, special)
- Test authentication flows after code changes
- Use environment variables for all secrets
- Keep .env file in .gitignore

### ❌ DON'T:
- Hardcode secrets in code
- Commit .env files to git
- Use weak passwords in tests
- Disable security features
- Use `@Public()` on PHI endpoints

---

## 🔑 Authentication Decorator Examples

### Get Current User
```typescript
@UseGuards(JwtAuthGuard)
@Get('my-data')
async getMyData(@CurrentUser() user: any) {
  // user = { id, email, role, permissions }
  return user;
}

// Get specific user property
@Get('my-id')
async getMyId(@CurrentUser('id') userId: string) {
  return { userId };
}
```

### Require Specific Roles
```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
@Get('admin-only')
async adminOnly() {
  // Only accessible by ADMIN or SUPER_ADMIN
}
```

### Public Routes
```typescript
@Public()  // ← Makes route accessible without authentication
@Get('health')
async healthCheck() {
  return { status: 'ok' };
}
```

---

## 🐛 Common Issues & Solutions

### Issue: "CORS Error"
**Solution:** Add frontend URL to `CORS_ORIGIN` in .env
```bash
CORS_ORIGIN=http://localhost:3000
```

### Issue: "JWT_SECRET not configured"
**Solution:** Generate and add to .env
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Copy output to .env as JWT_SECRET=<output>
```

### Issue: "429 Too Many Requests"
**Solution:** Wait 60 seconds before retrying (rate limit reset)

### Issue: "Token has been revoked"
**Solution:** User logged out or changed password - request new login

### Issue: "Invalid CSRF token"
**Solution:** Ensure CSRF_SECRET is configured in .env

---

## 📊 Security Headers Enabled

All responses include these security headers:
- `Content-Security-Policy` - XSS protection
- `Strict-Transport-Security` - Force HTTPS
- `X-Frame-Options: DENY` - Clickjacking protection
- `X-Content-Type-Options: nosniff` - MIME sniffing protection
- `X-XSS-Protection` - XSS filter

**No action needed** - automatically applied to all responses.

---

## 🆘 Need Help?

1. Check `.env.example` for required configuration
2. See `SECURITY_IMPROVEMENTS.md` for detailed documentation
3. See `SECURITY_FIXES_SUMMARY.md` for executive summary
4. Check console logs for specific error messages

---

**Remember:** Security is everyone's responsibility! 🛡️
