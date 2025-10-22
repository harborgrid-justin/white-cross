import { QueryClient } from '@tanstack/react-query';

// Query Keys for Compliance Domain
export const COMPLIANCE_QUERY_KEYS = {
  // Audits
  audits: ['compliance', 'audits'] as const,
  auditsList: (filters?: any) => [...COMPLIANCE_QUERY_KEYS.audits, 'list', filters] as const,
  auditDetails: (id: string) => [...COMPLIANCE_QUERY_KEYS.audits, 'detail', id] as const,
  auditReports: (auditId: string) => [...COMPLIANCE_QUERY_KEYS.audits, auditId, 'reports'] as const,
  
  // Compliance Reports
  reports: ['compliance', 'reports'] as const,
  reportsList: (filters?: any) => [...COMPLIANCE_QUERY_KEYS.reports, 'list', filters] as const,
  reportDetails: (id: string) => [...COMPLIANCE_QUERY_KEYS.reports, 'detail', id] as const,
  
  // Policies
  policies: ['compliance', 'policies'] as const,
  policiesList: (filters?: any) => [...COMPLIANCE_QUERY_KEYS.policies, 'list', filters] as const,
  policyDetails: (id: string) => [...COMPLIANCE_QUERY_KEYS.policies, 'detail', id] as const,
  policyVersions: (policyId: string) => [...COMPLIANCE_QUERY_KEYS.policies, policyId, 'versions'] as const,
  
  // Training
  training: ['compliance', 'training'] as const,
  trainingList: (filters?: any) => [...COMPLIANCE_QUERY_KEYS.training, 'list', filters] as const,
  trainingDetails: (id: string) => [...COMPLIANCE_QUERY_KEYS.training, 'detail', id] as const,
  userTraining: (userId: string) => [...COMPLIANCE_QUERY_KEYS.training, 'user', userId] as const,
  
  // Incidents
  incidents: ['compliance', 'incidents'] as const,
  incidentsList: (filters?: any) => [...COMPLIANCE_QUERY_KEYS.incidents, 'list', filters] as const,
  incidentDetails: (id: string) => [...COMPLIANCE_QUERY_KEYS.incidents, 'detail', id] as const,
  
  // Risk Assessments
  riskAssessments: ['compliance', 'risk-assessments'] as const,
  riskAssessmentsList: (filters?: any) => [...COMPLIANCE_QUERY_KEYS.riskAssessments, 'list', filters] as const,
  riskAssessmentDetails: (id: string) => [...COMPLIANCE_QUERY_KEYS.riskAssessments, 'detail', id] as const,
} as const;

// Cache Configuration
export const COMPLIANCE_CACHE_CONFIG = {
  // Standard cache times
  DEFAULT_STALE_TIME: 5 * 60 * 1000, // 5 minutes
  DEFAULT_CACHE_TIME: 10 * 60 * 1000, // 10 minutes
  
  // Specific configurations
  AUDITS_STALE_TIME: 10 * 60 * 1000, // 10 minutes
  POLICIES_STALE_TIME: 30 * 60 * 1000, // 30 minutes
  TRAINING_STALE_TIME: 15 * 60 * 1000, // 15 minutes
  INCIDENTS_STALE_TIME: 2 * 60 * 1000, // 2 minutes (more dynamic)
  REPORTS_STALE_TIME: 5 * 60 * 1000, // 5 minutes
} as const;

// TypeScript Interfaces
export interface ComplianceAudit {
  id: string;
  title: string;
  description: string;
  type: 'HIPAA' | 'SOX' | 'GDPR' | 'HITECH' | 'INTERNAL';
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  auditor: {
    id: string;
    name: string;
    organization?: string;
  };
  startDate: string;
  endDate?: string;
  scope: string[];
  findings: AuditFinding[];
  createdAt: string;
  updatedAt: string;
}

export interface AuditFinding {
  id: string;
  title: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  category: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'ACCEPTED_RISK';
  assignedTo?: string;
  dueDate?: string;
  resolution?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CompliancePolicy {
  id: string;
  title: string;
  description: string;
  category: 'PRIVACY' | 'SECURITY' | 'OPERATIONAL' | 'CLINICAL' | 'ADMINISTRATIVE';
  version: string;
  status: 'DRAFT' | 'UNDER_REVIEW' | 'APPROVED' | 'ACTIVE' | 'ARCHIVED';
  effectiveDate: string;
  reviewDate: string;
  approver?: {
    id: string;
    name: string;
  };
  content: string;
  attachments: PolicyAttachment[];
  relatedPolicies: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PolicyAttachment {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface ComplianceTraining {
  id: string;
  title: string;
  description: string;
  category: 'HIPAA' | 'SECURITY' | 'SAFETY' | 'CLINICAL' | 'GENERAL';
  type: 'ONLINE' | 'IN_PERSON' | 'HYBRID';
  duration: number; // in minutes
  isRequired: boolean;
  frequency?: 'ANNUAL' | 'BIANNUAL' | 'QUARTERLY' | 'MONTHLY';
  content: TrainingContent;
  completionCriteria: CompletionCriteria;
  createdAt: string;
  updatedAt: string;
}

export interface TrainingContent {
  modules: TrainingModule[];
  resources: TrainingResource[];
  assessment?: TrainingAssessment;
}

export interface TrainingModule {
  id: string;
  title: string;
  content: string;
  order: number;
  estimatedTime: number;
}

export interface TrainingResource {
  id: string;
  title: string;
  type: 'DOCUMENT' | 'VIDEO' | 'LINK' | 'PRESENTATION';
  url?: string;
  fileName?: string;
}

export interface TrainingAssessment {
  id: string;
  questions: AssessmentQuestion[];
  passingScore: number;
  maxAttempts: number;
}

export interface AssessmentQuestion {
  id: string;
  question: string;
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER';
  options?: string[];
  correctAnswer: string | string[];
  points: number;
}

export interface CompletionCriteria {
  requiresAssessment: boolean;
  minimumScore?: number;
  requiresAttendance?: boolean;
  attendanceThreshold?: number;
}

export interface UserTrainingRecord {
  id: string;
  userId: string;
  trainingId: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'EXPIRED' | 'FAILED';
  startedAt?: string;
  completedAt?: string;
  expiresAt?: string;
  score?: number;
  attempts: TrainingAttempt[];
  certificateUrl?: string;
}

export interface TrainingAttempt {
  id: string;
  attemptNumber: number;
  startedAt: string;
  completedAt?: string;
  score?: number;
  responses: AssessmentResponse[];
}

export interface AssessmentResponse {
  questionId: string;
  answer: string | string[];
  isCorrect: boolean;
  points: number;
}

export interface ComplianceIncident {
  id: string;
  title: string;
  description: string;
  type: 'BREACH' | 'VIOLATION' | 'NEAR_MISS' | 'COMPLAINT' | 'OTHER';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'REPORTED' | 'INVESTIGATING' | 'RESOLVED' | 'CLOSED';
  reportedBy: {
    id: string;
    name: string;
  };
  assignedTo?: {
    id: string;
    name: string;
  };
  affectedSystems: string[];
  affectedData?: string[];
  potentialImpact: string;
  actualImpact?: string;
  rootCause?: string;
  correctiveActions: CorrectiveAction[];
  reportedAt: string;
  occurredAt?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CorrectiveAction {
  id: string;
  description: string;
  assignedTo: string;
  dueDate: string;
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE';
  completedAt?: string;
  notes?: string;
}

export interface RiskAssessment {
  id: string;
  title: string;
  description: string;
  scope: string[];
  assessor: {
    id: string;
    name: string;
  };
  methodology: string;
  riskCategories: RiskCategory[];
  overallRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  recommendedActions: RecommendedAction[];
  status: 'DRAFT' | 'UNDER_REVIEW' | 'APPROVED' | 'IMPLEMENTED';
  assessmentDate: string;
  nextReviewDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface RiskCategory {
  id: string;
  name: string;
  description: string;
  risks: Risk[];
  categoryRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface Risk {
  id: string;
  title: string;
  description: string;
  likelihood: 'VERY_LOW' | 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';
  impact: 'VERY_LOW' | 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  currentControls: string[];
  residualRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  treatmentPlan?: string;
}

export interface RecommendedAction {
  id: string;
  title: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  estimatedCost?: number;
  estimatedTimeframe: string;
  responsibleParty?: string;
  status: 'RECOMMENDED' | 'APPROVED' | 'IN_PROGRESS' | 'COMPLETED' | 'DEFERRED';
}

// Utility Functions
export const invalidateComplianceQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: ['compliance'] });
};

export const invalidateAuditQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: COMPLIANCE_QUERY_KEYS.audits });
};

export const invalidatePolicyQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: COMPLIANCE_QUERY_KEYS.policies });
};

export const invalidateTrainingQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: COMPLIANCE_QUERY_KEYS.training });
};

export const invalidateIncidentQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: COMPLIANCE_QUERY_KEYS.incidents });
};

export const invalidateRiskAssessmentQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: COMPLIANCE_QUERY_KEYS.riskAssessments });
};
