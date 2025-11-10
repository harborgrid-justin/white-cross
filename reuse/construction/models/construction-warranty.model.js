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
exports.ConstructionWarranty = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const warranty_types_1 = require("../types/warranty.types");
let ConstructionWarranty = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'construction_warranties',
            timestamps: true,
            indexes: [
                { fields: ['warrantyNumber'], unique: true },
                { fields: ['projectId'] },
                { fields: ['warrantyType'] },
                { fields: ['status'] },
                { fields: ['contractorId'] },
                { fields: ['startDate'] },
                { fields: ['endDate'] },
                { fields: ['component'] },
                { fields: ['extendedWarranty'] },
                { fields: ['originalWarrantyId'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _projectId_decorators;
    let _projectId_initializers = [];
    let _projectId_extraInitializers = [];
    let _warrantyNumber_decorators;
    let _warrantyNumber_initializers = [];
    let _warrantyNumber_extraInitializers = [];
    let _warrantyType_decorators;
    let _warrantyType_initializers = [];
    let _warrantyType_extraInitializers = [];
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _component_decorators;
    let _component_initializers = [];
    let _component_extraInitializers = [];
    let _location_decorators;
    let _location_initializers = [];
    let _location_extraInitializers = [];
    let _contractorId_decorators;
    let _contractorId_initializers = [];
    let _contractorId_extraInitializers = [];
    let _contractorName_decorators;
    let _contractorName_initializers = [];
    let _contractorName_extraInitializers = [];
    let _contractorContact_decorators;
    let _contractorContact_initializers = [];
    let _contractorContact_extraInitializers = [];
    let _manufacturerId_decorators;
    let _manufacturerId_initializers = [];
    let _manufacturerId_extraInitializers = [];
    let _manufacturerName_decorators;
    let _manufacturerName_initializers = [];
    let _manufacturerName_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _durationMonths_decorators;
    let _durationMonths_initializers = [];
    let _durationMonths_extraInitializers = [];
    let _coverageAmount_decorators;
    let _coverageAmount_initializers = [];
    let _coverageAmount_extraInitializers = [];
    let _deductible_decorators;
    let _deductible_initializers = [];
    let _deductible_extraInitializers = [];
    let _terms_decorators;
    let _terms_initializers = [];
    let _terms_extraInitializers = [];
    let _exclusions_decorators;
    let _exclusions_initializers = [];
    let _exclusions_extraInitializers = [];
    let _conditions_decorators;
    let _conditions_initializers = [];
    let _conditions_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _documentUrls_decorators;
    let _documentUrls_initializers = [];
    let _documentUrls_extraInitializers = [];
    let _certificateNumber_decorators;
    let _certificateNumber_initializers = [];
    let _certificateNumber_extraInitializers = [];
    let _policyNumber_decorators;
    let _policyNumber_initializers = [];
    let _policyNumber_extraInitializers = [];
    let _insuranceProvider_decorators;
    let _insuranceProvider_initializers = [];
    let _insuranceProvider_extraInitializers = [];
    let _notificationsSent_decorators;
    let _notificationsSent_initializers = [];
    let _notificationsSent_extraInitializers = [];
    let _lastNotificationDate_decorators;
    let _lastNotificationDate_initializers = [];
    let _lastNotificationDate_extraInitializers = [];
    let _extendedWarranty_decorators;
    let _extendedWarranty_initializers = [];
    let _extendedWarranty_extraInitializers = [];
    let _originalWarrantyId_decorators;
    let _originalWarrantyId_initializers = [];
    let _originalWarrantyId_extraInitializers = [];
    let _autoRenewalEnabled_decorators;
    let _autoRenewalEnabled_initializers = [];
    let _autoRenewalEnabled_extraInitializers = [];
    let _tags_decorators;
    let _tags_initializers = [];
    let _tags_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _createdBy_decorators;
    let _createdBy_initializers = [];
    let _createdBy_extraInitializers = [];
    let _updatedBy_decorators;
    let _updatedBy_initializers = [];
    let _updatedBy_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var ConstructionWarranty = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.projectId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _projectId_initializers, void 0));
            this.warrantyNumber = (__runInitializers(this, _projectId_extraInitializers), __runInitializers(this, _warrantyNumber_initializers, void 0));
            this.warrantyType = (__runInitializers(this, _warrantyNumber_extraInitializers), __runInitializers(this, _warrantyType_initializers, void 0));
            this.title = (__runInitializers(this, _warrantyType_extraInitializers), __runInitializers(this, _title_initializers, void 0));
            this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.component = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _component_initializers, void 0));
            this.location = (__runInitializers(this, _component_extraInitializers), __runInitializers(this, _location_initializers, void 0));
            this.contractorId = (__runInitializers(this, _location_extraInitializers), __runInitializers(this, _contractorId_initializers, void 0));
            this.contractorName = (__runInitializers(this, _contractorId_extraInitializers), __runInitializers(this, _contractorName_initializers, void 0));
            this.contractorContact = (__runInitializers(this, _contractorName_extraInitializers), __runInitializers(this, _contractorContact_initializers, void 0));
            this.manufacturerId = (__runInitializers(this, _contractorContact_extraInitializers), __runInitializers(this, _manufacturerId_initializers, void 0));
            this.manufacturerName = (__runInitializers(this, _manufacturerId_extraInitializers), __runInitializers(this, _manufacturerName_initializers, void 0));
            this.startDate = (__runInitializers(this, _manufacturerName_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
            this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
            this.durationMonths = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _durationMonths_initializers, void 0));
            this.coverageAmount = (__runInitializers(this, _durationMonths_extraInitializers), __runInitializers(this, _coverageAmount_initializers, void 0));
            this.deductible = (__runInitializers(this, _coverageAmount_extraInitializers), __runInitializers(this, _deductible_initializers, void 0));
            this.terms = (__runInitializers(this, _deductible_extraInitializers), __runInitializers(this, _terms_initializers, void 0));
            this.exclusions = (__runInitializers(this, _terms_extraInitializers), __runInitializers(this, _exclusions_initializers, void 0));
            this.conditions = (__runInitializers(this, _exclusions_extraInitializers), __runInitializers(this, _conditions_initializers, void 0));
            this.status = (__runInitializers(this, _conditions_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.documentUrls = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _documentUrls_initializers, void 0));
            this.certificateNumber = (__runInitializers(this, _documentUrls_extraInitializers), __runInitializers(this, _certificateNumber_initializers, void 0));
            this.policyNumber = (__runInitializers(this, _certificateNumber_extraInitializers), __runInitializers(this, _policyNumber_initializers, void 0));
            this.insuranceProvider = (__runInitializers(this, _policyNumber_extraInitializers), __runInitializers(this, _insuranceProvider_initializers, void 0));
            this.notificationsSent = (__runInitializers(this, _insuranceProvider_extraInitializers), __runInitializers(this, _notificationsSent_initializers, void 0));
            this.lastNotificationDate = (__runInitializers(this, _notificationsSent_extraInitializers), __runInitializers(this, _lastNotificationDate_initializers, void 0));
            this.extendedWarranty = (__runInitializers(this, _lastNotificationDate_extraInitializers), __runInitializers(this, _extendedWarranty_initializers, void 0));
            this.originalWarrantyId = (__runInitializers(this, _extendedWarranty_extraInitializers), __runInitializers(this, _originalWarrantyId_initializers, void 0));
            this.autoRenewalEnabled = (__runInitializers(this, _originalWarrantyId_extraInitializers), __runInitializers(this, _autoRenewalEnabled_initializers, void 0));
            this.tags = (__runInitializers(this, _autoRenewalEnabled_extraInitializers), __runInitializers(this, _tags_initializers, void 0));
            this.metadata = (__runInitializers(this, _tags_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdBy = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdBy_initializers, void 0));
            this.updatedBy = (__runInitializers(this, _createdBy_extraInitializers), __runInitializers(this, _updatedBy_initializers, void 0));
            this.createdAt = (__runInitializers(this, _updatedBy_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ConstructionWarranty");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.INTEGER), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _projectId_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _warrantyNumber_decorators = [(0, sequelize_typescript_1.AllowNull)(false), Unique, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _warrantyType_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(warranty_types_1.WarrantyType)),
            })];
        _title_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(200))];
        _description_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _component_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(200))];
        _location_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(200))];
        _contractorId_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _contractorName_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(200))];
        _contractorContact_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(200))];
        _manufacturerId_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _manufacturerName_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(200))];
        _startDate_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _endDate_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _durationMonths_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _coverageAmount_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(12, 2))];
        _deductible_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(12, 2))];
        _terms_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _exclusions_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)([]), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.TEXT))];
        _conditions_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)([]), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.TEXT))];
        _status_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(warranty_types_1.WarrantyStatus.DRAFT), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(warranty_types_1.WarrantyStatus)),
            })];
        _documentUrls_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)([]), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING))];
        _certificateNumber_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100))];
        _policyNumber_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100))];
        _insuranceProvider_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(200))];
        _notificationsSent_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _lastNotificationDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _extendedWarranty_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)];
        _originalWarrantyId_decorators = [sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _autoRenewalEnabled_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)];
        _tags_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)([]), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING))];
        _metadata_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)({}), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON)];
        _createdBy_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100))];
        _updatedBy_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100))];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _projectId_decorators, { kind: "field", name: "projectId", static: false, private: false, access: { has: obj => "projectId" in obj, get: obj => obj.projectId, set: (obj, value) => { obj.projectId = value; } }, metadata: _metadata }, _projectId_initializers, _projectId_extraInitializers);
        __esDecorate(null, null, _warrantyNumber_decorators, { kind: "field", name: "warrantyNumber", static: false, private: false, access: { has: obj => "warrantyNumber" in obj, get: obj => obj.warrantyNumber, set: (obj, value) => { obj.warrantyNumber = value; } }, metadata: _metadata }, _warrantyNumber_initializers, _warrantyNumber_extraInitializers);
        __esDecorate(null, null, _warrantyType_decorators, { kind: "field", name: "warrantyType", static: false, private: false, access: { has: obj => "warrantyType" in obj, get: obj => obj.warrantyType, set: (obj, value) => { obj.warrantyType = value; } }, metadata: _metadata }, _warrantyType_initializers, _warrantyType_extraInitializers);
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _component_decorators, { kind: "field", name: "component", static: false, private: false, access: { has: obj => "component" in obj, get: obj => obj.component, set: (obj, value) => { obj.component = value; } }, metadata: _metadata }, _component_initializers, _component_extraInitializers);
        __esDecorate(null, null, _location_decorators, { kind: "field", name: "location", static: false, private: false, access: { has: obj => "location" in obj, get: obj => obj.location, set: (obj, value) => { obj.location = value; } }, metadata: _metadata }, _location_initializers, _location_extraInitializers);
        __esDecorate(null, null, _contractorId_decorators, { kind: "field", name: "contractorId", static: false, private: false, access: { has: obj => "contractorId" in obj, get: obj => obj.contractorId, set: (obj, value) => { obj.contractorId = value; } }, metadata: _metadata }, _contractorId_initializers, _contractorId_extraInitializers);
        __esDecorate(null, null, _contractorName_decorators, { kind: "field", name: "contractorName", static: false, private: false, access: { has: obj => "contractorName" in obj, get: obj => obj.contractorName, set: (obj, value) => { obj.contractorName = value; } }, metadata: _metadata }, _contractorName_initializers, _contractorName_extraInitializers);
        __esDecorate(null, null, _contractorContact_decorators, { kind: "field", name: "contractorContact", static: false, private: false, access: { has: obj => "contractorContact" in obj, get: obj => obj.contractorContact, set: (obj, value) => { obj.contractorContact = value; } }, metadata: _metadata }, _contractorContact_initializers, _contractorContact_extraInitializers);
        __esDecorate(null, null, _manufacturerId_decorators, { kind: "field", name: "manufacturerId", static: false, private: false, access: { has: obj => "manufacturerId" in obj, get: obj => obj.manufacturerId, set: (obj, value) => { obj.manufacturerId = value; } }, metadata: _metadata }, _manufacturerId_initializers, _manufacturerId_extraInitializers);
        __esDecorate(null, null, _manufacturerName_decorators, { kind: "field", name: "manufacturerName", static: false, private: false, access: { has: obj => "manufacturerName" in obj, get: obj => obj.manufacturerName, set: (obj, value) => { obj.manufacturerName = value; } }, metadata: _metadata }, _manufacturerName_initializers, _manufacturerName_extraInitializers);
        __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
        __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
        __esDecorate(null, null, _durationMonths_decorators, { kind: "field", name: "durationMonths", static: false, private: false, access: { has: obj => "durationMonths" in obj, get: obj => obj.durationMonths, set: (obj, value) => { obj.durationMonths = value; } }, metadata: _metadata }, _durationMonths_initializers, _durationMonths_extraInitializers);
        __esDecorate(null, null, _coverageAmount_decorators, { kind: "field", name: "coverageAmount", static: false, private: false, access: { has: obj => "coverageAmount" in obj, get: obj => obj.coverageAmount, set: (obj, value) => { obj.coverageAmount = value; } }, metadata: _metadata }, _coverageAmount_initializers, _coverageAmount_extraInitializers);
        __esDecorate(null, null, _deductible_decorators, { kind: "field", name: "deductible", static: false, private: false, access: { has: obj => "deductible" in obj, get: obj => obj.deductible, set: (obj, value) => { obj.deductible = value; } }, metadata: _metadata }, _deductible_initializers, _deductible_extraInitializers);
        __esDecorate(null, null, _terms_decorators, { kind: "field", name: "terms", static: false, private: false, access: { has: obj => "terms" in obj, get: obj => obj.terms, set: (obj, value) => { obj.terms = value; } }, metadata: _metadata }, _terms_initializers, _terms_extraInitializers);
        __esDecorate(null, null, _exclusions_decorators, { kind: "field", name: "exclusions", static: false, private: false, access: { has: obj => "exclusions" in obj, get: obj => obj.exclusions, set: (obj, value) => { obj.exclusions = value; } }, metadata: _metadata }, _exclusions_initializers, _exclusions_extraInitializers);
        __esDecorate(null, null, _conditions_decorators, { kind: "field", name: "conditions", static: false, private: false, access: { has: obj => "conditions" in obj, get: obj => obj.conditions, set: (obj, value) => { obj.conditions = value; } }, metadata: _metadata }, _conditions_initializers, _conditions_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _documentUrls_decorators, { kind: "field", name: "documentUrls", static: false, private: false, access: { has: obj => "documentUrls" in obj, get: obj => obj.documentUrls, set: (obj, value) => { obj.documentUrls = value; } }, metadata: _metadata }, _documentUrls_initializers, _documentUrls_extraInitializers);
        __esDecorate(null, null, _certificateNumber_decorators, { kind: "field", name: "certificateNumber", static: false, private: false, access: { has: obj => "certificateNumber" in obj, get: obj => obj.certificateNumber, set: (obj, value) => { obj.certificateNumber = value; } }, metadata: _metadata }, _certificateNumber_initializers, _certificateNumber_extraInitializers);
        __esDecorate(null, null, _policyNumber_decorators, { kind: "field", name: "policyNumber", static: false, private: false, access: { has: obj => "policyNumber" in obj, get: obj => obj.policyNumber, set: (obj, value) => { obj.policyNumber = value; } }, metadata: _metadata }, _policyNumber_initializers, _policyNumber_extraInitializers);
        __esDecorate(null, null, _insuranceProvider_decorators, { kind: "field", name: "insuranceProvider", static: false, private: false, access: { has: obj => "insuranceProvider" in obj, get: obj => obj.insuranceProvider, set: (obj, value) => { obj.insuranceProvider = value; } }, metadata: _metadata }, _insuranceProvider_initializers, _insuranceProvider_extraInitializers);
        __esDecorate(null, null, _notificationsSent_decorators, { kind: "field", name: "notificationsSent", static: false, private: false, access: { has: obj => "notificationsSent" in obj, get: obj => obj.notificationsSent, set: (obj, value) => { obj.notificationsSent = value; } }, metadata: _metadata }, _notificationsSent_initializers, _notificationsSent_extraInitializers);
        __esDecorate(null, null, _lastNotificationDate_decorators, { kind: "field", name: "lastNotificationDate", static: false, private: false, access: { has: obj => "lastNotificationDate" in obj, get: obj => obj.lastNotificationDate, set: (obj, value) => { obj.lastNotificationDate = value; } }, metadata: _metadata }, _lastNotificationDate_initializers, _lastNotificationDate_extraInitializers);
        __esDecorate(null, null, _extendedWarranty_decorators, { kind: "field", name: "extendedWarranty", static: false, private: false, access: { has: obj => "extendedWarranty" in obj, get: obj => obj.extendedWarranty, set: (obj, value) => { obj.extendedWarranty = value; } }, metadata: _metadata }, _extendedWarranty_initializers, _extendedWarranty_extraInitializers);
        __esDecorate(null, null, _originalWarrantyId_decorators, { kind: "field", name: "originalWarrantyId", static: false, private: false, access: { has: obj => "originalWarrantyId" in obj, get: obj => obj.originalWarrantyId, set: (obj, value) => { obj.originalWarrantyId = value; } }, metadata: _metadata }, _originalWarrantyId_initializers, _originalWarrantyId_extraInitializers);
        __esDecorate(null, null, _autoRenewalEnabled_decorators, { kind: "field", name: "autoRenewalEnabled", static: false, private: false, access: { has: obj => "autoRenewalEnabled" in obj, get: obj => obj.autoRenewalEnabled, set: (obj, value) => { obj.autoRenewalEnabled = value; } }, metadata: _metadata }, _autoRenewalEnabled_initializers, _autoRenewalEnabled_extraInitializers);
        __esDecorate(null, null, _tags_decorators, { kind: "field", name: "tags", static: false, private: false, access: { has: obj => "tags" in obj, get: obj => obj.tags, set: (obj, value) => { obj.tags = value; } }, metadata: _metadata }, _tags_initializers, _tags_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdBy_decorators, { kind: "field", name: "createdBy", static: false, private: false, access: { has: obj => "createdBy" in obj, get: obj => obj.createdBy, set: (obj, value) => { obj.createdBy = value; } }, metadata: _metadata }, _createdBy_initializers, _createdBy_extraInitializers);
        __esDecorate(null, null, _updatedBy_decorators, { kind: "field", name: "updatedBy", static: false, private: false, access: { has: obj => "updatedBy" in obj, get: obj => obj.updatedBy, set: (obj, value) => { obj.updatedBy = value; } }, metadata: _metadata }, _updatedBy_initializers, _updatedBy_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ConstructionWarranty = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ConstructionWarranty = _classThis;
})();
exports.ConstructionWarranty = ConstructionWarranty;
//# sourceMappingURL=construction-warranty.model.js.map