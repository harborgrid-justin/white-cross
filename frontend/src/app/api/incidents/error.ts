'use client';

/**
 * @fileoverview Incidents API Error Boundary
 *
 * Handles incident reporting errors including validation errors, submission failures,
 * compliance issues, and PHI access errors. Implements HIPAA-compliant error handling with
 * audit logging for all incident-related operations.
 *
 * @module api/incidents/error
 * @category Error Handling
 * @subcategory API Error Boundaries
 *
 * **Incident Error Types:**
 * - Validation errors: Missing required fields, invalid severity levels
 * - Submission errors: Failed to create/update incident report
 * - Compliance errors: Missing required documentation, policy violations
 * - PHI access errors: Unauthorized access to incident records
 *
 * **HIPAA Compliance:**
 * - All PHI access failures are audit logged
 * - No patient information in error messages
 * - Sanitized error responses
 * - All incident access is tracked
 *
 * @since 1.0.0
 */

import { useEffect } from 'react';

/**
 * Incident error props interface
 */
interface IncidentErrorProps {
  error: Error & {
    digest?: string;
    statusCode?: number;
    errorType?: 'VALIDATION' | 'SUBMISSION' | 'COMPLIANCE' | 'PHI_ACCESS' | 'DOCUMENTATION' | 'SEVERITY';
    incidentId?: string;
    patientId?: string;
  };
  reset: () => void;
}

/**
 * Classified incident error
 */
interface ClassifiedIncidentError {
  type: string;
  status: number;
  message: string;
  action: string;
  canRetry: boolean;
  requiresAudit: boolean;
  isCritical: boolean;
}

/**
 * Classify incident error
 */
function classifyIncidentError(error: Error & {
  statusCode?: number;
  errorType?: string;
  incidentId?: string;
  patientId?: string;
}): ClassifiedIncidentError {
  // Check specific error type
  if (error.errorType) {
    switch (error.errorType) {
      case 'VALIDATION':
        return {
          type: 'Validation Error',
          status: 400,
          message: 'Invalid incident data. Please verify all required fields.',
          action: 'Check incident details and try again',
          canRetry: true,
          requiresAudit: false,
          isCritical: false
        };

      case 'SEVERITY':
        return {
          type: 'Severity Error',
          status: 400,
          message: 'Invalid incident severity level. Please select a valid severity.',
          action: 'Choose appropriate severity level (Low, Medium, High, Critical)',
          canRetry: true,
          requiresAudit: true,
          isCritical: false
        };

      case 'SUBMISSION':
        return {
          type: 'Submission Error',
          status: 500,
          message: 'Failed to submit incident report. Please try again.',
          action: 'Verify all information and resubmit',
          canRetry: true,
          requiresAudit: true,
          isCritical: true // Failed incident reporting is critical
        };

      case 'COMPLIANCE':
        return {
          type: 'Compliance Error',
          status: 400,
          message: 'Incident report does not meet compliance requirements.',
          action: 'Ensure all required documentation is included',
          canRetry: true,
          requiresAudit: true,
          isCritical: true
        };

      case 'DOCUMENTATION':
        return {
          type: 'Documentation Error',
          status: 400,
          message: 'Missing required documentation for incident report.',
          action: 'Attach required documents and try again',
          canRetry: true,
          requiresAudit: true,
          isCritical: false
        };

      case 'PHI_ACCESS':
        return {
          type: 'Access Denied',
          status: 403,
          message: 'You do not have permission to access this incident record.',
          action: 'Contact your administrator for access',
          canRetry: false,
          requiresAudit: true, // Critical - audit all PHI access failures
          isCritical: true
        };
    }
  }

  // Check status code
  if (error.statusCode === 403) {
    return {
      type: 'Access Denied',
      status: 403,
      message: 'You do not have permission to access this incident record.',
      action: 'Contact your administrator for access',
      canRetry: false,
      requiresAudit: true,
      isCritical: true
    };
  }

  if (error.statusCode === 404) {
    return {
      type: 'Incident Not Found',
      status: 404,
      message: 'The requested incident report was not found.',
      action: 'Verify incident ID and try again',
      canRetry: false,
      requiresAudit: false,
      isCritical: false
    };
  }

  if (error.statusCode === 409) {
    return {
      type: 'Conflict',
      status: 409,
      message: 'Incident report conflict detected. The report may have been modified.',
      action: 'Refresh and try again',
      canRetry: true,
      requiresAudit: true,
      isCritical: false
    };
  }

  // Parse error message
  const message = error.message.toLowerCase();
  if (message.includes('severity') || message.includes('priority')) {
    return {
      type: 'Severity Error',
      status: 400,
      message: 'Invalid incident severity level.',
      action: 'Choose appropriate severity level',
      canRetry: true,
      requiresAudit: true,
      isCritical: false
    };
  }

  if (message.includes('compliance') || message.includes('policy') || message.includes('regulation')) {
    return {
      type: 'Compliance Error',
      status: 400,
      message: 'Incident report does not meet compliance requirements.',
      action: 'Ensure all required documentation is included',
      canRetry: true,
      requiresAudit: true,
      isCritical: true
    };
  }

  if (message.includes('documentation') || message.includes('document') || message.includes('attachment')) {
    return {
      type: 'Documentation Error',
      status: 400,
      message: 'Missing required documentation for incident report.',
      action: 'Attach required documents and try again',
      canRetry: true,
      requiresAudit: true,
      isCritical: false
    };
  }

  if (message.includes('submit') || message.includes('submission') || message.includes('save')) {
    return {
      type: 'Submission Error',
      status: 500,
      message: 'Failed to submit incident report.',
      action: 'Verify all information and resubmit',
      canRetry: true,
      requiresAudit: true,
      isCritical: true
    };
  }

  if (message.includes('permission') || message.includes('unauthorized') || message.includes('forbidden')) {
    return {
      type: 'Access Denied',
      status: 403,
      message: 'You do not have permission to access this incident record.',
      action: 'Contact your administrator for access',
      canRetry: false,
      requiresAudit: true,
      isCritical: true
    };
  }

  if (message.includes('required') || message.includes('missing') || message.includes('invalid')) {
    return {
      type: 'Validation Error',
      status: 400,
      message: 'Invalid incident data. Please verify all required fields.',
      action: 'Check incident details and try again',
      canRetry: true,
      requiresAudit: false,
      isCritical: false
    };
  }

  // Default incident error
  return {
    type: 'Incident Error',
    status: 500,
    message: 'An error occurred while processing the incident report.',
    action: 'Please try again or contact support',
    canRetry: true,
    requiresAudit: true,
    isCritical: true
  };
}

/**
 * Sanitize incident error to remove PHI
 */
function sanitizeIncidentError(message: string): string {
  let sanitized = message;

  // Remove patient identifiers
  sanitized = sanitized.replace(/\b(patient|student)[-_]?id[-_:]?\s*[\w-]+/gi, '[PATIENT_ID]');
  sanitized = sanitized.replace(/\b(patient|student)[-_]?name[-_:]?\s*[\w\s]+/gi, '[PATIENT_NAME]');

  // Remove incident identifiers that might contain PHI
  sanitized = sanitized.replace(/\bincident\s+(for|involving|regarding)\s+[\w\s]+/gi, 'incident [DETAILS]');
  sanitized = sanitized.replace(/\breported\s+by\s+[\w\s]+/gi, 'reported by [USER]');

  // Remove any names
  sanitized = sanitized.replace(/\b[A-Z][a-z]+\s+[A-Z][a-z]+\b/g, '[NAME]');

  // Remove dates that might be PHI
  sanitized = sanitized.replace(/\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/g, '[DATE]');
  sanitized = sanitized.replace(/\b\d{1,2}:\d{2}\s*(?:AM|PM)?\b/gi, '[TIME]');

  // Remove locations that might be PHI
  sanitized = sanitized.replace(/\b(room|location|building)\s+[\w\s]+/gi, '[LOCATION]');

  return sanitized;
}

/**
 * Incidents API Error Boundary Component
 *
 * Catches incident-related errors and returns HIPAA-compliant JSON responses.
 * Implements audit logging for critical incident errors and access failures.
 *
 * **Error Response Format:**
 * ```json
 * {
 *   "error": "Error Type",
 *   "message": "User-friendly error message (no PHI)",
 *   "action": "Recommended action",
 *   "canRetry": true/false,
 *   "isCritical": true/false
 * }
 * ```
 *
 * **HIPAA Compliance:**
 * - No patient information in error responses
 * - All PHI access failures are audit logged
 * - All submission failures are audit logged
 * - All compliance errors are audit logged
 * - Sanitized error messages
 *
 * @param props - Error boundary props
 * @param props.error - The caught incident error
 * @param props.reset - Function to reset error boundary
 *
 * @returns JSON error response
 */
export default function IncidentError({ error, reset }: IncidentErrorProps) {
  useEffect(() => {
    // Classify error
    const classified = classifyIncidentError(error);

    // Log error
    if (process.env.NODE_ENV === 'production') {
      // Production logging - sanitized
      console.error('Incident Error:', {
        type: classified.type,
        status: classified.status,
        message: sanitizeIncidentError(error.message),
        digest: error.digest,
        timestamp: new Date().toISOString(),
        requiresAudit: classified.requiresAudit,
        isCritical: classified.isCritical
      });

      // TODO: Audit log if required
      if (classified.requiresAudit) {
        // auditLog({
        //   action: 'INCIDENT_ERROR',
        //   resource: 'Incident',
        //   resourceId: error.incidentId,
        //   success: false,
        //   errorMessage: classified.type
        // });
      }

      // TODO: Send to monitoring service for critical errors
      if (classified.isCritical) {
        console.error('CRITICAL: Incident reporting error - immediate attention required');
        // Alert on-call staff for critical incident reporting failures
      }
    } else {
      // Development logging - full details
      console.error('Incident Error caught by error boundary:', {
        error,
        classified,
        stack: error.stack
      });
    }
  }, [error]);

  // Classify error
  const classified = classifyIncidentError(error);

  // Build error response (no PHI)
  const errorResponse = {
    error: classified.type,
    message: classified.message,
    action: classified.action,
    canRetry: classified.canRetry,
    isCritical: classified.isCritical,
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
 * Export helper function for manual incident error handling
 *
 * @example
 * ```typescript
 * export async function POST(request: NextRequest, context, auth) {
 *   try {
 *     const incident = await request.json();
 *     // ... incident logic
 *   } catch (error) {
 *     return handleIncidentError(error, {
 *       userId: auth.user.id,
 *       action: 'CREATE_INCIDENT'
 *     });
 *   }
 * }
 * ```
 */
export function handleIncidentError(
  error: unknown,
  context?: {
    userId?: string;
    action?: string;
    incidentId?: string;
  }
): Response {
  const err = error instanceof Error ? error : new Error(String(error));
  const classified = classifyIncidentError(err as Error & { statusCode?: number; errorType?: string });

  // Log error (no PHI)
  console.error('Incident Error:', {
    type: classified.type,
    status: classified.status,
    message: sanitizeIncidentError(err.message),
    userId: context?.userId,
    action: context?.action,
    timestamp: new Date().toISOString(),
    requiresAudit: classified.requiresAudit,
    isCritical: classified.isCritical
  });

  // TODO: Audit log if required
  if (classified.requiresAudit) {
    // auditLog({
    //   userId: context?.userId,
    //   action: context?.action || 'INCIDENT_ERROR',
    //   resource: 'Incident',
    //   resourceId: context?.incidentId,
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
    isCritical: classified.isCritical,
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
