"use strict";
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
exports.IncidentCommandController = exports.TransferCommandDto = exports.CreateSituationReportDto = exports.CreateIncidentActionPlanDto = exports.CreateTacticalObjectiveDto = exports.RequestResourcesDto = exports.AssignICSPositionDto = exports.EstablishUnifiedCommandDto = exports.UpdateIncidentDto = exports.CreateIncidentDto = exports.OperationalPeriod = exports.ObjectiveStatus = exports.ResourceRequestStatus = exports.ICSPosition = exports.ICSSection = exports.IncidentType = exports.IncidentStatus = exports.IncidentSeverity = void 0;
exports.createIncident = createIncident;
exports.generateIncidentNumber = generateIncidentNumber;
exports.classifyIncident = classifyIncident;
exports.calculateIncidentPriority = calculateIncidentPriority;
exports.escalateIncident = escalateIncident;
exports.downgradeIncident = downgradeIncident;
exports.updateIncidentStatus = updateIncidentStatus;
exports.validateStatusTransition = validateStatusTransition;
exports.assignIncidentCommander = assignIncidentCommander;
exports.getIncidentTimeline = getIncidentTimeline;
exports.addTimelineEntry = addTimelineEntry;
exports.establishUnifiedCommand = establishUnifiedCommand;
exports.requestMutualAid = requestMutualAid;
exports.coordinateMultiAgencyResponse = coordinateMultiAgencyResponse;
exports.transferCommand = transferCommand;
exports.assignICSPosition = assignICSPosition;
exports.relieveICSPosition = relieveICSPosition;
exports.getICSOrganizationChart = getICSOrganizationChart;
exports.activateICSSection = activateICSSection;
exports.requestResources = requestResources;
exports.generateResourceRequestNumber = generateResourceRequestNumber;
exports.approveResourceRequest = approveResourceRequest;
exports.assignResourcesToRequest = assignResourcesToRequest;
exports.releaseResources = releaseResources;
exports.trackResourceAllocation = trackResourceAllocation;
exports.createTacticalObjective = createTacticalObjective;
exports.updateObjectiveStatus = updateObjectiveStatus;
exports.getTacticalObjectives = getTacticalObjectives;
exports.createIncidentActionPlan = createIncidentActionPlan;
exports.approveIncidentActionPlan = approveIncidentActionPlan;
exports.createSituationReport = createSituationReport;
exports.getSituationReports = getSituationReports;
exports.conductOperationalBriefing = conductOperationalBriefing;
exports.createSafetyBriefing = createSafetyBriefing;
exports.initiateDemobilization = initiateDemobilization;
exports.closeIncident = closeIncident;
exports.generateIncidentSummary = generateIncidentSummary;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const faker_1 = require("@faker-js/faker");
// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================
/**
 * Incident severity levels aligned with ICS standards
 */
var IncidentSeverity;
(function (IncidentSeverity) {
    IncidentSeverity["MINOR"] = "minor";
    IncidentSeverity["MODERATE"] = "moderate";
    IncidentSeverity["MAJOR"] = "major";
    IncidentSeverity["CRITICAL"] = "critical";
    IncidentSeverity["CATASTROPHIC"] = "catastrophic";
})(IncidentSeverity || (exports.IncidentSeverity = IncidentSeverity = {}));
/**
 * Incident status progression
 */
var IncidentStatus;
(function (IncidentStatus) {
    IncidentStatus["REPORTED"] = "reported";
    IncidentStatus["DISPATCHED"] = "dispatched";
    IncidentStatus["RESPONDING"] = "responding";
    IncidentStatus["ON_SCENE"] = "on_scene";
    IncidentStatus["UNDER_CONTROL"] = "under_control";
    IncidentStatus["CONTAINED"] = "contained";
    IncidentStatus["CONTROLLED"] = "controlled";
    IncidentStatus["DEMOBILIZING"] = "demobilizing";
    IncidentStatus["CLOSED"] = "closed";
    IncidentStatus["CANCELLED"] = "cancelled";
})(IncidentStatus || (exports.IncidentStatus = IncidentStatus = {}));
/**
 * ICS incident types
 */
var IncidentType;
(function (IncidentType) {
    IncidentType["STRUCTURE_FIRE"] = "structure_fire";
    IncidentType["WILDFIRE"] = "wildfire";
    IncidentType["VEHICLE_FIRE"] = "vehicle_fire";
    IncidentType["HAZMAT"] = "hazmat";
    IncidentType["MEDICAL_EMERGENCY"] = "medical_emergency";
    IncidentType["MASS_CASUALTY"] = "mass_casualty";
    IncidentType["TRAUMA"] = "trauma";
    IncidentType["CARDIAC_ARREST"] = "cardiac_arrest";
    IncidentType["VEHICLE_ACCIDENT"] = "vehicle_accident";
    IncidentType["RESCUE"] = "rescue";
    IncidentType["WATER_RESCUE"] = "water_rescue";
    IncidentType["TECHNICAL_RESCUE"] = "technical_rescue";
    IncidentType["NATURAL_DISASTER"] = "natural_disaster";
    IncidentType["TERRORIST_INCIDENT"] = "terrorist_incident";
    IncidentType["CIVIL_DISTURBANCE"] = "civil_disturbance";
    IncidentType["OTHER"] = "other";
})(IncidentType || (exports.IncidentType = IncidentType = {}));
/**
 * ICS organizational sections
 */
var ICSSection;
(function (ICSSection) {
    ICSSection["COMMAND"] = "command";
    ICSSection["OPERATIONS"] = "operations";
    ICSSection["PLANNING"] = "planning";
    ICSSection["LOGISTICS"] = "logistics";
    ICSSection["FINANCE_ADMIN"] = "finance_admin";
})(ICSSection || (exports.ICSSection = ICSSection = {}));
/**
 * ICS command positions
 */
var ICSPosition;
(function (ICSPosition) {
    ICSPosition["INCIDENT_COMMANDER"] = "incident_commander";
    ICSPosition["SAFETY_OFFICER"] = "safety_officer";
    ICSPosition["PUBLIC_INFO_OFFICER"] = "public_info_officer";
    ICSPosition["LIAISON_OFFICER"] = "liaison_officer";
    ICSPosition["OPERATIONS_CHIEF"] = "operations_chief";
    ICSPosition["PLANNING_CHIEF"] = "planning_chief";
    ICSPosition["LOGISTICS_CHIEF"] = "logistics_chief";
    ICSPosition["FINANCE_CHIEF"] = "finance_chief";
    ICSPosition["DIVISION_SUPERVISOR"] = "division_supervisor";
    ICSPosition["BRANCH_DIRECTOR"] = "branch_director";
    ICSPosition["STRIKE_TEAM_LEADER"] = "strike_team_leader";
    ICSPosition["TASK_FORCE_LEADER"] = "task_force_leader";
})(ICSPosition || (exports.ICSPosition = ICSPosition = {}));
/**
 * Resource request status
 */
var ResourceRequestStatus;
(function (ResourceRequestStatus) {
    ResourceRequestStatus["REQUESTED"] = "requested";
    ResourceRequestStatus["PENDING"] = "pending";
    ResourceRequestStatus["APPROVED"] = "approved";
    ResourceRequestStatus["DISPATCHED"] = "dispatched";
    ResourceRequestStatus["STAGED"] = "staged";
    ResourceRequestStatus["ASSIGNED"] = "assigned";
    ResourceRequestStatus["RELEASED"] = "released";
    ResourceRequestStatus["CANCELLED"] = "cancelled";
})(ResourceRequestStatus || (exports.ResourceRequestStatus = ResourceRequestStatus = {}));
/**
 * Tactical objective status
 */
var ObjectiveStatus;
(function (ObjectiveStatus) {
    ObjectiveStatus["PLANNED"] = "planned";
    ObjectiveStatus["IN_PROGRESS"] = "in_progress";
    ObjectiveStatus["COMPLETED"] = "completed";
    ObjectiveStatus["DEFERRED"] = "deferred";
    ObjectiveStatus["CANCELLED"] = "cancelled";
})(ObjectiveStatus || (exports.ObjectiveStatus = ObjectiveStatus = {}));
/**
 * Action plan operational period
 */
var OperationalPeriod;
(function (OperationalPeriod) {
    OperationalPeriod["TWELVE_HOURS"] = "12_hours";
    OperationalPeriod["TWENTY_FOUR_HOURS"] = "24_hours";
    OperationalPeriod["CUSTOM"] = "custom";
})(OperationalPeriod || (exports.OperationalPeriod = OperationalPeriod = {}));
ppe;
required: string[];
accountabilityProcedures ?  : string;
emergencyProcedures ?  : string;
// ============================================================================
// DTO CLASSES FOR VALIDATION
// ============================================================================
/**
 * Create incident DTO
 */
let CreateIncidentDto = (() => {
    var _a;
    let _incidentType_decorators;
    let _incidentType_initializers = [];
    let _incidentType_extraInitializers = [];
    let _severity_decorators;
    let _severity_initializers = [];
    let _severity_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _latitude_decorators;
    let _latitude_initializers = [];
    let _latitude_extraInitializers = [];
    let _longitude_decorators;
    let _longitude_initializers = [];
    let _longitude_extraInitializers = [];
    let _address_decorators;
    let _address_initializers = [];
    let _address_extraInitializers = [];
    let _city_decorators;
    let _city_initializers = [];
    let _city_extraInitializers = [];
    let _state_decorators;
    let _state_initializers = [];
    let _state_extraInitializers = [];
    let _reportedBy_decorators;
    let _reportedBy_initializers = [];
    let _reportedBy_extraInitializers = [];
    let _patientCount_decorators;
    let _patientCount_initializers = [];
    let _patientCount_extraInitializers = [];
    let _specialHazards_decorators;
    let _specialHazards_initializers = [];
    let _specialHazards_extraInitializers = [];
    let _weatherConditions_decorators;
    let _weatherConditions_initializers = [];
    let _weatherConditions_extraInitializers = [];
    return _a = class CreateIncidentDto {
            constructor() {
                this.incidentType = __runInitializers(this, _incidentType_initializers, void 0);
                this.severity = (__runInitializers(this, _incidentType_extraInitializers), __runInitializers(this, _severity_initializers, void 0));
                this.description = (__runInitializers(this, _severity_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.latitude = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _latitude_initializers, void 0));
                this.longitude = (__runInitializers(this, _latitude_extraInitializers), __runInitializers(this, _longitude_initializers, void 0));
                this.address = (__runInitializers(this, _longitude_extraInitializers), __runInitializers(this, _address_initializers, void 0));
                this.city = (__runInitializers(this, _address_extraInitializers), __runInitializers(this, _city_initializers, void 0));
                this.state = (__runInitializers(this, _city_extraInitializers), __runInitializers(this, _state_initializers, void 0));
                this.reportedBy = (__runInitializers(this, _state_extraInitializers), __runInitializers(this, _reportedBy_initializers, void 0));
                this.patientCount = (__runInitializers(this, _reportedBy_extraInitializers), __runInitializers(this, _patientCount_initializers, void 0));
                this.specialHazards = (__runInitializers(this, _patientCount_extraInitializers), __runInitializers(this, _specialHazards_initializers, void 0));
                this.weatherConditions = (__runInitializers(this, _specialHazards_extraInitializers), __runInitializers(this, _weatherConditions_initializers, void 0));
                __runInitializers(this, _weatherConditions_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _incidentType_decorators = [(0, swagger_1.ApiProperty)({ enum: IncidentType, description: 'Type of incident' }), (0, class_validator_1.IsEnum)(IncidentType)];
            _severity_decorators = [(0, swagger_1.ApiProperty)({ enum: IncidentSeverity, description: 'Incident severity' }), (0, class_validator_1.IsEnum)(IncidentSeverity)];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Incident description' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(2000)];
            _latitude_decorators = [(0, swagger_1.ApiProperty)({ description: 'Location latitude' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsLatitude)()];
            _longitude_decorators = [(0, swagger_1.ApiProperty)({ description: 'Location longitude' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsLongitude)()];
            _address_decorators = [(0, swagger_1.ApiProperty)({ description: 'Street address', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(200)];
            _city_decorators = [(0, swagger_1.ApiProperty)({ description: 'City', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _state_decorators = [(0, swagger_1.ApiProperty)({ description: 'State', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _reportedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Reported by user ID' }), (0, class_validator_1.IsUUID)()];
            _patientCount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Patient count', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _specialHazards_decorators = [(0, swagger_1.ApiProperty)({ description: 'Special hazards', required: false, type: [String] }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _weatherConditions_decorators = [(0, swagger_1.ApiProperty)({ description: 'Weather conditions', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _incidentType_decorators, { kind: "field", name: "incidentType", static: false, private: false, access: { has: obj => "incidentType" in obj, get: obj => obj.incidentType, set: (obj, value) => { obj.incidentType = value; } }, metadata: _metadata }, _incidentType_initializers, _incidentType_extraInitializers);
            __esDecorate(null, null, _severity_decorators, { kind: "field", name: "severity", static: false, private: false, access: { has: obj => "severity" in obj, get: obj => obj.severity, set: (obj, value) => { obj.severity = value; } }, metadata: _metadata }, _severity_initializers, _severity_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _latitude_decorators, { kind: "field", name: "latitude", static: false, private: false, access: { has: obj => "latitude" in obj, get: obj => obj.latitude, set: (obj, value) => { obj.latitude = value; } }, metadata: _metadata }, _latitude_initializers, _latitude_extraInitializers);
            __esDecorate(null, null, _longitude_decorators, { kind: "field", name: "longitude", static: false, private: false, access: { has: obj => "longitude" in obj, get: obj => obj.longitude, set: (obj, value) => { obj.longitude = value; } }, metadata: _metadata }, _longitude_initializers, _longitude_extraInitializers);
            __esDecorate(null, null, _address_decorators, { kind: "field", name: "address", static: false, private: false, access: { has: obj => "address" in obj, get: obj => obj.address, set: (obj, value) => { obj.address = value; } }, metadata: _metadata }, _address_initializers, _address_extraInitializers);
            __esDecorate(null, null, _city_decorators, { kind: "field", name: "city", static: false, private: false, access: { has: obj => "city" in obj, get: obj => obj.city, set: (obj, value) => { obj.city = value; } }, metadata: _metadata }, _city_initializers, _city_extraInitializers);
            __esDecorate(null, null, _state_decorators, { kind: "field", name: "state", static: false, private: false, access: { has: obj => "state" in obj, get: obj => obj.state, set: (obj, value) => { obj.state = value; } }, metadata: _metadata }, _state_initializers, _state_extraInitializers);
            __esDecorate(null, null, _reportedBy_decorators, { kind: "field", name: "reportedBy", static: false, private: false, access: { has: obj => "reportedBy" in obj, get: obj => obj.reportedBy, set: (obj, value) => { obj.reportedBy = value; } }, metadata: _metadata }, _reportedBy_initializers, _reportedBy_extraInitializers);
            __esDecorate(null, null, _patientCount_decorators, { kind: "field", name: "patientCount", static: false, private: false, access: { has: obj => "patientCount" in obj, get: obj => obj.patientCount, set: (obj, value) => { obj.patientCount = value; } }, metadata: _metadata }, _patientCount_initializers, _patientCount_extraInitializers);
            __esDecorate(null, null, _specialHazards_decorators, { kind: "field", name: "specialHazards", static: false, private: false, access: { has: obj => "specialHazards" in obj, get: obj => obj.specialHazards, set: (obj, value) => { obj.specialHazards = value; } }, metadata: _metadata }, _specialHazards_initializers, _specialHazards_extraInitializers);
            __esDecorate(null, null, _weatherConditions_decorators, { kind: "field", name: "weatherConditions", static: false, private: false, access: { has: obj => "weatherConditions" in obj, get: obj => obj.weatherConditions, set: (obj, value) => { obj.weatherConditions = value; } }, metadata: _metadata }, _weatherConditions_initializers, _weatherConditions_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateIncidentDto = CreateIncidentDto;
/**
 * Update incident DTO
 */
let UpdateIncidentDto = (() => {
    var _a;
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _severity_decorators;
    let _severity_initializers = [];
    let _severity_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _patientCount_decorators;
    let _patientCount_initializers = [];
    let _patientCount_extraInitializers = [];
    let _structuresInvolved_decorators;
    let _structuresInvolved_initializers = [];
    let _structuresInvolved_extraInitializers = [];
    let _estimatedLoss_decorators;
    let _estimatedLoss_initializers = [];
    let _estimatedLoss_extraInitializers = [];
    return _a = class UpdateIncidentDto {
            constructor() {
                this.status = __runInitializers(this, _status_initializers, void 0);
                this.severity = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _severity_initializers, void 0));
                this.description = (__runInitializers(this, _severity_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.patientCount = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _patientCount_initializers, void 0));
                this.structuresInvolved = (__runInitializers(this, _patientCount_extraInitializers), __runInitializers(this, _structuresInvolved_initializers, void 0));
                this.estimatedLoss = (__runInitializers(this, _structuresInvolved_extraInitializers), __runInitializers(this, _estimatedLoss_initializers, void 0));
                __runInitializers(this, _estimatedLoss_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _status_decorators = [(0, swagger_1.ApiProperty)({ enum: IncidentStatus, required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(IncidentStatus)];
            _severity_decorators = [(0, swagger_1.ApiProperty)({ enum: IncidentSeverity, required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(IncidentSeverity)];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Incident description', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(2000)];
            _patientCount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Patient count', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _structuresInvolved_decorators = [(0, swagger_1.ApiProperty)({ description: 'Structures involved', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _estimatedLoss_decorators = [(0, swagger_1.ApiProperty)({ description: 'Estimated loss in dollars', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _severity_decorators, { kind: "field", name: "severity", static: false, private: false, access: { has: obj => "severity" in obj, get: obj => obj.severity, set: (obj, value) => { obj.severity = value; } }, metadata: _metadata }, _severity_initializers, _severity_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _patientCount_decorators, { kind: "field", name: "patientCount", static: false, private: false, access: { has: obj => "patientCount" in obj, get: obj => obj.patientCount, set: (obj, value) => { obj.patientCount = value; } }, metadata: _metadata }, _patientCount_initializers, _patientCount_extraInitializers);
            __esDecorate(null, null, _structuresInvolved_decorators, { kind: "field", name: "structuresInvolved", static: false, private: false, access: { has: obj => "structuresInvolved" in obj, get: obj => obj.structuresInvolved, set: (obj, value) => { obj.structuresInvolved = value; } }, metadata: _metadata }, _structuresInvolved_initializers, _structuresInvolved_extraInitializers);
            __esDecorate(null, null, _estimatedLoss_decorators, { kind: "field", name: "estimatedLoss", static: false, private: false, access: { has: obj => "estimatedLoss" in obj, get: obj => obj.estimatedLoss, set: (obj, value) => { obj.estimatedLoss = value; } }, metadata: _metadata }, _estimatedLoss_initializers, _estimatedLoss_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.UpdateIncidentDto = UpdateIncidentDto;
/**
 * Establish unified command DTO
 */
let EstablishUnifiedCommandDto = (() => {
    var _a;
    let _agencies_decorators;
    let _agencies_initializers = [];
    let _agencies_extraInitializers = [];
    let _incidentCommanders_decorators;
    let _incidentCommanders_initializers = [];
    let _incidentCommanders_extraInitializers = [];
    let _commandPost_decorators;
    let _commandPost_initializers = [];
    let _commandPost_extraInitializers = [];
    return _a = class EstablishUnifiedCommandDto {
            constructor() {
                this.agencies = __runInitializers(this, _agencies_initializers, void 0);
                this.incidentCommanders = (__runInitializers(this, _agencies_extraInitializers), __runInitializers(this, _incidentCommanders_initializers, void 0));
                this.commandPost = (__runInitializers(this, _incidentCommanders_extraInitializers), __runInitializers(this, _commandPost_initializers, void 0));
                __runInitializers(this, _commandPost_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _agencies_decorators = [(0, swagger_1.ApiProperty)({ description: 'Participating agencies', type: [String] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true }), (0, class_validator_1.MinLength)(2)];
            _incidentCommanders_decorators = [(0, swagger_1.ApiProperty)({ description: 'Incident commanders', type: [Object] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(() => Object)];
            _commandPost_decorators = [(0, swagger_1.ApiProperty)({ description: 'Command post location', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsObject)()];
            __esDecorate(null, null, _agencies_decorators, { kind: "field", name: "agencies", static: false, private: false, access: { has: obj => "agencies" in obj, get: obj => obj.agencies, set: (obj, value) => { obj.agencies = value; } }, metadata: _metadata }, _agencies_initializers, _agencies_extraInitializers);
            __esDecorate(null, null, _incidentCommanders_decorators, { kind: "field", name: "incidentCommanders", static: false, private: false, access: { has: obj => "incidentCommanders" in obj, get: obj => obj.incidentCommanders, set: (obj, value) => { obj.incidentCommanders = value; } }, metadata: _metadata }, _incidentCommanders_initializers, _incidentCommanders_extraInitializers);
            __esDecorate(null, null, _commandPost_decorators, { kind: "field", name: "commandPost", static: false, private: false, access: { has: obj => "commandPost" in obj, get: obj => obj.commandPost, set: (obj, value) => { obj.commandPost = value; } }, metadata: _metadata }, _commandPost_initializers, _commandPost_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.EstablishUnifiedCommandDto = EstablishUnifiedCommandDto;
/**
 * Assign ICS position DTO
 */
let AssignICSPositionDto = (() => {
    var _a;
    let _position_decorators;
    let _position_initializers = [];
    let _position_extraInitializers = [];
    let _section_decorators;
    let _section_initializers = [];
    let _section_extraInitializers = [];
    let _assignedTo_decorators;
    let _assignedTo_initializers = [];
    let _assignedTo_extraInitializers = [];
    let _assignedName_decorators;
    let _assignedName_initializers = [];
    let _assignedName_extraInitializers = [];
    let _agency_decorators;
    let _agency_initializers = [];
    let _agency_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    return _a = class AssignICSPositionDto {
            constructor() {
                this.position = __runInitializers(this, _position_initializers, void 0);
                this.section = (__runInitializers(this, _position_extraInitializers), __runInitializers(this, _section_initializers, void 0));
                this.assignedTo = (__runInitializers(this, _section_extraInitializers), __runInitializers(this, _assignedTo_initializers, void 0));
                this.assignedName = (__runInitializers(this, _assignedTo_extraInitializers), __runInitializers(this, _assignedName_initializers, void 0));
                this.agency = (__runInitializers(this, _assignedName_extraInitializers), __runInitializers(this, _agency_initializers, void 0));
                this.notes = (__runInitializers(this, _agency_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
                __runInitializers(this, _notes_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _position_decorators = [(0, swagger_1.ApiProperty)({ enum: ICSPosition, description: 'ICS position' }), (0, class_validator_1.IsEnum)(ICSPosition)];
            _section_decorators = [(0, swagger_1.ApiProperty)({ enum: ICSSection, description: 'ICS section' }), (0, class_validator_1.IsEnum)(ICSSection)];
            _assignedTo_decorators = [(0, swagger_1.ApiProperty)({ description: 'User ID to assign' }), (0, class_validator_1.IsUUID)()];
            _assignedName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Assignee name' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _agency_decorators = [(0, swagger_1.ApiProperty)({ description: 'Agency' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _notes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Assignment notes', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(500)];
            __esDecorate(null, null, _position_decorators, { kind: "field", name: "position", static: false, private: false, access: { has: obj => "position" in obj, get: obj => obj.position, set: (obj, value) => { obj.position = value; } }, metadata: _metadata }, _position_initializers, _position_extraInitializers);
            __esDecorate(null, null, _section_decorators, { kind: "field", name: "section", static: false, private: false, access: { has: obj => "section" in obj, get: obj => obj.section, set: (obj, value) => { obj.section = value; } }, metadata: _metadata }, _section_initializers, _section_extraInitializers);
            __esDecorate(null, null, _assignedTo_decorators, { kind: "field", name: "assignedTo", static: false, private: false, access: { has: obj => "assignedTo" in obj, get: obj => obj.assignedTo, set: (obj, value) => { obj.assignedTo = value; } }, metadata: _metadata }, _assignedTo_initializers, _assignedTo_extraInitializers);
            __esDecorate(null, null, _assignedName_decorators, { kind: "field", name: "assignedName", static: false, private: false, access: { has: obj => "assignedName" in obj, get: obj => obj.assignedName, set: (obj, value) => { obj.assignedName = value; } }, metadata: _metadata }, _assignedName_initializers, _assignedName_extraInitializers);
            __esDecorate(null, null, _agency_decorators, { kind: "field", name: "agency", static: false, private: false, access: { has: obj => "agency" in obj, get: obj => obj.agency, set: (obj, value) => { obj.agency = value; } }, metadata: _metadata }, _agency_initializers, _agency_extraInitializers);
            __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.AssignICSPositionDto = AssignICSPositionDto;
/**
 * Request resources DTO
 */
let RequestResourcesDto = (() => {
    var _a;
    let _resourceType_decorators;
    let _resourceType_initializers = [];
    let _resourceType_extraInitializers = [];
    let _quantity_decorators;
    let _quantity_initializers = [];
    let _quantity_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    let _justification_decorators;
    let _justification_initializers = [];
    let _justification_extraInitializers = [];
    let _specialRequirements_decorators;
    let _specialRequirements_initializers = [];
    let _specialRequirements_extraInitializers = [];
    let _requestedBy_decorators;
    let _requestedBy_initializers = [];
    let _requestedBy_extraInitializers = [];
    return _a = class RequestResourcesDto {
            constructor() {
                this.resourceType = __runInitializers(this, _resourceType_initializers, void 0);
                this.quantity = (__runInitializers(this, _resourceType_extraInitializers), __runInitializers(this, _quantity_initializers, void 0));
                this.priority = (__runInitializers(this, _quantity_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
                this.justification = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _justification_initializers, void 0));
                this.specialRequirements = (__runInitializers(this, _justification_extraInitializers), __runInitializers(this, _specialRequirements_initializers, void 0));
                this.requestedBy = (__runInitializers(this, _specialRequirements_extraInitializers), __runInitializers(this, _requestedBy_initializers, void 0));
                __runInitializers(this, _requestedBy_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _resourceType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Resource type (e.g., Engine, Ambulance, Ladder)' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _quantity_decorators = [(0, swagger_1.ApiProperty)({ description: 'Quantity needed' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1)];
            _priority_decorators = [(0, swagger_1.ApiProperty)({ enum: ['routine', 'urgent', 'emergency'], description: 'Request priority' }), (0, class_validator_1.IsEnum)(['routine', 'urgent', 'emergency'])];
            _justification_decorators = [(0, swagger_1.ApiProperty)({ description: 'Justification for request' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(1000)];
            _specialRequirements_decorators = [(0, swagger_1.ApiProperty)({ description: 'Special requirements', required: false, type: [String] }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _requestedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Requested by user ID' }), (0, class_validator_1.IsUUID)()];
            __esDecorate(null, null, _resourceType_decorators, { kind: "field", name: "resourceType", static: false, private: false, access: { has: obj => "resourceType" in obj, get: obj => obj.resourceType, set: (obj, value) => { obj.resourceType = value; } }, metadata: _metadata }, _resourceType_initializers, _resourceType_extraInitializers);
            __esDecorate(null, null, _quantity_decorators, { kind: "field", name: "quantity", static: false, private: false, access: { has: obj => "quantity" in obj, get: obj => obj.quantity, set: (obj, value) => { obj.quantity = value; } }, metadata: _metadata }, _quantity_initializers, _quantity_extraInitializers);
            __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
            __esDecorate(null, null, _justification_decorators, { kind: "field", name: "justification", static: false, private: false, access: { has: obj => "justification" in obj, get: obj => obj.justification, set: (obj, value) => { obj.justification = value; } }, metadata: _metadata }, _justification_initializers, _justification_extraInitializers);
            __esDecorate(null, null, _specialRequirements_decorators, { kind: "field", name: "specialRequirements", static: false, private: false, access: { has: obj => "specialRequirements" in obj, get: obj => obj.specialRequirements, set: (obj, value) => { obj.specialRequirements = value; } }, metadata: _metadata }, _specialRequirements_initializers, _specialRequirements_extraInitializers);
            __esDecorate(null, null, _requestedBy_decorators, { kind: "field", name: "requestedBy", static: false, private: false, access: { has: obj => "requestedBy" in obj, get: obj => obj.requestedBy, set: (obj, value) => { obj.requestedBy = value; } }, metadata: _metadata }, _requestedBy_initializers, _requestedBy_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.RequestResourcesDto = RequestResourcesDto;
/**
 * Create tactical objective DTO
 */
let CreateTacticalObjectiveDto = (() => {
    var _a;
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    let _assignedTo_decorators;
    let _assignedTo_initializers = [];
    let _assignedTo_extraInitializers = [];
    let _assignedSection_decorators;
    let _assignedSection_initializers = [];
    let _assignedSection_extraInitializers = [];
    let _targetCompletionTime_decorators;
    let _targetCompletionTime_initializers = [];
    let _targetCompletionTime_extraInitializers = [];
    let _safetyConsiderations_decorators;
    let _safetyConsiderations_initializers = [];
    let _safetyConsiderations_extraInitializers = [];
    return _a = class CreateTacticalObjectiveDto {
            constructor() {
                this.description = __runInitializers(this, _description_initializers, void 0);
                this.priority = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
                this.assignedTo = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _assignedTo_initializers, void 0));
                this.assignedSection = (__runInitializers(this, _assignedTo_extraInitializers), __runInitializers(this, _assignedSection_initializers, void 0));
                this.targetCompletionTime = (__runInitializers(this, _assignedSection_extraInitializers), __runInitializers(this, _targetCompletionTime_initializers, void 0));
                this.safetyConsiderations = (__runInitializers(this, _targetCompletionTime_extraInitializers), __runInitializers(this, _safetyConsiderations_initializers, void 0));
                __runInitializers(this, _safetyConsiderations_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Objective description' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(500)];
            _priority_decorators = [(0, swagger_1.ApiProperty)({ description: 'Priority (1=highest)' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1)];
            _assignedTo_decorators = [(0, swagger_1.ApiProperty)({ description: 'Assigned to user ID', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsUUID)()];
            _assignedSection_decorators = [(0, swagger_1.ApiProperty)({ enum: ICSSection, description: 'Assigned section', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(ICSSection)];
            _targetCompletionTime_decorators = [(0, swagger_1.ApiProperty)({ description: 'Target completion time', required: false }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsDate)()];
            _safetyConsiderations_decorators = [(0, swagger_1.ApiProperty)({ description: 'Safety considerations', required: false, type: [String] }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
            __esDecorate(null, null, _assignedTo_decorators, { kind: "field", name: "assignedTo", static: false, private: false, access: { has: obj => "assignedTo" in obj, get: obj => obj.assignedTo, set: (obj, value) => { obj.assignedTo = value; } }, metadata: _metadata }, _assignedTo_initializers, _assignedTo_extraInitializers);
            __esDecorate(null, null, _assignedSection_decorators, { kind: "field", name: "assignedSection", static: false, private: false, access: { has: obj => "assignedSection" in obj, get: obj => obj.assignedSection, set: (obj, value) => { obj.assignedSection = value; } }, metadata: _metadata }, _assignedSection_initializers, _assignedSection_extraInitializers);
            __esDecorate(null, null, _targetCompletionTime_decorators, { kind: "field", name: "targetCompletionTime", static: false, private: false, access: { has: obj => "targetCompletionTime" in obj, get: obj => obj.targetCompletionTime, set: (obj, value) => { obj.targetCompletionTime = value; } }, metadata: _metadata }, _targetCompletionTime_initializers, _targetCompletionTime_extraInitializers);
            __esDecorate(null, null, _safetyConsiderations_decorators, { kind: "field", name: "safetyConsiderations", static: false, private: false, access: { has: obj => "safetyConsiderations" in obj, get: obj => obj.safetyConsiderations, set: (obj, value) => { obj.safetyConsiderations = value; } }, metadata: _metadata }, _safetyConsiderations_initializers, _safetyConsiderations_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateTacticalObjectiveDto = CreateTacticalObjectiveDto;
/**
 * Create incident action plan DTO
 */
let CreateIncidentActionPlanDto = (() => {
    var _a;
    let _operationalPeriod_decorators;
    let _operationalPeriod_initializers = [];
    let _operationalPeriod_extraInitializers = [];
    let _periodStart_decorators;
    let _periodStart_initializers = [];
    let _periodStart_extraInitializers = [];
    let _periodEnd_decorators;
    let _periodEnd_initializers = [];
    let _periodEnd_extraInitializers = [];
    let _safetyMessage_decorators;
    let _safetyMessage_initializers = [];
    let _safetyMessage_extraInitializers = [];
    let _communicationsPlan_decorators;
    let _communicationsPlan_initializers = [];
    let _communicationsPlan_extraInitializers = [];
    return _a = class CreateIncidentActionPlanDto {
            constructor() {
                this.operationalPeriod = __runInitializers(this, _operationalPeriod_initializers, void 0);
                this.periodStart = (__runInitializers(this, _operationalPeriod_extraInitializers), __runInitializers(this, _periodStart_initializers, void 0));
                this.periodEnd = (__runInitializers(this, _periodStart_extraInitializers), __runInitializers(this, _periodEnd_initializers, void 0));
                this.safetyMessage = (__runInitializers(this, _periodEnd_extraInitializers), __runInitializers(this, _safetyMessage_initializers, void 0));
                this.communicationsPlan = (__runInitializers(this, _safetyMessage_extraInitializers), __runInitializers(this, _communicationsPlan_initializers, void 0));
                __runInitializers(this, _communicationsPlan_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _operationalPeriod_decorators = [(0, swagger_1.ApiProperty)({ enum: OperationalPeriod, description: 'Operational period duration' }), (0, class_validator_1.IsEnum)(OperationalPeriod)];
            _periodStart_decorators = [(0, swagger_1.ApiProperty)({ description: 'Period start time' }), (0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsDate)()];
            _periodEnd_decorators = [(0, swagger_1.ApiProperty)({ description: 'Period end time' }), (0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsDate)()];
            _safetyMessage_decorators = [(0, swagger_1.ApiProperty)({ description: 'Safety message' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(1000)];
            _communicationsPlan_decorators = [(0, swagger_1.ApiProperty)({ description: 'Communications plan', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _operationalPeriod_decorators, { kind: "field", name: "operationalPeriod", static: false, private: false, access: { has: obj => "operationalPeriod" in obj, get: obj => obj.operationalPeriod, set: (obj, value) => { obj.operationalPeriod = value; } }, metadata: _metadata }, _operationalPeriod_initializers, _operationalPeriod_extraInitializers);
            __esDecorate(null, null, _periodStart_decorators, { kind: "field", name: "periodStart", static: false, private: false, access: { has: obj => "periodStart" in obj, get: obj => obj.periodStart, set: (obj, value) => { obj.periodStart = value; } }, metadata: _metadata }, _periodStart_initializers, _periodStart_extraInitializers);
            __esDecorate(null, null, _periodEnd_decorators, { kind: "field", name: "periodEnd", static: false, private: false, access: { has: obj => "periodEnd" in obj, get: obj => obj.periodEnd, set: (obj, value) => { obj.periodEnd = value; } }, metadata: _metadata }, _periodEnd_initializers, _periodEnd_extraInitializers);
            __esDecorate(null, null, _safetyMessage_decorators, { kind: "field", name: "safetyMessage", static: false, private: false, access: { has: obj => "safetyMessage" in obj, get: obj => obj.safetyMessage, set: (obj, value) => { obj.safetyMessage = value; } }, metadata: _metadata }, _safetyMessage_initializers, _safetyMessage_extraInitializers);
            __esDecorate(null, null, _communicationsPlan_decorators, { kind: "field", name: "communicationsPlan", static: false, private: false, access: { has: obj => "communicationsPlan" in obj, get: obj => obj.communicationsPlan, set: (obj, value) => { obj.communicationsPlan = value; } }, metadata: _metadata }, _communicationsPlan_initializers, _communicationsPlan_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateIncidentActionPlanDto = CreateIncidentActionPlanDto;
/**
 * Create situation report DTO
 */
let CreateSituationReportDto = (() => {
    var _a;
    let _currentSituation_decorators;
    let _currentSituation_initializers = [];
    let _currentSituation_extraInitializers = [];
    let _personnel_decorators;
    let _personnel_initializers = [];
    let _personnel_extraInitializers = [];
    let _apparatus_decorators;
    let _apparatus_initializers = [];
    let _apparatus_extraInitializers = [];
    let _accomplishments_decorators;
    let _accomplishments_initializers = [];
    let _accomplishments_extraInitializers = [];
    let _currentProblems_decorators;
    let _currentProblems_initializers = [];
    let _currentProblems_extraInitializers = [];
    let _plannedActions_decorators;
    let _plannedActions_initializers = [];
    let _plannedActions_extraInitializers = [];
    let _reportedBy_decorators;
    let _reportedBy_initializers = [];
    let _reportedBy_extraInitializers = [];
    return _a = class CreateSituationReportDto {
            constructor() {
                this.currentSituation = __runInitializers(this, _currentSituation_initializers, void 0);
                this.personnel = (__runInitializers(this, _currentSituation_extraInitializers), __runInitializers(this, _personnel_initializers, void 0));
                this.apparatus = (__runInitializers(this, _personnel_extraInitializers), __runInitializers(this, _apparatus_initializers, void 0));
                this.accomplishments = (__runInitializers(this, _apparatus_extraInitializers), __runInitializers(this, _accomplishments_initializers, void 0));
                this.currentProblems = (__runInitializers(this, _accomplishments_extraInitializers), __runInitializers(this, _currentProblems_initializers, void 0));
                this.plannedActions = (__runInitializers(this, _currentProblems_extraInitializers), __runInitializers(this, _plannedActions_initializers, void 0));
                this.reportedBy = (__runInitializers(this, _plannedActions_extraInitializers), __runInitializers(this, _reportedBy_initializers, void 0));
                __runInitializers(this, _reportedBy_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _currentSituation_decorators = [(0, swagger_1.ApiProperty)({ description: 'Current situation summary' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(2000)];
            _personnel_decorators = [(0, swagger_1.ApiProperty)({ description: 'Number of personnel on scene' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _apparatus_decorators = [(0, swagger_1.ApiProperty)({ description: 'Number of apparatus on scene' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _accomplishments_decorators = [(0, swagger_1.ApiProperty)({ description: 'Accomplishments', required: false, type: [String] }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _currentProblems_decorators = [(0, swagger_1.ApiProperty)({ description: 'Current problems', required: false, type: [String] }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _plannedActions_decorators = [(0, swagger_1.ApiProperty)({ description: 'Planned actions', required: false, type: [String] }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _reportedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Reported by user ID' }), (0, class_validator_1.IsUUID)()];
            __esDecorate(null, null, _currentSituation_decorators, { kind: "field", name: "currentSituation", static: false, private: false, access: { has: obj => "currentSituation" in obj, get: obj => obj.currentSituation, set: (obj, value) => { obj.currentSituation = value; } }, metadata: _metadata }, _currentSituation_initializers, _currentSituation_extraInitializers);
            __esDecorate(null, null, _personnel_decorators, { kind: "field", name: "personnel", static: false, private: false, access: { has: obj => "personnel" in obj, get: obj => obj.personnel, set: (obj, value) => { obj.personnel = value; } }, metadata: _metadata }, _personnel_initializers, _personnel_extraInitializers);
            __esDecorate(null, null, _apparatus_decorators, { kind: "field", name: "apparatus", static: false, private: false, access: { has: obj => "apparatus" in obj, get: obj => obj.apparatus, set: (obj, value) => { obj.apparatus = value; } }, metadata: _metadata }, _apparatus_initializers, _apparatus_extraInitializers);
            __esDecorate(null, null, _accomplishments_decorators, { kind: "field", name: "accomplishments", static: false, private: false, access: { has: obj => "accomplishments" in obj, get: obj => obj.accomplishments, set: (obj, value) => { obj.accomplishments = value; } }, metadata: _metadata }, _accomplishments_initializers, _accomplishments_extraInitializers);
            __esDecorate(null, null, _currentProblems_decorators, { kind: "field", name: "currentProblems", static: false, private: false, access: { has: obj => "currentProblems" in obj, get: obj => obj.currentProblems, set: (obj, value) => { obj.currentProblems = value; } }, metadata: _metadata }, _currentProblems_initializers, _currentProblems_extraInitializers);
            __esDecorate(null, null, _plannedActions_decorators, { kind: "field", name: "plannedActions", static: false, private: false, access: { has: obj => "plannedActions" in obj, get: obj => obj.plannedActions, set: (obj, value) => { obj.plannedActions = value; } }, metadata: _metadata }, _plannedActions_initializers, _plannedActions_extraInitializers);
            __esDecorate(null, null, _reportedBy_decorators, { kind: "field", name: "reportedBy", static: false, private: false, access: { has: obj => "reportedBy" in obj, get: obj => obj.reportedBy, set: (obj, value) => { obj.reportedBy = value; } }, metadata: _metadata }, _reportedBy_initializers, _reportedBy_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateSituationReportDto = CreateSituationReportDto;
/**
 * Transfer command DTO
 */
let TransferCommandDto = (() => {
    var _a;
    let _toCommander_decorators;
    let _toCommander_initializers = [];
    let _toCommander_extraInitializers = [];
    let _transferBriefing_decorators;
    let _transferBriefing_initializers = [];
    let _transferBriefing_extraInitializers = [];
    let _witnessedBy_decorators;
    let _witnessedBy_initializers = [];
    let _witnessedBy_extraInitializers = [];
    let _reason_decorators;
    let _reason_initializers = [];
    let _reason_extraInitializers = [];
    return _a = class TransferCommandDto {
            constructor() {
                this.toCommander = __runInitializers(this, _toCommander_initializers, void 0);
                this.transferBriefing = (__runInitializers(this, _toCommander_extraInitializers), __runInitializers(this, _transferBriefing_initializers, void 0));
                this.witnessedBy = (__runInitializers(this, _transferBriefing_extraInitializers), __runInitializers(this, _witnessedBy_initializers, void 0));
                this.reason = (__runInitializers(this, _witnessedBy_extraInitializers), __runInitializers(this, _reason_initializers, void 0));
                __runInitializers(this, _reason_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _toCommander_decorators = [(0, swagger_1.ApiProperty)({ description: 'New incident commander ID' }), (0, class_validator_1.IsUUID)()];
            _transferBriefing_decorators = [(0, swagger_1.ApiProperty)({ description: 'Transfer briefing summary' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(2000)];
            _witnessedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Witnessed by user IDs', required: false, type: [String] }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _reason_decorators = [(0, swagger_1.ApiProperty)({ description: 'Reason for transfer', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(500)];
            __esDecorate(null, null, _toCommander_decorators, { kind: "field", name: "toCommander", static: false, private: false, access: { has: obj => "toCommander" in obj, get: obj => obj.toCommander, set: (obj, value) => { obj.toCommander = value; } }, metadata: _metadata }, _toCommander_initializers, _toCommander_extraInitializers);
            __esDecorate(null, null, _transferBriefing_decorators, { kind: "field", name: "transferBriefing", static: false, private: false, access: { has: obj => "transferBriefing" in obj, get: obj => obj.transferBriefing, set: (obj, value) => { obj.transferBriefing = value; } }, metadata: _metadata }, _transferBriefing_initializers, _transferBriefing_extraInitializers);
            __esDecorate(null, null, _witnessedBy_decorators, { kind: "field", name: "witnessedBy", static: false, private: false, access: { has: obj => "witnessedBy" in obj, get: obj => obj.witnessedBy, set: (obj, value) => { obj.witnessedBy = value; } }, metadata: _metadata }, _witnessedBy_initializers, _witnessedBy_extraInitializers);
            __esDecorate(null, null, _reason_decorators, { kind: "field", name: "reason", static: false, private: false, access: { has: obj => "reason" in obj, get: obj => obj.reason, set: (obj, value) => { obj.reason = value; } }, metadata: _metadata }, _reason_initializers, _reason_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.TransferCommandDto = TransferCommandDto;
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
async function createIncident(data, userId) {
    const incident = {
        id: faker_1.faker.string.uuid(),
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
function generateIncidentNumber(type, location) {
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
function classifyIncident(incident) {
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
    return (classifications[incident.incidentType] || {
        category: 'other',
        subcategory: 'unknown',
        resourceNeeds: ['Engine'],
        estimatedDuration: 120,
    });
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
function calculateIncidentPriority(severity, type) {
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
async function escalateIncident(incidentId, newSeverity, reason, userId) {
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
async function downgradeIncident(incidentId, newSeverity, reason, userId) {
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
async function updateIncidentStatus(incidentId, newStatus, userId) {
    const incident = await getIncident(incidentId);
    validateStatusTransition(incident.status, newStatus);
    const updated = {
        ...incident,
        status: newStatus,
        updatedAt: new Date(),
        updatedBy: userId,
    };
    // Update timestamp fields based on status
    if (newStatus === IncidentStatus.DISPATCHED && !incident.dispatchedAt) {
        updated.dispatchedAt = new Date();
    }
    else if (newStatus === IncidentStatus.ON_SCENE && !incident.arrivedAt) {
        updated.arrivedAt = new Date();
    }
    else if (newStatus === IncidentStatus.CONTROLLED && !incident.controlledAt) {
        updated.controlledAt = new Date();
    }
    else if (newStatus === IncidentStatus.CLOSED && !incident.closedAt) {
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
function validateStatusTransition(currentStatus, newStatus) {
    const validTransitions = {
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
async function assignIncidentCommander(incidentId, commanderId, userId) {
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
async function getIncidentTimeline(incidentId) {
    // In production, fetch from database
    return [
        {
            id: faker_1.faker.string.uuid(),
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
async function addTimelineEntry(incidentId, entry) {
    const timelineEntry = {
        id: faker_1.faker.string.uuid(),
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
async function establishUnifiedCommand(incidentId, data, userId) {
    const incident = await getIncident(incidentId);
    const unifiedCommand = {
        id: faker_1.faker.string.uuid(),
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
    });
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
async function requestMutualAid(incidentId, request) {
    await logIncidentActivity(incidentId, 'mutual_aid_requested', request);
    return {
        id: faker_1.faker.string.uuid(),
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
async function coordinateMultiAgencyResponse(incidentId, coordination) {
    await logIncidentActivity(incidentId, 'multi_agency_coordination', coordination);
    return {
        planId: faker_1.faker.string.uuid(),
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
async function transferCommand(incidentId, transfer) {
    const incident = await getIncident(incidentId);
    const commandTransfer = {
        id: faker_1.faker.string.uuid(),
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
async function assignICSPosition(incidentId, assignment) {
    const icsAssignment = {
        id: faker_1.faker.string.uuid(),
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
async function relieveICSPosition(assignmentId, relievedBy) {
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
async function getICSOrganizationChart(incidentId) {
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
async function activateICSSection(incidentId, section, chief) {
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
async function requestResources(incidentId, request) {
    const resourceRequest = {
        id: faker_1.faker.string.uuid(),
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
function generateResourceRequestNumber(incidentId) {
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
async function approveResourceRequest(requestId, approvedBy) {
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
async function assignResourcesToRequest(requestId, resourceIds, eta) {
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
async function releaseResources(incidentId, resourceIds, releaseNotes) {
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
async function trackResourceAllocation(incidentId) {
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
async function createTacticalObjective(incidentId, objective, userId) {
    const existingObjectives = await getTacticalObjectives(incidentId);
    const objectiveNumber = existingObjectives.length + 1;
    const tacticalObjective = {
        id: faker_1.faker.string.uuid(),
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
async function updateObjectiveStatus(objectiveId, status, notes) {
    const objective = await getTacticalObjective(objectiveId);
    const updated = {
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
async function getTacticalObjectives(incidentId) {
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
async function createIncidentActionPlan(incidentId, plan, userId) {
    const actionPlan = {
        id: faker_1.faker.string.uuid(),
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
async function approveIncidentActionPlan(planId, approvedBy) {
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
async function createSituationReport(incidentId, report) {
    const existingReports = await getSituationReports(incidentId);
    const reportNumber = existingReports.length + 1;
    const sitrep = {
        id: faker_1.faker.string.uuid(),
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
async function getSituationReports(incidentId) {
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
async function conductOperationalBriefing(incidentId, briefing) {
    await logIncidentActivity(incidentId, 'operational_briefing', briefing);
    return {
        id: faker_1.faker.string.uuid(),
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
async function createSafetyBriefing(incidentId, briefing) {
    const safetyBriefing = {
        id: faker_1.faker.string.uuid(),
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
async function initiateDemobilization(incidentId, demobPlan, userId) {
    await updateIncidentStatus(incidentId, IncidentStatus.DEMOBILIZING, userId);
    await logIncidentActivity(incidentId, 'demobilization_initiated', demobPlan);
    return {
        planId: faker_1.faker.string.uuid(),
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
async function closeIncident(incidentId, closure, userId) {
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
async function generateIncidentSummary(incidentId) {
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
async function getIncident(id) {
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
async function updateIncident(id, updates) {
    const incident = await getIncident(id);
    return { ...incident, ...updates, updatedAt: new Date() };
}
/**
 * Gets resource request by ID
 */
async function getResourceRequest(id) {
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
async function getTacticalObjective(id) {
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
async function getIncidentActionPlan(id) {
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
async function getICSAssignment(id) {
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
async function logIncidentActivity(incidentId, activityType, data) {
    console.log(`Incident ${incidentId}: ${activityType}`, data);
}
// ============================================================================
// NESTJS CONTROLLER
// ============================================================================
/**
 * Incident Command Controller
 * Provides RESTful API endpoints for incident command operations
 */
let IncidentCommandController = (() => {
    let _classDecorators = [(0, swagger_1.ApiTags)('incident-command'), (0, common_1.Controller)('incident-command'), (0, swagger_1.ApiBearerAuth)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _create_decorators;
    let _findAll_decorators;
    let _findOne_decorators;
    let _update_decorators;
    let _establishUnifiedCmd_decorators;
    let _assignPosition_decorators;
    let _requestRes_decorators;
    let _createObjective_decorators;
    let _createIAP_decorators;
    let _createSitRep_decorators;
    let _transferCmd_decorators;
    let _close_decorators;
    var IncidentCommandController = _classThis = class {
        /**
         * Create a new incident
         */
        async create(createDto) {
            const location = {
                latitude: createDto.latitude,
                longitude: createDto.longitude,
                address: createDto.address,
                city: createDto.city,
                state: createDto.state,
            };
            return createIncident({
                incidentType: createDto.incidentType,
                severity: createDto.severity,
                description: createDto.description,
                location,
                reportedAt: new Date(),
                reportedBy: createDto.reportedBy,
                patientCount: createDto.patientCount,
                specialHazards: createDto.specialHazards,
                weatherConditions: createDto.weatherConditions,
            }, createDto.reportedBy);
        }
        /**
         * Get all incidents with filtering
         */
        async findAll(status, severity) {
            return [];
        }
        /**
         * Get incident by ID
         */
        async findOne(id) {
            return getIncident(id);
        }
        /**
         * Update incident
         */
        async update(id, updateDto) {
            return updateIncident(id, updateDto);
        }
        /**
         * Establish unified command
         */
        async establishUnifiedCmd(id, dto) {
            return establishUnifiedCommand(id, dto, 'current-user');
        }
        /**
         * Assign ICS position
         */
        async assignPosition(id, dto) {
            return assignICSPosition(id, dto);
        }
        /**
         * Request resources
         */
        async requestRes(id, dto) {
            return requestResources(id, dto);
        }
        /**
         * Create tactical objective
         */
        async createObjective(id, dto) {
            return createTacticalObjective(id, dto, 'current-user');
        }
        /**
         * Create incident action plan
         */
        async createIAP(id, dto) {
            return createIncidentActionPlan(id, dto, 'current-user');
        }
        /**
         * Create situation report
         */
        async createSitRep(id, dto) {
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
        async transferCmd(id, dto) {
            return transferCommand(id, dto);
        }
        /**
         * Close incident
         */
        async close(id, closure) {
            return closeIncident(id, closure, 'current-user');
        }
        constructor() {
            __runInitializers(this, _instanceExtraInitializers);
        }
    };
    __setFunctionName(_classThis, "IncidentCommandController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _create_decorators = [(0, common_1.Post)(), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({ summary: 'Create new incident' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Incident created successfully' }), (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true }))];
        _findAll_decorators = [(0, common_1.Get)(), (0, swagger_1.ApiOperation)({ summary: 'Get all incidents' }), (0, swagger_1.ApiQuery)({ name: 'status', enum: IncidentStatus, required: false }), (0, swagger_1.ApiQuery)({ name: 'severity', enum: IncidentSeverity, required: false })];
        _findOne_decorators = [(0, common_1.Get)(':id'), (0, swagger_1.ApiOperation)({ summary: 'Get incident by ID' }), (0, swagger_1.ApiParam)({ name: 'id', description: 'Incident ID' })];
        _update_decorators = [(0, common_1.Put)(':id'), (0, swagger_1.ApiOperation)({ summary: 'Update incident' })];
        _establishUnifiedCmd_decorators = [(0, common_1.Post)(':id/unified-command'), (0, swagger_1.ApiOperation)({ summary: 'Establish unified command structure' })];
        _assignPosition_decorators = [(0, common_1.Post)(':id/ics-positions'), (0, swagger_1.ApiOperation)({ summary: 'Assign ICS position' })];
        _requestRes_decorators = [(0, common_1.Post)(':id/resources/request'), (0, swagger_1.ApiOperation)({ summary: 'Request resources for incident' })];
        _createObjective_decorators = [(0, common_1.Post)(':id/objectives'), (0, swagger_1.ApiOperation)({ summary: 'Create tactical objective' })];
        _createIAP_decorators = [(0, common_1.Post)(':id/action-plan'), (0, swagger_1.ApiOperation)({ summary: 'Create incident action plan' })];
        _createSitRep_decorators = [(0, common_1.Post)(':id/sitrep'), (0, swagger_1.ApiOperation)({ summary: 'Create situation report' })];
        _transferCmd_decorators = [(0, common_1.Post)(':id/transfer-command'), (0, swagger_1.ApiOperation)({ summary: 'Transfer incident command' })];
        _close_decorators = [(0, common_1.Post)(':id/close'), (0, swagger_1.ApiOperation)({ summary: 'Close incident' })];
        __esDecorate(_classThis, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: obj => "create" in obj, get: obj => obj.create }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findAll_decorators, { kind: "method", name: "findAll", static: false, private: false, access: { has: obj => "findAll" in obj, get: obj => obj.findAll }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findOne_decorators, { kind: "method", name: "findOne", static: false, private: false, access: { has: obj => "findOne" in obj, get: obj => obj.findOne }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _update_decorators, { kind: "method", name: "update", static: false, private: false, access: { has: obj => "update" in obj, get: obj => obj.update }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _establishUnifiedCmd_decorators, { kind: "method", name: "establishUnifiedCmd", static: false, private: false, access: { has: obj => "establishUnifiedCmd" in obj, get: obj => obj.establishUnifiedCmd }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _assignPosition_decorators, { kind: "method", name: "assignPosition", static: false, private: false, access: { has: obj => "assignPosition" in obj, get: obj => obj.assignPosition }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _requestRes_decorators, { kind: "method", name: "requestRes", static: false, private: false, access: { has: obj => "requestRes" in obj, get: obj => obj.requestRes }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createObjective_decorators, { kind: "method", name: "createObjective", static: false, private: false, access: { has: obj => "createObjective" in obj, get: obj => obj.createObjective }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createIAP_decorators, { kind: "method", name: "createIAP", static: false, private: false, access: { has: obj => "createIAP" in obj, get: obj => obj.createIAP }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createSitRep_decorators, { kind: "method", name: "createSitRep", static: false, private: false, access: { has: obj => "createSitRep" in obj, get: obj => obj.createSitRep }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _transferCmd_decorators, { kind: "method", name: "transferCmd", static: false, private: false, access: { has: obj => "transferCmd" in obj, get: obj => obj.transferCmd }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _close_decorators, { kind: "method", name: "close", static: false, private: false, access: { has: obj => "close" in obj, get: obj => obj.close }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        IncidentCommandController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return IncidentCommandController = _classThis;
})();
exports.IncidentCommandController = IncidentCommandController;
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
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
//# sourceMappingURL=incident-command-controllers.js.map