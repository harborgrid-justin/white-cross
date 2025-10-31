/**
 * @fileoverview Login Page Server Actions - Next.js v14+ Compatible
 * @module app/login/actions
 *
 * Server actions specifically for the login page, delegating to auth actions.
 * This provides a clean separation between authentication logic and page-specific actions.
 *
 * Features:
 * - Server actions with proper 'use server' directive
 * - Delegates to centralized auth actions
 * - Form handling for login page
 * - HIPAA audit logging through auth actions
 */

'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { loginAction, type LoginFormState } from '@/app/auth/actions';

// ==========================================
// LOGIN PAGE ACTIONS
// ==========================================

/**
 * Handle login form submission from login page
 * Delegates to centralized loginAction and handles redirect
 */
export async function handleLoginSubmission(
  prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const result = await loginAction(prevState, formData);
  
  if (result.success) {
    // Successful login - redirect to dashboard
    revalidatePath('/dashboard', 'page');
    redirect('/dashboard');
  }
  
  return result;
}

/**
 * Clear login form state
 */
export async function clearLoginForm(): Promise<LoginFormState> {
  return {
    success: false,
    errors: undefined
  };
}
