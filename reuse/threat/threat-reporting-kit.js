"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.archiveDistributedReport = exports.trackDistributionStatus = exports.sendReportNotification = exports.configureDistributionList = exports.distributeReport = exports.listActiveSchedules = exports.cancelScheduledReport = exports.executeScheduledReport = exports.updateScheduleFrequency = exports.createReportSchedule = exports.validateIOCStructure = exports.enrichIOCMetadata = exports.generateIOCTable = exports.exportAsJSON = exports.convertToSTIX = exports.formatIOCReport = exports.linkRelatedTechnicalData = exports.appendTechnicalEvidence = exports.formatTechnicalAnalysis = exports.includeThreatIndicators = exports.documentTechnicalDetails = exports.generateTechnicalReport = exports.prioritizeExecutiveFindings = exports.formatExecutiveInsights = exports.createHighLevelVisualization = exports.summarizeThreatLandscape = exports.extractKeyMetrics = exports.generateExecutiveSummary = exports.listAvailableTemplates = exports.saveTemplatePreset = exports.mergeTemplateFragments = exports.validateTemplateStructure = exports.applyTemplateVariables = exports.customizeTemplate = exports.loadReportTemplate = exports.finalizeReport = exports.compileReportSections = exports.enrichReportContent = exports.validateReportData = exports.executeReportPipeline = exports.scheduleReportGeneration = exports.generateThreatReport = void 0;
// ============================================================================
// AUTOMATED REPORT GENERATION
// ============================================================================
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
const generateThreatReport = async (config, data) => {
    if (!config || !config.id || !config.title) {
        throw new Error('Invalid report configuration: id and title required');
    }
    if (!data || !data.threats || !data.metrics) {
        throw new Error('Invalid report data: threats and metrics required');
    }
    // Validate report data
    const validatedData = await (0, exports.validateReportData)(data);
    // Enrich report content
    const enrichedData = await (0, exports.enrichReportContent)(validatedData, config);
    // Compile report sections
    const sections = await (0, exports.compileReportSections)(config, enrichedData);
    // Finalize report
    const finalReport = await (0, exports.finalizeReport)(config, sections, enrichedData);
    return finalReport;
};
exports.generateThreatReport = generateThreatReport;
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
const scheduleReportGeneration = async (schedule) => {
    if (!schedule.id || !schedule.reportType) {
        throw new Error('Invalid schedule: id and reportType required');
    }
    if (!['hourly', 'daily', 'weekly', 'monthly', 'custom'].includes(schedule.frequency)) {
        throw new Error('Invalid frequency specified');
    }
    if (schedule.frequency === 'custom' && !schedule.cronExpression) {
        throw new Error('Cron expression required for custom frequency');
    }
    // Calculate next run time if not provided
    if (!schedule.nextRun) {
        schedule.nextRun = calculateNextRunTime(schedule.frequency);
    }
    // Validate recipients
    if (!schedule.recipients || schedule.recipients.length === 0) {
        throw new Error('At least one recipient required');
    }
    return {
        ...schedule,
        enabled: schedule.enabled !== false,
        lastRun: schedule.lastRun || undefined,
    };
};
exports.scheduleReportGeneration = scheduleReportGeneration;
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
const executeReportPipeline = async (reportId, config) => {
    if (!reportId || typeof reportId !== 'string') {
        throw new Error('Valid report ID required');
    }
    try {
        // Step 1: Collect data
        const data = await collectReportData(config.timeRange);
        // Step 2: Validate data
        const validated = await (0, exports.validateReportData)(data);
        // Step 3: Generate report
        const report = await (0, exports.generateThreatReport)(config, validated);
        // Step 4: Post-processing
        if (config.format === 'pdf') {
            // PDF-specific processing would go here
            console.log('PDF generation completed');
        }
        return report;
    }
    catch (error) {
        throw new Error(`Report pipeline failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
};
exports.executeReportPipeline = executeReportPipeline;
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
const validateReportData = async (data) => {
    const errors = [];
    if (!data.threats || !Array.isArray(data.threats)) {
        errors.push('Threats array is required');
    }
    if (!data.incidents || !Array.isArray(data.incidents)) {
        errors.push('Incidents array is required');
    }
    if (!data.indicators || !Array.isArray(data.indicators)) {
        errors.push('Indicators array is required');
    }
    if (!data.metrics || typeof data.metrics !== 'object') {
        errors.push('Metrics object is required');
    }
    if (errors.length > 0) {
        throw new Error(`Validation failed: ${errors.join(', ')}`);
    }
    // Ensure all required metric fields exist
    const validatedData = {
        ...data,
        metrics: {
            totalThreats: data.metrics.totalThreats || data.threats.length,
            criticalThreats: data.metrics.criticalThreats || data.threats.filter(t => t.severity === 'critical').length,
            highThreats: data.metrics.highThreats || data.threats.filter(t => t.severity === 'high').length,
            totalIncidents: data.metrics.totalIncidents || data.incidents.length,
            totalIOCs: data.metrics.totalIOCs || data.indicators.length,
            trendsDirection: data.metrics.trendsDirection || 'stable',
            averageSeverity: data.metrics.averageSeverity || 0,
            responseTime: data.metrics.responseTime || 0,
        },
    };
    return validatedData;
};
exports.validateReportData = validateReportData;
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
const enrichReportContent = async (data, config) => {
    const enriched = { ...data };
    // Enrich threats with additional context
    enriched.threats = data.threats.map(threat => ({
        ...threat,
        // Additional enrichment could be added here
    }));
    // Calculate additional metrics if requested
    if (config.includeMetrics) {
        const severityScores = { low: 1, medium: 2, high: 3, critical: 4 };
        const avgSeverity = data.threats.reduce((sum, t) => sum + severityScores[t.severity], 0) / data.threats.length;
        enriched.metrics = {
            ...enriched.metrics,
            averageSeverity: avgSeverity,
        };
    }
    return enriched;
};
exports.enrichReportContent = enrichReportContent;
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
const compileReportSections = async (config, data) => {
    const sections = [];
    // Header section
    sections.push(`# ${config.title}\n`);
    sections.push(`**Report Type:** ${config.type}\n`);
    sections.push(`**Time Range:** ${new Date(config.timeRange.start).toISOString()} - ${new Date(config.timeRange.end).toISOString()}\n`);
    sections.push(`**Confidentiality:** ${config.confidentiality}\n\n`);
    // Executive Summary
    if (config.type === 'executive' || config.type === 'comprehensive') {
        sections.push('## Executive Summary\n');
        sections.push(`Total Threats: ${data.metrics.totalThreats}\n`);
        sections.push(`Critical Threats: ${data.metrics.criticalThreats}\n`);
        sections.push(`Trend Direction: ${data.metrics.trendsDirection}\n\n`);
    }
    // Threat Details
    if (config.type === 'technical' || config.type === 'comprehensive') {
        sections.push('## Threat Analysis\n');
        data.threats.forEach(threat => {
            sections.push(`### ${threat.name} (${threat.severity})\n`);
            sections.push(`- Category: ${threat.category}\n`);
            sections.push(`- Status: ${threat.status}\n`);
            sections.push(`- Count: ${threat.count}\n\n`);
        });
    }
    // IOC Section
    if (config.type === 'ioc' || config.type === 'comprehensive') {
        sections.push('## Indicators of Compromise\n');
        sections.push(`Total IOCs: ${data.indicators.length}\n\n`);
    }
    return sections;
};
exports.compileReportSections = compileReportSections;
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
const finalizeReport = async (config, sections, data) => {
    const content = sections.join('\n');
    const metadata = {
        generatedAt: Date.now(),
        generatedBy: 'White Cross TI System',
        version: '1.0.0',
        confidentiality: config.confidentiality,
    };
    const report = {
        id: config.id,
        config,
        content,
        data,
        metadata,
        size: content.length,
        checksum: generateChecksum(content),
    };
    return report;
};
exports.finalizeReport = finalizeReport;
// ============================================================================
// REPORT TEMPLATES & CUSTOMIZATION
// ============================================================================
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
const loadReportTemplate = async (templateId) => {
    if (!templateId || typeof templateId !== 'string') {
        throw new Error('Valid template ID required');
    }
    // Mock template loading - in production, this would load from database
    const template = {
        id: templateId,
        name: 'Default Template',
        type: 'executive',
        sections: [
            {
                id: 'header',
                title: 'Report Header',
                order: 1,
                content: '# {{title}}\n',
                variables: ['title'],
            },
            {
                id: 'summary',
                title: 'Executive Summary',
                order: 2,
                content: '## Summary\n{{summary}}\n',
                variables: ['summary'],
            },
        ],
        variables: {},
    };
    return template;
};
exports.loadReportTemplate = loadReportTemplate;
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
const customizeTemplate = (template, customizations) => {
    return {
        ...template,
        ...customizations,
        sections: customizations.sections || template.sections,
        styling: {
            ...template.styling,
            ...customizations.styling,
        },
        variables: {
            ...template.variables,
            ...customizations.variables,
        },
    };
};
exports.customizeTemplate = customizeTemplate;
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
const applyTemplateVariables = (template, variables) => {
    let content = '';
    template.sections
        .sort((a, b) => a.order - b.order)
        .forEach(section => {
        let sectionContent = section.content;
        section.variables.forEach(varName => {
            const value = variables[varName] || template.variables[varName] || '';
            const regex = new RegExp(`{{${varName}}}`, 'g');
            sectionContent = sectionContent.replace(regex, String(value));
        });
        content += sectionContent;
    });
    return content;
};
exports.applyTemplateVariables = applyTemplateVariables;
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
const validateTemplateStructure = (template) => {
    const errors = [];
    if (!template.id || !template.name) {
        errors.push('Template must have id and name');
    }
    if (!template.sections || template.sections.length === 0) {
        errors.push('Template must have at least one section');
    }
    template.sections?.forEach((section, idx) => {
        if (!section.id || !section.title) {
            errors.push(`Section ${idx} must have id and title`);
        }
        if (section.order < 1) {
            errors.push(`Section ${section.id} must have order >= 1`);
        }
    });
    return {
        valid: errors.length === 0,
        errors,
    };
};
exports.validateTemplateStructure = validateTemplateStructure;
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
const mergeTemplateFragments = (fragments) => {
    if (fragments.length === 0) {
        throw new Error('At least one template fragment required');
    }
    const baseTemplate = fragments[0];
    const mergedSections = [];
    const mergedVariables = {};
    let currentOrder = 1;
    fragments.forEach(fragment => {
        fragment.sections.forEach(section => {
            mergedSections.push({
                ...section,
                order: currentOrder++,
            });
        });
        Object.assign(mergedVariables, fragment.variables);
    });
    return {
        id: `merged-${Date.now()}`,
        name: 'Merged Template',
        type: baseTemplate.type,
        sections: mergedSections,
        variables: mergedVariables,
        styling: baseTemplate.styling,
    };
};
exports.mergeTemplateFragments = mergeTemplateFragments;
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
const saveTemplatePreset = async (template, presetName) => {
    const validation = (0, exports.validateTemplateStructure)(template);
    if (!validation.valid) {
        throw new Error(`Invalid template: ${validation.errors.join(', ')}`);
    }
    const presetId = `PRESET-${Date.now()}`;
    // In production, save to database
    console.log(`Saving template preset: ${presetName} with ID: ${presetId}`);
    return presetId;
};
exports.saveTemplatePreset = saveTemplatePreset;
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
const listAvailableTemplates = async (type) => {
    // Mock data - in production, fetch from database
    const allTemplates = [
        { id: 'TMPL-EXEC-001', name: 'Executive Summary', type: 'executive' },
        { id: 'TMPL-TECH-001', name: 'Technical Analysis', type: 'technical' },
        { id: 'TMPL-IOC-001', name: 'IOC Report', type: 'ioc' },
        { id: 'TMPL-COMP-001', name: 'Comprehensive Report', type: 'comprehensive' },
    ];
    if (type) {
        return allTemplates.filter(t => t.type === type);
    }
    return allTemplates;
};
exports.listAvailableTemplates = listAvailableTemplates;
// ============================================================================
// EXECUTIVE SUMMARY GENERATION
// ============================================================================
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
const generateExecutiveSummary = async (data, maxFindings = 5) => {
    const keyFindings = await (0, exports.extractKeyMetrics)(data, maxFindings);
    const landscape = await (0, exports.summarizeThreatLandscape)(data);
    const riskLevel = data.metrics.criticalThreats > 5 ? 'critical' :
        data.metrics.criticalThreats > 2 ? 'high' :
            data.metrics.highThreats > 10 ? 'medium' : 'low';
    const recommendations = [
        'Continue monitoring critical threat indicators',
        'Review and update security policies',
        'Conduct threat hunting exercises',
    ];
    return {
        keyFindings,
        threatLandscape: landscape,
        recommendations,
        metrics: {
            totalThreats: data.metrics.totalThreats,
            trendDirection: data.metrics.trendsDirection,
            riskLevel,
        },
    };
};
exports.generateExecutiveSummary = generateExecutiveSummary;
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
const extractKeyMetrics = async (data, limit) => {
    const findings = [];
    if (data.metrics.criticalThreats > 0) {
        findings.push(`${data.metrics.criticalThreats} critical threat(s) detected`);
    }
    if (data.metrics.trendsDirection === 'increasing') {
        findings.push('Threat activity showing upward trend');
    }
    else if (data.metrics.trendsDirection === 'decreasing') {
        findings.push('Threat activity decreasing');
    }
    const topCategory = data.threats
        .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + 1;
        return acc;
    }, {});
    const topCat = Object.entries(topCategory).sort((a, b) => b[1] - a[1])[0];
    if (topCat) {
        findings.push(`${topCat[0]} threats are most prevalent (${topCat[1]} instances)`);
    }
    findings.push(`${data.metrics.totalIOCs} indicators of compromise identified`);
    return findings.slice(0, limit);
};
exports.extractKeyMetrics = extractKeyMetrics;
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
const summarizeThreatLandscape = async (data) => {
    const total = data.metrics.totalThreats;
    const critical = data.metrics.criticalThreats;
    const high = data.metrics.highThreats;
    const trend = data.metrics.trendsDirection;
    return `The threat landscape shows ${total} total threats with ${critical} critical and ${high} high severity threats. ` +
        `Overall trend is ${trend}. Continuous monitoring and proactive defense measures are recommended.`;
};
exports.summarizeThreatLandscape = summarizeThreatLandscape;
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
const createHighLevelVisualization = async (data) => {
    const vizData = {
        severityDistribution: {
            critical: data.metrics.criticalThreats,
            high: data.metrics.highThreats,
            medium: data.threats.filter(t => t.severity === 'medium').length,
            low: data.threats.filter(t => t.severity === 'low').length,
        },
        trendDirection: data.metrics.trendsDirection,
        totalThreats: data.metrics.totalThreats,
        totalIncidents: data.metrics.totalIncidents,
    };
    return JSON.stringify(vizData, null, 2);
};
exports.createHighLevelVisualization = createHighLevelVisualization;
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
const formatExecutiveInsights = (summary, format = 'markdown') => {
    if (format === 'markdown') {
        let output = '# Executive Insights\n\n';
        output += '## Key Findings\n';
        summary.keyFindings.forEach((finding, idx) => {
            output += `${idx + 1}. ${finding}\n`;
        });
        output += '\n## Threat Landscape\n';
        output += summary.threatLandscape + '\n\n';
        output += '## Recommendations\n';
        summary.recommendations.forEach((rec, idx) => {
            output += `${idx + 1}. ${rec}\n`;
        });
        return output;
    }
    else if (format === 'html') {
        let output = '<h1>Executive Insights</h1>';
        output += '<h2>Key Findings</h2><ol>';
        summary.keyFindings.forEach(finding => {
            output += `<li>${finding}</li>`;
        });
        output += '</ol>';
        return output;
    }
    else {
        let output = 'EXECUTIVE INSIGHTS\n\n';
        output += 'Key Findings:\n';
        summary.keyFindings.forEach((finding, idx) => {
            output += `  ${idx + 1}. ${finding}\n`;
        });
        return output;
    }
};
exports.formatExecutiveInsights = formatExecutiveInsights;
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
const prioritizeExecutiveFindings = (findings) => {
    const priorities = {
        critical: 4,
        high: 3,
        increasing: 3,
        breach: 4,
        incident: 3,
        vulnerability: 2,
    };
    return [...findings].sort((a, b) => {
        const scoreA = Object.keys(priorities).reduce((score, keyword) => {
            return a.toLowerCase().includes(keyword) ? score + priorities[keyword] : score;
        }, 0);
        const scoreB = Object.keys(priorities).reduce((score, keyword) => {
            return b.toLowerCase().includes(keyword) ? score + priorities[keyword] : score;
        }, 0);
        return scoreB - scoreA;
    });
};
exports.prioritizeExecutiveFindings = prioritizeExecutiveFindings;
// ============================================================================
// TECHNICAL REPORT CREATION
// ============================================================================
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
const generateTechnicalReport = async (data, includeEvidence = true) => {
    const analysis = await (0, exports.documentTechnicalDetails)(data);
    const indicators = data.indicators;
    const attackVectors = [...new Set(data.threats.map(t => t.category))];
    const mitigationSteps = [
        'Apply security patches immediately',
        'Update firewall rules to block identified IOCs',
        'Enhance monitoring for suspicious activity',
        'Conduct forensic analysis on affected systems',
    ];
    const evidence = includeEvidence ? [
        {
            type: 'log',
            description: 'Suspicious authentication attempts',
            timestamp: Date.now(),
            source: 'Auth logs',
            content: 'Multiple failed login attempts detected',
        },
    ] : [];
    return {
        detailedAnalysis: analysis,
        technicalIndicators: indicators,
        attackVectors,
        mitigationSteps,
        evidence,
        relatedIntelligence: [],
    };
};
exports.generateTechnicalReport = generateTechnicalReport;
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
const documentTechnicalDetails = async (data) => {
    let documentation = '## Technical Analysis\n\n';
    documentation += `### Overview\n`;
    documentation += `Total threats analyzed: ${data.metrics.totalThreats}\n`;
    documentation += `Critical severity: ${data.metrics.criticalThreats}\n`;
    documentation += `High severity: ${data.metrics.highThreats}\n\n`;
    documentation += `### Threat Breakdown\n`;
    data.threats.forEach(threat => {
        documentation += `- **${threat.name}** (${threat.severity})\n`;
        documentation += `  - Category: ${threat.category}\n`;
        documentation += `  - Status: ${threat.status}\n`;
        documentation += `  - Occurrences: ${threat.count}\n`;
    });
    return documentation;
};
exports.documentTechnicalDetails = documentTechnicalDetails;
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
const includeThreatIndicators = (indicators, report) => {
    return {
        ...report,
        technicalIndicators: [...report.technicalIndicators, ...indicators],
    };
};
exports.includeThreatIndicators = includeThreatIndicators;
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
const formatTechnicalAnalysis = (analysis, style = 'detailed') => {
    if (style === 'concise') {
        return analysis
            .split('\n')
            .filter(line => line.trim().length > 0)
            .slice(0, 10)
            .join('\n');
    }
    return analysis;
};
exports.formatTechnicalAnalysis = formatTechnicalAnalysis;
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
const appendTechnicalEvidence = (evidence, report) => {
    return {
        ...report,
        evidence: [...report.evidence, evidence],
    };
};
exports.appendTechnicalEvidence = appendTechnicalEvidence;
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
const linkRelatedTechnicalData = async (reportId, relatedReportIds) => {
    const links = relatedReportIds.map(id => `Related report: ${id} - See technical correlation analysis`);
    return links;
};
exports.linkRelatedTechnicalData = linkRelatedTechnicalData;
// ============================================================================
// IOC REPORT FORMATTING
// ============================================================================
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
const formatIOCReport = async (iocs, format) => {
    const byType = iocs.reduce((acc, ioc) => {
        acc[ioc.type] = (acc[ioc.type] || 0) + 1;
        return acc;
    }, {});
    const confidenceDistribution = iocs.reduce((acc, ioc) => {
        const bucket = ioc.confidence >= 0.8 ? 'high' :
            ioc.confidence >= 0.5 ? 'medium' : 'low';
        acc[bucket] = (acc[bucket] || 0) + 1;
        return acc;
    }, {});
    return {
        iocs,
        format,
        metadata: {
            totalCount: iocs.length,
            byType,
            confidenceDistribution,
        },
    };
};
exports.formatIOCReport = formatIOCReport;
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
const convertToSTIX = async (iocs) => {
    const objects = iocs.map((ioc, idx) => ({
        type: 'indicator',
        id: `indicator--${generateSTIXId(ioc.value)}`,
        created: new Date(ioc.firstSeen).toISOString(),
        modified: new Date(ioc.lastSeen).toISOString(),
        pattern: `[${ioc.type}:value = '${ioc.value}']`,
        pattern_type: 'stix',
        valid_from: new Date(ioc.firstSeen).toISOString(),
        labels: ioc.tags,
        confidence: Math.round(ioc.confidence * 100),
    }));
    return {
        type: 'bundle',
        id: `bundle--${Date.now()}`,
        objects,
        spec_version: '2.1',
    };
};
exports.convertToSTIX = convertToSTIX;
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
const exportAsJSON = (iocs, pretty = true) => {
    return JSON.stringify(iocs, null, pretty ? 2 : 0);
};
exports.exportAsJSON = exportAsJSON;
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
const generateIOCTable = (iocs) => {
    let table = '| Type | Value | Confidence | First Seen | Tags |\n';
    table += '|------|-------|------------|------------|------|\n';
    iocs.forEach(ioc => {
        const firstSeen = new Date(ioc.firstSeen).toISOString().split('T')[0];
        const tags = ioc.tags.join(', ');
        table += `| ${ioc.type} | ${ioc.value} | ${(ioc.confidence * 100).toFixed(0)}% | ${firstSeen} | ${tags} |\n`;
    });
    return table;
};
exports.generateIOCTable = generateIOCTable;
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
const enrichIOCMetadata = async (iocs) => {
    return iocs.map(ioc => ({
        ...ioc,
        // Additional enrichment could be added here
        // e.g., geolocation for IPs, WHOIS for domains
        tags: [...ioc.tags, 'enriched'],
    }));
};
exports.enrichIOCMetadata = enrichIOCMetadata;
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
const validateIOCStructure = (ioc) => {
    const errors = [];
    if (!['ip', 'domain', 'url', 'hash', 'email', 'file'].includes(ioc.type)) {
        errors.push('Invalid IOC type');
    }
    if (!ioc.value || typeof ioc.value !== 'string') {
        errors.push('IOC value required');
    }
    if (ioc.confidence < 0 || ioc.confidence > 1) {
        errors.push('Confidence must be between 0 and 1');
    }
    if (!ioc.firstSeen || !ioc.lastSeen) {
        errors.push('First seen and last seen timestamps required');
    }
    return {
        valid: errors.length === 0,
        errors,
    };
};
exports.validateIOCStructure = validateIOCStructure;
// ============================================================================
// REPORT SCHEDULING
// ============================================================================
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
const createReportSchedule = async (scheduleConfig) => {
    const schedule = {
        id: `SCH-${Date.now()}`,
        ...scheduleConfig,
        nextRun: calculateNextRunTime(scheduleConfig.frequency, scheduleConfig.cronExpression),
    };
    return schedule;
};
exports.createReportSchedule = createReportSchedule;
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
const updateScheduleFrequency = async (scheduleId, frequency, cronExpression) => {
    if (frequency === 'custom' && !cronExpression) {
        throw new Error('Cron expression required for custom frequency');
    }
    // Mock schedule update
    const schedule = {
        id: scheduleId,
        reportType: 'executive',
        frequency,
        cronExpression,
        enabled: true,
        nextRun: calculateNextRunTime(frequency, cronExpression),
        recipients: [],
        config: {},
    };
    return schedule;
};
exports.updateScheduleFrequency = updateScheduleFrequency;
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
const executeScheduledReport = async (scheduleId) => {
    // Load schedule
    console.log(`Executing scheduled report: ${scheduleId}`);
    // Generate report based on schedule config
    const config = {
        id: `RPT-${Date.now()}`,
        title: 'Scheduled Report',
        type: 'executive',
        timeRange: {
            start: Date.now() - 86400000,
            end: Date.now(),
        },
        format: 'pdf',
        confidentiality: 'internal',
    };
    const data = await collectReportData(config.timeRange);
    const report = await (0, exports.generateThreatReport)(config, data);
    return report;
};
exports.executeScheduledReport = executeScheduledReport;
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
const cancelScheduledReport = async (scheduleId) => {
    if (!scheduleId) {
        throw new Error('Schedule ID required');
    }
    console.log(`Cancelling schedule: ${scheduleId}`);
    return true;
};
exports.cancelScheduledReport = cancelScheduledReport;
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
const listActiveSchedules = async (enabledOnly = true) => {
    // Mock schedule data
    const allSchedules = [
        {
            id: 'SCH-001',
            reportType: 'executive',
            frequency: 'daily',
            enabled: true,
            nextRun: Date.now() + 86400000,
            recipients: ['exec@example.com'],
            config: {},
        },
        {
            id: 'SCH-002',
            reportType: 'technical',
            frequency: 'weekly',
            enabled: false,
            nextRun: Date.now() + 604800000,
            recipients: ['tech@example.com'],
            config: {},
        },
    ];
    if (enabledOnly) {
        return allSchedules.filter(s => s.enabled);
    }
    return allSchedules;
};
exports.listActiveSchedules = listActiveSchedules;
// ============================================================================
// REPORT DISTRIBUTION
// ============================================================================
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
const distributeReport = async (report, config) => {
    const results = [];
    for (const channel of config.channels) {
        for (const recipient of config.recipients) {
            try {
                const result = await sendToChannel(channel, recipient, report, config.options);
                results.push(result);
            }
            catch (error) {
                results.push({
                    success: false,
                    channel,
                    recipient: recipient.contact,
                    timestamp: Date.now(),
                    error: error instanceof Error ? error.message : 'Unknown error',
                });
            }
        }
    }
    return results;
};
exports.distributeReport = distributeReport;
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
const configureDistributionList = async (recipients) => {
    if (!recipients || recipients.length === 0) {
        throw new Error('At least one recipient required');
    }
    return {
        channels: ['email'],
        recipients,
        options: {
            compress: false,
            encrypt: false,
            attachments: true,
        },
    };
};
exports.configureDistributionList = configureDistributionList;
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
const sendReportNotification = async (reportId, recipients, message) => {
    if (!reportId || !recipients || recipients.length === 0) {
        throw new Error('Report ID and recipients required');
    }
    const notification = message || `New threat intelligence report available: ${reportId}`;
    console.log(`Sending notification to ${recipients.length} recipients: ${notification}`);
    return true;
};
exports.sendReportNotification = sendReportNotification;
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
const trackDistributionStatus = async (reportId) => {
    // Mock distribution history
    const history = [
        {
            success: true,
            channel: 'email',
            recipient: 'team@example.com',
            timestamp: Date.now() - 3600000,
            messageId: 'MSG-001',
        },
    ];
    return history;
};
exports.trackDistributionStatus = trackDistributionStatus;
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
const archiveDistributedReport = async (report, retentionDays = 90) => {
    const archive = {
        reportId: report.id,
        path: `/archives/reports/${report.id}.json`,
        size: report.size,
        createdAt: Date.now(),
        retentionDays,
        compressed: true,
        encrypted: report.config.confidentiality === 'restricted',
    };
    console.log(`Archiving report ${report.id} with ${retentionDays} days retention`);
    return archive;
};
exports.archiveDistributedReport = archiveDistributedReport;
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Calculates next run time for scheduled reports.
 */
function calculateNextRunTime(frequency, cronExpression) {
    const now = Date.now();
    switch (frequency) {
        case 'hourly':
            return now + 3600000;
        case 'daily':
            return now + 86400000;
        case 'weekly':
            return now + 604800000;
        case 'monthly':
            return now + 2592000000;
        case 'custom':
            // In production, parse cron expression
            return now + 86400000;
        default:
            return now + 86400000;
    }
}
/**
 * Collects report data for specified time range.
 */
async function collectReportData(timeRange) {
    // Mock data collection
    return {
        threats: [],
        incidents: [],
        indicators: [],
        metrics: {
            totalThreats: 0,
            criticalThreats: 0,
            highThreats: 0,
            totalIncidents: 0,
            totalIOCs: 0,
            trendsDirection: 'stable',
            averageSeverity: 0,
            responseTime: 0,
        },
        metadata: {
            generatedAt: Date.now(),
            generatedBy: 'System',
            version: '1.0.0',
            confidentiality: 'internal',
        },
    };
}
/**
 * Generates checksum for report content.
 */
function generateChecksum(content) {
    // Simple hash function for demonstration
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
        const char = content.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
}
/**
 * Generates STIX-compliant ID.
 */
function generateSTIXId(value) {
    const hash = generateChecksum(value);
    return `${hash}-${Date.now()}`;
}
/**
 * Sends report to specific channel.
 */
async function sendToChannel(channel, recipient, report, options) {
    // Mock channel sending
    console.log(`Sending report ${report.id} via ${channel} to ${recipient.contact}`);
    return {
        success: true,
        channel,
        recipient: recipient.contact,
        timestamp: Date.now(),
        messageId: `MSG-${Date.now()}`,
    };
}
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Automated report generation
    generateThreatReport: exports.generateThreatReport,
    scheduleReportGeneration: exports.scheduleReportGeneration,
    executeReportPipeline: exports.executeReportPipeline,
    validateReportData: exports.validateReportData,
    enrichReportContent: exports.enrichReportContent,
    compileReportSections: exports.compileReportSections,
    finalizeReport: exports.finalizeReport,
    // Templates
    loadReportTemplate: exports.loadReportTemplate,
    customizeTemplate: exports.customizeTemplate,
    applyTemplateVariables: exports.applyTemplateVariables,
    validateTemplateStructure: exports.validateTemplateStructure,
    mergeTemplateFragments: exports.mergeTemplateFragments,
    saveTemplatePreset: exports.saveTemplatePreset,
    listAvailableTemplates: exports.listAvailableTemplates,
    // Executive summary
    generateExecutiveSummary: exports.generateExecutiveSummary,
    extractKeyMetrics: exports.extractKeyMetrics,
    summarizeThreatLandscape: exports.summarizeThreatLandscape,
    createHighLevelVisualization: exports.createHighLevelVisualization,
    formatExecutiveInsights: exports.formatExecutiveInsights,
    prioritizeExecutiveFindings: exports.prioritizeExecutiveFindings,
    // Technical reports
    generateTechnicalReport: exports.generateTechnicalReport,
    documentTechnicalDetails: exports.documentTechnicalDetails,
    includeThreatIndicators: exports.includeThreatIndicators,
    formatTechnicalAnalysis: exports.formatTechnicalAnalysis,
    appendTechnicalEvidence: exports.appendTechnicalEvidence,
    linkRelatedTechnicalData: exports.linkRelatedTechnicalData,
    // IOC formatting
    formatIOCReport: exports.formatIOCReport,
    convertToSTIX: exports.convertToSTIX,
    exportAsJSON: exports.exportAsJSON,
    generateIOCTable: exports.generateIOCTable,
    enrichIOCMetadata: exports.enrichIOCMetadata,
    validateIOCStructure: exports.validateIOCStructure,
    // Scheduling
    createReportSchedule: exports.createReportSchedule,
    updateScheduleFrequency: exports.updateScheduleFrequency,
    executeScheduledReport: exports.executeScheduledReport,
    cancelScheduledReport: exports.cancelScheduledReport,
    listActiveSchedules: exports.listActiveSchedules,
    // Distribution
    distributeReport: exports.distributeReport,
    configureDistributionList: exports.configureDistributionList,
    sendReportNotification: exports.sendReportNotification,
    trackDistributionStatus: exports.trackDistributionStatus,
    archiveDistributedReport: exports.archiveDistributedReport,
};
//# sourceMappingURL=threat-reporting-kit.js.map