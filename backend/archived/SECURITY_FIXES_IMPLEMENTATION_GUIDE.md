# Security Fixes Implementation Guide
**White Cross Healthcare Platform - NestJS Backend**

This guide provides step-by-step instructions for implementing the security fixes identified in the audit.

---

## Quick Summary

| Fix | Priority | Estimated Time | Files to Update |
|-----|----------|----------------|-----------------|
| 1. API Key Authentication | HIGH | 30 min | Import new module |
| 2. Global Guard Ordering | HIGH | 15 min | app.module.ts |
| 3. Increased bcrypt Salt Rounds | MEDIUM | 5 min | user.model.ts, auth.service.ts |
| 4. Environment Configuration | LOW | 10 min | .env |

**Total Implementation Time:** ~60 minutes

---

## Fix 1: API Key Authentication System

### Status: ✅ IMPLEMENTED

The complete API key authentication system has been created in `/backend/src/api-key-auth/`.

### Implementation Steps

#### Step 1: Import the Module

Add to your `app.module.ts`:

```typescript
import { ApiKeyAuthModule } from './api-key-auth/api-key-auth.module';

@Module({
  imports: [
    // ... other modules
    ApiKeyAuthModule,
  ],
})
export class AppModule {}
```

#### Step 2: Create Database Table

Create a migration file:

```bash
npm run migration:generate -- add-api-keys-table
```

Add to migration:

```typescript
export async function up(queryInterface: QueryInterface) {
  await queryInterface.createTable('api_keys', {
    id: {
      type: DataType.UUID,
      defaultValue: DataType.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataType.STRING(255),
      allowNull: false,
    },
    keyHash: {
      type: DataType.STRING(255),
      allowNull: false,
      unique: true,
    },
    keyPrefix: {
      type: DataType.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataType.TEXT,
      allowNull: true,
    },
    scopes: {
      type: DataType.JSON,
      allowNull: true,
    },
    isActive: {
      type: DataType.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    expiresAt: {
      type: DataType.DATE,
      allowNull: true,
    },
    lastUsedAt: {
      type: DataType.DATE,
      allowNull: true,
    },
    usageCount: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    createdBy: {
      type: DataType.UUID,
      allowNull: false,
    },
    ipRestriction: {
      type: DataType.STRING(100),
      allowNull: true,
    },
    rateLimit: {
      type: DataType.INTEGER,
      allowNull: true,
    },
    createdAt: {
      type: DataType.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataType.DATE,
      allowNull: false,
    },
  });

  // Add indexes
  await queryInterface.addIndex('api_keys', ['keyHash'], {
    unique: true,
    name: 'api_keys_key_hash_unique',
  });

  await queryInterface.addIndex('api_keys', ['isActive']);
  await queryInterface.addIndex('api_keys', ['expiresAt']);
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.dropTable('api_keys');
}
```

Run migration:

```bash
npm run migration:run
```

#### Step 3: Use API Key Guard

Apply to webhook or integration endpoints:

```typescript
import { ApiKeyGuard } from './api-key-auth/guards/api-key.guard';

@Controller('webhooks')
@UseGuards(ApiKeyGuard)
export class WebhooksController {
  @Post('sis/student-update')
  async handleStudentUpdate(@Body() data: any, @Request() req) {
    // req.apiKey contains the validated API key info
    console.log('API Key:', req.apiKey.name);
    console.log('Scopes:', req.apiKey.scopes);
  }
}
```

#### Step 4: Generate API Keys

Via API (as admin):

```bash
curl -X POST http://localhost:3001/api/v1/api-keys \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "SIS Integration - Production",
    "description": "Student Information System integration",
    "scopes": ["students:read", "students:write"],
    "expiresInDays": 365,
    "rateLimit": 1000
  }'
```

Response:

```json
{
  "apiKey": "wc_live_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6",
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "SIS Integration - Production",
  "keyPrefix": "wc_live_a1b2",
  "scopes": ["students:read", "students:write"],
  "expiresAt": "2026-11-03T00:00:00.000Z"
}
```

**IMPORTANT:** Save the `apiKey` value securely - it will only be shown once!

#### Step 5: Test API Key Authentication

```bash
curl http://localhost:3001/webhooks/sis/student-update \
  -H "X-API-Key: wc_live_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6" \
  -H "Content-Type: application/json" \
  -d '{"studentId": "12345", "action": "update"}'
```

---

## Fix 2: Global Guard Ordering

### Status: ⚠️ REQUIRES IMPLEMENTATION

### Current Issue

Guards are applied per-controller or per-route, which can lead to:
- Forgotten security guards on new endpoints
- Inconsistent security across controllers
- Risk of accidentally exposing endpoints

### Solution

Configure global guards in `app.module.ts` to protect all routes by default.

### Implementation Steps

#### Step 1: Update app.module.ts

Add to your imports:

```typescript
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { PermissionsGuard } from './access-control/guards/permissions.guard';
```

Add to providers array:

```typescript
@Module({
  imports: [
    // ... existing imports
  ],
  providers: [
    // CRITICAL: Global guards in correct order
    // 1. Authentication first
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    // 2. Role check second
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    // 3. Permission check third
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
    // ... other providers
  ],
})
export class AppModule {}
```

#### Step 2: Mark Public Routes

Add `@Public()` decorator to routes that should not require authentication:

```typescript
import { Public } from './auth/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  @Public()  // ← Add this decorator
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Public()  // ← Add this decorator
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  // This route requires authentication (no @Public() decorator)
  @Post('change-password')
  async changePassword(@Body() dto: ChangePasswordDto, @Request() req) {
    return this.authService.changePassword(req.user.id, dto);
  }
}
```

#### Step 3: Mark All Public Routes

Add `@Public()` to these routes:

1. **Authentication endpoints:**
   - POST /auth/login
   - POST /auth/register
   - POST /auth/refresh-token

2. **Health checks:**
   - GET /health
   - GET /api/health

3. **Documentation:**
   - GET /api/docs
   - GET /api/docs-json

4. **Webhooks (use ApiKeyGuard instead):**
   - POST /webhooks/*

Example for health check:

```typescript
@Controller('health')
export class HealthController {
  @Public()
  @Get()
  check() {
    return { status: 'ok' };
  }
}
```

#### Step 4: Test Security

Test that protected routes reject unauthenticated requests:

```bash
# Should return 401 Unauthorized
curl http://localhost:3001/api/students

# Should return 200 OK
curl http://localhost:3001/api/students \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Test that public routes work without authentication:

```bash
# Should return 200 OK
curl http://localhost:3001/health

# Should return 200 OK
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password"}'
```

#### Step 5: Remove Redundant Guards

After global guards are configured, you can remove `@UseGuards(JwtAuthGuard)` from individual controllers/routes (except for special cases like ApiKeyGuard).

Before:

```typescript
@Controller('students')
@UseGuards(JwtAuthGuard, RolesGuard)  // ← REMOVE THIS
export class StudentsController {
  @Get()
  async getStudents() { ... }
}
```

After:

```typescript
@Controller('students')
// No @UseGuards needed - global guards apply automatically
export class StudentsController {
  @Get()
  async getStudents() { ... }
}
```

---

## Fix 3: Increased bcrypt Salt Rounds

### Status: ⚠️ REQUIRES IMPLEMENTATION

### Current Issue

Current salt rounds: 10 (acceptable but low for healthcare)
Recommended for healthcare: 12

### Implementation Steps

#### Step 1: Update Environment Configuration

Add to `.env`:

```bash
# Password Hashing Configuration
BCRYPT_SALT_ROUNDS=12
```

#### Step 2: Update auth.service.ts

Change from:

```typescript
private readonly saltRounds = 10;
```

To:

```typescript
private readonly saltRounds = parseInt(
  this.configService.get<string>('BCRYPT_SALT_ROUNDS', '12'),
  10,
);

constructor(
  private readonly jwtService: JwtService,
  private readonly configService: ConfigService,
) {
  // Validate salt rounds on startup
  if (this.saltRounds < 10 || this.saltRounds > 14) {
    throw new Error(
      'SECURITY WARNING: bcrypt salt rounds must be between 10 and 14. ' +
      `Current value: ${this.saltRounds}. Recommended for healthcare: 12.`
    );
  }
}
```

#### Step 3: Update user.model.ts

Change in `@BeforeCreate` hook (line 281):

```typescript
@BeforeCreate
static async hashPasswordBeforeCreate(user: User) {
  if (user.password) {
    // SECURITY UPDATE: Changed from 10 to 12
    user.password = await bcrypt.hash(user.password, 12);
    user.lastPasswordChange = new Date();
  }
}
```

Change in `@BeforeUpdate` hook (line 289):

```typescript
@BeforeUpdate
static async hashPasswordBeforeUpdate(user: User) {
  if (user.changed('password')) {
    // SECURITY UPDATE: Changed from 10 to 12
    user.password = await bcrypt.hash(user.password, 12);
    user.passwordChangedAt = new Date();
    user.lastPasswordChange = new Date();
  }
}
```

#### Step 4: Test Password Hashing

Create a test to verify salt rounds:

```typescript
// test/auth/password-hashing.spec.ts
import * as bcrypt from 'bcrypt';

describe('Password Hashing', () => {
  it('should use 12 salt rounds', async () => {
    const password = 'TestPassword123!';
    const hash = await bcrypt.hash(password, 12);

    // Verify hash format (starts with $2b$12$ for bcrypt with 12 rounds)
    expect(hash).toMatch(/^\$2b\$12\$/);

    // Verify password can be compared
    const isValid = await bcrypt.compare(password, hash);
    expect(isValid).toBe(true);
  });
});
```

#### Step 5: Migration Strategy

**Option 1: Gradual Migration (Recommended)**

No immediate action required. Existing passwords will automatically use 12 rounds on next password change or user registration.

**Option 2: Forced Re-hash (if compliance requires)**

Create migration script:

```typescript
// scripts/rehash-passwords.ts
import { User } from '../src/database/models/user.model';
import * as bcrypt from 'bcrypt';

async function rehashAllPasswords() {
  const users = await User.findAll();

  for (const user of users) {
    // Check if hash uses old salt rounds (starts with $2b$10$)
    if (user.password.startsWith('$2b$10$')) {
      // Cannot directly re-hash (we don't have plaintext password)
      // Option 1: Force password reset
      user.mustChangePassword = true;
      await user.save();

      // Option 2: If you have plaintext passwords (NOT recommended)
      // const newHash = await bcrypt.hash(plaintextPassword, 12);
      // user.password = newHash;
      // await user.save();
    }
  }

  console.log('Password re-hashing complete');
}

rehashAllPasswords();
```

---

## Fix 4: Environment Configuration

### Status: ⚠️ REQUIRES CONFIGURATION

### Implementation Steps

#### Step 1: Copy Environment Template

```bash
cp .env.example.SECURITY_UPDATE .env.example
```

#### Step 2: Generate Secrets

Generate strong secrets for your environment:

```bash
# JWT Secret (32+ characters)
openssl rand -base64 32

# CSRF Secret
openssl rand -base64 32

# Encryption Key
openssl rand -base64 32

# Session Secret
openssl rand -base64 32
```

#### Step 3: Update .env

Update your `.env` file with generated secrets:

```bash
# JWT Configuration
JWT_SECRET=<generated-secret-1>
JWT_REFRESH_SECRET=<generated-secret-2>

# CSRF Protection
CSRF_SECRET=<generated-secret-3>

# Encryption
ENCRYPTION_KEY=<generated-secret-4>

# Session
SESSION_SECRET=<generated-secret-5>

# bcrypt
BCRYPT_SALT_ROUNDS=12

# CORS (CRITICAL: Set your actual frontend URL)
CORS_ORIGIN=http://localhost:3000
```

#### Step 4: Production Configuration

For production, use different secrets and configure:

```bash
NODE_ENV=production
CORS_ORIGIN=https://app.whitecross.health
BCRYPT_SALT_ROUNDS=12
HIPAA_COMPLIANCE_ENABLED=true
```

#### Step 5: Verify Configuration

Create a startup validation script:

```typescript
// src/config/security-config.validator.ts
export function validateSecurityConfig() {
  const requiredSecrets = [
    'JWT_SECRET',
    'CSRF_SECRET',
    'ENCRYPTION_KEY',
  ];

  const missing = [];
  const weak = [];

  for (const secret of requiredSecrets) {
    const value = process.env[secret];

    if (!value) {
      missing.push(secret);
    } else if (value.length < 32) {
      weak.push(secret);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `CRITICAL SECURITY ERROR: Missing required secrets: ${missing.join(', ')}`
    );
  }

  if (weak.length > 0) {
    console.warn(
      `SECURITY WARNING: Weak secrets (< 32 chars): ${weak.join(', ')}`
    );
  }
}
```

Call in main.ts:

```typescript
// main.ts
import { validateSecurityConfig } from './config/security-config.validator';

async function bootstrap() {
  // Validate security configuration on startup
  validateSecurityConfig();

  const app = await NestFactory.create(AppModule);
  // ... rest of bootstrap
}
```

---

## Verification Checklist

After implementing all fixes, verify:

### API Key Authentication
- [ ] API key module imported in app.module.ts
- [ ] Database migration created and run
- [ ] API keys can be generated via API
- [ ] API key guard protects webhook endpoints
- [ ] Invalid API keys are rejected

### Global Guard Ordering
- [ ] Global guards configured in app.module.ts
- [ ] All public routes marked with @Public()
- [ ] Protected routes require authentication
- [ ] Unauthorized requests return 401
- [ ] Authorization checks work correctly

### bcrypt Salt Rounds
- [ ] BCRYPT_SALT_ROUNDS=12 in .env
- [ ] auth.service.ts updated to use configurable salt rounds
- [ ] user.model.ts updated to use 12 salt rounds
- [ ] New passwords use 12 rounds
- [ ] Password hashing test passes

### Environment Configuration
- [ ] All secrets generated and configured
- [ ] .env file updated with strong secrets
- [ ] CORS_ORIGIN configured correctly
- [ ] Security validation passes on startup
- [ ] Production configuration prepared

---

## Testing Plan

### Unit Tests

```bash
# Test API key authentication
npm test -- api-key-auth

# Test password hashing
npm test -- auth.service

# Test guard ordering
npm test -- guards
```

### Integration Tests

```bash
# Test authentication flow
npm run test:e2e -- auth.e2e-spec.ts

# Test authorization
npm run test:e2e -- authorization.e2e-spec.ts
```

### Manual Testing

1. **Test Unauthenticated Access:**
   ```bash
   curl http://localhost:3001/api/students
   # Expected: 401 Unauthorized
   ```

2. **Test Public Routes:**
   ```bash
   curl http://localhost:3001/health
   # Expected: 200 OK
   ```

3. **Test API Key:**
   ```bash
   curl http://localhost:3001/webhooks/test \
     -H "X-API-Key: YOUR_API_KEY"
   # Expected: 200 OK
   ```

4. **Test JWT Auth:**
   ```bash
   curl http://localhost:3001/api/students \
     -H "Authorization: Bearer YOUR_JWT_TOKEN"
   # Expected: 200 OK
   ```

---

## Rollback Plan

If issues occur after implementation:

### Rollback API Key Authentication

```typescript
// app.module.ts - Remove import
// import { ApiKeyAuthModule } from './api-key-auth/api-key-auth.module';

// Remove from imports array
imports: [
  // ApiKeyAuthModule, // ← Comment out or remove
]
```

### Rollback Global Guards

```typescript
// app.module.ts - Comment out providers
providers: [
  // {
  //   provide: APP_GUARD,
  //   useClass: JwtAuthGuard,
  // },
  // ... other guards
]
```

### Rollback bcrypt Salt Rounds

```typescript
// auth.service.ts
private readonly saltRounds = 10; // Revert to 10

// user.model.ts
user.password = await bcrypt.hash(user.password, 10); // Revert to 10
```

---

## Support and Questions

If you encounter issues during implementation:

1. Review the Security Audit Report for detailed explanations
2. Check the implementation examples in the created files
3. Review NestJS documentation on guards and security
4. Check application logs for error messages
5. Test in development environment first

---

## Next Steps After Implementation

1. ✅ **Code Review:** Have another developer review security changes
2. ✅ **Testing:** Run full test suite and manual security tests
3. ✅ **Documentation:** Update API documentation with new security requirements
4. ✅ **Deployment:** Deploy to staging environment first
5. ✅ **Monitoring:** Monitor logs for security events and errors
6. ✅ **Audit:** Schedule follow-up security audit in 90 days

---

**Implementation Date:** 2025-11-03
**Last Updated:** 2025-11-03
**Version:** 1.0.0
