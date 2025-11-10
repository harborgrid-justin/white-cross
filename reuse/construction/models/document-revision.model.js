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
exports.DocumentRevision = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const document_types_1 = require("../types/document.types");
const construction_document_model_1 = require("./construction-document.model");
let DocumentRevision = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'document_revisions', timestamps: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _documentId_decorators;
    let _documentId_initializers = [];
    let _documentId_extraInitializers = [];
    let _revisionNumber_decorators;
    let _revisionNumber_initializers = [];
    let _revisionNumber_extraInitializers = [];
    let _revisionType_decorators;
    let _revisionType_initializers = [];
    let _revisionType_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _fileUrl_decorators;
    let _fileUrl_initializers = [];
    let _fileUrl_extraInitializers = [];
    let _createdBy_decorators;
    let _createdBy_initializers = [];
    let _createdBy_extraInitializers = [];
    let _revisionDate_decorators;
    let _revisionDate_initializers = [];
    let _revisionDate_extraInitializers = [];
    let _changes_decorators;
    let _changes_initializers = [];
    let _changes_extraInitializers = [];
    let _superseded_decorators;
    let _superseded_initializers = [];
    let _superseded_extraInitializers = [];
    let _supersededDate_decorators;
    let _supersededDate_initializers = [];
    let _supersededDate_extraInitializers = [];
    let _document_decorators;
    let _document_initializers = [];
    let _document_extraInitializers = [];
    var DocumentRevision = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.documentId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _documentId_initializers, void 0));
            this.revisionNumber = (__runInitializers(this, _documentId_extraInitializers), __runInitializers(this, _revisionNumber_initializers, void 0));
            this.revisionType = (__runInitializers(this, _revisionNumber_extraInitializers), __runInitializers(this, _revisionType_initializers, void 0));
            this.description = (__runInitializers(this, _revisionType_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.fileUrl = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _fileUrl_initializers, void 0));
            this.createdBy = (__runInitializers(this, _fileUrl_extraInitializers), __runInitializers(this, _createdBy_initializers, void 0));
            this.revisionDate = (__runInitializers(this, _createdBy_extraInitializers), __runInitializers(this, _revisionDate_initializers, void 0));
            this.changes = (__runInitializers(this, _revisionDate_extraInitializers), __runInitializers(this, _changes_initializers, void 0));
            this.superseded = (__runInitializers(this, _changes_extraInitializers), __runInitializers(this, _superseded_initializers, void 0));
            this.supersededDate = (__runInitializers(this, _superseded_extraInitializers), __runInitializers(this, _supersededDate_initializers, void 0));
            this.document = (__runInitializers(this, _supersededDate_extraInitializers), __runInitializers(this, _document_initializers, void 0));
            __runInitializers(this, _document_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "DocumentRevision");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _documentId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => construction_document_model_1.ConstructionDocument), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            })];
        _revisionNumber_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: false,
            })];
        _revisionType_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(document_types_1.RevisionType)),
                allowNull: false,
            })];
        _description_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: false,
            })];
        _fileUrl_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(500),
                allowNull: false,
            })];
        _createdBy_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            })];
        _revisionDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
            })];
        _changes_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
            })];
        _superseded_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                defaultValue: false,
            })];
        _supersededDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
            })];
        _document_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => construction_document_model_1.ConstructionDocument)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _documentId_decorators, { kind: "field", name: "documentId", static: false, private: false, access: { has: obj => "documentId" in obj, get: obj => obj.documentId, set: (obj, value) => { obj.documentId = value; } }, metadata: _metadata }, _documentId_initializers, _documentId_extraInitializers);
        __esDecorate(null, null, _revisionNumber_decorators, { kind: "field", name: "revisionNumber", static: false, private: false, access: { has: obj => "revisionNumber" in obj, get: obj => obj.revisionNumber, set: (obj, value) => { obj.revisionNumber = value; } }, metadata: _metadata }, _revisionNumber_initializers, _revisionNumber_extraInitializers);
        __esDecorate(null, null, _revisionType_decorators, { kind: "field", name: "revisionType", static: false, private: false, access: { has: obj => "revisionType" in obj, get: obj => obj.revisionType, set: (obj, value) => { obj.revisionType = value; } }, metadata: _metadata }, _revisionType_initializers, _revisionType_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _fileUrl_decorators, { kind: "field", name: "fileUrl", static: false, private: false, access: { has: obj => "fileUrl" in obj, get: obj => obj.fileUrl, set: (obj, value) => { obj.fileUrl = value; } }, metadata: _metadata }, _fileUrl_initializers, _fileUrl_extraInitializers);
        __esDecorate(null, null, _createdBy_decorators, { kind: "field", name: "createdBy", static: false, private: false, access: { has: obj => "createdBy" in obj, get: obj => obj.createdBy, set: (obj, value) => { obj.createdBy = value; } }, metadata: _metadata }, _createdBy_initializers, _createdBy_extraInitializers);
        __esDecorate(null, null, _revisionDate_decorators, { kind: "field", name: "revisionDate", static: false, private: false, access: { has: obj => "revisionDate" in obj, get: obj => obj.revisionDate, set: (obj, value) => { obj.revisionDate = value; } }, metadata: _metadata }, _revisionDate_initializers, _revisionDate_extraInitializers);
        __esDecorate(null, null, _changes_decorators, { kind: "field", name: "changes", static: false, private: false, access: { has: obj => "changes" in obj, get: obj => obj.changes, set: (obj, value) => { obj.changes = value; } }, metadata: _metadata }, _changes_initializers, _changes_extraInitializers);
        __esDecorate(null, null, _superseded_decorators, { kind: "field", name: "superseded", static: false, private: false, access: { has: obj => "superseded" in obj, get: obj => obj.superseded, set: (obj, value) => { obj.superseded = value; } }, metadata: _metadata }, _superseded_initializers, _superseded_extraInitializers);
        __esDecorate(null, null, _supersededDate_decorators, { kind: "field", name: "supersededDate", static: false, private: false, access: { has: obj => "supersededDate" in obj, get: obj => obj.supersededDate, set: (obj, value) => { obj.supersededDate = value; } }, metadata: _metadata }, _supersededDate_initializers, _supersededDate_extraInitializers);
        __esDecorate(null, null, _document_decorators, { kind: "field", name: "document", static: false, private: false, access: { has: obj => "document" in obj, get: obj => obj.document, set: (obj, value) => { obj.document = value; } }, metadata: _metadata }, _document_initializers, _document_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DocumentRevision = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DocumentRevision = _classThis;
})();
exports.DocumentRevision = DocumentRevision;
//# sourceMappingURL=document-revision.model.js.map