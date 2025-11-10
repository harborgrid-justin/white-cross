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
exports.ConstructionMaterial = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const swagger_1 = require("@nestjs/swagger");
const material_types_1 = require("../types/material.types");
const material_requisition_model_1 = require("./material-requisition.model");
const material_transaction_model_1 = require("./material-transaction.model");
let ConstructionMaterial = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'construction_materials',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['sku'], unique: true },
                { fields: ['category'] },
                { fields: ['status'] },
                { fields: ['vendorId'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _sku_decorators;
    let _sku_initializers = [];
    let _sku_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _category_decorators;
    let _category_initializers = [];
    let _category_extraInitializers = [];
    let _unitOfMeasure_decorators;
    let _unitOfMeasure_initializers = [];
    let _unitOfMeasure_extraInitializers = [];
    let _stockQuantity_decorators;
    let _stockQuantity_initializers = [];
    let _stockQuantity_extraInitializers = [];
    let _reorderPoint_decorators;
    let _reorderPoint_initializers = [];
    let _reorderPoint_extraInitializers = [];
    let _maxStockLevel_decorators;
    let _maxStockLevel_initializers = [];
    let _maxStockLevel_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _unitCost_decorators;
    let _unitCost_initializers = [];
    let _unitCost_extraInitializers = [];
    let _lastPurchasePrice_decorators;
    let _lastPurchasePrice_initializers = [];
    let _lastPurchasePrice_extraInitializers = [];
    let _averageCost_decorators;
    let _averageCost_initializers = [];
    let _averageCost_extraInitializers = [];
    let _vendorId_decorators;
    let _vendorId_initializers = [];
    let _vendorId_extraInitializers = [];
    let _vendorPartNumber_decorators;
    let _vendorPartNumber_initializers = [];
    let _vendorPartNumber_extraInitializers = [];
    let _manufacturer_decorators;
    let _manufacturer_initializers = [];
    let _manufacturer_extraInitializers = [];
    let _leadTimeDays_decorators;
    let _leadTimeDays_initializers = [];
    let _leadTimeDays_extraInitializers = [];
    let _storageLocation_decorators;
    let _storageLocation_initializers = [];
    let _storageLocation_extraInitializers = [];
    let _shelfLifeDays_decorators;
    let _shelfLifeDays_initializers = [];
    let _shelfLifeDays_extraInitializers = [];
    let _isHazardous_decorators;
    let _isHazardous_initializers = [];
    let _isHazardous_extraInitializers = [];
    let _sdsUrl_decorators;
    let _sdsUrl_initializers = [];
    let _sdsUrl_extraInitializers = [];
    let _requiredCertifications_decorators;
    let _requiredCertifications_initializers = [];
    let _requiredCertifications_extraInitializers = [];
    let _specifications_decorators;
    let _specifications_initializers = [];
    let _specifications_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
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
    let _requisitions_decorators;
    let _requisitions_initializers = [];
    let _requisitions_extraInitializers = [];
    let _transactions_decorators;
    let _transactions_initializers = [];
    let _transactions_extraInitializers = [];
    var ConstructionMaterial = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.sku = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _sku_initializers, void 0));
            this.name = (__runInitializers(this, _sku_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.category = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _category_initializers, void 0));
            this.unitOfMeasure = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _unitOfMeasure_initializers, void 0));
            this.stockQuantity = (__runInitializers(this, _unitOfMeasure_extraInitializers), __runInitializers(this, _stockQuantity_initializers, void 0));
            this.reorderPoint = (__runInitializers(this, _stockQuantity_extraInitializers), __runInitializers(this, _reorderPoint_initializers, void 0));
            this.maxStockLevel = (__runInitializers(this, _reorderPoint_extraInitializers), __runInitializers(this, _maxStockLevel_initializers, void 0));
            this.status = (__runInitializers(this, _maxStockLevel_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.unitCost = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _unitCost_initializers, void 0));
            this.lastPurchasePrice = (__runInitializers(this, _unitCost_extraInitializers), __runInitializers(this, _lastPurchasePrice_initializers, void 0));
            this.averageCost = (__runInitializers(this, _lastPurchasePrice_extraInitializers), __runInitializers(this, _averageCost_initializers, void 0));
            this.vendorId = (__runInitializers(this, _averageCost_extraInitializers), __runInitializers(this, _vendorId_initializers, void 0));
            this.vendorPartNumber = (__runInitializers(this, _vendorId_extraInitializers), __runInitializers(this, _vendorPartNumber_initializers, void 0));
            this.manufacturer = (__runInitializers(this, _vendorPartNumber_extraInitializers), __runInitializers(this, _manufacturer_initializers, void 0));
            this.leadTimeDays = (__runInitializers(this, _manufacturer_extraInitializers), __runInitializers(this, _leadTimeDays_initializers, void 0));
            this.storageLocation = (__runInitializers(this, _leadTimeDays_extraInitializers), __runInitializers(this, _storageLocation_initializers, void 0));
            this.shelfLifeDays = (__runInitializers(this, _storageLocation_extraInitializers), __runInitializers(this, _shelfLifeDays_initializers, void 0));
            this.isHazardous = (__runInitializers(this, _shelfLifeDays_extraInitializers), __runInitializers(this, _isHazardous_initializers, void 0));
            this.sdsUrl = (__runInitializers(this, _isHazardous_extraInitializers), __runInitializers(this, _sdsUrl_initializers, void 0));
            this.requiredCertifications = (__runInitializers(this, _sdsUrl_extraInitializers), __runInitializers(this, _requiredCertifications_initializers, void 0));
            this.specifications = (__runInitializers(this, _requiredCertifications_extraInitializers), __runInitializers(this, _specifications_initializers, void 0));
            this.notes = (__runInitializers(this, _specifications_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.isActive = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
            this.createdAt = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.requisitions = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _requisitions_initializers, void 0));
            this.transactions = (__runInitializers(this, _requisitions_extraInitializers), __runInitializers(this, _transactions_initializers, void 0));
            __runInitializers(this, _transactions_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ConstructionMaterial");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Unique material identifier',
                example: 'c5d6e7f8-9a0b-1c2d-3e4f-5a6b7c8d9e0f',
            }), sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _sku_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Material SKU/part number',
                example: 'CONC-MIX-3000',
            }), (0, sequelize_typescript_1.AllowNull)(false), Unique, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100))];
        _name_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Material name',
                example: 'Ready-Mix Concrete 3000 PSI',
            }), (0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(200))];
        _description_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Material description',
                example: 'High-strength ready-mix concrete, 3000 PSI compressive strength',
            }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _category_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Material category',
                enum: material_types_1.MaterialCategory,
                example: material_types_1.MaterialCategory.CONCRETE,
            }), (0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(material_types_1.MaterialCategory)),
            })];
        _unitOfMeasure_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Unit of measure',
                enum: material_types_1.UnitOfMeasure,
                example: material_types_1.UnitOfMeasure.CUBIC_YARD,
            }), (0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(material_types_1.UnitOfMeasure)),
            })];
        _stockQuantity_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Current stock quantity',
                example: 1250.5,
            }), (0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(15, 4))];
        _reorderPoint_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Minimum stock level for reorder',
                example: 500,
            }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(15, 4))];
        _maxStockLevel_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Maximum stock level',
                example: 3000,
            }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(15, 4))];
        _status_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Material status',
                enum: material_types_1.MaterialStatus,
                example: material_types_1.MaterialStatus.AVAILABLE,
            }), (0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(material_types_1.MaterialStatus.AVAILABLE), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(material_types_1.MaterialStatus)),
            })];
        _unitCost_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Unit cost',
                example: 125.50,
            }), (0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(15, 2))];
        _lastPurchasePrice_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Last purchase price',
                example: 120.00,
            }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(15, 2))];
        _averageCost_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Average cost (weighted)',
                example: 123.25,
            }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(15, 2))];
        _vendorId_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Primary vendor/supplier ID',
                example: 'VEND-123',
            }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _vendorPartNumber_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Vendor part number',
                example: 'SUPP-CONC-3K',
            }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100))];
        _manufacturer_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Manufacturer name',
                example: 'ABC Concrete Co.',
            }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(200))];
        _leadTimeDays_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Lead time in days',
                example: 7,
            }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _storageLocation_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Storage location',
                example: 'Warehouse A, Section 3, Aisle 5',
            }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(200))];
        _shelfLifeDays_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Shelf life in days (null = no expiration)',
                example: 365,
            }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _isHazardous_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Whether material is hazardous',
                example: false,
            }), (0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)];
        _sdsUrl_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Safety Data Sheet (SDS) URL',
                example: 'https://example.com/sds/concrete-mix-3000.pdf',
            }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(500))];
        _requiredCertifications_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Material certifications required',
                example: ['ASTM-C94', 'ISO-9001'],
            }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING))];
        _specifications_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Material specifications (JSON)',
                example: { psi: 3000, slump: '4-6 inches', airContent: '6%' },
            }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _notes_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Additional notes',
                example: 'Store in dry location, protect from freezing',
            }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _isActive_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Whether material is active',
                example: true,
            }), (0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(true), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        _requisitions_decorators = [(0, sequelize_typescript_1.HasMany)(() => material_requisition_model_1.MaterialRequisition)];
        _transactions_decorators = [(0, sequelize_typescript_1.HasMany)(() => material_transaction_model_1.MaterialTransaction)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _sku_decorators, { kind: "field", name: "sku", static: false, private: false, access: { has: obj => "sku" in obj, get: obj => obj.sku, set: (obj, value) => { obj.sku = value; } }, metadata: _metadata }, _sku_initializers, _sku_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: obj => "category" in obj, get: obj => obj.category, set: (obj, value) => { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
        __esDecorate(null, null, _unitOfMeasure_decorators, { kind: "field", name: "unitOfMeasure", static: false, private: false, access: { has: obj => "unitOfMeasure" in obj, get: obj => obj.unitOfMeasure, set: (obj, value) => { obj.unitOfMeasure = value; } }, metadata: _metadata }, _unitOfMeasure_initializers, _unitOfMeasure_extraInitializers);
        __esDecorate(null, null, _stockQuantity_decorators, { kind: "field", name: "stockQuantity", static: false, private: false, access: { has: obj => "stockQuantity" in obj, get: obj => obj.stockQuantity, set: (obj, value) => { obj.stockQuantity = value; } }, metadata: _metadata }, _stockQuantity_initializers, _stockQuantity_extraInitializers);
        __esDecorate(null, null, _reorderPoint_decorators, { kind: "field", name: "reorderPoint", static: false, private: false, access: { has: obj => "reorderPoint" in obj, get: obj => obj.reorderPoint, set: (obj, value) => { obj.reorderPoint = value; } }, metadata: _metadata }, _reorderPoint_initializers, _reorderPoint_extraInitializers);
        __esDecorate(null, null, _maxStockLevel_decorators, { kind: "field", name: "maxStockLevel", static: false, private: false, access: { has: obj => "maxStockLevel" in obj, get: obj => obj.maxStockLevel, set: (obj, value) => { obj.maxStockLevel = value; } }, metadata: _metadata }, _maxStockLevel_initializers, _maxStockLevel_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _unitCost_decorators, { kind: "field", name: "unitCost", static: false, private: false, access: { has: obj => "unitCost" in obj, get: obj => obj.unitCost, set: (obj, value) => { obj.unitCost = value; } }, metadata: _metadata }, _unitCost_initializers, _unitCost_extraInitializers);
        __esDecorate(null, null, _lastPurchasePrice_decorators, { kind: "field", name: "lastPurchasePrice", static: false, private: false, access: { has: obj => "lastPurchasePrice" in obj, get: obj => obj.lastPurchasePrice, set: (obj, value) => { obj.lastPurchasePrice = value; } }, metadata: _metadata }, _lastPurchasePrice_initializers, _lastPurchasePrice_extraInitializers);
        __esDecorate(null, null, _averageCost_decorators, { kind: "field", name: "averageCost", static: false, private: false, access: { has: obj => "averageCost" in obj, get: obj => obj.averageCost, set: (obj, value) => { obj.averageCost = value; } }, metadata: _metadata }, _averageCost_initializers, _averageCost_extraInitializers);
        __esDecorate(null, null, _vendorId_decorators, { kind: "field", name: "vendorId", static: false, private: false, access: { has: obj => "vendorId" in obj, get: obj => obj.vendorId, set: (obj, value) => { obj.vendorId = value; } }, metadata: _metadata }, _vendorId_initializers, _vendorId_extraInitializers);
        __esDecorate(null, null, _vendorPartNumber_decorators, { kind: "field", name: "vendorPartNumber", static: false, private: false, access: { has: obj => "vendorPartNumber" in obj, get: obj => obj.vendorPartNumber, set: (obj, value) => { obj.vendorPartNumber = value; } }, metadata: _metadata }, _vendorPartNumber_initializers, _vendorPartNumber_extraInitializers);
        __esDecorate(null, null, _manufacturer_decorators, { kind: "field", name: "manufacturer", static: false, private: false, access: { has: obj => "manufacturer" in obj, get: obj => obj.manufacturer, set: (obj, value) => { obj.manufacturer = value; } }, metadata: _metadata }, _manufacturer_initializers, _manufacturer_extraInitializers);
        __esDecorate(null, null, _leadTimeDays_decorators, { kind: "field", name: "leadTimeDays", static: false, private: false, access: { has: obj => "leadTimeDays" in obj, get: obj => obj.leadTimeDays, set: (obj, value) => { obj.leadTimeDays = value; } }, metadata: _metadata }, _leadTimeDays_initializers, _leadTimeDays_extraInitializers);
        __esDecorate(null, null, _storageLocation_decorators, { kind: "field", name: "storageLocation", static: false, private: false, access: { has: obj => "storageLocation" in obj, get: obj => obj.storageLocation, set: (obj, value) => { obj.storageLocation = value; } }, metadata: _metadata }, _storageLocation_initializers, _storageLocation_extraInitializers);
        __esDecorate(null, null, _shelfLifeDays_decorators, { kind: "field", name: "shelfLifeDays", static: false, private: false, access: { has: obj => "shelfLifeDays" in obj, get: obj => obj.shelfLifeDays, set: (obj, value) => { obj.shelfLifeDays = value; } }, metadata: _metadata }, _shelfLifeDays_initializers, _shelfLifeDays_extraInitializers);
        __esDecorate(null, null, _isHazardous_decorators, { kind: "field", name: "isHazardous", static: false, private: false, access: { has: obj => "isHazardous" in obj, get: obj => obj.isHazardous, set: (obj, value) => { obj.isHazardous = value; } }, metadata: _metadata }, _isHazardous_initializers, _isHazardous_extraInitializers);
        __esDecorate(null, null, _sdsUrl_decorators, { kind: "field", name: "sdsUrl", static: false, private: false, access: { has: obj => "sdsUrl" in obj, get: obj => obj.sdsUrl, set: (obj, value) => { obj.sdsUrl = value; } }, metadata: _metadata }, _sdsUrl_initializers, _sdsUrl_extraInitializers);
        __esDecorate(null, null, _requiredCertifications_decorators, { kind: "field", name: "requiredCertifications", static: false, private: false, access: { has: obj => "requiredCertifications" in obj, get: obj => obj.requiredCertifications, set: (obj, value) => { obj.requiredCertifications = value; } }, metadata: _metadata }, _requiredCertifications_initializers, _requiredCertifications_extraInitializers);
        __esDecorate(null, null, _specifications_decorators, { kind: "field", name: "specifications", static: false, private: false, access: { has: obj => "specifications" in obj, get: obj => obj.specifications, set: (obj, value) => { obj.specifications = value; } }, metadata: _metadata }, _specifications_initializers, _specifications_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: obj => "isActive" in obj, get: obj => obj.isActive, set: (obj, value) => { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _requisitions_decorators, { kind: "field", name: "requisitions", static: false, private: false, access: { has: obj => "requisitions" in obj, get: obj => obj.requisitions, set: (obj, value) => { obj.requisitions = value; } }, metadata: _metadata }, _requisitions_initializers, _requisitions_extraInitializers);
        __esDecorate(null, null, _transactions_decorators, { kind: "field", name: "transactions", static: false, private: false, access: { has: obj => "transactions" in obj, get: obj => obj.transactions, set: (obj, value) => { obj.transactions = value; } }, metadata: _metadata }, _transactions_initializers, _transactions_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ConstructionMaterial = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ConstructionMaterial = _classThis;
})();
exports.ConstructionMaterial = ConstructionMaterial;
//# sourceMappingURL=construction-material.model.js.map