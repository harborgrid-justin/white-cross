/**
 * @fileoverview Emergency Contacts Validators - Validation schemas for emergency contact management
 *
 * Provides comprehensive Joi validation schemas for emergency contact CRUD operations,
 * notification workflows, and contact verification. Enforces business rules including
 * priority levels, multi-channel communication requirements, and contact information standards.
 *
 * Key responsibilities:
 * - Contact creation and update validation
 * - Emergency notification payload validation
 * - Contact verification method validation
 * - UUID parameter validation for routes
 * - Business rule enforcement (phone/email format, priority levels)
 *
 * @module operations/validators/emergencyContacts
 */

import Joi from 'joi';

/**
 * Payload Schemas
 */

/**
 * Create emergency contact schema
 *
 * Validates emergency contact creation payload with required fields and business rules.
 * Enforces contact information standards including name length, phone format, relationship
 * type, and priority level. Ensures minimum required contact information for emergency
 * notification workflows.
 *
 * Validation Rules:
 * - studentId: Required UUID for student association
 * - firstName/lastName: Required, 1-100 characters
 * - relationship: Required text (MOTHER, FATHER, GUARDIAN, etc.)
 * - phoneNumber: Required, valid phone format with international characters
 * - email: Optional but recommended, RFC 5322 format
 * - priority: Required, one of PRIMARY | SECONDARY | EMERGENCY_ONLY
 * - preferredContactMethod: Optional SMS | EMAIL | VOICE | ANY
 * - notificationChannels: Optional array of enabled channels
 * - canPickupStudent: Optional boolean for pickup authorization
 * - notes: Optional text up to 1000 characters
 *
 * @schema
 * @example
 * // Valid emergency contact creation
 * {
 *   studentId: '123e4567-e89b-12d3-a456-426614174000',
 *   firstName: 'Jane',
 *   lastName: 'Doe',
 *   relationship: 'Mother',
 *   phoneNumber: '+1-555-0100',
 *   email: 'jane.doe@email.com',
 *   priority: 'PRIMARY',
 *   preferredContactMethod: 'SMS',
 *   notificationChannels: ['sms', 'email'],
 *   canPickupStudent: true,
 *   notes: 'Works from home, available during school hours'
 * }
 *
 * @example
 * // Invalid - missing required fields
 * {
 *   studentId: '123e4567-e89b-12d3-a456-426614174000',
 *   firstName: 'Jane'
 *   // FAILS: lastName, relationship, phoneNumber, and priority are required
 * }
 *
 * @example
 * // Invalid - priority level incorrect
 * {
 *   studentId: '123e4567-e89b-12d3-a456-426614174000',
 *   firstName: 'Jane',
 *   lastName: 'Doe',
 *   relationship: 'Mother',
 *   phoneNumber: '+1-555-0100',
 *   priority: 'HIGH'
 *   // FAILS: Priority must be PRIMARY, SECONDARY, or EMERGENCY_ONLY
 * }
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

/**
 * Update emergency contact schema
 *
 * Validates partial updates to existing emergency contact records. All fields optional
 * but at least one field must be provided. Supports updating contact information, priority
 * level, verification status, notification preferences, and pickup authorization.
 *
 * Validation Rules:
 * - firstName/lastName: Optional, 1-100 characters if provided
 * - relationship: Optional text
 * - phoneNumber: Optional, valid phone format if provided
 * - email: Optional, RFC 5322 format if provided
 * - priority: Optional PRIMARY | SECONDARY | EMERGENCY_ONLY
 * - isActive: Optional boolean for soft delete status
 * - preferredContactMethod: Optional SMS | EMAIL | VOICE | ANY
 * - verificationStatus: Optional UNVERIFIED | PENDING | VERIFIED | FAILED
 * - notificationChannels: Optional array of enabled channels
 * - canPickupStudent: Optional boolean
 * - notes: Optional text up to 1000 characters
 * - Minimum 1 field required for update
 *
 * @schema
 * @example
 * // Valid partial update - updating phone and email
 * {
 *   phoneNumber: '+1-555-0102',
 *   email: 'jane.doe.new@email.com',
 *   notes: 'Updated contact info as of 2024-11-01'
 * }
 *
 * @example
 * // Valid partial update - changing priority level
 * {
 *   priority: 'SECONDARY',
 *   notes: 'Downgraded to secondary contact per parent request'
 * }
 *
 * @example
 * // Invalid - no fields provided
 * {
 *   // FAILS: At least one field must be provided for update
 * }
 *
 * @example
 * // Invalid - phone format incorrect
 * {
 *   phoneNumber: 'invalid-phone'
 *   // FAILS: Phone number contains invalid characters
 * }
 */
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

/**
 * Send emergency notification schema
 *
 * Validates emergency notification dispatch payload for multi-channel notification workflows.
 * Enforces message content requirements, notification type classification, priority levels,
 * and channel selection. Critical for ensuring proper emergency communication to parents/guardians.
 *
 * Validation Rules:
 * - message: Required, 10-500 characters for notification content
 * - type: Required, one of emergency | health | medication | general
 * - priority: Required, one of low | medium | high | critical
 * - channels: Required array, at least one of sms | email | voice
 * - attachments: Optional array of file URLs
 *
 * Business Logic:
 * - Message length ensures sufficient detail without SMS fragmentation
 * - Type classification enables notification filtering and routing
 * - Priority level determines delivery urgency and voice call triggers
 * - Multiple channels improve delivery success rates
 *
 * @schema
 * @example
 * // Valid critical emergency notification
 * {
 *   message: 'Your child sustained a head injury during recess. Currently conscious and alert. Please call immediately.',
 *   type: 'emergency',
 *   priority: 'critical',
 *   channels: ['sms', 'voice']
 * }
 *
 * @example
 * // Valid medication reminder notification
 * {
 *   message: 'Reminder: Your child needs to take their daily medication at 10:00 AM tomorrow.',
 *   type: 'medication',
 *   priority: 'medium',
 *   channels: ['sms', 'email']
 * }
 *
 * @example
 * // Invalid - message too short
 * {
 *   message: 'Call us',
 *   type: 'emergency',
 *   priority: 'high',
 *   channels: ['sms']
 *   // FAILS: Message must be at least 10 characters
 * }
 *
 * @example
 * // Invalid - no channels specified
 * {
 *   message: 'Your child is ready for pickup',
 *   type: 'general',
 *   priority: 'low',
 *   channels: []
 *   // FAILS: At least one notification channel is required
 * }
 */
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

/**
 * Verify contact schema
 *
 * Validates contact verification initiation payload. Specifies verification method for
 * sending verification code or link to confirm contact information validity. Ensures
 * emergency contacts remain current and reachable for critical notifications.
 *
 * Validation Rules:
 * - method: Required, one of sms | email | voice
 *
 * Verification Workflow:
 * - SMS: Sends 6-digit verification code via text message
 * - Email: Sends verification link via email with token
 * - Voice: Initiates automated voice call with verbal code
 *
 * @schema
 * @example
 * // Valid SMS verification request
 * {
 *   method: 'sms'
 * }
 *
 * @example
 * // Valid email verification request
 * {
 *   method: 'email'
 * }
 *
 * @example
 * // Invalid - method not recognized
 * {
 *   method: 'mail'
 *   // FAILS: Method must be sms, email, or voice
 * }
 */
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

/**
 * Contact ID parameter schema
 *
 * Validates emergency contact UUID in route parameters for individual contact operations.
 * Used in GET, PUT, DELETE routes targeting specific emergency contact records.
 *
 * Validation Rules:
 * - id: Required UUID v4 format
 *
 * @schema
 * @example
 * // Valid contact ID parameter
 * {
 *   id: '123e4567-e89b-12d3-a456-426614174000'
 * }
 *
 * @example
 * // Invalid - not a valid UUID
 * {
 *   id: 'invalid-uuid-format'
 *   // FAILS: Must be a valid UUID
 * }
 */
export const contactIdParamSchema = Joi.object({
  id: Joi.string()
    .uuid()
    .required()
    .description('Emergency contact UUID')
});

/**
 * Student ID parameter schema
 *
 * Validates student UUID in route parameters for student-scoped operations.
 * Used in routes that retrieve or operate on all emergency contacts for a student.
 *
 * Validation Rules:
 * - studentId: Required UUID v4 format
 *
 * @schema
 * @example
 * // Valid student ID parameter
 * {
 *   studentId: '123e4567-e89b-12d3-a456-426614174000'
 * }
 *
 * @example
 * // Invalid - not a valid UUID
 * {
 *   studentId: '12345'
 *   // FAILS: Must be a valid UUID
 * }
 */
export const studentIdParamSchema = Joi.object({
  studentId: Joi.string()
    .uuid()
    .required()
    .description('Student UUID')
});
