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
exports.DocumentDistribution = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const document_types_1 = require("../types/document.types");
const construction_document_model_1 = require("./construction-document.model");
let DocumentDistribution = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'document_distributions', timestamps: true })];
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
    let _recipientId_decorators;
    let _recipientId_initializers = [];
    let _recipientId_extraInitializers = [];
    let _recipientName_decorators;
    let _recipientName_initializers = [];
    let _recipientName_extraInitializers = [];
    let _recipientEmail_decorators;
    let _recipientEmail_initializers = [];
    let _recipientEmail_extraInitializers = [];
    let _recipientOrganization_decorators;
    let _recipientOrganization_initializers = [];
    let _recipientOrganization_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _sentAt_decorators;
    let _sentAt_initializers = [];
    let _sentAt_extraInitializers = [];
    let _deliveredAt_decorators;
    let _deliveredAt_initializers = [];
    let _deliveredAt_extraInitializers = [];
    let _acknowledgedAt_decorators;
    let _acknowledgedAt_initializers = [];
    let _acknowledgedAt_extraInitializers = [];
    let _deliveryMethod_decorators;
    let _deliveryMethod_initializers = [];
    let _deliveryMethod_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _distributedBy_decorators;
    let _distributedBy_initializers = [];
    let _distributedBy_extraInitializers = [];
    let _requiresSignature_decorators;
    let _requiresSignature_initializers = [];
    let _requiresSignature_extraInitializers = [];
    let _signatureUrl_decorators;
    let _signatureUrl_initializers = [];
    let _signatureUrl_extraInitializers = [];
    let _document_decorators;
    let _document_initializers = [];
    let _document_extraInitializers = [];
    var DocumentDistribution = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.documentId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _documentId_initializers, void 0));
            this.recipientId = (__runInitializers(this, _documentId_extraInitializers), __runInitializers(this, _recipientId_initializers, void 0));
            this.recipientName = (__runInitializers(this, _recipientId_extraInitializers), __runInitializers(this, _recipientName_initializers, void 0));
            this.recipientEmail = (__runInitializers(this, _recipientName_extraInitializers), __runInitializers(this, _recipientEmail_initializers, void 0));
            this.recipientOrganization = (__runInitializers(this, _recipientEmail_extraInitializers), __runInitializers(this, _recipientOrganization_initializers, void 0));
            this.status = (__runInitializers(this, _recipientOrganization_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.sentAt = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _sentAt_initializers, void 0));
            this.deliveredAt = (__runInitializers(this, _sentAt_extraInitializers), __runInitializers(this, _deliveredAt_initializers, void 0));
            this.acknowledgedAt = (__runInitializers(this, _deliveredAt_extraInitializers), __runInitializers(this, _acknowledgedAt_initializers, void 0));
            this.deliveryMethod = (__runInitializers(this, _acknowledgedAt_extraInitializers), __runInitializers(this, _deliveryMethod_initializers, void 0));
            this.notes = (__runInitializers(this, _deliveryMethod_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.distributedBy = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _distributedBy_initializers, void 0));
            this.requiresSignature = (__runInitializers(this, _distributedBy_extraInitializers), __runInitializers(this, _requiresSignature_initializers, void 0));
            this.signatureUrl = (__runInitializers(this, _requiresSignature_extraInitializers), __runInitializers(this, _signatureUrl_initializers, void 0));
            this.document = (__runInitializers(this, _signatureUrl_extraInitializers), __runInitializers(this, _document_initializers, void 0));
            __runInitializers(this, _document_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "DocumentDistribution");
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
        _recipientId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            })];
        _recipientName_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(200),
                allowNull: false,
            })];
        _recipientEmail_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(200),
            })];
        _recipientOrganization_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(200),
            })];
        _status_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(document_types_1.DistributionStatus)),
                defaultValue: document_types_1.DistributionStatus.PENDING,
            })];
        _sentAt_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
            })];
        _deliveredAt_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
            })];
        _acknowledgedAt_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
            })];
        _deliveryMethod_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(500),
            })];
        _notes_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
            })];
        _distributedBy_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
            })];
        _requiresSignature_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                defaultValue: false,
            })];
        _signatureUrl_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(500),
            })];
        _document_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => construction_document_model_1.ConstructionDocument)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _documentId_decorators, { kind: "field", name: "documentId", static: false, private: false, access: { has: obj => "documentId" in obj, get: obj => obj.documentId, set: (obj, value) => { obj.documentId = value; } }, metadata: _metadata }, _documentId_initializers, _documentId_extraInitializers);
        __esDecorate(null, null, _recipientId_decorators, { kind: "field", name: "recipientId", static: false, private: false, access: { has: obj => "recipientId" in obj, get: obj => obj.recipientId, set: (obj, value) => { obj.recipientId = value; } }, metadata: _metadata }, _recipientId_initializers, _recipientId_extraInitializers);
        __esDecorate(null, null, _recipientName_decorators, { kind: "field", name: "recipientName", static: false, private: false, access: { has: obj => "recipientName" in obj, get: obj => obj.recipientName, set: (obj, value) => { obj.recipientName = value; } }, metadata: _metadata }, _recipientName_initializers, _recipientName_extraInitializers);
        __esDecorate(null, null, _recipientEmail_decorators, { kind: "field", name: "recipientEmail", static: false, private: false, access: { has: obj => "recipientEmail" in obj, get: obj => obj.recipientEmail, set: (obj, value) => { obj.recipientEmail = value; } }, metadata: _metadata }, _recipientEmail_initializers, _recipientEmail_extraInitializers);
        __esDecorate(null, null, _recipientOrganization_decorators, { kind: "field", name: "recipientOrganization", static: false, private: false, access: { has: obj => "recipientOrganization" in obj, get: obj => obj.recipientOrganization, set: (obj, value) => { obj.recipientOrganization = value; } }, metadata: _metadata }, _recipientOrganization_initializers, _recipientOrganization_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _sentAt_decorators, { kind: "field", name: "sentAt", static: false, private: false, access: { has: obj => "sentAt" in obj, get: obj => obj.sentAt, set: (obj, value) => { obj.sentAt = value; } }, metadata: _metadata }, _sentAt_initializers, _sentAt_extraInitializers);
        __esDecorate(null, null, _deliveredAt_decorators, { kind: "field", name: "deliveredAt", static: false, private: false, access: { has: obj => "deliveredAt" in obj, get: obj => obj.deliveredAt, set: (obj, value) => { obj.deliveredAt = value; } }, metadata: _metadata }, _deliveredAt_initializers, _deliveredAt_extraInitializers);
        __esDecorate(null, null, _acknowledgedAt_decorators, { kind: "field", name: "acknowledgedAt", static: false, private: false, access: { has: obj => "acknowledgedAt" in obj, get: obj => obj.acknowledgedAt, set: (obj, value) => { obj.acknowledgedAt = value; } }, metadata: _metadata }, _acknowledgedAt_initializers, _acknowledgedAt_extraInitializers);
        __esDecorate(null, null, _deliveryMethod_decorators, { kind: "field", name: "deliveryMethod", static: false, private: false, access: { has: obj => "deliveryMethod" in obj, get: obj => obj.deliveryMethod, set: (obj, value) => { obj.deliveryMethod = value; } }, metadata: _metadata }, _deliveryMethod_initializers, _deliveryMethod_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _distributedBy_decorators, { kind: "field", name: "distributedBy", static: false, private: false, access: { has: obj => "distributedBy" in obj, get: obj => obj.distributedBy, set: (obj, value) => { obj.distributedBy = value; } }, metadata: _metadata }, _distributedBy_initializers, _distributedBy_extraInitializers);
        __esDecorate(null, null, _requiresSignature_decorators, { kind: "field", name: "requiresSignature", static: false, private: false, access: { has: obj => "requiresSignature" in obj, get: obj => obj.requiresSignature, set: (obj, value) => { obj.requiresSignature = value; } }, metadata: _metadata }, _requiresSignature_initializers, _requiresSignature_extraInitializers);
        __esDecorate(null, null, _signatureUrl_decorators, { kind: "field", name: "signatureUrl", static: false, private: false, access: { has: obj => "signatureUrl" in obj, get: obj => obj.signatureUrl, set: (obj, value) => { obj.signatureUrl = value; } }, metadata: _metadata }, _signatureUrl_initializers, _signatureUrl_extraInitializers);
        __esDecorate(null, null, _document_decorators, { kind: "field", name: "document", static: false, private: false, access: { has: obj => "document" in obj, get: obj => obj.document, set: (obj, value) => { obj.document = value; } }, metadata: _metadata }, _document_initializers, _document_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DocumentDistribution = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DocumentDistribution = _classThis;
})();
exports.DocumentDistribution = DocumentDistribution;
//# sourceMappingURL=document-distribution.model.js.map