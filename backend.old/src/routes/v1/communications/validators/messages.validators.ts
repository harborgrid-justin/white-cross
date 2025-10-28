/**
 * Messages Validators
 * Joi validation schemas for message operations
 */

import Joi from 'joi';

/**
 * Message channel types
 */
const messageChannelSchema = Joi.string().valid('EMAIL', 'SMS', 'PUSH_NOTIFICATION', 'VOICE');

/**
 * Message category types
 */
const messageCategorySchema = Joi.string().valid(
  'EMERGENCY',
  'HEALTH_UPDATE',
  'APPOINTMENT_REMINDER',
  'MEDICATION_REMINDER',
  'GENERAL',
  'INCIDENT_NOTIFICATION',
  'COMPLIANCE'
);

/**
 * Message priority levels
 */
const messagePrioritySchema = Joi.string().valid('LOW', 'MEDIUM', 'HIGH', 'URGENT');

/**
 * Recipient type
 */
const recipientTypeSchema = Joi.string().valid(
  'STUDENT',
  'EMERGENCY_CONTACT',
  'PARENT',
  'NURSE',
  'ADMIN'
);

/**
 * Recipient object schema
 */
const recipientSchema = Joi.object({
  type: recipientTypeSchema.required(),
  id: Joi.string().uuid().required(),
  email: Joi.string().email().optional(),
  phoneNumber: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).optional(),
  pushToken: Joi.string().optional()
});

/**
 * Query parameter schemas
 */

export const listMessagesQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  senderId: Joi.string().uuid().optional(),
  recipientId: Joi.string().uuid().optional(),
  category: messageCategorySchema.optional(),
  priority: messagePrioritySchema.optional(),
  status: Joi.string().valid('PENDING', 'SENT', 'DELIVERED', 'FAILED').optional(),
  dateFrom: Joi.date().iso().optional(),
  dateTo: Joi.date().iso().optional()
});

export const listTemplatesQuerySchema = Joi.object({
  type: messageChannelSchema.optional(),
  category: messageCategorySchema.optional(),
  isActive: Joi.string().valid('true', 'false').default('true')
});

export const getInboxQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20)
});

export const getSentQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20)
});

export const statisticsQuerySchema = Joi.object({
  dateFrom: Joi.date().iso().optional(),
  dateTo: Joi.date().iso().optional(),
  senderId: Joi.string().uuid().optional()
});

/**
 * Parameter schemas
 */

export const messageIdParamSchema = Joi.object({
  id: Joi.string().uuid().required()
    .description('Message UUID')
});

export const deliveryStatusParamSchema = Joi.object({
  messageId: Joi.string().uuid().required()
    .description('Message UUID')
});

/**
 * Payload schemas
 */

export const sendMessageSchema = Joi.object({
  recipients: Joi.array()
    .items(recipientSchema)
    .min(1)
    .max(100)
    .required()
    .description('Array of message recipients (max 100 for direct messages)'),

  channels: Joi.array()
    .items(messageChannelSchema)
    .min(1)
    .unique()
    .required()
    .description('Communication channels to use'),

  subject: Joi.string()
    .trim()
    .max(200)
    .optional()
    .description('Message subject (required for EMAIL channel)'),

  content: Joi.string()
    .trim()
    .min(1)
    .max(5000)
    .required()
    .description('Message content'),

  priority: messagePrioritySchema
    .required()
    .description('Message priority level'),

  category: messageCategorySchema
    .required()
    .description('Message category'),

  templateId: Joi.string()
    .uuid()
    .optional()
    .description('Optional template ID to use'),

  scheduledAt: Joi.date()
    .iso()
    .min('now')
    .optional()
    .description('Schedule message for future delivery'),

  attachments: Joi.array()
    .items(Joi.object({
      filename: Joi.string().required(),
      url: Joi.string().uri().required(),
      mimeType: Joi.string().required(),
      size: Joi.number().integer().positive().max(10485760).required() // 10MB max
    }))
    .max(5)
    .optional()
    .description('Message attachments (max 5, 10MB each)')
}).custom((value, helpers) => {
  // Validate that EMAIL channel requires subject
  if (value.channels && value.channels.includes('EMAIL') && !value.subject) {
    return helpers.error('any.custom', {
      message: 'Subject is required when using EMAIL channel'
    });
  }

  // Validate scheduledAt is in the future
  if (value.scheduledAt && new Date(value.scheduledAt) <= new Date()) {
    return helpers.error('any.custom', {
      message: 'scheduledAt must be in the future'
    });
  }

  return value;
});

export const updateMessageSchema = Joi.object({
  subject: Joi.string()
    .trim()
    .max(200)
    .optional()
    .description('Updated message subject'),

  content: Joi.string()
    .trim()
    .min(1)
    .max(5000)
    .optional()
    .description('Updated message content'),

  priority: messagePrioritySchema
    .optional()
    .description('Updated message priority'),

  scheduledAt: Joi.date()
    .iso()
    .min('now')
    .optional()
    .description('Updated scheduled delivery time'),

  attachments: Joi.array()
    .items(Joi.object({
      filename: Joi.string().required(),
      url: Joi.string().uri().required(),
      mimeType: Joi.string().required(),
      size: Joi.number().integer().positive().max(10485760).required()
    }))
    .max(5)
    .optional()
    .description('Updated message attachments')
}).min(1); // At least one field must be provided

export const replyToMessageSchema = Joi.object({
  content: Joi.string()
    .trim()
    .min(1)
    .max(5000)
    .required()
    .description('Reply message content'),

  channels: Joi.array()
    .items(messageChannelSchema)
    .min(1)
    .unique()
    .optional()
    .default(['EMAIL'])
    .description('Communication channels to use for reply'),

  priority: messagePrioritySchema
    .optional()
    .default('MEDIUM')
    .description('Reply message priority')
});

export const createTemplateSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(3)
    .max(100)
    .required()
    .description('Template name'),

  subject: Joi.string()
    .trim()
    .max(200)
    .optional()
    .description('Template subject (for EMAIL templates)'),

  content: Joi.string()
    .trim()
    .min(1)
    .max(5000)
    .required()
    .description('Template content with variables like {{studentName}}'),

  type: messageChannelSchema
    .required()
    .description('Primary message type for this template'),

  category: messageCategorySchema
    .required()
    .description('Template category'),

  variables: Joi.array()
    .items(Joi.string())
    .optional()
    .description('List of variable names used in the template'),

  isActive: Joi.boolean()
    .optional()
    .default(true)
    .description('Whether template is active')
});

export const updateTemplateSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(3)
    .max(100)
    .optional()
    .description('Updated template name'),

  subject: Joi.string()
    .trim()
    .max(200)
    .optional()
    .description('Updated template subject'),

  content: Joi.string()
    .trim()
    .min(1)
    .max(5000)
    .optional()
    .description('Updated template content'),

  type: messageChannelSchema
    .optional()
    .description('Updated message type'),

  category: messageCategorySchema
    .optional()
    .description('Updated template category'),

  variables: Joi.array()
    .items(Joi.string())
    .optional()
    .description('Updated list of variables'),

  isActive: Joi.boolean()
    .optional()
    .description('Updated active status')
}).min(1); // At least one field must be provided
