/**
 * @fileoverview Centralized Context Exports
 * @module contexts
 * @category State Management
 *
 * Barrel export file for all React contexts and their hooks.
 * Import contexts from this single location for consistency.
 *
 * Context Organization:
 * - Core contexts: Authentication, Navigation
 * - Domain contexts: Incident-specific contexts (FollowUpActions, etc.)
 *
 * @example Using core contexts
 * ```typescript
 * import { useAuth, useNavigation } from '@/contexts';
 *
 * function MyComponent() {
 *   const { user, isAuthenticated } = useAuth();
 *   const { toggleSidebar } = useNavigation();
 *   // ...
 * }
 * ```
 *
 * @example Using domain contexts
 * ```typescript
 * import { useFollowUpActions } from '@/contexts';
 *
 * function IncidentDetails() {
 *   const { actions, createFollowUpAction } = useFollowUpActions();
 *   // ...
 * }
 * ```
 */

// ==========================================
// CORE CONTEXTS
// ==========================================

/**
 * Authentication Context
 * Manages user authentication, session, and permissions
 */
export {
  AuthProvider,
  useAuth,
  useAuthContext, // Backward compatibility
} from './AuthContext';

/**
 * Navigation Context
 * Manages sidebar, breadcrumbs, and navigation state
 */
export {
  NavigationProvider,
  useNavigation,
  NavigationErrorBoundary,
} from './NavigationContext';

// Export navigation types for convenience
export type {
  BreadcrumbItem,
  NavigationHistoryEntry,
  NavigationState,
  NavigationActions,
  NavigationContextType,
} from './NavigationContext';

// ==========================================
// DOMAIN CONTEXTS
// ==========================================

/**
 * Incidents Domain Contexts
 * Manage incident-related state including follow-up actions and witness statements
 */
export {
  FollowUpActionProvider,
  useFollowUpActions,
  WitnessStatementProvider,
  useWitnessStatements,
} from './incidents';

// Export incidents context types
export type {
  FollowUpActionContextType,
  ActionFilters,
  OverdueAlert,
  WitnessStatementContextValue,
  WitnessStatementState,
} from './incidents';

// ==========================================
// CONTEXT COMPOSITION UTILITIES
// ==========================================

/**
 * Compose multiple context providers into a single component
 *
 * @example
 * ```typescript
 * const AllProviders = composeProviders([
 *   AuthProvider,
 *   NavigationProvider,
 *   FollowUpActionProvider,
 * ]);
 *
 * <AllProviders>
 *   <App />
 * </AllProviders>
 * ```
 */
export function composeProviders(
  providers: Array<React.ComponentType<{ children: React.ReactNode }>>
): React.ComponentType<{ children: React.ReactNode }> {
  return providers.reduce(
    (AccumulatedProviders, CurrentProvider) => {
      return ({ children }: { children: React.ReactNode }) => (
        <AccumulatedProviders>
          <CurrentProvider>{children}</CurrentProvider>
        </AccumulatedProviders>
      );
    },
    ({ children }: { children: React.ReactNode }) => <>{children}</>
  );
}
