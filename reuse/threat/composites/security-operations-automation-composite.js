"use strict";
/**
 * LOC: SOCAUTO001
 * File: /reuse/threat/composites/security-operations-automation-composite.ts
 *
 * UPSTREAM (imports from):
 *   - ../threat-intelligence-orchestration-kit
 *   - ../security-analytics-kit
 *   - ../devsecops-threat-integration-kit
 *   - ../threat-intelligence-automation-kit
 *   - ../threat-intelligence-collaboration-kit
 *   - ../security-awareness-training-kit
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - @nestjs/config
 *
 * DOWNSTREAM (imported by):
 *   - Security Operations Center (SOC) automation services
 *   - SOAR platform integrations
 *   - Automated threat response modules
 *   - Security orchestration workflows
 *   - DevSecOps security pipelines
 *   - Intelligence automation platforms
 */
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stagingConfig = exports.developmentConfig = exports.socAutomationConfig = exports.calculateSecurityCultureScore = exports.trackSecurityBehavior = exports.createPhishingSimulation = exports.createTrainingCampaign = exports.submitHuntingFinding = exports.createHuntingSession = exports.convertToSTIX = exports.sanitizeIntelligence = exports.shareIntelligence = exports.createCollaborationWorkspace = exports.createWorkflow = exports.executeAutomatedAction = exports.executeCorrelationRule = exports.createCorrelationRule = exports.executePipeline = exports.createEnrichmentPipeline = exports.executeIngestion = exports.registerIngestionSource = exports.generateComplianceAuditReport = exports.validateHIPAACompliance = exports.evaluateDeploymentSecurityGate = exports.detectExposedSecrets = exports.scanDependencyVulnerabilities = exports.scanSourceCodeVulnerabilities = exports.monitorPipelinesSecurity = exports.scanPipelineSecurity = exports.generateAnomalyReport = exports.detectMultivariateAnomalies = exports.detectStatisticalAnomalies = exports.identifyCorrelatedEvents = exports.calculateCorrelation = exports.forecastMetric = exports.analyzeTrend = exports.streamSecurityAnalytics = exports.aggregateSecurityMetrics = exports.executeAnalyticsQuery = exports.sendNotification = exports.scheduleTask = exports.executeToolAction = exports.registerSecurityTool = exports.executePlaybook = exports.createPlaybook = exports.cancelWorkflowExecution = exports.resumeWorkflowExecution = exports.pauseWorkflowExecution = exports.executeSOARWorkflow = exports.createSOARWorkflow = void 0;
exports.SOCAutomationController = exports.SOCAutomationConfigService = exports.getEnvironmentConfig = exports.productionConfig = void 0;
/**
 * File: /reuse/threat/composites/security-operations-automation-composite.ts
 * Locator: WC-SOC-AUTO-COMPOSITE-001
 * Purpose: Security Operations Center Automation Composite - Complete SOC workflow automation and integrated threat response
 *
 * Upstream: Threat Orchestration, Analytics, DevSecOps, Automation, Collaboration, Training Kits
 * Downstream: ../backend/*, SOC automation services, SOAR platforms, Incident response, Security workflows
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, @nestjs/config, sequelize
 * Exports: 47 specialized functions for SOC automation, workflow orchestration, automated response, and integrated security operations
 *
 * LLM Context: Enterprise-grade security operations center automation composite for White Cross healthcare platform.
 * Provides comprehensive SOC workflow automation, SOAR orchestration, automated threat ingestion and enrichment,
 * correlation and analysis, automated response actions, DevSecOps pipeline security, collaborative threat hunting,
 * security analytics and forecasting, compliance automation, security awareness integration, and multi-environment
 * configuration management. Production-ready with full NestJS controller integration, ConfigModule support, and
 * environment-based security settings for development, staging, and production healthcare security operations.
 */
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
// Import threat intelligence orchestration functions (11 functions)
const threat_intelligence_orchestration_kit_1 = require("../threat-intelligence-orchestration-kit");
Object.defineProperty(exports, "createSOARWorkflow", { enumerable: true, get: function () { return threat_intelligence_orchestration_kit_1.createSOARWorkflow; } });
Object.defineProperty(exports, "executeSOARWorkflow", { enumerable: true, get: function () { return threat_intelligence_orchestration_kit_1.executeSOARWorkflow; } });
Object.defineProperty(exports, "pauseWorkflowExecution", { enumerable: true, get: function () { return threat_intelligence_orchestration_kit_1.pauseWorkflowExecution; } });
Object.defineProperty(exports, "resumeWorkflowExecution", { enumerable: true, get: function () { return threat_intelligence_orchestration_kit_1.resumeWorkflowExecution; } });
Object.defineProperty(exports, "cancelWorkflowExecution", { enumerable: true, get: function () { return threat_intelligence_orchestration_kit_1.cancelWorkflowExecution; } });
Object.defineProperty(exports, "createPlaybook", { enumerable: true, get: function () { return threat_intelligence_orchestration_kit_1.createPlaybook; } });
Object.defineProperty(exports, "executePlaybook", { enumerable: true, get: function () { return threat_intelligence_orchestration_kit_1.executePlaybook; } });
Object.defineProperty(exports, "registerSecurityTool", { enumerable: true, get: function () { return threat_intelligence_orchestration_kit_1.registerSecurityTool; } });
Object.defineProperty(exports, "executeToolAction", { enumerable: true, get: function () { return threat_intelligence_orchestration_kit_1.executeToolAction; } });
Object.defineProperty(exports, "scheduleTask", { enumerable: true, get: function () { return threat_intelligence_orchestration_kit_1.scheduleTask; } });
Object.defineProperty(exports, "sendNotification", { enumerable: true, get: function () { return threat_intelligence_orchestration_kit_1.sendNotification; } });
// Import security analytics functions (10 functions)
const security_analytics_kit_1 = require("../security-analytics-kit");
Object.defineProperty(exports, "executeAnalyticsQuery", { enumerable: true, get: function () { return security_analytics_kit_1.executeAnalyticsQuery; } });
Object.defineProperty(exports, "aggregateSecurityMetrics", { enumerable: true, get: function () { return security_analytics_kit_1.aggregateSecurityMetrics; } });
Object.defineProperty(exports, "streamSecurityAnalytics", { enumerable: true, get: function () { return security_analytics_kit_1.streamSecurityAnalytics; } });
Object.defineProperty(exports, "analyzeTrend", { enumerable: true, get: function () { return security_analytics_kit_1.analyzeTrend; } });
Object.defineProperty(exports, "forecastMetric", { enumerable: true, get: function () { return security_analytics_kit_1.forecastMetric; } });
Object.defineProperty(exports, "calculateCorrelation", { enumerable: true, get: function () { return security_analytics_kit_1.calculateCorrelation; } });
Object.defineProperty(exports, "identifyCorrelatedEvents", { enumerable: true, get: function () { return security_analytics_kit_1.identifyCorrelatedEvents; } });
Object.defineProperty(exports, "detectStatisticalAnomalies", { enumerable: true, get: function () { return security_analytics_kit_1.detectStatisticalAnomalies; } });
Object.defineProperty(exports, "detectMultivariateAnomalies", { enumerable: true, get: function () { return security_analytics_kit_1.detectMultivariateAnomalies; } });
Object.defineProperty(exports, "generateAnomalyReport", { enumerable: true, get: function () { return security_analytics_kit_1.generateAnomalyReport; } });
// Import DevSecOps threat integration functions (8 functions)
const devsecops_threat_integration_kit_1 = require("../devsecops-threat-integration-kit");
Object.defineProperty(exports, "scanPipelineSecurity", { enumerable: true, get: function () { return devsecops_threat_integration_kit_1.scanPipelineSecurity; } });
Object.defineProperty(exports, "monitorPipelinesSecurity", { enumerable: true, get: function () { return devsecops_threat_integration_kit_1.monitorPipelinesSecurity; } });
Object.defineProperty(exports, "scanSourceCodeVulnerabilities", { enumerable: true, get: function () { return devsecops_threat_integration_kit_1.scanSourceCodeVulnerabilities; } });
Object.defineProperty(exports, "scanDependencyVulnerabilities", { enumerable: true, get: function () { return devsecops_threat_integration_kit_1.scanDependencyVulnerabilities; } });
Object.defineProperty(exports, "detectExposedSecrets", { enumerable: true, get: function () { return devsecops_threat_integration_kit_1.detectExposedSecrets; } });
Object.defineProperty(exports, "evaluateDeploymentSecurityGate", { enumerable: true, get: function () { return devsecops_threat_integration_kit_1.evaluateDeploymentSecurityGate; } });
Object.defineProperty(exports, "validateHIPAACompliance", { enumerable: true, get: function () { return devsecops_threat_integration_kit_1.validateHIPAACompliance; } });
Object.defineProperty(exports, "generateComplianceAuditReport", { enumerable: true, get: function () { return devsecops_threat_integration_kit_1.generateComplianceAuditReport; } });
// Import threat intelligence automation functions (8 functions)
const threat_intelligence_automation_kit_1 = require("../threat-intelligence-automation-kit");
Object.defineProperty(exports, "registerIngestionSource", { enumerable: true, get: function () { return threat_intelligence_automation_kit_1.registerIngestionSource; } });
Object.defineProperty(exports, "executeIngestion", { enumerable: true, get: function () { return threat_intelligence_automation_kit_1.executeIngestion; } });
Object.defineProperty(exports, "createEnrichmentPipeline", { enumerable: true, get: function () { return threat_intelligence_automation_kit_1.createEnrichmentPipeline; } });
Object.defineProperty(exports, "executePipeline", { enumerable: true, get: function () { return threat_intelligence_automation_kit_1.executePipeline; } });
Object.defineProperty(exports, "createCorrelationRule", { enumerable: true, get: function () { return threat_intelligence_automation_kit_1.createCorrelationRule; } });
Object.defineProperty(exports, "executeCorrelationRule", { enumerable: true, get: function () { return threat_intelligence_automation_kit_1.executeCorrelationRule; } });
Object.defineProperty(exports, "executeAutomatedAction", { enumerable: true, get: function () { return threat_intelligence_automation_kit_1.executeAutomatedAction; } });
Object.defineProperty(exports, "createWorkflow", { enumerable: true, get: function () { return threat_intelligence_automation_kit_1.createWorkflow; } });
// Import threat intelligence collaboration functions (6 functions)
const threat_intelligence_collaboration_kit_1 = require("../threat-intelligence-collaboration-kit");
Object.defineProperty(exports, "createCollaborationWorkspace", { enumerable: true, get: function () { return threat_intelligence_collaboration_kit_1.createCollaborationWorkspace; } });
Object.defineProperty(exports, "shareIntelligence", { enumerable: true, get: function () { return threat_intelligence_collaboration_kit_1.shareIntelligence; } });
Object.defineProperty(exports, "sanitizeIntelligence", { enumerable: true, get: function () { return threat_intelligence_collaboration_kit_1.sanitizeIntelligence; } });
Object.defineProperty(exports, "convertToSTIX", { enumerable: true, get: function () { return threat_intelligence_collaboration_kit_1.convertToSTIX; } });
Object.defineProperty(exports, "createHuntingSession", { enumerable: true, get: function () { return threat_intelligence_collaboration_kit_1.createHuntingSession; } });
Object.defineProperty(exports, "submitHuntingFinding", { enumerable: true, get: function () { return threat_intelligence_collaboration_kit_1.submitHuntingFinding; } });
// Import security awareness training functions (4 functions)
const security_awareness_training_kit_1 = require("../security-awareness-training-kit");
Object.defineProperty(exports, "createTrainingCampaign", { enumerable: true, get: function () { return security_awareness_training_kit_1.createTrainingCampaign; } });
Object.defineProperty(exports, "createPhishingSimulation", { enumerable: true, get: function () { return security_awareness_training_kit_1.createPhishingSimulation; } });
Object.defineProperty(exports, "trackSecurityBehavior", { enumerable: true, get: function () { return security_awareness_training_kit_1.trackSecurityBehavior; } });
Object.defineProperty(exports, "calculateSecurityCultureScore", { enumerable: true, get: function () { return security_awareness_training_kit_1.calculateSecurityCultureScore; } });
/**
 * Default configuration factory for SOC Automation
 */
const socAutomationConfig = () => ({
    environment: process.env.NODE_ENV || 'development',
    soar: {
        enabled: process.env.SOAR_ENABLED === 'true',
        maxConcurrentWorkflows: parseInt(process.env.SOAR_MAX_CONCURRENT || '10', 10),
        workflowTimeout: parseInt(process.env.SOAR_WORKFLOW_TIMEOUT || '300000', 10),
        retryAttempts: parseInt(process.env.SOAR_RETRY_ATTEMPTS || '3', 10),
        enableApprovalWorkflows: process.env.SOAR_ENABLE_APPROVALS === 'true',
    },
    analytics: {
        enabled: process.env.ANALYTICS_ENABLED !== 'false',
        streamingEnabled: process.env.ANALYTICS_STREAMING === 'true',
        anomalyDetectionThreshold: parseFloat(process.env.ANOMALY_THRESHOLD || '3.0'),
        correlationTimeWindow: parseInt(process.env.CORRELATION_WINDOW || '3600000', 10),
        forecastingPeriods: parseInt(process.env.FORECAST_PERIODS || '30', 10),
        dataRetentionDays: parseInt(process.env.DATA_RETENTION_DAYS || '365', 10),
    },
    devsecops: {
        enabled: process.env.DEVSECOPS_ENABLED !== 'false',
        pipelineScanningEnabled: process.env.PIPELINE_SCAN_ENABLED !== 'false',
        secretDetectionEnabled: process.env.SECRET_DETECTION_ENABLED !== 'false',
        severityThreshold: process.env.SEVERITY_THRESHOLD || 'MEDIUM',
        autoRemediation: process.env.AUTO_REMEDIATION === 'true',
        complianceFrameworks: (process.env.COMPLIANCE_FRAMEWORKS || 'HIPAA,SOC2').split(','),
    },
    threatAutomation: {
        enabled: process.env.THREAT_AUTOMATION_ENABLED !== 'false',
        autoIngestion: process.env.AUTO_INGESTION === 'true',
        ingestionInterval: parseInt(process.env.INGESTION_INTERVAL || '3600000', 10),
        autoEnrichment: process.env.AUTO_ENRICHMENT === 'true',
        enrichmentTimeout: parseInt(process.env.ENRICHMENT_TIMEOUT || '30000', 10),
        correlationEnabled: process.env.CORRELATION_ENABLED !== 'false',
        autoTagging: process.env.AUTO_TAGGING === 'true',
    },
    collaboration: {
        enabled: process.env.COLLABORATION_ENABLED !== 'false',
        workspacesEnabled: process.env.WORKSPACES_ENABLED === 'true',
        sharingEnabled: process.env.SHARING_ENABLED === 'true',
        stixExportEnabled: process.env.STIX_EXPORT_ENABLED === 'true',
        sanitizationLevel: process.env.SANITIZATION_LEVEL || 'MEDIUM',
        defaultTLP: process.env.DEFAULT_TLP || 'AMBER',
    },
    awareness: {
        enabled: process.env.AWARENESS_ENABLED !== 'false',
        phishingSimEnabled: process.env.PHISHING_SIM_ENABLED === 'true',
        trainingMandatory: process.env.TRAINING_MANDATORY === 'true',
        cultureScoringEnabled: process.env.CULTURE_SCORING_ENABLED === 'true',
        reportingEnabled: process.env.AWARENESS_REPORTING === 'true',
    },
    notifications: {
        enabled: process.env.NOTIFICATIONS_ENABLED !== 'false',
        channels: (process.env.NOTIFICATION_CHANNELS || 'email,slack').split(','),
        severityThresholds: {
            critical: process.env.NOTIFY_CRITICAL !== 'false',
            high: process.env.NOTIFY_HIGH !== 'false',
            medium: process.env.NOTIFY_MEDIUM === 'true',
            low: process.env.NOTIFY_LOW === 'true',
        },
        rateLimitPerHour: parseInt(process.env.NOTIFICATION_RATE_LIMIT || '100', 10),
    },
    integrations: {
        siem: {
            enabled: process.env.SIEM_ENABLED === 'true',
            endpoint: process.env.SIEM_ENDPOINT || '',
            apiKey: process.env.SIEM_API_KEY,
        },
        ticketing: {
            enabled: process.env.TICKETING_ENABLED === 'true',
            system: process.env.TICKETING_SYSTEM || 'jira',
            endpoint: process.env.TICKETING_ENDPOINT || '',
            apiKey: process.env.TICKETING_API_KEY,
        },
        threatIntel: {
            enabled: process.env.THREAT_INTEL_ENABLED === 'true',
            feeds: (process.env.THREAT_INTEL_FEEDS || '').split(',').filter(Boolean),
            apiKeys: JSON.parse(process.env.THREAT_INTEL_API_KEYS || '{}'),
        },
    },
    performance: {
        batchSize: parseInt(process.env.BATCH_SIZE || '100', 10),
        maxRetries: parseInt(process.env.MAX_RETRIES || '3', 10),
        timeoutMs: parseInt(process.env.TIMEOUT_MS || '30000', 10),
        cacheEnabled: process.env.CACHE_ENABLED !== 'false',
        cacheTTL: parseInt(process.env.CACHE_TTL || '3600', 10),
    },
    security: {
        encryptionEnabled: process.env.ENCRYPTION_ENABLED !== 'false',
        auditLoggingEnabled: process.env.AUDIT_LOGGING !== 'false',
        accessControlEnabled: process.env.ACCESS_CONTROL !== 'false',
        apiRateLimiting: process.env.API_RATE_LIMITING !== 'false',
        rateLimitPerMinute: parseInt(process.env.API_RATE_LIMIT || '1000', 10),
    },
});
exports.socAutomationConfig = socAutomationConfig;
// ============================================================================
// ENVIRONMENT-SPECIFIC CONFIGURATIONS
// ============================================================================
/**
 * Development environment configuration
 */
const developmentConfig = () => ({
    environment: 'development',
    soar: {
        enabled: true,
        maxConcurrentWorkflows: 5,
        workflowTimeout: 60000,
        retryAttempts: 2,
        enableApprovalWorkflows: false,
    },
    analytics: {
        enabled: true,
        streamingEnabled: false,
        anomalyDetectionThreshold: 2.5,
        correlationTimeWindow: 1800000,
        forecastingPeriods: 7,
        dataRetentionDays: 30,
    },
    devsecops: {
        enabled: true,
        pipelineScanningEnabled: true,
        secretDetectionEnabled: true,
        severityThreshold: 'LOW',
        autoRemediation: false,
        complianceFrameworks: ['HIPAA'],
    },
    security: {
        encryptionEnabled: false,
        auditLoggingEnabled: true,
        accessControlEnabled: false,
        apiRateLimiting: false,
        rateLimitPerMinute: 10000,
    },
});
exports.developmentConfig = developmentConfig;
/**
 * Staging environment configuration
 */
const stagingConfig = () => ({
    environment: 'staging',
    soar: {
        enabled: true,
        maxConcurrentWorkflows: 10,
        workflowTimeout: 180000,
        retryAttempts: 3,
        enableApprovalWorkflows: true,
    },
    analytics: {
        enabled: true,
        streamingEnabled: true,
        anomalyDetectionThreshold: 3.0,
        correlationTimeWindow: 3600000,
        forecastingPeriods: 30,
        dataRetentionDays: 90,
    },
    devsecops: {
        enabled: true,
        pipelineScanningEnabled: true,
        secretDetectionEnabled: true,
        severityThreshold: 'MEDIUM',
        autoRemediation: true,
        complianceFrameworks: ['HIPAA', 'SOC2'],
    },
    security: {
        encryptionEnabled: true,
        auditLoggingEnabled: true,
        accessControlEnabled: true,
        apiRateLimiting: true,
        rateLimitPerMinute: 5000,
    },
});
exports.stagingConfig = stagingConfig;
/**
 * Production environment configuration
 */
const productionConfig = () => ({
    environment: 'production',
    soar: {
        enabled: true,
        maxConcurrentWorkflows: 20,
        workflowTimeout: 300000,
        retryAttempts: 5,
        enableApprovalWorkflows: true,
    },
    analytics: {
        enabled: true,
        streamingEnabled: true,
        anomalyDetectionThreshold: 3.5,
        correlationTimeWindow: 7200000,
        forecastingPeriods: 90,
        dataRetentionDays: 365,
    },
    devsecops: {
        enabled: true,
        pipelineScanningEnabled: true,
        secretDetectionEnabled: true,
        severityThreshold: 'HIGH',
        autoRemediation: true,
        complianceFrameworks: ['HIPAA', 'SOC2', 'PCI_DSS'],
    },
    security: {
        encryptionEnabled: true,
        auditLoggingEnabled: true,
        accessControlEnabled: true,
        apiRateLimiting: true,
        rateLimitPerMinute: 1000,
    },
});
exports.productionConfig = productionConfig;
/**
 * Get configuration based on environment
 */
const getEnvironmentConfig = () => {
    const baseConfig = (0, exports.socAutomationConfig)();
    const env = process.env.NODE_ENV || 'development';
    switch (env) {
        case 'production':
            return { ...baseConfig, ...(0, exports.productionConfig)() };
        case 'staging':
            return { ...baseConfig, ...(0, exports.stagingConfig)() };
        case 'development':
        default:
            return { ...baseConfig, ...(0, exports.developmentConfig)() };
    }
};
exports.getEnvironmentConfig = getEnvironmentConfig;
// ============================================================================
// NESTJS CONFIGURATION SERVICE
// ============================================================================
/**
 * Injectable SOC Automation Configuration Service
 */
let SOCAutomationConfigService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var SOCAutomationConfigService = _classThis = class {
        constructor(configService) {
            this.configService = configService;
            this.logger = new common_1.Logger(SOCAutomationConfigService.name);
            this.config = (0, exports.getEnvironmentConfig)();
            this.logger.log(`SOC Automation initialized for ${this.config.environment} environment`);
        }
        /**
         * Get full configuration
         */
        getConfig() {
            return this.config;
        }
        /**
         * Get SOAR configuration
         */
        getSOARConfig() {
            return this.config.soar;
        }
        /**
         * Get Analytics configuration
         */
        getAnalyticsConfig() {
            return this.config.analytics;
        }
        /**
         * Get DevSecOps configuration
         */
        getDevSecOpsConfig() {
            return this.config.devsecops;
        }
        /**
         * Get Threat Automation configuration
         */
        getThreatAutomationConfig() {
            return this.config.threatAutomation;
        }
        /**
         * Get Collaboration configuration
         */
        getCollaborationConfig() {
            return this.config.collaboration;
        }
        /**
         * Get Security Awareness configuration
         */
        getAwarenessConfig() {
            return this.config.awareness;
        }
        /**
         * Get Notification configuration
         */
        getNotificationConfig() {
            return this.config.notifications;
        }
        /**
         * Get Integration configuration
         */
        getIntegrationConfig() {
            return this.config.integrations;
        }
        /**
         * Check if feature is enabled
         */
        isFeatureEnabled(feature) {
            const featureConfig = this.config[feature];
            return featureConfig?.enabled === true;
        }
        /**
         * Check if in production environment
         */
        isProduction() {
            return this.config.environment === 'production';
        }
        /**
         * Check if in development environment
         */
        isDevelopment() {
            return this.config.environment === 'development';
        }
        /**
         * Check if in staging environment
         */
        isStaging() {
            return this.config.environment === 'staging';
        }
    };
    __setFunctionName(_classThis, "SOCAutomationConfigService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SOCAutomationConfigService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SOCAutomationConfigService = _classThis;
})();
exports.SOCAutomationConfigService = SOCAutomationConfigService;
// ============================================================================
// NESTJS MODULE CONFIGURATION
// ============================================================================
/**
 * SOC Automation Module Configuration
 * Import this in your AppModule to enable SOC automation features
 *
 * @example
 * ```typescript
 * import { Module } from '@nestjs/common';
 * import { ConfigModule } from '@nestjs/config';
 * import { socAutomationConfig, SOCAutomationConfigService } from './composites/security-operations-automation-composite';
 *
 * @Module({
 *   imports: [
 *     ConfigModule.forRoot({
 *       load: [socAutomationConfig],
 *       isGlobal: true,
 *       cache: true,
 *       expandVariables: true,
 *       envFilePath: [
 *         `.env.${process.env.NODE_ENV}.local`,
 *         `.env.${process.env.NODE_ENV}`,
 *         '.env.local',
 *         '.env',
 *       ],
 *     }),
 *   ],
 *   providers: [SOCAutomationConfigService],
 *   exports: [SOCAutomationConfigService],
 * })
 * export class SOCAutomationModule {}
 * ```
 */
// ============================================================================
// ENVIRONMENT VARIABLES DOCUMENTATION
// ============================================================================
/**
 * Required Environment Variables for SOC Automation:
 *
 * # General
 * NODE_ENV=development|staging|production
 *
 * # SOAR Configuration
 * SOAR_ENABLED=true
 * SOAR_MAX_CONCURRENT=10
 * SOAR_WORKFLOW_TIMEOUT=300000
 * SOAR_RETRY_ATTEMPTS=3
 * SOAR_ENABLE_APPROVALS=true
 *
 * # Analytics Configuration
 * ANALYTICS_ENABLED=true
 * ANALYTICS_STREAMING=true
 * ANOMALY_THRESHOLD=3.0
 * CORRELATION_WINDOW=3600000
 * FORECAST_PERIODS=30
 * DATA_RETENTION_DAYS=365
 *
 * # DevSecOps Configuration
 * DEVSECOPS_ENABLED=true
 * PIPELINE_SCAN_ENABLED=true
 * SECRET_DETECTION_ENABLED=true
 * SEVERITY_THRESHOLD=MEDIUM
 * AUTO_REMEDIATION=true
 * COMPLIANCE_FRAMEWORKS=HIPAA,SOC2
 *
 * # Threat Automation
 * THREAT_AUTOMATION_ENABLED=true
 * AUTO_INGESTION=true
 * INGESTION_INTERVAL=3600000
 * AUTO_ENRICHMENT=true
 * ENRICHMENT_TIMEOUT=30000
 * CORRELATION_ENABLED=true
 * AUTO_TAGGING=true
 *
 * # Collaboration
 * COLLABORATION_ENABLED=true
 * WORKSPACES_ENABLED=true
 * SHARING_ENABLED=true
 * STIX_EXPORT_ENABLED=true
 * SANITIZATION_LEVEL=MEDIUM
 * DEFAULT_TLP=AMBER
 *
 * # Security Awareness
 * AWARENESS_ENABLED=true
 * PHISHING_SIM_ENABLED=true
 * TRAINING_MANDATORY=true
 * CULTURE_SCORING_ENABLED=true
 * AWARENESS_REPORTING=true
 *
 * # Notifications
 * NOTIFICATIONS_ENABLED=true
 * NOTIFICATION_CHANNELS=email,slack
 * NOTIFY_CRITICAL=true
 * NOTIFY_HIGH=true
 * NOTIFY_MEDIUM=false
 * NOTIFY_LOW=false
 * NOTIFICATION_RATE_LIMIT=100
 *
 * # Integrations
 * SIEM_ENABLED=true
 * SIEM_ENDPOINT=https://siem.example.com
 * SIEM_API_KEY=secret
 *
 * TICKETING_ENABLED=true
 * TICKETING_SYSTEM=jira
 * TICKETING_ENDPOINT=https://jira.example.com
 * TICKETING_API_KEY=secret
 *
 * THREAT_INTEL_ENABLED=true
 * THREAT_INTEL_FEEDS=feed1,feed2
 * THREAT_INTEL_API_KEYS={"feed1":"key1","feed2":"key2"}
 *
 * # Performance
 * BATCH_SIZE=100
 * MAX_RETRIES=3
 * TIMEOUT_MS=30000
 * CACHE_ENABLED=true
 * CACHE_TTL=3600
 *
 * # Security
 * ENCRYPTION_ENABLED=true
 * AUDIT_LOGGING=true
 * ACCESS_CONTROL=true
 * API_RATE_LIMITING=true
 * API_RATE_LIMIT=1000
 */
// ============================================================================
// NESTJS REST API CONTROLLER
// ============================================================================
/**
 * SOC Automation Operations Controller
 * Provides REST API endpoints for all SOC automation functions
 */
let SOCAutomationController = (() => {
    let _classDecorators = [(0, swagger_1.ApiTags)('SOC Automation'), (0, common_1.Controller)('api/v1/soc-automation'), (0, swagger_1.ApiBearerAuth)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _createWorkflow_decorators;
    let _executeWorkflow_decorators;
    let _pauseWorkflow_decorators;
    let _resumeWorkflow_decorators;
    let _cancelWorkflow_decorators;
    let _createSecurityPlaybook_decorators;
    let _executeSecurityPlaybook_decorators;
    let _registerTool_decorators;
    let _executeTool_decorators;
    let _scheduleAutomatedTask_decorators;
    let _sendSecurityNotification_decorators;
    let _executeQuery_decorators;
    let _aggregateMetrics_decorators;
    let _streamAnalytics_decorators;
    let _analyzeTrends_decorators;
    let _forecastMetrics_decorators;
    let _calculateMetricCorrelation_decorators;
    let _identifyCorrelations_decorators;
    let _detectStatistical_decorators;
    let _detectMultivariate_decorators;
    let _generateAnomaliesReport_decorators;
    let _scanPipeline_decorators;
    let _monitorPipelines_decorators;
    let _scanCode_decorators;
    let _scanDependencies_decorators;
    let _detectSecrets_decorators;
    let _evaluateGate_decorators;
    let _validateCompliance_decorators;
    let _generateAuditReport_decorators;
    let _registerIngestion_decorators;
    let _executeIngestionJob_decorators;
    let _createEnrichment_decorators;
    let _executeEnrichment_decorators;
    let _createCorrelation_decorators;
    let _executeCorrelation_decorators;
    let _executeAction_decorators;
    let _createThreatWorkflow_decorators;
    let _createWorkspace_decorators;
    let _shareIntel_decorators;
    let _sanitizeIntel_decorators;
    let _convertSTIX_decorators;
    let _createHunting_decorators;
    let _submitFinding_decorators;
    let _createCampaign_decorators;
    let _createPhishing_decorators;
    let _trackBehavior_decorators;
    let _calculateCulture_decorators;
    let _getConfiguration_decorators;
    let _getEnabledFeatures_decorators;
    let _healthCheck_decorators;
    var SOCAutomationController = _classThis = class {
        constructor(configService) {
            this.configService = (__runInitializers(this, _instanceExtraInitializers), configService);
            this.logger = new common_1.Logger(SOCAutomationController.name);
        }
        // ============================================================================
        // SOAR WORKFLOW OPERATIONS
        // ============================================================================
        async createWorkflow(workflowData) {
            if (!this.configService.getSOARConfig().enabled) {
                throw new common_1.BadRequestException('SOAR workflows are disabled in this environment');
            }
            return (0, threat_intelligence_orchestration_kit_1.createSOARWorkflow)(workflowData);
        }
        async executeWorkflow(workflowId, context) {
            return (0, threat_intelligence_orchestration_kit_1.executeSOARWorkflow)(workflowId, context);
        }
        async pauseWorkflow(executionId) {
            return (0, threat_intelligence_orchestration_kit_1.pauseWorkflowExecution)(executionId);
        }
        async resumeWorkflow(executionId) {
            return (0, threat_intelligence_orchestration_kit_1.resumeWorkflowExecution)(executionId);
        }
        async cancelWorkflow(executionId) {
            return (0, threat_intelligence_orchestration_kit_1.cancelWorkflowExecution)(executionId);
        }
        // ============================================================================
        // PLAYBOOK OPERATIONS
        // ============================================================================
        async createSecurityPlaybook(playbookData) {
            return (0, threat_intelligence_orchestration_kit_1.createPlaybook)(playbookData);
        }
        async executeSecurityPlaybook(playbookId, context) {
            return (0, threat_intelligence_orchestration_kit_1.executePlaybook)(playbookId, context);
        }
        // ============================================================================
        // SECURITY TOOL INTEGRATION
        // ============================================================================
        async registerTool(toolData) {
            return (0, threat_intelligence_orchestration_kit_1.registerSecurityTool)(toolData);
        }
        async executeTool(toolId, actionData) {
            return (0, threat_intelligence_orchestration_kit_1.executeToolAction)(toolId, actionData.action, actionData.params);
        }
        // ============================================================================
        // SCHEDULING OPERATIONS
        // ============================================================================
        async scheduleAutomatedTask(taskData) {
            return (0, threat_intelligence_orchestration_kit_1.scheduleTask)(taskData);
        }
        // ============================================================================
        // NOTIFICATION OPERATIONS
        // ============================================================================
        async sendSecurityNotification(notificationData) {
            const notifConfig = this.configService.getNotificationConfig();
            if (!notifConfig.enabled) {
                throw new common_1.BadRequestException('Notifications are disabled in this environment');
            }
            return (0, threat_intelligence_orchestration_kit_1.sendNotification)(notificationData);
        }
        // ============================================================================
        // ANALYTICS OPERATIONS
        // ============================================================================
        async executeQuery(queryData) {
            if (!this.configService.getAnalyticsConfig().enabled) {
                throw new common_1.BadRequestException('Analytics are disabled in this environment');
            }
            return (0, security_analytics_kit_1.executeAnalyticsQuery)(queryData.query, queryData.params);
        }
        async aggregateMetrics(aggregationData) {
            return (0, security_analytics_kit_1.aggregateSecurityMetrics)(aggregationData.metrics, aggregationData.dimensions, aggregationData.filters);
        }
        async streamAnalytics(streamName, windowSize = 60, aggregations) {
            if (!this.configService.getAnalyticsConfig().streamingEnabled) {
                throw new common_1.BadRequestException('Streaming analytics are disabled');
            }
            return (0, security_analytics_kit_1.streamSecurityAnalytics)(streamName, windowSize, aggregations.split(','));
        }
        async analyzeTrends(trendData) {
            return (0, security_analytics_kit_1.analyzeTrend)(trendData.metric, trendData.dataPoints);
        }
        async forecastMetrics(forecastData) {
            const periods = this.configService.getAnalyticsConfig().forecastingPeriods;
            return (0, security_analytics_kit_1.forecastMetric)(forecastData.metric, forecastData.historicalData, forecastData.periods || periods);
        }
        async calculateMetricCorrelation(correlationData) {
            return (0, security_analytics_kit_1.calculateCorrelation)(correlationData.metric1, correlationData.metric2, correlationData.data);
        }
        async identifyCorrelations(eventData) {
            return (0, security_analytics_kit_1.identifyCorrelatedEvents)(eventData.events, eventData.threshold);
        }
        async detectStatistical(anomalyData) {
            const threshold = this.configService.getAnalyticsConfig().anomalyDetectionThreshold;
            return (0, security_analytics_kit_1.detectStatisticalAnomalies)(anomalyData.data, anomalyData.threshold || threshold);
        }
        async detectMultivariate(anomalyData) {
            return (0, security_analytics_kit_1.detectMultivariateAnomalies)(anomalyData.data);
        }
        async generateAnomaliesReport(reportData) {
            return (0, security_analytics_kit_1.generateAnomalyReport)(reportData.anomalies, reportData.timeRange);
        }
        // ============================================================================
        // DEVSECOPS OPERATIONS
        // ============================================================================
        async scanPipeline(scanData) {
            if (!this.configService.getDevSecOpsConfig().pipelineScanningEnabled) {
                throw new common_1.BadRequestException('Pipeline scanning is disabled');
            }
            return (0, devsecops_threat_integration_kit_1.scanPipelineSecurity)(scanData.pipelineId, scanData.buildId, scanData.options);
        }
        async monitorPipelines(pipelineIds, startDate, endDate) {
            return (0, devsecops_threat_integration_kit_1.monitorPipelinesSecurity)(pipelineIds.split(','), {
                start: new Date(startDate),
                end: new Date(endDate),
            });
        }
        async scanCode(scanData) {
            return (0, devsecops_threat_integration_kit_1.scanSourceCodeVulnerabilities)(scanData.repository, scanData.branch, scanData.tool);
        }
        async scanDependencies(scanData) {
            return (0, devsecops_threat_integration_kit_1.scanDependencyVulnerabilities)(scanData.projectPath, scanData.packageManager);
        }
        async detectSecrets(secretData) {
            if (!this.configService.getDevSecOpsConfig().secretDetectionEnabled) {
                throw new common_1.BadRequestException('Secret detection is disabled');
            }
            return (0, devsecops_threat_integration_kit_1.detectExposedSecrets)(secretData.repository, secretData.tool);
        }
        async evaluateGate(gateData) {
            return (0, devsecops_threat_integration_kit_1.evaluateDeploymentSecurityGate)(gateData.buildId, gateData.environment, gateData.criteria);
        }
        async validateCompliance(complianceData) {
            if (!this.configService.getDevSecOpsConfig().complianceFrameworks.includes('HIPAA')) {
                throw new common_1.BadRequestException('HIPAA compliance validation is not configured');
            }
            return (0, devsecops_threat_integration_kit_1.validateHIPAACompliance)(complianceData.pipelineId, complianceData.buildId);
        }
        async generateAuditReport(reportData) {
            return (0, devsecops_threat_integration_kit_1.generateComplianceAuditReport)(reportData.validations);
        }
        // ============================================================================
        // THREAT INTELLIGENCE AUTOMATION
        // ============================================================================
        async registerIngestion(sourceData) {
            if (!this.configService.getThreatAutomationConfig().enabled) {
                throw new common_1.BadRequestException('Threat automation is disabled');
            }
            return (0, threat_intelligence_automation_kit_1.registerIngestionSource)(sourceData);
        }
        async executeIngestionJob(sourceId) {
            if (!this.configService.getThreatAutomationConfig().autoIngestion) {
                throw new common_1.BadRequestException('Auto ingestion is disabled');
            }
            return (0, threat_intelligence_automation_kit_1.executeIngestion)(sourceId);
        }
        async createEnrichment(pipelineData) {
            if (!this.configService.getThreatAutomationConfig().autoEnrichment) {
                throw new common_1.BadRequestException('Auto enrichment is disabled');
            }
            return (0, threat_intelligence_automation_kit_1.createEnrichmentPipeline)(pipelineData);
        }
        async executeEnrichment(pipelineId, inputData) {
            return (0, threat_intelligence_automation_kit_1.executePipeline)(pipelineId, inputData);
        }
        async createCorrelation(ruleData) {
            if (!this.configService.getThreatAutomationConfig().correlationEnabled) {
                throw new common_1.BadRequestException('Correlation is disabled');
            }
            return (0, threat_intelligence_automation_kit_1.createCorrelationRule)(ruleData);
        }
        async executeCorrelation(ruleId, eventData) {
            return (0, threat_intelligence_automation_kit_1.executeCorrelationRule)(ruleId, eventData.events);
        }
        async executeAction(actionData) {
            return (0, threat_intelligence_automation_kit_1.executeAutomatedAction)(actionData.action, actionData.context);
        }
        async createThreatWorkflow(workflowData) {
            return (0, threat_intelligence_automation_kit_1.createWorkflow)(workflowData);
        }
        // ============================================================================
        // COLLABORATION OPERATIONS
        // ============================================================================
        async createWorkspace(workspaceData) {
            if (!this.configService.getCollaborationConfig().workspacesEnabled) {
                throw new common_1.BadRequestException('Collaboration workspaces are disabled');
            }
            return (0, threat_intelligence_collaboration_kit_1.createCollaborationWorkspace)(workspaceData);
        }
        async shareIntel(shareData) {
            if (!this.configService.getCollaborationConfig().sharingEnabled) {
                throw new common_1.BadRequestException('Intelligence sharing is disabled');
            }
            return (0, threat_intelligence_collaboration_kit_1.shareIntelligence)(shareData.workspaceId, shareData.intelligence);
        }
        async sanitizeIntel(sanitizeData) {
            const sanitizationLevel = this.configService.getCollaborationConfig().sanitizationLevel;
            return (0, threat_intelligence_collaboration_kit_1.sanitizeIntelligence)(sanitizeData.intelligence, sanitizeData.level || sanitizationLevel);
        }
        async convertSTIX(convertData) {
            if (!this.configService.getCollaborationConfig().stixExportEnabled) {
                throw new common_1.BadRequestException('STIX export is disabled');
            }
            return (0, threat_intelligence_collaboration_kit_1.convertToSTIX)(convertData.intelligence);
        }
        async createHunting(sessionData) {
            return (0, threat_intelligence_collaboration_kit_1.createHuntingSession)(sessionData);
        }
        async submitFinding(sessionId, findingData) {
            return (0, threat_intelligence_collaboration_kit_1.submitHuntingFinding)(sessionId, findingData);
        }
        // ============================================================================
        // SECURITY AWARENESS OPERATIONS
        // ============================================================================
        async createCampaign(campaignData) {
            if (!this.configService.getAwarenessConfig().enabled) {
                throw new common_1.BadRequestException('Security awareness is disabled');
            }
            return (0, security_awareness_training_kit_1.createTrainingCampaign)(campaignData.model, campaignData.data);
        }
        async createPhishing(simData) {
            if (!this.configService.getAwarenessConfig().phishingSimEnabled) {
                throw new common_1.BadRequestException('Phishing simulations are disabled');
            }
            return (0, security_awareness_training_kit_1.createPhishingSimulation)(simData.model, simData.data);
        }
        async trackBehavior(behaviorData) {
            return (0, security_awareness_training_kit_1.trackSecurityBehavior)(behaviorData.model, behaviorData.data);
        }
        async calculateCulture(organizationId, period) {
            if (!this.configService.getAwarenessConfig().cultureScoringEnabled) {
                throw new common_1.BadRequestException('Culture scoring is disabled');
            }
            return (0, security_awareness_training_kit_1.calculateSecurityCultureScore)({}, organizationId, period);
        }
        // ============================================================================
        // CONFIGURATION OPERATIONS
        // ============================================================================
        async getConfiguration() {
            return this.configService.getConfig();
        }
        async getEnabledFeatures() {
            const config = this.configService.getConfig();
            return {
                environment: config.environment,
                enabledFeatures: {
                    soar: config.soar.enabled,
                    analytics: config.analytics.enabled,
                    devsecops: config.devsecops.enabled,
                    threatAutomation: config.threatAutomation.enabled,
                    collaboration: config.collaboration.enabled,
                    awareness: config.awareness.enabled,
                },
            };
        }
        async healthCheck() {
            return {
                status: 'healthy',
                timestamp: new Date().toISOString(),
                environment: this.configService.getConfig().environment,
                services: {
                    soar: this.configService.isFeatureEnabled('soar'),
                    analytics: this.configService.isFeatureEnabled('analytics'),
                    devsecops: this.configService.isFeatureEnabled('devsecops'),
                    threatAutomation: this.configService.isFeatureEnabled('threatAutomation'),
                    collaboration: this.configService.isFeatureEnabled('collaboration'),
                    awareness: this.configService.isFeatureEnabled('awareness'),
                },
            };
        }
    };
    __setFunctionName(_classThis, "SOCAutomationController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _createWorkflow_decorators = [(0, common_1.Post)('workflows'), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({ summary: 'Create a new SOAR workflow' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Workflow created successfully' })];
        _executeWorkflow_decorators = [(0, common_1.Post)('workflows/:workflowId/execute'), (0, swagger_1.ApiOperation)({ summary: 'Execute a SOAR workflow' }), (0, swagger_1.ApiParam)({ name: 'workflowId', description: 'Workflow identifier' })];
        _pauseWorkflow_decorators = [(0, common_1.Post)('workflows/:executionId/pause'), (0, swagger_1.ApiOperation)({ summary: 'Pause workflow execution' })];
        _resumeWorkflow_decorators = [(0, common_1.Post)('workflows/:executionId/resume'), (0, swagger_1.ApiOperation)({ summary: 'Resume workflow execution' })];
        _cancelWorkflow_decorators = [(0, common_1.Post)('workflows/:executionId/cancel'), (0, swagger_1.ApiOperation)({ summary: 'Cancel workflow execution' })];
        _createSecurityPlaybook_decorators = [(0, common_1.Post)('playbooks'), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({ summary: 'Create a security playbook' })];
        _executeSecurityPlaybook_decorators = [(0, common_1.Post)('playbooks/:playbookId/execute'), (0, swagger_1.ApiOperation)({ summary: 'Execute a security playbook' })];
        _registerTool_decorators = [(0, common_1.Post)('integrations/tools'), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({ summary: 'Register a security tool integration' })];
        _executeTool_decorators = [(0, common_1.Post)('integrations/tools/:toolId/actions'), (0, swagger_1.ApiOperation)({ summary: 'Execute action on integrated security tool' })];
        _scheduleAutomatedTask_decorators = [(0, common_1.Post)('tasks/schedule'), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({ summary: 'Schedule an automated task' })];
        _sendSecurityNotification_decorators = [(0, common_1.Post)('notifications'), (0, swagger_1.ApiOperation)({ summary: 'Send security notification' })];
        _executeQuery_decorators = [(0, common_1.Post)('analytics/query'), (0, swagger_1.ApiOperation)({ summary: 'Execute security analytics query' })];
        _aggregateMetrics_decorators = [(0, common_1.Post)('analytics/aggregate'), (0, swagger_1.ApiOperation)({ summary: 'Aggregate security metrics' })];
        _streamAnalytics_decorators = [(0, common_1.Get)('analytics/stream/:streamName'), (0, swagger_1.ApiOperation)({ summary: 'Stream security analytics data' }), (0, swagger_1.ApiParam)({ name: 'streamName', description: 'Stream name' })];
        _analyzeTrends_decorators = [(0, common_1.Post)('analytics/trend'), (0, swagger_1.ApiOperation)({ summary: 'Analyze security metric trends' })];
        _forecastMetrics_decorators = [(0, common_1.Post)('analytics/forecast'), (0, swagger_1.ApiOperation)({ summary: 'Forecast security metrics' })];
        _calculateMetricCorrelation_decorators = [(0, common_1.Post)('analytics/correlation'), (0, swagger_1.ApiOperation)({ summary: 'Calculate metric correlation' })];
        _identifyCorrelations_decorators = [(0, common_1.Post)('analytics/correlated-events'), (0, swagger_1.ApiOperation)({ summary: 'Identify correlated security events' })];
        _detectStatistical_decorators = [(0, common_1.Post)('analytics/anomalies/statistical'), (0, swagger_1.ApiOperation)({ summary: 'Detect statistical anomalies' })];
        _detectMultivariate_decorators = [(0, common_1.Post)('analytics/anomalies/multivariate'), (0, swagger_1.ApiOperation)({ summary: 'Detect multivariate anomalies' })];
        _generateAnomaliesReport_decorators = [(0, common_1.Post)('analytics/anomalies/report'), (0, swagger_1.ApiOperation)({ summary: 'Generate anomaly detection report' })];
        _scanPipeline_decorators = [(0, common_1.Post)('devsecops/pipeline/scan'), (0, swagger_1.ApiOperation)({ summary: 'Scan CI/CD pipeline for security threats' })];
        _monitorPipelines_decorators = [(0, common_1.Get)('devsecops/pipelines/monitor'), (0, swagger_1.ApiOperation)({ summary: 'Monitor multiple pipelines for security' }), (0, swagger_1.ApiQuery)({ name: 'pipelineIds', description: 'Comma-separated pipeline IDs' })];
        _scanCode_decorators = [(0, common_1.Post)('devsecops/code/scan'), (0, swagger_1.ApiOperation)({ summary: 'Scan source code for vulnerabilities' })];
        _scanDependencies_decorators = [(0, common_1.Post)('devsecops/dependencies/scan'), (0, swagger_1.ApiOperation)({ summary: 'Scan dependencies for vulnerabilities' })];
        _detectSecrets_decorators = [(0, common_1.Post)('devsecops/secrets/detect'), (0, swagger_1.ApiOperation)({ summary: 'Detect exposed secrets in code' })];
        _evaluateGate_decorators = [(0, common_1.Post)('devsecops/deployment/gate'), (0, swagger_1.ApiOperation)({ summary: 'Evaluate deployment security gate' })];
        _validateCompliance_decorators = [(0, common_1.Post)('devsecops/compliance/hipaa'), (0, swagger_1.ApiOperation)({ summary: 'Validate HIPAA compliance in pipeline' })];
        _generateAuditReport_decorators = [(0, common_1.Post)('devsecops/compliance/audit-report'), (0, swagger_1.ApiOperation)({ summary: 'Generate compliance audit report' })];
        _registerIngestion_decorators = [(0, common_1.Post)('threat-intel/ingestion/register'), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({ summary: 'Register threat intelligence ingestion source' })];
        _executeIngestionJob_decorators = [(0, common_1.Post)('threat-intel/ingestion/:sourceId/execute'), (0, swagger_1.ApiOperation)({ summary: 'Execute threat intelligence ingestion' })];
        _createEnrichment_decorators = [(0, common_1.Post)('threat-intel/enrichment/pipeline'), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({ summary: 'Create enrichment pipeline' })];
        _executeEnrichment_decorators = [(0, common_1.Post)('threat-intel/enrichment/:pipelineId/execute'), (0, swagger_1.ApiOperation)({ summary: 'Execute enrichment pipeline' })];
        _createCorrelation_decorators = [(0, common_1.Post)('threat-intel/correlation/rule'), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({ summary: 'Create correlation rule' })];
        _executeCorrelation_decorators = [(0, common_1.Post)('threat-intel/correlation/:ruleId/execute'), (0, swagger_1.ApiOperation)({ summary: 'Execute correlation rule' })];
        _executeAction_decorators = [(0, common_1.Post)('threat-intel/actions/execute'), (0, swagger_1.ApiOperation)({ summary: 'Execute automated threat response action' })];
        _createThreatWorkflow_decorators = [(0, common_1.Post)('threat-intel/workflows'), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({ summary: 'Create threat intelligence workflow' })];
        _createWorkspace_decorators = [(0, common_1.Post)('collaboration/workspaces'), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({ summary: 'Create collaboration workspace' })];
        _shareIntel_decorators = [(0, common_1.Post)('collaboration/intelligence/share'), (0, swagger_1.ApiOperation)({ summary: 'Share threat intelligence' })];
        _sanitizeIntel_decorators = [(0, common_1.Post)('collaboration/intelligence/sanitize'), (0, swagger_1.ApiOperation)({ summary: 'Sanitize intelligence before sharing' })];
        _convertSTIX_decorators = [(0, common_1.Post)('collaboration/intelligence/stix'), (0, swagger_1.ApiOperation)({ summary: 'Convert intelligence to STIX format' })];
        _createHunting_decorators = [(0, common_1.Post)('collaboration/hunting/session'), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({ summary: 'Create collaborative threat hunting session' })];
        _submitFinding_decorators = [(0, common_1.Post)('collaboration/hunting/:sessionId/finding'), (0, swagger_1.ApiOperation)({ summary: 'Submit hunting finding' })];
        _createCampaign_decorators = [(0, common_1.Post)('awareness/campaigns'), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({ summary: 'Create security awareness training campaign' })];
        _createPhishing_decorators = [(0, common_1.Post)('awareness/phishing/simulation'), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({ summary: 'Create phishing simulation' })];
        _trackBehavior_decorators = [(0, common_1.Post)('awareness/behavior/track'), (0, swagger_1.ApiOperation)({ summary: 'Track security behavior event' })];
        _calculateCulture_decorators = [(0, common_1.Get)('awareness/culture/score'), (0, swagger_1.ApiOperation)({ summary: 'Calculate organization security culture score' }), (0, swagger_1.ApiQuery)({ name: 'organizationId', description: 'Organization identifier' }), (0, swagger_1.ApiQuery)({ name: 'period', description: 'Time period for calculation' })];
        _getConfiguration_decorators = [(0, common_1.Get)('config'), (0, swagger_1.ApiOperation)({ summary: 'Get SOC automation configuration' })];
        _getEnabledFeatures_decorators = [(0, common_1.Get)('config/features'), (0, swagger_1.ApiOperation)({ summary: 'Get enabled features' })];
        _healthCheck_decorators = [(0, common_1.Get)('health'), (0, swagger_1.ApiOperation)({ summary: 'Health check for SOC automation services' })];
        __esDecorate(_classThis, null, _createWorkflow_decorators, { kind: "method", name: "createWorkflow", static: false, private: false, access: { has: obj => "createWorkflow" in obj, get: obj => obj.createWorkflow }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _executeWorkflow_decorators, { kind: "method", name: "executeWorkflow", static: false, private: false, access: { has: obj => "executeWorkflow" in obj, get: obj => obj.executeWorkflow }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _pauseWorkflow_decorators, { kind: "method", name: "pauseWorkflow", static: false, private: false, access: { has: obj => "pauseWorkflow" in obj, get: obj => obj.pauseWorkflow }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _resumeWorkflow_decorators, { kind: "method", name: "resumeWorkflow", static: false, private: false, access: { has: obj => "resumeWorkflow" in obj, get: obj => obj.resumeWorkflow }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _cancelWorkflow_decorators, { kind: "method", name: "cancelWorkflow", static: false, private: false, access: { has: obj => "cancelWorkflow" in obj, get: obj => obj.cancelWorkflow }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createSecurityPlaybook_decorators, { kind: "method", name: "createSecurityPlaybook", static: false, private: false, access: { has: obj => "createSecurityPlaybook" in obj, get: obj => obj.createSecurityPlaybook }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _executeSecurityPlaybook_decorators, { kind: "method", name: "executeSecurityPlaybook", static: false, private: false, access: { has: obj => "executeSecurityPlaybook" in obj, get: obj => obj.executeSecurityPlaybook }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _registerTool_decorators, { kind: "method", name: "registerTool", static: false, private: false, access: { has: obj => "registerTool" in obj, get: obj => obj.registerTool }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _executeTool_decorators, { kind: "method", name: "executeTool", static: false, private: false, access: { has: obj => "executeTool" in obj, get: obj => obj.executeTool }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _scheduleAutomatedTask_decorators, { kind: "method", name: "scheduleAutomatedTask", static: false, private: false, access: { has: obj => "scheduleAutomatedTask" in obj, get: obj => obj.scheduleAutomatedTask }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _sendSecurityNotification_decorators, { kind: "method", name: "sendSecurityNotification", static: false, private: false, access: { has: obj => "sendSecurityNotification" in obj, get: obj => obj.sendSecurityNotification }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _executeQuery_decorators, { kind: "method", name: "executeQuery", static: false, private: false, access: { has: obj => "executeQuery" in obj, get: obj => obj.executeQuery }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _aggregateMetrics_decorators, { kind: "method", name: "aggregateMetrics", static: false, private: false, access: { has: obj => "aggregateMetrics" in obj, get: obj => obj.aggregateMetrics }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _streamAnalytics_decorators, { kind: "method", name: "streamAnalytics", static: false, private: false, access: { has: obj => "streamAnalytics" in obj, get: obj => obj.streamAnalytics }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _analyzeTrends_decorators, { kind: "method", name: "analyzeTrends", static: false, private: false, access: { has: obj => "analyzeTrends" in obj, get: obj => obj.analyzeTrends }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _forecastMetrics_decorators, { kind: "method", name: "forecastMetrics", static: false, private: false, access: { has: obj => "forecastMetrics" in obj, get: obj => obj.forecastMetrics }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _calculateMetricCorrelation_decorators, { kind: "method", name: "calculateMetricCorrelation", static: false, private: false, access: { has: obj => "calculateMetricCorrelation" in obj, get: obj => obj.calculateMetricCorrelation }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _identifyCorrelations_decorators, { kind: "method", name: "identifyCorrelations", static: false, private: false, access: { has: obj => "identifyCorrelations" in obj, get: obj => obj.identifyCorrelations }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _detectStatistical_decorators, { kind: "method", name: "detectStatistical", static: false, private: false, access: { has: obj => "detectStatistical" in obj, get: obj => obj.detectStatistical }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _detectMultivariate_decorators, { kind: "method", name: "detectMultivariate", static: false, private: false, access: { has: obj => "detectMultivariate" in obj, get: obj => obj.detectMultivariate }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _generateAnomaliesReport_decorators, { kind: "method", name: "generateAnomaliesReport", static: false, private: false, access: { has: obj => "generateAnomaliesReport" in obj, get: obj => obj.generateAnomaliesReport }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _scanPipeline_decorators, { kind: "method", name: "scanPipeline", static: false, private: false, access: { has: obj => "scanPipeline" in obj, get: obj => obj.scanPipeline }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _monitorPipelines_decorators, { kind: "method", name: "monitorPipelines", static: false, private: false, access: { has: obj => "monitorPipelines" in obj, get: obj => obj.monitorPipelines }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _scanCode_decorators, { kind: "method", name: "scanCode", static: false, private: false, access: { has: obj => "scanCode" in obj, get: obj => obj.scanCode }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _scanDependencies_decorators, { kind: "method", name: "scanDependencies", static: false, private: false, access: { has: obj => "scanDependencies" in obj, get: obj => obj.scanDependencies }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _detectSecrets_decorators, { kind: "method", name: "detectSecrets", static: false, private: false, access: { has: obj => "detectSecrets" in obj, get: obj => obj.detectSecrets }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _evaluateGate_decorators, { kind: "method", name: "evaluateGate", static: false, private: false, access: { has: obj => "evaluateGate" in obj, get: obj => obj.evaluateGate }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _validateCompliance_decorators, { kind: "method", name: "validateCompliance", static: false, private: false, access: { has: obj => "validateCompliance" in obj, get: obj => obj.validateCompliance }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _generateAuditReport_decorators, { kind: "method", name: "generateAuditReport", static: false, private: false, access: { has: obj => "generateAuditReport" in obj, get: obj => obj.generateAuditReport }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _registerIngestion_decorators, { kind: "method", name: "registerIngestion", static: false, private: false, access: { has: obj => "registerIngestion" in obj, get: obj => obj.registerIngestion }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _executeIngestionJob_decorators, { kind: "method", name: "executeIngestionJob", static: false, private: false, access: { has: obj => "executeIngestionJob" in obj, get: obj => obj.executeIngestionJob }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createEnrichment_decorators, { kind: "method", name: "createEnrichment", static: false, private: false, access: { has: obj => "createEnrichment" in obj, get: obj => obj.createEnrichment }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _executeEnrichment_decorators, { kind: "method", name: "executeEnrichment", static: false, private: false, access: { has: obj => "executeEnrichment" in obj, get: obj => obj.executeEnrichment }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createCorrelation_decorators, { kind: "method", name: "createCorrelation", static: false, private: false, access: { has: obj => "createCorrelation" in obj, get: obj => obj.createCorrelation }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _executeCorrelation_decorators, { kind: "method", name: "executeCorrelation", static: false, private: false, access: { has: obj => "executeCorrelation" in obj, get: obj => obj.executeCorrelation }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _executeAction_decorators, { kind: "method", name: "executeAction", static: false, private: false, access: { has: obj => "executeAction" in obj, get: obj => obj.executeAction }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createThreatWorkflow_decorators, { kind: "method", name: "createThreatWorkflow", static: false, private: false, access: { has: obj => "createThreatWorkflow" in obj, get: obj => obj.createThreatWorkflow }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createWorkspace_decorators, { kind: "method", name: "createWorkspace", static: false, private: false, access: { has: obj => "createWorkspace" in obj, get: obj => obj.createWorkspace }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _shareIntel_decorators, { kind: "method", name: "shareIntel", static: false, private: false, access: { has: obj => "shareIntel" in obj, get: obj => obj.shareIntel }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _sanitizeIntel_decorators, { kind: "method", name: "sanitizeIntel", static: false, private: false, access: { has: obj => "sanitizeIntel" in obj, get: obj => obj.sanitizeIntel }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _convertSTIX_decorators, { kind: "method", name: "convertSTIX", static: false, private: false, access: { has: obj => "convertSTIX" in obj, get: obj => obj.convertSTIX }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createHunting_decorators, { kind: "method", name: "createHunting", static: false, private: false, access: { has: obj => "createHunting" in obj, get: obj => obj.createHunting }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _submitFinding_decorators, { kind: "method", name: "submitFinding", static: false, private: false, access: { has: obj => "submitFinding" in obj, get: obj => obj.submitFinding }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createCampaign_decorators, { kind: "method", name: "createCampaign", static: false, private: false, access: { has: obj => "createCampaign" in obj, get: obj => obj.createCampaign }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createPhishing_decorators, { kind: "method", name: "createPhishing", static: false, private: false, access: { has: obj => "createPhishing" in obj, get: obj => obj.createPhishing }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _trackBehavior_decorators, { kind: "method", name: "trackBehavior", static: false, private: false, access: { has: obj => "trackBehavior" in obj, get: obj => obj.trackBehavior }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _calculateCulture_decorators, { kind: "method", name: "calculateCulture", static: false, private: false, access: { has: obj => "calculateCulture" in obj, get: obj => obj.calculateCulture }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getConfiguration_decorators, { kind: "method", name: "getConfiguration", static: false, private: false, access: { has: obj => "getConfiguration" in obj, get: obj => obj.getConfiguration }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getEnabledFeatures_decorators, { kind: "method", name: "getEnabledFeatures", static: false, private: false, access: { has: obj => "getEnabledFeatures" in obj, get: obj => obj.getEnabledFeatures }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _healthCheck_decorators, { kind: "method", name: "healthCheck", static: false, private: false, access: { has: obj => "healthCheck" in obj, get: obj => obj.healthCheck }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SOCAutomationController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SOCAutomationController = _classThis;
})();
exports.SOCAutomationController = SOCAutomationController;
// ============================================================================
// DEFAULT EXPORT
// ============================================================================
exports.default = {
    // Configuration
    socAutomationConfig: exports.socAutomationConfig,
    developmentConfig: exports.developmentConfig,
    stagingConfig: exports.stagingConfig,
    productionConfig: exports.productionConfig,
    getEnvironmentConfig: exports.getEnvironmentConfig,
    SOCAutomationConfigService,
    SOCAutomationController,
    // Threat Intelligence Orchestration (11 functions)
    createSOARWorkflow: threat_intelligence_orchestration_kit_1.createSOARWorkflow,
    executeSOARWorkflow: threat_intelligence_orchestration_kit_1.executeSOARWorkflow,
    pauseWorkflowExecution: threat_intelligence_orchestration_kit_1.pauseWorkflowExecution,
    resumeWorkflowExecution: threat_intelligence_orchestration_kit_1.resumeWorkflowExecution,
    cancelWorkflowExecution: threat_intelligence_orchestration_kit_1.cancelWorkflowExecution,
    createPlaybook: threat_intelligence_orchestration_kit_1.createPlaybook,
    executePlaybook: threat_intelligence_orchestration_kit_1.executePlaybook,
    registerSecurityTool: threat_intelligence_orchestration_kit_1.registerSecurityTool,
    executeToolAction: threat_intelligence_orchestration_kit_1.executeToolAction,
    scheduleTask: threat_intelligence_orchestration_kit_1.scheduleTask,
    sendNotification: threat_intelligence_orchestration_kit_1.sendNotification,
    // Security Analytics (10 functions)
    executeAnalyticsQuery: security_analytics_kit_1.executeAnalyticsQuery,
    aggregateSecurityMetrics: security_analytics_kit_1.aggregateSecurityMetrics,
    streamSecurityAnalytics: security_analytics_kit_1.streamSecurityAnalytics,
    analyzeTrend: security_analytics_kit_1.analyzeTrend,
    forecastMetric: security_analytics_kit_1.forecastMetric,
    calculateCorrelation: security_analytics_kit_1.calculateCorrelation,
    identifyCorrelatedEvents: security_analytics_kit_1.identifyCorrelatedEvents,
    detectStatisticalAnomalies: security_analytics_kit_1.detectStatisticalAnomalies,
    detectMultivariateAnomalies: security_analytics_kit_1.detectMultivariateAnomalies,
    generateAnomalyReport: security_analytics_kit_1.generateAnomalyReport,
    // DevSecOps Threat Integration (8 functions)
    scanPipelineSecurity: devsecops_threat_integration_kit_1.scanPipelineSecurity,
    monitorPipelinesSecurity: devsecops_threat_integration_kit_1.monitorPipelinesSecurity,
    scanSourceCodeVulnerabilities: devsecops_threat_integration_kit_1.scanSourceCodeVulnerabilities,
    scanDependencyVulnerabilities: devsecops_threat_integration_kit_1.scanDependencyVulnerabilities,
    detectExposedSecrets: devsecops_threat_integration_kit_1.detectExposedSecrets,
    evaluateDeploymentSecurityGate: devsecops_threat_integration_kit_1.evaluateDeploymentSecurityGate,
    validateHIPAACompliance: devsecops_threat_integration_kit_1.validateHIPAACompliance,
    generateComplianceAuditReport: devsecops_threat_integration_kit_1.generateComplianceAuditReport,
    // Threat Intelligence Automation (8 functions)
    registerIngestionSource: threat_intelligence_automation_kit_1.registerIngestionSource,
    executeIngestion: threat_intelligence_automation_kit_1.executeIngestion,
    createEnrichmentPipeline: threat_intelligence_automation_kit_1.createEnrichmentPipeline,
    executePipeline: threat_intelligence_automation_kit_1.executePipeline,
    createCorrelationRule: threat_intelligence_automation_kit_1.createCorrelationRule,
    executeCorrelationRule: threat_intelligence_automation_kit_1.executeCorrelationRule,
    executeAutomatedAction: threat_intelligence_automation_kit_1.executeAutomatedAction,
    createWorkflow: threat_intelligence_automation_kit_1.createWorkflow,
    // Threat Intelligence Collaboration (6 functions)
    createCollaborationWorkspace: threat_intelligence_collaboration_kit_1.createCollaborationWorkspace,
    shareIntelligence: threat_intelligence_collaboration_kit_1.shareIntelligence,
    sanitizeIntelligence: threat_intelligence_collaboration_kit_1.sanitizeIntelligence,
    convertToSTIX: threat_intelligence_collaboration_kit_1.convertToSTIX,
    createHuntingSession: threat_intelligence_collaboration_kit_1.createHuntingSession,
    submitHuntingFinding: threat_intelligence_collaboration_kit_1.submitHuntingFinding,
    // Security Awareness Training (4 functions)
    createTrainingCampaign: security_awareness_training_kit_1.createTrainingCampaign,
    createPhishingSimulation: security_awareness_training_kit_1.createPhishingSimulation,
    trackSecurityBehavior: security_awareness_training_kit_1.trackSecurityBehavior,
    calculateSecurityCultureScore: security_awareness_training_kit_1.calculateSecurityCultureScore,
};
//# sourceMappingURL=security-operations-automation-composite.js.map