/**
 * LOC: DETENG001
 * File: /reuse/threat/composites/downstream/detection-engineering-services.ts
 *
 * UPSTREAM (imports from):
 *   - ../threat-detection-validation-composite.ts
 *
 * DOWNSTREAM (imported by):
 *   - Security engineering teams
 *   - Detection rule developers
 *   - Purple team operations
 *   - SOC automation platforms
 *   - Security testing frameworks
 */

/**
 * File: /reuse/threat/composites/downstream/detection-engineering-services.ts
 * Locator: WC-DOWN-DETENG-001
 * Purpose: Detection Engineering Services - Professional detection rule development, validation, and lifecycle management
 *
 * Upstream: threat-detection-validation-composite.ts
 * Downstream: SOC services, Detection management platforms, Testing frameworks
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize
 * Exports: Detection engineering REST API, rule lifecycle management, quality assurance workflows
 *
 * LLM Context: Enterprise-grade detection engineering service for White Cross healthcare platform.
 * Provides professional detection rule development lifecycle, automated validation, quality metrics,
 * coverage analysis, continuous integration workflows, and HIPAA-compliant security detection management.
 */

import crypto from 'crypto';
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
  ConflictException,
  InternalServerErrorException,
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
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Sequelize, Transaction } from 'sequelize';

// Import from threat-detection-validation-composite
import {
  createDetectionValidationFramework,
  generateValidationTestsFromThreatModel,
  executeDetectionValidationSuite,
  validateDetectionCoverageAgainstMITRE,
  executePurpleTeamValidationExercise,
  calculateDetectionQualityMetrics,
  analyzeFalsePositives,
  analyzeFalseNegatives,
  benchmarkDetectionPerformance,
  createContinuousValidationPipeline,
  executeContinuousValidationPipeline,
  generateDetectionValidationReport,
  validateDetectionRuleSyntax,
  generateTestCasesFromRule,
  createDetectionRegressionSuite,
  analyzeDetectionRuleEffectiveness,
  compareDetectionRules,
  generateDetectionTuningRecommendations,
  createValidationBaseline,
  trackValidationSLACompliance,
  orchestrateAutomatedValidationWorkflow,
  generateDetectionMaturityAssessment,
  generateDetectionCoverageRoadmap,
  validateDetectionAlertQuality,
  generateComplianceValidationReport,
  performDetectionCoverageGapPrioritization,
  analyzeDetectionValidationTrends,
  generateValidationExecutiveBriefing,
  DetectionValidationFramework,
  DetectionValidationTest,
  DetectionValidationResult,
  QualityMetrics,
  DetectionCoverageGap,
  ContinuousValidationPipeline,
} from '../threat-detection-validation-composite';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Detection rule lifecycle status
 */
export enum DetectionRuleStatus {
  DRAFT = 'DRAFT',
  IN_REVIEW = 'IN_REVIEW',
  TESTING = 'TESTING',
  VALIDATED = 'VALIDATED',
  PRODUCTION = 'PRODUCTION',
  DEPRECATED = 'DEPRECATED',
  ARCHIVED = 'ARCHIVED',
}

/**
 * Detection rule severity levels
 */
export enum DetectionSeverity {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
  INFO = 'INFO',
}

/**
 * Detection rule categories
 */
export enum DetectionCategory {
  MALWARE = 'MALWARE',
  PHISHING = 'PHISHING',
  LATERAL_MOVEMENT = 'LATERAL_MOVEMENT',
  DATA_EXFILTRATION = 'DATA_EXFILTRATION',
  PRIVILEGE_ESCALATION = 'PRIVILEGE_ESCALATION',
  PERSISTENCE = 'PERSISTENCE',
  DEFENSE_EVASION = 'DEFENSE_EVASION',
  CREDENTIAL_ACCESS = 'CREDENTIAL_ACCESS',
  DISCOVERY = 'DISCOVERY',
  COLLECTION = 'COLLECTION',
  COMMAND_AND_CONTROL = 'COMMAND_AND_CONTROL',
  IMPACT = 'IMPACT',
}

/**
 * Detection engineering workflow stage
 */
export enum WorkflowStage {
  REQUIREMENTS = 'REQUIREMENTS',
  DESIGN = 'DESIGN',
  IMPLEMENTATION = 'IMPLEMENTATION',
  VALIDATION = 'VALIDATION',
  DEPLOYMENT = 'DEPLOYMENT',
  MONITORING = 'MONITORING',
  TUNING = 'TUNING',
  RETIREMENT = 'RETIREMENT',
}

/**
 * Detection rule definition
 */
export interface DetectionRule {
  id: string;
  name: string;
  description: string;
  status: DetectionRuleStatus;
  severity: DetectionSeverity;
  category: DetectionCategory;
  mitreAttackIds: string[];
  logic: DetectionLogic;
  platforms: string[];
  dataSources: string[];
  author: string;
  version: string;
  createdAt: Date;
  updatedAt: Date;
  lastValidatedAt?: Date;
  validationResults?: ValidationSummary;
  performanceMetrics?: PerformanceMetrics;
  metadata?: Record<string, any>;
}

/**
 * Detection logic specification
 */
export interface DetectionLogic {
  query: string;
  queryLanguage: 'KQL' | 'SPL' | 'SQL' | 'SIGMA' | 'YARA' | 'CUSTOM';
  timeWindow?: number;
  threshold?: number;
  aggregations?: Aggregation[];
  correlations?: Correlation[];
  exclusions?: Exclusion[];
}

/**
 * Query aggregation
 */
export interface Aggregation {
  field: string;
  operation: 'count' | 'sum' | 'avg' | 'min' | 'max' | 'distinct';
  alias?: string;
}

/**
 * Event correlation
 */
export interface Correlation {
  eventType: string;
  timeWindow: number;
  conditions: Record<string, any>;
}

/**
 * False positive exclusion
 */
export interface Exclusion {
  field: string;
  operator: 'equals' | 'contains' | 'regex' | 'not_equals';
  value: any;
  justification: string;
}

/**
 * Validation summary
 */
export interface ValidationSummary {
  totalTests: number;
  passed: number;
  failed: number;
  lastValidation: Date;
  truePositiveRate: number;
  falsePositiveRate: number;
  precision: number;
  recall: number;
  f1Score: number;
}

/**
 * Performance metrics
 */
export interface PerformanceMetrics {
  avgExecutionTime: number;
  avgDataVolume: number;
  resourceUtilization: number;
  scalabilityScore: number;
  lastMeasured: Date;
}

/**
 * Detection engineering project
 */
export interface DetectionProject {
  id: string;
  name: string;
  description: string;
  objective: string;
  stage: WorkflowStage;
  rules: string[];
  threatModel?: string;
  validationFramework?: string;
  team: string[];
  startDate: Date;
  targetDeploymentDate?: Date;
  status: 'active' | 'on_hold' | 'completed' | 'cancelled';
  metrics: ProjectMetrics;
}

/**
 * Project metrics
 */
export interface ProjectMetrics {
  totalRules: number;
  rulesInProduction: number;
  rulesCoveragePct: number;
  avgQualityScore: number;
  avgValidationScore: number;
  teamVelocity: number;
}

// ============================================================================
// DTO CLASSES
// ============================================================================

export class CreateDetectionRuleDto {
  @ApiProperty({ description: 'Rule name', example: 'Suspicious PowerShell Execution' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Rule description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ enum: DetectionSeverity, example: DetectionSeverity.HIGH })
  @IsEnum(DetectionSeverity)
  severity: DetectionSeverity;

  @ApiProperty({ enum: DetectionCategory, example: DetectionCategory.MALWARE })
  @IsEnum(DetectionCategory)
  category: DetectionCategory;

  @ApiProperty({ description: 'MITRE ATT&CK technique IDs', example: ['T1059.001'] })
  @IsArray()
  @IsString({ each: true })
  mitreAttackIds: string[];

  @ApiProperty({ description: 'Detection query', example: 'process.name:powershell.exe AND process.args:*EncodedCommand*' })
  @IsString()
  @IsNotEmpty()
  query: string;

  @ApiProperty({ enum: ['KQL', 'SPL', 'SQL', 'SIGMA', 'YARA', 'CUSTOM'], example: 'KQL' })
  @IsEnum(['KQL', 'SPL', 'SQL', 'SIGMA', 'YARA', 'CUSTOM'])
  queryLanguage: 'KQL' | 'SPL' | 'SQL' | 'SIGMA' | 'YARA' | 'CUSTOM';

  @ApiProperty({ description: 'Supported platforms', example: ['windows', 'linux'] })
  @IsArray()
  @IsString({ each: true })
  platforms: string[];

  @ApiProperty({ description: 'Data sources', example: ['process', 'command_line'] })
  @IsArray()
  @IsString({ each: true })
  dataSources: string[];

  @ApiProperty({ description: 'Author name', example: 'Security Team' })
  @IsString()
  author: string;
}

export class ValidateDetectionRuleDto {
  @ApiProperty({ description: 'Rule ID to validate' })
  @IsUUID()
  ruleId: string;

  @ApiProperty({ description: 'Validation mode', enum: ['quick', 'comprehensive', 'continuous'] })
  @IsEnum(['quick', 'comprehensive', 'continuous'])
  mode: 'quick' | 'comprehensive' | 'continuous';

  @ApiProperty({ description: 'Include purple team testing', default: false })
  @IsBoolean()
  @IsOptional()
  includePurpleTeam?: boolean;
}

export class CreateDetectionProjectDto {
  @ApiProperty({ description: 'Project name', example: 'Q4 2025 Detection Coverage Initiative' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Project description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Project objective' })
  @IsString()
  @IsNotEmpty()
  objective: string;

  @ApiProperty({ description: 'Team member IDs', example: ['user-1', 'user-2'] })
  @IsArray()
  @IsString({ each: true })
  team: string[];

  @ApiProperty({ description: 'Target deployment date', required: false })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  targetDeploymentDate?: Date;
}

// ============================================================================
// NESTJS CONTROLLER
// ============================================================================

@ApiTags('detection-engineering')
@Controller('api/v1/detection-engineering')
@ApiBearerAuth()
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class DetectionEngineeringController {
  private readonly logger = new Logger(DetectionEngineeringController.name);

  constructor(
    private readonly sequelize: Sequelize,
    private readonly detectionService: DetectionEngineeringService,
  ) {}

  /**
   * Create a new detection rule
   */
  @Post('rules')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new detection rule' })
  @ApiBody({ type: CreateDetectionRuleDto })
  @ApiResponse({ status: 201, description: 'Detection rule created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid rule specification' })
  async createDetectionRule(@Body() dto: CreateDetectionRuleDto): Promise<DetectionRule> {
    const requestId = crypto.randomUUID();
    try {
      this.logger.log(`[${requestId}] Creating detection rule: ${dto.name}`);
      if (!dto || !dto.name || !dto.query || !dto.severity) {
        throw new BadRequestException('Invalid rule specification: missing required fields');
      }

      // Validate rule syntax
      const syntaxValidation = validateDetectionRuleSyntax({
        name: dto.name,
        logic: dto.query,
        severity: dto.severity,
        category: dto.category,
        mitreIds: dto.mitreAttackIds,
      });

      if (!syntaxValidation.isValid) {
        throw new BadRequestException({
          message: 'Invalid rule syntax',
          errors: syntaxValidation.errors,
          warnings: syntaxValidation.warnings,
        });
      }

      const rule = await this.detectionService.createRule({
        ...dto,
        status: DetectionRuleStatus.DRAFT,
        version: '1.0.0',
      });

      // Generate test cases automatically
      const testCases = generateTestCasesFromRule(
        {
          id: rule.id,
          name: rule.name,
          mitreId: dto.mitreAttackIds[0],
          techniques: dto.mitreAttackIds,
        },
        5,
      );

      this.logger.log(`[${requestId}] Successfully created detection rule: ${rule.id}, generated ${testCases.length} test cases`);
      return rule;
    } catch (error) {
      this.logger.error(`[${requestId}] Failed to create detection rule: ${error.message}`, error.stack);
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException({
        message: 'Failed to create detection rule',
        requestId,
        error: error.message,
      });
    }
  }

  /**
   * Validate detection rule
   */
  @Post('rules/:ruleId/validate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Validate detection rule with comprehensive testing' })
  @ApiParam({ name: 'ruleId', description: 'Detection rule ID' })
  @ApiBody({ type: ValidateDetectionRuleDto })
  @ApiResponse({ status: 200, description: 'Validation completed' })
  @ApiResponse({ status: 404, description: 'Rule not found' })
  async validateRule(
    @Param('ruleId', ParseUUIDPipe) ruleId: string,
    @Body() dto: ValidateDetectionRuleDto,
  ): Promise<{
    ruleId: string;
    validationResults: DetectionValidationResult[];
    qualityMetrics: QualityMetrics;
    passed: boolean;
    recommendations: string[];
  }> {
    const requestId = crypto.randomUUID();
    try {
      this.logger.log(`[${requestId}] Validating detection rule: ${ruleId}`);
      if (!ruleId || !dto || !dto.mode) {
        throw new BadRequestException('Rule ID and validation mode are required');
      }

      const rule = await this.detectionService.getRule(ruleId);
      if (!rule) {
        throw new NotFoundException('Detection rule not found');
      }

      // Create validation framework
      const framework = await createDetectionValidationFramework(
        {
          name: `Validation for ${rule.name}`,
          validationType: dto.mode === 'continuous' ? 'continuous' : 'on_demand',
          detectionRules: [ruleId],
          coverageRequirements: {
            mitreCoveragePct: 80,
            criticalTechniquesPct: 95,
            platformCoverage: rule.platforms,
            assetCoverage: [],
            minimumDetectionRate: 90,
            maximumFalsePositiveRate: 5,
          },
        },
        this.sequelize,
      );

      // Generate validation tests
      const tests = generateTestCasesFromRule(
        {
          id: rule.id,
          name: rule.name,
          mitreId: rule.mitreAttackIds[0],
          techniques: rule.mitreAttackIds,
        },
        dto.mode === 'quick' ? 3 : 10,
      );

      // Execute validation suite
      const validationResults = await executeDetectionValidationSuite(
        framework.id,
        tests,
        this.sequelize,
      );

      // Calculate quality metrics
      const qualityMetrics = calculateDetectionQualityMetrics(validationResults);

      // Analyze false positives and negatives
      const fpAnalysis = await analyzeFalsePositives(
        validationResults,
        ruleId,
        this.sequelize,
      );
      const fnAnalysis = await analyzeFalseNegatives(validationResults, this.sequelize);

      // Purple team validation if requested
      if (dto.includePurpleTeam) {
        await executePurpleTeamValidationExercise(
          `Purple Team: ${rule.name}`,
          [ruleId],
          rule.mitreAttackIds,
          this.sequelize,
        );
      }

      const passed = qualityMetrics.f1Score >= 80 && qualityMetrics.falsePositiveRate < 10;

      // Update rule status
      if (passed) {
        await this.detectionService.updateRuleStatus(ruleId, DetectionRuleStatus.VALIDATED);
      }

      this.logger.log(`[${requestId}] Rule validation complete: passed=${passed}, f1Score=${qualityMetrics.f1Score}`);
      return {
        ruleId,
        validationResults,
        qualityMetrics,
        passed,
        recommendations: [...fpAnalysis.recommendations, ...fnAnalysis.recommendations],
      };
    } catch (error) {
      this.logger.error(`[${requestId}] Failed to validate detection rule ${ruleId}: ${error.message}`, error.stack);
      if (error instanceof BadRequestException) throw error;
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException({
        message: 'Failed to validate detection rule',
        requestId,
        error: error.message,
      });
    }
  }

  /**
   * Analyze detection rule effectiveness
   */
  @Get('rules/:ruleId/effectiveness')
  @ApiOperation({ summary: 'Analyze detection rule effectiveness over time' })
  @ApiParam({ name: 'ruleId', description: 'Detection rule ID' })
  @ApiResponse({ status: 200, description: 'Effectiveness analysis completed' })
  async analyzeRuleEffectiveness(
    @Param('ruleId', ParseUUIDPipe) ruleId: string,
  ): Promise<{
    ruleId: string;
    effectiveness: any;
    trend: 'improving' | 'stable' | 'declining';
    recommendations: string[];
  }> {
    const requestId = crypto.randomUUID();
    try {
      this.logger.log(`[${requestId}] Analyzing effectiveness for rule: ${ruleId}`);
      if (!ruleId) throw new BadRequestException('Rule ID is required');

      // Get historical validation results
      const validationHistory = await this.detectionService.getValidationHistory(ruleId);

      const effectiveness = analyzeDetectionRuleEffectiveness(ruleId, validationHistory);
      this.logger.log(`[${requestId}] Effectiveness analysis complete: trend=${effectiveness.trend}`);

      return {
        ruleId,
        effectiveness,
        trend: effectiveness.trend,
        recommendations: effectiveness.recommendations,
      };
    } catch (error) {
      this.logger.error(`[${requestId}] Failed to analyze rule effectiveness: ${error.message}`, error.stack);
      if (error instanceof BadRequestException) throw error;
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException({
        message: 'Failed to analyze rule effectiveness',
        requestId,
        error: error.message,
      });
    }
  }

  /**
   * Compare multiple detection rules
   */
  @Post('rules/compare')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Compare performance of multiple detection rules' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        ruleIds: { type: 'array', items: { type: 'string' } },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Comparison completed' })
  async compareRules(
    @Body('ruleIds') ruleIds: string[],
  ): Promise<{
    comparison: Array<{ ruleId: string; performance: number; ranking: number }>;
    topPerformer: string;
    recommendations: any[];
  }> {
    const requestId = crypto.randomUUID();
    try {
      this.logger.log(`[${requestId}] Comparing ${ruleIds.length} detection rules`);
      if (!ruleIds || ruleIds.length === 0) {
        throw new BadRequestException('At least one rule ID is required for comparison');
      }

      // Get validation results for all rules
      const allValidationResults = await this.detectionService.getMultipleRuleValidations(ruleIds);

      const comparison = compareDetectionRules(allValidationResults);
      const tuningRecommendations = generateDetectionTuningRecommendations(allValidationResults);

      this.logger.log(`[${requestId}] Rule comparison complete: topPerformer=${comparison[0]?.ruleId}`);

      return {
        comparison,
        topPerformer: comparison[0]?.ruleId,
        recommendations: tuningRecommendations,
      };
    } catch (error) {
      this.logger.error(`[${requestId}] Failed to compare detection rules: ${error.message}`, error.stack);
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException({
        message: 'Failed to compare detection rules',
        requestId,
        error: error.message,
      });
    }
  }

  /**
   * Create detection engineering project
   */
  @Post('projects')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new detection engineering project' })
  @ApiBody({ type: CreateDetectionProjectDto })
  @ApiResponse({ status: 201, description: 'Project created successfully' })
  async createProject(@Body() dto: CreateDetectionProjectDto): Promise<DetectionProject> {
    const requestId = crypto.randomUUID();
    try {
      this.logger.log(`[${requestId}] Creating detection project: ${dto.name}`);
      if (!dto || !dto.name || !dto.objective || !dto.team) {
        throw new BadRequestException('Project name, objective, and team are required');
      }

      const project = await this.detectionService.createProject({
        ...dto,
        stage: WorkflowStage.REQUIREMENTS,
        rules: [],
        status: 'active',
        startDate: new Date(),
        metrics: {
          totalRules: 0,
          rulesInProduction: 0,
          rulesCoveragePct: 0,
          avgQualityScore: 0,
          avgValidationScore: 0,
          teamVelocity: 0,
        },
      });

      // Create validation framework for project
      await createDetectionValidationFramework(
        {
          name: `Validation Framework: ${dto.name}`,
          validationType: 'continuous',
          detectionRules: [],
        },
        this.sequelize,
      );

      this.logger.log(`[${requestId}] Successfully created detection project: ${project.id}`);
      return project;
    } catch (error) {
      this.logger.error(`[${requestId}] Failed to create detection project: ${error.message}`, error.stack);
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException({
        message: 'Failed to create detection project',
        requestId,
        error: error.message,
      });
    }
  }

  /**
   * Generate detection maturity assessment
   */
  @Get('maturity/assessment')
  @ApiOperation({ summary: 'Generate detection program maturity assessment' })
  @ApiResponse({ status: 200, description: 'Maturity assessment completed' })
  async assessMaturity(): Promise<{
    maturityLevel: string;
    score: number;
    strengths: string[];
    weaknesses: string[];
    roadmap: string[];
  }> {
    const requestId = crypto.randomUUID();
    try {
      this.logger.log(`[${requestId}] Generating detection maturity assessment`);

      const allValidationHistory = await this.detectionService.getAllValidationHistory();
      const assessment = generateDetectionMaturityAssessment(allValidationHistory);

      this.logger.log(`[${requestId}] Maturity assessment complete: level=${assessment.maturityLevel}, score=${assessment.score}`);
      return assessment;
    } catch (error) {
      this.logger.error(`[${requestId}] Failed to generate maturity assessment: ${error.message}`, error.stack);
      throw new InternalServerErrorException({
        message: 'Failed to generate maturity assessment',
        requestId,
        error: error.message,
      });
    }
  }

  /**
   * Generate detection coverage roadmap
   */
  @Post('coverage/roadmap')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Generate detection coverage improvement roadmap' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        targetCoverage: { type: 'number', example: 90 },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Roadmap generated' })
  async generateCoverageRoadmap(
    @Body('targetCoverage') targetCoverage: number,
  ): Promise<{
    currentState: number;
    targetState: number;
    gap: number;
    phases: any[];
    estimatedCompletion: Date;
  }> {
    const requestId = crypto.randomUUID();
    try {
      this.logger.log(`[${requestId}] Generating coverage roadmap to ${targetCoverage}%`);
      if (!targetCoverage || targetCoverage < 0 || targetCoverage > 100) {
        throw new BadRequestException('Target coverage must be between 0 and 100');
      }

      // Validate current coverage
      const currentCoverage = await validateDetectionCoverageAgainstMITRE(
        await this.detectionService.getAllRuleIds(),
        targetCoverage,
        this.sequelize,
      );

      const roadmap = await generateDetectionCoverageRoadmap(
        currentCoverage,
        targetCoverage,
        this.sequelize,
      );

      this.logger.log(`[${requestId}] Coverage roadmap generated: current=${roadmap.currentState}%, target=${roadmap.targetState}%, gap=${roadmap.gap}%`);
      return roadmap;
    } catch (error) {
      this.logger.error(`[${requestId}] Failed to generate coverage roadmap: ${error.message}`, error.stack);
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException({
        message: 'Failed to generate coverage roadmap',
        requestId,
        error: error.message,
      });
    }
  }

  /**
   * Validate alert quality
   */
  @Post('alerts/validate-quality')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Validate quality of detection alerts' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        alerts: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              alertId: { type: 'string' },
              severity: { type: 'string' },
              details: { type: 'object' },
              context: { type: 'object' },
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Alert quality validation completed' })
  async validateAlertQuality(
    @Body('alerts') alerts: any[],
  ): Promise<{
    totalAlerts: number;
    avgQualityScore: number;
    lowQualityAlerts: number;
    improvements: any[];
  }> {
    const requestId = crypto.randomUUID();
    try {
      this.logger.log(`[${requestId}] Validating quality of ${alerts.length} alerts`);
      if (!alerts || alerts.length === 0) {
        throw new BadRequestException('At least one alert is required for quality validation');
      }

      const qualityResults = validateDetectionAlertQuality(alerts);

      const avgQualityScore =
        qualityResults.reduce((sum, r) => sum + r.qualityScore.overallScore, 0) /
        qualityResults.length;

      const lowQualityAlerts = qualityResults.filter((r) => r.qualityScore.overallScore < 70);

      this.logger.log(`[${requestId}] Alert quality validation complete: avgScore=${avgQualityScore.toFixed(2)}, lowQuality=${lowQualityAlerts.length}`);

      return {
        totalAlerts: alerts.length,
        avgQualityScore,
        lowQualityAlerts: lowQualityAlerts.length,
        improvements: qualityResults.flatMap((r) => r.improvementSuggestions),
      };
    } catch (error) {
      this.logger.error(`[${requestId}] Failed to validate alert quality: ${error.message}`, error.stack);
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException({
        message: 'Failed to validate alert quality',
        requestId,
        error: error.message,
      });
    }
  }

  /**
   * Generate comprehensive validation report
   */
  @Get('reports/validation')
  @ApiOperation({ summary: 'Generate comprehensive detection validation report' })
  @ApiQuery({ name: 'frameworkId', required: false })
  @ApiResponse({ status: 200, description: 'Validation report generated' })
  async generateValidationReport(
    @Query('frameworkId') frameworkId?: string,
  ): Promise<{
    summary: string;
    metrics: QualityMetrics;
    coverageAnalysis: any;
    recommendations: string[];
    detailedFindings: any[];
  }> {
    const requestId = crypto.randomUUID();
    try {
      this.logger.log(`[${requestId}] Generating comprehensive validation report for framework: ${frameworkId || 'all-rules'}`);

      const validationResults = frameworkId
        ? await this.detectionService.getFrameworkValidationResults(frameworkId)
        : await this.detectionService.getAllValidationHistory();

      const report = await generateDetectionValidationReport(
        frameworkId || 'all-rules',
        validationResults,
        this.sequelize,
      );

      this.logger.log(`[${requestId}] Validation report generated with ${validationResults.length} validation results`);
      return report;
    } catch (error) {
      this.logger.error(`[${requestId}] Failed to generate validation report: ${error.message}`, error.stack);
      throw new InternalServerErrorException({
        message: 'Failed to generate validation report',
        requestId,
        error: error.message,
      });
    }
  }

  /**
   * Generate executive briefing
   */
  @Get('reports/executive-briefing')
  @ApiOperation({ summary: 'Generate executive briefing on detection program' })
  @ApiQuery({ name: 'timeframe', example: 'Q4 2025' })
  @ApiResponse({ status: 200, description: 'Executive briefing generated' })
  async generateExecutiveBriefing(
    @Query('timeframe') timeframe: string,
  ): Promise<{
    summary: string;
    keyMetrics: any;
    criticalFindings: string[];
    businessImpact: string;
    investmentRecommendations: string[];
  }> {
    const requestId = crypto.randomUUID();
    try {
      this.logger.log(`[${requestId}] Generating executive briefing for ${timeframe}`);
      if (!timeframe) {
        throw new BadRequestException('Timeframe is required for executive briefing');
      }

      const validationResults = await this.detectionService.getAllValidationHistory();
      const briefing = generateValidationExecutiveBriefing(validationResults, timeframe);

      this.logger.log(`[${requestId}] Executive briefing generated successfully for timeframe: ${timeframe}`);
      return briefing;
    } catch (error) {
      this.logger.error(`[${requestId}] Failed to generate executive briefing: ${error.message}`, error.stack);
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException({
        message: 'Failed to generate executive briefing',
        requestId,
        error: error.message,
      });
    }
  }
}

// ============================================================================
// SERVICE CLASS
// ============================================================================

@Injectable()
export class DetectionEngineeringService {
  private readonly logger = new Logger(DetectionEngineeringService.name);
  private rules: Map<string, DetectionRule> = new Map();
  private projects: Map<string, DetectionProject> = new Map();
  private validationHistory: DetectionValidationResult[] = [];

  constructor(private readonly sequelize: Sequelize) {}

  /**
   * Create detection rule
   */
  async createRule(ruleData: Partial<DetectionRule>): Promise<DetectionRule> {
    const rule: DetectionRule = {
      id: crypto.randomUUID(),
      name: ruleData.name || '',
      description: ruleData.description || '',
      status: ruleData.status || DetectionRuleStatus.DRAFT,
      severity: ruleData.severity || DetectionSeverity.MEDIUM,
      category: ruleData.category || DetectionCategory.MALWARE,
      mitreAttackIds: ruleData.mitreAttackIds || [],
      logic: ruleData.logic || { query: '', queryLanguage: 'KQL' },
      platforms: ruleData.platforms || [],
      dataSources: ruleData.dataSources || [],
      author: ruleData.author || 'Unknown',
      version: ruleData.version || '1.0.0',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.rules.set(rule.id, rule);
    this.logger.log(`Created detection rule: ${rule.id}`);
    return rule;
  }

  /**
   * Get detection rule
   */
  async getRule(ruleId: string): Promise<DetectionRule | undefined> {
    return this.rules.get(ruleId);
  }

  /**
   * Update rule status
   */
  async updateRuleStatus(ruleId: string, status: DetectionRuleStatus): Promise<void> {
    const rule = this.rules.get(ruleId);
    if (rule) {
      rule.status = status;
      rule.updatedAt = new Date();
      this.logger.log(`Updated rule ${ruleId} status to ${status}`);
    }
  }

  /**
   * Get validation history for a rule
   */
  async getValidationHistory(ruleId: string): Promise<DetectionValidationResult[]> {
    return this.validationHistory.filter((v) => v.detectionRuleId === ruleId);
  }

  /**
   * Get all validation history
   */
  async getAllValidationHistory(): Promise<DetectionValidationResult[]> {
    return this.validationHistory;
  }

  /**
   * Get validation results for multiple rules
   */
  async getMultipleRuleValidations(ruleIds: string[]): Promise<DetectionValidationResult[]> {
    return this.validationHistory.filter((v) => ruleIds.includes(v.detectionRuleId));
  }

  /**
   * Get all rule IDs
   */
  async getAllRuleIds(): Promise<string[]> {
    return Array.from(this.rules.keys());
  }

  /**
   * Create detection project
   */
  async createProject(projectData: Partial<DetectionProject>): Promise<DetectionProject> {
    const project: DetectionProject = {
      id: crypto.randomUUID(),
      name: projectData.name || '',
      description: projectData.description || '',
      objective: projectData.objective || '',
      stage: projectData.stage || WorkflowStage.REQUIREMENTS,
      rules: projectData.rules || [],
      team: projectData.team || [],
      startDate: projectData.startDate || new Date(),
      targetDeploymentDate: projectData.targetDeploymentDate,
      status: projectData.status || 'active',
      metrics: projectData.metrics || {
        totalRules: 0,
        rulesInProduction: 0,
        rulesCoveragePct: 0,
        avgQualityScore: 0,
        avgValidationScore: 0,
        teamVelocity: 0,
      },
    };

    this.projects.set(project.id, project);
    return project;
  }

  /**
   * Get framework validation results
   */
  async getFrameworkValidationResults(frameworkId: string): Promise<DetectionValidationResult[]> {
    return this.validationHistory.filter((v) => v.frameworkId === frameworkId);
  }
}

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default {
  DetectionEngineeringController,
  DetectionEngineeringService,
};
