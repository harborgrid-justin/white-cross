# Server Actions Security Enhancement Plan - SA7K9X

## Agent Information
- **Agent ID**: nextjs-server-actions-architect
- **Task ID**: SA7K9X
- **Started**: 2025-11-04
- **Related Agent Work**:
  - API Architecture Review (K8L9M3)
  - Various architecture notes and checklists in .temp/

## Mission
Implement production-grade security enhancements for identity-access module Server Actions including rate limiting, standardized error handling, input sanitization, CSRF protection, and comprehensive audit logging.

## Implementation Phases

### Phase 1: Foundation Layer (Helper Files)
**Duration**: 30-45 minutes
**Deliverables**:
1. `lib/types/action-result.ts` - Standardized action result types
2. `lib/helpers/action-result.ts` - Result builder functions
3. `lib/helpers/zod-errors.ts` - Zod error formatting
4. `lib/helpers/rate-limit.ts` - Rate limiting implementation
5. `lib/helpers/input-sanitization.ts` - Input sanitization utilities
6. `lib/helpers/csrf.ts` - CSRF token management

### Phase 2: Core Security Integration
**Duration**: 45-60 minutes
**Deliverables**:
1. Update `actions/auth.login.ts`:
   - Add rate limiting (IP + email based)
   - Fix dynamic import anti-pattern
   - Standardize error handling
   - Add input sanitization
   - Add CSRF validation

2. Update `actions/auth.password.ts`:
   - Add rate limiting
   - Add missing audit logs
   - Add path revalidation
   - Standardize error handling
   - Add input sanitization

3. Update `actions/auth.session.ts`:
   - Add token rotation for refresh
   - Add CSRF protection for logout
   - Standardize error handling

### Phase 3: Testing & Validation
**Duration**: 15-30 minutes
**Deliverables**:
1. Verify all imports resolve correctly
2. Check TypeScript compilation
3. Review security implementations
4. Document any edge cases

## Security Features to Implement

### 1. Rate Limiting Strategy
- **IP-based limiting**: Track requests per IP address
- **Email-based limiting**: Track login attempts per email
- **Memory-based storage**: Use Map with TTL for lightweight solution
- **Thresholds**:
  - Login: 5 attempts per 15 minutes (IP), 3 attempts per 15 minutes (email)
  - Password reset: 3 attempts per hour (email)
  - Password change: 5 attempts per hour (user)

### 2. Error Handling Standardization
- All actions return `ServerActionResult<T>` type
- Consistent error format: `{ fieldErrors, formErrors, timestamp }`
- Helper functions: `actionSuccess()`, `actionError()`, `actionValidationError()`

### 3. Input Sanitization
- Email normalization (lowercase, trim)
- String trimming and XSS prevention
- HTML entity encoding for user inputs
- Safe extraction from FormData

### 4. CSRF Protection
- Generate tokens using crypto.randomBytes
- Store in secure HTTP-only cookies
- Validate on state-changing operations
- Automatic token rotation

### 5. Audit Logging Enhancement
- Ensure ALL security-sensitive actions logged
- Add missing logs for password reset requests
- Include rate limit violations in audit trail
- Consistent log format across all actions

## Risk Mitigation
- Backward compatibility: Keep existing function signatures where possible
- Type safety: Full TypeScript coverage for all new code
- Error handling: Graceful degradation on helper failures
- Documentation: Comprehensive JSDoc for all public functions

## Success Criteria
- All 10 requirements from mission brief implemented
- Zero TypeScript errors
- All existing tests still pass
- Security features demonstrably working
- Clean, documented, production-ready code
