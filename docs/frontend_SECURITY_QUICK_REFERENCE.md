# Security Quick Reference Guide

**Platform:** White Cross Healthcare Management System
**Audience:** Developers
**Last Updated:** 2025-10-21

---

## 🔐 Token Management

### Import
```typescript
import { secureTokenManager } from '@/services/security';
```

### Common Operations

#### Store Token (Login)
```typescript
// After successful login
const { token, refreshToken, expiresIn } = loginResponse;
secureTokenManager.setToken(token, refreshToken, expiresIn);
```

#### Get Token
```typescript
// Returns null if expired or invalid
const token = secureTokenManager.getToken();

if (!token) {
  // Token expired or doesn't exist
  redirectToLogin();
}
```

#### Check Token Validity
```typescript
if (secureTokenManager.isTokenValid()) {
  // Token is valid
} else {
  // Token expired, clear and redirect
  secureTokenManager.clearTokens();
  redirectToLogin();
}
```

#### Clear Tokens (Logout)
```typescript
// On logout
secureTokenManager.clearTokens();
```

#### Update Activity
```typescript
// Update last activity timestamp (called automatically on getToken)
secureTokenManager.updateActivity();
```

#### Check Expiration Time
```typescript
// Get milliseconds until expiration
const timeRemaining = secureTokenManager.getTimeUntilExpiration();

// Get milliseconds since last activity
const inactiveTime = secureTokenManager.getTimeSinceActivity();
```

---

## 🛡️ CSRF Protection

### Import
```typescript
import { setupCsrfProtection, csrfProtection } from '@/services/security';
```

### Setup (Already configured in apiInstance and ApiClient)
```typescript
import { apiInstance } from '@/services/config/apiConfig';
import { setupCsrfProtection } from '@/services/security';

// CSRF protection is automatically setup, but you can add to other axios instances:
setupCsrfProtection(customAxiosInstance);
```

### Manual Operations (Rarely Needed)

#### Get CSRF Token
```typescript
const token = csrfProtection.getToken();
```

#### Refresh Token
```typescript
// Refresh from meta tag or cookie
csrfProtection.refreshToken();
```

#### Clear Token
```typescript
// Call on logout
csrfProtection.clearToken();
```

---

## 🔒 Password Validation

### Requirements
- Minimum **12 characters**
- At least one **uppercase** letter (A-Z)
- At least one **lowercase** letter (a-z)
- At least one **number** (0-9)
- At least one **special character** (@$!%*?&)

### Examples

#### ❌ Invalid Passwords
```typescript
"short"           // Too short
"NoSpecialChar1"  // Missing special character
"noupppercase1!"  // Missing uppercase
"NOLOWERCASE1!"   // Missing lowercase
"NoNumbers!@#"    // Missing number
```

#### ✅ Valid Passwords
```typescript
"SecurePass123!"
"MyP@ssw0rd2024"
"Healthcare$2024"
"Admin#Password1"
```

### Frontend Validation
```typescript
import { z } from 'zod';

// Password schema (already in authApi.ts)
const passwordSchema = z.string()
  .min(12, 'Password must be at least 12 characters')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/,
    'Password must contain uppercase, lowercase, number, and special character'
  );

// Validate
try {
  passwordSchema.parse(password);
  // Valid password
} catch (error) {
  // Show error.message to user
}
```

---

## 🌐 API Client Usage

### Import
```typescript
import { apiClient } from '@/services/core/ApiClient';
// OR
import { apiInstance } from '@/services/config/apiConfig';
```

### Making Requests

#### Using apiClient (Recommended for new code)
```typescript
// GET request
const response = await apiClient.get<Student[]>('/students');

// POST request
const response = await apiClient.post<Student>('/students', studentData);

// PUT request
const response = await apiClient.put<Student>(`/students/${id}`, updateData);

// DELETE request
const response = await apiClient.delete(`/students/${id}`);
```

#### Using apiInstance (Existing code compatibility)
```typescript
// GET request
const response = await apiInstance.get('/students');

// POST request
const response = await apiInstance.post('/students', studentData);
```

### Security Features (Automatic)
- ✅ Authorization header automatically added
- ✅ Token validation before request
- ✅ CSRF token injection for POST/PUT/PATCH/DELETE
- ✅ Security headers added to all requests
- ✅ Activity tracking on token use
- ✅ Automatic token refresh on 401

---

## 🔧 Configuration

### Environment Variables

#### Production (REQUIRED)
```bash
# MUST use HTTPS
VITE_API_BASE_URL=https://api.whitecross.com/api
```

#### Development
```bash
# Can use HTTP for localhost only
VITE_API_BASE_URL=http://localhost:3001/api
```

### HTTPS Enforcement
The application will **throw an error** if you try to use HTTP in production:

```
[SECURITY ERROR] HTTP is not allowed in production.
HIPAA compliance requires HTTPS for all PHI transmission.
Please configure VITE_API_BASE_URL with https:// protocol.
```

---

## 🚨 Common Errors and Solutions

### "Token expired, clearing tokens"
**Cause:** Token has exceeded expiration time or 8-hour inactivity timeout

**Solution:**
```typescript
// User needs to login again
secureTokenManager.clearTokens();
redirectToLogin();
```

### "No CSRF token available for request"
**Cause:** CSRF token not found in meta tag or cookie

**Solution (Backend):**
```html
<!-- Add to HTML template -->
<meta name="csrf-token" content="<%= csrfToken %>">
```

### "Password does not meet security requirements"
**Cause:** Password doesn't meet 12-char minimum or complexity requirements

**Solution:**
```typescript
// Show detailed error to user
// Password must:
// - Be at least 12 characters
// - Contain uppercase, lowercase, number, and special character
```

### "HTTP is not allowed in production"
**Cause:** Using HTTP instead of HTTPS in production environment

**Solution:**
```bash
# Update .env.production
VITE_API_BASE_URL=https://api.example.com/api
```

---

## 📋 Security Checklist for New Features

When implementing new features:

- [ ] Use `secureTokenManager` for all token operations
- [ ] Never directly access localStorage/sessionStorage for auth tokens
- [ ] Use `apiClient` or `apiInstance` for API calls
- [ ] Validate passwords using the strict schema (12+ chars with complexity)
- [ ] Test token expiration scenarios
- [ ] Test with HTTPS in staging
- [ ] Clear tokens on logout
- [ ] Handle 401 responses gracefully
- [ ] Don't store sensitive data in localStorage
- [ ] Log security events for audit trails

---

## 🔍 Debugging

### Check Token Status
```typescript
// In browser console
const info = secureTokenManager.getTokenInfo();
console.log('Token info:', info);
// Output: { hasToken: true, expiresAt: 1234567890, age: 120000 }
```

### Check CSRF Token
```typescript
// In browser console
const csrfInfo = csrfProtection.getTokenInfo();
console.log('CSRF info:', csrfInfo);
```

### View Token in DevTools
```typescript
// Tokens are in sessionStorage (not localStorage)
// DevTools > Application > Session Storage > [domain]
// Look for: secure_auth_token, secure_refresh_token, secure_token_metadata
```

### Network Tab
```
Request Headers should include:
- Authorization: Bearer <token>
- X-CSRF-Token: <csrf-token>
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- X-Request-ID: <unique-id>
```

---

## 💡 Best Practices

### DO:
- ✅ Use `secureTokenManager` for all token operations
- ✅ Clear tokens on logout
- ✅ Validate tokens before sensitive operations
- ✅ Use HTTPS in all non-localhost environments
- ✅ Use strong passwords (12+ chars with complexity)
- ✅ Handle token expiration gracefully
- ✅ Log security events

### DON'T:
- ❌ Store tokens in localStorage
- ❌ Skip token validation
- ❌ Use weak passwords
- ❌ Use HTTP in production
- ❌ Ignore token expiration
- ❌ Store PHI in browser storage
- ❌ Disable security features

---

## 📞 Support

For security-related questions or issues:
1. Review this guide
2. Check the implementation summary: `SECURITY_FIXES_IMPLEMENTATION.md`
3. Review the source code JSDoc comments
4. Contact the security team

---

**Remember:** This is a healthcare application handling PHI. Security is not optional—it's a legal requirement under HIPAA.
