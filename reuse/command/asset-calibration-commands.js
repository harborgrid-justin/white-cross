"use strict";
/**
 * ASSET CALIBRATION MANAGEMENT COMMANDS
 *
 * Production-ready command functions for comprehensive asset calibration management in enterprise systems.
 * Provides 40+ specialized functions covering:
 * - Calibration scheduling and frequency optimization
 * - Calibration execution and measurement recording
 * - Calibration certification and documentation
 * - Calibration standards management and traceability
 * - Out-of-tolerance detection and handling workflows
 * - Calibration vendor management and performance tracking
 * - Calibration due date tracking and notifications
 * - Calibration cost tracking and analysis
 * - Multi-point calibration procedures
 * - Environmental condition monitoring
 * - Calibration equipment management
 * - Regulatory compliance (ISO/IEC 17025, FDA 21 CFR Part 11)
 *
 * @module AssetCalibrationCommands
 * @version 1.0.0
 * @requires @nestjs/common ^11.1.8
 * @requires @nestjs/swagger ^8.0.7
 * @requires @nestjs/sequelize ^10.0.1
 * @requires sequelize ^6.37.5
 * @requires sequelize-typescript ^2.1.6
 * @requires class-validator ^0.14.1
 * @requires class-transformer ^0.5.1
 * @requires Node.js 18+
 * @requires TypeScript 5.x
 *
 * @security Compliant with ISO/IEC 17025, FDA 21 CFR Part 11, HIPAA
 * @performance Optimized for high-volume calibration operations (1000+ assets)
 *
 * @example
 * ```typescript
 * import {
 *   scheduleCalibration,
 *   recordCalibrationCompletion,
 *   detectOutOfTolerance,
 *   generateCalibrationCertificate,
 *   CalibrationSchedule,
 *   CalibrationFrequency
 * } from './asset-calibration-commands';
 *
 * // Schedule calibration for critical medical equipment
 * const schedule = await scheduleCalibration({
 *   assetId: 'asset-mri-001',
 *   calibrationTypeId: 'cal-type-magnetic-field',
 *   frequency: CalibrationFrequency.MONTHLY,
 *   dueDate: new Date('2024-12-01'),
 *   assignedTechnicianId: 'tech-001',
 *   standardIds: ['std-nist-001', 'std-iso-002']
 * });
 *
 * // Record calibration results
 * const record = await recordCalibrationCompletion(schedule.id, {
 *   performedBy: 'tech-001',
 *   performedDate: new Date(),
 *   measurements: [
 *     { parameter: 'field-strength', reading: 1.5, unit: 'Tesla', tolerance: 0.01 }
 *   ],
 *   passed: true,
 *   environmentalConditions: {
 *     temperature: 22.5,
 *     humidity: 45,
 *     pressure: 101.3
 *   }
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
exports.CalibrationVendor = exports.CalibrationStandard = exports.CalibrationRecord = exports.CalibrationSchedule = exports.CalibrationType = exports.TraceabilitySource = exports.CalibrationMethod = exports.OutOfToleranceAction = exports.CalibrationResult = exports.CalibrationStatus = exports.CalibrationFrequency = void 0;
exports.scheduleCalibration = scheduleCalibration;
exports.generateCalibrationWorkOrderNumber = generateCalibrationWorkOrderNumber;
exports.updateCalibrationSchedule = updateCalibrationSchedule;
exports.getCalibrationsDue = getCalibrationsDue;
exports.getOverdueCalibrations = getOverdueCalibrations;
exports.calculateOptimalFrequency = calculateOptimalFrequency;
exports.cancelCalibrationSchedule = cancelCalibrationSchedule;
exports.deferCalibration = deferCalibration;
exports.startCalibrationExecution = startCalibrationExecution;
exports.recordCalibrationCompletion = recordCalibrationCompletion;
exports.generateCalibrationCertificateNumber = generateCalibrationCertificateNumber;
exports.calculateNextCalibrationDueDate = calculateNextCalibrationDueDate;
exports.recordCalibrationMeasurements = recordCalibrationMeasurements;
exports.validateMeasurementTolerance = validateMeasurementTolerance;
exports.getCalibrationHistory = getCalibrationHistory;
exports.approveCalibrationRecord = approveCalibrationRecord;
exports.detectOutOfTolerance = detectOutOfTolerance;
exports.handleOutOfTolerance = handleOutOfTolerance;
exports.quarantineAsset = quarantineAsset;
exports.completeOutOfToleranceAction = completeOutOfToleranceAction;
exports.registerCalibrationStandard = registerCalibrationStandard;
exports.getExpiringCalibrationStandards = getExpiringCalibrationStandards;
exports.trackStandardTraceability = trackStandardTraceability;
exports.updateCalibrationStandard = updateCalibrationStandard;
exports.retireCalibrationStandard = retireCalibrationStandard;
exports.registerCalibrationVendor = registerCalibrationVendor;
exports.evaluateVendorPerformance = evaluateVendorPerformance;
exports.getTopCalibrationVendors = getTopCalibrationVendors;
exports.trackCalibrationCosts = trackCalibrationCosts;
exports.forecastCalibrationCosts = forecastCalibrationCosts;
exports.generateCalibrationCertificate = generateCalibrationCertificate;
exports.generateCalibrationComplianceReport = generateCalibrationComplianceReport;
exports.getCalibrationStatistics = getCalibrationStatistics;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_1 = require("sequelize");
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * Calibration frequency types
 */
var CalibrationFrequency;
(function (CalibrationFrequency) {
    CalibrationFrequency["DAILY"] = "daily";
    CalibrationFrequency["WEEKLY"] = "weekly";
    CalibrationFrequency["BIWEEKLY"] = "biweekly";
    CalibrationFrequency["MONTHLY"] = "monthly";
    CalibrationFrequency["QUARTERLY"] = "quarterly";
    CalibrationFrequency["SEMIANNUALLY"] = "semiannually";
    CalibrationFrequency["ANNUALLY"] = "annually";
    CalibrationFrequency["BIANNUALLY"] = "biannually";
    CalibrationFrequency["ON_DEMAND"] = "on_demand";
    CalibrationFrequency["USAGE_BASED"] = "usage_based";
})(CalibrationFrequency || (exports.CalibrationFrequency = CalibrationFrequency = {}));
/**
 * Calibration status
 */
var CalibrationStatus;
(function (CalibrationStatus) {
    CalibrationStatus["SCHEDULED"] = "scheduled";
    CalibrationStatus["DUE"] = "due";
    CalibrationStatus["OVERDUE"] = "overdue";
    CalibrationStatus["IN_PROGRESS"] = "in_progress";
    CalibrationStatus["COMPLETED"] = "completed";
    CalibrationStatus["PASSED"] = "passed";
    CalibrationStatus["FAILED"] = "failed";
    CalibrationStatus["CANCELLED"] = "cancelled";
    CalibrationStatus["DEFERRED"] = "deferred";
})(CalibrationStatus || (exports.CalibrationStatus = CalibrationStatus = {}));
/**
 * Calibration result
 */
var CalibrationResult;
(function (CalibrationResult) {
    CalibrationResult["PASS"] = "pass";
    CalibrationResult["FAIL"] = "fail";
    CalibrationResult["LIMITED_PASS"] = "limited_pass";
    CalibrationResult["OUT_OF_TOLERANCE"] = "out_of_tolerance";
    CalibrationResult["CONDITIONAL"] = "conditional";
})(CalibrationResult || (exports.CalibrationResult = CalibrationResult = {}));
/**
 * Out-of-tolerance action
 */
var OutOfToleranceAction;
(function (OutOfToleranceAction) {
    OutOfToleranceAction["QUARANTINE"] = "quarantine";
    OutOfToleranceAction["ADJUST_AND_RETEST"] = "adjust_and_retest";
    OutOfToleranceAction["REPAIR"] = "repair";
    OutOfToleranceAction["REPLACE"] = "replace";
    OutOfToleranceAction["ACCEPT_AS_IS"] = "accept_as_is";
    OutOfToleranceAction["INVESTIGATE"] = "investigate";
})(OutOfToleranceAction || (OutOfToleranceAction = {}));
/**
 * Calibration method
 */
var CalibrationMethod;
(function (CalibrationMethod) {
    CalibrationMethod["INTERNAL"] = "internal";
    CalibrationMethod["EXTERNAL"] = "external";
    CalibrationMethod["SELF_CALIBRATION"] = "self_calibration";
    CalibrationMethod["AUTOMATIC"] = "automatic";
    CalibrationMethod["MANUAL"] = "manual";
})(CalibrationMethod || (exports.CalibrationMethod = CalibrationMethod = {}));
/**
 * Standard traceability source
 */
var TraceabilitySource;
(function (TraceabilitySource) {
    TraceabilitySource["NIST"] = "nist";
    TraceabilitySource["ISO"] = "iso";
    TraceabilitySource["PTB"] = "ptb";
    TraceabilitySource["NPL"] = "npl";
    TraceabilitySource["MANUFACTURER"] = "manufacturer";
    TraceabilitySource["ACCREDITED_LAB"] = "accredited_lab";
})(TraceabilitySource || (exports.TraceabilitySource = TraceabilitySource = {}));
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Calibration Type Model - Defines calibration procedures and specifications
 */
let CalibrationType = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'calibration_types',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['code'], unique: true },
                { fields: ['is_active'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _code_decorators;
    let _code_initializers = [];
    let _code_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _defaultFrequency_decorators;
    let _defaultFrequency_initializers = [];
    let _defaultFrequency_extraInitializers = [];
    let _requiredStandards_decorators;
    let _requiredStandards_initializers = [];
    let _requiredStandards_extraInitializers = [];
    let _procedureDocumentUrl_decorators;
    let _procedureDocumentUrl_initializers = [];
    let _procedureDocumentUrl_extraInitializers = [];
    let _toleranceSpecs_decorators;
    let _toleranceSpecs_initializers = [];
    let _toleranceSpecs_extraInitializers = [];
    let _isActive_decorators;
    let _isActive_initializers = [];
    let _isActive_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    let _schedules_decorators;
    let _schedules_initializers = [];
    let _schedules_extraInitializers = [];
    var CalibrationType = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.code = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _code_initializers, void 0));
            this.name = (__runInitializers(this, _code_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.defaultFrequency = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _defaultFrequency_initializers, void 0));
            this.requiredStandards = (__runInitializers(this, _defaultFrequency_extraInitializers), __runInitializers(this, _requiredStandards_initializers, void 0));
            this.procedureDocumentUrl = (__runInitializers(this, _requiredStandards_extraInitializers), __runInitializers(this, _procedureDocumentUrl_initializers, void 0));
            this.toleranceSpecs = (__runInitializers(this, _procedureDocumentUrl_extraInitializers), __runInitializers(this, _toleranceSpecs_initializers, void 0));
            this.isActive = (__runInitializers(this, _toleranceSpecs_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
            this.createdAt = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.schedules = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _schedules_initializers, void 0));
            __runInitializers(this, _schedules_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "CalibrationType");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _code_decorators = [(0, swagger_1.ApiProperty)({ description: 'Calibration type code' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50), allowNull: false, unique: true }), sequelize_typescript_1.Index];
        _name_decorators = [(0, swagger_1.ApiProperty)({ description: 'Calibration type name' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200), allowNull: false })];
        _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Description' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _defaultFrequency_decorators = [(0, swagger_1.ApiProperty)({ description: 'Default frequency' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(CalibrationFrequency)) })];
        _requiredStandards_decorators = [(0, swagger_1.ApiProperty)({ description: 'Required standards' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING) })];
        _procedureDocumentUrl_decorators = [(0, swagger_1.ApiProperty)({ description: 'Procedure document URL' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(500) })];
        _toleranceSpecs_decorators = [(0, swagger_1.ApiProperty)({ description: 'Tolerance specifications' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _isActive_decorators = [(0, swagger_1.ApiProperty)({ description: 'Whether type is active' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: true }), sequelize_typescript_1.Index];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        _schedules_decorators = [(0, sequelize_typescript_1.HasMany)(() => CalibrationSchedule)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _code_decorators, { kind: "field", name: "code", static: false, private: false, access: { has: obj => "code" in obj, get: obj => obj.code, set: (obj, value) => { obj.code = value; } }, metadata: _metadata }, _code_initializers, _code_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _defaultFrequency_decorators, { kind: "field", name: "defaultFrequency", static: false, private: false, access: { has: obj => "defaultFrequency" in obj, get: obj => obj.defaultFrequency, set: (obj, value) => { obj.defaultFrequency = value; } }, metadata: _metadata }, _defaultFrequency_initializers, _defaultFrequency_extraInitializers);
        __esDecorate(null, null, _requiredStandards_decorators, { kind: "field", name: "requiredStandards", static: false, private: false, access: { has: obj => "requiredStandards" in obj, get: obj => obj.requiredStandards, set: (obj, value) => { obj.requiredStandards = value; } }, metadata: _metadata }, _requiredStandards_initializers, _requiredStandards_extraInitializers);
        __esDecorate(null, null, _procedureDocumentUrl_decorators, { kind: "field", name: "procedureDocumentUrl", static: false, private: false, access: { has: obj => "procedureDocumentUrl" in obj, get: obj => obj.procedureDocumentUrl, set: (obj, value) => { obj.procedureDocumentUrl = value; } }, metadata: _metadata }, _procedureDocumentUrl_initializers, _procedureDocumentUrl_extraInitializers);
        __esDecorate(null, null, _toleranceSpecs_decorators, { kind: "field", name: "toleranceSpecs", static: false, private: false, access: { has: obj => "toleranceSpecs" in obj, get: obj => obj.toleranceSpecs, set: (obj, value) => { obj.toleranceSpecs = value; } }, metadata: _metadata }, _toleranceSpecs_initializers, _toleranceSpecs_extraInitializers);
        __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: obj => "isActive" in obj, get: obj => obj.isActive, set: (obj, value) => { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _schedules_decorators, { kind: "field", name: "schedules", static: false, private: false, access: { has: obj => "schedules" in obj, get: obj => obj.schedules, set: (obj, value) => { obj.schedules = value; } }, metadata: _metadata }, _schedules_initializers, _schedules_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CalibrationType = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CalibrationType = _classThis;
})();
exports.CalibrationType = CalibrationType;
/**
 * Calibration Schedule Model - Tracks calibration schedules for assets
 */
let CalibrationSchedule = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'calibration_schedules',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['asset_id'] },
                { fields: ['calibration_type_id'] },
                { fields: ['due_date'] },
                { fields: ['status'] },
                { fields: ['assigned_technician_id'] },
                { fields: ['assigned_vendor_id'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _assetId_decorators;
    let _assetId_initializers = [];
    let _assetId_extraInitializers = [];
    let _calibrationTypeId_decorators;
    let _calibrationTypeId_initializers = [];
    let _calibrationTypeId_extraInitializers = [];
    let _frequency_decorators;
    let _frequency_initializers = [];
    let _frequency_extraInitializers = [];
    let _scheduledDate_decorators;
    let _scheduledDate_initializers = [];
    let _scheduledDate_extraInitializers = [];
    let _dueDate_decorators;
    let _dueDate_initializers = [];
    let _dueDate_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _assignedTechnicianId_decorators;
    let _assignedTechnicianId_initializers = [];
    let _assignedTechnicianId_extraInitializers = [];
    let _assignedVendorId_decorators;
    let _assignedVendorId_initializers = [];
    let _assignedVendorId_extraInitializers = [];
    let _method_decorators;
    let _method_initializers = [];
    let _method_extraInitializers = [];
    let _standardIds_decorators;
    let _standardIds_initializers = [];
    let _standardIds_extraInitializers = [];
    let _procedureId_decorators;
    let _procedureId_initializers = [];
    let _procedureId_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    let _workOrderNumber_decorators;
    let _workOrderNumber_initializers = [];
    let _workOrderNumber_extraInitializers = [];
    let _estimatedDuration_decorators;
    let _estimatedDuration_initializers = [];
    let _estimatedDuration_extraInitializers = [];
    let _estimatedCost_decorators;
    let _estimatedCost_initializers = [];
    let _estimatedCost_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _reminderSentDate_decorators;
    let _reminderSentDate_initializers = [];
    let _reminderSentDate_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    let _calibrationType_decorators;
    let _calibrationType_initializers = [];
    let _calibrationType_extraInitializers = [];
    let _records_decorators;
    let _records_initializers = [];
    let _records_extraInitializers = [];
    var CalibrationSchedule = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.assetId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _assetId_initializers, void 0));
            this.calibrationTypeId = (__runInitializers(this, _assetId_extraInitializers), __runInitializers(this, _calibrationTypeId_initializers, void 0));
            this.frequency = (__runInitializers(this, _calibrationTypeId_extraInitializers), __runInitializers(this, _frequency_initializers, void 0));
            this.scheduledDate = (__runInitializers(this, _frequency_extraInitializers), __runInitializers(this, _scheduledDate_initializers, void 0));
            this.dueDate = (__runInitializers(this, _scheduledDate_extraInitializers), __runInitializers(this, _dueDate_initializers, void 0));
            this.status = (__runInitializers(this, _dueDate_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.assignedTechnicianId = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _assignedTechnicianId_initializers, void 0));
            this.assignedVendorId = (__runInitializers(this, _assignedTechnicianId_extraInitializers), __runInitializers(this, _assignedVendorId_initializers, void 0));
            this.method = (__runInitializers(this, _assignedVendorId_extraInitializers), __runInitializers(this, _method_initializers, void 0));
            this.standardIds = (__runInitializers(this, _method_extraInitializers), __runInitializers(this, _standardIds_initializers, void 0));
            this.procedureId = (__runInitializers(this, _standardIds_extraInitializers), __runInitializers(this, _procedureId_initializers, void 0));
            this.priority = (__runInitializers(this, _procedureId_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
            this.workOrderNumber = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _workOrderNumber_initializers, void 0));
            this.estimatedDuration = (__runInitializers(this, _workOrderNumber_extraInitializers), __runInitializers(this, _estimatedDuration_initializers, void 0));
            this.estimatedCost = (__runInitializers(this, _estimatedDuration_extraInitializers), __runInitializers(this, _estimatedCost_initializers, void 0));
            this.notes = (__runInitializers(this, _estimatedCost_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.reminderSentDate = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _reminderSentDate_initializers, void 0));
            this.createdAt = (__runInitializers(this, _reminderSentDate_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.calibrationType = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _calibrationType_initializers, void 0));
            this.records = (__runInitializers(this, _calibrationType_extraInitializers), __runInitializers(this, _records_initializers, void 0));
            __runInitializers(this, _records_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "CalibrationSchedule");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _assetId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Asset ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _calibrationTypeId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Calibration type ID' }), (0, sequelize_typescript_1.ForeignKey)(() => CalibrationType), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _frequency_decorators = [(0, swagger_1.ApiProperty)({ description: 'Calibration frequency' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(CalibrationFrequency)),
                allowNull: false,
            })];
        _scheduledDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Scheduled date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _dueDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Due date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false }), sequelize_typescript_1.Index];
        _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'Calibration status' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(CalibrationStatus)),
                defaultValue: CalibrationStatus.SCHEDULED,
            }), sequelize_typescript_1.Index];
        _assignedTechnicianId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Assigned technician ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID }), sequelize_typescript_1.Index];
        _assignedVendorId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Assigned vendor ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID }), sequelize_typescript_1.Index];
        _method_decorators = [(0, swagger_1.ApiProperty)({ description: 'Calibration method' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(CalibrationMethod)) })];
        _standardIds_decorators = [(0, swagger_1.ApiProperty)({ description: 'Standard IDs to be used' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.UUID) })];
        _procedureId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Procedure ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _priority_decorators = [(0, swagger_1.ApiProperty)({ description: 'Priority level' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM('critical', 'high', 'medium', 'low') })];
        _workOrderNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Work order number' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100) })];
        _estimatedDuration_decorators = [(0, swagger_1.ApiProperty)({ description: 'Estimated duration in hours' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(5, 2) })];
        _estimatedCost_decorators = [(0, swagger_1.ApiProperty)({ description: 'Estimated cost' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(12, 2) })];
        _notes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Notes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _reminderSentDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Reminder sent date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        _calibrationType_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => CalibrationType)];
        _records_decorators = [(0, sequelize_typescript_1.HasMany)(() => CalibrationRecord)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _assetId_decorators, { kind: "field", name: "assetId", static: false, private: false, access: { has: obj => "assetId" in obj, get: obj => obj.assetId, set: (obj, value) => { obj.assetId = value; } }, metadata: _metadata }, _assetId_initializers, _assetId_extraInitializers);
        __esDecorate(null, null, _calibrationTypeId_decorators, { kind: "field", name: "calibrationTypeId", static: false, private: false, access: { has: obj => "calibrationTypeId" in obj, get: obj => obj.calibrationTypeId, set: (obj, value) => { obj.calibrationTypeId = value; } }, metadata: _metadata }, _calibrationTypeId_initializers, _calibrationTypeId_extraInitializers);
        __esDecorate(null, null, _frequency_decorators, { kind: "field", name: "frequency", static: false, private: false, access: { has: obj => "frequency" in obj, get: obj => obj.frequency, set: (obj, value) => { obj.frequency = value; } }, metadata: _metadata }, _frequency_initializers, _frequency_extraInitializers);
        __esDecorate(null, null, _scheduledDate_decorators, { kind: "field", name: "scheduledDate", static: false, private: false, access: { has: obj => "scheduledDate" in obj, get: obj => obj.scheduledDate, set: (obj, value) => { obj.scheduledDate = value; } }, metadata: _metadata }, _scheduledDate_initializers, _scheduledDate_extraInitializers);
        __esDecorate(null, null, _dueDate_decorators, { kind: "field", name: "dueDate", static: false, private: false, access: { has: obj => "dueDate" in obj, get: obj => obj.dueDate, set: (obj, value) => { obj.dueDate = value; } }, metadata: _metadata }, _dueDate_initializers, _dueDate_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _assignedTechnicianId_decorators, { kind: "field", name: "assignedTechnicianId", static: false, private: false, access: { has: obj => "assignedTechnicianId" in obj, get: obj => obj.assignedTechnicianId, set: (obj, value) => { obj.assignedTechnicianId = value; } }, metadata: _metadata }, _assignedTechnicianId_initializers, _assignedTechnicianId_extraInitializers);
        __esDecorate(null, null, _assignedVendorId_decorators, { kind: "field", name: "assignedVendorId", static: false, private: false, access: { has: obj => "assignedVendorId" in obj, get: obj => obj.assignedVendorId, set: (obj, value) => { obj.assignedVendorId = value; } }, metadata: _metadata }, _assignedVendorId_initializers, _assignedVendorId_extraInitializers);
        __esDecorate(null, null, _method_decorators, { kind: "field", name: "method", static: false, private: false, access: { has: obj => "method" in obj, get: obj => obj.method, set: (obj, value) => { obj.method = value; } }, metadata: _metadata }, _method_initializers, _method_extraInitializers);
        __esDecorate(null, null, _standardIds_decorators, { kind: "field", name: "standardIds", static: false, private: false, access: { has: obj => "standardIds" in obj, get: obj => obj.standardIds, set: (obj, value) => { obj.standardIds = value; } }, metadata: _metadata }, _standardIds_initializers, _standardIds_extraInitializers);
        __esDecorate(null, null, _procedureId_decorators, { kind: "field", name: "procedureId", static: false, private: false, access: { has: obj => "procedureId" in obj, get: obj => obj.procedureId, set: (obj, value) => { obj.procedureId = value; } }, metadata: _metadata }, _procedureId_initializers, _procedureId_extraInitializers);
        __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
        __esDecorate(null, null, _workOrderNumber_decorators, { kind: "field", name: "workOrderNumber", static: false, private: false, access: { has: obj => "workOrderNumber" in obj, get: obj => obj.workOrderNumber, set: (obj, value) => { obj.workOrderNumber = value; } }, metadata: _metadata }, _workOrderNumber_initializers, _workOrderNumber_extraInitializers);
        __esDecorate(null, null, _estimatedDuration_decorators, { kind: "field", name: "estimatedDuration", static: false, private: false, access: { has: obj => "estimatedDuration" in obj, get: obj => obj.estimatedDuration, set: (obj, value) => { obj.estimatedDuration = value; } }, metadata: _metadata }, _estimatedDuration_initializers, _estimatedDuration_extraInitializers);
        __esDecorate(null, null, _estimatedCost_decorators, { kind: "field", name: "estimatedCost", static: false, private: false, access: { has: obj => "estimatedCost" in obj, get: obj => obj.estimatedCost, set: (obj, value) => { obj.estimatedCost = value; } }, metadata: _metadata }, _estimatedCost_initializers, _estimatedCost_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _reminderSentDate_decorators, { kind: "field", name: "reminderSentDate", static: false, private: false, access: { has: obj => "reminderSentDate" in obj, get: obj => obj.reminderSentDate, set: (obj, value) => { obj.reminderSentDate = value; } }, metadata: _metadata }, _reminderSentDate_initializers, _reminderSentDate_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _calibrationType_decorators, { kind: "field", name: "calibrationType", static: false, private: false, access: { has: obj => "calibrationType" in obj, get: obj => obj.calibrationType, set: (obj, value) => { obj.calibrationType = value; } }, metadata: _metadata }, _calibrationType_initializers, _calibrationType_extraInitializers);
        __esDecorate(null, null, _records_decorators, { kind: "field", name: "records", static: false, private: false, access: { has: obj => "records" in obj, get: obj => obj.records, set: (obj, value) => { obj.records = value; } }, metadata: _metadata }, _records_initializers, _records_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CalibrationSchedule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CalibrationSchedule = _classThis;
})();
exports.CalibrationSchedule = CalibrationSchedule;
/**
 * Calibration Record Model - Records actual calibration execution and results
 */
let CalibrationRecord = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'calibration_records',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['schedule_id'] },
                { fields: ['asset_id'] },
                { fields: ['performed_date'] },
                { fields: ['result'] },
                { fields: ['certificate_number'] },
                { fields: ['performed_by'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _scheduleId_decorators;
    let _scheduleId_initializers = [];
    let _scheduleId_extraInitializers = [];
    let _assetId_decorators;
    let _assetId_initializers = [];
    let _assetId_extraInitializers = [];
    let _performedBy_decorators;
    let _performedBy_initializers = [];
    let _performedBy_extraInitializers = [];
    let _performedDate_decorators;
    let _performedDate_initializers = [];
    let _performedDate_extraInitializers = [];
    let _completionDate_decorators;
    let _completionDate_initializers = [];
    let _completionDate_extraInitializers = [];
    let _result_decorators;
    let _result_initializers = [];
    let _result_extraInitializers = [];
    let _passed_decorators;
    let _passed_initializers = [];
    let _passed_extraInitializers = [];
    let _certificateNumber_decorators;
    let _certificateNumber_initializers = [];
    let _certificateNumber_extraInitializers = [];
    let _measurements_decorators;
    let _measurements_initializers = [];
    let _measurements_extraInitializers = [];
    let _environmentalConditions_decorators;
    let _environmentalConditions_initializers = [];
    let _environmentalConditions_extraInitializers = [];
    let _equipmentUsed_decorators;
    let _equipmentUsed_initializers = [];
    let _equipmentUsed_extraInitializers = [];
    let _standardsUsed_decorators;
    let _standardsUsed_initializers = [];
    let _standardsUsed_extraInitializers = [];
    let _adjustmentsMade_decorators;
    let _adjustmentsMade_initializers = [];
    let _adjustmentsMade_extraInitializers = [];
    let _deviations_decorators;
    let _deviations_initializers = [];
    let _deviations_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _actualDuration_decorators;
    let _actualDuration_initializers = [];
    let _actualDuration_extraInitializers = [];
    let _actualCost_decorators;
    let _actualCost_initializers = [];
    let _actualCost_extraInitializers = [];
    let _nextDueDate_decorators;
    let _nextDueDate_initializers = [];
    let _nextDueDate_extraInitializers = [];
    let _reviewedBy_decorators;
    let _reviewedBy_initializers = [];
    let _reviewedBy_extraInitializers = [];
    let _reviewDate_decorators;
    let _reviewDate_initializers = [];
    let _reviewDate_extraInitializers = [];
    let _approvedBy_decorators;
    let _approvedBy_initializers = [];
    let _approvedBy_extraInitializers = [];
    let _approvalDate_decorators;
    let _approvalDate_initializers = [];
    let _approvalDate_extraInitializers = [];
    let _certificateFilePath_decorators;
    let _certificateFilePath_initializers = [];
    let _certificateFilePath_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    let _schedule_decorators;
    let _schedule_initializers = [];
    let _schedule_extraInitializers = [];
    let _ootActions_decorators;
    let _ootActions_initializers = [];
    let _ootActions_extraInitializers = [];
    var CalibrationRecord = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.scheduleId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _scheduleId_initializers, void 0));
            this.assetId = (__runInitializers(this, _scheduleId_extraInitializers), __runInitializers(this, _assetId_initializers, void 0));
            this.performedBy = (__runInitializers(this, _assetId_extraInitializers), __runInitializers(this, _performedBy_initializers, void 0));
            this.performedDate = (__runInitializers(this, _performedBy_extraInitializers), __runInitializers(this, _performedDate_initializers, void 0));
            this.completionDate = (__runInitializers(this, _performedDate_extraInitializers), __runInitializers(this, _completionDate_initializers, void 0));
            this.result = (__runInitializers(this, _completionDate_extraInitializers), __runInitializers(this, _result_initializers, void 0));
            this.passed = (__runInitializers(this, _result_extraInitializers), __runInitializers(this, _passed_initializers, void 0));
            this.certificateNumber = (__runInitializers(this, _passed_extraInitializers), __runInitializers(this, _certificateNumber_initializers, void 0));
            this.measurements = (__runInitializers(this, _certificateNumber_extraInitializers), __runInitializers(this, _measurements_initializers, void 0));
            this.environmentalConditions = (__runInitializers(this, _measurements_extraInitializers), __runInitializers(this, _environmentalConditions_initializers, void 0));
            this.equipmentUsed = (__runInitializers(this, _environmentalConditions_extraInitializers), __runInitializers(this, _equipmentUsed_initializers, void 0));
            this.standardsUsed = (__runInitializers(this, _equipmentUsed_extraInitializers), __runInitializers(this, _standardsUsed_initializers, void 0));
            this.adjustmentsMade = (__runInitializers(this, _standardsUsed_extraInitializers), __runInitializers(this, _adjustmentsMade_initializers, void 0));
            this.deviations = (__runInitializers(this, _adjustmentsMade_extraInitializers), __runInitializers(this, _deviations_initializers, void 0));
            this.notes = (__runInitializers(this, _deviations_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.actualDuration = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _actualDuration_initializers, void 0));
            this.actualCost = (__runInitializers(this, _actualDuration_extraInitializers), __runInitializers(this, _actualCost_initializers, void 0));
            this.nextDueDate = (__runInitializers(this, _actualCost_extraInitializers), __runInitializers(this, _nextDueDate_initializers, void 0));
            this.reviewedBy = (__runInitializers(this, _nextDueDate_extraInitializers), __runInitializers(this, _reviewedBy_initializers, void 0));
            this.reviewDate = (__runInitializers(this, _reviewedBy_extraInitializers), __runInitializers(this, _reviewDate_initializers, void 0));
            this.approvedBy = (__runInitializers(this, _reviewDate_extraInitializers), __runInitializers(this, _approvedBy_initializers, void 0));
            this.approvalDate = (__runInitializers(this, _approvedBy_extraInitializers), __runInitializers(this, _approvalDate_initializers, void 0));
            this.certificateFilePath = (__runInitializers(this, _approvalDate_extraInitializers), __runInitializers(this, _certificateFilePath_initializers, void 0));
            this.createdAt = (__runInitializers(this, _certificateFilePath_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.schedule = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _schedule_initializers, void 0));
            this.ootActions = (__runInitializers(this, _schedule_extraInitializers), __runInitializers(this, _ootActions_initializers, void 0));
            __runInitializers(this, _ootActions_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "CalibrationRecord");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _scheduleId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Schedule ID' }), (0, sequelize_typescript_1.ForeignKey)(() => CalibrationSchedule), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _assetId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Asset ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _performedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Performed by user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _performedDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Performed date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false }), sequelize_typescript_1.Index];
        _completionDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Completion date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _result_decorators = [(0, swagger_1.ApiProperty)({ description: 'Calibration result' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(CalibrationResult)),
                allowNull: false,
            }), sequelize_typescript_1.Index];
        _passed_decorators = [(0, swagger_1.ApiProperty)({ description: 'Passed indicator' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, allowNull: false })];
        _certificateNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Certificate number' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100), unique: true }), sequelize_typescript_1.Index];
        _measurements_decorators = [(0, swagger_1.ApiProperty)({ description: 'Measurements data' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: false })];
        _environmentalConditions_decorators = [(0, swagger_1.ApiProperty)({ description: 'Environmental conditions' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _equipmentUsed_decorators = [(0, swagger_1.ApiProperty)({ description: 'Equipment used' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING) })];
        _standardsUsed_decorators = [(0, swagger_1.ApiProperty)({ description: 'Standards used' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.UUID) })];
        _adjustmentsMade_decorators = [(0, swagger_1.ApiProperty)({ description: 'Adjustments made' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _deviations_decorators = [(0, swagger_1.ApiProperty)({ description: 'Deviations from procedure' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _notes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Notes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _actualDuration_decorators = [(0, swagger_1.ApiProperty)({ description: 'Actual duration in hours' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(5, 2) })];
        _actualCost_decorators = [(0, swagger_1.ApiProperty)({ description: 'Actual cost' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(12, 2) })];
        _nextDueDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Next calibration due date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _reviewedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Reviewed by user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _reviewDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Review date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _approvedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Approved by user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _approvalDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Approval date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _certificateFilePath_decorators = [(0, swagger_1.ApiProperty)({ description: 'Certificate file path' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(500) })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        _schedule_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => CalibrationSchedule)];
        _ootActions_decorators = [(0, sequelize_typescript_1.HasMany)(() => OutOfToleranceAction)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _scheduleId_decorators, { kind: "field", name: "scheduleId", static: false, private: false, access: { has: obj => "scheduleId" in obj, get: obj => obj.scheduleId, set: (obj, value) => { obj.scheduleId = value; } }, metadata: _metadata }, _scheduleId_initializers, _scheduleId_extraInitializers);
        __esDecorate(null, null, _assetId_decorators, { kind: "field", name: "assetId", static: false, private: false, access: { has: obj => "assetId" in obj, get: obj => obj.assetId, set: (obj, value) => { obj.assetId = value; } }, metadata: _metadata }, _assetId_initializers, _assetId_extraInitializers);
        __esDecorate(null, null, _performedBy_decorators, { kind: "field", name: "performedBy", static: false, private: false, access: { has: obj => "performedBy" in obj, get: obj => obj.performedBy, set: (obj, value) => { obj.performedBy = value; } }, metadata: _metadata }, _performedBy_initializers, _performedBy_extraInitializers);
        __esDecorate(null, null, _performedDate_decorators, { kind: "field", name: "performedDate", static: false, private: false, access: { has: obj => "performedDate" in obj, get: obj => obj.performedDate, set: (obj, value) => { obj.performedDate = value; } }, metadata: _metadata }, _performedDate_initializers, _performedDate_extraInitializers);
        __esDecorate(null, null, _completionDate_decorators, { kind: "field", name: "completionDate", static: false, private: false, access: { has: obj => "completionDate" in obj, get: obj => obj.completionDate, set: (obj, value) => { obj.completionDate = value; } }, metadata: _metadata }, _completionDate_initializers, _completionDate_extraInitializers);
        __esDecorate(null, null, _result_decorators, { kind: "field", name: "result", static: false, private: false, access: { has: obj => "result" in obj, get: obj => obj.result, set: (obj, value) => { obj.result = value; } }, metadata: _metadata }, _result_initializers, _result_extraInitializers);
        __esDecorate(null, null, _passed_decorators, { kind: "field", name: "passed", static: false, private: false, access: { has: obj => "passed" in obj, get: obj => obj.passed, set: (obj, value) => { obj.passed = value; } }, metadata: _metadata }, _passed_initializers, _passed_extraInitializers);
        __esDecorate(null, null, _certificateNumber_decorators, { kind: "field", name: "certificateNumber", static: false, private: false, access: { has: obj => "certificateNumber" in obj, get: obj => obj.certificateNumber, set: (obj, value) => { obj.certificateNumber = value; } }, metadata: _metadata }, _certificateNumber_initializers, _certificateNumber_extraInitializers);
        __esDecorate(null, null, _measurements_decorators, { kind: "field", name: "measurements", static: false, private: false, access: { has: obj => "measurements" in obj, get: obj => obj.measurements, set: (obj, value) => { obj.measurements = value; } }, metadata: _metadata }, _measurements_initializers, _measurements_extraInitializers);
        __esDecorate(null, null, _environmentalConditions_decorators, { kind: "field", name: "environmentalConditions", static: false, private: false, access: { has: obj => "environmentalConditions" in obj, get: obj => obj.environmentalConditions, set: (obj, value) => { obj.environmentalConditions = value; } }, metadata: _metadata }, _environmentalConditions_initializers, _environmentalConditions_extraInitializers);
        __esDecorate(null, null, _equipmentUsed_decorators, { kind: "field", name: "equipmentUsed", static: false, private: false, access: { has: obj => "equipmentUsed" in obj, get: obj => obj.equipmentUsed, set: (obj, value) => { obj.equipmentUsed = value; } }, metadata: _metadata }, _equipmentUsed_initializers, _equipmentUsed_extraInitializers);
        __esDecorate(null, null, _standardsUsed_decorators, { kind: "field", name: "standardsUsed", static: false, private: false, access: { has: obj => "standardsUsed" in obj, get: obj => obj.standardsUsed, set: (obj, value) => { obj.standardsUsed = value; } }, metadata: _metadata }, _standardsUsed_initializers, _standardsUsed_extraInitializers);
        __esDecorate(null, null, _adjustmentsMade_decorators, { kind: "field", name: "adjustmentsMade", static: false, private: false, access: { has: obj => "adjustmentsMade" in obj, get: obj => obj.adjustmentsMade, set: (obj, value) => { obj.adjustmentsMade = value; } }, metadata: _metadata }, _adjustmentsMade_initializers, _adjustmentsMade_extraInitializers);
        __esDecorate(null, null, _deviations_decorators, { kind: "field", name: "deviations", static: false, private: false, access: { has: obj => "deviations" in obj, get: obj => obj.deviations, set: (obj, value) => { obj.deviations = value; } }, metadata: _metadata }, _deviations_initializers, _deviations_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _actualDuration_decorators, { kind: "field", name: "actualDuration", static: false, private: false, access: { has: obj => "actualDuration" in obj, get: obj => obj.actualDuration, set: (obj, value) => { obj.actualDuration = value; } }, metadata: _metadata }, _actualDuration_initializers, _actualDuration_extraInitializers);
        __esDecorate(null, null, _actualCost_decorators, { kind: "field", name: "actualCost", static: false, private: false, access: { has: obj => "actualCost" in obj, get: obj => obj.actualCost, set: (obj, value) => { obj.actualCost = value; } }, metadata: _metadata }, _actualCost_initializers, _actualCost_extraInitializers);
        __esDecorate(null, null, _nextDueDate_decorators, { kind: "field", name: "nextDueDate", static: false, private: false, access: { has: obj => "nextDueDate" in obj, get: obj => obj.nextDueDate, set: (obj, value) => { obj.nextDueDate = value; } }, metadata: _metadata }, _nextDueDate_initializers, _nextDueDate_extraInitializers);
        __esDecorate(null, null, _reviewedBy_decorators, { kind: "field", name: "reviewedBy", static: false, private: false, access: { has: obj => "reviewedBy" in obj, get: obj => obj.reviewedBy, set: (obj, value) => { obj.reviewedBy = value; } }, metadata: _metadata }, _reviewedBy_initializers, _reviewedBy_extraInitializers);
        __esDecorate(null, null, _reviewDate_decorators, { kind: "field", name: "reviewDate", static: false, private: false, access: { has: obj => "reviewDate" in obj, get: obj => obj.reviewDate, set: (obj, value) => { obj.reviewDate = value; } }, metadata: _metadata }, _reviewDate_initializers, _reviewDate_extraInitializers);
        __esDecorate(null, null, _approvedBy_decorators, { kind: "field", name: "approvedBy", static: false, private: false, access: { has: obj => "approvedBy" in obj, get: obj => obj.approvedBy, set: (obj, value) => { obj.approvedBy = value; } }, metadata: _metadata }, _approvedBy_initializers, _approvedBy_extraInitializers);
        __esDecorate(null, null, _approvalDate_decorators, { kind: "field", name: "approvalDate", static: false, private: false, access: { has: obj => "approvalDate" in obj, get: obj => obj.approvalDate, set: (obj, value) => { obj.approvalDate = value; } }, metadata: _metadata }, _approvalDate_initializers, _approvalDate_extraInitializers);
        __esDecorate(null, null, _certificateFilePath_decorators, { kind: "field", name: "certificateFilePath", static: false, private: false, access: { has: obj => "certificateFilePath" in obj, get: obj => obj.certificateFilePath, set: (obj, value) => { obj.certificateFilePath = value; } }, metadata: _metadata }, _certificateFilePath_initializers, _certificateFilePath_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _schedule_decorators, { kind: "field", name: "schedule", static: false, private: false, access: { has: obj => "schedule" in obj, get: obj => obj.schedule, set: (obj, value) => { obj.schedule = value; } }, metadata: _metadata }, _schedule_initializers, _schedule_extraInitializers);
        __esDecorate(null, null, _ootActions_decorators, { kind: "field", name: "ootActions", static: false, private: false, access: { has: obj => "ootActions" in obj, get: obj => obj.ootActions, set: (obj, value) => { obj.ootActions = value; } }, metadata: _metadata }, _ootActions_initializers, _ootActions_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CalibrationRecord = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CalibrationRecord = _classThis;
})();
exports.CalibrationRecord = CalibrationRecord;
/**
 * Calibration Standard Model - Manages calibration standards and traceability
 */
let CalibrationStandard = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'calibration_standards',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['standard_number'], unique: true },
                { fields: ['traceability_source'] },
                { fields: ['expiration_date'] },
                { fields: ['location'] },
                { fields: ['is_active'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _standardNumber_decorators;
    let _standardNumber_initializers = [];
    let _standardNumber_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _traceabilitySource_decorators;
    let _traceabilitySource_initializers = [];
    let _traceabilitySource_extraInitializers = [];
    let _traceabilityCertificateNumber_decorators;
    let _traceabilityCertificateNumber_initializers = [];
    let _traceabilityCertificateNumber_extraInitializers = [];
    let _manufacturer_decorators;
    let _manufacturer_initializers = [];
    let _manufacturer_extraInitializers = [];
    let _model_decorators;
    let _model_initializers = [];
    let _model_extraInitializers = [];
    let _serialNumber_decorators;
    let _serialNumber_initializers = [];
    let _serialNumber_extraInitializers = [];
    let _calibrationDate_decorators;
    let _calibrationDate_initializers = [];
    let _calibrationDate_extraInitializers = [];
    let _expirationDate_decorators;
    let _expirationDate_initializers = [];
    let _expirationDate_extraInitializers = [];
    let _uncertaintyValue_decorators;
    let _uncertaintyValue_initializers = [];
    let _uncertaintyValue_extraInitializers = [];
    let _uncertaintyUnit_decorators;
    let _uncertaintyUnit_initializers = [];
    let _uncertaintyUnit_extraInitializers = [];
    let _custodian_decorators;
    let _custodian_initializers = [];
    let _custodian_extraInitializers = [];
    let _location_decorators;
    let _location_initializers = [];
    let _location_extraInitializers = [];
    let _certificateFilePath_decorators;
    let _certificateFilePath_initializers = [];
    let _certificateFilePath_extraInitializers = [];
    let _specifications_decorators;
    let _specifications_initializers = [];
    let _specifications_extraInitializers = [];
    let _isActive_decorators;
    let _isActive_initializers = [];
    let _isActive_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var CalibrationStandard = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.standardNumber = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _standardNumber_initializers, void 0));
            this.description = (__runInitializers(this, _standardNumber_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.traceabilitySource = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _traceabilitySource_initializers, void 0));
            this.traceabilityCertificateNumber = (__runInitializers(this, _traceabilitySource_extraInitializers), __runInitializers(this, _traceabilityCertificateNumber_initializers, void 0));
            this.manufacturer = (__runInitializers(this, _traceabilityCertificateNumber_extraInitializers), __runInitializers(this, _manufacturer_initializers, void 0));
            this.model = (__runInitializers(this, _manufacturer_extraInitializers), __runInitializers(this, _model_initializers, void 0));
            this.serialNumber = (__runInitializers(this, _model_extraInitializers), __runInitializers(this, _serialNumber_initializers, void 0));
            this.calibrationDate = (__runInitializers(this, _serialNumber_extraInitializers), __runInitializers(this, _calibrationDate_initializers, void 0));
            this.expirationDate = (__runInitializers(this, _calibrationDate_extraInitializers), __runInitializers(this, _expirationDate_initializers, void 0));
            this.uncertaintyValue = (__runInitializers(this, _expirationDate_extraInitializers), __runInitializers(this, _uncertaintyValue_initializers, void 0));
            this.uncertaintyUnit = (__runInitializers(this, _uncertaintyValue_extraInitializers), __runInitializers(this, _uncertaintyUnit_initializers, void 0));
            this.custodian = (__runInitializers(this, _uncertaintyUnit_extraInitializers), __runInitializers(this, _custodian_initializers, void 0));
            this.location = (__runInitializers(this, _custodian_extraInitializers), __runInitializers(this, _location_initializers, void 0));
            this.certificateFilePath = (__runInitializers(this, _location_extraInitializers), __runInitializers(this, _certificateFilePath_initializers, void 0));
            this.specifications = (__runInitializers(this, _certificateFilePath_extraInitializers), __runInitializers(this, _specifications_initializers, void 0));
            this.isActive = (__runInitializers(this, _specifications_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
            this.notes = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.createdAt = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "CalibrationStandard");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _standardNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Standard number' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100), allowNull: false, unique: true }), sequelize_typescript_1.Index];
        _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Description' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: false })];
        _traceabilitySource_decorators = [(0, swagger_1.ApiProperty)({ description: 'Traceability source' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(TraceabilitySource)),
                allowNull: false,
            }), sequelize_typescript_1.Index];
        _traceabilityCertificateNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Traceability certificate number' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100) })];
        _manufacturer_decorators = [(0, swagger_1.ApiProperty)({ description: 'Manufacturer' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200) })];
        _model_decorators = [(0, swagger_1.ApiProperty)({ description: 'Model' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200) })];
        _serialNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Serial number' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200) })];
        _calibrationDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Calibration date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false })];
        _expirationDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Expiration date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false }), sequelize_typescript_1.Index];
        _uncertaintyValue_decorators = [(0, swagger_1.ApiProperty)({ description: 'Uncertainty value' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(15, 6) })];
        _uncertaintyUnit_decorators = [(0, swagger_1.ApiProperty)({ description: 'Uncertainty unit' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50) })];
        _custodian_decorators = [(0, swagger_1.ApiProperty)({ description: 'Custodian user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _location_decorators = [(0, swagger_1.ApiProperty)({ description: 'Storage location' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200) }), sequelize_typescript_1.Index];
        _certificateFilePath_decorators = [(0, swagger_1.ApiProperty)({ description: 'Certificate file path' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(500) })];
        _specifications_decorators = [(0, swagger_1.ApiProperty)({ description: 'Specifications' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _isActive_decorators = [(0, swagger_1.ApiProperty)({ description: 'Whether standard is active' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: true }), sequelize_typescript_1.Index];
        _notes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Notes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _standardNumber_decorators, { kind: "field", name: "standardNumber", static: false, private: false, access: { has: obj => "standardNumber" in obj, get: obj => obj.standardNumber, set: (obj, value) => { obj.standardNumber = value; } }, metadata: _metadata }, _standardNumber_initializers, _standardNumber_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _traceabilitySource_decorators, { kind: "field", name: "traceabilitySource", static: false, private: false, access: { has: obj => "traceabilitySource" in obj, get: obj => obj.traceabilitySource, set: (obj, value) => { obj.traceabilitySource = value; } }, metadata: _metadata }, _traceabilitySource_initializers, _traceabilitySource_extraInitializers);
        __esDecorate(null, null, _traceabilityCertificateNumber_decorators, { kind: "field", name: "traceabilityCertificateNumber", static: false, private: false, access: { has: obj => "traceabilityCertificateNumber" in obj, get: obj => obj.traceabilityCertificateNumber, set: (obj, value) => { obj.traceabilityCertificateNumber = value; } }, metadata: _metadata }, _traceabilityCertificateNumber_initializers, _traceabilityCertificateNumber_extraInitializers);
        __esDecorate(null, null, _manufacturer_decorators, { kind: "field", name: "manufacturer", static: false, private: false, access: { has: obj => "manufacturer" in obj, get: obj => obj.manufacturer, set: (obj, value) => { obj.manufacturer = value; } }, metadata: _metadata }, _manufacturer_initializers, _manufacturer_extraInitializers);
        __esDecorate(null, null, _model_decorators, { kind: "field", name: "model", static: false, private: false, access: { has: obj => "model" in obj, get: obj => obj.model, set: (obj, value) => { obj.model = value; } }, metadata: _metadata }, _model_initializers, _model_extraInitializers);
        __esDecorate(null, null, _serialNumber_decorators, { kind: "field", name: "serialNumber", static: false, private: false, access: { has: obj => "serialNumber" in obj, get: obj => obj.serialNumber, set: (obj, value) => { obj.serialNumber = value; } }, metadata: _metadata }, _serialNumber_initializers, _serialNumber_extraInitializers);
        __esDecorate(null, null, _calibrationDate_decorators, { kind: "field", name: "calibrationDate", static: false, private: false, access: { has: obj => "calibrationDate" in obj, get: obj => obj.calibrationDate, set: (obj, value) => { obj.calibrationDate = value; } }, metadata: _metadata }, _calibrationDate_initializers, _calibrationDate_extraInitializers);
        __esDecorate(null, null, _expirationDate_decorators, { kind: "field", name: "expirationDate", static: false, private: false, access: { has: obj => "expirationDate" in obj, get: obj => obj.expirationDate, set: (obj, value) => { obj.expirationDate = value; } }, metadata: _metadata }, _expirationDate_initializers, _expirationDate_extraInitializers);
        __esDecorate(null, null, _uncertaintyValue_decorators, { kind: "field", name: "uncertaintyValue", static: false, private: false, access: { has: obj => "uncertaintyValue" in obj, get: obj => obj.uncertaintyValue, set: (obj, value) => { obj.uncertaintyValue = value; } }, metadata: _metadata }, _uncertaintyValue_initializers, _uncertaintyValue_extraInitializers);
        __esDecorate(null, null, _uncertaintyUnit_decorators, { kind: "field", name: "uncertaintyUnit", static: false, private: false, access: { has: obj => "uncertaintyUnit" in obj, get: obj => obj.uncertaintyUnit, set: (obj, value) => { obj.uncertaintyUnit = value; } }, metadata: _metadata }, _uncertaintyUnit_initializers, _uncertaintyUnit_extraInitializers);
        __esDecorate(null, null, _custodian_decorators, { kind: "field", name: "custodian", static: false, private: false, access: { has: obj => "custodian" in obj, get: obj => obj.custodian, set: (obj, value) => { obj.custodian = value; } }, metadata: _metadata }, _custodian_initializers, _custodian_extraInitializers);
        __esDecorate(null, null, _location_decorators, { kind: "field", name: "location", static: false, private: false, access: { has: obj => "location" in obj, get: obj => obj.location, set: (obj, value) => { obj.location = value; } }, metadata: _metadata }, _location_initializers, _location_extraInitializers);
        __esDecorate(null, null, _certificateFilePath_decorators, { kind: "field", name: "certificateFilePath", static: false, private: false, access: { has: obj => "certificateFilePath" in obj, get: obj => obj.certificateFilePath, set: (obj, value) => { obj.certificateFilePath = value; } }, metadata: _metadata }, _certificateFilePath_initializers, _certificateFilePath_extraInitializers);
        __esDecorate(null, null, _specifications_decorators, { kind: "field", name: "specifications", static: false, private: false, access: { has: obj => "specifications" in obj, get: obj => obj.specifications, set: (obj, value) => { obj.specifications = value; } }, metadata: _metadata }, _specifications_initializers, _specifications_extraInitializers);
        __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: obj => "isActive" in obj, get: obj => obj.isActive, set: (obj, value) => { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CalibrationStandard = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CalibrationStandard = _classThis;
})();
exports.CalibrationStandard = CalibrationStandard;
/**
 * Out-of-Tolerance Action Model - Tracks OOT handling and corrective actions
 */
let OutOfToleranceAction = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'out_of_tolerance_actions',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['calibration_record_id'] },
                { fields: ['action'] },
                { fields: ['status'] },
                { fields: ['assigned_to'] },
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
    let _calibrationRecordId_decorators;
    let _calibrationRecordId_initializers = [];
    let _calibrationRecordId_extraInitializers = [];
    let _action_decorators;
    let _action_initializers = [];
    let _action_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _assignedTo_decorators;
    let _assignedTo_initializers = [];
    let _assignedTo_extraInitializers = [];
    let _dueDate_decorators;
    let _dueDate_initializers = [];
    let _dueDate_extraInitializers = [];
    let _rootCause_decorators;
    let _rootCause_initializers = [];
    let _rootCause_extraInitializers = [];
    let _correctiveAction_decorators;
    let _correctiveAction_initializers = [];
    let _correctiveAction_extraInitializers = [];
    let _preventiveAction_decorators;
    let _preventiveAction_initializers = [];
    let _preventiveAction_extraInitializers = [];
    let _impactAssessment_decorators;
    let _impactAssessment_initializers = [];
    let _impactAssessment_extraInitializers = [];
    let _affectedAssets_decorators;
    let _affectedAssets_initializers = [];
    let _affectedAssets_extraInitializers = [];
    let _notificationsSent_decorators;
    let _notificationsSent_initializers = [];
    let _notificationsSent_extraInitializers = [];
    let _completionDate_decorators;
    let _completionDate_initializers = [];
    let _completionDate_extraInitializers = [];
    let _completedBy_decorators;
    let _completedBy_initializers = [];
    let _completedBy_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    let _calibrationRecord_decorators;
    let _calibrationRecord_initializers = [];
    let _calibrationRecord_extraInitializers = [];
    var OutOfToleranceAction = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.calibrationRecordId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _calibrationRecordId_initializers, void 0));
            this.action = (__runInitializers(this, _calibrationRecordId_extraInitializers), __runInitializers(this, _action_initializers, void 0));
            this.status = (__runInitializers(this, _action_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.assignedTo = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _assignedTo_initializers, void 0));
            this.dueDate = (__runInitializers(this, _assignedTo_extraInitializers), __runInitializers(this, _dueDate_initializers, void 0));
            this.rootCause = (__runInitializers(this, _dueDate_extraInitializers), __runInitializers(this, _rootCause_initializers, void 0));
            this.correctiveAction = (__runInitializers(this, _rootCause_extraInitializers), __runInitializers(this, _correctiveAction_initializers, void 0));
            this.preventiveAction = (__runInitializers(this, _correctiveAction_extraInitializers), __runInitializers(this, _preventiveAction_initializers, void 0));
            this.impactAssessment = (__runInitializers(this, _preventiveAction_extraInitializers), __runInitializers(this, _impactAssessment_initializers, void 0));
            this.affectedAssets = (__runInitializers(this, _impactAssessment_extraInitializers), __runInitializers(this, _affectedAssets_initializers, void 0));
            this.notificationsSent = (__runInitializers(this, _affectedAssets_extraInitializers), __runInitializers(this, _notificationsSent_initializers, void 0));
            this.completionDate = (__runInitializers(this, _notificationsSent_extraInitializers), __runInitializers(this, _completionDate_initializers, void 0));
            this.completedBy = (__runInitializers(this, _completionDate_extraInitializers), __runInitializers(this, _completedBy_initializers, void 0));
            this.notes = (__runInitializers(this, _completedBy_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.createdAt = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.calibrationRecord = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _calibrationRecord_initializers, void 0));
            __runInitializers(this, _calibrationRecord_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "OutOfToleranceAction");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _calibrationRecordId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Calibration record ID' }), (0, sequelize_typescript_1.ForeignKey)(() => CalibrationRecord), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _action_decorators = [(0, swagger_1.ApiProperty)({ description: 'Action type' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(OutOfToleranceAction)),
                allowNull: false,
            }), sequelize_typescript_1.Index];
        _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'Action status' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM('pending', 'in_progress', 'completed', 'cancelled'),
                defaultValue: 'pending',
            }), sequelize_typescript_1.Index];
        _assignedTo_decorators = [(0, swagger_1.ApiProperty)({ description: 'Assigned to user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _dueDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Due date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE }), sequelize_typescript_1.Index];
        _rootCause_decorators = [(0, swagger_1.ApiProperty)({ description: 'Root cause analysis' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _correctiveAction_decorators = [(0, swagger_1.ApiProperty)({ description: 'Corrective action' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _preventiveAction_decorators = [(0, swagger_1.ApiProperty)({ description: 'Preventive action' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _impactAssessment_decorators = [(0, swagger_1.ApiProperty)({ description: 'Impact assessment' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _affectedAssets_decorators = [(0, swagger_1.ApiProperty)({ description: 'Affected assets' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.UUID) })];
        _notificationsSent_decorators = [(0, swagger_1.ApiProperty)({ description: 'Notifications sent to' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.UUID) })];
        _completionDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Completion date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _completedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Completed by user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _notes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Notes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        _calibrationRecord_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => CalibrationRecord)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _calibrationRecordId_decorators, { kind: "field", name: "calibrationRecordId", static: false, private: false, access: { has: obj => "calibrationRecordId" in obj, get: obj => obj.calibrationRecordId, set: (obj, value) => { obj.calibrationRecordId = value; } }, metadata: _metadata }, _calibrationRecordId_initializers, _calibrationRecordId_extraInitializers);
        __esDecorate(null, null, _action_decorators, { kind: "field", name: "action", static: false, private: false, access: { has: obj => "action" in obj, get: obj => obj.action, set: (obj, value) => { obj.action = value; } }, metadata: _metadata }, _action_initializers, _action_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _assignedTo_decorators, { kind: "field", name: "assignedTo", static: false, private: false, access: { has: obj => "assignedTo" in obj, get: obj => obj.assignedTo, set: (obj, value) => { obj.assignedTo = value; } }, metadata: _metadata }, _assignedTo_initializers, _assignedTo_extraInitializers);
        __esDecorate(null, null, _dueDate_decorators, { kind: "field", name: "dueDate", static: false, private: false, access: { has: obj => "dueDate" in obj, get: obj => obj.dueDate, set: (obj, value) => { obj.dueDate = value; } }, metadata: _metadata }, _dueDate_initializers, _dueDate_extraInitializers);
        __esDecorate(null, null, _rootCause_decorators, { kind: "field", name: "rootCause", static: false, private: false, access: { has: obj => "rootCause" in obj, get: obj => obj.rootCause, set: (obj, value) => { obj.rootCause = value; } }, metadata: _metadata }, _rootCause_initializers, _rootCause_extraInitializers);
        __esDecorate(null, null, _correctiveAction_decorators, { kind: "field", name: "correctiveAction", static: false, private: false, access: { has: obj => "correctiveAction" in obj, get: obj => obj.correctiveAction, set: (obj, value) => { obj.correctiveAction = value; } }, metadata: _metadata }, _correctiveAction_initializers, _correctiveAction_extraInitializers);
        __esDecorate(null, null, _preventiveAction_decorators, { kind: "field", name: "preventiveAction", static: false, private: false, access: { has: obj => "preventiveAction" in obj, get: obj => obj.preventiveAction, set: (obj, value) => { obj.preventiveAction = value; } }, metadata: _metadata }, _preventiveAction_initializers, _preventiveAction_extraInitializers);
        __esDecorate(null, null, _impactAssessment_decorators, { kind: "field", name: "impactAssessment", static: false, private: false, access: { has: obj => "impactAssessment" in obj, get: obj => obj.impactAssessment, set: (obj, value) => { obj.impactAssessment = value; } }, metadata: _metadata }, _impactAssessment_initializers, _impactAssessment_extraInitializers);
        __esDecorate(null, null, _affectedAssets_decorators, { kind: "field", name: "affectedAssets", static: false, private: false, access: { has: obj => "affectedAssets" in obj, get: obj => obj.affectedAssets, set: (obj, value) => { obj.affectedAssets = value; } }, metadata: _metadata }, _affectedAssets_initializers, _affectedAssets_extraInitializers);
        __esDecorate(null, null, _notificationsSent_decorators, { kind: "field", name: "notificationsSent", static: false, private: false, access: { has: obj => "notificationsSent" in obj, get: obj => obj.notificationsSent, set: (obj, value) => { obj.notificationsSent = value; } }, metadata: _metadata }, _notificationsSent_initializers, _notificationsSent_extraInitializers);
        __esDecorate(null, null, _completionDate_decorators, { kind: "field", name: "completionDate", static: false, private: false, access: { has: obj => "completionDate" in obj, get: obj => obj.completionDate, set: (obj, value) => { obj.completionDate = value; } }, metadata: _metadata }, _completionDate_initializers, _completionDate_extraInitializers);
        __esDecorate(null, null, _completedBy_decorators, { kind: "field", name: "completedBy", static: false, private: false, access: { has: obj => "completedBy" in obj, get: obj => obj.completedBy, set: (obj, value) => { obj.completedBy = value; } }, metadata: _metadata }, _completedBy_initializers, _completedBy_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _calibrationRecord_decorators, { kind: "field", name: "calibrationRecord", static: false, private: false, access: { has: obj => "calibrationRecord" in obj, get: obj => obj.calibrationRecord, set: (obj, value) => { obj.calibrationRecord = value; } }, metadata: _metadata }, _calibrationRecord_initializers, _calibrationRecord_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        OutOfToleranceAction = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return OutOfToleranceAction = _classThis;
})();
/**
 * Calibration Vendor Model - Manages external calibration service providers
 */
let CalibrationVendor = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'calibration_vendors',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['code'], unique: true },
                { fields: ['is_active'] },
                { fields: ['accreditation_number'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _code_decorators;
    let _code_initializers = [];
    let _code_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _contactInfo_decorators;
    let _contactInfo_initializers = [];
    let _contactInfo_extraInitializers = [];
    let _accreditationNumber_decorators;
    let _accreditationNumber_initializers = [];
    let _accreditationNumber_extraInitializers = [];
    let _accreditationExpiration_decorators;
    let _accreditationExpiration_initializers = [];
    let _accreditationExpiration_extraInitializers = [];
    let _scopeOfAccreditation_decorators;
    let _scopeOfAccreditation_initializers = [];
    let _scopeOfAccreditation_extraInitializers = [];
    let _capabilities_decorators;
    let _capabilities_initializers = [];
    let _capabilities_extraInitializers = [];
    let _turnaroundTimeDays_decorators;
    let _turnaroundTimeDays_initializers = [];
    let _turnaroundTimeDays_extraInitializers = [];
    let _averageCost_decorators;
    let _averageCost_initializers = [];
    let _averageCost_extraInitializers = [];
    let _qualityRating_decorators;
    let _qualityRating_initializers = [];
    let _qualityRating_extraInitializers = [];
    let _isActive_decorators;
    let _isActive_initializers = [];
    let _isActive_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var CalibrationVendor = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.code = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _code_initializers, void 0));
            this.name = (__runInitializers(this, _code_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.contactInfo = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _contactInfo_initializers, void 0));
            this.accreditationNumber = (__runInitializers(this, _contactInfo_extraInitializers), __runInitializers(this, _accreditationNumber_initializers, void 0));
            this.accreditationExpiration = (__runInitializers(this, _accreditationNumber_extraInitializers), __runInitializers(this, _accreditationExpiration_initializers, void 0));
            this.scopeOfAccreditation = (__runInitializers(this, _accreditationExpiration_extraInitializers), __runInitializers(this, _scopeOfAccreditation_initializers, void 0));
            this.capabilities = (__runInitializers(this, _scopeOfAccreditation_extraInitializers), __runInitializers(this, _capabilities_initializers, void 0));
            this.turnaroundTimeDays = (__runInitializers(this, _capabilities_extraInitializers), __runInitializers(this, _turnaroundTimeDays_initializers, void 0));
            this.averageCost = (__runInitializers(this, _turnaroundTimeDays_extraInitializers), __runInitializers(this, _averageCost_initializers, void 0));
            this.qualityRating = (__runInitializers(this, _averageCost_extraInitializers), __runInitializers(this, _qualityRating_initializers, void 0));
            this.isActive = (__runInitializers(this, _qualityRating_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
            this.notes = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.createdAt = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "CalibrationVendor");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _code_decorators = [(0, swagger_1.ApiProperty)({ description: 'Vendor code' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50), allowNull: false, unique: true }), sequelize_typescript_1.Index];
        _name_decorators = [(0, swagger_1.ApiProperty)({ description: 'Vendor name' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200), allowNull: false })];
        _contactInfo_decorators = [(0, swagger_1.ApiProperty)({ description: 'Contact information' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _accreditationNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Accreditation number (e.g., ISO/IEC 17025)' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100) }), sequelize_typescript_1.Index];
        _accreditationExpiration_decorators = [(0, swagger_1.ApiProperty)({ description: 'Accreditation expiration date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _scopeOfAccreditation_decorators = [(0, swagger_1.ApiProperty)({ description: 'Scope of accreditation' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _capabilities_decorators = [(0, swagger_1.ApiProperty)({ description: 'Capabilities' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING) })];
        _turnaroundTimeDays_decorators = [(0, swagger_1.ApiProperty)({ description: 'Turnaround time in days' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER })];
        _averageCost_decorators = [(0, swagger_1.ApiProperty)({ description: 'Average cost per calibration' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(12, 2) })];
        _qualityRating_decorators = [(0, swagger_1.ApiProperty)({ description: 'Quality rating (1-5)' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(2, 1) })];
        _isActive_decorators = [(0, swagger_1.ApiProperty)({ description: 'Whether vendor is active' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: true }), sequelize_typescript_1.Index];
        _notes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Notes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _code_decorators, { kind: "field", name: "code", static: false, private: false, access: { has: obj => "code" in obj, get: obj => obj.code, set: (obj, value) => { obj.code = value; } }, metadata: _metadata }, _code_initializers, _code_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _contactInfo_decorators, { kind: "field", name: "contactInfo", static: false, private: false, access: { has: obj => "contactInfo" in obj, get: obj => obj.contactInfo, set: (obj, value) => { obj.contactInfo = value; } }, metadata: _metadata }, _contactInfo_initializers, _contactInfo_extraInitializers);
        __esDecorate(null, null, _accreditationNumber_decorators, { kind: "field", name: "accreditationNumber", static: false, private: false, access: { has: obj => "accreditationNumber" in obj, get: obj => obj.accreditationNumber, set: (obj, value) => { obj.accreditationNumber = value; } }, metadata: _metadata }, _accreditationNumber_initializers, _accreditationNumber_extraInitializers);
        __esDecorate(null, null, _accreditationExpiration_decorators, { kind: "field", name: "accreditationExpiration", static: false, private: false, access: { has: obj => "accreditationExpiration" in obj, get: obj => obj.accreditationExpiration, set: (obj, value) => { obj.accreditationExpiration = value; } }, metadata: _metadata }, _accreditationExpiration_initializers, _accreditationExpiration_extraInitializers);
        __esDecorate(null, null, _scopeOfAccreditation_decorators, { kind: "field", name: "scopeOfAccreditation", static: false, private: false, access: { has: obj => "scopeOfAccreditation" in obj, get: obj => obj.scopeOfAccreditation, set: (obj, value) => { obj.scopeOfAccreditation = value; } }, metadata: _metadata }, _scopeOfAccreditation_initializers, _scopeOfAccreditation_extraInitializers);
        __esDecorate(null, null, _capabilities_decorators, { kind: "field", name: "capabilities", static: false, private: false, access: { has: obj => "capabilities" in obj, get: obj => obj.capabilities, set: (obj, value) => { obj.capabilities = value; } }, metadata: _metadata }, _capabilities_initializers, _capabilities_extraInitializers);
        __esDecorate(null, null, _turnaroundTimeDays_decorators, { kind: "field", name: "turnaroundTimeDays", static: false, private: false, access: { has: obj => "turnaroundTimeDays" in obj, get: obj => obj.turnaroundTimeDays, set: (obj, value) => { obj.turnaroundTimeDays = value; } }, metadata: _metadata }, _turnaroundTimeDays_initializers, _turnaroundTimeDays_extraInitializers);
        __esDecorate(null, null, _averageCost_decorators, { kind: "field", name: "averageCost", static: false, private: false, access: { has: obj => "averageCost" in obj, get: obj => obj.averageCost, set: (obj, value) => { obj.averageCost = value; } }, metadata: _metadata }, _averageCost_initializers, _averageCost_extraInitializers);
        __esDecorate(null, null, _qualityRating_decorators, { kind: "field", name: "qualityRating", static: false, private: false, access: { has: obj => "qualityRating" in obj, get: obj => obj.qualityRating, set: (obj, value) => { obj.qualityRating = value; } }, metadata: _metadata }, _qualityRating_initializers, _qualityRating_extraInitializers);
        __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: obj => "isActive" in obj, get: obj => obj.isActive, set: (obj, value) => { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CalibrationVendor = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CalibrationVendor = _classThis;
})();
exports.CalibrationVendor = CalibrationVendor;
// ============================================================================
// CALIBRATION SCHEDULING FUNCTIONS
// ============================================================================
/**
 * Schedules a calibration for an asset
 *
 * @param data - Calibration schedule data
 * @param transaction - Optional database transaction
 * @returns Created calibration schedule
 *
 * @example
 * ```typescript
 * const schedule = await scheduleCalibration({
 *   assetId: 'asset-123',
 *   calibrationTypeId: 'cal-type-001',
 *   frequency: CalibrationFrequency.QUARTERLY,
 *   dueDate: new Date('2024-12-01'),
 *   assignedTechnicianId: 'tech-001',
 *   priority: 'high'
 * });
 * ```
 */
async function scheduleCalibration(data, transaction) {
    // Validate calibration type exists
    const calibrationType = await CalibrationType.findByPk(data.calibrationTypeId, {
        transaction,
    });
    if (!calibrationType || !calibrationType.isActive) {
        throw new common_1.NotFoundException(`Calibration type ${data.calibrationTypeId} not found or inactive`);
    }
    // Check for existing active schedule
    const existingSchedule = await CalibrationSchedule.findOne({
        where: {
            assetId: data.assetId,
            calibrationTypeId: data.calibrationTypeId,
            status: {
                [sequelize_1.Op.in]: [
                    CalibrationStatus.SCHEDULED,
                    CalibrationStatus.DUE,
                    CalibrationStatus.IN_PROGRESS,
                ],
            },
        },
        transaction,
    });
    if (existingSchedule) {
        throw new common_1.ConflictException('Active calibration schedule already exists for this asset and type');
    }
    // Generate work order number
    const workOrderNumber = await generateCalibrationWorkOrderNumber(transaction);
    // Create schedule
    const schedule = await CalibrationSchedule.create({
        assetId: data.assetId,
        calibrationTypeId: data.calibrationTypeId,
        frequency: data.frequency,
        dueDate: data.dueDate,
        assignedTechnicianId: data.assignedTechnicianId,
        assignedVendorId: data.assignedVendorId,
        standardIds: data.standardIds,
        procedureId: data.procedureId,
        priority: data.priority || 'medium',
        workOrderNumber,
        notes: data.notes,
        status: CalibrationStatus.SCHEDULED,
    }, { transaction });
    return schedule;
}
/**
 * Generates a unique calibration work order number
 *
 * @param transaction - Optional database transaction
 * @returns Work order number
 *
 * @example
 * ```typescript
 * const woNumber = await generateCalibrationWorkOrderNumber();
 * // Returns: "CAL-2024-001234"
 * ```
 */
async function generateCalibrationWorkOrderNumber(transaction) {
    const year = new Date().getFullYear();
    const count = await CalibrationSchedule.count({ transaction });
    return `CAL-${year}-${String(count + 1).padStart(6, '0')}`;
}
/**
 * Updates a calibration schedule
 *
 * @param scheduleId - Schedule identifier
 * @param updates - Fields to update
 * @param transaction - Optional database transaction
 * @returns Updated schedule
 *
 * @example
 * ```typescript
 * await updateCalibrationSchedule('schedule-123', {
 *   dueDate: new Date('2024-12-15'),
 *   assignedTechnicianId: 'tech-002'
 * });
 * ```
 */
async function updateCalibrationSchedule(scheduleId, updates, transaction) {
    const schedule = await CalibrationSchedule.findByPk(scheduleId, { transaction });
    if (!schedule) {
        throw new common_1.NotFoundException(`Calibration schedule ${scheduleId} not found`);
    }
    await schedule.update(updates, { transaction });
    return schedule;
}
/**
 * Gets calibrations due within a specified timeframe
 *
 * @param daysAhead - Number of days to look ahead
 * @param filters - Optional filters (asset type, priority, etc.)
 * @returns List of due calibrations
 *
 * @example
 * ```typescript
 * const dueSoon = await getCalibrationsDue(30, { priority: 'critical' });
 * ```
 */
async function getCalibrationsDue(daysAhead = 30, filters) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysAhead);
    const where = {
        dueDate: {
            [sequelize_1.Op.lte]: targetDate,
        },
        status: {
            [sequelize_1.Op.in]: [CalibrationStatus.SCHEDULED, CalibrationStatus.DUE],
        },
    };
    if (filters?.priority) {
        where.priority = filters.priority;
    }
    if (filters?.assignedTechnicianId) {
        where.assignedTechnicianId = filters.assignedTechnicianId;
    }
    const schedules = await CalibrationSchedule.findAll({
        where,
        include: [{ model: CalibrationType }],
        order: [
            ['priority', 'ASC'],
            ['dueDate', 'ASC'],
        ],
    });
    return schedules;
}
/**
 * Gets overdue calibrations
 *
 * @param filters - Optional filters
 * @returns List of overdue calibrations
 *
 * @example
 * ```typescript
 * const overdue = await getOverdueCalibrations();
 * ```
 */
async function getOverdueCalibrations(filters) {
    const where = {
        dueDate: {
            [sequelize_1.Op.lt]: new Date(),
        },
        status: {
            [sequelize_1.Op.in]: [CalibrationStatus.SCHEDULED, CalibrationStatus.DUE],
        },
    };
    if (filters?.priority) {
        where.priority = filters.priority;
    }
    const schedules = await CalibrationSchedule.findAll({
        where,
        include: [{ model: CalibrationType }],
        order: [
            ['priority', 'ASC'],
            ['dueDate', 'ASC'],
        ],
    });
    // Update status to overdue
    for (const schedule of schedules) {
        await schedule.update({ status: CalibrationStatus.OVERDUE });
    }
    return schedules;
}
/**
 * Calculates optimal calibration frequency based on historical data
 *
 * @param assetId - Asset identifier
 * @param calibrationTypeId - Calibration type identifier
 * @returns Recommended frequency
 *
 * @example
 * ```typescript
 * const frequency = await calculateOptimalFrequency('asset-123', 'cal-type-001');
 * ```
 */
async function calculateOptimalFrequency(assetId, calibrationTypeId) {
    // Get calibration history
    const records = await CalibrationRecord.findAll({
        where: {
            assetId,
        },
        include: [
            {
                model: CalibrationSchedule,
                where: { calibrationTypeId },
            },
        ],
        order: [['performedDate', 'DESC']],
        limit: 10,
    });
    if (records.length < 3) {
        return {
            recommendedFrequency: CalibrationFrequency.ANNUALLY,
            confidence: 0.3,
            rationale: 'Insufficient historical data for optimization',
        };
    }
    // Calculate failure rate
    const failureRate = records.filter((r) => r.result === CalibrationResult.FAIL).length / records.length;
    // Calculate average time between failures
    let recommendedFrequency;
    let confidence;
    let rationale;
    if (failureRate > 0.3) {
        recommendedFrequency = CalibrationFrequency.MONTHLY;
        confidence = 0.8;
        rationale = 'High failure rate detected, recommending more frequent calibrations';
    }
    else if (failureRate > 0.15) {
        recommendedFrequency = CalibrationFrequency.QUARTERLY;
        confidence = 0.75;
        rationale = 'Moderate failure rate, quarterly calibrations recommended';
    }
    else if (failureRate > 0.05) {
        recommendedFrequency = CalibrationFrequency.SEMIANNUALLY;
        confidence = 0.7;
        rationale = 'Low failure rate, semi-annual calibrations sufficient';
    }
    else {
        recommendedFrequency = CalibrationFrequency.ANNUALLY;
        confidence = 0.85;
        rationale = 'Excellent calibration stability, annual calibrations recommended';
    }
    return {
        recommendedFrequency,
        confidence,
        rationale,
    };
}
/**
 * Cancels a calibration schedule
 *
 * @param scheduleId - Schedule identifier
 * @param reason - Cancellation reason
 * @param transaction - Optional database transaction
 * @returns Updated schedule
 *
 * @example
 * ```typescript
 * await cancelCalibrationSchedule('schedule-123', 'Asset retired');
 * ```
 */
async function cancelCalibrationSchedule(scheduleId, reason, transaction) {
    const schedule = await CalibrationSchedule.findByPk(scheduleId, { transaction });
    if (!schedule) {
        throw new common_1.NotFoundException(`Calibration schedule ${scheduleId} not found`);
    }
    await schedule.update({
        status: CalibrationStatus.CANCELLED,
        notes: `${schedule.notes || ''}\nCancelled: ${reason}`,
    }, { transaction });
    return schedule;
}
/**
 * Defers a calibration schedule to a new date
 *
 * @param scheduleId - Schedule identifier
 * @param newDueDate - New due date
 * @param reason - Deferral reason
 * @param transaction - Optional database transaction
 * @returns Updated schedule
 *
 * @example
 * ```typescript
 * await deferCalibration('schedule-123', new Date('2024-12-31'), 'Equipment unavailable');
 * ```
 */
async function deferCalibration(scheduleId, newDueDate, reason, transaction) {
    const schedule = await CalibrationSchedule.findByPk(scheduleId, { transaction });
    if (!schedule) {
        throw new common_1.NotFoundException(`Calibration schedule ${scheduleId} not found`);
    }
    await schedule.update({
        dueDate: newDueDate,
        status: CalibrationStatus.DEFERRED,
        notes: `${schedule.notes || ''}\nDeferred to ${newDueDate.toISOString()}: ${reason}`,
    }, { transaction });
    return schedule;
}
// ============================================================================
// CALIBRATION EXECUTION AND RECORDING
// ============================================================================
/**
 * Starts a calibration execution
 *
 * @param scheduleId - Schedule identifier
 * @param technicianId - Technician performing calibration
 * @param transaction - Optional database transaction
 * @returns Updated schedule
 *
 * @example
 * ```typescript
 * await startCalibrationExecution('schedule-123', 'tech-001');
 * ```
 */
async function startCalibrationExecution(scheduleId, technicianId, transaction) {
    const schedule = await CalibrationSchedule.findByPk(scheduleId, { transaction });
    if (!schedule) {
        throw new common_1.NotFoundException(`Calibration schedule ${scheduleId} not found`);
    }
    if (![CalibrationStatus.SCHEDULED, CalibrationStatus.DUE, CalibrationStatus.OVERDUE].includes(schedule.status)) {
        throw new common_1.BadRequestException(`Cannot start calibration with status ${schedule.status}`);
    }
    await schedule.update({
        status: CalibrationStatus.IN_PROGRESS,
        assignedTechnicianId: technicianId,
        scheduledDate: new Date(),
    }, { transaction });
    return schedule;
}
/**
 * Records calibration completion with results
 *
 * @param scheduleId - Schedule identifier
 * @param data - Calibration completion data
 * @param transaction - Optional database transaction
 * @returns Created calibration record
 *
 * @example
 * ```typescript
 * const record = await recordCalibrationCompletion('schedule-123', {
 *   performedBy: 'tech-001',
 *   performedDate: new Date(),
 *   measurements: [
 *     { parameter: 'voltage', reading: 5.01, unit: 'V', tolerance: 0.05, passed: true }
 *   ],
 *   passed: true,
 *   result: CalibrationResult.PASS
 * });
 * ```
 */
async function recordCalibrationCompletion(scheduleId, data, transaction) {
    const schedule = await CalibrationSchedule.findByPk(scheduleId, {
        include: [{ model: CalibrationType }],
        transaction,
    });
    if (!schedule) {
        throw new common_1.NotFoundException(`Calibration schedule ${scheduleId} not found`);
    }
    // Generate certificate number
    const certificateNumber = data.certificateNumber || (await generateCalibrationCertificateNumber(transaction));
    // Calculate next due date based on frequency
    const nextDueDate = calculateNextCalibrationDueDate(schedule.frequency, data.performedDate);
    // Create calibration record
    const record = await CalibrationRecord.create({
        scheduleId,
        assetId: schedule.assetId,
        performedBy: data.performedBy,
        performedDate: data.performedDate,
        completionDate: new Date(),
        result: data.result,
        passed: data.passed,
        certificateNumber,
        measurements: data.measurements,
        environmentalConditions: data.environmentalConditions,
        equipmentUsed: data.equipmentUsed,
        standardsUsed: data.standardsUsed,
        adjustmentsMade: data.adjustmentsMade,
        deviations: data.deviations,
        notes: data.notes,
        nextDueDate,
    }, { transaction });
    // Update schedule status
    await schedule.update({
        status: data.passed ? CalibrationStatus.PASSED : CalibrationStatus.FAILED,
    }, { transaction });
    // Create new schedule for next calibration if passed
    if (data.passed && nextDueDate) {
        await scheduleCalibration({
            assetId: schedule.assetId,
            calibrationTypeId: schedule.calibrationTypeId,
            frequency: schedule.frequency,
            dueDate: nextDueDate,
            assignedTechnicianId: schedule.assignedTechnicianId,
            standardIds: schedule.standardIds,
            procedureId: schedule.procedureId,
            priority: schedule.priority,
        }, transaction);
    }
    return record;
}
/**
 * Generates a unique calibration certificate number
 *
 * @param transaction - Optional database transaction
 * @returns Certificate number
 *
 * @example
 * ```typescript
 * const certNumber = await generateCalibrationCertificateNumber();
 * // Returns: "CERT-2024-001234"
 * ```
 */
async function generateCalibrationCertificateNumber(transaction) {
    const year = new Date().getFullYear();
    const count = await CalibrationRecord.count({ transaction });
    return `CERT-${year}-${String(count + 1).padStart(6, '0')}`;
}
/**
 * Calculates next calibration due date based on frequency
 *
 * @param frequency - Calibration frequency
 * @param fromDate - Starting date (default: today)
 * @returns Next due date
 *
 * @example
 * ```typescript
 * const nextDue = calculateNextCalibrationDueDate(CalibrationFrequency.QUARTERLY);
 * ```
 */
function calculateNextCalibrationDueDate(frequency, fromDate = new Date()) {
    const nextDate = new Date(fromDate);
    switch (frequency) {
        case CalibrationFrequency.DAILY:
            nextDate.setDate(nextDate.getDate() + 1);
            break;
        case CalibrationFrequency.WEEKLY:
            nextDate.setDate(nextDate.getDate() + 7);
            break;
        case CalibrationFrequency.BIWEEKLY:
            nextDate.setDate(nextDate.getDate() + 14);
            break;
        case CalibrationFrequency.MONTHLY:
            nextDate.setMonth(nextDate.getMonth() + 1);
            break;
        case CalibrationFrequency.QUARTERLY:
            nextDate.setMonth(nextDate.getMonth() + 3);
            break;
        case CalibrationFrequency.SEMIANNUALLY:
            nextDate.setMonth(nextDate.getMonth() + 6);
            break;
        case CalibrationFrequency.ANNUALLY:
            nextDate.setFullYear(nextDate.getFullYear() + 1);
            break;
        case CalibrationFrequency.BIANNUALLY:
            nextDate.setFullYear(nextDate.getFullYear() + 2);
            break;
        default:
            nextDate.setFullYear(nextDate.getFullYear() + 1);
    }
    return nextDate;
}
/**
 * Records individual calibration measurements
 *
 * @param recordId - Calibration record identifier
 * @param measurements - Array of measurements
 * @param transaction - Optional database transaction
 * @returns Updated record
 *
 * @example
 * ```typescript
 * await recordCalibrationMeasurements('record-123', [
 *   { parameter: 'temp', reading: 25.1, unit: 'C', tolerance: 0.5, passed: true }
 * ]);
 * ```
 */
async function recordCalibrationMeasurements(recordId, measurements, transaction) {
    const record = await CalibrationRecord.findByPk(recordId, { transaction });
    if (!record) {
        throw new common_1.NotFoundException(`Calibration record ${recordId} not found`);
    }
    // Validate each measurement against tolerance
    const validatedMeasurements = measurements.map((m) => {
        const passed = validateMeasurementTolerance(m);
        return { ...m, passed };
    });
    await record.update({
        measurements: validatedMeasurements,
        passed: validatedMeasurements.every((m) => m.passed),
    }, { transaction });
    return record;
}
/**
 * Validates a measurement against its tolerance
 *
 * @param measurement - Calibration measurement
 * @returns Whether measurement passed tolerance check
 *
 * @example
 * ```typescript
 * const passed = validateMeasurementTolerance({
 *   parameter: 'voltage',
 *   reading: 5.01,
 *   nominalValue: 5.0,
 *   tolerance: 0.05,
 *   unit: 'V'
 * });
 * ```
 */
function validateMeasurementTolerance(measurement) {
    if (measurement.upperLimit !== undefined && measurement.lowerLimit !== undefined) {
        return (measurement.reading >= measurement.lowerLimit &&
            measurement.reading <= measurement.upperLimit);
    }
    if (measurement.nominalValue !== undefined) {
        const deviation = Math.abs(measurement.reading - measurement.nominalValue);
        if (measurement.toleranceType === 'percentage') {
            const percentageDeviation = (deviation / measurement.nominalValue) * 100;
            return percentageDeviation <= measurement.tolerance;
        }
        return deviation <= measurement.tolerance;
    }
    return true;
}
/**
 * Gets calibration history for an asset
 *
 * @param assetId - Asset identifier
 * @param limit - Maximum records to return
 * @returns Calibration records
 *
 * @example
 * ```typescript
 * const history = await getCalibrationHistory('asset-123', 10);
 * ```
 */
async function getCalibrationHistory(assetId, limit = 50) {
    return CalibrationRecord.findAll({
        where: { assetId },
        include: [
            {
                model: CalibrationSchedule,
                include: [{ model: CalibrationType }],
            },
        ],
        order: [['performedDate', 'DESC']],
        limit,
    });
}
/**
 * Approves a calibration record
 *
 * @param recordId - Record identifier
 * @param approvedBy - Approver user ID
 * @param transaction - Optional database transaction
 * @returns Updated record
 *
 * @example
 * ```typescript
 * await approveCalibrationRecord('record-123', 'supervisor-001');
 * ```
 */
async function approveCalibrationRecord(recordId, approvedBy, transaction) {
    const record = await CalibrationRecord.findByPk(recordId, { transaction });
    if (!record) {
        throw new common_1.NotFoundException(`Calibration record ${recordId} not found`);
    }
    await record.update({
        approvedBy,
        approvalDate: new Date(),
    }, { transaction });
    return record;
}
// ============================================================================
// OUT-OF-TOLERANCE HANDLING
// ============================================================================
/**
 * Detects out-of-tolerance conditions in calibration measurements
 *
 * @param recordId - Calibration record identifier
 * @returns OOT measurements
 *
 * @example
 * ```typescript
 * const ootMeasurements = await detectOutOfTolerance('record-123');
 * ```
 */
async function detectOutOfTolerance(recordId) {
    const record = await CalibrationRecord.findByPk(recordId);
    if (!record) {
        throw new common_1.NotFoundException(`Calibration record ${recordId} not found`);
    }
    const ootMeasurements = record.measurements.filter((m) => !m.passed);
    return ootMeasurements;
}
/**
 * Initiates out-of-tolerance handling workflow
 *
 * @param data - OOT handling data
 * @param transaction - Optional database transaction
 * @returns Created OOT action record
 *
 * @example
 * ```typescript
 * const ootAction = await handleOutOfTolerance({
 *   calibrationRecordId: 'record-123',
 *   action: OutOfToleranceAction.QUARANTINE,
 *   assignedTo: 'supervisor-001',
 *   rootCause: 'Environmental conditions outside spec',
 *   correctiveAction: 'Recalibrate in controlled environment'
 * });
 * ```
 */
async function handleOutOfTolerance(data, transaction) {
    const record = await CalibrationRecord.findByPk(data.calibrationRecordId, {
        transaction,
    });
    if (!record) {
        throw new common_1.NotFoundException(`Calibration record ${data.calibrationRecordId} not found`);
    }
    // Create OOT action record
    const ootAction = await OutOfToleranceAction.create({
        calibrationRecordId: data.calibrationRecordId,
        action: data.action,
        assignedTo: data.assignedTo,
        dueDate: data.dueDate,
        rootCause: data.rootCause,
        correctiveAction: data.correctiveAction,
        preventiveAction: data.preventiveAction,
        impactAssessment: data.impactAssessment,
        affectedAssets: data.affectedAssets,
        notificationsSent: data.notificationsSent,
        status: 'pending',
    }, { transaction });
    // Update calibration record
    await record.update({
        result: CalibrationResult.OUT_OF_TOLERANCE,
        passed: false,
    }, { transaction });
    return ootAction;
}
/**
 * Quarantines an asset due to failed calibration
 *
 * @param assetId - Asset identifier
 * @param recordId - Calibration record identifier
 * @param reason - Quarantine reason
 * @param transaction - Optional database transaction
 * @returns OOT action record
 *
 * @example
 * ```typescript
 * await quarantineAsset('asset-123', 'record-456', 'Failed critical measurements');
 * ```
 */
async function quarantineAsset(assetId, recordId, reason, transaction) {
    return handleOutOfTolerance({
        calibrationRecordId: recordId,
        action: OutOfToleranceAction.QUARANTINE,
        assignedTo: 'system',
        rootCause: reason,
        correctiveAction: 'Asset quarantined pending investigation',
    }, transaction);
}
/**
 * Completes an out-of-tolerance action
 *
 * @param ootActionId - OOT action identifier
 * @param completedBy - User completing action
 * @param notes - Completion notes
 * @param transaction - Optional database transaction
 * @returns Updated OOT action
 *
 * @example
 * ```typescript
 * await completeOutOfToleranceAction('oot-123', 'tech-001', 'Recalibrated successfully');
 * ```
 */
async function completeOutOfToleranceAction(ootActionId, completedBy, notes, transaction) {
    const ootAction = await OutOfToleranceAction.findByPk(ootActionId, { transaction });
    if (!ootAction) {
        throw new common_1.NotFoundException(`OOT action ${ootActionId} not found`);
    }
    await ootAction.update({
        status: 'completed',
        completionDate: new Date(),
        completedBy,
        notes: notes ? `${ootAction.notes || ''}\n${notes}` : ootAction.notes,
    }, { transaction });
    return ootAction;
}
// ============================================================================
// CALIBRATION STANDARDS MANAGEMENT
// ============================================================================
/**
 * Registers a calibration standard
 *
 * @param data - Standard data
 * @param transaction - Optional database transaction
 * @returns Created standard
 *
 * @example
 * ```typescript
 * const standard = await registerCalibrationStandard({
 *   standardNumber: 'STD-2024-001',
 *   description: 'Voltage calibration standard',
 *   traceabilitySource: TraceabilitySource.NIST,
 *   calibrationDate: new Date('2024-01-01'),
 *   expirationDate: new Date('2025-01-01'),
 *   uncertaintyValue: 0.001,
 *   uncertaintyUnit: 'V'
 * });
 * ```
 */
async function registerCalibrationStandard(data, transaction) {
    // Check for duplicate standard number
    const existing = await CalibrationStandard.findOne({
        where: { standardNumber: data.standardNumber },
        transaction,
    });
    if (existing) {
        throw new common_1.ConflictException(`Standard with number ${data.standardNumber} already exists`);
    }
    const standard = await CalibrationStandard.create({
        standardNumber: data.standardNumber,
        description: data.description,
        traceabilitySource: data.traceabilitySource,
        traceabilityCertificateNumber: data.traceabilityCertificateNumber,
        manufacturer: data.manufacturer,
        model: data.model,
        serialNumber: data.serialNumber,
        calibrationDate: data.calibrationDate,
        expirationDate: data.expirationDate,
        uncertaintyValue: data.uncertaintyValue,
        uncertaintyUnit: data.uncertaintyUnit,
        custodian: data.custodian,
        location: data.location,
        isActive: true,
    }, { transaction });
    return standard;
}
/**
 * Gets calibration standards expiring within a timeframe
 *
 * @param daysAhead - Number of days to look ahead
 * @returns Expiring standards
 *
 * @example
 * ```typescript
 * const expiring = await getExpiringCalibrationStandards(30);
 * ```
 */
async function getExpiringCalibrationStandards(daysAhead = 30) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysAhead);
    return CalibrationStandard.findAll({
        where: {
            expirationDate: {
                [sequelize_1.Op.between]: [new Date(), targetDate],
            },
            isActive: true,
        },
        order: [['expirationDate', 'ASC']],
    });
}
/**
 * Tracks calibration standard traceability chain
 *
 * @param standardId - Standard identifier
 * @returns Traceability information
 *
 * @example
 * ```typescript
 * const traceability = await trackStandardTraceability('std-123');
 * ```
 */
async function trackStandardTraceability(standardId) {
    const standard = await CalibrationStandard.findByPk(standardId);
    if (!standard) {
        throw new common_1.NotFoundException(`Calibration standard ${standardId} not found`);
    }
    // Build traceability chain
    const traceabilityChain = [
        {
            level: 1,
            source: standard.traceabilitySource,
            certificateNumber: standard.traceabilityCertificateNumber,
            date: standard.calibrationDate,
        },
    ];
    return {
        standard,
        traceabilityChain,
    };
}
/**
 * Updates calibration standard
 *
 * @param standardId - Standard identifier
 * @param updates - Fields to update
 * @param transaction - Optional database transaction
 * @returns Updated standard
 *
 * @example
 * ```typescript
 * await updateCalibrationStandard('std-123', {
 *   location: 'Lab-A-Cabinet-3',
 *   custodian: 'user-001'
 * });
 * ```
 */
async function updateCalibrationStandard(standardId, updates, transaction) {
    const standard = await CalibrationStandard.findByPk(standardId, { transaction });
    if (!standard) {
        throw new common_1.NotFoundException(`Calibration standard ${standardId} not found`);
    }
    await standard.update(updates, { transaction });
    return standard;
}
/**
 * Retires a calibration standard
 *
 * @param standardId - Standard identifier
 * @param reason - Retirement reason
 * @param transaction - Optional database transaction
 * @returns Updated standard
 *
 * @example
 * ```typescript
 * await retireCalibrationStandard('std-123', 'Expired and replaced');
 * ```
 */
async function retireCalibrationStandard(standardId, reason, transaction) {
    const standard = await CalibrationStandard.findByPk(standardId, { transaction });
    if (!standard) {
        throw new common_1.NotFoundException(`Calibration standard ${standardId} not found`);
    }
    await standard.update({
        isActive: false,
        notes: `${standard.notes || ''}\nRetired: ${reason}`,
    }, { transaction });
    return standard;
}
// ============================================================================
// CALIBRATION VENDOR MANAGEMENT
// ============================================================================
/**
 * Registers a calibration vendor
 *
 * @param vendorData - Vendor information
 * @param transaction - Optional database transaction
 * @returns Created vendor
 *
 * @example
 * ```typescript
 * const vendor = await registerCalibrationVendor({
 *   code: 'VENDOR-001',
 *   name: 'Precision Calibration Services',
 *   accreditationNumber: 'ISO17025-12345',
 *   capabilities: ['electrical', 'mechanical', 'thermal']
 * });
 * ```
 */
async function registerCalibrationVendor(vendorData, transaction) {
    const existing = await CalibrationVendor.findOne({
        where: { code: vendorData.code },
        transaction,
    });
    if (existing) {
        throw new common_1.ConflictException(`Vendor with code ${vendorData.code} already exists`);
    }
    const vendor = await CalibrationVendor.create({
        ...vendorData,
        isActive: true,
    }, { transaction });
    return vendor;
}
/**
 * Evaluates calibration vendor performance
 *
 * @param vendorId - Vendor identifier
 * @param startDate - Evaluation period start
 * @param endDate - Evaluation period end
 * @returns Performance metrics
 *
 * @example
 * ```typescript
 * const metrics = await evaluateVendorPerformance(
 *   'vendor-123',
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
async function evaluateVendorPerformance(vendorId, startDate, endDate) {
    // Get all calibrations performed by vendor in period
    const schedules = await CalibrationSchedule.findAll({
        where: {
            assignedVendorId: vendorId,
            scheduledDate: {
                [sequelize_1.Op.between]: [startDate, endDate],
            },
        },
        include: [{ model: CalibrationRecord }],
    });
    const totalCalibrations = schedules.length;
    if (totalCalibrations === 0) {
        return {
            vendorId,
            totalCalibrations: 0,
            passRate: 0,
            averageTurnaroundTime: 0,
            onTimeDeliveryRate: 0,
            costEfficiency: 0,
            qualityScore: 0,
        };
    }
    const passed = schedules.filter((s) => s.records && s.records.some((r) => r.passed)).length;
    const passRate = (passed / totalCalibrations) * 100;
    // Calculate average turnaround time
    let totalTurnaround = 0;
    let onTimeDeliveries = 0;
    for (const schedule of schedules) {
        if (schedule.records && schedule.records.length > 0) {
            const record = schedule.records[0];
            const turnaround = (record.completionDate.getTime() - schedule.scheduledDate.getTime()) /
                (1000 * 60 * 60 * 24);
            totalTurnaround += turnaround;
            if (record.completionDate <= schedule.dueDate) {
                onTimeDeliveries++;
            }
        }
    }
    const averageTurnaroundTime = totalTurnaround / totalCalibrations;
    const onTimeDeliveryRate = (onTimeDeliveries / totalCalibrations) * 100;
    // Calculate cost efficiency (lower is better)
    const totalCost = schedules.reduce((sum, s) => sum + (s.records?.[0]?.actualCost ? Number(s.records[0].actualCost) : 0), 0);
    const averageCost = totalCost / totalCalibrations;
    const costEfficiency = averageCost;
    // Calculate overall quality score
    const qualityScore = passRate * 0.4 + onTimeDeliveryRate * 0.3 + Math.min((10 / averageTurnaroundTime) * 100, 100) * 0.3;
    return {
        vendorId,
        totalCalibrations,
        passRate,
        averageTurnaroundTime,
        onTimeDeliveryRate,
        costEfficiency,
        qualityScore,
    };
}
/**
 * Gets top performing calibration vendors
 *
 * @param limit - Number of vendors to return
 * @returns Top vendors by quality score
 *
 * @example
 * ```typescript
 * const topVendors = await getTopCalibrationVendors(5);
 * ```
 */
async function getTopCalibrationVendors(limit = 10) {
    return CalibrationVendor.findAll({
        where: { isActive: true },
        order: [['qualityRating', 'DESC']],
        limit,
    });
}
// ============================================================================
// CALIBRATION COST TRACKING
// ============================================================================
/**
 * Tracks calibration costs for an asset
 *
 * @param assetId - Asset identifier
 * @param startDate - Period start
 * @param endDate - Period end
 * @returns Cost summary
 *
 * @example
 * ```typescript
 * const costs = await trackCalibrationCosts(
 *   'asset-123',
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
async function trackCalibrationCosts(assetId, startDate, endDate) {
    const records = await CalibrationRecord.findAll({
        where: {
            assetId,
            performedDate: {
                [sequelize_1.Op.between]: [startDate, endDate],
            },
        },
        include: [
            {
                model: CalibrationSchedule,
                include: [{ model: CalibrationType }],
            },
        ],
    });
    const totalCost = records.reduce((sum, r) => sum + (r.actualCost ? Number(r.actualCost) : 0), 0);
    const calibrationCount = records.length;
    const averageCost = calibrationCount > 0 ? totalCost / calibrationCount : 0;
    const costByType = {};
    for (const record of records) {
        const typeName = record.schedule?.calibrationType?.name || 'Unknown';
        costByType[typeName] = (costByType[typeName] || 0) + Number(record.actualCost || 0);
    }
    return {
        totalCost,
        averageCost,
        calibrationCount,
        costByType,
    };
}
/**
 * Generates calibration cost forecast
 *
 * @param assetId - Asset identifier
 * @param forecastMonths - Number of months to forecast
 * @returns Cost forecast
 *
 * @example
 * ```typescript
 * const forecast = await forecastCalibrationCosts('asset-123', 12);
 * ```
 */
async function forecastCalibrationCosts(assetId, forecastMonths = 12) {
    // Get historical costs
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    const historical = await trackCalibrationCosts(assetId, oneYearAgo, new Date());
    // Get upcoming scheduled calibrations
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + forecastMonths);
    const upcomingSchedules = await CalibrationSchedule.findAll({
        where: {
            assetId,
            dueDate: {
                [sequelize_1.Op.between]: [new Date(), endDate],
            },
            status: {
                [sequelize_1.Op.in]: [CalibrationStatus.SCHEDULED, CalibrationStatus.DUE],
            },
        },
    });
    const forecastedTotalCost = upcomingSchedules.reduce((sum, s) => sum + Number(s.estimatedCost || historical.averageCost), 0);
    const monthlyBreakdown = [];
    for (let i = 0; i < forecastMonths; i++) {
        const monthStart = new Date();
        monthStart.setMonth(monthStart.getMonth() + i);
        const monthEnd = new Date(monthStart);
        monthEnd.setMonth(monthEnd.getMonth() + 1);
        const monthSchedules = upcomingSchedules.filter((s) => s.dueDate >= monthStart && s.dueDate < monthEnd);
        const monthCost = monthSchedules.reduce((sum, s) => sum + Number(s.estimatedCost || historical.averageCost), 0);
        monthlyBreakdown.push({
            month: monthStart.toISOString().substring(0, 7),
            cost: monthCost,
        });
    }
    return {
        forecastedTotalCost,
        monthlyBreakdown,
    };
}
// ============================================================================
// CALIBRATION REPORTING AND ANALYTICS
// ============================================================================
/**
 * Generates calibration certificate
 *
 * @param recordId - Calibration record identifier
 * @returns Certificate data
 *
 * @example
 * ```typescript
 * const certificate = await generateCalibrationCertificate('record-123');
 * ```
 */
async function generateCalibrationCertificate(recordId) {
    const record = await CalibrationRecord.findByPk(recordId, {
        include: [
            {
                model: CalibrationSchedule,
                include: [{ model: CalibrationType }],
            },
        ],
    });
    if (!record) {
        throw new common_1.NotFoundException(`Calibration record ${recordId} not found`);
    }
    return {
        certificateNumber: record.certificateNumber,
        assetId: record.assetId,
        calibrationType: record.schedule?.calibrationType?.name || 'Unknown',
        performedDate: record.performedDate,
        performedBy: record.performedBy,
        result: record.result,
        measurements: record.measurements,
        environmentalConditions: record.environmentalConditions,
        standardsUsed: record.standardsUsed,
        nextDueDate: record.nextDueDate,
        issuedDate: new Date(),
    };
}
/**
 * Generates calibration compliance report
 *
 * @param startDate - Report period start
 * @param endDate - Report period end
 * @param filters - Optional filters
 * @returns Compliance report data
 *
 * @example
 * ```typescript
 * const report = await generateCalibrationComplianceReport(
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
async function generateCalibrationComplianceReport(startDate, endDate, filters) {
    const where = {
        dueDate: {
            [sequelize_1.Op.between]: [startDate, endDate],
        },
    };
    if (filters?.priority) {
        where.priority = filters.priority;
    }
    const schedules = await CalibrationSchedule.findAll({
        where,
        include: [{ model: CalibrationRecord }],
    });
    const totalAssets = new Set(schedules.map((s) => s.assetId)).size;
    const overdueCalibrations = schedules.filter((s) => s.status === CalibrationStatus.OVERDUE).length;
    const upcomingCalibrations = schedules.filter((s) => s.status === CalibrationStatus.SCHEDULED).length;
    const completedCalibrations = schedules.filter((s) => s.records && s.records.length > 0);
    const passedCalibrations = completedCalibrations.filter((s) => s.records && s.records.some((r) => r.passed)).length;
    const passRate = completedCalibrations.length > 0
        ? (passedCalibrations / completedCalibrations.length) * 100
        : 0;
    const compliantAssets = new Set(schedules
        .filter((s) => s.status !== CalibrationStatus.OVERDUE)
        .map((s) => s.assetId)).size;
    const nonCompliantAssets = totalAssets - compliantAssets;
    const complianceRate = totalAssets > 0 ? (compliantAssets / totalAssets) * 100 : 0;
    return {
        totalAssets,
        compliantAssets,
        nonCompliantAssets,
        complianceRate,
        overdueCalibrations,
        upcomingCalibrations,
        passRate,
    };
}
/**
 * Gets calibration statistics for a date range
 *
 * @param startDate - Period start
 * @param endDate - Period end
 * @returns Calibration statistics
 *
 * @example
 * ```typescript
 * const stats = await getCalibrationStatistics(
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
async function getCalibrationStatistics(startDate, endDate) {
    const records = await CalibrationRecord.findAll({
        where: {
            performedDate: {
                [sequelize_1.Op.between]: [startDate, endDate],
            },
        },
        include: [
            {
                model: CalibrationSchedule,
                include: [{ model: CalibrationType }],
            },
        ],
    });
    const totalCalibrations = records.length;
    const passed = records.filter((r) => r.passed).length;
    const failed = totalCalibrations - passed;
    const passRate = totalCalibrations > 0 ? (passed / totalCalibrations) * 100 : 0;
    const totalDuration = records.reduce((sum, r) => sum + Number(r.actualDuration || 0), 0);
    const averageDuration = totalCalibrations > 0 ? totalDuration / totalCalibrations : 0;
    const totalCost = records.reduce((sum, r) => sum + Number(r.actualCost || 0), 0);
    const averageCost = totalCalibrations > 0 ? totalCost / totalCalibrations : 0;
    const byType = {};
    const byMonth = {};
    for (const record of records) {
        const typeName = record.schedule?.calibrationType?.name || 'Unknown';
        byType[typeName] = (byType[typeName] || 0) + 1;
        const month = record.performedDate.toISOString().substring(0, 7);
        byMonth[month] = (byMonth[month] || 0) + 1;
    }
    return {
        totalCalibrations,
        passed,
        failed,
        passRate,
        averageDuration,
        totalCost,
        averageCost,
        byType,
        byMonth,
    };
}
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Models
    CalibrationType,
    CalibrationSchedule,
    CalibrationRecord,
    CalibrationStandard,
    OutOfToleranceAction,
    CalibrationVendor,
    // Scheduling
    scheduleCalibration,
    updateCalibrationSchedule,
    getCalibrationsDue,
    getOverdueCalibrations,
    calculateOptimalFrequency,
    cancelCalibrationSchedule,
    deferCalibration,
    // Execution
    startCalibrationExecution,
    recordCalibrationCompletion,
    recordCalibrationMeasurements,
    validateMeasurementTolerance,
    getCalibrationHistory,
    approveCalibrationRecord,
    // Out-of-Tolerance
    detectOutOfTolerance,
    handleOutOfTolerance,
    quarantineAsset,
    completeOutOfToleranceAction,
    // Standards
    registerCalibrationStandard,
    getExpiringCalibrationStandards,
    trackStandardTraceability,
    updateCalibrationStandard,
    retireCalibrationStandard,
    // Vendors
    registerCalibrationVendor,
    evaluateVendorPerformance,
    getTopCalibrationVendors,
    // Cost Tracking
    trackCalibrationCosts,
    forecastCalibrationCosts,
    // Reporting
    generateCalibrationCertificate,
    generateCalibrationComplianceReport,
    getCalibrationStatistics,
    // Utilities
    generateCalibrationWorkOrderNumber,
    generateCalibrationCertificateNumber,
    calculateNextCalibrationDueDate,
};
//# sourceMappingURL=asset-calibration-commands.js.map