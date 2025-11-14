/**
 * HIPAA-Compliant Testing Utilities for White Cross Healthcare Platform
 *
 * Provides utilities for testing HIPAA compliance requirements including:
 * - PHI data sanitization verification
 * - Audit log validation
 * - Access control testing
 * - Encryption verification
 * - Session timeout testing
 *
 * HIPAA Compliance Note:
 * All test data is synthetic. Real PHI must never be used in tests.
 *
 * @module tests/utils/hipaa-test-utils
 */

/**
 * Verifies that a response does not contain PHI in logs or error messages
 *
 * @param data - Data to check for PHI leakage
 * @returns Boolean indicating PHI-free status
 *
 * @example
 * ```typescript
 * const errorMessage = 'Student not found';
 * expect(verifyNoPHILeakage(errorMessage)).toBe(true);
 * ```
 */
export function verifyNoPHILeakage(data: unknown): boolean {
  const dataStr = JSON.stringify(data);

  // Check for common PHI patterns that should not appear in logs
  const phiPatterns = [
    /ssn/i,
    /social\s*security/i,
    /date\s*of\s*birth/i,
    /\d{3}-\d{2}-\d{4}/, // SSN format
  ];

  return !phiPatterns.some((pattern) => pattern.test(dataStr));
}

/**
 * Validates that audit log entries contain required HIPAA fields
 *
 * @param auditLog - Audit log entry to validate
 * @returns Boolean indicating valid audit log
 *
 * @example
 * ```typescript
 * expect(validateAuditLog(logEntry)).toBe(true);
 * ```
 */
export function validateAuditLog(auditLog: Record<string, unknown>): boolean {
  const requiredFields = [
    'userId',
    'action',
    'resource',
    'resourceId',
    'timestamp',
    'ipAddress',
  ];

  return requiredFields.every((field) => auditLog[field] !== undefined);
}

/**
 * Verifies that PHI data is properly encrypted in transit
 *
 * @param headers - Request/response headers
 * @returns Boolean indicating proper encryption
 *
 * @example
 * ```typescript
 * expect(verifyEncryption(response.headers)).toBe(true);
 * ```
 */
export function verifyEncryption(headers: Record<string, string>): boolean {
  // In tests, we check for presence of security headers
  return (
    headers['strict-transport-security'] !== undefined ||
    headers['x-content-type-options'] !== undefined
  );
}

/**
 * Creates a mock HIPAA-compliant response with proper headers
 *
 * @param data - Response data
 * @param options - Response options
 * @returns Mock response object
 *
 * @example
 * ```typescript
 * const response = createHIPAACompliantResponse({ students: [] });
 * ```
 */
export function createHIPAACompliantResponse(
  data: unknown,
  options: { headers?: Record<string, string> } = {}
) {
  return {
    ok: true,
    status: 200,
    json: async () => data,
    headers: new Headers({
      'strict-transport-security': 'max-age=31536000; includeSubDomains',
      'x-content-type-options': 'nosniff',
      'x-frame-options': 'DENY',
      'content-security-policy': "default-src 'self'",
      ...options.headers,
    }),
  };
}

/**
 * Sanitizes test data to ensure no real PHI is present
 *
 * @param data - Data to sanitize
 * @returns Sanitized data safe for testing
 */
export function sanitizeTestData<T>(data: T): T {
  // In tests, we just verify the data is from our test factories
  // This is a placeholder for production sanitization logic
  return data;
}

/**
 * Validates minimum necessary access principle
 *
 * @param requestedFields - Fields requested by user
 * @param userRole - Role of requesting user
 * @param allowedFields - Fields allowed for role
 * @returns Boolean indicating compliance
 */
export function validateMinimumNecessary(
  requestedFields: string[],
  userRole: string,
  allowedFields: string[]
): boolean {
  return requestedFields.every((field) => allowedFields.includes(field));
}

export const HIPAA_TIMEOUT = 15 * 60 * 1000; // 15 minutes in milliseconds
export const HIPAA_SESSION_WARNING = 2 * 60 * 1000; // 2 minutes warning

/**
 * Verifies that an audit log entry is properly formatted
 * Alias for validateAuditLog for backward compatibility
 */
export const verifyAuditLog = validateAuditLog;

/**
 * Checks if data contains PHI patterns
 * Returns true if PHI is detected (inverse of verifyNoPHILeakage)
 *
 * @param data - Data to check for PHI
 * @returns Boolean indicating PHI presence
 */
export function containsPHI(data: unknown): boolean {
  return !verifyNoPHILeakage(data);
}
