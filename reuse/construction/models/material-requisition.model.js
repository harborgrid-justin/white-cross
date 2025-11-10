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
exports.MaterialRequisition = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const swagger_1 = require("@nestjs/swagger");
const material_types_1 = require("../types/material.types");
const construction_material_model_1 = require("./construction-material.model");
const material_transaction_model_1 = require("./material-transaction.model");
let MaterialRequisition = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'material_requisitions',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['materialId'] },
                { fields: ['projectId'] },
                { fields: ['status'] },
                { fields: ['requiredDate'] },
                { fields: ['requisitionNumber'], unique: true },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _requisitionNumber_decorators;
    let _requisitionNumber_initializers = [];
    let _requisitionNumber_extraInitializers = [];
    let _materialId_decorators;
    let _materialId_initializers = [];
    let _materialId_extraInitializers = [];
    let _material_decorators;
    let _material_initializers = [];
    let _material_extraInitializers = [];
    let _projectId_decorators;
    let _projectId_initializers = [];
    let _projectId_extraInitializers = [];
    let _projectName_decorators;
    let _projectName_initializers = [];
    let _projectName_extraInitializers = [];
    let _quantityRequested_decorators;
    let _quantityRequested_initializers = [];
    let _quantityRequested_extraInitializers = [];
    let _quantityApproved_decorators;
    let _quantityApproved_initializers = [];
    let _quantityApproved_extraInitializers = [];
    let _quantityOrdered_decorators;
    let _quantityOrdered_initializers = [];
    let _quantityOrdered_extraInitializers = [];
    let _quantityReceived_decorators;
    let _quantityReceived_initializers = [];
    let _quantityReceived_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _requiredDate_decorators;
    let _requiredDate_initializers = [];
    let _requiredDate_extraInitializers = [];
    let _estimatedUnitCost_decorators;
    let _estimatedUnitCost_initializers = [];
    let _estimatedUnitCost_extraInitializers = [];
    let _estimatedTotalCost_decorators;
    let _estimatedTotalCost_initializers = [];
    let _estimatedTotalCost_extraInitializers = [];
    let _actualTotalCost_decorators;
    let _actualTotalCost_initializers = [];
    let _actualTotalCost_extraInitializers = [];
    let _deliveryLocation_decorators;
    let _deliveryLocation_initializers = [];
    let _deliveryLocation_extraInitializers = [];
    let _deliveryInstructions_decorators;
    let _deliveryInstructions_initializers = [];
    let _deliveryInstructions_extraInitializers = [];
    let _requestedBy_decorators;
    let _requestedBy_initializers = [];
    let _requestedBy_extraInitializers = [];
    let _approvedBy_decorators;
    let _approvedBy_initializers = [];
    let _approvedBy_extraInitializers = [];
    let _purchaseOrderNumber_decorators;
    let _purchaseOrderNumber_initializers = [];
    let _purchaseOrderNumber_extraInitializers = [];
    let _vendorId_decorators;
    let _vendorId_initializers = [];
    let _vendorId_extraInitializers = [];
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
    let _transactions_decorators;
    let _transactions_initializers = [];
    let _transactions_extraInitializers = [];
    var MaterialRequisition = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.requisitionNumber = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _requisitionNumber_initializers, void 0));
            this.materialId = (__runInitializers(this, _requisitionNumber_extraInitializers), __runInitializers(this, _materialId_initializers, void 0));
            this.material = (__runInitializers(this, _materialId_extraInitializers), __runInitializers(this, _material_initializers, void 0));
            this.projectId = (__runInitializers(this, _material_extraInitializers), __runInitializers(this, _projectId_initializers, void 0));
            this.projectName = (__runInitializers(this, _projectId_extraInitializers), __runInitializers(this, _projectName_initializers, void 0));
            this.quantityRequested = (__runInitializers(this, _projectName_extraInitializers), __runInitializers(this, _quantityRequested_initializers, void 0));
            this.quantityApproved = (__runInitializers(this, _quantityRequested_extraInitializers), __runInitializers(this, _quantityApproved_initializers, void 0));
            this.quantityOrdered = (__runInitializers(this, _quantityApproved_extraInitializers), __runInitializers(this, _quantityOrdered_initializers, void 0));
            this.quantityReceived = (__runInitializers(this, _quantityOrdered_extraInitializers), __runInitializers(this, _quantityReceived_initializers, void 0));
            this.status = (__runInitializers(this, _quantityReceived_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.requiredDate = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _requiredDate_initializers, void 0));
            this.estimatedUnitCost = (__runInitializers(this, _requiredDate_extraInitializers), __runInitializers(this, _estimatedUnitCost_initializers, void 0));
            this.estimatedTotalCost = (__runInitializers(this, _estimatedUnitCost_extraInitializers), __runInitializers(this, _estimatedTotalCost_initializers, void 0));
            this.actualTotalCost = (__runInitializers(this, _estimatedTotalCost_extraInitializers), __runInitializers(this, _actualTotalCost_initializers, void 0));
            this.deliveryLocation = (__runInitializers(this, _actualTotalCost_extraInitializers), __runInitializers(this, _deliveryLocation_initializers, void 0));
            this.deliveryInstructions = (__runInitializers(this, _deliveryLocation_extraInitializers), __runInitializers(this, _deliveryInstructions_initializers, void 0));
            this.requestedBy = (__runInitializers(this, _deliveryInstructions_extraInitializers), __runInitializers(this, _requestedBy_initializers, void 0));
            this.approvedBy = (__runInitializers(this, _requestedBy_extraInitializers), __runInitializers(this, _approvedBy_initializers, void 0));
            this.purchaseOrderNumber = (__runInitializers(this, _approvedBy_extraInitializers), __runInitializers(this, _purchaseOrderNumber_initializers, void 0));
            this.vendorId = (__runInitializers(this, _purchaseOrderNumber_extraInitializers), __runInitializers(this, _vendorId_initializers, void 0));
            this.notes = (__runInitializers(this, _vendorId_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.createdAt = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.transactions = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _transactions_initializers, void 0));
            __runInitializers(this, _transactions_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "MaterialRequisition");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Unique requisition identifier',
                example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
            }), sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _requisitionNumber_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Requisition number',
                example: 'REQ-2024-001234',
            }), (0, sequelize_typescript_1.AllowNull)(false), Unique, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _materialId_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Material ID',
                example: 'c5d6e7f8-9a0b-1c2d-3e4f-5a6b7c8d9e0f',
            }), (0, sequelize_typescript_1.ForeignKey)(() => construction_material_model_1.ConstructionMaterial), (0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _material_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => construction_material_model_1.ConstructionMaterial)];
        _projectId_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Project ID',
                example: 'PROJ-2024-045',
            }), (0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _projectName_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Project name',
                example: 'Downtown Office Complex',
            }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(200))];
        _quantityRequested_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Quantity requested',
                example: 500,
            }), (0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(15, 4))];
        _quantityApproved_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Quantity approved',
                example: 500,
            }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(15, 4))];
        _quantityOrdered_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Quantity ordered',
                example: 500,
            }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(15, 4))];
        _quantityReceived_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Quantity received',
                example: 485,
            }), (0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(15, 4))];
        _status_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Requisition status',
                enum: material_types_1.RequisitionStatus,
                example: material_types_1.RequisitionStatus.SUBMITTED,
            }), (0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(material_types_1.RequisitionStatus.DRAFT), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(material_types_1.RequisitionStatus)),
            })];
        _requiredDate_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Required delivery date',
                example: '2024-12-15T00:00:00Z',
            }), (0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _estimatedUnitCost_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Estimated unit cost',
                example: 125.50,
            }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(15, 2))];
        _estimatedTotalCost_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Estimated total cost',
                example: 62750.00,
            }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(15, 2))];
        _actualTotalCost_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Actual total cost',
                example: 58200.00,
            }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(15, 2))];
        _deliveryLocation_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Delivery location',
                example: 'Job Site - 123 Main Street',
            }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(200))];
        _deliveryInstructions_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Delivery instructions',
                example: 'Call foreman 30 minutes before delivery',
            }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _requestedBy_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Requested by user ID',
                example: 'USR-456',
            }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _approvedBy_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Approved by user ID',
                example: 'MGR-789',
            }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _purchaseOrderNumber_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Purchase order number',
                example: 'PO-2024-5678',
            }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _vendorId_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Vendor/supplier ID',
                example: 'VEND-123',
            }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _notes_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Requisition notes',
                example: 'Rush order - critical path item',
            }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        _transactions_decorators = [(0, sequelize_typescript_1.HasMany)(() => material_transaction_model_1.MaterialTransaction)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _requisitionNumber_decorators, { kind: "field", name: "requisitionNumber", static: false, private: false, access: { has: obj => "requisitionNumber" in obj, get: obj => obj.requisitionNumber, set: (obj, value) => { obj.requisitionNumber = value; } }, metadata: _metadata }, _requisitionNumber_initializers, _requisitionNumber_extraInitializers);
        __esDecorate(null, null, _materialId_decorators, { kind: "field", name: "materialId", static: false, private: false, access: { has: obj => "materialId" in obj, get: obj => obj.materialId, set: (obj, value) => { obj.materialId = value; } }, metadata: _metadata }, _materialId_initializers, _materialId_extraInitializers);
        __esDecorate(null, null, _material_decorators, { kind: "field", name: "material", static: false, private: false, access: { has: obj => "material" in obj, get: obj => obj.material, set: (obj, value) => { obj.material = value; } }, metadata: _metadata }, _material_initializers, _material_extraInitializers);
        __esDecorate(null, null, _projectId_decorators, { kind: "field", name: "projectId", static: false, private: false, access: { has: obj => "projectId" in obj, get: obj => obj.projectId, set: (obj, value) => { obj.projectId = value; } }, metadata: _metadata }, _projectId_initializers, _projectId_extraInitializers);
        __esDecorate(null, null, _projectName_decorators, { kind: "field", name: "projectName", static: false, private: false, access: { has: obj => "projectName" in obj, get: obj => obj.projectName, set: (obj, value) => { obj.projectName = value; } }, metadata: _metadata }, _projectName_initializers, _projectName_extraInitializers);
        __esDecorate(null, null, _quantityRequested_decorators, { kind: "field", name: "quantityRequested", static: false, private: false, access: { has: obj => "quantityRequested" in obj, get: obj => obj.quantityRequested, set: (obj, value) => { obj.quantityRequested = value; } }, metadata: _metadata }, _quantityRequested_initializers, _quantityRequested_extraInitializers);
        __esDecorate(null, null, _quantityApproved_decorators, { kind: "field", name: "quantityApproved", static: false, private: false, access: { has: obj => "quantityApproved" in obj, get: obj => obj.quantityApproved, set: (obj, value) => { obj.quantityApproved = value; } }, metadata: _metadata }, _quantityApproved_initializers, _quantityApproved_extraInitializers);
        __esDecorate(null, null, _quantityOrdered_decorators, { kind: "field", name: "quantityOrdered", static: false, private: false, access: { has: obj => "quantityOrdered" in obj, get: obj => obj.quantityOrdered, set: (obj, value) => { obj.quantityOrdered = value; } }, metadata: _metadata }, _quantityOrdered_initializers, _quantityOrdered_extraInitializers);
        __esDecorate(null, null, _quantityReceived_decorators, { kind: "field", name: "quantityReceived", static: false, private: false, access: { has: obj => "quantityReceived" in obj, get: obj => obj.quantityReceived, set: (obj, value) => { obj.quantityReceived = value; } }, metadata: _metadata }, _quantityReceived_initializers, _quantityReceived_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _requiredDate_decorators, { kind: "field", name: "requiredDate", static: false, private: false, access: { has: obj => "requiredDate" in obj, get: obj => obj.requiredDate, set: (obj, value) => { obj.requiredDate = value; } }, metadata: _metadata }, _requiredDate_initializers, _requiredDate_extraInitializers);
        __esDecorate(null, null, _estimatedUnitCost_decorators, { kind: "field", name: "estimatedUnitCost", static: false, private: false, access: { has: obj => "estimatedUnitCost" in obj, get: obj => obj.estimatedUnitCost, set: (obj, value) => { obj.estimatedUnitCost = value; } }, metadata: _metadata }, _estimatedUnitCost_initializers, _estimatedUnitCost_extraInitializers);
        __esDecorate(null, null, _estimatedTotalCost_decorators, { kind: "field", name: "estimatedTotalCost", static: false, private: false, access: { has: obj => "estimatedTotalCost" in obj, get: obj => obj.estimatedTotalCost, set: (obj, value) => { obj.estimatedTotalCost = value; } }, metadata: _metadata }, _estimatedTotalCost_initializers, _estimatedTotalCost_extraInitializers);
        __esDecorate(null, null, _actualTotalCost_decorators, { kind: "field", name: "actualTotalCost", static: false, private: false, access: { has: obj => "actualTotalCost" in obj, get: obj => obj.actualTotalCost, set: (obj, value) => { obj.actualTotalCost = value; } }, metadata: _metadata }, _actualTotalCost_initializers, _actualTotalCost_extraInitializers);
        __esDecorate(null, null, _deliveryLocation_decorators, { kind: "field", name: "deliveryLocation", static: false, private: false, access: { has: obj => "deliveryLocation" in obj, get: obj => obj.deliveryLocation, set: (obj, value) => { obj.deliveryLocation = value; } }, metadata: _metadata }, _deliveryLocation_initializers, _deliveryLocation_extraInitializers);
        __esDecorate(null, null, _deliveryInstructions_decorators, { kind: "field", name: "deliveryInstructions", static: false, private: false, access: { has: obj => "deliveryInstructions" in obj, get: obj => obj.deliveryInstructions, set: (obj, value) => { obj.deliveryInstructions = value; } }, metadata: _metadata }, _deliveryInstructions_initializers, _deliveryInstructions_extraInitializers);
        __esDecorate(null, null, _requestedBy_decorators, { kind: "field", name: "requestedBy", static: false, private: false, access: { has: obj => "requestedBy" in obj, get: obj => obj.requestedBy, set: (obj, value) => { obj.requestedBy = value; } }, metadata: _metadata }, _requestedBy_initializers, _requestedBy_extraInitializers);
        __esDecorate(null, null, _approvedBy_decorators, { kind: "field", name: "approvedBy", static: false, private: false, access: { has: obj => "approvedBy" in obj, get: obj => obj.approvedBy, set: (obj, value) => { obj.approvedBy = value; } }, metadata: _metadata }, _approvedBy_initializers, _approvedBy_extraInitializers);
        __esDecorate(null, null, _purchaseOrderNumber_decorators, { kind: "field", name: "purchaseOrderNumber", static: false, private: false, access: { has: obj => "purchaseOrderNumber" in obj, get: obj => obj.purchaseOrderNumber, set: (obj, value) => { obj.purchaseOrderNumber = value; } }, metadata: _metadata }, _purchaseOrderNumber_initializers, _purchaseOrderNumber_extraInitializers);
        __esDecorate(null, null, _vendorId_decorators, { kind: "field", name: "vendorId", static: false, private: false, access: { has: obj => "vendorId" in obj, get: obj => obj.vendorId, set: (obj, value) => { obj.vendorId = value; } }, metadata: _metadata }, _vendorId_initializers, _vendorId_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _transactions_decorators, { kind: "field", name: "transactions", static: false, private: false, access: { has: obj => "transactions" in obj, get: obj => obj.transactions, set: (obj, value) => { obj.transactions = value; } }, metadata: _metadata }, _transactions_initializers, _transactions_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MaterialRequisition = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MaterialRequisition = _classThis;
})();
exports.MaterialRequisition = MaterialRequisition;
//# sourceMappingURL=material-requisition.model.js.map