/**
 * Broadcasts Validators
 * Joi validation schemas for broadcast and scheduled message operations
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
 * Audience targeting schema
 */
const audienceSchema = Joi.object({
  grades: Joi.array()
    .items(Joi.string().valid('K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'))
    .optional()
    .description('Filter by grade levels'),

  nurseIds: Joi.array()
    .items(Joi.string().uuid())
    .optional()
    .description('Filter by assigned nurse IDs'),

  studentIds: Joi.array()
    .items(Joi.string().uuid())
    .max(1000)
    .optional()
    .description('Specific student IDs (max 1000)'),

  includeEmergencyContacts: Joi.boolean()
    .optional()
    .default(false)
    .description('Include students emergency contacts'),

  includeParents: Joi.boolean()
    .optional()
    .default(false)
    .description('Include student parents/guardians'),

  schoolIds: Joi.array()
    .items(Joi.string().uuid())
    .optional()
    .description('Filter by school IDs')
}).min(1); // At least one audience filter must be provided

/**
 * Query parameter schemas
 */

export const listBroadcastsQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  category: messageCategorySchema.optional(),
  priority: messagePrioritySchema.optional(),
  dateFrom: Joi.date().iso().optional(),
  dateTo: Joi.date().iso().optional()
});

export const getBroadcastRecipientsQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(50)
});

export const listScheduledQuerySchema = Joi.object({
  status: Joi.string().valid('PENDING', 'PROCESSING', 'SENT', 'FAILED', 'CANCELLED', 'PAUSED').optional(),
  scheduleType: Joi.string().valid('ONE_TIME', 'RECURRING', 'CAMPAIGN').optional(),
  campaignId: Joi.string().optional(),
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().optional()
});

/**
 * Parameter schemas
 */

export const broadcastIdParamSchema = Joi.object({
  id: Joi.string().uuid().required()
    .description('Broadcast message UUID')
});

/**
 * Payload schemas
 */

export const createBroadcastSchema = Joi.object({
  audience: audienceSchema
    .required()
    .description('Audience targeting criteria'),

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
    .description('Broadcast subject (required for EMAIL channel)'),

  content: Joi.string()
    .trim()
    .min(1)
    .max(5000)
    .required()
    .description('Broadcast message content'),

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
    .description('Schedule broadcast for future delivery'),

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

  // Emergency broadcasts should have URGENT priority
  if (value.category === 'EMERGENCY' && value.priority !== 'URGENT') {
    return helpers.error('any.custom', {
      message: 'Emergency broadcasts must have URGENT priority'
    });
  }

  return value;
});

export const scheduleMessageSchema = Joi.object({
  subject: Joi.string()
    .trim()
    .max(200)
    .required()
    .description('Scheduled message subject'),

  body: Joi.string()
    .trim()
    .min(1)
    .max(5000)
    .required()
    .description('Scheduled message body'),

  recipientType: Joi.string()
    .valid('ALL_PARENTS', 'SPECIFIC_USERS', 'STUDENT_PARENTS', 'GRADE_LEVEL', 'CUSTOM_GROUP')
    .required()
    .description('Type of recipients'),

  recipientIds: Joi.array()
    .items(Joi.string().uuid())
    .when('recipientType', {
      is: 'SPECIFIC_USERS',
      then: Joi.required(),
      otherwise: Joi.optional()
    })
    .description('Specific recipient IDs (required for SPECIFIC_USERS type)'),

  recipientFilter: Joi.object({
    studentIds: Joi.array().items(Joi.string().uuid()).optional(),
    gradeLevel: Joi.string().valid('K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12').optional(),
    schoolId: Joi.string().uuid().optional(),
    tags: Joi.array().items(Joi.string()).optional()
  }).optional()
    .description('Advanced recipient filtering'),

  channels: Joi.array()
    .items(Joi.string().valid('EMAIL', 'SMS', 'PUSH', 'PORTAL'))
    .min(1)
    .unique()
    .required()
    .description('Delivery channels'),

  scheduledFor: Joi.date()
    .iso()
    .min('now')
    .required()
    .description('When to send the message'),

  timezone: Joi.string()
    .optional()
    .default('America/New_York')
    .description('Timezone for scheduled time'),

  priority: Joi.string()
    .valid('LOW', 'NORMAL', 'HIGH')
    .optional()
    .default('NORMAL')
    .description('Message priority'),

  templateId: Joi.string()
    .uuid()
    .optional()
    .description('Template ID to use'),

  templateVariables: Joi.object()
    .pattern(Joi.string(), Joi.string())
    .optional()
    .description('Variables for template substitution'),

  throttle: Joi.object({
    maxPerMinute: Joi.number().integer().min(1).max(1000).default(100),
    maxPerHour: Joi.number().integer().min(1).max(10000).default(1000)
  }).optional()
    .description('Rate limiting configuration'),

  schoolId: Joi.string()
    .uuid()
    .optional()
    .description('School ID for multi-tenant support')
}).custom((value, helpers) => {
  // Validate scheduledFor is in the future
  if (new Date(value.scheduledFor) <= new Date()) {
    return helpers.error('any.custom', {
      message: 'scheduledFor must be in the future'
    });
  }

  return value;
});

export const scheduleRecurringMessageSchema = Joi.object({
  subject: Joi.string()
    .trim()
    .max(200)
    .required()
    .description('Message subject'),

  body: Joi.string()
    .trim()
    .min(1)
    .max(5000)
    .required()
    .description('Message body'),

  recipientType: Joi.string()
    .valid('ALL_PARENTS', 'SPECIFIC_USERS', 'STUDENT_PARENTS', 'GRADE_LEVEL', 'CUSTOM_GROUP')
    .required()
    .description('Type of recipients'),

  recipientIds: Joi.array()
    .items(Joi.string().uuid())
    .optional()
    .description('Specific recipient IDs'),

  recipientFilter: Joi.object({
    studentIds: Joi.array().items(Joi.string().uuid()).optional(),
    gradeLevel: Joi.string().optional(),
    schoolId: Joi.string().uuid().optional(),
    tags: Joi.array().items(Joi.string()).optional()
  }).optional(),

  channels: Joi.array()
    .items(Joi.string().valid('EMAIL', 'SMS', 'PUSH', 'PORTAL'))
    .min(1)
    .required()
    .description('Delivery channels'),

  startDate: Joi.date()
    .iso()
    .min('now')
    .required()
    .description('When to start recurring messages'),

  recurrence: Joi.object({
    pattern: Joi.string().valid('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY', 'CUSTOM').required(),
    interval: Joi.number().integer().min(1).max(365).required()
      .description('Repeat every N days/weeks/months'),
    endDate: Joi.date().iso().optional(),
    endAfterOccurrences: Joi.number().integer().min(1).max(1000).optional(),
    daysOfWeek: Joi.array().items(Joi.number().integer().min(0).max(6)).optional()
      .description('0=Sunday, 1=Monday, etc'),
    dayOfMonth: Joi.number().integer().min(1).max(31).optional()
  }).required()
    .description('Recurrence pattern configuration'),

  schoolId: Joi.string().uuid().optional()
}).custom((value, helpers) => {
  // Validate startDate is in the future
  if (new Date(value.startDate) <= new Date()) {
    return helpers.error('any.custom', {
      message: 'startDate must be in the future'
    });
  }

  // Validate recurrence has either endDate or endAfterOccurrences
  if (!value.recurrence.endDate && !value.recurrence.endAfterOccurrences) {
    return helpers.error('any.custom', {
      message: 'Recurrence must have either endDate or endAfterOccurrences'
    });
  }

  return value;
});

export const emergencyAlertSchema = Joi.object({
  title: Joi.string()
    .trim()
    .min(5)
    .max(100)
    .required()
    .description('Alert title'),

  message: Joi.string()
    .trim()
    .min(10)
    .max(2000)
    .required()
    .description('Alert message'),

  severity: Joi.string()
    .valid('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')
    .required()
    .description('Alert severity level'),

  audience: Joi.string()
    .valid('ALL_STAFF', 'NURSES_ONLY', 'SPECIFIC_GROUPS')
    .required()
    .description('Target audience'),

  channels: Joi.array()
    .items(messageChannelSchema)
    .min(1)
    .unique()
    .required()
    .description('Communication channels')
}).custom((value, helpers) => {
  // Critical and high severity alerts should use multiple channels
  if ((value.severity === 'CRITICAL' || value.severity === 'HIGH') && value.channels.length < 2) {
    return helpers.error('any.custom', {
      message: 'Critical and high severity alerts should use at least 2 communication channels'
    });
  }

  return value;
});
