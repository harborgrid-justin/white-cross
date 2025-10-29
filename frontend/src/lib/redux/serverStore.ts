/**
 * @fileoverview Server-Side Redux Store Utilities for Next.js 15 SSR
 * @module lib/redux/serverStore
 * @category Store
 *
 * Provides utilities for server-side Redux store management in Next.js App Router.
 * Ensures no state leakage between requests and proper SSR hydration.
 *
 * Key Features:
 * - Per-request store instances (no state leakage)
 * - Safe serialization for SSR
 * - Type-safe state validation
 * - HIPAA-compliant (no PHI serialization)
 *
 * @example
 * ```typescript
 * // In Server Component
 * import { getServerStore, serializeStoreState } from '@/lib/redux/serverStore';
 *
 * export default async function Page() {
 *   const store = getServerStore();
 *   // Prefetch data
 *   await store.dispatch(fetchUsers());
 *
 *   const serializedState = serializeStoreState(store.getState());
 *
 *   return (
 *     <ClientComponent initialState={serializedState} />
 *   );
 * }
 * ```
 */

import { makeStore, type RootState, type AppStore } from '@/stores/store';

/**
 * Creates a new Redux store instance for server-side rendering
 *
 * IMPORTANT: Always create a new store per request to avoid state leakage
 * between different users/requests.
 *
 * @returns Fresh store instance for the current request
 *
 * @example
 * ```typescript
 * // In Server Component or Route Handler
 * const store = getServerStore();
 *
 * // Dispatch actions to populate initial state
 * await store.dispatch(fetchInitialData());
 *
 * // Get state for hydration
 * const state = store.getState();
 * ```
 */
export function getServerStore(): AppStore {
  return makeStore();
}

/**
 * Serializes Redux state for SSR with HIPAA compliance
 *
 * Only serializes safe, non-PHI data for initial hydration.
 * PHI data must be fetched client-side or via API.
 *
 * @param state - Full Redux state
 * @returns Serialized safe state for client hydration
 *
 * @example
 * ```typescript
 * const store = getServerStore();
 * const state = store.getState();
 * const safeState = serializeStoreState(state);
 *
 * // Pass to client
 * return <Component initialState={safeState} />;
 * ```
 */
export function serializeStoreState(state: RootState): string {
  // Extract only safe, non-PHI data for serialization
  const safeState = {
    // Auth: Only user profile, NO tokens
    auth: state.auth ? {
      user: state.auth.user ? {
        id: state.auth.user.id,
        email: state.auth.user.email,
        firstName: state.auth.user.firstName,
        lastName: state.auth.user.lastName,
        role: state.auth.user.role,
        // Do NOT include tokens or sensitive data
      } : null,
      isAuthenticated: state.auth.isAuthenticated,
      // Do NOT include error messages (may contain sensitive info)
    } : null,

    // Settings: UI preferences only
    settings: state.settings || {},

    // Dashboard: Aggregated stats only (no individual records)
    dashboard: state.dashboard ? {
      // Only safe, aggregated data
      // Do NOT include individual student/medication/incident details
    } : {},

    // Do NOT serialize:
    // - students (PHI)
    // - healthRecords (PHI)
    // - medications (PHI)
    // - emergencyContacts (PHI)
    // - incidentReports (PHI)
    // - Any other PHI-containing slices
  };

  try {
    return JSON.stringify(safeState);
  } catch (error) {
    console.error('[SSR] Failed to serialize state:', error);
    return JSON.stringify({});
  }
}

/**
 * Deserializes and validates SSR state on client
 *
 * @param serialized - Serialized state string from server
 * @returns Validated partial state or undefined if invalid
 *
 * @example
 * ```typescript
 * // In client component
 * const initialState = deserializeStoreState(props.serializedState);
 * ```
 */
export function deserializeStoreState(serialized: string): Partial<RootState> | undefined {
  if (!serialized) return undefined;

  try {
    const parsed = JSON.parse(serialized);

    // Validate structure
    if (typeof parsed !== 'object' || parsed === null) {
      console.warn('[SSR] Invalid serialized state structure');
      return undefined;
    }

    return parsed as Partial<RootState>;
  } catch (error) {
    console.error('[SSR] Failed to deserialize state:', error);
    return undefined;
  }
}

/**
 * Type guard to validate if state is safe for SSR
 *
 * @param state - State to validate
 * @returns True if state is safe to serialize
 */
export function isSafeForSSR(state: any): boolean {
  // Check for PHI fields that should NOT be serialized
  const phiFields = [
    'students',
    'healthRecords',
    'medications',
    'emergencyContacts',
    'incidentReports',
  ];

  if (typeof state !== 'object' || state === null) {
    return false;
  }

  // Ensure no PHI data present
  for (const field of phiFields) {
    if (field in state && state[field] !== null && state[field] !== undefined) {
      // If PHI field has data, it's not safe
      if (
        (Array.isArray(state[field]) && state[field].length > 0) ||
        (typeof state[field] === 'object' && Object.keys(state[field]).length > 0)
      ) {
        console.warn(`[SSR] State contains PHI field: ${field}`);
        return false;
      }
    }
  }

  return true;
}

/**
 * Pre-populate store with safe initial data for SSR
 *
 * @param store - Store instance
 * @param initialData - Safe initial data (non-PHI)
 *
 * @example
 * ```typescript
 * const store = getServerStore();
 *
 * preloadStoreData(store, {
 *   settings: await fetchSettings(),
 *   // Only non-PHI data
 * });
 * ```
 */
export function preloadStoreData(
  store: AppStore,
  initialData: Partial<RootState>
): void {
  // Validate data is safe
  if (!isSafeForSSR(initialData)) {
    console.error('[SSR] Attempted to preload unsafe data');
    return;
  }

  // Dispatch actions to populate state
  // Implementation depends on specific slice actions
  // This is a placeholder for the pattern
}

/**
 * Get cache key for SSR store based on request context
 *
 * Useful for caching SSR-rendered pages with different initial states.
 *
 * @param context - Request context (user role, preferences, etc.)
 * @returns Cache key string
 *
 * @example
 * ```typescript
 * const cacheKey = getSSRCacheKey({
 *   role: user.role,
 *   schoolId: user.schoolId,
 * });
 * ```
 */
export function getSSRCacheKey(context: {
  role?: string;
  schoolId?: string;
  districtId?: string;
  [key: string]: any;
}): string {
  const parts = [
    context.role || 'guest',
    context.schoolId || 'all',
    context.districtId || 'all',
  ];

  return `ssr-store-${parts.join('-')}`;
}

export default {
  getServerStore,
  serializeStoreState,
  deserializeStoreState,
  isSafeForSSR,
  preloadStoreData,
  getSSRCacheKey,
};
