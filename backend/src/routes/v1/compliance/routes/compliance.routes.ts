/**
 * Compliance Routes
 * HTTP endpoints for HIPAA/FERPA compliance and regulatory management
 * All routes prefixed with /api/v1/compliance
 */

import { ServerRoute } from '@hapi/hapi';
import { asyncHandler } from '../../../shared/utils';
import { ComplianceController } from '../controllers/compliance.controller';
import {
  complianceReportQuerySchema,
  createComplianceReportSchema,
  updateComplianceReportSchema,
  generateReportSchema,
  checklistQuerySchema,
  createChecklistSchema,
  updateChecklistSchema,
  consentFormQuerySchema,
  createConsentFormSchema,
  signConsentSchema,
  policyQuerySchema,
  createPolicySchema,
  updatePolicySchema,
  complianceStatisticsQuerySchema,
  reportIdParamSchema,
  checklistIdParamSchema,
  consentFormIdParamSchema,
  studentIdParamSchema,
  policyIdParamSchema,
  signatureIdParamSchema
} from '../validators/compliance.validators';

/**
 * COMPLIANCE REPORT ROUTES
 */

const listComplianceReportsRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/compliance/reports',
  handler: asyncHandler(ComplianceController.listComplianceReports),
  options: {
    auth: 'jwt',
    tags: ['api', 'Compliance', 'Reports', 'v1'],
    description: 'List compliance reports',
    notes: 'Returns paginated list of compliance reports. Supports filtering by report type (HIPAA, FERPA, PRIVACY, SECURITY, BREACH, RISK_ASSESSMENT, TRAINING, AUDIT), status (PENDING, IN_PROGRESS, COMPLIANT, NON_COMPLIANT), and period (DAILY, WEEKLY, MONTHLY, QUARTERLY, ANNUAL). Used for compliance dashboard and report tracking.',
    validate: {
      query: complianceReportQuerySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Compliance reports retrieved successfully with pagination' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Compliance Officer or Admin only' }
        }
      }
    }
  }
};

const getComplianceReportByIdRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/compliance/reports/{id}',
  handler: asyncHandler(ComplianceController.getComplianceReportById),
  options: {
    auth: 'jwt',
    tags: ['api', 'Compliance', 'Reports', 'v1'],
    description: 'Get compliance report by ID',
    notes: 'Returns detailed compliance report including title, description, type, status, period, findings, recommendations, checklist items, submission details, and review status. Used for report review and compliance documentation.',
    validate: {
      params: reportIdParamSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Compliance report retrieved successfully' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Compliance report not found' }
        }
      }
    }
  }
};

const createComplianceReportRoute: ServerRoute = {
  method: 'POST',
  path: '/api/v1/compliance/reports',
  handler: asyncHandler(ComplianceController.createComplianceReport),
  options: {
    auth: 'jwt',
    tags: ['api', 'Compliance', 'Reports', 'v1'],
    description: 'Create compliance report',
    notes: 'Creates new compliance report. Automatically sets status to PENDING and records creator. Report types: HIPAA (privacy/security rule compliance), FERPA (education records), PRIVACY (data protection), SECURITY (access controls), BREACH (incident reporting), RISK_ASSESSMENT, TRAINING, AUDIT. Compliance Officer only.',
    validate: {
      payload: createComplianceReportSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '201': { description: 'Compliance report created successfully' },
          '400': { description: 'Validation error - Invalid report data' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Compliance Officer only' }
        }
      }
    }
  }
};

const updateComplianceReportRoute: ServerRoute = {
  method: 'PUT',
  path: '/api/v1/compliance/reports/{id}',
  handler: asyncHandler(ComplianceController.updateComplianceReportById),
  options: {
    auth: 'jwt',
    tags: ['api', 'Compliance', 'Reports', 'v1'],
    description: 'Update compliance report',
    notes: 'Updates compliance report status, findings, recommendations, or review details. Status changes: PENDING → IN_PROGRESS → COMPLIANT/NON_COMPLIANT/NEEDS_REVIEW. Automatically records submission timestamp when marked compliant. Tracks reviewer and review timestamp. Compliance Officer only.',
    validate: {
      params: reportIdParamSchema,
      payload: updateComplianceReportSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Compliance report updated successfully' },
          '400': { description: 'Validation error - Invalid update data' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Compliance report not found' }
        }
      }
    }
  }
};

const deleteComplianceReportRoute: ServerRoute = {
  method: 'DELETE',
  path: '/api/v1/compliance/reports/{id}',
  handler: asyncHandler(ComplianceController.deleteComplianceReport),
  options: {
    auth: 'jwt',
    tags: ['api', 'Compliance', 'Reports', 'v1'],
    description: 'Delete compliance report',
    notes: 'Deletes compliance report. Only draft reports or reports without submissions can be deleted. Submitted reports should be archived instead to maintain audit trail. Admin only.',
    validate: {
      params: reportIdParamSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Compliance report deleted successfully' },
          '400': { description: 'Cannot delete submitted report - archive instead' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Admin only' },
          '404': { description: 'Compliance report not found' }
        }
      }
    }
  }
};

const generateComplianceReportRoute: ServerRoute = {
  method: 'POST',
  path: '/api/v1/compliance/reports/generate',
  handler: asyncHandler(ComplianceController.generateComplianceReport),
  options: {
    auth: 'jwt',
    tags: ['api', 'Compliance', 'Reports', 'v1'],
    description: 'Generate automated compliance report',
    notes: 'Automatically generates compliance report by analyzing system data. Collects audit logs, PHI access patterns, security events, policy acknowledgments, and consent records. Includes automated findings and recommendations based on compliance rules. Supports custom date ranges or predefined periods. Compliance Officer only.',
    validate: {
      payload: generateReportSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '201': { description: 'Compliance report generated successfully' },
          '400': { description: 'Validation error - Invalid generation parameters' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Compliance Officer only' }
        }
      }
    }
  }
};

/**
 * COMPLIANCE CHECKLIST ROUTES
 */

const listChecklistsRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/compliance/checklists',
  handler: asyncHandler(ComplianceController.listChecklists),
  options: {
    auth: 'jwt',
    tags: ['api', 'Compliance', 'Checklists', 'v1'],
    description: 'List compliance checklists',
    notes: 'Returns paginated compliance checklist items. Supports filtering by report ID, category (HIPAA_PRIVACY, HIPAA_SECURITY, FERPA, etc.), and status (PENDING, IN_PROGRESS, COMPLETED, NOT_APPLICABLE, FAILED). Used for compliance task tracking and verification.',
    validate: {
      query: checklistQuerySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Compliance checklists retrieved successfully with pagination' },
          '401': { description: 'Unauthorized' }
        }
      }
    }
  }
};

const getChecklistByIdRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/compliance/checklists/{id}',
  handler: asyncHandler(ComplianceController.getChecklistById),
  options: {
    auth: 'jwt',
    tags: ['api', 'Compliance', 'Checklists', 'v1'],
    description: 'Get checklist by ID',
    notes: 'Returns detailed checklist item including requirement description, category, status, evidence of compliance, completion details, and due date. Used for checklist verification and documentation.',
    validate: {
      params: checklistIdParamSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Checklist item retrieved successfully' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Checklist item not found' }
        }
      }
    }
  }
};

const createChecklistRoute: ServerRoute = {
  method: 'POST',
  path: '/api/v1/compliance/checklists',
  handler: asyncHandler(ComplianceController.createChecklist),
  options: {
    auth: 'jwt',
    tags: ['api', 'Compliance', 'Checklists', 'v1'],
    description: 'Create compliance checklist',
    notes: 'Creates new compliance checklist item. Can be standalone or associated with a compliance report. Includes requirement description, category, and optional due date. Automatically sets status to PENDING. Compliance Officer only.',
    validate: {
      payload: createChecklistSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '201': { description: 'Checklist item created successfully' },
          '400': { description: 'Validation error - Invalid checklist data' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Compliance Officer only' }
        }
      }
    }
  }
};

const updateChecklistRoute: ServerRoute = {
  method: 'PUT',
  path: '/api/v1/compliance/checklists/{id}',
  handler: asyncHandler(ComplianceController.updateChecklist),
  options: {
    auth: 'jwt',
    tags: ['api', 'Compliance', 'Checklists', 'v1'],
    description: 'Update compliance checklist',
    notes: 'Updates checklist item status, evidence, or notes. Status progression: PENDING → IN_PROGRESS → COMPLETED/NOT_APPLICABLE/FAILED. Automatically records completion timestamp and user when marked COMPLETED. Evidence and notes support compliance documentation.',
    validate: {
      params: checklistIdParamSchema,
      payload: updateChecklistSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Checklist item updated successfully' },
          '400': { description: 'Validation error - Invalid update data' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Checklist item not found' }
        }
      }
    }
  }
};

const deleteChecklistRoute: ServerRoute = {
  method: 'DELETE',
  path: '/api/v1/compliance/checklists/{id}',
  handler: asyncHandler(ComplianceController.deleteChecklist),
  options: {
    auth: 'jwt',
    tags: ['api', 'Compliance', 'Checklists', 'v1'],
    description: 'Delete checklist item',
    notes: 'Deletes compliance checklist item. Only items that are PENDING or NOT_APPLICABLE can be deleted. Completed items should be maintained for audit trail. Compliance Officer or Admin only.',
    validate: {
      params: checklistIdParamSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Checklist item deleted successfully' },
          '400': { description: 'Cannot delete completed checklist item' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Compliance Officer or Admin only' },
          '404': { description: 'Checklist item not found' }
        }
      }
    }
  }
};

/**
 * POLICY MANAGEMENT ROUTES
 */

const listPoliciesRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/compliance/policies',
  handler: asyncHandler(ComplianceController.listPolicies),
  options: {
    auth: 'jwt',
    tags: ['api', 'Compliance', 'Policies', 'v1'],
    description: 'List policy documents',
    notes: 'Returns list of policy documents. Supports filtering by category (HIPAA_PRIVACY, HIPAA_SECURITY, FERPA, DATA_RETENTION, INCIDENT_RESPONSE, ACCESS_CONTROL, TRAINING) and status (DRAFT, ACTIVE, ARCHIVED, SUPERSEDED). Used for policy management and staff training.',
    validate: {
      query: policyQuerySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Policies retrieved successfully' },
          '401': { description: 'Unauthorized' }
        }
      }
    }
  }
};

const getPolicyByIdRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/compliance/policies/{policyId}',
  handler: asyncHandler(ComplianceController.getPolicyById),
  options: {
    auth: 'jwt',
    tags: ['api', 'Compliance', 'Policies', 'v1'],
    description: 'Get policy by ID',
    notes: 'Returns detailed policy document including title, category, content, version, status, effective date, review date, approval details, and acknowledgment history. Used for policy viewing and compliance verification.',
    validate: {
      params: policyIdParamSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Policy retrieved successfully' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Policy not found' }
        }
      }
    }
  }
};

const createPolicyRoute: ServerRoute = {
  method: 'POST',
  path: '/api/v1/compliance/policies',
  handler: asyncHandler(ComplianceController.createPolicy),
  options: {
    auth: 'jwt',
    tags: ['api', 'Compliance', 'Policies', 'v1'],
    description: 'Create policy document',
    notes: 'Creates new policy document. Requires title, category, content (minimum 100 characters for legal validity), version number, and effective date. Automatically sets status to DRAFT. Version-controlled for policy lifecycle management. Compliance Officer or Admin only.',
    validate: {
      payload: createPolicySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '201': { description: 'Policy created successfully' },
          '400': { description: 'Validation error - Invalid policy data or version format' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Compliance Officer or Admin only' }
        }
      }
    }
  }
};

const updatePolicyRoute: ServerRoute = {
  method: 'PUT',
  path: '/api/v1/compliance/policies/{policyId}',
  handler: asyncHandler(ComplianceController.updatePolicy),
  options: {
    auth: 'jwt',
    tags: ['api', 'Compliance', 'Policies', 'v1'],
    description: 'Update policy document',
    notes: 'Updates policy status or approval details. Status workflow: DRAFT → ACTIVE (requires approval) → ARCHIVED/SUPERSEDED. Automatically records approval timestamp when activated. Cannot reactivate archived/superseded policies - create new version instead. Enforces policy lifecycle compliance. Admin only.',
    validate: {
      params: policyIdParamSchema,
      payload: updatePolicySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Policy updated successfully' },
          '400': { description: 'Validation error - Invalid status transition or missing approval' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Admin only' },
          '404': { description: 'Policy not found' }
        }
      }
    }
  }
};

const acknowledgePolicyRoute: ServerRoute = {
  method: 'POST',
  path: '/api/v1/compliance/policies/{policyId}/acknowledge',
  handler: asyncHandler(ComplianceController.acknowledgePolicy),
  options: {
    auth: 'jwt',
    tags: ['api', 'Compliance', 'Policies', 'Training', 'v1'],
    description: 'Acknowledge policy',
    notes: '**COMPLIANCE REQUIRED** - Records staff acknowledgment of policy. Required for HIPAA/FERPA training compliance. Only ACTIVE policies can be acknowledged. Records user, timestamp, and IP address for audit trail. Prevents duplicate acknowledgments. Used for tracking staff training completion.',
    validate: {
      params: policyIdParamSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '201': { description: 'Policy acknowledged successfully' },
          '400': { description: 'Policy not active or already acknowledged' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Policy not found' }
        }
      }
    }
  }
};

/**
 * CONSENT MANAGEMENT ROUTES
 */

const listConsentFormsRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/compliance/consents/forms',
  handler: asyncHandler(ComplianceController.listConsentForms),
  options: {
    auth: 'jwt',
    tags: ['api', 'Compliance', 'Consents', 'v1'],
    description: 'List consent forms',
    notes: 'Returns list of consent form templates. Supports filtering by active status. Consent types: HIPAA_AUTHORIZATION (PHI release), FERPA_RELEASE (education records), PHOTO_RELEASE, MEDICAL_TREATMENT, RESEARCH, EMERGENCY_CONTACT. Used for consent management and student enrollment.',
    validate: {
      query: consentFormQuerySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Consent forms retrieved successfully' },
          '401': { description: 'Unauthorized' }
        }
      }
    }
  }
};

const getConsentFormByIdRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/compliance/consents/forms/{id}',
  handler: asyncHandler(ComplianceController.getConsentFormById),
  options: {
    auth: 'jwt',
    tags: ['api', 'Compliance', 'Consents', 'v1'],
    description: 'Get consent form by ID',
    notes: 'Returns detailed consent form including type, title, description, full content, version, active status, expiration date, and recent signatures. Used for displaying consent forms to parents/guardians.',
    validate: {
      params: consentFormIdParamSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Consent form retrieved successfully' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Consent form not found' }
        }
      }
    }
  }
};

const createConsentFormRoute: ServerRoute = {
  method: 'POST',
  path: '/api/v1/compliance/consents/forms',
  handler: asyncHandler(ComplianceController.createConsentForm),
  options: {
    auth: 'jwt',
    tags: ['api', 'Compliance', 'Consents', 'v1'],
    description: 'Create consent form',
    notes: 'Creates new consent form template. Requires minimum 50 characters content for legal validity. Supports version numbering (1.0 format). Can set expiration date for time-limited consents. Automatically sets to active. Version-controlled for consent tracking. Admin only.',
    validate: {
      payload: createConsentFormSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '201': { description: 'Consent form created successfully' },
          '400': { description: 'Validation error - Content too short or invalid version' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Admin only' }
        }
      }
    }
  }
};

const recordConsentRoute: ServerRoute = {
  method: 'POST',
  path: '/api/v1/compliance/consents',
  handler: asyncHandler(ComplianceController.recordConsent),
  options: {
    auth: 'jwt',
    tags: ['api', 'Compliance', 'Consents', 'v1'],
    description: 'Record consent signature',
    notes: '**LEGAL COMPLIANCE ENDPOINT** - Records digital consent signature. Validates form is active and not expired. Validates relationship (Mother, Father, Parent, Legal Guardian, etc.). Records signatory name, relationship, optional digital signature image, IP address, and timestamp for legal validity. Prevents duplicate signatures. Complete audit trail maintained.',
    validate: {
      payload: signConsentSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '201': { description: 'Consent recorded successfully' },
          '400': { description: 'Validation error - Form inactive/expired or already signed' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Consent form or student not found' }
        }
      }
    }
  }
};

const getStudentConsentsRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/compliance/consents/student/{studentId}',
  handler: asyncHandler(ComplianceController.getStudentConsents),
  options: {
    auth: 'jwt',
    tags: ['api', 'Compliance', 'Consents', 'Students', 'v1'],
    description: 'Get student consents',
    notes: 'Returns all consent signatures for a student. Includes consent form details, signatory information, signature date, withdrawal status, and digital signature data. Used for verifying student consent status and compliance documentation.',
    validate: {
      params: studentIdParamSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Student consents retrieved successfully' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Student not found' }
        }
      }
    }
  }
};

const withdrawConsentRoute: ServerRoute = {
  method: 'PUT',
  path: '/api/v1/compliance/consents/{signatureId}/withdraw',
  handler: asyncHandler(ComplianceController.withdrawConsent),
  options: {
    auth: 'jwt',
    tags: ['api', 'Compliance', 'Consents', 'v1'],
    description: 'Withdraw consent',
    notes: '**LEGAL COMPLIANCE ENDPOINT** - Withdraws previously given consent. Records withdrawal timestamp and user for complete audit trail. Consent signature is preserved for legal record. Prevents duplicate withdrawal. Used when parent/guardian revokes consent. System must respect withdrawal immediately.',
    validate: {
      params: signatureIdParamSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Consent withdrawn successfully' },
          '400': { description: 'Consent already withdrawn' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Consent signature not found' }
        }
      }
    }
  }
};

/**
 * COMPLIANCE STATISTICS ROUTES
 */

const getComplianceStatisticsRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/compliance/statistics',
  handler: asyncHandler(ComplianceController.getComplianceStatistics),
  options: {
    auth: 'jwt',
    tags: ['api', 'Compliance', 'Statistics', 'v1'],
    description: 'Get compliance statistics',
    notes: 'Returns comprehensive compliance metrics: report statistics (total, compliant, non-compliant, pending), compliance rate, policy statistics (active, acknowledged), consent statistics (active, withdrawn), and checklist completion rate. Supports custom date ranges. Used for compliance dashboards and executive reporting.',
    validate: {
      query: complianceStatisticsQuerySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Compliance statistics retrieved successfully' },
          '400': { description: 'Validation error - Invalid date range for custom period' },
          '401': { description: 'Unauthorized' }
        }
      }
    }
  }
};

/**
 * EXPORT ROUTES
 */

export const complianceRoutes: ServerRoute[] = [
  // Compliance reports
  listComplianceReportsRoute,
  getComplianceReportByIdRoute,
  createComplianceReportRoute,
  updateComplianceReportRoute,
  deleteComplianceReportRoute,
  generateComplianceReportRoute,

  // Compliance checklists
  listChecklistsRoute,
  getChecklistByIdRoute,
  createChecklistRoute,
  updateChecklistRoute,
  deleteChecklistRoute,

  // Policy management
  listPoliciesRoute,
  getPolicyByIdRoute,
  createPolicyRoute,
  updatePolicyRoute,
  acknowledgePolicyRoute,

  // Consent management
  listConsentFormsRoute,
  getConsentFormByIdRoute,
  createConsentFormRoute,
  recordConsentRoute,
  getStudentConsentsRoute,
  withdrawConsentRoute,

  // Statistics
  getComplianceStatisticsRoute
];
