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
exports.DocumentAuditTrail = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const document_enums_1 = require("../../document/enums/document.enums");
let DocumentAuditTrail = class DocumentAuditTrail extends sequelize_typescript_1.Model {
    documentId;
    action;
    performedBy;
    changes;
    ipAddress;
    document;
};
exports.DocumentAuditTrail = DocumentAuditTrail;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], DocumentAuditTrail.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => 'Document'),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
        comment: 'Document being audited',
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", String)
], DocumentAuditTrail.prototype, "documentId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        allowNull: false,
        comment: 'Action performed on the document',
        validate: {
            isIn: {
                args: [Object.values(document_enums_1.DocumentAction)],
                msg: 'Invalid document action',
            },
        },
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", String)
], DocumentAuditTrail.prototype, "action", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
        allowNull: false,
        comment: 'User ID who performed the action',
        validate: {
            notEmpty: { msg: 'Performer ID is required' },
        },
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", String)
], DocumentAuditTrail.prototype, "performedBy", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSONB,
        allowNull: true,
        comment: 'Detailed changes or action metadata',
    }),
    __metadata("design:type", Object)
], DocumentAuditTrail.prototype, "changes", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(45),
        allowNull: true,
        comment: 'IP address where action was performed',
        validate: {
            isIP: {
                msg: 'Invalid IP address format',
            },
        },
    }),
    __metadata("design:type", String)
], DocumentAuditTrail.prototype, "ipAddress", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        comment: 'Timestamp when action was performed (immutable)',
    }),
    sequelize_typescript_1.Index,
    __metadata("design:type", Date)
], DocumentAuditTrail.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => 'Document'),
    __metadata("design:type", Function)
], DocumentAuditTrail.prototype, "document", void 0);
exports.DocumentAuditTrail = DocumentAuditTrail = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'document_audit_trails',
        timestamps: true,
        updatedAt: false,
        indexes: [
            { fields: ['documentId', 'createdAt'] },
            { fields: ['performedBy'] },
            { fields: ['action'] },
            { fields: ['createdAt'] },
            { fields: ['documentId', 'action'] },
        ],
    })
], DocumentAuditTrail);
//# sourceMappingURL=document-audit-trail.model.js.map