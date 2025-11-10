# Security Implementation Guide - Immediate Actions
**Priority:** CRITICAL
**Timeline:** Week 1 Implementation
**Target:** Production Security Hardening

---

## Quick Start - Critical Security Fixes

This guide provides ready-to-implement code for the 5 most critical security vulnerabilities identified in the security review.

---

## 1. JWT Authentication Middleware (CRITICAL)

### File: `src/common/middleware/jwt-auth.middleware.ts`

```typescript
import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    roles: string[];
    permissions: string[];
    tenantId?: string;
    sessionId?: string;
  };
}

@Injectable()
export class JwtAuthMiddleware implements NestMiddleware {
  private readonly logger = new Logger(JwtAuthMiddleware.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async use(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    // Skip authentication for public routes
    if (this.isPublicRoute(req.path)) {
      return next();
    }

    // Extract and validate Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Missing or invalid Authorization header',
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer '

    try {
      // Verify JWT token
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_SECRET'),
        issuer: 'white-cross-healthcare',
        audience: 'white-cross-api',
      });

      // Check token expiration
      if (payload.exp && Date.now() >= payload.exp * 1000) {
        throw new UnauthorizedException('Token has expired');
      }

      // Check token revocation
      const isRevoked = await this.redis.exists(`revoked:${payload.jti}`);
      if (isRevoked) {
        this.logger.warn(`Revoked token used: ${payload.jti} by user ${payload.sub}`);
        throw new UnauthorizedException('Token has been revoked');
      }

      // Check session validity
      if (payload.sessionId) {
        const sessionExists = await this.redis.exists(`session:${payload.sessionId}`);
        if (!sessionExists) {
          throw new UnauthorizedException('Session expired or invalid');
        }

        // Update last activity
        await this.redis.expire(`session:${payload.sessionId}`, 30 * 60); // 30 min
      }

      // Attach user to request
      req.user = {
        id: payload.sub,
        email: payload.email,
        roles: payload.roles || [],
        permissions: payload.permissions || [],
        tenantId: payload.tenantId,
        sessionId: payload.sessionId,
      };

      // Log authentication success
      this.logger.debug(`User authenticated: ${payload.sub}`);

      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token has expired');
      }
      if (error.name === 'JsonWebTokenError') {
        this.logger.error(`Invalid token signature: ${error.message}`);
        throw new UnauthorizedException('Invalid token signature');
      }
      if (error.name === 'NotBeforeError') {
        throw new UnauthorizedException('Token not yet valid');
      }

      this.logger.error(`Authentication failed: ${error.message}`);
      throw new UnauthorizedException('Authentication failed');
    }
  }

  private isPublicRoute(path: string): boolean {
    const publicRoutes = [
      '/health',
      '/api/v1/auth/login',
      '/api/v1/auth/register',
      '/api/v1/auth/refresh',
      '/api/v1/auth/forgot-password',
      '/api-docs',
      '/swagger',
    ];

    return publicRoutes.some((route) => path.startsWith(route));
  }
}
```

### Module Configuration: `src/app.module.ts`

```typescript
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { JwtAuthMiddleware } from './common/middleware/jwt-auth.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    // JWT Configuration
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: {
          expiresIn: config.get('JWT_EXPIRATION', '15m'),
          issuer: 'white-cross-healthcare',
          audience: 'white-cross-api',
          algorithm: 'HS256',
        },
      }),
    }),

    // Redis Configuration
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        config: {
          host: config.get('REDIS_HOST', 'localhost'),
          port: config.get('REDIS_PORT', 6379),
          password: config.get('REDIS_PASSWORD'),
          db: config.get('REDIS_AUTH_DB', 0),
          tls: config.get('NODE_ENV') === 'production' ? {} : undefined,
          keyPrefix: 'auth:',
        },
      }),
    }),
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtAuthMiddleware)
      .forRoutes('*'); // Apply to all routes
  }
}
```

---

## 2. Authentication Guards for Controllers

### File: `src/common/guards/api-guards.module.ts`

```typescript
import { Module, Global } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { PermissionsGuard } from './permissions.guard';
import { HIPAAComplianceGuard } from './hipaa-compliance.guard';

@Global()
@Module({
  providers: [
    // Apply guards globally in order
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
    {
      provide: APP_GUARD,
      useClass: HIPAAComplianceGuard,
    },
  ],
  exports: [],
})
export class ApiGuardsModule {}
```

### File: `src/common/guards/jwt-auth.guard.ts`

```typescript
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Check if route is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    // Check if user is attached to request (by middleware)
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('Authentication required');
    }

    return true;
  }
}
```

### File: `src/common/decorators/public.decorator.ts`

```typescript
import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
```

### Usage in Controllers:

```typescript
import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RequirePermissions } from '../common/decorators/permissions.decorator';

@Controller('api/v1/users')
@ApiTags('Users')
@ApiBearerAuth()
export class UsersController {
  // Public endpoint - no authentication required
  @Public()
  @Get('health')
  health() {
    return { status: 'ok' };
  }

  // Protected endpoint - authentication required
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  // Admin only endpoint
  @Get('all')
  @Roles('admin', 'super_admin')
  getAllUsers() {
    return this.usersService.findAll();
  }

  // Permission-based endpoint
  @Post()
  @RequirePermissions('users:create')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // Healthcare staff only
  @Get('patients/:id/medical-records')
  @Roles('doctor', 'nurse', 'admin')
  @RequirePermissions('medical_records:read')
  getMedicalRecords(@Param('id') patientId: string) {
    return this.medicalRecordsService.getByPatient(patientId);
  }
}
```

---

## 3. Redis-Based Rate Limiting

### Installation:

```bash
npm install @nestjs/throttler nestjs-throttler-storage-redis ioredis
```

### File: `src/common/rate-limiting/rate-limiting.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import Redis from 'ioredis';
import { CustomThrottlerGuard } from './custom-throttler.guard';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const redis = new Redis({
          host: config.get('REDIS_HOST', 'localhost'),
          port: config.get('REDIS_PORT', 6379),
          password: config.get('REDIS_PASSWORD'),
          db: config.get('REDIS_THROTTLE_DB', 1),
          keyPrefix: 'throttle:',
          tls: config.get('NODE_ENV') === 'production' ? {} : undefined,
        });

        return {
          throttlers: [
            {
              name: 'short',
              ttl: 1000, // 1 second
              limit: 10, // 10 requests per second
            },
            {
              name: 'medium',
              ttl: 60000, // 1 minute
              limit: 100, // 100 requests per minute
            },
            {
              name: 'long',
              ttl: 3600000, // 1 hour
              limit: 1000, // 1000 requests per hour
            },
          ],
          storage: new ThrottlerStorageRedisService(redis),
        };
      },
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    },
  ],
})
export class RateLimitingModule {}
```

### File: `src/common/rate-limiting/custom-throttler.guard.ts`

```typescript
import {
  Injectable,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { ThrottlerGuard, ThrottlerException } from '@nestjs/throttler';
import { Reflector } from '@nestjs/core';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  private readonly logger = new Logger(CustomThrottlerGuard.name);

  constructor(protected readonly reflector: Reflector) {
    super();
  }

  protected async getTracker(req: Record<string, any>): Promise<string> {
    // Track by user ID for authenticated requests
    if (req.user?.id) {
      return `user:${req.user.id}`;
    }

    // Track by IP for unauthenticated requests
    const ip = this.getClientIP(req);
    return `ip:${ip}`;
  }

  protected getThrottlerLimit(context: ExecutionContext): number {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Different limits based on user role
    if (user?.roles?.includes('admin')) {
      return 5000; // 5000 req/hour for admins
    } else if (user) {
      return 1000; // 1000 req/hour for authenticated users
    } else {
      return 100; // 100 req/hour for anonymous
    }
  }

  protected async throwThrottlingException(context: ExecutionContext): Promise<void> {
    const request = context.switchToHttp().getRequest();
    const ip = this.getClientIP(request);

    this.logger.warn(
      `Rate limit exceeded for ${request.user?.id || ip} on ${request.method} ${request.url}`,
    );

    throw new ThrottlerException(
      'Rate limit exceeded. Please try again later.',
    );
  }

  private getClientIP(req: any): string {
    return (
      req.headers['cf-connecting-ip'] || // Cloudflare
      req.headers['x-real-ip'] || // Nginx
      req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      req.connection?.remoteAddress ||
      req.socket?.remoteAddress ||
      'unknown'
    );
  }
}
```

### Custom Rate Limiting Decorators:

```typescript
// src/common/decorators/throttle.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const THROTTLE_LIMIT_KEY = 'throttle-limit';
export const THROTTLE_TTL_KEY = 'throttle-ttl';

export const ThrottleLimit = (limit: number) =>
  SetMetadata(THROTTLE_LIMIT_KEY, limit);

export const ThrottleTtl = (ttl: number) => SetMetadata(THROTTLE_TTL_KEY, ttl);

// Usage in controller
@Controller('auth')
export class AuthController {
  @Post('login')
  @ThrottleLimit(5) // 5 attempts
  @ThrottleTtl(3600000) // per hour
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
```

---

## 4. Comprehensive Security Headers

### File: `src/main.ts`

```typescript
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  // ============================================================================
  // SECURITY HEADERS WITH HELMET
  // ============================================================================
  app.use(
    helmet({
      // Content Security Policy
      contentSecurityPolicy: {
        useDefaults: false,
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: [
            "'self'",
            "'unsafe-inline'", // Remove in production
          ],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'https://cdn.whitecross.health'],
          fontSrc: ["'self'", 'https://fonts.gstatic.com'],
          connectSrc: ["'self'", 'https://api.whitecross.health'],
          frameSrc: ["'none'"],
          objectSrc: ["'none'"],
          baseUri: ["'self'"],
          formAction: ["'self'"],
          frameAncestors: ["'none'"],
          upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : undefined,
        },
      },

      // HTTP Strict Transport Security
      hsts: {
        maxAge: 31536000, // 1 year
        includeSubDomains: true,
        preload: true,
      },

      // Frame Options
      frameguard: {
        action: 'deny',
      },

      // X-Content-Type-Options
      noSniff: true,

      // Referrer Policy
      referrerPolicy: {
        policy: 'strict-origin-when-cross-origin',
      },

      // Cross-Origin Policies
      crossOriginEmbedderPolicy: true,
      crossOriginOpenerPolicy: { policy: 'same-origin' },
      crossOriginResourcePolicy: { policy: 'same-origin' },

      // Hide X-Powered-By
      hidePoweredBy: true,
    }),
  );

  // ============================================================================
  // CUSTOM SECURITY HEADERS
  // ============================================================================
  app.use((req, res, next) => {
    // Permissions-Policy (Feature-Policy)
    res.setHeader(
      'Permissions-Policy',
      [
        'geolocation=()',
        'microphone=()',
        'camera=()',
        'payment=()',
        'usb=()',
        'magnetometer=()',
        'gyroscope=()',
        'accelerometer=()',
      ].join(', '),
    );

    // Cache-Control for API responses
    if (req.path.startsWith('/api/')) {
      res.setHeader(
        'Cache-Control',
        'no-store, no-cache, must-revalidate, proxy-revalidate',
      );
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.setHeader('Surrogate-Control', 'no-store');
    }

    // HIPAA-specific headers
    if (req.path.includes('/patients') || req.path.includes('/medical')) {
      res.setHeader('X-Healthcare-Data', 'true');
      res.setHeader(
        'X-PHI-Warning',
        'This response may contain Protected Health Information',
      );
    }

    next();
  });

  // ============================================================================
  // CORS CONFIGURATION
  // ============================================================================
  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
        'http://localhost:3000',
        'https://whitecross.health',
      ];

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-CSRF-Token'],
    exposedHeaders: ['X-Total-Count', 'X-Page', 'X-Request-ID'],
    maxAge: 3600, // 1 hour
  });

  // ============================================================================
  // COMPRESSION
  // ============================================================================
  app.use(
    compression({
      filter: (req, res) => {
        // Don't compress PHI responses
        if (res.getHeader('X-PHI-Warning')) {
          return false;
        }
        return compression.filter(req, res);
      },
      level: 6,
    }),
  );

  // ============================================================================
  // VALIDATION PIPE
  // ============================================================================
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      validationError: {
        target: false,
        value: false,
      },
    }),
  );

  // ============================================================================
  // COOKIE PARSER
  // ============================================================================
  app.use(cookieParser());

  // ============================================================================
  // TRUST PROXY (if behind load balancer)
  // ============================================================================
  app.set('trust proxy', 1);

  await app.listen(process.env.PORT || 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
```

---

## 5. Tamper-Proof Audit Logging

### File: `src/common/audit/audit.service.ts`

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import * as crypto from 'crypto';
import { AuditLog } from './entities/audit-log.entity';
import { EncryptionService } from '../encryption/encryption.service';

export enum AuditAction {
  // Authentication
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  LOGIN_FAILED = 'LOGIN_FAILED',
  PASSWORD_CHANGE = 'PASSWORD_CHANGE',

  // Data Operations
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',

  // PHI/PII
  PHI_ACCESS = 'PHI_ACCESS',
  PHI_EXPORT = 'PHI_EXPORT',
  PHI_PRINT = 'PHI_PRINT',

  // Security
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  SECURITY_ALERT = 'SECURITY_ALERT',
}

export interface AuditLogEntry {
  action: AuditAction;
  userId: string;
  userEmail?: string;
  userRole?: string;
  entityType: string;
  entityId: string;
  before?: any;
  after?: any;
  ipAddress: string;
  userAgent: string;
  sessionId?: string;
  requestId?: string;
  success?: boolean;
  errorMessage?: string;
  metadata?: any;
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(
    @InjectRepository(AuditLog)
    private readonly auditRepository: Repository<AuditLog>,
    @InjectRedis() private readonly redis: Redis,
    private readonly encryptionService: EncryptionService,
  ) {}

  async log(entry: AuditLogEntry): Promise<string> {
    const auditId = crypto.randomUUID();

    try {
      // Calculate changes
      const changes = this.calculateChanges(entry.before, entry.after);

      // Encrypt sensitive data
      const encryptedChanges = changes
        ? await this.encryptionService.encrypt(JSON.stringify(changes))
        : null;

      // Build audit entry
      const auditEntry = {
        id: auditId,
        timestamp: new Date(),
        action: entry.action,
        userId: entry.userId,
        userEmail: entry.userEmail,
        userRole: entry.userRole,
        entityType: entry.entityType,
        entityId: entry.entityId,
        changes: encryptedChanges,
        ipAddress: entry.ipAddress,
        userAgent: entry.userAgent,
        sessionId: entry.sessionId,
        requestId: entry.requestId,
        success: entry.success !== false,
        errorMessage: entry.errorMessage,
        metadata: entry.metadata,
        version: 1,
      };

      // Calculate HMAC for integrity
      (auditEntry as any).hmac = this.calculateHMAC(auditEntry);

      // Save to database
      await this.auditRepository.save(auditEntry);

      // Cache recent audit for fast access
      await this.redis.zadd(
        `audit:${entry.userId}`,
        Date.now(),
        JSON.stringify(auditEntry),
      );
      await this.redis.expire(`audit:${entry.userId}`, 86400); // 24 hours

      // PHI access logging
      if (entry.action === AuditAction.PHI_ACCESS) {
        await this.logPHIAccess(auditEntry);
      }

      this.logger.log(
        `Audit logged: ${entry.action} on ${entry.entityType}:${entry.entityId} by ${entry.userId}`,
      );

      return auditId;
    } catch (error) {
      this.logger.error(`Failed to log audit: ${error.message}`, error.stack);
      throw error;
    }
  }

  async validateIntegrity(auditId: string): Promise<{
    valid: boolean;
    reason?: string;
  }> {
    const audit = await this.auditRepository.findOne({ where: { id: auditId } });

    if (!audit) {
      return { valid: false, reason: 'Audit log not found' };
    }

    const { hmac, ...auditData } = audit as any;
    const calculatedHMAC = this.calculateHMAC(auditData);

    if (calculatedHMAC !== hmac) {
      this.logger.error(`Audit integrity violation detected: ${auditId}`);
      return {
        valid: false,
        reason: 'HMAC mismatch - potential tampering detected',
      };
    }

    return { valid: true };
  }

  private calculateHMAC(data: any): string {
    const secret = process.env.AUDIT_HMAC_SECRET || 'CHANGE_IN_PRODUCTION';
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(JSON.stringify(data));
    return hmac.digest('hex');
  }

  private calculateChanges(before: any, after: any): any {
    if (!before || !after) return null;

    const changes: any = {};
    const allKeys = new Set([...Object.keys(before), ...Object.keys(after)]);

    for (const key of allKeys) {
      if (JSON.stringify(before[key]) !== JSON.stringify(after[key])) {
        changes[key] = {
          before: before[key],
          after: after[key],
        };
      }
    }

    return Object.keys(changes).length > 0 ? changes : null;
  }

  private async logPHIAccess(audit: any): Promise<void> {
    // Log PHI access to separate system for HIPAA compliance
    this.logger.warn(
      `PHI ACCESS: User ${audit.userId} accessed ${audit.entityType}:${audit.entityId}`,
    );

    // Send alert for monitoring
    await this.redis.publish(
      'phi-access',
      JSON.stringify({
        userId: audit.userId,
        entityType: audit.entityType,
        entityId: audit.entityId,
        timestamp: audit.timestamp,
      }),
    );
  }
}
```

### File: `src/common/audit/entities/audit-log.entity.ts`

```typescript
import {
  Entity,
  Column,
  PrimaryColumn,
  Index,
  CreateDateColumn,
} from 'typeorm';
import { AuditAction } from '../audit.service';

@Entity('audit_logs')
@Index(['userId', 'timestamp'])
@Index(['entityType', 'entityId'])
@Index(['action', 'timestamp'])
export class AuditLog {
  @PrimaryColumn('uuid')
  id: string;

  @CreateDateColumn()
  @Index()
  timestamp: Date;

  @Column({ type: 'enum', enum: AuditAction })
  @Index()
  action: AuditAction;

  @Column()
  @Index()
  userId: string;

  @Column({ nullable: true })
  userEmail?: string;

  @Column({ nullable: true })
  userRole?: string;

  @Column()
  entityType: string;

  @Column()
  entityId: string;

  @Column({ type: 'text', nullable: true })
  changes?: string; // Encrypted JSON

  @Column()
  ipAddress: string;

  @Column({ type: 'text' })
  userAgent: string;

  @Column({ nullable: true })
  sessionId?: string;

  @Column({ nullable: true })
  requestId?: string;

  @Column({ default: true })
  success: boolean;

  @Column({ type: 'text', nullable: true })
  errorMessage?: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: any;

  @Column()
  hmac: string;

  @Column({ default: 1 })
  version: number;
}
```

### Audit Interceptor:

```typescript
// src/common/interceptors/audit.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditService, AuditAction } from '../audit/audit.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly auditService: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, user, ip, headers, body } = request;

    // Determine audit action from HTTP method
    const actionMap = {
      POST: AuditAction.CREATE,
      GET: AuditAction.READ,
      PUT: AuditAction.UPDATE,
      PATCH: AuditAction.UPDATE,
      DELETE: AuditAction.DELETE,
    };

    const action = actionMap[method] || AuditAction.READ;

    return next.handle().pipe(
      tap({
        next: async () => {
          // Log successful operation
          await this.auditService.log({
            action,
            userId: user?.id || 'anonymous',
            userEmail: user?.email,
            userRole: user?.roles?.[0],
            entityType: this.extractEntityType(url),
            entityId: this.extractEntityId(url),
            ipAddress: ip,
            userAgent: headers['user-agent'] || 'unknown',
            sessionId: user?.sessionId,
            success: true,
          });
        },
        error: async (error) => {
          // Log failed operation
          await this.auditService.log({
            action,
            userId: user?.id || 'anonymous',
            userEmail: user?.email,
            userRole: user?.roles?.[0],
            entityType: this.extractEntityType(url),
            entityId: this.extractEntityId(url),
            ipAddress: ip,
            userAgent: headers['user-agent'] || 'unknown',
            sessionId: user?.sessionId,
            success: false,
            errorMessage: error.message,
          });
        },
      }),
    );
  }

  private extractEntityType(url: string): string {
    const parts = url.split('/').filter(Boolean);
    return parts[2] || 'unknown'; // /api/v1/[entity]
  }

  private extractEntityId(url: string): string {
    const parts = url.split('/').filter(Boolean);
    return parts[3] || 'list'; // /api/v1/entity/[id]
  }
}
```

---

## Environment Variables

Create `.env` file with these required variables:

```bash
# Application
NODE_ENV=production
PORT=3000

# JWT
JWT_SECRET=your-256-bit-secret-key-here-change-in-production
JWT_EXPIRATION=15m
JWT_REFRESH_SECRET=different-256-bit-secret-for-refresh
JWT_REFRESH_EXPIRATION=7d

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password
REDIS_AUTH_DB=0
REDIS_THROTTLE_DB=1

# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your-db-password
DATABASE_NAME=whitecross
DATABASE_SSL=true

# Encryption
ENCRYPTION_KEY=your-encryption-key-256-bit
AUDIT_HMAC_SECRET=your-hmac-secret-256-bit

# CORS
ALLOWED_ORIGINS=https://whitecross.health,https://app.whitecross.health

# Security
RATE_LIMIT_TTL=60000
RATE_LIMIT_MAX=100
```

---

## Testing the Implementation

### 1. Test JWT Authentication:

```bash
# Without token (should fail)
curl -X GET http://localhost:3000/api/v1/users/profile

# With invalid token (should fail)
curl -X GET http://localhost:3000/api/v1/users/profile \
  -H "Authorization: Bearer invalid-token"

# With valid token (should succeed)
curl -X GET http://localhost:3000/api/v1/users/profile \
  -H "Authorization: Bearer <your-jwt-token>"
```

### 2. Test Rate Limiting:

```bash
# Send 101 requests (should hit rate limit on 101st)
for i in {1..101}; do
  curl -X GET http://localhost:3000/api/v1/health
  echo "Request $i"
done
```

### 3. Test Security Headers:

```bash
curl -I http://localhost:3000/api/v1/health
```

Should see headers:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Strict-Transport-Security: max-age=31536000`
- `Content-Security-Policy: ...`

### 4. Test Audit Logging:

```typescript
// In your test
const auditId = await auditService.log({
  action: AuditAction.READ,
  userId: 'test-user-123',
  entityType: 'Patient',
  entityId: 'patient-456',
  ipAddress: '127.0.0.1',
  userAgent: 'test',
});

// Verify integrity
const result = await auditService.validateIntegrity(auditId);
expect(result.valid).toBe(true);
```

---

## Next Steps

After implementing these 5 critical fixes:

1. Update all existing controllers to use guards
2. Add audit logging to sensitive operations
3. Configure production environment variables
4. Test with penetration testing tools (OWASP ZAP, Burp Suite)
5. Conduct security code review
6. Document security procedures

---

## Production Deployment Checklist

Before deploying to production:

- [ ] JWT secrets are 256-bit random values
- [ ] Redis is configured with TLS and authentication
- [ ] Database uses SSL connections
- [ ] All controllers have authentication guards
- [ ] Rate limiting is configured with Redis
- [ ] Security headers are configured
- [ ] Audit logging is enabled
- [ ] Encryption keys are stored securely (AWS KMS/Secrets Manager)
- [ ] CORS is configured for production domains only
- [ ] Environment variables are set correctly
- [ ] Logging is configured (Winston/Pino to SIEM)
- [ ] Monitoring is configured (DataDog/New Relic)
- [ ] Alerting is configured (PagerDuty/Slack)
- [ ] Backup and recovery procedures are documented
- [ ] Incident response plan is documented
- [ ] Security testing is completed
- [ ] HIPAA compliance audit is completed

---

**Implementation Priority:** CRITICAL
**Estimated Time:** 1-2 days for core implementation
**Security Impact:** Addresses 5 of 23 critical vulnerabilities
