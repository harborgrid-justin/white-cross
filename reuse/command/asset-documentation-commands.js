"use strict";
/**
 * ASSET DOCUMENTATION COMMAND FUNCTIONS
 *
 * Enterprise-grade asset documentation management system providing comprehensive
 * functionality for document management, manuals, procedures, SDS sheets, technical
 * drawings, version control, search, linking, and document lifecycle management.
 * Competes with SharePoint and Documentum solutions.
 *
 * Features:
 * - Technical documentation management
 * - Operating manuals and procedures
 * - Safety Data Sheets (SDS) management
 * - Engineering drawings and CAD files
 * - Version control and revision history
 * - Document approval workflows
 * - Full-text search and indexing
 * - Document linking and relationships
 * - Expiration and renewal tracking
 * - Compliance and regulatory documentation
 *
 * @module AssetDocumentationCommands
 * @version 1.0.0
 * @requires @nestjs/common ^11.1.8
 * @requires @nestjs/swagger ^8.0.7
 * @requires @nestjs/sequelize ^10.0.1
 * @requires sequelize ^6.37.5
 * @requires sequelize-typescript ^2.1.6
 * @requires class-validator ^0.14.1
 * @requires class-transformer ^0.5.1
 *
 * @example
 * ```typescript
 * import {
 *   createDocument,
 *   createDocumentVersion,
 *   linkDocumentToAsset,
 *   searchDocuments,
 *   DocumentType,
 *   DocumentStatus
 * } from './asset-documentation-commands';
 *
 * // Create technical document
 * const doc = await createDocument({
 *   assetId: 'asset-123',
 *   documentType: DocumentType.OPERATING_MANUAL,
 *   title: 'CNC Machine Operating Manual',
 *   description: 'Complete operating procedures',
 *   fileUrl: 's3://docs/manual-v1.pdf',
 *   version: '1.0',
 *   createdBy: 'user-456'
 * });
 *
 * // Search documents
 * const results = await searchDocuments('safety procedures', {
 *   documentTypes: [DocumentType.SOP, DocumentType.SDS]
 * });
 * ```
 */
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentAccessLog = exports.TechnicalDrawing = exports.SafetyDataSheet = exports.DocumentReview = exports.DocumentLink = exports.DocumentVersion = exports.Document = exports.FileFormat = exports.AccessLevel = exports.ReviewStatus = exports.DocumentStatus = exports.DocumentType = void 0;
exports.createDocument = createDocument;
exports.updateDocument = updateDocument;
exports.getDocument = getDocument;
exports.getDocumentsByAsset = getDocumentsByAsset;
exports.publishDocument = publishDocument;
exports.archiveDocument = archiveDocument;
exports.deleteDocument = deleteDocument;
exports.createDocumentVersion = createDocumentVersion;
exports.getVersionHistory = getVersionHistory;
exports.revertToVersion = revertToVersion;
exports.compareVersions = compareVersions;
exports.linkDocuments = linkDocuments;
exports.unlinkDocuments = unlinkDocuments;
exports.getLinkedDocuments = getLinkedDocuments;
exports.linkDocumentToAsset = linkDocumentToAsset;
exports.createDocumentReview = createDocumentReview;
exports.startReview = startReview;
exports.approveDocumentReview = approveDocumentReview;
exports.rejectDocumentReview = rejectDocumentReview;
exports.getPendingReviews = getPendingReviews;
exports.searchDocuments = searchDocuments;
exports.searchByTags = searchByTags;
exports.getExpiringDocuments = getExpiringDocuments;
exports.getDocumentsDueForReview = getDocumentsDueForReview;
exports.createSDS = createSDS;
exports.getSDSByChemical = getSDSByChemical;
exports.getSDSByCAS = getSDSByCAS;
exports.createTechnicalDrawing = createTechnicalDrawing;
exports.getDrawingByNumber = getDrawingByNumber;
exports.getDrawingRevisions = getDrawingRevisions;
exports.logDocumentAccess = logDocumentAccess;
exports.getDocumentAccessLogs = getDocumentAccessLogs;
exports.getUserAccessHistory = getUserAccessHistory;
exports.bulkUpdateStatus = bulkUpdateStatus;
exports.bulkAddTags = bulkAddTags;
exports.bulkExportDocuments = bulkExportDocuments;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_1 = require("sequelize");
// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================
/**
 * Document Type
 */
var DocumentType;
(function (DocumentType) {
    DocumentType["OPERATING_MANUAL"] = "operating_manual";
    DocumentType["MAINTENANCE_MANUAL"] = "maintenance_manual";
    DocumentType["SERVICE_MANUAL"] = "service_manual";
    DocumentType["PARTS_CATALOG"] = "parts_catalog";
    DocumentType["SOP"] = "sop";
    DocumentType["WORK_INSTRUCTION"] = "work_instruction";
    DocumentType["SDS"] = "sds";
    DocumentType["TECHNICAL_DRAWING"] = "technical_drawing";
    DocumentType["CAD_FILE"] = "cad_file";
    DocumentType["SPECIFICATION"] = "specification";
    DocumentType["CERTIFICATE"] = "certificate";
    DocumentType["WARRANTY"] = "warranty";
    DocumentType["COMPLIANCE_DOC"] = "compliance_doc";
    DocumentType["INSPECTION_REPORT"] = "inspection_report";
    DocumentType["TEST_REPORT"] = "test_report";
    DocumentType["TRAINING_MATERIAL"] = "training_material";
    DocumentType["POLICY"] = "policy";
    DocumentType["PROCEDURE"] = "procedure";
    DocumentType["OTHER"] = "other";
})(DocumentType || (exports.DocumentType = DocumentType = {}));
/**
 * Document Status
 */
var DocumentStatus;
(function (DocumentStatus) {
    DocumentStatus["DRAFT"] = "draft";
    DocumentStatus["IN_REVIEW"] = "in_review";
    DocumentStatus["APPROVED"] = "approved";
    DocumentStatus["PUBLISHED"] = "published";
    DocumentStatus["ARCHIVED"] = "archived";
    DocumentStatus["OBSOLETE"] = "obsolete";
    DocumentStatus["EXPIRED"] = "expired";
})(DocumentStatus || (exports.DocumentStatus = DocumentStatus = {}));
/**
 * Review Status
 */
var ReviewStatus;
(function (ReviewStatus) {
    ReviewStatus["PENDING"] = "pending";
    ReviewStatus["IN_PROGRESS"] = "in_progress";
    ReviewStatus["APPROVED"] = "approved";
    ReviewStatus["REJECTED"] = "rejected";
    ReviewStatus["CHANGES_REQUESTED"] = "changes_requested";
})(ReviewStatus || (exports.ReviewStatus = ReviewStatus = {}));
/**
 * Document Access Level
 */
var AccessLevel;
(function (AccessLevel) {
    AccessLevel["PUBLIC"] = "public";
    AccessLevel["INTERNAL"] = "internal";
    AccessLevel["CONFIDENTIAL"] = "confidential";
    AccessLevel["RESTRICTED"] = "restricted";
    AccessLevel["CLASSIFIED"] = "classified";
})(AccessLevel || (exports.AccessLevel = AccessLevel = {}));
/**
 * File Format
 */
var FileFormat;
(function (FileFormat) {
    FileFormat["PDF"] = "pdf";
    FileFormat["DOCX"] = "docx";
    FileFormat["XLSX"] = "xlsx";
    FileFormat["PPTX"] = "pptx";
    FileFormat["DWG"] = "dwg";
    FileFormat["DXF"] = "dxf";
    FileFormat["STEP"] = "step";
    FileFormat["IGES"] = "iges";
    FileFormat["JPG"] = "jpg";
    FileFormat["PNG"] = "png";
    FileFormat["MP4"] = "mp4";
    FileFormat["HTML"] = "html";
    FileFormat["XML"] = "xml";
    FileFormat["JSON"] = "json";
})(FileFormat || (exports.FileFormat = FileFormat = {}));
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Document Model
 */
let Document = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'documents',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['document_number'], unique: true },
                { fields: ['asset_id'] },
                { fields: ['document_type'] },
                { fields: ['status'] },
                { fields: ['expiration_date'] },
                { fields: ['created_by'] },
                { fields: ['tags'], using: 'gin' },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _staticExtraInitializers = [];
    let _static_generateDocumentNumber_decorators;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _documentNumber_decorators;
    let _documentNumber_initializers = [];
    let _documentNumber_extraInitializers = [];
    let _assetId_decorators;
    let _assetId_initializers = [];
    let _assetId_extraInitializers = [];
    let _documentType_decorators;
    let _documentType_initializers = [];
    let _documentType_extraInitializers = [];
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _fileUrl_decorators;
    let _fileUrl_initializers = [];
    let _fileUrl_extraInitializers = [];
    let _fileName_decorators;
    let _fileName_initializers = [];
    let _fileName_extraInitializers = [];
    let _fileFormat_decorators;
    let _fileFormat_initializers = [];
    let _fileFormat_extraInitializers = [];
    let _fileSize_decorators;
    let _fileSize_initializers = [];
    let _fileSize_extraInitializers = [];
    let _version_decorators;
    let _version_initializers = [];
    let _version_extraInitializers = [];
    let _createdBy_decorators;
    let _createdBy_initializers = [];
    let _createdBy_extraInitializers = [];
    let _lastModifiedBy_decorators;
    let _lastModifiedBy_initializers = [];
    let _lastModifiedBy_extraInitializers = [];
    let _approvedBy_decorators;
    let _approvedBy_initializers = [];
    let _approvedBy_extraInitializers = [];
    let _approvalDate_decorators;
    let _approvalDate_initializers = [];
    let _approvalDate_extraInitializers = [];
    let _publishedDate_decorators;
    let _publishedDate_initializers = [];
    let _publishedDate_extraInitializers = [];
    let _accessLevel_decorators;
    let _accessLevel_initializers = [];
    let _accessLevel_extraInitializers = [];
    let _tags_decorators;
    let _tags_initializers = [];
    let _tags_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _expirationDate_decorators;
    let _expirationDate_initializers = [];
    let _expirationDate_extraInitializers = [];
    let _reviewDate_decorators;
    let _reviewDate_initializers = [];
    let _reviewDate_extraInitializers = [];
    let _lastReviewedDate_decorators;
    let _lastReviewedDate_initializers = [];
    let _lastReviewedDate_extraInitializers = [];
    let _language_decorators;
    let _language_initializers = [];
    let _language_extraInitializers = [];
    let _downloadCount_decorators;
    let _downloadCount_initializers = [];
    let _downloadCount_extraInitializers = [];
    let _viewCount_decorators;
    let _viewCount_initializers = [];
    let _viewCount_extraInitializers = [];
    let _fullTextContent_decorators;
    let _fullTextContent_initializers = [];
    let _fullTextContent_extraInitializers = [];
    let _checksum_decorators;
    let _checksum_initializers = [];
    let _checksum_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    let _versions_decorators;
    let _versions_initializers = [];
    let _versions_extraInitializers = [];
    let _reviews_decorators;
    let _reviews_initializers = [];
    let _reviews_extraInitializers = [];
    let _outgoingLinks_decorators;
    let _outgoingLinks_initializers = [];
    let _outgoingLinks_extraInitializers = [];
    let _incomingLinks_decorators;
    let _incomingLinks_initializers = [];
    let _incomingLinks_extraInitializers = [];
    var Document = _classThis = class extends _classSuper {
        static async generateDocumentNumber(instance) {
            if (!instance.documentNumber) {
                const count = await Document.count();
                const year = new Date().getFullYear();
                const prefix = instance.documentType.toUpperCase().substring(0, 3);
                instance.documentNumber = `DOC-${prefix}-${year}-${String(count + 1).padStart(6, '0')}`;
            }
        }
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.documentNumber = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _documentNumber_initializers, void 0));
            this.assetId = (__runInitializers(this, _documentNumber_extraInitializers), __runInitializers(this, _assetId_initializers, void 0));
            this.documentType = (__runInitializers(this, _assetId_extraInitializers), __runInitializers(this, _documentType_initializers, void 0));
            this.title = (__runInitializers(this, _documentType_extraInitializers), __runInitializers(this, _title_initializers, void 0));
            this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.status = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.fileUrl = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _fileUrl_initializers, void 0));
            this.fileName = (__runInitializers(this, _fileUrl_extraInitializers), __runInitializers(this, _fileName_initializers, void 0));
            this.fileFormat = (__runInitializers(this, _fileName_extraInitializers), __runInitializers(this, _fileFormat_initializers, void 0));
            this.fileSize = (__runInitializers(this, _fileFormat_extraInitializers), __runInitializers(this, _fileSize_initializers, void 0));
            this.version = (__runInitializers(this, _fileSize_extraInitializers), __runInitializers(this, _version_initializers, void 0));
            this.createdBy = (__runInitializers(this, _version_extraInitializers), __runInitializers(this, _createdBy_initializers, void 0));
            this.lastModifiedBy = (__runInitializers(this, _createdBy_extraInitializers), __runInitializers(this, _lastModifiedBy_initializers, void 0));
            this.approvedBy = (__runInitializers(this, _lastModifiedBy_extraInitializers), __runInitializers(this, _approvedBy_initializers, void 0));
            this.approvalDate = (__runInitializers(this, _approvedBy_extraInitializers), __runInitializers(this, _approvalDate_initializers, void 0));
            this.publishedDate = (__runInitializers(this, _approvalDate_extraInitializers), __runInitializers(this, _publishedDate_initializers, void 0));
            this.accessLevel = (__runInitializers(this, _publishedDate_extraInitializers), __runInitializers(this, _accessLevel_initializers, void 0));
            this.tags = (__runInitializers(this, _accessLevel_extraInitializers), __runInitializers(this, _tags_initializers, void 0));
            this.metadata = (__runInitializers(this, _tags_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.expirationDate = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _expirationDate_initializers, void 0));
            this.reviewDate = (__runInitializers(this, _expirationDate_extraInitializers), __runInitializers(this, _reviewDate_initializers, void 0));
            this.lastReviewedDate = (__runInitializers(this, _reviewDate_extraInitializers), __runInitializers(this, _lastReviewedDate_initializers, void 0));
            this.language = (__runInitializers(this, _lastReviewedDate_extraInitializers), __runInitializers(this, _language_initializers, void 0));
            this.downloadCount = (__runInitializers(this, _language_extraInitializers), __runInitializers(this, _downloadCount_initializers, void 0));
            this.viewCount = (__runInitializers(this, _downloadCount_extraInitializers), __runInitializers(this, _viewCount_initializers, void 0));
            this.fullTextContent = (__runInitializers(this, _viewCount_extraInitializers), __runInitializers(this, _fullTextContent_initializers, void 0));
            this.checksum = (__runInitializers(this, _fullTextContent_extraInitializers), __runInitializers(this, _checksum_initializers, void 0));
            this.createdAt = (__runInitializers(this, _checksum_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.versions = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _versions_initializers, void 0));
            this.reviews = (__runInitializers(this, _versions_extraInitializers), __runInitializers(this, _reviews_initializers, void 0));
            this.outgoingLinks = (__runInitializers(this, _reviews_extraInitializers), __runInitializers(this, _outgoingLinks_initializers, void 0));
            this.incomingLinks = (__runInitializers(this, _outgoingLinks_extraInitializers), __runInitializers(this, _incomingLinks_initializers, void 0));
            __runInitializers(this, _incomingLinks_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "Document");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _documentNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Document number' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50), unique: true }), sequelize_typescript_1.Index];
        _assetId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Asset ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID }), sequelize_typescript_1.Index];
        _documentType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Document type' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(DocumentType)), allowNull: false }), sequelize_typescript_1.Index];
        _title_decorators = [(0, swagger_1.ApiProperty)({ description: 'Title' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(500), allowNull: false })];
        _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Description' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'Status' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(DocumentStatus)), defaultValue: DocumentStatus.DRAFT }), sequelize_typescript_1.Index];
        _fileUrl_decorators = [(0, swagger_1.ApiProperty)({ description: 'File URL' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(1000), allowNull: false })];
        _fileName_decorators = [(0, swagger_1.ApiProperty)({ description: 'File name' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(500), allowNull: false })];
        _fileFormat_decorators = [(0, swagger_1.ApiProperty)({ description: 'File format' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(FileFormat)), allowNull: false })];
        _fileSize_decorators = [(0, swagger_1.ApiProperty)({ description: 'File size in bytes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BIGINT })];
        _version_decorators = [(0, swagger_1.ApiProperty)({ description: 'Version' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50), allowNull: false })];
        _createdBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Created by user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _lastModifiedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Last modified by user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _approvedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Approved by user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _approvalDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Approval date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _publishedDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Published date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _accessLevel_decorators = [(0, swagger_1.ApiProperty)({ description: 'Access level' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(AccessLevel)), defaultValue: AccessLevel.INTERNAL })];
        _tags_decorators = [(0, swagger_1.ApiProperty)({ description: 'Tags' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING) })];
        _metadata_decorators = [(0, swagger_1.ApiProperty)({ description: 'Metadata' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _expirationDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Expiration date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE }), sequelize_typescript_1.Index];
        _reviewDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Review date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _lastReviewedDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Last reviewed date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _language_decorators = [(0, swagger_1.ApiProperty)({ description: 'Language code' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(10) })];
        _downloadCount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Download count' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, defaultValue: 0 })];
        _viewCount_decorators = [(0, swagger_1.ApiProperty)({ description: 'View count' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, defaultValue: 0 })];
        _fullTextContent_decorators = [(0, swagger_1.ApiProperty)({ description: 'Full text content for search' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _checksum_decorators = [(0, swagger_1.ApiProperty)({ description: 'Checksum' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100) })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        _versions_decorators = [(0, sequelize_typescript_1.HasMany)(() => DocumentVersion)];
        _reviews_decorators = [(0, sequelize_typescript_1.HasMany)(() => DocumentReview)];
        _outgoingLinks_decorators = [(0, sequelize_typescript_1.HasMany)(() => DocumentLink, 'documentId')];
        _incomingLinks_decorators = [(0, sequelize_typescript_1.HasMany)(() => DocumentLink, 'linkedDocumentId')];
        _static_generateDocumentNumber_decorators = [sequelize_typescript_1.BeforeCreate];
        __esDecorate(_classThis, null, _static_generateDocumentNumber_decorators, { kind: "method", name: "generateDocumentNumber", static: true, private: false, access: { has: obj => "generateDocumentNumber" in obj, get: obj => obj.generateDocumentNumber }, metadata: _metadata }, null, _staticExtraInitializers);
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _documentNumber_decorators, { kind: "field", name: "documentNumber", static: false, private: false, access: { has: obj => "documentNumber" in obj, get: obj => obj.documentNumber, set: (obj, value) => { obj.documentNumber = value; } }, metadata: _metadata }, _documentNumber_initializers, _documentNumber_extraInitializers);
        __esDecorate(null, null, _assetId_decorators, { kind: "field", name: "assetId", static: false, private: false, access: { has: obj => "assetId" in obj, get: obj => obj.assetId, set: (obj, value) => { obj.assetId = value; } }, metadata: _metadata }, _assetId_initializers, _assetId_extraInitializers);
        __esDecorate(null, null, _documentType_decorators, { kind: "field", name: "documentType", static: false, private: false, access: { has: obj => "documentType" in obj, get: obj => obj.documentType, set: (obj, value) => { obj.documentType = value; } }, metadata: _metadata }, _documentType_initializers, _documentType_extraInitializers);
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _fileUrl_decorators, { kind: "field", name: "fileUrl", static: false, private: false, access: { has: obj => "fileUrl" in obj, get: obj => obj.fileUrl, set: (obj, value) => { obj.fileUrl = value; } }, metadata: _metadata }, _fileUrl_initializers, _fileUrl_extraInitializers);
        __esDecorate(null, null, _fileName_decorators, { kind: "field", name: "fileName", static: false, private: false, access: { has: obj => "fileName" in obj, get: obj => obj.fileName, set: (obj, value) => { obj.fileName = value; } }, metadata: _metadata }, _fileName_initializers, _fileName_extraInitializers);
        __esDecorate(null, null, _fileFormat_decorators, { kind: "field", name: "fileFormat", static: false, private: false, access: { has: obj => "fileFormat" in obj, get: obj => obj.fileFormat, set: (obj, value) => { obj.fileFormat = value; } }, metadata: _metadata }, _fileFormat_initializers, _fileFormat_extraInitializers);
        __esDecorate(null, null, _fileSize_decorators, { kind: "field", name: "fileSize", static: false, private: false, access: { has: obj => "fileSize" in obj, get: obj => obj.fileSize, set: (obj, value) => { obj.fileSize = value; } }, metadata: _metadata }, _fileSize_initializers, _fileSize_extraInitializers);
        __esDecorate(null, null, _version_decorators, { kind: "field", name: "version", static: false, private: false, access: { has: obj => "version" in obj, get: obj => obj.version, set: (obj, value) => { obj.version = value; } }, metadata: _metadata }, _version_initializers, _version_extraInitializers);
        __esDecorate(null, null, _createdBy_decorators, { kind: "field", name: "createdBy", static: false, private: false, access: { has: obj => "createdBy" in obj, get: obj => obj.createdBy, set: (obj, value) => { obj.createdBy = value; } }, metadata: _metadata }, _createdBy_initializers, _createdBy_extraInitializers);
        __esDecorate(null, null, _lastModifiedBy_decorators, { kind: "field", name: "lastModifiedBy", static: false, private: false, access: { has: obj => "lastModifiedBy" in obj, get: obj => obj.lastModifiedBy, set: (obj, value) => { obj.lastModifiedBy = value; } }, metadata: _metadata }, _lastModifiedBy_initializers, _lastModifiedBy_extraInitializers);
        __esDecorate(null, null, _approvedBy_decorators, { kind: "field", name: "approvedBy", static: false, private: false, access: { has: obj => "approvedBy" in obj, get: obj => obj.approvedBy, set: (obj, value) => { obj.approvedBy = value; } }, metadata: _metadata }, _approvedBy_initializers, _approvedBy_extraInitializers);
        __esDecorate(null, null, _approvalDate_decorators, { kind: "field", name: "approvalDate", static: false, private: false, access: { has: obj => "approvalDate" in obj, get: obj => obj.approvalDate, set: (obj, value) => { obj.approvalDate = value; } }, metadata: _metadata }, _approvalDate_initializers, _approvalDate_extraInitializers);
        __esDecorate(null, null, _publishedDate_decorators, { kind: "field", name: "publishedDate", static: false, private: false, access: { has: obj => "publishedDate" in obj, get: obj => obj.publishedDate, set: (obj, value) => { obj.publishedDate = value; } }, metadata: _metadata }, _publishedDate_initializers, _publishedDate_extraInitializers);
        __esDecorate(null, null, _accessLevel_decorators, { kind: "field", name: "accessLevel", static: false, private: false, access: { has: obj => "accessLevel" in obj, get: obj => obj.accessLevel, set: (obj, value) => { obj.accessLevel = value; } }, metadata: _metadata }, _accessLevel_initializers, _accessLevel_extraInitializers);
        __esDecorate(null, null, _tags_decorators, { kind: "field", name: "tags", static: false, private: false, access: { has: obj => "tags" in obj, get: obj => obj.tags, set: (obj, value) => { obj.tags = value; } }, metadata: _metadata }, _tags_initializers, _tags_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _expirationDate_decorators, { kind: "field", name: "expirationDate", static: false, private: false, access: { has: obj => "expirationDate" in obj, get: obj => obj.expirationDate, set: (obj, value) => { obj.expirationDate = value; } }, metadata: _metadata }, _expirationDate_initializers, _expirationDate_extraInitializers);
        __esDecorate(null, null, _reviewDate_decorators, { kind: "field", name: "reviewDate", static: false, private: false, access: { has: obj => "reviewDate" in obj, get: obj => obj.reviewDate, set: (obj, value) => { obj.reviewDate = value; } }, metadata: _metadata }, _reviewDate_initializers, _reviewDate_extraInitializers);
        __esDecorate(null, null, _lastReviewedDate_decorators, { kind: "field", name: "lastReviewedDate", static: false, private: false, access: { has: obj => "lastReviewedDate" in obj, get: obj => obj.lastReviewedDate, set: (obj, value) => { obj.lastReviewedDate = value; } }, metadata: _metadata }, _lastReviewedDate_initializers, _lastReviewedDate_extraInitializers);
        __esDecorate(null, null, _language_decorators, { kind: "field", name: "language", static: false, private: false, access: { has: obj => "language" in obj, get: obj => obj.language, set: (obj, value) => { obj.language = value; } }, metadata: _metadata }, _language_initializers, _language_extraInitializers);
        __esDecorate(null, null, _downloadCount_decorators, { kind: "field", name: "downloadCount", static: false, private: false, access: { has: obj => "downloadCount" in obj, get: obj => obj.downloadCount, set: (obj, value) => { obj.downloadCount = value; } }, metadata: _metadata }, _downloadCount_initializers, _downloadCount_extraInitializers);
        __esDecorate(null, null, _viewCount_decorators, { kind: "field", name: "viewCount", static: false, private: false, access: { has: obj => "viewCount" in obj, get: obj => obj.viewCount, set: (obj, value) => { obj.viewCount = value; } }, metadata: _metadata }, _viewCount_initializers, _viewCount_extraInitializers);
        __esDecorate(null, null, _fullTextContent_decorators, { kind: "field", name: "fullTextContent", static: false, private: false, access: { has: obj => "fullTextContent" in obj, get: obj => obj.fullTextContent, set: (obj, value) => { obj.fullTextContent = value; } }, metadata: _metadata }, _fullTextContent_initializers, _fullTextContent_extraInitializers);
        __esDecorate(null, null, _checksum_decorators, { kind: "field", name: "checksum", static: false, private: false, access: { has: obj => "checksum" in obj, get: obj => obj.checksum, set: (obj, value) => { obj.checksum = value; } }, metadata: _metadata }, _checksum_initializers, _checksum_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _versions_decorators, { kind: "field", name: "versions", static: false, private: false, access: { has: obj => "versions" in obj, get: obj => obj.versions, set: (obj, value) => { obj.versions = value; } }, metadata: _metadata }, _versions_initializers, _versions_extraInitializers);
        __esDecorate(null, null, _reviews_decorators, { kind: "field", name: "reviews", static: false, private: false, access: { has: obj => "reviews" in obj, get: obj => obj.reviews, set: (obj, value) => { obj.reviews = value; } }, metadata: _metadata }, _reviews_initializers, _reviews_extraInitializers);
        __esDecorate(null, null, _outgoingLinks_decorators, { kind: "field", name: "outgoingLinks", static: false, private: false, access: { has: obj => "outgoingLinks" in obj, get: obj => obj.outgoingLinks, set: (obj, value) => { obj.outgoingLinks = value; } }, metadata: _metadata }, _outgoingLinks_initializers, _outgoingLinks_extraInitializers);
        __esDecorate(null, null, _incomingLinks_decorators, { kind: "field", name: "incomingLinks", static: false, private: false, access: { has: obj => "incomingLinks" in obj, get: obj => obj.incomingLinks, set: (obj, value) => { obj.incomingLinks = value; } }, metadata: _metadata }, _incomingLinks_initializers, _incomingLinks_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Document = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _staticExtraInitializers);
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Document = _classThis;
})();
exports.Document = Document;
/**
 * Document Version Model
 */
let DocumentVersion = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'document_versions',
            timestamps: true,
            indexes: [
                { fields: ['document_id'] },
                { fields: ['version'] },
                { fields: ['created_at'] },
            ],
        })];
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
    let _version_decorators;
    let _version_initializers = [];
    let _version_extraInitializers = [];
    let _previousVersion_decorators;
    let _previousVersion_initializers = [];
    let _previousVersion_extraInitializers = [];
    let _fileUrl_decorators;
    let _fileUrl_initializers = [];
    let _fileUrl_extraInitializers = [];
    let _fileName_decorators;
    let _fileName_initializers = [];
    let _fileName_extraInitializers = [];
    let _fileSize_decorators;
    let _fileSize_initializers = [];
    let _fileSize_extraInitializers = [];
    let _changes_decorators;
    let _changes_initializers = [];
    let _changes_extraInitializers = [];
    let _releaseNotes_decorators;
    let _releaseNotes_initializers = [];
    let _releaseNotes_extraInitializers = [];
    let _createdBy_decorators;
    let _createdBy_initializers = [];
    let _createdBy_extraInitializers = [];
    let _checksum_decorators;
    let _checksum_initializers = [];
    let _checksum_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _document_decorators;
    let _document_initializers = [];
    let _document_extraInitializers = [];
    var DocumentVersion = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.documentId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _documentId_initializers, void 0));
            this.version = (__runInitializers(this, _documentId_extraInitializers), __runInitializers(this, _version_initializers, void 0));
            this.previousVersion = (__runInitializers(this, _version_extraInitializers), __runInitializers(this, _previousVersion_initializers, void 0));
            this.fileUrl = (__runInitializers(this, _previousVersion_extraInitializers), __runInitializers(this, _fileUrl_initializers, void 0));
            this.fileName = (__runInitializers(this, _fileUrl_extraInitializers), __runInitializers(this, _fileName_initializers, void 0));
            this.fileSize = (__runInitializers(this, _fileName_extraInitializers), __runInitializers(this, _fileSize_initializers, void 0));
            this.changes = (__runInitializers(this, _fileSize_extraInitializers), __runInitializers(this, _changes_initializers, void 0));
            this.releaseNotes = (__runInitializers(this, _changes_extraInitializers), __runInitializers(this, _releaseNotes_initializers, void 0));
            this.createdBy = (__runInitializers(this, _releaseNotes_extraInitializers), __runInitializers(this, _createdBy_initializers, void 0));
            this.checksum = (__runInitializers(this, _createdBy_extraInitializers), __runInitializers(this, _checksum_initializers, void 0));
            this.createdAt = (__runInitializers(this, _checksum_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.document = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _document_initializers, void 0));
            __runInitializers(this, _document_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "DocumentVersion");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _documentId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Document ID' }), (0, sequelize_typescript_1.ForeignKey)(() => Document), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _version_decorators = [(0, swagger_1.ApiProperty)({ description: 'Version' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50), allowNull: false }), sequelize_typescript_1.Index];
        _previousVersion_decorators = [(0, swagger_1.ApiProperty)({ description: 'Previous version' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50) })];
        _fileUrl_decorators = [(0, swagger_1.ApiProperty)({ description: 'File URL' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(1000), allowNull: false })];
        _fileName_decorators = [(0, swagger_1.ApiProperty)({ description: 'File name' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(500), allowNull: false })];
        _fileSize_decorators = [(0, swagger_1.ApiProperty)({ description: 'File size' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BIGINT })];
        _changes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Changes description' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: false })];
        _releaseNotes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Release notes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _createdBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Created by user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _checksum_decorators = [(0, swagger_1.ApiProperty)({ description: 'Checksum' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100) })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt, sequelize_typescript_1.Index];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _document_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => Document)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _documentId_decorators, { kind: "field", name: "documentId", static: false, private: false, access: { has: obj => "documentId" in obj, get: obj => obj.documentId, set: (obj, value) => { obj.documentId = value; } }, metadata: _metadata }, _documentId_initializers, _documentId_extraInitializers);
        __esDecorate(null, null, _version_decorators, { kind: "field", name: "version", static: false, private: false, access: { has: obj => "version" in obj, get: obj => obj.version, set: (obj, value) => { obj.version = value; } }, metadata: _metadata }, _version_initializers, _version_extraInitializers);
        __esDecorate(null, null, _previousVersion_decorators, { kind: "field", name: "previousVersion", static: false, private: false, access: { has: obj => "previousVersion" in obj, get: obj => obj.previousVersion, set: (obj, value) => { obj.previousVersion = value; } }, metadata: _metadata }, _previousVersion_initializers, _previousVersion_extraInitializers);
        __esDecorate(null, null, _fileUrl_decorators, { kind: "field", name: "fileUrl", static: false, private: false, access: { has: obj => "fileUrl" in obj, get: obj => obj.fileUrl, set: (obj, value) => { obj.fileUrl = value; } }, metadata: _metadata }, _fileUrl_initializers, _fileUrl_extraInitializers);
        __esDecorate(null, null, _fileName_decorators, { kind: "field", name: "fileName", static: false, private: false, access: { has: obj => "fileName" in obj, get: obj => obj.fileName, set: (obj, value) => { obj.fileName = value; } }, metadata: _metadata }, _fileName_initializers, _fileName_extraInitializers);
        __esDecorate(null, null, _fileSize_decorators, { kind: "field", name: "fileSize", static: false, private: false, access: { has: obj => "fileSize" in obj, get: obj => obj.fileSize, set: (obj, value) => { obj.fileSize = value; } }, metadata: _metadata }, _fileSize_initializers, _fileSize_extraInitializers);
        __esDecorate(null, null, _changes_decorators, { kind: "field", name: "changes", static: false, private: false, access: { has: obj => "changes" in obj, get: obj => obj.changes, set: (obj, value) => { obj.changes = value; } }, metadata: _metadata }, _changes_initializers, _changes_extraInitializers);
        __esDecorate(null, null, _releaseNotes_decorators, { kind: "field", name: "releaseNotes", static: false, private: false, access: { has: obj => "releaseNotes" in obj, get: obj => obj.releaseNotes, set: (obj, value) => { obj.releaseNotes = value; } }, metadata: _metadata }, _releaseNotes_initializers, _releaseNotes_extraInitializers);
        __esDecorate(null, null, _createdBy_decorators, { kind: "field", name: "createdBy", static: false, private: false, access: { has: obj => "createdBy" in obj, get: obj => obj.createdBy, set: (obj, value) => { obj.createdBy = value; } }, metadata: _metadata }, _createdBy_initializers, _createdBy_extraInitializers);
        __esDecorate(null, null, _checksum_decorators, { kind: "field", name: "checksum", static: false, private: false, access: { has: obj => "checksum" in obj, get: obj => obj.checksum, set: (obj, value) => { obj.checksum = value; } }, metadata: _metadata }, _checksum_initializers, _checksum_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _document_decorators, { kind: "field", name: "document", static: false, private: false, access: { has: obj => "document" in obj, get: obj => obj.document, set: (obj, value) => { obj.document = value; } }, metadata: _metadata }, _document_initializers, _document_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DocumentVersion = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DocumentVersion = _classThis;
})();
exports.DocumentVersion = DocumentVersion;
/**
 * Document Link Model
 */
let DocumentLink = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'document_links',
            timestamps: true,
            indexes: [
                { fields: ['document_id'] },
                { fields: ['linked_document_id'] },
                { fields: ['link_type'] },
            ],
        })];
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
    let _linkedDocumentId_decorators;
    let _linkedDocumentId_initializers = [];
    let _linkedDocumentId_extraInitializers = [];
    let _linkType_decorators;
    let _linkType_initializers = [];
    let _linkType_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _createdBy_decorators;
    let _createdBy_initializers = [];
    let _createdBy_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _sourceDocument_decorators;
    let _sourceDocument_initializers = [];
    let _sourceDocument_extraInitializers = [];
    let _targetDocument_decorators;
    let _targetDocument_initializers = [];
    let _targetDocument_extraInitializers = [];
    var DocumentLink = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.documentId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _documentId_initializers, void 0));
            this.linkedDocumentId = (__runInitializers(this, _documentId_extraInitializers), __runInitializers(this, _linkedDocumentId_initializers, void 0));
            this.linkType = (__runInitializers(this, _linkedDocumentId_extraInitializers), __runInitializers(this, _linkType_initializers, void 0));
            this.description = (__runInitializers(this, _linkType_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.createdBy = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _createdBy_initializers, void 0));
            this.createdAt = (__runInitializers(this, _createdBy_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.sourceDocument = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _sourceDocument_initializers, void 0));
            this.targetDocument = (__runInitializers(this, _sourceDocument_extraInitializers), __runInitializers(this, _targetDocument_initializers, void 0));
            __runInitializers(this, _targetDocument_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "DocumentLink");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _documentId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Document ID' }), (0, sequelize_typescript_1.ForeignKey)(() => Document), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _linkedDocumentId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Linked document ID' }), (0, sequelize_typescript_1.ForeignKey)(() => Document), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _linkType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Link type' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50), allowNull: false }), sequelize_typescript_1.Index];
        _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Description' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _createdBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Created by user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _sourceDocument_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => Document, 'documentId')];
        _targetDocument_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => Document, 'linkedDocumentId')];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _documentId_decorators, { kind: "field", name: "documentId", static: false, private: false, access: { has: obj => "documentId" in obj, get: obj => obj.documentId, set: (obj, value) => { obj.documentId = value; } }, metadata: _metadata }, _documentId_initializers, _documentId_extraInitializers);
        __esDecorate(null, null, _linkedDocumentId_decorators, { kind: "field", name: "linkedDocumentId", static: false, private: false, access: { has: obj => "linkedDocumentId" in obj, get: obj => obj.linkedDocumentId, set: (obj, value) => { obj.linkedDocumentId = value; } }, metadata: _metadata }, _linkedDocumentId_initializers, _linkedDocumentId_extraInitializers);
        __esDecorate(null, null, _linkType_decorators, { kind: "field", name: "linkType", static: false, private: false, access: { has: obj => "linkType" in obj, get: obj => obj.linkType, set: (obj, value) => { obj.linkType = value; } }, metadata: _metadata }, _linkType_initializers, _linkType_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _createdBy_decorators, { kind: "field", name: "createdBy", static: false, private: false, access: { has: obj => "createdBy" in obj, get: obj => obj.createdBy, set: (obj, value) => { obj.createdBy = value; } }, metadata: _metadata }, _createdBy_initializers, _createdBy_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _sourceDocument_decorators, { kind: "field", name: "sourceDocument", static: false, private: false, access: { has: obj => "sourceDocument" in obj, get: obj => obj.sourceDocument, set: (obj, value) => { obj.sourceDocument = value; } }, metadata: _metadata }, _sourceDocument_initializers, _sourceDocument_extraInitializers);
        __esDecorate(null, null, _targetDocument_decorators, { kind: "field", name: "targetDocument", static: false, private: false, access: { has: obj => "targetDocument" in obj, get: obj => obj.targetDocument, set: (obj, value) => { obj.targetDocument = value; } }, metadata: _metadata }, _targetDocument_initializers, _targetDocument_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DocumentLink = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DocumentLink = _classThis;
})();
exports.DocumentLink = DocumentLink;
/**
 * Document Review Model
 */
let DocumentReview = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'document_reviews',
            timestamps: true,
            indexes: [
                { fields: ['document_id'] },
                { fields: ['reviewer_id'] },
                { fields: ['status'] },
                { fields: ['due_date'] },
            ],
        })];
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
    let _reviewerId_decorators;
    let _reviewerId_initializers = [];
    let _reviewerId_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _dueDate_decorators;
    let _dueDate_initializers = [];
    let _dueDate_extraInitializers = [];
    let _startedDate_decorators;
    let _startedDate_initializers = [];
    let _startedDate_extraInitializers = [];
    let _completedDate_decorators;
    let _completedDate_initializers = [];
    let _completedDate_extraInitializers = [];
    let _instructions_decorators;
    let _instructions_initializers = [];
    let _instructions_extraInitializers = [];
    let _comments_decorators;
    let _comments_initializers = [];
    let _comments_extraInitializers = [];
    let _changesRequested_decorators;
    let _changesRequested_initializers = [];
    let _changesRequested_extraInitializers = [];
    let _approved_decorators;
    let _approved_initializers = [];
    let _approved_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _document_decorators;
    let _document_initializers = [];
    let _document_extraInitializers = [];
    var DocumentReview = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.documentId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _documentId_initializers, void 0));
            this.reviewerId = (__runInitializers(this, _documentId_extraInitializers), __runInitializers(this, _reviewerId_initializers, void 0));
            this.status = (__runInitializers(this, _reviewerId_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.dueDate = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _dueDate_initializers, void 0));
            this.startedDate = (__runInitializers(this, _dueDate_extraInitializers), __runInitializers(this, _startedDate_initializers, void 0));
            this.completedDate = (__runInitializers(this, _startedDate_extraInitializers), __runInitializers(this, _completedDate_initializers, void 0));
            this.instructions = (__runInitializers(this, _completedDate_extraInitializers), __runInitializers(this, _instructions_initializers, void 0));
            this.comments = (__runInitializers(this, _instructions_extraInitializers), __runInitializers(this, _comments_initializers, void 0));
            this.changesRequested = (__runInitializers(this, _comments_extraInitializers), __runInitializers(this, _changesRequested_initializers, void 0));
            this.approved = (__runInitializers(this, _changesRequested_extraInitializers), __runInitializers(this, _approved_initializers, void 0));
            this.createdAt = (__runInitializers(this, _approved_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.document = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _document_initializers, void 0));
            __runInitializers(this, _document_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "DocumentReview");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _documentId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Document ID' }), (0, sequelize_typescript_1.ForeignKey)(() => Document), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _reviewerId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Reviewer user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'Status' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(ReviewStatus)), defaultValue: ReviewStatus.PENDING }), sequelize_typescript_1.Index];
        _dueDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Due date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false }), sequelize_typescript_1.Index];
        _startedDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Started date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _completedDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Completed date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _instructions_decorators = [(0, swagger_1.ApiProperty)({ description: 'Instructions' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _comments_decorators = [(0, swagger_1.ApiProperty)({ description: 'Comments' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _changesRequested_decorators = [(0, swagger_1.ApiProperty)({ description: 'Changes requested' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _approved_decorators = [(0, swagger_1.ApiProperty)({ description: 'Approved' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _document_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => Document)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _documentId_decorators, { kind: "field", name: "documentId", static: false, private: false, access: { has: obj => "documentId" in obj, get: obj => obj.documentId, set: (obj, value) => { obj.documentId = value; } }, metadata: _metadata }, _documentId_initializers, _documentId_extraInitializers);
        __esDecorate(null, null, _reviewerId_decorators, { kind: "field", name: "reviewerId", static: false, private: false, access: { has: obj => "reviewerId" in obj, get: obj => obj.reviewerId, set: (obj, value) => { obj.reviewerId = value; } }, metadata: _metadata }, _reviewerId_initializers, _reviewerId_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _dueDate_decorators, { kind: "field", name: "dueDate", static: false, private: false, access: { has: obj => "dueDate" in obj, get: obj => obj.dueDate, set: (obj, value) => { obj.dueDate = value; } }, metadata: _metadata }, _dueDate_initializers, _dueDate_extraInitializers);
        __esDecorate(null, null, _startedDate_decorators, { kind: "field", name: "startedDate", static: false, private: false, access: { has: obj => "startedDate" in obj, get: obj => obj.startedDate, set: (obj, value) => { obj.startedDate = value; } }, metadata: _metadata }, _startedDate_initializers, _startedDate_extraInitializers);
        __esDecorate(null, null, _completedDate_decorators, { kind: "field", name: "completedDate", static: false, private: false, access: { has: obj => "completedDate" in obj, get: obj => obj.completedDate, set: (obj, value) => { obj.completedDate = value; } }, metadata: _metadata }, _completedDate_initializers, _completedDate_extraInitializers);
        __esDecorate(null, null, _instructions_decorators, { kind: "field", name: "instructions", static: false, private: false, access: { has: obj => "instructions" in obj, get: obj => obj.instructions, set: (obj, value) => { obj.instructions = value; } }, metadata: _metadata }, _instructions_initializers, _instructions_extraInitializers);
        __esDecorate(null, null, _comments_decorators, { kind: "field", name: "comments", static: false, private: false, access: { has: obj => "comments" in obj, get: obj => obj.comments, set: (obj, value) => { obj.comments = value; } }, metadata: _metadata }, _comments_initializers, _comments_extraInitializers);
        __esDecorate(null, null, _changesRequested_decorators, { kind: "field", name: "changesRequested", static: false, private: false, access: { has: obj => "changesRequested" in obj, get: obj => obj.changesRequested, set: (obj, value) => { obj.changesRequested = value; } }, metadata: _metadata }, _changesRequested_initializers, _changesRequested_extraInitializers);
        __esDecorate(null, null, _approved_decorators, { kind: "field", name: "approved", static: false, private: false, access: { has: obj => "approved" in obj, get: obj => obj.approved, set: (obj, value) => { obj.approved = value; } }, metadata: _metadata }, _approved_initializers, _approved_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _document_decorators, { kind: "field", name: "document", static: false, private: false, access: { has: obj => "document" in obj, get: obj => obj.document, set: (obj, value) => { obj.document = value; } }, metadata: _metadata }, _document_initializers, _document_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DocumentReview = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DocumentReview = _classThis;
})();
exports.DocumentReview = DocumentReview;
/**
 * SDS (Safety Data Sheet) Model
 */
let SafetyDataSheet = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'safety_data_sheets',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['document_id'], unique: true },
                { fields: ['chemical_name'] },
                { fields: ['cas_number'] },
                { fields: ['manufacturer'] },
            ],
        })];
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
    let _chemicalName_decorators;
    let _chemicalName_initializers = [];
    let _chemicalName_extraInitializers = [];
    let _casNumber_decorators;
    let _casNumber_initializers = [];
    let _casNumber_extraInitializers = [];
    let _manufacturer_decorators;
    let _manufacturer_initializers = [];
    let _manufacturer_extraInitializers = [];
    let _hazards_decorators;
    let _hazards_initializers = [];
    let _hazards_extraInitializers = [];
    let _handlingInstructions_decorators;
    let _handlingInstructions_initializers = [];
    let _handlingInstructions_extraInitializers = [];
    let _storageRequirements_decorators;
    let _storageRequirements_initializers = [];
    let _storageRequirements_extraInitializers = [];
    let _disposalRequirements_decorators;
    let _disposalRequirements_initializers = [];
    let _disposalRequirements_extraInitializers = [];
    let _emergencyProcedures_decorators;
    let _emergencyProcedures_initializers = [];
    let _emergencyProcedures_extraInitializers = [];
    let _exposureLimits_decorators;
    let _exposureLimits_initializers = [];
    let _exposureLimits_extraInitializers = [];
    let _ppeRequirements_decorators;
    let _ppeRequirements_initializers = [];
    let _ppeRequirements_extraInitializers = [];
    let _firstAidMeasures_decorators;
    let _firstAidMeasures_initializers = [];
    let _firstAidMeasures_extraInitializers = [];
    let _fireFightingMeasures_decorators;
    let _fireFightingMeasures_initializers = [];
    let _fireFightingMeasures_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    let _document_decorators;
    let _document_initializers = [];
    let _document_extraInitializers = [];
    var SafetyDataSheet = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.documentId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _documentId_initializers, void 0));
            this.chemicalName = (__runInitializers(this, _documentId_extraInitializers), __runInitializers(this, _chemicalName_initializers, void 0));
            this.casNumber = (__runInitializers(this, _chemicalName_extraInitializers), __runInitializers(this, _casNumber_initializers, void 0));
            this.manufacturer = (__runInitializers(this, _casNumber_extraInitializers), __runInitializers(this, _manufacturer_initializers, void 0));
            this.hazards = (__runInitializers(this, _manufacturer_extraInitializers), __runInitializers(this, _hazards_initializers, void 0));
            this.handlingInstructions = (__runInitializers(this, _hazards_extraInitializers), __runInitializers(this, _handlingInstructions_initializers, void 0));
            this.storageRequirements = (__runInitializers(this, _handlingInstructions_extraInitializers), __runInitializers(this, _storageRequirements_initializers, void 0));
            this.disposalRequirements = (__runInitializers(this, _storageRequirements_extraInitializers), __runInitializers(this, _disposalRequirements_initializers, void 0));
            this.emergencyProcedures = (__runInitializers(this, _disposalRequirements_extraInitializers), __runInitializers(this, _emergencyProcedures_initializers, void 0));
            this.exposureLimits = (__runInitializers(this, _emergencyProcedures_extraInitializers), __runInitializers(this, _exposureLimits_initializers, void 0));
            this.ppeRequirements = (__runInitializers(this, _exposureLimits_extraInitializers), __runInitializers(this, _ppeRequirements_initializers, void 0));
            this.firstAidMeasures = (__runInitializers(this, _ppeRequirements_extraInitializers), __runInitializers(this, _firstAidMeasures_initializers, void 0));
            this.fireFightingMeasures = (__runInitializers(this, _firstAidMeasures_extraInitializers), __runInitializers(this, _fireFightingMeasures_initializers, void 0));
            this.createdAt = (__runInitializers(this, _fireFightingMeasures_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.document = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _document_initializers, void 0));
            __runInitializers(this, _document_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "SafetyDataSheet");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _documentId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Document ID' }), (0, sequelize_typescript_1.ForeignKey)(() => Document), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, unique: true, allowNull: false }), sequelize_typescript_1.Index];
        _chemicalName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Chemical name' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(300), allowNull: false }), sequelize_typescript_1.Index];
        _casNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'CAS number' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50) }), sequelize_typescript_1.Index];
        _manufacturer_decorators = [(0, swagger_1.ApiProperty)({ description: 'Manufacturer' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(300), allowNull: false }), sequelize_typescript_1.Index];
        _hazards_decorators = [(0, swagger_1.ApiProperty)({ description: 'Hazards' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING), allowNull: false })];
        _handlingInstructions_decorators = [(0, swagger_1.ApiProperty)({ description: 'Handling instructions' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: false })];
        _storageRequirements_decorators = [(0, swagger_1.ApiProperty)({ description: 'Storage requirements' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: false })];
        _disposalRequirements_decorators = [(0, swagger_1.ApiProperty)({ description: 'Disposal requirements' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: false })];
        _emergencyProcedures_decorators = [(0, swagger_1.ApiProperty)({ description: 'Emergency procedures' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: false })];
        _exposureLimits_decorators = [(0, swagger_1.ApiProperty)({ description: 'Exposure limits' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _ppeRequirements_decorators = [(0, swagger_1.ApiProperty)({ description: 'PPE requirements' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING) })];
        _firstAidMeasures_decorators = [(0, swagger_1.ApiProperty)({ description: 'First aid measures' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _fireFightingMeasures_decorators = [(0, swagger_1.ApiProperty)({ description: 'Fire fighting measures' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        _document_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => Document)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _documentId_decorators, { kind: "field", name: "documentId", static: false, private: false, access: { has: obj => "documentId" in obj, get: obj => obj.documentId, set: (obj, value) => { obj.documentId = value; } }, metadata: _metadata }, _documentId_initializers, _documentId_extraInitializers);
        __esDecorate(null, null, _chemicalName_decorators, { kind: "field", name: "chemicalName", static: false, private: false, access: { has: obj => "chemicalName" in obj, get: obj => obj.chemicalName, set: (obj, value) => { obj.chemicalName = value; } }, metadata: _metadata }, _chemicalName_initializers, _chemicalName_extraInitializers);
        __esDecorate(null, null, _casNumber_decorators, { kind: "field", name: "casNumber", static: false, private: false, access: { has: obj => "casNumber" in obj, get: obj => obj.casNumber, set: (obj, value) => { obj.casNumber = value; } }, metadata: _metadata }, _casNumber_initializers, _casNumber_extraInitializers);
        __esDecorate(null, null, _manufacturer_decorators, { kind: "field", name: "manufacturer", static: false, private: false, access: { has: obj => "manufacturer" in obj, get: obj => obj.manufacturer, set: (obj, value) => { obj.manufacturer = value; } }, metadata: _metadata }, _manufacturer_initializers, _manufacturer_extraInitializers);
        __esDecorate(null, null, _hazards_decorators, { kind: "field", name: "hazards", static: false, private: false, access: { has: obj => "hazards" in obj, get: obj => obj.hazards, set: (obj, value) => { obj.hazards = value; } }, metadata: _metadata }, _hazards_initializers, _hazards_extraInitializers);
        __esDecorate(null, null, _handlingInstructions_decorators, { kind: "field", name: "handlingInstructions", static: false, private: false, access: { has: obj => "handlingInstructions" in obj, get: obj => obj.handlingInstructions, set: (obj, value) => { obj.handlingInstructions = value; } }, metadata: _metadata }, _handlingInstructions_initializers, _handlingInstructions_extraInitializers);
        __esDecorate(null, null, _storageRequirements_decorators, { kind: "field", name: "storageRequirements", static: false, private: false, access: { has: obj => "storageRequirements" in obj, get: obj => obj.storageRequirements, set: (obj, value) => { obj.storageRequirements = value; } }, metadata: _metadata }, _storageRequirements_initializers, _storageRequirements_extraInitializers);
        __esDecorate(null, null, _disposalRequirements_decorators, { kind: "field", name: "disposalRequirements", static: false, private: false, access: { has: obj => "disposalRequirements" in obj, get: obj => obj.disposalRequirements, set: (obj, value) => { obj.disposalRequirements = value; } }, metadata: _metadata }, _disposalRequirements_initializers, _disposalRequirements_extraInitializers);
        __esDecorate(null, null, _emergencyProcedures_decorators, { kind: "field", name: "emergencyProcedures", static: false, private: false, access: { has: obj => "emergencyProcedures" in obj, get: obj => obj.emergencyProcedures, set: (obj, value) => { obj.emergencyProcedures = value; } }, metadata: _metadata }, _emergencyProcedures_initializers, _emergencyProcedures_extraInitializers);
        __esDecorate(null, null, _exposureLimits_decorators, { kind: "field", name: "exposureLimits", static: false, private: false, access: { has: obj => "exposureLimits" in obj, get: obj => obj.exposureLimits, set: (obj, value) => { obj.exposureLimits = value; } }, metadata: _metadata }, _exposureLimits_initializers, _exposureLimits_extraInitializers);
        __esDecorate(null, null, _ppeRequirements_decorators, { kind: "field", name: "ppeRequirements", static: false, private: false, access: { has: obj => "ppeRequirements" in obj, get: obj => obj.ppeRequirements, set: (obj, value) => { obj.ppeRequirements = value; } }, metadata: _metadata }, _ppeRequirements_initializers, _ppeRequirements_extraInitializers);
        __esDecorate(null, null, _firstAidMeasures_decorators, { kind: "field", name: "firstAidMeasures", static: false, private: false, access: { has: obj => "firstAidMeasures" in obj, get: obj => obj.firstAidMeasures, set: (obj, value) => { obj.firstAidMeasures = value; } }, metadata: _metadata }, _firstAidMeasures_initializers, _firstAidMeasures_extraInitializers);
        __esDecorate(null, null, _fireFightingMeasures_decorators, { kind: "field", name: "fireFightingMeasures", static: false, private: false, access: { has: obj => "fireFightingMeasures" in obj, get: obj => obj.fireFightingMeasures, set: (obj, value) => { obj.fireFightingMeasures = value; } }, metadata: _metadata }, _fireFightingMeasures_initializers, _fireFightingMeasures_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _document_decorators, { kind: "field", name: "document", static: false, private: false, access: { has: obj => "document" in obj, get: obj => obj.document, set: (obj, value) => { obj.document = value; } }, metadata: _metadata }, _document_initializers, _document_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SafetyDataSheet = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SafetyDataSheet = _classThis;
})();
exports.SafetyDataSheet = SafetyDataSheet;
/**
 * Technical Drawing Model
 */
let TechnicalDrawing = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'technical_drawings',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['document_id'], unique: true },
                { fields: ['drawing_number'], unique: true },
                { fields: ['revision'] },
            ],
        })];
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
    let _drawingNumber_decorators;
    let _drawingNumber_initializers = [];
    let _drawingNumber_extraInitializers = [];
    let _revision_decorators;
    let _revision_initializers = [];
    let _revision_extraInitializers = [];
    let _sheetNumber_decorators;
    let _sheetNumber_initializers = [];
    let _sheetNumber_extraInitializers = [];
    let _scale_decorators;
    let _scale_initializers = [];
    let _scale_extraInitializers = [];
    let _dimensions_decorators;
    let _dimensions_initializers = [];
    let _dimensions_extraInitializers = [];
    let _materials_decorators;
    let _materials_initializers = [];
    let _materials_extraInitializers = [];
    let _tolerances_decorators;
    let _tolerances_initializers = [];
    let _tolerances_extraInitializers = [];
    let _drawingType_decorators;
    let _drawingType_initializers = [];
    let _drawingType_extraInitializers = [];
    let _cadSoftware_decorators;
    let _cadSoftware_initializers = [];
    let _cadSoftware_extraInitializers = [];
    let _designedBy_decorators;
    let _designedBy_initializers = [];
    let _designedBy_extraInitializers = [];
    let _checkedBy_decorators;
    let _checkedBy_initializers = [];
    let _checkedBy_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    let _document_decorators;
    let _document_initializers = [];
    let _document_extraInitializers = [];
    var TechnicalDrawing = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.documentId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _documentId_initializers, void 0));
            this.drawingNumber = (__runInitializers(this, _documentId_extraInitializers), __runInitializers(this, _drawingNumber_initializers, void 0));
            this.revision = (__runInitializers(this, _drawingNumber_extraInitializers), __runInitializers(this, _revision_initializers, void 0));
            this.sheetNumber = (__runInitializers(this, _revision_extraInitializers), __runInitializers(this, _sheetNumber_initializers, void 0));
            this.scale = (__runInitializers(this, _sheetNumber_extraInitializers), __runInitializers(this, _scale_initializers, void 0));
            this.dimensions = (__runInitializers(this, _scale_extraInitializers), __runInitializers(this, _dimensions_initializers, void 0));
            this.materials = (__runInitializers(this, _dimensions_extraInitializers), __runInitializers(this, _materials_initializers, void 0));
            this.tolerances = (__runInitializers(this, _materials_extraInitializers), __runInitializers(this, _tolerances_initializers, void 0));
            this.drawingType = (__runInitializers(this, _tolerances_extraInitializers), __runInitializers(this, _drawingType_initializers, void 0));
            this.cadSoftware = (__runInitializers(this, _drawingType_extraInitializers), __runInitializers(this, _cadSoftware_initializers, void 0));
            this.designedBy = (__runInitializers(this, _cadSoftware_extraInitializers), __runInitializers(this, _designedBy_initializers, void 0));
            this.checkedBy = (__runInitializers(this, _designedBy_extraInitializers), __runInitializers(this, _checkedBy_initializers, void 0));
            this.createdAt = (__runInitializers(this, _checkedBy_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.document = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _document_initializers, void 0));
            __runInitializers(this, _document_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "TechnicalDrawing");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _documentId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Document ID' }), (0, sequelize_typescript_1.ForeignKey)(() => Document), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, unique: true, allowNull: false }), sequelize_typescript_1.Index];
        _drawingNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Drawing number' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100), unique: true, allowNull: false }), sequelize_typescript_1.Index];
        _revision_decorators = [(0, swagger_1.ApiProperty)({ description: 'Revision' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50), allowNull: false }), sequelize_typescript_1.Index];
        _sheetNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Sheet number' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50) })];
        _scale_decorators = [(0, swagger_1.ApiProperty)({ description: 'Scale' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50) })];
        _dimensions_decorators = [(0, swagger_1.ApiProperty)({ description: 'Dimensions' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _materials_decorators = [(0, swagger_1.ApiProperty)({ description: 'Materials' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING) })];
        _tolerances_decorators = [(0, swagger_1.ApiProperty)({ description: 'Tolerances' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(500) })];
        _drawingType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Drawing type' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100) })];
        _cadSoftware_decorators = [(0, swagger_1.ApiProperty)({ description: 'Created in CAD software' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100) })];
        _designedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Designed by' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _checkedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Checked by' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        _document_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => Document)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _documentId_decorators, { kind: "field", name: "documentId", static: false, private: false, access: { has: obj => "documentId" in obj, get: obj => obj.documentId, set: (obj, value) => { obj.documentId = value; } }, metadata: _metadata }, _documentId_initializers, _documentId_extraInitializers);
        __esDecorate(null, null, _drawingNumber_decorators, { kind: "field", name: "drawingNumber", static: false, private: false, access: { has: obj => "drawingNumber" in obj, get: obj => obj.drawingNumber, set: (obj, value) => { obj.drawingNumber = value; } }, metadata: _metadata }, _drawingNumber_initializers, _drawingNumber_extraInitializers);
        __esDecorate(null, null, _revision_decorators, { kind: "field", name: "revision", static: false, private: false, access: { has: obj => "revision" in obj, get: obj => obj.revision, set: (obj, value) => { obj.revision = value; } }, metadata: _metadata }, _revision_initializers, _revision_extraInitializers);
        __esDecorate(null, null, _sheetNumber_decorators, { kind: "field", name: "sheetNumber", static: false, private: false, access: { has: obj => "sheetNumber" in obj, get: obj => obj.sheetNumber, set: (obj, value) => { obj.sheetNumber = value; } }, metadata: _metadata }, _sheetNumber_initializers, _sheetNumber_extraInitializers);
        __esDecorate(null, null, _scale_decorators, { kind: "field", name: "scale", static: false, private: false, access: { has: obj => "scale" in obj, get: obj => obj.scale, set: (obj, value) => { obj.scale = value; } }, metadata: _metadata }, _scale_initializers, _scale_extraInitializers);
        __esDecorate(null, null, _dimensions_decorators, { kind: "field", name: "dimensions", static: false, private: false, access: { has: obj => "dimensions" in obj, get: obj => obj.dimensions, set: (obj, value) => { obj.dimensions = value; } }, metadata: _metadata }, _dimensions_initializers, _dimensions_extraInitializers);
        __esDecorate(null, null, _materials_decorators, { kind: "field", name: "materials", static: false, private: false, access: { has: obj => "materials" in obj, get: obj => obj.materials, set: (obj, value) => { obj.materials = value; } }, metadata: _metadata }, _materials_initializers, _materials_extraInitializers);
        __esDecorate(null, null, _tolerances_decorators, { kind: "field", name: "tolerances", static: false, private: false, access: { has: obj => "tolerances" in obj, get: obj => obj.tolerances, set: (obj, value) => { obj.tolerances = value; } }, metadata: _metadata }, _tolerances_initializers, _tolerances_extraInitializers);
        __esDecorate(null, null, _drawingType_decorators, { kind: "field", name: "drawingType", static: false, private: false, access: { has: obj => "drawingType" in obj, get: obj => obj.drawingType, set: (obj, value) => { obj.drawingType = value; } }, metadata: _metadata }, _drawingType_initializers, _drawingType_extraInitializers);
        __esDecorate(null, null, _cadSoftware_decorators, { kind: "field", name: "cadSoftware", static: false, private: false, access: { has: obj => "cadSoftware" in obj, get: obj => obj.cadSoftware, set: (obj, value) => { obj.cadSoftware = value; } }, metadata: _metadata }, _cadSoftware_initializers, _cadSoftware_extraInitializers);
        __esDecorate(null, null, _designedBy_decorators, { kind: "field", name: "designedBy", static: false, private: false, access: { has: obj => "designedBy" in obj, get: obj => obj.designedBy, set: (obj, value) => { obj.designedBy = value; } }, metadata: _metadata }, _designedBy_initializers, _designedBy_extraInitializers);
        __esDecorate(null, null, _checkedBy_decorators, { kind: "field", name: "checkedBy", static: false, private: false, access: { has: obj => "checkedBy" in obj, get: obj => obj.checkedBy, set: (obj, value) => { obj.checkedBy = value; } }, metadata: _metadata }, _checkedBy_initializers, _checkedBy_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _document_decorators, { kind: "field", name: "document", static: false, private: false, access: { has: obj => "document" in obj, get: obj => obj.document, set: (obj, value) => { obj.document = value; } }, metadata: _metadata }, _document_initializers, _document_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TechnicalDrawing = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TechnicalDrawing = _classThis;
})();
exports.TechnicalDrawing = TechnicalDrawing;
/**
 * Document Access Log Model
 */
let DocumentAccessLog = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'document_access_logs',
            timestamps: true,
            indexes: [
                { fields: ['document_id'] },
                { fields: ['user_id'] },
                { fields: ['action'] },
                { fields: ['accessed_at'] },
            ],
        })];
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
    let _userId_decorators;
    let _userId_initializers = [];
    let _userId_extraInitializers = [];
    let _action_decorators;
    let _action_initializers = [];
    let _action_extraInitializers = [];
    let _accessedAt_decorators;
    let _accessedAt_initializers = [];
    let _accessedAt_extraInitializers = [];
    let _ipAddress_decorators;
    let _ipAddress_initializers = [];
    let _ipAddress_extraInitializers = [];
    let _userAgent_decorators;
    let _userAgent_initializers = [];
    let _userAgent_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _document_decorators;
    let _document_initializers = [];
    let _document_extraInitializers = [];
    var DocumentAccessLog = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.documentId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _documentId_initializers, void 0));
            this.userId = (__runInitializers(this, _documentId_extraInitializers), __runInitializers(this, _userId_initializers, void 0));
            this.action = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _action_initializers, void 0));
            this.accessedAt = (__runInitializers(this, _action_extraInitializers), __runInitializers(this, _accessedAt_initializers, void 0));
            this.ipAddress = (__runInitializers(this, _accessedAt_extraInitializers), __runInitializers(this, _ipAddress_initializers, void 0));
            this.userAgent = (__runInitializers(this, _ipAddress_extraInitializers), __runInitializers(this, _userAgent_initializers, void 0));
            this.createdAt = (__runInitializers(this, _userAgent_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.document = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _document_initializers, void 0));
            __runInitializers(this, _document_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "DocumentAccessLog");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _documentId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Document ID' }), (0, sequelize_typescript_1.ForeignKey)(() => Document), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _userId_decorators = [(0, swagger_1.ApiProperty)({ description: 'User ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _action_decorators = [(0, swagger_1.ApiProperty)({ description: 'Action' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50), allowNull: false }), sequelize_typescript_1.Index];
        _accessedAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Accessed at' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false, defaultValue: sequelize_typescript_1.DataType.NOW }), sequelize_typescript_1.Index];
        _ipAddress_decorators = [(0, swagger_1.ApiProperty)({ description: 'IP address' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50) })];
        _userAgent_decorators = [(0, swagger_1.ApiProperty)({ description: 'User agent' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(500) })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _document_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => Document)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _documentId_decorators, { kind: "field", name: "documentId", static: false, private: false, access: { has: obj => "documentId" in obj, get: obj => obj.documentId, set: (obj, value) => { obj.documentId = value; } }, metadata: _metadata }, _documentId_initializers, _documentId_extraInitializers);
        __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: obj => "userId" in obj, get: obj => obj.userId, set: (obj, value) => { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
        __esDecorate(null, null, _action_decorators, { kind: "field", name: "action", static: false, private: false, access: { has: obj => "action" in obj, get: obj => obj.action, set: (obj, value) => { obj.action = value; } }, metadata: _metadata }, _action_initializers, _action_extraInitializers);
        __esDecorate(null, null, _accessedAt_decorators, { kind: "field", name: "accessedAt", static: false, private: false, access: { has: obj => "accessedAt" in obj, get: obj => obj.accessedAt, set: (obj, value) => { obj.accessedAt = value; } }, metadata: _metadata }, _accessedAt_initializers, _accessedAt_extraInitializers);
        __esDecorate(null, null, _ipAddress_decorators, { kind: "field", name: "ipAddress", static: false, private: false, access: { has: obj => "ipAddress" in obj, get: obj => obj.ipAddress, set: (obj, value) => { obj.ipAddress = value; } }, metadata: _metadata }, _ipAddress_initializers, _ipAddress_extraInitializers);
        __esDecorate(null, null, _userAgent_decorators, { kind: "field", name: "userAgent", static: false, private: false, access: { has: obj => "userAgent" in obj, get: obj => obj.userAgent, set: (obj, value) => { obj.userAgent = value; } }, metadata: _metadata }, _userAgent_initializers, _userAgent_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _document_decorators, { kind: "field", name: "document", static: false, private: false, access: { has: obj => "document" in obj, get: obj => obj.document, set: (obj, value) => { obj.document = value; } }, metadata: _metadata }, _document_initializers, _document_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DocumentAccessLog = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DocumentAccessLog = _classThis;
})();
exports.DocumentAccessLog = DocumentAccessLog;
// ============================================================================
// DOCUMENT MANAGEMENT FUNCTIONS
// ============================================================================
/**
 * Creates a document
 *
 * @param data - Document data
 * @param transaction - Optional database transaction
 * @returns Created document
 *
 * @example
 * ```typescript
 * const doc = await createDocument({
 *   assetId: 'asset-123',
 *   documentType: DocumentType.OPERATING_MANUAL,
 *   title: 'Machine Operating Manual',
 *   fileUrl: 's3://docs/manual.pdf',
 *   fileName: 'manual.pdf',
 *   fileFormat: FileFormat.PDF,
 *   version: '1.0',
 *   createdBy: 'user-456',
 *   tags: ['manual', 'operations']
 * });
 * ```
 */
async function createDocument(data, transaction) {
    const doc = await Document.create({
        ...data,
        status: DocumentStatus.DRAFT,
    }, { transaction });
    // Create initial version
    await DocumentVersion.create({
        documentId: doc.id,
        version: data.version,
        fileUrl: data.fileUrl,
        fileName: data.fileName,
        fileSize: data.fileSize,
        changes: 'Initial version',
        createdBy: data.createdBy,
    }, { transaction });
    return doc;
}
/**
 * Updates document
 *
 * @param documentId - Document ID
 * @param updates - Fields to update
 * @param userId - User making update
 * @param transaction - Optional database transaction
 * @returns Updated document
 *
 * @example
 * ```typescript
 * await updateDocument('doc-123', {
 *   title: 'Updated Manual Title',
 *   tags: ['manual', 'operations', 'safety']
 * }, 'user-456');
 * ```
 */
async function updateDocument(documentId, updates, userId, transaction) {
    const doc = await Document.findByPk(documentId, { transaction });
    if (!doc) {
        throw new common_1.NotFoundException(`Document ${documentId} not found`);
    }
    await doc.update({ ...updates, lastModifiedBy: userId }, { transaction });
    return doc;
}
/**
 * Gets document by ID
 *
 * @param documentId - Document ID
 * @param includeVersions - Include version history
 * @returns Document
 *
 * @example
 * ```typescript
 * const doc = await getDocument('doc-123', true);
 * ```
 */
async function getDocument(documentId, includeVersions = false) {
    const include = [];
    if (includeVersions) {
        include.push({ model: DocumentVersion, as: 'versions' });
    }
    const doc = await Document.findByPk(documentId, { include });
    if (!doc) {
        throw new common_1.NotFoundException(`Document ${documentId} not found`);
    }
    return doc;
}
/**
 * Gets documents by asset
 *
 * @param assetId - Asset ID
 * @param documentType - Optional document type filter
 * @returns Documents
 *
 * @example
 * ```typescript
 * const docs = await getDocumentsByAsset('asset-123', DocumentType.SDS);
 * ```
 */
async function getDocumentsByAsset(assetId, documentType) {
    const where = { assetId };
    if (documentType) {
        where.documentType = documentType;
    }
    return Document.findAll({
        where,
        order: [['createdAt', 'DESC']],
    });
}
/**
 * Publishes document
 *
 * @param documentId - Document ID
 * @param userId - User publishing
 * @param transaction - Optional database transaction
 * @returns Updated document
 *
 * @example
 * ```typescript
 * await publishDocument('doc-123', 'user-456');
 * ```
 */
async function publishDocument(documentId, userId, transaction) {
    const doc = await Document.findByPk(documentId, { transaction });
    if (!doc) {
        throw new common_1.NotFoundException(`Document ${documentId} not found`);
    }
    if (doc.status !== DocumentStatus.APPROVED) {
        throw new common_1.BadRequestException('Document must be approved before publishing');
    }
    await doc.update({
        status: DocumentStatus.PUBLISHED,
        publishedDate: new Date(),
        lastModifiedBy: userId,
    }, { transaction });
    return doc;
}
/**
 * Archives document
 *
 * @param documentId - Document ID
 * @param userId - User archiving
 * @param transaction - Optional database transaction
 * @returns Updated document
 *
 * @example
 * ```typescript
 * await archiveDocument('doc-123', 'user-456');
 * ```
 */
async function archiveDocument(documentId, userId, transaction) {
    const doc = await Document.findByPk(documentId, { transaction });
    if (!doc) {
        throw new common_1.NotFoundException(`Document ${documentId} not found`);
    }
    await doc.update({
        status: DocumentStatus.ARCHIVED,
        lastModifiedBy: userId,
    }, { transaction });
    return doc;
}
/**
 * Deletes document (soft delete)
 *
 * @param documentId - Document ID
 * @param userId - User deleting
 * @param transaction - Optional database transaction
 * @returns Deleted document
 *
 * @example
 * ```typescript
 * await deleteDocument('doc-123', 'user-456');
 * ```
 */
async function deleteDocument(documentId, userId, transaction) {
    const doc = await Document.findByPk(documentId, { transaction });
    if (!doc) {
        throw new common_1.NotFoundException(`Document ${documentId} not found`);
    }
    await doc.update({ lastModifiedBy: userId }, { transaction });
    await doc.destroy({ transaction });
    return doc;
}
// ============================================================================
// VERSION CONTROL FUNCTIONS
// ============================================================================
/**
 * Creates document version
 *
 * @param data - Version data
 * @param transaction - Optional database transaction
 * @returns Created version
 *
 * @example
 * ```typescript
 * const version = await createDocumentVersion({
 *   documentId: 'doc-123',
 *   version: '2.0',
 *   fileUrl: 's3://docs/manual-v2.pdf',
 *   fileName: 'manual-v2.pdf',
 *   changes: 'Updated safety procedures',
 *   createdBy: 'user-456',
 *   releaseNotes: 'Major update with new safety guidelines'
 * });
 * ```
 */
async function createDocumentVersion(data, transaction) {
    const doc = await Document.findByPk(data.documentId, { transaction });
    if (!doc) {
        throw new common_1.NotFoundException(`Document ${data.documentId} not found`);
    }
    // Get previous version
    const previousVersion = await DocumentVersion.findOne({
        where: { documentId: data.documentId },
        order: [['createdAt', 'DESC']],
        transaction,
    });
    const version = await DocumentVersion.create({
        ...data,
        previousVersion: previousVersion?.version,
    }, { transaction });
    // Update document
    await doc.update({
        version: data.version,
        fileUrl: data.fileUrl,
        fileName: data.fileName,
        lastModifiedBy: data.createdBy,
    }, { transaction });
    return version;
}
/**
 * Gets version history
 *
 * @param documentId - Document ID
 * @returns Version history
 *
 * @example
 * ```typescript
 * const history = await getVersionHistory('doc-123');
 * ```
 */
async function getVersionHistory(documentId) {
    return DocumentVersion.findAll({
        where: { documentId },
        order: [['createdAt', 'DESC']],
    });
}
/**
 * Reverts to previous version
 *
 * @param documentId - Document ID
 * @param versionId - Version to revert to
 * @param userId - User performing revert
 * @param transaction - Optional database transaction
 * @returns Updated document
 *
 * @example
 * ```typescript
 * await revertToVersion('doc-123', 'version-456', 'user-789');
 * ```
 */
async function revertToVersion(documentId, versionId, userId, transaction) {
    const version = await DocumentVersion.findByPk(versionId, { transaction });
    if (!version || version.documentId !== documentId) {
        throw new common_1.NotFoundException('Version not found');
    }
    const doc = await Document.findByPk(documentId, { transaction });
    if (!doc) {
        throw new common_1.NotFoundException(`Document ${documentId} not found`);
    }
    // Create new version marking revert
    await DocumentVersion.create({
        documentId,
        version: `${doc.version}-revert`,
        previousVersion: doc.version,
        fileUrl: version.fileUrl,
        fileName: version.fileName,
        fileSize: version.fileSize,
        changes: `Reverted to version ${version.version}`,
        createdBy: userId,
    }, { transaction });
    await doc.update({
        fileUrl: version.fileUrl,
        fileName: version.fileName,
        version: `${doc.version}-revert`,
        lastModifiedBy: userId,
    }, { transaction });
    return doc;
}
/**
 * Compares two versions
 *
 * @param documentId - Document ID
 * @param version1 - First version
 * @param version2 - Second version
 * @returns Comparison data
 *
 * @example
 * ```typescript
 * const diff = await compareVersions('doc-123', '1.0', '2.0');
 * ```
 */
async function compareVersions(documentId, version1, version2) {
    const v1 = await DocumentVersion.findOne({
        where: { documentId, version: version1 },
    });
    const v2 = await DocumentVersion.findOne({
        where: { documentId, version: version2 },
    });
    if (!v1 || !v2) {
        throw new common_1.NotFoundException('One or both versions not found');
    }
    const timeDiff = v2.createdAt.getTime() - v1.createdAt.getTime();
    const sizeDiff = (v2.fileSize || 0) - (v1.fileSize || 0);
    return {
        version1: v1,
        version2: v2,
        timeDiff,
        sizeDiff,
    };
}
// ============================================================================
// DOCUMENT LINKING FUNCTIONS
// ============================================================================
/**
 * Links documents
 *
 * @param data - Link data
 * @param transaction - Optional database transaction
 * @returns Created link
 *
 * @example
 * ```typescript
 * await linkDocuments({
 *   documentId: 'doc-123',
 *   linkedDocumentId: 'doc-456',
 *   linkType: 'references',
 *   description: 'Operating manual references SDS'
 * });
 * ```
 */
async function linkDocuments(data, transaction) {
    const doc1 = await Document.findByPk(data.documentId, { transaction });
    const doc2 = await Document.findByPk(data.linkedDocumentId, { transaction });
    if (!doc1 || !doc2) {
        throw new common_1.NotFoundException('One or both documents not found');
    }
    // Check for existing link
    const existing = await DocumentLink.findOne({
        where: {
            documentId: data.documentId,
            linkedDocumentId: data.linkedDocumentId,
            linkType: data.linkType,
        },
        transaction,
    });
    if (existing) {
        throw new common_1.ConflictException('Link already exists');
    }
    const link = await DocumentLink.create(data, { transaction });
    return link;
}
/**
 * Unlinks documents
 *
 * @param linkId - Link ID
 * @param transaction - Optional database transaction
 * @returns Deleted link
 *
 * @example
 * ```typescript
 * await unlinkDocuments('link-123');
 * ```
 */
async function unlinkDocuments(linkId, transaction) {
    const link = await DocumentLink.findByPk(linkId, { transaction });
    if (!link) {
        throw new common_1.NotFoundException(`Link ${linkId} not found`);
    }
    await link.destroy({ transaction });
    return link;
}
/**
 * Gets linked documents
 *
 * @param documentId - Document ID
 * @param direction - 'outgoing', 'incoming', or 'both'
 * @returns Linked documents
 *
 * @example
 * ```typescript
 * const links = await getLinkedDocuments('doc-123', 'both');
 * ```
 */
async function getLinkedDocuments(documentId, direction = 'both') {
    const where = {};
    if (direction === 'outgoing') {
        where.documentId = documentId;
    }
    else if (direction === 'incoming') {
        where.linkedDocumentId = documentId;
    }
    else {
        where[sequelize_1.Op.or] = [
            { documentId },
            { linkedDocumentId: documentId },
        ];
    }
    return DocumentLink.findAll({
        where,
        include: [
            { model: Document, as: 'sourceDocument' },
            { model: Document, as: 'targetDocument' },
        ],
    });
}
/**
 * Links document to asset
 *
 * @param documentId - Document ID
 * @param assetId - Asset ID
 * @param userId - User creating link
 * @param transaction - Optional database transaction
 * @returns Updated document
 *
 * @example
 * ```typescript
 * await linkDocumentToAsset('doc-123', 'asset-456', 'user-789');
 * ```
 */
async function linkDocumentToAsset(documentId, assetId, userId, transaction) {
    const doc = await Document.findByPk(documentId, { transaction });
    if (!doc) {
        throw new common_1.NotFoundException(`Document ${documentId} not found`);
    }
    await doc.update({
        assetId,
        lastModifiedBy: userId,
    }, { transaction });
    return doc;
}
// ============================================================================
// REVIEW WORKFLOW FUNCTIONS
// ============================================================================
/**
 * Creates document review
 *
 * @param data - Review data
 * @param transaction - Optional database transaction
 * @returns Created review
 *
 * @example
 * ```typescript
 * const review = await createDocumentReview({
 *   documentId: 'doc-123',
 *   reviewerId: 'reviewer-456',
 *   dueDate: new Date('2024-12-31'),
 *   instructions: 'Please review for technical accuracy'
 * });
 * ```
 */
async function createDocumentReview(data, transaction) {
    const doc = await Document.findByPk(data.documentId, { transaction });
    if (!doc) {
        throw new common_1.NotFoundException(`Document ${data.documentId} not found`);
    }
    const review = await DocumentReview.create({
        ...data,
        status: ReviewStatus.PENDING,
    }, { transaction });
    // Update document status
    await doc.update({
        status: DocumentStatus.IN_REVIEW,
    }, { transaction });
    return review;
}
/**
 * Starts review
 *
 * @param reviewId - Review ID
 * @param transaction - Optional database transaction
 * @returns Updated review
 *
 * @example
 * ```typescript
 * await startReview('review-123');
 * ```
 */
async function startReview(reviewId, transaction) {
    const review = await DocumentReview.findByPk(reviewId, { transaction });
    if (!review) {
        throw new common_1.NotFoundException(`Review ${reviewId} not found`);
    }
    await review.update({
        status: ReviewStatus.IN_PROGRESS,
        startedDate: new Date(),
    }, { transaction });
    return review;
}
/**
 * Approves document in review
 *
 * @param reviewId - Review ID
 * @param comments - Approval comments
 * @param transaction - Optional database transaction
 * @returns Updated review
 *
 * @example
 * ```typescript
 * await approveDocumentReview('review-123', 'Approved - looks good');
 * ```
 */
async function approveDocumentReview(reviewId, comments, transaction) {
    const review = await DocumentReview.findByPk(reviewId, {
        include: [{ model: Document }],
        transaction,
    });
    if (!review) {
        throw new common_1.NotFoundException(`Review ${reviewId} not found`);
    }
    await review.update({
        status: ReviewStatus.APPROVED,
        approved: true,
        completedDate: new Date(),
        comments,
    }, { transaction });
    // Update document
    const doc = review.document;
    await doc.update({
        status: DocumentStatus.APPROVED,
        approvedBy: review.reviewerId,
        approvalDate: new Date(),
        lastReviewedDate: new Date(),
    }, { transaction });
    return review;
}
/**
 * Rejects document in review
 *
 * @param reviewId - Review ID
 * @param reason - Rejection reason
 * @param changesRequested - Changes requested
 * @param transaction - Optional database transaction
 * @returns Updated review
 *
 * @example
 * ```typescript
 * await rejectDocumentReview('review-123', 'Technical inaccuracies found', 'Update section 3.2');
 * ```
 */
async function rejectDocumentReview(reviewId, reason, changesRequested, transaction) {
    const review = await DocumentReview.findByPk(reviewId, {
        include: [{ model: Document }],
        transaction,
    });
    if (!review) {
        throw new common_1.NotFoundException(`Review ${reviewId} not found`);
    }
    const status = changesRequested
        ? ReviewStatus.CHANGES_REQUESTED
        : ReviewStatus.REJECTED;
    await review.update({
        status,
        approved: false,
        completedDate: new Date(),
        comments: reason,
        changesRequested,
    }, { transaction });
    // Update document
    const doc = review.document;
    await doc.update({
        status: DocumentStatus.DRAFT,
    }, { transaction });
    return review;
}
/**
 * Gets pending reviews
 *
 * @param reviewerId - Optional reviewer filter
 * @returns Pending reviews
 *
 * @example
 * ```typescript
 * const myReviews = await getPendingReviews('reviewer-123');
 * ```
 */
async function getPendingReviews(reviewerId) {
    const where = {
        status: { [sequelize_1.Op.in]: [ReviewStatus.PENDING, ReviewStatus.IN_PROGRESS] },
    };
    if (reviewerId) {
        where.reviewerId = reviewerId;
    }
    return DocumentReview.findAll({
        where,
        include: [{ model: Document }],
        order: [['dueDate', 'ASC']],
    });
}
// ============================================================================
// SEARCH FUNCTIONS
// ============================================================================
/**
 * Searches documents
 *
 * @param query - Search query
 * @param options - Search options
 * @returns Search results
 *
 * @example
 * ```typescript
 * const results = await searchDocuments('safety procedures', {
 *   documentTypes: [DocumentType.SOP, DocumentType.SDS],
 *   tags: ['safety'],
 *   dateFrom: new Date('2024-01-01')
 * });
 * ```
 */
async function searchDocuments(query, options = {}) {
    const where = {};
    if (query) {
        where[sequelize_1.Op.or] = [
            { title: { [sequelize_1.Op.iLike]: `%${query}%` } },
            { description: { [sequelize_1.Op.iLike]: `%${query}%` } },
            { fullTextContent: { [sequelize_1.Op.iLike]: `%${query}%` } },
        ];
    }
    if (options.documentTypes && options.documentTypes.length > 0) {
        where.documentType = { [sequelize_1.Op.in]: options.documentTypes };
    }
    if (options.status && options.status.length > 0) {
        where.status = { [sequelize_1.Op.in]: options.status };
    }
    if (options.assetId) {
        where.assetId = options.assetId;
    }
    if (options.tags && options.tags.length > 0) {
        where.tags = { [sequelize_1.Op.overlap]: options.tags };
    }
    if (options.accessLevel && options.accessLevel.length > 0) {
        where.accessLevel = { [sequelize_1.Op.in]: options.accessLevel };
    }
    if (options.dateFrom || options.dateTo) {
        where.createdAt = {};
        if (options.dateFrom) {
            where.createdAt[sequelize_1.Op.gte] = options.dateFrom;
        }
        if (options.dateTo) {
            where.createdAt[sequelize_1.Op.lte] = options.dateTo;
        }
    }
    return Document.findAll({
        where,
        order: [['createdAt', 'DESC']],
        limit: options.limit || 100,
        offset: options.offset || 0,
    });
}
/**
 * Searches by tags
 *
 * @param tags - Tags to search
 * @returns Documents
 *
 * @example
 * ```typescript
 * const docs = await searchByTags(['manual', 'operations']);
 * ```
 */
async function searchByTags(tags) {
    return Document.findAll({
        where: {
            tags: { [sequelize_1.Op.overlap]: tags },
        },
        order: [['createdAt', 'DESC']],
    });
}
/**
 * Gets expiring documents
 *
 * @param daysAhead - Days to look ahead
 * @returns Expiring documents
 *
 * @example
 * ```typescript
 * const expiring = await getExpiringDocuments(30); // Next 30 days
 * ```
 */
async function getExpiringDocuments(daysAhead = 30) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);
    return Document.findAll({
        where: {
            expirationDate: {
                [sequelize_1.Op.between]: [new Date(), futureDate],
            },
            status: { [sequelize_1.Op.notIn]: [DocumentStatus.ARCHIVED, DocumentStatus.OBSOLETE] },
        },
        order: [['expirationDate', 'ASC']],
    });
}
/**
 * Gets documents due for review
 *
 * @param daysAhead - Days to look ahead
 * @returns Documents due for review
 *
 * @example
 * ```typescript
 * const dueForReview = await getDocumentsDueForReview(14);
 * ```
 */
async function getDocumentsDueForReview(daysAhead = 30) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);
    return Document.findAll({
        where: {
            reviewDate: {
                [sequelize_1.Op.lte]: futureDate,
            },
            status: DocumentStatus.PUBLISHED,
        },
        order: [['reviewDate', 'ASC']],
    });
}
// ============================================================================
// SDS FUNCTIONS
// ============================================================================
/**
 * Creates Safety Data Sheet
 *
 * @param data - SDS data
 * @param transaction - Optional database transaction
 * @returns Created SDS
 *
 * @example
 * ```typescript
 * const sds = await createSDS({
 *   documentId: 'doc-123',
 *   chemicalName: 'Acetone',
 *   casNumber: '67-64-1',
 *   manufacturer: 'Chemical Co',
 *   hazards: ['Flammable', 'Irritant'],
 *   handlingInstructions: 'Use in well-ventilated area',
 *   storageRequirements: 'Store in cool, dry place',
 *   disposalRequirements: 'Dispose as hazardous waste',
 *   emergencyProcedures: 'In case of spill, evacuate area'
 * });
 * ```
 */
async function createSDS(data, transaction) {
    const doc = await Document.findByPk(data.documentId, { transaction });
    if (!doc) {
        throw new common_1.NotFoundException(`Document ${data.documentId} not found`);
    }
    if (doc.documentType !== DocumentType.SDS) {
        throw new common_1.BadRequestException('Document must be of type SDS');
    }
    const sds = await SafetyDataSheet.create(data, { transaction });
    return sds;
}
/**
 * Gets SDS by chemical name
 *
 * @param chemicalName - Chemical name
 * @returns SDS records
 *
 * @example
 * ```typescript
 * const sds = await getSDSByChemical('Acetone');
 * ```
 */
async function getSDSByChemical(chemicalName) {
    return SafetyDataSheet.findAll({
        where: {
            chemicalName: { [sequelize_1.Op.iLike]: `%${chemicalName}%` },
        },
        include: [{ model: Document }],
        order: [['createdAt', 'DESC']],
    });
}
/**
 * Gets SDS by CAS number
 *
 * @param casNumber - CAS number
 * @returns SDS record
 *
 * @example
 * ```typescript
 * const sds = await getSDSByCAS('67-64-1');
 * ```
 */
async function getSDSByCAS(casNumber) {
    return SafetyDataSheet.findOne({
        where: { casNumber },
        include: [{ model: Document }],
    });
}
// ============================================================================
// TECHNICAL DRAWING FUNCTIONS
// ============================================================================
/**
 * Creates technical drawing
 *
 * @param data - Drawing data
 * @param transaction - Optional database transaction
 * @returns Created drawing
 *
 * @example
 * ```typescript
 * const drawing = await createTechnicalDrawing({
 *   documentId: 'doc-123',
 *   drawingNumber: 'DWG-2024-001',
 *   revision: 'A',
 *   scale: '1:10',
 *   materials: ['Steel', 'Aluminum']
 * });
 * ```
 */
async function createTechnicalDrawing(data, transaction) {
    const doc = await Document.findByPk(data.documentId, { transaction });
    if (!doc) {
        throw new common_1.NotFoundException(`Document ${data.documentId} not found`);
    }
    const drawing = await TechnicalDrawing.create(data, { transaction });
    return drawing;
}
/**
 * Gets drawing by number
 *
 * @param drawingNumber - Drawing number
 * @returns Drawing record
 *
 * @example
 * ```typescript
 * const drawing = await getDrawingByNumber('DWG-2024-001');
 * ```
 */
async function getDrawingByNumber(drawingNumber) {
    return TechnicalDrawing.findOne({
        where: { drawingNumber },
        include: [{ model: Document }],
    });
}
/**
 * Gets drawings by revision
 *
 * @param drawingNumber - Drawing number
 * @returns Drawing revisions
 *
 * @example
 * ```typescript
 * const revisions = await getDrawingRevisions('DWG-2024-001');
 * ```
 */
async function getDrawingRevisions(drawingNumber) {
    return TechnicalDrawing.findAll({
        where: {
            drawingNumber: { [sequelize_1.Op.like]: `${drawingNumber}%` },
        },
        include: [{ model: Document }],
        order: [['revision', 'DESC']],
    });
}
// ============================================================================
// ACCESS LOGGING FUNCTIONS
// ============================================================================
/**
 * Logs document access
 *
 * @param documentId - Document ID
 * @param userId - User ID
 * @param action - Action performed
 * @param metadata - Additional metadata
 * @param transaction - Optional database transaction
 * @returns Access log entry
 *
 * @example
 * ```typescript
 * await logDocumentAccess('doc-123', 'user-456', 'view', { ipAddress: '192.168.1.1' });
 * ```
 */
async function logDocumentAccess(documentId, userId, action, metadata, transaction) {
    const log = await DocumentAccessLog.create({
        documentId,
        userId,
        action,
        accessedAt: new Date(),
        ipAddress: metadata?.ipAddress,
        userAgent: metadata?.userAgent,
    }, { transaction });
    // Update document counters
    if (action === 'view') {
        await Document.increment('viewCount', {
            where: { id: documentId },
            transaction,
        });
    }
    else if (action === 'download') {
        await Document.increment('downloadCount', {
            where: { id: documentId },
            transaction,
        });
    }
    return log;
}
/**
 * Gets access logs for document
 *
 * @param documentId - Document ID
 * @param limit - Maximum logs to return
 * @returns Access logs
 *
 * @example
 * ```typescript
 * const logs = await getDocumentAccessLogs('doc-123', 50);
 * ```
 */
async function getDocumentAccessLogs(documentId, limit = 100) {
    return DocumentAccessLog.findAll({
        where: { documentId },
        order: [['accessedAt', 'DESC']],
        limit,
    });
}
/**
 * Gets user access history
 *
 * @param userId - User ID
 * @param limit - Maximum logs to return
 * @returns Access logs
 *
 * @example
 * ```typescript
 * const history = await getUserAccessHistory('user-123', 20);
 * ```
 */
async function getUserAccessHistory(userId, limit = 100) {
    return DocumentAccessLog.findAll({
        where: { userId },
        include: [{ model: Document }],
        order: [['accessedAt', 'DESC']],
        limit,
    });
}
// ============================================================================
// BULK OPERATIONS
// ============================================================================
/**
 * Bulk updates document status
 *
 * @param documentIds - Document IDs
 * @param status - New status
 * @param userId - User making update
 * @param transaction - Optional database transaction
 * @returns Number of updated documents
 *
 * @example
 * ```typescript
 * await bulkUpdateStatus(['doc-1', 'doc-2'], DocumentStatus.PUBLISHED, 'user-123');
 * ```
 */
async function bulkUpdateStatus(documentIds, status, userId, transaction) {
    const [count] = await Document.update({ status, lastModifiedBy: userId }, { where: { id: { [sequelize_1.Op.in]: documentIds } }, transaction });
    return count;
}
/**
 * Bulk adds tags
 *
 * @param documentIds - Document IDs
 * @param tags - Tags to add
 * @param userId - User adding tags
 * @param transaction - Optional database transaction
 * @returns Updated documents
 *
 * @example
 * ```typescript
 * await bulkAddTags(['doc-1', 'doc-2'], ['safety', 'critical'], 'user-123');
 * ```
 */
async function bulkAddTags(documentIds, tags, userId, transaction) {
    const docs = await Document.findAll({
        where: { id: { [sequelize_1.Op.in]: documentIds } },
        transaction,
    });
    for (const doc of docs) {
        const existingTags = doc.tags || [];
        const newTags = Array.from(new Set([...existingTags, ...tags]));
        await doc.update({ tags: newTags, lastModifiedBy: userId }, { transaction });
    }
    return docs;
}
/**
 * Bulk exports documents
 *
 * @param documentIds - Document IDs
 * @returns Export manifest
 *
 * @example
 * ```typescript
 * const manifest = await bulkExportDocuments(['doc-1', 'doc-2', 'doc-3']);
 * ```
 */
async function bulkExportDocuments(documentIds) {
    const docs = await Document.findAll({
        where: { id: { [sequelize_1.Op.in]: documentIds } },
        include: [{ model: DocumentVersion, as: 'versions' }],
    });
    const totalSize = docs.reduce((sum, doc) => sum + (doc.fileSize || 0), 0);
    return { documents: docs, totalSize };
}
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Models
    Document,
    DocumentVersion,
    DocumentLink,
    DocumentReview,
    SafetyDataSheet,
    TechnicalDrawing,
    DocumentAccessLog,
    // Document Management Functions
    createDocument,
    updateDocument,
    getDocument,
    getDocumentsByAsset,
    publishDocument,
    archiveDocument,
    deleteDocument,
    // Version Control Functions
    createDocumentVersion,
    getVersionHistory,
    revertToVersion,
    compareVersions,
    // Document Linking Functions
    linkDocuments,
    unlinkDocuments,
    getLinkedDocuments,
    linkDocumentToAsset,
    // Review Workflow Functions
    createDocumentReview,
    startReview,
    approveDocumentReview,
    rejectDocumentReview,
    getPendingReviews,
    // Search Functions
    searchDocuments,
    searchByTags,
    getExpiringDocuments,
    getDocumentsDueForReview,
    // SDS Functions
    createSDS,
    getSDSByChemical,
    getSDSByCAS,
    // Technical Drawing Functions
    createTechnicalDrawing,
    getDrawingByNumber,
    getDrawingRevisions,
    // Access Logging Functions
    logDocumentAccess,
    getDocumentAccessLogs,
    getUserAccessHistory,
    // Bulk Operations
    bulkUpdateStatus,
    bulkAddTags,
    bulkExportDocuments,
};
//# sourceMappingURL=asset-documentation-commands.js.map