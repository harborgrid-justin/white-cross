# Security Issues and Fixes - Quick Reference

## CRITICAL Issues (Fix Immediately)

### 1. JWT Auth Guard Test Failures 🚨

**Issue:** All 27 JWT authentication tests failing due to missing TokenBlacklistService dependency

**Location:** `/workspaces/white-cross/backend/src/auth/guards/__tests__/jwt-auth.guard.spec.ts`

**Error:**
```
Nest can't resolve dependencies of the JwtAuthGuard (Reflector, ?).
Please make sure that the argument TokenBlacklistService at index [1]
is available in the RootTestModule context.
```

**Fix:**

```typescript
// BEFORE (BROKEN):
beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      JwtAuthGuard,
      {
        provide: Reflector,
        useValue: {
          getAllAndOverride: jest.fn(),
        },
      },
    ],
  }).compile();

  guard = module.get<JwtAuthGuard>(JwtAuthGuard);
  reflector = module.get<Reflector>(Reflector);
});

// AFTER (FIXED):
beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      JwtAuthGuard,
      {
        provide: Reflector,
        useValue: {
          getAllAndOverride: jest.fn(),
        },
      },
      // ADD THIS MOCK:
      {
        provide: TokenBlacklistService,
        useValue: {
          isTokenBlacklisted: jest.fn().mockResolvedValue(false),
          areUserTokensBlacklisted: jest.fn().mockResolvedValue(false),
        },
      },
    ],
  }).compile();

  guard = module.get<JwtAuthGuard>(JwtAuthGuard);
  reflector = module.get<Reflector>(Reflector);
});
```

**Test Command:**
```bash
npm test -- --testPathPatterns="jwt-auth.guard.spec"
```

**Expected Result:** All 27 tests should pass ✅

---

## HIGH Priority Issues

### 2. Unused SIGNATURE_SECRET ⚠️

**Issue:** SIGNATURE_SECRET defined in .env but not used anywhere in codebase

**Current State:**
```bash
SIGNATURE_SECRET=7fddd084981721eadbd0318788a90ecd83a2b1cd8c6cc556f40c40a23ee33946
```

**Grep Result:** 0 references found in source code

**Recommended Actions:**

**Option A: Implement Intended Purpose**
If this secret was intended for webhook signatures, API signing, or similar:

```typescript
// Example: Webhook signature verification
import * as crypto from 'crypto';

export class WebhookService {
  constructor(private readonly configService: ConfigService) {}

  verifySignature(payload: string, signature: string): boolean {
    const signatureSecret = this.configService.get<string>('SIGNATURE_SECRET');

    if (!signatureSecret) {
      throw new Error('SIGNATURE_SECRET not configured');
    }

    const expectedSignature = crypto
      .createHmac('sha256', signatureSecret)
      .update(payload)
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  }
}
```

**Option B: Remove if Not Needed**
If not needed, remove from:
1. `.env`
2. `.env.example`
3. Documentation referencing it

---

## MEDIUM Priority Issues

### 3. Database SSL Configuration Enhancement 🔒

**Current Configuration:**
```typescript
dialectOptions: {
  ssl: {
    require: true,
    rejectUnauthorized: false  // ⚠️ Accepts self-signed certificates
  }
}
```

**Production Recommendation:**
```typescript
dialectOptions: {
  ssl: {
    require: true,
    rejectUnauthorized: process.env.NODE_ENV === 'production',  // ✅ Strict in production
    ca: process.env.DB_SSL_CA,  // ✅ Certificate authority
    cert: process.env.DB_SSL_CERT,  // ✅ Client certificate (if required)
    key: process.env.DB_SSL_KEY,  // ✅ Client key (if required)
  }
}
```

**Add to .env (production):**
```bash
DB_SSL_CA=/path/to/ca-certificate.crt
DB_SSL_CERT=/path/to/client-cert.pem  # Optional
DB_SSL_KEY=/path/to/client-key.pem    # Optional
```

---

### 4. Rate Limiting Configuration 🛡️

**Current Status:** Infrastructure in place but limits need tuning

**Recommended Configuration:**

**File:** `/workspaces/white-cross/backend/src/auth/auth.controller.ts`

```typescript
import { ThrottleLimit, ThrottleTtl } from '../decorators/throttle.decorator';

@Controller('auth')
export class AuthController {

  @Post('login')
  @Public()
  @ThrottleLimit(5)    // 5 attempts
  @ThrottleTtl(60)     // per minute
  @ApiOperation({ summary: 'User login' })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @Public()
  @ThrottleLimit(3)     // 3 registrations
  @ThrottleTtl(3600)    // per hour
  @ApiOperation({ summary: 'User registration' })
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(registerDto);
  }

  @Post('refresh')
  @Public()
  @ThrottleLimit(10)    // 10 refreshes
  @ThrottleTtl(60)      // per minute
  async refreshToken(@Body() refreshDto: RefreshTokenDto): Promise<AuthResponseDto> {
    return this.authService.refreshToken(refreshDto.refreshToken);
  }
}
```

---

### 5. CSRF Protection Verification ✅

**Current Implementation:** CSRF guard exists, verify it's active

**File:** `/workspaces/white-cross/backend/src/middleware/security/csrf.guard.ts`

**Verify in main.ts:**
```typescript
// Check if CSRF protection is enabled globally
app.useGlobalGuards(
  new JwtAuthGuard(),
  new RolesGuard(reflector),
  new CsrfGuard(configService), // ✅ Should be here
);
```

**Or apply per-controller:**
```typescript
@Controller('api')
@UseGuards(CsrfGuard)  // ✅ Apply CSRF protection
export class ApiController {
  // ...
}
```

**Skip CSRF for API endpoints with Bearer tokens:**
```typescript
// Already implemented correctly in CsrfGuard:
use(req: Request, res: Response, next: NextFunction) {
  // Skip CSRF for API endpoints with Bearer token
  if (req.headers.authorization?.startsWith('Bearer ')) {
    return next();
  }

  this.csrfProtection(req, res, next);
}
```

---

## Verification Checklist

### Authentication Tests
```bash
# Run all auth tests
npm test -- auth/

# Run specific test suites
npm test -- --testPathPatterns="jwt-auth.guard.spec"
npm test -- --testPathPatterns="auth.service.spec"
npm test -- --testPathPatterns="roles.guard.spec"
```

### Security Configuration Tests
```bash
# Verify JWT secret validation
npm run start:dev
# Should fail if JWT_SECRET < 32 chars

# Test with invalid secret
JWT_SECRET=short npm run start:dev
# Expected: "CRITICAL SECURITY ERROR: JWT_SECRET must be at least 32 characters"

# Test with missing secret
unset JWT_SECRET && npm run start:dev
# Expected: "CRITICAL SECURITY ERROR: JWT_SECRET is not configured"
```

### Database Connection Tests
```bash
# Test database connection with SSL
npm run start:dev
# Check logs for: "Database connected successfully"

# Verify SSL mode in connection string
echo $DATABASE_URL | grep "sslmode=require"
# Should output the full connection string with sslmode=require
```

### Encryption Tests
```bash
# Test encryption service
npm test -- --testPathPatterns="encryption.service.spec"

# Test in development console:
node -e "
const crypto = require('crypto');
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);
const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
let encrypted = cipher.update('test', 'utf8', 'hex');
encrypted += cipher.final('hex');
const authTag = cipher.getAuthTag();
console.log('Encryption test passed ✅');
"
```

---

## Quick Fix Script

Create a file `fix-auth-tests.sh`:

```bash
#!/bin/bash

# Fix JWT Auth Guard Tests
echo "Fixing JWT Auth Guard test dependencies..."

# Backup original file
cp src/auth/guards/__tests__/jwt-auth.guard.spec.ts \
   src/auth/guards/__tests__/jwt-auth.guard.spec.ts.bak

# Add TokenBlacklistService mock
# (Manual edit required - see fix above)

echo "Running tests..."
npm test -- --testPathPatterns="jwt-auth.guard.spec"

if [ $? -eq 0 ]; then
  echo "✅ All tests passed!"
  rm src/auth/guards/__tests__/jwt-auth.guard.spec.ts.bak
else
  echo "❌ Tests failed. Restoring backup..."
  mv src/auth/guards/__tests__/jwt-auth.guard.spec.ts.bak \
     src/auth/guards/__tests__/jwt-auth.guard.spec.ts
fi
```

Make executable:
```bash
chmod +x fix-auth-tests.sh
./fix-auth-tests.sh
```

---

## Security Monitoring Commands

### Check for Hardcoded Secrets
```bash
# Search for potential hardcoded secrets
grep -r "password.*=.*['\"]" src/ --exclude-dir=node_modules
grep -r "secret.*=.*['\"]" src/ --exclude-dir=node_modules
grep -r "api[_-]key.*=.*['\"]" src/ --exclude-dir=node_modules

# Should return minimal results (mostly comments or test data)
```

### Verify Environment Variables
```bash
# Check all required secrets are set
node -e "
const required = [
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
  'CSRF_SECRET',
  'CONFIG_ENCRYPTION_KEY',
  'DB_PASSWORD',
  'REDIS_PASSWORD'
];

const missing = required.filter(key => !process.env[key]);

if (missing.length > 0) {
  console.error('❌ Missing secrets:', missing);
  process.exit(1);
} else {
  console.log('✅ All required secrets present');
}
"
```

### Audit Log Verification
```bash
# Check if audit logs are being created
psql $DATABASE_URL -c "
SELECT COUNT(*) as audit_log_count,
       COUNT(CASE WHEN \"isPHI\" = true THEN 1 END) as phi_logs
FROM \"AuditLog\"
WHERE \"createdAt\" > NOW() - INTERVAL '1 hour';
"
```

### Token Blacklist Verification
```bash
# Check Redis token blacklist
redis-cli -h $REDIS_HOST -p $REDIS_PORT -a $REDIS_PASSWORD --no-auth-warning \
  KEYS "token:blacklist:*" | wc -l

# Should show count of blacklisted tokens
```

---

## Production Deployment Verification

Before deploying to production, run this comprehensive check:

```bash
#!/bin/bash

echo "🔒 Security Pre-Deployment Check"
echo "================================="

# 1. Test Suite
echo "1. Running test suite..."
npm test
if [ $? -ne 0 ]; then
  echo "❌ Tests failed! Fix tests before deployment."
  exit 1
fi

# 2. Secret Length Check
echo "2. Checking secret lengths..."
if [ ${#JWT_SECRET} -lt 32 ]; then
  echo "❌ JWT_SECRET too short (${#JWT_SECRET} chars, need 32+)"
  exit 1
fi

# 3. Database SSL Check
echo "3. Verifying database SSL..."
if [[ ! $DATABASE_URL =~ "sslmode=require" ]]; then
  echo "❌ Database SSL not enabled"
  exit 1
fi

# 4. Environment Check
echo "4. Checking environment..."
if [ "$NODE_ENV" != "production" ]; then
  echo "⚠️  Warning: NODE_ENV not set to production"
fi

# 5. CORS Check
echo "5. Checking CORS configuration..."
if [ "$CORS_ORIGIN" == "*" ]; then
  echo "❌ CORS allows all origins (wildcard)"
  exit 1
fi

echo "✅ All security checks passed!"
```

---

## Contact & Support

For security questions or to report vulnerabilities:
- **Email:** security@whitecross.edu
- **Security Lead:** [To be assigned]
- **Documentation:** See SECURITY_AUDIT_REPORT.md

**Last Updated:** 2025-11-03
