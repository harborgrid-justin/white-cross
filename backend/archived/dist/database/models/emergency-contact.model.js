"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmergencyContact = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_1 = require("sequelize");
const contact_priority_enum_1 = require("../../services/communication/contact/enums/contact-priority.enum");
const verification_status_enum_1 = require("../../services/communication/contact/enums/verification-status.enum");
const preferred_contact_method_enum_1 = require("../../services/communication/contact/enums/preferred-contact-method.enum");
let EmergencyContact = class EmergencyContact extends sequelize_typescript_1.Model {
    studentId;
    firstName;
    lastName;
    relationship;
    phoneNumber;
    email;
    address;
    priority;
    isActive;
    preferredContactMethod;
    verificationStatus;
    lastVerifiedAt;
    notificationChannels;
    canPickupStudent;
    notes;
    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }
    get isPrimary() {
        return this.priority === contact_priority_enum_1.ContactPriority.PRIMARY;
    }
    get isVerified() {
        return this.verificationStatus === verification_status_enum_1.VerificationStatus.VERIFIED;
    }
    get parsedNotificationChannels() {
        if (!this.notificationChannels)
            return [];
        try {
            return JSON.parse(this.notificationChannels);
        }
        catch {
            return [];
        }
    }
    static async auditPHIAccess(instance) {
        if (instance.changed()) {
            const changedFields = instance.changed();
            const phiFields = [
                'firstName',
                'lastName',
                'phoneNumber',
                'email',
                'address',
            ];
            const { logModelPHIFieldChanges } = await Promise.resolve().then(() => __importStar(require('@/database/services/model-audit-helper.service.js')));
            const transaction = instance.sequelize?.transaction || undefined;
            await logModelPHIFieldChanges('EmergencyContact', instance.id, changedFields, phiFields, transaction);
        }
    }
};
exports.EmergencyContact = EmergencyContact;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], EmergencyContact.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => require('./student.model').Student),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
        comment: 'Foreign key to students table - emergency contact owner',
    }),
    __metadata("design:type", String)
], EmergencyContact.prototype, "studentId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(100),
        allowNull: false,
    }),
    __metadata("design:type", String)
], EmergencyContact.prototype, "firstName", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(100),
        allowNull: false,
    }),
    __metadata("design:type", String)
], EmergencyContact.prototype, "lastName", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        allowNull: false,
    }),
    __metadata("design:type", String)
], EmergencyContact.prototype, "relationship", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(20),
        allowNull: false,
        validate: {
            is: {
                args: /^\+?[1-9]\d{1,14}$/,
                msg: 'Phone number must be in E.164 format or standard US format',
            },
        },
    }),
    __metadata("design:type", String)
], EmergencyContact.prototype, "phoneNumber", void 0);
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
], EmergencyContact.prototype, "email", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: true,
    }),
    __metadata("design:type", String)
], EmergencyContact.prototype, "address", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(contact_priority_enum_1.ContactPriority)],
        },
        allowNull: false,
        defaultValue: contact_priority_enum_1.ContactPriority.PRIMARY,
    }),
    __metadata("design:type", String)
], EmergencyContact.prototype, "priority", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    }),
    __metadata("design:type", Boolean)
], EmergencyContact.prototype, "isActive", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(preferred_contact_method_enum_1.PreferredContactMethod)],
        },
        allowNull: true,
        defaultValue: preferred_contact_method_enum_1.PreferredContactMethod.ANY,
    }),
    __metadata("design:type", String)
], EmergencyContact.prototype, "preferredContactMethod", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(verification_status_enum_1.VerificationStatus)],
        },
        allowNull: true,
        defaultValue: verification_status_enum_1.VerificationStatus.UNVERIFIED,
    }),
    __metadata("design:type", String)
], EmergencyContact.prototype, "verificationStatus", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
    }),
    __metadata("design:type", Date)
], EmergencyContact.prototype, "lastVerifiedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: true,
        comment: 'JSON array of notification channels (sms, email, voice)',
    }),
    __metadata("design:type", String)
], EmergencyContact.prototype, "notificationChannels", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: true,
        defaultValue: false,
    }),
    __metadata("design:type", Boolean)
], EmergencyContact.prototype, "canPickupStudent", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: true,
    }),
    __metadata("design:type", String)
], EmergencyContact.prototype, "notes", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
    }),
    __metadata("design:type", Date)
], EmergencyContact.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
    }),
    __metadata("design:type", Date)
], EmergencyContact.prototype, "updatedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => require('./student.model').Student, {
        foreignKey: 'studentId',
        as: 'student',
    }),
    __metadata("design:type", Function)
], EmergencyContact.prototype, "student", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EmergencyContact]),
    __metadata("design:returntype", Promise)
], EmergencyContact, "auditPHIAccess", null);
exports.EmergencyContact = EmergencyContact = __decorate([
    (0, sequelize_typescript_1.Scopes)(() => ({
        active: {
            where: {
                isActive: true,
            },
        },
        byStudent: (studentId) => ({
            where: { studentId },
        }),
        primary: {
            where: {
                priority: contact_priority_enum_1.ContactPriority.PRIMARY,
                isActive: true,
            },
        },
        verified: {
            where: {
                verificationStatus: verification_status_enum_1.VerificationStatus.VERIFIED,
                isActive: true,
            },
        },
        canPickup: {
            where: {
                canPickupStudent: true,
                isActive: true,
                verificationStatus: verification_status_enum_1.VerificationStatus.VERIFIED,
            },
        },
        unverified: {
            where: {
                verificationStatus: {
                    [sequelize_1.Op.in]: [verification_status_enum_1.VerificationStatus.UNVERIFIED, verification_status_enum_1.VerificationStatus.PENDING],
                },
                isActive: true,
            },
        },
    })),
    (0, sequelize_typescript_1.Table)({
        tableName: 'emergency_contacts',
        timestamps: true,
        underscored: false,
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
        indexes: [
            { name: 'idx_emergency_contacts_student_id', fields: ['studentId'] },
            { name: 'idx_emergency_contacts_is_active', fields: ['isActive'] },
            { name: 'idx_emergency_contacts_priority', fields: ['priority'] },
            {
                name: 'idx_emergency_contacts_verification_status',
                fields: ['verificationStatus'],
            },
            {
                name: 'idx_emergency_contacts_student_priority',
                fields: ['studentId', 'priority', 'isActive'],
            },
            {
                fields: ['createdAt'],
                name: 'idx_emergency_contact_created_at',
            },
            {
                fields: ['updatedAt'],
                name: 'idx_emergency_contact_updated_at',
            },
        ],
    })
], EmergencyContact);
//# sourceMappingURL=emergency-contact.model.js.map