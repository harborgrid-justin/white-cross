/**
 * User Validation Schemas
 * Zod schemas for user management matching backend Joi validators
 *
 * Backend Reference: /backend/src/routes/v1/core/validators/users.validators.ts
 *
 * Validates:
 *   - User creation
 *   - User updates
 *   - Password changes
 *   - Role assignments
 */

import { z } from 'zod';

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * User roles
 */
const USER_ROLES = [
  'ADMIN',
  'NURSE',
  'SCHOOL_ADMIN',
  'DISTRICT_ADMIN',
  'COUNSELOR',
  'VIEWER',
] as const;

// ============================================================================
// HELPER SCHEMAS
// ============================================================================

/**
 * UUID validation schema
 */
const uuidSchema = z.string().uuid({ message: 'Must be a valid UUID' });

/**
 * Email validation schema
 */
export const emailSchema = z
  .string({ message: 'Email is required' })
  .email('Must be a valid email address')
  .min(5, 'Email must be at least 5 characters')
  .max(255, 'Email must not exceed 255 characters')
  .transform((val) => val.trim().toLowerCase());

/**
 * First name validation schema
 */
export const firstNameSchema = z
  .string({ message: 'First name is required' })
  .min(1, 'First name must be at least 1 character')
  .max(100, 'First name cannot exceed 100 characters')
  .transform((val) => val.trim());

/**
 * Last name validation schema
 */
export const lastNameSchema = z
  .string({ message: 'Last name is required' })
  .min(1, 'Last name must be at least 1 character')
  .max(100, 'Last name cannot exceed 100 characters')
  .transform((val) => val.trim());

/**
 * Password validation schema
 */
export const passwordSchema = z
  .string({ message: 'Password is required' })
  .min(8, 'Password must be at least 8 characters long')
  .max(128, 'Password cannot exceed 128 characters');

/**
 * Role validation schema
 */
export const roleSchema = z.enum(USER_ROLES, {
  errorMap: () => ({
    message: `Role must be one of: ${USER_ROLES.join(', ')}`,
  }),
});

// ============================================================================
// USER MANAGEMENT SCHEMAS
// ============================================================================

/**
 * Create User Schema
 * For registering a new user
 *
 * Backend Reference: createUserSchema
 */
export const createUserSchema = z.object({
  email: emailSchema,

  password: passwordSchema,

  firstName: firstNameSchema,

  lastName: lastNameSchema,

  role: roleSchema,
});

/**
 * Update User Schema
 * For updating an existing user (partial update)
 *
 * Backend Reference: updateUserSchema
 */
export const updateUserSchema = z
  .object({
    email: emailSchema.optional(),

    firstName: firstNameSchema.optional(),

    lastName: lastNameSchema.optional(),

    role: roleSchema.optional(),

    isActive: z.boolean().optional(),
  })
  .refine(
    (data) => {
      // At least one field must be provided for update
      return Object.keys(data).length > 0;
    },
    {
      message: 'At least one field must be provided for update',
    }
  );

/**
 * Change Password Schema
 * For users changing their own password
 *
 * Backend Reference: changePasswordSchema
 */
export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string({ message: 'Current password is required' })
      .min(1, 'Current password is required'),

    newPassword: passwordSchema,
  })
  .refine(
    (data) => {
      // New password must be different from current
      return data.currentPassword !== data.newPassword;
    },
    {
      message: 'New password must be different from current password',
      path: ['newPassword'],
    }
  );

/**
 * Reset Password Schema
 * For admins resetting user passwords
 *
 * Backend Reference: resetPasswordSchema
 */
export const resetPasswordSchema = z.object({
  newPassword: passwordSchema,
});

// ============================================================================
// QUERY SCHEMAS
// ============================================================================

/**
 * List Users Query Schema
 * For filtering and paginating user lists
 *
 * Backend Reference: listUsersQuerySchema
 */
export const listUsersQuerySchema = z.object({
  page: z.number().int().min(1).default(1).optional(),

  limit: z.number().int().min(1).max(100).default(10).optional(),

  search: z.string().optional(),

  role: roleSchema.optional(),

  isActive: z.boolean().optional(),
});

/**
 * User ID Parameter Schema
 * For validating user ID in URL parameters
 *
 * Backend Reference: userIdParamSchema
 */
export const userIdParamSchema = z.object({
  id: uuidSchema,
});

/**
 * Role Parameter Schema
 * For filtering by role
 *
 * Backend Reference: roleParamSchema
 */
export const roleParamSchema = z.object({
  role: roleSchema,
});

// ============================================================================
// AUTHENTICATION SCHEMAS
// ============================================================================

/**
 * Login Schema
 * For user authentication
 */
export const loginSchema = z.object({
  email: emailSchema,

  password: z
    .string({ message: 'Password is required' })
    .min(1, 'Password is required'),
});

/**
 * Register Schema
 * For user registration (may be restricted to admins)
 */
export const registerSchema = z.object({
  email: emailSchema,

  password: passwordSchema,

  firstName: firstNameSchema,

  lastName: lastNameSchema,

  role: roleSchema.optional(),
});

/**
 * Forgot Password Schema
 * For initiating password reset
 */
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

/**
 * Reset Password Token Schema
 * For completing password reset with token
 */
export const resetPasswordTokenSchema = z.object({
  token: z
    .string({ message: 'Reset token is required' })
    .min(1, 'Reset token is required'),

  newPassword: passwordSchema,
});

/**
 * Verify Email Schema
 * For email verification
 */
export const verifyEmailSchema = z.object({
  token: z
    .string({ message: 'Verification token is required' })
    .min(1, 'Verification token is required'),
});

// ============================================================================
// PROFILE SCHEMAS
// ============================================================================

/**
 * Update Profile Schema
 * For users updating their own profile
 */
export const updateProfileSchema = z
  .object({
    firstName: firstNameSchema.optional(),

    lastName: lastNameSchema.optional(),

    email: emailSchema.optional(),
  })
  .refine(
    (data) => {
      return Object.keys(data).length > 0;
    },
    {
      message: 'At least one field must be provided for update',
    }
  );

/**
 * Update User Preferences Schema
 * For updating user preferences/settings
 */
export const updateUserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).optional(),

  language: z.string().length(2).optional(),

  timezone: z.string().optional(),

  notifications: z
    .object({
      email: z.boolean().optional(),
      push: z.boolean().optional(),
      sms: z.boolean().optional(),
    })
    .optional(),

  emailDigest: z.enum(['daily', 'weekly', 'never']).optional(),
});

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ListUsersQueryInput = z.infer<typeof listUsersQuerySchema>;
export type UserIdParamInput = z.infer<typeof userIdParamSchema>;
export type RoleParamInput = z.infer<typeof roleParamSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordTokenInput = z.infer<typeof resetPasswordTokenSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type UpdateUserPreferencesInput = z.infer<typeof updateUserPreferencesSchema>;

// ============================================================================
// CONSTANTS EXPORTS
// ============================================================================

export { USER_ROLES };

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Check if user has a specific role
 */
export const hasRole = (userRole: string, requiredRole: string): boolean => {
  return userRole === requiredRole;
};

/**
 * Check if user has admin privileges
 */
export const isAdmin = (userRole: string): boolean => {
  return userRole === 'ADMIN' || userRole === 'DISTRICT_ADMIN';
};

/**
 * Check if user can manage other users
 */
export const canManageUsers = (userRole: string): boolean => {
  return ['ADMIN', 'DISTRICT_ADMIN', 'SCHOOL_ADMIN'].includes(userRole);
};

/**
 * Get role hierarchy level (higher number = more permissions)
 */
export const getRoleLevel = (role: string): number => {
  const roleHierarchy: Record<string, number> = {
    VIEWER: 1,
    COUNSELOR: 2,
    NURSE: 3,
    SCHOOL_ADMIN: 4,
    DISTRICT_ADMIN: 5,
    ADMIN: 6,
  };

  return roleHierarchy[role] ?? 0;
};

/**
 * Check if a role can perform actions on another role
 */
export const canActOnRole = (actorRole: string, targetRole: string): boolean => {
  const actorLevel = getRoleLevel(actorRole);
  const targetLevel = getRoleLevel(targetRole);

  // Can only act on roles with lower or equal privilege level
  return actorLevel >= targetLevel;
};

/**
 * Validate password strength
 */
export const validatePasswordStrength = (
  password: string
): { isStrong: boolean; message?: string } => {
  if (password.length < 8) {
    return {
      isStrong: false,
      message: 'Password must be at least 8 characters long',
    };
  }

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  const strengthCount = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean)
    .length;

  if (strengthCount < 3) {
    return {
      isStrong: false,
      message:
        'Password should contain at least 3 of: uppercase letters, lowercase letters, numbers, special characters',
    };
  }

  return { isStrong: true };
};
