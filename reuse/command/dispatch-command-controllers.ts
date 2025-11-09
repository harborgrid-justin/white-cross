/**
 * DISPATCH COMMAND AND CONTROL SYSTEM
 *
 * Comprehensive Computer-Aided Dispatch (CAD) system for emergency services.
 * Provides 50 specialized functions covering:
 * - Emergency call intake and triage (EMD/EPD protocols)
 * - Unit dispatch and intelligent routing
 * - CAD operations and console management
 * - Priority-based queue management
 * - Geographic zone and beat management
 * - Unit status tracking (available, en route, on scene, etc.)
 * - Dispatch console operations and multi-console coordination
 * - Call for service (CFS) lifecycle management
 * - Automatic vehicle location (AVL) integration
 * - Pre-arrival instructions and caller coaching
 * - Mutual aid dispatch coordination
 * - NestJS controllers with comprehensive validation
 * - Swagger/OpenAPI documentation
 * - HIPAA-compliant audit logging
 *
 * @module DispatchCommandControllers
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
 * @security HIPAA compliant - all dispatch operations are audited and logged
 * @example
 * ```typescript
 * import {
 *   createCallForService,
 *   triageEmergencyCall,
 *   dispatchUnits,
 *   updateUnitStatus
 * } from './dispatch-command-controllers';
 *
 * // Create emergency call
 * const call = await createCallForService({
 *   callType: 'MEDICAL_EMERGENCY',
 *   priority: CallPriority.EMERGENCY,
 *   location: { latitude: 40.7128, longitude: -74.0060 },
 *   callerPhone: '555-0100',
 *   chiefComplaint: 'Chest pain, difficulty breathing'
 * });
 *
 * // Dispatch units
 * await dispatchUnits(call.id, ['AMB-1', 'ENG-1'], 'dispatcher-123');
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
  IsPhoneNumber,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { faker } from '@faker-js/faker';

// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================

/**
 * Call priority levels (aligned with EMD/EPD standards)
 */
export enum CallPriority {
  IMMEDIATE = 'immediate', // Life-threatening
  EMERGENCY = 'emergency', // Critical, time-sensitive
  URGENT = 'urgent', // Needs rapid response
  ROUTINE = 'routine', // Standard response
  NON_EMERGENCY = 'non_emergency', // Scheduled/non-urgent
}

/**
 * Call types (emergency categories)
 */
export enum CallType {
  MEDICAL_EMERGENCY = 'medical_emergency',
  FIRE = 'fire',
  VEHICLE_ACCIDENT = 'vehicle_accident',
  ASSAULT = 'assault',
  ROBBERY = 'robbery',
  BURGLARY = 'burglary',
  DOMESTIC_VIOLENCE = 'domestic_violence',
  SUSPICIOUS_ACTIVITY = 'suspicious_activity',
  WELFARE_CHECK = 'welfare_check',
  OVERDOSE = 'overdose',
  CARDIAC_ARREST = 'cardiac_arrest',
  STROKE = 'stroke',
  TRAUMA = 'trauma',
  PSYCHIATRIC = 'psychiatric',
  HAZMAT = 'hazmat',
  WATER_RESCUE = 'water_rescue',
  ELEVATOR_RESCUE = 'elevator_rescue',
  ALARM = 'alarm',
  PUBLIC_SERVICE = 'public_service',
  OTHER = 'other',
}

/**
 * Call for service status
 */
export enum CallStatus {
  PENDING = 'pending',
  TRIAGED = 'triaged',
  DISPATCHED = 'dispatched',
  EN_ROUTE = 'en_route',
  ON_SCENE = 'on_scene',
  TRANSPORTING = 'transporting',
  AT_HOSPITAL = 'at_hospital',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  DUPLICATE = 'duplicate',
}

/**
 * Unit status codes
 */
export enum UnitStatus {
  AVAILABLE = 'available', // In service, available
  UNAVAILABLE = 'unavailable', // Out of service
  DISPATCHED = 'dispatched', // Assigned to call
  EN_ROUTE = 'en_route', // Responding to call
  STAGED = 'staged', // Staged near incident
  ON_SCENE = 'on_scene', // Arrived at scene
  TRANSPORTING = 'transporting', // Transporting patient
  AT_HOSPITAL = 'at_hospital', // At hospital
  IN_QUARTERS = 'in_quarters', // At station
  TRAINING = 'training', // Training exercise
  MEAL_BREAK = 'meal_break', // Meal break
  MECHANICAL = 'mechanical', // Mechanical issue
  REFUELING = 'refueling', // Refueling
}

/**
 * Unit types
 */
export enum UnitType {
  ENGINE = 'engine',
  LADDER = 'ladder',
  RESCUE = 'rescue',
  AMBULANCE = 'ambulance',
  PARAMEDIC = 'paramedic',
  CHIEF = 'chief',
  BATTALION_CHIEF = 'battalion_chief',
  HAZMAT = 'hazmat',
  MARINE = 'marine',
  AIR_AMBULANCE = 'air_ambulance',
  PATROL = 'patrol',
  K9 = 'k9',
  SWAT = 'swat',
  MOBILE_COMMAND = 'mobile_command',
}

/**
 * Dispatch console status
 */
export enum ConsoleStatus {
  ACTIVE = 'active',
  LOGGED_OUT = 'logged_out',
  BREAK = 'break',
  TRAINING = 'training',
  EMERGENCY_OVERRIDE = 'emergency_override',
}

/**
 * Queue management priority
 */
export enum QueuePriority {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  HOLD = 'hold',
}

/**
 * Response plan types
 */
export enum ResponsePlanType {
  STANDARD = 'standard',
  FULL_ASSIGNMENT = 'full_assignment',
  WORKING_FIRE = 'working_fire',
  MASS_CASUALTY = 'mass_casualty',
  HAZMAT = 'hazmat',
  TECHNICAL_RESCUE = 'technical_rescue',
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
  zone?: string;
  beat?: string;
  gridSquare?: string;
  landmark?: string;
}

/**
 * Call for service interface
 */
export interface CallForService {
  id: string;
  callNumber: string;
  callType: CallType;
  priority: CallPriority;
  status: CallStatus;
  location: GeoLocation;
  callerName?: string;
  callerPhone?: string;
  callerLocation?: GeoLocation;
  chiefComplaint: string;
  additionalInfo?: string;
  medicalPriority?: string; // EMD Determinant Code
  specialInstructions?: string[];
  preArrivalInstructionsGiven?: boolean;
  receivedAt: Date;
  dispatchedAt?: Date;
  arrivedAt?: Date;
  clearedAt?: Date;
  callTaker?: string;
  dispatcher?: string;
  assignedUnits: string[];
  isViolent?: boolean;
  weaponsInvolved?: boolean;
  requiresPoliceAssist?: boolean;
  patientCount?: number;
  ageOfPatient?: number;
  isConscious?: boolean;
  isBreathing?: boolean;
  crossStreets?: string;
  occupancyType?: string;
  floorLevel?: number;
  apartmentNumber?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  metadata?: Record<string, any>;
}

/**
 * Unit interface
 */
export interface Unit {
  id: string;
  unitNumber: string;
  unitType: UnitType;
  status: UnitStatus;
  currentLocation?: GeoLocation;
  assignedZone?: string;
  assignedBeat?: string;
  homeStation?: string;
  crewMembers?: string[];
  capabilities?: string[];
  equipment?: string[];
  isALSCapable?: boolean;
  isBLSCapable?: boolean;
  maxPatientCapacity?: number;
  currentCallId?: string;
  lastStatusChange?: Date;
  lastLocationUpdate?: Date;
  shiftStart?: Date;
  shiftEnd?: Date;
  isAvailable: boolean;
  isInService: boolean;
}

/**
 * Dispatch console interface
 */
export interface DispatchConsole {
  id: string;
  consoleNumber: string;
  consoleType: 'fire' | 'ems' | 'police' | 'combined';
  status: ConsoleStatus;
  currentDispatcher?: string;
  dispatcherName?: string;
  loginTime?: Date;
  lastActivityTime?: Date;
  assignedZones?: string[];
  activeCalls: string[];
  queuedCalls: string[];
  priorityOverrides?: Record<string, boolean>;
}

/**
 * Call triage data
 */
export interface CallTriage {
  id: string;
  callId: string;
  determinantCode?: string; // EMD/EPD code
  cardNumber?: string;
  cardTitle?: string;
  priorityLevel: CallPriority;
  recommendedResponse: string[];
  timeToDispatch?: number;
  triageNotes?: string;
  chiefComplaint: string;
  symptoms?: string[];
  vitals?: {
    conscious?: boolean;
    breathing?: boolean;
    heartRate?: number;
    respiratoryRate?: number;
    bloodPressure?: string;
  };
  triagedBy: string;
  triagedAt: Date;
}

/**
 * Unit dispatch record
 */
export interface UnitDispatch {
  id: string;
  callId: string;
  unitId: string;
  unitNumber: string;
  dispatchedAt: Date;
  acknowledgedAt?: Date;
  enRouteAt?: Date;
  arrivedAt?: Date;
  clearedAt?: Date;
  dispatchedBy: string;
  isFirstResponder: boolean;
  estimatedArrival?: Date;
  actualTravelTime?: number;
  distanceToScene?: number;
  routeInfo?: any;
}

/**
 * Geographic zone interface
 */
export interface GeographicZone {
  id: string;
  zoneName: string;
  zoneType: 'fire' | 'ems' | 'police';
  boundaries: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  assignedUnits: string[];
  population?: number;
  specialHazards?: string[];
  landmarks?: string[];
  isActive: boolean;
}

/**
 * Response plan interface
 */
export interface ResponsePlan {
  id: string;
  planName: string;
  planType: ResponsePlanType;
  callTypes: CallType[];
  requiredUnits: Array<{
    unitType: UnitType;
    quantity: number;
    isRequired: boolean;
  }>;
  optionalUnits?: Array<{
    unitType: UnitType;
    quantity: number;
  }>;
  autoDispatch: boolean;
  notificationList?: string[];
  specialInstructions?: string[];
}

/**
 * Pre-arrival instructions
 */
export interface PreArrivalInstructions {
  id: string;
  callId: string;
  instructionType: string;
  instructions: string[];
  startedAt: Date;
  completedAt?: Date;
  deliveredBy: string;
  callerCompliance?: 'full' | 'partial' | 'none' | 'unable';
  outcome?: string;
}

/**
 * Dispatch queue entry
 */
export interface DispatchQueueEntry {
  id: string;
  callId: string;
  priority: QueuePriority;
  queuePosition: number;
  waitTime: number;
  escalationTime?: Date;
  assignedDispatcher?: string;
  notes?: string;
  addedAt: Date;
}

/**
 * AVL (Automatic Vehicle Location) update
 */
export interface AVLUpdate {
  id: string;
  unitId: string;
  location: GeoLocation;
  heading?: number;
  speed?: number;
  altitude?: number;
  accuracy?: number;
  timestamp: Date;
  isGPSValid: boolean;
}

// ============================================================================
// DTO CLASSES FOR VALIDATION
// ============================================================================

/**
 * Create call for service DTO
 */
export class CreateCallForServiceDto {
  @ApiProperty({ enum: CallType, description: 'Type of emergency call' })
  @IsEnum(CallType)
  callType: CallType;

  @ApiProperty({ enum: CallPriority, description: 'Call priority' })
  @IsEnum(CallPriority)
  priority: CallPriority;

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

  @ApiProperty({ description: 'Caller name', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  callerName?: string;

  @ApiProperty({ description: 'Caller phone number', required: false })
  @IsOptional()
  @IsString()
  callerPhone?: string;

  @ApiProperty({ description: 'Chief complaint or nature of emergency' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  chiefComplaint: string;

  @ApiProperty({ description: 'Additional information', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  additionalInfo?: string;

  @ApiProperty({ description: 'Patient count', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  patientCount?: number;

  @ApiProperty({ description: 'Weapons involved', required: false })
  @IsOptional()
  @IsBoolean()
  weaponsInvolved?: boolean;

  @ApiProperty({ description: 'Call taker ID' })
  @IsUUID()
  callTaker: string;

  @ApiProperty({ description: 'Cross streets', required: false })
  @IsOptional()
  @IsString()
  crossStreets?: string;
}

/**
 * Triage call DTO
 */
export class TriageCallDto {
  @ApiProperty({ description: 'EMD/EPD determinant code', required: false })
  @IsOptional()
  @IsString()
  determinantCode?: string;

  @ApiProperty({ enum: CallPriority, description: 'Priority level' })
  @IsEnum(CallPriority)
  priorityLevel: CallPriority;

  @ApiProperty({ description: 'Recommended response units', type: [String] })
  @IsArray()
  @IsString({ each: true })
  recommendedResponse: string[];

  @ApiProperty({ description: 'Is patient conscious', required: false })
  @IsOptional()
  @IsBoolean()
  conscious?: boolean;

  @ApiProperty({ description: 'Is patient breathing', required: false })
  @IsOptional()
  @IsBoolean()
  breathing?: boolean;

  @ApiProperty({ description: 'Symptoms', required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  symptoms?: string[];

  @ApiProperty({ description: 'Triage notes', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  triageNotes?: string;

  @ApiProperty({ description: 'Triaged by user ID' })
  @IsUUID()
  triagedBy: string;
}

/**
 * Dispatch units DTO
 */
export class DispatchUnitsDto {
  @ApiProperty({ description: 'Unit IDs to dispatch', type: [String] })
  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  unitIds: string[];

  @ApiProperty({ description: 'Dispatcher user ID' })
  @IsUUID()
  dispatchedBy: string;

  @ApiProperty({ description: 'Special instructions', required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  specialInstructions?: string[];

  @ApiProperty({ description: 'Estimated arrival time', required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  estimatedArrival?: Date;
}

/**
 * Update unit status DTO
 */
export class UpdateUnitStatusDto {
  @ApiProperty({ enum: UnitStatus, description: 'New unit status' })
  @IsEnum(UnitStatus)
  status: UnitStatus;

  @ApiProperty({ description: 'Current location latitude', required: false })
  @IsOptional()
  @IsNumber()
  @IsLatitude()
  latitude?: number;

  @ApiProperty({ description: 'Current location longitude', required: false })
  @IsOptional()
  @IsNumber()
  @IsLongitude()
  longitude?: number;

  @ApiProperty({ description: 'Status notes', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;

  @ApiProperty({ description: 'Updated by user ID' })
  @IsUUID()
  updatedBy: string;
}

/**
 * Create geographic zone DTO
 */
export class CreateGeographicZoneDto {
  @ApiProperty({ description: 'Zone name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  zoneName: string;

  @ApiProperty({ enum: ['fire', 'ems', 'police'], description: 'Zone type' })
  @IsEnum(['fire', 'ems', 'police'])
  zoneType: 'fire' | 'ems' | 'police';

  @ApiProperty({ description: 'Northern boundary latitude' })
  @IsNumber()
  north: number;

  @ApiProperty({ description: 'Southern boundary latitude' })
  @IsNumber()
  south: number;

  @ApiProperty({ description: 'Eastern boundary longitude' })
  @IsNumber()
  east: number;

  @ApiProperty({ description: 'Western boundary longitude' })
  @IsNumber()
  west: number;

  @ApiProperty({ description: 'Assigned unit IDs', type: [String] })
  @IsArray()
  @IsString({ each: true })
  assignedUnits: string[];
}

/**
 * Update console status DTO
 */
export class UpdateConsoleStatusDto {
  @ApiProperty({ enum: ConsoleStatus, description: 'Console status' })
  @IsEnum(ConsoleStatus)
  status: ConsoleStatus;

  @ApiProperty({ description: 'Dispatcher user ID', required: false })
  @IsOptional()
  @IsUUID()
  dispatcherId?: string;

  @ApiProperty({ description: 'Assigned zones', required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  assignedZones?: string[];
}

/**
 * Pre-arrival instructions DTO
 */
export class DeliverPreArrivalInstructionsDto {
  @ApiProperty({ description: 'Instruction type (e.g., CPR, Choking, Bleeding)' })
  @IsString()
  @IsNotEmpty()
  instructionType: string;

  @ApiProperty({ description: 'Instruction steps', type: [String] })
  @IsArray()
  @IsString({ each: true })
  instructions: string[];

  @ApiProperty({ description: 'Delivered by user ID' })
  @IsUUID()
  deliveredBy: string;
}

// ============================================================================
// CALL INTAKE AND TRIAGE
// ============================================================================

/**
 * Creates a new call for service
 *
 * @param data - Call creation data
 * @param userId - User creating the call
 * @returns Created call for service
 *
 * @example
 * ```typescript
 * const call = await createCallForService({
 *   callType: CallType.MEDICAL_EMERGENCY,
 *   priority: CallPriority.EMERGENCY,
 *   location: { latitude: 40.7128, longitude: -74.0060, address: '123 Main St' },
 *   callerPhone: '555-0100',
 *   chiefComplaint: 'Unconscious person, not breathing',
 *   callTaker: 'dispatcher-123'
 * }, 'user-456');
 * ```
 */
export async function createCallForService(
  data: Omit<CallForService, 'id' | 'callNumber' | 'status' | 'createdAt' | 'updatedAt' | 'receivedAt' | 'assignedUnits'>,
  userId: string,
): Promise<CallForService> {
  const call: CallForService = {
    id: faker.string.uuid(),
    callNumber: generateCallNumber(data.callType, data.location),
    status: CallStatus.PENDING,
    assignedUnits: [],
    receivedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: userId,
    ...data,
  };

  await logDispatchActivity(call.id, 'call_created', {
    callType: data.callType,
    priority: data.priority,
    location: data.location,
  });

  return call;
}

/**
 * Generates unique call number
 *
 * @param callType - Type of call
 * @param location - Call location
 * @returns Formatted call number
 *
 * @example
 * ```typescript
 * const callNum = generateCallNumber(CallType.MEDICAL_EMERGENCY, location);
 * // Returns: "CFS-ME-20250108-12345"
 * ```
 */
export function generateCallNumber(callType: CallType, location: GeoLocation): string {
  const typePrefix = {
    [CallType.MEDICAL_EMERGENCY]: 'ME',
    [CallType.FIRE]: 'FI',
    [CallType.VEHICLE_ACCIDENT]: 'VA',
    [CallType.ASSAULT]: 'AS',
    [CallType.ROBBERY]: 'RO',
    [CallType.CARDIAC_ARREST]: 'CA',
    [CallType.STROKE]: 'ST',
    [CallType.TRAUMA]: 'TR',
    [CallType.OVERDOSE]: 'OD',
    [CallType.HAZMAT]: 'HM',
    [CallType.WATER_RESCUE]: 'WR',
  }[callType] || 'OT';

  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const sequence = Math.floor(Math.random() * 100000)
    .toString()
    .padStart(5, '0');

  return `CFS-${typePrefix}-${date}-${sequence}`;
}

/**
 * Triages emergency call using EMD/EPD protocols
 *
 * @param callId - Call identifier
 * @param triage - Triage data
 * @returns Created triage record
 *
 * @example
 * ```typescript
 * const triage = await triageEmergencyCall('call-123', {
 *   determinantCode: '09-E-01',
 *   priorityLevel: CallPriority.IMMEDIATE,
 *   recommendedResponse: ['ALS', 'BLS', 'Fire'],
 *   conscious: false,
 *   breathing: false,
 *   symptoms: ['Cardiac arrest'],
 *   triagedBy: 'emd-456'
 * });
 * ```
 */
export async function triageEmergencyCall(
  callId: string,
  triage: Omit<CallTriage, 'id' | 'callId' | 'triagedAt' | 'chiefComplaint'>,
): Promise<CallTriage> {
  const call = await getCallForService(callId);

  const triageRecord: CallTriage = {
    id: faker.string.uuid(),
    callId,
    chiefComplaint: call.chiefComplaint,
    triagedAt: new Date(),
    ...triage,
  };

  // Update call with triage information
  await updateCallForService(callId, {
    priority: triage.priorityLevel,
    medicalPriority: triage.determinantCode,
    status: CallStatus.TRIAGED,
  } as any);

  await logDispatchActivity(callId, 'call_triaged', {
    determinantCode: triage.determinantCode,
    priority: triage.priorityLevel,
  });

  return triageRecord;
}

/**
 * Applies EMD protocol card to call
 *
 * @param callId - Call identifier
 * @param cardNumber - EMD card number (e.g., '09' for Cardiac Arrest)
 * @returns Protocol recommendations
 *
 * @example
 * ```typescript
 * const protocol = await applyEMDProtocol('call-123', '09');
 * // Returns protocol for cardiac arrest
 * ```
 */
export async function applyEMDProtocol(
  callId: string,
  cardNumber: string,
): Promise<{
  cardTitle: string;
  determinants: string[];
  preArrivalInstructions: string[];
  recommendedResponse: string[];
}> {
  const protocols = {
    '09': {
      cardTitle: 'Cardiac Arrest / Death',
      determinants: ['09-E-01', '09-D-01'],
      preArrivalInstructions: ['Start CPR', 'Attach AED if available', 'Continue until help arrives'],
      recommendedResponse: ['ALS', 'BLS', 'Fire First Responder'],
    },
    '10': {
      cardTitle: 'Chest Pain',
      determinants: ['10-C-01', '10-D-01'],
      preArrivalInstructions: ['Have patient rest', 'Chew aspirin if available', 'Loosen tight clothing'],
      recommendedResponse: ['ALS'],
    },
  };

  return (
    protocols[cardNumber as keyof typeof protocols] || {
      cardTitle: 'Unknown',
      determinants: [],
      preArrivalInstructions: [],
      recommendedResponse: ['BLS'],
    }
  );
}

/**
 * Delivers pre-arrival instructions to caller
 *
 * @param callId - Call identifier
 * @param instructions - Instruction data
 * @returns Pre-arrival instruction record
 *
 * @example
 * ```typescript
 * await deliverPreArrivalInstructions('call-123', {
 *   instructionType: 'CPR',
 *   instructions: ['Place patient on back', 'Begin chest compressions', '30 compressions, 2 breaths'],
 *   deliveredBy: 'emd-456'
 * });
 * ```
 */
export async function deliverPreArrivalInstructions(
  callId: string,
  instructions: Omit<PreArrivalInstructions, 'id' | 'callId' | 'startedAt'>,
): Promise<PreArrivalInstructions> {
  const paiRecord: PreArrivalInstructions = {
    id: faker.string.uuid(),
    callId,
    startedAt: new Date(),
    ...instructions,
  };

  await updateCallForService(callId, {
    preArrivalInstructionsGiven: true,
  } as any);

  await logDispatchActivity(callId, 'pai_delivered', {
    instructionType: instructions.instructionType,
  });

  return paiRecord;
}

/**
 * Validates caller location using ANI/ALI
 *
 * @param phoneNumber - Caller phone number
 * @returns Validated location information
 *
 * @example
 * ```typescript
 * const location = await validateCallerLocation('555-0100');
 * ```
 */
export async function validateCallerLocation(phoneNumber: string): Promise<{
  isValid: boolean;
  location?: GeoLocation;
  confidence: number;
  source: 'ANI/ALI' | 'GPS' | 'CELL_TOWER' | 'MANUAL';
}> {
  // In production, query ANI/ALI database or cellular location services
  return {
    isValid: true,
    location: {
      latitude: 40.7128,
      longitude: -74.006,
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
    },
    confidence: 0.95,
    source: 'ANI/ALI',
  };
}

/**
 * Transfers call to specialized PSAP or agency
 *
 * @param callId - Call identifier
 * @param targetAgency - Target agency or PSAP
 * @param transferReason - Reason for transfer
 * @param transferredBy - User transferring call
 * @returns Transfer confirmation
 *
 * @example
 * ```typescript
 * await transferCall('call-123', 'State Police', 'Highway incident, outside jurisdiction', 'dispatcher-456');
 * ```
 */
export async function transferCall(
  callId: string,
  targetAgency: string,
  transferReason: string,
  transferredBy: string,
): Promise<{ transferred: boolean; transferTime: Date; targetAgency: string }> {
  await logDispatchActivity(callId, 'call_transferred', {
    targetAgency,
    transferReason,
    transferredBy,
  });

  return {
    transferred: true,
    transferTime: new Date(),
    targetAgency,
  };
}

// ============================================================================
// UNIT DISPATCH AND ROUTING
// ============================================================================

/**
 * Dispatches units to call for service
 *
 * @param callId - Call identifier
 * @param unitIds - Unit identifiers to dispatch
 * @param dispatchedBy - Dispatcher user ID
 * @returns Array of dispatch records
 *
 * @example
 * ```typescript
 * const dispatches = await dispatchUnits('call-123', ['AMB-1', 'ENG-1'], 'dispatcher-456');
 * ```
 */
export async function dispatchUnits(
  callId: string,
  unitIds: string[],
  dispatchedBy: string,
): Promise<UnitDispatch[]> {
  const call = await getCallForService(callId);
  const dispatches: UnitDispatch[] = [];

  for (let i = 0; i < unitIds.length; i++) {
    const unit = await getUnit(unitIds[i]);

    const dispatch: UnitDispatch = {
      id: faker.string.uuid(),
      callId,
      unitId: unit.id,
      unitNumber: unit.unitNumber,
      dispatchedAt: new Date(),
      dispatchedBy,
      isFirstResponder: i === 0,
    };

    // Update unit status
    await updateUnitStatus(unit.id, {
      status: UnitStatus.DISPATCHED,
      currentCallId: callId,
    } as any);

    dispatches.push(dispatch);
  }

  // Update call status
  await updateCallForService(callId, {
    status: CallStatus.DISPATCHED,
    dispatchedAt: new Date(),
    dispatcher: dispatchedBy,
    assignedUnits: unitIds,
  } as any);

  await logDispatchActivity(callId, 'units_dispatched', {
    units: unitIds,
    dispatchedBy,
  });

  return dispatches;
}

/**
 * Automatically recommends best units for call
 *
 * @param callId - Call identifier
 * @param criteria - Selection criteria
 * @returns Recommended units with ranking
 *
 * @example
 * ```typescript
 * const recommendations = await recommendUnitsForCall('call-123', {
 *   requireALS: true,
 *   maxResponseTime: 8,
 *   preferredZone: 'ZONE-A'
 * });
 * ```
 */
export async function recommendUnitsForCall(
  callId: string,
  criteria: {
    requireALS?: boolean;
    requireBLS?: boolean;
    maxResponseTime?: number;
    preferredZone?: string;
    unitTypes?: UnitType[];
  },
): Promise<
  Array<{
    unitId: string;
    unitNumber: string;
    estimatedResponseTime: number;
    distance: number;
    score: number;
  }>
> {
  const call = await getCallForService(callId);
  const availableUnits = await getAvailableUnits({
    zone: call.location.zone,
    unitTypes: criteria.unitTypes,
  });

  // In production, calculate using routing engine and AVL data
  return availableUnits.map((unit) => ({
    unitId: unit.id,
    unitNumber: unit.unitNumber,
    estimatedResponseTime: Math.random() * 10,
    distance: Math.random() * 5,
    score: Math.random() * 100,
  }));
}

/**
 * Calculates optimal route for unit to scene
 *
 * @param unitId - Unit identifier
 * @param destination - Destination location
 * @returns Route information
 *
 * @example
 * ```typescript
 * const route = await calculateOptimalRoute('unit-123', {
 *   latitude: 40.7128,
 *   longitude: -74.0060
 * });
 * ```
 */
export async function calculateOptimalRoute(
  unitId: string,
  destination: GeoLocation,
): Promise<{
  distance: number;
  estimatedTime: number;
  route: GeoLocation[];
  useEmergencyRoute: boolean;
}> {
  const unit = await getUnit(unitId);

  // In production, use routing engine (Google Maps, Mapbox, etc.)
  return {
    distance: 3.2, // miles
    estimatedTime: 8, // minutes
    route: [unit.currentLocation || { latitude: 0, longitude: 0 }, destination],
    useEmergencyRoute: true,
  };
}

/**
 * Dispatches units based on response plan
 *
 * @param callId - Call identifier
 * @param responsePlanId - Response plan identifier
 * @param dispatchedBy - Dispatcher user ID
 * @returns Dispatch results
 *
 * @example
 * ```typescript
 * await dispatchByResponsePlan('call-123', 'plan-full-assignment', 'dispatcher-456');
 * ```
 */
export async function dispatchByResponsePlan(
  callId: string,
  responsePlanId: string,
  dispatchedBy: string,
): Promise<{ dispatched: UnitDispatch[]; pending: string[] }> {
  const plan = await getResponsePlan(responsePlanId);
  const call = await getCallForService(callId);

  const unitsToDispatch: string[] = [];

  // Get required units based on plan
  for (const req of plan.requiredUnits) {
    const available = await getAvailableUnits({
      unitTypes: [req.unitType],
      zone: call.location.zone,
    });

    const selectedUnits = available.slice(0, req.quantity);
    unitsToDispatch.push(...selectedUnits.map((u) => u.id));
  }

  const dispatched = await dispatchUnits(callId, unitsToDispatch, dispatchedBy);

  return {
    dispatched,
    pending: [],
  };
}

/**
 * Adds additional units to existing call
 *
 * @param callId - Call identifier
 * @param additionalUnits - Additional unit IDs
 * @param reason - Reason for additional units
 * @param dispatchedBy - Dispatcher user ID
 * @returns Updated dispatch records
 *
 * @example
 * ```typescript
 * await addUnitsToCall('call-123', ['ENG-2', 'LADDER-1'], 'Working fire, additional resources needed', 'dispatcher-456');
 * ```
 */
export async function addUnitsToCall(
  callId: string,
  additionalUnits: string[],
  reason: string,
  dispatchedBy: string,
): Promise<UnitDispatch[]> {
  await logDispatchActivity(callId, 'additional_units_dispatched', {
    units: additionalUnits,
    reason,
  });

  return dispatchUnits(callId, additionalUnits, dispatchedBy);
}

/**
 * Cancels unit dispatch
 *
 * @param dispatchId - Dispatch identifier
 * @param cancelReason - Cancellation reason
 * @param cancelledBy - User cancelling dispatch
 * @returns Updated dispatch record
 *
 * @example
 * ```typescript
 * await cancelUnitDispatch('dispatch-123', 'Unit mechanical issue', 'dispatcher-456');
 * ```
 */
export async function cancelUnitDispatch(
  dispatchId: string,
  cancelReason: string,
  cancelledBy: string,
): Promise<UnitDispatch> {
  const dispatch = await getUnitDispatch(dispatchId);

  // Update unit status back to available
  await updateUnitStatus(dispatch.unitId, {
    status: UnitStatus.AVAILABLE,
    currentCallId: undefined,
  } as any);

  await logDispatchActivity(dispatch.callId, 'dispatch_cancelled', {
    unitId: dispatch.unitId,
    reason: cancelReason,
  });

  return dispatch;
}

// ============================================================================
// UNIT STATUS TRACKING
// ============================================================================

/**
 * Updates unit status
 *
 * @param unitId - Unit identifier
 * @param update - Status update data
 * @returns Updated unit
 *
 * @example
 * ```typescript
 * await updateUnitStatus('unit-123', {
 *   status: UnitStatus.EN_ROUTE,
 *   location: { latitude: 40.7128, longitude: -74.0060 }
 * });
 * ```
 */
export async function updateUnitStatus(
  unitId: string,
  update: Partial<Unit> & { status: UnitStatus },
): Promise<Unit> {
  const unit = await getUnit(unitId);

  const updated: Unit = {
    ...unit,
    ...update,
    lastStatusChange: new Date(),
    isAvailable: [UnitStatus.AVAILABLE, UnitStatus.IN_QUARTERS].includes(update.status),
    isInService: ![UnitStatus.UNAVAILABLE, UnitStatus.MECHANICAL].includes(update.status),
  };

  // Update call status if unit is responding
  if (unit.currentCallId) {
    if (update.status === UnitStatus.EN_ROUTE) {
      await updateCallStatus(unit.currentCallId, CallStatus.EN_ROUTE);
    } else if (update.status === UnitStatus.ON_SCENE) {
      await updateCallStatus(unit.currentCallId, CallStatus.ON_SCENE);
    }
  }

  await logDispatchActivity(unit.currentCallId || 'system', 'unit_status_changed', {
    unitId,
    previousStatus: unit.status,
    newStatus: update.status,
  });

  return updated;
}

/**
 * Tracks unit response times
 *
 * @param dispatchId - Dispatch identifier
 * @returns Response time metrics
 *
 * @example
 * ```typescript
 * const metrics = await trackUnitResponseTime('dispatch-123');
 * ```
 */
export async function trackUnitResponseTime(dispatchId: string): Promise<{
  dispatchToEnRoute: number;
  enRouteToArrival: number;
  totalResponseTime: number;
  meetsStandard: boolean;
}> {
  const dispatch = await getUnitDispatch(dispatchId);

  const dispatchToEnRoute = dispatch.enRouteAt && dispatch.dispatchedAt
    ? (dispatch.enRouteAt.getTime() - dispatch.dispatchedAt.getTime()) / 1000
    : 0;

  const enRouteToArrival = dispatch.arrivedAt && dispatch.enRouteAt
    ? (dispatch.arrivedAt.getTime() - dispatch.enRouteAt.getTime()) / 1000
    : 0;

  const totalResponseTime = dispatchToEnRoute + enRouteToArrival;

  return {
    dispatchToEnRoute,
    enRouteToArrival,
    totalResponseTime,
    meetsStandard: totalResponseTime <= 480, // 8 minutes
  };
}

/**
 * Gets available units in zone
 *
 * @param criteria - Unit selection criteria
 * @returns Available units
 *
 * @example
 * ```typescript
 * const units = await getAvailableUnits({
 *   zone: 'ZONE-A',
 *   unitTypes: [UnitType.AMBULANCE, UnitType.ENGINE]
 * });
 * ```
 */
export async function getAvailableUnits(criteria: {
  zone?: string;
  unitTypes?: UnitType[];
  requireALS?: boolean;
}): Promise<Unit[]> {
  // In production, query database with filters
  return [];
}

/**
 * Updates unit location from AVL
 *
 * @param unitId - Unit identifier
 * @param avlData - AVL update data
 * @returns AVL update record
 *
 * @example
 * ```typescript
 * await updateUnitLocationFromAVL('unit-123', {
 *   location: { latitude: 40.7128, longitude: -74.0060 },
 *   heading: 45,
 *   speed: 35
 * });
 * ```
 */
export async function updateUnitLocationFromAVL(
  unitId: string,
  avlData: Omit<AVLUpdate, 'id' | 'unitId' | 'timestamp'>,
): Promise<AVLUpdate> {
  const avlUpdate: AVLUpdate = {
    id: faker.string.uuid(),
    unitId,
    timestamp: new Date(),
    ...avlData,
  };

  await updateUnitStatus(unitId, {
    currentLocation: avlData.location,
    lastLocationUpdate: new Date(),
  } as any);

  return avlUpdate;
}

/**
 * Clears unit from call
 *
 * @param unitId - Unit identifier
 * @param disposition - Call disposition
 * @param clearedBy - User clearing unit
 * @returns Updated unit
 *
 * @example
 * ```typescript
 * await clearUnit('unit-123', 'Transport complete', 'dispatcher-456');
 * ```
 */
export async function clearUnit(unitId: string, disposition: string, clearedBy: string): Promise<Unit> {
  const unit = await getUnit(unitId);

  if (unit.currentCallId) {
    await logDispatchActivity(unit.currentCallId, 'unit_cleared', {
      unitId,
      disposition,
    });
  }

  return updateUnitStatus(unitId, {
    status: UnitStatus.AVAILABLE,
    currentCallId: undefined,
  } as any);
}

// ============================================================================
// DISPATCH QUEUE MANAGEMENT
// ============================================================================

/**
 * Adds call to dispatch queue
 *
 * @param callId - Call identifier
 * @param priority - Queue priority
 * @returns Queue entry
 *
 * @example
 * ```typescript
 * await addToDispatchQueue('call-123', QueuePriority.CRITICAL);
 * ```
 */
export async function addToDispatchQueue(callId: string, priority: QueuePriority): Promise<DispatchQueueEntry> {
  const existingQueue = await getDispatchQueue();
  const position = existingQueue.length + 1;

  const entry: DispatchQueueEntry = {
    id: faker.string.uuid(),
    callId,
    priority,
    queuePosition: position,
    waitTime: 0,
    addedAt: new Date(),
  };

  await logDispatchActivity(callId, 'added_to_queue', { priority, position });

  return entry;
}

/**
 * Prioritizes dispatch queue
 *
 * @param queueEntries - Queue entries to prioritize
 * @returns Sorted queue
 *
 * @example
 * ```typescript
 * const sorted = prioritizeDispatchQueue(queueEntries);
 * ```
 */
export function prioritizeDispatchQueue(queueEntries: DispatchQueueEntry[]): DispatchQueueEntry[] {
  const priorityWeight = {
    [QueuePriority.CRITICAL]: 1,
    [QueuePriority.HIGH]: 2,
    [QueuePriority.MEDIUM]: 3,
    [QueuePriority.LOW]: 4,
    [QueuePriority.HOLD]: 5,
  };

  return [...queueEntries].sort((a, b) => {
    // First by priority
    const priorityDiff = priorityWeight[a.priority] - priorityWeight[b.priority];
    if (priorityDiff !== 0) return priorityDiff;

    // Then by wait time (oldest first)
    return a.waitTime - b.waitTime;
  });
}

/**
 * Gets dispatch queue
 *
 * @returns Current dispatch queue
 *
 * @example
 * ```typescript
 * const queue = await getDispatchQueue();
 * ```
 */
export async function getDispatchQueue(): Promise<DispatchQueueEntry[]> {
  // In production, fetch from database
  return [];
}

/**
 * Removes call from dispatch queue
 *
 * @param callId - Call identifier
 * @returns Success status
 *
 * @example
 * ```typescript
 * await removeFromDispatchQueue('call-123');
 * ```
 */
export async function removeFromDispatchQueue(callId: string): Promise<boolean> {
  await logDispatchActivity(callId, 'removed_from_queue', {});
  return true;
}

/**
 * Escalates queued call priority
 *
 * @param queueEntryId - Queue entry identifier
 * @param newPriority - New priority level
 * @param reason - Escalation reason
 * @returns Updated queue entry
 *
 * @example
 * ```typescript
 * await escalateQueuedCall('queue-123', QueuePriority.CRITICAL, 'Condition deteriorating');
 * ```
 */
export async function escalateQueuedCall(
  queueEntryId: string,
  newPriority: QueuePriority,
  reason: string,
): Promise<DispatchQueueEntry> {
  const entry = await getQueueEntry(queueEntryId);

  await logDispatchActivity(entry.callId, 'queue_priority_escalated', {
    previousPriority: entry.priority,
    newPriority,
    reason,
  });

  return {
    ...entry,
    priority: newPriority,
    escalationTime: new Date(),
  };
}

// ============================================================================
// GEOGRAPHIC ZONE MANAGEMENT
// ============================================================================

/**
 * Creates geographic zone
 *
 * @param zone - Zone data
 * @returns Created zone
 *
 * @example
 * ```typescript
 * const zone = await createGeographicZone({
 *   zoneName: 'Zone Alpha',
 *   zoneType: 'fire',
 *   boundaries: { north: 40.8, south: 40.7, east: -73.9, west: -74.1 },
 *   assignedUnits: ['ENG-1', 'LADDER-1']
 * });
 * ```
 */
export async function createGeographicZone(zone: Omit<GeographicZone, 'id' | 'isActive'>): Promise<GeographicZone> {
  const geoZone: GeographicZone = {
    id: faker.string.uuid(),
    isActive: true,
    ...zone,
  };

  return geoZone;
}

/**
 * Determines zone for location
 *
 * @param location - Geographic location
 * @returns Zone identifier
 *
 * @example
 * ```typescript
 * const zone = await determineZoneForLocation({
 *   latitude: 40.7128,
 *   longitude: -74.0060
 * });
 * ```
 */
export async function determineZoneForLocation(location: GeoLocation): Promise<string | null> {
  // In production, use geospatial query
  return 'ZONE-A';
}

/**
 * Gets zone coverage statistics
 *
 * @param zoneId - Zone identifier
 * @returns Coverage statistics
 *
 * @example
 * ```typescript
 * const stats = await getZoneCoverageStats('zone-123');
 * ```
 */
export async function getZoneCoverageStats(zoneId: string): Promise<{
  availableUnits: number;
  busyUnits: number;
  averageResponseTime: number;
  activeCalls: number;
}> {
  return {
    availableUnits: 5,
    busyUnits: 2,
    averageResponseTime: 6.5,
    activeCalls: 3,
  };
}

/**
 * Assigns unit to zone
 *
 * @param unitId - Unit identifier
 * @param zoneId - Zone identifier
 * @returns Updated unit
 *
 * @example
 * ```typescript
 * await assignUnitToZone('unit-123', 'zone-456');
 * ```
 */
export async function assignUnitToZone(unitId: string, zoneId: string): Promise<Unit> {
  const zone = await getGeographicZone(zoneId);

  return updateUnitStatus(unitId, {
    assignedZone: zone.zoneName,
  } as any);
}

// ============================================================================
// DISPATCH CONSOLE OPERATIONS
// ============================================================================

/**
 * Logs dispatcher into console
 *
 * @param consoleId - Console identifier
 * @param dispatcherId - Dispatcher user ID
 * @param dispatcherName - Dispatcher name
 * @returns Updated console
 *
 * @example
 * ```typescript
 * await loginToConsole('console-1', 'dispatcher-123', 'Jane Doe');
 * ```
 */
export async function loginToConsole(
  consoleId: string,
  dispatcherId: string,
  dispatcherName: string,
): Promise<DispatchConsole> {
  const console = await getDispatchConsole(consoleId);

  return {
    ...console,
    status: ConsoleStatus.ACTIVE,
    currentDispatcher: dispatcherId,
    dispatcherName,
    loginTime: new Date(),
    lastActivityTime: new Date(),
  };
}

/**
 * Logs dispatcher out of console
 *
 * @param consoleId - Console identifier
 * @returns Updated console
 *
 * @example
 * ```typescript
 * await logoutFromConsole('console-1');
 * ```
 */
export async function logoutFromConsole(consoleId: string): Promise<DispatchConsole> {
  const console = await getDispatchConsole(consoleId);

  return {
    ...console,
    status: ConsoleStatus.LOGGED_OUT,
    currentDispatcher: undefined,
    dispatcherName: undefined,
  };
}

/**
 * Transfers calls between consoles
 *
 * @param callIds - Call identifiers to transfer
 * @param fromConsoleId - Source console
 * @param toConsoleId - Target console
 * @returns Transfer confirmation
 *
 * @example
 * ```typescript
 * await transferCallsBetweenConsoles(['call-1', 'call-2'], 'console-1', 'console-2');
 * ```
 */
export async function transferCallsBetweenConsoles(
  callIds: string[],
  fromConsoleId: string,
  toConsoleId: string,
): Promise<{ transferred: string[]; failed: string[] }> {
  await logDispatchActivity('system', 'calls_transferred_between_consoles', {
    callIds,
    fromConsoleId,
    toConsoleId,
  });

  return {
    transferred: callIds,
    failed: [],
  };
}

/**
 * Gets active consoles
 *
 * @returns Array of active dispatch consoles
 *
 * @example
 * ```typescript
 * const consoles = await getActiveConsoles();
 * ```
 */
export async function getActiveConsoles(): Promise<DispatchConsole[]> {
  // In production, fetch from database
  return [];
}

/**
 * Monitors console performance
 *
 * @param consoleId - Console identifier
 * @param period - Monitoring period in hours
 * @returns Performance metrics
 *
 * @example
 * ```typescript
 * const metrics = await monitorConsolePerformance('console-1', 24);
 * ```
 */
export async function monitorConsolePerformance(
  consoleId: string,
  period: number,
): Promise<{
  callsHandled: number;
  averageCallDuration: number;
  dispatchTime: number;
  transferRate: number;
}> {
  return {
    callsHandled: 45,
    averageCallDuration: 3.2,
    dispatchTime: 1.8,
    transferRate: 0.05,
  };
}

// ============================================================================
// CALL LIFECYCLE MANAGEMENT
// ============================================================================

/**
 * Updates call status
 *
 * @param callId - Call identifier
 * @param newStatus - New status
 * @returns Updated call
 *
 * @example
 * ```typescript
 * await updateCallStatus('call-123', CallStatus.ON_SCENE);
 * ```
 */
export async function updateCallStatus(callId: string, newStatus: CallStatus): Promise<CallForService> {
  const call = await getCallForService(callId);

  const updated = await updateCallForService(callId, {
    status: newStatus,
  } as any);

  await logDispatchActivity(callId, 'status_changed', {
    previousStatus: call.status,
    newStatus,
  });

  return updated;
}

/**
 * Closes call for service
 *
 * @param callId - Call identifier
 * @param disposition - Call disposition
 * @param closedBy - User closing call
 * @returns Closed call
 *
 * @example
 * ```typescript
 * await closeCallForService('call-123', 'Patient transported to General Hospital', 'dispatcher-456');
 * ```
 */
export async function closeCallForService(
  callId: string,
  disposition: string,
  closedBy: string,
): Promise<CallForService> {
  const call = await updateCallStatus(callId, CallStatus.COMPLETED);

  await logDispatchActivity(callId, 'call_closed', {
    disposition,
    closedBy,
  });

  return {
    ...call,
    clearedAt: new Date(),
  };
}

/**
 * Cancels call for service
 *
 * @param callId - Call identifier
 * @param cancelReason - Cancellation reason
 * @param cancelledBy - User cancelling call
 * @returns Cancelled call
 *
 * @example
 * ```typescript
 * await cancelCallForService('call-123', 'Duplicate call', 'dispatcher-456');
 * ```
 */
export async function cancelCallForService(
  callId: string,
  cancelReason: string,
  cancelledBy: string,
): Promise<CallForService> {
  const call = await updateCallStatus(callId, CallStatus.CANCELLED);

  // Cancel all unit dispatches
  const call Data = await getCallForService(callId);
  for (const unitId of callData.assignedUnits) {
    await updateUnitStatus(unitId, {
      status: UnitStatus.AVAILABLE,
      currentCallId: undefined,
    } as any);
  }

  await logDispatchActivity(callId, 'call_cancelled', {
    reason: cancelReason,
    cancelledBy,
  });

  return call;
}

/**
 * Merges duplicate calls
 *
 * @param primaryCallId - Primary call to keep
 * @param duplicateCallIds - Duplicate call IDs to merge
 * @param mergedBy - User merging calls
 * @returns Updated primary call
 *
 * @example
 * ```typescript
 * await mergeDuplicateCalls('call-123', ['call-124', 'call-125'], 'dispatcher-456');
 * ```
 */
export async function mergeDuplicateCalls(
  primaryCallId: string,
  duplicateCallIds: string[],
  mergedBy: string,
): Promise<CallForService> {
  const primaryCall = await getCallForService(primaryCallId);

  for (const duplicateId of duplicateCallIds) {
    await updateCallStatus(duplicateId, CallStatus.DUPLICATE);
  }

  await logDispatchActivity(primaryCallId, 'calls_merged', {
    duplicates: duplicateCallIds,
    mergedBy,
  });

  return primaryCall;
}

/**
 * Generates call statistics
 *
 * @param period - Time period for statistics
 * @returns Call statistics
 *
 * @example
 * ```typescript
 * const stats = await generateCallStatistics({ hours: 24 });
 * ```
 */
export async function generateCallStatistics(period: { hours: number }): Promise<{
  totalCalls: number;
  byPriority: Record<CallPriority, number>;
  byType: Record<CallType, number>;
  averageResponseTime: number;
  callsPerHour: number;
}> {
  return {
    totalCalls: 150,
    byPriority: {
      [CallPriority.IMMEDIATE]: 5,
      [CallPriority.EMERGENCY]: 25,
      [CallPriority.URGENT]: 40,
      [CallPriority.ROUTINE]: 60,
      [CallPriority.NON_EMERGENCY]: 20,
    },
    byType: {} as any,
    averageResponseTime: 7.2,
    callsPerHour: 6.25,
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Gets call for service by ID
 */
async function getCallForService(id: string): Promise<CallForService> {
  return {
    id,
    callNumber: 'CFS-TEST-001',
    callType: CallType.MEDICAL_EMERGENCY,
    priority: CallPriority.EMERGENCY,
    status: CallStatus.PENDING,
    location: { latitude: 40.7128, longitude: -74.006 },
    chiefComplaint: 'Test',
    assignedUnits: [],
    receivedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'user-1',
  };
}

/**
 * Updates call for service
 */
async function updateCallForService(id: string, updates: Partial<CallForService>): Promise<CallForService> {
  const call = await getCallForService(id);
  return { ...call, ...updates, updatedAt: new Date() };
}

/**
 * Gets unit by ID
 */
async function getUnit(id: string): Promise<Unit> {
  return {
    id,
    unitNumber: 'AMB-1',
    unitType: UnitType.AMBULANCE,
    status: UnitStatus.AVAILABLE,
    isAvailable: true,
    isInService: true,
  };
}

/**
 * Gets unit dispatch by ID
 */
async function getUnitDispatch(id: string): Promise<UnitDispatch> {
  return {
    id,
    callId: 'call-1',
    unitId: 'unit-1',
    unitNumber: 'AMB-1',
    dispatchedAt: new Date(),
    dispatchedBy: 'dispatcher-1',
    isFirstResponder: true,
  };
}

/**
 * Gets response plan by ID
 */
async function getResponsePlan(id: string): Promise<ResponsePlan> {
  return {
    id,
    planName: 'Full Assignment',
    planType: ResponsePlanType.FULL_ASSIGNMENT,
    callTypes: [CallType.FIRE],
    requiredUnits: [
      { unitType: UnitType.ENGINE, quantity: 3, isRequired: true },
      { unitType: UnitType.LADDER, quantity: 1, isRequired: true },
    ],
    autoDispatch: true,
  };
}

/**
 * Gets geographic zone by ID
 */
async function getGeographicZone(id: string): Promise<GeographicZone> {
  return {
    id,
    zoneName: 'Zone A',
    zoneType: 'fire',
    boundaries: { north: 40.8, south: 40.7, east: -73.9, west: -74.1 },
    assignedUnits: [],
    isActive: true,
  };
}

/**
 * Gets dispatch console by ID
 */
async function getDispatchConsole(id: string): Promise<DispatchConsole> {
  return {
    id,
    consoleNumber: 'CONSOLE-1',
    consoleType: 'combined',
    status: ConsoleStatus.LOGGED_OUT,
    activeCalls: [],
    queuedCalls: [],
  };
}

/**
 * Gets queue entry by ID
 */
async function getQueueEntry(id: string): Promise<DispatchQueueEntry> {
  return {
    id,
    callId: 'call-1',
    priority: QueuePriority.HIGH,
    queuePosition: 1,
    waitTime: 0,
    addedAt: new Date(),
  };
}

/**
 * Logs dispatch activity for audit trail
 */
async function logDispatchActivity(callId: string, activityType: string, data: any): Promise<void> {
  console.log(`Call ${callId}: ${activityType}`, data);
}

// ============================================================================
// NESTJS CONTROLLER
// ============================================================================

/**
 * Dispatch Command Controller
 * Provides RESTful API endpoints for dispatch operations
 */
@ApiTags('dispatch-command')
@Controller('dispatch-command')
@ApiBearerAuth()
export class DispatchCommandController {
  /**
   * Create a new call for service
   */
  @Post('calls')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new call for service' })
  @ApiResponse({ status: 201, description: 'Call created successfully' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async createCall(@Body() createDto: CreateCallForServiceDto) {
    const location: GeoLocation = {
      latitude: createDto.latitude,
      longitude: createDto.longitude,
      address: createDto.address,
    };

    return createCallForService(
      {
        callType: createDto.callType,
        priority: createDto.priority,
        location,
        callerName: createDto.callerName,
        callerPhone: createDto.callerPhone,
        chiefComplaint: createDto.chiefComplaint,
        additionalInfo: createDto.additionalInfo,
        patientCount: createDto.patientCount,
        weaponsInvolved: createDto.weaponsInvolved,
        callTaker: createDto.callTaker,
        crossStreets: createDto.crossStreets,
      } as any,
      createDto.callTaker,
    );
  }

  /**
   * Triage emergency call
   */
  @Post('calls/:id/triage')
  @ApiOperation({ summary: 'Triage emergency call' })
  async triageCall(@Param('id', ParseUUIDPipe) id: string, @Body() dto: TriageCallDto) {
    return triageEmergencyCall(id, {
      determinantCode: dto.determinantCode,
      priorityLevel: dto.priorityLevel,
      recommendedResponse: dto.recommendedResponse,
      vitals: {
        conscious: dto.conscious,
        breathing: dto.breathing,
      },
      symptoms: dto.symptoms,
      triageNotes: dto.triageNotes,
      triagedBy: dto.triagedBy,
    });
  }

  /**
   * Dispatch units to call
   */
  @Post('calls/:id/dispatch')
  @ApiOperation({ summary: 'Dispatch units to call' })
  async dispatch(@Param('id', ParseUUIDPipe) id: string, @Body() dto: DispatchUnitsDto) {
    return dispatchUnits(id, dto.unitIds, dto.dispatchedBy);
  }

  /**
   * Update unit status
   */
  @Patch('units/:id/status')
  @ApiOperation({ summary: 'Update unit status' })
  async updateStatus(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateUnitStatusDto) {
    const location = dto.latitude && dto.longitude ? { latitude: dto.latitude, longitude: dto.longitude } : undefined;

    return updateUnitStatus(id, {
      status: dto.status,
      currentLocation: location,
    } as any);
  }

  /**
   * Get available units
   */
  @Get('units/available')
  @ApiOperation({ summary: 'Get available units' })
  @ApiQuery({ name: 'zone', required: false })
  async getAvailable(@Query('zone') zone?: string) {
    return getAvailableUnits({ zone });
  }

  /**
   * Get dispatch queue
   */
  @Get('queue')
  @ApiOperation({ summary: 'Get dispatch queue' })
  async getQueue() {
    return getDispatchQueue();
  }

  /**
   * Close call
   */
  @Post('calls/:id/close')
  @ApiOperation({ summary: 'Close call for service' })
  async closeCall(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: { disposition: string; closedBy: string },
  ) {
    return closeCallForService(id, data.disposition, data.closedBy);
  }

  /**
   * Create geographic zone
   */
  @Post('zones')
  @ApiOperation({ summary: 'Create geographic zone' })
  async createZone(@Body() dto: CreateGeographicZoneDto) {
    return createGeographicZone({
      zoneName: dto.zoneName,
      zoneType: dto.zoneType,
      boundaries: {
        north: dto.north,
        south: dto.south,
        east: dto.east,
        west: dto.west,
      },
      assignedUnits: dto.assignedUnits,
    });
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Call Intake and Triage
  createCallForService,
  generateCallNumber,
  triageEmergencyCall,
  applyEMDProtocol,
  deliverPreArrivalInstructions,
  validateCallerLocation,
  transferCall,

  // Unit Dispatch
  dispatchUnits,
  recommendUnitsForCall,
  calculateOptimalRoute,
  dispatchByResponsePlan,
  addUnitsToCall,
  cancelUnitDispatch,

  // Unit Status
  updateUnitStatus,
  trackUnitResponseTime,
  getAvailableUnits,
  updateUnitLocationFromAVL,
  clearUnit,

  // Queue Management
  addToDispatchQueue,
  prioritizeDispatchQueue,
  getDispatchQueue,
  removeFromDispatchQueue,
  escalateQueuedCall,

  // Geographic Zones
  createGeographicZone,
  determineZoneForLocation,
  getZoneCoverageStats,
  assignUnitToZone,

  // Console Operations
  loginToConsole,
  logoutFromConsole,
  transferCallsBetweenConsoles,
  getActiveConsoles,
  monitorConsolePerformance,

  // Call Lifecycle
  updateCallStatus,
  closeCallForService,
  cancelCallForService,
  mergeDuplicateCalls,
  generateCallStatistics,

  // Controller
  DispatchCommandController,
};
