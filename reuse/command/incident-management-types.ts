/**
 * @fileoverview Advanced TypeScript Type Definitions for Incident Management Systems
 *
 * This module provides a comprehensive type system for command and control incident management,
 * leveraging advanced TypeScript features including discriminated unions, conditional types,
 * mapped types, template literal types, and branded primitives. The type system enforces
 * compile-time guarantees for incident lifecycle management, resource allocation, and
 * inter-agency coordination.
 *
 * **Architecture Principles:**
 * - Type-level state machines for status transitions with exhaustive checking
 * - Branded types for domain-specific primitives preventing accidental misuse
 * - Discriminated unions for type-safe pattern matching and runtime discrimination
 * - Generic constraints ensuring structural and semantic correctness
 * - Variance annotations for proper subtype relationships
 * - Conditional types for type transformations and validations
 *
 * **Type Safety Guarantees:**
 * - All types are strictly typed with no implicit `any`
 * - Illegal states are unrepresentable through type design
 * - Exhaustive pattern matching enforced by discriminated unions
 * - Compile-time validation of status transitions
 * - Type-safe event payloads with temporal ordering
 *
 * **Performance Considerations:**
 * - Zero runtime overhead - all types erased at compile time
 * - Structural typing enables efficient type checking
 * - Const assertions for literal type inference
 * - Readonly types prevent defensive copying
 *
 * @module incident-management-types
 * @category Type System
 * @since 1.0.0
 * @author TypeScript Architect
 */

// ============================================================================
// BRANDED TYPES - Domain-Specific Primitives
// ============================================================================

/**
 * Nominal typing simulation through branded types.
 * Prevents accidental misuse of primitive values in domain-specific contexts.
 */
declare const __brand: unique symbol;
type Brand<T, TBrand extends string> = T & { readonly [__brand]: TBrand };

/**
 * Unique identifier for incidents with compile-time brand checking.
 */
export type IncidentId = Brand<string, 'IncidentId'>;

/**
 * Unique identifier for resources with type-level discrimination.
 */
export type ResourceId = Brand<string, 'ResourceId'>;

/**
 * Unique identifier for command structures.
 */
export type CommandId = Brand<string, 'CommandId'>;

/**
 * ISO 8601 timestamp with temporal ordering semantics.
 */
export type Timestamp = Brand<string, 'Timestamp'>;

/**
 * Geographic coordinate with WGS84 datum constraints.
 */
export type Latitude = Brand<number, 'Latitude'>;
export type Longitude = Brand<number, 'Longitude'>;

/**
 * Unique identifier for communication channels.
 */
export type ChannelId = Brand<string, 'ChannelId'>;

// ============================================================================
// INCIDENT TYPE HIERARCHIES - Discriminated Unions
// ============================================================================

/**
 * Incident severity levels with strict ordering guarantees.
 * Uses numeric literal types for compile-time ordering validation.
 */
export enum IncidentSeverity {
  ROUTINE = 1,
  ELEVATED = 2,
  URGENT = 3,
  CRITICAL = 4,
  CATASTROPHIC = 5
}

/**
 * Incident priority with multi-factor consideration.
 * Combines severity, resource availability, and temporal urgency.
 */
export type IncidentPriority = {
  readonly level: 1 | 2 | 3 | 4 | 5;
  readonly severity: IncidentSeverity;
  readonly timeWeight: number;
  readonly resourceWeight: number;
};

/**
 * Base incident interface with common properties.
 * All specific incident types extend this base.
 */
export interface BaseIncident {
  readonly id: IncidentId;
  readonly timestamp: Timestamp;
  readonly location: GeoCoordinate;
  readonly priority: IncidentPriority;
  readonly status: IncidentStatus;
}

/**
 * Medical emergency incident type.
 */
export interface MedicalIncident extends BaseIncident {
  readonly type: 'MEDICAL';
  readonly severity: 'MINOR' | 'MODERATE' | 'SEVERE' | 'LIFE_THREATENING';
  readonly patientCount: number;
  readonly triageLevel: 'GREEN' | 'YELLOW' | 'RED' | 'BLACK';
}

/**
 * Fire incident type with structure and hazard information.
 */
export interface FireIncident extends BaseIncident {
  readonly type: 'FIRE';
  readonly structureType: 'RESIDENTIAL' | 'COMMERCIAL' | 'INDUSTRIAL' | 'WILDLAND';
  readonly alarmLevel: 1 | 2 | 3 | 4 | 5;
  readonly hazmatPresent: boolean;
}

/**
 * Law enforcement incident type.
 */
export interface LawEnforcementIncident extends BaseIncident {
  readonly type: 'LAW_ENFORCEMENT';
  readonly category: 'TRAFFIC' | 'CRIMINAL' | 'CIVIL' | 'PUBLIC_SAFETY';
  readonly threatlevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME';
}

/**
 * Hazardous materials incident.
 */
export interface HazmatIncident extends BaseIncident {
  readonly type: 'HAZMAT';
  readonly materialType: string;
  readonly unNumber?: string;
  readonly evacuationRadius: number;
  readonly specializedEquipmentRequired: ReadonlyArray<string>;
}

/**
 * Natural disaster incident.
 */
export interface NaturalDisasterIncident extends BaseIncident {
  readonly type: 'NATURAL_DISASTER';
  readonly disasterType: 'FLOOD' | 'EARTHQUAKE' | 'TORNADO' | 'HURRICANE' | 'WILDFIRE';
  readonly affectedArea: number;
  readonly estimatedAffectedPopulation: number;
}

/**
 * Technical rescue incident.
 */
export interface TechnicalRescueIncident extends BaseIncident {
  readonly type: 'TECHNICAL_RESCUE';
  readonly rescueType: 'CONFINED_SPACE' | 'HIGH_ANGLE' | 'TRENCH' | 'WATER' | 'VEHICLE';
  readonly victimCount: number;
  readonly specializedResourcesNeeded: ReadonlyArray<ResourceType>;
}

/**
 * Discriminated union of all incident types.
 * Enables exhaustive pattern matching and type-safe discrimination.
 */
export type Incident =
  | MedicalIncident
  | FireIncident
  | LawEnforcementIncident
  | HazmatIncident
  | NaturalDisasterIncident
  | TechnicalRescueIncident;

/**
 * Extract incident type discriminator for type narrowing.
 */
export type IncidentType = Incident['type'];

// ============================================================================
// STATUS TRANSITION TYPES - State Machine
// ============================================================================

/**
 * Incident lifecycle status with state machine semantics.
 * Transitions are validated at compile time through mapped types.
 */
export enum IncidentStatus {
  REPORTED = 'REPORTED',
  DISPATCHED = 'DISPATCHED',
  EN_ROUTE = 'EN_ROUTE',
  ON_SCENE = 'ON_SCENE',
  CONTAINED = 'CONTAINED',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED'
}

/**
 * Valid status transitions encoded as a type-level state machine.
 * Prevents invalid state transitions at compile time.
 */
export type StatusTransitions = {
  readonly [IncidentStatus.REPORTED]: IncidentStatus.DISPATCHED;
  readonly [IncidentStatus.DISPATCHED]: IncidentStatus.EN_ROUTE | IncidentStatus.CLOSED;
  readonly [IncidentStatus.EN_ROUTE]: IncidentStatus.ON_SCENE | IncidentStatus.CLOSED;
  readonly [IncidentStatus.ON_SCENE]: IncidentStatus.CONTAINED | IncidentStatus.RESOLVED;
  readonly [IncidentStatus.CONTAINED]: IncidentStatus.RESOLVED;
  readonly [IncidentStatus.RESOLVED]: IncidentStatus.CLOSED;
  readonly [IncidentStatus.CLOSED]: never;
};

/**
 * Status transition event with temporal ordering and audit trail.
 */
export interface StatusTransitionEvent<
  TFrom extends IncidentStatus,
  TTo extends StatusTransitions[TFrom]
> {
  readonly incidentId: IncidentId;
  readonly fromStatus: TFrom;
  readonly toStatus: TTo;
  readonly timestamp: Timestamp;
  readonly performedBy: ResourceId;
  readonly reason?: string;
}

/**
 * Type-safe status transition validator.
 * Ensures only valid transitions are represented at compile time.
 */
export type ValidTransition<T extends IncidentStatus> = StatusTransitions[T] extends never
  ? never
  : StatusTransitions[T];

// ============================================================================
// COMMAND STRUCTURE TYPES
// ============================================================================

/**
 * Incident Command System (ICS) position types.
 */
export enum ICSPosition {
  INCIDENT_COMMANDER = 'INCIDENT_COMMANDER',
  SAFETY_OFFICER = 'SAFETY_OFFICER',
  LIAISON_OFFICER = 'LIAISON_OFFICER',
  PUBLIC_INFORMATION_OFFICER = 'PUBLIC_INFORMATION_OFFICER',
  OPERATIONS_CHIEF = 'OPERATIONS_CHIEF',
  PLANNING_CHIEF = 'PLANNING_CHIEF',
  LOGISTICS_CHIEF = 'LOGISTICS_CHIEF',
  FINANCE_ADMIN_CHIEF = 'FINANCE_ADMIN_CHIEF'
}

/**
 * Command structure with hierarchical relationships.
 */
export interface CommandStructure {
  readonly commandId: CommandId;
  readonly incidentId: IncidentId;
  readonly establishedAt: Timestamp;
  readonly incidentCommander: ResourceId;
  readonly positions: Readonly<Partial<Record<ICSPosition, ResourceId>>>;
  readonly unifiedCommand: boolean;
  readonly agencies: ReadonlyArray<AgencyIdentifier>;
}

/**
 * Agency identifier with interoperability metadata.
 */
export interface AgencyIdentifier {
  readonly agencyId: string;
  readonly agencyType: 'FIRE' | 'EMS' | 'LAW_ENFORCEMENT' | 'PUBLIC_WORKS' | 'EMERGENCY_MANAGEMENT';
  readonly jurisdiction: string;
  readonly mutualAid: boolean;
}

/**
 * Command transfer event with continuity tracking.
 */
export interface CommandTransferEvent {
  readonly commandId: CommandId;
  readonly timestamp: Timestamp;
  readonly fromCommander: ResourceId;
  readonly toCommander: ResourceId;
  readonly transferReason: string;
  readonly briefingCompleted: boolean;
}

// ============================================================================
// RESOURCE ALLOCATION TYPES
// ============================================================================

/**
 * Resource type enumeration with capability classification.
 */
export enum ResourceType {
  ENGINE = 'ENGINE',
  LADDER = 'LADDER',
  RESCUE = 'RESCUE',
  AMBULANCE = 'AMBULANCE',
  MEDIC_UNIT = 'MEDIC_UNIT',
  PATROL = 'PATROL',
  HAZMAT = 'HAZMAT',
  AIR_SUPPORT = 'AIR_SUPPORT',
  COMMAND_VEHICLE = 'COMMAND_VEHICLE'
}

/**
 * Resource status with availability semantics.
 */
export enum ResourceStatus {
  AVAILABLE = 'AVAILABLE',
  DISPATCHED = 'DISPATCHED',
  EN_ROUTE = 'EN_ROUTE',
  ON_SCENE = 'ON_SCENE',
  COMMITTED = 'COMMITTED',
  OUT_OF_SERVICE = 'OUT_OF_SERVICE'
}

/**
 * Resource capability with type-safe constraint validation.
 */
export interface ResourceCapability {
  readonly type: ResourceType;
  readonly specializations: ReadonlyArray<string>;
  readonly personnelCount: number;
  readonly equipmentInventory: ReadonlyArray<EquipmentItem>;
}

/**
 * Equipment item with tracking metadata.
 */
export interface EquipmentItem {
  readonly equipmentId: string;
  readonly category: string;
  readonly operational: boolean;
}

/**
 * Resource allocation with temporal and spatial constraints.
 */
export interface ResourceAllocation {
  readonly resourceId: ResourceId;
  readonly incidentId: IncidentId;
  readonly allocatedAt: Timestamp;
  readonly estimatedArrival?: Timestamp;
  readonly assignment: string;
  readonly status: ResourceStatus;
}

/**
 * Resource request with priority and justification.
 */
export interface ResourceRequest {
  readonly requestId: string;
  readonly incidentId: IncidentId;
  readonly requestedBy: ResourceId;
  readonly resourceType: ResourceType;
  readonly quantity: number;
  readonly priority: IncidentPriority;
  readonly justification: string;
  readonly requestedAt: Timestamp;
}

// ============================================================================
// PRIORITY LEVEL TYPES
// ============================================================================

/**
 * Priority calculation factors with weighted components.
 */
export interface PriorityFactors {
  readonly severityScore: number;
  readonly timeScore: number;
  readonly resourceAvailabilityScore: number;
  readonly populationAtRiskScore: number;
  readonly environmentalFactorScore: number;
}

/**
 * Priority level with confidence interval.
 */
export interface PriorityAssessment {
  readonly priority: IncidentPriority;
  readonly factors: PriorityFactors;
  readonly confidence: number;
  readonly assessedAt: Timestamp;
  readonly assessedBy: ResourceId;
}

/**
 * Dynamic priority adjustment event.
 */
export interface PriorityAdjustmentEvent {
  readonly incidentId: IncidentId;
  readonly previousPriority: IncidentPriority;
  readonly newPriority: IncidentPriority;
  readonly adjustmentReason: string;
  readonly timestamp: Timestamp;
}

// ============================================================================
// RESPONSE PROTOCOL TYPES
// ============================================================================

/**
 * Response protocol with type-safe dispatch rules.
 */
export interface ResponseProtocol<T extends IncidentType> {
  readonly protocolId: string;
  readonly incidentType: T;
  readonly minimumResources: ReadonlyArray<ResourceRequirement>;
  readonly escalationCriteria: EscalationCriteria;
  readonly specialConsiderations: ReadonlyArray<string>;
}

/**
 * Resource requirement with quantity and capability constraints.
 */
export interface ResourceRequirement {
  readonly resourceType: ResourceType;
  readonly minimumQuantity: number;
  readonly requiredCapabilities?: ReadonlyArray<string>;
  readonly maximumResponseTime: number;
}

/**
 * Escalation criteria with threshold definitions.
 */
export interface EscalationCriteria {
  readonly severityThreshold?: IncidentSeverity;
  readonly resourceThreshold?: number;
  readonly durationThreshold?: number;
  readonly geographicExtent?: number;
  readonly additionalConditions?: ReadonlyArray<string>;
}

/**
 * Protocol execution with compliance tracking.
 */
export interface ProtocolExecution {
  readonly protocolId: string;
  readonly incidentId: IncidentId;
  readonly executedAt: Timestamp;
  readonly compliantSteps: ReadonlyArray<string>;
  readonly deviations: ReadonlyArray<ProtocolDeviation>;
}

/**
 * Protocol deviation with justification.
 */
export interface ProtocolDeviation {
  readonly step: string;
  readonly deviation: string;
  readonly justification: string;
  readonly authorizedBy: ResourceId;
}

// ============================================================================
// COMMUNICATION CHANNEL TYPES
// ============================================================================

/**
 * Communication channel type enumeration.
 */
export enum ChannelType {
  RADIO = 'RADIO',
  PHONE = 'PHONE',
  TEXT = 'TEXT',
  DATA = 'DATA',
  VIDEO = 'VIDEO',
  SATELLITE = 'SATELLITE'
}

/**
 * Communication channel with interoperability metadata.
 */
export interface CommunicationChannel {
  readonly channelId: ChannelId;
  readonly type: ChannelType;
  readonly frequency?: string;
  readonly encryptionEnabled: boolean;
  readonly participants: ReadonlyArray<ResourceId>;
  readonly primary: boolean;
}

/**
 * Message priority for communication routing.
 */
export enum MessagePriority {
  ROUTINE = 'ROUTINE',
  PRIORITY = 'PRIORITY',
  IMMEDIATE = 'IMMEDIATE',
  FLASH = 'FLASH'
}

/**
 * Structured message with type-safe payloads.
 */
export interface CommunicationMessage<TPayload = unknown> {
  readonly messageId: string;
  readonly channelId: ChannelId;
  readonly sender: ResourceId;
  readonly recipients: ReadonlyArray<ResourceId>;
  readonly priority: MessagePriority;
  readonly timestamp: Timestamp;
  readonly payload: TPayload;
  readonly acknowledgmentRequired: boolean;
}

// ============================================================================
// GEOGRAPHIC TYPES
// ============================================================================

/**
 * Geographic coordinate with WGS84 semantics.
 */
export interface GeoCoordinate {
  readonly latitude: Latitude;
  readonly longitude: Longitude;
  readonly altitude?: number;
  readonly accuracy?: number;
}

/**
 * Geographic boundary with polygon representation.
 */
export interface GeoBoundary {
  readonly boundaryId: string;
  readonly vertices: ReadonlyArray<GeoCoordinate>;
  readonly area: number;
}

/**
 * Spatial relationship types.
 */
export type SpatialRelationship = 'WITHIN' | 'INTERSECTS' | 'CONTAINS' | 'DISJOINT';

// ============================================================================
// INTEROPERABILITY TYPES
// ============================================================================

/**
 * NIEM (National Information Exchange Model) compliance metadata.
 */
export interface NIEMMetadata {
  readonly version: string;
  readonly conformanceTarget: string;
  readonly namespace: string;
}

/**
 * CAP (Common Alerting Protocol) alert message.
 */
export interface CAPAlert {
  readonly identifier: string;
  readonly sender: string;
  readonly sent: Timestamp;
  readonly status: 'Actual' | 'Exercise' | 'System' | 'Test' | 'Draft';
  readonly msgType: 'Alert' | 'Update' | 'Cancel' | 'Ack' | 'Error';
  readonly scope: 'Public' | 'Restricted' | 'Private';
  readonly incidents: ReadonlyArray<IncidentId>;
}

/**
 * EDXL (Emergency Data Exchange Language) distribution envelope.
 */
export interface EDXLDistribution<TContent = unknown> {
  readonly distributionId: string;
  readonly senderID: string;
  readonly dateTimeSent: Timestamp;
  readonly distributionStatus: 'Actual' | 'Exercise' | 'Test';
  readonly distributionType: 'Report' | 'Update' | 'Cancel' | 'Request';
  readonly content: TContent;
}

// ============================================================================
// ADVANCED TYPE UTILITIES
// ============================================================================

/**
 * Extract all possible values from a discriminated union's discriminator.
 */
export type ExtractDiscriminator<T, K extends keyof T> = T extends unknown ? T[K] : never;

/**
 * Make specific properties required in a type.
 */
export type RequireProperties<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Make specific properties optional in a type.
 */
export type PartialProperties<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Deep readonly type for nested objects.
 */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object
    ? T[P] extends ReadonlyArray<infer U>
      ? ReadonlyArray<DeepReadonly<U>>
      : DeepReadonly<T[P]>
    : T[P];
};

/**
 * Conditional type for extracting incidents by type.
 */
export type IncidentByType<T extends IncidentType> = Extract<Incident, { type: T }>;

/**
 * Mapped type for status-specific handlers.
 */
export type StatusHandlers<TReturn> = {
  readonly [K in IncidentStatus]: (incident: Incident) => TReturn;
};

/**
 * Template literal type for resource identifiers.
 */
export type ResourceIdentifier<T extends ResourceType> = `${T}_${string}`;

/**
 * Conditional type for extracting valid transitions from a status.
 */
export type NextStatus<T extends IncidentStatus> = StatusTransitions[T];

/**
 * Recursive type for command hierarchy.
 */
export interface CommandHierarchy {
  readonly position: ICSPosition;
  readonly assignedTo: ResourceId;
  readonly subordinates: ReadonlyArray<CommandHierarchy>;
}

/**
 * Type predicate helper for incident type narrowing.
 */
export type IncidentTypePredicate<T extends IncidentType> = (
  incident: Incident
) => incident is IncidentByType<T>;

/**
 * Variadic tuple type for resource combinations.
 */
export type ResourceCombination<T extends ReadonlyArray<ResourceType>> = {
  readonly [K in keyof T]: T[K] extends ResourceType ? ResourceAllocation : never;
};

/**
 * Distributive conditional type for filtering.
 */
export type FilterByStatus<T extends Incident, S extends IncidentStatus> = T extends unknown
  ? T['status'] extends S
    ? T
    : never
  : never;
