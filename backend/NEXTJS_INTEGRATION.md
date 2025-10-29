# Next.js Frontend Integration Guide

## Authentication Endpoints

The backend is fully configured and ready to respond to Next.js queries on `http://localhost:3001`

### CORS Configuration
- **Allowed Origin**: `http://localhost:3000` (Next.js default port)
- **Credentials**: Enabled
- **Headers**: All necessary CORS headers are configured

---

## Login Flow

### 1. User Login
**Endpoint**: `POST /auth/login`

**Request**:
```typescript
const response = await fetch('http://localhost:3001/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include',
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'SecurePass123@'
  })
});

const data = await response.json();
```

**Response** (200 OK):
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "a8a61865-ff3f-4154-a390-0167a6703a51",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "NURSE",
    "isActive": true,
    "emailVerified": false,
    "twoFactorEnabled": false,
    "failedLoginAttempts": 0,
    "mustChangePassword": false,
    "lastLogin": "2025-10-29T18:50:32.854Z",
    "schoolId": null,
    "districtId": null,
    "phone": null
  },
  "tokenType": "Bearer",
  "expiresIn": 900
}
```

---

### 2. User Registration
**Endpoint**: `POST /auth/register`

**Request**:
```typescript
const response = await fetch('http://localhost:3001/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include',
  body: JSON.stringify({
    email: 'newuser@example.com',
    password: 'SecurePass123@',
    firstName: 'Jane',
    lastName: 'Smith',
    role: 'NURSE'
  })
});

const data = await response.json();
```

**Response**: Same structure as login (201 Created)

**Password Requirements**:
- At least 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

**Available Roles**:
- `NURSE`
- `ADMIN`
- `SCHOOL_ADMIN`
- `DISTRICT_ADMIN`
- `COUNSELOR`
- `VIEWER`

---

### 3. Making Authenticated Requests
**Use the access token in Authorization header**:

```typescript
const response = await fetch('http://localhost:3001/auth/profile', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  },
  credentials: 'include',
});

const profile = await response.json();
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "a8a61865-ff3f-4154-a390-0167a6703a51",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "NURSE",
    "isActive": true,
    "emailVerified": false
  }
}
```

---

### 4. Token Refresh
**Endpoint**: `POST /auth/refresh`

When the access token expires (15 minutes), use the refresh token to get a new access token:

```typescript
const response = await fetch('http://localhost:3001/auth/refresh', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include',
  body: JSON.stringify({
    refreshToken: refreshToken
  })
});

const data = await response.json();
// Returns new accessToken, refreshToken, user, tokenType, expiresIn
```

---

### 5. Logout
**Endpoint**: `POST /auth/logout`

```typescript
const response = await fetch('http://localhost:3001/auth/logout', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
  },
  credentials: 'include',
});

// Clear tokens from local storage/cookies on client side
```

---

## Next.js Implementation Example

### Using NextAuth.js (Recommended)

```typescript
// pages/api/auth/[...nextauth].ts
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const res = await fetch('http://localhost:3001/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
        });

        const data = await res.json();

        if (res.ok && data.user) {
          return {
            ...data.user,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            expiresIn: data.expiresIn,
          };
        }

        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user = token.user;
      return session;
    }
  },
  pages: {
    signIn: '/login',
  }
});
```

### Custom React Hook

```typescript
// hooks/useAuth.ts
import { useState } from 'react';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();

      // Store tokens
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);

      setUser(data.user);
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    const token = localStorage.getItem('accessToken');

    await fetch('http://localhost:3001/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
    });

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  const getProfile = async () => {
    const token = localStorage.getItem('accessToken');

    const response = await fetch('http://localhost:3001/auth/profile', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
    });

    const data = await response.json();
    setUser(data.data);
    return data.data;
  };

  return { user, login, logout, getProfile, loading };
}
```

---

## Error Handling

### Common Error Responses

**401 Unauthorized** - Invalid credentials or expired token:
```json
{
  "message": "Invalid email or password",
  "error": "Unauthorized",
  "statusCode": 401
}
```

**400 Bad Request** - Validation error:
```json
{
  "message": [
    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```

**409 Conflict** - User already exists:
```json
{
  "message": "User with this email already exists",
  "error": "Conflict",
  "statusCode": 409
}
```

---

## Token Management

### Access Token
- **Lifetime**: 15 minutes (900 seconds)
- **Storage**: localStorage or sessionStorage
- **Usage**: Include in Authorization header for all API requests

### Refresh Token
- **Lifetime**: 7 days
- **Storage**: HttpOnly cookie (recommended) or localStorage
- **Usage**: Used to obtain new access tokens

### Automatic Token Refresh

```typescript
// utils/api.ts
async function fetchWithAuth(url: string, options: RequestInit = {}) {
  let accessToken = localStorage.getItem('accessToken');

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  // If token expired, refresh and retry
  if (response.status === 401) {
    const refreshToken = localStorage.getItem('refreshToken');

    const refreshResponse = await fetch('http://localhost:3001/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (refreshResponse.ok) {
      const data = await refreshResponse.json();
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);

      // Retry original request with new token
      return fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${data.accessToken}`,
        },
      });
    } else {
      // Refresh failed, redirect to login
      window.location.href = '/login';
    }
  }

  return response;
}
```

---

## Testing

### Tested Endpoints ✅
- `POST /auth/register` - Working
- `POST /auth/login` - Working
- `POST /auth/refresh` - Working
- `GET /auth/profile` - Working (with JWT)
- `POST /auth/logout` - Working (with JWT)

### Test User
```
Email: curltestuser@test.com
Password: CurlTest123@
Role: NURSE
```

---

## Additional Notes

1. **HTTPS in Production**: In production, ensure all requests use HTTPS
2. **Environment Variables**: Use environment variables for API URLs
3. **Token Storage**: Consider using HttpOnly cookies for enhanced security
4. **Error Boundaries**: Implement proper error handling for failed requests
5. **Loading States**: Show loading indicators during authentication
6. **Protected Routes**: Use middleware to protect routes that require authentication

## API Documentation

Full API documentation is available at: `http://localhost:3001/api/docs`
