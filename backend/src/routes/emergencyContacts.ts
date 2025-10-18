/**
 * WC-RTE-EMG-036 | emergencyContacts.ts - Emergency Contact Management API Routes
 * Purpose: Hapi.js routes for comprehensive emergency contact lifecycle, multi-channel notifications, and crisis communication for student safety
 * Upstream: ../services/emergencyContactService/EmergencyContactService | Dependencies: @hapi/hapi, joi
 * Downstream: Frontend emergency management UI, notification systems, student safety workflows, crisis response | Called by: Emergency interfaces, safety protocols
 * Related: ../services/emergencyContactService.ts, students.ts, communication.ts, incidentReports.ts, healthRecords.ts
 * Exports: emergencyContactRoutes | Key Services: Contact CRUD, priority management, multi-channel notifications, contact verification, statistics
 * Last Updated: 2025-10-18 | File Type: .ts | Lines: ~200
 * Critical Path: Authentication → Contact validation → Notification delivery → Response tracking → Crisis escalation
 * LLM Context: Student safety emergency contact system with 8 endpoints for contact management, SMS/email/voice notifications, verification, and crisis communication
 */

import { ServerRoute } from '@hapi/hapi';
import { EmergencyContactService } from '../services/emergencyContactService';
import Joi from 'joi';

// Get emergency contacts for a student
const getStudentEmergencyContactsHandler = async (request: any, h: any) => {
  try {
    const { studentId } = request.params;
    const contacts = await EmergencyContactService.getStudentEmergencyContacts(studentId);

    return h.response({
      success: true,
      data: { contacts }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Create new emergency contact
const createEmergencyContactHandler = async (request: any, h: any) => {
  try {
    const contact = await EmergencyContactService.createEmergencyContact(request.payload);

    return h.response({
      success: true,
      data: { contact }
    }).code(201);
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Update emergency contact
const updateEmergencyContactHandler = async (request: any, h: any) => {
  try {
    const { id } = request.params;
    const contact = await EmergencyContactService.updateEmergencyContact(id, request.payload);

    return h.response({
      success: true,
      data: { contact }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Delete emergency contact
const deleteEmergencyContactHandler = async (request: any, h: any) => {
  try {
    const { id } = request.params;
    await EmergencyContactService.deleteEmergencyContact(id);

    return h.response({
      success: true,
      message: 'Emergency contact deleted successfully'
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Send emergency notification to all contacts
const sendEmergencyNotificationHandler = async (request: any, h: any) => {
  try {
    const { studentId } = request.params;
    const results = await EmergencyContactService.sendEmergencyNotification(studentId, {
      ...request.payload,
      studentId
    });

    return h.response({
      success: true,
      data: { results }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Send notification to specific contact
const sendContactNotificationHandler = async (request: any, h: any) => {
  try {
    const { contactId } = request.params;
    const result = await EmergencyContactService.sendContactNotification(contactId, {
      ...request.payload,
      studentId: '' // Will be fetched from contact
    });

    return h.response({
      success: true,
      data: { result }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Verify contact information
const verifyContactHandler = async (request: any, h: any) => {
  try {
    const { contactId } = request.params;
    const { method } = request.payload;

    const result = await EmergencyContactService.verifyContact(contactId, method);

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

// Get contact statistics
const getContactStatisticsHandler = async (request: any, h: any) => {
  try {
    const stats = await EmergencyContactService.getContactStatistics();

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

// Define emergency contact routes for Hapi
export const emergencyContactRoutes: ServerRoute[] = [
  {
    method: 'GET',
    path: '/api/emergency-contacts/student/{studentId}',
    handler: getStudentEmergencyContactsHandler,
    options: {
      auth: 'jwt'
    }
  },
  {
    method: 'POST',
    path: '/api/emergency-contacts',
    handler: createEmergencyContactHandler,
    options: {
      auth: 'jwt',
      validate: {
        payload: Joi.object({
          studentId: Joi.string().required(),
          firstName: Joi.string().trim().required(),
          lastName: Joi.string().trim().required(),
          relationship: Joi.string().trim().required(),
          phoneNumber: Joi.string().trim().required(),
          priority: Joi.string().valid('PRIMARY', 'SECONDARY', 'EMERGENCY_ONLY').required(),
          email: Joi.string().email().optional()
        })
      }
    }
  },
  {
    method: 'PUT',
    path: '/api/emergency-contacts/{id}',
    handler: updateEmergencyContactHandler,
    options: {
      auth: 'jwt',
      validate: {
        payload: Joi.object({
          firstName: Joi.string().trim().optional(),
          lastName: Joi.string().trim().optional(),
          relationship: Joi.string().trim().optional(),
          phoneNumber: Joi.string().trim().optional(),
          priority: Joi.string().valid('PRIMARY', 'SECONDARY', 'EMERGENCY_ONLY').optional(),
          email: Joi.string().email().optional(),
          isActive: Joi.boolean().optional()
        })
      }
    }
  },
  {
    method: 'DELETE',
    path: '/api/emergency-contacts/{id}',
    handler: deleteEmergencyContactHandler,
    options: {
      auth: 'jwt'
    }
  },
  {
    method: 'POST',
    path: '/api/emergency-contacts/notify/{studentId}',
    handler: sendEmergencyNotificationHandler,
    options: {
      auth: 'jwt',
      validate: {
        payload: Joi.object({
          message: Joi.string().trim().required(),
          type: Joi.string().valid('emergency', 'health', 'medication', 'general').required(),
          priority: Joi.string().valid('low', 'medium', 'high', 'critical').required(),
          channels: Joi.array().items(Joi.string().valid('sms', 'email', 'voice')).required()
        })
      }
    }
  },
  {
    method: 'POST',
    path: '/api/emergency-contacts/notify/contact/{contactId}',
    handler: sendContactNotificationHandler,
    options: {
      auth: 'jwt',
      validate: {
        payload: Joi.object({
          message: Joi.string().trim().required(),
          type: Joi.string().valid('emergency', 'health', 'medication', 'general').required(),
          priority: Joi.string().valid('low', 'medium', 'high', 'critical').required(),
          channels: Joi.array().items(Joi.string().valid('sms', 'email', 'voice')).required()
        })
      }
    }
  },
  {
    method: 'POST',
    path: '/api/emergency-contacts/verify/{contactId}',
    handler: verifyContactHandler,
    options: {
      auth: 'jwt',
      validate: {
        payload: Joi.object({
          method: Joi.string().valid('sms', 'email', 'voice').required()
        })
      }
    }
  },
  {
    method: 'GET',
    path: '/api/emergency-contacts/statistics',
    handler: getContactStatisticsHandler,
    options: {
      auth: 'jwt'
    }
  }
];
