/**
 * @fileoverview Audit Service Utility Functions
 * 
 * Provides utility functions for the audit service including ID generation,
 * checksum calculation, and other helper utilities.
 * 
 * @module AuditService/Utils
 * @version 1.0.0
 * @since 2025-11-11
 */

/**
 * @function generateChecksum
 * @description Generates a simple hash-based checksum for audit event data to enable
 * tamper detection. This checksum can be used to verify that audit events haven't
 * been modified after creation, supporting data integrity requirements.
 * 
 * **Algorithm Details:**
 * - Uses a simple hash function (djb2-like algorithm)
 * - Operates on JSON string representation of data
 * - Returns base-36 encoded hash for compact representation
 * - Provides reasonable tamper detection for audit purposes
 * 
 * **Security Notes:**
 * - This is NOT a cryptographic hash function
 * - Suitable for tamper detection, not cryptographic security
 * - For high-security environments, consider using SHA-256 or similar
 * 
 * @param {unknown} data - The data object to generate checksum for
 * @returns {string} Base-36 encoded checksum string
 * 
 * @example Generate Event Checksum
 * ```typescript
 * const eventData = {
 *   userId: 'user123',
 *   action: 'VIEW_HEALTH_RECORD',
 *   timestamp: '2025-10-21T14:30:00Z'
 * };
 * 
 * const checksum = generateChecksum(eventData);
 * console.log(checksum); // e.g., "1a2b3c4d"
 * ```
 * 
 * @example Verification Usage
 * ```typescript
 * const originalChecksum = generateChecksum(originalData);
 * const currentChecksum = generateChecksum(currentData);
 * 
 * if (originalChecksum !== currentChecksum) {
 *   console.warn('Data may have been tampered with');
 * }
 * ```
 * 
 * @since 1.0.0
 * @internal
 */
export function generateChecksum(data: unknown): string {
  const str = JSON.stringify(data);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * @function generateEventId
 * @description Generates a unique identifier for audit events. The ID combines
 * timestamp and random components to ensure uniqueness across distributed systems
 * and concurrent operations.
 * 
 * **ID Format:** `audit_{timestamp}_{random}`
 * - **audit**: Fixed prefix for identification
 * - **timestamp**: Current timestamp in milliseconds
 * - **random**: Base-36 encoded random string (9 characters)
 * 
 * **Uniqueness Guarantees:**
 * - Timestamp ensures temporal uniqueness
 * - Random component handles concurrent generation
 * - Combined approach works across multiple clients
 * - Extremely low collision probability
 * 
 * @returns {string} Unique audit event identifier
 * 
 * @example Generated ID Examples
 * ```typescript
 * const id1 = generateEventId();
 * console.log(id1); // "audit_1698765432123_x7k9m2p4q"
 * 
 * const id2 = generateEventId();
 * console.log(id2); // "audit_1698765432124_a3n8r1z5v"
 * ```
 * 
 * @example Usage in Event Creation
 * ```typescript
 * const auditEvent = {
 *   id: generateEventId(),
 *   action: AuditAction.VIEW_STUDENT,
 *   timestamp: new Date().toISOString(),
 *   // ... other fields
 * };
 * ```
 * 
 * @since 1.0.0
 * @internal
 */
export function generateEventId(): string {
  return `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * @function generateBatchId
 * @description Generates a unique identifier for audit event batches. Similar to
 * event IDs but with a different prefix to distinguish batch-level operations
 * from individual event operations.
 * 
 * **ID Format:** `batch_{timestamp}_{random}`
 * - **batch**: Fixed prefix for batch identification
 * - **timestamp**: Current timestamp in milliseconds
 * - **random**: Base-36 encoded random string (9 characters)
 * 
 * **Use Cases:**
 * - Tracking batch submission operations
 * - Correlating events within a batch
 * - Debugging batch processing issues
 * - Backend batch processing identification
 * 
 * @returns {string} Unique audit batch identifier
 * 
 * @example Generated Batch ID Examples
 * ```typescript
 * const batchId1 = generateBatchId();
 * console.log(batchId1); // "batch_1698765432123_x7k9m2p4q"
 * 
 * const batchId2 = generateBatchId();
 * console.log(batchId2); // "batch_1698765432124_a3n8r1z5v"
 * ```
 * 
 * @example Usage in Batch Creation
 * ```typescript
 * const auditBatch = {
 *   batchId: generateBatchId(),
 *   timestamp: new Date().toISOString(),
 *   events: [...auditEvents],
 *   checksum: generateChecksum(auditEvents)
 * };
 * ```
 * 
 * @since 1.0.0
 * @internal
 */
export function generateBatchId(): string {
  return `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * @function generateSessionId
 * @description Generates a unique session identifier for audit tracking.
 * 
 * @returns {string} Unique session identifier
 * 
 * @example Generated Session ID
 * ```typescript
 * const sessionId = generateSessionId();
 * console.log(sessionId); // "session_1698765432123_x7k9m2p4q"
 * ```
 * 
 * @since 1.0.0
 * @internal
 */
export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * @function getClientIP
 * @description Get client IP address (best effort)
 * 
 * @returns {string | undefined} Client IP address if available
 * 
 * @since 1.0.0
 * @internal
 */
export function getClientIP(): string | undefined {
  // IP address is typically set by server, not available in frontend
  // Could be retrieved from a backend endpoint if needed
  return undefined;
}

/**
 * @function getUserAgent
 * @description Get user agent string from browser
 * 
 * @returns {string | undefined} User agent string if available
 * 
 * @since 1.0.0
 * @internal
 */
export function getUserAgent(): string | undefined {
  return typeof navigator !== 'undefined' ? navigator.userAgent : undefined;
}
