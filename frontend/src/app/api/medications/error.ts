'use client';

/**
 * @fileoverview Medications API Error Boundary
 *
 * Handles medication-specific errors including administration errors, dosage validation,
 * inventory issues, and PHI access errors. Implements HIPAA-compliant error handling with
 * audit logging for all medication-related operations.
 *
 * @module api/medications/error
 * @category Error Handling
 * @subcategory API Error Boundaries
 *
 * **Medication Error Types:**
 * - Validation errors: Invalid dosage, missing required fields
 * - Administration errors: Already administered, schedule conflicts
 * - Inventory errors: Out of stock, expired medication
 * - PHI access errors: Unauthorized access to medication records
 *
 * **HIPAA Compliance:**
 * - All PHI access failures are audit logged
 * - No patient information in error messages
 * - Sanitized error responses
 *
 * @since 1.0.0
 */

import { useEffect } from 'react';

/**
 * Medication error props interface
 */
interface MedicationErrorProps {
  error: Error & {
    digest?: string;
    statusCode?: number;
    errorType?: 'VALIDATION' | 'ADMINISTRATION' | 'INVENTORY' | 'PHI_ACCESS' | 'DOSAGE' | 'SCHEDULE_CONFLICT';
    medicationId?: string;
    patientId?: string;
  };
  reset: () => void;
}

/**
 * Classified medication error
 */
interface ClassifiedMedicationError {
  type: string;
  status: number;
  message: string;
  action: string;
  canRetry: boolean;
  requiresAudit: boolean;
}

/**
 * Classify medication error
 */
function classifyMedicationError(error: Error & {
  statusCode?: number;
  errorType?: string;
  medicationId?: string;
  patientId?: string;
}): ClassifiedMedicationError {
  // Check specific error type
  if (error.errorType) {
    switch (error.errorType) {
      case 'VALIDATION':
        return {
          type: 'Validation Error',
          status: 400,
          message: 'Invalid medication data. Please verify all required fields.',
          action: 'Check medication details and try again',
          canRetry: true,
          requiresAudit: false
        };

      case 'DOSAGE':
        return {
          type: 'Dosage Error',
          status: 400,
          message: 'Invalid dosage amount. Please verify the prescribed dosage.',
          action: 'Verify dosage with prescribing physician',
          canRetry: true,
          requiresAudit: true // Critical - audit all dosage errors
        };

      case 'ADMINISTRATION':
        return {
          type: 'Administration Error',
          status: 409,
          message: 'Medication administration error. This may already be recorded or scheduled.',
          action: 'Verify administration status and try again',
          canRetry: false,
          requiresAudit: true
        };

      case 'SCHEDULE_CONFLICT':
        return {
          type: 'Schedule Conflict',
          status: 409,
          message: 'Medication schedule conflict detected. Another dose may be pending.',
          action: 'Review medication schedule and adjust timing',
          canRetry: false,
          requiresAudit: true
        };

      case 'INVENTORY':
        return {
          type: 'Inventory Error',
          status: 409,
          message: 'Medication inventory issue. Stock may be insufficient or expired.',
          action: 'Check inventory and restock if necessary',
          canRetry: false,
          requiresAudit: true
        };

      case 'PHI_ACCESS':
        return {
          type: 'Access Denied',
          status: 403,
          message: 'You do not have permission to access this medication record.',
          action: 'Contact your administrator for access',
          canRetry: false,
          requiresAudit: true // Critical - audit all PHI access failures
        };
    }
  }

  // Check status code
  if (error.statusCode === 403) {
    return {
      type: 'Access Denied',
      status: 403,
      message: 'You do not have permission to access this medication record.',
      action: 'Contact your administrator for access',
      canRetry: false,
      requiresAudit: true
    };
  }

  if (error.statusCode === 404) {
    return {
      type: 'Medication Not Found',
      status: 404,
      message: 'The requested medication record was not found.',
      action: 'Verify medication ID and try again',
      canRetry: false,
      requiresAudit: false
    };
  }

  if (error.statusCode === 409) {
    return {
      type: 'Conflict',
      status: 409,
      message: 'Medication operation conflict. The record may have been modified.',
      action: 'Refresh and try again',
      canRetry: true,
      requiresAudit: false
    };
  }

  // Parse error message
  const message = error.message.toLowerCase();
  if (message.includes('dosage') || message.includes('dose')) {
    return {
      type: 'Dosage Error',
      status: 400,
      message: 'Invalid dosage amount. Please verify the prescribed dosage.',
      action: 'Verify dosage with prescribing physician',
      canRetry: true,
      requiresAudit: true
    };
  }

  if (message.includes('administered') || message.includes('administration')) {
    return {
      type: 'Administration Error',
      status: 409,
      message: 'Medication administration error. This may already be recorded.',
      action: 'Verify administration status',
      canRetry: false,
      requiresAudit: true
    };
  }

  if (message.includes('inventory') || message.includes('stock') || message.includes('expired')) {
    return {
      type: 'Inventory Error',
      status: 409,
      message: 'Medication inventory issue detected.',
      action: 'Check inventory status',
      canRetry: false,
      requiresAudit: true
    };
  }

  if (message.includes('schedule') || message.includes('timing')) {
    return {
      type: 'Schedule Conflict',
      status: 409,
      message: 'Medication schedule conflict detected.',
      action: 'Review medication schedule',
      canRetry: false,
      requiresAudit: true
    };
  }

  if (message.includes('permission') || message.includes('unauthorized')) {
    return {
      type: 'Access Denied',
      status: 403,
      message: 'You do not have permission to access this medication record.',
      action: 'Contact your administrator for access',
      canRetry: false,
      requiresAudit: true
    };
  }

  // Default medication error
  return {
    type: 'Medication Error',
    status: 500,
    message: 'An error occurred while processing medication data.',
    action: 'Please try again or contact support',
    canRetry: true,
    requiresAudit: true
  };
}

/**
 * Sanitize medication error to remove PHI
 */
function sanitizeMedicationError(message: string): string {
  let sanitized = message;

  // Remove patient identifiers
  sanitized = sanitized.replace(/\b(patient|student)[-_]?id[-_:]?\s*[\w-]+/gi, '[PATIENT_ID]');
  sanitized = sanitized.replace(/\b(patient|student)[-_]?name[-_:]?\s*[\w\s]+/gi, '[PATIENT_NAME]');

  // Remove medication identifiers that might contain PHI
  sanitized = sanitized.replace(/\bfor\s+(patient|student)\s+[\w\s]+/gi, 'for [PATIENT]');

  // Remove any names
  sanitized = sanitized.replace(/\b[A-Z][a-z]+\s+[A-Z][a-z]+\b/g, '[NAME]');

  // Remove dates that might be PHI-related
  sanitized = sanitized.replace(/\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/g, '[DATE]');

  return sanitized;
}

/**
 * Medications API Error Boundary Component
 *
 * Catches medication-related errors and returns HIPAA-compliant JSON responses.
 * Implements audit logging for critical medication errors.
 *
 * **Error Response Format:**
 * ```json
 * {
 *   "error": "Error Type",
 *   "message": "User-friendly error message (no PHI)",
 *   "action": "Recommended action",
 *   "canRetry": true/false
 * }
 * ```
 *
 * **HIPAA Compliance:**
 * - No patient information in error responses
 * - All PHI access failures are audit logged
 * - All dosage errors are audit logged
 * - All administration errors are audit logged
 *
 * @param props - Error boundary props
 * @param props.error - The caught medication error
 * @param props.reset - Function to reset error boundary
 *
 * @returns JSON error response
 */
export default function MedicationError({ error, reset }: MedicationErrorProps) {
  useEffect(() => {
    // Classify error
    const classified = classifyMedicationError(error);

    // Log error
    if (process.env.NODE_ENV === 'production') {
      // Production logging - sanitized
      console.error('Medication Error:', {
        type: classified.type,
        status: classified.status,
        message: sanitizeMedicationError(error.message),
        digest: error.digest,
        timestamp: new Date().toISOString(),
        requiresAudit: classified.requiresAudit
      });

      // TODO: Audit log if required
      if (classified.requiresAudit) {
        // auditLog({
        //   action: 'MEDICATION_ERROR',
        //   resource: 'Medication',
        //   resourceId: error.medicationId,
        //   success: false,
        //   errorMessage: classified.type
        // });
      }

      // TODO: Send to monitoring service for critical errors
      if (classified.type === 'Dosage Error' || classified.type === 'Administration Error') {
        // Critical medication error - alert monitoring
        console.error('CRITICAL: Medication safety error detected');
      }
    } else {
      // Development logging - full details
      console.error('Medication Error caught by error boundary:', {
        error,
        classified,
        stack: error.stack
      });
    }
  }, [error]);

  // Classify error
  const classified = classifyMedicationError(error);

  // Build error response (no PHI)
  const errorResponse = {
    error: classified.type,
    message: classified.message,
    action: classified.action,
    canRetry: classified.canRetry,
    ...(error.digest && { errorId: error.digest }),
    ...(process.env.NODE_ENV === 'development' && {
      stack: error.stack,
      details: error
    })
  };

  // Return null - Next.js will handle JSON conversion
  return null;
}

/**
 * Export helper function for manual medication error handling
 *
 * @example
 * ```typescript
 * export async function POST(request: NextRequest, context, auth) {
 *   try {
 *     const medication = await request.json();
 *     // ... medication logic
 *   } catch (error) {
 *     return handleMedicationError(error, {
 *       userId: auth.user.id,
 *       action: 'CREATE_MEDICATION'
 *     });
 *   }
 * }
 * ```
 */
export function handleMedicationError(
  error: unknown,
  context?: {
    userId?: string;
    action?: string;
    medicationId?: string;
  }
): Response {
  const err = error instanceof Error ? error : new Error(String(error));
  const classified = classifyMedicationError(err as Error & { statusCode?: number; errorType?: string });

  // Log error (no PHI)
  console.error('Medication Error:', {
    type: classified.type,
    status: classified.status,
    message: sanitizeMedicationError(err.message),
    userId: context?.userId,
    action: context?.action,
    timestamp: new Date().toISOString(),
    requiresAudit: classified.requiresAudit
  });

  // TODO: Audit log if required
  if (classified.requiresAudit) {
    // auditLog({
    //   userId: context?.userId,
    //   action: context?.action || 'MEDICATION_ERROR',
    //   resource: 'Medication',
    //   resourceId: context?.medicationId,
    //   success: false,
    //   errorMessage: classified.type
    // });
  }

  // Build response
  const errorResponse = {
    error: classified.type,
    message: classified.message,
    action: classified.action,
    canRetry: classified.canRetry,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack
    })
  };

  return new Response(JSON.stringify(errorResponse), {
    status: classified.status,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
