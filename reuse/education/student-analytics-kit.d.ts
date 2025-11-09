/**
 * LOC: EDU-ANALYTICS-001
 * File: /reuse/education/student-analytics-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (ORM for database operations)
 *   - @nestjs/common (NestJS framework)
 *   - @nestjs/swagger (API documentation)
 *
 * DOWNSTREAM (imported by):
 *   - Backend education modules
 *   - Analytics dashboards
 *   - Student success services
 *   - Retention management
 */
/**
 * File: /reuse/education/student-analytics-kit.ts
 * Locator: WC-EDU-ANALYTICS-001
 * Purpose: Comprehensive Student Analytics & Predictive Insights - Advanced analytics for student success, retention, engagement, and risk identification
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, TypeScript 5.x
 * Downstream: ../backend/education/*, Analytics Services, Dashboard UI, Student Success Programs
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 45+ functions for student analytics, predictive modeling, retention analysis, engagement tracking, risk assessment
 *
 * LLM Context: Enterprise-grade student analytics system for higher education SIS.
 * Provides comprehensive student success metrics, retention analytics, predictive modeling,
 * cohort analysis, engagement tracking, early warning systems, data visualization helpers,
 * and accessible dashboard interfaces. Designed with UX-first principles for educators,
 * advisors, and administrators to make data-driven decisions about student support.
 */
import { Sequelize } from 'sequelize';
interface StudentSuccessMetrics {
    studentId: number;
    termId: number;
    gpa: number;
    creditsAttempted: number;
    creditsEarned: number;
    completionRate: number;
    attendanceRate: number;
    assignmentCompletionRate: number;
    averageGrade: number;
    courseSuccessRate: number;
    onTrackForGraduation: boolean;
}
interface RetentionMetrics {
    cohortId: string;
    cohortYear: number;
    totalStudents: number;
    retainedFirstYear: number;
    retainedSecondYear: number;
    retainedThirdYear: number;
    retainedFourthYear: number;
    firstYearRetentionRate: number;
    overallRetentionRate: number;
    attritionReasons: Record<string, number>;
}
interface PredictiveAnalytics {
    studentId: number;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    riskScore: number;
    riskFactors: string[];
    interventionRecommendations: string[];
    probabilityOfRetention: number;
    probabilityOfGraduation: number;
    timeToIntervene: string;
    modelVersion: string;
    calculatedAt: Date;
}
interface CohortAnalysis {
    cohortId: string;
    cohortName: string;
    cohortType: 'admission-year' | 'major' | 'demographic' | 'custom';
    studentCount: number;
    averageGPA: number;
    averageCredits: number;
    graduationRate: number;
    retentionRate: number;
    compareToPrevious: number;
    compareToAverage: number;
}
interface EngagementMetrics {
    studentId: number;
    termId: number;
    lmsLoginCount: number;
    lmsTimeSpent: number;
    assignmentsSubmitted: number;
    discussionPosts: number;
    officeHoursAttended: number;
    campusEventsAttended: number;
    libraryVisits: number;
    tutoringSessionsAttended: number;
    engagementScore: number;
    lastActivityDate: Date;
}
interface RiskIndicator {
    indicatorId: string;
    indicatorName: string;
    indicatorType: 'academic' | 'engagement' | 'financial' | 'social' | 'behavioral';
    weight: number;
    threshold: number;
    currentValue: number;
    isTriggered: boolean;
    severity: 'low' | 'medium' | 'high';
    description: string;
}
interface VisualizationData {
    type: 'line' | 'bar' | 'pie' | 'scatter' | 'heatmap' | 'gauge' | 'trend';
    title: string;
    description: string;
    data: any[];
    labels: string[];
    colors: string[];
    accessible: {
        altText: string;
        dataTable: any[];
        screenReaderSummary: string;
    };
    interactive: boolean;
}
interface DashboardConfig {
    dashboardId: string;
    userId: number;
    userRole: string;
    widgets: DashboardWidget[];
    layout: string;
    refreshInterval: number;
    dataFilters: Record<string, any>;
    exportEnabled: boolean;
    shareEnabled: boolean;
}
interface DashboardWidget {
    widgetId: string;
    widgetType: string;
    title: string;
    position: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    dataSource: string;
    filters: Record<string, any>;
    visualizationType: string;
    accessible: boolean;
}
interface AnalyticsTrend {
    metric: string;
    period: string;
    values: number[];
    dates: Date[];
    trend: 'increasing' | 'decreasing' | 'stable';
    percentChange: number;
    projectedValue: number;
    confidence: number;
}
interface InterventionOutcome {
    interventionId: string;
    studentId: number;
    interventionType: string;
    startDate: Date;
    endDate: Date;
    outcome: 'successful' | 'partial' | 'unsuccessful' | 'ongoing';
    metricsImprovement: Record<string, number>;
    cost: number;
    roi: number;
}
export declare class StudentMetricsQueryDto {
    studentId: number;
    termId: number;
    includePredictive?: boolean;
    includeEngagement?: boolean;
}
export declare class CohortAnalysisDto {
    cohortId: string;
    startDate: Date;
    endDate: Date;
    compareCohortId?: string;
    includeDemographics?: boolean;
}
export declare class RiskAssessmentDto {
    studentIds: number[];
    modelVersion: string;
    includeRecommendations?: boolean;
    minRiskLevel?: string;
}
export declare class DashboardConfigDto {
    userId: number;
    userRole: string;
    layout: string;
    widgets: any[];
    refreshInterval?: number;
}
export declare class VisualizationRequestDto {
    type: string;
    metric: string;
    period: string;
    filters?: Record<string, any>;
    accessible?: boolean;
}
/**
 * Sequelize model for Student Metrics tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} StudentMetrics model
 *
 * @example
 * ```typescript
 * const StudentMetrics = createStudentMetricsModel(sequelize);
 * const metrics = await StudentMetrics.create({
 *   studentId: 12345,
 *   termId: 202401,
 *   gpa: 3.75,
 *   completionRate: 95.5,
 *   attendanceRate: 92.0
 * });
 * ```
 */
export declare const createStudentMetricsModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        studentId: number;
        termId: number;
        academicYear: string;
        gpa: number;
        cumulativeGPA: number;
        creditsAttempted: number;
        creditsEarned: number;
        completionRate: number;
        attendanceRate: number;
        assignmentCompletionRate: number;
        averageGrade: number;
        courseSuccessRate: number;
        withdrawalCount: number;
        incompleteCount: number;
        failureCount: number;
        deansList: boolean;
        academicProbation: boolean;
        onTrackForGraduation: boolean;
        projectedGraduationDate: Date | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Retention Data tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} RetentionData model
 */
export declare const createRetentionDataModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        cohortId: string;
        cohortYear: number;
        cohortType: string;
        totalStudents: number;
        retainedFirstYear: number;
        retainedSecondYear: number;
        retainedThirdYear: number;
        retainedFourthYear: number;
        retainedFifthYear: number;
        retainedSixthYear: number;
        firstYearRetentionRate: number;
        secondYearRetentionRate: number;
        thirdYearRetentionRate: number;
        fourthYearRetentionRate: number;
        overallRetentionRate: number;
        attritionReasons: Record<string, number>;
        demographicBreakdown: Record<string, any>;
        interventionsApplied: string[];
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Predictive Analytics.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} PredictiveModel model
 */
export declare const createPredictiveModelModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        studentId: number;
        termId: number;
        riskLevel: string;
        riskScore: number;
        riskFactors: string[];
        academicRiskScore: number;
        engagementRiskScore: number;
        financialRiskScore: number;
        socialRiskScore: number;
        behavioralRiskScore: number;
        interventionRecommendations: string[];
        interventionPriority: number;
        probabilityOfRetention: number;
        probabilityOfGraduation: number;
        probabilityOfAcademicSuccess: number;
        timeToIntervene: string;
        modelVersion: string;
        modelAccuracy: number;
        calculatedAt: Date;
        validUntil: Date;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Analytics Dashboard configuration.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} AnalyticsDashboard model
 */
export declare const createAnalyticsDashboardModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        dashboardId: string;
        userId: number;
        userRole: string;
        dashboardName: string;
        dashboardType: string;
        widgets: any[];
        layout: string;
        refreshInterval: number;
        dataFilters: Record<string, any>;
        dateRange: string;
        exportEnabled: boolean;
        shareEnabled: boolean;
        sharedWith: number[];
        isDefault: boolean;
        isPublic: boolean;
        accessibilityMode: boolean;
        colorScheme: string;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Calculate comprehensive student success metrics for a term.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {number} termId - Term ID
 * @returns {Promise<StudentSuccessMetrics>} Success metrics
 *
 * @example
 * ```typescript
 * const metrics = await calculateStudentSuccessMetrics(sequelize, 12345, 202401);
 * console.log(`GPA: ${metrics.gpa}, Completion Rate: ${metrics.completionRate}%`);
 * ```
 */
export declare function calculateStudentSuccessMetrics(sequelize: Sequelize, studentId: number, termId: number): Promise<StudentSuccessMetrics>;
/**
 * Track student GPA trends over multiple terms with accessible visualization.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {number} numberOfTerms - Number of terms to include
 * @returns {Promise<VisualizationData>} GPA trend visualization
 */
export declare function trackGPATrends(sequelize: Sequelize, studentId: number, numberOfTerms?: number): Promise<VisualizationData>;
/**
 * Identify students on Dean's List based on success criteria.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} termId - Term ID
 * @param {number} minGPA - Minimum GPA threshold (default: 3.5)
 * @param {number} minCredits - Minimum credits threshold (default: 12)
 * @returns {Promise<number[]>} Array of student IDs
 */
export declare function identifyDeansListStudents(sequelize: Sequelize, termId: number, minGPA?: number, minCredits?: number): Promise<number[]>;
/**
 * Identify students on academic probation requiring support.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} termId - Term ID
 * @returns {Promise<StudentSuccessMetrics[]>} Students on probation
 */
export declare function identifyAcademicProbationStudents(sequelize: Sequelize, termId: number): Promise<StudentSuccessMetrics[]>;
/**
 * Calculate course success rate metrics for analytics.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {string} academicYear - Academic year
 * @returns {Promise<number>} Success rate percentage
 */
export declare function calculateCourseSuccessRate(sequelize: Sequelize, studentId: number, academicYear: string): Promise<number>;
/**
 * Generate comparative success metrics across student cohorts.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} termId - Term ID
 * @param {string} cohortType - Cohort grouping type
 * @returns {Promise<CohortAnalysis[]>} Comparative metrics
 */
export declare function generateComparativeSuccessMetrics(sequelize: Sequelize, termId: number, cohortType?: string): Promise<CohortAnalysis[]>;
/**
 * Track assignment completion patterns for engagement analysis.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {number} termId - Term ID
 * @returns {Promise<number>} Assignment completion rate
 */
export declare function trackAssignmentCompletionPatterns(sequelize: Sequelize, studentId: number, termId: number): Promise<number>;
/**
 * Analyze attendance impact on academic success with visualization.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} termId - Term ID
 * @returns {Promise<VisualizationData>} Attendance correlation visualization
 */
export declare function analyzeAttendanceImpact(sequelize: Sequelize, termId: number): Promise<VisualizationData>;
/**
 * Calculate cohort retention rates with year-over-year tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} cohortId - Cohort identifier
 * @returns {Promise<RetentionMetrics>} Retention metrics
 */
export declare function calculateCohortRetentionRates(sequelize: Sequelize, cohortId: string): Promise<RetentionMetrics>;
/**
 * Track first-year retention patterns across multiple cohorts.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} startYear - Starting year
 * @param {number} numberOfYears - Number of years to analyze
 * @returns {Promise<VisualizationData>} First-year retention trends
 */
export declare function trackFirstYearRetention(sequelize: Sequelize, startYear: number, numberOfYears?: number): Promise<VisualizationData>;
/**
 * Analyze attrition reasons for targeted intervention strategies.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} cohortId - Cohort identifier
 * @returns {Promise<Record<string, number>>} Attrition breakdown
 */
export declare function analyzeAttritionReasons(sequelize: Sequelize, cohortId: string): Promise<Record<string, number>>;
/**
 * Compare retention rates across demographic groups.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} cohortYear - Cohort year
 * @returns {Promise<Record<string, any>>} Demographic retention comparison
 */
export declare function compareRetentionByDemographic(sequelize: Sequelize, cohortYear: number): Promise<Record<string, any>>;
/**
 * Identify at-risk cohorts requiring retention interventions.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} thresholdRate - Minimum acceptable retention rate
 * @returns {Promise<string[]>} At-risk cohort IDs
 */
export declare function identifyAtRiskCohorts(sequelize: Sequelize, thresholdRate?: number): Promise<string[]>;
/**
 * Calculate retention ROI for intervention programs.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} cohortId - Cohort identifier
 * @param {number} interventionCost - Total intervention cost
 * @param {number} tuitionRevenue - Annual tuition revenue per student
 * @returns {Promise<number>} ROI percentage
 */
export declare function calculateRetentionROI(sequelize: Sequelize, cohortId: string, interventionCost: number, tuitionRevenue: number): Promise<number>;
/**
 * Generate retention forecast based on historical data.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} cohortYear - Cohort year to forecast
 * @returns {Promise<AnalyticsTrend>} Retention forecast
 */
export declare function generateRetentionForecast(sequelize: Sequelize, cohortYear: number): Promise<AnalyticsTrend>;
/**
 * Run predictive risk assessment model for student success.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {number} termId - Term ID
 * @param {string} modelVersion - Model version to use
 * @returns {Promise<PredictiveAnalytics>} Risk assessment
 */
export declare function runPredictiveRiskAssessment(sequelize: Sequelize, studentId: number, termId: number, modelVersion?: string): Promise<PredictiveAnalytics>;
/**
 * Identify early warning indicators for at-risk students.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {number} termId - Term ID
 * @returns {Promise<RiskIndicator[]>} Triggered risk indicators
 */
export declare function identifyEarlyWarningIndicators(sequelize: Sequelize, studentId: number, termId: number): Promise<RiskIndicator[]>;
/**
 * Calculate probability of student retention with confidence intervals.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {number} termId - Term ID
 * @returns {Promise<{ probability: number; confidence: number }>} Retention probability
 */
export declare function calculateRetentionProbability(sequelize: Sequelize, studentId: number, termId: number): Promise<{
    probability: number;
    confidence: number;
}>;
/**
 * Generate intervention recommendations based on predictive model.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {number} termId - Term ID
 * @returns {Promise<string[]>} Recommended interventions
 */
export declare function generateInterventionRecommendations(sequelize: Sequelize, studentId: number, termId: number): Promise<string[]>;
/**
 * Predict time to graduation for degree planning.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @returns {Promise<{ yearsRemaining: number; projectedDate: Date }>} Graduation prediction
 */
export declare function predictTimeToGraduation(sequelize: Sequelize, studentId: number): Promise<{
    yearsRemaining: number;
    projectedDate: Date;
}>;
/**
 * Assess academic success probability for course planning.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {number} courseId - Course ID
 * @returns {Promise<number>} Success probability percentage
 */
export declare function assessAcademicSuccessProbability(sequelize: Sequelize, studentId: number, courseId: number): Promise<number>;
/**
 * Model impact of interventions on student outcomes.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} interventionType - Type of intervention
 * @param {number[]} studentIds - Student IDs receiving intervention
 * @returns {Promise<Record<string, number>>} Projected impact metrics
 */
export declare function modelInterventionImpact(sequelize: Sequelize, interventionType: string, studentIds: number[]): Promise<Record<string, number>>;
/**
 * Track intervention effectiveness over time with analytics.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} interventionType - Type of intervention
 * @param {Date} startDate - Analysis start date
 * @param {Date} endDate - Analysis end date
 * @returns {Promise<InterventionOutcome[]>} Intervention outcomes
 */
export declare function trackInterventionEffectiveness(sequelize: Sequelize, interventionType: string, startDate: Date, endDate: Date): Promise<InterventionOutcome[]>;
/**
 * Define and create student cohorts for analysis.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} cohortId - Cohort identifier
 * @param {string} cohortType - Type of cohort
 * @param {number[]} studentIds - Student IDs in cohort
 * @returns {Promise<CohortAnalysis>} Created cohort analysis
 */
export declare function defineStudentCohort(sequelize: Sequelize, cohortId: string, cohortType: string, studentIds: number[]): Promise<CohortAnalysis>;
/**
 * Compare performance across multiple cohorts.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string[]} cohortIds - Cohort identifiers to compare
 * @returns {Promise<VisualizationData>} Cohort comparison visualization
 */
export declare function compareCohortsPerformance(sequelize: Sequelize, cohortIds: string[]): Promise<VisualizationData>;
/**
 * Analyze cohort progression through degree programs.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} cohortId - Cohort identifier
 * @returns {Promise<Record<string, number>>} Progression metrics
 */
export declare function analyzeCohortProgression(sequelize: Sequelize, cohortId: string): Promise<Record<string, number>>;
/**
 * Track cohort GPA distribution for performance analysis.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} cohortId - Cohort identifier
 * @param {number} termId - Term ID
 * @returns {Promise<VisualizationData>} GPA distribution visualization
 */
export declare function trackCohortGPADistribution(sequelize: Sequelize, cohortId: string, termId: number): Promise<VisualizationData>;
/**
 * Identify high-performing cohorts for best practice analysis.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} minRetentionRate - Minimum retention rate threshold
 * @returns {Promise<string[]>} High-performing cohort IDs
 */
export declare function identifyHighPerformingCohorts(sequelize: Sequelize, minRetentionRate?: number): Promise<string[]>;
/**
 * Generate cohort benchmarking reports for comparison.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} cohortId - Cohort to benchmark
 * @returns {Promise<Record<string, any>>} Benchmarking data
 */
export declare function generateCohortBenchmarking(sequelize: Sequelize, cohortId: string): Promise<Record<string, any>>;
/**
 * Track student engagement metrics across multiple channels.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {number} termId - Term ID
 * @returns {Promise<EngagementMetrics>} Engagement metrics
 */
export declare function trackStudentEngagement(sequelize: Sequelize, studentId: number, termId: number): Promise<EngagementMetrics>;
/**
 * Calculate engagement score based on multiple activity factors.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {number} termId - Term ID
 * @returns {Promise<number>} Engagement score (0-100)
 */
export declare function calculateEngagementScore(sequelize: Sequelize, studentId: number, termId: number): Promise<number>;
/**
 * Analyze LMS activity patterns for engagement insights.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {number} termId - Term ID
 * @returns {Promise<Record<string, any>>} LMS activity analysis
 */
export declare function analyzeLMSActivityPatterns(sequelize: Sequelize, studentId: number, termId: number): Promise<Record<string, any>>;
/**
 * Monitor discussion board participation for engagement.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {number} termId - Term ID
 * @returns {Promise<Record<string, number>>} Discussion participation metrics
 */
export declare function monitorDiscussionParticipation(sequelize: Sequelize, studentId: number, termId: number): Promise<Record<string, number>>;
/**
 * Track campus involvement for holistic engagement view.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {string} academicYear - Academic year
 * @returns {Promise<Record<string, any>>} Campus involvement data
 */
export declare function trackCampusInvolvement(sequelize: Sequelize, studentId: number, academicYear: string): Promise<Record<string, any>>;
/**
 * Identify disengaged students requiring outreach.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} termId - Term ID
 * @param {number} threshold - Engagement score threshold
 * @returns {Promise<number[]>} Disengaged student IDs
 */
export declare function identifyDisengagedStudents(sequelize: Sequelize, termId: number, threshold?: number): Promise<number[]>;
/**
 * Define custom risk indicators for early warning system.
 *
 * @param {string} indicatorName - Indicator name
 * @param {string} indicatorType - Type of indicator
 * @param {number} weight - Indicator weight
 * @param {number} threshold - Trigger threshold
 * @returns {RiskIndicator} Risk indicator definition
 */
export declare function defineRiskIndicator(indicatorName: string, indicatorType: 'academic' | 'engagement' | 'financial' | 'social' | 'behavioral', weight: number, threshold: number): RiskIndicator;
/**
 * Monitor risk indicator thresholds across student population.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} termId - Term ID
 * @param {RiskIndicator[]} indicators - Risk indicators to monitor
 * @returns {Promise<Record<string, number>>} Triggered indicator counts
 */
export declare function monitorRiskThresholds(sequelize: Sequelize, termId: number, indicators: RiskIndicator[]): Promise<Record<string, number>>;
/**
 * Generate risk heat map for visualization.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} termId - Term ID
 * @returns {Promise<VisualizationData>} Risk heat map
 */
export declare function generateRiskHeatMap(sequelize: Sequelize, termId: number): Promise<VisualizationData>;
/**
 * Create early alert notifications for advisors.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {RiskIndicator[]} triggeredIndicators - Triggered indicators
 * @returns {Promise<Record<string, any>>} Alert notification
 */
export declare function createEarlyAlertNotification(sequelize: Sequelize, studentId: number, triggeredIndicators: RiskIndicator[]): Promise<Record<string, any>>;
/**
 * Track risk indicator trends over time.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} indicatorId - Risk indicator ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<AnalyticsTrend>} Risk indicator trend
 */
export declare function trackRiskIndicatorTrends(sequelize: Sequelize, indicatorId: string, startDate: Date, endDate: Date): Promise<AnalyticsTrend>;
/**
 * Generate accessible chart configuration with WCAG compliance.
 *
 * @param {string} type - Chart type
 * @param {any[]} data - Chart data
 * @param {string[]} labels - Chart labels
 * @param {string} title - Chart title
 * @returns {VisualizationData} Accessible visualization config
 */
export declare function generateAccessibleChart(type: 'line' | 'bar' | 'pie' | 'scatter' | 'heatmap' | 'gauge' | 'trend', data: any[], labels: string[], title: string): VisualizationData;
/**
 * Create color-blind safe visualizations.
 *
 * @param {VisualizationData} visualization - Visualization config
 * @returns {VisualizationData} Color-blind safe visualization
 */
export declare function createColorBlindSafeVisualization(visualization: VisualizationData): VisualizationData;
/**
 * Export visualization data to accessible formats (CSV, JSON, Excel).
 *
 * @param {VisualizationData} visualization - Visualization to export
 * @param {string} format - Export format
 * @returns {string | Record<string, any>} Exported data
 */
export declare function exportVisualizationData(visualization: VisualizationData, format: 'csv' | 'json' | 'excel'): string | Record<string, any>;
/**
 * Generate dashboard summary statistics for quick insights.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} termId - Term ID
 * @returns {Promise<Record<string, any>>} Dashboard summary
 */
export declare function generateDashboardSummary(sequelize: Sequelize, termId: number): Promise<Record<string, any>>;
/**
 * Build interactive dashboard with user preferences and accessibility.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} userId - User ID
 * @param {string} userRole - User role
 * @param {DashboardWidget[]} widgets - Dashboard widgets
 * @returns {Promise<DashboardConfig>} Dashboard configuration
 */
export declare function buildInteractiveDashboard(sequelize: Sequelize, userId: number, userRole: string, widgets: DashboardWidget[]): Promise<DashboardConfig>;
/**
 * Injectable service for Student Analytics operations.
 */
export declare class StudentAnalyticsService {
    private readonly sequelize;
    constructor(sequelize: Sequelize);
    getStudentMetrics(studentId: number, termId: number): Promise<StudentSuccessMetrics>;
    getRiskAssessment(studentId: number, termId: number): Promise<PredictiveAnalytics>;
    getDashboardSummary(termId: number): Promise<Record<string, any>>;
}
export {};
//# sourceMappingURL=student-analytics-kit.d.ts.map