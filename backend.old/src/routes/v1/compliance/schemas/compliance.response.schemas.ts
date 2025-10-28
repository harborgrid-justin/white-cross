/**
 * Compliance Module Response Schemas for Swagger Documentation
 * Comprehensive Joi schemas for HIPAA/FERPA compliance and regulatory management responses
 *
 * HIPAA Compliance: These schemas document compliance management per HIPAA Privacy and Security Rules
 *
 * Usage in routes:
 * import { ComplianceReportResponseSchema, ConsentFormResponseSchema } from '../schemas/compliance.response.schemas';
 *
 * plugins: {
 *   'hapi-swagger': {
 *     responses: {
 *       '200': { description: 'Success', schema: ComplianceReportListResponseSchema }
 *     }
 *   }
 * }
 */

import Joi from 'joi';
import { PaginationMetaSchema, createPaginatedResponseSchema } from '../../RESPONSE_SCHEMAS';

/**
 * ============================================================================
 * COMPLIANCE REPORT SCHEMAS
 * ============================================================================
 */

/**
 * Compliance Report Schema
 */
export const ComplianceReportSchema = Joi.object({
  id: Joi.string().uuid().example('123e4567-e89b-12d3-a456-426614174000').description('Report UUID'),
  reportType: Joi.string()
    .valid('HIPAA', 'FERPA', 'PRIVACY', 'SECURITY', 'BREACH', 'RISK_ASSESSMENT', 'TRAINING', 'AUDIT', 'GENERAL')
    .example('HIPAA')
    .description('Report type'),
  title: Joi.string().example('Q4 2025 HIPAA Compliance Review').description('Report title'),
  description: Joi.string().optional().example('Quarterly HIPAA Privacy and Security Rule compliance assessment').description('Report description'),
  status: Joi.string()
    .valid('PENDING', 'IN_PROGRESS', 'COMPLIANT', 'NON_COMPLIANT', 'NEEDS_REVIEW')
    .example('COMPLIANT')
    .description('Compliance status'),
  period: Joi.string()
    .valid('DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'ANNUAL')
    .example('QUARTERLY')
    .description('Reporting period'),
  findings: Joi.object().optional().example({
    strengths: ['All staff trained on HIPAA', 'Audit logs properly maintained'],
    weaknesses: ['Password policy needs strengthening'],
    critical: []
  }).description('Compliance findings'),
  recommendations: Joi.array().items(Joi.string()).optional().example([
    'Implement multi-factor authentication',
    'Review and update privacy policies annually'
  ]).description('Compliance recommendations'),
  checklistItems: Joi.number().integer().optional().example(45).description('Number of checklist items'),
  checklistCompleted: Joi.number().integer().optional().example(42).description('Number of completed items'),
  completionRate: Joi.number().optional().example(93.3).description('Completion rate percentage'),
  createdBy: Joi.string().uuid().description('Creator user ID'),
  createdByName: Joi.string().optional().example('Compliance Officer').description('Creator name'),
  submittedBy: Joi.string().uuid().optional().description('Submitter user ID'),
  submittedByName: Joi.string().optional().example('Jane Compliance').description('Submitter name'),
  submittedAt: Joi.date().iso().optional().example('2025-10-23T16:00:00Z').description('Submission timestamp'),
  reviewedBy: Joi.string().uuid().optional().description('Reviewer user ID'),
  reviewedByName: Joi.string().optional().example('Dr. Admin').description('Reviewer name'),
  reviewedAt: Joi.date().iso().optional().example('2025-10-24T10:00:00Z').description('Review timestamp'),
  dueDate: Joi.date().iso().optional().example('2025-11-01T00:00:00Z').description('Due date'),
  createdAt: Joi.date().iso().example('2025-10-01T00:00:00Z').description('Creation timestamp'),
  updatedAt: Joi.date().iso().example('2025-10-23T16:00:00Z').description('Last update timestamp')
}).label('ComplianceReport');

/**
 * Compliance Report Single Response
 */
export const ComplianceReportResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.object({
    report: ComplianceReportSchema
  })
}).label('ComplianceReportResponse');

/**
 * Compliance Report List Response
 */
export const ComplianceReportListResponseSchema = createPaginatedResponseSchema(ComplianceReportSchema, 'ComplianceReportListResponse');

/**
 * Generated Compliance Report Response
 */
export const GeneratedComplianceReportResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.object({
    report: ComplianceReportSchema,
    generated: Joi.boolean().example(true).description('Whether report was auto-generated'),
    dataAnalyzed: Joi.object({
      auditLogsAnalyzed: Joi.number().integer().example(15420),
      phiAccessEventsAnalyzed: Joi.number().integer().example(4520),
      policyAcknowledgments: Joi.number().integer().example(124),
      consentRecords: Joi.number().integer().example(850)
    }).optional().description('Data analyzed for report generation')
  })
}).label('GeneratedComplianceReportResponse');

/**
 * ============================================================================
 * COMPLIANCE CHECKLIST SCHEMAS
 * ============================================================================
 */

/**
 * Compliance Checklist Item Schema
 */
export const ComplianceChecklistSchema = Joi.object({
  id: Joi.string().uuid().example('123e4567-e89b-12d3-a456-426614174001').description('Checklist item UUID'),
  reportId: Joi.string().uuid().optional().description('Associated report UUID'),
  requirement: Joi.string().example('Verify all staff completed HIPAA training').description('Requirement description'),
  description: Joi.string().optional().example('Annual HIPAA training must be completed by all staff with access to PHI').description('Detailed description'),
  category: Joi.string().example('HIPAA_SECURITY').description('Requirement category'),
  status: Joi.string()
    .valid('PENDING', 'IN_PROGRESS', 'COMPLETED', 'NOT_APPLICABLE', 'FAILED')
    .example('COMPLETED')
    .description('Checklist item status'),
  evidence: Joi.string().optional().example('Training completion certificates on file for all 124 staff members').description('Evidence of compliance'),
  notes: Joi.string().optional().example('Completed October 15, 2025').description('Additional notes'),
  completedBy: Joi.string().uuid().optional().description('Completion user ID'),
  completedByName: Joi.string().optional().example('Jane Compliance').description('Completion user name'),
  completedAt: Joi.date().iso().optional().example('2025-10-15T14:00:00Z').description('Completion timestamp'),
  dueDate: Joi.date().iso().optional().example('2025-10-31T00:00:00Z').description('Due date'),
  createdAt: Joi.date().iso().example('2025-10-01T00:00:00Z').description('Creation timestamp'),
  updatedAt: Joi.date().iso().example('2025-10-15T14:00:00Z').description('Last update timestamp')
}).label('ComplianceChecklist');

/**
 * Checklist Single Response
 */
export const ChecklistResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.object({
    checklist: ComplianceChecklistSchema
  })
}).label('ChecklistResponse');

/**
 * Checklist List Response
 */
export const ChecklistListResponseSchema = createPaginatedResponseSchema(ComplianceChecklistSchema, 'ChecklistListResponse');

/**
 * ============================================================================
 * POLICY MANAGEMENT SCHEMAS
 * ============================================================================
 */

/**
 * Policy Document Schema
 */
export const PolicyDocumentSchema = Joi.object({
  id: Joi.string().uuid().example('123e4567-e89b-12d3-a456-426614174002').description('Policy UUID'),
  title: Joi.string().example('HIPAA Privacy Policy').description('Policy title'),
  category: Joi.string()
    .valid('HIPAA_PRIVACY', 'HIPAA_SECURITY', 'FERPA', 'DATA_RETENTION', 'INCIDENT_RESPONSE', 'ACCESS_CONTROL', 'TRAINING', 'GENERAL')
    .example('HIPAA_PRIVACY')
    .description('Policy category'),
  content: Joi.string().example('This policy establishes procedures for protecting patient health information...').description('Policy content (full text)'),
  version: Joi.string().example('2.1').description('Policy version number'),
  status: Joi.string()
    .valid('DRAFT', 'ACTIVE', 'ARCHIVED', 'SUPERSEDED')
    .example('ACTIVE')
    .description('Policy status'),
  effectiveDate: Joi.date().iso().example('2025-01-01T00:00:00Z').description('Effective date'),
  reviewDate: Joi.date().iso().optional().example('2026-01-01T00:00:00Z').description('Next review date'),
  approvedBy: Joi.string().uuid().optional().description('Approver user ID'),
  approvedByName: Joi.string().optional().example('Dr. Chief Compliance Officer').description('Approver name'),
  approvedAt: Joi.date().iso().optional().example('2024-12-15T10:00:00Z').description('Approval timestamp'),
  acknowledgmentCount: Joi.number().integer().optional().example(124).description('Number of acknowledgments'),
  requiredAcknowledgment: Joi.boolean().example(true).description('Whether staff acknowledgment is required'),
  createdBy: Joi.string().uuid().description('Creator user ID'),
  createdAt: Joi.date().iso().example('2024-12-01T00:00:00Z').description('Creation timestamp'),
  updatedAt: Joi.date().iso().example('2024-12-15T10:00:00Z').description('Last update timestamp')
}).label('PolicyDocument');

/**
 * Policy Acknowledgment Schema
 */
export const PolicyAcknowledgmentSchema = Joi.object({
  id: Joi.string().uuid().example('123e4567-e89b-12d3-a456-426614174003').description('Acknowledgment UUID'),
  policyId: Joi.string().uuid().description('Policy UUID'),
  policyTitle: Joi.string().optional().example('HIPAA Privacy Policy').description('Policy title'),
  policyVersion: Joi.string().optional().example('2.1').description('Policy version'),
  userId: Joi.string().uuid().description('User UUID'),
  userName: Joi.string().optional().example('Jane Nurse').description('User name'),
  userRole: Joi.string().optional().example('School Nurse').description('User role'),
  acknowledgedAt: Joi.date().iso().example('2025-01-05T09:00:00Z').description('Acknowledgment timestamp'),
  ipAddress: Joi.string().ip().optional().example('192.168.1.100').description('IP address'),
  notes: Joi.string().optional().description('Acknowledgment notes')
}).label('PolicyAcknowledgment');

/**
 * Policy Single Response
 */
export const PolicyResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.object({
    policy: PolicyDocumentSchema,
    acknowledgments: Joi.array().items(PolicyAcknowledgmentSchema).optional().description('Recent acknowledgments')
  })
}).label('PolicyResponse');

/**
 * Policy List Response
 */
export const PolicyListResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.array().items(PolicyDocumentSchema).description('Array of policies (not paginated)')
}).label('PolicyListResponse');

/**
 * Policy Acknowledgment Created Response
 */
export const PolicyAcknowledgmentResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.object({
    acknowledged: Joi.boolean().example(true).description('Whether policy was acknowledged'),
    acknowledgment: PolicyAcknowledgmentSchema.optional()
  })
}).label('PolicyAcknowledgmentResponse');

/**
 * ============================================================================
 * CONSENT MANAGEMENT SCHEMAS
 * ============================================================================
 */

/**
 * Consent Form Template Schema
 */
export const ConsentFormSchema = Joi.object({
  id: Joi.string().uuid().example('123e4567-e89b-12d3-a456-426614174004').description('Consent form UUID'),
  type: Joi.string()
    .valid('HIPAA_AUTHORIZATION', 'FERPA_RELEASE', 'PHOTO_RELEASE', 'MEDICAL_TREATMENT', 'RESEARCH', 'EMERGENCY_CONTACT', 'GENERAL')
    .example('HIPAA_AUTHORIZATION')
    .description('Consent form type'),
  title: Joi.string().example('HIPAA Authorization for Release of PHI').description('Form title'),
  description: Joi.string().optional().example('Authorizes release of student health information to specified parties').description('Form description'),
  content: Joi.string().example('I hereby authorize White Cross Healthcare to release...').description('Form content (full text)'),
  version: Joi.string().example('1.0').description('Form version'),
  isActive: Joi.boolean().example(true).description('Whether form is currently active'),
  expirationDate: Joi.date().iso().optional().example('2026-12-31T23:59:59Z').description('Form expiration date'),
  signatureCount: Joi.number().integer().optional().example(450).description('Number of signatures'),
  createdBy: Joi.string().uuid().description('Creator user ID'),
  createdAt: Joi.date().iso().example('2025-01-01T00:00:00Z').description('Creation timestamp'),
  updatedAt: Joi.date().iso().example('2025-01-01T00:00:00Z').description('Last update timestamp')
}).label('ConsentForm');

/**
 * Consent Signature Schema
 */
export const ConsentSignatureSchema = Joi.object({
  id: Joi.string().uuid().example('123e4567-e89b-12d3-a456-426614174005').description('Signature UUID'),
  consentFormId: Joi.string().uuid().description('Consent form UUID'),
  consentFormTitle: Joi.string().optional().example('HIPAA Authorization').description('Form title'),
  consentFormType: Joi.string().optional().example('HIPAA_AUTHORIZATION').description('Form type'),
  studentId: Joi.string().uuid().description('Student UUID'),
  studentName: Joi.string().optional().example('John Doe').description('Student name'),
  signatoryName: Joi.string().example('Jane Doe').description('Person who signed'),
  signatoryRelationship: Joi.string()
    .valid('Mother', 'Father', 'Parent', 'Legal Guardian', 'Court-Appointed Guardian', 'Other')
    .example('Mother')
    .description('Relationship to student'),
  signatureData: Joi.string().optional().description('Digital signature image data (base64)'),
  signedAt: Joi.date().iso().example('2025-09-01T10:00:00Z').description('Signature timestamp'),
  ipAddress: Joi.string().ip().optional().example('192.168.1.100').description('IP address'),
  isWithdrawn: Joi.boolean().example(false).description('Whether consent was withdrawn'),
  withdrawnAt: Joi.date().iso().allow(null).optional().description('Withdrawal timestamp'),
  withdrawnBy: Joi.string().uuid().allow(null).optional().description('User who withdrew consent'),
  notes: Joi.string().optional().description('Additional notes'),
  createdAt: Joi.date().iso().example('2025-09-01T10:00:00Z').description('Creation timestamp')
}).label('ConsentSignature');

/**
 * Consent Form Single Response
 */
export const ConsentFormResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.object({
    consentForm: ConsentFormSchema,
    recentSignatures: Joi.array().items(ConsentSignatureSchema).optional().description('Recent signatures')
  })
}).label('ConsentFormResponse');

/**
 * Consent Form List Response
 */
export const ConsentFormListResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.array().items(ConsentFormSchema).description('Array of consent forms (not paginated)')
}).label('ConsentFormListResponse');

/**
 * Consent Recorded Response
 */
export const ConsentRecordedResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.object({
    recorded: Joi.boolean().example(true).description('Whether consent was recorded'),
    signature: ConsentSignatureSchema
  })
}).label('ConsentRecordedResponse');

/**
 * Student Consents Response
 */
export const StudentConsentsResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.object({
    studentId: Joi.string().uuid().description('Student UUID'),
    studentName: Joi.string().optional().example('John Doe').description('Student name'),
    consents: Joi.array().items(ConsentSignatureSchema).description('All consent signatures for student'),
    totalConsents: Joi.number().integer().example(5).description('Total consents'),
    activeConsents: Joi.number().integer().example(4).description('Active (non-withdrawn) consents'),
    withdrawnConsents: Joi.number().integer().example(1).description('Withdrawn consents')
  })
}).label('StudentConsentsResponse');

/**
 * Consent Withdrawal Response
 */
export const ConsentWithdrawalResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.object({
    withdrawn: Joi.boolean().example(true).description('Whether consent was withdrawn'),
    signature: ConsentSignatureSchema
  })
}).label('ConsentWithdrawalResponse');

/**
 * ============================================================================
 * COMPLIANCE STATISTICS SCHEMAS
 * ============================================================================
 */

/**
 * Compliance Statistics Schema
 */
export const ComplianceStatisticsSchema = Joi.object({
  period: Joi.object({
    type: Joi.string().valid('TODAY', 'WEEK', 'MONTH', 'QUARTER', 'YEAR', 'CUSTOM').example('MONTH'),
    startDate: Joi.date().iso().example('2025-10-01T00:00:00Z'),
    endDate: Joi.date().iso().example('2025-10-31T23:59:59Z')
  }).description('Statistics period'),
  reports: Joi.object({
    total: Joi.number().integer().example(45).description('Total compliance reports'),
    compliant: Joi.number().integer().example(38).description('Compliant reports'),
    nonCompliant: Joi.number().integer().example(3).description('Non-compliant reports'),
    pending: Joi.number().integer().example(4).description('Pending reports'),
    complianceRate: Joi.number().example(84.4).description('Compliance rate percentage'),
    byType: Joi.object().pattern(Joi.string(), Joi.number()).example({
      'HIPAA': 12,
      'FERPA': 8,
      'PRIVACY': 10,
      'SECURITY': 15
    }).description('Reports by type')
  }).description('Report statistics'),
  policies: Joi.object({
    total: Joi.number().integer().example(25).description('Total policies'),
    active: Joi.number().integer().example(22).description('Active policies'),
    draft: Joi.number().integer().example(2).description('Draft policies'),
    archived: Joi.number().integer().example(1).description('Archived policies'),
    totalAcknowledgments: Joi.number().integer().example(2480).description('Total acknowledgments'),
    averageAcknowledgmentsPerPolicy: Joi.number().example(112.7).description('Average acknowledgments per policy'),
    acknowledgmentRate: Joi.number().example(96.8).description('Staff acknowledgment rate percentage')
  }).description('Policy statistics'),
  consents: Joi.object({
    totalForms: Joi.number().integer().example(8).description('Total consent form types'),
    activeForms: Joi.number().integer().example(7).description('Active consent forms'),
    totalSignatures: Joi.number().integer().example(1850).description('Total consent signatures'),
    activeSignatures: Joi.number().integer().example(1795).description('Active signatures'),
    withdrawnSignatures: Joi.number().integer().example(55).description('Withdrawn signatures'),
    withdrawalRate: Joi.number().example(3.0).description('Withdrawal rate percentage'),
    byType: Joi.object().pattern(Joi.string(), Joi.number()).example({
      'HIPAA_AUTHORIZATION': 450,
      'FERPA_RELEASE': 380,
      'PHOTO_RELEASE': 520,
      'MEDICAL_TREATMENT': 500
    }).description('Signatures by form type')
  }).description('Consent statistics'),
  checklists: Joi.object({
    total: Joi.number().integer().example(450).description('Total checklist items'),
    completed: Joi.number().integer().example(385).description('Completed items'),
    pending: Joi.number().integer().example(50).description('Pending items'),
    failed: Joi.number().integer().example(15).description('Failed items'),
    completionRate: Joi.number().example(85.6).description('Completion rate percentage')
  }).description('Checklist statistics'),
  overallComplianceScore: Joi.number().example(91.5).description('Overall compliance score (0-100)')
}).label('ComplianceStatistics');

/**
 * Compliance Statistics Response
 */
export const ComplianceStatisticsResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.object({
    statistics: ComplianceStatisticsSchema
  })
}).label('ComplianceStatisticsResponse');

/**
 * ============================================================================
 * COMMON ERROR SCHEMAS
 * ============================================================================
 */

/**
 * Standard Error Response
 */
export const ErrorResponseSchema = Joi.object({
  success: Joi.boolean().example(false).description('Request success status'),
  error: Joi.object({
    message: Joi.string().example('Unauthorized - Authentication required').description('Human-readable error message'),
    code: Joi.string().example('UNAUTHORIZED').optional().description('Machine-readable error code'),
    details: Joi.any().optional().description('Additional error details')
  }).description('Error information')
}).label('ErrorResponse');

/**
 * Validation Error Response
 */
export const ValidationErrorResponseSchema = Joi.object({
  success: Joi.boolean().example(false),
  error: Joi.object({
    message: Joi.string().example('Validation failed'),
    code: Joi.string().example('VALIDATION_ERROR'),
    details: Joi.array().items(
      Joi.object({
        field: Joi.string().example('title').description('Field name'),
        message: Joi.string().example('Title must be at least 5 characters').description('Validation message'),
        value: Joi.any().optional().description('Invalid value')
      })
    ).description('Validation errors by field')
  })
}).label('ValidationErrorResponse');

/**
 * Delete Success Response
 */
export const DeleteSuccessResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.object({
    deleted: Joi.boolean().example(true).description('Whether resource was deleted'),
    id: Joi.string().uuid().optional().description('Deleted resource ID')
  })
}).label('DeleteSuccessResponse');

/**
 * Update Success Response
 */
export const UpdateSuccessResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.object({
    updated: Joi.boolean().example(true).description('Whether resource was updated')
  })
}).label('UpdateSuccessResponse');
