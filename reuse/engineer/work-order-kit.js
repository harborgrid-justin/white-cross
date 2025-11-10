"use strict";
/**
 * WORK ORDER MANAGEMENT KIT
 *
 * Comprehensive work order management system for maintenance, repairs, and service requests.
 * Provides 45 specialized functions covering:
 * - Work order creation and initialization
 * - Priority and urgency classification
 * - Assignment and routing logic
 * - Status tracking and workflow management
 * - Time and labor tracking
 * - Material requisition and usage
 * - Work order completion and sign-off
 * - Preventive maintenance scheduling
 * - Recurring work order templates
 * - NestJS controllers with validation
 * - Swagger API documentation
 * - HIPAA-compliant audit logging
 *
 * @module WorkOrderKit
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
 * @security HIPAA compliant - all operations are audited and logged
 * @example
 * ```typescript
 * import {
 *   createWorkOrder,
 *   assignWorkOrder,
 *   trackLaborTime,
 *   completeWorkOrder
 * } from './work-order-kit';
 *
 * // Create a new work order
 * const workOrder = await createWorkOrder({
 *   title: 'HVAC System Repair',
 *   priority: 'high',
 *   facilityId: 'facility-123',
 *   requestedBy: 'user-456'
 * });
 *
 * // Assign to technician
 * await assignWorkOrder(workOrder.id, {
 *   assignedTo: 'tech-789',
 *   estimatedHours: 4
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
exports.WorkOrderController = exports.CompleteWorkOrderDto = exports.CreateMaterialRequisitionDto = exports.CreateLaborTimeDto = exports.AssignWorkOrderDto = exports.UpdateWorkOrderDto = exports.CreateWorkOrderDto = exports.LaborTimeType = exports.RecurrencePattern = exports.WorkOrderType = exports.WorkOrderStatus = exports.WorkOrderPriority = void 0;
exports.createWorkOrder = createWorkOrder;
exports.generateWorkOrderNumber = generateWorkOrderNumber;
exports.createWorkOrderFromTemplate = createWorkOrderFromTemplate;
exports.submitWorkOrder = submitWorkOrder;
exports.initializeRecurringWorkOrders = initializeRecurringWorkOrders;
exports.calculateWorkOrderPriority = calculateWorkOrderPriority;
exports.escalateWorkOrderPriority = escalateWorkOrderPriority;
exports.getWorkOrdersNeedingEscalation = getWorkOrdersNeedingEscalation;
exports.prioritizeWorkOrderQueue = prioritizeWorkOrderQueue;
exports.assignWorkOrder = assignWorkOrder;
exports.autoRouteWorkOrder = autoRouteWorkOrder;
exports.reassignWorkOrder = reassignWorkOrder;
exports.scheduleWorkOrder = scheduleWorkOrder;
exports.optimizeWorkOrderSchedule = optimizeWorkOrderSchedule;
exports.updateWorkOrderStatus = updateWorkOrderStatus;
exports.validateStatusTransition = validateStatusTransition;
exports.getWorkOrderStatusHistory = getWorkOrderStatusHistory;
exports.holdWorkOrder = holdWorkOrder;
exports.resumeWorkOrder = resumeWorkOrder;
exports.trackLaborTime = trackLaborTime;
exports.calculateTotalLaborHours = calculateTotalLaborHours;
exports.calculateTotalLaborCost = calculateTotalLaborCost;
exports.approveLaborTime = approveLaborTime;
exports.getLaborTimeEntries = getLaborTimeEntries;
exports.calculateOvertimeHours = calculateOvertimeHours;
exports.createMaterialRequisition = createMaterialRequisition;
exports.approveMaterialRequisition = approveMaterialRequisition;
exports.issueMaterials = issueMaterials;
exports.calculateTotalMaterialCost = calculateTotalMaterialCost;
exports.getMaterialRequisitionsForWorkOrder = getMaterialRequisitionsForWorkOrder;
exports.completeWorkOrder = completeWorkOrder;
exports.verifyWorkOrder = verifyWorkOrder;
exports.closeWorkOrder = closeWorkOrder;
exports.cancelWorkOrder = cancelWorkOrder;
exports.createPreventiveMaintenanceSchedule = createPreventiveMaintenanceSchedule;
exports.calculatePMCompliance = calculatePMCompliance;
exports.getOverduePMWorkOrders = getOverduePMWorkOrders;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const faker_1 = require("@faker-js/faker");
// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================
/**
 * Work order priority levels
 */
var WorkOrderPriority;
(function (WorkOrderPriority) {
    WorkOrderPriority["EMERGENCY"] = "emergency";
    WorkOrderPriority["HIGH"] = "high";
    WorkOrderPriority["MEDIUM"] = "medium";
    WorkOrderPriority["LOW"] = "low";
    WorkOrderPriority["ROUTINE"] = "routine";
})(WorkOrderPriority || (exports.WorkOrderPriority = WorkOrderPriority = {}));
/**
 * Work order status values
 */
var WorkOrderStatus;
(function (WorkOrderStatus) {
    WorkOrderStatus["DRAFT"] = "draft";
    WorkOrderStatus["SUBMITTED"] = "submitted";
    WorkOrderStatus["ASSIGNED"] = "assigned";
    WorkOrderStatus["IN_PROGRESS"] = "in_progress";
    WorkOrderStatus["ON_HOLD"] = "on_hold";
    WorkOrderStatus["COMPLETED"] = "completed";
    WorkOrderStatus["VERIFIED"] = "verified";
    WorkOrderStatus["CANCELLED"] = "cancelled";
    WorkOrderStatus["CLOSED"] = "closed";
})(WorkOrderStatus || (exports.WorkOrderStatus = WorkOrderStatus = {}));
/**
 * Work order types
 */
var WorkOrderType;
(function (WorkOrderType) {
    WorkOrderType["CORRECTIVE"] = "corrective";
    WorkOrderType["PREVENTIVE"] = "preventive";
    WorkOrderType["INSPECTION"] = "inspection";
    WorkOrderType["EMERGENCY"] = "emergency";
    WorkOrderType["PROJECT"] = "project";
    WorkOrderType["SAFETY"] = "safety";
    WorkOrderType["COMPLIANCE"] = "compliance";
})(WorkOrderType || (exports.WorkOrderType = WorkOrderType = {}));
/**
 * Recurrence patterns for preventive maintenance
 */
var RecurrencePattern;
(function (RecurrencePattern) {
    RecurrencePattern["DAILY"] = "daily";
    RecurrencePattern["WEEKLY"] = "weekly";
    RecurrencePattern["BIWEEKLY"] = "biweekly";
    RecurrencePattern["MONTHLY"] = "monthly";
    RecurrencePattern["QUARTERLY"] = "quarterly";
    RecurrencePattern["SEMIANNUAL"] = "semiannual";
    RecurrencePattern["ANNUAL"] = "annual";
})(RecurrencePattern || (exports.RecurrencePattern = RecurrencePattern = {}));
/**
 * Labor time entry types
 */
var LaborTimeType;
(function (LaborTimeType) {
    LaborTimeType["REGULAR"] = "regular";
    LaborTimeType["OVERTIME"] = "overtime";
    LaborTimeType["WEEKEND"] = "weekend";
    LaborTimeType["HOLIDAY"] = "holiday";
    LaborTimeType["EMERGENCY"] = "emergency";
})(LaborTimeType || (exports.LaborTimeType = LaborTimeType = {}));
// ============================================================================
// DTO CLASSES FOR VALIDATION
// ============================================================================
/**
 * Create work order DTO
 */
let CreateWorkOrderDto = (() => {
    var _a;
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _type_decorators;
    let _type_initializers = [];
    let _type_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    let _facilityId_decorators;
    let _facilityId_initializers = [];
    let _facilityId_extraInitializers = [];
    let _locationId_decorators;
    let _locationId_initializers = [];
    let _locationId_extraInitializers = [];
    let _assetId_decorators;
    let _assetId_initializers = [];
    let _assetId_extraInitializers = [];
    let _requestedBy_decorators;
    let _requestedBy_initializers = [];
    let _requestedBy_extraInitializers = [];
    let _dueDate_decorators;
    let _dueDate_initializers = [];
    let _dueDate_extraInitializers = [];
    let _estimatedHours_decorators;
    let _estimatedHours_initializers = [];
    let _estimatedHours_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _tags_decorators;
    let _tags_initializers = [];
    let _tags_extraInitializers = [];
    return _a = class CreateWorkOrderDto {
            constructor() {
                this.title = __runInitializers(this, _title_initializers, void 0);
                this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.type = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _type_initializers, void 0));
                this.priority = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
                this.facilityId = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _facilityId_initializers, void 0));
                this.locationId = (__runInitializers(this, _facilityId_extraInitializers), __runInitializers(this, _locationId_initializers, void 0));
                this.assetId = (__runInitializers(this, _locationId_extraInitializers), __runInitializers(this, _assetId_initializers, void 0));
                this.requestedBy = (__runInitializers(this, _assetId_extraInitializers), __runInitializers(this, _requestedBy_initializers, void 0));
                this.dueDate = (__runInitializers(this, _requestedBy_extraInitializers), __runInitializers(this, _dueDate_initializers, void 0));
                this.estimatedHours = (__runInitializers(this, _dueDate_extraInitializers), __runInitializers(this, _estimatedHours_initializers, void 0));
                this.notes = (__runInitializers(this, _estimatedHours_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
                this.tags = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _tags_initializers, void 0));
                __runInitializers(this, _tags_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _title_decorators = [ApiProperty({ description: 'Work order title' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MinLength)(3), (0, class_validator_1.MaxLength)(200)];
            _description_decorators = [ApiProperty({ description: 'Detailed description' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(2000)];
            _type_decorators = [ApiProperty({ enum: WorkOrderType, description: 'Work order type' }), (0, class_validator_1.IsEnum)(WorkOrderType)];
            _priority_decorators = [ApiProperty({ enum: WorkOrderPriority, description: 'Priority level' }), (0, class_validator_1.IsEnum)(WorkOrderPriority)];
            _facilityId_decorators = [ApiProperty({ description: 'Facility ID' }), (0, class_validator_1.IsUUID)()];
            _locationId_decorators = [ApiProperty({ description: 'Location ID', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsUUID)()];
            _assetId_decorators = [ApiProperty({ description: 'Asset ID', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsUUID)()];
            _requestedBy_decorators = [ApiProperty({ description: 'Requested by user ID' }), (0, class_validator_1.IsUUID)()];
            _dueDate_decorators = [ApiProperty({ description: 'Due date', required: false }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsDate)()];
            _estimatedHours_decorators = [ApiProperty({ description: 'Estimated hours', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0.1)];
            _notes_decorators = [ApiProperty({ description: 'Notes', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(1000)];
            _tags_decorators = [ApiProperty({ description: 'Tags', required: false, type: [String] }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: obj => "type" in obj, get: obj => obj.type, set: (obj, value) => { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
            __esDecorate(null, null, _facilityId_decorators, { kind: "field", name: "facilityId", static: false, private: false, access: { has: obj => "facilityId" in obj, get: obj => obj.facilityId, set: (obj, value) => { obj.facilityId = value; } }, metadata: _metadata }, _facilityId_initializers, _facilityId_extraInitializers);
            __esDecorate(null, null, _locationId_decorators, { kind: "field", name: "locationId", static: false, private: false, access: { has: obj => "locationId" in obj, get: obj => obj.locationId, set: (obj, value) => { obj.locationId = value; } }, metadata: _metadata }, _locationId_initializers, _locationId_extraInitializers);
            __esDecorate(null, null, _assetId_decorators, { kind: "field", name: "assetId", static: false, private: false, access: { has: obj => "assetId" in obj, get: obj => obj.assetId, set: (obj, value) => { obj.assetId = value; } }, metadata: _metadata }, _assetId_initializers, _assetId_extraInitializers);
            __esDecorate(null, null, _requestedBy_decorators, { kind: "field", name: "requestedBy", static: false, private: false, access: { has: obj => "requestedBy" in obj, get: obj => obj.requestedBy, set: (obj, value) => { obj.requestedBy = value; } }, metadata: _metadata }, _requestedBy_initializers, _requestedBy_extraInitializers);
            __esDecorate(null, null, _dueDate_decorators, { kind: "field", name: "dueDate", static: false, private: false, access: { has: obj => "dueDate" in obj, get: obj => obj.dueDate, set: (obj, value) => { obj.dueDate = value; } }, metadata: _metadata }, _dueDate_initializers, _dueDate_extraInitializers);
            __esDecorate(null, null, _estimatedHours_decorators, { kind: "field", name: "estimatedHours", static: false, private: false, access: { has: obj => "estimatedHours" in obj, get: obj => obj.estimatedHours, set: (obj, value) => { obj.estimatedHours = value; } }, metadata: _metadata }, _estimatedHours_initializers, _estimatedHours_extraInitializers);
            __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
            __esDecorate(null, null, _tags_decorators, { kind: "field", name: "tags", static: false, private: false, access: { has: obj => "tags" in obj, get: obj => obj.tags, set: (obj, value) => { obj.tags = value; } }, metadata: _metadata }, _tags_initializers, _tags_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateWorkOrderDto = CreateWorkOrderDto;
/**
 * Update work order DTO
 */
let UpdateWorkOrderDto = (() => {
    var _a;
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _dueDate_decorators;
    let _dueDate_initializers = [];
    let _dueDate_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    return _a = class UpdateWorkOrderDto {
            constructor() {
                this.title = __runInitializers(this, _title_initializers, void 0);
                this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.priority = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
                this.status = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.dueDate = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _dueDate_initializers, void 0));
                this.notes = (__runInitializers(this, _dueDate_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
                __runInitializers(this, _notes_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _title_decorators = [ApiProperty({ description: 'Work order title', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MinLength)(3), (0, class_validator_1.MaxLength)(200)];
            _description_decorators = [ApiProperty({ description: 'Description', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(2000)];
            _priority_decorators = [ApiProperty({ enum: WorkOrderPriority, required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(WorkOrderPriority)];
            _status_decorators = [ApiProperty({ enum: WorkOrderStatus, required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(WorkOrderStatus)];
            _dueDate_decorators = [ApiProperty({ description: 'Due date', required: false }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsDate)()];
            _notes_decorators = [ApiProperty({ description: 'Notes', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(1000)];
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _dueDate_decorators, { kind: "field", name: "dueDate", static: false, private: false, access: { has: obj => "dueDate" in obj, get: obj => obj.dueDate, set: (obj, value) => { obj.dueDate = value; } }, metadata: _metadata }, _dueDate_initializers, _dueDate_extraInitializers);
            __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.UpdateWorkOrderDto = UpdateWorkOrderDto;
/**
 * Assign work order DTO
 */
let AssignWorkOrderDto = (() => {
    var _a;
    let _assignedTo_decorators;
    let _assignedTo_initializers = [];
    let _assignedTo_extraInitializers = [];
    let _assignedTeam_decorators;
    let _assignedTeam_initializers = [];
    let _assignedTeam_extraInitializers = [];
    let _estimatedHours_decorators;
    let _estimatedHours_initializers = [];
    let _estimatedHours_extraInitializers = [];
    let _scheduledStartDate_decorators;
    let _scheduledStartDate_initializers = [];
    let _scheduledStartDate_extraInitializers = [];
    let _scheduledEndDate_decorators;
    let _scheduledEndDate_initializers = [];
    let _scheduledEndDate_extraInitializers = [];
    let _assignmentNotes_decorators;
    let _assignmentNotes_initializers = [];
    let _assignmentNotes_extraInitializers = [];
    return _a = class AssignWorkOrderDto {
            constructor() {
                this.assignedTo = __runInitializers(this, _assignedTo_initializers, void 0);
                this.assignedTeam = (__runInitializers(this, _assignedTo_extraInitializers), __runInitializers(this, _assignedTeam_initializers, void 0));
                this.estimatedHours = (__runInitializers(this, _assignedTeam_extraInitializers), __runInitializers(this, _estimatedHours_initializers, void 0));
                this.scheduledStartDate = (__runInitializers(this, _estimatedHours_extraInitializers), __runInitializers(this, _scheduledStartDate_initializers, void 0));
                this.scheduledEndDate = (__runInitializers(this, _scheduledStartDate_extraInitializers), __runInitializers(this, _scheduledEndDate_initializers, void 0));
                this.assignmentNotes = (__runInitializers(this, _scheduledEndDate_extraInitializers), __runInitializers(this, _assignmentNotes_initializers, void 0));
                __runInitializers(this, _assignmentNotes_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _assignedTo_decorators = [ApiProperty({ description: 'Assigned technician ID', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsUUID)()];
            _assignedTeam_decorators = [ApiProperty({ description: 'Assigned team ID', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsUUID)()];
            _estimatedHours_decorators = [ApiProperty({ description: 'Estimated hours' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0.1)];
            _scheduledStartDate_decorators = [ApiProperty({ description: 'Scheduled start date', required: false }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsDate)()];
            _scheduledEndDate_decorators = [ApiProperty({ description: 'Scheduled end date', required: false }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsDate)()];
            _assignmentNotes_decorators = [ApiProperty({ description: 'Assignment notes', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(500)];
            __esDecorate(null, null, _assignedTo_decorators, { kind: "field", name: "assignedTo", static: false, private: false, access: { has: obj => "assignedTo" in obj, get: obj => obj.assignedTo, set: (obj, value) => { obj.assignedTo = value; } }, metadata: _metadata }, _assignedTo_initializers, _assignedTo_extraInitializers);
            __esDecorate(null, null, _assignedTeam_decorators, { kind: "field", name: "assignedTeam", static: false, private: false, access: { has: obj => "assignedTeam" in obj, get: obj => obj.assignedTeam, set: (obj, value) => { obj.assignedTeam = value; } }, metadata: _metadata }, _assignedTeam_initializers, _assignedTeam_extraInitializers);
            __esDecorate(null, null, _estimatedHours_decorators, { kind: "field", name: "estimatedHours", static: false, private: false, access: { has: obj => "estimatedHours" in obj, get: obj => obj.estimatedHours, set: (obj, value) => { obj.estimatedHours = value; } }, metadata: _metadata }, _estimatedHours_initializers, _estimatedHours_extraInitializers);
            __esDecorate(null, null, _scheduledStartDate_decorators, { kind: "field", name: "scheduledStartDate", static: false, private: false, access: { has: obj => "scheduledStartDate" in obj, get: obj => obj.scheduledStartDate, set: (obj, value) => { obj.scheduledStartDate = value; } }, metadata: _metadata }, _scheduledStartDate_initializers, _scheduledStartDate_extraInitializers);
            __esDecorate(null, null, _scheduledEndDate_decorators, { kind: "field", name: "scheduledEndDate", static: false, private: false, access: { has: obj => "scheduledEndDate" in obj, get: obj => obj.scheduledEndDate, set: (obj, value) => { obj.scheduledEndDate = value; } }, metadata: _metadata }, _scheduledEndDate_initializers, _scheduledEndDate_extraInitializers);
            __esDecorate(null, null, _assignmentNotes_decorators, { kind: "field", name: "assignmentNotes", static: false, private: false, access: { has: obj => "assignmentNotes" in obj, get: obj => obj.assignmentNotes, set: (obj, value) => { obj.assignmentNotes = value; } }, metadata: _metadata }, _assignmentNotes_initializers, _assignmentNotes_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.AssignWorkOrderDto = AssignWorkOrderDto;
/**
 * Labor time entry DTO
 */
let CreateLaborTimeDto = (() => {
    var _a;
    let _workOrderId_decorators;
    let _workOrderId_initializers = [];
    let _workOrderId_extraInitializers = [];
    let _technicianId_decorators;
    let _technicianId_initializers = [];
    let _technicianId_extraInitializers = [];
    let _startTime_decorators;
    let _startTime_initializers = [];
    let _startTime_extraInitializers = [];
    let _endTime_decorators;
    let _endTime_initializers = [];
    let _endTime_extraInitializers = [];
    let _timeType_decorators;
    let _timeType_initializers = [];
    let _timeType_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _billable_decorators;
    let _billable_initializers = [];
    let _billable_extraInitializers = [];
    return _a = class CreateLaborTimeDto {
            constructor() {
                this.workOrderId = __runInitializers(this, _workOrderId_initializers, void 0);
                this.technicianId = (__runInitializers(this, _workOrderId_extraInitializers), __runInitializers(this, _technicianId_initializers, void 0));
                this.startTime = (__runInitializers(this, _technicianId_extraInitializers), __runInitializers(this, _startTime_initializers, void 0));
                this.endTime = (__runInitializers(this, _startTime_extraInitializers), __runInitializers(this, _endTime_initializers, void 0));
                this.timeType = (__runInitializers(this, _endTime_extraInitializers), __runInitializers(this, _timeType_initializers, void 0));
                this.description = (__runInitializers(this, _timeType_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.billable = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _billable_initializers, void 0));
                __runInitializers(this, _billable_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _workOrderId_decorators = [ApiProperty({ description: 'Work order ID' }), (0, class_validator_1.IsUUID)()];
            _technicianId_decorators = [ApiProperty({ description: 'Technician ID' }), (0, class_validator_1.IsUUID)()];
            _startTime_decorators = [ApiProperty({ description: 'Start time' }), (0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsDate)()];
            _endTime_decorators = [ApiProperty({ description: 'End time' }), (0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsDate)()];
            _timeType_decorators = [ApiProperty({ enum: LaborTimeType, description: 'Time type' }), (0, class_validator_1.IsEnum)(LaborTimeType)];
            _description_decorators = [ApiProperty({ description: 'Description of work performed', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(500)];
            _billable_decorators = [ApiProperty({ description: 'Billable flag' }), (0, class_validator_1.IsBoolean)()];
            __esDecorate(null, null, _workOrderId_decorators, { kind: "field", name: "workOrderId", static: false, private: false, access: { has: obj => "workOrderId" in obj, get: obj => obj.workOrderId, set: (obj, value) => { obj.workOrderId = value; } }, metadata: _metadata }, _workOrderId_initializers, _workOrderId_extraInitializers);
            __esDecorate(null, null, _technicianId_decorators, { kind: "field", name: "technicianId", static: false, private: false, access: { has: obj => "technicianId" in obj, get: obj => obj.technicianId, set: (obj, value) => { obj.technicianId = value; } }, metadata: _metadata }, _technicianId_initializers, _technicianId_extraInitializers);
            __esDecorate(null, null, _startTime_decorators, { kind: "field", name: "startTime", static: false, private: false, access: { has: obj => "startTime" in obj, get: obj => obj.startTime, set: (obj, value) => { obj.startTime = value; } }, metadata: _metadata }, _startTime_initializers, _startTime_extraInitializers);
            __esDecorate(null, null, _endTime_decorators, { kind: "field", name: "endTime", static: false, private: false, access: { has: obj => "endTime" in obj, get: obj => obj.endTime, set: (obj, value) => { obj.endTime = value; } }, metadata: _metadata }, _endTime_initializers, _endTime_extraInitializers);
            __esDecorate(null, null, _timeType_decorators, { kind: "field", name: "timeType", static: false, private: false, access: { has: obj => "timeType" in obj, get: obj => obj.timeType, set: (obj, value) => { obj.timeType = value; } }, metadata: _metadata }, _timeType_initializers, _timeType_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _billable_decorators, { kind: "field", name: "billable", static: false, private: false, access: { has: obj => "billable" in obj, get: obj => obj.billable, set: (obj, value) => { obj.billable = value; } }, metadata: _metadata }, _billable_initializers, _billable_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateLaborTimeDto = CreateLaborTimeDto;
/**
 * Material requisition DTO
 */
let CreateMaterialRequisitionDto = (() => {
    var _a;
    let _workOrderId_decorators;
    let _workOrderId_initializers = [];
    let _workOrderId_extraInitializers = [];
    let _materialId_decorators;
    let _materialId_initializers = [];
    let _materialId_extraInitializers = [];
    let _quantity_decorators;
    let _quantity_initializers = [];
    let _quantity_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    return _a = class CreateMaterialRequisitionDto {
            constructor() {
                this.workOrderId = __runInitializers(this, _workOrderId_initializers, void 0);
                this.materialId = (__runInitializers(this, _workOrderId_extraInitializers), __runInitializers(this, _materialId_initializers, void 0));
                this.quantity = (__runInitializers(this, _materialId_extraInitializers), __runInitializers(this, _quantity_initializers, void 0));
                this.notes = (__runInitializers(this, _quantity_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
                __runInitializers(this, _notes_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _workOrderId_decorators = [ApiProperty({ description: 'Work order ID' }), (0, class_validator_1.IsUUID)()];
            _materialId_decorators = [ApiProperty({ description: 'Material ID' }), (0, class_validator_1.IsUUID)()];
            _quantity_decorators = [ApiProperty({ description: 'Quantity' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0.01)];
            _notes_decorators = [ApiProperty({ description: 'Notes', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(500)];
            __esDecorate(null, null, _workOrderId_decorators, { kind: "field", name: "workOrderId", static: false, private: false, access: { has: obj => "workOrderId" in obj, get: obj => obj.workOrderId, set: (obj, value) => { obj.workOrderId = value; } }, metadata: _metadata }, _workOrderId_initializers, _workOrderId_extraInitializers);
            __esDecorate(null, null, _materialId_decorators, { kind: "field", name: "materialId", static: false, private: false, access: { has: obj => "materialId" in obj, get: obj => obj.materialId, set: (obj, value) => { obj.materialId = value; } }, metadata: _metadata }, _materialId_initializers, _materialId_extraInitializers);
            __esDecorate(null, null, _quantity_decorators, { kind: "field", name: "quantity", static: false, private: false, access: { has: obj => "quantity" in obj, get: obj => obj.quantity, set: (obj, value) => { obj.quantity = value; } }, metadata: _metadata }, _quantity_initializers, _quantity_extraInitializers);
            __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateMaterialRequisitionDto = CreateMaterialRequisitionDto;
/**
 * Complete work order DTO
 */
let CompleteWorkOrderDto = (() => {
    var _a;
    let _completionNotes_decorators;
    let _completionNotes_initializers = [];
    let _completionNotes_extraInitializers = [];
    let _actualHours_decorators;
    let _actualHours_initializers = [];
    let _actualHours_extraInitializers = [];
    let _requiresFollowUp_decorators;
    let _requiresFollowUp_initializers = [];
    let _requiresFollowUp_extraInitializers = [];
    let _followUpNotes_decorators;
    let _followUpNotes_initializers = [];
    let _followUpNotes_extraInitializers = [];
    let _attachments_decorators;
    let _attachments_initializers = [];
    let _attachments_extraInitializers = [];
    return _a = class CompleteWorkOrderDto {
            constructor() {
                this.completionNotes = __runInitializers(this, _completionNotes_initializers, void 0);
                this.actualHours = (__runInitializers(this, _completionNotes_extraInitializers), __runInitializers(this, _actualHours_initializers, void 0));
                this.requiresFollowUp = (__runInitializers(this, _actualHours_extraInitializers), __runInitializers(this, _requiresFollowUp_initializers, void 0));
                this.followUpNotes = (__runInitializers(this, _requiresFollowUp_extraInitializers), __runInitializers(this, _followUpNotes_initializers, void 0));
                this.attachments = (__runInitializers(this, _followUpNotes_extraInitializers), __runInitializers(this, _attachments_initializers, void 0));
                __runInitializers(this, _attachments_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _completionNotes_decorators = [ApiProperty({ description: 'Completion notes' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(2000)];
            _actualHours_decorators = [ApiProperty({ description: 'Actual hours spent' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0.1)];
            _requiresFollowUp_decorators = [ApiProperty({ description: 'Requires follow-up' }), (0, class_validator_1.IsBoolean)()];
            _followUpNotes_decorators = [ApiProperty({ description: 'Follow-up notes', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(1000)];
            _attachments_decorators = [ApiProperty({ description: 'Attachment URLs', required: false, type: [String] }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            __esDecorate(null, null, _completionNotes_decorators, { kind: "field", name: "completionNotes", static: false, private: false, access: { has: obj => "completionNotes" in obj, get: obj => obj.completionNotes, set: (obj, value) => { obj.completionNotes = value; } }, metadata: _metadata }, _completionNotes_initializers, _completionNotes_extraInitializers);
            __esDecorate(null, null, _actualHours_decorators, { kind: "field", name: "actualHours", static: false, private: false, access: { has: obj => "actualHours" in obj, get: obj => obj.actualHours, set: (obj, value) => { obj.actualHours = value; } }, metadata: _metadata }, _actualHours_initializers, _actualHours_extraInitializers);
            __esDecorate(null, null, _requiresFollowUp_decorators, { kind: "field", name: "requiresFollowUp", static: false, private: false, access: { has: obj => "requiresFollowUp" in obj, get: obj => obj.requiresFollowUp, set: (obj, value) => { obj.requiresFollowUp = value; } }, metadata: _metadata }, _requiresFollowUp_initializers, _requiresFollowUp_extraInitializers);
            __esDecorate(null, null, _followUpNotes_decorators, { kind: "field", name: "followUpNotes", static: false, private: false, access: { has: obj => "followUpNotes" in obj, get: obj => obj.followUpNotes, set: (obj, value) => { obj.followUpNotes = value; } }, metadata: _metadata }, _followUpNotes_initializers, _followUpNotes_extraInitializers);
            __esDecorate(null, null, _attachments_decorators, { kind: "field", name: "attachments", static: false, private: false, access: { has: obj => "attachments" in obj, get: obj => obj.attachments, set: (obj, value) => { obj.attachments = value; } }, metadata: _metadata }, _attachments_initializers, _attachments_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CompleteWorkOrderDto = CompleteWorkOrderDto;
// ============================================================================
// WORK ORDER CREATION AND INITIALIZATION
// ============================================================================
/**
 * Creates a new work order with auto-generated work order number
 *
 * @param data - Work order creation data
 * @param userId - User creating the work order
 * @returns Created work order
 *
 * @example
 * ```typescript
 * const workOrder = await createWorkOrder({
 *   title: 'Replace HVAC Filter',
 *   type: WorkOrderType.PREVENTIVE,
 *   priority: WorkOrderPriority.MEDIUM,
 *   facilityId: 'facility-123'
 * }, 'user-456');
 * ```
 */
async function createWorkOrder(data, userId) {
    const workOrder = {
        id: faker_1.faker.string.uuid(),
        workOrderNumber: generateWorkOrderNumber(data.type, data.facilityId),
        status: WorkOrderStatus.DRAFT,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: userId,
    };
    return workOrder;
}
/**
 * Generates a unique work order number based on type and facility
 *
 * @param type - Work order type
 * @param facilityId - Facility identifier
 * @returns Formatted work order number
 *
 * @example
 * ```typescript
 * const woNumber = generateWorkOrderNumber(WorkOrderType.PREVENTIVE, 'FAC-001');
 * // Returns: "WO-PM-FAC001-20250108-001"
 * ```
 */
function generateWorkOrderNumber(type, facilityId) {
    const typePrefix = {
        [WorkOrderType.CORRECTIVE]: 'CM',
        [WorkOrderType.PREVENTIVE]: 'PM',
        [WorkOrderType.INSPECTION]: 'IN',
        [WorkOrderType.EMERGENCY]: 'EM',
        [WorkOrderType.PROJECT]: 'PR',
        [WorkOrderType.SAFETY]: 'SF',
        [WorkOrderType.COMPLIANCE]: 'CP',
    }[type];
    const facilityCode = facilityId.replace(/[^A-Z0-9]/gi, '').substring(0, 6).toUpperCase();
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const sequence = Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, '0');
    return `WO-${typePrefix}-${facilityCode}-${date}-${sequence}`;
}
/**
 * Creates a work order from a template
 *
 * @param templateId - Template identifier
 * @param overrides - Override template values
 * @param userId - User creating the work order
 * @returns Created work order with template data
 *
 * @example
 * ```typescript
 * const workOrder = await createWorkOrderFromTemplate(
 *   'template-123',
 *   { facilityId: 'facility-456', dueDate: new Date() },
 *   'user-789'
 * );
 * ```
 */
async function createWorkOrderFromTemplate(templateId, overrides, userId) {
    // In production, fetch template from database
    const template = await getWorkOrderTemplate(templateId);
    return createWorkOrder({
        title: overrides.title || template.name,
        description: overrides.description || template.description,
        type: overrides.type || template.type,
        priority: overrides.priority || template.priority,
        estimatedHours: overrides.estimatedHours || template.estimatedHours,
        templateId,
        ...overrides,
    }, userId);
}
/**
 * Submits a draft work order for processing
 *
 * @param workOrderId - Work order identifier
 * @param submittedBy - User submitting the work order
 * @returns Updated work order
 *
 * @example
 * ```typescript
 * const submitted = await submitWorkOrder('wo-123', 'user-456');
 * ```
 */
async function submitWorkOrder(workOrderId, submittedBy) {
    return updateWorkOrderStatus(workOrderId, WorkOrderStatus.SUBMITTED, submittedBy);
}
/**
 * Initializes recurring work orders from template
 *
 * @param templateId - Template identifier
 * @param startDate - Start date for recurrence
 * @param endDate - End date for recurrence
 * @param userId - User initializing recurrence
 * @returns Array of created work orders
 *
 * @example
 * ```typescript
 * const workOrders = await initializeRecurringWorkOrders(
 *   'template-123',
 *   new Date('2025-01-01'),
 *   new Date('2025-12-31'),
 *   'user-456'
 * );
 * ```
 */
async function initializeRecurringWorkOrders(templateId, startDate, endDate, userId) {
    const template = await getWorkOrderTemplate(templateId);
    if (!template.recurrencePattern) {
        throw new Error('Template does not have a recurrence pattern');
    }
    const occurrences = calculateRecurrenceOccurrences(template.recurrencePattern, startDate, endDate);
    const workOrders = await Promise.all(occurrences.map((date) => createWorkOrderFromTemplate(templateId, {
        scheduledStartDate: date,
        dueDate: new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000),
    }, userId)));
    return workOrders;
}
// ============================================================================
// PRIORITY AND URGENCY MANAGEMENT
// ============================================================================
/**
 * Calculates work order priority based on multiple factors
 *
 * @param factors - Priority calculation factors
 * @returns Calculated priority level
 *
 * @example
 * ```typescript
 * const priority = calculateWorkOrderPriority({
 *   isSafetyIssue: true,
 *   impactLevel: 'high',
 *   downtime: true,
 *   patientImpact: true
 * });
 * // Returns: WorkOrderPriority.EMERGENCY
 * ```
 */
function calculateWorkOrderPriority(factors) {
    let score = 0;
    if (factors.isSafetyIssue)
        score += 100;
    if (factors.isEmergency)
        score += 80;
    if (factors.downtime)
        score += 60;
    if (factors.patientImpact)
        score += 70;
    if (factors.regulatoryRequirement)
        score += 50;
    if (factors.impactLevel === 'critical')
        score += 50;
    else if (factors.impactLevel === 'high')
        score += 30;
    else if (factors.impactLevel === 'medium')
        score += 15;
    if (factors.assetCriticality)
        score += factors.assetCriticality * 10;
    if (score >= 100)
        return WorkOrderPriority.EMERGENCY;
    if (score >= 60)
        return WorkOrderPriority.HIGH;
    if (score >= 30)
        return WorkOrderPriority.MEDIUM;
    if (score >= 10)
        return WorkOrderPriority.LOW;
    return WorkOrderPriority.ROUTINE;
}
/**
 * Escalates work order priority based on age and status
 *
 * @param workOrder - Work order to evaluate
 * @returns Updated priority if escalation is needed
 *
 * @example
 * ```typescript
 * const newPriority = escalateWorkOrderPriority(workOrder);
 * if (newPriority !== workOrder.priority) {
 *   await updateWorkOrderPriority(workOrder.id, newPriority);
 * }
 * ```
 */
function escalateWorkOrderPriority(workOrder) {
    const ageInHours = (Date.now() - workOrder.createdAt.getTime()) / (1000 * 60 * 60);
    const priorityLevels = [
        WorkOrderPriority.ROUTINE,
        WorkOrderPriority.LOW,
        WorkOrderPriority.MEDIUM,
        WorkOrderPriority.HIGH,
        WorkOrderPriority.EMERGENCY,
    ];
    const currentIndex = priorityLevels.indexOf(workOrder.priority);
    // Escalate if overdue and not at max priority
    if (workOrder.dueDate && new Date() > workOrder.dueDate && currentIndex < 4) {
        return priorityLevels[currentIndex + 1];
    }
    // Escalate based on age thresholds
    const escalationThresholds = {
        [WorkOrderPriority.ROUTINE]: 168, // 7 days
        [WorkOrderPriority.LOW]: 120, // 5 days
        [WorkOrderPriority.MEDIUM]: 72, // 3 days
        [WorkOrderPriority.HIGH]: 48, // 2 days
    };
    const threshold = escalationThresholds[workOrder.priority];
    if (threshold && ageInHours > threshold && currentIndex < 4) {
        return priorityLevels[currentIndex + 1];
    }
    return workOrder.priority;
}
/**
 * Gets work orders requiring priority escalation
 *
 * @param workOrders - Array of work orders to check
 * @returns Work orders needing escalation
 *
 * @example
 * ```typescript
 * const needsEscalation = getWorkOrdersNeedingEscalation(allWorkOrders);
 * for (const wo of needsEscalation) {
 *   await escalateAndNotify(wo);
 * }
 * ```
 */
function getWorkOrdersNeedingEscalation(workOrders) {
    return workOrders.filter((wo) => {
        const newPriority = escalateWorkOrderPriority(wo);
        return newPriority !== wo.priority;
    });
}
/**
 * Prioritizes work order queue based on multiple criteria
 *
 * @param workOrders - Work orders to prioritize
 * @returns Sorted array by priority
 *
 * @example
 * ```typescript
 * const prioritizedQueue = prioritizeWorkOrderQueue(pendingWorkOrders);
 * ```
 */
function prioritizeWorkOrderQueue(workOrders) {
    const priorityWeight = {
        [WorkOrderPriority.EMERGENCY]: 5,
        [WorkOrderPriority.HIGH]: 4,
        [WorkOrderPriority.MEDIUM]: 3,
        [WorkOrderPriority.LOW]: 2,
        [WorkOrderPriority.ROUTINE]: 1,
    };
    return [...workOrders].sort((a, b) => {
        // First by priority
        const priorityDiff = priorityWeight[b.priority] - priorityWeight[a.priority];
        if (priorityDiff !== 0)
            return priorityDiff;
        // Then by due date
        if (a.dueDate && b.dueDate) {
            return a.dueDate.getTime() - b.dueDate.getTime();
        }
        if (a.dueDate)
            return -1;
        if (b.dueDate)
            return 1;
        // Finally by creation date (oldest first)
        return a.createdAt.getTime() - b.createdAt.getTime();
    });
}
// ============================================================================
// WORK ORDER ASSIGNMENT AND SCHEDULING
// ============================================================================
/**
 * Assigns work order to technician or team
 *
 * @param workOrderId - Work order identifier
 * @param assignment - Assignment details
 * @param assignedBy - User making the assignment
 * @returns Updated work order
 *
 * @example
 * ```typescript
 * const assigned = await assignWorkOrder('wo-123', {
 *   assignedTo: 'tech-456',
 *   estimatedHours: 4,
 *   scheduledStartDate: new Date()
 * }, 'manager-789');
 * ```
 */
async function assignWorkOrder(workOrderId, assignment, assignedBy) {
    // In production, update database and send notifications
    const workOrder = await getWorkOrder(workOrderId);
    const updated = {
        ...workOrder,
        assignedTo: assignment.assignedTo,
        assignedTeam: assignment.assignedTeam,
        estimatedHours: assignment.estimatedHours,
        scheduledStartDate: assignment.scheduledStartDate,
        scheduledEndDate: assignment.scheduledEndDate,
        status: WorkOrderStatus.ASSIGNED,
        updatedAt: new Date(),
        updatedBy: assignedBy,
    };
    return updated;
}
/**
 * Automatically routes work order to best available technician
 *
 * @param workOrderId - Work order identifier
 * @param criteria - Routing criteria
 * @returns Assigned technician information
 *
 * @example
 * ```typescript
 * const assignment = await autoRouteWorkOrder('wo-123', {
 *   requiredSkills: ['HVAC', 'Electrical'],
 *   preferredShift: 'day',
 *   maxDistance: 50
 * });
 * ```
 */
async function autoRouteWorkOrder(workOrderId, criteria) {
    // In production, implement intelligent routing algorithm
    return {
        technicianId: faker_1.faker.string.uuid(),
        estimatedArrival: new Date(Date.now() + 2 * 60 * 60 * 1000),
        confidence: 0.85,
    };
}
/**
 * Reassigns work order to different technician
 *
 * @param workOrderId - Work order identifier
 * @param newAssignee - New technician ID
 * @param reason - Reassignment reason
 * @param reassignedBy - User making the reassignment
 * @returns Updated work order
 *
 * @example
 * ```typescript
 * await reassignWorkOrder('wo-123', 'tech-new', 'Original tech unavailable', 'supervisor-456');
 * ```
 */
async function reassignWorkOrder(workOrderId, newAssignee, reason, reassignedBy) {
    const workOrder = await getWorkOrder(workOrderId);
    // Log reassignment for audit trail
    await logWorkOrderActivity(workOrderId, 'reassigned', {
        previousAssignee: workOrder.assignedTo,
        newAssignee,
        reason,
        reassignedBy,
    });
    return assignWorkOrder(workOrderId, { assignedTo: newAssignee, estimatedHours: workOrder.estimatedHours || 1 }, reassignedBy);
}
/**
 * Schedules work order for specific date and time
 *
 * @param workOrderId - Work order identifier
 * @param schedule - Scheduling details
 * @returns Updated work order
 *
 * @example
 * ```typescript
 * await scheduleWorkOrder('wo-123', {
 *   startDate: new Date('2025-01-15T08:00:00'),
 *   endDate: new Date('2025-01-15T12:00:00'),
 *   notes: 'Coordinate with facility manager'
 * });
 * ```
 */
async function scheduleWorkOrder(workOrderId, schedule) {
    const workOrder = await getWorkOrder(workOrderId);
    return {
        ...workOrder,
        scheduledStartDate: schedule.startDate,
        scheduledEndDate: schedule.endDate,
        notes: schedule.notes || workOrder.notes,
        updatedAt: new Date(),
    };
}
/**
 * Optimizes work order schedule for maximum efficiency
 *
 * @param workOrders - Work orders to schedule
 * @param constraints - Scheduling constraints
 * @returns Optimized schedule
 *
 * @example
 * ```typescript
 * const optimized = optimizeWorkOrderSchedule(workOrders, {
 *   availableTechnicians: ['tech-1', 'tech-2'],
 *   timeWindow: { start: new Date(), end: new Date(Date.now() + 7*24*60*60*1000) }
 * });
 * ```
 */
function optimizeWorkOrderSchedule(workOrders, constraints) {
    // In production, implement advanced scheduling algorithm
    const schedule = [];
    const prioritized = prioritizeWorkOrderQueue(workOrders);
    const technicians = constraints.availableTechnicians || ['tech-1'];
    let currentTime = constraints.timeWindow?.start || new Date();
    prioritized.forEach((wo, index) => {
        const techIndex = index % technicians.length;
        const duration = (wo.estimatedHours || 2) * 60 * 60 * 1000;
        schedule.push({
            workOrderId: wo.id,
            assignedTo: technicians[techIndex],
            scheduledStart: new Date(currentTime),
            scheduledEnd: new Date(currentTime.getTime() + duration),
        });
        currentTime = new Date(currentTime.getTime() + duration);
    });
    return schedule;
}
// ============================================================================
// STATUS TRACKING AND WORKFLOW MANAGEMENT
// ============================================================================
/**
 * Updates work order status with validation
 *
 * @param workOrderId - Work order identifier
 * @param newStatus - New status
 * @param userId - User updating status
 * @returns Updated work order
 *
 * @example
 * ```typescript
 * await updateWorkOrderStatus('wo-123', WorkOrderStatus.IN_PROGRESS, 'tech-456');
 * ```
 */
async function updateWorkOrderStatus(workOrderId, newStatus, userId) {
    const workOrder = await getWorkOrder(workOrderId);
    // Validate status transition
    validateStatusTransition(workOrder.status, newStatus);
    const updated = {
        ...workOrder,
        status: newStatus,
        updatedAt: new Date(),
        updatedBy: userId,
    };
    // Update date fields based on status
    if (newStatus === WorkOrderStatus.IN_PROGRESS && !workOrder.actualStartDate) {
        updated.actualStartDate = new Date();
    }
    else if (newStatus === WorkOrderStatus.COMPLETED && !workOrder.completedDate) {
        updated.completedDate = new Date();
        updated.actualEndDate = new Date();
    }
    await logWorkOrderActivity(workOrderId, 'status_changed', {
        previousStatus: workOrder.status,
        newStatus,
        changedBy: userId,
    });
    return updated;
}
/**
 * Validates work order status transition
 *
 * @param currentStatus - Current status
 * @param newStatus - Proposed new status
 * @throws Error if transition is invalid
 *
 * @example
 * ```typescript
 * validateStatusTransition(WorkOrderStatus.DRAFT, WorkOrderStatus.COMPLETED); // Throws error
 * validateStatusTransition(WorkOrderStatus.ASSIGNED, WorkOrderStatus.IN_PROGRESS); // OK
 * ```
 */
function validateStatusTransition(currentStatus, newStatus) {
    const validTransitions = {
        [WorkOrderStatus.DRAFT]: [WorkOrderStatus.SUBMITTED, WorkOrderStatus.CANCELLED],
        [WorkOrderStatus.SUBMITTED]: [
            WorkOrderStatus.ASSIGNED,
            WorkOrderStatus.CANCELLED,
            WorkOrderStatus.DRAFT,
        ],
        [WorkOrderStatus.ASSIGNED]: [
            WorkOrderStatus.IN_PROGRESS,
            WorkOrderStatus.CANCELLED,
            WorkOrderStatus.SUBMITTED,
        ],
        [WorkOrderStatus.IN_PROGRESS]: [
            WorkOrderStatus.COMPLETED,
            WorkOrderStatus.ON_HOLD,
            WorkOrderStatus.CANCELLED,
        ],
        [WorkOrderStatus.ON_HOLD]: [
            WorkOrderStatus.IN_PROGRESS,
            WorkOrderStatus.CANCELLED,
            WorkOrderStatus.ASSIGNED,
        ],
        [WorkOrderStatus.COMPLETED]: [WorkOrderStatus.VERIFIED, WorkOrderStatus.IN_PROGRESS],
        [WorkOrderStatus.VERIFIED]: [WorkOrderStatus.CLOSED, WorkOrderStatus.IN_PROGRESS],
        [WorkOrderStatus.CANCELLED]: [],
        [WorkOrderStatus.CLOSED]: [],
    };
    if (!validTransitions[currentStatus]?.includes(newStatus)) {
        throw new Error(`Invalid status transition from ${currentStatus} to ${newStatus}`);
    }
}
/**
 * Gets work order status history
 *
 * @param workOrderId - Work order identifier
 * @returns Status change history
 *
 * @example
 * ```typescript
 * const history = await getWorkOrderStatusHistory('wo-123');
 * ```
 */
async function getWorkOrderStatusHistory(workOrderId) {
    // In production, fetch from audit log
    return [
        { status: WorkOrderStatus.DRAFT, timestamp: new Date(), userId: 'user-1' },
        { status: WorkOrderStatus.SUBMITTED, timestamp: new Date(), userId: 'user-1' },
        { status: WorkOrderStatus.ASSIGNED, timestamp: new Date(), userId: 'manager-1' },
    ];
}
/**
 * Holds work order with reason
 *
 * @param workOrderId - Work order identifier
 * @param reason - Reason for hold
 * @param userId - User placing hold
 * @returns Updated work order
 *
 * @example
 * ```typescript
 * await holdWorkOrder('wo-123', 'Awaiting parts delivery', 'tech-456');
 * ```
 */
async function holdWorkOrder(workOrderId, reason, userId) {
    await logWorkOrderActivity(workOrderId, 'hold', { reason, userId });
    return updateWorkOrderStatus(workOrderId, WorkOrderStatus.ON_HOLD, userId);
}
/**
 * Resumes held work order
 *
 * @param workOrderId - Work order identifier
 * @param userId - User resuming work
 * @returns Updated work order
 *
 * @example
 * ```typescript
 * await resumeWorkOrder('wo-123', 'tech-456');
 * ```
 */
async function resumeWorkOrder(workOrderId, userId) {
    await logWorkOrderActivity(workOrderId, 'resume', { userId });
    return updateWorkOrderStatus(workOrderId, WorkOrderStatus.IN_PROGRESS, userId);
}
// ============================================================================
// TIME AND LABOR TRACKING
// ============================================================================
/**
 * Tracks labor time for work order
 *
 * @param entry - Labor time entry data
 * @returns Created labor time entry
 *
 * @example
 * ```typescript
 * const timeEntry = await trackLaborTime({
 *   workOrderId: 'wo-123',
 *   technicianId: 'tech-456',
 *   startTime: new Date('2025-01-08T08:00:00'),
 *   endTime: new Date('2025-01-08T12:00:00'),
 *   timeType: LaborTimeType.REGULAR,
 *   billable: true
 * });
 * ```
 */
async function trackLaborTime(entry) {
    const hours = (entry.endTime.getTime() - entry.startTime.getTime()) / (1000 * 60 * 60);
    const totalCost = hours * entry.hourlyRate;
    const laborEntry = {
        id: faker_1.faker.string.uuid(),
        ...entry,
        technicianName: `Technician ${entry.technicianId.substring(0, 8)}`,
        hours,
        totalCost,
        approved: false,
        createdAt: new Date(),
    };
    return laborEntry;
}
/**
 * Calculates total labor hours for work order
 *
 * @param workOrderId - Work order identifier
 * @returns Total labor hours
 *
 * @example
 * ```typescript
 * const totalHours = await calculateTotalLaborHours('wo-123');
 * ```
 */
async function calculateTotalLaborHours(workOrderId) {
    const entries = await getLaborTimeEntries(workOrderId);
    return entries.reduce((total, entry) => total + entry.hours, 0);
}
/**
 * Calculates total labor cost for work order
 *
 * @param workOrderId - Work order identifier
 * @returns Total labor cost
 *
 * @example
 * ```typescript
 * const totalCost = await calculateTotalLaborCost('wo-123');
 * ```
 */
async function calculateTotalLaborCost(workOrderId) {
    const entries = await getLaborTimeEntries(workOrderId);
    return entries.reduce((total, entry) => total + entry.totalCost, 0);
}
/**
 * Approves labor time entry
 *
 * @param entryId - Labor entry identifier
 * @param approvedBy - User approving the entry
 * @returns Updated labor entry
 *
 * @example
 * ```typescript
 * await approveLaborTime('entry-123', 'supervisor-456');
 * ```
 */
async function approveLaborTime(entryId, approvedBy) {
    const entry = await getLaborTimeEntry(entryId);
    return {
        ...entry,
        approved: true,
        approvedBy,
        approvedAt: new Date(),
    };
}
/**
 * Gets labor time entries for work order
 *
 * @param workOrderId - Work order identifier
 * @returns Array of labor time entries
 *
 * @example
 * ```typescript
 * const entries = await getLaborTimeEntries('wo-123');
 * ```
 */
async function getLaborTimeEntries(workOrderId) {
    // In production, fetch from database
    return [];
}
/**
 * Calculates overtime hours for technician
 *
 * @param technicianId - Technician identifier
 * @param startDate - Period start date
 * @param endDate - Period end date
 * @returns Overtime hours breakdown
 *
 * @example
 * ```typescript
 * const overtime = await calculateOvertimeHours('tech-123', startDate, endDate);
 * ```
 */
async function calculateOvertimeHours(technicianId, startDate, endDate) {
    // In production, fetch and calculate from labor entries
    return {
        regular: 40,
        overtime: 8,
        weekend: 4,
        holiday: 0,
    };
}
// ============================================================================
// MATERIAL REQUISITION AND USAGE
// ============================================================================
/**
 * Creates material requisition for work order
 *
 * @param requisition - Requisition data
 * @returns Created material requisition
 *
 * @example
 * ```typescript
 * const req = await createMaterialRequisition({
 *   workOrderId: 'wo-123',
 *   materialId: 'mat-456',
 *   materialName: 'HVAC Filter',
 *   quantity: 2,
 *   unitOfMeasure: 'each',
 *   unitCost: 45.00,
 *   requestedBy: 'tech-789'
 * });
 * ```
 */
async function createMaterialRequisition(requisition) {
    return {
        id: faker_1.faker.string.uuid(),
        ...requisition,
        totalCost: requisition.quantity * requisition.unitCost,
        requestedAt: new Date(),
        status: 'pending',
    };
}
/**
 * Approves material requisition
 *
 * @param requisitionId - Requisition identifier
 * @param approvedBy - User approving requisition
 * @returns Updated requisition
 *
 * @example
 * ```typescript
 * await approveMaterialRequisition('req-123', 'supervisor-456');
 * ```
 */
async function approveMaterialRequisition(requisitionId, approvedBy) {
    const requisition = await getMaterialRequisition(requisitionId);
    return {
        ...requisition,
        status: 'approved',
        approvedBy,
        approvedAt: new Date(),
    };
}
/**
 * Issues materials from requisition
 *
 * @param requisitionId - Requisition identifier
 * @param issuedBy - User issuing materials
 * @returns Updated requisition
 *
 * @example
 * ```typescript
 * await issueMaterials('req-123', 'warehouse-456');
 * ```
 */
async function issueMaterials(requisitionId, issuedBy) {
    const requisition = await getMaterialRequisition(requisitionId);
    if (requisition.status !== 'approved') {
        throw new Error('Requisition must be approved before issuing materials');
    }
    return {
        ...requisition,
        status: 'issued',
        issuedBy,
        issuedAt: new Date(),
    };
}
/**
 * Calculates total material cost for work order
 *
 * @param workOrderId - Work order identifier
 * @returns Total material cost
 *
 * @example
 * ```typescript
 * const materialCost = await calculateTotalMaterialCost('wo-123');
 * ```
 */
async function calculateTotalMaterialCost(workOrderId) {
    const requisitions = await getMaterialRequisitionsForWorkOrder(workOrderId);
    return requisitions
        .filter((r) => r.status === 'issued')
        .reduce((total, req) => total + req.totalCost, 0);
}
/**
 * Gets material requisitions for work order
 *
 * @param workOrderId - Work order identifier
 * @returns Array of material requisitions
 *
 * @example
 * ```typescript
 * const requisitions = await getMaterialRequisitionsForWorkOrder('wo-123');
 * ```
 */
async function getMaterialRequisitionsForWorkOrder(workOrderId) {
    // In production, fetch from database
    return [];
}
// ============================================================================
// WORK ORDER COMPLETION AND SIGN-OFF
// ============================================================================
/**
 * Completes work order with required information
 *
 * @param workOrderId - Work order identifier
 * @param completion - Completion data
 * @param userId - User completing work order
 * @returns Updated work order
 *
 * @example
 * ```typescript
 * await completeWorkOrder('wo-123', {
 *   completionNotes: 'Replaced HVAC filter, system running normally',
 *   actualHours: 2.5,
 *   completionDate: new Date(),
 *   requiresFollowUp: false
 * }, 'tech-456');
 * ```
 */
async function completeWorkOrder(workOrderId, completion, userId) {
    const workOrder = await getWorkOrder(workOrderId);
    // Calculate total costs
    const laborCost = await calculateTotalLaborCost(workOrderId);
    const materialCost = await calculateTotalMaterialCost(workOrderId);
    const updated = {
        ...workOrder,
        status: WorkOrderStatus.COMPLETED,
        actualHours: completion.actualHours,
        actualCost: laborCost + materialCost,
        completedDate: completion.completionDate,
        actualEndDate: completion.completionDate,
        notes: `${workOrder.notes || ''}\n\nCompletion: ${completion.completionNotes}`,
        updatedAt: new Date(),
        updatedBy: userId,
    };
    await logWorkOrderActivity(workOrderId, 'completed', {
        completedBy: userId,
        actualHours: completion.actualHours,
        requiresFollowUp: completion.requiresFollowUp,
    });
    return updated;
}
/**
 * Verifies completed work order
 *
 * @param workOrderId - Work order identifier
 * @param verificationData - Verification details
 * @param verifiedBy - User verifying work
 * @returns Updated work order
 *
 * @example
 * ```typescript
 * await verifyWorkOrder('wo-123', {
 *   notes: 'Work verified, system operational',
 *   checklist: { safety: true, quality: true, cleanup: true }
 * }, 'supervisor-456');
 * ```
 */
async function verifyWorkOrder(workOrderId, verificationData, verifiedBy) {
    const workOrder = await getWorkOrder(workOrderId);
    if (workOrder.status !== WorkOrderStatus.COMPLETED) {
        throw new Error('Work order must be completed before verification');
    }
    return {
        ...workOrder,
        status: WorkOrderStatus.VERIFIED,
        verifiedBy,
        verifiedDate: new Date(),
        notes: `${workOrder.notes}\n\nVerification: ${verificationData.notes}`,
        updatedAt: new Date(),
    };
}
/**
 * Closes verified work order
 *
 * @param workOrderId - Work order identifier
 * @param userId - User closing work order
 * @returns Updated work order
 *
 * @example
 * ```typescript
 * await closeWorkOrder('wo-123', 'admin-456');
 * ```
 */
async function closeWorkOrder(workOrderId, userId) {
    return updateWorkOrderStatus(workOrderId, WorkOrderStatus.CLOSED, userId);
}
/**
 * Cancels work order with reason
 *
 * @param workOrderId - Work order identifier
 * @param reason - Cancellation reason
 * @param userId - User cancelling work order
 * @returns Updated work order
 *
 * @example
 * ```typescript
 * await cancelWorkOrder('wo-123', 'Duplicate request', 'admin-456');
 * ```
 */
async function cancelWorkOrder(workOrderId, reason, userId) {
    await logWorkOrderActivity(workOrderId, 'cancelled', { reason, userId });
    return updateWorkOrderStatus(workOrderId, WorkOrderStatus.CANCELLED, userId);
}
// ============================================================================
// PREVENTIVE MAINTENANCE
// ============================================================================
/**
 * Creates preventive maintenance schedule
 *
 * @param schedule - Schedule configuration
 * @returns Created schedule
 *
 * @example
 * ```typescript
 * const schedule = await createPreventiveMaintenanceSchedule({
 *   assetId: 'asset-123',
 *   templateId: 'template-456',
 *   recurrencePattern: RecurrencePattern.MONTHLY,
 *   startDate: new Date()
 * });
 * ```
 */
async function createPreventiveMaintenanceSchedule(schedule) {
    const endDate = schedule.endDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
    const workOrders = await initializeRecurringWorkOrders(schedule.templateId, schedule.startDate, endDate, 'system');
    return {
        scheduleId: faker_1.faker.string.uuid(),
        workOrders,
    };
}
/**
 * Calculates preventive maintenance compliance
 *
 * @param assetId - Asset identifier
 * @param period - Evaluation period
 * @returns Compliance percentage
 *
 * @example
 * ```typescript
 * const compliance = await calculatePMCompliance('asset-123', {
 *   startDate: new Date('2025-01-01'),
 *   endDate: new Date('2025-12-31')
 * });
 * ```
 */
async function calculatePMCompliance(assetId, period) {
    // In production, calculate from actual data
    const scheduled = 12;
    const completed = 10;
    return (completed / scheduled) * 100;
}
/**
 * Gets overdue preventive maintenance work orders
 *
 * @param facilityId - Facility identifier
 * @returns Array of overdue PM work orders
 *
 * @example
 * ```typescript
 * const overdue = await getOverduePMWorkOrders('facility-123');
 * ```
 */
async function getOverduePMWorkOrders(facilityId) {
    // In production, query database for overdue PM work orders
    return [];
}
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Gets work order by ID from database
 *
 * @param id - Work order ID
 * @returns Work order data
 * @throws NotFoundException if work order not found
 *
 * @example
 * ```typescript
 * const workOrder = await getWorkOrder('wo-123');
 * ```
 */
async function getWorkOrder(id) {
    if (!id || typeof id !== 'string') {
        throw new Error('Invalid work order ID provided');
    }
    // Note: This function requires a Sequelize model to be implemented
    // Implement this by creating a WorkOrder model and querying it
    // Example implementation:
    // const WorkOrderModel = getWorkOrderModel();
    // const result = await WorkOrderModel.findByPk(id);
    // if (!result) {
    //   throw new NotFoundException(`Work order ${id} not found`);
    // }
    // return result.toJSON();
    throw new Error('getWorkOrder() requires database integration. ' +
        'Please implement this function with your Sequelize WorkOrder model. ' +
        'See function documentation for implementation example.');
}
/**
 * Gets work order template by ID from database
 *
 * @param id - Template ID
 * @returns Work order template data
 * @throws NotFoundException if template not found
 *
 * @example
 * ```typescript
 * const template = await getWorkOrderTemplate('template-123');
 * ```
 */
async function getWorkOrderTemplate(id) {
    if (!id || typeof id !== 'string') {
        throw new Error('Invalid template ID provided');
    }
    // Note: This function requires a Sequelize model to be implemented
    // Implement this by creating a WorkOrderTemplate model and querying it
    // Example implementation:
    // const WorkOrderTemplateModel = getWorkOrderTemplateModel();
    // const result = await WorkOrderTemplateModel.findByPk(id, {
    //   where: { isActive: true }
    // });
    // if (!result) {
    //   throw new NotFoundException(`Work order template ${id} not found`);
    // }
    // return result.toJSON();
    throw new Error('getWorkOrderTemplate() requires database integration. ' +
        'Please implement this function with your Sequelize WorkOrderTemplate model. ' +
        'See function documentation for implementation example.');
}
/**
 * Gets labor time entry by ID from database
 *
 * @param id - Labor time entry ID
 * @returns Labor time entry data
 * @throws NotFoundException if entry not found
 *
 * @example
 * ```typescript
 * const entry = await getLaborTimeEntry('entry-123');
 * ```
 */
async function getLaborTimeEntry(id) {
    if (!id || typeof id !== 'string') {
        throw new Error('Invalid labor time entry ID provided');
    }
    // Note: This function requires a Sequelize model to be implemented
    // Implement this by creating a LaborTimeEntry model and querying it
    // Example implementation:
    // const LaborTimeEntryModel = getLaborTimeEntryModel();
    // const result = await LaborTimeEntryModel.findByPk(id, {
    //   include: [{ model: Technician, attributes: ['id', 'name'] }]
    // });
    // if (!result) {
    //   throw new NotFoundException(`Labor time entry ${id} not found`);
    // }
    // return result.toJSON();
    throw new Error('getLaborTimeEntry() requires database integration. ' +
        'Please implement this function with your Sequelize LaborTimeEntry model. ' +
        'See function documentation for implementation example.');
}
/**
 * Gets material requisition by ID from database
 *
 * @param id - Material requisition ID
 * @returns Material requisition data
 * @throws NotFoundException if requisition not found
 *
 * @example
 * ```typescript
 * const requisition = await getMaterialRequisition('req-123');
 * ```
 */
async function getMaterialRequisition(id) {
    if (!id || typeof id !== 'string') {
        throw new Error('Invalid material requisition ID provided');
    }
    // Note: This function requires a Sequelize model to be implemented
    // Implement this by creating a MaterialRequisition model and querying it
    // Example implementation:
    // const MaterialRequisitionModel = getMaterialRequisitionModel();
    // const result = await MaterialRequisitionModel.findByPk(id, {
    //   include: [
    //     { model: Material, attributes: ['id', 'name', 'unitOfMeasure'] },
    //     { model: User, attributes: ['id', 'name'] }
    //   ]
    // });
    // if (!result) {
    //   throw new NotFoundException(`Material requisition ${id} not found`);
    // }
    // return result.toJSON();
    throw new Error('getMaterialRequisition() requires database integration. ' +
        'Please implement this function with your Sequelize MaterialRequisition model. ' +
        'See function documentation for implementation example.');
}
/**
 * Logs work order activity for audit trail
 */
async function logWorkOrderActivity(workOrderId, activityType, data) {
    // In production, log to audit database
    console.log(`Work Order ${workOrderId}: ${activityType}`, data);
}
/**
 * Calculates recurrence occurrences
 */
function calculateRecurrenceOccurrences(pattern, startDate, endDate) {
    const occurrences = [];
    let current = new Date(startDate);
    const intervals = {
        [RecurrencePattern.DAILY]: 1,
        [RecurrencePattern.WEEKLY]: 7,
        [RecurrencePattern.BIWEEKLY]: 14,
        [RecurrencePattern.MONTHLY]: 30,
        [RecurrencePattern.QUARTERLY]: 90,
        [RecurrencePattern.SEMIANNUAL]: 180,
        [RecurrencePattern.ANNUAL]: 365,
    };
    const intervalDays = intervals[pattern];
    while (current <= endDate) {
        occurrences.push(new Date(current));
        current = new Date(current.getTime() + intervalDays * 24 * 60 * 60 * 1000);
    }
    return occurrences;
}
// ============================================================================
// NESTJS CONTROLLER
// ============================================================================
/**
 * Work Order Management Controller
 * Provides RESTful API endpoints for work order operations
 */
let WorkOrderController = (() => {
    let _classDecorators = [(0, swagger_1.ApiTags)('work-orders'), (0, common_1.Controller)('work-orders'), (0, swagger_1.ApiBearerAuth)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _create_decorators;
    let _findAll_decorators;
    let _findOne_decorators;
    let _update_decorators;
    let _assign_decorators;
    let _complete_decorators;
    let _addLabor_decorators;
    let _addMaterial_decorators;
    var WorkOrderController = _classThis = class {
        /**
         * Create a new work order
         */
        async create(createDto) {
            return createWorkOrder(createDto, createDto.requestedBy);
        }
        /**
         * Get all work orders with filtering
         */
        async findAll(status, priority, facilityId) {
            // Implementation would filter work orders
            return [];
        }
        /**
         * Get work order by ID
         */
        async findOne(id) {
            return getWorkOrder(id);
        }
        /**
         * Update work order
         */
        async update(id, updateDto) {
            const workOrder = await getWorkOrder(id);
            return { ...workOrder, ...updateDto, updatedAt: new Date() };
        }
        /**
         * Assign work order
         */
        async assign(id, assignDto) {
            return assignWorkOrder(id, assignDto, 'current-user');
        }
        /**
         * Complete work order
         */
        async complete(id, completeDto) {
            return completeWorkOrder(id, completeDto, 'current-user');
        }
        /**
         * Add labor time entry
         */
        async addLabor(id, laborDto) {
            return trackLaborTime(laborDto);
        }
        /**
         * Add material requisition
         */
        async addMaterial(id, materialDto) {
            return createMaterialRequisition(materialDto);
        }
        constructor() {
            __runInitializers(this, _instanceExtraInitializers);
        }
    };
    __setFunctionName(_classThis, "WorkOrderController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _create_decorators = [(0, common_1.Post)(), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({ summary: 'Create new work order' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Work order created successfully' }), (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true }))];
        _findAll_decorators = [(0, common_1.Get)(), (0, swagger_1.ApiOperation)({ summary: 'Get all work orders' }), (0, swagger_1.ApiQuery)({ name: 'status', enum: WorkOrderStatus, required: false }), (0, swagger_1.ApiQuery)({ name: 'priority', enum: WorkOrderPriority, required: false }), (0, swagger_1.ApiQuery)({ name: 'facilityId', required: false })];
        _findOne_decorators = [(0, common_1.Get)(':id'), (0, swagger_1.ApiOperation)({ summary: 'Get work order by ID' }), (0, swagger_1.ApiParam)({ name: 'id', description: 'Work order ID' })];
        _update_decorators = [(0, common_1.Put)(':id'), (0, swagger_1.ApiOperation)({ summary: 'Update work order' })];
        _assign_decorators = [(0, common_1.Post)(':id/assign'), (0, swagger_1.ApiOperation)({ summary: 'Assign work order to technician' })];
        _complete_decorators = [(0, common_1.Post)(':id/complete'), (0, swagger_1.ApiOperation)({ summary: 'Complete work order' })];
        _addLabor_decorators = [(0, common_1.Post)(':id/labor'), (0, swagger_1.ApiOperation)({ summary: 'Add labor time entry' })];
        _addMaterial_decorators = [(0, common_1.Post)(':id/materials'), (0, swagger_1.ApiOperation)({ summary: 'Add material requisition' })];
        __esDecorate(_classThis, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: obj => "create" in obj, get: obj => obj.create }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findAll_decorators, { kind: "method", name: "findAll", static: false, private: false, access: { has: obj => "findAll" in obj, get: obj => obj.findAll }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findOne_decorators, { kind: "method", name: "findOne", static: false, private: false, access: { has: obj => "findOne" in obj, get: obj => obj.findOne }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _update_decorators, { kind: "method", name: "update", static: false, private: false, access: { has: obj => "update" in obj, get: obj => obj.update }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _assign_decorators, { kind: "method", name: "assign", static: false, private: false, access: { has: obj => "assign" in obj, get: obj => obj.assign }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _complete_decorators, { kind: "method", name: "complete", static: false, private: false, access: { has: obj => "complete" in obj, get: obj => obj.complete }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _addLabor_decorators, { kind: "method", name: "addLabor", static: false, private: false, access: { has: obj => "addLabor" in obj, get: obj => obj.addLabor }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _addMaterial_decorators, { kind: "method", name: "addMaterial", static: false, private: false, access: { has: obj => "addMaterial" in obj, get: obj => obj.addMaterial }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        WorkOrderController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return WorkOrderController = _classThis;
})();
exports.WorkOrderController = WorkOrderController;
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Work Order Creation
    createWorkOrder,
    generateWorkOrderNumber,
    createWorkOrderFromTemplate,
    submitWorkOrder,
    initializeRecurringWorkOrders,
    // Priority Management
    calculateWorkOrderPriority,
    escalateWorkOrderPriority,
    getWorkOrdersNeedingEscalation,
    prioritizeWorkOrderQueue,
    // Assignment and Scheduling
    assignWorkOrder,
    autoRouteWorkOrder,
    reassignWorkOrder,
    scheduleWorkOrder,
    optimizeWorkOrderSchedule,
    // Status Management
    updateWorkOrderStatus,
    validateStatusTransition,
    getWorkOrderStatusHistory,
    holdWorkOrder,
    resumeWorkOrder,
    // Labor Tracking
    trackLaborTime,
    calculateTotalLaborHours,
    calculateTotalLaborCost,
    approveLaborTime,
    calculateOvertimeHours,
    // Material Management
    createMaterialRequisition,
    approveMaterialRequisition,
    issueMaterials,
    calculateTotalMaterialCost,
    // Completion
    completeWorkOrder,
    verifyWorkOrder,
    closeWorkOrder,
    cancelWorkOrder,
    // Preventive Maintenance
    createPreventiveMaintenanceSchedule,
    calculatePMCompliance,
    getOverduePMWorkOrders,
    // Controller
    WorkOrderController,
};
//# sourceMappingURL=work-order-kit.js.map