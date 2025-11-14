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
exports.Contact = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_1 = require("sequelize");
const contact_type_enum_1 = require("../../services/communication/contact/enums/contact-type.enum");
const model_audit_hooks_service_1 = require("../services/model-audit-hooks.service");
let Contact = class Contact extends sequelize_typescript_1.Model {
    firstName;
    lastName;
    email;
    phone;
    type;
    organization;
    title;
    address;
    city;
    state;
    zip;
    relationTo;
    relationshipType;
    customFields;
    isActive;
    notes;
    createdBy;
    updatedBy;
    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }
    get displayName() {
        if (this.organization) {
            return `${this.fullName} (${this.organization})`;
        }
        return this.fullName;
    }
    static async auditPHIAccess(instance) {
        await (0, model_audit_hooks_service_1.createModelAuditHook)('Contact', instance);
    }
};
exports.Contact = Contact;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], Contact.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(100),
        allowNull: false,
    }),
    __metadata("design:type", String)
], Contact.prototype, "firstName", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(100),
        allowNull: false,
    }),
    __metadata("design:type", String)
], Contact.prototype, "lastName", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
        allowNull: true,
        validate: {
            isEmail: {
                msg: 'Must be a valid email address',
            },
        },
    }),
    __metadata("design:type", String)
], Contact.prototype, "email", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(20),
        allowNull: true,
        validate: {
            is: {
                args: /^\+?[1-9]\d{1,14}$/,
                msg: 'Phone number must be in E.164 format or standard US format',
            },
        },
    }),
    __metadata("design:type", String)
], Contact.prototype, "phone", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(contact_type_enum_1.ContactType)],
        },
        allowNull: false,
    }),
    __metadata("design:type", String)
], Contact.prototype, "type", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(200),
        allowNull: true,
    }),
    __metadata("design:type", String)
], Contact.prototype, "organization", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(100),
        allowNull: true,
    }),
    __metadata("design:type", String)
], Contact.prototype, "title", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
        allowNull: true,
    }),
    __metadata("design:type", String)
], Contact.prototype, "address", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(100),
        allowNull: true,
    }),
    __metadata("design:type", String)
], Contact.prototype, "city", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        allowNull: true,
    }),
    __metadata("design:type", String)
], Contact.prototype, "state", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(20),
        allowNull: true,
        validate: {
            is: {
                args: /^\d{5}(-\d{4})?$/,
                msg: 'ZIP code must be in format 12345 or 12345-6789',
            },
        },
    }),
    __metadata("design:type", String)
], Contact.prototype, "zip", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: true,
        comment: 'UUID of related student or user',
    }),
    __metadata("design:type", String)
], Contact.prototype, "relationTo", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        allowNull: true,
        comment: 'Type of relationship (parent, emergency, etc.)',
    }),
    __metadata("design:type", String)
], Contact.prototype, "relationshipType", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSONB,
        allowNull: true,
        defaultValue: {},
        comment: 'Custom healthcare-specific fields',
    }),
    __metadata("design:type", Object)
], Contact.prototype, "customFields", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    }),
    __metadata("design:type", Boolean)
], Contact.prototype, "isActive", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: true,
    }),
    __metadata("design:type", String)
], Contact.prototype, "notes", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: true,
        comment: 'User who created this contact',
    }),
    __metadata("design:type", String)
], Contact.prototype, "createdBy", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: true,
        comment: 'User who last updated this contact',
    }),
    __metadata("design:type", String)
], Contact.prototype, "updatedBy", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
    }),
    __metadata("design:type", Date)
], Contact.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
    }),
    __metadata("design:type", Date)
], Contact.prototype, "updatedAt", void 0);
__decorate([
    sequelize_typescript_1.DeletedAt,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        comment: 'Soft delete timestamp',
    }),
    __metadata("design:type", Date)
], Contact.prototype, "deletedAt", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Contact]),
    __metadata("design:returntype", Promise)
], Contact, "auditPHIAccess", null);
exports.Contact = Contact = __decorate([
    (0, sequelize_typescript_1.Scopes)(() => ({
        active: {
            where: {
                isActive: true,
                deletedAt: null,
            },
        },
        byType: (type) => ({
            where: { type },
        }),
        byRelation: (relationTo) => ({
            where: { relationTo },
        }),
        guardians: {
            where: {
                type: contact_type_enum_1.ContactType.Guardian,
                isActive: true,
            },
        },
        providers: {
            where: {
                type: contact_type_enum_1.ContactType.Provider,
                isActive: true,
            },
        },
        withEmail: {
            where: {
                email: {
                    [sequelize_1.Op.ne]: null,
                },
            },
        },
        withPhone: {
            where: {
                phone: {
                    [sequelize_1.Op.ne]: null,
                },
            },
        },
    })),
    (0, sequelize_typescript_1.Table)({
        tableName: 'contacts',
        timestamps: true,
        underscored: false,
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
        deletedAt: 'deletedAt',
        paranoid: true,
        indexes: [
            {
                fields: ['createdAt'],
                name: 'idx_contact_created_at',
            },
            {
                fields: ['updatedAt'],
                name: 'idx_contact_updated_at',
            },
        ],
    }),
    (0, sequelize_typescript_1.Index)(['email']),
    (0, sequelize_typescript_1.Index)(['type']),
    (0, sequelize_typescript_1.Index)(['relationTo']),
    (0, sequelize_typescript_1.Index)(['isActive']),
    (0, sequelize_typescript_1.Index)(['createdAt']),
    (0, sequelize_typescript_1.Index)(['firstName', 'lastName']),
    (0, sequelize_typescript_1.Index)(['relationTo', 'type', 'isActive'])
], Contact);
//# sourceMappingURL=contact.model.js.map