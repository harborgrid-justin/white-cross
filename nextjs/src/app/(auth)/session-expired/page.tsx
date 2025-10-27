'use client';

/**
 * @fileoverview Session Expired Page - Session Timeout and Token Expiration Handler
 *
 * This page is displayed when a user's authentication session expires or becomes invalid.
 * It handles various session expiration scenarios including HIPAA-mandated inactivity timeouts,
 * JWT token expiration, and token refresh failures. The page provides clear messaging about
 * why the session ended and automatically redirects users back to the login page.
 *
 * @module app/(auth)/session-expired/page
 * @category Authentication
 * @subcategory Session Management
 *
 * @route /session-expired - Session timeout notification page
 * @route /session-expired?reason=idle - Inactivity timeout (15 min)
 * @route /session-expired?reason=token - JWT token expiration
 * @route /session-expired?reason=refresh_failed - Token refresh failure
 * @route /session-expired?redirect=/path - Custom redirect after re-login
 *
 * @requires react
 * @requires next/navigation
 *
 * @security
 * - Forces re-authentication after session expiration
 * - Clears all authentication state before showing this page
 * - No PHI data accessible or displayed after session ends
 * - Automatic redirect prevents indefinite session expiry state
 * - Secure token cleanup handled before navigation to this page
 *
 * @compliance HIPAA
 * - Enforces 15-minute inactivity timeout per HIPAA Security Rule
 * - Complies with § 164.312(a)(2)(iii) - Automatic Logoff
 * - Session termination logged in audit trail (server-side)
 * - PHI access immediately blocked on session expiration
 * - User must re-authenticate to access any healthcare data
 *
 * @example
 * ```tsx
 * // Redirect to session expired page from middleware
 * // middleware.ts:
 * if (isTokenExpired(accessToken)) {
 *   return NextResponse.redirect('/session-expired?reason=token');
 * }
 *
 * // From idle timeout detection
 * if (idleTime > 15 * 60 * 1000) { // 15 minutes
 *   router.push('/session-expired?reason=idle');
 * }
 *
 * // From failed token refresh
 * catch (error) {
 *   router.push('/session-expired?reason=refresh_failed');
 * }
 * ```
 *
 * @see {@link https://www.hhs.gov/hipaa/for-professionals/security/laws-regulations/index.html | HIPAA Security Rule}
 * @see {@link useRouter} for navigation after timeout
 *
 * @since 1.0.0
 */

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

/**
 * Session expiration reason types
 *
 * Defines the possible reasons for session expiration that affect the displayed
 * message and icon. Each reason maps to a specific security or timeout scenario.
 *
 * @typedef {'idle' | 'token' | 'refresh_failed' | 'unknown'} SessionExpirationReason
 *
 * @property {string} idle - 15-minute inactivity timeout (HIPAA requirement)
 * @property {string} token - JWT access token expired (15 min lifetime)
 * @property {string} refresh_failed - Refresh token invalid or expired
 * @property {string} unknown - Generic session expiration (fallback)
 */

/**
 * Message configuration for session expiration reasons
 *
 * @interface ExpirationMessage
 * @property {string} title - Main heading displayed to user
 * @property {string} description - Detailed explanation of why session expired
 * @property {JSX.Element} icon - SVG icon representing the expiration reason
 */

/**
 * Session Expired Page Component
 *
 * Displays a user-friendly explanation of why their session expired and provides
 * automatic redirect to login with countdown timer. The page adapts its messaging
 * based on the expiration reason (idle timeout, token expiration, or refresh failure).
 *
 * **Session Management Flow:**
 * 1. Session expires due to timeout, token expiration, or refresh failure
 * 2. AuthContext or middleware detects expiration
 * 3. User redirected to /session-expired?reason=<type>
 * 4. Page displays reason-specific message with countdown
 * 5. After 10 seconds, automatic redirect to login page
 * 6. User can also click "Sign In Now" for immediate redirect
 *
 * **Expiration Scenarios:**
 *
 * **Idle Timeout (HIPAA-mandated):**
 * - Triggered after 15 minutes of user inactivity
 * - Implemented for HIPAA Security Rule § 164.312(a)(2)(iii)
 * - Protects PHI from unauthorized access on unattended workstations
 * - Displays yellow warning icon with security tips
 *
 * **Token Expiration:**
 * - JWT access tokens expire after 15 minutes
 * - Requires user to re-authenticate for new token
 * - Refresh token may be valid but access token needs renewal
 * - Displays red lock icon indicating authentication required
 *
 * **Refresh Failed:**
 * - Refresh token is invalid, expired, or revoked
 * - Backend unable to issue new access token
 * - May indicate token tampering or server-side revocation
 * - Displays orange alert icon indicating system issue
 *
 * @returns {JSX.Element} The session expired page with countdown and navigation options
 *
 * @example
 * ```tsx
 * // This page is rendered when sessions expire
 * <SessionExpiredPage />
 * ```
 *
 * @example
 * ```tsx
 * // Example idle timeout detection:
 * // AuthContext.tsx or middleware.ts
 * const lastActivity = getLastActivityTime();
 * const now = Date.now();
 * const idleTime = now - lastActivity;
 *
 * if (idleTime > 15 * 60 * 1000) { // 15 minutes in milliseconds
 *   clearAuthTokens(); // Remove JWT tokens
 *   clearUserState(); // Clear user from context
 *   router.push('/session-expired?reason=idle&redirect=/dashboard');
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Example token expiration handling:
 * // api/authInterceptor.ts
 * if (response.status === 401 && error.code === 'TOKEN_EXPIRED') {
 *   // Attempt refresh
 *   try {
 *     await refreshAccessToken();
 *   } catch (refreshError) {
 *     // Refresh failed - redirect to session expired
 *     router.push('/session-expired?reason=refresh_failed');
 *   }
 * }
 * ```
 *
 * @remarks
 * This is a Next.js Client Component ('use client') because it:
 * - Uses useState for countdown timer
 * - Uses useEffect for timer logic and auto-redirect
 * - Accesses URL search parameters dynamically
 * - Implements client-side navigation
 *
 * **Countdown Timer:**
 * The 10-second countdown provides:
 * - Time for users to read the explanation
 * - Visible feedback of impending redirect
 * - Option to act immediately (click "Sign In Now")
 * - Accessibility via aria-live for screen readers
 *
 * **HIPAA Compliance Notes:**
 * - 15-minute idle timeout is conservative (HIPAA doesn't specify exact time)
 * - Healthcare organizations may adjust based on risk assessment
 * - Timeout should balance security with workflow efficiency
 * - All session terminations logged in server-side audit logs
 *
 * @see {@link useRouter} - Next.js router for navigation
 * @see {@link useSearchParams} - Access to URL query parameters
 */
export default function SessionExpiredPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [countdown, setCountdown] = useState(10);

  // Get session expiry reason from query params
  const reason = searchParams.get('reason') || 'unknown';
  const redirectTo = searchParams.get('redirect') || '/login';

  // Auto-redirect countdown
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      router.push(redirectTo);
    }
  }, [countdown, router, redirectTo]);

  /**
   * Determines the appropriate message, title, and icon based on session expiration reason
   *
   * This function maps the session expiration reason (from URL query parameter) to
   * user-friendly messaging that explains what happened and why. Each reason type gets
   * a distinct title, description, and colored icon to provide clear visual feedback.
   *
   * **Reason Types:**
   *
   * **'idle'** - 15-minute inactivity timeout
   * - Yellow clock icon (warning but not error)
   * - Emphasizes HIPAA compliance and security
   * - Includes security tip about logging out
   * - Most common scenario in healthcare settings
   *
   * **'token'** - JWT access token expired
   * - Red lock icon (authentication required)
   * - Generic expiration message
   * - Indicates normal token lifecycle (15 min access tokens)
   * - May occur during active use if token not refreshed
   *
   * **'refresh_failed'** - Unable to refresh session
   * - Orange alert icon (system/network issue)
   * - Indicates backend problem or invalid refresh token
   * - May suggest token tampering or server-side revocation
   * - Less common, requires user to fully re-authenticate
   *
   * **'unknown' or default** - Generic session end
   * - Gray info icon (neutral information)
   * - Fallback for unspecified reasons
   * - Used when no reason parameter provided
   *
   * @returns {ExpirationMessage} Object containing title, description, and icon JSX
   *
   * @example
   * ```tsx
   * // URL: /session-expired?reason=idle
   * const { title, description, icon } = getMessage();
   * // Returns:
   * // {
   * //   title: 'Session Expired Due to Inactivity',
   * //   description: 'For your security and HIPAA compliance...',
   * //   icon: <svg className="text-yellow-500">...</svg>
   * // }
   * ```
   *
   * @example
   * ```tsx
   * // URL: /session-expired?reason=token
   * const { title, description, icon } = getMessage();
   * // Returns:
   * // {
   * //   title: 'Session Expired',
   * //   description: 'Your authentication token has expired...',
   * //   icon: <svg className="text-red-500">...</svg>
   * // }
   * ```
   *
   * @remarks
   * The function is called once during component render and its return value
   * is destructured immediately. The icon JSX includes aria-hidden="true" since
   * the title and description provide sufficient context for screen readers.
   *
   * **Color Coding Strategy:**
   * - Yellow (idle): Warning, security-related but expected behavior
   * - Red (token): Error, authentication required to proceed
   * - Orange (refresh_failed): Alert, unexpected system/network issue
   * - Gray (unknown): Neutral, generic information
   *
   * **HIPAA Considerations:**
   * The 'idle' message specifically mentions HIPAA compliance to educate users
   * about why automatic logout exists, promoting security awareness in healthcare
   * environments.
   *
   * @see {@link ExpirationMessage} for return type definition
   */
  const getMessage = () => {
    switch (reason) {
      case 'idle':
        return {
          title: 'Session Expired Due to Inactivity',
          description: 'For your security and HIPAA compliance, your session has been automatically logged out after 15 minutes of inactivity.',
          icon: (
            <svg className="w-16 h-16 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
        };
      case 'token':
        return {
          title: 'Session Expired',
          description: 'Your authentication token has expired. Please log in again to continue.',
          icon: (
            <svg className="w-16 h-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          ),
        };
      case 'refresh_failed':
        return {
          title: 'Session Refresh Failed',
          description: 'We were unable to refresh your session. Please log in again.',
          icon: (
            <svg className="w-16 h-16 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          ),
        };
      default:
        return {
          title: 'Session Expired',
          description: 'Your session has ended. Please log in again to continue.',
          icon: (
            <svg className="w-16 h-16 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
        };
    }
  };

  const { title, description, icon } = getMessage();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white shadow-lg rounded-lg p-8">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            {icon}
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-4">
            {title}
          </h1>

          {/* Description */}
          <p className="text-gray-600 text-center mb-6">
            {description}
          </p>

          {/* Security Notice for Idle Timeout */}
          {reason === 'idle' && (
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6" role="note">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    <strong>Security Tip:</strong> Always log out when you're done to protect patient health information (PHI).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Countdown */}
          <div className="text-center mb-6">
            <p className="text-sm text-gray-500">
              Redirecting to login in{' '}
              <span className="font-bold text-blue-600" aria-live="polite">
                {countdown}
              </span>{' '}
              {countdown === 1 ? 'second' : 'seconds'}...
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Link
              href={redirectTo}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign In Now
            </Link>

            <button
              onClick={() => router.back()}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              type="button"
            >
              Go Back
            </button>
          </div>

          {/* Help */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Having trouble? Contact your system administrator for assistance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
