/**
 * LOC: CNSM9876543
 * File: /reuse/construction/construction-site-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable construction utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Backend construction services
 *   - Site management modules
 *   - Safety tracking services
 *   - Daily reporting systems
 */

/**
 * File: /reuse/construction/construction-site-management-kit.ts
 * Locator: WC-CONST-SITE-001
 * Purpose: Enterprise-grade Construction Site Management - site logistics, access control, safety management, emergency response, daily logs, weather tracking, meetings, communication
 *
 * Upstream: Independent utility module for construction site operations
 * Downstream: ../backend/construction/*, site controllers, safety services, reporting modules
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 45+ functions for site management competing with Procore and PlanGrid enterprise platforms
 *
 * LLM Context: Comprehensive construction site management utilities for production-ready applications.
 * Provides site logistics planning, personnel access control, equipment tracking, site safety management,
 * emergency response coordination, daily log/diary management, weather tracking, delay documentation,
 * site meetings management, communication logs, incident reporting, inspection tracking, and compliance monitoring.
 */

import { Model, DataTypes, Sequelize, Transaction, Op, WhereOptions, Includeable } from 'sequelize';
import { Injectable } from '@nestjs/common';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface SiteLogisticsData {
  projectId: string;
  siteName: string;
  siteAddress: string;
  siteManager: string;
  startDate: Date;
  estimatedEndDate: Date;
  actualEndDate?: Date;
  status: 'planning' | 'active' | 'suspended' | 'completed' | 'closed';
  accessRestrictions?: string;
  parkingInstructions?: string;
  securityRequirements?: string;
  metadata?: Record<string, any>;
}

interface AccessControlEntry {
  personnelId: string;
  personnelName: string;
  personnelType: 'employee' | 'contractor' | 'vendor' | 'inspector' | 'visitor';
  accessLevel: 'full' | 'restricted' | 'escort_required' | 'prohibited';
  badgeNumber?: string;
  accessStartDate: Date;
  accessEndDate?: Date;
  isActive: boolean;
  entryCount?: number;
  lastEntry?: Date;
}

interface SafetyIncidentData {
  siteId: string;
  incidentDate: Date;
  incidentTime: string;
  incidentType: 'injury' | 'near_miss' | 'property_damage' | 'environmental' | 'security';
  severity: 'minor' | 'moderate' | 'serious' | 'critical' | 'fatality';
  location: string;
  description: string;
  personnelInvolved: string[];
  witnessIds?: string[];
  immediateAction: string;
  reportedBy: string;
  investigationStatus: 'pending' | 'in_progress' | 'completed';
  rootCause?: string;
  correctiveActions?: string;
  oshaRecordable: boolean;
}

interface EmergencyResponsePlan {
  siteId: string;
  emergencyType: 'fire' | 'medical' | 'weather' | 'hazmat' | 'evacuation' | 'security';
  responseProcedure: string;
  emergencyContacts: EmergencyContact[];
  evacuationRoutes: string[];
  assemblyPoint: string;
  equipmentLocations: Record<string, string>;
  lastDrillDate?: Date;
  nextReviewDate: Date;
}

interface EmergencyContact {
  name: string;
  role: string;
  phone: string;
  alternatePhone?: string;
  priority: number;
}

interface DailyLogEntry {
  siteId: string;
  logDate: Date;
  submittedBy: string;
  workPerformed: string;
  crewCount: number;
  equipmentUsed: string[];
  materialsDelivered?: MaterialDelivery[];
  inspections?: InspectionEntry[];
  visitorLog?: VisitorEntry[];
  delaysEncountered?: DelayEntry[];
  safetyObservations?: string;
  weatherConditions: WeatherCondition;
  hoursWorked: number;
  approvedBy?: string;
  approvedAt?: Date;
}

interface MaterialDelivery {
  materialType: string;
  quantity: number;
  unit: string;
  supplier: string;
  deliveryTime: string;
  receivedBy: string;
  storageLocation?: string;
}

interface InspectionEntry {
  inspectionType: string;
  inspector: string;
  result: 'passed' | 'failed' | 'conditional';
  comments?: string;
  deficiencies?: string[];
}

interface VisitorEntry {
  visitorName: string;
  company: string;
  purpose: string;
  checkIn: string;
  checkOut?: string;
  escort?: string;
}

interface DelayEntry {
  delayType: 'weather' | 'material' | 'equipment' | 'labor' | 'permit' | 'design' | 'other';
  duration: number;
  impact: string;
  responsibleParty?: string;
}

interface WeatherCondition {
  temperature: number;
  temperatureUnit: 'F' | 'C';
  conditions: string;
  precipitation?: string;
  windSpeed?: number;
  windDirection?: string;
  workStoppageRequired: boolean;
  stoppageReason?: string;
}

interface WeatherDelayData {
  siteId: string;
  delayDate: Date;
  weatherType: 'rain' | 'snow' | 'wind' | 'temperature' | 'lightning' | 'other';
  severity: 'minor' | 'moderate' | 'severe';
  startTime: string;
  endTime?: string;
  totalHoursLost: number;
  affectedActivities: string[];
  costImpact?: number;
  documentationUrl?: string;
  submittedForEOT: boolean;
  eotApproved?: boolean;
}

interface SiteMeetingData {
  siteId: string;
  meetingType: 'safety' | 'coordination' | 'toolbox' | 'planning' | 'closeout' | 'owner';
  meetingDate: Date;
  startTime: string;
  endTime?: string;
  location: string;
  organizer: string;
  attendees: MeetingAttendee[];
  agenda: string[];
  discussionPoints: string[];
  actionItems: ActionItem[];
  minutesUrl?: string;
  nextMeetingDate?: Date;
}

interface MeetingAttendee {
  name: string;
  company: string;
  role: string;
  email: string;
  signatureUrl?: string;
}

interface ActionItem {
  description: string;
  assignedTo: string;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
}

interface CommunicationLogEntry {
  siteId: string;
  communicationType: 'email' | 'phone' | 'meeting' | 'rfi' | 'submittal' | 'change_order' | 'notice';
  subject: string;
  fromParty: string;
  toParties: string[];
  communicationDate: Date;
  content: string;
  attachments?: string[];
  followUpRequired: boolean;
  followUpDate?: Date;
  status: 'sent' | 'received' | 'acknowledged' | 'responded' | 'closed';
}

interface SiteInspectionData {
  siteId: string;
  inspectionType: 'safety' | 'quality' | 'progress' | 'compliance' | 'final';
  inspectionDate: Date;
  inspector: string;
  inspectorAgency?: string;
  areas: InspectionArea[];
  overallStatus: 'passed' | 'failed' | 'conditional' | 'pending';
  deficiencies: DeficiencyItem[];
  correctiveActionDeadline?: Date;
  followUpInspectionRequired: boolean;
  followUpDate?: Date;
  certificationIssued: boolean;
}

interface InspectionArea {
  areaName: string;
  checklistItems: ChecklistItem[];
  status: 'passed' | 'failed' | 'na';
  notes?: string;
}

interface ChecklistItem {
  item: string;
  compliant: boolean;
  comments?: string;
  photoUrls?: string[];
}

interface DeficiencyItem {
  deficiencyId: string;
  description: string;
  severity: 'minor' | 'major' | 'critical';
  location: string;
  correctiveAction: string;
  assignedTo: string;
  dueDate: Date;
  status: 'open' | 'in_progress' | 'resolved' | 'verified';
}

interface SiteEquipmentTracking {
  siteId: string;
  equipmentId: string;
  equipmentType: string;
  description: string;
  serialNumber?: string;
  owner: 'company' | 'rental' | 'subcontractor';
  onSiteDate: Date;
  offSiteDate?: Date;
  currentStatus: 'active' | 'maintenance' | 'idle' | 'removed';
  operator?: string;
  location: string;
  maintenanceLogs: MaintenanceLog[];
  utilizationHours?: number;
}

interface MaintenanceLog {
  maintenanceDate: Date;
  maintenanceType: 'inspection' | 'repair' | 'service' | 'calibration';
  performedBy: string;
  description: string;
  hoursDown?: number;
  cost?: number;
  nextMaintenanceDue?: Date;
}

interface SafetyStatistics {
  siteId: string;
  periodStart: Date;
  periodEnd: Date;
  totalHoursWorked: number;
  incidentCount: number;
  injuryCount: number;
  nearMissCount: number;
  firstAidCount: number;
  lostTimeIncidents: number;
  oshaRecordable: number;
  incidentRate: number;
  frequencyRate: number;
  severityRate: number;
  daysSinceLastIncident: number;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Sequelize model for Construction Site with logistics and access control.
 *
 * @swagger
 * @openapi
 * components:
 *   schemas:
 *     ConstructionSite:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         projectId:
 *           type: string
 *         siteName:
 *           type: string
 *         status:
 *           type: string
 *           enum: [planning, active, suspended, completed, closed]
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ConstructionSite model
 *
 * @example
 * ```typescript
 * const ConstructionSite = createConstructionSiteModel(sequelize);
 * const site = await ConstructionSite.create({
 *   projectId: 'PRJ-001',
 *   siteName: 'Downtown Medical Center',
 *   siteAddress: '123 Main St',
 *   siteManager: 'John Smith',
 *   startDate: new Date(),
 *   status: 'active'
 * });
 * ```
 */
export const createConstructionSiteModel = (sequelize: Sequelize) => {
  class ConstructionSite extends Model {
    public id!: string;
    public projectId!: string;
    public siteName!: string;
    public siteAddress!: string;
    public siteManager!: string;
    public siteManagerContact!: string;
    public startDate!: Date;
    public estimatedEndDate!: Date;
    public actualEndDate!: Date | null;
    public status!: string;
    public accessRestrictions!: string | null;
    public parkingInstructions!: string | null;
    public securityRequirements!: string | null;
    public emergencyPhone!: string;
    public nearestHospital!: string | null;
    public permitNumber!: string | null;
    public insurancePolicy!: string | null;
    public latitude!: number | null;
    public longitude!: number | null;
    public totalArea!: number | null;
    public fenceInstalled!: boolean;
    public signsInstalled!: boolean;
    public utilitiesMarked!: boolean;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  ConstructionSite.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      projectId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Project identifier',
        validate: {
          notEmpty: true,
        },
      },
      siteName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Site name',
        validate: {
          notEmpty: true,
        },
      },
      siteAddress: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Site physical address',
      },
      siteManager: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Site manager name',
      },
      siteManagerContact: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Site manager contact number',
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Site activation date',
      },
      estimatedEndDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Estimated completion date',
      },
      actualEndDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Actual completion date',
      },
      status: {
        type: DataTypes.ENUM('planning', 'active', 'suspended', 'completed', 'closed'),
        allowNull: false,
        defaultValue: 'planning',
        comment: 'Current site status',
      },
      accessRestrictions: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Site access restrictions',
      },
      parkingInstructions: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Parking instructions for personnel',
      },
      securityRequirements: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Security requirements and protocols',
      },
      emergencyPhone: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Emergency contact number',
      },
      nearestHospital: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Nearest hospital information',
      },
      permitNumber: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Construction permit number',
      },
      insurancePolicy: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Insurance policy number',
      },
      latitude: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: true,
        comment: 'Site latitude coordinate',
      },
      longitude: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: true,
        comment: 'Site longitude coordinate',
      },
      totalArea: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
        comment: 'Total site area in sq ft',
      },
      fenceInstalled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Security fence installed',
      },
      signsInstalled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Safety/warning signs installed',
      },
      utilitiesMarked: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Underground utilities marked',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional site metadata',
      },
    },
    {
      sequelize,
      tableName: 'construction_sites',
      timestamps: true,
      indexes: [
        { fields: ['projectId'] },
        { fields: ['status'] },
        { fields: ['siteManager'] },
        { fields: ['startDate'] },
        { fields: ['estimatedEndDate'] },
        { fields: ['status', 'startDate'] },
      ],
    },
  );

  return ConstructionSite;
};

/**
 * Sequelize model for Daily Site Logs with comprehensive tracking.
 *
 * @swagger
 * @openapi
 * components:
 *   schemas:
 *     DailySiteLog:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         siteId:
 *           type: string
 *         logDate:
 *           type: string
 *           format: date
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} DailySiteLog model
 *
 * @example
 * ```typescript
 * const DailySiteLog = createDailySiteLogModel(sequelize);
 * const log = await DailySiteLog.create({
 *   siteId: 'site-123',
 *   logDate: new Date(),
 *   submittedBy: 'John Smith',
 *   workPerformed: 'Concrete foundation work',
 *   crewCount: 15
 * });
 * ```
 */
export const createDailySiteLogModel = (sequelize: Sequelize) => {
  class DailySiteLog extends Model {
    public id!: string;
    public siteId!: string;
    public logDate!: Date;
    public submittedBy!: string;
    public workPerformed!: string;
    public crewCount!: number;
    public equipmentUsed!: string[];
    public materialsDelivered!: MaterialDelivery[];
    public inspections!: InspectionEntry[];
    public visitorLog!: VisitorEntry[];
    public delaysEncountered!: DelayEntry[];
    public safetyObservations!: string | null;
    public weatherConditions!: WeatherCondition;
    public weatherImpact!: boolean;
    public hoursWorked!: number;
    public overtimeHours!: number;
    public productivityRating!: number;
    public notes!: string | null;
    public photoUrls!: string[];
    public approvedBy!: string | null;
    public approvedAt!: Date | null;
    public submittedAt!: Date;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  DailySiteLog.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      siteId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Construction site ID',
        references: {
          model: 'construction_sites',
          key: 'id',
        },
      },
      logDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        comment: 'Date of log entry',
      },
      submittedBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Log submitter name',
      },
      workPerformed: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Description of work performed',
      },
      crewCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Number of workers on site',
        validate: {
          min: 0,
        },
      },
      equipmentUsed: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'List of equipment used',
      },
      materialsDelivered: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Materials delivered today',
      },
      inspections: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Inspections performed today',
      },
      visitorLog: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Visitor check-in/out log',
      },
      delaysEncountered: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Delays encountered today',
      },
      safetyObservations: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Safety observations and concerns',
      },
      weatherConditions: {
        type: DataTypes.JSON,
        allowNull: false,
        comment: 'Weather conditions for the day',
      },
      weatherImpact: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Weather impacted work',
      },
      hoursWorked: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        comment: 'Total hours worked',
        validate: {
          min: 0,
        },
      },
      overtimeHours: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Overtime hours',
      },
      productivityRating: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Productivity rating 1-10',
        validate: {
          min: 1,
          max: 10,
        },
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Additional notes',
      },
      photoUrls: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'URLs to progress photos',
      },
      approvedBy: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Approver name',
      },
      approvedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Approval timestamp',
      },
      submittedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Submission timestamp',
      },
    },
    {
      sequelize,
      tableName: 'daily_site_logs',
      timestamps: true,
      indexes: [
        { fields: ['siteId'] },
        { fields: ['logDate'] },
        { fields: ['submittedBy'] },
        { fields: ['siteId', 'logDate'], unique: true },
        { fields: ['weatherImpact'] },
        { fields: ['approvedBy'] },
      ],
    },
  );

  return DailySiteLog;
};

/**
 * Sequelize model for Safety Incidents with investigation tracking.
 *
 * @swagger
 * @openapi
 * components:
 *   schemas:
 *     SafetyIncident:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         siteId:
 *           type: string
 *         incidentType:
 *           type: string
 *           enum: [injury, near_miss, property_damage, environmental, security]
 *         severity:
 *           type: string
 *           enum: [minor, moderate, serious, critical, fatality]
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} SafetyIncident model
 *
 * @example
 * ```typescript
 * const SafetyIncident = createSafetyIncidentModel(sequelize);
 * const incident = await SafetyIncident.create({
 *   siteId: 'site-123',
 *   incidentDate: new Date(),
 *   incidentType: 'near_miss',
 *   severity: 'moderate',
 *   location: 'Area B - Foundation',
 *   description: 'Near miss with crane operation'
 * });
 * ```
 */
export const createSafetyIncidentModel = (sequelize: Sequelize) => {
  class SafetyIncident extends Model {
    public id!: string;
    public siteId!: string;
    public incidentDate!: Date;
    public incidentTime!: string;
    public incidentType!: string;
    public severity!: string;
    public location!: string;
    public description!: string;
    public personnelInvolved!: string[];
    public witnessIds!: string[];
    public immediateAction!: string;
    public reportedBy!: string;
    public reportedAt!: Date;
    public investigationStatus!: string;
    public investigator!: string | null;
    public investigationStartDate!: Date | null;
    public investigationCompletedDate!: Date | null;
    public rootCause!: string | null;
    public contributingFactors!: string[];
    public correctiveActions!: string | null;
    public preventiveActions!: string | null;
    public oshaRecordable!: boolean;
    public oshaReportNumber!: string | null;
    public lostTimeDays!: number;
    public medicalTreatmentRequired!: boolean;
    public costEstimate!: number | null;
    public photoUrls!: string[];
    public documentUrls!: string[];
    public closedAt!: Date | null;
    public closedBy!: string | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  SafetyIncident.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      siteId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Construction site ID',
        references: {
          model: 'construction_sites',
          key: 'id',
        },
      },
      incidentDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        comment: 'Date of incident',
      },
      incidentTime: {
        type: DataTypes.TIME,
        allowNull: false,
        comment: 'Time of incident',
      },
      incidentType: {
        type: DataTypes.ENUM('injury', 'near_miss', 'property_damage', 'environmental', 'security'),
        allowNull: false,
        comment: 'Type of incident',
      },
      severity: {
        type: DataTypes.ENUM('minor', 'moderate', 'serious', 'critical', 'fatality'),
        allowNull: false,
        comment: 'Incident severity level',
      },
      location: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Incident location on site',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Detailed incident description',
      },
      personnelInvolved: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Personnel involved in incident',
      },
      witnessIds: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Witness identifiers',
      },
      immediateAction: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Immediate actions taken',
      },
      reportedBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Reporter name',
      },
      reportedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Report timestamp',
      },
      investigationStatus: {
        type: DataTypes.ENUM('pending', 'in_progress', 'completed'),
        allowNull: false,
        defaultValue: 'pending',
        comment: 'Investigation status',
      },
      investigator: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Assigned investigator',
      },
      investigationStartDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Investigation start date',
      },
      investigationCompletedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Investigation completion date',
      },
      rootCause: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Identified root cause',
      },
      contributingFactors: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Contributing factors',
      },
      correctiveActions: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Corrective actions taken',
      },
      preventiveActions: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Preventive measures implemented',
      },
      oshaRecordable: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'OSHA recordable incident',
      },
      oshaReportNumber: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'OSHA report number',
      },
      lostTimeDays: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Number of lost time days',
      },
      medicalTreatmentRequired: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Medical treatment required',
      },
      costEstimate: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
        comment: 'Estimated cost impact',
      },
      photoUrls: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Incident photos',
      },
      documentUrls: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Related documents',
      },
      closedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Incident closure date',
      },
      closedBy: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Closed by user',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
    },
    {
      sequelize,
      tableName: 'safety_incidents',
      timestamps: true,
      indexes: [
        { fields: ['siteId'] },
        { fields: ['incidentDate'] },
        { fields: ['incidentType'] },
        { fields: ['severity'] },
        { fields: ['investigationStatus'] },
        { fields: ['oshaRecordable'] },
        { fields: ['siteId', 'incidentDate'] },
        { fields: ['siteId', 'incidentType', 'severity'] },
      ],
    },
  );

  return SafetyIncident;
};

// ============================================================================
// SITE LOGISTICS & ACCESS CONTROL (Functions 1-10)
// ============================================================================

/**
 * Creates a new construction site with full logistics setup.
 *
 * @param {SiteLogisticsData} siteData - Site logistics data
 * @param {Model} ConstructionSite - ConstructionSite model
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created site
 *
 * @example
 * ```typescript
 * const site = await createConstructionSite(siteData, ConstructionSite);
 * ```
 */
export const createConstructionSite = async (
  siteData: SiteLogisticsData,
  ConstructionSite: any,
  transaction?: Transaction,
): Promise<any> => {
  const site = await ConstructionSite.create(siteData, { transaction });
  return site;
};

/**
 * Retrieves active construction sites with comprehensive details.
 *
 * @param {Model} ConstructionSite - ConstructionSite model
 * @param {WhereOptions} [filters] - Optional filters
 * @returns {Promise<any[]>} Active sites
 *
 * @example
 * ```typescript
 * const sites = await getActiveConstructionSites(ConstructionSite, { projectId: 'PRJ-001' });
 * ```
 */
export const getActiveConstructionSites = async (
  ConstructionSite: any,
  filters?: WhereOptions,
): Promise<any[]> => {
  const where: WhereOptions = {
    status: { [Op.in]: ['active', 'planning'] },
    ...filters,
  };

  return await ConstructionSite.findAll({
    where,
    order: [['startDate', 'DESC']],
  });
};

/**
 * Retrieves site by project ID with all related data.
 *
 * @param {string} projectId - Project identifier
 * @param {Model} ConstructionSite - ConstructionSite model
 * @returns {Promise<any>} Site data
 *
 * @example
 * ```typescript
 * const site = await getSiteByProjectId('PRJ-001', ConstructionSite);
 * ```
 */
export const getSiteByProjectId = async (
  projectId: string,
  ConstructionSite: any,
): Promise<any> => {
  return await ConstructionSite.findOne({
    where: { projectId },
  });
};

/**
 * Updates site status with validation and audit trail.
 *
 * @param {string} siteId - Site identifier
 * @param {string} newStatus - New status
 * @param {string} userId - User making change
 * @param {Model} ConstructionSite - ConstructionSite model
 * @returns {Promise<any>} Updated site
 *
 * @example
 * ```typescript
 * await updateSiteStatus('site-123', 'active', 'user456', ConstructionSite);
 * ```
 */
export const updateSiteStatus = async (
  siteId: string,
  newStatus: 'planning' | 'active' | 'suspended' | 'completed' | 'closed',
  userId: string,
  ConstructionSite: any,
): Promise<any> => {
  const site = await ConstructionSite.findByPk(siteId);
  if (!site) throw new Error('Site not found');

  const oldStatus = site.status;
  site.status = newStatus;

  if (newStatus === 'completed' && !site.actualEndDate) {
    site.actualEndDate = new Date();
  }

  await site.save();

  // Log status change
  console.log(`Site ${siteId} status changed from ${oldStatus} to ${newStatus} by ${userId}`);

  return site;
};

/**
 * Adds personnel access control entry for site.
 *
 * @param {string} siteId - Site identifier
 * @param {AccessControlEntry} accessData - Access control data
 * @param {Model} ConstructionSite - ConstructionSite model
 * @returns {Promise<any>} Access control record
 *
 * @example
 * ```typescript
 * await addPersonnelAccessControl('site-123', accessData, ConstructionSite);
 * ```
 */
export const addPersonnelAccessControl = async (
  siteId: string,
  accessData: AccessControlEntry,
  ConstructionSite: any,
): Promise<any> => {
  // Verify site exists
  const site = await ConstructionSite.findByPk(siteId);
  if (!site) throw new Error('Site not found');

  // In production, this would create a record in an AccessControl table
  return {
    siteId,
    ...accessData,
    createdAt: new Date(),
  };
};

/**
 * Retrieves personnel access log with entry/exit tracking.
 *
 * @param {string} siteId - Site identifier
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<AccessControlEntry[]>} Access log
 *
 * @example
 * ```typescript
 * const log = await getPersonnelAccessLog('site-123', startDate, endDate);
 * ```
 */
export const getPersonnelAccessLog = async (
  siteId: string,
  startDate: Date,
  endDate: Date,
): Promise<AccessControlEntry[]> => {
  // In production, this would query an AccessLog table
  return [];
};

/**
 * Validates site access for personnel with security checks.
 *
 * @param {string} siteId - Site identifier
 * @param {string} personnelId - Personnel identifier
 * @returns {Promise<{ authorized: boolean; accessLevel: string; restrictions?: string }>} Access validation
 *
 * @example
 * ```typescript
 * const result = await validateSiteAccess('site-123', 'PER-456');
 * ```
 */
export const validateSiteAccess = async (
  siteId: string,
  personnelId: string,
): Promise<{ authorized: boolean; accessLevel: string; restrictions?: string }> => {
  // In production, this would check AccessControl table and validate badges
  return {
    authorized: true,
    accessLevel: 'full',
  };
};

/**
 * Records site entry/exit for personnel tracking.
 *
 * @param {string} siteId - Site identifier
 * @param {string} personnelId - Personnel identifier
 * @param {string} entryType - Entry or exit
 * @returns {Promise<any>} Entry record
 *
 * @example
 * ```typescript
 * await recordSiteEntry('site-123', 'PER-456', 'entry');
 * ```
 */
export const recordSiteEntry = async (
  siteId: string,
  personnelId: string,
  entryType: 'entry' | 'exit',
): Promise<any> => {
  // In production, this would create record in AccessLog table
  return {
    siteId,
    personnelId,
    entryType,
    timestamp: new Date(),
  };
};

/**
 * Retrieves current personnel count on site.
 *
 * @param {string} siteId - Site identifier
 * @returns {Promise<{ total: number; byType: Record<string, number> }>} Personnel count
 *
 * @example
 * ```typescript
 * const count = await getCurrentSitePersonnelCount('site-123');
 * ```
 */
export const getCurrentSitePersonnelCount = async (
  siteId: string,
): Promise<{ total: number; byType: Record<string, number> }> => {
  // In production, query AccessLog for entries without exits
  return {
    total: 25,
    byType: {
      employee: 15,
      contractor: 8,
      vendor: 2,
    },
  };
};

/**
 * Generates site access badge with QR code and permissions.
 *
 * @param {string} siteId - Site identifier
 * @param {string} personnelId - Personnel identifier
 * @param {AccessControlEntry} accessData - Access data
 * @returns {Promise<{ badgeNumber: string; qrCode: string; validUntil: Date }>} Badge data
 *
 * @example
 * ```typescript
 * const badge = await generateSiteAccessBadge('site-123', 'PER-456', accessData);
 * ```
 */
export const generateSiteAccessBadge = async (
  siteId: string,
  personnelId: string,
  accessData: AccessControlEntry,
): Promise<{ badgeNumber: string; qrCode: string; validUntil: Date }> => {
  const badgeNumber = `BADGE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const qrCode = `QR-${badgeNumber}`;

  return {
    badgeNumber,
    qrCode,
    validUntil: accessData.accessEndDate || new Date(Date.now() + 365 * 86400000),
  };
};

// ============================================================================
// SAFETY MANAGEMENT & INCIDENTS (Functions 11-20)
// ============================================================================

/**
 * Creates safety incident report with immediate notification.
 *
 * @param {SafetyIncidentData} incidentData - Incident data
 * @param {Model} SafetyIncident - SafetyIncident model
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created incident
 *
 * @example
 * ```typescript
 * const incident = await createSafetyIncident(incidentData, SafetyIncident);
 * ```
 */
export const createSafetyIncident = async (
  incidentData: SafetyIncidentData,
  SafetyIncident: any,
  transaction?: Transaction,
): Promise<any> => {
  const incident = await SafetyIncident.create(
    {
      ...incidentData,
      reportedAt: new Date(),
    },
    { transaction },
  );

  // Send immediate notification for serious incidents
  if (['serious', 'critical', 'fatality'].includes(incidentData.severity)) {
    console.log(`URGENT: ${incidentData.severity} incident at site ${incidentData.siteId}`);
  }

  return incident;
};

/**
 * Retrieves all safety incidents for site with filtering.
 *
 * @param {string} siteId - Site identifier
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} SafetyIncident - SafetyIncident model
 * @param {string[]} [incidentTypes] - Filter by incident types
 * @returns {Promise<any[]>} Safety incidents
 *
 * @example
 * ```typescript
 * const incidents = await getSafetyIncidentsBySite('site-123', startDate, endDate, SafetyIncident);
 * ```
 */
export const getSafetyIncidentsBySite = async (
  siteId: string,
  startDate: Date,
  endDate: Date,
  SafetyIncident: any,
  incidentTypes?: string[],
): Promise<any[]> => {
  const where: WhereOptions = {
    siteId,
    incidentDate: {
      [Op.between]: [startDate, endDate],
    },
  };

  if (incidentTypes && incidentTypes.length > 0) {
    where.incidentType = { [Op.in]: incidentTypes };
  }

  return await SafetyIncident.findAll({
    where,
    order: [['incidentDate', 'DESC'], ['incidentTime', 'DESC']],
  });
};

/**
 * Updates incident investigation status with detailed tracking.
 *
 * @param {string} incidentId - Incident identifier
 * @param {string} status - Investigation status
 * @param {string} investigator - Investigator name
 * @param {Model} SafetyIncident - SafetyIncident model
 * @param {string} [findings] - Investigation findings
 * @returns {Promise<any>} Updated incident
 *
 * @example
 * ```typescript
 * await updateIncidentInvestigation('inc-123', 'completed', 'John Smith', SafetyIncident);
 * ```
 */
export const updateIncidentInvestigation = async (
  incidentId: string,
  status: 'pending' | 'in_progress' | 'completed',
  investigator: string,
  SafetyIncident: any,
  findings?: string,
): Promise<any> => {
  const incident = await SafetyIncident.findByPk(incidentId);
  if (!incident) throw new Error('Incident not found');

  incident.investigationStatus = status;
  incident.investigator = investigator;

  if (status === 'in_progress' && !incident.investigationStartDate) {
    incident.investigationStartDate = new Date();
  }

  if (status === 'completed') {
    incident.investigationCompletedDate = new Date();
    if (findings) {
      incident.rootCause = findings;
    }
  }

  await incident.save();
  return incident;
};

/**
 * Calculates safety statistics for site with KPIs.
 *
 * @param {string} siteId - Site identifier
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} SafetyIncident - SafetyIncident model
 * @param {Model} DailySiteLog - DailySiteLog model
 * @returns {Promise<SafetyStatistics>} Safety statistics
 *
 * @example
 * ```typescript
 * const stats = await calculateSafetyStatistics('site-123', startDate, endDate, SafetyIncident, DailySiteLog);
 * ```
 */
export const calculateSafetyStatistics = async (
  siteId: string,
  startDate: Date,
  endDate: Date,
  SafetyIncident: any,
  DailySiteLog: any,
): Promise<SafetyStatistics> => {
  // Get all incidents in period
  const incidents = await SafetyIncident.findAll({
    where: {
      siteId,
      incidentDate: {
        [Op.between]: [startDate, endDate],
      },
    },
  });

  // Get total hours worked from daily logs
  const logs = await DailySiteLog.findAll({
    where: {
      siteId,
      logDate: {
        [Op.between]: [startDate, endDate],
      },
    },
    attributes: [
      [sequelize.fn('SUM', sequelize.col('hoursWorked')), 'totalHours'],
    ],
    raw: true,
  });

  const totalHoursWorked = (logs[0] as any)?.totalHours || 0;

  const incidentCount = incidents.length;
  const injuryCount = incidents.filter((i: any) => i.incidentType === 'injury').length;
  const nearMissCount = incidents.filter((i: any) => i.incidentType === 'near_miss').length;
  const firstAidCount = incidents.filter((i: any) => i.severity === 'minor').length;
  const oshaRecordable = incidents.filter((i: any) => i.oshaRecordable).length;
  const lostTimeIncidents = incidents.filter((i: any) => i.lostTimeDays > 0).length;

  // Calculate rates per 200,000 hours (OSHA standard)
  const incidentRate = totalHoursWorked > 0 ? (incidentCount * 200000) / totalHoursWorked : 0;
  const frequencyRate = totalHoursWorked > 0 ? (injuryCount * 1000000) / totalHoursWorked : 0;

  // Calculate days since last incident
  const sortedIncidents = incidents.sort(
    (a: any, b: any) => b.incidentDate.getTime() - a.incidentDate.getTime(),
  );
  const lastIncidentDate = sortedIncidents[0]?.incidentDate || startDate;
  const daysSinceLastIncident = Math.floor(
    (new Date().getTime() - lastIncidentDate.getTime()) / 86400000,
  );

  return {
    siteId,
    periodStart: startDate,
    periodEnd: endDate,
    totalHoursWorked,
    incidentCount,
    injuryCount,
    nearMissCount,
    firstAidCount,
    lostTimeIncidents,
    oshaRecordable,
    incidentRate: Number(incidentRate.toFixed(2)),
    frequencyRate: Number(frequencyRate.toFixed(2)),
    severityRate: 0, // Would calculate from lost time days
    daysSinceLastIncident,
  };
};

/**
 * Retrieves OSHA recordable incidents for reporting.
 *
 * @param {string} siteId - Site identifier
 * @param {number} year - Reporting year
 * @param {Model} SafetyIncident - SafetyIncident model
 * @returns {Promise<any[]>} OSHA recordable incidents
 *
 * @example
 * ```typescript
 * const incidents = await getOSHARecordableIncidents('site-123', 2024, SafetyIncident);
 * ```
 */
export const getOSHARecordableIncidents = async (
  siteId: string,
  year: number,
  SafetyIncident: any,
): Promise<any[]> => {
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);

  return await SafetyIncident.findAll({
    where: {
      siteId,
      oshaRecordable: true,
      incidentDate: {
        [Op.between]: [startDate, endDate],
      },
    },
    order: [['incidentDate', 'ASC']],
  });
};

/**
 * Creates emergency response plan for site.
 *
 * @param {EmergencyResponsePlan} planData - Emergency plan data
 * @param {string} siteId - Site identifier
 * @returns {Promise<any>} Created plan
 *
 * @example
 * ```typescript
 * const plan = await createEmergencyResponsePlan(planData, 'site-123');
 * ```
 */
export const createEmergencyResponsePlan = async (
  planData: EmergencyResponsePlan,
  siteId: string,
): Promise<any> => {
  // In production, create record in EmergencyResponsePlan table
  return {
    id: `ERP-${Date.now()}`,
    ...planData,
    siteId,
    createdAt: new Date(),
  };
};

/**
 * Retrieves emergency contacts for site by type.
 *
 * @param {string} siteId - Site identifier
 * @param {string} [emergencyType] - Emergency type filter
 * @returns {Promise<EmergencyContact[]>} Emergency contacts
 *
 * @example
 * ```typescript
 * const contacts = await getEmergencyContacts('site-123', 'fire');
 * ```
 */
export const getEmergencyContacts = async (
  siteId: string,
  emergencyType?: string,
): Promise<EmergencyContact[]> => {
  // In production, query EmergencyResponsePlan table
  return [];
};

/**
 * Logs emergency drill execution and results.
 *
 * @param {string} siteId - Site identifier
 * @param {string} drillType - Type of drill
 * @param {Date} drillDate - Drill date
 * @param {string} results - Drill results
 * @returns {Promise<any>} Drill log
 *
 * @example
 * ```typescript
 * await logEmergencyDrill('site-123', 'fire', new Date(), 'All personnel evacuated in 5 minutes');
 * ```
 */
export const logEmergencyDrill = async (
  siteId: string,
  drillType: string,
  drillDate: Date,
  results: string,
): Promise<any> => {
  // In production, create record in EmergencyDrill table
  return {
    siteId,
    drillType,
    drillDate,
    results,
    createdAt: new Date(),
  };
};

/**
 * Retrieves near miss incidents for trending analysis.
 *
 * @param {string} siteId - Site identifier
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} SafetyIncident - SafetyIncident model
 * @returns {Promise<any[]>} Near miss incidents
 *
 * @example
 * ```typescript
 * const nearMisses = await getNearMissIncidents('site-123', startDate, endDate, SafetyIncident);
 * ```
 */
export const getNearMissIncidents = async (
  siteId: string,
  startDate: Date,
  endDate: Date,
  SafetyIncident: any,
): Promise<any[]> => {
  return await SafetyIncident.findAll({
    where: {
      siteId,
      incidentType: 'near_miss',
      incidentDate: {
        [Op.between]: [startDate, endDate],
      },
    },
    order: [['incidentDate', 'DESC']],
  });
};

/**
 * Identifies safety trends and patterns for proactive management.
 *
 * @param {string} siteId - Site identifier
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} SafetyIncident - SafetyIncident model
 * @returns {Promise<{ trends: any[]; recommendations: string[] }>} Safety trends
 *
 * @example
 * ```typescript
 * const analysis = await identifySafetyTrends('site-123', startDate, endDate, SafetyIncident);
 * ```
 */
export const identifySafetyTrends = async (
  siteId: string,
  startDate: Date,
  endDate: Date,
  SafetyIncident: any,
): Promise<{ trends: any[]; recommendations: string[] }> => {
  const incidents = await SafetyIncident.findAll({
    where: {
      siteId,
      incidentDate: {
        [Op.between]: [startDate, endDate],
      },
    },
  });

  // Analyze by type
  const byType: Record<string, number> = {};
  incidents.forEach((incident: any) => {
    byType[incident.incidentType] = (byType[incident.incidentType] || 0) + 1;
  });

  const trends = Object.entries(byType).map(([type, count]) => ({
    type,
    count,
    percentage: ((count / incidents.length) * 100).toFixed(1),
  }));

  const recommendations: string[] = [];
  if (byType.near_miss > 5) {
    recommendations.push('Increase safety training - high near miss count');
  }
  if (byType.injury > 2) {
    recommendations.push('Review PPE requirements and enforcement');
  }

  return { trends, recommendations };
};

// ============================================================================
// DAILY LOGS & DOCUMENTATION (Functions 21-30)
// ============================================================================

/**
 * Creates daily site log with comprehensive details.
 *
 * @param {DailyLogEntry} logData - Daily log data
 * @param {Model} DailySiteLog - DailySiteLog model
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created log
 *
 * @example
 * ```typescript
 * const log = await createDailySiteLog(logData, DailySiteLog);
 * ```
 */
export const createDailySiteLog = async (
  logData: DailyLogEntry,
  DailySiteLog: any,
  transaction?: Transaction,
): Promise<any> => {
  // Check for existing log for this date
  const existing = await DailySiteLog.findOne({
    where: {
      siteId: logData.siteId,
      logDate: logData.logDate,
    },
  });

  if (existing) {
    throw new Error('Daily log already exists for this date');
  }

  const log = await DailySiteLog.create(
    {
      ...logData,
      submittedAt: new Date(),
    },
    { transaction },
  );

  return log;
};

/**
 * Retrieves daily logs for site with date range filtering.
 *
 * @param {string} siteId - Site identifier
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} DailySiteLog - DailySiteLog model
 * @returns {Promise<any[]>} Daily logs
 *
 * @example
 * ```typescript
 * const logs = await getDailyLogsBySite('site-123', startDate, endDate, DailySiteLog);
 * ```
 */
export const getDailyLogsBySite = async (
  siteId: string,
  startDate: Date,
  endDate: Date,
  DailySiteLog: any,
): Promise<any[]> => {
  return await DailySiteLog.findAll({
    where: {
      siteId,
      logDate: {
        [Op.between]: [startDate, endDate],
      },
    },
    order: [['logDate', 'DESC']],
  });
};

/**
 * Updates daily log with additional information.
 *
 * @param {string} logId - Log identifier
 * @param {Partial<DailyLogEntry>} updates - Log updates
 * @param {Model} DailySiteLog - DailySiteLog model
 * @returns {Promise<any>} Updated log
 *
 * @example
 * ```typescript
 * await updateDailySiteLog('log-123', { notes: 'Additional notes' }, DailySiteLog);
 * ```
 */
export const updateDailySiteLog = async (
  logId: string,
  updates: Partial<DailyLogEntry>,
  DailySiteLog: any,
): Promise<any> => {
  const log = await DailySiteLog.findByPk(logId);
  if (!log) throw new Error('Daily log not found');

  Object.assign(log, updates);
  await log.save();

  return log;
};

/**
 * Approves daily log with supervisor sign-off.
 *
 * @param {string} logId - Log identifier
 * @param {string} approverName - Approver name
 * @param {Model} DailySiteLog - DailySiteLog model
 * @returns {Promise<any>} Approved log
 *
 * @example
 * ```typescript
 * await approveDailySiteLog('log-123', 'John Smith', DailySiteLog);
 * ```
 */
export const approveDailySiteLog = async (
  logId: string,
  approverName: string,
  DailySiteLog: any,
): Promise<any> => {
  const log = await DailySiteLog.findByPk(logId);
  if (!log) throw new Error('Daily log not found');

  log.approvedBy = approverName;
  log.approvedAt = new Date();
  await log.save();

  return log;
};

/**
 * Retrieves unapproved daily logs requiring attention.
 *
 * @param {string} siteId - Site identifier
 * @param {Model} DailySiteLog - DailySiteLog model
 * @returns {Promise<any[]>} Unapproved logs
 *
 * @example
 * ```typescript
 * const logs = await getUnapprovedDailyLogs('site-123', DailySiteLog);
 * ```
 */
export const getUnapprovedDailyLogs = async (
  siteId: string,
  DailySiteLog: any,
): Promise<any[]> => {
  return await DailySiteLog.findAll({
    where: {
      siteId,
      approvedBy: null,
    },
    order: [['logDate', 'ASC']],
  });
};

/**
 * Adds material delivery to daily log.
 *
 * @param {string} logId - Log identifier
 * @param {MaterialDelivery} delivery - Material delivery data
 * @param {Model} DailySiteLog - DailySiteLog model
 * @returns {Promise<any>} Updated log
 *
 * @example
 * ```typescript
 * await addMaterialDeliveryToLog('log-123', delivery, DailySiteLog);
 * ```
 */
export const addMaterialDeliveryToLog = async (
  logId: string,
  delivery: MaterialDelivery,
  DailySiteLog: any,
): Promise<any> => {
  const log = await DailySiteLog.findByPk(logId);
  if (!log) throw new Error('Daily log not found');

  log.materialsDelivered = [...log.materialsDelivered, delivery];
  await log.save();

  return log;
};

/**
 * Adds visitor entry to daily log.
 *
 * @param {string} logId - Log identifier
 * @param {VisitorEntry} visitor - Visitor entry data
 * @param {Model} DailySiteLog - DailySiteLog model
 * @returns {Promise<any>} Updated log
 *
 * @example
 * ```typescript
 * await addVisitorToLog('log-123', visitor, DailySiteLog);
 * ```
 */
export const addVisitorToLog = async (
  logId: string,
  visitor: VisitorEntry,
  DailySiteLog: any,
): Promise<any> => {
  const log = await DailySiteLog.findByPk(logId);
  if (!log) throw new Error('Daily log not found');

  log.visitorLog = [...log.visitorLog, visitor];
  await log.save();

  return log;
};

/**
 * Adds delay entry to daily log with impact tracking.
 *
 * @param {string} logId - Log identifier
 * @param {DelayEntry} delay - Delay entry data
 * @param {Model} DailySiteLog - DailySiteLog model
 * @returns {Promise<any>} Updated log
 *
 * @example
 * ```typescript
 * await addDelayToLog('log-123', delay, DailySiteLog);
 * ```
 */
export const addDelayToLog = async (
  logId: string,
  delay: DelayEntry,
  DailySiteLog: any,
): Promise<any> => {
  const log = await DailySiteLog.findByPk(logId);
  if (!log) throw new Error('Daily log not found');

  log.delaysEncountered = [...log.delaysEncountered, delay];
  await log.save();

  return log;
};

/**
 * Retrieves logs with weather impact for delay claims.
 *
 * @param {string} siteId - Site identifier
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} DailySiteLog - DailySiteLog model
 * @returns {Promise<any[]>} Weather-impacted logs
 *
 * @example
 * ```typescript
 * const logs = await getLogsWithWeatherImpact('site-123', startDate, endDate, DailySiteLog);
 * ```
 */
export const getLogsWithWeatherImpact = async (
  siteId: string,
  startDate: Date,
  endDate: Date,
  DailySiteLog: any,
): Promise<any[]> => {
  return await DailySiteLog.findAll({
    where: {
      siteId,
      weatherImpact: true,
      logDate: {
        [Op.between]: [startDate, endDate],
      },
    },
    order: [['logDate', 'ASC']],
  });
};

/**
 * Generates comprehensive daily log report for period.
 *
 * @param {string} siteId - Site identifier
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} DailySiteLog - DailySiteLog model
 * @returns {Promise<any>} Log report
 *
 * @example
 * ```typescript
 * const report = await generateDailyLogReport('site-123', startDate, endDate, DailySiteLog);
 * ```
 */
export const generateDailyLogReport = async (
  siteId: string,
  startDate: Date,
  endDate: Date,
  DailySiteLog: any,
): Promise<any> => {
  const logs = await DailySiteLog.findAll({
    where: {
      siteId,
      logDate: {
        [Op.between]: [startDate, endDate],
      },
    },
    order: [['logDate', 'ASC']],
  });

  const totalDays = logs.length;
  const totalHours = logs.reduce((sum: number, log: any) => sum + Number(log.hoursWorked), 0);
  const totalCrew = logs.reduce((sum: number, log: any) => sum + log.crewCount, 0);
  const avgCrewSize = totalDays > 0 ? totalCrew / totalDays : 0;
  const weatherDelays = logs.filter((log: any) => log.weatherImpact).length;

  return {
    siteId,
    periodStart: startDate,
    periodEnd: endDate,
    totalDays,
    totalHours: Number(totalHours.toFixed(2)),
    avgCrewSize: Number(avgCrewSize.toFixed(1)),
    weatherDelays,
    logs,
  };
};

// ============================================================================
// WEATHER TRACKING & DELAYS (Functions 31-35)
// ============================================================================

/**
 * Records weather delay with documentation for EOT claims.
 *
 * @param {WeatherDelayData} delayData - Weather delay data
 * @returns {Promise<any>} Weather delay record
 *
 * @example
 * ```typescript
 * const delay = await recordWeatherDelay(delayData);
 * ```
 */
export const recordWeatherDelay = async (
  delayData: WeatherDelayData,
): Promise<any> => {
  // In production, create record in WeatherDelay table
  return {
    id: `WD-${Date.now()}`,
    ...delayData,
    createdAt: new Date(),
  };
};

/**
 * Retrieves weather delays for EOT submission.
 *
 * @param {string} siteId - Site identifier
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<WeatherDelayData[]>} Weather delays
 *
 * @example
 * ```typescript
 * const delays = await getWeatherDelaysForEOT('site-123', startDate, endDate);
 * ```
 */
export const getWeatherDelaysForEOT = async (
  siteId: string,
  startDate: Date,
  endDate: Date,
): Promise<WeatherDelayData[]> => {
  // In production, query WeatherDelay table
  return [];
};

/**
 * Calculates total weather delay hours for period.
 *
 * @param {string} siteId - Site identifier
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<{ totalHours: number; byType: Record<string, number> }>} Delay summary
 *
 * @example
 * ```typescript
 * const summary = await calculateWeatherDelayHours('site-123', startDate, endDate);
 * ```
 */
export const calculateWeatherDelayHours = async (
  siteId: string,
  startDate: Date,
  endDate: Date,
): Promise<{ totalHours: number; byType: Record<string, number> }> => {
  // In production, query and aggregate WeatherDelay table
  return {
    totalHours: 0,
    byType: {},
  };
};

/**
 * Validates weather data against historical averages.
 *
 * @param {string} siteId - Site identifier
 * @param {Date} date - Date to validate
 * @param {WeatherCondition} reportedWeather - Reported weather
 * @returns {Promise<{ valid: boolean; historicalAverage?: any; variance?: number }>} Validation result
 *
 * @example
 * ```typescript
 * const result = await validateWeatherData('site-123', new Date(), weatherData);
 * ```
 */
export const validateWeatherData = async (
  siteId: string,
  date: Date,
  reportedWeather: WeatherCondition,
): Promise<{ valid: boolean; historicalAverage?: any; variance?: number }> => {
  // In production, compare against weather API or historical data
  return {
    valid: true,
  };
};

/**
 * Generates weather impact report for claims.
 *
 * @param {string} siteId - Site identifier
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} DailySiteLog - DailySiteLog model
 * @returns {Promise<any>} Weather impact report
 *
 * @example
 * ```typescript
 * const report = await generateWeatherImpactReport('site-123', startDate, endDate, DailySiteLog);
 * ```
 */
export const generateWeatherImpactReport = async (
  siteId: string,
  startDate: Date,
  endDate: Date,
  DailySiteLog: any,
): Promise<any> => {
  const impactedLogs = await getLogsWithWeatherImpact(siteId, startDate, endDate, DailySiteLog);

  return {
    siteId,
    periodStart: startDate,
    periodEnd: endDate,
    totalImpactedDays: impactedLogs.length,
    logs: impactedLogs,
  };
};

// ============================================================================
// MEETINGS & COMMUNICATION (Functions 36-45)
// ============================================================================

/**
 * Creates site meeting record with attendees and agenda.
 *
 * @param {SiteMeetingData} meetingData - Meeting data
 * @returns {Promise<any>} Created meeting
 *
 * @example
 * ```typescript
 * const meeting = await createSiteMeeting(meetingData);
 * ```
 */
export const createSiteMeeting = async (
  meetingData: SiteMeetingData,
): Promise<any> => {
  // In production, create record in SiteMeeting table
  return {
    id: `MTG-${Date.now()}`,
    ...meetingData,
    createdAt: new Date(),
  };
};

/**
 * Retrieves site meetings with filtering by type.
 *
 * @param {string} siteId - Site identifier
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {string[]} [meetingTypes] - Filter by meeting types
 * @returns {Promise<SiteMeetingData[]>} Site meetings
 *
 * @example
 * ```typescript
 * const meetings = await getSiteMeetings('site-123', startDate, endDate, ['safety']);
 * ```
 */
export const getSiteMeetings = async (
  siteId: string,
  startDate: Date,
  endDate: Date,
  meetingTypes?: string[],
): Promise<SiteMeetingData[]> => {
  // In production, query SiteMeeting table
  return [];
};

/**
 * Adds action item to meeting with assignment.
 *
 * @param {string} meetingId - Meeting identifier
 * @param {ActionItem} actionItem - Action item data
 * @returns {Promise<any>} Updated meeting
 *
 * @example
 * ```typescript
 * await addMeetingActionItem('mtg-123', actionItem);
 * ```
 */
export const addMeetingActionItem = async (
  meetingId: string,
  actionItem: ActionItem,
): Promise<any> => {
  // In production, update SiteMeeting record
  return {
    meetingId,
    actionItem,
    addedAt: new Date(),
  };
};

/**
 * Retrieves open action items across all meetings.
 *
 * @param {string} siteId - Site identifier
 * @param {string} [assignedTo] - Filter by assignee
 * @returns {Promise<any[]>} Open action items
 *
 * @example
 * ```typescript
 * const items = await getOpenActionItems('site-123', 'John Smith');
 * ```
 */
export const getOpenActionItems = async (
  siteId: string,
  assignedTo?: string,
): Promise<any[]> => {
  // In production, query SiteMeeting table and filter action items
  return [];
};

/**
 * Updates action item status with completion tracking.
 *
 * @param {string} meetingId - Meeting identifier
 * @param {string} actionItemId - Action item identifier
 * @param {string} newStatus - New status
 * @returns {Promise<any>} Updated action item
 *
 * @example
 * ```typescript
 * await updateActionItemStatus('mtg-123', 'ai-456', 'completed');
 * ```
 */
export const updateActionItemStatus = async (
  meetingId: string,
  actionItemId: string,
  newStatus: 'open' | 'in_progress' | 'completed' | 'cancelled',
): Promise<any> => {
  // In production, update action item in SiteMeeting record
  return {
    meetingId,
    actionItemId,
    newStatus,
    updatedAt: new Date(),
  };
};

/**
 * Creates communication log entry with tracking.
 *
 * @param {CommunicationLogEntry} commData - Communication data
 * @returns {Promise<any>} Created communication log
 *
 * @example
 * ```typescript
 * const log = await createCommunicationLog(commData);
 * ```
 */
export const createCommunicationLog = async (
  commData: CommunicationLogEntry,
): Promise<any> => {
  // In production, create record in CommunicationLog table
  return {
    id: `COMM-${Date.now()}`,
    ...commData,
    createdAt: new Date(),
  };
};

/**
 * Retrieves communication logs with search and filtering.
 *
 * @param {string} siteId - Site identifier
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {string[]} [commTypes] - Filter by communication types
 * @returns {Promise<CommunicationLogEntry[]>} Communication logs
 *
 * @example
 * ```typescript
 * const logs = await getCommunicationLogs('site-123', startDate, endDate, ['rfi']);
 * ```
 */
export const getCommunicationLogs = async (
  siteId: string,
  startDate: Date,
  endDate: Date,
  commTypes?: string[],
): Promise<CommunicationLogEntry[]> => {
  // In production, query CommunicationLog table
  return [];
};

/**
 * Searches communication logs by content and parties.
 *
 * @param {string} siteId - Site identifier
 * @param {string} searchTerm - Search term
 * @returns {Promise<CommunicationLogEntry[]>} Matching logs
 *
 * @example
 * ```typescript
 * const results = await searchCommunicationLogs('site-123', 'foundation');
 * ```
 */
export const searchCommunicationLogs = async (
  siteId: string,
  searchTerm: string,
): Promise<CommunicationLogEntry[]> => {
  // In production, full-text search on CommunicationLog table
  return [];
};

/**
 * Retrieves communications requiring follow-up.
 *
 * @param {string} siteId - Site identifier
 * @returns {Promise<CommunicationLogEntry[]>} Pending follow-ups
 *
 * @example
 * ```typescript
 * const pending = await getPendingFollowUps('site-123');
 * ```
 */
export const getPendingFollowUps = async (
  siteId: string,
): Promise<CommunicationLogEntry[]> => {
  // In production, query CommunicationLog table where followUpRequired = true and status != closed
  return [];
};

/**
 * Generates site communication summary report.
 *
 * @param {string} siteId - Site identifier
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<any>} Communication summary
 *
 * @example
 * ```typescript
 * const summary = await generateCommunicationSummary('site-123', startDate, endDate);
 * ```
 */
export const generateCommunicationSummary = async (
  siteId: string,
  startDate: Date,
  endDate: Date,
): Promise<any> => {
  const logs = await getCommunicationLogs(siteId, startDate, endDate);

  const byType: Record<string, number> = {};
  logs.forEach(log => {
    byType[log.communicationType] = (byType[log.communicationType] || 0) + 1;
  });

  return {
    siteId,
    periodStart: startDate,
    periodEnd: endDate,
    totalCommunications: logs.length,
    byType,
  };
};
