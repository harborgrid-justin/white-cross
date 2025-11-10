"use strict";
/**
 * LOC: THOK1234567
 * File: /reuse/threat/threat-hunting-operations-kit.ts
 *
 * UPSTREAM (imports from):
 *   - Sequelize 6.x ORM
 *   - NestJS 10.x framework
 *   - TypeScript 5.x type definitions
 *
 * DOWNSTREAM (imported by):
 *   - Threat hunting service modules
 *   - Security operations controllers
 *   - Hunt campaign orchestration
 *   - IOC detection services
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateHuntAfterActionReport = exports.identifyHuntOptimizations = exports.analyzeHuntCoverageGaps = exports.validateIOCFreshness = exports.generateThreatLandscapeSummary = exports.identifyEmergingThreats = exports.generateThreatActorAttribution = exports.correlateWithThreatIntel = exports.automatedDiscoveryTriage = exports.scheduleRecurringHunt = exports.generateHuntPlaybook = exports.orchestrateHuntWorkflow = exports.initiateIOCEnrichment = exports.calculateHuntCampaignROI = exports.generateMITRECoverageReport = exports.compareHuntCampaigns = exports.generateHuntExecutiveSummary = exports.calculateHuntCampaignMetrics = exports.trackActivityTemporalPatterns = exports.generateActivitySummary = exports.analyzeQueryEffectiveness = exports.getHunterProductivityMetrics = exports.logHuntActivity = exports.correlateRelatedDiscoveries = exports.analyzeDiscoveryTrends = exports.getCampaignDiscoveries = exports.escalateDiscoveryToIncident = exports.createThreatDiscovery = exports.detectDataExfiltrationPatterns = exports.detectUnusualTimingPatterns = exports.buildBehavioralBaseline = exports.analyzePeerGroupDeviation = exports.detectBehavioralAnomalies = exports.deprecateStaleIOCs = exports.correlateRelatedIOCs = exports.enrichIOCWithIntelligence = exports.executeIOCSweep = exports.upsertIOCIndicator = exports.trackHypothesisConfidence = exports.generateHypothesisTestPlan = exports.getCampaignHypotheses = exports.validateHypothesis = exports.createHuntHypothesis = exports.getCampaignTimeline = exports.assignHuntersToCampaign = exports.updateCampaignStatus = exports.getActiveHuntCampaigns = exports.createHuntCampaign = void 0;
/**
 * File: /reuse/threat/threat-hunting-operations-kit.ts
 * Locator: WC-SEC-THOK-001
 * Purpose: Comprehensive Threat Hunting Operations - Proactive threat detection, hypothesis testing, IOC hunting, behavioral analytics
 *
 * Upstream: Sequelize models for hunt campaigns, IOC detections, behavioral analytics, threat discoveries
 * Downstream: ../backend/security/*, threat hunting modules, SOC operations, incident response
 * Dependencies: TypeScript 5.x, Sequelize 6.x, NestJS 10.x, Swagger/OpenAPI
 * Exports: 48 utility functions for threat hunting campaigns, IOC detection, hypothesis validation, behavioral analysis
 *
 * LLM Context: Production-ready threat hunting operations toolkit for White Cross healthcare platform.
 * Provides comprehensive proactive threat detection, hypothesis-driven hunting, IOC tracking, behavioral anomaly
 * detection, threat discovery workflows, and hunt reporting for advanced security operations and HIPAA compliance.
 */
const sequelize_1 = require("sequelize");
// ============================================================================
// HUNT CAMPAIGN MANAGEMENT
// ============================================================================
/**
 * 1. Creates a new threat hunting campaign with hypothesis.
 *
 * @param {ModelCtor<Model>} CampaignModel - Hunt campaign model
 * @param {Partial<HuntCampaign>} campaignData - Campaign configuration
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created campaign
 *
 * @example
 * ```typescript
 * const campaign = await createHuntCampaign(HuntCampaign, {
 *   name: 'Lateral Movement Detection - Q2 2024',
 *   hypothesis: 'Adversaries using compromised credentials for lateral movement',
 *   huntType: 'proactive',
 *   priority: 'high',
 *   scope: ['windows_logs', 'network_traffic', 'authentication'],
 *   hunterId: 'hunter-123',
 *   dataSource: ['siem', 'edr', 'ad_logs']
 * });
 * ```
 */
const createHuntCampaign = async (CampaignModel, campaignData, transaction) => {
    return await CampaignModel.create({
        ...campaignData,
        status: campaignData.status || 'planning',
        startDate: campaignData.startDate || new Date(),
        teamMembers: campaignData.teamMembers || [],
        createdAt: new Date(),
        updatedAt: new Date(),
    }, { transaction });
};
exports.createHuntCampaign = createHuntCampaign;
/**
 * 2. Retrieves active hunt campaigns with progress metrics.
 *
 * @param {ModelCtor<Model>} CampaignModel - Campaign model
 * @param {ModelCtor<Model>} ActivityModel - Activity model
 * @param {ModelCtor<Model>} DiscoveryModel - Discovery model
 * @param {WhereOptions} [filters] - Optional filters
 * @returns {Promise<any[]>} Active campaigns with metrics
 *
 * @example
 * ```typescript
 * const campaigns = await getActiveHuntCampaigns(
 *   HuntCampaign,
 *   HuntActivity,
 *   ThreatDiscovery,
 *   { priority: 'high' }
 * );
 * ```
 */
const getActiveHuntCampaigns = async (CampaignModel, ActivityModel, DiscoveryModel, filters) => {
    return await CampaignModel.findAll({
        where: {
            status: { [sequelize_1.Op.in]: ['planning', 'active', 'paused'] },
            ...filters,
        },
        include: [
            {
                model: ActivityModel,
                as: 'activities',
                attributes: [],
                required: false,
            },
            {
                model: DiscoveryModel,
                as: 'discoveries',
                attributes: [],
                required: false,
            },
        ],
        attributes: {
            include: [
                [(0, sequelize_1.fn)('COUNT', (0, sequelize_1.literal)("DISTINCT activities.id")), 'activityCount'],
                [(0, sequelize_1.fn)('COUNT', (0, sequelize_1.literal)("DISTINCT discoveries.id")), 'discoveryCount'],
                [
                    (0, sequelize_1.literal)("EXTRACT(EPOCH FROM (COALESCE(end_date, CURRENT_TIMESTAMP) - start_date)) / 3600"),
                    'hoursElapsed',
                ],
                [
                    (0, sequelize_1.fn)('COUNT', (0, sequelize_1.literal)("DISTINCT CASE WHEN discoveries.escalated_to_incident = true THEN discoveries.id END")),
                    'incidentsGenerated',
                ],
            ],
        },
        group: ['HuntCampaign.id'],
        order: [
            ['priority', 'DESC'],
            ['startDate', 'ASC'],
        ],
    });
};
exports.getActiveHuntCampaigns = getActiveHuntCampaigns;
/**
 * 3. Updates hunt campaign status with validation.
 *
 * @param {ModelCtor<Model>} CampaignModel - Campaign model
 * @param {string} campaignId - Campaign identifier
 * @param {string} newStatus - New status
 * @param {string} [notes] - Status change notes
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<boolean>} Update success
 *
 * @example
 * ```typescript
 * await updateCampaignStatus(
 *   HuntCampaign,
 *   'campaign-123',
 *   'active',
 *   'Hypothesis validated, beginning active hunting'
 * );
 * ```
 */
const updateCampaignStatus = async (CampaignModel, campaignId, newStatus, notes, transaction) => {
    const updateData = {
        status: newStatus,
        updatedAt: new Date(),
    };
    if (newStatus === 'completed') {
        updateData.endDate = new Date();
    }
    if (notes) {
        updateData.statusNotes = notes;
    }
    const [affectedRows] = await CampaignModel.update(updateData, {
        where: { id: campaignId },
        transaction,
    });
    return affectedRows > 0;
};
exports.updateCampaignStatus = updateCampaignStatus;
/**
 * 4. Assigns hunters to a campaign with role specification.
 *
 * @param {ModelCtor<Model>} CampaignModel - Campaign model
 * @param {string} campaignId - Campaign identifier
 * @param {string[]} hunterIds - Array of hunter user IDs
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<boolean>} Assignment success
 *
 * @example
 * ```typescript
 * await assignHuntersToCampaign(
 *   HuntCampaign,
 *   'campaign-123',
 *   ['hunter-1', 'hunter-2', 'hunter-3']
 * );
 * ```
 */
const assignHuntersToCampaign = async (CampaignModel, campaignId, hunterIds, transaction) => {
    const campaign = await CampaignModel.findByPk(campaignId);
    const currentMembers = campaign.teamMembers || [];
    const updatedMembers = [...new Set([...currentMembers, ...hunterIds])];
    const [affectedRows] = await CampaignModel.update({
        teamMembers: updatedMembers,
        updatedAt: new Date(),
    }, {
        where: { id: campaignId },
        transaction,
    });
    return affectedRows > 0;
};
exports.assignHuntersToCampaign = assignHuntersToCampaign;
/**
 * 5. Retrieves hunt campaign timeline and activity history.
 *
 * @param {ModelCtor<Model>} ActivityModel - Hunt activity model
 * @param {string} campaignId - Campaign identifier
 * @param {Date} [startDate] - Optional start date filter
 * @param {Date} [endDate] - Optional end date filter
 * @returns {Promise<any[]>} Campaign timeline
 *
 * @example
 * ```typescript
 * const timeline = await getCampaignTimeline(
 *   HuntActivity,
 *   'campaign-123',
 *   new Date('2024-01-01'),
 *   new Date('2024-03-31')
 * );
 * ```
 */
const getCampaignTimeline = async (ActivityModel, UserModel, campaignId, startDate, endDate) => {
    const whereClause = { campaignId };
    if (startDate || endDate) {
        whereClause.timestamp = {};
        if (startDate)
            whereClause.timestamp[sequelize_1.Op.gte] = startDate;
        if (endDate)
            whereClause.timestamp[sequelize_1.Op.lte] = endDate;
    }
    return await ActivityModel.findAll({
        where: whereClause,
        include: [
            {
                model: UserModel,
                as: 'hunter',
                attributes: ['id', 'email', 'firstName', 'lastName'],
                required: true,
            },
        ],
        attributes: [
            'id',
            'activityType',
            'description',
            'dataSource',
            'resultsCount',
            'timestamp',
        ],
        order: [['timestamp', 'ASC']],
    });
};
exports.getCampaignTimeline = getCampaignTimeline;
// ============================================================================
// HYPOTHESIS MANAGEMENT
// ============================================================================
/**
 * 6. Creates a threat hunting hypothesis for testing.
 *
 * @param {ModelCtor<Model>} HypothesisModel - Hypothesis model
 * @param {string} campaignId - Campaign identifier
 * @param {Partial<HuntHypothesis>} hypothesisData - Hypothesis details
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created hypothesis
 *
 * @example
 * ```typescript
 * const hypothesis = await createHuntHypothesis(HuntHypothesis, 'campaign-123', {
 *   statement: 'Attackers using living-off-the-land binaries for persistence',
 *   rationale: 'Recent intel suggests APT group using LOLBins in healthcare sector',
 *   confidence: 'medium',
 *   evidenceRequired: ['process_execution', 'command_line', 'parent_process'],
 *   testCriteria: { binaries: ['certutil', 'bitsadmin', 'mshta'] }
 * });
 * ```
 */
const createHuntHypothesis = async (HypothesisModel, campaignId, hypothesisData, transaction) => {
    return await HypothesisModel.create({
        campaignId,
        ...hypothesisData,
        status: 'untested',
    }, { transaction });
};
exports.createHuntHypothesis = createHuntHypothesis;
/**
 * 7. Validates and updates hypothesis status based on evidence.
 *
 * @param {ModelCtor<Model>} HypothesisModel - Hypothesis model
 * @param {string} hypothesisId - Hypothesis identifier
 * @param {string} newStatus - Validation result status
 * @param {string} validatorId - User ID of validator
 * @param {string} [notes] - Validation notes
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated hypothesis
 *
 * @example
 * ```typescript
 * await validateHypothesis(
 *   HuntHypothesis,
 *   'hyp-123',
 *   'confirmed',
 *   'analyst-456',
 *   'Evidence found in 15 endpoints matching hypothesis criteria'
 * );
 * ```
 */
const validateHypothesis = async (HypothesisModel, hypothesisId, newStatus, validatorId, notes, transaction) => {
    await HypothesisModel.update({
        status: newStatus,
        validatedBy: validatorId,
        validatedAt: new Date(),
        validationNotes: notes,
    }, {
        where: { id: hypothesisId },
        transaction,
    });
    return await HypothesisModel.findByPk(hypothesisId);
};
exports.validateHypothesis = validateHypothesis;
/**
 * 8. Retrieves all hypotheses for a campaign with validation status.
 *
 * @param {ModelCtor<Model>} HypothesisModel - Hypothesis model
 * @param {string} campaignId - Campaign identifier
 * @returns {Promise<any[]>} Campaign hypotheses
 *
 * @example
 * ```typescript
 * const hypotheses = await getCampaignHypotheses(HuntHypothesis, 'campaign-123');
 * ```
 */
const getCampaignHypotheses = async (HypothesisModel, UserModel, campaignId) => {
    return await HypothesisModel.findAll({
        where: { campaignId },
        include: [
            {
                model: UserModel,
                as: 'creator',
                attributes: ['id', 'email', 'firstName', 'lastName'],
                required: true,
            },
            {
                model: UserModel,
                as: 'validator',
                attributes: ['id', 'email', 'firstName', 'lastName'],
                required: false,
            },
        ],
        order: [
            ['confidence', 'DESC'],
            ['createdAt', 'ASC'],
        ],
    });
};
exports.getCampaignHypotheses = getCampaignHypotheses;
/**
 * 9. Generates hypothesis test plan with required queries.
 *
 * @param {ModelCtor<Model>} HypothesisModel - Hypothesis model
 * @param {string} hypothesisId - Hypothesis identifier
 * @returns {Promise<any>} Test plan with queries
 *
 * @example
 * ```typescript
 * const testPlan = await generateHypothesisTestPlan(HuntHypothesis, 'hyp-123');
 * // Returns structured test plan with data sources and queries
 * ```
 */
const generateHypothesisTestPlan = async (HypothesisModel, hypothesisId) => {
    const hypothesis = await HypothesisModel.findByPk(hypothesisId);
    if (!hypothesis) {
        throw new Error('Hypothesis not found');
    }
    const data = hypothesis.get({ plain: true });
    // Generate test plan based on evidence required
    const testPlan = {
        hypothesisId,
        statement: data.statement,
        evidenceRequired: data.evidenceRequired,
        testSteps: data.evidenceRequired.map((evidence, index) => ({
            step: index + 1,
            evidenceType: evidence,
            dataSources: determineDataSources(evidence),
            suggestedQueries: generateSuggestedQueries(evidence, data.testCriteria),
        })),
        estimatedDuration: data.evidenceRequired.length * 2, // hours
    };
    return testPlan;
};
exports.generateHypothesisTestPlan = generateHypothesisTestPlan;
// Helper functions for test plan generation
const determineDataSources = (evidenceType) => {
    const sourceMap = {
        process_execution: ['edr', 'sysmon', 'windows_security_logs'],
        command_line: ['edr', 'powershell_logs', 'bash_history'],
        network_traffic: ['netflow', 'firewall_logs', 'ids_ips'],
        authentication: ['active_directory', 'sso_logs', 'vpn_logs'],
        file_access: ['file_integrity_monitoring', 'audit_logs', 'dlp'],
    };
    return sourceMap[evidenceType] || ['siem'];
};
const generateSuggestedQueries = (evidenceType, criteria) => {
    const queries = [];
    if (evidenceType === 'process_execution' && criteria.binaries) {
        queries.push(`index=endpoint EventCode=1 | search process_name IN (${criteria.binaries.join(',')})`);
    }
    if (evidenceType === 'network_traffic' && criteria.destinations) {
        queries.push(`index=network | search dest_ip IN (${criteria.destinations.join(',')})`);
    }
    return queries;
};
/**
 * 10. Tracks hypothesis confidence evolution over time.
 *
 * @param {ModelCtor<Model>} HypothesisModel - Hypothesis model
 * @param {string} campaignId - Campaign identifier
 * @returns {Promise<any[]>} Confidence trends
 *
 * @example
 * ```typescript
 * const trends = await trackHypothesisConfidence(HuntHypothesis, 'campaign-123');
 * ```
 */
const trackHypothesisConfidence = async (HypothesisModel, campaignId) => {
    return await HypothesisModel.findAll({
        where: { campaignId },
        attributes: [
            'id',
            'statement',
            'confidence',
            'status',
            'createdAt',
            'validatedAt',
            [
                (0, sequelize_1.literal)("CASE WHEN validated_at IS NOT NULL THEN EXTRACT(EPOCH FROM (validated_at - created_at)) / 3600 ELSE NULL END"),
                'hoursToValidation',
            ],
        ],
        order: [['createdAt', 'ASC']],
    });
};
exports.trackHypothesisConfidence = trackHypothesisConfidence;
// ============================================================================
// IOC HUNTING & DETECTION
// ============================================================================
/**
 * 11. Creates or updates an IOC indicator.
 *
 * @param {ModelCtor<Model>} IOCModel - IOC model
 * @param {Partial<IOCIndicator>} iocData - IOC details
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created or updated IOC
 *
 * @example
 * ```typescript
 * const ioc = await upsertIOCIndicator(IOCIndicator, {
 *   type: 'ip',
 *   value: '192.168.100.50',
 *   source: 'threat_intel',
 *   severity: 'high',
 *   confidence: 85,
 *   tags: ['malware', 'c2', 'apt28'],
 *   tlp: 'amber'
 * });
 * ```
 */
const upsertIOCIndicator = async (IOCModel, iocData, transaction) => {
    const [ioc, created] = await IOCModel.findOrCreate({
        where: {
            type: iocData.type,
            value: iocData.value,
        },
        defaults: {
            ...iocData,
            firstSeen: new Date(),
            lastSeen: new Date(),
        },
        transaction,
    });
    if (!created) {
        await ioc.update({
            lastSeen: new Date(),
            severity: iocData.severity || ioc.severity,
            confidence: iocData.confidence || ioc.confidence,
            tags: [...new Set([...(ioc.tags || []), ...(iocData.tags || [])])],
        }, { transaction });
    }
    return ioc;
};
exports.upsertIOCIndicator = upsertIOCIndicator;
/**
 * 12. Executes IOC sweep across specified data sources.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {string[]} iocIds - IOC identifiers to hunt
 * @param {string[]} dataSources - Data sources to search
 * @param {Date} startTime - Search start time
 * @param {Date} endTime - Search end time
 * @returns {Promise<IOCHuntResult[]>} Hunt results
 *
 * @example
 * ```typescript
 * const results = await executeIOCSweep(
 *   sequelize,
 *   ['ioc-1', 'ioc-2'],
 *   ['network_logs', 'proxy_logs', 'dns_logs'],
 *   new Date('2024-01-01'),
 *   new Date()
 * );
 * ```
 */
const executeIOCSweep = async (sequelize, iocIds, dataSources, startTime, endTime) => {
    const [results] = await sequelize.query(`
    WITH ioc_data AS (
      SELECT id, type, value
      FROM ioc_indicators
      WHERE id = ANY(:iocIds)
    ),
    search_results AS (
      SELECT
        i.id as ioc_id,
        l.timestamp,
        l.source,
        l.event_data
      FROM ioc_data i
      CROSS JOIN LATERAL (
        SELECT timestamp, 'network_logs' as source, event_data
        FROM network_logs
        WHERE (
          (i.type = 'ip' AND (source_ip = i.value OR dest_ip = i.value)) OR
          (i.type = 'domain' AND dns_query ILIKE '%' || i.value || '%') OR
          (i.type = 'url' AND url ILIKE '%' || i.value || '%')
        )
        AND timestamp BETWEEN :startTime AND :endTime
        AND 'network_logs' = ANY(:dataSources)

        UNION ALL

        SELECT timestamp, 'file_logs' as source, event_data
        FROM file_logs
        WHERE (
          (i.type = 'hash' AND (md5_hash = i.value OR sha256_hash = i.value)) OR
          (i.type = 'file_path' AND file_path ILIKE '%' || i.value || '%')
        )
        AND timestamp BETWEEN :startTime AND :endTime
        AND 'file_logs' = ANY(:dataSources)

        UNION ALL

        SELECT timestamp, 'email_logs' as source, event_data
        FROM email_logs
        WHERE (
          (i.type = 'email' AND (sender_email = i.value OR recipient_email = i.value)) OR
          (i.type = 'domain' AND sender_domain = i.value)
        )
        AND timestamp BETWEEN :startTime AND :endTime
        AND 'email_logs' = ANY(:dataSources)
      ) l
    )
    SELECT
      ioc_id,
      COUNT(*) as match_count,
      MIN(timestamp) as first_match,
      MAX(timestamp) as last_match,
      array_agg(DISTINCT source) as data_sources,
      json_agg(json_build_object(
        'timestamp', timestamp,
        'source', source,
        'context', event_data
      )) as match_details
    FROM search_results
    GROUP BY ioc_id
  `, {
        replacements: { iocIds, dataSources, startTime, endTime },
        type: sequelize.QueryTypes.SELECT,
    });
    return results;
};
exports.executeIOCSweep = executeIOCSweep;
/**
 * 13. Enriches IOCs with threat intelligence context.
 *
 * @param {ModelCtor<Model>} IOCModel - IOC model
 * @param {string} iocId - IOC identifier
 * @param {Record<string, any>} enrichmentData - Enrichment information
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Enriched IOC
 *
 * @example
 * ```typescript
 * await enrichIOCWithIntelligence(IOCIndicator, 'ioc-123', {
 *   threatActor: 'APT28',
 *   campaigns: ['Operation XYZ'],
 *   malwareFamily: 'Emotet',
 *   firstSeenWild: '2023-11-15',
 *   geolocation: { country: 'RU', city: 'Moscow' }
 * });
 * ```
 */
const enrichIOCWithIntelligence = async (IOCModel, iocId, enrichmentData, transaction) => {
    const ioc = await IOCModel.findByPk(iocId);
    if (!ioc) {
        throw new Error('IOC not found');
    }
    const currentContext = ioc.context || {};
    const updatedContext = {
        ...currentContext,
        ...enrichmentData,
        lastEnriched: new Date().toISOString(),
    };
    await ioc.update({
        context: updatedContext,
    }, { transaction });
    return ioc;
};
exports.enrichIOCWithIntelligence = enrichIOCWithIntelligence;
/**
 * 14. Correlates multiple IOCs to identify related indicators.
 *
 * @param {ModelCtor<Model>} IOCModel - IOC model
 * @param {string} iocId - Source IOC identifier
 * @param {number} [confidenceThreshold=60] - Minimum confidence for correlation
 * @returns {Promise<any[]>} Related IOCs
 *
 * @example
 * ```typescript
 * const relatedIOCs = await correlateRelatedIOCs(IOCIndicator, 'ioc-123', 70);
 * // Returns IOCs likely related to the same threat
 * ```
 */
const correlateRelatedIOCs = async (IOCModel, iocId, confidenceThreshold = 60) => {
    const sourceIOC = await IOCModel.findByPk(iocId);
    if (!sourceIOC) {
        throw new Error('IOC not found');
    }
    const sourceTags = sourceIOC.tags || [];
    const sourceContext = sourceIOC.context || {};
    return await IOCModel.findAll({
        where: {
            id: { [sequelize_1.Op.ne]: iocId },
            confidence: { [sequelize_1.Op.gte]: confidenceThreshold },
            [sequelize_1.Op.or]: [
                { tags: { [sequelize_1.Op.overlap]: sourceTags } },
                (0, sequelize_1.literal)(`context->>'threatActor' = '${sourceContext.threatActor}'`),
                (0, sequelize_1.literal)(`context->>'campaign' = '${sourceContext.campaign}'`),
            ],
        },
        attributes: {
            include: [
                [
                    (0, sequelize_1.literal)(`
            (
              SELECT COUNT(*)
              FROM unnest(tags) tag
              WHERE tag = ANY(ARRAY[${sourceTags.map((t) => `'${t}'`).join(',')}])
            )
          `),
                    'tagOverlap',
                ],
            ],
        },
        order: [[(0, sequelize_1.literal)('tagOverlap'), 'DESC']],
        limit: 20,
    });
};
exports.correlateRelatedIOCs = correlateRelatedIOCs;
/**
 * 15. Tracks IOC aging and deprecates stale indicators.
 *
 * @param {ModelCtor<Model>} IOCModel - IOC model
 * @param {number} staleDays - Days since last seen to consider stale
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Number of deprecated IOCs
 *
 * @example
 * ```typescript
 * const deprecated = await deprecateStaleIOCs(IOCIndicator, 90);
 * // Deprecates IOCs not seen in 90 days
 * ```
 */
const deprecateStaleIOCs = async (IOCModel, staleDays, transaction) => {
    const staleDate = new Date(Date.now() - staleDays * 24 * 60 * 60 * 1000);
    const [affectedRows] = await IOCModel.update({
        status: 'deprecated',
        deprecatedAt: new Date(),
    }, {
        where: {
            lastSeen: { [sequelize_1.Op.lt]: staleDate },
            status: { [sequelize_1.Op.ne]: 'deprecated' },
        },
        transaction,
    });
    return affectedRows;
};
exports.deprecateStaleIOCs = deprecateStaleIOCs;
// ============================================================================
// BEHAVIORAL ANALYTICS
// ============================================================================
/**
 * 16. Detects statistical anomalies in entity behavior.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {string} entityType - Type of entity
 * @param {string} entityId - Entity identifier
 * @param {string} metric - Metric to analyze
 * @param {number} daysLookback - Historical period for baseline
 * @returns {Promise<BehavioralAnomaly[]>} Detected anomalies
 *
 * @example
 * ```typescript
 * const anomalies = await detectBehavioralAnomalies(
 *   sequelize,
 *   'user',
 *   'user-123',
 *   'login_count',
 *   30
 * );
 * ```
 */
const detectBehavioralAnomalies = async (sequelize, entityType, entityId, metric, daysLookback) => {
    const [results] = await sequelize.query(`
    WITH historical_data AS (
      SELECT
        DATE_TRUNC('day', timestamp) as date,
        COUNT(*) as daily_value
      FROM behavioral_events
      WHERE entity_type = :entityType
        AND entity_id = :entityId
        AND metric_name = :metric
        AND timestamp >= CURRENT_DATE - INTERVAL '${daysLookback} days'
      GROUP BY DATE_TRUNC('day', timestamp)
    ),
    baseline_stats AS (
      SELECT
        AVG(daily_value) as mean,
        STDDEV(daily_value) as stddev
      FROM historical_data
    ),
    recent_data AS (
      SELECT
        DATE_TRUNC('day', timestamp) as date,
        COUNT(*) as daily_value
      FROM behavioral_events
      WHERE entity_type = :entityType
        AND entity_id = :entityId
        AND metric_name = :metric
        AND timestamp >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY DATE_TRUNC('day', timestamp)
    )
    SELECT
      :entityType as entity_type,
      :entityId as entity_id,
      'statistical' as anomaly_type,
      :metric as metric,
      b.mean as baseline_value,
      r.daily_value as observed_value,
      ABS(r.daily_value - b.mean) / NULLIF(b.stddev, 0) as deviation_score,
      r.date as detected_at,
      CASE
        WHEN ABS(r.daily_value - b.mean) / NULLIF(b.stddev, 0) >= 4 THEN 'critical'
        WHEN ABS(r.daily_value - b.mean) / NULLIF(b.stddev, 0) >= 3 THEN 'high'
        WHEN ABS(r.daily_value - b.mean) / NULLIF(b.stddev, 0) >= 2 THEN 'medium'
        ELSE 'low'
      END as severity
    FROM recent_data r
    CROSS JOIN baseline_stats b
    WHERE ABS(r.daily_value - b.mean) / NULLIF(b.stddev, 0) >= 2
    ORDER BY deviation_score DESC
  `, {
        replacements: { entityType, entityId, metric },
        type: sequelize.QueryTypes.SELECT,
    });
    return results;
};
exports.detectBehavioralAnomalies = detectBehavioralAnomalies;
/**
 * 17. Identifies peer group deviations in behavior patterns.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {string} entityId - Entity identifier
 * @param {string} peerGroupAttribute - Attribute defining peer group
 * @param {string} metric - Metric to compare
 * @returns {Promise<any>} Peer deviation analysis
 *
 * @example
 * ```typescript
 * const deviation = await analyzePeerGroupDeviation(
 *   sequelize,
 *   'user-123',
 *   'department',
 *   'data_access_volume'
 * );
 * ```
 */
const analyzePeerGroupDeviation = async (sequelize, entityId, peerGroupAttribute, metric) => {
    const [results] = await sequelize.query(`
    WITH entity_data AS (
      SELECT
        e.${peerGroupAttribute} as peer_group,
        SUM(CASE WHEN be.entity_id = :entityId THEN be.value ELSE 0 END) as entity_value,
        AVG(be.value) as peer_avg,
        STDDEV(be.value) as peer_stddev,
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY be.value) as peer_median
      FROM entities e
      JOIN behavioral_events be ON e.id = be.entity_id
      WHERE be.metric_name = :metric
        AND be.timestamp >= CURRENT_DATE - INTERVAL '7 days'
        AND e.${peerGroupAttribute} = (
          SELECT ${peerGroupAttribute}
          FROM entities
          WHERE id = :entityId
        )
      GROUP BY e.${peerGroupAttribute}
    )
    SELECT
      peer_group,
      entity_value,
      peer_avg,
      peer_median,
      peer_stddev,
      (entity_value - peer_avg) / NULLIF(peer_stddev, 0) as z_score,
      CASE
        WHEN (entity_value - peer_avg) / NULLIF(peer_stddev, 0) >= 3 THEN 'critical'
        WHEN (entity_value - peer_avg) / NULLIF(peer_stddev, 0) >= 2 THEN 'high'
        WHEN (entity_value - peer_avg) / NULLIF(peer_stddev, 0) >= 1 THEN 'medium'
        ELSE 'low'
      END as anomaly_severity
    FROM entity_data
  `, {
        replacements: { entityId, metric },
        type: sequelize.QueryTypes.SELECT,
    });
    return results[0] || {};
};
exports.analyzePeerGroupDeviation = analyzePeerGroupDeviation;
/**
 * 18. Builds behavioral baseline profile for an entity.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {string} entityType - Type of entity
 * @param {string} entityId - Entity identifier
 * @param {number} baselineDays - Days to use for baseline
 * @returns {Promise<any>} Behavioral baseline profile
 *
 * @example
 * ```typescript
 * const baseline = await buildBehavioralBaseline(
 *   sequelize,
 *   'user',
 *   'user-123',
 *   90
 * );
 * ```
 */
const buildBehavioralBaseline = async (sequelize, entityType, entityId, baselineDays) => {
    const [results] = await sequelize.query(`
    SELECT
      metric_name,
      COUNT(*) as event_count,
      AVG(value) as avg_value,
      STDDEV(value) as stddev_value,
      MIN(value) as min_value,
      MAX(value) as max_value,
      PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY value) as q1,
      PERCENTILE_CONT(0.50) WITHIN GROUP (ORDER BY value) as median,
      PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY value) as q3,
      PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY value) as p95,
      array_agg(DISTINCT EXTRACT(HOUR FROM timestamp)) as active_hours,
      array_agg(DISTINCT EXTRACT(DOW FROM timestamp)) as active_days
    FROM behavioral_events
    WHERE entity_type = :entityType
      AND entity_id = :entityId
      AND timestamp >= CURRENT_DATE - INTERVAL '${baselineDays} days'
    GROUP BY metric_name
  `, {
        replacements: { entityType, entityId },
        type: sequelize.QueryTypes.SELECT,
    });
    return {
        entityType,
        entityId,
        baselinePeriodDays: baselineDays,
        metrics: results,
        createdAt: new Date(),
    };
};
exports.buildBehavioralBaseline = buildBehavioralBaseline;
/**
 * 19. Detects unusual time-based access patterns.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {string} entityId - Entity identifier
 * @param {number} daysLookback - Period to analyze
 * @returns {Promise<any[]>} Unusual time patterns
 *
 * @example
 * ```typescript
 * const patterns = await detectUnusualTimingPatterns(sequelize, 'user-123', 30);
 * // Detects access at unusual hours
 * ```
 */
const detectUnusualTimingPatterns = async (sequelize, entityId, daysLookback) => {
    const [results] = await sequelize.query(`
    WITH historical_hours AS (
      SELECT
        EXTRACT(HOUR FROM timestamp) as hour,
        COUNT(*) as event_count
      FROM behavioral_events
      WHERE entity_id = :entityId
        AND timestamp >= CURRENT_DATE - INTERVAL '${daysLookback} days'
        AND timestamp < CURRENT_DATE - INTERVAL '7 days'
      GROUP BY EXTRACT(HOUR FROM timestamp)
    ),
    recent_hours AS (
      SELECT
        EXTRACT(HOUR FROM timestamp) as hour,
        COUNT(*) as event_count,
        array_agg(DISTINCT DATE(timestamp)) as dates
      FROM behavioral_events
      WHERE entity_id = :entityId
        AND timestamp >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY EXTRACT(HOUR FROM timestamp)
    )
    SELECT
      r.hour,
      r.event_count as recent_count,
      COALESCE(h.event_count, 0) as historical_count,
      r.dates,
      CASE
        WHEN COALESCE(h.event_count, 0) = 0 AND r.event_count > 0 THEN 'new_hour_pattern'
        WHEN r.event_count > h.event_count * 3 THEN 'significant_increase'
        ELSE 'normal'
      END as pattern_type,
      CASE
        WHEN r.hour BETWEEN 0 AND 6 OR r.hour BETWEEN 22 AND 23 THEN 'off_hours'
        WHEN r.hour BETWEEN 9 AND 17 THEN 'business_hours'
        ELSE 'extended_hours'
      END as time_category
    FROM recent_hours r
    LEFT JOIN historical_hours h ON r.hour = h.hour
    WHERE (
      (COALESCE(h.event_count, 0) = 0 AND r.event_count > 0) OR
      (r.event_count > h.event_count * 3)
    )
    ORDER BY r.hour
  `, {
        replacements: { entityId },
        type: sequelize.QueryTypes.SELECT,
    });
    return results;
};
exports.detectUnusualTimingPatterns = detectUnusualTimingPatterns;
/**
 * 20. Identifies anomalous data exfiltration patterns.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {string} entityId - Entity identifier
 * @param {number} thresholdGB - Data volume threshold in GB
 * @returns {Promise<any[]>} Potential exfiltration events
 *
 * @example
 * ```typescript
 * const exfiltration = await detectDataExfiltrationPatterns(
 *   sequelize,
 *   'user-123',
 *   5 // Alert if >5GB transferred
 * );
 * ```
 */
const detectDataExfiltrationPatterns = async (sequelize, entityId, thresholdGB) => {
    const [results] = await sequelize.query(`
    WITH daily_transfers AS (
      SELECT
        DATE(timestamp) as date,
        SUM(bytes_transferred) / (1024.0 * 1024 * 1024) as gb_transferred,
        COUNT(DISTINCT dest_ip) as unique_destinations,
        COUNT(*) as transfer_count,
        array_agg(DISTINCT protocol) as protocols_used,
        array_agg(DISTINCT dest_country) as countries
      FROM network_events
      WHERE source_entity_id = :entityId
        AND event_type = 'data_transfer'
        AND timestamp >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY DATE(timestamp)
    ),
    baseline AS (
      SELECT
        AVG(gb_transferred) as avg_daily_gb,
        STDDEV(gb_transferred) as stddev_daily_gb
      FROM daily_transfers
      WHERE date < CURRENT_DATE - INTERVAL '7 days'
    )
    SELECT
      dt.date,
      dt.gb_transferred,
      dt.unique_destinations,
      dt.transfer_count,
      dt.protocols_used,
      dt.countries,
      b.avg_daily_gb,
      (dt.gb_transferred - b.avg_daily_gb) / NULLIF(b.stddev_daily_gb, 0) as z_score,
      CASE
        WHEN dt.gb_transferred >= :thresholdGB THEN 'threshold_exceeded'
        WHEN (dt.gb_transferred - b.avg_daily_gb) / NULLIF(b.stddev_daily_gb, 0) >= 3 THEN 'statistical_anomaly'
        WHEN dt.unique_destinations >= 50 THEN 'many_destinations'
        ELSE 'normal'
      END as anomaly_type
    FROM daily_transfers dt
    CROSS JOIN baseline b
    WHERE
      dt.date >= CURRENT_DATE - INTERVAL '7 days'
      AND (
        dt.gb_transferred >= :thresholdGB OR
        (dt.gb_transferred - b.avg_daily_gb) / NULLIF(b.stddev_daily_gb, 0) >= 3 OR
        dt.unique_destinations >= 50
      )
    ORDER BY dt.date DESC
  `, {
        replacements: { entityId, thresholdGB },
        type: sequelize.QueryTypes.SELECT,
    });
    return results;
};
exports.detectDataExfiltrationPatterns = detectDataExfiltrationPatterns;
// ============================================================================
// THREAT DISCOVERY & DOCUMENTATION
// ============================================================================
/**
 * 21. Creates a threat discovery record.
 *
 * @param {ModelCtor<Model>} DiscoveryModel - Threat discovery model
 * @param {string} campaignId - Campaign identifier
 * @param {Partial<ThreatDiscovery>} discoveryData - Discovery details
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created discovery
 *
 * @example
 * ```typescript
 * const discovery = await createThreatDiscovery(ThreatDiscovery, 'campaign-123', {
 *   hunterId: 'hunter-456',
 *   discoveryType: 'ioc_match',
 *   severity: 'high',
 *   confidence: 85,
 *   title: 'Suspicious PowerShell execution with encoded commands',
 *   description: 'Detected Base64 encoded PowerShell commands matching APT pattern',
 *   affectedAssets: ['WS-001', 'WS-045', 'WS-089'],
 *   mitreTactics: ['TA0002'],
 *   mitreTechniques: ['T1059.001', 'T1027']
 * });
 * ```
 */
const createThreatDiscovery = async (DiscoveryModel, campaignId, discoveryData, transaction) => {
    return await DiscoveryModel.create({
        campaignId,
        ...discoveryData,
        discoveredAt: new Date(),
        escalatedToIncident: false,
    }, { transaction });
};
exports.createThreatDiscovery = createThreatDiscovery;
/**
 * 22. Escalates threat discovery to security incident.
 *
 * @param {ModelCtor<Model>} DiscoveryModel - Discovery model
 * @param {ModelCtor<Model>} IncidentModel - Incident model
 * @param {string} discoveryId - Discovery identifier
 * @param {string} analystId - Analyst escalating
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created incident
 *
 * @example
 * ```typescript
 * const incident = await escalateDiscoveryToIncident(
 *   ThreatDiscovery,
 *   SecurityIncident,
 *   'discovery-123',
 *   'analyst-456'
 * );
 * ```
 */
const escalateDiscoveryToIncident = async (DiscoveryModel, IncidentModel, discoveryId, analystId, transaction) => {
    const discovery = await DiscoveryModel.findByPk(discoveryId);
    if (!discovery) {
        throw new Error('Discovery not found');
    }
    const data = discovery.get({ plain: true });
    const incident = await IncidentModel.create({
        title: data.title,
        description: data.description,
        severity: data.severity,
        status: 'open',
        source: 'threat_hunting',
        sourceId: discoveryId,
        affectedAssets: data.affectedAssets,
        mitreTactics: data.mitreTactics,
        mitreTechniques: data.mitreTechniques,
        assignedTo: analystId,
        createdAt: new Date(),
    }, { transaction });
    await discovery.update({
        escalatedToIncident: true,
        incidentId: incident.id,
    }, { transaction });
    return incident;
};
exports.escalateDiscoveryToIncident = escalateDiscoveryToIncident;
/**
 * 23. Retrieves all discoveries for a campaign with filtering.
 *
 * @param {ModelCtor<Model>} DiscoveryModel - Discovery model
 * @param {string} campaignId - Campaign identifier
 * @param {WhereOptions} [filters] - Optional filters
 * @returns {Promise<any[]>} Campaign discoveries
 *
 * @example
 * ```typescript
 * const discoveries = await getCampaignDiscoveries(
 *   ThreatDiscovery,
 *   'campaign-123',
 *   { severity: { [Op.in]: ['high', 'critical'] } }
 * );
 * ```
 */
const getCampaignDiscoveries = async (DiscoveryModel, UserModel, campaignId, filters) => {
    return await DiscoveryModel.findAll({
        where: {
            campaignId,
            ...filters,
        },
        include: [
            {
                model: UserModel,
                as: 'hunter',
                attributes: ['id', 'email', 'firstName', 'lastName'],
                required: true,
            },
        ],
        order: [
            ['severity', 'DESC'],
            ['confidence', 'DESC'],
            ['discoveredAt', 'DESC'],
        ],
    });
};
exports.getCampaignDiscoveries = getCampaignDiscoveries;
/**
 * 24. Analyzes discovery patterns to identify trends.
 *
 * @param {ModelCtor<Model>} DiscoveryModel - Discovery model
 * @param {Date} startDate - Analysis start date
 * @param {Date} endDate - Analysis end date
 * @returns {Promise<any[]>} Discovery trends
 *
 * @example
 * ```typescript
 * const trends = await analyzeDiscoveryTrends(
 *   ThreatDiscovery,
 *   new Date('2024-01-01'),
 *   new Date('2024-03-31')
 * );
 * ```
 */
const analyzeDiscoveryTrends = async (DiscoveryModel, startDate, endDate) => {
    return await DiscoveryModel.findAll({
        where: {
            discoveredAt: {
                [sequelize_1.Op.between]: [startDate, endDate],
            },
        },
        attributes: [
            [(0, sequelize_1.fn)('DATE_TRUNC', 'week', (0, sequelize_1.col)('discoveredAt')), 'week'],
            [(0, sequelize_1.fn)('COUNT', (0, sequelize_1.col)('id')), 'discoveryCount'],
            [
                (0, sequelize_1.fn)('COUNT', (0, sequelize_1.literal)("CASE WHEN severity IN ('high', 'critical') THEN 1 END")),
                'highSeverityCount',
            ],
            [
                (0, sequelize_1.fn)('COUNT', (0, sequelize_1.literal)("CASE WHEN escalated_to_incident = true THEN 1 END")),
                'escalatedCount',
            ],
            [(0, sequelize_1.fn)('AVG', (0, sequelize_1.col)('confidence')), 'avgConfidence'],
            [
                (0, sequelize_1.literal)("array_agg(DISTINCT discovery_type)"),
                'discoveryTypes',
            ],
        ],
        group: [(0, sequelize_1.fn)('DATE_TRUNC', 'week', (0, sequelize_1.col)('discoveredAt'))],
        order: [[(0, sequelize_1.fn)('DATE_TRUNC', 'week', (0, sequelize_1.col)('discoveredAt')), 'ASC']],
    });
};
exports.analyzeDiscoveryTrends = analyzeDiscoveryTrends;
/**
 * 25. Links related discoveries for correlation analysis.
 *
 * @param {ModelCtor<Model>} DiscoveryModel - Discovery model
 * @param {string} discoveryId - Source discovery ID
 * @param {number} [correlationThreshold=70] - Minimum correlation score
 * @returns {Promise<any[]>} Related discoveries
 *
 * @example
 * ```typescript
 * const related = await correlateRelatedDiscoveries(
 *   ThreatDiscovery,
 *   'discovery-123',
 *   75
 * );
 * ```
 */
const correlateRelatedDiscoveries = async (DiscoveryModel, discoveryId, correlationThreshold = 70) => {
    const sourceDiscovery = await DiscoveryModel.findByPk(discoveryId);
    if (!sourceDiscovery) {
        throw new Error('Discovery not found');
    }
    const source = sourceDiscovery.get({ plain: true });
    return await DiscoveryModel.findAll({
        where: {
            id: { [sequelize_1.Op.ne]: discoveryId },
            [sequelize_1.Op.or]: [
                { affectedAssets: { [sequelize_1.Op.overlap]: source.affectedAssets } },
                { indicators: { [sequelize_1.Op.overlap]: source.indicators } },
                { mitreTechniques: { [sequelize_1.Op.overlap]: source.mitreTechniques } },
            ],
        },
        attributes: {
            include: [
                [
                    (0, sequelize_1.literal)(`
            (
              (SELECT COUNT(*) FROM unnest(affected_assets) WHERE unnest = ANY(ARRAY[${source.affectedAssets.map((a) => `'${a}'`).join(',')}])) * 30 +
              (SELECT COUNT(*) FROM unnest(indicators) WHERE unnest = ANY(ARRAY[${(source.indicators || []).map((i) => `'${i}'`).join(',')}])) * 40 +
              (SELECT COUNT(*) FROM unnest(mitre_techniques) WHERE unnest = ANY(ARRAY[${source.mitreTechniques.map((t) => `'${t}'`).join(',')}])) * 30
            )
          `),
                    'correlationScore',
                ],
            ],
        },
        having: (0, sequelize_1.literal)(`
      (
        (SELECT COUNT(*) FROM unnest(affected_assets) WHERE unnest = ANY(ARRAY[${source.affectedAssets.map((a) => `'${a}'`).join(',')}])) * 30 +
        (SELECT COUNT(*) FROM unnest(indicators) WHERE unnest = ANY(ARRAY[${(source.indicators || []).map((i) => `'${i}'`).join(',')}])) * 40 +
        (SELECT COUNT(*) FROM unnest(mitre_techniques) WHERE unnest = ANY(ARRAY[${source.mitreTechniques.map((t) => `'${t}'`).join(',')}])) * 30
      ) >= ${correlationThreshold}
    `),
        order: [[(0, sequelize_1.literal)('correlationScore'), 'DESC']],
        limit: 10,
    });
};
exports.correlateRelatedDiscoveries = correlateRelatedDiscoveries;
// ============================================================================
// HUNT ACTIVITY TRACKING
// ============================================================================
/**
 * 26. Logs hunt activity with query and results.
 *
 * @param {ModelCtor<Model>} ActivityModel - Hunt activity model
 * @param {string} campaignId - Campaign identifier
 * @param {string} hunterId - Hunter user ID
 * @param {Partial<HuntActivity>} activityData - Activity details
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Logged activity
 *
 * @example
 * ```typescript
 * await logHuntActivity(HuntActivity, 'campaign-123', 'hunter-456', {
 *   activityType: 'query',
 *   description: 'Searching for suspicious PowerShell execution',
 *   dataSource: 'siem',
 *   queryExecuted: 'index=endpoint EventCode=4688 | search process="powershell.exe"',
 *   resultsCount: 247
 * });
 * ```
 */
const logHuntActivity = async (ActivityModel, campaignId, hunterId, activityData, transaction) => {
    return await ActivityModel.create({
        campaignId,
        hunterId,
        ...activityData,
        timestamp: new Date(),
    }, { transaction });
};
exports.logHuntActivity = logHuntActivity;
/**
 * 27. Retrieves hunter productivity metrics.
 *
 * @param {ModelCtor<Model>} ActivityModel - Activity model
 * @param {string} hunterId - Hunter user ID
 * @param {Date} startDate - Metrics start date
 * @param {Date} endDate - Metrics end date
 * @returns {Promise<any>} Productivity metrics
 *
 * @example
 * ```typescript
 * const metrics = await getHunterProductivityMetrics(
 *   HuntActivity,
 *   'hunter-123',
 *   new Date('2024-01-01'),
 *   new Date('2024-03-31')
 * );
 * ```
 */
const getHunterProductivityMetrics = async (ActivityModel, DiscoveryModel, hunterId, startDate, endDate) => {
    const activityMetrics = await ActivityModel.findOne({
        where: {
            hunterId,
            timestamp: {
                [sequelize_1.Op.between]: [startDate, endDate],
            },
        },
        attributes: [
            [(0, sequelize_1.fn)('COUNT', (0, sequelize_1.literal)("DISTINCT campaign_id")), 'campaignsParticipated'],
            [(0, sequelize_1.fn)('COUNT', (0, sequelize_1.col)('id')), 'totalActivities'],
            [
                (0, sequelize_1.fn)('COUNT', (0, sequelize_1.literal)("CASE WHEN activity_type = 'query' THEN 1 END")),
                'queriesExecuted',
            ],
            [(0, sequelize_1.fn)('SUM', (0, sequelize_1.col)('resultsCount')), 'totalResultsReviewed'],
            [(0, sequelize_1.fn)('COUNT', (0, sequelize_1.literal)("DISTINCT data_source")), 'dataSourcesUsed'],
        ],
        raw: true,
    });
    const discoveryMetrics = await DiscoveryModel.findOne({
        where: {
            hunterId,
            discoveredAt: {
                [sequelize_1.Op.between]: [startDate, endDate],
            },
        },
        attributes: [
            [(0, sequelize_1.fn)('COUNT', (0, sequelize_1.col)('id')), 'totalDiscoveries'],
            [
                (0, sequelize_1.fn)('COUNT', (0, sequelize_1.literal)("CASE WHEN severity IN ('high', 'critical') THEN 1 END")),
                'highSeverityDiscoveries',
            ],
            [
                (0, sequelize_1.fn)('COUNT', (0, sequelize_1.literal)("CASE WHEN escalated_to_incident = true THEN 1 END")),
                'escalatedDiscoveries',
            ],
            [(0, sequelize_1.fn)('AVG', (0, sequelize_1.col)('confidence')), 'avgConfidence'],
        ],
        raw: true,
    });
    return {
        hunterId,
        period: {
            startDate,
            endDate,
        },
        activity: activityMetrics,
        discoveries: discoveryMetrics,
        efficiency: {
            discoveriesPerQuery: parseFloat((discoveryMetrics.totalDiscoveries / activityMetrics.queriesExecuted).toFixed(2)),
            highValueDiscoveryRate: parseFloat(((discoveryMetrics.highSeverityDiscoveries / discoveryMetrics.totalDiscoveries) * 100).toFixed(2)),
        },
    };
};
exports.getHunterProductivityMetrics = getHunterProductivityMetrics;
/**
 * 28. Analyzes query effectiveness across data sources.
 *
 * @param {ModelCtor<Model>} ActivityModel - Activity model
 * @param {string} campaignId - Campaign identifier
 * @returns {Promise<any[]>} Data source effectiveness
 *
 * @example
 * ```typescript
 * const effectiveness = await analyzeQueryEffectiveness(
 *   HuntActivity,
 *   'campaign-123'
 * );
 * ```
 */
const analyzeQueryEffectiveness = async (ActivityModel, campaignId) => {
    return await ActivityModel.findAll({
        where: { campaignId },
        attributes: [
            'dataSource',
            [(0, sequelize_1.fn)('COUNT', (0, sequelize_1.col)('id')), 'queryCount'],
            [(0, sequelize_1.fn)('AVG', (0, sequelize_1.col)('resultsCount')), 'avgResults'],
            [(0, sequelize_1.fn)('SUM', (0, sequelize_1.col)('resultsCount')), 'totalResults'],
            [
                (0, sequelize_1.literal)("COUNT(CASE WHEN results_count > 0 THEN 1 END) * 100.0 / COUNT(*)"),
                'successRate',
            ],
        ],
        group: ['dataSource'],
        order: [[(0, sequelize_1.literal)('successRate'), 'DESC']],
    });
};
exports.analyzeQueryEffectiveness = analyzeQueryEffectiveness;
/**
 * 29. Generates hunt activity summary report.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {string} campaignId - Campaign identifier
 * @returns {Promise<any>} Activity summary
 *
 * @example
 * ```typescript
 * const summary = await generateActivitySummary(sequelize, 'campaign-123');
 * ```
 */
const generateActivitySummary = async (sequelize, campaignId) => {
    const [results] = await sequelize.query(`
    WITH campaign_data AS (
      SELECT
        start_date,
        end_date,
        EXTRACT(EPOCH FROM (COALESCE(end_date, CURRENT_TIMESTAMP) - start_date)) / 3600 as total_hours
      FROM hunt_campaigns
      WHERE id = :campaignId
    ),
    activity_stats AS (
      SELECT
        COUNT(*) as total_activities,
        COUNT(DISTINCT hunter_id) as hunters_involved,
        COUNT(DISTINCT data_source) as data_sources_queried,
        SUM(results_count) as total_results,
        MIN(timestamp) as first_activity,
        MAX(timestamp) as last_activity
      FROM hunt_activities
      WHERE campaign_id = :campaignId
    ),
    discovery_stats AS (
      SELECT
        COUNT(*) as total_discoveries,
        COUNT(CASE WHEN severity IN ('high', 'critical') THEN 1 END) as critical_discoveries,
        COUNT(CASE WHEN escalated_to_incident = true THEN 1 END) as incidents_generated
      FROM threat_discoveries
      WHERE campaign_id = :campaignId
    )
    SELECT
      cd.total_hours,
      ast.*,
      dst.*,
      (dst.total_discoveries * 1.0 / NULLIF(ast.total_activities, 0)) as discovery_rate,
      (dst.incidents_generated * 1.0 / NULLIF(dst.total_discoveries, 0)) as incident_conversion_rate
    FROM campaign_data cd
    CROSS JOIN activity_stats ast
    CROSS JOIN discovery_stats dst
  `, {
        replacements: { campaignId },
        type: sequelize.QueryTypes.SELECT,
    });
    return results[0] || {};
};
exports.generateActivitySummary = generateActivitySummary;
/**
 * 30. Tracks temporal patterns in hunt activities.
 *
 * @param {ModelCtor<Model>} ActivityModel - Activity model
 * @param {string} campaignId - Campaign identifier
 * @returns {Promise<any[]>} Temporal activity patterns
 *
 * @example
 * ```typescript
 * const patterns = await trackActivityTemporalPatterns(
 *   HuntActivity,
 *   'campaign-123'
 * );
 * ```
 */
const trackActivityTemporalPatterns = async (ActivityModel, campaignId) => {
    return await ActivityModel.findAll({
        where: { campaignId },
        attributes: [
            [(0, sequelize_1.fn)('DATE_TRUNC', 'day', (0, sequelize_1.col)('timestamp')), 'date'],
            [(0, sequelize_1.fn)('EXTRACT', (0, sequelize_1.literal)("HOUR FROM timestamp")), 'hour'],
            [(0, sequelize_1.fn)('COUNT', (0, sequelize_1.col)('id')), 'activityCount'],
            [
                (0, sequelize_1.fn)('COUNT', (0, sequelize_1.literal)("CASE WHEN activity_type = 'query' THEN 1 END")),
                'queryCount',
            ],
            [(0, sequelize_1.fn)('AVG', (0, sequelize_1.col)('resultsCount')), 'avgResults'],
        ],
        group: [
            (0, sequelize_1.fn)('DATE_TRUNC', 'day', (0, sequelize_1.col)('timestamp')),
            (0, sequelize_1.fn)('EXTRACT', (0, sequelize_1.literal)("HOUR FROM timestamp")),
        ],
        order: [
            [(0, sequelize_1.fn)('DATE_TRUNC', 'day', (0, sequelize_1.col)('timestamp')), 'ASC'],
            [(0, sequelize_1.fn)('EXTRACT', (0, sequelize_1.literal)("HOUR FROM timestamp")), 'ASC'],
        ],
    });
};
exports.trackActivityTemporalPatterns = trackActivityTemporalPatterns;
// ============================================================================
// HUNT METRICS & REPORTING
// ============================================================================
/**
 * 31. Calculates comprehensive hunt campaign metrics.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {string} campaignId - Campaign identifier
 * @returns {Promise<HuntMetrics>} Campaign metrics
 *
 * @example
 * ```typescript
 * const metrics = await calculateHuntCampaignMetrics(sequelize, 'campaign-123');
 * ```
 */
const calculateHuntCampaignMetrics = async (sequelize, campaignId) => {
    const [results] = await sequelize.query(`
    WITH campaign_info AS (
      SELECT
        start_date,
        end_date,
        EXTRACT(EPOCH FROM (COALESCE(end_date, CURRENT_TIMESTAMP) - start_date)) / 3600 as duration_hours
      FROM hunt_campaigns
      WHERE id = :campaignId
    ),
    activity_metrics AS (
      SELECT
        COUNT(CASE WHEN activity_type = 'query' THEN 1 END) as queries_executed,
        COUNT(DISTINCT data_source) as data_sources,
        MIN(timestamp) as first_activity,
        MAX(timestamp) as last_activity
      FROM hunt_activities
      WHERE campaign_id = :campaignId
    ),
    discovery_metrics AS (
      SELECT
        COUNT(*) as discovery_count,
        COUNT(CASE WHEN escalated_to_incident = true THEN 1 END) as incidents_generated,
        AVG(EXTRACT(EPOCH FROM (discovered_at - (SELECT start_date FROM campaign_info))) / 3600) as avg_time_to_discovery,
        COUNT(CASE WHEN discovery_type = 'false_positive' THEN 1 END) as false_positives
      FROM threat_discoveries
      WHERE campaign_id = :campaignId
    )
    SELECT
      ci.duration_hours,
      am.queries_executed,
      am.data_sources,
      dm.discovery_count,
      CASE
        WHEN dm.discovery_count > 0
        THEN dm.false_positives * 100.0 / dm.discovery_count
        ELSE 0
      END as false_positive_rate,
      dm.incidents_generated,
      dm.avg_time_to_discovery,
      CASE
        WHEN ci.duration_hours > 0
        THEN dm.discovery_count * 1.0 / ci.duration_hours
        ELSE 0
      END as hunter_efficiency
    FROM campaign_info ci
    CROSS JOIN activity_metrics am
    CROSS JOIN discovery_metrics dm
  `, {
        replacements: { campaignId },
        type: sequelize.QueryTypes.SELECT,
    });
    const data = results[0] || {};
    return {
        campaignId,
        duration: parseFloat(data.duration_hours || '0'),
        queriesExecuted: parseInt(data.queries_executed || '0', 10),
        dataSources: parseInt(data.data_sources || '0', 10),
        discoveryCount: parseInt(data.discovery_count || '0', 10),
        falsePositiveRate: parseFloat(data.false_positive_rate || '0'),
        incidentsGenerated: parseInt(data.incidents_generated || '0', 10),
        timeToDiscovery: parseFloat(data.avg_time_to_discovery || '0'),
        hunterEfficiency: parseFloat(data.hunter_efficiency || '0'),
    };
};
exports.calculateHuntCampaignMetrics = calculateHuntCampaignMetrics;
/**
 * 32. Generates executive summary report for hunt campaign.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {string} campaignId - Campaign identifier
 * @returns {Promise<any>} Executive summary
 *
 * @example
 * ```typescript
 * const summary = await generateHuntExecutiveSummary(sequelize, 'campaign-123');
 * ```
 */
const generateHuntExecutiveSummary = async (sequelize, campaignId) => {
    const [results] = await sequelize.query(`
    WITH campaign AS (
      SELECT
        name,
        description,
        hypothesis,
        hunt_type,
        priority,
        start_date,
        end_date,
        status
      FROM hunt_campaigns
      WHERE id = :campaignId
    ),
    key_findings AS (
      SELECT
        COUNT(*) as total_discoveries,
        COUNT(CASE WHEN severity = 'critical' THEN 1 END) as critical_findings,
        COUNT(CASE WHEN severity = 'high' THEN 1 END) as high_findings,
        COUNT(CASE WHEN escalated_to_incident = true THEN 1 END) as incidents_created,
        array_agg(DISTINCT mitre_tactics) as tactics_observed,
        array_agg(DISTINCT mitre_techniques) as techniques_observed,
        COUNT(DISTINCT affected_assets::text) as affected_systems
      FROM threat_discoveries
      WHERE campaign_id = :campaignId
    ),
    hypothesis_results AS (
      SELECT
        COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as hypotheses_confirmed,
        COUNT(CASE WHEN status = 'refuted' THEN 1 END) as hypotheses_refuted,
        COUNT(CASE WHEN status = 'inconclusive' THEN 1 END) as hypotheses_inconclusive
      FROM hunt_hypotheses
      WHERE campaign_id = :campaignId
    ),
    resources AS (
      SELECT
        COUNT(DISTINCT hunter_id) as hunters_assigned,
        COUNT(DISTINCT data_source) as data_sources_used,
        COUNT(*) as total_queries,
        EXTRACT(EPOCH FROM (MAX(timestamp) - MIN(timestamp))) / 3600 as actual_hours_spent
      FROM hunt_activities
      WHERE campaign_id = :campaignId
    )
    SELECT
      c.*,
      kf.*,
      hr.*,
      r.*
    FROM campaign c
    CROSS JOIN key_findings kf
    CROSS JOIN hypothesis_results hr
    CROSS JOIN resources r
  `, {
        replacements: { campaignId },
        type: sequelize.QueryTypes.SELECT,
    });
    return results[0] || {};
};
exports.generateHuntExecutiveSummary = generateHuntExecutiveSummary;
/**
 * 33. Compares hunt campaigns for benchmarking.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {string[]} campaignIds - Campaign identifiers to compare
 * @returns {Promise<any[]>} Comparative metrics
 *
 * @example
 * ```typescript
 * const comparison = await compareHuntCampaigns(
 *   sequelize,
 *   ['campaign-1', 'campaign-2', 'campaign-3']
 * );
 * ```
 */
const compareHuntCampaigns = async (sequelize, campaignIds) => {
    const [results] = await sequelize.query(`
    SELECT
      hc.id,
      hc.name,
      hc.hunt_type,
      hc.priority,
      EXTRACT(EPOCH FROM (COALESCE(hc.end_date, CURRENT_TIMESTAMP) - hc.start_date)) / 3600 as duration_hours,
      (
        SELECT COUNT(*)
        FROM hunt_activities
        WHERE campaign_id = hc.id
      ) as total_activities,
      (
        SELECT COUNT(*)
        FROM threat_discoveries
        WHERE campaign_id = hc.id
      ) as discoveries,
      (
        SELECT COUNT(*)
        FROM threat_discoveries
        WHERE campaign_id = hc.id
          AND severity IN ('high', 'critical')
      ) as high_severity_discoveries,
      (
        SELECT COUNT(*)
        FROM threat_discoveries
        WHERE campaign_id = hc.id
          AND escalated_to_incident = true
      ) as incidents_generated,
      (
        SELECT COUNT(DISTINCT hunter_id)
        FROM hunt_activities
        WHERE campaign_id = hc.id
      ) as hunters_involved,
      CASE
        WHEN EXTRACT(EPOCH FROM (COALESCE(hc.end_date, CURRENT_TIMESTAMP) - hc.start_date)) / 3600 > 0
        THEN (
          SELECT COUNT(*)
          FROM threat_discoveries
          WHERE campaign_id = hc.id
        ) * 1.0 / (EXTRACT(EPOCH FROM (COALESCE(hc.end_date, CURRENT_TIMESTAMP) - hc.start_date)) / 3600)
        ELSE 0
      END as efficiency_score
    FROM hunt_campaigns hc
    WHERE hc.id = ANY(:campaignIds)
    ORDER BY efficiency_score DESC
  `, {
        replacements: { campaignIds },
        type: sequelize.QueryTypes.SELECT,
    });
    return results;
};
exports.compareHuntCampaigns = compareHuntCampaigns;
/**
 * 34. Generates MITRE ATT&CK coverage report from discoveries.
 *
 * @param {ModelCtor<Model>} DiscoveryModel - Discovery model
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @returns {Promise<any>} MITRE coverage analysis
 *
 * @example
 * ```typescript
 * const coverage = await generateMITRECoverageReport(
 *   ThreatDiscovery,
 *   new Date('2024-01-01'),
 *   new Date('2024-03-31')
 * );
 * ```
 */
const generateMITRECoverageReport = async (DiscoveryModel, startDate, endDate) => {
    const tactics = await DiscoveryModel.findAll({
        where: {
            discoveredAt: {
                [sequelize_1.Op.between]: [startDate, endDate],
            },
        },
        attributes: [
            [(0, sequelize_1.literal)("unnest(mitre_tactics)"), 'tactic'],
            [(0, sequelize_1.fn)('COUNT', (0, sequelize_1.col)('id')), 'discoveryCount'],
            [
                (0, sequelize_1.fn)('COUNT', (0, sequelize_1.literal)("CASE WHEN severity IN ('high', 'critical') THEN 1 END")),
                'highSeverityCount',
            ],
        ],
        group: [(0, sequelize_1.literal)("unnest(mitre_tactics)")],
        order: [[(0, sequelize_1.fn)('COUNT', (0, sequelize_1.col)('id')), 'DESC']],
        raw: true,
    });
    const techniques = await DiscoveryModel.findAll({
        where: {
            discoveredAt: {
                [sequelize_1.Op.between]: [startDate, endDate],
            },
        },
        attributes: [
            [(0, sequelize_1.literal)("unnest(mitre_techniques)"), 'technique'],
            [(0, sequelize_1.fn)('COUNT', (0, sequelize_1.col)('id')), 'discoveryCount'],
            [(0, sequelize_1.fn)('AVG', (0, sequelize_1.col)('confidence')), 'avgConfidence'],
        ],
        group: [(0, sequelize_1.literal)("unnest(mitre_techniques)")],
        order: [[(0, sequelize_1.fn)('COUNT', (0, sequelize_1.col)('id')), 'DESC']],
        limit: 20,
        raw: true,
    });
    return {
        period: {
            startDate,
            endDate,
        },
        tactics,
        techniques,
        summary: {
            uniqueTactics: tactics.length,
            uniqueTechniques: techniques.length,
            totalDiscoveries: tactics.reduce((sum, t) => sum + parseInt(t.discoveryCount, 10), 0),
        },
    };
};
exports.generateMITRECoverageReport = generateMITRECoverageReport;
/**
 * 35. Tracks hunt campaign ROI based on threat prevention.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {string} campaignId - Campaign identifier
 * @param {number} campaignCost - Campaign operational cost
 * @returns {Promise<any>} ROI analysis
 *
 * @example
 * ```typescript
 * const roi = await calculateHuntCampaignROI(sequelize, 'campaign-123', 25000);
 * ```
 */
const calculateHuntCampaignROI = async (sequelize, campaignId, campaignCost) => {
    const [results] = await sequelize.query(`
    WITH incidents_prevented AS (
      SELECT
        COUNT(*) as incident_count,
        SUM(
          CASE severity
            WHEN 'critical' THEN 100000
            WHEN 'high' THEN 50000
            WHEN 'medium' THEN 20000
            ELSE 5000
          END
        ) as estimated_cost_avoided
      FROM threat_discoveries
      WHERE campaign_id = :campaignId
        AND escalated_to_incident = true
    ),
    remediation_costs AS (
      SELECT
        SUM(
          CASE
            WHEN affected_assets IS NOT NULL
            THEN cardinality(affected_assets) * 500
            ELSE 0
          END
        ) as total_remediation_cost
      FROM threat_discoveries
      WHERE campaign_id = :campaignId
    )
    SELECT
      ip.incident_count,
      ip.estimated_cost_avoided,
      rc.total_remediation_cost,
      :campaignCost as campaign_cost,
      (ip.estimated_cost_avoided - rc.total_remediation_cost - :campaignCost) as net_value,
      CASE
        WHEN :campaignCost > 0
        THEN ((ip.estimated_cost_avoided - rc.total_remediation_cost - :campaignCost) / :campaignCost * 100)
        ELSE 0
      END as roi_percentage
    FROM incidents_prevented ip
    CROSS JOIN remediation_costs rc
  `, {
        replacements: { campaignId, campaignCost },
        type: sequelize.QueryTypes.SELECT,
    });
    return results[0] || {};
};
exports.calculateHuntCampaignROI = calculateHuntCampaignROI;
// ============================================================================
// ADVANCED HUNT WORKFLOWS
// ============================================================================
/**
 * 36. Initiates automated IOC enrichment workflow.
 *
 * @param {ModelCtor<Model>} IOCModel - IOC model
 * @param {string} iocId - IOC identifier
 * @param {string[]} enrichmentSources - Enrichment APIs/sources
 * @returns {Promise<any>} Enrichment results
 *
 * @example
 * ```typescript
 * const enriched = await initiateIOCEnrichment(
 *   IOCIndicator,
 *   'ioc-123',
 *   ['virustotal', 'abuseipdb', 'threatfox']
 * );
 * ```
 */
const initiateIOCEnrichment = async (IOCModel, iocId, enrichmentSources) => {
    const ioc = await IOCModel.findByPk(iocId);
    if (!ioc) {
        throw new Error('IOC not found');
    }
    const enrichmentResults = {
        iocId,
        iocType: ioc.type,
        iocValue: ioc.value,
        sources: {},
        aggregatedScore: 0,
        enrichedAt: new Date(),
    };
    // Placeholder for actual enrichment API calls
    // In production, this would call external threat intelligence APIs
    for (const source of enrichmentSources) {
        enrichmentResults.sources[source] = {
            queried: true,
            timestamp: new Date(),
            // Would contain actual API response data
            placeholder: `Enrichment from ${source} would appear here`,
        };
    }
    return enrichmentResults;
};
exports.initiateIOCEnrichment = initiateIOCEnrichment;
/**
 * 37. Orchestrates multi-phase hunt workflow.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {string} campaignId - Campaign identifier
 * @param {string[]} phases - Hunt phases to execute
 * @returns {Promise<any>} Workflow execution status
 *
 * @example
 * ```typescript
 * const workflow = await orchestrateHuntWorkflow(
 *   sequelize,
 *   'campaign-123',
 *   ['reconnaissance', 'hypothesis_testing', 'validation', 'documentation']
 * );
 * ```
 */
const orchestrateHuntWorkflow = async (sequelize, campaignId, phases) => {
    const workflowExecution = {
        campaignId,
        phases: phases.map((phase, index) => ({
            phaseNumber: index + 1,
            phaseName: phase,
            status: index === 0 ? 'in_progress' : 'pending',
            startedAt: index === 0 ? new Date() : null,
            completedAt: null,
        })),
        currentPhase: phases[0],
        startedAt: new Date(),
        status: 'running',
    };
    // In production, this would integrate with workflow engine
    return workflowExecution;
};
exports.orchestrateHuntWorkflow = orchestrateHuntWorkflow;
/**
 * 38. Generates automated hunt playbook from template.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {string} playbookTemplate - Template identifier
 * @param {Record<string, any>} parameters - Playbook parameters
 * @returns {Promise<any>} Generated playbook
 *
 * @example
 * ```typescript
 * const playbook = await generateHuntPlaybook(
 *   sequelize,
 *   'lateral_movement_detection',
 *   { scope: 'windows_domain', sensitivity: 'high' }
 * );
 * ```
 */
const generateHuntPlaybook = async (sequelize, playbookTemplate, parameters) => {
    const playbookTemplates = {
        lateral_movement_detection: {
            name: 'Lateral Movement Detection',
            phases: ['credential_access', 'lateral_movement', 'persistence'],
            dataSources: ['windows_security', 'sysmon', 'network_traffic'],
            hypotheses: [
                'Attackers using stolen credentials for lateral movement',
                'Use of remote execution tools (PSExec, WMI)',
                'Unusual service creation patterns',
            ],
            queries: [
                'EventCode=4624 LogonType=3',
                'EventCode=4648',
                'process_name IN ("psexec.exe", "wmiprvse.exe")',
            ],
        },
    };
    const template = playbookTemplates[playbookTemplate];
    if (!template) {
        throw new Error('Playbook template not found');
    }
    return {
        templateName: playbookTemplate,
        generatedAt: new Date(),
        parameters,
        playbook: {
            ...template,
            customizations: parameters,
        },
    };
};
exports.generateHuntPlaybook = generateHuntPlaybook;
/**
 * 39. Schedules recurring hunt campaigns.
 *
 * @param {ModelCtor<Model>} ScheduleModel - Hunt schedule model
 * @param {string} playbookId - Playbook identifier
 * @param {string} cronExpression - Cron schedule
 * @param {Record<string, any>} config - Schedule configuration
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created schedule
 *
 * @example
 * ```typescript
 * const schedule = await scheduleRecurringHunt(
 *   HuntSchedule,
 *   'playbook-123',
 *   '0 0 * * 1', // Every Monday at midnight
 *   { autoStart: true, notifyOnCompletion: true }
 * );
 * ```
 */
const scheduleRecurringHunt = async (ScheduleModel, playbookId, cronExpression, config, transaction) => {
    return await ScheduleModel.create({
        playbookId,
        cronExpression,
        enabled: true,
        configuration: config,
        createdAt: new Date(),
    }, { transaction });
};
exports.scheduleRecurringHunt = scheduleRecurringHunt;
/**
 * 40. Performs automated triage of hunt discoveries.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {string} discoveryId - Discovery identifier
 * @returns {Promise<any>} Triage assessment
 *
 * @example
 * ```typescript
 * const triage = await automatedDiscoveryTriage(sequelize, 'discovery-123');
 * ```
 */
const automatedDiscoveryTriage = async (sequelize, discoveryId) => {
    const [results] = await sequelize.query(`
    WITH discovery AS (
      SELECT
        id,
        severity,
        confidence,
        discovery_type,
        affected_assets,
        mitre_techniques,
        discovered_at
      FROM threat_discoveries
      WHERE id = :discoveryId
    ),
    similar_discoveries AS (
      SELECT COUNT(*) as similar_count
      FROM threat_discoveries td, discovery d
      WHERE td.id != d.id
        AND td.mitre_techniques && d.mitre_techniques
        AND td.discovered_at >= CURRENT_DATE - INTERVAL '30 days'
    ),
    asset_criticality AS (
      SELECT AVG(criticality_score) as avg_criticality
      FROM assets a, discovery d
      WHERE a.id = ANY(d.affected_assets)
    )
    SELECT
      d.*,
      sd.similar_count,
      ac.avg_criticality,
      CASE
        WHEN d.severity = 'critical' AND d.confidence >= 80 THEN 'immediate_response'
        WHEN d.severity IN ('high', 'critical') AND ac.avg_criticality >= 80 THEN 'high_priority'
        WHEN sd.similar_count >= 5 THEN 'pattern_investigation'
        WHEN d.confidence < 50 THEN 'further_analysis'
        ELSE 'standard_workflow'
      END as triage_recommendation,
      CASE
        WHEN d.severity = 'critical' THEN 1
        WHEN d.severity = 'high' THEN 2
        WHEN d.severity = 'medium' THEN 3
        ELSE 4
      END as priority_score
    FROM discovery d
    CROSS JOIN similar_discoveries sd
    CROSS JOIN asset_criticality ac
  `, {
        replacements: { discoveryId },
        type: sequelize.QueryTypes.SELECT,
    });
    return results[0] || {};
};
exports.automatedDiscoveryTriage = automatedDiscoveryTriage;
// ============================================================================
// THREAT INTELLIGENCE INTEGRATION
// ============================================================================
/**
 * 41. Correlates hunt findings with threat intelligence feeds.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {string} discoveryId - Discovery identifier
 * @returns {Promise<any[]>} Intelligence correlations
 *
 * @example
 * ```typescript
 * const intel = await correlateWithThreatIntel(sequelize, 'discovery-123');
 * ```
 */
const correlateWithThreatIntel = async (sequelize, discoveryId) => {
    const [results] = await sequelize.query(`
    WITH discovery_iocs AS (
      SELECT
        unnest(indicators) as ioc_id
      FROM threat_discoveries
      WHERE id = :discoveryId
    )
    SELECT
      ti.id as intel_id,
      ti.threat_actor,
      ti.campaign_name,
      ti.malware_family,
      ti.confidence_score,
      ti.first_seen,
      ti.last_updated,
      array_agg(DISTINCT ioc.value) as matching_iocs,
      COUNT(DISTINCT ioc.id) as ioc_match_count
    FROM discovery_iocs di
    JOIN ioc_indicators ioc ON di.ioc_id = ioc.id
    JOIN threat_intel_reports ti ON ioc.intel_source_id = ti.id
    GROUP BY ti.id, ti.threat_actor, ti.campaign_name, ti.malware_family,
             ti.confidence_score, ti.first_seen, ti.last_updated
    ORDER BY ioc_match_count DESC, ti.confidence_score DESC
  `, {
        replacements: { discoveryId },
        type: sequelize.QueryTypes.SELECT,
    });
    return results;
};
exports.correlateWithThreatIntel = correlateWithThreatIntel;
/**
 * 42. Generates threat actor attribution analysis.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {string} campaignId - Campaign identifier
 * @returns {Promise<any[]>} Attribution analysis
 *
 * @example
 * ```typescript
 * const attribution = await generateThreatActorAttribution(
 *   sequelize,
 *   'campaign-123'
 * );
 * ```
 */
const generateThreatActorAttribution = async (sequelize, campaignId) => {
    const [results] = await sequelize.query(`
    WITH campaign_techniques AS (
      SELECT DISTINCT unnest(mitre_techniques) as technique
      FROM threat_discoveries
      WHERE campaign_id = :campaignId
    ),
    actor_matches AS (
      SELECT
        ta.name as threat_actor,
        ta.aliases,
        ta.motivation,
        ta.sophistication,
        COUNT(DISTINCT ct.technique) as matching_techniques,
        array_agg(DISTINCT ct.technique) as matched_ttps,
        (COUNT(DISTINCT ct.technique) * 100.0 / (
          SELECT COUNT(DISTINCT technique)
          FROM actor_ttps
          WHERE actor_id = ta.id
        )) as match_percentage
      FROM campaign_techniques ct
      JOIN actor_ttps att ON ct.technique = att.technique
      JOIN threat_actors ta ON att.actor_id = ta.id
      GROUP BY ta.id, ta.name, ta.aliases, ta.motivation, ta.sophistication
      HAVING COUNT(DISTINCT ct.technique) >= 3
    )
    SELECT
      threat_actor,
      aliases,
      motivation,
      sophistication,
      matching_techniques,
      matched_ttps,
      match_percentage,
      CASE
        WHEN match_percentage >= 70 THEN 'high_confidence'
        WHEN match_percentage >= 50 THEN 'medium_confidence'
        ELSE 'low_confidence'
      END as attribution_confidence
    FROM actor_matches
    ORDER BY match_percentage DESC
  `, {
        replacements: { campaignId },
        type: sequelize.QueryTypes.SELECT,
    });
    return results;
};
exports.generateThreatActorAttribution = generateThreatActorAttribution;
/**
 * 43. Tracks emerging threat patterns across campaigns.
 *
 * @param {ModelCtor<Model>} DiscoveryModel - Discovery model
 * @param {number} daysLookback - Period to analyze
 * @param {number} threshold - Minimum occurrences to flag
 * @returns {Promise<any[]>} Emerging patterns
 *
 * @example
 * ```typescript
 * const patterns = await identifyEmergingThreats(
 *   ThreatDiscovery,
 *   30,
 *   5
 * );
 * ```
 */
const identifyEmergingThreats = async (DiscoveryModel, daysLookback, threshold) => {
    const lookbackDate = new Date(Date.now() - daysLookback * 24 * 60 * 60 * 1000);
    return await DiscoveryModel.findAll({
        where: {
            discoveredAt: { [sequelize_1.Op.gte]: lookbackDate },
        },
        attributes: [
            [(0, sequelize_1.literal)("unnest(mitre_techniques)"), 'technique'],
            [(0, sequelize_1.fn)('COUNT', (0, sequelize_1.col)('id')), 'occurrenceCount'],
            [(0, sequelize_1.fn)('MIN', (0, sequelize_1.col)('discoveredAt')), 'firstSeen'],
            [(0, sequelize_1.fn)('MAX', (0, sequelize_1.col)('discoveredAt')), 'lastSeen'],
            [
                (0, sequelize_1.fn)('COUNT', (0, sequelize_1.literal)("CASE WHEN severity IN ('high', 'critical') THEN 1 END")),
                'highSeverityCount',
            ],
            [(0, sequelize_1.fn)('AVG', (0, sequelize_1.col)('confidence')), 'avgConfidence'],
            [
                (0, sequelize_1.literal)(`EXTRACT(DAYS FROM (MAX(discovered_at) - MIN(discovered_at)))`),
                'spreadDays',
            ],
        ],
        group: [(0, sequelize_1.literal)("unnest(mitre_techniques)")],
        having: (0, sequelize_1.literal)(`COUNT(id) >= ${threshold}`),
        order: [[(0, sequelize_1.fn)('COUNT', (0, sequelize_1.col)('id')), 'DESC']],
    });
};
exports.identifyEmergingThreats = identifyEmergingThreats;
/**
 * 44. Generates threat landscape summary report.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @returns {Promise<any>} Threat landscape overview
 *
 * @example
 * ```typescript
 * const landscape = await generateThreatLandscapeSummary(
 *   sequelize,
 *   new Date('2024-01-01'),
 *   new Date('2024-03-31')
 * );
 * ```
 */
const generateThreatLandscapeSummary = async (sequelize, startDate, endDate) => {
    const [results] = await sequelize.query(`
    WITH discovery_summary AS (
      SELECT
        COUNT(*) as total_discoveries,
        COUNT(DISTINCT campaign_id) as campaigns_with_findings,
        COUNT(CASE WHEN severity = 'critical' THEN 1 END) as critical_threats,
        COUNT(CASE WHEN escalated_to_incident = true THEN 1 END) as incidents_generated,
        COUNT(DISTINCT affected_assets::text) as systems_impacted
      FROM threat_discoveries
      WHERE discovered_at BETWEEN :startDate AND :endDate
    ),
    technique_distribution AS (
      SELECT
        COUNT(DISTINCT unnest(mitre_techniques)) as unique_techniques,
        COUNT(DISTINCT unnest(mitre_tactics)) as unique_tactics
      FROM threat_discoveries
      WHERE discovered_at BETWEEN :startDate AND :endDate
    ),
    top_threats AS (
      SELECT
        unnest(mitre_techniques) as technique,
        COUNT(*) as count
      FROM threat_discoveries
      WHERE discovered_at BETWEEN :startDate AND :endDate
      GROUP BY unnest(mitre_techniques)
      ORDER BY count DESC
      LIMIT 10
    )
    SELECT
      ds.*,
      td.*,
      json_agg(tt.*) as top_techniques
    FROM discovery_summary ds
    CROSS JOIN technique_distribution td
    CROSS JOIN top_threats tt
    GROUP BY ds.total_discoveries, ds.campaigns_with_findings, ds.critical_threats,
             ds.incidents_generated, ds.systems_impacted,
             td.unique_techniques, td.unique_tactics
  `, {
        replacements: { startDate, endDate },
        type: sequelize.QueryTypes.SELECT,
    });
    return results[0] || {};
};
exports.generateThreatLandscapeSummary = generateThreatLandscapeSummary;
/**
 * 45. Validates IOC freshness and updates staleness indicators.
 *
 * @param {ModelCtor<Model>} IOCModel - IOC model
 * @param {number} freshnessThresholdDays - Days to consider IOC fresh
 * @returns {Promise<any>} Freshness validation results
 *
 * @example
 * ```typescript
 * const validation = await validateIOCFreshness(IOCIndicator, 30);
 * ```
 */
const validateIOCFreshness = async (IOCModel, freshnessThresholdDays) => {
    const thresholdDate = new Date(Date.now() - freshnessThresholdDays * 24 * 60 * 60 * 1000);
    const summary = await IOCModel.findOne({
        attributes: [
            [(0, sequelize_1.fn)('COUNT', (0, sequelize_1.col)('id')), 'totalIOCs'],
            [
                (0, sequelize_1.fn)('COUNT', (0, sequelize_1.literal)(`CASE WHEN last_seen >= '${thresholdDate.toISOString()}' THEN 1 END`)),
                'freshIOCs',
            ],
            [
                (0, sequelize_1.fn)('COUNT', (0, sequelize_1.literal)(`CASE WHEN last_seen < '${thresholdDate.toISOString()}' THEN 1 END`)),
                'staleIOCs',
            ],
            [
                (0, sequelize_1.literal)(`ROUND(COUNT(CASE WHEN last_seen >= '${thresholdDate.toISOString()}' THEN 1 END) * 100.0 / NULLIF(COUNT(*), 0), 2)`),
                'freshnessPercentage',
            ],
        ],
        raw: true,
    });
    return {
        freshnessThresholdDays,
        thresholdDate,
        summary,
        validatedAt: new Date(),
    };
};
exports.validateIOCFreshness = validateIOCFreshness;
/**
 * 46. Generates hunt coverage gap analysis.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {string[]} expectedTactics - Expected MITRE tactics coverage
 * @param {Date} startDate - Analysis start date
 * @param {Date} endDate - Analysis end date
 * @returns {Promise<any>} Coverage gaps
 *
 * @example
 * ```typescript
 * const gaps = await analyzeHuntCoverageGaps(
 *   sequelize,
 *   ['TA0001', 'TA0002', 'TA0003', 'TA0004', 'TA0005'],
 *   new Date('2024-01-01'),
 *   new Date('2024-03-31')
 * );
 * ```
 */
const analyzeHuntCoverageGaps = async (sequelize, expectedTactics, startDate, endDate) => {
    const [results] = await sequelize.query(`
    WITH expected_coverage AS (
      SELECT unnest(ARRAY[:expectedTactics]) as tactic
    ),
    actual_coverage AS (
      SELECT DISTINCT unnest(mitre_tactics) as tactic
      FROM threat_discoveries
      WHERE discovered_at BETWEEN :startDate AND :endDate
    )
    SELECT
      ec.tactic,
      CASE
        WHEN ac.tactic IS NOT NULL THEN 'covered'
        ELSE 'gap'
      END as coverage_status,
      (
        SELECT COUNT(*)
        FROM threat_discoveries
        WHERE :startDate <= discovered_at
          AND discovered_at <= :endDate
          AND ec.tactic = ANY(mitre_tactics)
      ) as discovery_count
    FROM expected_coverage ec
    LEFT JOIN actual_coverage ac ON ec.tactic = ac.tactic
    ORDER BY coverage_status, ec.tactic
  `, {
        replacements: { expectedTactics, startDate, endDate },
        type: sequelize.QueryTypes.SELECT,
    });
    const gaps = results.filter((r) => r.coverage_status === 'gap');
    const covered = results.filter((r) => r.coverage_status === 'covered');
    return {
        period: { startDate, endDate },
        expectedTactics: expectedTactics.length,
        coveredTactics: covered.length,
        gapTactics: gaps.length,
        coveragePercentage: parseFloat(((covered.length / expectedTactics.length) * 100).toFixed(2)),
        gaps,
        covered,
    };
};
exports.analyzeHuntCoverageGaps = analyzeHuntCoverageGaps;
/**
 * 47. Identifies hunt efficiency optimization opportunities.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {string} campaignId - Campaign identifier
 * @returns {Promise<any>} Optimization recommendations
 *
 * @example
 * ```typescript
 * const optimizations = await identifyHuntOptimizations(sequelize, 'campaign-123');
 * ```
 */
const identifyHuntOptimizations = async (sequelize, campaignId) => {
    const [results] = await sequelize.query(`
    WITH query_efficiency AS (
      SELECT
        data_source,
        COUNT(*) as query_count,
        AVG(results_count) as avg_results,
        SUM(CASE WHEN results_count = 0 THEN 1 ELSE 0 END) as zero_result_queries,
        SUM(CASE WHEN results_count = 0 THEN 1 ELSE 0 END) * 100.0 / COUNT(*) as zero_result_rate
      FROM hunt_activities
      WHERE campaign_id = :campaignId
        AND activity_type = 'query'
      GROUP BY data_source
    ),
    discovery_yield AS (
      SELECT
        COUNT(*) as total_discoveries,
        (
          SELECT COUNT(*)
          FROM hunt_activities
          WHERE campaign_id = :campaignId
            AND activity_type = 'query'
        ) as total_queries,
        COUNT(*) * 1.0 / NULLIF((
          SELECT COUNT(*)
          FROM hunt_activities
          WHERE campaign_id = :campaignId
            AND activity_type = 'query'
        ), 0) as discoveries_per_query
      FROM threat_discoveries
      WHERE campaign_id = :campaignId
    )
    SELECT
      qe.*,
      dy.total_discoveries,
      dy.discoveries_per_query,
      CASE
        WHEN qe.zero_result_rate >= 50 THEN 'high_inefficiency'
        WHEN qe.zero_result_rate >= 30 THEN 'moderate_inefficiency'
        ELSE 'acceptable'
      END as efficiency_rating,
      CASE
        WHEN qe.zero_result_rate >= 50 THEN 'Review and refine queries for ' || qe.data_source
        WHEN qe.avg_results > 10000 THEN 'Add filters to reduce result volume for ' || qe.data_source
        WHEN dy.discoveries_per_query < 0.1 THEN 'Low discovery yield - consider alternative approaches'
        ELSE 'Performance acceptable'
      END as recommendation
    FROM query_efficiency qe
    CROSS JOIN discovery_yield dy
  `, {
        replacements: { campaignId },
        type: sequelize.QueryTypes.SELECT,
    });
    return {
        campaignId,
        analyzedAt: new Date(),
        optimizations: results,
    };
};
exports.identifyHuntOptimizations = identifyHuntOptimizations;
/**
 * 48. Generates comprehensive hunt after-action report.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {string} campaignId - Campaign identifier
 * @returns {Promise<any>} After-action report
 *
 * @example
 * ```typescript
 * const aar = await generateHuntAfterActionReport(sequelize, 'campaign-123');
 * ```
 */
const generateHuntAfterActionReport = async (sequelize, campaignId) => {
    const [results] = await sequelize.query(`
    WITH campaign_overview AS (
      SELECT
        id,
        name,
        description,
        hypothesis,
        hunt_type,
        priority,
        start_date,
        end_date,
        status,
        team_members,
        EXTRACT(EPOCH FROM (COALESCE(end_date, CURRENT_TIMESTAMP) - start_date)) / 3600 as duration_hours
      FROM hunt_campaigns
      WHERE id = :campaignId
    ),
    execution_metrics AS (
      SELECT
        COUNT(DISTINCT hunter_id) as hunters_participated,
        COUNT(*) as total_activities,
        COUNT(DISTINCT data_source) as data_sources_used,
        COUNT(CASE WHEN activity_type = 'query' THEN 1 END) as queries_executed,
        SUM(results_count) as total_results_analyzed
      FROM hunt_activities
      WHERE campaign_id = :campaignId
    ),
    findings_summary AS (
      SELECT
        COUNT(*) as total_discoveries,
        COUNT(CASE WHEN severity = 'critical' THEN 1 END) as critical_findings,
        COUNT(CASE WHEN severity = 'high' THEN 1 END) as high_findings,
        COUNT(CASE WHEN severity = 'medium' THEN 1 END) as medium_findings,
        COUNT(CASE WHEN escalated_to_incident = true THEN 1 END) as incidents_created,
        AVG(confidence) as avg_confidence,
        array_agg(DISTINCT mitre_tactics) as tactics_observed,
        COUNT(DISTINCT affected_assets::text) as systems_impacted
      FROM threat_discoveries
      WHERE campaign_id = :campaignId
    ),
    hypothesis_outcomes AS (
      SELECT
        COUNT(*) as total_hypotheses,
        COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed,
        COUNT(CASE WHEN status = 'refuted' THEN 1 END) as refuted,
        COUNT(CASE WHEN status = 'inconclusive' THEN 1 END) as inconclusive
      FROM hunt_hypotheses
      WHERE campaign_id = :campaignId
    ),
    lessons_learned AS (
      SELECT
        CASE
          WHEN (SELECT COUNT(*) FROM threat_discoveries WHERE campaign_id = :campaignId) = 0
          THEN 'No discoveries made - consider revising hypothesis or expanding scope'
          WHEN (SELECT AVG(confidence) FROM threat_discoveries WHERE campaign_id = :campaignId) < 60
          THEN 'Low average confidence - additional validation recommended'
          ELSE 'Campaign objectives achieved'
        END as primary_lesson,
        CASE
          WHEN (
            SELECT COUNT(*)
            FROM hunt_activities
            WHERE campaign_id = :campaignId
              AND activity_type = 'query'
              AND results_count = 0
          ) * 100.0 / NULLIF((
            SELECT COUNT(*)
            FROM hunt_activities
            WHERE campaign_id = :campaignId
              AND activity_type = 'query'
          ), 0) >= 40
          THEN 'High percentage of zero-result queries - query optimization needed'
          ELSE 'Query efficiency acceptable'
        END as efficiency_lesson
    )
    SELECT
      co.*,
      em.*,
      fs.*,
      ho.*,
      ll.*
    FROM campaign_overview co
    CROSS JOIN execution_metrics em
    CROSS JOIN findings_summary fs
    CROSS JOIN hypothesis_outcomes ho
    CROSS JOIN lessons_learned ll
  `, {
        replacements: { campaignId },
        type: sequelize.QueryTypes.SELECT,
    });
    return {
        campaignId,
        reportGeneratedAt: new Date(),
        reportType: 'After-Action Report',
        ...results[0],
    };
};
exports.generateHuntAfterActionReport = generateHuntAfterActionReport;
//# sourceMappingURL=threat-hunting-operations-kit.js.map