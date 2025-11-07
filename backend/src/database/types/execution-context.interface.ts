/**
 * Execution Context Interface
 * Carries request-scoped information through the data access layer
 * Used for audit logging, authorization, and tracking
 *
 * HIPAA Compliance: Captures user, IP, and timestamp for audit trail
 */

import { UserRole } from './user-role.enum';

export type ExecutionUserRole = UserRole | 'SYSTEM';

export interface ExecutionContext {
  /**
   * User ID of the person performing the operation
   */
  userId?: string | null;

  /**
   * User role for authorization checks
   */
  userRole: ExecutionUserRole;

  /**
   * IP address of the request origin (HIPAA compliance)
   */
  ipAddress?: string | null;

  /**
   * User agent string from request headers (HIPAA compliance)
   */
  userAgent?: string | null;

  /**
   * Transaction ID for distributed transaction tracking
   */
  transactionId?: string;

  /**
   * Correlation ID for request tracking across services
   */
  correlationId?: string;

  /**
   * Timestamp of the operation
   */
  timestamp: Date;

  /**
   * User name for display purposes
   */
  userName?: string;

  /**
   * Request ID for tracking
   */
  requestId?: string;

  /**
   * Session ID for tracking
   */
  sessionId?: string;

  /**
   * Additional metadata for the operation
   */
  metadata?: Record<string, any>;
}

/**
 * Factory function to create execution context from HTTP request
 */
export function createExecutionContext(
  userId: string,
  userRole: UserRole,
  request?: {
    ip?: string;
    headers?: { 'user-agent'?: string };
  },
  additionalData?: Partial<ExecutionContext>,
): ExecutionContext {
  return {
    userId,
    userRole,
    ipAddress: request?.ip,
    userAgent: request?.headers?.['user-agent'],
    timestamp: new Date(),
    transactionId: generateTransactionId(),
    correlationId: additionalData?.correlationId,
    metadata: additionalData?.metadata,
  };
}

/**
 * Factory function to create system execution context
 * Used for automated background tasks and system operations
 */
export function createSystemExecutionContext(
  operation: string,
  metadata?: Record<string, any>,
): ExecutionContext {
  return {
    userId: 'system',
    userRole: 'SYSTEM',
    timestamp: new Date(),
    transactionId: generateTransactionId(),
    metadata: {
      ...metadata,
      systemOperation: operation,
    },
  };
}

/**
 * Generate unique transaction ID
 */
function generateTransactionId(): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 15);
  return `txn_${timestamp}_${randomStr}`;
}

/**
 * Validate execution context
 */
export function validateExecutionContext(context: ExecutionContext): void {
  if (!context.userId) {
    throw new Error('Execution context must have userId');
  }

  if (!context.userRole) {
    throw new Error('Execution context must have userRole');
  }

  if (!context.timestamp) {
    throw new Error('Execution context must have timestamp');
  }
}
