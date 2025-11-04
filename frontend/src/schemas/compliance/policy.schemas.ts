import { z } from 'zod';

/**
 * Policy Management Schemas
 * Validation schemas for organizational policies and acknowledgments
 */

// Policy Type
export const PolicyType = z.enum([
  'HIPAA_PRIVACY',
  'HIPAA_SECURITY',
  'DATA_BREACH',
  'ACCEPTABLE_USE',
  'PASSWORD_POLICY',
  'ACCESS_CONTROL',
  'INCIDENT_RESPONSE',
  'BUSINESS_ASSOCIATE',
  'DATA_RETENTION',
  'TRAINING_REQUIREMENTS',
  'REMOTE_ACCESS',
  'MOBILE_DEVICE',
  'BYOD',
  'SOCIAL_MEDIA',
  'EMAIL_COMMUNICATION',
  'WORKSTATION_SECURITY',
  'PHYSICAL_SECURITY',
  'DISASTER_RECOVERY',
  'BACKUP_POLICY',
  'AUDIT_POLICY',
  'RISK_MANAGEMENT',
  'VENDOR_MANAGEMENT',
  'CHANGE_MANAGEMENT',
  'CUSTOM',
]);

export type PolicyTypeEnum = z.infer<typeof PolicyType>;

// Policy Status
export const PolicyStatus = z.enum([
  'DRAFT',
  'REVIEW',
  'APPROVED',
  'ACTIVE',
  'ARCHIVED',
  'SUPERSEDED',
]);

export type PolicyStatusEnum = z.infer<typeof PolicyStatus>;

// Policy Schema
export const PolicySchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(300),
  policyType: PolicyType,
  version: z.string().regex(/^\d+\.\d+(\.\d+)?$/), // Semantic versioning
  description: z.string().min(1),
  content: z.string().min(1), // Rich text or markdown
  effectiveDate: z.string().datetime(),
  expirationDate: z.string().datetime().optional(),
  reviewDate: z.string().datetime(),
  status: PolicyStatus,

  // Ownership and approval
  owner: z.object({
    userId: z.string().uuid(),
    name: z.string(),
    role: z.string(),
  }),
  approvers: z.array(z.object({
    userId: z.string().uuid(),
    name: z.string(),
    role: z.string(),
    approvedAt: z.string().datetime().optional(),
    signature: z.string().optional(),
  })),

  // Applicability
  applicableRoles: z.array(z.string()),
  applicableDepartments: z.array(z.string()).optional(),
  mandatory: z.boolean(),

  // Acknowledgment requirements
  requiresAcknowledgment: z.boolean(),
  acknowledgmentText: z.string().optional(),
  requiresSignature: z.boolean().default(false),
  acknowledgmentDeadline: z.object({
    value: z.number().int().positive(),
    unit: z.enum(['DAYS', 'WEEKS', 'MONTHS']),
  }).optional(),

  // Related information
  relatedPolicies: z.array(z.string().uuid()).optional(),
  attachments: z.array(z.object({
    id: z.string().uuid(),
    name: z.string(),
    url: z.string().url(),
    type: z.string(),
    size: z.number().int().nonnegative(),
  })).optional(),

  // Regulatory compliance
  regulatoryReferences: z.array(z.object({
    regulation: z.string(), // e.g., "HIPAA §164.308(a)(1)"
    description: z.string(),
  })).optional(),

  // Change tracking
  changeLog: z.array(z.object({
    version: z.string(),
    changes: z.string(),
    changedBy: z.string().uuid(),
    changedAt: z.string().datetime(),
  })).optional(),

  // Superseded information
  supersededBy: z.string().uuid().optional(),
  supersedes: z.string().uuid().optional(),

  // Metadata
  tags: z.array(z.string()).optional(),
  searchKeywords: z.array(z.string()).optional(),
  createdBy: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedBy: z.string().uuid().optional(),
  updatedAt: z.string().datetime(),
});

export type Policy = z.infer<typeof PolicySchema>;

// Policy Acknowledgment Schema
export const PolicyAcknowledgmentSchema = z.object({
  id: z.string().uuid(),
  policyId: z.string().uuid(),
  policyVersion: z.string(),
  userId: z.string().uuid(),
  userName: z.string(),
  userRole: z.string(),
  acknowledgedAt: z.string().datetime(),

  // Acknowledgment details
  acknowledgmentMethod: z.enum(['WEB', 'EMAIL', 'PAPER', 'IN_PERSON']),
  signature: z.string().optional(), // Digital signature or scanned image
  signatureType: z.enum(['TYPED', 'DRAWN', 'UPLOADED', 'CERTIFICATE']).optional(),

  // Verification
  ipAddress: z.string(),
  userAgent: z.string(),
  verificationCode: z.string().optional(),
  witnessedBy: z.string().uuid().optional(),

  // Attestations
  attestations: z.array(z.object({
    statement: z.string(),
    agreed: z.boolean(),
  })).optional(),

  // Quiz/assessment (if required)
  assessmentCompleted: z.boolean().default(false),
  assessmentScore: z.number().min(0).max(100).optional(),
  assessmentPassed: z.boolean().optional(),

  // Certificate
  certificateGenerated: z.boolean().default(false),
  certificateUrl: z.string().url().optional(),

  // Audit trail
  verificationHash: z.string(), // Cryptographic proof
});

export type PolicyAcknowledgment = z.infer<typeof PolicyAcknowledgmentSchema>;

// Policy Assignment Schema
export const PolicyAssignmentSchema = z.object({
  id: z.string().uuid(),
  policyId: z.string().uuid(),
  assignedTo: z.object({
    type: z.enum(['USER', 'ROLE', 'DEPARTMENT']),
    id: z.string(),
    name: z.string(),
  }),
  assignedBy: z.string().uuid(),
  assignedAt: z.string().datetime(),
  dueDate: z.string().datetime().optional(),
  status: z.enum(['PENDING', 'ACKNOWLEDGED', 'OVERDUE', 'EXEMPTED']),
  exemptionReason: z.string().optional(),
  exemptedBy: z.string().uuid().optional(),
  reminders: z.array(z.object({
    sentAt: z.string().datetime(),
    method: z.enum(['EMAIL', 'SMS', 'PUSH', 'IN_APP']),
  })).optional(),
});

export type PolicyAssignment = z.infer<typeof PolicyAssignmentSchema>;

// Policy Filter Schema
export const PolicyFilterSchema = z.object({
  policyTypes: z.array(PolicyType).optional(),
  statuses: z.array(PolicyStatus).optional(),
  applicableRoles: z.array(z.string()).optional(),
  mandatory: z.boolean().optional(),
  requiresAcknowledgment: z.boolean().optional(),
  effectiveDateStart: z.string().datetime().optional(),
  effectiveDateEnd: z.string().datetime().optional(),
  expiringWithin: z.object({
    value: z.number().int().positive(),
    unit: z.enum(['DAYS', 'WEEKS', 'MONTHS']),
  }).optional(),
  searchTerm: z.string().optional(),
  tags: z.array(z.string()).optional(),
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().max(100).default(20),
  sortBy: z.enum(['title', 'effectiveDate', 'reviewDate', 'status', 'policyType']).default('effectiveDate'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type PolicyFilter = z.infer<typeof PolicyFilterSchema>;

// Policy Acknowledgment Filter Schema
export const PolicyAcknowledgmentFilterSchema = z.object({
  policyIds: z.array(z.string().uuid()).optional(),
  userIds: z.array(z.string().uuid()).optional(),
  roles: z.array(z.string()).optional(),
  departments: z.array(z.string()).optional(),
  acknowledgedDateStart: z.string().datetime().optional(),
  acknowledgedDateEnd: z.string().datetime().optional(),
  methods: z.array(z.enum(['WEB', 'EMAIL', 'PAPER', 'IN_PERSON'])).optional(),
  assessmentPassed: z.boolean().optional(),
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().max(100).default(20),
  sortBy: z.enum(['acknowledgedAt', 'userName', 'policyVersion']).default('acknowledgedAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type PolicyAcknowledgmentFilter = z.infer<typeof PolicyAcknowledgmentFilterSchema>;

// Policy Statistics Schema
export const PolicyStatisticsSchema = z.object({
  policyId: z.string().uuid(),
  policyTitle: z.string(),
  totalAssignments: z.number().int().nonnegative(),
  acknowledged: z.number().int().nonnegative(),
  pending: z.number().int().nonnegative(),
  overdue: z.number().int().nonnegative(),
  exempted: z.number().int().nonnegative(),
  acknowledgmentRate: z.number().min(0).max(100),
  averageAcknowledgmentTime: z.number().nonnegative(), // in hours
  byRole: z.record(z.string(), z.object({
    total: z.number().int().nonnegative(),
    acknowledged: z.number().int().nonnegative(),
    rate: z.number().min(0).max(100),
  })).optional(),
  byDepartment: z.record(z.string(), z.object({
    total: z.number().int().nonnegative(),
    acknowledged: z.number().int().nonnegative(),
    rate: z.number().min(0).max(100),
  })).optional(),
});

export type PolicyStatistics = z.infer<typeof PolicyStatisticsSchema>;

// Policy Create/Update Schemas
export const PolicyCreateSchema = PolicySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  changeLog: true,
}).partial({
  status: true,
  version: true,
  createdBy: true,
  updatedBy: true,
});

export type PolicyCreate = z.infer<typeof PolicyCreateSchema>;

export const PolicyUpdateSchema = PolicySchema.partial().required({
  id: true,
});

export type PolicyUpdate = z.infer<typeof PolicyUpdateSchema>;
