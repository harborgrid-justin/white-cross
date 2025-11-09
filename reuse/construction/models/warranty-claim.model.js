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
exports.WarrantyClaim = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const warranty_types_1 = require("../types/warranty.types");
const construction_warranty_model_1 = require("./construction-warranty.model");
let WarrantyClaim = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'warranty_claims',
            timestamps: true,
            indexes: [
                { fields: ['claimNumber'], unique: true },
                { fields: ['warrantyId'] },
                { fields: ['status'] },
                { fields: ['priority'] },
                { fields: ['assignedTo'] },
                { fields: ['issueDate'] },
                { fields: ['reportedBy'] },
                { fields: ['escalated'] },
                { fields: ['component'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _warrantyId_decorators;
    let _warrantyId_initializers = [];
    let _warrantyId_extraInitializers = [];
    let _claimNumber_decorators;
    let _claimNumber_initializers = [];
    let _claimNumber_extraInitializers = [];
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _issueDate_decorators;
    let _issueDate_initializers = [];
    let _issueDate_extraInitializers = [];
    let _reportedBy_decorators;
    let _reportedBy_initializers = [];
    let _reportedBy_extraInitializers = [];
    let _reportedByContact_decorators;
    let _reportedByContact_initializers = [];
    let _reportedByContact_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    let _component_decorators;
    let _component_initializers = [];
    let _component_extraInitializers = [];
    let _location_decorators;
    let _location_initializers = [];
    let _location_extraInitializers = [];
    let _defectDescription_decorators;
    let _defectDescription_initializers = [];
    let _defectDescription_extraInitializers = [];
    let _rootCause_decorators;
    let _rootCause_initializers = [];
    let _rootCause_extraInitializers = [];
    let _estimatedCost_decorators;
    let _estimatedCost_initializers = [];
    let _estimatedCost_extraInitializers = [];
    let _actualCost_decorators;
    let _actualCost_initializers = [];
    let _actualCost_extraInitializers = [];
    let _laborCost_decorators;
    let _laborCost_initializers = [];
    let _laborCost_extraInitializers = [];
    let _materialCost_decorators;
    let _materialCost_initializers = [];
    let _materialCost_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _assignedTo_decorators;
    let _assignedTo_initializers = [];
    let _assignedTo_extraInitializers = [];
    let _assignedDate_decorators;
    let _assignedDate_initializers = [];
    let _assignedDate_extraInitializers = [];
    let _reviewedBy_decorators;
    let _reviewedBy_initializers = [];
    let _reviewedBy_extraInitializers = [];
    let _reviewedDate_decorators;
    let _reviewedDate_initializers = [];
    let _reviewedDate_extraInitializers = [];
    let _reviewNotes_decorators;
    let _reviewNotes_initializers = [];
    let _reviewNotes_extraInitializers = [];
    let _approvedBy_decorators;
    let _approvedBy_initializers = [];
    let _approvedBy_extraInitializers = [];
    let _approvedDate_decorators;
    let _approvedDate_initializers = [];
    let _approvedDate_extraInitializers = [];
    let _rejectionReason_decorators;
    let _rejectionReason_initializers = [];
    let _rejectionReason_extraInitializers = [];
    let _resolutionDate_decorators;
    let _resolutionDate_initializers = [];
    let _resolutionDate_extraInitializers = [];
    let _resolutionDescription_decorators;
    let _resolutionDescription_initializers = [];
    let _resolutionDescription_extraInitializers = [];
    let _photos_decorators;
    let _photos_initializers = [];
    let _photos_extraInitializers = [];
    let _documents_decorators;
    let _documents_initializers = [];
    let _documents_extraInitializers = [];
    let _callbackScheduled_decorators;
    let _callbackScheduled_initializers = [];
    let _callbackScheduled_extraInitializers = [];
    let _callbackDate_decorators;
    let _callbackDate_initializers = [];
    let _callbackDate_extraInitializers = [];
    let _completionDate_decorators;
    let _completionDate_initializers = [];
    let _completionDate_extraInitializers = [];
    let _completionNotes_decorators;
    let _completionNotes_initializers = [];
    let _completionNotes_extraInitializers = [];
    let _satisfactionRating_decorators;
    let _satisfactionRating_initializers = [];
    let _satisfactionRating_extraInitializers = [];
    let _feedback_decorators;
    let _feedback_initializers = [];
    let _feedback_extraInitializers = [];
    let _escalated_decorators;
    let _escalated_initializers = [];
    let _escalated_extraInitializers = [];
    let _escalationLevel_decorators;
    let _escalationLevel_initializers = [];
    let _escalationLevel_extraInitializers = [];
    let _escalationReason_decorators;
    let _escalationReason_initializers = [];
    let _escalationReason_extraInitializers = [];
    let _disputeReason_decorators;
    let _disputeReason_initializers = [];
    let _disputeReason_extraInitializers = [];
    let _disputeResolution_decorators;
    let _disputeResolution_initializers = [];
    let _disputeResolution_extraInitializers = [];
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
    var WarrantyClaim = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.warrantyId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _warrantyId_initializers, void 0));
            this.claimNumber = (__runInitializers(this, _warrantyId_extraInitializers), __runInitializers(this, _claimNumber_initializers, void 0));
            this.title = (__runInitializers(this, _claimNumber_extraInitializers), __runInitializers(this, _title_initializers, void 0));
            this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.issueDate = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _issueDate_initializers, void 0));
            this.reportedBy = (__runInitializers(this, _issueDate_extraInitializers), __runInitializers(this, _reportedBy_initializers, void 0));
            this.reportedByContact = (__runInitializers(this, _reportedBy_extraInitializers), __runInitializers(this, _reportedByContact_initializers, void 0));
            this.priority = (__runInitializers(this, _reportedByContact_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
            this.component = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _component_initializers, void 0));
            this.location = (__runInitializers(this, _component_extraInitializers), __runInitializers(this, _location_initializers, void 0));
            this.defectDescription = (__runInitializers(this, _location_extraInitializers), __runInitializers(this, _defectDescription_initializers, void 0));
            this.rootCause = (__runInitializers(this, _defectDescription_extraInitializers), __runInitializers(this, _rootCause_initializers, void 0));
            this.estimatedCost = (__runInitializers(this, _rootCause_extraInitializers), __runInitializers(this, _estimatedCost_initializers, void 0));
            this.actualCost = (__runInitializers(this, _estimatedCost_extraInitializers), __runInitializers(this, _actualCost_initializers, void 0));
            this.laborCost = (__runInitializers(this, _actualCost_extraInitializers), __runInitializers(this, _laborCost_initializers, void 0));
            this.materialCost = (__runInitializers(this, _laborCost_extraInitializers), __runInitializers(this, _materialCost_initializers, void 0));
            this.status = (__runInitializers(this, _materialCost_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.assignedTo = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _assignedTo_initializers, void 0));
            this.assignedDate = (__runInitializers(this, _assignedTo_extraInitializers), __runInitializers(this, _assignedDate_initializers, void 0));
            this.reviewedBy = (__runInitializers(this, _assignedDate_extraInitializers), __runInitializers(this, _reviewedBy_initializers, void 0));
            this.reviewedDate = (__runInitializers(this, _reviewedBy_extraInitializers), __runInitializers(this, _reviewedDate_initializers, void 0));
            this.reviewNotes = (__runInitializers(this, _reviewedDate_extraInitializers), __runInitializers(this, _reviewNotes_initializers, void 0));
            this.approvedBy = (__runInitializers(this, _reviewNotes_extraInitializers), __runInitializers(this, _approvedBy_initializers, void 0));
            this.approvedDate = (__runInitializers(this, _approvedBy_extraInitializers), __runInitializers(this, _approvedDate_initializers, void 0));
            this.rejectionReason = (__runInitializers(this, _approvedDate_extraInitializers), __runInitializers(this, _rejectionReason_initializers, void 0));
            this.resolutionDate = (__runInitializers(this, _rejectionReason_extraInitializers), __runInitializers(this, _resolutionDate_initializers, void 0));
            this.resolutionDescription = (__runInitializers(this, _resolutionDate_extraInitializers), __runInitializers(this, _resolutionDescription_initializers, void 0));
            this.photos = (__runInitializers(this, _resolutionDescription_extraInitializers), __runInitializers(this, _photos_initializers, void 0));
            this.documents = (__runInitializers(this, _photos_extraInitializers), __runInitializers(this, _documents_initializers, void 0));
            this.callbackScheduled = (__runInitializers(this, _documents_extraInitializers), __runInitializers(this, _callbackScheduled_initializers, void 0));
            this.callbackDate = (__runInitializers(this, _callbackScheduled_extraInitializers), __runInitializers(this, _callbackDate_initializers, void 0));
            this.completionDate = (__runInitializers(this, _callbackDate_extraInitializers), __runInitializers(this, _completionDate_initializers, void 0));
            this.completionNotes = (__runInitializers(this, _completionDate_extraInitializers), __runInitializers(this, _completionNotes_initializers, void 0));
            this.satisfactionRating = (__runInitializers(this, _completionNotes_extraInitializers), __runInitializers(this, _satisfactionRating_initializers, void 0));
            this.feedback = (__runInitializers(this, _satisfactionRating_extraInitializers), __runInitializers(this, _feedback_initializers, void 0));
            this.escalated = (__runInitializers(this, _feedback_extraInitializers), __runInitializers(this, _escalated_initializers, void 0));
            this.escalationLevel = (__runInitializers(this, _escalated_extraInitializers), __runInitializers(this, _escalationLevel_initializers, void 0));
            this.escalationReason = (__runInitializers(this, _escalationLevel_extraInitializers), __runInitializers(this, _escalationReason_initializers, void 0));
            this.disputeReason = (__runInitializers(this, _escalationReason_extraInitializers), __runInitializers(this, _disputeReason_initializers, void 0));
            this.disputeResolution = (__runInitializers(this, _disputeReason_extraInitializers), __runInitializers(this, _disputeResolution_initializers, void 0));
            this.tags = (__runInitializers(this, _disputeResolution_extraInitializers), __runInitializers(this, _tags_initializers, void 0));
            this.metadata = (__runInitializers(this, _tags_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdBy = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdBy_initializers, void 0));
            this.updatedBy = (__runInitializers(this, _createdBy_extraInitializers), __runInitializers(this, _updatedBy_initializers, void 0));
            __runInitializers(this, _updatedBy_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "WarrantyClaim");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.INTEGER), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _warrantyId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => construction_warranty_model_1.ConstructionWarranty), (0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _claimNumber_decorators = [(0, sequelize_typescript_1.AllowNull)(false), Unique, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _title_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(200))];
        _description_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _issueDate_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _reportedBy_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100))];
        _reportedByContact_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(200))];
        _priority_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(warranty_types_1.ClaimPriority.MEDIUM), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(warranty_types_1.ClaimPriority)),
            })];
        _component_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(200))];
        _location_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(200))];
        _defectDescription_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _rootCause_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _estimatedCost_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(12, 2))];
        _actualCost_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(12, 2))];
        _laborCost_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(12, 2))];
        _materialCost_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(12, 2))];
        _status_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(warranty_types_1.ClaimStatus.DRAFT), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(warranty_types_1.ClaimStatus)),
            })];
        _assignedTo_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100))];
        _assignedDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _reviewedBy_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100))];
        _reviewedDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _reviewNotes_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _approvedBy_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100))];
        _approvedDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _rejectionReason_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _resolutionDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _resolutionDescription_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _photos_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)([]), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING))];
        _documents_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)([]), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING))];
        _callbackScheduled_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)];
        _callbackDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _completionDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _completionNotes_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _satisfactionRating_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _feedback_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _escalated_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)];
        _escalationLevel_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _escalationReason_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _disputeReason_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _disputeResolution_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _tags_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)([]), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING))];
        _metadata_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)({}), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON)];
        _createdBy_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100))];
        _updatedBy_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100))];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _warrantyId_decorators, { kind: "field", name: "warrantyId", static: false, private: false, access: { has: obj => "warrantyId" in obj, get: obj => obj.warrantyId, set: (obj, value) => { obj.warrantyId = value; } }, metadata: _metadata }, _warrantyId_initializers, _warrantyId_extraInitializers);
        __esDecorate(null, null, _claimNumber_decorators, { kind: "field", name: "claimNumber", static: false, private: false, access: { has: obj => "claimNumber" in obj, get: obj => obj.claimNumber, set: (obj, value) => { obj.claimNumber = value; } }, metadata: _metadata }, _claimNumber_initializers, _claimNumber_extraInitializers);
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _issueDate_decorators, { kind: "field", name: "issueDate", static: false, private: false, access: { has: obj => "issueDate" in obj, get: obj => obj.issueDate, set: (obj, value) => { obj.issueDate = value; } }, metadata: _metadata }, _issueDate_initializers, _issueDate_extraInitializers);
        __esDecorate(null, null, _reportedBy_decorators, { kind: "field", name: "reportedBy", static: false, private: false, access: { has: obj => "reportedBy" in obj, get: obj => obj.reportedBy, set: (obj, value) => { obj.reportedBy = value; } }, metadata: _metadata }, _reportedBy_initializers, _reportedBy_extraInitializers);
        __esDecorate(null, null, _reportedByContact_decorators, { kind: "field", name: "reportedByContact", static: false, private: false, access: { has: obj => "reportedByContact" in obj, get: obj => obj.reportedByContact, set: (obj, value) => { obj.reportedByContact = value; } }, metadata: _metadata }, _reportedByContact_initializers, _reportedByContact_extraInitializers);
        __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
        __esDecorate(null, null, _component_decorators, { kind: "field", name: "component", static: false, private: false, access: { has: obj => "component" in obj, get: obj => obj.component, set: (obj, value) => { obj.component = value; } }, metadata: _metadata }, _component_initializers, _component_extraInitializers);
        __esDecorate(null, null, _location_decorators, { kind: "field", name: "location", static: false, private: false, access: { has: obj => "location" in obj, get: obj => obj.location, set: (obj, value) => { obj.location = value; } }, metadata: _metadata }, _location_initializers, _location_extraInitializers);
        __esDecorate(null, null, _defectDescription_decorators, { kind: "field", name: "defectDescription", static: false, private: false, access: { has: obj => "defectDescription" in obj, get: obj => obj.defectDescription, set: (obj, value) => { obj.defectDescription = value; } }, metadata: _metadata }, _defectDescription_initializers, _defectDescription_extraInitializers);
        __esDecorate(null, null, _rootCause_decorators, { kind: "field", name: "rootCause", static: false, private: false, access: { has: obj => "rootCause" in obj, get: obj => obj.rootCause, set: (obj, value) => { obj.rootCause = value; } }, metadata: _metadata }, _rootCause_initializers, _rootCause_extraInitializers);
        __esDecorate(null, null, _estimatedCost_decorators, { kind: "field", name: "estimatedCost", static: false, private: false, access: { has: obj => "estimatedCost" in obj, get: obj => obj.estimatedCost, set: (obj, value) => { obj.estimatedCost = value; } }, metadata: _metadata }, _estimatedCost_initializers, _estimatedCost_extraInitializers);
        __esDecorate(null, null, _actualCost_decorators, { kind: "field", name: "actualCost", static: false, private: false, access: { has: obj => "actualCost" in obj, get: obj => obj.actualCost, set: (obj, value) => { obj.actualCost = value; } }, metadata: _metadata }, _actualCost_initializers, _actualCost_extraInitializers);
        __esDecorate(null, null, _laborCost_decorators, { kind: "field", name: "laborCost", static: false, private: false, access: { has: obj => "laborCost" in obj, get: obj => obj.laborCost, set: (obj, value) => { obj.laborCost = value; } }, metadata: _metadata }, _laborCost_initializers, _laborCost_extraInitializers);
        __esDecorate(null, null, _materialCost_decorators, { kind: "field", name: "materialCost", static: false, private: false, access: { has: obj => "materialCost" in obj, get: obj => obj.materialCost, set: (obj, value) => { obj.materialCost = value; } }, metadata: _metadata }, _materialCost_initializers, _materialCost_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _assignedTo_decorators, { kind: "field", name: "assignedTo", static: false, private: false, access: { has: obj => "assignedTo" in obj, get: obj => obj.assignedTo, set: (obj, value) => { obj.assignedTo = value; } }, metadata: _metadata }, _assignedTo_initializers, _assignedTo_extraInitializers);
        __esDecorate(null, null, _assignedDate_decorators, { kind: "field", name: "assignedDate", static: false, private: false, access: { has: obj => "assignedDate" in obj, get: obj => obj.assignedDate, set: (obj, value) => { obj.assignedDate = value; } }, metadata: _metadata }, _assignedDate_initializers, _assignedDate_extraInitializers);
        __esDecorate(null, null, _reviewedBy_decorators, { kind: "field", name: "reviewedBy", static: false, private: false, access: { has: obj => "reviewedBy" in obj, get: obj => obj.reviewedBy, set: (obj, value) => { obj.reviewedBy = value; } }, metadata: _metadata }, _reviewedBy_initializers, _reviewedBy_extraInitializers);
        __esDecorate(null, null, _reviewedDate_decorators, { kind: "field", name: "reviewedDate", static: false, private: false, access: { has: obj => "reviewedDate" in obj, get: obj => obj.reviewedDate, set: (obj, value) => { obj.reviewedDate = value; } }, metadata: _metadata }, _reviewedDate_initializers, _reviewedDate_extraInitializers);
        __esDecorate(null, null, _reviewNotes_decorators, { kind: "field", name: "reviewNotes", static: false, private: false, access: { has: obj => "reviewNotes" in obj, get: obj => obj.reviewNotes, set: (obj, value) => { obj.reviewNotes = value; } }, metadata: _metadata }, _reviewNotes_initializers, _reviewNotes_extraInitializers);
        __esDecorate(null, null, _approvedBy_decorators, { kind: "field", name: "approvedBy", static: false, private: false, access: { has: obj => "approvedBy" in obj, get: obj => obj.approvedBy, set: (obj, value) => { obj.approvedBy = value; } }, metadata: _metadata }, _approvedBy_initializers, _approvedBy_extraInitializers);
        __esDecorate(null, null, _approvedDate_decorators, { kind: "field", name: "approvedDate", static: false, private: false, access: { has: obj => "approvedDate" in obj, get: obj => obj.approvedDate, set: (obj, value) => { obj.approvedDate = value; } }, metadata: _metadata }, _approvedDate_initializers, _approvedDate_extraInitializers);
        __esDecorate(null, null, _rejectionReason_decorators, { kind: "field", name: "rejectionReason", static: false, private: false, access: { has: obj => "rejectionReason" in obj, get: obj => obj.rejectionReason, set: (obj, value) => { obj.rejectionReason = value; } }, metadata: _metadata }, _rejectionReason_initializers, _rejectionReason_extraInitializers);
        __esDecorate(null, null, _resolutionDate_decorators, { kind: "field", name: "resolutionDate", static: false, private: false, access: { has: obj => "resolutionDate" in obj, get: obj => obj.resolutionDate, set: (obj, value) => { obj.resolutionDate = value; } }, metadata: _metadata }, _resolutionDate_initializers, _resolutionDate_extraInitializers);
        __esDecorate(null, null, _resolutionDescription_decorators, { kind: "field", name: "resolutionDescription", static: false, private: false, access: { has: obj => "resolutionDescription" in obj, get: obj => obj.resolutionDescription, set: (obj, value) => { obj.resolutionDescription = value; } }, metadata: _metadata }, _resolutionDescription_initializers, _resolutionDescription_extraInitializers);
        __esDecorate(null, null, _photos_decorators, { kind: "field", name: "photos", static: false, private: false, access: { has: obj => "photos" in obj, get: obj => obj.photos, set: (obj, value) => { obj.photos = value; } }, metadata: _metadata }, _photos_initializers, _photos_extraInitializers);
        __esDecorate(null, null, _documents_decorators, { kind: "field", name: "documents", static: false, private: false, access: { has: obj => "documents" in obj, get: obj => obj.documents, set: (obj, value) => { obj.documents = value; } }, metadata: _metadata }, _documents_initializers, _documents_extraInitializers);
        __esDecorate(null, null, _callbackScheduled_decorators, { kind: "field", name: "callbackScheduled", static: false, private: false, access: { has: obj => "callbackScheduled" in obj, get: obj => obj.callbackScheduled, set: (obj, value) => { obj.callbackScheduled = value; } }, metadata: _metadata }, _callbackScheduled_initializers, _callbackScheduled_extraInitializers);
        __esDecorate(null, null, _callbackDate_decorators, { kind: "field", name: "callbackDate", static: false, private: false, access: { has: obj => "callbackDate" in obj, get: obj => obj.callbackDate, set: (obj, value) => { obj.callbackDate = value; } }, metadata: _metadata }, _callbackDate_initializers, _callbackDate_extraInitializers);
        __esDecorate(null, null, _completionDate_decorators, { kind: "field", name: "completionDate", static: false, private: false, access: { has: obj => "completionDate" in obj, get: obj => obj.completionDate, set: (obj, value) => { obj.completionDate = value; } }, metadata: _metadata }, _completionDate_initializers, _completionDate_extraInitializers);
        __esDecorate(null, null, _completionNotes_decorators, { kind: "field", name: "completionNotes", static: false, private: false, access: { has: obj => "completionNotes" in obj, get: obj => obj.completionNotes, set: (obj, value) => { obj.completionNotes = value; } }, metadata: _metadata }, _completionNotes_initializers, _completionNotes_extraInitializers);
        __esDecorate(null, null, _satisfactionRating_decorators, { kind: "field", name: "satisfactionRating", static: false, private: false, access: { has: obj => "satisfactionRating" in obj, get: obj => obj.satisfactionRating, set: (obj, value) => { obj.satisfactionRating = value; } }, metadata: _metadata }, _satisfactionRating_initializers, _satisfactionRating_extraInitializers);
        __esDecorate(null, null, _feedback_decorators, { kind: "field", name: "feedback", static: false, private: false, access: { has: obj => "feedback" in obj, get: obj => obj.feedback, set: (obj, value) => { obj.feedback = value; } }, metadata: _metadata }, _feedback_initializers, _feedback_extraInitializers);
        __esDecorate(null, null, _escalated_decorators, { kind: "field", name: "escalated", static: false, private: false, access: { has: obj => "escalated" in obj, get: obj => obj.escalated, set: (obj, value) => { obj.escalated = value; } }, metadata: _metadata }, _escalated_initializers, _escalated_extraInitializers);
        __esDecorate(null, null, _escalationLevel_decorators, { kind: "field", name: "escalationLevel", static: false, private: false, access: { has: obj => "escalationLevel" in obj, get: obj => obj.escalationLevel, set: (obj, value) => { obj.escalationLevel = value; } }, metadata: _metadata }, _escalationLevel_initializers, _escalationLevel_extraInitializers);
        __esDecorate(null, null, _escalationReason_decorators, { kind: "field", name: "escalationReason", static: false, private: false, access: { has: obj => "escalationReason" in obj, get: obj => obj.escalationReason, set: (obj, value) => { obj.escalationReason = value; } }, metadata: _metadata }, _escalationReason_initializers, _escalationReason_extraInitializers);
        __esDecorate(null, null, _disputeReason_decorators, { kind: "field", name: "disputeReason", static: false, private: false, access: { has: obj => "disputeReason" in obj, get: obj => obj.disputeReason, set: (obj, value) => { obj.disputeReason = value; } }, metadata: _metadata }, _disputeReason_initializers, _disputeReason_extraInitializers);
        __esDecorate(null, null, _disputeResolution_decorators, { kind: "field", name: "disputeResolution", static: false, private: false, access: { has: obj => "disputeResolution" in obj, get: obj => obj.disputeResolution, set: (obj, value) => { obj.disputeResolution = value; } }, metadata: _metadata }, _disputeResolution_initializers, _disputeResolution_extraInitializers);
        __esDecorate(null, null, _tags_decorators, { kind: "field", name: "tags", static: false, private: false, access: { has: obj => "tags" in obj, get: obj => obj.tags, set: (obj, value) => { obj.tags = value; } }, metadata: _metadata }, _tags_initializers, _tags_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdBy_decorators, { kind: "field", name: "createdBy", static: false, private: false, access: { has: obj => "createdBy" in obj, get: obj => obj.createdBy, set: (obj, value) => { obj.createdBy = value; } }, metadata: _metadata }, _createdBy_initializers, _createdBy_extraInitializers);
        __esDecorate(null, null, _updatedBy_decorators, { kind: "field", name: "updatedBy", static: false, private: false, access: { has: obj => "updatedBy" in obj, get: obj => obj.updatedBy, set: (obj, value) => { obj.updatedBy = value; } }, metadata: _metadata }, _updatedBy_initializers, _updatedBy_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        WarrantyClaim = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return WarrantyClaim = _classThis;
})();
exports.WarrantyClaim = WarrantyClaim;
//# sourceMappingURL=warranty-claim.model.js.map