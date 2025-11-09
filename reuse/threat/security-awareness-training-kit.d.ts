/**
 * LOC: SATK1234567
 * File: /reuse/threat/security-awareness-training-kit.ts
 *
 * UPSTREAM (imports from):
 *   - Sequelize 6.x ORM
 *   - NestJS 10.x framework
 *   - TypeScript 5.x type definitions
 *
 * DOWNSTREAM (imported by):
 *   - Security awareness service modules
 *   - Training management controllers
 *   - Phishing simulation services
 *   - Security metrics dashboards
 */
/**
 * File: /reuse/threat/security-awareness-training-kit.ts
 * Locator: WC-SEC-SATK-001
 * Purpose: Comprehensive Security Awareness Training Management - Campaign orchestration, phishing simulation, metrics tracking, assessment
 *
 * Upstream: Sequelize models for training campaigns, user assessments, phishing simulations, security culture metrics
 * Downstream: ../backend/security/*, awareness training modules, compliance reporting, security dashboards
 * Dependencies: TypeScript 5.x, Sequelize 6.x, NestJS 10.x, Swagger/OpenAPI
 * Exports: 40 utility functions for security awareness training, phishing simulations, knowledge assessments, behavior analytics
 *
 * LLM Context: Production-ready security awareness training management utilities for White Cross healthcare platform.
 * Provides comprehensive training campaign orchestration, phishing simulation workflows, completion tracking, knowledge
 * assessments, behavioral analytics, security culture measurement, and compliance reporting for HIPAA/healthcare security.
 */
import { WhereOptions, Transaction } from 'sequelize';
import { Model, ModelCtor } from 'sequelize-typescript';
interface TrainingCampaign {
    id: string;
    name: string;
    description: string;
    type: 'onboarding' | 'recurring' | 'targeted' | 'compliance';
    status: 'draft' | 'scheduled' | 'active' | 'completed' | 'cancelled';
    startDate: Date;
    endDate: Date;
    targetAudience: string[];
    mandatoryCompletion: boolean;
    passingScore: number;
    createdAt: Date;
    updatedAt: Date;
}
interface PhishingSimulation {
    id: string;
    campaignId: string;
    templateId: string;
    status: 'scheduled' | 'running' | 'completed' | 'cancelled';
    scheduledAt: Date;
    completedAt?: Date;
    targetedUsers: number;
    emailsSent: number;
    clickedLinks: number;
    reportedPhishing: number;
    compromisedCredentials: number;
    difficulty: 'easy' | 'medium' | 'hard' | 'expert';
}
interface KnowledgeAssessment {
    id: string;
    enrollmentId: string;
    userId: string;
    assessmentType: 'pre_test' | 'post_test' | 'quiz' | 'final_exam';
    questionsTotal: number;
    questionsAnswered: number;
    correctAnswers: number;
    score: number;
    passingScore: number;
    passed: boolean;
    timeSpent: number;
    attemptNumber: number;
    startedAt: Date;
    completedAt?: Date;
}
interface SecurityBehavior {
    id: string;
    userId: string;
    behaviorType: 'phishing_click' | 'phishing_report' | 'policy_violation' | 'security_alert' | 'safe_practice';
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    timestamp: Date;
    contextData: Record<string, any>;
    remediated: boolean;
    remediationDate?: Date;
}
interface SecurityCultureMetrics {
    period: string;
    organizationId: string;
    trainingCompletionRate: number;
    phishingClickRate: number;
    phishingReportRate: number;
    averageAssessmentScore: number;
    repeatOffenders: number;
    securityChampions: number;
    riskScore: number;
    trendDirection: 'improving' | 'stable' | 'declining';
}
interface TrainingMetrics {
    campaignId: string;
    totalEnrolled: number;
    completedCount: number;
    inProgressCount: number;
    overdueCount: number;
    completionRate: number;
    averageScore: number;
    averageTimeToComplete: number;
    passRate: number;
}
interface PhishingMetrics {
    simulationId: string;
    targetedUsers: number;
    emailsSent: number;
    opened: number;
    clickedLink: number;
    submittedData: number;
    reported: number;
    clickRate: number;
    reportRate: number;
    resilienceScore: number;
}
/**
 * 1. Creates a new security awareness training campaign.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {Partial<TrainingCampaign>} campaignData - Campaign configuration
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<TrainingCampaign>} Created campaign
 *
 * @example
 * ```typescript
 * const campaign = await createTrainingCampaign(sequelize, {
 *   name: 'Q1 2024 Security Awareness',
 *   type: 'recurring',
 *   targetAudience: ['all_employees'],
 *   mandatoryCompletion: true,
 *   passingScore: 80,
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-03-31')
 * });
 * ```
 */
export declare const createTrainingCampaign: (TrainingCampaignModel: ModelCtor<Model>, campaignData: Partial<TrainingCampaign>, transaction?: Transaction) => Promise<any>;
/**
 * 2. Retrieves active training campaigns with enrollment statistics.
 *
 * @param {ModelCtor<Model>} CampaignModel - Campaign model
 * @param {ModelCtor<Model>} EnrollmentModel - Enrollment model
 * @param {WhereOptions} [filters] - Optional filters
 * @returns {Promise<any[]>} Active campaigns with stats
 *
 * @example
 * ```typescript
 * const campaigns = await getActiveCampaigns(
 *   TrainingCampaign,
 *   Enrollment,
 *   { type: 'compliance' }
 * );
 * ```
 */
export declare const getActiveCampaigns: (CampaignModel: ModelCtor<Model>, EnrollmentModel: ModelCtor<Model>, filters?: WhereOptions) => Promise<any[]>;
/**
 * 3. Enrolls users in a training campaign with automatic due date calculation.
 *
 * @param {ModelCtor<Model>} EnrollmentModel - Enrollment model
 * @param {string} campaignId - Campaign identifier
 * @param {string[]} userIds - Array of user IDs
 * @param {number} dueDays - Days until due date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Created enrollments
 *
 * @example
 * ```typescript
 * const enrollments = await enrollUsersInCampaign(
 *   Enrollment,
 *   'campaign-123',
 *   ['user-1', 'user-2', 'user-3'],
 *   30
 * );
 * ```
 */
export declare const enrollUsersInCampaign: (EnrollmentModel: ModelCtor<Model>, campaignId: string, userIds: string[], dueDays: number, transaction?: Transaction) => Promise<any[]>;
/**
 * 4. Retrieves overdue training enrollments for reminder notifications.
 *
 * @param {ModelCtor<Model>} EnrollmentModel - Enrollment model
 * @param {number} [gracePeriodDays=0] - Grace period before marking overdue
 * @returns {Promise<any[]>} Overdue enrollments
 *
 * @example
 * ```typescript
 * const overdue = await getOverdueEnrollments(Enrollment, 7);
 * // Returns enrollments overdue by more than 7 days
 * ```
 */
export declare const getOverdueEnrollments: (EnrollmentModel: ModelCtor<Model>, UserModel: ModelCtor<Model>, CampaignModel: ModelCtor<Model>, gracePeriodDays?: number) => Promise<any[]>;
/**
 * 5. Updates training campaign status with validation.
 *
 * @param {ModelCtor<Model>} CampaignModel - Campaign model
 * @param {string} campaignId - Campaign identifier
 * @param {string} newStatus - New status
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<boolean>} Update success
 *
 * @example
 * ```typescript
 * await updateCampaignStatus(Campaign, 'campaign-123', 'active');
 * ```
 */
export declare const updateCampaignStatus: (CampaignModel: ModelCtor<Model>, campaignId: string, newStatus: TrainingCampaign["status"], transaction?: Transaction) => Promise<boolean>;
/**
 * 6. Creates and schedules a phishing simulation campaign.
 *
 * @param {ModelCtor<Model>} SimulationModel - Phishing simulation model
 * @param {Partial<PhishingSimulation>} simulationData - Simulation configuration
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created simulation
 *
 * @example
 * ```typescript
 * const simulation = await createPhishingSimulation(PhishingSimulation, {
 *   campaignId: 'campaign-123',
 *   templateId: 'template-payroll',
 *   scheduledAt: new Date('2024-06-15T09:00:00Z'),
 *   targetedUsers: 500,
 *   difficulty: 'medium'
 * });
 * ```
 */
export declare const createPhishingSimulation: (SimulationModel: ModelCtor<Model>, simulationData: Partial<PhishingSimulation>, transaction?: Transaction) => Promise<any>;
/**
 * 7. Tracks phishing simulation interactions (clicks, reports, credential entry).
 *
 * @param {ModelCtor<Model>} InteractionModel - Interaction tracking model
 * @param {string} simulationId - Simulation identifier
 * @param {string} userId - User identifier
 * @param {string} interactionType - Type of interaction
 * @param {Record<string, any>} [metadata] - Additional context
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Tracked interaction
 *
 * @example
 * ```typescript
 * await trackPhishingInteraction(
 *   PhishingInteraction,
 *   'sim-123',
 *   'user-456',
 *   'clicked_link',
 *   { ipAddress: '192.168.1.100', userAgent: 'Mozilla/5.0...' }
 * );
 * ```
 */
export declare const trackPhishingInteraction: (InteractionModel: ModelCtor<Model>, simulationId: string, userId: string, interactionType: "email_opened" | "clicked_link" | "submitted_credentials" | "reported_phishing", metadata?: Record<string, any>, transaction?: Transaction) => Promise<any>;
/**
 * 8. Calculates phishing simulation metrics and user resilience scores.
 *
 * @param {ModelCtor<Model>} SimulationModel - Simulation model
 * @param {ModelCtor<Model>} InteractionModel - Interaction model
 * @param {string} simulationId - Simulation identifier
 * @returns {Promise<PhishingMetrics>} Simulation metrics
 *
 * @example
 * ```typescript
 * const metrics = await calculatePhishingMetrics(
 *   PhishingSimulation,
 *   PhishingInteraction,
 *   'sim-123'
 * );
 * // { clickRate: 12.5, reportRate: 45.2, resilienceScore: 87.5 }
 * ```
 */
export declare const calculatePhishingMetrics: (SimulationModel: ModelCtor<Model>, InteractionModel: ModelCtor<Model>, simulationId: string) => Promise<PhishingMetrics>;
/**
 * 9. Identifies users who repeatedly fail phishing simulations (high-risk users).
 *
 * @param {ModelCtor<Model>} InteractionModel - Interaction model
 * @param {number} failureThreshold - Number of failures to flag
 * @param {number} daysLookback - Period to analyze
 * @returns {Promise<any[]>} High-risk users
 *
 * @example
 * ```typescript
 * const highRiskUsers = await identifyPhishingPronUsers(
 *   PhishingInteraction,
 *   3, // Failed 3+ simulations
 *   90 // In last 90 days
 * );
 * ```
 */
export declare const identifyPhishingPronUsers: (InteractionModel: ModelCtor<Model>, UserModel: ModelCtor<Model>, failureThreshold: number, daysLookback: number) => Promise<any[]>;
/**
 * 10. Retrieves phishing simulation performance trends over time.
 *
 * @param {ModelCtor<Model>} SimulationModel - Simulation model
 * @param {string} organizationId - Organization identifier
 * @param {number} months - Number of months to analyze
 * @returns {Promise<any[]>} Monthly trend data
 *
 * @example
 * ```typescript
 * const trends = await getPhishingTrends(PhishingSimulation, 'org-123', 12);
 * // Returns monthly click rates, report rates for last 12 months
 * ```
 */
export declare const getPhishingTrends: (SimulationModel: ModelCtor<Model>, InteractionModel: ModelCtor<Model>, organizationId: string, months: number) => Promise<any[]>;
/**
 * 11. Creates a knowledge assessment for a training enrollment.
 *
 * @param {ModelCtor<Model>} AssessmentModel - Assessment model
 * @param {string} enrollmentId - Enrollment identifier
 * @param {string} userId - User identifier
 * @param {string} assessmentType - Type of assessment
 * @param {number} totalQuestions - Number of questions
 * @param {number} passingScore - Passing score threshold
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created assessment
 *
 * @example
 * ```typescript
 * const assessment = await createKnowledgeAssessment(
 *   Assessment,
 *   'enroll-123',
 *   'user-456',
 *   'final_exam',
 *   25,
 *   80
 * );
 * ```
 */
export declare const createKnowledgeAssessment: (AssessmentModel: ModelCtor<Model>, enrollmentId: string, userId: string, assessmentType: KnowledgeAssessment["assessmentType"], totalQuestions: number, passingScore: number, transaction?: Transaction) => Promise<any>;
/**
 * 12. Submits and grades a knowledge assessment.
 *
 * @param {ModelCtor<Model>} AssessmentModel - Assessment model
 * @param {string} assessmentId - Assessment identifier
 * @param {any[]} answers - User answers
 * @param {number} timeSpent - Time spent in seconds
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Graded assessment
 *
 * @example
 * ```typescript
 * const result = await submitAssessment(
 *   Assessment,
 *   'assess-123',
 *   [{ questionId: 'q1', answer: 'B', correct: true }, ...],
 *   1800 // 30 minutes
 * );
 * ```
 */
export declare const submitAssessment: (AssessmentModel: ModelCtor<Model>, assessmentId: string, answers: Array<{
    questionId: string;
    answer: string;
    correct: boolean;
}>, timeSpent: number, transaction?: Transaction) => Promise<any>;
/**
 * 13. Retrieves assessment statistics for a training campaign.
 *
 * @param {ModelCtor<Model>} AssessmentModel - Assessment model
 * @param {string} campaignId - Campaign identifier
 * @returns {Promise<any>} Assessment statistics
 *
 * @example
 * ```typescript
 * const stats = await getAssessmentStatistics(Assessment, 'campaign-123');
 * // { averageScore: 85.2, passRate: 92.5, averageTime: 1200 }
 * ```
 */
export declare const getAssessmentStatistics: (AssessmentModel: ModelCtor<Model>, EnrollmentModel: ModelCtor<Model>, campaignId: string) => Promise<any>;
/**
 * 14. Identifies knowledge gaps based on assessment question performance.
 *
 * @param {ModelCtor<Model>} QuestionResponseModel - Question response model
 * @param {string} campaignId - Campaign identifier
 * @param {number} threshold - Failure threshold percentage
 * @returns {Promise<any[]>} Topics with low performance
 *
 * @example
 * ```typescript
 * const gaps = await identifyKnowledgeGaps(QuestionResponse, 'campaign-123', 50);
 * // Returns topics where <50% of users answered correctly
 * ```
 */
export declare const identifyKnowledgeGaps: (QuestionResponseModel: ModelCtor<Model>, QuestionModel: ModelCtor<Model>, campaignId: string, threshold: number) => Promise<any[]>;
/**
 * 15. Tracks assessment retry attempts and improvement over time.
 *
 * @param {ModelCtor<Model>} AssessmentModel - Assessment model
 * @param {string} enrollmentId - Enrollment identifier
 * @returns {Promise<any[]>} Assessment attempt history
 *
 * @example
 * ```typescript
 * const attempts = await getAssessmentAttemptHistory(Assessment, 'enroll-123');
 * // Shows score progression across attempts
 * ```
 */
export declare const getAssessmentAttemptHistory: (AssessmentModel: ModelCtor<Model>, enrollmentId: string) => Promise<any[]>;
/**
 * 16. Updates enrollment progress and completion status.
 *
 * @param {ModelCtor<Model>} EnrollmentModel - Enrollment model
 * @param {string} enrollmentId - Enrollment identifier
 * @param {number} score - Final assessment score
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated enrollment
 *
 * @example
 * ```typescript
 * await completeEnrollment(Enrollment, 'enroll-123', 92.5);
 * ```
 */
export declare const completeEnrollment: (EnrollmentModel: ModelCtor<Model>, enrollmentId: string, score: number, transaction?: Transaction) => Promise<any>;
/**
 * 17. Calculates training completion metrics for a campaign.
 *
 * @param {ModelCtor<Model>} EnrollmentModel - Enrollment model
 * @param {string} campaignId - Campaign identifier
 * @returns {Promise<TrainingMetrics>} Completion metrics
 *
 * @example
 * ```typescript
 * const metrics = await getTrainingCompletionMetrics(Enrollment, 'campaign-123');
 * // { completionRate: 87.5, averageScore: 85.3, passRate: 92.1 }
 * ```
 */
export declare const getTrainingCompletionMetrics: (EnrollmentModel: ModelCtor<Model>, campaignId: string) => Promise<TrainingMetrics>;
/**
 * 18. Retrieves users approaching training due dates for reminders.
 *
 * @param {ModelCtor<Model>} EnrollmentModel - Enrollment model
 * @param {number} daysBeforeDue - Days before due date to trigger reminder
 * @returns {Promise<any[]>} Enrollments needing reminders
 *
 * @example
 * ```typescript
 * const reminders = await getUpcomingDueDates(Enrollment, 7);
 * // Users with training due in next 7 days
 * ```
 */
export declare const getUpcomingDueDates: (EnrollmentModel: ModelCtor<Model>, UserModel: ModelCtor<Model>, CampaignModel: ModelCtor<Model>, daysBeforeDue: number) => Promise<any[]>;
/**
 * 19. Generates compliance report for completed training.
 *
 * @param {ModelCtor<Model>} EnrollmentModel - Enrollment model
 * @param {string} campaignId - Campaign identifier
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @returns {Promise<any[]>} Compliance report data
 *
 * @example
 * ```typescript
 * const report = await generateComplianceReport(
 *   Enrollment,
 *   'campaign-123',
 *   new Date('2024-01-01'),
 *   new Date('2024-03-31')
 * );
 * ```
 */
export declare const generateComplianceReport: (EnrollmentModel: ModelCtor<Model>, UserModel: ModelCtor<Model>, campaignId: string, startDate: Date, endDate: Date) => Promise<any[]>;
/**
 * 20. Retrieves department-level training completion statistics.
 *
 * @param {ModelCtor<Model>} EnrollmentModel - Enrollment model
 * @param {string} campaignId - Campaign identifier
 * @returns {Promise<any[]>} Department statistics
 *
 * @example
 * ```typescript
 * const deptStats = await getDepartmentCompletionStats(Enrollment, 'campaign-123');
 * // Completion rates grouped by department
 * ```
 */
export declare const getDepartmentCompletionStats: (EnrollmentModel: ModelCtor<Model>, UserModel: ModelCtor<Model>, campaignId: string) => Promise<any[]>;
/**
 * 21. Tracks security behavior events for users.
 *
 * @param {ModelCtor<Model>} BehaviorModel - Security behavior model
 * @param {string} userId - User identifier
 * @param {string} behaviorType - Type of behavior
 * @param {string} severity - Severity level
 * @param {string} description - Event description
 * @param {Record<string, any>} [context] - Additional context
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Tracked behavior event
 *
 * @example
 * ```typescript
 * await trackSecurityBehavior(
 *   SecurityBehavior,
 *   'user-123',
 *   'phishing_click',
 *   'high',
 *   'Clicked link in simulated phishing email',
 *   { simulationId: 'sim-456', templateType: 'credential_harvest' }
 * );
 * ```
 */
export declare const trackSecurityBehavior: (BehaviorModel: ModelCtor<Model>, userId: string, behaviorType: SecurityBehavior["behaviorType"], severity: SecurityBehavior["severity"], description: string, context?: Record<string, any>, transaction?: Transaction) => Promise<any>;
/**
 * 22. Calculates user risk score based on security behaviors.
 *
 * @param {ModelCtor<Model>} BehaviorModel - Security behavior model
 * @param {string} userId - User identifier
 * @param {number} daysLookback - Period to analyze
 * @returns {Promise<number>} Risk score (0-100)
 *
 * @example
 * ```typescript
 * const riskScore = await calculateUserRiskScore(SecurityBehavior, 'user-123', 90);
 * // Returns weighted risk score based on 90 days of behavior
 * ```
 */
export declare const calculateUserRiskScore: (BehaviorModel: ModelCtor<Model>, userId: string, daysLookback: number) => Promise<number>;
/**
 * 23. Identifies security champions (users with exemplary security practices).
 *
 * @param {ModelCtor<Model>} BehaviorModel - Security behavior model
 * @param {number} daysLookback - Period to analyze
 * @param {number} threshold - Minimum positive behaviors
 * @returns {Promise<any[]>} Security champions
 *
 * @example
 * ```typescript
 * const champions = await identifySecurityChampions(SecurityBehavior, 90, 10);
 * // Users with 10+ positive behaviors in 90 days
 * ```
 */
export declare const identifySecurityChampions: (BehaviorModel: ModelCtor<Model>, UserModel: ModelCtor<Model>, daysLookback: number, threshold: number) => Promise<any[]>;
/**
 * 24. Analyzes security behavior patterns to detect anomalies.
 *
 * @param {ModelCtor<Model>} BehaviorModel - Security behavior model
 * @param {string} userId - User identifier
 * @param {number} daysLookback - Period to analyze
 * @returns {Promise<any>} Anomaly detection results
 *
 * @example
 * ```typescript
 * const anomalies = await detectBehaviorAnomalies(SecurityBehavior, 'user-123', 30);
 * // Detects unusual security behavior patterns
 * ```
 */
export declare const detectBehaviorAnomalies: (BehaviorModel: ModelCtor<Model>, userId: string, daysLookback: number) => Promise<any>;
/**
 * 25. Generates behavioral trend report for risk management.
 *
 * @param {ModelCtor<Model>} BehaviorModel - Security behavior model
 * @param {string} organizationId - Organization identifier
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @returns {Promise<any[]>} Behavioral trends
 *
 * @example
 * ```typescript
 * const trends = await getBehaviorTrends(
 *   SecurityBehavior,
 *   'org-123',
 *   new Date('2024-01-01'),
 *   new Date('2024-03-31')
 * );
 * ```
 */
export declare const getBehaviorTrends: (BehaviorModel: ModelCtor<Model>, organizationId: string, startDate: Date, endDate: Date) => Promise<any[]>;
/**
 * 26. Calculates organizational security culture score.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {string} organizationId - Organization identifier
 * @param {Date} startDate - Measurement period start
 * @param {Date} endDate - Measurement period end
 * @returns {Promise<SecurityCultureMetrics>} Culture metrics
 *
 * @example
 * ```typescript
 * const culture = await calculateSecurityCultureScore(
 *   sequelize,
 *   'org-123',
 *   new Date('2024-01-01'),
 *   new Date('2024-03-31')
 * );
 * ```
 */
export declare const calculateSecurityCultureScore: (sequelize: any, organizationId: string, startDate: Date, endDate: Date) => Promise<SecurityCultureMetrics>;
/**
 * 27. Measures security awareness maturity level.
 *
 * @param {ModelCtor<Model>} EnrollmentModel - Enrollment model
 * @param {ModelCtor<Model>} SimulationModel - Simulation model
 * @param {string} organizationId - Organization identifier
 * @returns {Promise<any>} Maturity assessment
 *
 * @example
 * ```typescript
 * const maturity = await measureSecurityMaturity(
 *   Enrollment,
 *   PhishingSimulation,
 *   'org-123'
 * );
 * // Returns maturity level: 1-5 (Initial to Optimized)
 * ```
 */
export declare const measureSecurityMaturity: (EnrollmentModel: ModelCtor<Model>, SimulationModel: ModelCtor<Model>, BehaviorModel: ModelCtor<Model>, organizationId: string) => Promise<any>;
/**
 * 28. Tracks security culture improvement over time.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {string} organizationId - Organization identifier
 * @param {number} months - Number of months to track
 * @returns {Promise<any[]>} Monthly culture trends
 *
 * @example
 * ```typescript
 * const trends = await trackCultureImprovement(sequelize, 'org-123', 12);
 * // Shows 12-month trend of security culture metrics
 * ```
 */
export declare const trackCultureImprovement: (sequelize: any, organizationId: string, months: number) => Promise<any[]>;
/**
 * 29. Generates executive security culture dashboard metrics.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {string} organizationId - Organization identifier
 * @returns {Promise<any>} Executive dashboard data
 *
 * @example
 * ```typescript
 * const dashboard = await generateCultureDashboard(sequelize, 'org-123');
 * // Comprehensive security culture overview for executives
 * ```
 */
export declare const generateCultureDashboard: (sequelize: any, organizationId: string) => Promise<any>;
/**
 * 30. Benchmarks organization against industry security culture standards.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {string} organizationId - Organization identifier
 * @param {string} industry - Industry vertical
 * @returns {Promise<any>} Benchmark comparison
 *
 * @example
 * ```typescript
 * const benchmark = await benchmarkSecurityCulture(
 *   sequelize,
 *   'org-123',
 *   'healthcare'
 * );
 * // Compares org metrics to healthcare industry averages
 * ```
 */
export declare const benchmarkSecurityCulture: (sequelize: any, organizationId: string, industry: string) => Promise<any>;
/**
 * 31. Generates comprehensive training effectiveness report.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {string} campaignId - Campaign identifier
 * @returns {Promise<any>} Effectiveness analysis
 *
 * @example
 * ```typescript
 * const report = await generateTrainingEffectivenessReport(sequelize, 'campaign-123');
 * ```
 */
export declare const generateTrainingEffectivenessReport: (sequelize: any, campaignId: string) => Promise<any>;
/**
 * 32. Analyzes training content effectiveness by topic.
 *
 * @param {ModelCtor<Model>} QuestionResponseModel - Question response model
 * @param {string} campaignId - Campaign identifier
 * @returns {Promise<any[]>} Topic performance analysis
 *
 * @example
 * ```typescript
 * const topicAnalysis = await analyzeTopicEffectiveness(QuestionResponse, 'campaign-123');
 * ```
 */
export declare const analyzeTopicEffectiveness: (QuestionResponseModel: ModelCtor<Model>, QuestionModel: ModelCtor<Model>, campaignId: string) => Promise<any[]>;
/**
 * 33. Identifies optimal training timing based on user performance patterns.
 *
 * @param {ModelCtor<Model>} EnrollmentModel - Enrollment model
 * @param {string} organizationId - Organization identifier
 * @returns {Promise<any>} Optimal training schedule recommendations
 *
 * @example
 * ```typescript
 * const timing = await identifyOptimalTrainingTiming(Enrollment, 'org-123');
 * ```
 */
export declare const identifyOptimalTrainingTiming: (EnrollmentModel: ModelCtor<Model>, organizationId: string) => Promise<any>;
/**
 * 34. Generates personalized training recommendations based on user profile.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {string} userId - User identifier
 * @returns {Promise<any[]>} Personalized training recommendations
 *
 * @example
 * ```typescript
 * const recommendations = await generatePersonalizedTraining(sequelize, 'user-123');
 * ```
 */
export declare const generatePersonalizedTraining: (sequelize: any, userId: string) => Promise<any[]>;
/**
 * 35. Calculates return on investment (ROI) for security training programs.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {string} campaignId - Campaign identifier
 * @param {number} programCost - Total program cost
 * @returns {Promise<any>} ROI analysis
 *
 * @example
 * ```typescript
 * const roi = await calculateTrainingROI(sequelize, 'campaign-123', 50000);
 * ```
 */
export declare const calculateTrainingROI: (sequelize: any, campaignId: string, programCost: number) => Promise<any>;
/**
 * 36. Predicts future security incidents based on training and behavior data.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {string} userId - User identifier
 * @returns {Promise<any>} Risk prediction
 *
 * @example
 * ```typescript
 * const prediction = await predictSecurityIncidentRisk(sequelize, 'user-123');
 * ```
 */
export declare const predictSecurityIncidentRisk: (sequelize: any, userId: string) => Promise<any>;
/**
 * 37. Generates compliance certification report for audit purposes.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {string} organizationId - Organization identifier
 * @param {Date} certificationDate - Certification cutoff date
 * @returns {Promise<any[]>} Certification report
 *
 * @example
 * ```typescript
 * const report = await generateComplianceCertification(
 *   sequelize,
 *   'org-123',
 *   new Date('2024-12-31')
 * );
 * ```
 */
export declare const generateComplianceCertification: (sequelize: any, organizationId: string, certificationDate: Date) => Promise<any[]>;
/**
 * 38. Tracks micro-learning engagement and effectiveness.
 *
 * @param {ModelCtor<Model>} MicroLearningModel - Micro-learning session model
 * @param {string} userId - User identifier
 * @param {number} daysLookback - Period to analyze
 * @returns {Promise<any>} Engagement metrics
 *
 * @example
 * ```typescript
 * const engagement = await trackMicroLearningEngagement(
 *   MicroLearning,
 *   'user-123',
 *   30
 * );
 * ```
 */
export declare const trackMicroLearningEngagement: (MicroLearningModel: ModelCtor<Model>, userId: string, daysLookback: number) => Promise<any>;
/**
 * 39. Analyzes gamification impact on training participation.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {string} organizationId - Organization identifier
 * @returns {Promise<any>} Gamification effectiveness analysis
 *
 * @example
 * ```typescript
 * const impact = await analyzeGamificationImpact(sequelize, 'org-123');
 * ```
 */
export declare const analyzeGamificationImpact: (sequelize: any, organizationId: string) => Promise<any>;
/**
 * 40. Generates automated training reminders and escalations.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {string} organizationId - Organization identifier
 * @returns {Promise<any[]>} Reminder and escalation queue
 *
 * @example
 * ```typescript
 * const reminders = await generateTrainingReminders(sequelize, 'org-123');
 * ```
 */
export declare const generateTrainingReminders: (sequelize: any, organizationId: string) => Promise<any[]>;
export {};
//# sourceMappingURL=security-awareness-training-kit.d.ts.map