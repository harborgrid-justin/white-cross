/**
 * LOC: THREAT-METRIC-001
 * File: /reuse/threat/security-metrics-kpi-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - NestJS threat management services
 *   - Security metrics controllers
 *   - KPI dashboard services
 *   - Compliance reporting modules
 *   - Incident response services
 */
interface SecurityKPI {
    kpiId: string;
    kpiName: string;
    category: 'vulnerability' | 'compliance' | 'incident' | 'access' | 'detection' | 'response';
    value: number;
    target: number;
    unit: string;
    trend: 'improving' | 'stable' | 'degrading';
    measurementPeriod: {
        start: Date;
        end: Date;
    };
    status: 'on_target' | 'at_risk' | 'off_target';
    metadata?: Record<string, any>;
}
interface ThreatScore {
    scoreId: string;
    assetId?: string;
    organizationId?: string;
    scoreType: 'asset' | 'system' | 'organization';
    exposureScore: number;
    vulnerabilityScore: number;
    threatIntelligenceScore: number;
    complianceScore: number;
    aggregatedScore: number;
    riskLevel: 'critical' | 'high' | 'medium' | 'low';
    calculatedAt: Date;
    factors: Array<{
        factor: string;
        weight: number;
        score: number;
    }>;
}
interface SecurityPosture {
    postureId: string;
    organizationId: string;
    assessmentDate: Date;
    overallScore: number;
    maturityLevel: 'initial' | 'developing' | 'defined' | 'managed' | 'optimizing';
    domains: Array<{
        domain: string;
        score: number;
        maturity: string;
        gaps: string[];
        recommendations: string[];
    }>;
    strengths: string[];
    weaknesses: string[];
    improvementPlan: string[];
}
interface ComplianceStatus {
    complianceId: string;
    framework: 'hipaa' | 'pci_dss' | 'sox' | 'gdpr' | 'nist' | 'iso27001';
    overallCompliance: number;
    controlCategories: Array<{
        category: string;
        totalControls: number;
        compliantControls: number;
        partiallyCompliant: number;
        nonCompliant: number;
        notApplicable: number;
        complianceRate: number;
    }>;
    findings: Array<{
        controlId: string;
        severity: 'critical' | 'high' | 'medium' | 'low';
        status: 'compliant' | 'non_compliant' | 'partial';
        description: string;
        remediation: string;
    }>;
    lastAssessment: Date;
    nextReview: Date;
}
interface MetricDashboardData {
    dashboardId: string;
    generatedAt: Date;
    timeRange: {
        start: Date;
        end: Date;
    };
    summary: {
        totalIncidents: number;
        criticalIncidents: number;
        avgMTTD: number;
        avgMTTR: number;
        complianceRate: number;
        threatScore: number;
    };
    charts: Array<{
        chartId: string;
        chartType: 'line' | 'bar' | 'pie' | 'gauge' | 'heatmap';
        title: string;
        data: any[];
        metadata?: Record<string, any>;
    }>;
    alerts: Array<{
        severity: 'critical' | 'high' | 'medium' | 'low';
        message: string;
        timestamp: Date;
    }>;
}
interface VulnerabilityMetrics {
    totalVulnerabilities: number;
    criticalVulns: number;
    highVulns: number;
    mediumVulns: number;
    lowVulns: number;
    averageAge: number;
    patchCompliance: number;
    remediationRate: number;
    newVulnsDetected: number;
    vulnsRemediated: number;
}
interface ControlEffectiveness {
    controlId: string;
    controlName: string;
    controlType: 'preventive' | 'detective' | 'corrective' | 'compensating';
    effectivenessScore: number;
    incidentsBlocked: number;
    incidentsPrevented: number;
    falsePositives: number;
    falseNegatives: number;
    lastTested: Date;
    testResults: 'effective' | 'partially_effective' | 'ineffective';
}
/**
 * Calculate comprehensive security KPIs
 * @param config - KPI calculation configuration
 * @returns Calculated KPIs with trends and status
 *
 * @example
 * ```typescript
 * const kpis = await calculateSecurityKPIs({
 *   organizationId: 'ORG-123',
 *   period: { start: new Date('2025-01-01'), end: new Date('2025-01-31') },
 *   categories: ['vulnerability', 'compliance', 'incident']
 * });
 * // Returns: { kpis: [...], summary: {...}, trends: {...} }
 * ```
 *
 * @swagger
 * /api/security-metrics/kpis/calculate:
 *   post:
 *     summary: Calculate comprehensive security KPIs
 *     tags: [Security KPIs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               organizationId:
 *                 type: string
 *               period:
 *                 type: object
 *                 properties:
 *                   start:
 *                     type: string
 *                     format: date-time
 *                   end:
 *                     type: string
 *                     format: date-time
 *     responses:
 *       200:
 *         description: KPIs calculated successfully
 */
export declare function calculateSecurityKPIs(config: {
    organizationId: string;
    period: {
        start: Date;
        end: Date;
    };
    categories?: ('vulnerability' | 'compliance' | 'incident' | 'access' | 'detection' | 'response')[];
    includeTargets?: boolean;
}): Promise<{
    kpis: SecurityKPI[];
    summary: {
        totalKPIs: number;
        onTarget: number;
        atRisk: number;
        offTarget: number;
    };
    trends: Record<string, 'improving' | 'stable' | 'degrading'>;
}>;
/**
 * Compute vulnerability-specific metrics
 */
export declare function computeVulnerabilityMetrics(config: {
    organizationId: string;
    period: {
        start: Date;
        end: Date;
    };
    includeTrends?: boolean;
}): Promise<{
    metrics: VulnerabilityMetrics;
    trends?: {
        period: string;
        values: VulnerabilityMetrics;
    }[];
    severityDistribution: Record<string, number>;
}>;
/**
 * Measure patch compliance across systems
 */
export declare function measurePatchCompliance(config: {
    organizationId: string;
    assetTypes?: string[];
    criticalityLevels?: string[];
}): Promise<{
    overallCompliance: number;
    byAssetType: Record<string, number>;
    byCriticality: Record<string, number>;
    outdatedSystems: Array<{
        assetId: string;
        assetType: string;
        criticality: string;
        patchesNeeded: number;
        daysSinceLastPatch: number;
    }>;
    complianceRate: number;
}>;
/**
 * Track incident trends over time
 */
export declare function trackIncidentTrends(config: {
    organizationId: string;
    period: {
        start: Date;
        end: Date;
    };
    granularity: 'daily' | 'weekly' | 'monthly';
    incidentTypes?: string[];
}): Promise<{
    trends: Array<{
        period: string;
        totalIncidents: number;
        bySeverity: Record<string, number>;
        byType: Record<string, number>;
        resolved: number;
        avgResolutionTime: number;
    }>;
    summary: {
        totalPeriods: number;
        averageIncidentsPerPeriod: number;
        trendDirection: 'increasing' | 'stable' | 'decreasing';
    };
}>;
/**
 * Calculate overall risk score
 */
export declare function calculateRiskScore(config: {
    assetId?: string;
    organizationId?: string;
    includeFactors?: boolean;
}): Promise<{
    riskScore: number;
    riskLevel: 'critical' | 'high' | 'medium' | 'low';
    factors: Array<{
        factor: string;
        weight: number;
        score: number;
        contribution: number;
    }>;
    recommendations: string[];
}>;
/**
 * Assess effectiveness of security controls
 */
export declare function assessControlEffectiveness(config: {
    organizationId: string;
    controlTypes?: ('preventive' | 'detective' | 'corrective' | 'compensating')[];
    period: {
        start: Date;
        end: Date;
    };
}): Promise<{
    controls: ControlEffectiveness[];
    summary: {
        totalControls: number;
        effectiveControls: number;
        avgEffectiveness: number;
    };
    byType: Record<string, number>;
}>;
/**
 * Benchmark security posture against industry standards
 */
export declare function benchmarkSecurityPosture(config: {
    organizationId: string;
    industry?: string;
    companySize?: 'small' | 'medium' | 'large' | 'enterprise';
    frameworks?: string[];
}): Promise<{
    organizationScore: number;
    industryAverage: number;
    percentile: number;
    comparison: {
        metric: string;
        organizationValue: number;
        industryAverage: number;
        variance: number;
    }[];
    strengths: string[];
    improvementAreas: string[];
}>;
/**
 * Generate comprehensive KPI report
 */
export declare function generateKPIReport(config: {
    organizationId: string;
    period: {
        start: Date;
        end: Date;
    };
    format?: 'json' | 'pdf' | 'html' | 'excel';
    includeCharts?: boolean;
}): Promise<{
    reportId: string;
    generatedAt: Date;
    summary: {
        totalKPIs: number;
        kpisOnTarget: number;
        criticalAlerts: number;
        overallHealth: number;
    };
    sections: Array<{
        sectionName: string;
        kpis: SecurityKPI[];
        analysis: string;
    }>;
    recommendations: string[];
    nextSteps: string[];
}>;
/**
 * Generate comprehensive dashboard metrics
 */
export declare function generateDashboardMetrics(config: {
    organizationId: string;
    timeRange: {
        start: Date;
        end: Date;
    };
    dashboardType: 'executive' | 'operational' | 'technical';
}): Promise<MetricDashboardData>;
/**
 * Aggregate security data from multiple sources
 */
export declare function aggregateSecurityData(config: {
    organizationId: string;
    dataSources: ('vulnerability_scanner' | 'siem' | 'firewall' | 'ids' | 'endpoint_protection')[];
    period: {
        start: Date;
        end: Date;
    };
    aggregationLevel: 'raw' | 'summary' | 'detailed';
}): Promise<{
    aggregatedData: {
        source: string;
        recordCount: number;
        summary: Record<string, any>;
        lastUpdated: Date;
    }[];
    totalRecords: number;
    coverage: number;
}>;
/**
 * Compute trend analysis for metrics
 */
export declare function computeTrendAnalysis(config: {
    metricName: string;
    data: Array<{
        timestamp: Date;
        value: number;
    }>;
    analysisType: 'linear' | 'exponential' | 'moving_average';
    forecastPeriods?: number;
}): Promise<{
    trend: 'increasing' | 'decreasing' | 'stable';
    slope: number;
    confidence: number;
    forecast?: Array<{
        period: string;
        predictedValue: number;
        confidence: number;
    }>;
    anomalies: Array<{
        timestamp: Date;
        value: number;
        expectedValue: number;
        deviation: number;
    }>;
}>;
/**
 * Prepare data for visualization
 */
export declare function prepareVisualizationData(config: {
    dataType: 'incidents' | 'vulnerabilities' | 'compliance' | 'threats';
    chartType: 'line' | 'bar' | 'pie' | 'heatmap' | 'gauge';
    period: {
        start: Date;
        end: Date;
    };
    groupBy?: 'day' | 'week' | 'month' | 'severity' | 'type';
}): Promise<{
    chartData: any[];
    chartOptions: Record<string, any>;
    metadata: {
        totalDataPoints: number;
        dateRange: {
            start: Date;
            end: Date;
        };
        aggregationMethod: string;
    };
}>;
/**
 * Calculate statistical percentiles
 */
export declare function calculatePercentiles(config: {
    data: number[];
    percentiles: number[];
}): Promise<{
    percentiles: Array<{
        percentile: number;
        value: number;
    }>;
    statistics: {
        min: number;
        max: number;
        mean: number;
        median: number;
        stdDev: number;
    };
}>;
/**
 * Format metrics data for UI display
 */
export declare function formatMetricsForUI(config: {
    metrics: SecurityKPI[];
    format: 'card' | 'table' | 'chart';
    includeSparklines?: boolean;
}): Promise<{
    formattedData: Array<{
        id: string;
        displayName: string;
        value: string;
        status: string;
        trend: string;
        sparkline?: number[];
    }>;
    layout: Record<string, any>;
}>;
/**
 * Export dashboard data in various formats
 */
export declare function exportDashboardData(config: {
    dashboardId: string;
    format: 'json' | 'csv' | 'excel' | 'pdf';
    includeCharts?: boolean;
}): Promise<{
    exportId: string;
    data: string | Buffer;
    format: string;
    size: number;
    generatedAt: Date;
}>;
/**
 * Calculate comprehensive threat exposure score
 */
export declare function calculateThreatExposure(config: {
    organizationId: string;
    assetId?: string;
    includeExternalThreats?: boolean;
    includeInternalThreats?: boolean;
}): Promise<ThreatScore>;
/**
 * Score critical assets based on threat exposure
 */
export declare function scoreCriticalAssets(config: {
    assets: Array<{
        assetId: string;
        criticality: string;
    }>;
    threatData?: Record<string, any>;
}): Promise<{
    scoredAssets: Array<{
        assetId: string;
        criticality: string;
        threatScore: number;
        exposureLevel: 'critical' | 'high' | 'medium' | 'low';
        vulnerabilities: number;
        threats: string[];
    }>;
    highestRisk: string[];
}>;
/**
 * Assess impact of vulnerabilities on threat exposure
 */
export declare function assessVulnerabilityImpact(config: {
    vulnerabilities: Array<{
        cveId: string;
        cvssScore: number;
        exploitAvailable: boolean;
        affectedAssets: string[];
    }>;
    assetCriticality?: Record<string, string>;
}): Promise<{
    impactAssessment: Array<{
        cveId: string;
        impactScore: number;
        affectedCriticalAssets: number;
        estimatedExposure: number;
        priorityLevel: 'critical' | 'high' | 'medium' | 'low';
    }>;
    totalImpact: number;
}>;
/**
 * Compute likelihood of exploit
 */
export declare function computeExploitLikelihood(config: {
    vulnerability: {
        cvssScore: number;
        exploitAvailable: boolean;
        exploitMaturity?: 'unproven' | 'proof_of_concept' | 'functional' | 'high';
    };
    assetExposure: 'internet' | 'internal' | 'isolated';
    securityControls: string[];
}): Promise<{
    likelihood: 'very_high' | 'high' | 'medium' | 'low' | 'very_low';
    likelihoodScore: number;
    factors: Array<{
        factor: string;
        contribution: number;
        description: string;
    }>;
}>;
/**
 * Prioritize threats based on exposure and impact
 */
export declare function prioritizeThreats(config: {
    threats: Array<{
        threatId: string;
        threatType: string;
        exposureScore: number;
        impactScore: number;
    }>;
    prioritizationCriteria?: 'exposure' | 'impact' | 'combined';
}): Promise<{
    prioritizedThreats: Array<{
        threatId: string;
        threatType: string;
        priority: number;
        priorityLevel: 'critical' | 'high' | 'medium' | 'low';
        score: number;
    }>;
    topThreats: string[];
}>;
/**
 * Generate threat exposure matrix
 */
export declare function generateExposureMatrix(config: {
    organizationId: string;
    dimensions?: ('likelihood' | 'impact' | 'detectability' | 'recoverability')[];
}): Promise<{
    matrix: Array<{
        likelihood: string;
        impact: string;
        riskLevel: 'critical' | 'high' | 'medium' | 'low';
        threatCount: number;
        examples: string[];
    }>;
    heatmap: number[][];
}>;
/**
 * Track threat exposure trends over time
 */
export declare function trackExposureTrends(config: {
    organizationId: string;
    period: {
        start: Date;
        end: Date;
    };
    granularity: 'daily' | 'weekly' | 'monthly';
}): Promise<{
    trends: Array<{
        period: string;
        exposureScore: number;
        vulnerabilityCount: number;
        threatsDetected: number;
        incidentsOccurred: number;
    }>;
    analysis: {
        trendDirection: 'improving' | 'stable' | 'degrading';
        averageExposure: number;
        projectedExposure: number;
    };
}>;
/**
 * Assess comprehensive security posture
 */
export declare function assessSecurityPosture(config: {
    organizationId: string;
    frameworks?: ('nist_csf' | 'cis' | 'iso27001' | 'nist_800_53')[];
    includeMaturityAssessment?: boolean;
}): Promise<SecurityPosture>;
/**
 * Evaluate control maturity levels
 */
export declare function evaluateControlMaturity(config: {
    controls: Array<{
        controlId: string;
        controlName: string;
        category: string;
    }>;
    assessmentCriteria?: string[];
}): Promise<{
    maturityAssessment: Array<{
        controlId: string;
        controlName: string;
        maturityLevel: 'initial' | 'developing' | 'defined' | 'managed' | 'optimizing';
        score: number;
        strengths: string[];
        gaps: string[];
    }>;
    overallMaturity: string;
    distribution: Record<string, number>;
}>;
/**
 * Score against security frameworks
 */
export declare function scoreSecurityFramework(config: {
    framework: 'nist_csf' | 'cis' | 'iso27001' | 'nist_800_53' | 'pci_dss';
    organizationId: string;
}): Promise<{
    frameworkScore: number;
    categoryScores: Array<{
        category: string;
        score: number;
        maxScore: number;
        compliance: number;
    }>;
    gaps: Array<{
        category: string;
        controlId: string;
        gap: string;
        priority: 'critical' | 'high' | 'medium' | 'low';
    }>;
    recommendations: string[];
}>;
/**
 * Benchmark against industry standards
 */
export declare function benchmarkIndustryStandards(config: {
    organizationId: string;
    industry: string;
    companySize: 'small' | 'medium' | 'large' | 'enterprise';
    metrics: string[];
}): Promise<{
    benchmarks: Array<{
        metric: string;
        organizationValue: number;
        industryAverage: number;
        industryMedian: number;
        percentileRank: number;
        gap: number;
    }>;
    overallRanking: number;
    strengths: string[];
    improvements: string[];
}>;
/**
 * Identify security posture gaps
 */
export declare function identifyPostureGaps(config: {
    currentPosture: SecurityPosture;
    targetPosture?: Partial<SecurityPosture>;
    prioritize?: boolean;
}): Promise<{
    gaps: Array<{
        gapId: string;
        domain: string;
        currentScore: number;
        targetScore: number;
        gapSize: number;
        priority: 'critical' | 'high' | 'medium' | 'low';
        estimatedEffort: 'low' | 'medium' | 'high';
        recommendations: string[];
    }>;
    criticalGaps: number;
    totalGapScore: number;
}>;
/**
 * Generate security posture report
 */
export declare function generatePostureReport(config: {
    posture: SecurityPosture;
    format?: 'json' | 'pdf' | 'html';
    includeExecutiveSummary?: boolean;
}): Promise<{
    reportId: string;
    executiveSummary?: {
        overallScore: number;
        maturityLevel: string;
        keyFindings: string[];
        recommendations: string[];
    };
    detailedAssessment: {
        domains: SecurityPosture['domains'];
        strengths: string[];
        weaknesses: string[];
    };
    actionPlan: {
        immediate: string[];
        shortTerm: string[];
        longTerm: string[];
    };
    generatedAt: Date;
}>;
/**
 * Track compliance rates across frameworks
 */
export declare function trackComplianceRates(config: {
    organizationId: string;
    frameworks: ('hipaa' | 'pci_dss' | 'sox' | 'gdpr' | 'nist' | 'iso27001')[];
    period: {
        start: Date;
        end: Date;
    };
}): Promise<{
    complianceRates: Array<{
        framework: string;
        overallRate: number;
        trend: 'improving' | 'stable' | 'declining';
        lastAssessment: Date;
    }>;
    averageCompliance: number;
    lowestCompliance: string;
}>;
/**
 * Calculate control coverage percentage
 */
export declare function calculateControlCoverage(config: {
    framework: string;
    implementedControls: string[];
    requiredControls: string[];
}): Promise<{
    coverage: number;
    implementedCount: number;
    requiredCount: number;
    missingControls: string[];
    partialControls: string[];
    complianceGap: number;
}>;
/**
 * Monitor policy adherence
 */
export declare function monitorPolicyAdherence(config: {
    organizationId: string;
    policies: string[];
    period: {
        start: Date;
        end: Date;
    };
}): Promise<{
    adherenceMetrics: Array<{
        policy: string;
        adherenceRate: number;
        violations: number;
        exceptions: number;
        trend: 'improving' | 'stable' | 'declining';
    }>;
    overallAdherence: number;
    topViolations: string[];
}>;
/**
 * Assess regulatory compliance status
 */
export declare function assessRegulatoryCompliance(config: {
    organizationId: string;
    regulations: string[];
    includeFindings?: boolean;
}): Promise<{
    complianceStatus: ComplianceStatus[];
    overallCompliance: number;
    criticalFindings: number;
    nextAuditDate: Date;
}>;
/**
 * Generate compliance scorecard
 */
export declare function generateComplianceScorecard(config: {
    organizationId: string;
    frameworks: string[];
    period: {
        start: Date;
        end: Date;
    };
}): Promise<{
    scorecardId: string;
    overallScore: number;
    frameworkScores: Record<string, number>;
    categoryBreakdown: Array<{
        category: string;
        score: number;
        status: 'compliant' | 'non_compliant' | 'partial';
    }>;
    trends: Array<{
        period: string;
        score: number;
    }>;
    recommendations: string[];
    generatedAt: Date;
}>;
/**
 * Alert on compliance deviations
 */
export declare function alertComplianceDeviations(config: {
    organizationId: string;
    thresholds?: {
        complianceRate?: number;
        criticalFindings?: number;
    };
    notificationChannels?: ('email' | 'slack' | 'sms')[];
}): Promise<{
    alerts: Array<{
        alertId: string;
        severity: 'critical' | 'high' | 'medium' | 'low';
        framework: string;
        deviation: string;
        currentValue: number;
        threshold: number;
        timestamp: Date;
    }>;
    totalAlerts: number;
    criticalAlerts: number;
}>;
/**
 * Calculate Mean Time To Detect (MTTD)
 */
export declare function calculateMTTD(config: {
    incidents: Array<{
        incidentId: string;
        occurredAt: Date;
        detectedAt: Date;
    }>;
    period?: {
        start: Date;
        end: Date;
    };
}): Promise<{
    mttd: number;
    unit: 'minutes';
    incidentCount: number;
    fastest: number;
    slowest: number;
    median: number;
    trend: 'improving' | 'stable' | 'degrading';
}>;
/**
 * Calculate Mean Time To Respond (MTTR)
 */
export declare function calculateMTTR(config: {
    incidents: Array<{
        incidentId: string;
        detectedAt: Date;
        resolvedAt?: Date;
    }>;
    period?: {
        start: Date;
        end: Date;
    };
}): Promise<{
    mttr: number;
    unit: 'minutes';
    incidentCount: number;
    fastest: number;
    slowest: number;
    median: number;
    unresolvedCount: number;
    trend: 'improving' | 'stable' | 'degrading';
}>;
/**
 * Measure incident response efficiency
 */
export declare function measureResponseEfficiency(config: {
    incidents: Array<{
        incidentId: string;
        severity: 'critical' | 'high' | 'medium' | 'low';
        detectedAt: Date;
        containedAt?: Date;
        resolvedAt?: Date;
    }>;
    slaTargets?: Record<string, number>;
}): Promise<{
    efficiency: {
        overall: number;
        bySeverity: Record<string, number>;
    };
    slaCompliance: number;
    metricsBreakdown: {
        avgContainmentTime: number;
        avgResolutionTime: number;
        withinSLA: number;
        exceededSLA: number;
    };
}>;
/**
 * Track incident volume over time
 */
export declare function trackIncidentVolume(config: {
    organizationId: string;
    period: {
        start: Date;
        end: Date;
    };
    granularity: 'hourly' | 'daily' | 'weekly' | 'monthly';
    groupBy?: 'severity' | 'type' | 'source';
}): Promise<{
    volumeData: Array<{
        period: string;
        totalIncidents: number;
        breakdown: Record<string, number>;
    }>;
    trends: {
        direction: 'increasing' | 'stable' | 'decreasing';
        changeRate: number;
    };
    peakPeriods: string[];
}>;
/**
 * Analyze incident response times by category
 */
export declare function analyzeResponseTimes(config: {
    incidents: Array<{
        incidentId: string;
        category: string;
        severity: string;
        detectedAt: Date;
        resolvedAt?: Date;
    }>;
    categories?: string[];
}): Promise<{
    byCategory: Array<{
        category: string;
        avgResponseTime: number;
        minResponseTime: number;
        maxResponseTime: number;
        incidentCount: number;
    }>;
    bySeverity: Array<{
        severity: string;
        avgResponseTime: number;
        incidentCount: number;
    }>;
    insights: string[];
}>;
/**
 * Generate comprehensive incident response metrics report
 */
export declare function generateIRMetrics(config: {
    organizationId: string;
    period: {
        start: Date;
        end: Date;
    };
    includeComparison?: boolean;
}): Promise<{
    reportId: string;
    summary: {
        totalIncidents: number;
        avgMTTD: number;
        avgMTTR: number;
        slaCompliance: number;
        efficiency: number;
    };
    trends: {
        incidentVolume: 'increasing' | 'stable' | 'decreasing';
        detectionTime: 'improving' | 'stable' | 'degrading';
        responseTime: 'improving' | 'stable' | 'degrading';
    };
    benchmarks?: {
        metric: string;
        currentValue: number;
        industryAverage: number;
        variance: number;
    }[];
    recommendations: string[];
    generatedAt: Date;
}>;
/**
 * Sequelize model for Security Metrics
 */
export declare const SecurityMetricModel: {
    tableName: string;
    schema: {
        id: {
            type: string;
            primaryKey: boolean;
            autoIncrement: boolean;
        };
        metricId: {
            type: string;
            unique: boolean;
            allowNull: boolean;
        };
        organizationId: {
            type: string;
            allowNull: boolean;
        };
        metricName: {
            type: string;
            allowNull: boolean;
        };
        metricType: {
            type: string;
        };
        value: {
            type: string;
        };
        unit: {
            type: string;
        };
        target: {
            type: string;
        };
        status: {
            type: string;
            values: string[];
        };
        trend: {
            type: string;
            values: string[];
        };
        measurementPeriod: {
            type: string;
        };
        metadata: {
            type: string;
        };
        createdAt: {
            type: string;
            defaultValue: string;
        };
        updatedAt: {
            type: string;
            defaultValue: string;
        };
    };
    indexes: ({
        fields: string[];
        unique: boolean;
    } | {
        fields: string[];
        unique?: undefined;
    })[];
};
/**
 * Sequelize model for KPI Targets
 */
export declare const KPITargetModel: {
    tableName: string;
    schema: {
        id: {
            type: string;
            primaryKey: boolean;
            autoIncrement: boolean;
        };
        targetId: {
            type: string;
            unique: boolean;
            allowNull: boolean;
        };
        kpiName: {
            type: string;
            allowNull: boolean;
        };
        targetValue: {
            type: string;
        };
        thresholds: {
            type: string;
        };
        evaluationPeriod: {
            type: string;
            values: string[];
        };
        owner: {
            type: string;
        };
        validFrom: {
            type: string;
        };
        validTo: {
            type: string;
        };
        createdAt: {
            type: string;
            defaultValue: string;
        };
        updatedAt: {
            type: string;
            defaultValue: string;
        };
    };
    indexes: ({
        fields: string[];
        unique: boolean;
    } | {
        fields: string[];
        unique?: undefined;
    })[];
};
/**
 * Sequelize model for Threat Scores
 */
export declare const ThreatScoreModel: {
    tableName: string;
    schema: {
        id: {
            type: string;
            primaryKey: boolean;
            autoIncrement: boolean;
        };
        scoreId: {
            type: string;
            unique: boolean;
            allowNull: boolean;
        };
        assetId: {
            type: string;
        };
        organizationId: {
            type: string;
        };
        scoreType: {
            type: string;
            values: string[];
        };
        exposureScore: {
            type: string;
        };
        vulnerabilityScore: {
            type: string;
        };
        threatIntelligenceScore: {
            type: string;
        };
        complianceScore: {
            type: string;
        };
        aggregatedScore: {
            type: string;
        };
        riskLevel: {
            type: string;
            values: string[];
        };
        factors: {
            type: string;
        };
        calculatedAt: {
            type: string;
        };
        createdAt: {
            type: string;
            defaultValue: string;
        };
        updatedAt: {
            type: string;
            defaultValue: string;
        };
    };
    indexes: ({
        fields: string[];
        unique: boolean;
    } | {
        fields: string[];
        unique?: undefined;
    })[];
};
/**
 * Sequelize model for Compliance Status
 */
export declare const ComplianceStatusModel: {
    tableName: string;
    schema: {
        id: {
            type: string;
            primaryKey: boolean;
            autoIncrement: boolean;
        };
        complianceId: {
            type: string;
            unique: boolean;
            allowNull: boolean;
        };
        organizationId: {
            type: string;
            allowNull: boolean;
        };
        framework: {
            type: string;
            values: string[];
        };
        overallCompliance: {
            type: string;
        };
        controlCategories: {
            type: string;
        };
        findings: {
            type: string;
        };
        lastAssessment: {
            type: string;
        };
        nextReview: {
            type: string;
        };
        createdAt: {
            type: string;
            defaultValue: string;
        };
        updatedAt: {
            type: string;
            defaultValue: string;
        };
    };
    indexes: ({
        fields: string[];
        unique: boolean;
    } | {
        fields: string[];
        unique?: undefined;
    })[];
};
/**
 * Sequelize model for Incident Metrics
 */
export declare const IncidentMetricModel: {
    tableName: string;
    schema: {
        id: {
            type: string;
            primaryKey: boolean;
            autoIncrement: boolean;
        };
        metricId: {
            type: string;
            unique: boolean;
            allowNull: boolean;
        };
        incidentId: {
            type: string;
        };
        organizationId: {
            type: string;
            allowNull: boolean;
        };
        metricType: {
            type: string;
            values: string[];
        };
        value: {
            type: string;
        };
        unit: {
            type: string;
            values: string[];
        };
        measurementPeriod: {
            type: string;
        };
        benchmark: {
            type: string;
        };
        trend: {
            type: string;
            values: string[];
        };
        createdAt: {
            type: string;
            defaultValue: string;
        };
        updatedAt: {
            type: string;
            defaultValue: string;
        };
    };
    indexes: ({
        fields: string[];
        unique: boolean;
    } | {
        fields: string[];
        unique?: undefined;
    })[];
};
declare const _default: {
    calculateSecurityKPIs: typeof calculateSecurityKPIs;
    computeVulnerabilityMetrics: typeof computeVulnerabilityMetrics;
    measurePatchCompliance: typeof measurePatchCompliance;
    trackIncidentTrends: typeof trackIncidentTrends;
    calculateRiskScore: typeof calculateRiskScore;
    assessControlEffectiveness: typeof assessControlEffectiveness;
    benchmarkSecurityPosture: typeof benchmarkSecurityPosture;
    generateKPIReport: typeof generateKPIReport;
    generateDashboardMetrics: typeof generateDashboardMetrics;
    aggregateSecurityData: typeof aggregateSecurityData;
    computeTrendAnalysis: typeof computeTrendAnalysis;
    prepareVisualizationData: typeof prepareVisualizationData;
    calculatePercentiles: typeof calculatePercentiles;
    formatMetricsForUI: typeof formatMetricsForUI;
    exportDashboardData: typeof exportDashboardData;
    calculateThreatExposure: typeof calculateThreatExposure;
    scoreCriticalAssets: typeof scoreCriticalAssets;
    assessVulnerabilityImpact: typeof assessVulnerabilityImpact;
    computeExploitLikelihood: typeof computeExploitLikelihood;
    prioritizeThreats: typeof prioritizeThreats;
    generateExposureMatrix: typeof generateExposureMatrix;
    trackExposureTrends: typeof trackExposureTrends;
    assessSecurityPosture: typeof assessSecurityPosture;
    evaluateControlMaturity: typeof evaluateControlMaturity;
    scoreSecurityFramework: typeof scoreSecurityFramework;
    benchmarkIndustryStandards: typeof benchmarkIndustryStandards;
    identifyPostureGaps: typeof identifyPostureGaps;
    generatePostureReport: typeof generatePostureReport;
    trackComplianceRates: typeof trackComplianceRates;
    calculateControlCoverage: typeof calculateControlCoverage;
    monitorPolicyAdherence: typeof monitorPolicyAdherence;
    assessRegulatoryCompliance: typeof assessRegulatoryCompliance;
    generateComplianceScorecard: typeof generateComplianceScorecard;
    alertComplianceDeviations: typeof alertComplianceDeviations;
    calculateMTTD: typeof calculateMTTD;
    calculateMTTR: typeof calculateMTTR;
    measureResponseEfficiency: typeof measureResponseEfficiency;
    trackIncidentVolume: typeof trackIncidentVolume;
    analyzeResponseTimes: typeof analyzeResponseTimes;
    generateIRMetrics: typeof generateIRMetrics;
    SecurityMetricModel: {
        tableName: string;
        schema: {
            id: {
                type: string;
                primaryKey: boolean;
                autoIncrement: boolean;
            };
            metricId: {
                type: string;
                unique: boolean;
                allowNull: boolean;
            };
            organizationId: {
                type: string;
                allowNull: boolean;
            };
            metricName: {
                type: string;
                allowNull: boolean;
            };
            metricType: {
                type: string;
            };
            value: {
                type: string;
            };
            unit: {
                type: string;
            };
            target: {
                type: string;
            };
            status: {
                type: string;
                values: string[];
            };
            trend: {
                type: string;
                values: string[];
            };
            measurementPeriod: {
                type: string;
            };
            metadata: {
                type: string;
            };
            createdAt: {
                type: string;
                defaultValue: string;
            };
            updatedAt: {
                type: string;
                defaultValue: string;
            };
        };
        indexes: ({
            fields: string[];
            unique: boolean;
        } | {
            fields: string[];
            unique?: undefined;
        })[];
    };
    KPITargetModel: {
        tableName: string;
        schema: {
            id: {
                type: string;
                primaryKey: boolean;
                autoIncrement: boolean;
            };
            targetId: {
                type: string;
                unique: boolean;
                allowNull: boolean;
            };
            kpiName: {
                type: string;
                allowNull: boolean;
            };
            targetValue: {
                type: string;
            };
            thresholds: {
                type: string;
            };
            evaluationPeriod: {
                type: string;
                values: string[];
            };
            owner: {
                type: string;
            };
            validFrom: {
                type: string;
            };
            validTo: {
                type: string;
            };
            createdAt: {
                type: string;
                defaultValue: string;
            };
            updatedAt: {
                type: string;
                defaultValue: string;
            };
        };
        indexes: ({
            fields: string[];
            unique: boolean;
        } | {
            fields: string[];
            unique?: undefined;
        })[];
    };
    ThreatScoreModel: {
        tableName: string;
        schema: {
            id: {
                type: string;
                primaryKey: boolean;
                autoIncrement: boolean;
            };
            scoreId: {
                type: string;
                unique: boolean;
                allowNull: boolean;
            };
            assetId: {
                type: string;
            };
            organizationId: {
                type: string;
            };
            scoreType: {
                type: string;
                values: string[];
            };
            exposureScore: {
                type: string;
            };
            vulnerabilityScore: {
                type: string;
            };
            threatIntelligenceScore: {
                type: string;
            };
            complianceScore: {
                type: string;
            };
            aggregatedScore: {
                type: string;
            };
            riskLevel: {
                type: string;
                values: string[];
            };
            factors: {
                type: string;
            };
            calculatedAt: {
                type: string;
            };
            createdAt: {
                type: string;
                defaultValue: string;
            };
            updatedAt: {
                type: string;
                defaultValue: string;
            };
        };
        indexes: ({
            fields: string[];
            unique: boolean;
        } | {
            fields: string[];
            unique?: undefined;
        })[];
    };
    ComplianceStatusModel: {
        tableName: string;
        schema: {
            id: {
                type: string;
                primaryKey: boolean;
                autoIncrement: boolean;
            };
            complianceId: {
                type: string;
                unique: boolean;
                allowNull: boolean;
            };
            organizationId: {
                type: string;
                allowNull: boolean;
            };
            framework: {
                type: string;
                values: string[];
            };
            overallCompliance: {
                type: string;
            };
            controlCategories: {
                type: string;
            };
            findings: {
                type: string;
            };
            lastAssessment: {
                type: string;
            };
            nextReview: {
                type: string;
            };
            createdAt: {
                type: string;
                defaultValue: string;
            };
            updatedAt: {
                type: string;
                defaultValue: string;
            };
        };
        indexes: ({
            fields: string[];
            unique: boolean;
        } | {
            fields: string[];
            unique?: undefined;
        })[];
    };
    IncidentMetricModel: {
        tableName: string;
        schema: {
            id: {
                type: string;
                primaryKey: boolean;
                autoIncrement: boolean;
            };
            metricId: {
                type: string;
                unique: boolean;
                allowNull: boolean;
            };
            incidentId: {
                type: string;
            };
            organizationId: {
                type: string;
                allowNull: boolean;
            };
            metricType: {
                type: string;
                values: string[];
            };
            value: {
                type: string;
            };
            unit: {
                type: string;
                values: string[];
            };
            measurementPeriod: {
                type: string;
            };
            benchmark: {
                type: string;
            };
            trend: {
                type: string;
                values: string[];
            };
            createdAt: {
                type: string;
                defaultValue: string;
            };
            updatedAt: {
                type: string;
                defaultValue: string;
            };
        };
        indexes: ({
            fields: string[];
            unique: boolean;
        } | {
            fields: string[];
            unique?: undefined;
        })[];
    };
};
export default _default;
//# sourceMappingURL=security-metrics-kpi-kit.d.ts.map