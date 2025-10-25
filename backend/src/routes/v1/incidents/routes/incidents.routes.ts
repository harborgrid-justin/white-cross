/**
 * Incident Reports Routes
 * HTTP endpoints for comprehensive incident report management
 * All routes prefixed with /api/v1/incidents
 */

import { ServerRoute } from '@hapi/hapi';
import { asyncHandler } from '../../../shared/utils';
import { IncidentsController } from '../controllers/incidents.controller';
import {
  incidentIdParamSchema,
  witnessIdParamSchema,
  followUpIdParamSchema,
  studentIdParamSchema,
  listIncidentsQuerySchema,
  searchIncidentsQuerySchema,
  statisticsQuerySchema,
  createIncidentSchema,
  updateIncidentSchema,
  addEvidenceSchema,
  removeEvidenceSchema,
  createWitnessStatementSchema,
  updateWitnessStatementSchema,
  createFollowUpActionSchema,
  updateFollowUpActionSchema,
  notifyParentSchema,
  markParentNotifiedSchema,
  updateInsuranceClaimSchema,
  updateComplianceStatusSchema
} from '../validators/incidents.validators';

/**
 * INCIDENT CRUD ROUTES
 */

const listIncidentsRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/incidents',
  handler: asyncHandler(IncidentsController.list),
  options: {
    auth: 'jwt',
    tags: ['api', 'Incidents', 'Healthcare', 'v1'],
    description: 'List all incident reports with pagination and filters',
    notes: '**CRITICAL PHI ENDPOINT** - Returns comprehensive paginated list of incident reports with extensive filtering: student, reporter, incident type (INJURY, ILLNESS, BEHAVIORAL, MEDICATION_ERROR, ALLERGIC_REACTION, EMERGENCY), severity (MINOR, MODERATE, SERIOUS, CRITICAL, LIFE_THREATENING), status (REPORTED, UNDER_REVIEW, FOLLOW_UP_REQUIRED, RESOLVED, ARCHIVED), date range, location, parent notification status, and follow-up requirements. Used for incident dashboards, compliance reports, and legal documentation. All access is logged for audit trail.',
    validate: {
      query: listIncidentsQuerySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Incident reports retrieved successfully with pagination' },
          '401': { description: 'Unauthorized - JWT token required' },
          '403': { description: 'Forbidden - Insufficient permissions' },
          '500': { description: 'Internal server error' }
        }
      }
    }
  }
};

const getIncidentByIdRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/incidents/{id}',
  handler: asyncHandler(IncidentsController.getById),
  options: {
    auth: 'jwt',
    tags: ['api', 'Incidents', 'Healthcare', 'v1'],
    description: 'Get incident report by ID',
    notes: '**CRITICAL PHI ENDPOINT** - Returns complete incident report including: Student details, reporter information, incident type/severity/location, actions taken, witness list, evidence (photos/videos/attachments), parent notification status, follow-up requirements, insurance claim details, and legal compliance status. Used for incident review, legal documentation, and parent communications. All access is logged.',
    validate: {
      params: incidentIdParamSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Incident report retrieved successfully' },
          '401': { description: 'Unauthorized - JWT token required' },
          '404': { description: 'Incident report not found' }
        }
      }
    }
  }
};

const createIncidentRoute: ServerRoute = {
  method: 'POST',
  path: '/api/v1/incidents',
  handler: asyncHandler(IncidentsController.create),
  options: {
    auth: 'jwt',
    tags: ['api', 'Incidents', 'Healthcare', 'v1'],
    description: 'Create new incident report',
    notes: '**CRITICAL PHI ENDPOINT** - Creates comprehensive incident report with mandatory fields: student ID, incident type, severity level, detailed description (10-5000 chars), location, actions taken, and occurrence timestamp. Optional: witness list, parent notification status, follow-up requirements, evidence attachments, insurance claim info. Automatically logs reporter from JWT. High/critical severity incidents trigger automatic parent notifications if emergency contacts exist. All creation is logged for legal compliance and audit trail.',
    validate: {
      payload: createIncidentSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '201': { description: 'Incident report created successfully' },
          '400': { description: 'Validation error - Invalid incident data or missing required fields' },
          '401': { description: 'Unauthorized - JWT token required' },
          '404': { description: 'Student not found' },
          '500': { description: 'Internal server error' }
        }
      }
    }
  }
};

const updateIncidentRoute: ServerRoute = {
  method: 'PUT',
  path: '/api/v1/incidents/{id}',
  handler: asyncHandler(IncidentsController.update),
  options: {
    auth: 'jwt',
    tags: ['api', 'Incidents', 'Healthcare', 'v1'],
    description: 'Update incident report',
    notes: '**CRITICAL PHI ENDPOINT** - Updates existing incident report fields including type, severity, status, description, location, actions taken, evidence, parent notification status, follow-up requirements, insurance claims, and compliance status. All updates are logged with timestamp and user for complete audit trail. Cannot modify archived incidents. Used for incident review, additional information, status updates, and compliance documentation.',
    validate: {
      params: incidentIdParamSchema,
      payload: updateIncidentSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Incident report updated successfully' },
          '400': { description: 'Validation error - Invalid update data' },
          '401': { description: 'Unauthorized - JWT token required' },
          '404': { description: 'Incident report not found' },
          '500': { description: 'Internal server error' }
        }
      }
    }
  }
};

const deleteIncidentRoute: ServerRoute = {
  method: 'DELETE',
  path: '/api/v1/incidents/{id}',
  handler: asyncHandler(IncidentsController.delete),
  options: {
    auth: 'jwt',
    tags: ['api', 'Incidents', 'Healthcare', 'v1'],
    description: 'Archive incident report',
    notes: '**CRITICAL PHI ENDPOINT** - Soft-deletes incident report by updating status to ARCHIVED. Does not permanently delete - maintains complete historical record for legal compliance, insurance claims, and future reference. Archived incidents remain searchable but excluded from active reports. Deletion is logged with user and timestamp. Admin or nurse with proper permissions only.',
    validate: {
      params: incidentIdParamSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '204': { description: 'Incident report archived successfully (no content)' },
          '401': { description: 'Unauthorized - JWT token required' },
          '403': { description: 'Forbidden - Admin or authorized nurse only' },
          '404': { description: 'Incident report not found' }
        }
      }
    }
  }
};

/**
 * STUDENT-SPECIFIC ROUTES
 */

const getStudentIncidentsRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/incidents/student/{studentId}',
  handler: asyncHandler(IncidentsController.getStudentIncidents),
  options: {
    auth: 'jwt',
    tags: ['api', 'Incidents', 'Students', 'Healthcare', 'v1'],
    description: 'Get all incidents for a student',
    notes: '**CRITICAL PHI ENDPOINT** - Returns complete incident history for a specific student with pagination. Includes all incident types, severities, dates, locations, outcomes, and follow-up status. Used for student health profiles, pattern analysis, emergency reference, and parent/guardian communications. Critical for identifying recurring safety issues or health concerns. All access is logged.',
    validate: {
      params: studentIdParamSchema,
      query: listIncidentsQuerySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Student incidents retrieved successfully' },
          '401': { description: 'Unauthorized - JWT token required' },
          '404': { description: 'Student not found' }
        }
      }
    }
  }
};

/**
 * EVIDENCE MANAGEMENT ROUTES
 */

const addEvidenceRoute: ServerRoute = {
  method: 'POST',
  path: '/api/v1/incidents/{id}/evidence',
  handler: asyncHandler(IncidentsController.addEvidence),
  options: {
    auth: 'jwt',
    tags: ['api', 'Incidents', 'Evidence', 'Healthcare', 'v1'],
    description: 'Add evidence to incident report',
    notes: '**CRITICAL PHI ENDPOINT** - Adds photo, video, or document evidence to incident report. Supports up to 20 files per upload. Evidence types: photos (injury documentation, scene), videos (incident recording), attachments (medical reports, forms). All URLs are validated. Used for legal documentation, insurance claims, and comprehensive incident records. Evidence additions are logged for chain of custody and audit trail.',
    validate: {
      params: incidentIdParamSchema,
      payload: addEvidenceSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Evidence added successfully' },
          '400': { description: 'Validation error - Invalid evidence URLs or type' },
          '401': { description: 'Unauthorized - JWT token required' },
          '404': { description: 'Incident report not found' }
        }
      }
    }
  }
};

const getEvidenceRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/incidents/{id}/evidence',
  handler: asyncHandler(IncidentsController.getEvidence),
  options: {
    auth: 'jwt',
    tags: ['api', 'Incidents', 'Evidence', 'Healthcare', 'v1'],
    description: 'Get all evidence for an incident',
    notes: '**CRITICAL PHI ENDPOINT** - Returns all evidence attached to incident report categorized by type (photos, videos, attachments). Includes evidence URLs, counts, and metadata. Used for incident review, legal documentation, insurance claim processing, and parent communications. All access is logged for evidence chain of custody.',
    validate: {
      params: incidentIdParamSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Evidence retrieved successfully' },
          '401': { description: 'Unauthorized - JWT token required' },
          '404': { description: 'Incident report not found' }
        }
      }
    }
  }
};

/**
 * WITNESS STATEMENT ROUTES
 */

const addWitnessStatementRoute: ServerRoute = {
  method: 'POST',
  path: '/api/v1/incidents/{id}/witnesses',
  handler: asyncHandler(IncidentsController.addWitnessStatement),
  options: {
    auth: 'jwt',
    tags: ['api', 'Incidents', 'Witnesses', 'Healthcare', 'v1'],
    description: 'Add witness statement to incident',
    notes: '**CRITICAL PHI ENDPOINT** - Records witness statement for incident report. Witness types: STUDENT, STAFF, PARENT, OTHER. Captures: witness name, contact information, detailed statement (10-5000 chars), and statement date. Statements can be verified later by authorized personnel. Used for legal documentation, incident investigation, and compliance. Critical for behavioral incidents and serious injuries. All statements are logged and timestamped.',
    validate: {
      params: incidentIdParamSchema,
      payload: createWitnessStatementSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '201': { description: 'Witness statement added successfully' },
          '400': { description: 'Validation error - Invalid witness statement data' },
          '401': { description: 'Unauthorized - JWT token required' },
          '404': { description: 'Incident report not found' }
        }
      }
    }
  }
};

const getWitnessStatementsRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/incidents/{id}/witnesses',
  handler: asyncHandler(IncidentsController.getWitnessStatements),
  options: {
    auth: 'jwt',
    tags: ['api', 'Incidents', 'Witnesses', 'Healthcare', 'v1'],
    description: 'Get all witness statements for an incident',
    notes: '**CRITICAL PHI ENDPOINT** - Returns all witness statements for incident report including witness details, statement text, verification status, and timestamps. Ordered chronologically. Used for incident investigation, legal documentation, and compliance reporting. All access is logged for audit trail.',
    validate: {
      params: incidentIdParamSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Witness statements retrieved successfully' },
          '401': { description: 'Unauthorized - JWT token required' },
          '404': { description: 'Incident report not found' }
        }
      }
    }
  }
};

/**
 * FOLLOW-UP ACTION ROUTES
 */

const addFollowUpActionRoute: ServerRoute = {
  method: 'POST',
  path: '/api/v1/incidents/{id}/follow-ups',
  handler: asyncHandler(IncidentsController.addFollowUpAction),
  options: {
    auth: 'jwt',
    tags: ['api', 'Incidents', 'FollowUp', 'Healthcare', 'v1'],
    description: 'Add follow-up action to incident',
    notes: '**PHI Protected Endpoint** - Creates follow-up action for incident report with required fields: action description (5-500 chars), due date (must be future), and priority (LOW, MEDIUM, HIGH, URGENT). Optional: assigned user, notes. Actions start in PENDING status. Used for incident resolution tracking, compliance monitoring, and accountability. Urgent actions trigger notifications to assigned users. All actions are logged.',
    validate: {
      params: incidentIdParamSchema,
      payload: createFollowUpActionSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '201': { description: 'Follow-up action created successfully' },
          '400': { description: 'Validation error - Invalid action data or past due date' },
          '401': { description: 'Unauthorized - JWT token required' },
          '404': { description: 'Incident report not found' }
        }
      }
    }
  }
};

const getFollowUpActionsRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/incidents/{id}/follow-ups',
  handler: asyncHandler(IncidentsController.getFollowUpActions),
  options: {
    auth: 'jwt',
    tags: ['api', 'Incidents', 'FollowUp', 'Healthcare', 'v1'],
    description: 'Get all follow-up actions for an incident',
    notes: '**PHI Protected Endpoint** - Returns all follow-up actions for incident report including action details, priority, status (PENDING, IN_PROGRESS, COMPLETED, CANCELLED), due dates, assignments, and completion information. Ordered by due date. Used for incident resolution tracking, task management, and compliance monitoring.',
    validate: {
      params: incidentIdParamSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Follow-up actions retrieved successfully' },
          '401': { description: 'Unauthorized - JWT token required' },
          '404': { description: 'Incident report not found' }
        }
      }
    }
  }
};

/**
 * NOTIFICATION ROUTES
 */

const notifyParentRoute: ServerRoute = {
  method: 'POST',
  path: '/api/v1/incidents/{id}/notify',
  handler: asyncHandler(IncidentsController.notifyParent),
  options: {
    auth: 'jwt',
    tags: ['api', 'Incidents', 'Notifications', 'Healthcare', 'v1'],
    description: 'Send parent notification for incident',
    notes: '**CRITICAL PHI ENDPOINT** - Sends automated notification to parent/guardian about incident via specified method (EMAIL, SMS, PHONE, IN_PERSON, LETTER). Retrieves emergency contacts from student profile. Sends standardized incident alert including student name, incident type, severity, date/time, and contact instructions. Updates incident record with notification status. Used for emergency communications and legal compliance. All notifications are logged.',
    validate: {
      params: incidentIdParamSchema,
      payload: notifyParentSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Parent notification sent successfully' },
          '400': { description: 'Validation error - Invalid notification method or missing emergency contacts' },
          '401': { description: 'Unauthorized - JWT token required' },
          '404': { description: 'Incident report not found' }
        }
      }
    }
  }
};

/**
 * STATISTICS & SEARCH ROUTES
 */

const getStatisticsRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/incidents/statistics',
  handler: asyncHandler(IncidentsController.getStatistics),
  options: {
    auth: 'jwt',
    tags: ['api', 'Incidents', 'Statistics', 'Analytics', 'v1'],
    description: 'Get incident statistics',
    notes: 'Returns comprehensive incident statistics including: Total incidents, breakdown by type (INJURY, ILLNESS, BEHAVIORAL, etc.), breakdown by severity (MINOR to LIFE_THREATENING), breakdown by location, parent notification rate, follow-up rate, and average response time (minutes). Optionally filtered by date range and student. Used for safety dashboards, compliance reports, trend analysis, and administrative oversight. No PHI in aggregated data.',
    validate: {
      query: statisticsQuerySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Statistics retrieved successfully' },
          '401': { description: 'Unauthorized - JWT token required' },
          '403': { description: 'Forbidden - Admin or nurse role required' }
        }
      }
    }
  }
};

const searchIncidentsRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/incidents/search',
  handler: asyncHandler(IncidentsController.search),
  options: {
    auth: 'jwt',
    tags: ['api', 'Incidents', 'Search', 'Healthcare', 'v1'],
    description: 'Search incident reports',
    notes: '**CRITICAL PHI ENDPOINT** - Full-text search across incident reports including: student name, description, location, actions taken, witness names, and notes. Supports advanced search operators and returns paginated results with relevance ranking. Used for incident lookup, pattern analysis, and legal documentation retrieval. All searches are logged for audit compliance.',
    validate: {
      query: searchIncidentsQuerySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Search results retrieved successfully' },
          '400': { description: 'Validation error - Invalid search query' },
          '401': { description: 'Unauthorized - JWT token required' }
        }
      }
    }
  }
};

/**
 * EXPORT ROUTES
 */

export const incidentsRoutes: ServerRoute[] = [
  // CRUD operations
  listIncidentsRoute,
  getIncidentByIdRoute,
  createIncidentRoute,
  updateIncidentRoute,
  deleteIncidentRoute,

  // Student-specific
  getStudentIncidentsRoute,

  // Evidence management
  addEvidenceRoute,
  getEvidenceRoute,

  // Witness statements
  addWitnessStatementRoute,
  getWitnessStatementsRoute,

  // Follow-up actions
  addFollowUpActionRoute,
  getFollowUpActionsRoute,

  // Notifications
  notifyParentRoute,

  // Statistics & search
  getStatisticsRoute,
  searchIncidentsRoute
];
