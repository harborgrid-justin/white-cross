/**
 * @fileoverview useHydration Hook - SSR Hydration Awareness
 * @module hooks/useHydration
 * @category Hooks
 *
 * Custom hook to handle SSR hydration state in Next.js.
 * Prevents hydration mismatches and enables SSR-safe rendering.
 *
 * Features:
 * - Detects when component is hydrated
 * - Prevents hydration mismatches
 * - SSR-safe localStorage/sessionStorage access
 * - Client-only rendering support
 *
 * @example
 * ```typescript
 * import { useHydration } from '@/hooks/useHydration';
 *
 * function MyComponent() {
 *   const { isHydrated, isServer } = useHydration();
 *
 *   if (!isHydrated) {
 *     return <Skeleton />; // Show loading state during hydration
 *   }
 *
 *   return <ClientOnlyContent />;
 * }
 * ```
 */

'use client';

import { useEffect, useState } from 'react';

/**
 * Hydration state interface
 */
export interface HydrationState {
  /**
   * Whether the component is hydrated (client-side rendered)
   */
  isHydrated: boolean;

  /**
   * Whether currently running on server
   */
  isServer: boolean;

  /**
   * Whether currently running on client
   */
  isClient: boolean;
}

/**
 * Hook to track hydration state
 *
 * @returns Hydration state object
 *
 * @example Basic usage
 * ```typescript
 * const { isHydrated } = useHydration();
 *
 * if (!isHydrated) {
 *   return null; // Or loading skeleton
 * }
 *
 * return <ClientComponent />;
 * ```
 *
 * @example Conditional rendering
 * ```typescript
 * const { isHydrated, isServer } = useHydration();
 *
 * return (
 *   <div>
 *     {isServer && <ServerContent />}
 *     {isHydrated && <ClientContent />}
 *   </div>
 * );
 * ```
 */
export function useHydration(): HydrationState {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return {
    isHydrated,
    isServer: !isHydrated,
    isClient: isHydrated,
  };
}

/**
 * Hook for SSR-safe browser storage access
 *
 * @param key - Storage key
 * @param storage - Storage type ('local' or 'session')
 * @returns Storage value or null
 *
 * @example
 * ```typescript
 * const theme = useStorage('theme', 'local');
 *
 * if (theme) {
 *   applyTheme(theme);
 * }
 * ```
 */
export function useStorage(key: string, storage: 'local' | 'session' = 'local'): string | null {
  const { isHydrated } = useHydration();
  const [value, setValue] = useState<string | null>(null);

  useEffect(() => {
    if (!isHydrated) return;

    try {
      const storageObj = storage === 'local' ? localStorage : sessionStorage;
      const item = storageObj.getItem(key);
      setValue(item);
    } catch (error) {
      console.error('[useStorage] Error accessing storage:', error);
      setValue(null);
    }
  }, [key, storage, isHydrated]);

  return value;
}

/**
 * Hook to defer rendering until hydration complete
 *
 * Useful for components that must be client-only and cause
 * hydration mismatches if rendered on server.
 *
 * @param fallback - Optional fallback to render during hydration
 * @returns Render function
 *
 * @example
 * ```typescript
 * function MapComponent() {
 *   const render = useClientOnly(<Skeleton />);
 *
 *   return render(
 *     <div>
 *       {/* Client-only component *\/}
 *       <Map />
 *     </div>
 *   );
 * }
 * ```
 */
export function useClientOnly(fallback?: React.ReactNode) {
  const { isHydrated } = useHydration();

  return (children: React.ReactNode) => {
    if (!isHydrated) {
      return fallback || null;
    }
    return children;
  };
}

export default useHydration;
