// Enterprise Features Interfaces and Types
// Comprehensive type definitions for all enterprise features

// Enums for better type safety
export enum WaitlistPriority {
  ROUTINE = 'routine',
  URGENT = 'urgent',
}

export enum WaitlistStatus {
  WAITING = 'waiting',
  SCHEDULED = 'scheduled',
  CANCELLED = 'cancelled',
}

export enum ConsentFormStatus {
  PENDING = 'pending',
  SIGNED = 'signed',
  EXPIRED = 'expired',
  REVOKED = 'revoked',
}

export enum BulkMessageStatus {
  PENDING = 'pending',
  SENDING = 'sending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum ReminderTiming {
  HOURS_24 = '24h',
  HOURS_1 = '1h',
  MINUTES_15 = '15m',
}

export enum CommunicationChannel {
  EMAIL = 'email',
  SMS = 'sms',
  PUSH = 'push',
}

export enum EvidenceSecurityLevel {
  RESTRICTED = 'restricted',
  CONFIDENTIAL = 'confidential',
}

export enum WitnessRole {
  STUDENT = 'student',
  TEACHER = 'teacher',
  STAFF = 'staff',
  OTHER = 'other',
}

export enum CaptureMethod {
  TYPED = 'typed',
  VOICE_TO_TEXT = 'voice-to-text',
  HANDWRITTEN_SCAN = 'handwritten-scan',
}

export enum InsuranceClaimStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  APPROVED = 'approved',
  DENIED = 'denied',
}

export enum ComplianceStatus {
  COMPLIANT = 'compliant',
  NON_COMPLIANT = 'non-compliant',
  NEEDS_ATTENTION = 'needs-attention',
}

export enum RegulationStatus {
  PENDING_REVIEW = 'pending-review',
  IMPLEMENTING = 'implementing',
  IMPLEMENTED = 'implemented',
}

export enum ImpactLevel {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

export enum RecurrenceFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
}

export enum VisualizationType {
  TABLE = 'table',
  CHART = 'chart',
  GRAPH = 'graph',
}

export enum ReportFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
}

export enum TrendDirection {
  UP = 'up',
  DOWN = 'down',
  STABLE = 'stable',
}

export interface WaitlistEntry {
  id: string;
  studentId: string;
  appointmentType: string;
  priority: WaitlistPriority;
  addedAt: Date;
  status: WaitlistStatus;
  notes?: string;
}

export interface RecurringTemplate {
  id: string;
  name: string;
  appointmentType: string;
  recurrenceRule: {
    frequency: RecurrenceFrequency;
    interval: number;
    daysOfWeek?: number[];
    endDate?: Date;
  };
  duration: number; // minutes
  participants: string[];
  createdBy: string;
  createdAt: Date;
  isActive: boolean;
}

export interface ReminderSchedule {
  appointmentId: string;
  reminders: Array<{
    timing: '24h' | '1h' | '15m';
    channel: 'email' | 'sms' | 'push';
    sent: boolean;
    sentAt?: Date;
  }>;
}

export interface EvidenceFile {
  id: string;
  incidentId: string;
  type: 'photo' | 'video';
  filename: string;
  url: string;
  metadata: {
    fileSize: number;
    mimeType: string;
    resolution?: string;
    duration?: number; // for videos
  };
  uploadedBy: string;
  uploadedAt: Date;
  securityLevel: 'restricted' | 'confidential';
  checksum?: string;
}

export interface WitnessStatement {
  id: string;
  incidentId: string;
  witnessName: string;
  witnessRole: 'student' | 'teacher' | 'staff' | 'other';
  statement: string;
  captureMethod: 'typed' | 'voice-to-text' | 'handwritten-scan';
  timestamp: Date;
  signature?: string;
  verified: boolean;
  verifiedBy?: string;
  verifiedAt?: Date;
}

export interface InsuranceClaim {
  id: string;
  incidentId: string;
  studentId: string;
  claimNumber: string;
  insuranceProvider: string;
  claimAmount: number;
  status: 'draft' | 'submitted' | 'approved' | 'denied';
  submittedAt?: Date;
  approvedAt?: Date;
  deniedAt?: Date;
  documents: string[];
  notes?: string;
}

export interface HIPAAComplianceCheck {
  id: string;
  area: string;
  status: 'compliant' | 'non-compliant' | 'needs-attention';
  findings: string[];
  recommendations: string[];
  checkedAt: Date;
  checkedBy: string;
  nextCheckDate?: Date;
}

export interface RegulationUpdate {
  id: string;
  state: string;
  category: string;
  title: string;
  description: string;
  effectiveDate: Date;
  impact: 'high' | 'medium' | 'low';
  actionRequired: string;
  status: 'pending-review' | 'implementing' | 'implemented';
  implementedAt?: Date;
  complianceOfficer: string;
}

export interface ConsentForm {
  id: string;
  studentId: string;
  formType: string;
  status: 'pending' | 'signed' | 'expired' | 'revoked';
  content: string;
  signedBy?: string;
  signedAt?: Date;
  expiresAt?: Date;
  createdAt?: Date;
  digitalSignature?: string;
  version?: string;
  metadata?: Record<string, string | number | boolean>;
  lastModifiedAt?: Date;
  lastModifiedBy?: string;
}

export interface MessageTemplate {
  id: string;
  name: string;
  category: string;
  subject: string;
  body: string;
  variables: string[];
  language: string;
  createdBy: string;
  createdAt: Date;
  updatedAt?: Date;
  isActive: boolean;
  usageCount: number;
}

export interface BulkMessage {
  id: string;
  subject: string;
  body: string;
  recipients: string[];
  channels: ('sms' | 'email' | 'push')[];
  status: 'pending' | 'sending' | 'completed' | 'failed';
  deliveryStats: {
    sent: number;
    delivered: number;
    failed: number;
    opened: number;
    clicked?: number;
  };
  sentAt?: Date;
  completedAt?: Date;
  errorMessage?: string;
  templateId?: string;
}

export interface ReportDefinition {
  id: string;
  name: string;
  dataSource: string;
  fields: string[];
  filters: Array<{
    field: string;
    operator: 'equals' | 'contains' | 'greater' | 'less' | 'between';
    value: string | number | Date;
  }>;
  grouping: string[];
  sorting: Array<{
    field: string;
    direction: 'asc' | 'desc';
  }>;
  visualization: 'table' | 'chart' | 'graph';
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    recipients: string[];
    nextRun?: Date;
  };
  createdBy: string;
  createdAt: Date;
  isActive: boolean;
}

export interface DashboardMetric {
  name: string;
  value: number;
  trend: 'up' | 'down' | 'stable';
  change: number;
  changePercent: number;
  unit: string;
  period: string;
  lastUpdated: Date;
}

// Service-specific interfaces
export interface WaitlistPriorityResult {
  high: WaitlistEntry[];
  routine: WaitlistEntry[];
  totalCount: number;
}

export interface ReminderPreferences {
  emailEnabled: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
  advanceNotice: '24h' | '1h' | '15m';
  quietHours?: {
    start: string; // HH:MM format
    end: string;   // HH:MM format
  };
}

export interface ConsentFormTemplate {
  type: string;
  title: string;
  content: string;
  variables: string[];
  expirationDays: number;
  requiresSignature: boolean;
  legalReviewRequired: boolean;
}

export interface TranslationResult {
  originalText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  confidence: number;
  translatedAt: Date;
}

export interface ReportExecutionResult {
  reportId: string;
  data: Record<string, unknown>[];
  metadata: {
    totalRecords: number;
    executionTime: number;
    generatedAt: Date;
    filters: Record<string, unknown>;
  };
}

export interface ComplianceAuditResult {
  period: {
    startDate: Date;
    endDate: Date;
  };
  overallStatus: 'compliant' | 'non-compliant' | 'needs-attention';
  checks: HIPAAComplianceCheck[];
  recommendations: string[];
  nextAuditDate: Date;
}

export interface HealthTrendData {
  period: string;
  metrics: Array<{
    name: string;
    value: number;
    previousValue: number;
    change: number;
    changePercent: number;
  }>;
  alerts: Array<{
    type: 'warning' | 'critical';
    message: string;
    metric: string;
  }>;
}