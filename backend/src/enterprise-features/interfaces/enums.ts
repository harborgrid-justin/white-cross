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