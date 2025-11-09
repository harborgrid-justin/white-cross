"use strict";
/**
 * LOC: HCM_SAFE_001
 * File: /reuse/server/human-capital/safety-health-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - zod
 *   - i18next
 *
 * DOWNSTREAM (imported by):
 *   - Safety & health controllers
 *   - OSHA reporting services
 *   - Workers' compensation systems
 *   - Incident management dashboards
 *   - Health monitoring services
 */
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SafetyHealthController = exports.SafetyHealthService = exports.SafetyCommitteeMeetingModel = exports.EmergencyDrillModel = exports.SafetyCertificationModel = exports.HealthSurveillanceModel = exports.ReturnToWorkPlanModel = exports.WorkersCompClaimModel = exports.PPEIssuanceModel = exports.HazardModel = exports.InspectionFindingModel = exports.SafetyInspectionModel = exports.IncidentReportModel = exports.SafetyCertificationSchema = exports.HealthSurveillanceSchema = exports.ReturnToWorkPlanSchema = exports.WorkersCompClaimSchema = exports.PPEIssuanceSchema = exports.HazardSchema = exports.SafetyInspectionSchema = exports.IncidentReportSchema = exports.CertificationStatus = exports.EmergencyType = exports.HealthSurveillanceType = exports.ReturnToWorkStatus = exports.WorkersCompStatus = exports.PPEType = exports.HazardStatus = exports.HazardSeverity = exports.InspectionStatus = exports.IncidentStatus = exports.IncidentType = exports.IncidentSeverity = void 0;
exports.createIncidentReport = createIncidentReport;
exports.updateIncidentReport = updateIncidentReport;
exports.getOSHARecordableIncidents = getOSHARecordableIncidents;
exports.getNearMissIncidents = getNearMissIncidents;
exports.closeIncident = closeIncident;
exports.createSafetyInspection = createSafetyInspection;
exports.completeSafetyInspection = completeSafetyInspection;
exports.getUpcomingInspections = getUpcomingInspections;
exports.getFailedInspections = getFailedInspections;
exports.createHazard = createHazard;
exports.updateHazardStatus = updateHazardStatus;
exports.getOpenHazards = getOpenHazards;
exports.getImminentDangerHazards = getImminentDangerHazards;
exports.issuePPE = issuePPE;
exports.returnPPE = returnPPE;
exports.getEmployeePPE = getEmployeePPE;
exports.getExpiringPPE = getExpiringPPE;
exports.createWorkersCompClaim = createWorkersCompClaim;
exports.updateClaimStatus = updateClaimStatus;
exports.getOpenClaims = getOpenClaims;
exports.calculateTotalClaimCosts = calculateTotalClaimCosts;
exports.createReturnToWorkPlan = createReturnToWorkPlan;
exports.updateRTWPlanStatus = updateRTWPlanStatus;
exports.getActiveRTWPlans = getActiveRTWPlans;
exports.scheduleHealthSurveillance = scheduleHealthSurveillance;
exports.completeHealthSurveillance = completeHealthSurveillance;
exports.getDueHealthSurveillance = getDueHealthSurveillance;
exports.recordSafetyCertification = recordSafetyCertification;
exports.getExpiringCertifications = getExpiringCertifications;
exports.getEmployeeCertifications = getEmployeeCertifications;
exports.scheduleEmergencyDrill = scheduleEmergencyDrill;
exports.completeEmergencyDrill = completeEmergencyDrill;
exports.getUpcomingDrills = getUpcomingDrills;
exports.createSafetyCommitteeMeeting = createSafetyCommitteeMeeting;
exports.getRecentCommitteeMeetings = getRecentCommitteeMeetings;
exports.calculateIncidentRate = calculateIncidentRate;
exports.calculateDARTRate = calculateDARTRate;
exports.getSafetyDashboardMetrics = getSafetyDashboardMetrics;
exports.getIncidentByNumber = getIncidentByNumber;
exports.getClaimByNumber = getClaimByNumber;
exports.getHazardByNumber = getHazardByNumber;
exports.getInspectionByNumber = getInspectionByNumber;
exports.getEmployeeIncidentHistory = getEmployeeIncidentHistory;
exports.getEmployeeClaims = getEmployeeClaims;
exports.generateOSHA300Log = generateOSHA300Log;
/**
 * File: /reuse/server/human-capital/safety-health-kit.ts
 * Locator: WC-HCM-SAFE-001
 * Purpose: Safety & Health Kit - Comprehensive workplace safety and occupational health management
 *
 * Upstream: NestJS, Swagger, Sequelize, Zod, i18next
 * Downstream: ../backend/safety/*, ../services/osha/*, Workers' comp systems, Health monitoring
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize-typescript 2.x
 * Exports: 45 utility functions for workplace safety program management, incident & accident reporting,
 *          safety inspections & audits, hazard identification & mitigation, safety training & certification,
 *          PPE tracking, workers' compensation case management, return-to-work programs,
 *          occupational health monitoring, ergonomics assessment, safety analytics & metrics,
 *          safety committee management, emergency preparedness
 *
 * LLM Context: Enterprise-grade workplace safety and occupational health management for White Cross
 * healthcare system. Provides comprehensive OSHA compliance including incident/accident reporting,
 * safety inspection management, hazard identification and risk assessment, safety training certification,
 * PPE inventory and distribution, workers' compensation claims, return-to-work coordination,
 * occupational health surveillance, ergonomics programs, safety committee administration,
 * emergency response planning, safety metrics and KPIs, near-miss reporting, workplace violence
 * prevention, and OSHA recordkeeping (300, 300A, 301 forms). Healthcare-specific safety requirements.
 */
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const sequelize_typescript_1 = require("sequelize-typescript");
const zod_1 = require("zod");
const sequelize_1 = require("sequelize");
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * Incident severity enumeration
 */
var IncidentSeverity;
(function (IncidentSeverity) {
    IncidentSeverity["FATAL"] = "fatal";
    IncidentSeverity["SERIOUS"] = "serious";
    IncidentSeverity["MODERATE"] = "moderate";
    IncidentSeverity["MINOR"] = "minor";
    IncidentSeverity["FIRST_AID"] = "first_aid";
    IncidentSeverity["NEAR_MISS"] = "near_miss";
})(IncidentSeverity || (exports.IncidentSeverity = IncidentSeverity = {}));
/**
 * Incident type enumeration
 */
var IncidentType;
(function (IncidentType) {
    IncidentType["INJURY"] = "injury";
    IncidentType["ILLNESS"] = "illness";
    IncidentType["EXPOSURE"] = "exposure";
    IncidentType["PROPERTY_DAMAGE"] = "property_damage";
    IncidentType["ENVIRONMENTAL"] = "environmental";
    IncidentType["VEHICLE_ACCIDENT"] = "vehicle_accident";
    IncidentType["WORKPLACE_VIOLENCE"] = "workplace_violence";
    IncidentType["NEAR_MISS"] = "near_miss";
})(IncidentType || (exports.IncidentType = IncidentType = {}));
/**
 * Incident status enumeration
 */
var IncidentStatus;
(function (IncidentStatus) {
    IncidentStatus["REPORTED"] = "reported";
    IncidentStatus["UNDER_INVESTIGATION"] = "under_investigation";
    IncidentStatus["INVESTIGATION_COMPLETE"] = "investigation_complete";
    IncidentStatus["CORRECTIVE_ACTIONS_PENDING"] = "corrective_actions_pending";
    IncidentStatus["CLOSED"] = "closed";
})(IncidentStatus || (exports.IncidentStatus = IncidentStatus = {}));
/**
 * Inspection status enumeration
 */
var InspectionStatus;
(function (InspectionStatus) {
    InspectionStatus["SCHEDULED"] = "scheduled";
    InspectionStatus["IN_PROGRESS"] = "in_progress";
    InspectionStatus["COMPLETED"] = "completed";
    InspectionStatus["FAILED"] = "failed";
    InspectionStatus["PASSED"] = "passed";
})(InspectionStatus || (exports.InspectionStatus = InspectionStatus = {}));
/**
 * Hazard severity enumeration
 */
var HazardSeverity;
(function (HazardSeverity) {
    HazardSeverity["IMMINENT_DANGER"] = "imminent_danger";
    HazardSeverity["SERIOUS"] = "serious";
    HazardSeverity["MODERATE"] = "moderate";
    HazardSeverity["LOW"] = "low";
})(HazardSeverity || (exports.HazardSeverity = HazardSeverity = {}));
/**
 * Hazard status enumeration
 */
var HazardStatus;
(function (HazardStatus) {
    HazardStatus["IDENTIFIED"] = "identified";
    HazardStatus["UNDER_EVALUATION"] = "under_evaluation";
    HazardStatus["MITIGATION_PLANNED"] = "mitigation_planned";
    HazardStatus["MITIGATION_IN_PROGRESS"] = "mitigation_in_progress";
    HazardStatus["MITIGATED"] = "mitigated";
    HazardStatus["ACCEPTED_RISK"] = "accepted_risk";
})(HazardStatus || (exports.HazardStatus = HazardStatus = {}));
/**
 * PPE type enumeration
 */
var PPEType;
(function (PPEType) {
    PPEType["RESPIRATOR"] = "respirator";
    PPEType["SAFETY_GLASSES"] = "safety_glasses";
    PPEType["HARD_HAT"] = "hard_hat";
    PPEType["SAFETY_SHOES"] = "safety_shoes";
    PPEType["GLOVES"] = "gloves";
    PPEType["HEARING_PROTECTION"] = "hearing_protection";
    PPEType["FACE_SHIELD"] = "face_shield";
    PPEType["PROTECTIVE_CLOTHING"] = "protective_clothing";
    PPEType["FALL_PROTECTION"] = "fall_protection";
    PPEType["HIGH_VISIBILITY_VEST"] = "high_visibility_vest";
})(PPEType || (exports.PPEType = PPEType = {}));
/**
 * Workers' comp claim status
 */
var WorkersCompStatus;
(function (WorkersCompStatus) {
    WorkersCompStatus["REPORTED"] = "reported";
    WorkersCompStatus["ACCEPTED"] = "accepted";
    WorkersCompStatus["DENIED"] = "denied";
    WorkersCompStatus["UNDER_REVIEW"] = "under_review";
    WorkersCompStatus["MEDICAL_TREATMENT"] = "medical_treatment";
    WorkersCompStatus["MODIFIED_DUTY"] = "modified_duty";
    WorkersCompStatus["CLOSED"] = "closed";
    WorkersCompStatus["APPEALED"] = "appealed";
})(WorkersCompStatus || (exports.WorkersCompStatus = WorkersCompStatus = {}));
/**
 * Return to work status
 */
var ReturnToWorkStatus;
(function (ReturnToWorkStatus) {
    ReturnToWorkStatus["NOT_STARTED"] = "not_started";
    ReturnToWorkStatus["MEDICAL_EVALUATION"] = "medical_evaluation";
    ReturnToWorkStatus["RESTRICTIONS_IDENTIFIED"] = "restrictions_identified";
    ReturnToWorkStatus["MODIFIED_DUTY_ASSIGNED"] = "modified_duty_assigned";
    ReturnToWorkStatus["FULL_DUTY_RETURNED"] = "full_duty_returned";
    ReturnToWorkStatus["UNABLE_TO_RETURN"] = "unable_to_return";
})(ReturnToWorkStatus || (exports.ReturnToWorkStatus = ReturnToWorkStatus = {}));
/**
 * Health surveillance type
 */
var HealthSurveillanceType;
(function (HealthSurveillanceType) {
    HealthSurveillanceType["ANNUAL_PHYSICAL"] = "annual_physical";
    HealthSurveillanceType["RESPIRATORY_FIT_TEST"] = "respiratory_fit_test";
    HealthSurveillanceType["HEARING_CONSERVATION"] = "hearing_conservation";
    HealthSurveillanceType["BLOOD_BORNE_PATHOGEN"] = "blood_borne_pathogen";
    HealthSurveillanceType["HAZMAT_SCREENING"] = "hazmat_screening";
    HealthSurveillanceType["DRUG_ALCOHOL_TEST"] = "drug_alcohol_test";
    HealthSurveillanceType["VISION_SCREENING"] = "vision_screening";
    HealthSurveillanceType["ERGONOMIC_ASSESSMENT"] = "ergonomic_assessment";
})(HealthSurveillanceType || (exports.HealthSurveillanceType = HealthSurveillanceType = {}));
/**
 * Emergency type enumeration
 */
var EmergencyType;
(function (EmergencyType) {
    EmergencyType["FIRE"] = "fire";
    EmergencyType["MEDICAL"] = "medical";
    EmergencyType["CHEMICAL_SPILL"] = "chemical_spill";
    EmergencyType["NATURAL_DISASTER"] = "natural_disaster";
    EmergencyType["ACTIVE_SHOOTER"] = "active_shooter";
    EmergencyType["BOMB_THREAT"] = "bomb_threat";
    EmergencyType["POWER_OUTAGE"] = "power_outage";
    EmergencyType["EVACUATION"] = "evacuation";
})(EmergencyType || (exports.EmergencyType = EmergencyType = {}));
/**
 * Safety training certification status
 */
var CertificationStatus;
(function (CertificationStatus) {
    CertificationStatus["VALID"] = "valid";
    CertificationStatus["EXPIRING_SOON"] = "expiring_soon";
    CertificationStatus["EXPIRED"] = "expired";
    CertificationStatus["REVOKED"] = "revoked";
    CertificationStatus["PENDING"] = "pending";
})(CertificationStatus || (exports.CertificationStatus = CertificationStatus = {}));
// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================
/**
 * Incident report validation schema
 */
exports.IncidentReportSchema = zod_1.z.object({
    incidentNumber: zod_1.z.string().min(1).max(50),
    incidentType: zod_1.z.nativeEnum(IncidentType),
    severity: zod_1.z.nativeEnum(IncidentSeverity),
    status: zod_1.z.nativeEnum(IncidentStatus).default(IncidentStatus.REPORTED),
    incidentDate: zod_1.z.coerce.date(),
    reportedDate: zod_1.z.coerce.date(),
    reportedBy: zod_1.z.string().uuid(),
    employeeId: zod_1.z.string().uuid().optional(),
    location: zod_1.z.string().min(1).max(255),
    description: zod_1.z.string().min(1).max(5000),
    immediateCause: zod_1.z.string().max(2000).optional(),
    rootCause: zod_1.z.string().max(2000).optional(),
    witnessNames: zod_1.z.array(zod_1.z.string()).optional(),
    injuryDetails: zod_1.z.record(zod_1.z.any()).optional(),
    propertyDamage: zod_1.z.number().min(0).optional(),
    workDaysLost: zod_1.z.number().int().min(0).optional(),
    restrictedWorkDays: zod_1.z.number().int().min(0).optional(),
    oshaRecordable: zod_1.z.boolean().default(false),
    investigationNotes: zod_1.z.string().optional(),
    correctiveActions: zod_1.z.array(zod_1.z.string()).optional(),
    investigatedBy: zod_1.z.string().uuid().optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
/**
 * Safety inspection validation schema
 */
exports.SafetyInspectionSchema = zod_1.z.object({
    inspectionNumber: zod_1.z.string().min(1).max(50),
    inspectionType: zod_1.z.string().min(1).max(100),
    scheduledDate: zod_1.z.coerce.date(),
    completedDate: zod_1.z.coerce.date().optional(),
    inspector: zod_1.z.string().uuid(),
    location: zod_1.z.string().min(1).max(255),
    status: zod_1.z.nativeEnum(InspectionStatus).default(InspectionStatus.SCHEDULED),
    score: zod_1.z.number().min(0).max(100).optional(),
    findingsCount: zod_1.z.number().int().min(0).optional(),
    criticalFindings: zod_1.z.number().int().min(0).optional(),
    notes: zod_1.z.string().optional(),
});
/**
 * Hazard validation schema
 */
exports.HazardSchema = zod_1.z.object({
    hazardNumber: zod_1.z.string().min(1).max(50),
    hazardType: zod_1.z.string().min(1).max(100),
    severity: zod_1.z.nativeEnum(HazardSeverity),
    status: zod_1.z.nativeEnum(HazardStatus).default(HazardStatus.IDENTIFIED),
    identifiedDate: zod_1.z.coerce.date(),
    identifiedBy: zod_1.z.string().uuid(),
    location: zod_1.z.string().min(1).max(255),
    description: zod_1.z.string().min(1).max(2000),
    riskAssessment: zod_1.z.string().max(2000).optional(),
    mitigationPlan: zod_1.z.string().max(2000).optional(),
    mitigationCost: zod_1.z.number().min(0).optional(),
    responsibleParty: zod_1.z.string().uuid().optional(),
    targetCompletionDate: zod_1.z.coerce.date().optional(),
    photoUrls: zod_1.z.array(zod_1.z.string()).optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
/**
 * PPE issuance validation schema
 */
exports.PPEIssuanceSchema = zod_1.z.object({
    employeeId: zod_1.z.string().uuid(),
    ppeType: zod_1.z.nativeEnum(PPEType),
    itemDescription: zod_1.z.string().min(1).max(255),
    manufacturer: zod_1.z.string().max(100).optional(),
    modelNumber: zod_1.z.string().max(100).optional(),
    serialNumber: zod_1.z.string().max(100).optional(),
    issuedDate: zod_1.z.coerce.date(),
    issuedBy: zod_1.z.string().uuid(),
    expiryDate: zod_1.z.coerce.date().optional(),
    size: zod_1.z.string().max(20).optional(),
    cost: zod_1.z.number().min(0).optional(),
    notes: zod_1.z.string().max(1000).optional(),
});
/**
 * Workers' comp claim validation schema
 */
exports.WorkersCompClaimSchema = zod_1.z.object({
    claimNumber: zod_1.z.string().min(1).max(50),
    employeeId: zod_1.z.string().uuid(),
    incidentId: zod_1.z.string().uuid().optional(),
    injuryDate: zod_1.z.coerce.date(),
    reportedDate: zod_1.z.coerce.date(),
    injuryType: zod_1.z.string().min(1).max(100),
    bodyPart: zod_1.z.string().min(1).max(100),
    status: zod_1.z.nativeEnum(WorkersCompStatus).default(WorkersCompStatus.REPORTED),
    carrierClaimNumber: zod_1.z.string().max(100).optional(),
    estimatedCost: zod_1.z.number().min(0).optional(),
    medicalProvider: zod_1.z.string().max(255).optional(),
    notes: zod_1.z.string().optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
/**
 * Return to work plan validation schema
 */
exports.ReturnToWorkPlanSchema = zod_1.z.object({
    employeeId: zod_1.z.string().uuid(),
    claimId: zod_1.z.string().uuid().optional(),
    status: zod_1.z.nativeEnum(ReturnToWorkStatus).default(ReturnToWorkStatus.NOT_STARTED),
    injuryDate: zod_1.z.coerce.date(),
    expectedReturnDate: zod_1.z.coerce.date().optional(),
    restrictions: zod_1.z.array(zod_1.z.string()).optional(),
    modifiedDuties: zod_1.z.array(zod_1.z.string()).optional(),
    accommodations: zod_1.z.array(zod_1.z.string()).optional(),
    medicalClearance: zod_1.z.boolean().optional(),
    medicalProvider: zod_1.z.string().max(255).optional(),
    coordinator: zod_1.z.string().uuid(),
});
/**
 * Health surveillance validation schema
 */
exports.HealthSurveillanceSchema = zod_1.z.object({
    employeeId: zod_1.z.string().uuid(),
    surveillanceType: zod_1.z.nativeEnum(HealthSurveillanceType),
    scheduledDate: zod_1.z.coerce.date(),
    completedDate: zod_1.z.coerce.date().optional(),
    provider: zod_1.z.string().max(255).optional(),
    result: zod_1.z.string().max(500).optional(),
    restrictions: zod_1.z.array(zod_1.z.string()).optional(),
    recommendations: zod_1.z.array(zod_1.z.string()).optional(),
    nextDueDate: zod_1.z.coerce.date().optional(),
    certificateUrl: zod_1.z.string().url().optional(),
    notes: zod_1.z.string().optional(),
});
/**
 * Safety certification validation schema
 */
exports.SafetyCertificationSchema = zod_1.z.object({
    employeeId: zod_1.z.string().uuid(),
    certificationName: zod_1.z.string().min(1).max(255),
    certificationBody: zod_1.z.string().min(1).max(255),
    issueDate: zod_1.z.coerce.date(),
    expiryDate: zod_1.z.coerce.date().optional(),
    status: zod_1.z.nativeEnum(CertificationStatus).default(CertificationStatus.VALID),
    certificateNumber: zod_1.z.string().max(100).optional(),
    certificateUrl: zod_1.z.string().url().optional(),
    instructor: zod_1.z.string().max(255).optional(),
    score: zod_1.z.number().min(0).max(100).optional(),
    renewalRequired: zod_1.z.boolean().default(true),
});
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Incident Report Model
 */
let IncidentReportModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'incident_reports',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['incident_number'], unique: true },
                { fields: ['incident_type'] },
                { fields: ['severity'] },
                { fields: ['status'] },
                { fields: ['employee_id'] },
                { fields: ['incident_date'] },
                { fields: ['osha_recordable'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _incidentNumber_decorators;
    let _incidentNumber_initializers = [];
    let _incidentNumber_extraInitializers = [];
    let _incidentType_decorators;
    let _incidentType_initializers = [];
    let _incidentType_extraInitializers = [];
    let _severity_decorators;
    let _severity_initializers = [];
    let _severity_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _incidentDate_decorators;
    let _incidentDate_initializers = [];
    let _incidentDate_extraInitializers = [];
    let _reportedDate_decorators;
    let _reportedDate_initializers = [];
    let _reportedDate_extraInitializers = [];
    let _reportedBy_decorators;
    let _reportedBy_initializers = [];
    let _reportedBy_extraInitializers = [];
    let _employeeId_decorators;
    let _employeeId_initializers = [];
    let _employeeId_extraInitializers = [];
    let _location_decorators;
    let _location_initializers = [];
    let _location_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _immediateCause_decorators;
    let _immediateCause_initializers = [];
    let _immediateCause_extraInitializers = [];
    let _rootCause_decorators;
    let _rootCause_initializers = [];
    let _rootCause_extraInitializers = [];
    let _witnessNames_decorators;
    let _witnessNames_initializers = [];
    let _witnessNames_extraInitializers = [];
    let _injuryDetails_decorators;
    let _injuryDetails_initializers = [];
    let _injuryDetails_extraInitializers = [];
    let _propertyDamage_decorators;
    let _propertyDamage_initializers = [];
    let _propertyDamage_extraInitializers = [];
    let _workDaysLost_decorators;
    let _workDaysLost_initializers = [];
    let _workDaysLost_extraInitializers = [];
    let _restrictedWorkDays_decorators;
    let _restrictedWorkDays_initializers = [];
    let _restrictedWorkDays_extraInitializers = [];
    let _oshaRecordable_decorators;
    let _oshaRecordable_initializers = [];
    let _oshaRecordable_extraInitializers = [];
    let _investigationNotes_decorators;
    let _investigationNotes_initializers = [];
    let _investigationNotes_extraInitializers = [];
    let _correctiveActions_decorators;
    let _correctiveActions_initializers = [];
    let _correctiveActions_extraInitializers = [];
    let _investigatedBy_decorators;
    let _investigatedBy_initializers = [];
    let _investigatedBy_extraInitializers = [];
    let _investigationCompletedDate_decorators;
    let _investigationCompletedDate_initializers = [];
    let _investigationCompletedDate_extraInitializers = [];
    let _closedDate_decorators;
    let _closedDate_initializers = [];
    let _closedDate_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var IncidentReportModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.incidentNumber = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _incidentNumber_initializers, void 0));
            this.incidentType = (__runInitializers(this, _incidentNumber_extraInitializers), __runInitializers(this, _incidentType_initializers, void 0));
            this.severity = (__runInitializers(this, _incidentType_extraInitializers), __runInitializers(this, _severity_initializers, void 0));
            this.status = (__runInitializers(this, _severity_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.incidentDate = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _incidentDate_initializers, void 0));
            this.reportedDate = (__runInitializers(this, _incidentDate_extraInitializers), __runInitializers(this, _reportedDate_initializers, void 0));
            this.reportedBy = (__runInitializers(this, _reportedDate_extraInitializers), __runInitializers(this, _reportedBy_initializers, void 0));
            this.employeeId = (__runInitializers(this, _reportedBy_extraInitializers), __runInitializers(this, _employeeId_initializers, void 0));
            this.location = (__runInitializers(this, _employeeId_extraInitializers), __runInitializers(this, _location_initializers, void 0));
            this.description = (__runInitializers(this, _location_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.immediateCause = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _immediateCause_initializers, void 0));
            this.rootCause = (__runInitializers(this, _immediateCause_extraInitializers), __runInitializers(this, _rootCause_initializers, void 0));
            this.witnessNames = (__runInitializers(this, _rootCause_extraInitializers), __runInitializers(this, _witnessNames_initializers, void 0));
            this.injuryDetails = (__runInitializers(this, _witnessNames_extraInitializers), __runInitializers(this, _injuryDetails_initializers, void 0));
            this.propertyDamage = (__runInitializers(this, _injuryDetails_extraInitializers), __runInitializers(this, _propertyDamage_initializers, void 0));
            this.workDaysLost = (__runInitializers(this, _propertyDamage_extraInitializers), __runInitializers(this, _workDaysLost_initializers, void 0));
            this.restrictedWorkDays = (__runInitializers(this, _workDaysLost_extraInitializers), __runInitializers(this, _restrictedWorkDays_initializers, void 0));
            this.oshaRecordable = (__runInitializers(this, _restrictedWorkDays_extraInitializers), __runInitializers(this, _oshaRecordable_initializers, void 0));
            this.investigationNotes = (__runInitializers(this, _oshaRecordable_extraInitializers), __runInitializers(this, _investigationNotes_initializers, void 0));
            this.correctiveActions = (__runInitializers(this, _investigationNotes_extraInitializers), __runInitializers(this, _correctiveActions_initializers, void 0));
            this.investigatedBy = (__runInitializers(this, _correctiveActions_extraInitializers), __runInitializers(this, _investigatedBy_initializers, void 0));
            this.investigationCompletedDate = (__runInitializers(this, _investigatedBy_extraInitializers), __runInitializers(this, _investigationCompletedDate_initializers, void 0));
            this.closedDate = (__runInitializers(this, _investigationCompletedDate_extraInitializers), __runInitializers(this, _closedDate_initializers, void 0));
            this.metadata = (__runInitializers(this, _closedDate_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "IncidentReportModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, primaryKey: true })];
        _incidentNumber_decorators = [sequelize_typescript_1.Unique, (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: false,
                field: 'incident_number',
            })];
        _incidentType_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(IncidentType)),
                allowNull: false,
                field: 'incident_type',
            })];
        _severity_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(IncidentSeverity)),
                allowNull: false,
            })];
        _status_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(IncidentStatus)),
                allowNull: false,
                defaultValue: IncidentStatus.REPORTED,
            })];
        _incidentDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
                field: 'incident_date',
            })];
        _reportedDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
                field: 'reported_date',
            })];
        _reportedBy_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'reported_by',
            })];
        _employeeId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: true,
                field: 'employee_id',
            })];
        _location_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(255),
                allowNull: false,
            })];
        _description_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: false,
            })];
        _immediateCause_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
                field: 'immediate_cause',
            })];
        _rootCause_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
                field: 'root_cause',
            })];
        _witnessNames_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING),
                allowNull: true,
                field: 'witness_names',
            })];
        _injuryDetails_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
                field: 'injury_details',
            })];
        _propertyDamage_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(12, 2),
                allowNull: true,
                field: 'property_damage',
            })];
        _workDaysLost_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: true,
                field: 'work_days_lost',
            })];
        _restrictedWorkDays_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: true,
                field: 'restricted_work_days',
            })];
        _oshaRecordable_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                allowNull: false,
                defaultValue: false,
                field: 'osha_recordable',
            })];
        _investigationNotes_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
                field: 'investigation_notes',
            })];
        _correctiveActions_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.TEXT),
                allowNull: true,
                field: 'corrective_actions',
            })];
        _investigatedBy_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: true,
                field: 'investigated_by',
            })];
        _investigationCompletedDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
                field: 'investigation_completed_date',
            })];
        _closedDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
                field: 'closed_date',
            })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _incidentNumber_decorators, { kind: "field", name: "incidentNumber", static: false, private: false, access: { has: obj => "incidentNumber" in obj, get: obj => obj.incidentNumber, set: (obj, value) => { obj.incidentNumber = value; } }, metadata: _metadata }, _incidentNumber_initializers, _incidentNumber_extraInitializers);
        __esDecorate(null, null, _incidentType_decorators, { kind: "field", name: "incidentType", static: false, private: false, access: { has: obj => "incidentType" in obj, get: obj => obj.incidentType, set: (obj, value) => { obj.incidentType = value; } }, metadata: _metadata }, _incidentType_initializers, _incidentType_extraInitializers);
        __esDecorate(null, null, _severity_decorators, { kind: "field", name: "severity", static: false, private: false, access: { has: obj => "severity" in obj, get: obj => obj.severity, set: (obj, value) => { obj.severity = value; } }, metadata: _metadata }, _severity_initializers, _severity_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _incidentDate_decorators, { kind: "field", name: "incidentDate", static: false, private: false, access: { has: obj => "incidentDate" in obj, get: obj => obj.incidentDate, set: (obj, value) => { obj.incidentDate = value; } }, metadata: _metadata }, _incidentDate_initializers, _incidentDate_extraInitializers);
        __esDecorate(null, null, _reportedDate_decorators, { kind: "field", name: "reportedDate", static: false, private: false, access: { has: obj => "reportedDate" in obj, get: obj => obj.reportedDate, set: (obj, value) => { obj.reportedDate = value; } }, metadata: _metadata }, _reportedDate_initializers, _reportedDate_extraInitializers);
        __esDecorate(null, null, _reportedBy_decorators, { kind: "field", name: "reportedBy", static: false, private: false, access: { has: obj => "reportedBy" in obj, get: obj => obj.reportedBy, set: (obj, value) => { obj.reportedBy = value; } }, metadata: _metadata }, _reportedBy_initializers, _reportedBy_extraInitializers);
        __esDecorate(null, null, _employeeId_decorators, { kind: "field", name: "employeeId", static: false, private: false, access: { has: obj => "employeeId" in obj, get: obj => obj.employeeId, set: (obj, value) => { obj.employeeId = value; } }, metadata: _metadata }, _employeeId_initializers, _employeeId_extraInitializers);
        __esDecorate(null, null, _location_decorators, { kind: "field", name: "location", static: false, private: false, access: { has: obj => "location" in obj, get: obj => obj.location, set: (obj, value) => { obj.location = value; } }, metadata: _metadata }, _location_initializers, _location_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _immediateCause_decorators, { kind: "field", name: "immediateCause", static: false, private: false, access: { has: obj => "immediateCause" in obj, get: obj => obj.immediateCause, set: (obj, value) => { obj.immediateCause = value; } }, metadata: _metadata }, _immediateCause_initializers, _immediateCause_extraInitializers);
        __esDecorate(null, null, _rootCause_decorators, { kind: "field", name: "rootCause", static: false, private: false, access: { has: obj => "rootCause" in obj, get: obj => obj.rootCause, set: (obj, value) => { obj.rootCause = value; } }, metadata: _metadata }, _rootCause_initializers, _rootCause_extraInitializers);
        __esDecorate(null, null, _witnessNames_decorators, { kind: "field", name: "witnessNames", static: false, private: false, access: { has: obj => "witnessNames" in obj, get: obj => obj.witnessNames, set: (obj, value) => { obj.witnessNames = value; } }, metadata: _metadata }, _witnessNames_initializers, _witnessNames_extraInitializers);
        __esDecorate(null, null, _injuryDetails_decorators, { kind: "field", name: "injuryDetails", static: false, private: false, access: { has: obj => "injuryDetails" in obj, get: obj => obj.injuryDetails, set: (obj, value) => { obj.injuryDetails = value; } }, metadata: _metadata }, _injuryDetails_initializers, _injuryDetails_extraInitializers);
        __esDecorate(null, null, _propertyDamage_decorators, { kind: "field", name: "propertyDamage", static: false, private: false, access: { has: obj => "propertyDamage" in obj, get: obj => obj.propertyDamage, set: (obj, value) => { obj.propertyDamage = value; } }, metadata: _metadata }, _propertyDamage_initializers, _propertyDamage_extraInitializers);
        __esDecorate(null, null, _workDaysLost_decorators, { kind: "field", name: "workDaysLost", static: false, private: false, access: { has: obj => "workDaysLost" in obj, get: obj => obj.workDaysLost, set: (obj, value) => { obj.workDaysLost = value; } }, metadata: _metadata }, _workDaysLost_initializers, _workDaysLost_extraInitializers);
        __esDecorate(null, null, _restrictedWorkDays_decorators, { kind: "field", name: "restrictedWorkDays", static: false, private: false, access: { has: obj => "restrictedWorkDays" in obj, get: obj => obj.restrictedWorkDays, set: (obj, value) => { obj.restrictedWorkDays = value; } }, metadata: _metadata }, _restrictedWorkDays_initializers, _restrictedWorkDays_extraInitializers);
        __esDecorate(null, null, _oshaRecordable_decorators, { kind: "field", name: "oshaRecordable", static: false, private: false, access: { has: obj => "oshaRecordable" in obj, get: obj => obj.oshaRecordable, set: (obj, value) => { obj.oshaRecordable = value; } }, metadata: _metadata }, _oshaRecordable_initializers, _oshaRecordable_extraInitializers);
        __esDecorate(null, null, _investigationNotes_decorators, { kind: "field", name: "investigationNotes", static: false, private: false, access: { has: obj => "investigationNotes" in obj, get: obj => obj.investigationNotes, set: (obj, value) => { obj.investigationNotes = value; } }, metadata: _metadata }, _investigationNotes_initializers, _investigationNotes_extraInitializers);
        __esDecorate(null, null, _correctiveActions_decorators, { kind: "field", name: "correctiveActions", static: false, private: false, access: { has: obj => "correctiveActions" in obj, get: obj => obj.correctiveActions, set: (obj, value) => { obj.correctiveActions = value; } }, metadata: _metadata }, _correctiveActions_initializers, _correctiveActions_extraInitializers);
        __esDecorate(null, null, _investigatedBy_decorators, { kind: "field", name: "investigatedBy", static: false, private: false, access: { has: obj => "investigatedBy" in obj, get: obj => obj.investigatedBy, set: (obj, value) => { obj.investigatedBy = value; } }, metadata: _metadata }, _investigatedBy_initializers, _investigatedBy_extraInitializers);
        __esDecorate(null, null, _investigationCompletedDate_decorators, { kind: "field", name: "investigationCompletedDate", static: false, private: false, access: { has: obj => "investigationCompletedDate" in obj, get: obj => obj.investigationCompletedDate, set: (obj, value) => { obj.investigationCompletedDate = value; } }, metadata: _metadata }, _investigationCompletedDate_initializers, _investigationCompletedDate_extraInitializers);
        __esDecorate(null, null, _closedDate_decorators, { kind: "field", name: "closedDate", static: false, private: false, access: { has: obj => "closedDate" in obj, get: obj => obj.closedDate, set: (obj, value) => { obj.closedDate = value; } }, metadata: _metadata }, _closedDate_initializers, _closedDate_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        IncidentReportModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return IncidentReportModel = _classThis;
})();
exports.IncidentReportModel = IncidentReportModel;
/**
 * Safety Inspection Model
 */
let SafetyInspectionModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'safety_inspections',
            timestamps: true,
            indexes: [
                { fields: ['inspection_number'], unique: true },
                { fields: ['inspection_type'] },
                { fields: ['status'] },
                { fields: ['scheduled_date'] },
                { fields: ['inspector'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _inspectionNumber_decorators;
    let _inspectionNumber_initializers = [];
    let _inspectionNumber_extraInitializers = [];
    let _inspectionType_decorators;
    let _inspectionType_initializers = [];
    let _inspectionType_extraInitializers = [];
    let _scheduledDate_decorators;
    let _scheduledDate_initializers = [];
    let _scheduledDate_extraInitializers = [];
    let _completedDate_decorators;
    let _completedDate_initializers = [];
    let _completedDate_extraInitializers = [];
    let _inspector_decorators;
    let _inspector_initializers = [];
    let _inspector_extraInitializers = [];
    let _location_decorators;
    let _location_initializers = [];
    let _location_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _score_decorators;
    let _score_initializers = [];
    let _score_extraInitializers = [];
    let _findingsCount_decorators;
    let _findingsCount_initializers = [];
    let _findingsCount_extraInitializers = [];
    let _criticalFindings_decorators;
    let _criticalFindings_initializers = [];
    let _criticalFindings_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _findings_decorators;
    let _findings_initializers = [];
    let _findings_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var SafetyInspectionModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.inspectionNumber = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _inspectionNumber_initializers, void 0));
            this.inspectionType = (__runInitializers(this, _inspectionNumber_extraInitializers), __runInitializers(this, _inspectionType_initializers, void 0));
            this.scheduledDate = (__runInitializers(this, _inspectionType_extraInitializers), __runInitializers(this, _scheduledDate_initializers, void 0));
            this.completedDate = (__runInitializers(this, _scheduledDate_extraInitializers), __runInitializers(this, _completedDate_initializers, void 0));
            this.inspector = (__runInitializers(this, _completedDate_extraInitializers), __runInitializers(this, _inspector_initializers, void 0));
            this.location = (__runInitializers(this, _inspector_extraInitializers), __runInitializers(this, _location_initializers, void 0));
            this.status = (__runInitializers(this, _location_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.score = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _score_initializers, void 0));
            this.findingsCount = (__runInitializers(this, _score_extraInitializers), __runInitializers(this, _findingsCount_initializers, void 0));
            this.criticalFindings = (__runInitializers(this, _findingsCount_extraInitializers), __runInitializers(this, _criticalFindings_initializers, void 0));
            this.notes = (__runInitializers(this, _criticalFindings_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.findings = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _findings_initializers, void 0));
            this.createdAt = (__runInitializers(this, _findings_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "SafetyInspectionModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, primaryKey: true })];
        _inspectionNumber_decorators = [sequelize_typescript_1.Unique, (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: false,
                field: 'inspection_number',
            })];
        _inspectionType_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(100),
                allowNull: false,
                field: 'inspection_type',
            })];
        _scheduledDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
                field: 'scheduled_date',
            })];
        _completedDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
                field: 'completed_date',
            })];
        _inspector_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            })];
        _location_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(255),
                allowNull: false,
            })];
        _status_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(InspectionStatus)),
                allowNull: false,
                defaultValue: InspectionStatus.SCHEDULED,
            })];
        _score_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(5, 2),
                allowNull: true,
            })];
        _findingsCount_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: true,
                field: 'findings_count',
            })];
        _criticalFindings_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: true,
                field: 'critical_findings',
            })];
        _notes_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            })];
        _findings_decorators = [(0, sequelize_typescript_1.HasMany)(() => InspectionFindingModel)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _inspectionNumber_decorators, { kind: "field", name: "inspectionNumber", static: false, private: false, access: { has: obj => "inspectionNumber" in obj, get: obj => obj.inspectionNumber, set: (obj, value) => { obj.inspectionNumber = value; } }, metadata: _metadata }, _inspectionNumber_initializers, _inspectionNumber_extraInitializers);
        __esDecorate(null, null, _inspectionType_decorators, { kind: "field", name: "inspectionType", static: false, private: false, access: { has: obj => "inspectionType" in obj, get: obj => obj.inspectionType, set: (obj, value) => { obj.inspectionType = value; } }, metadata: _metadata }, _inspectionType_initializers, _inspectionType_extraInitializers);
        __esDecorate(null, null, _scheduledDate_decorators, { kind: "field", name: "scheduledDate", static: false, private: false, access: { has: obj => "scheduledDate" in obj, get: obj => obj.scheduledDate, set: (obj, value) => { obj.scheduledDate = value; } }, metadata: _metadata }, _scheduledDate_initializers, _scheduledDate_extraInitializers);
        __esDecorate(null, null, _completedDate_decorators, { kind: "field", name: "completedDate", static: false, private: false, access: { has: obj => "completedDate" in obj, get: obj => obj.completedDate, set: (obj, value) => { obj.completedDate = value; } }, metadata: _metadata }, _completedDate_initializers, _completedDate_extraInitializers);
        __esDecorate(null, null, _inspector_decorators, { kind: "field", name: "inspector", static: false, private: false, access: { has: obj => "inspector" in obj, get: obj => obj.inspector, set: (obj, value) => { obj.inspector = value; } }, metadata: _metadata }, _inspector_initializers, _inspector_extraInitializers);
        __esDecorate(null, null, _location_decorators, { kind: "field", name: "location", static: false, private: false, access: { has: obj => "location" in obj, get: obj => obj.location, set: (obj, value) => { obj.location = value; } }, metadata: _metadata }, _location_initializers, _location_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _score_decorators, { kind: "field", name: "score", static: false, private: false, access: { has: obj => "score" in obj, get: obj => obj.score, set: (obj, value) => { obj.score = value; } }, metadata: _metadata }, _score_initializers, _score_extraInitializers);
        __esDecorate(null, null, _findingsCount_decorators, { kind: "field", name: "findingsCount", static: false, private: false, access: { has: obj => "findingsCount" in obj, get: obj => obj.findingsCount, set: (obj, value) => { obj.findingsCount = value; } }, metadata: _metadata }, _findingsCount_initializers, _findingsCount_extraInitializers);
        __esDecorate(null, null, _criticalFindings_decorators, { kind: "field", name: "criticalFindings", static: false, private: false, access: { has: obj => "criticalFindings" in obj, get: obj => obj.criticalFindings, set: (obj, value) => { obj.criticalFindings = value; } }, metadata: _metadata }, _criticalFindings_initializers, _criticalFindings_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _findings_decorators, { kind: "field", name: "findings", static: false, private: false, access: { has: obj => "findings" in obj, get: obj => obj.findings, set: (obj, value) => { obj.findings = value; } }, metadata: _metadata }, _findings_initializers, _findings_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SafetyInspectionModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SafetyInspectionModel = _classThis;
})();
exports.SafetyInspectionModel = SafetyInspectionModel;
/**
 * Inspection Finding Model
 */
let InspectionFindingModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'inspection_findings',
            timestamps: true,
            indexes: [
                { fields: ['inspection_id'] },
                { fields: ['severity'] },
                { fields: ['due_date'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _inspectionId_decorators;
    let _inspectionId_initializers = [];
    let _inspectionId_extraInitializers = [];
    let _category_decorators;
    let _category_initializers = [];
    let _category_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _severity_decorators;
    let _severity_initializers = [];
    let _severity_extraInitializers = [];
    let _photoUrls_decorators;
    let _photoUrls_initializers = [];
    let _photoUrls_extraInitializers = [];
    let _correctiveAction_decorators;
    let _correctiveAction_initializers = [];
    let _correctiveAction_extraInitializers = [];
    let _responsibleParty_decorators;
    let _responsibleParty_initializers = [];
    let _responsibleParty_extraInitializers = [];
    let _dueDate_decorators;
    let _dueDate_initializers = [];
    let _dueDate_extraInitializers = [];
    let _completedDate_decorators;
    let _completedDate_initializers = [];
    let _completedDate_extraInitializers = [];
    let _inspection_decorators;
    let _inspection_initializers = [];
    let _inspection_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var InspectionFindingModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.inspectionId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _inspectionId_initializers, void 0));
            this.category = (__runInitializers(this, _inspectionId_extraInitializers), __runInitializers(this, _category_initializers, void 0));
            this.description = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.severity = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _severity_initializers, void 0));
            this.photoUrls = (__runInitializers(this, _severity_extraInitializers), __runInitializers(this, _photoUrls_initializers, void 0));
            this.correctiveAction = (__runInitializers(this, _photoUrls_extraInitializers), __runInitializers(this, _correctiveAction_initializers, void 0));
            this.responsibleParty = (__runInitializers(this, _correctiveAction_extraInitializers), __runInitializers(this, _responsibleParty_initializers, void 0));
            this.dueDate = (__runInitializers(this, _responsibleParty_extraInitializers), __runInitializers(this, _dueDate_initializers, void 0));
            this.completedDate = (__runInitializers(this, _dueDate_extraInitializers), __runInitializers(this, _completedDate_initializers, void 0));
            this.inspection = (__runInitializers(this, _completedDate_extraInitializers), __runInitializers(this, _inspection_initializers, void 0));
            this.createdAt = (__runInitializers(this, _inspection_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "InspectionFindingModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, primaryKey: true })];
        _inspectionId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => SafetyInspectionModel), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'inspection_id',
            })];
        _category_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(100),
                allowNull: false,
            })];
        _description_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: false,
            })];
        _severity_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(HazardSeverity)),
                allowNull: false,
            })];
        _photoUrls_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.TEXT),
                allowNull: true,
                field: 'photo_urls',
            })];
        _correctiveAction_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
                field: 'corrective_action',
            })];
        _responsibleParty_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: true,
                field: 'responsible_party',
            })];
        _dueDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
                field: 'due_date',
            })];
        _completedDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
                field: 'completed_date',
            })];
        _inspection_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => SafetyInspectionModel)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _inspectionId_decorators, { kind: "field", name: "inspectionId", static: false, private: false, access: { has: obj => "inspectionId" in obj, get: obj => obj.inspectionId, set: (obj, value) => { obj.inspectionId = value; } }, metadata: _metadata }, _inspectionId_initializers, _inspectionId_extraInitializers);
        __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: obj => "category" in obj, get: obj => obj.category, set: (obj, value) => { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _severity_decorators, { kind: "field", name: "severity", static: false, private: false, access: { has: obj => "severity" in obj, get: obj => obj.severity, set: (obj, value) => { obj.severity = value; } }, metadata: _metadata }, _severity_initializers, _severity_extraInitializers);
        __esDecorate(null, null, _photoUrls_decorators, { kind: "field", name: "photoUrls", static: false, private: false, access: { has: obj => "photoUrls" in obj, get: obj => obj.photoUrls, set: (obj, value) => { obj.photoUrls = value; } }, metadata: _metadata }, _photoUrls_initializers, _photoUrls_extraInitializers);
        __esDecorate(null, null, _correctiveAction_decorators, { kind: "field", name: "correctiveAction", static: false, private: false, access: { has: obj => "correctiveAction" in obj, get: obj => obj.correctiveAction, set: (obj, value) => { obj.correctiveAction = value; } }, metadata: _metadata }, _correctiveAction_initializers, _correctiveAction_extraInitializers);
        __esDecorate(null, null, _responsibleParty_decorators, { kind: "field", name: "responsibleParty", static: false, private: false, access: { has: obj => "responsibleParty" in obj, get: obj => obj.responsibleParty, set: (obj, value) => { obj.responsibleParty = value; } }, metadata: _metadata }, _responsibleParty_initializers, _responsibleParty_extraInitializers);
        __esDecorate(null, null, _dueDate_decorators, { kind: "field", name: "dueDate", static: false, private: false, access: { has: obj => "dueDate" in obj, get: obj => obj.dueDate, set: (obj, value) => { obj.dueDate = value; } }, metadata: _metadata }, _dueDate_initializers, _dueDate_extraInitializers);
        __esDecorate(null, null, _completedDate_decorators, { kind: "field", name: "completedDate", static: false, private: false, access: { has: obj => "completedDate" in obj, get: obj => obj.completedDate, set: (obj, value) => { obj.completedDate = value; } }, metadata: _metadata }, _completedDate_initializers, _completedDate_extraInitializers);
        __esDecorate(null, null, _inspection_decorators, { kind: "field", name: "inspection", static: false, private: false, access: { has: obj => "inspection" in obj, get: obj => obj.inspection, set: (obj, value) => { obj.inspection = value; } }, metadata: _metadata }, _inspection_initializers, _inspection_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        InspectionFindingModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return InspectionFindingModel = _classThis;
})();
exports.InspectionFindingModel = InspectionFindingModel;
/**
 * Hazard Model
 */
let HazardModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'hazards',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['hazard_number'], unique: true },
                { fields: ['hazard_type'] },
                { fields: ['severity'] },
                { fields: ['status'] },
                { fields: ['identified_date'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _hazardNumber_decorators;
    let _hazardNumber_initializers = [];
    let _hazardNumber_extraInitializers = [];
    let _hazardType_decorators;
    let _hazardType_initializers = [];
    let _hazardType_extraInitializers = [];
    let _severity_decorators;
    let _severity_initializers = [];
    let _severity_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _identifiedDate_decorators;
    let _identifiedDate_initializers = [];
    let _identifiedDate_extraInitializers = [];
    let _identifiedBy_decorators;
    let _identifiedBy_initializers = [];
    let _identifiedBy_extraInitializers = [];
    let _location_decorators;
    let _location_initializers = [];
    let _location_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _riskAssessment_decorators;
    let _riskAssessment_initializers = [];
    let _riskAssessment_extraInitializers = [];
    let _mitigationPlan_decorators;
    let _mitigationPlan_initializers = [];
    let _mitigationPlan_extraInitializers = [];
    let _mitigationCost_decorators;
    let _mitigationCost_initializers = [];
    let _mitigationCost_extraInitializers = [];
    let _responsibleParty_decorators;
    let _responsibleParty_initializers = [];
    let _responsibleParty_extraInitializers = [];
    let _targetCompletionDate_decorators;
    let _targetCompletionDate_initializers = [];
    let _targetCompletionDate_extraInitializers = [];
    let _completedDate_decorators;
    let _completedDate_initializers = [];
    let _completedDate_extraInitializers = [];
    let _photoUrls_decorators;
    let _photoUrls_initializers = [];
    let _photoUrls_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var HazardModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.hazardNumber = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _hazardNumber_initializers, void 0));
            this.hazardType = (__runInitializers(this, _hazardNumber_extraInitializers), __runInitializers(this, _hazardType_initializers, void 0));
            this.severity = (__runInitializers(this, _hazardType_extraInitializers), __runInitializers(this, _severity_initializers, void 0));
            this.status = (__runInitializers(this, _severity_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.identifiedDate = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _identifiedDate_initializers, void 0));
            this.identifiedBy = (__runInitializers(this, _identifiedDate_extraInitializers), __runInitializers(this, _identifiedBy_initializers, void 0));
            this.location = (__runInitializers(this, _identifiedBy_extraInitializers), __runInitializers(this, _location_initializers, void 0));
            this.description = (__runInitializers(this, _location_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.riskAssessment = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _riskAssessment_initializers, void 0));
            this.mitigationPlan = (__runInitializers(this, _riskAssessment_extraInitializers), __runInitializers(this, _mitigationPlan_initializers, void 0));
            this.mitigationCost = (__runInitializers(this, _mitigationPlan_extraInitializers), __runInitializers(this, _mitigationCost_initializers, void 0));
            this.responsibleParty = (__runInitializers(this, _mitigationCost_extraInitializers), __runInitializers(this, _responsibleParty_initializers, void 0));
            this.targetCompletionDate = (__runInitializers(this, _responsibleParty_extraInitializers), __runInitializers(this, _targetCompletionDate_initializers, void 0));
            this.completedDate = (__runInitializers(this, _targetCompletionDate_extraInitializers), __runInitializers(this, _completedDate_initializers, void 0));
            this.photoUrls = (__runInitializers(this, _completedDate_extraInitializers), __runInitializers(this, _photoUrls_initializers, void 0));
            this.metadata = (__runInitializers(this, _photoUrls_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "HazardModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, primaryKey: true })];
        _hazardNumber_decorators = [sequelize_typescript_1.Unique, (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: false,
                field: 'hazard_number',
            })];
        _hazardType_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(100),
                allowNull: false,
                field: 'hazard_type',
            })];
        _severity_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(HazardSeverity)),
                allowNull: false,
            })];
        _status_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(HazardStatus)),
                allowNull: false,
                defaultValue: HazardStatus.IDENTIFIED,
            })];
        _identifiedDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
                field: 'identified_date',
            })];
        _identifiedBy_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'identified_by',
            })];
        _location_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(255),
                allowNull: false,
            })];
        _description_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: false,
            })];
        _riskAssessment_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
                field: 'risk_assessment',
            })];
        _mitigationPlan_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
                field: 'mitigation_plan',
            })];
        _mitigationCost_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(12, 2),
                allowNull: true,
                field: 'mitigation_cost',
            })];
        _responsibleParty_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: true,
                field: 'responsible_party',
            })];
        _targetCompletionDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
                field: 'target_completion_date',
            })];
        _completedDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
                field: 'completed_date',
            })];
        _photoUrls_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.TEXT),
                allowNull: true,
                field: 'photo_urls',
            })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _hazardNumber_decorators, { kind: "field", name: "hazardNumber", static: false, private: false, access: { has: obj => "hazardNumber" in obj, get: obj => obj.hazardNumber, set: (obj, value) => { obj.hazardNumber = value; } }, metadata: _metadata }, _hazardNumber_initializers, _hazardNumber_extraInitializers);
        __esDecorate(null, null, _hazardType_decorators, { kind: "field", name: "hazardType", static: false, private: false, access: { has: obj => "hazardType" in obj, get: obj => obj.hazardType, set: (obj, value) => { obj.hazardType = value; } }, metadata: _metadata }, _hazardType_initializers, _hazardType_extraInitializers);
        __esDecorate(null, null, _severity_decorators, { kind: "field", name: "severity", static: false, private: false, access: { has: obj => "severity" in obj, get: obj => obj.severity, set: (obj, value) => { obj.severity = value; } }, metadata: _metadata }, _severity_initializers, _severity_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _identifiedDate_decorators, { kind: "field", name: "identifiedDate", static: false, private: false, access: { has: obj => "identifiedDate" in obj, get: obj => obj.identifiedDate, set: (obj, value) => { obj.identifiedDate = value; } }, metadata: _metadata }, _identifiedDate_initializers, _identifiedDate_extraInitializers);
        __esDecorate(null, null, _identifiedBy_decorators, { kind: "field", name: "identifiedBy", static: false, private: false, access: { has: obj => "identifiedBy" in obj, get: obj => obj.identifiedBy, set: (obj, value) => { obj.identifiedBy = value; } }, metadata: _metadata }, _identifiedBy_initializers, _identifiedBy_extraInitializers);
        __esDecorate(null, null, _location_decorators, { kind: "field", name: "location", static: false, private: false, access: { has: obj => "location" in obj, get: obj => obj.location, set: (obj, value) => { obj.location = value; } }, metadata: _metadata }, _location_initializers, _location_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _riskAssessment_decorators, { kind: "field", name: "riskAssessment", static: false, private: false, access: { has: obj => "riskAssessment" in obj, get: obj => obj.riskAssessment, set: (obj, value) => { obj.riskAssessment = value; } }, metadata: _metadata }, _riskAssessment_initializers, _riskAssessment_extraInitializers);
        __esDecorate(null, null, _mitigationPlan_decorators, { kind: "field", name: "mitigationPlan", static: false, private: false, access: { has: obj => "mitigationPlan" in obj, get: obj => obj.mitigationPlan, set: (obj, value) => { obj.mitigationPlan = value; } }, metadata: _metadata }, _mitigationPlan_initializers, _mitigationPlan_extraInitializers);
        __esDecorate(null, null, _mitigationCost_decorators, { kind: "field", name: "mitigationCost", static: false, private: false, access: { has: obj => "mitigationCost" in obj, get: obj => obj.mitigationCost, set: (obj, value) => { obj.mitigationCost = value; } }, metadata: _metadata }, _mitigationCost_initializers, _mitigationCost_extraInitializers);
        __esDecorate(null, null, _responsibleParty_decorators, { kind: "field", name: "responsibleParty", static: false, private: false, access: { has: obj => "responsibleParty" in obj, get: obj => obj.responsibleParty, set: (obj, value) => { obj.responsibleParty = value; } }, metadata: _metadata }, _responsibleParty_initializers, _responsibleParty_extraInitializers);
        __esDecorate(null, null, _targetCompletionDate_decorators, { kind: "field", name: "targetCompletionDate", static: false, private: false, access: { has: obj => "targetCompletionDate" in obj, get: obj => obj.targetCompletionDate, set: (obj, value) => { obj.targetCompletionDate = value; } }, metadata: _metadata }, _targetCompletionDate_initializers, _targetCompletionDate_extraInitializers);
        __esDecorate(null, null, _completedDate_decorators, { kind: "field", name: "completedDate", static: false, private: false, access: { has: obj => "completedDate" in obj, get: obj => obj.completedDate, set: (obj, value) => { obj.completedDate = value; } }, metadata: _metadata }, _completedDate_initializers, _completedDate_extraInitializers);
        __esDecorate(null, null, _photoUrls_decorators, { kind: "field", name: "photoUrls", static: false, private: false, access: { has: obj => "photoUrls" in obj, get: obj => obj.photoUrls, set: (obj, value) => { obj.photoUrls = value; } }, metadata: _metadata }, _photoUrls_initializers, _photoUrls_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        HazardModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return HazardModel = _classThis;
})();
exports.HazardModel = HazardModel;
/**
 * PPE Issuance Model
 */
let PPEIssuanceModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'ppe_issuances',
            timestamps: true,
            indexes: [
                { fields: ['employee_id'] },
                { fields: ['ppe_type'] },
                { fields: ['issued_date'] },
                { fields: ['expiry_date'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _employeeId_decorators;
    let _employeeId_initializers = [];
    let _employeeId_extraInitializers = [];
    let _ppeType_decorators;
    let _ppeType_initializers = [];
    let _ppeType_extraInitializers = [];
    let _itemDescription_decorators;
    let _itemDescription_initializers = [];
    let _itemDescription_extraInitializers = [];
    let _manufacturer_decorators;
    let _manufacturer_initializers = [];
    let _manufacturer_extraInitializers = [];
    let _modelNumber_decorators;
    let _modelNumber_initializers = [];
    let _modelNumber_extraInitializers = [];
    let _serialNumber_decorators;
    let _serialNumber_initializers = [];
    let _serialNumber_extraInitializers = [];
    let _issuedDate_decorators;
    let _issuedDate_initializers = [];
    let _issuedDate_extraInitializers = [];
    let _issuedBy_decorators;
    let _issuedBy_initializers = [];
    let _issuedBy_extraInitializers = [];
    let _expiryDate_decorators;
    let _expiryDate_initializers = [];
    let _expiryDate_extraInitializers = [];
    let _returnedDate_decorators;
    let _returnedDate_initializers = [];
    let _returnedDate_extraInitializers = [];
    let _size_decorators;
    let _size_initializers = [];
    let _size_extraInitializers = [];
    let _cost_decorators;
    let _cost_initializers = [];
    let _cost_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var PPEIssuanceModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.employeeId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _employeeId_initializers, void 0));
            this.ppeType = (__runInitializers(this, _employeeId_extraInitializers), __runInitializers(this, _ppeType_initializers, void 0));
            this.itemDescription = (__runInitializers(this, _ppeType_extraInitializers), __runInitializers(this, _itemDescription_initializers, void 0));
            this.manufacturer = (__runInitializers(this, _itemDescription_extraInitializers), __runInitializers(this, _manufacturer_initializers, void 0));
            this.modelNumber = (__runInitializers(this, _manufacturer_extraInitializers), __runInitializers(this, _modelNumber_initializers, void 0));
            this.serialNumber = (__runInitializers(this, _modelNumber_extraInitializers), __runInitializers(this, _serialNumber_initializers, void 0));
            this.issuedDate = (__runInitializers(this, _serialNumber_extraInitializers), __runInitializers(this, _issuedDate_initializers, void 0));
            this.issuedBy = (__runInitializers(this, _issuedDate_extraInitializers), __runInitializers(this, _issuedBy_initializers, void 0));
            this.expiryDate = (__runInitializers(this, _issuedBy_extraInitializers), __runInitializers(this, _expiryDate_initializers, void 0));
            this.returnedDate = (__runInitializers(this, _expiryDate_extraInitializers), __runInitializers(this, _returnedDate_initializers, void 0));
            this.size = (__runInitializers(this, _returnedDate_extraInitializers), __runInitializers(this, _size_initializers, void 0));
            this.cost = (__runInitializers(this, _size_extraInitializers), __runInitializers(this, _cost_initializers, void 0));
            this.notes = (__runInitializers(this, _cost_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.createdAt = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "PPEIssuanceModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, primaryKey: true })];
        _employeeId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'employee_id',
            })];
        _ppeType_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(PPEType)),
                allowNull: false,
                field: 'ppe_type',
            })];
        _itemDescription_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(255),
                allowNull: false,
                field: 'item_description',
            })];
        _manufacturer_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(100),
                allowNull: true,
            })];
        _modelNumber_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(100),
                allowNull: true,
                field: 'model_number',
            })];
        _serialNumber_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(100),
                allowNull: true,
                field: 'serial_number',
            })];
        _issuedDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
                field: 'issued_date',
            })];
        _issuedBy_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'issued_by',
            })];
        _expiryDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
                field: 'expiry_date',
            })];
        _returnedDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
                field: 'returned_date',
            })];
        _size_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(20),
                allowNull: true,
            })];
        _cost_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(10, 2),
                allowNull: true,
            })];
        _notes_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _employeeId_decorators, { kind: "field", name: "employeeId", static: false, private: false, access: { has: obj => "employeeId" in obj, get: obj => obj.employeeId, set: (obj, value) => { obj.employeeId = value; } }, metadata: _metadata }, _employeeId_initializers, _employeeId_extraInitializers);
        __esDecorate(null, null, _ppeType_decorators, { kind: "field", name: "ppeType", static: false, private: false, access: { has: obj => "ppeType" in obj, get: obj => obj.ppeType, set: (obj, value) => { obj.ppeType = value; } }, metadata: _metadata }, _ppeType_initializers, _ppeType_extraInitializers);
        __esDecorate(null, null, _itemDescription_decorators, { kind: "field", name: "itemDescription", static: false, private: false, access: { has: obj => "itemDescription" in obj, get: obj => obj.itemDescription, set: (obj, value) => { obj.itemDescription = value; } }, metadata: _metadata }, _itemDescription_initializers, _itemDescription_extraInitializers);
        __esDecorate(null, null, _manufacturer_decorators, { kind: "field", name: "manufacturer", static: false, private: false, access: { has: obj => "manufacturer" in obj, get: obj => obj.manufacturer, set: (obj, value) => { obj.manufacturer = value; } }, metadata: _metadata }, _manufacturer_initializers, _manufacturer_extraInitializers);
        __esDecorate(null, null, _modelNumber_decorators, { kind: "field", name: "modelNumber", static: false, private: false, access: { has: obj => "modelNumber" in obj, get: obj => obj.modelNumber, set: (obj, value) => { obj.modelNumber = value; } }, metadata: _metadata }, _modelNumber_initializers, _modelNumber_extraInitializers);
        __esDecorate(null, null, _serialNumber_decorators, { kind: "field", name: "serialNumber", static: false, private: false, access: { has: obj => "serialNumber" in obj, get: obj => obj.serialNumber, set: (obj, value) => { obj.serialNumber = value; } }, metadata: _metadata }, _serialNumber_initializers, _serialNumber_extraInitializers);
        __esDecorate(null, null, _issuedDate_decorators, { kind: "field", name: "issuedDate", static: false, private: false, access: { has: obj => "issuedDate" in obj, get: obj => obj.issuedDate, set: (obj, value) => { obj.issuedDate = value; } }, metadata: _metadata }, _issuedDate_initializers, _issuedDate_extraInitializers);
        __esDecorate(null, null, _issuedBy_decorators, { kind: "field", name: "issuedBy", static: false, private: false, access: { has: obj => "issuedBy" in obj, get: obj => obj.issuedBy, set: (obj, value) => { obj.issuedBy = value; } }, metadata: _metadata }, _issuedBy_initializers, _issuedBy_extraInitializers);
        __esDecorate(null, null, _expiryDate_decorators, { kind: "field", name: "expiryDate", static: false, private: false, access: { has: obj => "expiryDate" in obj, get: obj => obj.expiryDate, set: (obj, value) => { obj.expiryDate = value; } }, metadata: _metadata }, _expiryDate_initializers, _expiryDate_extraInitializers);
        __esDecorate(null, null, _returnedDate_decorators, { kind: "field", name: "returnedDate", static: false, private: false, access: { has: obj => "returnedDate" in obj, get: obj => obj.returnedDate, set: (obj, value) => { obj.returnedDate = value; } }, metadata: _metadata }, _returnedDate_initializers, _returnedDate_extraInitializers);
        __esDecorate(null, null, _size_decorators, { kind: "field", name: "size", static: false, private: false, access: { has: obj => "size" in obj, get: obj => obj.size, set: (obj, value) => { obj.size = value; } }, metadata: _metadata }, _size_initializers, _size_extraInitializers);
        __esDecorate(null, null, _cost_decorators, { kind: "field", name: "cost", static: false, private: false, access: { has: obj => "cost" in obj, get: obj => obj.cost, set: (obj, value) => { obj.cost = value; } }, metadata: _metadata }, _cost_initializers, _cost_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PPEIssuanceModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PPEIssuanceModel = _classThis;
})();
exports.PPEIssuanceModel = PPEIssuanceModel;
/**
 * Workers' Compensation Claim Model
 */
let WorkersCompClaimModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'workers_comp_claims',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['claim_number'], unique: true },
                { fields: ['employee_id'] },
                { fields: ['status'] },
                { fields: ['injury_date'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _claimNumber_decorators;
    let _claimNumber_initializers = [];
    let _claimNumber_extraInitializers = [];
    let _employeeId_decorators;
    let _employeeId_initializers = [];
    let _employeeId_extraInitializers = [];
    let _incidentId_decorators;
    let _incidentId_initializers = [];
    let _incidentId_extraInitializers = [];
    let _injuryDate_decorators;
    let _injuryDate_initializers = [];
    let _injuryDate_extraInitializers = [];
    let _reportedDate_decorators;
    let _reportedDate_initializers = [];
    let _reportedDate_extraInitializers = [];
    let _injuryType_decorators;
    let _injuryType_initializers = [];
    let _injuryType_extraInitializers = [];
    let _bodyPart_decorators;
    let _bodyPart_initializers = [];
    let _bodyPart_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _carrierClaimNumber_decorators;
    let _carrierClaimNumber_initializers = [];
    let _carrierClaimNumber_extraInitializers = [];
    let _estimatedCost_decorators;
    let _estimatedCost_initializers = [];
    let _estimatedCost_extraInitializers = [];
    let _actualCost_decorators;
    let _actualCost_initializers = [];
    let _actualCost_extraInitializers = [];
    let _medicalProvider_decorators;
    let _medicalProvider_initializers = [];
    let _medicalProvider_extraInitializers = [];
    let _lostWorkDays_decorators;
    let _lostWorkDays_initializers = [];
    let _lostWorkDays_extraInitializers = [];
    let _restrictedWorkDays_decorators;
    let _restrictedWorkDays_initializers = [];
    let _restrictedWorkDays_extraInitializers = [];
    let _settlementAmount_decorators;
    let _settlementAmount_initializers = [];
    let _settlementAmount_extraInitializers = [];
    let _closedDate_decorators;
    let _closedDate_initializers = [];
    let _closedDate_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var WorkersCompClaimModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.claimNumber = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _claimNumber_initializers, void 0));
            this.employeeId = (__runInitializers(this, _claimNumber_extraInitializers), __runInitializers(this, _employeeId_initializers, void 0));
            this.incidentId = (__runInitializers(this, _employeeId_extraInitializers), __runInitializers(this, _incidentId_initializers, void 0));
            this.injuryDate = (__runInitializers(this, _incidentId_extraInitializers), __runInitializers(this, _injuryDate_initializers, void 0));
            this.reportedDate = (__runInitializers(this, _injuryDate_extraInitializers), __runInitializers(this, _reportedDate_initializers, void 0));
            this.injuryType = (__runInitializers(this, _reportedDate_extraInitializers), __runInitializers(this, _injuryType_initializers, void 0));
            this.bodyPart = (__runInitializers(this, _injuryType_extraInitializers), __runInitializers(this, _bodyPart_initializers, void 0));
            this.status = (__runInitializers(this, _bodyPart_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.carrierClaimNumber = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _carrierClaimNumber_initializers, void 0));
            this.estimatedCost = (__runInitializers(this, _carrierClaimNumber_extraInitializers), __runInitializers(this, _estimatedCost_initializers, void 0));
            this.actualCost = (__runInitializers(this, _estimatedCost_extraInitializers), __runInitializers(this, _actualCost_initializers, void 0));
            this.medicalProvider = (__runInitializers(this, _actualCost_extraInitializers), __runInitializers(this, _medicalProvider_initializers, void 0));
            this.lostWorkDays = (__runInitializers(this, _medicalProvider_extraInitializers), __runInitializers(this, _lostWorkDays_initializers, void 0));
            this.restrictedWorkDays = (__runInitializers(this, _lostWorkDays_extraInitializers), __runInitializers(this, _restrictedWorkDays_initializers, void 0));
            this.settlementAmount = (__runInitializers(this, _restrictedWorkDays_extraInitializers), __runInitializers(this, _settlementAmount_initializers, void 0));
            this.closedDate = (__runInitializers(this, _settlementAmount_extraInitializers), __runInitializers(this, _closedDate_initializers, void 0));
            this.notes = (__runInitializers(this, _closedDate_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.metadata = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "WorkersCompClaimModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, primaryKey: true })];
        _claimNumber_decorators = [sequelize_typescript_1.Unique, (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: false,
                field: 'claim_number',
            })];
        _employeeId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'employee_id',
            })];
        _incidentId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: true,
                field: 'incident_id',
            })];
        _injuryDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
                field: 'injury_date',
            })];
        _reportedDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
                field: 'reported_date',
            })];
        _injuryType_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(100),
                allowNull: false,
                field: 'injury_type',
            })];
        _bodyPart_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(100),
                allowNull: false,
                field: 'body_part',
            })];
        _status_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(WorkersCompStatus)),
                allowNull: false,
                defaultValue: WorkersCompStatus.REPORTED,
            })];
        _carrierClaimNumber_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(100),
                allowNull: true,
                field: 'carrier_claim_number',
            })];
        _estimatedCost_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(12, 2),
                allowNull: true,
                field: 'estimated_cost',
            })];
        _actualCost_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(12, 2),
                allowNull: true,
                field: 'actual_cost',
            })];
        _medicalProvider_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(255),
                allowNull: true,
                field: 'medical_provider',
            })];
        _lostWorkDays_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: true,
                field: 'lost_work_days',
            })];
        _restrictedWorkDays_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: true,
                field: 'restricted_work_days',
            })];
        _settlementAmount_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(12, 2),
                allowNull: true,
                field: 'settlement_amount',
            })];
        _closedDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
                field: 'closed_date',
            })];
        _notes_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _claimNumber_decorators, { kind: "field", name: "claimNumber", static: false, private: false, access: { has: obj => "claimNumber" in obj, get: obj => obj.claimNumber, set: (obj, value) => { obj.claimNumber = value; } }, metadata: _metadata }, _claimNumber_initializers, _claimNumber_extraInitializers);
        __esDecorate(null, null, _employeeId_decorators, { kind: "field", name: "employeeId", static: false, private: false, access: { has: obj => "employeeId" in obj, get: obj => obj.employeeId, set: (obj, value) => { obj.employeeId = value; } }, metadata: _metadata }, _employeeId_initializers, _employeeId_extraInitializers);
        __esDecorate(null, null, _incidentId_decorators, { kind: "field", name: "incidentId", static: false, private: false, access: { has: obj => "incidentId" in obj, get: obj => obj.incidentId, set: (obj, value) => { obj.incidentId = value; } }, metadata: _metadata }, _incidentId_initializers, _incidentId_extraInitializers);
        __esDecorate(null, null, _injuryDate_decorators, { kind: "field", name: "injuryDate", static: false, private: false, access: { has: obj => "injuryDate" in obj, get: obj => obj.injuryDate, set: (obj, value) => { obj.injuryDate = value; } }, metadata: _metadata }, _injuryDate_initializers, _injuryDate_extraInitializers);
        __esDecorate(null, null, _reportedDate_decorators, { kind: "field", name: "reportedDate", static: false, private: false, access: { has: obj => "reportedDate" in obj, get: obj => obj.reportedDate, set: (obj, value) => { obj.reportedDate = value; } }, metadata: _metadata }, _reportedDate_initializers, _reportedDate_extraInitializers);
        __esDecorate(null, null, _injuryType_decorators, { kind: "field", name: "injuryType", static: false, private: false, access: { has: obj => "injuryType" in obj, get: obj => obj.injuryType, set: (obj, value) => { obj.injuryType = value; } }, metadata: _metadata }, _injuryType_initializers, _injuryType_extraInitializers);
        __esDecorate(null, null, _bodyPart_decorators, { kind: "field", name: "bodyPart", static: false, private: false, access: { has: obj => "bodyPart" in obj, get: obj => obj.bodyPart, set: (obj, value) => { obj.bodyPart = value; } }, metadata: _metadata }, _bodyPart_initializers, _bodyPart_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _carrierClaimNumber_decorators, { kind: "field", name: "carrierClaimNumber", static: false, private: false, access: { has: obj => "carrierClaimNumber" in obj, get: obj => obj.carrierClaimNumber, set: (obj, value) => { obj.carrierClaimNumber = value; } }, metadata: _metadata }, _carrierClaimNumber_initializers, _carrierClaimNumber_extraInitializers);
        __esDecorate(null, null, _estimatedCost_decorators, { kind: "field", name: "estimatedCost", static: false, private: false, access: { has: obj => "estimatedCost" in obj, get: obj => obj.estimatedCost, set: (obj, value) => { obj.estimatedCost = value; } }, metadata: _metadata }, _estimatedCost_initializers, _estimatedCost_extraInitializers);
        __esDecorate(null, null, _actualCost_decorators, { kind: "field", name: "actualCost", static: false, private: false, access: { has: obj => "actualCost" in obj, get: obj => obj.actualCost, set: (obj, value) => { obj.actualCost = value; } }, metadata: _metadata }, _actualCost_initializers, _actualCost_extraInitializers);
        __esDecorate(null, null, _medicalProvider_decorators, { kind: "field", name: "medicalProvider", static: false, private: false, access: { has: obj => "medicalProvider" in obj, get: obj => obj.medicalProvider, set: (obj, value) => { obj.medicalProvider = value; } }, metadata: _metadata }, _medicalProvider_initializers, _medicalProvider_extraInitializers);
        __esDecorate(null, null, _lostWorkDays_decorators, { kind: "field", name: "lostWorkDays", static: false, private: false, access: { has: obj => "lostWorkDays" in obj, get: obj => obj.lostWorkDays, set: (obj, value) => { obj.lostWorkDays = value; } }, metadata: _metadata }, _lostWorkDays_initializers, _lostWorkDays_extraInitializers);
        __esDecorate(null, null, _restrictedWorkDays_decorators, { kind: "field", name: "restrictedWorkDays", static: false, private: false, access: { has: obj => "restrictedWorkDays" in obj, get: obj => obj.restrictedWorkDays, set: (obj, value) => { obj.restrictedWorkDays = value; } }, metadata: _metadata }, _restrictedWorkDays_initializers, _restrictedWorkDays_extraInitializers);
        __esDecorate(null, null, _settlementAmount_decorators, { kind: "field", name: "settlementAmount", static: false, private: false, access: { has: obj => "settlementAmount" in obj, get: obj => obj.settlementAmount, set: (obj, value) => { obj.settlementAmount = value; } }, metadata: _metadata }, _settlementAmount_initializers, _settlementAmount_extraInitializers);
        __esDecorate(null, null, _closedDate_decorators, { kind: "field", name: "closedDate", static: false, private: false, access: { has: obj => "closedDate" in obj, get: obj => obj.closedDate, set: (obj, value) => { obj.closedDate = value; } }, metadata: _metadata }, _closedDate_initializers, _closedDate_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        WorkersCompClaimModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return WorkersCompClaimModel = _classThis;
})();
exports.WorkersCompClaimModel = WorkersCompClaimModel;
/**
 * Return to Work Plan Model
 */
let ReturnToWorkPlanModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'return_to_work_plans',
            timestamps: true,
            indexes: [
                { fields: ['employee_id'] },
                { fields: ['claim_id'] },
                { fields: ['status'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _employeeId_decorators;
    let _employeeId_initializers = [];
    let _employeeId_extraInitializers = [];
    let _claimId_decorators;
    let _claimId_initializers = [];
    let _claimId_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _injuryDate_decorators;
    let _injuryDate_initializers = [];
    let _injuryDate_extraInitializers = [];
    let _expectedReturnDate_decorators;
    let _expectedReturnDate_initializers = [];
    let _expectedReturnDate_extraInitializers = [];
    let _actualReturnDate_decorators;
    let _actualReturnDate_initializers = [];
    let _actualReturnDate_extraInitializers = [];
    let _restrictions_decorators;
    let _restrictions_initializers = [];
    let _restrictions_extraInitializers = [];
    let _modifiedDuties_decorators;
    let _modifiedDuties_initializers = [];
    let _modifiedDuties_extraInitializers = [];
    let _accommodations_decorators;
    let _accommodations_initializers = [];
    let _accommodations_extraInitializers = [];
    let _medicalClearance_decorators;
    let _medicalClearance_initializers = [];
    let _medicalClearance_extraInitializers = [];
    let _medicalProvider_decorators;
    let _medicalProvider_initializers = [];
    let _medicalProvider_extraInitializers = [];
    let _followUpDates_decorators;
    let _followUpDates_initializers = [];
    let _followUpDates_extraInitializers = [];
    let _progressNotes_decorators;
    let _progressNotes_initializers = [];
    let _progressNotes_extraInitializers = [];
    let _coordinator_decorators;
    let _coordinator_initializers = [];
    let _coordinator_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var ReturnToWorkPlanModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.employeeId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _employeeId_initializers, void 0));
            this.claimId = (__runInitializers(this, _employeeId_extraInitializers), __runInitializers(this, _claimId_initializers, void 0));
            this.status = (__runInitializers(this, _claimId_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.injuryDate = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _injuryDate_initializers, void 0));
            this.expectedReturnDate = (__runInitializers(this, _injuryDate_extraInitializers), __runInitializers(this, _expectedReturnDate_initializers, void 0));
            this.actualReturnDate = (__runInitializers(this, _expectedReturnDate_extraInitializers), __runInitializers(this, _actualReturnDate_initializers, void 0));
            this.restrictions = (__runInitializers(this, _actualReturnDate_extraInitializers), __runInitializers(this, _restrictions_initializers, void 0));
            this.modifiedDuties = (__runInitializers(this, _restrictions_extraInitializers), __runInitializers(this, _modifiedDuties_initializers, void 0));
            this.accommodations = (__runInitializers(this, _modifiedDuties_extraInitializers), __runInitializers(this, _accommodations_initializers, void 0));
            this.medicalClearance = (__runInitializers(this, _accommodations_extraInitializers), __runInitializers(this, _medicalClearance_initializers, void 0));
            this.medicalProvider = (__runInitializers(this, _medicalClearance_extraInitializers), __runInitializers(this, _medicalProvider_initializers, void 0));
            this.followUpDates = (__runInitializers(this, _medicalProvider_extraInitializers), __runInitializers(this, _followUpDates_initializers, void 0));
            this.progressNotes = (__runInitializers(this, _followUpDates_extraInitializers), __runInitializers(this, _progressNotes_initializers, void 0));
            this.coordinator = (__runInitializers(this, _progressNotes_extraInitializers), __runInitializers(this, _coordinator_initializers, void 0));
            this.createdAt = (__runInitializers(this, _coordinator_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ReturnToWorkPlanModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, primaryKey: true })];
        _employeeId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'employee_id',
            })];
        _claimId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: true,
                field: 'claim_id',
            })];
        _status_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(ReturnToWorkStatus)),
                allowNull: false,
                defaultValue: ReturnToWorkStatus.NOT_STARTED,
            })];
        _injuryDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
                field: 'injury_date',
            })];
        _expectedReturnDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
                field: 'expected_return_date',
            })];
        _actualReturnDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
                field: 'actual_return_date',
            })];
        _restrictions_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.TEXT),
                allowNull: true,
            })];
        _modifiedDuties_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.TEXT),
                allowNull: true,
                field: 'modified_duties',
            })];
        _accommodations_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.TEXT),
                allowNull: true,
            })];
        _medicalClearance_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                allowNull: true,
                field: 'medical_clearance',
            })];
        _medicalProvider_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(255),
                allowNull: true,
                field: 'medical_provider',
            })];
        _followUpDates_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.DATE),
                allowNull: true,
                field: 'follow_up_dates',
            })];
        _progressNotes_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
                field: 'progress_notes',
            })];
        _coordinator_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _employeeId_decorators, { kind: "field", name: "employeeId", static: false, private: false, access: { has: obj => "employeeId" in obj, get: obj => obj.employeeId, set: (obj, value) => { obj.employeeId = value; } }, metadata: _metadata }, _employeeId_initializers, _employeeId_extraInitializers);
        __esDecorate(null, null, _claimId_decorators, { kind: "field", name: "claimId", static: false, private: false, access: { has: obj => "claimId" in obj, get: obj => obj.claimId, set: (obj, value) => { obj.claimId = value; } }, metadata: _metadata }, _claimId_initializers, _claimId_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _injuryDate_decorators, { kind: "field", name: "injuryDate", static: false, private: false, access: { has: obj => "injuryDate" in obj, get: obj => obj.injuryDate, set: (obj, value) => { obj.injuryDate = value; } }, metadata: _metadata }, _injuryDate_initializers, _injuryDate_extraInitializers);
        __esDecorate(null, null, _expectedReturnDate_decorators, { kind: "field", name: "expectedReturnDate", static: false, private: false, access: { has: obj => "expectedReturnDate" in obj, get: obj => obj.expectedReturnDate, set: (obj, value) => { obj.expectedReturnDate = value; } }, metadata: _metadata }, _expectedReturnDate_initializers, _expectedReturnDate_extraInitializers);
        __esDecorate(null, null, _actualReturnDate_decorators, { kind: "field", name: "actualReturnDate", static: false, private: false, access: { has: obj => "actualReturnDate" in obj, get: obj => obj.actualReturnDate, set: (obj, value) => { obj.actualReturnDate = value; } }, metadata: _metadata }, _actualReturnDate_initializers, _actualReturnDate_extraInitializers);
        __esDecorate(null, null, _restrictions_decorators, { kind: "field", name: "restrictions", static: false, private: false, access: { has: obj => "restrictions" in obj, get: obj => obj.restrictions, set: (obj, value) => { obj.restrictions = value; } }, metadata: _metadata }, _restrictions_initializers, _restrictions_extraInitializers);
        __esDecorate(null, null, _modifiedDuties_decorators, { kind: "field", name: "modifiedDuties", static: false, private: false, access: { has: obj => "modifiedDuties" in obj, get: obj => obj.modifiedDuties, set: (obj, value) => { obj.modifiedDuties = value; } }, metadata: _metadata }, _modifiedDuties_initializers, _modifiedDuties_extraInitializers);
        __esDecorate(null, null, _accommodations_decorators, { kind: "field", name: "accommodations", static: false, private: false, access: { has: obj => "accommodations" in obj, get: obj => obj.accommodations, set: (obj, value) => { obj.accommodations = value; } }, metadata: _metadata }, _accommodations_initializers, _accommodations_extraInitializers);
        __esDecorate(null, null, _medicalClearance_decorators, { kind: "field", name: "medicalClearance", static: false, private: false, access: { has: obj => "medicalClearance" in obj, get: obj => obj.medicalClearance, set: (obj, value) => { obj.medicalClearance = value; } }, metadata: _metadata }, _medicalClearance_initializers, _medicalClearance_extraInitializers);
        __esDecorate(null, null, _medicalProvider_decorators, { kind: "field", name: "medicalProvider", static: false, private: false, access: { has: obj => "medicalProvider" in obj, get: obj => obj.medicalProvider, set: (obj, value) => { obj.medicalProvider = value; } }, metadata: _metadata }, _medicalProvider_initializers, _medicalProvider_extraInitializers);
        __esDecorate(null, null, _followUpDates_decorators, { kind: "field", name: "followUpDates", static: false, private: false, access: { has: obj => "followUpDates" in obj, get: obj => obj.followUpDates, set: (obj, value) => { obj.followUpDates = value; } }, metadata: _metadata }, _followUpDates_initializers, _followUpDates_extraInitializers);
        __esDecorate(null, null, _progressNotes_decorators, { kind: "field", name: "progressNotes", static: false, private: false, access: { has: obj => "progressNotes" in obj, get: obj => obj.progressNotes, set: (obj, value) => { obj.progressNotes = value; } }, metadata: _metadata }, _progressNotes_initializers, _progressNotes_extraInitializers);
        __esDecorate(null, null, _coordinator_decorators, { kind: "field", name: "coordinator", static: false, private: false, access: { has: obj => "coordinator" in obj, get: obj => obj.coordinator, set: (obj, value) => { obj.coordinator = value; } }, metadata: _metadata }, _coordinator_initializers, _coordinator_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ReturnToWorkPlanModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ReturnToWorkPlanModel = _classThis;
})();
exports.ReturnToWorkPlanModel = ReturnToWorkPlanModel;
/**
 * Health Surveillance Model
 */
let HealthSurveillanceModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'health_surveillance',
            timestamps: true,
            indexes: [
                { fields: ['employee_id'] },
                { fields: ['surveillance_type'] },
                { fields: ['scheduled_date'] },
                { fields: ['next_due_date'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _employeeId_decorators;
    let _employeeId_initializers = [];
    let _employeeId_extraInitializers = [];
    let _surveillanceType_decorators;
    let _surveillanceType_initializers = [];
    let _surveillanceType_extraInitializers = [];
    let _scheduledDate_decorators;
    let _scheduledDate_initializers = [];
    let _scheduledDate_extraInitializers = [];
    let _completedDate_decorators;
    let _completedDate_initializers = [];
    let _completedDate_extraInitializers = [];
    let _provider_decorators;
    let _provider_initializers = [];
    let _provider_extraInitializers = [];
    let _result_decorators;
    let _result_initializers = [];
    let _result_extraInitializers = [];
    let _restrictions_decorators;
    let _restrictions_initializers = [];
    let _restrictions_extraInitializers = [];
    let _recommendations_decorators;
    let _recommendations_initializers = [];
    let _recommendations_extraInitializers = [];
    let _nextDueDate_decorators;
    let _nextDueDate_initializers = [];
    let _nextDueDate_extraInitializers = [];
    let _certificateUrl_decorators;
    let _certificateUrl_initializers = [];
    let _certificateUrl_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var HealthSurveillanceModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.employeeId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _employeeId_initializers, void 0));
            this.surveillanceType = (__runInitializers(this, _employeeId_extraInitializers), __runInitializers(this, _surveillanceType_initializers, void 0));
            this.scheduledDate = (__runInitializers(this, _surveillanceType_extraInitializers), __runInitializers(this, _scheduledDate_initializers, void 0));
            this.completedDate = (__runInitializers(this, _scheduledDate_extraInitializers), __runInitializers(this, _completedDate_initializers, void 0));
            this.provider = (__runInitializers(this, _completedDate_extraInitializers), __runInitializers(this, _provider_initializers, void 0));
            this.result = (__runInitializers(this, _provider_extraInitializers), __runInitializers(this, _result_initializers, void 0));
            this.restrictions = (__runInitializers(this, _result_extraInitializers), __runInitializers(this, _restrictions_initializers, void 0));
            this.recommendations = (__runInitializers(this, _restrictions_extraInitializers), __runInitializers(this, _recommendations_initializers, void 0));
            this.nextDueDate = (__runInitializers(this, _recommendations_extraInitializers), __runInitializers(this, _nextDueDate_initializers, void 0));
            this.certificateUrl = (__runInitializers(this, _nextDueDate_extraInitializers), __runInitializers(this, _certificateUrl_initializers, void 0));
            this.notes = (__runInitializers(this, _certificateUrl_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.createdAt = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "HealthSurveillanceModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, primaryKey: true })];
        _employeeId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'employee_id',
            })];
        _surveillanceType_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(HealthSurveillanceType)),
                allowNull: false,
                field: 'surveillance_type',
            })];
        _scheduledDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
                field: 'scheduled_date',
            })];
        _completedDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
                field: 'completed_date',
            })];
        _provider_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(255),
                allowNull: true,
            })];
        _result_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(500),
                allowNull: true,
            })];
        _restrictions_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.TEXT),
                allowNull: true,
            })];
        _recommendations_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.TEXT),
                allowNull: true,
            })];
        _nextDueDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
                field: 'next_due_date',
            })];
        _certificateUrl_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
                field: 'certificate_url',
            })];
        _notes_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _employeeId_decorators, { kind: "field", name: "employeeId", static: false, private: false, access: { has: obj => "employeeId" in obj, get: obj => obj.employeeId, set: (obj, value) => { obj.employeeId = value; } }, metadata: _metadata }, _employeeId_initializers, _employeeId_extraInitializers);
        __esDecorate(null, null, _surveillanceType_decorators, { kind: "field", name: "surveillanceType", static: false, private: false, access: { has: obj => "surveillanceType" in obj, get: obj => obj.surveillanceType, set: (obj, value) => { obj.surveillanceType = value; } }, metadata: _metadata }, _surveillanceType_initializers, _surveillanceType_extraInitializers);
        __esDecorate(null, null, _scheduledDate_decorators, { kind: "field", name: "scheduledDate", static: false, private: false, access: { has: obj => "scheduledDate" in obj, get: obj => obj.scheduledDate, set: (obj, value) => { obj.scheduledDate = value; } }, metadata: _metadata }, _scheduledDate_initializers, _scheduledDate_extraInitializers);
        __esDecorate(null, null, _completedDate_decorators, { kind: "field", name: "completedDate", static: false, private: false, access: { has: obj => "completedDate" in obj, get: obj => obj.completedDate, set: (obj, value) => { obj.completedDate = value; } }, metadata: _metadata }, _completedDate_initializers, _completedDate_extraInitializers);
        __esDecorate(null, null, _provider_decorators, { kind: "field", name: "provider", static: false, private: false, access: { has: obj => "provider" in obj, get: obj => obj.provider, set: (obj, value) => { obj.provider = value; } }, metadata: _metadata }, _provider_initializers, _provider_extraInitializers);
        __esDecorate(null, null, _result_decorators, { kind: "field", name: "result", static: false, private: false, access: { has: obj => "result" in obj, get: obj => obj.result, set: (obj, value) => { obj.result = value; } }, metadata: _metadata }, _result_initializers, _result_extraInitializers);
        __esDecorate(null, null, _restrictions_decorators, { kind: "field", name: "restrictions", static: false, private: false, access: { has: obj => "restrictions" in obj, get: obj => obj.restrictions, set: (obj, value) => { obj.restrictions = value; } }, metadata: _metadata }, _restrictions_initializers, _restrictions_extraInitializers);
        __esDecorate(null, null, _recommendations_decorators, { kind: "field", name: "recommendations", static: false, private: false, access: { has: obj => "recommendations" in obj, get: obj => obj.recommendations, set: (obj, value) => { obj.recommendations = value; } }, metadata: _metadata }, _recommendations_initializers, _recommendations_extraInitializers);
        __esDecorate(null, null, _nextDueDate_decorators, { kind: "field", name: "nextDueDate", static: false, private: false, access: { has: obj => "nextDueDate" in obj, get: obj => obj.nextDueDate, set: (obj, value) => { obj.nextDueDate = value; } }, metadata: _metadata }, _nextDueDate_initializers, _nextDueDate_extraInitializers);
        __esDecorate(null, null, _certificateUrl_decorators, { kind: "field", name: "certificateUrl", static: false, private: false, access: { has: obj => "certificateUrl" in obj, get: obj => obj.certificateUrl, set: (obj, value) => { obj.certificateUrl = value; } }, metadata: _metadata }, _certificateUrl_initializers, _certificateUrl_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        HealthSurveillanceModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return HealthSurveillanceModel = _classThis;
})();
exports.HealthSurveillanceModel = HealthSurveillanceModel;
/**
 * Safety Certification Model
 */
let SafetyCertificationModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'safety_certifications',
            timestamps: true,
            indexes: [
                { fields: ['employee_id'] },
                { fields: ['certification_name'] },
                { fields: ['status'] },
                { fields: ['expiry_date'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _employeeId_decorators;
    let _employeeId_initializers = [];
    let _employeeId_extraInitializers = [];
    let _certificationName_decorators;
    let _certificationName_initializers = [];
    let _certificationName_extraInitializers = [];
    let _certificationBody_decorators;
    let _certificationBody_initializers = [];
    let _certificationBody_extraInitializers = [];
    let _issueDate_decorators;
    let _issueDate_initializers = [];
    let _issueDate_extraInitializers = [];
    let _expiryDate_decorators;
    let _expiryDate_initializers = [];
    let _expiryDate_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _certificateNumber_decorators;
    let _certificateNumber_initializers = [];
    let _certificateNumber_extraInitializers = [];
    let _certificateUrl_decorators;
    let _certificateUrl_initializers = [];
    let _certificateUrl_extraInitializers = [];
    let _instructor_decorators;
    let _instructor_initializers = [];
    let _instructor_extraInitializers = [];
    let _score_decorators;
    let _score_initializers = [];
    let _score_extraInitializers = [];
    let _renewalRequired_decorators;
    let _renewalRequired_initializers = [];
    let _renewalRequired_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var SafetyCertificationModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.employeeId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _employeeId_initializers, void 0));
            this.certificationName = (__runInitializers(this, _employeeId_extraInitializers), __runInitializers(this, _certificationName_initializers, void 0));
            this.certificationBody = (__runInitializers(this, _certificationName_extraInitializers), __runInitializers(this, _certificationBody_initializers, void 0));
            this.issueDate = (__runInitializers(this, _certificationBody_extraInitializers), __runInitializers(this, _issueDate_initializers, void 0));
            this.expiryDate = (__runInitializers(this, _issueDate_extraInitializers), __runInitializers(this, _expiryDate_initializers, void 0));
            this.status = (__runInitializers(this, _expiryDate_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.certificateNumber = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _certificateNumber_initializers, void 0));
            this.certificateUrl = (__runInitializers(this, _certificateNumber_extraInitializers), __runInitializers(this, _certificateUrl_initializers, void 0));
            this.instructor = (__runInitializers(this, _certificateUrl_extraInitializers), __runInitializers(this, _instructor_initializers, void 0));
            this.score = (__runInitializers(this, _instructor_extraInitializers), __runInitializers(this, _score_initializers, void 0));
            this.renewalRequired = (__runInitializers(this, _score_extraInitializers), __runInitializers(this, _renewalRequired_initializers, void 0));
            this.createdAt = (__runInitializers(this, _renewalRequired_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "SafetyCertificationModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, primaryKey: true })];
        _employeeId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'employee_id',
            })];
        _certificationName_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(255),
                allowNull: false,
                field: 'certification_name',
            })];
        _certificationBody_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(255),
                allowNull: false,
                field: 'certification_body',
            })];
        _issueDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
                field: 'issue_date',
            })];
        _expiryDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
                field: 'expiry_date',
            })];
        _status_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(CertificationStatus)),
                allowNull: false,
                defaultValue: CertificationStatus.VALID,
            })];
        _certificateNumber_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(100),
                allowNull: true,
                field: 'certificate_number',
            })];
        _certificateUrl_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
                field: 'certificate_url',
            })];
        _instructor_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(255),
                allowNull: true,
            })];
        _score_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(5, 2),
                allowNull: true,
            })];
        _renewalRequired_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                allowNull: false,
                defaultValue: true,
                field: 'renewal_required',
            })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _employeeId_decorators, { kind: "field", name: "employeeId", static: false, private: false, access: { has: obj => "employeeId" in obj, get: obj => obj.employeeId, set: (obj, value) => { obj.employeeId = value; } }, metadata: _metadata }, _employeeId_initializers, _employeeId_extraInitializers);
        __esDecorate(null, null, _certificationName_decorators, { kind: "field", name: "certificationName", static: false, private: false, access: { has: obj => "certificationName" in obj, get: obj => obj.certificationName, set: (obj, value) => { obj.certificationName = value; } }, metadata: _metadata }, _certificationName_initializers, _certificationName_extraInitializers);
        __esDecorate(null, null, _certificationBody_decorators, { kind: "field", name: "certificationBody", static: false, private: false, access: { has: obj => "certificationBody" in obj, get: obj => obj.certificationBody, set: (obj, value) => { obj.certificationBody = value; } }, metadata: _metadata }, _certificationBody_initializers, _certificationBody_extraInitializers);
        __esDecorate(null, null, _issueDate_decorators, { kind: "field", name: "issueDate", static: false, private: false, access: { has: obj => "issueDate" in obj, get: obj => obj.issueDate, set: (obj, value) => { obj.issueDate = value; } }, metadata: _metadata }, _issueDate_initializers, _issueDate_extraInitializers);
        __esDecorate(null, null, _expiryDate_decorators, { kind: "field", name: "expiryDate", static: false, private: false, access: { has: obj => "expiryDate" in obj, get: obj => obj.expiryDate, set: (obj, value) => { obj.expiryDate = value; } }, metadata: _metadata }, _expiryDate_initializers, _expiryDate_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _certificateNumber_decorators, { kind: "field", name: "certificateNumber", static: false, private: false, access: { has: obj => "certificateNumber" in obj, get: obj => obj.certificateNumber, set: (obj, value) => { obj.certificateNumber = value; } }, metadata: _metadata }, _certificateNumber_initializers, _certificateNumber_extraInitializers);
        __esDecorate(null, null, _certificateUrl_decorators, { kind: "field", name: "certificateUrl", static: false, private: false, access: { has: obj => "certificateUrl" in obj, get: obj => obj.certificateUrl, set: (obj, value) => { obj.certificateUrl = value; } }, metadata: _metadata }, _certificateUrl_initializers, _certificateUrl_extraInitializers);
        __esDecorate(null, null, _instructor_decorators, { kind: "field", name: "instructor", static: false, private: false, access: { has: obj => "instructor" in obj, get: obj => obj.instructor, set: (obj, value) => { obj.instructor = value; } }, metadata: _metadata }, _instructor_initializers, _instructor_extraInitializers);
        __esDecorate(null, null, _score_decorators, { kind: "field", name: "score", static: false, private: false, access: { has: obj => "score" in obj, get: obj => obj.score, set: (obj, value) => { obj.score = value; } }, metadata: _metadata }, _score_initializers, _score_extraInitializers);
        __esDecorate(null, null, _renewalRequired_decorators, { kind: "field", name: "renewalRequired", static: false, private: false, access: { has: obj => "renewalRequired" in obj, get: obj => obj.renewalRequired, set: (obj, value) => { obj.renewalRequired = value; } }, metadata: _metadata }, _renewalRequired_initializers, _renewalRequired_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SafetyCertificationModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SafetyCertificationModel = _classThis;
})();
exports.SafetyCertificationModel = SafetyCertificationModel;
/**
 * Emergency Drill Model
 */
let EmergencyDrillModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'emergency_drills',
            timestamps: true,
            indexes: [
                { fields: ['drill_type'] },
                { fields: ['scheduled_date'] },
                { fields: ['location'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _drillType_decorators;
    let _drillType_initializers = [];
    let _drillType_extraInitializers = [];
    let _scheduledDate_decorators;
    let _scheduledDate_initializers = [];
    let _scheduledDate_extraInitializers = [];
    let _completedDate_decorators;
    let _completedDate_initializers = [];
    let _completedDate_extraInitializers = [];
    let _location_decorators;
    let _location_initializers = [];
    let _location_extraInitializers = [];
    let _participantCount_decorators;
    let _participantCount_initializers = [];
    let _participantCount_extraInitializers = [];
    let _durationMinutes_decorators;
    let _durationMinutes_initializers = [];
    let _durationMinutes_extraInitializers = [];
    let _successful_decorators;
    let _successful_initializers = [];
    let _successful_extraInitializers = [];
    let _findings_decorators;
    let _findings_initializers = [];
    let _findings_extraInitializers = [];
    let _improvements_decorators;
    let _improvements_initializers = [];
    let _improvements_extraInitializers = [];
    let _conductedBy_decorators;
    let _conductedBy_initializers = [];
    let _conductedBy_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var EmergencyDrillModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.drillType = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _drillType_initializers, void 0));
            this.scheduledDate = (__runInitializers(this, _drillType_extraInitializers), __runInitializers(this, _scheduledDate_initializers, void 0));
            this.completedDate = (__runInitializers(this, _scheduledDate_extraInitializers), __runInitializers(this, _completedDate_initializers, void 0));
            this.location = (__runInitializers(this, _completedDate_extraInitializers), __runInitializers(this, _location_initializers, void 0));
            this.participantCount = (__runInitializers(this, _location_extraInitializers), __runInitializers(this, _participantCount_initializers, void 0));
            this.durationMinutes = (__runInitializers(this, _participantCount_extraInitializers), __runInitializers(this, _durationMinutes_initializers, void 0));
            this.successful = (__runInitializers(this, _durationMinutes_extraInitializers), __runInitializers(this, _successful_initializers, void 0));
            this.findings = (__runInitializers(this, _successful_extraInitializers), __runInitializers(this, _findings_initializers, void 0));
            this.improvements = (__runInitializers(this, _findings_extraInitializers), __runInitializers(this, _improvements_initializers, void 0));
            this.conductedBy = (__runInitializers(this, _improvements_extraInitializers), __runInitializers(this, _conductedBy_initializers, void 0));
            this.notes = (__runInitializers(this, _conductedBy_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.createdAt = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "EmergencyDrillModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, primaryKey: true })];
        _drillType_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(EmergencyType)),
                allowNull: false,
                field: 'drill_type',
            })];
        _scheduledDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
                field: 'scheduled_date',
            })];
        _completedDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
                field: 'completed_date',
            })];
        _location_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(255),
                allowNull: false,
            })];
        _participantCount_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: true,
                field: 'participant_count',
            })];
        _durationMinutes_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: true,
                field: 'duration_minutes',
            })];
        _successful_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                allowNull: false,
            })];
        _findings_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.TEXT),
                allowNull: true,
            })];
        _improvements_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.TEXT),
                allowNull: true,
            })];
        _conductedBy_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'conducted_by',
            })];
        _notes_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _drillType_decorators, { kind: "field", name: "drillType", static: false, private: false, access: { has: obj => "drillType" in obj, get: obj => obj.drillType, set: (obj, value) => { obj.drillType = value; } }, metadata: _metadata }, _drillType_initializers, _drillType_extraInitializers);
        __esDecorate(null, null, _scheduledDate_decorators, { kind: "field", name: "scheduledDate", static: false, private: false, access: { has: obj => "scheduledDate" in obj, get: obj => obj.scheduledDate, set: (obj, value) => { obj.scheduledDate = value; } }, metadata: _metadata }, _scheduledDate_initializers, _scheduledDate_extraInitializers);
        __esDecorate(null, null, _completedDate_decorators, { kind: "field", name: "completedDate", static: false, private: false, access: { has: obj => "completedDate" in obj, get: obj => obj.completedDate, set: (obj, value) => { obj.completedDate = value; } }, metadata: _metadata }, _completedDate_initializers, _completedDate_extraInitializers);
        __esDecorate(null, null, _location_decorators, { kind: "field", name: "location", static: false, private: false, access: { has: obj => "location" in obj, get: obj => obj.location, set: (obj, value) => { obj.location = value; } }, metadata: _metadata }, _location_initializers, _location_extraInitializers);
        __esDecorate(null, null, _participantCount_decorators, { kind: "field", name: "participantCount", static: false, private: false, access: { has: obj => "participantCount" in obj, get: obj => obj.participantCount, set: (obj, value) => { obj.participantCount = value; } }, metadata: _metadata }, _participantCount_initializers, _participantCount_extraInitializers);
        __esDecorate(null, null, _durationMinutes_decorators, { kind: "field", name: "durationMinutes", static: false, private: false, access: { has: obj => "durationMinutes" in obj, get: obj => obj.durationMinutes, set: (obj, value) => { obj.durationMinutes = value; } }, metadata: _metadata }, _durationMinutes_initializers, _durationMinutes_extraInitializers);
        __esDecorate(null, null, _successful_decorators, { kind: "field", name: "successful", static: false, private: false, access: { has: obj => "successful" in obj, get: obj => obj.successful, set: (obj, value) => { obj.successful = value; } }, metadata: _metadata }, _successful_initializers, _successful_extraInitializers);
        __esDecorate(null, null, _findings_decorators, { kind: "field", name: "findings", static: false, private: false, access: { has: obj => "findings" in obj, get: obj => obj.findings, set: (obj, value) => { obj.findings = value; } }, metadata: _metadata }, _findings_initializers, _findings_extraInitializers);
        __esDecorate(null, null, _improvements_decorators, { kind: "field", name: "improvements", static: false, private: false, access: { has: obj => "improvements" in obj, get: obj => obj.improvements, set: (obj, value) => { obj.improvements = value; } }, metadata: _metadata }, _improvements_initializers, _improvements_extraInitializers);
        __esDecorate(null, null, _conductedBy_decorators, { kind: "field", name: "conductedBy", static: false, private: false, access: { has: obj => "conductedBy" in obj, get: obj => obj.conductedBy, set: (obj, value) => { obj.conductedBy = value; } }, metadata: _metadata }, _conductedBy_initializers, _conductedBy_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EmergencyDrillModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EmergencyDrillModel = _classThis;
})();
exports.EmergencyDrillModel = EmergencyDrillModel;
/**
 * Safety Committee Meeting Model
 */
let SafetyCommitteeMeetingModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'safety_committee_meetings',
            timestamps: true,
            indexes: [
                { fields: ['meeting_date'] },
                { fields: ['chairperson'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _meetingDate_decorators;
    let _meetingDate_initializers = [];
    let _meetingDate_extraInitializers = [];
    let _location_decorators;
    let _location_initializers = [];
    let _location_extraInitializers = [];
    let _attendees_decorators;
    let _attendees_initializers = [];
    let _attendees_extraInitializers = [];
    let _agenda_decorators;
    let _agenda_initializers = [];
    let _agenda_extraInitializers = [];
    let _minutes_decorators;
    let _minutes_initializers = [];
    let _minutes_extraInitializers = [];
    let _actionItems_decorators;
    let _actionItems_initializers = [];
    let _actionItems_extraInitializers = [];
    let _nextMeetingDate_decorators;
    let _nextMeetingDate_initializers = [];
    let _nextMeetingDate_extraInitializers = [];
    let _chairperson_decorators;
    let _chairperson_initializers = [];
    let _chairperson_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var SafetyCommitteeMeetingModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.meetingDate = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _meetingDate_initializers, void 0));
            this.location = (__runInitializers(this, _meetingDate_extraInitializers), __runInitializers(this, _location_initializers, void 0));
            this.attendees = (__runInitializers(this, _location_extraInitializers), __runInitializers(this, _attendees_initializers, void 0));
            this.agenda = (__runInitializers(this, _attendees_extraInitializers), __runInitializers(this, _agenda_initializers, void 0));
            this.minutes = (__runInitializers(this, _agenda_extraInitializers), __runInitializers(this, _minutes_initializers, void 0));
            this.actionItems = (__runInitializers(this, _minutes_extraInitializers), __runInitializers(this, _actionItems_initializers, void 0));
            this.nextMeetingDate = (__runInitializers(this, _actionItems_extraInitializers), __runInitializers(this, _nextMeetingDate_initializers, void 0));
            this.chairperson = (__runInitializers(this, _nextMeetingDate_extraInitializers), __runInitializers(this, _chairperson_initializers, void 0));
            this.createdAt = (__runInitializers(this, _chairperson_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "SafetyCommitteeMeetingModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, primaryKey: true })];
        _meetingDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
                field: 'meeting_date',
            })];
        _location_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(255),
                allowNull: false,
            })];
        _attendees_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.UUID),
                allowNull: false,
            })];
        _agenda_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.TEXT),
                allowNull: false,
            })];
        _minutes_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            })];
        _actionItems_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
                field: 'action_items',
            })];
        _nextMeetingDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
                field: 'next_meeting_date',
            })];
        _chairperson_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _meetingDate_decorators, { kind: "field", name: "meetingDate", static: false, private: false, access: { has: obj => "meetingDate" in obj, get: obj => obj.meetingDate, set: (obj, value) => { obj.meetingDate = value; } }, metadata: _metadata }, _meetingDate_initializers, _meetingDate_extraInitializers);
        __esDecorate(null, null, _location_decorators, { kind: "field", name: "location", static: false, private: false, access: { has: obj => "location" in obj, get: obj => obj.location, set: (obj, value) => { obj.location = value; } }, metadata: _metadata }, _location_initializers, _location_extraInitializers);
        __esDecorate(null, null, _attendees_decorators, { kind: "field", name: "attendees", static: false, private: false, access: { has: obj => "attendees" in obj, get: obj => obj.attendees, set: (obj, value) => { obj.attendees = value; } }, metadata: _metadata }, _attendees_initializers, _attendees_extraInitializers);
        __esDecorate(null, null, _agenda_decorators, { kind: "field", name: "agenda", static: false, private: false, access: { has: obj => "agenda" in obj, get: obj => obj.agenda, set: (obj, value) => { obj.agenda = value; } }, metadata: _metadata }, _agenda_initializers, _agenda_extraInitializers);
        __esDecorate(null, null, _minutes_decorators, { kind: "field", name: "minutes", static: false, private: false, access: { has: obj => "minutes" in obj, get: obj => obj.minutes, set: (obj, value) => { obj.minutes = value; } }, metadata: _metadata }, _minutes_initializers, _minutes_extraInitializers);
        __esDecorate(null, null, _actionItems_decorators, { kind: "field", name: "actionItems", static: false, private: false, access: { has: obj => "actionItems" in obj, get: obj => obj.actionItems, set: (obj, value) => { obj.actionItems = value; } }, metadata: _metadata }, _actionItems_initializers, _actionItems_extraInitializers);
        __esDecorate(null, null, _nextMeetingDate_decorators, { kind: "field", name: "nextMeetingDate", static: false, private: false, access: { has: obj => "nextMeetingDate" in obj, get: obj => obj.nextMeetingDate, set: (obj, value) => { obj.nextMeetingDate = value; } }, metadata: _metadata }, _nextMeetingDate_initializers, _nextMeetingDate_extraInitializers);
        __esDecorate(null, null, _chairperson_decorators, { kind: "field", name: "chairperson", static: false, private: false, access: { has: obj => "chairperson" in obj, get: obj => obj.chairperson, set: (obj, value) => { obj.chairperson = value; } }, metadata: _metadata }, _chairperson_initializers, _chairperson_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SafetyCommitteeMeetingModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SafetyCommitteeMeetingModel = _classThis;
})();
exports.SafetyCommitteeMeetingModel = SafetyCommitteeMeetingModel;
// ============================================================================
// INCIDENT REPORTING FUNCTIONS
// ============================================================================
/**
 * Create incident report
 */
async function createIncidentReport(reportData, transaction) {
    const validated = exports.IncidentReportSchema.parse(reportData);
    const existing = await IncidentReportModel.findOne({
        where: { incidentNumber: validated.incidentNumber },
        transaction,
    });
    if (existing) {
        throw new common_1.ConflictException(`Incident ${validated.incidentNumber} already exists`);
    }
    return IncidentReportModel.create(validated, { transaction });
}
/**
 * Update incident report
 */
async function updateIncidentReport(incidentId, updates, transaction) {
    const incident = await IncidentReportModel.findByPk(incidentId, { transaction });
    if (!incident) {
        throw new common_1.NotFoundException(`Incident ${incidentId} not found`);
    }
    await incident.update(updates, { transaction });
    return incident;
}
/**
 * Get OSHA recordable incidents
 */
async function getOSHARecordableIncidents(startDate, endDate) {
    const where = { oshaRecordable: true };
    if (startDate && endDate) {
        where.incidentDate = { [sequelize_1.Op.between]: [startDate, endDate] };
    }
    return IncidentReportModel.findAll({
        where,
        order: [['incidentDate', 'DESC']],
    });
}
/**
 * Get near-miss incidents
 */
async function getNearMissIncidents(limit) {
    return IncidentReportModel.findAll({
        where: { severity: IncidentSeverity.NEAR_MISS },
        limit,
        order: [['incidentDate', 'DESC']],
    });
}
/**
 * Close incident
 */
async function closeIncident(incidentId, transaction) {
    await updateIncidentReport(incidentId, {
        status: IncidentStatus.CLOSED,
        closedDate: new Date(),
    }, transaction);
}
// ============================================================================
// SAFETY INSPECTION FUNCTIONS
// ============================================================================
/**
 * Create safety inspection
 */
async function createSafetyInspection(inspectionData, transaction) {
    const validated = exports.SafetyInspectionSchema.parse(inspectionData);
    return SafetyInspectionModel.create(validated, { transaction });
}
/**
 * Complete safety inspection
 */
async function completeSafetyInspection(inspectionId, score, findings, transaction) {
    const inspection = await SafetyInspectionModel.findByPk(inspectionId, { transaction });
    if (!inspection) {
        throw new common_1.NotFoundException(`Inspection ${inspectionId} not found`);
    }
    const criticalCount = findings.filter(f => f.severity === HazardSeverity.IMMINENT_DANGER).length;
    const passed = score >= 70 && criticalCount === 0;
    await inspection.update({
        completedDate: new Date(),
        status: passed ? InspectionStatus.PASSED : InspectionStatus.FAILED,
        score,
        findingsCount: findings.length,
        criticalFindings: criticalCount,
    }, { transaction });
    // Create findings
    for (const finding of findings) {
        await InspectionFindingModel.create({
            inspectionId,
            ...finding,
        }, { transaction });
    }
}
/**
 * Get upcoming inspections
 */
async function getUpcomingInspections(daysAhead = 30) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);
    return SafetyInspectionModel.findAll({
        where: {
            scheduledDate: { [sequelize_1.Op.between]: [new Date(), futureDate] },
            status: InspectionStatus.SCHEDULED,
        },
        order: [['scheduledDate', 'ASC']],
    });
}
/**
 * Get failed inspections
 */
async function getFailedInspections() {
    return SafetyInspectionModel.findAll({
        where: { status: InspectionStatus.FAILED },
        order: [['completedDate', 'DESC']],
    });
}
// ============================================================================
// HAZARD MANAGEMENT FUNCTIONS
// ============================================================================
/**
 * Create hazard
 */
async function createHazard(hazardData, transaction) {
    const validated = exports.HazardSchema.parse(hazardData);
    return HazardModel.create(validated, { transaction });
}
/**
 * Update hazard status
 */
async function updateHazardStatus(hazardId, status, transaction) {
    const hazard = await HazardModel.findByPk(hazardId, { transaction });
    if (!hazard) {
        throw new common_1.NotFoundException(`Hazard ${hazardId} not found`);
    }
    const updates = { status };
    if (status === HazardStatus.MITIGATED) {
        updates.completedDate = new Date();
    }
    await hazard.update(updates, { transaction });
}
/**
 * Get open hazards
 */
async function getOpenHazards(severity) {
    const where = {
        status: { [sequelize_1.Op.notIn]: [HazardStatus.MITIGATED, HazardStatus.ACCEPTED_RISK] },
    };
    if (severity) {
        where.severity = severity;
    }
    return HazardModel.findAll({
        where,
        order: [['severity', 'DESC'], ['identifiedDate', 'DESC']],
    });
}
/**
 * Get imminent danger hazards
 */
async function getImminentDangerHazards() {
    return HazardModel.findAll({
        where: {
            severity: HazardSeverity.IMMINENT_DANGER,
            status: { [sequelize_1.Op.notIn]: [HazardStatus.MITIGATED, HazardStatus.ACCEPTED_RISK] },
        },
        order: [['identifiedDate', 'DESC']],
    });
}
// ============================================================================
// PPE MANAGEMENT FUNCTIONS
// ============================================================================
/**
 * Issue PPE to employee
 */
async function issuePPE(ppeData, transaction) {
    const validated = exports.PPEIssuanceSchema.parse(ppeData);
    return PPEIssuanceModel.create(validated, { transaction });
}
/**
 * Return PPE
 */
async function returnPPE(ppeId, transaction) {
    const ppe = await PPEIssuanceModel.findByPk(ppeId, { transaction });
    if (!ppe) {
        throw new common_1.NotFoundException(`PPE issuance ${ppeId} not found`);
    }
    await ppe.update({ returnedDate: new Date() }, { transaction });
}
/**
 * Get employee PPE
 */
async function getEmployeePPE(employeeId) {
    return PPEIssuanceModel.findAll({
        where: {
            employeeId,
            returnedDate: null,
        },
        order: [['issuedDate', 'DESC']],
    });
}
/**
 * Get expiring PPE
 */
async function getExpiringPPE(daysAhead = 30) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);
    return PPEIssuanceModel.findAll({
        where: {
            expiryDate: { [sequelize_1.Op.between]: [new Date(), futureDate] },
            returnedDate: null,
        },
        order: [['expiryDate', 'ASC']],
    });
}
// ============================================================================
// WORKERS' COMPENSATION FUNCTIONS
// ============================================================================
/**
 * Create workers' comp claim
 */
async function createWorkersCompClaim(claimData, transaction) {
    const validated = exports.WorkersCompClaimSchema.parse(claimData);
    return WorkersCompClaimModel.create(validated, { transaction });
}
/**
 * Update claim status
 */
async function updateClaimStatus(claimId, status, transaction) {
    const claim = await WorkersCompClaimModel.findByPk(claimId, { transaction });
    if (!claim) {
        throw new common_1.NotFoundException(`Claim ${claimId} not found`);
    }
    const updates = { status };
    if (status === WorkersCompStatus.CLOSED) {
        updates.closedDate = new Date();
    }
    await claim.update(updates, { transaction });
}
/**
 * Get open claims
 */
async function getOpenClaims() {
    return WorkersCompClaimModel.findAll({
        where: { status: { [sequelize_1.Op.ne]: WorkersCompStatus.CLOSED } },
        order: [['injuryDate', 'DESC']],
    });
}
/**
 * Calculate total claim costs
 */
async function calculateTotalClaimCosts(startDate, endDate) {
    const where = {};
    if (startDate && endDate) {
        where.injuryDate = { [sequelize_1.Op.between]: [startDate, endDate] };
    }
    const claims = await WorkersCompClaimModel.findAll({ where });
    return claims.reduce((sum, claim) => sum + (claim.actualCost || claim.estimatedCost || 0), 0);
}
// ============================================================================
// RETURN TO WORK FUNCTIONS
// ============================================================================
/**
 * Create return to work plan
 */
async function createReturnToWorkPlan(planData, transaction) {
    const validated = exports.ReturnToWorkPlanSchema.parse(planData);
    return ReturnToWorkPlanModel.create(validated, { transaction });
}
/**
 * Update RTW plan status
 */
async function updateRTWPlanStatus(planId, status, transaction) {
    const plan = await ReturnToWorkPlanModel.findByPk(planId, { transaction });
    if (!plan) {
        throw new common_1.NotFoundException(`RTW plan ${planId} not found`);
    }
    const updates = { status };
    if (status === ReturnToWorkStatus.FULL_DUTY_RETURNED) {
        updates.actualReturnDate = new Date();
    }
    await plan.update(updates, { transaction });
}
/**
 * Get active RTW plans
 */
async function getActiveRTWPlans() {
    return ReturnToWorkPlanModel.findAll({
        where: {
            status: {
                [sequelize_1.Op.notIn]: [ReturnToWorkStatus.FULL_DUTY_RETURNED, ReturnToWorkStatus.UNABLE_TO_RETURN],
            },
        },
        order: [['expectedReturnDate', 'ASC']],
    });
}
// ============================================================================
// HEALTH SURVEILLANCE FUNCTIONS
// ============================================================================
/**
 * Schedule health surveillance
 */
async function scheduleHealthSurveillance(surveillanceData, transaction) {
    const validated = exports.HealthSurveillanceSchema.parse(surveillanceData);
    return HealthSurveillanceModel.create(validated, { transaction });
}
/**
 * Complete health surveillance
 */
async function completeHealthSurveillance(surveillanceId, result, nextDueDate, transaction) {
    const surveillance = await HealthSurveillanceModel.findByPk(surveillanceId, { transaction });
    if (!surveillance) {
        throw new common_1.NotFoundException(`Surveillance ${surveillanceId} not found`);
    }
    await surveillance.update({
        completedDate: new Date(),
        result,
        nextDueDate,
    }, { transaction });
}
/**
 * Get due health surveillance
 */
async function getDueHealthSurveillance() {
    return HealthSurveillanceModel.findAll({
        where: {
            scheduledDate: { [sequelize_1.Op.lte]: new Date() },
            completedDate: null,
        },
        order: [['scheduledDate', 'ASC']],
    });
}
// ============================================================================
// SAFETY CERTIFICATION FUNCTIONS
// ============================================================================
/**
 * Record safety certification
 */
async function recordSafetyCertification(certData, transaction) {
    const validated = exports.SafetyCertificationSchema.parse(certData);
    return SafetyCertificationModel.create(validated, { transaction });
}
/**
 * Get expiring certifications
 */
async function getExpiringCertifications(daysAhead = 60) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);
    return SafetyCertificationModel.findAll({
        where: {
            expiryDate: { [sequelize_1.Op.between]: [new Date(), futureDate] },
            status: CertificationStatus.VALID,
        },
        order: [['expiryDate', 'ASC']],
    });
}
/**
 * Get employee certifications
 */
async function getEmployeeCertifications(employeeId) {
    return SafetyCertificationModel.findAll({
        where: { employeeId },
        order: [['issueDate', 'DESC']],
    });
}
// ============================================================================
// EMERGENCY PREPAREDNESS FUNCTIONS
// ============================================================================
/**
 * Schedule emergency drill
 */
async function scheduleEmergencyDrill(drillData, transaction) {
    return EmergencyDrillModel.create(drillData, { transaction });
}
/**
 * Complete emergency drill
 */
async function completeEmergencyDrill(drillId, participantCount, durationMinutes, successful, findings, transaction) {
    const drill = await EmergencyDrillModel.findByPk(drillId, { transaction });
    if (!drill) {
        throw new common_1.NotFoundException(`Drill ${drillId} not found`);
    }
    await drill.update({
        completedDate: new Date(),
        participantCount,
        durationMinutes,
        successful,
        findings,
    }, { transaction });
}
/**
 * Get upcoming drills
 */
async function getUpcomingDrills() {
    return EmergencyDrillModel.findAll({
        where: {
            scheduledDate: { [sequelize_1.Op.gte]: new Date() },
            completedDate: null,
        },
        order: [['scheduledDate', 'ASC']],
    });
}
// ============================================================================
// SAFETY COMMITTEE FUNCTIONS
// ============================================================================
/**
 * Create safety committee meeting
 */
async function createSafetyCommitteeMeeting(meetingData, transaction) {
    return SafetyCommitteeMeetingModel.create(meetingData, { transaction });
}
/**
 * Get recent committee meetings
 */
async function getRecentCommitteeMeetings(limit = 10) {
    return SafetyCommitteeMeetingModel.findAll({
        limit,
        order: [['meetingDate', 'DESC']],
    });
}
// ============================================================================
// SAFETY ANALYTICS FUNCTIONS
// ============================================================================
/**
 * Calculate incident rate
 */
function calculateIncidentRate(incidents, hoursWorked) {
    return (incidents * 200000) / hoursWorked;
}
/**
 * Calculate DART rate (Days Away, Restricted, or Transferred)
 */
function calculateDARTRate(dartCases, hoursWorked) {
    return (dartCases * 200000) / hoursWorked;
}
/**
 * Get safety dashboard metrics
 */
async function getSafetyDashboardMetrics() {
    const [openIncidents, oshaRecordable, openHazards, imminentDangers, openClaims, activeRTWPlans, upcomingInspections, expiringCertifications,] = await Promise.all([
        IncidentReportModel.count({ where: { status: { [sequelize_1.Op.ne]: IncidentStatus.CLOSED } } }),
        IncidentReportModel.count({ where: { oshaRecordable: true } }),
        HazardModel.count({
            where: { status: { [sequelize_1.Op.notIn]: [HazardStatus.MITIGATED, HazardStatus.ACCEPTED_RISK] } },
        }),
        HazardModel.count({
            where: {
                severity: HazardSeverity.IMMINENT_DANGER,
                status: { [sequelize_1.Op.notIn]: [HazardStatus.MITIGATED, HazardStatus.ACCEPTED_RISK] },
            },
        }),
        WorkersCompClaimModel.count({ where: { status: { [sequelize_1.Op.ne]: WorkersCompStatus.CLOSED } } }),
        ReturnToWorkPlanModel.count({
            where: {
                status: {
                    [sequelize_1.Op.notIn]: [ReturnToWorkStatus.FULL_DUTY_RETURNED, ReturnToWorkStatus.UNABLE_TO_RETURN],
                },
            },
        }),
        SafetyInspectionModel.count({
            where: {
                scheduledDate: { [sequelize_1.Op.gte]: new Date() },
                status: InspectionStatus.SCHEDULED,
            },
        }),
        SafetyCertificationModel.count({
            where: {
                expiryDate: { [sequelize_1.Op.lte]: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) },
                status: CertificationStatus.VALID,
            },
        }),
    ]);
    return {
        openIncidents,
        oshaRecordable,
        openHazards,
        imminentDangers,
        openClaims,
        activeRTWPlans,
        upcomingInspections,
        expiringCertifications,
    };
}
/**
 * Get incident by number
 */
async function getIncidentByNumber(incidentNumber) {
    return IncidentReportModel.findOne({
        where: { incidentNumber },
    });
}
/**
 * Get claim by number
 */
async function getClaimByNumber(claimNumber) {
    return WorkersCompClaimModel.findOne({
        where: { claimNumber },
    });
}
/**
 * Get hazard by number
 */
async function getHazardByNumber(hazardNumber) {
    return HazardModel.findOne({
        where: { hazardNumber },
    });
}
/**
 * Get inspection by number
 */
async function getInspectionByNumber(inspectionNumber) {
    return SafetyInspectionModel.findOne({
        where: { inspectionNumber },
        include: [{ model: InspectionFindingModel, as: 'findings' }],
    });
}
/**
 * Get employee incident history
 */
async function getEmployeeIncidentHistory(employeeId) {
    return IncidentReportModel.findAll({
        where: { employeeId },
        order: [['incidentDate', 'DESC']],
    });
}
/**
 * Get employee claims
 */
async function getEmployeeClaims(employeeId) {
    return WorkersCompClaimModel.findAll({
        where: { employeeId },
        order: [['injuryDate', 'DESC']],
    });
}
/**
 * Generate OSHA 300 log data for reporting year
 */
async function generateOSHA300Log(year) {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31, 23, 59, 59);
    const incidents = await IncidentReportModel.findAll({
        where: {
            oshaRecordable: true,
            incidentDate: { [sequelize_1.Op.between]: [startDate, endDate] },
        },
        order: [['incidentDate', 'ASC']],
    });
    const totalDeaths = incidents.filter(i => i.severity === IncidentSeverity.FATAL).length;
    const daysAwayFromWork = incidents.reduce((sum, i) => sum + (i.workDaysLost || 0), 0);
    const daysOfRestrictedWork = incidents.reduce((sum, i) => sum + (i.restrictedWorkDays || 0), 0);
    return {
        year,
        incidents,
        totalRecordable: incidents.length,
        daysAwayFromWork,
        daysOfRestrictedWork,
        totalDeaths,
    };
}
// ============================================================================
// NESTJS SERVICE
// ============================================================================
let SafetyHealthService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var SafetyHealthService = _classThis = class {
        async createIncident(data) {
            return createIncidentReport(data);
        }
        async createInspection(data) {
            return createSafetyInspection(data);
        }
        async createHazard(data) {
            return createHazard(data);
        }
        async issuePPE(data) {
            return issuePPE(data);
        }
        async createClaim(data) {
            return createWorkersCompClaim(data);
        }
        async getDashboard() {
            return getSafetyDashboardMetrics();
        }
    };
    __setFunctionName(_classThis, "SafetyHealthService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SafetyHealthService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SafetyHealthService = _classThis;
})();
exports.SafetyHealthService = SafetyHealthService;
// ============================================================================
// NESTJS CONTROLLER
// ============================================================================
let SafetyHealthController = (() => {
    let _classDecorators = [(0, swagger_1.ApiTags)('Safety & Health'), (0, common_1.Controller)('safety-health'), (0, swagger_1.ApiBearerAuth)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _getDashboard_decorators;
    let _createIncident_decorators;
    let _createHazard_decorators;
    let _createClaim_decorators;
    var SafetyHealthController = _classThis = class {
        constructor(safetyService) {
            this.safetyService = (__runInitializers(this, _instanceExtraInitializers), safetyService);
        }
        async getDashboard() {
            return this.safetyService.getDashboard();
        }
        async createIncident(data) {
            return this.safetyService.createIncident(data);
        }
        async createHazard(data) {
            return this.safetyService.createHazard(data);
        }
        async createClaim(data) {
            return this.safetyService.createClaim(data);
        }
    };
    __setFunctionName(_classThis, "SafetyHealthController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getDashboard_decorators = [(0, common_1.Get)('dashboard'), (0, swagger_1.ApiOperation)({ summary: 'Get safety dashboard metrics' })];
        _createIncident_decorators = [(0, common_1.Post)('incidents'), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({ summary: 'Create incident report' })];
        _createHazard_decorators = [(0, common_1.Post)('hazards'), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({ summary: 'Create hazard report' })];
        _createClaim_decorators = [(0, common_1.Post)('claims'), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({ summary: 'Create workers comp claim' })];
        __esDecorate(_classThis, null, _getDashboard_decorators, { kind: "method", name: "getDashboard", static: false, private: false, access: { has: obj => "getDashboard" in obj, get: obj => obj.getDashboard }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createIncident_decorators, { kind: "method", name: "createIncident", static: false, private: false, access: { has: obj => "createIncident" in obj, get: obj => obj.createIncident }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createHazard_decorators, { kind: "method", name: "createHazard", static: false, private: false, access: { has: obj => "createHazard" in obj, get: obj => obj.createHazard }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createClaim_decorators, { kind: "method", name: "createClaim", static: false, private: false, access: { has: obj => "createClaim" in obj, get: obj => obj.createClaim }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SafetyHealthController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SafetyHealthController = _classThis;
})();
exports.SafetyHealthController = SafetyHealthController;
//# sourceMappingURL=safety-health-kit.js.map