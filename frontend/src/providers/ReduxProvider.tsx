/**
 * @fileoverview Redux Store Provider - Consolidated
 * @module providers/ReduxProvider
 * @category State Management
 *
 * Provides Redux store to the component tree in Next.js App Router.
 * Must be used in client components only.
 *
 * Features:
 * - Client-side only (no SSR)
 * - Automatic store creation per client
 * - Type-safe context
 * - Compatible with React 19
 * - State persistence (non-PHI only)
 *
 * @example
 * ```typescript
 * import { ReduxProvider } from '@/providers/ReduxProvider';
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <ReduxProvider>
 *       {children}
 *     </ReduxProvider>
 *   );
 * }
 * ```
 */

'use client';

import { useState, type ReactNode } from 'react';
import { Provider } from 'react-redux';
import { makeStore, type AppStore } from '@/stores/store';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

interface ReduxProviderProps {
  /** Child components to wrap */
  children: ReactNode;
}

// ==========================================
// PROVIDER COMPONENT
// ==========================================

/**
 * Redux Store Provider Component
 *
 * Wraps the app with Redux Provider for client-side state management.
 * Creates a new store instance per client using lazy initialization.
 *
 * @param {ReduxProviderProps} props - Component props
 * @param {ReactNode} props.children - Child components to wrap
 * @returns {JSX.Element} Provider tree
 */
export function ReduxProvider({ children }: ReduxProviderProps) {
  // Create store instance once per client using useState with lazy initialization
  const [store] = useState<AppStore>(() => makeStore());

  return <Provider store={store}>{children}</Provider>;
}

export default ReduxProvider;
