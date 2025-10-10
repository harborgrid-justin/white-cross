# Health Records Type System - Quick Reference Guide

A condensed reference for implementing enterprise-grade TypeScript patterns in the Health Records module.

## Table of Contents

- [Type Patterns](#type-patterns)
- [Common Patterns](#common-patterns)
- [API Contracts](#api-contracts)
- [Error Handling](#error-handling)
- [Testing Patterns](#testing-patterns)

---

## Type Patterns

### Branded Types (Type-Safe IDs)

```typescript
// Define branded type
type StudentId = string & { readonly __brand: 'StudentId' };

// Smart constructor with validation
const createStudentId = (id: string): StudentId => {
  if (!id) throw new Error('Invalid ID');
  return id as StudentId;
};

// Usage
const id = createStudentId('STU-123');
```

**When to use**: For entity IDs to prevent mixing different ID types.

### Value Objects

```typescript
class Email {
  private constructor(readonly value: string) {}

  static create(email: string): Email {
    if (!email.includes('@')) {
      throw new Error('Invalid email');
    }
    return new Email(email);
  }
}
```

**When to use**: For domain concepts with validation rules.

### Discriminated Unions

```typescript
type Result<T> =
  | { success: true; data: T }
  | { success: false; error: Error };

// Usage forces exhaustive checking
if (result.success) {
  console.log(result.data); // TypeScript knows data exists
} else {
  console.log(result.error); // TypeScript knows error exists
}
```

**When to use**: For operations that can succeed or fail.

### Readonly Types

```typescript
// Readonly properties
interface Config {
  readonly apiUrl: string;
  readonly timeout: number;
}

// Readonly arrays
type Items = ReadonlyArray<string>;
// or
type Items = readonly string[];

// Deep readonly
type DeepReadonly<T> = {
  readonly [P in keyof T]: DeepReadonly<T[P]>;
};
```

**When to use**: Always for DTOs and domain models to prevent mutations.

---

## Common Patterns

### DTO to Domain Mapping

```typescript
// DTO (API boundary)
interface CreateUserDto {
  readonly email: string;
  readonly name: string;
}

// Domain model
interface UserDomain {
  readonly id: UserId;
  readonly email: Email;
  readonly name: string;
  readonly createdAt: Date;
}

// Mapper
class UserMapper {
  static toDomain(dto: CreateUserDto, id: UserId): UserDomain {
    return {
      id,
      email: Email.create(dto.email),
      name: dto.name,
      createdAt: new Date(),
    };
  }

  static toDto(domain: UserDomain): UserResponseDto {
    return {
      id: domain.id,
      email: domain.email.value,
      name: domain.name,
      createdAt: domain.createdAt.toISOString(),
    };
  }
}
```

### Repository Pattern

```typescript
// Interface
interface IUserRepository {
  findById(id: UserId): Promise<UserDomain | null>;
  save(user: UserDomain): Promise<void>;
}

// Implementation
class PrismaUserRepository implements IUserRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: UserId): Promise<UserDomain | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: id as string }
    });
    return user ? this.toDomain(user) : null;
  }

  async save(user: UserDomain): Promise<void> {
    await this.prisma.user.create({
      data: this.toPrisma(user)
    });
  }

  private toDomain(prisma: any): UserDomain { /* ... */ }
  private toPrisma(domain: UserDomain): any { /* ... */ }
}
```

### Service Layer

```typescript
// Service interface
interface IUserService {
  getUser(id: UserId): Promise<ServiceResult<UserDomain>>;
  createUser(dto: CreateUserDto): Promise<ServiceResult<UserDomain>>;
}

// Implementation with DI
class UserService implements IUserService {
  constructor(
    private readonly repository: IUserRepository,
    private readonly auditService: IAuditService
  ) {}

  async getUser(id: UserId): Promise<ServiceResult<UserDomain>> {
    try {
      const user = await this.repository.findById(id);
      if (!user) {
        return {
          success: false,
          error: { code: 'NOT_FOUND', message: 'User not found' }
        };
      }
      await this.auditService.log('READ_USER', { userId: id });
      return { success: true, data: user };
    } catch (error) {
      return {
        success: false,
        error: { code: 'ERROR', message: error.message }
      };
    }
  }

  // ... other methods
}
```

### Type Guards

```typescript
// Runtime type checking
function isHealthRecordType(value: unknown): value is HealthRecordType {
  return (
    typeof value === 'string' &&
    Object.values(HealthRecordType).includes(value as HealthRecordType)
  );
}

// Usage
if (isHealthRecordType(input)) {
  // TypeScript knows input is HealthRecordType here
  console.log(input);
}
```

---

## API Contracts

### Request DTO

```typescript
interface CreateHealthRecordRequest {
  readonly studentId: string;
  readonly type: HealthRecordType;
  readonly date: string; // ISO 8601
  readonly description: string;
  readonly vital?: VitalSignsDto;
}
```

### Response DTO

```typescript
interface HealthRecordResponse {
  readonly id: string;
  readonly studentId: string;
  readonly type: HealthRecordType;
  readonly date: string;
  readonly description: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}
```

### API Response Wrapper

```typescript
interface ApiResponse<T> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: ApiError;
  readonly metadata: {
    readonly timestamp: string;
    readonly requestId: string;
  };
}

interface ApiError {
  readonly code: string;
  readonly message: string;
  readonly details?: Record<string, unknown>;
}
```

### Paginated Response

```typescript
interface PaginatedResponse<T> extends ApiResponse<T> {
  readonly pagination: {
    readonly page: number;
    readonly limit: number;
    readonly total: number;
    readonly totalPages: number;
  };
}
```

---

## Error Handling

### Custom Error Hierarchy

```typescript
class DomainError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

class ValidationError extends DomainError {
  constructor(message: string, errors: ValidationDetail[]) {
    super(message, 'VALIDATION_ERROR', 400, { errors });
  }
}

class NotFoundError extends DomainError {
  constructor(resource: string, id: string) {
    super(
      `${resource} not found`,
      'NOT_FOUND',
      404,
      { resource, id }
    );
  }
}
```

### Error Handling in Services

```typescript
async function handleOperation(): Promise<ServiceResult<Data>> {
  try {
    const data = await performOperation();
    return { success: true, data };
  } catch (error) {
    if (error instanceof ValidationError) {
      return {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          details: error.details
        }
      };
    }
    // Handle other error types
    return {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred'
      }
    };
  }
}
```

### Error Handling in Controllers

```typescript
async function healthRecordHandler(req: Request, res: Response) {
  const result = await service.getHealthRecord(id);

  if (!result.success) {
    const statusCode = getStatusCode(result.error.code);
    return res.status(statusCode).json({
      success: false,
      error: result.error
    });
  }

  return res.json({
    success: true,
    data: result.data
  });
}

function getStatusCode(errorCode: string): number {
  const codes: Record<string, number> = {
    'VALIDATION_ERROR': 400,
    'NOT_FOUND': 404,
    'UNAUTHORIZED': 403,
    'INTERNAL_ERROR': 500,
  };
  return codes[errorCode] || 500;
}
```

---

## Testing Patterns

### Unit Testing with Type Safety

```typescript
import { describe, it, expect } from 'vitest';

describe('HealthRecordService', () => {
  it('should create health record with valid data', async () => {
    // Arrange
    const mockRepository: IHealthRecordRepository = {
      create: async (data) => ({
        ...data,
        id: createHealthRecordId('HR-123'),
        metadata: {
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: 'test-user'
        }
      }),
      // ... other methods
    };

    const service = new HealthRecordService(mockRepository);

    const dto: CreateHealthRecordRequest = {
      studentId: 'STU-123',
      type: HealthRecordType.CHECKUP,
      date: new Date().toISOString(),
      description: 'Annual checkup',
    };

    // Act
    const result = await service.createHealthRecord(dto);

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.type).toBe(HealthRecordType.CHECKUP);
    }
  });

  it('should return error for invalid data', async () => {
    const service = new HealthRecordService(mockRepository);

    const dto: CreateHealthRecordRequest = {
      studentId: '',
      type: HealthRecordType.CHECKUP,
      date: new Date().toISOString(),
      description: '',
    };

    const result = await service.createHealthRecord(dto);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe('VALIDATION_ERROR');
    }
  });
});
```

### Integration Testing

```typescript
import { PrismaClient } from '@prisma/client';
import { beforeEach, afterEach } from 'vitest';

describe('HealthRecordRepository Integration', () => {
  let prisma: PrismaClient;
  let repository: PrismaHealthRecordRepository;

  beforeEach(async () => {
    prisma = new PrismaClient();
    repository = new PrismaHealthRecordRepository(prisma);
    // Clean database
    await prisma.healthRecord.deleteMany();
  });

  afterEach(async () => {
    await prisma.$disconnect();
  });

  it('should persist and retrieve health record', async () => {
    const studentId = createStudentId('STU-123');

    const created = await repository.create({
      studentId,
      type: HealthRecordType.CHECKUP,
      date: new Date(),
      description: 'Test record',
      attachments: [],
      hipaaFlags: {
        isSensitive: false,
        requiresConsent: false,
        retentionPeriodYears: 7
      }
    });

    const retrieved = await repository.findById(created.id);

    expect(retrieved).not.toBeNull();
    expect(retrieved?.studentId).toBe(studentId);
  });
});
```

### Type-Only Tests

```typescript
// tests/types/contracts.test-d.ts
import { expectType, expectError } from 'tsd';

// Verify API contract types
expectType<HealthRecordResponse>({
  id: 'HR-123',
  studentId: 'STU-123',
  type: HealthRecordType.CHECKUP,
  date: '2025-01-01T00:00:00Z',
  description: 'Test',
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-01T00:00:00Z',
});

// Verify branded types prevent mixing
const studentId = createStudentId('STU-123');
const recordId = createHealthRecordId('HR-456');

expectError(
  // Should not allow swapping ID types
  getHealthRecord(recordId, studentId)
);
```

---

## Utility Types Reference

```typescript
// Make all properties optional
type Partial<T> = { [P in keyof T]?: T[P] };

// Make all properties required
type Required<T> = { [P in keyof T]-?: T[P] };

// Pick specific properties
type Pick<T, K extends keyof T> = { [P in K]: T[P] };

// Omit specific properties
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

// Record type (key-value map)
type Record<K extends string | number | symbol, T> = { [P in K]: T };

// Make all properties readonly
type Readonly<T> = { readonly [P in keyof T]: T[P] };

// Extract from union
type Extract<T, U> = T extends U ? T : never;

// Exclude from union
type Exclude<T, U> = T extends U ? never : T;

// Non-nullable type
type NonNullable<T> = T extends null | undefined ? never : T;

// Return type of function
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

// Parameters of function
type Parameters<T> = T extends (...args: infer P) => any ? P : never;

// Awaited type
type Awaited<T> = T extends Promise<infer U> ? U : T;
```

---

## File Organization Checklist

### Backend

```
src/modules/health-records/
├── contracts/
│   ├── types/index.ts              ✓ Define all types
│   ├── services/IHealthRecordService.ts   ✓ Service interfaces
│   └── repositories/IHealthRecordRepository.ts  ✓ Repository interfaces
├── domain/
│   ├── models/                     ✓ Domain models with business logic
│   ├── services/                   ✓ Domain services
│   └── validators/                 ✓ Business rule validation
├── application/
│   ├── services/                   ✓ Service implementations
│   ├── use-cases/                  ✓ Use case handlers
│   └── mappers/                    ✓ DTO ↔ Domain mappers
├── infrastructure/
│   ├── repositories/               ✓ Prisma implementations
│   └── mappers/                    ✓ Prisma ↔ Domain mappers
└── presentation/
    ├── routes/                     ✓ Route definitions
    ├── controllers/                ✓ HTTP controllers
    └── validators/                 ✓ Request validation
```

### Frontend

```
src/modules/health-records/
├── types/
│   └── index.ts                    ✓ Import shared types
├── services/
│   └── api.ts                      ✓ Type-safe API client
├── hooks/
│   └── queries.ts                  ✓ React Query hooks
├── components/                     ✓ UI components
└── utils/
    └── mappers.ts                  ✓ DTO ↔ UI mappers
```

---

## Configuration Checklist

### TypeScript Configuration

```json
{
  "compilerOptions": {
    "strict": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictPropertyInitialization": true,
    "noImplicitAny": true,
    "noImplicitThis": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true,
    "skipLibCheck": false,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  }
}
```

### ESLint Rules

```json
{
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/strict-boolean-expressions": "warn",
    "@typescript-eslint/prefer-readonly": "warn",
    "@typescript-eslint/no-floating-promises": "error"
  }
}
```

---

## Code Review Checklist

- [ ] All DTOs are readonly
- [ ] No `any` types (unless explicitly justified)
- [ ] Branded types used for entity IDs
- [ ] Discriminated unions for success/error results
- [ ] Type guards for runtime validation
- [ ] Mappers separate DTOs from domain models
- [ ] Repository pattern abstracts data access
- [ ] Service layer handles business logic
- [ ] Error hierarchy with custom exceptions
- [ ] Audit logging for HIPAA compliance
- [ ] Comprehensive type tests
- [ ] API contracts documented

---

## Quick Commands

```bash
# Type checking
npm run type-check

# Generate Prisma types
npx prisma generate

# Run type tests
npm run test:types

# Lint TypeScript
npm run lint

# Build with type checking
npm run build
```

---

## Additional Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Advanced TypeScript Patterns](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)

---

**Last Updated:** 2025-10-10
