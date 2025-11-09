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
exports.ConstructionDocument = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const document_types_1 = require("../types/document.types");
const document_revision_model_1 = require("./document-revision.model");
const document_distribution_model_1 = require("./document-distribution.model");
let ConstructionDocument = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'construction_documents', timestamps: true, paranoid: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _documentNumber_decorators;
    let _documentNumber_initializers = [];
    let _documentNumber_extraInitializers = [];
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _documentType_decorators;
    let _documentType_initializers = [];
    let _documentType_extraInitializers = [];
    let _discipline_decorators;
    let _discipline_initializers = [];
    let _discipline_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _projectId_decorators;
    let _projectId_initializers = [];
    let _projectId_extraInitializers = [];
    let _revision_decorators;
    let _revision_initializers = [];
    let _revision_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _fileUrl_decorators;
    let _fileUrl_initializers = [];
    let _fileUrl_extraInitializers = [];
    let _fileName_decorators;
    let _fileName_initializers = [];
    let _fileName_extraInitializers = [];
    let _fileSize_decorators;
    let _fileSize_initializers = [];
    let _fileSize_extraInitializers = [];
    let _mimeType_decorators;
    let _mimeType_initializers = [];
    let _mimeType_extraInitializers = [];
    let _parentDocumentId_decorators;
    let _parentDocumentId_initializers = [];
    let _parentDocumentId_extraInitializers = [];
    let _createdBy_decorators;
    let _createdBy_initializers = [];
    let _createdBy_extraInitializers = [];
    let _approvedBy_decorators;
    let _approvedBy_initializers = [];
    let _approvedBy_extraInitializers = [];
    let _approvedAt_decorators;
    let _approvedAt_initializers = [];
    let _approvedAt_extraInitializers = [];
    let _issuedDate_decorators;
    let _issuedDate_initializers = [];
    let _issuedDate_extraInitializers = [];
    let _effectiveDate_decorators;
    let _effectiveDate_initializers = [];
    let _effectiveDate_extraInitializers = [];
    let _expirationDate_decorators;
    let _expirationDate_initializers = [];
    let _expirationDate_extraInitializers = [];
    let _tags_decorators;
    let _tags_initializers = [];
    let _tags_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _isLatestRevision_decorators;
    let _isLatestRevision_initializers = [];
    let _isLatestRevision_extraInitializers = [];
    let _requiresAcknowledgment_decorators;
    let _requiresAcknowledgment_initializers = [];
    let _requiresAcknowledgment_extraInitializers = [];
    let _retentionPeriod_decorators;
    let _retentionPeriod_initializers = [];
    let _retentionPeriod_extraInitializers = [];
    let _revisions_decorators;
    let _revisions_initializers = [];
    let _revisions_extraInitializers = [];
    let _distributions_decorators;
    let _distributions_initializers = [];
    let _distributions_extraInitializers = [];
    var ConstructionDocument = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.documentNumber = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _documentNumber_initializers, void 0));
            this.title = (__runInitializers(this, _documentNumber_extraInitializers), __runInitializers(this, _title_initializers, void 0));
            this.documentType = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _documentType_initializers, void 0));
            this.discipline = (__runInitializers(this, _documentType_extraInitializers), __runInitializers(this, _discipline_initializers, void 0));
            this.status = (__runInitializers(this, _discipline_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.projectId = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _projectId_initializers, void 0));
            this.revision = (__runInitializers(this, _projectId_extraInitializers), __runInitializers(this, _revision_initializers, void 0));
            this.description = (__runInitializers(this, _revision_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.fileUrl = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _fileUrl_initializers, void 0));
            this.fileName = (__runInitializers(this, _fileUrl_extraInitializers), __runInitializers(this, _fileName_initializers, void 0));
            this.fileSize = (__runInitializers(this, _fileName_extraInitializers), __runInitializers(this, _fileSize_initializers, void 0));
            this.mimeType = (__runInitializers(this, _fileSize_extraInitializers), __runInitializers(this, _mimeType_initializers, void 0));
            this.parentDocumentId = (__runInitializers(this, _mimeType_extraInitializers), __runInitializers(this, _parentDocumentId_initializers, void 0));
            this.createdBy = (__runInitializers(this, _parentDocumentId_extraInitializers), __runInitializers(this, _createdBy_initializers, void 0));
            this.approvedBy = (__runInitializers(this, _createdBy_extraInitializers), __runInitializers(this, _approvedBy_initializers, void 0));
            this.approvedAt = (__runInitializers(this, _approvedBy_extraInitializers), __runInitializers(this, _approvedAt_initializers, void 0));
            this.issuedDate = (__runInitializers(this, _approvedAt_extraInitializers), __runInitializers(this, _issuedDate_initializers, void 0));
            this.effectiveDate = (__runInitializers(this, _issuedDate_extraInitializers), __runInitializers(this, _effectiveDate_initializers, void 0));
            this.expirationDate = (__runInitializers(this, _effectiveDate_extraInitializers), __runInitializers(this, _expirationDate_initializers, void 0));
            this.tags = (__runInitializers(this, _expirationDate_extraInitializers), __runInitializers(this, _tags_initializers, void 0));
            this.metadata = (__runInitializers(this, _tags_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.isLatestRevision = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _isLatestRevision_initializers, void 0));
            this.requiresAcknowledgment = (__runInitializers(this, _isLatestRevision_extraInitializers), __runInitializers(this, _requiresAcknowledgment_initializers, void 0));
            this.retentionPeriod = (__runInitializers(this, _requiresAcknowledgment_extraInitializers), __runInitializers(this, _retentionPeriod_initializers, void 0));
            this.revisions = (__runInitializers(this, _retentionPeriod_extraInitializers), __runInitializers(this, _revisions_initializers, void 0));
            this.distributions = (__runInitializers(this, _revisions_extraInitializers), __runInitializers(this, _distributions_initializers, void 0));
            __runInitializers(this, _distributions_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ConstructionDocument");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _documentNumber_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(100),
                allowNull: false,
                unique: true,
            })];
        _title_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(500),
                allowNull: false,
            })];
        _documentType_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(document_types_1.DocumentType)),
                allowNull: false,
            })];
        _discipline_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(document_types_1.DocumentDiscipline)),
                allowNull: false,
            })];
        _status_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(document_types_1.DocumentStatus)),
                defaultValue: document_types_1.DocumentStatus.DRAFT,
            })];
        _projectId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            })];
        _revision_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: false,
            })];
        _description_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(1000),
            })];
        _fileUrl_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(500),
                allowNull: false,
            })];
        _fileName_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(100),
            })];
        _fileSize_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BIGINT,
            })];
        _mimeType_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(100),
            })];
        _parentDocumentId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
            })];
        _createdBy_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            })];
        _approvedBy_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
            })];
        _approvedAt_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
            })];
        _issuedDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
            })];
        _effectiveDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
            })];
        _expirationDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
            })];
        _tags_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                defaultValue: [],
            })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
            })];
        _isLatestRevision_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                defaultValue: true,
            })];
        _requiresAcknowledgment_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                defaultValue: false,
            })];
        _retentionPeriod_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(document_types_1.RetentionPeriod)),
                defaultValue: document_types_1.RetentionPeriod.SEVEN_YEARS,
            })];
        _revisions_decorators = [(0, sequelize_typescript_1.HasMany)(() => document_revision_model_1.DocumentRevision, 'documentId')];
        _distributions_decorators = [(0, sequelize_typescript_1.HasMany)(() => document_distribution_model_1.DocumentDistribution, 'documentId')];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _documentNumber_decorators, { kind: "field", name: "documentNumber", static: false, private: false, access: { has: obj => "documentNumber" in obj, get: obj => obj.documentNumber, set: (obj, value) => { obj.documentNumber = value; } }, metadata: _metadata }, _documentNumber_initializers, _documentNumber_extraInitializers);
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
        __esDecorate(null, null, _documentType_decorators, { kind: "field", name: "documentType", static: false, private: false, access: { has: obj => "documentType" in obj, get: obj => obj.documentType, set: (obj, value) => { obj.documentType = value; } }, metadata: _metadata }, _documentType_initializers, _documentType_extraInitializers);
        __esDecorate(null, null, _discipline_decorators, { kind: "field", name: "discipline", static: false, private: false, access: { has: obj => "discipline" in obj, get: obj => obj.discipline, set: (obj, value) => { obj.discipline = value; } }, metadata: _metadata }, _discipline_initializers, _discipline_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _projectId_decorators, { kind: "field", name: "projectId", static: false, private: false, access: { has: obj => "projectId" in obj, get: obj => obj.projectId, set: (obj, value) => { obj.projectId = value; } }, metadata: _metadata }, _projectId_initializers, _projectId_extraInitializers);
        __esDecorate(null, null, _revision_decorators, { kind: "field", name: "revision", static: false, private: false, access: { has: obj => "revision" in obj, get: obj => obj.revision, set: (obj, value) => { obj.revision = value; } }, metadata: _metadata }, _revision_initializers, _revision_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _fileUrl_decorators, { kind: "field", name: "fileUrl", static: false, private: false, access: { has: obj => "fileUrl" in obj, get: obj => obj.fileUrl, set: (obj, value) => { obj.fileUrl = value; } }, metadata: _metadata }, _fileUrl_initializers, _fileUrl_extraInitializers);
        __esDecorate(null, null, _fileName_decorators, { kind: "field", name: "fileName", static: false, private: false, access: { has: obj => "fileName" in obj, get: obj => obj.fileName, set: (obj, value) => { obj.fileName = value; } }, metadata: _metadata }, _fileName_initializers, _fileName_extraInitializers);
        __esDecorate(null, null, _fileSize_decorators, { kind: "field", name: "fileSize", static: false, private: false, access: { has: obj => "fileSize" in obj, get: obj => obj.fileSize, set: (obj, value) => { obj.fileSize = value; } }, metadata: _metadata }, _fileSize_initializers, _fileSize_extraInitializers);
        __esDecorate(null, null, _mimeType_decorators, { kind: "field", name: "mimeType", static: false, private: false, access: { has: obj => "mimeType" in obj, get: obj => obj.mimeType, set: (obj, value) => { obj.mimeType = value; } }, metadata: _metadata }, _mimeType_initializers, _mimeType_extraInitializers);
        __esDecorate(null, null, _parentDocumentId_decorators, { kind: "field", name: "parentDocumentId", static: false, private: false, access: { has: obj => "parentDocumentId" in obj, get: obj => obj.parentDocumentId, set: (obj, value) => { obj.parentDocumentId = value; } }, metadata: _metadata }, _parentDocumentId_initializers, _parentDocumentId_extraInitializers);
        __esDecorate(null, null, _createdBy_decorators, { kind: "field", name: "createdBy", static: false, private: false, access: { has: obj => "createdBy" in obj, get: obj => obj.createdBy, set: (obj, value) => { obj.createdBy = value; } }, metadata: _metadata }, _createdBy_initializers, _createdBy_extraInitializers);
        __esDecorate(null, null, _approvedBy_decorators, { kind: "field", name: "approvedBy", static: false, private: false, access: { has: obj => "approvedBy" in obj, get: obj => obj.approvedBy, set: (obj, value) => { obj.approvedBy = value; } }, metadata: _metadata }, _approvedBy_initializers, _approvedBy_extraInitializers);
        __esDecorate(null, null, _approvedAt_decorators, { kind: "field", name: "approvedAt", static: false, private: false, access: { has: obj => "approvedAt" in obj, get: obj => obj.approvedAt, set: (obj, value) => { obj.approvedAt = value; } }, metadata: _metadata }, _approvedAt_initializers, _approvedAt_extraInitializers);
        __esDecorate(null, null, _issuedDate_decorators, { kind: "field", name: "issuedDate", static: false, private: false, access: { has: obj => "issuedDate" in obj, get: obj => obj.issuedDate, set: (obj, value) => { obj.issuedDate = value; } }, metadata: _metadata }, _issuedDate_initializers, _issuedDate_extraInitializers);
        __esDecorate(null, null, _effectiveDate_decorators, { kind: "field", name: "effectiveDate", static: false, private: false, access: { has: obj => "effectiveDate" in obj, get: obj => obj.effectiveDate, set: (obj, value) => { obj.effectiveDate = value; } }, metadata: _metadata }, _effectiveDate_initializers, _effectiveDate_extraInitializers);
        __esDecorate(null, null, _expirationDate_decorators, { kind: "field", name: "expirationDate", static: false, private: false, access: { has: obj => "expirationDate" in obj, get: obj => obj.expirationDate, set: (obj, value) => { obj.expirationDate = value; } }, metadata: _metadata }, _expirationDate_initializers, _expirationDate_extraInitializers);
        __esDecorate(null, null, _tags_decorators, { kind: "field", name: "tags", static: false, private: false, access: { has: obj => "tags" in obj, get: obj => obj.tags, set: (obj, value) => { obj.tags = value; } }, metadata: _metadata }, _tags_initializers, _tags_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _isLatestRevision_decorators, { kind: "field", name: "isLatestRevision", static: false, private: false, access: { has: obj => "isLatestRevision" in obj, get: obj => obj.isLatestRevision, set: (obj, value) => { obj.isLatestRevision = value; } }, metadata: _metadata }, _isLatestRevision_initializers, _isLatestRevision_extraInitializers);
        __esDecorate(null, null, _requiresAcknowledgment_decorators, { kind: "field", name: "requiresAcknowledgment", static: false, private: false, access: { has: obj => "requiresAcknowledgment" in obj, get: obj => obj.requiresAcknowledgment, set: (obj, value) => { obj.requiresAcknowledgment = value; } }, metadata: _metadata }, _requiresAcknowledgment_initializers, _requiresAcknowledgment_extraInitializers);
        __esDecorate(null, null, _retentionPeriod_decorators, { kind: "field", name: "retentionPeriod", static: false, private: false, access: { has: obj => "retentionPeriod" in obj, get: obj => obj.retentionPeriod, set: (obj, value) => { obj.retentionPeriod = value; } }, metadata: _metadata }, _retentionPeriod_initializers, _retentionPeriod_extraInitializers);
        __esDecorate(null, null, _revisions_decorators, { kind: "field", name: "revisions", static: false, private: false, access: { has: obj => "revisions" in obj, get: obj => obj.revisions, set: (obj, value) => { obj.revisions = value; } }, metadata: _metadata }, _revisions_initializers, _revisions_extraInitializers);
        __esDecorate(null, null, _distributions_decorators, { kind: "field", name: "distributions", static: false, private: false, access: { has: obj => "distributions" in obj, get: obj => obj.distributions, set: (obj, value) => { obj.distributions = value; } }, metadata: _metadata }, _distributions_initializers, _distributions_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ConstructionDocument = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ConstructionDocument = _classThis;
})();
exports.ConstructionDocument = ConstructionDocument;
//# sourceMappingURL=construction-document.model.js.map