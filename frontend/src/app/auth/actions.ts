/**
 * @fileoverview Authentication Server Actions - Next.js v14+ Compatible
 * @module app/auth/actions
 *
 * HIPAA-compliant server actions for authentication with comprehensive
 * caching, audit logging, and error handling.
 *
 * Features:
 * - Server actions with proper 'use server' directive
 * - Next.js cache integration with revalidateTag/revalidatePath
 * - HIPAA audit logging for all authentication events
 * - Type-safe operations
 * - Form data handling for UI integration
 * - Comprehensive error handling and validation
 * - Session management and token handling
 */

'use server';

import { cache } from 'react';
import { revalidateTag, revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { z } from 'zod';

// Core API integrations
import { serverGet, serverPost, serverPut, serverDelete, NextApiClientError } from '@/lib/api/nextjs-client';
import { API_ENDPOINTS } from '@/constants/api';
import { auditLog, AUDIT_ACTIONS, extractIPAddress, extractUserAgent } from '@/lib/audit';
import { CACHE_TAGS, CACHE_TTL } from '@/lib/cache/constants';

// Types
import type { ApiResponse } from '@/types/api';

// Utils
import { formatDate } from '@/utils/dateUtils';
import { validateEmail, validatePhone } from '@/utils/validation/userValidation';
import { generateId } from '@/utils/generators';
import { formatName, formatPhone } from '@/utils/formatters';

// ==========================================
// VALIDATION SCHEMAS
// ==========================================

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Password confirmation is required'),
}).refine((data: { currentPassword: string; newPassword: string; confirmPassword: string }) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// ==========================================
// CACHE TAGS EXTENSION
// ==========================================

/**
 * Additional cache tags for authentication (extends CACHE_TAGS)
 */
const AUTH_CACHE_TAGS = {
  AUTH: 'auth-data',
} as const;

// ==========================================
// TYPES
// ==========================================

export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  [key: string]: any;
}

export interface AuthResponse {
  token: string;
  refreshToken?: string;
  user: User;
}

export interface LoginFormState {
  errors?: {
    email?: string[];
    password?: string[];
    _form?: string[];
  };
  success?: boolean;
}

export interface ChangePasswordFormState {
  errors?: {
    currentPassword?: string[];
    newPassword?: string[];
    confirmPassword?: string[];
    _form?: string[];
  };
  success?: boolean;
  message?: string;
}

// ==========================================
// AUTHENTICATION ACTIONS
// ==========================================

/**
 * Login action with form validation
 */
export async function loginAction(
  prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  // Validate form data
  const validatedFields = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const { email, password } = validatedFields.data;

    // Call backend authentication endpoint
    const response = await serverPost<ApiResponse<AuthResponse>>(
      API_ENDPOINTS.AUTH.LOGIN,
      { email, password },
      {
        cache: 'no-store',
        next: { tags: [AUTH_CACHE_TAGS.AUTH] }
      }
    );

    if (!response.success || !response.data) {
      // Audit failed login attempt
      const headersList = await headers();
      const mockRequest = {
        headers: {
          get: (name: string) => headersList.get(name)
        }
      } as Request;

      await auditLog({
        userId: email,
        action: AUDIT_ACTIONS.LOGIN_FAILED,
        resource: 'Authentication',
        details: `Failed login attempt for ${email}`,
        ipAddress: extractIPAddress(mockRequest),
        userAgent: extractUserAgent(mockRequest),
        success: false,
        errorMessage: response.message || 'Invalid credentials'
      });

      return {
        errors: {
          _form: [response.message || 'Invalid credentials'],
        },
      };
    }

    // Extract data from successful response
    const { token, refreshToken, user } = response.data;

    // Set HTTP-only cookies
    const cookieStore = await cookies();

    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    if (refreshToken) {
      cookieStore.set('refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      });
    }

    // Audit successful login
    const headersList = await headers();
    const mockRequest = {
      headers: {
        get: (name: string) => headersList.get(name)
      }
    } as Request;

    await auditLog({
      userId: user.id,
      action: AUDIT_ACTIONS.LOGIN,
      resource: 'Authentication',
      details: `User ${email} logged in successfully`,
      ipAddress: extractIPAddress(mockRequest),
      userAgent: extractUserAgent(mockRequest),
      success: true
    });

    return { success: true };
  } catch (error) {
    console.error('[Login Action] Error:', error);
    return {
      errors: {
        _form: ['An unexpected error occurred. Please try again.'],
      },
    };
  }
}

/**
 * Logout action
 */
export async function logoutAction(): Promise<void> {
  'use server';
  
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    // Audit logout event
    if (token) {
      const headersList = await headers();
      const mockRequest = {
        headers: {
          get: (name: string) => headersList.get(name)
        }
      } as Request;

      await auditLog({
        action: AUDIT_ACTIONS.LOGOUT,
        resource: 'Authentication',
        details: 'User logged out',
        ipAddress: extractIPAddress(mockRequest),
        userAgent: extractUserAgent(mockRequest),
        success: true
      });
    }

    // Clear cookies
    cookieStore.delete('auth_token');
    cookieStore.delete('refresh_token');
  } catch (error) {
    console.error('[Logout Action] Error:', error);
  }

  // Always redirect to login
  redirect('/login');
}

/**
 * Change password action
 */
export async function changePasswordAction(
  prevState: ChangePasswordFormState,
  formData: FormData
): Promise<ChangePasswordFormState> {
  'use server';
  
  // Validate form data
  const validatedFields = changePasswordSchema.safeParse({
    currentPassword: formData.get('currentPassword'),
    newPassword: formData.get('newPassword'),
    confirmPassword: formData.get('confirmPassword'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return {
        errors: {
          _form: ['You must be logged in to change your password'],
        },
      };
    }

    const { currentPassword, newPassword } = validatedFields.data;

    const response = await serverPost<ApiResponse<void>>(
      API_ENDPOINTS.AUTH.CHANGE_PASSWORD,
      { currentPassword, newPassword },
      {
        cache: 'no-store',
        next: { tags: [AUTH_CACHE_TAGS.AUTH] },
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );

    if (!response.success) {
      return {
        errors: {
          _form: [response.message || 'Failed to change password'],
        },
      };
    }

    // Audit password change
    const headersList = await headers();
    const mockRequest = {
      headers: {
        get: (name: string) => headersList.get(name)
      }
    } as Request;

    await auditLog({
      action: AUDIT_ACTIONS.PASSWORD_CHANGE,
      resource: 'Authentication',
      details: 'Password changed successfully',
      ipAddress: extractIPAddress(mockRequest),
      userAgent: extractUserAgent(mockRequest),
      success: true
    });

    return {
      success: true,
      message: 'Password changed successfully',
    };
  } catch (error) {
    console.error('[Change Password Action] Error:', error);
    return {
      errors: {
        _form: ['An unexpected error occurred. Please try again.'],
      },
    };
  }
}

/**
 * Request password reset
 */
export async function requestPasswordResetAction(
  email: string
): Promise<ActionResult<{ message: string }>> {
  'use server';
  
  try {
    const validatedEmail = z.object({
      email: z.string().email('Invalid email address')
    }).parse({ email });

    const response = await serverPost<ApiResponse<{ message: string }>>(
      API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
      validatedEmail,
      {
        cache: 'no-store',
        next: { tags: [AUTH_CACHE_TAGS.AUTH] }
      }
    );

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.message || 'Failed to request password reset',
      };
    }

    return {
      success: true,
      data: response.data,
      message: 'If an account exists with that email, you will receive password reset instructions.',
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to request password reset';
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Verify current session
 */
export async function verifySessionAction(): Promise<ActionResult<{ valid: boolean; user?: User }>> {
  'use server';
  
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return {
        success: true,
        data: { valid: false },
      };
    }

    const response = await serverPost<ApiResponse<User>>(
      API_ENDPOINTS.AUTH.VERIFY,
      {},
      {
        cache: 'no-store',
        next: { tags: [AUTH_CACHE_TAGS.AUTH] },
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );

    if (!response.success || !response.data) {
      return {
        success: true,
        data: { valid: false },
      };
    }

    const user = response.data;

    return {
      success: true,
      data: { valid: true, user },
    };
  } catch (error) {
    return {
      success: true,
      data: { valid: false },
    };
  }
}
