/**
 * Communication Messaging Validators
 * Joi validation schemas for bulk messaging and notification features
 */

import Joi from 'joi';

/**
 * BULK MESSAGE SCHEMA
 */

export const bulkMessageSchema = Joi.object({
  recipients: Joi.array().items(
    Joi.object({
      id: Joi.string().uuid().required()
        .description('Recipient user ID'),
      type: Joi.string().valid('student', 'parent', 'guardian', 'staff', 'teacher', 'nurse', 'admin').required()
        .description('Type of recipient'),
      contactMethod: Joi.string().valid('email', 'sms', 'push', 'app').optional()
        .description('Preferred contact method override'),
      language: Joi.string().valid('en', 'es', 'fr', 'de', 'zh', 'ja').default('en')
        .description('Preferred language for message')
    })
  ).min(1).max(1000).required()
    .description('Array of message recipients (max 1000 per batch)'),

  message: Joi.object({
    subject: Joi.string().min(1).max(200).required()
      .description('Message subject line'),
    body: Joi.string().min(1).max(5000).required()
      .description('Message body content'),
    htmlBody: Joi.string().max(10000).optional()
      .description('HTML formatted message body'),
    attachments: Joi.array().items(
      Joi.object({
        filename: Joi.string().max(255).required(),
        contentType: Joi.string().max(100).required(),
        size: Joi.number().max(25 * 1024 * 1024).required() // 25MB max
          .description('File size in bytes'),
        data: Joi.string().base64().required()
          .description('Base64 encoded file content')
      })
    ).max(5).optional()
      .description('Message attachments (max 5 files)')
  }).required(),

  messageType: Joi.string().valid(
    'general',
    'emergency',
    'health-alert',
    'attendance',
    'academic',
    'behavior',
    'event',
    'reminder',
    'newsletter',
    'administrative'
  ).default('general')
    .description('Type of message for categorization and routing'),

  priority: Joi.string().valid('low', 'medium', 'high', 'urgent').default('medium')
    .description('Message priority level'),

  channels: Joi.array().items(
    Joi.string().valid('email', 'sms', 'push', 'app', 'voice')
  ).min(1).default(['email'])
    .description('Communication channels to use for delivery'),

  scheduledTime: Joi.date().greater('now').optional()
    .description('Schedule message for future delivery'),

  deliveryOptions: Joi.object({
    sendImmediately: Joi.boolean().default(true)
      .description('Send immediately or queue for batch processing'),
    retryAttempts: Joi.number().min(0).max(5).default(3)
      .description('Number of retry attempts for failed deliveries'),
    batchSize: Joi.number().min(1).max(100).default(50)
      .description('Number of messages to send per batch'),
    throttleDelay: Joi.number().min(0).max(300).default(0)
      .description('Delay in seconds between batches')
  }).optional(),

  trackingOptions: Joi.object({
    trackOpens: Joi.boolean().default(true)
      .description('Track when recipients open the message'),
    trackClicks: Joi.boolean().default(true)
      .description('Track when recipients click links'),
    trackReplies: Joi.boolean().default(true)
      .description('Track replies to the message'),
    requireDeliveryConfirmation: Joi.boolean().default(false)
      .description('Require delivery confirmation for high-priority messages')
  }).optional(),

  compliance: Joi.object({
    ferpaCompliant: Joi.boolean().default(true)
      .description('Message complies with FERPA requirements'),
    hipaaCompliant: Joi.boolean().when('messageType', {
      is: 'health-alert',
      then: Joi.boolean().valid(true).required(),
      otherwise: Joi.boolean().optional()
    })
      .description('Message complies with HIPAA requirements for health information'),
    retentionPeriod: Joi.number().min(30).max(2555).default(365)
      .description('Message retention period in days'),
    auditTrail: Joi.boolean().default(true)
      .description('Maintain audit trail for compliance')
  }).optional()
});

/**
 * VALIDATION FUNCTIONS
 */

export const validateBulkMessage = (payload: any) => {
  return bulkMessageSchema.validate(payload, {
    abortEarly: false,
    stripUnknown: true,
    allowUnknown: false
  });
};

/**
 * QUERY PARAMETER SCHEMAS
 */

export const messageHistoryQuerySchema = Joi.object({
  startDate: Joi.date().optional()
    .description('Filter messages sent after this date'),
  endDate: Joi.date().optional()
    .description('Filter messages sent before this date'),
  messageType: Joi.string().valid(
    'general', 'emergency', 'health-alert', 'attendance', 'academic', 
    'behavior', 'event', 'reminder', 'newsletter', 'administrative'
  ).optional(),
  priority: Joi.string().valid('low', 'medium', 'high', 'urgent').optional(),
  status: Joi.string().valid('sent', 'pending', 'failed', 'scheduled').optional(),
  limit: Joi.number().min(1).max(100).default(25),
  offset: Joi.number().min(0).default(0)
});

export const validateMessageHistoryQuery = (query: any) => {
  return messageHistoryQuerySchema.validate(query);
};
