# API Architecture Implementation Checklist - AP7C9K

**Agent**: api-architect
**Reference**: plan-AP7C9K.md

---

## Phase 1: Create Centralized Configuration

### Permissions Configuration
- [ ] Create `lib/config/permissions.ts`
- [ ] Define Permission type
- [ ] Define Resource enum
- [ ] Define Action enum
- [ ] Define PERMISSIONS constant
- [ ] Create permission checking utilities
- [ ] Add TypeScript exports

### Roles Configuration
- [ ] Create `lib/config/roles.ts`
- [ ] Define Role type/enum
- [ ] Define single ROLE_HIERARCHY
- [ ] Define role comparison utilities
- [ ] Add TypeScript exports

### Token Utilities
- [ ] Create `lib/utils/token-utils.ts`
- [ ] Define cookie name constants
- [ ] Create single token extraction function
- [ ] Create token setting function
- [ ] Create token removal function
- [ ] Add TypeScript types

### API Configuration
- [ ] Create `lib/config/api.ts`
- [ ] Define base URLs
- [ ] Define timeout configurations
- [ ] Define retry logic
- [ ] Add API client configuration

### API Types
- [ ] Create `types/api.types.ts`
- [ ] Define ApiResponse<T> type
- [ ] Define ApiSuccessResponse<T> type
- [ ] Define ApiErrorResponse type
- [ ] Define ApiError type
- [ ] Define PaginatedResponse<T> type
- [ ] Add generic request/response types

---

## Phase 2: Remove Duplicates

### Find Duplicates
- [ ] Search for duplicate role hierarchies
- [ ] Search for duplicate permission definitions
- [ ] Search for duplicate token extraction
- [ ] Document all locations

### Remove Role Hierarchy Duplicates
- [ ] Remove from `lib/auth.ts:167-176`
- [ ] Remove from `lib/session.ts:247-256`
- [ ] Remove from `lib/permissions.ts`
- [ ] Verify no other locations

### Remove Permission Duplicates
- [ ] Remove from `hooks/auth-permissions.ts`
- [ ] Remove from `lib/permissions.ts` (partial)
- [ ] Remove from `middleware/rbac.ts` (inline)
- [ ] Verify no other locations

### Remove Token Extraction Duplicates
- [ ] Remove from file 1 (after updating)
- [ ] Remove from file 2 (after updating)
- [ ] Remove from file 3 (after updating)
- [ ] Verify no other locations

---

## Phase 3: Update All Consumers

### Update Permission Imports
- [ ] Update `hooks/auth-permissions.ts`
- [ ] Update `middleware/rbac.ts`
- [ ] Update all other permission consumers
- [ ] Verify imports resolve

### Update Role Imports
- [ ] Update `lib/auth.ts`
- [ ] Update `lib/session.ts`
- [ ] Update `lib/permissions.ts`
- [ ] Update all other role consumers
- [ ] Verify imports resolve

### Update Token Utilities Imports
- [ ] Update file 1 to use centralized token utils
- [ ] Update file 2 to use centralized token utils
- [ ] Update file 3 to use centralized token utils
- [ ] Verify all token operations work

### Verify Compilation
- [ ] Run TypeScript compiler
- [ ] Fix any type errors
- [ ] Ensure no broken imports

---

## Phase 4: Standardize API Patterns

### Response Format
- [ ] Create response builder helpers
- [ ] Create `successResponse<T>()` function
- [ ] Create `errorResponse()` function
- [ ] Add request ID generation

### Error Handling
- [ ] Create error sanitization helper
- [ ] Create error code mapping
- [ ] Ensure no backend errors leak to client
- [ ] Add proper error types

### Update API Calls
- [ ] Update auth API calls
- [ ] Update session API calls
- [ ] Update password API calls
- [ ] Ensure consistent response handling

---

## Phase 5: Rename and Document

### Directory Rename
- [ ] Rename `middleware/` to `api-guards/`
- [ ] Update all imports referencing middleware
- [ ] Verify no broken references

### Documentation
- [ ] Add README to `api-guards/`
- [ ] Explain difference from Next.js middleware
- [ ] Document API architecture decisions
- [ ] Create migration guide

### Architecture Notes
- [ ] Document consolidation decisions
- [ ] Document API patterns
- [ ] Document type safety improvements
- [ ] Document removed duplicates

---

## Final Verification

### Code Quality
- [ ] No duplicate definitions remain
- [ ] All imports resolve correctly
- [ ] TypeScript compilation succeeds
- [ ] No linting errors

### Type Safety
- [ ] All API responses properly typed
- [ ] All error responses properly typed
- [ ] No `any` types in new code
- [ ] Generic types used correctly

### Documentation
- [ ] All new files have JSDoc comments
- [ ] Architecture decisions documented
- [ ] Migration guide created
- [ ] README files updated

---

**Checklist Created**: 2025-11-04
**Owner**: API Architect (AP7C9K)
