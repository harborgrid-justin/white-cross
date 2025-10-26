# Next.js API Routes - Setup and Testing Guide

## Quick Start

### 1. Install Dependencies

```bash
cd nextjs
npm install jsonwebtoken
```

### 2. Configure Environment Variables

Create or update `.env.local`:

```env
# Backend API URL
BACKEND_URL=http://localhost:3001

# JWT Secrets (must match backend)
JWT_SECRET=your-secret-key-here
JWT_REFRESH_SECRET=your-refresh-secret-key-here

# Optional: Stripe Webhook
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
```

### 3. Start the Application

```bash
# Start backend first (from root)
cd ..
npm run dev:backend

# Start Next.js (from nextjs directory)
cd nextjs
npm run dev
```

Next.js will run on `http://localhost:3000`
Backend will run on `http://localhost:3001`

---

## Testing the API Routes

### Method 1: Using cURL

#### 1. Login to Get Token

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nurse@school.edu",
    "password": "TestPassword123!"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": { ... }
  }
}
```

**Save the token** - you'll need it for subsequent requests.

#### 2. List Students (Authenticated)

```bash
TOKEN="your-token-here"

curl -X GET http://localhost:3000/api/v1/students \
  -H "Authorization: Bearer $TOKEN"
```

#### 3. Create Student

```bash
curl -X POST http://localhost:3000/api/v1/students \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "dateOfBirth": "2010-05-15",
    "grade": "5th",
    "gender": "M"
  }'
```

#### 4. Get Specific Student

```bash
STUDENT_ID="student-uuid-here"

curl -X GET http://localhost:3000/api/v1/students/$STUDENT_ID \
  -H "Authorization: Bearer $TOKEN"
```

#### 5. Update Student

```bash
curl -X PUT http://localhost:3000/api/v1/students/$STUDENT_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Doe"
  }'
```

#### 6. Upload File

```bash
curl -X POST http://localhost:3000/api/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/path/to/document.pdf" \
  -F "category=documents"
```

#### 7. GraphQL Query

```bash
curl -X POST http://localhost:3000/api/graphql \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { students { id firstName lastName } }"
  }'
```

---

### Method 2: Using Postman

#### Setup

1. Import collection by creating new requests
2. Set base URL: `http://localhost:3000`
3. Create environment variable for token

#### Create Login Request

- **Method**: POST
- **URL**: `{{baseUrl}}/api/auth/login`
- **Headers**:
  - `Content-Type: application/json`
- **Body** (raw JSON):
```json
{
  "email": "nurse@school.edu",
  "password": "TestPassword123!"
}
```
- **Tests** (to save token):
```javascript
if (pm.response.code === 200) {
    var jsonData = pm.response.json();
    pm.environment.set("token", jsonData.data.token);
}
```

#### Create Authenticated Request

- **Method**: GET
- **URL**: `{{baseUrl}}/api/v1/students`
- **Headers**:
  - `Authorization: Bearer {{token}}`

---

### Method 3: Using JavaScript/TypeScript

#### In React Component

```typescript
// Login
async function login(email: string, password: string) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();

  if (data.success) {
    // Store token
    localStorage.setItem('token', data.data.token);
    return data.data.user;
  }

  throw new Error(data.message);
}

// Get students
async function getStudents() {
  const token = localStorage.getItem('token');

  const response = await fetch('/api/v1/students', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await response.json();
  return data.data;
}

// Create student
async function createStudent(studentData: any) {
  const token = localStorage.getItem('token');

  const response = await fetch('/api/v1/students', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(studentData)
  });

  const data = await response.json();
  return data.data;
}
```

#### Using Axios

```typescript
import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: 'http://localhost:3000/api'
});

// Add auth interceptor
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Login
const { data } = await api.post('/auth/login', {
  email: 'nurse@school.edu',
  password: 'TestPassword123!'
});

// Get students
const students = await api.get('/v1/students');

// Create student
const newStudent = await api.post('/v1/students', {
  firstName: 'John',
  lastName: 'Doe',
  dateOfBirth: '2010-05-15',
  grade: '5th'
});
```

---

## Testing Rate Limiting

### Test Authentication Rate Limit (5 per 15 min)

```bash
# Run this 6 times quickly - 6th should be rate limited
for i in {1..6}; do
  echo "Request $i:"
  curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"wrong@email.com","password":"wrong"}' \
    -w "\nStatus: %{http_code}\n\n"
  sleep 1
done
```

**Expected**: First 5 requests get 401 (unauthorized), 6th gets 429 (rate limited)

### Test API Rate Limit (100 per min)

```bash
# This script makes 105 requests - last 5 should be rate limited
TOKEN="your-token-here"

for i in {1..105}; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
    -H "Authorization: Bearer $TOKEN" \
    http://localhost:3000/api/v1/students)

  if [ "$STATUS" = "429" ]; then
    echo "Request $i: Rate limited (429)"
  fi
done
```

---

## Testing File Upload

### Upload PDF Document

```bash
TOKEN="your-token-here"

curl -X POST http://localhost:3000/api/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/path/to/document.pdf" \
  -F "category=documents"
```

### Upload Image

```bash
curl -X POST http://localhost:3000/api/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/path/to/image.jpg" \
  -F "category=images"
```

### Test File Size Limit (10MB)

```bash
# Create 11MB file
dd if=/dev/zero of=large_file.bin bs=1M count=11

# Try to upload (should fail with 400)
curl -X POST http://localhost:3000/api/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@large_file.bin" \
  -F "category=test"
```

### Test Invalid File Type

```bash
# Create .exe file
echo "test" > malicious.exe

# Try to upload (should fail with 400)
curl -X POST http://localhost:3000/api/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@malicious.exe" \
  -F "category=test"
```

---

## Testing GraphQL Endpoint

### Simple Query

```bash
TOKEN="your-token-here"

curl -X POST http://localhost:3000/api/graphql \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { students { id firstName lastName grade } }"
  }'
```

### Query with Variables

```bash
curl -X POST http://localhost:3000/api/graphql \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query GetStudent($id: ID!) { student(id: $id) { id firstName lastName } }",
    "variables": { "id": "student-uuid-here" }
  }'
```

### Mutation

```bash
curl -X POST http://localhost:3000/api/graphql \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation CreateStudent($input: StudentInput!) { createStudent(input: $input) { id firstName lastName } }",
    "variables": {
      "input": {
        "firstName": "John",
        "lastName": "Doe",
        "dateOfBirth": "2010-05-15",
        "grade": "5th"
      }
    }
  }'
```

---

## Testing Audit Logging

### Verify PHI Access Logging

1. Make request to PHI endpoint:
```bash
curl -X GET http://localhost:3000/api/v1/students \
  -H "Authorization: Bearer $TOKEN"
```

2. Check audit logs (requires ADMIN role):
```bash
curl -X GET http://localhost:3000/api/v1/compliance/audit-logs \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

3. Verify log entry contains:
   - User ID
   - Action: `VIEW_PHI`
   - Resource: `Student`
   - IP address
   - User agent
   - Timestamp

---

## Testing Cache Revalidation

### Test Cache Hit

```bash
TOKEN="your-token-here"

# First request (cache miss)
time curl -X GET http://localhost:3000/api/v1/students \
  -H "Authorization: Bearer $TOKEN" \
  -o /dev/null -s -w "Time: %{time_total}s\n"

# Second request (cache hit - should be faster)
time curl -X GET http://localhost:3000/api/v1/students \
  -H "Authorization: Bearer $TOKEN" \
  -o /dev/null -s -w "Time: %{time_total}s\n"
```

### Test Cache Invalidation

```bash
# Get students (cache miss)
curl -X GET http://localhost:3000/api/v1/students \
  -H "Authorization: Bearer $TOKEN"

# Get students again (cache hit)
curl -X GET http://localhost:3000/api/v1/students \
  -H "Authorization: Bearer $TOKEN"

# Create new student (invalidates cache)
curl -X POST http://localhost:3000/api/v1/students \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"User","dateOfBirth":"2010-01-01","grade":"5th"}'

# Get students again (cache miss - will include new student)
curl -X GET http://localhost:3000/api/v1/students \
  -H "Authorization: Bearer $TOKEN"
```

---

## Testing Role-Based Access Control

### Test NURSE Role Access

```bash
# Login as nurse
NURSE_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"nurse@school.edu","password":"TestPassword123!"}')

NURSE_TOKEN=$(echo $NURSE_RESPONSE | jq -r '.data.token')

# Try to access admin-only endpoint (should fail with 403)
curl -X GET http://localhost:3000/api/v1/compliance/audit-logs \
  -H "Authorization: Bearer $NURSE_TOKEN" \
  -w "\nStatus: %{http_code}\n"
```

### Test ADMIN Role Access

```bash
# Login as admin
ADMIN_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@school.edu","password":"TestPassword123!"}')

ADMIN_TOKEN=$(echo $ADMIN_RESPONSE | jq -r '.data.token')

# Access admin-only endpoint (should succeed with 200)
curl -X GET http://localhost:3000/api/v1/compliance/audit-logs \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -w "\nStatus: %{http_code}\n"
```

---

## Debugging

### Enable Verbose Logging

Add console.log statements in route handlers:

```typescript
// In any route file
console.log('Request headers:', Object.fromEntries(request.headers));
console.log('Request body:', await request.json());
console.log('Auth user:', auth.user);
```

### Check Backend Connectivity

```bash
# Test backend directly
curl http://localhost:3001/health

# Test backend API
curl -X GET http://localhost:3001/api/v1/students \
  -H "Authorization: Bearer $TOKEN"
```

### Common Issues

**Backend Not Running:**
```
Error: Backend service unavailable
Solution: Start backend with `npm run dev:backend`
```

**Invalid Token:**
```
Error: Unauthorized
Solution: Get new token with login endpoint
```

**CORS Errors:**
```
Solution: Use Next.js API routes (already configured)
```

**Rate Limit Errors:**
```
Error: Too Many Requests (429)
Solution: Wait for rate limit reset (check Retry-After header)
```

---

## Load Testing

### Using Apache Bench (ab)

```bash
# Install Apache Bench
# macOS: brew install httpd
# Ubuntu: sudo apt-get install apache2-utils

# Test login endpoint (5 requests)
ab -n 5 -c 1 -p login.json -T application/json \
  http://localhost:3000/api/auth/login

# Test authenticated endpoint (100 requests, 10 concurrent)
ab -n 100 -c 10 -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/v1/students
```

Create `login.json`:
```json
{"email":"nurse@school.edu","password":"TestPassword123!"}
```

### Using k6

```bash
# Install k6
# macOS: brew install k6
# Ubuntu: snap install k6

# Create load-test.js
cat > load-test.js << 'EOF'
import http from 'k6/http';
import { check } from 'k6';

export default function() {
  const loginRes = http.post('http://localhost:3000/api/auth/login',
    JSON.stringify({
      email: 'nurse@school.edu',
      password: 'TestPassword123!'
    }),
    { headers: { 'Content-Type': 'application/json' } }
  );

  check(loginRes, {
    'login status is 200': (r) => r.status === 200,
  });

  const token = loginRes.json('data.token');

  const studentsRes = http.get('http://localhost:3000/api/v1/students', {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  check(studentsRes, {
    'students status is 200': (r) => r.status === 200,
  });
}
EOF

# Run load test (10 virtual users, 30 seconds)
k6 run --vus 10 --duration 30s load-test.js
```

---

## Integration Testing with Playwright

Create `tests/api.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test.describe('API Routes', () => {
  let token: string;

  test.beforeAll(async ({ request }) => {
    // Login and get token
    const response = await request.post('/api/auth/login', {
      data: {
        email: 'nurse@school.edu',
        password: 'TestPassword123!'
      }
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    token = data.data.token;
  });

  test('should list students', async ({ request }) => {
    const response = await request.get('/api/v1/students', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data)).toBe(true);
  });

  test('should create student', async ({ request }) => {
    const response = await request.post('/api/v1/students', {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      data: {
        firstName: 'Test',
        lastName: 'Student',
        dateOfBirth: '2010-01-01',
        grade: '5th'
      }
    });

    expect(response.status()).toBe(201);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data.firstName).toBe('Test');
  });

  test('should enforce rate limiting on auth', async ({ request }) => {
    // Make 6 rapid login attempts (limit is 5)
    const requests = [];
    for (let i = 0; i < 6; i++) {
      requests.push(
        request.post('/api/auth/login', {
          data: {
            email: 'wrong@email.com',
            password: 'wrong'
          }
        })
      );
    }

    const responses = await Promise.all(requests);
    const rateLimited = responses.filter(r => r.status() === 429);

    expect(rateLimited.length).toBeGreaterThan(0);
  });
});
```

Run tests:
```bash
npx playwright test tests/api.spec.ts
```

---

## Monitoring API Performance

### Using Chrome DevTools

1. Open Chrome DevTools (F12)
2. Go to Network tab
3. Make API requests from your app
4. Check:
   - Response times
   - Payload sizes
   - Cache status (from disk cache, from memory cache)
   - Response headers (X-RateLimit-*, Cache-Control)

### Using Next.js Built-in Analytics

Next.js provides built-in performance monitoring. Check server logs for:

```
GET /api/v1/students 200 in 123ms
POST /api/v1/students 201 in 456ms
```

---

## Production Deployment

### Environment Variables

```env
# Production backend URL
BACKEND_URL=https://api.yourcompany.com

# JWT secrets (use strong, unique values)
JWT_SECRET=your-production-secret-key
JWT_REFRESH_SECRET=your-production-refresh-secret-key

# Stripe
STRIPE_WEBHOOK_SECRET=your-stripe-production-webhook-secret
```

### Vercel Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Environment Variable Configuration (Vercel)

1. Go to Project Settings
2. Navigate to Environment Variables
3. Add:
   - `BACKEND_URL`
   - `JWT_SECRET`
   - `JWT_REFRESH_SECRET`
   - `STRIPE_WEBHOOK_SECRET` (if using Stripe)

---

## Troubleshooting Guide

### Issue: "Unauthorized" on all requests

**Cause**: Invalid or expired token

**Solution**:
```bash
# Get new token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"nurse@school.edu","password":"TestPassword123!"}'
```

### Issue: "Backend service unavailable"

**Cause**: Backend not running or wrong URL

**Solution**:
```bash
# Check backend is running
curl http://localhost:3001/health

# Check BACKEND_URL environment variable
echo $BACKEND_URL
```

### Issue: "Too Many Requests" (429)

**Cause**: Rate limit exceeded

**Solution**: Wait for rate limit reset (check Retry-After header) or implement request batching

### Issue: Stale data returned

**Cause**: Cache not invalidated

**Solution**: Cache is automatically invalidated on CREATE/UPDATE/DELETE. If issue persists, restart Next.js server.

---

## Additional Resources

- [Next.js API Routes Documentation](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [JWT Authentication Best Practices](https://tools.ietf.org/html/rfc7519)
- [HIPAA Compliance Guide](https://www.hhs.gov/hipaa/for-professionals/security/index.html)
- [Rate Limiting Strategies](https://www.nginx.com/blog/rate-limiting-nginx/)

---

## Quick Reference

### Authentication Headers

```
Authorization: Bearer <access-token>
```

### Common Response Codes

- 200: Success
- 201: Created
- 401: Unauthorized
- 403: Forbidden
- 429: Too Many Requests
- 500: Server Error

### Rate Limits

- Auth: 5/15min
- API: 100/min
- Read: 200/min
- Expensive: 10/min

### Cache Durations

- Students: 60s
- Medications: 30s
- Health Records: 30s
- Messages: 10s
- Audit Logs: 0s (no cache)

---

**Need Help?**
Check the main documentation: `API_ROUTES_DOCUMENTATION.md`
