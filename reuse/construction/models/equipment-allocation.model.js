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
exports.EquipmentAllocation = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const swagger_1 = require("@nestjs/swagger");
const construction_equipment_model_1 = require("./construction-equipment.model");
let EquipmentAllocation = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'equipment_allocations',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['equipmentId'] },
                { fields: ['projectId'] },
                { fields: ['startDate'] },
                { fields: ['endDate'] },
                { fields: ['allocationStatus'] },
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
    let _projectId_decorators;
    let _projectId_initializers = [];
    let _projectId_extraInitializers = [];
    let _projectName_decorators;
    let _projectName_initializers = [];
    let _projectName_extraInitializers = [];
    let _projectLocation_decorators;
    let _projectLocation_initializers = [];
    let _projectLocation_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _actualReturnDate_decorators;
    let _actualReturnDate_initializers = [];
    let _actualReturnDate_extraInitializers = [];
    let _assignedOperatorId_decorators;
    let _assignedOperatorId_initializers = [];
    let _assignedOperatorId_extraInitializers = [];
    let _assignedOperatorName_decorators;
    let _assignedOperatorName_initializers = [];
    let _assignedOperatorName_extraInitializers = [];
    let _allocationStatus_decorators;
    let _allocationStatus_initializers = [];
    let _allocationStatus_extraInitializers = [];
    let _dailyRate_decorators;
    let _dailyRate_initializers = [];
    let _dailyRate_extraInitializers = [];
    let _estimatedCost_decorators;
    let _estimatedCost_initializers = [];
    let _estimatedCost_extraInitializers = [];
    let _actualCost_decorators;
    let _actualCost_initializers = [];
    let _actualCost_extraInitializers = [];
    let _startingOperatingHours_decorators;
    let _startingOperatingHours_initializers = [];
    let _startingOperatingHours_extraInitializers = [];
    let _endingOperatingHours_decorators;
    let _endingOperatingHours_initializers = [];
    let _endingOperatingHours_extraInitializers = [];
    let _fuelConsumed_decorators;
    let _fuelConsumed_initializers = [];
    let _fuelConsumed_extraInitializers = [];
    let _purpose_decorators;
    let _purpose_initializers = [];
    let _purpose_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _requestedBy_decorators;
    let _requestedBy_initializers = [];
    let _requestedBy_extraInitializers = [];
    let _approvedBy_decorators;
    let _approvedBy_initializers = [];
    let _approvedBy_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var EquipmentAllocation = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.equipmentId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _equipmentId_initializers, void 0));
            this.equipment = (__runInitializers(this, _equipmentId_extraInitializers), __runInitializers(this, _equipment_initializers, void 0));
            this.projectId = (__runInitializers(this, _equipment_extraInitializers), __runInitializers(this, _projectId_initializers, void 0));
            this.projectName = (__runInitializers(this, _projectId_extraInitializers), __runInitializers(this, _projectName_initializers, void 0));
            this.projectLocation = (__runInitializers(this, _projectName_extraInitializers), __runInitializers(this, _projectLocation_initializers, void 0));
            this.startDate = (__runInitializers(this, _projectLocation_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
            this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
            this.actualReturnDate = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _actualReturnDate_initializers, void 0));
            this.assignedOperatorId = (__runInitializers(this, _actualReturnDate_extraInitializers), __runInitializers(this, _assignedOperatorId_initializers, void 0));
            this.assignedOperatorName = (__runInitializers(this, _assignedOperatorId_extraInitializers), __runInitializers(this, _assignedOperatorName_initializers, void 0));
            this.allocationStatus = (__runInitializers(this, _assignedOperatorName_extraInitializers), __runInitializers(this, _allocationStatus_initializers, void 0));
            this.dailyRate = (__runInitializers(this, _allocationStatus_extraInitializers), __runInitializers(this, _dailyRate_initializers, void 0));
            this.estimatedCost = (__runInitializers(this, _dailyRate_extraInitializers), __runInitializers(this, _estimatedCost_initializers, void 0));
            this.actualCost = (__runInitializers(this, _estimatedCost_extraInitializers), __runInitializers(this, _actualCost_initializers, void 0));
            this.startingOperatingHours = (__runInitializers(this, _actualCost_extraInitializers), __runInitializers(this, _startingOperatingHours_initializers, void 0));
            this.endingOperatingHours = (__runInitializers(this, _startingOperatingHours_extraInitializers), __runInitializers(this, _endingOperatingHours_initializers, void 0));
            this.fuelConsumed = (__runInitializers(this, _endingOperatingHours_extraInitializers), __runInitializers(this, _fuelConsumed_initializers, void 0));
            this.purpose = (__runInitializers(this, _fuelConsumed_extraInitializers), __runInitializers(this, _purpose_initializers, void 0));
            this.notes = (__runInitializers(this, _purpose_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.requestedBy = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _requestedBy_initializers, void 0));
            this.approvedBy = (__runInitializers(this, _requestedBy_extraInitializers), __runInitializers(this, _approvedBy_initializers, void 0));
            this.createdAt = (__runInitializers(this, _approvedBy_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "EquipmentAllocation");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Unique allocation identifier',
                example: '3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f',
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
        _projectId_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Project ID',
                example: 'PROJ-2024-045',
            }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50), allowNull: false }), sequelize_typescript_1.Index];
        _projectName_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Project name',
                example: 'Downtown Office Complex',
            }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200) })];
        _projectLocation_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Project location',
                example: '123 Main St, Downtown',
            }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200) })];
        _startDate_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Allocation start date',
                example: '2024-11-15T08:00:00Z',
            }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false }), sequelize_typescript_1.Index];
        _endDate_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Allocation end date',
                example: '2024-12-15T17:00:00Z',
            }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE }), sequelize_typescript_1.Index];
        _actualReturnDate_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Actual return date',
                example: '2024-12-14T16:30:00Z',
            }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _assignedOperatorId_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Assigned operator ID',
                example: 'OP-123',
            }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50) })];
        _assignedOperatorName_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Assigned operator name',
                example: 'Mike Johnson',
            }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100) })];
        _allocationStatus_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Allocation status',
                example: 'active',
            }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM('pending', 'active', 'completed', 'cancelled'),
                defaultValue: 'pending',
            }), sequelize_typescript_1.Index];
        _dailyRate_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Daily rate charged',
                example: 750,
            }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 2) })];
        _estimatedCost_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Total estimated cost',
                example: 22500,
            }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(15, 2) })];
        _actualCost_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Total actual cost',
                example: 21750,
            }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(15, 2) })];
        _startingOperatingHours_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Operating hours at allocation start',
                example: 1200,
            }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 2) })];
        _endingOperatingHours_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Operating hours at allocation end',
                example: 1450,
            }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 2) })];
        _fuelConsumed_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Fuel consumed (gallons)',
                example: 345.5,
            }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 2) })];
        _purpose_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Purpose of allocation',
                example: 'Foundation excavation',
            }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _notes_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Allocation notes',
                example: 'Requires daily cleaning due to muddy conditions',
            }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _requestedBy_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Requested by user ID',
                example: 'USR-456',
            }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50) })];
        _approvedBy_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Approved by user ID',
                example: 'MGR-789',
            }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50) })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _equipmentId_decorators, { kind: "field", name: "equipmentId", static: false, private: false, access: { has: obj => "equipmentId" in obj, get: obj => obj.equipmentId, set: (obj, value) => { obj.equipmentId = value; } }, metadata: _metadata }, _equipmentId_initializers, _equipmentId_extraInitializers);
        __esDecorate(null, null, _equipment_decorators, { kind: "field", name: "equipment", static: false, private: false, access: { has: obj => "equipment" in obj, get: obj => obj.equipment, set: (obj, value) => { obj.equipment = value; } }, metadata: _metadata }, _equipment_initializers, _equipment_extraInitializers);
        __esDecorate(null, null, _projectId_decorators, { kind: "field", name: "projectId", static: false, private: false, access: { has: obj => "projectId" in obj, get: obj => obj.projectId, set: (obj, value) => { obj.projectId = value; } }, metadata: _metadata }, _projectId_initializers, _projectId_extraInitializers);
        __esDecorate(null, null, _projectName_decorators, { kind: "field", name: "projectName", static: false, private: false, access: { has: obj => "projectName" in obj, get: obj => obj.projectName, set: (obj, value) => { obj.projectName = value; } }, metadata: _metadata }, _projectName_initializers, _projectName_extraInitializers);
        __esDecorate(null, null, _projectLocation_decorators, { kind: "field", name: "projectLocation", static: false, private: false, access: { has: obj => "projectLocation" in obj, get: obj => obj.projectLocation, set: (obj, value) => { obj.projectLocation = value; } }, metadata: _metadata }, _projectLocation_initializers, _projectLocation_extraInitializers);
        __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
        __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
        __esDecorate(null, null, _actualReturnDate_decorators, { kind: "field", name: "actualReturnDate", static: false, private: false, access: { has: obj => "actualReturnDate" in obj, get: obj => obj.actualReturnDate, set: (obj, value) => { obj.actualReturnDate = value; } }, metadata: _metadata }, _actualReturnDate_initializers, _actualReturnDate_extraInitializers);
        __esDecorate(null, null, _assignedOperatorId_decorators, { kind: "field", name: "assignedOperatorId", static: false, private: false, access: { has: obj => "assignedOperatorId" in obj, get: obj => obj.assignedOperatorId, set: (obj, value) => { obj.assignedOperatorId = value; } }, metadata: _metadata }, _assignedOperatorId_initializers, _assignedOperatorId_extraInitializers);
        __esDecorate(null, null, _assignedOperatorName_decorators, { kind: "field", name: "assignedOperatorName", static: false, private: false, access: { has: obj => "assignedOperatorName" in obj, get: obj => obj.assignedOperatorName, set: (obj, value) => { obj.assignedOperatorName = value; } }, metadata: _metadata }, _assignedOperatorName_initializers, _assignedOperatorName_extraInitializers);
        __esDecorate(null, null, _allocationStatus_decorators, { kind: "field", name: "allocationStatus", static: false, private: false, access: { has: obj => "allocationStatus" in obj, get: obj => obj.allocationStatus, set: (obj, value) => { obj.allocationStatus = value; } }, metadata: _metadata }, _allocationStatus_initializers, _allocationStatus_extraInitializers);
        __esDecorate(null, null, _dailyRate_decorators, { kind: "field", name: "dailyRate", static: false, private: false, access: { has: obj => "dailyRate" in obj, get: obj => obj.dailyRate, set: (obj, value) => { obj.dailyRate = value; } }, metadata: _metadata }, _dailyRate_initializers, _dailyRate_extraInitializers);
        __esDecorate(null, null, _estimatedCost_decorators, { kind: "field", name: "estimatedCost", static: false, private: false, access: { has: obj => "estimatedCost" in obj, get: obj => obj.estimatedCost, set: (obj, value) => { obj.estimatedCost = value; } }, metadata: _metadata }, _estimatedCost_initializers, _estimatedCost_extraInitializers);
        __esDecorate(null, null, _actualCost_decorators, { kind: "field", name: "actualCost", static: false, private: false, access: { has: obj => "actualCost" in obj, get: obj => obj.actualCost, set: (obj, value) => { obj.actualCost = value; } }, metadata: _metadata }, _actualCost_initializers, _actualCost_extraInitializers);
        __esDecorate(null, null, _startingOperatingHours_decorators, { kind: "field", name: "startingOperatingHours", static: false, private: false, access: { has: obj => "startingOperatingHours" in obj, get: obj => obj.startingOperatingHours, set: (obj, value) => { obj.startingOperatingHours = value; } }, metadata: _metadata }, _startingOperatingHours_initializers, _startingOperatingHours_extraInitializers);
        __esDecorate(null, null, _endingOperatingHours_decorators, { kind: "field", name: "endingOperatingHours", static: false, private: false, access: { has: obj => "endingOperatingHours" in obj, get: obj => obj.endingOperatingHours, set: (obj, value) => { obj.endingOperatingHours = value; } }, metadata: _metadata }, _endingOperatingHours_initializers, _endingOperatingHours_extraInitializers);
        __esDecorate(null, null, _fuelConsumed_decorators, { kind: "field", name: "fuelConsumed", static: false, private: false, access: { has: obj => "fuelConsumed" in obj, get: obj => obj.fuelConsumed, set: (obj, value) => { obj.fuelConsumed = value; } }, metadata: _metadata }, _fuelConsumed_initializers, _fuelConsumed_extraInitializers);
        __esDecorate(null, null, _purpose_decorators, { kind: "field", name: "purpose", static: false, private: false, access: { has: obj => "purpose" in obj, get: obj => obj.purpose, set: (obj, value) => { obj.purpose = value; } }, metadata: _metadata }, _purpose_initializers, _purpose_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _requestedBy_decorators, { kind: "field", name: "requestedBy", static: false, private: false, access: { has: obj => "requestedBy" in obj, get: obj => obj.requestedBy, set: (obj, value) => { obj.requestedBy = value; } }, metadata: _metadata }, _requestedBy_initializers, _requestedBy_extraInitializers);
        __esDecorate(null, null, _approvedBy_decorators, { kind: "field", name: "approvedBy", static: false, private: false, access: { has: obj => "approvedBy" in obj, get: obj => obj.approvedBy, set: (obj, value) => { obj.approvedBy = value; } }, metadata: _metadata }, _approvedBy_initializers, _approvedBy_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EquipmentAllocation = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EquipmentAllocation = _classThis;
})();
exports.EquipmentAllocation = EquipmentAllocation;
//# sourceMappingURL=equipment-allocation.model.js.map