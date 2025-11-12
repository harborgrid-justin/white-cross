# Testing Quick Start Guide
**White Cross Backend - Get Started with Testing**

This guide helps you quickly add tests to the White Cross backend.

---

## Quick Reference

### Run Tests
```bash
# Run all unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov

# Run E2E tests
npm run test:e2e

# Run specific test file
npm test -- user.service.spec.ts

# Run tests matching pattern
npm test -- --testNamePattern="should create user"
```

### Test File Locations
```
src/
  module-name/
    __tests__/                    # Preferred location
      module.service.spec.ts      # Unit tests
      module.controller.spec.ts   # Controller tests
      module.integration.spec.ts  # Integration tests
    module.service.ts
    module.controller.ts

test/
  e2e/                    # E2E tests
  factories/              # Test data factories
  helpers/                # Test utilities
  templates/              # Test templates
```

---

## 1. Create Your First Service Test

### Step 1: Copy Template
```bash
cp test/templates/service.spec.template.ts src/user/__tests__/user.service.spec.ts
```

### Step 2: Replace Placeholders
Search and replace:
- `[ServiceName]` → `UserService`
- `[service-name]` → `user`
- `[ModelName]` → `User`
- `[model-name]` → `user`

### Step 3: Add Mock Data
```typescript
const mockUser = {
  id: 'user-id-123',
  email: 'test@whitecross.edu',
  firstName: 'Test',
  lastName: 'User',
  role: UserRole.NURSE,
  createdAt: new Date(),
  updatedAt: new Date(),
};
```

### Step 4: Write Your First Test
```typescript
describe('create', () => {
  it('should create user with valid data', async () => {
    // Arrange
    const createDto = {
      email: 'new@whitecross.edu',
      password: 'Password123!',
      firstName: 'New',
      lastName: 'User',
      role: UserRole.NURSE,
    };
    mockUserModel.findOne.mockResolvedValue(null);
    mockUserModel.create.mockResolvedValue(mockUser);

    // Act
    const result = await service.create(createDto);

    // Assert
    expect(result).toBeDefined();
    expect(result.email).toBe(createDto.email);
    expect(mockUserModel.create).toHaveBeenCalled();
  });
});
```

### Step 5: Run Test
```bash
npm test -- user.service.spec.ts
```

---

## 2. Create Your First Controller Test

### Step 1: Copy Template
```bash
cp test/templates/controller.spec.template.ts src/user/__tests__/user.controller.spec.ts
```

### Step 2: Follow Same Process
Replace placeholders and write tests for endpoints.

### Example Controller Test:
```typescript
describe('POST /users (create)', () => {
  it('should create user and return 201', async () => {
    // Arrange
    const createDto = { /* ... */ };
    mockUserService.create.mockResolvedValue(mockUser);

    // Act
    const result = await controller.create(createDto, mockCurrentUser);

    // Assert
    expect(result).toEqual(mockUser);
    expect(service.create).toHaveBeenCalledWith(createDto, mockCurrentUser);
  });
});
```

---

## 3. Create Your First E2E Test

### Step 1: Copy Template
```bash
cp test/templates/e2e.spec.template.ts test/e2e/user.e2e-spec.ts
```

### Step 2: Setup Authentication
```typescript
beforeAll(async () => {
  // ... app setup ...

  const { token } = await AuthTestHelper.registerAndLogin(app, {
    email: 'test@whitecross.edu',
    password: 'TestPassword123!',
    firstName: 'Test',
    lastName: 'User',
    role: 'NURSE',
  });
  authToken = token;
});
```

### Step 3: Test Endpoints
```typescript
describe('POST /users', () => {
  it('should create user and return 201', () => {
    return request(app.getHttpServer())
      .post('/users')
      .set('Authorization', `Bearer ${authToken}`)
      .send(createUserDto)
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('id');
        expect(res.body.email).toBe(createUserDto.email);
      });
  });
});
```

### Step 4: Run E2E Test
```bash
npm run test:e2e -- user.e2e-spec.ts
```

---

## 4. Use Test Helpers

### Auth Helper
```typescript
import { AuthTestHelper } from '../../test/helpers/auth-test.helper';

// Generate tokens
const nurseToken = AuthTestHelper.generateNurseToken();
const adminToken = AuthTestHelper.generateAdminToken();

// Authenticated requests
await AuthTestHelper.authenticatedGet(app, '/users', authToken)
  .expect(200);
```

### Database Helper
```typescript
import { DatabaseTestHelper } from '../../test/helpers/database.helper';

// Clear all tables
await DatabaseTestHelper.clearAllTables(sequelize);

// Seed test data
await DatabaseTestHelper.seedData(sequelize, {
  User: [mockUser1, mockUser2],
  Student: [mockStudent1],
});
```

### Mock Helper
```typescript
import { MockHelper } from '../../test/helpers/mock.helper';

// Create mock model
const mockModel = MockHelper.createMockModel();

// Create mock services
const mockConfig = MockHelper.createMockConfigService();
const mockJwt = MockHelper.createMockJwtService();
const mockLogger = MockHelper.createMockLogger();
```

---

## 5. Use Test Factories

### Using Existing Factories
```typescript
import { UserFactory, StudentFactory } from '../../test/factories';

// Create single entity
const user = UserFactory.create();
const customUser = UserFactory.create({ email: 'custom@test.com' });

// Create multiple entities
const users = UserFactory.createMany(10);
const students = StudentFactory.createMany(5, { schoolId: 'school-123' });
```

### Creating New Factory
```typescript
// test/factories/medication.factory.ts
import { faker } from '@faker-js/faker';
import { Medication } from '../../src/database/models/medication.model';

export class MedicationFactory {
  private static sequence = 0;

  static create(overrides?: Partial<Medication>): Medication {
    const medication = {
      id: faker.string.uuid(),
      name: faker.medicine.name(),
      dosage: `${faker.number.int({ min: 5, max: 500 })}mg`,
      frequency: 'Daily',
      studentId: faker.string.uuid(),
      prescribedBy: faker.person.fullName(),
      startDate: faker.date.past(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides,
    };

    this.sequence++;
    return medication as Medication;
  }

  static createMany(count: number, overrides?: Partial<Medication>): Medication[] {
    return Array.from({ length: count }, () => this.create(overrides));
  }

  static reset() {
    this.sequence = 0;
  }
}
```

---

## 6. Common Testing Patterns

### AAA Pattern (Arrange-Act-Assert)
```typescript
it('should do something', async () => {
  // Arrange - Setup test data and mocks
  const input = { /* test data */ };
  mockService.method.mockResolvedValue(expectedOutput);

  // Act - Execute the method under test
  const result = await service.methodUnderTest(input);

  // Assert - Verify the results
  expect(result).toEqual(expectedOutput);
  expect(mockService.method).toHaveBeenCalledWith(input);
});
```

### Testing Async Operations
```typescript
it('should handle async operation', async () => {
  // Use async/await
  const result = await service.asyncMethod();
  expect(result).toBeDefined();

  // Or use resolves/rejects
  await expect(service.asyncMethod()).resolves.toBe(expected);
  await expect(service.failingMethod()).rejects.toThrow(Error);
});
```

### Testing Errors
```typescript
it('should throw NotFoundException when not found', async () => {
  // Arrange
  mockModel.findByPk.mockResolvedValue(null);

  // Act & Assert
  await expect(service.findById('non-existent')).rejects.toThrow(
    NotFoundException
  );

  // Or test error message
  await expect(service.findById('non-existent')).rejects.toThrow(
    'User not found'
  );
});
```

### Testing With Spies
```typescript
it('should call dependency method', async () => {
  // Create spy
  const spy = jest.spyOn(dependencyService, 'method');

  // Execute
  await service.methodThatUsesDependency();

  // Verify
  expect(spy).toHaveBeenCalledTimes(1);
  expect(spy).toHaveBeenCalledWith(expectedArgs);

  // Restore
  spy.mockRestore();
});
```

### Testing Guards
```typescript
it('should allow access with valid role', () => {
  // Arrange
  const context = AuthTestHelper.createMockExecutionContext(
    { id: 'user-123', role: UserRole.ADMIN }
  );

  // Act
  const canActivate = guard.canActivate(context);

  // Assert
  expect(canActivate).toBe(true);
});
```

---

## 7. Best Practices Checklist

### Before Writing Tests:
- [ ] Read the service/controller code to understand what it does
- [ ] Identify critical paths and edge cases
- [ ] Check if test factories exist for required models
- [ ] Review similar existing tests for patterns

### When Writing Tests:
- [ ] Use descriptive test names ("should do X when Y")
- [ ] Follow AAA pattern (Arrange, Act, Assert)
- [ ] Test one thing per test
- [ ] Mock external dependencies
- [ ] Test both success and error scenarios
- [ ] Test edge cases (null, undefined, empty strings, etc.)
- [ ] Use constants instead of magic numbers
- [ ] Add comments for complex test scenarios

### After Writing Tests:
- [ ] Run tests and verify they pass
- [ ] Check test coverage: `npm run test:cov`
- [ ] Verify test isolation (tests pass in any order)
- [ ] Remove .only and .skip from tests
- [ ] Review and refactor for clarity
- [ ] Ensure no flaky tests (run multiple times)

---

## 8. Common Mistakes to Avoid

### ❌ Don't Do This:
```typescript
// Hard-coded values without context
it('should work', async () => {
  const result = await service.method(123);
  expect(result).toBe(456);
});

// Testing implementation details
expect(service.privateMethod).toHaveBeenCalled();

// Dependent tests
it('test 1', () => { globalVar = 'value'; });
it('test 2', () => { expect(globalVar).toBe('value'); }); // Fails if test 1 skipped

// No error testing
it('should handle errors', async () => {
  await service.methodThatMightFail(); // No assertions!
});
```

### ✅ Do This Instead:
```typescript
// Descriptive and clear
it('should return user when ID is valid', async () => {
  const userId = 'user-123';
  mockUserModel.findByPk.mockResolvedValue(mockUser);

  const result = await service.findById(userId);

  expect(result).toEqual(mockUser);
});

// Test public interface
expect(await service.publicMethod()).toBe(expected);

// Independent tests
it('should handle valid input', async () => {
  const input = 'test-value';
  const result = await service.method(input);
  expect(result).toBeDefined();
});

// Proper error testing
it('should throw NotFoundException when user not found', async () => {
  mockUserModel.findByPk.mockResolvedValue(null);
  await expect(service.findById('invalid')).rejects.toThrow(NotFoundException);
});
```

---

## 9. Debugging Failed Tests

### View Detailed Output
```bash
# Run with verbose output
npm test -- --verbose

# Run single test file
npm test -- user.service.spec.ts

# Run single test
npm test -- --testNamePattern="should create user"

# Debug test
node --inspect-brk node_modules/.bin/jest --runInBand user.service.spec.ts
```

### Common Issues:

**Issue:** "Cannot read property 'X' of undefined"
- **Solution:** Check if mock is properly configured
```typescript
// Add missing mock method
mockModel.findByPk = jest.fn();
```

**Issue:** "Expected mock function to have been called"
- **Solution:** Verify method is actually invoked
```typescript
// Add console.log to debug
console.log('Mock calls:', mockModel.create.mock.calls);
```

**Issue:** Tests pass individually but fail together
- **Solution:** Improve test isolation
```typescript
afterEach(() => {
  jest.clearAllMocks(); // Clear all mocks after each test
});
```

**Issue:** Async test timeout
- **Solution:** Increase timeout or fix async handling
```typescript
it('should handle slow operation', async () => {
  // ...
}, 10000); // 10 second timeout

// Or fix async
await expect(asyncMethod()).resolves.toBe(expected);
```

---

## 10. Next Steps

### Priority 1: Critical Services
1. Create tests for `user.service.ts`
2. Create tests for `student.service.ts`
3. Create tests for `health-record.service.ts`
4. Create tests for `medication.service.ts`

### Priority 2: Controllers
5. Create controller tests for user module
6. Create controller tests for student module
7. Create controller tests for health-record module

### Priority 3: E2E Tests
8. Create authentication E2E tests
9. Create user management E2E tests
10. Create student management E2E tests

### Priority 4: Security Components
11. Create guard tests for all guards
12. Create interceptor tests for security interceptors
13. Create pipe tests for validation and sanitization

---

## Resources

- **Full Review:** `/backend/TESTING_INFRASTRUCTURE_REVIEW.md`
- **Templates:** `/backend/test/templates/`
- **Test Helpers:** `/backend/test/helpers/`
- **Test Factories:** `/backend/test/factories/`

- **NestJS Testing:** https://docs.nestjs.com/fundamentals/testing
- **Jest Documentation:** https://jestjs.io/docs/getting-started
- **Supertest:** https://github.com/visionmedia/supertest

---

## Getting Help

1. Check existing tests for examples (especially `auth.service.spec.ts`)
2. Use test templates in `/test/templates/`
3. Review test helpers in `/test/helpers/`
4. Read full testing review in `TESTING_INFRASTRUCTURE_REVIEW.md`
5. Ask team members who have written tests

---

**Happy Testing!** 🧪

Remember: Good tests catch bugs before they reach production and make refactoring safe. Invest time in writing quality tests!
