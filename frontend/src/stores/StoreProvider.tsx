/**
 * @fileoverview Redux Store Provider for Next.js 15 App Router
 * @module stores/StoreProvider
 * @category Store
 *
 * Provides Redux store to the component tree in Next.js App Router.
 * Must be used in client components only.
 *
 * Features:
 * - Client-side only (no SSR)
 * - Automatic store creation per client
 * - Type-safe context
 * - Compatible with React 19
 *
 * @example
 * ```typescript
 * // In app/layout.tsx
 * import { StoreProvider } from '@/stores/StoreProvider';
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <StoreProvider>
 *           {children}
 *         </StoreProvider>
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */

'use client';

import { useState } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from './store';

interface StoreProviderProps {
  children: React.ReactNode;
}

/**
 * Redux Store Provider Component
 * Wraps the app with Redux Provider for client-side state management
 *
 * @param props - Component props
 * @param props.children - Child components to wrap
 */
export function StoreProvider({ children }: StoreProviderProps) {
  // Create store instance once per client using useState with lazy initialization
  const [store] = useState<AppStore>(() => makeStore());

  return <Provider store={store}>{children}</Provider>;
}

export default StoreProvider;
