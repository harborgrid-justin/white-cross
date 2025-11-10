/**
 * LOC: HCM_PERF_MGT_001
 * File: /reuse/server/human-capital/performance-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - zod
 *   - i18next
 *
 * DOWNSTREAM (imported by):
 *   - Performance review services
 *   - 360 feedback implementations
 *   - Talent management systems
 *   - HR analytics & reporting
 *   - Compensation planning services
 *   - Development planning modules
 */
import { Model } from 'sequelize-typescript';
import { Transaction } from 'sequelize';
/**
 * Performance review cycle type
 */
export declare enum ReviewCycleType {
    ANNUAL = "annual",
    MID_YEAR = "mid_year",
    QUARTERLY = "quarterly",
    PROBATION = "probation",
    PROJECT_END = "project_end",
    AD_HOC = "ad_hoc"
}
/**
 * Review status enumeration
 */
export declare enum ReviewStatus {
    NOT_STARTED = "not_started",
    SELF_ASSESSMENT = "self_assessment",
    MANAGER_REVIEW = "manager_review",
    CALIBRATION = "calibration",
    PEER_REVIEW = "peer_review",
    SKIP_LEVEL = "skip_level",
    HR_REVIEW = "hr_review",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
/**
 * Rating scale type
 */
export declare enum RatingScaleType {
    NUMERIC_5_POINT = "numeric_5_point",
    NUMERIC_7_POINT = "numeric_7_point",
    NUMERIC_10_POINT = "numeric_10_point",
    BEHAVIORAL = "behavioral",
    COMPETENCY = "competency",
    CUSTOM = "custom"
}
/**
 * Performance rating enumeration
 */
export declare enum PerformanceRating {
    OUTSTANDING = "outstanding",
    EXCEEDS_EXPECTATIONS = "exceeds_expectations",
    MEETS_EXPECTATIONS = "meets_expectations",
    NEEDS_IMPROVEMENT = "needs_improvement",
    UNSATISFACTORY = "unsatisfactory"
}
/**
 * Feedback type enumeration
 */
export declare enum FeedbackType {
    PRAISE = "praise",
    CONSTRUCTIVE = "constructive",
    DEVELOPMENTAL = "developmental",
    COACHING = "coaching",
    RECOGNITION = "recognition"
}
/**
 * Feedback visibility
 */
export declare enum FeedbackVisibility {
    PRIVATE = "private",
    MANAGER = "manager",
    EMPLOYEE = "employee",
    PUBLIC = "public"
}
/**
 * PIP status enumeration
 */
export declare enum PIPStatus {
    DRAFT = "draft",
    ACTIVE = "active",
    IN_PROGRESS = "in_progress",
    SUCCESSFUL = "successful",
    UNSUCCESSFUL = "unsuccessful",
    CANCELLED = "cancelled"
}
/**
 * Competency category
 */
export declare enum CompetencyCategory {
    LEADERSHIP = "leadership",
    TECHNICAL = "technical",
    BEHAVIORAL = "behavioral",
    FUNCTIONAL = "functional",
    CORE = "core"
}
/**
 * Calibration session status
 */
export declare enum CalibrationStatus {
    SCHEDULED = "scheduled",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
/**
 * 360 feedback status
 */
export declare enum Feedback360Status {
    PENDING = "pending",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    DECLINED = "declined"
}
/**
 * Performance review interface
 */
export interface PerformanceReview {
    id: string;
    employeeId: string;
    reviewerId: string;
    cycleId: string;
    reviewType: ReviewCycleType;
    reviewPeriodStart: Date;
    reviewPeriodEnd: Date;
    status: ReviewStatus;
    overallRating?: PerformanceRating;
    overallScore?: number;
    selfAssessmentCompleted: boolean;
    managerAssessmentCompleted: boolean;
    calibrationCompleted: boolean;
    finalizedAt?: Date;
    finalizedBy?: string;
    metadata?: Record<string, any>;
}
/**
 * Review section interface
 */
export interface ReviewSection {
    id: string;
    reviewId: string;
    sectionName: string;
    sectionOrder: number;
    weight: number;
    rating?: PerformanceRating;
    score?: number;
    comments?: string;
    competencies?: string[];
    evidence?: string[];
}
/**
 * 360 Feedback request interface
 */
export interface Feedback360Request {
    id: string;
    employeeId: string;
    reviewId: string;
    requesterId: string;
    respondentId: string;
    respondentType: 'peer' | 'manager' | 'direct_report' | 'skip_level' | 'external';
    status: Feedback360Status;
    requestedAt: Date;
    completedAt?: Date;
    dueDate: Date;
    anonymousResponse: boolean;
}
/**
 * Continuous feedback interface
 */
export interface ContinuousFeedback {
    id: string;
    employeeId: string;
    giverId: string;
    feedbackType: FeedbackType;
    visibility: FeedbackVisibility;
    content: string;
    relatedGoalId?: string;
    relatedProjectId?: string;
    acknowledgedAt?: Date;
    isAnonymous: boolean;
    tags?: string[];
}
/**
 * Performance Improvement Plan interface
 */
export interface PerformanceImprovementPlan {
    id: string;
    employeeId: string;
    managerId: string;
    status: PIPStatus;
    startDate: Date;
    endDate: Date;
    reviewDate: Date;
    performanceIssues: string[];
    expectedImprovements: string[];
    supportProvided: string[];
    successCriteria: string[];
    outcome?: string;
    hrApprovalBy?: string;
    hrApprovalAt?: Date;
}
/**
 * Competency assessment interface
 */
export interface CompetencyAssessment {
    id: string;
    reviewId: string;
    competencyId: string;
    competencyName: string;
    category: CompetencyCategory;
    expectedLevel: number;
    currentLevel: number;
    rating?: PerformanceRating;
    assessorComments?: string;
    employeeComments?: string;
    developmentActions?: string[];
}
/**
 * Calibration session interface
 */
export interface CalibrationSession {
    id: string;
    name: string;
    cycleId: string;
    facilitatorId: string;
    status: CalibrationStatus;
    scheduledDate: Date;
    completedDate?: Date;
    participants: string[];
    reviewsDiscussed: string[];
    ratingAdjustments: Array<{
        reviewId: string;
        oldRating: PerformanceRating;
        newRating: PerformanceRating;
        reason: string;
    }>;
    notes?: string;
}
/**
 * Performance review validation schema
 */
export declare const PerformanceReviewSchema: any;
/**
 * Review section validation schema
 */
export declare const ReviewSectionSchema: any;
/**
 * 360 Feedback request validation schema
 */
export declare const Feedback360RequestSchema: any;
/**
 * Continuous feedback validation schema
 */
export declare const ContinuousFeedbackSchema: any;
/**
 * Performance Improvement Plan validation schema
 */
export declare const PIPSchema: any;
/**
 * Competency assessment validation schema
 */
export declare const CompetencyAssessmentSchema: any;
/**
 * Calibration session validation schema
 */
export declare const CalibrationSessionSchema: any;
/**
 * Performance Review Cycle Model
 */
export declare class PerformanceReviewCycleModel extends Model {
    id: string;
    name: string;
    cycleType: ReviewCycleType;
    cycleYear: number;
    startDate: Date;
    endDate: Date;
    selfAssessmentDeadline: Date;
    managerReviewDeadline: Date;
    calibrationDeadline: Date;
    status: string;
    description: string;
    configuration: Record<string, any>;
    reviews: PerformanceReviewModel[];
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
/**
 * Performance Review Model
 */
export declare class PerformanceReviewModel extends Model {
    id: string;
    cycleId: string;
    employeeId: string;
    reviewerId: string;
    reviewType: ReviewCycleType;
    reviewPeriodStart: Date;
    reviewPeriodEnd: Date;
    status: ReviewStatus;
    overallRating: PerformanceRating;
    overallScore: number;
    selfAssessmentCompleted: boolean;
    managerAssessmentCompleted: boolean;
    calibrationCompleted: boolean;
    managerComments: string;
    employeeComments: string;
    hrComments: string;
    finalizedAt: Date;
    finalizedBy: string;
    metadata: Record<string, any>;
    cycle: PerformanceReviewCycleModel;
    sections: ReviewSectionModel[];
    feedback360Requests: Feedback360RequestModel[];
    competencyAssessments: CompetencyAssessmentModel[];
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
/**
 * Review Section Model
 */
export declare class ReviewSectionModel extends Model {
    id: string;
    reviewId: string;
    sectionName: string;
    sectionOrder: number;
    weight: number;
    rating: PerformanceRating;
    score: number;
    comments: string;
    competencies: string[];
    evidence: string[];
    review: PerformanceReviewModel;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
/**
 * 360 Feedback Request Model
 */
export declare class Feedback360RequestModel extends Model {
    id: string;
    employeeId: string;
    reviewId: string;
    requesterId: string;
    respondentId: string;
    respondentType: string;
    status: Feedback360Status;
    requestedAt: Date;
    completedAt: Date;
    dueDate: Date;
    anonymousResponse: boolean;
    responses: Record<string, any>;
    review: PerformanceReviewModel;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Continuous Feedback Model
 */
export declare class ContinuousFeedbackModel extends Model {
    id: string;
    employeeId: string;
    giverId: string;
    feedbackType: FeedbackType;
    visibility: FeedbackVisibility;
    content: string;
    relatedGoalId: string;
    relatedProjectId: string;
    acknowledgedAt: Date;
    isAnonymous: boolean;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
/**
 * Performance Improvement Plan Model
 */
export declare class PerformanceImprovementPlanModel extends Model {
    id: string;
    employeeId: string;
    managerId: string;
    status: PIPStatus;
    startDate: Date;
    endDate: Date;
    reviewDate: Date;
    performanceIssues: string[];
    expectedImprovements: string[];
    supportProvided: string[];
    successCriteria: string[];
    outcome: string;
    hrApprovalBy: string;
    hrApprovalAt: Date;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
/**
 * Competency Model
 */
export declare class CompetencyModel extends Model {
    id: string;
    code: string;
    name: string;
    description: string;
    category: CompetencyCategory;
    levelDefinitions: Record<string, any>;
    isActive: boolean;
    assessments: CompetencyAssessmentModel[];
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
/**
 * Competency Assessment Model
 */
export declare class CompetencyAssessmentModel extends Model {
    id: string;
    reviewId: string;
    competencyId: string;
    competencyName: string;
    category: CompetencyCategory;
    expectedLevel: number;
    currentLevel: number;
    rating: PerformanceRating;
    assessorComments: string;
    employeeComments: string;
    developmentActions: string[];
    review: PerformanceReviewModel;
    competency: CompetencyModel;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
/**
 * Calibration Session Model
 */
export declare class CalibrationSessionModel extends Model {
    id: string;
    name: string;
    cycleId: string;
    facilitatorId: string;
    status: CalibrationStatus;
    scheduledDate: Date;
    completedDate: Date;
    participants: string[];
    reviewsDiscussed: string[];
    ratingAdjustments: Array<{
        reviewId: string;
        oldRating: PerformanceRating;
        newRating: PerformanceRating;
        reason: string;
    }>;
    notes: string;
    cycle: PerformanceReviewCycleModel;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Create performance review cycle
 *
 * @param cycleData - Review cycle data
 * @param transaction - Optional transaction
 * @returns Created review cycle
 *
 * @example
 * ```typescript
 * const cycle = await createReviewCycle({
 *   name: '2024 Annual Review',
 *   cycleType: ReviewCycleType.ANNUAL,
 *   cycleYear: 2024,
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31'),
 * });
 * ```
 */
export declare function createReviewCycle(cycleData: {
    name: string;
    cycleType: ReviewCycleType;
    cycleYear: number;
    startDate: Date;
    endDate: Date;
    selfAssessmentDeadline?: Date;
    managerReviewDeadline?: Date;
    calibrationDeadline?: Date;
    description?: string;
    configuration?: Record<string, any>;
}, transaction?: Transaction): Promise<PerformanceReviewCycleModel>;
/**
 * Create performance review
 *
 * @param reviewData - Performance review data
 * @param transaction - Optional transaction
 * @returns Created performance review
 *
 * @example
 * ```typescript
 * const review = await createPerformanceReview({
 *   employeeId: 'emp-uuid',
 *   reviewerId: 'manager-uuid',
 *   cycleId: 'cycle-uuid',
 *   reviewType: ReviewCycleType.ANNUAL,
 *   reviewPeriodStart: new Date('2024-01-01'),
 *   reviewPeriodEnd: new Date('2024-12-31'),
 * });
 * ```
 */
export declare function createPerformanceReview(reviewData: Partial<PerformanceReview>, transaction?: Transaction): Promise<PerformanceReviewModel>;
/**
 * Update performance review
 *
 * @param reviewId - Review ID
 * @param updates - Fields to update
 * @param transaction - Optional transaction
 * @returns Updated review
 *
 * @example
 * ```typescript
 * await updatePerformanceReview('review-uuid', {
 *   status: ReviewStatus.MANAGER_REVIEW,
 *   managerAssessmentCompleted: true,
 * });
 * ```
 */
export declare function updatePerformanceReview(reviewId: string, updates: Partial<PerformanceReview>, transaction?: Transaction): Promise<PerformanceReviewModel>;
/**
 * Get performance review by ID
 *
 * @param reviewId - Review ID
 * @param includeRelations - Include related data
 * @returns Performance review or null
 *
 * @example
 * ```typescript
 * const review = await getPerformanceReviewById('review-uuid', true);
 * ```
 */
export declare function getPerformanceReviewById(reviewId: string, includeRelations?: boolean): Promise<PerformanceReviewModel | null>;
/**
 * Get employee performance reviews
 *
 * @param employeeId - Employee ID
 * @param filters - Optional filters
 * @returns Array of performance reviews
 *
 * @example
 * ```typescript
 * const reviews = await getEmployeePerformanceReviews('emp-uuid', {
 *   status: ReviewStatus.COMPLETED,
 *   limit: 10,
 * });
 * ```
 */
export declare function getEmployeePerformanceReviews(employeeId: string, filters?: {
    cycleId?: string;
    status?: ReviewStatus;
    reviewType?: ReviewCycleType;
    limit?: number;
    offset?: number;
}): Promise<PerformanceReviewModel[]>;
/**
 * Finalize performance review
 *
 * @param reviewId - Review ID
 * @param finalizedBy - User finalizing review
 * @param overallRating - Overall performance rating
 * @param overallScore - Overall performance score
 * @param transaction - Optional transaction
 * @returns Finalized review
 *
 * @example
 * ```typescript
 * await finalizePerformanceReview('review-uuid', 'hr-uuid',
 *   PerformanceRating.EXCEEDS_EXPECTATIONS, 85);
 * ```
 */
export declare function finalizePerformanceReview(reviewId: string, finalizedBy: string, overallRating: PerformanceRating, overallScore: number, transaction?: Transaction): Promise<PerformanceReviewModel>;
/**
 * Add review section
 *
 * @param sectionData - Review section data
 * @param transaction - Optional transaction
 * @returns Created review section
 *
 * @example
 * ```typescript
 * const section = await addReviewSection({
 *   reviewId: 'review-uuid',
 *   sectionName: 'Job Knowledge',
 *   sectionOrder: 1,
 *   weight: 25,
 * });
 * ```
 */
export declare function addReviewSection(sectionData: Partial<ReviewSection>, transaction?: Transaction): Promise<ReviewSectionModel>;
/**
 * Update review section
 *
 * @param sectionId - Section ID
 * @param updates - Fields to update
 * @param transaction - Optional transaction
 * @returns Updated section
 *
 * @example
 * ```typescript
 * await updateReviewSection('section-uuid', {
 *   rating: PerformanceRating.EXCEEDS_EXPECTATIONS,
 *   score: 90,
 *   comments: 'Excellent performance in this area',
 * });
 * ```
 */
export declare function updateReviewSection(sectionId: string, updates: Partial<ReviewSection>, transaction?: Transaction): Promise<ReviewSectionModel>;
/**
 * Get review sections
 *
 * @param reviewId - Review ID
 * @returns Array of review sections
 *
 * @example
 * ```typescript
 * const sections = await getReviewSections('review-uuid');
 * ```
 */
export declare function getReviewSections(reviewId: string): Promise<ReviewSectionModel[]>;
/**
 * Calculate overall review score
 *
 * @param reviewId - Review ID
 * @returns Calculated overall score
 *
 * @example
 * ```typescript
 * const score = await calculateOverallScore('review-uuid');
 * ```
 */
export declare function calculateOverallScore(reviewId: string): Promise<number>;
/**
 * Create 360 feedback request
 *
 * @param requestData - Feedback request data
 * @param transaction - Optional transaction
 * @returns Created feedback request
 *
 * @example
 * ```typescript
 * const request = await create360FeedbackRequest({
 *   employeeId: 'emp-uuid',
 *   reviewId: 'review-uuid',
 *   requesterId: 'manager-uuid',
 *   respondentId: 'peer-uuid',
 *   respondentType: 'peer',
 *   dueDate: new Date('2024-03-31'),
 * });
 * ```
 */
export declare function create360FeedbackRequest(requestData: Partial<Feedback360Request>, transaction?: Transaction): Promise<Feedback360RequestModel>;
/**
 * Submit 360 feedback response
 *
 * @param requestId - Request ID
 * @param responses - Feedback responses
 * @param transaction - Optional transaction
 * @returns Updated feedback request
 *
 * @example
 * ```typescript
 * await submit360FeedbackResponse('request-uuid', {
 *   competencyRatings: { leadership: 4, communication: 5 },
 *   strengths: 'Great communicator...',
 *   areasForImprovement: 'Could improve...',
 * });
 * ```
 */
export declare function submit360FeedbackResponse(requestId: string, responses: Record<string, any>, transaction?: Transaction): Promise<Feedback360RequestModel>;
/**
 * Get 360 feedback requests for employee
 *
 * @param employeeId - Employee ID
 * @param filters - Optional filters
 * @returns Array of feedback requests
 *
 * @example
 * ```typescript
 * const requests = await get360FeedbackRequests('emp-uuid', {
 *   status: Feedback360Status.PENDING,
 * });
 * ```
 */
export declare function get360FeedbackRequests(employeeId: string, filters?: {
    reviewId?: string;
    status?: Feedback360Status;
    respondentType?: string;
}): Promise<Feedback360RequestModel[]>;
/**
 * Get 360 feedback requests for respondent
 *
 * @param respondentId - Respondent ID
 * @param filters - Optional filters
 * @returns Array of feedback requests
 *
 * @example
 * ```typescript
 * const requests = await get360FeedbackRequestsForRespondent('user-uuid', {
 *   status: Feedback360Status.PENDING,
 * });
 * ```
 */
export declare function get360FeedbackRequestsForRespondent(respondentId: string, filters?: {
    status?: Feedback360Status;
}): Promise<Feedback360RequestModel[]>;
/**
 * Aggregate 360 feedback for review
 *
 * @param reviewId - Review ID
 * @returns Aggregated feedback data
 *
 * @example
 * ```typescript
 * const aggregated = await aggregate360Feedback('review-uuid');
 * ```
 */
export declare function aggregate360Feedback(reviewId: string): Promise<Record<string, any>>;
/**
 * Create continuous feedback
 *
 * @param feedbackData - Feedback data
 * @param transaction - Optional transaction
 * @returns Created feedback
 *
 * @example
 * ```typescript
 * const feedback = await createContinuousFeedback({
 *   employeeId: 'emp-uuid',
 *   giverId: 'manager-uuid',
 *   feedbackType: FeedbackType.PRAISE,
 *   visibility: FeedbackVisibility.EMPLOYEE,
 *   content: 'Great work on the project!',
 * });
 * ```
 */
export declare function createContinuousFeedback(feedbackData: Partial<ContinuousFeedback>, transaction?: Transaction): Promise<ContinuousFeedbackModel>;
/**
 * Get employee continuous feedback
 *
 * @param employeeId - Employee ID
 * @param filters - Optional filters
 * @returns Array of feedback items
 *
 * @example
 * ```typescript
 * const feedback = await getEmployeeContinuousFeedback('emp-uuid', {
 *   feedbackType: FeedbackType.PRAISE,
 *   limit: 20,
 * });
 * ```
 */
export declare function getEmployeeContinuousFeedback(employeeId: string, filters?: {
    feedbackType?: FeedbackType;
    giverId?: string;
    visibility?: FeedbackVisibility;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
}): Promise<ContinuousFeedbackModel[]>;
/**
 * Acknowledge feedback
 *
 * @param feedbackId - Feedback ID
 * @param transaction - Optional transaction
 * @returns Updated feedback
 *
 * @example
 * ```typescript
 * await acknowledgeFeedback('feedback-uuid');
 * ```
 */
export declare function acknowledgeFeedback(feedbackId: string, transaction?: Transaction): Promise<ContinuousFeedbackModel>;
/**
 * Get feedback statistics
 *
 * @param employeeId - Employee ID
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Feedback statistics
 *
 * @example
 * ```typescript
 * const stats = await getFeedbackStatistics('emp-uuid',
 *   new Date('2024-01-01'), new Date('2024-12-31'));
 * ```
 */
export declare function getFeedbackStatistics(employeeId: string, startDate: Date, endDate: Date): Promise<{
    totalFeedback: number;
    byType: Record<FeedbackType, number>;
    byVisibility: Record<FeedbackVisibility, number>;
    acknowledgedCount: number;
}>;
/**
 * Create Performance Improvement Plan
 *
 * @param pipData - PIP data
 * @param transaction - Optional transaction
 * @returns Created PIP
 *
 * @example
 * ```typescript
 * const pip = await createPerformanceImprovementPlan({
 *   employeeId: 'emp-uuid',
 *   managerId: 'manager-uuid',
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-03-31'),
 *   reviewDate: new Date('2024-02-15'),
 *   performanceIssues: ['Issue 1', 'Issue 2'],
 *   expectedImprovements: ['Improvement 1', 'Improvement 2'],
 *   supportProvided: ['Training', 'Mentoring'],
 *   successCriteria: ['Criteria 1', 'Criteria 2'],
 * });
 * ```
 */
export declare function createPerformanceImprovementPlan(pipData: Partial<PerformanceImprovementPlan>, transaction?: Transaction): Promise<PerformanceImprovementPlanModel>;
/**
 * Update PIP status
 *
 * @param pipId - PIP ID
 * @param status - New status
 * @param outcome - Outcome description (if completed)
 * @param transaction - Optional transaction
 * @returns Updated PIP
 *
 * @example
 * ```typescript
 * await updatePIPStatus('pip-uuid', PIPStatus.SUCCESSFUL,
 *   'Employee met all success criteria');
 * ```
 */
export declare function updatePIPStatus(pipId: string, status: PIPStatus, outcome?: string, transaction?: Transaction): Promise<PerformanceImprovementPlanModel>;
/**
 * Approve PIP (HR approval)
 *
 * @param pipId - PIP ID
 * @param hrUserId - HR user approving
 * @param transaction - Optional transaction
 * @returns Updated PIP
 *
 * @example
 * ```typescript
 * await approvePIP('pip-uuid', 'hr-uuid');
 * ```
 */
export declare function approvePIP(pipId: string, hrUserId: string, transaction?: Transaction): Promise<PerformanceImprovementPlanModel>;
/**
 * Get employee PIPs
 *
 * @param employeeId - Employee ID
 * @param includeCompleted - Include completed PIPs
 * @returns Array of PIPs
 *
 * @example
 * ```typescript
 * const pips = await getEmployeePIPs('emp-uuid', true);
 * ```
 */
export declare function getEmployeePIPs(employeeId: string, includeCompleted?: boolean): Promise<PerformanceImprovementPlanModel[]>;
/**
 * Get active PIPs for manager
 *
 * @param managerId - Manager ID
 * @returns Array of active PIPs
 *
 * @example
 * ```typescript
 * const pips = await getActivePIPsForManager('manager-uuid');
 * ```
 */
export declare function getActivePIPsForManager(managerId: string): Promise<PerformanceImprovementPlanModel[]>;
/**
 * Create competency
 *
 * @param competencyData - Competency data
 * @param transaction - Optional transaction
 * @returns Created competency
 *
 * @example
 * ```typescript
 * const competency = await createCompetency({
 *   code: 'LEAD-001',
 *   name: 'Strategic Leadership',
 *   category: CompetencyCategory.LEADERSHIP,
 *   description: 'Ability to set and communicate vision...',
 * });
 * ```
 */
export declare function createCompetency(competencyData: {
    code: string;
    name: string;
    description?: string;
    category: CompetencyCategory;
    levelDefinitions?: Record<string, any>;
}, transaction?: Transaction): Promise<CompetencyModel>;
/**
 * Add competency assessment to review
 *
 * @param assessmentData - Assessment data
 * @param transaction - Optional transaction
 * @returns Created assessment
 *
 * @example
 * ```typescript
 * const assessment = await addCompetencyAssessment({
 *   reviewId: 'review-uuid',
 *   competencyId: 'comp-uuid',
 *   competencyName: 'Strategic Leadership',
 *   category: CompetencyCategory.LEADERSHIP,
 *   expectedLevel: 4,
 *   currentLevel: 3,
 * });
 * ```
 */
export declare function addCompetencyAssessment(assessmentData: Partial<CompetencyAssessment>, transaction?: Transaction): Promise<CompetencyAssessmentModel>;
/**
 * Update competency assessment
 *
 * @param assessmentId - Assessment ID
 * @param updates - Fields to update
 * @param transaction - Optional transaction
 * @returns Updated assessment
 *
 * @example
 * ```typescript
 * await updateCompetencyAssessment('assessment-uuid', {
 *   currentLevel: 4,
 *   rating: PerformanceRating.EXCEEDS_EXPECTATIONS,
 *   assessorComments: 'Showing strong improvement',
 * });
 * ```
 */
export declare function updateCompetencyAssessment(assessmentId: string, updates: Partial<CompetencyAssessment>, transaction?: Transaction): Promise<CompetencyAssessmentModel>;
/**
 * Get competency assessments for review
 *
 * @param reviewId - Review ID
 * @returns Array of competency assessments
 *
 * @example
 * ```typescript
 * const assessments = await getCompetencyAssessments('review-uuid');
 * ```
 */
export declare function getCompetencyAssessments(reviewId: string): Promise<CompetencyAssessmentModel[]>;
/**
 * Get competency gap analysis
 *
 * @param reviewId - Review ID
 * @returns Competency gap analysis
 *
 * @example
 * ```typescript
 * const gaps = await getCompetencyGapAnalysis('review-uuid');
 * ```
 */
export declare function getCompetencyGapAnalysis(reviewId: string): Promise<Array<{
    competencyId: string;
    competencyName: string;
    category: CompetencyCategory;
    expectedLevel: number;
    currentLevel: number;
    gap: number;
    developmentPriority: 'high' | 'medium' | 'low';
}>>;
/**
 * Create calibration session
 *
 * @param sessionData - Session data
 * @param transaction - Optional transaction
 * @returns Created session
 *
 * @example
 * ```typescript
 * const session = await createCalibrationSession({
 *   name: 'Engineering Team Calibration',
 *   cycleId: 'cycle-uuid',
 *   facilitatorId: 'hr-uuid',
 *   scheduledDate: new Date('2024-03-15'),
 *   participants: ['manager1-uuid', 'manager2-uuid'],
 *   reviewsDiscussed: ['review1-uuid', 'review2-uuid'],
 * });
 * ```
 */
export declare function createCalibrationSession(sessionData: Partial<CalibrationSession>, transaction?: Transaction): Promise<CalibrationSessionModel>;
/**
 * Update calibration session
 *
 * @param sessionId - Session ID
 * @param updates - Fields to update
 * @param transaction - Optional transaction
 * @returns Updated session
 *
 * @example
 * ```typescript
 * await updateCalibrationSession('session-uuid', {
 *   status: CalibrationStatus.COMPLETED,
 *   completedDate: new Date(),
 * });
 * ```
 */
export declare function updateCalibrationSession(sessionId: string, updates: Partial<CalibrationSession>, transaction?: Transaction): Promise<CalibrationSessionModel>;
/**
 * Add rating adjustment in calibration
 *
 * @param sessionId - Session ID
 * @param reviewId - Review ID
 * @param oldRating - Old rating
 * @param newRating - New rating
 * @param reason - Reason for adjustment
 * @param transaction - Optional transaction
 * @returns Updated session
 *
 * @example
 * ```typescript
 * await addRatingAdjustment('session-uuid', 'review-uuid',
 *   PerformanceRating.MEETS_EXPECTATIONS,
 *   PerformanceRating.EXCEEDS_EXPECTATIONS,
 *   'Performance was underrated compared to peers');
 * ```
 */
export declare function addRatingAdjustment(sessionId: string, reviewId: string, oldRating: PerformanceRating, newRating: PerformanceRating, reason: string, transaction?: Transaction): Promise<CalibrationSessionModel>;
/**
 * Get calibration sessions for cycle
 *
 * @param cycleId - Cycle ID
 * @returns Array of calibration sessions
 *
 * @example
 * ```typescript
 * const sessions = await getCalibrationSessions('cycle-uuid');
 * ```
 */
export declare function getCalibrationSessions(cycleId: string): Promise<CalibrationSessionModel[]>;
/**
 * Complete calibration session
 *
 * @param sessionId - Session ID
 * @param notes - Session notes
 * @param transaction - Optional transaction
 * @returns Completed session
 *
 * @example
 * ```typescript
 * await completeCalibrationSession('session-uuid',
 *   'All ratings reviewed and adjusted as needed');
 * ```
 */
export declare function completeCalibrationSession(sessionId: string, notes?: string, transaction?: Transaction): Promise<CalibrationSessionModel>;
/**
 * Get performance distribution for cycle
 *
 * @param cycleId - Cycle ID
 * @returns Performance rating distribution
 *
 * @example
 * ```typescript
 * const distribution = await getPerformanceDistribution('cycle-uuid');
 * ```
 */
export declare function getPerformanceDistribution(cycleId: string): Promise<Record<PerformanceRating, {
    count: number;
    percentage: number;
}>>;
/**
 * Get review completion statistics
 *
 * @param cycleId - Cycle ID
 * @returns Completion statistics
 *
 * @example
 * ```typescript
 * const stats = await getReviewCompletionStats('cycle-uuid');
 * ```
 */
export declare function getReviewCompletionStats(cycleId: string): Promise<{
    total: number;
    notStarted: number;
    inProgress: number;
    completed: number;
    completionRate: number;
    selfAssessmentCompleted: number;
    managerAssessmentCompleted: number;
    calibrationCompleted: number;
}>;
/**
 * Get manager performance summary
 *
 * @param managerId - Manager ID
 * @param cycleId - Cycle ID
 * @returns Performance summary for manager's team
 *
 * @example
 * ```typescript
 * const summary = await getManagerPerformanceSummary('manager-uuid', 'cycle-uuid');
 * ```
 */
export declare function getManagerPerformanceSummary(managerId: string, cycleId: string): Promise<{
    totalReviews: number;
    completedReviews: number;
    averageScore: number;
    ratingDistribution: Record<PerformanceRating, number>;
    topPerformers: Array<{
        employeeId: string;
        rating: PerformanceRating;
        score: number;
    }>;
    needsImprovement: Array<{
        employeeId: string;
        rating: PerformanceRating;
        score: number;
    }>;
}>;
export declare class PerformanceManagementService {
    createReviewCycle(data: any, transaction?: Transaction): Promise<PerformanceReviewCycleModel>;
    createPerformanceReview(data: any, transaction?: Transaction): Promise<PerformanceReviewModel>;
    updatePerformanceReview(id: string, data: any, transaction?: Transaction): Promise<PerformanceReviewModel>;
    getPerformanceReviewById(id: string, includeRelations?: boolean): Promise<PerformanceReviewModel | null>;
    getEmployeePerformanceReviews(employeeId: string, filters?: any): Promise<PerformanceReviewModel[]>;
    finalizePerformanceReview(id: string, finalizedBy: string, rating: PerformanceRating, score: number, transaction?: Transaction): Promise<PerformanceReviewModel>;
    addReviewSection(data: any, transaction?: Transaction): Promise<ReviewSectionModel>;
    updateReviewSection(id: string, data: any, transaction?: Transaction): Promise<ReviewSectionModel>;
    getReviewSections(reviewId: string): Promise<ReviewSectionModel[]>;
    calculateOverallScore(reviewId: string): Promise<number>;
    create360FeedbackRequest(data: any, transaction?: Transaction): Promise<Feedback360RequestModel>;
    submit360FeedbackResponse(id: string, responses: any, transaction?: Transaction): Promise<Feedback360RequestModel>;
    get360FeedbackRequests(employeeId: string, filters?: any): Promise<Feedback360RequestModel[]>;
    get360FeedbackRequestsForRespondent(respondentId: string, filters?: any): Promise<Feedback360RequestModel[]>;
    aggregate360Feedback(reviewId: string): Promise<Record<string, any>>;
    createContinuousFeedback(data: any, transaction?: Transaction): Promise<ContinuousFeedbackModel>;
    getEmployeeContinuousFeedback(employeeId: string, filters?: any): Promise<ContinuousFeedbackModel[]>;
    acknowledgeFeedback(id: string, transaction?: Transaction): Promise<ContinuousFeedbackModel>;
    getFeedbackStatistics(employeeId: string, startDate: Date, endDate: Date): Promise<{
        totalFeedback: number;
        byType: Record<FeedbackType, number>;
        byVisibility: Record<FeedbackVisibility, number>;
        acknowledgedCount: number;
    }>;
    createPerformanceImprovementPlan(data: any, transaction?: Transaction): Promise<PerformanceImprovementPlanModel>;
    updatePIPStatus(id: string, status: PIPStatus, outcome?: string, transaction?: Transaction): Promise<PerformanceImprovementPlanModel>;
    approvePIP(id: string, hrUserId: string, transaction?: Transaction): Promise<PerformanceImprovementPlanModel>;
    getEmployeePIPs(employeeId: string, includeCompleted?: boolean): Promise<PerformanceImprovementPlanModel[]>;
    getActivePIPsForManager(managerId: string): Promise<PerformanceImprovementPlanModel[]>;
    createCompetency(data: any, transaction?: Transaction): Promise<CompetencyModel>;
    addCompetencyAssessment(data: any, transaction?: Transaction): Promise<CompetencyAssessmentModel>;
    updateCompetencyAssessment(id: string, data: any, transaction?: Transaction): Promise<CompetencyAssessmentModel>;
    getCompetencyAssessments(reviewId: string): Promise<CompetencyAssessmentModel[]>;
    getCompetencyGapAnalysis(reviewId: string): Promise<{
        competencyId: string;
        competencyName: string;
        category: CompetencyCategory;
        expectedLevel: number;
        currentLevel: number;
        gap: number;
        developmentPriority: "high" | "medium" | "low";
    }[]>;
    createCalibrationSession(data: any, transaction?: Transaction): Promise<CalibrationSessionModel>;
    updateCalibrationSession(id: string, data: any, transaction?: Transaction): Promise<CalibrationSessionModel>;
    addRatingAdjustment(sessionId: string, reviewId: string, oldRating: PerformanceRating, newRating: PerformanceRating, reason: string, transaction?: Transaction): Promise<CalibrationSessionModel>;
    getCalibrationSessions(cycleId: string): Promise<CalibrationSessionModel[]>;
    completeCalibrationSession(id: string, notes?: string, transaction?: Transaction): Promise<CalibrationSessionModel>;
    getPerformanceDistribution(cycleId: string): Promise<Record<PerformanceRating, {
        count: number;
        percentage: number;
    }>>;
    getReviewCompletionStats(cycleId: string): Promise<{
        total: number;
        notStarted: number;
        inProgress: number;
        completed: number;
        completionRate: number;
        selfAssessmentCompleted: number;
        managerAssessmentCompleted: number;
        calibrationCompleted: number;
    }>;
    getManagerPerformanceSummary(managerId: string, cycleId: string): Promise<{
        totalReviews: number;
        completedReviews: number;
        averageScore: number;
        ratingDistribution: Record<PerformanceRating, number>;
        topPerformers: Array<{
            employeeId: string;
            rating: PerformanceRating;
            score: number;
        }>;
        needsImprovement: Array<{
            employeeId: string;
            rating: PerformanceRating;
            score: number;
        }>;
    }>;
}
export declare class PerformanceManagementController {
    private readonly service;
    constructor(service: PerformanceManagementService);
    createReviewCycle(data: any): Promise<PerformanceReviewCycleModel>;
    createReview(data: any): Promise<PerformanceReviewModel>;
    getReview(id: string, includeRelations?: boolean): Promise<PerformanceReviewModel | null>;
    updateReview(id: string, data: any): Promise<PerformanceReviewModel>;
    finalizeReview(id: string, data: any): Promise<PerformanceReviewModel>;
    getEmployeeReviews(employeeId: string, filters: any): Promise<PerformanceReviewModel[]>;
    create360Request(data: any): Promise<Feedback360RequestModel>;
    submit360Response(id: string, responses: any): Promise<Feedback360RequestModel>;
    aggregate360(reviewId: string): Promise<Record<string, any>>;
    createFeedback(data: any): Promise<ContinuousFeedbackModel>;
    getEmployeeFeedback(employeeId: string, filters: any): Promise<ContinuousFeedbackModel[]>;
    createPIP(data: any): Promise<PerformanceImprovementPlanModel>;
    updatePIPStatus(id: string, data: any): Promise<PerformanceImprovementPlanModel>;
    approvePIP(id: string, data: any): Promise<PerformanceImprovementPlanModel>;
    createCompetency(data: any): Promise<CompetencyModel>;
    addCompetencyAssessment(data: any): Promise<CompetencyAssessmentModel>;
    getCompetencyAssessments(reviewId: string): Promise<CompetencyAssessmentModel[]>;
    getGapAnalysis(reviewId: string): Promise<{
        competencyId: string;
        competencyName: string;
        category: CompetencyCategory;
        expectedLevel: number;
        currentLevel: number;
        gap: number;
        developmentPriority: "high" | "medium" | "low";
    }[]>;
    createCalibrationSession(data: any): Promise<CalibrationSessionModel>;
    addRatingAdjustment(id: string, data: any): Promise<CalibrationSessionModel>;
    completeCalibrationSession(id: string, data: any): Promise<CalibrationSessionModel>;
    getPerformanceDistribution(cycleId: string): Promise<Record<PerformanceRating, {
        count: number;
        percentage: number;
    }>>;
    getCompletionStats(cycleId: string): Promise<{
        total: number;
        notStarted: number;
        inProgress: number;
        completed: number;
        completionRate: number;
        selfAssessmentCompleted: number;
        managerAssessmentCompleted: number;
        calibrationCompleted: number;
    }>;
    getManagerSummary(managerId: string, cycleId: string): Promise<{
        totalReviews: number;
        completedReviews: number;
        averageScore: number;
        ratingDistribution: Record<PerformanceRating, number>;
        topPerformers: Array<{
            employeeId: string;
            rating: PerformanceRating;
            score: number;
        }>;
        needsImprovement: Array<{
            employeeId: string;
            rating: PerformanceRating;
            score: number;
        }>;
    }>;
}
//# sourceMappingURL=performance-management-kit.d.ts.map