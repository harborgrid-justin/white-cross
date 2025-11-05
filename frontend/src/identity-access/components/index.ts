/**
 * Identity-Access Components - Main Barrel Export
 *
 * Centralized export point for all identity-access React components.
 * Provides clean imports for authentication, authorization, and session management components.
 *
 * @module components
 *
 * @example
 * ```tsx
 * // Import specific components
 * import { SessionWarningModal, AuthGuard, PermissionGate } from '@/identity-access/components';
 *
 * // Or import from specific modules
 * import { SessionWarningModal } from '@/identity-access/components/session';
 * import { AuthGuard } from '@/identity-access/components/guards';
 * ```
 */

// ==========================================
// SESSION COMPONENTS
// ==========================================

/**
 * Session-related components for managing user sessions
 */
export * from './session';

// ==========================================
// GUARD COMPONENTS
// ==========================================

/**
 * Guard components for declarative access control
 */
export * from './guards';

// ==========================================
// FEEDBACK COMPONENTS
// ==========================================

/**
 * Feedback components for authentication UI states
 */
export * from './feedback';
