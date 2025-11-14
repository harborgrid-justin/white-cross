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
exports.DocumentSignature = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
let DocumentSignature = class DocumentSignature extends sequelize_typescript_1.Model {
    documentId;
    signedBy;
    signedByRole;
    signatureData;
    ipAddress;
    signedAt;
    document;
};
exports.DocumentSignature = DocumentSignature;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], DocumentSignature.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => 'Document'),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
        comment: 'Document being signed',
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", String)
], DocumentSignature.prototype, "documentId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
        allowNull: false,
        comment: 'User ID of the signer',
        validate: {
            notEmpty: { msg: 'Signer ID is required' },
        },
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", String)
], DocumentSignature.prototype, "signedBy", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(100),
        allowNull: false,
        comment: 'Role of the signer (e.g., Nurse, Parent, Administrator)',
        validate: {
            notEmpty: { msg: 'Signer role is required' },
            len: {
                args: [2, 100],
                msg: 'Signer role must be between 2 and 100 characters',
            },
        },
    }),
    __metadata("design:type", String)
], DocumentSignature.prototype, "signedByRole", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: true,
        comment: 'Optional signature data (image, encrypted signature, etc.)',
    }),
    __metadata("design:type", String)
], DocumentSignature.prototype, "signatureData", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(45),
        allowNull: true,
        comment: 'IP address of signer for audit trail',
        validate: {
            isIP: {
                msg: 'Invalid IP address format',
            },
        },
    }),
    __metadata("design:type", String)
], DocumentSignature.prototype, "ipAddress", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        field: 'signed_at',
        comment: 'Timestamp when signature was applied (immutable)',
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", Date)
], DocumentSignature.prototype, "signedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => 'Document'),
    __metadata("design:type", Function)
], DocumentSignature.prototype, "document", void 0);
exports.DocumentSignature = DocumentSignature = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'document_signatures',
        timestamps: true,
        updatedAt: false,
        indexes: [
            { fields: ['documentId'] },
            { fields: ['signedBy'] },
            { fields: ['signedAt'] },
            { fields: ['documentId', 'signedBy'] },
        ],
    })
], DocumentSignature);
//# sourceMappingURL=document-signature.model.js.map