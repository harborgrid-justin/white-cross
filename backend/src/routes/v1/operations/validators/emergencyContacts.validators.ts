/**
 * Emergency Contacts Validators
 * Validation schemas for emergency contact management endpoints
 */

import Joi from 'joi';

/**
 * Payload Schemas
 */

export const createEmergencyContactSchema = Joi.object({
  studentId: Joi.string()
    .uuid()
    .required()
    .description('Student UUID')
    .messages({
      'any.required': 'Student ID is required'
    }),

  firstName: Joi.string()
    .trim()
    .min(1)
    .max(100)
    .required()
    .description('Contact first name')
    .messages({
      'string.min': 'First name must be at least 1 character',
      'string.max': 'First name cannot exceed 100 characters',
      'any.required': 'First name is required'
    }),

  lastName: Joi.string()
    .trim()
    .min(1)
    .max(100)
    .required()
    .description('Contact last name')
    .messages({
      'string.min': 'Last name must be at least 1 character',
      'string.max': 'Last name cannot exceed 100 characters',
      'any.required': 'Last name is required'
    }),

  relationship: Joi.string()
    .trim()
    .required()
    .description('Relationship to student (e.g., "Mother", "Father", "Guardian")')
    .messages({
      'any.required': 'Relationship is required'
    }),

  phoneNumber: Joi.string()
    .trim()
    .pattern(/^[\d\s\-().+]+$/)
    .required()
    .description('Contact phone number')
    .messages({
      'string.pattern.base': 'Phone number contains invalid characters',
      'any.required': 'Phone number is required'
    }),

  email: Joi.string()
    .email()
    .optional()
    .description('Contact email address'),

  address: Joi.string()
    .trim()
    .optional()
    .description('Contact physical address'),

  priority: Joi.string()
    .valid('PRIMARY', 'SECONDARY', 'EMERGENCY_ONLY')
    .required()
    .description('Contact priority level')
    .messages({
      'any.required': 'Priority is required',
      'any.only': 'Priority must be PRIMARY, SECONDARY, or EMERGENCY_ONLY'
    }),

  preferredContactMethod: Joi.string()
    .valid('SMS', 'EMAIL', 'VOICE', 'ANY')
    .optional()
    .description('Preferred method of contact'),

  notificationChannels: Joi.array()
    .items(Joi.string().valid('sms', 'email', 'voice'))
    .optional()
    .description('Enabled notification channels'),

  canPickupStudent: Joi.boolean()
    .optional()
    .description('Whether contact is authorized to pick up student'),

  notes: Joi.string()
    .trim()
    .max(1000)
    .optional()
    .description('Additional notes about the contact')
    .messages({
      'string.max': 'Notes cannot exceed 1000 characters'
    })
});

export const updateEmergencyContactSchema = Joi.object({
  firstName: Joi.string()
    .trim()
    .min(1)
    .max(100)
    .optional(),

  lastName: Joi.string()
    .trim()
    .min(1)
    .max(100)
    .optional(),

  relationship: Joi.string()
    .trim()
    .optional(),

  phoneNumber: Joi.string()
    .trim()
    .pattern(/^[\d\s\-().+]+$/)
    .optional()
    .messages({
      'string.pattern.base': 'Phone number contains invalid characters'
    }),

  email: Joi.string()
    .email()
    .optional(),

  address: Joi.string()
    .trim()
    .optional(),

  priority: Joi.string()
    .valid('PRIMARY', 'SECONDARY', 'EMERGENCY_ONLY')
    .optional(),

  isActive: Joi.boolean()
    .optional(),

  preferredContactMethod: Joi.string()
    .valid('SMS', 'EMAIL', 'VOICE', 'ANY')
    .optional(),

  verificationStatus: Joi.string()
    .valid('UNVERIFIED', 'PENDING', 'VERIFIED', 'FAILED')
    .optional(),

  notificationChannels: Joi.array()
    .items(Joi.string().valid('sms', 'email', 'voice'))
    .optional(),

  canPickupStudent: Joi.boolean()
    .optional(),

  notes: Joi.string()
    .trim()
    .max(1000)
    .optional()
    .messages({
      'string.max': 'Notes cannot exceed 1000 characters'
    })
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});

export const sendEmergencyNotificationSchema = Joi.object({
  message: Joi.string()
    .trim()
    .min(10)
    .max(500)
    .required()
    .description('Notification message content')
    .messages({
      'string.min': 'Message must be at least 10 characters',
      'string.max': 'Message cannot exceed 500 characters',
      'any.required': 'Message is required'
    }),

  type: Joi.string()
    .valid('emergency', 'health', 'medication', 'general')
    .required()
    .description('Type of notification')
    .messages({
      'any.required': 'Notification type is required'
    }),

  priority: Joi.string()
    .valid('low', 'medium', 'high', 'critical')
    .required()
    .description('Notification priority level')
    .messages({
      'any.required': 'Priority is required'
    }),

  channels: Joi.array()
    .items(Joi.string().valid('sms', 'email', 'voice'))
    .min(1)
    .required()
    .description('Notification channels to use')
    .messages({
      'array.min': 'At least one notification channel is required',
      'any.required': 'Notification channels are required'
    }),

  attachments: Joi.array()
    .items(Joi.string())
    .optional()
    .description('File attachment URLs')
});

export const verifyContactSchema = Joi.object({
  method: Joi.string()
    .valid('sms', 'email', 'voice')
    .required()
    .description('Verification method')
    .messages({
      'any.required': 'Verification method is required',
      'any.only': 'Method must be sms, email, or voice'
    })
});

/**
 * Parameter Schemas
 */

export const contactIdParamSchema = Joi.object({
  id: Joi.string()
    .uuid()
    .required()
    .description('Emergency contact UUID')
});

export const studentIdParamSchema = Joi.object({
  studentId: Joi.string()
    .uuid()
    .required()
    .description('Student UUID')
});
