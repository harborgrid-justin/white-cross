/**
 * LOC: HCMENG1234567
 * File: /reuse/server/human-capital/employee-engagement-kit.ts
 *
 * UPSTREAM (imports from):
 *   - ../../error-handling-kit.ts
 *   - ../../validation-kit.ts
 *   - ../../analytics-kit.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend HR services
 *   - Employee engagement platform controllers
 *   - Analytics dashboards
 */
/**
 * Survey status
 */
export declare enum SurveyStatus {
    DRAFT = "draft",
    ACTIVE = "active",
    PAUSED = "paused",
    CLOSED = "closed",
    ANALYZING = "analyzing",
    COMPLETED = "completed"
}
/**
 * Survey types
 */
export declare enum SurveyType {
    PULSE = "pulse",
    ENGAGEMENT = "engagement",
    ONBOARDING = "onboarding",
    EXIT = "exit",
    CULTURE = "culture",
    WELLBEING = "wellbeing",
    CUSTOM = "custom"
}
/**
 * Question types
 */
export declare enum QuestionType {
    RATING = "rating",
    MULTIPLE_CHOICE = "multiple_choice",
    TEXT = "text",
    YES_NO = "yes_no",
    LIKERT = "likert",
    NET_PROMOTER = "net_promoter",
    RANKING = "ranking"
}
/**
 * Feedback status
 */
export declare enum FeedbackStatus {
    SUBMITTED = "submitted",
    UNDER_REVIEW = "under_review",
    IN_PROGRESS = "in_progress",
    RESOLVED = "resolved",
    CLOSED = "closed",
    ESCALATED = "escalated"
}
/**
 * Feedback category
 */
export declare enum FeedbackCategory {
    WORKPLACE = "workplace",
    MANAGEMENT = "management",
    TOOLS = "tools",
    PROCESS = "process",
    BENEFITS = "benefits",
    CULTURE = "culture",
    GROWTH = "growth",
    OTHER = "other"
}
/**
 * Recognition types
 */
export declare enum RecognitionType {
    SPOT_BONUS = "spot_bonus",
    PEER_RECOGNITION = "peer_recognition",
    MANAGER_RECOGNITION = "manager_recognition",
    TEAM_AWARD = "team_award",
    MILESTONE = "milestone",
    VALUES_BASED = "values_based",
    INNOVATION = "innovation"
}
/**
 * Milestone types
 */
export declare enum MilestoneType {
    WORK_ANNIVERSARY = "work_anniversary",
    BIRTHDAY = "birthday",
    PROMOTION = "promotion",
    RETIREMENT = "retirement",
    PROJECT_COMPLETION = "project_completion",
    CERTIFICATION = "certification"
}
/**
 * Wellbeing category
 */
export declare enum WellbeingCategory {
    PHYSICAL = "physical",
    MENTAL = "mental",
    FINANCIAL = "financial",
    SOCIAL = "social",
    CAREER = "career"
}
/**
 * Sentiment score
 */
export declare enum SentimentScore {
    VERY_POSITIVE = "very_positive",
    POSITIVE = "positive",
    NEUTRAL = "neutral",
    NEGATIVE = "negative",
    VERY_NEGATIVE = "very_negative"
}
/**
 * Survey interface
 */
export interface Survey {
    id: string;
    title: string;
    description: string;
    type: SurveyType;
    status: SurveyStatus;
    startDate: Date;
    endDate: Date;
    isAnonymous: boolean;
    targetAudience: string[];
    questions: SurveyQuestion[];
    responseRate: number;
    totalInvited: number;
    totalResponded: number;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Survey question interface
 */
export interface SurveyQuestion {
    id: string;
    surveyId: string;
    questionText: string;
    questionType: QuestionType;
    isRequired: boolean;
    order: number;
    options?: string[];
    minRating?: number;
    maxRating?: number;
    allowComment: boolean;
}
/**
 * Survey response interface
 */
export interface SurveyResponse {
    id: string;
    surveyId: string;
    employeeId?: string;
    isAnonymous: boolean;
    answers: SurveyAnswer[];
    submittedAt: Date;
    completionTime: number;
}
/**
 * Survey answer interface
 */
export interface SurveyAnswer {
    questionId: string;
    questionText: string;
    answerType: QuestionType;
    ratingValue?: number;
    textValue?: string;
    selectedOptions?: string[];
    comment?: string;
}
/**
 * Engagement score interface
 */
export interface EngagementScore {
    employeeId?: string;
    department?: string;
    location?: string;
    overallScore: number;
    dimensionScores: {
        satisfaction: number;
        motivation: number;
        commitment: number;
        advocacy: number;
        leadership: number;
        growth: number;
        wellbeing: number;
    };
    period: {
        startDate: Date;
        endDate: Date;
    };
    trend: 'improving' | 'stable' | 'declining';
    previousScore?: number;
    benchmarkScore?: number;
}
/**
 * eNPS (Employee Net Promoter Score) interface
 */
export interface EmployeeNPS {
    id: string;
    surveyId: string;
    period: {
        startDate: Date;
        endDate: Date;
    };
    score: number;
    promoters: number;
    passives: number;
    detractors: number;
    totalResponses: number;
    responseRate: number;
    byDepartment: Record<string, {
        score: number;
        responses: number;
    }>;
    byLocation: Record<string, {
        score: number;
        responses: number;
    }>;
    trend: 'improving' | 'stable' | 'declining';
    previousScore?: number;
}
/**
 * Feedback interface
 */
export interface Feedback {
    id: string;
    employeeId: string;
    employeeName?: string;
    category: FeedbackCategory;
    title: string;
    description: string;
    isAnonymous: boolean;
    status: FeedbackStatus;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    assignedTo?: string;
    resolution?: string;
    resolvedAt?: Date;
    resolvedBy?: string;
    upvotes: number;
    comments: FeedbackComment[];
    tags?: string[];
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Feedback comment interface
 */
export interface FeedbackComment {
    id: string;
    feedbackId: string;
    userId: string;
    userName: string;
    comment: string;
    isInternal: boolean;
    createdAt: Date;
}
/**
 * Recognition interface
 */
export interface Recognition {
    id: string;
    type: RecognitionType;
    fromEmployeeId: string;
    fromEmployeeName: string;
    toEmployeeId: string;
    toEmployeeName: string;
    title: string;
    message: string;
    values?: string[];
    isPublic: boolean;
    monetaryValue?: number;
    currency?: string;
    approvedBy?: string;
    approvedAt?: Date;
    reactions: RecognitionReaction[];
    comments: RecognitionComment[];
    createdAt: Date;
}
/**
 * Recognition reaction interface
 */
export interface RecognitionReaction {
    id: string;
    recognitionId: string;
    employeeId: string;
    reaction: 'like' | 'love' | 'celebrate' | 'inspire';
    createdAt: Date;
}
/**
 * Recognition comment interface
 */
export interface RecognitionComment {
    id: string;
    recognitionId: string;
    employeeId: string;
    employeeName: string;
    comment: string;
    createdAt: Date;
}
/**
 * Milestone interface
 */
export interface Milestone {
    id: string;
    employeeId: string;
    employeeName: string;
    type: MilestoneType;
    title: string;
    description: string;
    date: Date;
    yearsOfService?: number;
    isPublic: boolean;
    celebratedBy: string[];
    gifts?: MilestoneGift[];
    createdAt: Date;
}
/**
 * Milestone gift interface
 */
export interface MilestoneGift {
    giftType: string;
    description: string;
    value?: number;
    currency?: string;
}
/**
 * Social post interface
 */
export interface SocialPost {
    id: string;
    authorId: string;
    authorName: string;
    content: string;
    images?: string[];
    hashtags?: string[];
    mentions?: string[];
    likes: number;
    comments: SocialComment[];
    shares: number;
    isPublic: boolean;
    isPinned: boolean;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Social comment interface
 */
export interface SocialComment {
    id: string;
    postId: string;
    authorId: string;
    authorName: string;
    comment: string;
    likes: number;
    createdAt: Date;
}
/**
 * Wellbeing program interface
 */
export interface WellbeingProgram {
    id: string;
    title: string;
    description: string;
    category: WellbeingCategory;
    startDate: Date;
    endDate?: Date;
    isActive: boolean;
    provider?: string;
    activities: WellbeingActivity[];
    participationCount: number;
    targetAudience: string[];
    resources: WellbeingResource[];
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Wellbeing activity interface
 */
export interface WellbeingActivity {
    id: string;
    programId: string;
    title: string;
    description: string;
    activityType: 'challenge' | 'workshop' | 'session' | 'resource' | 'event';
    date?: Date;
    duration?: number;
    location?: string;
    capacity?: number;
    enrolled: number;
    isVirtual: boolean;
}
/**
 * Wellbeing resource interface
 */
export interface WellbeingResource {
    id: string;
    title: string;
    description: string;
    resourceType: 'article' | 'video' | 'tool' | 'guide' | 'link';
    url?: string;
    fileUrl?: string;
    tags?: string[];
}
/**
 * Sentiment analysis interface
 */
export interface SentimentAnalysis {
    id: string;
    sourceType: 'survey' | 'feedback' | 'social_post' | 'exit_interview' | 'other';
    sourceId: string;
    text: string;
    sentiment: SentimentScore;
    confidence: number;
    topics: string[];
    keywords: string[];
    employeeId?: string;
    department?: string;
    location?: string;
    analyzedAt: Date;
}
/**
 * Engagement action plan interface
 */
export interface EngagementActionPlan {
    id: string;
    title: string;
    description: string;
    basedOnSurvey?: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    status: 'draft' | 'active' | 'completed' | 'cancelled';
    owner: string;
    targetMetric: string;
    currentValue: number;
    targetValue: number;
    actions: ActionItem[];
    startDate: Date;
    targetDate: Date;
    completionDate?: Date;
    progress: number;
    impact?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Action item interface
 */
export interface ActionItem {
    id: string;
    planId: string;
    title: string;
    description: string;
    assignedTo: string;
    status: 'not_started' | 'in_progress' | 'completed' | 'blocked';
    dueDate: Date;
    completionDate?: Date;
    dependencies?: string[];
    notes?: string;
}
/**
 * Engagement analytics interface
 */
export interface EngagementAnalytics {
    period: {
        startDate: Date;
        endDate: Date;
    };
    overallEngagement: {
        score: number;
        trend: 'improving' | 'stable' | 'declining';
        percentageChange: number;
    };
    eNPS: {
        score: number;
        trend: 'improving' | 'stable' | 'declining';
        percentageChange: number;
    };
    surveyMetrics: {
        totalSurveys: number;
        avgResponseRate: number;
        avgCompletionTime: number;
    };
    recognitionMetrics: {
        totalRecognitions: number;
        avgRecognitionsPerEmployee: number;
        topRecognizers: Array<{
            employeeId: string;
            count: number;
        }>;
    };
    feedbackMetrics: {
        totalFeedback: number;
        resolvedPercentage: number;
        avgResolutionTime: number;
        topCategories: Array<{
            category: string;
            count: number;
        }>;
    };
    wellbeingMetrics: {
        totalPrograms: number;
        participationRate: number;
        topPrograms: Array<{
            programId: string;
            participants: number;
        }>;
    };
    sentimentAnalysis: {
        overallSentiment: SentimentScore;
        positivePercentage: number;
        neutralPercentage: number;
        negativePercentage: number;
    };
}
/**
 * DTO for creating survey
 */
export declare class CreateSurveyDto {
    title: string;
    description: string;
    type: SurveyType;
    startDate: Date;
    endDate: Date;
    isAnonymous: boolean;
    targetAudience: string[];
    questions: SurveyQuestionDto[];
}
/**
 * DTO for survey question
 */
export declare class SurveyQuestionDto {
    questionText: string;
    questionType: QuestionType;
    isRequired: boolean;
    order: number;
    options?: string[];
    minRating?: number;
    maxRating?: number;
    allowComment: boolean;
}
/**
 * DTO for survey response
 */
export declare class SubmitSurveyResponseDto {
    answers: SurveyAnswerDto[];
    completionTime: number;
}
/**
 * DTO for survey answer
 */
export declare class SurveyAnswerDto {
    questionId: string;
    ratingValue?: number;
    textValue?: string;
    selectedOptions?: string[];
    comment?: string;
}
/**
 * DTO for creating feedback
 */
export declare class CreateFeedbackDto {
    category: FeedbackCategory;
    title: string;
    description: string;
    isAnonymous: boolean;
    tags?: string[];
}
/**
 * DTO for creating recognition
 */
export declare class CreateRecognitionDto {
    type: RecognitionType;
    toEmployeeId: string;
    title: string;
    message: string;
    values?: string[];
    isPublic: boolean;
    monetaryValue?: number;
    currency?: string;
}
/**
 * DTO for creating wellbeing program
 */
export declare class CreateWellbeingProgramDto {
    title: string;
    description: string;
    category: WellbeingCategory;
    startDate: Date;
    endDate?: Date;
    provider?: string;
    targetAudience: string[];
}
/**
 * DTO for creating action plan
 */
export declare class CreateActionPlanDto {
    title: string;
    description: string;
    basedOnSurvey?: string;
    priority: string;
    owner: string;
    targetMetric: string;
    currentValue: number;
    targetValue: number;
    startDate: Date;
    targetDate: Date;
    actions: ActionItemDto[];
}
/**
 * DTO for action item
 */
export declare class ActionItemDto {
    title: string;
    description: string;
    assignedTo: string;
    dueDate: Date;
}
/**
 * Creates pulse survey
 *
 * @param surveyData - Survey data
 * @returns Created survey
 *
 * @example
 * ```typescript
 * const survey = await createPulseSurvey({
 *   title: 'Weekly Check-in',
 *   description: 'How are you feeling this week?',
 *   type: SurveyType.PULSE,
 *   startDate: new Date(),
 *   endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
 *   isAnonymous: true,
 *   targetAudience: ['all'],
 *   questions: [...]
 * });
 * ```
 */
export declare function createPulseSurvey(surveyData: Omit<Survey, 'id' | 'status' | 'responseRate' | 'totalInvited' | 'totalResponded' | 'createdAt' | 'updatedAt'>): Promise<Survey>;
/**
 * Launches survey
 *
 * @param surveyId - Survey identifier
 * @returns Updated survey
 *
 * @example
 * ```typescript
 * await launchSurvey('survey-123');
 * ```
 */
export declare function launchSurvey(surveyId: string): Promise<Survey>;
/**
 * Gets active surveys
 *
 * @param employeeId - Employee identifier
 * @returns List of active surveys
 *
 * @example
 * ```typescript
 * const surveys = await getActiveSurveys('emp-123');
 * ```
 */
export declare function getActiveSurveys(employeeId: string): Promise<Survey[]>;
/**
 * Submits survey response
 *
 * @param surveyId - Survey identifier
 * @param employeeId - Employee identifier (optional if anonymous)
 * @param responseData - Response data
 * @returns Created response
 *
 * @example
 * ```typescript
 * const response = await submitSurveyResponse('survey-123', 'emp-456', {
 *   isAnonymous: false,
 *   answers: [...],
 *   submittedAt: new Date(),
 *   completionTime: 120
 * });
 * ```
 */
export declare function submitSurveyResponse(surveyId: string, employeeId: string | undefined, responseData: Omit<SurveyResponse, 'id' | 'surveyId'>): Promise<SurveyResponse>;
/**
 * Gets survey results
 *
 * @param surveyId - Survey identifier
 * @returns Survey results with analytics
 *
 * @example
 * ```typescript
 * const results = await getSurveyResults('survey-123');
 * ```
 */
export declare function getSurveyResults(surveyId: string): Promise<{
    survey: Survey;
    responses: number;
    responseRate: number;
    questionAnalytics: Array<{
        questionId: string;
        questionText: string;
        avgRating?: number;
        distribution?: Record<string, number>;
        topResponses?: Array<{
            response: string;
            count: number;
        }>;
    }>;
}>;
/**
 * Generates survey report
 *
 * @param surveyId - Survey identifier
 * @param format - Report format
 * @returns Report URL
 *
 * @example
 * ```typescript
 * const url = await generateSurveyReport('survey-123', 'pdf');
 * ```
 */
export declare function generateSurveyReport(surveyId: string, format: 'pdf' | 'excel' | 'ppt'): Promise<string>;
/**
 * Gets survey participation rate
 *
 * @param surveyId - Survey identifier
 * @returns Participation metrics
 *
 * @example
 * ```typescript
 * const metrics = await getSurveyParticipation('survey-123');
 * ```
 */
export declare function getSurveyParticipation(surveyId: string): Promise<{
    totalInvited: number;
    totalResponded: number;
    responseRate: number;
    byDepartment: Record<string, {
        invited: number;
        responded: number;
        rate: number;
    }>;
    byLocation: Record<string, {
        invited: number;
        responded: number;
        rate: number;
    }>;
}>;
/**
 * Sends survey reminders
 *
 * @param surveyId - Survey identifier
 * @returns Number of reminders sent
 *
 * @example
 * ```typescript
 * const sent = await sendSurveyReminders('survey-123');
 * ```
 */
export declare function sendSurveyReminders(surveyId: string): Promise<number>;
/**
 * Closes survey
 *
 * @param surveyId - Survey identifier
 * @returns Updated survey
 *
 * @example
 * ```typescript
 * await closeSurvey('survey-123');
 * ```
 */
export declare function closeSurvey(surveyId: string): Promise<Survey>;
/**
 * Calculates eNPS score
 *
 * @param surveyId - Survey identifier
 * @returns eNPS metrics
 *
 * @example
 * ```typescript
 * const enps = await calculateENPS('survey-123');
 * console.log('eNPS Score:', enps.score);
 * ```
 */
export declare function calculateENPS(surveyId: string): Promise<EmployeeNPS>;
/**
 * Gets eNPS trend
 *
 * @param startDate - Start date
 * @param endDate - End date
 * @returns eNPS trend data
 *
 * @example
 * ```typescript
 * const trend = await getENPSTrend(new Date('2025-01-01'), new Date('2025-12-31'));
 * ```
 */
export declare function getENPSTrend(startDate: Date, endDate: Date): Promise<Array<{
    date: Date;
    score: number;
    responses: number;
}>>;
/**
 * Gets eNPS by segment
 *
 * @param surveyId - Survey identifier
 * @param segmentType - Segment type
 * @returns eNPS by segment
 *
 * @example
 * ```typescript
 * const byDept = await getENPSBySegment('survey-123', 'department');
 * ```
 */
export declare function getENPSBySegment(surveyId: string, segmentType: 'department' | 'location' | 'tenure' | 'role'): Promise<Record<string, {
    score: number;
    promoters: number;
    passives: number;
    detractors: number;
}>>;
/**
 * Compares eNPS with benchmarks
 *
 * @param score - Current eNPS score
 * @returns Benchmark comparison
 *
 * @example
 * ```typescript
 * const comparison = compareENPSWithBenchmarks(45);
 * ```
 */
export declare function compareENPSWithBenchmarks(score: number): {
    rating: 'excellent' | 'good' | 'fair' | 'poor';
    industry: number;
    topPerformer: number;
};
/**
 * Creates feedback
 *
 * @param employeeId - Employee identifier
 * @param feedbackData - Feedback data
 * @returns Created feedback
 *
 * @example
 * ```typescript
 * const feedback = await createFeedback('emp-123', {
 *   category: FeedbackCategory.WORKPLACE,
 *   title: 'Improve meeting room availability',
 *   description: 'More booking slots needed',
 *   isAnonymous: false,
 *   priority: 'medium',
 *   upvotes: 0,
 *   comments: []
 * });
 * ```
 */
export declare function createFeedback(employeeId: string, feedbackData: Omit<Feedback, 'id' | 'employeeId' | 'status' | 'createdAt' | 'updatedAt'>): Promise<Feedback>;
/**
 * Gets feedback by status
 *
 * @param status - Feedback status
 * @returns List of feedback
 *
 * @example
 * ```typescript
 * const pending = await getFeedbackByStatus(FeedbackStatus.UNDER_REVIEW);
 * ```
 */
export declare function getFeedbackByStatus(status: FeedbackStatus): Promise<Feedback[]>;
/**
 * Updates feedback status
 *
 * @param feedbackId - Feedback identifier
 * @param status - New status
 * @param resolution - Resolution details
 * @returns Updated feedback
 *
 * @example
 * ```typescript
 * await updateFeedbackStatus('feedback-123', FeedbackStatus.RESOLVED, 'Added 5 more meeting rooms');
 * ```
 */
export declare function updateFeedbackStatus(feedbackId: string, status: FeedbackStatus, resolution?: string): Promise<Feedback>;
/**
 * Upvotes feedback
 *
 * @param feedbackId - Feedback identifier
 * @param employeeId - Employee identifier
 * @returns Updated feedback
 *
 * @example
 * ```typescript
 * await upvoteFeedback('feedback-123', 'emp-456');
 * ```
 */
export declare function upvoteFeedback(feedbackId: string, employeeId: string): Promise<Feedback>;
/**
 * Adds comment to feedback
 *
 * @param feedbackId - Feedback identifier
 * @param commentData - Comment data
 * @returns Updated feedback
 *
 * @example
 * ```typescript
 * await addFeedbackComment('feedback-123', {
 *   userId: 'emp-456',
 *   userName: 'John Doe',
 *   comment: 'Great suggestion!',
 *   isInternal: false
 * });
 * ```
 */
export declare function addFeedbackComment(feedbackId: string, commentData: Omit<FeedbackComment, 'id' | 'feedbackId' | 'createdAt'>): Promise<Feedback>;
/**
 * Creates recognition
 *
 * @param fromEmployeeId - Sender employee identifier
 * @param recognitionData - Recognition data
 * @returns Created recognition
 *
 * @example
 * ```typescript
 * const recognition = await createRecognition('emp-123', {
 *   type: RecognitionType.PEER_RECOGNITION,
 *   fromEmployeeName: 'John Doe',
 *   toEmployeeId: 'emp-456',
 *   toEmployeeName: 'Jane Smith',
 *   title: 'Excellent Teamwork',
 *   message: 'Thanks for your help on the project!',
 *   values: ['collaboration', 'excellence'],
 *   isPublic: true,
 *   reactions: [],
 *   comments: []
 * });
 * ```
 */
export declare function createRecognition(fromEmployeeId: string, recognitionData: Omit<Recognition, 'id' | 'fromEmployeeId' | 'createdAt'>): Promise<Recognition>;
/**
 * Gets recognitions for employee
 *
 * @param employeeId - Employee identifier
 * @param type - Optional type filter
 * @returns List of recognitions
 *
 * @example
 * ```typescript
 * const recognitions = await getEmployeeRecognitions('emp-123');
 * ```
 */
export declare function getEmployeeRecognitions(employeeId: string, type?: RecognitionType): Promise<Recognition[]>;
/**
 * Gets recognition leaderboard
 *
 * @param period - Time period
 * @returns Leaderboard
 *
 * @example
 * ```typescript
 * const leaderboard = await getRecognitionLeaderboard('monthly');
 * ```
 */
export declare function getRecognitionLeaderboard(period: 'weekly' | 'monthly' | 'quarterly' | 'yearly'): Promise<Array<{
    employeeId: string;
    employeeName: string;
    count: number;
    rank: number;
}>>;
/**
 * Reacts to recognition
 *
 * @param recognitionId - Recognition identifier
 * @param employeeId - Employee identifier
 * @param reaction - Reaction type
 * @returns Updated recognition
 *
 * @example
 * ```typescript
 * await reactToRecognition('recognition-123', 'emp-456', 'celebrate');
 * ```
 */
export declare function reactToRecognition(recognitionId: string, employeeId: string, reaction: 'like' | 'love' | 'celebrate' | 'inspire'): Promise<Recognition>;
/**
 * Adds comment to recognition
 *
 * @param recognitionId - Recognition identifier
 * @param employeeId - Employee identifier
 * @param comment - Comment text
 * @returns Updated recognition
 *
 * @example
 * ```typescript
 * await addRecognitionComment('recognition-123', 'emp-456', 'Well deserved!');
 * ```
 */
export declare function addRecognitionComment(recognitionId: string, employeeId: string, comment: string): Promise<Recognition>;
/**
 * Gets recognition feed
 *
 * @param limit - Number of items to return
 * @param offset - Pagination offset
 * @returns Recognition feed
 *
 * @example
 * ```typescript
 * const feed = await getRecognitionFeed(20, 0);
 * ```
 */
export declare function getRecognitionFeed(limit: number, offset: number): Promise<Recognition[]>;
/**
 * Gets recognition analytics
 *
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Recognition analytics
 *
 * @example
 * ```typescript
 * const analytics = await getRecognitionAnalytics(new Date('2025-01-01'), new Date('2025-12-31'));
 * ```
 */
export declare function getRecognitionAnalytics(startDate: Date, endDate: Date): Promise<{
    totalRecognitions: number;
    byType: Record<RecognitionType, number>;
    topRecognizers: Array<{
        employeeId: string;
        count: number;
    }>;
    topRecognized: Array<{
        employeeId: string;
        count: number;
    }>;
    avgMonetaryValue: number;
}>;
/**
 * Creates milestone celebration
 *
 * @param milestoneData - Milestone data
 * @returns Created milestone
 *
 * @example
 * ```typescript
 * const milestone = await createMilestone({
 *   employeeId: 'emp-123',
 *   employeeName: 'John Doe',
 *   type: MilestoneType.WORK_ANNIVERSARY,
 *   title: '5 Year Anniversary',
 *   description: 'Celebrating 5 years with the company',
 *   date: new Date(),
 *   yearsOfService: 5,
 *   isPublic: true,
 *   celebratedBy: []
 * });
 * ```
 */
export declare function createMilestone(milestoneData: Omit<Milestone, 'id' | 'createdAt'>): Promise<Milestone>;
/**
 * Gets upcoming milestones
 *
 * @param days - Number of days to look ahead
 * @returns List of upcoming milestones
 *
 * @example
 * ```typescript
 * const upcoming = await getUpcomingMilestones(30);
 * ```
 */
export declare function getUpcomingMilestones(days: number): Promise<Milestone[]>;
/**
 * Celebrates milestone
 *
 * @param milestoneId - Milestone identifier
 * @param employeeId - Employee identifier celebrating
 * @returns Updated milestone
 *
 * @example
 * ```typescript
 * await celebrateMilestone('milestone-123', 'emp-456');
 * ```
 */
export declare function celebrateMilestone(milestoneId: string, employeeId: string): Promise<Milestone>;
/**
 * Adds gift to milestone
 *
 * @param milestoneId - Milestone identifier
 * @param gift - Gift details
 * @returns Updated milestone
 *
 * @example
 * ```typescript
 * await addMilestoneGift('milestone-123', {
 *   giftType: 'bonus',
 *   description: 'Anniversary bonus',
 *   value: 1000,
 *   currency: 'USD'
 * });
 * ```
 */
export declare function addMilestoneGift(milestoneId: string, gift: MilestoneGift): Promise<Milestone>;
/**
 * Creates social post
 *
 * @param authorId - Author employee identifier
 * @param postData - Post data
 * @returns Created post
 *
 * @example
 * ```typescript
 * const post = await createSocialPost('emp-123', {
 *   authorName: 'John Doe',
 *   content: 'Great team meeting today!',
 *   hashtags: ['teamwork'],
 *   mentions: ['emp-456'],
 *   likes: 0,
 *   comments: [],
 *   shares: 0,
 *   isPublic: true,
 *   isPinned: false
 * });
 * ```
 */
export declare function createSocialPost(authorId: string, postData: Omit<SocialPost, 'id' | 'authorId' | 'createdAt' | 'updatedAt'>): Promise<SocialPost>;
/**
 * Gets social feed
 *
 * @param employeeId - Employee identifier
 * @param limit - Number of posts
 * @param offset - Pagination offset
 * @returns Social feed
 *
 * @example
 * ```typescript
 * const feed = await getSocialFeed('emp-123', 20, 0);
 * ```
 */
export declare function getSocialFeed(employeeId: string, limit: number, offset: number): Promise<SocialPost[]>;
/**
 * Likes social post
 *
 * @param postId - Post identifier
 * @param employeeId - Employee identifier
 * @returns Updated post
 *
 * @example
 * ```typescript
 * await likeSocialPost('post-123', 'emp-456');
 * ```
 */
export declare function likeSocialPost(postId: string, employeeId: string): Promise<SocialPost>;
/**
 * Comments on social post
 *
 * @param postId - Post identifier
 * @param employeeId - Employee identifier
 * @param comment - Comment text
 * @returns Updated post
 *
 * @example
 * ```typescript
 * await commentOnSocialPost('post-123', 'emp-456', 'Great post!');
 * ```
 */
export declare function commentOnSocialPost(postId: string, employeeId: string, comment: string): Promise<SocialPost>;
/**
 * Creates wellbeing program
 *
 * @param programData - Program data
 * @returns Created program
 *
 * @example
 * ```typescript
 * const program = await createWellbeingProgram({
 *   title: 'Mindfulness Challenge',
 *   description: '30-day mindfulness program',
 *   category: WellbeingCategory.MENTAL,
 *   startDate: new Date(),
 *   isActive: true,
 *   activities: [],
 *   participationCount: 0,
 *   targetAudience: ['all'],
 *   resources: []
 * });
 * ```
 */
export declare function createWellbeingProgram(programData: Omit<WellbeingProgram, 'id' | 'createdAt' | 'updatedAt'>): Promise<WellbeingProgram>;
/**
 * Gets active wellbeing programs
 *
 * @param category - Optional category filter
 * @returns List of active programs
 *
 * @example
 * ```typescript
 * const programs = await getActiveWellbeingPrograms(WellbeingCategory.PHYSICAL);
 * ```
 */
export declare function getActiveWellbeingPrograms(category?: WellbeingCategory): Promise<WellbeingProgram[]>;
/**
 * Enrolls in wellbeing program
 *
 * @param programId - Program identifier
 * @param employeeId - Employee identifier
 * @returns Enrollment status
 *
 * @example
 * ```typescript
 * await enrollInWellbeingProgram('program-123', 'emp-456');
 * ```
 */
export declare function enrollInWellbeingProgram(programId: string, employeeId: string): Promise<boolean>;
/**
 * Logs wellbeing activity
 *
 * @param programId - Program identifier
 * @param activityId - Activity identifier
 * @param employeeId - Employee identifier
 * @returns Activity log
 *
 * @example
 * ```typescript
 * await logWellbeingActivity('program-123', 'activity-456', 'emp-789');
 * ```
 */
export declare function logWellbeingActivity(programId: string, activityId: string, employeeId: string): Promise<{
    logged: boolean;
    points?: number;
}>;
/**
 * Gets wellbeing participation metrics
 *
 * @param programId - Program identifier
 * @returns Participation metrics
 *
 * @example
 * ```typescript
 * const metrics = await getWellbeingParticipation('program-123');
 * ```
 */
export declare function getWellbeingParticipation(programId: string): Promise<{
    totalEnrolled: number;
    activeParticipants: number;
    completionRate: number;
}>;
/**
 * Analyzes text sentiment
 *
 * @param text - Text to analyze
 * @param sourceType - Source type
 * @param sourceId - Source identifier
 * @returns Sentiment analysis
 *
 * @example
 * ```typescript
 * const analysis = await analyzeSentiment('I love working here!', 'survey', 'survey-123');
 * ```
 */
export declare function analyzeSentiment(text: string, sourceType: 'survey' | 'feedback' | 'social_post' | 'exit_interview' | 'other', sourceId: string): Promise<SentimentAnalysis>;
/**
 * Gets sentiment trends
 *
 * @param startDate - Start date
 * @param endDate - End date
 * @param segmentBy - Segment type
 * @returns Sentiment trends
 *
 * @example
 * ```typescript
 * const trends = await getSentimentTrends(new Date('2025-01-01'), new Date('2025-12-31'), 'department');
 * ```
 */
export declare function getSentimentTrends(startDate: Date, endDate: Date, segmentBy?: 'department' | 'location' | 'tenure'): Promise<Array<{
    date: Date;
    sentiment: number;
    volume: number;
}>>;
/**
 * Gets sentiment drivers
 *
 * @param sentiment - Sentiment score
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Top drivers
 *
 * @example
 * ```typescript
 * const drivers = await getSentimentDrivers(SentimentScore.NEGATIVE, new Date('2025-01-01'), new Date('2025-12-31'));
 * ```
 */
export declare function getSentimentDrivers(sentiment: SentimentScore, startDate: Date, endDate: Date): Promise<Array<{
    topic: string;
    frequency: number;
    impact: number;
}>>;
/**
 * Creates engagement action plan
 *
 * @param planData - Action plan data
 * @returns Created action plan
 *
 * @example
 * ```typescript
 * const plan = await createEngagementActionPlan({
 *   title: 'Improve Communication',
 *   description: 'Based on survey feedback',
 *   basedOnSurvey: 'survey-123',
 *   priority: 'high',
 *   status: 'draft',
 *   owner: 'mgr-456',
 *   targetMetric: 'Communication Score',
 *   currentValue: 65,
 *   targetValue: 80,
 *   actions: [...],
 *   startDate: new Date(),
 *   targetDate: new Date('2025-12-31'),
 *   progress: 0
 * });
 * ```
 */
export declare function createEngagementActionPlan(planData: Omit<EngagementActionPlan, 'id' | 'createdAt' | 'updatedAt'>): Promise<EngagementActionPlan>;
/**
 * Updates action plan progress
 *
 * @param planId - Plan identifier
 * @param progress - Progress percentage
 * @returns Updated plan
 *
 * @example
 * ```typescript
 * await updateActionPlanProgress('plan-123', 75);
 * ```
 */
export declare function updateActionPlanProgress(planId: string, progress: number): Promise<EngagementActionPlan>;
/**
 * Gets engagement analytics
 *
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Engagement analytics
 *
 * @example
 * ```typescript
 * const analytics = await getEngagementAnalytics(new Date('2025-01-01'), new Date('2025-12-31'));
 * ```
 */
export declare function getEngagementAnalytics(startDate: Date, endDate: Date): Promise<EngagementAnalytics>;
/**
 * Gets engagement heatmap
 *
 * @param segmentBy - Segment type
 * @returns Engagement heatmap
 *
 * @example
 * ```typescript
 * const heatmap = await getEngagementHeatmap('department');
 * ```
 */
export declare function getEngagementHeatmap(segmentBy: 'department' | 'location' | 'role' | 'tenure'): Promise<Array<{
    segment: string;
    score: number;
    color: string;
}>>;
/**
 * Employee Engagement Controller
 * Provides RESTful API endpoints for employee engagement operations
 */
export declare class EmployeeEngagementController {
    /**
     * Get active surveys
     */
    getActive(employeeId: string): Promise<Survey[]>;
    /**
     * Submit survey response
     */
    submitResponse(surveyId: string, responseDto: SubmitSurveyResponseDto): Promise<SurveyResponse>;
    /**
     * Get eNPS score
     */
    getENPS(surveyId: string): Promise<EmployeeNPS>;
    /**
     * Create feedback
     */
    createFeedback(employeeId: string, feedbackDto: CreateFeedbackDto): Promise<Feedback>;
    /**
     * Get recognition feed
     */
    getRecognitionFeed(limit?: number, offset?: number): Promise<Recognition[]>;
    /**
     * Get engagement analytics
     */
    getAnalytics(startDate: string, endDate: string): Promise<EngagementAnalytics>;
}
//# sourceMappingURL=employee-engagement-kit.d.ts.map