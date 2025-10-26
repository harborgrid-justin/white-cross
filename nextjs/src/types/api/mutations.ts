/**
 * @fileoverview GraphQL Mutation Response Types
 * @module types/api/mutations
 * @category Types
 *
 * Comprehensive type definitions for GraphQL mutation responses and result types.
 * Provides consistent structure for create, update, delete, and bulk operations.
 *
 * Key Features:
 * - Generic mutation result types with id, success, message, data
 * - Specialized types for different mutation categories
 * - Consistent error handling patterns
 * - Support for optimistic updates
 * - Audit trail information
 *
 * Design Principles:
 * - Consistent structure across all mutation types
 * - Type safety for mutation inputs and results
 * - Clear separation between input and result types
 * - Support for partial updates
 * - Comprehensive error information
 *
 * @example
 * ```typescript
 * // Create mutation
 * const createResult: CreateMutationResult<Student> = {
 *   id: '123',
 *   success: true,
 *   message: 'Student created successfully',
 *   data: { id: '123', firstName: 'John', lastName: 'Doe' }
 * };
 *
 * // Update mutation
 * const updateResult: UpdateMutationResult<Student> = {
 *   id: '123',
 *   success: true,
 *   message: 'Student updated successfully',
 *   data: { id: '123', firstName: 'Jane', lastName: 'Doe' },
 *   previousData: { id: '123', firstName: 'John', lastName: 'Doe' }
 * };
 *
 * // Delete mutation
 * const deleteResult: DeleteMutationResult = {
 *   id: '123',
 *   success: true,
 *   message: 'Student deleted successfully'
 * };
 * ```
 */

// ==========================================
// BASE MUTATION RESULT TYPES
// ==========================================

/**
 * Base Mutation Result
 *
 * Common properties for all mutation results.
 * Extended by specific mutation result types.
 *
 * @example
 * ```typescript
 * const result: BaseMutationResult = {
 *   id: '123',
 *   success: true,
 *   message: 'Operation completed successfully'
 * };
 * ```
 */
export interface BaseMutationResult {
  /** ID of the affected resource */
  id: string;

  /** Indicates if the mutation was successful */
  success: boolean;

  /** Human-readable message about the operation */
  message: string;

  /** Optional error details if success is false */
  errors?: MutationError[];

  /** ISO timestamp when mutation was executed */
  timestamp?: string;

  /** User who performed the mutation */
  performedBy?: string;
}

/**
 * Mutation Error
 *
 * Detailed error information for failed mutations.
 *
 * @example
 * ```typescript
 * const error: MutationError = {
 *   field: 'email',
 *   message: 'Email is already in use',
 *   code: 'DUPLICATE_EMAIL',
 *   path: ['input', 'email']
 * };
 * ```
 */
export interface MutationError {
  /** Field that caused the error (for validation errors) */
  field?: string;

  /** Human-readable error message */
  message: string;

  /** Machine-readable error code */
  code: string;

  /** GraphQL path to the error */
  path?: string[];

  /** Additional context about the error */
  extensions?: Record<string, unknown>;
}

// ==========================================
// CRUD MUTATION RESULT TYPES
// ==========================================

/**
 * Create Mutation Result
 *
 * Result type for create operations. Includes the newly created resource.
 *
 * @template T - Type of the created resource
 *
 * @example
 * ```typescript
 * const result: CreateMutationResult<Student> = {
 *   id: '123',
 *   success: true,
 *   message: 'Student created successfully',
 *   data: {
 *     id: '123',
 *     firstName: 'John',
 *     lastName: 'Doe',
 *     grade: '10',
 *     createdAt: '2025-10-23T12:00:00Z'
 *   }
 * };
 * ```
 */
export interface CreateMutationResult<T = unknown> extends BaseMutationResult {
  /** The newly created resource */
  data: T;

  /** Operation type */
  operation: 'create';
}

/**
 * Update Mutation Result
 *
 * Result type for update operations. Includes updated resource and
 * optionally the previous state for optimistic update rollback.
 *
 * @template T - Type of the updated resource
 *
 * @example
 * ```typescript
 * const result: UpdateMutationResult<Student> = {
 *   id: '123',
 *   success: true,
 *   message: 'Student updated successfully',
 *   data: { id: '123', firstName: 'Jane', grade: '11' },
 *   previousData: { id: '123', firstName: 'John', grade: '10' },
 *   changedFields: ['firstName', 'grade']
 * };
 * ```
 */
export interface UpdateMutationResult<T = unknown> extends BaseMutationResult {
  /** The updated resource */
  data: T;

  /** Previous state before update (for rollback) */
  previousData?: Partial<T>;

  /** List of fields that were changed */
  changedFields?: string[];

  /** Operation type */
  operation: 'update';
}

/**
 * Delete Mutation Result
 *
 * Result type for delete operations. May include the deleted resource
 * or just confirmation of deletion.
 *
 * @template T - Type of the deleted resource (optional)
 *
 * @example
 * ```typescript
 * // Hard delete
 * const result: DeleteMutationResult = {
 *   id: '123',
 *   success: true,
 *   message: 'Student permanently deleted',
 *   operation: 'delete',
 *   permanent: true
 * };
 *
 * // Soft delete
 * const softResult: DeleteMutationResult<Student> = {
 *   id: '123',
 *   success: true,
 *   message: 'Student deactivated',
 *   operation: 'delete',
 *   permanent: false,
 *   data: { id: '123', isActive: false }
 * };
 * ```
 */
export interface DeleteMutationResult<T = unknown> extends BaseMutationResult {
  /** The deleted resource (for soft deletes) */
  data?: T;

  /** Whether this was a permanent deletion */
  permanent?: boolean;

  /** Operation type */
  operation: 'delete';
}

/**
 * Bulk Mutation Result
 *
 * Result type for bulk operations that affect multiple resources.
 * Includes counts and detailed results for each item.
 *
 * @template T - Type of the affected resources
 *
 * @example
 * ```typescript
 * const result: BulkMutationResult<Student> = {
 *   success: true,
 *   message: 'Bulk update completed with 2 failures',
 *   successful: 48,
 *   failed: 2,
 *   total: 50,
 *   results: [
 *     { id: '1', success: true, message: 'Updated' },
 *     { id: '2', success: false, message: 'Not found', errors: [...] }
 *   ],
 *   operation: 'bulk'
 * };
 * ```
 */
export interface BulkMutationResult<T = unknown> {
  /** Overall success status */
  success: boolean;

  /** General message about the bulk operation */
  message: string;

  /** Number of successful operations */
  successful: number;

  /** Number of failed operations */
  failed: number;

  /** Total number of operations attempted */
  total: number;

  /** Detailed results for each item */
  results?: ItemMutationResult<T>[];

  /** IDs of successfully processed items */
  successfulIds?: string[];

  /** IDs of failed items */
  failedIds?: string[];

  /** Operation type */
  operation: 'bulk';

  /** ISO timestamp when operation completed */
  timestamp?: string;
}

/**
 * Individual item result within a bulk operation
 */
export interface ItemMutationResult<T = unknown> {
  /** Item ID */
  id: string;

  /** Whether this item succeeded */
  success: boolean;

  /** Message for this item */
  message: string;

  /** Updated data for this item (if successful) */
  data?: T;

  /** Errors for this item (if failed) */
  errors?: MutationError[];
}

// ==========================================
// SPECIALIZED MUTATION RESULT TYPES
// ==========================================

/**
 * Transfer Mutation Result
 *
 * Result for transfer operations (e.g., transferring a student to another nurse).
 *
 * @template T - Type of the transferred resource
 *
 * @example
 * ```typescript
 * const result: TransferMutationResult<Student> = {
 *   id: '123',
 *   success: true,
 *   message: 'Student transferred successfully',
 *   data: { id: '123', nurseId: 'nurse-456' },
 *   fromId: 'nurse-123',
 *   toId: 'nurse-456',
 *   operation: 'transfer'
 * };
 * ```
 */
export interface TransferMutationResult<T = unknown> extends BaseMutationResult {
  /** The transferred resource */
  data: T;

  /** ID of the source (e.g., previous nurse) */
  fromId: string;

  /** ID of the destination (e.g., new nurse) */
  toId: string;

  /** Operation type */
  operation: 'transfer';
}

/**
 * Activate/Deactivate Mutation Result
 *
 * Result for activation/deactivation operations.
 *
 * @template T - Type of the resource
 *
 * @example
 * ```typescript
 * const result: ActivationMutationResult<Student> = {
 *   id: '123',
 *   success: true,
 *   message: 'Student reactivated successfully',
 *   data: { id: '123', isActive: true },
 *   activated: true,
 *   operation: 'activation'
 * };
 * ```
 */
export interface ActivationMutationResult<T = unknown> extends BaseMutationResult {
  /** The updated resource */
  data: T;

  /** Whether resource was activated (true) or deactivated (false) */
  activated: boolean;

  /** Operation type */
  operation: 'activation';
}

/**
 * Import Mutation Result
 *
 * Result for data import operations.
 *
 * @template T - Type of imported resources
 *
 * @example
 * ```typescript
 * const result: ImportMutationResult<Student> = {
 *   success: true,
 *   message: 'Import completed with 3 errors',
 *   imported: 97,
 *   failed: 3,
 *   total: 100,
 *   data: [...], // Successfully imported students
 *   errors: [...], // Error details for failed imports
 *   operation: 'import'
 * };
 * ```
 */
export interface ImportMutationResult<T = unknown> {
  /** Overall success status */
  success: boolean;

  /** General message about the import */
  message: string;

  /** Number of successfully imported items */
  imported: number;

  /** Number of failed imports */
  failed: number;

  /** Total number of items in import file */
  total: number;

  /** Successfully imported items */
  data?: T[];

  /** Detailed errors for failed imports */
  errors?: ImportError[];

  /** Operation type */
  operation: 'import';

  /** ISO timestamp when import completed */
  timestamp?: string;
}

/**
 * Import Error
 *
 * Detailed error information for failed import rows.
 */
export interface ImportError {
  /** Row number in import file */
  row: number;

  /** Field that caused the error */
  field?: string;

  /** Error message */
  message: string;

  /** Error code */
  code: string;

  /** Raw row data that failed */
  rowData?: Record<string, unknown>;
}

// ==========================================
// GRAPHQL-SPECIFIC TYPES
// ==========================================

/**
 * GraphQL Mutation Response
 *
 * Standard wrapper for GraphQL mutation responses.
 *
 * @template T - Type of the mutation result
 *
 * @example
 * ```typescript
 * const response: GraphQLMutationResponse<CreateMutationResult<Student>> = {
 *   data: {
 *     createStudent: {
 *       id: '123',
 *       success: true,
 *       message: 'Student created',
 *       data: { ... }
 *     }
 *   }
 * };
 * ```
 */
export interface GraphQLMutationResponse<T = unknown> {
  /** Mutation result data */
  data?: Record<string, T>;

  /** GraphQL errors */
  errors?: GraphQLError[];

  /** Additional extensions */
  extensions?: Record<string, unknown>;
}

/**
 * GraphQL Error
 *
 * Standard GraphQL error format.
 */
export interface GraphQLError {
  /** Error message */
  message: string;

  /** Path to the error in the query */
  path?: (string | number)[];

  /** Source location of the error */
  locations?: Array<{ line: number; column: number }>;

  /** Additional error information */
  extensions?: {
    code?: string;
    exception?: Record<string, unknown>;
    [key: string]: unknown;
  };
}

// ==========================================
// OPTIMISTIC UPDATE TYPES
// ==========================================

/**
 * Optimistic Update Context
 *
 * Context for managing optimistic updates with rollback capability.
 *
 * @template T - Type of the resource being updated
 *
 * @example
 * ```typescript
 * const context: OptimisticUpdateContext<Student> = {
 *   id: '123',
 *   previousData: { id: '123', firstName: 'John' },
 *   optimisticData: { id: '123', firstName: 'Jane' },
 *   rollback: () => {
 *     // Restore previous data
 *   }
 * };
 * ```
 */
export interface OptimisticUpdateContext<T = unknown> {
  /** Resource ID */
  id: string;

  /** Data before optimistic update */
  previousData: T;

  /** Optimistic data (predicted result) */
  optimisticData: T;

  /** Function to rollback the optimistic update */
  rollback: () => void;

  /** Whether the update has been confirmed */
  confirmed?: boolean;

  /** Timestamp of optimistic update */
  timestamp: number;
}

// ==========================================
// AUDIT MUTATION TYPES
// ==========================================

/**
 * Audit Information
 *
 * Audit trail information included in mutation results.
 *
 * @example
 * ```typescript
 * const auditInfo: AuditInfo = {
 *   performedBy: 'user-123',
 *   performedAt: '2025-10-23T12:00:00Z',
 *   action: 'update',
 *   resourceType: 'Student',
 *   resourceId: 'student-456',
 *   changes: {
 *     firstName: { from: 'John', to: 'Jane' },
 *     grade: { from: '10', to: '11' }
 *   }
 * };
 * ```
 */
export interface AuditInfo {
  /** ID of user who performed the action */
  performedBy: string;

  /** ISO timestamp of the action */
  performedAt: string;

  /** Type of action performed */
  action: 'create' | 'update' | 'delete' | 'transfer' | 'activation' | 'bulk' | 'import';

  /** Type of resource affected */
  resourceType: string;

  /** ID of affected resource */
  resourceId: string;

  /** Detailed change information */
  changes?: Record<string, ChangeDetail>;

  /** Additional context */
  context?: Record<string, unknown>;
}

/**
 * Change Detail
 *
 * Information about a specific field change.
 */
export interface ChangeDetail {
  /** Value before change */
  from: unknown;

  /** Value after change */
  to: unknown;

  /** Field data type */
  type?: string;
}

// ==========================================
// COMMON MUTATION INPUT TYPES
// ==========================================

/**
 * Create Input Base
 *
 * Base interface for create mutation inputs.
 * Excludes id, createdAt, updatedAt fields.
 *
 * @template T - Type of the resource to create
 */
export type CreateInput<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Update Input Base
 *
 * Base interface for update mutation inputs.
 * All fields optional except id, excludes timestamps.
 *
 * @template T - Type of the resource to update
 */
export type UpdateInput<T> = Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>> & {
  id: string;
};

/**
 * Bulk Update Input
 *
 * Input for bulk update operations.
 *
 * @template T - Type of the resource to update
 *
 * @example
 * ```typescript
 * const input: BulkUpdateInput<Student> = {
 *   ids: ['123', '456', '789'],
 *   data: {
 *     grade: '11',
 *     isActive: true
 *   }
 * };
 * ```
 */
export interface BulkUpdateInput<T> {
  /** IDs of resources to update */
  ids: string[];

  /** Data to apply to all resources */
  data: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>;
}

/**
 * Delete Input
 *
 * Input for delete operations.
 *
 * @example
 * ```typescript
 * const input: DeleteInput = {
 *   id: '123',
 *   permanent: false,
 *   reason: 'Student transferred to another school'
 * };
 * ```
 */
export interface DeleteInput {
  /** ID of resource to delete */
  id: string;

  /** Whether to permanently delete (true) or soft delete (false) */
  permanent?: boolean;

  /** Reason for deletion (for audit trail) */
  reason?: string;
}
