# Security Middleware Module

Enterprise-grade security middleware for NestJS healthcare applications with HIPAA-compliant configurations.

## Overview

This module provides comprehensive security features including:

- **CSP (Content Security Policy)**: Prevents XSS and code injection attacks with nonce generation
- **CORS (Cross-Origin Resource Sharing)**: Healthcare-compliant cross-origin access control
- **Security Headers**: OWASP-recommended HTTP security headers (HSTS, X-Frame-Options, etc.)
- **Rate Limiting**: Prevents brute force attacks and API abuse
- **CSRF Protection**: Cross-Site Request Forgery protection with token validation

## Installation & Setup

### 1. Import the Security Module

```typescript
import { Module } from '@nestjs/common';
import { SecurityModule } from './middleware/security';

@Module({
  imports: [SecurityModule],
})
export class AppModule {}
```

### 2. Apply Middleware Globally

In your `main.ts`:

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CspMiddleware, CorsMiddleware, SecurityHeadersMiddleware } from './middleware/security';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Apply security middleware
  app.use((req, res, next) => {
    const cspMiddleware = new CspMiddleware();
    cspMiddleware.use(req, res, () => {
      const corsMiddleware = new CorsMiddleware();
      corsMiddleware.use(req, res, () => {
        const securityHeadersMiddleware = new SecurityHeadersMiddleware();
        securityHeadersMiddleware.use(req, res, next);
      });
    });
  });

  await app.listen(3000);
}
bootstrap();
```

### 3. Apply Guards

#### Rate Limiting Guard

Apply to controllers or specific routes:

```typescript
import { Controller, Post, UseGuards } from '@nestjs/common';
import { RateLimitGuard, RateLimit } from './middleware/security';

@Controller('auth')
@UseGuards(RateLimitGuard)
export class AuthController {
  @Post('login')
  @RateLimit('auth') // 5 attempts per 15 minutes
  async login() {
    // Login logic
  }
}

@Controller('students')
@UseGuards(RateLimitGuard)
export class StudentsController {
  @Post('export')
  @RateLimit('export') // 10 exports per hour
  async exportStudents() {
    // Export logic
  }
}
```

#### CSRF Guard

Apply globally or to specific routes:

```typescript
import { Controller, Post, UseGuards } from '@nestjs/common';
import { CsrfGuard, SkipCsrf } from './middleware/security';

@Controller('data')
@UseGuards(CsrfGuard)
export class DataController {
  @Post()
  async createData() {
    // CSRF protection enabled
  }

  @Post('webhook')
  @SkipCsrf() // Skip CSRF for webhooks
  async handleWebhook() {
    // Webhook logic
  }
}
```

## Features

### Content Security Policy (CSP)

**Features:**
- Healthcare-compliant CSP directives
- Cryptographically secure nonce generation
- CSP violation reporting and analytics
- Environment-specific policies (development vs production)
- Automatic nonce attachment to responses

**Configuration:**

```typescript
const cspMiddleware = new CspMiddleware();

// Access nonce in controllers
@Get()
async getPage(@Req() req, @Res() res) {
  const nonce = req.cspNonce; // Use in templates
  return res.render('page', { nonce });
}
```

**CSP Policies:**
- **Strict Mode (Production)**: No unsafe-inline, strict-dynamic enabled
- **Base Mode (Development)**: Allows unsafe-inline for development

**Violation Reporting:**
- Endpoint: `/api/security/csp-violations`
- Automatic violation analytics
- Healthcare-critical violation detection

### CORS Middleware

**Features:**
- Healthcare-compliant origin validation
- Preflight request caching
- HTTPS enforcement in strict mode
- Trusted domain validation
- Comprehensive audit logging

**Configuration:**

```typescript
import { DEFAULT_CORS_CONFIG } from './middleware/security';

// Default configuration
const config = {
  enabled: true,
  allowedOrigins: ['http://localhost:3000'],
  allowedMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowCredentials: true,
  strictMode: true, // Enforces HTTPS
  trustedDomains: ['.healthcare.gov', '.hhs.gov'],
};
```

### Security Headers Middleware

**Features:**
- Content-Security-Policy with nonce support
- HTTP Strict Transport Security (HSTS)
- X-Frame-Options (clickjacking protection)
- X-Content-Type-Options (MIME sniffing prevention)
- Referrer-Policy
- Permissions-Policy (browser feature restriction)

**Applied Headers:**
- `Content-Security-Policy`
- `Strict-Transport-Security`
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: geolocation=(), camera=(), microphone=(), ...`

### Rate Limiting Guard

**Features:**
- Sliding window rate limiting algorithm
- Per-user and per-IP rate limiting
- Configurable time windows and limits
- Automatic cleanup of expired records
- Rate limit headers in responses

**Preset Configurations:**

| Type | Window | Max Requests | Use Case |
|------|--------|-------------|----------|
| `auth` | 15 min | 5 | Authentication endpoints |
| `export` | 1 hour | 10 | PHI export endpoints |
| `communication` | 1 min | 10 | Messaging endpoints |
| `emergencyAlert` | 1 hour | 3 | Emergency alerts |
| `api` | 1 min | 100 | General API endpoints |
| `reports` | 5 min | 5 | Report generation |

**Usage:**

```typescript
@Controller('messages')
@UseGuards(RateLimitGuard)
export class MessagesController {
  @Post()
  @RateLimit('communication') // 10 messages per minute
  async sendMessage() {
    // Message logic
  }
}
```

### CSRF Protection Guard

**Features:**
- CSRF token generation and validation
- Automatic token attachment to responses
- Configurable skip paths
- Token caching with expiration
- Multiple token sources (header, body, query, cookie)

**Token Sources:**
1. `X-CSRF-Token` header (recommended)
2. `_csrf` form field
3. `_csrf` query parameter
4. `XSRF-TOKEN` cookie

**Usage:**

```typescript
// Frontend (React/Angular/Vue)
// 1. Get token from cookie or header
const csrfToken = document.cookie
  .split('; ')
  .find(row => row.startsWith('XSRF-TOKEN='))
  ?.split('=')[1];

// 2. Include in requests
fetch('/api/data', {
  method: 'POST',
  headers: {
    'X-CSRF-Token': csrfToken,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data),
});
```

## Security Compliance

### HIPAA Compliance

- **164.312(a)(1)** - Access Control: CSP, CORS, frame protection, rate limiting
- **164.312(b)** - Audit Controls: Comprehensive logging of security events
- **164.312(e)(1)** - Transmission Security: HSTS, HTTPS enforcement

### OWASP Compliance

- **A01:2021** - Broken Access Control: CSRF protection, CORS validation
- **A03:2021** - Injection: CSP prevents XSS attacks
- **A05:2021** - Security Misconfiguration: Comprehensive security headers
- **API4:2023** - Unrestricted Resource Consumption: Rate limiting

## Monitoring & Metrics

### CSP Metrics

```typescript
import { CspMiddleware } from './middleware/security';

const cspMiddleware = new CspMiddleware();
const metrics = cspMiddleware.getMetrics();

console.log(`CSP Policies Applied: ${metrics.policiesApplied}`);
console.log(`Nonces Generated: ${metrics.noncesGenerated}`);
console.log(`Violations: ${metrics.violationsCount}`);
console.log(`Healthcare Violations: ${metrics.healthcareViolations}`);
```

### Rate Limit Headers

Responses include rate limit information:

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Window: 60000
X-RateLimit-Reset: 2025-10-28T12:00:00.000Z
Retry-After: 60
```

## Environment Configuration

### Development

- Relaxed CSP policies (allows unsafe-inline, unsafe-eval)
- HTTP allowed for localhost
- Detailed error messages
- CSP in report-only mode

### Production

- Strict CSP policies (strict-dynamic, no unsafe-inline)
- HTTPS enforcement
- Minimal error exposure
- CSP enforcement mode

## Migration Notes

### From Express Middleware

All middleware has been migrated to NestJS patterns:

1. **Express Functions → NestJS Middleware Classes**: All middleware now implements `NestMiddleware` interface
2. **Express Middleware → NestJS Guards**: Rate limiting and CSRF now use guards for better integration
3. **Framework-Agnostic → NestJS-Specific**: Optimized for NestJS dependency injection and lifecycle

### Breaking Changes

- Rate limiting now uses decorators: `@RateLimit('auth')` instead of middleware function
- CSRF now uses guard: `@UseGuards(CsrfGuard)` instead of middleware function
- All middleware requires NestJS providers

## Best Practices

1. **Always use HTTPS in production** - Required for HIPAA compliance
2. **Configure environment-specific settings** - Use NODE_ENV to control strictness
3. **Monitor CSP violations** - Set up violation reporting endpoint
4. **Review rate limits** - Adjust based on actual usage patterns
5. **Rotate CSRF secrets** - Use environment variable for CSRF_SECRET
6. **Enable audit logging** - Track all security events for compliance
7. **Test security headers** - Use tools like securityheaders.com

## Troubleshooting

### CSP Blocking Resources

If CSP blocks legitimate resources:

1. Check browser console for CSP violations
2. Review CSP directives in middleware configuration
3. Add allowed domains to custom directives
4. Use CSP report-only mode during testing

### CORS Issues

If CORS requests are blocked:

1. Verify origin is in `allowedOrigins` list
2. Check if HTTPS is required (strictMode)
3. Ensure credentials are handled correctly
4. Review preflight request logs

### Rate Limiting False Positives

If legitimate requests are rate limited:

1. Review rate limit configuration
2. Check if user/IP identification is correct
3. Clear rate limit cache if needed
4. Adjust limits based on usage patterns

### CSRF Token Issues

If CSRF validation fails:

1. Verify token is included in request
2. Check token is not expired (24h default)
3. Ensure session ID matches
4. Review skip paths configuration

## Testing

### Unit Tests

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { CspMiddleware, RateLimitGuard } from './middleware/security';

describe('Security Middleware', () => {
  it('should apply CSP headers', () => {
    const middleware = new CspMiddleware();
    // Test implementation
  });

  it('should enforce rate limits', () => {
    const guard = new RateLimitGuard(reflector);
    // Test implementation
  });
});
```

### Integration Tests

```typescript
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

describe('Security Integration', () => {
  let app: INestApplication;

  it('should block requests exceeding rate limit', async () => {
    // Make 6 requests (limit is 5)
    for (let i = 0; i < 6; i++) {
      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'password' });

      if (i < 5) {
        expect(response.status).not.toBe(429);
      } else {
        expect(response.status).toBe(429);
      }
    }
  });
});
```

## Support

For issues or questions:

1. Review this documentation
2. Check security logs for detailed errors
3. Consult OWASP and HIPAA compliance guidelines
4. Contact security team for healthcare-specific requirements

## License

Internal use only - Healthcare application security module
