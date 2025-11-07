# Security Tests Quick Reference

## Test Execution Commands

### Run All Security Tests
```bash
cd /home/user/white-cross/backend
npx jest --testPathPattern="(hipaa-exception|rate-limit|csrf|permissions).*.spec"
```

### Run Individual Test Suites

#### HIPAA Exception Filter (84 tests - PHI Sanitization)
```bash
npx jest --testPathPattern="hipaa-exception.filter.spec"
```

#### Rate Limit Guard (73 tests - DDoS Prevention)
```bash
npx jest --testPathPattern="rate-limit.guard.spec"
```

#### CSRF Guard (61 tests - CSRF Protection)
```bash
npx jest --testPathPattern="csrf.guard.spec"
```

#### Permissions Guard (45 tests - Authorization)
```bash
npx jest --testPathPattern="permissions.guard.spec"
```

### Run with Coverage Report
```bash
npx jest --testPathPattern="(hipaa-exception|rate-limit|csrf|permissions).*.spec" --coverage
```

### Run in Watch Mode (Development)
```bash
npx jest --testPathPattern="(hipaa-exception|rate-limit|csrf|permissions).*.spec" --watch
```

### Run Specific Test Suite with Verbose Output
```bash
npx jest --testPathPattern="hipaa-exception.filter.spec" --verbose
```

## Test Files Locations

| Component | Test File | Test Count |
|-----------|-----------|------------|
| HIPAA Exception Filter | `/backend/src/common/exceptions/filters/hipaa-exception.filter.spec.ts` | 84 |
| Rate Limit Guard | `/backend/src/middleware/security/rate-limit.guard.spec.ts` | 73 |
| CSRF Guard | `/backend/src/middleware/security/csrf.guard.spec.ts` | 61 |
| Permissions Guard | `/backend/src/middleware/core/guards/permissions.guard.spec.ts` | 45 |

## Implementation Files

| Component | Implementation File |
|-----------|---------------------|
| HIPAA Exception Filter | `/backend/src/common/exceptions/filters/hipaa-exception.filter.ts` |
| Rate Limit Guard | `/backend/src/middleware/security/rate-limit.guard.ts` |
| CSRF Guard | `/backend/src/middleware/security/csrf.guard.ts` |
| Permissions Guard | `/backend/src/middleware/core/guards/permissions.guard.ts` |

## Test Coverage Summary

### Total: 263 Security Test Cases

- **HIPAA Exception Filter**: 84 tests
  - PHI sanitization (18 patterns)
  - Server-side vs client-side logging
  - Attack scenarios
  - Error handling

- **Rate Limit Guard**: 73 tests
  - Basic rate limiting
  - Brute force prevention
  - IP-based limiting
  - User-based limiting
  - Circuit breaker (fail-closed)
  - DDoS prevention

- **CSRF Guard**: 61 tests
  - Token generation
  - Token validation
  - Cross-session attacks
  - Token expiration
  - Attack scenarios

- **Permissions Guard**: 45 tests
  - Permission validation (ALL/ANY modes)
  - Role-based permissions
  - Role hierarchy
  - Privilege escalation prevention
  - PHI access control

## CI/CD Integration

### Add to GitHub Actions Workflow
```yaml
name: Security Tests

on: [push, pull_request]

jobs:
  security-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run test:security
        working-directory: ./backend

  security-coverage:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run test:security:coverage
        working-directory: ./backend
      - uses: codecov/codecov-action@v3
        with:
          files: ./backend/coverage/lcov.info
          flags: security
```

### Add to package.json Scripts
```json
{
  "scripts": {
    "test:security": "jest --testPathPattern='(hipaa-exception|rate-limit|csrf|permissions).*.spec'",
    "test:security:coverage": "jest --testPathPattern='(hipaa-exception|rate-limit|csrf|permissions).*.spec' --coverage",
    "test:security:watch": "jest --testPathPattern='(hipaa-exception|rate-limit|csrf|permissions).*.spec' --watch"
  }
}
```

## Quick Validation Checklist

Before deployment, verify all critical tests pass:

```bash
# 1. HIPAA Compliance
npx jest --testPathPattern="hipaa-exception.filter.spec" --silent

# 2. Brute Force Protection
npx jest --testPathPattern="rate-limit.guard.spec" --silent

# 3. CSRF Protection
npx jest --testPathPattern="csrf.guard.spec" --silent

# 4. Authorization
npx jest --testPathPattern="permissions.guard.spec" --silent

# 5. All Security Tests
npx jest --testPathPattern="(hipaa-exception|rate-limit|csrf|permissions).*.spec" --silent
```

## Debugging Failed Tests

### Run Single Test
```bash
npx jest --testPathPattern="hipaa-exception.filter.spec" -t "should redact SSN"
```

### Show Full Error Details
```bash
npx jest --testPathPattern="rate-limit.guard.spec" --verbose --no-coverage
```

### Debug in Watch Mode
```bash
npx jest --testPathPattern="csrf.guard.spec" --watch --verbose
```

## Test Results Interpretation

### Expected Output (All Passing)
```
PASS  src/common/exceptions/filters/hipaa-exception.filter.spec.ts (84 tests)
PASS  src/middleware/security/rate-limit.guard.spec.ts (73 tests)
PASS  src/middleware/security/csrf.guard.spec.ts (61 tests)
PASS  src/middleware/core/guards/permissions.guard.spec.ts (45 tests)

Test Suites: 4 passed, 4 total
Tests:       263 passed, 263 total
Snapshots:   0 total
Time:        ~10-15s
```

### If Tests Fail

1. **Check for missing dependencies**:
   ```bash
   npm install
   ```

2. **Check for environment configuration**:
   - Verify .env.test file exists
   - Check required environment variables

3. **Review error messages**:
   - Look for import errors
   - Check for missing mocks
   - Verify test data validity

4. **Run individual failing test with verbose output**:
   ```bash
   npx jest --testPathPattern="failing-test.spec" --verbose
   ```

## Security Test Maintenance

### When to Update Tests

1. **When adding new security features**:
   - Add corresponding test cases
   - Validate attack scenarios

2. **When fixing security vulnerabilities**:
   - Add regression tests
   - Validate fix effectiveness

3. **When updating dependencies**:
   - Run full security test suite
   - Update mocks if needed

4. **Before production deployment**:
   - Run all security tests with coverage
   - Review coverage reports
   - Validate critical paths

### Test Coverage Goals

- **Guards**: 90%+ coverage
- **Interceptors**: 85%+ coverage
- **Filters**: 90%+ coverage
- **Pipes**: 85%+ coverage
- **Security utilities**: 95%+ coverage

## Additional Resources

- **Full Security Summary**: `/SECURITY_IMPLEMENTATION_SUMMARY.md`
- **NestJS Testing Guide**: `backend/TESTING_QUICK_START.md`
- **HIPAA Compliance Docs**: `backend/docs/hipaa-compliance.md`
- **Security Architecture**: `backend/docs/security-architecture.md`

---

**Last Updated**: November 7, 2025
**Version**: 1.0
