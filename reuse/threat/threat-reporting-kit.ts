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

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface ReportConfig {
  id: string;
  title: string;
  type: 'executive' | 'technical' | 'ioc' | 'comprehensive' | 'summary';
  timeRange: { start: number; end: number };
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
export const generateThreatReport = async (
  config: ReportConfig,
  data: ReportData,
): Promise<GeneratedReport> => {
  if (!config || !config.id || !config.title) {
    throw new Error('Invalid report configuration: id and title required');
  }

  if (!data || !data.threats || !data.metrics) {
    throw new Error('Invalid report data: threats and metrics required');
  }

  // Validate report data
  const validatedData = await validateReportData(data);

  // Enrich report content
  const enrichedData = await enrichReportContent(validatedData, config);

  // Compile report sections
  const sections = await compileReportSections(config, enrichedData);

  // Finalize report
  const finalReport = await finalizeReport(config, sections, enrichedData);

  return finalReport;
};

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
export const scheduleReportGeneration = async (
  schedule: ReportSchedule,
): Promise<ReportSchedule> => {
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
export const executeReportPipeline = async (
  reportId: string,
  config: ReportConfig,
): Promise<GeneratedReport> => {
  if (!reportId || typeof reportId !== 'string') {
    throw new Error('Valid report ID required');
  }

  try {
    // Step 1: Collect data
    const data = await collectReportData(config.timeRange);

    // Step 2: Validate data
    const validated = await validateReportData(data);

    // Step 3: Generate report
    const report = await generateThreatReport(config, validated);

    // Step 4: Post-processing
    if (config.format === 'pdf') {
      // PDF-specific processing would go here
      console.log('PDF generation completed');
    }

    return report;
  } catch (error) {
    throw new Error(`Report pipeline failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

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
export const validateReportData = async (
  data: ReportData,
): Promise<ReportData> => {
  const errors: string[] = [];

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
  const validatedData: ReportData = {
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
export const enrichReportContent = async (
  data: ReportData,
  config: ReportConfig,
): Promise<ReportData> => {
  const enriched = { ...data };

  // Enrich threats with additional context
  enriched.threats = data.threats.map(threat => ({
    ...threat,
    // Additional enrichment could be added here
  }));

  // Calculate additional metrics if requested
  if (config.includeMetrics) {
    const severityScores = { low: 1, medium: 2, high: 3, critical: 4 };
    const avgSeverity = data.threats.reduce(
      (sum, t) => sum + severityScores[t.severity],
      0
    ) / data.threats.length;

    enriched.metrics = {
      ...enriched.metrics,
      averageSeverity: avgSeverity,
    };
  }

  return enriched;
};

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
export const compileReportSections = async (
  config: ReportConfig,
  data: ReportData,
): Promise<string[]> => {
  const sections: string[] = [];

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
export const finalizeReport = async (
  config: ReportConfig,
  sections: string[],
  data: ReportData,
): Promise<GeneratedReport> => {
  const content = sections.join('\n');

  const metadata: ReportMetadata = {
    generatedAt: Date.now(),
    generatedBy: 'White Cross TI System',
    version: '1.0.0',
    confidentiality: config.confidentiality,
  };

  const report: GeneratedReport = {
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
export const loadReportTemplate = async (
  templateId: string,
): Promise<ReportTemplate> => {
  if (!templateId || typeof templateId !== 'string') {
    throw new Error('Valid template ID required');
  }

  // Mock template loading - in production, this would load from database
  const template: ReportTemplate = {
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
export const customizeTemplate = (
  template: ReportTemplate,
  customizations: Partial<ReportTemplate>,
): ReportTemplate => {
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
export const applyTemplateVariables = (
  template: ReportTemplate,
  variables: Record<string, unknown>,
): string => {
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
export const validateTemplateStructure = (
  template: ReportTemplate,
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

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
export const mergeTemplateFragments = (
  fragments: ReportTemplate[],
): ReportTemplate => {
  if (fragments.length === 0) {
    throw new Error('At least one template fragment required');
  }

  const baseTemplate = fragments[0];
  const mergedSections: TemplateSection[] = [];
  const mergedVariables: Record<string, unknown> = {};

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
export const saveTemplatePreset = async (
  template: ReportTemplate,
  presetName: string,
): Promise<string> => {
  const validation = validateTemplateStructure(template);

  if (!validation.valid) {
    throw new Error(`Invalid template: ${validation.errors.join(', ')}`);
  }

  const presetId = `PRESET-${Date.now()}`;

  // In production, save to database
  console.log(`Saving template preset: ${presetName} with ID: ${presetId}`);

  return presetId;
};

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
export const listAvailableTemplates = async (
  type?: ReportConfig['type'],
): Promise<Array<{ id: string; name: string; type: string }>> => {
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
export const generateExecutiveSummary = async (
  data: ReportData,
  maxFindings: number = 5,
): Promise<ExecutiveSummary> => {
  const keyFindings = await extractKeyMetrics(data, maxFindings);
  const landscape = await summarizeThreatLandscape(data);

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
export const extractKeyMetrics = async (
  data: ReportData,
  limit: number,
): Promise<string[]> => {
  const findings: string[] = [];

  if (data.metrics.criticalThreats > 0) {
    findings.push(`${data.metrics.criticalThreats} critical threat(s) detected`);
  }

  if (data.metrics.trendsDirection === 'increasing') {
    findings.push('Threat activity showing upward trend');
  } else if (data.metrics.trendsDirection === 'decreasing') {
    findings.push('Threat activity decreasing');
  }

  const topCategory = data.threats
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const topCat = Object.entries(topCategory).sort((a, b) => b[1] - a[1])[0];
  if (topCat) {
    findings.push(`${topCat[0]} threats are most prevalent (${topCat[1]} instances)`);
  }

  findings.push(`${data.metrics.totalIOCs} indicators of compromise identified`);

  return findings.slice(0, limit);
};

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
export const summarizeThreatLandscape = async (
  data: ReportData,
): Promise<string> => {
  const total = data.metrics.totalThreats;
  const critical = data.metrics.criticalThreats;
  const high = data.metrics.highThreats;
  const trend = data.metrics.trendsDirection;

  return `The threat landscape shows ${total} total threats with ${critical} critical and ${high} high severity threats. ` +
         `Overall trend is ${trend}. Continuous monitoring and proactive defense measures are recommended.`;
};

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
export const createHighLevelVisualization = async (
  data: ReportData,
): Promise<string> => {
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
export const formatExecutiveInsights = (
  summary: ExecutiveSummary,
  format: 'markdown' | 'html' | 'plain' = 'markdown',
): string => {
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
  } else if (format === 'html') {
    let output = '<h1>Executive Insights</h1>';
    output += '<h2>Key Findings</h2><ol>';
    summary.keyFindings.forEach(finding => {
      output += `<li>${finding}</li>`;
    });
    output += '</ol>';
    return output;
  } else {
    let output = 'EXECUTIVE INSIGHTS\n\n';
    output += 'Key Findings:\n';
    summary.keyFindings.forEach((finding, idx) => {
      output += `  ${idx + 1}. ${finding}\n`;
    });
    return output;
  }
};

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
export const prioritizeExecutiveFindings = (
  findings: string[],
): string[] => {
  const priorities: Record<string, number> = {
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
export const generateTechnicalReport = async (
  data: ReportData,
  includeEvidence: boolean = true,
): Promise<TechnicalReport> => {
  const analysis = await documentTechnicalDetails(data);
  const indicators = data.indicators;
  const attackVectors = [...new Set(data.threats.map(t => t.category))];

  const mitigationSteps = [
    'Apply security patches immediately',
    'Update firewall rules to block identified IOCs',
    'Enhance monitoring for suspicious activity',
    'Conduct forensic analysis on affected systems',
  ];

  const evidence: TechnicalEvidence[] = includeEvidence ? [
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
export const documentTechnicalDetails = async (
  data: ReportData,
): Promise<string> => {
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
export const includeThreatIndicators = (
  indicators: IOCData[],
  report: TechnicalReport,
): TechnicalReport => {
  return {
    ...report,
    technicalIndicators: [...report.technicalIndicators, ...indicators],
  };
};

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
export const formatTechnicalAnalysis = (
  analysis: string,
  style: 'detailed' | 'concise' = 'detailed',
): string => {
  if (style === 'concise') {
    return analysis
      .split('\n')
      .filter(line => line.trim().length > 0)
      .slice(0, 10)
      .join('\n');
  }

  return analysis;
};

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
export const appendTechnicalEvidence = (
  evidence: TechnicalEvidence,
  report: TechnicalReport,
): TechnicalReport => {
  return {
    ...report,
    evidence: [...report.evidence, evidence],
  };
};

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
export const linkRelatedTechnicalData = async (
  reportId: string,
  relatedReportIds: string[],
): Promise<string[]> => {
  const links = relatedReportIds.map(id => `Related report: ${id} - See technical correlation analysis`);
  return links;
};

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
export const formatIOCReport = async (
  iocs: IOCData[],
  format: 'json' | 'stix' | 'csv' | 'table',
): Promise<IOCReport> => {
  const byType = iocs.reduce((acc, ioc) => {
    acc[ioc.type] = (acc[ioc.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const confidenceDistribution = iocs.reduce((acc, ioc) => {
    const bucket = ioc.confidence >= 0.8 ? 'high' :
                   ioc.confidence >= 0.5 ? 'medium' : 'low';
    acc[bucket] = (acc[bucket] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

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
export const convertToSTIX = async (
  iocs: IOCData[],
): Promise<STIXBundle> => {
  const objects: STIXObject[] = iocs.map((ioc, idx) => ({
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
export const exportAsJSON = (
  iocs: IOCData[],
  pretty: boolean = true,
): string => {
  return JSON.stringify(iocs, null, pretty ? 2 : 0);
};

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
export const generateIOCTable = (
  iocs: IOCData[],
): string => {
  let table = '| Type | Value | Confidence | First Seen | Tags |\n';
  table += '|------|-------|------------|------------|------|\n';

  iocs.forEach(ioc => {
    const firstSeen = new Date(ioc.firstSeen).toISOString().split('T')[0];
    const tags = ioc.tags.join(', ');
    table += `| ${ioc.type} | ${ioc.value} | ${(ioc.confidence * 100).toFixed(0)}% | ${firstSeen} | ${tags} |\n`;
  });

  return table;
};

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
export const enrichIOCMetadata = async (
  iocs: IOCData[],
): Promise<IOCData[]> => {
  return iocs.map(ioc => ({
    ...ioc,
    // Additional enrichment could be added here
    // e.g., geolocation for IPs, WHOIS for domains
    tags: [...ioc.tags, 'enriched'],
  }));
};

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
export const validateIOCStructure = (
  ioc: IOCData,
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

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
export const createReportSchedule = async (
  scheduleConfig: Omit<ReportSchedule, 'id' | 'nextRun'>,
): Promise<ReportSchedule> => {
  const schedule: ReportSchedule = {
    id: `SCH-${Date.now()}`,
    ...scheduleConfig,
    nextRun: calculateNextRunTime(scheduleConfig.frequency, scheduleConfig.cronExpression),
  };

  return schedule;
};

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
export const updateScheduleFrequency = async (
  scheduleId: string,
  frequency: ReportSchedule['frequency'],
  cronExpression?: string,
): Promise<ReportSchedule> => {
  if (frequency === 'custom' && !cronExpression) {
    throw new Error('Cron expression required for custom frequency');
  }

  // Mock schedule update
  const schedule: ReportSchedule = {
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
export const executeScheduledReport = async (
  scheduleId: string,
): Promise<GeneratedReport> => {
  // Load schedule
  console.log(`Executing scheduled report: ${scheduleId}`);

  // Generate report based on schedule config
  const config: ReportConfig = {
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

  const data: ReportData = await collectReportData(config.timeRange);
  const report = await generateThreatReport(config, data);

  return report;
};

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
export const cancelScheduledReport = async (
  scheduleId: string,
): Promise<boolean> => {
  if (!scheduleId) {
    throw new Error('Schedule ID required');
  }

  console.log(`Cancelling schedule: ${scheduleId}`);
  return true;
};

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
export const listActiveSchedules = async (
  enabledOnly: boolean = true,
): Promise<ReportSchedule[]> => {
  // Mock schedule data
  const allSchedules: ReportSchedule[] = [
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
export const distributeReport = async (
  report: GeneratedReport,
  config: DistributionConfig,
): Promise<DistributionResult[]> => {
  const results: DistributionResult[] = [];

  for (const channel of config.channels) {
    for (const recipient of config.recipients) {
      try {
        const result = await sendToChannel(channel, recipient, report, config.options);
        results.push(result);
      } catch (error) {
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
export const configureDistributionList = async (
  recipients: DistributionRecipient[],
): Promise<DistributionConfig> => {
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
export const sendReportNotification = async (
  reportId: string,
  recipients: string[],
  message?: string,
): Promise<boolean> => {
  if (!reportId || !recipients || recipients.length === 0) {
    throw new Error('Report ID and recipients required');
  }

  const notification = message || `New threat intelligence report available: ${reportId}`;
  console.log(`Sending notification to ${recipients.length} recipients: ${notification}`);

  return true;
};

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
export const trackDistributionStatus = async (
  reportId: string,
): Promise<DistributionResult[]> => {
  // Mock distribution history
  const history: DistributionResult[] = [
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
export const archiveDistributedReport = async (
  report: GeneratedReport,
  retentionDays: number = 90,
): Promise<ReportArchive> => {
  const archive: ReportArchive = {
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

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Calculates next run time for scheduled reports.
 */
function calculateNextRunTime(
  frequency: ReportSchedule['frequency'],
  cronExpression?: string,
): number {
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
async function collectReportData(timeRange: { start: number; end: number }): Promise<ReportData> {
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
function generateChecksum(content: string): string {
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
function generateSTIXId(value: string): string {
  const hash = generateChecksum(value);
  return `${hash}-${Date.now()}`;
}

/**
 * Sends report to specific channel.
 */
async function sendToChannel(
  channel: string,
  recipient: DistributionRecipient,
  report: GeneratedReport,
  options: DistributionConfig['options'],
): Promise<DistributionResult> {
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

export default {
  // Automated report generation
  generateThreatReport,
  scheduleReportGeneration,
  executeReportPipeline,
  validateReportData,
  enrichReportContent,
  compileReportSections,
  finalizeReport,

  // Templates
  loadReportTemplate,
  customizeTemplate,
  applyTemplateVariables,
  validateTemplateStructure,
  mergeTemplateFragments,
  saveTemplatePreset,
  listAvailableTemplates,

  // Executive summary
  generateExecutiveSummary,
  extractKeyMetrics,
  summarizeThreatLandscape,
  createHighLevelVisualization,
  formatExecutiveInsights,
  prioritizeExecutiveFindings,

  // Technical reports
  generateTechnicalReport,
  documentTechnicalDetails,
  includeThreatIndicators,
  formatTechnicalAnalysis,
  appendTechnicalEvidence,
  linkRelatedTechnicalData,

  // IOC formatting
  formatIOCReport,
  convertToSTIX,
  exportAsJSON,
  generateIOCTable,
  enrichIOCMetadata,
  validateIOCStructure,

  // Scheduling
  createReportSchedule,
  updateScheduleFrequency,
  executeScheduledReport,
  cancelScheduledReport,
  listActiveSchedules,

  // Distribution
  distributeReport,
  configureDistributionList,
  sendReportNotification,
  trackDistributionStatus,
  archiveDistributedReport,
};
