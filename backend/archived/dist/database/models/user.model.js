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
exports.User = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const bcrypt = __importStar(require("bcrypt"));
const swagger_1 = require("@nestjs/swagger");
const user_role_enum_1 = require("../types/user-role.enum");
let User = class User extends sequelize_typescript_1.Model {
    email;
    password;
    firstName;
    lastName;
    role;
    isActive;
    lastLogin;
    schoolId;
    districtId;
    phone;
    emailVerified;
    emailVerificationToken;
    emailVerificationExpires;
    passwordResetToken;
    passwordResetExpires;
    passwordChangedAt;
    twoFactorEnabled;
    twoFactorSecret;
    failedLoginAttempts;
    lockoutUntil;
    lastPasswordChange;
    mustChangePassword;
    mfaEnabled;
    mfaSecret;
    mfaBackupCodes;
    mfaEnabledAt;
    oauthProvider;
    oauthProviderId;
    profilePictureUrl;
    isEmailVerified;
    emailVerifiedAt;
    deletedAt;
    static async hashPasswordOnCreate(instance) {
        if (instance.password) {
            const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10);
            if (saltRounds < 10 || saltRounds > 14) {
                throw new Error(`SECURITY WARNING: bcrypt salt rounds must be between 10 and 14. Current: ${saltRounds}`);
            }
            instance.password = await bcrypt.hash(instance.password, saltRounds);
            instance.lastPasswordChange = new Date();
        }
    }
    static async hashPasswordOnUpdate(instance) {
        if (instance.changed('password')) {
            const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10);
            if (saltRounds < 10 || saltRounds > 14) {
                throw new Error(`SECURITY WARNING: bcrypt salt rounds must be between 10 and 14. Current: ${saltRounds}`);
            }
            instance.password = await bcrypt.hash(instance.password, saltRounds);
            instance.passwordChangedAt = new Date();
            instance.lastPasswordChange = new Date();
        }
    }
    static async auditPHIAccess(user) {
        if (user.changed()) {
            const changedFields = user.changed();
            const phiFields = ['email', 'firstName', 'lastName', 'phone'];
            const { logModelPHIFieldChanges } = await Promise.resolve().then(() => __importStar(require('@/database/services/model-audit-helper.service.js')));
            const transaction = user.sequelize?.transaction || undefined;
            await logModelPHIFieldChanges('User', user.id, changedFields, phiFields, transaction);
        }
    }
    async comparePassword(candidatePassword) {
        return bcrypt.compare(candidatePassword, this.password);
    }
    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }
    toSafeObject() {
        const { password, passwordResetToken, passwordResetExpires, emailVerificationToken, emailVerificationExpires, twoFactorSecret, mfaSecret, mfaBackupCodes, ...safeData } = this.get({ plain: true });
        return {
            ...safeData,
            id: this.id,
        };
    }
    isAccountLocked() {
        return this.lockoutUntil ? this.lockoutUntil > new Date() : false;
    }
    passwordChangedAfter(timestamp) {
        if (this.passwordChangedAt) {
            const changedTimestamp = Math.floor(this.passwordChangedAt.getTime() / 1000);
            return changedTimestamp > timestamp;
        }
        return false;
    }
    isPasswordResetTokenValid(token) {
        if (!this.passwordResetToken || !this.passwordResetExpires) {
            return false;
        }
        return (this.passwordResetToken === token &&
            this.passwordResetExpires > new Date());
    }
    isEmailVerificationTokenValid(token) {
        if (!this.emailVerificationToken || !this.emailVerificationExpires) {
            return false;
        }
        return (this.emailVerificationToken === token &&
            this.emailVerificationExpires > new Date());
    }
    async incrementFailedLoginAttempts() {
        this.failedLoginAttempts += 1;
        if (this.failedLoginAttempts >= 5) {
            this.lockoutUntil = new Date(Date.now() + 30 * 60 * 1000);
        }
        await this.save();
    }
    async resetFailedLoginAttempts() {
        this.failedLoginAttempts = 0;
        this.lockoutUntil = undefined;
        this.lastLogin = new Date();
        await this.save();
    }
    requiresPasswordChange() {
        if (this.mustChangePassword) {
            return true;
        }
        if (this.lastPasswordChange) {
            const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
            return this.lastPasswordChange < ninetyDaysAgo;
        }
        return false;
    }
};
exports.User = User;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Unique identifier for the user (UUID)',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User email address (unique, used for login)',
        example: 'nurse.smith@school.edu',
    }),
    (0, sequelize_typescript_1.Index)({ unique: true }),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
        validate: { isEmail: true },
    }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Hashed password (bcrypt) - NEVER expose in API responses',
        example: '$2b$12$...',
    }),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
    }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User first name',
        example: 'Sarah',
    }),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
        field: 'firstName',
    }),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User last name',
        example: 'Smith',
    }),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
        field: 'lastName',
    }),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User role for authorization',
        enum: user_role_enum_1.UserRole,
        example: user_role_enum_1.UserRole.NURSE,
    }),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM(...Object.values(user_role_enum_1.UserRole)),
        allowNull: false,
        defaultValue: user_role_enum_1.UserRole.ADMIN,
    }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether the user account is active',
        example: true,
    }),
    (0, sequelize_typescript_1.Default)(true),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
        field: 'isActive',
    }),
    __metadata("design:type", Boolean)
], User.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Timestamp of last successful login',
        example: '2024-01-15T10:30:00Z',
        required: false,
    }),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        field: 'lastLogin',
    }),
    __metadata("design:type", Date)
], User.prototype, "lastLogin", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID of the school this user is associated with',
        example: '550e8400-e29b-41d4-a716-446655440000',
        required: false,
    }),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: true,
        field: 'schoolId',
    }),
    __metadata("design:type", String)
], User.prototype, "schoolId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID of the district this user is associated with',
        example: '550e8400-e29b-41d4-a716-446655440000',
        required: false,
    }),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: true,
        field: 'districtId',
    }),
    __metadata("design:type", String)
], User.prototype, "districtId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User phone number in E.164 format',
        example: '+12125551234',
        required: false,
    }),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: true,
        validate: {
            is: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
        },
    }),
    __metadata("design:type", String)
], User.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Legacy email verification status (deprecated - use isEmailVerified)',
        example: false,
    }),
    (0, sequelize_typescript_1.Default)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
        field: 'emailVerified',
    }),
    __metadata("design:type", Boolean)
], User.prototype, "emailVerified", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Email verification token - NEVER expose in API responses',
        required: false,
    }),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: true,
        field: 'emailVerificationToken',
    }),
    __metadata("design:type", String)
], User.prototype, "emailVerificationToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Email verification token expiration date',
        required: false,
    }),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
        field: 'emailVerificationExpires',
    }),
    __metadata("design:type", Date)
], User.prototype, "emailVerificationExpires", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Password reset token - NEVER expose in API responses',
        required: false,
    }),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: true,
        field: 'passwordResetToken',
    }),
    __metadata("design:type", String)
], User.prototype, "passwordResetToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Password reset token expiration date',
        required: false,
    }),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
        field: 'passwordResetExpires',
    }),
    __metadata("design:type", Date)
], User.prototype, "passwordResetExpires", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Timestamp when password was last changed (for token invalidation)',
        required: false,
    }),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
        field: 'passwordChangedAt',
    }),
    __metadata("design:type", Date)
], User.prototype, "passwordChangedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Legacy 2FA status (deprecated - use mfaEnabled)',
        example: false,
    }),
    (0, sequelize_typescript_1.Default)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
        field: 'twoFactorEnabled',
    }),
    __metadata("design:type", Boolean)
], User.prototype, "twoFactorEnabled", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Legacy 2FA secret (deprecated - use mfaSecret) - NEVER expose in API responses',
        required: false,
    }),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: true,
        field: 'twoFactorSecret',
    }),
    __metadata("design:type", String)
], User.prototype, "twoFactorSecret", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of consecutive failed login attempts',
        example: 0,
    }),
    (0, sequelize_typescript_1.Default)(0),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        field: 'failedLoginAttempts',
    }),
    __metadata("design:type", Number)
], User.prototype, "failedLoginAttempts", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Account lockout expiration timestamp (set after 5 failed login attempts)',
        required: false,
    }),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
        field: 'lockoutUntil',
    }),
    __metadata("design:type", Date)
], User.prototype, "lockoutUntil", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Timestamp when password was last changed (for password rotation policy)',
        required: false,
    }),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
        field: 'lastPasswordChange',
    }),
    __metadata("design:type", Date)
], User.prototype, "lastPasswordChange", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether user must change password on next login',
        example: false,
    }),
    (0, sequelize_typescript_1.Default)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
        field: 'mustChangePassword',
    }),
    __metadata("design:type", Boolean)
], User.prototype, "mustChangePassword", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether multi-factor authentication is enabled',
        example: false,
    }),
    (0, sequelize_typescript_1.Default)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
        field: 'mfaEnabled',
        comment: 'Whether multi-factor authentication is enabled',
    }),
    __metadata("design:type", Boolean)
], User.prototype, "mfaEnabled", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'TOTP secret for MFA (encrypted) - NEVER expose in API responses',
        required: false,
    }),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: true,
        field: 'mfaSecret',
        comment: 'TOTP secret for MFA (encrypted)',
    }),
    __metadata("design:type", String)
], User.prototype, "mfaSecret", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'JSON array of hashed backup codes for MFA recovery - NEVER expose in API responses',
        required: false,
    }),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: true,
        field: 'mfaBackupCodes',
        comment: 'JSON array of hashed backup codes for MFA recovery',
    }),
    __metadata("design:type", String)
], User.prototype, "mfaBackupCodes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Timestamp when MFA was enabled',
        required: false,
    }),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
        field: 'mfaEnabledAt',
        comment: 'Timestamp when MFA was enabled',
    }),
    __metadata("design:type", Date)
], User.prototype, "mfaEnabledAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'OAuth provider (google, microsoft, etc.)',
        example: 'google',
        required: false,
    }),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: true,
        field: 'oauthProvider',
        comment: 'OAuth provider (google, microsoft, etc.)',
    }),
    __metadata("design:type", String)
], User.prototype, "oauthProvider", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User ID from OAuth provider',
        required: false,
    }),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: true,
        field: 'oauthProviderId',
        comment: 'User ID from OAuth provider',
    }),
    __metadata("design:type", String)
], User.prototype, "oauthProviderId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'URL to user profile picture',
        example: 'https://example.com/profile.jpg',
        required: false,
    }),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: true,
        field: 'profilePictureUrl',
        comment: 'URL to user profile picture',
    }),
    __metadata("design:type", String)
], User.prototype, "profilePictureUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether email address has been verified',
        example: false,
    }),
    (0, sequelize_typescript_1.Default)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
        field: 'isEmailVerified',
        comment: 'Whether email address has been verified',
    }),
    __metadata("design:type", Boolean)
], User.prototype, "isEmailVerified", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Timestamp when email was verified',
        required: false,
    }),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
        field: 'emailVerifiedAt',
        comment: 'Timestamp when email was verified',
    }),
    __metadata("design:type", Date)
], User.prototype, "emailVerifiedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Soft delete timestamp for paranoid mode',
        required: false,
    }),
    sequelize_typescript_1.DeletedAt,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
        field: 'deletedAt',
        comment: 'Soft delete timestamp for paranoid mode',
    }),
    __metadata("design:type", Date)
], User.prototype, "deletedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Timestamp when the user was created',
        example: '2024-01-15T10:30:00Z',
    }),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        field: 'createdAt',
    }),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Timestamp when the user was last updated',
        example: '2024-01-15T10:30:00Z',
    }),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        field: 'updatedAt',
    }),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User]),
    __metadata("design:returntype", Promise)
], User, "hashPasswordOnCreate", null);
__decorate([
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User]),
    __metadata("design:returntype", Promise)
], User, "hashPasswordOnUpdate", null);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User]),
    __metadata("design:returntype", Promise)
], User, "auditPHIAccess", null);
exports.User = User = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'users',
        timestamps: true,
        paranoid: true,
        indexes: [
            { fields: ['email'], unique: true },
            { fields: ['schoolId'] },
            { fields: ['districtId'] },
            { fields: ['role'] },
            { fields: ['isActive'] },
            { fields: ['emailVerificationToken'] },
            { fields: ['passwordResetToken'] },
            { fields: ['lockoutUntil'] },
            { fields: ['createdAt'], name: 'idx_users_created_at' },
            { fields: ['updatedAt'], name: 'idx_users_updated_at' },
        ],
    })
], User);
//# sourceMappingURL=user.model.js.map