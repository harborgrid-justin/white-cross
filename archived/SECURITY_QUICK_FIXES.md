# Security Quick Fixes - White Cross Backend
**Priority Actions for Immediate Implementation**

---

## 🔴 CRITICAL - Fix Within 24 Hours

### 1. Enable Global Authentication (30 minutes)

**File:** `/workspaces/white-cross/backend/src/app.module.ts`

```typescript
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Module({
  // ... existing imports
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
```

**File:** `/workspaces/white-cross/backend/src/student/student.controller.ts`
```typescript
@ApiTags('students')
@ApiBearerAuth() // UNCOMMENT THIS LINE
@Controller('students')
export class StudentController {
```

**File:** `/workspaces/white-cross/backend/src/health-record/health-record.controller.ts`
```typescript
@ApiTags('health-record')
@ApiBearerAuth() // UNCOMMENT THIS LINE
@Controller('health-record')
export class HealthRecordController {
```

### 2. Remove Default Secrets (1 hour)

**File:** `/workspaces/white-cross/backend/src/auth/auth.module.ts`

BEFORE:
```typescript
secret: configService.get<string>('JWT_SECRET') || 'default-secret-change-in-production',
```

AFTER:
```typescript
const jwtSecret = configService.get<string>('JWT_SECRET');
if (!jwtSecret || jwtSecret.length < 64) {
  throw new Error('JWT_SECRET must be configured with at least 64 characters');
}

return {
  secret: jwtSecret,
  signOptions: {
    expiresIn: '15m',
    issuer: 'white-cross-healthcare',
    audience: 'white-cross-api',
  },
};
```

Apply same pattern to:
- `/workspaces/white-cross/backend/src/auth/auth.service.ts` (lines 151, 176, 325, 338)
- `/workspaces/white-cross/backend/src/middleware/security/csrf.guard.ts` (lines 300, 344)
- `/workspaces/white-cross/backend/src/shared/config/helpers.ts`

### 3. Fix CORS Wildcard (15 minutes)

**File:** `/workspaces/white-cross/backend/src/main.ts`

BEFORE:
```typescript
app.enableCors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
});
```

AFTER:
```typescript
const corsOrigin = configService.get<string>('CORS_ORIGIN');
if (!corsOrigin) {
  throw new Error('CORS_ORIGIN must be configured');
}

app.enableCors({
  origin: corsOrigin.split(',').map(o => o.trim()),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
  exposedHeaders: ['X-Total-Count', 'X-Request-ID'],
  maxAge: 3600,
});
```

### 4. Secure .env File (30 minutes)

**Step 1:** Add to `.gitignore`
```bash
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
```

**Step 2:** Check if .env was committed
```bash
git log --all --full-history -- backend/.env
```

**Step 3:** If found in git history, rotate ALL credentials:
- Database password
- JWT_SECRET
- JWT_REFRESH_SECRET
- REDIS_PASSWORD

**Step 4:** Set proper permissions
```bash
chmod 600 backend/.env
```

### 5. Rotate Exposed Credentials (2 hours)

**Current exposed secrets in .env:**
- `DB_PASSWORD=npg_rj6VckGihv0J` ← ROTATE
- `JWT_SECRET=052ba1596692746b...` ← ROTATE
- `JWT_REFRESH_SECRET=d3aef7d1a03ddc...` ← ROTATE
- `REDIS_PASSWORD=I7NxZuOAnvmO6MHC...` ← ROTATE

**Generate new secrets:**
```bash
# JWT_SECRET (64 bytes = 128 hex chars)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# JWT_REFRESH_SECRET
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# CSRF_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🟠 HIGH PRIORITY - Fix Within 1 Week

### 6. Implement Token Blacklisting (4 hours)

**File:** `/workspaces/white-cross/backend/src/auth/auth.controller.ts`

```typescript
import { RedisService } from '../infrastructure/cache/redis.service';

@UseGuards(JwtAuthGuard)
@Post('logout')
async logout(
  @CurrentUser() user: any,
  @Headers('authorization') authHeader: string
) {
  const token = authHeader.replace('Bearer ', '');

  // Decode token to get expiration
  const decoded = this.jwtService.decode(token) as any;
  const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);

  // Add to blacklist
  await this.redisService.set(
    `blacklist:token:${token}`,
    'revoked',
    expiresIn
  );

  return {
    success: true,
    message: 'Logged out successfully',
  };
}
```

**File:** `/workspaces/white-cross/backend/src/auth/strategies/jwt.strategy.ts`

```typescript
async validate(req: any, payload: JwtPayload) {
  // Extract token
  const token = req.headers.authorization?.replace('Bearer ', '');

  // Check blacklist
  const isBlacklisted = await this.redisService.get(`blacklist:token:${token}`);
  if (isBlacklisted) {
    throw new UnauthorizedException('Token has been revoked');
  }

  // ... rest of validation
}
```

### 7. Enable Security Headers (2 hours)

**File:** `/workspaces/white-cross/backend/src/main.ts`

```typescript
import { SecurityHeadersMiddleware } from './middleware/security/security-headers.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Apply security headers
  const securityHeaders = new SecurityHeadersMiddleware();
  app.use((req, res, next) => securityHeaders.use(req, res, next));

  // ... rest of configuration
}
```

### 8. Enable Rate Limiting (3 hours)

**File:** `/workspaces/white-cross/backend/src/app.module.ts`

```typescript
import { APP_GUARD } from '@nestjs/core';
import { RateLimitGuard } from './middleware/security/rate-limit.guard';

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: RateLimitGuard,
    },
  ],
})
export class AppModule {}
```

**File:** Create `/workspaces/white-cross/backend/src/auth/auth.controller.ts` decorators

```typescript
import { RateLimit } from '../middleware/security/rate-limit.guard';

@Controller('auth')
export class AuthController {
  @Public()
  @Post('login')
  @RateLimit('auth') // 5 requests per 15 minutes
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Public()
  @Post('register')
  @RateLimit('auth')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
}
```

### 9. Add Startup Security Validation (1 hour)

**File:** `/workspaces/white-cross/backend/src/main.ts`

```typescript
function validateSecurityConfig() {
  const required = [
    { key: 'JWT_SECRET', minLength: 64 },
    { key: 'JWT_REFRESH_SECRET', minLength: 64 },
    { key: 'DB_PASSWORD', minLength: 12 },
    { key: 'CORS_ORIGIN', minLength: 1 },
  ];

  const errors = [];

  for (const { key, minLength } of required) {
    const value = process.env[key];

    if (!value) {
      errors.push(`${key} is required but not set`);
      continue;
    }

    if (value.length < minLength) {
      errors.push(`${key} must be at least ${minLength} characters`);
    }

    // Check for weak values
    const weak = ['default', 'secret', 'password', 'change', '123'];
    if (weak.some(w => value.toLowerCase().includes(w))) {
      errors.push(`${key} contains weak/default value`);
    }
  }

  if (errors.length > 0) {
    throw new Error(
      'Security configuration errors:\n' +
      errors.map(e => `  - ${e}`).join('\n')
    );
  }
}

async function bootstrap() {
  // Validate before starting
  validateSecurityConfig();

  const app = await NestFactory.create(AppModule);
  // ... rest
}
```

### 10. Increase BCrypt Rounds (15 minutes)

**File:** `/workspaces/white-cross/backend/src/auth/auth.service.ts`

BEFORE:
```typescript
private readonly saltRounds = 10;
```

AFTER:
```typescript
private readonly saltRounds = 12; // More secure for healthcare data
```

**File:** `/workspaces/white-cross/backend/src/database/models/user.model.ts`

BEFORE:
```typescript
user.password = await bcrypt.hash(user.password, 10);
```

AFTER:
```typescript
user.password = await bcrypt.hash(user.password, 12);
```

---

## Testing Checklist

After applying fixes, test:

### Authentication
```bash
# Test login without credentials - should fail
curl http://localhost:3001/students

# Test login with credentials - should succeed
curl -H "Authorization: Bearer <token>" http://localhost:3001/students

# Test logout - should blacklist token
curl -X POST -H "Authorization: Bearer <token>" http://localhost:3001/auth/logout

# Test with blacklisted token - should fail
curl -H "Authorization: Bearer <token>" http://localhost:3001/students
```

### Rate Limiting
```bash
# Try 6 login attempts rapidly - should block on 6th
for i in {1..6}; do
  curl -X POST http://localhost:3001/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}'
done
```

### CORS
```bash
# Test from unauthorized origin - should fail
curl -H "Origin: http://evil.com" http://localhost:3001/students

# Test from authorized origin - should succeed
curl -H "Origin: http://localhost:3000" http://localhost:3001/students
```

### Security Headers
```bash
# Check security headers are present
curl -I http://localhost:3001/students | grep -E "X-Frame-Options|X-Content-Type-Options|Strict-Transport-Security"
```

---

## Deployment Checklist

Before deploying to production:

- [ ] All default secrets removed
- [ ] All credentials rotated
- [ ] .env file not in git
- [ ] .env file has 600 permissions
- [ ] Global authentication enabled
- [ ] CORS configured with specific origins
- [ ] Rate limiting enabled
- [ ] Security headers enabled
- [ ] Startup validation implemented
- [ ] All controllers have @ApiBearerAuth()
- [ ] Swagger docs protected in production
- [ ] Database uses SSL/TLS
- [ ] Redis uses TLS
- [ ] HTTPS enforced (no HTTP)

---

## Environment Variables Required

Ensure `.env` has these configured:

```bash
# Required with strong values
JWT_SECRET=<64+ character random string>
JWT_REFRESH_SECRET=<64+ character random string>
CSRF_SECRET=<32+ character random string>
ENCRYPTION_KEY=<32+ character random string>
DB_PASSWORD=<strong password>
REDIS_PASSWORD=<strong password>

# Required with specific values
NODE_ENV=production
CORS_ORIGIN=https://app.whitecross.health,https://admin.whitecross.health

# Optional but recommended
DB_SSL=true
REDIS_TLS=true
LOG_LEVEL=warn
```

---

## Support

For questions or issues with these fixes:
1. Review the full security analysis report
2. Check NestJS security documentation
3. Consult HIPAA compliance guidelines
4. Contact security team

**Last Updated:** November 3, 2025
