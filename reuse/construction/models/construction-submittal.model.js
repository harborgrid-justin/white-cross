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
exports.ConstructionSubmittal = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const submittal_types_1 = require("../types/submittal.types");
const submittal_review_model_1 = require("./submittal-review.model");
let ConstructionSubmittal = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'construction_submittals',
            timestamps: true,
            indexes: [
                { fields: ['projectId'] },
                { fields: ['submittalNumber'], unique: true },
                { fields: ['specSection'] },
                { fields: ['status'] },
                { fields: ['priority'] },
                { fields: ['assignedReviewer'] },
                { fields: ['ballInCourt'] },
                { fields: ['dateRequired'] },
                { fields: ['isOverdue'] },
                { fields: ['projectId', 'status'] },
                { fields: ['projectId', 'specSection'] },
                { fields: ['projectId', 'dateRequired'] },
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
    let _submittalNumber_decorators;
    let _submittalNumber_initializers = [];
    let _submittalNumber_extraInitializers = [];
    let _specSection_decorators;
    let _specSection_initializers = [];
    let _specSection_extraInitializers = [];
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _type_decorators;
    let _type_initializers = [];
    let _type_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _submittedBy_decorators;
    let _submittedBy_initializers = [];
    let _submittedBy_extraInitializers = [];
    let _submittedByCompany_decorators;
    let _submittedByCompany_initializers = [];
    let _submittedByCompany_extraInitializers = [];
    let _submittedByEmail_decorators;
    let _submittedByEmail_initializers = [];
    let _submittedByEmail_extraInitializers = [];
    let _dateSubmitted_decorators;
    let _dateSubmitted_initializers = [];
    let _dateSubmitted_extraInitializers = [];
    let _dateRequired_decorators;
    let _dateRequired_initializers = [];
    let _dateRequired_extraInitializers = [];
    let _dateReceived_decorators;
    let _dateReceived_initializers = [];
    let _dateReceived_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _revisionNumber_decorators;
    let _revisionNumber_initializers = [];
    let _revisionNumber_extraInitializers = [];
    let _originalSubmittalId_decorators;
    let _originalSubmittalId_initializers = [];
    let _originalSubmittalId_extraInitializers = [];
    let _ballInCourt_decorators;
    let _ballInCourt_initializers = [];
    let _ballInCourt_extraInitializers = [];
    let _assignedReviewer_decorators;
    let _assignedReviewer_initializers = [];
    let _assignedReviewer_extraInitializers = [];
    let _assignedReviewerEmail_decorators;
    let _assignedReviewerEmail_initializers = [];
    let _assignedReviewerEmail_extraInitializers = [];
    let _reviewStartDate_decorators;
    let _reviewStartDate_initializers = [];
    let _reviewStartDate_extraInitializers = [];
    let _reviewCompletedDate_decorators;
    let _reviewCompletedDate_initializers = [];
    let _reviewCompletedDate_extraInitializers = [];
    let _finalAction_decorators;
    let _finalAction_initializers = [];
    let _finalAction_extraInitializers = [];
    let _finalActionBy_decorators;
    let _finalActionBy_initializers = [];
    let _finalActionBy_extraInitializers = [];
    let _finalActionDate_decorators;
    let _finalActionDate_initializers = [];
    let _finalActionDate_extraInitializers = [];
    let _leadTimeDays_decorators;
    let _leadTimeDays_initializers = [];
    let _leadTimeDays_extraInitializers = [];
    let _daysInReview_decorators;
    let _daysInReview_initializers = [];
    let _daysInReview_extraInitializers = [];
    let _isOverdue_decorators;
    let _isOverdue_initializers = [];
    let _isOverdue_extraInitializers = [];
    let _closedDate_decorators;
    let _closedDate_initializers = [];
    let _closedDate_extraInitializers = [];
    let _closedBy_decorators;
    let _closedBy_initializers = [];
    let _closedBy_extraInitializers = [];
    let _documentUrls_decorators;
    let _documentUrls_initializers = [];
    let _documentUrls_extraInitializers = [];
    let _markupUrls_decorators;
    let _markupUrls_initializers = [];
    let _markupUrls_extraInitializers = [];
    let _complianceVerified_decorators;
    let _complianceVerified_initializers = [];
    let _complianceVerified_extraInitializers = [];
    let _complianceScore_decorators;
    let _complianceScore_initializers = [];
    let _complianceScore_extraInitializers = [];
    let _tags_decorators;
    let _tags_initializers = [];
    let _tags_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _reviews_decorators;
    let _reviews_initializers = [];
    let _reviews_extraInitializers = [];
    var ConstructionSubmittal = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.projectId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _projectId_initializers, void 0));
            this.submittalNumber = (__runInitializers(this, _projectId_extraInitializers), __runInitializers(this, _submittalNumber_initializers, void 0));
            this.specSection = (__runInitializers(this, _submittalNumber_extraInitializers), __runInitializers(this, _specSection_initializers, void 0));
            this.title = (__runInitializers(this, _specSection_extraInitializers), __runInitializers(this, _title_initializers, void 0));
            this.type = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _type_initializers, void 0));
            this.description = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.submittedBy = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _submittedBy_initializers, void 0));
            this.submittedByCompany = (__runInitializers(this, _submittedBy_extraInitializers), __runInitializers(this, _submittedByCompany_initializers, void 0));
            this.submittedByEmail = (__runInitializers(this, _submittedByCompany_extraInitializers), __runInitializers(this, _submittedByEmail_initializers, void 0));
            this.dateSubmitted = (__runInitializers(this, _submittedByEmail_extraInitializers), __runInitializers(this, _dateSubmitted_initializers, void 0));
            this.dateRequired = (__runInitializers(this, _dateSubmitted_extraInitializers), __runInitializers(this, _dateRequired_initializers, void 0));
            this.dateReceived = (__runInitializers(this, _dateRequired_extraInitializers), __runInitializers(this, _dateReceived_initializers, void 0));
            this.priority = (__runInitializers(this, _dateReceived_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
            this.status = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.revisionNumber = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _revisionNumber_initializers, void 0));
            this.originalSubmittalId = (__runInitializers(this, _revisionNumber_extraInitializers), __runInitializers(this, _originalSubmittalId_initializers, void 0));
            this.ballInCourt = (__runInitializers(this, _originalSubmittalId_extraInitializers), __runInitializers(this, _ballInCourt_initializers, void 0));
            this.assignedReviewer = (__runInitializers(this, _ballInCourt_extraInitializers), __runInitializers(this, _assignedReviewer_initializers, void 0));
            this.assignedReviewerEmail = (__runInitializers(this, _assignedReviewer_extraInitializers), __runInitializers(this, _assignedReviewerEmail_initializers, void 0));
            this.reviewStartDate = (__runInitializers(this, _assignedReviewerEmail_extraInitializers), __runInitializers(this, _reviewStartDate_initializers, void 0));
            this.reviewCompletedDate = (__runInitializers(this, _reviewStartDate_extraInitializers), __runInitializers(this, _reviewCompletedDate_initializers, void 0));
            this.finalAction = (__runInitializers(this, _reviewCompletedDate_extraInitializers), __runInitializers(this, _finalAction_initializers, void 0));
            this.finalActionBy = (__runInitializers(this, _finalAction_extraInitializers), __runInitializers(this, _finalActionBy_initializers, void 0));
            this.finalActionDate = (__runInitializers(this, _finalActionBy_extraInitializers), __runInitializers(this, _finalActionDate_initializers, void 0));
            this.leadTimeDays = (__runInitializers(this, _finalActionDate_extraInitializers), __runInitializers(this, _leadTimeDays_initializers, void 0));
            this.daysInReview = (__runInitializers(this, _leadTimeDays_extraInitializers), __runInitializers(this, _daysInReview_initializers, void 0));
            this.isOverdue = (__runInitializers(this, _daysInReview_extraInitializers), __runInitializers(this, _isOverdue_initializers, void 0));
            this.closedDate = (__runInitializers(this, _isOverdue_extraInitializers), __runInitializers(this, _closedDate_initializers, void 0));
            this.closedBy = (__runInitializers(this, _closedDate_extraInitializers), __runInitializers(this, _closedBy_initializers, void 0));
            this.documentUrls = (__runInitializers(this, _closedBy_extraInitializers), __runInitializers(this, _documentUrls_initializers, void 0));
            this.markupUrls = (__runInitializers(this, _documentUrls_extraInitializers), __runInitializers(this, _markupUrls_initializers, void 0));
            this.complianceVerified = (__runInitializers(this, _markupUrls_extraInitializers), __runInitializers(this, _complianceVerified_initializers, void 0));
            this.complianceScore = (__runInitializers(this, _complianceVerified_extraInitializers), __runInitializers(this, _complianceScore_initializers, void 0));
            this.tags = (__runInitializers(this, _complianceScore_extraInitializers), __runInitializers(this, _tags_initializers, void 0));
            this.metadata = (__runInitializers(this, _tags_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.reviews = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _reviews_initializers, void 0));
            __runInitializers(this, _reviews_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ConstructionSubmittal");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _projectId_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _submittalNumber_decorators = [(0, sequelize_typescript_1.AllowNull)(false), Unique, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _specSection_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _title_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(500))];
        _type_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(submittal_types_1.SubmittalType)),
            })];
        _description_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _submittedBy_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100))];
        _submittedByCompany_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(200))];
        _submittedByEmail_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(200))];
        _dateSubmitted_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _dateRequired_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _dateReceived_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _priority_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(submittal_types_1.SubmittalPriority.MEDIUM), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(submittal_types_1.SubmittalPriority)),
            })];
        _status_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(submittal_types_1.SubmittalStatus.DRAFT), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(submittal_types_1.SubmittalStatus)),
            })];
        _revisionNumber_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _originalSubmittalId_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _ballInCourt_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100))];
        _assignedReviewer_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100))];
        _assignedReviewerEmail_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(200))];
        _reviewStartDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _reviewCompletedDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _finalAction_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _finalActionBy_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100))];
        _finalActionDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _leadTimeDays_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(14), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _daysInReview_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _isOverdue_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)];
        _closedDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _closedBy_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100))];
        _documentUrls_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)([]), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON)];
        _markupUrls_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)([]), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON)];
        _complianceVerified_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)];
        _complianceScore_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(5, 2))];
        _tags_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)([]), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON)];
        _metadata_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)({}), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON)];
        _reviews_decorators = [(0, sequelize_typescript_1.HasMany)(() => submittal_review_model_1.SubmittalReview)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _projectId_decorators, { kind: "field", name: "projectId", static: false, private: false, access: { has: obj => "projectId" in obj, get: obj => obj.projectId, set: (obj, value) => { obj.projectId = value; } }, metadata: _metadata }, _projectId_initializers, _projectId_extraInitializers);
        __esDecorate(null, null, _submittalNumber_decorators, { kind: "field", name: "submittalNumber", static: false, private: false, access: { has: obj => "submittalNumber" in obj, get: obj => obj.submittalNumber, set: (obj, value) => { obj.submittalNumber = value; } }, metadata: _metadata }, _submittalNumber_initializers, _submittalNumber_extraInitializers);
        __esDecorate(null, null, _specSection_decorators, { kind: "field", name: "specSection", static: false, private: false, access: { has: obj => "specSection" in obj, get: obj => obj.specSection, set: (obj, value) => { obj.specSection = value; } }, metadata: _metadata }, _specSection_initializers, _specSection_extraInitializers);
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
        __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: obj => "type" in obj, get: obj => obj.type, set: (obj, value) => { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _submittedBy_decorators, { kind: "field", name: "submittedBy", static: false, private: false, access: { has: obj => "submittedBy" in obj, get: obj => obj.submittedBy, set: (obj, value) => { obj.submittedBy = value; } }, metadata: _metadata }, _submittedBy_initializers, _submittedBy_extraInitializers);
        __esDecorate(null, null, _submittedByCompany_decorators, { kind: "field", name: "submittedByCompany", static: false, private: false, access: { has: obj => "submittedByCompany" in obj, get: obj => obj.submittedByCompany, set: (obj, value) => { obj.submittedByCompany = value; } }, metadata: _metadata }, _submittedByCompany_initializers, _submittedByCompany_extraInitializers);
        __esDecorate(null, null, _submittedByEmail_decorators, { kind: "field", name: "submittedByEmail", static: false, private: false, access: { has: obj => "submittedByEmail" in obj, get: obj => obj.submittedByEmail, set: (obj, value) => { obj.submittedByEmail = value; } }, metadata: _metadata }, _submittedByEmail_initializers, _submittedByEmail_extraInitializers);
        __esDecorate(null, null, _dateSubmitted_decorators, { kind: "field", name: "dateSubmitted", static: false, private: false, access: { has: obj => "dateSubmitted" in obj, get: obj => obj.dateSubmitted, set: (obj, value) => { obj.dateSubmitted = value; } }, metadata: _metadata }, _dateSubmitted_initializers, _dateSubmitted_extraInitializers);
        __esDecorate(null, null, _dateRequired_decorators, { kind: "field", name: "dateRequired", static: false, private: false, access: { has: obj => "dateRequired" in obj, get: obj => obj.dateRequired, set: (obj, value) => { obj.dateRequired = value; } }, metadata: _metadata }, _dateRequired_initializers, _dateRequired_extraInitializers);
        __esDecorate(null, null, _dateReceived_decorators, { kind: "field", name: "dateReceived", static: false, private: false, access: { has: obj => "dateReceived" in obj, get: obj => obj.dateReceived, set: (obj, value) => { obj.dateReceived = value; } }, metadata: _metadata }, _dateReceived_initializers, _dateReceived_extraInitializers);
        __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _revisionNumber_decorators, { kind: "field", name: "revisionNumber", static: false, private: false, access: { has: obj => "revisionNumber" in obj, get: obj => obj.revisionNumber, set: (obj, value) => { obj.revisionNumber = value; } }, metadata: _metadata }, _revisionNumber_initializers, _revisionNumber_extraInitializers);
        __esDecorate(null, null, _originalSubmittalId_decorators, { kind: "field", name: "originalSubmittalId", static: false, private: false, access: { has: obj => "originalSubmittalId" in obj, get: obj => obj.originalSubmittalId, set: (obj, value) => { obj.originalSubmittalId = value; } }, metadata: _metadata }, _originalSubmittalId_initializers, _originalSubmittalId_extraInitializers);
        __esDecorate(null, null, _ballInCourt_decorators, { kind: "field", name: "ballInCourt", static: false, private: false, access: { has: obj => "ballInCourt" in obj, get: obj => obj.ballInCourt, set: (obj, value) => { obj.ballInCourt = value; } }, metadata: _metadata }, _ballInCourt_initializers, _ballInCourt_extraInitializers);
        __esDecorate(null, null, _assignedReviewer_decorators, { kind: "field", name: "assignedReviewer", static: false, private: false, access: { has: obj => "assignedReviewer" in obj, get: obj => obj.assignedReviewer, set: (obj, value) => { obj.assignedReviewer = value; } }, metadata: _metadata }, _assignedReviewer_initializers, _assignedReviewer_extraInitializers);
        __esDecorate(null, null, _assignedReviewerEmail_decorators, { kind: "field", name: "assignedReviewerEmail", static: false, private: false, access: { has: obj => "assignedReviewerEmail" in obj, get: obj => obj.assignedReviewerEmail, set: (obj, value) => { obj.assignedReviewerEmail = value; } }, metadata: _metadata }, _assignedReviewerEmail_initializers, _assignedReviewerEmail_extraInitializers);
        __esDecorate(null, null, _reviewStartDate_decorators, { kind: "field", name: "reviewStartDate", static: false, private: false, access: { has: obj => "reviewStartDate" in obj, get: obj => obj.reviewStartDate, set: (obj, value) => { obj.reviewStartDate = value; } }, metadata: _metadata }, _reviewStartDate_initializers, _reviewStartDate_extraInitializers);
        __esDecorate(null, null, _reviewCompletedDate_decorators, { kind: "field", name: "reviewCompletedDate", static: false, private: false, access: { has: obj => "reviewCompletedDate" in obj, get: obj => obj.reviewCompletedDate, set: (obj, value) => { obj.reviewCompletedDate = value; } }, metadata: _metadata }, _reviewCompletedDate_initializers, _reviewCompletedDate_extraInitializers);
        __esDecorate(null, null, _finalAction_decorators, { kind: "field", name: "finalAction", static: false, private: false, access: { has: obj => "finalAction" in obj, get: obj => obj.finalAction, set: (obj, value) => { obj.finalAction = value; } }, metadata: _metadata }, _finalAction_initializers, _finalAction_extraInitializers);
        __esDecorate(null, null, _finalActionBy_decorators, { kind: "field", name: "finalActionBy", static: false, private: false, access: { has: obj => "finalActionBy" in obj, get: obj => obj.finalActionBy, set: (obj, value) => { obj.finalActionBy = value; } }, metadata: _metadata }, _finalActionBy_initializers, _finalActionBy_extraInitializers);
        __esDecorate(null, null, _finalActionDate_decorators, { kind: "field", name: "finalActionDate", static: false, private: false, access: { has: obj => "finalActionDate" in obj, get: obj => obj.finalActionDate, set: (obj, value) => { obj.finalActionDate = value; } }, metadata: _metadata }, _finalActionDate_initializers, _finalActionDate_extraInitializers);
        __esDecorate(null, null, _leadTimeDays_decorators, { kind: "field", name: "leadTimeDays", static: false, private: false, access: { has: obj => "leadTimeDays" in obj, get: obj => obj.leadTimeDays, set: (obj, value) => { obj.leadTimeDays = value; } }, metadata: _metadata }, _leadTimeDays_initializers, _leadTimeDays_extraInitializers);
        __esDecorate(null, null, _daysInReview_decorators, { kind: "field", name: "daysInReview", static: false, private: false, access: { has: obj => "daysInReview" in obj, get: obj => obj.daysInReview, set: (obj, value) => { obj.daysInReview = value; } }, metadata: _metadata }, _daysInReview_initializers, _daysInReview_extraInitializers);
        __esDecorate(null, null, _isOverdue_decorators, { kind: "field", name: "isOverdue", static: false, private: false, access: { has: obj => "isOverdue" in obj, get: obj => obj.isOverdue, set: (obj, value) => { obj.isOverdue = value; } }, metadata: _metadata }, _isOverdue_initializers, _isOverdue_extraInitializers);
        __esDecorate(null, null, _closedDate_decorators, { kind: "field", name: "closedDate", static: false, private: false, access: { has: obj => "closedDate" in obj, get: obj => obj.closedDate, set: (obj, value) => { obj.closedDate = value; } }, metadata: _metadata }, _closedDate_initializers, _closedDate_extraInitializers);
        __esDecorate(null, null, _closedBy_decorators, { kind: "field", name: "closedBy", static: false, private: false, access: { has: obj => "closedBy" in obj, get: obj => obj.closedBy, set: (obj, value) => { obj.closedBy = value; } }, metadata: _metadata }, _closedBy_initializers, _closedBy_extraInitializers);
        __esDecorate(null, null, _documentUrls_decorators, { kind: "field", name: "documentUrls", static: false, private: false, access: { has: obj => "documentUrls" in obj, get: obj => obj.documentUrls, set: (obj, value) => { obj.documentUrls = value; } }, metadata: _metadata }, _documentUrls_initializers, _documentUrls_extraInitializers);
        __esDecorate(null, null, _markupUrls_decorators, { kind: "field", name: "markupUrls", static: false, private: false, access: { has: obj => "markupUrls" in obj, get: obj => obj.markupUrls, set: (obj, value) => { obj.markupUrls = value; } }, metadata: _metadata }, _markupUrls_initializers, _markupUrls_extraInitializers);
        __esDecorate(null, null, _complianceVerified_decorators, { kind: "field", name: "complianceVerified", static: false, private: false, access: { has: obj => "complianceVerified" in obj, get: obj => obj.complianceVerified, set: (obj, value) => { obj.complianceVerified = value; } }, metadata: _metadata }, _complianceVerified_initializers, _complianceVerified_extraInitializers);
        __esDecorate(null, null, _complianceScore_decorators, { kind: "field", name: "complianceScore", static: false, private: false, access: { has: obj => "complianceScore" in obj, get: obj => obj.complianceScore, set: (obj, value) => { obj.complianceScore = value; } }, metadata: _metadata }, _complianceScore_initializers, _complianceScore_extraInitializers);
        __esDecorate(null, null, _tags_decorators, { kind: "field", name: "tags", static: false, private: false, access: { has: obj => "tags" in obj, get: obj => obj.tags, set: (obj, value) => { obj.tags = value; } }, metadata: _metadata }, _tags_initializers, _tags_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _reviews_decorators, { kind: "field", name: "reviews", static: false, private: false, access: { has: obj => "reviews" in obj, get: obj => obj.reviews, set: (obj, value) => { obj.reviews = value; } }, metadata: _metadata }, _reviews_initializers, _reviews_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ConstructionSubmittal = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ConstructionSubmittal = _classThis;
})();
exports.ConstructionSubmittal = ConstructionSubmittal;
//# sourceMappingURL=construction-submittal.model.js.map