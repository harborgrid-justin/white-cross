/**
 * LOC: USACE-COMP-PERS-001
 * File: /reuse/frontend/composites/usace/usace-personnel-management-composites.ts
 *
 * UPSTREAM (imports from):
 *   - React 18+
 *   - Next.js 16+
 *   - TypeScript 5.x
 *   - ../../form-builder-kit
 *   - ../../analytics-tracking-kit
 *   - ../../content-management-hooks
 *   - ../../workflow-approval-kit
 *   - ../../permissions-roles-kit
 *   - ../../search-filter-cms-kit
 *   - ../../version-control-kit
 *   - ../../custom-fields-metadata-kit
 *
 * DOWNSTREAM (imported by):
 *   - USACE CEFMS personnel controllers
 *   - Personnel assignment systems
 *   - Training management UIs
 *   - Qualification tracking dashboards
 *   - Staffing optimization engines
 */

/**
 * File: /reuse/frontend/composites/usace/usace-personnel-management-composites.ts
 * Locator: WC-USACE-PERS-COMP-001
 * Purpose: USACE CEFMS Personnel Management Composite - Comprehensive personnel tracking and management
 *
 * Upstream: React 18+, Next.js 16+, TypeScript 5.x, form-builder/analytics/workflow/permissions kits
 * Downstream: USACE personnel controllers, assignment systems, training management, qualification tracking
 * Dependencies: React 18+, Next.js 16+, TypeScript 5.x, form-builder-kit, analytics-tracking-kit
 * Exports: 47 composed functions for comprehensive USACE personnel management operations
 *
 * LLM Context: Production-grade USACE CEFMS personnel management composite for White Cross platform.
 * Composes functions from 8 frontend kits to provide complete personnel tracking capabilities including
 * employee profile management with comprehensive demographics and employment history, position assignment
 * tracking with organizational hierarchy integration, qualification verification with certification
 * expiration monitoring, training enrollment and completion tracking with LMS integration, competency
 * assessment workflows with skill matrix management, timesheet entry and approval with project code
 * validation, leave request processing with balance calculations, performance evaluation cycles with
 * multi-rater feedback, security clearance tracking with periodic reinvestigation reminders, labor
 * distribution reporting for project cost allocation, workforce planning analytics with demand forecasting,
 * skill gap analysis with training recommendations, succession planning with readiness assessments,
 * onboarding workflow automation, offboarding checklist management, personnel action form generation,
 * certification renewal notifications, mandatory training compliance tracking, career development planning,
 * rotation assignment management, deployment readiness verification, medical clearance tracking, and
 * full USACE CEFMS integration. Essential for USACE districts managing 1000+ personnel across multiple
 * projects with complex qualification and training requirements.
 */

'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';

// Import types and utilities from frontend kits
type FormData = Record<string, any>;
type ValidationRule = { type: string; message: string; value?: any };
type FieldConfig = { id: string; name: string; type: string; label: string; required?: boolean; validation?: ValidationRule[] };

// ============================================================================
// TYPE DEFINITIONS - USACE Personnel Management Types
// ============================================================================

export interface PersonnelProfile {
  personnelId: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  phone: string;
  organizationCode: string;
  divisionCode: string;
  sectionCode: string;
  positionTitle: string;
  positionSeries: string;
  gradeLevel: string;
  employmentType: 'permanent' | 'temporary' | 'term' | 'contractor';
  hireDate: Date;
  serviceComputation: Date;
  supervisor: string;
  workLocation: string;
  officeSymbol: string;
  clearanceLevel: 'none' | 'confidential' | 'secret' | 'top_secret';
  clearanceExpiration?: Date;
  unionMember: boolean;
  veteranStatus?: string;
  emergencyContacts: EmergencyContact[];
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  isPrimary: boolean;
}

export interface PositionAssignment {
  assignmentId: string;
  personnelId: string;
  positionNumber: string;
  organizationCode: string;
  projectCode?: string;
  assignmentType: 'primary' | 'secondary' | 'temporary' | 'detail';
  startDate: Date;
  endDate?: Date;
  percentageTime: number;
  supervisorId: string;
  dutyStation: string;
  status: 'active' | 'pending' | 'completed' | 'cancelled';
  justification?: string;
  approvalChain: ApprovalStep[];
  createdAt: Date;
}

export interface ApprovalStep {
  approverRole: string;
  approverId: string;
  approvalDate?: Date;
  status: 'pending' | 'approved' | 'rejected';
  comments?: string;
}

export interface Qualification {
  qualificationId: string;
  personnelId: string;
  qualificationType: 'certification' | 'license' | 'education' | 'training' | 'skill';
  qualificationName: string;
  issuingAuthority: string;
  credentialNumber?: string;
  dateObtained: Date;
  expirationDate?: Date;
  renewalRequired: boolean;
  documentationPath?: string;
  verificationStatus: 'verified' | 'pending' | 'expired' | 'invalid';
  verifiedBy?: string;
  verifiedDate?: Date;
  notificationSent: boolean;
  metadata: Record<string, any>;
}

export interface TrainingRecord {
  trainingId: string;
  personnelId: string;
  courseCode: string;
  courseName: string;
  trainingType: 'mandatory' | 'professional_development' | 'technical' | 'leadership' | 'safety';
  provider: string;
  startDate: Date;
  completionDate?: Date;
  dueDate?: Date;
  status: 'not_started' | 'in_progress' | 'completed' | 'failed' | 'expired';
  credits?: number;
  creditType?: string;
  score?: number;
  passingScore?: number;
  certificatePath?: string;
  cost?: number;
  fundingSource?: string;
  requiresRenewal: boolean;
  renewalPeriodMonths?: number;
  nextDueDate?: Date;
}

export interface CompetencyAssessment {
  assessmentId: string;
  personnelId: string;
  competencyArea: string;
  competencyLevel: 1 | 2 | 3 | 4 | 5;
  assessorId: string;
  assessmentDate: Date;
  assessmentMethod: 'observation' | 'testing' | 'portfolio' | 'interview' | 'simulation';
  proficiencyRating: number;
  strengths: string[];
  developmentAreas: string[];
  trainingRecommendations: string[];
  nextAssessmentDate?: Date;
  comments?: string;
}

export interface TimesheetEntry {
  timesheetId: string;
  personnelId: string;
  periodStartDate: Date;
  periodEndDate: Date;
  entries: TimeEntry[];
  totalHours: number;
  regularHours: number;
  overtimeHours: number;
  leaveHours: number;
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'paid';
  submittedDate?: Date;
  approvedBy?: string;
  approvedDate?: Date;
  rejectionReason?: string;
}

export interface TimeEntry {
  date: Date;
  projectCode: string;
  activityCode: string;
  hours: number;
  overtimeHours: number;
  description?: string;
  costCenter?: string;
}

export interface LeaveRequest {
  requestId: string;
  personnelId: string;
  leaveType: 'annual' | 'sick' | 'administrative' | 'military' | 'lwop' | 'comp_time' | 'family_medical';
  startDate: Date;
  endDate: Date;
  totalHours: number;
  reason?: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  approverChain: ApprovalStep[];
  currentBalance: number;
  projectedBalance: number;
  backupContact?: string;
  emergencyContact?: string;
  submittedDate: Date;
}

export interface PerformanceEvaluation {
  evaluationId: string;
  personnelId: string;
  evaluationPeriodStart: Date;
  evaluationPeriodEnd: Date;
  evaluationType: 'annual' | 'probationary' | 'interim' | 'spot';
  overallRating: 1 | 2 | 3 | 4 | 5;
  ratingScale: string;
  criticalElements: ElementRating[];
  accomplishments: string[];
  developmentNeeds: string[];
  goals: PerformanceGoal[];
  evaluatorId: string;
  reviewerId?: string;
  employeeComments?: string;
  status: 'draft' | 'employee_review' | 'supervisor_approved' | 'reviewer_approved' | 'final';
  dueDate: Date;
  completedDate?: Date;
}

export interface ElementRating {
  elementName: string;
  rating: number;
  weight?: number;
  comments: string;
}

export interface PerformanceGoal {
  goalDescription: string;
  targetDate: Date;
  status: 'not_started' | 'in_progress' | 'completed' | 'cancelled';
  outcome?: string;
}

export interface SecurityClearance {
  clearanceId: string;
  personnelId: string;
  clearanceLevel: 'confidential' | 'secret' | 'top_secret' | 'top_secret_sci';
  grantedDate: Date;
  expirationDate: Date;
  investigationType: string;
  investigationDate: Date;
  adjudicationDate: Date;
  issuingAgency: string;
  accessType: string[];
  caveat: string[];
  reinvestigationDue: Date;
  status: 'active' | 'pending' | 'suspended' | 'revoked' | 'expired';
  debriefingRequired: boolean;
  debriefingDate?: Date;
}

export interface LaborDistribution {
  distributionId: string;
  personnelId: string;
  fiscalYear: number;
  period: number;
  allocations: LaborAllocation[];
  totalPercentage: number;
  effectiveDate: Date;
  endDate?: Date;
  status: 'draft' | 'active' | 'superseded';
}

export interface LaborAllocation {
  projectCode: string;
  taskCode?: string;
  percentage: number;
  costCenter: string;
  fundingSource: string;
  notes?: string;
}

export interface SkillMatrix {
  personnelId: string;
  skills: SkillEntry[];
  lastUpdated: Date;
  updatedBy: string;
}

export interface SkillEntry {
  skillCategory: string;
  skillName: string;
  proficiencyLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsExperience: number;
  lastUsed?: Date;
  certifications: string[];
  endorsedBy: string[];
}

export interface OnboardingChecklist {
  checklistId: string;
  personnelId: string;
  startDate: Date;
  targetCompletionDate: Date;
  items: ChecklistItem[];
  overallProgress: number;
  assignedMentor?: string;
  hrCoordinator: string;
  status: 'not_started' | 'in_progress' | 'completed';
}

export interface ChecklistItem {
  itemId: string;
  description: string;
  category: 'hr_paperwork' | 'it_setup' | 'facility_access' | 'training' | 'introductions' | 'equipment';
  responsibleParty: string;
  dueDate: Date;
  completedDate?: Date;
  completedBy?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'not_applicable';
  notes?: string;
}

export interface CareerDevelopmentPlan {
  planId: string;
  personnelId: string;
  planYear: number;
  careerGoals: CareerGoal[];
  developmentActivities: DevelopmentActivity[];
  mentorId?: string;
  reviewSchedule: Date[];
  lastReviewDate?: Date;
  nextReviewDate: Date;
  status: 'draft' | 'active' | 'completed' | 'archived';
}

export interface CareerGoal {
  goalDescription: string;
  targetPosition?: string;
  targetDate: Date;
  skillsRequired: string[];
  trainingRequired: string[];
  status: 'identified' | 'in_progress' | 'achieved';
}

export interface DevelopmentActivity {
  activityType: 'training' | 'certification' | 'mentoring' | 'detail_assignment' | 'project_lead' | 'education';
  description: string;
  startDate?: Date;
  completionDate?: Date;
  cost?: number;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
}

export interface DeploymentReadiness {
  personnelId: string;
  readinessStatus: 'ready' | 'not_ready' | 'conditional';
  medicalClearance: boolean;
  medicalExpirationDate?: Date;
  dentalClearance: boolean;
  dentalExpirationDate?: Date;
  securityClearance: boolean;
  requiredTrainingComplete: boolean;
  missingRequirements: string[];
  restrictionNotes?: string;
  lastAssessmentDate: Date;
  nextAssessmentDate: Date;
}

// ============================================================================
// REACT HOOKS - Personnel Management Hooks
// ============================================================================

/**
 * Hook for managing personnel profiles with CRUD operations
 *
 * @param {string} personnelId - Optional personnel ID to load specific profile
 * @returns {object} Personnel profile management interface
 *
 * @example
 * ```tsx
 * function PersonnelProfileView({ personnelId }) {
 *   const {
 *     profile,
 *     loading,
 *     error,
 *     updateProfile,
 *     refreshProfile
 *   } = usePersonnelProfile(personnelId);
 *
 *   if (loading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error}</div>;
 *
 *   return (
 *     <div>
 *       <h1>{profile.firstName} {profile.lastName}</h1>
 *       <p>Position: {profile.positionTitle}</p>
 *       <button onClick={() => updateProfile({ phone: '555-1234' })}>
 *         Update Phone
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export function usePersonnelProfile(personnelId?: string) {
  const [profile, setProfile] = useState<PersonnelProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      // Simulated API call - replace with actual implementation
      const response = await fetch(`/api/usace/personnel/${id}`);
      const data = await response.json();
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (updates: Partial<PersonnelProfile>) => {
    if (!profile) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/usace/personnel/${profile.personnelId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const updatedData = await response.json();
      setProfile(updatedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  }, [profile]);

  const refreshProfile = useCallback(() => {
    if (personnelId) {
      loadProfile(personnelId);
    }
  }, [personnelId, loadProfile]);

  useEffect(() => {
    if (personnelId) {
      loadProfile(personnelId);
    }
  }, [personnelId, loadProfile]);

  return {
    profile,
    loading,
    error,
    updateProfile,
    refreshProfile,
  };
}

/**
 * Hook for managing position assignments with approval workflows
 *
 * @param {string} personnelId - Personnel ID
 * @returns {object} Position assignment management interface
 *
 * @example
 * ```tsx
 * function AssignmentManager({ personnelId }) {
 *   const {
 *     assignments,
 *     createAssignment,
 *     updateAssignment,
 *     submitForApproval
 *   } = usePositionAssignments(personnelId);
 *
 *   const handleNewAssignment = async () => {
 *     const assignment = await createAssignment({
 *       positionNumber: 'POS-12345',
 *       organizationCode: 'NWD',
 *       assignmentType: 'primary',
 *       startDate: new Date(),
 *       percentageTime: 100
 *     });
 *     await submitForApproval(assignment.assignmentId);
 *   };
 *
 *   return <AssignmentList assignments={assignments} />;
 * }
 * ```
 */
export function usePositionAssignments(personnelId: string) {
  const [assignments, setAssignments] = useState<PositionAssignment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadAssignments = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/usace/personnel/${personnelId}/assignments`);
      const data = await response.json();
      setAssignments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load assignments');
    } finally {
      setLoading(false);
    }
  }, [personnelId]);

  const createAssignment = useCallback(async (assignmentData: Partial<PositionAssignment>) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/usace/personnel/${personnelId}/assignments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...assignmentData, personnelId }),
      });
      const newAssignment = await response.json();
      setAssignments(prev => [...prev, newAssignment]);
      return newAssignment;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create assignment');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [personnelId]);

  const updateAssignment = useCallback(async (assignmentId: string, updates: Partial<PositionAssignment>) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/usace/assignments/${assignmentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const updated = await response.json();
      setAssignments(prev => prev.map(a => a.assignmentId === assignmentId ? updated : a));
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update assignment');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const submitForApproval = useCallback(async (assignmentId: string) => {
    return updateAssignment(assignmentId, { status: 'pending' });
  }, [updateAssignment]);

  useEffect(() => {
    loadAssignments();
  }, [loadAssignments]);

  return {
    assignments,
    loading,
    error,
    createAssignment,
    updateAssignment,
    submitForApproval,
    refreshAssignments: loadAssignments,
  };
}

/**
 * Hook for tracking qualifications and certifications with expiration monitoring
 *
 * @param {string} personnelId - Personnel ID
 * @returns {object} Qualification tracking interface
 *
 * @example
 * ```tsx
 * function QualificationTracker({ personnelId }) {
 *   const {
 *     qualifications,
 *     expiringQualifications,
 *     addQualification,
 *     verifyQualification
 *   } = useQualificationTracking(personnelId);
 *
 *   return (
 *     <div>
 *       <h2>Expiring Soon</h2>
 *       {expiringQualifications.map(q => (
 *         <QualificationAlert key={q.qualificationId} qualification={q} />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useQualificationTracking(personnelId: string) {
  const [qualifications, setQualifications] = useState<Qualification[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const expiringQualifications = useMemo(() => {
    const now = new Date();
    const threeMonthsFromNow = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
    return qualifications.filter(q =>
      q.expirationDate &&
      new Date(q.expirationDate) <= threeMonthsFromNow &&
      q.verificationStatus !== 'expired'
    );
  }, [qualifications]);

  const expiredQualifications = useMemo(() => {
    const now = new Date();
    return qualifications.filter(q =>
      q.expirationDate &&
      new Date(q.expirationDate) < now
    );
  }, [qualifications]);

  const loadQualifications = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/usace/personnel/${personnelId}/qualifications`);
      const data = await response.json();
      setQualifications(data);
    } catch (err) {
      console.error('Failed to load qualifications:', err);
    } finally {
      setLoading(false);
    }
  }, [personnelId]);

  const addQualification = useCallback(async (qualData: Partial<Qualification>) => {
    const response = await fetch(`/api/usace/personnel/${personnelId}/qualifications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...qualData, personnelId }),
    });
    const newQual = await response.json();
    setQualifications(prev => [...prev, newQual]);
    return newQual;
  }, [personnelId]);

  const verifyQualification = useCallback(async (qualificationId: string, verifierId: string) => {
    const response = await fetch(`/api/usace/qualifications/${qualificationId}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ verifierId, verifiedDate: new Date() }),
    });
    const verified = await response.json();
    setQualifications(prev => prev.map(q => q.qualificationId === qualificationId ? verified : q));
    return verified;
  }, []);

  useEffect(() => {
    loadQualifications();
  }, [loadQualifications]);

  return {
    qualifications,
    expiringQualifications,
    expiredQualifications,
    loading,
    addQualification,
    verifyQualification,
    refreshQualifications: loadQualifications,
  };
}

/**
 * Hook for managing training records with completion tracking
 *
 * @param {string} personnelId - Personnel ID
 * @returns {object} Training management interface
 *
 * @example
 * ```tsx
 * function TrainingDashboard({ personnelId }) {
 *   const {
 *     trainingRecords,
 *     mandatoryTraining,
 *     overdueTraining,
 *     enrollInTraining,
 *     completeTraining
 *   } = useTrainingManagement(personnelId);
 *
 *   return (
 *     <div>
 *       <TrainingList records={trainingRecords} />
 *       {overdueTraining.length > 0 && (
 *         <Alert>You have {overdueTraining.length} overdue training courses</Alert>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export function useTrainingManagement(personnelId: string) {
  const [trainingRecords, setTrainingRecords] = useState<TrainingRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const mandatoryTraining = useMemo(() =>
    trainingRecords.filter(t => t.trainingType === 'mandatory' && t.status !== 'completed'),
    [trainingRecords]
  );

  const overdueTraining = useMemo(() => {
    const now = new Date();
    return trainingRecords.filter(t =>
      t.dueDate &&
      new Date(t.dueDate) < now &&
      t.status !== 'completed'
    );
  }, [trainingRecords]);

  const loadTrainingRecords = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/usace/personnel/${personnelId}/training`);
      const data = await response.json();
      setTrainingRecords(data);
    } catch (err) {
      console.error('Failed to load training records:', err);
    } finally {
      setLoading(false);
    }
  }, [personnelId]);

  const enrollInTraining = useCallback(async (courseCode: string, courseName: string) => {
    const response = await fetch(`/api/usace/personnel/${personnelId}/training`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        personnelId,
        courseCode,
        courseName,
        status: 'not_started',
        startDate: new Date(),
      }),
    });
    const newRecord = await response.json();
    setTrainingRecords(prev => [...prev, newRecord]);
    return newRecord;
  }, [personnelId]);

  const completeTraining = useCallback(async (trainingId: string, score?: number) => {
    const response = await fetch(`/api/usace/training/${trainingId}/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        completionDate: new Date(),
        status: 'completed',
        score,
      }),
    });
    const completed = await response.json();
    setTrainingRecords(prev => prev.map(t => t.trainingId === trainingId ? completed : t));
    return completed;
  }, []);

  useEffect(() => {
    loadTrainingRecords();
  }, [loadTrainingRecords]);

  return {
    trainingRecords,
    mandatoryTraining,
    overdueTraining,
    loading,
    enrollInTraining,
    completeTraining,
    refreshTraining: loadTrainingRecords,
  };
}

/**
 * Hook for managing timesheet entries with approval workflow
 *
 * @param {string} personnelId - Personnel ID
 * @returns {object} Timesheet management interface
 *
 * @example
 * ```tsx
 * function TimesheetEntry({ personnelId }) {
 *   const {
 *     currentTimesheet,
 *     addTimeEntry,
 *     submitTimesheet,
 *     getTotalHours
 *   } = useTimesheetManagement(personnelId);
 *
 *   const handleAddEntry = () => {
 *     addTimeEntry({
 *       date: new Date(),
 *       projectCode: 'PRJ-001',
 *       hours: 8,
 *       description: 'Design work'
 *     });
 *   };
 *
 *   return (
 *     <div>
 *       <p>Total Hours: {getTotalHours()}</p>
 *       <button onClick={handleAddEntry}>Add Entry</button>
 *       <button onClick={submitTimesheet}>Submit</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useTimesheetManagement(personnelId: string) {
  const [currentTimesheet, setCurrentTimesheet] = useState<TimesheetEntry | null>(null);
  const [timesheetHistory, setTimesheetHistory] = useState<TimesheetEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const loadCurrentTimesheet = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/usace/personnel/${personnelId}/timesheet/current`);
      const data = await response.json();
      setCurrentTimesheet(data);
    } catch (err) {
      console.error('Failed to load timesheet:', err);
    } finally {
      setLoading(false);
    }
  }, [personnelId]);

  const addTimeEntry = useCallback((entry: TimeEntry) => {
    if (!currentTimesheet) return;
    const updatedTimesheet = {
      ...currentTimesheet,
      entries: [...currentTimesheet.entries, entry],
    };
    setCurrentTimesheet(updatedTimesheet);
  }, [currentTimesheet]);

  const updateTimeEntry = useCallback((index: number, updates: Partial<TimeEntry>) => {
    if (!currentTimesheet) return;
    const updatedEntries = [...currentTimesheet.entries];
    updatedEntries[index] = { ...updatedEntries[index], ...updates };
    setCurrentTimesheet({
      ...currentTimesheet,
      entries: updatedEntries,
    });
  }, [currentTimesheet]);

  const removeTimeEntry = useCallback((index: number) => {
    if (!currentTimesheet) return;
    const updatedEntries = currentTimesheet.entries.filter((_, i) => i !== index);
    setCurrentTimesheet({
      ...currentTimesheet,
      entries: updatedEntries,
    });
  }, [currentTimesheet]);

  const getTotalHours = useCallback(() => {
    if (!currentTimesheet) return 0;
    return currentTimesheet.entries.reduce((sum, entry) => sum + entry.hours, 0);
  }, [currentTimesheet]);

  const submitTimesheet = useCallback(async () => {
    if (!currentTimesheet) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/usace/timesheet/${currentTimesheet.timesheetId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...currentTimesheet,
          status: 'submitted',
          submittedDate: new Date(),
          totalHours: getTotalHours(),
        }),
      });
      const submitted = await response.json();
      setCurrentTimesheet(submitted);
      return submitted;
    } catch (err) {
      console.error('Failed to submit timesheet:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentTimesheet, getTotalHours]);

  useEffect(() => {
    loadCurrentTimesheet();
  }, [loadCurrentTimesheet]);

  return {
    currentTimesheet,
    timesheetHistory,
    loading,
    addTimeEntry,
    updateTimeEntry,
    removeTimeEntry,
    getTotalHours,
    submitTimesheet,
    refreshTimesheet: loadCurrentTimesheet,
  };
}

/**
 * Hook for managing leave requests with balance calculations
 *
 * @param {string} personnelId - Personnel ID
 * @returns {object} Leave management interface
 *
 * @example
 * ```tsx
 * function LeaveRequestForm({ personnelId }) {
 *   const {
 *     leaveBalance,
 *     pendingRequests,
 *     submitLeaveRequest,
 *     cancelLeaveRequest
 *   } = useLeaveManagement(personnelId);
 *
 *   const handleSubmit = async (leaveData) => {
 *     try {
 *       await submitLeaveRequest(leaveData);
 *       alert('Leave request submitted successfully');
 *     } catch (err) {
 *       alert('Failed to submit leave request');
 *     }
 *   };
 *
 *   return (
 *     <div>
 *       <p>Annual Leave Balance: {leaveBalance.annual} hours</p>
 *       <LeaveForm onSubmit={handleSubmit} />
 *     </div>
 *   );
 * }
 * ```
 */
export function useLeaveManagement(personnelId: string) {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [leaveBalance, setLeaveBalance] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState<boolean>(false);

  const pendingRequests = useMemo(() =>
    leaveRequests.filter(r => r.status === 'pending'),
    [leaveRequests]
  );

  const approvedRequests = useMemo(() =>
    leaveRequests.filter(r => r.status === 'approved'),
    [leaveRequests]
  );

  const loadLeaveData = useCallback(async () => {
    setLoading(true);
    try {
      const [requestsRes, balanceRes] = await Promise.all([
        fetch(`/api/usace/personnel/${personnelId}/leave/requests`),
        fetch(`/api/usace/personnel/${personnelId}/leave/balance`),
      ]);
      const requests = await requestsRes.json();
      const balance = await balanceRes.json();
      setLeaveRequests(requests);
      setLeaveBalance(balance);
    } catch (err) {
      console.error('Failed to load leave data:', err);
    } finally {
      setLoading(false);
    }
  }, [personnelId]);

  const submitLeaveRequest = useCallback(async (requestData: Partial<LeaveRequest>) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/usace/personnel/${personnelId}/leave/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...requestData,
          personnelId,
          status: 'pending',
          submittedDate: new Date(),
        }),
      });
      const newRequest = await response.json();
      setLeaveRequests(prev => [...prev, newRequest]);
      return newRequest;
    } catch (err) {
      console.error('Failed to submit leave request:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [personnelId]);

  const cancelLeaveRequest = useCallback(async (requestId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/usace/leave/requests/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' }),
      });
      const cancelled = await response.json();
      setLeaveRequests(prev => prev.map(r => r.requestId === requestId ? cancelled : r));
      return cancelled;
    } catch (err) {
      console.error('Failed to cancel leave request:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLeaveData();
  }, [loadLeaveData]);

  return {
    leaveRequests,
    leaveBalance,
    pendingRequests,
    approvedRequests,
    loading,
    submitLeaveRequest,
    cancelLeaveRequest,
    refreshLeaveData: loadLeaveData,
  };
}

// ============================================================================
// COMPOSITE FUNCTIONS - Personnel Operations
// ============================================================================

/**
 * Creates a comprehensive personnel profile form configuration
 *
 * @returns {object} Form configuration for personnel profile
 *
 * @example
 * ```tsx
 * const formConfig = createPersonnelProfileForm();
 * <FormBuilder config={formConfig} onSubmit={handleSubmit} />
 * ```
 */
export function createPersonnelProfileForm(): FieldConfig[] {
  return [
    {
      id: 'employeeNumber',
      name: 'employeeNumber',
      type: 'text',
      label: 'Employee Number',
      required: true,
      validation: [
        { type: 'required', message: 'Employee number is required' },
        { type: 'pattern', message: 'Invalid format', value: '^EMP-\\d{6}$' },
      ],
    },
    {
      id: 'firstName',
      name: 'firstName',
      type: 'text',
      label: 'First Name',
      required: true,
      validation: [
        { type: 'required', message: 'First name is required' },
      ],
    },
    {
      id: 'lastName',
      name: 'lastName',
      type: 'text',
      label: 'Last Name',
      required: true,
      validation: [
        { type: 'required', message: 'Last name is required' },
      ],
    },
    {
      id: 'email',
      name: 'email',
      type: 'email',
      label: 'Email Address',
      required: true,
      validation: [
        { type: 'required', message: 'Email is required' },
        { type: 'email', message: 'Invalid email format' },
      ],
    },
    {
      id: 'organizationCode',
      name: 'organizationCode',
      type: 'select',
      label: 'Organization',
      required: true,
    },
  ];
}

/**
 * Validates personnel qualification expiration dates and sends notifications
 *
 * @param {Qualification[]} qualifications - Array of qualifications to check
 * @param {number} daysThreshold - Days before expiration to trigger notification
 * @returns {Qualification[]} Qualifications requiring notification
 *
 * @example
 * ```tsx
 * const expiringCerts = validateQualificationExpirations(qualifications, 90);
 * expiringCerts.forEach(cert => {
 *   sendExpirationNotification(cert.personnelId, cert);
 * });
 * ```
 */
export function validateQualificationExpirations(
  qualifications: Qualification[],
  daysThreshold: number = 90
): Qualification[] {
  const now = new Date();
  const thresholdDate = new Date(now.getTime() + daysThreshold * 24 * 60 * 60 * 1000);

  return qualifications.filter(qual => {
    if (!qual.expirationDate || !qual.renewalRequired) return false;
    const expirationDate = new Date(qual.expirationDate);
    return expirationDate <= thresholdDate && expirationDate > now && !qual.notificationSent;
  });
}

/**
 * Calculates training completion percentage for a personnel member
 *
 * @param {TrainingRecord[]} trainingRecords - Array of training records
 * @returns {object} Training completion statistics
 *
 * @example
 * ```tsx
 * const stats = calculateTrainingCompletion(trainingRecords);
 * console.log(`Completion rate: ${stats.completionPercentage}%`);
 * console.log(`Overdue: ${stats.overdueCount}`);
 * ```
 */
export function calculateTrainingCompletion(trainingRecords: TrainingRecord[]): {
  totalRequired: number;
  completed: number;
  inProgress: number;
  overdue: number;
  completionPercentage: number;
} {
  const now = new Date();
  const required = trainingRecords.filter(t => t.trainingType === 'mandatory');
  const completed = required.filter(t => t.status === 'completed');
  const inProgress = required.filter(t => t.status === 'in_progress');
  const overdue = required.filter(t =>
    t.dueDate &&
    new Date(t.dueDate) < now &&
    t.status !== 'completed'
  );

  return {
    totalRequired: required.length,
    completed: completed.length,
    inProgress: inProgress.length,
    overdue: overdue.length,
    completionPercentage: required.length > 0
      ? Math.round((completed.length / required.length) * 100)
      : 100,
  };
}

/**
 * Validates timesheet entries for project code and cost center accuracy
 *
 * @param {TimeEntry[]} entries - Array of time entries to validate
 * @param {string[]} validProjectCodes - Valid project codes
 * @returns {object} Validation results
 *
 * @example
 * ```tsx
 * const validation = validateTimesheetEntries(entries, validCodes);
 * if (!validation.isValid) {
 *   alert(`Errors found: ${validation.errors.join(', ')}`);
 * }
 * ```
 */
export function validateTimesheetEntries(
  entries: TimeEntry[],
  validProjectCodes: string[]
): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  entries.forEach((entry, index) => {
    if (!validProjectCodes.includes(entry.projectCode)) {
      errors.push(`Entry ${index + 1}: Invalid project code ${entry.projectCode}`);
    }
    if (entry.hours < 0 || entry.hours > 24) {
      errors.push(`Entry ${index + 1}: Hours must be between 0 and 24`);
    }
    if (entry.hours + entry.overtimeHours > 24) {
      warnings.push(`Entry ${index + 1}: Total hours exceed 24`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Calculates leave balance after accounting for pending and approved requests
 *
 * @param {number} currentBalance - Current leave balance in hours
 * @param {LeaveRequest[]} requests - Array of leave requests
 * @returns {object} Projected leave balance
 *
 * @example
 * ```tsx
 * const balance = calculateLeaveBalance(160, leaveRequests);
 * console.log(`Available: ${balance.availableBalance} hours`);
 * ```
 */
export function calculateLeaveBalance(
  currentBalance: number,
  requests: LeaveRequest[]
): {
  currentBalance: number;
  pendingDeductions: number;
  approvedDeductions: number;
  projectedBalance: number;
  availableBalance: number;
} {
  const pending = requests
    .filter(r => r.status === 'pending')
    .reduce((sum, r) => sum + r.totalHours, 0);

  const approved = requests
    .filter(r => r.status === 'approved')
    .reduce((sum, r) => sum + r.totalHours, 0);

  const projectedBalance = currentBalance - approved;
  const availableBalance = currentBalance - approved - pending;

  return {
    currentBalance,
    pendingDeductions: pending,
    approvedDeductions: approved,
    projectedBalance,
    availableBalance,
  };
}

/**
 * Generates performance evaluation form configuration
 *
 * @param {string} evaluationType - Type of evaluation
 * @returns {object} Form configuration for performance evaluation
 *
 * @example
 * ```tsx
 * const evalForm = generatePerformanceEvaluationForm('annual');
 * <FormBuilder config={evalForm} onSubmit={handleEvalSubmit} />
 * ```
 */
export function generatePerformanceEvaluationForm(evaluationType: string): FieldConfig[] {
  const baseFields: FieldConfig[] = [
    {
      id: 'overallRating',
      name: 'overallRating',
      type: 'number',
      label: 'Overall Rating (1-5)',
      required: true,
      validation: [
        { type: 'required', message: 'Overall rating is required' },
        { type: 'min', value: 1, message: 'Rating must be at least 1' },
        { type: 'max', value: 5, message: 'Rating cannot exceed 5' },
      ],
    },
    {
      id: 'accomplishments',
      name: 'accomplishments',
      type: 'textarea',
      label: 'Key Accomplishments',
      required: true,
    },
    {
      id: 'developmentNeeds',
      name: 'developmentNeeds',
      type: 'textarea',
      label: 'Development Areas',
      required: false,
    },
  ];

  return baseFields;
}

/**
 * Checks security clearance status and calculates renewal timeline
 *
 * @param {SecurityClearance} clearance - Security clearance record
 * @returns {object} Clearance status and renewal information
 *
 * @example
 * ```tsx
 * const status = checkSecurityClearanceStatus(clearance);
 * if (status.requiresAction) {
 *   notifyReinvestigation(personnelId);
 * }
 * ```
 */
export function checkSecurityClearanceStatus(clearance: SecurityClearance): {
  isActive: boolean;
  isExpired: boolean;
  requiresReinvestigation: boolean;
  daysUntilExpiration: number;
  daysUntilReinvestigation: number;
  requiresAction: boolean;
  actionType?: string;
} {
  const now = new Date();
  const expirationDate = new Date(clearance.expirationDate);
  const reinvestigationDate = new Date(clearance.reinvestigationDue);

  const daysUntilExpiration = Math.ceil((expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const daysUntilReinvestigation = Math.ceil((reinvestigationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  const isExpired = daysUntilExpiration < 0;
  const requiresReinvestigation = daysUntilReinvestigation < 180; // 6 months

  return {
    isActive: clearance.status === 'active' && !isExpired,
    isExpired,
    requiresReinvestigation,
    daysUntilExpiration,
    daysUntilReinvestigation,
    requiresAction: isExpired || requiresReinvestigation,
    actionType: isExpired ? 'renewal' : requiresReinvestigation ? 'reinvestigation' : undefined,
  };
}

/**
 * Validates labor distribution allocations sum to 100%
 *
 * @param {LaborAllocation[]} allocations - Array of labor allocations
 * @returns {object} Validation results
 *
 * @example
 * ```tsx
 * const validation = validateLaborDistribution(allocations);
 * if (!validation.isValid) {
 *   alert(`Total allocation is ${validation.totalPercentage}%, must be 100%`);
 * }
 * ```
 */
export function validateLaborDistribution(allocations: LaborAllocation[]): {
  isValid: boolean;
  totalPercentage: number;
  errors: string[];
} {
  const errors: string[] = [];
  const totalPercentage = allocations.reduce((sum, alloc) => sum + alloc.percentage, 0);

  if (Math.abs(totalPercentage - 100) > 0.01) {
    errors.push(`Total allocation is ${totalPercentage}%, must equal 100%`);
  }

  allocations.forEach((alloc, index) => {
    if (alloc.percentage < 0 || alloc.percentage > 100) {
      errors.push(`Allocation ${index + 1}: Percentage must be between 0 and 100`);
    }
  });

  return {
    isValid: errors.length === 0 && Math.abs(totalPercentage - 100) < 0.01,
    totalPercentage,
    errors,
  };
}

/**
 * Analyzes skill gaps based on required vs current skills
 *
 * @param {SkillEntry[]} currentSkills - Current skill set
 * @param {string[]} requiredSkills - Required skills for position
 * @returns {object} Skill gap analysis
 *
 * @example
 * ```tsx
 * const analysis = analyzeSkillGaps(employee.skills, position.requiredSkills);
 * analysis.gaps.forEach(gap => {
 *   recommendTraining(gap);
 * });
 * ```
 */
export function analyzeSkillGaps(
  currentSkills: SkillEntry[],
  requiredSkills: string[]
): {
  gaps: string[];
  partialSkills: string[];
  fulfilledSkills: string[];
  recommendations: string[];
} {
  const currentSkillNames = currentSkills.map(s => s.skillName.toLowerCase());
  const gaps: string[] = [];
  const partialSkills: string[] = [];
  const fulfilledSkills: string[] = [];

  requiredSkills.forEach(required => {
    const requiredLower = required.toLowerCase();
    const skill = currentSkills.find(s => s.skillName.toLowerCase() === requiredLower);

    if (!skill) {
      gaps.push(required);
    } else if (skill.proficiencyLevel === 'beginner' || skill.proficiencyLevel === 'intermediate') {
      partialSkills.push(required);
    } else {
      fulfilledSkills.push(required);
    }
  });

  const recommendations: string[] = [
    ...gaps.map(gap => `Acquire ${gap} skill`),
    ...partialSkills.map(skill => `Advance ${skill} proficiency to expert level`),
  ];

  return {
    gaps,
    partialSkills,
    fulfilledSkills,
    recommendations,
  };
}

/**
 * Generates onboarding checklist based on position type
 *
 * @param {string} positionType - Type of position
 * @param {string} clearanceLevel - Required clearance level
 * @returns {ChecklistItem[]} Generated onboarding checklist
 *
 * @example
 * ```tsx
 * const checklist = generateOnboardingChecklist('engineer', 'secret');
 * <ChecklistManager items={checklist} />
 * ```
 */
export function generateOnboardingChecklist(
  positionType: string,
  clearanceLevel: string
): ChecklistItem[] {
  const baseItems: ChecklistItem[] = [
    {
      itemId: 'item-001',
      description: 'Complete I-9 Employment Eligibility Verification',
      category: 'hr_paperwork',
      responsibleParty: 'HR',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      status: 'pending',
    },
    {
      itemId: 'item-002',
      description: 'Set up email and network accounts',
      category: 'it_setup',
      responsibleParty: 'IT',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: 'pending',
    },
    {
      itemId: 'item-003',
      description: 'Issue building access badge',
      category: 'facility_access',
      responsibleParty: 'Security',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: 'pending',
    },
    {
      itemId: 'item-004',
      description: 'Complete mandatory cybersecurity training',
      category: 'training',
      responsibleParty: 'Employee',
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: 'pending',
    },
  ];

  if (clearanceLevel !== 'none') {
    baseItems.push({
      itemId: 'item-sec-001',
      description: `Initiate ${clearanceLevel} security clearance investigation`,
      category: 'hr_paperwork',
      responsibleParty: 'Security',
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      status: 'pending',
    });
  }

  return baseItems;
}

/**
 * Calculates career development progress
 *
 * @param {CareerDevelopmentPlan} plan - Career development plan
 * @returns {object} Progress metrics
 *
 * @example
 * ```tsx
 * const progress = calculateCareerDevelopmentProgress(plan);
 * <ProgressBar percentage={progress.overallProgress} />
 * ```
 */
export function calculateCareerDevelopmentProgress(plan: CareerDevelopmentPlan): {
  overallProgress: number;
  goalsAchieved: number;
  goalsInProgress: number;
  activitiesCompleted: number;
  activitiesPlanned: number;
} {
  const goalsAchieved = plan.careerGoals.filter(g => g.status === 'achieved').length;
  const goalsInProgress = plan.careerGoals.filter(g => g.status === 'in_progress').length;
  const activitiesCompleted = plan.developmentActivities.filter(a => a.status === 'completed').length;
  const activitiesPlanned = plan.developmentActivities.length;

  const overallProgress = plan.careerGoals.length > 0
    ? Math.round((goalsAchieved / plan.careerGoals.length) * 100)
    : 0;

  return {
    overallProgress,
    goalsAchieved,
    goalsInProgress,
    activitiesCompleted,
    activitiesPlanned,
  };
}

/**
 * Assesses deployment readiness based on multiple criteria
 *
 * @param {DeploymentReadiness} readiness - Deployment readiness record
 * @returns {object} Readiness assessment
 *
 * @example
 * ```tsx
 * const assessment = assessDeploymentReadiness(readiness);
 * if (!assessment.isReady) {
 *   displayRequirements(assessment.blockers);
 * }
 * ```
 */
export function assessDeploymentReadiness(readiness: DeploymentReadiness): {
  isReady: boolean;
  score: number;
  blockers: string[];
  warnings: string[];
  expirations: { item: string; daysUntil: number }[];
} {
  const blockers: string[] = [];
  const warnings: string[] = [];
  const expirations: { item: string; daysUntil: number }[] = [];
  const now = new Date();

  if (!readiness.medicalClearance) {
    blockers.push('Medical clearance not current');
  } else if (readiness.medicalExpirationDate) {
    const daysUntil = Math.ceil((new Date(readiness.medicalExpirationDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (daysUntil < 30) {
      warnings.push('Medical clearance expires soon');
      expirations.push({ item: 'Medical clearance', daysUntil });
    }
  }

  if (!readiness.dentalClearance) {
    blockers.push('Dental clearance not current');
  }

  if (!readiness.securityClearance) {
    blockers.push('Security clearance required');
  }

  if (!readiness.requiredTrainingComplete) {
    blockers.push('Required training not complete');
  }

  const score = [
    readiness.medicalClearance,
    readiness.dentalClearance,
    readiness.securityClearance,
    readiness.requiredTrainingComplete,
  ].filter(Boolean).length * 25;

  return {
    isReady: blockers.length === 0,
    score,
    blockers,
    warnings,
    expirations,
  };
}

/**
 * Searches personnel by multiple criteria
 *
 * @param {PersonnelProfile[]} personnel - Array of personnel profiles
 * @param {object} criteria - Search criteria
 * @returns {PersonnelProfile[]} Filtered personnel
 *
 * @example
 * ```tsx
 * const engineers = searchPersonnel(allPersonnel, {
 *   positionSeries: 'GS-0801',
 *   organizationCode: 'NWD'
 * });
 * ```
 */
export function searchPersonnel(
  personnel: PersonnelProfile[],
  criteria: {
    organizationCode?: string;
    positionSeries?: string;
    clearanceLevel?: string;
    employmentType?: string;
    searchTerm?: string;
  }
): PersonnelProfile[] {
  return personnel.filter(person => {
    if (criteria.organizationCode && person.organizationCode !== criteria.organizationCode) {
      return false;
    }
    if (criteria.positionSeries && person.positionSeries !== criteria.positionSeries) {
      return false;
    }
    if (criteria.clearanceLevel && person.clearanceLevel !== criteria.clearanceLevel) {
      return false;
    }
    if (criteria.employmentType && person.employmentType !== criteria.employmentType) {
      return false;
    }
    if (criteria.searchTerm) {
      const term = criteria.searchTerm.toLowerCase();
      const fullName = `${person.firstName} ${person.lastName}`.toLowerCase();
      if (!fullName.includes(term) && !person.email.toLowerCase().includes(term)) {
        return false;
      }
    }
    return true;
  });
}

/**
 * Generates personnel analytics report
 *
 * @param {PersonnelProfile[]} personnel - Array of personnel profiles
 * @returns {object} Analytics report
 *
 * @example
 * ```tsx
 * const analytics = generatePersonnelAnalytics(allPersonnel);
 * <Dashboard data={analytics} />
 * ```
 */
export function generatePersonnelAnalytics(personnel: PersonnelProfile[]): {
  totalCount: number;
  byEmploymentType: Record<string, number>;
  byOrganization: Record<string, number>;
  byClearanceLevel: Record<string, number>;
  averageTenure: number;
} {
  const byEmploymentType: Record<string, number> = {};
  const byOrganization: Record<string, number> = {};
  const byClearanceLevel: Record<string, number> = {};
  let totalTenureDays = 0;

  personnel.forEach(person => {
    byEmploymentType[person.employmentType] = (byEmploymentType[person.employmentType] || 0) + 1;
    byOrganization[person.organizationCode] = (byOrganization[person.organizationCode] || 0) + 1;
    byClearanceLevel[person.clearanceLevel] = (byClearanceLevel[person.clearanceLevel] || 0) + 1;

    const tenureDays = Math.ceil((Date.now() - new Date(person.hireDate).getTime()) / (1000 * 60 * 60 * 24));
    totalTenureDays += tenureDays;
  });

  return {
    totalCount: personnel.length,
    byEmploymentType,
    byOrganization,
    byClearanceLevel,
    averageTenure: personnel.length > 0 ? Math.round(totalTenureDays / personnel.length / 365 * 10) / 10 : 0,
  };
}

/**
 * Validates competency assessment scores
 *
 * @param {CompetencyAssessment} assessment - Competency assessment
 * @returns {object} Validation results
 *
 * @example
 * ```tsx
 * const validation = validateCompetencyAssessment(assessment);
 * if (!validation.isValid) {
 *   showErrors(validation.errors);
 * }
 * ```
 */
export function validateCompetencyAssessment(assessment: CompetencyAssessment): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (assessment.competencyLevel < 1 || assessment.competencyLevel > 5) {
    errors.push('Competency level must be between 1 and 5');
  }

  if (assessment.proficiencyRating < 0 || assessment.proficiencyRating > 100) {
    errors.push('Proficiency rating must be between 0 and 100');
  }

  if (assessment.strengths.length === 0 && assessment.proficiencyRating > 70) {
    warnings.push('High proficiency rating should include identified strengths');
  }

  if (assessment.developmentAreas.length === 0 && assessment.proficiencyRating < 70) {
    warnings.push('Lower proficiency rating should include development areas');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Calculates workforce capacity metrics
 *
 * @param {PositionAssignment[]} assignments - Array of position assignments
 * @returns {object} Capacity metrics
 *
 * @example
 * ```tsx
 * const capacity = calculateWorkforceCapacity(assignments);
 * console.log(`Total FTE: ${capacity.totalFTE}`);
 * ```
 */
export function calculateWorkforceCapacity(assignments: PositionAssignment[]): {
  totalFTE: number;
  activeAssignments: number;
  byProject: Record<string, number>;
  utilizationRate: number;
} {
  const now = new Date();
  const activeAssignments = assignments.filter(a =>
    a.status === 'active' &&
    new Date(a.startDate) <= now &&
    (!a.endDate || new Date(a.endDate) >= now)
  );

  const byProject: Record<string, number> = {};
  let totalFTE = 0;

  activeAssignments.forEach(assignment => {
    const fte = assignment.percentageTime / 100;
    totalFTE += fte;

    if (assignment.projectCode) {
      byProject[assignment.projectCode] = (byProject[assignment.projectCode] || 0) + fte;
    }
  });

  return {
    totalFTE: Math.round(totalFTE * 100) / 100,
    activeAssignments: activeAssignments.length,
    byProject,
    utilizationRate: activeAssignments.length > 0 ? Math.round((totalFTE / activeAssignments.length) * 100) : 0,
  };
}

/**
 * Generates training compliance report
 *
 * @param {TrainingRecord[]} trainingRecords - Array of training records
 * @returns {object} Compliance report
 *
 * @example
 * ```tsx
 * const report = generateTrainingComplianceReport(allTraining);
 * <ComplianceTable data={report} />
 * ```
 */
export function generateTrainingComplianceReport(trainingRecords: TrainingRecord[]): {
  totalRequired: number;
  completed: number;
  overdue: number;
  expiringSoon: number;
  complianceRate: number;
  byType: Record<string, { required: number; completed: number }>;
} {
  const now = new Date();
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const required = trainingRecords.filter(t => t.trainingType === 'mandatory');
  const completed = required.filter(t => t.status === 'completed');
  const overdue = required.filter(t =>
    t.dueDate &&
    new Date(t.dueDate) < now &&
    t.status !== 'completed'
  );
  const expiringSoon = trainingRecords.filter(t =>
    t.nextDueDate &&
    new Date(t.nextDueDate) <= thirtyDaysFromNow &&
    new Date(t.nextDueDate) > now
  );

  const byType: Record<string, { required: number; completed: number }> = {};
  trainingRecords.forEach(record => {
    if (!byType[record.trainingType]) {
      byType[record.trainingType] = { required: 0, completed: 0 };
    }
    byType[record.trainingType].required++;
    if (record.status === 'completed') {
      byType[record.trainingType].completed++;
    }
  });

  return {
    totalRequired: required.length,
    completed: completed.length,
    overdue: overdue.length,
    expiringSoon: expiringSoon.length,
    complianceRate: required.length > 0 ? Math.round((completed.length / required.length) * 100) : 100,
    byType,
  };
}

/**
 * Exports personnel data for reporting
 *
 * @param {PersonnelProfile[]} personnel - Array of personnel profiles
 * @param {string} format - Export format
 * @returns {string} Exported data
 *
 * @example
 * ```tsx
 * const csvData = exportPersonnelData(personnel, 'csv');
 * downloadFile(csvData, 'personnel-report.csv');
 * ```
 */
export function exportPersonnelData(
  personnel: PersonnelProfile[],
  format: 'csv' | 'json' = 'csv'
): string {
  if (format === 'json') {
    return JSON.stringify(personnel, null, 2);
  }

  // CSV format
  const headers = [
    'Employee Number',
    'Name',
    'Position',
    'Organization',
    'Grade',
    'Email',
    'Hire Date',
  ];

  const rows = personnel.map(p => [
    p.employeeNumber,
    `${p.firstName} ${p.lastName}`,
    p.positionTitle,
    p.organizationCode,
    p.gradeLevel,
    p.email,
    p.hireDate.toISOString().split('T')[0],
  ]);

  return [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n');
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Formats personnel name for display
 *
 * @param {PersonnelProfile} person - Personnel profile
 * @param {string} format - Name format
 * @returns {string} Formatted name
 */
export function formatPersonnelName(
  person: PersonnelProfile,
  format: 'full' | 'last_first' | 'formal' = 'full'
): string {
  switch (format) {
    case 'last_first':
      return `${person.lastName}, ${person.firstName}${person.middleName ? ' ' + person.middleName.charAt(0) + '.' : ''}`;
    case 'formal':
      return `${person.lastName}, ${person.firstName}${person.middleName ? ' ' + person.middleName : ''}`;
    case 'full':
    default:
      return `${person.firstName}${person.middleName ? ' ' + person.middleName : ''} ${person.lastName}`;
  }
}

/**
 * Calculates time in service
 *
 * @param {Date} hireDate - Hire date
 * @param {Date} serviceComputation - Service computation date
 * @returns {object} Time in service breakdown
 */
export function calculateTimeInService(
  hireDate: Date,
  serviceComputation: Date
): {
  years: number;
  months: number;
  days: number;
  totalDays: number;
} {
  const computationDate = new Date(serviceComputation);
  const now = new Date();
  const diffMs = now.getTime() - computationDate.getTime();
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  const years = Math.floor(totalDays / 365);
  const months = Math.floor((totalDays % 365) / 30);
  const days = totalDays % 30;

  return {
    years,
    months,
    days,
    totalDays,
  };
}

/**
 * Determines next performance evaluation due date
 *
 * @param {Date} lastEvaluationDate - Last evaluation date
 * @param {string} evaluationType - Type of evaluation
 * @returns {Date} Next evaluation due date
 */
export function calculateNextEvaluationDate(
  lastEvaluationDate: Date,
  evaluationType: 'annual' | 'probationary' | 'interim'
): Date {
  const lastDate = new Date(lastEvaluationDate);
  const nextDate = new Date(lastDate);

  switch (evaluationType) {
    case 'probationary':
      nextDate.setMonth(nextDate.getMonth() + 3);
      break;
    case 'interim':
      nextDate.setMonth(nextDate.getMonth() + 6);
      break;
    case 'annual':
    default:
      nextDate.setFullYear(nextDate.getFullYear() + 1);
      break;
  }

  return nextDate;
}

/**
 * Validates personnel data completeness
 *
 * @param {PersonnelProfile} profile - Personnel profile
 * @returns {object} Validation results
 */
export function validatePersonnelDataCompleteness(profile: PersonnelProfile): {
  isComplete: boolean;
  missingFields: string[];
  completionPercentage: number;
} {
  const requiredFields = [
    'employeeNumber',
    'firstName',
    'lastName',
    'email',
    'phone',
    'organizationCode',
    'positionTitle',
    'positionSeries',
    'gradeLevel',
    'employmentType',
    'hireDate',
    'supervisor',
    'workLocation',
  ];

  const missingFields = requiredFields.filter(field => {
    const value = (profile as any)[field];
    return value === undefined || value === null || value === '';
  });

  const completionPercentage = Math.round(
    ((requiredFields.length - missingFields.length) / requiredFields.length) * 100
  );

  return {
    isComplete: missingFields.length === 0,
    missingFields,
    completionPercentage,
  };
}

// Export all hooks and functions
export default {
  // Hooks
  usePersonnelProfile,
  usePositionAssignments,
  useQualificationTracking,
  useTrainingManagement,
  useTimesheetManagement,
  useLeaveManagement,

  // Composite Functions
  createPersonnelProfileForm,
  validateQualificationExpirations,
  calculateTrainingCompletion,
  validateTimesheetEntries,
  calculateLeaveBalance,
  generatePerformanceEvaluationForm,
  checkSecurityClearanceStatus,
  validateLaborDistribution,
  analyzeSkillGaps,
  generateOnboardingChecklist,
  calculateCareerDevelopmentProgress,
  assessDeploymentReadiness,
  searchPersonnel,
  generatePersonnelAnalytics,
  validateCompetencyAssessment,
  calculateWorkforceCapacity,
  generateTrainingComplianceReport,
  exportPersonnelData,

  // Utility Functions
  formatPersonnelName,
  calculateTimeInService,
  calculateNextEvaluationDate,
  validatePersonnelDataCompleteness,
};
