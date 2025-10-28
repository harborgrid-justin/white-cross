/**
 * Shared Response Schemas for Swagger Documentation
 * Reusable Joi schemas for consistent API documentation across all modules
 *
 * Usage in routes:
 * import { DocumentResponseSchema, ErrorResponseSchema } from '../RESPONSE_SCHEMAS';
 *
 * plugins: {
 *   'hapi-swagger': {
 *     responses: {
 *       '200': { description: 'Success', schema: DocumentResponseSchema }
 *     }
 *   }
 * }
 */

import Joi from 'joi';

/**
 * ============================================================================
 * COMMON RESPONSE SCHEMAS
 * ============================================================================
 */

/**
 * Standard Success Response Wrapper
 */
export const SuccessResponseSchema = Joi.object({
  success: Joi.boolean().example(true).description('Request success status'),
  data: Joi.object().description('Response payload')
}).label('SuccessResponse');

/**
 * Standard Error Response
 */
export const ErrorResponseSchema = Joi.object({
  success: Joi.boolean().example(false).description('Request success status'),
  error: Joi.object({
    message: Joi.string().example('An error occurred').description('Human-readable error message'),
    code: Joi.string().example('ERROR_CODE').optional().description('Machine-readable error code'),
    details: Joi.object().optional().description('Additional error details')
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
        field: Joi.string().example('email').description('Field name'),
        message: Joi.string().example('Email must be valid').description('Validation message'),
        value: Joi.any().optional().description('Invalid value')
      })
    ).description('Validation errors by field')
  })
}).label('ValidationErrorResponse');

/**
 * Pagination Metadata Schema
 */
export const PaginationMetaSchema = Joi.object({
  page: Joi.number().integer().example(1).description('Current page number'),
  limit: Joi.number().integer().example(20).description('Items per page'),
  total: Joi.number().integer().example(150).description('Total items count'),
  totalPages: Joi.number().integer().example(8).description('Total pages')
}).label('PaginationMeta');

/**
 * Paginated Response Wrapper
 * @param itemSchema - Joi schema for array items
 */
export const createPaginatedResponseSchema = (itemSchema: Joi.Schema, label: string) =>
  Joi.object({
    success: Joi.boolean().example(true),
    data: Joi.array().items(itemSchema).description('Array of items'),
    pagination: PaginationMetaSchema
  }).label(label);

/**
 * ============================================================================
 * DOCUMENTS MODULE SCHEMAS
 * ============================================================================
 */

/**
 * Document Object Schema
 */
export const DocumentSchema = Joi.object({
  id: Joi.string().uuid().example('123e4567-e89b-12d3-a456-426614174000').description('Document UUID'),
  title: Joi.string().example('Annual Physical - John Doe').description('Document title'),
  description: Joi.string().optional().example('Annual physical examination results').description('Document description'),
  category: Joi.string()
    .valid('MEDICAL_RECORD', 'CONSENT_FORM', 'POLICY', 'INCIDENT_REPORT', 'TRAINING', 'ADMINISTRATIVE', 'STUDENT_FILE', 'INSURANCE', 'OTHER')
    .example('MEDICAL_RECORD')
    .description('Document category'),
  status: Joi.string()
    .valid('DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'ARCHIVED', 'EXPIRED')
    .example('APPROVED')
    .description('Document status'),
  fileType: Joi.string().example('pdf').description('File extension'),
  fileName: Joi.string().example('annual-physical-2025.pdf').description('Original filename'),
  fileSize: Joi.number().integer().example(2048576).description('File size in bytes'),
  fileUrl: Joi.string().uri().example('https://storage.whitecross.health/documents/abc123.pdf').description('File storage URL'),
  studentId: Joi.string().uuid().optional().example('456e7890-e89b-12d3-a456-426614174001').description('Associated student ID'),
  uploadedBy: Joi.string().uuid().example('789e0123-e89b-12d3-a456-426614174002').description('Uploader user ID'),
  uploadedAt: Joi.date().iso().example('2025-10-23T10:30:00Z').description('Upload timestamp'),
  tags: Joi.array().items(Joi.string()).example(['physical', 'annual', '2025']).optional().description('Document tags'),
  accessLevel: Joi.string()
    .valid('PUBLIC', 'STAFF_ONLY', 'ADMIN_ONLY', 'RESTRICTED')
    .example('STAFF_ONLY')
    .description('Access level'),
  retentionDate: Joi.date().iso().optional().example('2032-10-23T00:00:00Z').description('Retention/expiration date'),
  containsPHI: Joi.boolean().example(true).description('Contains Protected Health Information'),
  lastAccessedAt: Joi.date().iso().optional().description('Last access timestamp'),
  accessCount: Joi.number().integer().example(5).description('Access count'),
  signatureCount: Joi.number().integer().example(2).optional().description('Number of signatures'),
  versionCount: Joi.number().integer().example(1).optional().description('Number of versions'),
  createdAt: Joi.date().iso().example('2025-10-23T10:30:00Z').description('Creation timestamp'),
  updatedAt: Joi.date().iso().example('2025-10-23T10:30:00Z').description('Last update timestamp')
}).label('Document');

/**
 * Document Signature Schema
 */
export const DocumentSignatureSchema = Joi.object({
  id: Joi.string().uuid().example('123e4567-e89b-12d3-a456-426614174003').description('Signature UUID'),
  documentId: Joi.string().uuid().description('Document UUID'),
  signedBy: Joi.string().uuid().example('789e0123-e89b-12d3-a456-426614174002').description('Signer user ID'),
  signedByRole: Joi.string().example('School Nurse').description('Signer role/title'),
  signatureData: Joi.string().optional().description('Signature image data (base64 or signature string)'),
  ipAddress: Joi.string().example('192.168.1.100').description('IP address of signer'),
  signedAt: Joi.date().iso().example('2025-10-23T11:00:00Z').description('Signature timestamp'),
  signerName: Joi.string().optional().example('Jane Nurse').description('Signer full name')
}).label('DocumentSignature');

/**
 * Document Version Schema
 */
export const DocumentVersionSchema = Joi.object({
  versionNumber: Joi.number().integer().example(2).description('Version number'),
  fileName: Joi.string().example('document-v2.pdf').description('Version filename'),
  fileUrl: Joi.string().uri().description('Version file URL'),
  fileSize: Joi.number().integer().example(2100000).description('File size in bytes'),
  uploadedBy: Joi.string().uuid().description('Version uploader ID'),
  uploadedAt: Joi.date().iso().example('2025-10-23T12:00:00Z').description('Version upload timestamp'),
  changes: Joi.string().optional().example('Updated contact information').description('Version change notes')
}).label('DocumentVersion');

/**
 * Document Audit Entry Schema
 */
export const DocumentAuditEntrySchema = Joi.object({
  id: Joi.string().uuid().example('123e4567-e89b-12d3-a456-426614174004').description('Audit entry UUID'),
  documentId: Joi.string().uuid().description('Document UUID'),
  action: Joi.string()
    .valid('CREATED', 'VIEWED', 'DOWNLOADED', 'UPDATED', 'SIGNED', 'SHARED', 'DELETED')
    .example('DOWNLOADED')
    .description('Action performed'),
  performedBy: Joi.string().uuid().description('User who performed action'),
  ipAddress: Joi.string().example('192.168.1.100').description('IP address'),
  timestamp: Joi.date().iso().example('2025-10-23T13:00:00Z').description('Action timestamp'),
  details: Joi.object().optional().description('Additional action details'),
  containedPHI: Joi.boolean().example(true).description('Whether action involved PHI access')
}).label('DocumentAuditEntry');

/**
 * Document Category Metadata Schema
 */
export const DocumentCategoryMetadataSchema = Joi.object({
  category: Joi.string().example('CONSENT_FORM').description('Category name'),
  description: Joi.string().example('Parental consent and authorization forms').description('Category description'),
  requiresSignature: Joi.boolean().example(true).description('Whether signature is required'),
  retentionYears: Joi.number().integer().example(7).description('Retention period in years'),
  documentCount: Joi.number().integer().example(45).description('Current document count in category')
}).label('DocumentCategoryMetadata');

/**
 * Document Response Schemas
 */
export const DocumentResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.object({
    document: DocumentSchema
  })
}).label('DocumentResponse');

export const DocumentListResponseSchema = createPaginatedResponseSchema(DocumentSchema, 'DocumentListResponse');

export const DocumentSignaturesResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.object({
    signatures: Joi.array().items(DocumentSignatureSchema)
  })
}).label('DocumentSignaturesResponse');

export const DocumentVersionsResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.object({
    versions: Joi.array().items(DocumentVersionSchema)
  })
}).label('DocumentVersionsResponse');

export const DocumentAuditTrailResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.object({
    auditTrail: Joi.array().items(DocumentAuditEntrySchema)
  })
}).label('DocumentAuditTrailResponse');

export const DocumentCategoriesResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.object({
    categories: Joi.array().items(DocumentCategoryMetadataSchema)
  })
}).label('DocumentCategoriesResponse');

export const DocumentAnalyticsResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.object({
    statistics: Joi.object({
      totalDocuments: Joi.number().integer().example(350).description('Total document count'),
      byCategory: Joi.object().pattern(Joi.string(), Joi.number()).example({
        'MEDICAL_RECORD': 120,
        'CONSENT_FORM': 85,
        'INCIDENT_REPORT': 45
      }).description('Document count by category'),
      byStatus: Joi.object().pattern(Joi.string(), Joi.number()).example({
        'APPROVED': 280,
        'DRAFT': 40,
        'PENDING': 30
      }).description('Document count by status'),
      totalStorageBytes: Joi.number().integer().example(524288000).description('Total storage used in bytes'),
      recentDocumentsCount: Joi.number().integer().example(25).description('Documents created in last 7 days')
    })
  })
}).label('DocumentAnalyticsResponse');

/**
 * ============================================================================
 * INCIDENTS MODULE SCHEMAS
 * ============================================================================
 */

/**
 * Incident Report Schema
 */
export const IncidentReportSchema = Joi.object({
  id: Joi.string().uuid().example('123e4567-e89b-12d3-a456-426614174005').description('Incident UUID'),
  studentId: Joi.string().uuid().example('456e7890-e89b-12d3-a456-426614174001').description('Student UUID'),
  studentName: Joi.string().example('John Doe').optional().description('Student name'),
  type: Joi.string()
    .valid('INJURY', 'ILLNESS', 'BEHAVIORAL', 'MEDICATION_ERROR', 'ALLERGIC_REACTION', 'EMERGENCY', 'OTHER')
    .example('INJURY')
    .description('Incident type'),
  severity: Joi.string()
    .valid('MINOR', 'MODERATE', 'SERIOUS', 'CRITICAL', 'LIFE_THREATENING')
    .example('MODERATE')
    .description('Severity level'),
  status: Joi.string()
    .valid('REPORTED', 'UNDER_REVIEW', 'FOLLOW_UP_REQUIRED', 'RESOLVED', 'ARCHIVED')
    .example('UNDER_REVIEW')
    .description('Incident status'),
  description: Joi.string().example('Student fell from monkey bars during recess, sustained minor scrape on left knee').description('Detailed description'),
  location: Joi.string().example('Playground - Monkey Bars').description('Location of incident'),
  actionsTaken: Joi.string().example('Cleaned wound, applied bandage, ice pack for 10 minutes, parent notified').description('Immediate actions taken'),
  occurredAt: Joi.date().iso().example('2025-10-23T11:30:00Z').description('Incident occurrence timestamp'),
  reportedById: Joi.string().uuid().description('Reporter user ID'),
  reportedByName: Joi.string().optional().example('Jane Nurse').description('Reporter name'),
  parentNotified: Joi.boolean().example(true).description('Parent notification status'),
  parentNotificationMethod: Joi.string().valid('EMAIL', 'SMS', 'PHONE', 'IN_PERSON', 'LETTER').optional().example('PHONE').description('Notification method'),
  followUpRequired: Joi.boolean().example(false).description('Follow-up requirement'),
  followUpNotes: Joi.string().optional().description('Follow-up notes'),
  witnesses: Joi.array().items(Joi.string()).optional().example(['Teacher Smith', 'Student Jane']).description('Witness list'),
  evidencePhotos: Joi.array().items(Joi.string().uri()).optional().description('Photo evidence URLs'),
  evidenceVideos: Joi.array().items(Joi.string().uri()).optional().description('Video evidence URLs'),
  attachments: Joi.array().items(Joi.string().uri()).optional().description('Attachment URLs'),
  insuranceClaimNumber: Joi.string().optional().example('IC-2025-001234').description('Insurance claim number'),
  insuranceClaimStatus: Joi.string()
    .valid('NOT_FILED', 'FILED', 'PENDING', 'APPROVED', 'DENIED', 'CLOSED')
    .optional()
    .example('FILED')
    .description('Insurance claim status'),
  legalComplianceStatus: Joi.string()
    .valid('PENDING', 'COMPLIANT', 'NON_COMPLIANT', 'UNDER_REVIEW')
    .optional()
    .example('COMPLIANT')
    .description('Legal compliance status'),
  createdAt: Joi.date().iso().example('2025-10-23T11:35:00Z').description('Creation timestamp'),
  updatedAt: Joi.date().iso().example('2025-10-23T11:35:00Z').description('Last update timestamp')
}).label('IncidentReport');

/**
 * Witness Statement Schema
 */
export const WitnessStatementSchema = Joi.object({
  id: Joi.string().uuid().example('123e4567-e89b-12d3-a456-426614174006').description('Statement UUID'),
  incidentId: Joi.string().uuid().description('Incident UUID'),
  witnessName: Joi.string().example('Teacher Smith').description('Witness name'),
  witnessType: Joi.string().valid('STUDENT', 'STAFF', 'PARENT', 'OTHER').example('STAFF').description('Witness type'),
  witnessContact: Joi.string().optional().example('smith@school.edu').description('Witness contact'),
  statement: Joi.string().example('I saw the student lose balance on the monkey bars and fall approximately 3 feet to the ground').description('Witness statement'),
  statementDate: Joi.date().iso().optional().example('2025-10-23T12:00:00Z').description('Statement date'),
  verified: Joi.boolean().example(false).description('Verification status'),
  verifiedBy: Joi.string().optional().description('Verifier name'),
  verifiedAt: Joi.date().iso().optional().description('Verification timestamp'),
  createdAt: Joi.date().iso().example('2025-10-23T12:05:00Z').description('Creation timestamp')
}).label('WitnessStatement');

/**
 * Follow-Up Action Schema
 */
export const FollowUpActionSchema = Joi.object({
  id: Joi.string().uuid().example('123e4567-e89b-12d3-a456-426614174007').description('Action UUID'),
  incidentId: Joi.string().uuid().description('Incident UUID'),
  action: Joi.string().example('Check wound healing progress').description('Action description'),
  dueDate: Joi.date().iso().example('2025-10-25T10:00:00Z').description('Action due date'),
  priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH', 'URGENT').example('MEDIUM').description('Priority level'),
  status: Joi.string().valid('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED').example('PENDING').description('Action status'),
  assignedTo: Joi.string().uuid().optional().description('Assigned user ID'),
  assignedToName: Joi.string().optional().example('Nurse Johnson').description('Assigned user name'),
  notes: Joi.string().optional().description('Action notes'),
  completedBy: Joi.string().optional().description('Completion user name'),
  completedAt: Joi.date().iso().optional().description('Completion timestamp'),
  createdAt: Joi.date().iso().example('2025-10-23T11:40:00Z').description('Creation timestamp')
}).label('FollowUpAction');

/**
 * Incident Statistics Schema
 */
export const IncidentStatisticsSchema = Joi.object({
  totalIncidents: Joi.number().integer().example(245).description('Total incidents'),
  byType: Joi.object().pattern(Joi.string(), Joi.number()).example({
    'INJURY': 125,
    'ILLNESS': 68,
    'BEHAVIORAL': 42,
    'MEDICATION_ERROR': 10
  }).description('Incidents by type'),
  bySeverity: Joi.object().pattern(Joi.string(), Joi.number()).example({
    'MINOR': 150,
    'MODERATE': 70,
    'SERIOUS': 20,
    'CRITICAL': 5
  }).description('Incidents by severity'),
  byLocation: Joi.object().pattern(Joi.string(), Joi.number()).example({
    'Playground': 85,
    'Classroom': 62,
    'Cafeteria': 48,
    'Gymnasium': 50
  }).description('Incidents by location'),
  parentNotificationRate: Joi.number().example(92.5).description('Parent notification rate percentage'),
  followUpRate: Joi.number().example(78.3).description('Follow-up completion rate percentage'),
  averageResponseTimeMinutes: Joi.number().example(8.5).description('Average response time in minutes')
}).label('IncidentStatistics');

/**
 * Incident Response Schemas
 */
export const IncidentResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.object({
    incident: IncidentReportSchema
  })
}).label('IncidentResponse');

export const IncidentListResponseSchema = createPaginatedResponseSchema(IncidentReportSchema, 'IncidentListResponse');

export const WitnessStatementsResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.object({
    statements: Joi.array().items(WitnessStatementSchema)
  })
}).label('WitnessStatementsResponse');

export const FollowUpActionsResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.object({
    actions: Joi.array().items(FollowUpActionSchema)
  })
}).label('FollowUpActionsResponse');

export const IncidentStatisticsResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.object({
    statistics: IncidentStatisticsSchema
  })
}).label('IncidentStatisticsResponse');

export const IncidentEvidenceResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.object({
    evidence: Joi.object({
      photos: Joi.array().items(Joi.string().uri()).example(['https://storage.example.com/photo1.jpg']).description('Photo URLs'),
      videos: Joi.array().items(Joi.string().uri()).example([]).description('Video URLs'),
      attachments: Joi.array().items(Joi.string().uri()).example(['https://storage.example.com/report.pdf']).description('Attachment URLs'),
      photoCount: Joi.number().integer().example(2).description('Photo count'),
      videoCount: Joi.number().integer().example(0).description('Video count'),
      attachmentCount: Joi.number().integer().example(1).description('Attachment count')
    })
  })
}).label('IncidentEvidenceResponse');

/**
 * ============================================================================
 * ANALYTICS MODULE SCHEMAS
 * ============================================================================
 */

/**
 * Health Metrics Schema
 */
export const HealthMetricsSchema = Joi.object({
  totalHealthVisits: Joi.number().integer().example(1250).description('Total health visits'),
  totalIncidents: Joi.number().integer().example(245).description('Total incidents'),
  totalMedicationAdministrations: Joi.number().integer().example(3400).description('Total medication administrations'),
  chronicConditionPrevalence: Joi.number().example(12.8).description('Chronic condition prevalence percentage'),
  immunizationComplianceRate: Joi.number().example(96.5).description('Immunization compliance rate percentage'),
  emergencyContactCoverage: Joi.number().example(99.2).description('Emergency contact coverage percentage'),
  appointmentNoShowRate: Joi.number().example(6.1).description('Appointment no-show rate percentage'),
  averageResponseTimeMinutes: Joi.number().example(5.3).description('Average response time in minutes'),
  studentHealthScore: Joi.number().example(87.5).description('Overall student health score')
}).label('HealthMetrics');

/**
 * Trend Data Point Schema
 */
export const TrendDataPointSchema = Joi.object({
  date: Joi.date().iso().example('2025-10-01T00:00:00Z').description('Data point date'),
  value: Joi.number().example(45).description('Metric value'),
  label: Joi.string().optional().example('Week 1').description('Data point label')
}).label('TrendDataPoint');

/**
 * Health Trend Schema
 */
export const HealthTrendSchema = Joi.object({
  metricName: Joi.string().example('Health Visits').description('Metric name'),
  timePeriod: Joi.string().valid('DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY').example('MONTHLY').description('Time period'),
  dataPoints: Joi.array().items(TrendDataPointSchema).description('Trend data points'),
  trend: Joi.string().valid('INCREASING', 'DECREASING', 'STABLE').example('STABLE').description('Trend direction'),
  changePercent: Joi.number().example(2.5).description('Change percentage')
}).label('HealthTrend');

/**
 * Medication Usage Schema
 */
export const MedicationUsageSchema = Joi.object({
  medicationName: Joi.string().example('Albuterol Inhaler').description('Medication name'),
  category: Joi.string().example('Bronchodilator').description('Medication category'),
  administrationCount: Joi.number().integer().example(145).description('Total administrations'),
  studentCount: Joi.number().integer().example(12).description('Number of students'),
  averageAdministrationsPerStudent: Joi.number().example(12.1).description('Average administrations per student'),
  adherenceRate: Joi.number().example(94.5).description('Adherence rate percentage'),
  trend: Joi.string().valid('INCREASING', 'DECREASING', 'STABLE').example('STABLE').description('Usage trend')
}).label('MedicationUsage');

/**
 * Incident Trend Schema
 */
export const IncidentTrendSchema = Joi.object({
  incidentType: Joi.string().example('INJURY').description('Incident type'),
  count: Joi.number().integer().example(125).description('Incident count'),
  percentage: Joi.number().example(51.0).description('Percentage of total incidents'),
  trend: Joi.string().valid('INCREASING', 'DECREASING', 'STABLE').example('DECREASING').description('Trend direction'),
  byTimeOfDay: Joi.object().pattern(Joi.string(), Joi.number()).optional().example({
    'Morning': 35,
    'Midday': 55,
    'Afternoon': 35
  }).description('Distribution by time of day'),
  byLocation: Joi.object().pattern(Joi.string(), Joi.number()).optional().example({
    'Playground': 45,
    'Gymnasium': 30,
    'Classroom': 25,
    'Cafeteria': 25
  }).description('Distribution by location')
}).label('IncidentTrend');

/**
 * Dashboard Widget Schema
 */
export const DashboardWidgetSchema = Joi.object({
  widgetType: Joi.string().example('METRIC_CARD').description('Widget type'),
  title: Joi.string().example('Total Health Visits Today').description('Widget title'),
  value: Joi.any().example(42).description('Widget value'),
  subtitle: Joi.string().optional().example('8 more than yesterday').description('Widget subtitle'),
  trend: Joi.string().valid('UP', 'DOWN', 'STABLE').optional().example('UP').description('Trend indicator'),
  priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH', 'CRITICAL').optional().example('MEDIUM').description('Priority level')
}).label('DashboardWidget');

/**
 * Custom Report Schema
 */
export const CustomReportSchema = Joi.object({
  id: Joi.string().uuid().example('123e4567-e89b-12d3-a456-426614174008').description('Report UUID'),
  reportName: Joi.string().example('Monthly Health Metrics Report').description('Report name'),
  reportType: Joi.string()
    .valid('HEALTH_METRICS', 'INCIDENT_ANALYSIS', 'MEDICATION_USAGE', 'APPOINTMENT_SUMMARY', 'COMPLIANCE_STATUS', 'STUDENT_HEALTH_SUMMARY', 'IMMUNIZATION_REPORT', 'CUSTOM')
    .example('HEALTH_METRICS')
    .description('Report type'),
  format: Joi.string().valid('JSON', 'PDF', 'CSV', 'XLSX').example('PDF').description('Report format'),
  generatedAt: Joi.date().iso().example('2025-10-23T14:00:00Z').description('Generation timestamp'),
  generatedBy: Joi.string().uuid().description('Generator user ID'),
  status: Joi.string().valid('GENERATING', 'COMPLETED', 'FAILED').example('COMPLETED').description('Report status'),
  downloadUrl: Joi.string().uri().optional().example('https://storage.example.com/reports/report-123.pdf').description('Download URL'),
  expiresAt: Joi.date().iso().optional().example('2025-11-23T14:00:00Z').description('Download expiration'),
  data: Joi.object().optional().description('Report data (if format is JSON)')
}).label('CustomReport');

/**
 * Analytics Response Schemas
 */
export const HealthMetricsResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.object({
    metrics: HealthMetricsSchema,
    period: Joi.object({
      startDate: Joi.date().iso().example('2025-10-01T00:00:00Z'),
      endDate: Joi.date().iso().example('2025-10-23T23:59:59Z')
    }),
    aggregationLevel: Joi.string().example('SCHOOL'),
    comparisonData: Joi.object().optional()
  })
}).label('HealthMetricsResponse');

export const HealthTrendsResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.object({
    healthConditionTrends: Joi.array().items(HealthTrendSchema),
    medicationTrends: Joi.array().items(HealthTrendSchema),
    period: Joi.object({
      startDate: Joi.date().iso(),
      endDate: Joi.date().iso()
    }),
    timePeriod: Joi.string().example('MONTHLY'),
    forecastingEnabled: Joi.boolean().example(false)
  })
}).label('HealthTrendsResponse');

export const MedicationUsageResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.object({
    usageChart: Joi.array().items(MedicationUsageSchema),
    topMedications: Joi.array().items(MedicationUsageSchema),
    totalAdministrations: Joi.number().integer().example(3400),
    adherenceIncluded: Joi.boolean().example(true)
  })
}).label('MedicationUsageResponse');

export const IncidentTrendsResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.object({
    trends: Joi.array().items(IncidentTrendSchema),
    byType: Joi.object().pattern(Joi.string(), Joi.number()),
    byTimeOfDay: Joi.object().pattern(Joi.string(), Joi.number())
  })
}).label('IncidentTrendsResponse');

export const NurseDashboardResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.object({
    overview: Joi.object({
      totalPatientsToday: Joi.number().integer().example(42),
      activeAppointments: Joi.number().integer().example(8),
      criticalAlerts: Joi.number().integer().example(2),
      bedOccupancy: Joi.number().example(75.0)
    }),
    alerts: Joi.array().items(DashboardWidgetSchema),
    upcomingTasks: Joi.array().items(Joi.object({
      type: Joi.string().example('Medication Administration'),
      student: Joi.string().example('John Doe'),
      time: Joi.date().iso().example('2025-10-23T15:00:00Z'),
      priority: Joi.string().example('HIGH')
    })),
    timeRange: Joi.string().example('TODAY'),
    lastUpdated: Joi.date().iso().example('2025-10-23T14:30:00Z')
  })
}).label('NurseDashboardResponse');

export const AdminDashboardResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.object({
    summary: Joi.object({
      totalStudents: Joi.number().integer().example(1250),
      totalHealthVisits: Joi.number().integer().example(450),
      immunizationComplianceRate: Joi.number().example(96.5),
      topHealthConditions: Joi.array().items(Joi.string()).example(['Asthma', 'Allergies', 'ADHD'])
    }),
    complianceMetrics: Joi.object({
      immunizationCompliance: Joi.number().example(96.5),
      documentationCompliance: Joi.number().example(98.5),
      staffTrainingCompliance: Joi.number().example(92.3),
      auditReadiness: Joi.number().example(94.7)
    }).optional(),
    insights: Joi.array().items(Joi.object({
      type: Joi.string().example('OUTBREAK_RISK'),
      title: Joi.string().example('Flu Activity Increasing'),
      description: Joi.string().example('15% increase in flu-like symptoms this week'),
      severity: Joi.string().example('MEDIUM'),
      recommendation: Joi.string().example('Consider flu vaccination reminder')
    })),
    timeRange: Joi.string().example('MONTH')
  })
}).label('AdminDashboardResponse');

export const CustomReportResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.object({
    report: CustomReportSchema
  })
}).label('CustomReportResponse');

/**
 * ============================================================================
 * COMMUNICATIONS MODULE SCHEMAS
 * ============================================================================
 */

/**
 * Message Object Schema
 */
export const MessageSchema = Joi.object({
  id: Joi.string().uuid().example('123e4567-e89b-12d3-a456-426614174009').description('Message UUID'),
  subject: Joi.string().optional().example('Medication Reminder').description('Message subject'),
  content: Joi.string().example('Please remember to administer asthma medication at 2 PM').description('Message content'),
  priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH', 'URGENT').example('HIGH').description('Message priority'),
  category: Joi.string()
    .valid('EMERGENCY', 'HEALTH_UPDATE', 'APPOINTMENT_REMINDER', 'MEDICATION_REMINDER', 'GENERAL', 'INCIDENT_NOTIFICATION', 'COMPLIANCE')
    .example('MEDICATION_REMINDER')
    .description('Message category'),
  status: Joi.string().valid('DRAFT', 'SCHEDULED', 'SENT', 'DELIVERED', 'FAILED', 'CANCELLED').example('SENT').description('Message status'),
  channels: Joi.array().items(Joi.string().valid('EMAIL', 'SMS', 'PUSH_NOTIFICATION', 'VOICE')).example(['EMAIL', 'SMS']).description('Communication channels'),
  senderId: Joi.string().uuid().description('Sender user ID'),
  senderName: Joi.string().optional().example('Nurse Jane').description('Sender name'),
  recipientCount: Joi.number().integer().example(1).description('Total recipient count'),
  deliveryStatus: Joi.object({
    sent: Joi.number().integer().example(1).description('Messages sent'),
    delivered: Joi.number().integer().example(1).description('Messages delivered'),
    failed: Joi.number().integer().example(0).description('Messages failed'),
    pending: Joi.number().integer().example(0).description('Messages pending')
  }).optional().description('Delivery status summary'),
  templateId: Joi.string().uuid().optional().description('Template ID used'),
  scheduledAt: Joi.date().iso().optional().example('2025-10-23T14:00:00Z').description('Scheduled delivery time'),
  sentAt: Joi.date().iso().optional().example('2025-10-23T14:00:05Z').description('Actual send time'),
  attachments: Joi.array().items(Joi.object({
    filename: Joi.string().example('report.pdf'),
    url: Joi.string().uri().example('https://storage.example.com/attachments/report.pdf'),
    mimeType: Joi.string().example('application/pdf'),
    size: Joi.number().integer().example(245760).description('Size in bytes')
  })).optional().description('Message attachments'),
  createdAt: Joi.date().iso().example('2025-10-23T13:55:00Z').description('Creation timestamp'),
  updatedAt: Joi.date().iso().example('2025-10-23T14:00:00Z').description('Last update timestamp')
}).label('Message');

/**
 * Message Template Schema
 */
export const MessageTemplateSchema = Joi.object({
  id: Joi.string().uuid().example('123e4567-e89b-12d3-a456-426614174010').description('Template UUID'),
  name: Joi.string().example('Medication Reminder Template').description('Template name'),
  subject: Joi.string().optional().example('Medication Administration Reminder').description('Template subject'),
  content: Joi.string().example('Please remember to administer {{medicationName}} to {{studentName}} at {{time}}').description('Template content with variables'),
  type: Joi.string().valid('EMAIL', 'SMS', 'PUSH_NOTIFICATION', 'VOICE').example('EMAIL').description('Primary message type'),
  category: Joi.string()
    .valid('EMERGENCY', 'HEALTH_UPDATE', 'APPOINTMENT_REMINDER', 'MEDICATION_REMINDER', 'GENERAL', 'INCIDENT_NOTIFICATION', 'COMPLIANCE')
    .example('MEDICATION_REMINDER')
    .description('Template category'),
  variables: Joi.array().items(Joi.string()).example(['medicationName', 'studentName', 'time']).description('Template variables'),
  isActive: Joi.boolean().example(true).description('Template active status'),
  usageCount: Joi.number().integer().optional().example(145).description('Times template has been used'),
  createdBy: Joi.string().uuid().optional().description('Creator user ID'),
  createdAt: Joi.date().iso().example('2025-09-01T10:00:00Z').description('Creation timestamp'),
  updatedAt: Joi.date().iso().example('2025-10-15T14:30:00Z').description('Last update timestamp')
}).label('MessageTemplate');

/**
 * Broadcast Message Schema
 */
export const BroadcastSchema = Joi.object({
  id: Joi.string().uuid().example('123e4567-e89b-12d3-a456-426614174011').description('Broadcast UUID'),
  subject: Joi.string().optional().example('Emergency Weather Alert').description('Broadcast subject'),
  content: Joi.string().example('School will close at 1 PM today due to severe weather conditions').description('Broadcast content'),
  priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH', 'URGENT').example('URGENT').description('Broadcast priority'),
  category: Joi.string()
    .valid('EMERGENCY', 'HEALTH_UPDATE', 'APPOINTMENT_REMINDER', 'MEDICATION_REMINDER', 'GENERAL', 'INCIDENT_NOTIFICATION', 'COMPLIANCE')
    .example('EMERGENCY')
    .description('Broadcast category'),
  status: Joi.string().valid('DRAFT', 'SCHEDULED', 'SENDING', 'SENT', 'FAILED', 'CANCELLED').example('SENT').description('Broadcast status'),
  channels: Joi.array().items(Joi.string().valid('EMAIL', 'SMS', 'PUSH_NOTIFICATION', 'VOICE')).example(['EMAIL', 'SMS', 'PUSH_NOTIFICATION']).description('Communication channels'),
  audience: Joi.object({
    grades: Joi.array().items(Joi.string()).optional().example(['6', '7', '8']).description('Target grade levels'),
    nurseIds: Joi.array().items(Joi.string().uuid()).optional().description('Target nurse IDs'),
    studentIds: Joi.array().items(Joi.string().uuid()).optional().description('Specific student IDs'),
    includeEmergencyContacts: Joi.boolean().optional().example(true).description('Include emergency contacts'),
    includeParents: Joi.boolean().optional().example(true).description('Include parents'),
    schoolIds: Joi.array().items(Joi.string().uuid()).optional().description('Target school IDs')
  }).description('Audience targeting criteria'),
  senderId: Joi.string().uuid().description('Sender user ID'),
  senderName: Joi.string().optional().example('District Administrator').description('Sender name'),
  recipientCount: Joi.number().integer().example(450).description('Total recipient count'),
  deliveryStatus: Joi.object({
    sent: Joi.number().integer().example(450).description('Messages sent'),
    delivered: Joi.number().integer().example(438).description('Messages delivered'),
    failed: Joi.number().integer().example(12).description('Messages failed'),
    pending: Joi.number().integer().example(0).description('Messages pending')
  }).description('Delivery status summary'),
  templateId: Joi.string().uuid().optional().description('Template ID used'),
  scheduledAt: Joi.date().iso().optional().description('Scheduled delivery time'),
  sentAt: Joi.date().iso().optional().example('2025-10-23T12:30:00Z').description('Actual send time'),
  createdAt: Joi.date().iso().example('2025-10-23T12:25:00Z').description('Creation timestamp'),
  updatedAt: Joi.date().iso().example('2025-10-23T12:35:00Z').description('Last update timestamp')
}).label('Broadcast');

/**
 * Delivery Record Schema
 */
export const DeliveryRecordSchema = Joi.object({
  id: Joi.string().uuid().example('123e4567-e89b-12d3-a456-426614174012').description('Delivery record UUID'),
  messageId: Joi.string().uuid().description('Message UUID'),
  recipientId: Joi.string().uuid().description('Recipient user ID'),
  recipientName: Joi.string().optional().example('John Doe').description('Recipient name'),
  recipientType: Joi.string().valid('STUDENT', 'EMERGENCY_CONTACT', 'PARENT', 'NURSE', 'ADMIN').example('PARENT').description('Recipient type'),
  channel: Joi.string().valid('EMAIL', 'SMS', 'PUSH_NOTIFICATION', 'VOICE').example('EMAIL').description('Delivery channel'),
  status: Joi.string().valid('PENDING', 'SENT', 'DELIVERED', 'FAILED', 'BOUNCED').example('DELIVERED').description('Delivery status'),
  contactInfo: Joi.string().optional().example('parent@example.com').description('Contact information used'),
  sentAt: Joi.date().iso().optional().example('2025-10-23T14:00:05Z').description('Send timestamp'),
  deliveredAt: Joi.date().iso().optional().example('2025-10-23T14:00:08Z').description('Delivery timestamp'),
  failureReason: Joi.string().optional().description('Failure reason if status is FAILED'),
  externalId: Joi.string().optional().example('ext-msg-12345').description('External provider message ID'),
  retryCount: Joi.number().integer().optional().example(0).description('Retry attempt count')
}).label('DeliveryRecord');

/**
 * Scheduled Message Schema
 */
export const ScheduledMessageSchema = Joi.object({
  id: Joi.string().uuid().example('123e4567-e89b-12d3-a456-426614174013').description('Scheduled message UUID'),
  subject: Joi.string().example('Weekly Health Reminder').description('Message subject'),
  body: Joi.string().example('Remember to update immunization records by Friday').description('Message body'),
  recipientType: Joi.string()
    .valid('ALL_PARENTS', 'SPECIFIC_USERS', 'STUDENT_PARENTS', 'GRADE_LEVEL', 'CUSTOM_GROUP')
    .example('ALL_PARENTS')
    .description('Recipient type'),
  recipientCount: Joi.number().integer().example(325).description('Estimated recipient count'),
  channels: Joi.array().items(Joi.string().valid('EMAIL', 'SMS', 'PUSH', 'PORTAL')).example(['EMAIL']).description('Delivery channels'),
  scheduledFor: Joi.date().iso().example('2025-10-25T09:00:00Z').description('Scheduled delivery time'),
  timezone: Joi.string().example('America/New_York').description('Timezone'),
  priority: Joi.string().valid('LOW', 'NORMAL', 'HIGH').example('NORMAL').description('Message priority'),
  status: Joi.string().valid('PENDING', 'PROCESSING', 'SENT', 'FAILED', 'CANCELLED', 'PAUSED').example('PENDING').description('Schedule status'),
  scheduleType: Joi.string().valid('ONE_TIME', 'RECURRING', 'CAMPAIGN').example('ONE_TIME').description('Schedule type'),
  recurrence: Joi.object({
    pattern: Joi.string().valid('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY', 'CUSTOM').example('WEEKLY'),
    interval: Joi.number().integer().example(1).description('Repeat every N units'),
    endDate: Joi.date().iso().optional(),
    endAfterOccurrences: Joi.number().integer().optional()
  }).optional().description('Recurrence pattern'),
  templateId: Joi.string().uuid().optional().description('Template ID'),
  templateVariables: Joi.object().pattern(Joi.string(), Joi.string()).optional().description('Template variables'),
  throttle: Joi.object({
    maxPerMinute: Joi.number().integer().example(100),
    maxPerHour: Joi.number().integer().example(1000)
  }).optional().description('Rate limiting'),
  createdBy: Joi.string().uuid().description('Creator user ID'),
  createdAt: Joi.date().iso().example('2025-10-23T10:00:00Z').description('Creation timestamp'),
  updatedAt: Joi.date().iso().example('2025-10-23T10:00:00Z').description('Last update timestamp')
}).label('ScheduledMessage');

/**
 * Communication Statistics Schema
 */
export const CommunicationStatisticsSchema = Joi.object({
  totalMessages: Joi.number().integer().example(1847).description('Total messages sent'),
  byCategory: Joi.object().pattern(Joi.string(), Joi.number()).example({
    'EMERGENCY': 12,
    'HEALTH_UPDATE': 245,
    'APPOINTMENT_REMINDER': 520,
    'MEDICATION_REMINDER': 680,
    'GENERAL': 290,
    'INCIDENT_NOTIFICATION': 85,
    'COMPLIANCE': 15
  }).description('Messages by category'),
  byPriority: Joi.object().pattern(Joi.string(), Joi.number()).example({
    'LOW': 450,
    'MEDIUM': 920,
    'HIGH': 397,
    'URGENT': 80
  }).description('Messages by priority'),
  byChannel: Joi.object().pattern(Joi.string(), Joi.number()).example({
    'EMAIL': 1650,
    'SMS': 890,
    'PUSH_NOTIFICATION': 425,
    'VOICE': 12
  }).description('Messages by channel'),
  deliverySuccessRate: Joi.number().example(96.8).description('Overall delivery success rate percentage'),
  averageDeliveryTimeSeconds: Joi.number().example(3.2).description('Average delivery time in seconds'),
  failureRate: Joi.number().example(3.2).description('Overall failure rate percentage'),
  bounceRate: Joi.number().example(1.5).description('Overall bounce rate percentage'),
  period: Joi.object({
    startDate: Joi.date().iso().example('2025-10-01T00:00:00Z'),
    endDate: Joi.date().iso().example('2025-10-23T23:59:59Z')
  }).description('Statistics period'),
  trends: Joi.object({
    messageTrend: Joi.string().valid('INCREASING', 'DECREASING', 'STABLE').example('STABLE'),
    changePercent: Joi.number().example(2.5).description('Change percentage from previous period')
  }).optional().description('Trend analysis')
}).label('CommunicationStatistics');

/**
 * Bulk Message Result Schema
 */
export const BulkMessageResultSchema = Joi.object({
  messageId: Joi.string().uuid().example('123e4567-e89b-12d3-a456-426614174014').description('Bulk message UUID'),
  recipientsProcessed: Joi.number().integer().example(150).description('Total recipients processed'),
  recipientsSuccessful: Joi.number().integer().example(147).description('Successful deliveries'),
  recipientsFailed: Joi.number().integer().example(3).description('Failed deliveries'),
  status: Joi.string().valid('QUEUED', 'PROCESSING', 'COMPLETED', 'PARTIAL_FAILURE', 'FAILED').example('COMPLETED').description('Overall status'),
  failedRecipients: Joi.array().items(Joi.object({
    recipientId: Joi.string().uuid(),
    recipientType: Joi.string(),
    contactMethod: Joi.string(),
    error: Joi.string()
  })).optional().description('Failed recipient details'),
  estimatedCompletionTime: Joi.date().iso().optional().description('Estimated completion time'),
  createdAt: Joi.date().iso().example('2025-10-23T14:00:00Z').description('Creation timestamp')
}).label('BulkMessageResult');

/**
 * Communications Response Schemas
 */
export const MessageResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.object({
    message: MessageSchema
  })
}).label('MessageResponse');

export const MessageListResponseSchema = createPaginatedResponseSchema(MessageSchema, 'MessageListResponse');

export const MessageTemplateResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.object({
    template: MessageTemplateSchema
  })
}).label('MessageTemplateResponse');

export const MessageTemplateListResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.object({
    templates: Joi.array().items(MessageTemplateSchema)
  })
}).label('MessageTemplateListResponse');

export const BroadcastResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.object({
    broadcast: BroadcastSchema
  })
}).label('BroadcastResponse');

export const BroadcastListResponseSchema = createPaginatedResponseSchema(BroadcastSchema, 'BroadcastListResponse');

export const DeliveryStatusResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.object({
    messageId: Joi.string().uuid().example('123e4567-e89b-12d3-a456-426614174009'),
    summary: Joi.object({
      total: Joi.number().integer().example(5),
      sent: Joi.number().integer().example(5),
      delivered: Joi.number().integer().example(4),
      failed: Joi.number().integer().example(1),
      pending: Joi.number().integer().example(0)
    }),
    byChannel: Joi.object().pattern(Joi.string(), Joi.object({
      sent: Joi.number().integer(),
      delivered: Joi.number().integer(),
      failed: Joi.number().integer()
    })).optional(),
    deliveries: Joi.array().items(DeliveryRecordSchema)
  })
}).label('DeliveryStatusResponse');

export const BroadcastRecipientsResponseSchema = createPaginatedResponseSchema(DeliveryRecordSchema, 'BroadcastRecipientsResponse');

export const BroadcastDeliveryReportResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.object({
    broadcastId: Joi.string().uuid().example('123e4567-e89b-12d3-a456-426614174011'),
    summary: Joi.object({
      total: Joi.number().integer().example(450),
      sent: Joi.number().integer().example(450),
      delivered: Joi.number().integer().example(438),
      failed: Joi.number().integer().example(12),
      pending: Joi.number().integer().example(0)
    }),
    byChannel: Joi.object().pattern(Joi.string(), Joi.object({
      sent: Joi.number().integer(),
      delivered: Joi.number().integer(),
      failed: Joi.number().integer()
    })),
    byRecipientType: Joi.object().pattern(Joi.string(), Joi.object({
      count: Joi.number().integer(),
      delivered: Joi.number().integer(),
      failed: Joi.number().integer()
    })),
    deliveries: Joi.array().items(DeliveryRecordSchema).description('Individual delivery records')
  })
}).label('BroadcastDeliveryReportResponse');

export const ScheduledMessageResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.object({
    scheduledMessage: ScheduledMessageSchema
  })
}).label('ScheduledMessageResponse');

export const ScheduledMessageListResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.object({
    scheduledMessages: Joi.array().items(ScheduledMessageSchema),
    count: Joi.number().integer().example(15).description('Total count')
  })
}).label('ScheduledMessageListResponse');

export const CommunicationStatisticsResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.object({
    statistics: CommunicationStatisticsSchema
  })
}).label('CommunicationStatisticsResponse');

export const BulkMessageResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.object({
    result: BulkMessageResultSchema
  })
}).label('BulkMessageResponse');

/**
 * ============================================================================
 * USAGE EXAMPLE
 * ============================================================================
 *
 * // In your route file:
 * import { DocumentResponseSchema, ErrorResponseSchema } from '../RESPONSE_SCHEMAS';
 *
 * const getDocumentRoute: ServerRoute = {
 *   method: 'GET',
 *   path: '/api/v1/documents/{id}',
 *   handler: asyncHandler(DocumentsController.getDocumentById),
 *   options: {
 *     auth: 'jwt',
 *     tags: ['api', 'Documents'],
 *     description: 'Get document by ID',
 *     validate: {
 *       params: documentIdParamSchema
 *     },
 *     plugins: {
 *       'hapi-swagger': {
 *         responses: {
 *           '200': {
 *             description: 'Document retrieved successfully',
 *             schema: DocumentResponseSchema
 *           },
 *           '404': {
 *             description: 'Document not found',
 *             schema: ErrorResponseSchema
 *           },
 *           '500': {
 *             description: 'Internal server error',
 *             schema: ErrorResponseSchema
 *           }
 *         }
 *       }
 *     }
 *   }
 * };
 */
