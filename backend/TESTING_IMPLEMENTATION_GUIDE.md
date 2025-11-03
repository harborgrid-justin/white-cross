# Testing Implementation Guide

This guide provides instructions for implementing comprehensive tests in the White Cross backend.

## Quick Start

### Running Tests

```bash
# Run all unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov

# Run E2E tests
npm run test:e2e

# Run E2E tests with coverage
npm run test:e2e:cov

# Run tests in debug mode
npm run test:debug
```

### Test Coverage

```bash
# Generate coverage report
npm run test:cov

# View coverage report
open coverage/index.html  # macOS
xdg-open coverage/index.html  # Linux
start coverage/index.html  # Windows
```

## Test Structure

### Unit Tests

Unit tests should be placed next to the file they test:

```
src/
  dashboard/
    dashboard.service.ts
    dashboard.service.spec.ts          # ✅ Unit test
    dashboard.controller.ts
    dashboard.controller.spec.ts       # ✅ Unit test
```

### Integration Tests

Integration tests can be in `__tests__` subdirectories:

```
src/
  communication/
    __tests__/
      message.service.integration.spec.ts  # ✅ Integration test
      websocket.gateway.integration.spec.ts
```

### E2E Tests

E2E tests are in the `test/` directory:

```
test/
  dashboard.e2e-spec.ts                # ✅ E2E test
  auth.e2e-spec.ts
  student.e2e-spec.ts
```

## Writing Tests

### Service Unit Test Template

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { YourService } from './your.service';
import { getModelToken } from '@nestjs/sequelize';
import { YourModel } from '../database/models/your.model';

describe('YourService', () => {
  let service: YourService;
  let model: typeof YourModel;

  const mockModel = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        YourService,
        {
          provide: getModelToken(YourModel),
          useValue: mockModel,
        },
      ],
    }).compile();

    service = module.get<YourService>(YourService);
    model = module.get(getModelToken(YourModel));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('yourMethod', () => {
    it('should return expected result', async () => {
      mockModel.findAll.mockResolvedValue([/* mock data */]);

      const result = await service.yourMethod();

      expect(result).toBeDefined();
      expect(mockModel.findAll).toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      mockModel.findAll.mockRejectedValue(new Error('Database error'));

      await expect(service.yourMethod()).rejects.toThrow('Database error');
    });
  });
});
```

### Controller Unit Test Template

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { YourController } from './your.controller';
import { YourService } from './your.service';

describe('YourController', () => {
  let controller: YourController;
  let service: YourService;

  const mockService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [YourController],
      providers: [
        {
          provide: YourService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<YourController>(YourController);
    service = module.get<YourService>(YourService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return an array', async () => {
      const result = [{ id: '1', name: 'Test' }];
      mockService.findAll.mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
      expect(service.findAll).toHaveBeenCalled();
    });
  });
});
```

### E2E Test Template

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { YourModule } from '../src/your/your.module';

describe('Your API (E2E)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [YourModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/your-endpoint (GET)', () => {
    return request(app.getHttpServer())
      .get('/your-endpoint')
      .expect(200)
      .expect((res) => {
        expect(res.body).toBeDefined();
      });
  });
});
```

## Using Test Factories

### User Factory Example

```typescript
import { UserFactory } from '../test/factories';

describe('SomeService', () => {
  it('should work with user', async () => {
    const user = UserFactory.createNurse({
      email: 'nurse@test.com',
    });

    // Use the user in your test
    expect(user.role).toBe(UserRole.NURSE);
  });

  it('should work with multiple users', async () => {
    const users = UserFactory.createMany(5, {
      role: UserRole.NURSE,
    });

    expect(users).toHaveLength(5);
  });
});
```

### Available Factories

```typescript
import {
  UserFactory,
  StudentFactory,
  resetAllFactories,
} from '../test/factories';

beforeEach(() => {
  resetAllFactories(); // Reset ID counters
});
```

## Using Test Helpers

### Database Helper

```typescript
import { DatabaseTestHelper } from '../test/helpers';

describe('Integration Test', () => {
  let sequelize;

  beforeAll(async () => {
    sequelize = await DatabaseTestHelper.createTestDatabase();
  });

  afterAll(async () => {
    await DatabaseTestHelper.closeDatabase(sequelize);
  });

  beforeEach(async () => {
    await DatabaseTestHelper.clearAllTables(sequelize);
  });

  it('should work with database', async () => {
    await DatabaseTestHelper.seedData(sequelize, {
      User: [{ email: 'test@test.com' }],
    });

    // Your test logic
  });
});
```

### Mock Helper

```typescript
import { MockHelper } from '../test/helpers';

describe('Test with Mocks', () => {
  it('should use mock config service', () => {
    const mockConfig = MockHelper.createMockConfigService({
      JWT_SECRET: 'test-secret',
    });

    expect(mockConfig.get('JWT_SECRET')).toBe('test-secret');
  });

  it('should use mock JWT service', () => {
    const mockJwt = MockHelper.createMockJwtService();

    const token = mockJwt.sign({ sub: 'user-id' });
    expect(token).toBe('mock-jwt-token');
  });
});
```

## Test Coverage Goals

### Minimum Coverage Thresholds

```
Branches:   60% (Target: 80%)
Functions:  60% (Target: 80%)
Lines:      60% (Target: 80%)
Statements: 60% (Target: 80%)
```

### Critical Modules (Require >90%)

- Authentication (auth/)
- Student Management (student/)
- Medication (medication/)
- Health Records (health-records/)
- Incident Reports (incident-report/)

## Best Practices

### 1. Test Organization

```typescript
describe('ServiceName', () => {
  describe('methodName', () => {
    it('should do something under normal conditions', () => {
      // Arrange
      // Act
      // Assert
    });

    it('should handle error case', () => {
      // Test error scenarios
    });

    it('should handle edge case', () => {
      // Test boundary conditions
    });
  });
});
```

### 2. Test Naming

✅ **Good:**
```typescript
it('should return user when valid credentials provided', () => {});
it('should throw UnauthorizedException when password is incorrect', () => {});
```

❌ **Bad:**
```typescript
it('test login', () => {});
it('should work', () => {});
```

### 3. Mocking

✅ **Good:**
```typescript
const mockUserModel = {
  findOne: jest.fn(),
  create: jest.fn(),
};

mockUserModel.findOne.mockResolvedValue(mockUser);
```

❌ **Bad:**
```typescript
// Direct dependency on real database
const user = await User.findOne({ where: { email } });
```

### 4. Assertions

✅ **Good:**
```typescript
expect(result).toHaveProperty('accessToken');
expect(result.accessToken).toBeDefined();
expect(typeof result.accessToken).toBe('string');
```

❌ **Bad:**
```typescript
expect(result).toBeTruthy();
```

### 5. Error Testing

✅ **Good:**
```typescript
await expect(service.login(invalidDto)).rejects.toThrow(UnauthorizedException);
await expect(service.login(invalidDto)).rejects.toThrow('Invalid credentials');
```

❌ **Bad:**
```typescript
try {
  await service.login(invalidDto);
} catch (e) {
  // Error expected
}
```

## Common Patterns

### Testing Async Operations

```typescript
it('should handle async operation', async () => {
  mockService.asyncMethod.mockResolvedValue(expectedResult);

  const result = await controller.method();

  expect(result).toEqual(expectedResult);
});
```

### Testing Database Queries

```typescript
it('should query database with correct parameters', async () => {
  await service.findByEmail('test@example.com');

  expect(mockModel.findOne).toHaveBeenCalledWith({
    where: { email: 'test@example.com' },
  });
});
```

### Testing Error Cases

```typescript
it('should handle database errors', async () => {
  mockModel.findOne.mockRejectedValue(new Error('Database error'));

  await expect(service.findByEmail('test@example.com')).rejects.toThrow(
    InternalServerErrorException,
  );
});
```

### Testing Authentication

```typescript
it('should require authentication', () => {
  return request(app.getHttpServer())
    .get('/protected-route')
    .expect(401);
});

it('should accept valid token', () => {
  return request(app.getHttpServer())
    .get('/protected-route')
    .set('Authorization', 'Bearer valid-token')
    .expect(200);
});
```

## Troubleshooting

### Tests Hanging

```bash
# Use --detectOpenHandles to find the issue
npm run test -- --detectOpenHandles
```

### Memory Leaks

```bash
# Run with --logHeapUsage
npm run test -- --logHeapUsage
```

### Flaky Tests

```bash
# Run tests multiple times to identify flaky tests
npm run test -- --runInBand
```

### Coverage Not Updating

```bash
# Clear Jest cache
npm run test -- --clearCache

# Delete coverage directory
rm -rf coverage
npm run test:cov
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests

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

      - name: Run unit tests
        run: npm run test:cov

      - name: Run E2E tests
        run: npm run test:e2e:cov

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
```

## References

- [NestJS Testing Documentation](https://docs.nestjs.com/fundamentals/testing)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
