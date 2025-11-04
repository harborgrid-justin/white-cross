/**
 * WF-COMP-349-TYPES | optimisticUpdates.types.ts - Type definitions module
 * Purpose: Type definitions for optimistic update system
 * Upstream: @tanstack/react-query | Dependencies: @tanstack/react-query
 * Downstream: optimisticUpdates modules | Called by: All optimistic update modules
 * Related: optimisticUpdates.manager, optimisticUpdates.ts
 * Exports: types, enums, interfaces | Key Features: Type system definitions
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Import → Type checking → Compile time validation
 * LLM Context: Type definitions module for optimistic update system
 */

/**
 * Type Definitions for Production-Grade Optimistic UI Update System
 *
 * Comprehensive type system for enterprise-grade optimistic updates with:
 * - Automatic rollback on failure
 * - Race condition handling
 * - Conflict detection and resolution
 * - Update queuing for conflicting operations
 * - Comprehensive audit trail
 * - HIPAA-compliant logging
 *
 * @module OptimisticUpdates.Types
 * @version 1.0.0
 */

import { QueryClient, QueryKey } from '@tanstack/react-query';

// =====================
// ENUMS
// =====================

/**
 * Status of an optimistic update
 */
export enum UpdateStatus {
  PENDING = 'PENDING',
  APPLIED = 'APPLIED',
  CONFIRMED = 'CONFIRMED',
  FAILED = 'FAILED',
  ROLLED_BACK = 'ROLLED_BACK',
  CONFLICTED = 'CONFLICTED',
}

/**
 * Strategy for handling rollback scenarios
 */
export enum RollbackStrategy {
  /** Restore previous data exactly as it was */
  RESTORE_PREVIOUS = 'RESTORE_PREVIOUS',
  /** Refetch data from server */
  REFETCH = 'REFETCH',
  /** Keep optimistic data but mark as stale */
  KEEP_STALE = 'KEEP_STALE',
  /** Use custom rollback handler */
  CUSTOM = 'CUSTOM',
}

/**
 * How to resolve data conflicts
 */
export enum ConflictResolutionStrategy {
  /** Server data always wins */
  SERVER_WINS = 'SERVER_WINS',
  /** Client data always wins */
  CLIENT_WINS = 'CLIENT_WINS',
  /** Merge both versions (requires merge function) */
  MERGE = 'MERGE',
  /** Ask user to resolve manually */
  MANUAL = 'MANUAL',
  /** Use timestamp - latest wins */
  TIMESTAMP = 'TIMESTAMP',
}

/**
 * Type of optimistic operation
 */
export enum OperationType {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  BULK_CREATE = 'BULK_CREATE',
  BULK_UPDATE = 'BULK_UPDATE',
  BULK_DELETE = 'BULK_DELETE',
}

// =====================
// CORE INTERFACES
// =====================

/**
 * Optimistic update metadata and tracking
 */
export interface OptimisticUpdate<T = unknown> {
  /** Unique identifier for this update */
  id: string;

  /** Query key affected by this update */
  queryKey: QueryKey;

  /** Type of operation being performed */
  operationType: OperationType;

  /** Current status of the update */
  status: UpdateStatus;

  /** Original data before the update */
  previousData: T | null;

  /** Optimistic data being applied */
  optimisticData: T;

  /** Actual server response after confirmation */
  confirmedData?: T;

  /** Timestamp when update was created */
  timestamp: number;

  /** Timestamp when update was confirmed or failed */
  completedAt?: number;

  /** Error information if update failed */
  error?: {
    message: string;
    code?: string;
    statusCode?: number;
    details?: unknown;
  };

  /** Rollback strategy for this update */
  rollbackStrategy: RollbackStrategy;

  /** Custom rollback handler */
  customRollback?: (queryClient: QueryClient) => void | Promise<void>;

  /** Conflict resolution strategy */
  conflictStrategy: ConflictResolutionStrategy;

  /** Custom merge function for conflict resolution */
  mergeFn?: (server: T, client: T) => T;

  /** User who initiated the update (for audit) */
  userId?: string;

  /** Additional metadata */
  metadata?: Record<string, unknown>;

  /** Whether this update is part of a transaction */
  transactionId?: string;

  /** Dependencies - other updates that must complete first */
  dependencies?: string[];

  /** Retry count for failed operations */
  retryCount: number;

  /** Maximum retry attempts */
  maxRetries: number;
}

/**
 * Conflict information when server data differs from optimistic data
 */
export interface ConflictResolution<T = unknown> {
  /** The optimistic update that caused the conflict */
  update: OptimisticUpdate<T>;

  /** Server version of the data */
  serverData: T;

  /** Client version of the data */
  clientData: T;

  /** Resolution strategy to use */
  strategy: ConflictResolutionStrategy;

  /** Merged result if using MERGE strategy */
  mergedData?: T;

  /** User's choice for MANUAL resolution */
  userChoice?: 'server' | 'client' | 'merged';

  /** Timestamp when conflict was detected */
  detectedAt: number;

  /** Timestamp when conflict was resolved */
  resolvedAt?: number;
}

/**
 * Options for optimistic operations
 */
export interface OptimisticOperationOptions<T = unknown> {
  /** Rollback strategy (default: RESTORE_PREVIOUS) */
  rollbackStrategy?: RollbackStrategy;

  /** Conflict resolution strategy (default: SERVER_WINS) */
  conflictStrategy?: ConflictResolutionStrategy;

  /** Custom rollback handler */
  customRollback?: (queryClient: QueryClient) => void | Promise<void>;

  /** Custom merge function */
  mergeFn?: (server: T, client: T) => T;

  /** Maximum retry attempts (default: 3) */
  maxRetries?: number;

  /** User ID for audit trail */
  userId?: string;

  /** Additional metadata */
  metadata?: Record<string, unknown>;

  /** Transaction ID to group related updates */
  transactionId?: string;

  /** Update dependencies */
  dependencies?: string[];

  /** Skip queuing for conflicting updates */
  skipQueue?: boolean;
}

/**
 * Statistics about optimistic updates
 */
export interface OptimisticUpdateStats {
  total: number;
  pending: number;
  applied: number;
  confirmed: number;
  failed: number;
  rolledBack: number;
  conflicted: number;
  averageConfirmationTime: number;
  successRate: number;
}
