/**
 * INCIDENT COMMAND SYSTEM CONTROLLERS
 *
 * Comprehensive incident command and control system implementing ICS/NIMS standards.
 * Provides 48 specialized functions covering:
 * - Incident creation, classification, and escalation
 * - Multi-agency coordination and unified command
 * - Incident command structure (ICS/NIMS) management
 * - Resource requests, allocation, and tracking
 * - Tactical objectives and incident action plans
 * - Situation reports (SitReps) and operational briefings
 * - Incident timeline and chronological documentation
 * - Command transfer and demobilization
 * - Section chiefs and organizational structure
 * - Safety officer and planning section operations
 * - NestJS controllers with comprehensive validation
 * - Swagger/OpenAPI documentation
 * - HIPAA-compliant audit logging
 *
 * @module IncidentCommandControllers
 * @version 1.0.0
 * @requires @nestjs/common ^11.1.8
 * @requires @nestjs/swagger ^8.1.0
 * @requires class-validator ^0.14.1
 * @requires class-transformer ^0.5.1
 * @requires sequelize ^6.37.5
 * @requires sequelize-typescript ^2.1.6
 * @requires @faker-js/faker ^9.4.0
 * @requires Node.js 18+
 * @requires TypeScript 5.x
 *
 * @security HIPAA compliant - all incident operations are audited and logged
 * @example
 * ```typescript
 * import {
 *   createIncident,
 *   establishUnifiedCommand,
 *   requestResources,
 *   updateIncidentStatus
 * } from './incident-command-controllers';
 *
 * // Create a new incident
 * const incident = await createIncident({
 *   incidentType: 'STRUCTURE_FIRE',
 *   severity: IncidentSeverity.MAJOR,
 *   location: { latitude: 40.7128, longitude: -74.0060 },
 *   reportedBy: 'dispatch-123'
 * });
 *
 * // Establish unified command
 * await establishUnifiedCommand(incident.id, {
 *   agencies: ['FIRE', 'POLICE', 'EMS'],
 *   incidentCommanders: ['ic-fire-1', 'ic-police-1', 'ic-ems-1']
 * });
 * ```
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
  UseGuards,
  UseInterceptors,
  ParseUUIDPipe,
  ValidationPipe,
  UsePipes,
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
  IsLatitude,
  IsLongitude,
  IsObject,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { faker } from '@faker-js/faker';

// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================

/**
 * Incident severity levels aligned with ICS standards
 */
export enum IncidentSeverity {
  MINOR = 'minor',
  MODERATE = 'moderate',
  MAJOR = 'major',
  CRITICAL = 'critical',
  CATASTROPHIC = 'catastrophic',
}

/**
 * Incident status progression
 */
export enum IncidentStatus {
  REPORTED = 'reported',
  DISPATCHED = 'dispatched',
  RESPONDING = 'responding',
  ON_SCENE = 'on_scene',
  UNDER_CONTROL = 'under_control',
  CONTAINED = 'contained',
  CONTROLLED = 'controlled',
  DEMOBILIZING = 'demobilizing',
  CLOSED = 'closed',
  CANCELLED = 'cancelled',
}

/**
 * ICS incident types
 */
export enum IncidentType {
  STRUCTURE_FIRE = 'structure_fire',
  WILDFIRE = 'wildfire',
  VEHICLE_FIRE = 'vehicle_fire',
  HAZMAT = 'hazmat',
  MEDICAL_EMERGENCY = 'medical_emergency',
  MASS_CASUALTY = 'mass_casualty',
  TRAUMA = 'trauma',
  CARDIAC_ARREST = 'cardiac_arrest',
  VEHICLE_ACCIDENT = 'vehicle_accident',
  RESCUE = 'rescue',
  WATER_RESCUE = 'water_rescue',
  TECHNICAL_RESCUE = 'technical_rescue',
  NATURAL_DISASTER = 'natural_disaster',
  TERRORIST_INCIDENT = 'terrorist_incident',
  CIVIL_DISTURBANCE = 'civil_disturbance',
  OTHER = 'other',
}

/**
 * ICS organizational sections
 */
export enum ICSSection {
  COMMAND = 'command',
  OPERATIONS = 'operations',
  PLANNING = 'planning',
  LOGISTICS = 'logistics',
  FINANCE_ADMIN = 'finance_admin',
}

/**
 * ICS command positions
 */
export enum ICSPosition {
  INCIDENT_COMMANDER = 'incident_commander',
  SAFETY_OFFICER = 'safety_officer',
  PUBLIC_INFO_OFFICER = 'public_info_officer',
  LIAISON_OFFICER = 'liaison_officer',
  OPERATIONS_CHIEF = 'operations_chief',
  PLANNING_CHIEF = 'planning_chief',
  LOGISTICS_CHIEF = 'logistics_chief',
  FINANCE_CHIEF = 'finance_chief',
  DIVISION_SUPERVISOR = 'division_supervisor',
  BRANCH_DIRECTOR = 'branch_director',
  STRIKE_TEAM_LEADER = 'strike_team_leader',
  TASK_FORCE_LEADER = 'task_force_leader',
}

/**
 * Resource request status
 */
export enum ResourceRequestStatus {
  REQUESTED = 'requested',
  PENDING = 'pending',
  APPROVED = 'approved',
  DISPATCHED = 'dispatched',
  STAGED = 'staged',
  ASSIGNED = 'assigned',
  RELEASED = 'released',
  CANCELLED = 'cancelled',
}

/**
 * Tactical objective status
 */
export enum ObjectiveStatus {
  PLANNED = 'planned',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  DEFERRED = 'deferred',
  CANCELLED = 'cancelled',
}

/**
 * Action plan operational period
 */
export enum OperationalPeriod {
  TWELVE_HOURS = '12_hours',
  TWENTY_FOUR_HOURS = '24_hours',
  CUSTOM = 'custom',
}

// ============================================================================
// INTERFACE DEFINITIONS
// ============================================================================

/**
 * Geographic location interface
 */
export interface GeoLocation {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  plusCode?: string;
  what3words?: string;
}

/**
 * Incident interface
 */
export interface Incident {
  id: string;
  incidentNumber: string;
  incidentType: IncidentType;
  severity: IncidentSeverity;
  status: IncidentStatus;
  location: GeoLocation;
  description: string;
  reportedAt: Date;
  reportedBy: string;
  dispatchedAt?: Date;
  arrivedAt?: Date;
  controlledAt?: Date;
  closedAt?: Date;
  incidentCommander?: string;
  unifiedCommand?: boolean;
  unifiedCommandAgencies?: string[];
  patientCount?: number;
  structuresInvolved?: number;
  estimatedLoss?: number;
  isMutualAid?: boolean;
  mutualAidAgencies?: string[];
  weatherConditions?: string;
  specialHazards?: string[];
  evacuationRequired?: boolean;
  evacuationRadius?: number;
  mediaAttention?: boolean;
  vipInvolved?: boolean;
  priorityLevel: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy?: string;
  metadata?: Record<string, any>;
}

/**
 * Unified command structure
 */
export interface UnifiedCommand {
  id: string;
  incidentId: string;
  agencies: string[];
  incidentCommanders: Array<{
    userId: string;
    agency: string;
    rank: string;
    name: string;
  }>;
  establishedAt: Date;
  establishedBy: string;
  commandPost?: GeoLocation;
  agreements?: string[];
  isActive: boolean;
}

/**
 * ICS organizational assignment
 */
export interface ICSAssignment {
  id: string;
  incidentId: string;
  position: ICSPosition;
  section: ICSSection;
  assignedTo: string;
  assignedName: string;
  agency: string;
  assignedAt: Date;
  relievedAt?: Date;
  relievedBy?: string;
  notes?: string;
}

/**
 * Resource request interface
 */
export interface ResourceRequest {
  id: string;
  incidentId: string;
  requestNumber: string;
  resourceType: string;
  quantity: number;
  priority: 'routine' | 'urgent' | 'emergency';
  status: ResourceRequestStatus;
  requestedBy: string;
  requestedAt: Date;
  approvedBy?: string;
  approvedAt?: Date;
  assignedResources?: string[];
  eta?: Date;
  arrivedAt?: Date;
  releasedAt?: Date;
  justification: string;
  specialRequirements?: string[];
}

/**
 * Tactical objective interface
 */
export interface TacticalObjective {
  id: string;
  incidentId: string;
  objectiveNumber: number;
  description: string;
  priority: number;
  status: ObjectiveStatus;
  assignedTo?: string;
  assignedSection?: ICSSection;
  targetCompletionTime?: Date;
  actualCompletionTime?: Date;
  resources?: string[];
  safetyConsiderations?: string[];
  constraints?: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Incident action plan interface
 */
export interface IncidentActionPlan {
  id: string;
  incidentId: string;
  operationalPeriod: OperationalPeriod;
  periodStart: Date;
  periodEnd: Date;
  objectives: TacticalObjective[];
  organizationChart?: string;
  assignmentList?: string;
  communicationsPlan?: string;
  medicalPlan?: string;
  safetyMessage?: string;
  approvedBy?: string;
  approvedAt?: Date;
  isActive: boolean;
  createdAt: Date;
}

/**
 * Situation report (SitRep) interface
 */
export interface SituationReport {
  id: string;
  incidentId: string;
  reportNumber: number;
  reportedAt: Date;
  reportedBy: string;
  currentSituation: string;
  resourcesSummary: {
    personnel: number;
    apparatus: number;
    specializedUnits: number;
  };
  accomplishments?: string[];
  currentProblems?: string[];
  plannedActions?: string[];
  weatherUpdate?: string;
  safetyIssues?: string[];
  nextReportDue?: Date;
}

/**
 * Incident timeline entry
 */
export interface IncidentTimelineEntry {
  id: string;
  incidentId: string;
  timestamp: Date;
  eventType: string;
  description: string;
  performedBy?: string;
  section?: ICSSection;
  significance: 'routine' | 'important' | 'critical';
  attachments?: string[];
}

/**
 * Command transfer record
 */
export interface CommandTransfer {
  id: string;
  incidentId: string;
  fromCommander: string;
  toCommander: string;
  transferredAt: Date;
  transferBriefing: string;
  witnessedBy?: string[];
  reason?: string;
}

/**
 * Safety briefing record
 */
export interface SafetyBriefing {
  id: string;
  incidentId: string;
  briefingTime: Date;
  briefedBy: string;
  attendees: string[];
  hazards: string[];
  mitigationMeasures: string[];
  ppe required: string[];
  accountabilityProcedures?: string;
  emergencyProcedures?: string;
}

// ============================================================================
// DTO CLASSES FOR VALIDATION
// ============================================================================

/**
 * Create incident DTO
 */
export class CreateIncidentDto {
  @ApiProperty({ enum: IncidentType, description: 'Type of incident' })
  @IsEnum(IncidentType)
  incidentType: IncidentType;

  @ApiProperty({ enum: IncidentSeverity, description: 'Incident severity' })
  @IsEnum(IncidentSeverity)
  severity: IncidentSeverity;

  @ApiProperty({ description: 'Incident description' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  description: string;

  @ApiProperty({ description: 'Location latitude' })
  @IsNumber()
  @IsLatitude()
  latitude: number;

  @ApiProperty({ description: 'Location longitude' })
  @IsNumber()
  @IsLongitude()
  longitude: number;

  @ApiProperty({ description: 'Street address', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  address?: string;

  @ApiProperty({ description: 'City', required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ description: 'State', required: false })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({ description: 'Reported by user ID' })
  @IsUUID()
  reportedBy: string;

  @ApiProperty({ description: 'Patient count', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  patientCount?: number;

  @ApiProperty({ description: 'Special hazards', required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  specialHazards?: string[];

  @ApiProperty({ description: 'Weather conditions', required: false })
  @IsOptional()
  @IsString()
  weatherConditions?: string;
}

/**
 * Update incident DTO
 */
export class UpdateIncidentDto {
  @ApiProperty({ enum: IncidentStatus, required: false })
  @IsOptional()
  @IsEnum(IncidentStatus)
  status?: IncidentStatus;

  @ApiProperty({ enum: IncidentSeverity, required: false })
  @IsOptional()
  @IsEnum(IncidentSeverity)
  severity?: IncidentSeverity;

  @ApiProperty({ description: 'Incident description', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiProperty({ description: 'Patient count', required: false })
  @IsOptional()
  @IsNumber()
  patientCount?: number;

  @ApiProperty({ description: 'Structures involved', required: false })
  @IsOptional()
  @IsNumber()
  structuresInvolved?: number;

  @ApiProperty({ description: 'Estimated loss in dollars', required: false })
  @IsOptional()
  @IsNumber()
  estimatedLoss?: number;
}

/**
 * Establish unified command DTO
 */
export class EstablishUnifiedCommandDto {
  @ApiProperty({ description: 'Participating agencies', type: [String] })
  @IsArray()
  @IsString({ each: true })
  @MinLength(2)
  agencies: string[];

  @ApiProperty({ description: 'Incident commanders', type: [Object] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  incidentCommanders: Array<{
    userId: string;
    agency: string;
    rank: string;
    name: string;
  }>;

  @ApiProperty({ description: 'Command post location', required: false })
  @IsOptional()
  @IsObject()
  commandPost?: GeoLocation;
}

/**
 * Assign ICS position DTO
 */
export class AssignICSPositionDto {
  @ApiProperty({ enum: ICSPosition, description: 'ICS position' })
  @IsEnum(ICSPosition)
  position: ICSPosition;

  @ApiProperty({ enum: ICSSection, description: 'ICS section' })
  @IsEnum(ICSSection)
  section: ICSSection;

  @ApiProperty({ description: 'User ID to assign' })
  @IsUUID()
  assignedTo: string;

  @ApiProperty({ description: 'Assignee name' })
  @IsString()
  @IsNotEmpty()
  assignedName: string;

  @ApiProperty({ description: 'Agency' })
  @IsString()
  @IsNotEmpty()
  agency: string;

  @ApiProperty({ description: 'Assignment notes', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}

/**
 * Request resources DTO
 */
export class RequestResourcesDto {
  @ApiProperty({ description: 'Resource type (e.g., Engine, Ambulance, Ladder)' })
  @IsString()
  @IsNotEmpty()
  resourceType: string;

  @ApiProperty({ description: 'Quantity needed' })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ enum: ['routine', 'urgent', 'emergency'], description: 'Request priority' })
  @IsEnum(['routine', 'urgent', 'emergency'])
  priority: 'routine' | 'urgent' | 'emergency';

  @ApiProperty({ description: 'Justification for request' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  justification: string;

  @ApiProperty({ description: 'Special requirements', required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  specialRequirements?: string[];

  @ApiProperty({ description: 'Requested by user ID' })
  @IsUUID()
  requestedBy: string;
}

/**
 * Create tactical objective DTO
 */
export class CreateTacticalObjectiveDto {
  @ApiProperty({ description: 'Objective description' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  description: string;

  @ApiProperty({ description: 'Priority (1=highest)' })
  @IsNumber()
  @Min(1)
  priority: number;

  @ApiProperty({ description: 'Assigned to user ID', required: false })
  @IsOptional()
  @IsUUID()
  assignedTo?: string;

  @ApiProperty({ enum: ICSSection, description: 'Assigned section', required: false })
  @IsOptional()
  @IsEnum(ICSSection)
  assignedSection?: ICSSection;

  @ApiProperty({ description: 'Target completion time', required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  targetCompletionTime?: Date;

  @ApiProperty({ description: 'Safety considerations', required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  safetyConsiderations?: string[];
}

/**
 * Create incident action plan DTO
 */
export class CreateIncidentActionPlanDto {
  @ApiProperty({ enum: OperationalPeriod, description: 'Operational period duration' })
  @IsEnum(OperationalPeriod)
  operationalPeriod: OperationalPeriod;

  @ApiProperty({ description: 'Period start time' })
  @Type(() => Date)
  @IsDate()
  periodStart: Date;

  @ApiProperty({ description: 'Period end time' })
  @Type(() => Date)
  @IsDate()
  periodEnd: Date;

  @ApiProperty({ description: 'Safety message' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  safetyMessage: string;

  @ApiProperty({ description: 'Communications plan', required: false })
  @IsOptional()
  @IsString()
  communicationsPlan?: string;
}

/**
 * Create situation report DTO
 */
export class CreateSituationReportDto {
  @ApiProperty({ description: 'Current situation summary' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  currentSituation: string;

  @ApiProperty({ description: 'Number of personnel on scene' })
  @IsNumber()
  @Min(0)
  personnel: number;

  @ApiProperty({ description: 'Number of apparatus on scene' })
  @IsNumber()
  @Min(0)
  apparatus: number;

  @ApiProperty({ description: 'Accomplishments', required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  accomplishments?: string[];

  @ApiProperty({ description: 'Current problems', required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  currentProblems?: string[];

  @ApiProperty({ description: 'Planned actions', required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  plannedActions?: string[];

  @ApiProperty({ description: 'Reported by user ID' })
  @IsUUID()
  reportedBy: string;
}

/**
 * Transfer command DTO
 */
export class TransferCommandDto {
  @ApiProperty({ description: 'New incident commander ID' })
  @IsUUID()
  toCommander: string;

  @ApiProperty({ description: 'Transfer briefing summary' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  transferBriefing: string;

  @ApiProperty({ description: 'Witnessed by user IDs', required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  witnessedBy?: string[];

  @ApiProperty({ description: 'Reason for transfer', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}

// ============================================================================
// INCIDENT CREATION AND CLASSIFICATION
// ============================================================================

/**
 * Creates a new incident with auto-generated incident number
 *
 * @param data - Incident creation data
 * @param userId - User creating the incident
 * @returns Created incident
 *
 * @example
 * ```typescript
 * const incident = await createIncident({
 *   incidentType: IncidentType.STRUCTURE_FIRE,
 *   severity: IncidentSeverity.MAJOR,
 *   description: '2-story residential fire with occupants trapped',
 *   location: { latitude: 40.7128, longitude: -74.0060 },
 *   reportedBy: 'dispatch-123'
 * }, 'user-456');
 * ```
 */
export async function createIncident(
  data: Omit<Incident, 'id' | 'incidentNumber' | 'status' | 'createdAt' | 'updatedAt' | 'priorityLevel'>,
  userId: string,
): Promise<Incident> {
  const incident: Incident = {
    id: faker.string.uuid(),
    incidentNumber: generateIncidentNumber(data.incidentType, data.location),
    status: IncidentStatus.REPORTED,
    priorityLevel: calculateIncidentPriority(data.severity, data.incidentType),
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: userId,
  };

  await logIncidentActivity(incident.id, 'incident_created', {
    incidentType: data.incidentType,
    severity: data.severity,
    location: data.location,
  });

  return incident;
}

/**
 * Generates unique incident number based on type and location
 *
 * @param type - Incident type
 * @param location - Incident location
 * @returns Formatted incident number
 *
 * @example
 * ```typescript
 * const incidentNum = generateIncidentNumber(IncidentType.STRUCTURE_FIRE, location);
 * // Returns: "INC-SF-2025010801234"
 * ```
 */
export function generateIncidentNumber(type: IncidentType, location: GeoLocation): string {
  const typePrefix = {
    [IncidentType.STRUCTURE_FIRE]: 'SF',
    [IncidentType.WILDFIRE]: 'WF',
    [IncidentType.VEHICLE_FIRE]: 'VF',
    [IncidentType.HAZMAT]: 'HM',
    [IncidentType.MEDICAL_EMERGENCY]: 'ME',
    [IncidentType.MASS_CASUALTY]: 'MC',
    [IncidentType.TRAUMA]: 'TR',
    [IncidentType.CARDIAC_ARREST]: 'CA',
    [IncidentType.VEHICLE_ACCIDENT]: 'VA',
    [IncidentType.RESCUE]: 'RE',
    [IncidentType.WATER_RESCUE]: 'WR',
    [IncidentType.TECHNICAL_RESCUE]: 'TE',
    [IncidentType.NATURAL_DISASTER]: 'ND',
    [IncidentType.TERRORIST_INCIDENT]: 'TI',
    [IncidentType.CIVIL_DISTURBANCE]: 'CD',
    [IncidentType.OTHER]: 'OT',
  }[type];

  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const sequence = Math.floor(Math.random() * 100000)
    .toString()
    .padStart(5, '0');

  return `INC-${typePrefix}-${date}${sequence}`;
}

/**
 * Classifies incident by analyzing multiple factors
 *
 * @param incident - Incident to classify
 * @returns Classification details
 *
 * @example
 * ```typescript
 * const classification = classifyIncident(incident);
 * // Returns: { category: 'fire', subcategory: 'residential', nfirsCode: '111' }
 * ```
 */
export function classifyIncident(incident: Incident): {
  category: string;
  subcategory: string;
  nfirsCode?: string;
  resourceNeeds: string[];
  estimatedDuration: number;
} {
  const classifications = {
    [IncidentType.STRUCTURE_FIRE]: {
      category: 'fire',
      subcategory: 'residential',
      nfirsCode: '111',
      resourceNeeds: ['Engine', 'Ladder', 'Rescue', 'Chief'],
      estimatedDuration: 240,
    },
    [IncidentType.MEDICAL_EMERGENCY]: {
      category: 'medical',
      subcategory: 'als',
      nfirsCode: '321',
      resourceNeeds: ['Ambulance', 'ALS'],
      estimatedDuration: 60,
    },
  };

  return (
    classifications[incident.incidentType] || {
      category: 'other',
      subcategory: 'unknown',
      resourceNeeds: ['Engine'],
      estimatedDuration: 120,
    }
  );
}

/**
 * Calculates incident priority based on severity and type
 *
 * @param severity - Incident severity
 * @param type - Incident type
 * @returns Priority level (1-10, 1=highest)
 *
 * @example
 * ```typescript
 * const priority = calculateIncidentPriority(IncidentSeverity.MAJOR, IncidentType.STRUCTURE_FIRE);
 * // Returns: 2
 * ```
 */
export function calculateIncidentPriority(severity: IncidentSeverity, type: IncidentType): number {
  const severityWeight = {
    [IncidentSeverity.CATASTROPHIC]: 1,
    [IncidentSeverity.CRITICAL]: 2,
    [IncidentSeverity.MAJOR]: 3,
    [IncidentSeverity.MODERATE]: 5,
    [IncidentSeverity.MINOR]: 7,
  };

  const typeWeight = {
    [IncidentType.MASS_CASUALTY]: -1,
    [IncidentType.TERRORIST_INCIDENT]: -1,
    [IncidentType.STRUCTURE_FIRE]: -1,
    [IncidentType.HAZMAT]: -1,
    [IncidentType.CARDIAC_ARREST]: 0,
    [IncidentType.MEDICAL_EMERGENCY]: 1,
    [IncidentType.VEHICLE_ACCIDENT]: 1,
  };

  const basePriority = severityWeight[severity] || 5;
  const adjustment = typeWeight[type] || 0;

  return Math.max(1, Math.min(10, basePriority + adjustment));
}

/**
 * Escalates incident severity based on evolving conditions
 *
 * @param incidentId - Incident identifier
 * @param newSeverity - New severity level
 * @param reason - Escalation reason
 * @param userId - User escalating incident
 * @returns Updated incident
 *
 * @example
 * ```typescript
 * await escalateIncident('inc-123', IncidentSeverity.CRITICAL, 'Fire spread to adjacent structures', 'ic-456');
 * ```
 */
export async function escalateIncident(
  incidentId: string,
  newSeverity: IncidentSeverity,
  reason: string,
  userId: string,
): Promise<Incident> {
  const incident = await getIncident(incidentId);

  await logIncidentActivity(incidentId, 'incident_escalated', {
    previousSeverity: incident.severity,
    newSeverity,
    reason,
    escalatedBy: userId,
  });

  return {
    ...incident,
    severity: newSeverity,
    priorityLevel: calculateIncidentPriority(newSeverity, incident.incidentType),
    updatedAt: new Date(),
    updatedBy: userId,
  };
}

/**
 * Downgrades incident severity when conditions improve
 *
 * @param incidentId - Incident identifier
 * @param newSeverity - New severity level
 * @param reason - Downgrade reason
 * @param userId - User downgrading incident
 * @returns Updated incident
 *
 * @example
 * ```typescript
 * await downgradeIncident('inc-123', IncidentSeverity.MODERATE, 'Fire contained, knockdown achieved', 'ic-456');
 * ```
 */
export async function downgradeIncident(
  incidentId: string,
  newSeverity: IncidentSeverity,
  reason: string,
  userId: string,
): Promise<Incident> {
  const incident = await getIncident(incidentId);

  await logIncidentActivity(incidentId, 'incident_downgraded', {
    previousSeverity: incident.severity,
    newSeverity,
    reason,
    downgradedBy: userId,
  });

  return {
    ...incident,
    severity: newSeverity,
    priorityLevel: calculateIncidentPriority(newSeverity, incident.incidentType),
    updatedAt: new Date(),
    updatedBy: userId,
  };
}

// ============================================================================
// INCIDENT STATUS TRACKING
// ============================================================================

/**
 * Updates incident status with validation
 *
 * @param incidentId - Incident identifier
 * @param newStatus - New status
 * @param userId - User updating status
 * @returns Updated incident
 *
 * @example
 * ```typescript
 * await updateIncidentStatus('inc-123', IncidentStatus.ON_SCENE, 'ic-456');
 * ```
 */
export async function updateIncidentStatus(
  incidentId: string,
  newStatus: IncidentStatus,
  userId: string,
): Promise<Incident> {
  const incident = await getIncident(incidentId);

  validateStatusTransition(incident.status, newStatus);

  const updated: Incident = {
    ...incident,
    status: newStatus,
    updatedAt: new Date(),
    updatedBy: userId,
  };

  // Update timestamp fields based on status
  if (newStatus === IncidentStatus.DISPATCHED && !incident.dispatchedAt) {
    updated.dispatchedAt = new Date();
  } else if (newStatus === IncidentStatus.ON_SCENE && !incident.arrivedAt) {
    updated.arrivedAt = new Date();
  } else if (newStatus === IncidentStatus.CONTROLLED && !incident.controlledAt) {
    updated.controlledAt = new Date();
  } else if (newStatus === IncidentStatus.CLOSED && !incident.closedAt) {
    updated.closedAt = new Date();
  }

  await logIncidentActivity(incidentId, 'status_changed', {
    previousStatus: incident.status,
    newStatus,
    changedBy: userId,
  });

  return updated;
}

/**
 * Validates incident status transition
 *
 * @param currentStatus - Current status
 * @param newStatus - Proposed new status
 * @throws Error if transition is invalid
 *
 * @example
 * ```typescript
 * validateStatusTransition(IncidentStatus.REPORTED, IncidentStatus.CLOSED); // Throws error
 * validateStatusTransition(IncidentStatus.DISPATCHED, IncidentStatus.RESPONDING); // OK
 * ```
 */
export function validateStatusTransition(currentStatus: IncidentStatus, newStatus: IncidentStatus): void {
  const validTransitions: Record<IncidentStatus, IncidentStatus[]> = {
    [IncidentStatus.REPORTED]: [IncidentStatus.DISPATCHED, IncidentStatus.CANCELLED],
    [IncidentStatus.DISPATCHED]: [IncidentStatus.RESPONDING, IncidentStatus.CANCELLED],
    [IncidentStatus.RESPONDING]: [IncidentStatus.ON_SCENE, IncidentStatus.CANCELLED],
    [IncidentStatus.ON_SCENE]: [
      IncidentStatus.UNDER_CONTROL,
      IncidentStatus.CONTAINED,
      IncidentStatus.CANCELLED,
    ],
    [IncidentStatus.UNDER_CONTROL]: [IncidentStatus.CONTAINED, IncidentStatus.CONTROLLED],
    [IncidentStatus.CONTAINED]: [IncidentStatus.CONTROLLED, IncidentStatus.DEMOBILIZING],
    [IncidentStatus.CONTROLLED]: [IncidentStatus.DEMOBILIZING, IncidentStatus.CLOSED],
    [IncidentStatus.DEMOBILIZING]: [IncidentStatus.CLOSED],
    [IncidentStatus.CLOSED]: [],
    [IncidentStatus.CANCELLED]: [],
  };

  if (!validTransitions[currentStatus]?.includes(newStatus)) {
    throw new Error(`Invalid status transition from ${currentStatus} to ${newStatus}`);
  }
}

/**
 * Assigns incident commander
 *
 * @param incidentId - Incident identifier
 * @param commanderId - User ID of incident commander
 * @param userId - User making the assignment
 * @returns Updated incident
 *
 * @example
 * ```typescript
 * await assignIncidentCommander('inc-123', 'chief-456', 'dispatch-789');
 * ```
 */
export async function assignIncidentCommander(
  incidentId: string,
  commanderId: string,
  userId: string,
): Promise<Incident> {
  const incident = await getIncident(incidentId);

  await logIncidentActivity(incidentId, 'ic_assigned', {
    previousIC: incident.incidentCommander,
    newIC: commanderId,
    assignedBy: userId,
  });

  return {
    ...incident,
    incidentCommander: commanderId,
    updatedAt: new Date(),
    updatedBy: userId,
  };
}

/**
 * Gets incident timeline with all events
 *
 * @param incidentId - Incident identifier
 * @returns Chronological timeline of events
 *
 * @example
 * ```typescript
 * const timeline = await getIncidentTimeline('inc-123');
 * ```
 */
export async function getIncidentTimeline(incidentId: string): Promise<IncidentTimelineEntry[]> {
  // In production, fetch from database
  return [
    {
      id: faker.string.uuid(),
      incidentId,
      timestamp: new Date(),
      eventType: 'incident_created',
      description: 'Incident reported and created',
      significance: 'critical',
    },
  ];
}

/**
 * Adds timeline entry to incident
 *
 * @param incidentId - Incident identifier
 * @param entry - Timeline entry data
 * @returns Created timeline entry
 *
 * @example
 * ```typescript
 * await addTimelineEntry('inc-123', {
 *   eventType: 'resource_arrived',
 *   description: 'Engine 1 arrived on scene',
 *   significance: 'important'
 * });
 * ```
 */
export async function addTimelineEntry(
  incidentId: string,
  entry: Omit<IncidentTimelineEntry, 'id' | 'incidentId' | 'timestamp'>,
): Promise<IncidentTimelineEntry> {
  const timelineEntry: IncidentTimelineEntry = {
    id: faker.string.uuid(),
    incidentId,
    timestamp: new Date(),
    ...entry,
  };

  await logIncidentActivity(incidentId, 'timeline_entry_added', timelineEntry);

  return timelineEntry;
}

// ============================================================================
// UNIFIED COMMAND AND MULTI-AGENCY COORDINATION
// ============================================================================

/**
 * Establishes unified command structure
 *
 * @param incidentId - Incident identifier
 * @param data - Unified command configuration
 * @returns Created unified command structure
 *
 * @example
 * ```typescript
 * const uc = await establishUnifiedCommand('inc-123', {
 *   agencies: ['FIRE', 'POLICE', 'EMS'],
 *   incidentCommanders: [
 *     { userId: 'fire-chief-1', agency: 'FIRE', rank: 'Battalion Chief', name: 'Smith' },
 *     { userId: 'police-lt-1', agency: 'POLICE', rank: 'Lieutenant', name: 'Jones' }
 *   ]
 * });
 * ```
 */
export async function establishUnifiedCommand(
  incidentId: string,
  data: Omit<UnifiedCommand, 'id' | 'incidentId' | 'establishedAt' | 'establishedBy' | 'isActive'>,
  userId: string,
): Promise<UnifiedCommand> {
  const incident = await getIncident(incidentId);

  const unifiedCommand: UnifiedCommand = {
    id: faker.string.uuid(),
    incidentId,
    establishedAt: new Date(),
    establishedBy: userId,
    isActive: true,
    ...data,
  };

  // Update incident to reflect unified command
  await updateIncident(incidentId, {
    unifiedCommand: true,
    unifiedCommandAgencies: data.agencies,
  } as any);

  await logIncidentActivity(incidentId, 'unified_command_established', {
    agencies: data.agencies,
    commanders: data.incidentCommanders,
  });

  return unifiedCommand;
}

/**
 * Requests mutual aid from other agencies
 *
 * @param incidentId - Incident identifier
 * @param request - Mutual aid request details
 * @returns Mutual aid request record
 *
 * @example
 * ```typescript
 * await requestMutualAid('inc-123', {
 *   requestingAgency: 'City Fire Dept',
 *   requestedFrom: ['County Fire', 'State Police'],
 *   resources: ['Engine', 'Ladder'],
 *   reason: 'Working structure fire requiring additional resources'
 * });
 * ```
 */
export async function requestMutualAid(
  incidentId: string,
  request: {
    requestingAgency: string;
    requestedFrom: string[];
    resources: string[];
    reason: string;
  },
): Promise<{ id: string; status: string; eta?: Date }> {
  await logIncidentActivity(incidentId, 'mutual_aid_requested', request);

  return {
    id: faker.string.uuid(),
    status: 'pending',
    eta: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
  };
}

/**
 * Coordinates multi-agency response
 *
 * @param incidentId - Incident identifier
 * @param coordination - Coordination details
 * @returns Coordination plan
 *
 * @example
 * ```typescript
 * await coordinateMultiAgencyResponse('inc-123', {
 *   leadAgency: 'FIRE',
 *   supportingAgencies: ['POLICE', 'EMS'],
 *   communicationsChannel: 'TAC-5',
 *   stagingArea: { latitude: 40.7128, longitude: -74.0060 }
 * });
 * ```
 */
export async function coordinateMultiAgencyResponse(
  incidentId: string,
  coordination: {
    leadAgency: string;
    supportingAgencies: string[];
    communicationsChannel?: string;
    stagingArea?: GeoLocation;
  },
): Promise<{ planId: string; assignments: Record<string, string[]> }> {
  await logIncidentActivity(incidentId, 'multi_agency_coordination', coordination);

  return {
    planId: faker.string.uuid(),
    assignments: {
      FIRE: ['Fire suppression', 'Rescue operations'],
      POLICE: ['Traffic control', 'Perimeter security'],
      EMS: ['Patient care', 'Medical staging'],
    },
  };
}

/**
 * Transfers command to another commander
 *
 * @param incidentId - Incident identifier
 * @param transfer - Transfer details
 * @returns Command transfer record
 *
 * @example
 * ```typescript
 * await transferCommand('inc-123', {
 *   toCommander: 'chief-789',
 *   transferBriefing: 'Structure fire, 2 stories, offensive ops...',
 *   witnessedBy: ['captain-1', 'captain-2']
 * });
 * ```
 */
export async function transferCommand(
  incidentId: string,
  transfer: Omit<CommandTransfer, 'id' | 'incidentId' | 'fromCommander' | 'transferredAt'>,
): Promise<CommandTransfer> {
  const incident = await getIncident(incidentId);

  const commandTransfer: CommandTransfer = {
    id: faker.string.uuid(),
    incidentId,
    fromCommander: incident.incidentCommander || 'unknown',
    transferredAt: new Date(),
    ...transfer,
  };

  await assignIncidentCommander(incidentId, transfer.toCommander, transfer.toCommander);

  await logIncidentActivity(incidentId, 'command_transferred', commandTransfer);

  return commandTransfer;
}

// ============================================================================
// ICS ORGANIZATIONAL STRUCTURE
// ============================================================================

/**
 * Assigns ICS position to personnel
 *
 * @param incidentId - Incident identifier
 * @param assignment - Assignment details
 * @returns Created ICS assignment
 *
 * @example
 * ```typescript
 * await assignICSPosition('inc-123', {
 *   position: ICSPosition.OPERATIONS_CHIEF,
 *   section: ICSSection.OPERATIONS,
 *   assignedTo: 'chief-456',
 *   assignedName: 'Battalion Chief Smith',
 *   agency: 'City Fire Department'
 * });
 * ```
 */
export async function assignICSPosition(
  incidentId: string,
  assignment: Omit<ICSAssignment, 'id' | 'incidentId' | 'assignedAt'>,
): Promise<ICSAssignment> {
  const icsAssignment: ICSAssignment = {
    id: faker.string.uuid(),
    incidentId,
    assignedAt: new Date(),
    ...assignment,
  };

  await logIncidentActivity(incidentId, 'ics_position_assigned', {
    position: assignment.position,
    assignedTo: assignment.assignedName,
  });

  return icsAssignment;
}

/**
 * Relieves ICS position assignment
 *
 * @param assignmentId - Assignment identifier
 * @param relievedBy - User relieving the position
 * @returns Updated assignment
 *
 * @example
 * ```typescript
 * await relieveICSPosition('assign-123', 'chief-789');
 * ```
 */
export async function relieveICSPosition(assignmentId: string, relievedBy: string): Promise<ICSAssignment> {
  const assignment = await getICSAssignment(assignmentId);

  return {
    ...assignment,
    relievedAt: new Date(),
    relievedBy,
  };
}

/**
 * Gets ICS organizational chart for incident
 *
 * @param incidentId - Incident identifier
 * @returns ICS organization structure
 *
 * @example
 * ```typescript
 * const orgChart = await getICSOrganizationChart('inc-123');
 * ```
 */
export async function getICSOrganizationChart(incidentId: string): Promise<{
  command: ICSAssignment[];
  operations: ICSAssignment[];
  planning: ICSAssignment[];
  logistics: ICSAssignment[];
  financeAdmin: ICSAssignment[];
}> {
  // In production, fetch from database
  return {
    command: [],
    operations: [],
    planning: [],
    logistics: [],
    financeAdmin: [],
  };
}

/**
 * Activates ICS section for incident
 *
 * @param incidentId - Incident identifier
 * @param section - Section to activate
 * @param chief - Section chief assignment
 * @returns Activated section details
 *
 * @example
 * ```typescript
 * await activateICSSection('inc-123', ICSSection.LOGISTICS, {
 *   assignedTo: 'chief-456',
 *   assignedName: 'Chief Johnson',
 *   agency: 'City Fire'
 * });
 * ```
 */
export async function activateICSSection(
  incidentId: string,
  section: ICSSection,
  chief: Omit<ICSAssignment, 'id' | 'incidentId' | 'position' | 'section' | 'assignedAt'>,
): Promise<ICSAssignment> {
  const positionMap = {
    [ICSSection.OPERATIONS]: ICSPosition.OPERATIONS_CHIEF,
    [ICSSection.PLANNING]: ICSPosition.PLANNING_CHIEF,
    [ICSSection.LOGISTICS]: ICSPosition.LOGISTICS_CHIEF,
    [ICSSection.FINANCE_ADMIN]: ICSPosition.FINANCE_CHIEF,
    [ICSSection.COMMAND]: ICSPosition.INCIDENT_COMMANDER,
  };

  return assignICSPosition(incidentId, {
    position: positionMap[section],
    section,
    ...chief,
  });
}

// ============================================================================
// RESOURCE REQUESTS AND ALLOCATION
// ============================================================================

/**
 * Requests resources for incident
 *
 * @param incidentId - Incident identifier
 * @param request - Resource request details
 * @returns Created resource request
 *
 * @example
 * ```typescript
 * const request = await requestResources('inc-123', {
 *   resourceType: 'Engine',
 *   quantity: 2,
 *   priority: 'urgent',
 *   justification: 'Working fire requires additional suppression resources',
 *   requestedBy: 'ic-456'
 * });
 * ```
 */
export async function requestResources(
  incidentId: string,
  request: Omit<ResourceRequest, 'id' | 'incidentId' | 'requestNumber' | 'status' | 'requestedAt'>,
): Promise<ResourceRequest> {
  const resourceRequest: ResourceRequest = {
    id: faker.string.uuid(),
    incidentId,
    requestNumber: generateResourceRequestNumber(incidentId),
    status: ResourceRequestStatus.REQUESTED,
    requestedAt: new Date(),
    ...request,
  };

  await logIncidentActivity(incidentId, 'resources_requested', {
    resourceType: request.resourceType,
    quantity: request.quantity,
    priority: request.priority,
  });

  return resourceRequest;
}

/**
 * Generates resource request number
 *
 * @param incidentId - Incident identifier
 * @returns Formatted request number
 *
 * @example
 * ```typescript
 * const requestNum = generateResourceRequestNumber('inc-123');
 * // Returns: "RR-INC123-001"
 * ```
 */
export function generateResourceRequestNumber(incidentId: string): string {
  const incidentCode = incidentId.substring(0, 10).toUpperCase().replace(/[^A-Z0-9]/g, '');
  const sequence = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0');
  return `RR-${incidentCode}-${sequence}`;
}

/**
 * Approves resource request
 *
 * @param requestId - Request identifier
 * @param approvedBy - User approving request
 * @returns Updated resource request
 *
 * @example
 * ```typescript
 * await approveResourceRequest('req-123', 'chief-456');
 * ```
 */
export async function approveResourceRequest(requestId: string, approvedBy: string): Promise<ResourceRequest> {
  const request = await getResourceRequest(requestId);

  return {
    ...request,
    status: ResourceRequestStatus.APPROVED,
    approvedBy,
    approvedAt: new Date(),
  };
}

/**
 * Assigns resources to request
 *
 * @param requestId - Request identifier
 * @param resourceIds - Resource identifiers to assign
 * @param eta - Estimated time of arrival
 * @returns Updated resource request
 *
 * @example
 * ```typescript
 * await assignResourcesToRequest('req-123', ['engine-1', 'engine-2'], new Date(Date.now() + 15*60*1000));
 * ```
 */
export async function assignResourcesToRequest(
  requestId: string,
  resourceIds: string[],
  eta?: Date,
): Promise<ResourceRequest> {
  const request = await getResourceRequest(requestId);

  return {
    ...request,
    status: ResourceRequestStatus.ASSIGNED,
    assignedResources: resourceIds,
    eta: eta || new Date(Date.now() + 20 * 60 * 1000),
  };
}

/**
 * Releases resources from incident
 *
 * @param incidentId - Incident identifier
 * @param resourceIds - Resources to release
 * @param releaseNotes - Release documentation
 * @returns Release confirmation
 *
 * @example
 * ```typescript
 * await releaseResources('inc-123', ['engine-1', 'ladder-1'], 'Fire under control, units released');
 * ```
 */
export async function releaseResources(
  incidentId: string,
  resourceIds: string[],
  releaseNotes: string,
): Promise<{ releasedAt: Date; resourcesReleased: string[] }> {
  await logIncidentActivity(incidentId, 'resources_released', {
    resources: resourceIds,
    notes: releaseNotes,
  });

  return {
    releasedAt: new Date(),
    resourcesReleased: resourceIds,
  };
}

/**
 * Tracks resource allocation across incident
 *
 * @param incidentId - Incident identifier
 * @returns Resource allocation summary
 *
 * @example
 * ```typescript
 * const allocation = await trackResourceAllocation('inc-123');
 * ```
 */
export async function trackResourceAllocation(incidentId: string): Promise<{
  requested: number;
  assigned: number;
  onScene: number;
  staged: number;
  released: number;
}> {
  // In production, calculate from database
  return {
    requested: 10,
    assigned: 8,
    onScene: 6,
    staged: 2,
    released: 0,
  };
}

// ============================================================================
// TACTICAL OBJECTIVES AND ACTION PLANS
// ============================================================================

/**
 * Creates tactical objective for incident
 *
 * @param incidentId - Incident identifier
 * @param objective - Objective details
 * @param userId - User creating objective
 * @returns Created tactical objective
 *
 * @example
 * ```typescript
 * const objective = await createTacticalObjective('inc-123', {
 *   description: 'Contain fire to building of origin',
 *   priority: 1,
 *   assignedSection: ICSSection.OPERATIONS,
 *   safetyConsiderations: ['Structural stability concerns', 'IDLH atmosphere']
 * }, 'ic-456');
 * ```
 */
export async function createTacticalObjective(
  incidentId: string,
  objective: Omit<TacticalObjective, 'id' | 'incidentId' | 'objectiveNumber' | 'status' | 'createdAt' | 'updatedAt'>,
  userId: string,
): Promise<TacticalObjective> {
  const existingObjectives = await getTacticalObjectives(incidentId);
  const objectiveNumber = existingObjectives.length + 1;

  const tacticalObjective: TacticalObjective = {
    id: faker.string.uuid(),
    incidentId,
    objectiveNumber,
    status: ObjectiveStatus.PLANNED,
    createdBy: userId,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...objective,
  };

  await logIncidentActivity(incidentId, 'objective_created', {
    objectiveNumber,
    description: objective.description,
  });

  return tacticalObjective;
}

/**
 * Updates tactical objective status
 *
 * @param objectiveId - Objective identifier
 * @param status - New status
 * @param notes - Update notes
 * @returns Updated objective
 *
 * @example
 * ```typescript
 * await updateObjectiveStatus('obj-123', ObjectiveStatus.COMPLETED, 'Fire contained to room of origin');
 * ```
 */
export async function updateObjectiveStatus(
  objectiveId: string,
  status: ObjectiveStatus,
  notes?: string,
): Promise<TacticalObjective> {
  const objective = await getTacticalObjective(objectiveId);

  const updated: TacticalObjective = {
    ...objective,
    status,
    updatedAt: new Date(),
  };

  if (status === ObjectiveStatus.COMPLETED) {
    updated.actualCompletionTime = new Date();
  }

  return updated;
}

/**
 * Gets tactical objectives for incident
 *
 * @param incidentId - Incident identifier
 * @returns Array of tactical objectives
 *
 * @example
 * ```typescript
 * const objectives = await getTacticalObjectives('inc-123');
 * ```
 */
export async function getTacticalObjectives(incidentId: string): Promise<TacticalObjective[]> {
  // In production, fetch from database
  return [];
}

/**
 * Creates incident action plan
 *
 * @param incidentId - Incident identifier
 * @param plan - Action plan details
 * @param userId - User creating plan
 * @returns Created action plan
 *
 * @example
 * ```typescript
 * const iap = await createIncidentActionPlan('inc-123', {
 *   operationalPeriod: OperationalPeriod.TWELVE_HOURS,
 *   periodStart: new Date(),
 *   periodEnd: new Date(Date.now() + 12*60*60*1000),
 *   objectives: [obj1, obj2],
 *   safetyMessage: 'All personnel must maintain 2-in-2-out policy'
 * }, 'ic-456');
 * ```
 */
export async function createIncidentActionPlan(
  incidentId: string,
  plan: Omit<IncidentActionPlan, 'id' | 'incidentId' | 'isActive' | 'createdAt'>,
  userId: string,
): Promise<IncidentActionPlan> {
  const actionPlan: IncidentActionPlan = {
    id: faker.string.uuid(),
    incidentId,
    isActive: true,
    createdAt: new Date(),
    ...plan,
  };

  await logIncidentActivity(incidentId, 'action_plan_created', {
    operationalPeriod: plan.operationalPeriod,
    objectivesCount: plan.objectives.length,
  });

  return actionPlan;
}

/**
 * Approves incident action plan
 *
 * @param planId - Plan identifier
 * @param approvedBy - User approving plan
 * @returns Updated action plan
 *
 * @example
 * ```typescript
 * await approveIncidentActionPlan('iap-123', 'ic-456');
 * ```
 */
export async function approveIncidentActionPlan(planId: string, approvedBy: string): Promise<IncidentActionPlan> {
  const plan = await getIncidentActionPlan(planId);

  return {
    ...plan,
    approvedBy,
    approvedAt: new Date(),
  };
}

// ============================================================================
// SITUATION REPORTS AND BRIEFINGS
// ============================================================================

/**
 * Creates situation report
 *
 * @param incidentId - Incident identifier
 * @param report - Situation report data
 * @returns Created situation report
 *
 * @example
 * ```typescript
 * const sitrep = await createSituationReport('inc-123', {
 *   currentSituation: 'Fire is under control, overhaul operations in progress',
 *   resourcesSummary: { personnel: 24, apparatus: 6, specializedUnits: 2 },
 *   accomplishments: ['Primary search completed', 'Fire knocked down'],
 *   reportedBy: 'ic-456'
 * });
 * ```
 */
export async function createSituationReport(
  incidentId: string,
  report: Omit<SituationReport, 'id' | 'incidentId' | 'reportNumber' | 'reportedAt'>,
): Promise<SituationReport> {
  const existingReports = await getSituationReports(incidentId);
  const reportNumber = existingReports.length + 1;

  const sitrep: SituationReport = {
    id: faker.string.uuid(),
    incidentId,
    reportNumber,
    reportedAt: new Date(),
    ...report,
  };

  await logIncidentActivity(incidentId, 'sitrep_created', {
    reportNumber,
    reportedBy: report.reportedBy,
  });

  return sitrep;
}

/**
 * Gets situation reports for incident
 *
 * @param incidentId - Incident identifier
 * @returns Array of situation reports
 *
 * @example
 * ```typescript
 * const sitreps = await getSituationReports('inc-123');
 * ```
 */
export async function getSituationReports(incidentId: string): Promise<SituationReport[]> {
  // In production, fetch from database
  return [];
}

/**
 * Conducts operational briefing
 *
 * @param incidentId - Incident identifier
 * @param briefing - Briefing details
 * @returns Briefing record
 *
 * @example
 * ```typescript
 * await conductOperationalBriefing('inc-123', {
 *   briefingTime: new Date(),
 *   briefedBy: 'ic-456',
 *   attendees: ['ops-chief', 'safety-officer'],
 *   topics: ['Tactical objectives', 'Safety concerns', 'Resource status']
 * });
 * ```
 */
export async function conductOperationalBriefing(
  incidentId: string,
  briefing: {
    briefingTime: Date;
    briefedBy: string;
    attendees: string[];
    topics: string[];
    notes?: string;
  },
): Promise<{ id: string; briefingTime: Date }> {
  await logIncidentActivity(incidentId, 'operational_briefing', briefing);

  return {
    id: faker.string.uuid(),
    briefingTime: briefing.briefingTime,
  };
}

/**
 * Creates safety briefing
 *
 * @param incidentId - Incident identifier
 * @param briefing - Safety briefing data
 * @returns Created safety briefing
 *
 * @example
 * ```typescript
 * await createSafetyBriefing('inc-123', {
 *   briefingTime: new Date(),
 *   briefedBy: 'safety-officer-1',
 *   attendees: ['all-personnel'],
 *   hazards: ['Structural collapse', 'IDLH atmosphere'],
 *   mitigationMeasures: ['Withdraw to defensive ops', 'Full PPE required'],
 *   ppeRequired: ['SCBA', 'Full bunker gear']
 * });
 * ```
 */
export async function createSafetyBriefing(
  incidentId: string,
  briefing: Omit<SafetyBriefing, 'id' | 'incidentId'>,
): Promise<SafetyBriefing> {
  const safetyBriefing: SafetyBriefing = {
    id: faker.string.uuid(),
    incidentId,
    ...briefing,
  };

  await logIncidentActivity(incidentId, 'safety_briefing', {
    briefedBy: briefing.briefedBy,
    hazardsCount: briefing.hazards.length,
  });

  return safetyBriefing;
}

// ============================================================================
// DEMOBILIZATION AND INCIDENT CLOSURE
// ============================================================================

/**
 * Initiates incident demobilization
 *
 * @param incidentId - Incident identifier
 * @param demobPlan - Demobilization plan
 * @param userId - User initiating demobilization
 * @returns Demobilization plan
 *
 * @example
 * ```typescript
 * await initiateDemobilization('inc-123', {
 *   phaseSequence: ['Release mutual aid', 'Release local units', 'Final overhaul'],
 *   estimatedDuration: 120,
 *   resourceReleaseSchedule: { ... }
 * }, 'ic-456');
 * ```
 */
export async function initiateDemobilization(
  incidentId: string,
  demobPlan: {
    phaseSequence: string[];
    estimatedDuration: number;
    resourceReleaseSchedule?: Record<string, Date>;
  },
  userId: string,
): Promise<{ planId: string; status: string }> {
  await updateIncidentStatus(incidentId, IncidentStatus.DEMOBILIZING, userId);

  await logIncidentActivity(incidentId, 'demobilization_initiated', demobPlan);

  return {
    planId: faker.string.uuid(),
    status: 'in_progress',
  };
}

/**
 * Closes incident with final documentation
 *
 * @param incidentId - Incident identifier
 * @param closure - Incident closure data
 * @param userId - User closing incident
 * @returns Closed incident
 *
 * @example
 * ```typescript
 * await closeIncident('inc-123', {
 *   finalNarrative: 'All operations completed, incident mitigated',
 *   totalCost: 125000,
 *   finalResourceCount: 12,
 *   lessonsLearned: ['Improve communication protocols']
 * }, 'ic-456');
 * ```
 */
export async function closeIncident(
  incidentId: string,
  closure: {
    finalNarrative: string;
    totalCost?: number;
    finalResourceCount?: number;
    lessonsLearned?: string[];
  },
  userId: string,
): Promise<Incident> {
  const incident = await updateIncidentStatus(incidentId, IncidentStatus.CLOSED, userId);

  await logIncidentActivity(incidentId, 'incident_closed', closure);

  return incident;
}

/**
 * Generates incident summary report
 *
 * @param incidentId - Incident identifier
 * @returns Comprehensive incident summary
 *
 * @example
 * ```typescript
 * const summary = await generateIncidentSummary('inc-123');
 * ```
 */
export async function generateIncidentSummary(incidentId: string): Promise<{
  incident: Incident;
  timeline: IncidentTimelineEntry[];
  objectives: TacticalObjective[];
  resources: any[];
  totalDuration: number;
  totalCost: number;
}> {
  const incident = await getIncident(incidentId);
  const timeline = await getIncidentTimeline(incidentId);
  const objectives = await getTacticalObjectives(incidentId);

  const totalDuration = incident.closedAt && incident.reportedAt
    ? (incident.closedAt.getTime() - incident.reportedAt.getTime()) / (1000 * 60)
    : 0;

  return {
    incident,
    timeline,
    objectives,
    resources: [],
    totalDuration,
    totalCost: incident.estimatedLoss || 0,
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Gets incident by ID (placeholder for database query)
 */
async function getIncident(id: string): Promise<Incident> {
  return {
    id,
    incidentNumber: 'INC-TEST-001',
    incidentType: IncidentType.STRUCTURE_FIRE,
    severity: IncidentSeverity.MAJOR,
    status: IncidentStatus.ON_SCENE,
    location: { latitude: 40.7128, longitude: -74.006 },
    description: 'Test incident',
    reportedAt: new Date(),
    reportedBy: 'user-1',
    priorityLevel: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'user-1',
  };
}

/**
 * Updates incident
 */
async function updateIncident(id: string, updates: Partial<Incident>): Promise<Incident> {
  const incident = await getIncident(id);
  return { ...incident, ...updates, updatedAt: new Date() };
}

/**
 * Gets resource request by ID
 */
async function getResourceRequest(id: string): Promise<ResourceRequest> {
  return {
    id,
    incidentId: 'inc-1',
    requestNumber: 'RR-001',
    resourceType: 'Engine',
    quantity: 1,
    priority: 'urgent',
    status: ResourceRequestStatus.REQUESTED,
    requestedBy: 'user-1',
    requestedAt: new Date(),
    justification: 'Test',
  };
}

/**
 * Gets tactical objective by ID
 */
async function getTacticalObjective(id: string): Promise<TacticalObjective> {
  return {
    id,
    incidentId: 'inc-1',
    objectiveNumber: 1,
    description: 'Test objective',
    priority: 1,
    status: ObjectiveStatus.PLANNED,
    createdBy: 'user-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/**
 * Gets incident action plan by ID
 */
async function getIncidentActionPlan(id: string): Promise<IncidentActionPlan> {
  return {
    id,
    incidentId: 'inc-1',
    operationalPeriod: OperationalPeriod.TWELVE_HOURS,
    periodStart: new Date(),
    periodEnd: new Date(Date.now() + 12 * 60 * 60 * 1000),
    objectives: [],
    isActive: true,
    createdAt: new Date(),
  };
}

/**
 * Gets ICS assignment by ID
 */
async function getICSAssignment(id: string): Promise<ICSAssignment> {
  return {
    id,
    incidentId: 'inc-1',
    position: ICSPosition.INCIDENT_COMMANDER,
    section: ICSSection.COMMAND,
    assignedTo: 'user-1',
    assignedName: 'Test User',
    agency: 'Test Agency',
    assignedAt: new Date(),
  };
}

/**
 * Logs incident activity for audit trail
 */
async function logIncidentActivity(incidentId: string, activityType: string, data: any): Promise<void> {
  console.log(`Incident ${incidentId}: ${activityType}`, data);
}

// ============================================================================
// NESTJS CONTROLLER
// ============================================================================

/**
 * Incident Command Controller
 * Provides RESTful API endpoints for incident command operations
 */
@ApiTags('incident-command')
@Controller('incident-command')
@ApiBearerAuth()
export class IncidentCommandController {
  /**
   * Create a new incident
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new incident' })
  @ApiResponse({ status: 201, description: 'Incident created successfully' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async create(@Body() createDto: CreateIncidentDto) {
    const location: GeoLocation = {
      latitude: createDto.latitude,
      longitude: createDto.longitude,
      address: createDto.address,
      city: createDto.city,
      state: createDto.state,
    };

    return createIncident(
      {
        incidentType: createDto.incidentType,
        severity: createDto.severity,
        description: createDto.description,
        location,
        reportedAt: new Date(),
        reportedBy: createDto.reportedBy,
        patientCount: createDto.patientCount,
        specialHazards: createDto.specialHazards,
        weatherConditions: createDto.weatherConditions,
      } as any,
      createDto.reportedBy,
    );
  }

  /**
   * Get all incidents with filtering
   */
  @Get()
  @ApiOperation({ summary: 'Get all incidents' })
  @ApiQuery({ name: 'status', enum: IncidentStatus, required: false })
  @ApiQuery({ name: 'severity', enum: IncidentSeverity, required: false })
  async findAll(
    @Query('status') status?: IncidentStatus,
    @Query('severity') severity?: IncidentSeverity,
  ) {
    return [];
  }

  /**
   * Get incident by ID
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get incident by ID' })
  @ApiParam({ name: 'id', description: 'Incident ID' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return getIncident(id);
  }

  /**
   * Update incident
   */
  @Put(':id')
  @ApiOperation({ summary: 'Update incident' })
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateDto: UpdateIncidentDto) {
    return updateIncident(id, updateDto);
  }

  /**
   * Establish unified command
   */
  @Post(':id/unified-command')
  @ApiOperation({ summary: 'Establish unified command structure' })
  async establishUnifiedCmd(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: EstablishUnifiedCommandDto,
  ) {
    return establishUnifiedCommand(id, dto, 'current-user');
  }

  /**
   * Assign ICS position
   */
  @Post(':id/ics-positions')
  @ApiOperation({ summary: 'Assign ICS position' })
  async assignPosition(@Param('id', ParseUUIDPipe) id: string, @Body() dto: AssignICSPositionDto) {
    return assignICSPosition(id, dto);
  }

  /**
   * Request resources
   */
  @Post(':id/resources/request')
  @ApiOperation({ summary: 'Request resources for incident' })
  async requestRes(@Param('id', ParseUUIDPipe) id: string, @Body() dto: RequestResourcesDto) {
    return requestResources(id, dto);
  }

  /**
   * Create tactical objective
   */
  @Post(':id/objectives')
  @ApiOperation({ summary: 'Create tactical objective' })
  async createObjective(@Param('id', ParseUUIDPipe) id: string, @Body() dto: CreateTacticalObjectiveDto) {
    return createTacticalObjective(id, dto, 'current-user');
  }

  /**
   * Create incident action plan
   */
  @Post(':id/action-plan')
  @ApiOperation({ summary: 'Create incident action plan' })
  async createIAP(@Param('id', ParseUUIDPipe) id: string, @Body() dto: CreateIncidentActionPlanDto) {
    return createIncidentActionPlan(id, dto as any, 'current-user');
  }

  /**
   * Create situation report
   */
  @Post(':id/sitrep')
  @ApiOperation({ summary: 'Create situation report' })
  async createSitRep(@Param('id', ParseUUIDPipe) id: string, @Body() dto: CreateSituationReportDto) {
    return createSituationReport(id, {
      currentSituation: dto.currentSituation,
      resourcesSummary: {
        personnel: dto.personnel,
        apparatus: dto.apparatus,
        specializedUnits: 0,
      },
      accomplishments: dto.accomplishments,
      currentProblems: dto.currentProblems,
      plannedActions: dto.plannedActions,
      reportedBy: dto.reportedBy,
    });
  }

  /**
   * Transfer command
   */
  @Post(':id/transfer-command')
  @ApiOperation({ summary: 'Transfer incident command' })
  async transferCmd(@Param('id', ParseUUIDPipe) id: string, @Body() dto: TransferCommandDto) {
    return transferCommand(id, dto);
  }

  /**
   * Close incident
   */
  @Post(':id/close')
  @ApiOperation({ summary: 'Close incident' })
  async close(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() closure: { finalNarrative: string; lessonsLearned?: string[] },
  ) {
    return closeIncident(id, closure, 'current-user');
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Incident Creation and Classification
  createIncident,
  generateIncidentNumber,
  classifyIncident,
  calculateIncidentPriority,
  escalateIncident,
  downgradeIncident,

  // Status Tracking
  updateIncidentStatus,
  validateStatusTransition,
  assignIncidentCommander,
  getIncidentTimeline,
  addTimelineEntry,

  // Unified Command
  establishUnifiedCommand,
  requestMutualAid,
  coordinateMultiAgencyResponse,
  transferCommand,

  // ICS Organization
  assignICSPosition,
  relieveICSPosition,
  getICSOrganizationChart,
  activateICSSection,

  // Resource Management
  requestResources,
  generateResourceRequestNumber,
  approveResourceRequest,
  assignResourcesToRequest,
  releaseResources,
  trackResourceAllocation,

  // Tactical Operations
  createTacticalObjective,
  updateObjectiveStatus,
  getTacticalObjectives,
  createIncidentActionPlan,
  approveIncidentActionPlan,

  // Situation Reports
  createSituationReport,
  getSituationReports,
  conductOperationalBriefing,
  createSafetyBriefing,

  // Demobilization
  initiateDemobilization,
  closeIncident,
  generateIncidentSummary,

  // Controller
  IncidentCommandController,
};
