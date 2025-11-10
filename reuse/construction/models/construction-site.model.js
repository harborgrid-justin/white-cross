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
exports.ConstructionSite = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const site_types_1 = require("../types/site.types");
let ConstructionSite = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'construction_sites',
            timestamps: true,
            indexes: [
                { fields: ['projectId'] },
                { fields: ['status'] },
                { fields: ['siteManager'] },
                { fields: ['startDate'] },
                { fields: ['estimatedEndDate'] },
                { fields: ['status', 'startDate'] },
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
    let _siteName_decorators;
    let _siteName_initializers = [];
    let _siteName_extraInitializers = [];
    let _siteAddress_decorators;
    let _siteAddress_initializers = [];
    let _siteAddress_extraInitializers = [];
    let _siteManager_decorators;
    let _siteManager_initializers = [];
    let _siteManager_extraInitializers = [];
    let _siteManagerContact_decorators;
    let _siteManagerContact_initializers = [];
    let _siteManagerContact_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _estimatedEndDate_decorators;
    let _estimatedEndDate_initializers = [];
    let _estimatedEndDate_extraInitializers = [];
    let _actualEndDate_decorators;
    let _actualEndDate_initializers = [];
    let _actualEndDate_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _accessRestrictions_decorators;
    let _accessRestrictions_initializers = [];
    let _accessRestrictions_extraInitializers = [];
    let _parkingInstructions_decorators;
    let _parkingInstructions_initializers = [];
    let _parkingInstructions_extraInitializers = [];
    let _securityRequirements_decorators;
    let _securityRequirements_initializers = [];
    let _securityRequirements_extraInitializers = [];
    let _emergencyPhone_decorators;
    let _emergencyPhone_initializers = [];
    let _emergencyPhone_extraInitializers = [];
    let _nearestHospital_decorators;
    let _nearestHospital_initializers = [];
    let _nearestHospital_extraInitializers = [];
    let _permitNumber_decorators;
    let _permitNumber_initializers = [];
    let _permitNumber_extraInitializers = [];
    let _insurancePolicy_decorators;
    let _insurancePolicy_initializers = [];
    let _insurancePolicy_extraInitializers = [];
    let _latitude_decorators;
    let _latitude_initializers = [];
    let _latitude_extraInitializers = [];
    let _longitude_decorators;
    let _longitude_initializers = [];
    let _longitude_extraInitializers = [];
    let _totalArea_decorators;
    let _totalArea_initializers = [];
    let _totalArea_extraInitializers = [];
    let _fenceInstalled_decorators;
    let _fenceInstalled_initializers = [];
    let _fenceInstalled_extraInitializers = [];
    let _signsInstalled_decorators;
    let _signsInstalled_initializers = [];
    let _signsInstalled_extraInitializers = [];
    let _utilitiesMarked_decorators;
    let _utilitiesMarked_initializers = [];
    let _utilitiesMarked_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    var ConstructionSite = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.projectId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _projectId_initializers, void 0));
            this.siteName = (__runInitializers(this, _projectId_extraInitializers), __runInitializers(this, _siteName_initializers, void 0));
            this.siteAddress = (__runInitializers(this, _siteName_extraInitializers), __runInitializers(this, _siteAddress_initializers, void 0));
            this.siteManager = (__runInitializers(this, _siteAddress_extraInitializers), __runInitializers(this, _siteManager_initializers, void 0));
            this.siteManagerContact = (__runInitializers(this, _siteManager_extraInitializers), __runInitializers(this, _siteManagerContact_initializers, void 0));
            this.startDate = (__runInitializers(this, _siteManagerContact_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
            this.estimatedEndDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _estimatedEndDate_initializers, void 0));
            this.actualEndDate = (__runInitializers(this, _estimatedEndDate_extraInitializers), __runInitializers(this, _actualEndDate_initializers, void 0));
            this.status = (__runInitializers(this, _actualEndDate_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.accessRestrictions = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _accessRestrictions_initializers, void 0));
            this.parkingInstructions = (__runInitializers(this, _accessRestrictions_extraInitializers), __runInitializers(this, _parkingInstructions_initializers, void 0));
            this.securityRequirements = (__runInitializers(this, _parkingInstructions_extraInitializers), __runInitializers(this, _securityRequirements_initializers, void 0));
            this.emergencyPhone = (__runInitializers(this, _securityRequirements_extraInitializers), __runInitializers(this, _emergencyPhone_initializers, void 0));
            this.nearestHospital = (__runInitializers(this, _emergencyPhone_extraInitializers), __runInitializers(this, _nearestHospital_initializers, void 0));
            this.permitNumber = (__runInitializers(this, _nearestHospital_extraInitializers), __runInitializers(this, _permitNumber_initializers, void 0));
            this.insurancePolicy = (__runInitializers(this, _permitNumber_extraInitializers), __runInitializers(this, _insurancePolicy_initializers, void 0));
            this.latitude = (__runInitializers(this, _insurancePolicy_extraInitializers), __runInitializers(this, _latitude_initializers, void 0));
            this.longitude = (__runInitializers(this, _latitude_extraInitializers), __runInitializers(this, _longitude_initializers, void 0));
            this.totalArea = (__runInitializers(this, _longitude_extraInitializers), __runInitializers(this, _totalArea_initializers, void 0));
            this.fenceInstalled = (__runInitializers(this, _totalArea_extraInitializers), __runInitializers(this, _fenceInstalled_initializers, void 0));
            this.signsInstalled = (__runInitializers(this, _fenceInstalled_extraInitializers), __runInitializers(this, _signsInstalled_initializers, void 0));
            this.utilitiesMarked = (__runInitializers(this, _signsInstalled_extraInitializers), __runInitializers(this, _utilitiesMarked_initializers, void 0));
            this.metadata = (__runInitializers(this, _utilitiesMarked_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            __runInitializers(this, _metadata_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ConstructionSite");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _projectId_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _siteName_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(200))];
        _siteAddress_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _siteManager_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100))];
        _siteManagerContact_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _startDate_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _estimatedEndDate_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _actualEndDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _status_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(site_types_1.SiteStatus.PLANNING), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(site_types_1.SiteStatus)),
            })];
        _accessRestrictions_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _parkingInstructions_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _securityRequirements_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _emergencyPhone_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _nearestHospital_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _permitNumber_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100))];
        _insurancePolicy_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100))];
        _latitude_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(10, 8))];
        _longitude_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(11, 8))];
        _totalArea_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(15, 2))];
        _fenceInstalled_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)];
        _signsInstalled_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)];
        _utilitiesMarked_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)];
        _metadata_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)({}), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _projectId_decorators, { kind: "field", name: "projectId", static: false, private: false, access: { has: obj => "projectId" in obj, get: obj => obj.projectId, set: (obj, value) => { obj.projectId = value; } }, metadata: _metadata }, _projectId_initializers, _projectId_extraInitializers);
        __esDecorate(null, null, _siteName_decorators, { kind: "field", name: "siteName", static: false, private: false, access: { has: obj => "siteName" in obj, get: obj => obj.siteName, set: (obj, value) => { obj.siteName = value; } }, metadata: _metadata }, _siteName_initializers, _siteName_extraInitializers);
        __esDecorate(null, null, _siteAddress_decorators, { kind: "field", name: "siteAddress", static: false, private: false, access: { has: obj => "siteAddress" in obj, get: obj => obj.siteAddress, set: (obj, value) => { obj.siteAddress = value; } }, metadata: _metadata }, _siteAddress_initializers, _siteAddress_extraInitializers);
        __esDecorate(null, null, _siteManager_decorators, { kind: "field", name: "siteManager", static: false, private: false, access: { has: obj => "siteManager" in obj, get: obj => obj.siteManager, set: (obj, value) => { obj.siteManager = value; } }, metadata: _metadata }, _siteManager_initializers, _siteManager_extraInitializers);
        __esDecorate(null, null, _siteManagerContact_decorators, { kind: "field", name: "siteManagerContact", static: false, private: false, access: { has: obj => "siteManagerContact" in obj, get: obj => obj.siteManagerContact, set: (obj, value) => { obj.siteManagerContact = value; } }, metadata: _metadata }, _siteManagerContact_initializers, _siteManagerContact_extraInitializers);
        __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
        __esDecorate(null, null, _estimatedEndDate_decorators, { kind: "field", name: "estimatedEndDate", static: false, private: false, access: { has: obj => "estimatedEndDate" in obj, get: obj => obj.estimatedEndDate, set: (obj, value) => { obj.estimatedEndDate = value; } }, metadata: _metadata }, _estimatedEndDate_initializers, _estimatedEndDate_extraInitializers);
        __esDecorate(null, null, _actualEndDate_decorators, { kind: "field", name: "actualEndDate", static: false, private: false, access: { has: obj => "actualEndDate" in obj, get: obj => obj.actualEndDate, set: (obj, value) => { obj.actualEndDate = value; } }, metadata: _metadata }, _actualEndDate_initializers, _actualEndDate_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _accessRestrictions_decorators, { kind: "field", name: "accessRestrictions", static: false, private: false, access: { has: obj => "accessRestrictions" in obj, get: obj => obj.accessRestrictions, set: (obj, value) => { obj.accessRestrictions = value; } }, metadata: _metadata }, _accessRestrictions_initializers, _accessRestrictions_extraInitializers);
        __esDecorate(null, null, _parkingInstructions_decorators, { kind: "field", name: "parkingInstructions", static: false, private: false, access: { has: obj => "parkingInstructions" in obj, get: obj => obj.parkingInstructions, set: (obj, value) => { obj.parkingInstructions = value; } }, metadata: _metadata }, _parkingInstructions_initializers, _parkingInstructions_extraInitializers);
        __esDecorate(null, null, _securityRequirements_decorators, { kind: "field", name: "securityRequirements", static: false, private: false, access: { has: obj => "securityRequirements" in obj, get: obj => obj.securityRequirements, set: (obj, value) => { obj.securityRequirements = value; } }, metadata: _metadata }, _securityRequirements_initializers, _securityRequirements_extraInitializers);
        __esDecorate(null, null, _emergencyPhone_decorators, { kind: "field", name: "emergencyPhone", static: false, private: false, access: { has: obj => "emergencyPhone" in obj, get: obj => obj.emergencyPhone, set: (obj, value) => { obj.emergencyPhone = value; } }, metadata: _metadata }, _emergencyPhone_initializers, _emergencyPhone_extraInitializers);
        __esDecorate(null, null, _nearestHospital_decorators, { kind: "field", name: "nearestHospital", static: false, private: false, access: { has: obj => "nearestHospital" in obj, get: obj => obj.nearestHospital, set: (obj, value) => { obj.nearestHospital = value; } }, metadata: _metadata }, _nearestHospital_initializers, _nearestHospital_extraInitializers);
        __esDecorate(null, null, _permitNumber_decorators, { kind: "field", name: "permitNumber", static: false, private: false, access: { has: obj => "permitNumber" in obj, get: obj => obj.permitNumber, set: (obj, value) => { obj.permitNumber = value; } }, metadata: _metadata }, _permitNumber_initializers, _permitNumber_extraInitializers);
        __esDecorate(null, null, _insurancePolicy_decorators, { kind: "field", name: "insurancePolicy", static: false, private: false, access: { has: obj => "insurancePolicy" in obj, get: obj => obj.insurancePolicy, set: (obj, value) => { obj.insurancePolicy = value; } }, metadata: _metadata }, _insurancePolicy_initializers, _insurancePolicy_extraInitializers);
        __esDecorate(null, null, _latitude_decorators, { kind: "field", name: "latitude", static: false, private: false, access: { has: obj => "latitude" in obj, get: obj => obj.latitude, set: (obj, value) => { obj.latitude = value; } }, metadata: _metadata }, _latitude_initializers, _latitude_extraInitializers);
        __esDecorate(null, null, _longitude_decorators, { kind: "field", name: "longitude", static: false, private: false, access: { has: obj => "longitude" in obj, get: obj => obj.longitude, set: (obj, value) => { obj.longitude = value; } }, metadata: _metadata }, _longitude_initializers, _longitude_extraInitializers);
        __esDecorate(null, null, _totalArea_decorators, { kind: "field", name: "totalArea", static: false, private: false, access: { has: obj => "totalArea" in obj, get: obj => obj.totalArea, set: (obj, value) => { obj.totalArea = value; } }, metadata: _metadata }, _totalArea_initializers, _totalArea_extraInitializers);
        __esDecorate(null, null, _fenceInstalled_decorators, { kind: "field", name: "fenceInstalled", static: false, private: false, access: { has: obj => "fenceInstalled" in obj, get: obj => obj.fenceInstalled, set: (obj, value) => { obj.fenceInstalled = value; } }, metadata: _metadata }, _fenceInstalled_initializers, _fenceInstalled_extraInitializers);
        __esDecorate(null, null, _signsInstalled_decorators, { kind: "field", name: "signsInstalled", static: false, private: false, access: { has: obj => "signsInstalled" in obj, get: obj => obj.signsInstalled, set: (obj, value) => { obj.signsInstalled = value; } }, metadata: _metadata }, _signsInstalled_initializers, _signsInstalled_extraInitializers);
        __esDecorate(null, null, _utilitiesMarked_decorators, { kind: "field", name: "utilitiesMarked", static: false, private: false, access: { has: obj => "utilitiesMarked" in obj, get: obj => obj.utilitiesMarked, set: (obj, value) => { obj.utilitiesMarked = value; } }, metadata: _metadata }, _utilitiesMarked_initializers, _utilitiesMarked_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ConstructionSite = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ConstructionSite = _classThis;
})();
exports.ConstructionSite = ConstructionSite;
//# sourceMappingURL=construction-site.model.js.map