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
/**
 * Incident severity levels aligned with ICS standards
 */
export declare enum IncidentSeverity {
    MINOR = "minor",
    MODERATE = "moderate",
    MAJOR = "major",
    CRITICAL = "critical",
    CATASTROPHIC = "catastrophic"
}
/**
 * Incident status progression
 */
export declare enum IncidentStatus {
    REPORTED = "reported",
    DISPATCHED = "dispatched",
    RESPONDING = "responding",
    ON_SCENE = "on_scene",
    UNDER_CONTROL = "under_control",
    CONTAINED = "contained",
    CONTROLLED = "controlled",
    DEMOBILIZING = "demobilizing",
    CLOSED = "closed",
    CANCELLED = "cancelled"
}
/**
 * ICS incident types
 */
export declare enum IncidentType {
    STRUCTURE_FIRE = "structure_fire",
    WILDFIRE = "wildfire",
    VEHICLE_FIRE = "vehicle_fire",
    HAZMAT = "hazmat",
    MEDICAL_EMERGENCY = "medical_emergency",
    MASS_CASUALTY = "mass_casualty",
    TRAUMA = "trauma",
    CARDIAC_ARREST = "cardiac_arrest",
    VEHICLE_ACCIDENT = "vehicle_accident",
    RESCUE = "rescue",
    WATER_RESCUE = "water_rescue",
    TECHNICAL_RESCUE = "technical_rescue",
    NATURAL_DISASTER = "natural_disaster",
    TERRORIST_INCIDENT = "terrorist_incident",
    CIVIL_DISTURBANCE = "civil_disturbance",
    OTHER = "other"
}
/**
 * ICS organizational sections
 */
export declare enum ICSSection {
    COMMAND = "command",
    OPERATIONS = "operations",
    PLANNING = "planning",
    LOGISTICS = "logistics",
    FINANCE_ADMIN = "finance_admin"
}
/**
 * ICS command positions
 */
export declare enum ICSPosition {
    INCIDENT_COMMANDER = "incident_commander",
    SAFETY_OFFICER = "safety_officer",
    PUBLIC_INFO_OFFICER = "public_info_officer",
    LIAISON_OFFICER = "liaison_officer",
    OPERATIONS_CHIEF = "operations_chief",
    PLANNING_CHIEF = "planning_chief",
    LOGISTICS_CHIEF = "logistics_chief",
    FINANCE_CHIEF = "finance_chief",
    DIVISION_SUPERVISOR = "division_supervisor",
    BRANCH_DIRECTOR = "branch_director",
    STRIKE_TEAM_LEADER = "strike_team_leader",
    TASK_FORCE_LEADER = "task_force_leader"
}
/**
 * Resource request status
 */
export declare enum ResourceRequestStatus {
    REQUESTED = "requested",
    PENDING = "pending",
    APPROVED = "approved",
    DISPATCHED = "dispatched",
    STAGED = "staged",
    ASSIGNED = "assigned",
    RELEASED = "released",
    CANCELLED = "cancelled"
}
/**
 * Tactical objective status
 */
export declare enum ObjectiveStatus {
    PLANNED = "planned",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    DEFERRED = "deferred",
    CANCELLED = "cancelled"
}
/**
 * Action plan operational period
 */
export declare enum OperationalPeriod {
    TWELVE_HOURS = "12_hours",
    TWENTY_FOUR_HOURS = "24_hours",
    CUSTOM = "custom"
}
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
}
/**
 * Create incident DTO
 */
export declare class CreateIncidentDto {
    incidentType: IncidentType;
    severity: IncidentSeverity;
    description: string;
    latitude: number;
    longitude: number;
    address?: string;
    city?: string;
    state?: string;
    reportedBy: string;
    patientCount?: number;
    specialHazards?: string[];
    weatherConditions?: string;
}
/**
 * Update incident DTO
 */
export declare class UpdateIncidentDto {
    status?: IncidentStatus;
    severity?: IncidentSeverity;
    description?: string;
    patientCount?: number;
    structuresInvolved?: number;
    estimatedLoss?: number;
}
/**
 * Establish unified command DTO
 */
export declare class EstablishUnifiedCommandDto {
    agencies: string[];
    incidentCommanders: Array<{
        userId: string;
        agency: string;
        rank: string;
        name: string;
    }>;
    commandPost?: GeoLocation;
}
/**
 * Assign ICS position DTO
 */
export declare class AssignICSPositionDto {
    position: ICSPosition;
    section: ICSSection;
    assignedTo: string;
    assignedName: string;
    agency: string;
    notes?: string;
}
/**
 * Request resources DTO
 */
export declare class RequestResourcesDto {
    resourceType: string;
    quantity: number;
    priority: 'routine' | 'urgent' | 'emergency';
    justification: string;
    specialRequirements?: string[];
    requestedBy: string;
}
/**
 * Create tactical objective DTO
 */
export declare class CreateTacticalObjectiveDto {
    description: string;
    priority: number;
    assignedTo?: string;
    assignedSection?: ICSSection;
    targetCompletionTime?: Date;
    safetyConsiderations?: string[];
}
/**
 * Create incident action plan DTO
 */
export declare class CreateIncidentActionPlanDto {
    operationalPeriod: OperationalPeriod;
    periodStart: Date;
    periodEnd: Date;
    safetyMessage: string;
    communicationsPlan?: string;
}
/**
 * Create situation report DTO
 */
export declare class CreateSituationReportDto {
    currentSituation: string;
    personnel: number;
    apparatus: number;
    accomplishments?: string[];
    currentProblems?: string[];
    plannedActions?: string[];
    reportedBy: string;
}
/**
 * Transfer command DTO
 */
export declare class TransferCommandDto {
    toCommander: string;
    transferBriefing: string;
    witnessedBy?: string[];
    reason?: string;
}
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
export declare function createIncident(data: Omit<Incident, 'id' | 'incidentNumber' | 'status' | 'createdAt' | 'updatedAt' | 'priorityLevel'>, userId: string): Promise<Incident>;
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
export declare function generateIncidentNumber(type: IncidentType, location: GeoLocation): string;
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
export declare function classifyIncident(incident: Incident): {
    category: string;
    subcategory: string;
    nfirsCode?: string;
    resourceNeeds: string[];
    estimatedDuration: number;
};
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
export declare function calculateIncidentPriority(severity: IncidentSeverity, type: IncidentType): number;
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
export declare function escalateIncident(incidentId: string, newSeverity: IncidentSeverity, reason: string, userId: string): Promise<Incident>;
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
export declare function downgradeIncident(incidentId: string, newSeverity: IncidentSeverity, reason: string, userId: string): Promise<Incident>;
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
export declare function updateIncidentStatus(incidentId: string, newStatus: IncidentStatus, userId: string): Promise<Incident>;
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
export declare function validateStatusTransition(currentStatus: IncidentStatus, newStatus: IncidentStatus): void;
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
export declare function assignIncidentCommander(incidentId: string, commanderId: string, userId: string): Promise<Incident>;
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
export declare function getIncidentTimeline(incidentId: string): Promise<IncidentTimelineEntry[]>;
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
export declare function addTimelineEntry(incidentId: string, entry: Omit<IncidentTimelineEntry, 'id' | 'incidentId' | 'timestamp'>): Promise<IncidentTimelineEntry>;
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
export declare function establishUnifiedCommand(incidentId: string, data: Omit<UnifiedCommand, 'id' | 'incidentId' | 'establishedAt' | 'establishedBy' | 'isActive'>, userId: string): Promise<UnifiedCommand>;
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
export declare function requestMutualAid(incidentId: string, request: {
    requestingAgency: string;
    requestedFrom: string[];
    resources: string[];
    reason: string;
}): Promise<{
    id: string;
    status: string;
    eta?: Date;
}>;
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
export declare function coordinateMultiAgencyResponse(incidentId: string, coordination: {
    leadAgency: string;
    supportingAgencies: string[];
    communicationsChannel?: string;
    stagingArea?: GeoLocation;
}): Promise<{
    planId: string;
    assignments: Record<string, string[]>;
}>;
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
export declare function transferCommand(incidentId: string, transfer: Omit<CommandTransfer, 'id' | 'incidentId' | 'fromCommander' | 'transferredAt'>): Promise<CommandTransfer>;
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
export declare function assignICSPosition(incidentId: string, assignment: Omit<ICSAssignment, 'id' | 'incidentId' | 'assignedAt'>): Promise<ICSAssignment>;
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
export declare function relieveICSPosition(assignmentId: string, relievedBy: string): Promise<ICSAssignment>;
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
export declare function getICSOrganizationChart(incidentId: string): Promise<{
    command: ICSAssignment[];
    operations: ICSAssignment[];
    planning: ICSAssignment[];
    logistics: ICSAssignment[];
    financeAdmin: ICSAssignment[];
}>;
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
export declare function activateICSSection(incidentId: string, section: ICSSection, chief: Omit<ICSAssignment, 'id' | 'incidentId' | 'position' | 'section' | 'assignedAt'>): Promise<ICSAssignment>;
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
export declare function requestResources(incidentId: string, request: Omit<ResourceRequest, 'id' | 'incidentId' | 'requestNumber' | 'status' | 'requestedAt'>): Promise<ResourceRequest>;
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
export declare function generateResourceRequestNumber(incidentId: string): string;
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
export declare function approveResourceRequest(requestId: string, approvedBy: string): Promise<ResourceRequest>;
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
export declare function assignResourcesToRequest(requestId: string, resourceIds: string[], eta?: Date): Promise<ResourceRequest>;
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
export declare function releaseResources(incidentId: string, resourceIds: string[], releaseNotes: string): Promise<{
    releasedAt: Date;
    resourcesReleased: string[];
}>;
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
export declare function trackResourceAllocation(incidentId: string): Promise<{
    requested: number;
    assigned: number;
    onScene: number;
    staged: number;
    released: number;
}>;
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
export declare function createTacticalObjective(incidentId: string, objective: Omit<TacticalObjective, 'id' | 'incidentId' | 'objectiveNumber' | 'status' | 'createdAt' | 'updatedAt'>, userId: string): Promise<TacticalObjective>;
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
export declare function updateObjectiveStatus(objectiveId: string, status: ObjectiveStatus, notes?: string): Promise<TacticalObjective>;
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
export declare function getTacticalObjectives(incidentId: string): Promise<TacticalObjective[]>;
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
export declare function createIncidentActionPlan(incidentId: string, plan: Omit<IncidentActionPlan, 'id' | 'incidentId' | 'isActive' | 'createdAt'>, userId: string): Promise<IncidentActionPlan>;
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
export declare function approveIncidentActionPlan(planId: string, approvedBy: string): Promise<IncidentActionPlan>;
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
export declare function createSituationReport(incidentId: string, report: Omit<SituationReport, 'id' | 'incidentId' | 'reportNumber' | 'reportedAt'>): Promise<SituationReport>;
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
export declare function getSituationReports(incidentId: string): Promise<SituationReport[]>;
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
export declare function conductOperationalBriefing(incidentId: string, briefing: {
    briefingTime: Date;
    briefedBy: string;
    attendees: string[];
    topics: string[];
    notes?: string;
}): Promise<{
    id: string;
    briefingTime: Date;
}>;
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
export declare function createSafetyBriefing(incidentId: string, briefing: Omit<SafetyBriefing, 'id' | 'incidentId'>): Promise<SafetyBriefing>;
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
export declare function initiateDemobilization(incidentId: string, demobPlan: {
    phaseSequence: string[];
    estimatedDuration: number;
    resourceReleaseSchedule?: Record<string, Date>;
}, userId: string): Promise<{
    planId: string;
    status: string;
}>;
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
export declare function closeIncident(incidentId: string, closure: {
    finalNarrative: string;
    totalCost?: number;
    finalResourceCount?: number;
    lessonsLearned?: string[];
}, userId: string): Promise<Incident>;
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
export declare function generateIncidentSummary(incidentId: string): Promise<{
    incident: Incident;
    timeline: IncidentTimelineEntry[];
    objectives: TacticalObjective[];
    resources: any[];
    totalDuration: number;
    totalCost: number;
}>;
/**
 * Incident Command Controller
 * Provides RESTful API endpoints for incident command operations
 */
export declare class IncidentCommandController {
    /**
     * Create a new incident
     */
    create(createDto: CreateIncidentDto): Promise<Incident>;
    /**
     * Get all incidents with filtering
     */
    findAll(status?: IncidentStatus, severity?: IncidentSeverity): Promise<never[]>;
    /**
     * Get incident by ID
     */
    findOne(id: string): Promise<Incident>;
    /**
     * Update incident
     */
    update(id: string, updateDto: UpdateIncidentDto): Promise<Incident>;
    /**
     * Establish unified command
     */
    establishUnifiedCmd(id: string, dto: EstablishUnifiedCommandDto): Promise<UnifiedCommand>;
    /**
     * Assign ICS position
     */
    assignPosition(id: string, dto: AssignICSPositionDto): Promise<ICSAssignment>;
    /**
     * Request resources
     */
    requestRes(id: string, dto: RequestResourcesDto): Promise<ResourceRequest>;
    /**
     * Create tactical objective
     */
    createObjective(id: string, dto: CreateTacticalObjectiveDto): Promise<TacticalObjective>;
    /**
     * Create incident action plan
     */
    createIAP(id: string, dto: CreateIncidentActionPlanDto): Promise<IncidentActionPlan>;
    /**
     * Create situation report
     */
    createSitRep(id: string, dto: CreateSituationReportDto): Promise<SituationReport>;
    /**
     * Transfer command
     */
    transferCmd(id: string, dto: TransferCommandDto): Promise<CommandTransfer>;
    /**
     * Close incident
     */
    close(id: string, closure: {
        finalNarrative: string;
        lessonsLearned?: string[];
    }): Promise<Incident>;
}
declare const _default: {
    createIncident: typeof createIncident;
    generateIncidentNumber: typeof generateIncidentNumber;
    classifyIncident: typeof classifyIncident;
    calculateIncidentPriority: typeof calculateIncidentPriority;
    escalateIncident: typeof escalateIncident;
    downgradeIncident: typeof downgradeIncident;
    updateIncidentStatus: typeof updateIncidentStatus;
    validateStatusTransition: typeof validateStatusTransition;
    assignIncidentCommander: typeof assignIncidentCommander;
    getIncidentTimeline: typeof getIncidentTimeline;
    addTimelineEntry: typeof addTimelineEntry;
    establishUnifiedCommand: typeof establishUnifiedCommand;
    requestMutualAid: typeof requestMutualAid;
    coordinateMultiAgencyResponse: typeof coordinateMultiAgencyResponse;
    transferCommand: typeof transferCommand;
    assignICSPosition: typeof assignICSPosition;
    relieveICSPosition: typeof relieveICSPosition;
    getICSOrganizationChart: typeof getICSOrganizationChart;
    activateICSSection: typeof activateICSSection;
    requestResources: typeof requestResources;
    generateResourceRequestNumber: typeof generateResourceRequestNumber;
    approveResourceRequest: typeof approveResourceRequest;
    assignResourcesToRequest: typeof assignResourcesToRequest;
    releaseResources: typeof releaseResources;
    trackResourceAllocation: typeof trackResourceAllocation;
    createTacticalObjective: typeof createTacticalObjective;
    updateObjectiveStatus: typeof updateObjectiveStatus;
    getTacticalObjectives: typeof getTacticalObjectives;
    createIncidentActionPlan: typeof createIncidentActionPlan;
    approveIncidentActionPlan: typeof approveIncidentActionPlan;
    createSituationReport: typeof createSituationReport;
    getSituationReports: typeof getSituationReports;
    conductOperationalBriefing: typeof conductOperationalBriefing;
    createSafetyBriefing: typeof createSafetyBriefing;
    initiateDemobilization: typeof initiateDemobilization;
    closeIncident: typeof closeIncident;
    generateIncidentSummary: typeof generateIncidentSummary;
    IncidentCommandController: typeof IncidentCommandController;
};
export default _default;
//# sourceMappingURL=incident-command-controllers.d.ts.map