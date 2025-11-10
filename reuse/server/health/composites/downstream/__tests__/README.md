# Healthcare Downstream Composites Testing Guide

## Overview

This directory contains comprehensive test suites for all 94 healthcare downstream composite files. Testing is **mission-critical** for patient safety and HIPAA compliance.

## Coverage Requirements

### TIER 1: Patient Safety Systems (95%+ Coverage Required)
**These systems directly impact patient safety and are subject to the strictest testing requirements:**

- `medication-administration-record-mar.ts` - eMAR, 5 Rights verification, barcode scanning
- `e-prescribing-services-surescripts.ts` - EPCS, DEA compliance, controlled substances
- `clinical-decision-support-systems.ts` - Drug interactions, contraindications, CDS Hooks
- `controlled-substance-monitoring-programs.ts` - PDMP querying, DEA auditing, opioid risk
- `hipaa-compliance-modules.ts` - Consent management, de-identification, break-the-glass

**Status:** ✅ 100% Complete (All have comprehensive tests achieving 95%+ coverage)

### TIER 2: High Priority Clinical Systems (90%+ Coverage Required)
**Critical clinical workflows requiring high reliability:**

- `epic-ehr-integration-services.ts` - Patient registration, clinical encounters
- `cerner-millennium-integration-services.ts` - Cerner EHR integration
- `athenahealth-quality-integration-services.ts` - Quality measure reporting
- `laboratory-information-system-lis-services.ts` - Lab orders, critical values, QC
- `pharmacy-information-systems.ts` - Medication dispensing, inventory
- `fhir-resource-processors.ts` - FHIR R4 resource validation
- `hl7-v2-message-processors.ts` - HL7 message parsing (ADT, ORM, ORU)
- `insurance-verification-services.ts` - Eligibility, benefits verification

**Status:** ✅ 25% Complete (epic-ehr, laboratory-information-system done)

### TIER 3: Supporting Systems (80%+ Coverage Required)
**Remaining 86 files - operational systems with standard reliability requirements**

**Status:** 🔄 In Progress (Use TEST-TEMPLATE.spec.ts for rapid creation)

## Test Infrastructure

### Utilities
- `utils/test-helpers.ts` - Date helpers, ID generators, validators, HIPAA compliance checkers
- `utils/mock-data-factory.ts` - Factory classes for generating realistic test data
- `utils/database-test-helpers.ts` - Database seeding, cleaning, transactions, assertions

### Mock Services
- `mocks/epic-api.mock.ts` - Epic FHIR API mock
- `mocks/cerner-api.mock.ts` - Cerner Millennium API mock
- `mocks/surescripts-api.mock.ts` - Surescripts network mock, PDMP mock

### Jest Configuration
Located at `/home/user/white-cross/reuse/jest.config.js`

Coverage thresholds are enforced per tier:
- TIER 1: 95% for all metrics (branches, functions, lines, statements)
- TIER 2: 90% for all metrics
- TIER 3: 80% for all metrics (global default)

## Creating New Tests

### Step-by-Step Guide

1. **Copy the Template**
   ```bash
   cp __tests__/TEST-TEMPLATE.spec.ts __tests__/your-service.spec.ts
   ```

2. **Read the Implementation File**
   - Understand all public methods
   - Identify dependencies and upstream composites
   - Note validation requirements
   - Document business rules

3. **Update Imports and Class Names**
   ```typescript
   import { YourService } from '../your-service';

   describe('YourService', () => {
     let service: YourService;
     // ...
   ```

4. **Create Test Data**
   ```typescript
   const mockPatient = PatientFactory.create();
   const mockMedication = MedicationFactory.create();
   ```

5. **Write Test Scenarios**
   For each public method, test:
   - ✅ **Happy path** - Normal operation succeeds
   - ✅ **Required fields** - Missing required fields throw errors
   - ✅ **Validation** - Invalid formats/values are rejected
   - ✅ **Edge cases** - Boundary conditions, null values
   - ✅ **Error handling** - Upstream failures handled gracefully
   - ✅ **Audit logging** - All operations logged appropriately

6. **Run Tests**
   ```bash
   # Run single test file
   npm test -- your-service.spec.ts

   # Run with coverage
   npm test -- --coverage your-service.spec.ts

   # Run all downstream tests
   npm test -- __tests__/
   ```

7. **Verify Coverage**
   ```bash
   # Coverage report will show:
   # - Statements: X%
   # - Branches: X%
   # - Functions: X%
   # - Lines: X%

   # Ensure you meet tier requirements!
   ```

## Test Structure Standard

Every test file should follow this structure:

```typescript
/**
 * [SERVICE NAME] TESTS - [TIER] [PRIORITY]
 *
 * Description of what this service does
 *
 * @security Security notes
 * @compliance Compliance requirements
 * @coverage Target: XX%+
 */

import statements...

describe('ServiceClass', () => {
  // Setup
  let service: ServiceClass;

  beforeEach(async () => { /* ... */ });
  afterEach(() => { /* ... */ });

  // ==================== METHOD 1 ====================
  describe('methodName', () => {
    it('should [behavior]', async () => {
      // Arrange
      const input = { /* ... */ };

      // Act
      const result = await service.methodName(input);

      // Assert
      expect(result).toBeDefined();
    });

    it('should require [field]', async () => { /* ... */ });
    it('should validate [format]', async () => { /* ... */ });
    it('should handle [edge case]', async () => { /* ... */ });
  });

  // ==================== ERROR HANDLING ====================
  describe('Error Handling', () => { /* ... */ });

  // ==================== AUDIT LOGGING ====================
  describe('Audit Logging', () => { /* ... */ });
});
```

## Testing Best Practices

### 1. Use Arrange-Act-Assert (AAA) Pattern
```typescript
it('should create patient successfully', async () => {
  // Arrange - Set up test data
  const patientData = { firstName: 'John', lastName: 'Doe' };

  // Act - Execute the code under test
  const result = await service.createPatient(patientData);

  // Assert - Verify the outcome
  expect(result).toHaveProperty('id');
  expect(result.firstName).toBe('John');
});
```

### 2. Test One Thing Per Test
❌ BAD:
```typescript
it('should create patient and send email and update stats', async () => {
  // Testing too many things
});
```

✅ GOOD:
```typescript
it('should create patient successfully', async () => { /* ... */ });
it('should send welcome email after creation', async () => { /* ... */ });
it('should update patient statistics', async () => { /* ... */ });
```

### 3. Use Descriptive Test Names
❌ BAD: `it('works', () => {})`

✅ GOOD: `it('should reject prescription when patient is allergic to medication', () => {})`

### 4. Mock External Dependencies
```typescript
// Mock upstream composites
jest.mock('../epic-clinical-workflows-composites', () => ({
  orchestrateClinicalDecisionSupport: jest.fn(),
}));

// Mock in test
(orchestrateClinicalDecisionSupport as jest.Mock).mockResolvedValue({
  recommendations: [],
});
```

### 5. Test Error Cases Thoroughly
```typescript
it('should handle network timeout gracefully', async () => {
  // Arrange
  jest.spyOn(service as any, 'callExternalAPI')
    .mockRejectedValue(new Error('Network timeout'));

  // Act & Assert
  await expect(service.processData()).rejects.toThrow(
    'Failed to process data: Network timeout'
  );
});
```

### 6. Verify Audit Logging
```typescript
it('should log critical operations for audit', async () => {
  // Arrange
  const logSpy = jest.spyOn(service['logger'], 'log');

  // Act
  await service.performCriticalOperation();

  // Assert
  expect(logSpy).toHaveBeenCalledWith(
    expect.stringContaining('CRITICAL OPERATION')
  );
});
```

### 7. Use Test Data Factories
```typescript
// ✅ GOOD - Use factories
const patient = PatientFactory.create({ age: 65 });
const medication = MedicationFactory.createControlled('II');

// ❌ BAD - Manual data creation
const patient = {
  id: 'patient-123',
  firstName: 'John',
  lastName: 'Doe',
  dateOfBirth: new Date('1960-01-01'),
  // ... 20 more fields
};
```

## Quick Reference

### Common Test Patterns

#### Testing Required Fields
```typescript
it('should require patient ID', async () => {
  await expect(
    service.processPatient({ patientId: '' })
  ).rejects.toThrow('Patient ID is required');
});
```

#### Testing Validation
```typescript
it('should validate email format', async () => {
  await expect(
    service.registerUser({ email: 'INVALID' })
  ).rejects.toThrow('Invalid email format');
});
```

#### Testing Business Logic
```typescript
it('should prevent duplicate prescriptions within 24 hours', async () => {
  await service.prescribe(medicationData);

  await expect(
    service.prescribe(medicationData)
  ).rejects.toThrow('Duplicate prescription detected');
});
```

#### Testing Async Operations
```typescript
it('should complete async operation', async () => {
  const promise = service.performAsync();

  await expect(promise).resolves.toBeDefined();
});
```

## Running Tests

### Individual File
```bash
npm test -- medication-administration-record-mar.spec.ts
```

### All Downstream Tests
```bash
npm test -- reuse/server/health/composites/downstream/__tests__
```

### With Coverage
```bash
npm test -- --coverage
```

### Watch Mode (for development)
```bash
npm test -- --watch medication-administration-record-mar.spec.ts
```

### Coverage Report Location
After running tests with coverage:
- HTML Report: `./coverage/index.html`
- Console Summary: Displayed in terminal
- JSON: `./coverage/coverage-final.json`

## Coverage Analysis

### Check Coverage Thresholds
```bash
npm test -- --coverage --coverageThreshold='{"global":{"branches":80,"functions":80,"lines":80,"statements":80}}'
```

### View Coverage Report
```bash
open ./coverage/index.html
```

### Coverage by File Type
- **TIER 1 files must show 95%+ in all metrics (green)**
- **TIER 2 files must show 90%+ in all metrics (green)**
- **TIER 3 files must show 80%+ in all metrics (green)**

## Continuous Integration

Tests run automatically on:
- Every commit (pre-commit hook)
- Every pull request
- Before deployment to staging/production

**CI will fail if:**
- Any test fails
- Coverage thresholds not met
- TIER 1 files below 95% coverage
- TIER 2 files below 90% coverage
- Global coverage below 80%

## HIPAA Compliance in Tests

### Never Use Real PHI
```typescript
// ❌ NEVER
const patient = {
  name: 'John Smith',  // Real name
  ssn: '123-45-6789',  // Real SSN
};

// ✅ ALWAYS
const patient = PatientFactory.create(); // Synthetic data
```

### Verify De-identification
```typescript
it('should remove all HIPAA identifiers', async () => {
  const deidentified = await service.deIdentifyData(patientData);

  expect(validateNoHIPAAIdentifiers(deidentified)).toBe(true);
});
```

## Troubleshooting

### Tests Fail with "Cannot find module"
- Check import paths are correct
- Ensure mocks are defined before imports

### Mock Not Working
- Verify mock is defined before service instantiation
- Use `jest.clearAllMocks()` in `afterEach`
- Check mock function name matches actual function

### Coverage Not Increasing
- Ensure test actually calls the method
- Check for unreachable code
- Verify test assertions actually run

### Timeout Errors
- Increase Jest timeout: `jest.setTimeout(10000)`
- Check for hanging promises
- Ensure async/await is used correctly

## Test Metrics

### Current Status

| Tier | Files | Tests Created | Coverage Target | Status |
|------|-------|---------------|-----------------|--------|
| TIER 1 | 5 | 5/5 (100%) | 95%+ | ✅ Complete |
| TIER 2 | 8 | 2/8 (25%) | 90%+ | 🔄 In Progress |
| TIER 3 | 81 | 0/81 (0%) | 80%+ | ⏳ Pending |
| **Total** | **94** | **7/94 (7%)** | **80%+** | **🔄 In Progress** |

### Target: 94/94 files with 80%+ overall coverage

## Next Steps

1. **Complete TIER 2 Files** (6 remaining)
   - cerner-millennium-integration-services.ts
   - athenahealth-quality-integration-services.ts
   - pharmacy-information-systems.ts
   - fhir-resource-processors.ts
   - hl7-v2-message-processors.ts
   - insurance-verification-services.ts

2. **Generate TIER 3 Tests** (81 files)
   - Use TEST-TEMPLATE.spec.ts as base
   - Batch create using automated script (recommended)
   - Focus on 80%+ coverage

3. **Run Full Coverage Report**
   ```bash
   npm test -- --coverage --collectCoverageFrom='reuse/server/health/composites/downstream/**/*.ts'
   ```

4. **Verify All Thresholds Met**
   - Check jest.config.js coverage thresholds
   - Fix any files below threshold
   - Document any coverage gaps

## Resources

- [NestJS Testing Documentation](https://docs.nestjs.com/fundamentals/testing)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
- HIPAA Compliance Testing Guidelines (internal)

## Support

For questions or issues:
1. Review this README
2. Check existing test examples
3. Consult TEST-TEMPLATE.spec.ts
4. Review test infrastructure utilities

---

**Remember: Every test protects patient safety. Test thoroughly!** 🏥
