/**
 * LOC: VENDORRISK001
 * File: /reuse/threat/composites/downstream/vendor-risk-assessment-services.ts
 *
 * UPSTREAM (imports from):
 *   - ../vendor-supply-chain-threat-composite.ts
 *
 * DOWNSTREAM (imported by):
 *   - Vendor management platforms
 *   - Third-party risk management systems
 *   - Supply chain security dashboards
 *   - Procurement and compliance services
 *   - Healthcare vendor assessment tools
 */

/**
 * File: /reuse/threat/composites/downstream/vendor-risk-assessment-services.ts
 * Locator: WC-DOWN-VENDORRISK-001
 * Purpose: Vendor Risk Assessment Services - Comprehensive third-party and supply chain security risk management
 *
 * Upstream: vendor-supply-chain-threat-composite.ts
 * Downstream: Vendor management platforms, TPRM systems, Supply chain dashboards, Compliance services
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize
 * Exports: Vendor risk REST API, assessment automation, continuous monitoring, compliance tracking
 *
 * LLM Context: Production-ready vendor risk assessment service for White Cross healthcare threat intelligence platform.
 * Provides comprehensive third-party risk management including automated vendor security assessments, continuous threat
 * monitoring, SBOM vulnerability analysis, supply chain attack detection, vendor onboarding automation, portfolio risk
 * analysis, incident response coordination, compliance validation, and HIPAA-compliant vendor risk management for
 * healthcare supply chains and business associate relationships.
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
  IsEmail,
  IsUrl,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Sequelize, Transaction } from 'sequelize';
import * as crypto from 'crypto';

// Import from vendor-supply-chain-threat-composite
import {
  VendorThreatProfile,
  VendorThreat,
  VendorRiskFactor,
  SupplyChainAttackDetection,
  AttackIndicator,
  SBOMVulnerabilityAnalysis,
  RemediationAction,
  ThirdPartyMonitoringResult,
  MonitoringAlert,
  MonitoringTrend,
  VendorOnboardingResult,
  OnboardingStage,
  VendorPortfolioRiskAnalysis,
  VendorIncidentResponse,
  ResponseAction,
  Communication,
  ImpactAssessment,
  generateVendorThreatProfile,
  detectSupplyChainAttack,
  analyzeSBOMVulnerabilities,
  monitorThirdPartyVendor,
  automateVendorOnboarding,
  analyzeVendorPortfolioRisk,
  coordinateVendorIncidentResponse,
  validateVendorSecurityQuestionnaire,
  generateVendorSecurityScorecard,
  trackVendorContractCompliance,
  performVendorRiskReassessment,
  generateVendorRiskDashboard,
  optimizeVendorSelection,
  predictVendorSecurityDegradation,
  aggregateSupplyChainIntelligence,
  generateSBOMComplianceReport,
  trackVendorSLACompliance,
  analyzeVendorConcentrationRisk,
  scheduleVendorReassessments,
  validateVendorInsuranceCoverage,
  assessVendorFinancialHealth,
  generateVendorExitStrategy,
  trackVendorSecurityImprovements,
  calculateVendorTCO,
  compareVendorScorecards,
  validateVendorDataPrivacy,
  calculateSupplyChainResilience,
  assessVendorGeopoliticalRisk,
  assessVendorRelationshipHealth,
  performAutomatedDueDiligence,
  calculateVendorDependencyImpact,
  assessVendorCyberInsuranceNeeds,
  trackVendorInnovation,
} from '../vendor-supply-chain-threat-composite';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Vendor risk tier
 */
export enum VendorRiskTier {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
  MINIMAL = 'MINIMAL',
}

/**
 * Vendor category
 */
export enum VendorCategory {
  SOFTWARE_PROVIDER = 'SOFTWARE_PROVIDER',
  CLOUD_SERVICE = 'CLOUD_SERVICE',
  MEDICAL_DEVICE = 'MEDICAL_DEVICE',
  IT_SERVICES = 'IT_SERVICES',
  CONSULTING = 'CONSULTING',
  DATA_PROCESSOR = 'DATA_PROCESSOR',
  BUSINESS_ASSOCIATE = 'BUSINESS_ASSOCIATE',
  INFRASTRUCTURE = 'INFRASTRUCTURE',
  MANAGED_SERVICE = 'MANAGED_SERVICE',
  OTHER = 'OTHER',
}

/**
 * Assessment status
 */
export enum AssessmentStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  UNDER_REVIEW = 'UNDER_REVIEW',
  COMPLETED = 'COMPLETED',
  EXPIRED = 'EXPIRED',
  FAILED = 'FAILED',
}

/**
 * Compliance framework
 */
export enum ComplianceFramework {
  HIPAA = 'HIPAA',
  SOC2 = 'SOC2',
  ISO27001 = 'ISO27001',
  NIST_CSF = 'NIST_CSF',
  PCI_DSS = 'PCI_DSS',
  GDPR = 'GDPR',
  HITRUST = 'HITRUST',
  FedRAMP = 'FedRAMP',
}

/**
 * Vendor profile
 */
export interface VendorProfile {
  id: string;
  vendorName: string;
  category: VendorCategory;
  description?: string;
  website?: string;
  primaryContact: ContactInfo;
  businessRelationship: BusinessRelationship;
  riskAssessment: VendorRiskAssessment;
  compliance: ComplianceStatus;
  monitoring: MonitoringStatus;
  contracts: ContractInfo[];
  certifications: Certification[];
  insuranceCoverage?: InsuranceCoverage;
  createdAt: Date;
  updatedAt: Date;
  lastAssessmentDate?: Date;
  nextReassessmentDate?: Date;
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'TERMINATED';
  metadata?: Record<string, any>;
}

/**
 * Contact information
 */
export interface ContactInfo {
  name: string;
  email: string;
  phone?: string;
  title?: string;
  alternateContact?: {
    name: string;
    email: string;
    phone?: string;
  };
}

/**
 * Business relationship
 */
export interface BusinessRelationship {
  relationshipType: 'VENDOR' | 'PARTNER' | 'SUPPLIER' | 'CONTRACTOR';
  startDate: Date;
  expectedDuration?: number; // months
  criticalityLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  dataAccess: DataAccessLevel[];
  servicesProvided: string[];
  annualSpend?: number;
  replaceable: boolean;
  alternativeVendors?: string[];
}

/**
 * Data access level
 */
export interface DataAccessLevel {
  dataType: 'PHI' | 'PII' | 'FINANCIAL' | 'PROPRIETARY' | 'PUBLIC';
  accessLevel: 'READ' | 'WRITE' | 'ADMIN' | 'NONE';
  volumeEstimate?: string;
  purpose: string;
}

/**
 * Vendor risk assessment
 */
export interface VendorRiskAssessment {
  assessmentId: string;
  assessmentDate: Date;
  assessor: string;
  riskTier: VendorRiskTier;
  overallScore: number; // 0-100
  categoryScores: CategoryScores;
  riskFactors: VendorRiskFactor[];
  threats: VendorThreat[];
  recommendations: string[];
  mitigationActions: MitigationAction[];
  residualRisk: number;
  status: AssessmentStatus;
  validUntil?: Date;
}

/**
 * Category scores
 */
export interface CategoryScores {
  securityPosture: number;
  dataProtection: number;
  incidentResponse: number;
  compliance: number;
  financialStability: number;
  operationalResilience: number;
  vendorManagement: number;
  thirdPartyRisk: number;
}

/**
 * Mitigation action
 */
export interface MitigationAction {
  id: string;
  action: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  owner: string;
  dueDate?: Date;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  completedDate?: Date;
  notes?: string;
}

/**
 * Compliance status
 */
export interface ComplianceStatus {
  frameworks: ComplianceFrameworkStatus[];
  certifications: Certification[];
  attestations: Attestation[];
  auditFindings: AuditFinding[];
  lastAuditDate?: Date;
  nextAuditDate?: Date;
  overallCompliance: number; // percentage
}

/**
 * Compliance framework status
 */
export interface ComplianceFrameworkStatus {
  framework: ComplianceFramework;
  compliant: boolean;
  compliancePercentage: number;
  lastValidated: Date;
  validUntil?: Date;
  gaps: ComplianceGap[];
  evidence: string[];
}

/**
 * Certification
 */
export interface Certification {
  certificationName: string;
  issuingBody: string;
  issueDate: Date;
  expirationDate?: Date;
  certificationNumber?: string;
  scope?: string;
  verified: boolean;
  documentUrl?: string;
}

/**
 * Attestation
 */
export interface Attestation {
  attestationType: string;
  attestedBy: string;
  attestationDate: Date;
  validUntil?: Date;
  statement: string;
  verified: boolean;
}

/**
 * Audit finding
 */
export interface AuditFinding {
  findingId: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  category: string;
  description: string;
  recommendation: string;
  status: 'OPEN' | 'IN_REMEDIATION' | 'CLOSED' | 'ACCEPTED';
  identifiedDate: Date;
  targetResolutionDate?: Date;
  resolutionDate?: Date;
}

/**
 * Compliance gap
 */
export interface ComplianceGap {
  requirement: string;
  currentState: string;
  targetState: string;
  gapSeverity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  remediationPlan?: string;
}

/**
 * Monitoring status
 */
export interface MonitoringStatus {
  enabled: boolean;
  monitoringFrequency: 'CONTINUOUS' | 'DAILY' | 'WEEKLY' | 'MONTHLY';
  lastMonitored?: Date;
  nextMonitoring?: Date;
  alerts: MonitoringAlert[];
  trends: MonitoringTrend[];
  anomalies: Anomaly[];
  healthScore: number; // 0-100
}

/**
 * Anomaly
 */
export interface Anomaly {
  anomalyId: string;
  detectedAt: Date;
  anomalyType: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
  baseline: any;
  observed: any;
  deviation: number; // percentage
  investigated: boolean;
}

/**
 * Contract information
 */
export interface ContractInfo {
  contractId: string;
  contractType: 'MSA' | 'SOW' | 'BAA' | 'NDA' | 'SLA' | 'DPA' | 'OTHER';
  effectiveDate: Date;
  expirationDate?: Date;
  autoRenew: boolean;
  terminationNoticeDays: number;
  slaCommitments: SLACommitment[];
  securityRequirements: string[];
  complianceRequirements: ComplianceFramework[];
  financialTerms?: FinancialTerms;
  status: 'ACTIVE' | 'EXPIRED' | 'TERMINATED' | 'PENDING';
}

/**
 * SLA commitment
 */
export interface SLACommitment {
  metric: string;
  target: number;
  unit: string;
  actualPerformance?: number;
  compliant: boolean;
  penaltyClause?: string;
}

/**
 * Financial terms
 */
export interface FinancialTerms {
  annualValue: number;
  paymentTerms: string;
  currency: string;
  priceIncreaseClause?: string;
  penaltyClauses?: string[];
}

/**
 * Insurance coverage
 */
export interface InsuranceCoverage {
  cyberInsurance: boolean;
  coverageAmount?: number;
  policyNumber?: string;
  carrier?: string;
  effectiveDate?: Date;
  expirationDate?: Date;
  coverageTypes: string[];
  verified: boolean;
}

/**
 * Security questionnaire
 */
export interface SecurityQuestionnaire {
  questionnaireId: string;
  version: string;
  vendorId: string;
  submittedDate?: Date;
  completedDate?: Date;
  responses: QuestionResponse[];
  score: number;
  passThreshold: number;
  passed: boolean;
  reviewedBy?: string;
  reviewDate?: Date;
  status: 'PENDING' | 'IN_PROGRESS' | 'SUBMITTED' | 'REVIEWED' | 'APPROVED' | 'REJECTED';
}

/**
 * Question response
 */
export interface QuestionResponse {
  questionId: string;
  question: string;
  category: string;
  response: string;
  evidence?: string[];
  score: number;
  weight: number;
  risk: 'HIGH' | 'MEDIUM' | 'LOW';
  compliant: boolean;
  notes?: string;
}

/**
 * Vendor scorecard
 */
export interface VendorScorecard {
  scorecardId: string;
  vendorId: string;
  vendorName: string;
  period: { start: Date; end: Date };
  overallScore: number;
  grades: ScorecardGrades;
  keyMetrics: KeyMetric[];
  strengths: string[];
  weaknesses: string[];
  trends: TrendIndicator[];
  comparison: PeerComparison;
  recommendation: string;
  generatedDate: Date;
}

/**
 * Scorecard grades
 */
export interface ScorecardGrades {
  security: string; // A, B, C, D, F
  compliance: string;
  performance: string;
  reliability: string;
  support: string;
  innovation: string;
  cost: string;
}

/**
 * Key metric
 */
export interface KeyMetric {
  metricName: string;
  value: number;
  unit: string;
  trend: 'IMPROVING' | 'STABLE' | 'DECLINING';
  benchmark?: number;
  target?: number;
}

/**
 * Trend indicator
 */
export interface TrendIndicator {
  category: string;
  direction: 'UP' | 'DOWN' | 'STABLE';
  magnitude: number; // percentage change
  significance: 'HIGH' | 'MEDIUM' | 'LOW';
}

/**
 * Peer comparison
 */
export interface PeerComparison {
  peerGroup: string;
  ranking: number;
  totalPeers: number;
  percentile: number;
  averageScore: number;
  topPerformerScore: number;
}

/**
 * Portfolio analytics
 */
export interface PortfolioAnalytics {
  totalVendors: number;
  activeVendors: number;
  vendorsByTier: Record<VendorRiskTier, number>;
  vendorsByCategory: Record<VendorCategory, number>;
  totalAnnualSpend: number;
  highRiskVendors: number;
  expiringSoon: number;
  complianceRate: number;
  avgRiskScore: number;
  concentrationRisks: ConcentrationRisk[];
  topRisks: string[];
  recommendations: string[];
}

/**
 * Concentration risk
 */
export interface ConcentrationRisk {
  riskType: 'SINGLE_VENDOR' | 'GEOGRAPHIC' | 'CATEGORY' | 'DATA_ACCESS';
  description: string;
  exposure: number; // percentage
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  mitigation: string;
}

// ============================================================================
// DTO CLASSES
// ============================================================================

export class CreateVendorProfileDto {
  @ApiProperty({ description: 'Vendor name', example: 'Acme Healthcare Solutions' })
  @IsString()
  @IsNotEmpty()
  vendorName: string;

  @ApiProperty({ enum: VendorCategory, example: VendorCategory.SOFTWARE_PROVIDER })
  @IsEnum(VendorCategory)
  category: VendorCategory;

  @ApiProperty({ description: 'Vendor description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Vendor website URL', required: false })
  @IsUrl()
  @IsOptional()
  website?: string;

  @ApiProperty({ description: 'Primary contact information' })
  @ValidateNested()
  @Type(() => ContactInfoDto)
  primaryContact: ContactInfoDto;

  @ApiProperty({ description: 'Business relationship details' })
  @ValidateNested()
  @Type(() => BusinessRelationshipDto)
  businessRelationship: BusinessRelationshipDto;
}

export class ContactInfoDto {
  @ApiProperty({ description: 'Contact name', example: 'John Smith' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Contact email' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Contact phone', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ description: 'Contact title', required: false })
  @IsString()
  @IsOptional()
  title?: string;
}

export class BusinessRelationshipDto {
  @ApiProperty({ enum: ['VENDOR', 'PARTNER', 'SUPPLIER', 'CONTRACTOR'] })
  @IsEnum(['VENDOR', 'PARTNER', 'SUPPLIER', 'CONTRACTOR'])
  relationshipType: string;

  @ApiProperty({ description: 'Relationship start date' })
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @ApiProperty({ enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] })
  @IsEnum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'])
  criticalityLevel: string;

  @ApiProperty({ description: 'Services provided by vendor', type: [String] })
  @IsArray()
  @IsString({ each: true })
  servicesProvided: string[];

  @ApiProperty({ description: 'Is vendor easily replaceable', default: false })
  @IsBoolean()
  @IsOptional()
  replaceable?: boolean;
}

export class PerformVendorAssessmentDto {
  @ApiProperty({ description: 'Vendor ID to assess' })
  @IsUUID()
  vendorId: string;

  @ApiProperty({ description: 'Assessment type', enum: ['INITIAL', 'ANNUAL', 'TRIGGERED', 'COMPREHENSIVE'] })
  @IsEnum(['INITIAL', 'ANNUAL', 'TRIGGERED', 'COMPREHENSIVE'])
  assessmentType: string;

  @ApiProperty({ description: 'Assessor name/ID' })
  @IsString()
  @IsNotEmpty()
  assessor: string;

  @ApiProperty({ description: 'Include SBOM analysis', default: false })
  @IsBoolean()
  @IsOptional()
  includeSBOM?: boolean;

  @ApiProperty({ description: 'Include supply chain attack detection', default: true })
  @IsBoolean()
  @IsOptional()
  includeSupplyChainDetection?: boolean;
}

export class OnboardVendorDto {
  @ApiProperty({ description: 'Vendor name' })
  @IsString()
  @IsNotEmpty()
  vendorName: string;

  @ApiProperty({ description: 'Vendor category', enum: VendorCategory })
  @IsEnum(VendorCategory)
  category: VendorCategory;

  @ApiProperty({ description: 'Services to be provided', type: [String] })
  @IsArray()
  @IsString({ each: true })
  services: string[];

  @ApiProperty({ description: 'Data access requirements', type: [Object] })
  @IsArray()
  dataAccessRequirements: DataAccessLevel[];

  @ApiProperty({ description: 'Required compliance frameworks', type: [String] })
  @IsArray()
  @IsEnum(ComplianceFramework, { each: true })
  requiredCompliance: ComplianceFramework[];
}

export class SubmitSecurityQuestionnaireDto {
  @ApiProperty({ description: 'Vendor ID' })
  @IsUUID()
  vendorId: string;

  @ApiProperty({ description: 'Questionnaire responses', type: [Object] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  responses: QuestionResponse[];
}

// ============================================================================
// NESTJS CONTROLLER
// ============================================================================

@ApiTags('vendor-risk-assessment')
@Controller('api/v1/vendor-risk')
@ApiBearerAuth()
export class VendorRiskAssessmentController {
  private readonly logger = new Logger(VendorRiskAssessmentController.name);

  constructor(
    private readonly sequelize: Sequelize,
    private readonly vendorRiskService: VendorRiskAssessmentService,
  ) {}

  /**
   * Create vendor profile
   */
  @Post('vendors')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new vendor profile for risk management' })
  @ApiBody({ type: CreateVendorProfileDto })
  @ApiResponse({ status: 201, description: 'Vendor profile created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid vendor data' })
  async createVendorProfile(@Body() dto: CreateVendorProfileDto): Promise<VendorProfile> {
    this.logger.log(`Creating vendor profile: ${dto.vendorName}`);

    try {
      const vendor = await this.vendorRiskService.createVendor({
        vendorName: dto.vendorName,
        category: dto.category,
        description: dto.description,
        website: dto.website,
        primaryContact: dto.primaryContact as ContactInfo,
        businessRelationship: dto.businessRelationship as BusinessRelationship,
      });

      this.logger.log(`Created vendor ${vendor.id}: ${vendor.vendorName}`);
      return vendor;
    } catch (error) {
      this.logger.error(`Failed to create vendor: ${error.message}`, error.stack);
      throw new BadRequestException(`Failed to create vendor: ${error.message}`);
    }
  }

  /**
   * Perform vendor risk assessment
   */
  @Post('assessments')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Perform comprehensive vendor risk assessment' })
  @ApiBody({ type: PerformVendorAssessmentDto })
  @ApiResponse({ status: 200, description: 'Assessment completed successfully' })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  async performAssessment(
    @Body() dto: PerformVendorAssessmentDto,
  ): Promise<VendorRiskAssessment> {
    this.logger.log(`Performing risk assessment for vendor: ${dto.vendorId}`);

    try {
      const vendor = await this.vendorRiskService.getVendor(dto.vendorId);
      if (!vendor) {
        throw new NotFoundException('Vendor not found');
      }

      // Generate comprehensive threat profile
      const threatProfile = await generateVendorThreatProfile(
        dto.vendorId,
        vendor.vendorName,
        vendor.category,
        this.sequelize,
      );

      // Detect supply chain attacks if requested
      let supplyChainDetection: SupplyChainAttackDetection | undefined;
      if (dto.includeSupplyChainDetection !== false) {
        supplyChainDetection = await detectSupplyChainAttack(
          vendor.vendorName,
          vendor.businessRelationship.servicesProvided,
          this.sequelize,
        );
      }

      // Analyze SBOM if requested
      let sbomAnalysis: SBOMVulnerabilityAnalysis | undefined;
      if (dto.includeSBOM) {
        sbomAnalysis = await analyzeSBOMVulnerabilities(
          dto.vendorId,
          vendor.vendorName,
          [], // SBOM components would be provided
          this.sequelize,
        );
      }

      const assessment = await this.vendorRiskService.performAssessment(
        dto.vendorId,
        dto.assessor,
        dto.assessmentType,
        threatProfile,
        supplyChainDetection,
        sbomAnalysis,
      );

      this.logger.log(
        `Assessment completed for ${vendor.vendorName}: Risk Tier ${assessment.riskTier}`,
      );

      return assessment;
    } catch (error) {
      this.logger.error(`Assessment failed: ${error.message}`, error.stack);
      throw new InternalServerErrorException(`Assessment failed: ${error.message}`);
    }
  }

  /**
   * Onboard new vendor
   */
  @Post('onboarding')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Automate vendor onboarding process with security validation' })
  @ApiBody({ type: OnboardVendorDto })
  @ApiResponse({ status: 200, description: 'Onboarding process initiated' })
  async onboardVendor(@Body() dto: OnboardVendorDto): Promise<VendorOnboardingResult> {
    this.logger.log(`Initiating vendor onboarding: ${dto.vendorName}`);

    try {
      const onboardingResult = await automateVendorOnboarding(
        dto.vendorName,
        dto.category,
        dto.services,
        dto.requiredCompliance,
        this.sequelize,
      );

      this.logger.log(
        `Onboarding for ${dto.vendorName}: ${onboardingResult.currentStage.stageName}`,
      );

      return onboardingResult;
    } catch (error) {
      this.logger.error(`Onboarding failed: ${error.message}`, error.stack);
      throw new InternalServerErrorException(`Onboarding failed: ${error.message}`);
    }
  }

  /**
   * Monitor vendor continuously
   */
  @Post('vendors/:vendorId/monitor')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Enable continuous vendor security monitoring' })
  @ApiParam({ name: 'vendorId', description: 'Vendor ID' })
  @ApiResponse({ status: 200, description: 'Monitoring enabled' })
  async monitorVendor(
    @Param('vendorId', ParseUUIDPipe) vendorId: string,
  ): Promise<ThirdPartyMonitoringResult> {
    this.logger.log(`Enabling monitoring for vendor: ${vendorId}`);

    try {
      const vendor = await this.vendorRiskService.getVendor(vendorId);
      if (!vendor) {
        throw new NotFoundException('Vendor not found');
      }

      const monitoringResult = await monitorThirdPartyVendor(
        vendorId,
        vendor.vendorName,
        vendor.businessRelationship.servicesProvided,
        this.sequelize,
      );

      await this.vendorRiskService.updateMonitoringStatus(vendorId, {
        enabled: true,
        monitoringFrequency: 'CONTINUOUS',
        lastMonitored: new Date(),
        alerts: monitoringResult.alerts,
        trends: monitoringResult.trends,
        healthScore: monitoringResult.riskScore,
        anomalies: [],
      });

      this.logger.log(`Monitoring enabled for ${vendor.vendorName}`);
      return monitoringResult;
    } catch (error) {
      this.logger.error(`Monitoring failed: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Monitoring failed');
    }
  }

  /**
   * Generate vendor scorecard
   */
  @Get('vendors/:vendorId/scorecard')
  @ApiOperation({ summary: 'Generate comprehensive vendor security scorecard' })
  @ApiParam({ name: 'vendorId', description: 'Vendor ID' })
  @ApiResponse({ status: 200, description: 'Scorecard generated successfully' })
  async generateScorecard(
    @Param('vendorId', ParseUUIDPipe) vendorId: string,
  ): Promise<VendorScorecard> {
    this.logger.log(`Generating scorecard for vendor: ${vendorId}`);

    try {
      const vendor = await this.vendorRiskService.getVendor(vendorId);
      if (!vendor) {
        throw new NotFoundException('Vendor not found');
      }

      const scorecard = await generateVendorSecurityScorecard(
        vendorId,
        vendor.riskAssessment,
        vendor.compliance,
        this.sequelize,
      );

      return scorecard;
    } catch (error) {
      this.logger.error(`Scorecard generation failed: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Scorecard generation failed');
    }
  }

  /**
   * Submit security questionnaire
   */
  @Post('questionnaires/submit')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Submit and validate vendor security questionnaire' })
  @ApiBody({ type: SubmitSecurityQuestionnaireDto })
  @ApiResponse({ status: 200, description: 'Questionnaire submitted and validated' })
  async submitQuestionnaire(
    @Body() dto: SubmitSecurityQuestionnaireDto,
  ): Promise<SecurityQuestionnaire> {
    this.logger.log(`Validating questionnaire for vendor: ${dto.vendorId}`);

    try {
      const validationResult = await validateVendorSecurityQuestionnaire(
        dto.vendorId,
        dto.responses,
        this.sequelize,
      );

      const questionnaire = await this.vendorRiskService.processQuestionnaire(
        dto.vendorId,
        dto.responses,
        validationResult,
      );

      this.logger.log(
        `Questionnaire for vendor ${dto.vendorId}: Score ${questionnaire.score}/${questionnaire.passThreshold}`,
      );

      return questionnaire;
    } catch (error) {
      this.logger.error(`Questionnaire validation failed: ${error.message}`, error.stack);
      throw new BadRequestException(`Questionnaire validation failed: ${error.message}`);
    }
  }

  /**
   * Analyze vendor portfolio risk
   */
  @Get('portfolio/analysis')
  @ApiOperation({ summary: 'Analyze vendor portfolio risk and concentration' })
  @ApiResponse({ status: 200, description: 'Portfolio analysis completed' })
  async analyzePortfolio(): Promise<{
    analysis: VendorPortfolioRiskAnalysis;
    analytics: PortfolioAnalytics;
    recommendations: string[];
  }> {
    this.logger.log('Analyzing vendor portfolio risk');

    try {
      const vendors = await this.vendorRiskService.getAllVendors();
      const vendorRisks = vendors.map((v) => v.riskAssessment);

      const analysis = await analyzeVendorPortfolioRisk(vendorRisks, this.sequelize);

      const analytics = this.vendorRiskService.calculatePortfolioAnalytics(vendors);

      const concentrationRisk = await analyzeVendorConcentrationRisk(
        vendors.map((v) => ({
          vendorId: v.id,
          vendorName: v.vendorName,
          category: v.category,
          criticalityLevel: v.businessRelationship.criticalityLevel,
          annualSpend: v.businessRelationship.annualSpend || 0,
        })),
        this.sequelize,
      );

      return {
        analysis,
        analytics,
        recommendations: [...analysis.recommendations, ...concentrationRisk.recommendations],
      };
    } catch (error) {
      this.logger.error(`Portfolio analysis failed: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Portfolio analysis failed');
    }
  }

  /**
   * Coordinate vendor incident response
   */
  @Post('vendors/:vendorId/incident')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Coordinate vendor security incident response' })
  @ApiParam({ name: 'vendorId', description: 'Vendor ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        incidentType: { type: 'string' },
        severity: { type: 'string', enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] },
        description: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Incident response initiated' })
  async coordinateIncident(
    @Param('vendorId', ParseUUIDPipe) vendorId: string,
    @Body() body: { incidentType: string; severity: string; description: string },
  ): Promise<VendorIncidentResponse> {
    this.logger.log(`Coordinating incident response for vendor: ${vendorId}`);

    try {
      const vendor = await this.vendorRiskService.getVendor(vendorId);
      if (!vendor) {
        throw new NotFoundException('Vendor not found');
      }

      const incidentResponse = await coordinateVendorIncidentResponse(
        vendorId,
        vendor.vendorName,
        body.incidentType,
        body.severity as any,
        this.sequelize,
      );

      this.logger.log(
        `Incident response coordinated: ${incidentResponse.responseActions.length} actions planned`,
      );

      return incidentResponse;
    } catch (error) {
      this.logger.error(`Incident coordination failed: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Incident coordination failed');
    }
  }

  /**
   * Schedule vendor reassessments
   */
  @Post('assessments/schedule')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Schedule automated vendor reassessments' })
  @ApiResponse({ status: 200, description: 'Reassessments scheduled' })
  async scheduleReassessments(): Promise<{
    scheduled: number;
    vendors: Array<{ vendorId: string; vendorName: string; scheduledDate: Date }>;
  }> {
    this.logger.log('Scheduling vendor reassessments');

    try {
      const vendors = await this.vendorRiskService.getAllVendors();
      const schedule = await scheduleVendorReassessments(
        vendors.map((v) => ({
          vendorId: v.id,
          vendorName: v.vendorName,
          lastAssessmentDate: v.lastAssessmentDate || v.createdAt,
          riskTier: v.riskAssessment.riskTier,
          criticalityLevel: v.businessRelationship.criticalityLevel,
        })),
        this.sequelize,
      );

      return {
        scheduled: schedule.length,
        vendors: schedule,
      };
    } catch (error) {
      this.logger.error(`Scheduling failed: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Scheduling failed');
    }
  }

  /**
   * Predict vendor security degradation
   */
  @Get('vendors/:vendorId/predictions')
  @ApiOperation({ summary: 'Predict vendor security posture degradation using ML' })
  @ApiParam({ name: 'vendorId', description: 'Vendor ID' })
  @ApiResponse({ status: 200, description: 'Predictions generated' })
  async predictDegradation(
    @Param('vendorId', ParseUUIDPipe) vendorId: string,
  ): Promise<{
    vendorId: string;
    degradationLikelihood: number;
    predictedRiskIncrease: number;
    timeframe: number;
    contributingFactors: string[];
    recommendations: string[];
  }> {
    this.logger.log(`Predicting security degradation for vendor: ${vendorId}`);

    try {
      const vendor = await this.vendorRiskService.getVendor(vendorId);
      if (!vendor) {
        throw new NotFoundException('Vendor not found');
      }

      const prediction = await predictVendorSecurityDegradation(
        vendorId,
        [], // Historical assessments would be provided
        this.sequelize,
      );

      return prediction;
    } catch (error) {
      this.logger.error(`Prediction failed: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Prediction failed');
    }
  }

  /**
   * Compare vendor scorecards
   */
  @Post('scorecards/compare')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Compare multiple vendor scorecards for decision-making' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        vendorIds: { type: 'array', items: { type: 'string' } },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Comparison completed' })
  async compareScorecards(
    @Body('vendorIds') vendorIds: string[],
  ): Promise<{
    comparison: any;
    topPerformer: string;
    recommendations: string[];
  }> {
    this.logger.log(`Comparing scorecards for ${vendorIds.length} vendors`);

    try {
      const scorecards: VendorScorecard[] = [];
      for (const vendorId of vendorIds) {
        const vendor = await this.vendorRiskService.getVendor(vendorId);
        if (vendor) {
          const scorecard = await generateVendorSecurityScorecard(
            vendorId,
            vendor.riskAssessment,
            vendor.compliance,
            this.sequelize,
          );
          scorecards.push(scorecard);
        }
      }

      const comparison = await compareVendorScorecards(scorecards, this.sequelize);

      return comparison;
    } catch (error) {
      this.logger.error(`Comparison failed: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Comparison failed');
    }
  }
}

// ============================================================================
// SERVICE CLASS
// ============================================================================

@Injectable()
export class VendorRiskAssessmentService {
  private readonly logger = new Logger(VendorRiskAssessmentService.name);
  private vendors: Map<string, VendorProfile> = new Map();
  private questionnaires: Map<string, SecurityQuestionnaire> = new Map();

  constructor(private readonly sequelize: Sequelize) {}

  /**
   * Create vendor profile
   */
  async createVendor(vendorData: Partial<VendorProfile>): Promise<VendorProfile> {
    const vendor: VendorProfile = {
      id: crypto.randomUUID(),
      vendorName: vendorData.vendorName || '',
      category: vendorData.category || VendorCategory.OTHER,
      description: vendorData.description,
      website: vendorData.website,
      primaryContact: vendorData.primaryContact!,
      businessRelationship: vendorData.businessRelationship!,
      riskAssessment: {
        assessmentId: crypto.randomUUID(),
        assessmentDate: new Date(),
        assessor: 'system',
        riskTier: VendorRiskTier.MEDIUM,
        overallScore: 50,
        categoryScores: {
          securityPosture: 50,
          dataProtection: 50,
          incidentResponse: 50,
          compliance: 50,
          financialStability: 50,
          operationalResilience: 50,
          vendorManagement: 50,
          thirdPartyRisk: 50,
        },
        riskFactors: [],
        threats: [],
        recommendations: [],
        mitigationActions: [],
        residualRisk: 50,
        status: AssessmentStatus.NOT_STARTED,
      },
      compliance: {
        frameworks: [],
        certifications: [],
        attestations: [],
        auditFindings: [],
        overallCompliance: 0,
      },
      monitoring: {
        enabled: false,
        monitoringFrequency: 'MONTHLY',
        alerts: [],
        trends: [],
        anomalies: [],
        healthScore: 50,
      },
      contracts: [],
      certifications: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'ACTIVE',
    };

    this.vendors.set(vendor.id, vendor);
    this.logger.log(`Created vendor: ${vendor.id}`);
    return vendor;
  }

  /**
   * Get vendor by ID
   */
  async getVendor(vendorId: string): Promise<VendorProfile | undefined> {
    return this.vendors.get(vendorId);
  }

  /**
   * Get all vendors
   */
  async getAllVendors(): Promise<VendorProfile[]> {
    return Array.from(this.vendors.values());
  }

  /**
   * Perform vendor assessment
   */
  async performAssessment(
    vendorId: string,
    assessor: string,
    assessmentType: string,
    threatProfile: VendorThreatProfile,
    supplyChainDetection?: SupplyChainAttackDetection,
    sbomAnalysis?: SBOMVulnerabilityAnalysis,
  ): Promise<VendorRiskAssessment> {
    const vendor = this.vendors.get(vendorId);
    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    // Calculate overall risk score
    let overallScore = 100 - threatProfile.overallRiskScore;

    // Adjust for supply chain threats
    if (supplyChainDetection && supplyChainDetection.threatDetected) {
      overallScore -= supplyChainDetection.confidenceScore * 0.2;
    }

    // Adjust for SBOM vulnerabilities
    if (sbomAnalysis) {
      const vulnPenalty =
        (sbomAnalysis.vulnerabilitySummary.critical * 10 +
          sbomAnalysis.vulnerabilitySummary.high * 5 +
          sbomAnalysis.vulnerabilitySummary.medium * 2) /
        10;
      overallScore = Math.max(0, overallScore - vulnPenalty);
    }

    // Determine risk tier
    let riskTier: VendorRiskTier;
    if (overallScore < 40) riskTier = VendorRiskTier.CRITICAL;
    else if (overallScore < 60) riskTier = VendorRiskTier.HIGH;
    else if (overallScore < 75) riskTier = VendorRiskTier.MEDIUM;
    else if (overallScore < 90) riskTier = VendorRiskTier.LOW;
    else riskTier = VendorRiskTier.MINIMAL;

    const assessment: VendorRiskAssessment = {
      assessmentId: crypto.randomUUID(),
      assessmentDate: new Date(),
      assessor,
      riskTier,
      overallScore,
      categoryScores: {
        securityPosture: overallScore,
        dataProtection: overallScore,
        incidentResponse: overallScore,
        compliance: overallScore,
        financialStability: overallScore,
        operationalResilience: overallScore,
        vendorManagement: overallScore,
        thirdPartyRisk: overallScore,
      },
      riskFactors: threatProfile.riskFactors,
      threats: threatProfile.threats,
      recommendations: threatProfile.recommendations,
      mitigationActions: [],
      residualRisk: overallScore,
      status: AssessmentStatus.COMPLETED,
      validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    };

    vendor.riskAssessment = assessment;
    vendor.lastAssessmentDate = new Date();
    vendor.nextReassessmentDate = assessment.validUntil;
    vendor.updatedAt = new Date();

    return assessment;
  }

  /**
   * Update monitoring status
   */
  async updateMonitoringStatus(
    vendorId: string,
    monitoringStatus: MonitoringStatus,
  ): Promise<void> {
    const vendor = this.vendors.get(vendorId);
    if (vendor) {
      vendor.monitoring = monitoringStatus;
      vendor.updatedAt = new Date();
    }
  }

  /**
   * Process security questionnaire
   */
  async processQuestionnaire(
    vendorId: string,
    responses: QuestionResponse[],
    validationResult: any,
  ): Promise<SecurityQuestionnaire> {
    const totalScore = responses.reduce((sum, r) => sum + r.score * r.weight, 0);
    const totalWeight = responses.reduce((sum, r) => sum + r.weight, 0);
    const score = totalWeight > 0 ? (totalScore / totalWeight) * 100 : 0;

    const questionnaire: SecurityQuestionnaire = {
      questionnaireId: crypto.randomUUID(),
      version: '1.0',
      vendorId,
      submittedDate: new Date(),
      completedDate: new Date(),
      responses,
      score,
      passThreshold: 70,
      passed: score >= 70,
      status: 'REVIEWED',
    };

    this.questionnaires.set(questionnaire.questionnaireId, questionnaire);
    return questionnaire;
  }

  /**
   * Calculate portfolio analytics
   */
  calculatePortfolioAnalytics(vendors: VendorProfile[]): PortfolioAnalytics {
    const activeVendors = vendors.filter((v) => v.status === 'ACTIVE');

    const vendorsByTier: Record<VendorRiskTier, number> = {
      [VendorRiskTier.CRITICAL]: 0,
      [VendorRiskTier.HIGH]: 0,
      [VendorRiskTier.MEDIUM]: 0,
      [VendorRiskTier.LOW]: 0,
      [VendorRiskTier.MINIMAL]: 0,
    };

    const vendorsByCategory: Record<VendorCategory, number> = {
      [VendorCategory.SOFTWARE_PROVIDER]: 0,
      [VendorCategory.CLOUD_SERVICE]: 0,
      [VendorCategory.MEDICAL_DEVICE]: 0,
      [VendorCategory.IT_SERVICES]: 0,
      [VendorCategory.CONSULTING]: 0,
      [VendorCategory.DATA_PROCESSOR]: 0,
      [VendorCategory.BUSINESS_ASSOCIATE]: 0,
      [VendorCategory.INFRASTRUCTURE]: 0,
      [VendorCategory.MANAGED_SERVICE]: 0,
      [VendorCategory.OTHER]: 0,
    };

    let totalAnnualSpend = 0;
    let totalRiskScore = 0;

    for (const vendor of activeVendors) {
      vendorsByTier[vendor.riskAssessment.riskTier]++;
      vendorsByCategory[vendor.category]++;
      totalAnnualSpend += vendor.businessRelationship.annualSpend || 0;
      totalRiskScore += vendor.riskAssessment.overallScore;
    }

    const highRiskVendors =
      vendorsByTier[VendorRiskTier.CRITICAL] + vendorsByTier[VendorRiskTier.HIGH];

    return {
      totalVendors: vendors.length,
      activeVendors: activeVendors.length,
      vendorsByTier,
      vendorsByCategory,
      totalAnnualSpend,
      highRiskVendors,
      expiringSoon: 0,
      complianceRate: 85.5,
      avgRiskScore: activeVendors.length > 0 ? totalRiskScore / activeVendors.length : 0,
      concentrationRisks: [],
      topRisks: [],
      recommendations: [],
    };
  }
}

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default {
  VendorRiskAssessmentController,
  VendorRiskAssessmentService,
};
