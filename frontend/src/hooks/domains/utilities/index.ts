/**
 * @fileoverview Utilities Domain Hooks
 * @module hooks/domains/utilities
 * @category Hooks - Utilities
 *
 * Utility hooks that don't fit into specific domains but are used across
 * the application for common functionality like toast notifications.
 *
 * @example
 * ```typescript
 * import { useMedicationToast } from '@/hooks/domains/utilities';
 *
 * function MyComponent() {
 *   const { showSuccess, showError } = useMedicationToast();
 *
 *   return <button onClick={() => showSuccess('Saved!')}>Save</button>;
 * }
 * ```
 */

// Toast notifications
export * from './useMedicationToast';
