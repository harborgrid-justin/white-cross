# withRateLimit Middleware

Higher-order function for applying rate limiting to Next.js 16 App Router API routes.

## Features

- ✅ **Easy to use**: Wrap any API route handler with `withRateLimit()`
- ✅ **Multiple tiers**: Pre-configured rate limit tiers (standard, auth, admin, elevated)
- ✅ **Custom configuration**: Define your own rate limits
- ✅ **Flexible identification**: Rate limit by IP, user ID, API key, or custom identifier
- ✅ **Skip conditions**: Conditionally bypass rate limiting
- ✅ **Custom error responses**: Customize the 429 response
- ✅ **Automatic headers**: Adds standard rate limit headers to responses
- ✅ **TypeScript support**: Full type safety
- ✅ **HIPAA compliant**: Works with the existing rate limiting infrastructure

## Installation

The module is already installed at `/src/middleware/withRateLimit.ts`.

```typescript
import { withRateLimit, RateLimitPresets } from '@/middleware/withRateLimit';
```

## Basic Usage

### Default Rate Limits (Standard Tier - 60 req/min)

```typescript
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withRateLimit } from '@/middleware/withRateLimit';

export const GET = withRateLimit(async (request: NextRequest) => {
  const users = await getUsers();
  return NextResponse.json(users);
});
```

### Authentication Endpoints (5 req/15min)

```typescript
// app/api/auth/login/route.ts
import { withRateLimit, RateLimitPresets } from '@/middleware/withRateLimit';

export const POST = withRateLimit(
  async (request: NextRequest) => {
    const body = await request.json();
    const token = await authenticateUser(body);
    return NextResponse.json({ token });
  },
  RateLimitPresets.auth()
);
```

### Admin Endpoints (30 req/min)

```typescript
// app/api/admin/users/route.ts
import { withRateLimit, RateLimitPresets } from '@/middleware/withRateLimit';

export const DELETE = withRateLimit(
  async (request: NextRequest) => {
    // Admin operation
    return NextResponse.json({ success: true });
  },
  RateLimitPresets.admin()
);
```

## Advanced Usage

### Custom Rate Limits

```typescript
export const POST = withRateLimit(
  async (request: NextRequest) => {
    // Handler logic
    return NextResponse.json({ data: 'custom' });
  },
  {
    config: {
      windowMs: 60000, // 1 minute
      maxRequests: 10,
      message: 'Custom rate limit exceeded',
    },
  }
);
```

### Custom Identifier (API Key Based)

```typescript
export const GET = withRateLimit(
  async (request: NextRequest) => {
    return NextResponse.json({ data: 'protected' });
  },
  {
    tier: 'standard',
    getIdentifier: (req) => {
      const apiKey = req.headers.get('x-api-key');
      return apiKey || 'unknown';
    },
  }
);
```

### Skip Rate Limiting Conditionally

```typescript
export const GET = withRateLimit(
  async (request: NextRequest) => {
    return NextResponse.json({ data: 'maybe limited' });
  },
  {
    tier: 'standard',
    skipRateLimit: (req) => {
      // Skip for internal services
      return req.headers.get('x-internal-service') === 'true';
    },
  }
);
```

### Custom Error Response

```typescript
export const POST = withRateLimit(
  async (request: NextRequest) => {
    return NextResponse.json({ success: true });
  },
  {
    tier: 'standard',
    onRateLimitExceeded: (req, resetTime) => {
      return NextResponse.json(
        {
          error: 'Rate Limit Exceeded',
          message: 'Please contact support for higher limits',
          resetTime: new Date(resetTime).toISOString(),
          contact: 'support@example.com',
        },
        { status: 429 }
      );
    },
  }
);
```

### User-Specific Rate Limiting

Automatically extracts user ID from JWT token:

```typescript
import { withUserRateLimit } from '@/middleware/withRateLimit';

export const GET = withUserRateLimit(async (request: NextRequest) => {
  // Rate limited per user
  return NextResponse.json({ data: 'user-specific' });
});
```

### IP-Only Rate Limiting

Ignores authentication and rate limits by IP only:

```typescript
import { withIPRateLimit } from '@/middleware/withRateLimit';

export const GET = withIPRateLimit(async (request: NextRequest) => {
  // Rate limited by IP only
  return NextResponse.json({ data: 'ip-based' });
});
```

## Available Tiers

| Tier       | Requests | Window   | Use Case                          |
| ---------- | -------- | -------- | --------------------------------- |
| `standard` | 60       | 1 minute | General API endpoints             |
| `elevated` | 120      | 1 minute | Premium users, read-only          |
| `admin`    | 30       | 1 minute | Administrative operations         |
| `auth`     | 5        | 15 min   | Authentication, password reset    |

## Preset Configurations

```typescript
import { RateLimitPresets } from '@/middleware/withRateLimit';

// Standard (60 req/min)
RateLimitPresets.standard()

// Elevated (120 req/min)
RateLimitPresets.elevated()

// Admin (30 req/min)
RateLimitPresets.admin()

// Auth (5 req/15min)
RateLimitPresets.auth()

// Strict (1 req/min)
RateLimitPresets.strict()

// Generous (300 req/min)
RateLimitPresets.generous()

// Custom
RateLimitPresets.custom(60000, 10, 'Custom message')
```

## Response Headers

All responses include standard rate limit headers:

```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1698765432
```

When rate limit is exceeded (429 response):

```
Retry-After: 123
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1698765432
```

## Error Response Format

```json
{
  "error": "Too Many Requests",
  "message": "Rate limit exceeded. Please try again later.",
  "retryAfter": 123,
  "resetTime": "2024-10-27T12:30:32.000Z"
}
```

## Type Definitions

```typescript
type RateLimitTier = 'standard' | 'elevated' | 'admin' | 'auth';

interface RateLimitOptions {
  tier?: RateLimitTier;
  config?: {
    windowMs: number;
    maxRequests: number;
    message?: string;
  };
  getIdentifier?: (request: NextRequest) => string | Promise<string>;
  skipRateLimit?: (request: NextRequest) => boolean | Promise<boolean>;
  onRateLimitExceeded?: (request: NextRequest, resetTime: number) => NextResponse;
}

type ApiRouteHandler = (
  request: NextRequest,
  context?: { params?: Record<string, string | string[]> }
) => Promise<NextResponse> | NextResponse;
```

## Integration with Existing Middleware

### With Authentication

```typescript
import { withRateLimit } from '@/middleware/withRateLimit';
import { withAuth } from '@/lib/middleware/withAuth';

// Apply rate limiting first, then auth
export const GET = withAuth(
  withRateLimit(async (request: NextRequest) => {
    return NextResponse.json({ data: 'protected' });
  })
);

// Or check auth inside handler
export const POST = withRateLimit(async (request: NextRequest) => {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // Handler logic
  return NextResponse.json({ success: true });
});
```

## Storage

Currently uses in-memory storage (same as `/src/middleware/rateLimit.ts`). For production with multiple instances:

1. Switch to Redis-backed storage (modify `/src/lib/middleware/rateLimiter.ts`)
2. Or use a distributed rate limiting service

## Best Practices

1. **Use appropriate tiers**: Don't over-restrict legitimate users
2. **Monitor rate limits**: Track how often users hit limits
3. **Provide clear messages**: Help users understand why they're limited
4. **Consider skip conditions**: Allow internal services to bypass limits
5. **Test thoroughly**: Ensure rate limits work in production scenarios

## Examples

See `src/middleware/withRateLimit.example.ts` for 15 comprehensive examples.

## Related Files

- `/src/middleware/withRateLimit.ts` - Main implementation
- `/src/lib/middleware/rateLimiter.ts` - Rate limiting utilities
- `/src/middleware/rateLimit.ts` - Edge middleware rate limiting
- `/src/lib/security/config.ts` - Rate limit configurations

## Troubleshooting

### Rate limiting not working

1. Check if the import path is correct: `@/middleware/withRateLimit`
2. Verify the handler is exported correctly: `export const GET = withRateLimit(...)`
3. Check browser console and server logs for errors

### Getting 429 too quickly

1. Adjust the tier or use custom config with higher limits
2. Check if multiple tabs/clients are making requests
3. Verify identifier is correct (IP vs user ID)

### Headers not appearing

1. Ensure Next.js is serving the response correctly
2. Check CORS configuration
3. Verify response is not cached

## License

Part of the White Cross healthcare platform.
