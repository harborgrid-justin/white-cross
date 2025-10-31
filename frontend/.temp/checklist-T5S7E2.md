# TypeScript Test Fixes Checklist - T5S7E2

## Phase 1: Test Infrastructure Setup
- [ ] Create `/tests/` directory structure
- [ ] Create `/tests/utils/custom-matchers.ts` with type definitions
- [ ] Create `/tests/utils/test-utils.tsx` with custom render function
- [ ] Create `/tests/utils/test-factories.ts` for test data generation
- [ ] Create `/tests/utils/hipaa-test-utils.ts` for healthcare-specific testing
- [ ] Create `/tests/mocks/server.ts` for MSW mock server
- [ ] Create `/tests/mocks/handlers.ts` for API mock handlers

## Phase 2: Type Definitions
- [ ] Extend Jest matchers in `types/jest.d.ts`
- [ ] Add toBeValidEmail matcher type
- [ ] Add toBeValidDate matcher type
- [ ] Add toBeValidPhoneNumber matcher type
- [ ] Add toBeWithinRange matcher type
- [ ] Add custom render return type
- [ ] Export AuthContextValue type from AuthContext

## Phase 3: Component Tests - PermissionGate (69 errors)
- [ ] Fix AuthContextValue type completeness
- [ ] Add missing error property to mock contexts
- [ ] Add missing sessionExpiresAt property
- [ ] Add missing lastActivityAt property
- [ ] Add missing clearError method
- [ ] Add missing updateActivity method
- [ ] Add missing checkSession method
- [ ] Fix ReactNode type assertions
- [ ] Fix permission string literal types

## Phase 4: Component Tests - Button (44 errors)
- [ ] Replace vitest imports with jest
- [ ] Update test-utils import path
- [ ] Fix ButtonProps type issues
- [ ] Update variant prop types
- [ ] Update size prop types
- [ ] Fix loading prop type
- [ ] Fix icon prop types
- [ ] Fix onClick handler types

## Phase 5: Component Tests - Modal (54 errors)
- [ ] Identify and fix type issues
- [ ] Add proper prop types
- [ ] Fix ReactNode issues
- [ ] Update test implementations

## Phase 6: Hook Tests - useRouteState (47 errors)
- [ ] Add proper parameter types
- [ ] Fix implicit any types
- [ ] Update hook return types
- [ ] Fix event handler types

## Phase 7: Store Tests - communicationSlice (44 errors)
- [ ] Fix action types
- [ ] Fix state types
- [ ] Fix reducer types
- [ ] Add proper payload types

## Phase 8: API Route Tests
- [ ] Fix auth/login route test (18 errors)
  - [ ] Add Promise wrapper for params
  - [ ] Import test factories
  - [ ] Fix AuditLogEntry timestamp access
- [ ] Fix students route test
  - [ ] Import test factories
  - [ ] Import HIPAA test utils
- [ ] Fix medications route test
  - [ ] Import test factories
  - [ ] Import HIPAA test utils
- [ ] Fix proxy route test (16 errors)
  - [ ] Add Promise wrapper for params
  - [ ] Fix NODE_ENV read-only issue

## Phase 9: Page Tests
- [ ] Fix students page test (20 errors)
  - [ ] Import server mocks
  - [ ] Fix ReactNode vs Element issues

## Phase 10: Integration Tests
- [ ] Fix StudentForm.integration.test.tsx
  - [ ] Create test-utils
  - [ ] Create server mocks
  - [ ] Add event parameter types (4 errors)

## Phase 11: Setup Verification Test
- [ ] Fix custom matcher type errors (7 errors)

## Phase 12: Other Test Files
- [ ] Fix remaining hook tests
- [ ] Fix remaining service tests
- [ ] Fix remaining middleware tests

## Phase 13: Validation
- [ ] Run `npm run type-check` - verify zero errors
- [ ] Run `npm test -- --passWithNoTests` to verify no runtime errors
- [ ] Verify all imports resolve correctly
- [ ] Verify all custom matchers work
- [ ] Document any remaining issues
