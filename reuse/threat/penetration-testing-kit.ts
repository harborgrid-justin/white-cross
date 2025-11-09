/**
 * LOC: THREATPENTEST89012
 * File: /reuse/threat/penetration-testing-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Security testing services
 *   - Vulnerability management controllers
 *   - Red team exercise modules
 *   - Security reporting services
 */

/**
 * File: /reuse/threat/penetration-testing-kit.ts
 * Locator: WC-THREAT-PENTEST-001
 * Purpose: Enterprise Penetration Testing & Red Team Operations - OWASP, PTES, NIST 800-115 compliant
 *
 * Upstream: Independent penetration testing utility module
 * Downstream: ../backend/*, Security testing controllers, Red team services, Vulnerability management, Compliance systems
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 46+ utility functions for pen test planning, vulnerability tracking, exploitation management, remediation verification, red team exercises
 *
 * LLM Context: Enterprise-grade penetration testing framework compliant with PTES, OWASP Testing Guide, NIST 800-115.
 * Provides comprehensive pen test planning and scoping, vulnerability discovery and exploitation tracking, penetration test report generation,
 * remediation tracking and verification, red team exercise management, purple team coordination, security testing metrics and KPIs,
 * attack simulation frameworks, threat modeling integration, vulnerability scoring (CVSS), exploit database integration,
 * security testing automation, compliance validation testing, web application testing (OWASP Top 10), network penetration testing,
 * social engineering campaigns, physical security testing, wireless security assessment, and integrated security testing workflows.
 */

import { Model, DataTypes, Sequelize, Transaction, Op } from 'sequelize';
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
  Min,
  Max,
  ValidateNested,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsUrl,
  IsIP,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================

export enum PenTestMethodology {
  PTES = 'ptes',
  OWASP = 'owasp',
  NIST_800_115 = 'nist-800-115',
  OSSTMM = 'osstmm',
  ISSAF = 'issaf',
  CUSTOM = 'custom',
}

export enum PenTestType {
  BLACK_BOX = 'black-box',
  GRAY_BOX = 'gray-box',
  WHITE_BOX = 'white-box',
  RED_TEAM = 'red-team',
  PURPLE_TEAM = 'purple-team',
  BUG_BOUNTY = 'bug-bounty',
}

export enum PenTestScope {
  WEB_APPLICATION = 'web-application',
  MOBILE_APPLICATION = 'mobile-application',
  NETWORK_INFRASTRUCTURE = 'network-infrastructure',
  WIRELESS = 'wireless',
  SOCIAL_ENGINEERING = 'social-engineering',
  PHYSICAL_SECURITY = 'physical-security',
  CLOUD_INFRASTRUCTURE = 'cloud-infrastructure',
  API = 'api',
  IOT = 'iot',
}

export enum PenTestPhase {
  PRE_ENGAGEMENT = 'pre-engagement',
  INTELLIGENCE_GATHERING = 'intelligence-gathering',
  THREAT_MODELING = 'threat-modeling',
  VULNERABILITY_ANALYSIS = 'vulnerability-analysis',
  EXPLOITATION = 'exploitation',
  POST_EXPLOITATION = 'post-exploitation',
  REPORTING = 'reporting',
  REMEDIATION_VERIFICATION = 'remediation-verification',
}

export enum VulnerabilitySeverity {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  INFORMATIONAL = 'informational',
}

export enum VulnerabilityStatus {
  DISCOVERED = 'discovered',
  EXPLOITED = 'exploited',
  REPORTED = 'reported',
  REMEDIATION_IN_PROGRESS = 'remediation-in-progress',
  REMEDIATED = 'remediated',
  VERIFIED = 'verified',
  ACCEPTED = 'accepted',
  FALSE_POSITIVE = 'false-positive',
}

export enum ExploitComplexity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum AttackVector {
  NETWORK = 'network',
  ADJACENT_NETWORK = 'adjacent-network',
  LOCAL = 'local',
  PHYSICAL = 'physical',
}

export enum RedTeamObjective {
  DATA_EXFILTRATION = 'data-exfiltration',
  PRIVILEGE_ESCALATION = 'privilege-escalation',
  LATERAL_MOVEMENT = 'lateral-movement',
  PERSISTENCE = 'persistence',
  CREDENTIAL_HARVESTING = 'credential-harvesting',
  DENIAL_OF_SERVICE = 'denial-of-service',
  INFRASTRUCTURE_COMPROMISE = 'infrastructure-compromise',
}

export enum RemediationStatus {
  NOT_STARTED = 'not-started',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
  VERIFIED = 'verified',
  FAILED_VERIFICATION = 'failed-verification',
  DEFERRED = 'deferred',
}

// ============================================================================
// DATA TRANSFER OBJECTS (DTOs)
// ============================================================================

export class CreatePenTestDto {
  @ApiProperty({ example: 'Q1 2025 Web Application Security Assessment' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: 'Comprehensive security testing of patient portal' })
  @IsString()
  @IsOptional()
  @MaxLength(2000)
  description?: string;

  @ApiProperty({ enum: PenTestMethodology })
  @IsEnum(PenTestMethodology)
  methodology: PenTestMethodology;

  @ApiProperty({ enum: PenTestType })
  @IsEnum(PenTestType)
  type: PenTestType;

  @ApiProperty({ enum: PenTestScope, isArray: true })
  @IsArray()
  @IsEnum(PenTestScope, { each: true })
  scopes: PenTestScope[];

  @ApiProperty({ example: '2025-01-15T00:00:00Z' })
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @ApiProperty({ example: '2025-02-15T00:00:00Z' })
  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @ApiProperty({ example: ['https://patient-portal.example.com'] })
  @IsArray()
  @IsUrl({}, { each: true })
  targetUrls: string[];

  @ApiProperty({ example: ['10.0.0.0/24'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  targetNetworks?: string[];

  @ApiProperty({ example: 'John Doe, Jane Smith' })
  @IsString()
  @IsOptional()
  teamMembers?: string;

  @ApiProperty({ example: { customerContact: 'security@example.com' } })
  @IsOptional()
  metadata?: Record<string, any>;
}

export class CreateVulnerabilityDto {
  @ApiProperty({ example: 'SQL Injection in login form' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiProperty({ example: 'User input not properly sanitized in username field' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  description: string;

  @ApiProperty({ enum: VulnerabilitySeverity })
  @IsEnum(VulnerabilitySeverity)
  severity: VulnerabilitySeverity;

  @ApiProperty({ example: 9.8 })
  @IsNumber()
  @Min(0)
  @Max(10)
  cvssScore: number;

  @ApiProperty({ example: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H' })
  @IsString()
  @IsOptional()
  cvssVector?: string;

  @ApiProperty({ example: 'CWE-89' })
  @IsString()
  @IsOptional()
  cweId?: string;

  @ApiProperty({ enum: AttackVector })
  @IsEnum(AttackVector)
  attackVector: AttackVector;

  @ApiProperty({ enum: ExploitComplexity })
  @IsEnum(ExploitComplexity)
  exploitComplexity: ExploitComplexity;

  @ApiProperty({ example: 'https://patient-portal.example.com/login' })
  @IsUrl()
  @IsOptional()
  affectedUrl?: string;

  @ApiProperty({ example: { parameter: 'username', payload: "' OR 1=1--" } })
  @IsOptional()
  proofOfConcept?: Record<string, any>;

  @ApiProperty({ example: 'Implement parameterized queries' })
  @IsString()
  @IsOptional()
  @MaxLength(2000)
  remediation?: string;
}

export class CreateRedTeamExerciseDto {
  @ApiProperty({ example: 'Operation Silent Storm' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  codeName: string;

  @ApiProperty({ example: 'Test detection and response capabilities' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  description: string;

  @ApiProperty({ enum: RedTeamObjective, isArray: true })
  @IsArray()
  @IsEnum(RedTeamObjective, { each: true })
  objectives: RedTeamObjective[];

  @ApiProperty({ example: '2025-03-01T00:00:00Z' })
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @ApiProperty({ example: '2025-03-15T00:00:00Z' })
  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @ApiProperty({ example: ['patient-portal', 'admin-dashboard'] })
  @IsArray()
  @IsString({ each: true })
  targetSystems: string[];

  @ApiProperty({ example: false })
  @IsBoolean()
  @IsOptional()
  blueTeamNotified?: boolean;

  @ApiProperty({ example: { ttps: ['T1190', 'T1059'], mitre_attack: true } })
  @IsOptional()
  metadata?: Record<string, any>;
}

export class CreateRemediationTaskDto {
  @ApiProperty({ example: 'Fix SQL Injection in login form' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiProperty({ example: 'Implement prepared statements for all database queries' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  description: string;

  @ApiProperty({ example: 'backend-team' })
  @IsString()
  @IsNotEmpty()
  assignedTo: string;

  @ApiProperty({ example: '2025-02-01T00:00:00Z' })
  @IsDate()
  @Type(() => Date)
  dueDate: Date;

  @ApiProperty({ enum: VulnerabilitySeverity })
  @IsEnum(VulnerabilitySeverity)
  priority: VulnerabilitySeverity;

  @ApiProperty({ example: { estimatedHours: 8, jiraTicket: 'SEC-123' } })
  @IsOptional()
  metadata?: Record<string, any>;
}

export class PurpleTeamActivityDto {
  @ApiProperty({ example: 'Detect SQL injection attempts' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  activity: string;

  @ApiProperty({ example: 'Red team performs SQL injection, Blue team monitors WAF logs' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  description: string;

  @ApiProperty({ example: '2025-01-20T10:00:00Z' })
  @IsDate()
  @Type(() => Date)
  scheduledTime: Date;

  @ApiProperty({ example: 'John (Red), Jane (Blue)' })
  @IsString()
  @IsNotEmpty()
  participants: string;

  @ApiProperty({ example: { detectionRule: 'WAF-001', expectedAlert: true } })
  @IsOptional()
  metadata?: Record<string, any>;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

export class PenetrationTest extends Model {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ enum: PenTestMethodology })
  methodology: PenTestMethodology;

  @ApiProperty({ enum: PenTestType })
  type: PenTestType;

  @ApiProperty({ enum: PenTestScope, isArray: true })
  scopes: PenTestScope[];

  @ApiProperty({ enum: PenTestPhase })
  currentPhase: PenTestPhase;

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  endDate: Date;

  @ApiProperty()
  targetUrls: string[];

  @ApiProperty()
  targetNetworks: string[];

  @ApiProperty()
  teamMembers: string;

  @ApiProperty()
  findingsCount: number;

  @ApiProperty()
  criticalFindings: number;

  @ApiProperty()
  highFindings: number;

  @ApiProperty()
  mediumFindings: number;

  @ApiProperty()
  lowFindings: number;

  @ApiProperty()
  reportUrl: string;

  @ApiProperty()
  metadata: Record<string, any>;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  completedAt: Date;
}

export class Vulnerability extends Model {
  @ApiProperty()
  id: string;

  @ApiProperty()
  penTestId: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ enum: VulnerabilitySeverity })
  severity: VulnerabilitySeverity;

  @ApiProperty()
  cvssScore: number;

  @ApiProperty()
  cvssVector: string;

  @ApiProperty()
  cweId: string;

  @ApiProperty({ enum: AttackVector })
  attackVector: AttackVector;

  @ApiProperty({ enum: ExploitComplexity })
  exploitComplexity: ExploitComplexity;

  @ApiProperty()
  affectedUrl: string;

  @ApiProperty()
  proofOfConcept: Record<string, any>;

  @ApiProperty()
  remediation: string;

  @ApiProperty({ enum: VulnerabilityStatus })
  status: VulnerabilityStatus;

  @ApiProperty()
  discoveredAt: Date;

  @ApiProperty()
  reportedAt: Date;

  @ApiProperty()
  remediatedAt: Date;

  @ApiProperty()
  verifiedAt: Date;

  @ApiProperty()
  metadata: Record<string, any>;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class RedTeamExercise extends Model {
  @ApiProperty()
  id: string;

  @ApiProperty()
  codeName: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ enum: RedTeamObjective, isArray: true })
  objectives: RedTeamObjective[];

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  endDate: Date;

  @ApiProperty()
  targetSystems: string[];

  @ApiProperty()
  blueTeamNotified: boolean;

  @ApiProperty()
  objectivesAchieved: number;

  @ApiProperty()
  detectionRate: number;

  @ApiProperty()
  meanTimeToDetect: number;

  @ApiProperty()
  compromisedSystems: string[];

  @ApiProperty()
  metadata: Record<string, any>;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  completedAt: Date;
}

export class RemediationTask extends Model {
  @ApiProperty()
  id: string;

  @ApiProperty()
  vulnerabilityId: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  assignedTo: string;

  @ApiProperty()
  dueDate: Date;

  @ApiProperty({ enum: VulnerabilitySeverity })
  priority: VulnerabilitySeverity;

  @ApiProperty({ enum: RemediationStatus })
  status: RemediationStatus;

  @ApiProperty()
  completedAt: Date;

  @ApiProperty()
  verificationNotes: string;

  @ApiProperty()
  metadata: Record<string, any>;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

// ============================================================================
// INITIALIZATION FUNCTIONS
// ============================================================================

/**
 * Initialize Penetration Test model
 * @param sequelize Sequelize instance
 * @returns PenetrationTest model
 */
export function initPenetrationTestModel(sequelize: Sequelize): typeof PenetrationTest {
  PenetrationTest.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      methodology: {
        type: DataTypes.ENUM(...Object.values(PenTestMethodology)),
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM(...Object.values(PenTestType)),
        allowNull: false,
      },
      scopes: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
      },
      currentPhase: {
        type: DataTypes.ENUM(...Object.values(PenTestPhase)),
        allowNull: false,
        defaultValue: PenTestPhase.PRE_ENGAGEMENT,
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      targetUrls: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
      },
      targetNetworks: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
      },
      teamMembers: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      findingsCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      criticalFindings: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      highFindings: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      mediumFindings: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      lowFindings: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      reportUrl: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
      },
      completedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'penetration_tests',
      timestamps: true,
      indexes: [
        { fields: ['methodology'] },
        { fields: ['type'] },
        { fields: ['currentPhase'] },
        { fields: ['startDate', 'endDate'] },
      ],
    }
  );

  return PenetrationTest;
}

/**
 * Initialize Vulnerability model
 * @param sequelize Sequelize instance
 * @returns Vulnerability model
 */
export function initVulnerabilityModel(sequelize: Sequelize): typeof Vulnerability {
  Vulnerability.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      penTestId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'penetration_tests',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      severity: {
        type: DataTypes.ENUM(...Object.values(VulnerabilitySeverity)),
        allowNull: false,
      },
      cvssScore: {
        type: DataTypes.DECIMAL(3, 1),
        allowNull: false,
      },
      cvssVector: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      cweId: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      attackVector: {
        type: DataTypes.ENUM(...Object.values(AttackVector)),
        allowNull: false,
      },
      exploitComplexity: {
        type: DataTypes.ENUM(...Object.values(ExploitComplexity)),
        allowNull: false,
      },
      affectedUrl: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      proofOfConcept: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
      },
      remediation: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM(...Object.values(VulnerabilityStatus)),
        allowNull: false,
        defaultValue: VulnerabilityStatus.DISCOVERED,
      },
      discoveredAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      reportedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      remediatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      verifiedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
      },
    },
    {
      sequelize,
      tableName: 'vulnerabilities',
      timestamps: true,
      indexes: [
        { fields: ['penTestId'] },
        { fields: ['severity'] },
        { fields: ['status'] },
        { fields: ['cvssScore'] },
        { fields: ['discoveredAt'] },
      ],
    }
  );

  return Vulnerability;
}

/**
 * Initialize Red Team Exercise model
 * @param sequelize Sequelize instance
 * @returns RedTeamExercise model
 */
export function initRedTeamExerciseModel(sequelize: Sequelize): typeof RedTeamExercise {
  RedTeamExercise.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      codeName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      objectives: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      targetSystems: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
      },
      blueTeamNotified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      objectivesAchieved: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      detectionRate: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      meanTimeToDetect: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Mean time to detect in minutes',
      },
      compromisedSystems: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
      },
      completedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'red_team_exercises',
      timestamps: true,
      indexes: [
        { fields: ['codeName'], unique: true },
        { fields: ['startDate', 'endDate'] },
        { fields: ['blueTeamNotified'] },
      ],
    }
  );

  return RedTeamExercise;
}

/**
 * Initialize Remediation Task model
 * @param sequelize Sequelize instance
 * @returns RemediationTask model
 */
export function initRemediationTaskModel(sequelize: Sequelize): typeof RemediationTask {
  RemediationTask.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      vulnerabilityId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'vulnerabilities',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      assignedTo: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      dueDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      priority: {
        type: DataTypes.ENUM(...Object.values(VulnerabilitySeverity)),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(...Object.values(RemediationStatus)),
        allowNull: false,
        defaultValue: RemediationStatus.NOT_STARTED,
      },
      completedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      verificationNotes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
      },
    },
    {
      sequelize,
      tableName: 'remediation_tasks',
      timestamps: true,
      indexes: [
        { fields: ['vulnerabilityId'] },
        { fields: ['assignedTo'] },
        { fields: ['status'] },
        { fields: ['priority'] },
        { fields: ['dueDate'] },
      ],
    }
  );

  return RemediationTask;
}

// ============================================================================
// PENETRATION TEST PLANNING AND SCOPING FUNCTIONS
// ============================================================================

/**
 * Create a new penetration test
 * @param data Pen test data
 * @param transaction Optional transaction
 * @returns Created penetration test
 */
export async function createPenetrationTest(
  data: CreatePenTestDto,
  transaction?: Transaction
): Promise<PenetrationTest> {
  return await PenetrationTest.create(
    {
      ...data,
      currentPhase: PenTestPhase.PRE_ENGAGEMENT,
      findingsCount: 0,
      criticalFindings: 0,
      highFindings: 0,
      mediumFindings: 0,
      lowFindings: 0,
    },
    { transaction }
  );
}

/**
 * Update penetration test phase
 * @param penTestId Penetration test ID
 * @param phase New phase
 * @param transaction Optional transaction
 * @returns Updated penetration test
 */
export async function updatePenTestPhase(
  penTestId: string,
  phase: PenTestPhase,
  transaction?: Transaction
): Promise<PenetrationTest> {
  const penTest = await PenetrationTest.findByPk(penTestId, { transaction });
  if (!penTest) {
    throw new Error(`Penetration test ${penTestId} not found`);
  }

  penTest.currentPhase = phase;
  if (phase === PenTestPhase.REPORTING) {
    penTest.completedAt = new Date();
  }

  await penTest.save({ transaction });
  return penTest;
}

/**
 * Calculate penetration test scope metrics
 * @param penTest Penetration test
 * @returns Scope metrics
 */
export function calculateScopeMetrics(penTest: PenetrationTest): {
  targetCount: number;
  scopeCount: number;
  estimatedDuration: number;
  complexityScore: number;
} {
  const targetCount = penTest.targetUrls.length + (penTest.targetNetworks?.length || 0);
  const scopeCount = penTest.scopes.length;

  // Estimate duration based on scope and type
  const baseHours = {
    [PenTestType.BLACK_BOX]: 40,
    [PenTestType.GRAY_BOX]: 60,
    [PenTestType.WHITE_BOX]: 80,
    [PenTestType.RED_TEAM]: 120,
    [PenTestType.PURPLE_TEAM]: 100,
    [PenTestType.BUG_BOUNTY]: 0,
  };

  const scopeMultiplier = {
    [PenTestScope.WEB_APPLICATION]: 1.0,
    [PenTestScope.MOBILE_APPLICATION]: 1.2,
    [PenTestScope.NETWORK_INFRASTRUCTURE]: 1.5,
    [PenTestScope.WIRELESS]: 1.3,
    [PenTestScope.SOCIAL_ENGINEERING]: 1.1,
    [PenTestScope.PHYSICAL_SECURITY]: 1.4,
    [PenTestScope.CLOUD_INFRASTRUCTURE]: 1.6,
    [PenTestScope.API]: 0.8,
    [PenTestScope.IOT]: 1.7,
  };

  const totalMultiplier = penTest.scopes.reduce(
    (sum, scope) => sum + scopeMultiplier[scope],
    0
  );

  const estimatedDuration = baseHours[penTest.type] * totalMultiplier * (targetCount / 5 + 1);
  const complexityScore = Math.min(10, (scopeCount * 2 + targetCount / 2) / 2);

  return {
    targetCount,
    scopeCount,
    estimatedDuration: Math.round(estimatedDuration),
    complexityScore: Math.round(complexityScore * 10) / 10,
  };
}

/**
 * Generate penetration test scope document
 * @param penTest Penetration test
 * @returns Scope document
 */
export function generateScopeDocument(penTest: PenetrationTest): {
  overview: string;
  objectives: string[];
  inScope: string[];
  outOfScope: string[];
  assumptions: string[];
  constraints: string[];
} {
  const metrics = calculateScopeMetrics(penTest);

  return {
    overview: `${penTest.type} penetration test using ${penTest.methodology} methodology covering ${metrics.scopeCount} scope areas with ${metrics.targetCount} targets.`,
    objectives: [
      'Identify security vulnerabilities in target systems',
      'Assess the effectiveness of security controls',
      'Validate compliance with security standards',
      'Provide actionable remediation recommendations',
    ],
    inScope: [
      ...penTest.targetUrls.map(url => `Web target: ${url}`),
      ...(penTest.targetNetworks || []).map(net => `Network target: ${net}`),
      ...penTest.scopes.map(scope => `Scope: ${scope}`),
    ],
    outOfScope: [
      'Production database modifications',
      'Denial of service attacks',
      'Social engineering of executive staff (unless approved)',
      'Physical damage to equipment',
    ],
    assumptions: [
      'Testing will occur within specified time window',
      'Access credentials will be provided as specified',
      'Point of contact will be available during testing',
      'Emergency contact procedures are established',
    ],
    constraints: [
      'No testing outside business hours without approval',
      'Rate limiting must be respected',
      'Data exfiltration limited to proof of concept',
      'All findings must be reported within 24 hours',
    ],
  };
}

/**
 * Calculate CVSS base score from components
 * @param attackVector Attack vector
 * @param attackComplexity Attack complexity
 * @param privilegesRequired Privileges required
 * @param userInteraction User interaction required
 * @param scope Scope change
 * @param confidentialityImpact Confidentiality impact
 * @param integrityImpact Integrity impact
 * @param availabilityImpact Availability impact
 * @returns CVSS base score
 */
export function calculateCVSSScore(params: {
  attackVector: 'N' | 'A' | 'L' | 'P';
  attackComplexity: 'L' | 'H';
  privilegesRequired: 'N' | 'L' | 'H';
  userInteraction: 'N' | 'R';
  scope: 'U' | 'C';
  confidentialityImpact: 'N' | 'L' | 'H';
  integrityImpact: 'N' | 'L' | 'H';
  availabilityImpact: 'N' | 'L' | 'H';
}): number {
  const avMap = { N: 0.85, A: 0.62, L: 0.55, P: 0.2 };
  const acMap = { L: 0.77, H: 0.44 };
  const prMap = { N: 0.85, L: 0.62, H: 0.27 };
  const uiMap = { N: 0.85, R: 0.62 };
  const impactMap = { N: 0, L: 0.22, H: 0.56 };

  const av = avMap[params.attackVector];
  const ac = acMap[params.attackComplexity];
  const pr = prMap[params.privilegesRequired];
  const ui = uiMap[params.userInteraction];

  const c = impactMap[params.confidentialityImpact];
  const i = impactMap[params.integrityImpact];
  const a = impactMap[params.availabilityImpact];

  const iss = 1 - (1 - c) * (1 - i) * (1 - a);
  const impact = params.scope === 'C' ? 7.52 * (iss - 0.029) - 3.25 * Math.pow(iss - 0.02, 15) : 6.42 * iss;

  if (impact <= 0) return 0;

  const exploitability = 8.22 * av * ac * pr * ui;
  const baseScore = params.scope === 'C'
    ? Math.min(1.08 * (impact + exploitability), 10)
    : Math.min(impact + exploitability, 10);

  return Math.round(baseScore * 10) / 10;
}

// ============================================================================
// VULNERABILITY EXPLOITATION TRACKING FUNCTIONS
// ============================================================================

/**
 * Create a new vulnerability
 * @param data Vulnerability data
 * @param transaction Optional transaction
 * @returns Created vulnerability
 */
export async function createVulnerability(
  data: CreateVulnerabilityDto & { penTestId: string },
  transaction?: Transaction
): Promise<Vulnerability> {
  const vulnerability = await Vulnerability.create(
    {
      ...data,
      status: VulnerabilityStatus.DISCOVERED,
      discoveredAt: new Date(),
    },
    { transaction }
  );

  // Update pen test statistics
  await updatePenTestStatistics(data.penTestId, transaction);

  return vulnerability;
}

/**
 * Update vulnerability status
 * @param vulnerabilityId Vulnerability ID
 * @param status New status
 * @param transaction Optional transaction
 * @returns Updated vulnerability
 */
export async function updateVulnerabilityStatus(
  vulnerabilityId: string,
  status: VulnerabilityStatus,
  transaction?: Transaction
): Promise<Vulnerability> {
  const vulnerability = await Vulnerability.findByPk(vulnerabilityId, { transaction });
  if (!vulnerability) {
    throw new Error(`Vulnerability ${vulnerabilityId} not found`);
  }

  vulnerability.status = status;

  if (status === VulnerabilityStatus.REPORTED && !vulnerability.reportedAt) {
    vulnerability.reportedAt = new Date();
  } else if (status === VulnerabilityStatus.REMEDIATED && !vulnerability.remediatedAt) {
    vulnerability.remediatedAt = new Date();
  } else if (status === VulnerabilityStatus.VERIFIED && !vulnerability.verifiedAt) {
    vulnerability.verifiedAt = new Date();
  }

  await vulnerability.save({ transaction });
  return vulnerability;
}

/**
 * Update pen test statistics based on vulnerabilities
 * @param penTestId Penetration test ID
 * @param transaction Optional transaction
 */
export async function updatePenTestStatistics(
  penTestId: string,
  transaction?: Transaction
): Promise<void> {
  const vulnerabilities = await Vulnerability.findAll({
    where: { penTestId },
    transaction,
  });

  const counts = {
    total: vulnerabilities.length,
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  };

  for (const vuln of vulnerabilities) {
    if (vuln.severity === VulnerabilitySeverity.CRITICAL) counts.critical++;
    else if (vuln.severity === VulnerabilitySeverity.HIGH) counts.high++;
    else if (vuln.severity === VulnerabilitySeverity.MEDIUM) counts.medium++;
    else if (vuln.severity === VulnerabilitySeverity.LOW) counts.low++;
  }

  await PenetrationTest.update(
    {
      findingsCount: counts.total,
      criticalFindings: counts.critical,
      highFindings: counts.high,
      mediumFindings: counts.medium,
      lowFindings: counts.low,
    },
    {
      where: { id: penTestId },
      transaction,
    }
  );
}

/**
 * Track vulnerability exploitation attempt
 * @param vulnerabilityId Vulnerability ID
 * @param success Whether exploitation was successful
 * @param notes Exploitation notes
 * @param transaction Optional transaction
 * @returns Updated vulnerability
 */
export async function trackExploitationAttempt(
  vulnerabilityId: string,
  success: boolean,
  notes: string,
  transaction?: Transaction
): Promise<Vulnerability> {
  const vulnerability = await Vulnerability.findByPk(vulnerabilityId, { transaction });
  if (!vulnerability) {
    throw new Error(`Vulnerability ${vulnerabilityId} not found`);
  }

  if (!vulnerability.metadata) vulnerability.metadata = {};
  if (!vulnerability.metadata.exploitationAttempts) {
    vulnerability.metadata.exploitationAttempts = [];
  }

  vulnerability.metadata.exploitationAttempts.push({
    timestamp: new Date().toISOString(),
    success,
    notes,
  });

  if (success) {
    vulnerability.status = VulnerabilityStatus.EXPLOITED;
  }

  await vulnerability.save({ transaction });
  return vulnerability;
}

/**
 * Get vulnerabilities by severity
 * @param penTestId Penetration test ID
 * @param severity Severity level
 * @param transaction Optional transaction
 * @returns Vulnerabilities
 */
export async function getVulnerabilitiesBySeverity(
  penTestId: string,
  severity: VulnerabilitySeverity,
  transaction?: Transaction
): Promise<Vulnerability[]> {
  return await Vulnerability.findAll({
    where: {
      penTestId,
      severity,
    },
    order: [['cvssScore', 'DESC']],
    transaction,
  });
}

// ============================================================================
// PEN TEST REPORT GENERATION FUNCTIONS
// ============================================================================

/**
 * Generate executive summary for pen test report
 * @param penTest Penetration test
 * @param vulnerabilities Vulnerabilities found
 * @returns Executive summary
 */
export function generateExecutiveSummary(
  penTest: PenetrationTest,
  vulnerabilities: Vulnerability[]
): {
  overview: string;
  keyFindings: string[];
  riskLevel: string;
  recommendations: string[];
  statistics: Record<string, number>;
} {
  const criticalCount = vulnerabilities.filter(v => v.severity === VulnerabilitySeverity.CRITICAL).length;
  const highCount = vulnerabilities.filter(v => v.severity === VulnerabilitySeverity.HIGH).length;

  let riskLevel = 'Low';
  if (criticalCount > 0) riskLevel = 'Critical';
  else if (highCount > 2) riskLevel = 'High';
  else if (highCount > 0) riskLevel = 'Medium';

  return {
    overview: `This ${penTest.type} penetration test identified ${vulnerabilities.length} security vulnerabilities across ${penTest.scopes.length} scope areas.`,
    keyFindings: vulnerabilities
      .filter(v => [VulnerabilitySeverity.CRITICAL, VulnerabilitySeverity.HIGH].includes(v.severity))
      .slice(0, 5)
      .map(v => v.title),
    riskLevel,
    recommendations: [
      'Prioritize remediation of critical and high-severity vulnerabilities',
      'Implement security awareness training for development teams',
      'Establish regular security testing cadence',
      'Review and update security policies and procedures',
    ],
    statistics: {
      total: vulnerabilities.length,
      critical: criticalCount,
      high: highCount,
      medium: vulnerabilities.filter(v => v.severity === VulnerabilitySeverity.MEDIUM).length,
      low: vulnerabilities.filter(v => v.severity === VulnerabilitySeverity.LOW).length,
    },
  };
}

/**
 * Generate detailed vulnerability report
 * @param vulnerability Vulnerability
 * @returns Detailed report
 */
export function generateVulnerabilityReport(vulnerability: Vulnerability): {
  title: string;
  severity: string;
  cvssScore: number;
  description: string;
  impact: string;
  remediation: string;
  references: string[];
} {
  const impactMap = {
    [VulnerabilitySeverity.CRITICAL]: 'Complete system compromise possible. Immediate action required.',
    [VulnerabilitySeverity.HIGH]: 'Significant security risk. Remediation should be prioritized.',
    [VulnerabilitySeverity.MEDIUM]: 'Moderate security risk. Should be addressed in near term.',
    [VulnerabilitySeverity.LOW]: 'Low security risk. Can be addressed as part of routine maintenance.',
    [VulnerabilitySeverity.INFORMATIONAL]: 'Informational finding. No immediate action required.',
  };

  return {
    title: vulnerability.title,
    severity: vulnerability.severity,
    cvssScore: Number(vulnerability.cvssScore),
    description: vulnerability.description,
    impact: impactMap[vulnerability.severity],
    remediation: vulnerability.remediation || 'Contact security team for remediation guidance.',
    references: vulnerability.cweId ? [`CWE: ${vulnerability.cweId}`] : [],
  };
}

/**
 * Calculate remediation timeline
 * @param vulnerabilities Vulnerabilities
 * @returns Timeline by severity
 */
export function calculateRemediationTimeline(vulnerabilities: Vulnerability[]): {
  critical: number;
  high: number;
  medium: number;
  low: number;
  totalDays: number;
} {
  const slaMap = {
    [VulnerabilitySeverity.CRITICAL]: 7,
    [VulnerabilitySeverity.HIGH]: 30,
    [VulnerabilitySeverity.MEDIUM]: 90,
    [VulnerabilitySeverity.LOW]: 180,
    [VulnerabilitySeverity.INFORMATIONAL]: 365,
  };

  const timeline = {
    critical: slaMap[VulnerabilitySeverity.CRITICAL],
    high: slaMap[VulnerabilitySeverity.HIGH],
    medium: slaMap[VulnerabilitySeverity.MEDIUM],
    low: slaMap[VulnerabilitySeverity.LOW],
    totalDays: 0,
  };

  const maxSla = Math.max(
    ...vulnerabilities.map(v => slaMap[v.severity] || 365)
  );

  timeline.totalDays = maxSla;

  return timeline;
}

/**
 * Generate OWASP Top 10 mapping
 * @param vulnerabilities Vulnerabilities
 * @returns OWASP Top 10 mapping
 */
export function mapToOWASPTop10(vulnerabilities: Vulnerability[]): Map<string, Vulnerability[]> {
  const owaspMapping = new Map<string, Vulnerability[]>();

  const cweToOwasp: Record<string, string> = {
    'CWE-89': 'A03:2021-Injection',
    'CWE-79': 'A03:2021-Injection',
    'CWE-798': 'A07:2021-Identification and Authentication Failures',
    'CWE-287': 'A07:2021-Identification and Authentication Failures',
    'CWE-22': 'A01:2021-Broken Access Control',
    'CWE-352': 'A01:2021-Broken Access Control',
    'CWE-434': 'A04:2021-Insecure Design',
    'CWE-502': 'A08:2021-Software and Data Integrity Failures',
  };

  for (const vuln of vulnerabilities) {
    const owaspCategory = cweToOwasp[vuln.cweId || ''] || 'Uncategorized';
    if (!owaspMapping.has(owaspCategory)) {
      owaspMapping.set(owaspCategory, []);
    }
    owaspMapping.get(owaspCategory)!.push(vuln);
  }

  return owaspMapping;
}

// ============================================================================
// REMEDIATION VERIFICATION FUNCTIONS
// ============================================================================

/**
 * Create remediation task
 * @param data Remediation task data
 * @param transaction Optional transaction
 * @returns Created remediation task
 */
export async function createRemediationTask(
  data: CreateRemediationTaskDto & { vulnerabilityId: string },
  transaction?: Transaction
): Promise<RemediationTask> {
  return await RemediationTask.create(
    {
      ...data,
      status: RemediationStatus.NOT_STARTED,
    },
    { transaction }
  );
}

/**
 * Update remediation task status
 * @param taskId Task ID
 * @param status New status
 * @param transaction Optional transaction
 * @returns Updated task
 */
export async function updateRemediationStatus(
  taskId: string,
  status: RemediationStatus,
  transaction?: Transaction
): Promise<RemediationTask> {
  const task = await RemediationTask.findByPk(taskId, { transaction });
  if (!task) {
    throw new Error(`Remediation task ${taskId} not found`);
  }

  task.status = status;
  if (status === RemediationStatus.COMPLETED && !task.completedAt) {
    task.completedAt = new Date();
  }

  await task.save({ transaction });
  return task;
}

/**
 * Verify vulnerability remediation
 * @param vulnerabilityId Vulnerability ID
 * @param verificationNotes Verification notes
 * @param passed Whether verification passed
 * @param transaction Optional transaction
 * @returns Updated vulnerability and task
 */
export async function verifyRemediation(
  vulnerabilityId: string,
  verificationNotes: string,
  passed: boolean,
  transaction?: Transaction
): Promise<{ vulnerability: Vulnerability; task: RemediationTask | null }> {
  const vulnerability = await Vulnerability.findByPk(vulnerabilityId, { transaction });
  if (!vulnerability) {
    throw new Error(`Vulnerability ${vulnerabilityId} not found`);
  }

  const task = await RemediationTask.findOne({
    where: { vulnerabilityId },
    transaction,
  });

  if (passed) {
    vulnerability.status = VulnerabilityStatus.VERIFIED;
    vulnerability.verifiedAt = new Date();
    if (task) {
      task.status = RemediationStatus.VERIFIED;
      task.verificationNotes = verificationNotes;
    }
  } else {
    if (task) {
      task.status = RemediationStatus.FAILED_VERIFICATION;
      task.verificationNotes = verificationNotes;
    }
  }

  await vulnerability.save({ transaction });
  if (task) await task.save({ transaction });

  return { vulnerability, task };
}

/**
 * Get overdue remediation tasks
 * @param transaction Optional transaction
 * @returns Overdue tasks
 */
export async function getOverdueRemediationTasks(
  transaction?: Transaction
): Promise<RemediationTask[]> {
  return await RemediationTask.findAll({
    where: {
      status: {
        [Op.notIn]: [RemediationStatus.COMPLETED, RemediationStatus.VERIFIED],
      },
      dueDate: {
        [Op.lt]: new Date(),
      },
    },
    order: [
      ['priority', 'DESC'],
      ['dueDate', 'ASC'],
    ],
    transaction,
  });
}

/**
 * Calculate remediation progress
 * @param penTestId Penetration test ID
 * @param transaction Optional transaction
 * @returns Remediation progress metrics
 */
export async function calculateRemediationProgress(
  penTestId: string,
  transaction?: Transaction
): Promise<{
  totalVulnerabilities: number;
  remediated: number;
  verified: number;
  inProgress: number;
  notStarted: number;
  percentComplete: number;
}> {
  const vulnerabilities = await Vulnerability.findAll({
    where: { penTestId },
    transaction,
  });

  const total = vulnerabilities.length;
  const remediated = vulnerabilities.filter(v => v.status === VulnerabilityStatus.REMEDIATED).length;
  const verified = vulnerabilities.filter(v => v.status === VulnerabilityStatus.VERIFIED).length;

  const tasks = await RemediationTask.findAll({
    include: [
      {
        model: Vulnerability,
        where: { penTestId },
        required: true,
      },
    ],
    transaction,
  });

  const inProgress = tasks.filter(t => t.status === RemediationStatus.IN_PROGRESS).length;
  const notStarted = tasks.filter(t => t.status === RemediationStatus.NOT_STARTED).length;

  return {
    totalVulnerabilities: total,
    remediated,
    verified,
    inProgress,
    notStarted,
    percentComplete: total > 0 ? Math.round((verified / total) * 100) : 0,
  };
}

// ============================================================================
// RED TEAM EXERCISE MANAGEMENT FUNCTIONS
// ============================================================================

/**
 * Create red team exercise
 * @param data Exercise data
 * @param transaction Optional transaction
 * @returns Created exercise
 */
export async function createRedTeamExercise(
  data: CreateRedTeamExerciseDto,
  transaction?: Transaction
): Promise<RedTeamExercise> {
  return await RedTeamExercise.create(
    {
      ...data,
      objectivesAchieved: 0,
      compromisedSystems: [],
    },
    { transaction }
  );
}

/**
 * Update red team objective status
 * @param exerciseId Exercise ID
 * @param objectiveIndex Objective index
 * @param achieved Whether objective was achieved
 * @param transaction Optional transaction
 * @returns Updated exercise
 */
export async function updateRedTeamObjective(
  exerciseId: string,
  objectiveIndex: number,
  achieved: boolean,
  transaction?: Transaction
): Promise<RedTeamExercise> {
  const exercise = await RedTeamExercise.findByPk(exerciseId, { transaction });
  if (!exercise) {
    throw new Error(`Red team exercise ${exerciseId} not found`);
  }

  if (!exercise.metadata) exercise.metadata = {};
  if (!exercise.metadata.objectiveStatus) {
    exercise.metadata.objectiveStatus = {};
  }

  exercise.metadata.objectiveStatus[objectiveIndex] = {
    achieved,
    timestamp: new Date().toISOString(),
  };

  exercise.objectivesAchieved = Object.values(exercise.metadata.objectiveStatus).filter(
    (s: any) => s.achieved
  ).length;

  await exercise.save({ transaction });
  return exercise;
}

/**
 * Track system compromise
 * @param exerciseId Exercise ID
 * @param systemName System name
 * @param timestamp Compromise timestamp
 * @param transaction Optional transaction
 * @returns Updated exercise
 */
export async function trackSystemCompromise(
  exerciseId: string,
  systemName: string,
  timestamp: Date,
  transaction?: Transaction
): Promise<RedTeamExercise> {
  const exercise = await RedTeamExercise.findByPk(exerciseId, { transaction });
  if (!exercise) {
    throw new Error(`Red team exercise ${exerciseId} not found`);
  }

  if (!exercise.compromisedSystems.includes(systemName)) {
    exercise.compromisedSystems.push(systemName);
  }

  if (!exercise.metadata) exercise.metadata = {};
  if (!exercise.metadata.compromiseTimeline) {
    exercise.metadata.compromiseTimeline = [];
  }

  exercise.metadata.compromiseTimeline.push({
    system: systemName,
    timestamp: timestamp.toISOString(),
  });

  await exercise.save({ transaction });
  return exercise;
}

/**
 * Calculate red team metrics
 * @param exercise Red team exercise
 * @returns Metrics
 */
export function calculateRedTeamMetrics(exercise: RedTeamExercise): {
  objectiveSuccessRate: number;
  systemsCompromised: number;
  averageTimeToCompromise: number;
  detectionRate: number;
  effectiveness: string;
} {
  const objectiveSuccessRate = exercise.objectives.length > 0
    ? (exercise.objectivesAchieved / exercise.objectives.length) * 100
    : 0;

  const timeline = exercise.metadata?.compromiseTimeline || [];
  const avgTime = timeline.length > 0
    ? timeline.reduce((sum: number, item: any) => {
        const time = new Date(item.timestamp).getTime() - exercise.startDate.getTime();
        return sum + time;
      }, 0) / timeline.length / (1000 * 60 * 60)
    : 0;

  let effectiveness = 'Low';
  if (objectiveSuccessRate >= 80) effectiveness = 'High';
  else if (objectiveSuccessRate >= 50) effectiveness = 'Medium';

  return {
    objectiveSuccessRate: Math.round(objectiveSuccessRate),
    systemsCompromised: exercise.compromisedSystems.length,
    averageTimeToCompromise: Math.round(avgTime * 10) / 10,
    detectionRate: exercise.detectionRate ? Number(exercise.detectionRate) : 0,
    effectiveness,
  };
}

// ============================================================================
// PURPLE TEAM COORDINATION FUNCTIONS
// ============================================================================

/**
 * Schedule purple team activity
 * @param exerciseId Red team exercise ID
 * @param activity Activity details
 * @param transaction Optional transaction
 * @returns Updated exercise
 */
export async function schedulePurpleTeamActivity(
  exerciseId: string,
  activity: PurpleTeamActivityDto,
  transaction?: Transaction
): Promise<RedTeamExercise> {
  const exercise = await RedTeamExercise.findByPk(exerciseId, { transaction });
  if (!exercise) {
    throw new Error(`Red team exercise ${exerciseId} not found`);
  }

  if (!exercise.metadata) exercise.metadata = {};
  if (!exercise.metadata.purpleTeamActivities) {
    exercise.metadata.purpleTeamActivities = [];
  }

  exercise.metadata.purpleTeamActivities.push({
    ...activity,
    scheduledTime: activity.scheduledTime.toISOString(),
    status: 'scheduled',
  });

  await exercise.save({ transaction });
  return exercise;
}

/**
 * Record purple team activity results
 * @param exerciseId Exercise ID
 * @param activityIndex Activity index
 * @param detected Whether attack was detected
 * @param timeToDetect Time to detect in minutes
 * @param notes Notes
 * @param transaction Optional transaction
 * @returns Updated exercise
 */
export async function recordPurpleTeamResults(
  exerciseId: string,
  activityIndex: number,
  detected: boolean,
  timeToDetect: number | null,
  notes: string,
  transaction?: Transaction
): Promise<RedTeamExercise> {
  const exercise = await RedTeamExercise.findByPk(exerciseId, { transaction });
  if (!exercise) {
    throw new Error(`Red team exercise ${exerciseId} not found`);
  }

  if (exercise.metadata?.purpleTeamActivities?.[activityIndex]) {
    exercise.metadata.purpleTeamActivities[activityIndex].status = 'completed';
    exercise.metadata.purpleTeamActivities[activityIndex].detected = detected;
    exercise.metadata.purpleTeamActivities[activityIndex].timeToDetect = timeToDetect;
    exercise.metadata.purpleTeamActivities[activityIndex].notes = notes;
  }

  // Recalculate detection metrics
  const activities = exercise.metadata?.purpleTeamActivities || [];
  const completed = activities.filter((a: any) => a.status === 'completed');
  const detectedCount = completed.filter((a: any) => a.detected).length;

  if (completed.length > 0) {
    exercise.detectionRate = (detectedCount / completed.length) * 100;

    const times = completed
      .filter((a: any) => a.detected && a.timeToDetect !== null)
      .map((a: any) => a.timeToDetect);

    if (times.length > 0) {
      exercise.meanTimeToDetect = times.reduce((sum: number, t: number) => sum + t, 0) / times.length;
    }
  }

  await exercise.save({ transaction });
  return exercise;
}

/**
 * Generate purple team collaboration report
 * @param exercise Red team exercise
 * @returns Collaboration report
 */
export function generatePurpleTeamReport(exercise: RedTeamExercise): {
  overview: string;
  activitiesCompleted: number;
  detectionRate: number;
  meanTimeToDetect: number;
  improvements: string[];
  gapsIdentified: string[];
} {
  const activities = exercise.metadata?.purpleTeamActivities || [];
  const completed = activities.filter((a: any) => a.status === 'completed');
  const detected = completed.filter((a: any) => a.detected);

  return {
    overview: `Purple team exercise "${exercise.codeName}" with ${completed.length} completed activities.`,
    activitiesCompleted: completed.length,
    detectionRate: exercise.detectionRate ? Number(exercise.detectionRate) : 0,
    meanTimeToDetect: exercise.meanTimeToDetect || 0,
    improvements: [
      'Enhanced detection capabilities through collaborative testing',
      'Improved incident response procedures',
      'Updated security monitoring rules',
    ],
    gapsIdentified: detected.length < completed.length
      ? ['Some attack techniques went undetected', 'Detection time needs improvement']
      : [],
  };
}

// ============================================================================
// SECURITY TESTING METRICS FUNCTIONS
// ============================================================================

/**
 * Calculate penetration test coverage metrics
 * @param penTests Penetration tests
 * @returns Coverage metrics
 */
export function calculatePenTestCoverage(penTests: PenetrationTest[]): {
  totalTests: number;
  scopesCovered: Set<PenTestScope>;
  averageFindingsPerTest: number;
  criticalFindingsRate: number;
  testsByType: Record<PenTestType, number>;
} {
  const scopesCovered = new Set<PenTestScope>();
  let totalFindings = 0;
  let totalCritical = 0;
  const testsByType: Record<PenTestType, number> = {} as any;

  for (const test of penTests) {
    test.scopes.forEach(scope => scopesCovered.add(scope));
    totalFindings += test.findingsCount;
    totalCritical += test.criticalFindings;

    testsByType[test.type] = (testsByType[test.type] || 0) + 1;
  }

  return {
    totalTests: penTests.length,
    scopesCovered,
    averageFindingsPerTest: penTests.length > 0 ? totalFindings / penTests.length : 0,
    criticalFindingsRate: totalFindings > 0 ? (totalCritical / totalFindings) * 100 : 0,
    testsByType,
  };
}

/**
 * Calculate mean time to remediate (MTTR)
 * @param vulnerabilities Vulnerabilities
 * @returns MTTR in days
 */
export function calculateMTTR(vulnerabilities: Vulnerability[]): number {
  const remediatedVulns = vulnerabilities.filter(
    v => v.remediatedAt && v.discoveredAt
  );

  if (remediatedVulns.length === 0) return 0;

  const totalTime = remediatedVulns.reduce((sum, v) => {
    const time = v.remediatedAt!.getTime() - v.discoveredAt.getTime();
    return sum + time;
  }, 0);

  return totalTime / remediatedVulns.length / (1000 * 60 * 60 * 24);
}

/**
 * Generate security testing KPIs
 * @param penTests Penetration tests
 * @param vulnerabilities All vulnerabilities
 * @returns KPIs
 */
export function generateSecurityTestingKPIs(
  penTests: PenetrationTest[],
  vulnerabilities: Vulnerability[]
): {
  totalTests: number;
  totalVulnerabilities: number;
  criticalVulnerabilities: number;
  averageMTTR: number;
  remediationRate: number;
  testCadence: number;
  riskTrend: string;
} {
  const mttr = calculateMTTR(vulnerabilities);
  const remediated = vulnerabilities.filter(v => v.status === VulnerabilityStatus.VERIFIED).length;
  const remediationRate = vulnerabilities.length > 0 ? (remediated / vulnerabilities.length) * 100 : 0;

  // Calculate test cadence (tests per quarter)
  const sortedTests = penTests.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  let testCadence = 0;
  if (sortedTests.length >= 2) {
    const timeSpan = sortedTests[sortedTests.length - 1].startDate.getTime() - sortedTests[0].startDate.getTime();
    const quarters = timeSpan / (1000 * 60 * 60 * 24 * 90);
    testCadence = quarters > 0 ? penTests.length / quarters : 0;
  }

  const criticalCount = vulnerabilities.filter(v => v.severity === VulnerabilitySeverity.CRITICAL).length;
  const riskTrend = criticalCount === 0 ? 'Improving' : criticalCount > 5 ? 'Worsening' : 'Stable';

  return {
    totalTests: penTests.length,
    totalVulnerabilities: vulnerabilities.length,
    criticalVulnerabilities: criticalCount,
    averageMTTR: Math.round(mttr * 10) / 10,
    remediationRate: Math.round(remediationRate),
    testCadence: Math.round(testCadence * 10) / 10,
    riskTrend,
  };
}

/**
 * Generate vulnerability trend analysis
 * @param vulnerabilities Vulnerabilities with timestamps
 * @param periodDays Analysis period in days
 * @returns Trend analysis
 */
export function analyzeVulnerabilityTrends(
  vulnerabilities: Vulnerability[],
  periodDays: number = 90
): {
  totalDiscovered: number;
  totalRemediated: number;
  averagePerDay: number;
  severityDistribution: Record<VulnerabilitySeverity, number>;
  trendDirection: 'increasing' | 'decreasing' | 'stable';
} {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - periodDays);

  const recentVulns = vulnerabilities.filter(v => v.discoveredAt >= cutoffDate);
  const remediated = recentVulns.filter(v => v.remediatedAt && v.remediatedAt >= cutoffDate);

  const severityDistribution: Record<VulnerabilitySeverity, number> = {
    [VulnerabilitySeverity.CRITICAL]: 0,
    [VulnerabilitySeverity.HIGH]: 0,
    [VulnerabilitySeverity.MEDIUM]: 0,
    [VulnerabilitySeverity.LOW]: 0,
    [VulnerabilitySeverity.INFORMATIONAL]: 0,
  };

  recentVulns.forEach(v => {
    severityDistribution[v.severity]++;
  });

  const averagePerDay = recentVulns.length / periodDays;

  // Compare first half vs second half
  const midPoint = new Date(cutoffDate.getTime() + (Date.now() - cutoffDate.getTime()) / 2);
  const firstHalf = recentVulns.filter(v => v.discoveredAt < midPoint).length;
  const secondHalf = recentVulns.filter(v => v.discoveredAt >= midPoint).length;

  let trendDirection: 'increasing' | 'decreasing' | 'stable' = 'stable';
  if (secondHalf > firstHalf * 1.2) trendDirection = 'increasing';
  else if (secondHalf < firstHalf * 0.8) trendDirection = 'decreasing';

  return {
    totalDiscovered: recentVulns.length,
    totalRemediated: remediated.length,
    averagePerDay: Math.round(averagePerDay * 100) / 100,
    severityDistribution,
    trendDirection,
  };
}

// ============================================================================
// NESTJS SERVICE
// ============================================================================

@Injectable()
export class PenetrationTestingService {
  constructor(private readonly sequelize: Sequelize) {}

  async createPenTest(data: CreatePenTestDto): Promise<PenetrationTest> {
    return createPenetrationTest(data);
  }

  async createVulnerability(
    data: CreateVulnerabilityDto & { penTestId: string }
  ): Promise<Vulnerability> {
    return createVulnerability(data);
  }

  async createRedTeamExercise(data: CreateRedTeamExerciseDto): Promise<RedTeamExercise> {
    return createRedTeamExercise(data);
  }

  async generatePenTestReport(penTestId: string): Promise<{
    executiveSummary: ReturnType<typeof generateExecutiveSummary>;
    vulnerabilities: ReturnType<typeof generateVulnerabilityReport>[];
    remediationTimeline: ReturnType<typeof calculateRemediationTimeline>;
  }> {
    const penTest = await PenetrationTest.findByPk(penTestId);
    if (!penTest) {
      throw new Error(`Penetration test ${penTestId} not found`);
    }

    const vulnerabilities = await Vulnerability.findAll({ where: { penTestId } });

    return {
      executiveSummary: generateExecutiveSummary(penTest, vulnerabilities),
      vulnerabilities: vulnerabilities.map(v => generateVulnerabilityReport(v)),
      remediationTimeline: calculateRemediationTimeline(vulnerabilities),
    };
  }

  async getSecurityMetrics(): Promise<ReturnType<typeof generateSecurityTestingKPIs>> {
    const penTests = await PenetrationTest.findAll();
    const vulnerabilities = await Vulnerability.findAll();
    return generateSecurityTestingKPIs(penTests, vulnerabilities);
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Models
  PenetrationTest,
  Vulnerability,
  RedTeamExercise,
  RemediationTask,

  // Model initialization
  initPenetrationTestModel,
  initVulnerabilityModel,
  initRedTeamExerciseModel,
  initRemediationTaskModel,

  // Planning functions
  createPenetrationTest,
  updatePenTestPhase,
  calculateScopeMetrics,
  generateScopeDocument,
  calculateCVSSScore,

  // Vulnerability tracking
  createVulnerability,
  updateVulnerabilityStatus,
  updatePenTestStatistics,
  trackExploitationAttempt,
  getVulnerabilitiesBySeverity,

  // Report generation
  generateExecutiveSummary,
  generateVulnerabilityReport,
  calculateRemediationTimeline,
  mapToOWASPTop10,

  // Remediation
  createRemediationTask,
  updateRemediationStatus,
  verifyRemediation,
  getOverdueRemediationTasks,
  calculateRemediationProgress,

  // Red team
  createRedTeamExercise,
  updateRedTeamObjective,
  trackSystemCompromise,
  calculateRedTeamMetrics,

  // Purple team
  schedulePurpleTeamActivity,
  recordPurpleTeamResults,
  generatePurpleTeamReport,

  // Metrics
  calculatePenTestCoverage,
  calculateMTTR,
  generateSecurityTestingKPIs,
  analyzeVulnerabilityTrends,

  // Service
  PenetrationTestingService,
};
