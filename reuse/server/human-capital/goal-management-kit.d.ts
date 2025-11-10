/**
 * LOC: HCM_GOAL_MGT_001
 * File: /reuse/server/human-capital/goal-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - zod
 *   - i18next
 *
 * DOWNSTREAM (imported by):
 *   - Goal management services
 *   - OKR implementations
 *   - Performance review systems
 *   - Talent management platforms
 *   - HR analytics & reporting
 *   - Development planning modules
 */
import { Model } from 'sequelize-typescript';
import { Transaction } from 'sequelize';
/**
 * Goal type enumeration
 */
export declare enum GoalType {
    INDIVIDUAL = "individual",
    TEAM = "team",
    DEPARTMENT = "department",
    ORGANIZATIONAL = "organizational",
    PROJECT = "project"
}
/**
 * Goal methodology
 */
export declare enum GoalMethodology {
    SMART = "smart",
    OKR = "okr",
    KPI = "kpi",
    CUSTOM = "custom"
}
/**
 * Goal status enumeration
 */
export declare enum GoalStatus {
    DRAFT = "draft",
    SUBMITTED = "submitted",
    APPROVED = "approved",
    ACTIVE = "active",
    IN_PROGRESS = "in_progress",
    ON_HOLD = "on_hold",
    ACHIEVED = "achieved",
    PARTIALLY_ACHIEVED = "partially_achieved",
    NOT_ACHIEVED = "not_achieved",
    CANCELLED = "cancelled",
    CARRIED_OVER = "carried_over"
}
/**
 * Goal category
 */
export declare enum GoalCategory {
    STRATEGIC = "strategic",
    OPERATIONAL = "operational",
    DEVELOPMENTAL = "developmental",
    FINANCIAL = "financial",
    CUSTOMER = "customer",
    QUALITY = "quality",
    INNOVATION = "innovation",
    COMPLIANCE = "compliance",
    PEOPLE = "people"
}
/**
 * Goal priority
 */
export declare enum GoalPriority {
    CRITICAL = "critical",
    HIGH = "high",
    MEDIUM = "medium",
    LOW = "low"
}
/**
 * Key result status
 */
export declare enum KeyResultStatus {
    NOT_STARTED = "not_started",
    ON_TRACK = "on_track",
    AT_RISK = "at_risk",
    OFF_TRACK = "off_track",
    ACHIEVED = "achieved"
}
/**
 * Check-in frequency
 */
export declare enum CheckInFrequency {
    WEEKLY = "weekly",
    BI_WEEKLY = "bi_weekly",
    MONTHLY = "monthly",
    QUARTERLY = "quarterly",
    AD_HOC = "ad_hoc"
}
/**
 * Measurement unit
 */
export declare enum MeasurementUnit {
    PERCENTAGE = "percentage",
    NUMBER = "number",
    CURRENCY = "currency",
    BOOLEAN = "boolean",
    CUSTOM = "custom"
}
/**
 * Goal alignment type
 */
export declare enum AlignmentType {
    SUPPORTS = "supports",
    CONTRIBUTES_TO = "contributes_to",
    DERIVED_FROM = "derived_from",
    RELATED_TO = "related_to"
}
/**
 * Goal interface
 */
export interface Goal {
    id: string;
    title: string;
    description: string;
    ownerId: string;
    goalType: GoalType;
    methodology: GoalMethodology;
    category: GoalCategory;
    priority: GoalPriority;
    status: GoalStatus;
    startDate: Date;
    endDate: Date;
    weight: number;
    progressPercentage: number;
    achievementScore?: number;
    parentGoalId?: string;
    reviewCycleId?: string;
    isStretch: boolean;
    isCarriedOver: boolean;
    tags?: string[];
    metadata?: Record<string, any>;
}
/**
 * SMART goal criteria interface
 */
export interface SMARTCriteria {
    specific: string;
    measurable: string;
    achievable: string;
    relevant: string;
    timeBound: string;
}
/**
 * Key result interface (for OKRs)
 */
export interface KeyResult {
    id: string;
    goalId: string;
    title: string;
    description?: string;
    measurementUnit: MeasurementUnit;
    startValue: number;
    targetValue: number;
    currentValue: number;
    weight: number;
    status: KeyResultStatus;
    progressPercentage: number;
    dueDate?: Date;
}
/**
 * Milestone interface
 */
export interface Milestone {
    id: string;
    goalId: string;
    title: string;
    description?: string;
    dueDate: Date;
    completedDate?: Date;
    isCompleted: boolean;
    order: number;
}
/**
 * Goal check-in interface
 */
export interface GoalCheckIn {
    id: string;
    goalId: string;
    submittedBy: string;
    checkInDate: Date;
    progressPercentage: number;
    status: GoalStatus;
    accomplishments?: string;
    challenges?: string;
    nextSteps?: string;
    supportNeeded?: string;
    confidenceLevel?: number;
}
/**
 * Goal alignment interface
 */
export interface GoalAlignment {
    id: string;
    sourceGoalId: string;
    targetGoalId: string;
    alignmentType: AlignmentType;
    description?: string;
}
/**
 * Goal template interface
 */
export interface GoalTemplate {
    id: string;
    name: string;
    description: string;
    category: GoalCategory;
    methodology: GoalMethodology;
    templateData: {
        titleTemplate?: string;
        descriptionTemplate?: string;
        suggestedWeight?: number;
        suggestedDuration?: number;
        keyResultsTemplate?: Array<{
            title: string;
            measurementUnit: MeasurementUnit;
        }>;
        milestonesTemplate?: Array<{
            title: string;
            daysFromStart: number;
        }>;
    };
    isPublic: boolean;
    usageCount: number;
}
/**
 * Goal validation schema
 */
export declare const GoalSchema: any;
/**
 * SMART criteria validation schema
 */
export declare const SMARTCriteriaSchema: any;
/**
 * Key result validation schema
 */
export declare const KeyResultSchema: any;
/**
 * Milestone validation schema
 */
export declare const MilestoneSchema: any;
/**
 * Goal check-in validation schema
 */
export declare const GoalCheckInSchema: any;
/**
 * Goal alignment validation schema
 */
export declare const GoalAlignmentSchema: any;
/**
 * Goal Plan Model
 */
export declare class GoalPlanModel extends Model {
    id: string;
    name: string;
    planYear: number;
    startDate: Date;
    endDate: Date;
    status: string;
    description: string;
    midYearReviewDate: Date;
    yearEndReviewDate: Date;
    goals: GoalModel[];
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
/**
 * Goal Model
 */
export declare class GoalModel extends Model {
    id: string;
    planId: string;
    title: string;
    description: string;
    ownerId: string;
    goalType: GoalType;
    methodology: GoalMethodology;
    category: GoalCategory;
    priority: GoalPriority;
    status: GoalStatus;
    startDate: Date;
    endDate: Date;
    weight: number;
    progressPercentage: number;
    achievementScore: number;
    parentGoalId: string;
    reviewCycleId: string;
    isStretch: boolean;
    isCarriedOver: boolean;
    approvedBy: string;
    approvedAt: Date;
    smartCriteria: SMARTCriteria;
    tags: string[];
    metadata: Record<string, any>;
    plan: GoalPlanModel;
    parentGoal: GoalModel;
    childGoals: GoalModel[];
    keyResults: KeyResultModel[];
    milestones: MilestoneModel[];
    checkIns: GoalCheckInModel[];
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
/**
 * Key Result Model (for OKRs)
 */
export declare class KeyResultModel extends Model {
    id: string;
    goalId: string;
    title: string;
    description: string;
    measurementUnit: MeasurementUnit;
    startValue: number;
    targetValue: number;
    currentValue: number;
    weight: number;
    status: KeyResultStatus;
    progressPercentage: number;
    dueDate: Date;
    goal: GoalModel;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
/**
 * Milestone Model
 */
export declare class MilestoneModel extends Model {
    id: string;
    goalId: string;
    title: string;
    description: string;
    dueDate: Date;
    completedDate: Date;
    isCompleted: boolean;
    order: number;
    goal: GoalModel;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
/**
 * Goal Check-In Model
 */
export declare class GoalCheckInModel extends Model {
    id: string;
    goalId: string;
    submittedBy: string;
    checkInDate: Date;
    progressPercentage: number;
    status: GoalStatus;
    accomplishments: string;
    challenges: string;
    nextSteps: string;
    supportNeeded: string;
    confidenceLevel: number;
    goal: GoalModel;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Goal Alignment Model
 */
export declare class GoalAlignmentModel extends Model {
    id: string;
    sourceGoalId: string;
    targetGoalId: string;
    alignmentType: AlignmentType;
    description: string;
    sourceGoal: GoalModel;
    targetGoal: GoalModel;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Goal Template Model
 */
export declare class GoalTemplateModel extends Model {
    id: string;
    name: string;
    description: string;
    category: GoalCategory;
    methodology: GoalMethodology;
    templateData: Record<string, any>;
    isPublic: boolean;
    usageCount: number;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
/**
 * Create goal plan
 *
 * @param planData - Goal plan data
 * @param transaction - Optional transaction
 * @returns Created goal plan
 *
 * @example
 * ```typescript
 * const plan = await createGoalPlan({
 *   name: '2024 Goal Plan',
 *   planYear: 2024,
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31'),
 * });
 * ```
 */
export declare function createGoalPlan(planData: {
    name: string;
    planYear: number;
    startDate: Date;
    endDate: Date;
    description?: string;
    midYearReviewDate?: Date;
    yearEndReviewDate?: Date;
}, transaction?: Transaction): Promise<GoalPlanModel>;
/**
 * Create goal
 *
 * @param goalData - Goal data
 * @param transaction - Optional transaction
 * @returns Created goal
 *
 * @example
 * ```typescript
 * const goal = await createGoal({
 *   title: 'Increase patient satisfaction',
 *   description: 'Improve patient satisfaction scores by 15%',
 *   ownerId: 'emp-uuid',
 *   goalType: GoalType.INDIVIDUAL,
 *   methodology: GoalMethodology.SMART,
 *   category: GoalCategory.QUALITY,
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31'),
 *   weight: 30,
 * });
 * ```
 */
export declare function createGoal(goalData: Partial<Goal>, transaction?: Transaction): Promise<GoalModel>;
/**
 * Update goal
 *
 * @param goalId - Goal ID
 * @param updates - Fields to update
 * @param transaction - Optional transaction
 * @returns Updated goal
 *
 * @example
 * ```typescript
 * await updateGoal('goal-uuid', {
 *   status: GoalStatus.ACTIVE,
 *   progressPercentage: 25,
 * });
 * ```
 */
export declare function updateGoal(goalId: string, updates: Partial<Goal>, transaction?: Transaction): Promise<GoalModel>;
/**
 * Get goal by ID
 *
 * @param goalId - Goal ID
 * @param includeRelations - Include related data
 * @returns Goal or null
 *
 * @example
 * ```typescript
 * const goal = await getGoalById('goal-uuid', true);
 * ```
 */
export declare function getGoalById(goalId: string, includeRelations?: boolean): Promise<GoalModel | null>;
/**
 * Get employee goals
 *
 * @param ownerId - Owner ID
 * @param filters - Optional filters
 * @returns Array of goals
 *
 * @example
 * ```typescript
 * const goals = await getEmployeeGoals('emp-uuid', {
 *   status: GoalStatus.ACTIVE,
 *   category: GoalCategory.QUALITY,
 * });
 * ```
 */
export declare function getEmployeeGoals(ownerId: string, filters?: {
    planId?: string;
    status?: GoalStatus;
    goalType?: GoalType;
    category?: GoalCategory;
    priority?: GoalPriority;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
}): Promise<GoalModel[]>;
/**
 * Approve goal
 *
 * @param goalId - Goal ID
 * @param approvedBy - User approving
 * @param transaction - Optional transaction
 * @returns Approved goal
 *
 * @example
 * ```typescript
 * await approveGoal('goal-uuid', 'manager-uuid');
 * ```
 */
export declare function approveGoal(goalId: string, approvedBy: string, transaction?: Transaction): Promise<GoalModel>;
/**
 * Activate goal
 *
 * @param goalId - Goal ID
 * @param transaction - Optional transaction
 * @returns Activated goal
 *
 * @example
 * ```typescript
 * await activateGoal('goal-uuid');
 * ```
 */
export declare function activateGoal(goalId: string, transaction?: Transaction): Promise<GoalModel>;
/**
 * Delete goal
 *
 * @param goalId - Goal ID
 * @param transaction - Optional transaction
 * @returns Success status
 *
 * @example
 * ```typescript
 * await deleteGoal('goal-uuid');
 * ```
 */
export declare function deleteGoal(goalId: string, transaction?: Transaction): Promise<void>;
/**
 * Create SMART goal
 *
 * @param goalData - Goal data
 * @param smartCriteria - SMART criteria
 * @param transaction - Optional transaction
 * @returns Created SMART goal
 *
 * @example
 * ```typescript
 * const goal = await createSMARTGoal(
 *   { title: '...', ... },
 *   {
 *     specific: 'Increase patient satisfaction scores',
 *     measurable: 'From 75% to 90%',
 *     achievable: 'With improved training',
 *     relevant: 'Aligns with hospital quality goals',
 *     timeBound: 'By December 31, 2024',
 *   }
 * );
 * ```
 */
export declare function createSMARTGoal(goalData: Partial<Goal>, smartCriteria: SMARTCriteria, transaction?: Transaction): Promise<GoalModel>;
/**
 * Add key result to goal
 *
 * @param keyResultData - Key result data
 * @param transaction - Optional transaction
 * @returns Created key result
 *
 * @example
 * ```typescript
 * const kr = await addKeyResult({
 *   goalId: 'goal-uuid',
 *   title: 'Increase NPS score',
 *   measurementUnit: MeasurementUnit.NUMBER,
 *   startValue: 65,
 *   targetValue: 85,
 *   currentValue: 65,
 *   weight: 40,
 * });
 * ```
 */
export declare function addKeyResult(keyResultData: Partial<KeyResult>, transaction?: Transaction): Promise<KeyResultModel>;
/**
 * Update key result
 *
 * @param keyResultId - Key result ID
 * @param updates - Fields to update
 * @param transaction - Optional transaction
 * @returns Updated key result
 *
 * @example
 * ```typescript
 * await updateKeyResult('kr-uuid', {
 *   currentValue: 75,
 *   status: KeyResultStatus.ON_TRACK,
 * });
 * ```
 */
export declare function updateKeyResult(keyResultId: string, updates: Partial<KeyResult>, transaction?: Transaction): Promise<KeyResultModel>;
/**
 * Update key result progress
 *
 * @param keyResultId - Key result ID
 * @param currentValue - Current value
 * @param transaction - Optional transaction
 * @returns Updated key result with calculated progress
 *
 * @example
 * ```typescript
 * await updateKeyResultProgress('kr-uuid', 75);
 * ```
 */
export declare function updateKeyResultProgress(keyResultId: string, currentValue: number, transaction?: Transaction): Promise<KeyResultModel>;
/**
 * Get key results for goal
 *
 * @param goalId - Goal ID
 * @returns Array of key results
 *
 * @example
 * ```typescript
 * const keyResults = await getKeyResults('goal-uuid');
 * ```
 */
export declare function getKeyResults(goalId: string): Promise<KeyResultModel[]>;
/**
 * Calculate goal progress from key results
 *
 * @param goalId - Goal ID
 * @param transaction - Optional transaction
 * @returns Updated goal with calculated progress
 *
 * @example
 * ```typescript
 * await calculateGoalProgressFromKeyResults('goal-uuid');
 * ```
 */
export declare function calculateGoalProgressFromKeyResults(goalId: string, transaction?: Transaction): Promise<GoalModel>;
/**
 * Add milestone to goal
 *
 * @param milestoneData - Milestone data
 * @param transaction - Optional transaction
 * @returns Created milestone
 *
 * @example
 * ```typescript
 * const milestone = await addMilestone({
 *   goalId: 'goal-uuid',
 *   title: 'Complete training program',
 *   dueDate: new Date('2024-03-31'),
 *   order: 1,
 * });
 * ```
 */
export declare function addMilestone(milestoneData: Partial<Milestone>, transaction?: Transaction): Promise<MilestoneModel>;
/**
 * Complete milestone
 *
 * @param milestoneId - Milestone ID
 * @param transaction - Optional transaction
 * @returns Updated milestone
 *
 * @example
 * ```typescript
 * await completeMilestone('milestone-uuid');
 * ```
 */
export declare function completeMilestone(milestoneId: string, transaction?: Transaction): Promise<MilestoneModel>;
/**
 * Get milestones for goal
 *
 * @param goalId - Goal ID
 * @returns Array of milestones
 *
 * @example
 * ```typescript
 * const milestones = await getMilestones('goal-uuid');
 * ```
 */
export declare function getMilestones(goalId: string): Promise<MilestoneModel[]>;
/**
 * Calculate goal progress from milestones
 *
 * @param goalId - Goal ID
 * @param transaction - Optional transaction
 * @returns Updated goal with calculated progress
 *
 * @example
 * ```typescript
 * await calculateGoalProgressFromMilestones('goal-uuid');
 * ```
 */
export declare function calculateGoalProgressFromMilestones(goalId: string, transaction?: Transaction): Promise<GoalModel>;
/**
 * Create goal check-in
 *
 * @param checkInData - Check-in data
 * @param transaction - Optional transaction
 * @returns Created check-in
 *
 * @example
 * ```typescript
 * const checkIn = await createGoalCheckIn({
 *   goalId: 'goal-uuid',
 *   submittedBy: 'emp-uuid',
 *   checkInDate: new Date(),
 *   progressPercentage: 40,
 *   status: GoalStatus.IN_PROGRESS,
 *   accomplishments: 'Completed phase 1...',
 *   challenges: 'Resource constraints...',
 * });
 * ```
 */
export declare function createGoalCheckIn(checkInData: Partial<GoalCheckIn>, transaction?: Transaction): Promise<GoalCheckInModel>;
/**
 * Get check-ins for goal
 *
 * @param goalId - Goal ID
 * @param limit - Optional limit
 * @returns Array of check-ins
 *
 * @example
 * ```typescript
 * const checkIns = await getGoalCheckIns('goal-uuid', 10);
 * ```
 */
export declare function getGoalCheckIns(goalId: string, limit?: number): Promise<GoalCheckInModel[]>;
/**
 * Get latest check-in for goal
 *
 * @param goalId - Goal ID
 * @returns Latest check-in or null
 *
 * @example
 * ```typescript
 * const latestCheckIn = await getLatestCheckIn('goal-uuid');
 * ```
 */
export declare function getLatestCheckIn(goalId: string): Promise<GoalCheckInModel | null>;
/**
 * Get check-in history for employee
 *
 * @param employeeId - Employee ID
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Array of check-ins
 *
 * @example
 * ```typescript
 * const history = await getCheckInHistory('emp-uuid',
 *   new Date('2024-01-01'), new Date('2024-12-31'));
 * ```
 */
export declare function getCheckInHistory(employeeId: string, startDate: Date, endDate: Date): Promise<GoalCheckInModel[]>;
/**
 * Create goal alignment
 *
 * @param alignmentData - Alignment data
 * @param transaction - Optional transaction
 * @returns Created alignment
 *
 * @example
 * ```typescript
 * const alignment = await createGoalAlignment({
 *   sourceGoalId: 'individual-goal-uuid',
 *   targetGoalId: 'team-goal-uuid',
 *   alignmentType: AlignmentType.SUPPORTS,
 *   description: 'Individual goal supports team objective',
 * });
 * ```
 */
export declare function createGoalAlignment(alignmentData: Partial<GoalAlignment>, transaction?: Transaction): Promise<GoalAlignmentModel>;
/**
 * Get goal alignments
 *
 * @param goalId - Goal ID
 * @param direction - 'source' or 'target'
 * @returns Array of alignments
 *
 * @example
 * ```typescript
 * const alignments = await getGoalAlignments('goal-uuid', 'source');
 * ```
 */
export declare function getGoalAlignments(goalId: string, direction?: 'source' | 'target'): Promise<GoalAlignmentModel[]>;
/**
 * Get goal alignment hierarchy
 *
 * @param goalId - Root goal ID
 * @returns Hierarchical alignment structure
 *
 * @example
 * ```typescript
 * const hierarchy = await getGoalAlignmentHierarchy('org-goal-uuid');
 * ```
 */
export declare function getGoalAlignmentHierarchy(goalId: string): Promise<{
    goal: GoalModel;
    alignedGoals: Array<{
        goal: GoalModel;
        alignmentType: AlignmentType;
    }>;
}>;
/**
 * Delete goal alignment
 *
 * @param alignmentId - Alignment ID
 * @param transaction - Optional transaction
 * @returns Success status
 *
 * @example
 * ```typescript
 * await deleteGoalAlignment('alignment-uuid');
 * ```
 */
export declare function deleteGoalAlignment(alignmentId: string, transaction?: Transaction): Promise<void>;
/**
 * Cascade goal to child level
 *
 * @param parentGoalId - Parent goal ID
 * @param childGoalData - Child goal data
 * @param transaction - Optional transaction
 * @returns Created child goal
 *
 * @example
 * ```typescript
 * const childGoal = await cascadeGoal('parent-goal-uuid', {
 *   title: 'Support organizational goal',
 *   ownerId: 'team-lead-uuid',
 *   ...
 * });
 * ```
 */
export declare function cascadeGoal(parentGoalId: string, childGoalData: Partial<Goal>, transaction?: Transaction): Promise<GoalModel>;
/**
 * Get child goals
 *
 * @param parentGoalId - Parent goal ID
 * @returns Array of child goals
 *
 * @example
 * ```typescript
 * const children = await getChildGoals('parent-goal-uuid');
 * ```
 */
export declare function getChildGoals(parentGoalId: string): Promise<GoalModel[]>;
/**
 * Get goal hierarchy
 *
 * @param rootGoalId - Root goal ID
 * @returns Hierarchical goal structure
 *
 * @example
 * ```typescript
 * const hierarchy = await getGoalHierarchy('root-goal-uuid');
 * ```
 */
export declare function getGoalHierarchy(rootGoalId: string): Promise<GoalModel>;
/**
 * Create goal template
 *
 * @param templateData - Template data
 * @param createdBy - User creating template
 * @param transaction - Optional transaction
 * @returns Created template
 *
 * @example
 * ```typescript
 * const template = await createGoalTemplate({
 *   name: 'Customer Satisfaction Template',
 *   category: GoalCategory.CUSTOMER,
 *   methodology: GoalMethodology.OKR,
 *   templateData: { ... },
 * }, 'user-uuid');
 * ```
 */
export declare function createGoalTemplate(templateData: Partial<GoalTemplate> & {
    createdBy: string;
}, transaction?: Transaction): Promise<GoalTemplateModel>;
/**
 * Get goal templates
 *
 * @param filters - Optional filters
 * @returns Array of templates
 *
 * @example
 * ```typescript
 * const templates = await getGoalTemplates({
 *   category: GoalCategory.QUALITY,
 *   isPublic: true,
 * });
 * ```
 */
export declare function getGoalTemplates(filters?: {
    category?: GoalCategory;
    methodology?: GoalMethodology;
    isPublic?: boolean;
}): Promise<GoalTemplateModel[]>;
/**
 * Create goal from template
 *
 * @param templateId - Template ID
 * @param goalData - Additional goal data
 * @param transaction - Optional transaction
 * @returns Created goal
 *
 * @example
 * ```typescript
 * const goal = await createGoalFromTemplate('template-uuid', {
 *   ownerId: 'emp-uuid',
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31'),
 * });
 * ```
 */
export declare function createGoalFromTemplate(templateId: string, goalData: Partial<Goal>, transaction?: Transaction): Promise<GoalModel>;
/**
 * Get goal completion statistics
 *
 * @param filters - Optional filters
 * @returns Goal completion statistics
 *
 * @example
 * ```typescript
 * const stats = await getGoalCompletionStats({
 *   planId: 'plan-uuid',
 *   goalType: GoalType.INDIVIDUAL,
 * });
 * ```
 */
export declare function getGoalCompletionStats(filters?: {
    planId?: string;
    ownerId?: string;
    goalType?: GoalType;
    category?: GoalCategory;
}): Promise<{
    total: number;
    draft: number;
    active: number;
    achieved: number;
    notAchieved: number;
    inProgress: number;
    completionRate: number;
    averageProgress: number;
}>;
/**
 * Get employee goal summary
 *
 * @param ownerId - Owner ID
 * @param planId - Plan ID
 * @returns Employee goal summary
 *
 * @example
 * ```typescript
 * const summary = await getEmployeeGoalSummary('emp-uuid', 'plan-uuid');
 * ```
 */
export declare function getEmployeeGoalSummary(ownerId: string, planId: string): Promise<{
    totalGoals: number;
    activeGoals: number;
    achievedGoals: number;
    overallProgress: number;
    byCategory: Record<GoalCategory, number>;
    byPriority: Record<GoalPriority, number>;
    stretchGoals: number;
    atRiskGoals: number;
}>;
/**
 * Get goals by status
 *
 * @param status - Goal status
 * @param filters - Optional filters
 * @returns Array of goals
 *
 * @example
 * ```typescript
 * const activeGoals = await getGoalsByStatus(GoalStatus.ACTIVE, {
 *   ownerId: 'emp-uuid',
 * });
 * ```
 */
export declare function getGoalsByStatus(status: GoalStatus, filters?: {
    ownerId?: string;
    planId?: string;
    goalType?: GoalType;
}): Promise<GoalModel[]>;
/**
 * Get overdue goals
 *
 * @param ownerId - Optional owner ID
 * @returns Array of overdue goals
 *
 * @example
 * ```typescript
 * const overdueGoals = await getOverdueGoals('emp-uuid');
 * ```
 */
export declare function getOverdueGoals(ownerId?: string): Promise<GoalModel[]>;
export declare class GoalManagementService {
    createGoalPlan(data: any, transaction?: Transaction): Promise<GoalPlanModel>;
    createGoal(data: any, transaction?: Transaction): Promise<GoalModel>;
    updateGoal(id: string, data: any, transaction?: Transaction): Promise<GoalModel>;
    getGoalById(id: string, includeRelations?: boolean): Promise<GoalModel | null>;
    getEmployeeGoals(ownerId: string, filters?: any): Promise<GoalModel[]>;
    approveGoal(id: string, approvedBy: string, transaction?: Transaction): Promise<GoalModel>;
    activateGoal(id: string, transaction?: Transaction): Promise<GoalModel>;
    deleteGoal(id: string, transaction?: Transaction): Promise<void>;
    createSMARTGoal(goalData: any, smartCriteria: SMARTCriteria, transaction?: Transaction): Promise<GoalModel>;
    addKeyResult(data: any, transaction?: Transaction): Promise<KeyResultModel>;
    updateKeyResult(id: string, data: any, transaction?: Transaction): Promise<KeyResultModel>;
    updateKeyResultProgress(id: string, currentValue: number, transaction?: Transaction): Promise<KeyResultModel>;
    getKeyResults(goalId: string): Promise<KeyResultModel[]>;
    calculateGoalProgressFromKeyResults(goalId: string, transaction?: Transaction): Promise<GoalModel>;
    addMilestone(data: any, transaction?: Transaction): Promise<MilestoneModel>;
    completeMilestone(id: string, transaction?: Transaction): Promise<MilestoneModel>;
    getMilestones(goalId: string): Promise<MilestoneModel[]>;
    calculateGoalProgressFromMilestones(goalId: string, transaction?: Transaction): Promise<GoalModel>;
    createGoalCheckIn(data: any, transaction?: Transaction): Promise<GoalCheckInModel>;
    getGoalCheckIns(goalId: string, limit?: number): Promise<GoalCheckInModel[]>;
    getLatestCheckIn(goalId: string): Promise<GoalCheckInModel | null>;
    getCheckInHistory(employeeId: string, startDate: Date, endDate: Date): Promise<GoalCheckInModel[]>;
    createGoalAlignment(data: any, transaction?: Transaction): Promise<GoalAlignmentModel>;
    getGoalAlignments(goalId: string, direction?: 'source' | 'target'): Promise<GoalAlignmentModel[]>;
    getGoalAlignmentHierarchy(goalId: string): Promise<{
        goal: GoalModel;
        alignedGoals: Array<{
            goal: GoalModel;
            alignmentType: AlignmentType;
        }>;
    }>;
    deleteGoalAlignment(id: string, transaction?: Transaction): Promise<void>;
    cascadeGoal(parentGoalId: string, childGoalData: any, transaction?: Transaction): Promise<GoalModel>;
    getChildGoals(parentGoalId: string): Promise<GoalModel[]>;
    getGoalHierarchy(rootGoalId: string): Promise<GoalModel>;
    createGoalTemplate(data: any, transaction?: Transaction): Promise<GoalTemplateModel>;
    getGoalTemplates(filters?: any): Promise<GoalTemplateModel[]>;
    createGoalFromTemplate(templateId: string, goalData: any, transaction?: Transaction): Promise<GoalModel>;
    getGoalCompletionStats(filters?: any): Promise<{
        total: number;
        draft: number;
        active: number;
        achieved: number;
        notAchieved: number;
        inProgress: number;
        completionRate: number;
        averageProgress: number;
    }>;
    getEmployeeGoalSummary(ownerId: string, planId: string): Promise<{
        totalGoals: number;
        activeGoals: number;
        achievedGoals: number;
        overallProgress: number;
        byCategory: Record<GoalCategory, number>;
        byPriority: Record<GoalPriority, number>;
        stretchGoals: number;
        atRiskGoals: number;
    }>;
    getGoalsByStatus(status: GoalStatus, filters?: any): Promise<GoalModel[]>;
    getOverdueGoals(ownerId?: string): Promise<GoalModel[]>;
}
export declare class GoalManagementController {
    private readonly service;
    constructor(service: GoalManagementService);
    createPlan(data: any): Promise<GoalPlanModel>;
    createGoal(data: any): Promise<GoalModel>;
    createSMARTGoal(data: any): Promise<GoalModel>;
    getGoal(id: string, includeRelations?: boolean): Promise<GoalModel | null>;
    updateGoal(id: string, data: any): Promise<GoalModel>;
    deleteGoal(id: string): Promise<void>;
    approveGoal(id: string, data: any): Promise<GoalModel>;
    activateGoal(id: string): Promise<GoalModel>;
    getEmployeeGoals(ownerId: string, filters: any): Promise<GoalModel[]>;
    addKeyResult(data: any): Promise<KeyResultModel>;
    updateKeyResult(id: string, data: any): Promise<KeyResultModel>;
    updateKeyResultProgress(id: string, data: any): Promise<KeyResultModel>;
    getKeyResults(goalId: string): Promise<KeyResultModel[]>;
    addMilestone(data: any): Promise<MilestoneModel>;
    completeMilestone(id: string): Promise<MilestoneModel>;
    getMilestones(goalId: string): Promise<MilestoneModel[]>;
    createCheckIn(data: any): Promise<GoalCheckInModel>;
    getCheckIns(goalId: string, limit?: number): Promise<GoalCheckInModel[]>;
    createAlignment(data: any): Promise<GoalAlignmentModel>;
    getAlignments(goalId: string, direction?: 'source' | 'target'): Promise<GoalAlignmentModel[]>;
    getAlignmentHierarchy(goalId: string): Promise<{
        goal: GoalModel;
        alignedGoals: Array<{
            goal: GoalModel;
            alignmentType: AlignmentType;
        }>;
    }>;
    cascadeGoal(parentGoalId: string, data: any): Promise<GoalModel>;
    getChildGoals(parentGoalId: string): Promise<GoalModel[]>;
    getHierarchy(rootGoalId: string): Promise<GoalModel>;
    createTemplate(data: any): Promise<GoalTemplateModel>;
    getTemplates(filters: any): Promise<GoalTemplateModel[]>;
    createFromTemplate(templateId: string, goalData: any): Promise<GoalModel>;
    getCompletionStats(filters: any): Promise<{
        total: number;
        draft: number;
        active: number;
        achieved: number;
        notAchieved: number;
        inProgress: number;
        completionRate: number;
        averageProgress: number;
    }>;
    getEmployeeSummary(ownerId: string, planId: string): Promise<{
        totalGoals: number;
        activeGoals: number;
        achievedGoals: number;
        overallProgress: number;
        byCategory: Record<GoalCategory, number>;
        byPriority: Record<GoalPriority, number>;
        stretchGoals: number;
        atRiskGoals: number;
    }>;
    getOverdueGoals(ownerId?: string): Promise<GoalModel[]>;
}
//# sourceMappingURL=goal-management-kit.d.ts.map