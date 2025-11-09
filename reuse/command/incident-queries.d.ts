/**
 * LOC: INC-Q7Y8Z9
 * File: /reuse/command/incident-queries.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (v6.x)
 *   - @types/node (v18.x)
 *   - ../database/models (Internal)
 *
 * DOWNSTREAM (imported by):
 *   - Incident management services
 *   - Reporting controllers
 *   - Analytics engines
 *   - Compliance audit services
 */
/**
 * File: /reuse/command/incident-queries.ts
 * Locator: WC-CMD-INC-QKIT-001
 * Purpose: Incident Queries Kit - Advanced incident report query functions
 *
 * Upstream: sequelize v6.x, @types/node, incident-report.model.ts
 * Downstream: Incident services, compliance reporting, analytics dashboards
 * Dependencies: Sequelize v6.x, Node 18+, TypeScript 5.x
 * Exports: 50 specialized query functions for incident management and analysis
 *
 * LLM Context: Production-grade Sequelize v6.x incident query kit for White Cross healthcare platform.
 * Provides comprehensive incident report queries including active incident retrieval, historical analysis,
 * pattern detection, multi-criteria filtering, relationship queries, timeline reconstruction, resource
 * consumption tracking, and outcome analysis. Optimized for performance with proper indexing strategies,
 * N+1 query prevention, and HIPAA compliance. Supports complex JOINs, subqueries, CTEs, and aggregations.
 */
import { Model, ModelStatic, Sequelize, Transaction } from 'sequelize';
/**
 * Incident report model interface
 */
export interface IncidentReportModel extends Model {
    id: string;
    studentId: string;
    reportedById: string;
    type: 'INJURY' | 'ILLNESS' | 'BEHAVIORAL' | 'MEDICATION_ERROR' | 'ALLERGIC_REACTION' | 'EMERGENCY' | 'SAFETY' | 'OTHER';
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    status: 'DRAFT' | 'PENDING_REVIEW' | 'UNDER_INVESTIGATION' | 'REQUIRES_ACTION' | 'RESOLVED' | 'CLOSED';
    description: string;
    location: string;
    witnesses: string[];
    actionsTaken: string;
    parentNotified: boolean;
    parentNotificationMethod?: string;
    parentNotifiedAt?: Date;
    parentNotifiedBy?: string;
    followUpRequired: boolean;
    followUpNotes?: string;
    attachments: string[];
    evidencePhotos: string[];
    evidenceVideos: string[];
    insuranceClaimNumber?: string;
    insuranceClaimStatus?: 'NOT_FILED' | 'FILED' | 'PENDING' | 'APPROVED' | 'DENIED' | 'CLOSED';
    legalComplianceStatus: 'PENDING' | 'COMPLIANT' | 'NON_COMPLIANT' | 'UNDER_REVIEW';
    occurredAt: Date;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
/**
 * Incident filter configuration
 */
export interface IncidentFilterConfig {
    types?: string[];
    severities?: string[];
    statuses?: string[];
    studentIds?: string[];
    schoolIds?: string[];
    locations?: string[];
    dateRange?: {
        start: Date;
        end: Date;
    };
    parentNotified?: boolean;
    followUpRequired?: boolean;
    complianceStatus?: string[];
    insuranceClaimStatus?: string[];
    hasEvidence?: boolean;
    searchTerm?: string;
}
/**
 * Incident aggregation result
 */
export interface IncidentAggregation {
    totalIncidents: number;
    byType: Record<string, number>;
    bySeverity: Record<string, number>;
    byStatus: Record<string, number>;
    byLocation: Record<string, number>;
    averageResponseTime?: number;
    complianceRate?: number;
}
/**
 * Timeline event for incident reconstruction
 */
export interface TimelineEvent {
    timestamp: Date;
    eventType: string;
    description: string;
    actor?: string;
    metadata?: any;
}
/**
 * Incident pattern analysis result
 */
export interface IncidentPattern {
    patternType: string;
    frequency: number;
    affectedStudents: string[];
    commonLocations: string[];
    timePatterns: {
        hour: number;
        dayOfWeek: number;
        count: number;
    }[];
    recommendations: string[];
}
/**
 * 1. Retrieves all active incidents with comprehensive details.
 * Includes student, reporter, follow-up actions, and witness statements.
 *
 * @param {ModelStatic<IncidentReportModel>} IncidentReport - Incident report model
 * @param {object} options - Query options
 * @returns {Promise<IncidentReportModel[]>} Active incidents
 *
 * @example
 * ```typescript
 * const activeIncidents = await getActiveIncidents(IncidentReport, {
 *   limit: 50,
 *   includeRelations: true
 * });
 * ```
 */
export declare function getActiveIncidents(IncidentReport: ModelStatic<IncidentReportModel>, options?: {
    limit?: number;
    offset?: number;
    includeRelations?: boolean;
    transaction?: Transaction;
}): Promise<IncidentReportModel[]>;
/**
 * 2. Retrieves critical severity incidents requiring immediate attention.
 * Prioritizes by occurrence time and includes notification status.
 *
 * @param {ModelStatic<IncidentReportModel>} IncidentReport - Incident report model
 * @param {object} options - Query options
 * @returns {Promise<IncidentReportModel[]>} Critical incidents
 *
 * @example
 * ```typescript
 * const critical = await getCriticalIncidents(IncidentReport, {
 *   hoursWindow: 24,
 *   requiresAction: true
 * });
 * ```
 */
export declare function getCriticalIncidents(IncidentReport: ModelStatic<IncidentReportModel>, options?: {
    hoursWindow?: number;
    requiresAction?: boolean;
    transaction?: Transaction;
}): Promise<IncidentReportModel[]>;
/**
 * 3. Retrieves incidents pending parent notification.
 * Identifies incidents where parents haven't been notified within compliance timeframe.
 *
 * @param {ModelStatic<IncidentReportModel>} IncidentReport - Incident report model
 * @param {number} complianceHours - Hours threshold for compliance
 * @returns {Promise<IncidentReportModel[]>} Incidents pending notification
 *
 * @example
 * ```typescript
 * const pendingNotifications = await getIncidentsPendingParentNotification(
 *   IncidentReport,
 *   4
 * );
 * ```
 */
export declare function getIncidentsPendingParentNotification(IncidentReport: ModelStatic<IncidentReportModel>, complianceHours?: number): Promise<IncidentReportModel[]>;
/**
 * 4. Retrieves incidents requiring follow-up actions.
 * Filters for incidents with pending follow-up tasks.
 *
 * @param {ModelStatic<IncidentReportModel>} IncidentReport - Incident report model
 * @param {object} options - Query options
 * @returns {Promise<IncidentReportModel[]>} Incidents requiring follow-up
 *
 * @example
 * ```typescript
 * const followUps = await getIncidentsRequiringFollowUp(IncidentReport, {
 *   daysOverdue: 7,
 *   assignedTo: 'user-id'
 * });
 * ```
 */
export declare function getIncidentsRequiringFollowUp(IncidentReport: ModelStatic<IncidentReportModel>, options?: {
    daysOverdue?: number;
    assignedTo?: string;
    transaction?: Transaction;
}): Promise<IncidentReportModel[]>;
/**
 * 5. Retrieves incidents by student with pagination.
 * Fetches all incidents for a specific student with full history.
 *
 * @param {ModelStatic<IncidentReportModel>} IncidentReport - Incident report model
 * @param {string} studentId - Student identifier
 * @param {object} options - Pagination and filter options
 * @returns {Promise<{ rows: IncidentReportModel[]; count: number }>} Paginated incidents
 *
 * @example
 * ```typescript
 * const { rows, count } = await getIncidentsByStudent(IncidentReport, 'student-123', {
 *   page: 1,
 *   pageSize: 20,
 *   includeResolved: true
 * });
 * ```
 */
export declare function getIncidentsByStudent(IncidentReport: ModelStatic<IncidentReportModel>, studentId: string, options?: {
    page?: number;
    pageSize?: number;
    includeResolved?: boolean;
    transaction?: Transaction;
}): Promise<{
    rows: IncidentReportModel[];
    count: number;
}>;
/**
 * 6. Retrieves incidents by location within a time range.
 * Analyzes incident frequency and patterns at specific locations.
 *
 * @param {ModelStatic<IncidentReportModel>} IncidentReport - Incident report model
 * @param {string} location - Location identifier or pattern
 * @param {object} timeRange - Time range for query
 * @returns {Promise<IncidentReportModel[]>} Location-specific incidents
 *
 * @example
 * ```typescript
 * const cafeteriaIncidents = await getIncidentsByLocation(
 *   IncidentReport,
 *   'Cafeteria',
 *   { start: startDate, end: endDate }
 * );
 * ```
 */
export declare function getIncidentsByLocation(IncidentReport: ModelStatic<IncidentReportModel>, location: string, timeRange: {
    start: Date;
    end: Date;
}): Promise<IncidentReportModel[]>;
/**
 * 7. Retrieves incidents by type with severity distribution.
 * Provides type-specific incidents with severity breakdown.
 *
 * @param {ModelStatic<IncidentReportModel>} IncidentReport - Incident report model
 * @param {string[]} types - Incident types to filter
 * @param {object} options - Query options
 * @returns {Promise<IncidentReportModel[]>} Type-filtered incidents
 *
 * @example
 * ```typescript
 * const medicalIncidents = await getIncidentsByType(
 *   IncidentReport,
 *   ['INJURY', 'ILLNESS', 'ALLERGIC_REACTION'],
 *   { daysBack: 30, minSeverity: 'MEDIUM' }
 * );
 * ```
 */
export declare function getIncidentsByType(IncidentReport: ModelStatic<IncidentReportModel>, types: string[], options?: {
    daysBack?: number;
    minSeverity?: string;
    transaction?: Transaction;
}): Promise<IncidentReportModel[]>;
/**
 * 8. Retrieves incidents with insurance claims.
 * Filters incidents that have insurance claim tracking.
 *
 * @param {ModelStatic<IncidentReportModel>} IncidentReport - Incident report model
 * @param {object} options - Claim status filters
 * @returns {Promise<IncidentReportModel[]>} Incidents with insurance claims
 *
 * @example
 * ```typescript
 * const pendingClaims = await getIncidentsWithInsuranceClaims(IncidentReport, {
 *   claimStatuses: ['FILED', 'PENDING'],
 *   minAmount: 1000
 * });
 * ```
 */
export declare function getIncidentsWithInsuranceClaims(IncidentReport: ModelStatic<IncidentReportModel>, options?: {
    claimStatuses?: string[];
    transaction?: Transaction;
}): Promise<IncidentReportModel[]>;
/**
 * 9. Retrieves incidents with evidence attachments.
 * Finds incidents that have photo, video, or document evidence.
 *
 * @param {ModelStatic<IncidentReportModel>} IncidentReport - Incident report model
 * @param {object} options - Evidence filter options
 * @returns {Promise<IncidentReportModel[]>} Incidents with evidence
 *
 * @example
 * ```typescript
 * const withEvidence = await getIncidentsWithEvidence(IncidentReport, {
 *   evidenceType: 'photos',
 *   minCount: 2
 * });
 * ```
 */
export declare function getIncidentsWithEvidence(IncidentReport: ModelStatic<IncidentReportModel>, options?: {
    evidenceType?: 'photos' | 'videos' | 'attachments' | 'any';
    minCount?: number;
    transaction?: Transaction;
}): Promise<IncidentReportModel[]>;
/**
 * 10. Retrieves incidents by compliance status.
 * Filters incidents based on legal compliance review status.
 *
 * @param {ModelStatic<IncidentReportModel>} IncidentReport - Incident report model
 * @param {string[]} complianceStatuses - Compliance statuses to filter
 * @param {object} options - Query options
 * @returns {Promise<IncidentReportModel[]>} Compliance-filtered incidents
 *
 * @example
 * ```typescript
 * const nonCompliant = await getIncidentsByComplianceStatus(
 *   IncidentReport,
 *   ['NON_COMPLIANT', 'UNDER_REVIEW'],
 *   { daysBack: 60 }
 * );
 * ```
 */
export declare function getIncidentsByComplianceStatus(IncidentReport: ModelStatic<IncidentReportModel>, complianceStatuses: string[], options?: {
    daysBack?: number;
    transaction?: Transaction;
}): Promise<IncidentReportModel[]>;
/**
 * 11. Searches incidents with advanced multi-criteria filtering.
 * Supports complex search with multiple filters and full-text search.
 *
 * @param {ModelStatic<IncidentReportModel>} IncidentReport - Incident report model
 * @param {IncidentFilterConfig} filters - Search filters
 * @param {object} options - Pagination options
 * @returns {Promise<{ rows: IncidentReportModel[]; count: number }>} Search results
 *
 * @example
 * ```typescript
 * const results = await searchIncidentsAdvanced(IncidentReport, {
 *   types: ['INJURY', 'ILLNESS'],
 *   severities: ['HIGH', 'CRITICAL'],
 *   dateRange: { start: new Date('2024-01-01'), end: new Date('2024-12-31') },
 *   searchTerm: 'playground'
 * }, { page: 1, pageSize: 50 });
 * ```
 */
export declare function searchIncidentsAdvanced(IncidentReport: ModelStatic<IncidentReportModel>, filters: IncidentFilterConfig, options?: {
    page?: number;
    pageSize?: number;
    transaction?: Transaction;
}): Promise<{
    rows: IncidentReportModel[];
    count: number;
}>;
/**
 * 12. Retrieves historical incidents for a date range with aggregations.
 * Provides incident history with statistical summaries.
 *
 * @param {ModelStatic<IncidentReportModel>} IncidentReport - Incident report model
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {object} options - Query options
 * @returns {Promise<IncidentReportModel[]>} Historical incidents
 *
 * @example
 * ```typescript
 * const history = await getIncidentHistoryByDateRange(
 *   IncidentReport,
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31'),
 *   { groupBy: 'month' }
 * );
 * ```
 */
export declare function getIncidentHistoryByDateRange(IncidentReport: ModelStatic<IncidentReportModel>, startDate: Date, endDate: Date, options?: {
    includeResolved?: boolean;
    transaction?: Transaction;
}): Promise<IncidentReportModel[]>;
/**
 * 13. Retrieves closed/resolved incidents for archival.
 * Fetches completed incidents with all associated data for archiving.
 *
 * @param {ModelStatic<IncidentReportModel>} IncidentReport - Incident report model
 * @param {object} options - Archive query options
 * @returns {Promise<IncidentReportModel[]>} Closed incidents
 *
 * @example
 * ```typescript
 * const archived = await getClosedIncidentsForArchive(IncidentReport, {
 *   olderThanDays: 365,
 *   includeAllData: true
 * });
 * ```
 */
export declare function getClosedIncidentsForArchive(IncidentReport: ModelStatic<IncidentReportModel>, options?: {
    olderThanDays?: number;
    includeAllData?: boolean;
    transaction?: Transaction;
}): Promise<IncidentReportModel[]>;
/**
 * 14. Retrieves incidents by reporter with performance metrics.
 * Analyzes incident reporting patterns per staff member.
 *
 * @param {ModelStatic<IncidentReportModel>} IncidentReport - Incident report model
 * @param {string} reporterId - Reporter user ID
 * @param {object} options - Query options
 * @returns {Promise<IncidentReportModel[]>} Reporter's incidents
 *
 * @example
 * ```typescript
 * const reporterIncidents = await getIncidentsByReporter(
 *   IncidentReport,
 *   'user-123',
 *   { daysBack: 90, includeMetrics: true }
 * );
 * ```
 */
export declare function getIncidentsByReporter(IncidentReport: ModelStatic<IncidentReportModel>, reporterId: string, options?: {
    daysBack?: number;
    transaction?: Transaction;
}): Promise<IncidentReportModel[]>;
/**
 * 15. Searches incidents by witness involvement.
 * Finds incidents where specific individuals were witnesses.
 *
 * @param {ModelStatic<IncidentReportModel>} IncidentReport - Incident report model
 * @param {string} witnessName - Witness name or identifier
 * @param {object} options - Query options
 * @returns {Promise<IncidentReportModel[]>} Incidents with matching witnesses
 *
 * @example
 * ```typescript
 * const witnessIncidents = await searchIncidentsByWitness(
 *   IncidentReport,
 *   'John Doe',
 *   { daysBack: 180 }
 * );
 * ```
 */
export declare function searchIncidentsByWitness(IncidentReport: ModelStatic<IncidentReportModel>, witnessName: string, options?: {
    daysBack?: number;
    transaction?: Transaction;
}): Promise<IncidentReportModel[]>;
/**
 * 16. Retrieves similar incidents based on pattern matching.
 * Finds incidents with similar characteristics for pattern analysis.
 *
 * @param {ModelStatic<IncidentReportModel>} IncidentReport - Incident report model
 * @param {string} incidentId - Reference incident ID
 * @param {object} options - Similarity criteria
 * @returns {Promise<IncidentReportModel[]>} Similar incidents
 *
 * @example
 * ```typescript
 * const similar = await getSimilarIncidents(IncidentReport, 'incident-123', {
 *   matchType: true,
 *   matchLocation: true,
 *   daysWindow: 30
 * });
 * ```
 */
export declare function getSimilarIncidents(IncidentReport: ModelStatic<IncidentReportModel>, incidentId: string, options?: {
    matchType?: boolean;
    matchLocation?: boolean;
    matchSeverity?: boolean;
    daysWindow?: number;
    transaction?: Transaction;
}): Promise<IncidentReportModel[]>;
/**
 * 17. Retrieves incidents with specific action keywords.
 * Searches actions taken for specific interventions or treatments.
 *
 * @param {ModelStatic<IncidentReportModel>} IncidentReport - Incident report model
 * @param {string[]} keywords - Action keywords to search
 * @param {object} options - Query options
 * @returns {Promise<IncidentReportModel[]>} Incidents with matching actions
 *
 * @example
 * ```typescript
 * const firstAidIncidents = await getIncidentsByActionKeywords(
 *   IncidentReport,
 *   ['first aid', 'ice pack', 'bandage'],
 *   { daysBack: 90 }
 * );
 * ```
 */
export declare function getIncidentsByActionKeywords(IncidentReport: ModelStatic<IncidentReportModel>, keywords: string[], options?: {
    daysBack?: number;
    transaction?: Transaction;
}): Promise<IncidentReportModel[]>;
/**
 * 18. Retrieves incidents modified within a time period.
 * Tracks recent changes to incident reports for audit purposes.
 *
 * @param {ModelStatic<IncidentReportModel>} IncidentReport - Incident report model
 * @param {Date} since - Start date for modifications
 * @param {object} options - Query options
 * @returns {Promise<IncidentReportModel[]>} Recently modified incidents
 *
 * @example
 * ```typescript
 * const recentlyModified = await getRecentlyModifiedIncidents(
 *   IncidentReport,
 *   new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
 *   { includeDeleted: false }
 * );
 * ```
 */
export declare function getRecentlyModifiedIncidents(IncidentReport: ModelStatic<IncidentReportModel>, since: Date, options?: {
    includeDeleted?: boolean;
    transaction?: Transaction;
}): Promise<IncidentReportModel[]>;
/**
 * 19. Searches incidents by description content.
 * Performs full-text search on incident descriptions.
 *
 * @param {ModelStatic<IncidentReportModel>} IncidentReport - Incident report model
 * @param {string} searchQuery - Search query string
 * @param {object} options - Search options
 * @returns {Promise<IncidentReportModel[]>} Matching incidents
 *
 * @example
 * ```typescript
 * const results = await searchIncidentsByDescription(
 *   IncidentReport,
 *   'fell from playground equipment',
 *   { limit: 50, caseSensitive: false }
 * );
 * ```
 */
export declare function searchIncidentsByDescription(IncidentReport: ModelStatic<IncidentReportModel>, searchQuery: string, options?: {
    limit?: number;
    caseSensitive?: boolean;
    transaction?: Transaction;
}): Promise<IncidentReportModel[]>;
/**
 * 20. Retrieves draft incidents for completion.
 * Finds incomplete incident reports that need finalization.
 *
 * @param {ModelStatic<IncidentReportModel>} IncidentReport - Incident report model
 * @param {object} options - Query options
 * @returns {Promise<IncidentReportModel[]>} Draft incidents
 *
 * @example
 * ```typescript
 * const drafts = await getDraftIncidents(IncidentReport, {
 *   olderThanHours: 24,
 *   assignedTo: 'user-123'
 * });
 * ```
 */
export declare function getDraftIncidents(IncidentReport: ModelStatic<IncidentReportModel>, options?: {
    olderThanHours?: number;
    transaction?: Transaction;
}): Promise<IncidentReportModel[]>;
/**
 * 21. Analyzes incident trends by time period.
 * Provides temporal analysis of incident occurrence patterns.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {object} options - Analysis options
 * @returns {Promise<any[]>} Trend analysis results
 *
 * @example
 * ```typescript
 * const trends = await analyzeIncidentTrendsByTimePeriod(sequelize, {
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31'),
 *   groupBy: 'month'
 * });
 * ```
 */
export declare function analyzeIncidentTrendsByTimePeriod(sequelize: Sequelize, options: {
    startDate: Date;
    endDate: Date;
    groupBy: 'hour' | 'day' | 'week' | 'month' | 'quarter';
    transaction?: Transaction;
}): Promise<any[]>;
/**
 * 22. Identifies recurring incident patterns for specific students.
 * Detects students with multiple incidents and patterns.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {object} options - Pattern detection options
 * @returns {Promise<any[]>} Recurring pattern analysis
 *
 * @example
 * ```typescript
 * const patterns = await identifyRecurringIncidentPatterns(sequelize, {
 *   minIncidents: 3,
 *   daysWindow: 90,
 *   incidentTypes: ['INJURY', 'BEHAVIORAL']
 * });
 * ```
 */
export declare function identifyRecurringIncidentPatterns(sequelize: Sequelize, options?: {
    minIncidents?: number;
    daysWindow?: number;
    incidentTypes?: string[];
    transaction?: Transaction;
}): Promise<any[]>;
/**
 * 23. Analyzes incident hotspots by location.
 * Identifies locations with high incident frequency.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {object} options - Hotspot analysis options
 * @returns {Promise<any[]>} Location hotspot analysis
 *
 * @example
 * ```typescript
 * const hotspots = await analyzeIncidentHotspotsByLocation(sequelize, {
 *   daysBack: 180,
 *   minIncidents: 5,
 *   severityThreshold: 'MEDIUM'
 * });
 * ```
 */
export declare function analyzeIncidentHotspotsByLocation(sequelize: Sequelize, options?: {
    daysBack?: number;
    minIncidents?: number;
    transaction?: Transaction;
}): Promise<any[]>;
/**
 * 24. Detects incident clusters by time and location.
 * Identifies spatial-temporal incident clustering.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {object} options - Clustering options
 * @returns {Promise<any[]>} Incident clusters
 *
 * @example
 * ```typescript
 * const clusters = await detectIncidentClusters(sequelize, {
 *   timeWindowHours: 24,
 *   minClusterSize: 3,
 *   daysBack: 90
 * });
 * ```
 */
export declare function detectIncidentClusters(sequelize: Sequelize, options?: {
    timeWindowHours?: number;
    minClusterSize?: number;
    daysBack?: number;
    transaction?: Transaction;
}): Promise<any[]>;
/**
 * 25. Analyzes incident correlation with time of day.
 * Determines peak incident times and patterns.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {object} options - Time analysis options
 * @returns {Promise<any[]>} Time-of-day analysis
 *
 * @example
 * ```typescript
 * const timePatterns = await analyzeIncidentTimeOfDayPatterns(sequelize, {
 *   daysBack: 180,
 *   groupByHour: true
 * });
 * ```
 */
export declare function analyzeIncidentTimeOfDayPatterns(sequelize: Sequelize, options?: {
    daysBack?: number;
    transaction?: Transaction;
}): Promise<any[]>;
/**
 * 26. Analyzes incident type distribution and trends.
 * Provides comprehensive breakdown of incident types over time.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {object} options - Distribution analysis options
 * @returns {Promise<any[]>} Type distribution analysis
 *
 * @example
 * ```typescript
 * const distribution = await analyzeIncidentTypeDistribution(sequelize, {
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31'),
 *   compareWithPriorPeriod: true
 * });
 * ```
 */
export declare function analyzeIncidentTypeDistribution(sequelize: Sequelize, options: {
    startDate: Date;
    endDate: Date;
    transaction?: Transaction;
}): Promise<any[]>;
/**
 * 27. Identifies students at high risk based on incident history.
 * Risk scoring based on frequency, severity, and pattern.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {object} options - Risk analysis options
 * @returns {Promise<any[]>} High-risk student analysis
 *
 * @example
 * ```typescript
 * const highRisk = await identifyHighRiskStudents(sequelize, {
 *   daysBack: 90,
 *   minIncidents: 2,
 *   severityWeights: { CRITICAL: 10, HIGH: 5, MEDIUM: 2, LOW: 1 }
 * });
 * ```
 */
export declare function identifyHighRiskStudents(sequelize: Sequelize, options?: {
    daysBack?: number;
    minIncidents?: number;
    transaction?: Transaction;
}): Promise<any[]>;
/**
 * 28. Analyzes seasonal incident patterns.
 * Identifies seasonal trends and variations.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {object} options - Seasonal analysis options
 * @returns {Promise<any[]>} Seasonal pattern analysis
 *
 * @example
 * ```typescript
 * const seasonalPatterns = await analyzeSeasonalIncidentPatterns(sequelize, {
 *   years: 2,
 *   groupBy: 'quarter'
 * });
 * ```
 */
export declare function analyzeSeasonalIncidentPatterns(sequelize: Sequelize, options?: {
    years?: number;
    transaction?: Transaction;
}): Promise<any[]>;
/**
 * 29. Analyzes incident resolution patterns and timeframes.
 * Tracks how quickly incidents are resolved by type and severity.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {object} options - Resolution analysis options
 * @returns {Promise<any[]>} Resolution pattern analysis
 *
 * @example
 * ```typescript
 * const resolutionMetrics = await analyzeIncidentResolutionPatterns(sequelize, {
 *   daysBack: 180,
 *   includeOpen: false
 * });
 * ```
 */
export declare function analyzeIncidentResolutionPatterns(sequelize: Sequelize, options?: {
    daysBack?: number;
    transaction?: Transaction;
}): Promise<any[]>;
/**
 * 30. Detects anomalous incident patterns.
 * Identifies unusual spikes or patterns requiring attention.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {object} options - Anomaly detection options
 * @returns {Promise<any[]>} Anomaly detection results
 *
 * @example
 * ```typescript
 * const anomalies = await detectAnomalousIncidentPatterns(sequelize, {
 *   stdDeviationThreshold: 2,
 *   daysBack: 365
 * });
 * ```
 */
export declare function detectAnomalousIncidentPatterns(sequelize: Sequelize, options?: {
    stdDeviationThreshold?: number;
    daysBack?: number;
    transaction?: Transaction;
}): Promise<any[]>;
/**
 * 31. Builds complex filtered query with multiple criteria.
 * Combines multiple filter conditions for advanced searching.
 *
 * @param {ModelStatic<IncidentReportModel>} IncidentReport - Incident report model
 * @param {object} criteria - Complex filter criteria
 * @returns {Promise<IncidentReportModel[]>} Filtered incidents
 *
 * @example
 * ```typescript
 * const results = await buildComplexIncidentFilter(IncidentReport, {
 *   severity: ['HIGH', 'CRITICAL'],
 *   types: ['INJURY', 'EMERGENCY'],
 *   notificationStatus: 'pending',
 *   evidenceRequired: true,
 *   dateRange: { start: startDate, end: endDate }
 * });
 * ```
 */
export declare function buildComplexIncidentFilter(IncidentReport: ModelStatic<IncidentReportModel>, criteria: {
    severity?: string[];
    types?: string[];
    statuses?: string[];
    notificationStatus?: 'notified' | 'pending' | 'any';
    evidenceRequired?: boolean;
    followUpStatus?: 'required' | 'not-required' | 'completed';
    complianceIssues?: boolean;
    dateRange?: {
        start: Date;
        end: Date;
    };
    locations?: string[];
    studentIds?: string[];
    transaction?: Transaction;
}): Promise<IncidentReportModel[]>;
/**
 * 32. Retrieves incidents with complex relationship filtering.
 * Filters based on related entities and their properties.
 *
 * @param {ModelStatic<IncidentReportModel>} IncidentReport - Incident report model
 * @param {object} relationFilters - Relationship filter criteria
 * @returns {Promise<IncidentReportModel[]>} Filtered incidents
 *
 * @example
 * ```typescript
 * const results = await getIncidentsWithRelationshipFilters(IncidentReport, {
 *   studentGrade: ['9', '10'],
 *   reporterRole: 'nurse',
 *   hasWitnessStatements: true,
 *   followUpActionsPending: true
 * });
 * ```
 */
export declare function getIncidentsWithRelationshipFilters(IncidentReport: ModelStatic<IncidentReportModel>, relationFilters: {
    studentGrade?: string[];
    schoolId?: string;
    hasWitnessStatements?: boolean;
    followUpActionsPending?: boolean;
    transaction?: Transaction;
}): Promise<IncidentReportModel[]>;
/**
 * 33. Aggregates incidents by multiple dimensions.
 * Provides multi-dimensional aggregation for analysis.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {object} dimensions - Aggregation dimensions
 * @returns {Promise<any[]>} Multi-dimensional aggregation
 *
 * @example
 * ```typescript
 * const aggregated = await aggregateIncidentsByDimensions(sequelize, {
 *   dimensions: ['type', 'severity', 'location'],
 *   dateRange: { start: startDate, end: endDate },
 *   metrics: ['count', 'avgResolutionTime']
 * });
 * ```
 */
export declare function aggregateIncidentsByDimensions(sequelize: Sequelize, dimensions: {
    groupBy: ('type' | 'severity' | 'status' | 'location')[];
    dateRange?: {
        start: Date;
        end: Date;
    };
    transaction?: Transaction;
}): Promise<any[]>;
/**
 * 34. Retrieves incidents with advanced sorting options.
 * Supports multi-field sorting with custom priorities.
 *
 * @param {ModelStatic<IncidentReportModel>} IncidentReport - Incident report model
 * @param {object} sortOptions - Sorting configuration
 * @returns {Promise<IncidentReportModel[]>} Sorted incidents
 *
 * @example
 * ```typescript
 * const sorted = await getIncidentsWithAdvancedSorting(IncidentReport, {
 *   primarySort: 'severity',
 *   secondarySort: 'occurredAt',
 *   direction: 'DESC',
 *   nullsLast: true
 * });
 * ```
 */
export declare function getIncidentsWithAdvancedSorting(IncidentReport: ModelStatic<IncidentReportModel>, sortOptions: {
    primarySort: string;
    secondarySort?: string;
    tertiarySort?: string;
    direction?: 'ASC' | 'DESC';
    limit?: number;
    transaction?: Transaction;
}): Promise<IncidentReportModel[]>;
/**
 * 35. Performs bulk status update on incidents.
 * Updates multiple incidents with status transitions.
 *
 * @param {ModelStatic<IncidentReportModel>} IncidentReport - Incident report model
 * @param {object} updateCriteria - Update criteria
 * @returns {Promise<number>} Number of updated records
 *
 * @example
 * ```typescript
 * const updated = await bulkUpdateIncidentStatus(IncidentReport, {
 *   incidentIds: ['id1', 'id2', 'id3'],
 *   newStatus: 'RESOLVED',
 *   updatedBy: 'user-123'
 * });
 * ```
 */
export declare function bulkUpdateIncidentStatus(IncidentReport: ModelStatic<IncidentReportModel>, updateCriteria: {
    incidentIds: string[];
    newStatus: string;
    updatedBy?: string;
    transaction?: Transaction;
}): Promise<number>;
/**
 * 36. Retrieves incident summary statistics.
 * Provides comprehensive statistical overview.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {object} options - Summary options
 * @returns {Promise<IncidentAggregation>} Summary statistics
 *
 * @example
 * ```typescript
 * const summary = await getIncidentSummaryStatistics(sequelize, {
 *   dateRange: { start: startDate, end: endDate },
 *   includeComplianceMetrics: true
 * });
 * ```
 */
export declare function getIncidentSummaryStatistics(sequelize: Sequelize, options?: {
    dateRange?: {
        start: Date;
        end: Date;
    };
    transaction?: Transaction;
}): Promise<IncidentAggregation>;
/**
 * 37. Exports incidents for reporting with custom fields.
 * Prepares incident data for external reporting.
 *
 * @param {ModelStatic<IncidentReportModel>} IncidentReport - Incident report model
 * @param {object} exportOptions - Export configuration
 * @returns {Promise<any[]>} Formatted export data
 *
 * @example
 * ```typescript
 * const exportData = await exportIncidentsForReporting(IncidentReport, {
 *   dateRange: { start: startDate, end: endDate },
 *   fields: ['id', 'type', 'severity', 'occurredAt', 'student', 'description'],
 *   format: 'csv'
 * });
 * ```
 */
export declare function exportIncidentsForReporting(IncidentReport: ModelStatic<IncidentReportModel>, exportOptions: {
    dateRange?: {
        start: Date;
        end: Date;
    };
    fields?: string[];
    includeRelations?: boolean;
    transaction?: Transaction;
}): Promise<any[]>;
/**
 * 38. Retrieves incidents requiring compliance review.
 * Identifies incidents needing compliance officer attention.
 *
 * @param {ModelStatic<IncidentReportModel>} IncidentReport - Incident report model
 * @param {object} options - Review criteria
 * @returns {Promise<IncidentReportModel[]>} Incidents for review
 *
 * @example
 * ```typescript
 * const forReview = await getIncidentsRequiringComplianceReview(IncidentReport, {
 *   daysOverdue: 5,
 *   severity: ['HIGH', 'CRITICAL']
 * });
 * ```
 */
export declare function getIncidentsRequiringComplianceReview(IncidentReport: ModelStatic<IncidentReportModel>, options?: {
    daysOverdue?: number;
    severity?: string[];
    transaction?: Transaction;
}): Promise<IncidentReportModel[]>;
/**
 * 39. Searches incidents across multiple schools.
 * District-level incident search and analysis.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {object} searchCriteria - Multi-school search criteria
 * @returns {Promise<any[]>} Cross-school incident results
 *
 * @example
 * ```typescript
 * const districtIncidents = await searchIncidentsAcrossSchools(sequelize, {
 *   schoolIds: ['school1', 'school2', 'school3'],
 *   type: 'INJURY',
 *   dateRange: { start: startDate, end: endDate }
 * });
 * ```
 */
export declare function searchIncidentsAcrossSchools(sequelize: Sequelize, searchCriteria: {
    schoolIds: string[];
    type?: string;
    severity?: string[];
    dateRange?: {
        start: Date;
        end: Date;
    };
    transaction?: Transaction;
}): Promise<any[]>;
/**
 * 40. Retrieves incidents with pagination and advanced filtering.
 * Comprehensive paginated query with all filter options.
 *
 * @param {ModelStatic<IncidentReportModel>} IncidentReport - Incident report model
 * @param {object} options - Comprehensive query options
 * @returns {Promise<{ rows: IncidentReportModel[]; count: number; page: number; totalPages: number }>} Paginated results
 *
 * @example
 * ```typescript
 * const paginated = await getPaginatedIncidentsWithFilters(IncidentReport, {
 *   page: 1,
 *   pageSize: 25,
 *   filters: { severity: ['HIGH', 'CRITICAL'], type: 'INJURY' },
 *   sortBy: 'occurredAt',
 *   sortOrder: 'DESC'
 * });
 * ```
 */
export declare function getPaginatedIncidentsWithFilters(IncidentReport: ModelStatic<IncidentReportModel>, options: {
    page?: number;
    pageSize?: number;
    filters?: IncidentFilterConfig;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
    transaction?: Transaction;
}): Promise<{
    rows: IncidentReportModel[];
    count: number;
    page: number;
    totalPages: number;
}>;
/**
 * 41. Reconstructs incident timeline with all events.
 * Creates chronological event sequence for incident investigation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} incidentId - Incident identifier
 * @returns {Promise<TimelineEvent[]>} Timeline events
 *
 * @example
 * ```typescript
 * const timeline = await reconstructIncidentTimeline(sequelize, 'incident-123');
 * ```
 */
export declare function reconstructIncidentTimeline(sequelize: Sequelize, incidentId: string): Promise<TimelineEvent[]>;
/**
 * 42. Analyzes incident outcomes by type and severity.
 * Tracks resolution outcomes and success metrics.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {object} options - Analysis options
 * @returns {Promise<any[]>} Outcome analysis
 *
 * @example
 * ```typescript
 * const outcomes = await analyzeIncidentOutcomes(sequelize, {
 *   daysBack: 180,
 *   groupBy: 'type'
 * });
 * ```
 */
export declare function analyzeIncidentOutcomes(sequelize: Sequelize, options?: {
    daysBack?: number;
    transaction?: Transaction;
}): Promise<any[]>;
/**
 * 43. Calculates response time metrics for incidents.
 * Measures time from occurrence to notification/resolution.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {object} options - Metric calculation options
 * @returns {Promise<any[]>} Response time metrics
 *
 * @example
 * ```typescript
 * const metrics = await calculateIncidentResponseTimeMetrics(sequelize, {
 *   daysBack: 90,
 *   byType: true,
 *   bySeverity: true
 * });
 * ```
 */
export declare function calculateIncidentResponseTimeMetrics(sequelize: Sequelize, options?: {
    daysBack?: number;
    transaction?: Transaction;
}): Promise<any[]>;
/**
 * 44. Analyzes follow-up action completion rates.
 * Tracks effectiveness of follow-up processes.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {object} options - Analysis options
 * @returns {Promise<any[]>} Follow-up completion analysis
 *
 * @example
 * ```typescript
 * const followUpStats = await analyzeFollowUpCompletionRates(sequelize, {
 *   daysBack: 90,
 *   groupByType: true
 * });
 * ```
 */
export declare function analyzeFollowUpCompletionRates(sequelize: Sequelize, options?: {
    daysBack?: number;
    transaction?: Transaction;
}): Promise<any[]>;
/**
 * 45. Retrieves incidents with delayed parent notification.
 * Identifies compliance gaps in notification timelines.
 *
 * @param {ModelStatic<IncidentReportModel>} IncidentReport - Incident report model
 * @param {number} thresholdMinutes - Notification threshold in minutes
 * @returns {Promise<IncidentReportModel[]>} Delayed notification incidents
 *
 * @example
 * ```typescript
 * const delayed = await getIncidentsWithDelayedNotification(IncidentReport, 60);
 * ```
 */
export declare function getIncidentsWithDelayedNotification(IncidentReport: ModelStatic<IncidentReportModel>, thresholdMinutes?: number): Promise<IncidentReportModel[]>;
/**
 * 46. Analyzes incident resource consumption.
 * Tracks staff time, follow-ups, and resource allocation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {object} options - Resource analysis options
 * @returns {Promise<any[]>} Resource consumption metrics
 *
 * @example
 * ```typescript
 * const resources = await analyzeIncidentResourceConsumption(sequelize, {
 *   daysBack: 90,
 *   groupByReporter: true
 * });
 * ```
 */
export declare function analyzeIncidentResourceConsumption(sequelize: Sequelize, options?: {
    daysBack?: number;
    transaction?: Transaction;
}): Promise<any[]>;
/**
 * 47. Generates incident recurrence prediction data.
 * Identifies factors associated with recurring incidents.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {object} options - Prediction analysis options
 * @returns {Promise<any[]>} Recurrence prediction factors
 *
 * @example
 * ```typescript
 * const predictions = await generateIncidentRecurrencePrediction(sequelize, {
 *   lookbackDays: 180,
 *   minOccurrences: 2
 * });
 * ```
 */
export declare function generateIncidentRecurrencePrediction(sequelize: Sequelize, options?: {
    lookbackDays?: number;
    minOccurrences?: number;
    transaction?: Transaction;
}): Promise<any[]>;
/**
 * 48. Analyzes compliance violation patterns.
 * Identifies systemic compliance issues.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {object} options - Compliance analysis options
 * @returns {Promise<any[]>} Compliance violation patterns
 *
 * @example
 * ```typescript
 * const violations = await analyzeComplianceViolationPatterns(sequelize, {
 *   daysBack: 90,
 *   severityThreshold: 'HIGH'
 * });
 * ```
 */
export declare function analyzeComplianceViolationPatterns(sequelize: Sequelize, options?: {
    daysBack?: number;
    transaction?: Transaction;
}): Promise<any[]>;
/**
 * 49. Retrieves incident trends for dashboard visualization.
 * Optimized query for real-time dashboard metrics.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {object} options - Dashboard query options
 * @returns {Promise<any>} Dashboard metrics
 *
 * @example
 * ```typescript
 * const dashboardData = await getIncidentDashboardMetrics(sequelize, {
 *   period: 'last-30-days'
 * });
 * ```
 */
export declare function getIncidentDashboardMetrics(sequelize: Sequelize, options?: {
    period?: 'today' | 'last-7-days' | 'last-30-days' | 'last-90-days';
    transaction?: Transaction;
}): Promise<any>;
/**
 * 50. Retrieves comprehensive incident report with all related data.
 * Full incident details for investigation and reporting.
 *
 * @param {ModelStatic<IncidentReportModel>} IncidentReport - Incident report model
 * @param {string} incidentId - Incident identifier
 * @returns {Promise<IncidentReportModel | null>} Complete incident report
 *
 * @example
 * ```typescript
 * const fullReport = await getComprehensiveIncidentReport(IncidentReport, 'incident-123');
 * ```
 */
export declare function getComprehensiveIncidentReport(IncidentReport: ModelStatic<IncidentReportModel>, incidentId: string): Promise<IncidentReportModel | null>;
//# sourceMappingURL=incident-queries.d.ts.map