/**
 * Clinic Visit Tracking Types
 *
 * Types for tracking entry/exit times, visit reasons, class missed logs,
 * and visit frequency analytics. Critical for operational efficiency and attendance tracking.
 *
 * @module types/operations/clinicVisits
 * @category Operations
 */

import { z } from 'zod';
import type { BaseAuditEntity, ApiResponse, PaginatedResponse } from '../common';

// ============================================================================
// ENUMS AND CONSTANTS
// ============================================================================

export enum VisitReason {
  ILLNESS = 'ILLNESS',
  INJURY = 'INJURY',
  MEDICATION = 'MEDICATION',
  CHRONIC_CONDITION = 'CHRONIC_CONDITION',
  SCREENING = 'SCREENING',
  FIRST_AID = 'FIRST_AID',
  MENTAL_HEALTH = 'MENTAL_HEALTH',
  COUNSELING = 'COUNSELING',
  PHYSICAL_EXAM = 'PHYSICAL_EXAM',
  IMMUNIZATION = 'IMMUNIZATION',
  REFERRAL_FOLLOWUP = 'REFERRAL_FOLLOWUP',
  PARENT_REQUEST = 'PARENT_REQUEST',
  TEACHER_REFERRAL = 'TEACHER_REFERRAL',
  SELF_REFERRAL = 'SELF_REFERRAL',
  OTHER = 'OTHER',
}

export enum VisitOutcome {
  RETURNED_TO_CLASS = 'RETURNED_TO_CLASS',
  SENT_HOME = 'SENT_HOME',
  PARENT_PICKUP = 'PARENT_PICKUP',
  EMERGENCY_SERVICES = 'EMERGENCY_SERVICES',
  REFERRED_TO_PROVIDER = 'REFERRED_TO_PROVIDER',
  REST_IN_CLINIC = 'REST_IN_CLINIC',
  MEDICATION_ADMINISTERED = 'MEDICATION_ADMINISTERED',
  OBSERVATION_ONLY = 'OBSERVATION_ONLY',
  CANCELLED = 'CANCELLED',
}

export enum DispositionType {
  NO_TREATMENT = 'NO_TREATMENT',
  FIRST_AID = 'FIRST_AID',
  MEDICATION_GIVEN = 'MEDICATION_GIVEN',
  REST_PROVIDED = 'REST_PROVIDED',
  COUNSELING_PROVIDED = 'COUNSELING_PROVIDED',
  REFERRED_OUT = 'REFERRED_OUT',
  EMERGENCY_RESPONSE = 'EMERGENCY_RESPONSE',
}

export enum VisitStatus {
  CHECKED_IN = 'CHECKED_IN',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

// ============================================================================
// DOMAIN MODEL INTERFACES
// ============================================================================

/**
 * Clinic Visit
 *
 * Complete clinic visit record with entry/exit tracking.
 *
 * @property {string} studentId - Student who visited
 * @property {VisitReason} reason - Reason for visit
 * @property {VisitStatus} status - Current visit status
 * @property {string} entryTime - ISO timestamp of clinic entry
 * @property {string} [exitTime] - ISO timestamp of clinic exit
 * @property {number} [durationMinutes] - Visit duration in minutes
 * @property {string} [chiefComplaint] - Chief complaint/presenting issue
 * @property {string[]} symptoms - List of symptoms
 * @property {string} [vitalSigns] - Vital signs taken (JSON or reference)
 * @property {string} [temperature] - Temperature reading
 * @property {string} [bloodPressure] - Blood pressure reading
 * @property {string} [assessment] - Nurse assessment
 * @property {DispositionType[]} dispositions - Actions taken
 * @property {VisitOutcome} [outcome] - Visit outcome
 * @property {string} [treatment] - Treatment provided
 * @property {string} [medicationsGiven] - Medications administered
 * @property {boolean} classTimeMissed - Whether class time was missed
 * @property {number} [minutesMissed] - Minutes of class missed
 * @property {string} [classSubject] - Class/subject missed
 * @property {string} [teacherNotified] - Teacher notified (Y/N or name)
 * @property {boolean} parentNotified - Whether parent was notified
 * @property {string} [parentNotificationTime] - Time parent was notified
 * @property {string} [notificationMethod] - How parent was notified
 * @property {boolean} followUpRequired - Whether follow-up needed
 * @property {string} [followUpDate] - Date for follow-up
 * @property {string} [followUpNotes] - Follow-up instructions
 * @property {string} [referralTo] - External referral if any
 * @property {string} attendedBy - Nurse/staff who attended
 * @property {string} [notes] - Additional notes
 * @property {Record<string, any>} [metadata] - Additional structured data
 *
 * @phi Contains Protected Health Information
 */
export interface ClinicVisit extends BaseAuditEntity {
  studentId: string;
  reason: VisitReason;
  status: VisitStatus;
  entryTime: string;
  exitTime?: string | null;
  durationMinutes?: number | null;
  chiefComplaint?: string | null;
  symptoms: string[];
  vitalSigns?: string | null;
  temperature?: string | null;
  bloodPressure?: string | null;
  assessment?: string | null;
  dispositions: DispositionType[];
  outcome?: VisitOutcome | null;
  treatment?: string | null;
  medicationsGiven?: string | null;
  classTimeMissed: boolean;
  minutesMissed?: number | null;
  classSubject?: string | null;
  teacherNotified?: string | null;
  parentNotified: boolean;
  parentNotificationTime?: string | null;
  notificationMethod?: string | null;
  followUpRequired: boolean;
  followUpDate?: string | null;
  followUpNotes?: string | null;
  referralTo?: string | null;
  attendedBy: string;
  notes?: string | null;
  metadata?: Record<string, any> | null;

  // Populated associations
  student?: {
    id: string;
    firstName: string;
    lastName: string;
    studentNumber: string;
    grade: string;
  };
  nurse?: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

/**
 * Class Missed Log
 *
 * Detailed log of class time missed due to clinic visits.
 */
export interface ClassMissedLog {
  id: string;
  clinicVisitId: string;
  studentId: string;
  classSubject: string;
  teacherName: string;
  periodNumber?: number | null;
  startTime: string;
  endTime: string;
  minutesMissed: number;
  excused: boolean;
  makeupWork: boolean;
  makeupWorkAssigned?: string | null;
  teacherNotified: boolean;
  notificationSentAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Visit Frequency Analytics
 *
 * Student visit frequency and pattern analysis.
 */
export interface VisitFrequencyAnalytics {
  studentId: string;
  studentName: string;
  grade: string;
  totalVisits: number;
  visitsThisMonth: number;
  visitsThisWeek: number;
  averageVisitsPerMonth: number;
  mostCommonReason: VisitReason;
  totalClassTimeMissed: number;
  visitsByReason: Record<VisitReason, number>;
  visitsByOutcome: Record<VisitOutcome, number>;
  visitTrend: 'INCREASING' | 'DECREASING' | 'STABLE';
  flaggedForReview: boolean;
  lastVisitDate: string;
}

/**
 * Daily Visit Summary
 *
 * Summary of all clinic visits for a specific day.
 */
export interface DailyVisitSummary {
  date: string;
  totalVisits: number;
  uniqueStudents: number;
  averageVisitDuration: number;
  visitsByReason: Record<VisitReason, number>;
  visitsByOutcome: Record<VisitOutcome, number>;
  peakHours: Array<{ hour: number; visitCount: number }>;
  totalClassTimeMissed: number;
  parentContactsMade: number;
  emergencyResponses: number;
}

/**
 * Attendance History Entry
 *
 * Historical clinic attendance record for a student.
 */
export interface AttendanceHistory {
  studentId: string;
  visitHistory: Array<{
    visitId: string;
    visitDate: string;
    reason: VisitReason;
    duration: number;
    outcome: VisitOutcome;
  }>;
  totalVisitsAllTime: number;
  totalVisitsThisYear: number;
  totalClassTimeMissedMinutes: number;
  firstVisitDate: string;
  lastVisitDate: string;
  chronicVisitor: boolean;
}

// ============================================================================
// API REQUEST/RESPONSE TYPES
// ============================================================================

export interface CreateClinicVisitRequest {
  studentId: string;
  reason: VisitReason;
  entryTime: string;
  chiefComplaint?: string;
  symptoms?: string[];
  attendedBy: string;
}

export interface CheckInStudentRequest {
  studentId: string;
  reason: VisitReason;
  chiefComplaint?: string;
  referredBy?: string;
}

export interface CheckOutStudentRequest {
  visitId: string;
  exitTime: string;
  outcome: VisitOutcome;
  treatment?: string;
  notes?: string;
}

export interface UpdateClinicVisitRequest {
  vitalSigns?: string;
  temperature?: string;
  bloodPressure?: string;
  assessment?: string;
  dispositions?: DispositionType[];
  outcome?: VisitOutcome;
  treatment?: string;
  medicationsGiven?: string;
  classTimeMissed?: boolean;
  minutesMissed?: number;
  classSubject?: string;
  parentNotified?: boolean;
  followUpRequired?: boolean;
  followUpDate?: string;
  followUpNotes?: string;
  notes?: string;
}

export interface ClinicVisitFilters {
  studentId?: string;
  reason?: VisitReason;
  status?: VisitStatus;
  outcome?: VisitOutcome;
  startDate?: string;
  endDate?: string;
  attendedBy?: string;
  followUpRequired?: boolean;
  page?: number;
  limit?: number;
}

export type ClinicVisitsResponse = PaginatedResponse<ClinicVisit>;
export type ClinicVisitResponse = ApiResponse<ClinicVisit>;
export type VisitFrequencyResponse = ApiResponse<VisitFrequencyAnalytics[]>;
export type DailyVisitSummaryResponse = ApiResponse<DailyVisitSummary>;
export type AttendanceHistoryResponse = ApiResponse<AttendanceHistory>;

// ============================================================================
// FORM VALIDATION SCHEMAS (ZOD)
// ============================================================================

export const CreateClinicVisitSchema = z.object({
  studentId: z.string().uuid(),
  reason: z.nativeEnum(VisitReason),
  entryTime: z.string().datetime(),
  chiefComplaint: z.string().max(500).optional(),
  symptoms: z.array(z.string()).optional(),
  attendedBy: z.string().uuid(),
});

export const CheckInStudentSchema = z.object({
  studentId: z.string().uuid(),
  reason: z.nativeEnum(VisitReason),
  chiefComplaint: z.string().max(500).optional(),
  referredBy: z.string().optional(),
});

export const CheckOutStudentSchema = z.object({
  visitId: z.string().uuid(),
  exitTime: z.string().datetime(),
  outcome: z.nativeEnum(VisitOutcome),
  treatment: z.string().max(1000).optional(),
  notes: z.string().max(2000).optional(),
});

export const UpdateClinicVisitSchema = z.object({
  vitalSigns: z.string().optional(),
  temperature: z.string().optional(),
  bloodPressure: z.string().optional(),
  assessment: z.string().max(2000).optional(),
  dispositions: z.array(z.nativeEnum(DispositionType)).optional(),
  outcome: z.nativeEnum(VisitOutcome).optional(),
  treatment: z.string().max(1000).optional(),
  medicationsGiven: z.string().max(500).optional(),
  classTimeMissed: z.boolean().optional(),
  minutesMissed: z.number().int().min(0).max(480).optional(),
  classSubject: z.string().max(100).optional(),
  parentNotified: z.boolean().optional(),
  followUpRequired: z.boolean().optional(),
  followUpDate: z.string().datetime().optional(),
  followUpNotes: z.string().max(500).optional(),
  notes: z.string().max(2000).optional(),
});

// ============================================================================
// REDUX STATE TYPES
// ============================================================================

export interface ClinicVisitsState {
  visits: ClinicVisit[];
  activeVisits: ClinicVisit[];
  selectedVisit: ClinicVisit | null;
  dailySummary: DailyVisitSummary | null;
  frequencyAnalytics: VisitFrequencyAnalytics[];
  loading: boolean;
  error: string | null;
  filters: ClinicVisitFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  } | null;
}

// ============================================================================
// COMPONENT PROP TYPES
// ============================================================================

export interface CheckInFormProps {
  onCheckIn: (data: CheckInStudentRequest) => void;
  students: Array<{ id: string; name: string }>;
  isSubmitting?: boolean;
}

export interface VisitDetailsProps {
  visit: ClinicVisit;
  onUpdate?: (data: UpdateClinicVisitRequest) => void;
  onCheckOut?: (data: CheckOutStudentRequest) => void;
  editable?: boolean;
}

export interface ActiveVisitsListProps {
  visits: ClinicVisit[];
  onSelectVisit?: (visit: ClinicVisit) => void;
  onCheckOut?: (visitId: string) => void;
}

export interface VisitHistoryProps {
  studentId: string;
  onViewVisit?: (visit: ClinicVisit) => void;
  compact?: boolean;
}

export interface DailySummaryDashboardProps {
  summary: DailyVisitSummary;
  date: string;
  onViewAllVisits?: () => void;
}

// ============================================================================
// TYPE GUARDS
// ============================================================================

export function isActiveVisit(visit: ClinicVisit): boolean {
  return visit.status === VisitStatus.CHECKED_IN || visit.status === VisitStatus.IN_PROGRESS;
}

export function isCompletedVisit(visit: ClinicVisit): boolean {
  return visit.status === VisitStatus.COMPLETED;
}

export function requiresParentNotification(visit: ClinicVisit): boolean {
  const notifyOutcomes = [
    VisitOutcome.SENT_HOME,
    VisitOutcome.PARENT_PICKUP,
    VisitOutcome.EMERGENCY_SERVICES,
    VisitOutcome.REFERRED_TO_PROVIDER,
  ];
  return visit.outcome ? notifyOutcomes.includes(visit.outcome) : false;
}

export function isChronicVisitor(analytics: VisitFrequencyAnalytics): boolean {
  return analytics.flaggedForReview || analytics.averageVisitsPerMonth > 4;
}
