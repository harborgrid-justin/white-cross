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
exports.ConstructionEquipment = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const swagger_1 = require("@nestjs/swagger");
const equipment_types_1 = require("../types/equipment.types");
const equipment_maintenance_record_model_1 = require("./equipment-maintenance-record.model");
const equipment_allocation_model_1 = require("./equipment-allocation.model");
let ConstructionEquipment = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'construction_equipment',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['equipmentNumber'], unique: true },
                { fields: ['category'] },
                { fields: ['status'] },
                { fields: ['ownershipType'] },
                { fields: ['currentLocation'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _equipmentNumber_decorators;
    let _equipmentNumber_initializers = [];
    let _equipmentNumber_extraInitializers = [];
    let _category_decorators;
    let _category_initializers = [];
    let _category_extraInitializers = [];
    let _make_decorators;
    let _make_initializers = [];
    let _make_extraInitializers = [];
    let _model_decorators;
    let _model_initializers = [];
    let _model_extraInitializers = [];
    let _year_decorators;
    let _year_initializers = [];
    let _year_extraInitializers = [];
    let _serialNumber_decorators;
    let _serialNumber_initializers = [];
    let _serialNumber_extraInitializers = [];
    let _vin_decorators;
    let _vin_initializers = [];
    let _vin_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _conditionRating_decorators;
    let _conditionRating_initializers = [];
    let _conditionRating_extraInitializers = [];
    let _ownershipType_decorators;
    let _ownershipType_initializers = [];
    let _ownershipType_extraInitializers = [];
    let _purchasePrice_decorators;
    let _purchasePrice_initializers = [];
    let _purchasePrice_extraInitializers = [];
    let _currentValue_decorators;
    let _currentValue_initializers = [];
    let _currentValue_extraInitializers = [];
    let _acquisitionDate_decorators;
    let _acquisitionDate_initializers = [];
    let _acquisitionDate_extraInitializers = [];
    let _currentLocation_decorators;
    let _currentLocation_initializers = [];
    let _currentLocation_extraInitializers = [];
    let _gpsCoordinates_decorators;
    let _gpsCoordinates_initializers = [];
    let _gpsCoordinates_extraInitializers = [];
    let _operatingHours_decorators;
    let _operatingHours_initializers = [];
    let _operatingHours_extraInitializers = [];
    let _odometer_decorators;
    let _odometer_initializers = [];
    let _odometer_extraInitializers = [];
    let _fuelCapacity_decorators;
    let _fuelCapacity_initializers = [];
    let _fuelCapacity_extraInitializers = [];
    let _fuelLevel_decorators;
    let _fuelLevel_initializers = [];
    let _fuelLevel_extraInitializers = [];
    let _nextMaintenanceDate_decorators;
    let _nextMaintenanceDate_initializers = [];
    let _nextMaintenanceDate_extraInitializers = [];
    let _lastMaintenanceDate_decorators;
    let _lastMaintenanceDate_initializers = [];
    let _lastMaintenanceDate_extraInitializers = [];
    let _warrantyExpiration_decorators;
    let _warrantyExpiration_initializers = [];
    let _warrantyExpiration_extraInitializers = [];
    let _insuranceExpiration_decorators;
    let _insuranceExpiration_initializers = [];
    let _insuranceExpiration_extraInitializers = [];
    let _certifications_decorators;
    let _certifications_initializers = [];
    let _certifications_extraInitializers = [];
    let _assignedOperatorId_decorators;
    let _assignedOperatorId_initializers = [];
    let _assignedOperatorId_extraInitializers = [];
    let _assignedProjectId_decorators;
    let _assignedProjectId_initializers = [];
    let _assignedProjectId_extraInitializers = [];
    let _dailyRentalRate_decorators;
    let _dailyRentalRate_initializers = [];
    let _dailyRentalRate_extraInitializers = [];
    let _monthlyRentalRate_decorators;
    let _monthlyRentalRate_initializers = [];
    let _monthlyRentalRate_extraInitializers = [];
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
    let _maintenanceRecords_decorators;
    let _maintenanceRecords_initializers = [];
    let _maintenanceRecords_extraInitializers = [];
    let _allocations_decorators;
    let _allocations_initializers = [];
    let _allocations_extraInitializers = [];
    var ConstructionEquipment = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.equipmentNumber = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _equipmentNumber_initializers, void 0));
            this.category = (__runInitializers(this, _equipmentNumber_extraInitializers), __runInitializers(this, _category_initializers, void 0));
            this.make = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _make_initializers, void 0));
            this.model = (__runInitializers(this, _make_extraInitializers), __runInitializers(this, _model_initializers, void 0));
            this.year = (__runInitializers(this, _model_extraInitializers), __runInitializers(this, _year_initializers, void 0));
            this.serialNumber = (__runInitializers(this, _year_extraInitializers), __runInitializers(this, _serialNumber_initializers, void 0));
            this.vin = (__runInitializers(this, _serialNumber_extraInitializers), __runInitializers(this, _vin_initializers, void 0));
            this.status = (__runInitializers(this, _vin_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.conditionRating = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _conditionRating_initializers, void 0));
            this.ownershipType = (__runInitializers(this, _conditionRating_extraInitializers), __runInitializers(this, _ownershipType_initializers, void 0));
            this.purchasePrice = (__runInitializers(this, _ownershipType_extraInitializers), __runInitializers(this, _purchasePrice_initializers, void 0));
            this.currentValue = (__runInitializers(this, _purchasePrice_extraInitializers), __runInitializers(this, _currentValue_initializers, void 0));
            this.acquisitionDate = (__runInitializers(this, _currentValue_extraInitializers), __runInitializers(this, _acquisitionDate_initializers, void 0));
            this.currentLocation = (__runInitializers(this, _acquisitionDate_extraInitializers), __runInitializers(this, _currentLocation_initializers, void 0));
            this.gpsCoordinates = (__runInitializers(this, _currentLocation_extraInitializers), __runInitializers(this, _gpsCoordinates_initializers, void 0));
            this.operatingHours = (__runInitializers(this, _gpsCoordinates_extraInitializers), __runInitializers(this, _operatingHours_initializers, void 0));
            this.odometer = (__runInitializers(this, _operatingHours_extraInitializers), __runInitializers(this, _odometer_initializers, void 0));
            this.fuelCapacity = (__runInitializers(this, _odometer_extraInitializers), __runInitializers(this, _fuelCapacity_initializers, void 0));
            this.fuelLevel = (__runInitializers(this, _fuelCapacity_extraInitializers), __runInitializers(this, _fuelLevel_initializers, void 0));
            this.nextMaintenanceDate = (__runInitializers(this, _fuelLevel_extraInitializers), __runInitializers(this, _nextMaintenanceDate_initializers, void 0));
            this.lastMaintenanceDate = (__runInitializers(this, _nextMaintenanceDate_extraInitializers), __runInitializers(this, _lastMaintenanceDate_initializers, void 0));
            this.warrantyExpiration = (__runInitializers(this, _lastMaintenanceDate_extraInitializers), __runInitializers(this, _warrantyExpiration_initializers, void 0));
            this.insuranceExpiration = (__runInitializers(this, _warrantyExpiration_extraInitializers), __runInitializers(this, _insuranceExpiration_initializers, void 0));
            this.certifications = (__runInitializers(this, _insuranceExpiration_extraInitializers), __runInitializers(this, _certifications_initializers, void 0));
            this.assignedOperatorId = (__runInitializers(this, _certifications_extraInitializers), __runInitializers(this, _assignedOperatorId_initializers, void 0));
            this.assignedProjectId = (__runInitializers(this, _assignedOperatorId_extraInitializers), __runInitializers(this, _assignedProjectId_initializers, void 0));
            this.dailyRentalRate = (__runInitializers(this, _assignedProjectId_extraInitializers), __runInitializers(this, _dailyRentalRate_initializers, void 0));
            this.monthlyRentalRate = (__runInitializers(this, _dailyRentalRate_extraInitializers), __runInitializers(this, _monthlyRentalRate_initializers, void 0));
            this.specifications = (__runInitializers(this, _monthlyRentalRate_extraInitializers), __runInitializers(this, _specifications_initializers, void 0));
            this.notes = (__runInitializers(this, _specifications_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.isActive = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
            this.createdAt = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.maintenanceRecords = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _maintenanceRecords_initializers, void 0));
            this.allocations = (__runInitializers(this, _maintenanceRecords_extraInitializers), __runInitializers(this, _allocations_initializers, void 0));
            __runInitializers(this, _allocations_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ConstructionEquipment");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Unique equipment identifier',
                example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
            }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _equipmentNumber_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Equipment number/tag',
                example: 'EXC-2024-001',
            }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50), allowNull: false, unique: true }), sequelize_typescript_1.Index];
        _category_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Equipment category',
                enum: equipment_types_1.EquipmentCategory,
                example: equipment_types_1.EquipmentCategory.EXCAVATOR,
            }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(equipment_types_1.EquipmentCategory)),
                allowNull: false,
            }), sequelize_typescript_1.Index];
        _make_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Equipment manufacturer',
                example: 'Caterpillar',
            }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100), allowNull: false })];
        _model_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Equipment model',
                example: '320',
            }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100), allowNull: false })];
        _year_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Manufacturing year',
                example: 2024,
            }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER })];
        _serialNumber_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Serial number',
                example: 'CAT320-2024-SN123456',
            }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100) })];
        _vin_decorators = [(0, swagger_1.ApiProperty)({
                description: 'VIN or identification number',
                example: '1HGBH41JXMN109186',
            }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100) })];
        _status_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Equipment operational status',
                enum: equipment_types_1.EquipmentStatus,
                example: equipment_types_1.EquipmentStatus.AVAILABLE,
            }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(equipment_types_1.EquipmentStatus)),
                defaultValue: equipment_types_1.EquipmentStatus.AVAILABLE,
            }), sequelize_typescript_1.Index];
        _conditionRating_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Equipment condition rating',
                enum: equipment_types_1.ConditionRating,
                example: equipment_types_1.ConditionRating.EXCELLENT,
            }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(equipment_types_1.ConditionRating)) })];
        _ownershipType_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Ownership type',
                enum: equipment_types_1.OwnershipType,
                example: equipment_types_1.OwnershipType.OWNED,
            }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(equipment_types_1.OwnershipType)),
                allowNull: false,
            }), sequelize_typescript_1.Index];
        _purchasePrice_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Purchase or lease price',
                example: 350000,
            }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(15, 2) })];
        _currentValue_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Current book value',
                example: 315000,
            }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(15, 2) })];
        _acquisitionDate_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Acquisition date',
                example: '2024-01-15T00:00:00Z',
            }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _currentLocation_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Current storage or project location',
                example: 'Warehouse-A, Bay 5',
            }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200) }), sequelize_typescript_1.Index];
        _gpsCoordinates_decorators = [(0, swagger_1.ApiProperty)({
                description: 'GPS coordinates (latitude, longitude)',
                example: { lat: 40.7128, lng: -74.006 },
            }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _operatingHours_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Total operating hours',
                example: 1250.5,
            }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 2), defaultValue: 0 })];
        _odometer_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Current odometer reading (for vehicles)',
                example: 45678,
            }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER })];
        _fuelCapacity_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Fuel capacity in gallons',
                example: 100,
            }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 2) })];
        _fuelLevel_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Current fuel level percentage',
                example: 75,
            }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(5, 2) })];
        _nextMaintenanceDate_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Next scheduled maintenance date',
                example: '2024-12-15T00:00:00Z',
            }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _lastMaintenanceDate_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Last maintenance date',
                example: '2024-11-01T00:00:00Z',
            }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _warrantyExpiration_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Warranty expiration date',
                example: '2027-01-15T00:00:00Z',
            }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _insuranceExpiration_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Insurance expiration date',
                example: '2025-06-30T00:00:00Z',
            }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _certifications_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Required certifications',
                example: ['OSHA-CRANE', 'DOT-INSPECTION'],
            }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING) })];
        _assignedOperatorId_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Currently assigned operator ID',
                example: 'OP-123',
            }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50) })];
        _assignedProjectId_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Currently assigned project ID',
                example: 'PROJ-2024-045',
            }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50) })];
        _dailyRentalRate_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Daily rental rate',
                example: 750,
            }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 2) })];
        _monthlyRentalRate_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Monthly rental rate',
                example: 18000,
            }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 2) })];
        _specifications_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Equipment specifications (JSON)',
                example: {
                    capacity: '20 tons',
                    reach: '30 feet',
                    bucketSize: '1.5 cubic yards',
                },
            }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _notes_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Additional notes',
                example: 'Requires specialized operator certification',
            }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _isActive_decorators = [(0, swagger_1.ApiProperty)({
                description: 'Whether equipment is active',
                example: true,
            }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: true })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        _maintenanceRecords_decorators = [(0, sequelize_typescript_1.HasMany)(() => equipment_maintenance_record_model_1.EquipmentMaintenanceRecord)];
        _allocations_decorators = [(0, sequelize_typescript_1.HasMany)(() => equipment_allocation_model_1.EquipmentAllocation)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _equipmentNumber_decorators, { kind: "field", name: "equipmentNumber", static: false, private: false, access: { has: obj => "equipmentNumber" in obj, get: obj => obj.equipmentNumber, set: (obj, value) => { obj.equipmentNumber = value; } }, metadata: _metadata }, _equipmentNumber_initializers, _equipmentNumber_extraInitializers);
        __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: obj => "category" in obj, get: obj => obj.category, set: (obj, value) => { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
        __esDecorate(null, null, _make_decorators, { kind: "field", name: "make", static: false, private: false, access: { has: obj => "make" in obj, get: obj => obj.make, set: (obj, value) => { obj.make = value; } }, metadata: _metadata }, _make_initializers, _make_extraInitializers);
        __esDecorate(null, null, _model_decorators, { kind: "field", name: "model", static: false, private: false, access: { has: obj => "model" in obj, get: obj => obj.model, set: (obj, value) => { obj.model = value; } }, metadata: _metadata }, _model_initializers, _model_extraInitializers);
        __esDecorate(null, null, _year_decorators, { kind: "field", name: "year", static: false, private: false, access: { has: obj => "year" in obj, get: obj => obj.year, set: (obj, value) => { obj.year = value; } }, metadata: _metadata }, _year_initializers, _year_extraInitializers);
        __esDecorate(null, null, _serialNumber_decorators, { kind: "field", name: "serialNumber", static: false, private: false, access: { has: obj => "serialNumber" in obj, get: obj => obj.serialNumber, set: (obj, value) => { obj.serialNumber = value; } }, metadata: _metadata }, _serialNumber_initializers, _serialNumber_extraInitializers);
        __esDecorate(null, null, _vin_decorators, { kind: "field", name: "vin", static: false, private: false, access: { has: obj => "vin" in obj, get: obj => obj.vin, set: (obj, value) => { obj.vin = value; } }, metadata: _metadata }, _vin_initializers, _vin_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _conditionRating_decorators, { kind: "field", name: "conditionRating", static: false, private: false, access: { has: obj => "conditionRating" in obj, get: obj => obj.conditionRating, set: (obj, value) => { obj.conditionRating = value; } }, metadata: _metadata }, _conditionRating_initializers, _conditionRating_extraInitializers);
        __esDecorate(null, null, _ownershipType_decorators, { kind: "field", name: "ownershipType", static: false, private: false, access: { has: obj => "ownershipType" in obj, get: obj => obj.ownershipType, set: (obj, value) => { obj.ownershipType = value; } }, metadata: _metadata }, _ownershipType_initializers, _ownershipType_extraInitializers);
        __esDecorate(null, null, _purchasePrice_decorators, { kind: "field", name: "purchasePrice", static: false, private: false, access: { has: obj => "purchasePrice" in obj, get: obj => obj.purchasePrice, set: (obj, value) => { obj.purchasePrice = value; } }, metadata: _metadata }, _purchasePrice_initializers, _purchasePrice_extraInitializers);
        __esDecorate(null, null, _currentValue_decorators, { kind: "field", name: "currentValue", static: false, private: false, access: { has: obj => "currentValue" in obj, get: obj => obj.currentValue, set: (obj, value) => { obj.currentValue = value; } }, metadata: _metadata }, _currentValue_initializers, _currentValue_extraInitializers);
        __esDecorate(null, null, _acquisitionDate_decorators, { kind: "field", name: "acquisitionDate", static: false, private: false, access: { has: obj => "acquisitionDate" in obj, get: obj => obj.acquisitionDate, set: (obj, value) => { obj.acquisitionDate = value; } }, metadata: _metadata }, _acquisitionDate_initializers, _acquisitionDate_extraInitializers);
        __esDecorate(null, null, _currentLocation_decorators, { kind: "field", name: "currentLocation", static: false, private: false, access: { has: obj => "currentLocation" in obj, get: obj => obj.currentLocation, set: (obj, value) => { obj.currentLocation = value; } }, metadata: _metadata }, _currentLocation_initializers, _currentLocation_extraInitializers);
        __esDecorate(null, null, _gpsCoordinates_decorators, { kind: "field", name: "gpsCoordinates", static: false, private: false, access: { has: obj => "gpsCoordinates" in obj, get: obj => obj.gpsCoordinates, set: (obj, value) => { obj.gpsCoordinates = value; } }, metadata: _metadata }, _gpsCoordinates_initializers, _gpsCoordinates_extraInitializers);
        __esDecorate(null, null, _operatingHours_decorators, { kind: "field", name: "operatingHours", static: false, private: false, access: { has: obj => "operatingHours" in obj, get: obj => obj.operatingHours, set: (obj, value) => { obj.operatingHours = value; } }, metadata: _metadata }, _operatingHours_initializers, _operatingHours_extraInitializers);
        __esDecorate(null, null, _odometer_decorators, { kind: "field", name: "odometer", static: false, private: false, access: { has: obj => "odometer" in obj, get: obj => obj.odometer, set: (obj, value) => { obj.odometer = value; } }, metadata: _metadata }, _odometer_initializers, _odometer_extraInitializers);
        __esDecorate(null, null, _fuelCapacity_decorators, { kind: "field", name: "fuelCapacity", static: false, private: false, access: { has: obj => "fuelCapacity" in obj, get: obj => obj.fuelCapacity, set: (obj, value) => { obj.fuelCapacity = value; } }, metadata: _metadata }, _fuelCapacity_initializers, _fuelCapacity_extraInitializers);
        __esDecorate(null, null, _fuelLevel_decorators, { kind: "field", name: "fuelLevel", static: false, private: false, access: { has: obj => "fuelLevel" in obj, get: obj => obj.fuelLevel, set: (obj, value) => { obj.fuelLevel = value; } }, metadata: _metadata }, _fuelLevel_initializers, _fuelLevel_extraInitializers);
        __esDecorate(null, null, _nextMaintenanceDate_decorators, { kind: "field", name: "nextMaintenanceDate", static: false, private: false, access: { has: obj => "nextMaintenanceDate" in obj, get: obj => obj.nextMaintenanceDate, set: (obj, value) => { obj.nextMaintenanceDate = value; } }, metadata: _metadata }, _nextMaintenanceDate_initializers, _nextMaintenanceDate_extraInitializers);
        __esDecorate(null, null, _lastMaintenanceDate_decorators, { kind: "field", name: "lastMaintenanceDate", static: false, private: false, access: { has: obj => "lastMaintenanceDate" in obj, get: obj => obj.lastMaintenanceDate, set: (obj, value) => { obj.lastMaintenanceDate = value; } }, metadata: _metadata }, _lastMaintenanceDate_initializers, _lastMaintenanceDate_extraInitializers);
        __esDecorate(null, null, _warrantyExpiration_decorators, { kind: "field", name: "warrantyExpiration", static: false, private: false, access: { has: obj => "warrantyExpiration" in obj, get: obj => obj.warrantyExpiration, set: (obj, value) => { obj.warrantyExpiration = value; } }, metadata: _metadata }, _warrantyExpiration_initializers, _warrantyExpiration_extraInitializers);
        __esDecorate(null, null, _insuranceExpiration_decorators, { kind: "field", name: "insuranceExpiration", static: false, private: false, access: { has: obj => "insuranceExpiration" in obj, get: obj => obj.insuranceExpiration, set: (obj, value) => { obj.insuranceExpiration = value; } }, metadata: _metadata }, _insuranceExpiration_initializers, _insuranceExpiration_extraInitializers);
        __esDecorate(null, null, _certifications_decorators, { kind: "field", name: "certifications", static: false, private: false, access: { has: obj => "certifications" in obj, get: obj => obj.certifications, set: (obj, value) => { obj.certifications = value; } }, metadata: _metadata }, _certifications_initializers, _certifications_extraInitializers);
        __esDecorate(null, null, _assignedOperatorId_decorators, { kind: "field", name: "assignedOperatorId", static: false, private: false, access: { has: obj => "assignedOperatorId" in obj, get: obj => obj.assignedOperatorId, set: (obj, value) => { obj.assignedOperatorId = value; } }, metadata: _metadata }, _assignedOperatorId_initializers, _assignedOperatorId_extraInitializers);
        __esDecorate(null, null, _assignedProjectId_decorators, { kind: "field", name: "assignedProjectId", static: false, private: false, access: { has: obj => "assignedProjectId" in obj, get: obj => obj.assignedProjectId, set: (obj, value) => { obj.assignedProjectId = value; } }, metadata: _metadata }, _assignedProjectId_initializers, _assignedProjectId_extraInitializers);
        __esDecorate(null, null, _dailyRentalRate_decorators, { kind: "field", name: "dailyRentalRate", static: false, private: false, access: { has: obj => "dailyRentalRate" in obj, get: obj => obj.dailyRentalRate, set: (obj, value) => { obj.dailyRentalRate = value; } }, metadata: _metadata }, _dailyRentalRate_initializers, _dailyRentalRate_extraInitializers);
        __esDecorate(null, null, _monthlyRentalRate_decorators, { kind: "field", name: "monthlyRentalRate", static: false, private: false, access: { has: obj => "monthlyRentalRate" in obj, get: obj => obj.monthlyRentalRate, set: (obj, value) => { obj.monthlyRentalRate = value; } }, metadata: _metadata }, _monthlyRentalRate_initializers, _monthlyRentalRate_extraInitializers);
        __esDecorate(null, null, _specifications_decorators, { kind: "field", name: "specifications", static: false, private: false, access: { has: obj => "specifications" in obj, get: obj => obj.specifications, set: (obj, value) => { obj.specifications = value; } }, metadata: _metadata }, _specifications_initializers, _specifications_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: obj => "isActive" in obj, get: obj => obj.isActive, set: (obj, value) => { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _maintenanceRecords_decorators, { kind: "field", name: "maintenanceRecords", static: false, private: false, access: { has: obj => "maintenanceRecords" in obj, get: obj => obj.maintenanceRecords, set: (obj, value) => { obj.maintenanceRecords = value; } }, metadata: _metadata }, _maintenanceRecords_initializers, _maintenanceRecords_extraInitializers);
        __esDecorate(null, null, _allocations_decorators, { kind: "field", name: "allocations", static: false, private: false, access: { has: obj => "allocations" in obj, get: obj => obj.allocations, set: (obj, value) => { obj.allocations = value; } }, metadata: _metadata }, _allocations_initializers, _allocations_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ConstructionEquipment = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ConstructionEquipment = _classThis;
})();
exports.ConstructionEquipment = ConstructionEquipment;
//# sourceMappingURL=construction-equipment.model.js.map