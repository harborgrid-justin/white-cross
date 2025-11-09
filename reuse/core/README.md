# Core Infrastructure Utilities

Enterprise-grade core infrastructure utilities for modern TypeScript/NestJS applications. This collection provides production-ready, type-safe utilities organized into six main categories.

## Table of Contents

- [Overview](#overview)
- [Categories](#categories)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Category Details](#category-details)
- [Import Patterns](#import-patterns)
- [Best Practices](#best-practices)
- [Migration Guide](#migration-guide)

---

## Overview

The core infrastructure utilities provide essential functionality for building scalable, secure, and maintainable enterprise applications. All utilities are:

- **Type-Safe**: Full TypeScript support with comprehensive type definitions
- **Production-Ready**: Battle-tested code with proper error handling
- **Well-Documented**: Extensive JSDoc comments and usage examples
- **Modular**: Import only what you need for optimal bundle size
- **Consistent**: Uniform naming conventions and patterns
- **Enterprise-Grade**: HIPAA-compliant security defaults where applicable

---

## Categories

### 🔐 Authentication & Authorization (`/auth`)

JWT token management, OAuth 2.0 flows, RBAC, session management, and multi-factor authentication.

**Key Features:**
- JWT generation and validation
- OAuth 2.0 with PKCE support
- Role-based access control (RBAC)
- Session management with sliding windows
- TOTP and backup code MFA
- Password hashing and validation
- API key management

[→ View Auth Documentation](./auth/README.md)

### 🌐 API Management (`/api`)

API gateway patterns, versioning, documentation generation, rate limiting, and GraphQL support.

**Key Features:**
- API gateway with routing and transformation
- Multi-version API support
- Rate limiting (fixed, sliding, token bucket)
- OpenAPI/Swagger documentation generation
- Request/response validation and sanitization
- CORS and security headers
- GraphQL resolver utilities

[→ View API Documentation](./api/README.md)

### ⚙️ Configuration (`/config`)

Environment variable parsing, configuration file loading, secrets management, and feature flags.

**Key Features:**
- Advanced environment variable parsing
- Multi-format config file support (JSON, YAML, TOML, INI)
- Configuration hierarchy and inheritance
- Secret encryption and rotation
- Feature flag service with A/B testing
- Type-safe configuration access
- Configuration validation

[→ View Config Documentation](./config/README.md)

### 💾 Database & ORM (`/database`)

Sequelize ORM utilities, model builders, query optimization, associations, and migrations.

**Key Features:**
- Model definition helpers
- Association builders
- Query optimization
- Transaction management
- Migration utilities
- CRUD operation builders
- Schema design patterns

[→ View Database Documentation](./database/README.md)

### ⚡ Caching & Performance (`/cache`)

Caching strategies, Redis patterns, and performance optimization utilities.

**Key Features:**
- Cache-aside, write-through, write-behind strategies
- Redis client with patterns
- LRU cache implementation
- Cache invalidation strategies
- Performance profiling
- Query result caching

[→ View Cache Documentation](./cache/README.md)

### 🐛 Error Handling & Monitoring (`/errors`)

Error handlers, monitoring, structured logging, and recovery strategies.

**Key Features:**
- Centralized error handling
- Custom error classes
- Error recovery patterns
- Structured logging
- Error monitoring and alerting
- Request tracing
- Log aggregation

[→ View Errors Documentation](./errors/README.md)

---

## Installation

The core utilities are part of the `reuse` package:

```bash
# If using from monorepo
import { generateJWTToken } from '@reuse/core';

# If using as standalone package
npm install @reuse/core
```

---

## Quick Start

### Authentication Example

```typescript
import { generateJWTToken, validateJWTToken } from '@reuse/core/auth';

// Generate JWT token
const token = generateJWTToken({
  sub: 'user-123',
  email: 'user@example.com',
  role: 'admin'
}, {
  secret: process.env.JWT_SECRET,
  expiresIn: '15m',
  issuer: 'my-app',
  audience: 'my-app-users'
});

// Validate JWT token
const validation = validateJWTToken(token, {
  secret: process.env.JWT_SECRET,
  issuer: 'my-app',
  audience: 'my-app-users'
});

if (validation.valid) {
  console.log('User ID:', validation.payload.sub);
}
```

### API Gateway Example

```typescript
import { createRateLimiter, apiKeyAuthMiddleware } from '@reuse/core/api';

// Create rate limiter
const limiter = createRateLimiter({
  windowMs: 60000,
  maxRequests: 100,
  strategy: 'sliding'
});

// Apply to routes
app.use('/api/v1', limiter, apiKeyAuthMiddleware(ApiKeyModel));
```

### Configuration Example

```typescript
import {
  parseEnvArray,
  parseEnvDuration,
  createConfigHierarchy
} from '@reuse/core/config';

// Parse environment variables
const hosts = parseEnvArray('DATABASE_HOSTS', ',');
const timeout = parseEnvDuration('SESSION_TIMEOUT');

// Create configuration hierarchy
const config = createConfigHierarchy(
  ['default', 'production', 'local'],
  { baseDir: './config', extension: '.json' }
);
```

### Database Example

```typescript
import { createModel, withTransaction } from '@reuse/core/database';

// Create model
const User = createModel(sequelize, {
  tableName: 'users',
  fields: {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    email: { type: DataTypes.STRING, unique: true }
  }
});

// Use transaction
await withTransaction(sequelize, async (transaction) => {
  await User.create({ email: 'user@example.com' }, { transaction });
});
```

### Cache Example

```typescript
import { createCacheManager } from '@reuse/core/cache';

const cache = createCacheManager({ ttl: 3600000 });

// Cache-aside pattern
const data = await cache.get('key') ||
  await cache.set('key', await fetchData());
```

### Error Handling Example

```typescript
import { createErrorHandler } from '@reuse/core/errors';

const errorHandler = createErrorHandler({
  logErrors: true,
  formatResponse: true,
  captureStackTrace: true
});

app.use(errorHandler);
```

---

## Category Details

### Authentication & Authorization

**Location:** `core/auth/`

**Subdirectories:**
- `jwt/` - JWT token utilities
- `oauth/` - OAuth 2.0 flows
- `rbac/` - Role-based access control
- `session/` - Session management
- `mfa/` - Multi-factor authentication

**Main Files:**
- `authentication-kit.ts` - Core authentication functions
- `authorization-kit.ts` - Core authorization functions
- `security-kit.ts` - Security utilities
- `security-kit.prod.ts` - Production security configurations

### API Management

**Location:** `core/api/`

**Subdirectories:**
- `gateway/` - API gateway utilities
- `versioning/` - API versioning patterns
- `documentation/` - OpenAPI/Swagger generation
- `graphql/` - GraphQL utilities

**Main Files:**
- `design-kit.ts` - API design patterns
- `gateway-kit.ts` - Gateway implementation
- `http-kit.ts` - HTTP utilities

### Configuration

**Location:** `core/config/`

**Subdirectories:**
- `parsers/` - Environment and file parsers
- `validation/` - Configuration validation
- `secrets/` - Secret management
- `feature-flags/` - Feature flag service

**Main Files:**
- `management-kit.ts` - Configuration management
- `management-kit.prod.ts` - Production configurations
- `environment-kit.ts` - Environment handling

### Database & ORM

**Location:** `core/database/`

**Subdirectories:**
- `sequelize/models/` - Model builders
- `sequelize/associations/` - Association helpers
- `sequelize/queries/` - Query utilities
- `sequelize/transactions/` - Transaction management
- `migrations/` - Migration utilities

**Main Files:**
- `connection-kit.ts` - Database connections
- `orm-kit.ts` - ORM utilities
- `schema-design-kit.ts` - Schema patterns
- `crud-kit.ts` - CRUD operations

### Caching & Performance

**Location:** `core/cache/`

**Subdirectories:**
- `strategies/` - Caching strategies
- `redis/` - Redis patterns
- `performance/` - Performance optimization

**Main Files:**
- `management-kit.ts` - Cache management
- `strategies-kit.ts` - Strategy implementations
- `strategies-kit.prod.ts` - Production strategies

### Error Handling & Monitoring

**Location:** `core/errors/`

**Subdirectories:**
- `handlers/` - Error handlers
- `monitoring/` - Error monitoring
- `logging/` - Structured logging

**Main Files:**
- `handling-kit.ts` - Error handling
- `handling-kit.prod.ts` - Production error handling

---

## Import Patterns

### Top-Level Imports

Import the most commonly used utilities directly:

```typescript
import {
  generateJWTToken,
  createRateLimiter,
  parseEnvArray
} from '@reuse/core';
```

### Category Imports

Import all utilities from a specific category:

```typescript
import * as Auth from '@reuse/core/auth';
import * as Api from '@reuse/core/api';

const token = Auth.generateJWTToken(/*...*/);
const limiter = Api.createRateLimiter(/*...*/);
```

### Specific Category Imports

Import specific utilities from a category:

```typescript
import {
  generateJWTToken,
  validateJWTToken,
  createSession
} from '@reuse/core/auth';
```

### Specialty Imports

Import from specialized subdirectories:

```typescript
import { generateTOTPCode } from '@reuse/core/auth/mfa';
import { generatePKCEVerifier } from '@reuse/core/auth/oauth';
import { createCacheAside } from '@reuse/core/cache/strategies';
```

---

## Best Practices

### 1. Use Type-Safe Imports

Always leverage TypeScript's type system:

```typescript
import type { JWTPayload, JWTConfig } from '@reuse/core/auth';

const config: JWTConfig = {
  secret: process.env.JWT_SECRET,
  expiresIn: '15m'
};
```

### 2. Prefer Barrel Exports

Use barrel exports for cleaner imports:

```typescript
// Good
import { generateJWTToken } from '@reuse/core/auth';

// Less ideal
import { generateJWTToken } from '@reuse/core/auth/authentication-kit';
```

### 3. Use Production Variants

Use `.prod.ts` files for production environments:

```typescript
// Development
import { configKit } from '@reuse/core/config/management-kit';

// Production
import { configKit } from '@reuse/core/config/management-kit.prod';
```

### 4. Environment-Specific Imports

Structure imports based on environment:

```typescript
const ConfigKit = process.env.NODE_ENV === 'production'
  ? require('@reuse/core/config/management-kit.prod')
  : require('@reuse/core/config/management-kit');
```

### 5. Tree-Shaking Optimization

Import only what you need for optimal bundle size:

```typescript
// Good - only imports what's needed
import { generateJWTToken } from '@reuse/core/auth/jwt';

// Less optimal - imports entire auth module
import * as Auth from '@reuse/core/auth';
```

---

## Migration Guide

### Migrating from Old Structure

If you're migrating from the old flat structure:

**Old:**
```typescript
import { generateJWTToken } from '../reuse/authentication-kit';
import { createRateLimiter } from '../reuse/api-gateway-kit';
import { parseEnvArray } from '../reuse/config-management-kit';
```

**New:**
```typescript
import { generateJWTToken } from '../reuse/core/auth';
import { createRateLimiter } from '../reuse/core/api';
import { parseEnvArray } from '../reuse/core/config';
```

### Import Path Mapping

| Old Path | New Path |
|----------|----------|
| `authentication-kit` | `core/auth` |
| `authorization-kit` | `core/auth` |
| `auth-rbac-kit` | `core/auth/rbac` |
| `api-gateway-kit` | `core/api/gateway` |
| `api-versioning-kit` | `core/api/versioning` |
| `config-management-kit` | `core/config` |
| `database-*-kit` | `core/database/sequelize/*` |
| `cache-*-kit` | `core/cache/*` |
| `error-handling-kit` | `core/errors` |

---

## TypeScript Configuration

For optimal IDE support, configure your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@reuse/core": ["reuse/core/index.ts"],
      "@reuse/core/*": ["reuse/core/*"]
    }
  }
}
```

---

## Contributing

When adding new utilities:

1. Choose the appropriate category
2. Follow existing naming conventions
3. Add comprehensive JSDoc comments
4. Include usage examples
5. Update category barrel exports
6. Add tests
7. Update category README

---

## Support

For issues, questions, or contributions:

- **Documentation:** See category-specific READMEs
- **Examples:** Check individual kit files for usage examples
- **Issues:** Report in project issue tracker

---

## License

Part of the White Cross healthcare platform - Internal use only.

---

**Last Updated:** 2025-11-08
**Version:** 1.0.0
