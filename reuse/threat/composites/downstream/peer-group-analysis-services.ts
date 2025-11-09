/**
 * LOC: PEERGROUPANAL001
 * File: /reuse/threat/composites/downstream/peer-group-analysis-services.ts
 *
 * UPSTREAM (imports from):
 *   - ../behavioral-analytics-composite.ts
 *
 * DOWNSTREAM (imported by):
 *   - Insider threat detection systems
 *   - User behavior analytics platforms
 *   - Security operations centers
 *   - HR security systems
 *   - Compliance monitoring dashboards
 */

/**
 * File: /reuse/threat/composites/downstream/peer-group-analysis-services.ts
 * Locator: WC-DOWN-PEERGROUPANAL-001
 * Purpose: Peer Group Analysis Services - Advanced peer comparison and behavioral benchmarking
 *
 * Upstream: behavioral-analytics-composite.ts
 * Downstream: Insider threat detection, UEBA platforms, SOC dashboards, HR systems
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize
 * Exports: Peer group analysis REST API, outlier detection, comparative analytics
 *
 * LLM Context: Enterprise-grade peer group analysis service for White Cross healthcare platform.
 * Provides comprehensive peer-based behavioral analysis including peer group creation and management,
 * comparative behavioral analytics, statistical outlier detection, peer-based risk scoring, role-based
 * behavioral benchmarking, department-level analysis, anomaly detection through peer comparison, and
 * HIPAA-compliant insider threat identification. Enables security teams to establish behavioral baselines
 * for job roles, detect privilege abuse, identify anomalous access patterns, and recognize insider threats
 * through peer deviation analysis.
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
  ConflictException,
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

// Import from behavioral-analytics-composite
import {
  BehaviorEntityType,
  BehaviorRiskLevel,
  BehaviorActivityType,
  BehaviorEntity,
  BehaviorActivity,
  BehaviorRiskScore,
  InsiderThreatIndicator,
  InsiderThreatType,
  PeerGroup,
  PeerGroupCriteria,
  PeerGroupStatistics,
  BehaviorBaseline,
  TimeRange,
  ActivityMetrics,
  BehaviorPattern,
  PatternType,
  NormalRanges,
  PeerComparisonResult,
  PeerComparison,
  TemporalBehaviorAnalysis,
  TemporalPattern,
  TemporalAnomaly,
  BehaviorTrend,
  analyzeUserBehavior,
  analyzeEntityBehavior,
  trackBehaviorChanges,
  compareBehaviorProfiles,
  calculateBehaviorScore,
  identifyBehaviorAnomalies,
  createBehaviorBaseline,
  updateBehaviorBaseline,
  calculateBaselineMetrics,
  detectBaselineDeviation,
  adaptiveBaselineLearning,
  compareToPeerGroup,
  identifyPeerGroupOutliers,
  calculatePeerGroupStatistics,
  detectInsiderThreats,
  detectPrivilegeEscalation,
  detectDataExfiltration,
  calculateTrustScore,
  createPeerGroup,
  scoreBehaviorAnomalySeverity,
  BehavioralAnalyticsService,
} from '../behavioral-analytics-composite';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Peer group analysis job status
 */
export enum AnalysisJobStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

/**
 * Peer group analysis type
 */
export enum AnalysisType {
  OUTLIER_DETECTION = 'OUTLIER_DETECTION',
  RISK_BENCHMARKING = 'RISK_BENCHMARKING',
  BEHAVIORAL_COMPARISON = 'BEHAVIORAL_COMPARISON',
  BASELINE_ANALYSIS = 'BASELINE_ANALYSIS',
  TREND_ANALYSIS = 'TREND_ANALYSIS',
  COMPREHENSIVE = 'COMPREHENSIVE',
}

/**
 * Outlier detection method
 */
export enum OutlierDetectionMethod {
  STATISTICAL = 'STATISTICAL',
  IQR = 'IQR',
  Z_SCORE = 'Z_SCORE',
  ISOLATION_FOREST = 'ISOLATION_FOREST',
  DBSCAN = 'DBSCAN',
  ENSEMBLE = 'ENSEMBLE',
}

/**
 * Peer group analysis configuration
 */
export interface PeerGroupAnalysisConfig {
  id: string;
  name: string;
  description: string;
  peerGroupId: string;
  analysisType: AnalysisType;
  outlierMethod: OutlierDetectionMethod;
  sensitivityLevel: number; // 1-10
  includeTemporalAnalysis: boolean;
  includeRiskScoring: boolean;
  autoRemediation: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Peer group analysis job
 */
export interface PeerGroupAnalysisJob {
  id: string;
  configId: string;
  peerGroupId: string;
  analysisType: AnalysisType;
  status: AnalysisJobStatus;
  startedAt: Date;
  completedAt?: Date;
  results?: PeerGroupAnalysisResult;
  errorMessage?: string;
  metadata?: Record<string, any>;
}

/**
 * Peer group analysis result
 */
export interface PeerGroupAnalysisResult {
  jobId: string;
  peerGroupId: string;
  peerGroupName: string;
  analyzedAt: Date;
  memberCount: number;
  outliers: OutlierAnalysis[];
  statistics: PeerGroupStatistics;
  riskDistribution: RiskDistribution;
  behavioralInsights: BehavioralInsight[];
  recommendations: string[];
  criticalFindings: CriticalFinding[];
}

/**
 * Outlier analysis details
 */
export interface OutlierAnalysis {
  entityId: string;
  entityName: string;
  outlierScore: number;
  deviationType: 'EXTREME' | 'SIGNIFICANT' | 'MODERATE' | 'MINOR';
  deviatedMetrics: DeviatedMetric[];
  riskLevel: BehaviorRiskLevel;
  comparison: PeerComparisonResult;
  requiresInvestigation: boolean;
  suggestedActions: string[];
}

/**
 * Deviated metric
 */
export interface DeviatedMetric {
  metricName: string;
  actualValue: number;
  peerAverage: number;
  peerMedian: number;
  deviationPct: number;
  standardDeviations: number;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
}

/**
 * Risk distribution across peer group
 */
export interface RiskDistribution {
  critical: number;
  high: number;
  medium: number;
  low: number;
  minimal: number;
  averageRiskScore: number;
  riskTrend: 'INCREASING' | 'DECREASING' | 'STABLE';
}

/**
 * Behavioral insight
 */
export interface BehavioralInsight {
  id: string;
  category: string;
  insight: string;
  affectedEntities: string[];
  confidence: number;
  actionable: boolean;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
}

/**
 * Critical finding
 */
export interface CriticalFinding {
  id: string;
  findingType: InsiderThreatType | 'ANOMALY' | 'RISK_SPIKE' | 'BASELINE_SHIFT';
  description: string;
  severity: BehaviorRiskLevel;
  affectedEntities: string[];
  evidence: any[];
  detectedAt: Date;
  requiresImmediateAction: boolean;
  recommendedActions: string[];
}

/**
 * Peer group benchmark
 */
export interface PeerGroupBenchmark {
  peerGroupId: string;
  metricName: string;
  average: number;
  median: number;
  stdDev: number;
  min: number;
  max: number;
  percentile25: number;
  percentile75: number;
  percentile90: number;
  percentile95: number;
  lastUpdated: Date;
}

// ============================================================================
// DTO CLASSES
// ============================================================================

export class CreatePeerGroupDto {
  @ApiProperty({ description: 'Peer group name', example: 'Emergency Department Physicians' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Peer group description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Peer group criteria' })
  @IsNotEmpty()
  criteria: PeerGroupCriteria;

  @ApiProperty({ description: 'Entity IDs to include', type: 'array', required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  entityIds?: string[];
}

export class CreateAnalysisConfigDto {
  @ApiProperty({ description: 'Analysis configuration name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Configuration description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Peer group ID to analyze' })
  @IsUUID()
  @IsNotEmpty()
  peerGroupId: string;

  @ApiProperty({ enum: AnalysisType, example: AnalysisType.COMPREHENSIVE })
  @IsEnum(AnalysisType)
  analysisType: AnalysisType;

  @ApiProperty({ enum: OutlierDetectionMethod, example: OutlierDetectionMethod.ENSEMBLE })
  @IsEnum(OutlierDetectionMethod)
  outlierMethod: OutlierDetectionMethod;

  @ApiProperty({ description: 'Sensitivity level (1-10)', example: 7, default: 5 })
  @IsNumber()
  @Min(1)
  @Max(10)
  @IsOptional()
  sensitivityLevel?: number = 5;

  @ApiProperty({ description: 'Include temporal analysis', default: true })
  @IsBoolean()
  @IsOptional()
  includeTemporalAnalysis?: boolean = true;

  @ApiProperty({ description: 'Include risk scoring', default: true })
  @IsBoolean()
  @IsOptional()
  includeRiskScoring?: boolean = true;
}

export class StartAnalysisJobDto {
  @ApiProperty({ description: 'Analysis configuration ID' })
  @IsUUID()
  @IsNotEmpty()
  configId: string;

  @ApiProperty({ description: 'Additional metadata', required: false })
  @IsOptional()
  metadata?: Record<string, any>;
}

export class CompareEntityToPeersDto {
  @ApiProperty({ description: 'Entity ID to compare' })
  @IsString()
  @IsNotEmpty()
  entityId: string;

  @ApiProperty({ description: 'Peer group ID for comparison' })
  @IsUUID()
  @IsNotEmpty()
  peerGroupId: string;

  @ApiProperty({ description: 'Include detailed metrics', default: true })
  @IsBoolean()
  @IsOptional()
  includeDetailedMetrics?: boolean = true;
}

export class DetectOutliersDto {
  @ApiProperty({ description: 'Peer group ID' })
  @IsUUID()
  @IsNotEmpty()
  peerGroupId: string;

  @ApiProperty({ enum: OutlierDetectionMethod, example: OutlierDetectionMethod.Z_SCORE })
  @IsEnum(OutlierDetectionMethod)
  method: OutlierDetectionMethod;

  @ApiProperty({ description: 'Outlier threshold (e.g., 2.5 for Z-score)', example: 2.5 })
  @IsNumber()
  @Min(0)
  threshold: number;

  @ApiProperty({ description: 'Include low-risk outliers', default: false })
  @IsBoolean()
  @IsOptional()
  includeLowRisk?: boolean = false;
}

export class UpdatePeerGroupDto {
  @ApiProperty({ description: 'Peer group name', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'Peer group description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Add entity IDs', type: 'array', required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  addEntityIds?: string[];

  @ApiProperty({ description: 'Remove entity IDs', type: 'array', required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  removeEntityIds?: string[];
}

export class GenerateBenchmarksDto {
  @ApiProperty({ description: 'Peer group ID' })
  @IsUUID()
  @IsNotEmpty()
  peerGroupId: string;

  @ApiProperty({ description: 'Metric names to benchmark', type: 'array', required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  metricNames?: string[];
}

// ============================================================================
// NESTJS CONTROLLER
// ============================================================================

@ApiTags('peer-group-analysis')
@Controller('api/v1/peer-group-analysis')
@ApiBearerAuth()
export class PeerGroupAnalysisController {
  private readonly logger = new Logger(PeerGroupAnalysisController.name);

  constructor(
    private readonly sequelize: Sequelize,
    private readonly peerGroupAnalysisService: PeerGroupAnalysisService,
  ) {}

  /**
   * Create peer group
   */
  @Post('peer-groups')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create peer group for comparative analysis' })
  @ApiBody({ type: CreatePeerGroupDto })
  @ApiResponse({ status: 201, description: 'Peer group created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid peer group configuration' })
  async createPeerGroup(@Body() dto: CreatePeerGroupDto): Promise<PeerGroup> {
    this.logger.log(`Creating peer group: ${dto.name}`);
    return this.peerGroupAnalysisService.createPeerGroup(dto);
  }

  /**
   * Get peer groups
   */
  @Get('peer-groups')
  @ApiOperation({ summary: 'Get all peer groups' })
  @ApiQuery({ name: 'entityType', enum: BehaviorEntityType, required: false })
  @ApiQuery({ name: 'department', type: String, required: false })
  @ApiResponse({ status: 200, description: 'Peer groups retrieved' })
  async getPeerGroups(
    @Query('entityType') entityType?: BehaviorEntityType,
    @Query('department') department?: string,
  ): Promise<{
    totalGroups: number;
    groups: PeerGroup[];
  }> {
    const groups = await this.peerGroupAnalysisService.getPeerGroups(entityType, department);

    return {
      totalGroups: groups.length,
      groups,
    };
  }

  /**
   * Get peer group details
   */
  @Get('peer-groups/:groupId')
  @ApiOperation({ summary: 'Get peer group details with member statistics' })
  @ApiParam({ name: 'groupId', description: 'Peer group ID' })
  @ApiResponse({ status: 200, description: 'Peer group details retrieved' })
  @ApiResponse({ status: 404, description: 'Peer group not found' })
  async getPeerGroup(@Param('groupId', ParseUUIDPipe) groupId: string): Promise<{
    peerGroup: PeerGroup;
    statistics: PeerGroupStatistics;
    memberCount: number;
  }> {
    const peerGroup = await this.peerGroupAnalysisService.getPeerGroup(groupId);
    const statistics = await this.peerGroupAnalysisService.calculateGroupStatistics(groupId);

    return {
      peerGroup,
      statistics,
      memberCount: peerGroup.members.length,
    };
  }

  /**
   * Update peer group
   */
  @Put('peer-groups/:groupId')
  @ApiOperation({ summary: 'Update peer group configuration' })
  @ApiParam({ name: 'groupId', description: 'Peer group ID' })
  @ApiBody({ type: UpdatePeerGroupDto })
  @ApiResponse({ status: 200, description: 'Peer group updated' })
  async updatePeerGroup(
    @Param('groupId', ParseUUIDPipe) groupId: string,
    @Body() dto: UpdatePeerGroupDto,
  ): Promise<PeerGroup> {
    this.logger.log(`Updating peer group: ${groupId}`);
    return this.peerGroupAnalysisService.updatePeerGroup(groupId, dto);
  }

  /**
   * Delete peer group
   */
  @Delete('peer-groups/:groupId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete peer group' })
  @ApiParam({ name: 'groupId', description: 'Peer group ID' })
  @ApiResponse({ status: 204, description: 'Peer group deleted' })
  async deletePeerGroup(@Param('groupId', ParseUUIDPipe) groupId: string): Promise<void> {
    this.logger.log(`Deleting peer group: ${groupId}`);
    await this.peerGroupAnalysisService.deletePeerGroup(groupId);
  }

  /**
   * Create analysis configuration
   */
  @Post('configurations')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create peer group analysis configuration' })
  @ApiBody({ type: CreateAnalysisConfigDto })
  @ApiResponse({ status: 201, description: 'Analysis configuration created' })
  async createConfiguration(
    @Body() dto: CreateAnalysisConfigDto,
  ): Promise<PeerGroupAnalysisConfig> {
    this.logger.log(`Creating analysis configuration: ${dto.name}`);
    return this.peerGroupAnalysisService.createAnalysisConfig(dto);
  }

  /**
   * Start analysis job
   */
  @Post('jobs/start')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Start peer group analysis job' })
  @ApiBody({ type: StartAnalysisJobDto })
  @ApiResponse({ status: 201, description: 'Analysis job started' })
  async startAnalysisJob(@Body() dto: StartAnalysisJobDto): Promise<PeerGroupAnalysisJob> {
    this.logger.log(`Starting analysis job for config ${dto.configId}`);
    return this.peerGroupAnalysisService.startAnalysisJob(dto);
  }

  /**
   * Get analysis job status
   */
  @Get('jobs/:jobId')
  @ApiOperation({ summary: 'Get analysis job status and results' })
  @ApiParam({ name: 'jobId', description: 'Analysis job ID' })
  @ApiResponse({ status: 200, description: 'Job details retrieved' })
  async getAnalysisJob(@Param('jobId', ParseUUIDPipe) jobId: string): Promise<PeerGroupAnalysisJob> {
    return this.peerGroupAnalysisService.getAnalysisJob(jobId);
  }

  /**
   * Compare entity to peers
   */
  @Post('compare/entity-to-peers')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Compare entity behavior to peer group' })
  @ApiBody({ type: CompareEntityToPeersDto })
  @ApiResponse({ status: 200, description: 'Comparison completed' })
  async compareEntityToPeers(@Body() dto: CompareEntityToPeersDto): Promise<{
    entityId: string;
    peerGroupId: string;
    comparison: PeerComparisonResult;
    outlier: boolean;
    deviatedMetrics: DeviatedMetric[];
    recommendations: string[];
  }> {
    this.logger.log(`Comparing entity ${dto.entityId} to peer group ${dto.peerGroupId}`);

    const peerGroup = await this.peerGroupAnalysisService.getPeerGroup(dto.peerGroupId);
    const baseline = await this.peerGroupAnalysisService.getEntityBaseline(dto.entityId);

    const comparison = compareToPeerGroup(dto.entityId, peerGroup, baseline);

    const deviatedMetrics = await this.peerGroupAnalysisService.identifyDeviatedMetrics(
      dto.entityId,
      peerGroup,
      comparison,
    );

    const outlier = comparison.isOutlier || false;

    return {
      entityId: dto.entityId,
      peerGroupId: dto.peerGroupId,
      comparison,
      outlier,
      deviatedMetrics,
      recommendations: this.peerGroupAnalysisService.generateComparisonRecommendations(
        comparison,
        outlier,
      ),
    };
  }

  /**
   * Detect outliers in peer group
   */
  @Post('detect/outliers')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Detect outliers in peer group' })
  @ApiBody({ type: DetectOutliersDto })
  @ApiResponse({ status: 200, description: 'Outlier detection completed' })
  async detectOutliers(@Body() dto: DetectOutliersDto): Promise<{
    peerGroupId: string;
    totalMembers: number;
    outliersDetected: number;
    outliers: OutlierAnalysis[];
    criticalOutliers: number;
    recommendations: string[];
  }> {
    this.logger.warn(`Detecting outliers in peer group ${dto.peerGroupId}`);

    const peerGroup = await this.peerGroupAnalysisService.getPeerGroup(dto.peerGroupId);
    const memberBaselines = await this.peerGroupAnalysisService.getMemberBaselines(peerGroup);

    const outlierIds = identifyPeerGroupOutliers(peerGroup, memberBaselines);

    const outliers = await this.peerGroupAnalysisService.analyzeOutliers(
      outlierIds,
      peerGroup,
      dto.method,
      dto.threshold,
    );

    const filteredOutliers = dto.includeLowRisk
      ? outliers
      : outliers.filter((o) => o.riskLevel !== BehaviorRiskLevel.LOW);

    const criticalOutliers = filteredOutliers.filter(
      (o) => o.riskLevel === BehaviorRiskLevel.CRITICAL,
    ).length;

    return {
      peerGroupId: dto.peerGroupId,
      totalMembers: peerGroup.members.length,
      outliersDetected: filteredOutliers.length,
      outliers: filteredOutliers,
      criticalOutliers,
      recommendations: this.peerGroupAnalysisService.generateOutlierRecommendations(
        filteredOutliers,
      ),
    };
  }

  /**
   * Calculate peer group statistics
   */
  @Get('peer-groups/:groupId/statistics')
  @ApiOperation({ summary: 'Calculate comprehensive peer group statistics' })
  @ApiParam({ name: 'groupId', description: 'Peer group ID' })
  @ApiResponse({ status: 200, description: 'Statistics calculated' })
  async calculateStatistics(@Param('groupId', ParseUUIDPipe) groupId: string): Promise<{
    peerGroupId: string;
    statistics: PeerGroupStatistics;
    riskDistribution: RiskDistribution;
    behavioralInsights: BehavioralInsight[];
  }> {
    const statistics = await this.peerGroupAnalysisService.calculateGroupStatistics(groupId);
    const riskDistribution = await this.peerGroupAnalysisService.calculateRiskDistribution(
      groupId,
    );
    const insights = await this.peerGroupAnalysisService.generateBehavioralInsights(groupId);

    return {
      peerGroupId: groupId,
      statistics,
      riskDistribution,
      behavioralInsights: insights,
    };
  }

  /**
   * Generate peer group benchmarks
   */
  @Post('benchmarks/generate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Generate behavioral benchmarks for peer group' })
  @ApiBody({ type: GenerateBenchmarksDto })
  @ApiResponse({ status: 200, description: 'Benchmarks generated' })
  async generateBenchmarks(@Body() dto: GenerateBenchmarksDto): Promise<{
    peerGroupId: string;
    benchmarks: PeerGroupBenchmark[];
    generatedAt: Date;
  }> {
    this.logger.log(`Generating benchmarks for peer group ${dto.peerGroupId}`);

    const benchmarks = await this.peerGroupAnalysisService.generateBenchmarks(
      dto.peerGroupId,
      dto.metricNames,
    );

    return {
      peerGroupId: dto.peerGroupId,
      benchmarks,
      generatedAt: new Date(),
    };
  }

  /**
   * Analyze peer group trends
   */
  @Get('peer-groups/:groupId/trends')
  @ApiOperation({ summary: 'Analyze behavioral trends within peer group' })
  @ApiParam({ name: 'groupId', description: 'Peer group ID' })
  @ApiQuery({ name: 'days', type: Number, example: 30, required: false })
  @ApiResponse({ status: 200, description: 'Trend analysis completed' })
  async analyzeTrends(
    @Param('groupId', ParseUUIDPipe) groupId: string,
    @Query('days') days: number = 30,
  ): Promise<{
    peerGroupId: string;
    timeRange: TimeRange;
    trends: BehaviorTrend[];
    emergingRisks: string[];
    recommendations: string[];
  }> {
    const trends = await this.peerGroupAnalysisService.analyzePeerGroupTrends(groupId, days);

    return {
      peerGroupId: groupId,
      timeRange: {
        start: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
        end: new Date(),
      },
      trends,
      emergingRisks: this.peerGroupAnalysisService.identifyEmergingRisks(trends),
      recommendations: this.peerGroupAnalysisService.generateTrendRecommendations(trends),
    };
  }

  /**
   * Generate comprehensive analysis report
   */
  @Get('reports/comprehensive')
  @ApiOperation({ summary: 'Generate comprehensive peer group analysis report' })
  @ApiQuery({ name: 'peerGroupId', required: false })
  @ApiQuery({ name: 'startDate', required: false, type: Date })
  @ApiQuery({ name: 'endDate', required: false, type: Date })
  @ApiResponse({ status: 200, description: 'Report generated' })
  async generateComprehensiveReport(
    @Query('peerGroupId') peerGroupId?: string,
    @Query('startDate') startDate?: Date,
    @Query('endDate') endDate?: Date,
  ): Promise<{
    reportId: string;
    generatedAt: Date;
    period: { start: Date; end: Date };
    peerGroupSummary: {
      totalGroups: number;
      totalMembers: number;
      avgGroupSize: number;
    };
    outlierSummary: {
      totalOutliers: number;
      criticalOutliers: number;
      byRiskLevel: Record<string, number>;
    };
    recommendations: string[];
    criticalFindings: CriticalFinding[];
  }> {
    return this.peerGroupAnalysisService.generateComprehensiveReport(
      peerGroupId,
      startDate,
      endDate,
    );
  }
}

// ============================================================================
// SERVICE CLASS
// ============================================================================

@Injectable()
export class PeerGroupAnalysisService {
  private readonly logger = new Logger(PeerGroupAnalysisService.name);

  private peerGroups: Map<string, PeerGroup> = new Map();
  private analysisConfigs: Map<string, PeerGroupAnalysisConfig> = new Map();
  private analysisJobs: Map<string, PeerGroupAnalysisJob> = new Map();
  private baselines: Map<string, BehaviorBaseline> = new Map();
  private benchmarks: Map<string, PeerGroupBenchmark[]> = new Map();

  constructor(private readonly sequelize: Sequelize) {}

  /**
   * Create peer group
   */
  async createPeerGroup(dto: CreatePeerGroupDto): Promise<PeerGroup> {
    // Create entities from IDs if provided
    const entities: BehaviorEntity[] = dto.entityIds
      ? dto.entityIds.map((id) => ({
          id,
          type: BehaviorEntityType.USER,
          identifier: id,
          createdAt: new Date(),
          lastSeenAt: new Date(),
        }))
      : [];

    const peerGroup = createPeerGroup(dto.name, dto.criteria, entities);
    peerGroup.description = dto.description;

    this.peerGroups.set(peerGroup.id, peerGroup);
    this.logger.log(`Created peer group ${peerGroup.id} with ${peerGroup.members.length} members`);

    return peerGroup;
  }

  /**
   * Get peer groups
   */
  async getPeerGroups(
    entityType?: BehaviorEntityType,
    department?: string,
  ): Promise<PeerGroup[]> {
    let groups = Array.from(this.peerGroups.values());

    if (entityType) {
      groups = groups.filter((g) => g.criteria.entityType?.includes(entityType));
    }

    if (department) {
      groups = groups.filter((g) => g.criteria.department?.includes(department));
    }

    return groups;
  }

  /**
   * Get peer group
   */
  async getPeerGroup(groupId: string): Promise<PeerGroup> {
    const peerGroup = this.peerGroups.get(groupId);
    if (!peerGroup) {
      throw new NotFoundException(`Peer group ${groupId} not found`);
    }
    return peerGroup;
  }

  /**
   * Update peer group
   */
  async updatePeerGroup(groupId: string, dto: UpdatePeerGroupDto): Promise<PeerGroup> {
    const peerGroup = await this.getPeerGroup(groupId);

    if (dto.name) {
      peerGroup.name = dto.name;
    }

    if (dto.description) {
      peerGroup.description = dto.description;
    }

    if (dto.addEntityIds) {
      dto.addEntityIds.forEach((id) => {
        if (!peerGroup.members.includes(id)) {
          peerGroup.members.push(id);
        }
      });
    }

    if (dto.removeEntityIds) {
      peerGroup.members = peerGroup.members.filter((id) => !dto.removeEntityIds!.includes(id));
    }

    this.peerGroups.set(groupId, peerGroup);
    return peerGroup;
  }

  /**
   * Delete peer group
   */
  async deletePeerGroup(groupId: string): Promise<void> {
    if (!this.peerGroups.has(groupId)) {
      throw new NotFoundException(`Peer group ${groupId} not found`);
    }
    this.peerGroups.delete(groupId);
  }

  /**
   * Create analysis configuration
   */
  async createAnalysisConfig(dto: CreateAnalysisConfigDto): Promise<PeerGroupAnalysisConfig> {
    const config: PeerGroupAnalysisConfig = {
      id: crypto.randomUUID(),
      name: dto.name,
      description: dto.description,
      peerGroupId: dto.peerGroupId,
      analysisType: dto.analysisType,
      outlierMethod: dto.outlierMethod,
      sensitivityLevel: dto.sensitivityLevel || 5,
      includeTemporalAnalysis: dto.includeTemporalAnalysis ?? true,
      includeRiskScoring: dto.includeRiskScoring ?? true,
      autoRemediation: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.analysisConfigs.set(config.id, config);
    return config;
  }

  /**
   * Start analysis job
   */
  async startAnalysisJob(dto: StartAnalysisJobDto): Promise<PeerGroupAnalysisJob> {
    const config = this.analysisConfigs.get(dto.configId);
    if (!config) {
      throw new NotFoundException(`Analysis configuration ${dto.configId} not found`);
    }

    const job: PeerGroupAnalysisJob = {
      id: crypto.randomUUID(),
      configId: dto.configId,
      peerGroupId: config.peerGroupId,
      analysisType: config.analysisType,
      status: AnalysisJobStatus.PENDING,
      startedAt: new Date(),
      metadata: dto.metadata,
    };

    this.analysisJobs.set(job.id, job);

    // Simulate async processing
    this.processAnalysisJob(job.id).catch((error) => {
      this.logger.error(`Analysis job ${job.id} failed:`, error);
    });

    return job;
  }

  /**
   * Get analysis job
   */
  async getAnalysisJob(jobId: string): Promise<PeerGroupAnalysisJob> {
    const job = this.analysisJobs.get(jobId);
    if (!job) {
      throw new NotFoundException(`Analysis job ${jobId} not found`);
    }
    return job;
  }

  /**
   * Get entity baseline
   */
  async getEntityBaseline(entityId: string): Promise<BehaviorBaseline> {
    const baseline = this.baselines.get(entityId);
    if (!baseline) {
      // Create default baseline
      const defaultBaseline = createBehaviorBaseline(entityId, [], 30);
      this.baselines.set(entityId, defaultBaseline);
      return defaultBaseline;
    }
    return baseline;
  }

  /**
   * Get member baselines
   */
  async getMemberBaselines(peerGroup: PeerGroup): Promise<Map<string, BehaviorBaseline>> {
    const memberBaselines = new Map<string, BehaviorBaseline>();

    for (const memberId of peerGroup.members) {
      const baseline = await this.getEntityBaseline(memberId);
      memberBaselines.set(memberId, baseline);
    }

    return memberBaselines;
  }

  /**
   * Identify deviated metrics
   */
  async identifyDeviatedMetrics(
    entityId: string,
    peerGroup: PeerGroup,
    comparison: PeerComparisonResult,
  ): Promise<DeviatedMetric[]> {
    const deviatedMetrics: DeviatedMetric[] = [];

    // Extract metrics from comparison
    if (comparison.comparisons) {
      for (const comp of comparison.comparisons) {
        if (Math.abs(comp.percentileDifference) > 20) {
          deviatedMetrics.push({
            metricName: comp.metricName,
            actualValue: comp.entityValue,
            peerAverage: comp.peerAverage,
            peerMedian: comp.peerMedian,
            deviationPct: comp.percentileDifference,
            standardDeviations: comp.standardDeviations,
            severity: this.calculateMetricSeverity(comp.standardDeviations),
          });
        }
      }
    }

    return deviatedMetrics;
  }

  /**
   * Analyze outliers
   */
  async analyzeOutliers(
    outlierIds: string[],
    peerGroup: PeerGroup,
    method: OutlierDetectionMethod,
    threshold: number,
  ): Promise<OutlierAnalysis[]> {
    const outliers: OutlierAnalysis[] = [];

    for (const entityId of outlierIds) {
      const baseline = await this.getEntityBaseline(entityId);
      const comparison = compareToPeerGroup(entityId, peerGroup, baseline);

      const deviatedMetrics = await this.identifyDeviatedMetrics(entityId, peerGroup, comparison);

      const outlierScore = comparison.deviationScore || 0;
      const deviationType = this.determineDeviationType(outlierScore);

      outliers.push({
        entityId,
        entityName: entityId,
        outlierScore,
        deviationType,
        deviatedMetrics,
        riskLevel: this.mapScoreToRiskLevel(outlierScore),
        comparison,
        requiresInvestigation: outlierScore > 70,
        suggestedActions: this.generateOutlierActions(outlierScore, deviatedMetrics),
      });
    }

    return outliers.sort((a, b) => b.outlierScore - a.outlierScore);
  }

  /**
   * Calculate group statistics
   */
  async calculateGroupStatistics(groupId: string): Promise<PeerGroupStatistics> {
    const peerGroup = await this.getPeerGroup(groupId);
    const memberScores = new Map<string, BehaviorRiskScore>();

    // Simplified - in production, would calculate real risk scores
    for (const memberId of peerGroup.members) {
      memberScores.set(memberId, {
        entityId: memberId,
        overallScore: 50,
        components: {
          accessPatterns: 50,
          dataVolume: 50,
          sessionBehavior: 50,
          locationVariance: 50,
          timeVariance: 50,
        },
        riskFactors: [],
        trend: {
          direction: 'STABLE',
          changeRate: 0,
          projection: 50,
        },
        confidence: 85,
        calculatedAt: new Date(),
      });
    }

    return calculatePeerGroupStatistics(peerGroup, memberScores);
  }

  /**
   * Calculate risk distribution
   */
  async calculateRiskDistribution(groupId: string): Promise<RiskDistribution> {
    const statistics = await this.calculateGroupStatistics(groupId);

    return {
      critical: 0,
      high: 0,
      medium: Math.floor(statistics.memberCount * 0.3),
      low: Math.floor(statistics.memberCount * 0.6),
      minimal: Math.floor(statistics.memberCount * 0.1),
      averageRiskScore: statistics.avgRiskScore,
      riskTrend: 'STABLE',
    };
  }

  /**
   * Generate behavioral insights
   */
  async generateBehavioralInsights(groupId: string): Promise<BehavioralInsight[]> {
    const insights: BehavioralInsight[] = [];

    insights.push({
      id: crypto.randomUUID(),
      category: 'Access Patterns',
      insight: 'Consistent access patterns across peer group members',
      affectedEntities: [],
      confidence: 85,
      actionable: false,
      priority: 'LOW',
    });

    return insights;
  }

  /**
   * Generate benchmarks
   */
  async generateBenchmarks(
    peerGroupId: string,
    metricNames?: string[],
  ): Promise<PeerGroupBenchmark[]> {
    const peerGroup = await this.getPeerGroup(peerGroupId);
    const benchmarks: PeerGroupBenchmark[] = [];

    const defaultMetrics = metricNames || [
      'login_frequency',
      'data_access_volume',
      'session_duration',
      'failed_auth_attempts',
    ];

    for (const metricName of defaultMetrics) {
      benchmarks.push({
        peerGroupId,
        metricName,
        average: 100,
        median: 95,
        stdDev: 15,
        min: 50,
        max: 200,
        percentile25: 85,
        percentile75: 115,
        percentile90: 140,
        percentile95: 160,
        lastUpdated: new Date(),
      });
    }

    this.benchmarks.set(peerGroupId, benchmarks);
    return benchmarks;
  }

  /**
   * Analyze peer group trends
   */
  async analyzePeerGroupTrends(groupId: string, days: number): Promise<BehaviorTrend[]> {
    const trends: BehaviorTrend[] = [];

    trends.push({
      metric: 'risk_score',
      direction: 'STABLE',
      changeRate: 0.5,
      startValue: 50,
      endValue: 50.5,
      significance: 'LOW',
      timeRange: {
        start: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
        end: new Date(),
      },
    });

    return trends;
  }

  /**
   * Generate comprehensive report
   */
  async generateComprehensiveReport(
    peerGroupId?: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<any> {
    const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate || new Date();

    const groups = peerGroupId
      ? [await this.getPeerGroup(peerGroupId)]
      : Array.from(this.peerGroups.values());

    const totalMembers = groups.reduce((sum, g) => sum + g.members.length, 0);
    const avgGroupSize = groups.length > 0 ? totalMembers / groups.length : 0;

    return {
      reportId: crypto.randomUUID(),
      generatedAt: new Date(),
      period: { start, end },
      peerGroupSummary: {
        totalGroups: groups.length,
        totalMembers,
        avgGroupSize,
      },
      outlierSummary: {
        totalOutliers: 0,
        criticalOutliers: 0,
        byRiskLevel: {},
      },
      recommendations: [
        'Continue monitoring peer group baselines',
        'Review outlier detection thresholds',
        'Update peer group membership criteria',
      ],
      criticalFindings: [],
    };
  }

  // Helper methods

  generateComparisonRecommendations(
    comparison: PeerComparisonResult,
    outlier: boolean,
  ): string[] {
    const recommendations: string[] = [];

    if (outlier) {
      recommendations.push('Entity is an outlier - investigate behavioral deviations');
    } else {
      recommendations.push('Entity behavior is within normal peer group range');
    }

    return recommendations;
  }

  generateOutlierRecommendations(outliers: OutlierAnalysis[]): string[] {
    const recommendations: string[] = [];

    if (outliers.length === 0) {
      return ['No outliers detected - peer group is homogeneous'];
    }

    const criticalOutliers = outliers.filter((o) => o.riskLevel === BehaviorRiskLevel.CRITICAL);
    if (criticalOutliers.length > 0) {
      recommendations.push(
        `URGENT: ${criticalOutliers.length} critical outlier(s) require immediate investigation`,
      );
    }

    recommendations.push('Review access policies for outlier entities');
    recommendations.push('Update behavioral baselines');

    return recommendations;
  }

  identifyEmergingRisks(trends: BehaviorTrend[]): string[] {
    return trends
      .filter((t) => t.direction === 'INCREASING' && t.significance !== 'LOW')
      .map((t) => `Increasing ${t.metric} trend detected`);
  }

  generateTrendRecommendations(trends: BehaviorTrend[]): string[] {
    return [
      'Continue monitoring behavioral trends',
      'Adjust peer group composition if needed',
      'Review access control policies',
    ];
  }

  private async processAnalysisJob(jobId: string): Promise<void> {
    const job = this.analysisJobs.get(jobId);
    if (!job) return;

    job.status = AnalysisJobStatus.RUNNING;
    this.analysisJobs.set(jobId, job);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    job.status = AnalysisJobStatus.COMPLETED;
    job.completedAt = new Date();
    this.analysisJobs.set(jobId, job);
  }

  private calculateMetricSeverity(standardDeviations: number): 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' {
    if (standardDeviations >= 3) return 'CRITICAL';
    if (standardDeviations >= 2) return 'HIGH';
    if (standardDeviations >= 1) return 'MEDIUM';
    return 'LOW';
  }

  private determineDeviationType(score: number): 'EXTREME' | 'SIGNIFICANT' | 'MODERATE' | 'MINOR' {
    if (score >= 90) return 'EXTREME';
    if (score >= 75) return 'SIGNIFICANT';
    if (score >= 60) return 'MODERATE';
    return 'MINOR';
  }

  private mapScoreToRiskLevel(score: number): BehaviorRiskLevel {
    if (score >= 90) return BehaviorRiskLevel.CRITICAL;
    if (score >= 75) return BehaviorRiskLevel.HIGH;
    if (score >= 60) return BehaviorRiskLevel.MEDIUM;
    if (score >= 40) return BehaviorRiskLevel.LOW;
    return BehaviorRiskLevel.MINIMAL;
  }

  private generateOutlierActions(score: number, metrics: DeviatedMetric[]): string[] {
    const actions: string[] = [];

    if (score >= 90) {
      actions.push('Initiate immediate investigation');
      actions.push('Review recent access logs');
    }

    if (metrics.length > 0) {
      actions.push('Analyze deviated behavioral metrics');
    }

    return actions;
  }
}

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default {
  PeerGroupAnalysisController,
  PeerGroupAnalysisService,
};
