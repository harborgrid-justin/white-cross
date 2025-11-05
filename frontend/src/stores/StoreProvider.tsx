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

/**
 * Props for StoreProvider component.
 *
 * @interface StoreProviderProps
 * @property {React.ReactNode} children - Child components to wrap with Redux Provider
 */
interface StoreProviderProps {
  children: React.ReactNode;
}

/**
 * Redux Store Provider Component.
 *
 * Wraps the application with Redux Provider to make the Redux store available
 * to all child components. Creates a unique store instance per client in Next.js
 * App Router using lazy initialization pattern.
 *
 * @component
 * @param {StoreProviderProps} props - Component props
 * @param {React.ReactNode} props.children - Child components to wrap with Redux context
 * @returns {JSX.Element} Redux Provider with children
 *
 * @example
 * ```typescript
 * // In app/layout.tsx (Next.js App Router)
 * import { StoreProvider } from '@/stores/StoreProvider';
 *
 * export default function RootLayout({
 *   children,
 * }: {
 *   children: React.ReactNode;
 * }) {
 *   return (
 *     <html lang="en">
 *       <body>
 *         <StoreProvider>
 *           {children}
 *         </StoreProvider>
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Combining with other providers
 * import { StoreProvider } from '@/stores/StoreProvider';
 * import { ThemeProvider } from '@/components/ThemeProvider';
 *
 * export default function Providers({ children }: { children: React.ReactNode }) {
 *   return (
 *     <StoreProvider>
 *       <ThemeProvider>
 *         {children}
 *       </ThemeProvider>
 *     </StoreProvider>
 *   );
 * }
 * ```
 *
 * @remarks
 * **Next.js App Router Compatibility**:
 * - Must be marked with 'use client' for client-side rendering
 * - Each client gets its own store instance (no SSR state sharing)
 * - Store is created lazily on first render using useState
 * - Store persists for the lifetime of the client session
 *
 * **Store Creation**:
 * - Uses useState with lazy initialization: `useState(() => makeStore())`
 * - Ensures store is created only once per client
 * - Prevents store recreation on re-renders
 * - Store includes HIPAA-compliant persistence middleware
 *
 * **State Management**:
 * - All child components can access Redux state via useAppSelector
 * - All child components can dispatch actions via useAppDispatch
 * - Store automatically loads persisted UI state from localStorage
 * - Auth state loaded from sessionStorage if available
 *
 * **Performance**:
 * - Lazy initialization prevents unnecessary store creation
 * - Single store instance per client (no duplicates)
 * - Efficient context propagation to all descendants
 *
 * @see {@link makeStore} for store factory function
 * @see {@link useAppDispatch} for typed dispatch hook
 * @see {@link useAppSelector} for typed selector hook
 */
export function StoreProvider({ children }: StoreProviderProps) {
  // Create store instance once per client using useState with lazy initialization
  // The function passed to useState runs only on the initial render
  const [store] = useState<AppStore>(() => makeStore());

  return <Provider store={store}>{children}</Provider>;
}

export default StoreProvider;
