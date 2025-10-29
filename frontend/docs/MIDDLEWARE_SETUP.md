# Middleware Setup Guide

## Installation

### 1. Install Required Dependencies

The middleware system requires `jsonwebtoken` for JWT verification. Add it to your project:

```bash
cd nextjs
npm install jsonwebtoken
npm install --save-dev @types/jsonwebtoken
```

### 2. Update package.json Scripts

Add test scripts for middleware testing:

```json
{
  "scripts": {
    "test:middleware": "jest src/__tests__/middleware",
    "test:middleware:watch": "jest src/__tests__/middleware --watch",
    "test:middleware:coverage": "jest src/__tests__/middleware --coverage"
  }
}
```

### 3. Environment Configuration

Create or update `.env.local` with required variables:

```bash
# JWT Configuration
JWT_SECRET=your-super-secret-key-minimum-32-characters-long

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001

# CORS Configuration
NEXT_PUBLIC_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# Environment
NODE_ENV=development
```

**Important**: For production, use a cryptographically secure JWT secret:

```bash
# Generate a secure secret (Linux/Mac)
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 4. File Structure

Ensure you have the following file structure:

```
nextjs/
├── src/
│   ├── middleware.production.ts      # Production middleware (main)
│   ├── middleware.ts                 # Current/development middleware
│   ├── middleware.enhanced.ts        # Enhanced version (backup)
│   ├── middleware/                   # Modular middleware components
│   │   ├── auth.ts
│   │   ├── rbac.ts
│   │   ├── security.ts
│   │   ├── audit.ts
│   │   ├── rateLimit.ts
│   │   └── sanitization.ts
│   ├── lib/security/
│   │   ├── config.ts
│   │   ├── csrf.ts
│   │   └── sanitization.ts
│   └── __tests__/middleware/
│       └── rbac.test.ts
├── .env.local                        # Local environment variables
├── MIDDLEWARE.md                     # Complete documentation
└── MIDDLEWARE_SETUP.md              # This file
```

## Activation Steps

### Option 1: Replace Existing Middleware (Recommended for New Deployments)

```bash
# Backup current middleware
cp src/middleware.ts src/middleware.backup.ts

# Replace with production middleware
cp src/middleware.production.ts src/middleware.ts
```

### Option 2: Gradual Migration (Recommended for Existing Deployments)

Keep both files and test production middleware in staging first:

```bash
# In staging environment, temporarily rename
mv src/middleware.ts src/middleware.old.ts
mv src/middleware.production.ts src/middleware.ts

# Test thoroughly, then commit changes
```

### Option 3: Feature Flag Approach

Use environment variable to switch between middleware versions:

```typescript
// src/middleware.ts
import { middleware as productionMiddleware } from './middleware.production';
import { middleware as developmentMiddleware } from './middleware.enhanced';

export const middleware = process.env.USE_PRODUCTION_MIDDLEWARE === 'true'
  ? productionMiddleware
  : developmentMiddleware;

export { config } from './middleware.production';
```

## Verification

### 1. Run Tests

```bash
npm run test:middleware
```

Expected output:
```
PASS  src/__tests__/middleware/rbac.test.ts
  RBAC Middleware - Permission Checking
    ✓ SUPER_ADMIN should have all permissions
    ✓ ADMIN should have full access to students
    ✓ SCHOOL_NURSE should have full medication management
    ... (more tests)

Test Suites: 1 passed, 1 total
Tests:       45 passed, 45 total
```

### 2. Start Development Server

```bash
npm run dev
```

### 3. Test Authentication Flow

```bash
# Should redirect to login (no token)
curl -v http://localhost:3000/students

# Should show login page
open http://localhost:3000/login
```

### 4. Test Security Headers

```bash
curl -v http://localhost:3000/ 2>&1 | grep -i "x-frame-options\|content-security-policy\|strict-transport"
```

Expected output:
```
< x-frame-options: DENY
< content-security-policy: default-src 'self'; ...
< strict-transport-security: max-age=31536000; includeSubDomains; preload
```

### 5. Test Rate Limiting

```bash
# Run multiple requests quickly
for i in {1..6}; do
  curl http://localhost:3000/api/auth/login \
    -X POST \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}'
done
```

Should see 429 error after 5 attempts.

### 6. Test RBAC Permissions

Use your browser's developer tools to test with different user roles:

1. Login as SCHOOL_NURSE
2. Navigate to `/medications` (should work)
3. Navigate to `/admin` (should redirect to /access-denied)
4. Navigate to `/students` (should work - read access)

## Troubleshooting

### Issue: "Cannot find module '@/middleware/auth'"

**Solution**: Check your `tsconfig.json` has the correct path aliases:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Issue: "JWT_SECRET is not defined"

**Solution**: Add JWT_SECRET to `.env.local`:

```bash
echo "JWT_SECRET=$(openssl rand -base64 32)" >> .env.local
```

### Issue: Rate limits not working

**Cause**: In-memory storage is cleared on server restart.

**Solution**: For production, implement Redis-backed storage (see MIDDLEWARE.md).

### Issue: CORS errors

**Solution**: Add your frontend URL to allowed origins:

```bash
# .env.local
NEXT_PUBLIC_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173,https://your-frontend.com
```

### Issue: Infinite redirect loop

**Cause**: Login page not in PUBLIC_ROUTES.

**Solution**: Check `src/middleware/auth.ts` includes all public routes:

```typescript
export const PUBLIC_ROUTES = [
  '/login',
  '/forgot-password',
  '/reset-password',
  '/session-expired',
  '/access-denied',
  '/unauthorized',
];
```

## Production Deployment

### Pre-Deployment Checklist

- [ ] JWT_SECRET set to secure random value (min 32 chars)
- [ ] NEXT_PUBLIC_ALLOWED_ORIGINS includes production domain
- [ ] NODE_ENV=production
- [ ] All tests passing (`npm test`)
- [ ] HTTPS configured
- [ ] CSP headers reviewed and tested
- [ ] Rate limits appropriate for production load
- [ ] Audit logging endpoint configured
- [ ] Monitoring and alerting set up

### Deployment Steps

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Test production build locally**
   ```bash
   npm run start
   ```

3. **Deploy to staging**
   - Test all authentication flows
   - Test all user roles and permissions
   - Verify rate limiting
   - Check security headers
   - Test CSRF protection

4. **Deploy to production**
   - Use blue-green deployment if possible
   - Monitor error rates
   - Watch for 401/403 errors
   - Verify audit logs being created

### Post-Deployment Monitoring

Monitor these metrics:

- **Authentication failures**: High rate indicates attack or misconfiguration
- **Rate limit hits**: Adjust limits if legitimate users affected
- **RBAC denials**: Should be rare for properly configured roles
- **Middleware execution time**: Should be <50ms average
- **CSRF failures**: Should be zero if properly implemented

### Rollback Plan

If issues occur:

```bash
# Quick rollback to previous middleware
git checkout HEAD~1 src/middleware.ts
npm run build
npm run start
```

## Advanced Configuration

### Custom Rate Limits

Edit `src/lib/security/config.ts`:

```typescript
export const RATE_LIMIT_CONFIG = {
  general: {
    windowMs: 15 * 60 * 1000,
    max: 200,  // Increased from 100
  },
  auth: {
    windowMs: 15 * 60 * 1000,
    max: 10,   // Increased from 5
  },
  phi: {
    windowMs: 60 * 1000,
    max: 120,  // Increased from 60
  },
};
```

### Custom RBAC Permissions

Add new roles or permissions in `src/middleware/rbac.ts`:

```typescript
// Add new role
export enum UserRole {
  // ... existing roles
  MEDICAL_DIRECTOR = 'MEDICAL_DIRECTOR',
}

// Add permissions
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  // ... existing roles
  [UserRole.MEDICAL_DIRECTOR]: [
    'students:*',
    'medications:*',
    'health-records:*',
    'compliance:*',
    'analytics:*',
    'audit:read',
  ],
};
```

### Custom Routes

Add new route permissions in `src/middleware/rbac.ts`:

```typescript
export const ROUTE_PERMISSIONS: Record<string, RoutePermission> = {
  // ... existing routes
  '/medical-review': {
    resource: Resource.HEALTH_RECORDS,
    action: Action.READ
  },
  '/medical-review/[id]/approve': {
    resource: Resource.HEALTH_RECORDS,
    action: Action.UPDATE
  },
};
```

### Redis Integration

For production with multiple instances:

```typescript
// src/middleware/rateLimit.redis.ts
import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  password: process.env.REDIS_PASSWORD,
});

await redisClient.connect();

export async function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const key = `ratelimit:${identifier}`;
  const count = await redisClient.incr(key);

  if (count === 1) {
    await redisClient.expire(key, Math.ceil(config.windowMs / 1000));
  }

  return {
    allowed: count <= config.max,
    remaining: Math.max(0, config.max - count),
    resetTime: Date.now() + config.windowMs,
  };
}
```

## Performance Optimization

### Caching Route Permissions

```typescript
// src/middleware/rbac.ts
const routePermissionCache = new Map<string, RoutePermission | null>();

function matchRoutePermission(pathname: string): RoutePermission | null {
  // Check cache first
  if (routePermissionCache.has(pathname)) {
    return routePermissionCache.get(pathname)!;
  }

  // ... existing logic

  // Cache result
  routePermissionCache.set(pathname, result);
  return result;
}
```

### Optimizing Security Headers

For static assets, skip unnecessary headers:

```typescript
// src/middleware/security.ts
export function securityHeadersMiddleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  // Minimal headers for static assets
  if (pathname.match(/\.(ico|png|jpg|svg|css|js)$/)) {
    const response = NextResponse.next();
    response.headers.set('X-Content-Type-Options', 'nosniff');
    return response;
  }

  // Full headers for pages
  // ... existing logic
}
```

## Security Best Practices

1. **Rotate JWT Secrets Regularly**: Every 90 days
2. **Use Strong Secrets**: Minimum 32 characters, cryptographically random
3. **Enable HTTPS Only**: Set Strict-Transport-Security header
4. **Monitor Audit Logs**: Set up alerts for suspicious activity
5. **Regular Updates**: Keep dependencies updated
6. **Penetration Testing**: Regular security audits
7. **Rate Limit Tuning**: Adjust based on legitimate traffic patterns
8. **CSRF Tokens**: Rotate on each session
9. **Error Messages**: Don't leak sensitive information
10. **Backup Strategy**: Regular backups of audit logs (7 years for HIPAA)

## Support

For issues:
1. Check [MIDDLEWARE.md](./MIDDLEWARE.md) documentation
2. Review troubleshooting section above
3. Check audit logs: `grep "AUDIT\|RBAC\|AUTH" logs/app.log`
4. Enable debug mode: `process.env.DEBUG_MIDDLEWARE=true`
5. Contact security team for HIPAA compliance questions

## Version Information

- **Version**: 1.0.0
- **Date**: 2025-10-26
- **Compatibility**: Next.js 14+, React 19+
- **Node**: 20.0.0+

## Related Documentation

- [MIDDLEWARE.md](./MIDDLEWARE.md) - Complete middleware documentation
- [Next.js Middleware Docs](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [HIPAA Security Rule](https://www.hhs.gov/hipaa/for-professionals/security/index.html)
