# Configuration Management Guide
**White Cross School Health Platform - Backend**

## Table of Contents
- [Overview](#overview)
- [Quick Start](#quick-start)
- [Migration Guide](#migration-guide)
- [Configuration Architecture](#configuration-architecture)
- [Best Practices](#best-practices)
- [Examples](#examples)
- [Troubleshooting](#troubleshooting)

---

## Overview

The White Cross backend uses a **centralized, type-safe configuration system** that eliminates direct `process.env` access in favor of validated, namespaced configuration.

### Why This Matters

✅ **Type Safety**: All configuration is typed with TypeScript interfaces
✅ **Validation**: Environment variables are validated on startup with clear error messages
✅ **Security**: Prevents typos and missing configuration in production
✅ **Testability**: Easy to mock and test configuration
✅ **Documentation**: Configuration schema serves as self-documenting code

### Key Components

1. **AppConfigService**: Centralized configuration access
2. **Config Namespaces**: Organized by domain (app, database, auth, security, redis, aws, cache, queue)
3. **Validation Schema**: Joi-based validation with safe defaults
4. **ESLint Rule**: Prevents direct `process.env` access

---

## Quick Start

### Using Configuration in Your Service

```typescript
import { Injectable } from '@nestjs/common';
import { AppConfigService } from '../config/app-config.service';

@Injectable()
export class MyService {
  constructor(private readonly config: AppConfigService) {}

  myMethod() {
    // ✅ CORRECT: Use AppConfigService
    const dbHost = this.config.databaseHost;
    const jwtSecret = this.config.jwtSecret;
    const isProduction = this.config.isProduction;

    // ❌ WRONG: Direct process.env access (will fail ESLint)
    // const dbHost = process.env.DB_HOST;
  }
}
```

### Checking Feature Flags

```typescript
if (this.config.isAnalyticsEnabled) {
  // Analytics enabled
}

if (this.config.isProduction) {
  // Production-specific logic
}

if (this.config.isFeatureEnabled('myFeature')) {
  // Custom feature check
}
```

---

## Migration Guide

### Step 1: Identify Direct `process.env` Usage

Run ESLint to find all direct `process.env` access:

```bash
npm run lint:check
```

You'll see errors like:

```
src/my-service.ts
  10:20  error  Direct process.env access is not allowed. Use ConfigService instead
```

### Step 2: Import AppConfigService

Add AppConfigService to your service constructor:

```typescript
import { AppConfigService } from '../config/app-config.service';

@Injectable()
export class MyService {
  constructor(
    // Add AppConfigService
    private readonly config: AppConfigService,
  ) {}
}
```

### Step 3: Replace `process.env` with AppConfigService

#### Common Migrations

| Before | After |
|--------|-------|
| `process.env.NODE_ENV` | `this.config.environment` |
| `process.env.NODE_ENV === 'production'` | `this.config.isProduction` |
| `process.env.NODE_ENV === 'development'` | `this.config.isDevelopment` |
| `process.env.DB_HOST` | `this.config.databaseHost` |
| `process.env.JWT_SECRET` | `this.config.jwtSecret` |
| `process.env.REDIS_HOST` | `this.config.redisHost` |
| `process.env.PORT` | `this.config.port` |
| `process.env.CORS_ORIGIN` | `this.config.corsOrigin` |

#### Complete Example

**Before:**
```typescript
@Injectable()
export class EmailService {
  private readonly fromEmail: string;

  constructor() {
    // ❌ Direct process.env access
    this.fromEmail = process.env.AWS_SES_FROM_EMAIL || 'noreply@example.com';
  }

  async sendEmail(to: string, subject: string, body: string) {
    if (process.env.NODE_ENV === 'production') {
      // Send via AWS SES
    } else {
      // Log to console
      console.log(`Email to ${to}: ${subject}`);
    }
  }
}
```

**After:**
```typescript
@Injectable()
export class EmailService {
  private readonly fromEmail: string;

  constructor(private readonly config: AppConfigService) {
    // ✅ Use AppConfigService
    this.fromEmail = this.config.get('aws.ses.fromEmail', 'noreply@example.com');
  }

  async sendEmail(to: string, subject: string, body: string) {
    if (this.config.isProduction) {
      // Send via AWS SES
    } else {
      // Log to console
      this.logger.log(`Email to ${to}: ${subject}`);
    }
  }
}
```

### Step 4: Add Missing Configuration

If you need a new configuration value that doesn't exist:

1. **Add to appropriate namespace config file** (`src/config/*.config.ts`)
2. **Add validation** to `src/config/validation.schema.ts`
3. **Add to `.env.example`**
4. **Export from AppConfigService** (if needed for convenience)

#### Example: Adding New Config Value

**1. Add to config namespace (`src/config/app.config.ts`):**
```typescript
export interface AppConfig {
  // ... existing config
  myNewFeature: {
    enabled: boolean;
    maxRetries: number;
  };
}

export default registerAs('app', (): AppConfig => ({
  // ... existing config
  myNewFeature: {
    enabled: process.env.MY_NEW_FEATURE_ENABLED === 'true',
    maxRetries: parseInt(process.env.MY_NEW_FEATURE_MAX_RETRIES || '3', 10),
  },
}));
```

**2. Add validation (`src/config/validation.schema.ts`):**
```typescript
MY_NEW_FEATURE_ENABLED: Joi.boolean()
  .default(false)
  .description('Enable my new feature (safe default: false)'),

MY_NEW_FEATURE_MAX_RETRIES: Joi.number()
  .positive()
  .default(3)
  .description('Max retries for my new feature (safe default: 3)'),
```

**3. Add to `.env.example`:**
```bash
# My New Feature Configuration
MY_NEW_FEATURE_ENABLED=false
MY_NEW_FEATURE_MAX_RETRIES=3
```

**4. Optional: Add getter to AppConfigService:**
```typescript
/**
 * Check if my new feature is enabled
 */
get isMyNewFeatureEnabled(): boolean {
  return this.app.myNewFeature.enabled;
}
```

---

## Configuration Architecture

### Namespace Structure

```
src/config/
├── index.ts                  # Central export point
├── app-config.service.ts     # Main configuration service
├── module-loader.helper.ts   # Feature flag helpers
├── validation.schema.ts      # Joi validation schema
├── app.config.ts            # Application configuration
├── database.config.ts       # Database configuration
├── auth.config.ts           # Authentication configuration
├── security.config.ts       # Security configuration
├── redis.config.ts          # Redis configuration
├── aws.config.ts            # AWS services configuration
├── cache.config.ts          # Cache configuration
└── queue.config.ts          # Queue configuration
```

### Configuration Namespaces

| Namespace | Purpose | Example Usage |
|-----------|---------|---------------|
| `app` | Application settings | `config.app.port` |
| `database` | Database connection | `config.database.host` |
| `auth` | Authentication & JWT | `config.auth.jwt.secret` |
| `security` | Security settings | `config.security.cors.origin` |
| `redis` | Redis connection | `config.redis.cache.host` |
| `aws` | AWS services | `config.get('aws.s3.bucket')` |
| `cache` | Cache settings | `config.get('cache.defaultTtl')` |
| `queue` | Queue settings | `config.get('queue.concurrency.delivery')` |

### Validation Levels

1. **Schema Validation** (Joi): Validates types, formats, required fields
2. **Runtime Validation**: Critical config checks on startup
3. **Production Strictness**: `allowUnknown: false` in production

---

## Best Practices

### ✅ DO

- **Use AppConfigService for all configuration access**
- **Add validation for new environment variables**
- **Use typed getters from AppConfigService**
- **Document new config in `.env.example`**
- **Use feature flags for conditional features**
- **Keep secrets in separate variables** (never reuse JWT_SECRET for sessions)

### ❌ DON'T

- **Never access `process.env` directly** (except in `src/config/*.config.ts` and `main.ts`)
- **Never commit `.env` files to version control**
- **Never use wildcard CORS in production** (`*`)
- **Never enable database sync in production** (`DB_SYNC=true`)
- **Never log secrets or sensitive configuration**
- **Never use default secrets in production**

### Security Checklist

- [ ] All secrets are minimum 32 characters
- [ ] `JWT_SECRET`, `JWT_REFRESH_SECRET`, and `SESSION_SECRET` are different
- [ ] `CORS_ORIGIN` is set to specific domain(s) in production
- [ ] `DB_SSL=true` in production
- [ ] `DB_SYNC=false` in production
- [ ] `CSRF_SECRET` is set in production
- [ ] Secrets are stored in AWS Secrets Manager or similar in production

---

## Examples

### Example 1: Database Configuration

```typescript
@Injectable()
export class DatabaseService {
  constructor(private readonly config: AppConfigService) {}

  getConnectionOptions() {
    return {
      host: this.config.databaseHost,
      port: this.config.databasePort,
      username: this.config.databaseUsername,
      password: this.config.databasePassword,
      database: this.config.databaseName,
      ssl: this.config.isDatabaseSslEnabled,
      logging: this.config.isDevelopment, // Only log queries in dev
    };
  }
}
```

### Example 2: Feature Flags

```typescript
@Injectable()
export class AnalyticsService {
  constructor(private readonly config: AppConfigService) {}

  async trackEvent(event: string, data: any) {
    // Check if analytics is enabled
    if (!this.config.isAnalyticsEnabled) {
      return; // Analytics disabled
    }

    // Track event
    await this.sendToAnalytics(event, data);
  }
}
```

### Example 3: Environment-Specific Behavior

```typescript
@Injectable()
export class LoggingService {
  constructor(private readonly config: AppConfigService) {}

  log(message: string, context?: string) {
    const logLevel = this.config.logLevel;
    const isProd = this.config.isProduction;

    if (isProd) {
      // Production: JSON structured logging
      console.log(JSON.stringify({
        timestamp: new Date().toISOString(),
        level: logLevel,
        message,
        context,
      }));
    } else {
      // Development: Pretty logging
      console.log(`[${context}] ${message}`);
    }
  }
}
```

### Example 4: Custom Configuration

```typescript
@Injectable()
export class S3Service {
  constructor(private readonly config: AppConfigService) {}

  async uploadFile(file: Buffer, key: string) {
    const s3Config = this.config.get('aws.s3');

    const s3 = new S3({
      region: s3Config.region,
      credentials: this.config.get('aws.credentials.useIamRole')
        ? undefined // Use IAM role
        : {
            accessKeyId: this.config.get('aws.credentials.accessKeyId'),
            secretAccessKey: this.config.get('aws.credentials.secretAccessKey'),
          },
    });

    await s3.putObject({
      Bucket: s3Config.bucket,
      Key: key,
      Body: file,
    });
  }
}
```

---

## Troubleshooting

### ESLint Error: "Direct process.env access is not allowed"

**Error:**
```
src/my-file.ts
  10:20  error  Direct process.env access is not allowed. Use ConfigService instead
```

**Solution:**

1. Import `AppConfigService`
2. Inject it in constructor
3. Replace `process.env.VAR` with `this.config.varName`

**Allowed Locations:**
- `src/config/*.config.ts` (configuration namespaces)
- `src/main.ts` (bootstrap file)
- `**/*.spec.ts` (test files)

### Validation Error on Startup

**Error:**
```
CONFIGURATION VALIDATION FAILED
  - DATABASE_HOST: "DATABASE_HOST" is required
```

**Solution:**

1. Check your `.env` file exists
2. Ensure all required variables are set
3. Copy from `.env.example` if needed
4. Ensure no typos in variable names

### Configuration Value is Undefined

**Error:**
```typescript
const value = this.config.myValue; // undefined
```

**Solution:**

1. Check if config exists in namespace:
   ```typescript
   const value = this.config.get('namespace.myValue', 'default');
   ```

2. Add to config if missing (see "Adding New Config Value" above)

3. Use `.getOrThrow()` for required config:
   ```typescript
   const value = this.config.getOrThrow('namespace.myValue');
   ```

### Production Deployment Issues

**Issue:** App fails to start in production with "unknown environment variable" error

**Solution:**

Production uses `allowUnknown: false` for strict validation. Ensure:

1. All env vars in production are in `validation.schema.ts`
2. Remove any IDE-specific or development-only env vars
3. Check for typos in `.env` file
4. Verify env vars are properly loaded by your hosting platform

---

## Summary

### Migration Checklist

- [ ] Run `npm run lint:check` to find all `process.env` usage
- [ ] Import `AppConfigService` in affected services
- [ ] Replace all `process.env.X` with `this.config.X`
- [ ] Add any missing configuration to config namespaces
- [ ] Update `.env.example` with new variables
- [ ] Add validation for new variables in `validation.schema.ts`
- [ ] Test in development environment
- [ ] Verify production environment variables
- [ ] Deploy and monitor for configuration errors

### Key Files Modified

- ✅ `eslint.config.mjs` - Added ESLint rule preventing `process.env`
- ✅ `src/app.module.ts` - Refactored to use `AppConfigService`
- ✅ `src/config/validation.schema.ts` - Set `allowUnknown: false` in production
- ✅ `src/config/auth.config.ts` - Added separate `SESSION_SECRET`
- ✅ `src/config/aws.config.ts` - New AWS configuration namespace
- ✅ `src/config/cache.config.ts` - New cache configuration namespace
- ✅ `src/config/queue.config.ts` - New queue configuration namespace
- ✅ `.env.example` - Added `SESSION_SECRET` and AWS variables

### Need Help?

See `src/config/app-config.service.ts` for all available configuration getters.

---

**Last Updated:** 2025-11-07
**Version:** 2.0.0
