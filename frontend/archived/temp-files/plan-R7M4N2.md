# Next.js App Router Improvements - Implementation Plan R7M4N2

## Agent Coordination
- **Related Work**: P0S3C7 (TypeScript architect - security fixes)
- **Coordination Points**:
  - P0S3C7 will delete `middleware/auth.ts` (client-side insecure file)
  - P0S3C7 will rename `middleware/` → `api-guards/` (P2 priority)
  - This agent creates root `src/middleware.ts` (proper Next.js middleware)

## Objectives
1. Create proper Next.js edge middleware for authentication
2. Fix hook redirect patterns (window.location → useEffect + useRouter)
3. Create centralized route configuration
4. Implement loading states to prevent flash of unauthorized content
5. Document routing architecture and migration path

## Implementation Phases

### Phase 1: Root Middleware Creation (HIGH PRIORITY)
**Timeline**: Immediate
**Deliverables**:
- `F:/temp/white-cross/frontend/src/middleware.ts`
- Edge runtime authentication
- JWT verification using `lib/auth.ts`
- Security headers
- Route protection with matcher config

**Integration Points**:
- Uses `lib/auth.ts` for server-side JWT verification
- References route config (to be created)
- Adds user context headers for downstream use

### Phase 2: Route Configuration (MEDIUM PRIORITY)
**Timeline**: After Phase 1
**Deliverables**:
- `F:/temp/white-cross/frontend/src/identity-access/lib/config/routes.ts`
- Centralized route definitions
- Permission mapping per route
- Public/protected route lists

### Phase 3: Fix Hook Patterns (HIGH PRIORITY)
**Timeline**: After Phase 1
**Deliverables**:
- Updated `hooks/auth-guards.ts`
- useEffect + useRouter pattern
- Proper loading states
- No window.location usage

### Phase 4: Loading States (MEDIUM PRIORITY)
**Timeline**: After Phase 3
**Deliverables**:
- Loading UI components
- Auth state transition handling
- Prevention of flash of unauthorized content

### Phase 5: Documentation (MEDIUM PRIORITY)
**Timeline**: Final phase
**Deliverables**:
- `ROUTING_ARCHITECTURE.md`
- Migration guide
- Decision tree for route protection

## File Dependencies

### Will Read:
- `F:/temp/white-cross/frontend/src/lib/auth.ts` ✓ (already read)
- `F:/temp/white-cross/frontend/src/identity-access/middleware/rbac.ts` ✓ (already read)
- `F:/temp/white-cross/frontend/src/identity-access/middleware/withAuth.ts` ✓ (already read)
- `F:/temp/white-cross/frontend/src/identity-access/hooks/auth-guards.ts` ✓ (already read)

### Will Create:
- `F:/temp/white-cross/frontend/src/middleware.ts` (root middleware)
- `F:/temp/white-cross/frontend/src/identity-access/lib/config/routes.ts`
- `F:/temp/white-cross/frontend/src/identity-access/ROUTING_ARCHITECTURE.md`
- `F:/temp/white-cross/frontend/src/identity-access/MIGRATION_GUIDE.md`

### Will Modify:
- `F:/temp/white-cross/frontend/src/identity-access/hooks/auth-guards.ts`
- Import statements (if P0S3C7 completes middleware rename)

## Risk Management

### Coordination Risks:
- **Risk**: P0S3C7 might rename middleware/ before we update imports
- **Mitigation**: Monitor P0S3C7 progress, handle both old and new paths

### Technical Risks:
- **Risk**: Edge runtime limitations for middleware
- **Mitigation**: Keep middleware lightweight, use API routes for complex logic

### Breaking Changes:
- **Risk**: Changing hook patterns might break existing components
- **Mitigation**: Provide migration guide, maintain backward compatibility where possible

## Success Criteria
1. ✅ Root middleware protects all routes correctly
2. ✅ No window.location usage in hooks
3. ✅ Loading states prevent flash of content
4. ✅ Centralized route configuration in use
5. ✅ Comprehensive documentation provided
6. ✅ No circular dependencies introduced
