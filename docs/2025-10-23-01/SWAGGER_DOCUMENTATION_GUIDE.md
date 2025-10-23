# Swagger API Documentation Guide

## Table of Contents
1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [Accessing Swagger UI](#accessing-swagger-ui)
4. [Environment-Specific Configurations](#environment-specific-configurations)
5. [Security Configuration](#security-configuration)
6. [Production Deployment](#production-deployment)
7. [Troubleshooting](#troubleshooting)
8. [API Documentation Best Practices](#api-documentation-best-practices)

---

## Overview

White Cross Healthcare Platform uses **Swagger/OpenAPI 3.0** for comprehensive API documentation. The Swagger UI provides:

- **Interactive API Explorer**: Test endpoints directly from the browser
- **Complete API Reference**: All endpoints, parameters, and response schemas
- **Authentication Integration**: Built-in JWT authentication support
- **HIPAA Compliance Info**: Security and compliance documentation
- **Code Examples**: Request/response examples for all endpoints

### Swagger Stack

- **hapi-swagger**: ^17.3.2 - Hapi plugin for Swagger documentation
- **swagger-jsdoc**: ^6.2.8 - JSDoc annotations to OpenAPI specification
- **swagger-ui-express**: ^5.0.1 - Swagger UI rendering

---

## Quick Start

### 1. Start the Server

```bash
# Development
cd backend
npm run dev

# Production
npm start
```

### 2. Access Swagger UI

Once the server is running, Swagger UI is available at:

- **Documentation**: http://localhost:3001/docs
- **Swagger UI**: http://localhost:3001/swagger/
- **OpenAPI JSON**: http://localhost:3001/swagger.json
- **Health Check**: http://localhost:3001/health/swagger

### 3. Authenticate

To test protected endpoints:

1. Click the **"Authorize"** button (top right)
2. Get a JWT token:
   - Use POST /api/v1/auth/login endpoint
   - Copy the token from the response
3. Enter the token in format: `Bearer <your-token>`
4. Click **"Authorize"**
5. All subsequent "Try it out" requests will include authentication

---

## Accessing Swagger UI

### Local Development

```
Base URL: http://localhost:3001
Swagger UI: http://localhost:3001/docs
OpenAPI JSON: http://localhost:3001/swagger.json
Health Check: http://localhost:3001/health/swagger
```

### Staging Environment

```
Base URL: https://api-staging.whitecross.health
Swagger UI: https://api-staging.whitecross.health/docs
OpenAPI JSON: https://api-staging.whitecross.health/swagger.json
Health Check: https://api-staging.whitecross.health/health/swagger
```

### Production Environment

```
Base URL: https://api.whitecross.health
Swagger UI: https://api.whitecross.health/docs (if enabled)
OpenAPI JSON: https://api.whitecross.health/swagger.json (if enabled)
Health Check: https://api.whitecross.health/health/swagger
```

**Note**: Swagger UI is **disabled by default in production** for security reasons.

---

## Environment-Specific Configurations

### Development Environment

**Recommended Settings** (.env):

```env
NODE_ENV=development
SWAGGER_ENABLE_IN_PRODUCTION=false
SWAGGER_REQUIRE_AUTH=false
SWAGGER_HOST=localhost:3001
SWAGGER_ALLOWED_IPS=
SWAGGER_ENABLE_RATE_LIMITING=true
SWAGGER_RATE_LIMIT_MAX=100
SWAGGER_RATE_LIMIT_WINDOW_MS=900000
SWAGGER_ENABLE_CSP=true
SWAGGER_ENABLE_CORS=true
```

**Features**:
- Swagger UI enabled by default
- No authentication required
- No IP restrictions
- Permissive rate limiting
- Full CORS enabled
- Debug mode enabled

### Staging Environment

**Recommended Settings** (.env):

```env
NODE_ENV=staging
SWAGGER_ENABLE_IN_PRODUCTION=true
SWAGGER_REQUIRE_AUTH=true
SWAGGER_HOST=api-staging.whitecross.health
SWAGGER_ALLOWED_IPS=10.0.0.1,10.0.0.2,192.168.1.100
SWAGGER_ENABLE_RATE_LIMITING=true
SWAGGER_RATE_LIMIT_MAX=50
SWAGGER_RATE_LIMIT_WINDOW_MS=900000
SWAGGER_ENABLE_CSP=true
SWAGGER_ENABLE_CORS=true
```

**Features**:
- Swagger UI explicitly enabled
- Authentication required
- IP whitelist for team members
- Moderate rate limiting
- Full security headers
- CORS enabled for frontend testing

### Production Environment

**Recommended Settings** (.env):

```env
NODE_ENV=production
SWAGGER_ENABLE_IN_PRODUCTION=false
SWAGGER_REQUIRE_AUTH=true
SWAGGER_HOST=api.whitecross.health
SWAGGER_ALLOWED_IPS=<admin-ips-only>
SWAGGER_ENABLE_RATE_LIMITING=true
SWAGGER_RATE_LIMIT_MAX=20
SWAGGER_RATE_LIMIT_WINDOW_MS=900000
SWAGGER_ENABLE_CSP=true
SWAGGER_ENABLE_CORS=false
```

**Features**:
- Swagger UI disabled by default
- Authentication required if enabled
- Strict IP whitelist
- Restrictive rate limiting
- Full security headers
- CORS disabled or restricted

---

## Security Configuration

### Authentication Methods

#### 1. JWT Bearer Token (Primary)

```bash
# Login to get token
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "nurse@school.edu",
  "password": "SecurePassword123!"
}

# Use token in subsequent requests
GET /api/v1/students
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### 2. API Key (Integrations)

```bash
# Request with API Key
GET /api/v1/students
X-API-Key: your-api-key-here
```

### IP Whitelisting

Restrict Swagger UI access to specific IP addresses:

```env
# Single IP
SWAGGER_ALLOWED_IPS=192.168.1.100

# Multiple IPs
SWAGGER_ALLOWED_IPS=10.0.0.1,10.0.0.2,192.168.1.100

# Allow all (not recommended for production)
SWAGGER_ALLOWED_IPS=*

# No restrictions (empty)
SWAGGER_ALLOWED_IPS=
```

### Rate Limiting

Protect Swagger endpoints from abuse:

```env
# Maximum requests from single IP
SWAGGER_RATE_LIMIT_MAX=100

# Time window in milliseconds (15 minutes)
SWAGGER_RATE_LIMIT_WINDOW_MS=900000

# Disable rate limiting (not recommended)
SWAGGER_ENABLE_RATE_LIMITING=false
```

### Security Headers

Swagger middleware automatically adds security headers:

- **Content-Security-Policy**: Restricts resource loading
- **X-Frame-Options**: Prevents clickjacking (SAMEORIGIN)
- **X-Content-Type-Options**: Prevents MIME sniffing (nosniff)
- **X-XSS-Protection**: Enables XSS filter in older browsers
- **Referrer-Policy**: Controls referrer information (no-referrer)
- **Permissions-Policy**: Disables unnecessary browser features

Disable security headers (not recommended):

```env
SWAGGER_ENABLE_CSP=false
```

---

## Production Deployment

### Option 1: Disable Swagger UI (Recommended)

**Most Secure**: Completely disable Swagger UI in production.

```env
SWAGGER_ENABLE_IN_PRODUCTION=false
```

**Access Documentation**:
- Host Swagger UI on separate documentation server
- Use static documentation site (e.g., generated with Redoc)
- Provide OpenAPI JSON file for download

### Option 2: Enable with Restrictions

**Controlled Access**: Enable Swagger UI with strict security.

```env
SWAGGER_ENABLE_IN_PRODUCTION=true
SWAGGER_REQUIRE_AUTH=true
SWAGGER_ALLOWED_IPS=<admin-ips-only>
SWAGGER_RATE_LIMIT_MAX=20
```

**Additional Measures**:
1. **Reverse Proxy**: Use Nginx/Apache for additional IP filtering
2. **VPN Access**: Require VPN connection for documentation access
3. **Basic Auth**: Add HTTP Basic Authentication at proxy level
4. **Audit Logging**: Monitor all Swagger UI access attempts

### Option 3: Separate Documentation Server

**Best of Both Worlds**: Run documentation on separate subdomain.

```bash
# Production API (no Swagger)
api.whitecross.health

# Documentation Server (Swagger UI)
docs.whitecross.health
```

**Benefits**:
- Production API remains secure
- Documentation accessible but isolated
- Can implement different security policies
- Easier to scale independently

### Nginx Configuration Example

```nginx
# Production API server (Swagger disabled)
server {
    listen 443 ssl http2;
    server_name api.whitecross.health;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Documentation server (Swagger enabled with restrictions)
server {
    listen 443 ssl http2;
    server_name docs.whitecross.health;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # IP whitelist
    allow 10.0.0.0/8;
    allow 192.168.1.100;
    deny all;

    # Basic authentication
    auth_basic "API Documentation";
    auth_basic_user_file /etc/nginx/.htpasswd;

    location / {
        proxy_pass http://localhost:3002;  # Separate docs server
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## Troubleshooting

### Swagger UI Not Loading

**Problem**: Swagger UI shows blank page or 404 error.

**Solutions**:
1. Check server is running: `curl http://localhost:3001/health`
2. Verify Swagger is enabled: Check `SWAGGER_ENABLE_IN_PRODUCTION` env var
3. Check logs for errors: `npm run dev` or check log files
4. Verify routes are registered: Check `/health/swagger` endpoint

```bash
# Check Swagger health
curl http://localhost:3001/health/swagger

# Expected response
{
  "status": "available",
  "environment": "development",
  "endpoints": {
    "documentation": "http://localhost:3001/docs",
    "swaggerUI": "http://localhost:3001/swagger/",
    "json": "http://localhost:3001/swagger.json"
  }
}
```

### Authentication Not Working

**Problem**: "Authorize" button doesn't work or endpoints return 401.

**Solutions**:
1. Verify token format: Must be `Bearer <token>` (note the space)
2. Check token expiration: Login again if token expired
3. Verify JWT secret: Check `JWT_SECRET` in .env matches server
4. Test login endpoint: Ensure you can obtain valid token

```bash
# Test authentication flow
# 1. Login
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"nurse@school.edu","password":"Password123!"}'

# 2. Copy token from response
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# 3. Test protected endpoint
curl -X GET http://localhost:3001/api/v1/students \
  -H "Authorization: Bearer $TOKEN"
```

### Rate Limit Errors (429)

**Problem**: Getting "Too Many Requests" errors.

**Solutions**:
1. Wait for rate limit window to reset
2. Increase rate limit: Adjust `SWAGGER_RATE_LIMIT_MAX`
3. Increase window: Adjust `SWAGGER_RATE_LIMIT_WINDOW_MS`
4. Disable rate limiting: `SWAGGER_ENABLE_RATE_LIMITING=false` (dev only)

```env
# Increase rate limit for development
SWAGGER_RATE_LIMIT_MAX=500
SWAGGER_RATE_LIMIT_WINDOW_MS=900000
```

### IP Whitelist Blocking Access

**Problem**: Can't access Swagger UI due to IP restrictions.

**Solutions**:
1. Add your IP to whitelist: `SWAGGER_ALLOWED_IPS=your-ip,other-ips`
2. Check your current IP: `curl ifconfig.me`
3. Temporarily allow all: `SWAGGER_ALLOWED_IPS=*` (dev only)
4. Remove restrictions: `SWAGGER_ALLOWED_IPS=` (empty)

```bash
# Find your current IP
curl ifconfig.me

# Or
curl https://api.ipify.org

# Add to .env
SWAGGER_ALLOWED_IPS=123.45.67.89
```

### CORS Errors

**Problem**: Browser console shows CORS errors.

**Solutions**:
1. Enable CORS for Swagger: `SWAGGER_ENABLE_CORS=true`
2. Check origin: Verify `CORS_ORIGIN` in .env
3. Add origin to allowlist: Update CORS configuration
4. Check browser console for specific CORS error

```env
# Enable CORS for local development
SWAGGER_ENABLE_CORS=true
CORS_ORIGIN=http://localhost:5173
```

### Documentation Not Updating

**Problem**: Swagger UI shows old API documentation.

**Solutions**:
1. Clear browser cache: Hard refresh (Ctrl+Shift+R)
2. Restart server: Changes require server restart
3. Check route registration: Verify routes are properly tagged
4. Rebuild project: `npm run build && npm start`

```bash
# Clear cache and restart
# 1. Stop server (Ctrl+C)
# 2. Clear build cache
rm -rf dist/
# 3. Rebuild
npm run build
# 4. Restart
npm start
```

---

## API Documentation Best Practices

### 1. Route Documentation

Always add Swagger documentation to routes:

```typescript
server.route({
  method: 'GET',
  path: '/api/v1/students/{id}',
  handler: getStudentHandler,
  options: {
    auth: 'jwt',
    tags: ['api', 'students'],
    description: 'Get student by ID',
    notes: 'Returns detailed student information including health records summary',
    validate: {
      params: Joi.object({
        id: Joi.string().uuid().required().description('Student UUID')
      })
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': {
            description: 'Student found',
            schema: StudentSchema
          },
          '404': {
            description: 'Student not found',
            schema: ErrorSchema
          }
        }
      }
    }
  }
});
```

### 2. Schema Documentation

Use Joi for request/response validation and documentation:

```typescript
const StudentSchema = Joi.object({
  id: Joi.string().uuid().description('Student unique identifier'),
  firstName: Joi.string().max(50).required().description('Student first name'),
  lastName: Joi.string().max(50).required().description('Student last name'),
  dateOfBirth: Joi.date().iso().required().description('Date of birth (ISO 8601)'),
  grade: Joi.number().min(1).max(12).required().description('Current grade level'),
  status: Joi.string().valid('active', 'inactive').default('active').description('Student status')
}).label('Student');
```

### 3. Error Documentation

Document all possible error responses:

```typescript
plugins: {
  'hapi-swagger': {
    responses: {
      '200': {
        description: 'Success',
        schema: SuccessSchema
      },
      '400': {
        description: 'Bad Request - Invalid input',
        schema: ErrorSchema
      },
      '401': {
        description: 'Unauthorized - Authentication required',
        schema: ErrorSchema
      },
      '403': {
        description: 'Forbidden - Insufficient permissions',
        schema: ErrorSchema
      },
      '404': {
        description: 'Not Found - Resource does not exist',
        schema: ErrorSchema
      },
      '422': {
        description: 'Unprocessable Entity - Validation error',
        schema: ValidationErrorSchema
      },
      '500': {
        description: 'Internal Server Error',
        schema: ErrorSchema
      }
    }
  }
}
```

### 4. Examples

Provide request/response examples:

```typescript
validate: {
  payload: Joi.object({
    firstName: Joi.string().required().example('John'),
    lastName: Joi.string().required().example('Doe'),
    email: Joi.string().email().required().example('john.doe@school.edu'),
    dateOfBirth: Joi.date().iso().required().example('2010-05-15')
  })
}
```

### 5. Tags and Grouping

Use consistent tags for organization:

```typescript
options: {
  tags: ['api', 'students', 'health-records'],  // Multiple tags for grouping
  description: 'Get student health records',
  notes: 'Returns all health records for the specified student. Requires read:health_records permission.'
}
```

### 6. Deprecation

Mark deprecated endpoints:

```typescript
options: {
  tags: ['api', 'students', 'deprecated'],
  description: '[DEPRECATED] Get student by ID',
  notes: 'This endpoint is deprecated and will be removed in v2. Use GET /api/v1/students/{id} instead.'
}
```

---

## Additional Resources

- **Hapi Swagger Documentation**: https://github.com/glennjones/hapi-swagger
- **OpenAPI Specification**: https://swagger.io/specification/
- **Joi Validation**: https://joi.dev/api/
- **White Cross API Docs**: https://docs.whitecross.health
- **Support**: support@whitecross.health

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-10-23 | Initial Swagger infrastructure setup |

---

**Last Updated**: October 23, 2025
**Maintained By**: White Cross Development Team
