/**
 * LOC: THRP1234567
 * File: /reuse/threat/threat-reporting-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Threat intelligence report controllers
 *   - Report generation services
 *   - Distribution and scheduling systems
 */
/**
 * File: /reuse/threat/threat-reporting-kit.ts
 * Locator: WC-UTL-THRP-001
 * Purpose: Comprehensive Threat Reporting Utilities - Report generation, templates, scheduling, distribution
 *
 * Upstream: Independent utility module for threat intelligence reporting
 * Downstream: ../backend/*, Report controllers, generation services, distribution systems
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize, PDF/JSON/STIX libraries
 * Exports: 42 utility functions for automated reporting, templates, IOC formatting, scheduling, distribution
 *
 * LLM Context: Comprehensive threat reporting utilities for implementing production-ready report generation
 * in White Cross system. Provides automated report generation, customizable templates, executive summaries,
 * technical reports, IOC formatting (PDF, JSON, STIX), scheduling, and multi-channel distribution.
 * Essential for threat intelligence dissemination and stakeholder communication.
 */
interface ReportConfig {
    id: string;
    title: string;
    type: 'executive' | 'technical' | 'ioc' | 'comprehensive' | 'summary';
    timeRange: {
        start: number;
        end: number;
    };
    includeMetrics?: boolean;
    includeVisualization?: boolean;
    format: 'pdf' | 'json' | 'stix' | 'html' | 'markdown';
    confidentiality: 'public' | 'internal' | 'confidential' | 'restricted';
}
interface ReportData {
    threats: ThreatSummary[];
    incidents: IncidentSummary[];
    indicators: IOCData[];
    metrics: ReportMetrics;
    metadata: ReportMetadata;
}
interface ThreatSummary {
    id: string;
    name: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    category: string;
    firstSeen: number;
    lastSeen: number;
    count: number;
    status: 'active' | 'mitigated' | 'monitoring';
}
interface IncidentSummary {
    id: string;
    title: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    timestamp: number;
    affectedAssets: string[];
    status: 'open' | 'investigating' | 'resolved' | 'closed';
    impact: string;
}
interface IOCData {
    type: 'ip' | 'domain' | 'url' | 'hash' | 'email' | 'file';
    value: string;
    confidence: number;
    firstSeen: number;
    lastSeen: number;
    tags: string[];
    sources: string[];
    relatedThreats: string[];
}
interface ReportMetrics {
    totalThreats: number;
    criticalThreats: number;
    highThreats: number;
    totalIncidents: number;
    totalIOCs: number;
    trendsDirection: 'increasing' | 'decreasing' | 'stable';
    averageSeverity: number;
    responseTime: number;
}
interface ReportMetadata {
    generatedAt: number;
    generatedBy: string;
    version: string;
    confidentiality: string;
    distributionList?: string[];
    expiresAt?: number;
}
interface ReportTemplate {
    id: string;
    name: string;
    type: ReportConfig['type'];
    sections: TemplateSection[];
    variables: Record<string, unknown>;
    styling?: TemplateStyle;
}
interface TemplateSection {
    id: string;
    title: string;
    order: number;
    content: string;
    conditional?: boolean;
    variables: string[];
}
interface TemplateStyle {
    fontFamily?: string;
    fontSize?: number;
    colors?: {
        primary?: string;
        secondary?: string;
        accent?: string;
    };
    layout?: 'single-column' | 'two-column' | 'grid';
}
interface GeneratedReport {
    id: string;
    config: ReportConfig;
    content: string;
    data: ReportData;
    metadata: ReportMetadata;
    size: number;
    checksum?: string;
}
interface ExecutiveSummary {
    keyFindings: string[];
    threatLandscape: string;
    recommendations: string[];
    metrics: {
        totalThreats: number;
        trendDirection: string;
        riskLevel: 'low' | 'medium' | 'high' | 'critical';
    };
    visualization?: string;
}
interface TechnicalReport {
    detailedAnalysis: string;
    technicalIndicators: IOCData[];
    attackVectors: string[];
    mitigationSteps: string[];
    evidence: TechnicalEvidence[];
    relatedIntelligence: string[];
}
interface TechnicalEvidence {
    type: 'log' | 'network' | 'file' | 'memory' | 'registry';
    description: string;
    timestamp: number;
    source: string;
    content: string;
}
interface IOCReport {
    iocs: IOCData[];
    format: 'json' | 'stix' | 'csv' | 'table';
    metadata: {
        totalCount: number;
        byType: Record<string, number>;
        confidenceDistribution: Record<string, number>;
    };
    enrichment?: Record<string, unknown>;
}
interface STIXBundle {
    type: 'bundle';
    id: string;
    objects: STIXObject[];
    spec_version: '2.1';
}
interface STIXObject {
    type: string;
    id: string;
    created: string;
    modified: string;
    [key: string]: unknown;
}
interface ReportSchedule {
    id: string;
    reportType: ReportConfig['type'];
    frequency: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'custom';
    cronExpression?: string;
    enabled: boolean;
    lastRun?: number;
    nextRun: number;
    recipients: string[];
    config: Partial<ReportConfig>;
}
interface DistributionConfig {
    channels: Array<'email' | 'slack' | 'webhook' | 'sftp' | 's3'>;
    recipients: DistributionRecipient[];
    options: {
        compress?: boolean;
        encrypt?: boolean;
        attachments?: boolean;
    };
}
interface DistributionRecipient {
    id: string;
    name: string;
    type: 'user' | 'group' | 'service';
    contact: string;
    preferences?: {
        format?: string;
        frequency?: string;
    };
}
interface DistributionResult {
    success: boolean;
    channel: string;
    recipient: string;
    timestamp: number;
    messageId?: string;
    error?: string;
}
interface ReportArchive {
    reportId: string;
    path: string;
    size: number;
    createdAt: number;
    retentionDays: number;
    compressed: boolean;
    encrypted: boolean;
}
/**
 * Generates a complete threat intelligence report.
 *
 * @param {ReportConfig} config - Report configuration
 * @param {ReportData} data - Report data
 * @returns {Promise<GeneratedReport>} Generated report
 * @throws {Error} If configuration or data is invalid
 *
 * @example
 * ```typescript
 * const report = await generateThreatReport(
 *   {
 *     id: 'RPT-001',
 *     title: 'Weekly Threat Summary',
 *     type: 'comprehensive',
 *     timeRange: { start: startTime, end: endTime },
 *     format: 'pdf',
 *     confidentiality: 'internal'
 *   },
 *   reportData
 * );
 * ```
 */
export declare const generateThreatReport: (config: ReportConfig, data: ReportData) => Promise<GeneratedReport>;
/**
 * Schedules automated report generation.
 *
 * @param {ReportSchedule} schedule - Schedule configuration
 * @returns {Promise<ReportSchedule>} Created schedule
 * @throws {Error} If schedule configuration is invalid
 *
 * @example
 * ```typescript
 * const schedule = await scheduleReportGeneration({
 *   id: 'SCH-001',
 *   reportType: 'executive',
 *   frequency: 'daily',
 *   enabled: true,
 *   nextRun: Date.now() + 86400000,
 *   recipients: ['security-team@example.com'],
 *   config: { format: 'pdf', confidentiality: 'internal' }
 * });
 * ```
 */
export declare const scheduleReportGeneration: (schedule: ReportSchedule) => Promise<ReportSchedule>;
/**
 * Executes the report generation pipeline.
 *
 * @param {string} reportId - Report identifier
 * @param {ReportConfig} config - Report configuration
 * @returns {Promise<GeneratedReport>} Generated report
 *
 * @example
 * ```typescript
 * const report = await executeReportPipeline('RPT-002', reportConfig);
 * ```
 */
export declare const executeReportPipeline: (reportId: string, config: ReportConfig) => Promise<GeneratedReport>;
/**
 * Validates report data for completeness and correctness.
 *
 * @param {ReportData} data - Data to validate
 * @returns {Promise<ReportData>} Validated data
 * @throws {Error} If validation fails
 *
 * @example
 * ```typescript
 * const validated = await validateReportData(rawData);
 * ```
 */
export declare const validateReportData: (data: ReportData) => Promise<ReportData>;
/**
 * Enriches report content with additional context and analysis.
 *
 * @param {ReportData} data - Base report data
 * @param {ReportConfig} config - Report configuration
 * @returns {Promise<ReportData>} Enriched data
 *
 * @example
 * ```typescript
 * const enriched = await enrichReportContent(data, config);
 * ```
 */
export declare const enrichReportContent: (data: ReportData, config: ReportConfig) => Promise<ReportData>;
/**
 * Compiles all report sections into structured content.
 *
 * @param {ReportConfig} config - Report configuration
 * @param {ReportData} data - Report data
 * @returns {Promise<string[]>} Compiled sections
 *
 * @example
 * ```typescript
 * const sections = await compileReportSections(config, data);
 * ```
 */
export declare const compileReportSections: (config: ReportConfig, data: ReportData) => Promise<string[]>;
/**
 * Finalizes report with formatting and metadata.
 *
 * @param {ReportConfig} config - Report configuration
 * @param {string[]} sections - Report sections
 * @param {ReportData} data - Report data
 * @returns {Promise<GeneratedReport>} Final report
 *
 * @example
 * ```typescript
 * const final = await finalizeReport(config, sections, data);
 * ```
 */
export declare const finalizeReport: (config: ReportConfig, sections: string[], data: ReportData) => Promise<GeneratedReport>;
/**
 * Loads a report template by ID.
 *
 * @param {string} templateId - Template identifier
 * @returns {Promise<ReportTemplate>} Loaded template
 * @throws {Error} If template not found
 *
 * @example
 * ```typescript
 * const template = await loadReportTemplate('TMPL-EXEC-001');
 * ```
 */
export declare const loadReportTemplate: (templateId: string) => Promise<ReportTemplate>;
/**
 * Customizes template with specific options.
 *
 * @param {ReportTemplate} template - Base template
 * @param {Partial<ReportTemplate>} customizations - Customization options
 * @returns {ReportTemplate} Customized template
 *
 * @example
 * ```typescript
 * const custom = customizeTemplate(baseTemplate, {
 *   styling: { fontSize: 14, colors: { primary: '#007bff' } }
 * });
 * ```
 */
export declare const customizeTemplate: (template: ReportTemplate, customizations: Partial<ReportTemplate>) => ReportTemplate;
/**
 * Applies template variables to generate content.
 *
 * @param {ReportTemplate} template - Template to apply
 * @param {Record<string, unknown>} variables - Variable values
 * @returns {string} Rendered content
 *
 * @example
 * ```typescript
 * const content = applyTemplateVariables(template, {
 *   title: 'Q4 Threat Report',
 *   summary: 'Overall threat landscape stable'
 * });
 * ```
 */
export declare const applyTemplateVariables: (template: ReportTemplate, variables: Record<string, unknown>) => string;
/**
 * Validates template structure and variables.
 *
 * @param {ReportTemplate} template - Template to validate
 * @returns {{ valid: boolean; errors: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateTemplateStructure(template);
 * if (!validation.valid) {
 *   console.error('Template errors:', validation.errors);
 * }
 * ```
 */
export declare const validateTemplateStructure: (template: ReportTemplate) => {
    valid: boolean;
    errors: string[];
};
/**
 * Merges multiple template fragments into one.
 *
 * @param {ReportTemplate[]} fragments - Template fragments to merge
 * @returns {ReportTemplate} Merged template
 *
 * @example
 * ```typescript
 * const merged = mergeTemplateFragments([headerTemplate, bodyTemplate, footerTemplate]);
 * ```
 */
export declare const mergeTemplateFragments: (fragments: ReportTemplate[]) => ReportTemplate;
/**
 * Saves template as a preset for future use.
 *
 * @param {ReportTemplate} template - Template to save
 * @param {string} presetName - Preset name
 * @returns {Promise<string>} Saved preset ID
 *
 * @example
 * ```typescript
 * const presetId = await saveTemplatePreset(customTemplate, 'Weekly Executive');
 * ```
 */
export declare const saveTemplatePreset: (template: ReportTemplate, presetName: string) => Promise<string>;
/**
 * Lists all available templates.
 *
 * @param {ReportConfig['type']} [type] - Filter by report type
 * @returns {Promise<Array<{ id: string; name: string; type: string }>>} Available templates
 *
 * @example
 * ```typescript
 * const templates = await listAvailableTemplates('executive');
 * ```
 */
export declare const listAvailableTemplates: (type?: ReportConfig["type"]) => Promise<Array<{
    id: string;
    name: string;
    type: string;
}>>;
/**
 * Generates executive summary from report data.
 *
 * @param {ReportData} data - Report data
 * @param {number} [maxFindings] - Maximum key findings (default: 5)
 * @returns {Promise<ExecutiveSummary>} Executive summary
 *
 * @example
 * ```typescript
 * const summary = await generateExecutiveSummary(reportData, 5);
 * ```
 */
export declare const generateExecutiveSummary: (data: ReportData, maxFindings?: number) => Promise<ExecutiveSummary>;
/**
 * Extracts key metrics for executive reporting.
 *
 * @param {ReportData} data - Report data
 * @param {number} limit - Maximum number of metrics
 * @returns {Promise<string[]>} Key findings
 *
 * @example
 * ```typescript
 * const metrics = await extractKeyMetrics(data, 3);
 * // Result: ['15 critical threats detected', 'Phishing attacks increased 30%', ...]
 * ```
 */
export declare const extractKeyMetrics: (data: ReportData, limit: number) => Promise<string[]>;
/**
 * Summarizes overall threat landscape.
 *
 * @param {ReportData} data - Report data
 * @returns {Promise<string>} Threat landscape summary
 *
 * @example
 * ```typescript
 * const landscape = await summarizeThreatLandscape(data);
 * ```
 */
export declare const summarizeThreatLandscape: (data: ReportData) => Promise<string>;
/**
 * Creates high-level visualization data for executives.
 *
 * @param {ReportData} data - Report data
 * @returns {Promise<string>} Visualization data (JSON format)
 *
 * @example
 * ```typescript
 * const viz = await createHighLevelVisualization(data);
 * ```
 */
export declare const createHighLevelVisualization: (data: ReportData) => Promise<string>;
/**
 * Formats executive insights with proper styling.
 *
 * @param {ExecutiveSummary} summary - Executive summary
 * @param {'markdown' | 'html' | 'plain'} format - Output format
 * @returns {string} Formatted insights
 *
 * @example
 * ```typescript
 * const formatted = formatExecutiveInsights(summary, 'markdown');
 * ```
 */
export declare const formatExecutiveInsights: (summary: ExecutiveSummary, format?: "markdown" | "html" | "plain") => string;
/**
 * Prioritizes executive findings by impact.
 *
 * @param {string[]} findings - List of findings
 * @returns {string[]} Prioritized findings
 *
 * @example
 * ```typescript
 * const prioritized = prioritizeExecutiveFindings(allFindings);
 * ```
 */
export declare const prioritizeExecutiveFindings: (findings: string[]) => string[];
/**
 * Generates detailed technical report.
 *
 * @param {ReportData} data - Report data
 * @param {boolean} [includeEvidence] - Include technical evidence
 * @returns {Promise<TechnicalReport>} Technical report
 *
 * @example
 * ```typescript
 * const techReport = await generateTechnicalReport(data, true);
 * ```
 */
export declare const generateTechnicalReport: (data: ReportData, includeEvidence?: boolean) => Promise<TechnicalReport>;
/**
 * Documents technical details and analysis.
 *
 * @param {ReportData} data - Report data
 * @returns {Promise<string>} Technical documentation
 *
 * @example
 * ```typescript
 * const details = await documentTechnicalDetails(data);
 * ```
 */
export declare const documentTechnicalDetails: (data: ReportData) => Promise<string>;
/**
 * Includes threat indicators in technical format.
 *
 * @param {IOCData[]} indicators - Indicators to include
 * @param {TechnicalReport} report - Report to update
 * @returns {TechnicalReport} Updated report
 *
 * @example
 * ```typescript
 * const updated = includeThreatIndicators(iocs, technicalReport);
 * ```
 */
export declare const includeThreatIndicators: (indicators: IOCData[], report: TechnicalReport) => TechnicalReport;
/**
 * Formats technical analysis for readability.
 *
 * @param {string} analysis - Raw analysis text
 * @param {'detailed' | 'concise'} style - Formatting style
 * @returns {string} Formatted analysis
 *
 * @example
 * ```typescript
 * const formatted = formatTechnicalAnalysis(rawAnalysis, 'detailed');
 * ```
 */
export declare const formatTechnicalAnalysis: (analysis: string, style?: "detailed" | "concise") => string;
/**
 * Appends technical evidence to report.
 *
 * @param {TechnicalEvidence} evidence - Evidence to append
 * @param {TechnicalReport} report - Report to update
 * @returns {TechnicalReport} Updated report
 *
 * @example
 * ```typescript
 * const updated = appendTechnicalEvidence(newEvidence, report);
 * ```
 */
export declare const appendTechnicalEvidence: (evidence: TechnicalEvidence, report: TechnicalReport) => TechnicalReport;
/**
 * Links related technical data across reports.
 *
 * @param {string} reportId - Current report ID
 * @param {string[]} relatedReportIds - Related report IDs
 * @returns {Promise<string[]>} Intelligence links
 *
 * @example
 * ```typescript
 * const links = await linkRelatedTechnicalData('RPT-001', ['RPT-002', 'RPT-003']);
 * ```
 */
export declare const linkRelatedTechnicalData: (reportId: string, relatedReportIds: string[]) => Promise<string[]>;
/**
 * Formats IOC report in specified format.
 *
 * @param {IOCData[]} iocs - Indicators of compromise
 * @param {'json' | 'stix' | 'csv' | 'table'} format - Output format
 * @returns {Promise<IOCReport>} Formatted IOC report
 *
 * @example
 * ```typescript
 * const iocReport = await formatIOCReport(indicators, 'stix');
 * ```
 */
export declare const formatIOCReport: (iocs: IOCData[], format: "json" | "stix" | "csv" | "table") => Promise<IOCReport>;
/**
 * Converts IOC data to STIX 2.1 format.
 *
 * @param {IOCData[]} iocs - Indicators to convert
 * @returns {Promise<STIXBundle>} STIX bundle
 *
 * @example
 * ```typescript
 * const stixBundle = await convertToSTIX(indicators);
 * ```
 */
export declare const convertToSTIX: (iocs: IOCData[]) => Promise<STIXBundle>;
/**
 * Exports IOC data as JSON.
 *
 * @param {IOCData[]} iocs - Indicators to export
 * @param {boolean} [pretty] - Pretty print JSON
 * @returns {string} JSON string
 *
 * @example
 * ```typescript
 * const json = exportAsJSON(indicators, true);
 * ```
 */
export declare const exportAsJSON: (iocs: IOCData[], pretty?: boolean) => string;
/**
 * Generates IOC table for display.
 *
 * @param {IOCData[]} iocs - Indicators to display
 * @returns {string} Markdown table
 *
 * @example
 * ```typescript
 * const table = generateIOCTable(indicators);
 * ```
 */
export declare const generateIOCTable: (iocs: IOCData[]) => string;
/**
 * Enriches IOC data with additional metadata.
 *
 * @param {IOCData[]} iocs - Indicators to enrich
 * @returns {Promise<IOCData[]>} Enriched indicators
 *
 * @example
 * ```typescript
 * const enriched = await enrichIOCMetadata(indicators);
 * ```
 */
export declare const enrichIOCMetadata: (iocs: IOCData[]) => Promise<IOCData[]>;
/**
 * Validates IOC structure and data quality.
 *
 * @param {IOCData} ioc - Indicator to validate
 * @returns {{ valid: boolean; errors: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateIOCStructure(indicator);
 * ```
 */
export declare const validateIOCStructure: (ioc: IOCData) => {
    valid: boolean;
    errors: string[];
};
/**
 * Creates a new report schedule.
 *
 * @param {Omit<ReportSchedule, 'id' | 'nextRun'>} scheduleConfig - Schedule configuration
 * @returns {Promise<ReportSchedule>} Created schedule
 *
 * @example
 * ```typescript
 * const schedule = await createReportSchedule({
 *   reportType: 'executive',
 *   frequency: 'daily',
 *   enabled: true,
 *   recipients: ['team@example.com'],
 *   config: { format: 'pdf' }
 * });
 * ```
 */
export declare const createReportSchedule: (scheduleConfig: Omit<ReportSchedule, "id" | "nextRun">) => Promise<ReportSchedule>;
/**
 * Updates schedule frequency and timing.
 *
 * @param {string} scheduleId - Schedule ID to update
 * @param {ReportSchedule['frequency']} frequency - New frequency
 * @param {string} [cronExpression] - Cron expression for custom frequency
 * @returns {Promise<ReportSchedule>} Updated schedule
 *
 * @example
 * ```typescript
 * const updated = await updateScheduleFrequency('SCH-001', 'weekly');
 * ```
 */
export declare const updateScheduleFrequency: (scheduleId: string, frequency: ReportSchedule["frequency"], cronExpression?: string) => Promise<ReportSchedule>;
/**
 * Executes a scheduled report generation.
 *
 * @param {string} scheduleId - Schedule ID to execute
 * @returns {Promise<GeneratedReport>} Generated report
 *
 * @example
 * ```typescript
 * const report = await executeScheduledReport('SCH-001');
 * ```
 */
export declare const executeScheduledReport: (scheduleId: string) => Promise<GeneratedReport>;
/**
 * Cancels a scheduled report.
 *
 * @param {string} scheduleId - Schedule ID to cancel
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * await cancelScheduledReport('SCH-001');
 * ```
 */
export declare const cancelScheduledReport: (scheduleId: string) => Promise<boolean>;
/**
 * Lists all active report schedules.
 *
 * @param {boolean} [enabledOnly] - Only return enabled schedules
 * @returns {Promise<ReportSchedule[]>} Active schedules
 *
 * @example
 * ```typescript
 * const schedules = await listActiveSchedules(true);
 * ```
 */
export declare const listActiveSchedules: (enabledOnly?: boolean) => Promise<ReportSchedule[]>;
/**
 * Distributes report to configured channels.
 *
 * @param {GeneratedReport} report - Report to distribute
 * @param {DistributionConfig} config - Distribution configuration
 * @returns {Promise<DistributionResult[]>} Distribution results
 *
 * @example
 * ```typescript
 * const results = await distributeReport(report, {
 *   channels: ['email', 'slack'],
 *   recipients: [{ id: '1', name: 'Team', type: 'group', contact: 'team@example.com' }],
 *   options: { compress: true }
 * });
 * ```
 */
export declare const distributeReport: (report: GeneratedReport, config: DistributionConfig) => Promise<DistributionResult[]>;
/**
 * Configures distribution list for reports.
 *
 * @param {DistributionRecipient[]} recipients - Recipients to configure
 * @returns {Promise<DistributionConfig>} Distribution configuration
 *
 * @example
 * ```typescript
 * const config = await configureDistributionList([
 *   { id: '1', name: 'Security Team', type: 'group', contact: 'security@example.com' }
 * ]);
 * ```
 */
export declare const configureDistributionList: (recipients: DistributionRecipient[]) => Promise<DistributionConfig>;
/**
 * Sends report notification to recipients.
 *
 * @param {string} reportId - Report identifier
 * @param {string[]} recipients - Recipient addresses
 * @param {string} [message] - Custom message
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * await sendReportNotification('RPT-001', ['team@example.com'], 'New report available');
 * ```
 */
export declare const sendReportNotification: (reportId: string, recipients: string[], message?: string) => Promise<boolean>;
/**
 * Tracks distribution status of reports.
 *
 * @param {string} reportId - Report ID to track
 * @returns {Promise<DistributionResult[]>} Distribution history
 *
 * @example
 * ```typescript
 * const status = await trackDistributionStatus('RPT-001');
 * ```
 */
export declare const trackDistributionStatus: (reportId: string) => Promise<DistributionResult[]>;
/**
 * Archives distributed report for retention.
 *
 * @param {GeneratedReport} report - Report to archive
 * @param {number} [retentionDays] - Retention period in days (default: 90)
 * @returns {Promise<ReportArchive>} Archive information
 *
 * @example
 * ```typescript
 * const archive = await archiveDistributedReport(report, 180);
 * ```
 */
export declare const archiveDistributedReport: (report: GeneratedReport, retentionDays?: number) => Promise<ReportArchive>;
declare const _default: {
    generateThreatReport: (config: ReportConfig, data: ReportData) => Promise<GeneratedReport>;
    scheduleReportGeneration: (schedule: ReportSchedule) => Promise<ReportSchedule>;
    executeReportPipeline: (reportId: string, config: ReportConfig) => Promise<GeneratedReport>;
    validateReportData: (data: ReportData) => Promise<ReportData>;
    enrichReportContent: (data: ReportData, config: ReportConfig) => Promise<ReportData>;
    compileReportSections: (config: ReportConfig, data: ReportData) => Promise<string[]>;
    finalizeReport: (config: ReportConfig, sections: string[], data: ReportData) => Promise<GeneratedReport>;
    loadReportTemplate: (templateId: string) => Promise<ReportTemplate>;
    customizeTemplate: (template: ReportTemplate, customizations: Partial<ReportTemplate>) => ReportTemplate;
    applyTemplateVariables: (template: ReportTemplate, variables: Record<string, unknown>) => string;
    validateTemplateStructure: (template: ReportTemplate) => {
        valid: boolean;
        errors: string[];
    };
    mergeTemplateFragments: (fragments: ReportTemplate[]) => ReportTemplate;
    saveTemplatePreset: (template: ReportTemplate, presetName: string) => Promise<string>;
    listAvailableTemplates: (type?: ReportConfig["type"]) => Promise<Array<{
        id: string;
        name: string;
        type: string;
    }>>;
    generateExecutiveSummary: (data: ReportData, maxFindings?: number) => Promise<ExecutiveSummary>;
    extractKeyMetrics: (data: ReportData, limit: number) => Promise<string[]>;
    summarizeThreatLandscape: (data: ReportData) => Promise<string>;
    createHighLevelVisualization: (data: ReportData) => Promise<string>;
    formatExecutiveInsights: (summary: ExecutiveSummary, format?: "markdown" | "html" | "plain") => string;
    prioritizeExecutiveFindings: (findings: string[]) => string[];
    generateTechnicalReport: (data: ReportData, includeEvidence?: boolean) => Promise<TechnicalReport>;
    documentTechnicalDetails: (data: ReportData) => Promise<string>;
    includeThreatIndicators: (indicators: IOCData[], report: TechnicalReport) => TechnicalReport;
    formatTechnicalAnalysis: (analysis: string, style?: "detailed" | "concise") => string;
    appendTechnicalEvidence: (evidence: TechnicalEvidence, report: TechnicalReport) => TechnicalReport;
    linkRelatedTechnicalData: (reportId: string, relatedReportIds: string[]) => Promise<string[]>;
    formatIOCReport: (iocs: IOCData[], format: "json" | "stix" | "csv" | "table") => Promise<IOCReport>;
    convertToSTIX: (iocs: IOCData[]) => Promise<STIXBundle>;
    exportAsJSON: (iocs: IOCData[], pretty?: boolean) => string;
    generateIOCTable: (iocs: IOCData[]) => string;
    enrichIOCMetadata: (iocs: IOCData[]) => Promise<IOCData[]>;
    validateIOCStructure: (ioc: IOCData) => {
        valid: boolean;
        errors: string[];
    };
    createReportSchedule: (scheduleConfig: Omit<ReportSchedule, "id" | "nextRun">) => Promise<ReportSchedule>;
    updateScheduleFrequency: (scheduleId: string, frequency: ReportSchedule["frequency"], cronExpression?: string) => Promise<ReportSchedule>;
    executeScheduledReport: (scheduleId: string) => Promise<GeneratedReport>;
    cancelScheduledReport: (scheduleId: string) => Promise<boolean>;
    listActiveSchedules: (enabledOnly?: boolean) => Promise<ReportSchedule[]>;
    distributeReport: (report: GeneratedReport, config: DistributionConfig) => Promise<DistributionResult[]>;
    configureDistributionList: (recipients: DistributionRecipient[]) => Promise<DistributionConfig>;
    sendReportNotification: (reportId: string, recipients: string[], message?: string) => Promise<boolean>;
    trackDistributionStatus: (reportId: string) => Promise<DistributionResult[]>;
    archiveDistributedReport: (report: GeneratedReport, retentionDays?: number) => Promise<ReportArchive>;
};
export default _default;
//# sourceMappingURL=threat-reporting-kit.d.ts.map