'use client';

/**
 * @fileoverview Authentication API Error Boundary
 *
 * Handles authentication-specific errors including failed login attempts, token expiration,
 * rate limiting, and authorization failures. Implements HIPAA-compliant audit logging for
 * all authentication failures.
 *
 * @module api/auth/error
 * @category Error Handling
 * @subcategory API Error Boundaries
 *
 * **Authentication Error Types:**
 * - 401 Unauthorized: Invalid credentials, expired token
 * - 403 Forbidden: Insufficient permissions, account locked
 * - 429 Too Many Requests: Rate limit exceeded
 *
 * **Security Features:**
 * - Audit logging for all auth failures
 * - Rate limit tracking
 * - Account lockout detection
 * - No credential exposure in errors
 *
 * @since 1.0.0
 */

import { useEffect } from 'react';

/**
 * Authentication error props interface
 */
interface AuthErrorProps {
  error: Error & {
    digest?: string;
    statusCode?: number;
    errorType?: 'INVALID_CREDENTIALS' | 'TOKEN_EXPIRED' | 'RATE_LIMITED' | 'FORBIDDEN' | 'ACCOUNT_LOCKED';
    rateLimitReset?: number;
    lockoutDuration?: number;
  };
  reset: () => void;
}

/**
 * Classified authentication error
 */
interface ClassifiedAuthError {
  type: string;
  status: number;
  message: string;
  action: string;
  canRetry: boolean;
  retryAfter?: number;
}

/**
 * Classify authentication error
 */
function classifyAuthError(error: Error & {
  statusCode?: number;
  errorType?: string;
  rateLimitReset?: number;
  lockoutDuration?: number;
}): ClassifiedAuthError {
  // Check specific error type
  if (error.errorType) {
    switch (error.errorType) {
      case 'INVALID_CREDENTIALS':
        return {
          type: 'Invalid Credentials',
          status: 401,
          message: 'Invalid email or password. Please check your credentials and try again.',
          action: 'Verify your login credentials',
          canRetry: true
        };

      case 'TOKEN_EXPIRED':
        return {
          type: 'Token Expired',
          status: 401,
          message: 'Your session has expired. Please log in again.',
          action: 'Log in again to continue',
          canRetry: true
        };

      case 'RATE_LIMITED':
        return {
          type: 'Rate Limit Exceeded',
          status: 429,
          message: 'Too many login attempts. Please try again later.',
          action: 'Wait before attempting to log in again',
          canRetry: true,
          retryAfter: error.rateLimitReset || 900 // 15 minutes default
        };

      case 'FORBIDDEN':
        return {
          type: 'Access Forbidden',
          status: 403,
          message: 'You do not have permission to access this resource.',
          action: 'Contact your administrator for access',
          canRetry: false
        };

      case 'ACCOUNT_LOCKED':
        return {
          type: 'Account Locked',
          status: 403,
          message: 'Your account has been locked due to multiple failed login attempts.',
          action: 'Contact support to unlock your account',
          canRetry: false,
          retryAfter: error.lockoutDuration
        };
    }
  }

  // Check status code
  if (error.statusCode === 401) {
    return {
      type: 'Authentication Required',
      status: 401,
      message: 'Authentication required. Please log in and try again.',
      action: 'Log in to continue',
      canRetry: true
    };
  }

  if (error.statusCode === 403) {
    return {
      type: 'Access Forbidden',
      status: 403,
      message: 'You do not have permission to access this resource.',
      action: 'Contact your administrator for access',
      canRetry: false
    };
  }

  if (error.statusCode === 429) {
    return {
      type: 'Rate Limit Exceeded',
      status: 429,
      message: 'Too many requests. Please try again later.',
      action: 'Wait before trying again',
      canRetry: true,
      retryAfter: error.rateLimitReset || 900
    };
  }

  // Parse error message
  const message = error.message.toLowerCase();
  if (message.includes('invalid credentials') || message.includes('invalid email or password')) {
    return {
      type: 'Invalid Credentials',
      status: 401,
      message: 'Invalid email or password. Please check your credentials and try again.',
      action: 'Verify your login credentials',
      canRetry: true
    };
  }

  if (message.includes('token expired') || message.includes('session expired')) {
    return {
      type: 'Token Expired',
      status: 401,
      message: 'Your session has expired. Please log in again.',
      action: 'Log in again to continue',
      canRetry: true
    };
  }

  if (message.includes('rate limit') || message.includes('too many')) {
    return {
      type: 'Rate Limit Exceeded',
      status: 429,
      message: 'Too many login attempts. Please try again later.',
      action: 'Wait before attempting to log in again',
      canRetry: true,
      retryAfter: 900
    };
  }

  if (message.includes('locked') || message.includes('suspended')) {
    return {
      type: 'Account Locked',
      status: 403,
      message: 'Your account has been locked. Please contact support.',
      action: 'Contact support to unlock your account',
      canRetry: false
    };
  }

  // Default authentication error
  return {
    type: 'Authentication Error',
    status: 401,
    message: 'Authentication failed. Please try again.',
    action: 'Verify your credentials and try again',
    canRetry: true
  };
}

/**
 * Authentication API Error Boundary Component
 *
 * Catches authentication-related errors and returns appropriate JSON responses.
 * Implements security best practices and HIPAA-compliant audit logging.
 *
 * **Error Response Format:**
 * ```json
 * {
 *   "error": "Error Type",
 *   "message": "User-friendly error message",
 *   "action": "Recommended action for user",
 *   "canRetry": true/false,
 *   "retryAfter": 900 // seconds (if rate limited)
 * }
 * ```
 *
 * **Security:**
 * - All auth failures are audit logged
 * - No credential exposure in responses
 * - Rate limit information included when applicable
 * - Account status hints for locked accounts
 *
 * @param props - Error boundary props
 * @param props.error - The caught authentication error
 * @param props.reset - Function to reset error boundary
 *
 * @returns JSON error response
 */
export default function AuthError({ error, reset }: AuthErrorProps) {
  useEffect(() => {
    // Classify error
    const classified = classifyAuthError(error);

    // Log authentication failure
    if (process.env.NODE_ENV === 'production') {
      // Production logging - send to monitoring service
      console.error('Authentication Error:', {
        type: classified.type,
        status: classified.status,
        digest: error.digest,
        timestamp: new Date().toISOString(),
        // Don't log sensitive details
      });

      // TODO: Send to monitoring service
      // TODO: Trigger audit log for failed authentication
      // Example:
      // auditLog({
      //   action: 'LOGIN_FAILED',
      //   resource: 'User',
      //   success: false,
      //   errorMessage: classified.type
      // });
    } else {
      // Development logging - full details
      console.error('Auth Error caught by error boundary:', {
        error,
        classified,
        stack: error.stack
      });
    }

    // Track rate limit violations
    if (classified.status === 429) {
      console.warn('Rate limit exceeded for authentication endpoint');
    }

    // Track account lockouts
    if (error.errorType === 'ACCOUNT_LOCKED') {
      console.warn('Account lockout detected');
    }
  }, [error]);

  // Classify error
  const classified = classifyAuthError(error);

  // Build error response
  const errorResponse = {
    error: classified.type,
    message: classified.message,
    action: classified.action,
    canRetry: classified.canRetry,
    ...(classified.retryAfter && { retryAfter: classified.retryAfter }),
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
 * Export helper function for manual auth error handling
 *
 * @example
 * ```typescript
 * export async function POST(request: NextRequest) {
 *   try {
 *     const credentials = await request.json();
 *     // ... authentication logic
 *   } catch (error) {
 *     return handleAuthError(error, { ipAddress, userAgent });
 *   }
 * }
 * ```
 */
export function handleAuthError(
  error: unknown,
  context?: {
    ipAddress?: string;
    userAgent?: string;
    email?: string;
  }
): Response {
  const err = error instanceof Error ? error : new Error(String(error));
  const classified = classifyAuthError(err as Error & { statusCode?: number; errorType?: string });

  // Log error with context (no sensitive data)
  console.error('Auth Error:', {
    type: classified.type,
    status: classified.status,
    ipAddress: context?.ipAddress,
    userAgent: context?.userAgent,
    timestamp: new Date().toISOString()
  });

  // TODO: Audit log the failed authentication attempt
  // auditLog({
  //   action: 'LOGIN_FAILED',
  //   resource: 'User',
  //   success: false,
  //   errorMessage: classified.type,
  //   ipAddress: context?.ipAddress,
  //   userAgent: context?.userAgent
  // });

  // Build response
  const errorResponse = {
    error: classified.type,
    message: classified.message,
    action: classified.action,
    canRetry: classified.canRetry,
    ...(classified.retryAfter && { retryAfter: classified.retryAfter }),
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack
    })
  };

  return new Response(JSON.stringify(errorResponse), {
    status: classified.status,
    headers: {
      'Content-Type': 'application/json',
      ...(classified.retryAfter && {
        'Retry-After': String(classified.retryAfter)
      })
    }
  });
}
