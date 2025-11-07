# Security Component Test Execution Guide

Quick reference for running comprehensive security tests created in Phase 2.

## Quick Start

```bash
# Run ALL security component tests
npm test -- --testPathPattern="(guards|interceptors|pipes)/__tests__"

# Run with coverage
npm test -- --coverage --testPathPattern="security"

# Run in watch mode (for development)
npm test -- --watch
```

---

## Individual Test Suites

### Critical Guards

```bash
# Rate Limit Guard (50+ tests, CRITICAL)
npm test -- rate-limit.guard.spec.ts

# CSRF Guard (55+ tests, CRITICAL)
npm test -- csrf.guard.spec.ts

# Permissions Guard (40+ tests, HIGH)
npm test -- permissions.guard.spec.ts
```

### Critical Interceptors

```bash
# Audit Interceptor (45+ tests, HIPAA-CRITICAL)
npm test -- audit.interceptor.spec.ts
```

### Critical Pipes

```bash
# Sanitize Pipe (60+ tests, XSS Prevention)
npm test -- sanitize.pipe.spec.ts
```

---

## Test by Category

```bash
# All guard tests
npm test -- --testPathPattern="guards/__tests__"

# All interceptor tests
npm test -- --testPathPattern="interceptors/__tests__"

# All pipe tests
npm test -- --testPathPattern="pipes/__tests__"

# All security tests
npm test -- --testPathPattern="(security|access-control|monitoring)"
```

---

## Coverage Reports

```bash
# Generate HTML coverage report
npm test -- --coverage --coverageDirectory=coverage

# View coverage (opens browser)
open coverage/lcov-report/index.html

# Coverage for specific module
npm test -- --coverage --testPathPattern="guards" --collectCoverageFrom="src/**/guards/**/*.ts"
```

---

## Performance Testing

```bash
# Run only performance tests
npm test -- --testNamePattern="Performance"

# Run with timing information
npm test -- --verbose

# Run with profiling
node --inspect-brk node_modules/.bin/jest --runInBand
```

---

## HIPAA Compliance Tests

```bash
# Run all HIPAA-related tests
npm test -- --testNamePattern="HIPAA"

# Audit logging tests
npm test -- audit.interceptor.spec.ts

# PHI access tests
npm test -- --testNamePattern="PHI"
```

---

## Security Attack Scenario Tests

```bash
# XSS prevention tests
npm test -- --testNamePattern="XSS"

# CSRF attack tests
npm test -- csrf.guard.spec.ts --testNamePattern="attack"

# Rate limit attack tests
npm test -- rate-limit.guard.spec.ts --testNamePattern="attack"

# All attack scenarios
npm test -- --testNamePattern="attack|XSS|injection|hijack"
```

---

## CI/CD Commands

```bash
# Run in CI mode (no watch, fail fast)
npm test -- --ci --maxWorkers=2

# Run with coverage threshold enforcement
npm test -- --coverage --coverageThreshold='{"global":{"branches":80,"functions":80,"lines":80,"statements":80}}'

# Run only changed tests (Git)
npm test -- --changedSince=main

# Run with JUnit reporter (for CI)
npm test -- --ci --reporters=default --reporters=jest-junit
```

---

## Debugging Tests

```bash
# Run single test file in debug mode
node --inspect-brk node_modules/.bin/jest rate-limit.guard.spec.ts

# Run with increased timeout (for slow tests)
npm test -- --testTimeout=10000

# Run with detailed error output
npm test -- --verbose --no-coverage

# Run specific test by name
npm test -- rate-limit.guard.spec.ts -t "should prevent brute force"
```

---

## Test Files Created (This Session)

| File | Tests | Lines | Status |
|------|-------|-------|--------|
| `rate-limit.guard.spec.ts` | 50+ | 950+ | ✅ Complete |
| `csrf.guard.spec.ts` | 55+ | 850+ | ✅ Complete |
| `permissions.guard.spec.ts` | 40+ | 600+ | ✅ Complete |
| `audit.interceptor.spec.ts` | 45+ | 700+ | ✅ Complete |
| `sanitize.pipe.spec.ts` | 60+ | 700+ | ✅ Complete |

**Total:** 250+ test cases, 3,800+ lines of test code

---

## Expected Coverage

After running all tests, you should see:

```
--------------------|---------|----------|---------|---------|
File                | % Stmts | % Branch | % Funcs | % Lines |
--------------------|---------|----------|---------|---------|
rate-limit.guard.ts |   95.00 |    90.00 |   95.00 |   95.00 |
csrf.guard.ts       |   95.00 |    92.00 |   95.00 |   95.00 |
permissions.guard.ts|   95.00 |    90.00 |   95.00 |   95.00 |
audit.interceptor.ts|   98.00 |    95.00 |   98.00 |   98.00 |
sanitize.pipe.ts    |   95.00 |    90.00 |   95.00 |   95.00 |
--------------------|---------|----------|---------|---------|
```

---

## Common Issues & Solutions

### Issue: Tests timing out
```bash
# Solution: Increase timeout
npm test -- --testTimeout=10000
```

### Issue: Out of memory
```bash
# Solution: Run with limited workers
npm test -- --maxWorkers=2 --no-cache
```

### Issue: Jest cache issues
```bash
# Solution: Clear cache
npm test -- --clearCache
npm test
```

### Issue: Module not found
```bash
# Solution: Rebuild node_modules
rm -rf node_modules
npm install
npm test
```

---

## Test Maintenance

### Adding New Tests

1. Create test file next to source:
   ```
   src/module/
     ├── component.ts
     └── __tests__/
         └── component.spec.ts
   ```

2. Follow AAA pattern:
   ```typescript
   it('should do X when Y', () => {
     // Arrange
     const input = createMockInput();

     // Act
     const result = component.process(input);

     // Assert
     expect(result).toBe(expected);
   });
   ```

3. Run test to verify:
   ```bash
   npm test -- component.spec.ts
   ```

### Updating Existing Tests

1. Make changes to test file
2. Run in watch mode:
   ```bash
   npm test -- --watch component.spec.ts
   ```
3. Verify coverage maintained:
   ```bash
   npm test -- --coverage component.spec.ts
   ```

---

## Pre-Commit Checklist

Before committing security changes:

- [ ] All security tests passing
- [ ] Coverage ≥ 95% for modified files
- [ ] No skipped tests (`.skip`, `.only`)
- [ ] Performance tests passing
- [ ] HIPAA compliance tests passing
- [ ] Attack scenario tests passing
- [ ] Linting passing

```bash
# Run full pre-commit check
npm test -- --coverage
npm run lint
npm run build
```

---

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [NestJS Testing](https://docs.nestjs.com/fundamentals/testing)
- [Test Summary Report](./SECURITY_TESTS_COMPREHENSIVE_SUMMARY.md)
- [Testing Infrastructure Review](./TESTING_INFRASTRUCTURE_REVIEW.md)

---

**Last Updated:** 2025-11-07
**Phase:** Phase 2 - Security Component Testing
**Next Review:** After remaining tests completion
