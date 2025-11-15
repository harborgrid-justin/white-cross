/**
 * @fileoverview Security Settings Actions
 * @module lib/actions/settings.security
 *
 * Server actions for security-related operations including password changes
 * and multi-factor authentication (MFA) setup.
 *
 * @example
 * ```typescript
 * 'use client';
 *
 * import { useActionState } from 'react';
 * import { changePasswordAction } from '@/lib/actions/settings.security';
 *
 * function SecurityForm() {
 *   const [state, formAction, isPending] = useActionState(changePasswordAction, { errors: {} });
 *   return <form action={formAction}>...</form>;
 * }
 * ```
 */

'use server';

import { type ZodIssue } from 'zod';
import type { ActionResult } from './settings.types';
import {
  getAuthUser,
  createAuditContext,
  verifyCurrentPassword
} from './settings.utils';
import { API_ENDPOINTS } from '@/constants/api';
import { serverPost } from '@/lib/api/nextjs-client';
import {
  changePasswordSchema,
} from '@/schemas/settings.schemas';
import {
  auditLog,
  AUDIT_ACTIONS,
} from '@/lib/audit';

/**
 * Change password
 * Handles password change with current password verification
 * Requires matching new password and confirmation
 * @param prevState - Previous form state
 * @param formData - Form data containing current and new passwords
 * @returns Action result with success status and any errors
 */
export async function changePasswordAction(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const auditContext = await createAuditContext();

  try {
    const user = await getAuthUser();
    if (!user) {
      return {
        errors: {
          _form: ['Authentication required']
        }
      };
    }

    const currentPassword = formData.get('currentPassword')?.toString();
    const newPassword = formData.get('newPassword')?.toString();
    const confirmPassword = formData.get('confirmPassword')?.toString();

    if (!currentPassword || !newPassword || !confirmPassword) {
      return {
        errors: {
          _form: ['All password fields are required']
        }
      };
    }

    const validation = changePasswordSchema.safeParse({
      currentPassword,
      newPassword,
      confirmPassword,
    });

    if (!validation.success) {
      const fieldErrors: Record<string, string[]> = {};
      validation.error.issues.forEach((err: ZodIssue) => {
        const path = err.path.join('.');
        if (!fieldErrors[path]) {
          fieldErrors[path] = [];
        }
        fieldErrors[path].push(err.message);
      });

      return {
        errors: fieldErrors
      };
    }

    // Verify current password
    const passwordValid = await verifyCurrentPassword(user.id, currentPassword);
    if (!passwordValid) {
      return {
        errors: {
          _form: ['Current password is incorrect']
        }
      };
    }

    const result = await serverPost(`${API_ENDPOINTS.USERS.BASE}/${user.id}/password`, {
      currentPassword,
      newPassword
    });

    await auditLog({
      ...auditContext,
      action: AUDIT_ACTIONS.PASSWORD_CHANGE,
      resource: 'User',
      resourceId: user.id,
      success: true
    });

    return {
      success: true,
      message: 'Password changed successfully'
    };
  } catch (error) {
    return {
      errors: {
        _form: [error instanceof Error ? error.message : 'Unknown error']
      }
    };
  }
}

/**
 * Setup MFA for user account
 * Initiates multi-factor authentication setup process
 * Returns MFA configuration data (QR code, secret, etc.)
 * @returns Action result with MFA setup data
 */
export async function setupMFAAction(): Promise<ActionResult> {
  const auditContext = await createAuditContext();

  try {
    const user = await getAuthUser();
    if (!user) {
      return {
        errors: {
          _form: ['Authentication required']
        }
      };
    }

    const result = await serverPost(`${API_ENDPOINTS.USERS.BASE}/${user.id}/mfa/setup`);

    await auditLog({
      ...auditContext,
      action: 'SETUP_MFA',
      resource: 'User',
      resourceId: user.id,
      success: true
    });

    return {
      success: true,
      data: result,
      message: 'MFA setup initiated successfully'
    };
  } catch (error) {
    return {
      errors: {
        _form: [error instanceof Error ? error.message : 'Unknown error']
      }
    };
  }
}
