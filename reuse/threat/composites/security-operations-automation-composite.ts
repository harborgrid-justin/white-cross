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

import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  ValidationPipe,
  UsePipes,
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiProperty,
} from '@nestjs/swagger';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsDate,
  IsArray,
  IsBoolean,
  IsUUID,
  ValidateNested,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

// Import threat intelligence orchestration functions (11 functions)
import {
  createSOARWorkflow,
  executeSOARWorkflow,
  pauseWorkflowExecution,
  resumeWorkflowExecution,
  cancelWorkflowExecution,
  createPlaybook,
  executePlaybook,
  registerSecurityTool,
  executeToolAction,
  scheduleTask,
  sendNotification,
} from '../threat-intelligence-orchestration-kit';

// Import security analytics functions (10 functions)
import {
  executeAnalyticsQuery,
  aggregateSecurityMetrics,
  streamSecurityAnalytics,
  analyzeTrend,
  forecastMetric,
  calculateCorrelation,
  identifyCorrelatedEvents,
  detectStatisticalAnomalies,
  detectMultivariateAnomalies,
  generateAnomalyReport,
} from '../security-analytics-kit';

// Import DevSecOps threat integration functions (8 functions)
import {
  scanPipelineSecurity,
  monitorPipelinesSecurity,
  scanSourceCodeVulnerabilities,
  scanDependencyVulnerabilities,
  detectExposedSecrets,
  evaluateDeploymentSecurityGate,
  validateHIPAACompliance,
  generateComplianceAuditReport,
} from '../devsecops-threat-integration-kit';

// Import threat intelligence automation functions (8 functions)
import {
  registerIngestionSource,
  executeIngestion,
  createEnrichmentPipeline,
  executePipeline,
  createCorrelationRule,
  executeCorrelationRule,
  executeAutomatedAction,
  createWorkflow,
} from '../threat-intelligence-automation-kit';

// Import threat intelligence collaboration functions (6 functions)
import {
  createCollaborationWorkspace,
  shareIntelligence,
  sanitizeIntelligence,
  convertToSTIX,
  createHuntingSession,
  submitHuntingFinding,
} from '../threat-intelligence-collaboration-kit';

// Import security awareness training functions (4 functions)
import {
  createTrainingCampaign,
  createPhishingSimulation,
  trackSecurityBehavior,
  calculateSecurityCultureScore,
} from '../security-awareness-training-kit';

// Re-export all imported functions for SOC automation
export {
  // Threat Intelligence Orchestration (11)
  createSOARWorkflow,
  executeSOARWorkflow,
  pauseWorkflowExecution,
  resumeWorkflowExecution,
  cancelWorkflowExecution,
  createPlaybook,
  executePlaybook,
  registerSecurityTool,
  executeToolAction,
  scheduleTask,
  sendNotification,

  // Security Analytics (10)
  executeAnalyticsQuery,
  aggregateSecurityMetrics,
  streamSecurityAnalytics,
  analyzeTrend,
  forecastMetric,
  calculateCorrelation,
  identifyCorrelatedEvents,
  detectStatisticalAnomalies,
  detectMultivariateAnomalies,
  generateAnomalyReport,

  // DevSecOps Threat Integration (8)
  scanPipelineSecurity,
  monitorPipelinesSecurity,
  scanSourceCodeVulnerabilities,
  scanDependencyVulnerabilities,
  detectExposedSecrets,
  evaluateDeploymentSecurityGate,
  validateHIPAACompliance,
  generateComplianceAuditReport,

  // Threat Intelligence Automation (8)
  registerIngestionSource,
  executeIngestion,
  createEnrichmentPipeline,
  executePipeline,
  createCorrelationRule,
  executeCorrelationRule,
  executeAutomatedAction,
  createWorkflow,

  // Threat Intelligence Collaboration (6)
  createCollaborationWorkspace,
  shareIntelligence,
  sanitizeIntelligence,
  convertToSTIX,
  createHuntingSession,
  submitHuntingFinding,

  // Security Awareness Training (4)
  createTrainingCampaign,
  createPhishingSimulation,
  trackSecurityBehavior,
  calculateSecurityCultureScore,
};

// ============================================================================
// NESTJS CONFIGURATION MODULE SETUP
// ============================================================================

/**
 * Configuration interface for SOC Automation settings
 */
export interface SOCAutomationConfig {
  // Environment settings
  environment: 'development' | 'staging' | 'production';

  // SOAR Workflow Configuration
  soar: {
    enabled: boolean;
    maxConcurrentWorkflows: number;
    workflowTimeout: number;
    retryAttempts: number;
    enableApprovalWorkflows: boolean;
  };

  // Analytics Configuration
  analytics: {
    enabled: boolean;
    streamingEnabled: boolean;
    anomalyDetectionThreshold: number;
    correlationTimeWindow: number; // milliseconds
    forecastingPeriods: number;
    dataRetentionDays: number;
  };

  // DevSecOps Integration
  devsecops: {
    enabled: boolean;
    pipelineScanningEnabled: boolean;
    secretDetectionEnabled: boolean;
    severityThreshold: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    autoRemediation: boolean;
    complianceFrameworks: string[];
  };

  // Threat Intelligence Automation
  threatAutomation: {
    enabled: boolean;
    autoIngestion: boolean;
    ingestionInterval: number; // milliseconds
    autoEnrichment: boolean;
    enrichmentTimeout: number;
    correlationEnabled: boolean;
    autoTagging: boolean;
  };

  // Collaboration Settings
  collaboration: {
    enabled: boolean;
    workspacesEnabled: boolean;
    sharingEnabled: boolean;
    stixExportEnabled: boolean;
    sanitizationLevel: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'STRICT';
    defaultTLP: 'RED' | 'AMBER' | 'GREEN' | 'WHITE';
  };

  // Security Awareness
  awareness: {
    enabled: boolean;
    phishingSimEnabled: boolean;
    trainingMandatory: boolean;
    cultureScoringEnabled: boolean;
    reportingEnabled: boolean;
  };

  // Notification Configuration
  notifications: {
    enabled: boolean;
    channels: string[];
    severityThresholds: {
      critical: boolean;
      high: boolean;
      medium: boolean;
      low: boolean;
    };
    rateLimitPerHour: number;
  };

  // Integration Settings
  integrations: {
    siem: {
      enabled: boolean;
      endpoint: string;
      apiKey?: string;
    };
    ticketing: {
      enabled: boolean;
      system: 'jira' | 'servicenow' | 'custom';
      endpoint: string;
      apiKey?: string;
    };
    threatIntel: {
      enabled: boolean;
      feeds: string[];
      apiKeys: Record<string, string>;
    };
  };

  // Performance Settings
  performance: {
    batchSize: number;
    maxRetries: number;
    timeoutMs: number;
    cacheEnabled: boolean;
    cacheTTL: number;
  };

  // Security Settings
  security: {
    encryptionEnabled: boolean;
    auditLoggingEnabled: boolean;
    accessControlEnabled: boolean;
    apiRateLimiting: boolean;
    rateLimitPerMinute: number;
  };
}

/**
 * Default configuration factory for SOC Automation
 */
export const socAutomationConfig = (): SOCAutomationConfig => ({
  environment: (process.env.NODE_ENV as any) || 'development',

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
    severityThreshold: (process.env.SEVERITY_THRESHOLD as any) || 'MEDIUM',
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
    sanitizationLevel: (process.env.SANITIZATION_LEVEL as any) || 'MEDIUM',
    defaultTLP: (process.env.DEFAULT_TLP as any) || 'AMBER',
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
      system: (process.env.TICKETING_SYSTEM as any) || 'jira',
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

// ============================================================================
// ENVIRONMENT-SPECIFIC CONFIGURATIONS
// ============================================================================

/**
 * Development environment configuration
 */
export const developmentConfig = (): Partial<SOCAutomationConfig> => ({
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

/**
 * Staging environment configuration
 */
export const stagingConfig = (): Partial<SOCAutomationConfig> => ({
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

/**
 * Production environment configuration
 */
export const productionConfig = (): Partial<SOCAutomationConfig> => ({
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

/**
 * Get configuration based on environment
 */
export const getEnvironmentConfig = (): SOCAutomationConfig => {
  const baseConfig = socAutomationConfig();
  const env = process.env.NODE_ENV || 'development';

  switch (env) {
    case 'production':
      return { ...baseConfig, ...productionConfig() };
    case 'staging':
      return { ...baseConfig, ...stagingConfig() };
    case 'development':
    default:
      return { ...baseConfig, ...developmentConfig() };
  }
};

// ============================================================================
// NESTJS CONFIGURATION SERVICE
// ============================================================================

/**
 * Injectable SOC Automation Configuration Service
 */
@Injectable()
export class SOCAutomationConfigService {
  private readonly logger = new Logger(SOCAutomationConfigService.name);
  private config: SOCAutomationConfig;

  constructor(private configService: ConfigService) {
    this.config = getEnvironmentConfig();
    this.logger.log(`SOC Automation initialized for ${this.config.environment} environment`);
  }

  /**
   * Get full configuration
   */
  getConfig(): SOCAutomationConfig {
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
  isFeatureEnabled(feature: keyof SOCAutomationConfig): boolean {
    const featureConfig = this.config[feature] as any;
    return featureConfig?.enabled === true;
  }

  /**
   * Check if in production environment
   */
  isProduction(): boolean {
    return this.config.environment === 'production';
  }

  /**
   * Check if in development environment
   */
  isDevelopment(): boolean {
    return this.config.environment === 'development';
  }

  /**
   * Check if in staging environment
   */
  isStaging(): boolean {
    return this.config.environment === 'staging';
  }
}

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
@ApiTags('SOC Automation')
@Controller('api/v1/soc-automation')
@ApiBearerAuth()
export class SOCAutomationController {
  private readonly logger = new Logger(SOCAutomationController.name);

  constructor(private readonly configService: SOCAutomationConfigService) {}

  // ============================================================================
  // SOAR WORKFLOW OPERATIONS
  // ============================================================================

  @Post('workflows')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new SOAR workflow' })
  @ApiResponse({ status: 201, description: 'Workflow created successfully' })
  async createWorkflow(@Body() workflowData: any) {
    if (!this.configService.getSOARConfig().enabled) {
      throw new BadRequestException('SOAR workflows are disabled in this environment');
    }
    return createSOARWorkflow(workflowData);
  }

  @Post('workflows/:workflowId/execute')
  @ApiOperation({ summary: 'Execute a SOAR workflow' })
  @ApiParam({ name: 'workflowId', description: 'Workflow identifier' })
  async executeWorkflow(
    @Param('workflowId') workflowId: string,
    @Body() context: any,
  ) {
    return executeSOARWorkflow(workflowId, context);
  }

  @Post('workflows/:executionId/pause')
  @ApiOperation({ summary: 'Pause workflow execution' })
  async pauseWorkflow(@Param('executionId') executionId: string) {
    return pauseWorkflowExecution(executionId);
  }

  @Post('workflows/:executionId/resume')
  @ApiOperation({ summary: 'Resume workflow execution' })
  async resumeWorkflow(@Param('executionId') executionId: string) {
    return resumeWorkflowExecution(executionId);
  }

  @Post('workflows/:executionId/cancel')
  @ApiOperation({ summary: 'Cancel workflow execution' })
  async cancelWorkflow(@Param('executionId') executionId: string) {
    return cancelWorkflowExecution(executionId);
  }

  // ============================================================================
  // PLAYBOOK OPERATIONS
  // ============================================================================

  @Post('playbooks')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a security playbook' })
  async createSecurityPlaybook(@Body() playbookData: any) {
    return createPlaybook(playbookData);
  }

  @Post('playbooks/:playbookId/execute')
  @ApiOperation({ summary: 'Execute a security playbook' })
  async executeSecurityPlaybook(
    @Param('playbookId') playbookId: string,
    @Body() context: any,
  ) {
    return executePlaybook(playbookId, context);
  }

  // ============================================================================
  // SECURITY TOOL INTEGRATION
  // ============================================================================

  @Post('integrations/tools')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a security tool integration' })
  async registerTool(@Body() toolData: any) {
    return registerSecurityTool(toolData);
  }

  @Post('integrations/tools/:toolId/actions')
  @ApiOperation({ summary: 'Execute action on integrated security tool' })
  async executeTool(
    @Param('toolId') toolId: string,
    @Body() actionData: any,
  ) {
    return executeToolAction(toolId, actionData.action, actionData.params);
  }

  // ============================================================================
  // SCHEDULING OPERATIONS
  // ============================================================================

  @Post('tasks/schedule')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Schedule an automated task' })
  async scheduleAutomatedTask(@Body() taskData: any) {
    return scheduleTask(taskData);
  }

  // ============================================================================
  // NOTIFICATION OPERATIONS
  // ============================================================================

  @Post('notifications')
  @ApiOperation({ summary: 'Send security notification' })
  async sendSecurityNotification(@Body() notificationData: any) {
    const notifConfig = this.configService.getNotificationConfig();
    if (!notifConfig.enabled) {
      throw new BadRequestException('Notifications are disabled in this environment');
    }
    return sendNotification(notificationData);
  }

  // ============================================================================
  // ANALYTICS OPERATIONS
  // ============================================================================

  @Post('analytics/query')
  @ApiOperation({ summary: 'Execute security analytics query' })
  async executeQuery(@Body() queryData: any) {
    if (!this.configService.getAnalyticsConfig().enabled) {
      throw new BadRequestException('Analytics are disabled in this environment');
    }
    return executeAnalyticsQuery(queryData.query, queryData.params);
  }

  @Post('analytics/aggregate')
  @ApiOperation({ summary: 'Aggregate security metrics' })
  async aggregateMetrics(@Body() aggregationData: any) {
    return aggregateSecurityMetrics(
      aggregationData.metrics,
      aggregationData.dimensions,
      aggregationData.filters,
    );
  }

  @Get('analytics/stream/:streamName')
  @ApiOperation({ summary: 'Stream security analytics data' })
  @ApiParam({ name: 'streamName', description: 'Stream name' })
  async streamAnalytics(
    @Param('streamName') streamName: string,
    @Query('windowSize') windowSize: number = 60,
    @Query('aggregations') aggregations: string,
  ) {
    if (!this.configService.getAnalyticsConfig().streamingEnabled) {
      throw new BadRequestException('Streaming analytics are disabled');
    }
    return streamSecurityAnalytics(
      streamName,
      windowSize,
      aggregations.split(','),
    );
  }

  @Post('analytics/trend')
  @ApiOperation({ summary: 'Analyze security metric trends' })
  async analyzeTrends(@Body() trendData: any) {
    return analyzeTrend(trendData.metric, trendData.dataPoints);
  }

  @Post('analytics/forecast')
  @ApiOperation({ summary: 'Forecast security metrics' })
  async forecastMetrics(@Body() forecastData: any) {
    const periods = this.configService.getAnalyticsConfig().forecastingPeriods;
    return forecastMetric(
      forecastData.metric,
      forecastData.historicalData,
      forecastData.periods || periods,
    );
  }

  @Post('analytics/correlation')
  @ApiOperation({ summary: 'Calculate metric correlation' })
  async calculateMetricCorrelation(@Body() correlationData: any) {
    return calculateCorrelation(
      correlationData.metric1,
      correlationData.metric2,
      correlationData.data,
    );
  }

  @Post('analytics/correlated-events')
  @ApiOperation({ summary: 'Identify correlated security events' })
  async identifyCorrelations(@Body() eventData: any) {
    return identifyCorrelatedEvents(eventData.events, eventData.threshold);
  }

  @Post('analytics/anomalies/statistical')
  @ApiOperation({ summary: 'Detect statistical anomalies' })
  async detectStatistical(@Body() anomalyData: any) {
    const threshold = this.configService.getAnalyticsConfig().anomalyDetectionThreshold;
    return detectStatisticalAnomalies(
      anomalyData.data,
      anomalyData.threshold || threshold,
    );
  }

  @Post('analytics/anomalies/multivariate')
  @ApiOperation({ summary: 'Detect multivariate anomalies' })
  async detectMultivariate(@Body() anomalyData: any) {
    return detectMultivariateAnomalies(anomalyData.data);
  }

  @Post('analytics/anomalies/report')
  @ApiOperation({ summary: 'Generate anomaly detection report' })
  async generateAnomaliesReport(@Body() reportData: any) {
    return generateAnomalyReport(reportData.anomalies, reportData.timeRange);
  }

  // ============================================================================
  // DEVSECOPS OPERATIONS
  // ============================================================================

  @Post('devsecops/pipeline/scan')
  @ApiOperation({ summary: 'Scan CI/CD pipeline for security threats' })
  async scanPipeline(@Body() scanData: any) {
    if (!this.configService.getDevSecOpsConfig().pipelineScanningEnabled) {
      throw new BadRequestException('Pipeline scanning is disabled');
    }
    return scanPipelineSecurity(
      scanData.pipelineId,
      scanData.buildId,
      scanData.options,
    );
  }

  @Get('devsecops/pipelines/monitor')
  @ApiOperation({ summary: 'Monitor multiple pipelines for security' })
  @ApiQuery({ name: 'pipelineIds', description: 'Comma-separated pipeline IDs' })
  async monitorPipelines(
    @Query('pipelineIds') pipelineIds: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return monitorPipelinesSecurity(pipelineIds.split(','), {
      start: new Date(startDate),
      end: new Date(endDate),
    });
  }

  @Post('devsecops/code/scan')
  @ApiOperation({ summary: 'Scan source code for vulnerabilities' })
  async scanCode(@Body() scanData: any) {
    return scanSourceCodeVulnerabilities(
      scanData.repository,
      scanData.branch,
      scanData.tool,
    );
  }

  @Post('devsecops/dependencies/scan')
  @ApiOperation({ summary: 'Scan dependencies for vulnerabilities' })
  async scanDependencies(@Body() scanData: any) {
    return scanDependencyVulnerabilities(
      scanData.projectPath,
      scanData.packageManager,
    );
  }

  @Post('devsecops/secrets/detect')
  @ApiOperation({ summary: 'Detect exposed secrets in code' })
  async detectSecrets(@Body() secretData: any) {
    if (!this.configService.getDevSecOpsConfig().secretDetectionEnabled) {
      throw new BadRequestException('Secret detection is disabled');
    }
    return detectExposedSecrets(secretData.repository, secretData.tool);
  }

  @Post('devsecops/deployment/gate')
  @ApiOperation({ summary: 'Evaluate deployment security gate' })
  async evaluateGate(@Body() gateData: any) {
    return evaluateDeploymentSecurityGate(
      gateData.buildId,
      gateData.environment,
      gateData.criteria,
    );
  }

  @Post('devsecops/compliance/hipaa')
  @ApiOperation({ summary: 'Validate HIPAA compliance in pipeline' })
  async validateCompliance(@Body() complianceData: any) {
    if (!this.configService.getDevSecOpsConfig().complianceFrameworks.includes('HIPAA')) {
      throw new BadRequestException('HIPAA compliance validation is not configured');
    }
    return validateHIPAACompliance(
      complianceData.pipelineId,
      complianceData.buildId,
    );
  }

  @Post('devsecops/compliance/audit-report')
  @ApiOperation({ summary: 'Generate compliance audit report' })
  async generateAuditReport(@Body() reportData: any) {
    return generateComplianceAuditReport(reportData.validations);
  }

  // ============================================================================
  // THREAT INTELLIGENCE AUTOMATION
  // ============================================================================

  @Post('threat-intel/ingestion/register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register threat intelligence ingestion source' })
  async registerIngestion(@Body() sourceData: any) {
    if (!this.configService.getThreatAutomationConfig().enabled) {
      throw new BadRequestException('Threat automation is disabled');
    }
    return registerIngestionSource(sourceData);
  }

  @Post('threat-intel/ingestion/:sourceId/execute')
  @ApiOperation({ summary: 'Execute threat intelligence ingestion' })
  async executeIngestionJob(@Param('sourceId') sourceId: string) {
    if (!this.configService.getThreatAutomationConfig().autoIngestion) {
      throw new BadRequestException('Auto ingestion is disabled');
    }
    return executeIngestion(sourceId);
  }

  @Post('threat-intel/enrichment/pipeline')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create enrichment pipeline' })
  async createEnrichment(@Body() pipelineData: any) {
    if (!this.configService.getThreatAutomationConfig().autoEnrichment) {
      throw new BadRequestException('Auto enrichment is disabled');
    }
    return createEnrichmentPipeline(pipelineData);
  }

  @Post('threat-intel/enrichment/:pipelineId/execute')
  @ApiOperation({ summary: 'Execute enrichment pipeline' })
  async executeEnrichment(
    @Param('pipelineId') pipelineId: string,
    @Body() inputData: any,
  ) {
    return executePipeline(pipelineId, inputData);
  }

  @Post('threat-intel/correlation/rule')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create correlation rule' })
  async createCorrelation(@Body() ruleData: any) {
    if (!this.configService.getThreatAutomationConfig().correlationEnabled) {
      throw new BadRequestException('Correlation is disabled');
    }
    return createCorrelationRule(ruleData);
  }

  @Post('threat-intel/correlation/:ruleId/execute')
  @ApiOperation({ summary: 'Execute correlation rule' })
  async executeCorrelation(
    @Param('ruleId') ruleId: string,
    @Body() eventData: any,
  ) {
    return executeCorrelationRule(ruleId, eventData.events);
  }

  @Post('threat-intel/actions/execute')
  @ApiOperation({ summary: 'Execute automated threat response action' })
  async executeAction(@Body() actionData: any) {
    return executeAutomatedAction(actionData.action, actionData.context);
  }

  @Post('threat-intel/workflows')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create threat intelligence workflow' })
  async createThreatWorkflow(@Body() workflowData: any) {
    return createWorkflow(workflowData);
  }

  // ============================================================================
  // COLLABORATION OPERATIONS
  // ============================================================================

  @Post('collaboration/workspaces')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create collaboration workspace' })
  async createWorkspace(@Body() workspaceData: any) {
    if (!this.configService.getCollaborationConfig().workspacesEnabled) {
      throw new BadRequestException('Collaboration workspaces are disabled');
    }
    return createCollaborationWorkspace(workspaceData);
  }

  @Post('collaboration/intelligence/share')
  @ApiOperation({ summary: 'Share threat intelligence' })
  async shareIntel(@Body() shareData: any) {
    if (!this.configService.getCollaborationConfig().sharingEnabled) {
      throw new BadRequestException('Intelligence sharing is disabled');
    }
    return shareIntelligence(shareData.workspaceId, shareData.intelligence);
  }

  @Post('collaboration/intelligence/sanitize')
  @ApiOperation({ summary: 'Sanitize intelligence before sharing' })
  async sanitizeIntel(@Body() sanitizeData: any) {
    const sanitizationLevel = this.configService.getCollaborationConfig().sanitizationLevel;
    return sanitizeIntelligence(
      sanitizeData.intelligence,
      sanitizeData.level || sanitizationLevel,
    );
  }

  @Post('collaboration/intelligence/stix')
  @ApiOperation({ summary: 'Convert intelligence to STIX format' })
  async convertSTIX(@Body() convertData: any) {
    if (!this.configService.getCollaborationConfig().stixExportEnabled) {
      throw new BadRequestException('STIX export is disabled');
    }
    return convertToSTIX(convertData.intelligence);
  }

  @Post('collaboration/hunting/session')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create collaborative threat hunting session' })
  async createHunting(@Body() sessionData: any) {
    return createHuntingSession(sessionData);
  }

  @Post('collaboration/hunting/:sessionId/finding')
  @ApiOperation({ summary: 'Submit hunting finding' })
  async submitFinding(
    @Param('sessionId') sessionId: string,
    @Body() findingData: any,
  ) {
    return submitHuntingFinding(sessionId, findingData);
  }

  // ============================================================================
  // SECURITY AWARENESS OPERATIONS
  // ============================================================================

  @Post('awareness/campaigns')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create security awareness training campaign' })
  async createCampaign(@Body() campaignData: any) {
    if (!this.configService.getAwarenessConfig().enabled) {
      throw new BadRequestException('Security awareness is disabled');
    }
    return createTrainingCampaign(campaignData.model, campaignData.data);
  }

  @Post('awareness/phishing/simulation')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create phishing simulation' })
  async createPhishing(@Body() simData: any) {
    if (!this.configService.getAwarenessConfig().phishingSimEnabled) {
      throw new BadRequestException('Phishing simulations are disabled');
    }
    return createPhishingSimulation(simData.model, simData.data);
  }

  @Post('awareness/behavior/track')
  @ApiOperation({ summary: 'Track security behavior event' })
  async trackBehavior(@Body() behaviorData: any) {
    return trackSecurityBehavior(behaviorData.model, behaviorData.data);
  }

  @Get('awareness/culture/score')
  @ApiOperation({ summary: 'Calculate organization security culture score' })
  @ApiQuery({ name: 'organizationId', description: 'Organization identifier' })
  @ApiQuery({ name: 'period', description: 'Time period for calculation' })
  async calculateCulture(
    @Query('organizationId') organizationId: string,
    @Query('period') period: string,
  ) {
    if (!this.configService.getAwarenessConfig().cultureScoringEnabled) {
      throw new BadRequestException('Culture scoring is disabled');
    }
    return calculateSecurityCultureScore({} as any, organizationId, period);
  }

  // ============================================================================
  // CONFIGURATION OPERATIONS
  // ============================================================================

  @Get('config')
  @ApiOperation({ summary: 'Get SOC automation configuration' })
  async getConfiguration() {
    return this.configService.getConfig();
  }

  @Get('config/features')
  @ApiOperation({ summary: 'Get enabled features' })
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

  @Get('health')
  @ApiOperation({ summary: 'Health check for SOC automation services' })
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
}

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default {
  // Configuration
  socAutomationConfig,
  developmentConfig,
  stagingConfig,
  productionConfig,
  getEnvironmentConfig,
  SOCAutomationConfigService,
  SOCAutomationController,

  // Threat Intelligence Orchestration (11 functions)
  createSOARWorkflow,
  executeSOARWorkflow,
  pauseWorkflowExecution,
  resumeWorkflowExecution,
  cancelWorkflowExecution,
  createPlaybook,
  executePlaybook,
  registerSecurityTool,
  executeToolAction,
  scheduleTask,
  sendNotification,

  // Security Analytics (10 functions)
  executeAnalyticsQuery,
  aggregateSecurityMetrics,
  streamSecurityAnalytics,
  analyzeTrend,
  forecastMetric,
  calculateCorrelation,
  identifyCorrelatedEvents,
  detectStatisticalAnomalies,
  detectMultivariateAnomalies,
  generateAnomalyReport,

  // DevSecOps Threat Integration (8 functions)
  scanPipelineSecurity,
  monitorPipelinesSecurity,
  scanSourceCodeVulnerabilities,
  scanDependencyVulnerabilities,
  detectExposedSecrets,
  evaluateDeploymentSecurityGate,
  validateHIPAACompliance,
  generateComplianceAuditReport,

  // Threat Intelligence Automation (8 functions)
  registerIngestionSource,
  executeIngestion,
  createEnrichmentPipeline,
  executePipeline,
  createCorrelationRule,
  executeCorrelationRule,
  executeAutomatedAction,
  createWorkflow,

  // Threat Intelligence Collaboration (6 functions)
  createCollaborationWorkspace,
  shareIntelligence,
  sanitizeIntelligence,
  convertToSTIX,
  createHuntingSession,
  submitHuntingFinding,

  // Security Awareness Training (4 functions)
  createTrainingCampaign,
  createPhishingSimulation,
  trackSecurityBehavior,
  calculateSecurityCultureScore,
};
