# White Cross - Quick Start Testing Guide

## Test Files Created

### CRITICAL SECURITY TESTS
1. `/workspaces/white-cross/backend/src/auth/__tests__/auth.service.spec.ts` (620 lines)
2. `/workspaces/white-cross/backend/src/auth/guards/__tests__/jwt-auth.guard.spec.ts` (420 lines)
3. `/workspaces/white-cross/backend/src/auth/guards/__tests__/roles.guard.spec.ts` (480 lines)

### HEALTHCARE CRITICAL TESTS
4. `/workspaces/white-cross/backend/src/emergency-contact/__tests__/emergency-contact.service.spec.ts` (550 lines)

### DOCUMENTATION
5. `/workspaces/white-cross/backend/TEST_IMPLEMENTATION_SUMMARY.md` (comprehensive test documentation)

**Total**: 2,722 lines of tests and documentation

---

## Running Tests

### Option 1: Run All Tests
```bash
cd /workspaces/white-cross/backend
npm test
```

### Option 2: Run Specific Test Suites
```bash
# Auth Service Tests (login, register, JWT, password)
npm test auth.service.spec.ts

# JWT Guard Tests (token validation, route protection)
npm test jwt-auth.guard.spec.ts

# Roles Guard Tests (RBAC, authorization)
npm test roles.guard.spec.ts

# Emergency Contact Tests (notifications, contact management)
npm test emergency-contact.service.spec.ts
```

### Option 3: Run with Coverage Report
```bash
npm test -- --coverage
```

### Option 4: Watch Mode (for development)
```bash
npm test -- --watch
```

### Option 5: Run Tests in Specific Directory
```bash
# Run all auth tests
npm test src/auth

# Run all emergency-contact tests
npm test src/emergency-contact
```

---

## Expected Output

### Success Output Example
```
PASS  src/auth/__tests__/auth.service.spec.ts
  AuthService (CRITICAL SECURITY)
    register
      ✓ should successfully register a new user with valid credentials
      ✓ should reject registration if email already exists
      ✓ should reject invalid email format
      ... (50+ tests)

Test Suites: 1 passed, 1 total
Tests:       50 passed, 50 total
Snapshots:   0 total
Time:        2.5s
```

---

## Test Coverage Areas

### Auth Service (50+ tests)
- User registration with validation
- Login with password verification
- JWT token generation and validation
- Account lockout after 5 failed attempts
- Password strength requirements (8+ chars, complexity)
- Token refresh mechanisms
- Password change operations

### JWT Auth Guard (35+ tests)
- Valid/invalid token handling
- Public route bypass
- Protected route enforcement
- Token expiration handling
- Bearer format validation

### Roles Guard (40+ tests)
- Single and multiple role requirements
- Healthcare role hierarchy (ADMIN > NURSE > COUNSELOR > VIEWER)
- Mental health record access restrictions
- RBAC enforcement

### Emergency Contact Service (45+ tests)
- Emergency notification workflows
- Contact verification (SMS, email, voice)
- Priority sorting (PRIMARY/SECONDARY)
- Multi-channel notifications
- Maximum 2 PRIMARY contacts enforcement

---

## Troubleshooting

### Issue: Tests fail with "Cannot find module"
**Solution**: Install dependencies
```bash
npm install
```

### Issue: Database connection errors
**Solution**: Tests use mocks, no database needed. If error persists:
```bash
# Clear jest cache
npm test -- --clearCache
```

### Issue: Tests timeout
**Solution**: Increase timeout
```bash
npm test -- --testTimeout=10000
```

### Issue: Coverage report not generated
**Solution**: Run with coverage flag
```bash
npm test -- --coverage --coverageDirectory=coverage
```

---

## Next Steps

### Phase 2 - Additional Tests (Recommended)
1. **Appointment Service Tests**
   - Scheduling conflicts
   - Waitlist management
   - Reminder notifications

2. **Student Service Tests**
   - CRUD operations
   - PHI access logging
   - Search functionality

3. **E2E Tests**
   - Complete authentication flow
   - Protected endpoint access
   - Role-based authorization

### Creating New Tests
Follow the patterns in existing test files:
1. Create `__tests__` directory in module folder
2. Name file `[module-name].spec.ts`
3. Use NestJS TestingModule for dependency injection
4. Test happy paths and error cases
5. Add security edge cases

---

## Test Quality Metrics

### Coverage Goals
- **Critical modules**: 80%+ coverage
- **Security modules**: 95%+ coverage
- **Healthcare modules**: 90%+ coverage

### Test Quality Checklist
- [x] Descriptive test names
- [x] Happy path coverage
- [x] Error case coverage
- [x] Edge case coverage
- [x] Security vulnerability testing
- [x] HIPAA compliance validation
- [x] No PHI in test data

---

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Run Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm test -- --coverage
      - uses: codecov/codecov-action@v2
```

---

## Additional Resources

- [NestJS Testing Documentation](https://docs.nestjs.com/fundamentals/testing)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Test Implementation Summary](./TEST_IMPLEMENTATION_SUMMARY.md)

---

## Quick Commands Reference

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific suite
npm test auth.service.spec.ts

# Watch mode
npm test -- --watch

# Clear cache
npm test -- --clearCache

# Verbose output
npm test -- --verbose

# Run only changed files
npm test -- --onlyChanged

# Update snapshots (if using)
npm test -- --updateSnapshot
```

---

## Support

For issues or questions:
1. Check [TEST_IMPLEMENTATION_SUMMARY.md](./TEST_IMPLEMENTATION_SUMMARY.md)
2. Review existing test patterns
3. Consult NestJS testing documentation
4. Check Jest configuration in `jest.config.js`
