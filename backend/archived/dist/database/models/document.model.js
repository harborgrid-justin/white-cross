"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Document = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const document_enums_1 = require("../../document/enums/document.enums");
let Document = class Document extends sequelize_typescript_1.Model {
    title;
    description;
    category;
    fileType;
    fileName;
    fileSize;
    fileUrl;
    uploadedBy;
    studentId;
    tags;
    isTemplate;
    templateData;
    status;
    accessLevel;
    parentId;
    retentionDate;
    containsPHI;
    requiresSignature;
    lastAccessedAt;
    accessCount;
    isActive;
    deletedBy;
    parent;
    versions;
    signatures;
    auditTrail;
    static autoSetComplianceFlags(instance) {
        const phiCategories = [
            document_enums_1.DocumentCategory.MEDICAL_RECORD,
            document_enums_1.DocumentCategory.INCIDENT_REPORT,
            document_enums_1.DocumentCategory.CONSENT_FORM,
            document_enums_1.DocumentCategory.INSURANCE,
        ];
        if (phiCategories.includes(instance.category)) {
            instance.containsPHI = true;
        }
        const signatureCategories = [
            document_enums_1.DocumentCategory.MEDICAL_RECORD,
            document_enums_1.DocumentCategory.CONSENT_FORM,
            document_enums_1.DocumentCategory.INCIDENT_REPORT,
        ];
        if (signatureCategories.includes(instance.category)) {
            instance.requiresSignature = true;
        }
        if (instance.containsPHI && instance.accessLevel === document_enums_1.DocumentAccessLevel.PUBLIC) {
            instance.accessLevel = document_enums_1.DocumentAccessLevel.STAFF_ONLY;
        }
        if (instance.containsPHI && instance.fileUrl && !instance.fileUrl.startsWith('https://')) {
            throw new Error('PHI documents must use HTTPS protocol for secure transmission (HIPAA requirement)');
        }
    }
    static preventPHIDowngrade(instance) {
        if (instance.containsPHI && instance.changed('accessLevel')) {
            const newAccessLevel = instance.getDataValue('accessLevel');
            if (newAccessLevel === document_enums_1.DocumentAccessLevel.PUBLIC) {
                throw new Error('Cannot change access level to PUBLIC for documents containing PHI');
            }
        }
        if (instance.containsPHI && instance.changed('fileUrl')) {
            const newFileUrl = instance.getDataValue('fileUrl');
            if (newFileUrl && !newFileUrl.startsWith('https://')) {
                throw new Error('PHI documents must use HTTPS protocol for secure transmission (HIPAA requirement)');
            }
        }
    }
};
exports.Document = Document;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], Document.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Document title cannot be empty' },
            len: {
                args: [3, 255],
                msg: 'Document title must be between 3 and 255 characters',
            },
        },
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", String)
], Document.prototype, "title", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: true,
        validate: {
            len: {
                args: [0, 5000],
                msg: 'Document description must not exceed 5000 characters',
            },
        },
    }),
    __metadata("design:type", String)
], Document.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        allowNull: false,
        validate: {
            isIn: {
                args: [Object.values(document_enums_1.DocumentCategory)],
                msg: 'Invalid document category',
            },
        },
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", String)
], Document.prototype, "category", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: { msg: 'File type is required' },
        },
    }),
    __metadata("design:type", String)
], Document.prototype, "fileType", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: { msg: 'File name is required' },
            len: {
                args: [1, 255],
                msg: 'File name must not exceed 255 characters',
            },
        },
    }),
    __metadata("design:type", String)
], Document.prototype, "fileName", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BIGINT,
        allowNull: false,
        validate: {
            min: {
                args: [1024],
                msg: 'File size must be at least 1KB',
            },
            max: {
                args: [52428800],
                msg: 'File size must not exceed 50MB',
            },
        },
    }),
    __metadata("design:type", Number)
], Document.prototype, "fileSize", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'File URL is required' },
            isUrl: { msg: 'File URL must be a valid URL' },
        },
    }),
    __metadata("design:type", String)
], Document.prototype, "fileUrl", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
        allowNull: false,
        comment: 'User ID who uploaded the document',
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", String)
], Document.prototype, "uploadedBy", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: true,
        comment: 'Student ID if document is student-specific',
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", String)
], Document.prototype, "studentId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING),
        allowNull: true,
        defaultValue: [],
        validate: {
            isValidTagArray(value) {
                if (value && !Array.isArray(value)) {
                    throw new Error('Tags must be an array');
                }
                if (value && value.length > 10) {
                    throw new Error('Maximum of 10 tags allowed');
                }
            },
        },
    }),
    __metadata("design:type", Array)
], Document.prototype, "tags", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Whether this document is a template for creating others',
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", Boolean)
], Document.prototype, "isTemplate", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSONB,
        allowNull: true,
        comment: 'Template metadata and field definitions',
    }),
    __metadata("design:type", Object)
], Document.prototype, "templateData", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        allowNull: false,
        defaultValue: document_enums_1.DocumentStatus.DRAFT,
        validate: {
            isIn: {
                args: [Object.values(document_enums_1.DocumentStatus)],
                msg: 'Invalid document status',
            },
        },
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", String)
], Document.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: {
            min: {
                args: [1],
                msg: 'Version must be at least 1',
            },
            max: {
                args: [100],
                msg: 'Version cannot exceed 100',
            },
        },
    }),
    __metadata("design:type", Number)
], Document.prototype, "version", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        allowNull: false,
        defaultValue: document_enums_1.DocumentAccessLevel.STAFF_ONLY,
        validate: {
            isIn: {
                args: [Object.values(document_enums_1.DocumentAccessLevel)],
                msg: 'Invalid access level',
            },
        },
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", String)
], Document.prototype, "accessLevel", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Document),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: true,
        comment: 'Parent document ID for versioning',
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", String)
], Document.prototype, "parentId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
        comment: 'Date when document retention period ends',
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", Date)
], Document.prototype, "retentionDate", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Indicates if document contains Protected Health Information (HIPAA)',
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", Boolean)
], Document.prototype, "containsPHI", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Indicates if document requires electronic signature',
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", Boolean)
], Document.prototype, "requiresSignature", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
        comment: 'Last time document was viewed or downloaded (for audit)',
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", Date)
], Document.prototype, "lastAccessedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Number of times document has been accessed (for compliance)',
        validate: {
            min: {
                args: [0],
                msg: 'Access count cannot be negative',
            },
        },
    }),
    __metadata("design:type", Number)
], Document.prototype, "accessCount", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Soft delete flag - whether document is currently active',
    }),
    __metadata("design:type", Boolean)
], Document.prototype, "isActive", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    __metadata("design:type", Date)
], Document.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    __metadata("design:type", Date)
], Document.prototype, "updatedAt", void 0);
__decorate([
    sequelize_typescript_1.DeletedAt,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
        comment: 'Soft delete timestamp',
    }),
    __metadata("design:type", Date)
], Document.prototype, "deletedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
        allowNull: true,
        comment: 'User who deleted this document (for audit trail)',
    }),
    __metadata("design:type", String)
], Document.prototype, "deletedBy", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Document, 'parentId'),
    __metadata("design:type", Document)
], Document.prototype, "parent", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Document, 'parentId'),
    __metadata("design:type", Array)
], Document.prototype, "versions", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => 'DocumentSignature', 'documentId'),
    __metadata("design:type", Array)
], Document.prototype, "signatures", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => 'DocumentAuditTrail', 'documentId'),
    __metadata("design:type", Array)
], Document.prototype, "auditTrail", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Document]),
    __metadata("design:returntype", void 0)
], Document, "autoSetComplianceFlags", null);
__decorate([
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Document]),
    __metadata("design:returntype", void 0)
], Document, "preventPHIDowngrade", null);
exports.Document = Document = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'documents',
        timestamps: true,
        paranoid: true,
        indexes: [
            { fields: ['category', 'status'] },
            { fields: ['studentId'] },
            { fields: ['createdAt'] },
            { fields: ['uploadedBy'] },
            { fields: ['parentId'] },
            { fields: ['retentionDate'] },
            { fields: ['isTemplate'] },
            { fields: ['containsPHI'] },
            { fields: ['requiresSignature'] },
            { fields: ['lastAccessedAt'] },
            { fields: ['accessLevel'] },
            { fields: ['deletedAt'] },
        ],
    })
], Document);
//# sourceMappingURL=document.model.js.map