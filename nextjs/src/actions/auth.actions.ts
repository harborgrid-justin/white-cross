/**
 * @fileoverview Server Actions for Authentication
 * @module actions/auth
 *
 * Next.js Server Actions for authentication operations.
 * Provides server-side authentication with built-in security and HIPAA audit logging.
 *
 * @example
 * ```typescript
 * 'use client';
 *
 * import { useFormState } from 'react-dom';
 * import { loginAction } from '@/actions/auth.actions';
 *
 * function LoginForm() {
 *   const [state, formAction] = useFormState(loginAction, { errors: {} });
 *   return <form action={formAction}>...</form>;
 * }
 * ```
 */

'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { auditLog, AUDIT_ACTIONS, extractIPAddress, extractUserAgent } from '@/lib/audit';
import { headers } from 'next/headers';
import type { ActionResult } from './students.actions';

const BACKEND_URL = process.env.API_BASE_URL || 'http://localhost:3001/api/v1';

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
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

const resetPasswordRequestSchema = z.object({
  email: z.string().email('Invalid email address'),
});

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Password confirmation is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// ==========================================
// TYPES
// ==========================================

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
 * Uses useFormState pattern for progressive enhancement
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
    const response = await fetch(`${BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Login failed' }));

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
        errorMessage: error.message || 'Invalid credentials'
      });

      return {
        errors: {
          _form: [error.message || 'Invalid credentials'],
        },
      };
    }

    const data = await response.json();
    const { token, refreshToken, user } = data;

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
 * Clears authentication cookies and redirects to login
 */
export async function logoutAction(): Promise<void> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    // Audit logout event (try to get user from token)
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

    const response = await fetch(`${BACKEND_URL}/auth/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        currentPassword,
        newPassword,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Password change failed' }));
      return {
        errors: {
          _form: [error.message || 'Failed to change password'],
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
  try {
    const validatedEmail = resetPasswordRequestSchema.parse({ email });

    const response = await fetch(`${BACKEND_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validatedEmail),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      return {
        success: false,
        error: error.message || 'Failed to request password reset',
      };
    }

    return {
      success: true,
      data: { message: 'Password reset email sent' },
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
 * Reset password with token
 */
export async function resetPasswordAction(
  token: string,
  password: string,
  confirmPassword: string
): Promise<ActionResult<{ message: string }>> {
  try {
    const validatedData = resetPasswordSchema.parse({
      token,
      password,
      confirmPassword,
    });

    const response = await fetch(`${BACKEND_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: validatedData.token,
        newPassword: validatedData.password,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Reset failed' }));
      return {
        success: false,
        error: error.message || 'Failed to reset password',
      };
    }

    return {
      success: true,
      data: { message: 'Password reset successfully' },
      message: 'Your password has been reset. You can now log in with your new password.',
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to reset password';
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Refresh authentication token
 */
export async function refreshTokenAction(): Promise<ActionResult<{ token: string }>> {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refresh_token')?.value;

    if (!refreshToken) {
      return {
        success: false,
        error: 'No refresh token available',
      };
    }

    const response = await fetch(`${BACKEND_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      // Clear invalid tokens
      cookieStore.delete('auth_token');
      cookieStore.delete('refresh_token');

      return {
        success: false,
        error: 'Failed to refresh token',
      };
    }

    const data = await response.json();
    const { token } = data;

    // Update auth token
    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    // Audit token refresh
    const headersList = await headers();
    const mockRequest = {
      headers: {
        get: (name: string) => headersList.get(name)
      }
    } as Request;

    await auditLog({
      action: AUDIT_ACTIONS.TOKEN_REFRESH,
      resource: 'Authentication',
      details: 'Token refreshed successfully',
      ipAddress: extractIPAddress(mockRequest),
      userAgent: extractUserAgent(mockRequest),
      success: true
    });

    return {
      success: true,
      data: { token },
      message: 'Token refreshed successfully',
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to refresh token';
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Verify current session
 */
export async function verifySessionAction(): Promise<ActionResult<{ valid: boolean; user?: any }>> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return {
        success: true,
        data: { valid: false },
      };
    }

    const response = await fetch(`${BACKEND_URL}/auth/verify`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return {
        success: true,
        data: { valid: false },
      };
    }

    const user = await response.json();

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
