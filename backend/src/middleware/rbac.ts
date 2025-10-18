/**
 * LOC: 1C3AB3EEBA
 * WC-MID-RBC-049 | Role-Based Access Control Re-export & Legacy Compatibility
 *
 * UPSTREAM (imports from):
 *   - None (leaf node)
 *
 * DOWNSTREAM (imported by):
 *   - None (not imported)
 */

/**
 * WC-MID-RBC-049 | Role-Based Access Control Re-export & Legacy Compatibility
 * Purpose: RBAC middleware re-export, maintains backward compatibility
 * Upstream: shared/security/permissionUtils | Dependencies: None (re-export only)
 * Downstream: Protected routes, admin functions | Called by: Route handlers
 * Related: shared/security/permissionUtils.ts, middleware/auth.ts, routes/*
 * Exports: Re-exported RBAC functions | Key Services: Permission checking
 * Last Updated: 2025-10-18 | Dependencies: None (facade pattern)
 * Critical Path: Route access → RBAC check → Shared utilities execution
 * LLM Context: Deprecated middleware, use shared/security/permissionUtils directly
 */

/**
 * RBAC Middleware - Migrated to shared utilities
 * 
 * @deprecated These functions have been migrated to shared utilities.
 * Import from '../shared/security' instead for new code.
 */

// Re-export from shared security utilities for backward compatibility
export * from '../shared/security/permissionUtils';
