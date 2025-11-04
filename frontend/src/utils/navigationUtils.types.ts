/**
 * WF-COMP-345 | navigationUtils.types.ts - Type definitions for navigation utilities
 * Purpose: Type definitions and interfaces for navigation system
 * Upstream: ../types, ../types/navigation | Dependencies: Type imports only
 * Downstream: Navigation utility modules | Called by: All navigation utilities
 * Related: navigationUtils.permissions, navigationUtils.filters
 * Exports: Re-exported types | Key Features: Type safety
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Type checking → Compile time validation
 * LLM Context: Type definitions module, extracted from navigationUtils.ts
 */

/**
 * Navigation Utilities - Type Definitions
 *
 * Re-exports all necessary types for navigation utilities.
 * This module serves as a central type definition hub.
 *
 * @module utils/navigationUtils.types
 */

// Re-export types from core type modules
export type { User, UserRole } from '@/types';
export type {
  NavigationItem,
  FilteredNavigationItem,
  NavigationPermission
} from '@/types/core/navigation';

/**
 * Access check result type
 */
export interface AccessCheckResult {
  hasAccess: boolean;
  reason?: 'role' | 'permission' | 'feature' | 'disabled';
}

/**
 * Access denial reason type
 */
export type AccessDenialReason = 'role' | 'permission' | 'feature' | 'disabled';

/**
 * Role-based permission mapping type
 */
export type RolePermissionMap = Record<string, string[]>;
