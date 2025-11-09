/**
 * LOC: HCMMSS1234567
 * File: /reuse/server/human-capital/manager-self-service-kit.ts
 *
 * UPSTREAM (imports from):
 *   - ../../error-handling-kit.ts
 *   - ../../validation-kit.ts
 *   - ./employee-self-service-kit.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend HR services
 *   - Manager portal controllers
 *   - Mobile management applications
 */
/**
 * Approval status
 */
export declare enum ApprovalStatus {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected",
    WITHDRAWN = "withdrawn",
    ESCALATED = "escalated"
}
/**
 * Approval types
 */
export declare enum ApprovalType {
    TIME_OFF = "time_off",
    EXPENSE = "expense",
    TIMESHEET = "timesheet",
    REQUISITION = "requisition",
    COMPENSATION_CHANGE = "compensation_change",
    PROMOTION = "promotion",
    TRANSFER = "transfer",
    HIRE = "hire",
    TERMINATION = "termination"
}
/**
 * Performance review cycle status
 */
export declare enum PerformanceReviewCycleStatus {
    NOT_STARTED = "not_started",
    SELF_ASSESSMENT = "self_assessment",
    MANAGER_REVIEW = "manager_review",
    CALIBRATION = "calibration",
    COMPLETED = "completed",
    CLOSED = "closed"
}
/**
 * Performance rating scale
 */
export declare enum PerformanceRating {
    EXCEEDS_EXPECTATIONS = "exceeds_expectations",
    MEETS_EXPECTATIONS = "meets_expectations",
    NEEDS_IMPROVEMENT = "needs_improvement",
    UNSATISFACTORY = "unsatisfactory",
    OUTSTANDING = "outstanding"
}
/**
 * Requisition status
 */
export declare enum RequisitionStatus {
    DRAFT = "draft",
    SUBMITTED = "submitted",
    APPROVED = "approved",
    REJECTED = "rejected",
    ON_HOLD = "on_hold",
    FILLED = "filled",
    CANCELLED = "cancelled"
}
/**
 * Candidate status
 */
export declare enum CandidateStatus {
    NEW = "new",
    SCREENING = "screening",
    INTERVIEWING = "interviewing",
    OFFER_EXTENDED = "offer_extended",
    OFFER_ACCEPTED = "offer_accepted",
    OFFER_REJECTED = "offer_rejected",
    HIRED = "hired",
    REJECTED = "rejected",
    WITHDRAWN = "withdrawn"
}
/**
 * Onboarding task status
 */
export declare enum OnboardingTaskStatus {
    NOT_STARTED = "not_started",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    OVERDUE = "overdue",
    SKIPPED = "skipped"
}
/**
 * Compensation change type
 */
export declare enum CompensationChangeType {
    MERIT_INCREASE = "merit_increase",
    PROMOTION = "promotion",
    MARKET_ADJUSTMENT = "market_adjustment",
    COST_OF_LIVING = "cost_of_living",
    BONUS = "bonus",
    EQUITY = "equity",
    OTHER = "other"
}
/**
 * Meeting status
 */
export declare enum MeetingStatus {
    SCHEDULED = "scheduled",
    COMPLETED = "completed",
    CANCELLED = "cancelled",
    RESCHEDULED = "rescheduled",
    NO_SHOW = "no_show"
}
/**
 * Delegation type
 */
export declare enum DelegationType {
    APPROVALS = "approvals",
    REPORTING = "reporting",
    TEAM_MANAGEMENT = "team_management",
    ALL = "all"
}
/**
 * Team member interface
 */
export interface TeamMember {
    employeeId: string;
    firstName: string;
    lastName: string;
    email: string;
    jobTitle: string;
    department: string;
    location: string;
    hireDate: Date;
    status: 'active' | 'inactive' | 'on_leave';
    profilePictureUrl?: string;
    phone?: string;
    reportsTo?: string;
    directReports?: string[];
}
/**
 * Team overview interface
 */
export interface TeamOverview {
    managerId: string;
    teamSize: number;
    directReports: number;
    indirectReports: number;
    teamMembers: TeamMember[];
    departments: string[];
    locations: string[];
    avgTenure: number;
    headcountByDepartment: Record<string, number>;
    headcountByLocation: Record<string, number>;
}
/**
 * Approval request interface
 */
export interface ApprovalRequest {
    id: string;
    type: ApprovalType;
    requesterId: string;
    requesterName: string;
    approverId: string;
    status: ApprovalStatus;
    requestDate: Date;
    requestData: Record<string, any>;
    comments?: string;
    approverComments?: string;
    approvedDate?: Date;
    rejectedDate?: Date;
    rejectedReason?: string;
    escalationDate?: Date;
    escalatedTo?: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    dueDate?: Date;
}
/**
 * Team performance review interface
 */
export interface TeamPerformanceReview {
    employeeId: string;
    employeeName: string;
    reviewCycleId: string;
    reviewPeriodStart: Date;
    reviewPeriodEnd: Date;
    status: PerformanceReviewCycleStatus;
    selfAssessmentCompleted: boolean;
    managerReviewCompleted: boolean;
    overallRating?: PerformanceRating;
    competencyRatings: Array<{
        competency: string;
        rating: number;
        comments?: string;
    }>;
    achievements: string;
    areasForImprovement: string;
    developmentPlan: string;
    managerComments: string;
    calibrationRating?: PerformanceRating;
    completedDate?: Date;
}
/**
 * Team goal interface
 */
export interface TeamGoal {
    id: string;
    managerId: string;
    title: string;
    description: string;
    category: 'team_performance' | 'department_objective' | 'strategic_initiative';
    status: 'draft' | 'active' | 'on_track' | 'at_risk' | 'behind' | 'completed';
    priority: 'low' | 'medium' | 'high' | 'critical';
    startDate: Date;
    targetDate: Date;
    completionDate?: Date;
    progress: number;
    metrics: string;
    alignedToObjective?: string;
    teamMembers: string[];
    milestones: Array<{
        id: string;
        title: string;
        targetDate: Date;
        completionDate?: Date;
        isCompleted: boolean;
        assignedTo?: string;
    }>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Job requisition interface
 */
export interface JobRequisition {
    id: string;
    requisitionNumber: string;
    jobTitle: string;
    department: string;
    location: string;
    employmentType: 'full_time' | 'part_time' | 'contractor' | 'intern';
    hiringManager: string;
    openPositions: number;
    filledPositions: number;
    status: RequisitionStatus;
    jobDescription: string;
    requirements: string[];
    preferredQualifications: string[];
    salaryRangeMin?: number;
    salaryRangeMax?: number;
    currency: string;
    targetStartDate?: Date;
    approver?: string;
    approvedDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Candidate interface
 */
export interface Candidate {
    id: string;
    requisitionId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    status: CandidateStatus;
    source: string;
    appliedDate: Date;
    resumeUrl?: string;
    coverLetterUrl?: string;
    currentStage: string;
    interviews: Interview[];
    offerDetails?: OfferDetails;
    rejectionReason?: string;
    hireDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Interview interface
 */
export interface Interview {
    id: string;
    candidateId: string;
    interviewType: 'phone_screen' | 'technical' | 'behavioral' | 'panel' | 'final';
    scheduledDate: Date;
    interviewers: string[];
    status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
    feedback?: string;
    rating?: number;
    recommendation?: 'strong_hire' | 'hire' | 'no_hire' | 'strong_no_hire';
    completedDate?: Date;
}
/**
 * Offer details interface
 */
export interface OfferDetails {
    offerDate: Date;
    salary: number;
    currency: string;
    startDate: Date;
    benefits: string[];
    equity?: string;
    bonus?: number;
    relocationAssistance?: boolean;
    signOnBonus?: number;
    acceptedDate?: Date;
    declinedDate?: Date;
    declineReason?: string;
}
/**
 * Onboarding checklist interface
 */
export interface OnboardingChecklist {
    id: string;
    employeeId: string;
    employeeName: string;
    startDate: Date;
    status: 'not_started' | 'in_progress' | 'completed';
    tasks: OnboardingTask[];
    completionPercentage: number;
    assignedBuddy?: string;
    assignedMentor?: string;
    manager: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Onboarding task interface
 */
export interface OnboardingTask {
    id: string;
    checklistId: string;
    title: string;
    description: string;
    category: 'hr' | 'it' | 'facilities' | 'training' | 'team' | 'manager';
    status: OnboardingTaskStatus;
    assignedTo: string;
    dueDate: Date;
    completedDate?: Date;
    completedBy?: string;
    isBlocking: boolean;
    dependencies?: string[];
    notes?: string;
}
/**
 * Team schedule interface
 */
export interface TeamSchedule {
    date: Date;
    teamMembers: Array<{
        employeeId: string;
        employeeName: string;
        status: 'working' | 'off' | 'remote' | 'traveling' | 'meeting';
        location?: string;
        notes?: string;
    }>;
}
/**
 * Compensation change request interface
 */
export interface CompensationChangeRequest {
    id: string;
    employeeId: string;
    employeeName: string;
    requestedBy: string;
    changeType: CompensationChangeType;
    currentSalary: number;
    proposedSalary: number;
    percentageIncrease: number;
    effectiveDate: Date;
    justification: string;
    budgetImpact: number;
    status: ApprovalStatus;
    approver?: string;
    approvedDate?: Date;
    rejectedReason?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Learning assignment interface
 */
export interface LearningAssignment {
    id: string;
    employeeId: string;
    employeeName: string;
    courseId: string;
    courseTitle: string;
    assignedBy: string;
    assignedDate: Date;
    dueDate?: Date;
    isRequired: boolean;
    reason?: string;
    status: 'assigned' | 'in_progress' | 'completed' | 'overdue';
    completionDate?: Date;
    enrollmentId?: string;
}
/**
 * One-on-one meeting interface
 */
export interface OneOnOneMeeting {
    id: string;
    managerId: string;
    employeeId: string;
    employeeName: string;
    scheduledDate: Date;
    duration: number;
    status: MeetingStatus;
    location?: string;
    agenda: string[];
    employeeNotes?: string;
    managerNotes?: string;
    actionItems: MeetingActionItem[];
    privateNotes?: string;
    completedDate?: Date;
    nextMeetingDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Meeting action item interface
 */
export interface MeetingActionItem {
    id: string;
    description: string;
    assignedTo: string;
    dueDate?: Date;
    status: 'open' | 'in_progress' | 'completed' | 'cancelled';
    completedDate?: Date;
}
/**
 * Team analytics interface
 */
export interface TeamAnalytics {
    managerId: string;
    period: {
        startDate: Date;
        endDate: Date;
    };
    teamSize: number;
    headcount: {
        current: number;
        newHires: number;
        terminations: number;
        transfers: number;
    };
    timeOff: {
        totalDaysRequested: number;
        totalDaysApproved: number;
        totalDaysTaken: number;
        avgDaysPerEmployee: number;
    };
    performance: {
        avgRating: number;
        ratingDistribution: Record<string, number>;
        goalsOnTrack: number;
        goalsAtRisk: number;
        goalsBehind: number;
    };
    engagement: {
        avgEngagementScore: number;
        participationRate: number;
        eNPS: number;
    };
    learning: {
        totalCoursesCompleted: number;
        avgHoursPerEmployee: number;
        certificationRate: number;
    };
    turnover: {
        voluntaryRate: number;
        involuntaryRate: number;
        avgTenure: number;
    };
}
/**
 * Delegation interface
 */
export interface Delegation {
    id: string;
    delegatorId: string;
    delegatorName: string;
    delegateId: string;
    delegateName: string;
    type: DelegationType;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    reason?: string;
    limitations?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * DTO for approval decision
 */
export declare class ApprovalDecisionDto {
    status: ApprovalStatus;
    comments?: string;
    rejectedReason?: string;
}
/**
 * DTO for creating team goal
 */
export declare class CreateTeamGoalDto {
    title: string;
    description: string;
    category: string;
    priority: string;
    startDate: Date;
    targetDate: Date;
    metrics: string;
    teamMembers: string[];
}
/**
 * DTO for submitting performance review
 */
export declare class SubmitPerformanceReviewDto {
    overallRating: PerformanceRating;
    competencyRatings: CompetencyRatingDto[];
    achievements: string;
    areasForImprovement: string;
    developmentPlan: string;
    managerComments: string;
}
/**
 * DTO for competency rating
 */
export declare class CompetencyRatingDto {
    competency: string;
    rating: number;
    comments?: string;
}
/**
 * DTO for creating job requisition
 */
export declare class CreateJobRequisitionDto {
    jobTitle: string;
    department: string;
    location: string;
    employmentType: string;
    openPositions: number;
    jobDescription: string;
    requirements: string[];
    preferredQualifications?: string[];
    salaryRangeMin?: number;
    salaryRangeMax?: number;
    currency: string;
}
/**
 * DTO for updating candidate status
 */
export declare class UpdateCandidateStatusDto {
    status: CandidateStatus;
    notes?: string;
    rejectionReason?: string;
}
/**
 * DTO for scheduling interview
 */
export declare class ScheduleInterviewDto {
    interviewType: string;
    scheduledDate: Date;
    interviewers: string[];
}
/**
 * DTO for compensation change request
 */
export declare class CreateCompensationChangeDto {
    changeType: CompensationChangeType;
    proposedSalary: number;
    effectiveDate: Date;
    justification: string;
}
/**
 * DTO for learning assignment
 */
export declare class AssignLearningCourseDto {
    courseId: string;
    dueDate?: Date;
    isRequired: boolean;
    reason?: string;
}
/**
 * DTO for scheduling one-on-one
 */
export declare class ScheduleOneOnOneDto {
    scheduledDate: Date;
    duration: number;
    location?: string;
    agenda: string[];
}
/**
 * DTO for creating delegation
 */
export declare class CreateDelegationDto {
    delegateId: string;
    type: DelegationType;
    startDate: Date;
    endDate: Date;
    reason?: string;
    limitations?: string;
}
/**
 * Gets team overview for manager
 *
 * @param managerId - Manager identifier
 * @returns Team overview with metrics
 *
 * @example
 * ```typescript
 * const overview = await getTeamOverview('mgr-123');
 * console.log(overview.teamSize, overview.departments);
 * ```
 */
export declare function getTeamOverview(managerId: string): Promise<TeamOverview>;
/**
 * Gets direct reports for manager
 *
 * @param managerId - Manager identifier
 * @returns List of direct reports
 *
 * @example
 * ```typescript
 * const reports = await getDirectReports('mgr-123');
 * ```
 */
export declare function getDirectReports(managerId: string): Promise<TeamMember[]>;
/**
 * Gets indirect reports for manager
 *
 * @param managerId - Manager identifier
 * @returns List of indirect reports
 *
 * @example
 * ```typescript
 * const indirectReports = await getIndirectReports('mgr-123');
 * ```
 */
export declare function getIndirectReports(managerId: string): Promise<TeamMember[]>;
/**
 * Gets team member details
 *
 * @param employeeId - Employee identifier
 * @returns Team member details
 *
 * @example
 * ```typescript
 * const member = await getTeamMemberDetails('emp-123');
 * ```
 */
export declare function getTeamMemberDetails(employeeId: string): Promise<TeamMember>;
/**
 * Gets pending approvals for manager
 *
 * @param managerId - Manager identifier
 * @param type - Optional approval type filter
 * @returns List of pending approval requests
 *
 * @example
 * ```typescript
 * const approvals = await getPendingApprovals('mgr-123', ApprovalType.TIME_OFF);
 * ```
 */
export declare function getPendingApprovals(managerId: string, type?: ApprovalType): Promise<ApprovalRequest[]>;
/**
 * Approves request
 *
 * @param requestId - Request identifier
 * @param approverId - Approver identifier
 * @param comments - Optional approval comments
 * @returns Updated request
 *
 * @example
 * ```typescript
 * await approveRequest('request-123', 'mgr-456', 'Approved for vacation dates');
 * ```
 */
export declare function approveRequest(requestId: string, approverId: string, comments?: string): Promise<ApprovalRequest>;
/**
 * Rejects request
 *
 * @param requestId - Request identifier
 * @param approverId - Approver identifier
 * @param reason - Rejection reason
 * @returns Updated request
 *
 * @example
 * ```typescript
 * await rejectRequest('request-123', 'mgr-456', 'Insufficient coverage during requested dates');
 * ```
 */
export declare function rejectRequest(requestId: string, approverId: string, reason: string): Promise<ApprovalRequest>;
/**
 * Escalates request to higher-level approver
 *
 * @param requestId - Request identifier
 * @param escalatedTo - Higher-level approver ID
 * @param reason - Escalation reason
 * @returns Updated request
 *
 * @example
 * ```typescript
 * await escalateRequest('request-123', 'director-789', 'Requires director approval');
 * ```
 */
export declare function escalateRequest(requestId: string, escalatedTo: string, reason: string): Promise<ApprovalRequest>;
/**
 * Bulk approves multiple requests
 *
 * @param requestIds - Array of request identifiers
 * @param approverId - Approver identifier
 * @returns Array of updated requests
 *
 * @example
 * ```typescript
 * await bulkApproveRequests(['req-1', 'req-2', 'req-3'], 'mgr-456');
 * ```
 */
export declare function bulkApproveRequests(requestIds: string[], approverId: string): Promise<ApprovalRequest[]>;
/**
 * Gets approval history for employee
 *
 * @param employeeId - Employee identifier
 * @param type - Optional approval type filter
 * @returns Approval history
 *
 * @example
 * ```typescript
 * const history = await getEmployeeApprovalHistory('emp-123', ApprovalType.EXPENSE);
 * ```
 */
export declare function getEmployeeApprovalHistory(employeeId: string, type?: ApprovalType): Promise<ApprovalRequest[]>;
/**
 * Gets approval metrics for manager
 *
 * @param managerId - Manager identifier
 * @param startDate - Start date for metrics
 * @param endDate - End date for metrics
 * @returns Approval metrics
 *
 * @example
 * ```typescript
 * const metrics = await getApprovalMetrics('mgr-123', new Date('2025-01-01'), new Date('2025-12-31'));
 * ```
 */
export declare function getApprovalMetrics(managerId: string, startDate: Date, endDate: Date): Promise<{
    totalRequests: number;
    approved: number;
    rejected: number;
    pending: number;
    avgResponseTime: number;
}>;
/**
 * Sends approval reminder to manager
 *
 * @param managerId - Manager identifier
 * @returns Reminder sent status
 *
 * @example
 * ```typescript
 * await sendApprovalReminder('mgr-123');
 * ```
 */
export declare function sendApprovalReminder(managerId: string): Promise<boolean>;
/**
 * Gets team performance reviews
 *
 * @param managerId - Manager identifier
 * @param reviewCycleId - Review cycle identifier
 * @returns List of team performance reviews
 *
 * @example
 * ```typescript
 * const reviews = await getTeamPerformanceReviews('mgr-123', 'cycle-2025');
 * ```
 */
export declare function getTeamPerformanceReviews(managerId: string, reviewCycleId: string): Promise<TeamPerformanceReview[]>;
/**
 * Submits manager performance review
 *
 * @param reviewId - Review identifier
 * @param reviewData - Review data
 * @returns Updated review
 *
 * @example
 * ```typescript
 * await submitManagerPerformanceReview('review-123', {
 *   overallRating: PerformanceRating.EXCEEDS_EXPECTATIONS,
 *   competencyRatings: [...],
 *   achievements: '...',
 *   areasForImprovement: '...',
 *   developmentPlan: '...',
 *   managerComments: '...'
 * });
 * ```
 */
export declare function submitManagerPerformanceReview(reviewId: string, reviewData: Partial<TeamPerformanceReview>): Promise<TeamPerformanceReview>;
/**
 * Initiates calibration session
 *
 * @param managerId - Manager identifier
 * @param reviewCycleId - Review cycle identifier
 * @returns Calibration session details
 *
 * @example
 * ```typescript
 * await initiateCalibrationSession('mgr-123', 'cycle-2025');
 * ```
 */
export declare function initiateCalibrationSession(managerId: string, reviewCycleId: string): Promise<{
    sessionId: string;
    reviews: TeamPerformanceReview[];
}>;
/**
 * Updates calibration rating
 *
 * @param reviewId - Review identifier
 * @param calibrationRating - Calibrated rating
 * @returns Updated review
 *
 * @example
 * ```typescript
 * await updateCalibrationRating('review-123', PerformanceRating.MEETS_EXPECTATIONS);
 * ```
 */
export declare function updateCalibrationRating(reviewId: string, calibrationRating: PerformanceRating): Promise<TeamPerformanceReview>;
/**
 * Gets performance distribution for team
 *
 * @param managerId - Manager identifier
 * @param reviewCycleId - Review cycle identifier
 * @returns Performance rating distribution
 *
 * @example
 * ```typescript
 * const distribution = await getTeamPerformanceDistribution('mgr-123', 'cycle-2025');
 * ```
 */
export declare function getTeamPerformanceDistribution(managerId: string, reviewCycleId: string): Promise<Record<PerformanceRating, number>>;
/**
 * Exports performance review data
 *
 * @param managerId - Manager identifier
 * @param reviewCycleId - Review cycle identifier
 * @param format - Export format
 * @returns Export URL
 *
 * @example
 * ```typescript
 * const url = await exportPerformanceReviews('mgr-123', 'cycle-2025', 'pdf');
 * ```
 */
export declare function exportPerformanceReviews(managerId: string, reviewCycleId: string, format: 'pdf' | 'excel' | 'csv'): Promise<string>;
/**
 * Creates team goal
 *
 * @param managerId - Manager identifier
 * @param goalData - Goal data
 * @returns Created team goal
 *
 * @example
 * ```typescript
 * const goal = await createTeamGoal('mgr-123', {
 *   title: 'Improve Customer Satisfaction',
 *   description: 'Increase CSAT score to 95%',
 *   category: 'team_performance',
 *   priority: 'high',
 *   startDate: new Date(),
 *   targetDate: new Date('2025-12-31'),
 *   progress: 0,
 *   metrics: 'CSAT score >= 95%',
 *   teamMembers: ['emp-1', 'emp-2'],
 *   milestones: []
 * });
 * ```
 */
export declare function createTeamGoal(managerId: string, goalData: Omit<TeamGoal, 'id' | 'managerId' | 'status' | 'createdAt' | 'updatedAt'>): Promise<TeamGoal>;
/**
 * Gets team goals
 *
 * @param managerId - Manager identifier
 * @param status - Optional status filter
 * @returns List of team goals
 *
 * @example
 * ```typescript
 * const goals = await getTeamGoals('mgr-123', 'active');
 * ```
 */
export declare function getTeamGoals(managerId: string, status?: string): Promise<TeamGoal[]>;
/**
 * Updates team goal progress
 *
 * @param goalId - Goal identifier
 * @param progress - Progress percentage (0-100)
 * @returns Updated goal
 *
 * @example
 * ```typescript
 * await updateTeamGoalProgress('goal-123', 75);
 * ```
 */
export declare function updateTeamGoalProgress(goalId: string, progress: number): Promise<TeamGoal>;
/**
 * Assigns team member to goal
 *
 * @param goalId - Goal identifier
 * @param employeeId - Employee identifier
 * @returns Updated goal
 *
 * @example
 * ```typescript
 * await assignTeamMemberToGoal('goal-123', 'emp-456');
 * ```
 */
export declare function assignTeamMemberToGoal(goalId: string, employeeId: string): Promise<TeamGoal>;
/**
 * Creates job requisition
 *
 * @param managerId - Manager identifier
 * @param requisitionData - Requisition data
 * @returns Created requisition
 *
 * @example
 * ```typescript
 * const req = await createJobRequisition('mgr-123', {
 *   jobTitle: 'Senior Software Engineer',
 *   department: 'Engineering',
 *   location: 'Boston',
 *   employmentType: 'full_time',
 *   hiringManager: 'mgr-123',
 *   openPositions: 2,
 *   filledPositions: 0,
 *   jobDescription: '...',
 *   requirements: [...],
 *   currency: 'USD'
 * });
 * ```
 */
export declare function createJobRequisition(managerId: string, requisitionData: Omit<JobRequisition, 'id' | 'requisitionNumber' | 'status' | 'createdAt' | 'updatedAt'>): Promise<JobRequisition>;
/**
 * Submits job requisition for approval
 *
 * @param requisitionId - Requisition identifier
 * @returns Updated requisition
 *
 * @example
 * ```typescript
 * await submitJobRequisition('req-123');
 * ```
 */
export declare function submitJobRequisition(requisitionId: string): Promise<JobRequisition>;
/**
 * Gets candidates for requisition
 *
 * @param requisitionId - Requisition identifier
 * @param status - Optional status filter
 * @returns List of candidates
 *
 * @example
 * ```typescript
 * const candidates = await getCandidatesForRequisition('req-123', CandidateStatus.INTERVIEWING);
 * ```
 */
export declare function getCandidatesForRequisition(requisitionId: string, status?: CandidateStatus): Promise<Candidate[]>;
/**
 * Updates candidate status
 *
 * @param candidateId - Candidate identifier
 * @param status - New status
 * @param notes - Optional notes
 * @returns Updated candidate
 *
 * @example
 * ```typescript
 * await updateCandidateStatus('candidate-123', CandidateStatus.OFFER_EXTENDED, 'Offer sent via email');
 * ```
 */
export declare function updateCandidateStatus(candidateId: string, status: CandidateStatus, notes?: string): Promise<Candidate>;
/**
 * Schedules candidate interview
 *
 * @param candidateId - Candidate identifier
 * @param interviewData - Interview data
 * @returns Created interview
 *
 * @example
 * ```typescript
 * const interview = await scheduleInterview('candidate-123', {
 *   interviewType: 'technical',
 *   scheduledDate: new Date('2025-11-15T10:00:00'),
 *   interviewers: ['emp-1', 'emp-2']
 * });
 * ```
 */
export declare function scheduleInterview(candidateId: string, interviewData: Omit<Interview, 'id' | 'candidateId' | 'status'>): Promise<Interview>;
/**
 * Gets onboarding checklists for team
 *
 * @param managerId - Manager identifier
 * @returns List of onboarding checklists
 *
 * @example
 * ```typescript
 * const checklists = await getTeamOnboardingChecklists('mgr-123');
 * ```
 */
export declare function getTeamOnboardingChecklists(managerId: string): Promise<OnboardingChecklist[]>;
/**
 * Creates onboarding checklist
 *
 * @param employeeId - Employee identifier
 * @param managerId - Manager identifier
 * @returns Created checklist
 *
 * @example
 * ```typescript
 * const checklist = await createOnboardingChecklist('emp-123', 'mgr-456');
 * ```
 */
export declare function createOnboardingChecklist(employeeId: string, managerId: string): Promise<OnboardingChecklist>;
/**
 * Updates onboarding task status
 *
 * @param taskId - Task identifier
 * @param status - New status
 * @returns Updated task
 *
 * @example
 * ```typescript
 * await updateOnboardingTaskStatus('task-123', OnboardingTaskStatus.COMPLETED);
 * ```
 */
export declare function updateOnboardingTaskStatus(taskId: string, status: OnboardingTaskStatus): Promise<OnboardingTask>;
/**
 * Assigns buddy to new hire
 *
 * @param checklistId - Checklist identifier
 * @param buddyId - Buddy employee identifier
 * @returns Updated checklist
 *
 * @example
 * ```typescript
 * await assignBuddy('checklist-123', 'emp-456');
 * ```
 */
export declare function assignBuddy(checklistId: string, buddyId: string): Promise<OnboardingChecklist>;
/**
 * Gets team schedule for date range
 *
 * @param managerId - Manager identifier
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Team schedule
 *
 * @example
 * ```typescript
 * const schedule = await getTeamSchedule('mgr-123', new Date('2025-11-01'), new Date('2025-11-30'));
 * ```
 */
export declare function getTeamSchedule(managerId: string, startDate: Date, endDate: Date): Promise<TeamSchedule[]>;
/**
 * Gets team availability for date
 *
 * @param managerId - Manager identifier
 * @param date - Target date
 * @returns Team availability
 *
 * @example
 * ```typescript
 * const availability = await getTeamAvailability('mgr-123', new Date('2025-11-15'));
 * ```
 */
export declare function getTeamAvailability(managerId: string, date: Date): Promise<{
    available: number;
    off: number;
    remote: number;
    total: number;
}>;
/**
 * Gets team time off calendar
 *
 * @param managerId - Manager identifier
 * @param month - Month (1-12)
 * @param year - Year
 * @returns Time off calendar
 *
 * @example
 * ```typescript
 * const calendar = await getTeamTimeOffCalendar('mgr-123', 11, 2025);
 * ```
 */
export declare function getTeamTimeOffCalendar(managerId: string, month: number, year: number): Promise<Array<{
    date: Date;
    employeeId: string;
    employeeName: string;
    type: string;
}>>;
/**
 * Checks team coverage for date range
 *
 * @param managerId - Manager identifier
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Coverage analysis
 *
 * @example
 * ```typescript
 * const coverage = await checkTeamCoverage('mgr-123', new Date('2025-12-20'), new Date('2025-12-31'));
 * ```
 */
export declare function checkTeamCoverage(managerId: string, startDate: Date, endDate: Date): Promise<{
    adequate: boolean;
    minimumCoverage: number;
    dates: Array<{
        date: Date;
        available: number;
    }>;
}>;
/**
 * Creates compensation change request
 *
 * @param managerId - Manager identifier
 * @param employeeId - Employee identifier
 * @param changeData - Change data
 * @returns Created request
 *
 * @example
 * ```typescript
 * const request = await createCompensationChangeRequest('mgr-123', 'emp-456', {
 *   changeType: CompensationChangeType.MERIT_INCREASE,
 *   currentSalary: 80000,
 *   proposedSalary: 88000,
 *   percentageIncrease: 10,
 *   effectiveDate: new Date('2025-01-01'),
 *   justification: 'Excellent performance in 2024',
 *   budgetImpact: 8000
 * });
 * ```
 */
export declare function createCompensationChangeRequest(managerId: string, employeeId: string, changeData: Omit<CompensationChangeRequest, 'id' | 'employeeId' | 'employeeName' | 'requestedBy' | 'status' | 'createdAt' | 'updatedAt'>): Promise<CompensationChangeRequest>;
/**
 * Gets compensation change requests
 *
 * @param managerId - Manager identifier
 * @param status - Optional status filter
 * @returns List of compensation change requests
 *
 * @example
 * ```typescript
 * const requests = await getCompensationChangeRequests('mgr-123', ApprovalStatus.PENDING);
 * ```
 */
export declare function getCompensationChangeRequests(managerId: string, status?: ApprovalStatus): Promise<CompensationChangeRequest[]>;
/**
 * Calculates compensation budget impact
 *
 * @param managerId - Manager identifier
 * @param changes - Array of proposed changes
 * @returns Budget impact
 *
 * @example
 * ```typescript
 * const impact = calculateCompensationBudgetImpact('mgr-123', [
 *   { currentSalary: 80000, proposedSalary: 88000 },
 *   { currentSalary: 75000, proposedSalary: 82000 }
 * ]);
 * ```
 */
export declare function calculateCompensationBudgetImpact(managerId: string, changes: Array<{
    currentSalary: number;
    proposedSalary: number;
}>): {
    totalIncrease: number;
    percentageIncrease: number;
};
/**
 * Gets compensation equity analysis
 *
 * @param managerId - Manager identifier
 * @returns Equity analysis
 *
 * @example
 * ```typescript
 * const analysis = await getCompensationEquityAnalysis('mgr-123');
 * ```
 */
export declare function getCompensationEquityAnalysis(managerId: string): Promise<{
    avgSalaryByRole: Record<string, number>;
    salaryRangeByRole: Record<string, {
        min: number;
        max: number;
    }>;
    equityGaps: Array<{
        employeeId: string;
        role: string;
        salaryDifference: number;
    }>;
}>;
/**
 * Assigns learning course to team member
 *
 * @param managerId - Manager identifier
 * @param employeeId - Employee identifier
 * @param assignmentData - Assignment data
 * @returns Created assignment
 *
 * @example
 * ```typescript
 * const assignment = await assignLearningCourse('mgr-123', 'emp-456', {
 *   courseId: 'course-789',
 *   courseTitle: 'Advanced Leadership',
 *   assignedBy: 'mgr-123',
 *   assignedDate: new Date(),
 *   dueDate: new Date('2025-12-31'),
 *   isRequired: true,
 *   reason: 'Career development',
 *   status: 'assigned'
 * });
 * ```
 */
export declare function assignLearningCourse(managerId: string, employeeId: string, assignmentData: Omit<LearningAssignment, 'id' | 'employeeId' | 'employeeName'>): Promise<LearningAssignment>;
/**
 * Gets team learning assignments
 *
 * @param managerId - Manager identifier
 * @returns List of learning assignments
 *
 * @example
 * ```typescript
 * const assignments = await getTeamLearningAssignments('mgr-123');
 * ```
 */
export declare function getTeamLearningAssignments(managerId: string): Promise<LearningAssignment[]>;
/**
 * Gets team learning completion rate
 *
 * @param managerId - Manager identifier
 * @returns Completion rate
 *
 * @example
 * ```typescript
 * const rate = await getTeamLearningCompletionRate('mgr-123');
 * ```
 */
export declare function getTeamLearningCompletionRate(managerId: string): Promise<{
    completionRate: number;
    totalAssigned: number;
    completed: number;
}>;
/**
 * Schedules one-on-one meeting
 *
 * @param managerId - Manager identifier
 * @param employeeId - Employee identifier
 * @param meetingData - Meeting data
 * @returns Created meeting
 *
 * @example
 * ```typescript
 * const meeting = await scheduleOneOnOne('mgr-123', 'emp-456', {
 *   scheduledDate: new Date('2025-11-15T14:00:00'),
 *   duration: 60,
 *   location: 'Conference Room A',
 *   agenda: ['Career development', 'Project updates', 'Feedback']
 * });
 * ```
 */
export declare function scheduleOneOnOne(managerId: string, employeeId: string, meetingData: Omit<OneOnOneMeeting, 'id' | 'managerId' | 'employeeId' | 'employeeName' | 'status' | 'actionItems' | 'createdAt' | 'updatedAt'>): Promise<OneOnOneMeeting>;
/**
 * Gets upcoming one-on-one meetings
 *
 * @param managerId - Manager identifier
 * @returns List of upcoming meetings
 *
 * @example
 * ```typescript
 * const meetings = await getUpcomingOneOnOnes('mgr-123');
 * ```
 */
export declare function getUpcomingOneOnOnes(managerId: string): Promise<OneOnOneMeeting[]>;
/**
 * Completes one-on-one meeting
 *
 * @param meetingId - Meeting identifier
 * @param notes - Manager notes
 * @param actionItems - Action items
 * @returns Updated meeting
 *
 * @example
 * ```typescript
 * await completeOneOnOne('meeting-123', 'Discussed career goals...', [
 *   { description: 'Update project plan', assignedTo: 'emp-456', dueDate: new Date('2025-11-30') }
 * ]);
 * ```
 */
export declare function completeOneOnOne(meetingId: string, notes: string, actionItems: Omit<MeetingActionItem, 'id' | 'status'>[]): Promise<OneOnOneMeeting>;
/**
 * Gets one-on-one meeting history
 *
 * @param managerId - Manager identifier
 * @param employeeId - Employee identifier
 * @returns Meeting history
 *
 * @example
 * ```typescript
 * const history = await getOneOnOneHistory('mgr-123', 'emp-456');
 * ```
 */
export declare function getOneOnOneHistory(managerId: string, employeeId: string): Promise<OneOnOneMeeting[]>;
/**
 * Gets team analytics
 *
 * @param managerId - Manager identifier
 * @param startDate - Start date for analytics
 * @param endDate - End date for analytics
 * @returns Team analytics
 *
 * @example
 * ```typescript
 * const analytics = await getTeamAnalytics('mgr-123', new Date('2025-01-01'), new Date('2025-12-31'));
 * ```
 */
export declare function getTeamAnalytics(managerId: string, startDate: Date, endDate: Date): Promise<TeamAnalytics>;
/**
 * Gets team productivity metrics
 *
 * @param managerId - Manager identifier
 * @param period - Time period
 * @returns Productivity metrics
 *
 * @example
 * ```typescript
 * const metrics = await getTeamProductivityMetrics('mgr-123', 'monthly');
 * ```
 */
export declare function getTeamProductivityMetrics(managerId: string, period: 'weekly' | 'monthly' | 'quarterly'): Promise<{
    avgHoursWorked: number;
    projectsCompleted: number;
    goalsAchieved: number;
    utilizationRate: number;
}>;
/**
 * Creates delegation
 *
 * @param managerId - Manager identifier
 * @param delegationData - Delegation data
 * @returns Created delegation
 *
 * @example
 * ```typescript
 * const delegation = await createDelegation('mgr-123', {
 *   delegatorName: 'Manager Name',
 *   delegateId: 'emp-456',
 *   delegateName: 'Delegate Name',
 *   type: DelegationType.APPROVALS,
 *   startDate: new Date('2025-12-01'),
 *   endDate: new Date('2025-12-31'),
 *   isActive: true,
 *   reason: 'Holiday coverage'
 * });
 * ```
 */
export declare function createDelegation(managerId: string, delegationData: Omit<Delegation, 'id' | 'delegatorId' | 'createdAt' | 'updatedAt'>): Promise<Delegation>;
/**
 * Gets active delegations
 *
 * @param managerId - Manager identifier
 * @returns List of active delegations
 *
 * @example
 * ```typescript
 * const delegations = await getActiveDelegations('mgr-123');
 * ```
 */
export declare function getActiveDelegations(managerId: string): Promise<Delegation[]>;
/**
 * Revokes delegation
 *
 * @param delegationId - Delegation identifier
 * @returns Updated delegation
 *
 * @example
 * ```typescript
 * await revokeDelegation('delegation-123');
 * ```
 */
export declare function revokeDelegation(delegationId: string): Promise<Delegation>;
/**
 * Gets delegated tasks
 *
 * @param delegateId - Delegate identifier
 * @returns List of delegated tasks
 *
 * @example
 * ```typescript
 * const tasks = await getDelegatedTasks('emp-456');
 * ```
 */
export declare function getDelegatedTasks(delegateId: string): Promise<Array<{
    taskType: string;
    count: number;
}>>;
/**
 * Manager Self-Service Controller
 * Provides RESTful API endpoints for manager self-service operations
 */
export declare class ManagerSelfServiceController {
    /**
     * Get team overview
     */
    getTeam(managerId: string): Promise<TeamOverview>;
    /**
     * Get pending approvals
     */
    getApprovals(managerId: string, type?: ApprovalType): Promise<ApprovalRequest[]>;
    /**
     * Approve request
     */
    approve(requestId: string, approvalDto: ApprovalDecisionDto): Promise<ApprovalRequest>;
    /**
     * Get team performance reviews
     */
    getPerformanceReviews(managerId: string, reviewCycleId: string): Promise<TeamPerformanceReview[]>;
    /**
     * Get team goals
     */
    getGoals(managerId: string): Promise<TeamGoal[]>;
    /**
     * Create team goal
     */
    createGoal(managerId: string, createDto: CreateTeamGoalDto): Promise<TeamGoal>;
}
//# sourceMappingURL=manager-self-service-kit.d.ts.map