# Implementation Plan - React Component Architecture (RC8A4B)

**Agent**: React Component Architect
**Task**: Extract and create React components for identity-access module
**Started**: 2025-11-04
**Related Files**: AuthContext.tsx, auth-guards.ts, auth-permission-hooks.ts

## Objectives

Transform the identity-access module from a hooks-heavy architecture to a proper component-based architecture by:
1. Extracting the embedded SessionWarningModal component
2. Creating reusable guard components (PermissionGate, RoleGuard, AuthGuard)
3. Creating feedback components (AuthErrorAlert, AuthLoadingSpinner, UnauthorizedMessage)
4. Improving accessibility, performance, and type safety across all components

## Phases

### Phase 1: Directory Structure Setup (15 min)
**Deliverables**:
- Create `components/` directory in identity-access
- Create subdirectories: `session/`, `guards/`, `feedback/`

### Phase 2: SessionWarningModal Extraction (45 min)
**Deliverables**:
- Extract SessionWarningModal from AuthContext.tsx (lines 434-521)
- Improve props interface for better reusability
- Add focus trap for accessibility
- Add keyboard handlers (Escape key)
- Add proper ARIA attributes
- Use useCallback for performance
- Add countdown announcement for screen readers
- Create component file with comprehensive JSDoc

**Improvements**:
- Change from calculating countdown internally to receiving timeRemainingSeconds prop
- Add data-testid attributes
- Use proper semantic HTML
- Add aria-live region for countdown updates

### Phase 3: Guard Components Creation (60 min)
**Deliverables**:
- `PermissionGate.tsx` - Conditional rendering based on permissions
- `RoleGuard.tsx` - Conditional rendering based on roles
- `AuthGuard.tsx` - Route protection with authentication check

**Key Features**:
- Use useEffect for redirects (not imperative window.location)
- Support fallback UI for unauthorized states
- Proper TypeScript interfaces
- Comprehensive JSDoc documentation
- Integration with existing hooks (useHasPermission, useHasRole, useAuth)

### Phase 4: Feedback Components Creation (45 min)
**Deliverables**:
- `AuthErrorAlert.tsx` - Display authentication errors
- `AuthLoadingSpinner.tsx` - Loading indicator for auth operations
- `UnauthorizedMessage.tsx` - User-friendly message for permission denied

**Key Features**:
- Accessible error messages with proper ARIA
- Dismissible alerts with keyboard support
- Loading states with aria-live announcements
- Customizable messages and styling

### Phase 5: Index Files and Barrel Exports (15 min)
**Deliverables**:
- `components/session/index.ts`
- `components/guards/index.ts`
- `components/feedback/index.ts`
- `components/index.ts` (main barrel export)

### Phase 6: AuthContext Update (30 min)
**Deliverables**:
- Update AuthContext.tsx to import SessionWarningModal
- Remove embedded component implementation
- Simplify provider logic
- Add context value memoization for performance

### Phase 7: Validation and Testing (30 min)
**Deliverables**:
- TypeScript compilation check
- Accessibility audit (WCAG 2.1 AA)
- Performance review (memoization, stable references)
- React best practices review

## Total Estimated Time: 4 hours

## Success Criteria

1. All components use TypeScript with proper interfaces
2. All components have data-testid attributes
3. All components are accessible (WCAG 2.1 AA)
4. AuthContext.tsx successfully imports and uses extracted SessionWarningModal
5. All guard components work with existing hooks
6. All feedback components are reusable and well-documented
7. Clean barrel exports enable `import { SessionWarningModal } from '@/identity-access/components'`

## Risk Mitigation

- **Breaking Changes**: Carefully update AuthContext.tsx imports incrementally
- **Type Mismatches**: Ensure all permission and role types are properly imported
- **Performance Regressions**: Use useCallback and useMemo appropriately
- **Accessibility Issues**: Test with screen reader and keyboard navigation
