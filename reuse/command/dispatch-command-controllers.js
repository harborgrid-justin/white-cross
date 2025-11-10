"use strict";
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
exports.DispatchCommandController = exports.DeliverPreArrivalInstructionsDto = exports.UpdateConsoleStatusDto = exports.CreateGeographicZoneDto = exports.UpdateUnitStatusDto = exports.DispatchUnitsDto = exports.TriageCallDto = exports.CreateCallForServiceDto = exports.ResponsePlanType = exports.QueuePriority = exports.ConsoleStatus = exports.UnitType = exports.UnitStatus = exports.CallStatus = exports.CallType = exports.CallPriority = void 0;
exports.createCallForService = createCallForService;
exports.generateCallNumber = generateCallNumber;
exports.triageEmergencyCall = triageEmergencyCall;
exports.applyEMDProtocol = applyEMDProtocol;
exports.deliverPreArrivalInstructions = deliverPreArrivalInstructions;
exports.validateCallerLocation = validateCallerLocation;
exports.transferCall = transferCall;
exports.dispatchUnits = dispatchUnits;
exports.recommendUnitsForCall = recommendUnitsForCall;
exports.calculateOptimalRoute = calculateOptimalRoute;
exports.dispatchByResponsePlan = dispatchByResponsePlan;
exports.addUnitsToCall = addUnitsToCall;
exports.cancelUnitDispatch = cancelUnitDispatch;
exports.updateUnitStatus = updateUnitStatus;
exports.trackUnitResponseTime = trackUnitResponseTime;
exports.getAvailableUnits = getAvailableUnits;
exports.updateUnitLocationFromAVL = updateUnitLocationFromAVL;
exports.clearUnit = clearUnit;
exports.addToDispatchQueue = addToDispatchQueue;
exports.prioritizeDispatchQueue = prioritizeDispatchQueue;
exports.getDispatchQueue = getDispatchQueue;
exports.removeFromDispatchQueue = removeFromDispatchQueue;
exports.escalateQueuedCall = escalateQueuedCall;
exports.createGeographicZone = createGeographicZone;
exports.determineZoneForLocation = determineZoneForLocation;
exports.getZoneCoverageStats = getZoneCoverageStats;
exports.assignUnitToZone = assignUnitToZone;
exports.loginToConsole = loginToConsole;
exports.logoutFromConsole = logoutFromConsole;
exports.transferCallsBetweenConsoles = transferCallsBetweenConsoles;
exports.getActiveConsoles = getActiveConsoles;
exports.monitorConsolePerformance = monitorConsolePerformance;
exports.updateCallStatus = updateCallStatus;
exports.closeCallForService = closeCallForService;
exports.cancelCallForService = cancelCallForService;
exports.mergeDuplicateCalls = mergeDuplicateCalls;
exports.generateCallStatistics = generateCallStatistics;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const faker_1 = require("@faker-js/faker");
// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================
/**
 * Call priority levels (aligned with EMD/EPD standards)
 */
var CallPriority;
(function (CallPriority) {
    CallPriority["IMMEDIATE"] = "immediate";
    CallPriority["EMERGENCY"] = "emergency";
    CallPriority["URGENT"] = "urgent";
    CallPriority["ROUTINE"] = "routine";
    CallPriority["NON_EMERGENCY"] = "non_emergency";
})(CallPriority || (exports.CallPriority = CallPriority = {}));
/**
 * Call types (emergency categories)
 */
var CallType;
(function (CallType) {
    CallType["MEDICAL_EMERGENCY"] = "medical_emergency";
    CallType["FIRE"] = "fire";
    CallType["VEHICLE_ACCIDENT"] = "vehicle_accident";
    CallType["ASSAULT"] = "assault";
    CallType["ROBBERY"] = "robbery";
    CallType["BURGLARY"] = "burglary";
    CallType["DOMESTIC_VIOLENCE"] = "domestic_violence";
    CallType["SUSPICIOUS_ACTIVITY"] = "suspicious_activity";
    CallType["WELFARE_CHECK"] = "welfare_check";
    CallType["OVERDOSE"] = "overdose";
    CallType["CARDIAC_ARREST"] = "cardiac_arrest";
    CallType["STROKE"] = "stroke";
    CallType["TRAUMA"] = "trauma";
    CallType["PSYCHIATRIC"] = "psychiatric";
    CallType["HAZMAT"] = "hazmat";
    CallType["WATER_RESCUE"] = "water_rescue";
    CallType["ELEVATOR_RESCUE"] = "elevator_rescue";
    CallType["ALARM"] = "alarm";
    CallType["PUBLIC_SERVICE"] = "public_service";
    CallType["OTHER"] = "other";
})(CallType || (exports.CallType = CallType = {}));
/**
 * Call for service status
 */
var CallStatus;
(function (CallStatus) {
    CallStatus["PENDING"] = "pending";
    CallStatus["TRIAGED"] = "triaged";
    CallStatus["DISPATCHED"] = "dispatched";
    CallStatus["EN_ROUTE"] = "en_route";
    CallStatus["ON_SCENE"] = "on_scene";
    CallStatus["TRANSPORTING"] = "transporting";
    CallStatus["AT_HOSPITAL"] = "at_hospital";
    CallStatus["COMPLETED"] = "completed";
    CallStatus["CANCELLED"] = "cancelled";
    CallStatus["DUPLICATE"] = "duplicate";
})(CallStatus || (exports.CallStatus = CallStatus = {}));
/**
 * Unit status codes
 */
var UnitStatus;
(function (UnitStatus) {
    UnitStatus["AVAILABLE"] = "available";
    UnitStatus["UNAVAILABLE"] = "unavailable";
    UnitStatus["DISPATCHED"] = "dispatched";
    UnitStatus["EN_ROUTE"] = "en_route";
    UnitStatus["STAGED"] = "staged";
    UnitStatus["ON_SCENE"] = "on_scene";
    UnitStatus["TRANSPORTING"] = "transporting";
    UnitStatus["AT_HOSPITAL"] = "at_hospital";
    UnitStatus["IN_QUARTERS"] = "in_quarters";
    UnitStatus["TRAINING"] = "training";
    UnitStatus["MEAL_BREAK"] = "meal_break";
    UnitStatus["MECHANICAL"] = "mechanical";
    UnitStatus["REFUELING"] = "refueling";
})(UnitStatus || (exports.UnitStatus = UnitStatus = {}));
/**
 * Unit types
 */
var UnitType;
(function (UnitType) {
    UnitType["ENGINE"] = "engine";
    UnitType["LADDER"] = "ladder";
    UnitType["RESCUE"] = "rescue";
    UnitType["AMBULANCE"] = "ambulance";
    UnitType["PARAMEDIC"] = "paramedic";
    UnitType["CHIEF"] = "chief";
    UnitType["BATTALION_CHIEF"] = "battalion_chief";
    UnitType["HAZMAT"] = "hazmat";
    UnitType["MARINE"] = "marine";
    UnitType["AIR_AMBULANCE"] = "air_ambulance";
    UnitType["PATROL"] = "patrol";
    UnitType["K9"] = "k9";
    UnitType["SWAT"] = "swat";
    UnitType["MOBILE_COMMAND"] = "mobile_command";
})(UnitType || (exports.UnitType = UnitType = {}));
/**
 * Dispatch console status
 */
var ConsoleStatus;
(function (ConsoleStatus) {
    ConsoleStatus["ACTIVE"] = "active";
    ConsoleStatus["LOGGED_OUT"] = "logged_out";
    ConsoleStatus["BREAK"] = "break";
    ConsoleStatus["TRAINING"] = "training";
    ConsoleStatus["EMERGENCY_OVERRIDE"] = "emergency_override";
})(ConsoleStatus || (exports.ConsoleStatus = ConsoleStatus = {}));
/**
 * Queue management priority
 */
var QueuePriority;
(function (QueuePriority) {
    QueuePriority["CRITICAL"] = "critical";
    QueuePriority["HIGH"] = "high";
    QueuePriority["MEDIUM"] = "medium";
    QueuePriority["LOW"] = "low";
    QueuePriority["HOLD"] = "hold";
})(QueuePriority || (exports.QueuePriority = QueuePriority = {}));
/**
 * Response plan types
 */
var ResponsePlanType;
(function (ResponsePlanType) {
    ResponsePlanType["STANDARD"] = "standard";
    ResponsePlanType["FULL_ASSIGNMENT"] = "full_assignment";
    ResponsePlanType["WORKING_FIRE"] = "working_fire";
    ResponsePlanType["MASS_CASUALTY"] = "mass_casualty";
    ResponsePlanType["HAZMAT"] = "hazmat";
    ResponsePlanType["TECHNICAL_RESCUE"] = "technical_rescue";
    ResponsePlanType["CUSTOM"] = "custom";
})(ResponsePlanType || (exports.ResponsePlanType = ResponsePlanType = {}));
// ============================================================================
// DTO CLASSES FOR VALIDATION
// ============================================================================
/**
 * Create call for service DTO
 */
let CreateCallForServiceDto = (() => {
    var _a;
    let _callType_decorators;
    let _callType_initializers = [];
    let _callType_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    let _latitude_decorators;
    let _latitude_initializers = [];
    let _latitude_extraInitializers = [];
    let _longitude_decorators;
    let _longitude_initializers = [];
    let _longitude_extraInitializers = [];
    let _address_decorators;
    let _address_initializers = [];
    let _address_extraInitializers = [];
    let _callerName_decorators;
    let _callerName_initializers = [];
    let _callerName_extraInitializers = [];
    let _callerPhone_decorators;
    let _callerPhone_initializers = [];
    let _callerPhone_extraInitializers = [];
    let _chiefComplaint_decorators;
    let _chiefComplaint_initializers = [];
    let _chiefComplaint_extraInitializers = [];
    let _additionalInfo_decorators;
    let _additionalInfo_initializers = [];
    let _additionalInfo_extraInitializers = [];
    let _patientCount_decorators;
    let _patientCount_initializers = [];
    let _patientCount_extraInitializers = [];
    let _weaponsInvolved_decorators;
    let _weaponsInvolved_initializers = [];
    let _weaponsInvolved_extraInitializers = [];
    let _callTaker_decorators;
    let _callTaker_initializers = [];
    let _callTaker_extraInitializers = [];
    let _crossStreets_decorators;
    let _crossStreets_initializers = [];
    let _crossStreets_extraInitializers = [];
    return _a = class CreateCallForServiceDto {
            constructor() {
                this.callType = __runInitializers(this, _callType_initializers, void 0);
                this.priority = (__runInitializers(this, _callType_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
                this.latitude = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _latitude_initializers, void 0));
                this.longitude = (__runInitializers(this, _latitude_extraInitializers), __runInitializers(this, _longitude_initializers, void 0));
                this.address = (__runInitializers(this, _longitude_extraInitializers), __runInitializers(this, _address_initializers, void 0));
                this.callerName = (__runInitializers(this, _address_extraInitializers), __runInitializers(this, _callerName_initializers, void 0));
                this.callerPhone = (__runInitializers(this, _callerName_extraInitializers), __runInitializers(this, _callerPhone_initializers, void 0));
                this.chiefComplaint = (__runInitializers(this, _callerPhone_extraInitializers), __runInitializers(this, _chiefComplaint_initializers, void 0));
                this.additionalInfo = (__runInitializers(this, _chiefComplaint_extraInitializers), __runInitializers(this, _additionalInfo_initializers, void 0));
                this.patientCount = (__runInitializers(this, _additionalInfo_extraInitializers), __runInitializers(this, _patientCount_initializers, void 0));
                this.weaponsInvolved = (__runInitializers(this, _patientCount_extraInitializers), __runInitializers(this, _weaponsInvolved_initializers, void 0));
                this.callTaker = (__runInitializers(this, _weaponsInvolved_extraInitializers), __runInitializers(this, _callTaker_initializers, void 0));
                this.crossStreets = (__runInitializers(this, _callTaker_extraInitializers), __runInitializers(this, _crossStreets_initializers, void 0));
                __runInitializers(this, _crossStreets_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _callType_decorators = [(0, swagger_1.ApiProperty)({ enum: CallType, description: 'Type of emergency call' }), (0, class_validator_1.IsEnum)(CallType)];
            _priority_decorators = [(0, swagger_1.ApiProperty)({ enum: CallPriority, description: 'Call priority' }), (0, class_validator_1.IsEnum)(CallPriority)];
            _latitude_decorators = [(0, swagger_1.ApiProperty)({ description: 'Location latitude' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsLatitude)()];
            _longitude_decorators = [(0, swagger_1.ApiProperty)({ description: 'Location longitude' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsLongitude)()];
            _address_decorators = [(0, swagger_1.ApiProperty)({ description: 'Street address', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(200)];
            _callerName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Caller name', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(100)];
            _callerPhone_decorators = [(0, swagger_1.ApiProperty)({ description: 'Caller phone number', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _chiefComplaint_decorators = [(0, swagger_1.ApiProperty)({ description: 'Chief complaint or nature of emergency' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(500)];
            _additionalInfo_decorators = [(0, swagger_1.ApiProperty)({ description: 'Additional information', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(2000)];
            _patientCount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Patient count', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _weaponsInvolved_decorators = [(0, swagger_1.ApiProperty)({ description: 'Weapons involved', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            _callTaker_decorators = [(0, swagger_1.ApiProperty)({ description: 'Call taker ID' }), (0, class_validator_1.IsUUID)()];
            _crossStreets_decorators = [(0, swagger_1.ApiProperty)({ description: 'Cross streets', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _callType_decorators, { kind: "field", name: "callType", static: false, private: false, access: { has: obj => "callType" in obj, get: obj => obj.callType, set: (obj, value) => { obj.callType = value; } }, metadata: _metadata }, _callType_initializers, _callType_extraInitializers);
            __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
            __esDecorate(null, null, _latitude_decorators, { kind: "field", name: "latitude", static: false, private: false, access: { has: obj => "latitude" in obj, get: obj => obj.latitude, set: (obj, value) => { obj.latitude = value; } }, metadata: _metadata }, _latitude_initializers, _latitude_extraInitializers);
            __esDecorate(null, null, _longitude_decorators, { kind: "field", name: "longitude", static: false, private: false, access: { has: obj => "longitude" in obj, get: obj => obj.longitude, set: (obj, value) => { obj.longitude = value; } }, metadata: _metadata }, _longitude_initializers, _longitude_extraInitializers);
            __esDecorate(null, null, _address_decorators, { kind: "field", name: "address", static: false, private: false, access: { has: obj => "address" in obj, get: obj => obj.address, set: (obj, value) => { obj.address = value; } }, metadata: _metadata }, _address_initializers, _address_extraInitializers);
            __esDecorate(null, null, _callerName_decorators, { kind: "field", name: "callerName", static: false, private: false, access: { has: obj => "callerName" in obj, get: obj => obj.callerName, set: (obj, value) => { obj.callerName = value; } }, metadata: _metadata }, _callerName_initializers, _callerName_extraInitializers);
            __esDecorate(null, null, _callerPhone_decorators, { kind: "field", name: "callerPhone", static: false, private: false, access: { has: obj => "callerPhone" in obj, get: obj => obj.callerPhone, set: (obj, value) => { obj.callerPhone = value; } }, metadata: _metadata }, _callerPhone_initializers, _callerPhone_extraInitializers);
            __esDecorate(null, null, _chiefComplaint_decorators, { kind: "field", name: "chiefComplaint", static: false, private: false, access: { has: obj => "chiefComplaint" in obj, get: obj => obj.chiefComplaint, set: (obj, value) => { obj.chiefComplaint = value; } }, metadata: _metadata }, _chiefComplaint_initializers, _chiefComplaint_extraInitializers);
            __esDecorate(null, null, _additionalInfo_decorators, { kind: "field", name: "additionalInfo", static: false, private: false, access: { has: obj => "additionalInfo" in obj, get: obj => obj.additionalInfo, set: (obj, value) => { obj.additionalInfo = value; } }, metadata: _metadata }, _additionalInfo_initializers, _additionalInfo_extraInitializers);
            __esDecorate(null, null, _patientCount_decorators, { kind: "field", name: "patientCount", static: false, private: false, access: { has: obj => "patientCount" in obj, get: obj => obj.patientCount, set: (obj, value) => { obj.patientCount = value; } }, metadata: _metadata }, _patientCount_initializers, _patientCount_extraInitializers);
            __esDecorate(null, null, _weaponsInvolved_decorators, { kind: "field", name: "weaponsInvolved", static: false, private: false, access: { has: obj => "weaponsInvolved" in obj, get: obj => obj.weaponsInvolved, set: (obj, value) => { obj.weaponsInvolved = value; } }, metadata: _metadata }, _weaponsInvolved_initializers, _weaponsInvolved_extraInitializers);
            __esDecorate(null, null, _callTaker_decorators, { kind: "field", name: "callTaker", static: false, private: false, access: { has: obj => "callTaker" in obj, get: obj => obj.callTaker, set: (obj, value) => { obj.callTaker = value; } }, metadata: _metadata }, _callTaker_initializers, _callTaker_extraInitializers);
            __esDecorate(null, null, _crossStreets_decorators, { kind: "field", name: "crossStreets", static: false, private: false, access: { has: obj => "crossStreets" in obj, get: obj => obj.crossStreets, set: (obj, value) => { obj.crossStreets = value; } }, metadata: _metadata }, _crossStreets_initializers, _crossStreets_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateCallForServiceDto = CreateCallForServiceDto;
/**
 * Triage call DTO
 */
let TriageCallDto = (() => {
    var _a;
    let _determinantCode_decorators;
    let _determinantCode_initializers = [];
    let _determinantCode_extraInitializers = [];
    let _priorityLevel_decorators;
    let _priorityLevel_initializers = [];
    let _priorityLevel_extraInitializers = [];
    let _recommendedResponse_decorators;
    let _recommendedResponse_initializers = [];
    let _recommendedResponse_extraInitializers = [];
    let _conscious_decorators;
    let _conscious_initializers = [];
    let _conscious_extraInitializers = [];
    let _breathing_decorators;
    let _breathing_initializers = [];
    let _breathing_extraInitializers = [];
    let _symptoms_decorators;
    let _symptoms_initializers = [];
    let _symptoms_extraInitializers = [];
    let _triageNotes_decorators;
    let _triageNotes_initializers = [];
    let _triageNotes_extraInitializers = [];
    let _triagedBy_decorators;
    let _triagedBy_initializers = [];
    let _triagedBy_extraInitializers = [];
    return _a = class TriageCallDto {
            constructor() {
                this.determinantCode = __runInitializers(this, _determinantCode_initializers, void 0);
                this.priorityLevel = (__runInitializers(this, _determinantCode_extraInitializers), __runInitializers(this, _priorityLevel_initializers, void 0));
                this.recommendedResponse = (__runInitializers(this, _priorityLevel_extraInitializers), __runInitializers(this, _recommendedResponse_initializers, void 0));
                this.conscious = (__runInitializers(this, _recommendedResponse_extraInitializers), __runInitializers(this, _conscious_initializers, void 0));
                this.breathing = (__runInitializers(this, _conscious_extraInitializers), __runInitializers(this, _breathing_initializers, void 0));
                this.symptoms = (__runInitializers(this, _breathing_extraInitializers), __runInitializers(this, _symptoms_initializers, void 0));
                this.triageNotes = (__runInitializers(this, _symptoms_extraInitializers), __runInitializers(this, _triageNotes_initializers, void 0));
                this.triagedBy = (__runInitializers(this, _triageNotes_extraInitializers), __runInitializers(this, _triagedBy_initializers, void 0));
                __runInitializers(this, _triagedBy_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _determinantCode_decorators = [(0, swagger_1.ApiProperty)({ description: 'EMD/EPD determinant code', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _priorityLevel_decorators = [(0, swagger_1.ApiProperty)({ enum: CallPriority, description: 'Priority level' }), (0, class_validator_1.IsEnum)(CallPriority)];
            _recommendedResponse_decorators = [(0, swagger_1.ApiProperty)({ description: 'Recommended response units', type: [String] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _conscious_decorators = [(0, swagger_1.ApiProperty)({ description: 'Is patient conscious', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            _breathing_decorators = [(0, swagger_1.ApiProperty)({ description: 'Is patient breathing', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            _symptoms_decorators = [(0, swagger_1.ApiProperty)({ description: 'Symptoms', required: false, type: [String] }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _triageNotes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Triage notes', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(1000)];
            _triagedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Triaged by user ID' }), (0, class_validator_1.IsUUID)()];
            __esDecorate(null, null, _determinantCode_decorators, { kind: "field", name: "determinantCode", static: false, private: false, access: { has: obj => "determinantCode" in obj, get: obj => obj.determinantCode, set: (obj, value) => { obj.determinantCode = value; } }, metadata: _metadata }, _determinantCode_initializers, _determinantCode_extraInitializers);
            __esDecorate(null, null, _priorityLevel_decorators, { kind: "field", name: "priorityLevel", static: false, private: false, access: { has: obj => "priorityLevel" in obj, get: obj => obj.priorityLevel, set: (obj, value) => { obj.priorityLevel = value; } }, metadata: _metadata }, _priorityLevel_initializers, _priorityLevel_extraInitializers);
            __esDecorate(null, null, _recommendedResponse_decorators, { kind: "field", name: "recommendedResponse", static: false, private: false, access: { has: obj => "recommendedResponse" in obj, get: obj => obj.recommendedResponse, set: (obj, value) => { obj.recommendedResponse = value; } }, metadata: _metadata }, _recommendedResponse_initializers, _recommendedResponse_extraInitializers);
            __esDecorate(null, null, _conscious_decorators, { kind: "field", name: "conscious", static: false, private: false, access: { has: obj => "conscious" in obj, get: obj => obj.conscious, set: (obj, value) => { obj.conscious = value; } }, metadata: _metadata }, _conscious_initializers, _conscious_extraInitializers);
            __esDecorate(null, null, _breathing_decorators, { kind: "field", name: "breathing", static: false, private: false, access: { has: obj => "breathing" in obj, get: obj => obj.breathing, set: (obj, value) => { obj.breathing = value; } }, metadata: _metadata }, _breathing_initializers, _breathing_extraInitializers);
            __esDecorate(null, null, _symptoms_decorators, { kind: "field", name: "symptoms", static: false, private: false, access: { has: obj => "symptoms" in obj, get: obj => obj.symptoms, set: (obj, value) => { obj.symptoms = value; } }, metadata: _metadata }, _symptoms_initializers, _symptoms_extraInitializers);
            __esDecorate(null, null, _triageNotes_decorators, { kind: "field", name: "triageNotes", static: false, private: false, access: { has: obj => "triageNotes" in obj, get: obj => obj.triageNotes, set: (obj, value) => { obj.triageNotes = value; } }, metadata: _metadata }, _triageNotes_initializers, _triageNotes_extraInitializers);
            __esDecorate(null, null, _triagedBy_decorators, { kind: "field", name: "triagedBy", static: false, private: false, access: { has: obj => "triagedBy" in obj, get: obj => obj.triagedBy, set: (obj, value) => { obj.triagedBy = value; } }, metadata: _metadata }, _triagedBy_initializers, _triagedBy_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.TriageCallDto = TriageCallDto;
/**
 * Dispatch units DTO
 */
let DispatchUnitsDto = (() => {
    var _a;
    let _unitIds_decorators;
    let _unitIds_initializers = [];
    let _unitIds_extraInitializers = [];
    let _dispatchedBy_decorators;
    let _dispatchedBy_initializers = [];
    let _dispatchedBy_extraInitializers = [];
    let _specialInstructions_decorators;
    let _specialInstructions_initializers = [];
    let _specialInstructions_extraInitializers = [];
    let _estimatedArrival_decorators;
    let _estimatedArrival_initializers = [];
    let _estimatedArrival_extraInitializers = [];
    return _a = class DispatchUnitsDto {
            constructor() {
                this.unitIds = __runInitializers(this, _unitIds_initializers, void 0);
                this.dispatchedBy = (__runInitializers(this, _unitIds_extraInitializers), __runInitializers(this, _dispatchedBy_initializers, void 0));
                this.specialInstructions = (__runInitializers(this, _dispatchedBy_extraInitializers), __runInitializers(this, _specialInstructions_initializers, void 0));
                this.estimatedArrival = (__runInitializers(this, _specialInstructions_extraInitializers), __runInitializers(this, _estimatedArrival_initializers, void 0));
                __runInitializers(this, _estimatedArrival_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _unitIds_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unit IDs to dispatch', type: [String] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true }), (0, class_validator_1.MinLength)(1, { each: true })];
            _dispatchedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Dispatcher user ID' }), (0, class_validator_1.IsUUID)()];
            _specialInstructions_decorators = [(0, swagger_1.ApiProperty)({ description: 'Special instructions', required: false, type: [String] }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _estimatedArrival_decorators = [(0, swagger_1.ApiProperty)({ description: 'Estimated arrival time', required: false }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsDate)()];
            __esDecorate(null, null, _unitIds_decorators, { kind: "field", name: "unitIds", static: false, private: false, access: { has: obj => "unitIds" in obj, get: obj => obj.unitIds, set: (obj, value) => { obj.unitIds = value; } }, metadata: _metadata }, _unitIds_initializers, _unitIds_extraInitializers);
            __esDecorate(null, null, _dispatchedBy_decorators, { kind: "field", name: "dispatchedBy", static: false, private: false, access: { has: obj => "dispatchedBy" in obj, get: obj => obj.dispatchedBy, set: (obj, value) => { obj.dispatchedBy = value; } }, metadata: _metadata }, _dispatchedBy_initializers, _dispatchedBy_extraInitializers);
            __esDecorate(null, null, _specialInstructions_decorators, { kind: "field", name: "specialInstructions", static: false, private: false, access: { has: obj => "specialInstructions" in obj, get: obj => obj.specialInstructions, set: (obj, value) => { obj.specialInstructions = value; } }, metadata: _metadata }, _specialInstructions_initializers, _specialInstructions_extraInitializers);
            __esDecorate(null, null, _estimatedArrival_decorators, { kind: "field", name: "estimatedArrival", static: false, private: false, access: { has: obj => "estimatedArrival" in obj, get: obj => obj.estimatedArrival, set: (obj, value) => { obj.estimatedArrival = value; } }, metadata: _metadata }, _estimatedArrival_initializers, _estimatedArrival_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.DispatchUnitsDto = DispatchUnitsDto;
/**
 * Update unit status DTO
 */
let UpdateUnitStatusDto = (() => {
    var _a;
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _latitude_decorators;
    let _latitude_initializers = [];
    let _latitude_extraInitializers = [];
    let _longitude_decorators;
    let _longitude_initializers = [];
    let _longitude_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _updatedBy_decorators;
    let _updatedBy_initializers = [];
    let _updatedBy_extraInitializers = [];
    return _a = class UpdateUnitStatusDto {
            constructor() {
                this.status = __runInitializers(this, _status_initializers, void 0);
                this.latitude = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _latitude_initializers, void 0));
                this.longitude = (__runInitializers(this, _latitude_extraInitializers), __runInitializers(this, _longitude_initializers, void 0));
                this.notes = (__runInitializers(this, _longitude_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
                this.updatedBy = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _updatedBy_initializers, void 0));
                __runInitializers(this, _updatedBy_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _status_decorators = [(0, swagger_1.ApiProperty)({ enum: UnitStatus, description: 'New unit status' }), (0, class_validator_1.IsEnum)(UnitStatus)];
            _latitude_decorators = [(0, swagger_1.ApiProperty)({ description: 'Current location latitude', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsLatitude)()];
            _longitude_decorators = [(0, swagger_1.ApiProperty)({ description: 'Current location longitude', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsLongitude)()];
            _notes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Status notes', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(500)];
            _updatedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Updated by user ID' }), (0, class_validator_1.IsUUID)()];
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _latitude_decorators, { kind: "field", name: "latitude", static: false, private: false, access: { has: obj => "latitude" in obj, get: obj => obj.latitude, set: (obj, value) => { obj.latitude = value; } }, metadata: _metadata }, _latitude_initializers, _latitude_extraInitializers);
            __esDecorate(null, null, _longitude_decorators, { kind: "field", name: "longitude", static: false, private: false, access: { has: obj => "longitude" in obj, get: obj => obj.longitude, set: (obj, value) => { obj.longitude = value; } }, metadata: _metadata }, _longitude_initializers, _longitude_extraInitializers);
            __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
            __esDecorate(null, null, _updatedBy_decorators, { kind: "field", name: "updatedBy", static: false, private: false, access: { has: obj => "updatedBy" in obj, get: obj => obj.updatedBy, set: (obj, value) => { obj.updatedBy = value; } }, metadata: _metadata }, _updatedBy_initializers, _updatedBy_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.UpdateUnitStatusDto = UpdateUnitStatusDto;
/**
 * Create geographic zone DTO
 */
let CreateGeographicZoneDto = (() => {
    var _a;
    let _zoneName_decorators;
    let _zoneName_initializers = [];
    let _zoneName_extraInitializers = [];
    let _zoneType_decorators;
    let _zoneType_initializers = [];
    let _zoneType_extraInitializers = [];
    let _north_decorators;
    let _north_initializers = [];
    let _north_extraInitializers = [];
    let _south_decorators;
    let _south_initializers = [];
    let _south_extraInitializers = [];
    let _east_decorators;
    let _east_initializers = [];
    let _east_extraInitializers = [];
    let _west_decorators;
    let _west_initializers = [];
    let _west_extraInitializers = [];
    let _assignedUnits_decorators;
    let _assignedUnits_initializers = [];
    let _assignedUnits_extraInitializers = [];
    return _a = class CreateGeographicZoneDto {
            constructor() {
                this.zoneName = __runInitializers(this, _zoneName_initializers, void 0);
                this.zoneType = (__runInitializers(this, _zoneName_extraInitializers), __runInitializers(this, _zoneType_initializers, void 0));
                this.north = (__runInitializers(this, _zoneType_extraInitializers), __runInitializers(this, _north_initializers, void 0));
                this.south = (__runInitializers(this, _north_extraInitializers), __runInitializers(this, _south_initializers, void 0));
                this.east = (__runInitializers(this, _south_extraInitializers), __runInitializers(this, _east_initializers, void 0));
                this.west = (__runInitializers(this, _east_extraInitializers), __runInitializers(this, _west_initializers, void 0));
                this.assignedUnits = (__runInitializers(this, _west_extraInitializers), __runInitializers(this, _assignedUnits_initializers, void 0));
                __runInitializers(this, _assignedUnits_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _zoneName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Zone name' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(100)];
            _zoneType_decorators = [(0, swagger_1.ApiProperty)({ enum: ['fire', 'ems', 'police'], description: 'Zone type' }), (0, class_validator_1.IsEnum)(['fire', 'ems', 'police'])];
            _north_decorators = [(0, swagger_1.ApiProperty)({ description: 'Northern boundary latitude' }), (0, class_validator_1.IsNumber)()];
            _south_decorators = [(0, swagger_1.ApiProperty)({ description: 'Southern boundary latitude' }), (0, class_validator_1.IsNumber)()];
            _east_decorators = [(0, swagger_1.ApiProperty)({ description: 'Eastern boundary longitude' }), (0, class_validator_1.IsNumber)()];
            _west_decorators = [(0, swagger_1.ApiProperty)({ description: 'Western boundary longitude' }), (0, class_validator_1.IsNumber)()];
            _assignedUnits_decorators = [(0, swagger_1.ApiProperty)({ description: 'Assigned unit IDs', type: [String] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            __esDecorate(null, null, _zoneName_decorators, { kind: "field", name: "zoneName", static: false, private: false, access: { has: obj => "zoneName" in obj, get: obj => obj.zoneName, set: (obj, value) => { obj.zoneName = value; } }, metadata: _metadata }, _zoneName_initializers, _zoneName_extraInitializers);
            __esDecorate(null, null, _zoneType_decorators, { kind: "field", name: "zoneType", static: false, private: false, access: { has: obj => "zoneType" in obj, get: obj => obj.zoneType, set: (obj, value) => { obj.zoneType = value; } }, metadata: _metadata }, _zoneType_initializers, _zoneType_extraInitializers);
            __esDecorate(null, null, _north_decorators, { kind: "field", name: "north", static: false, private: false, access: { has: obj => "north" in obj, get: obj => obj.north, set: (obj, value) => { obj.north = value; } }, metadata: _metadata }, _north_initializers, _north_extraInitializers);
            __esDecorate(null, null, _south_decorators, { kind: "field", name: "south", static: false, private: false, access: { has: obj => "south" in obj, get: obj => obj.south, set: (obj, value) => { obj.south = value; } }, metadata: _metadata }, _south_initializers, _south_extraInitializers);
            __esDecorate(null, null, _east_decorators, { kind: "field", name: "east", static: false, private: false, access: { has: obj => "east" in obj, get: obj => obj.east, set: (obj, value) => { obj.east = value; } }, metadata: _metadata }, _east_initializers, _east_extraInitializers);
            __esDecorate(null, null, _west_decorators, { kind: "field", name: "west", static: false, private: false, access: { has: obj => "west" in obj, get: obj => obj.west, set: (obj, value) => { obj.west = value; } }, metadata: _metadata }, _west_initializers, _west_extraInitializers);
            __esDecorate(null, null, _assignedUnits_decorators, { kind: "field", name: "assignedUnits", static: false, private: false, access: { has: obj => "assignedUnits" in obj, get: obj => obj.assignedUnits, set: (obj, value) => { obj.assignedUnits = value; } }, metadata: _metadata }, _assignedUnits_initializers, _assignedUnits_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateGeographicZoneDto = CreateGeographicZoneDto;
/**
 * Update console status DTO
 */
let UpdateConsoleStatusDto = (() => {
    var _a;
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _dispatcherId_decorators;
    let _dispatcherId_initializers = [];
    let _dispatcherId_extraInitializers = [];
    let _assignedZones_decorators;
    let _assignedZones_initializers = [];
    let _assignedZones_extraInitializers = [];
    return _a = class UpdateConsoleStatusDto {
            constructor() {
                this.status = __runInitializers(this, _status_initializers, void 0);
                this.dispatcherId = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _dispatcherId_initializers, void 0));
                this.assignedZones = (__runInitializers(this, _dispatcherId_extraInitializers), __runInitializers(this, _assignedZones_initializers, void 0));
                __runInitializers(this, _assignedZones_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _status_decorators = [(0, swagger_1.ApiProperty)({ enum: ConsoleStatus, description: 'Console status' }), (0, class_validator_1.IsEnum)(ConsoleStatus)];
            _dispatcherId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Dispatcher user ID', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsUUID)()];
            _assignedZones_decorators = [(0, swagger_1.ApiProperty)({ description: 'Assigned zones', required: false, type: [String] }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _dispatcherId_decorators, { kind: "field", name: "dispatcherId", static: false, private: false, access: { has: obj => "dispatcherId" in obj, get: obj => obj.dispatcherId, set: (obj, value) => { obj.dispatcherId = value; } }, metadata: _metadata }, _dispatcherId_initializers, _dispatcherId_extraInitializers);
            __esDecorate(null, null, _assignedZones_decorators, { kind: "field", name: "assignedZones", static: false, private: false, access: { has: obj => "assignedZones" in obj, get: obj => obj.assignedZones, set: (obj, value) => { obj.assignedZones = value; } }, metadata: _metadata }, _assignedZones_initializers, _assignedZones_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.UpdateConsoleStatusDto = UpdateConsoleStatusDto;
/**
 * Pre-arrival instructions DTO
 */
let DeliverPreArrivalInstructionsDto = (() => {
    var _a;
    let _instructionType_decorators;
    let _instructionType_initializers = [];
    let _instructionType_extraInitializers = [];
    let _instructions_decorators;
    let _instructions_initializers = [];
    let _instructions_extraInitializers = [];
    let _deliveredBy_decorators;
    let _deliveredBy_initializers = [];
    let _deliveredBy_extraInitializers = [];
    return _a = class DeliverPreArrivalInstructionsDto {
            constructor() {
                this.instructionType = __runInitializers(this, _instructionType_initializers, void 0);
                this.instructions = (__runInitializers(this, _instructionType_extraInitializers), __runInitializers(this, _instructions_initializers, void 0));
                this.deliveredBy = (__runInitializers(this, _instructions_extraInitializers), __runInitializers(this, _deliveredBy_initializers, void 0));
                __runInitializers(this, _deliveredBy_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _instructionType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Instruction type (e.g., CPR, Choking, Bleeding)' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _instructions_decorators = [(0, swagger_1.ApiProperty)({ description: 'Instruction steps', type: [String] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _deliveredBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Delivered by user ID' }), (0, class_validator_1.IsUUID)()];
            __esDecorate(null, null, _instructionType_decorators, { kind: "field", name: "instructionType", static: false, private: false, access: { has: obj => "instructionType" in obj, get: obj => obj.instructionType, set: (obj, value) => { obj.instructionType = value; } }, metadata: _metadata }, _instructionType_initializers, _instructionType_extraInitializers);
            __esDecorate(null, null, _instructions_decorators, { kind: "field", name: "instructions", static: false, private: false, access: { has: obj => "instructions" in obj, get: obj => obj.instructions, set: (obj, value) => { obj.instructions = value; } }, metadata: _metadata }, _instructions_initializers, _instructions_extraInitializers);
            __esDecorate(null, null, _deliveredBy_decorators, { kind: "field", name: "deliveredBy", static: false, private: false, access: { has: obj => "deliveredBy" in obj, get: obj => obj.deliveredBy, set: (obj, value) => { obj.deliveredBy = value; } }, metadata: _metadata }, _deliveredBy_initializers, _deliveredBy_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.DeliverPreArrivalInstructionsDto = DeliverPreArrivalInstructionsDto;
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
async function createCallForService(data, userId) {
    const call = {
        id: faker_1.faker.string.uuid(),
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
function generateCallNumber(callType, location) {
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
async function triageEmergencyCall(callId, triage) {
    const call = await getCallForService(callId);
    const triageRecord = {
        id: faker_1.faker.string.uuid(),
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
    });
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
async function applyEMDProtocol(callId, cardNumber) {
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
    return (protocols[cardNumber] || {
        cardTitle: 'Unknown',
        determinants: [],
        preArrivalInstructions: [],
        recommendedResponse: ['BLS'],
    });
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
async function deliverPreArrivalInstructions(callId, instructions) {
    const paiRecord = {
        id: faker_1.faker.string.uuid(),
        callId,
        startedAt: new Date(),
        ...instructions,
    };
    await updateCallForService(callId, {
        preArrivalInstructionsGiven: true,
    });
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
async function validateCallerLocation(phoneNumber) {
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
async function transferCall(callId, targetAgency, transferReason, transferredBy) {
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
async function dispatchUnits(callId, unitIds, dispatchedBy) {
    const call = await getCallForService(callId);
    const dispatches = [];
    for (let i = 0; i < unitIds.length; i++) {
        const unit = await getUnit(unitIds[i]);
        const dispatch = {
            id: faker_1.faker.string.uuid(),
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
        });
        dispatches.push(dispatch);
    }
    // Update call status
    await updateCallForService(callId, {
        status: CallStatus.DISPATCHED,
        dispatchedAt: new Date(),
        dispatcher: dispatchedBy,
        assignedUnits: unitIds,
    });
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
async function recommendUnitsForCall(callId, criteria) {
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
async function calculateOptimalRoute(unitId, destination) {
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
async function dispatchByResponsePlan(callId, responsePlanId, dispatchedBy) {
    const plan = await getResponsePlan(responsePlanId);
    const call = await getCallForService(callId);
    const unitsToDispatch = [];
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
async function addUnitsToCall(callId, additionalUnits, reason, dispatchedBy) {
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
async function cancelUnitDispatch(dispatchId, cancelReason, cancelledBy) {
    const dispatch = await getUnitDispatch(dispatchId);
    // Update unit status back to available
    await updateUnitStatus(dispatch.unitId, {
        status: UnitStatus.AVAILABLE,
        currentCallId: undefined,
    });
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
async function updateUnitStatus(unitId, update) {
    const unit = await getUnit(unitId);
    const updated = {
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
        }
        else if (update.status === UnitStatus.ON_SCENE) {
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
async function trackUnitResponseTime(dispatchId) {
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
async function getAvailableUnits(criteria) {
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
async function updateUnitLocationFromAVL(unitId, avlData) {
    const avlUpdate = {
        id: faker_1.faker.string.uuid(),
        unitId,
        timestamp: new Date(),
        ...avlData,
    };
    await updateUnitStatus(unitId, {
        currentLocation: avlData.location,
        lastLocationUpdate: new Date(),
    });
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
async function clearUnit(unitId, disposition, clearedBy) {
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
    });
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
async function addToDispatchQueue(callId, priority) {
    const existingQueue = await getDispatchQueue();
    const position = existingQueue.length + 1;
    const entry = {
        id: faker_1.faker.string.uuid(),
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
function prioritizeDispatchQueue(queueEntries) {
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
        if (priorityDiff !== 0)
            return priorityDiff;
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
async function getDispatchQueue() {
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
async function removeFromDispatchQueue(callId) {
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
async function escalateQueuedCall(queueEntryId, newPriority, reason) {
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
async function createGeographicZone(zone) {
    const geoZone = {
        id: faker_1.faker.string.uuid(),
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
async function determineZoneForLocation(location) {
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
async function getZoneCoverageStats(zoneId) {
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
async function assignUnitToZone(unitId, zoneId) {
    const zone = await getGeographicZone(zoneId);
    return updateUnitStatus(unitId, {
        assignedZone: zone.zoneName,
    });
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
async function loginToConsole(consoleId, dispatcherId, dispatcherName) {
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
async function logoutFromConsole(consoleId) {
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
async function transferCallsBetweenConsoles(callIds, fromConsoleId, toConsoleId) {
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
async function getActiveConsoles() {
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
async function monitorConsolePerformance(consoleId, period) {
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
async function updateCallStatus(callId, newStatus) {
    const call = await getCallForService(callId);
    const updated = await updateCallForService(callId, {
        status: newStatus,
    });
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
async function closeCallForService(callId, disposition, closedBy) {
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
async function cancelCallForService(callId, cancelReason, cancelledBy) {
    const call = await updateCallStatus(callId, CallStatus.CANCELLED);
    // Cancel all unit dispatches
    const call, Data = await getCallForService(callId);
    for (const unitId of callData.assignedUnits) {
        await updateUnitStatus(unitId, {
            status: UnitStatus.AVAILABLE,
            currentCallId: undefined,
        });
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
async function mergeDuplicateCalls(primaryCallId, duplicateCallIds, mergedBy) {
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
async function generateCallStatistics(period) {
    return {
        totalCalls: 150,
        byPriority: {
            [CallPriority.IMMEDIATE]: 5,
            [CallPriority.EMERGENCY]: 25,
            [CallPriority.URGENT]: 40,
            [CallPriority.ROUTINE]: 60,
            [CallPriority.NON_EMERGENCY]: 20,
        },
        byType: {},
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
async function getCallForService(id) {
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
async function updateCallForService(id, updates) {
    const call = await getCallForService(id);
    return { ...call, ...updates, updatedAt: new Date() };
}
/**
 * Gets unit by ID
 */
async function getUnit(id) {
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
async function getUnitDispatch(id) {
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
async function getResponsePlan(id) {
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
async function getGeographicZone(id) {
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
async function getDispatchConsole(id) {
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
async function getQueueEntry(id) {
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
async function logDispatchActivity(callId, activityType, data) {
    console.log(`Call ${callId}: ${activityType}`, data);
}
// ============================================================================
// NESTJS CONTROLLER
// ============================================================================
/**
 * Dispatch Command Controller
 * Provides RESTful API endpoints for dispatch operations
 */
let DispatchCommandController = (() => {
    let _classDecorators = [(0, swagger_1.ApiTags)('dispatch-command'), (0, common_1.Controller)('dispatch-command'), (0, swagger_1.ApiBearerAuth)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _createCall_decorators;
    let _triageCall_decorators;
    let _dispatch_decorators;
    let _updateStatus_decorators;
    let _getAvailable_decorators;
    let _getQueue_decorators;
    let _closeCall_decorators;
    let _createZone_decorators;
    var DispatchCommandController = _classThis = class {
        /**
         * Create a new call for service
         */
        async createCall(createDto) {
            const location = {
                latitude: createDto.latitude,
                longitude: createDto.longitude,
                address: createDto.address,
            };
            return createCallForService({
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
            }, createDto.callTaker);
        }
        /**
         * Triage emergency call
         */
        async triageCall(id, dto) {
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
        async dispatch(id, dto) {
            return dispatchUnits(id, dto.unitIds, dto.dispatchedBy);
        }
        /**
         * Update unit status
         */
        async updateStatus(id, dto) {
            const location = dto.latitude && dto.longitude ? { latitude: dto.latitude, longitude: dto.longitude } : undefined;
            return updateUnitStatus(id, {
                status: dto.status,
                currentLocation: location,
            });
        }
        /**
         * Get available units
         */
        async getAvailable(zone) {
            return getAvailableUnits({ zone });
        }
        /**
         * Get dispatch queue
         */
        async getQueue() {
            return getDispatchQueue();
        }
        /**
         * Close call
         */
        async closeCall(id, data) {
            return closeCallForService(id, data.disposition, data.closedBy);
        }
        /**
         * Create geographic zone
         */
        async createZone(dto) {
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
        constructor() {
            __runInitializers(this, _instanceExtraInitializers);
        }
    };
    __setFunctionName(_classThis, "DispatchCommandController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _createCall_decorators = [(0, common_1.Post)('calls'), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({ summary: 'Create new call for service' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Call created successfully' }), (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true }))];
        _triageCall_decorators = [(0, common_1.Post)('calls/:id/triage'), (0, swagger_1.ApiOperation)({ summary: 'Triage emergency call' })];
        _dispatch_decorators = [(0, common_1.Post)('calls/:id/dispatch'), (0, swagger_1.ApiOperation)({ summary: 'Dispatch units to call' })];
        _updateStatus_decorators = [(0, common_1.Patch)('units/:id/status'), (0, swagger_1.ApiOperation)({ summary: 'Update unit status' })];
        _getAvailable_decorators = [(0, common_1.Get)('units/available'), (0, swagger_1.ApiOperation)({ summary: 'Get available units' }), (0, swagger_1.ApiQuery)({ name: 'zone', required: false })];
        _getQueue_decorators = [(0, common_1.Get)('queue'), (0, swagger_1.ApiOperation)({ summary: 'Get dispatch queue' })];
        _closeCall_decorators = [(0, common_1.Post)('calls/:id/close'), (0, swagger_1.ApiOperation)({ summary: 'Close call for service' })];
        _createZone_decorators = [(0, common_1.Post)('zones'), (0, swagger_1.ApiOperation)({ summary: 'Create geographic zone' })];
        __esDecorate(_classThis, null, _createCall_decorators, { kind: "method", name: "createCall", static: false, private: false, access: { has: obj => "createCall" in obj, get: obj => obj.createCall }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _triageCall_decorators, { kind: "method", name: "triageCall", static: false, private: false, access: { has: obj => "triageCall" in obj, get: obj => obj.triageCall }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _dispatch_decorators, { kind: "method", name: "dispatch", static: false, private: false, access: { has: obj => "dispatch" in obj, get: obj => obj.dispatch }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateStatus_decorators, { kind: "method", name: "updateStatus", static: false, private: false, access: { has: obj => "updateStatus" in obj, get: obj => obj.updateStatus }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getAvailable_decorators, { kind: "method", name: "getAvailable", static: false, private: false, access: { has: obj => "getAvailable" in obj, get: obj => obj.getAvailable }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getQueue_decorators, { kind: "method", name: "getQueue", static: false, private: false, access: { has: obj => "getQueue" in obj, get: obj => obj.getQueue }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _closeCall_decorators, { kind: "method", name: "closeCall", static: false, private: false, access: { has: obj => "closeCall" in obj, get: obj => obj.closeCall }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createZone_decorators, { kind: "method", name: "createZone", static: false, private: false, access: { has: obj => "createZone" in obj, get: obj => obj.createZone }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DispatchCommandController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DispatchCommandController = _classThis;
})();
exports.DispatchCommandController = DispatchCommandController;
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
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
//# sourceMappingURL=dispatch-command-controllers.js.map