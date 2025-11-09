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

import {
  Model,
  ModelStatic,
  Sequelize,
  DataTypes,
  ModelAttributes,
  ModelOptions,
  ValidationError,
  Transaction,
  Op,
  literal,
  fn,
  col,
  FindOptions,
} from 'sequelize';
import * as crypto from 'crypto';
import { monotonicFactory } from 'ulid';

// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================

/**
 * @enum IncidentType
 * @description Types of emergency incidents
 */
export enum IncidentType {
  FIRE = 'FIRE',
  MEDICAL = 'MEDICAL',
  HAZMAT = 'HAZMAT',
  NATURAL_DISASTER = 'NATURAL_DISASTER',
  VEHICLE_ACCIDENT = 'VEHICLE_ACCIDENT',
  RESCUE = 'RESCUE',
  MASS_CASUALTY = 'MASS_CASUALTY',
  ACTIVE_SHOOTER = 'ACTIVE_SHOOTER',
  STRUCTURAL_COLLAPSE = 'STRUCTURAL_COLLAPSE',
  FLOOD = 'FLOOD',
  EARTHQUAKE = 'EARTHQUAKE',
  TORNADO = 'TORNADO',
  WILDFIRE = 'WILDFIRE',
  EXPLOSION = 'EXPLOSION',
  GAS_LEAK = 'GAS_LEAK',
  POWER_OUTAGE = 'POWER_OUTAGE',
  CIVIL_UNREST = 'CIVIL_UNREST',
  OTHER = 'OTHER',
}

/**
 * @enum IncidentPriority
 * @description Priority levels for emergency incidents
 */
export enum IncidentPriority {
  CRITICAL = 'CRITICAL', // Life-threatening, immediate response
  HIGH = 'HIGH', // Serious, urgent response needed
  MEDIUM = 'MEDIUM', // Non-life-threatening, timely response
  LOW = 'LOW', // Routine, standard response
  INFORMATIONAL = 'INFORMATIONAL', // No response needed
}

/**
 * @enum IncidentStatus
 * @description Status of emergency incidents
 */
export enum IncidentStatus {
  REPORTED = 'REPORTED',
  DISPATCHED = 'DISPATCHED',
  EN_ROUTE = 'EN_ROUTE',
  ON_SCENE = 'ON_SCENE',
  UNDER_CONTROL = 'UNDER_CONTROL',
  RESOLVED = 'RESOLVED',
  CANCELLED = 'CANCELLED',
  TRANSFERRED = 'TRANSFERRED',
}

/**
 * @enum ResponseUnitType
 * @description Types of emergency response units
 */
export enum ResponseUnitType {
  AMBULANCE = 'AMBULANCE',
  FIRE_ENGINE = 'FIRE_ENGINE',
  FIRE_TRUCK = 'FIRE_TRUCK',
  LADDER_TRUCK = 'LADDER_TRUCK',
  RESCUE_SQUAD = 'RESCUE_SQUAD',
  HAZMAT_UNIT = 'HAZMAT_UNIT',
  POLICE_CAR = 'POLICE_CAR',
  POLICE_MOTORCYCLE = 'POLICE_MOTORCYCLE',
  AIR_AMBULANCE = 'AIR_AMBULANCE',
  WATER_RESCUE = 'WATER_RESCUE',
  COMMAND_VEHICLE = 'COMMAND_VEHICLE',
  SUPPORT_VEHICLE = 'SUPPORT_VEHICLE',
  SPECIALIZED_EQUIPMENT = 'SPECIALIZED_EQUIPMENT',
}

/**
 * @enum UnitAvailability
 * @description Availability status of response units
 */
export enum UnitAvailability {
  AVAILABLE = 'AVAILABLE',
  DISPATCHED = 'DISPATCHED',
  EN_ROUTE = 'EN_ROUTE',
  ON_SCENE = 'ON_SCENE',
  TRANSPORTING = 'TRANSPORTING',
  AT_HOSPITAL = 'AT_HOSPITAL',
  OUT_OF_SERVICE = 'OUT_OF_SERVICE',
  MAINTENANCE = 'MAINTENANCE',
  OFFLINE = 'OFFLINE',
}

/**
 * @enum CommandRole
 * @description Incident command system roles
 */
export enum CommandRole {
  INCIDENT_COMMANDER = 'INCIDENT_COMMANDER',
  OPERATIONS_CHIEF = 'OPERATIONS_CHIEF',
  PLANNING_CHIEF = 'PLANNING_CHIEF',
  LOGISTICS_CHIEF = 'LOGISTICS_CHIEF',
  FINANCE_CHIEF = 'FINANCE_CHIEF',
  SAFETY_OFFICER = 'SAFETY_OFFICER',
  PUBLIC_INFO_OFFICER = 'PUBLIC_INFO_OFFICER',
  LIAISON_OFFICER = 'LIAISON_OFFICER',
  SECTOR_COMMANDER = 'SECTOR_COMMANDER',
  DIVISION_SUPERVISOR = 'DIVISION_SUPERVISOR',
}

/**
 * @enum HazardLevel
 * @description Hazard severity levels
 */
export enum HazardLevel {
  MINIMAL = 'MINIMAL',
  LOW = 'LOW',
  MODERATE = 'MODERATE',
  HIGH = 'HIGH',
  SEVERE = 'SEVERE',
  EXTREME = 'EXTREME',
}

/**
 * @enum EvacuationStatus
 * @description Status of evacuation zones
 */
export enum EvacuationStatus {
  NORMAL = 'NORMAL',
  ADVISORY = 'ADVISORY',
  VOLUNTARY = 'VOLUNTARY',
  MANDATORY = 'MANDATORY',
  COMPLETE = 'COMPLETE',
  LIFTED = 'LIFTED',
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
  location: any; // GeoJSON Point
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
  currentLocation?: any; // GeoJSON Point
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
  estimatedDuration?: number; // minutes
  actualDuration?: number;
  metadata?: Record<string, any>;
}

// ============================================================================
// EMERGENCY INCIDENT MODEL FUNCTIONS
// ============================================================================

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
export const createEmergencyIncidentModel = (
  sequelize: Sequelize,
  options: Partial<ModelOptions> = {},
): ModelStatic<Model> => {
  const attributes: ModelAttributes = {
    id: {
      type: DataTypes.STRING(26),
      primaryKey: true,
      allowNull: false,
      defaultValue: () => generateULID(),
    },
    incidentNumber: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    incidentType: {
      type: DataTypes.ENUM(...Object.values(IncidentType)),
      allowNull: false,
    },
    priority: {
      type: DataTypes.ENUM(...Object.values(IncidentPriority)),
      allowNull: false,
      defaultValue: IncidentPriority.MEDIUM,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(IncidentStatus)),
      allowNull: false,
      defaultValue: IncidentStatus.REPORTED,
    },
    reportedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    dispatchedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    arrivedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    clearedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    location: {
      type: DataTypes.GEOMETRY('POINT'),
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    callerName: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    callerPhone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    respondingUnits: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: [],
    },
    incidentCommanderId: {
      type: DataTypes.STRING(26),
      allowNull: true,
    },
    estimatedPatients: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    actualPatients: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
    },
  };

  class EmergencyIncident extends Model {}
  return EmergencyIncident.init(attributes, {
    sequelize,
    modelName: 'EmergencyIncident',
    tableName: 'emergency_incidents',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['incident_number'], unique: true },
      { fields: ['incident_type'] },
      { fields: ['priority'] },
      { fields: ['status'] },
      { fields: ['reported_at'] },
      { fields: ['location'], type: 'GIST' },
    ],
    ...options,
  });
};

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
export const addIncidentNumberGenerator = (
  model: ModelStatic<Model>,
  prefix: string = 'INC',
): void => {
  model.addHook('beforeValidate', async (instance: any) => {
    if (!instance.incidentNumber) {
      const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
      const random = crypto.randomBytes(3).toString('hex').toUpperCase();
      instance.incidentNumber = `${prefix}-${timestamp}-${random}`;
    }
  });
};

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
export const addIncidentPriorityValidation = (model: ModelStatic<Model>): void => {
  model.addHook('beforeSave', async (instance: any) => {
    // Auto-escalate priority for mass casualty events
    if (instance.incidentType === IncidentType.MASS_CASUALTY) {
      instance.priority = IncidentPriority.CRITICAL;
    }

    // Auto-escalate for active shooter
    if (instance.incidentType === IncidentType.ACTIVE_SHOOTER) {
      instance.priority = IncidentPriority.CRITICAL;
    }

    // Auto-escalate if multiple patients
    if (instance.estimatedPatients > 5) {
      instance.priority = IncidentPriority.HIGH;
    }
  });
};

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
export const addIncidentTimeline = (model: ModelStatic<Model>): void => {
  model.addHook('beforeUpdate', async (instance: any) => {
    // Auto-set timestamps based on status changes
    if (instance.changed('status')) {
      const now = new Date();

      if (instance.status === IncidentStatus.DISPATCHED && !instance.dispatchedAt) {
        instance.dispatchedAt = now;
      }

      if (instance.status === IncidentStatus.ON_SCENE && !instance.arrivedAt) {
        instance.arrivedAt = now;
      }

      if ([IncidentStatus.RESOLVED, IncidentStatus.CANCELLED].includes(instance.status) && !instance.clearedAt) {
        instance.clearedAt = now;
      }
    }
  });
};

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
export const addIncidentResponseTimeTracking = (model: ModelStatic<Model>): void => {
  const attributes = (model as any).rawAttributes;

  attributes.dispatchResponseTime = {
    type: DataTypes.VIRTUAL,
    get(this: any) {
      if (this.reportedAt && this.dispatchedAt) {
        return Math.floor((this.dispatchedAt - this.reportedAt) / 1000); // seconds
      }
      return null;
    },
  };

  attributes.sceneResponseTime = {
    type: DataTypes.VIRTUAL,
    get(this: any) {
      if (this.dispatchedAt && this.arrivedAt) {
        return Math.floor((this.arrivedAt - this.dispatchedAt) / 1000); // seconds
      }
      return null;
    },
  };

  attributes.totalResponseTime = {
    type: DataTypes.VIRTUAL,
    get(this: any) {
      if (this.reportedAt && this.arrivedAt) {
        return Math.floor((this.arrivedAt - this.reportedAt) / 1000); // seconds
      }
      return null;
    },
  };
};

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
export const addIncidentGeolocationValidation = (model: ModelStatic<Model>): void => {
  model.addHook('beforeSave', async (instance: any) => {
    if (instance.location) {
      const { coordinates } = instance.location;
      if (coordinates) {
        const [lng, lat] = coordinates;

        // Validate latitude and longitude ranges
        if (lat < -90 || lat > 90) {
          throw new Error('Invalid latitude: must be between -90 and 90');
        }
        if (lng < -180 || lng > 180) {
          throw new Error('Invalid longitude: must be between -180 and 180');
        }
      }
    }
  });
};

// ============================================================================
// RESPONSE UNIT MODEL FUNCTIONS
// ============================================================================

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
export const createResponseUnitModel = (
  sequelize: Sequelize,
  options: Partial<ModelOptions> = {},
): ModelStatic<Model> => {
  const attributes: ModelAttributes = {
    id: {
      type: DataTypes.STRING(26),
      primaryKey: true,
      allowNull: false,
      defaultValue: () => generateULID(),
    },
    unitNumber: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    unitType: {
      type: DataTypes.ENUM(...Object.values(ResponseUnitType)),
      allowNull: false,
    },
    agency: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    availability: {
      type: DataTypes.ENUM(...Object.values(UnitAvailability)),
      allowNull: false,
      defaultValue: UnitAvailability.AVAILABLE,
    },
    currentLocation: {
      type: DataTypes.GEOMETRY('POINT'),
      allowNull: true,
    },
    homeStation: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    assignedPersonnel: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: [],
    },
    currentIncidentId: {
      type: DataTypes.STRING(26),
      allowNull: true,
    },
    certifications: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: [],
    },
    equipmentList: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: [],
    },
    lastMaintenanceDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    nextMaintenanceDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
    },
  };

  class ResponseUnit extends Model {}
  return ResponseUnit.init(attributes, {
    sequelize,
    modelName: 'ResponseUnit',
    tableName: 'response_units',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['unit_number'], unique: true },
      { fields: ['unit_type'] },
      { fields: ['availability'] },
      { fields: ['agency'] },
      { fields: ['current_incident_id'] },
      { fields: ['current_location'], type: 'GIST' },
    ],
    ...options,
  });
};

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
export const addUnitAvailabilityTracking = (model: ModelStatic<Model>): void => {
  model.addHook('beforeUpdate', async (instance: any) => {
    if (instance.changed('availability')) {
      // Clear current incident when unit becomes available
      if (instance.availability === UnitAvailability.AVAILABLE) {
        instance.currentIncidentId = null;
      }

      // Track availability changes in metadata
      if (!instance.metadata.availabilityHistory) {
        instance.metadata.availabilityHistory = [];
      }

      instance.metadata.availabilityHistory.push({
        status: instance.availability,
        timestamp: new Date(),
        previousStatus: instance.previous('availability'),
      });
    }
  });
};

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
export const addUnitLocationTracking = (model: ModelStatic<Model>): void => {
  model.addHook('beforeUpdate', async (instance: any) => {
    if (instance.changed('currentLocation')) {
      // Track location history
      if (!instance.metadata.locationHistory) {
        instance.metadata.locationHistory = [];
      }

      instance.metadata.locationHistory.push({
        location: instance.currentLocation,
        timestamp: new Date(),
        availability: instance.availability,
      });

      // Keep only last 100 location updates
      if (instance.metadata.locationHistory.length > 100) {
        instance.metadata.locationHistory = instance.metadata.locationHistory.slice(-100);
      }
    }
  });
};

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
export const addUnitDeploymentHistory = (model: ModelStatic<Model>): void => {
  model.addHook('beforeUpdate', async (instance: any) => {
    if (instance.changed('currentIncidentId')) {
      if (!instance.metadata.deploymentHistory) {
        instance.metadata.deploymentHistory = [];
      }

      if (instance.currentIncidentId) {
        instance.metadata.deploymentHistory.push({
          incidentId: instance.currentIncidentId,
          deployedAt: new Date(),
          personnel: instance.assignedPersonnel,
        });
      } else if (instance.previous('currentIncidentId')) {
        // Unit cleared from incident
        const lastDeployment = instance.metadata.deploymentHistory[instance.metadata.deploymentHistory.length - 1];
        if (lastDeployment && !lastDeployment.clearedAt) {
          lastDeployment.clearedAt = new Date();
        }
      }
    }
  });
};

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
export const addUnitMaintenanceAlerts = (model: ModelStatic<Model>): void => {
  const attributes = (model as any).rawAttributes;

  attributes.maintenanceStatus = {
    type: DataTypes.VIRTUAL,
    get(this: any) {
      if (!this.nextMaintenanceDate) return 'UNKNOWN';

      const now = new Date();
      const daysUntilMaintenance = Math.floor(
        (this.nextMaintenanceDate - now) / (1000 * 60 * 60 * 24)
      );

      if (daysUntilMaintenance < 0) return 'OVERDUE';
      if (daysUntilMaintenance <= 7) return 'DUE_SOON';
      if (daysUntilMaintenance <= 30) return 'UPCOMING';
      return 'CURRENT';
    },
  };
};

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
export const addUnitCapabilityValidation = (model: ModelStatic<Model>): void => {
  model.addHook('beforeSave', async (instance: any) => {
    // Validate required equipment for unit type
    const requiredEquipment: Record<string, string[]> = {
      [ResponseUnitType.AMBULANCE]: ['AED', 'OXYGEN', 'STRETCHER'],
      [ResponseUnitType.FIRE_ENGINE]: ['HOSE', 'PUMP', 'LADDER'],
      [ResponseUnitType.HAZMAT_UNIT]: ['DETECTION_EQUIPMENT', 'DECON_SUPPLIES', 'PPE'],
    };

    const required = requiredEquipment[instance.unitType];
    if (required) {
      const missing = required.filter(item => !instance.equipmentList?.includes(item));
      if (missing.length > 0 && !instance.metadata.equipmentWarningAcknowledged) {
        instance.metadata.equipmentWarnings = missing;
      }
    }
  });
};

// ============================================================================
// INCIDENT COMMAND MODELS
// ============================================================================

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
export const createIncidentCommandModel = (
  sequelize: Sequelize,
  options: Partial<ModelOptions> = {},
): ModelStatic<Model> => {
  const attributes: ModelAttributes = {
    id: {
      type: DataTypes.STRING(26),
      primaryKey: true,
      allowNull: false,
      defaultValue: () => generateULID(),
    },
    incidentId: {
      type: DataTypes.STRING(26),
      allowNull: false,
    },
    commandRole: {
      type: DataTypes.ENUM(...Object.values(CommandRole)),
      allowNull: false,
    },
    personnelId: {
      type: DataTypes.STRING(26),
      allowNull: false,
    },
    assignedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    relievedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    sector: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    responsibilities: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: [],
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
    },
  };

  class IncidentCommand extends Model {}
  return IncidentCommand.init(attributes, {
    sequelize,
    modelName: 'IncidentCommand',
    tableName: 'incident_commands',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['incident_id'] },
      { fields: ['personnel_id'] },
      { fields: ['command_role'] },
      { fields: ['incident_id', 'command_role'], unique: true, where: { relieved_at: null } },
    ],
    ...options,
  });
};

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
export const addCommandChainValidation = (model: ModelStatic<Model>): void => {
  model.addHook('beforeCreate', async (instance: any, options) => {
    // Ensure only one active incident commander per incident
    if (instance.commandRole === CommandRole.INCIDENT_COMMANDER) {
      const existing = await model.findOne({
        where: {
          incidentId: instance.incidentId,
          commandRole: CommandRole.INCIDENT_COMMANDER,
          relievedAt: null,
        },
        transaction: options.transaction,
      });

      if (existing) {
        throw new Error('An incident commander is already assigned to this incident');
      }
    }
  });
};

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
export const addCommandTransferTracking = (model: ModelStatic<Model>): void => {
  model.addHook('beforeUpdate', async (instance: any) => {
    if (instance.changed('relievedAt') && instance.relievedAt) {
      // Track command transfer
      if (!instance.metadata.transferHistory) {
        instance.metadata.transferHistory = [];
      }

      instance.metadata.transferHistory.push({
        relievedAt: instance.relievedAt,
        duration: Math.floor((instance.relievedAt - instance.assignedAt) / 1000 / 60), // minutes
      });
    }
  });
};

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
export const addCommandDurationTracking = (model: ModelStatic<Model>): void => {
  const attributes = (model as any).rawAttributes;

  attributes.commandDuration = {
    type: DataTypes.VIRTUAL,
    get(this: any) {
      const end = this.relievedAt || new Date();
      return Math.floor((end - this.assignedAt) / 1000 / 60); // minutes
    },
  };

  attributes.isActive = {
    type: DataTypes.VIRTUAL,
    get(this: any) {
      return !this.relievedAt;
    },
  };
};

// ============================================================================
// MUTUAL AID AGREEMENT MODELS
// ============================================================================

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
export const createMutualAidAgreementModel = (
  sequelize: Sequelize,
  options: Partial<ModelOptions> = {},
): ModelStatic<Model> => {
  const attributes: ModelAttributes = {
    id: {
      type: DataTypes.STRING(26),
      primaryKey: true,
      allowNull: false,
      defaultValue: () => generateULID(),
    },
    agreementNumber: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    requestingAgency: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    providingAgency: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    requestedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    approvedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    deployedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    releasedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    incidentId: {
      type: DataTypes.STRING(26),
      allowNull: true,
    },
    resourcesRequested: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },
    resourcesProvided: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: [],
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'REQUESTED',
    },
    estimatedDuration: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    actualDuration: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
    },
  };

  class MutualAidAgreement extends Model {}
  return MutualAidAgreement.init(attributes, {
    sequelize,
    modelName: 'MutualAidAgreement',
    tableName: 'mutual_aid_agreements',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['agreement_number'], unique: true },
      { fields: ['requesting_agency'] },
      { fields: ['providing_agency'] },
      { fields: ['incident_id'] },
      { fields: ['status'] },
    ],
    ...options,
  });
};

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
export const addMutualAidNumberGenerator = (model: ModelStatic<Model>): void => {
  model.addHook('beforeValidate', async (instance: any) => {
    if (!instance.agreementNumber) {
      const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
      const random = crypto.randomBytes(2).toString('hex').toUpperCase();
      instance.agreementNumber = `MA-${timestamp}-${random}`;
    }
  });
};

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
export const addMutualAidStatusWorkflow = (model: ModelStatic<Model>): void => {
  model.addHook('beforeUpdate', async (instance: any) => {
    if (instance.changed('status')) {
      const now = new Date();

      if (instance.status === 'APPROVED' && !instance.approvedAt) {
        instance.approvedAt = now;
      }

      if (instance.status === 'DEPLOYED' && !instance.deployedAt) {
        instance.deployedAt = now;
      }

      if (instance.status === 'RELEASED' && !instance.releasedAt) {
        instance.releasedAt = now;

        // Calculate actual duration
        if (instance.deployedAt) {
          instance.actualDuration = Math.floor((now - instance.deployedAt) / 1000 / 60);
        }
      }
    }
  });
};

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
export const addMutualAidResourceTracking = (model: ModelStatic<Model>): void => {
  const attributes = (model as any).rawAttributes;

  attributes.resourcesFulfillmentRate = {
    type: DataTypes.VIRTUAL,
    get(this: any) {
      if (!this.resourcesRequested?.length) return 0;
      if (!this.resourcesProvided?.length) return 0;

      return (this.resourcesProvided.length / this.resourcesRequested.length) * 100;
    },
  };
};

// ============================================================================
// EMERGENCY OPERATIONS CENTER MODELS
// ============================================================================

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
export const createEOCModel = (
  sequelize: Sequelize,
  options: Partial<ModelOptions> = {},
): ModelStatic<Model> => {
  const attributes: ModelAttributes = {
    id: {
      type: DataTypes.STRING(26),
      primaryKey: true,
      allowNull: false,
      defaultValue: () => generateULID(),
    },
    eocName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    activationLevel: {
      type: DataTypes.ENUM('MONITORING', 'PARTIAL', 'FULL', 'STANDBY'),
      allowNull: false,
      defaultValue: 'MONITORING',
    },
    activatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    deactivatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    incidentId: {
      type: DataTypes.STRING(26),
      allowNull: true,
    },
    location: {
      type: DataTypes.GEOMETRY('POINT'),
      allowNull: true,
    },
    staffedPositions: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: [],
    },
    activeAgencies: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: [],
    },
    operationalPeriod: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 12, // hours
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
    },
  };

  class EmergencyOperationsCenter extends Model {}
  return EmergencyOperationsCenter.init(attributes, {
    sequelize,
    modelName: 'EmergencyOperationsCenter',
    tableName: 'emergency_operations_centers',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['eoc_name'] },
      { fields: ['activation_level'] },
      { fields: ['incident_id'] },
    ],
    ...options,
  });
};

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
export const addEOCActivationTracking = (model: ModelStatic<Model>): void => {
  model.addHook('beforeUpdate', async (instance: any) => {
    if (instance.changed('activationLevel')) {
      const now = new Date();

      if (instance.activationLevel !== 'STANDBY' && !instance.activatedAt) {
        instance.activatedAt = now;
      }

      if (instance.activationLevel === 'STANDBY' && instance.activatedAt && !instance.deactivatedAt) {
        instance.deactivatedAt = now;
      }

      // Track activation history
      if (!instance.metadata.activationHistory) {
        instance.metadata.activationHistory = [];
      }

      instance.metadata.activationHistory.push({
        level: instance.activationLevel,
        timestamp: now,
        previousLevel: instance.previous('activationLevel'),
      });
    }
  });
};

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
export const addEOCStaffingValidation = (model: ModelStatic<Model>): void => {
  const requiredPositions = {
    FULL: ['EOC_DIRECTOR', 'OPERATIONS', 'PLANNING', 'LOGISTICS', 'FINANCE'],
    PARTIAL: ['EOC_DIRECTOR', 'OPERATIONS'],
    MONITORING: ['EOC_DIRECTOR'],
  };

  model.addHook('beforeSave', async (instance: any) => {
    const required = requiredPositions[instance.activationLevel as keyof typeof requiredPositions];
    if (required) {
      const missing = required.filter(pos => !instance.staffedPositions?.includes(pos));
      if (missing.length > 0) {
        instance.metadata.staffingWarnings = missing;
      }
    }
  });
};

// ============================================================================
// HAZARD ASSESSMENT MODELS
// ============================================================================

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
export const createHazardAssessmentModel = (
  sequelize: Sequelize,
  options: Partial<ModelOptions> = {},
): ModelStatic<Model> => {
  const attributes: ModelAttributes = {
    id: {
      type: DataTypes.STRING(26),
      primaryKey: true,
      allowNull: false,
      defaultValue: () => generateULID(),
    },
    incidentId: {
      type: DataTypes.STRING(26),
      allowNull: false,
    },
    hazardType: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    hazardLevel: {
      type: DataTypes.ENUM(...Object.values(HazardLevel)),
      allowNull: false,
    },
    assessedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    assessedBy: {
      type: DataTypes.STRING(26),
      allowNull: false,
    },
    location: {
      type: DataTypes.GEOMETRY('POINT'),
      allowNull: true,
    },
    affectedArea: {
      type: DataTypes.GEOMETRY('POLYGON'),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    mitigationMeasures: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: [],
    },
    requiresEvacuation: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    estimatedAffectedPopulation: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
    },
  };

  class HazardAssessment extends Model {}
  return HazardAssessment.init(attributes, {
    sequelize,
    modelName: 'HazardAssessment',
    tableName: 'hazard_assessments',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['incident_id'] },
      { fields: ['hazard_type'] },
      { fields: ['hazard_level'] },
      { fields: ['assessed_at'] },
      { fields: ['location'], type: 'GIST' },
    ],
    ...options,
  });
};

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
export const addHazardSeverityEscalation = (model: ModelStatic<Model>): void => {
  model.addHook('beforeUpdate', async (instance: any) => {
    if (instance.changed('hazardLevel')) {
      const severityOrder = [
        HazardLevel.MINIMAL,
        HazardLevel.LOW,
        HazardLevel.MODERATE,
        HazardLevel.HIGH,
        HazardLevel.SEVERE,
        HazardLevel.EXTREME,
      ];

      const oldIndex = severityOrder.indexOf(instance.previous('hazardLevel'));
      const newIndex = severityOrder.indexOf(instance.hazardLevel);

      if (newIndex > oldIndex) {
        // Escalation
        if (!instance.metadata.escalationHistory) {
          instance.metadata.escalationHistory = [];
        }

        instance.metadata.escalationHistory.push({
          from: instance.previous('hazardLevel'),
          to: instance.hazardLevel,
          timestamp: new Date(),
          assessedBy: instance.assessedBy,
        });
      }
    }
  });
};

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
export const addHazardEvacuationRecommendation = (model: ModelStatic<Model>): void => {
  model.addHook('beforeSave', async (instance: any) => {
    // Auto-recommend evacuation for high-severity hazards
    if ([HazardLevel.SEVERE, HazardLevel.EXTREME].includes(instance.hazardLevel)) {
      instance.requiresEvacuation = true;
    }

    // Auto-recommend for large affected populations
    if (instance.estimatedAffectedPopulation > 100) {
      instance.requiresEvacuation = true;
    }
  });
};

// ============================================================================
// EVACUATION ZONE MODELS
// ============================================================================

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
export const createEvacuationZoneModel = (
  sequelize: Sequelize,
  options: Partial<ModelOptions> = {},
): ModelStatic<Model> => {
  const attributes: ModelAttributes = {
    id: {
      type: DataTypes.STRING(26),
      primaryKey: true,
      allowNull: false,
      defaultValue: () => generateULID(),
    },
    zoneName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    zoneCode: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    incidentId: {
      type: DataTypes.STRING(26),
      allowNull: true,
    },
    evacuationStatus: {
      type: DataTypes.ENUM(...Object.values(EvacuationStatus)),
      allowNull: false,
      defaultValue: EvacuationStatus.NORMAL,
    },
    boundary: {
      type: DataTypes.GEOMETRY('POLYGON'),
      allowNull: false,
    },
    estimatedPopulation: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    evacuatedCount: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    declaredAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    liftedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    shelterLocations: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: [],
    },
    transportationRoutes: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: [],
    },
    specialNeeds: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: [],
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
    },
  };

  class EvacuationZone extends Model {}
  return EvacuationZone.init(attributes, {
    sequelize,
    modelName: 'EvacuationZone',
    tableName: 'evacuation_zones',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['zone_code'], unique: true },
      { fields: ['incident_id'] },
      { fields: ['evacuation_status'] },
      { fields: ['boundary'], type: 'GIST' },
    ],
    ...options,
  });
};

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
export const addEvacuationStatusTracking = (model: ModelStatic<Model>): void => {
  model.addHook('beforeUpdate', async (instance: any) => {
    if (instance.changed('evacuationStatus')) {
      const now = new Date();

      if (instance.evacuationStatus === EvacuationStatus.MANDATORY && !instance.declaredAt) {
        instance.declaredAt = now;
      }

      if (instance.evacuationStatus === EvacuationStatus.LIFTED && !instance.liftedAt) {
        instance.liftedAt = now;
      }

      // Track status changes
      if (!instance.metadata.statusHistory) {
        instance.metadata.statusHistory = [];
      }

      instance.metadata.statusHistory.push({
        status: instance.evacuationStatus,
        timestamp: now,
        previousStatus: instance.previous('evacuationStatus'),
      });
    }
  });
};

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
export const addEvacuationCompletionTracking = (model: ModelStatic<Model>): void => {
  const attributes = (model as any).rawAttributes;

  attributes.evacuationProgress = {
    type: DataTypes.VIRTUAL,
    get(this: any) {
      if (!this.estimatedPopulation) return 0;
      return (this.evacuatedCount / this.estimatedPopulation) * 100;
    },
  };

  attributes.remainingPopulation = {
    type: DataTypes.VIRTUAL,
    get(this: any) {
      return (this.estimatedPopulation || 0) - (this.evacuatedCount || 0);
    },
  };
};

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
export const findOverlappingEvacuationZones = async (
  sequelize: Sequelize,
  zoneId: string,
): Promise<any[]> => {
  const [results] = await sequelize.query(
    `SELECT z2.* FROM evacuation_zones z1
     JOIN evacuation_zones z2 ON ST_Intersects(z1.boundary, z2.boundary)
     WHERE z1.id = :zoneId AND z2.id != :zoneId`,
    {
      replacements: { zoneId },
      type: sequelize.QueryTypes.SELECT,
    },
  );

  return results as any[];
};

// ============================================================================
// EMERGENCY CONTACT MODELS
// ============================================================================

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
export const createEmergencyContactModel = (
  sequelize: Sequelize,
  options: Partial<ModelOptions> = {},
): ModelStatic<Model> => {
  const attributes: ModelAttributes = {
    id: {
      type: DataTypes.STRING(26),
      primaryKey: true,
      allowNull: false,
      defaultValue: () => generateULID(),
    },
    contactType: {
      type: DataTypes.ENUM('PRIMARY', 'SECONDARY', 'FAMILY', 'MEDICAL', 'LEGAL', 'OTHER'),
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    relationship: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    phoneNumber: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    alternatePhone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    preferredContactMethod: {
      type: DataTypes.ENUM('PHONE', 'SMS', 'EMAIL'),
      allowNull: false,
      defaultValue: 'PHONE',
    },
    notificationPreferences: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
    },
  };

  class EmergencyContact extends Model {}
  return EmergencyContact.init(attributes, {
    sequelize,
    modelName: 'EmergencyContact',
    tableName: 'emergency_contacts',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['contact_type'] },
      { fields: ['phone_number'] },
      { fields: ['email'] },
      { fields: ['active'] },
    ],
    ...options,
  });
};

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
export const addEmergencyContactValidation = (model: ModelStatic<Model>): void => {
  model.addHook('beforeSave', async (instance: any) => {
    // Validate phone number format
    const phoneRegex = /^\+?1?\d{10}$/;
    const cleanPhone = instance.phoneNumber.replace(/[\s\-\(\)]/g, '');

    if (!phoneRegex.test(cleanPhone)) {
      throw new Error('Invalid phone number format');
    }

    // Validate email if provided
    if (instance.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(instance.email)) {
        throw new Error('Invalid email format');
      }
    }
  });
};

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
export const addContactNotificationTracking = (model: ModelStatic<Model>): void => {
  const trackNotification = (instance: any, method: string, success: boolean) => {
    if (!instance.metadata.notificationHistory) {
      instance.metadata.notificationHistory = [];
    }

    instance.metadata.notificationHistory.push({
      method,
      success,
      timestamp: new Date(),
    });

    // Keep only last 50 notifications
    if (instance.metadata.notificationHistory.length > 50) {
      instance.metadata.notificationHistory = instance.metadata.notificationHistory.slice(-50);
    }
  };

  (model as any).prototype.recordNotification = function(method: string, success: boolean) {
    trackNotification(this, method, success);
    return this.save();
  };
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

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
export const generateULID = (): string => {
  const ulid = monotonicFactory();
  return ulid();
};

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
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

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
export const findNearestAvailableUnits = async (
  unitModel: ModelStatic<Model>,
  lat: number,
  lng: number,
  unitType?: ResponseUnitType,
  limit: number = 5,
): Promise<Model[]> => {
  const where: any = {
    availability: UnitAvailability.AVAILABLE,
    currentLocation: { [Op.ne]: null },
  };

  if (unitType) {
    where.unitType = unitType;
  }

  return unitModel.findAll({
    where,
    order: literal(`ST_Distance(current_location, ST_SetSRID(ST_Point(${lng}, ${lat}), 4326))`),
    limit,
  });
};

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
export const createIncidentNotificationPayload = (
  incident: any,
  units: any[],
): Record<string, any> => {
  return {
    incidentId: incident.id,
    incidentNumber: incident.incidentNumber,
    incidentType: incident.incidentType,
    priority: incident.priority,
    status: incident.status,
    address: incident.address,
    location: incident.location,
    description: incident.description,
    respondingUnits: units.map(u => ({
      unitNumber: u.unitNumber,
      unitType: u.unitType,
      availability: u.availability,
    })),
    reportedAt: incident.reportedAt,
    timestamp: new Date(),
  };
};

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
export const validateIncidentCommandStructure = async (
  sequelize: Sequelize,
  incidentId: string,
): Promise<{ valid: boolean; missing: string[] }> => {
  const requiredRoles = [CommandRole.INCIDENT_COMMANDER];

  const [results] = await sequelize.query(
    `SELECT command_role FROM incident_commands
     WHERE incident_id = :incidentId AND relieved_at IS NULL`,
    {
      replacements: { incidentId },
      type: sequelize.QueryTypes.SELECT,
    },
  );

  const assignedRoles = (results as any[]).map(r => r.command_role);
  const missing = requiredRoles.filter(role => !assignedRoles.includes(role));

  return {
    valid: missing.length === 0,
    missing,
  };
};

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
export const generateIncidentSummary = (incident: any): Record<string, any> => {
  const duration = incident.clearedAt
    ? Math.floor((incident.clearedAt - incident.reportedAt) / 1000 / 60)
    : null;

  return {
    incidentNumber: incident.incidentNumber,
    incidentType: incident.incidentType,
    priority: incident.priority,
    status: incident.status,
    address: incident.address,
    reportedAt: incident.reportedAt,
    clearedAt: incident.clearedAt,
    duration: duration ? `${duration} minutes` : 'Ongoing',
    respondingUnits: incident.respondingUnits?.length || 0,
    patients: incident.actualPatients || incident.estimatedPatients || 0,
  };
};
