# White Cross API - Security Quick Reference Card

**Last Updated**: 2025-10-23 | **For**: API Developers & Consumers

---

## Authentication Methods

| Method | Use Case | Header/Cookie | Obtain Via |
|--------|----------|---------------|------------|
| **JWT Bearer** | Primary API auth | `Authorization: Bearer <token>` | POST /api/auth/login |
| **Google OAuth** | Enterprise SSO | Managed by OAuth | GET /api/auth/google |
| **Microsoft OAuth** | Enterprise SSO | Managed by OAuth | GET /api/auth/microsoft |
| **Session Cookie** | Web UI | `Cookie: white-cross-session=...` | Auto-set on login |
| **API Key** | Integrations | `X-API-Key: wc_live_...` | POST /api/integration/api-keys |

---

## Quick Start: Authentication

### Login and Get JWT Token

```bash
# Login
curl -X POST https://api.whitecross.health/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "nurse@school.edu", "password": "SecurePass123!"}'

# Response
{
  "token": "eyJhbGciOiJIUzI1...",
  "user": { "id": "...", "role": "school_nurse" },
  "expiresIn": 28800
}
```

### Use Token in API Requests

```bash
# Set token variable
TOKEN="eyJhbGciOiJIUzI1..."

# Make authenticated request
curl -H "Authorization: Bearer $TOKEN" \
  https://api.whitecross.health/api/students
```

### Refresh Token Before Expiry

```bash
# Refresh (do this before 8 hours expire)
curl -X POST https://api.whitecross.health/api/auth/refresh \
  -H "Authorization: Bearer $TOKEN"

# New token returned
{ "token": "eyJhbGci...", "expiresIn": 28800 }
```

---

## CSRF Protection (Required for Mutations)

### Get CSRF Token

CSRF tokens are included in response headers of GET requests:

```bash
curl -i https://api.whitecross.health/api/students \
  -H "Authorization: Bearer $TOKEN"

# Response headers include:
# X-CSRF-Token: AbCdEf123456...
# Set-Cookie: _csrf=AbCdEf123456...; HttpOnly; Secure
```

### Include CSRF Token in POST/PUT/DELETE

```bash
CSRF_TOKEN="AbCdEf123456..."

curl -X POST https://api.whitecross.health/api/health-records \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-CSRF-Token: $CSRF_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"studentId": "...", "type": "immunization", "data": {...}}'
```

**OR** include in request body as `_csrf` field:

```bash
curl -X POST https://api.whitecross.health/api/health-records \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"_csrf": "AbCdEf123456...", "studentId": "...", ...}'
```

---

## Role-Based Access Control (RBAC)

### Role Hierarchy (Lowest to Highest)

```
Level 0: STUDENT              (view own info)
Level 1: PARENT_GUARDIAN      (view children's info)
Level 2: SCHOOL_NURSE         (health records at school)
Level 3: SCHOOL_ADMINISTRATOR (school operations)
Level 4: DISTRICT_NURSE       (health across schools)
Level 5: DISTRICT_ADMINISTRATOR (district management)
Level 6: SYSTEM_ADMINISTRATOR (full system access)
Level 7: SUPER_ADMIN          (unrestricted access)
```

### Common Permissions

| Permission | Description | Required Role (Minimum) |
|------------|-------------|-------------------------|
| `read_student_basic` | View student non-PHI | student |
| `read_student_health` | View student PHI | parent_guardian |
| `read_health_records` | View health records | school_nurse |
| `create_health_records` | Create health records | school_nurse |
| `administer_medications` | Give medications | school_nurse |
| `manage_users` | User management | district_administrator |
| `view_audit_logs` | Access audit logs | district_administrator |
| `manage_system` | System configuration | system_administrator |

---

## Common HTTP Status Codes

| Code | Meaning | Common Cause | Solution |
|------|---------|--------------|----------|
| **200** | OK | Success | - |
| **201** | Created | Resource created | - |
| **400** | Bad Request | Invalid input data | Check request body/params |
| **401** | Unauthorized | Missing/invalid token | Login or refresh token |
| **403** | Forbidden | Insufficient permissions | Check role/permissions |
| **404** | Not Found | Resource doesn't exist | Verify ID/path |
| **409** | Conflict | Duplicate resource | Check unique constraints |
| **422** | Unprocessable Entity | Validation failed | Fix validation errors |
| **429** | Too Many Requests | Rate limit exceeded | Wait and retry (check Retry-After header) |
| **500** | Internal Server Error | Server error | Contact support |

---

## Rate Limits

### Login Endpoint

- **Per User**: 5 attempts / 15 minutes → 30 min lockout
- **Per IP**: 10 attempts / 15 minutes → 60 min lockout

### General API Endpoints

- **Authenticated**: 100 requests / minute
- **Unauthenticated**: 20 requests / minute

### Rate Limit Headers

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1735123456
Retry-After: 60  (when limit exceeded)
```

---

## Security Headers (Applied to All Responses)

```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Content-Security-Policy: default-src 'self'; ...
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), camera=(), microphone=()
```

---

## Endpoint Security Requirements

### Public Endpoints (No Auth)

- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/forgot-password`
- `GET /api/auth/google` (OAuth initiation)
- `GET /api/health` (health check)
- `GET /docs` (API documentation)

### JWT Required

- Most API endpoints require `Authorization: Bearer <token>`
- Example: `/api/students`, `/api/medications`, `/api/health-records`

### JWT + CSRF Required

All mutations (POST/PUT/DELETE/PATCH) except:
- `/api/auth/*` (auth endpoints)
- `/api/webhook/*` (webhook endpoints)
- `/api/public/*` (public endpoints)

### JWT + Role Required

| Endpoint Pattern | Minimum Role |
|------------------|--------------|
| `/api/students` | school_nurse |
| `/api/health-records` | school_nurse |
| `/api/medications/:id/administer` | school_nurse |
| `/api/administration/*` | district_administrator |
| `/api/audit/*` | district_administrator |
| `/api/integration/*` | system_administrator |

### API Key Required

- `/api/integration/sync` - Integration sync
- `/api/integration/webhooks` - Webhook management
- `/api/integration/status` - Integration status (API key OR JWT)

---

## JavaScript/TypeScript Example

```typescript
// Login and store token
async function login(email: string, password: string) {
  const response = await fetch('https://api.whitecross.health/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();
  localStorage.setItem('token', data.token); // Or secure storage
  return data.user;
}

// Make authenticated request
async function getStudents() {
  const token = localStorage.getItem('token');

  const response = await fetch('https://api.whitecross.health/api/students', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (response.status === 401) {
    // Token expired, redirect to login
    window.location.href = '/login';
    return;
  }

  return response.json();
}

// Make mutation with CSRF
async function createHealthRecord(data: any) {
  const token = localStorage.getItem('token');

  // First, get CSRF token from a GET request
  const csrfResponse = await fetch('https://api.whitecross.health/api/students', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const csrfToken = csrfResponse.headers.get('X-CSRF-Token');

  // Then make mutation
  const response = await fetch('https://api.whitecross.health/api/health-records', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'X-CSRF-Token': csrfToken!,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  return response.json();
}
```

---

## Python Example

```python
import requests

class WhiteCrossAPI:
    def __init__(self, base_url='https://api.whitecross.health'):
        self.base_url = base_url
        self.token = None
        self.csrf_token = None

    def login(self, email, password):
        response = requests.post(
            f'{self.base_url}/api/auth/login',
            json={'email': email, 'password': password}
        )
        response.raise_for_status()

        data = response.json()
        self.token = data['token']
        return data['user']

    def get_students(self):
        response = requests.get(
            f'{self.base_url}/api/students',
            headers={'Authorization': f'Bearer {self.token}'}
        )

        # Store CSRF token for mutations
        self.csrf_token = response.headers.get('X-CSRF-Token')

        response.raise_for_status()
        return response.json()['students']

    def create_health_record(self, data):
        response = requests.post(
            f'{self.base_url}/api/health-records',
            headers={
                'Authorization': f'Bearer {self.token}',
                'X-CSRF-Token': self.csrf_token,
                'Content-Type': 'application/json'
            },
            json=data
        )
        response.raise_for_status()
        return response.json()

# Usage
api = WhiteCrossAPI()
user = api.login('nurse@school.edu', 'SecurePass123!')
students = api.get_students()
record = api.create_health_record({'studentId': '...', ...})
```

---

## Error Handling

### Common Error Response Format

```json
{
  "error": "Error type",
  "code": "ERROR_CODE",
  "message": "Human-readable error message",
  "details": {
    "field": "Additional context"
  }
}
```

### Handle Common Errors

```typescript
async function handleAPIRequest() {
  try {
    const response = await fetch(url, options);

    // Check status code
    if (response.status === 401) {
      // Unauthorized - redirect to login
      window.location.href = '/login';
      return;
    }

    if (response.status === 403) {
      // Forbidden - insufficient permissions
      alert('You do not have permission to perform this action');
      return;
    }

    if (response.status === 429) {
      // Rate limited
      const retryAfter = response.headers.get('Retry-After');
      console.log(`Rate limited. Retry after ${retryAfter} seconds`);
      return;
    }

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    return await response.json();

  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}
```

---

## Security Best Practices

### ✅ DO

- Store JWT tokens in httpOnly cookies (web) or secure storage (mobile)
- Always use HTTPS in production
- Include CSRF token in all mutations
- Refresh tokens before expiration (< 8 hours)
- Handle 401 errors by redirecting to login
- Implement exponential backoff for rate limits
- Validate SSL certificates
- Log authentication failures

### ❌ DON'T

- Store tokens in localStorage (XSS vulnerable)
- Include tokens in URLs
- Log tokens in console or error messages
- Disable SSL certificate verification
- Ignore rate limit headers
- Hard-code credentials or API keys
- Cache PHI data in browser storage
- Use HTTP (unencrypted) in production

---

## Token Lifecycle

```
┌──────────┐
│  Login   │ → JWT token issued (8h expiry)
└────┬─────┘
     │
     ▼
┌──────────────────┐
│ Use API (< 8h)   │ → Include token in Authorization header
└────┬─────────────┘
     │
     ▼
┌──────────────────┐
│ Refresh (< 8h)   │ → Get new token with extended expiry
└────┬─────────────┘
     │
     ▼
┌──────────────────┐
│ Use API (< 8h)   │ → Continue using new token
└────┬─────────────┘
     │
     ▼
┌──────────────────┐
│ Logout           │ → Token invalidated, session destroyed
└──────────────────┘
```

---

## OAuth Flow (Google/Microsoft)

```
1. User clicks "Sign in with Google/Microsoft"
   → GET /api/auth/google or /api/auth/microsoft

2. Redirected to Google/Microsoft login
   → User authenticates with provider

3. Provider redirects back to callback
   → GET /api/auth/google/callback?code=...

4. Backend exchanges code for user profile
   → User auto-created if new (role: school_nurse)

5. JWT token issued
   → Redirect to dashboard with token

6. Use JWT for API requests
   → Same as local auth flow
```

---

## Troubleshooting

### Token Expired (401)

**Problem**: `{"error": "Unauthorized", "code": "TOKEN_EXPIRED"}`

**Solution**:
```bash
# Option 1: Refresh token
curl -X POST /api/auth/refresh \
  -H "Authorization: Bearer $OLD_TOKEN"

# Option 2: Re-login
curl -X POST /api/auth/login \
  -d '{"email": "...", "password": "..."}'
```

### Insufficient Permissions (403)

**Problem**: `{"error": "Forbidden", "code": "INSUFFICIENT_PERMISSIONS"}`

**Solution**:
- Check user role: `GET /api/users/profile`
- Review required permissions in API docs
- Contact admin for role upgrade

### CSRF Validation Failed (403)

**Problem**: `{"error": "CSRF validation failed"}`

**Solution**:
```bash
# Get fresh CSRF token from any GET request
curl -i /api/students -H "Authorization: Bearer $TOKEN"
# Look for X-CSRF-Token header

# Include in POST/PUT/DELETE
curl -X POST /api/health-records \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-CSRF-Token: $CSRF_TOKEN" \
  -d '{...}'
```

### Rate Limit Exceeded (429)

**Problem**: `{"error": "Too many requests"}`

**Solution**:
```javascript
// Implement exponential backoff
async function retryRequest(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (error.status === 429) {
        const retryAfter = error.headers.get('Retry-After') || 60;
        const delay = Math.pow(2, i) * 1000; // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.max(delay, retryAfter * 1000)));
      } else {
        throw error;
      }
    }
  }
}
```

---

## Support & Resources

- **API Documentation**: https://api.whitecross.health/docs
- **Full Security Docs**: `backend/swagger/security-schemes.yaml`
- **Integration Guide**: `backend/swagger/SECURITY_INTEGRATION_GUIDE.md`
- **Support Email**: api-team@whitecross.health
- **Security Issues**: security@whitecross.health

---

**Print this page for quick reference while developing!**
