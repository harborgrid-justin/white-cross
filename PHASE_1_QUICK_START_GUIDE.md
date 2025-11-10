# Phase 1: Quick Start Guide

**For:** Development Team
**Purpose:** Fast implementation of Phase 1 security fixes
**Time to Deploy:** 15-30 minutes

---

## Step 1: Install Dependencies (2 minutes)

```bash
npm install helmet compression cookie-parser @nestjs/swagger jsonwebtoken lru-cache
npm install --save-dev @types/jsonwebtoken @types/compression @types/cookie-parser
```

---

## Step 2: Set Environment Variables (3 minutes)

Create or update `.env` file:

```bash
# Generate secrets: openssl rand -base64 32

JWT_SECRET=YOUR_256_BIT_SECRET_HERE
JWT_REFRESH_SECRET=YOUR_256_BIT_SECRET_HERE
JWT_EXPIRATION=15m
JWT_ISSUER=white-cross-healthcare
JWT_AUDIENCE=white-cross-api

AUDIT_HMAC_SECRET=YOUR_256_BIT_SECRET_HERE
ENCRYPTION_KEY=YOUR_256_BIT_KEY_HERE

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=YOUR_REDIS_PASSWORD

COOKIE_SECRET=YOUR_256_BIT_SECRET_HERE
ALLOWED_ORIGINS=http://localhost:3000,https://your-domain.com

NODE_ENV=development
PORT=3000
```

---

## Step 3: Import SecurityModule (2 minutes)

Update your `app.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SecurityModule } from './reuse/threat/composites/downstream/data_layer/composites/downstream/security.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SecurityModule,  // ← Add this line
    // ... your other modules
  ],
})
export class AppModule {}
```

---

## Step 4: Configure main.ts (10 minutes)

Copy the configuration from:
`/reuse/threat/composites/downstream/data_layer/composites/downstream/main.example.ts`

Key sections to add to your `main.ts`:

1. **Helmet Security Headers**
2. **CORS Configuration**
3. **Compression**
4. **Validation Pipe**
5. **Swagger (optional)**

---

## Step 5: Test Authentication (5 minutes)

### Test 1: Public Endpoint
```bash
curl http://localhost:3000/health
# Should return: 200 OK
```

### Test 2: Protected Endpoint (No Token)
```bash
curl http://localhost:3000/api/v1/threat-intelligence
# Should return: 401 Unauthorized
```

### Test 3: Protected Endpoint (With Token)
```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:3000/api/v1/threat-intelligence
# Should return: 200 OK with data
```

### Test 4: Rate Limiting
```bash
# Run 150 times to exceed limit
for i in {1..150}; do
  curl http://localhost:3000/api/v1/threat-intelligence
done
# Should eventually return: 429 Too Many Requests
```

---

## Step 6: Verify Security Headers (3 minutes)

Visit: https://securityheaders.com/

Enter your domain and check that you get an **A** or **A+** rating.

Expected headers:
- ✅ Strict-Transport-Security
- ✅ Content-Security-Policy
- ✅ X-Frame-Options
- ✅ X-Content-Type-Options
- ✅ Referrer-Policy
- ✅ Permissions-Policy

---

## Step 7: Check Logs (2 minutes)

Monitor application logs for:

```
🚀 Application is running on: http://localhost:3000
🔐 Security headers configured with Helmet
⚕️  HIPAA compliance enabled
✅ Production-ready security configuration active
```

---

## Common Issues & Solutions

### Issue 1: "JWT_SECRET not set"
**Solution:** Set `JWT_SECRET` in `.env` file

### Issue 2: "Cannot connect to Redis"
**Solution:**
- Start Redis: `redis-server`
- Or use MockRedisClient (default for dev)

### Issue 3: "CORS blocked my request"
**Solution:** Add your origin to `ALLOWED_ORIGINS` in `.env`

### Issue 4: "Rate limit too aggressive"
**Solution:** Adjust rate limit in guard configuration or use `@RateLimit()` decorator

---

## Security Checklist

Before deploying to production:

- [ ] All environment variables set with secure random values
- [ ] JWT_SECRET is NOT the default value
- [ ] Redis is configured and accessible
- [ ] HTTPS is enabled (TLS certificates installed)
- [ ] Security headers verified with SecurityHeaders.com
- [ ] CORS configured for your domains only
- [ ] Rate limiting tested and tuned
- [ ] Audit logs are being written
- [ ] Exception handling tested
- [ ] Connection pool monitoring enabled
- [ ] Backup strategy for audit logs implemented

---

## Quick Reference: New Files

### Guards (Apply to controllers)
- `guards/jwt-auth.guard.ts` - JWT authentication
- `guards/roles.guard.ts` - Role authorization
- `guards/permissions.guard.ts` - Permission authorization
- `guards/rate-limit.guard.ts` - Rate limiting

### Decorators (Use on endpoints)
- `@Public()` - Skip authentication
- `@Roles(UserRole.ADMIN)` - Require role
- `@RequirePermissions('users:read')` - Require permission
- `@RateLimit(100, 60)` - Custom rate limit

### Usage Example
```typescript
@Controller('api/v1/admin')
@UseGuards(JWTAuthGuard, RolesGuard)
export class AdminController {
  @Get('users')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @RateLimit(1000, 60)
  async getUsers() {
    return this.userService.findAll();
  }

  @Public()
  @Get('health')
  healthCheck() {
    return { status: 'ok' };
  }
}
```

---

## Getting Help

- **Full Documentation:** `/PHASE_1_SECURITY_IMPLEMENTATION_REPORT.md`
- **Example Configuration:** `/main.example.ts`
- **Security Module:** `/security.module.ts`

---

**Last Updated:** 2025-11-10
**Version:** 1.0.0
