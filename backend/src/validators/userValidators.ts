import Joi from 'joi';

/**
 * User and Authentication Validation Schemas
 * Provides enterprise-grade validation for user management and authentication
 * in compliance with security best practices and HIPAA requirements
 */

// ============================================================================
// PASSWORD VALIDATION UTILITIES
// ============================================================================

/**
 * Custom password validation rules
 * - Minimum 12 characters for healthcare application
 * - Must contain uppercase, lowercase, number, and special character
 * - Cannot contain common patterns or dictionary words
 * - Cannot contain username or email
 */
const passwordComplexityPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;

/**
 * Common weak passwords that should be rejected
 */
const WEAK_PASSWORDS = [
  'password', 'Password1!', 'Welcome1!', 'Admin123!', 'Nurse123!',
  'Healthcare1!', 'Hospital1!', 'Medical1!', 'Student123!', 'School123!'
];

/**
 * Custom Joi password validator
 */
const passwordValidator = Joi.string()
  .min(12)
  .max(128)
  .pattern(passwordComplexityPattern)
  .custom((value, helpers) => {
    // Check for weak passwords
    if (WEAK_PASSWORDS.some(weak => value.toLowerCase().includes(weak.toLowerCase()))) {
      return helpers.error('password.weak');
    }

    // Check for sequential characters (e.g., "abc", "123")
    if (/(?:abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789)/i.test(value)) {
      return helpers.error('password.sequential');
    }

    // Check for repeated characters (e.g., "aaa", "111")
    if (/(.)\1{2,}/.test(value)) {
      return helpers.error('password.repeated');
    }

    return value;
  })
  .messages({
    'string.min': 'Password must be at least 12 characters long',
    'string.max': 'Password cannot exceed 128 characters',
    'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)',
    'password.weak': 'Password is too weak or commonly used',
    'password.sequential': 'Password cannot contain sequential characters',
    'password.repeated': 'Password cannot contain repeated characters'
  });

// ============================================================================
// EMAIL VALIDATION
// ============================================================================

/**
 * Email validation with additional security checks
 */
const emailValidator = Joi.string()
  .email({ tlds: { allow: true } })
  .max(255)
  .lowercase()
  .trim()
  .custom((value, helpers) => {
    // Reject disposable email domains
    const disposableDomains = [
      'tempmail.com', 'throwaway.email', '10minutemail.com',
      'guerrillamail.com', 'mailinator.com', 'temp-mail.org'
    ];

    const domain = value.split('@')[1];
    if (disposableDomains.includes(domain)) {
      return helpers.error('email.disposable');
    }

    // Reject emails with suspicious patterns
    if (/[+].*@/.test(value) && !/^[a-zA-Z0-9._%+-]+\+[a-zA-Z0-9._-]+@/.test(value)) {
      return helpers.error('email.invalid');
    }

    return value;
  })
  .messages({
    'string.email': 'Must be a valid email address',
    'string.max': 'Email cannot exceed 255 characters',
    'email.disposable': 'Disposable email addresses are not allowed',
    'email.invalid': 'Email format is invalid'
  });

// ============================================================================
// USERNAME VALIDATION
// ============================================================================

/**
 * Username validation
 * - Alphanumeric with underscores and hyphens
 * - 3-30 characters
 * - Cannot start or end with special characters
 */
const usernameValidator = Joi.string()
  .min(3)
  .max(30)
  .pattern(/^[a-zA-Z0-9][a-zA-Z0-9_-]*[a-zA-Z0-9]$/)
  .lowercase()
  .trim()
  .messages({
    'string.min': 'Username must be at least 3 characters',
    'string.max': 'Username cannot exceed 30 characters',
    'string.pattern.base': 'Username must be alphanumeric and can only contain underscores or hyphens (not at start or end)'
  });

// ============================================================================
// PHONE NUMBER VALIDATION
// ============================================================================

/**
 * Phone number validation (US format)
 */
const phoneValidator = Joi.string()
  .pattern(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/)
  .messages({
    'string.pattern.base': 'Phone number must be in valid format (e.g., +1-555-123-4567, (555) 123-4567, 555.123.4567)'
  });

// ============================================================================
// USER REGISTRATION VALIDATION
// ============================================================================

/**
 * Schema for user registration
 */
export const registerUserSchema = Joi.object({
  email: emailValidator.required()
    .messages({
      'any.required': 'Email is required'
    }),

  password: passwordValidator.required()
    .messages({
      'any.required': 'Password is required'
    }),

  passwordConfirmation: Joi.string()
    .required()
    .valid(Joi.ref('password'))
    .messages({
      'any.required': 'Password confirmation is required',
      'any.only': 'Passwords do not match'
    }),

  firstName: Joi.string()
    .min(1)
    .max(100)
    .pattern(/^[a-zA-Z\s'-]+$/)
    .required()
    .messages({
      'string.min': 'First name is required',
      'string.max': 'First name cannot exceed 100 characters',
      'string.pattern.base': 'First name can only contain letters, spaces, hyphens, and apostrophes',
      'any.required': 'First name is required'
    }),

  lastName: Joi.string()
    .min(1)
    .max(100)
    .pattern(/^[a-zA-Z\s'-]+$/)
    .required()
    .messages({
      'string.min': 'Last name is required',
      'string.max': 'Last name cannot exceed 100 characters',
      'string.pattern.base': 'Last name can only contain letters, spaces, hyphens, and apostrophes',
      'any.required': 'Last name is required'
    }),

  role: Joi.string()
    .valid('ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'READ_ONLY', 'COUNSELOR')
    .required()
    .messages({
      'any.only': 'Role must be one of: ADMIN, NURSE, SCHOOL_ADMIN, DISTRICT_ADMIN, READ_ONLY, COUNSELOR',
      'any.required': 'Role is required'
    }),

  phone: phoneValidator.allow('', null),

  schoolId: Joi.string().uuid().allow(null)
    .messages({
      'string.guid': 'School ID must be a valid UUID'
    }),

  districtId: Joi.string().uuid().allow(null)
    .messages({
      'string.guid': 'District ID must be a valid UUID'
    }),

  // Email verification requirement (can be enabled for production)
  emailVerificationRequired: Joi.boolean().default(true),

  // Terms acceptance
  termsAccepted: Joi.boolean()
    .valid(true)
    .required()
    .messages({
      'any.only': 'You must accept the terms and conditions',
      'any.required': 'Terms acceptance is required'
    }),

  // Privacy policy acceptance
  privacyPolicyAccepted: Joi.boolean()
    .valid(true)
    .required()
    .messages({
      'any.only': 'You must accept the privacy policy',
      'any.required': 'Privacy policy acceptance is required'
    })
}).custom((value, helpers) => {
  // Ensure password doesn't contain user's name or email
  const { password, email, firstName, lastName } = value;

  if (password) {
    const lowerPassword = password.toLowerCase();
    const emailUser = email.split('@')[0].toLowerCase();

    if (lowerPassword.includes(emailUser)) {
      return helpers.error('password.containsEmail');
    }

    if (firstName && lowerPassword.includes(firstName.toLowerCase())) {
      return helpers.error('password.containsName');
    }

    if (lastName && lowerPassword.includes(lastName.toLowerCase())) {
      return helpers.error('password.containsName');
    }
  }

  return value;
}).messages({
  'password.containsEmail': 'Password cannot contain your email address',
  'password.containsName': 'Password cannot contain your name'
});

// ============================================================================
// USER LOGIN VALIDATION
// ============================================================================

/**
 * Schema for user login
 */
export const loginUserSchema = Joi.object({
  email: emailValidator.required()
    .messages({
      'any.required': 'Email is required'
    }),

  password: Joi.string()
    .required()
    .messages({
      'any.required': 'Password is required'
    }),

  rememberMe: Joi.boolean().default(false),

  // Two-factor authentication code (if enabled)
  twoFactorCode: Joi.string()
    .pattern(/^[0-9]{6}$/)
    .allow('', null)
    .messages({
      'string.pattern.base': 'Two-factor code must be 6 digits'
    }),

  // Device fingerprint for security tracking
  deviceId: Joi.string().max(255).allow('', null),

  // IP address (should be captured server-side, but can be validated)
  ipAddress: Joi.string()
    .ip({ version: ['ipv4', 'ipv6'] })
    .allow('', null)
    .messages({
      'string.ip': 'Invalid IP address format'
    })
});

// ============================================================================
// PASSWORD CHANGE VALIDATION
// ============================================================================

/**
 * Schema for changing password
 */
export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string()
    .required()
    .messages({
      'any.required': 'Current password is required'
    }),

  newPassword: passwordValidator.required()
    .invalid(Joi.ref('currentPassword'))
    .messages({
      'any.required': 'New password is required',
      'any.invalid': 'New password must be different from current password'
    }),

  newPasswordConfirmation: Joi.string()
    .required()
    .valid(Joi.ref('newPassword'))
    .messages({
      'any.required': 'Password confirmation is required',
      'any.only': 'Passwords do not match'
    })
});

// ============================================================================
// PASSWORD RESET VALIDATION
// ============================================================================

/**
 * Schema for requesting password reset
 */
export const forgotPasswordSchema = Joi.object({
  email: emailValidator.required()
    .messages({
      'any.required': 'Email is required'
    })
});

/**
 * Schema for resetting password with token
 */
export const resetPasswordSchema = Joi.object({
  token: Joi.string()
    .required()
    .min(32)
    .messages({
      'any.required': 'Reset token is required',
      'string.min': 'Invalid reset token'
    }),

  newPassword: passwordValidator.required()
    .messages({
      'any.required': 'New password is required'
    }),

  newPasswordConfirmation: Joi.string()
    .required()
    .valid(Joi.ref('newPassword'))
    .messages({
      'any.required': 'Password confirmation is required',
      'any.only': 'Passwords do not match'
    })
});

// ============================================================================
// USER UPDATE VALIDATION
// ============================================================================

/**
 * Schema for updating user profile
 */
export const updateUserSchema = Joi.object({
  email: emailValidator
    .messages({
      'string.email': 'Must be a valid email address'
    }),

  firstName: Joi.string()
    .min(1)
    .max(100)
    .pattern(/^[a-zA-Z\s'-]+$/)
    .messages({
      'string.min': 'First name is required',
      'string.max': 'First name cannot exceed 100 characters',
      'string.pattern.base': 'First name can only contain letters, spaces, hyphens, and apostrophes'
    }),

  lastName: Joi.string()
    .min(1)
    .max(100)
    .pattern(/^[a-zA-Z\s'-]+$/)
    .messages({
      'string.min': 'Last name is required',
      'string.max': 'Last name cannot exceed 100 characters',
      'string.pattern.base': 'Last name can only contain letters, spaces, hyphens, and apostrophes'
    }),

  phone: phoneValidator.allow('', null),

  role: Joi.string()
    .valid('ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'READ_ONLY', 'COUNSELOR')
    .messages({
      'any.only': 'Role must be one of: ADMIN, NURSE, SCHOOL_ADMIN, DISTRICT_ADMIN, READ_ONLY, COUNSELOR'
    }),

  isActive: Joi.boolean(),

  schoolId: Joi.string().uuid().allow(null)
    .messages({
      'string.guid': 'School ID must be a valid UUID'
    }),

  districtId: Joi.string().uuid().allow(null)
    .messages({
      'string.guid': 'District ID must be a valid UUID'
    }),

  // Two-factor authentication settings
  twoFactorEnabled: Joi.boolean(),

  // Notification preferences
  notificationPreferences: Joi.object({
    email: Joi.boolean().default(true),
    sms: Joi.boolean().default(false),
    push: Joi.boolean().default(true),
    inApp: Joi.boolean().default(true)
  })
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});

// ============================================================================
// USERNAME AVAILABILITY CHECK
// ============================================================================

/**
 * Schema for checking username availability
 */
export const checkUsernameAvailabilitySchema = Joi.object({
  username: usernameValidator.required()
    .messages({
      'any.required': 'Username is required'
    })
});

// ============================================================================
// EMAIL VERIFICATION VALIDATION
// ============================================================================

/**
 * Schema for email verification
 */
export const verifyEmailSchema = Joi.object({
  token: Joi.string()
    .required()
    .min(32)
    .messages({
      'any.required': 'Verification token is required',
      'string.min': 'Invalid verification token'
    }),

  email: emailValidator.required()
    .messages({
      'any.required': 'Email is required'
    })
});

// ============================================================================
// TWO-FACTOR AUTHENTICATION VALIDATION
// ============================================================================

/**
 * Schema for enabling two-factor authentication
 */
export const enableTwoFactorSchema = Joi.object({
  password: Joi.string()
    .required()
    .messages({
      'any.required': 'Password is required to enable two-factor authentication'
    })
});

/**
 * Schema for verifying two-factor authentication setup
 */
export const verifyTwoFactorSchema = Joi.object({
  code: Joi.string()
    .pattern(/^[0-9]{6}$/)
    .required()
    .messages({
      'string.pattern.base': 'Two-factor code must be 6 digits',
      'any.required': 'Two-factor code is required'
    })
});

/**
 * Schema for disabling two-factor authentication
 */
export const disableTwoFactorSchema = Joi.object({
  password: Joi.string()
    .required()
    .messages({
      'any.required': 'Password is required to disable two-factor authentication'
    }),

  code: Joi.string()
    .pattern(/^[0-9]{6}$/)
    .required()
    .messages({
      'string.pattern.base': 'Two-factor code must be 6 digits',
      'any.required': 'Two-factor code is required'
    })
});

// ============================================================================
// SESSION VALIDATION
// ============================================================================

/**
 * Schema for session timeout configuration
 */
export const sessionTimeoutSchema = Joi.object({
  idleTimeout: Joi.number()
    .integer()
    .min(5)
    .max(1440)
    .default(30)
    .messages({
      'number.min': 'Idle timeout must be at least 5 minutes',
      'number.max': 'Idle timeout cannot exceed 1440 minutes (24 hours)'
    }),

  absoluteTimeout: Joi.number()
    .integer()
    .min(30)
    .max(10080)
    .default(480)
    .messages({
      'number.min': 'Absolute timeout must be at least 30 minutes',
      'number.max': 'Absolute timeout cannot exceed 10080 minutes (7 days)'
    })
});

// ============================================================================
// ROLE ASSIGNMENT VALIDATION
// ============================================================================

/**
 * Schema for assigning role to user
 */
export const assignRoleSchema = Joi.object({
  userId: Joi.string().uuid().required()
    .messages({
      'string.guid': 'User ID must be a valid UUID',
      'any.required': 'User ID is required'
    }),

  roleId: Joi.string().uuid().required()
    .messages({
      'string.guid': 'Role ID must be a valid UUID',
      'any.required': 'Role ID is required'
    }),

  // Optional expiration for temporary role assignments
  expiresAt: Joi.date().min('now').allow(null)
    .messages({
      'date.min': 'Expiration date must be in the future'
    })
});

// ============================================================================
// ACCOUNT DEACTIVATION VALIDATION
// ============================================================================

/**
 * Schema for deactivating user account
 */
export const deactivateAccountSchema = Joi.object({
  password: Joi.string()
    .required()
    .messages({
      'any.required': 'Password is required to deactivate account'
    }),

  reason: Joi.string()
    .min(10)
    .max(500)
    .required()
    .messages({
      'string.min': 'Reason must be at least 10 characters',
      'string.max': 'Reason cannot exceed 500 characters',
      'any.required': 'Reason for deactivation is required'
    }),

  transferDataTo: Joi.string().uuid().allow(null)
    .messages({
      'string.guid': 'Transfer user ID must be a valid UUID'
    })
});

// ============================================================================
// USER SEARCH AND FILTER VALIDATION
// ============================================================================

/**
 * Schema for user search and filtering
 */
export const userFilterSchema = Joi.object({
  search: Joi.string()
    .max(100)
    .allow('')
    .messages({
      'string.max': 'Search query cannot exceed 100 characters'
    }),

  role: Joi.string()
    .valid('ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'READ_ONLY', 'COUNSELOR')
    .allow('')
    .messages({
      'any.only': 'Role must be one of: ADMIN, NURSE, SCHOOL_ADMIN, DISTRICT_ADMIN, READ_ONLY, COUNSELOR'
    }),

  isActive: Joi.boolean(),

  schoolId: Joi.string().uuid().allow('')
    .messages({
      'string.guid': 'School ID must be a valid UUID'
    }),

  districtId: Joi.string().uuid().allow('')
    .messages({
      'string.guid': 'District ID must be a valid UUID'
    }),

  page: Joi.number().integer().min(1).default(1)
    .messages({
      'number.min': 'Page must be at least 1'
    }),

  limit: Joi.number().integer().min(1).max(100).default(20)
    .messages({
      'number.min': 'Limit must be at least 1',
      'number.max': 'Limit cannot exceed 100'
    }),

  sortBy: Joi.string()
    .valid('firstName', 'lastName', 'email', 'createdAt', 'lastLogin')
    .default('createdAt')
    .messages({
      'any.only': 'Sort field must be one of: firstName, lastName, email, createdAt, lastLogin'
    }),

  sortOrder: Joi.string()
    .valid('ASC', 'DESC')
    .default('DESC')
    .messages({
      'any.only': 'Sort order must be ASC or DESC'
    })
});

// ============================================================================
// EXPORT VALIDATION MIDDLEWARE
// ============================================================================

/**
 * Joi validation middleware generator
 */
export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: any, res: any, next: any) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        type: detail.type
      }));

      return res.status(400).json({
        success: false,
        error: {
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: errors
        }
      });
    }

    // Replace req.body with validated and sanitized values
    req.body = value;
    next();
  };
};
