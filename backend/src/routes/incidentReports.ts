/**
 * LOC: ED34E1FC61
 * WC-RTE-INC-023 | incidentReports.ts - Comprehensive Incident Management API Routes with Evidence Tracking
 *
 * UPSTREAM (imports from):
 *   - incidentReportService.ts (services/incidentReportService.ts)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (index.ts)
 */

/**
 * WC-RTE-INC-023 | incidentReports.ts - Comprehensive Incident Management API Routes with Evidence Tracking
 * Purpose: Complete incident reporting system API with witness statements, follow-up actions, evidence handling, compliance tracking
 * Upstream: ../services/incidentReportService | Dependencies: @hapi/hapi, joi, JWT auth middleware
 * Downstream: Incident dashboard, compliance reports, parent notifications | Called by: Staff reporting interfaces, admin panels
 * Related: students.ts, healthRecords.ts, notifications.ts | Integrates: Parent notification system, evidence management, insurance claims
 * Exports: incidentReportRoutes (20 route handlers) | Key Services: CRUD operations, witness management, follow-up tracking, compliance
 * Last Updated: 2025-10-18 | File Type: .ts - Incident PHI and Legal Documentation Protected
 * Critical Path: JWT auth → Input validation → Incident service calls → Parent notification triggers → Audit logging
 * LLM Context: School incident management API with legal compliance, evidence tracking, witness statements, parent notifications, insurance integration
 */

import { ServerRoute } from '@hapi/hapi';
import { IncidentReportService } from '../services/incidentReportService';
import Joi from 'joi';

// Get incident reports
const getIncidentReportsHandler = async (request: any, h: any) => {
  try {
    const page = parseInt(request.query.page) || 1;
    const limit = parseInt(request.query.limit) || 20;

    const filters: any = {};
    if (request.query.studentId) filters.studentId = request.query.studentId;
    if (request.query.reportedById) filters.reportedById = request.query.reportedById;
    if (request.query.type) filters.type = request.query.type;
    if (request.query.severity) filters.severity = request.query.severity;
    if (request.query.dateFrom) filters.dateFrom = new Date(request.query.dateFrom);
    if (request.query.dateTo) filters.dateTo = new Date(request.query.dateTo);
    if (request.query.parentNotified !== undefined) filters.parentNotified = request.query.parentNotified === 'true';
    if (request.query.followUpRequired !== undefined) filters.followUpRequired = request.query.followUpRequired === 'true';

    const result = await IncidentReportService.getIncidentReports(page, limit, filters);

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

// Get incident report by ID
const getIncidentReportByIdHandler = async (request: any, h: any) => {
  try {
    const { id } = request.params;
    const report = await IncidentReportService.getIncidentReportById(id);

    return h.response({
      success: true,
      data: { report }
    });
  } catch (error) {
    if ((error as Error).message === 'Incident report not found') {
      return h.response({
        success: false,
        error: { message: 'Incident report not found' }
      }).code(404);
    }

    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Create new incident report
const createIncidentReportHandler = async (request: any, h: any) => {
  try {
    const reportedById = request.auth.credentials?.userId;

    const report = await IncidentReportService.createIncidentReport({
      ...request.payload,
      reportedById,
      occurredAt: new Date(request.payload.occurredAt)
    });

    return h.response({
      success: true,
      data: { report }
    }).code(201);
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Update incident report
const updateIncidentReportHandler = async (request: any, h: any) => {
  try {
    const { id } = request.params;
    const updateData = { ...request.payload };

    if (updateData.occurredAt) {
      updateData.occurredAt = new Date(updateData.occurredAt);
    }

    const report = await IncidentReportService.updateIncidentReport(id, updateData);

    return h.response({
      success: true,
      data: { report }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Mark parent as notified
const markParentNotifiedHandler = async (request: any, h: any) => {
  try {
    const { id } = request.params;
    const { notificationMethod, notifiedBy } = request.payload;

    const report = await IncidentReportService.markParentNotified(id, notificationMethod, notifiedBy);

    return h.response({
      success: true,
      data: { report }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Add follow-up notes
const addFollowUpNotesHandler = async (request: any, h: any) => {
  try {
    const { id } = request.params;
    const { notes } = request.payload;
    const completedBy = request.auth.credentials?.firstName + ' ' + request.auth.credentials?.lastName;

    const report = await IncidentReportService.addFollowUpNotes(id, notes, completedBy);

    return h.response({
      success: true,
      data: { report }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Get incident statistics
const getIncidentStatisticsHandler = async (request: any, h: any) => {
  try {
    const dateFrom = request.query.dateFrom ? new Date(request.query.dateFrom) : undefined;
    const dateTo = request.query.dateTo ? new Date(request.query.dateTo) : undefined;
    const studentId = request.query.studentId;

    const stats = await IncidentReportService.getIncidentStatistics(dateFrom, dateTo, studentId);

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

// Search incident reports
const searchIncidentReportsHandler = async (request: any, h: any) => {
  try {
    const { query } = request.params;
    const page = parseInt(request.query.page) || 1;
    const limit = parseInt(request.query.limit) || 20;

    const result = await IncidentReportService.searchIncidentReports(query, page, limit);

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

// Get incidents requiring follow-up
const getIncidentsRequiringFollowUpHandler = async (request: any, h: any) => {
  try {
    const reports = await IncidentReportService.getIncidentsRequiringFollowUp();

    return h.response({
      success: true,
      data: { reports }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Get recent incidents for a student
const getStudentRecentIncidentsHandler = async (request: any, h: any) => {
  try {
    const { studentId } = request.params;
    const limit = parseInt(request.query.limit) || 5;

    const reports = await IncidentReportService.getStudentRecentIncidents(studentId, limit);

    return h.response({
      success: true,
      data: { reports }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Generate incident report document
const generateIncidentReportDocumentHandler = async (request: any, h: any) => {
  try {
    const { id } = request.params;
    const documentData = await IncidentReportService.generateIncidentReportDocument(id);

    return h.response({
      success: true,
      data: { document: documentData }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Add witness statement
const addWitnessStatementHandler = async (request: any, h: any) => {
  try {
    const { id } = request.params;
    const statement = await IncidentReportService.addWitnessStatement(id, request.payload);

    return h.response({
      success: true,
      data: { statement }
    }).code(201);
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Verify witness statement
const verifyWitnessStatementHandler = async (request: any, h: any) => {
  try {
    const { statementId } = request.params;
    const verifiedBy = request.auth.credentials?.firstName + ' ' + request.auth.credentials?.lastName;

    const statement = await IncidentReportService.verifyWitnessStatement(statementId, verifiedBy);

    return h.response({
      success: true,
      data: { statement }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Add follow-up action
const addFollowUpActionHandler = async (request: any, h: any) => {
  try {
    const { id } = request.params;
    const actionData = {
      ...request.payload,
      dueDate: new Date(request.payload.dueDate)
    };

    const action = await IncidentReportService.addFollowUpAction(id, actionData);

    return h.response({
      success: true,
      data: { action }
    }).code(201);
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Update follow-up action status
const updateFollowUpActionHandler = async (request: any, h: any) => {
  try {
    const { actionId } = request.params;
    const { status, notes } = request.payload;
    const completedBy = request.auth.credentials?.firstName + ' ' + request.auth.credentials?.lastName;

    const action = await IncidentReportService.updateFollowUpAction(actionId, status, completedBy, notes);

    return h.response({
      success: true,
      data: { action }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Add evidence (photos/videos)
const addEvidenceHandler = async (request: any, h: any) => {
  try {
    const { id } = request.params;
    const { evidenceType, evidenceUrls } = request.payload;

    const report = await IncidentReportService.addEvidence(id, evidenceType, evidenceUrls);

    return h.response({
      success: true,
      data: { report }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Update insurance claim
const updateInsuranceClaimHandler = async (request: any, h: any) => {
  try {
    const { id } = request.params;
    const { claimNumber, status } = request.payload;

    const report = await IncidentReportService.updateInsuranceClaim(id, claimNumber, status);

    return h.response({
      success: true,
      data: { report }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Update compliance status
const updateComplianceStatusHandler = async (request: any, h: any) => {
  try {
    const { id } = request.params;
    const { status } = request.payload;

    const report = await IncidentReportService.updateComplianceStatus(id, status);

    return h.response({
      success: true,
      data: { report }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Send parent notification
const notifyParentHandler = async (request: any, h: any) => {
  try {
    const { id } = request.params;
    const { method } = request.payload;
    const notifiedBy = request.auth.credentials?.firstName + ' ' + request.auth.credentials?.lastName;

    const report = await IncidentReportService.notifyParent(id, method, notifiedBy);

    return h.response({
      success: true,
      data: { report }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Define incident report routes for Hapi
export const incidentReportRoutes: ServerRoute[] = [
  {
    method: 'GET',
    path: '/api/incident-reports',
    handler: getIncidentReportsHandler,
    options: {
      auth: 'jwt',
      validate: {
        query: Joi.object({
          page: Joi.number().integer().min(1).default(1),
          limit: Joi.number().integer().min(1).max(100).default(20),
          studentId: Joi.string().optional(),
          reportedById: Joi.string().optional(),
          type: Joi.string().optional(),
          severity: Joi.string().optional(),
          dateFrom: Joi.date().iso().optional(),
          dateTo: Joi.date().iso().optional(),
          parentNotified: Joi.boolean().optional(),
          followUpRequired: Joi.boolean().optional()
        })
      }
    }
  },
  {
    method: 'GET',
    path: '/api/incident-reports/{id}',
    handler: getIncidentReportByIdHandler,
    options: {
      auth: 'jwt'
    }
  },
  {
    method: 'POST',
    path: '/api/incident-reports',
    handler: createIncidentReportHandler,
    options: {
      auth: 'jwt',
      validate: {
        payload: Joi.object({
          studentId: Joi.string().required(),
          type: Joi.string().valid('INJURY', 'ILLNESS', 'BEHAVIORAL', 'MEDICATION_ERROR', 'ALLERGIC_REACTION', 'EMERGENCY', 'OTHER').required(),
          severity: Joi.string().valid('LOW', 'MEDIUM', 'HIGH', 'CRITICAL').required(),
          description: Joi.string().trim().required(),
          location: Joi.string().trim().required(),
          actionsTaken: Joi.string().trim().required(),
          occurredAt: Joi.date().iso().required(),
          witnesses: Joi.array().optional(),
          parentNotified: Joi.boolean().optional(),
          followUpRequired: Joi.boolean().optional()
        })
      }
    }
  },
  {
    method: 'PUT',
    path: '/api/incident-reports/{id}',
    handler: updateIncidentReportHandler,
    options: {
      auth: 'jwt',
      validate: {
        payload: Joi.object({
          type: Joi.string().valid('INJURY', 'ILLNESS', 'BEHAVIORAL', 'MEDICATION_ERROR', 'ALLERGIC_REACTION', 'EMERGENCY', 'OTHER').optional(),
          severity: Joi.string().valid('LOW', 'MEDIUM', 'HIGH', 'CRITICAL').optional(),
          description: Joi.string().trim().optional(),
          location: Joi.string().trim().optional(),
          actionsTaken: Joi.string().trim().optional(),
          occurredAt: Joi.date().iso().optional(),
          witnesses: Joi.array().optional(),
          parentNotified: Joi.boolean().optional(),
          followUpRequired: Joi.boolean().optional()
        })
      }
    }
  },
  {
    method: 'PUT',
    path: '/api/incident-reports/{id}/notify-parent',
    handler: markParentNotifiedHandler,
    options: {
      auth: 'jwt',
      validate: {
        payload: Joi.object({
          notificationMethod: Joi.string().trim().optional(),
          notifiedBy: Joi.string().trim().optional()
        })
      }
    }
  },
  {
    method: 'PUT',
    path: '/api/incident-reports/{id}/follow-up',
    handler: addFollowUpNotesHandler,
    options: {
      auth: 'jwt',
      validate: {
        payload: Joi.object({
          notes: Joi.string().trim().required()
        })
      }
    }
  },
  {
    method: 'GET',
    path: '/api/incident-reports/statistics/overview',
    handler: getIncidentStatisticsHandler,
    options: {
      auth: 'jwt',
      validate: {
        query: Joi.object({
          dateFrom: Joi.date().iso().optional(),
          dateTo: Joi.date().iso().optional(),
          studentId: Joi.string().optional()
        })
      }
    }
  },
  {
    method: 'GET',
    path: '/api/incident-reports/search/{query}',
    handler: searchIncidentReportsHandler,
    options: {
      auth: 'jwt',
      validate: {
        query: Joi.object({
          page: Joi.number().integer().min(1).default(1),
          limit: Joi.number().integer().min(1).max(100).default(20)
        })
      }
    }
  },
  {
    method: 'GET',
    path: '/api/incident-reports/follow-up/pending',
    handler: getIncidentsRequiringFollowUpHandler,
    options: {
      auth: 'jwt'
    }
  },
  {
    method: 'GET',
    path: '/api/incident-reports/student/{studentId}/recent',
    handler: getStudentRecentIncidentsHandler,
    options: {
      auth: 'jwt',
      validate: {
        query: Joi.object({
          limit: Joi.number().integer().min(1).max(20).default(5)
        })
      }
    }
  },
  {
    method: 'GET',
    path: '/api/incident-reports/{id}/document',
    handler: generateIncidentReportDocumentHandler,
    options: {
      auth: 'jwt'
    }
  },
  {
    method: 'POST',
    path: '/api/incident-reports/{id}/witness-statements',
    handler: addWitnessStatementHandler,
    options: {
      auth: 'jwt',
      validate: {
        payload: Joi.object({
          witnessName: Joi.string().trim().required(),
          witnessType: Joi.string().valid('STUDENT', 'STAFF', 'PARENT', 'OTHER').required(),
          witnessContact: Joi.string().trim().optional(),
          statement: Joi.string().trim().required()
        })
      }
    }
  },
  {
    method: 'PUT',
    path: '/api/incident-reports/witness-statements/{statementId}/verify',
    handler: verifyWitnessStatementHandler,
    options: {
      auth: 'jwt'
    }
  },
  {
    method: 'POST',
    path: '/api/incident-reports/{id}/follow-up-actions',
    handler: addFollowUpActionHandler,
    options: {
      auth: 'jwt',
      validate: {
        payload: Joi.object({
          action: Joi.string().trim().required(),
          dueDate: Joi.date().iso().required(),
          priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH', 'URGENT').required(),
          assignedTo: Joi.string().trim().optional()
        })
      }
    }
  },
  {
    method: 'PUT',
    path: '/api/incident-reports/follow-up-actions/{actionId}',
    handler: updateFollowUpActionHandler,
    options: {
      auth: 'jwt',
      validate: {
        payload: Joi.object({
          status: Joi.string().valid('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED').required(),
          notes: Joi.string().trim().optional()
        })
      }
    }
  },
  {
    method: 'POST',
    path: '/api/incident-reports/{id}/evidence',
    handler: addEvidenceHandler,
    options: {
      auth: 'jwt',
      validate: {
        payload: Joi.object({
          evidenceType: Joi.string().valid('photo', 'video').required(),
          evidenceUrls: Joi.array().items(Joi.string()).min(1).required()
        })
      }
    }
  },
  {
    method: 'PUT',
    path: '/api/incident-reports/{id}/insurance-claim',
    handler: updateInsuranceClaimHandler,
    options: {
      auth: 'jwt',
      validate: {
        payload: Joi.object({
          claimNumber: Joi.string().trim().required(),
          status: Joi.string().valid('NOT_FILED', 'FILED', 'PENDING', 'APPROVED', 'DENIED', 'CLOSED').required()
        })
      }
    }
  },
  {
    method: 'PUT',
    path: '/api/incident-reports/{id}/compliance',
    handler: updateComplianceStatusHandler,
    options: {
      auth: 'jwt',
      validate: {
        payload: Joi.object({
          status: Joi.string().valid('PENDING', 'COMPLIANT', 'NON_COMPLIANT', 'UNDER_REVIEW').required()
        })
      }
    }
  },
  {
    method: 'POST',
    path: '/api/incident-reports/{id}/notify-parent-automated',
    handler: notifyParentHandler,
    options: {
      auth: 'jwt',
      validate: {
        payload: Joi.object({
          method: Joi.string().valid('email', 'sms', 'voice').required()
        })
      }
    }
  }
];
