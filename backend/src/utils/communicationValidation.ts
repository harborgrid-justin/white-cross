/**
 * WC-UTL-CMV-057 | HIPAA-Compliant Communication Validation & Message Processing
 * Purpose: Healthcare message validation, PHI protection, emergency alert compliance
 * Upstream: database/types/enums, Joi validation library | Dependencies: joi, enums
 * Downstream: routes/communication.ts, services/messageService | Called by: Message APIs
 * Related: routes/communication.ts, middleware/auditLogging.ts, HIPAA compliance
 * Exports: Joi schemas, validation functions, HIPAA compliance checkers
 * Last Updated: 2025-10-18 | Dependencies: joi, database/types/enums
 * Critical Path: Message input → HIPAA validation → Content validation → Send approval
 * LLM Context: Healthcare messaging compliance, PHI detection, emergency protocols
 */

/**
 * Communication Validation Utilities
 * Comprehensive validation for messages, templates, and delivery tracking
 * Implements healthcare compliance standards for communication
 */

import Joi from 'joi';
import {
  MessageType,
  MessagePriority,
  MessageCategory,
  RecipientType,
  DeliveryStatus
} from '../database/types/enums';

// =====================
// VALIDATION CONSTANTS
// =====================

/**
 * Communication validation limits based on industry standards
 */
export const COMMUNICATION_LIMITS = {
  // SMS Standards (160 characters for single SMS, 1600 for concatenated)
  SMS_SINGLE_MESSAGE_LENGTH: 160,
  SMS_MAX_LENGTH: 1600,

  // Email Standards (RFC 5322)
  EMAIL_SUBJECT_MAX_LENGTH: 78, // Recommended for proper display
  EMAIL_CONTENT_MAX_LENGTH: 100000, // ~100KB for email content
  EMAIL_ADDRESS_MAX_LENGTH: 254,

  // General Message Limits
  MESSAGE_SUBJECT_MAX_LENGTH: 255,
  MESSAGE_CONTENT_MIN_LENGTH: 1,
  MESSAGE_CONTENT_MAX_LENGTH: 50000, // 50KB

  // Template Limits
  TEMPLATE_NAME_MIN_LENGTH: 3,
  TEMPLATE_NAME_MAX_LENGTH: 100,
  TEMPLATE_VARIABLE_MAX_COUNT: 50,
  TEMPLATE_VARIABLE_NAME_MAX_LENGTH: 50,

  // Recipient Limits
  MAX_RECIPIENTS_PER_MESSAGE: 1000,
  MAX_RECIPIENTS_BROADCAST: 10000,

  // Phone Number Standards (E.164)
  PHONE_NUMBER_MIN_LENGTH: 10,
  PHONE_NUMBER_MAX_LENGTH: 15,

  // Emergency Alert Requirements
  EMERGENCY_ALERT_TITLE_MAX_LENGTH: 100,
  EMERGENCY_ALERT_MESSAGE_MAX_LENGTH: 500,

  // Attachment Limits
  MAX_ATTACHMENTS_PER_MESSAGE: 10,
  ATTACHMENT_URL_MAX_LENGTH: 2048,
};

// =====================
// REGEX PATTERNS
// =====================

/**
 * Email validation regex (RFC 5322 simplified)
 */
export const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

/**
 * Phone number validation regex (E.164 format: +[country code][number])
 * Supports: +1234567890, +12345678901234, etc.
 */
export const PHONE_NUMBER_REGEX = /^\+?[1-9]\d{9,14}$/;

/**
 * Template variable pattern: {{variableName}}
 */
export const TEMPLATE_VARIABLE_REGEX = /\{\{([a-zA-Z0-9_]+)\}\}/g;

/**
 * URL validation regex (simplified)
 */
export const URL_REGEX = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

// =====================
// VALIDATION FUNCTIONS
// =====================

/**
 * HIPAA-compliant content validation
 * Checks for presence of PHI/PII that should not be in messages
 */
export function validateHIPAACompliance(content: string): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check for SSN patterns (XXX-XX-XXXX or XXXXXXXXX)
  const ssnPattern = /\b\d{3}-?\d{2}-?\d{4}\b/g;
  if (ssnPattern.test(content)) {
    errors.push('HIPAA Violation: Content contains Social Security Number pattern. Remove SSN from message.');
  }

  // Check for credit card patterns
  const ccPattern = /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g;
  if (ccPattern.test(content)) {
    errors.push('PCI Violation: Content contains credit card number pattern. Remove payment information from message.');
  }

  // Check for potential MRN (Medical Record Number) patterns - 6+ consecutive digits
  const mrnPattern = /\b\d{6,}\b/g;
  const mrnMatches = content.match(mrnPattern);
  if (mrnMatches && mrnMatches.length > 2) {
    warnings.push('Content contains multiple numeric sequences that may be medical record numbers. Verify no PHI is exposed.');
  }

  // Check for email addresses in content (potential PHI exposure)
  const emailInContentPattern = /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/g;
  const emailMatches = content.match(emailInContentPattern);
  if (emailMatches && emailMatches.length > 1) {
    warnings.push('Content contains email addresses. Ensure no unauthorized PHI disclosure.');
  }

  // Check for phone numbers in content
  const phoneInContentPattern = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g;
  const phoneMatches = content.match(phoneInContentPattern);
  if (phoneMatches && phoneMatches.length > 1) {
    warnings.push('Content contains phone numbers. Verify compliance with minimum necessary standard.');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validates email address format
 */
export function validateEmail(email: string): boolean {
  if (!email || email.length > COMMUNICATION_LIMITS.EMAIL_ADDRESS_MAX_LENGTH) {
    return false;
  }
  return EMAIL_REGEX.test(email);
}

/**
 * Validates phone number format (E.164)
 */
export function validatePhoneNumber(phoneNumber: string): boolean {
  if (!phoneNumber) {
    return false;
  }

  // Remove common formatting characters
  const cleaned = phoneNumber.replace(/[\s\-\(\)\.]/g, '');

  // Check length constraints
  if (cleaned.length < COMMUNICATION_LIMITS.PHONE_NUMBER_MIN_LENGTH ||
      cleaned.length > COMMUNICATION_LIMITS.PHONE_NUMBER_MAX_LENGTH) {
    return false;
  }

  return PHONE_NUMBER_REGEX.test(cleaned);
}

/**
 * Validates SMS message length based on content type
 */
export function validateSmsLength(content: string, strict: boolean = false): {
  isValid: boolean;
  length: number;
  messageCount: number;
  maxLength: number;
  error?: string;
} {
  const length = content.length;

  if (strict) {
    // Strict mode: single SMS only
    return {
      isValid: length <= COMMUNICATION_LIMITS.SMS_SINGLE_MESSAGE_LENGTH,
      length,
      messageCount: 1,
      maxLength: COMMUNICATION_LIMITS.SMS_SINGLE_MESSAGE_LENGTH,
      error: length > COMMUNICATION_LIMITS.SMS_SINGLE_MESSAGE_LENGTH
        ? `SMS content exceeds ${COMMUNICATION_LIMITS.SMS_SINGLE_MESSAGE_LENGTH} characters. Current: ${length}`
        : undefined
    };
  }

  // Allow concatenated SMS (multiple parts)
  const messageCount = Math.ceil(length / COMMUNICATION_LIMITS.SMS_SINGLE_MESSAGE_LENGTH);

  return {
    isValid: length <= COMMUNICATION_LIMITS.SMS_MAX_LENGTH,
    length,
    messageCount,
    maxLength: COMMUNICATION_LIMITS.SMS_MAX_LENGTH,
    error: length > COMMUNICATION_LIMITS.SMS_MAX_LENGTH
      ? `SMS content exceeds maximum length of ${COMMUNICATION_LIMITS.SMS_MAX_LENGTH} characters. Current: ${length}`
      : undefined
  };
}

/**
 * Validates email subject length
 */
export function validateEmailSubject(subject: string): {
  isValid: boolean;
  length: number;
  warning?: string;
} {
  const length = subject.length;

  return {
    isValid: length <= COMMUNICATION_LIMITS.EMAIL_SUBJECT_MAX_LENGTH,
    length,
    warning: length > COMMUNICATION_LIMITS.EMAIL_SUBJECT_MAX_LENGTH
      ? `Email subject exceeds recommended ${COMMUNICATION_LIMITS.EMAIL_SUBJECT_MAX_LENGTH} characters and may be truncated. Current: ${length}`
      : undefined
  };
}

/**
 * Validates message content based on channel requirements
 */
export function validateMessageContent(
  content: string,
  channel: MessageType,
  subject?: string
): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Content length validation
  if (!content || content.trim().length === 0) {
    errors.push('Message content is required');
    return { isValid: false, errors, warnings };
  }

  if (content.length < COMMUNICATION_LIMITS.MESSAGE_CONTENT_MIN_LENGTH) {
    errors.push(`Message content must be at least ${COMMUNICATION_LIMITS.MESSAGE_CONTENT_MIN_LENGTH} character`);
  }

  if (content.length > COMMUNICATION_LIMITS.MESSAGE_CONTENT_MAX_LENGTH) {
    errors.push(`Message content exceeds maximum length of ${COMMUNICATION_LIMITS.MESSAGE_CONTENT_MAX_LENGTH} characters`);
  }

  // Channel-specific validation
  switch (channel) {
    case MessageType.SMS:
      const smsValidation = validateSmsLength(content, false);
      if (!smsValidation.isValid) {
        errors.push(smsValidation.error!);
      } else if (smsValidation.messageCount > 1) {
        warnings.push(`SMS will be sent as ${smsValidation.messageCount} parts`);
      }
      break;

    case MessageType.EMAIL:
      if (content.length > COMMUNICATION_LIMITS.EMAIL_CONTENT_MAX_LENGTH) {
        errors.push(`Email content exceeds maximum length of ${COMMUNICATION_LIMITS.EMAIL_CONTENT_MAX_LENGTH} characters`);
      }

      if (subject) {
        const subjectValidation = validateEmailSubject(subject);
        if (!subjectValidation.isValid && subjectValidation.warning) {
          warnings.push(subjectValidation.warning);
        }
      }
      break;

    case MessageType.PUSH_NOTIFICATION:
      // Push notifications have stricter limits (platform dependent)
      if (content.length > 200) {
        warnings.push('Push notification content may be truncated on some devices (recommended max: 200 characters)');
      }
      break;

    case MessageType.VOICE:
      // Voice messages should be concise
      if (content.length > 500) {
        warnings.push('Voice message content is lengthy and may result in long call duration');
      }
      break;
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validates recipient has required contact information for channel
 */
export function validateRecipientForChannel(
  recipient: {
    email?: string;
    phoneNumber?: string;
    pushToken?: string;
  },
  channel: MessageType
): {
  isValid: boolean;
  error?: string;
} {
  switch (channel) {
    case MessageType.EMAIL:
      if (!recipient.email) {
        return { isValid: false, error: 'Email address is required for email channel' };
      }
      if (!validateEmail(recipient.email)) {
        return { isValid: false, error: `Invalid email address: ${recipient.email}` };
      }
      break;

    case MessageType.SMS:
    case MessageType.VOICE:
      if (!recipient.phoneNumber) {
        return { isValid: false, error: `Phone number is required for ${channel.toLowerCase()} channel` };
      }
      if (!validatePhoneNumber(recipient.phoneNumber)) {
        return { isValid: false, error: `Invalid phone number: ${recipient.phoneNumber}` };
      }
      break;

    case MessageType.PUSH_NOTIFICATION:
      if (!recipient.pushToken) {
        return { isValid: false, error: 'Push token is required for push notification channel' };
      }
      if (recipient.pushToken.length < 10) {
        return { isValid: false, error: 'Invalid push token format' };
      }
      break;
  }

  return { isValid: true };
}

/**
 * Validates scheduled send time
 */
export function validateScheduledTime(scheduledAt: Date): {
  isValid: boolean;
  error?: string;
} {
  const now = new Date();

  if (scheduledAt <= now) {
    return {
      isValid: false,
      error: 'Scheduled time must be in the future'
    };
  }

  // Don't allow scheduling more than 1 year in advance
  const oneYearFromNow = new Date();
  oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

  if (scheduledAt > oneYearFromNow) {
    return {
      isValid: false,
      error: 'Cannot schedule messages more than 1 year in advance'
    };
  }

  return { isValid: true };
}

/**
 * Validates emergency alert requirements
 */
export function validateEmergencyAlert(alert: {
  title: string;
  message: string;
  severity: string;
  priority?: MessagePriority;
  channels: MessageType[];
}): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Title validation
  if (!alert.title || alert.title.trim().length === 0) {
    errors.push('Emergency alert title is required');
  } else if (alert.title.length > COMMUNICATION_LIMITS.EMERGENCY_ALERT_TITLE_MAX_LENGTH) {
    errors.push(`Emergency alert title exceeds maximum length of ${COMMUNICATION_LIMITS.EMERGENCY_ALERT_TITLE_MAX_LENGTH} characters`);
  }

  // Message validation
  if (!alert.message || alert.message.trim().length === 0) {
    errors.push('Emergency alert message is required');
  } else if (alert.message.length > COMMUNICATION_LIMITS.EMERGENCY_ALERT_MESSAGE_MAX_LENGTH) {
    errors.push(`Emergency alert message exceeds maximum length of ${COMMUNICATION_LIMITS.EMERGENCY_ALERT_MESSAGE_MAX_LENGTH} characters`);
  }

  // Priority validation - Emergency alerts should be URGENT
  if (alert.priority && alert.priority !== MessagePriority.URGENT) {
    warnings.push('Emergency alerts should have URGENT priority');
  }

  // Channel validation - Emergency alerts should use multiple channels
  if (!alert.channels || alert.channels.length === 0) {
    errors.push('At least one communication channel is required for emergency alerts');
  } else if (alert.channels.length === 1) {
    warnings.push('Consider using multiple channels for emergency alerts to ensure delivery');
  }

  // Severity validation
  if (!alert.severity || !['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].includes(alert.severity)) {
    errors.push('Valid severity level is required (LOW, MEDIUM, HIGH, CRITICAL)');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Extracts template variables from content
 */
export function extractTemplateVariables(content: string): string[] {
  const variables: string[] = [];
  const matches = content.matchAll(TEMPLATE_VARIABLE_REGEX);

  for (const match of matches) {
    const variableName = match[1];
    if (!variables.includes(variableName)) {
      variables.push(variableName);
    }
  }

  return variables;
}

/**
 * Validates template variables are present in content
 */
export function validateTemplateVariables(
  content: string,
  declaredVariables: string[]
): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  extractedVariables: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  const extractedVariables = extractTemplateVariables(content);

  // Check for undeclared variables in content
  for (const variable of extractedVariables) {
    if (!declaredVariables.includes(variable)) {
      warnings.push(`Variable {{${variable}}} used in content but not declared in template variables`);
    }
  }

  // Check for declared variables not used in content
  for (const variable of declaredVariables) {
    if (!extractedVariables.includes(variable)) {
      warnings.push(`Declared variable '${variable}' is not used in template content`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    extractedVariables
  };
}

// =====================
// JOI VALIDATION SCHEMAS
// =====================

/**
 * Message recipient validation schema
 */
export const messageRecipientSchema = Joi.object({
  type: Joi.string()
    .valid(...Object.values(RecipientType))
    .required()
    .messages({
      'any.required': 'Recipient type is required',
      'any.only': 'Invalid recipient type'
    }),
  id: Joi.string()
    .uuid()
    .required()
    .messages({
      'any.required': 'Recipient ID is required',
      'string.guid': 'Recipient ID must be a valid UUID'
    }),
  email: Joi.string()
    .email()
    .max(COMMUNICATION_LIMITS.EMAIL_ADDRESS_MAX_LENGTH)
    .optional()
    .messages({
      'string.email': 'Invalid email address format',
      'string.max': `Email address cannot exceed ${COMMUNICATION_LIMITS.EMAIL_ADDRESS_MAX_LENGTH} characters`
    }),
  phoneNumber: Joi.string()
    .pattern(PHONE_NUMBER_REGEX)
    .min(COMMUNICATION_LIMITS.PHONE_NUMBER_MIN_LENGTH)
    .max(COMMUNICATION_LIMITS.PHONE_NUMBER_MAX_LENGTH)
    .optional()
    .messages({
      'string.pattern.base': 'Invalid phone number format (use E.164 format: +1234567890)',
      'string.min': `Phone number must be at least ${COMMUNICATION_LIMITS.PHONE_NUMBER_MIN_LENGTH} digits`,
      'string.max': `Phone number cannot exceed ${COMMUNICATION_LIMITS.PHONE_NUMBER_MAX_LENGTH} digits`
    }),
  pushToken: Joi.string()
    .min(10)
    .optional()
    .messages({
      'string.min': 'Invalid push token format'
    }),
  preferredLanguage: Joi.string()
    .length(2)
    .optional()
    .messages({
      'string.length': 'Language code must be 2 characters (ISO 639-1)'
    })
});

/**
 * Create message template validation schema
 */
export const createMessageTemplateSchema = Joi.object({
  name: Joi.string()
    .min(COMMUNICATION_LIMITS.TEMPLATE_NAME_MIN_LENGTH)
    .max(COMMUNICATION_LIMITS.TEMPLATE_NAME_MAX_LENGTH)
    .required()
    .messages({
      'any.required': 'Template name is required',
      'string.min': `Template name must be at least ${COMMUNICATION_LIMITS.TEMPLATE_NAME_MIN_LENGTH} characters`,
      'string.max': `Template name cannot exceed ${COMMUNICATION_LIMITS.TEMPLATE_NAME_MAX_LENGTH} characters`
    }),
  subject: Joi.string()
    .max(COMMUNICATION_LIMITS.MESSAGE_SUBJECT_MAX_LENGTH)
    .optional()
    .allow('')
    .messages({
      'string.max': `Subject cannot exceed ${COMMUNICATION_LIMITS.MESSAGE_SUBJECT_MAX_LENGTH} characters`
    }),
  content: Joi.string()
    .min(COMMUNICATION_LIMITS.MESSAGE_CONTENT_MIN_LENGTH)
    .max(COMMUNICATION_LIMITS.MESSAGE_CONTENT_MAX_LENGTH)
    .required()
    .messages({
      'any.required': 'Template content is required',
      'string.min': `Content must be at least ${COMMUNICATION_LIMITS.MESSAGE_CONTENT_MIN_LENGTH} character`,
      'string.max': `Content cannot exceed ${COMMUNICATION_LIMITS.MESSAGE_CONTENT_MAX_LENGTH} characters`
    }),
  type: Joi.string()
    .valid(...Object.values(MessageType))
    .required()
    .messages({
      'any.required': 'Message type is required',
      'any.only': 'Invalid message type'
    }),
  category: Joi.string()
    .valid(...Object.values(MessageCategory))
    .required()
    .messages({
      'any.required': 'Message category is required',
      'any.only': 'Invalid message category'
    }),
  variables: Joi.array()
    .items(
      Joi.string()
        .max(COMMUNICATION_LIMITS.TEMPLATE_VARIABLE_NAME_MAX_LENGTH)
        .pattern(/^[a-zA-Z0-9_]+$/)
    )
    .max(COMMUNICATION_LIMITS.TEMPLATE_VARIABLE_MAX_COUNT)
    .optional()
    .messages({
      'array.max': `Cannot exceed ${COMMUNICATION_LIMITS.TEMPLATE_VARIABLE_MAX_COUNT} template variables`,
      'string.pattern.base': 'Variable names must contain only letters, numbers, and underscores'
    }),
  isActive: Joi.boolean().optional(),
  createdBy: Joi.string()
    .uuid()
    .required()
    .messages({
      'any.required': 'Creator ID is required',
      'string.guid': 'Creator ID must be a valid UUID'
    })
});

/**
 * Update message template validation schema
 */
export const updateMessageTemplateSchema = Joi.object({
  name: Joi.string()
    .min(COMMUNICATION_LIMITS.TEMPLATE_NAME_MIN_LENGTH)
    .max(COMMUNICATION_LIMITS.TEMPLATE_NAME_MAX_LENGTH)
    .optional()
    .messages({
      'string.min': `Template name must be at least ${COMMUNICATION_LIMITS.TEMPLATE_NAME_MIN_LENGTH} characters`,
      'string.max': `Template name cannot exceed ${COMMUNICATION_LIMITS.TEMPLATE_NAME_MAX_LENGTH} characters`
    }),
  subject: Joi.string()
    .max(COMMUNICATION_LIMITS.MESSAGE_SUBJECT_MAX_LENGTH)
    .optional()
    .allow('')
    .messages({
      'string.max': `Subject cannot exceed ${COMMUNICATION_LIMITS.MESSAGE_SUBJECT_MAX_LENGTH} characters`
    }),
  content: Joi.string()
    .min(COMMUNICATION_LIMITS.MESSAGE_CONTENT_MIN_LENGTH)
    .max(COMMUNICATION_LIMITS.MESSAGE_CONTENT_MAX_LENGTH)
    .optional()
    .messages({
      'string.min': `Content must be at least ${COMMUNICATION_LIMITS.MESSAGE_CONTENT_MIN_LENGTH} character`,
      'string.max': `Content cannot exceed ${COMMUNICATION_LIMITS.MESSAGE_CONTENT_MAX_LENGTH} characters`
    }),
  type: Joi.string()
    .valid(...Object.values(MessageType))
    .optional()
    .messages({
      'any.only': 'Invalid message type'
    }),
  category: Joi.string()
    .valid(...Object.values(MessageCategory))
    .optional()
    .messages({
      'any.only': 'Invalid message category'
    }),
  variables: Joi.array()
    .items(
      Joi.string()
        .max(COMMUNICATION_LIMITS.TEMPLATE_VARIABLE_NAME_MAX_LENGTH)
        .pattern(/^[a-zA-Z0-9_]+$/)
    )
    .max(COMMUNICATION_LIMITS.TEMPLATE_VARIABLE_MAX_COUNT)
    .optional()
    .messages({
      'array.max': `Cannot exceed ${COMMUNICATION_LIMITS.TEMPLATE_VARIABLE_MAX_COUNT} template variables`,
      'string.pattern.base': 'Variable names must contain only letters, numbers, and underscores'
    }),
  isActive: Joi.boolean().optional()
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});

/**
 * Create message validation schema
 */
export const createMessageSchema = Joi.object({
  recipients: Joi.array()
    .items(messageRecipientSchema)
    .min(1)
    .max(COMMUNICATION_LIMITS.MAX_RECIPIENTS_PER_MESSAGE)
    .required()
    .messages({
      'any.required': 'At least one recipient is required',
      'array.min': 'At least one recipient is required',
      'array.max': `Cannot exceed ${COMMUNICATION_LIMITS.MAX_RECIPIENTS_PER_MESSAGE} recipients per message`
    }),
  channels: Joi.array()
    .items(Joi.string().valid(...Object.values(MessageType)))
    .min(1)
    .required()
    .messages({
      'any.required': 'At least one communication channel is required',
      'array.min': 'At least one communication channel is required'
    }),
  subject: Joi.string()
    .max(COMMUNICATION_LIMITS.MESSAGE_SUBJECT_MAX_LENGTH)
    .optional()
    .allow('')
    .messages({
      'string.max': `Subject cannot exceed ${COMMUNICATION_LIMITS.MESSAGE_SUBJECT_MAX_LENGTH} characters`
    }),
  content: Joi.string()
    .min(COMMUNICATION_LIMITS.MESSAGE_CONTENT_MIN_LENGTH)
    .max(COMMUNICATION_LIMITS.MESSAGE_CONTENT_MAX_LENGTH)
    .required()
    .messages({
      'any.required': 'Message content is required',
      'string.min': `Content must be at least ${COMMUNICATION_LIMITS.MESSAGE_CONTENT_MIN_LENGTH} character`,
      'string.max': `Content cannot exceed ${COMMUNICATION_LIMITS.MESSAGE_CONTENT_MAX_LENGTH} characters`
    }),
  priority: Joi.string()
    .valid(...Object.values(MessagePriority))
    .required()
    .messages({
      'any.required': 'Message priority is required',
      'any.only': 'Invalid message priority'
    }),
  category: Joi.string()
    .valid(...Object.values(MessageCategory))
    .required()
    .messages({
      'any.required': 'Message category is required',
      'any.only': 'Invalid message category'
    }),
  templateId: Joi.string()
    .uuid()
    .optional()
    .messages({
      'string.guid': 'Template ID must be a valid UUID'
    }),
  scheduledAt: Joi.date()
    .min('now')
    .optional()
    .messages({
      'date.min': 'Scheduled time must be in the future'
    }),
  attachments: Joi.array()
    .items(Joi.string().uri().max(COMMUNICATION_LIMITS.ATTACHMENT_URL_MAX_LENGTH))
    .max(COMMUNICATION_LIMITS.MAX_ATTACHMENTS_PER_MESSAGE)
    .optional()
    .messages({
      'array.max': `Cannot exceed ${COMMUNICATION_LIMITS.MAX_ATTACHMENTS_PER_MESSAGE} attachments`,
      'string.uri': 'Attachment must be a valid URL'
    }),
  senderId: Joi.string()
    .uuid()
    .required()
    .messages({
      'any.required': 'Sender ID is required',
      'string.guid': 'Sender ID must be a valid UUID'
    }),
  translateTo: Joi.array()
    .items(Joi.string().length(2))
    .optional()
    .messages({
      'string.length': 'Language codes must be 2 characters (ISO 639-1)'
    })
});

/**
 * Broadcast message validation schema
 */
export const broadcastMessageSchema = Joi.object({
  audience: Joi.object({
    grades: Joi.array().items(Joi.string()).optional(),
    nurseIds: Joi.array().items(Joi.string().uuid()).optional(),
    studentIds: Joi.array().items(Joi.string().uuid()).optional(),
    includeParents: Joi.boolean().optional(),
    includeEmergencyContacts: Joi.boolean().optional()
  }).required().messages({
    'any.required': 'Audience targeting is required for broadcast messages'
  }),
  channels: Joi.array()
    .items(Joi.string().valid(...Object.values(MessageType)))
    .min(1)
    .required()
    .messages({
      'any.required': 'At least one communication channel is required',
      'array.min': 'At least one communication channel is required'
    }),
  subject: Joi.string()
    .max(COMMUNICATION_LIMITS.MESSAGE_SUBJECT_MAX_LENGTH)
    .optional()
    .allow('')
    .messages({
      'string.max': `Subject cannot exceed ${COMMUNICATION_LIMITS.MESSAGE_SUBJECT_MAX_LENGTH} characters`
    }),
  content: Joi.string()
    .min(COMMUNICATION_LIMITS.MESSAGE_CONTENT_MIN_LENGTH)
    .max(COMMUNICATION_LIMITS.MESSAGE_CONTENT_MAX_LENGTH)
    .required()
    .messages({
      'any.required': 'Message content is required',
      'string.min': `Content must be at least ${COMMUNICATION_LIMITS.MESSAGE_CONTENT_MIN_LENGTH} character`,
      'string.max': `Content cannot exceed ${COMMUNICATION_LIMITS.MESSAGE_CONTENT_MAX_LENGTH} characters`
    }),
  priority: Joi.string()
    .valid(...Object.values(MessagePriority))
    .required()
    .messages({
      'any.required': 'Message priority is required',
      'any.only': 'Invalid message priority'
    }),
  category: Joi.string()
    .valid(...Object.values(MessageCategory))
    .required()
    .messages({
      'any.required': 'Message category is required',
      'any.only': 'Invalid message category'
    }),
  senderId: Joi.string()
    .uuid()
    .required()
    .messages({
      'any.required': 'Sender ID is required',
      'string.guid': 'Sender ID must be a valid UUID'
    }),
  scheduledAt: Joi.date()
    .min('now')
    .optional()
    .messages({
      'date.min': 'Scheduled time must be in the future'
    }),
  translateTo: Joi.array()
    .items(Joi.string().length(2))
    .optional()
    .messages({
      'string.length': 'Language codes must be 2 characters (ISO 639-1)'
    })
});

/**
 * Emergency alert validation schema
 */
export const emergencyAlertSchema = Joi.object({
  title: Joi.string()
    .min(1)
    .max(COMMUNICATION_LIMITS.EMERGENCY_ALERT_TITLE_MAX_LENGTH)
    .required()
    .messages({
      'any.required': 'Emergency alert title is required',
      'string.max': `Title cannot exceed ${COMMUNICATION_LIMITS.EMERGENCY_ALERT_TITLE_MAX_LENGTH} characters`
    }),
  message: Joi.string()
    .min(1)
    .max(COMMUNICATION_LIMITS.EMERGENCY_ALERT_MESSAGE_MAX_LENGTH)
    .required()
    .messages({
      'any.required': 'Emergency alert message is required',
      'string.max': `Message cannot exceed ${COMMUNICATION_LIMITS.EMERGENCY_ALERT_MESSAGE_MAX_LENGTH} characters`
    }),
  severity: Joi.string()
    .valid('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')
    .required()
    .messages({
      'any.required': 'Emergency alert severity is required',
      'any.only': 'Invalid severity level'
    }),
  audience: Joi.string()
    .valid('ALL_STAFF', 'NURSES_ONLY', 'SPECIFIC_GROUPS')
    .required()
    .messages({
      'any.required': 'Emergency alert audience is required',
      'any.only': 'Invalid audience type'
    }),
  groups: Joi.array()
    .items(Joi.string().uuid())
    .when('audience', {
      is: 'SPECIFIC_GROUPS',
      then: Joi.required(),
      otherwise: Joi.optional()
    })
    .messages({
      'any.required': 'Groups are required when audience is SPECIFIC_GROUPS'
    }),
  channels: Joi.array()
    .items(Joi.string().valid(...Object.values(MessageType)))
    .min(1)
    .required()
    .messages({
      'any.required': 'At least one communication channel is required',
      'array.min': 'At least one communication channel is required'
    }),
  senderId: Joi.string()
    .uuid()
    .required()
    .messages({
      'any.required': 'Sender ID is required',
      'string.guid': 'Sender ID must be a valid UUID'
    })
});
