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
/**
 * Call priority levels (aligned with EMD/EPD standards)
 */
export declare enum CallPriority {
    IMMEDIATE = "immediate",// Life-threatening
    EMERGENCY = "emergency",// Critical, time-sensitive
    URGENT = "urgent",// Needs rapid response
    ROUTINE = "routine",// Standard response
    NON_EMERGENCY = "non_emergency"
}
/**
 * Call types (emergency categories)
 */
export declare enum CallType {
    MEDICAL_EMERGENCY = "medical_emergency",
    FIRE = "fire",
    VEHICLE_ACCIDENT = "vehicle_accident",
    ASSAULT = "assault",
    ROBBERY = "robbery",
    BURGLARY = "burglary",
    DOMESTIC_VIOLENCE = "domestic_violence",
    SUSPICIOUS_ACTIVITY = "suspicious_activity",
    WELFARE_CHECK = "welfare_check",
    OVERDOSE = "overdose",
    CARDIAC_ARREST = "cardiac_arrest",
    STROKE = "stroke",
    TRAUMA = "trauma",
    PSYCHIATRIC = "psychiatric",
    HAZMAT = "hazmat",
    WATER_RESCUE = "water_rescue",
    ELEVATOR_RESCUE = "elevator_rescue",
    ALARM = "alarm",
    PUBLIC_SERVICE = "public_service",
    OTHER = "other"
}
/**
 * Call for service status
 */
export declare enum CallStatus {
    PENDING = "pending",
    TRIAGED = "triaged",
    DISPATCHED = "dispatched",
    EN_ROUTE = "en_route",
    ON_SCENE = "on_scene",
    TRANSPORTING = "transporting",
    AT_HOSPITAL = "at_hospital",
    COMPLETED = "completed",
    CANCELLED = "cancelled",
    DUPLICATE = "duplicate"
}
/**
 * Unit status codes
 */
export declare enum UnitStatus {
    AVAILABLE = "available",// In service, available
    UNAVAILABLE = "unavailable",// Out of service
    DISPATCHED = "dispatched",// Assigned to call
    EN_ROUTE = "en_route",// Responding to call
    STAGED = "staged",// Staged near incident
    ON_SCENE = "on_scene",// Arrived at scene
    TRANSPORTING = "transporting",// Transporting patient
    AT_HOSPITAL = "at_hospital",// At hospital
    IN_QUARTERS = "in_quarters",// At station
    TRAINING = "training",// Training exercise
    MEAL_BREAK = "meal_break",// Meal break
    MECHANICAL = "mechanical",// Mechanical issue
    REFUELING = "refueling"
}
/**
 * Unit types
 */
export declare enum UnitType {
    ENGINE = "engine",
    LADDER = "ladder",
    RESCUE = "rescue",
    AMBULANCE = "ambulance",
    PARAMEDIC = "paramedic",
    CHIEF = "chief",
    BATTALION_CHIEF = "battalion_chief",
    HAZMAT = "hazmat",
    MARINE = "marine",
    AIR_AMBULANCE = "air_ambulance",
    PATROL = "patrol",
    K9 = "k9",
    SWAT = "swat",
    MOBILE_COMMAND = "mobile_command"
}
/**
 * Dispatch console status
 */
export declare enum ConsoleStatus {
    ACTIVE = "active",
    LOGGED_OUT = "logged_out",
    BREAK = "break",
    TRAINING = "training",
    EMERGENCY_OVERRIDE = "emergency_override"
}
/**
 * Queue management priority
 */
export declare enum QueuePriority {
    CRITICAL = "critical",
    HIGH = "high",
    MEDIUM = "medium",
    LOW = "low",
    HOLD = "hold"
}
/**
 * Response plan types
 */
export declare enum ResponsePlanType {
    STANDARD = "standard",
    FULL_ASSIGNMENT = "full_assignment",
    WORKING_FIRE = "working_fire",
    MASS_CASUALTY = "mass_casualty",
    HAZMAT = "hazmat",
    TECHNICAL_RESCUE = "technical_rescue",
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
    medicalPriority?: string;
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
    determinantCode?: string;
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
/**
 * Create call for service DTO
 */
export declare class CreateCallForServiceDto {
    callType: CallType;
    priority: CallPriority;
    latitude: number;
    longitude: number;
    address?: string;
    callerName?: string;
    callerPhone?: string;
    chiefComplaint: string;
    additionalInfo?: string;
    patientCount?: number;
    weaponsInvolved?: boolean;
    callTaker: string;
    crossStreets?: string;
}
/**
 * Triage call DTO
 */
export declare class TriageCallDto {
    determinantCode?: string;
    priorityLevel: CallPriority;
    recommendedResponse: string[];
    conscious?: boolean;
    breathing?: boolean;
    symptoms?: string[];
    triageNotes?: string;
    triagedBy: string;
}
/**
 * Dispatch units DTO
 */
export declare class DispatchUnitsDto {
    unitIds: string[];
    dispatchedBy: string;
    specialInstructions?: string[];
    estimatedArrival?: Date;
}
/**
 * Update unit status DTO
 */
export declare class UpdateUnitStatusDto {
    status: UnitStatus;
    latitude?: number;
    longitude?: number;
    notes?: string;
    updatedBy: string;
}
/**
 * Create geographic zone DTO
 */
export declare class CreateGeographicZoneDto {
    zoneName: string;
    zoneType: 'fire' | 'ems' | 'police';
    north: number;
    south: number;
    east: number;
    west: number;
    assignedUnits: string[];
}
/**
 * Update console status DTO
 */
export declare class UpdateConsoleStatusDto {
    status: ConsoleStatus;
    dispatcherId?: string;
    assignedZones?: string[];
}
/**
 * Pre-arrival instructions DTO
 */
export declare class DeliverPreArrivalInstructionsDto {
    instructionType: string;
    instructions: string[];
    deliveredBy: string;
}
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
export declare function createCallForService(data: Omit<CallForService, 'id' | 'callNumber' | 'status' | 'createdAt' | 'updatedAt' | 'receivedAt' | 'assignedUnits'>, userId: string): Promise<CallForService>;
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
export declare function generateCallNumber(callType: CallType, location: GeoLocation): string;
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
export declare function triageEmergencyCall(callId: string, triage: Omit<CallTriage, 'id' | 'callId' | 'triagedAt' | 'chiefComplaint'>): Promise<CallTriage>;
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
export declare function applyEMDProtocol(callId: string, cardNumber: string): Promise<{
    cardTitle: string;
    determinants: string[];
    preArrivalInstructions: string[];
    recommendedResponse: string[];
}>;
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
export declare function deliverPreArrivalInstructions(callId: string, instructions: Omit<PreArrivalInstructions, 'id' | 'callId' | 'startedAt'>): Promise<PreArrivalInstructions>;
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
export declare function validateCallerLocation(phoneNumber: string): Promise<{
    isValid: boolean;
    location?: GeoLocation;
    confidence: number;
    source: 'ANI/ALI' | 'GPS' | 'CELL_TOWER' | 'MANUAL';
}>;
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
export declare function transferCall(callId: string, targetAgency: string, transferReason: string, transferredBy: string): Promise<{
    transferred: boolean;
    transferTime: Date;
    targetAgency: string;
}>;
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
export declare function dispatchUnits(callId: string, unitIds: string[], dispatchedBy: string): Promise<UnitDispatch[]>;
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
export declare function recommendUnitsForCall(callId: string, criteria: {
    requireALS?: boolean;
    requireBLS?: boolean;
    maxResponseTime?: number;
    preferredZone?: string;
    unitTypes?: UnitType[];
}): Promise<Array<{
    unitId: string;
    unitNumber: string;
    estimatedResponseTime: number;
    distance: number;
    score: number;
}>>;
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
export declare function calculateOptimalRoute(unitId: string, destination: GeoLocation): Promise<{
    distance: number;
    estimatedTime: number;
    route: GeoLocation[];
    useEmergencyRoute: boolean;
}>;
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
export declare function dispatchByResponsePlan(callId: string, responsePlanId: string, dispatchedBy: string): Promise<{
    dispatched: UnitDispatch[];
    pending: string[];
}>;
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
export declare function addUnitsToCall(callId: string, additionalUnits: string[], reason: string, dispatchedBy: string): Promise<UnitDispatch[]>;
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
export declare function cancelUnitDispatch(dispatchId: string, cancelReason: string, cancelledBy: string): Promise<UnitDispatch>;
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
export declare function updateUnitStatus(unitId: string, update: Partial<Unit> & {
    status: UnitStatus;
}): Promise<Unit>;
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
export declare function trackUnitResponseTime(dispatchId: string): Promise<{
    dispatchToEnRoute: number;
    enRouteToArrival: number;
    totalResponseTime: number;
    meetsStandard: boolean;
}>;
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
export declare function getAvailableUnits(criteria: {
    zone?: string;
    unitTypes?: UnitType[];
    requireALS?: boolean;
}): Promise<Unit[]>;
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
export declare function updateUnitLocationFromAVL(unitId: string, avlData: Omit<AVLUpdate, 'id' | 'unitId' | 'timestamp'>): Promise<AVLUpdate>;
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
export declare function clearUnit(unitId: string, disposition: string, clearedBy: string): Promise<Unit>;
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
export declare function addToDispatchQueue(callId: string, priority: QueuePriority): Promise<DispatchQueueEntry>;
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
export declare function prioritizeDispatchQueue(queueEntries: DispatchQueueEntry[]): DispatchQueueEntry[];
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
export declare function getDispatchQueue(): Promise<DispatchQueueEntry[]>;
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
export declare function removeFromDispatchQueue(callId: string): Promise<boolean>;
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
export declare function escalateQueuedCall(queueEntryId: string, newPriority: QueuePriority, reason: string): Promise<DispatchQueueEntry>;
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
export declare function createGeographicZone(zone: Omit<GeographicZone, 'id' | 'isActive'>): Promise<GeographicZone>;
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
export declare function determineZoneForLocation(location: GeoLocation): Promise<string | null>;
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
export declare function getZoneCoverageStats(zoneId: string): Promise<{
    availableUnits: number;
    busyUnits: number;
    averageResponseTime: number;
    activeCalls: number;
}>;
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
export declare function assignUnitToZone(unitId: string, zoneId: string): Promise<Unit>;
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
export declare function loginToConsole(consoleId: string, dispatcherId: string, dispatcherName: string): Promise<DispatchConsole>;
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
export declare function logoutFromConsole(consoleId: string): Promise<DispatchConsole>;
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
export declare function transferCallsBetweenConsoles(callIds: string[], fromConsoleId: string, toConsoleId: string): Promise<{
    transferred: string[];
    failed: string[];
}>;
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
export declare function getActiveConsoles(): Promise<DispatchConsole[]>;
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
export declare function monitorConsolePerformance(consoleId: string, period: number): Promise<{
    callsHandled: number;
    averageCallDuration: number;
    dispatchTime: number;
    transferRate: number;
}>;
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
export declare function updateCallStatus(callId: string, newStatus: CallStatus): Promise<CallForService>;
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
export declare function closeCallForService(callId: string, disposition: string, closedBy: string): Promise<CallForService>;
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
export declare function cancelCallForService(callId: string, cancelReason: string, cancelledBy: string): Promise<CallForService>;
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
export declare function mergeDuplicateCalls(primaryCallId: string, duplicateCallIds: string[], mergedBy: string): Promise<CallForService>;
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
export declare function generateCallStatistics(period: {
    hours: number;
}): Promise<{
    totalCalls: number;
    byPriority: Record<CallPriority, number>;
    byType: Record<CallType, number>;
    averageResponseTime: number;
    callsPerHour: number;
}>;
/**
 * Dispatch Command Controller
 * Provides RESTful API endpoints for dispatch operations
 */
export declare class DispatchCommandController {
    /**
     * Create a new call for service
     */
    createCall(createDto: CreateCallForServiceDto): Promise<CallForService>;
    /**
     * Triage emergency call
     */
    triageCall(id: string, dto: TriageCallDto): Promise<CallTriage>;
    /**
     * Dispatch units to call
     */
    dispatch(id: string, dto: DispatchUnitsDto): Promise<UnitDispatch[]>;
    /**
     * Update unit status
     */
    updateStatus(id: string, dto: UpdateUnitStatusDto): Promise<Unit>;
    /**
     * Get available units
     */
    getAvailable(zone?: string): Promise<Unit[]>;
    /**
     * Get dispatch queue
     */
    getQueue(): Promise<DispatchQueueEntry[]>;
    /**
     * Close call
     */
    closeCall(id: string, data: {
        disposition: string;
        closedBy: string;
    }): Promise<CallForService>;
    /**
     * Create geographic zone
     */
    createZone(dto: CreateGeographicZoneDto): Promise<GeographicZone>;
}
declare const _default: {
    createCallForService: typeof createCallForService;
    generateCallNumber: typeof generateCallNumber;
    triageEmergencyCall: typeof triageEmergencyCall;
    applyEMDProtocol: typeof applyEMDProtocol;
    deliverPreArrivalInstructions: typeof deliverPreArrivalInstructions;
    validateCallerLocation: typeof validateCallerLocation;
    transferCall: typeof transferCall;
    dispatchUnits: typeof dispatchUnits;
    recommendUnitsForCall: typeof recommendUnitsForCall;
    calculateOptimalRoute: typeof calculateOptimalRoute;
    dispatchByResponsePlan: typeof dispatchByResponsePlan;
    addUnitsToCall: typeof addUnitsToCall;
    cancelUnitDispatch: typeof cancelUnitDispatch;
    updateUnitStatus: typeof updateUnitStatus;
    trackUnitResponseTime: typeof trackUnitResponseTime;
    getAvailableUnits: typeof getAvailableUnits;
    updateUnitLocationFromAVL: typeof updateUnitLocationFromAVL;
    clearUnit: typeof clearUnit;
    addToDispatchQueue: typeof addToDispatchQueue;
    prioritizeDispatchQueue: typeof prioritizeDispatchQueue;
    getDispatchQueue: typeof getDispatchQueue;
    removeFromDispatchQueue: typeof removeFromDispatchQueue;
    escalateQueuedCall: typeof escalateQueuedCall;
    createGeographicZone: typeof createGeographicZone;
    determineZoneForLocation: typeof determineZoneForLocation;
    getZoneCoverageStats: typeof getZoneCoverageStats;
    assignUnitToZone: typeof assignUnitToZone;
    loginToConsole: typeof loginToConsole;
    logoutFromConsole: typeof logoutFromConsole;
    transferCallsBetweenConsoles: typeof transferCallsBetweenConsoles;
    getActiveConsoles: typeof getActiveConsoles;
    monitorConsolePerformance: typeof monitorConsolePerformance;
    updateCallStatus: typeof updateCallStatus;
    closeCallForService: typeof closeCallForService;
    cancelCallForService: typeof cancelCallForService;
    mergeDuplicateCalls: typeof mergeDuplicateCalls;
    generateCallStatistics: typeof generateCallStatistics;
    DispatchCommandController: typeof DispatchCommandController;
};
export default _default;
//# sourceMappingURL=dispatch-command-controllers.d.ts.map