"use strict";
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
exports.EquipmentMaintenanceRecord = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const swagger_1 = require("@nestjs/swagger");
const equipment_types_1 = require("../types/equipment.types");
const construction_equipment_model_1 = require("./construction-equipment.model");
let EquipmentMaintenanceRecord = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'equipment_maintenance_records',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['equipmentId'] },
                { fields: ['maintenanceType'] },
                { fields: ['scheduledDate'] },
                { fields: ['completionDate'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _equipmentId_decorators;
    let _equipmentId_initializers = [];
    let _equipmentId_extraInitializers = [];
    let _equipment_decorators;
    let _equipment_initializers = [];
    let _equipment_extraInitializers = [];
    let _maintenanceType_decorators;
    let _maintenanceType_initializers = [];
    let _maintenanceType_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _scheduledDate_decorators;
    let _scheduledDate_initializers = [];
    let _scheduledDate_extraInitializers = [];
    let _completionDate_decorators;
    let _completionDate_initializers = [];
    let _completionDate_extraInitializers = [];
    let _technicianName_decorators;
    let _technicianName_initializers = [];
    let _technicianName_extraInitializers = [];
    let _serviceProvider_decorators;
    let _serviceProvider_initializers = [];
    let _serviceProvider_extraInitializers = [];
    let _totalCost_decorators;
    let _totalCost_initializers = [];
    let _totalCost_extraInitializers = [];
    let _laborCost_decorators;
    let _laborCost_initializers = [];
    let _laborCost_extraInitializers = [];
    let _partsCost_decorators;
    let _partsCost_initializers = [];
    let _partsCost_extraInitializers = [];
    let _partsReplaced_decorators;
    let _partsReplaced_initializers = [];
    let _partsReplaced_extraInitializers = [];
    let _operatingHoursAtService_decorators;
    let _operatingHoursAtService_initializers = [];
    let _operatingHoursAtService_extraInitializers = [];
    let _downtimeHours_decorators;
    let _downtimeHours_initializers = [];
    let _downtimeHours_extraInitializers = [];
    let _workOrderNumber_decorators;
    let _workOrderNumber_initializers = [];
    let _workOrderNumber_extraInitializers = [];
    let _findings_decorators;
    let _findings_initializers = [];
    let _findings_extraInitializers = [];
    let _followUpRequired_decorators;
    let _followUpRequired_initializers = [];
    let _followUpRequired_extraInitializers = [];
    let _nextServiceDue_decorators;
    let _nextServiceDue_initializers = [];
    let _nextServiceDue_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var EquipmentMaintenanceRecord = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.equipmentId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _equipmentId_initializers, void 0));
            this.equipment = (__runInitializers(this, _equipmentId_extraInitializers), __runInitializers(this, _equipment_initializers, void 0));
            this.maintenanceType = (__runInitializers(this, _equipment_extraInitializers), __runInitializers(this, _maintenanceType_initializers, void 0));
            this.description = (__runInitializers(this, _maintenanceType_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.scheduledDate = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _scheduledDate_initializers, void 0));
            this.completionDate = (__runInitializers(this, _scheduledDate_extraInitializers), __runInitializers(this, _completionDate_initializers, void 0));
            this.technicianName = (__runInitializers(this, _completionDate_extraInitializers), __runInitializers(this, _technicianName_initializers, void 0));
            this.serviceProvider = (__runInitializers(this, _technicianName_extraInitializers), __runInitializers(this, _serviceProvider_initializers, void 0));
            this.totalCost = (__runInitializers(this, _serviceProvider_extraInitializers), __runInitializers(this, _totalCost_initializers, void 0));
            this.laborCost = (__runInitializers(this, _totalCost_extraInitializers), __runInitializers(this, _laborCost_initializers, void 0));
            this.partsCost = (__runInitializers(this, _laborCost_extraInitializers), __runInitializers(this, _partsCost_initializers, void 0));
            this.partsReplaced = (__runInitializers(this, _partsCost_extraInitializers), __runInitializers(this, _partsReplaced_initializers, void 0));
            this.operatingHoursAtService = (__runInitializers(this, _partsReplaced_extraInitializers), __runInitializers(this, _operatingHoursAtService_initializers, void 0));
            this.downtimeHours = (__runInitializers(this, _operatingHoursAtService_extraInitializers), __runInitializers(this, _downtimeHours_initializers, void 0));
            this.workOrderNumber = (__runInitializers(this, _downtimeHours_extraInitializers), __runInitializers(this, _workOrderNumber_initializers, void 0));
            this.findings = (__runInitializers(this, _workOrderNumber_extraInitializers), __runInitializers(this, _findings_initializers, void 0));
            this.followUpRequired = (__runInitializers(this, _findings_extraInitializers), __runInitializers(this, _followUpRequired_initializers, void 0));
            this.nextServiceDue = (__runInitializers(this, _followUpRequired_extraInitializers), __runInitializers(this, _nextServiceDue_initializers, void 0));
            this.createdAt = (__runInitializers(this, _nextServiceDue_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "EquipmentMaintenanceRecord");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Unique maintenance record identifier',
                example: '8e1d7a3c-4f2b-4e9a-b1c5-d8f3e6a9c2b4',
            }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _equipmentId_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Equipment ID',
                example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
            }), (0, sequelize_typescript_1.ForeignKey)(() => construction_equipment_model_1.ConstructionEquipment), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _equipment_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => construction_equipment_model_1.ConstructionEquipment)];
        _maintenanceType_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Maintenance type',
                enum: equipment_types_1.MaintenanceType,
                example: equipment_types_1.MaintenanceType.PREVENTIVE,
            }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(equipment_types_1.MaintenanceType)),
                allowNull: false,
            }), sequelize_typescript_1.Index];
        _description_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Service description',
                example: 'Oil change and filter replacement',
            }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: false })];
        _scheduledDate_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Scheduled date',
                example: '2024-12-15T09:00:00Z',
            }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE }), sequelize_typescript_1.Index];
        _completionDate_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Completion date',
                example: '2024-12-15T14:30:00Z',
            }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE }), sequelize_typescript_1.Index];
        _technicianName_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Technician/mechanic name',
                example: 'John Smith',
            }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100) })];
        _serviceProvider_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Service provider/vendor',
                example: 'ABC Equipment Services',
            }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200) })];
        _totalCost_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Total cost of maintenance',
                example: 450.75,
            }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 2) })];
        _laborCost_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Labor cost',
                example: 200,
            }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 2) })];
        _partsCost_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Parts cost',
                example: 250.75,
            }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 2) })];
        _partsReplaced_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Parts replaced',
                example: ['Oil filter', 'Engine oil (15W-40)', 'Air filter'],
            }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING) })];
        _operatingHoursAtService_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Operating hours at service',
                example: 1250,
            }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 2) })];
        _downtimeHours_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Downtime in hours',
                example: 5.5,
            }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 2) })];
        _workOrderNumber_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Work order number',
                example: 'WO-2024-1234',
            }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50) })];
        _findings_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Findings and recommendations',
                example: 'Hydraulic hoses show minor wear, recommend replacement within 6 months',
            }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _followUpRequired_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Follow-up required',
                example: true,
            }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false })];
        _nextServiceDue_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Next service due date',
                example: '2025-03-15T00:00:00Z',
            }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _equipmentId_decorators, { kind: "field", name: "equipmentId", static: false, private: false, access: { has: obj => "equipmentId" in obj, get: obj => obj.equipmentId, set: (obj, value) => { obj.equipmentId = value; } }, metadata: _metadata }, _equipmentId_initializers, _equipmentId_extraInitializers);
        __esDecorate(null, null, _equipment_decorators, { kind: "field", name: "equipment", static: false, private: false, access: { has: obj => "equipment" in obj, get: obj => obj.equipment, set: (obj, value) => { obj.equipment = value; } }, metadata: _metadata }, _equipment_initializers, _equipment_extraInitializers);
        __esDecorate(null, null, _maintenanceType_decorators, { kind: "field", name: "maintenanceType", static: false, private: false, access: { has: obj => "maintenanceType" in obj, get: obj => obj.maintenanceType, set: (obj, value) => { obj.maintenanceType = value; } }, metadata: _metadata }, _maintenanceType_initializers, _maintenanceType_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _scheduledDate_decorators, { kind: "field", name: "scheduledDate", static: false, private: false, access: { has: obj => "scheduledDate" in obj, get: obj => obj.scheduledDate, set: (obj, value) => { obj.scheduledDate = value; } }, metadata: _metadata }, _scheduledDate_initializers, _scheduledDate_extraInitializers);
        __esDecorate(null, null, _completionDate_decorators, { kind: "field", name: "completionDate", static: false, private: false, access: { has: obj => "completionDate" in obj, get: obj => obj.completionDate, set: (obj, value) => { obj.completionDate = value; } }, metadata: _metadata }, _completionDate_initializers, _completionDate_extraInitializers);
        __esDecorate(null, null, _technicianName_decorators, { kind: "field", name: "technicianName", static: false, private: false, access: { has: obj => "technicianName" in obj, get: obj => obj.technicianName, set: (obj, value) => { obj.technicianName = value; } }, metadata: _metadata }, _technicianName_initializers, _technicianName_extraInitializers);
        __esDecorate(null, null, _serviceProvider_decorators, { kind: "field", name: "serviceProvider", static: false, private: false, access: { has: obj => "serviceProvider" in obj, get: obj => obj.serviceProvider, set: (obj, value) => { obj.serviceProvider = value; } }, metadata: _metadata }, _serviceProvider_initializers, _serviceProvider_extraInitializers);
        __esDecorate(null, null, _totalCost_decorators, { kind: "field", name: "totalCost", static: false, private: false, access: { has: obj => "totalCost" in obj, get: obj => obj.totalCost, set: (obj, value) => { obj.totalCost = value; } }, metadata: _metadata }, _totalCost_initializers, _totalCost_extraInitializers);
        __esDecorate(null, null, _laborCost_decorators, { kind: "field", name: "laborCost", static: false, private: false, access: { has: obj => "laborCost" in obj, get: obj => obj.laborCost, set: (obj, value) => { obj.laborCost = value; } }, metadata: _metadata }, _laborCost_initializers, _laborCost_extraInitializers);
        __esDecorate(null, null, _partsCost_decorators, { kind: "field", name: "partsCost", static: false, private: false, access: { has: obj => "partsCost" in obj, get: obj => obj.partsCost, set: (obj, value) => { obj.partsCost = value; } }, metadata: _metadata }, _partsCost_initializers, _partsCost_extraInitializers);
        __esDecorate(null, null, _partsReplaced_decorators, { kind: "field", name: "partsReplaced", static: false, private: false, access: { has: obj => "partsReplaced" in obj, get: obj => obj.partsReplaced, set: (obj, value) => { obj.partsReplaced = value; } }, metadata: _metadata }, _partsReplaced_initializers, _partsReplaced_extraInitializers);
        __esDecorate(null, null, _operatingHoursAtService_decorators, { kind: "field", name: "operatingHoursAtService", static: false, private: false, access: { has: obj => "operatingHoursAtService" in obj, get: obj => obj.operatingHoursAtService, set: (obj, value) => { obj.operatingHoursAtService = value; } }, metadata: _metadata }, _operatingHoursAtService_initializers, _operatingHoursAtService_extraInitializers);
        __esDecorate(null, null, _downtimeHours_decorators, { kind: "field", name: "downtimeHours", static: false, private: false, access: { has: obj => "downtimeHours" in obj, get: obj => obj.downtimeHours, set: (obj, value) => { obj.downtimeHours = value; } }, metadata: _metadata }, _downtimeHours_initializers, _downtimeHours_extraInitializers);
        __esDecorate(null, null, _workOrderNumber_decorators, { kind: "field", name: "workOrderNumber", static: false, private: false, access: { has: obj => "workOrderNumber" in obj, get: obj => obj.workOrderNumber, set: (obj, value) => { obj.workOrderNumber = value; } }, metadata: _metadata }, _workOrderNumber_initializers, _workOrderNumber_extraInitializers);
        __esDecorate(null, null, _findings_decorators, { kind: "field", name: "findings", static: false, private: false, access: { has: obj => "findings" in obj, get: obj => obj.findings, set: (obj, value) => { obj.findings = value; } }, metadata: _metadata }, _findings_initializers, _findings_extraInitializers);
        __esDecorate(null, null, _followUpRequired_decorators, { kind: "field", name: "followUpRequired", static: false, private: false, access: { has: obj => "followUpRequired" in obj, get: obj => obj.followUpRequired, set: (obj, value) => { obj.followUpRequired = value; } }, metadata: _metadata }, _followUpRequired_initializers, _followUpRequired_extraInitializers);
        __esDecorate(null, null, _nextServiceDue_decorators, { kind: "field", name: "nextServiceDue", static: false, private: false, access: { has: obj => "nextServiceDue" in obj, get: obj => obj.nextServiceDue, set: (obj, value) => { obj.nextServiceDue = value; } }, metadata: _metadata }, _nextServiceDue_initializers, _nextServiceDue_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EquipmentMaintenanceRecord = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EquipmentMaintenanceRecord = _classThis;
})();
exports.EquipmentMaintenanceRecord = EquipmentMaintenanceRecord;
//# sourceMappingURL=equipment-maintenance-record.model.js.map