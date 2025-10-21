/**
 * WF-COMP-358 | communicationSchemas.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ../types/communication | Dependencies: zod, ../types/communication
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants, functions, types | Key Features: component, arrow component
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Communication Module Validation Schemas
 * Comprehensive Zod schemas for frontend validation
 * Aligns with backend validation requirements
 */

import { z } from 'zod';
import {
  MessageType,
  MessagePriority,
  MessageCategory,
  RecipientType,
  DeliveryStatus,
  EmergencyAlertSeverity,
  EmergencyAlertAudience,
} from '../types/communication';

// =====================
// VALIDATION CONSTANTS
// =====================

export const COMMUNICATION_LIMITS = {
  // SMS Standards
  SMS_SINGLE_MESSAGE_LENGTH: 160,
  SMS_MAX_LENGTH: 1600,

  // Email Standards
  EMAIL_SUBJECT_MAX_LENGTH: 78,
  EMAIL_CONTENT_MAX_LENGTH: 100000,
  EMAIL_ADDRESS_MAX_LENGTH: 254,

  // General Message Limits
  MESSAGE_SUBJECT_MAX_LENGTH: 255,
  MESSAGE_CONTENT_MIN_LENGTH: 1,
  MESSAGE_CONTENT_MAX_LENGTH: 50000,

  // Template Limits
  TEMPLATE_NAME_MIN_LENGTH: 3,
  TEMPLATE_NAME_MAX_LENGTH: 100,
  TEMPLATE_VARIABLE_MAX_COUNT: 50,
  TEMPLATE_VARIABLE_NAME_MAX_LENGTH: 50,

  // Recipient Limits
  MAX_RECIPIENTS_PER_MESSAGE: 1000,
  MAX_RECIPIENTS_BROADCAST: 10000,

  // Phone Number Standards
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

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const PHONE_NUMBER_REGEX = /^\+?[1-9]\d{9,14}$/;
const TEMPLATE_VARIABLE_REGEX = /^[a-zA-Z0-9_]+$/;
const URL_REGEX = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

// =====================
// CUSTOM VALIDATORS
// =====================

/**
 * Validates phone number with flexible formatting
 */
const phoneNumberValidator = z.string().refine(
  (value) => {
    const cleaned = value.replace(/[\s\-\(\)\.]/g, '');
    return (
      cleaned.length >= COMMUNICATION_LIMITS.PHONE_NUMBER_MIN_LENGTH &&
      cleaned.length <= COMMUNICATION_LIMITS.PHONE_NUMBER_MAX_LENGTH &&
      PHONE_NUMBER_REGEX.test(cleaned)
    );
  },
  {
    message: 'Invalid phone number format (use E.164 format: +1234567890)',
  }
);

/**
 * Validates email address
 */
const emailValidator = z
  .string()
  .max(COMMUNICATION_LIMITS.EMAIL_ADDRESS_MAX_LENGTH, 'Email address too long')
  .regex(EMAIL_REGEX, 'Invalid email address format');

/**
 * Validates future date for scheduling
 */
const futureDateValidator = z.string().refine(
  (value) => {
    const date = new Date(value);
    return date > new Date();
  },
  {
    message: 'Scheduled time must be in the future',
  }
);

/**
 * Validates SMS content length
 */
const smsContentValidator = z.string().refine(
  (value) => value.length <= COMMUNICATION_LIMITS.SMS_MAX_LENGTH,
  {
    message: `SMS content exceeds maximum length of ${COMMUNICATION_LIMITS.SMS_MAX_LENGTH} characters`,
  }
);

// =====================
// MESSAGE RECIPIENT SCHEMA
// =====================

export const messageRecipientSchema = z.object({
  type: z.nativeEnum(RecipientType, {
    error: () => ({ message: 'Invalid recipient type' }),
  }),
  id: z.string().uuid('Recipient ID must be a valid UUID'),
  email: emailValidator.optional(),
  phoneNumber: phoneNumberValidator.optional(),
  pushToken: z.string().min(10, 'Invalid push token format').optional(),
  preferredLanguage: z.string().length(2, 'Language code must be 2 characters (ISO 639-1)').optional(),
});

// =====================
// MESSAGE TEMPLATE SCHEMAS
// =====================

export const createMessageTemplateSchema = z
  .object({
    name: z
      .string()
      .min(COMMUNICATION_LIMITS.TEMPLATE_NAME_MIN_LENGTH, `Template name must be at least ${COMMUNICATION_LIMITS.TEMPLATE_NAME_MIN_LENGTH} characters`)
      .max(COMMUNICATION_LIMITS.TEMPLATE_NAME_MAX_LENGTH, `Template name cannot exceed ${COMMUNICATION_LIMITS.TEMPLATE_NAME_MAX_LENGTH} characters`)
      .trim(),
    subject: z
      .string()
      .max(COMMUNICATION_LIMITS.MESSAGE_SUBJECT_MAX_LENGTH, `Subject cannot exceed ${COMMUNICATION_LIMITS.MESSAGE_SUBJECT_MAX_LENGTH} characters`)
      .optional(),
    content: z
      .string()
      .min(COMMUNICATION_LIMITS.MESSAGE_CONTENT_MIN_LENGTH, 'Template content is required')
      .max(COMMUNICATION_LIMITS.MESSAGE_CONTENT_MAX_LENGTH, `Content cannot exceed ${COMMUNICATION_LIMITS.MESSAGE_CONTENT_MAX_LENGTH} characters`),
    type: z.nativeEnum(MessageType, {
      error: () => ({ message: 'Invalid message type' }),
    }),
    category: z.nativeEnum(MessageCategory, {
      error: () => ({ message: 'Invalid message category' }),
    }),
    variables: z
      .array(
        z
          .string()
          .max(COMMUNICATION_LIMITS.TEMPLATE_VARIABLE_NAME_MAX_LENGTH, 'Variable name too long')
          .regex(TEMPLATE_VARIABLE_REGEX, 'Variable names must contain only letters, numbers, and underscores')
      )
      .max(COMMUNICATION_LIMITS.TEMPLATE_VARIABLE_MAX_COUNT, `Cannot exceed ${COMMUNICATION_LIMITS.TEMPLATE_VARIABLE_MAX_COUNT} template variables`)
      .optional(),
    isActive: z.boolean().optional(),
  })
  .refine(
    (data) => {
      // HIPAA compliance check for template content
      const hipaaValidation = validateHIPAACompliance(data.content);
      return hipaaValidation.isValid;
    },
    (data) => {
      const hipaaValidation = validateHIPAACompliance(data.content);
      return {
        message: hipaaValidation.errors.join('; ') || 'HIPAA compliance validation failed',
        path: ['content'],
      };
    }
  )
  .refine(
    (data) => {
      // HIPAA compliance check for template subject
      if (data.subject) {
        const hipaaValidation = validateHIPAACompliance(data.subject);
        return hipaaValidation.isValid;
      }
      return true;
    },
    (data) => {
      if (data.subject) {
        const hipaaValidation = validateHIPAACompliance(data.subject);
        return {
          message: hipaaValidation.errors.join('; ') || 'HIPAA compliance validation failed in subject',
          path: ['subject'],
        };
      }
      return { message: '', path: ['subject'] };
    }
  );

export const updateMessageTemplateSchema = createMessageTemplateSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });

// =====================
// MESSAGE SCHEMAS
// =====================

export const createMessageSchema = z
  .object({
    recipients: z
      .array(messageRecipientSchema)
      .min(1, 'At least one recipient is required')
      .max(COMMUNICATION_LIMITS.MAX_RECIPIENTS_PER_MESSAGE, `Cannot exceed ${COMMUNICATION_LIMITS.MAX_RECIPIENTS_PER_MESSAGE} recipients per message`),
    channels: z
      .array(z.nativeEnum(MessageType))
      .min(1, 'At least one communication channel is required'),
    subject: z
      .string()
      .max(COMMUNICATION_LIMITS.MESSAGE_SUBJECT_MAX_LENGTH, `Subject cannot exceed ${COMMUNICATION_LIMITS.MESSAGE_SUBJECT_MAX_LENGTH} characters`)
      .optional(),
    content: z
      .string()
      .min(COMMUNICATION_LIMITS.MESSAGE_CONTENT_MIN_LENGTH, 'Message content is required')
      .max(COMMUNICATION_LIMITS.MESSAGE_CONTENT_MAX_LENGTH, `Content cannot exceed ${COMMUNICATION_LIMITS.MESSAGE_CONTENT_MAX_LENGTH} characters`),
    priority: z.nativeEnum(MessagePriority, {
      error: () => ({ message: 'Invalid message priority' }),
    }),
    category: z.nativeEnum(MessageCategory, {
      error: () => ({ message: 'Invalid message category' }),
    }),
    templateId: z.string().uuid('Template ID must be a valid UUID').optional(),
    scheduledAt: futureDateValidator.optional(),
    attachments: z
      .array(
        z
          .string()
          .url('Attachment must be a valid URL')
          .max(COMMUNICATION_LIMITS.ATTACHMENT_URL_MAX_LENGTH, 'Attachment URL too long')
          .refine((url) => url.startsWith('https://'), {
            message: 'Attachment URLs must use HTTPS protocol for security',
          })
      )
      .max(COMMUNICATION_LIMITS.MAX_ATTACHMENTS_PER_MESSAGE, `Cannot exceed ${COMMUNICATION_LIMITS.MAX_ATTACHMENTS_PER_MESSAGE} attachments`)
      .optional(),
    translateTo: z.array(z.string().length(2, 'Language codes must be 2 characters')).optional(),
  })
  .refine(
    (data) => {
      // HIPAA compliance check for message content
      const hipaaValidation = validateHIPAACompliance(data.content);
      return hipaaValidation.isValid;
    },
    (data) => {
      const hipaaValidation = validateHIPAACompliance(data.content);
      return {
        message: hipaaValidation.errors.join('; ') || 'HIPAA compliance validation failed',
        path: ['content'],
      };
    }
  )
  .refine(
    (data) => {
      // HIPAA compliance check for message subject
      if (data.subject) {
        const hipaaValidation = validateHIPAACompliance(data.subject);
        return hipaaValidation.isValid;
      }
      return true;
    },
    (data) => {
      if (data.subject) {
        const hipaaValidation = validateHIPAACompliance(data.subject);
        return {
          message: hipaaValidation.errors.join('; ') || 'HIPAA compliance validation failed in subject',
          path: ['subject'],
        };
      }
      return { message: '', path: ['subject'] };
    }
  )
  .refine(
    (data) => {
      // Emergency messages must have URGENT priority
      if (data.category === MessageCategory.EMERGENCY && data.priority !== MessagePriority.URGENT) {
        return false;
      }
      return true;
    },
    {
      message: 'Emergency messages must have URGENT priority',
      path: ['priority'],
    }
  )
  .refine(
    (data) => {
      // Validate SMS content length for SMS channel
      if (data.channels.includes(MessageType.SMS)) {
        return data.content.length <= COMMUNICATION_LIMITS.SMS_MAX_LENGTH;
      }
      return true;
    },
    {
      message: `SMS content exceeds maximum length of ${COMMUNICATION_LIMITS.SMS_MAX_LENGTH} characters`,
      path: ['content'],
    }
  )
  .refine(
    (data) => {
      // Validate recipients have required contact info for channels
      for (const recipient of data.recipients) {
        for (const channel of data.channels) {
          if (channel === MessageType.EMAIL && !recipient.email) {
            return false;
          }
          if ((channel === MessageType.SMS || channel === MessageType.VOICE) && !recipient.phoneNumber) {
            return false;
          }
          if (channel === MessageType.PUSH_NOTIFICATION && !recipient.pushToken) {
            return false;
          }
        }
      }
      return true;
    },
    {
      message: 'All recipients must have required contact information for selected channels',
      path: ['recipients'],
    }
  );

// =====================
// BROADCAST MESSAGE SCHEMA
// =====================

export const broadcastAudienceSchema = z.object({
  grades: z.array(z.string()).optional(),
  nurseIds: z.array(z.string().uuid()).optional(),
  studentIds: z.array(z.string().uuid()).optional(),
  includeParents: z.boolean().optional(),
  includeEmergencyContacts: z.boolean().optional(),
});

export const broadcastMessageSchema = z
  .object({
    audience: broadcastAudienceSchema,
    channels: z
      .array(z.nativeEnum(MessageType))
      .min(1, 'At least one communication channel is required'),
    subject: z
      .string()
      .max(COMMUNICATION_LIMITS.MESSAGE_SUBJECT_MAX_LENGTH, `Subject cannot exceed ${COMMUNICATION_LIMITS.MESSAGE_SUBJECT_MAX_LENGTH} characters`)
      .optional(),
    content: z
      .string()
      .min(COMMUNICATION_LIMITS.MESSAGE_CONTENT_MIN_LENGTH, 'Message content is required')
      .max(COMMUNICATION_LIMITS.MESSAGE_CONTENT_MAX_LENGTH, `Content cannot exceed ${COMMUNICATION_LIMITS.MESSAGE_CONTENT_MAX_LENGTH} characters`),
    priority: z.nativeEnum(MessagePriority, {
      error: () => ({ message: 'Invalid message priority' }),
    }),
    category: z.nativeEnum(MessageCategory, {
      error: () => ({ message: 'Invalid message category' }),
    }),
    scheduledAt: futureDateValidator.optional(),
    translateTo: z.array(z.string().length(2, 'Language codes must be 2 characters')).optional(),
  })
  .refine(
    (data) => {
      // Emergency messages must have URGENT priority
      if (data.category === MessageCategory.EMERGENCY && data.priority !== MessagePriority.URGENT) {
        return false;
      }
      return true;
    },
    {
      message: 'Emergency broadcast messages must have URGENT priority',
      path: ['priority'],
    }
  )
  .refine(
    (data) => {
      // Validate SMS content length for SMS channel
      if (data.channels.includes(MessageType.SMS)) {
        return data.content.length <= COMMUNICATION_LIMITS.SMS_MAX_LENGTH;
      }
      return true;
    },
    {
      message: `SMS content exceeds maximum length of ${COMMUNICATION_LIMITS.SMS_MAX_LENGTH} characters`,
      path: ['content'],
    }
  );

// =====================
// EMERGENCY ALERT SCHEMA
// =====================

export const emergencyAlertSchema = z
  .object({
    title: z
      .string()
      .min(1, 'Emergency alert title is required')
      .max(COMMUNICATION_LIMITS.EMERGENCY_ALERT_TITLE_MAX_LENGTH, `Title cannot exceed ${COMMUNICATION_LIMITS.EMERGENCY_ALERT_TITLE_MAX_LENGTH} characters`),
    message: z
      .string()
      .min(1, 'Emergency alert message is required')
      .max(COMMUNICATION_LIMITS.EMERGENCY_ALERT_MESSAGE_MAX_LENGTH, `Message cannot exceed ${COMMUNICATION_LIMITS.EMERGENCY_ALERT_MESSAGE_MAX_LENGTH} characters`),
    severity: z.nativeEnum(EmergencyAlertSeverity, {
      error: () => ({ message: 'Invalid severity level' }),
    }),
    audience: z.nativeEnum(EmergencyAlertAudience, {
      error: () => ({ message: 'Invalid audience type' }),
    }),
    groups: z.array(z.string().uuid()).optional(),
    channels: z
      .array(z.nativeEnum(MessageType))
      .min(1, 'At least one communication channel is required'),
  })
  .refine(
    (data) => {
      // Groups required when audience is SPECIFIC_GROUPS
      if (data.audience === EmergencyAlertAudience.SPECIFIC_GROUPS && (!data.groups || data.groups.length === 0)) {
        return false;
      }
      return true;
    },
    {
      message: 'Groups are required when audience is SPECIFIC_GROUPS',
      path: ['groups'],
    }
  );

// =====================
// MESSAGE FILTERS SCHEMA
// =====================

export const messageFiltersSchema = z.object({
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
  senderId: z.string().uuid().optional(),
  category: z.nativeEnum(MessageCategory).optional(),
  priority: z.nativeEnum(MessagePriority).optional(),
  status: z.nativeEnum(DeliveryStatus).optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
});

// =====================
// TEMPLATE FILTERS SCHEMA
// =====================

export const templateFiltersSchema = z.object({
  type: z.nativeEnum(MessageType).optional(),
  category: z.nativeEnum(MessageCategory).optional(),
  isActive: z.boolean().optional(),
});

// =====================
// TRANSLATION REQUEST SCHEMA
// =====================

export const translationRequestSchema = z.object({
  content: z.string().min(1, 'Content is required for translation').max(10000, 'Content too long for translation'),
  targetLanguage: z.string().length(2, 'Target language must be 2 characters (ISO 639-1)'),
});

// =====================
// HIPAA COMPLIANCE VALIDATION
// =====================

/**
 * Validates content for HIPAA compliance
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
    warnings,
  };
}

// =====================
// VALIDATION HELPER FUNCTIONS
// =====================

/**
 * Validates if content is appropriate for SMS channel
 */
export function validateSmsContent(content: string): {
  isValid: boolean;
  length: number;
  messageCount: number;
  warning?: string;
} {
  const length = content.length;
  const messageCount = Math.ceil(length / COMMUNICATION_LIMITS.SMS_SINGLE_MESSAGE_LENGTH);

  return {
    isValid: length <= COMMUNICATION_LIMITS.SMS_MAX_LENGTH,
    length,
    messageCount,
    warning: messageCount > 1 ? `SMS will be sent as ${messageCount} parts` : undefined,
  };
}

/**
 * Validates email subject length and provides warning
 */
export function validateEmailSubject(subject: string): {
  isValid: boolean;
  length: number;
  warning?: string;
} {
  const length = subject.length;

  return {
    isValid: length <= COMMUNICATION_LIMITS.MESSAGE_SUBJECT_MAX_LENGTH,
    length,
    warning:
      length > COMMUNICATION_LIMITS.EMAIL_SUBJECT_MAX_LENGTH
        ? `Email subject exceeds recommended ${COMMUNICATION_LIMITS.EMAIL_SUBJECT_MAX_LENGTH} characters and may be truncated`
        : undefined,
  };
}

/**
 * Extracts template variables from content
 */
export function extractTemplateVariables(content: string): string[] {
  const variableRegex = /\{\{([a-zA-Z0-9_]+)\}\}/g;
  const variables: string[] = [];
  let match;

  while ((match = variableRegex.exec(content)) !== null) {
    const variableName = match[1];
    if (!variables.includes(variableName)) {
      variables.push(variableName);
    }
  }

  return variables;
}

/**
 * Validates recipient has required contact info for channel
 */
export function validateRecipientForChannel(
  recipient: { email?: string; phoneNumber?: string; pushToken?: string },
  channel: MessageType
): {
  isValid: boolean;
  error?: string;
} {
  switch (channel) {
    case MessageType.EMAIL:
      return recipient.email
        ? { isValid: true }
        : { isValid: false, error: 'Email address required for email channel' };

    case MessageType.SMS:
    case MessageType.VOICE:
      return recipient.phoneNumber
        ? { isValid: true }
        : { isValid: false, error: `Phone number required for ${channel.toLowerCase()} channel` };

    case MessageType.PUSH_NOTIFICATION:
      return recipient.pushToken
        ? { isValid: true }
        : { isValid: false, error: 'Push token required for push notification channel' };

    default:
      return { isValid: false, error: 'Unknown channel type' };
  }
}

/**
 * Type exports for use in React Hook Form
 */
export type CreateMessageTemplateFormData = z.infer<typeof createMessageTemplateSchema>;
export type UpdateMessageTemplateFormData = z.infer<typeof updateMessageTemplateSchema>;
export type CreateMessageFormData = z.infer<typeof createMessageSchema>;
export type BroadcastMessageFormData = z.infer<typeof broadcastMessageSchema>;
export type EmergencyAlertFormData = z.infer<typeof emergencyAlertSchema>;
export type MessageFiltersFormData = z.infer<typeof messageFiltersSchema>;
export type TemplateFiltersFormData = z.infer<typeof templateFiltersSchema>;
export type TranslationRequestFormData = z.infer<typeof translationRequestSchema>;
