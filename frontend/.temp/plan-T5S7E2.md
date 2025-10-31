# TypeScript Test Errors Fix Plan - T5S7E2

**Agent**: TypeScript Architect
**Task**: Fix all TypeScript errors in test files
**Start Time**: 2025-10-31
**Related Agent Work**:
- A1B2C3: API Architect (API integration review)
- X7Y3Z9: Accessibility Architect (WCAG compliance - completed)

## Problem Analysis

**Total Test Errors**: 536 TypeScript errors across ~30 test files

### Error Categories

1. **Missing Test Infrastructure** (Priority: Critical)
   - Missing `/tests/` directory
   - Missing `/tests/utils/custom-matchers.ts` (imported by jest.setup.ts)
   - Missing `/tests/utils/test-utils.ts` (imported by multiple tests)
   - Missing `/tests/utils/test-factories.ts` (imported by API tests)
   - Missing `/tests/utils/hipaa-test-utils.ts` (imported by healthcare tests)
   - Missing `/tests/mocks/server.ts` (imported by integration tests)

2. **Type Definition Issues** (Priority: Critical)
   - Custom Jest matchers not typed (toBeValidEmail, toBeValidDate, toBeValidPhoneNumber, toBeWithinRange)
   - AuthContextValue type mismatches in PermissionGate tests
   - ButtonProps type mismatches in Button tests
   - React Element vs ReactNode type issues
   - Next.js async params type issues (Promise<{ params }> expected)

3. **Import Issues** (Priority: High)
   - Button.test.tsx imports from 'vitest' instead of jest
   - Test files import from '@/test/' instead of '@/tests/'
   - Module resolution issues

4. **Implicit Any Types** (Priority: Medium)
   - Event handlers with implicit 'any' parameter types
   - Mock function parameter types
   - Test callback parameter types

## Implementation Phases

### Phase 1: Test Infrastructure Setup (30 min)
- Create `/tests/` directory structure
- Create custom matchers with proper types
- Create test utilities
- Create test factories
- Create HIPAA test utilities
- Create MSW server mocks
- Update type definitions

### Phase 2: Custom Matcher Type Definitions (15 min)
- Extend Jest matchers in `types/jest.d.ts`
- Add type declarations for all custom matchers
- Ensure type-safe matcher usage

### Phase 3: Component Test Fixes (45 min)
- Fix PermissionGate.test.tsx (69 errors)
  - AuthContextValue type completion
  - ReactNode type assertions
- Fix Button.test.tsx (44 errors)
  - Replace vitest with jest
  - Fix ButtonProps types
  - Update import paths
- Fix Modal.test.tsx (54 errors)
- Fix other component tests

### Phase 4: Hook Test Fixes (30 min)
- Fix useRouteState.test.tsx (47 errors)
- Fix useStudents.test.tsx
- Fix useMedicationMutations.test.tsx
- Add proper parameter types

### Phase 5: Store/Slice Test Fixes (30 min)
- Fix communicationSlice.test.ts (44 errors)
- Fix other slice tests
- Add proper action/state types

### Phase 6: API Route Test Fixes (30 min)
- Fix route.test.ts files
- Add Promise<> wrapper for async params
- Fix test factory imports
- Add proper response types

### Phase 7: Integration Test Fixes (20 min)
- Fix StudentForm.integration.test.tsx
- Fix server mock imports
- Add event parameter types

### Phase 8: Validation and Cleanup (20 min)
- Run type-check to verify all errors fixed
- Run tests to ensure no runtime errors
- Update documentation
- Clean up any remaining issues

## Success Criteria

- [ ] Zero TypeScript errors in test files
- [ ] All custom matchers properly typed
- [ ] All test utilities created and typed
- [ ] All tests pass type checking
- [ ] No test functionality removed
- [ ] Proper type safety maintained throughout

## Timeline

**Estimated Total Time**: 3.5 hours
**Target Completion**: 2025-10-31
