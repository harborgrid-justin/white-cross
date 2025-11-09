"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActiveIncidents = getActiveIncidents;
exports.getCriticalIncidents = getCriticalIncidents;
exports.getIncidentsPendingParentNotification = getIncidentsPendingParentNotification;
exports.getIncidentsRequiringFollowUp = getIncidentsRequiringFollowUp;
exports.getIncidentsByStudent = getIncidentsByStudent;
exports.getIncidentsByLocation = getIncidentsByLocation;
exports.getIncidentsByType = getIncidentsByType;
exports.getIncidentsWithInsuranceClaims = getIncidentsWithInsuranceClaims;
exports.getIncidentsWithEvidence = getIncidentsWithEvidence;
exports.getIncidentsByComplianceStatus = getIncidentsByComplianceStatus;
exports.searchIncidentsAdvanced = searchIncidentsAdvanced;
exports.getIncidentHistoryByDateRange = getIncidentHistoryByDateRange;
exports.getClosedIncidentsForArchive = getClosedIncidentsForArchive;
exports.getIncidentsByReporter = getIncidentsByReporter;
exports.searchIncidentsByWitness = searchIncidentsByWitness;
exports.getSimilarIncidents = getSimilarIncidents;
exports.getIncidentsByActionKeywords = getIncidentsByActionKeywords;
exports.getRecentlyModifiedIncidents = getRecentlyModifiedIncidents;
exports.searchIncidentsByDescription = searchIncidentsByDescription;
exports.getDraftIncidents = getDraftIncidents;
exports.analyzeIncidentTrendsByTimePeriod = analyzeIncidentTrendsByTimePeriod;
exports.identifyRecurringIncidentPatterns = identifyRecurringIncidentPatterns;
exports.analyzeIncidentHotspotsByLocation = analyzeIncidentHotspotsByLocation;
exports.detectIncidentClusters = detectIncidentClusters;
exports.analyzeIncidentTimeOfDayPatterns = analyzeIncidentTimeOfDayPatterns;
exports.analyzeIncidentTypeDistribution = analyzeIncidentTypeDistribution;
exports.identifyHighRiskStudents = identifyHighRiskStudents;
exports.analyzeSeasonalIncidentPatterns = analyzeSeasonalIncidentPatterns;
exports.analyzeIncidentResolutionPatterns = analyzeIncidentResolutionPatterns;
exports.detectAnomalousIncidentPatterns = detectAnomalousIncidentPatterns;
exports.buildComplexIncidentFilter = buildComplexIncidentFilter;
exports.getIncidentsWithRelationshipFilters = getIncidentsWithRelationshipFilters;
exports.aggregateIncidentsByDimensions = aggregateIncidentsByDimensions;
exports.getIncidentsWithAdvancedSorting = getIncidentsWithAdvancedSorting;
exports.bulkUpdateIncidentStatus = bulkUpdateIncidentStatus;
exports.getIncidentSummaryStatistics = getIncidentSummaryStatistics;
exports.exportIncidentsForReporting = exportIncidentsForReporting;
exports.getIncidentsRequiringComplianceReview = getIncidentsRequiringComplianceReview;
exports.searchIncidentsAcrossSchools = searchIncidentsAcrossSchools;
exports.getPaginatedIncidentsWithFilters = getPaginatedIncidentsWithFilters;
exports.reconstructIncidentTimeline = reconstructIncidentTimeline;
exports.analyzeIncidentOutcomes = analyzeIncidentOutcomes;
exports.calculateIncidentResponseTimeMetrics = calculateIncidentResponseTimeMetrics;
exports.analyzeFollowUpCompletionRates = analyzeFollowUpCompletionRates;
exports.getIncidentsWithDelayedNotification = getIncidentsWithDelayedNotification;
exports.analyzeIncidentResourceConsumption = analyzeIncidentResourceConsumption;
exports.generateIncidentRecurrencePrediction = generateIncidentRecurrencePrediction;
exports.analyzeComplianceViolationPatterns = analyzeComplianceViolationPatterns;
exports.getIncidentDashboardMetrics = getIncidentDashboardMetrics;
exports.getComprehensiveIncidentReport = getComprehensiveIncidentReport;
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
const sequelize_1 = require("sequelize");
// ============================================================================
// SECTION 1: ACTIVE INCIDENT QUERIES (Functions 1-10)
// ============================================================================
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
async function getActiveIncidents(IncidentReport, options = {}) {
    const { limit = 100, offset = 0, includeRelations = true, transaction } = options;
    const include = [];
    if (includeRelations) {
        include.push({ association: 'student', attributes: ['id', 'firstName', 'lastName', 'studentNumber'] }, { association: 'reporter', attributes: ['id', 'firstName', 'lastName', 'email'] }, { association: 'followUpActions', separate: true }, { association: 'witnessStatements', separate: true });
    }
    return IncidentReport.findAll({
        where: {
            status: {
                [sequelize_1.Op.in]: ['PENDING_REVIEW', 'UNDER_INVESTIGATION', 'REQUIRES_ACTION'],
            },
            deletedAt: null,
        },
        include,
        order: [
            ['severity', 'DESC'],
            ['occurredAt', 'ASC'],
        ],
        limit,
        offset,
        transaction,
        subQuery: false,
    });
}
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
async function getCriticalIncidents(IncidentReport, options = {}) {
    const { hoursWindow = 48, requiresAction = false, transaction } = options;
    const cutoffTime = new Date(Date.now() - hoursWindow * 60 * 60 * 1000);
    const where = {
        severity: {
            [sequelize_1.Op.in]: ['HIGH', 'CRITICAL'],
        },
        occurredAt: {
            [sequelize_1.Op.gte]: cutoffTime,
        },
        deletedAt: null,
    };
    if (requiresAction) {
        where.status = 'REQUIRES_ACTION';
    }
    return IncidentReport.findAll({
        where,
        include: [
            { association: 'student', attributes: ['id', 'firstName', 'lastName', 'grade'] },
            { association: 'reporter', attributes: ['id', 'firstName', 'lastName'] },
        ],
        order: [
            ['severity', 'DESC'],
            ['occurredAt', 'ASC'],
        ],
        transaction,
    });
}
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
async function getIncidentsPendingParentNotification(IncidentReport, complianceHours = 4) {
    const complianceCutoff = new Date(Date.now() - complianceHours * 60 * 60 * 1000);
    return IncidentReport.findAll({
        where: {
            parentNotified: false,
            occurredAt: {
                [sequelize_1.Op.lte]: complianceCutoff,
            },
            severity: {
                [sequelize_1.Op.in]: ['MEDIUM', 'HIGH', 'CRITICAL'],
            },
            deletedAt: null,
        },
        include: [
            { association: 'student', attributes: ['id', 'firstName', 'lastName', 'studentNumber'] },
            { association: 'reporter', attributes: ['id', 'firstName', 'lastName', 'email'] },
        ],
        order: [['occurredAt', 'ASC']],
    });
}
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
async function getIncidentsRequiringFollowUp(IncidentReport, options = {}) {
    const { daysOverdue, assignedTo, transaction } = options;
    const where = {
        followUpRequired: true,
        status: {
            [sequelize_1.Op.notIn]: ['RESOLVED', 'CLOSED'],
        },
        deletedAt: null,
    };
    if (daysOverdue) {
        const overdueDate = new Date(Date.now() - daysOverdue * 24 * 60 * 60 * 1000);
        where.occurredAt = { [sequelize_1.Op.lte]: overdueDate };
    }
    const followUpInclude = {
        association: 'followUpActions',
        where: { status: { [sequelize_1.Op.in]: ['PENDING', 'IN_PROGRESS'] } },
        required: true,
    };
    if (assignedTo) {
        followUpInclude.where.assignedTo = assignedTo;
    }
    return IncidentReport.findAll({
        where,
        include: [
            { association: 'student', attributes: ['id', 'firstName', 'lastName'] },
            { association: 'reporter', attributes: ['id', 'firstName', 'lastName'] },
            followUpInclude,
        ],
        order: [['occurredAt', 'ASC']],
        transaction,
        subQuery: false,
    });
}
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
async function getIncidentsByStudent(IncidentReport, studentId, options = {}) {
    const { page = 1, pageSize = 20, includeResolved = false, transaction } = options;
    const where = {
        studentId,
        deletedAt: null,
    };
    if (!includeResolved) {
        where.status = {
            [sequelize_1.Op.notIn]: ['RESOLVED', 'CLOSED'],
        };
    }
    return IncidentReport.findAndCountAll({
        where,
        include: [
            { association: 'reporter', attributes: ['id', 'firstName', 'lastName'] },
            { association: 'followUpActions', separate: true },
        ],
        order: [['occurredAt', 'DESC']],
        limit: pageSize,
        offset: (page - 1) * pageSize,
        distinct: true,
        transaction,
    });
}
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
async function getIncidentsByLocation(IncidentReport, location, timeRange) {
    return IncidentReport.findAll({
        where: {
            location: {
                [sequelize_1.Op.iLike]: `%${location}%`,
            },
            occurredAt: {
                [sequelize_1.Op.between]: [timeRange.start, timeRange.end],
            },
            deletedAt: null,
        },
        include: [
            { association: 'student', attributes: ['id', 'firstName', 'lastName', 'grade'] },
            { association: 'reporter', attributes: ['id', 'firstName', 'lastName'] },
        ],
        order: [['occurredAt', 'DESC']],
    });
}
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
async function getIncidentsByType(IncidentReport, types, options = {}) {
    const { daysBack = 90, minSeverity, transaction } = options;
    const cutoffDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000);
    const where = {
        type: {
            [sequelize_1.Op.in]: types,
        },
        occurredAt: {
            [sequelize_1.Op.gte]: cutoffDate,
        },
        deletedAt: null,
    };
    if (minSeverity) {
        const severityOrder = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
        const minIndex = severityOrder.indexOf(minSeverity);
        where.severity = {
            [sequelize_1.Op.in]: severityOrder.slice(minIndex),
        };
    }
    return IncidentReport.findAll({
        where,
        include: [
            { association: 'student', attributes: ['id', 'firstName', 'lastName', 'grade'] },
        ],
        order: [
            ['severity', 'DESC'],
            ['occurredAt', 'DESC'],
        ],
        transaction,
    });
}
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
async function getIncidentsWithInsuranceClaims(IncidentReport, options = {}) {
    const { claimStatuses = ['FILED', 'PENDING', 'APPROVED'], transaction } = options;
    return IncidentReport.findAll({
        where: {
            insuranceClaimNumber: {
                [sequelize_1.Op.not]: null,
            },
            insuranceClaimStatus: {
                [sequelize_1.Op.in]: claimStatuses,
            },
            deletedAt: null,
        },
        include: [
            { association: 'student', attributes: ['id', 'firstName', 'lastName', 'studentNumber'] },
            { association: 'reporter', attributes: ['id', 'firstName', 'lastName'] },
        ],
        order: [['occurredAt', 'DESC']],
        transaction,
    });
}
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
async function getIncidentsWithEvidence(IncidentReport, options = {}) {
    const { evidenceType = 'any', minCount = 1, transaction } = options;
    const where = {
        deletedAt: null,
    };
    if (evidenceType === 'photos') {
        where[sequelize_1.Op.and] = (0, sequelize_1.literal)(`array_length("evidencePhotos", 1) >= ${minCount}`);
    }
    else if (evidenceType === 'videos') {
        where[sequelize_1.Op.and] = (0, sequelize_1.literal)(`array_length("evidenceVideos", 1) >= ${minCount}`);
    }
    else if (evidenceType === 'attachments') {
        where[sequelize_1.Op.and] = (0, sequelize_1.literal)(`array_length("attachments", 1) >= ${minCount}`);
    }
    else {
        where[sequelize_1.Op.or] = [
            (0, sequelize_1.literal)(`array_length("evidencePhotos", 1) >= ${minCount}`),
            (0, sequelize_1.literal)(`array_length("evidenceVideos", 1) >= ${minCount}`),
            (0, sequelize_1.literal)(`array_length("attachments", 1) >= ${minCount}`),
        ];
    }
    return IncidentReport.findAll({
        where,
        include: [
            { association: 'student', attributes: ['id', 'firstName', 'lastName'] },
            { association: 'reporter', attributes: ['id', 'firstName', 'lastName'] },
        ],
        order: [['occurredAt', 'DESC']],
        transaction,
    });
}
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
async function getIncidentsByComplianceStatus(IncidentReport, complianceStatuses, options = {}) {
    const { daysBack = 90, transaction } = options;
    const cutoffDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000);
    return IncidentReport.findAll({
        where: {
            legalComplianceStatus: {
                [sequelize_1.Op.in]: complianceStatuses,
            },
            occurredAt: {
                [sequelize_1.Op.gte]: cutoffDate,
            },
            deletedAt: null,
        },
        include: [
            { association: 'student', attributes: ['id', 'firstName', 'lastName'] },
            { association: 'reporter', attributes: ['id', 'firstName', 'lastName'] },
        ],
        order: [['occurredAt', 'ASC']],
        transaction,
    });
}
// ============================================================================
// SECTION 2: HISTORICAL INCIDENT SEARCH (Functions 11-20)
// ============================================================================
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
async function searchIncidentsAdvanced(IncidentReport, filters, options = {}) {
    const { page = 1, pageSize = 20, transaction } = options;
    const where = {
        deletedAt: null,
    };
    if (filters.types && filters.types.length > 0) {
        where.type = { [sequelize_1.Op.in]: filters.types };
    }
    if (filters.severities && filters.severities.length > 0) {
        where.severity = { [sequelize_1.Op.in]: filters.severities };
    }
    if (filters.statuses && filters.statuses.length > 0) {
        where.status = { [sequelize_1.Op.in]: filters.statuses };
    }
    if (filters.studentIds && filters.studentIds.length > 0) {
        where.studentId = { [sequelize_1.Op.in]: filters.studentIds };
    }
    if (filters.locations && filters.locations.length > 0) {
        where.location = {
            [sequelize_1.Op.or]: filters.locations.map(loc => ({ [sequelize_1.Op.iLike]: `%${loc}%` })),
        };
    }
    if (filters.dateRange) {
        where.occurredAt = {
            [sequelize_1.Op.between]: [filters.dateRange.start, filters.dateRange.end],
        };
    }
    if (filters.parentNotified !== undefined) {
        where.parentNotified = filters.parentNotified;
    }
    if (filters.followUpRequired !== undefined) {
        where.followUpRequired = filters.followUpRequired;
    }
    if (filters.complianceStatus && filters.complianceStatus.length > 0) {
        where.legalComplianceStatus = { [sequelize_1.Op.in]: filters.complianceStatus };
    }
    if (filters.insuranceClaimStatus && filters.insuranceClaimStatus.length > 0) {
        where.insuranceClaimStatus = { [sequelize_1.Op.in]: filters.insuranceClaimStatus };
    }
    if (filters.searchTerm) {
        where[sequelize_1.Op.or] = [
            { description: { [sequelize_1.Op.iLike]: `%${filters.searchTerm}%` } },
            { location: { [sequelize_1.Op.iLike]: `%${filters.searchTerm}%` } },
            { actionsTaken: { [sequelize_1.Op.iLike]: `%${filters.searchTerm}%` } },
            { followUpNotes: { [sequelize_1.Op.iLike]: `%${filters.searchTerm}%` } },
        ];
    }
    if (filters.hasEvidence !== undefined && filters.hasEvidence) {
        where[sequelize_1.Op.or] = [
            (0, sequelize_1.literal)(`array_length("evidencePhotos", 1) > 0`),
            (0, sequelize_1.literal)(`array_length("evidenceVideos", 1) > 0`),
            (0, sequelize_1.literal)(`array_length("attachments", 1) > 0`),
        ];
    }
    return IncidentReport.findAndCountAll({
        where,
        include: [
            { association: 'student', attributes: ['id', 'firstName', 'lastName', 'grade'] },
            { association: 'reporter', attributes: ['id', 'firstName', 'lastName'] },
        ],
        order: [['occurredAt', 'DESC']],
        limit: pageSize,
        offset: (page - 1) * pageSize,
        distinct: true,
        transaction,
    });
}
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
async function getIncidentHistoryByDateRange(IncidentReport, startDate, endDate, options = {}) {
    const { includeResolved = true, transaction } = options;
    const where = {
        occurredAt: {
            [sequelize_1.Op.between]: [startDate, endDate],
        },
        deletedAt: null,
    };
    if (!includeResolved) {
        where.status = {
            [sequelize_1.Op.notIn]: ['RESOLVED', 'CLOSED'],
        };
    }
    return IncidentReport.findAll({
        where,
        include: [
            { association: 'student', attributes: ['id', 'firstName', 'lastName', 'grade'] },
            { association: 'reporter', attributes: ['id', 'firstName', 'lastName'] },
            { association: 'followUpActions', separate: true },
        ],
        order: [['occurredAt', 'DESC']],
        transaction,
    });
}
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
async function getClosedIncidentsForArchive(IncidentReport, options = {}) {
    const { olderThanDays = 365, includeAllData = true, transaction } = options;
    const cutoffDate = new Date(Date.now() - olderThanDays * 24 * 60 * 60 * 1000);
    const include = [
        { association: 'student', attributes: ['id', 'firstName', 'lastName', 'studentNumber'] },
        { association: 'reporter', attributes: ['id', 'firstName', 'lastName'] },
    ];
    if (includeAllData) {
        include.push({ association: 'followUpActions', separate: true }, { association: 'witnessStatements', separate: true });
    }
    return IncidentReport.findAll({
        where: {
            status: {
                [sequelize_1.Op.in]: ['RESOLVED', 'CLOSED'],
            },
            updatedAt: {
                [sequelize_1.Op.lte]: cutoffDate,
            },
            deletedAt: null,
        },
        include,
        order: [['updatedAt', 'ASC']],
        transaction,
    });
}
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
async function getIncidentsByReporter(IncidentReport, reporterId, options = {}) {
    const { daysBack = 90, transaction } = options;
    const cutoffDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000);
    return IncidentReport.findAll({
        where: {
            reportedById: reporterId,
            occurredAt: {
                [sequelize_1.Op.gte]: cutoffDate,
            },
            deletedAt: null,
        },
        include: [
            { association: 'student', attributes: ['id', 'firstName', 'lastName', 'grade'] },
        ],
        order: [['occurredAt', 'DESC']],
        transaction,
    });
}
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
async function searchIncidentsByWitness(IncidentReport, witnessName, options = {}) {
    const { daysBack = 180, transaction } = options;
    const cutoffDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000);
    return IncidentReport.findAll({
        where: {
            witnesses: {
                [sequelize_1.Op.contains]: [witnessName],
            },
            occurredAt: {
                [sequelize_1.Op.gte]: cutoffDate,
            },
            deletedAt: null,
        },
        include: [
            { association: 'student', attributes: ['id', 'firstName', 'lastName'] },
            { association: 'reporter', attributes: ['id', 'firstName', 'lastName'] },
            { association: 'witnessStatements', separate: true },
        ],
        order: [['occurredAt', 'DESC']],
        transaction,
    });
}
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
async function getSimilarIncidents(IncidentReport, incidentId, options = {}) {
    const { matchType = true, matchLocation = true, matchSeverity = false, daysWindow = 60, transaction } = options;
    // First, get the reference incident
    const referenceIncident = await IncidentReport.findByPk(incidentId, { transaction });
    if (!referenceIncident) {
        return [];
    }
    const where = {
        id: {
            [sequelize_1.Op.ne]: incidentId,
        },
        deletedAt: null,
    };
    if (matchType) {
        where.type = referenceIncident.type;
    }
    if (matchLocation) {
        where.location = {
            [sequelize_1.Op.iLike]: `%${referenceIncident.location}%`,
        };
    }
    if (matchSeverity) {
        where.severity = referenceIncident.severity;
    }
    if (daysWindow) {
        const startDate = new Date(referenceIncident.occurredAt.getTime() - daysWindow * 24 * 60 * 60 * 1000);
        const endDate = new Date(referenceIncident.occurredAt.getTime() + daysWindow * 24 * 60 * 60 * 1000);
        where.occurredAt = {
            [sequelize_1.Op.between]: [startDate, endDate],
        };
    }
    return IncidentReport.findAll({
        where,
        include: [
            { association: 'student', attributes: ['id', 'firstName', 'lastName'] },
        ],
        order: [['occurredAt', 'DESC']],
        limit: 20,
        transaction,
    });
}
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
async function getIncidentsByActionKeywords(IncidentReport, keywords, options = {}) {
    const { daysBack = 90, transaction } = options;
    const cutoffDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000);
    const keywordConditions = keywords.map(keyword => ({
        actionsTaken: { [sequelize_1.Op.iLike]: `%${keyword}%` },
    }));
    return IncidentReport.findAll({
        where: {
            [sequelize_1.Op.or]: keywordConditions,
            occurredAt: {
                [sequelize_1.Op.gte]: cutoffDate,
            },
            deletedAt: null,
        },
        include: [
            { association: 'student', attributes: ['id', 'firstName', 'lastName'] },
            { association: 'reporter', attributes: ['id', 'firstName', 'lastName'] },
        ],
        order: [['occurredAt', 'DESC']],
        transaction,
    });
}
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
async function getRecentlyModifiedIncidents(IncidentReport, since, options = {}) {
    const { includeDeleted = false, transaction } = options;
    const where = {
        updatedAt: {
            [sequelize_1.Op.gte]: since,
        },
    };
    if (!includeDeleted) {
        where.deletedAt = null;
    }
    return IncidentReport.findAll({
        where,
        include: [
            { association: 'student', attributes: ['id', 'firstName', 'lastName'] },
            { association: 'reporter', attributes: ['id', 'firstName', 'lastName'] },
        ],
        order: [['updatedAt', 'DESC']],
        paranoid: !includeDeleted,
        transaction,
    });
}
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
async function searchIncidentsByDescription(IncidentReport, searchQuery, options = {}) {
    const { limit = 50, caseSensitive = false, transaction } = options;
    const operator = caseSensitive ? sequelize_1.Op.like : sequelize_1.Op.iLike;
    return IncidentReport.findAll({
        where: {
            description: {
                [operator]: `%${searchQuery}%`,
            },
            deletedAt: null,
        },
        include: [
            { association: 'student', attributes: ['id', 'firstName', 'lastName', 'grade'] },
            { association: 'reporter', attributes: ['id', 'firstName', 'lastName'] },
        ],
        order: [['occurredAt', 'DESC']],
        limit,
        transaction,
    });
}
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
async function getDraftIncidents(IncidentReport, options = {}) {
    const { olderThanHours, transaction } = options;
    const where = {
        status: 'DRAFT',
        deletedAt: null,
    };
    if (olderThanHours) {
        const cutoffTime = new Date(Date.now() - olderThanHours * 60 * 60 * 1000);
        where.createdAt = {
            [sequelize_1.Op.lte]: cutoffTime,
        };
    }
    return IncidentReport.findAll({
        where,
        include: [
            { association: 'student', attributes: ['id', 'firstName', 'lastName'] },
            { association: 'reporter', attributes: ['id', 'firstName', 'lastName', 'email'] },
        ],
        order: [['createdAt', 'ASC']],
        transaction,
    });
}
// ============================================================================
// SECTION 3: INCIDENT PATTERN ANALYSIS (Functions 21-30)
// ============================================================================
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
async function analyzeIncidentTrendsByTimePeriod(sequelize, options) {
    const { startDate, endDate, groupBy, transaction } = options;
    const dateFormat = {
        hour: 'YYYY-MM-DD HH24:00',
        day: 'YYYY-MM-DD',
        week: 'IYYY-IW',
        month: 'YYYY-MM',
        quarter: 'YYYY-Q',
    }[groupBy];
    const query = `
    SELECT
      TO_CHAR("occurredAt", :dateFormat) as period,
      COUNT(*) as incident_count,
      COUNT(DISTINCT "studentId") as affected_students,
      array_agg(DISTINCT type) as incident_types,
      COUNT(CASE WHEN severity = 'CRITICAL' THEN 1 END) as critical_count,
      COUNT(CASE WHEN severity = 'HIGH' THEN 1 END) as high_count,
      COUNT(CASE WHEN severity = 'MEDIUM' THEN 1 END) as medium_count,
      COUNT(CASE WHEN severity = 'LOW' THEN 1 END) as low_count
    FROM incident_reports
    WHERE "occurredAt" BETWEEN :startDate AND :endDate
      AND "deletedAt" IS NULL
    GROUP BY period
    ORDER BY period ASC
  `;
    return sequelize.query(query, {
        replacements: { startDate, endDate, dateFormat },
        type: sequelize_1.QueryTypes.SELECT,
        transaction,
    });
}
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
async function identifyRecurringIncidentPatterns(sequelize, options = {}) {
    const { minIncidents = 3, daysWindow = 90, incidentTypes, transaction } = options;
    const cutoffDate = new Date(Date.now() - daysWindow * 24 * 60 * 60 * 1000);
    let typeFilter = '';
    if (incidentTypes && incidentTypes.length > 0) {
        typeFilter = `AND type IN (:incidentTypes)`;
    }
    const query = `
    SELECT
      "studentId",
      COUNT(*) as incident_count,
      array_agg(DISTINCT type) as incident_types,
      array_agg(DISTINCT location) as locations,
      array_agg(DISTINCT severity) as severities,
      MIN("occurredAt") as first_incident,
      MAX("occurredAt") as last_incident,
      AVG(EXTRACT(EPOCH FROM ("updatedAt" - "occurredAt")) / 3600) as avg_resolution_hours
    FROM incident_reports
    WHERE "occurredAt" >= :cutoffDate
      AND "deletedAt" IS NULL
      ${typeFilter}
    GROUP BY "studentId"
    HAVING COUNT(*) >= :minIncidents
    ORDER BY incident_count DESC
  `;
    return sequelize.query(query, {
        replacements: { cutoffDate, minIncidents, incidentTypes },
        type: sequelize_1.QueryTypes.SELECT,
        transaction,
    });
}
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
async function analyzeIncidentHotspotsByLocation(sequelize, options = {}) {
    const { daysBack = 180, minIncidents = 5, transaction } = options;
    const cutoffDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000);
    const query = `
    SELECT
      location,
      COUNT(*) as incident_count,
      COUNT(DISTINCT "studentId") as affected_students,
      array_agg(DISTINCT type) as incident_types,
      COUNT(CASE WHEN severity IN ('HIGH', 'CRITICAL') THEN 1 END) as high_severity_count,
      ROUND(COUNT(CASE WHEN severity IN ('HIGH', 'CRITICAL') THEN 1 END)::numeric / COUNT(*)::numeric * 100, 2) as high_severity_percentage,
      AVG(EXTRACT(EPOCH FROM ("parentNotifiedAt" - "occurredAt")) / 60) as avg_notification_minutes
    FROM incident_reports
    WHERE "occurredAt" >= :cutoffDate
      AND "deletedAt" IS NULL
    GROUP BY location
    HAVING COUNT(*) >= :minIncidents
    ORDER BY incident_count DESC, high_severity_percentage DESC
    LIMIT 20
  `;
    return sequelize.query(query, {
        replacements: { cutoffDate, minIncidents },
        type: sequelize_1.QueryTypes.SELECT,
        transaction,
    });
}
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
async function detectIncidentClusters(sequelize, options = {}) {
    const { timeWindowHours = 24, minClusterSize = 3, daysBack = 90, transaction } = options;
    const cutoffDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000);
    const query = `
    WITH incident_windows AS (
      SELECT
        location,
        DATE_TRUNC('day', "occurredAt") as incident_date,
        EXTRACT(HOUR FROM "occurredAt")::int / :timeWindowHours as time_window,
        COUNT(*) as incidents_in_window,
        array_agg(id) as incident_ids,
        array_agg(type) as types,
        array_agg(severity) as severities
      FROM incident_reports
      WHERE "occurredAt" >= :cutoffDate
        AND "deletedAt" IS NULL
      GROUP BY location, incident_date, time_window
    )
    SELECT
      location,
      incident_date,
      time_window * :timeWindowHours as hour_block,
      incidents_in_window,
      incident_ids,
      types,
      severities
    FROM incident_windows
    WHERE incidents_in_window >= :minClusterSize
    ORDER BY incident_date DESC, incidents_in_window DESC
  `;
    return sequelize.query(query, {
        replacements: { timeWindowHours, minClusterSize, cutoffDate },
        type: sequelize_1.QueryTypes.SELECT,
        transaction,
    });
}
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
async function analyzeIncidentTimeOfDayPatterns(sequelize, options = {}) {
    const { daysBack = 180, transaction } = options;
    const cutoffDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000);
    const query = `
    SELECT
      EXTRACT(HOUR FROM "occurredAt")::int as hour_of_day,
      EXTRACT(DOW FROM "occurredAt")::int as day_of_week,
      COUNT(*) as incident_count,
      array_agg(DISTINCT type) as common_types,
      COUNT(CASE WHEN severity IN ('HIGH', 'CRITICAL') THEN 1 END) as critical_incidents,
      AVG(CASE WHEN "parentNotifiedAt" IS NOT NULL
        THEN EXTRACT(EPOCH FROM ("parentNotifiedAt" - "occurredAt")) / 60
        ELSE NULL END) as avg_notification_minutes
    FROM incident_reports
    WHERE "occurredAt" >= :cutoffDate
      AND "deletedAt" IS NULL
    GROUP BY hour_of_day, day_of_week
    ORDER BY incident_count DESC
  `;
    return sequelize.query(query, {
        replacements: { cutoffDate },
        type: sequelize_1.QueryTypes.SELECT,
        transaction,
    });
}
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
async function analyzeIncidentTypeDistribution(sequelize, options) {
    const { startDate, endDate, transaction } = options;
    const query = `
    SELECT
      type,
      COUNT(*) as total_incidents,
      COUNT(DISTINCT "studentId") as unique_students,
      ROUND(COUNT(*)::numeric / (SELECT COUNT(*) FROM incident_reports
        WHERE "occurredAt" BETWEEN :startDate AND :endDate AND "deletedAt" IS NULL)::numeric * 100, 2) as percentage,
      COUNT(CASE WHEN severity = 'CRITICAL' THEN 1 END) as critical_count,
      COUNT(CASE WHEN severity = 'HIGH' THEN 1 END) as high_count,
      COUNT(CASE WHEN severity = 'MEDIUM' THEN 1 END) as medium_count,
      COUNT(CASE WHEN severity = 'LOW' THEN 1 END) as low_count,
      COUNT(CASE WHEN "parentNotified" = true THEN 1 END) as parent_notified_count,
      COUNT(CASE WHEN "followUpRequired" = true THEN 1 END) as follow_up_required_count
    FROM incident_reports
    WHERE "occurredAt" BETWEEN :startDate AND :endDate
      AND "deletedAt" IS NULL
    GROUP BY type
    ORDER BY total_incidents DESC
  `;
    return sequelize.query(query, {
        replacements: { startDate, endDate },
        type: sequelize_1.QueryTypes.SELECT,
        transaction,
    });
}
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
async function identifyHighRiskStudents(sequelize, options = {}) {
    const { daysBack = 90, minIncidents = 2, transaction } = options;
    const cutoffDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000);
    const query = `
    SELECT
      "studentId",
      COUNT(*) as incident_count,
      SUM(CASE
        WHEN severity = 'CRITICAL' THEN 10
        WHEN severity = 'HIGH' THEN 5
        WHEN severity = 'MEDIUM' THEN 2
        WHEN severity = 'LOW' THEN 1
        ELSE 0
      END) as risk_score,
      COUNT(CASE WHEN type IN ('INJURY', 'ILLNESS', 'ALLERGIC_REACTION') THEN 1 END) as medical_incidents,
      COUNT(CASE WHEN type = 'BEHAVIORAL' THEN 1 END) as behavioral_incidents,
      array_agg(DISTINCT type) as incident_types,
      array_agg(DISTINCT location) as incident_locations,
      MAX("occurredAt") as most_recent_incident,
      MIN("occurredAt") as first_incident,
      EXTRACT(DAY FROM (MAX("occurredAt") - MIN("occurredAt"))) as incident_span_days
    FROM incident_reports
    WHERE "occurredAt" >= :cutoffDate
      AND "deletedAt" IS NULL
    GROUP BY "studentId"
    HAVING COUNT(*) >= :minIncidents
    ORDER BY risk_score DESC, incident_count DESC
    LIMIT 50
  `;
    return sequelize.query(query, {
        replacements: { cutoffDate, minIncidents },
        type: sequelize_1.QueryTypes.SELECT,
        transaction,
    });
}
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
async function analyzeSeasonalIncidentPatterns(sequelize, options = {}) {
    const { years = 2, transaction } = options;
    const cutoffDate = new Date(Date.now() - years * 365 * 24 * 60 * 60 * 1000);
    const query = `
    SELECT
      EXTRACT(YEAR FROM "occurredAt") as year,
      EXTRACT(QUARTER FROM "occurredAt") as quarter,
      EXTRACT(MONTH FROM "occurredAt") as month,
      COUNT(*) as incident_count,
      array_agg(DISTINCT type) as incident_types,
      AVG(CASE WHEN severity = 'CRITICAL' THEN 4 WHEN severity = 'HIGH' THEN 3
        WHEN severity = 'MEDIUM' THEN 2 ELSE 1 END) as avg_severity_score
    FROM incident_reports
    WHERE "occurredAt" >= :cutoffDate
      AND "deletedAt" IS NULL
    GROUP BY year, quarter, month
    ORDER BY year DESC, quarter DESC, month DESC
  `;
    return sequelize.query(query, {
        replacements: { cutoffDate },
        type: sequelize_1.QueryTypes.SELECT,
        transaction,
    });
}
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
async function analyzeIncidentResolutionPatterns(sequelize, options = {}) {
    const { daysBack = 180, transaction } = options;
    const cutoffDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000);
    const query = `
    SELECT
      type,
      severity,
      status,
      COUNT(*) as incident_count,
      AVG(EXTRACT(EPOCH FROM ("updatedAt" - "occurredAt")) / 3600) as avg_resolution_hours,
      PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY EXTRACT(EPOCH FROM ("updatedAt" - "occurredAt")) / 3600) as median_resolution_hours,
      MIN(EXTRACT(EPOCH FROM ("updatedAt" - "occurredAt")) / 3600) as min_resolution_hours,
      MAX(EXTRACT(EPOCH FROM ("updatedAt" - "occurredAt")) / 3600) as max_resolution_hours,
      COUNT(CASE WHEN "followUpRequired" = true THEN 1 END) as follow_up_count
    FROM incident_reports
    WHERE "occurredAt" >= :cutoffDate
      AND "deletedAt" IS NULL
      AND status IN ('RESOLVED', 'CLOSED')
    GROUP BY type, severity, status
    ORDER BY type, severity
  `;
    return sequelize.query(query, {
        replacements: { cutoffDate },
        type: sequelize_1.QueryTypes.SELECT,
        transaction,
    });
}
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
async function detectAnomalousIncidentPatterns(sequelize, options = {}) {
    const { stdDeviationThreshold = 2, daysBack = 365, transaction } = options;
    const cutoffDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000);
    const query = `
    WITH daily_counts AS (
      SELECT
        DATE_TRUNC('day', "occurredAt") as incident_date,
        COUNT(*) as daily_count,
        array_agg(DISTINCT type) as types
      FROM incident_reports
      WHERE "occurredAt" >= :cutoffDate
        AND "deletedAt" IS NULL
      GROUP BY incident_date
    ),
    stats AS (
      SELECT
        AVG(daily_count) as mean,
        STDDEV(daily_count) as std_dev
      FROM daily_counts
    )
    SELECT
      dc.incident_date,
      dc.daily_count,
      dc.types,
      s.mean,
      s.std_dev,
      (dc.daily_count - s.mean) / NULLIF(s.std_dev, 0) as z_score
    FROM daily_counts dc, stats s
    WHERE ABS((dc.daily_count - s.mean) / NULLIF(s.std_dev, 0)) >= :threshold
    ORDER BY ABS((dc.daily_count - s.mean) / NULLIF(s.std_dev, 0)) DESC
  `;
    return sequelize.query(query, {
        replacements: { cutoffDate, threshold: stdDeviationThreshold },
        type: sequelize_1.QueryTypes.SELECT,
        transaction,
    });
}
// ============================================================================
// SECTION 4: MULTI-CRITERIA FILTERING & ADVANCED QUERIES (Functions 31-40)
// ============================================================================
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
async function buildComplexIncidentFilter(IncidentReport, criteria) {
    const { severity, types, statuses, notificationStatus, evidenceRequired, followUpStatus, complianceIssues, dateRange, locations, studentIds, transaction, } = criteria;
    const where = {
        deletedAt: null,
    };
    if (severity && severity.length > 0) {
        where.severity = { [sequelize_1.Op.in]: severity };
    }
    if (types && types.length > 0) {
        where.type = { [sequelize_1.Op.in]: types };
    }
    if (statuses && statuses.length > 0) {
        where.status = { [sequelize_1.Op.in]: statuses };
    }
    if (notificationStatus) {
        if (notificationStatus === 'notified') {
            where.parentNotified = true;
        }
        else if (notificationStatus === 'pending') {
            where.parentNotified = false;
        }
    }
    if (evidenceRequired) {
        where[sequelize_1.Op.or] = [
            (0, sequelize_1.literal)(`array_length("evidencePhotos", 1) > 0`),
            (0, sequelize_1.literal)(`array_length("evidenceVideos", 1) > 0`),
        ];
    }
    if (followUpStatus) {
        if (followUpStatus === 'required') {
            where.followUpRequired = true;
            where.status = { [sequelize_1.Op.notIn]: ['RESOLVED', 'CLOSED'] };
        }
        else if (followUpStatus === 'not-required') {
            where.followUpRequired = false;
        }
        else if (followUpStatus === 'completed') {
            where.followUpRequired = true;
            where.status = { [sequelize_1.Op.in]: ['RESOLVED', 'CLOSED'] };
        }
    }
    if (complianceIssues) {
        where.legalComplianceStatus = {
            [sequelize_1.Op.in]: ['NON_COMPLIANT', 'UNDER_REVIEW'],
        };
    }
    if (dateRange) {
        where.occurredAt = {
            [sequelize_1.Op.between]: [dateRange.start, dateRange.end],
        };
    }
    if (locations && locations.length > 0) {
        where.location = {
            [sequelize_1.Op.or]: locations.map(loc => ({ [sequelize_1.Op.iLike]: `%${loc}%` })),
        };
    }
    if (studentIds && studentIds.length > 0) {
        where.studentId = { [sequelize_1.Op.in]: studentIds };
    }
    return IncidentReport.findAll({
        where,
        include: [
            { association: 'student', attributes: ['id', 'firstName', 'lastName', 'grade'] },
            { association: 'reporter', attributes: ['id', 'firstName', 'lastName'] },
        ],
        order: [
            ['severity', 'DESC'],
            ['occurredAt', 'DESC'],
        ],
        transaction,
    });
}
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
async function getIncidentsWithRelationshipFilters(IncidentReport, relationFilters) {
    const { studentGrade, schoolId, hasWitnessStatements, followUpActionsPending, transaction } = relationFilters;
    const include = [];
    // Student filter
    if (studentGrade || schoolId) {
        const studentWhere = {};
        if (studentGrade && studentGrade.length > 0) {
            studentWhere.grade = { [sequelize_1.Op.in]: studentGrade };
        }
        if (schoolId) {
            studentWhere.schoolId = schoolId;
        }
        include.push({
            association: 'student',
            where: studentWhere,
            required: true,
            attributes: ['id', 'firstName', 'lastName', 'grade', 'schoolId'],
        });
    }
    else {
        include.push({
            association: 'student',
            attributes: ['id', 'firstName', 'lastName', 'grade'],
        });
    }
    // Witness statements filter
    if (hasWitnessStatements) {
        include.push({
            association: 'witnessStatements',
            required: true,
            separate: false,
        });
    }
    // Follow-up actions filter
    if (followUpActionsPending) {
        include.push({
            association: 'followUpActions',
            where: { status: { [sequelize_1.Op.in]: ['PENDING', 'IN_PROGRESS'] } },
            required: true,
            separate: false,
        });
    }
    include.push({
        association: 'reporter',
        attributes: ['id', 'firstName', 'lastName', 'email'],
    });
    return IncidentReport.findAll({
        include,
        where: {
            deletedAt: null,
        },
        order: [['occurredAt', 'DESC']],
        transaction,
        subQuery: false,
    });
}
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
async function aggregateIncidentsByDimensions(sequelize, dimensions) {
    const { groupBy, dateRange, transaction } = dimensions;
    const groupByClause = groupBy.map(dim => `"${dim}"`).join(', ');
    let dateFilter = '';
    const replacements = {};
    if (dateRange) {
        dateFilter = 'WHERE "occurredAt" BETWEEN :startDate AND :endDate AND "deletedAt" IS NULL';
        replacements.startDate = dateRange.start;
        replacements.endDate = dateRange.end;
    }
    else {
        dateFilter = 'WHERE "deletedAt" IS NULL';
    }
    const query = `
    SELECT
      ${groupByClause},
      COUNT(*) as incident_count,
      COUNT(DISTINCT "studentId") as unique_students,
      COUNT(CASE WHEN "parentNotified" = true THEN 1 END) as notified_count,
      COUNT(CASE WHEN "followUpRequired" = true THEN 1 END) as follow_up_count,
      AVG(EXTRACT(EPOCH FROM ("updatedAt" - "occurredAt")) / 3600) as avg_resolution_hours
    FROM incident_reports
    ${dateFilter}
    GROUP BY ${groupByClause}
    ORDER BY incident_count DESC
  `;
    return sequelize.query(query, {
        replacements,
        type: sequelize_1.QueryTypes.SELECT,
        transaction,
    });
}
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
async function getIncidentsWithAdvancedSorting(IncidentReport, sortOptions) {
    const { primarySort, secondarySort, tertiarySort, direction = 'DESC', limit = 100, transaction } = sortOptions;
    const order = [[primarySort, direction]];
    if (secondarySort) {
        order.push([secondarySort, direction]);
    }
    if (tertiarySort) {
        order.push([tertiarySort, direction]);
    }
    return IncidentReport.findAll({
        where: {
            deletedAt: null,
        },
        include: [
            { association: 'student', attributes: ['id', 'firstName', 'lastName'] },
            { association: 'reporter', attributes: ['id', 'firstName', 'lastName'] },
        ],
        order,
        limit,
        transaction,
    });
}
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
async function bulkUpdateIncidentStatus(IncidentReport, updateCriteria) {
    const { incidentIds, newStatus, updatedBy, transaction } = updateCriteria;
    const [affectedCount] = await IncidentReport.update({
        status: newStatus,
        updatedBy,
        updatedAt: new Date(),
    }, {
        where: {
            id: { [sequelize_1.Op.in]: incidentIds },
            deletedAt: null,
        },
        transaction,
    });
    return affectedCount;
}
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
async function getIncidentSummaryStatistics(sequelize, options = {}) {
    const { dateRange, transaction } = options;
    let dateFilter = '';
    const replacements = {};
    if (dateRange) {
        dateFilter = 'AND "occurredAt" BETWEEN :startDate AND :endDate';
        replacements.startDate = dateRange.start;
        replacements.endDate = dateRange.end;
    }
    const query = `
    SELECT
      COUNT(*) as total_incidents,
      json_object_agg(type, type_count) as by_type,
      json_object_agg(severity, severity_count) as by_severity,
      json_object_agg(status, status_count) as by_status,
      AVG(CASE WHEN "parentNotifiedAt" IS NOT NULL
        THEN EXTRACT(EPOCH FROM ("parentNotifiedAt" - "occurredAt")) / 60
        ELSE NULL END) as avg_response_time,
      COUNT(CASE WHEN "legalComplianceStatus" = 'COMPLIANT' THEN 1 END)::float /
        NULLIF(COUNT(*), 0) * 100 as compliance_rate
    FROM incident_reports
    LEFT JOIN LATERAL (
      SELECT type, COUNT(*) as type_count
      FROM incident_reports
      WHERE "deletedAt" IS NULL ${dateFilter}
      GROUP BY type
    ) t ON true
    LEFT JOIN LATERAL (
      SELECT severity, COUNT(*) as severity_count
      FROM incident_reports
      WHERE "deletedAt" IS NULL ${dateFilter}
      GROUP BY severity
    ) s ON true
    LEFT JOIN LATERAL (
      SELECT status, COUNT(*) as status_count
      FROM incident_reports
      WHERE "deletedAt" IS NULL ${dateFilter}
      GROUP BY status
    ) st ON true
    WHERE "deletedAt" IS NULL ${dateFilter}
  `;
    const results = await sequelize.query(query, {
        replacements,
        type: sequelize_1.QueryTypes.SELECT,
        transaction,
    });
    return results[0];
}
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
async function exportIncidentsForReporting(IncidentReport, exportOptions) {
    const { dateRange, fields, includeRelations = true, transaction } = exportOptions;
    const where = {
        deletedAt: null,
    };
    if (dateRange) {
        where.occurredAt = {
            [sequelize_1.Op.between]: [dateRange.start, dateRange.end],
        };
    }
    const attributes = fields || [
        'id',
        'type',
        'severity',
        'status',
        'description',
        'location',
        'actionsTaken',
        'parentNotified',
        'followUpRequired',
        'occurredAt',
        'createdAt',
    ];
    const include = [];
    if (includeRelations) {
        include.push({ association: 'student', attributes: ['id', 'firstName', 'lastName', 'studentNumber', 'grade'] }, { association: 'reporter', attributes: ['id', 'firstName', 'lastName', 'email'] });
    }
    const incidents = await IncidentReport.findAll({
        where,
        attributes,
        include,
        order: [['occurredAt', 'DESC']],
        transaction,
    });
    return incidents.map(incident => incident.toJSON());
}
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
async function getIncidentsRequiringComplianceReview(IncidentReport, options = {}) {
    const { daysOverdue = 7, severity, transaction } = options;
    const overdueDate = new Date(Date.now() - daysOverdue * 24 * 60 * 60 * 1000);
    const where = {
        legalComplianceStatus: {
            [sequelize_1.Op.in]: ['PENDING', 'UNDER_REVIEW'],
        },
        occurredAt: {
            [sequelize_1.Op.lte]: overdueDate,
        },
        deletedAt: null,
    };
    if (severity && severity.length > 0) {
        where.severity = { [sequelize_1.Op.in]: severity };
    }
    return IncidentReport.findAll({
        where,
        include: [
            { association: 'student', attributes: ['id', 'firstName', 'lastName', 'studentNumber'] },
            { association: 'reporter', attributes: ['id', 'firstName', 'lastName'] },
        ],
        order: [
            ['severity', 'DESC'],
            ['occurredAt', 'ASC'],
        ],
        transaction,
    });
}
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
async function searchIncidentsAcrossSchools(sequelize, searchCriteria) {
    const { schoolIds, type, severity, dateRange, transaction } = searchCriteria;
    const replacements = { schoolIds };
    let filters = '';
    if (type) {
        filters += ' AND ir.type = :type';
        replacements.type = type;
    }
    if (severity && severity.length > 0) {
        filters += ' AND ir.severity IN (:severity)';
        replacements.severity = severity;
    }
    if (dateRange) {
        filters += ' AND ir."occurredAt" BETWEEN :startDate AND :endDate';
        replacements.startDate = dateRange.start;
        replacements.endDate = dateRange.end;
    }
    const query = `
    SELECT
      s."schoolId",
      sc.name as school_name,
      COUNT(ir.id) as incident_count,
      array_agg(DISTINCT ir.type) as incident_types,
      COUNT(CASE WHEN ir.severity IN ('HIGH', 'CRITICAL') THEN 1 END) as critical_incidents,
      AVG(EXTRACT(EPOCH FROM (ir."updatedAt" - ir."occurredAt")) / 3600) as avg_resolution_hours
    FROM incident_reports ir
    INNER JOIN students s ON ir."studentId" = s.id
    INNER JOIN schools sc ON s."schoolId" = sc.id
    WHERE s."schoolId" IN (:schoolIds)
      AND ir."deletedAt" IS NULL
      ${filters}
    GROUP BY s."schoolId", sc.name
    ORDER BY incident_count DESC
  `;
    return sequelize.query(query, {
        replacements,
        type: sequelize_1.QueryTypes.SELECT,
        transaction,
    });
}
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
async function getPaginatedIncidentsWithFilters(IncidentReport, options) {
    const { page = 1, pageSize = 25, filters = {}, sortBy = 'occurredAt', sortOrder = 'DESC', transaction } = options;
    const where = {
        deletedAt: null,
    };
    // Apply filters
    if (filters.types && filters.types.length > 0) {
        where.type = { [sequelize_1.Op.in]: filters.types };
    }
    if (filters.severities && filters.severities.length > 0) {
        where.severity = { [sequelize_1.Op.in]: filters.severities };
    }
    if (filters.statuses && filters.statuses.length > 0) {
        where.status = { [sequelize_1.Op.in]: filters.statuses };
    }
    if (filters.dateRange) {
        where.occurredAt = {
            [sequelize_1.Op.between]: [filters.dateRange.start, filters.dateRange.end],
        };
    }
    if (filters.studentIds && filters.studentIds.length > 0) {
        where.studentId = { [sequelize_1.Op.in]: filters.studentIds };
    }
    if (filters.locations && filters.locations.length > 0) {
        where.location = {
            [sequelize_1.Op.or]: filters.locations.map(loc => ({ [sequelize_1.Op.iLike]: `%${loc}%` })),
        };
    }
    if (filters.searchTerm) {
        where[sequelize_1.Op.or] = [
            { description: { [sequelize_1.Op.iLike]: `%${filters.searchTerm}%` } },
            { actionsTaken: { [sequelize_1.Op.iLike]: `%${filters.searchTerm}%` } },
        ];
    }
    const { count, rows } = await IncidentReport.findAndCountAll({
        where,
        include: [
            { association: 'student', attributes: ['id', 'firstName', 'lastName', 'grade'] },
            { association: 'reporter', attributes: ['id', 'firstName', 'lastName'] },
        ],
        order: [[sortBy, sortOrder]],
        limit: pageSize,
        offset: (page - 1) * pageSize,
        distinct: true,
        transaction,
    });
    const totalPages = Math.ceil(count / pageSize);
    return {
        rows,
        count,
        page,
        totalPages,
    };
}
// ============================================================================
// SECTION 5: TIMELINE & OUTCOME ANALYSIS (Functions 41-50)
// ============================================================================
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
async function reconstructIncidentTimeline(sequelize, incidentId) {
    const query = `
    SELECT * FROM (
      SELECT
        "occurredAt" as timestamp,
        'INCIDENT_OCCURRED' as event_type,
        'Incident reported: ' || description as description,
        "reportedById" as actor,
        json_build_object('type', type, 'severity', severity, 'location', location) as metadata
      FROM incident_reports
      WHERE id = :incidentId

      UNION ALL

      SELECT
        "parentNotifiedAt" as timestamp,
        'PARENT_NOTIFIED' as event_type,
        'Parent notified via ' || "parentNotificationMethod" as description,
        "parentNotifiedBy" as actor,
        NULL as metadata
      FROM incident_reports
      WHERE id = :incidentId AND "parentNotifiedAt" IS NOT NULL

      UNION ALL

      SELECT
        "createdAt" as timestamp,
        'FOLLOW_UP_CREATED' as event_type,
        'Follow-up action created: ' || description as description,
        "assignedTo" as actor,
        json_build_object('status', status, 'priority', priority) as metadata
      FROM follow_up_actions
      WHERE "incidentReportId" = :incidentId

      UNION ALL

      SELECT
        "createdAt" as timestamp,
        'WITNESS_STATEMENT' as event_type,
        'Witness statement recorded from ' || "witnessName" as description,
        "recordedBy" as actor,
        NULL as metadata
      FROM witness_statements
      WHERE "incidentReportId" = :incidentId

      UNION ALL

      SELECT
        "updatedAt" as timestamp,
        'STATUS_CHANGED' as event_type,
        'Incident status changed to ' || status as description,
        "updatedBy" as actor,
        json_build_object('status', status) as metadata
      FROM incident_reports
      WHERE id = :incidentId
    ) timeline
    WHERE timestamp IS NOT NULL
    ORDER BY timestamp ASC
  `;
    return sequelize.query(query, {
        replacements: { incidentId },
        type: sequelize_1.QueryTypes.SELECT,
    });
}
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
async function analyzeIncidentOutcomes(sequelize, options = {}) {
    const { daysBack = 180, transaction } = options;
    const cutoffDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000);
    const query = `
    SELECT
      type,
      severity,
      COUNT(*) as total_incidents,
      COUNT(CASE WHEN status = 'RESOLVED' THEN 1 END) as resolved_count,
      COUNT(CASE WHEN status = 'CLOSED' THEN 1 END) as closed_count,
      ROUND(COUNT(CASE WHEN status IN ('RESOLVED', 'CLOSED') THEN 1 END)::numeric / COUNT(*)::numeric * 100, 2) as completion_rate,
      AVG(CASE WHEN status IN ('RESOLVED', 'CLOSED')
        THEN EXTRACT(EPOCH FROM ("updatedAt" - "occurredAt")) / 3600
        ELSE NULL END) as avg_resolution_hours,
      COUNT(CASE WHEN "parentNotified" = true THEN 1 END) as parent_notification_count,
      COUNT(CASE WHEN "followUpRequired" = true AND status IN ('RESOLVED', 'CLOSED') THEN 1 END) as follow_ups_completed,
      COUNT(CASE WHEN "legalComplianceStatus" = 'COMPLIANT' THEN 1 END) as compliant_count
    FROM incident_reports
    WHERE "occurredAt" >= :cutoffDate
      AND "deletedAt" IS NULL
    GROUP BY type, severity
    ORDER BY type, severity
  `;
    return sequelize.query(query, {
        replacements: { cutoffDate },
        type: sequelize_1.QueryTypes.SELECT,
        transaction,
    });
}
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
async function calculateIncidentResponseTimeMetrics(sequelize, options = {}) {
    const { daysBack = 90, transaction } = options;
    const cutoffDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000);
    const query = `
    SELECT
      type,
      severity,
      COUNT(*) as incident_count,
      AVG(EXTRACT(EPOCH FROM ("parentNotifiedAt" - "occurredAt")) / 60) as avg_notification_minutes,
      PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY EXTRACT(EPOCH FROM ("parentNotifiedAt" - "occurredAt")) / 60) as median_notification_minutes,
      MIN(EXTRACT(EPOCH FROM ("parentNotifiedAt" - "occurredAt")) / 60) as min_notification_minutes,
      MAX(EXTRACT(EPOCH FROM ("parentNotifiedAt" - "occurredAt")) / 60) as max_notification_minutes,
      AVG(EXTRACT(EPOCH FROM ("updatedAt" - "occurredAt")) / 3600) as avg_resolution_hours,
      COUNT(CASE WHEN EXTRACT(EPOCH FROM ("parentNotifiedAt" - "occurredAt")) / 60 <= 60 THEN 1 END) as within_1_hour,
      COUNT(CASE WHEN EXTRACT(EPOCH FROM ("parentNotifiedAt" - "occurredAt")) / 60 <= 240 THEN 1 END) as within_4_hours
    FROM incident_reports
    WHERE "occurredAt" >= :cutoffDate
      AND "deletedAt" IS NULL
      AND "parentNotifiedAt" IS NOT NULL
    GROUP BY type, severity
    ORDER BY type, severity
  `;
    return sequelize.query(query, {
        replacements: { cutoffDate },
        type: sequelize_1.QueryTypes.SELECT,
        transaction,
    });
}
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
async function analyzeFollowUpCompletionRates(sequelize, options = {}) {
    const { daysBack = 90, transaction } = options;
    const cutoffDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000);
    const query = `
    SELECT
      ir.type,
      ir.severity,
      COUNT(DISTINCT ir.id) as incidents_with_follow_up,
      COUNT(fa.id) as total_follow_up_actions,
      COUNT(CASE WHEN fa.status = 'COMPLETED' THEN 1 END) as completed_actions,
      COUNT(CASE WHEN fa.status IN ('PENDING', 'IN_PROGRESS') THEN 1 END) as pending_actions,
      ROUND(COUNT(CASE WHEN fa.status = 'COMPLETED' THEN 1 END)::numeric / NULLIF(COUNT(fa.id), 0)::numeric * 100, 2) as completion_rate,
      AVG(CASE WHEN fa.status = 'COMPLETED' AND fa."completedAt" IS NOT NULL
        THEN EXTRACT(EPOCH FROM (fa."completedAt" - fa."createdAt")) / 86400
        ELSE NULL END) as avg_days_to_complete
    FROM incident_reports ir
    INNER JOIN follow_up_actions fa ON ir.id = fa."incidentReportId"
    WHERE ir."occurredAt" >= :cutoffDate
      AND ir."deletedAt" IS NULL
      AND ir."followUpRequired" = true
    GROUP BY ir.type, ir.severity
    ORDER BY ir.type, ir.severity
  `;
    return sequelize.query(query, {
        replacements: { cutoffDate },
        type: sequelize_1.QueryTypes.SELECT,
        transaction,
    });
}
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
async function getIncidentsWithDelayedNotification(IncidentReport, thresholdMinutes = 60) {
    return IncidentReport.findAll({
        where: {
            parentNotified: true,
            parentNotifiedAt: {
                [sequelize_1.Op.not]: null,
            },
            [sequelize_1.Op.and]: (0, sequelize_1.literal)(`EXTRACT(EPOCH FROM ("parentNotifiedAt" - "occurredAt")) / 60 > ${thresholdMinutes}`),
            deletedAt: null,
        },
        include: [
            { association: 'student', attributes: ['id', 'firstName', 'lastName', 'studentNumber'] },
            { association: 'reporter', attributes: ['id', 'firstName', 'lastName'] },
        ],
        order: [
            [(0, sequelize_1.literal)(`EXTRACT(EPOCH FROM ("parentNotifiedAt" - "occurredAt"))`), 'DESC'],
        ],
    });
}
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
async function analyzeIncidentResourceConsumption(sequelize, options = {}) {
    const { daysBack = 90, transaction } = options;
    const cutoffDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000);
    const query = `
    SELECT
      ir."reportedById",
      u."firstName" || ' ' || u."lastName" as reporter_name,
      COUNT(DISTINCT ir.id) as incidents_reported,
      COUNT(fa.id) as total_follow_ups,
      SUM(EXTRACT(EPOCH FROM (ir."updatedAt" - ir."occurredAt")) / 3600) as total_hours_spent,
      AVG(EXTRACT(EPOCH FROM (ir."updatedAt" - ir."occurredAt")) / 3600) as avg_hours_per_incident,
      COUNT(CASE WHEN ir.severity IN ('HIGH', 'CRITICAL') THEN 1 END) as high_severity_incidents,
      array_agg(DISTINCT ir.type) as incident_types_handled
    FROM incident_reports ir
    LEFT JOIN users u ON ir."reportedById" = u.id
    LEFT JOIN follow_up_actions fa ON ir.id = fa."incidentReportId"
    WHERE ir."occurredAt" >= :cutoffDate
      AND ir."deletedAt" IS NULL
    GROUP BY ir."reportedById", u."firstName", u."lastName"
    ORDER BY incidents_reported DESC
  `;
    return sequelize.query(query, {
        replacements: { cutoffDate },
        type: sequelize_1.QueryTypes.SELECT,
        transaction,
    });
}
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
async function generateIncidentRecurrencePrediction(sequelize, options = {}) {
    const { lookbackDays = 180, minOccurrences = 2, transaction } = options;
    const cutoffDate = new Date(Date.now() - lookbackDays * 24 * 60 * 60 * 1000);
    const query = `
    WITH student_incidents AS (
      SELECT
        "studentId",
        type,
        COUNT(*) as occurrence_count,
        array_agg(location) as locations,
        AVG(EXTRACT(DOW FROM "occurredAt")) as avg_day_of_week,
        AVG(EXTRACT(HOUR FROM "occurredAt")) as avg_hour_of_day,
        STDDEV(EXTRACT(EPOCH FROM "occurredAt" - LAG("occurredAt") OVER (PARTITION BY "studentId", type ORDER BY "occurredAt")) / 86400) as recurrence_interval_stddev
      FROM incident_reports
      WHERE "occurredAt" >= :cutoffDate
        AND "deletedAt" IS NULL
      GROUP BY "studentId", type
      HAVING COUNT(*) >= :minOccurrences
    )
    SELECT
      si."studentId",
      si.type,
      si.occurrence_count,
      si.locations,
      si.avg_day_of_week,
      si.avg_hour_of_day,
      si.recurrence_interval_stddev,
      CASE
        WHEN si.occurrence_count >= 5 THEN 'HIGH'
        WHEN si.occurrence_count >= 3 THEN 'MEDIUM'
        ELSE 'LOW'
      END as recurrence_risk
    FROM student_incidents si
    ORDER BY si.occurrence_count DESC, si.recurrence_interval_stddev ASC NULLS LAST
  `;
    return sequelize.query(query, {
        replacements: { cutoffDate, minOccurrences },
        type: sequelize_1.QueryTypes.SELECT,
        transaction,
    });
}
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
async function analyzeComplianceViolationPatterns(sequelize, options = {}) {
    const { daysBack = 90, transaction } = options;
    const cutoffDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000);
    const query = `
    SELECT
      "legalComplianceStatus",
      type,
      severity,
      COUNT(*) as violation_count,
      array_agg(DISTINCT location) as violation_locations,
      COUNT(CASE WHEN "parentNotified" = false THEN 1 END) as missing_notification_count,
      COUNT(CASE WHEN "followUpRequired" = true AND status NOT IN ('RESOLVED', 'CLOSED') THEN 1 END) as incomplete_follow_up_count,
      AVG(EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - "occurredAt")) / 86400) as avg_days_unresolved,
      array_agg(DISTINCT "reportedById") as reporters_involved
    FROM incident_reports
    WHERE "occurredAt" >= :cutoffDate
      AND "deletedAt" IS NULL
      AND "legalComplianceStatus" IN ('NON_COMPLIANT', 'UNDER_REVIEW')
    GROUP BY "legalComplianceStatus", type, severity
    ORDER BY violation_count DESC
  `;
    return sequelize.query(query, {
        replacements: { cutoffDate },
        type: sequelize_1.QueryTypes.SELECT,
        transaction,
    });
}
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
async function getIncidentDashboardMetrics(sequelize, options = {}) {
    const { period = 'last-30-days', transaction } = options;
    const periodDays = {
        'today': 1,
        'last-7-days': 7,
        'last-30-days': 30,
        'last-90-days': 90,
    }[period];
    const cutoffDate = new Date(Date.now() - periodDays * 24 * 60 * 60 * 1000);
    const query = `
    SELECT
      COUNT(*) as total_incidents,
      COUNT(CASE WHEN status IN ('PENDING_REVIEW', 'UNDER_INVESTIGATION', 'REQUIRES_ACTION') THEN 1 END) as active_incidents,
      COUNT(CASE WHEN severity IN ('HIGH', 'CRITICAL') THEN 1 END) as critical_incidents,
      COUNT(CASE WHEN "parentNotified" = false AND severity IN ('MEDIUM', 'HIGH', 'CRITICAL') THEN 1 END) as pending_notifications,
      COUNT(CASE WHEN "followUpRequired" = true AND status NOT IN ('RESOLVED', 'CLOSED') THEN 1 END) as pending_follow_ups,
      COUNT(CASE WHEN "legalComplianceStatus" IN ('NON_COMPLIANT', 'UNDER_REVIEW') THEN 1 END) as compliance_issues,
      json_object_agg(type, type_count) as incidents_by_type,
      json_object_agg(severity, severity_count) as incidents_by_severity,
      AVG(CASE WHEN "parentNotifiedAt" IS NOT NULL
        THEN EXTRACT(EPOCH FROM ("parentNotifiedAt" - "occurredAt")) / 60
        ELSE NULL END) as avg_notification_minutes
    FROM incident_reports
    LEFT JOIN LATERAL (
      SELECT type, COUNT(*) as type_count
      FROM incident_reports
      WHERE "occurredAt" >= :cutoffDate AND "deletedAt" IS NULL
      GROUP BY type
    ) t ON true
    LEFT JOIN LATERAL (
      SELECT severity, COUNT(*) as severity_count
      FROM incident_reports
      WHERE "occurredAt" >= :cutoffDate AND "deletedAt" IS NULL
      GROUP BY severity
    ) s ON true
    WHERE "occurredAt" >= :cutoffDate
      AND "deletedAt" IS NULL
  `;
    const results = await sequelize.query(query, {
        replacements: { cutoffDate },
        type: sequelize_1.QueryTypes.SELECT,
        transaction,
    });
    return results[0];
}
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
async function getComprehensiveIncidentReport(IncidentReport, incidentId) {
    return IncidentReport.findByPk(incidentId, {
        include: [
            {
                association: 'student',
                attributes: ['id', 'firstName', 'lastName', 'studentNumber', 'grade', 'dateOfBirth'],
                include: [
                    { association: 'school', attributes: ['id', 'name'] },
                    { association: 'allergies', attributes: ['id', 'allergen', 'severity'], separate: true },
                    { association: 'chronicConditions', attributes: ['id', 'condition', 'severity'], separate: true },
                ],
            },
            {
                association: 'reporter',
                attributes: ['id', 'firstName', 'lastName', 'email', 'role'],
            },
            {
                association: 'followUpActions',
                separate: true,
                include: [
                    { association: 'assignedToUser', attributes: ['id', 'firstName', 'lastName'] },
                ],
            },
            {
                association: 'witnessStatements',
                separate: true,
                include: [
                    { association: 'recordedByUser', attributes: ['id', 'firstName', 'lastName'] },
                ],
            },
        ],
    });
}
//# sourceMappingURL=incident-queries.js.map