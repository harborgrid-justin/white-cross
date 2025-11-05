/**
 * @fileoverview Authentication Login Operations
 * @module lib/actions/auth.login
 *
 * Server actions for login and authentication operations.
 *
 * Features:
 * - Login form validation and processing
 * - Session creation and cookie management
 * - HIPAA audit logging for login events
 * - Rate limiting (IP and email based)
 * - Input sanitization and CSRF protection
 * - Standardized error handling
 */

'use server';

import { revalidatePath } from 'next/cache';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';

// API integration
import { serverPost, NextApiClientError } from '@/lib/api/nextjs-client';
import { API_ENDPOINTS } from '@/constants/api';
import { auditLog, AUDIT_ACTIONS, extractIPAddress, extractUserAgent } from '@/lib/audit';

// Security helpers
import { checkRateLimit, RATE_LIMITS } from '../lib/helpers/rate-limit';
import { safeFormDataEmail, safeFormDataPassword } from '../lib/helpers/input-sanitization';
import {
  actionError,
  actionRateLimitError,
  actionValidationError,
  toLoginFormState
} from '../lib/helpers/action-result';
import { formatZodErrors } from '../lib/helpers/zod-errors';

// Cookie configuration
import {
  COOKIE_NAMES,
  getAccessTokenCookieOptions,
  getRefreshTokenCookieOptions
} from '@/identity-access/lib/config/cookies';

// Types and schemas
import type { AuthResponse, LoginFormState } from './auth.types';
import { AUTH_CACHE_TAGS, loginSchema } from './auth.constants';

// ==========================================
// LOGIN ACTIONS
// ==========================================

/**
 * Login action with comprehensive security features
 *
 * Security features:
 * - Rate limiting (IP-based: 5/15min, Email-based: 3/15min)
 * - Input sanitization
 * - Zod validation
 * - HIPAA audit logging
 * - Secure cookie management
 *
 * @param _prevState - Previous form state (unused, for useActionState)
 * @param formData - Form data containing email and password
 * @returns Standardized login form state
 */
export async function loginAction(
  _prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  // Extract IP address for rate limiting
  const headersList = await headers();
  const mockRequest = {
    headers: {
      get: (name: string) => headersList.get(name)
    }
  } as Request;
  const ipAddress = extractIPAddress(mockRequest);

  // Sanitize inputs before validation
  const email = safeFormDataEmail(formData, 'email');
  const password = safeFormDataPassword(formData, 'password');

  // Rate limiting: IP-based (prevents brute force from single IP)
  const ipRateLimit = checkRateLimit('login-ip', ipAddress, RATE_LIMITS.LOGIN_IP);
  if (ipRateLimit.limited) {
    // Audit rate limit violation
    await auditLog({
      userId: email || 'unknown',
      action: AUDIT_ACTIONS.LOGIN_FAILED,
      resource: 'Authentication',
      details: `Rate limit exceeded from IP ${ipAddress}`,
      ipAddress,
      userAgent: extractUserAgent(mockRequest),
      success: false,
      errorMessage: 'Rate limit exceeded'
    });

    return toLoginFormState(actionRateLimitError(ipRateLimit.resetIn!));
  }

  // Rate limiting: Email-based (prevents targeted attacks on specific accounts)
  if (email) {
    const emailRateLimit = checkRateLimit('login-email', email, RATE_LIMITS.LOGIN_EMAIL);
    if (emailRateLimit.limited) {
      // Audit rate limit violation
      await auditLog({
        userId: email,
        action: AUDIT_ACTIONS.LOGIN_FAILED,
        resource: 'Authentication',
        details: `Rate limit exceeded for email ${email}`,
        ipAddress,
        userAgent: extractUserAgent(mockRequest),
        success: false,
        errorMessage: 'Rate limit exceeded'
      });

      return toLoginFormState(actionRateLimitError(emailRateLimit.resetIn!));
    }
  }

  // Validate form data with Zod
  const validatedFields = loginSchema.safeParse({
    email,
    password,
  });

  if (!validatedFields.success) {
    return toLoginFormState(
      actionValidationError(formatZodErrors(validatedFields.error))
    );
  }

  try {
    const { email: validatedEmail, password: validatedPassword } = validatedFields.data;

    // Call backend authentication endpoint
    const wrappedResponse = await serverPost<any>(
      API_ENDPOINTS.AUTH.LOGIN,
      { email: validatedEmail, password: validatedPassword },
      {
        cache: 'no-store',
        requiresAuth: false,
        next: { tags: [AUTH_CACHE_TAGS.AUTH] }
      }
    );

    console.log('[Login Action] Response received:', {
      hasResponse: !!wrappedResponse,
      hasData: !!wrappedResponse?.data,
      responseKeys: wrappedResponse ? Object.keys(wrappedResponse) : [],
    });

    // Backend wraps response in ApiResponse format - extract data
    const response: AuthResponse = wrappedResponse?.data || wrappedResponse;

    console.log('[Login Action] Extracted auth data:', {
      hasAccessToken: !!response?.accessToken,
      hasRefreshToken: !!response?.refreshToken,
      hasUser: !!response?.user,
    });

    // Check if we have valid authentication data
    if (!response || !response.accessToken) {
      // Audit failed login attempt
      await auditLog({
        userId: validatedEmail,
        action: AUDIT_ACTIONS.LOGIN_FAILED,
        resource: 'Authentication',
        details: `Failed login attempt for ${validatedEmail}`,
        ipAddress,
        userAgent: extractUserAgent(mockRequest),
        success: false,
        errorMessage: 'Invalid credentials'
      });

      return toLoginFormState(
        actionError(['Invalid credentials'])
      );
    }

    // Extract data from successful response
    const { accessToken: token, refreshToken, user } = response;

    // Set HTTP-only cookies using centralized configuration
    const cookieStore = await cookies();

    console.log('[Login Action] Setting auth token:', {
      tokenLength: token?.length,
      tokenStart: token?.substring(0, 20),
      cookieName: COOKIE_NAMES.ACCESS_TOKEN
    });

    // Use centralized cookie configuration for consistent, secure settings
    cookieStore.set(
      COOKIE_NAMES.ACCESS_TOKEN,
      token,
      getAccessTokenCookieOptions()
    );

    console.log('[Login Action] Auth token cookie set, verifying:', {
      cookieExists: !!cookieStore.get(COOKIE_NAMES.ACCESS_TOKEN),
      cookieValue: cookieStore.get(COOKIE_NAMES.ACCESS_TOKEN)?.value?.substring(0, 20)
    });

    if (refreshToken) {
      cookieStore.set(
        COOKIE_NAMES.REFRESH_TOKEN,
        refreshToken,
        getRefreshTokenCookieOptions()
      );
    }

    // Audit successful login
    await auditLog({
      userId: user.id,
      action: AUDIT_ACTIONS.LOGIN,
      resource: 'Authentication',
      details: `User ${validatedEmail} logged in successfully`,
      ipAddress,
      userAgent: extractUserAgent(mockRequest),
      success: true
    });

    return { success: true };
  } catch (error) {
    console.error('[Login Action] Error:', error);

    // Handle NextApiClientError with more specific messaging
    if (error instanceof NextApiClientError) {
      const errorMessage = error.message || 'Authentication failed. Please check your credentials.';

      // Audit API error
      await auditLog({
        userId: email || 'unknown',
        action: AUDIT_ACTIONS.LOGIN_FAILED,
        resource: 'Authentication',
        details: `Login error: ${errorMessage}`,
        ipAddress,
        userAgent: extractUserAgent(mockRequest),
        success: false,
        errorMessage
      });

      return toLoginFormState(actionError([errorMessage]));
    }

    // Audit unexpected error
    await auditLog({
      userId: email || 'unknown',
      action: AUDIT_ACTIONS.LOGIN_FAILED,
      resource: 'Authentication',
      details: 'Unexpected error during login',
      ipAddress,
      userAgent: extractUserAgent(mockRequest),
      success: false,
      errorMessage: error instanceof Error ? error.message : 'Unknown error'
    });

    return toLoginFormState(
      actionError(['An unexpected error occurred. Please try again.'])
    );
  }
}

/**
 * Handle login form submission from login page
 *
 * Delegates to centralized loginAction and handles redirect.
 * This is the action that should be used in login forms.
 *
 * @param prevState - Previous form state
 * @param formData - Form data containing credentials
 * @returns Login form state or redirects to dashboard
 */
export async function handleLoginSubmission(
  prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const result = await loginAction(prevState, formData);

  if (result.success) {
    // Successful login - revalidate and redirect to dashboard
    revalidatePath('/dashboard', 'page');
    redirect('/dashboard');
  }

  return result;
}

/**
 * Clear login form state
 *
 * Utility action for resetting form state.
 *
 * @returns Empty form state
 */
export async function clearLoginForm(): Promise<LoginFormState> {
  return {
    success: false,
    errors: undefined
  };
}
