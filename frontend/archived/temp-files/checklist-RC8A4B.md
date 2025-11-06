# Checklist - React Component Architecture (RC8A4B)

## Phase 1: Directory Structure Setup
- [ ] Create `F:\temp\white-cross\frontend\src\identity-access\components\` directory
- [ ] Create `F:\temp\white-cross\frontend\src\identity-access\components\session\` directory
- [ ] Create `F:\temp\white-cross\frontend\src\identity-access\components\guards\` directory
- [ ] Create `F:\temp\white-cross\frontend\src\identity-access\components\feedback\` directory

## Phase 2: SessionWarningModal Extraction
- [ ] Create `SessionWarningModal.tsx` file
- [ ] Define improved `SessionWarningModalProps` interface
- [ ] Extract modal JSX from AuthContext.tsx
- [ ] Add focus trap implementation
- [ ] Add Escape key handler
- [ ] Add proper ARIA attributes (aria-modal, aria-labelledby, aria-describedby)
- [ ] Add aria-live region for countdown announcements
- [ ] Use useCallback for stable function references
- [ ] Add data-testid attributes
- [ ] Add comprehensive JSDoc documentation
- [ ] Export component

## Phase 3: Guard Components Creation
- [ ] Create `PermissionGate.tsx`
  - [ ] Define PermissionGateProps interface
  - [ ] Implement permission check logic with useHasPermission
  - [ ] Add fallback UI support
  - [ ] Add data-testid attributes
  - [ ] Add JSDoc documentation
- [ ] Create `RoleGuard.tsx`
  - [ ] Define RoleGuardProps interface
  - [ ] Implement role check logic with useHasRole
  - [ ] Support single role or array of roles
  - [ ] Add fallback UI support
  - [ ] Add data-testid attributes
  - [ ] Add JSDoc documentation
- [ ] Create `AuthGuard.tsx`
  - [ ] Define AuthGuardProps interface
  - [ ] Implement authentication check with useAuth
  - [ ] Use useEffect for redirect (not window.location)
  - [ ] Add fallback UI during loading
  - [ ] Add data-testid attributes
  - [ ] Add JSDoc documentation

## Phase 4: Feedback Components Creation
- [ ] Create `AuthErrorAlert.tsx`
  - [ ] Define AuthErrorAlertProps interface
  - [ ] Implement error display with proper ARIA
  - [ ] Add dismiss functionality with keyboard support
  - [ ] Add data-testid attributes
  - [ ] Add JSDoc documentation
- [ ] Create `AuthLoadingSpinner.tsx`
  - [ ] Define AuthLoadingSpinnerProps interface
  - [ ] Implement loading spinner with aria-live
  - [ ] Add customizable message
  - [ ] Add data-testid attributes
  - [ ] Add JSDoc documentation
- [ ] Create `UnauthorizedMessage.tsx`
  - [ ] Define UnauthorizedMessageProps interface
  - [ ] Implement permission denied message
  - [ ] Add role attribute for accessibility
  - [ ] Add data-testid attributes
  - [ ] Add JSDoc documentation

## Phase 5: Index Files and Barrel Exports
- [ ] Create `components/session/index.ts` with SessionWarningModal export
- [ ] Create `components/guards/index.ts` with PermissionGate, RoleGuard, AuthGuard exports
- [ ] Create `components/feedback/index.ts` with all feedback component exports
- [ ] Create `components/index.ts` with re-exports from all subdirectories

## Phase 6: AuthContext Update
- [ ] Import SessionWarningModal from components
- [ ] Remove SessionWarningModal implementation (lines 434-521)
- [ ] Update SessionWarningModal usage in provider
- [ ] Fix props passed to extracted component
- [ ] Add useMemo for context value optimization
- [ ] Verify no TypeScript errors

## Phase 7: Validation and Testing
- [ ] Run TypeScript compilation check
- [ ] Verify all imports resolve correctly
- [ ] Check all components have proper prop types
- [ ] Verify all components have data-testid attributes
- [ ] Review accessibility (ARIA attributes, keyboard navigation)
- [ ] Review performance (useCallback, useMemo usage)
- [ ] Verify React best practices (no inline functions in render, proper hooks usage)
- [ ] Document any issues or decisions made
