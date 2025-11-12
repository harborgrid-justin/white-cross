# Production Dependencies for Next.js White Cross

## Required NPM Packages

Add these dependencies to `package.json` for production deployment:

```bash
# Rate Limiting with Upstash Redis
npm install @upstash/ratelimit @upstash/redis

# Sentry Error Tracking
npm install @sentry/nextjs

# Additional production utilities
npm install --save-dev @types/node@latest
```

## Updated package.json Dependencies

```json
{
  "dependencies": {
    "@upstash/ratelimit": "^1.0.1",
    "@upstash/redis": "^1.28.0",
    "@sentry/nextjs": "^7.99.0"
  }
}
```

## Environment Variables Required

### Production (.env.production)

```bash
# Upstash Redis (Rate Limiting)
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token

# Sentry (Error Tracking)
NEXT_PUBLIC_SENTRY_DSN=https://key@sentry.io/project
SENTRY_AUTH_TOKEN=your-auth-token
SENTRY_ORG=your-organization
SENTRY_PROJECT=white-cross

# Security
ENABLE_CSP=true
ENABLE_HSTS=true
HSTS_MAX_AGE=31536000
```

### Staging (.env.staging)

Same as production but with staging-specific values.

### Development (.env.local)

```bash
# Development can work without Upstash (uses in-memory fallback)
# But if you want to test with Redis locally:
# UPSTASH_REDIS_REST_URL=http://localhost:6379
# UPSTASH_REDIS_REST_TOKEN=local

# Sentry DSN for development (optional)
# NEXT_PUBLIC_SENTRY_DSN=https://key@sentry.io/dev-project
```

## Installation Commands

```bash
cd nextjs

# Install production dependencies
npm install @upstash/ratelimit @upstash/redis @sentry/nextjs

# Install if Sentry wizard is needed
npx @sentry/wizard@latest -i nextjs
```

## Configuration Files

### Sentry Configuration

Sentry configuration is in:
- `instrumentation.ts` - Server initialization
- `src/lib/monitoring/sentry.ts` - Sentry utilities

### Rate Limiting

Rate limiting configuration is in:
- `src/lib/rateLimitUpstash.ts` - Upstash Redis rate limiter
- `src/lib/rateLimit.ts` - In-memory fallback rate limiter

### Security Headers

Security headers are configured in:
- `src/middleware.ts` - Main middleware with auth
- `next.config.ts` - Base Next.js security config

## Testing Production Build

```bash
# Build for production
npm run build

# Test production build locally
npm start

# Or with Docker
docker build -t white-cross-nextjs:test .
docker run -p 3000:3000 --env-file .env.production white-cross-nextjs:test
```

## Verification Checklist

- [ ] @upstash/ratelimit installed
- [ ] @upstash/redis installed
- [ ] @sentry/nextjs installed
- [ ] UPSTASH_REDIS_REST_URL configured
- [ ] UPSTASH_REDIS_REST_TOKEN configured
- [ ] NEXT_PUBLIC_SENTRY_DSN configured
- [ ] instrumentation.ts exists
- [ ] Production build succeeds
- [ ] Health check endpoint works
- [ ] Rate limiting functional
- [ ] Sentry capturing errors
