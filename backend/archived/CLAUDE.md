# NestJS Configuration Architecture
**White Cross School Health Platform - Configuration Management Standards**

## Overview

This document defines the configuration management architecture and standards for the White Cross backend. All team members and AI assistants must follow these patterns.

---

## Core Principles

### 1. No Direct process.env Access

**Rule:** Never access `process.env` directly outside of configuration files.

**Why:**
- Type safety
- Validation
- Security
- Testability
- Self-documentation

**Enforcement:** ESLint rule prevents `process.env` access except in:
- `src/config/*.config.ts`
- `src/main.ts`
- Test files (`*.spec.ts`, `*.test.ts`)

### 2. Centralized Configuration

All configuration flows through `AppConfigService`, which provides:
- Type-safe access to all config values
- Validation on startup
- Environment-aware defaults
- Caching for performance
- Fail-fast for missing required config

### 3. Namespace Organization

Configuration is organized into logical namespaces:

```typescript
const config = new AppConfigService();

// Application configuration
config.app.port
config.app.env
config.app.features.analytics

// Database configuration
config.database.host
config.database.port

// Authentication configuration
config.auth.jwt.secret
config.auth.session.secret

// Security configuration
config.security.cors.origin
config.security.csrf.enabled

// Infrastructure configuration
config.get('redis.cache.host')
config.get('aws.s3.bucket')
config.get('queue.concurrency.delivery')
```

---

## Configuration Pattern

### Standard Service Pattern

```typescript
import { Injectable } from '@nestjs/common';
import { AppConfigService } from '../config/app-config.service';

@Injectable()
export class MyService {
  constructor(
    private readonly config: AppConfigService,
  ) {}

  myMethod() {
    // ✅ CORRECT: Use AppConfigService
    const isProduction = this.config.isProduction;
    const dbHost = this.config.databaseHost;
    const jwtSecret = this.config.jwtSecret;

    // ❌ WRONG: Direct process.env access
    // const isProduction = process.env.NODE_ENV === 'production';
  }
}
```

### Guards and Middleware Pattern

```typescript
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AppConfigService } from '../../config/app-config.service';

@Injectable()
export class MyGuard implements CanActivate {
  constructor(
    private readonly config: AppConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    // ✅ Use config service
    if (this.config.isProduction) {
      // Production-specific logic
    }

    return true;
  }
}
```

### Module Configuration Pattern

For async module configuration:

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppConfigService } from '../config/app-config.service';

@Module({
  imports: [
    SomeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => ({
        host: config.redisHost,
        port: config.redisPort,
        password: config.redisPassword,
      }),
    }),
  ],
})
export class MyModule {}
```

### Feature Flags Pattern

For conditional module loading:

```typescript
import { loadConditionalModules, FeatureFlags } from './config';

@Module({
  imports: [
    // Always-loaded modules
    CoreModule,

    // Conditionally-loaded modules
    ...loadConditionalModules([
      {
        module: AnalyticsModule,
        condition: FeatureFlags.isAnalyticsEnabled,
        description: 'Analytics Module',
      },
      {
        module: ReportModule,
        condition: FeatureFlags.isReportingEnabled,
        description: 'Report Module',
      },
    ]),
  ],
})
export class AppModule {}
```

---

## Adding New Configuration

### Step-by-Step Guide

#### 1. Add to Validation Schema

**File:** `src/config/validation.schema.ts`

```typescript
export const validationSchema = Joi.object({
  // ... existing validation

  MY_NEW_CONFIG: Joi.string()
    .required()
    .description('My new configuration value (REQUIRED)'),

  MY_OPTIONAL_CONFIG: Joi.number()
    .default(100)
    .description('My optional config (safe default: 100)'),
});
```

**Validation Rules:**
- Use `.required()` for mandatory config
- Provide `.default()` for optional config with safe defaults
- Always add `.description()` for documentation
- Use proper type validation (`.string()`, `.number()`, `.boolean()`, `.uri()`)

#### 2. Add to Config Namespace

**File:** `src/config/app.config.ts` (or appropriate namespace)

```typescript
export interface AppConfig {
  // ... existing interface
  myNewFeature: {
    enabled: boolean;
    maxRetries: number;
  };
}

export default registerAs('app', (): AppConfig => ({
  // ... existing config
  myNewFeature: {
    enabled: process.env.MY_NEW_FEATURE_ENABLED === 'true',
    maxRetries: parseInt(process.env.MY_NEW_FEATURE_MAX_RETRIES || '100', 10),
  },
}));
```

**Note:** `process.env` is **only allowed** in config namespace files (`src/config/*.config.ts`).

#### 3. Add to .env.example

**File:** `.env.example`

```bash
# ================================================================================
# MY NEW FEATURE CONFIGURATION
# ================================================================================

# Enable my new feature (safe default: false)
MY_NEW_FEATURE_ENABLED=false

# Max retries for my new feature (safe default: 100)
MY_NEW_FEATURE_MAX_RETRIES=100
```

**Format:**
- Group related config together
- Use section headers (`# ===`)
- Include inline comments with safe defaults
- Provide example values

#### 4. Optional: Add Getter to AppConfigService

**File:** `src/config/app-config.service.ts`

```typescript
/**
 * Check if my new feature is enabled
 */
get isMyNewFeatureEnabled(): boolean {
  return this.app.myNewFeature.enabled;
}

/**
 * Get max retries for my new feature
 */
get myNewFeatureMaxRetries(): number {
  return this.app.myNewFeature.maxRetries;
}
```

**When to Add Getters:**
- Frequently accessed config
- Config that needs type conversion
- Config with complex logic
- Config used in multiple places

---

## Configuration Namespaces

### App Namespace (`app`)

**Purpose:** Application-level configuration

**Access:** `config.app.*`

**Contains:**
- Environment (`env`, `isProduction`, `isDevelopment`)
- Server settings (`port`, `apiPrefix`)
- Logging configuration
- Feature flags
- Timeouts
- Throttle limits

### Database Namespace (`database`)

**Purpose:** Database connection and pool configuration

**Access:** `config.database.*`

**Contains:**
- Connection parameters (host, port, username, password, database)
- SSL settings
- Pool configuration
- Sync/migration settings

### Auth Namespace (`auth`)

**Purpose:** Authentication and authorization configuration

**Access:** `config.auth.*`

**Contains:**
- JWT configuration (secret, expiration, issuer, audience)
- Session configuration (secret, cookie settings)
- Password policy
- Lockout policy

**Security:** Use separate secrets for JWT and sessions
- `JWT_SECRET` for access tokens
- `JWT_REFRESH_SECRET` for refresh tokens
- `SESSION_SECRET` for session cookies

### Security Namespace (`security`)

**Purpose:** Security settings (CORS, CSRF, encryption)

**Access:** `config.security.*`

**Contains:**
- CORS configuration
- CSRF protection settings
- Encryption settings (algorithm, key sizes)
- Key rotation policy
- Security headers

### Redis Namespace (`redis`)

**Purpose:** Redis connection configuration

**Access:** `config.redis.*`

**Contains:**
- Connection settings (host, port, password)
- Cache database
- Queue database
- Connection pooling

### AWS Namespace (`aws`)

**Purpose:** AWS services configuration

**Access:** `config.get('aws.*')`

**Contains:**
- AWS credentials (prefer IAM roles in production)
- S3 configuration
- Secrets Manager
- SES (email)
- CloudWatch

### Cache Namespace (`cache`)

**Purpose:** Cache configuration

**Access:** `config.get('cache.*')`

**Contains:**
- Cache TTLs
- Compression settings
- L1 (in-memory) cache
- Cache warming
- Monitoring

### Queue Namespace (`queue`)

**Purpose:** Job queue configuration

**Access:** `config.get('queue.*')`

**Contains:**
- Queue concurrency settings
- Job retry policies
- Rate limiting
- Cleanup policies

---

## Security Best Practices

### Secret Management

1. **Never Reuse Secrets**
   - `JWT_SECRET` ≠ `JWT_REFRESH_SECRET` ≠ `SESSION_SECRET`
   - Each secret serves a different purpose
   - Compromise of one doesn't compromise others

2. **Minimum Entropy**
   - All secrets must be minimum 32 characters
   - Use cryptographically secure random generation
   - Generate with: `openssl rand -base64 32`

3. **Secret Storage**
   - Development: `.env` file (gitignored)
   - Production: AWS Secrets Manager or similar
   - Never commit secrets to version control

### Environment-Specific Security

**Development:**
```typescript
// Permissive CORS for local development
CORS_ORIGIN=http://localhost:3000

// Disable SSL for local database
DB_SSL=false

// Enable database sync for rapid development
DB_SYNC=true
```

**Production:**
```typescript
// Strict CORS with specific domain
CORS_ORIGIN=https://whitecross.example.com

// Enable SSL for database
DB_SSL=true

// NEVER enable database sync
DB_SYNC=false

// Enable CSRF protection
CSRF_SECRET=<32-char-secret>
```

### Validation Strictness

**Development:**
- `allowUnknown: true` - Allows extra env vars
- `stripUnknown: false` - Keeps extra vars
- Permissive for experimentation

**Production:**
- `allowUnknown: false` - Strict validation
- `stripUnknown: true` - Removes unknown vars
- Prevents typos and misconfigurations

---

## Feature Flags

### Purpose

Feature flags allow conditional module loading based on environment variables.

### Standard Flags

| Flag | Default | Purpose |
|------|---------|---------|
| `ENABLE_ANALYTICS` | `true` | Analytics module (opt-out) |
| `ENABLE_REPORTING` | `true` | Reporting module (opt-out) |
| `ENABLE_DASHBOARD` | `true` | Dashboard module (opt-out) |
| `ENABLE_ADVANCED_FEATURES` | `true` | Advanced features (opt-out) |
| `ENABLE_ENTERPRISE` | `true` | Enterprise features (opt-out) |
| `ENABLE_DISCOVERY` | `false` | Discovery module (opt-in, dev only) |
| `CLI_MODE` | `false` | CLI commands (opt-in) |

### Using Feature Flags

**In AppModule:**
```typescript
import { loadConditionalModules, FeatureFlags } from './config';

...loadConditionalModules([
  {
    module: AnalyticsModule,
    condition: FeatureFlags.isAnalyticsEnabled,
    description: 'Analytics Module',
  },
])
```

**In Service:**
```typescript
if (this.config.isAnalyticsEnabled) {
  // Analytics code
}
```

### Adding New Feature Flag

1. Add to `src/config/app.config.ts`:
```typescript
features: {
  myNewFeature: process.env.ENABLE_MY_FEATURE !== 'false',
}
```

2. Add validation in `src/config/validation.schema.ts`:
```typescript
ENABLE_MY_FEATURE: Joi.boolean()
  .default(true)
  .description('Enable my feature (safe default: true)'),
```

3. Add to `.env.example`:
```bash
ENABLE_MY_FEATURE=true
```

4. Add getter to `AppConfigService`:
```typescript
get isMyFeatureEnabled(): boolean {
  return this.app.features.myNewFeature;
}
```

5. Add to `FeatureFlags` helper (if used for module loading):
```typescript
// src/config/module-loader.helper.ts
export const FeatureFlags = {
  isMyFeatureEnabled: (): boolean => process.env.ENABLE_MY_FEATURE !== 'false',
};
```

---

## Testing Configuration

### Mocking AppConfigService

```typescript
import { Test } from '@nestjs/testing';
import { AppConfigService } from '../config/app-config.service';

describe('MyService', () => {
  let service: MyService;
  let mockConfig: Partial<AppConfigService>;

  beforeEach(async () => {
    // Create mock config
    mockConfig = {
      isProduction: false,
      databaseHost: 'localhost',
      jwtSecret: 'test-secret',
      get: jest.fn((key: string, defaultValue?: any) => {
        const config = {
          'database.host': 'localhost',
          'database.port': 5432,
        };
        return config[key] ?? defaultValue;
      }),
    };

    const module = await Test.createTestingModule({
      providers: [
        MyService,
        {
          provide: AppConfigService,
          useValue: mockConfig,
        },
      ],
    }).compile();

    service = module.get<MyService>(MyService);
  });

  it('should use config', () => {
    expect(service.getDbHost()).toBe('localhost');
  });
});
```

### Integration Testing

```typescript
import { ConfigModule } from '@nestjs/config';
import { appConfig, databaseConfig } from '../config';

describe('MyService (Integration)', () => {
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [appConfig, databaseConfig],
          envFilePath: '.env.test',
        }),
      ],
      providers: [AppConfigService, MyService],
    }).compile();

    service = module.get<MyService>(MyService);
  });

  it('should load real config', () => {
    // Tests with real configuration
  });
});
```

---

## Migration from Direct process.env

### Before
```typescript
@Injectable()
export class MyService {
  constructor() {
    const host = process.env.DB_HOST;
    const port = parseInt(process.env.DB_PORT || '5432', 10);
    const isProduction = process.env.NODE_ENV === 'production';
  }
}
```

### After
```typescript
@Injectable()
export class MyService {
  constructor(private readonly config: AppConfigService) {
    const host = this.config.databaseHost;
    const port = this.config.databasePort;
    const isProduction = this.config.isProduction;
  }
}
```

### Benefits
- ✅ Type safety
- ✅ Validation on startup
- ✅ Easy to mock in tests
- ✅ Autocomplete in IDE
- ✅ Self-documenting code
- ✅ Centralized defaults

---

## Troubleshooting

### Common Errors

**Error:** `Direct process.env access is not allowed`

**Solution:** Use `AppConfigService` instead of `process.env`

---

**Error:** `Configuration key 'X' not found and no default value provided`

**Solution:** Add config to namespace or use `.get()` with default:
```typescript
this.config.get('myKey', 'default-value')
```

---

**Error:** `CONFIGURATION VALIDATION FAILED: "MY_VAR" is required`

**Solution:**
1. Add to `.env` file
2. Copy from `.env.example`
3. Check for typos

---

**Error:** Unknown environment variable in production

**Solution:** Production uses strict validation. Add variable to `validation.schema.ts`:
```typescript
MY_VAR: Joi.string().optional().allow(''),
```

---

## Summary

### Configuration Checklist

- [ ] Never use `process.env` directly (except in `src/config/*.config.ts`)
- [ ] Always inject `AppConfigService` for configuration access
- [ ] Add validation for all new environment variables
- [ ] Update `.env.example` with new variables
- [ ] Use separate secrets (never reuse JWT_SECRET)
- [ ] Set `allowUnknown: false` in production
- [ ] Document configuration in namespace interfaces
- [ ] Test configuration with mocks
- [ ] Use feature flags for conditional features
- [ ] Follow security best practices

### Key Files

- `src/config/app-config.service.ts` - Main configuration service
- `src/config/validation.schema.ts` - Joi validation schema
- `src/config/*.config.ts` - Configuration namespaces
- `src/config/module-loader.helper.ts` - Feature flag helpers
- `.env.example` - Configuration template
- `CONFIGURATION_GUIDE.md` - Detailed migration guide

---

**Last Updated:** 2025-11-07
**Version:** 2.0.0
