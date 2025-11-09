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
exports.MaterialTransaction = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const swagger_1 = require("@nestjs/swagger");
const material_types_1 = require("../types/material.types");
const construction_material_model_1 = require("./construction-material.model");
const material_requisition_model_1 = require("./material-requisition.model");
let MaterialTransaction = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'material_transactions',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['materialId'] },
                { fields: ['projectId'] },
                { fields: ['transactionType'] },
                { fields: ['transactionDate'] },
                { fields: ['requisitionId'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _transactionNumber_decorators;
    let _transactionNumber_initializers = [];
    let _transactionNumber_extraInitializers = [];
    let _materialId_decorators;
    let _materialId_initializers = [];
    let _materialId_extraInitializers = [];
    let _material_decorators;
    let _material_initializers = [];
    let _material_extraInitializers = [];
    let _requisitionId_decorators;
    let _requisitionId_initializers = [];
    let _requisitionId_extraInitializers = [];
    let _requisition_decorators;
    let _requisition_initializers = [];
    let _requisition_extraInitializers = [];
    let _transactionType_decorators;
    let _transactionType_initializers = [];
    let _transactionType_extraInitializers = [];
    let _transactionDate_decorators;
    let _transactionDate_initializers = [];
    let _transactionDate_extraInitializers = [];
    let _quantity_decorators;
    let _quantity_initializers = [];
    let _quantity_extraInitializers = [];
    let _unitCost_decorators;
    let _unitCost_initializers = [];
    let _unitCost_extraInitializers = [];
    let _totalCost_decorators;
    let _totalCost_initializers = [];
    let _totalCost_extraInitializers = [];
    let _projectId_decorators;
    let _projectId_initializers = [];
    let _projectId_extraInitializers = [];
    let _fromLocation_decorators;
    let _fromLocation_initializers = [];
    let _fromLocation_extraInitializers = [];
    let _toLocation_decorators;
    let _toLocation_initializers = [];
    let _toLocation_extraInitializers = [];
    let _wasteReason_decorators;
    let _wasteReason_initializers = [];
    let _wasteReason_extraInitializers = [];
    let _inspectionStatus_decorators;
    let _inspectionStatus_initializers = [];
    let _inspectionStatus_extraInitializers = [];
    let _inspectorName_decorators;
    let _inspectorName_initializers = [];
    let _inspectorName_extraInitializers = [];
    let _inspectionNotes_decorators;
    let _inspectionNotes_initializers = [];
    let _inspectionNotes_extraInitializers = [];
    let _handledBy_decorators;
    let _handledBy_initializers = [];
    let _handledBy_extraInitializers = [];
    let _receiptNumber_decorators;
    let _receiptNumber_initializers = [];
    let _receiptNumber_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _certificationDocuments_decorators;
    let _certificationDocuments_initializers = [];
    let _certificationDocuments_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var MaterialTransaction = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.transactionNumber = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _transactionNumber_initializers, void 0));
            this.materialId = (__runInitializers(this, _transactionNumber_extraInitializers), __runInitializers(this, _materialId_initializers, void 0));
            this.material = (__runInitializers(this, _materialId_extraInitializers), __runInitializers(this, _material_initializers, void 0));
            this.requisitionId = (__runInitializers(this, _material_extraInitializers), __runInitializers(this, _requisitionId_initializers, void 0));
            this.requisition = (__runInitializers(this, _requisitionId_extraInitializers), __runInitializers(this, _requisition_initializers, void 0));
            this.transactionType = (__runInitializers(this, _requisition_extraInitializers), __runInitializers(this, _transactionType_initializers, void 0));
            this.transactionDate = (__runInitializers(this, _transactionType_extraInitializers), __runInitializers(this, _transactionDate_initializers, void 0));
            this.quantity = (__runInitializers(this, _transactionDate_extraInitializers), __runInitializers(this, _quantity_initializers, void 0));
            this.unitCost = (__runInitializers(this, _quantity_extraInitializers), __runInitializers(this, _unitCost_initializers, void 0));
            this.totalCost = (__runInitializers(this, _unitCost_extraInitializers), __runInitializers(this, _totalCost_initializers, void 0));
            this.projectId = (__runInitializers(this, _totalCost_extraInitializers), __runInitializers(this, _projectId_initializers, void 0));
            this.fromLocation = (__runInitializers(this, _projectId_extraInitializers), __runInitializers(this, _fromLocation_initializers, void 0));
            this.toLocation = (__runInitializers(this, _fromLocation_extraInitializers), __runInitializers(this, _toLocation_initializers, void 0));
            this.wasteReason = (__runInitializers(this, _toLocation_extraInitializers), __runInitializers(this, _wasteReason_initializers, void 0));
            this.inspectionStatus = (__runInitializers(this, _wasteReason_extraInitializers), __runInitializers(this, _inspectionStatus_initializers, void 0));
            this.inspectorName = (__runInitializers(this, _inspectionStatus_extraInitializers), __runInitializers(this, _inspectorName_initializers, void 0));
            this.inspectionNotes = (__runInitializers(this, _inspectorName_extraInitializers), __runInitializers(this, _inspectionNotes_initializers, void 0));
            this.handledBy = (__runInitializers(this, _inspectionNotes_extraInitializers), __runInitializers(this, _handledBy_initializers, void 0));
            this.receiptNumber = (__runInitializers(this, _handledBy_extraInitializers), __runInitializers(this, _receiptNumber_initializers, void 0));
            this.notes = (__runInitializers(this, _receiptNumber_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.certificationDocuments = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _certificationDocuments_initializers, void 0));
            this.createdAt = (__runInitializers(this, _certificationDocuments_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "MaterialTransaction");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Unique transaction identifier',
                example: 'f1e2d3c4-b5a6-9876-5432-1098fedcba98',
            }), sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _transactionNumber_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Transaction number',
                example: 'TXN-2024-001234',
            }), (0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _materialId_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Material ID',
                example: 'c5d6e7f8-9a0b-1c2d-3e4f-5a6b7c8d9e0f',
            }), (0, sequelize_typescript_1.ForeignKey)(() => construction_material_model_1.ConstructionMaterial), (0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _material_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => construction_material_model_1.ConstructionMaterial)];
        _requisitionId_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Related requisition ID',
                example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
            }), (0, sequelize_typescript_1.ForeignKey)(() => material_requisition_model_1.MaterialRequisition), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _requisition_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => material_requisition_model_1.MaterialRequisition)];
        _transactionType_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Transaction type',
                example: 'receipt',
            }), (0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM('receipt', 'issue', 'transfer', 'adjustment', 'waste', 'return'))];
        _transactionDate_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Transaction date',
                example: '2024-11-15T14:30:00Z',
            }), (0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _quantity_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Quantity (positive for receipts, negative for issues)',
                example: 500,
            }), (0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(15, 4))];
        _unitCost_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Unit cost at time of transaction',
                example: 125.50,
            }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(15, 2))];
        _totalCost_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Total cost',
                example: 62750.00,
            }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(15, 2))];
        _projectId_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Project ID (for issues, transfers, waste)',
                example: 'PROJ-2024-045',
            }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _fromLocation_decorators = [(0, swagger_1.ApiProperty)({
                description: 'From location (for transfers)',
                example: 'Warehouse A',
            }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(200))];
        _toLocation_decorators = [(0, swagger_1.ApiProperty)({
                description: 'To location (for transfers)',
                example: 'Job Site - 123 Main St',
            }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(200))];
        _wasteReason_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Waste reason (if transaction_type = waste)',
                enum: material_types_1.WasteReason,
                example: material_types_1.WasteReason.SPILLAGE,
            }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(material_types_1.WasteReason)),
            })];
        _inspectionStatus_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Quality inspection status',
                enum: material_types_1.InspectionStatus,
                example: material_types_1.InspectionStatus.PASSED,
            }), (0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(material_types_1.InspectionStatus.NOT_REQUIRED), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(material_types_1.InspectionStatus)),
            })];
        _inspectorName_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Inspector name',
                example: 'Jane Doe',
            }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100))];
        _inspectionNotes_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Inspection notes',
                example: 'All materials meet specifications, minor cosmetic damage to packaging',
            }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _handledBy_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Received by / issued by user ID',
                example: 'USR-456',
            }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _receiptNumber_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Delivery receipt / ticket number',
                example: 'DR-2024-9876',
            }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _notes_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Transaction notes',
                example: 'Partial delivery, balance to follow next week',
            }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _certificationDocuments_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Certification documents',
                example: ['cert-001.pdf', 'test-report-002.pdf'],
            }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING))];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _transactionNumber_decorators, { kind: "field", name: "transactionNumber", static: false, private: false, access: { has: obj => "transactionNumber" in obj, get: obj => obj.transactionNumber, set: (obj, value) => { obj.transactionNumber = value; } }, metadata: _metadata }, _transactionNumber_initializers, _transactionNumber_extraInitializers);
        __esDecorate(null, null, _materialId_decorators, { kind: "field", name: "materialId", static: false, private: false, access: { has: obj => "materialId" in obj, get: obj => obj.materialId, set: (obj, value) => { obj.materialId = value; } }, metadata: _metadata }, _materialId_initializers, _materialId_extraInitializers);
        __esDecorate(null, null, _material_decorators, { kind: "field", name: "material", static: false, private: false, access: { has: obj => "material" in obj, get: obj => obj.material, set: (obj, value) => { obj.material = value; } }, metadata: _metadata }, _material_initializers, _material_extraInitializers);
        __esDecorate(null, null, _requisitionId_decorators, { kind: "field", name: "requisitionId", static: false, private: false, access: { has: obj => "requisitionId" in obj, get: obj => obj.requisitionId, set: (obj, value) => { obj.requisitionId = value; } }, metadata: _metadata }, _requisitionId_initializers, _requisitionId_extraInitializers);
        __esDecorate(null, null, _requisition_decorators, { kind: "field", name: "requisition", static: false, private: false, access: { has: obj => "requisition" in obj, get: obj => obj.requisition, set: (obj, value) => { obj.requisition = value; } }, metadata: _metadata }, _requisition_initializers, _requisition_extraInitializers);
        __esDecorate(null, null, _transactionType_decorators, { kind: "field", name: "transactionType", static: false, private: false, access: { has: obj => "transactionType" in obj, get: obj => obj.transactionType, set: (obj, value) => { obj.transactionType = value; } }, metadata: _metadata }, _transactionType_initializers, _transactionType_extraInitializers);
        __esDecorate(null, null, _transactionDate_decorators, { kind: "field", name: "transactionDate", static: false, private: false, access: { has: obj => "transactionDate" in obj, get: obj => obj.transactionDate, set: (obj, value) => { obj.transactionDate = value; } }, metadata: _metadata }, _transactionDate_initializers, _transactionDate_extraInitializers);
        __esDecorate(null, null, _quantity_decorators, { kind: "field", name: "quantity", static: false, private: false, access: { has: obj => "quantity" in obj, get: obj => obj.quantity, set: (obj, value) => { obj.quantity = value; } }, metadata: _metadata }, _quantity_initializers, _quantity_extraInitializers);
        __esDecorate(null, null, _unitCost_decorators, { kind: "field", name: "unitCost", static: false, private: false, access: { has: obj => "unitCost" in obj, get: obj => obj.unitCost, set: (obj, value) => { obj.unitCost = value; } }, metadata: _metadata }, _unitCost_initializers, _unitCost_extraInitializers);
        __esDecorate(null, null, _totalCost_decorators, { kind: "field", name: "totalCost", static: false, private: false, access: { has: obj => "totalCost" in obj, get: obj => obj.totalCost, set: (obj, value) => { obj.totalCost = value; } }, metadata: _metadata }, _totalCost_initializers, _totalCost_extraInitializers);
        __esDecorate(null, null, _projectId_decorators, { kind: "field", name: "projectId", static: false, private: false, access: { has: obj => "projectId" in obj, get: obj => obj.projectId, set: (obj, value) => { obj.projectId = value; } }, metadata: _metadata }, _projectId_initializers, _projectId_extraInitializers);
        __esDecorate(null, null, _fromLocation_decorators, { kind: "field", name: "fromLocation", static: false, private: false, access: { has: obj => "fromLocation" in obj, get: obj => obj.fromLocation, set: (obj, value) => { obj.fromLocation = value; } }, metadata: _metadata }, _fromLocation_initializers, _fromLocation_extraInitializers);
        __esDecorate(null, null, _toLocation_decorators, { kind: "field", name: "toLocation", static: false, private: false, access: { has: obj => "toLocation" in obj, get: obj => obj.toLocation, set: (obj, value) => { obj.toLocation = value; } }, metadata: _metadata }, _toLocation_initializers, _toLocation_extraInitializers);
        __esDecorate(null, null, _wasteReason_decorators, { kind: "field", name: "wasteReason", static: false, private: false, access: { has: obj => "wasteReason" in obj, get: obj => obj.wasteReason, set: (obj, value) => { obj.wasteReason = value; } }, metadata: _metadata }, _wasteReason_initializers, _wasteReason_extraInitializers);
        __esDecorate(null, null, _inspectionStatus_decorators, { kind: "field", name: "inspectionStatus", static: false, private: false, access: { has: obj => "inspectionStatus" in obj, get: obj => obj.inspectionStatus, set: (obj, value) => { obj.inspectionStatus = value; } }, metadata: _metadata }, _inspectionStatus_initializers, _inspectionStatus_extraInitializers);
        __esDecorate(null, null, _inspectorName_decorators, { kind: "field", name: "inspectorName", static: false, private: false, access: { has: obj => "inspectorName" in obj, get: obj => obj.inspectorName, set: (obj, value) => { obj.inspectorName = value; } }, metadata: _metadata }, _inspectorName_initializers, _inspectorName_extraInitializers);
        __esDecorate(null, null, _inspectionNotes_decorators, { kind: "field", name: "inspectionNotes", static: false, private: false, access: { has: obj => "inspectionNotes" in obj, get: obj => obj.inspectionNotes, set: (obj, value) => { obj.inspectionNotes = value; } }, metadata: _metadata }, _inspectionNotes_initializers, _inspectionNotes_extraInitializers);
        __esDecorate(null, null, _handledBy_decorators, { kind: "field", name: "handledBy", static: false, private: false, access: { has: obj => "handledBy" in obj, get: obj => obj.handledBy, set: (obj, value) => { obj.handledBy = value; } }, metadata: _metadata }, _handledBy_initializers, _handledBy_extraInitializers);
        __esDecorate(null, null, _receiptNumber_decorators, { kind: "field", name: "receiptNumber", static: false, private: false, access: { has: obj => "receiptNumber" in obj, get: obj => obj.receiptNumber, set: (obj, value) => { obj.receiptNumber = value; } }, metadata: _metadata }, _receiptNumber_initializers, _receiptNumber_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _certificationDocuments_decorators, { kind: "field", name: "certificationDocuments", static: false, private: false, access: { has: obj => "certificationDocuments" in obj, get: obj => obj.certificationDocuments, set: (obj, value) => { obj.certificationDocuments = value; } }, metadata: _metadata }, _certificationDocuments_initializers, _certificationDocuments_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MaterialTransaction = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MaterialTransaction = _classThis;
})();
exports.MaterialTransaction = MaterialTransaction;
//# sourceMappingURL=material-transaction.model.js.map