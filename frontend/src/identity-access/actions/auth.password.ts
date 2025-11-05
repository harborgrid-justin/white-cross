/**
 * @fileoverview Password Management Operations
 * @module lib/actions/auth.password
 *
 * Server actions for password change and reset operations.
 *
 * Features:
 * - Password change validation and processing
 * - Password reset request handling
 * - HIPAA audit logging for password events
 * - Rate limiting for brute force protection
 * - Input sanitization
 * - Path revalidation after mutations
 * - Standardized error handling
 */

'use server';

import { cookies, headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// API integration
import { serverPost } from '@/lib/api/nextjs-client';
import { API_ENDPOINTS } from '@/constants/api';
import { auditLog, AUDIT_ACTIONS, extractIPAddress, extractUserAgent } from '@/lib/audit';

// Security helpers
import { checkRateLimit, RATE_LIMITS } from '../lib/helpers/rate-limit';
import { safeFormDataPassword, sanitizeEmail } from '../lib/helpers/input-sanitization';
import {
  actionError,
  actionRateLimitError,
  actionValidationError,
  actionUnauthorized,
  toChangePasswordFormState,
  actionSuccess
} from '../lib/helpers/action-result';
import { formatZodErrors } from '../lib/helpers/zod-errors';

// Types
import type { ApiResponse } from '@/types';
import type { ChangePasswordFormState } from './auth.types';
import type { ServerActionResult } from '../lib/types/action-result';
import { AUTH_CACHE_TAGS, changePasswordSchema } from './auth.constants';

// ==========================================
// PASSWORD MANAGEMENT ACTIONS
// ==========================================

/**
 * Change password action with security enhancements
 *
 * Security features:
 * - Rate limiting (5 attempts per hour per user)
 * - Input sanitization
 * - Zod validation
 * - HIPAA audit logging
 * - Path revalidation
 *
 * @param _prevState - Previous form state
 * @param formData - Form data containing passwords
 * @returns Standardized change password form state
 */
export async function changePasswordAction(
  _prevState: ChangePasswordFormState,
  formData: FormData
): Promise<ChangePasswordFormState> {
  // Get user session
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    return toChangePasswordFormState(actionUnauthorized('You must be logged in to change your password'));
  }

  // Extract IP address for rate limiting and audit logging
  const headersList = await headers();
  const mockRequest = {
    headers: {
      get: (name: string) => headersList.get(name)
    }
  } as Request;
  const ipAddress = extractIPAddress(mockRequest);
  const userAgent = extractUserAgent(mockRequest);

  // Rate limiting: Prevent password change brute force
  const rateLimit = checkRateLimit('password-change', token, RATE_LIMITS.PASSWORD_CHANGE);
  if (rateLimit.limited) {
    // Audit rate limit violation
    await auditLog({
      action: AUDIT_ACTIONS.PASSWORD_CHANGE,
      resource: 'Authentication',
      details: `Password change rate limit exceeded`,
      ipAddress,
      userAgent,
      success: false,
      errorMessage: 'Rate limit exceeded'
    });

    return toChangePasswordFormState(actionRateLimitError(rateLimit.resetIn!));
  }

  // Sanitize inputs
  const currentPassword = safeFormDataPassword(formData, 'currentPassword');
  const newPassword = safeFormDataPassword(formData, 'newPassword');
  const confirmPassword = safeFormDataPassword(formData, 'confirmPassword');

  // Validate form data
  const validatedFields = changePasswordSchema.safeParse({
    currentPassword,
    newPassword,
    confirmPassword,
  });

  if (!validatedFields.success) {
    return toChangePasswordFormState(
      actionValidationError(formatZodErrors(validatedFields.error))
    );
  }

  try {
    const { currentPassword: validatedCurrent, newPassword: validatedNew } = validatedFields.data;

    const response = await serverPost<ApiResponse<void>>(
      API_ENDPOINTS.AUTH.CHANGE_PASSWORD,
      { currentPassword: validatedCurrent, newPassword: validatedNew },
      {
        cache: 'no-store',
        next: { tags: [AUTH_CACHE_TAGS.AUTH] },
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );

    if (!response.success) {
      // Audit failed password change
      await auditLog({
        action: AUDIT_ACTIONS.PASSWORD_CHANGE,
        resource: 'Authentication',
        details: 'Password change failed: ' + (response.message || 'Unknown error'),
        ipAddress,
        userAgent,
        success: false,
        errorMessage: response.message
      });

      return toChangePasswordFormState(
        actionError([response.message || 'Failed to change password'])
      );
    }

    // Audit successful password change
    await auditLog({
      action: AUDIT_ACTIONS.PASSWORD_CHANGE,
      resource: 'Authentication',
      details: 'Password changed successfully',
      ipAddress,
      userAgent,
      success: true
    });

    // Revalidate affected paths
    revalidatePath('/profile');
    revalidatePath('/settings');

    return toChangePasswordFormState(
      actionSuccess(undefined, 'Password changed successfully')
    );
  } catch (error) {
    console.error('[Change Password Action] Error:', error);

    // Audit unexpected error
    await auditLog({
      action: AUDIT_ACTIONS.PASSWORD_CHANGE,
      resource: 'Authentication',
      details: 'Unexpected error during password change',
      ipAddress,
      userAgent,
      success: false,
      errorMessage: error instanceof Error ? error.message : 'Unknown error'
    });

    return toChangePasswordFormState(
      actionError(['An unexpected error occurred. Please try again.'])
    );
  }
}

/**
 * Request password reset with security enhancements
 *
 * Security features:
 * - Rate limiting (3 attempts per hour per email)
 * - Input sanitization and validation
 * - HIPAA audit logging
 * - Always returns success to prevent email enumeration
 *
 * @param email - Email address for password reset
 * @returns Standardized action result
 */
export async function requestPasswordResetAction(
  email: string
): Promise<ServerActionResult<{ message: string }>> {
  // Sanitize email
  const sanitizedEmail = sanitizeEmail(email);

  // Extract IP address for rate limiting and audit logging
  const headersList = await headers();
  const mockRequest = {
    headers: {
      get: (name: string) => headersList.get(name)
    }
  } as Request;
  const ipAddress = extractIPAddress(mockRequest);
  const userAgent = extractUserAgent(mockRequest);

  // Rate limiting: Prevent password reset abuse
  const rateLimit = checkRateLimit('password-reset', sanitizedEmail, RATE_LIMITS.PASSWORD_RESET);
  if (rateLimit.limited) {
    // Audit rate limit violation
    await auditLog({
      userId: sanitizedEmail,
      action: AUDIT_ACTIONS.PASSWORD_CHANGE,
      resource: 'Authentication',
      details: `Password reset rate limit exceeded for ${sanitizedEmail}`,
      ipAddress,
      userAgent,
      success: false,
      errorMessage: 'Rate limit exceeded'
    });

    return actionRateLimitError(rateLimit.resetIn!);
  }

  try {
    // Validate email
    const validatedEmail = z.object({
      email: z.string().email('Invalid email address')
    }).parse({ email: sanitizedEmail });

    const response = await serverPost<ApiResponse<{ message: string }>>(
      API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
      validatedEmail,
      {
        cache: 'no-store',
        requiresAuth: false,
        next: { tags: [AUTH_CACHE_TAGS.AUTH] }
      }
    );

    // Audit password reset request
    await auditLog({
      userId: sanitizedEmail,
      action: AUDIT_ACTIONS.PASSWORD_CHANGE,
      resource: 'Authentication',
      details: `Password reset requested for ${sanitizedEmail}`,
      ipAddress,
      userAgent,
      success: response.success
    });

    // Always return success message to prevent email enumeration
    // (Don't reveal whether account exists)
    return actionSuccess(
      { message: 'If an account exists with that email, you will receive password reset instructions.' },
      'If an account exists with that email, you will receive password reset instructions.'
    );
  } catch (error) {
    // Audit error
    await auditLog({
      userId: sanitizedEmail,
      action: AUDIT_ACTIONS.PASSWORD_CHANGE,
      resource: 'Authentication',
      details: `Password reset request error for ${sanitizedEmail}`,
      ipAddress,
      userAgent,
      success: false,
      errorMessage: error instanceof Error ? error.message : 'Unknown error'
    });

    // Still return success to prevent email enumeration
    return actionSuccess(
      { message: 'If an account exists with that email, you will receive password reset instructions.' },
      'If an account exists with that email, you will receive password reset instructions.'
    );
  }
}
