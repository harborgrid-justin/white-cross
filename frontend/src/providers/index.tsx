/**
 * @fileoverview Centralized Provider Exports
 * @module providers
 * @category State Management
 *
 * Barrel export file for all application providers.
 * Import providers from this single location for consistency.
 *
 * @example Individual provider imports
 * ```typescript
 * import { QueryProvider, ReduxProvider, ApolloProvider } from '@/providers';
 * ```
 *
 * @example Main app providers
 * ```typescript
 * import { AppProviders } from '@/providers';
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <AppProviders>
 *       {children}
 *     </AppProviders>
 *   );
 * }
 * ```
 */

// Core providers
export { QueryProvider } from './QueryProvider';
export { ReduxProvider } from './ReduxProvider';
export { ApolloProvider } from './ApolloProvider';

// Context providers (re-export from contexts)
/**
 * Auth Context Exports (for convenience)
 * @deprecated Import from @/identity-access/contexts instead
 */
export { AuthProvider, useAuth } from '@/identity-access/contexts/AuthContext';
export { NavigationProvider, useNavigation } from '@/contexts/NavigationContext';

// Main app providers composition
export { Providers as AppProviders } from '@/app/providers';
