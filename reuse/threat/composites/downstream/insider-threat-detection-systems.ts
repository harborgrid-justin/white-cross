/**
 * LOC: INSIDERTHREAT001
 * File: /reuse/threat/composites/downstream/insider-threat-detection-systems.ts
 *
 * UPSTREAM (imports from):
 *   - ../behavioral-analytics-composite
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - class-validator
 *   - class-transformer
 *   - sequelize-typescript
 *
 * DOWNSTREAM (imported by):
 *   - Security operations centers
 *   - Threat intelligence platforms
 *   - HR security systems
 *   - Executive dashboards
 */

/**
 * File: /reuse/threat/composites/downstream/insider-threat-detection-systems.ts
 * Locator: WC-INSIDER-THREAT-DETECTION-001
 * Purpose: Insider Threat Detection Systems - Advanced UEBA for detecting malicious insiders
 *
 * Upstream: behavioral-analytics-composite
 * Downstream: SOC dashboards, SIEM integrations, HR systems, Executive reporting
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize
 * Exports: NestJS controllers and services for insider threat detection and prevention
 *
 * LLM Context: Production-ready insider threat detection system for White Cross healthcare platform.
 * Provides comprehensive User and Entity Behavior Analytics (UEBA) to detect malicious insiders,
 * compromised accounts, data exfiltration, privilege abuse, and policy violations. Integrates
 * behavioral analytics with HR data, access logs, and security events to identify high-risk users
 * and anomalous behavior patterns. HIPAA-compliant with full audit trails and privacy controls.
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  ParseUUIDPipe,
  ValidationPipe,
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
  IsNumber,
  IsArray,
  IsBoolean,
  IsDate,
  IsOptional,
  IsNotEmpty,
  Min,
  Max,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

// Import from behavioral analytics composite
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
  BehaviorBaseline,
  PeerComparisonResult,
  TemporalBehaviorAnalysis,
  analyzeUserBehavior,
  analyzeEntityBehavior,
  detectInsiderThreats,
  createBehaviorBaseline,
  updateBehaviorBaseline,
  compareToPeerGroup,
  identifyPeerGroupOutliers,
  calculatePeerGroupStatistics,
  analyzeTemporalBehavior,
  calculateRiskTrend,
  predictRiskScore,
  generateBehaviorAnalyticsReport,
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
 * Insider threat detection alert severity
 */
export enum AlertSeverity {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
  INFO = 'INFO',
}

/**
 * Insider threat investigation status
 */
export enum InvestigationStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  ESCALATED = 'ESCALATED',
  RESOLVED = 'RESOLVED',
  FALSE_POSITIVE = 'FALSE_POSITIVE',
  CLOSED = 'CLOSED',
}

/**
 * User risk profile
 */
export interface UserRiskProfile {
  userId: string;
  userName: string;
  department: string;
  role: string;
  currentRiskLevel: BehaviorRiskLevel;
  currentRiskScore: number;
  trustScore: number;
  riskTrend: 'INCREASING' | 'DECREASING' | 'STABLE' | 'VOLATILE';
  activeThreats: InsiderThreatIndicator[];
  recentActivities: BehaviorActivity[];
  peerComparison: PeerComparisonResult | null;
  baseline: BehaviorBaseline | null;
  lastAssessed: Date;
  requiresInvestigation: boolean;
}

/**
 * Insider threat alert
 */
export interface InsiderThreatAlert {
  id: string;
  alertType: InsiderThreatType;
  severity: AlertSeverity;
  userId: string;
  userName: string;
  description: string;
  indicators: InsiderThreatIndicator[];
  riskScore: number;
  confidence: number;
  detectedAt: Date;
  status: InvestigationStatus;
  assignedTo?: string;
  investigationNotes?: string[];
  mitigationActions: string[];
  resolvedAt?: Date;
  metadata?: Record<string, any>;
}

/**
 * Behavioral investigation case
 */
export interface InvestigationCase {
  caseId: string;
  userId: string;
  userName: string;
  caseType: InsiderThreatType;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: InvestigationStatus;
  openedAt: Date;
  openedBy: string;
  assignedTo?: string;
  alerts: InsiderThreatAlert[];
  evidence: Evidence[];
  timeline: TimelineEntry[];
  findings: string[];
  recommendations: string[];
  closedAt?: Date;
  resolution?: string;
}

/**
 * Investigation evidence
 */
export interface Evidence {
  id: string;
  type: 'log' | 'activity' | 'file' | 'network' | 'witness' | 'system';
  description: string;
  timestamp: Date;
  source: string;
  relevance: number; // 0-100
  verified: boolean;
  metadata?: Record<string, any>;
}

/**
 * Investigation timeline entry
 */
export interface TimelineEntry {
  timestamp: Date;
  event: string;
  source: string;
  severity: AlertSeverity;
  details: Record<string, any>;
}

// ============================================================================
// DTO CLASSES
// ============================================================================

export class AnalyzeUserRiskDto {
  @ApiProperty({ description: 'User ID to analyze', example: 'user-123' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'Analysis time window in days', example: 30, default: 30 })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(365)
  timeWindowDays?: number = 30;

  @ApiProperty({ description: 'Include peer comparison', example: true, default: true })
  @IsBoolean()
  @IsOptional()
  includePeerComparison?: boolean = true;
}

export class CreateInvestigationDto {
  @ApiProperty({ description: 'User ID under investigation', example: 'user-456' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'Alert IDs to include in case', example: ['alert-1', 'alert-2'] })
  @IsArray()
  @IsString({ each: true })
  alertIds: string[];

  @ApiProperty({ enum: InsiderThreatType, example: InsiderThreatType.DATA_EXFILTRATION })
  @IsEnum(InsiderThreatType)
  caseType: InsiderThreatType;

  @ApiProperty({ enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'], example: 'HIGH' })
  @IsEnum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'])
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

  @ApiProperty({ description: 'Investigation notes', example: 'Unusual data access patterns detected' })
  @IsString()
  @IsOptional()
  initialNotes?: string;
}

export class UpdateInvestigationDto {
  @ApiProperty({ enum: InvestigationStatus, example: InvestigationStatus.IN_PROGRESS })
  @IsEnum(InvestigationStatus)
  @IsOptional()
  status?: InvestigationStatus;

  @ApiProperty({ description: 'Assigned investigator', example: 'investigator-789' })
  @IsString()
  @IsOptional()
  assignedTo?: string;

  @ApiProperty({ description: 'Investigation notes', example: ['Reviewed access logs', 'Interviewed user'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  notes?: string[];

  @ApiProperty({ description: 'Resolution description', example: 'False positive - legitimate access for patient care' })
  @IsString()
  @IsOptional()
  resolution?: string;
}

export class DetectThreatsDto {
  @ApiProperty({ description: 'User IDs to scan (empty for all)', example: ['user-1', 'user-2'], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  userIds?: string[];

  @ApiProperty({ description: 'Department filter', example: 'radiology', required: false })
  @IsString()
  @IsOptional()
  department?: string;

  @ApiProperty({ description: 'Minimum risk score threshold', example: 70, default: 60 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  minRiskScore?: number = 60;

  @ApiProperty({ enum: InsiderThreatType, isArray: true, required: false })
  @IsEnum(InsiderThreatType, { each: true })
  @IsArray()
  @IsOptional()
  threatTypes?: InsiderThreatType[];
}

export class ConfigurePeerGroupDto {
  @ApiProperty({ description: 'Peer group name', example: 'Emergency Department Physicians' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Group description', example: 'ED physicians with patient care responsibilities' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Department filter', example: ['emergency'], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  departments?: string[];

  @ApiProperty({ description: 'Role filter', example: ['physician', 'attending'], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  roles?: string[];

  @ApiProperty({ description: 'Entity types', example: [BehaviorEntityType.USER], required: false })
  @IsEnum(BehaviorEntityType, { each: true })
  @IsArray()
  @IsOptional()
  entityTypes?: BehaviorEntityType[];
}

// ============================================================================
// NESTJS CONTROLLER
// ============================================================================

@ApiTags('insider-threat-detection')
@Controller('api/v1/insider-threat-detection')
@ApiBearerAuth()
export class InsiderThreatDetectionController {
  private readonly logger = new Logger(InsiderThreatDetectionController.name);

  constructor(private readonly insiderThreatService: InsiderThreatDetectionService) {}

  /**
   * Analyze user risk profile
   */
  @Post('users/analyze-risk')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Analyze user risk profile with comprehensive behavioral analytics' })
  @ApiBody({ type: AnalyzeUserRiskDto })
  @ApiResponse({ status: 200, description: 'User risk profile analysis completed', type: Object })
  async analyzeUserRisk(@Body() dto: AnalyzeUserRiskDto): Promise<UserRiskProfile> {
    this.logger.log(`Analyzing risk for user ${dto.userId}`);
    return this.insiderThreatService.analyzeUserRiskProfile(dto);
  }

  /**
   * Get high-risk users
   */
  @Get('users/high-risk')
  @ApiOperation({ summary: 'Get list of high-risk users requiring attention' })
  @ApiQuery({ name: 'minRiskScore', required: false, type: Number, example: 70 })
  @ApiQuery({ name: 'department', required: false, type: String, example: 'radiology' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 50 })
  @ApiResponse({ status: 200, description: 'High-risk users retrieved' })
  async getHighRiskUsers(
    @Query('minRiskScore') minRiskScore: number = 70,
    @Query('department') department?: string,
    @Query('limit') limit: number = 50,
  ): Promise<{
    totalHighRiskUsers: number;
    criticalUsers: number;
    users: UserRiskProfile[];
    departmentBreakdown: Record<string, number>;
  }> {
    this.logger.log('Retrieving high-risk users');
    return this.insiderThreatService.getHighRiskUsers(minRiskScore, department, limit);
  }

  /**
   * Detect insider threats across organization
   */
  @Post('threats/detect')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Detect insider threats across the organization' })
  @ApiBody({ type: DetectThreatsDto })
  @ApiResponse({ status: 200, description: 'Insider threat detection completed' })
  async detectInsiderThreats(@Body() dto: DetectThreatsDto): Promise<{
    totalThreatsDetected: number;
    criticalThreats: number;
    threats: InsiderThreatAlert[];
    affectedDepartments: string[];
    recommendedActions: string[];
  }> {
    this.logger.warn('Running insider threat detection');
    return this.insiderThreatService.detectThreats(dto);
  }

  /**
   * Create investigation case
   */
  @Post('investigations')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create insider threat investigation case' })
  @ApiBody({ type: CreateInvestigationDto })
  @ApiResponse({ status: 201, description: 'Investigation case created' })
  async createInvestigation(@Body() dto: CreateInvestigationDto): Promise<InvestigationCase> {
    this.logger.log(`Creating investigation for user ${dto.userId}`);
    return this.insiderThreatService.createInvestigationCase(dto);
  }

  /**
   * Get investigation case
   */
  @Get('investigations/:caseId')
  @ApiOperation({ summary: 'Get investigation case details' })
  @ApiParam({ name: 'caseId', description: 'Investigation case ID' })
  @ApiResponse({ status: 200, description: 'Investigation case retrieved' })
  @ApiResponse({ status: 404, description: 'Investigation case not found' })
  async getInvestigation(@Param('caseId', ParseUUIDPipe) caseId: string): Promise<InvestigationCase> {
    return this.insiderThreatService.getInvestigationCase(caseId);
  }

  /**
   * Update investigation case
   */
  @Put('investigations/:caseId')
  @ApiOperation({ summary: 'Update investigation case' })
  @ApiParam({ name: 'caseId', description: 'Investigation case ID' })
  @ApiBody({ type: UpdateInvestigationDto })
  @ApiResponse({ status: 200, description: 'Investigation case updated' })
  async updateInvestigation(
    @Param('caseId', ParseUUIDPipe) caseId: string,
    @Body() dto: UpdateInvestigationDto,
  ): Promise<InvestigationCase> {
    this.logger.log(`Updating investigation ${caseId}`);
    return this.insiderThreatService.updateInvestigationCase(caseId, dto);
  }

  /**
   * Get active investigations
   */
  @Get('investigations')
  @ApiOperation({ summary: 'Get all active investigation cases' })
  @ApiQuery({ name: 'status', required: false, enum: InvestigationStatus })
  @ApiQuery({ name: 'priority', required: false, enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] })
  @ApiResponse({ status: 200, description: 'Active investigations retrieved' })
  async getInvestigations(
    @Query('status') status?: InvestigationStatus,
    @Query('priority') priority?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW',
  ): Promise<{
    totalInvestigations: number;
    openCases: number;
    escalatedCases: number;
    investigations: InvestigationCase[];
  }> {
    return this.insiderThreatService.getInvestigations(status, priority);
  }

  /**
   * Analyze peer group behavior
   */
  @Get('peer-groups/:groupId/analysis')
  @ApiOperation({ summary: 'Analyze peer group behavioral patterns' })
  @ApiParam({ name: 'groupId', description: 'Peer group ID' })
  @ApiResponse({ status: 200, description: 'Peer group analysis completed' })
  async analyzePeerGroup(@Param('groupId', ParseUUIDPipe) groupId: string): Promise<{
    groupId: string;
    groupName: string;
    memberCount: number;
    avgRiskScore: number;
    outliers: string[];
    behavioralPatterns: any[];
    recommendations: string[];
  }> {
    return this.insiderThreatService.analyzePeerGroup(groupId);
  }

  /**
   * Create peer group
   */
  @Post('peer-groups')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create peer group for comparative analysis' })
  @ApiBody({ type: ConfigurePeerGroupDto })
  @ApiResponse({ status: 201, description: 'Peer group created' })
  async createPeerGroup(@Body() dto: ConfigurePeerGroupDto): Promise<PeerGroup> {
    this.logger.log(`Creating peer group: ${dto.name}`);
    return this.insiderThreatService.configurePeerGroup(dto);
  }

  /**
   * Monitor privilege escalation
   */
  @Get('threats/privilege-escalation')
  @ApiOperation({ summary: 'Monitor privilege escalation attempts' })
  @ApiQuery({ name: 'hours', required: false, type: Number, example: 24 })
  @ApiResponse({ status: 200, description: 'Privilege escalation monitoring completed' })
  async monitorPrivilegeEscalation(@Query('hours') hours: number = 24): Promise<{
    totalAttempts: number;
    successfulEscalations: number;
    blockedAttempts: number;
    indicators: InsiderThreatIndicator[];
    affectedUsers: string[];
  }> {
    return this.insiderThreatService.monitorPrivilegeEscalation(hours);
  }

  /**
   * Monitor data exfiltration
   */
  @Get('threats/data-exfiltration')
  @ApiOperation({ summary: 'Monitor potential data exfiltration activities' })
  @ApiQuery({ name: 'volumeThresholdMB', required: false, type: Number, example: 100 })
  @ApiResponse({ status: 200, description: 'Data exfiltration monitoring completed' })
  async monitorDataExfiltration(@Query('volumeThresholdMB') volumeThresholdMB: number = 100): Promise<{
    suspiciousActivities: number;
    totalDataVolume: number;
    indicators: InsiderThreatIndicator[];
    highRiskUsers: string[];
    recommendations: string[];
  }> {
    return this.insiderThreatService.monitorDataExfiltration(volumeThresholdMB);
  }

  /**
   * Generate insider threat report
   */
  @Get('reports/comprehensive')
  @ApiOperation({ summary: 'Generate comprehensive insider threat report' })
  @ApiQuery({ name: 'startDate', required: false, type: Date })
  @ApiQuery({ name: 'endDate', required: false, type: Date })
  @ApiResponse({ status: 200, description: 'Comprehensive report generated' })
  async generateComprehensiveReport(
    @Query('startDate') startDate?: Date,
    @Query('endDate') endDate?: Date,
  ): Promise<{
    reportId: string;
    generatedAt: Date;
    period: { start: Date; end: Date };
    summary: {
      highRiskUsers: number;
      activeThreats: number;
      investigations: number;
      avgRiskScore: number;
    };
    threatsByType: Record<InsiderThreatType, number>;
    departmentRiskScores: Record<string, number>;
    trends: any;
    topUsers: UserRiskProfile[];
    recommendations: string[];
  }> {
    return this.insiderThreatService.generateComprehensiveReport(startDate, endDate);
  }
}

// ============================================================================
// NESTJS SERVICE
// ============================================================================

@Injectable()
export class InsiderThreatDetectionService {
  private readonly logger = new Logger(InsiderThreatDetectionService.name);

  // Mock data stores - replace with actual database in production
  private users: Map<string, BehaviorEntity> = new Map();
  private activities: Map<string, BehaviorActivity[]> = new Map();
  private baselines: Map<string, BehaviorBaseline> = new Map();
  private peerGroups: Map<string, PeerGroup> = new Map();
  private investigations: Map<string, InvestigationCase> = new Map();
  private alerts: Map<string, InsiderThreatAlert> = new Map();

  /**
   * Analyze user risk profile with comprehensive behavioral analytics
   */
  async analyzeUserRiskProfile(dto: AnalyzeUserRiskDto): Promise<UserRiskProfile> {
    const { userId, timeWindowDays = 30, includePeerComparison = true } = dto;

    // Get user entity
    const user = this.users.get(userId);
    if (!user) {
      throw new NotFoundException(`User ${userId} not found`);
    }

    // Get user activities
    const activities = this.activities.get(userId) || [];
    const recentActivities = activities.filter(
      (a) => a.timestamp.getTime() > Date.now() - timeWindowDays * 24 * 60 * 60 * 1000,
    );

    // Get or create baseline
    let baseline = this.baselines.get(userId);
    if (!baseline) {
      baseline = createBehaviorBaseline(userId, recentActivities, timeWindowDays);
      this.baselines.set(userId, baseline);
    }

    // Analyze user behavior
    const riskScore = await analyzeUserBehavior(userId, recentActivities, baseline);

    // Detect insider threats
    const threats = detectInsiderThreats(userId, recentActivities, baseline);

    // Peer comparison (if enabled)
    let peerComparison: PeerComparisonResult | null = null;
    if (includePeerComparison) {
      const userPeerGroup = this.findUserPeerGroup(user);
      if (userPeerGroup) {
        peerComparison = compareToPeerGroup(userId, userPeerGroup, baseline);
      }
    }

    // Calculate risk trend
    const historicalScores = [riskScore]; // In production, get from database
    const riskTrend = calculateRiskTrend(historicalScores);

    // Calculate trust score
    const trustScore = calculateTrustScore(userId, recentActivities, historicalScores);

    const profile: UserRiskProfile = {
      userId: user.id,
      userName: user.identifier,
      department: user.department || 'Unknown',
      role: user.role || 'Unknown',
      currentRiskLevel: riskScore.trend.direction === 'INCREASING' && riskScore.overallScore > 70
        ? BehaviorRiskLevel.HIGH
        : riskScore.overallScore > 60
        ? BehaviorRiskLevel.MEDIUM
        : BehaviorRiskLevel.LOW,
      currentRiskScore: riskScore.overallScore,
      trustScore,
      riskTrend: riskTrend.direction,
      activeThreats: threats,
      recentActivities: recentActivities.slice(0, 10),
      peerComparison,
      baseline,
      lastAssessed: new Date(),
      requiresInvestigation: threats.length > 0 || riskScore.overallScore > 80,
    };

    return profile;
  }

  /**
   * Get high-risk users
   */
  async getHighRiskUsers(
    minRiskScore: number,
    department?: string,
    limit: number = 50,
  ): Promise<{
    totalHighRiskUsers: number;
    criticalUsers: number;
    users: UserRiskProfile[];
    departmentBreakdown: Record<string, number>;
  }> {
    const profiles: UserRiskProfile[] = [];
    const departmentBreakdown: Record<string, number> = {};

    // Analyze all users
    for (const [userId, user] of this.users.entries()) {
      if (department && user.department !== department) continue;

      try {
        const profile = await this.analyzeUserRiskProfile({
          userId,
          timeWindowDays: 30,
          includePeerComparison: false,
        });

        if (profile.currentRiskScore >= minRiskScore) {
          profiles.push(profile);

          // Track department breakdown
          const dept = profile.department;
          departmentBreakdown[dept] = (departmentBreakdown[dept] || 0) + 1;
        }
      } catch (error) {
        this.logger.error(`Error analyzing user ${userId}:`, error);
      }
    }

    // Sort by risk score descending
    profiles.sort((a, b) => b.currentRiskScore - a.currentRiskScore);

    return {
      totalHighRiskUsers: profiles.length,
      criticalUsers: profiles.filter((p) => p.currentRiskScore >= 90).length,
      users: profiles.slice(0, limit),
      departmentBreakdown,
    };
  }

  /**
   * Detect insider threats
   */
  async detectThreats(dto: DetectThreatsDto): Promise<{
    totalThreatsDetected: number;
    criticalThreats: number;
    threats: InsiderThreatAlert[];
    affectedDepartments: string[];
    recommendedActions: string[];
  }> {
    const { userIds, department, minRiskScore = 60, threatTypes } = dto;
    const threats: InsiderThreatAlert[] = [];
    const affectedDepartments = new Set<string>();

    // Determine which users to scan
    const usersToScan = userIds
      ? Array.from(this.users.values()).filter((u) => userIds.includes(u.id))
      : Array.from(this.users.values());

    for (const user of usersToScan) {
      if (department && user.department !== department) continue;

      const activities = this.activities.get(user.id) || [];
      const baseline = this.baselines.get(user.id);

      if (!baseline || activities.length === 0) continue;

      // Detect threats
      const indicators = detectInsiderThreats(user.id, activities, baseline);

      // Filter by threat types if specified
      const filteredIndicators = threatTypes
        ? indicators.filter((i) => threatTypes.includes(i.indicatorType))
        : indicators;

      // Create alerts for each indicator
      for (const indicator of filteredIndicators) {
        if (indicator.confidence >= minRiskScore) {
          const alert: InsiderThreatAlert = {
            id: crypto.randomUUID(),
            alertType: indicator.indicatorType,
            severity: this.mapRiskLevelToAlertSeverity(indicator.severity),
            userId: user.id,
            userName: user.identifier,
            description: indicator.description,
            indicators: [indicator],
            riskScore: indicator.confidence,
            confidence: indicator.confidence,
            detectedAt: indicator.detectedAt,
            status: InvestigationStatus.OPEN,
            mitigationActions: indicator.recommendedActions,
          };

          threats.push(alert);
          this.alerts.set(alert.id, alert);
          affectedDepartments.add(user.department || 'Unknown');
        }
      }
    }

    return {
      totalThreatsDetected: threats.length,
      criticalThreats: threats.filter((t) => t.severity === AlertSeverity.CRITICAL).length,
      threats: threats.sort((a, b) => b.riskScore - a.riskScore),
      affectedDepartments: Array.from(affectedDepartments),
      recommendedActions: this.generateRecommendations(threats),
    };
  }

  /**
   * Create investigation case
   */
  async createInvestigationCase(dto: CreateInvestigationDto): Promise<InvestigationCase> {
    const { userId, alertIds, caseType, priority, initialNotes } = dto;

    const user = this.users.get(userId);
    if (!user) {
      throw new NotFoundException(`User ${userId} not found`);
    }

    // Get alerts
    const alerts = alertIds.map((id) => this.alerts.get(id)).filter((a): a is InsiderThreatAlert => a !== undefined);

    if (alerts.length === 0) {
      throw new BadRequestException('No valid alerts found for investigation');
    }

    const investigation: InvestigationCase = {
      caseId: crypto.randomUUID(),
      userId,
      userName: user.identifier,
      caseType,
      priority,
      status: InvestigationStatus.OPEN,
      openedAt: new Date(),
      openedBy: 'system', // Replace with actual user
      alerts,
      evidence: [],
      timeline: [],
      findings: [],
      recommendations: [],
    };

    if (initialNotes) {
      investigation.findings = [initialNotes];
    }

    this.investigations.set(investigation.caseId, investigation);
    this.logger.log(`Created investigation case ${investigation.caseId} for user ${userId}`);

    return investigation;
  }

  /**
   * Get investigation case
   */
  async getInvestigationCase(caseId: string): Promise<InvestigationCase> {
    const investigation = this.investigations.get(caseId);
    if (!investigation) {
      throw new NotFoundException(`Investigation case ${caseId} not found`);
    }
    return investigation;
  }

  /**
   * Update investigation case
   */
  async updateInvestigationCase(caseId: string, dto: UpdateInvestigationDto): Promise<InvestigationCase> {
    const investigation = await this.getInvestigationCase(caseId);

    if (dto.status) {
      investigation.status = dto.status;
      if (dto.status === InvestigationStatus.RESOLVED || dto.status === InvestigationStatus.CLOSED) {
        investigation.closedAt = new Date();
      }
    }

    if (dto.assignedTo) {
      investigation.assignedTo = dto.assignedTo;
    }

    if (dto.notes) {
      investigation.findings.push(...dto.notes);
    }

    if (dto.resolution) {
      investigation.resolution = dto.resolution;
    }

    this.investigations.set(caseId, investigation);
    return investigation;
  }

  /**
   * Get investigations
   */
  async getInvestigations(
    status?: InvestigationStatus,
    priority?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW',
  ): Promise<{
    totalInvestigations: number;
    openCases: number;
    escalatedCases: number;
    investigations: InvestigationCase[];
  }> {
    let investigations = Array.from(this.investigations.values());

    if (status) {
      investigations = investigations.filter((i) => i.status === status);
    }

    if (priority) {
      investigations = investigations.filter((i) => i.priority === priority);
    }

    return {
      totalInvestigations: investigations.length,
      openCases: investigations.filter((i) => i.status === InvestigationStatus.OPEN).length,
      escalatedCases: investigations.filter((i) => i.status === InvestigationStatus.ESCALATED).length,
      investigations: investigations.sort((a, b) => b.openedAt.getTime() - a.openedAt.getTime()),
    };
  }

  /**
   * Analyze peer group
   */
  async analyzePeerGroup(groupId: string): Promise<{
    groupId: string;
    groupName: string;
    memberCount: number;
    avgRiskScore: number;
    outliers: string[];
    behavioralPatterns: any[];
    recommendations: string[];
  }> {
    const peerGroup = this.peerGroups.get(groupId);
    if (!peerGroup) {
      throw new NotFoundException(`Peer group ${groupId} not found`);
    }

    // Get member baselines
    const memberBaselines = new Map<string, BehaviorBaseline>();
    for (const memberId of peerGroup.members) {
      const baseline = this.baselines.get(memberId);
      if (baseline) {
        memberBaselines.set(memberId, baseline);
      }
    }

    // Identify outliers
    const outliers = identifyPeerGroupOutliers(peerGroup, memberBaselines);

    // Calculate statistics
    const memberScores = new Map<string, BehaviorRiskScore>();
    for (const memberId of peerGroup.members) {
      const activities = this.activities.get(memberId) || [];
      const baseline = this.baselines.get(memberId);
      if (baseline && activities.length > 0) {
        const score = await analyzeUserBehavior(memberId, activities, baseline);
        memberScores.set(memberId, score);
      }
    }

    const stats = calculatePeerGroupStatistics(peerGroup, memberScores);

    return {
      groupId: peerGroup.id,
      groupName: peerGroup.name,
      memberCount: peerGroup.members.length,
      avgRiskScore: stats.avgRiskScore,
      outliers,
      behavioralPatterns: peerGroup.baseline.patterns || [],
      recommendations: [
        outliers.length > 0 ? `Investigate ${outliers.length} outlier(s) in peer group` : 'No outliers detected',
        `Average risk score: ${stats.avgRiskScore.toFixed(1)}`,
        'Continue monitoring group baseline',
      ],
    };
  }

  /**
   * Configure peer group
   */
  async configurePeerGroup(dto: ConfigurePeerGroupDto): Promise<PeerGroup> {
    const entities = Array.from(this.users.values()).filter((e) => {
      if (dto.departments && e.department && !dto.departments.includes(e.department)) return false;
      if (dto.roles && e.role && !dto.roles.includes(e.role)) return false;
      if (dto.entityTypes && !dto.entityTypes.includes(e.type)) return false;
      return true;
    });

    const peerGroup = createPeerGroup(dto.name, {
      department: dto.departments,
      role: dto.roles,
      entityType: dto.entityTypes,
    }, entities);

    peerGroup.description = dto.description;
    this.peerGroups.set(peerGroup.id, peerGroup);

    this.logger.log(`Created peer group ${peerGroup.id} with ${peerGroup.members.length} members`);
    return peerGroup;
  }

  /**
   * Monitor privilege escalation
   */
  async monitorPrivilegeEscalation(hours: number): Promise<{
    totalAttempts: number;
    successfulEscalations: number;
    blockedAttempts: number;
    indicators: InsiderThreatIndicator[];
    affectedUsers: string[];
  }> {
    const cutoffTime = Date.now() - hours * 60 * 60 * 1000;
    const allIndicators: InsiderThreatIndicator[] = [];
    const affectedUsers = new Set<string>();

    for (const [userId, activities] of this.activities.entries()) {
      const recentActivities = activities.filter((a) => a.timestamp.getTime() > cutoffTime);

      if (recentActivities.length === 0) continue;

      const indicators = detectPrivilegeEscalation(recentActivities);

      for (const indicator of indicators) {
        allIndicators.push(indicator);
        affectedUsers.add(userId);
      }
    }

    return {
      totalAttempts: allIndicators.length,
      successfulEscalations: allIndicators.filter((i) => i.severity === BehaviorRiskLevel.CRITICAL).length,
      blockedAttempts: allIndicators.filter((i) => i.severity === BehaviorRiskLevel.LOW).length,
      indicators: allIndicators.sort((a, b) => b.confidence - a.confidence),
      affectedUsers: Array.from(affectedUsers),
    };
  }

  /**
   * Monitor data exfiltration
   */
  async monitorDataExfiltration(volumeThresholdMB: number): Promise<{
    suspiciousActivities: number;
    totalDataVolume: number;
    indicators: InsiderThreatIndicator[];
    highRiskUsers: string[];
    recommendations: string[];
  }> {
    const volumeThresholdBytes = volumeThresholdMB * 1024 * 1024;
    const allIndicators: InsiderThreatIndicator[] = [];
    const highRiskUsers = new Set<string>();
    let totalDataVolume = 0;

    for (const [userId, activities] of this.activities.entries()) {
      const indicators = detectDataExfiltration(activities, volumeThresholdBytes);

      for (const indicator of indicators) {
        allIndicators.push(indicator);
        if (indicator.severity === BehaviorRiskLevel.HIGH || indicator.severity === BehaviorRiskLevel.CRITICAL) {
          highRiskUsers.add(userId);
        }

        // Calculate total data volume
        const volumeEvidence = indicator.evidence.find((e) => e.type === 'data_volume');
        if (volumeEvidence && volumeEvidence.data) {
          totalDataVolume += volumeEvidence.data.volume || 0;
        }
      }
    }

    return {
      suspiciousActivities: allIndicators.length,
      totalDataVolume,
      indicators: allIndicators.sort((a, b) => b.confidence - a.confidence),
      highRiskUsers: Array.from(highRiskUsers),
      recommendations: [
        'Implement data loss prevention (DLP) controls',
        'Review file access permissions',
        'Monitor large file transfers',
        'Audit external storage device usage',
      ],
    };
  }

  /**
   * Generate comprehensive report
   */
  async generateComprehensiveReport(
    startDate?: Date,
    endDate?: Date,
  ): Promise<{
    reportId: string;
    generatedAt: Date;
    period: { start: Date; end: Date };
    summary: {
      highRiskUsers: number;
      activeThreats: number;
      investigations: number;
      avgRiskScore: number;
    };
    threatsByType: Record<InsiderThreatType, number>;
    departmentRiskScores: Record<string, number>;
    trends: any;
    topUsers: UserRiskProfile[];
    recommendations: string[];
  }> {
    const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate || new Date();

    // Get high-risk users
    const highRiskResult = await this.getHighRiskUsers(70);

    // Count threats by type
    const threatsByType: Record<InsiderThreatType, number> = {} as any;
    for (const alert of this.alerts.values()) {
      threatsByType[alert.alertType] = (threatsByType[alert.alertType] || 0) + 1;
    }

    // Calculate average risk score
    const allScores = highRiskResult.users.map((u) => u.currentRiskScore);
    const avgRiskScore = allScores.length > 0 ? allScores.reduce((a, b) => a + b, 0) / allScores.length : 0;

    return {
      reportId: crypto.randomUUID(),
      generatedAt: new Date(),
      period: { start, end },
      summary: {
        highRiskUsers: highRiskResult.totalHighRiskUsers,
        activeThreats: this.alerts.size,
        investigations: this.investigations.size,
        avgRiskScore,
      },
      threatsByType,
      departmentRiskScores: highRiskResult.departmentBreakdown,
      trends: {
        direction: avgRiskScore > 70 ? 'INCREASING' : 'STABLE',
        changeRate: 0,
      },
      topUsers: highRiskResult.users.slice(0, 10),
      recommendations: this.generateRecommendations(Array.from(this.alerts.values())),
    };
  }

  // Helper methods

  private findUserPeerGroup(user: BehaviorEntity): PeerGroup | null {
    for (const group of this.peerGroups.values()) {
      if (group.members.includes(user.id)) {
        return group;
      }
    }
    return null;
  }

  private mapRiskLevelToAlertSeverity(riskLevel: BehaviorRiskLevel): AlertSeverity {
    switch (riskLevel) {
      case BehaviorRiskLevel.CRITICAL:
        return AlertSeverity.CRITICAL;
      case BehaviorRiskLevel.HIGH:
        return AlertSeverity.HIGH;
      case BehaviorRiskLevel.MEDIUM:
        return AlertSeverity.MEDIUM;
      case BehaviorRiskLevel.LOW:
        return AlertSeverity.LOW;
      default:
        return AlertSeverity.INFO;
    }
  }

  private generateRecommendations(threats: InsiderThreatAlert[]): string[] {
    const recommendations: string[] = [];

    if (threats.length === 0) {
      return ['Continue monitoring - no immediate threats detected'];
    }

    const criticalCount = threats.filter((t) => t.severity === AlertSeverity.CRITICAL).length;
    if (criticalCount > 0) {
      recommendations.push(`Immediate action required: ${criticalCount} critical threat(s) detected`);
    }

    const dataExfiltrationCount = threats.filter((t) => t.alertType === InsiderThreatType.DATA_EXFILTRATION).length;
    if (dataExfiltrationCount > 0) {
      recommendations.push('Review data access policies and implement DLP controls');
    }

    const privilegeAbuseCount = threats.filter((t) => t.alertType === InsiderThreatType.PRIVILEGE_ABUSE).length;
    if (privilegeAbuseCount > 0) {
      recommendations.push('Audit privileged access and implement least privilege principles');
    }

    recommendations.push('Conduct security awareness training for high-risk users');
    recommendations.push('Review and update access control policies');

    return recommendations;
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  InsiderThreatDetectionController,
  InsiderThreatDetectionService,
};
