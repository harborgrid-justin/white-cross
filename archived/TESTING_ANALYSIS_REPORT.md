# White Cross Backend Testing Analysis Report

**Date**: November 3, 2025
**Analyzed By**: NestJS Testing Architect
**Project**: White Cross Healthcare Platform Backend

---

## Executive Summary

### Critical Findings

The White Cross backend has **severely inadequate test coverage** across all testing layers. This represents a significant risk for a healthcare platform handling HIPAA-compliant patient data.

### Test Coverage Statistics

| Category | Total Files | Files with Tests | Coverage % | Status |
|----------|-------------|------------------|------------|---------|
| **Services** | 181 | 20 | 11.0% | 🔴 CRITICAL |
| **Controllers** | 59 | 5 | 8.5% | 🔴 CRITICAL |
| **Guards** | 19 | 0 | 0.0% | 🔴 CRITICAL |
| **Interceptors** | 10+ | 0 | 0.0% | 🔴 CRITICAL |
| **Pipes** | 1+ | 0 | 0.0% | 🔴 CRITICAL |
| **Filters** | 3+ | 0 | 0.0% | 🔴 CRITICAL |
| **Gateways** | 2 | 0 | 0.0% | 🔴 CRITICAL |
| **DTOs** | 344 | 0 | 0.0% | 🔴 CRITICAL |
| **E2E Tests** | N/A | 0 | 0.0% | 🔴 CRITICAL |

**Total Test Files**: 30
**Total Test Cases**: ~260
**Overall Coverage**: **~8-12% estimated**

---

## Detailed Gap Analysis

### 1. UNIT TESTS - Services

#### ✅ Services with Comprehensive Tests (4 files)

**Good Examples:**
1. **`/workspaces/white-cross/backend/src/shared/base/__tests__/BaseService.test.ts`**
   - Excellent test coverage (549 lines)
   - Tests pagination, validation, error handling
   - Edge cases covered
   - Good describe/it organization
   - Proper mock setup

2. **`/workspaces/white-cross/backend/src/infrastructure/email/__tests__/email.service.spec.ts`**
   - Comprehensive email service testing
   - Mock dependencies properly
   - 29 test cases
   - Tests rate limiting, templates, queuing

3. **`/workspaces/white-cross/backend/src/communication/__tests__/message.service.integration.spec.ts`**
   - Integration-style tests (518 lines)
   - Tests messaging workflows
   - Multi-recipient scenarios
   - Error handling

4. **`/workspaces/white-cross/backend/src/infrastructure/sms/sms.service.spec.ts`**
   - 54 test cases
   - Comprehensive SMS service testing

#### ⚠️ Services with Stub-Only Tests (16 files)

These tests only verify the service is defined - **NO actual functionality tested**:

```typescript
// Anti-pattern - Found in 16+ files
describe('ServiceName', () => {
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
```

**Files with stub-only tests:**
- `/workspaces/white-cross/backend/src/dashboard/dashboard.service.spec.ts`
- `/workspaces/white-cross/backend/src/health-record/allergy/allergy.service.spec.ts`
- `/workspaces/white-cross/backend/src/health-record/vitals/vitals.service.spec.ts`
- `/workspaces/white-cross/backend/src/health-record/chronic-condition/chronic-condition.service.spec.ts`
- `/workspaces/white-cross/backend/src/health-record/vaccination/vaccination.service.spec.ts`
- `/workspaces/white-cross/backend/src/health-record/statistics/statistics.service.spec.ts`
- `/workspaces/white-cross/backend/src/health-record/search/search.service.spec.ts`
- `/workspaces/white-cross/backend/src/health-record/import-export/import-export.service.spec.ts`
- `/workspaces/white-cross/backend/src/health-record/validation/validation.service.spec.ts`
- `/workspaces/white-cross/backend/src/health-domain/health-domain.service.spec.ts`
- `/workspaces/white-cross/backend/src/dashboard/dashboard.controller.spec.ts`
- `/workspaces/white-cross/backend/src/medication-interaction/medication-interaction.controller.spec.ts`
- `/workspaces/white-cross/backend/src/medication-interaction/medication-interaction.service.spec.ts`
- `/workspaces/white-cross/backend/src/features/features.service.spec.ts`
- `/workspaces/white-cross/backend/src/alerts/alerts.service.spec.ts`
- `/workspaces/white-cross/backend/src/ai-search/ai-search.service.spec.ts`

#### 🔴 Critical Services with NO Tests (161+ services)

**Healthcare-Critical Services Missing Tests:**

1. **Authentication & Authorization** (345 LOC)
   - `/workspaces/white-cross/backend/src/auth/auth.service.ts`
   - **CRITICAL**: No tests for login, registration, password validation
   - No tests for account locking, token generation
   - Security vulnerability - untested auth logic

2. **Student Management** (1,867 LOC)
   - `/workspaces/white-cross/backend/src/student/student.service.ts`
   - Massive service with zero test coverage
   - Core business logic untested

3. **Emergency Contact Service** (23,121 bytes)
   - `/workspaces/white-cross/backend/src/emergency-contact/emergency-contact.service.ts`
   - **CRITICAL**: Emergency notifications untested
   - Primary contact enforcement untested
   - Notification workflows untested

4. **Appointment Service** (58,927 bytes)
   - `/workspaces/white-cross/backend/src/appointment/appointment.service.ts`
   - Massive service, zero tests
   - Scheduling logic untested
   - Waitlist management untested
   - Reminder system untested

5. **Incident Report Services** (6 services, 0 tests)
   - `/workspaces/white-cross/backend/src/incident-report/services/incident-core.service.ts`
   - `/workspaces/white-cross/backend/src/incident-report/services/incident-notification.service.ts`
   - `/workspaces/white-cross/backend/src/incident-report/services/incident-statistics.service.ts`
   - `/workspaces/white-cross/backend/src/incident-report/services/incident-follow-up.service.ts`
   - `/workspaces/white-cross/backend/src/incident-report/services/incident-validation.service.ts`
   - `/workspaces/white-cross/backend/src/incident-report/services/incident-witness.service.ts`
   - **CRITICAL**: Legal/compliance implications

6. **Communication Services** (7 services)
   - Only MessageService has tests
   - Missing tests for:
     - `/workspaces/white-cross/backend/src/communication/services/channel.service.ts`
     - `/workspaces/white-cross/backend/src/communication/services/conversation.service.ts`
     - `/workspaces/white-cross/backend/src/communication/services/template.service.ts`
     - `/workspaces/white-cross/backend/src/communication/services/broadcast.service.ts`
     - `/workspaces/white-cross/backend/src/communication/services/enhanced-message.service.ts`

7. **Budget & Inventory**
   - `/workspaces/white-cross/backend/src/budget/budget.service.ts`
   - `/workspaces/white-cross/backend/src/inventory/inventory.service.ts`
   - Financial calculations untested

8. **Chronic Condition Service**
   - `/workspaces/white-cross/backend/src/chronic-condition/chronic-condition.service.ts`
   - Critical health data management untested

9. **Report Services** (2 services, 0 tests)
   - `/workspaces/white-cross/backend/src/report/services/compliance-reports.service.ts`
   - `/workspaces/white-cross/backend/src/report/services/medication-reports.service.ts`
   - **CRITICAL**: Compliance reports untested

---

### 2. UNIT TESTS - Controllers

#### ❌ Controllers with NO Real Tests

**Only 5 out of 59 controllers have test files**, and most are stub-only:

1. `/workspaces/white-cross/backend/src/app.controller.spec.ts` - Stub only
2. `/workspaces/white-cross/backend/src/dashboard/dashboard.controller.spec.ts` - Stub only
3. `/workspaces/white-cross/backend/src/medication-interaction/medication-interaction.controller.spec.ts` - Stub only
4. `/workspaces/white-cross/backend/src/health-domain/health-domain.controller.spec.ts` - Stub only
5. `/workspaces/white-cross/backend/src/enterprise-features/enterprise-features.controller.spec.ts` - Stub only

**Good Example:**
- `/workspaces/white-cross/backend/src/communication/__tests__/message.controller.integration.spec.ts` (26 test cases)

#### 🔴 Critical Controllers with NO Tests (54+ controllers)

**Missing controller tests for:**
- `/workspaces/white-cross/backend/src/emergency-contact/emergency-contact.controller.ts`
- `/workspaces/white-cross/backend/src/incident-report/incident-report.controller.ts`
- `/workspaces/white-cross/backend/src/appointment/appointment.controller.ts`
- `/workspaces/white-cross/backend/src/budget/budget.controller.ts`
- `/workspaces/white-cross/backend/src/student/student.controller.ts`
- `/workspaces/white-cross/backend/src/contact/contact.controller.ts`
- `/workspaces/white-cross/backend/src/security/security.controller.ts`
- `/workspaces/white-cross/backend/src/inventory/inventory.controller.ts`
- `/workspaces/white-cross/backend/src/advanced-features/advanced-features.controller.ts`
- `/workspaces/white-cross/backend/src/features/features.controller.ts`
- `/workspaces/white-cross/backend/src/ai-search/ai-search.controller.ts`
- `/workspaces/white-cross/backend/src/chronic-condition/chronic-condition.controller.ts`
- All communication controllers except message controller
- All report controllers

---

### 3. INTEGRATION TESTS

#### ✅ Good Integration Tests (4 files)

1. **`/workspaces/white-cross/backend/src/communication/__tests__/message.service.integration.spec.ts`**
   - Tests service with mocked models
   - 23 test cases covering workflows

2. **`/workspaces/white-cross/backend/src/communication/__tests__/message.controller.integration.spec.ts`**
   - Tests controller with mocked service
   - 26 test cases

3. **`/workspaces/white-cross/backend/src/communication/__tests__/websocket.gateway.integration.spec.ts`**
   - Tests WebSocket gateway
   - 29 test cases
   - Real Socket.IO client testing

4. **`/workspaces/white-cross/backend/src/communication/__tests__/encryption-integration.spec.ts`**
   - Tests encryption workflows
   - 20 test cases

#### ❌ Missing Integration Tests

**No integration tests for:**
- Database layer interactions (Sequelize models)
- Auth flow (register → login → protected route)
- Appointment booking flow
- Emergency contact notification flow
- Incident report creation flow
- Health record CRUD operations
- Medication prescription workflow
- File upload/download workflows
- Audit logging integration
- Cache integration (Redis)
- Email/SMS integration (Twilio, NodeMailer)

---

### 4. E2E TESTS

#### 🔴 CRITICAL: NO E2E Tests

**Status**: The `/workspaces/white-cross/backend/test/` directory is **EMPTY**.

**Missing E2E test configuration:**
- No `jest-e2e.json` configuration file
- No E2E test files
- No test database setup
- No supertest integration
- No end-to-end API testing

**Critical E2E Scenarios Missing:**

1. **Authentication Flow**
   ```
   POST /auth/register →
   POST /auth/login →
   GET /protected-route (with JWT)
   ```

2. **Student Health Record Flow**
   ```
   POST /students →
   POST /students/:id/allergies →
   GET /students/:id/health-record →
   POST /students/:id/medications
   ```

3. **Appointment Workflow**
   ```
   GET /appointments/availability →
   POST /appointments →
   PATCH /appointments/:id →
   DELETE /appointments/:id
   ```

4. **Emergency Notification Flow**
   ```
   POST /incidents →
   POST /emergency-contacts/notify →
   Verify SMS/Email sent
   ```

5. **Medication Interaction Check**
   ```
   POST /medication-interaction/check →
   Verify warnings returned
   ```

---

### 5. GUARDS, INTERCEPTORS, PIPES, FILTERS

#### 🔴 ZERO Test Coverage

**19 Guards - 0 Tests:**
- `/workspaces/white-cross/backend/src/auth/guards/jwt-auth.guard.ts` - **CRITICAL**
- `/workspaces/white-cross/backend/src/auth/guards/roles.guard.ts` - **CRITICAL**
- `/workspaces/white-cross/backend/src/middleware/security/rate-limit.guard.ts`
- `/workspaces/white-cross/backend/src/middleware/security/csrf.guard.ts`
- `/workspaces/white-cross/backend/src/middleware/core/guards/permissions.guard.ts`
- `/workspaces/white-cross/backend/src/middleware/core/guards/rbac.guard.ts`
- `/workspaces/white-cross/backend/src/security/guards/security-policy.guard.ts`
- `/workspaces/white-cross/backend/src/security/guards/ip-restriction.guard.ts`
- And 11 more...

**10+ Interceptors - 0 Tests:**
- `/workspaces/white-cross/backend/src/middleware/monitoring/audit.interceptor.ts`
- `/workspaces/white-cross/backend/src/middleware/monitoring/performance.interceptor.ts`
- `/workspaces/white-cross/backend/src/security/interceptors/security-logging.interceptor.ts`
- And 7+ more...

**Pipes - 0 Tests:**
- `/workspaces/white-cross/backend/src/middleware/core/pipes/validation.pipe.ts`

**Filters - 0 Tests:**
- `/workspaces/white-cross/backend/src/common/exceptions/filters/http-exception.filter.ts`
- `/workspaces/white-cross/backend/src/common/exceptions/filters/all-exceptions.filter.ts`
- `/workspaces/white-cross/backend/src/discovery/filters/discovery-exception.filter.ts`

---

### 6. DTO VALIDATION TESTS

#### 🔴 CRITICAL: Zero DTO Validation Tests

**344 DTOs - 0 Validation Tests**

DTOs use `class-validator` decorators but have **no tests** to verify:
- Required field validation
- Email format validation
- Phone number validation
- Date range validation
- Enum value validation
- Custom validation rules
- Transform decorators
- Nested object validation

**Example untested DTOs:**
- Authentication DTOs (RegisterDto, LoginDto)
- Health record DTOs
- Appointment DTOs
- Emergency contact DTOs
- Medication DTOs

---

### 7. GATEWAYS (WebSocket)

#### ❌ No Gateway Tests

**2 Gateways - 0 Unit Tests:**
1. `/workspaces/white-cross/backend/src/communication/gateways/communication.gateway.ts`
2. `/workspaces/white-cross/backend/src/infrastructure/websocket/websocket.gateway.ts`

**Note**: There is one integration test for communication gateway, but no standalone unit tests.

---

### 8. TEST DATABASE CONFIGURATION

#### 🔴 CRITICAL: No Test Database Setup

**Missing test database infrastructure:**

1. **No Test Database Configuration**
   - No in-memory database setup (SQLite)
   - No test-specific Sequelize configuration
   - No database seeding for tests
   - No transaction rollback between tests

2. **No Test Fixtures**
   - No factory pattern implementation
   - No test data generators
   - No reusable fixtures
   - No faker integration for test data

3. **No Database Cleanup**
   - No beforeEach/afterEach cleanup
   - No transaction management
   - Risk of test data pollution

**Recommended setup missing:**
```typescript
// test/utils/test-database.ts - DOES NOT EXIST
export const TestDatabaseModule = TypeOrmModule.forRoot({
  type: 'sqlite',
  database: ':memory:',
  entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
  synchronize: true,
  logging: false,
  dropSchema: true,
});
```

---

### 9. TEST UTILITIES AND HELPERS

#### ❌ Minimal Test Utilities

**Missing test infrastructure:**
- No mock factory classes
- No test helper functions
- No shared test fixtures
- No authentication helper (getAuthToken)
- No database seeding utilities
- No mock data generators
- No test teardown utilities

**Existing utilities:**
- Only found in `/workspaces/white-cross/backend/src/shared/base/__tests__/BaseService.test.ts`
- Limited to BaseService testing

---

### 10. TEST STRUCTURE AND ORGANIZATION

#### ✅ Good Practices Found

1. **Communication Module** - Well-structured tests in `__tests__` directory
2. **Infrastructure/Email** - Good test organization
3. **Base Service** - Comprehensive test with proper structure

#### ⚠️ Issues Found

1. **Inconsistent Test Location**
   - Some tests in `__tests__` directories
   - Most tests co-located with source files
   - No clear convention

2. **No Test Organization**
   - No `/test` directory structure
   - No E2E test separation
   - No test suites grouping

3. **Jest Configuration Issues**
   - Basic configuration in package.json
   - No separate test configurations (unit vs integration vs e2e)
   - No coverage thresholds
   - Missing `jest.config.js` file

---

## HIPAA and Healthcare Compliance Concerns

### 🔴 CRITICAL Security Testing Gaps

1. **Authentication/Authorization** - Zero test coverage
   - Password validation untested
   - JWT token generation untested
   - Account locking untested
   - Role-based access untested

2. **Data Access Controls** - Guards untested
   - JwtAuthGuard - 0 tests
   - RolesGuard - 0 tests
   - RBAC guard - 0 tests
   - Permissions guard - 0 tests

3. **Audit Logging** - Interceptor untested
   - Audit interceptor has 0 tests
   - No verification of audit trail creation

4. **Data Encryption** - Limited testing
   - Only 1 encryption integration test
   - No unit tests for encryption utilities

5. **PHI Data Handling** - Untested
   - No tests for data masking
   - No tests for access logging
   - No tests for data retention

---

## Specific Recommendations

### IMMEDIATE ACTIONS (Priority 1 - Week 1)

#### 1. Create E2E Test Infrastructure

**File**: `/workspaces/white-cross/backend/test/jest-e2e.json`
```json
{
  "moduleFileExtensions": ["js", "json", "ts"],
  "rootDir": ".",
  "testEnvironment": "node",
  "testRegex": ".e2e-spec.ts$",
  "transform": {
    "^.+\\.(t|j)s$": "ts-jest"
  }
}
```

**File**: `/workspaces/white-cross/backend/test/auth.e2e-spec.ts`
```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Authentication (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/auth/register (POST)', () => {
    it('should register a new user successfully', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Password123!',
          firstName: 'Test',
          lastName: 'User',
          role: 'NURSE',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('accessToken');
          expect(res.body).toHaveProperty('user');
          expect(res.body.user.email).toBe('test@example.com');
          expect(res.body.user).not.toHaveProperty('password');
        });
    });

    it('should reject weak password', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'test2@example.com',
          password: '123',
          firstName: 'Test',
          lastName: 'User',
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('password');
        });
    });

    it('should reject duplicate email', async () => {
      // First registration
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'duplicate@example.com',
          password: 'Password123!',
          firstName: 'Test',
          lastName: 'User',
        });

      // Duplicate attempt
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'duplicate@example.com',
          password: 'Password123!',
          firstName: 'Test',
          lastName: 'User',
        })
        .expect(409);
    });
  });

  describe('/auth/login (POST)', () => {
    const testUser = {
      email: 'login-test@example.com',
      password: 'Password123!',
      firstName: 'Login',
      lastName: 'Test',
    };

    beforeAll(async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser);
    });

    it('should login with valid credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('accessToken');
          expect(res.body).toHaveProperty('user');
        });
    });

    it('should reject invalid password', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: 'WrongPassword123!',
        })
        .expect(401);
    });

    it('should reject non-existent user', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'Password123!',
        })
        .expect(401);
    });
  });

  describe('Protected Routes', () => {
    let authToken: string;

    beforeAll(async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'protected@example.com',
          password: 'Password123!',
          firstName: 'Protected',
          lastName: 'Route',
        });

      authToken = response.body.accessToken;
    });

    it('should access protected route with valid token', () => {
      return request(app.getHttpServer())
        .get('/students')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
    });

    it('should reject access without token', () => {
      return request(app.getHttpServer())
        .get('/students')
        .expect(401);
    });

    it('should reject access with invalid token', () => {
      return request(app.getHttpServer())
        .get('/students')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });
  });
});
```

#### 2. Create Test Database Utilities

**File**: `/workspaces/white-cross/backend/test/utils/test-database.ts`
```typescript
import { Sequelize } from 'sequelize-typescript';
import { User } from '../../src/database/models/user.model';
import { Student } from '../../src/database/models/student.model';
import { EmergencyContact } from '../../src/database/models/emergency-contact.model';
// Import all models...

export class TestDatabase {
  private static sequelize: Sequelize;

  static async setup(): Promise<Sequelize> {
    this.sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      models: [User, Student, EmergencyContact /* all models */],
    });

    await this.sequelize.sync({ force: true });
    return this.sequelize;
  }

  static async teardown(): Promise<void> {
    if (this.sequelize) {
      await this.sequelize.close();
    }
  }

  static async cleanup(): Promise<void> {
    if (this.sequelize) {
      await this.sequelize.truncate({ cascade: true });
    }
  }

  static getSequelize(): Sequelize {
    return this.sequelize;
  }
}
```

**File**: `/workspaces/white-cross/backend/test/utils/test-helpers.ts`
```typescript
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

export class AuthHelper {
  static async registerAndLogin(
    app: INestApplication,
    userData: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      role?: string;
    },
  ): Promise<string> {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send(userData);

    return response.body.accessToken;
  }

  static async login(
    app: INestApplication,
    email: string,
    password: string,
  ): Promise<string> {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password });

    return response.body.accessToken;
  }
}

export class TestDataHelper {
  static createMockStudent(overrides = {}) {
    return {
      firstName: 'Test',
      lastName: 'Student',
      dateOfBirth: '2010-01-01',
      grade: 5,
      studentNumber: `STU${Date.now()}`,
      ...overrides,
    };
  }

  static createMockEmergencyContact(overrides = {}) {
    return {
      firstName: 'Emergency',
      lastName: 'Contact',
      relationship: 'PARENT',
      phoneNumber: '+1234567890',
      email: 'emergency@example.com',
      isPrimary: true,
      ...overrides,
    };
  }
}
```

#### 3. Test Critical Auth Service

**File**: `/workspaces/white-cross/backend/src/auth/auth.service.spec.ts`
```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/sequelize';
import { AuthService } from './auth.service';
import { User, UserRole } from '../database/models/user.model';
import { ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let userModel: typeof User;
  let jwtService: JwtService;

  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    password: 'hashedPassword',
    firstName: 'Test',
    lastName: 'User',
    role: UserRole.NURSE,
    failedLoginAttempts: 0,
    lastFailedLogin: null,
    toSafeObject: jest.fn().mockReturnValue({
      id: 'user-123',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      role: UserRole.NURSE,
    }),
    isAccountLocked: jest.fn().mockReturnValue(false),
  };

  const mockUserModel = {
    findOne: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock-jwt-token'),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      const config = {
        JWT_SECRET: 'test-secret',
        JWT_EXPIRATION: '15m',
      };
      return config[key];
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getModelToken(User), useValue: mockUserModel },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userModel = module.get(getModelToken(User));
    jwtService = module.get<JwtService>(JwtService);

    jest.clearAllMocks();
  });

  describe('register', () => {
    const registerDto = {
      email: 'newuser@example.com',
      password: 'ValidPass123!',
      firstName: 'New',
      lastName: 'User',
      role: UserRole.NURSE,
    };

    it('should successfully register a new user', async () => {
      mockUserModel.findOne.mockResolvedValue(null);
      mockUserModel.create.mockResolvedValue(mockUser);

      const result = await service.register(registerDto);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('user');
      expect(result.user.email).toBe('test@example.com');
      expect(mockUserModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: registerDto.email,
          password: registerDto.password,
          firstName: registerDto.firstName,
          lastName: registerDto.lastName,
        }),
      );
    });

    it('should throw ConflictException if email already exists', async () => {
      mockUserModel.findOne.mockResolvedValue(mockUser);

      await expect(service.register(registerDto)).rejects.toThrow(ConflictException);
      expect(mockUserModel.create).not.toHaveBeenCalled();
    });

    it('should reject invalid email format', async () => {
      const invalidDto = { ...registerDto, email: 'invalid-email' };

      await expect(service.register(invalidDto)).rejects.toThrow(BadRequestException);
    });

    it('should reject weak password', async () => {
      const weakPasswordDto = { ...registerDto, password: '123' };

      await expect(service.register(weakPasswordDto)).rejects.toThrow(BadRequestException);
      expect(mockUserModel.create).not.toHaveBeenCalled();
    });

    it('should validate password strength requirements', async () => {
      const testCases = [
        { password: 'short', valid: false },
        { password: 'nouppercase123!', valid: false },
        { password: 'NOLOWERCASE123!', valid: false },
        { password: 'NoNumbers!', valid: false },
        { password: 'NoSpecialChar123', valid: false },
        { password: 'ValidPass123!', valid: true },
      ];

      for (const testCase of testCases) {
        const dto = { ...registerDto, password: testCase.password };
        mockUserModel.findOne.mockResolvedValue(null);

        if (testCase.valid) {
          mockUserModel.create.mockResolvedValue(mockUser);
          await expect(service.register(dto)).resolves.toBeDefined();
        } else {
          await expect(service.register(dto)).rejects.toThrow(BadRequestException);
        }
      }
    });
  });

  describe('login', () => {
    const loginDto = {
      email: 'test@example.com',
      password: 'Password123!',
    };

    beforeEach(() => {
      // Mock bcrypt.compare
      jest.spyOn(require('bcrypt'), 'compare').mockResolvedValue(true);
    });

    it('should successfully login with valid credentials', async () => {
      mockUserModel.findOne.mockResolvedValue(mockUser);

      const result = await service.login(loginDto);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('user');
      expect(jwtService.sign).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException for non-existent user', async () => {
      mockUserModel.findOne.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for incorrect password', async () => {
      mockUserModel.findOne.mockResolvedValue(mockUser);
      jest.spyOn(require('bcrypt'), 'compare').mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for locked account', async () => {
      const lockedUser = { ...mockUser, isAccountLocked: jest.fn().mockReturnValue(true) };
      mockUserModel.findOne.mockResolvedValue(lockedUser);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
      expect(lockedUser.isAccountLocked).toHaveBeenCalled();
    });
  });

  describe('validateEmail', () => {
    it('should validate correct email formats', () => {
      const validEmails = [
        'test@example.com',
        'user.name@example.com',
        'user+tag@example.co.uk',
      ];

      validEmails.forEach((email) => {
        expect(service['validateEmail'](email)).toBe(true);
      });
    });

    it('should reject invalid email formats', () => {
      const invalidEmails = [
        'invalid',
        '@example.com',
        'user@',
        'user name@example.com',
      ];

      invalidEmails.forEach((email) => {
        expect(service['validateEmail'](email)).toBe(false);
      });
    });
  });

  describe('validatePasswordStrength', () => {
    it('should validate strong passwords', () => {
      const strongPasswords = [
        'Password123!',
        'MyStr0ng!Pass',
        'C0mpl3x@Password',
      ];

      strongPasswords.forEach((password) => {
        expect(service['validatePasswordStrength'](password)).toBe(true);
      });
    });

    it('should reject weak passwords', () => {
      const weakPasswords = [
        'short',
        'nouppercase123!',
        'NOLOWERCASE123!',
        'NoNumbers!',
        'NoSpecialChar123',
      ];

      weakPasswords.forEach((password) => {
        expect(service['validatePasswordStrength'](password)).toBe(false);
      });
    });
  });
});
```

#### 4. Test Critical Guards

**File**: `/workspaces/white-cross/backend/src/auth/guards/jwt-auth.guard.spec.ts`
```typescript
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new JwtAuthGuard(reflector);
  });

  describe('canActivate', () => {
    it('should allow access to public routes', () => {
      const mockContext = createMockExecutionContext();
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true);

      const result = guard.canActivate(mockContext);

      expect(result).toBe(true);
    });

    it('should call parent canActivate for protected routes', () => {
      const mockContext = createMockExecutionContext();
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
      const parentCanActivate = jest.spyOn(Object.getPrototypeOf(JwtAuthGuard.prototype), 'canActivate');
      parentCanActivate.mockReturnValue(true);

      guard.canActivate(mockContext);

      expect(parentCanActivate).toHaveBeenCalled();
    });
  });

  describe('handleRequest', () => {
    const mockContext = createMockExecutionContext();

    it('should return user if valid', () => {
      const user = { id: '123', email: 'test@example.com' };

      const result = guard.handleRequest(null, user, null, mockContext);

      expect(result).toEqual(user);
    });

    it('should throw UnauthorizedException if no user', () => {
      expect(() => {
        guard.handleRequest(null, null, null, mockContext);
      }).toThrow(UnauthorizedException);
    });

    it('should throw error if error provided', () => {
      const error = new Error('JWT expired');

      expect(() => {
        guard.handleRequest(error, null, null, mockContext);
      }).toThrow(error);
    });
  });
});

function createMockExecutionContext(): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => ({}),
      getResponse: () => ({}),
      getNext: () => jest.fn(),
    }),
    getHandler: () => jest.fn(),
    getClass: () => jest.fn() as any,
    getArgs: () => [],
    getArgByIndex: () => ({}),
    switchToRpc: () => ({
      getContext: () => ({}),
      getData: () => ({}),
    }),
    switchToWs: () => ({
      getClient: () => ({}),
      getData: () => ({}),
    }),
    getType: () => 'http',
  } as ExecutionContext;
}
```

**File**: `/workspaces/white-cross/backend/src/auth/guards/roles.guard.spec.ts`
```typescript
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { UserRole } from '../../database/models/user.model';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);
  });

  describe('canActivate', () => {
    it('should allow access if no roles required', () => {
      const mockContext = createMockExecutionContext({ id: '123', role: UserRole.NURSE });
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);

      const result = guard.canActivate(mockContext);

      expect(result).toBe(true);
    });

    it('should allow access if user has required role', () => {
      const mockContext = createMockExecutionContext({ id: '123', role: UserRole.ADMIN });
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([UserRole.ADMIN]);

      const result = guard.canActivate(mockContext);

      expect(result).toBe(true);
    });

    it('should allow access if user has one of multiple required roles', () => {
      const mockContext = createMockExecutionContext({ id: '123', role: UserRole.NURSE });
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([
        UserRole.ADMIN,
        UserRole.NURSE,
      ]);

      const result = guard.canActivate(mockContext);

      expect(result).toBe(true);
    });

    it('should throw ForbiddenException if user lacks required role', () => {
      const mockContext = createMockExecutionContext({ id: '123', role: UserRole.NURSE });
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([UserRole.ADMIN]);

      expect(() => {
        guard.canActivate(mockContext);
      }).toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException if user not authenticated', () => {
      const mockContext = createMockExecutionContext(null);
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([UserRole.ADMIN]);

      expect(() => {
        guard.canActivate(mockContext);
      }).toThrow(ForbiddenException);
    });
  });
});

function createMockExecutionContext(user: any): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => ({ user }),
      getResponse: () => ({}),
      getNext: () => jest.fn(),
    }),
    getHandler: () => jest.fn(),
    getClass: () => jest.fn() as any,
    getArgs: () => [],
    getArgByIndex: () => ({}),
    switchToRpc: () => ({
      getContext: () => ({}),
      getData: () => ({}),
    }),
    switchToWs: () => ({
      getClient: () => ({}),
      getData: () => ({}),
    }),
    getType: () => 'http',
  } as ExecutionContext;
}
```

### SHORT-TERM ACTIONS (Priority 2 - Weeks 2-4)

#### 5. Test Emergency Contact Service (CRITICAL)

**File**: `/workspaces/white-cross/backend/src/emergency-contact/emergency-contact.service.spec.ts`
```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { EmergencyContactService } from './emergency-contact.service';
import { EmergencyContact } from '../database/models/emergency-contact.model';
import { Student } from '../database/models/student.model';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('EmergencyContactService', () => {
  let service: EmergencyContactService;
  let emergencyContactModel: typeof EmergencyContact;
  let studentModel: typeof Student;

  const mockContact = {
    id: 'contact-123',
    studentId: 'student-123',
    firstName: 'John',
    lastName: 'Doe',
    relationship: 'PARENT',
    phoneNumber: '+1234567890',
    email: 'john@example.com',
    priority: 1,
    isPrimary: true,
    isActive: true,
  };

  const mockEmergencyContactModel = {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
  };

  const mockStudentModel = {
    findByPk: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmergencyContactService,
        {
          provide: getModelToken(EmergencyContact),
          useValue: mockEmergencyContactModel,
        },
        {
          provide: getModelToken(Student),
          useValue: mockStudentModel,
        },
      ],
    }).compile();

    service = module.get<EmergencyContactService>(EmergencyContactService);
    emergencyContactModel = module.get(getModelToken(EmergencyContact));
    studentModel = module.get(getModelToken(Student));

    jest.clearAllMocks();
  });

  describe('getStudentEmergencyContacts', () => {
    it('should return emergency contacts for a student', async () => {
      const contacts = [mockContact];
      mockEmergencyContactModel.findAll.mockResolvedValue(contacts);

      const result = await service.getStudentEmergencyContacts('student-123');

      expect(result).toEqual(contacts);
      expect(emergencyContactModel.findAll).toHaveBeenCalledWith({
        where: {
          studentId: 'student-123',
          isActive: true,
        },
        order: [
          ['priority', 'ASC'],
          ['firstName', 'ASC'],
        ],
      });
    });

    it('should return empty array if no contacts found', async () => {
      mockEmergencyContactModel.findAll.mockResolvedValue([]);

      const result = await service.getStudentEmergencyContacts('student-123');

      expect(result).toEqual([]);
    });
  });

  describe('createEmergencyContact', () => {
    const createDto = {
      studentId: 'student-123',
      firstName: 'Jane',
      lastName: 'Doe',
      relationship: 'PARENT',
      phoneNumber: '+1234567890',
      email: 'jane@example.com',
      isPrimary: true,
    };

    it('should create emergency contact successfully', async () => {
      mockStudentModel.findByPk.mockResolvedValue({ id: 'student-123' });
      mockEmergencyContactModel.count.mockResolvedValue(0);
      mockEmergencyContactModel.create.mockResolvedValue(mockContact);

      const result = await service.createEmergencyContact(createDto);

      expect(result).toEqual(mockContact);
      expect(emergencyContactModel.create).toHaveBeenCalled();
    });

    it('should throw NotFoundException if student not found', async () => {
      mockStudentModel.findByPk.mockResolvedValue(null);

      await expect(service.createEmergencyContact(createDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should enforce max 2 primary contacts rule', async () => {
      mockStudentModel.findByPk.mockResolvedValue({ id: 'student-123' });
      mockEmergencyContactModel.count.mockResolvedValue(2);

      await expect(service.createEmergencyContact(createDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('notifyEmergencyContacts', () => {
    const notificationDto = {
      studentId: 'student-123',
      message: 'Emergency notification',
      channels: ['SMS', 'EMAIL'],
      severity: 'HIGH',
    };

    it('should send notifications to all emergency contacts', async () => {
      const contacts = [mockContact, { ...mockContact, id: 'contact-456' }];
      mockEmergencyContactModel.findAll.mockResolvedValue(contacts);

      // Mock notification services
      const result = await service.notifyEmergencyContacts(notificationDto);

      expect(result).toHaveProperty('notificationsSent');
      expect(result.notificationsSent).toBeGreaterThan(0);
    });

    it('should prioritize primary contacts', async () => {
      const primaryContact = { ...mockContact, isPrimary: true, priority: 1 };
      const secondaryContact = { ...mockContact, id: 'contact-456', isPrimary: false, priority: 2 };
      mockEmergencyContactModel.findAll.mockResolvedValue([secondaryContact, primaryContact]);

      await service.notifyEmergencyContacts(notificationDto);

      // Verify primary contacts notified first
      expect(emergencyContactModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          order: expect.arrayContaining([['priority', 'ASC']]),
        }),
      );
    });
  });
});
```

#### 6. Test Appointment Service

**File**: `/workspaces/white-cross/backend/src/appointment/appointment.service.spec.ts`
```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken, getConnectionToken } from '@nestjs/sequelize';
import { AppointmentService } from './appointment.service';
import { Appointment, AppointmentStatus, AppointmentType } from '../database/models/appointment.model';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('AppointmentService', () => {
  let service: AppointmentService;
  let appointmentModel: typeof Appointment;

  const mockAppointment = {
    id: 'appt-123',
    studentId: 'student-123',
    providerId: 'provider-123',
    type: AppointmentType.ROUTINE_CHECKUP,
    status: AppointmentStatus.SCHEDULED,
    scheduledAt: new Date('2025-12-01T10:00:00Z'),
    duration: 30,
    notes: 'Regular checkup',
  };

  const mockAppointmentModel = {
    create: jest.fn(),
    findByPk: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
  };

  const mockSequelize = {
    transaction: jest.fn((callback) => callback({})),
    models: {},
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentService,
        {
          provide: getModelToken(Appointment),
          useValue: mockAppointmentModel,
        },
        {
          provide: getConnectionToken(),
          useValue: mockSequelize,
        },
      ],
    }).compile();

    service = module.get<AppointmentService>(AppointmentService);
    appointmentModel = module.get(getModelToken(Appointment));

    jest.clearAllMocks();
  });

  describe('createAppointment', () => {
    const createDto = {
      studentId: 'student-123',
      providerId: 'provider-123',
      type: AppointmentType.ROUTINE_CHECKUP,
      scheduledAt: new Date('2025-12-01T10:00:00Z'),
      duration: 30,
      notes: 'Regular checkup',
    };

    it('should create appointment successfully', async () => {
      mockAppointmentModel.findOne.mockResolvedValue(null); // No conflicts
      mockAppointmentModel.create.mockResolvedValue(mockAppointment);

      const result = await service.createAppointment(createDto);

      expect(result).toEqual(mockAppointment);
      expect(appointmentModel.create).toHaveBeenCalled();
    });

    it('should prevent double-booking', async () => {
      mockAppointmentModel.findOne.mockResolvedValue(mockAppointment);

      await expect(service.createAppointment(createDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should reject appointments in the past', async () => {
      const pastDto = {
        ...createDto,
        scheduledAt: new Date('2020-01-01T10:00:00Z'),
      };

      await expect(service.createAppointment(pastDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('cancelAppointment', () => {
    it('should cancel appointment successfully', async () => {
      const appointment = { ...mockAppointment, update: jest.fn() };
      mockAppointmentModel.findByPk.mockResolvedValue(appointment);

      await service.cancelAppointment('appt-123', 'provider-123');

      expect(appointment.update).toHaveBeenCalledWith({
        status: AppointmentStatus.CANCELLED,
      });
    });

    it('should throw NotFoundException if appointment not found', async () => {
      mockAppointmentModel.findByPk.mockResolvedValue(null);

      await expect(
        service.cancelAppointment('nonexistent', 'provider-123'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should prevent canceling completed appointments', async () => {
      const completed = {
        ...mockAppointment,
        status: AppointmentStatus.COMPLETED,
      };
      mockAppointmentModel.findByPk.mockResolvedValue(completed);

      await expect(
        service.cancelAppointment('appt-123', 'provider-123'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getAvailability', () => {
    it('should return available time slots', async () => {
      const date = new Date('2025-12-01');
      mockAppointmentModel.findAll.mockResolvedValue([]);

      const availability = await service.getAvailability('provider-123', date);

      expect(availability).toBeDefined();
      expect(Array.isArray(availability)).toBe(true);
    });

    it('should exclude already booked slots', async () => {
      const date = new Date('2025-12-01');
      mockAppointmentModel.findAll.mockResolvedValue([mockAppointment]);

      const availability = await service.getAvailability('provider-123', date);

      // Verify booked slot is not in availability
      const bookedSlot = availability.find(
        (slot) => slot.time === mockAppointment.scheduledAt,
      );
      expect(bookedSlot).toBeUndefined();
    });
  });
});
```

#### 7. Test Dashboard Service

**File**: `/workspaces/white-cross/backend/src/dashboard/dashboard.service.spec.ts` (Replace stub)
```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { getConnectionToken } from '@nestjs/sequelize';
import { DashboardService } from './dashboard.service';

describe('DashboardService', () => {
  let service: DashboardService;
  let sequelize: any;

  const mockSequelize = {
    models: {
      Student: {
        count: jest.fn(),
        findAll: jest.fn(),
      },
      Appointment: {
        count: jest.fn(),
        findAll: jest.fn(),
      },
      StudentMedication: {
        count: jest.fn(),
      },
      IncidentReport: {
        count: jest.fn(),
        findAll: jest.fn(),
      },
      Allergy: {
        count: jest.fn(),
      },
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        {
          provide: getConnectionToken(),
          useValue: mockSequelize,
        },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
    sequelize = module.get(getConnectionToken());

    jest.clearAllMocks();
  });

  describe('getDashboardStats', () => {
    it('should return dashboard statistics', async () => {
      mockSequelize.models.Student.count.mockResolvedValue(100);
      mockSequelize.models.Appointment.count.mockResolvedValue(50);
      mockSequelize.models.StudentMedication.count.mockResolvedValue(25);
      mockSequelize.models.IncidentReport.count.mockResolvedValue(5);
      mockSequelize.models.Allergy.count.mockResolvedValue(15);

      const stats = await service.getDashboardStats();

      expect(stats).toHaveProperty('totalStudents');
      expect(stats).toHaveProperty('totalAppointments');
      expect(stats).toHaveProperty('activeMedications');
      expect(stats.totalStudents).toBe(100);
    });

    it('should use cache for repeated requests', async () => {
      mockSequelize.models.Student.count.mockResolvedValue(100);

      await service.getDashboardStats();
      await service.getDashboardStats();

      // Should only call database once due to caching
      expect(mockSequelize.models.Student.count).toHaveBeenCalledTimes(1);
    });
  });

  describe('getRecentActivity', () => {
    it('should return recent activity items', async () => {
      const mockAppointments = [
        { id: '1', type: 'ROUTINE_CHECKUP', scheduledAt: new Date() },
      ];
      const mockIncidents = [
        { id: '1', severity: 'MEDIUM', createdAt: new Date() },
      ];

      mockSequelize.models.Appointment.findAll.mockResolvedValue(mockAppointments);
      mockSequelize.models.IncidentReport.findAll.mockResolvedValue(mockIncidents);

      const activity = await service.getRecentActivity(10);

      expect(Array.isArray(activity)).toBe(true);
      expect(activity.length).toBeGreaterThan(0);
    });

    it('should limit activity items to specified count', async () => {
      const mockAppointments = Array(20).fill({ id: '1', type: 'ROUTINE_CHECKUP' });
      mockSequelize.models.Appointment.findAll.mockResolvedValue(mockAppointments);
      mockSequelize.models.IncidentReport.findAll.mockResolvedValue([]);

      const activity = await service.getRecentActivity(5);

      expect(activity.length).toBeLessThanOrEqual(5);
    });
  });

  describe('getUpcomingAppointments', () => {
    it('should return upcoming appointments', async () => {
      const futureDate = new Date(Date.now() + 86400000);
      const mockAppointments = [
        { id: '1', scheduledAt: futureDate, student: { firstName: 'Test' } },
      ];

      mockSequelize.models.Appointment.findAll.mockResolvedValue(mockAppointments);

      const appointments = await service.getUpcomingAppointments(7);

      expect(Array.isArray(appointments)).toBe(true);
    });

    it('should filter by date range', async () => {
      const days = 7;
      await service.getUpcomingAppointments(days);

      expect(mockSequelize.models.Appointment.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            scheduledAt: expect.any(Object),
          }),
        }),
      );
    });
  });
});
```

### MEDIUM-TERM ACTIONS (Priority 3 - Weeks 5-8)

#### 8. Create Test Factories

**File**: `/workspaces/white-cross/backend/test/factories/student.factory.ts`
```typescript
import { Student } from '../../src/database/models/student.model';
import { faker } from '@faker-js/faker';

export class StudentFactory {
  static create(overrides?: Partial<Student>): Partial<Student> {
    return {
      id: faker.string.uuid(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      dateOfBirth: faker.date.past({ years: 18 }),
      grade: faker.number.int({ min: 1, max: 12 }),
      studentNumber: `STU${faker.number.int({ min: 1000, max: 9999 })}`,
      enrollmentDate: faker.date.past({ years: 5 }),
      isActive: true,
      ...overrides,
    };
  }

  static createMany(count: number, overrides?: Partial<Student>): Partial<Student>[] {
    return Array.from({ length: count }, () => this.create(overrides));
  }
}
```

**File**: `/workspaces/white-cross/backend/test/factories/appointment.factory.ts`
```typescript
import { Appointment, AppointmentType, AppointmentStatus } from '../../src/database/models/appointment.model';
import { faker } from '@faker-js/faker';

export class AppointmentFactory {
  static create(overrides?: Partial<Appointment>): Partial<Appointment> {
    return {
      id: faker.string.uuid(),
      studentId: faker.string.uuid(),
      providerId: faker.string.uuid(),
      type: faker.helpers.enumValue(AppointmentType),
      status: AppointmentStatus.SCHEDULED,
      scheduledAt: faker.date.future(),
      duration: 30,
      notes: faker.lorem.sentence(),
      ...overrides,
    };
  }

  static createMany(count: number, overrides?: Partial<Appointment>): Partial<Appointment>[] {
    return Array.from({ length: count }, () => this.create(overrides));
  }
}
```

#### 9. Create E2E Test Suites for Critical Flows

**File**: `/workspaces/white-cross/backend/test/appointment.e2e-spec.ts`
```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthHelper } from './utils/test-helpers';

describe('Appointments (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let studentId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    // Setup auth
    authToken = await AuthHelper.registerAndLogin(app, {
      email: 'nurse@test.com',
      password: 'Password123!',
      firstName: 'Test',
      lastName: 'Nurse',
      role: 'NURSE',
    });

    // Create test student
    const studentResponse = await request(app.getHttpServer())
      .post('/students')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        firstName: 'Test',
        lastName: 'Student',
        dateOfBirth: '2010-01-01',
        grade: 5,
      });

    studentId = studentResponse.body.id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Appointment Lifecycle', () => {
    let appointmentId: string;

    it('should check availability', () => {
      return request(app.getHttpServer())
        .get('/appointments/availability')
        .set('Authorization', `Bearer ${authToken}`)
        .query({
          date: '2025-12-01',
          providerId: 'provider-123',
        })
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('should create an appointment', () => {
      return request(app.getHttpServer())
        .post('/appointments')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          studentId,
          providerId: 'provider-123',
          type: 'ROUTINE_CHECKUP',
          scheduledAt: '2025-12-01T10:00:00Z',
          duration: 30,
          notes: 'Annual checkup',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          appointmentId = res.body.id;
        });
    });

    it('should get appointment details', () => {
      return request(app.getHttpServer())
        .get(`/appointments/${appointmentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(appointmentId);
        });
    });

    it('should update appointment', () => {
      return request(app.getHttpServer())
        .patch(`/appointments/${appointmentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          notes: 'Updated notes',
        })
        .expect(200);
    });

    it('should cancel appointment', () => {
      return request(app.getHttpServer())
        .delete(`/appointments/${appointmentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
    });

    it('should verify appointment is cancelled', () => {
      return request(app.getHttpServer())
        .get(`/appointments/${appointmentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBe('CANCELLED');
        });
    });
  });

  describe('Appointment Validation', () => {
    it('should prevent double-booking', async () => {
      const appointmentData = {
        studentId,
        providerId: 'provider-123',
        type: 'ROUTINE_CHECKUP',
        scheduledAt: '2025-12-15T14:00:00Z',
        duration: 30,
      };

      // Create first appointment
      await request(app.getHttpServer())
        .post('/appointments')
        .set('Authorization', `Bearer ${authToken}`)
        .send(appointmentData);

      // Try to create overlapping appointment
      return request(app.getHttpServer())
        .post('/appointments')
        .set('Authorization', `Bearer ${authToken}`)
        .send(appointmentData)
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('conflict');
        });
    });

    it('should reject past appointments', () => {
      return request(app.getHttpServer())
        .post('/appointments')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          studentId,
          providerId: 'provider-123',
          type: 'ROUTINE_CHECKUP',
          scheduledAt: '2020-01-01T10:00:00Z',
          duration: 30,
        })
        .expect(400);
    });
  });
});
```

#### 10. Add DTO Validation Tests

**File**: `/workspaces/white-cross/backend/src/auth/dto/register.dto.spec.ts`
```typescript
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { RegisterDto } from './register.dto';

describe('RegisterDto Validation', () => {
  it('should pass validation with valid data', async () => {
    const dto = plainToInstance(RegisterDto, {
      email: 'test@example.com',
      password: 'Password123!',
      firstName: 'Test',
      lastName: 'User',
      role: 'NURSE',
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail with invalid email', async () => {
    const dto = plainToInstance(RegisterDto, {
      email: 'invalid-email',
      password: 'Password123!',
      firstName: 'Test',
      lastName: 'User',
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('email');
  });

  it('should fail with missing required fields', async () => {
    const dto = plainToInstance(RegisterDto, {
      email: 'test@example.com',
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail with weak password', async () => {
    const dto = plainToInstance(RegisterDto, {
      email: 'test@example.com',
      password: '123',
      firstName: 'Test',
      lastName: 'User',
    });

    const errors = await validate(dto);
    const passwordError = errors.find((e) => e.property === 'password');
    expect(passwordError).toBeDefined();
  });
});
```

### LONG-TERM ACTIONS (Priority 4 - Weeks 9-12)

#### 11. Add Jest Configuration

**File**: `/workspaces/white-cross/backend/jest.config.js`
```javascript
module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.(t|j)s',
    '!src/**/*.module.(t|j)s',
    '!src/**/*.interface.(t|j)s',
    '!src/**/*.dto.(t|j)s',
    '!src/**/*.entity.(t|j)s',
    '!src/main.(t|j)s',
    '!src/database/migrations/**',
    '!src/database/seeders/**',
  ],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  roots: ['<rootDir>/src/'],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  coverageThresholds: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
  testTimeout: 10000,
};
```

#### 12. Implement Remaining Critical Tests

**Services to prioritize:**
1. Student Service (1,867 LOC) - Large, critical
2. All Incident Report Services (6 services)
3. All Communication Services (5 remaining)
4. Budget Service
5. Inventory Service
6. All Report Services
7. Chronic Condition Service

**Controllers to prioritize:**
1. Student Controller
2. Incident Report Controller
3. Emergency Contact Controller
4. All Communication Controllers
5. Security Controller

#### 13. Add Performance and Load Tests

**File**: `/workspaces/white-cross/backend/test/performance/dashboard.perf.spec.ts`
```typescript
describe('Dashboard Performance', () => {
  it('should load dashboard stats within 500ms', async () => {
    const start = Date.now();
    await service.getDashboardStats();
    const duration = Date.now() - start;

    expect(duration).toBeLessThan(500);
  });

  it('should handle concurrent requests', async () => {
    const requests = Array(10).fill(null).map(() =>
      service.getDashboardStats()
    );

    await expect(Promise.all(requests)).resolves.toBeDefined();
  });
});
```

---

## Coverage Improvement Strategy

### Phase 1: Foundation (Weeks 1-2)
- ✅ E2E test infrastructure
- ✅ Test database setup
- ✅ Test utilities and helpers
- ✅ Auth service tests
- ✅ Auth guard tests
- ✅ First E2E test suite

**Target**: 20% coverage

### Phase 2: Critical Services (Weeks 3-4)
- ✅ Emergency Contact Service
- ✅ Appointment Service
- ✅ Dashboard Service
- ✅ Student Service (partial)
- ✅ Incident Report Services (core)

**Target**: 35% coverage

### Phase 3: Controllers & Integration (Weeks 5-6)
- ✅ All critical controllers
- ✅ Integration tests for major flows
- ✅ More E2E scenarios
- ✅ DTO validation tests

**Target**: 50% coverage

### Phase 4: Comprehensive Coverage (Weeks 7-12)
- ✅ All remaining services
- ✅ All interceptors, guards, pipes
- ✅ Gateway tests
- ✅ Filter tests
- ✅ Edge cases
- ✅ Performance tests

**Target**: 80% coverage

---

## Testing Best Practices for Healthcare Platform

### 1. HIPAA Compliance Testing

```typescript
describe('HIPAA Compliance', () => {
  it('should not expose PHI in error messages', async () => {
    try {
      await service.getPatientData('invalid-id');
    } catch (error) {
      expect(error.message).not.toContain('patient name');
      expect(error.message).not.toContain('diagnosis');
    }
  });

  it('should log all PHI access', async () => {
    await service.getPatientData('patient-123');

    expect(auditLog.log).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'READ',
        resource: 'PatientData',
        userId: expect.any(String),
      })
    );
  });
});
```

### 2. Test Data Sanitization

```typescript
// Never use real PHI in tests
const mockPatient = {
  id: faker.string.uuid(),
  name: faker.person.fullName(), // Fake data only
  ssn: 'XXX-XX-XXXX', // Masked
  diagnosis: 'TEST_DIAGNOSIS',
};
```

### 3. Security Testing

```typescript
describe('Security', () => {
  it('should prevent SQL injection', async () => {
    const maliciousInput = "'; DROP TABLE students; --";

    await expect(
      service.findByName(maliciousInput)
    ).resolves.not.toThrow();
  });

  it('should sanitize user input', async () => {
    const xssInput = '<script>alert("xss")</script>';

    const result = await service.createNote(xssInput);
    expect(result.content).not.toContain('<script>');
  });
});
```

---

## Continuous Integration Setup

### GitHub Actions Workflow

**File**: `.github/workflows/test.yml`
```yaml
name: Test Suite

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci
        working-directory: ./backend

      - name: Run unit tests
        run: npm test
        working-directory: ./backend

      - name: Run E2E tests
        run: npm run test:e2e
        working-directory: ./backend

      - name: Generate coverage
        run: npm run test:cov
        working-directory: ./backend

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./backend/coverage/lcov.info

      - name: Check coverage thresholds
        run: |
          if [ $(grep -oP 'Lines\s+:\s+\K[0-9.]+' backend/coverage/lcov-report/index.html) \< 80 ]; then
            echo "Coverage below 80%"
            exit 1
          fi
```

---

## Summary of Recommendations

### Immediate (Week 1)
1. ✅ Create E2E test infrastructure
2. ✅ Create test database utilities
3. ✅ Test AuthService (CRITICAL)
4. ✅ Test JwtAuthGuard and RolesGuard (CRITICAL)

### Short-term (Weeks 2-4)
5. ✅ Test EmergencyContactService (CRITICAL)
6. ✅ Test AppointmentService (CRITICAL)
7. ✅ Test DashboardService
8. ✅ Create more E2E tests

### Medium-term (Weeks 5-8)
9. ✅ Test factories and fixtures
10. ✅ All controller tests
11. ✅ Integration tests
12. ✅ DTO validation tests

### Long-term (Weeks 9-12)
13. ✅ Complete service coverage
14. ✅ All guards, interceptors, pipes, filters
15. ✅ Performance tests
16. ✅ Achieve 80% coverage

---

## Risk Assessment

### 🔴 CRITICAL RISKS (Immediate Attention Required)

1. **Authentication System Untested** - Security vulnerability
2. **Emergency Notifications Untested** - Patient safety risk
3. **Incident Reports Untested** - Legal/compliance risk
4. **No E2E Tests** - Integration issues undetected
5. **Data Access Controls Untested** - HIPAA violation risk

### ⚠️ HIGH RISKS

1. **Appointment System Untested** - Scheduling errors
2. **Student Management Untested** - Data integrity issues
3. **Medication Workflows Untested** - Patient safety
4. **Report Generation Untested** - Compliance reporting

### ℹ️ MEDIUM RISKS

1. **Dashboard Metrics Untested** - Incorrect analytics
2. **Communication System Partially Tested** - Message delivery issues
3. **Budget/Inventory Untested** - Financial discrepancies

---

## Conclusion

The White Cross backend has **critically low test coverage** (8-12% overall) that poses significant risks for a healthcare platform. The immediate priority must be:

1. **Security Testing** - Auth, guards, access controls
2. **Critical Healthcare Workflows** - Emergency contacts, appointments, incidents
3. **E2E Testing** - Full application flows
4. **HIPAA Compliance Verification** - Audit logs, data access, encryption

Implementing the recommended testing strategy will take approximately **12 weeks** with dedicated effort but is **essential** for production readiness and regulatory compliance.

**Estimated effort**: 480-600 hours (1-2 full-time developers for 3 months)

**Return on investment**:
- Reduced production bugs
- Faster development cycles
- Regulatory compliance
- Patient safety assurance
- Developer confidence
- Easier refactoring
