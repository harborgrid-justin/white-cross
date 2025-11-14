# Architecture Notes - React Component Architecture (RC8A4B)

**Agent**: React Component Architect
**Module**: identity-access
**Date**: 2025-11-04

## High-Level Design Decisions

### Component Extraction Strategy
- **Extracted SessionWarningModal** from embedded implementation in AuthContext.tsx
- Moved from internal component to standalone, reusable component
- Improved props interface from implementation-specific to clean, reusable API
- Enhanced accessibility, performance, and keyboard navigation

### Component Architecture Pattern
Organized components into three logical categories:
1. **Session Components** (`components/session/`) - Session management UI
2. **Guard Components** (`components/guards/`) - Declarative access control
3. **Feedback Components** (`components/feedback/`) - User feedback for auth states

### Component vs. Hook Strategy
- **Hooks**: Used for imperative logic and data access (useAuth, useHasPermission, useHasRole)
- **Components**: Used for declarative UI rendering with built-in logic (PermissionGate, RoleGuard, AuthGuard)
- This provides flexibility: use hooks for custom implementations, use components for quick integration

## Integration Patterns

### Guard Components Integration
Guard components integrate with existing hooks:
- `PermissionGate` → uses `useHasPermission` hook
- `RoleGuard` → uses `useHasRole` hook
- `AuthGuard` → uses `useAuth` hook

This maintains separation of concerns and keeps business logic in hooks.

### AuthContext Integration
- SessionWarningModal now imported as external component
- Context value memoized to prevent unnecessary re-renders
- Time remaining calculation moved to useMemo for performance
- Clean props interface: `isOpen`, `timeRemainingSeconds`, `onExtendSession`, `onLogout`

## React Patterns Used

### SessionWarningModal Patterns
- **Focus Management**: Custom focus trap implementation
- **Keyboard Navigation**: Tab cycling within modal, Escape key support
- **useCallback**: Stable function references for handlers
- **useMemo**: Computed countdown formatting
- **useRef**: DOM references for focus management
- **useEffect**: Cleanup patterns for intervals and event listeners

### Guard Component Patterns
- **Conditional Rendering**: Simple ternary for children vs fallback
- **Hooks Composition**: Building on existing auth hooks
- **Declarative API**: Clean component-based API for access control

### Feedback Component Patterns
- **Presentational Components**: Pure UI components with minimal logic
- **Callback Props**: onDismiss for user interactions
- **Optional Props**: Sensible defaults with customization options

## Performance Considerations

### Memoization Strategy
- **AuthContext**: Context value wrapped in useMemo to prevent unnecessary re-renders
- **SessionWarningModal**: Countdown calculation memoized
- **Stable References**: useCallback for all event handlers

### Re-render Optimization
- Guard components render minimal wrapper divs
- Feedback components are lightweight presentational components
- No inline function definitions in render (all useCallback)

### Code Splitting
Components are separate files, enabling:
- Tree-shaking of unused components
- Lazy loading potential for large modals
- Better bundle size management

## Type Safety

### TypeScript Interfaces
All components have explicit prop interfaces:
- `SessionWarningModalProps`
- `PermissionGateProps`
- `RoleGuardProps`
- `AuthGuardProps`
- `AuthErrorAlertProps`
- `AuthLoadingSpinnerProps`
- `UnauthorizedMessageProps`

### Type Integration
- Proper integration with existing `Permission` type from auth-permissions
- User type from @/types
- Next.js router types

### Export Strategy
- Named exports for components and types
- Default exports as backup
- Barrel exports for clean importing

## Accessibility Improvements

### SessionWarningModal
- ✅ Focus trap prevents focus escape
- ✅ Initial focus on "Stay Logged In" button
- ✅ Escape key extends session (user-friendly default)
- ✅ Tab cycling within modal
- ✅ aria-modal, aria-labelledby, aria-describedby
- ✅ aria-live region for countdown announcements
- ✅ Screen reader announcements every 30s or under 10s
- ✅ Semantic button elements with proper types

### AuthGuard
- ✅ Uses useEffect for redirects (not imperative window.location)
- ✅ Proper loading states during auth check
- ✅ data-testid for testing scenarios

### AuthErrorAlert
- ✅ role="alert" for immediate screen reader announcement
- ✅ aria-live="assertive" for critical errors
- ✅ Keyboard-accessible dismiss button
- ✅ Semantic HTML structure

### AuthLoadingSpinner
- ✅ role="status" with aria-live="polite"
- ✅ aria-label on spinner
- ✅ Screen reader-only text
- ✅ Duplicate announcement in aria-live region

### UnauthorizedMessage
- ✅ role="alert" with aria-live="polite"
- ✅ Clear, user-friendly messaging
- ✅ Optional permission details for transparency

## Testing Strategy

### Data Test IDs
All components include data-testid attributes:
- `session-warning-modal`
- `permission-gate-{permission}`
- `role-guard-{role}`
- `auth-guard-loading`
- `auth-guard-authenticated`
- `auth-error-alert`
- `auth-loading-spinner`
- `unauthorized-message`

### Test Scenarios Enabled
- Modal countdown behavior
- Focus trap functionality
- Permission-based rendering
- Role-based rendering
- Authentication redirect flows
- Error display and dismissal
- Loading states

## Migration Path

### Breaking Changes
None - this is additive architecture:
- AuthContext.tsx updated to import SessionWarningModal
- All existing hooks remain unchanged
- No breaking changes to public API

### Adoption Path
1. ✅ Extract SessionWarningModal - Done
2. ✅ Create guard components - Done
3. ✅ Create feedback components - Done
4. Future: Refactor pages to use guard components
5. Future: Replace inline permission checks with PermissionGate
6. Future: Use feedback components in login flows

## Documentation

### JSDoc Coverage
All components include comprehensive JSDoc:
- Module description
- Component description
- Props documentation
- Usage examples
- Edge cases and considerations

### Code Examples
Each component includes realistic usage examples showing:
- Basic usage
- Advanced usage with options
- Integration with existing hooks

## Related Files

### Created Files
- `components/session/SessionWarningModal.tsx`
- `components/guards/PermissionGate.tsx`
- `components/guards/RoleGuard.tsx`
- `components/guards/AuthGuard.tsx`
- `components/feedback/AuthErrorAlert.tsx`
- `components/feedback/AuthLoadingSpinner.tsx`
- `components/feedback/UnauthorizedMessage.tsx`
- `components/session/index.ts`
- `components/guards/index.ts`
- `components/feedback/index.ts`
- `components/index.ts`

### Modified Files
- `contexts/AuthContext.tsx` - Import and use SessionWarningModal

### Integration Points
- Hooks: `auth-permission-hooks.ts`, `auth-permissions.ts`, `AuthContext.tsx`
- Types: `@/types` for User type
- Store: `authSlice.ts` for auth state
- Router: Next.js `useRouter` for navigation
