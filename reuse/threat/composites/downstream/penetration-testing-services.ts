/**
 * LOC: PENTESTSERV001
 * File: /reuse/threat/composites/downstream/penetration-testing-services.ts
 *
 * UPSTREAM (imports from):
 *   - ../adversary-simulation-composite.ts
 *
 * DOWNSTREAM (imported by):
 *   - Red team operation platforms
 *   - Security testing frameworks
 *   - Purple team collaboration tools
 *   - Vulnerability management systems
 *   - SOC automation platforms
 */

/**
 * File: /reuse/threat/composites/downstream/penetration-testing-services.ts
 * Locator: WC-DOWN-PENTESTSERV-001
 * Purpose: Penetration Testing Services - Comprehensive security testing and validation platform
 *
 * Upstream: adversary-simulation-composite.ts
 * Downstream: Red team operations, Security testing, Purple team, Vulnerability management
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize
 * Exports: Penetration testing REST API, red team campaign management, attack simulation
 *
 * LLM Context: Enterprise-grade penetration testing service for White Cross healthcare platform.
 * Provides comprehensive offensive security capabilities including penetration test lifecycle management,
 * red team campaign orchestration, attack path simulation, breach and attack simulation (BAS), adversary
 * emulation exercises, purple team coordination, vulnerability assessment, exploit validation, lateral
 * movement testing, and HIPAA-compliant security validation. Enables security teams to proactively identify
 * weaknesses, validate detection capabilities, assess security controls, and measure defensive posture
 * through controlled attack simulations in healthcare environments.
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
  UnauthorizedException,
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

// Import from adversary-simulation-composite
import {
  RedTeamCampaign,
  OperationObjective,
  TeamComposition,
  TargetEnvironment,
  EnvironmentScope,
  BusinessHours,
  RulesOfEngagement,
  DataHandlingRules,
  ReportingRequirements,
  SafetyControls,
  OperationTimeline,
  OperationPhase,
  Milestone,
  OperationFinding,
  Evidence,
  CampaignMetrics,
  AttackScenario,
  AdversaryProfile,
  AttackFlow,
  AttackStep,
  DetectionPoint,
  BreachSimulationResult,
  SimulationMetrics,
  LateralMovementPath,
  LateralMovementStep,
  ExfiltrationSimulation,
  createRedTeamCampaign,
  generateAttackChainsFromThreatModel,
  executeRedTeamCampaign,
  createAttackScenarioFromAdversary,
  simulateBreachScenario,
  simulateLateralMovement,
  simulateDataExfiltration,
  generateRedTeamReport,
  createAssumedBreachScenario,
  simulateRansomwareAttack,
  analyzeCampaignEffectiveness,
  generateSimulationMetricsDashboard,
  coordinateMultiTeamExercise,
  generatePenTestPlanFromThreatModel,
  executeAutomatedAttackSimulation,
  createCustomAdversaryProfile,
  simulateInsiderThreatScenario,
  createSupplyChainAttackSimulation,
  simulatePrivilegeEscalationPaths,
  generateAttackNarrativeReport,
  calculateAdversaryDwellTime,
  simulatePhishingCampaign,
  createDetectionEvasionTest,
  generateAdversaryCapabilityMatrix,
  AttackSimulationFramework,
  MITRETechniqueEmulation,
  PurpleTeamExercise,
  AttackPathSimulation,
  AttackChain,
  DetectionRuleValidation,
  createAttackSimulationFramework,
  validateFrameworkSafety,
  scheduleFrameworkExecution,
  executeAttackSimulationFramework,
  createMITRETechniqueEmulation,
  mapTechniqueToHealthcareThreats,
  generateAtomicTest,
  executeMITRETechniqueEmulation,
  validateTechniqueDetectionCoverage,
  createPurpleTeamExercise,
  coordinateTeamActivities,
  trackPurpleTeamProgress,
  generatePurpleTeamReport,
  facilitatePurpleTeamCommunication,
  createAttackPathSimulation,
  simulateAttackPath,
  analyzeAttackPathEffectiveness,
  generateAttackGraph,
  createDetectionRuleValidation,
  validateDetectionRule,
} from '../adversary-simulation-composite';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Penetration test status
 */
export enum PenTestStatus {
  PLANNING = 'PLANNING',
  SCOPING = 'SCOPING',
  APPROVED = 'APPROVED',
  IN_PROGRESS = 'IN_PROGRESS',
  PAUSED = 'PAUSED',
  REPORTING = 'REPORTING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

/**
 * Penetration test type
 */
export enum PenTestType {
  EXTERNAL = 'EXTERNAL',
  INTERNAL = 'INTERNAL',
  WEB_APPLICATION = 'WEB_APPLICATION',
  MOBILE_APPLICATION = 'MOBILE_APPLICATION',
  WIRELESS = 'WIRELESS',
  SOCIAL_ENGINEERING = 'SOCIAL_ENGINEERING',
  PHYSICAL = 'PHYSICAL',
  RED_TEAM = 'RED_TEAM',
  PURPLE_TEAM = 'PURPLE_TEAM',
}

/**
 * Attack simulation status
 */
export enum SimulationStatus {
  SCHEDULED = 'SCHEDULED',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  STOPPED = 'STOPPED',
}

/**
 * Vulnerability severity (CVSS-based)
 */
export enum VulnerabilitySeverity {
  CRITICAL = 'CRITICAL', // 9.0-10.0
  HIGH = 'HIGH', // 7.0-8.9
  MEDIUM = 'MEDIUM', // 4.0-6.9
  LOW = 'LOW', // 0.1-3.9
  INFO = 'INFO', // 0.0
}

/**
 * Penetration test engagement
 */
export interface PenTestEngagement {
  id: string;
  name: string;
  description: string;
  type: PenTestType;
  status: PenTestStatus;
  targetEnvironment: TargetEnvironment;
  rulesOfEngagement: RulesOfEngagement;
  objectives: OperationObjective[];
  team: TeamComposition;
  timeline: OperationTimeline;
  startDate?: Date;
  endDate?: Date;
  findings: OperationFinding[];
  vulnerabilities: Vulnerability[];
  metrics: EngagementMetrics;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Vulnerability finding
 */
export interface Vulnerability {
  id: string;
  title: string;
  description: string;
  severity: VulnerabilitySeverity;
  cvssScore: number;
  cvssVector?: string;
  affectedAssets: string[];
  exploitAvailable: boolean;
  exploited: boolean;
  mitreTechniques: string[];
  owaspCategory?: string;
  remediation: RemediationDetails;
  evidence: Evidence[];
  discoveredAt: Date;
  status: 'OPEN' | 'IN_REMEDIATION' | 'VERIFIED' | 'CLOSED' | 'ACCEPTED_RISK';
}

/**
 * Remediation details
 */
export interface RemediationDetails {
  recommendation: string;
  effort: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';
  priority: number; // 1-10
  estimatedTimeline: string;
  references: string[];
  verificationSteps: string[];
}

/**
 * Engagement metrics
 */
export interface EngagementMetrics {
  totalVulnerabilities: number;
  criticalVulnerabilities: number;
  highVulnerabilities: number;
  mediumVulnerabilities: number;
  lowVulnerabilities: number;
  exploitSuccess: number;
  detectionRate: number;
  meanTimeToDetect: number;
  coverageScore: number;
}

/**
 * Attack simulation execution
 */
export interface AttackSimulationExecution {
  id: string;
  frameworkId: string;
  scenarioId?: string;
  status: SimulationStatus;
  adversaryProfile?: AdversaryProfile;
  attackScenario?: AttackScenario;
  startTime: Date;
  endTime?: Date;
  results?: SimulationExecutionResult;
  detectionPoints: DetectionPoint[];
  metadata?: Record<string, any>;
}

/**
 * Simulation execution result
 */
export interface SimulationExecutionResult {
  executionId: string;
  success: boolean;
  objectivesAchieved: string[];
  objectivesFailed: string[];
  attackStepsCompleted: number;
  attackStepsTotal: number;
  detectionsTriggered: number;
  dwellTime: number;
  lateralMovementPaths: LateralMovementPath[];
  exfiltrationResults?: ExfiltrationSimulation;
  metrics: SimulationMetrics;
  lessons: string[];
}

/**
 * Purple team exercise session
 */
export interface PurpleTeamSession {
  id: string;
  exerciseId: string;
  name: string;
  redTeamObjective: string;
  blueTeamObjective: string;
  status: 'PLANNING' | 'ACTIVE' | 'DEBRIEFING' | 'COMPLETED';
  techniques: string[];
  results: PurpleTeamResults;
  startTime: Date;
  endTime?: Date;
}

/**
 * Purple team results
 */
export interface PurpleTeamResults {
  techniquesExecuted: number;
  techniquesTested: number;
  detectionsValidated: number;
  detectionGaps: string[];
  improvements: string[];
  collaborationScore: number;
  effectiveness: number;
}

// ============================================================================
// DTO CLASSES
// ============================================================================

export class CreatePenTestEngagementDto {
  @ApiProperty({ description: 'Engagement name', example: 'Q4 2025 Healthcare Infrastructure Pentest' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Engagement description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ enum: PenTestType, example: PenTestType.RED_TEAM })
  @IsEnum(PenTestType)
  type: PenTestType;

  @ApiProperty({ description: 'Target environment details' })
  @IsNotEmpty()
  targetEnvironment: TargetEnvironment;

  @ApiProperty({ description: 'Rules of engagement' })
  @IsNotEmpty()
  rulesOfEngagement: RulesOfEngagement;

  @ApiProperty({ description: 'Engagement objectives', type: 'array' })
  @IsArray()
  objectives: OperationObjective[];

  @ApiProperty({ description: 'Team composition' })
  @IsNotEmpty()
  team: TeamComposition;

  @ApiProperty({ description: 'Planned start date', required: false })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  startDate?: Date;

  @ApiProperty({ description: 'Planned end date', required: false })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  endDate?: Date;
}

export class CreateRedTeamCampaignDto {
  @ApiProperty({ description: 'Campaign name', example: 'Healthcare Ransomware Emulation' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Campaign description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Operation objectives', type: 'array' })
  @IsArray()
  objectives: OperationObjective[];

  @ApiProperty({ description: 'Target environment' })
  @IsNotEmpty()
  targetEnvironment: TargetEnvironment;

  @ApiProperty({ description: 'Adversary profile to emulate', required: false })
  @IsOptional()
  adversaryProfile?: AdversaryProfile;

  @ApiProperty({ description: 'MITRE ATT&CK techniques to test', type: 'array', required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  mitreTechniques?: string[];
}

export class CreateAttackSimulationDto {
  @ApiProperty({ description: 'Simulation framework name' })
  @IsString()
  @IsNotEmpty()
  frameworkName: string;

  @ApiProperty({ description: 'Attack scenario name' })
  @IsString()
  @IsNotEmpty()
  scenarioName: string;

  @ApiProperty({ description: 'Target assets', type: 'array' })
  @IsArray()
  @IsString({ each: true })
  targetAssets: string[];

  @ApiProperty({ description: 'Attack chain to simulate', type: 'array', required: false })
  @IsArray()
  @IsOptional()
  attackChain?: AttackStep[];

  @ApiProperty({ description: 'Adversary profile', required: false })
  @IsOptional()
  adversaryProfile?: AdversaryProfile;
}

export class ExecuteAttackSimulationDto {
  @ApiProperty({ description: 'Simulation framework ID' })
  @IsUUID()
  @IsNotEmpty()
  frameworkId: string;

  @ApiProperty({ description: 'Attack scenario ID', required: false })
  @IsUUID()
  @IsOptional()
  scenarioId?: string;

  @ApiProperty({ description: 'Auto-stop on detection', default: false })
  @IsBoolean()
  @IsOptional()
  autoStopOnDetection?: boolean = false;

  @ApiProperty({ description: 'Maximum execution time (minutes)', example: 120 })
  @IsNumber()
  @Min(1)
  @Max(480)
  @IsOptional()
  maxExecutionTime?: number = 120;
}

export class CreatePurpleTeamExerciseDto {
  @ApiProperty({ description: 'Exercise name', example: 'Credential Access Detection Validation' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Exercise description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Red team objectives', type: 'array' })
  @IsArray()
  @IsString({ each: true })
  redTeamObjectives: string[];

  @ApiProperty({ description: 'Blue team objectives', type: 'array' })
  @IsArray()
  @IsString({ each: true })
  blueTeamObjectives: string[];

  @ApiProperty({ description: 'MITRE ATT&CK techniques to validate', type: 'array' })
  @IsArray()
  @IsString({ each: true })
  techniques: string[];

  @ApiProperty({ description: 'Detection rules to test', type: 'array', required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  detectionRules?: string[];
}

export class ReportVulnerabilityDto {
  @ApiProperty({ description: 'Engagement ID' })
  @IsUUID()
  @IsNotEmpty()
  engagementId: string;

  @ApiProperty({ description: 'Vulnerability title', example: 'SQL Injection in Patient Portal' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Detailed description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ enum: VulnerabilitySeverity, example: VulnerabilitySeverity.CRITICAL })
  @IsEnum(VulnerabilitySeverity)
  severity: VulnerabilitySeverity;

  @ApiProperty({ description: 'CVSS score (0-10)', example: 9.2 })
  @IsNumber()
  @Min(0)
  @Max(10)
  cvssScore: number;

  @ApiProperty({ description: 'Affected assets', type: 'array' })
  @IsArray()
  @IsString({ each: true })
  affectedAssets: string[];

  @ApiProperty({ description: 'Remediation recommendation' })
  @IsString()
  @IsNotEmpty()
  remediationRecommendation: string;

  @ApiProperty({ description: 'MITRE ATT&CK techniques', type: 'array', required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  mitreTechniques?: string[];
}

export class SimulateLateralMovementDto {
  @ApiProperty({ description: 'Starting point asset ID' })
  @IsString()
  @IsNotEmpty()
  startAssetId: string;

  @ApiProperty({ description: 'Target asset ID' })
  @IsString()
  @IsNotEmpty()
  targetAssetId: string;

  @ApiProperty({ description: 'Maximum hops', example: 5, default: 5 })
  @IsNumber()
  @Min(1)
  @Max(10)
  @IsOptional()
  maxHops?: number = 5;

  @ApiProperty({ description: 'Stealth mode enabled', default: true })
  @IsBoolean()
  @IsOptional()
  stealthMode?: boolean = true;
}

export class SimulateDataExfiltrationDto {
  @ApiProperty({ description: 'Source asset ID' })
  @IsString()
  @IsNotEmpty()
  sourceAssetId: string;

  @ApiProperty({ description: 'Data volume (MB)', example: 100 })
  @IsNumber()
  @Min(1)
  dataVolumeMB: number;

  @ApiProperty({ description: 'Exfiltration method', example: 'DNS tunneling' })
  @IsString()
  @IsNotEmpty()
  method: string;

  @ApiProperty({ description: 'Destination', example: 'attacker-c2.example.com' })
  @IsString()
  @IsNotEmpty()
  destination: string;
}

// ============================================================================
// NESTJS CONTROLLER
// ============================================================================

@ApiTags('penetration-testing')
@Controller('api/v1/penetration-testing')
@ApiBearerAuth()
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class PenetrationTestingController {
  private readonly logger = new Logger(PenetrationTestingController.name);

  constructor(
    private readonly sequelize: Sequelize,
    private readonly pentestService: PenetrationTestingService,
  ) {}

  /**
   * Create penetration test engagement
   */
  @Post('engagements')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create penetration test engagement' })
  @ApiBody({ type: CreatePenTestEngagementDto })
  @ApiResponse({ status: 201, description: 'Engagement created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid engagement configuration' })
  async createEngagement(@Body() dto: CreatePenTestEngagementDto): Promise<PenTestEngagement> {
    const requestId = crypto.randomUUID();
    try {
      this.logger.log(`[${requestId}] Creating penetration test engagement: ${dto.name}`);

      if (!dto || !dto.name || !dto.description) {
        throw new BadRequestException({
          message: 'Invalid engagement configuration',
          requestId,
          details: 'name and description are required',
        });
      }

      const result = await this.pentestService.createEngagement(dto);
      this.logger.log(`[${requestId}] Engagement created successfully: ${result.id}`);
      return result;

    } catch (error) {
      this.logger.error(`[${requestId}] Failed to create engagement: ${error.message}`, error.stack);

      if (error instanceof BadRequestException) throw error;
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException({
        message: 'Failed to create penetration test engagement',
        requestId,
        error: error.message,
      });
    }
  }

  /**
   * Get engagements
   */
  @Get('engagements')
  @ApiOperation({ summary: 'Get all penetration test engagements' })
  @ApiQuery({ name: 'status', enum: PenTestStatus, required: false })
  @ApiQuery({ name: 'type', enum: PenTestType, required: false })
  @ApiResponse({ status: 200, description: 'Engagements retrieved' })
  async getEngagements(
    @Query('status') status?: PenTestStatus,
    @Query('type') type?: PenTestType,
  ): Promise<{
    totalEngagements: number;
    activeEngagements: number;
    engagements: PenTestEngagement[];
  }> {
    const requestId = crypto.randomUUID();
    try {
      this.logger.log(`[${requestId}] Retrieving engagements with status: ${status}, type: ${type}`);

      const engagements = await this.pentestService.getEngagements(status, type);

      this.logger.log(`[${requestId}] Retrieved ${engagements.length} engagements`);
      return {
        totalEngagements: engagements.length,
        activeEngagements: engagements.filter((e) => e.status === PenTestStatus.IN_PROGRESS).length,
        engagements,
      };
    } catch (error) {
      this.logger.error(`[${requestId}] Failed to retrieve engagements: ${error.message}`, error.stack);

      if (error instanceof BadRequestException) throw error;
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException({
        message: 'Failed to retrieve penetration test engagements',
        requestId,
        error: error.message,
      });
    }
  }

  /**
   * Get engagement details
   */
  @Get('engagements/:engagementId')
  @ApiOperation({ summary: 'Get penetration test engagement details' })
  @ApiParam({ name: 'engagementId', description: 'Engagement ID' })
  @ApiResponse({ status: 200, description: 'Engagement details retrieved' })
  @ApiResponse({ status: 404, description: 'Engagement not found' })
  async getEngagement(
    @Param('engagementId', ParseUUIDPipe) engagementId: string,
  ): Promise<PenTestEngagement> {
    const requestId = crypto.randomUUID();
    try {
      this.logger.log(`[${requestId}] Retrieving engagement: ${engagementId}`);

      if (!engagementId) {
        throw new BadRequestException({
          message: 'Engagement ID is required',
          requestId,
        });
      }

      const result = await this.pentestService.getEngagement(engagementId);
      this.logger.log(`[${requestId}] Engagement retrieved successfully`);
      return result;

    } catch (error) {
      this.logger.error(`[${requestId}] Failed to retrieve engagement: ${error.message}`, error.stack);

      if (error instanceof BadRequestException) throw error;
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException({
        message: 'Failed to retrieve engagement details',
        requestId,
        error: error.message,
      });
    }
  }

  /**
   * Update engagement status
   */
  @Patch('engagements/:engagementId/status')
  @ApiOperation({ summary: 'Update engagement status' })
  @ApiParam({ name: 'engagementId', description: 'Engagement ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', enum: Object.values(PenTestStatus) },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Status updated' })
  async updateEngagementStatus(
    @Param('engagementId', ParseUUIDPipe) engagementId: string,
    @Body('status') status: PenTestStatus,
  ): Promise<PenTestEngagement> {
    const requestId = crypto.randomUUID();
    try {
      this.logger.log(`[${requestId}] Updating engagement ${engagementId} status to ${status}`);

      if (!engagementId || !status) {
        throw new BadRequestException({
          message: 'Missing required parameters',
          requestId,
          details: 'engagementId and status are required',
        });
      }

      const result = await this.pentestService.updateEngagementStatus(engagementId, status);
      this.logger.log(`[${requestId}] Status updated successfully to ${status}`);
      return result;

    } catch (error) {
      this.logger.error(`[${requestId}] Failed to update engagement status: ${error.message}`, error.stack);

      if (error instanceof BadRequestException) throw error;
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException({
        message: 'Failed to update engagement status',
        requestId,
        error: error.message,
      });
    }
  }

  /**
   * Create red team campaign
   */
  @Post('red-team/campaigns')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create red team operation campaign' })
  @ApiBody({ type: CreateRedTeamCampaignDto })
  @ApiResponse({ status: 201, description: 'Campaign created successfully' })
  async createRedTeamCampaign(@Body() dto: CreateRedTeamCampaignDto): Promise<RedTeamCampaign> {
    const requestId = crypto.randomUUID();
    try {
      this.logger.log(`[${requestId}] Creating red team campaign: ${dto.name}`);

      if (!dto || !dto.name || !dto.objectives || !dto.targetEnvironment) {
        throw new BadRequestException({
          message: 'Invalid campaign configuration',
          requestId,
          details: 'name, objectives, and targetEnvironment are required',
        });
      }

      const campaign = await createRedTeamCampaign(
        dto.name,
        dto.objectives,
        dto.targetEnvironment,
        this.sequelize,
      );

      await this.pentestService.storeRedTeamCampaign(campaign);
      this.logger.log(`[${requestId}] Red team campaign created successfully: ${campaign.id}`);

      return campaign;

    } catch (error) {
      this.logger.error(`[${requestId}] Failed to create red team campaign: ${error.message}`, error.stack);

      if (error instanceof BadRequestException) throw error;
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException({
        message: 'Failed to create red team campaign',
        requestId,
        error: error.message,
      });
    }
  }

  /**
   * Execute red team campaign
   */
  @Post('red-team/campaigns/:campaignId/execute')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Execute red team campaign' })
  @ApiParam({ name: 'campaignId', description: 'Campaign ID' })
  @ApiResponse({ status: 200, description: 'Campaign execution started' })
  async executeRedTeamCampaign(
    @Param('campaignId', ParseUUIDPipe) campaignId: string,
  ): Promise<{
    campaignId: string;
    status: string;
    message: string;
    executionId: string;
  }> {
    const requestId = crypto.randomUUID();
    try {
      this.logger.log(`[${requestId}] Executing red team campaign: ${campaignId}`);

      if (!campaignId) {
        throw new BadRequestException({
          message: 'Campaign ID is required',
          requestId,
        });
      }

      const campaign = await this.pentestService.getRedTeamCampaign(campaignId);

      const executionResult = await executeRedTeamCampaign(
        campaign,
        campaign.targetEnvironment,
        this.sequelize,
      );

      this.logger.log(`[${requestId}] Campaign execution started: ${executionResult.id}`);
      return {
        campaignId,
        status: 'STARTED',
        message: 'Red team campaign execution initiated',
        executionId: executionResult.id,
      };

    } catch (error) {
      this.logger.error(`[${requestId}] Failed to execute red team campaign: ${error.message}`, error.stack);

      if (error instanceof BadRequestException) throw error;
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException({
        message: 'Failed to execute red team campaign',
        requestId,
        error: error.message,
      });
    }
  }

  /**
   * Create attack simulation framework
   */
  @Post('attack-simulation/frameworks')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create attack simulation framework' })
  @ApiBody({ type: CreateAttackSimulationDto })
  @ApiResponse({ status: 201, description: 'Framework created successfully' })
  async createAttackSimulation(
    @Body() dto: CreateAttackSimulationDto,
  ): Promise<AttackSimulationFramework> {
    const requestId = crypto.randomUUID();
    try {
      this.logger.log(`[${requestId}] Creating attack simulation framework: ${dto.frameworkName}`);

      if (!dto || !dto.frameworkName || !dto.targetAssets) {
        throw new BadRequestException({
          message: 'Invalid framework configuration',
          requestId,
          details: 'frameworkName and targetAssets are required',
        });
      }

      const framework = await createAttackSimulationFramework(
        dto.frameworkName,
        dto.targetAssets,
        this.sequelize,
      );

      const safetyValidation = validateFrameworkSafety(framework);
      if (!safetyValidation.safe) {
        throw new BadRequestException({
          message: 'Framework failed safety validation',
          requestId,
          issues: safetyValidation.issues,
        });
      }

      await this.pentestService.storeAttackSimulation(framework);
      this.logger.log(`[${requestId}] Attack simulation framework created: ${framework.id}`);

      return framework;

    } catch (error) {
      this.logger.error(`[${requestId}] Failed to create attack simulation: ${error.message}`, error.stack);

      if (error instanceof BadRequestException) throw error;
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException({
        message: 'Failed to create attack simulation framework',
        requestId,
        error: error.message,
      });
    }
  }

  /**
   * Execute attack simulation
   */
  @Post('attack-simulation/execute')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Execute attack simulation' })
  @ApiBody({ type: ExecuteAttackSimulationDto })
  @ApiResponse({ status: 200, description: 'Simulation execution started' })
  async executeAttackSimulation(@Body() dto: ExecuteAttackSimulationDto): Promise<{
    executionId: string;
    status: SimulationStatus;
    frameworkId: string;
    startTime: Date;
  }> {
    const requestId = crypto.randomUUID();
    try {
      this.logger.log(`[${requestId}] Executing attack simulation for framework ${dto.frameworkId}`);

      if (!dto || !dto.frameworkId) {
        throw new BadRequestException({
          message: 'Invalid simulation configuration',
          requestId,
          details: 'frameworkId is required',
        });
      }

      const framework = await this.pentestService.getAttackSimulation(dto.frameworkId);

      const execution = await executeAttackSimulationFramework(
        framework,
        dto.autoStopOnDetection || false,
        this.sequelize,
      );

      const attackExecution: AttackSimulationExecution = {
        id: crypto.randomUUID(),
        frameworkId: dto.frameworkId,
        scenarioId: dto.scenarioId,
        status: SimulationStatus.RUNNING,
        startTime: new Date(),
        detectionPoints: [],
      };

      await this.pentestService.storeAttackExecution(attackExecution);
      this.logger.log(`[${requestId}] Attack simulation execution started: ${attackExecution.id}`);

      return {
        executionId: attackExecution.id,
        status: attackExecution.status,
        frameworkId: dto.frameworkId,
        startTime: attackExecution.startTime,
      };

    } catch (error) {
      this.logger.error(`[${requestId}] Failed to execute attack simulation: ${error.message}`, error.stack);

      if (error instanceof BadRequestException) throw error;
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException({
        message: 'Failed to execute attack simulation',
        requestId,
        error: error.message,
      });
    }
  }

  /**
   * Simulate breach scenario
   */
  @Post('scenarios/breach-simulation')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Simulate breach and attack scenario' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        scenarioType: { type: 'string', example: 'ransomware' },
        entryPoint: { type: 'string', example: 'phishing-email' },
        targetAsset: { type: 'string', example: 'patient-database' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Breach simulation completed' })
  async simulateBreach(
    @Body('scenarioType') scenarioType: string,
    @Body('entryPoint') entryPoint: string,
    @Body('targetAsset') targetAsset: string,
  ): Promise<BreachSimulationResult> {
    const requestId = crypto.randomUUID();
    try {
      this.logger.log(`[${requestId}] Simulating breach scenario: ${scenarioType}`);

      if (!scenarioType || !entryPoint || !targetAsset) {
        throw new BadRequestException({
          message: 'Missing scenario parameters',
          requestId,
          details: 'scenarioType, entryPoint, and targetAsset are required',
        });
      }

      const scenario = createAssumedBreachScenario(entryPoint, targetAsset);
      const result = await simulateBreachScenario(scenario, targetAsset, this.sequelize);

      this.logger.log(`[${requestId}] Breach scenario simulation completed`);
      return result;

    } catch (error) {
      this.logger.error(`[${requestId}] Failed to simulate breach: ${error.message}`, error.stack);

      if (error instanceof BadRequestException) throw error;
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException({
        message: 'Failed to simulate breach scenario',
        requestId,
        error: error.message,
      });
    }
  }

  /**
   * Simulate lateral movement
   */
  @Post('attack-techniques/lateral-movement')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Simulate lateral movement through network' })
  @ApiBody({ type: SimulateLateralMovementDto })
  @ApiResponse({ status: 200, description: 'Lateral movement simulation completed' })
  async simulateLateralMovement(@Body() dto: SimulateLateralMovementDto): Promise<{
    success: boolean;
    pathsFound: number;
    paths: LateralMovementPath[];
    detectedSteps: number;
    recommendations: string[];
  }> {
    const requestId = crypto.randomUUID();
    try {
      this.logger.log(`[${requestId}] Simulating lateral movement from ${dto.startAssetId} to ${dto.targetAssetId}`);

      if (!dto || !dto.startAssetId || !dto.targetAssetId) {
        throw new BadRequestException({
          message: 'Invalid movement parameters',
          requestId,
          details: 'startAssetId and targetAssetId are required',
        });
      }

      const paths = await simulateLateralMovement(
        dto.startAssetId,
        dto.targetAssetId,
        dto.maxHops || 5,
        this.sequelize,
      );

      const detectedSteps = paths.reduce((sum, path) => sum + path.steps.filter((s) => s.detected).length, 0);

      this.logger.log(`[${requestId}] Lateral movement simulation completed: ${paths.length} paths found`);
      return {
        success: paths.length > 0,
        pathsFound: paths.length,
        paths,
        detectedSteps,
        recommendations: this.pentestService.generateLateralMovementRecommendations(paths),
      };

    } catch (error) {
      this.logger.error(`[${requestId}] Failed to simulate lateral movement: ${error.message}`, error.stack);

      if (error instanceof BadRequestException) throw error;
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException({
        message: 'Failed to simulate lateral movement',
        requestId,
        error: error.message,
      });
    }
  }

  /**
   * Simulate data exfiltration
   */
  @Post('attack-techniques/data-exfiltration')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Simulate data exfiltration attack' })
  @ApiBody({ type: SimulateDataExfiltrationDto })
  @ApiResponse({ status: 200, description: 'Data exfiltration simulation completed' })
  async simulateDataExfiltration(@Body() dto: SimulateDataExfiltrationDto): Promise<{
    executionId: string;
    result: ExfiltrationSimulation;
    detected: boolean;
    recommendations: string[];
  }> {
    const requestId = crypto.randomUUID();
    try {
      this.logger.log(`[${requestId}] Simulating data exfiltration: ${dto.dataVolumeMB}MB via ${dto.method}`);

      if (!dto || !dto.sourceAssetId || !dto.dataVolumeMB || !dto.method) {
        throw new BadRequestException({
          message: 'Invalid exfiltration parameters',
          requestId,
          details: 'sourceAssetId, dataVolumeMB, and method are required',
        });
      }

      const result = await simulateDataExfiltration(
        dto.sourceAssetId,
        dto.dataVolumeMB,
        dto.method,
        this.sequelize,
      );

      this.logger.log(`[${requestId}] Data exfiltration simulation completed`);
      return {
        executionId: crypto.randomUUID(),
        result,
        detected: result.detected,
        recommendations: [
          result.detected
            ? 'DLP controls detected exfiltration - good coverage'
            : 'CRITICAL: Data exfiltration went undetected - implement DLP controls',
          'Review egress filtering rules',
          'Monitor for DNS tunneling patterns',
        ],
      };

    } catch (error) {
      this.logger.error(`[${requestId}] Failed to simulate data exfiltration: ${error.message}`, error.stack);

      if (error instanceof BadRequestException) throw error;
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException({
        message: 'Failed to simulate data exfiltration',
        requestId,
        error: error.message,
      });
    }
  }

  /**
   * Create purple team exercise
   */
  @Post('purple-team/exercises')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create purple team exercise' })
  @ApiBody({ type: CreatePurpleTeamExerciseDto })
  @ApiResponse({ status: 201, description: 'Purple team exercise created' })
  async createPurpleTeamExercise(
    @Body() dto: CreatePurpleTeamExerciseDto,
  ): Promise<PurpleTeamExercise> {
    const requestId = crypto.randomUUID();
    try {
      this.logger.log(`[${requestId}] Creating purple team exercise: ${dto.name}`);

      if (!dto || !dto.name || !dto.redTeamObjectives || !dto.blueTeamObjectives || !dto.techniques) {
        throw new BadRequestException({
          message: 'Invalid exercise configuration',
          requestId,
          details: 'name, redTeamObjectives, blueTeamObjectives, and techniques are required',
        });
      }

      const exercise = await createPurpleTeamExercise(
        dto.name,
        dto.redTeamObjectives,
        dto.blueTeamObjectives,
        dto.techniques,
        this.sequelize,
      );

      await this.pentestService.storePurpleTeamExercise(exercise);
      this.logger.log(`[${requestId}] Purple team exercise created: ${exercise.id}`);

      return exercise;

    } catch (error) {
      this.logger.error(`[${requestId}] Failed to create purple team exercise: ${error.message}`, error.stack);

      if (error instanceof BadRequestException) throw error;
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException({
        message: 'Failed to create purple team exercise',
        requestId,
        error: error.message,
      });
    }
  }

  /**
   * Execute purple team exercise
   */
  @Post('purple-team/exercises/:exerciseId/execute')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Execute purple team exercise' })
  @ApiParam({ name: 'exerciseId', description: 'Exercise ID' })
  @ApiResponse({ status: 200, description: 'Exercise execution started' })
  async executePurpleTeamExercise(
    @Param('exerciseId', ParseUUIDPipe) exerciseId: string,
  ): Promise<{
    exerciseId: string;
    sessionId: string;
    status: string;
    startTime: Date;
  }> {
    const requestId = crypto.randomUUID();
    try {
      this.logger.log(`[${requestId}] Executing purple team exercise: ${exerciseId}`);

      if (!exerciseId) {
        throw new BadRequestException({
          message: 'Exercise ID is required',
          requestId,
        });
      }

      const exercise = await this.pentestService.getPurpleTeamExercise(exerciseId);
      await coordinateTeamActivities(exercise, this.sequelize);

      const session: PurpleTeamSession = {
        id: crypto.randomUUID(),
        exerciseId,
        name: exercise.name,
        redTeamObjective: exercise.redTeamObjectives.join(', '),
        blueTeamObjective: exercise.blueTeamObjectives.join(', '),
        status: 'ACTIVE',
        techniques: exercise.techniques,
        results: {
          techniquesExecuted: 0,
          techniquesTested: 0,
          detectionsValidated: 0,
          detectionGaps: [],
          improvements: [],
          collaborationScore: 0,
          effectiveness: 0,
        },
        startTime: new Date(),
      };

      await this.pentestService.storePurpleTeamSession(session);
      this.logger.log(`[${requestId}] Purple team exercise execution started: ${session.id}`);

      return {
        exerciseId,
        sessionId: session.id,
        status: 'ACTIVE',
        startTime: session.startTime,
      };

    } catch (error) {
      this.logger.error(`[${requestId}] Failed to execute purple team exercise: ${error.message}`, error.stack);

      if (error instanceof BadRequestException) throw error;
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException({
        message: 'Failed to execute purple team exercise',
        requestId,
        error: error.message,
      });
    }
  }

  /**
   * Report vulnerability
   */
  @Post('vulnerabilities/report')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Report discovered vulnerability' })
  @ApiBody({ type: ReportVulnerabilityDto })
  @ApiResponse({ status: 201, description: 'Vulnerability reported successfully' })
  async reportVulnerability(@Body() dto: ReportVulnerabilityDto): Promise<Vulnerability> {
    const requestId = crypto.randomUUID();
    try {
      this.logger.log(`[${requestId}] Reporting vulnerability: ${dto.title} (${dto.severity})`);

      if (!dto || !dto.title || !dto.severity || !dto.engagementId) {
        throw new BadRequestException({
          message: 'Invalid vulnerability report',
          requestId,
          details: 'title, severity, and engagementId are required',
        });
      }

      const result = await this.pentestService.reportVulnerability(dto);
      this.logger.log(`[${requestId}] Vulnerability reported successfully: ${result.id}`);
      return result;

    } catch (error) {
      this.logger.error(`[${requestId}] Failed to report vulnerability: ${error.message}`, error.stack);

      if (error instanceof BadRequestException) throw error;
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException({
        message: 'Failed to report vulnerability',
        requestId,
        error: error.message,
      });
    }
  }

  /**
   * Get engagement vulnerabilities
   */
  @Get('engagements/:engagementId/vulnerabilities')
  @ApiOperation({ summary: 'Get vulnerabilities for engagement' })
  @ApiParam({ name: 'engagementId', description: 'Engagement ID' })
  @ApiQuery({ name: 'severity', enum: VulnerabilitySeverity, required: false })
  @ApiResponse({ status: 200, description: 'Vulnerabilities retrieved' })
  async getEngagementVulnerabilities(
    @Param('engagementId', ParseUUIDPipe) engagementId: string,
    @Query('severity') severity?: VulnerabilitySeverity,
  ): Promise<{
    engagementId: string;
    totalVulnerabilities: number;
    vulnerabilities: Vulnerability[];
    severityBreakdown: Record<string, number>;
  }> {
    const requestId = crypto.randomUUID();
    try {
      this.logger.log(`[${requestId}] Retrieving vulnerabilities for engagement: ${engagementId}`);

      if (!engagementId) {
        throw new BadRequestException({
          message: 'Engagement ID is required',
          requestId,
        });
      }

      const vulnerabilities = await this.pentestService.getEngagementVulnerabilities(engagementId, severity);

      const severityBreakdown: Record<string, number> = {};
      for (const vuln of vulnerabilities) {
        severityBreakdown[vuln.severity] = (severityBreakdown[vuln.severity] || 0) + 1;
      }

      this.logger.log(`[${requestId}] Retrieved ${vulnerabilities.length} vulnerabilities`);
      return {
        engagementId,
        totalVulnerabilities: vulnerabilities.length,
        vulnerabilities,
        severityBreakdown,
      };

    } catch (error) {
      this.logger.error(`[${requestId}] Failed to retrieve vulnerabilities: ${error.message}`, error.stack);

      if (error instanceof BadRequestException) throw error;
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException({
        message: 'Failed to retrieve vulnerabilities',
        requestId,
        error: error.message,
      });
    }
  }

  /**
   * Generate engagement report
   */
  @Get('engagements/:engagementId/report')
  @ApiOperation({ summary: 'Generate penetration test engagement report' })
  @ApiParam({ name: 'engagementId', description: 'Engagement ID' })
  @ApiQuery({ name: 'format', enum: ['executive', 'technical', 'comprehensive'], example: 'comprehensive' })
  @ApiResponse({ status: 200, description: 'Report generated' })
  async generateEngagementReport(
    @Param('engagementId', ParseUUIDPipe) engagementId: string,
    @Query('format') format: string = 'comprehensive',
  ): Promise<{
    reportId: string;
    engagementId: string;
    generatedAt: Date;
    executiveSummary: string;
    findings: OperationFinding[];
    vulnerabilities: Vulnerability[];
    metrics: EngagementMetrics;
    recommendations: string[];
  }> {
    const requestId = crypto.randomUUID();
    try {
      this.logger.log(`[${requestId}] Generating engagement report: ${engagementId} (${format} format)`);

      if (!engagementId) {
        throw new BadRequestException({
          message: 'Engagement ID is required',
          requestId,
        });
      }

      const result = await this.pentestService.generateEngagementReport(engagementId, format);
      this.logger.log(`[${requestId}] Engagement report generated successfully`);
      return result;

    } catch (error) {
      this.logger.error(`[${requestId}] Failed to generate engagement report: ${error.message}`, error.stack);

      if (error instanceof BadRequestException) throw error;
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException({
        message: 'Failed to generate engagement report',
        requestId,
        error: error.message,
      });
    }
  }

  /**
   * Generate metrics dashboard
   */
  @Get('metrics/dashboard')
  @ApiOperation({ summary: 'Generate penetration testing metrics dashboard' })
  @ApiQuery({ name: 'startDate', required: false, type: Date })
  @ApiQuery({ name: 'endDate', required: false, type: Date })
  @ApiResponse({ status: 200, description: 'Dashboard generated' })
  async generateMetricsDashboard(
    @Query('startDate') startDate?: Date,
    @Query('endDate') endDate?: Date,
  ): Promise<{
    period: { start: Date; end: Date };
    summary: {
      totalEngagements: number;
      activeEngagements: number;
      totalVulnerabilities: number;
      criticalVulnerabilities: number;
      averageDetectionRate: number;
    };
    engagementMetrics: EngagementMetrics[];
    trends: any[];
    recommendations: string[];
  }> {
    const requestId = crypto.randomUUID();
    try {
      this.logger.log(`[${requestId}] Generating metrics dashboard`);

      const result = await this.pentestService.generateMetricsDashboard(startDate, endDate);
      this.logger.log(`[${requestId}] Metrics dashboard generated successfully`);
      return result;

    } catch (error) {
      this.logger.error(`[${requestId}] Failed to generate metrics dashboard: ${error.message}`, error.stack);

      if (error instanceof BadRequestException) throw error;
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException({
        message: 'Failed to generate metrics dashboard',
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
export class PenetrationTestingService {
  private readonly logger = new Logger(PenetrationTestingService.name);

  private engagements: Map<string, PenTestEngagement> = new Map();
  private redTeamCampaigns: Map<string, RedTeamCampaign> = new Map();
  private attackSimulations: Map<string, AttackSimulationFramework> = new Map();
  private attackExecutions: Map<string, AttackSimulationExecution> = new Map();
  private purpleTeamExercises: Map<string, PurpleTeamExercise> = new Map();
  private purpleTeamSessions: Map<string, PurpleTeamSession> = new Map();
  private vulnerabilities: Map<string, Vulnerability> = new Map();

  constructor(private readonly sequelize: Sequelize) {}

  /**
   * Create engagement
   */
  async createEngagement(dto: CreatePenTestEngagementDto): Promise<PenTestEngagement> {
    const engagement: PenTestEngagement = {
      id: crypto.randomUUID(),
      name: dto.name,
      description: dto.description,
      type: dto.type,
      status: PenTestStatus.PLANNING,
      targetEnvironment: dto.targetEnvironment,
      rulesOfEngagement: dto.rulesOfEngagement,
      objectives: dto.objectives,
      team: dto.team,
      timeline: {
        phases: [],
        milestones: [],
        estimatedDuration: 0,
      },
      startDate: dto.startDate,
      endDate: dto.endDate,
      findings: [],
      vulnerabilities: [],
      metrics: {
        totalVulnerabilities: 0,
        criticalVulnerabilities: 0,
        highVulnerabilities: 0,
        mediumVulnerabilities: 0,
        lowVulnerabilities: 0,
        exploitSuccess: 0,
        detectionRate: 0,
        meanTimeToDetect: 0,
        coverageScore: 0,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.engagements.set(engagement.id, engagement);
    this.logger.log(`Created penetration test engagement: ${engagement.id}`);

    return engagement;
  }

  /**
   * Get engagements
   */
  async getEngagements(status?: PenTestStatus, type?: PenTestType): Promise<PenTestEngagement[]> {
    let engagements = Array.from(this.engagements.values());

    if (status) {
      engagements = engagements.filter((e) => e.status === status);
    }

    if (type) {
      engagements = engagements.filter((e) => e.type === type);
    }

    return engagements;
  }

  /**
   * Get engagement
   */
  async getEngagement(engagementId: string): Promise<PenTestEngagement> {
    const engagement = this.engagements.get(engagementId);
    if (!engagement) {
      throw new NotFoundException(`Engagement ${engagementId} not found`);
    }
    return engagement;
  }

  /**
   * Update engagement status
   */
  async updateEngagementStatus(
    engagementId: string,
    status: PenTestStatus,
  ): Promise<PenTestEngagement> {
    const engagement = await this.getEngagement(engagementId);
    engagement.status = status;
    engagement.updatedAt = new Date();
    this.engagements.set(engagementId, engagement);
    return engagement;
  }

  /**
   * Store red team campaign
   */
  async storeRedTeamCampaign(campaign: RedTeamCampaign): Promise<void> {
    this.redTeamCampaigns.set(campaign.id, campaign);
  }

  /**
   * Get red team campaign
   */
  async getRedTeamCampaign(campaignId: string): Promise<RedTeamCampaign> {
    const campaign = this.redTeamCampaigns.get(campaignId);
    if (!campaign) {
      throw new NotFoundException(`Red team campaign ${campaignId} not found`);
    }
    return campaign;
  }

  /**
   * Store attack simulation
   */
  async storeAttackSimulation(framework: AttackSimulationFramework): Promise<void> {
    this.attackSimulations.set(framework.id, framework);
  }

  /**
   * Get attack simulation
   */
  async getAttackSimulation(frameworkId: string): Promise<AttackSimulationFramework> {
    const framework = this.attackSimulations.get(frameworkId);
    if (!framework) {
      throw new NotFoundException(`Attack simulation framework ${frameworkId} not found`);
    }
    return framework;
  }

  /**
   * Store attack execution
   */
  async storeAttackExecution(execution: AttackSimulationExecution): Promise<void> {
    this.attackExecutions.set(execution.id, execution);
  }

  /**
   * Store purple team exercise
   */
  async storePurpleTeamExercise(exercise: PurpleTeamExercise): Promise<void> {
    this.purpleTeamExercises.set(exercise.id, exercise);
  }

  /**
   * Get purple team exercise
   */
  async getPurpleTeamExercise(exerciseId: string): Promise<PurpleTeamExercise> {
    const exercise = this.purpleTeamExercises.get(exerciseId);
    if (!exercise) {
      throw new NotFoundException(`Purple team exercise ${exerciseId} not found`);
    }
    return exercise;
  }

  /**
   * Store purple team session
   */
  async storePurpleTeamSession(session: PurpleTeamSession): Promise<void> {
    this.purpleTeamSessions.set(session.id, session);
  }

  /**
   * Report vulnerability
   */
  async reportVulnerability(dto: ReportVulnerabilityDto): Promise<Vulnerability> {
    const vulnerability: Vulnerability = {
      id: crypto.randomUUID(),
      title: dto.title,
      description: dto.description,
      severity: dto.severity,
      cvssScore: dto.cvssScore,
      affectedAssets: dto.affectedAssets,
      exploitAvailable: false,
      exploited: false,
      mitreTechniques: dto.mitreTechniques || [],
      remediation: {
        recommendation: dto.remediationRecommendation,
        effort: this.estimateRemediationEffort(dto.severity),
        priority: this.calculateRemediationPriority(dto.severity, dto.cvssScore),
        estimatedTimeline: this.estimateRemediationTimeline(dto.severity),
        references: [],
        verificationSteps: [],
      },
      evidence: [],
      discoveredAt: new Date(),
      status: 'OPEN',
    };

    this.vulnerabilities.set(vulnerability.id, vulnerability);

    // Add to engagement
    const engagement = await this.getEngagement(dto.engagementId);
    engagement.vulnerabilities.push(vulnerability);
    engagement.metrics.totalVulnerabilities++;

    switch (dto.severity) {
      case VulnerabilitySeverity.CRITICAL:
        engagement.metrics.criticalVulnerabilities++;
        break;
      case VulnerabilitySeverity.HIGH:
        engagement.metrics.highVulnerabilities++;
        break;
      case VulnerabilitySeverity.MEDIUM:
        engagement.metrics.mediumVulnerabilities++;
        break;
      case VulnerabilitySeverity.LOW:
        engagement.metrics.lowVulnerabilities++;
        break;
    }

    this.engagements.set(engagement.id, engagement);

    return vulnerability;
  }

  /**
   * Get engagement vulnerabilities
   */
  async getEngagementVulnerabilities(
    engagementId: string,
    severity?: VulnerabilitySeverity,
  ): Promise<Vulnerability[]> {
    const engagement = await this.getEngagement(engagementId);
    let vulnerabilities = engagement.vulnerabilities;

    if (severity) {
      vulnerabilities = vulnerabilities.filter((v) => v.severity === severity);
    }

    return vulnerabilities.sort((a, b) => b.cvssScore - a.cvssScore);
  }

  /**
   * Generate lateral movement recommendations
   */
  generateLateralMovementRecommendations(paths: LateralMovementPath[]): string[] {
    const recommendations: string[] = [];

    if (paths.length === 0) {
      return ['No lateral movement paths found - good network segmentation'];
    }

    recommendations.push(`${paths.length} lateral movement path(s) identified`);
    recommendations.push('Implement network segmentation to limit lateral movement');
    recommendations.push('Review privileged access controls');
    recommendations.push('Enable advanced threat protection on critical assets');

    return recommendations;
  }

  /**
   * Generate engagement report
   */
  async generateEngagementReport(
    engagementId: string,
    format: string,
  ): Promise<any> {
    const engagement = await this.getEngagement(engagementId);

    const executiveSummary = `Penetration testing engagement "${engagement.name}" identified ${
      engagement.vulnerabilities.length
    } vulnerabilities with ${engagement.metrics.criticalVulnerabilities} critical findings requiring immediate attention.`;

    return {
      reportId: crypto.randomUUID(),
      engagementId,
      generatedAt: new Date(),
      executiveSummary,
      findings: engagement.findings,
      vulnerabilities: engagement.vulnerabilities,
      metrics: engagement.metrics,
      recommendations: this.generateEngagementRecommendations(engagement),
    };
  }

  /**
   * Generate metrics dashboard
   */
  async generateMetricsDashboard(startDate?: Date, endDate?: Date): Promise<any> {
    const start = startDate || new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    const end = endDate || new Date();

    const engagements = Array.from(this.engagements.values());
    const activeEngagements = engagements.filter((e) => e.status === PenTestStatus.IN_PROGRESS);

    const totalVulnerabilities = engagements.reduce(
      (sum, e) => sum + e.metrics.totalVulnerabilities,
      0,
    );
    const criticalVulnerabilities = engagements.reduce(
      (sum, e) => sum + e.metrics.criticalVulnerabilities,
      0,
    );

    const avgDetectionRate =
      engagements.length > 0
        ? engagements.reduce((sum, e) => sum + e.metrics.detectionRate, 0) / engagements.length
        : 0;

    return {
      period: { start, end },
      summary: {
        totalEngagements: engagements.length,
        activeEngagements: activeEngagements.length,
        totalVulnerabilities,
        criticalVulnerabilities,
        averageDetectionRate: avgDetectionRate,
      },
      engagementMetrics: engagements.map((e) => e.metrics),
      trends: [],
      recommendations: [
        'Continue regular penetration testing cadence',
        'Focus on remediating critical vulnerabilities',
        'Improve detection capabilities through purple team exercises',
      ],
    };
  }

  // Helper methods

  private estimateRemediationEffort(
    severity: VulnerabilitySeverity,
  ): 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH' {
    switch (severity) {
      case VulnerabilitySeverity.CRITICAL:
        return 'VERY_HIGH';
      case VulnerabilitySeverity.HIGH:
        return 'HIGH';
      case VulnerabilitySeverity.MEDIUM:
        return 'MEDIUM';
      default:
        return 'LOW';
    }
  }

  private calculateRemediationPriority(severity: VulnerabilitySeverity, cvssScore: number): number {
    if (severity === VulnerabilitySeverity.CRITICAL) return 10;
    if (severity === VulnerabilitySeverity.HIGH) return Math.floor(cvssScore);
    if (severity === VulnerabilitySeverity.MEDIUM) return Math.floor(cvssScore / 2);
    return 1;
  }

  private estimateRemediationTimeline(severity: VulnerabilitySeverity): string {
    switch (severity) {
      case VulnerabilitySeverity.CRITICAL:
        return 'Immediate (24-48 hours)';
      case VulnerabilitySeverity.HIGH:
        return '1-2 weeks';
      case VulnerabilitySeverity.MEDIUM:
        return '2-4 weeks';
      default:
        return '1-3 months';
    }
  }

  private generateEngagementRecommendations(engagement: PenTestEngagement): string[] {
    const recommendations: string[] = [];

    if (engagement.metrics.criticalVulnerabilities > 0) {
      recommendations.push(
        `CRITICAL: Remediate ${engagement.metrics.criticalVulnerabilities} critical vulnerabilities immediately`,
      );
    }

    if (engagement.metrics.detectionRate < 50) {
      recommendations.push(
        'Low detection rate - enhance monitoring and detection capabilities',
      );
    }

    recommendations.push('Implement vulnerability management program');
    recommendations.push('Conduct regular security awareness training');
    recommendations.push('Schedule follow-up testing to validate remediation');

    return recommendations;
  }
}

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default {
  PenetrationTestingController,
  PenetrationTestingService,
};
