# Swagger Quick Start Guide

## 🚀 5-Minute Setup

### 1. Update Main Server (Choose One Option)

#### Option A: Replace index.ts (Recommended)
```bash
cd backend/src
mv index.ts index.ts.backup
mv index-enhanced.ts index.ts
```

#### Option B: Manual Integration
Add these lines to `src/index.ts`:

```typescript
// Add import (line ~47)
import { configureSwaggerMiddleware, swaggerHealthCheck } from './middleware/swagger';

// After await server.register(swaggerOptions); (line ~77)
await configureSwaggerMiddleware(server, {
  enableInProduction: process.env.SWAGGER_ENABLE_IN_PRODUCTION === 'true',
  requireAuth: process.env.SWAGGER_REQUIRE_AUTH === 'true',
  enableRateLimiting: process.env.SWAGGER_ENABLE_RATE_LIMITING !== 'false',
  enableCSP: process.env.SWAGGER_ENABLE_CSP !== 'false',
  enableCORS: process.env.SWAGGER_ENABLE_CORS !== 'false',
});

// After health check route (line ~118)
server.route({
  method: 'GET',
  path: '/health/swagger',
  handler: swaggerHealthCheck,
  options: {
    auth: false,
    tags: ['api', 'health', 'documentation'],
    description: 'Swagger documentation health check'
  }
});
```

### 2. Add Environment Variables

Append to `.env`:
```env
# Swagger Configuration
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

### 3. Start Server

```bash
npm run dev
```

### 4. Access Swagger UI

Open in browser:
- **Swagger UI**: http://localhost:3001/docs
- **Health Check**: http://localhost:3001/health/swagger

---

## 📋 Verification Checklist

```bash
# 1. Check server health
curl http://localhost:3001/health

# 2. Check Swagger health
curl http://localhost:3001/health/swagger

# 3. Access Swagger UI
# Open: http://localhost:3001/docs
```

Expected Swagger health response:
```json
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

---

## 🔒 Environment Presets

### Development (Copy/Paste to .env)
```env
NODE_ENV=development
SWAGGER_ENABLE_IN_PRODUCTION=false
SWAGGER_REQUIRE_AUTH=false
SWAGGER_HOST=localhost:3001
SWAGGER_ALLOWED_IPS=
SWAGGER_ENABLE_RATE_LIMITING=true
SWAGGER_RATE_LIMIT_MAX=100
SWAGGER_RATE_LIMIT_WINDOW_MS=900000
```

### Staging (Copy/Paste to .env)
```env
NODE_ENV=staging
SWAGGER_ENABLE_IN_PRODUCTION=true
SWAGGER_REQUIRE_AUTH=true
SWAGGER_HOST=api-staging.whitecross.health
SWAGGER_ALLOWED_IPS=10.0.0.1,10.0.0.2
SWAGGER_ENABLE_RATE_LIMITING=true
SWAGGER_RATE_LIMIT_MAX=50
SWAGGER_RATE_LIMIT_WINDOW_MS=900000
```

### Production (Copy/Paste to .env)
```env
NODE_ENV=production
SWAGGER_ENABLE_IN_PRODUCTION=false
SWAGGER_REQUIRE_AUTH=true
SWAGGER_HOST=api.whitecross.health
SWAGGER_ALLOWED_IPS=
SWAGGER_ENABLE_RATE_LIMITING=true
SWAGGER_RATE_LIMIT_MAX=20
SWAGGER_RATE_LIMIT_WINDOW_MS=900000
```

---

## 🔑 Testing Authentication

### 1. Get JWT Token
```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nurse@school.edu",
    "password": "Password123!"
  }'
```

### 2. Use Token in Swagger UI
1. Click "Authorize" button (top right)
2. Enter: `Bearer <your-token-here>`
3. Click "Authorize"
4. Try "Try it out" on any endpoint

---

## ⚡ Quick Commands

```bash
# Start development server
npm run dev

# Check Swagger health
curl http://localhost:3001/health/swagger

# Get OpenAPI JSON
curl http://localhost:3001/swagger.json

# Find your public IP
curl ifconfig.me

# Restart with fresh cache
rm -rf dist/ && npm run build && npm start
```

---

## 🐛 Common Issues

### Swagger UI Not Loading
```bash
# Check if server is running
curl http://localhost:3001/health

# Check Swagger status
curl http://localhost:3001/health/swagger

# Check environment variable
echo $SWAGGER_ENABLE_IN_PRODUCTION
```

### Rate Limit Error (429)
```env
# Increase limit in .env
SWAGGER_RATE_LIMIT_MAX=500
```

### IP Blocked
```bash
# Find your IP
curl ifconfig.me

# Add to .env
SWAGGER_ALLOWED_IPS=<your-ip>
```

### CORS Error
```env
# Enable CORS in .env
SWAGGER_ENABLE_CORS=true
CORS_ORIGIN=http://localhost:5173
```

---

## 📚 Documentation

- **Full Guide**: `backend/SWAGGER_DOCUMENTATION_GUIDE.md`
- **Implementation**: `backend/SWAGGER_IMPLEMENTATION_SUMMARY.md`
- **Env Config**: `backend/.env.swagger-enhanced`

---

## 🆘 Support

**Issues?** Check the troubleshooting section in `SWAGGER_DOCUMENTATION_GUIDE.md`

**Email**: support@whitecross.health

---

**Quick Start Version**: 1.0.0
**Last Updated**: October 23, 2025
