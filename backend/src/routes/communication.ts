/**
 * WC-RTE-COM-031 | Multi-Channel Communication & Notification API Routes
 * Purpose: Comprehensive communication system with message templates, multi-channel delivery (SMS/Email/Voice/Push), emergency alerts, scheduling, translation, and delivery tracking
 * Upstream: ../services/communicationService, JWT authentication | Dependencies: @hapi/hapi, communication service, joi validation
 * Downstream: Notification interface, emergency alert system, message dashboard | Called by: Notification components, emergency management, communication admin
 * Related: Emergency contact routes, incident reporting, user management, audit logging
 * Exports: communicationRoutes (13 route handlers) | Key Services: Template management, message delivery, emergency alerts, scheduling, statistics, translation
 * Last Updated: 2025-10-18 | File Type: .ts | Security: JWT authentication, role-based message sending permissions
 * Critical Path: Auth validation → Message composition → Channel selection → Delivery processing → Status tracking → Audit logging
 * LLM Context: Healthcare communication platform with HIPAA-compliant messaging, emergency notification system, multi-language support, scheduled delivery, delivery confirmation tracking, and comprehensive audit trails for all patient/family communications
 */

import { ServerRoute } from '@hapi/hapi';
import { CommunicationService } from '../services/communicationService';
import Joi from 'joi';

// Get message templates
const getMessageTemplatesHandler = async (request: any, h: any) => {
  try {
    const type = request.query.type;
    const category = request.query.category;
    const isActive = request.query.isActive !== 'false';

    const templates = await CommunicationService.getMessageTemplates(type, category, isActive);

    return h.response({
      success: true,
      data: { templates }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Update message template
const updateMessageTemplateHandler = async (request: any, h: any) => {
  try {
    const { id } = request.params;
    const template = await CommunicationService.updateMessageTemplate(id, request.payload);

    return h.response({
      success: true,
      data: { template }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Delete message template
const deleteMessageTemplateHandler = async (request: any, h: any) => {
  try {
    const { id } = request.params;
    const result = await CommunicationService.deleteMessageTemplate(id);

    return h.response({
      success: true,
      data: result
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Create message template
const createMessageTemplateHandler = async (request: any, h: any) => {
  try {
    const createdBy = request.auth.credentials?.userId;

    const template = await CommunicationService.createMessageTemplate({
      ...request.payload,
      createdBy
    });

    return h.response({
      success: true,
      data: { template }
    }).code(201);
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Send message to specific recipients
const sendMessageHandler = async (request: any, h: any) => {
  try {
    const senderId = request.auth.credentials?.userId;

    const result = await CommunicationService.sendMessage({
      ...request.payload,
      senderId,
      scheduledAt: request.payload.scheduledAt ? new Date(request.payload.scheduledAt) : undefined
    });

    return h.response({
      success: true,
      data: result
    }).code(201);
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Send broadcast message
const sendBroadcastMessageHandler = async (request: any, h: any) => {
  try {
    const senderId = request.auth.credentials?.userId;

    const result = await CommunicationService.sendBroadcastMessage({
      ...request.payload,
      senderId,
      scheduledAt: request.payload.scheduledAt ? new Date(request.payload.scheduledAt) : undefined
    });

    return h.response({
      success: true,
      data: result
    }).code(201);
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Get messages
const getMessagesHandler = async (request: any, h: any) => {
  try {
    const page = parseInt(request.query.page) || 1;
    const limit = parseInt(request.query.limit) || 20;

    const filters: any = {};
    if (request.query.senderId) filters.senderId = request.query.senderId;
    if (request.query.category) filters.category = request.query.category;
    if (request.query.priority) filters.priority = request.query.priority;
    if (request.query.dateFrom) filters.dateFrom = new Date(request.query.dateFrom);
    if (request.query.dateTo) filters.dateTo = new Date(request.query.dateTo);

    const result = await CommunicationService.getMessages(page, limit, filters);

    return h.response({
      success: true,
      data: result
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Get message delivery status
const getMessageDeliveryStatusHandler = async (request: any, h: any) => {
  try {
    const { messageId } = request.params;
    const result = await CommunicationService.getMessageDeliveryStatus(messageId);

    return h.response({
      success: true,
      data: result
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Send emergency alert
const sendEmergencyAlertHandler = async (request: any, h: any) => {
  try {
    const senderId = request.auth.credentials?.userId;

    const result = await CommunicationService.sendEmergencyAlert({
      ...request.payload,
      senderId
    });

    return h.response({
      success: true,
      data: result
    }).code(201);
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Process scheduled messages
const processScheduledMessagesHandler = async (request: any, h: any) => {
  try {
    const processedCount = await CommunicationService.processScheduledMessages();

    return h.response({
      success: true,
      data: { processedCount }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Get communication statistics
const getCommunicationStatisticsHandler = async (request: any, h: any) => {
  try {
    const dateFrom = request.query.dateFrom ? new Date(request.query.dateFrom) : undefined;
    const dateTo = request.query.dateTo ? new Date(request.query.dateTo) : undefined;

    const stats = await CommunicationService.getCommunicationStatistics(dateFrom, dateTo);

    return h.response({
      success: true,
      data: stats
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Translate message
const translateMessageHandler = async (request: any, h: any) => {
  try {
    const { content, targetLanguage } = request.payload;
    const translated = await CommunicationService.translateMessage(content, targetLanguage);

    return h.response({
      success: true,
      data: { translated }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Get communication options (channels, notification types, priority levels, etc.)
const getCommunicationOptionsHandler = async (request: any, h: any) => {
  try {
    const options = {
      channels: [
        {
          id: 'sms',
          label: 'SMS',
          value: 'sms',
          description: 'Send text message notifications',
          enabled: true,
          icon: 'message-circle'
        },
        {
          id: 'email',
          label: 'Email',
          value: 'email',
          description: 'Send email notifications',
          enabled: true,
          icon: 'mail'
        },
        {
          id: 'voice',
          label: 'Voice Call',
          value: 'voice',
          description: 'Automated voice call',
          enabled: true,
          icon: 'phone'
        }
      ],
      notificationTypes: [
        {
          id: 'emergency',
          label: 'Emergency',
          value: 'emergency',
          description: 'Critical emergency notifications',
          defaultPriority: 'critical',
          requiresApproval: false
        },
        {
          id: 'health',
          label: 'Health Update',
          value: 'health',
          description: 'General health updates and alerts',
          defaultPriority: 'high',
          requiresApproval: false
        },
        {
          id: 'medication',
          label: 'Medication',
          value: 'medication',
          description: 'Medication-related notifications',
          defaultPriority: 'medium',
          requiresApproval: false
        },
        {
          id: 'general',
          label: 'General',
          value: 'general',
          description: 'General information and updates',
          defaultPriority: 'low',
          requiresApproval: false
        }
      ],
      priorityLevels: [
        {
          id: 'low',
          label: 'Low',
          value: 'low',
          description: 'Non-urgent information',
          color: 'gray'
        },
        {
          id: 'medium',
          label: 'Medium',
          value: 'medium',
          description: 'Standard priority',
          color: 'blue'
        },
        {
          id: 'high',
          label: 'High',
          value: 'high',
          description: 'Important, requires attention',
          color: 'orange'
        },
        {
          id: 'critical',
          label: 'Critical',
          value: 'critical',
          description: 'Urgent, immediate action required',
          color: 'red'
        }
      ],
      verificationMethods: [
        {
          id: 'sms',
          label: 'SMS',
          value: 'sms'
        },
        {
          id: 'email',
          label: 'Email',
          value: 'email'
        },
        {
          id: 'voice',
          label: 'Voice Call',
          value: 'voice'
        }
      ]
    };

    return h.response({
      success: true,
      data: options
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Define communication routes for Hapi
export const communicationRoutes: ServerRoute[] = [
  {
    method: 'GET',
    path: '/api/communication/templates',
    handler: getMessageTemplatesHandler,
    options: {
      auth: 'jwt',
      validate: {
        query: Joi.object({
          type: Joi.string().valid('EMAIL', 'SMS', 'PUSH_NOTIFICATION', 'VOICE').optional(),
          category: Joi.string().valid('EMERGENCY', 'HEALTH_UPDATE', 'APPOINTMENT_REMINDER', 'MEDICATION_REMINDER', 'GENERAL', 'INCIDENT_NOTIFICATION', 'COMPLIANCE').optional(),
          isActive: Joi.boolean().default(true)
        })
      }
    }
  },
  {
    method: 'PUT',
    path: '/api/communication/templates/{id}',
    handler: updateMessageTemplateHandler,
    options: {
      auth: 'jwt',
      validate: {
        payload: Joi.object({
          name: Joi.string().trim().optional(),
          content: Joi.string().trim().optional(),
          type: Joi.string().valid('EMAIL', 'SMS', 'PUSH_NOTIFICATION', 'VOICE').optional(),
          category: Joi.string().valid('EMERGENCY', 'HEALTH_UPDATE', 'APPOINTMENT_REMINDER', 'MEDICATION_REMINDER', 'GENERAL', 'INCIDENT_NOTIFICATION', 'COMPLIANCE').optional(),
          variables: Joi.array().optional(),
          isActive: Joi.boolean().optional()
        })
      }
    }
  },
  {
    method: 'DELETE',
    path: '/api/communication/templates/{id}',
    handler: deleteMessageTemplateHandler,
    options: {
      auth: 'jwt'
    }
  },
  {
    method: 'POST',
    path: '/api/communication/templates',
    handler: createMessageTemplateHandler,
    options: {
      auth: 'jwt',
      validate: {
        payload: Joi.object({
          name: Joi.string().trim().required(),
          content: Joi.string().trim().required(),
          type: Joi.string().valid('EMAIL', 'SMS', 'PUSH_NOTIFICATION', 'VOICE').required(),
          category: Joi.string().valid('EMERGENCY', 'HEALTH_UPDATE', 'APPOINTMENT_REMINDER', 'MEDICATION_REMINDER', 'GENERAL', 'INCIDENT_NOTIFICATION', 'COMPLIANCE').required(),
          variables: Joi.array().optional()
        })
      }
    }
  },
  {
    method: 'POST',
    path: '/api/communication/send',
    handler: sendMessageHandler,
    options: {
      auth: 'jwt',
      validate: {
        payload: Joi.object({
          recipients: Joi.array().items(Joi.object({
            type: Joi.string().valid('STUDENT', 'EMERGENCY_CONTACT', 'PARENT', 'NURSE', 'ADMIN').required(),
            id: Joi.string().required()
          })).min(1).required(),
          channels: Joi.array().items(Joi.string().valid('EMAIL', 'SMS', 'PUSH_NOTIFICATION', 'VOICE')).min(1).required(),
          content: Joi.string().trim().required(),
          priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH', 'URGENT').required(),
          category: Joi.string().valid('EMERGENCY', 'HEALTH_UPDATE', 'APPOINTMENT_REMINDER', 'MEDICATION_REMINDER', 'GENERAL', 'INCIDENT_NOTIFICATION', 'COMPLIANCE').required(),
          scheduledAt: Joi.date().iso().optional()
        })
      }
    }
  },
  {
    method: 'POST',
    path: '/api/communication/broadcast',
    handler: sendBroadcastMessageHandler,
    options: {
      auth: 'jwt',
      validate: {
        payload: Joi.object({
          audience: Joi.object().required(),
          channels: Joi.array().items(Joi.string().valid('EMAIL', 'SMS', 'PUSH_NOTIFICATION', 'VOICE')).min(1).required(),
          content: Joi.string().trim().required(),
          priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH', 'URGENT').required(),
          category: Joi.string().valid('EMERGENCY', 'HEALTH_UPDATE', 'APPOINTMENT_REMINDER', 'MEDICATION_REMINDER', 'GENERAL', 'INCIDENT_NOTIFICATION', 'COMPLIANCE').required(),
          scheduledAt: Joi.date().iso().optional()
        })
      }
    }
  },
  {
    method: 'GET',
    path: '/api/communication/messages',
    handler: getMessagesHandler,
    options: {
      auth: 'jwt',
      validate: {
        query: Joi.object({
          page: Joi.number().integer().min(1).default(1),
          limit: Joi.number().integer().min(1).max(100).default(20),
          senderId: Joi.string().optional(),
          category: Joi.string().optional(),
          priority: Joi.string().optional(),
          dateFrom: Joi.date().iso().optional(),
          dateTo: Joi.date().iso().optional()
        })
      }
    }
  },
  {
    method: 'GET',
    path: '/api/communication/messages/{messageId}/delivery',
    handler: getMessageDeliveryStatusHandler,
    options: {
      auth: 'jwt'
    }
  },
  {
    method: 'POST',
    path: '/api/communication/emergency-alert',
    handler: sendEmergencyAlertHandler,
    options: {
      auth: 'jwt',
      validate: {
        payload: Joi.object({
          title: Joi.string().trim().required(),
          message: Joi.string().trim().required(),
          severity: Joi.string().valid('LOW', 'MEDIUM', 'HIGH', 'CRITICAL').required(),
          audience: Joi.string().valid('ALL_STAFF', 'NURSES_ONLY', 'SPECIFIC_GROUPS').required(),
          channels: Joi.array().items(Joi.string().valid('EMAIL', 'SMS', 'PUSH_NOTIFICATION', 'VOICE')).min(1).required()
        })
      }
    }
  },
  {
    method: 'POST',
    path: '/api/communication/process-scheduled',
    handler: processScheduledMessagesHandler,
    options: {
      auth: 'jwt'
    }
  },
  {
    method: 'GET',
    path: '/api/communication/statistics',
    handler: getCommunicationStatisticsHandler,
    options: {
      auth: 'jwt',
      validate: {
        query: Joi.object({
          dateFrom: Joi.date().iso().optional(),
          dateTo: Joi.date().iso().optional()
        })
      }
    }
  },
  {
    method: 'POST',
    path: '/api/communication/translate',
    handler: translateMessageHandler,
    options: {
      auth: 'jwt',
      validate: {
        payload: Joi.object({
          content: Joi.string().trim().required(),
          targetLanguage: Joi.string().trim().required()
        })
      }
    }
  },
  {
    method: 'GET',
    path: '/api/communication/options',
    handler: getCommunicationOptionsHandler,
    options: {
      auth: 'jwt',
      description: 'Get communication options including channels, notification types, and priority levels'
    }
  }
];
