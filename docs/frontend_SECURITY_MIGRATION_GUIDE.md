# Security Migration Guide

**Platform:** White Cross Healthcare Management System
**Target Audience:** Development Team
**Migration Type:** Token Storage & Security Enhancement
**Impact Level:** Medium (Automatic migration, but users will need to re-login)

---

## 📋 Overview

This guide helps you understand the changes made to the authentication and security system, and what actions (if any) are required.

---

## 🔄 What Changed?

### Token Storage Migration: localStorage → sessionStorage

**Before:**
```typescript
// Tokens stored in localStorage (persists across browser restarts)
localStorage.getItem('auth_token')
localStorage.getItem('refresh_token')
```

**After:**
```typescript
// Tokens stored in sessionStorage (cleared on browser close)
secureTokenManager.getToken()
secureTokenManager.getRefreshToken()
```

### Why This Change?

1. **Security:** sessionStorage is cleared when browser closes, preventing token persistence
2. **HIPAA Compliance:** Better protection for PHI access credentials
3. **Best Practice:** Healthcare applications should not persist sessions indefinitely

---

## 🚀 Automatic Migration

The SecureTokenManager **automatically migrates** existing tokens from localStorage to sessionStorage on first load:

1. Checks for tokens in localStorage
2. Validates they haven't expired
3. Moves valid tokens to sessionStorage
4. Removes tokens from localStorage
5. Continues working seamlessly

**No code changes required** for existing authentication flows!

---

## 👥 User Impact

### What Users Will Experience:

1. **First Visit After Deployment:**
   - Existing valid sessions will continue working
   - Tokens automatically migrated to sessionStorage

2. **After Closing Browser/Tab:**
   - Users will need to login again (expected behavior)
   - This is a SECURITY FEATURE, not a bug

3. **During Active Session:**
   - 8-hour inactivity timeout (from SECURITY_CONFIG)
   - Automatic logout after inactivity
   - Token expiration based on JWT exp claim

### Communication Template:

```
Subject: Enhanced Security Measures - Session Changes

Dear White Cross Users,

We've implemented enhanced security measures to better protect patient health information:

1. Sessions now expire when you close your browser (improved security)
2. Automatic logout after 8 hours of inactivity
3. Stronger password requirements for new accounts (12+ characters)

You may need to log in again after this update. This is expected and improves the security of patient data.

Thank you for helping us maintain HIPAA compliance.
```

---

## 💻 Developer Migration

### Code That Needs No Changes ✅

Most existing code will work without changes because `tokenUtils` was updated to use SecureTokenManager:

```typescript
// These still work (backward compatible)
tokenUtils.getToken()
tokenUtils.setToken(token)
tokenUtils.clearAll()

// API calls still work
apiInstance.get('/students')
apiClient.post('/students', data)
```

### Code That Should Be Updated 🔄

If you have any **direct localStorage access** for tokens, update it:

#### Before:
```typescript
// ❌ Old way - direct localStorage access
const token = localStorage.getItem('auth_token');
localStorage.setItem('auth_token', token);
localStorage.removeItem('auth_token');
```

#### After:
```typescript
// ✅ New way - use SecureTokenManager
import { secureTokenManager } from '@/services/security';

const token = secureTokenManager.getToken();
secureTokenManager.setToken(token, refreshToken, expiresIn);
secureTokenManager.clearTokens();
```

### Finding Direct localStorage Usage

Search for these patterns in your code:

```bash
# In the frontend directory
cd frontend/src

# Find direct localStorage usage for auth
grep -r "localStorage.getItem('auth" .
grep -r "localStorage.setItem('auth" .
grep -r "localStorage.removeItem('auth" .
grep -r "localStorage.getItem('refresh" .
```

---

## 🧪 Testing Checklist

### Pre-Deployment Testing

- [ ] Test login flow
- [ ] Test logout flow
- [ ] Test token refresh
- [ ] Test session expiration (wait 8+ hours or manually expire)
- [ ] Test closing browser and reopening (should require re-login)
- [ ] Test API calls with valid token
- [ ] Test API calls with expired token (should redirect to login)
- [ ] Test password validation (12+ chars with complexity)
- [ ] Test CSRF token injection in POST/PUT/PATCH/DELETE requests
- [ ] Test HTTPS enforcement in production build

### Post-Deployment Monitoring

- [ ] Monitor login rates (expect increase after browser closes)
- [ ] Check for token-related errors
- [ ] Verify CSRF tokens are present in requests
- [ ] Confirm HTTPS is being used
- [ ] Review security logs for issues

---

## 🔧 Backend Requirements

### Required Backend Changes

#### 1. CSRF Token Support

**Add to HTML Template:**
```html
<!DOCTYPE html>
<html>
<head>
    <!-- CSRF token meta tag -->
    <meta name="csrf-token" content="<%= csrfToken %>">
    <!-- OR set in cookie -->
</head>
</html>
```

**CSRF Middleware Example (Express):**
```javascript
const csurf = require('csurf');

// Setup CSRF protection
const csrfProtection = csurf({
  cookie: {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production'
  }
});

app.use(csrfProtection);

// Send CSRF token to client
app.get('*', (req, res) => {
  res.cookie('XSRF-TOKEN', req.csrfToken());
  // OR set in template
  res.render('index', { csrfToken: req.csrfToken() });
});
```

#### 2. Token Refresh Endpoint

**Update Response to Include expiresIn:**
```javascript
POST /api/auth/refresh

Response:
{
  "token": "new-jwt-token",
  "refreshToken": "new-refresh-token",  // Optional
  "expiresIn": 86400  // Seconds until expiration
}
```

#### 3. HTTPS Configuration

**Nginx Example:**
```nginx
server {
    listen 443 ssl http2;
    server_name api.whitecross.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # Redirect HTTP to HTTPS
    if ($scheme != "https") {
        return 301 https://$server_name$request_uri;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_set_header X-Forwarded-Proto https;
    }
}
```

---

## 📊 Rollback Plan

If issues arise, you can temporarily disable the new security features:

### Emergency Rollback (Not Recommended)

1. **Revert to localStorage:**
```typescript
// In apiConfig.ts - temporarily revert token retrieval
const token = localStorage.getItem('auth_token');
```

2. **Disable CSRF (Temporarily):**
```typescript
// Comment out in apiConfig.ts
// setupCsrfProtection(apiInstance);
```

### Better Approach: Fix Issues

Instead of rolling back, fix specific issues:

- **Token expiration too aggressive?** Update `SECURITY_CONFIG.SESSION_TIMEOUT`
- **CSRF tokens not working?** Verify backend setup
- **HTTPS issues?** Check environment variables

---

## 📈 Performance Impact

### Expected Changes:

- **Positive:**
  - Faster initial page load (no localStorage parsing)
  - Better memory management (sessionStorage cleanup)
  - Improved security posture

- **Neutral:**
  - Minimal overhead from token validation
  - CSRF token lookup is fast (meta tag or cookie)

- **User Experience:**
  - Need to re-login after browser close (by design)
  - 8-hour inactivity timeout (configurable)

---

## 🐛 Common Issues & Solutions

### Issue 1: "Token expired immediately after login"

**Cause:** Token expiresIn not provided or incorrect

**Solution:**
```typescript
// Ensure backend returns expiresIn in seconds
const response = {
  token: "...",
  refreshToken: "...",
  expiresIn: 86400  // 24 hours in seconds
};
```

### Issue 2: "CSRF token not found"

**Cause:** Backend not setting meta tag or cookie

**Solution:**
```html
<!-- Add to HTML template -->
<meta name="csrf-token" content="<%= csrfToken %>">
```

### Issue 3: "Users logged out too quickly"

**Cause:** SESSION_TIMEOUT too short

**Solution:**
```typescript
// In constants/config.ts
export const SECURITY_CONFIG = {
  SESSION_TIMEOUT: 12 * 60 * 60 * 1000, // Increase to 12 hours
};
```

### Issue 4: "HTTP not allowed in production error"

**Cause:** VITE_API_BASE_URL using http:// instead of https://

**Solution:**
```bash
# Update .env.production
VITE_API_BASE_URL=https://api.whitecross.com/api
```

---

## 📞 Support & Escalation

### Before Escalating:

1. Check this migration guide
2. Review `SECURITY_FIXES_IMPLEMENTATION.md`
3. Check browser console for errors
4. Verify environment variables
5. Test in development first

### Escalation Path:

1. **Development Team Lead**
   - Code-related issues
   - Integration problems

2. **DevOps Team**
   - HTTPS configuration
   - Environment variables
   - Backend deployment

3. **Security Team**
   - HIPAA compliance questions
   - Security policy decisions

---

## ✅ Deployment Checklist

### Pre-Deployment:

- [ ] Backend CSRF support implemented
- [ ] Token refresh endpoint returns expiresIn
- [ ] HTTPS certificates configured
- [ ] Environment variables updated
- [ ] Staging environment tested
- [ ] User communication prepared

### Deployment:

- [ ] Deploy backend changes first
- [ ] Verify backend CSRF tokens work
- [ ] Deploy frontend changes
- [ ] Monitor error logs
- [ ] Check user login success rate

### Post-Deployment:

- [ ] Verify HTTPS is working
- [ ] Confirm CSRF tokens in requests
- [ ] Monitor token expiration rates
- [ ] Check for security-related errors
- [ ] Gather user feedback

---

## 🎓 Training Resources

### For Developers:
- `SECURITY_FIXES_IMPLEMENTATION.md` - Detailed technical documentation
- `SECURITY_QUICK_REFERENCE.md` - Quick reference for common tasks
- Source code JSDoc comments - Inline documentation

### For QA Team:
- Test token expiration scenarios
- Test browser close and reopen
- Test inactivity timeout (8 hours)
- Test password requirements

### For Support Team:
- "Users need to re-login after browser close" is expected
- "Session expired" after 8 hours is expected
- Strong password requirements are for HIPAA compliance

---

## 📅 Timeline Recommendation

### Week 1: Backend Preparation
- Implement CSRF support
- Update token refresh endpoint
- Configure HTTPS

### Week 2: Staging Deployment
- Deploy to staging
- Run full test suite
- Fix any issues

### Week 3: Production Deployment
- Deploy during maintenance window
- Monitor closely
- Have rollback plan ready

### Week 4: Post-Deployment
- Monitor metrics
- Gather feedback
- Fine-tune configuration

---

**Remember:** These security improvements are critical for HIPAA compliance. While they may require some adjustment, they significantly improve the protection of patient health information.

For questions or issues, refer to the documentation or contact the development team.
