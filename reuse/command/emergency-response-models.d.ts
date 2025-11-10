/**
 * @fileoverview Emergency Response Models Kit - Comprehensive Sequelize models for emergency management
 * @module reuse/command/emergency-response-models
 * @description Production-ready Sequelize model utilities for emergency response systems including
 * incident tracking, response unit management, emergency contacts, command post coordination,
 * mutual aid agreements, hazard assessments, and evacuation zone management.
 *
 * Key Features:
 * - Emergency incident models (fire, medical, hazmat, natural disaster)
 * - Response unit tracking (ambulance, fire truck, police, rescue)
 * - Emergency contact and notification models
 * - Incident command post and command structure models
 * - Mutual aid agreement and resource sharing models
 * - Emergency operations center (EOC) models
 * - Hazard assessment and risk evaluation models
 * - Evacuation zone and shelter management models
 * - Real-time status tracking and geolocation
 * - Incident timeline and chain of custody
 * - Resource allocation and deployment tracking
 * - Multi-agency coordination models
 *
 * @target Sequelize v6.x, Node 18+, TypeScript 5.x
 *
 * @security
 * - HIPAA compliance for medical incident data
 * - Sensitive information protection
 * - Audit trails for all critical operations
 * - Role-based access control support
 * - Encrypted communications metadata
 * - Chain of custody tracking
 * - Data retention and archival policies
 *
 * @example Basic emergency incident creation
 * ```typescript
 * import { createEmergencyIncidentModel, addIncidentPriority } from './emergency-response-models';
 *
 * const IncidentModel = createEmergencyIncidentModel(sequelize, {
 *   incidentType: 'FIRE',
 *   priority: 'HIGH'
 * });
 *
 * addIncidentPriority(IncidentModel);
 * addIncidentTimeline(IncidentModel);
 * ```
 *
 * @example Response unit tracking
 * ```typescript
 * import {
 *   createResponseUnitModel,
 *   addUnitAvailabilityTracking,
 *   addUnitLocationTracking
 * } from './emergency-response-models';
 *
 * const UnitModel = createResponseUnitModel(sequelize, 'Ambulance');
 * addUnitAvailabilityTracking(UnitModel);
 * addUnitLocationTracking(UnitModel);
 * addUnitDeploymentHistory(UnitModel);
 * ```
 *
 * @example Multi-agency coordination
 * ```typescript
 * import {
 *   createMutualAidAgreementModel,
 *   createIncidentCommandModel,
 *   linkAgenciesToIncident
 * } from './emergency-response-models';
 *
 * const agreement = await createMutualAidAgreement(sequelize, {
 *   requestingAgency: 'City Fire Dept',
 *   providingAgency: 'County Fire',
 *   resources: ['Engine 5', 'Ladder 3']
 * });
 * ```
 *
 * LOC: ER-MODEL-001
 * UPSTREAM: sequelize, @types/sequelize, ulid, crypto, geojson
 * DOWNSTREAM: emergency services, dispatch systems, command centers, CAD systems
 *
 * @version 1.0.0
 * @since 2025-11-09
 */
import { Model, ModelStatic, Sequelize, ModelOptions } from 'sequelize';
/**
 * @enum IncidentType
 * @description Types of emergency incidents
 */
export declare enum IncidentType {
    FIRE = "FIRE",
    MEDICAL = "MEDICAL",
    HAZMAT = "HAZMAT",
    NATURAL_DISASTER = "NATURAL_DISASTER",
    VEHICLE_ACCIDENT = "VEHICLE_ACCIDENT",
    RESCUE = "RESCUE",
    MASS_CASUALTY = "MASS_CASUALTY",
    ACTIVE_SHOOTER = "ACTIVE_SHOOTER",
    STRUCTURAL_COLLAPSE = "STRUCTURAL_COLLAPSE",
    FLOOD = "FLOOD",
    EARTHQUAKE = "EARTHQUAKE",
    TORNADO = "TORNADO",
    WILDFIRE = "WILDFIRE",
    EXPLOSION = "EXPLOSION",
    GAS_LEAK = "GAS_LEAK",
    POWER_OUTAGE = "POWER_OUTAGE",
    CIVIL_UNREST = "CIVIL_UNREST",
    OTHER = "OTHER"
}
/**
 * @enum IncidentPriority
 * @description Priority levels for emergency incidents
 */
export declare enum IncidentPriority {
    CRITICAL = "CRITICAL",// Life-threatening, immediate response
    HIGH = "HIGH",// Serious, urgent response needed
    MEDIUM = "MEDIUM",// Non-life-threatening, timely response
    LOW = "LOW",// Routine, standard response
    INFORMATIONAL = "INFORMATIONAL"
}
/**
 * @enum IncidentStatus
 * @description Status of emergency incidents
 */
export declare enum IncidentStatus {
    REPORTED = "REPORTED",
    DISPATCHED = "DISPATCHED",
    EN_ROUTE = "EN_ROUTE",
    ON_SCENE = "ON_SCENE",
    UNDER_CONTROL = "UNDER_CONTROL",
    RESOLVED = "RESOLVED",
    CANCELLED = "CANCELLED",
    TRANSFERRED = "TRANSFERRED"
}
/**
 * @enum ResponseUnitType
 * @description Types of emergency response units
 */
export declare enum ResponseUnitType {
    AMBULANCE = "AMBULANCE",
    FIRE_ENGINE = "FIRE_ENGINE",
    FIRE_TRUCK = "FIRE_TRUCK",
    LADDER_TRUCK = "LADDER_TRUCK",
    RESCUE_SQUAD = "RESCUE_SQUAD",
    HAZMAT_UNIT = "HAZMAT_UNIT",
    POLICE_CAR = "POLICE_CAR",
    POLICE_MOTORCYCLE = "POLICE_MOTORCYCLE",
    AIR_AMBULANCE = "AIR_AMBULANCE",
    WATER_RESCUE = "WATER_RESCUE",
    COMMAND_VEHICLE = "COMMAND_VEHICLE",
    SUPPORT_VEHICLE = "SUPPORT_VEHICLE",
    SPECIALIZED_EQUIPMENT = "SPECIALIZED_EQUIPMENT"
}
/**
 * @enum UnitAvailability
 * @description Availability status of response units
 */
export declare enum UnitAvailability {
    AVAILABLE = "AVAILABLE",
    DISPATCHED = "DISPATCHED",
    EN_ROUTE = "EN_ROUTE",
    ON_SCENE = "ON_SCENE",
    TRANSPORTING = "TRANSPORTING",
    AT_HOSPITAL = "AT_HOSPITAL",
    OUT_OF_SERVICE = "OUT_OF_SERVICE",
    MAINTENANCE = "MAINTENANCE",
    OFFLINE = "OFFLINE"
}
/**
 * @enum CommandRole
 * @description Incident command system roles
 */
export declare enum CommandRole {
    INCIDENT_COMMANDER = "INCIDENT_COMMANDER",
    OPERATIONS_CHIEF = "OPERATIONS_CHIEF",
    PLANNING_CHIEF = "PLANNING_CHIEF",
    LOGISTICS_CHIEF = "LOGISTICS_CHIEF",
    FINANCE_CHIEF = "FINANCE_CHIEF",
    SAFETY_OFFICER = "SAFETY_OFFICER",
    PUBLIC_INFO_OFFICER = "PUBLIC_INFO_OFFICER",
    LIAISON_OFFICER = "LIAISON_OFFICER",
    SECTOR_COMMANDER = "SECTOR_COMMANDER",
    DIVISION_SUPERVISOR = "DIVISION_SUPERVISOR"
}
/**
 * @enum HazardLevel
 * @description Hazard severity levels
 */
export declare enum HazardLevel {
    MINIMAL = "MINIMAL",
    LOW = "LOW",
    MODERATE = "MODERATE",
    HIGH = "HIGH",
    SEVERE = "SEVERE",
    EXTREME = "EXTREME"
}
/**
 * @enum EvacuationStatus
 * @description Status of evacuation zones
 */
export declare enum EvacuationStatus {
    NORMAL = "NORMAL",
    ADVISORY = "ADVISORY",
    VOLUNTARY = "VOLUNTARY",
    MANDATORY = "MANDATORY",
    COMPLETE = "COMPLETE",
    LIFTED = "LIFTED"
}
/**
 * @interface EmergencyIncidentAttributes
 * @description Emergency incident model attributes
 */
export interface EmergencyIncidentAttributes {
    id: string;
    incidentNumber: string;
    incidentType: IncidentType;
    priority: IncidentPriority;
    status: IncidentStatus;
    reportedAt: Date;
    dispatchedAt?: Date;
    arrivedAt?: Date;
    clearedAt?: Date;
    location: any;
    address: string;
    description: string;
    callerName?: string;
    callerPhone?: string;
    respondingUnits?: string[];
    incidentCommanderId?: string;
    estimatedPatients?: number;
    actualPatients?: number;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * @interface ResponseUnitAttributes
 * @description Response unit model attributes
 */
export interface ResponseUnitAttributes {
    id: string;
    unitNumber: string;
    unitType: ResponseUnitType;
    agency: string;
    availability: UnitAvailability;
    currentLocation?: any;
    homeStation: string;
    assignedPersonnel?: string[];
    currentIncidentId?: string;
    certifications?: string[];
    equipmentList?: string[];
    lastMaintenanceDate?: Date;
    nextMaintenanceDate?: Date;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * @interface IncidentCommandAttributes
 * @description Incident command structure attributes
 */
export interface IncidentCommandAttributes {
    id: string;
    incidentId: string;
    commandRole: CommandRole;
    personnelId: string;
    assignedAt: Date;
    relievedAt?: Date;
    sector?: string;
    responsibilities?: string[];
    metadata?: Record<string, any>;
}
/**
 * @interface MutualAidAgreementAttributes
 * @description Mutual aid agreement attributes
 */
export interface MutualAidAgreementAttributes {
    id: string;
    agreementNumber: string;
    requestingAgency: string;
    providingAgency: string;
    requestedAt: Date;
    approvedAt?: Date;
    deployedAt?: Date;
    releasedAt?: Date;
    incidentId?: string;
    resourcesRequested: string[];
    resourcesProvided?: string[];
    status: string;
    estimatedDuration?: number;
    actualDuration?: number;
    metadata?: Record<string, any>;
}
/**
 * Creates an emergency incident model
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Partial<ModelOptions>} [options={}] - Additional model options
 * @returns {ModelStatic<Model>} Emergency incident model
 *
 * @example
 * ```typescript
 * const Incident = createEmergencyIncidentModel(sequelize);
 * ```
 */
export declare const createEmergencyIncidentModel: (sequelize: Sequelize, options?: Partial<ModelOptions>) => ModelStatic<Model>;
/**
 * Adds automatic incident number generation
 *
 * @param {ModelStatic<Model>} model - Incident model
 * @param {string} [prefix='INC'] - Incident number prefix
 * @returns {void}
 *
 * @example
 * ```typescript
 * addIncidentNumberGenerator(IncidentModel, 'FIRE');
 * ```
 */
export declare const addIncidentNumberGenerator: (model: ModelStatic<Model>, prefix?: string) => void;
/**
 * Adds incident priority validation
 *
 * @param {ModelStatic<Model>} model - Incident model
 * @returns {void}
 *
 * @example
 * ```typescript
 * addIncidentPriorityValidation(IncidentModel);
 * ```
 */
export declare const addIncidentPriorityValidation: (model: ModelStatic<Model>) => void;
/**
 * Adds incident timeline tracking
 *
 * @param {ModelStatic<Model>} model - Incident model
 * @returns {void}
 *
 * @example
 * ```typescript
 * addIncidentTimeline(IncidentModel);
 * ```
 */
export declare const addIncidentTimeline: (model: ModelStatic<Model>) => void;
/**
 * Adds incident response time calculation
 *
 * @param {ModelStatic<Model>} model - Incident model
 * @returns {void}
 *
 * @example
 * ```typescript
 * addIncidentResponseTimeTracking(IncidentModel);
 * ```
 */
export declare const addIncidentResponseTimeTracking: (model: ModelStatic<Model>) => void;
/**
 * Adds incident geolocation validation
 *
 * @param {ModelStatic<Model>} model - Incident model
 * @returns {void}
 *
 * @example
 * ```typescript
 * addIncidentGeolocationValidation(IncidentModel);
 * ```
 */
export declare const addIncidentGeolocationValidation: (model: ModelStatic<Model>) => void;
/**
 * Creates a response unit model
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Partial<ModelOptions>} [options={}] - Additional model options
 * @returns {ModelStatic<Model>} Response unit model
 *
 * @example
 * ```typescript
 * const Unit = createResponseUnitModel(sequelize);
 * ```
 */
export declare const createResponseUnitModel: (sequelize: Sequelize, options?: Partial<ModelOptions>) => ModelStatic<Model>;
/**
 * Adds unit availability tracking
 *
 * @param {ModelStatic<Model>} model - Unit model
 * @returns {void}
 *
 * @example
 * ```typescript
 * addUnitAvailabilityTracking(UnitModel);
 * ```
 */
export declare const addUnitAvailabilityTracking: (model: ModelStatic<Model>) => void;
/**
 * Adds unit location tracking
 *
 * @param {ModelStatic<Model>} model - Unit model
 * @returns {void}
 *
 * @example
 * ```typescript
 * addUnitLocationTracking(UnitModel);
 * ```
 */
export declare const addUnitLocationTracking: (model: ModelStatic<Model>) => void;
/**
 * Adds unit deployment history
 *
 * @param {ModelStatic<Model>} model - Unit model
 * @returns {void}
 *
 * @example
 * ```typescript
 * addUnitDeploymentHistory(UnitModel);
 * ```
 */
export declare const addUnitDeploymentHistory: (model: ModelStatic<Model>) => void;
/**
 * Adds unit maintenance alerts
 *
 * @param {ModelStatic<Model>} model - Unit model
 * @returns {void}
 *
 * @example
 * ```typescript
 * addUnitMaintenanceAlerts(UnitModel);
 * ```
 */
export declare const addUnitMaintenanceAlerts: (model: ModelStatic<Model>) => void;
/**
 * Adds unit capability validation
 *
 * @param {ModelStatic<Model>} model - Unit model
 * @returns {void}
 *
 * @example
 * ```typescript
 * addUnitCapabilityValidation(UnitModel);
 * ```
 */
export declare const addUnitCapabilityValidation: (model: ModelStatic<Model>) => void;
/**
 * Creates incident command model
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Partial<ModelOptions>} [options={}] - Additional model options
 * @returns {ModelStatic<Model>} Incident command model
 *
 * @example
 * ```typescript
 * const Command = createIncidentCommandModel(sequelize);
 * ```
 */
export declare const createIncidentCommandModel: (sequelize: Sequelize, options?: Partial<ModelOptions>) => ModelStatic<Model>;
/**
 * Adds command chain validation
 *
 * @param {ModelStatic<Model>} model - Command model
 * @returns {void}
 *
 * @example
 * ```typescript
 * addCommandChainValidation(CommandModel);
 * ```
 */
export declare const addCommandChainValidation: (model: ModelStatic<Model>) => void;
/**
 * Adds command transfer tracking
 *
 * @param {ModelStatic<Model>} model - Command model
 * @returns {void}
 *
 * @example
 * ```typescript
 * addCommandTransferTracking(CommandModel);
 * ```
 */
export declare const addCommandTransferTracking: (model: ModelStatic<Model>) => void;
/**
 * Adds command duration tracking
 *
 * @param {ModelStatic<Model>} model - Command model
 * @returns {void}
 *
 * @example
 * ```typescript
 * addCommandDurationTracking(CommandModel);
 * ```
 */
export declare const addCommandDurationTracking: (model: ModelStatic<Model>) => void;
/**
 * Creates mutual aid agreement model
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Partial<ModelOptions>} [options={}] - Additional model options
 * @returns {ModelStatic<Model>} Mutual aid agreement model
 *
 * @example
 * ```typescript
 * const MutualAid = createMutualAidAgreementModel(sequelize);
 * ```
 */
export declare const createMutualAidAgreementModel: (sequelize: Sequelize, options?: Partial<ModelOptions>) => ModelStatic<Model>;
/**
 * Adds mutual aid agreement number generation
 *
 * @param {ModelStatic<Model>} model - Mutual aid model
 * @returns {void}
 *
 * @example
 * ```typescript
 * addMutualAidNumberGenerator(MutualAidModel);
 * ```
 */
export declare const addMutualAidNumberGenerator: (model: ModelStatic<Model>) => void;
/**
 * Adds mutual aid status workflow
 *
 * @param {ModelStatic<Model>} model - Mutual aid model
 * @returns {void}
 *
 * @example
 * ```typescript
 * addMutualAidStatusWorkflow(MutualAidModel);
 * ```
 */
export declare const addMutualAidStatusWorkflow: (model: ModelStatic<Model>) => void;
/**
 * Adds mutual aid resource tracking
 *
 * @param {ModelStatic<Model>} model - Mutual aid model
 * @returns {void}
 *
 * @example
 * ```typescript
 * addMutualAidResourceTracking(MutualAidModel);
 * ```
 */
export declare const addMutualAidResourceTracking: (model: ModelStatic<Model>) => void;
/**
 * Creates emergency operations center model
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Partial<ModelOptions>} [options={}] - Additional model options
 * @returns {ModelStatic<Model>} EOC model
 *
 * @example
 * ```typescript
 * const EOC = createEOCModel(sequelize);
 * ```
 */
export declare const createEOCModel: (sequelize: Sequelize, options?: Partial<ModelOptions>) => ModelStatic<Model>;
/**
 * Adds EOC activation tracking
 *
 * @param {ModelStatic<Model>} model - EOC model
 * @returns {void}
 *
 * @example
 * ```typescript
 * addEOCActivationTracking(EOCModel);
 * ```
 */
export declare const addEOCActivationTracking: (model: ModelStatic<Model>) => void;
/**
 * Adds EOC staffing validation
 *
 * @param {ModelStatic<Model>} model - EOC model
 * @returns {void}
 *
 * @example
 * ```typescript
 * addEOCStaffingValidation(EOCModel);
 * ```
 */
export declare const addEOCStaffingValidation: (model: ModelStatic<Model>) => void;
/**
 * Creates hazard assessment model
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Partial<ModelOptions>} [options={}] - Additional model options
 * @returns {ModelStatic<Model>} Hazard assessment model
 *
 * @example
 * ```typescript
 * const Hazard = createHazardAssessmentModel(sequelize);
 * ```
 */
export declare const createHazardAssessmentModel: (sequelize: Sequelize, options?: Partial<ModelOptions>) => ModelStatic<Model>;
/**
 * Adds hazard severity escalation
 *
 * @param {ModelStatic<Model>} model - Hazard assessment model
 * @returns {void}
 *
 * @example
 * ```typescript
 * addHazardSeverityEscalation(HazardModel);
 * ```
 */
export declare const addHazardSeverityEscalation: (model: ModelStatic<Model>) => void;
/**
 * Adds hazard evacuation recommendation
 *
 * @param {ModelStatic<Model>} model - Hazard assessment model
 * @returns {void}
 *
 * @example
 * ```typescript
 * addHazardEvacuationRecommendation(HazardModel);
 * ```
 */
export declare const addHazardEvacuationRecommendation: (model: ModelStatic<Model>) => void;
/**
 * Creates evacuation zone model
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Partial<ModelOptions>} [options={}] - Additional model options
 * @returns {ModelStatic<Model>} Evacuation zone model
 *
 * @example
 * ```typescript
 * const EvacZone = createEvacuationZoneModel(sequelize);
 * ```
 */
export declare const createEvacuationZoneModel: (sequelize: Sequelize, options?: Partial<ModelOptions>) => ModelStatic<Model>;
/**
 * Adds evacuation status tracking
 *
 * @param {ModelStatic<Model>} model - Evacuation zone model
 * @returns {void}
 *
 * @example
 * ```typescript
 * addEvacuationStatusTracking(EvacZoneModel);
 * ```
 */
export declare const addEvacuationStatusTracking: (model: ModelStatic<Model>) => void;
/**
 * Adds evacuation completion tracking
 *
 * @param {ModelStatic<Model>} model - Evacuation zone model
 * @returns {void}
 *
 * @example
 * ```typescript
 * addEvacuationCompletionTracking(EvacZoneModel);
 * ```
 */
export declare const addEvacuationCompletionTracking: (model: ModelStatic<Model>) => void;
/**
 * Adds evacuation zone overlap detection
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} zoneId - Zone ID to check
 * @returns {Promise<Model[]>} Overlapping zones
 *
 * @example
 * ```typescript
 * const overlaps = await findOverlappingEvacuationZones(sequelize, 'zone-123');
 * ```
 */
export declare const findOverlappingEvacuationZones: (sequelize: Sequelize, zoneId: string) => Promise<any[]>;
/**
 * Creates emergency contact model
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Partial<ModelOptions>} [options={}] - Additional model options
 * @returns {ModelStatic<Model>} Emergency contact model
 *
 * @example
 * ```typescript
 * const Contact = createEmergencyContactModel(sequelize);
 * ```
 */
export declare const createEmergencyContactModel: (sequelize: Sequelize, options?: Partial<ModelOptions>) => ModelStatic<Model>;
/**
 * Adds emergency contact validation
 *
 * @param {ModelStatic<Model>} model - Emergency contact model
 * @returns {void}
 *
 * @example
 * ```typescript
 * addEmergencyContactValidation(ContactModel);
 * ```
 */
export declare const addEmergencyContactValidation: (model: ModelStatic<Model>) => void;
/**
 * Adds contact notification tracking
 *
 * @param {ModelStatic<Model>} model - Emergency contact model
 * @returns {void}
 *
 * @example
 * ```typescript
 * addContactNotificationTracking(ContactModel);
 * ```
 */
export declare const addContactNotificationTracking: (model: ModelStatic<Model>) => void;
/**
 * Generates a ULID (Universally Unique Lexicographically Sortable Identifier)
 *
 * @returns {string} ULID string
 *
 * @example
 * ```typescript
 * const id = generateULID();
 * ```
 */
export declare const generateULID: () => string;
/**
 * Calculates distance between two geographic points
 *
 * @param {number} lat1 - Latitude of point 1
 * @param {number} lon1 - Longitude of point 1
 * @param {number} lat2 - Latitude of point 2
 * @param {number} lon2 - Longitude of point 2
 * @returns {number} Distance in meters
 *
 * @example
 * ```typescript
 * const distance = calculateDistance(40.7128, -74.0060, 34.0522, -118.2437);
 * ```
 */
export declare const calculateDistance: (lat1: number, lon1: number, lat2: number, lon2: number) => number;
/**
 * Finds nearest available units to a location
 *
 * @param {ModelStatic<Model>} unitModel - Unit model
 * @param {number} lat - Target latitude
 * @param {number} lng - Target longitude
 * @param {ResponseUnitType} [unitType] - Filter by unit type
 * @param {number} [limit=5] - Maximum number of units to return
 * @returns {Promise<Model[]>} Nearest available units
 *
 * @example
 * ```typescript
 * const units = await findNearestAvailableUnits(UnitModel, 40.7128, -74.0060, ResponseUnitType.AMBULANCE);
 * ```
 */
export declare const findNearestAvailableUnits: (unitModel: ModelStatic<Model>, lat: number, lng: number, unitType?: ResponseUnitType, limit?: number) => Promise<Model[]>;
/**
 * Creates incident notification payload
 *
 * @param {Model} incident - Incident instance
 * @param {Model[]} units - Responding units
 * @returns {Record<string, any>} Notification payload
 *
 * @example
 * ```typescript
 * const payload = createIncidentNotificationPayload(incident, units);
 * ```
 */
export declare const createIncidentNotificationPayload: (incident: any, units: any[]) => Record<string, any>;
/**
 * Validates incident command structure
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} incidentId - Incident ID
 * @returns {Promise<{ valid: boolean; missing: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const result = await validateIncidentCommandStructure(sequelize, 'incident-123');
 * ```
 */
export declare const validateIncidentCommandStructure: (sequelize: Sequelize, incidentId: string) => Promise<{
    valid: boolean;
    missing: string[];
}>;
/**
 * Generates incident summary report
 *
 * @param {Model} incident - Incident instance
 * @returns {Record<string, any>} Summary report
 *
 * @example
 * ```typescript
 * const summary = generateIncidentSummary(incident);
 * ```
 */
export declare const generateIncidentSummary: (incident: any) => Record<string, any>;
//# sourceMappingURL=emergency-response-models.d.ts.map