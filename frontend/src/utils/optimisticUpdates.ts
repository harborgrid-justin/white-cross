/**
 * WF-COMP-349 | optimisticUpdates.ts - Barrel export module
 * Purpose: Main entry point for optimistic update system
 * Upstream: React, external libs | Dependencies: @tanstack/react-query, @/types/common
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants, interfaces, classes | Key Features: Unified exports
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Import → Re-export → Component usage
 * LLM Context: Barrel export maintaining backward compatibility
 */

/**
 * Production-Grade Optimistic UI Update System
 *
 * Enterprise-grade optimistic update management for TanStack Query with:
 * - Automatic rollback on failure
 * - Race condition handling
 * - Conflict detection and resolution
 * - Update queuing for conflicting operations
 * - Comprehensive audit trail
 * - HIPAA-compliant logging
 *
 * This module provides a unified export interface maintaining backward compatibility
 * while the implementation is split across focused modules.
 *
 * @module OptimisticUpdates
 * @version 1.0.0
 */

// =====================
// TYPE EXPORTS
// =====================

// Re-export enums (values)
export {
  UpdateStatus,
  RollbackStrategy,
  ConflictResolutionStrategy,
  OperationType,
} from './optimisticUpdates.types';

// Re-export types (type-only)
export type {
  OptimisticUpdate,
  ConflictResolution,
  OptimisticOperationOptions,
  OptimisticUpdateStats,
} from './optimisticUpdates.types';

// =====================
// MANAGER EXPORTS
// =====================

export { OptimisticUpdateManager } from './optimisticUpdates.manager';

// =====================
// SINGLETON INSTANCE
// =====================

import { OptimisticUpdateManager } from './optimisticUpdates.manager';

/**
 * Global optimistic update manager instance
 *
 * Use this singleton instance for consistent update management across your application.
 *
 * @example
 * ```typescript
 * import { optimisticUpdateManager, OperationType } from '@/utils/optimisticUpdates';
 *
 * const updateId = optimisticUpdateManager.createUpdate(
 *   queryClient,
 *   ['incidents', id],
 *   OperationType.UPDATE,
 *   currentData,
 *   updatedData
 * );
 * ```
 */
export const optimisticUpdateManager = new OptimisticUpdateManager();
