"use strict";
/**
 * ASSET MAINTENANCE COMMAND FUNCTIONS
 *
 * Enterprise-grade asset maintenance management system competing with
 * Oracle JD Edwards EnterpriseOne. Provides comprehensive functionality for:
 * - Preventive maintenance scheduling and execution
 * - Corrective maintenance workflows
 * - Maintenance request management
 * - Work order generation and tracking
 * - Technician assignment and dispatch
 * - Parts inventory and procurement
 * - Maintenance history tracking
 * - Downtime tracking and analysis
 * - PM schedule optimization
 * - Equipment reliability metrics
 *
 * @module AssetMaintenanceCommands
 * @version 1.0.0
 * @requires @nestjs/common ^11.1.8
 * @requires @nestjs/swagger ^8.0.7
 * @requires @nestjs/sequelize ^10.0.1
 * @requires sequelize ^6.37.5
 * @requires sequelize-typescript ^2.1.6
 * @requires class-validator ^0.14.1
 * @requires class-transformer ^0.5.1
 *
 * @example
 * ```typescript
 * import {
 *   createMaintenanceRequest,
 *   createWorkOrder,
 *   schedulePreventiveMaintenance,
 *   assignTechnician,
 *   MaintenanceRequest,
 *   WorkOrderStatus
 * } from './asset-maintenance-commands';
 *
 * // Create maintenance request
 * const request = await createMaintenanceRequest({
 *   assetId: 'asset-123',
 *   requestType: MaintenanceType.CORRECTIVE,
 *   priority: MaintenancePriority.HIGH,
 *   description: 'Machine making unusual noise',
 *   requestedBy: 'user-456'
 * });
 *
 * // Create work order from request
 * const workOrder = await createWorkOrder({
 *   maintenanceRequestId: request.id,
 *   assignedTechnicianId: 'tech-789',
 *   scheduledStartDate: new Date('2024-06-01'),
 *   estimatedDuration: 120
 * });
 * ```
 */
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaintenanceHistory = exports.DowntimeRecord = exports.PartReservation = exports.PartInventory = exports.TechnicianAssignment = exports.PMSchedule = exports.WorkOrder = exports.MaintenanceRequest = exports.FailureMode = exports.DowntimeCategory = exports.PartStatus = exports.ScheduleFrequency = exports.RequestStatus = exports.WorkOrderStatus = exports.MaintenancePriority = exports.MaintenanceType = void 0;
exports.createMaintenanceRequest = createMaintenanceRequest;
exports.approveMaintenanceRequest = approveMaintenanceRequest;
exports.rejectMaintenanceRequest = rejectMaintenanceRequest;
exports.getMaintenanceRequestsByStatus = getMaintenanceRequestsByStatus;
exports.getMaintenanceRequestsByAsset = getMaintenanceRequestsByAsset;
exports.createWorkOrder = createWorkOrder;
exports.assignTechnician = assignTechnician;
exports.startWorkOrder = startWorkOrder;
exports.completeWorkOrder = completeWorkOrder;
exports.putWorkOrderOnHold = putWorkOrderOnHold;
exports.cancelWorkOrder = cancelWorkOrder;
exports.getWorkOrdersByStatus = getWorkOrdersByStatus;
exports.getWorkOrdersByTechnician = getWorkOrdersByTechnician;
exports.getWorkOrdersByAsset = getWorkOrdersByAsset;
exports.createPMSchedule = createPMSchedule;
exports.generateWorkOrderFromPM = generateWorkOrderFromPM;
exports.getDuePMSchedules = getDuePMSchedules;
exports.updatePMSchedule = updatePMSchedule;
exports.deactivatePMSchedule = deactivatePMSchedule;
exports.getPMSchedulesByAsset = getPMSchedulesByAsset;
exports.reservePart = reservePart;
exports.issueReservedParts = issueReservedParts;
exports.cancelPartReservation = cancelPartReservation;
exports.getPartsNeedingReorder = getPartsNeedingReorder;
exports.createDowntimeRecord = createDowntimeRecord;
exports.endDowntime = endDowntime;
exports.getDowntimeByAsset = getDowntimeByAsset;
exports.calculateDowntimeMetrics = calculateDowntimeMetrics;
exports.getMaintenanceHistory = getMaintenanceHistory;
exports.calculateMaintenanceCosts = calculateMaintenanceCosts;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_1 = require("sequelize");
// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================
/**
 * Maintenance type
 */
var MaintenanceType;
(function (MaintenanceType) {
    MaintenanceType["PREVENTIVE"] = "preventive";
    MaintenanceType["PREDICTIVE"] = "predictive";
    MaintenanceType["CORRECTIVE"] = "corrective";
    MaintenanceType["EMERGENCY"] = "emergency";
    MaintenanceType["ROUTINE"] = "routine";
    MaintenanceType["BREAKDOWN"] = "breakdown";
})(MaintenanceType || (exports.MaintenanceType = MaintenanceType = {}));
/**
 * Maintenance priority
 */
var MaintenancePriority;
(function (MaintenancePriority) {
    MaintenancePriority["CRITICAL"] = "critical";
    MaintenancePriority["HIGH"] = "high";
    MaintenancePriority["MEDIUM"] = "medium";
    MaintenancePriority["LOW"] = "low";
})(MaintenancePriority || (exports.MaintenancePriority = MaintenancePriority = {}));
/**
 * Work order status
 */
var WorkOrderStatus;
(function (WorkOrderStatus) {
    WorkOrderStatus["DRAFT"] = "draft";
    WorkOrderStatus["SCHEDULED"] = "scheduled";
    WorkOrderStatus["ASSIGNED"] = "assigned";
    WorkOrderStatus["IN_PROGRESS"] = "in_progress";
    WorkOrderStatus["ON_HOLD"] = "on_hold";
    WorkOrderStatus["COMPLETED"] = "completed";
    WorkOrderStatus["CANCELLED"] = "cancelled";
    WorkOrderStatus["PENDING_PARTS"] = "pending_parts";
})(WorkOrderStatus || (exports.WorkOrderStatus = WorkOrderStatus = {}));
/**
 * Request status
 */
var RequestStatus;
(function (RequestStatus) {
    RequestStatus["SUBMITTED"] = "submitted";
    RequestStatus["UNDER_REVIEW"] = "under_review";
    RequestStatus["APPROVED"] = "approved";
    RequestStatus["REJECTED"] = "rejected";
    RequestStatus["WORK_ORDER_CREATED"] = "work_order_created";
    RequestStatus["COMPLETED"] = "completed";
    RequestStatus["CANCELLED"] = "cancelled";
})(RequestStatus || (exports.RequestStatus = RequestStatus = {}));
/**
 * PM schedule frequency
 */
var ScheduleFrequency;
(function (ScheduleFrequency) {
    ScheduleFrequency["DAILY"] = "daily";
    ScheduleFrequency["WEEKLY"] = "weekly";
    ScheduleFrequency["MONTHLY"] = "monthly";
    ScheduleFrequency["QUARTERLY"] = "quarterly";
    ScheduleFrequency["SEMI_ANNUAL"] = "semi_annual";
    ScheduleFrequency["ANNUAL"] = "annual";
    ScheduleFrequency["BI_ANNUAL"] = "bi_annual";
    ScheduleFrequency["METER_BASED"] = "meter_based";
    ScheduleFrequency["CONDITION_BASED"] = "condition_based";
})(ScheduleFrequency || (exports.ScheduleFrequency = ScheduleFrequency = {}));
/**
 * Part status
 */
var PartStatus;
(function (PartStatus) {
    PartStatus["AVAILABLE"] = "available";
    PartStatus["RESERVED"] = "reserved";
    PartStatus["ISSUED"] = "issued";
    PartStatus["ON_ORDER"] = "on_order";
    PartStatus["OUT_OF_STOCK"] = "out_of_stock";
})(PartStatus || (exports.PartStatus = PartStatus = {}));
/**
 * Downtime category
 */
var DowntimeCategory;
(function (DowntimeCategory) {
    DowntimeCategory["PLANNED"] = "planned";
    DowntimeCategory["UNPLANNED"] = "unplanned";
    DowntimeCategory["EMERGENCY"] = "emergency";
})(DowntimeCategory || (exports.DowntimeCategory = DowntimeCategory = {}));
/**
 * Failure mode
 */
var FailureMode;
(function (FailureMode) {
    FailureMode["MECHANICAL"] = "mechanical";
    FailureMode["ELECTRICAL"] = "electrical";
    FailureMode["ELECTRONIC"] = "electronic";
    FailureMode["SOFTWARE"] = "software";
    FailureMode["OPERATOR_ERROR"] = "operator_error";
    FailureMode["ENVIRONMENTAL"] = "environmental";
    FailureMode["WEAR_AND_TEAR"] = "wear_and_tear";
    FailureMode["MATERIAL_DEFECT"] = "material_defect";
})(FailureMode || (exports.FailureMode = FailureMode = {}));
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Maintenance Request Model
 */
let MaintenanceRequest = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'maintenance_requests',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['request_number'], unique: true },
                { fields: ['asset_id'] },
                { fields: ['status'] },
                { fields: ['priority'] },
                { fields: ['requested_by'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _staticExtraInitializers = [];
    let _static_generateRequestNumber_decorators;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _requestNumber_decorators;
    let _requestNumber_initializers = [];
    let _requestNumber_extraInitializers = [];
    let _assetId_decorators;
    let _assetId_initializers = [];
    let _assetId_extraInitializers = [];
    let _requestType_decorators;
    let _requestType_initializers = [];
    let _requestType_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _requestedBy_decorators;
    let _requestedBy_initializers = [];
    let _requestedBy_extraInitializers = [];
    let _departmentId_decorators;
    let _departmentId_initializers = [];
    let _departmentId_extraInitializers = [];
    let _locationId_decorators;
    let _locationId_initializers = [];
    let _locationId_extraInitializers = [];
    let _symptoms_decorators;
    let _symptoms_initializers = [];
    let _symptoms_extraInitializers = [];
    let _attachments_decorators;
    let _attachments_initializers = [];
    let _attachments_extraInitializers = [];
    let _requestedCompletionDate_decorators;
    let _requestedCompletionDate_initializers = [];
    let _requestedCompletionDate_extraInitializers = [];
    let _approvedBy_decorators;
    let _approvedBy_initializers = [];
    let _approvedBy_extraInitializers = [];
    let _approvalDate_decorators;
    let _approvalDate_initializers = [];
    let _approvalDate_extraInitializers = [];
    let _rejectionReason_decorators;
    let _rejectionReason_initializers = [];
    let _rejectionReason_extraInitializers = [];
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
    let _workOrders_decorators;
    let _workOrders_initializers = [];
    let _workOrders_extraInitializers = [];
    var MaintenanceRequest = _classThis = class extends _classSuper {
        static async generateRequestNumber(instance) {
            if (!instance.requestNumber) {
                const count = await MaintenanceRequest.count();
                const year = new Date().getFullYear();
                instance.requestNumber = `MR-${year}-${String(count + 1).padStart(6, '0')}`;
            }
        }
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.requestNumber = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _requestNumber_initializers, void 0));
            this.assetId = (__runInitializers(this, _requestNumber_extraInitializers), __runInitializers(this, _assetId_initializers, void 0));
            this.requestType = (__runInitializers(this, _assetId_extraInitializers), __runInitializers(this, _requestType_initializers, void 0));
            this.status = (__runInitializers(this, _requestType_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.priority = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
            this.description = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.requestedBy = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _requestedBy_initializers, void 0));
            this.departmentId = (__runInitializers(this, _requestedBy_extraInitializers), __runInitializers(this, _departmentId_initializers, void 0));
            this.locationId = (__runInitializers(this, _departmentId_extraInitializers), __runInitializers(this, _locationId_initializers, void 0));
            this.symptoms = (__runInitializers(this, _locationId_extraInitializers), __runInitializers(this, _symptoms_initializers, void 0));
            this.attachments = (__runInitializers(this, _symptoms_extraInitializers), __runInitializers(this, _attachments_initializers, void 0));
            this.requestedCompletionDate = (__runInitializers(this, _attachments_extraInitializers), __runInitializers(this, _requestedCompletionDate_initializers, void 0));
            this.approvedBy = (__runInitializers(this, _requestedCompletionDate_extraInitializers), __runInitializers(this, _approvedBy_initializers, void 0));
            this.approvalDate = (__runInitializers(this, _approvedBy_extraInitializers), __runInitializers(this, _approvalDate_initializers, void 0));
            this.rejectionReason = (__runInitializers(this, _approvalDate_extraInitializers), __runInitializers(this, _rejectionReason_initializers, void 0));
            this.notes = (__runInitializers(this, _rejectionReason_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.createdAt = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.workOrders = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _workOrders_initializers, void 0));
            __runInitializers(this, _workOrders_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "MaintenanceRequest");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _requestNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Request number' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50), unique: true }), sequelize_typescript_1.Index];
        _assetId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Asset ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _requestType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Request type' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(MaintenanceType)), allowNull: false })];
        _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'Status' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(RequestStatus)), defaultValue: RequestStatus.SUBMITTED }), sequelize_typescript_1.Index];
        _priority_decorators = [(0, swagger_1.ApiProperty)({ description: 'Priority' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(MaintenancePriority)), allowNull: false }), sequelize_typescript_1.Index];
        _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Description' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: false })];
        _requestedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Requested by user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _departmentId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Department ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _locationId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Location ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _symptoms_decorators = [(0, swagger_1.ApiProperty)({ description: 'Symptoms' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING) })];
        _attachments_decorators = [(0, swagger_1.ApiProperty)({ description: 'Attachments' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING) })];
        _requestedCompletionDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Requested completion date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _approvedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Approved by user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _approvalDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Approval date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _rejectionReason_decorators = [(0, swagger_1.ApiProperty)({ description: 'Rejection reason' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _notes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Notes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        _workOrders_decorators = [(0, sequelize_typescript_1.HasMany)(() => WorkOrder)];
        _static_generateRequestNumber_decorators = [sequelize_typescript_1.BeforeCreate];
        __esDecorate(_classThis, null, _static_generateRequestNumber_decorators, { kind: "method", name: "generateRequestNumber", static: true, private: false, access: { has: obj => "generateRequestNumber" in obj, get: obj => obj.generateRequestNumber }, metadata: _metadata }, null, _staticExtraInitializers);
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _requestNumber_decorators, { kind: "field", name: "requestNumber", static: false, private: false, access: { has: obj => "requestNumber" in obj, get: obj => obj.requestNumber, set: (obj, value) => { obj.requestNumber = value; } }, metadata: _metadata }, _requestNumber_initializers, _requestNumber_extraInitializers);
        __esDecorate(null, null, _assetId_decorators, { kind: "field", name: "assetId", static: false, private: false, access: { has: obj => "assetId" in obj, get: obj => obj.assetId, set: (obj, value) => { obj.assetId = value; } }, metadata: _metadata }, _assetId_initializers, _assetId_extraInitializers);
        __esDecorate(null, null, _requestType_decorators, { kind: "field", name: "requestType", static: false, private: false, access: { has: obj => "requestType" in obj, get: obj => obj.requestType, set: (obj, value) => { obj.requestType = value; } }, metadata: _metadata }, _requestType_initializers, _requestType_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _requestedBy_decorators, { kind: "field", name: "requestedBy", static: false, private: false, access: { has: obj => "requestedBy" in obj, get: obj => obj.requestedBy, set: (obj, value) => { obj.requestedBy = value; } }, metadata: _metadata }, _requestedBy_initializers, _requestedBy_extraInitializers);
        __esDecorate(null, null, _departmentId_decorators, { kind: "field", name: "departmentId", static: false, private: false, access: { has: obj => "departmentId" in obj, get: obj => obj.departmentId, set: (obj, value) => { obj.departmentId = value; } }, metadata: _metadata }, _departmentId_initializers, _departmentId_extraInitializers);
        __esDecorate(null, null, _locationId_decorators, { kind: "field", name: "locationId", static: false, private: false, access: { has: obj => "locationId" in obj, get: obj => obj.locationId, set: (obj, value) => { obj.locationId = value; } }, metadata: _metadata }, _locationId_initializers, _locationId_extraInitializers);
        __esDecorate(null, null, _symptoms_decorators, { kind: "field", name: "symptoms", static: false, private: false, access: { has: obj => "symptoms" in obj, get: obj => obj.symptoms, set: (obj, value) => { obj.symptoms = value; } }, metadata: _metadata }, _symptoms_initializers, _symptoms_extraInitializers);
        __esDecorate(null, null, _attachments_decorators, { kind: "field", name: "attachments", static: false, private: false, access: { has: obj => "attachments" in obj, get: obj => obj.attachments, set: (obj, value) => { obj.attachments = value; } }, metadata: _metadata }, _attachments_initializers, _attachments_extraInitializers);
        __esDecorate(null, null, _requestedCompletionDate_decorators, { kind: "field", name: "requestedCompletionDate", static: false, private: false, access: { has: obj => "requestedCompletionDate" in obj, get: obj => obj.requestedCompletionDate, set: (obj, value) => { obj.requestedCompletionDate = value; } }, metadata: _metadata }, _requestedCompletionDate_initializers, _requestedCompletionDate_extraInitializers);
        __esDecorate(null, null, _approvedBy_decorators, { kind: "field", name: "approvedBy", static: false, private: false, access: { has: obj => "approvedBy" in obj, get: obj => obj.approvedBy, set: (obj, value) => { obj.approvedBy = value; } }, metadata: _metadata }, _approvedBy_initializers, _approvedBy_extraInitializers);
        __esDecorate(null, null, _approvalDate_decorators, { kind: "field", name: "approvalDate", static: false, private: false, access: { has: obj => "approvalDate" in obj, get: obj => obj.approvalDate, set: (obj, value) => { obj.approvalDate = value; } }, metadata: _metadata }, _approvalDate_initializers, _approvalDate_extraInitializers);
        __esDecorate(null, null, _rejectionReason_decorators, { kind: "field", name: "rejectionReason", static: false, private: false, access: { has: obj => "rejectionReason" in obj, get: obj => obj.rejectionReason, set: (obj, value) => { obj.rejectionReason = value; } }, metadata: _metadata }, _rejectionReason_initializers, _rejectionReason_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _workOrders_decorators, { kind: "field", name: "workOrders", static: false, private: false, access: { has: obj => "workOrders" in obj, get: obj => obj.workOrders, set: (obj, value) => { obj.workOrders = value; } }, metadata: _metadata }, _workOrders_initializers, _workOrders_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MaintenanceRequest = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _staticExtraInitializers);
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MaintenanceRequest = _classThis;
})();
exports.MaintenanceRequest = MaintenanceRequest;
/**
 * Work Order Model
 */
let WorkOrder = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'work_orders',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['work_order_number'], unique: true },
                { fields: ['asset_id'] },
                { fields: ['status'] },
                { fields: ['priority'] },
                { fields: ['assigned_technician_id'] },
                { fields: ['scheduled_start_date'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _staticExtraInitializers = [];
    let _static_generateWorkOrderNumber_decorators;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _workOrderNumber_decorators;
    let _workOrderNumber_initializers = [];
    let _workOrderNumber_extraInitializers = [];
    let _maintenanceRequestId_decorators;
    let _maintenanceRequestId_initializers = [];
    let _maintenanceRequestId_extraInitializers = [];
    let _assetId_decorators;
    let _assetId_initializers = [];
    let _assetId_extraInitializers = [];
    let _maintenanceType_decorators;
    let _maintenanceType_initializers = [];
    let _maintenanceType_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _assignedTechnicianId_decorators;
    let _assignedTechnicianId_initializers = [];
    let _assignedTechnicianId_extraInitializers = [];
    let _scheduledStartDate_decorators;
    let _scheduledStartDate_initializers = [];
    let _scheduledStartDate_extraInitializers = [];
    let _scheduledEndDate_decorators;
    let _scheduledEndDate_initializers = [];
    let _scheduledEndDate_extraInitializers = [];
    let _actualStartDate_decorators;
    let _actualStartDate_initializers = [];
    let _actualStartDate_extraInitializers = [];
    let _actualEndDate_decorators;
    let _actualEndDate_initializers = [];
    let _actualEndDate_extraInitializers = [];
    let _estimatedDuration_decorators;
    let _estimatedDuration_initializers = [];
    let _estimatedDuration_extraInitializers = [];
    let _actualDuration_decorators;
    let _actualDuration_initializers = [];
    let _actualDuration_extraInitializers = [];
    let _instructions_decorators;
    let _instructions_initializers = [];
    let _instructions_extraInitializers = [];
    let _safetyRequirements_decorators;
    let _safetyRequirements_initializers = [];
    let _safetyRequirements_extraInitializers = [];
    let _requiredParts_decorators;
    let _requiredParts_initializers = [];
    let _requiredParts_extraInitializers = [];
    let _requiredTools_decorators;
    let _requiredTools_initializers = [];
    let _requiredTools_extraInitializers = [];
    let _workPerformed_decorators;
    let _workPerformed_initializers = [];
    let _workPerformed_extraInitializers = [];
    let _partsUsed_decorators;
    let _partsUsed_initializers = [];
    let _partsUsed_extraInitializers = [];
    let _laborHours_decorators;
    let _laborHours_initializers = [];
    let _laborHours_extraInitializers = [];
    let _findings_decorators;
    let _findings_initializers = [];
    let _findings_extraInitializers = [];
    let _recommendations_decorators;
    let _recommendations_initializers = [];
    let _recommendations_extraInitializers = [];
    let _followUpRequired_decorators;
    let _followUpRequired_initializers = [];
    let _followUpRequired_extraInitializers = [];
    let _followUpNotes_decorators;
    let _followUpNotes_initializers = [];
    let _followUpNotes_extraInitializers = [];
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
    let _maintenanceRequest_decorators;
    let _maintenanceRequest_initializers = [];
    let _maintenanceRequest_extraInitializers = [];
    let _technicianAssignments_decorators;
    let _technicianAssignments_initializers = [];
    let _technicianAssignments_extraInitializers = [];
    let _partReservations_decorators;
    let _partReservations_initializers = [];
    let _partReservations_extraInitializers = [];
    var WorkOrder = _classThis = class extends _classSuper {
        static async generateWorkOrderNumber(instance) {
            if (!instance.workOrderNumber) {
                const count = await WorkOrder.count();
                const year = new Date().getFullYear();
                instance.workOrderNumber = `WO-${year}-${String(count + 1).padStart(6, '0')}`;
            }
        }
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.workOrderNumber = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _workOrderNumber_initializers, void 0));
            this.maintenanceRequestId = (__runInitializers(this, _workOrderNumber_extraInitializers), __runInitializers(this, _maintenanceRequestId_initializers, void 0));
            this.assetId = (__runInitializers(this, _maintenanceRequestId_extraInitializers), __runInitializers(this, _assetId_initializers, void 0));
            this.maintenanceType = (__runInitializers(this, _assetId_extraInitializers), __runInitializers(this, _maintenanceType_initializers, void 0));
            this.status = (__runInitializers(this, _maintenanceType_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.priority = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
            this.description = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.assignedTechnicianId = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _assignedTechnicianId_initializers, void 0));
            this.scheduledStartDate = (__runInitializers(this, _assignedTechnicianId_extraInitializers), __runInitializers(this, _scheduledStartDate_initializers, void 0));
            this.scheduledEndDate = (__runInitializers(this, _scheduledStartDate_extraInitializers), __runInitializers(this, _scheduledEndDate_initializers, void 0));
            this.actualStartDate = (__runInitializers(this, _scheduledEndDate_extraInitializers), __runInitializers(this, _actualStartDate_initializers, void 0));
            this.actualEndDate = (__runInitializers(this, _actualStartDate_extraInitializers), __runInitializers(this, _actualEndDate_initializers, void 0));
            this.estimatedDuration = (__runInitializers(this, _actualEndDate_extraInitializers), __runInitializers(this, _estimatedDuration_initializers, void 0));
            this.actualDuration = (__runInitializers(this, _estimatedDuration_extraInitializers), __runInitializers(this, _actualDuration_initializers, void 0));
            this.instructions = (__runInitializers(this, _actualDuration_extraInitializers), __runInitializers(this, _instructions_initializers, void 0));
            this.safetyRequirements = (__runInitializers(this, _instructions_extraInitializers), __runInitializers(this, _safetyRequirements_initializers, void 0));
            this.requiredParts = (__runInitializers(this, _safetyRequirements_extraInitializers), __runInitializers(this, _requiredParts_initializers, void 0));
            this.requiredTools = (__runInitializers(this, _requiredParts_extraInitializers), __runInitializers(this, _requiredTools_initializers, void 0));
            this.workPerformed = (__runInitializers(this, _requiredTools_extraInitializers), __runInitializers(this, _workPerformed_initializers, void 0));
            this.partsUsed = (__runInitializers(this, _workPerformed_extraInitializers), __runInitializers(this, _partsUsed_initializers, void 0));
            this.laborHours = (__runInitializers(this, _partsUsed_extraInitializers), __runInitializers(this, _laborHours_initializers, void 0));
            this.findings = (__runInitializers(this, _laborHours_extraInitializers), __runInitializers(this, _findings_initializers, void 0));
            this.recommendations = (__runInitializers(this, _findings_extraInitializers), __runInitializers(this, _recommendations_initializers, void 0));
            this.followUpRequired = (__runInitializers(this, _recommendations_extraInitializers), __runInitializers(this, _followUpRequired_initializers, void 0));
            this.followUpNotes = (__runInitializers(this, _followUpRequired_extraInitializers), __runInitializers(this, _followUpNotes_initializers, void 0));
            this.completedBy = (__runInitializers(this, _followUpNotes_extraInitializers), __runInitializers(this, _completedBy_initializers, void 0));
            this.notes = (__runInitializers(this, _completedBy_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.createdAt = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.maintenanceRequest = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _maintenanceRequest_initializers, void 0));
            this.technicianAssignments = (__runInitializers(this, _maintenanceRequest_extraInitializers), __runInitializers(this, _technicianAssignments_initializers, void 0));
            this.partReservations = (__runInitializers(this, _technicianAssignments_extraInitializers), __runInitializers(this, _partReservations_initializers, void 0));
            __runInitializers(this, _partReservations_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "WorkOrder");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _workOrderNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Work order number' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50), unique: true }), sequelize_typescript_1.Index];
        _maintenanceRequestId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Maintenance request ID' }), (0, sequelize_typescript_1.ForeignKey)(() => MaintenanceRequest), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _assetId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Asset ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _maintenanceType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Maintenance type' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(MaintenanceType)), allowNull: false })];
        _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'Status' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(WorkOrderStatus)), defaultValue: WorkOrderStatus.DRAFT }), sequelize_typescript_1.Index];
        _priority_decorators = [(0, swagger_1.ApiProperty)({ description: 'Priority' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(MaintenancePriority)), allowNull: false }), sequelize_typescript_1.Index];
        _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Description' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: false })];
        _assignedTechnicianId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Assigned technician ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID }), sequelize_typescript_1.Index];
        _scheduledStartDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Scheduled start date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false }), sequelize_typescript_1.Index];
        _scheduledEndDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Scheduled end date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _actualStartDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Actual start date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _actualEndDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Actual end date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _estimatedDuration_decorators = [(0, swagger_1.ApiProperty)({ description: 'Estimated duration in minutes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER })];
        _actualDuration_decorators = [(0, swagger_1.ApiProperty)({ description: 'Actual duration in minutes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER })];
        _instructions_decorators = [(0, swagger_1.ApiProperty)({ description: 'Instructions' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _safetyRequirements_decorators = [(0, swagger_1.ApiProperty)({ description: 'Safety requirements' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING) })];
        _requiredParts_decorators = [(0, swagger_1.ApiProperty)({ description: 'Required parts' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _requiredTools_decorators = [(0, swagger_1.ApiProperty)({ description: 'Required tools' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING) })];
        _workPerformed_decorators = [(0, swagger_1.ApiProperty)({ description: 'Work performed' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _partsUsed_decorators = [(0, swagger_1.ApiProperty)({ description: 'Parts used' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _laborHours_decorators = [(0, swagger_1.ApiProperty)({ description: 'Labor hours' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(8, 2) })];
        _findings_decorators = [(0, swagger_1.ApiProperty)({ description: 'Findings' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _recommendations_decorators = [(0, swagger_1.ApiProperty)({ description: 'Recommendations' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _followUpRequired_decorators = [(0, swagger_1.ApiProperty)({ description: 'Follow-up required' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false })];
        _followUpNotes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Follow-up notes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _completedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Completed by user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _notes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Notes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        _maintenanceRequest_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => MaintenanceRequest)];
        _technicianAssignments_decorators = [(0, sequelize_typescript_1.HasMany)(() => TechnicianAssignment)];
        _partReservations_decorators = [(0, sequelize_typescript_1.HasMany)(() => PartReservation)];
        _static_generateWorkOrderNumber_decorators = [sequelize_typescript_1.BeforeCreate];
        __esDecorate(_classThis, null, _static_generateWorkOrderNumber_decorators, { kind: "method", name: "generateWorkOrderNumber", static: true, private: false, access: { has: obj => "generateWorkOrderNumber" in obj, get: obj => obj.generateWorkOrderNumber }, metadata: _metadata }, null, _staticExtraInitializers);
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _workOrderNumber_decorators, { kind: "field", name: "workOrderNumber", static: false, private: false, access: { has: obj => "workOrderNumber" in obj, get: obj => obj.workOrderNumber, set: (obj, value) => { obj.workOrderNumber = value; } }, metadata: _metadata }, _workOrderNumber_initializers, _workOrderNumber_extraInitializers);
        __esDecorate(null, null, _maintenanceRequestId_decorators, { kind: "field", name: "maintenanceRequestId", static: false, private: false, access: { has: obj => "maintenanceRequestId" in obj, get: obj => obj.maintenanceRequestId, set: (obj, value) => { obj.maintenanceRequestId = value; } }, metadata: _metadata }, _maintenanceRequestId_initializers, _maintenanceRequestId_extraInitializers);
        __esDecorate(null, null, _assetId_decorators, { kind: "field", name: "assetId", static: false, private: false, access: { has: obj => "assetId" in obj, get: obj => obj.assetId, set: (obj, value) => { obj.assetId = value; } }, metadata: _metadata }, _assetId_initializers, _assetId_extraInitializers);
        __esDecorate(null, null, _maintenanceType_decorators, { kind: "field", name: "maintenanceType", static: false, private: false, access: { has: obj => "maintenanceType" in obj, get: obj => obj.maintenanceType, set: (obj, value) => { obj.maintenanceType = value; } }, metadata: _metadata }, _maintenanceType_initializers, _maintenanceType_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _assignedTechnicianId_decorators, { kind: "field", name: "assignedTechnicianId", static: false, private: false, access: { has: obj => "assignedTechnicianId" in obj, get: obj => obj.assignedTechnicianId, set: (obj, value) => { obj.assignedTechnicianId = value; } }, metadata: _metadata }, _assignedTechnicianId_initializers, _assignedTechnicianId_extraInitializers);
        __esDecorate(null, null, _scheduledStartDate_decorators, { kind: "field", name: "scheduledStartDate", static: false, private: false, access: { has: obj => "scheduledStartDate" in obj, get: obj => obj.scheduledStartDate, set: (obj, value) => { obj.scheduledStartDate = value; } }, metadata: _metadata }, _scheduledStartDate_initializers, _scheduledStartDate_extraInitializers);
        __esDecorate(null, null, _scheduledEndDate_decorators, { kind: "field", name: "scheduledEndDate", static: false, private: false, access: { has: obj => "scheduledEndDate" in obj, get: obj => obj.scheduledEndDate, set: (obj, value) => { obj.scheduledEndDate = value; } }, metadata: _metadata }, _scheduledEndDate_initializers, _scheduledEndDate_extraInitializers);
        __esDecorate(null, null, _actualStartDate_decorators, { kind: "field", name: "actualStartDate", static: false, private: false, access: { has: obj => "actualStartDate" in obj, get: obj => obj.actualStartDate, set: (obj, value) => { obj.actualStartDate = value; } }, metadata: _metadata }, _actualStartDate_initializers, _actualStartDate_extraInitializers);
        __esDecorate(null, null, _actualEndDate_decorators, { kind: "field", name: "actualEndDate", static: false, private: false, access: { has: obj => "actualEndDate" in obj, get: obj => obj.actualEndDate, set: (obj, value) => { obj.actualEndDate = value; } }, metadata: _metadata }, _actualEndDate_initializers, _actualEndDate_extraInitializers);
        __esDecorate(null, null, _estimatedDuration_decorators, { kind: "field", name: "estimatedDuration", static: false, private: false, access: { has: obj => "estimatedDuration" in obj, get: obj => obj.estimatedDuration, set: (obj, value) => { obj.estimatedDuration = value; } }, metadata: _metadata }, _estimatedDuration_initializers, _estimatedDuration_extraInitializers);
        __esDecorate(null, null, _actualDuration_decorators, { kind: "field", name: "actualDuration", static: false, private: false, access: { has: obj => "actualDuration" in obj, get: obj => obj.actualDuration, set: (obj, value) => { obj.actualDuration = value; } }, metadata: _metadata }, _actualDuration_initializers, _actualDuration_extraInitializers);
        __esDecorate(null, null, _instructions_decorators, { kind: "field", name: "instructions", static: false, private: false, access: { has: obj => "instructions" in obj, get: obj => obj.instructions, set: (obj, value) => { obj.instructions = value; } }, metadata: _metadata }, _instructions_initializers, _instructions_extraInitializers);
        __esDecorate(null, null, _safetyRequirements_decorators, { kind: "field", name: "safetyRequirements", static: false, private: false, access: { has: obj => "safetyRequirements" in obj, get: obj => obj.safetyRequirements, set: (obj, value) => { obj.safetyRequirements = value; } }, metadata: _metadata }, _safetyRequirements_initializers, _safetyRequirements_extraInitializers);
        __esDecorate(null, null, _requiredParts_decorators, { kind: "field", name: "requiredParts", static: false, private: false, access: { has: obj => "requiredParts" in obj, get: obj => obj.requiredParts, set: (obj, value) => { obj.requiredParts = value; } }, metadata: _metadata }, _requiredParts_initializers, _requiredParts_extraInitializers);
        __esDecorate(null, null, _requiredTools_decorators, { kind: "field", name: "requiredTools", static: false, private: false, access: { has: obj => "requiredTools" in obj, get: obj => obj.requiredTools, set: (obj, value) => { obj.requiredTools = value; } }, metadata: _metadata }, _requiredTools_initializers, _requiredTools_extraInitializers);
        __esDecorate(null, null, _workPerformed_decorators, { kind: "field", name: "workPerformed", static: false, private: false, access: { has: obj => "workPerformed" in obj, get: obj => obj.workPerformed, set: (obj, value) => { obj.workPerformed = value; } }, metadata: _metadata }, _workPerformed_initializers, _workPerformed_extraInitializers);
        __esDecorate(null, null, _partsUsed_decorators, { kind: "field", name: "partsUsed", static: false, private: false, access: { has: obj => "partsUsed" in obj, get: obj => obj.partsUsed, set: (obj, value) => { obj.partsUsed = value; } }, metadata: _metadata }, _partsUsed_initializers, _partsUsed_extraInitializers);
        __esDecorate(null, null, _laborHours_decorators, { kind: "field", name: "laborHours", static: false, private: false, access: { has: obj => "laborHours" in obj, get: obj => obj.laborHours, set: (obj, value) => { obj.laborHours = value; } }, metadata: _metadata }, _laborHours_initializers, _laborHours_extraInitializers);
        __esDecorate(null, null, _findings_decorators, { kind: "field", name: "findings", static: false, private: false, access: { has: obj => "findings" in obj, get: obj => obj.findings, set: (obj, value) => { obj.findings = value; } }, metadata: _metadata }, _findings_initializers, _findings_extraInitializers);
        __esDecorate(null, null, _recommendations_decorators, { kind: "field", name: "recommendations", static: false, private: false, access: { has: obj => "recommendations" in obj, get: obj => obj.recommendations, set: (obj, value) => { obj.recommendations = value; } }, metadata: _metadata }, _recommendations_initializers, _recommendations_extraInitializers);
        __esDecorate(null, null, _followUpRequired_decorators, { kind: "field", name: "followUpRequired", static: false, private: false, access: { has: obj => "followUpRequired" in obj, get: obj => obj.followUpRequired, set: (obj, value) => { obj.followUpRequired = value; } }, metadata: _metadata }, _followUpRequired_initializers, _followUpRequired_extraInitializers);
        __esDecorate(null, null, _followUpNotes_decorators, { kind: "field", name: "followUpNotes", static: false, private: false, access: { has: obj => "followUpNotes" in obj, get: obj => obj.followUpNotes, set: (obj, value) => { obj.followUpNotes = value; } }, metadata: _metadata }, _followUpNotes_initializers, _followUpNotes_extraInitializers);
        __esDecorate(null, null, _completedBy_decorators, { kind: "field", name: "completedBy", static: false, private: false, access: { has: obj => "completedBy" in obj, get: obj => obj.completedBy, set: (obj, value) => { obj.completedBy = value; } }, metadata: _metadata }, _completedBy_initializers, _completedBy_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _maintenanceRequest_decorators, { kind: "field", name: "maintenanceRequest", static: false, private: false, access: { has: obj => "maintenanceRequest" in obj, get: obj => obj.maintenanceRequest, set: (obj, value) => { obj.maintenanceRequest = value; } }, metadata: _metadata }, _maintenanceRequest_initializers, _maintenanceRequest_extraInitializers);
        __esDecorate(null, null, _technicianAssignments_decorators, { kind: "field", name: "technicianAssignments", static: false, private: false, access: { has: obj => "technicianAssignments" in obj, get: obj => obj.technicianAssignments, set: (obj, value) => { obj.technicianAssignments = value; } }, metadata: _metadata }, _technicianAssignments_initializers, _technicianAssignments_extraInitializers);
        __esDecorate(null, null, _partReservations_decorators, { kind: "field", name: "partReservations", static: false, private: false, access: { has: obj => "partReservations" in obj, get: obj => obj.partReservations, set: (obj, value) => { obj.partReservations = value; } }, metadata: _metadata }, _partReservations_initializers, _partReservations_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        WorkOrder = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _staticExtraInitializers);
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return WorkOrder = _classThis;
})();
exports.WorkOrder = WorkOrder;
/**
 * PM Schedule Model
 */
let PMSchedule = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'pm_schedules',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['asset_id'] },
                { fields: ['frequency'] },
                { fields: ['is_active'] },
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
    let _assetId_decorators;
    let _assetId_initializers = [];
    let _assetId_extraInitializers = [];
    let _scheduleType_decorators;
    let _scheduleType_initializers = [];
    let _scheduleType_extraInitializers = [];
    let _frequency_decorators;
    let _frequency_initializers = [];
    let _frequency_extraInitializers = [];
    let _frequencyValue_decorators;
    let _frequencyValue_initializers = [];
    let _frequencyValue_extraInitializers = [];
    let _meterBasedTrigger_decorators;
    let _meterBasedTrigger_initializers = [];
    let _meterBasedTrigger_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _tasks_decorators;
    let _tasks_initializers = [];
    let _tasks_extraInitializers = [];
    let _estimatedDuration_decorators;
    let _estimatedDuration_initializers = [];
    let _estimatedDuration_extraInitializers = [];
    let _requiredSkills_decorators;
    let _requiredSkills_initializers = [];
    let _requiredSkills_extraInitializers = [];
    let _requiredParts_decorators;
    let _requiredParts_initializers = [];
    let _requiredParts_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _lastPerformedDate_decorators;
    let _lastPerformedDate_initializers = [];
    let _lastPerformedDate_extraInitializers = [];
    let _nextDueDate_decorators;
    let _nextDueDate_initializers = [];
    let _nextDueDate_extraInitializers = [];
    let _isActive_decorators;
    let _isActive_initializers = [];
    let _isActive_extraInitializers = [];
    let _totalExecutions_decorators;
    let _totalExecutions_initializers = [];
    let _totalExecutions_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var PMSchedule = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.assetId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _assetId_initializers, void 0));
            this.scheduleType = (__runInitializers(this, _assetId_extraInitializers), __runInitializers(this, _scheduleType_initializers, void 0));
            this.frequency = (__runInitializers(this, _scheduleType_extraInitializers), __runInitializers(this, _frequency_initializers, void 0));
            this.frequencyValue = (__runInitializers(this, _frequency_extraInitializers), __runInitializers(this, _frequencyValue_initializers, void 0));
            this.meterBasedTrigger = (__runInitializers(this, _frequencyValue_extraInitializers), __runInitializers(this, _meterBasedTrigger_initializers, void 0));
            this.description = (__runInitializers(this, _meterBasedTrigger_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.tasks = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _tasks_initializers, void 0));
            this.estimatedDuration = (__runInitializers(this, _tasks_extraInitializers), __runInitializers(this, _estimatedDuration_initializers, void 0));
            this.requiredSkills = (__runInitializers(this, _estimatedDuration_extraInitializers), __runInitializers(this, _requiredSkills_initializers, void 0));
            this.requiredParts = (__runInitializers(this, _requiredSkills_extraInitializers), __runInitializers(this, _requiredParts_initializers, void 0));
            this.startDate = (__runInitializers(this, _requiredParts_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
            this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
            this.lastPerformedDate = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _lastPerformedDate_initializers, void 0));
            this.nextDueDate = (__runInitializers(this, _lastPerformedDate_extraInitializers), __runInitializers(this, _nextDueDate_initializers, void 0));
            this.isActive = (__runInitializers(this, _nextDueDate_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
            this.totalExecutions = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _totalExecutions_initializers, void 0));
            this.createdAt = (__runInitializers(this, _totalExecutions_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "PMSchedule");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _assetId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Asset ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _scheduleType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Schedule type' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(MaintenanceType)), allowNull: false })];
        _frequency_decorators = [(0, swagger_1.ApiProperty)({ description: 'Frequency' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(ScheduleFrequency)), allowNull: false }), sequelize_typescript_1.Index];
        _frequencyValue_decorators = [(0, swagger_1.ApiProperty)({ description: 'Frequency value (for custom intervals)' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER })];
        _meterBasedTrigger_decorators = [(0, swagger_1.ApiProperty)({ description: 'Meter-based trigger value' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER })];
        _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Description' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: false })];
        _tasks_decorators = [(0, swagger_1.ApiProperty)({ description: 'Maintenance tasks' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: false })];
        _estimatedDuration_decorators = [(0, swagger_1.ApiProperty)({ description: 'Estimated duration in minutes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false })];
        _requiredSkills_decorators = [(0, swagger_1.ApiProperty)({ description: 'Required skills' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING) })];
        _requiredParts_decorators = [(0, swagger_1.ApiProperty)({ description: 'Required parts' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _startDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Start date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false })];
        _endDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'End date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _lastPerformedDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Last performed date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _nextDueDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Next due date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE }), sequelize_typescript_1.Index];
        _isActive_decorators = [(0, swagger_1.ApiProperty)({ description: 'Is active' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: true }), sequelize_typescript_1.Index];
        _totalExecutions_decorators = [(0, swagger_1.ApiProperty)({ description: 'Total executions' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, defaultValue: 0 })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _assetId_decorators, { kind: "field", name: "assetId", static: false, private: false, access: { has: obj => "assetId" in obj, get: obj => obj.assetId, set: (obj, value) => { obj.assetId = value; } }, metadata: _metadata }, _assetId_initializers, _assetId_extraInitializers);
        __esDecorate(null, null, _scheduleType_decorators, { kind: "field", name: "scheduleType", static: false, private: false, access: { has: obj => "scheduleType" in obj, get: obj => obj.scheduleType, set: (obj, value) => { obj.scheduleType = value; } }, metadata: _metadata }, _scheduleType_initializers, _scheduleType_extraInitializers);
        __esDecorate(null, null, _frequency_decorators, { kind: "field", name: "frequency", static: false, private: false, access: { has: obj => "frequency" in obj, get: obj => obj.frequency, set: (obj, value) => { obj.frequency = value; } }, metadata: _metadata }, _frequency_initializers, _frequency_extraInitializers);
        __esDecorate(null, null, _frequencyValue_decorators, { kind: "field", name: "frequencyValue", static: false, private: false, access: { has: obj => "frequencyValue" in obj, get: obj => obj.frequencyValue, set: (obj, value) => { obj.frequencyValue = value; } }, metadata: _metadata }, _frequencyValue_initializers, _frequencyValue_extraInitializers);
        __esDecorate(null, null, _meterBasedTrigger_decorators, { kind: "field", name: "meterBasedTrigger", static: false, private: false, access: { has: obj => "meterBasedTrigger" in obj, get: obj => obj.meterBasedTrigger, set: (obj, value) => { obj.meterBasedTrigger = value; } }, metadata: _metadata }, _meterBasedTrigger_initializers, _meterBasedTrigger_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _tasks_decorators, { kind: "field", name: "tasks", static: false, private: false, access: { has: obj => "tasks" in obj, get: obj => obj.tasks, set: (obj, value) => { obj.tasks = value; } }, metadata: _metadata }, _tasks_initializers, _tasks_extraInitializers);
        __esDecorate(null, null, _estimatedDuration_decorators, { kind: "field", name: "estimatedDuration", static: false, private: false, access: { has: obj => "estimatedDuration" in obj, get: obj => obj.estimatedDuration, set: (obj, value) => { obj.estimatedDuration = value; } }, metadata: _metadata }, _estimatedDuration_initializers, _estimatedDuration_extraInitializers);
        __esDecorate(null, null, _requiredSkills_decorators, { kind: "field", name: "requiredSkills", static: false, private: false, access: { has: obj => "requiredSkills" in obj, get: obj => obj.requiredSkills, set: (obj, value) => { obj.requiredSkills = value; } }, metadata: _metadata }, _requiredSkills_initializers, _requiredSkills_extraInitializers);
        __esDecorate(null, null, _requiredParts_decorators, { kind: "field", name: "requiredParts", static: false, private: false, access: { has: obj => "requiredParts" in obj, get: obj => obj.requiredParts, set: (obj, value) => { obj.requiredParts = value; } }, metadata: _metadata }, _requiredParts_initializers, _requiredParts_extraInitializers);
        __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
        __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
        __esDecorate(null, null, _lastPerformedDate_decorators, { kind: "field", name: "lastPerformedDate", static: false, private: false, access: { has: obj => "lastPerformedDate" in obj, get: obj => obj.lastPerformedDate, set: (obj, value) => { obj.lastPerformedDate = value; } }, metadata: _metadata }, _lastPerformedDate_initializers, _lastPerformedDate_extraInitializers);
        __esDecorate(null, null, _nextDueDate_decorators, { kind: "field", name: "nextDueDate", static: false, private: false, access: { has: obj => "nextDueDate" in obj, get: obj => obj.nextDueDate, set: (obj, value) => { obj.nextDueDate = value; } }, metadata: _metadata }, _nextDueDate_initializers, _nextDueDate_extraInitializers);
        __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: obj => "isActive" in obj, get: obj => obj.isActive, set: (obj, value) => { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
        __esDecorate(null, null, _totalExecutions_decorators, { kind: "field", name: "totalExecutions", static: false, private: false, access: { has: obj => "totalExecutions" in obj, get: obj => obj.totalExecutions, set: (obj, value) => { obj.totalExecutions = value; } }, metadata: _metadata }, _totalExecutions_initializers, _totalExecutions_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PMSchedule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PMSchedule = _classThis;
})();
exports.PMSchedule = PMSchedule;
/**
 * Technician Assignment Model
 */
let TechnicianAssignment = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'technician_assignments',
            timestamps: true,
            indexes: [
                { fields: ['work_order_id'] },
                { fields: ['technician_id'] },
                { fields: ['assigned_date'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _workOrderId_decorators;
    let _workOrderId_initializers = [];
    let _workOrderId_extraInitializers = [];
    let _technicianId_decorators;
    let _technicianId_initializers = [];
    let _technicianId_extraInitializers = [];
    let _assignedDate_decorators;
    let _assignedDate_initializers = [];
    let _assignedDate_extraInitializers = [];
    let _primaryTechnician_decorators;
    let _primaryTechnician_initializers = [];
    let _primaryTechnician_extraInitializers = [];
    let _estimatedHours_decorators;
    let _estimatedHours_initializers = [];
    let _estimatedHours_extraInitializers = [];
    let _actualHours_decorators;
    let _actualHours_initializers = [];
    let _actualHours_extraInitializers = [];
    let _skillsRequired_decorators;
    let _skillsRequired_initializers = [];
    let _skillsRequired_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _workOrder_decorators;
    let _workOrder_initializers = [];
    let _workOrder_extraInitializers = [];
    var TechnicianAssignment = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.workOrderId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _workOrderId_initializers, void 0));
            this.technicianId = (__runInitializers(this, _workOrderId_extraInitializers), __runInitializers(this, _technicianId_initializers, void 0));
            this.assignedDate = (__runInitializers(this, _technicianId_extraInitializers), __runInitializers(this, _assignedDate_initializers, void 0));
            this.primaryTechnician = (__runInitializers(this, _assignedDate_extraInitializers), __runInitializers(this, _primaryTechnician_initializers, void 0));
            this.estimatedHours = (__runInitializers(this, _primaryTechnician_extraInitializers), __runInitializers(this, _estimatedHours_initializers, void 0));
            this.actualHours = (__runInitializers(this, _estimatedHours_extraInitializers), __runInitializers(this, _actualHours_initializers, void 0));
            this.skillsRequired = (__runInitializers(this, _actualHours_extraInitializers), __runInitializers(this, _skillsRequired_initializers, void 0));
            this.notes = (__runInitializers(this, _skillsRequired_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.createdAt = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.workOrder = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _workOrder_initializers, void 0));
            __runInitializers(this, _workOrder_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "TechnicianAssignment");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _workOrderId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Work order ID' }), (0, sequelize_typescript_1.ForeignKey)(() => WorkOrder), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _technicianId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Technician ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _assignedDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Assigned date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false }), sequelize_typescript_1.Index];
        _primaryTechnician_decorators = [(0, swagger_1.ApiProperty)({ description: 'Primary technician' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: true })];
        _estimatedHours_decorators = [(0, swagger_1.ApiProperty)({ description: 'Estimated hours' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(8, 2) })];
        _actualHours_decorators = [(0, swagger_1.ApiProperty)({ description: 'Actual hours' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(8, 2) })];
        _skillsRequired_decorators = [(0, swagger_1.ApiProperty)({ description: 'Skills required' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING) })];
        _notes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Notes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _workOrder_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => WorkOrder)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _workOrderId_decorators, { kind: "field", name: "workOrderId", static: false, private: false, access: { has: obj => "workOrderId" in obj, get: obj => obj.workOrderId, set: (obj, value) => { obj.workOrderId = value; } }, metadata: _metadata }, _workOrderId_initializers, _workOrderId_extraInitializers);
        __esDecorate(null, null, _technicianId_decorators, { kind: "field", name: "technicianId", static: false, private: false, access: { has: obj => "technicianId" in obj, get: obj => obj.technicianId, set: (obj, value) => { obj.technicianId = value; } }, metadata: _metadata }, _technicianId_initializers, _technicianId_extraInitializers);
        __esDecorate(null, null, _assignedDate_decorators, { kind: "field", name: "assignedDate", static: false, private: false, access: { has: obj => "assignedDate" in obj, get: obj => obj.assignedDate, set: (obj, value) => { obj.assignedDate = value; } }, metadata: _metadata }, _assignedDate_initializers, _assignedDate_extraInitializers);
        __esDecorate(null, null, _primaryTechnician_decorators, { kind: "field", name: "primaryTechnician", static: false, private: false, access: { has: obj => "primaryTechnician" in obj, get: obj => obj.primaryTechnician, set: (obj, value) => { obj.primaryTechnician = value; } }, metadata: _metadata }, _primaryTechnician_initializers, _primaryTechnician_extraInitializers);
        __esDecorate(null, null, _estimatedHours_decorators, { kind: "field", name: "estimatedHours", static: false, private: false, access: { has: obj => "estimatedHours" in obj, get: obj => obj.estimatedHours, set: (obj, value) => { obj.estimatedHours = value; } }, metadata: _metadata }, _estimatedHours_initializers, _estimatedHours_extraInitializers);
        __esDecorate(null, null, _actualHours_decorators, { kind: "field", name: "actualHours", static: false, private: false, access: { has: obj => "actualHours" in obj, get: obj => obj.actualHours, set: (obj, value) => { obj.actualHours = value; } }, metadata: _metadata }, _actualHours_initializers, _actualHours_extraInitializers);
        __esDecorate(null, null, _skillsRequired_decorators, { kind: "field", name: "skillsRequired", static: false, private: false, access: { has: obj => "skillsRequired" in obj, get: obj => obj.skillsRequired, set: (obj, value) => { obj.skillsRequired = value; } }, metadata: _metadata }, _skillsRequired_initializers, _skillsRequired_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _workOrder_decorators, { kind: "field", name: "workOrder", static: false, private: false, access: { has: obj => "workOrder" in obj, get: obj => obj.workOrder, set: (obj, value) => { obj.workOrder = value; } }, metadata: _metadata }, _workOrder_initializers, _workOrder_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TechnicianAssignment = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TechnicianAssignment = _classThis;
})();
exports.TechnicianAssignment = TechnicianAssignment;
/**
 * Part Inventory Model
 */
let PartInventory = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'part_inventory',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['part_number'], unique: true },
                { fields: ['status'] },
                { fields: ['location_id'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _partNumber_decorators;
    let _partNumber_initializers = [];
    let _partNumber_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _category_decorators;
    let _category_initializers = [];
    let _category_extraInitializers = [];
    let _manufacturer_decorators;
    let _manufacturer_initializers = [];
    let _manufacturer_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _quantityOnHand_decorators;
    let _quantityOnHand_initializers = [];
    let _quantityOnHand_extraInitializers = [];
    let _quantityReserved_decorators;
    let _quantityReserved_initializers = [];
    let _quantityReserved_extraInitializers = [];
    let _quantityAvailable_decorators;
    let _quantityAvailable_initializers = [];
    let _quantityAvailable_extraInitializers = [];
    let _reorderPoint_decorators;
    let _reorderPoint_initializers = [];
    let _reorderPoint_extraInitializers = [];
    let _reorderQuantity_decorators;
    let _reorderQuantity_initializers = [];
    let _reorderQuantity_extraInitializers = [];
    let _unitCost_decorators;
    let _unitCost_initializers = [];
    let _unitCost_extraInitializers = [];
    let _locationId_decorators;
    let _locationId_initializers = [];
    let _locationId_extraInitializers = [];
    let _binLocation_decorators;
    let _binLocation_initializers = [];
    let _binLocation_extraInitializers = [];
    let _isCritical_decorators;
    let _isCritical_initializers = [];
    let _isCritical_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    let _reservations_decorators;
    let _reservations_initializers = [];
    let _reservations_extraInitializers = [];
    var PartInventory = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.partNumber = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _partNumber_initializers, void 0));
            this.description = (__runInitializers(this, _partNumber_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.category = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _category_initializers, void 0));
            this.manufacturer = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _manufacturer_initializers, void 0));
            this.status = (__runInitializers(this, _manufacturer_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.quantityOnHand = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _quantityOnHand_initializers, void 0));
            this.quantityReserved = (__runInitializers(this, _quantityOnHand_extraInitializers), __runInitializers(this, _quantityReserved_initializers, void 0));
            this.quantityAvailable = (__runInitializers(this, _quantityReserved_extraInitializers), __runInitializers(this, _quantityAvailable_initializers, void 0));
            this.reorderPoint = (__runInitializers(this, _quantityAvailable_extraInitializers), __runInitializers(this, _reorderPoint_initializers, void 0));
            this.reorderQuantity = (__runInitializers(this, _reorderPoint_extraInitializers), __runInitializers(this, _reorderQuantity_initializers, void 0));
            this.unitCost = (__runInitializers(this, _reorderQuantity_extraInitializers), __runInitializers(this, _unitCost_initializers, void 0));
            this.locationId = (__runInitializers(this, _unitCost_extraInitializers), __runInitializers(this, _locationId_initializers, void 0));
            this.binLocation = (__runInitializers(this, _locationId_extraInitializers), __runInitializers(this, _binLocation_initializers, void 0));
            this.isCritical = (__runInitializers(this, _binLocation_extraInitializers), __runInitializers(this, _isCritical_initializers, void 0));
            this.createdAt = (__runInitializers(this, _isCritical_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.reservations = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _reservations_initializers, void 0));
            __runInitializers(this, _reservations_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "PartInventory");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _partNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Part number' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100), unique: true, allowNull: false }), sequelize_typescript_1.Index];
        _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Description' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: false })];
        _category_decorators = [(0, swagger_1.ApiProperty)({ description: 'Category' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100) })];
        _manufacturer_decorators = [(0, swagger_1.ApiProperty)({ description: 'Manufacturer' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200) })];
        _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'Status' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(PartStatus)), defaultValue: PartStatus.AVAILABLE }), sequelize_typescript_1.Index];
        _quantityOnHand_decorators = [(0, swagger_1.ApiProperty)({ description: 'Quantity on hand' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, defaultValue: 0 })];
        _quantityReserved_decorators = [(0, swagger_1.ApiProperty)({ description: 'Quantity reserved' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, defaultValue: 0 })];
        _quantityAvailable_decorators = [(0, swagger_1.ApiProperty)({ description: 'Quantity available' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, defaultValue: 0 })];
        _reorderPoint_decorators = [(0, swagger_1.ApiProperty)({ description: 'Reorder point' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER })];
        _reorderQuantity_decorators = [(0, swagger_1.ApiProperty)({ description: 'Reorder quantity' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER })];
        _unitCost_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unit cost' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(12, 2) })];
        _locationId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Location ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID }), sequelize_typescript_1.Index];
        _binLocation_decorators = [(0, swagger_1.ApiProperty)({ description: 'Bin location' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100) })];
        _isCritical_decorators = [(0, swagger_1.ApiProperty)({ description: 'Is critical part' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        _reservations_decorators = [(0, sequelize_typescript_1.HasMany)(() => PartReservation)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _partNumber_decorators, { kind: "field", name: "partNumber", static: false, private: false, access: { has: obj => "partNumber" in obj, get: obj => obj.partNumber, set: (obj, value) => { obj.partNumber = value; } }, metadata: _metadata }, _partNumber_initializers, _partNumber_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: obj => "category" in obj, get: obj => obj.category, set: (obj, value) => { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
        __esDecorate(null, null, _manufacturer_decorators, { kind: "field", name: "manufacturer", static: false, private: false, access: { has: obj => "manufacturer" in obj, get: obj => obj.manufacturer, set: (obj, value) => { obj.manufacturer = value; } }, metadata: _metadata }, _manufacturer_initializers, _manufacturer_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _quantityOnHand_decorators, { kind: "field", name: "quantityOnHand", static: false, private: false, access: { has: obj => "quantityOnHand" in obj, get: obj => obj.quantityOnHand, set: (obj, value) => { obj.quantityOnHand = value; } }, metadata: _metadata }, _quantityOnHand_initializers, _quantityOnHand_extraInitializers);
        __esDecorate(null, null, _quantityReserved_decorators, { kind: "field", name: "quantityReserved", static: false, private: false, access: { has: obj => "quantityReserved" in obj, get: obj => obj.quantityReserved, set: (obj, value) => { obj.quantityReserved = value; } }, metadata: _metadata }, _quantityReserved_initializers, _quantityReserved_extraInitializers);
        __esDecorate(null, null, _quantityAvailable_decorators, { kind: "field", name: "quantityAvailable", static: false, private: false, access: { has: obj => "quantityAvailable" in obj, get: obj => obj.quantityAvailable, set: (obj, value) => { obj.quantityAvailable = value; } }, metadata: _metadata }, _quantityAvailable_initializers, _quantityAvailable_extraInitializers);
        __esDecorate(null, null, _reorderPoint_decorators, { kind: "field", name: "reorderPoint", static: false, private: false, access: { has: obj => "reorderPoint" in obj, get: obj => obj.reorderPoint, set: (obj, value) => { obj.reorderPoint = value; } }, metadata: _metadata }, _reorderPoint_initializers, _reorderPoint_extraInitializers);
        __esDecorate(null, null, _reorderQuantity_decorators, { kind: "field", name: "reorderQuantity", static: false, private: false, access: { has: obj => "reorderQuantity" in obj, get: obj => obj.reorderQuantity, set: (obj, value) => { obj.reorderQuantity = value; } }, metadata: _metadata }, _reorderQuantity_initializers, _reorderQuantity_extraInitializers);
        __esDecorate(null, null, _unitCost_decorators, { kind: "field", name: "unitCost", static: false, private: false, access: { has: obj => "unitCost" in obj, get: obj => obj.unitCost, set: (obj, value) => { obj.unitCost = value; } }, metadata: _metadata }, _unitCost_initializers, _unitCost_extraInitializers);
        __esDecorate(null, null, _locationId_decorators, { kind: "field", name: "locationId", static: false, private: false, access: { has: obj => "locationId" in obj, get: obj => obj.locationId, set: (obj, value) => { obj.locationId = value; } }, metadata: _metadata }, _locationId_initializers, _locationId_extraInitializers);
        __esDecorate(null, null, _binLocation_decorators, { kind: "field", name: "binLocation", static: false, private: false, access: { has: obj => "binLocation" in obj, get: obj => obj.binLocation, set: (obj, value) => { obj.binLocation = value; } }, metadata: _metadata }, _binLocation_initializers, _binLocation_extraInitializers);
        __esDecorate(null, null, _isCritical_decorators, { kind: "field", name: "isCritical", static: false, private: false, access: { has: obj => "isCritical" in obj, get: obj => obj.isCritical, set: (obj, value) => { obj.isCritical = value; } }, metadata: _metadata }, _isCritical_initializers, _isCritical_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _reservations_decorators, { kind: "field", name: "reservations", static: false, private: false, access: { has: obj => "reservations" in obj, get: obj => obj.reservations, set: (obj, value) => { obj.reservations = value; } }, metadata: _metadata }, _reservations_initializers, _reservations_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PartInventory = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PartInventory = _classThis;
})();
exports.PartInventory = PartInventory;
/**
 * Part Reservation Model
 */
let PartReservation = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'part_reservations',
            timestamps: true,
            indexes: [
                { fields: ['work_order_id'] },
                { fields: ['part_id'] },
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
    let _workOrderId_decorators;
    let _workOrderId_initializers = [];
    let _workOrderId_extraInitializers = [];
    let _partId_decorators;
    let _partId_initializers = [];
    let _partId_extraInitializers = [];
    let _quantityReserved_decorators;
    let _quantityReserved_initializers = [];
    let _quantityReserved_extraInitializers = [];
    let _quantityIssued_decorators;
    let _quantityIssued_initializers = [];
    let _quantityIssued_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _reservedBy_decorators;
    let _reservedBy_initializers = [];
    let _reservedBy_extraInitializers = [];
    let _requiredBy_decorators;
    let _requiredBy_initializers = [];
    let _requiredBy_extraInitializers = [];
    let _issuedBy_decorators;
    let _issuedBy_initializers = [];
    let _issuedBy_extraInitializers = [];
    let _issuedDate_decorators;
    let _issuedDate_initializers = [];
    let _issuedDate_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _workOrder_decorators;
    let _workOrder_initializers = [];
    let _workOrder_extraInitializers = [];
    let _part_decorators;
    let _part_initializers = [];
    let _part_extraInitializers = [];
    var PartReservation = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.workOrderId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _workOrderId_initializers, void 0));
            this.partId = (__runInitializers(this, _workOrderId_extraInitializers), __runInitializers(this, _partId_initializers, void 0));
            this.quantityReserved = (__runInitializers(this, _partId_extraInitializers), __runInitializers(this, _quantityReserved_initializers, void 0));
            this.quantityIssued = (__runInitializers(this, _quantityReserved_extraInitializers), __runInitializers(this, _quantityIssued_initializers, void 0));
            this.status = (__runInitializers(this, _quantityIssued_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.reservedBy = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _reservedBy_initializers, void 0));
            this.requiredBy = (__runInitializers(this, _reservedBy_extraInitializers), __runInitializers(this, _requiredBy_initializers, void 0));
            this.issuedBy = (__runInitializers(this, _requiredBy_extraInitializers), __runInitializers(this, _issuedBy_initializers, void 0));
            this.issuedDate = (__runInitializers(this, _issuedBy_extraInitializers), __runInitializers(this, _issuedDate_initializers, void 0));
            this.createdAt = (__runInitializers(this, _issuedDate_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.workOrder = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _workOrder_initializers, void 0));
            this.part = (__runInitializers(this, _workOrder_extraInitializers), __runInitializers(this, _part_initializers, void 0));
            __runInitializers(this, _part_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "PartReservation");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _workOrderId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Work order ID' }), (0, sequelize_typescript_1.ForeignKey)(() => WorkOrder), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _partId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Part ID' }), (0, sequelize_typescript_1.ForeignKey)(() => PartInventory), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _quantityReserved_decorators = [(0, swagger_1.ApiProperty)({ description: 'Quantity reserved' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false })];
        _quantityIssued_decorators = [(0, swagger_1.ApiProperty)({ description: 'Quantity issued' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, defaultValue: 0 })];
        _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'Status' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM('reserved', 'issued', 'cancelled'), defaultValue: 'reserved' }), sequelize_typescript_1.Index];
        _reservedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Reserved by user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _requiredBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Required by date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false })];
        _issuedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Issued by user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _issuedDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Issued date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _workOrder_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => WorkOrder)];
        _part_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => PartInventory)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _workOrderId_decorators, { kind: "field", name: "workOrderId", static: false, private: false, access: { has: obj => "workOrderId" in obj, get: obj => obj.workOrderId, set: (obj, value) => { obj.workOrderId = value; } }, metadata: _metadata }, _workOrderId_initializers, _workOrderId_extraInitializers);
        __esDecorate(null, null, _partId_decorators, { kind: "field", name: "partId", static: false, private: false, access: { has: obj => "partId" in obj, get: obj => obj.partId, set: (obj, value) => { obj.partId = value; } }, metadata: _metadata }, _partId_initializers, _partId_extraInitializers);
        __esDecorate(null, null, _quantityReserved_decorators, { kind: "field", name: "quantityReserved", static: false, private: false, access: { has: obj => "quantityReserved" in obj, get: obj => obj.quantityReserved, set: (obj, value) => { obj.quantityReserved = value; } }, metadata: _metadata }, _quantityReserved_initializers, _quantityReserved_extraInitializers);
        __esDecorate(null, null, _quantityIssued_decorators, { kind: "field", name: "quantityIssued", static: false, private: false, access: { has: obj => "quantityIssued" in obj, get: obj => obj.quantityIssued, set: (obj, value) => { obj.quantityIssued = value; } }, metadata: _metadata }, _quantityIssued_initializers, _quantityIssued_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _reservedBy_decorators, { kind: "field", name: "reservedBy", static: false, private: false, access: { has: obj => "reservedBy" in obj, get: obj => obj.reservedBy, set: (obj, value) => { obj.reservedBy = value; } }, metadata: _metadata }, _reservedBy_initializers, _reservedBy_extraInitializers);
        __esDecorate(null, null, _requiredBy_decorators, { kind: "field", name: "requiredBy", static: false, private: false, access: { has: obj => "requiredBy" in obj, get: obj => obj.requiredBy, set: (obj, value) => { obj.requiredBy = value; } }, metadata: _metadata }, _requiredBy_initializers, _requiredBy_extraInitializers);
        __esDecorate(null, null, _issuedBy_decorators, { kind: "field", name: "issuedBy", static: false, private: false, access: { has: obj => "issuedBy" in obj, get: obj => obj.issuedBy, set: (obj, value) => { obj.issuedBy = value; } }, metadata: _metadata }, _issuedBy_initializers, _issuedBy_extraInitializers);
        __esDecorate(null, null, _issuedDate_decorators, { kind: "field", name: "issuedDate", static: false, private: false, access: { has: obj => "issuedDate" in obj, get: obj => obj.issuedDate, set: (obj, value) => { obj.issuedDate = value; } }, metadata: _metadata }, _issuedDate_initializers, _issuedDate_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _workOrder_decorators, { kind: "field", name: "workOrder", static: false, private: false, access: { has: obj => "workOrder" in obj, get: obj => obj.workOrder, set: (obj, value) => { obj.workOrder = value; } }, metadata: _metadata }, _workOrder_initializers, _workOrder_extraInitializers);
        __esDecorate(null, null, _part_decorators, { kind: "field", name: "part", static: false, private: false, access: { has: obj => "part" in obj, get: obj => obj.part, set: (obj, value) => { obj.part = value; } }, metadata: _metadata }, _part_initializers, _part_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PartReservation = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PartReservation = _classThis;
})();
exports.PartReservation = PartReservation;
/**
 * Downtime Record Model
 */
let DowntimeRecord = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'downtime_records',
            timestamps: true,
            indexes: [
                { fields: ['asset_id'] },
                { fields: ['category'] },
                { fields: ['start_time'] },
                { fields: ['work_order_id'] },
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
    let _category_decorators;
    let _category_initializers = [];
    let _category_extraInitializers = [];
    let _startTime_decorators;
    let _startTime_initializers = [];
    let _startTime_extraInitializers = [];
    let _endTime_decorators;
    let _endTime_initializers = [];
    let _endTime_extraInitializers = [];
    let _durationMinutes_decorators;
    let _durationMinutes_initializers = [];
    let _durationMinutes_extraInitializers = [];
    let _reason_decorators;
    let _reason_initializers = [];
    let _reason_extraInitializers = [];
    let _failureMode_decorators;
    let _failureMode_initializers = [];
    let _failureMode_extraInitializers = [];
    let _impactedOperations_decorators;
    let _impactedOperations_initializers = [];
    let _impactedOperations_extraInitializers = [];
    let _workOrderId_decorators;
    let _workOrderId_initializers = [];
    let _workOrderId_extraInitializers = [];
    let _estimatedLoss_decorators;
    let _estimatedLoss_initializers = [];
    let _estimatedLoss_extraInitializers = [];
    let _rootCause_decorators;
    let _rootCause_initializers = [];
    let _rootCause_extraInitializers = [];
    let _correctiveActions_decorators;
    let _correctiveActions_initializers = [];
    let _correctiveActions_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var DowntimeRecord = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.assetId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _assetId_initializers, void 0));
            this.category = (__runInitializers(this, _assetId_extraInitializers), __runInitializers(this, _category_initializers, void 0));
            this.startTime = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _startTime_initializers, void 0));
            this.endTime = (__runInitializers(this, _startTime_extraInitializers), __runInitializers(this, _endTime_initializers, void 0));
            this.durationMinutes = (__runInitializers(this, _endTime_extraInitializers), __runInitializers(this, _durationMinutes_initializers, void 0));
            this.reason = (__runInitializers(this, _durationMinutes_extraInitializers), __runInitializers(this, _reason_initializers, void 0));
            this.failureMode = (__runInitializers(this, _reason_extraInitializers), __runInitializers(this, _failureMode_initializers, void 0));
            this.impactedOperations = (__runInitializers(this, _failureMode_extraInitializers), __runInitializers(this, _impactedOperations_initializers, void 0));
            this.workOrderId = (__runInitializers(this, _impactedOperations_extraInitializers), __runInitializers(this, _workOrderId_initializers, void 0));
            this.estimatedLoss = (__runInitializers(this, _workOrderId_extraInitializers), __runInitializers(this, _estimatedLoss_initializers, void 0));
            this.rootCause = (__runInitializers(this, _estimatedLoss_extraInitializers), __runInitializers(this, _rootCause_initializers, void 0));
            this.correctiveActions = (__runInitializers(this, _rootCause_extraInitializers), __runInitializers(this, _correctiveActions_initializers, void 0));
            this.createdAt = (__runInitializers(this, _correctiveActions_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "DowntimeRecord");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _assetId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Asset ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _category_decorators = [(0, swagger_1.ApiProperty)({ description: 'Category' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(DowntimeCategory)), allowNull: false }), sequelize_typescript_1.Index];
        _startTime_decorators = [(0, swagger_1.ApiProperty)({ description: 'Start time' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false }), sequelize_typescript_1.Index];
        _endTime_decorators = [(0, swagger_1.ApiProperty)({ description: 'End time' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _durationMinutes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Duration in minutes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER })];
        _reason_decorators = [(0, swagger_1.ApiProperty)({ description: 'Reason' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: false })];
        _failureMode_decorators = [(0, swagger_1.ApiProperty)({ description: 'Failure mode' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(FailureMode)) })];
        _impactedOperations_decorators = [(0, swagger_1.ApiProperty)({ description: 'Impacted operations' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING) })];
        _workOrderId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Work order ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID }), sequelize_typescript_1.Index];
        _estimatedLoss_decorators = [(0, swagger_1.ApiProperty)({ description: 'Estimated loss amount' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(15, 2) })];
        _rootCause_decorators = [(0, swagger_1.ApiProperty)({ description: 'Root cause' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _correctiveActions_decorators = [(0, swagger_1.ApiProperty)({ description: 'Corrective actions' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _assetId_decorators, { kind: "field", name: "assetId", static: false, private: false, access: { has: obj => "assetId" in obj, get: obj => obj.assetId, set: (obj, value) => { obj.assetId = value; } }, metadata: _metadata }, _assetId_initializers, _assetId_extraInitializers);
        __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: obj => "category" in obj, get: obj => obj.category, set: (obj, value) => { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
        __esDecorate(null, null, _startTime_decorators, { kind: "field", name: "startTime", static: false, private: false, access: { has: obj => "startTime" in obj, get: obj => obj.startTime, set: (obj, value) => { obj.startTime = value; } }, metadata: _metadata }, _startTime_initializers, _startTime_extraInitializers);
        __esDecorate(null, null, _endTime_decorators, { kind: "field", name: "endTime", static: false, private: false, access: { has: obj => "endTime" in obj, get: obj => obj.endTime, set: (obj, value) => { obj.endTime = value; } }, metadata: _metadata }, _endTime_initializers, _endTime_extraInitializers);
        __esDecorate(null, null, _durationMinutes_decorators, { kind: "field", name: "durationMinutes", static: false, private: false, access: { has: obj => "durationMinutes" in obj, get: obj => obj.durationMinutes, set: (obj, value) => { obj.durationMinutes = value; } }, metadata: _metadata }, _durationMinutes_initializers, _durationMinutes_extraInitializers);
        __esDecorate(null, null, _reason_decorators, { kind: "field", name: "reason", static: false, private: false, access: { has: obj => "reason" in obj, get: obj => obj.reason, set: (obj, value) => { obj.reason = value; } }, metadata: _metadata }, _reason_initializers, _reason_extraInitializers);
        __esDecorate(null, null, _failureMode_decorators, { kind: "field", name: "failureMode", static: false, private: false, access: { has: obj => "failureMode" in obj, get: obj => obj.failureMode, set: (obj, value) => { obj.failureMode = value; } }, metadata: _metadata }, _failureMode_initializers, _failureMode_extraInitializers);
        __esDecorate(null, null, _impactedOperations_decorators, { kind: "field", name: "impactedOperations", static: false, private: false, access: { has: obj => "impactedOperations" in obj, get: obj => obj.impactedOperations, set: (obj, value) => { obj.impactedOperations = value; } }, metadata: _metadata }, _impactedOperations_initializers, _impactedOperations_extraInitializers);
        __esDecorate(null, null, _workOrderId_decorators, { kind: "field", name: "workOrderId", static: false, private: false, access: { has: obj => "workOrderId" in obj, get: obj => obj.workOrderId, set: (obj, value) => { obj.workOrderId = value; } }, metadata: _metadata }, _workOrderId_initializers, _workOrderId_extraInitializers);
        __esDecorate(null, null, _estimatedLoss_decorators, { kind: "field", name: "estimatedLoss", static: false, private: false, access: { has: obj => "estimatedLoss" in obj, get: obj => obj.estimatedLoss, set: (obj, value) => { obj.estimatedLoss = value; } }, metadata: _metadata }, _estimatedLoss_initializers, _estimatedLoss_extraInitializers);
        __esDecorate(null, null, _rootCause_decorators, { kind: "field", name: "rootCause", static: false, private: false, access: { has: obj => "rootCause" in obj, get: obj => obj.rootCause, set: (obj, value) => { obj.rootCause = value; } }, metadata: _metadata }, _rootCause_initializers, _rootCause_extraInitializers);
        __esDecorate(null, null, _correctiveActions_decorators, { kind: "field", name: "correctiveActions", static: false, private: false, access: { has: obj => "correctiveActions" in obj, get: obj => obj.correctiveActions, set: (obj, value) => { obj.correctiveActions = value; } }, metadata: _metadata }, _correctiveActions_initializers, _correctiveActions_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DowntimeRecord = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DowntimeRecord = _classThis;
})();
exports.DowntimeRecord = DowntimeRecord;
/**
 * Maintenance History Model
 */
let MaintenanceHistory = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'maintenance_history',
            timestamps: true,
            indexes: [
                { fields: ['asset_id'] },
                { fields: ['work_order_id'] },
                { fields: ['maintenance_date'] },
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
    let _workOrderId_decorators;
    let _workOrderId_initializers = [];
    let _workOrderId_extraInitializers = [];
    let _maintenanceType_decorators;
    let _maintenanceType_initializers = [];
    let _maintenanceType_extraInitializers = [];
    let _maintenanceDate_decorators;
    let _maintenanceDate_initializers = [];
    let _maintenanceDate_extraInitializers = [];
    let _performedBy_decorators;
    let _performedBy_initializers = [];
    let _performedBy_extraInitializers = [];
    let _workDescription_decorators;
    let _workDescription_initializers = [];
    let _workDescription_extraInitializers = [];
    let _laborHours_decorators;
    let _laborHours_initializers = [];
    let _laborHours_extraInitializers = [];
    let _partsCost_decorators;
    let _partsCost_initializers = [];
    let _partsCost_extraInitializers = [];
    let _laborCost_decorators;
    let _laborCost_initializers = [];
    let _laborCost_extraInitializers = [];
    let _totalCost_decorators;
    let _totalCost_initializers = [];
    let _totalCost_extraInitializers = [];
    let _assetMeterReading_decorators;
    let _assetMeterReading_initializers = [];
    let _assetMeterReading_extraInitializers = [];
    let _followUpRequired_decorators;
    let _followUpRequired_initializers = [];
    let _followUpRequired_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var MaintenanceHistory = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.assetId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _assetId_initializers, void 0));
            this.workOrderId = (__runInitializers(this, _assetId_extraInitializers), __runInitializers(this, _workOrderId_initializers, void 0));
            this.maintenanceType = (__runInitializers(this, _workOrderId_extraInitializers), __runInitializers(this, _maintenanceType_initializers, void 0));
            this.maintenanceDate = (__runInitializers(this, _maintenanceType_extraInitializers), __runInitializers(this, _maintenanceDate_initializers, void 0));
            this.performedBy = (__runInitializers(this, _maintenanceDate_extraInitializers), __runInitializers(this, _performedBy_initializers, void 0));
            this.workDescription = (__runInitializers(this, _performedBy_extraInitializers), __runInitializers(this, _workDescription_initializers, void 0));
            this.laborHours = (__runInitializers(this, _workDescription_extraInitializers), __runInitializers(this, _laborHours_initializers, void 0));
            this.partsCost = (__runInitializers(this, _laborHours_extraInitializers), __runInitializers(this, _partsCost_initializers, void 0));
            this.laborCost = (__runInitializers(this, _partsCost_extraInitializers), __runInitializers(this, _laborCost_initializers, void 0));
            this.totalCost = (__runInitializers(this, _laborCost_extraInitializers), __runInitializers(this, _totalCost_initializers, void 0));
            this.assetMeterReading = (__runInitializers(this, _totalCost_extraInitializers), __runInitializers(this, _assetMeterReading_initializers, void 0));
            this.followUpRequired = (__runInitializers(this, _assetMeterReading_extraInitializers), __runInitializers(this, _followUpRequired_initializers, void 0));
            this.createdAt = (__runInitializers(this, _followUpRequired_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "MaintenanceHistory");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _assetId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Asset ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _workOrderId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Work order ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _maintenanceType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Maintenance type' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(MaintenanceType)), allowNull: false })];
        _maintenanceDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Maintenance date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false }), sequelize_typescript_1.Index];
        _performedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Performed by user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _workDescription_decorators = [(0, swagger_1.ApiProperty)({ description: 'Work description' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: false })];
        _laborHours_decorators = [(0, swagger_1.ApiProperty)({ description: 'Labor hours' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(8, 2), allowNull: false })];
        _partsCost_decorators = [(0, swagger_1.ApiProperty)({ description: 'Parts cost' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(12, 2) })];
        _laborCost_decorators = [(0, swagger_1.ApiProperty)({ description: 'Labor cost' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(12, 2) })];
        _totalCost_decorators = [(0, swagger_1.ApiProperty)({ description: 'Total cost' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(12, 2) })];
        _assetMeterReading_decorators = [(0, swagger_1.ApiProperty)({ description: 'Asset meter reading' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER })];
        _followUpRequired_decorators = [(0, swagger_1.ApiProperty)({ description: 'Follow-up required' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _assetId_decorators, { kind: "field", name: "assetId", static: false, private: false, access: { has: obj => "assetId" in obj, get: obj => obj.assetId, set: (obj, value) => { obj.assetId = value; } }, metadata: _metadata }, _assetId_initializers, _assetId_extraInitializers);
        __esDecorate(null, null, _workOrderId_decorators, { kind: "field", name: "workOrderId", static: false, private: false, access: { has: obj => "workOrderId" in obj, get: obj => obj.workOrderId, set: (obj, value) => { obj.workOrderId = value; } }, metadata: _metadata }, _workOrderId_initializers, _workOrderId_extraInitializers);
        __esDecorate(null, null, _maintenanceType_decorators, { kind: "field", name: "maintenanceType", static: false, private: false, access: { has: obj => "maintenanceType" in obj, get: obj => obj.maintenanceType, set: (obj, value) => { obj.maintenanceType = value; } }, metadata: _metadata }, _maintenanceType_initializers, _maintenanceType_extraInitializers);
        __esDecorate(null, null, _maintenanceDate_decorators, { kind: "field", name: "maintenanceDate", static: false, private: false, access: { has: obj => "maintenanceDate" in obj, get: obj => obj.maintenanceDate, set: (obj, value) => { obj.maintenanceDate = value; } }, metadata: _metadata }, _maintenanceDate_initializers, _maintenanceDate_extraInitializers);
        __esDecorate(null, null, _performedBy_decorators, { kind: "field", name: "performedBy", static: false, private: false, access: { has: obj => "performedBy" in obj, get: obj => obj.performedBy, set: (obj, value) => { obj.performedBy = value; } }, metadata: _metadata }, _performedBy_initializers, _performedBy_extraInitializers);
        __esDecorate(null, null, _workDescription_decorators, { kind: "field", name: "workDescription", static: false, private: false, access: { has: obj => "workDescription" in obj, get: obj => obj.workDescription, set: (obj, value) => { obj.workDescription = value; } }, metadata: _metadata }, _workDescription_initializers, _workDescription_extraInitializers);
        __esDecorate(null, null, _laborHours_decorators, { kind: "field", name: "laborHours", static: false, private: false, access: { has: obj => "laborHours" in obj, get: obj => obj.laborHours, set: (obj, value) => { obj.laborHours = value; } }, metadata: _metadata }, _laborHours_initializers, _laborHours_extraInitializers);
        __esDecorate(null, null, _partsCost_decorators, { kind: "field", name: "partsCost", static: false, private: false, access: { has: obj => "partsCost" in obj, get: obj => obj.partsCost, set: (obj, value) => { obj.partsCost = value; } }, metadata: _metadata }, _partsCost_initializers, _partsCost_extraInitializers);
        __esDecorate(null, null, _laborCost_decorators, { kind: "field", name: "laborCost", static: false, private: false, access: { has: obj => "laborCost" in obj, get: obj => obj.laborCost, set: (obj, value) => { obj.laborCost = value; } }, metadata: _metadata }, _laborCost_initializers, _laborCost_extraInitializers);
        __esDecorate(null, null, _totalCost_decorators, { kind: "field", name: "totalCost", static: false, private: false, access: { has: obj => "totalCost" in obj, get: obj => obj.totalCost, set: (obj, value) => { obj.totalCost = value; } }, metadata: _metadata }, _totalCost_initializers, _totalCost_extraInitializers);
        __esDecorate(null, null, _assetMeterReading_decorators, { kind: "field", name: "assetMeterReading", static: false, private: false, access: { has: obj => "assetMeterReading" in obj, get: obj => obj.assetMeterReading, set: (obj, value) => { obj.assetMeterReading = value; } }, metadata: _metadata }, _assetMeterReading_initializers, _assetMeterReading_extraInitializers);
        __esDecorate(null, null, _followUpRequired_decorators, { kind: "field", name: "followUpRequired", static: false, private: false, access: { has: obj => "followUpRequired" in obj, get: obj => obj.followUpRequired, set: (obj, value) => { obj.followUpRequired = value; } }, metadata: _metadata }, _followUpRequired_initializers, _followUpRequired_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MaintenanceHistory = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MaintenanceHistory = _classThis;
})();
exports.MaintenanceHistory = MaintenanceHistory;
// ============================================================================
// MAINTENANCE REQUEST FUNCTIONS
// ============================================================================
/**
 * Creates a maintenance request
 *
 * @param data - Maintenance request data
 * @param transaction - Optional database transaction
 * @returns Created maintenance request
 *
 * @example
 * ```typescript
 * const request = await createMaintenanceRequest({
 *   assetId: 'asset-123',
 *   requestType: MaintenanceType.CORRECTIVE,
 *   priority: MaintenancePriority.HIGH,
 *   description: 'Motor overheating',
 *   requestedBy: 'user-456',
 *   symptoms: ['unusual noise', 'excessive heat']
 * });
 * ```
 */
async function createMaintenanceRequest(data, transaction) {
    const request = await MaintenanceRequest.create({
        ...data,
        status: RequestStatus.SUBMITTED,
    }, { transaction });
    return request;
}
/**
 * Approves maintenance request
 *
 * @param requestId - Request identifier
 * @param approverId - Approver user ID
 * @param transaction - Optional database transaction
 * @returns Updated request
 *
 * @example
 * ```typescript
 * await approveMaintenanceRequest('req-123', 'manager-456');
 * ```
 */
async function approveMaintenanceRequest(requestId, approverId, transaction) {
    const request = await MaintenanceRequest.findByPk(requestId, { transaction });
    if (!request) {
        throw new common_1.NotFoundException(`Maintenance request ${requestId} not found`);
    }
    await request.update({
        status: RequestStatus.APPROVED,
        approvedBy: approverId,
        approvalDate: new Date(),
    }, { transaction });
    return request;
}
/**
 * Rejects maintenance request
 *
 * @param requestId - Request identifier
 * @param approverId - Approver user ID
 * @param reason - Rejection reason
 * @param transaction - Optional database transaction
 * @returns Updated request
 *
 * @example
 * ```typescript
 * await rejectMaintenanceRequest('req-123', 'manager-456', 'Duplicate request');
 * ```
 */
async function rejectMaintenanceRequest(requestId, approverId, reason, transaction) {
    const request = await MaintenanceRequest.findByPk(requestId, { transaction });
    if (!request) {
        throw new common_1.NotFoundException(`Maintenance request ${requestId} not found`);
    }
    await request.update({
        status: RequestStatus.REJECTED,
        approvedBy: approverId,
        approvalDate: new Date(),
        rejectionReason: reason,
    }, { transaction });
    return request;
}
/**
 * Gets maintenance requests by status
 *
 * @param status - Request status
 * @param options - Query options
 * @returns Maintenance requests
 *
 * @example
 * ```typescript
 * const pending = await getMaintenanceRequestsByStatus(RequestStatus.SUBMITTED);
 * ```
 */
async function getMaintenanceRequestsByStatus(status, options = {}) {
    return MaintenanceRequest.findAll({
        where: { status },
        order: [['priority', 'DESC'], ['createdAt', 'ASC']],
        ...options,
    });
}
/**
 * Gets maintenance requests by asset
 *
 * @param assetId - Asset identifier
 * @returns Maintenance requests
 *
 * @example
 * ```typescript
 * const requests = await getMaintenanceRequestsByAsset('asset-123');
 * ```
 */
async function getMaintenanceRequestsByAsset(assetId) {
    return MaintenanceRequest.findAll({
        where: { assetId },
        order: [['createdAt', 'DESC']],
    });
}
// ============================================================================
// WORK ORDER MANAGEMENT FUNCTIONS
// ============================================================================
/**
 * Creates a work order
 *
 * @param data - Work order data
 * @param transaction - Optional database transaction
 * @returns Created work order
 *
 * @example
 * ```typescript
 * const wo = await createWorkOrder({
 *   assetId: 'asset-123',
 *   maintenanceType: MaintenanceType.PREVENTIVE,
 *   priority: MaintenancePriority.MEDIUM,
 *   description: 'Monthly PM inspection',
 *   scheduledStartDate: new Date('2024-06-01'),
 *   estimatedDuration: 120
 * });
 * ```
 */
async function createWorkOrder(data, transaction) {
    const workOrder = await WorkOrder.create({
        ...data,
        status: WorkOrderStatus.DRAFT,
    }, { transaction });
    // If created from request, update request status
    if (data.maintenanceRequestId) {
        await MaintenanceRequest.update({ status: RequestStatus.WORK_ORDER_CREATED }, { where: { id: data.maintenanceRequestId }, transaction });
    }
    return workOrder;
}
/**
 * Assigns work order to technician
 *
 * @param data - Assignment data
 * @param transaction - Optional database transaction
 * @returns Created assignment
 *
 * @example
 * ```typescript
 * await assignTechnician({
 *   workOrderId: 'wo-123',
 *   technicianId: 'tech-456',
 *   assignedDate: new Date(),
 *   primaryTechnician: true,
 *   estimatedHours: 2.5
 * });
 * ```
 */
async function assignTechnician(data, transaction) {
    const assignment = await TechnicianAssignment.create(data, { transaction });
    // Update work order status and assigned technician
    if (data.primaryTechnician) {
        await WorkOrder.update({
            status: WorkOrderStatus.ASSIGNED,
            assignedTechnicianId: data.technicianId,
        }, { where: { id: data.workOrderId }, transaction });
    }
    return assignment;
}
/**
 * Starts work order execution
 *
 * @param workOrderId - Work order identifier
 * @param transaction - Optional database transaction
 * @returns Updated work order
 *
 * @example
 * ```typescript
 * await startWorkOrder('wo-123');
 * ```
 */
async function startWorkOrder(workOrderId, transaction) {
    const wo = await WorkOrder.findByPk(workOrderId, { transaction });
    if (!wo) {
        throw new common_1.NotFoundException(`Work order ${workOrderId} not found`);
    }
    if (wo.status !== WorkOrderStatus.SCHEDULED && wo.status !== WorkOrderStatus.ASSIGNED) {
        throw new common_1.BadRequestException('Work order must be scheduled or assigned to start');
    }
    await wo.update({
        status: WorkOrderStatus.IN_PROGRESS,
        actualStartDate: new Date(),
    }, { transaction });
    // Create downtime record if applicable
    if (wo.maintenanceType === MaintenanceType.CORRECTIVE ||
        wo.maintenanceType === MaintenanceType.EMERGENCY) {
        await createDowntimeRecord({
            assetId: wo.assetId,
            category: wo.maintenanceType === MaintenanceType.EMERGENCY
                ? DowntimeCategory.EMERGENCY
                : DowntimeCategory.UNPLANNED,
            startTime: new Date(),
            reason: wo.description,
            workOrderId: wo.id,
        }, transaction);
    }
    return wo;
}
/**
 * Completes work order
 *
 * @param data - Completion data
 * @param transaction - Optional database transaction
 * @returns Updated work order
 *
 * @example
 * ```typescript
 * await completeWorkOrder({
 *   workOrderId: 'wo-123',
 *   completedBy: 'tech-456',
 *   completionDate: new Date(),
 *   actualDuration: 135,
 *   workPerformed: 'Replaced bearings and lubricated',
 *   partsUsed: [{ partId: 'part-1', quantityUsed: 2 }],
 *   followUpRequired: false
 * });
 * ```
 */
async function completeWorkOrder(data, transaction) {
    const wo = await WorkOrder.findByPk(data.workOrderId, { transaction });
    if (!wo) {
        throw new common_1.NotFoundException(`Work order ${data.workOrderId} not found`);
    }
    await wo.update({
        status: WorkOrderStatus.COMPLETED,
        actualEndDate: data.completionDate,
        actualDuration: data.actualDuration,
        completedBy: data.completedBy,
        workPerformed: data.workPerformed,
        partsUsed: data.partsUsed,
        findings: data.findings,
        recommendations: data.recommendations,
        followUpRequired: data.followUpRequired,
        followUpNotes: data.followUpNotes,
    }, { transaction });
    // Create maintenance history record
    const laborHours = data.actualDuration / 60;
    await MaintenanceHistory.create({
        assetId: wo.assetId,
        workOrderId: wo.id,
        maintenanceType: wo.maintenanceType,
        maintenanceDate: data.completionDate,
        performedBy: data.completedBy,
        workDescription: data.workPerformed,
        laborHours,
        followUpRequired: data.followUpRequired,
    }, { transaction });
    // Close downtime record if exists
    const downtime = await DowntimeRecord.findOne({
        where: { workOrderId: wo.id, endTime: null },
        transaction,
    });
    if (downtime) {
        await endDowntime(downtime.id, transaction);
    }
    // Update request status if applicable
    if (wo.maintenanceRequestId) {
        await MaintenanceRequest.update({ status: RequestStatus.COMPLETED }, { where: { id: wo.maintenanceRequestId }, transaction });
    }
    return wo;
}
/**
 * Puts work order on hold
 *
 * @param workOrderId - Work order identifier
 * @param reason - Hold reason
 * @param transaction - Optional database transaction
 * @returns Updated work order
 *
 * @example
 * ```typescript
 * await putWorkOrderOnHold('wo-123', 'Waiting for parts delivery');
 * ```
 */
async function putWorkOrderOnHold(workOrderId, reason, transaction) {
    const wo = await WorkOrder.findByPk(workOrderId, { transaction });
    if (!wo) {
        throw new common_1.NotFoundException(`Work order ${workOrderId} not found`);
    }
    await wo.update({
        status: WorkOrderStatus.ON_HOLD,
        notes: `${wo.notes || ''}\n[${new Date().toISOString()}] On hold: ${reason}`,
    }, { transaction });
    return wo;
}
/**
 * Cancels work order
 *
 * @param workOrderId - Work order identifier
 * @param reason - Cancellation reason
 * @param transaction - Optional database transaction
 * @returns Updated work order
 *
 * @example
 * ```typescript
 * await cancelWorkOrder('wo-123', 'Asset no longer in service');
 * ```
 */
async function cancelWorkOrder(workOrderId, reason, transaction) {
    const wo = await WorkOrder.findByPk(workOrderId, { transaction });
    if (!wo) {
        throw new common_1.NotFoundException(`Work order ${workOrderId} not found`);
    }
    if (wo.status === WorkOrderStatus.COMPLETED) {
        throw new common_1.BadRequestException('Cannot cancel completed work order');
    }
    await wo.update({
        status: WorkOrderStatus.CANCELLED,
        notes: `${wo.notes || ''}\n[${new Date().toISOString()}] Cancelled: ${reason}`,
    }, { transaction });
    return wo;
}
/**
 * Gets work orders by status
 *
 * @param status - Work order status
 * @param options - Query options
 * @returns Work orders
 *
 * @example
 * ```typescript
 * const inProgress = await getWorkOrdersByStatus(WorkOrderStatus.IN_PROGRESS);
 * ```
 */
async function getWorkOrdersByStatus(status, options = {}) {
    return WorkOrder.findAll({
        where: { status },
        order: [['priority', 'DESC'], ['scheduledStartDate', 'ASC']],
        ...options,
    });
}
/**
 * Gets work orders by technician
 *
 * @param technicianId - Technician identifier
 * @param activeOnly - Filter for active work orders only
 * @returns Work orders
 *
 * @example
 * ```typescript
 * const myWorkOrders = await getWorkOrdersByTechnician('tech-123', true);
 * ```
 */
async function getWorkOrdersByTechnician(technicianId, activeOnly = false) {
    const where = { assignedTechnicianId: technicianId };
    if (activeOnly) {
        where.status = {
            [sequelize_1.Op.in]: [
                WorkOrderStatus.ASSIGNED,
                WorkOrderStatus.IN_PROGRESS,
                WorkOrderStatus.SCHEDULED,
            ],
        };
    }
    return WorkOrder.findAll({
        where,
        order: [['scheduledStartDate', 'ASC']],
    });
}
/**
 * Gets work orders by asset
 *
 * @param assetId - Asset identifier
 * @returns Work order history
 *
 * @example
 * ```typescript
 * const history = await getWorkOrdersByAsset('asset-123');
 * ```
 */
async function getWorkOrdersByAsset(assetId) {
    return WorkOrder.findAll({
        where: { assetId },
        order: [['createdAt', 'DESC']],
    });
}
// ============================================================================
// PM SCHEDULE MANAGEMENT FUNCTIONS
// ============================================================================
/**
 * Creates PM schedule
 *
 * @param data - PM schedule data
 * @param transaction - Optional database transaction
 * @returns Created PM schedule
 *
 * @example
 * ```typescript
 * const schedule = await createPMSchedule({
 *   assetId: 'asset-123',
 *   scheduleType: MaintenanceType.PREVENTIVE,
 *   frequency: ScheduleFrequency.MONTHLY,
 *   description: 'Monthly inspection',
 *   tasks: [{
 *     sequence: 1,
 *     description: 'Check oil levels',
 *     estimatedDuration: 15
 *   }],
 *   estimatedDuration: 60,
 *   startDate: new Date('2024-01-01')
 * });
 * ```
 */
async function createPMSchedule(data, transaction) {
    const schedule = await PMSchedule.create({
        ...data,
        isActive: true,
        totalExecutions: 0,
        nextDueDate: calculateNextDueDate(data.startDate, data.frequency, data.frequencyValue),
    }, { transaction });
    return schedule;
}
/**
 * Generates work order from PM schedule
 *
 * @param scheduleId - PM schedule identifier
 * @param scheduledDate - Scheduled execution date
 * @param transaction - Optional database transaction
 * @returns Created work order
 *
 * @example
 * ```typescript
 * const wo = await generateWorkOrderFromPM('schedule-123', new Date('2024-06-01'));
 * ```
 */
async function generateWorkOrderFromPM(scheduleId, scheduledDate, transaction) {
    const schedule = await PMSchedule.findByPk(scheduleId, { transaction });
    if (!schedule) {
        throw new common_1.NotFoundException(`PM schedule ${scheduleId} not found`);
    }
    if (!schedule.isActive) {
        throw new common_1.BadRequestException('PM schedule is not active');
    }
    const workOrder = await createWorkOrder({
        assetId: schedule.assetId,
        maintenanceType: schedule.scheduleType,
        priority: MaintenancePriority.MEDIUM,
        description: schedule.description,
        scheduledStartDate: scheduledDate,
        estimatedDuration: schedule.estimatedDuration,
        instructions: generatePMInstructions(schedule.tasks),
        requiredParts: schedule.requiredParts,
    }, transaction);
    // Update schedule
    await schedule.update({
        lastPerformedDate: scheduledDate,
        nextDueDate: calculateNextDueDate(scheduledDate, schedule.frequency, schedule.frequencyValue),
        totalExecutions: schedule.totalExecutions + 1,
    }, { transaction });
    return workOrder;
}
/**
 * Gets due PM schedules
 *
 * @param daysAhead - Days to look ahead
 * @returns Due PM schedules
 *
 * @example
 * ```typescript
 * const due = await getDuePMSchedules(7); // Next 7 days
 * ```
 */
async function getDuePMSchedules(daysAhead = 30) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);
    return PMSchedule.findAll({
        where: {
            isActive: true,
            nextDueDate: {
                [sequelize_1.Op.lte]: futureDate,
            },
        },
        order: [['nextDueDate', 'ASC']],
    });
}
/**
 * Updates PM schedule
 *
 * @param scheduleId - Schedule identifier
 * @param updates - Fields to update
 * @param transaction - Optional database transaction
 * @returns Updated schedule
 *
 * @example
 * ```typescript
 * await updatePMSchedule('schedule-123', {
 *   frequency: ScheduleFrequency.QUARTERLY,
 *   estimatedDuration: 90
 * });
 * ```
 */
async function updatePMSchedule(scheduleId, updates, transaction) {
    const schedule = await PMSchedule.findByPk(scheduleId, { transaction });
    if (!schedule) {
        throw new common_1.NotFoundException(`PM schedule ${scheduleId} not found`);
    }
    await schedule.update(updates, { transaction });
    return schedule;
}
/**
 * Deactivates PM schedule
 *
 * @param scheduleId - Schedule identifier
 * @param transaction - Optional database transaction
 * @returns Updated schedule
 *
 * @example
 * ```typescript
 * await deactivatePMSchedule('schedule-123');
 * ```
 */
async function deactivatePMSchedule(scheduleId, transaction) {
    const schedule = await PMSchedule.findByPk(scheduleId, { transaction });
    if (!schedule) {
        throw new common_1.NotFoundException(`PM schedule ${scheduleId} not found`);
    }
    await schedule.update({ isActive: false }, { transaction });
    return schedule;
}
/**
 * Gets PM schedules by asset
 *
 * @param assetId - Asset identifier
 * @param activeOnly - Filter for active schedules only
 * @returns PM schedules
 *
 * @example
 * ```typescript
 * const schedules = await getPMSchedulesByAsset('asset-123', true);
 * ```
 */
async function getPMSchedulesByAsset(assetId, activeOnly = false) {
    const where = { assetId };
    if (activeOnly) {
        where.isActive = true;
    }
    return PMSchedule.findAll({
        where,
        order: [['nextDueDate', 'ASC']],
    });
}
// ============================================================================
// PARTS MANAGEMENT FUNCTIONS
// ============================================================================
/**
 * Reserves parts for work order
 *
 * @param data - Part reservation data
 * @param transaction - Optional database transaction
 * @returns Created reservation
 *
 * @example
 * ```typescript
 * await reservePart({
 *   workOrderId: 'wo-123',
 *   partId: 'part-456',
 *   quantity: 2,
 *   reservedBy: 'planner-789',
 *   requiredBy: new Date('2024-06-01')
 * });
 * ```
 */
async function reservePart(data, transaction) {
    const part = await PartInventory.findByPk(data.partId, { transaction });
    if (!part) {
        throw new common_1.NotFoundException(`Part ${data.partId} not found`);
    }
    if (part.quantityAvailable < data.quantity) {
        throw new common_1.BadRequestException(`Insufficient quantity available. Available: ${part.quantityAvailable}, Requested: ${data.quantity}`);
    }
    const reservation = await PartReservation.create({
        ...data,
        status: 'reserved',
    }, { transaction });
    // Update part inventory
    await part.update({
        quantityReserved: part.quantityReserved + data.quantity,
        quantityAvailable: part.quantityAvailable - data.quantity,
    }, { transaction });
    return reservation;
}
/**
 * Issues reserved parts
 *
 * @param reservationId - Reservation identifier
 * @param issuedBy - User issuing parts
 * @param quantityIssued - Quantity to issue
 * @param transaction - Optional database transaction
 * @returns Updated reservation
 *
 * @example
 * ```typescript
 * await issueReservedParts('res-123', 'storekeeper-456', 2);
 * ```
 */
async function issueReservedParts(reservationId, issuedBy, quantityIssued, transaction) {
    const reservation = await PartReservation.findByPk(reservationId, {
        include: [{ model: PartInventory }],
        transaction,
    });
    if (!reservation) {
        throw new common_1.NotFoundException(`Reservation ${reservationId} not found`);
    }
    if (quantityIssued > reservation.quantityReserved) {
        throw new common_1.BadRequestException('Cannot issue more than reserved quantity');
    }
    await reservation.update({
        quantityIssued,
        status: 'issued',
        issuedBy,
        issuedDate: new Date(),
    }, { transaction });
    // Update part inventory
    const part = reservation.part;
    await part.update({
        quantityOnHand: part.quantityOnHand - quantityIssued,
        quantityReserved: part.quantityReserved - quantityIssued,
    }, { transaction });
    return reservation;
}
/**
 * Cancels part reservation
 *
 * @param reservationId - Reservation identifier
 * @param transaction - Optional database transaction
 * @returns Updated reservation
 *
 * @example
 * ```typescript
 * await cancelPartReservation('res-123');
 * ```
 */
async function cancelPartReservation(reservationId, transaction) {
    const reservation = await PartReservation.findByPk(reservationId, {
        include: [{ model: PartInventory }],
        transaction,
    });
    if (!reservation) {
        throw new common_1.NotFoundException(`Reservation ${reservationId} not found`);
    }
    if (reservation.status === 'issued') {
        throw new common_1.BadRequestException('Cannot cancel already issued reservation');
    }
    await reservation.update({ status: 'cancelled' }, { transaction });
    // Return parts to available inventory
    const part = reservation.part;
    await part.update({
        quantityReserved: part.quantityReserved - reservation.quantityReserved,
        quantityAvailable: part.quantityAvailable + reservation.quantityReserved,
    }, { transaction });
    return reservation;
}
/**
 * Gets parts below reorder point
 *
 * @returns Parts needing reorder
 *
 * @example
 * ```typescript
 * const lowStock = await getPartsNeedingReorder();
 * ```
 */
async function getPartsNeedingReorder() {
    return PartInventory.findAll({
        where: {
            quantityAvailable: {
                [sequelize_1.Op.lte]: PartInventory.sequelize.col('reorder_point'),
            },
            reorderPoint: { [sequelize_1.Op.not]: null },
        },
        order: [['isCritical', 'DESC'], ['quantityAvailable', 'ASC']],
    });
}
// ============================================================================
// DOWNTIME TRACKING FUNCTIONS
// ============================================================================
/**
 * Creates downtime record
 *
 * @param data - Downtime data
 * @param transaction - Optional database transaction
 * @returns Created downtime record
 *
 * @example
 * ```typescript
 * const downtime = await createDowntimeRecord({
 *   assetId: 'asset-123',
 *   category: DowntimeCategory.UNPLANNED,
 *   startTime: new Date(),
 *   reason: 'Bearing failure',
 *   failureMode: FailureMode.MECHANICAL
 * });
 * ```
 */
async function createDowntimeRecord(data, transaction) {
    const record = await DowntimeRecord.create(data, { transaction });
    return record;
}
/**
 * Ends downtime
 *
 * @param downtimeId - Downtime record identifier
 * @param transaction - Optional database transaction
 * @returns Updated downtime record
 *
 * @example
 * ```typescript
 * await endDowntime('downtime-123');
 * ```
 */
async function endDowntime(downtimeId, transaction) {
    const record = await DowntimeRecord.findByPk(downtimeId, { transaction });
    if (!record) {
        throw new common_1.NotFoundException(`Downtime record ${downtimeId} not found`);
    }
    const endTime = new Date();
    const durationMinutes = Math.floor((endTime.getTime() - record.startTime.getTime()) / (1000 * 60));
    await record.update({
        endTime,
        durationMinutes,
    }, { transaction });
    return record;
}
/**
 * Gets downtime by asset
 *
 * @param assetId - Asset identifier
 * @param startDate - Start of period
 * @param endDate - End of period
 * @returns Downtime records
 *
 * @example
 * ```typescript
 * const downtime = await getDowntimeByAsset(
 *   'asset-123',
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
async function getDowntimeByAsset(assetId, startDate, endDate) {
    const where = { assetId };
    if (startDate || endDate) {
        where.startTime = {};
        if (startDate) {
            where.startTime[sequelize_1.Op.gte] = startDate;
        }
        if (endDate) {
            where.startTime[sequelize_1.Op.lte] = endDate;
        }
    }
    return DowntimeRecord.findAll({
        where,
        order: [['startTime', 'DESC']],
    });
}
/**
 * Calculates downtime metrics
 *
 * @param assetId - Asset identifier
 * @param startDate - Start of period
 * @param endDate - End of period
 * @returns Downtime metrics
 *
 * @example
 * ```typescript
 * const metrics = await calculateDowntimeMetrics(
 *   'asset-123',
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
async function calculateDowntimeMetrics(assetId, startDate, endDate) {
    const records = await getDowntimeByAsset(assetId, startDate, endDate);
    const metrics = {
        totalDowntime: 0,
        plannedDowntime: 0,
        unplannedDowntime: 0,
        emergencyDowntime: 0,
        mtbf: 0,
        mttr: 0,
    };
    records.forEach(record => {
        const duration = record.durationMinutes || 0;
        metrics.totalDowntime += duration;
        switch (record.category) {
            case DowntimeCategory.PLANNED:
                metrics.plannedDowntime += duration;
                break;
            case DowntimeCategory.UNPLANNED:
                metrics.unplannedDowntime += duration;
                break;
            case DowntimeCategory.EMERGENCY:
                metrics.emergencyDowntime += duration;
                break;
        }
    });
    // Calculate MTTR (average repair time)
    const completedRecords = records.filter(r => r.durationMinutes);
    if (completedRecords.length > 0) {
        metrics.mttr = metrics.totalDowntime / completedRecords.length;
    }
    // Calculate MTBF
    const periodHours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
    const operatingHours = periodHours - (metrics.totalDowntime / 60);
    if (completedRecords.length > 0) {
        metrics.mtbf = operatingHours / completedRecords.length;
    }
    return metrics;
}
// ============================================================================
// MAINTENANCE HISTORY AND ANALYTICS FUNCTIONS
// ============================================================================
/**
 * Gets maintenance history for asset
 *
 * @param assetId - Asset identifier
 * @param limit - Maximum records to return
 * @returns Maintenance history
 *
 * @example
 * ```typescript
 * const history = await getMaintenanceHistory('asset-123', 50);
 * ```
 */
async function getMaintenanceHistory(assetId, limit = 100) {
    return MaintenanceHistory.findAll({
        where: { assetId },
        order: [['maintenanceDate', 'DESC']],
        limit,
    });
}
/**
 * Calculates maintenance costs
 *
 * @param assetId - Asset identifier
 * @param startDate - Start of period
 * @param endDate - End of period
 * @returns Cost breakdown
 *
 * @example
 * ```typescript
 * const costs = await calculateMaintenanceCosts(
 *   'asset-123',
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
async function calculateMaintenanceCosts(assetId, startDate, endDate) {
    const history = await MaintenanceHistory.findAll({
        where: {
            assetId,
            maintenanceDate: {
                [sequelize_1.Op.between]: [startDate, endDate],
            },
        },
    });
    const result = {
        totalCost: 0,
        laborCost: 0,
        partsCost: 0,
        byMaintenanceType: {},
    };
    history.forEach(record => {
        const total = Number(record.totalCost || 0);
        const labor = Number(record.laborCost || 0);
        const parts = Number(record.partsCost || 0);
        result.totalCost += total;
        result.laborCost += labor;
        result.partsCost += parts;
        if (!result.byMaintenanceType[record.maintenanceType]) {
            result.byMaintenanceType[record.maintenanceType] = 0;
        }
        result.byMaintenanceType[record.maintenanceType] += total;
    });
    return result;
}
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Calculates next due date for PM schedule
 */
function calculateNextDueDate(lastDate, frequency, customValue) {
    const next = new Date(lastDate);
    switch (frequency) {
        case ScheduleFrequency.DAILY:
            next.setDate(next.getDate() + (customValue || 1));
            break;
        case ScheduleFrequency.WEEKLY:
            next.setDate(next.getDate() + (customValue || 1) * 7);
            break;
        case ScheduleFrequency.MONTHLY:
            next.setMonth(next.getMonth() + (customValue || 1));
            break;
        case ScheduleFrequency.QUARTERLY:
            next.setMonth(next.getMonth() + 3);
            break;
        case ScheduleFrequency.SEMI_ANNUAL:
            next.setMonth(next.getMonth() + 6);
            break;
        case ScheduleFrequency.ANNUAL:
            next.setFullYear(next.getFullYear() + 1);
            break;
        case ScheduleFrequency.BI_ANNUAL:
            next.setFullYear(next.getFullYear() + 2);
            break;
        default:
            next.setMonth(next.getMonth() + 1);
    }
    return next;
}
/**
 * Generates PM instructions from tasks
 */
function generatePMInstructions(tasks) {
    return tasks
        .sort((a, b) => a.sequence - b.sequence)
        .map(task => `${task.sequence}. ${task.description}`)
        .join('\n');
}
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Models
    MaintenanceRequest,
    WorkOrder,
    PMSchedule,
    TechnicianAssignment,
    PartInventory,
    PartReservation,
    DowntimeRecord,
    MaintenanceHistory,
    // Maintenance Request Functions
    createMaintenanceRequest,
    approveMaintenanceRequest,
    rejectMaintenanceRequest,
    getMaintenanceRequestsByStatus,
    getMaintenanceRequestsByAsset,
    // Work Order Functions
    createWorkOrder,
    assignTechnician,
    startWorkOrder,
    completeWorkOrder,
    putWorkOrderOnHold,
    cancelWorkOrder,
    getWorkOrdersByStatus,
    getWorkOrdersByTechnician,
    getWorkOrdersByAsset,
    // PM Schedule Functions
    createPMSchedule,
    generateWorkOrderFromPM,
    getDuePMSchedules,
    updatePMSchedule,
    deactivatePMSchedule,
    getPMSchedulesByAsset,
    // Parts Management Functions
    reservePart,
    issueReservedParts,
    cancelPartReservation,
    getPartsNeedingReorder,
    // Downtime Functions
    createDowntimeRecord,
    endDowntime,
    getDowntimeByAsset,
    calculateDowntimeMetrics,
    // History and Analytics Functions
    getMaintenanceHistory,
    calculateMaintenanceCosts,
};
//# sourceMappingURL=asset-maintenance-commands.js.map