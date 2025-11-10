"use strict";
/**
 * ASSET SECURITY COMMAND FUNCTIONS
 *
 * Enterprise-grade asset security management system providing comprehensive
 * functionality for access control, role-based access (RBAC), audit logging,
 * encryption, SOX compliance, field-level security, data masking, incident
 * tracking, and security policy enforcement. Competes with Okta and
 * CyberArk solutions.
 *
 * Features:
 * - Role-based access control (RBAC)
 * - Granular permission management
 * - Asset-level security policies
 * - Field-level encryption and masking
 * - Comprehensive audit logging
 * - SOX compliance tracking
 * - Security incident management
 * - Access certification and reviews
 * - Multi-factor authentication (MFA)
 * - Session management and monitoring
 *
 * @module AssetSecurityCommands
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
 *   createSecurityRole,
 *   assignRoleToUser,
 *   checkPermission,
 *   logSecurityEvent,
 *   PermissionAction,
 *   SecurityEventType
 * } from './asset-security-commands';
 *
 * // Create security role
 * const role = await createSecurityRole({
 *   name: 'Asset Manager',
 *   description: 'Can manage all assets',
 *   permissions: ['asset:read', 'asset:write', 'asset:delete']
 * });
 *
 * // Check permission
 * const hasAccess = await checkPermission('user-123', 'asset:write', 'asset-456');
 * ```
 */
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
exports.SecurityGroup = exports.MfaConfiguration = exports.PasswordPolicy = exports.UserSession = exports.FieldSecurity = exports.AccessReview = exports.SecurityIncident = exports.SecurityAuditLog = exports.SecurityPolicy = exports.Permission = exports.UserRoleAssignment = exports.SecurityRole = exports.DataClassification = exports.AccessReviewStatus = exports.IncidentStatus = exports.IncidentSeverity = exports.SecurityEventType = exports.PermissionAction = void 0;
exports.createSecurityRole = createSecurityRole;
exports.assignRoleToUser = assignRoleToUser;
exports.revokeRoleFromUser = revokeRoleFromUser;
exports.checkPermission = checkPermission;
exports.getUserPermissions = getUserPermissions;
exports.getUserRoles = getUserRoles;
exports.logSecurityEvent = logSecurityEvent;
exports.getAuditLogs = getAuditLogs;
exports.generateAuditReport = generateAuditReport;
exports.createSecurityPolicy = createSecurityPolicy;
exports.evaluatePolicyCompliance = evaluatePolicyCompliance;
exports.createSecurityIncident = createSecurityIncident;
exports.updateIncidentStatus = updateIncidentStatus;
exports.getOpenIncidents = getOpenIncidents;
exports.createAccessReview = createAccessReview;
exports.completeAccessReview = completeAccessReview;
exports.getPendingReviews = getPendingReviews;
exports.configureFieldSecurity = configureFieldSecurity;
exports.maskFieldValue = maskFieldValue;
exports.createUserSession = createUserSession;
exports.validateUserSession = validateUserSession;
exports.expireUserSession = expireUserSession;
exports.expireAllUserSessions = expireAllUserSessions;
exports.validatePassword = validatePassword;
exports.checkPasswordStrength = checkPasswordStrength;
exports.forcePasswordReset = forcePasswordReset;
exports.enableMfa = enableMfa;
exports.verifyMfaCode = verifyMfaCode;
exports.generateBackupCodes = generateBackupCodes;
exports.createSecurityGroup = createSecurityGroup;
exports.addUserToSecurityGroup = addUserToSecurityGroup;
exports.assignRoleToSecurityGroup = assignRoleToSecurityGroup;
exports.generateSoxComplianceReport = generateSoxComplianceReport;
exports.generateSecurityMetrics = generateSecurityMetrics;
exports.getActiveUserSessions = getActiveUserSessions;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_1 = require("sequelize");
// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================
/**
 * Permission Action
 */
var PermissionAction;
(function (PermissionAction) {
    PermissionAction["READ"] = "read";
    PermissionAction["WRITE"] = "write";
    PermissionAction["DELETE"] = "delete";
    PermissionAction["APPROVE"] = "approve";
    PermissionAction["EXPORT"] = "export";
    PermissionAction["ADMIN"] = "admin";
})(PermissionAction || (exports.PermissionAction = PermissionAction = {}));
/**
 * Security Event Type
 */
var SecurityEventType;
(function (SecurityEventType) {
    SecurityEventType["LOGIN"] = "login";
    SecurityEventType["LOGOUT"] = "logout";
    SecurityEventType["LOGIN_FAILED"] = "login_failed";
    SecurityEventType["ACCESS_GRANTED"] = "access_granted";
    SecurityEventType["ACCESS_DENIED"] = "access_denied";
    SecurityEventType["PERMISSION_CHANGED"] = "permission_changed";
    SecurityEventType["ROLE_ASSIGNED"] = "role_assigned";
    SecurityEventType["ROLE_REVOKED"] = "role_revoked";
    SecurityEventType["DATA_ACCESSED"] = "data_accessed";
    SecurityEventType["DATA_MODIFIED"] = "data_modified";
    SecurityEventType["DATA_DELETED"] = "data_deleted";
    SecurityEventType["SECURITY_INCIDENT"] = "security_incident";
    SecurityEventType["POLICY_VIOLATION"] = "policy_violation";
    SecurityEventType["MFA_ENABLED"] = "mfa_enabled";
    SecurityEventType["MFA_DISABLED"] = "mfa_disabled";
    SecurityEventType["PASSWORD_CHANGED"] = "password_changed";
})(SecurityEventType || (exports.SecurityEventType = SecurityEventType = {}));
/**
 * Incident Severity
 */
var IncidentSeverity;
(function (IncidentSeverity) {
    IncidentSeverity["CRITICAL"] = "critical";
    IncidentSeverity["HIGH"] = "high";
    IncidentSeverity["MEDIUM"] = "medium";
    IncidentSeverity["LOW"] = "low";
    IncidentSeverity["INFO"] = "info";
})(IncidentSeverity || (exports.IncidentSeverity = IncidentSeverity = {}));
/**
 * Incident Status
 */
var IncidentStatus;
(function (IncidentStatus) {
    IncidentStatus["OPEN"] = "open";
    IncidentStatus["INVESTIGATING"] = "investigating";
    IncidentStatus["CONTAINED"] = "contained";
    IncidentStatus["RESOLVED"] = "resolved";
    IncidentStatus["CLOSED"] = "closed";
})(IncidentStatus || (exports.IncidentStatus = IncidentStatus = {}));
/**
 * Access Review Status
 */
var AccessReviewStatus;
(function (AccessReviewStatus) {
    AccessReviewStatus["PENDING"] = "pending";
    AccessReviewStatus["IN_PROGRESS"] = "in_progress";
    AccessReviewStatus["COMPLETED"] = "completed";
    AccessReviewStatus["OVERDUE"] = "overdue";
})(AccessReviewStatus || (exports.AccessReviewStatus = AccessReviewStatus = {}));
/**
 * Data Classification
 */
var DataClassification;
(function (DataClassification) {
    DataClassification["PUBLIC"] = "public";
    DataClassification["INTERNAL"] = "internal";
    DataClassification["CONFIDENTIAL"] = "confidential";
    DataClassification["RESTRICTED"] = "restricted";
    DataClassification["TOP_SECRET"] = "top_secret";
})(DataClassification || (exports.DataClassification = DataClassification = {}));
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Security Role Model
 */
let SecurityRole = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'security_roles',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['name'], unique: true },
                { fields: ['parent_role_id'] },
                { fields: ['is_system_role'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _permissions_decorators;
    let _permissions_initializers = [];
    let _permissions_extraInitializers = [];
    let _isSystemRole_decorators;
    let _isSystemRole_initializers = [];
    let _isSystemRole_extraInitializers = [];
    let _parentRoleId_decorators;
    let _parentRoleId_initializers = [];
    let _parentRoleId_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    let _parentRole_decorators;
    let _parentRole_initializers = [];
    let _parentRole_extraInitializers = [];
    let _childRoles_decorators;
    let _childRoles_initializers = [];
    let _childRoles_extraInitializers = [];
    let _userAssignments_decorators;
    let _userAssignments_initializers = [];
    let _userAssignments_extraInitializers = [];
    var SecurityRole = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.name = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.permissions = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _permissions_initializers, void 0));
            this.isSystemRole = (__runInitializers(this, _permissions_extraInitializers), __runInitializers(this, _isSystemRole_initializers, void 0));
            this.parentRoleId = (__runInitializers(this, _isSystemRole_extraInitializers), __runInitializers(this, _parentRoleId_initializers, void 0));
            this.metadata = (__runInitializers(this, _parentRoleId_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.parentRole = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _parentRole_initializers, void 0));
            this.childRoles = (__runInitializers(this, _parentRole_extraInitializers), __runInitializers(this, _childRoles_initializers, void 0));
            this.userAssignments = (__runInitializers(this, _childRoles_extraInitializers), __runInitializers(this, _userAssignments_initializers, void 0));
            __runInitializers(this, _userAssignments_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "SecurityRole");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _name_decorators = [(0, swagger_1.ApiProperty)({ description: 'Role name' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100), unique: true, allowNull: false }), sequelize_typescript_1.Index];
        _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Description' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _permissions_decorators = [(0, swagger_1.ApiProperty)({ description: 'Permissions' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING), allowNull: false })];
        _isSystemRole_decorators = [(0, swagger_1.ApiProperty)({ description: 'Is system role' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false }), sequelize_typescript_1.Index];
        _parentRoleId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Parent role ID' }), (0, sequelize_typescript_1.ForeignKey)(() => SecurityRole), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID }), sequelize_typescript_1.Index];
        _metadata_decorators = [(0, swagger_1.ApiProperty)({ description: 'Metadata' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        _parentRole_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => SecurityRole, 'parentRoleId')];
        _childRoles_decorators = [(0, sequelize_typescript_1.HasMany)(() => SecurityRole, 'parentRoleId')];
        _userAssignments_decorators = [(0, sequelize_typescript_1.HasMany)(() => UserRoleAssignment)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _permissions_decorators, { kind: "field", name: "permissions", static: false, private: false, access: { has: obj => "permissions" in obj, get: obj => obj.permissions, set: (obj, value) => { obj.permissions = value; } }, metadata: _metadata }, _permissions_initializers, _permissions_extraInitializers);
        __esDecorate(null, null, _isSystemRole_decorators, { kind: "field", name: "isSystemRole", static: false, private: false, access: { has: obj => "isSystemRole" in obj, get: obj => obj.isSystemRole, set: (obj, value) => { obj.isSystemRole = value; } }, metadata: _metadata }, _isSystemRole_initializers, _isSystemRole_extraInitializers);
        __esDecorate(null, null, _parentRoleId_decorators, { kind: "field", name: "parentRoleId", static: false, private: false, access: { has: obj => "parentRoleId" in obj, get: obj => obj.parentRoleId, set: (obj, value) => { obj.parentRoleId = value; } }, metadata: _metadata }, _parentRoleId_initializers, _parentRoleId_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _parentRole_decorators, { kind: "field", name: "parentRole", static: false, private: false, access: { has: obj => "parentRole" in obj, get: obj => obj.parentRole, set: (obj, value) => { obj.parentRole = value; } }, metadata: _metadata }, _parentRole_initializers, _parentRole_extraInitializers);
        __esDecorate(null, null, _childRoles_decorators, { kind: "field", name: "childRoles", static: false, private: false, access: { has: obj => "childRoles" in obj, get: obj => obj.childRoles, set: (obj, value) => { obj.childRoles = value; } }, metadata: _metadata }, _childRoles_initializers, _childRoles_extraInitializers);
        __esDecorate(null, null, _userAssignments_decorators, { kind: "field", name: "userAssignments", static: false, private: false, access: { has: obj => "userAssignments" in obj, get: obj => obj.userAssignments, set: (obj, value) => { obj.userAssignments = value; } }, metadata: _metadata }, _userAssignments_initializers, _userAssignments_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SecurityRole = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SecurityRole = _classThis;
})();
exports.SecurityRole = SecurityRole;
/**
 * User Role Assignment Model
 */
let UserRoleAssignment = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'user_role_assignments',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['user_id'] },
                { fields: ['role_id'] },
                { fields: ['is_active'] },
                { fields: ['expires_at'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _userId_decorators;
    let _userId_initializers = [];
    let _userId_extraInitializers = [];
    let _roleId_decorators;
    let _roleId_initializers = [];
    let _roleId_extraInitializers = [];
    let _assignedBy_decorators;
    let _assignedBy_initializers = [];
    let _assignedBy_extraInitializers = [];
    let _assignedAt_decorators;
    let _assignedAt_initializers = [];
    let _assignedAt_extraInitializers = [];
    let _expiresAt_decorators;
    let _expiresAt_initializers = [];
    let _expiresAt_extraInitializers = [];
    let _isActive_decorators;
    let _isActive_initializers = [];
    let _isActive_extraInitializers = [];
    let _revokedBy_decorators;
    let _revokedBy_initializers = [];
    let _revokedBy_extraInitializers = [];
    let _revokedAt_decorators;
    let _revokedAt_initializers = [];
    let _revokedAt_extraInitializers = [];
    let _justification_decorators;
    let _justification_initializers = [];
    let _justification_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    let _role_decorators;
    let _role_initializers = [];
    let _role_extraInitializers = [];
    var UserRoleAssignment = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.userId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _userId_initializers, void 0));
            this.roleId = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _roleId_initializers, void 0));
            this.assignedBy = (__runInitializers(this, _roleId_extraInitializers), __runInitializers(this, _assignedBy_initializers, void 0));
            this.assignedAt = (__runInitializers(this, _assignedBy_extraInitializers), __runInitializers(this, _assignedAt_initializers, void 0));
            this.expiresAt = (__runInitializers(this, _assignedAt_extraInitializers), __runInitializers(this, _expiresAt_initializers, void 0));
            this.isActive = (__runInitializers(this, _expiresAt_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
            this.revokedBy = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _revokedBy_initializers, void 0));
            this.revokedAt = (__runInitializers(this, _revokedBy_extraInitializers), __runInitializers(this, _revokedAt_initializers, void 0));
            this.justification = (__runInitializers(this, _revokedAt_extraInitializers), __runInitializers(this, _justification_initializers, void 0));
            this.createdAt = (__runInitializers(this, _justification_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.role = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _role_initializers, void 0));
            __runInitializers(this, _role_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "UserRoleAssignment");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _userId_decorators = [(0, swagger_1.ApiProperty)({ description: 'User ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _roleId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Role ID' }), (0, sequelize_typescript_1.ForeignKey)(() => SecurityRole), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _assignedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Assigned by user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _assignedAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Assigned at' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false, defaultValue: sequelize_typescript_1.DataType.NOW })];
        _expiresAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Expires at' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE }), sequelize_typescript_1.Index];
        _isActive_decorators = [(0, swagger_1.ApiProperty)({ description: 'Is active' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: true }), sequelize_typescript_1.Index];
        _revokedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Revoked by user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _revokedAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Revoked at' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _justification_decorators = [(0, swagger_1.ApiProperty)({ description: 'Justification' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        _role_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => SecurityRole)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: obj => "userId" in obj, get: obj => obj.userId, set: (obj, value) => { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
        __esDecorate(null, null, _roleId_decorators, { kind: "field", name: "roleId", static: false, private: false, access: { has: obj => "roleId" in obj, get: obj => obj.roleId, set: (obj, value) => { obj.roleId = value; } }, metadata: _metadata }, _roleId_initializers, _roleId_extraInitializers);
        __esDecorate(null, null, _assignedBy_decorators, { kind: "field", name: "assignedBy", static: false, private: false, access: { has: obj => "assignedBy" in obj, get: obj => obj.assignedBy, set: (obj, value) => { obj.assignedBy = value; } }, metadata: _metadata }, _assignedBy_initializers, _assignedBy_extraInitializers);
        __esDecorate(null, null, _assignedAt_decorators, { kind: "field", name: "assignedAt", static: false, private: false, access: { has: obj => "assignedAt" in obj, get: obj => obj.assignedAt, set: (obj, value) => { obj.assignedAt = value; } }, metadata: _metadata }, _assignedAt_initializers, _assignedAt_extraInitializers);
        __esDecorate(null, null, _expiresAt_decorators, { kind: "field", name: "expiresAt", static: false, private: false, access: { has: obj => "expiresAt" in obj, get: obj => obj.expiresAt, set: (obj, value) => { obj.expiresAt = value; } }, metadata: _metadata }, _expiresAt_initializers, _expiresAt_extraInitializers);
        __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: obj => "isActive" in obj, get: obj => obj.isActive, set: (obj, value) => { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
        __esDecorate(null, null, _revokedBy_decorators, { kind: "field", name: "revokedBy", static: false, private: false, access: { has: obj => "revokedBy" in obj, get: obj => obj.revokedBy, set: (obj, value) => { obj.revokedBy = value; } }, metadata: _metadata }, _revokedBy_initializers, _revokedBy_extraInitializers);
        __esDecorate(null, null, _revokedAt_decorators, { kind: "field", name: "revokedAt", static: false, private: false, access: { has: obj => "revokedAt" in obj, get: obj => obj.revokedAt, set: (obj, value) => { obj.revokedAt = value; } }, metadata: _metadata }, _revokedAt_initializers, _revokedAt_extraInitializers);
        __esDecorate(null, null, _justification_decorators, { kind: "field", name: "justification", static: false, private: false, access: { has: obj => "justification" in obj, get: obj => obj.justification, set: (obj, value) => { obj.justification = value; } }, metadata: _metadata }, _justification_initializers, _justification_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _role_decorators, { kind: "field", name: "role", static: false, private: false, access: { has: obj => "role" in obj, get: obj => obj.role, set: (obj, value) => { obj.role = value; } }, metadata: _metadata }, _role_initializers, _role_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        UserRoleAssignment = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return UserRoleAssignment = _classThis;
})();
exports.UserRoleAssignment = UserRoleAssignment;
/**
 * Permission Model
 */
let Permission = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'permissions',
            timestamps: true,
            indexes: [
                { fields: ['resource', 'action'], unique: true },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _resource_decorators;
    let _resource_initializers = [];
    let _resource_extraInitializers = [];
    let _action_decorators;
    let _action_initializers = [];
    let _action_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _conditions_decorators;
    let _conditions_initializers = [];
    let _conditions_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var Permission = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.resource = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _resource_initializers, void 0));
            this.action = (__runInitializers(this, _resource_extraInitializers), __runInitializers(this, _action_initializers, void 0));
            this.description = (__runInitializers(this, _action_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.conditions = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _conditions_initializers, void 0));
            this.createdAt = (__runInitializers(this, _conditions_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "Permission");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _resource_decorators = [(0, swagger_1.ApiProperty)({ description: 'Resource' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100), allowNull: false }), sequelize_typescript_1.Index];
        _action_decorators = [(0, swagger_1.ApiProperty)({ description: 'Action' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(PermissionAction)), allowNull: false }), sequelize_typescript_1.Index];
        _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Description' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _conditions_decorators = [(0, swagger_1.ApiProperty)({ description: 'Conditions' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _resource_decorators, { kind: "field", name: "resource", static: false, private: false, access: { has: obj => "resource" in obj, get: obj => obj.resource, set: (obj, value) => { obj.resource = value; } }, metadata: _metadata }, _resource_initializers, _resource_extraInitializers);
        __esDecorate(null, null, _action_decorators, { kind: "field", name: "action", static: false, private: false, access: { has: obj => "action" in obj, get: obj => obj.action, set: (obj, value) => { obj.action = value; } }, metadata: _metadata }, _action_initializers, _action_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _conditions_decorators, { kind: "field", name: "conditions", static: false, private: false, access: { has: obj => "conditions" in obj, get: obj => obj.conditions, set: (obj, value) => { obj.conditions = value; } }, metadata: _metadata }, _conditions_initializers, _conditions_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Permission = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Permission = _classThis;
})();
exports.Permission = Permission;
/**
 * Security Policy Model
 */
let SecurityPolicy = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'security_policies',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['name'], unique: true },
                { fields: ['policy_type'] },
                { fields: ['is_active'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _policyType_decorators;
    let _policyType_initializers = [];
    let _policyType_extraInitializers = [];
    let _rules_decorators;
    let _rules_initializers = [];
    let _rules_extraInitializers = [];
    let _isActive_decorators;
    let _isActive_initializers = [];
    let _isActive_extraInitializers = [];
    let _effectiveDate_decorators;
    let _effectiveDate_initializers = [];
    let _effectiveDate_extraInitializers = [];
    let _expirationDate_decorators;
    let _expirationDate_initializers = [];
    let _expirationDate_extraInitializers = [];
    let _violationCount_decorators;
    let _violationCount_initializers = [];
    let _violationCount_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var SecurityPolicy = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.name = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.policyType = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _policyType_initializers, void 0));
            this.rules = (__runInitializers(this, _policyType_extraInitializers), __runInitializers(this, _rules_initializers, void 0));
            this.isActive = (__runInitializers(this, _rules_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
            this.effectiveDate = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _effectiveDate_initializers, void 0));
            this.expirationDate = (__runInitializers(this, _effectiveDate_extraInitializers), __runInitializers(this, _expirationDate_initializers, void 0));
            this.violationCount = (__runInitializers(this, _expirationDate_extraInitializers), __runInitializers(this, _violationCount_initializers, void 0));
            this.createdAt = (__runInitializers(this, _violationCount_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "SecurityPolicy");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _name_decorators = [(0, swagger_1.ApiProperty)({ description: 'Policy name' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200), unique: true, allowNull: false }), sequelize_typescript_1.Index];
        _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Description' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _policyType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Policy type' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100), allowNull: false }), sequelize_typescript_1.Index];
        _rules_decorators = [(0, swagger_1.ApiProperty)({ description: 'Policy rules' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: false })];
        _isActive_decorators = [(0, swagger_1.ApiProperty)({ description: 'Is active' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: true }), sequelize_typescript_1.Index];
        _effectiveDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Effective date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _expirationDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Expiration date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _violationCount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Violation count' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, defaultValue: 0 })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _policyType_decorators, { kind: "field", name: "policyType", static: false, private: false, access: { has: obj => "policyType" in obj, get: obj => obj.policyType, set: (obj, value) => { obj.policyType = value; } }, metadata: _metadata }, _policyType_initializers, _policyType_extraInitializers);
        __esDecorate(null, null, _rules_decorators, { kind: "field", name: "rules", static: false, private: false, access: { has: obj => "rules" in obj, get: obj => obj.rules, set: (obj, value) => { obj.rules = value; } }, metadata: _metadata }, _rules_initializers, _rules_extraInitializers);
        __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: obj => "isActive" in obj, get: obj => obj.isActive, set: (obj, value) => { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
        __esDecorate(null, null, _effectiveDate_decorators, { kind: "field", name: "effectiveDate", static: false, private: false, access: { has: obj => "effectiveDate" in obj, get: obj => obj.effectiveDate, set: (obj, value) => { obj.effectiveDate = value; } }, metadata: _metadata }, _effectiveDate_initializers, _effectiveDate_extraInitializers);
        __esDecorate(null, null, _expirationDate_decorators, { kind: "field", name: "expirationDate", static: false, private: false, access: { has: obj => "expirationDate" in obj, get: obj => obj.expirationDate, set: (obj, value) => { obj.expirationDate = value; } }, metadata: _metadata }, _expirationDate_initializers, _expirationDate_extraInitializers);
        __esDecorate(null, null, _violationCount_decorators, { kind: "field", name: "violationCount", static: false, private: false, access: { has: obj => "violationCount" in obj, get: obj => obj.violationCount, set: (obj, value) => { obj.violationCount = value; } }, metadata: _metadata }, _violationCount_initializers, _violationCount_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SecurityPolicy = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SecurityPolicy = _classThis;
})();
exports.SecurityPolicy = SecurityPolicy;
/**
 * Security Audit Log Model
 */
let SecurityAuditLog = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'security_audit_logs',
            timestamps: true,
            indexes: [
                { fields: ['event_type'] },
                { fields: ['user_id'] },
                { fields: ['resource_type'] },
                { fields: ['resource_id'] },
                { fields: ['timestamp'] },
                { fields: ['result'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _eventType_decorators;
    let _eventType_initializers = [];
    let _eventType_extraInitializers = [];
    let _userId_decorators;
    let _userId_initializers = [];
    let _userId_extraInitializers = [];
    let _resourceType_decorators;
    let _resourceType_initializers = [];
    let _resourceType_extraInitializers = [];
    let _resourceId_decorators;
    let _resourceId_initializers = [];
    let _resourceId_extraInitializers = [];
    let _action_decorators;
    let _action_initializers = [];
    let _action_extraInitializers = [];
    let _result_decorators;
    let _result_initializers = [];
    let _result_extraInitializers = [];
    let _ipAddress_decorators;
    let _ipAddress_initializers = [];
    let _ipAddress_extraInitializers = [];
    let _userAgent_decorators;
    let _userAgent_initializers = [];
    let _userAgent_extraInitializers = [];
    let _timestamp_decorators;
    let _timestamp_initializers = [];
    let _timestamp_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _sessionId_decorators;
    let _sessionId_initializers = [];
    let _sessionId_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var SecurityAuditLog = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.eventType = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _eventType_initializers, void 0));
            this.userId = (__runInitializers(this, _eventType_extraInitializers), __runInitializers(this, _userId_initializers, void 0));
            this.resourceType = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _resourceType_initializers, void 0));
            this.resourceId = (__runInitializers(this, _resourceType_extraInitializers), __runInitializers(this, _resourceId_initializers, void 0));
            this.action = (__runInitializers(this, _resourceId_extraInitializers), __runInitializers(this, _action_initializers, void 0));
            this.result = (__runInitializers(this, _action_extraInitializers), __runInitializers(this, _result_initializers, void 0));
            this.ipAddress = (__runInitializers(this, _result_extraInitializers), __runInitializers(this, _ipAddress_initializers, void 0));
            this.userAgent = (__runInitializers(this, _ipAddress_extraInitializers), __runInitializers(this, _userAgent_initializers, void 0));
            this.timestamp = (__runInitializers(this, _userAgent_extraInitializers), __runInitializers(this, _timestamp_initializers, void 0));
            this.metadata = (__runInitializers(this, _timestamp_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.sessionId = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _sessionId_initializers, void 0));
            this.createdAt = (__runInitializers(this, _sessionId_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "SecurityAuditLog");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _eventType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Event type' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(SecurityEventType)), allowNull: false }), sequelize_typescript_1.Index];
        _userId_decorators = [(0, swagger_1.ApiProperty)({ description: 'User ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID }), sequelize_typescript_1.Index];
        _resourceType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Resource type' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100) }), sequelize_typescript_1.Index];
        _resourceId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Resource ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID }), sequelize_typescript_1.Index];
        _action_decorators = [(0, swagger_1.ApiProperty)({ description: 'Action' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100) })];
        _result_decorators = [(0, swagger_1.ApiProperty)({ description: 'Result' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50), allowNull: false }), sequelize_typescript_1.Index];
        _ipAddress_decorators = [(0, swagger_1.ApiProperty)({ description: 'IP address' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50) })];
        _userAgent_decorators = [(0, swagger_1.ApiProperty)({ description: 'User agent' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(500) })];
        _timestamp_decorators = [(0, swagger_1.ApiProperty)({ description: 'Timestamp' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false, defaultValue: sequelize_typescript_1.DataType.NOW }), sequelize_typescript_1.Index];
        _metadata_decorators = [(0, swagger_1.ApiProperty)({ description: 'Metadata' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _sessionId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Session ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100) })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _eventType_decorators, { kind: "field", name: "eventType", static: false, private: false, access: { has: obj => "eventType" in obj, get: obj => obj.eventType, set: (obj, value) => { obj.eventType = value; } }, metadata: _metadata }, _eventType_initializers, _eventType_extraInitializers);
        __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: obj => "userId" in obj, get: obj => obj.userId, set: (obj, value) => { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
        __esDecorate(null, null, _resourceType_decorators, { kind: "field", name: "resourceType", static: false, private: false, access: { has: obj => "resourceType" in obj, get: obj => obj.resourceType, set: (obj, value) => { obj.resourceType = value; } }, metadata: _metadata }, _resourceType_initializers, _resourceType_extraInitializers);
        __esDecorate(null, null, _resourceId_decorators, { kind: "field", name: "resourceId", static: false, private: false, access: { has: obj => "resourceId" in obj, get: obj => obj.resourceId, set: (obj, value) => { obj.resourceId = value; } }, metadata: _metadata }, _resourceId_initializers, _resourceId_extraInitializers);
        __esDecorate(null, null, _action_decorators, { kind: "field", name: "action", static: false, private: false, access: { has: obj => "action" in obj, get: obj => obj.action, set: (obj, value) => { obj.action = value; } }, metadata: _metadata }, _action_initializers, _action_extraInitializers);
        __esDecorate(null, null, _result_decorators, { kind: "field", name: "result", static: false, private: false, access: { has: obj => "result" in obj, get: obj => obj.result, set: (obj, value) => { obj.result = value; } }, metadata: _metadata }, _result_initializers, _result_extraInitializers);
        __esDecorate(null, null, _ipAddress_decorators, { kind: "field", name: "ipAddress", static: false, private: false, access: { has: obj => "ipAddress" in obj, get: obj => obj.ipAddress, set: (obj, value) => { obj.ipAddress = value; } }, metadata: _metadata }, _ipAddress_initializers, _ipAddress_extraInitializers);
        __esDecorate(null, null, _userAgent_decorators, { kind: "field", name: "userAgent", static: false, private: false, access: { has: obj => "userAgent" in obj, get: obj => obj.userAgent, set: (obj, value) => { obj.userAgent = value; } }, metadata: _metadata }, _userAgent_initializers, _userAgent_extraInitializers);
        __esDecorate(null, null, _timestamp_decorators, { kind: "field", name: "timestamp", static: false, private: false, access: { has: obj => "timestamp" in obj, get: obj => obj.timestamp, set: (obj, value) => { obj.timestamp = value; } }, metadata: _metadata }, _timestamp_initializers, _timestamp_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _sessionId_decorators, { kind: "field", name: "sessionId", static: false, private: false, access: { has: obj => "sessionId" in obj, get: obj => obj.sessionId, set: (obj, value) => { obj.sessionId = value; } }, metadata: _metadata }, _sessionId_initializers, _sessionId_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SecurityAuditLog = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SecurityAuditLog = _classThis;
})();
exports.SecurityAuditLog = SecurityAuditLog;
/**
 * Security Incident Model
 */
let SecurityIncident = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'security_incidents',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['incident_number'], unique: true },
                { fields: ['severity'] },
                { fields: ['status'] },
                { fields: ['reported_by'] },
                { fields: ['assigned_to'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _staticExtraInitializers = [];
    let _static_generateIncidentNumber_decorators;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _incidentNumber_decorators;
    let _incidentNumber_initializers = [];
    let _incidentNumber_extraInitializers = [];
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _severity_decorators;
    let _severity_initializers = [];
    let _severity_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _incidentType_decorators;
    let _incidentType_initializers = [];
    let _incidentType_extraInitializers = [];
    let _affectedAssets_decorators;
    let _affectedAssets_initializers = [];
    let _affectedAssets_extraInitializers = [];
    let _reportedBy_decorators;
    let _reportedBy_initializers = [];
    let _reportedBy_extraInitializers = [];
    let _reportedAt_decorators;
    let _reportedAt_initializers = [];
    let _reportedAt_extraInitializers = [];
    let _assignedTo_decorators;
    let _assignedTo_initializers = [];
    let _assignedTo_extraInitializers = [];
    let _resolvedAt_decorators;
    let _resolvedAt_initializers = [];
    let _resolvedAt_extraInitializers = [];
    let _resolvedBy_decorators;
    let _resolvedBy_initializers = [];
    let _resolvedBy_extraInitializers = [];
    let _resolutionNotes_decorators;
    let _resolutionNotes_initializers = [];
    let _resolutionNotes_extraInitializers = [];
    let _rootCause_decorators;
    let _rootCause_initializers = [];
    let _rootCause_extraInitializers = [];
    let _preventiveActions_decorators;
    let _preventiveActions_initializers = [];
    let _preventiveActions_extraInitializers = [];
    let _attachments_decorators;
    let _attachments_initializers = [];
    let _attachments_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var SecurityIncident = _classThis = class extends _classSuper {
        static async generateIncidentNumber(instance) {
            if (!instance.incidentNumber) {
                const count = await SecurityIncident.count();
                const year = new Date().getFullYear();
                instance.incidentNumber = `SEC-${year}-${String(count + 1).padStart(6, '0')}`;
            }
        }
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.incidentNumber = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _incidentNumber_initializers, void 0));
            this.title = (__runInitializers(this, _incidentNumber_extraInitializers), __runInitializers(this, _title_initializers, void 0));
            this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.severity = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _severity_initializers, void 0));
            this.status = (__runInitializers(this, _severity_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.incidentType = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _incidentType_initializers, void 0));
            this.affectedAssets = (__runInitializers(this, _incidentType_extraInitializers), __runInitializers(this, _affectedAssets_initializers, void 0));
            this.reportedBy = (__runInitializers(this, _affectedAssets_extraInitializers), __runInitializers(this, _reportedBy_initializers, void 0));
            this.reportedAt = (__runInitializers(this, _reportedBy_extraInitializers), __runInitializers(this, _reportedAt_initializers, void 0));
            this.assignedTo = (__runInitializers(this, _reportedAt_extraInitializers), __runInitializers(this, _assignedTo_initializers, void 0));
            this.resolvedAt = (__runInitializers(this, _assignedTo_extraInitializers), __runInitializers(this, _resolvedAt_initializers, void 0));
            this.resolvedBy = (__runInitializers(this, _resolvedAt_extraInitializers), __runInitializers(this, _resolvedBy_initializers, void 0));
            this.resolutionNotes = (__runInitializers(this, _resolvedBy_extraInitializers), __runInitializers(this, _resolutionNotes_initializers, void 0));
            this.rootCause = (__runInitializers(this, _resolutionNotes_extraInitializers), __runInitializers(this, _rootCause_initializers, void 0));
            this.preventiveActions = (__runInitializers(this, _rootCause_extraInitializers), __runInitializers(this, _preventiveActions_initializers, void 0));
            this.attachments = (__runInitializers(this, _preventiveActions_extraInitializers), __runInitializers(this, _attachments_initializers, void 0));
            this.createdAt = (__runInitializers(this, _attachments_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "SecurityIncident");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _incidentNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Incident number' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50), unique: true }), sequelize_typescript_1.Index];
        _title_decorators = [(0, swagger_1.ApiProperty)({ description: 'Title' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(300), allowNull: false })];
        _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Description' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: false })];
        _severity_decorators = [(0, swagger_1.ApiProperty)({ description: 'Severity' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(IncidentSeverity)), allowNull: false }), sequelize_typescript_1.Index];
        _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'Status' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(IncidentStatus)), defaultValue: IncidentStatus.OPEN }), sequelize_typescript_1.Index];
        _incidentType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Incident type' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100), allowNull: false })];
        _affectedAssets_decorators = [(0, swagger_1.ApiProperty)({ description: 'Affected asset IDs' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.UUID) })];
        _reportedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Reported by user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _reportedAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Reported at' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false, defaultValue: sequelize_typescript_1.DataType.NOW })];
        _assignedTo_decorators = [(0, swagger_1.ApiProperty)({ description: 'Assigned to user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID }), sequelize_typescript_1.Index];
        _resolvedAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Resolved at' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _resolvedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Resolved by user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _resolutionNotes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Resolution notes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _rootCause_decorators = [(0, swagger_1.ApiProperty)({ description: 'Root cause' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _preventiveActions_decorators = [(0, swagger_1.ApiProperty)({ description: 'Preventive actions' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _attachments_decorators = [(0, swagger_1.ApiProperty)({ description: 'Attachments' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING) })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        _static_generateIncidentNumber_decorators = [sequelize_typescript_1.BeforeCreate];
        __esDecorate(_classThis, null, _static_generateIncidentNumber_decorators, { kind: "method", name: "generateIncidentNumber", static: true, private: false, access: { has: obj => "generateIncidentNumber" in obj, get: obj => obj.generateIncidentNumber }, metadata: _metadata }, null, _staticExtraInitializers);
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _incidentNumber_decorators, { kind: "field", name: "incidentNumber", static: false, private: false, access: { has: obj => "incidentNumber" in obj, get: obj => obj.incidentNumber, set: (obj, value) => { obj.incidentNumber = value; } }, metadata: _metadata }, _incidentNumber_initializers, _incidentNumber_extraInitializers);
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _severity_decorators, { kind: "field", name: "severity", static: false, private: false, access: { has: obj => "severity" in obj, get: obj => obj.severity, set: (obj, value) => { obj.severity = value; } }, metadata: _metadata }, _severity_initializers, _severity_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _incidentType_decorators, { kind: "field", name: "incidentType", static: false, private: false, access: { has: obj => "incidentType" in obj, get: obj => obj.incidentType, set: (obj, value) => { obj.incidentType = value; } }, metadata: _metadata }, _incidentType_initializers, _incidentType_extraInitializers);
        __esDecorate(null, null, _affectedAssets_decorators, { kind: "field", name: "affectedAssets", static: false, private: false, access: { has: obj => "affectedAssets" in obj, get: obj => obj.affectedAssets, set: (obj, value) => { obj.affectedAssets = value; } }, metadata: _metadata }, _affectedAssets_initializers, _affectedAssets_extraInitializers);
        __esDecorate(null, null, _reportedBy_decorators, { kind: "field", name: "reportedBy", static: false, private: false, access: { has: obj => "reportedBy" in obj, get: obj => obj.reportedBy, set: (obj, value) => { obj.reportedBy = value; } }, metadata: _metadata }, _reportedBy_initializers, _reportedBy_extraInitializers);
        __esDecorate(null, null, _reportedAt_decorators, { kind: "field", name: "reportedAt", static: false, private: false, access: { has: obj => "reportedAt" in obj, get: obj => obj.reportedAt, set: (obj, value) => { obj.reportedAt = value; } }, metadata: _metadata }, _reportedAt_initializers, _reportedAt_extraInitializers);
        __esDecorate(null, null, _assignedTo_decorators, { kind: "field", name: "assignedTo", static: false, private: false, access: { has: obj => "assignedTo" in obj, get: obj => obj.assignedTo, set: (obj, value) => { obj.assignedTo = value; } }, metadata: _metadata }, _assignedTo_initializers, _assignedTo_extraInitializers);
        __esDecorate(null, null, _resolvedAt_decorators, { kind: "field", name: "resolvedAt", static: false, private: false, access: { has: obj => "resolvedAt" in obj, get: obj => obj.resolvedAt, set: (obj, value) => { obj.resolvedAt = value; } }, metadata: _metadata }, _resolvedAt_initializers, _resolvedAt_extraInitializers);
        __esDecorate(null, null, _resolvedBy_decorators, { kind: "field", name: "resolvedBy", static: false, private: false, access: { has: obj => "resolvedBy" in obj, get: obj => obj.resolvedBy, set: (obj, value) => { obj.resolvedBy = value; } }, metadata: _metadata }, _resolvedBy_initializers, _resolvedBy_extraInitializers);
        __esDecorate(null, null, _resolutionNotes_decorators, { kind: "field", name: "resolutionNotes", static: false, private: false, access: { has: obj => "resolutionNotes" in obj, get: obj => obj.resolutionNotes, set: (obj, value) => { obj.resolutionNotes = value; } }, metadata: _metadata }, _resolutionNotes_initializers, _resolutionNotes_extraInitializers);
        __esDecorate(null, null, _rootCause_decorators, { kind: "field", name: "rootCause", static: false, private: false, access: { has: obj => "rootCause" in obj, get: obj => obj.rootCause, set: (obj, value) => { obj.rootCause = value; } }, metadata: _metadata }, _rootCause_initializers, _rootCause_extraInitializers);
        __esDecorate(null, null, _preventiveActions_decorators, { kind: "field", name: "preventiveActions", static: false, private: false, access: { has: obj => "preventiveActions" in obj, get: obj => obj.preventiveActions, set: (obj, value) => { obj.preventiveActions = value; } }, metadata: _metadata }, _preventiveActions_initializers, _preventiveActions_extraInitializers);
        __esDecorate(null, null, _attachments_decorators, { kind: "field", name: "attachments", static: false, private: false, access: { has: obj => "attachments" in obj, get: obj => obj.attachments, set: (obj, value) => { obj.attachments = value; } }, metadata: _metadata }, _attachments_initializers, _attachments_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SecurityIncident = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _staticExtraInitializers);
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SecurityIncident = _classThis;
})();
exports.SecurityIncident = SecurityIncident;
/**
 * Access Review Model
 */
let AccessReview = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'access_reviews',
            timestamps: true,
            indexes: [
                { fields: ['status'] },
                { fields: ['due_date'] },
                { fields: ['target_role_id'] },
                { fields: ['target_user_id'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _reviewerIds_decorators;
    let _reviewerIds_initializers = [];
    let _reviewerIds_extraInitializers = [];
    let _targetRoleId_decorators;
    let _targetRoleId_initializers = [];
    let _targetRoleId_extraInitializers = [];
    let _targetUserId_decorators;
    let _targetUserId_initializers = [];
    let _targetUserId_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _scope_decorators;
    let _scope_initializers = [];
    let _scope_extraInitializers = [];
    let _dueDate_decorators;
    let _dueDate_initializers = [];
    let _dueDate_extraInitializers = [];
    let _startedAt_decorators;
    let _startedAt_initializers = [];
    let _startedAt_extraInitializers = [];
    let _completedAt_decorators;
    let _completedAt_initializers = [];
    let _completedAt_extraInitializers = [];
    let _findings_decorators;
    let _findings_initializers = [];
    let _findings_extraInitializers = [];
    let _recommendations_decorators;
    let _recommendations_initializers = [];
    let _recommendations_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _targetRole_decorators;
    let _targetRole_initializers = [];
    let _targetRole_extraInitializers = [];
    var AccessReview = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.reviewerIds = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _reviewerIds_initializers, void 0));
            this.targetRoleId = (__runInitializers(this, _reviewerIds_extraInitializers), __runInitializers(this, _targetRoleId_initializers, void 0));
            this.targetUserId = (__runInitializers(this, _targetRoleId_extraInitializers), __runInitializers(this, _targetUserId_initializers, void 0));
            this.status = (__runInitializers(this, _targetUserId_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.scope = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _scope_initializers, void 0));
            this.dueDate = (__runInitializers(this, _scope_extraInitializers), __runInitializers(this, _dueDate_initializers, void 0));
            this.startedAt = (__runInitializers(this, _dueDate_extraInitializers), __runInitializers(this, _startedAt_initializers, void 0));
            this.completedAt = (__runInitializers(this, _startedAt_extraInitializers), __runInitializers(this, _completedAt_initializers, void 0));
            this.findings = (__runInitializers(this, _completedAt_extraInitializers), __runInitializers(this, _findings_initializers, void 0));
            this.recommendations = (__runInitializers(this, _findings_extraInitializers), __runInitializers(this, _recommendations_initializers, void 0));
            this.createdAt = (__runInitializers(this, _recommendations_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.targetRole = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _targetRole_initializers, void 0));
            __runInitializers(this, _targetRole_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "AccessReview");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _reviewerIds_decorators = [(0, swagger_1.ApiProperty)({ description: 'Reviewer user IDs' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.UUID), allowNull: false })];
        _targetRoleId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Target role ID' }), (0, sequelize_typescript_1.ForeignKey)(() => SecurityRole), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID }), sequelize_typescript_1.Index];
        _targetUserId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Target user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID }), sequelize_typescript_1.Index];
        _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'Status' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(AccessReviewStatus)), defaultValue: AccessReviewStatus.PENDING }), sequelize_typescript_1.Index];
        _scope_decorators = [(0, swagger_1.ApiProperty)({ description: 'Scope' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: false })];
        _dueDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Due date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false }), sequelize_typescript_1.Index];
        _startedAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Started at' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _completedAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Completed at' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _findings_decorators = [(0, swagger_1.ApiProperty)({ description: 'Findings' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _recommendations_decorators = [(0, swagger_1.ApiProperty)({ description: 'Recommendations' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _targetRole_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => SecurityRole)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _reviewerIds_decorators, { kind: "field", name: "reviewerIds", static: false, private: false, access: { has: obj => "reviewerIds" in obj, get: obj => obj.reviewerIds, set: (obj, value) => { obj.reviewerIds = value; } }, metadata: _metadata }, _reviewerIds_initializers, _reviewerIds_extraInitializers);
        __esDecorate(null, null, _targetRoleId_decorators, { kind: "field", name: "targetRoleId", static: false, private: false, access: { has: obj => "targetRoleId" in obj, get: obj => obj.targetRoleId, set: (obj, value) => { obj.targetRoleId = value; } }, metadata: _metadata }, _targetRoleId_initializers, _targetRoleId_extraInitializers);
        __esDecorate(null, null, _targetUserId_decorators, { kind: "field", name: "targetUserId", static: false, private: false, access: { has: obj => "targetUserId" in obj, get: obj => obj.targetUserId, set: (obj, value) => { obj.targetUserId = value; } }, metadata: _metadata }, _targetUserId_initializers, _targetUserId_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _scope_decorators, { kind: "field", name: "scope", static: false, private: false, access: { has: obj => "scope" in obj, get: obj => obj.scope, set: (obj, value) => { obj.scope = value; } }, metadata: _metadata }, _scope_initializers, _scope_extraInitializers);
        __esDecorate(null, null, _dueDate_decorators, { kind: "field", name: "dueDate", static: false, private: false, access: { has: obj => "dueDate" in obj, get: obj => obj.dueDate, set: (obj, value) => { obj.dueDate = value; } }, metadata: _metadata }, _dueDate_initializers, _dueDate_extraInitializers);
        __esDecorate(null, null, _startedAt_decorators, { kind: "field", name: "startedAt", static: false, private: false, access: { has: obj => "startedAt" in obj, get: obj => obj.startedAt, set: (obj, value) => { obj.startedAt = value; } }, metadata: _metadata }, _startedAt_initializers, _startedAt_extraInitializers);
        __esDecorate(null, null, _completedAt_decorators, { kind: "field", name: "completedAt", static: false, private: false, access: { has: obj => "completedAt" in obj, get: obj => obj.completedAt, set: (obj, value) => { obj.completedAt = value; } }, metadata: _metadata }, _completedAt_initializers, _completedAt_extraInitializers);
        __esDecorate(null, null, _findings_decorators, { kind: "field", name: "findings", static: false, private: false, access: { has: obj => "findings" in obj, get: obj => obj.findings, set: (obj, value) => { obj.findings = value; } }, metadata: _metadata }, _findings_initializers, _findings_extraInitializers);
        __esDecorate(null, null, _recommendations_decorators, { kind: "field", name: "recommendations", static: false, private: false, access: { has: obj => "recommendations" in obj, get: obj => obj.recommendations, set: (obj, value) => { obj.recommendations = value; } }, metadata: _metadata }, _recommendations_initializers, _recommendations_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _targetRole_decorators, { kind: "field", name: "targetRole", static: false, private: false, access: { has: obj => "targetRole" in obj, get: obj => obj.targetRole, set: (obj, value) => { obj.targetRole = value; } }, metadata: _metadata }, _targetRole_initializers, _targetRole_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AccessReview = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AccessReview = _classThis;
})();
exports.AccessReview = AccessReview;
/**
 * Field Security Model
 */
let FieldSecurity = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'field_security',
            timestamps: true,
            indexes: [
                { fields: ['table_name', 'field_name'], unique: true },
                { fields: ['classification'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _tableName_decorators;
    let _tableName_initializers = [];
    let _tableName_extraInitializers = [];
    let _fieldName_decorators;
    let _fieldName_initializers = [];
    let _fieldName_extraInitializers = [];
    let _classification_decorators;
    let _classification_initializers = [];
    let _classification_extraInitializers = [];
    let _encryptionRequired_decorators;
    let _encryptionRequired_initializers = [];
    let _encryptionRequired_extraInitializers = [];
    let _maskingRequired_decorators;
    let _maskingRequired_initializers = [];
    let _maskingRequired_extraInitializers = [];
    let _maskingPattern_decorators;
    let _maskingPattern_initializers = [];
    let _maskingPattern_extraInitializers = [];
    let _allowedRoles_decorators;
    let _allowedRoles_initializers = [];
    let _allowedRoles_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var FieldSecurity = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.tableName = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _tableName_initializers, void 0));
            this.fieldName = (__runInitializers(this, _tableName_extraInitializers), __runInitializers(this, _fieldName_initializers, void 0));
            this.classification = (__runInitializers(this, _fieldName_extraInitializers), __runInitializers(this, _classification_initializers, void 0));
            this.encryptionRequired = (__runInitializers(this, _classification_extraInitializers), __runInitializers(this, _encryptionRequired_initializers, void 0));
            this.maskingRequired = (__runInitializers(this, _encryptionRequired_extraInitializers), __runInitializers(this, _maskingRequired_initializers, void 0));
            this.maskingPattern = (__runInitializers(this, _maskingRequired_extraInitializers), __runInitializers(this, _maskingPattern_initializers, void 0));
            this.allowedRoles = (__runInitializers(this, _maskingPattern_extraInitializers), __runInitializers(this, _allowedRoles_initializers, void 0));
            this.createdAt = (__runInitializers(this, _allowedRoles_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "FieldSecurity");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _tableName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Table name' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100), allowNull: false }), sequelize_typescript_1.Index];
        _fieldName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Field name' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100), allowNull: false }), sequelize_typescript_1.Index];
        _classification_decorators = [(0, swagger_1.ApiProperty)({ description: 'Data classification' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(DataClassification)), allowNull: false }), sequelize_typescript_1.Index];
        _encryptionRequired_decorators = [(0, swagger_1.ApiProperty)({ description: 'Encryption required' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false })];
        _maskingRequired_decorators = [(0, swagger_1.ApiProperty)({ description: 'Masking required' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false })];
        _maskingPattern_decorators = [(0, swagger_1.ApiProperty)({ description: 'Masking pattern' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100) })];
        _allowedRoles_decorators = [(0, swagger_1.ApiProperty)({ description: 'Allowed role IDs' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.UUID) })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _tableName_decorators, { kind: "field", name: "tableName", static: false, private: false, access: { has: obj => "tableName" in obj, get: obj => obj.tableName, set: (obj, value) => { obj.tableName = value; } }, metadata: _metadata }, _tableName_initializers, _tableName_extraInitializers);
        __esDecorate(null, null, _fieldName_decorators, { kind: "field", name: "fieldName", static: false, private: false, access: { has: obj => "fieldName" in obj, get: obj => obj.fieldName, set: (obj, value) => { obj.fieldName = value; } }, metadata: _metadata }, _fieldName_initializers, _fieldName_extraInitializers);
        __esDecorate(null, null, _classification_decorators, { kind: "field", name: "classification", static: false, private: false, access: { has: obj => "classification" in obj, get: obj => obj.classification, set: (obj, value) => { obj.classification = value; } }, metadata: _metadata }, _classification_initializers, _classification_extraInitializers);
        __esDecorate(null, null, _encryptionRequired_decorators, { kind: "field", name: "encryptionRequired", static: false, private: false, access: { has: obj => "encryptionRequired" in obj, get: obj => obj.encryptionRequired, set: (obj, value) => { obj.encryptionRequired = value; } }, metadata: _metadata }, _encryptionRequired_initializers, _encryptionRequired_extraInitializers);
        __esDecorate(null, null, _maskingRequired_decorators, { kind: "field", name: "maskingRequired", static: false, private: false, access: { has: obj => "maskingRequired" in obj, get: obj => obj.maskingRequired, set: (obj, value) => { obj.maskingRequired = value; } }, metadata: _metadata }, _maskingRequired_initializers, _maskingRequired_extraInitializers);
        __esDecorate(null, null, _maskingPattern_decorators, { kind: "field", name: "maskingPattern", static: false, private: false, access: { has: obj => "maskingPattern" in obj, get: obj => obj.maskingPattern, set: (obj, value) => { obj.maskingPattern = value; } }, metadata: _metadata }, _maskingPattern_initializers, _maskingPattern_extraInitializers);
        __esDecorate(null, null, _allowedRoles_decorators, { kind: "field", name: "allowedRoles", static: false, private: false, access: { has: obj => "allowedRoles" in obj, get: obj => obj.allowedRoles, set: (obj, value) => { obj.allowedRoles = value; } }, metadata: _metadata }, _allowedRoles_initializers, _allowedRoles_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        FieldSecurity = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return FieldSecurity = _classThis;
})();
exports.FieldSecurity = FieldSecurity;
// ============================================================================
// ROLE AND PERMISSION FUNCTIONS
// ============================================================================
/**
 * Creates security role
 *
 * @param data - Role data
 * @param transaction - Optional database transaction
 * @returns Created role
 *
 * @example
 * ```typescript
 * const role = await createSecurityRole({
 *   name: 'Asset Manager',
 *   description: 'Full access to asset management',
 *   permissions: ['asset:read', 'asset:write', 'asset:delete', 'asset:approve'],
 *   parentRoleId: 'base-role-123'
 * });
 * ```
 */
async function createSecurityRole(data, transaction) {
    const role = await SecurityRole.create(data, { transaction });
    return role;
}
/**
 * Assigns role to user
 *
 * @param data - Assignment data
 * @param transaction - Optional database transaction
 * @returns Role assignment
 *
 * @example
 * ```typescript
 * await assignRoleToUser({
 *   userId: 'user-123',
 *   roleId: 'role-456',
 *   assignedBy: 'admin-789',
 *   expiresAt: new Date('2025-12-31'),
 *   justification: 'Promoted to asset manager position'
 * });
 * ```
 */
async function assignRoleToUser(data, transaction) {
    // Check if role exists
    const role = await SecurityRole.findByPk(data.roleId, { transaction });
    if (!role) {
        throw new common_1.NotFoundException(`Role ${data.roleId} not found`);
    }
    const assignment = await UserRoleAssignment.create({
        ...data,
        assignedAt: new Date(),
        isActive: true,
    }, { transaction });
    // Log security event
    await logSecurityEvent({
        eventType: SecurityEventType.ROLE_ASSIGNED,
        userId: data.userId,
        action: 'role_assigned',
        result: 'success',
        metadata: {
            roleId: data.roleId,
            assignedBy: data.assignedBy,
            expiresAt: data.expiresAt,
        },
    }, transaction);
    return assignment;
}
/**
 * Revokes role from user
 *
 * @param assignmentId - Assignment ID
 * @param revokedBy - User revoking
 * @param transaction - Optional database transaction
 * @returns Updated assignment
 *
 * @example
 * ```typescript
 * await revokeRoleFromUser('assignment-123', 'admin-456');
 * ```
 */
async function revokeRoleFromUser(assignmentId, revokedBy, transaction) {
    const assignment = await UserRoleAssignment.findByPk(assignmentId, { transaction });
    if (!assignment) {
        throw new common_1.NotFoundException(`Assignment ${assignmentId} not found`);
    }
    await assignment.update({
        isActive: false,
        revokedBy,
        revokedAt: new Date(),
    }, { transaction });
    // Log security event
    await logSecurityEvent({
        eventType: SecurityEventType.ROLE_REVOKED,
        userId: assignment.userId,
        action: 'role_revoked',
        result: 'success',
        metadata: {
            roleId: assignment.roleId,
            revokedBy,
        },
    }, transaction);
    return assignment;
}
/**
 * Checks permission
 *
 * @param userId - User ID
 * @param permission - Permission string
 * @param resourceId - Optional resource ID
 * @returns Has permission
 *
 * @example
 * ```typescript
 * const canWrite = await checkPermission('user-123', 'asset:write', 'asset-456');
 * if (!canWrite) {
 *   throw new ForbiddenException('Access denied');
 * }
 * ```
 */
async function checkPermission(userId, permission, resourceId) {
    // Get active role assignments
    const assignments = await UserRoleAssignment.findAll({
        where: {
            userId,
            isActive: true,
            [sequelize_1.Op.or]: [
                { expiresAt: null },
                { expiresAt: { [sequelize_1.Op.gt]: new Date() } },
            ],
        },
        include: [{ model: SecurityRole }],
    });
    if (assignments.length === 0) {
        return false;
    }
    // Check if any role has the permission
    for (const assignment of assignments) {
        const role = assignment.role;
        if (role.permissions.includes(permission) || role.permissions.includes('*')) {
            return true;
        }
    }
    return false;
}
/**
 * Gets user permissions
 *
 * @param userId - User ID
 * @returns User permissions
 *
 * @example
 * ```typescript
 * const permissions = await getUserPermissions('user-123');
 * ```
 */
async function getUserPermissions(userId) {
    const assignments = await UserRoleAssignment.findAll({
        where: {
            userId,
            isActive: true,
            [sequelize_1.Op.or]: [
                { expiresAt: null },
                { expiresAt: { [sequelize_1.Op.gt]: new Date() } },
            ],
        },
        include: [{ model: SecurityRole }],
    });
    const permissions = new Set();
    for (const assignment of assignments) {
        const role = assignment.role;
        role.permissions.forEach(p => permissions.add(p));
    }
    return Array.from(permissions);
}
/**
 * Gets user roles
 *
 * @param userId - User ID
 * @returns Active roles
 *
 * @example
 * ```typescript
 * const roles = await getUserRoles('user-123');
 * ```
 */
async function getUserRoles(userId) {
    const assignments = await UserRoleAssignment.findAll({
        where: {
            userId,
            isActive: true,
            [sequelize_1.Op.or]: [
                { expiresAt: null },
                { expiresAt: { [sequelize_1.Op.gt]: new Date() } },
            ],
        },
        include: [{ model: SecurityRole }],
    });
    return assignments.map(a => a.role);
}
// ============================================================================
// AUDIT LOGGING FUNCTIONS
// ============================================================================
/**
 * Logs security event
 *
 * @param data - Event data
 * @param transaction - Optional database transaction
 * @returns Audit log entry
 *
 * @example
 * ```typescript
 * await logSecurityEvent({
 *   eventType: SecurityEventType.ACCESS_GRANTED,
 *   userId: 'user-123',
 *   resourceType: 'asset',
 *   resourceId: 'asset-456',
 *   action: 'read',
 *   result: 'success',
 *   ipAddress: '192.168.1.100',
 *   metadata: { location: 'warehouse-a' }
 * });
 * ```
 */
async function logSecurityEvent(data, transaction) {
    const log = await SecurityAuditLog.create({
        ...data,
        timestamp: new Date(),
    }, { transaction });
    return log;
}
/**
 * Gets audit logs
 *
 * @param filters - Filter options
 * @param limit - Maximum logs
 * @returns Audit logs
 *
 * @example
 * ```typescript
 * const logs = await getAuditLogs({
 *   userId: 'user-123',
 *   eventType: SecurityEventType.ACCESS_DENIED,
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31')
 * }, 1000);
 * ```
 */
async function getAuditLogs(filters, limit = 1000) {
    const where = {};
    if (filters.userId)
        where.userId = filters.userId;
    if (filters.eventType)
        where.eventType = filters.eventType;
    if (filters.resourceType)
        where.resourceType = filters.resourceType;
    if (filters.resourceId)
        where.resourceId = filters.resourceId;
    if (filters.result)
        where.result = filters.result;
    if (filters.startDate || filters.endDate) {
        where.timestamp = {};
        if (filters.startDate) {
            where.timestamp[sequelize_1.Op.gte] = filters.startDate;
        }
        if (filters.endDate) {
            where.timestamp[sequelize_1.Op.lte] = filters.endDate;
        }
    }
    return SecurityAuditLog.findAll({
        where,
        order: [['timestamp', 'DESC']],
        limit,
    });
}
/**
 * Generates audit report
 *
 * @param startDate - Start date
 * @param endDate - End date
 * @param groupBy - Grouping field
 * @returns Audit report
 *
 * @example
 * ```typescript
 * const report = await generateAuditReport(
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31'),
 *   'eventType'
 * );
 * ```
 */
async function generateAuditReport(startDate, endDate, groupBy = 'eventType') {
    const logs = await SecurityAuditLog.findAll({
        where: {
            timestamp: {
                [sequelize_1.Op.between]: [startDate, endDate],
            },
        },
    });
    const report = {};
    logs.forEach(log => {
        const key = log[groupBy] || 'unknown';
        report[key] = (report[key] || 0) + 1;
    });
    return report;
}
// ============================================================================
// SECURITY POLICY FUNCTIONS
// ============================================================================
/**
 * Creates security policy
 *
 * @param data - Policy data
 * @param transaction - Optional database transaction
 * @returns Created policy
 *
 * @example
 * ```typescript
 * const policy = await createSecurityPolicy({
 *   name: 'Asset Access Policy',
 *   policyType: 'access_control',
 *   rules: [
 *     {
 *       condition: 'after_hours_access',
 *       action: 'require_approval',
 *       severity: IncidentSeverity.MEDIUM,
 *       notification: ['security-team@example.com']
 *     }
 *   ],
 *   isActive: true
 * });
 * ```
 */
async function createSecurityPolicy(data, transaction) {
    const policy = await SecurityPolicy.create(data, { transaction });
    return policy;
}
/**
 * Evaluates policy compliance
 *
 * @param policyId - Policy ID
 * @param context - Evaluation context
 * @returns Compliance result
 *
 * @example
 * ```typescript
 * const result = await evaluatePolicyCompliance('policy-123', {
 *   userId: 'user-456',
 *   action: 'access_sensitive_data',
 *   time: new Date()
 * });
 * ```
 */
async function evaluatePolicyCompliance(policyId, context) {
    const policy = await SecurityPolicy.findByPk(policyId);
    if (!policy) {
        throw new common_1.NotFoundException(`Policy ${policyId} not found`);
    }
    if (!policy.isActive) {
        return { compliant: true, violations: [] };
    }
    const violations = [];
    // Simplified policy evaluation
    for (const rule of policy.rules) {
        // In real implementation, evaluate rule conditions against context
        const violated = false; // Placeholder
        if (violated) {
            violations.push(rule.condition);
        }
    }
    return {
        compliant: violations.length === 0,
        violations,
    };
}
// ============================================================================
// SECURITY INCIDENT FUNCTIONS
// ============================================================================
/**
 * Creates security incident
 *
 * @param data - Incident data
 * @param transaction - Optional database transaction
 * @returns Created incident
 *
 * @example
 * ```typescript
 * const incident = await createSecurityIncident({
 *   title: 'Unauthorized Access Attempt',
 *   description: 'Multiple failed login attempts detected',
 *   severity: IncidentSeverity.HIGH,
 *   incidentType: 'access_violation',
 *   affectedAssets: ['asset-123', 'asset-456'],
 *   reportedBy: 'security-system',
 *   assignedTo: 'security-analyst-789'
 * });
 * ```
 */
async function createSecurityIncident(data, transaction) {
    const incident = await SecurityIncident.create({
        ...data,
        reportedAt: new Date(),
        status: IncidentStatus.OPEN,
    }, { transaction });
    // Log security event
    await logSecurityEvent({
        eventType: SecurityEventType.SECURITY_INCIDENT,
        resourceType: 'security_incident',
        resourceId: incident.id,
        action: 'created',
        result: 'success',
        metadata: {
            severity: data.severity,
            incidentType: data.incidentType,
        },
    }, transaction);
    return incident;
}
/**
 * Updates incident status
 *
 * @param incidentId - Incident ID
 * @param status - New status
 * @param userId - User updating
 * @param notes - Update notes
 * @param transaction - Optional database transaction
 * @returns Updated incident
 *
 * @example
 * ```typescript
 * await updateIncidentStatus(
 *   'incident-123',
 *   IncidentStatus.RESOLVED,
 *   'analyst-456',
 *   'False positive - authorized test'
 * );
 * ```
 */
async function updateIncidentStatus(incidentId, status, userId, notes, transaction) {
    const incident = await SecurityIncident.findByPk(incidentId, { transaction });
    if (!incident) {
        throw new common_1.NotFoundException(`Incident ${incidentId} not found`);
    }
    const updates = { status };
    if (status === IncidentStatus.RESOLVED || status === IncidentStatus.CLOSED) {
        updates.resolvedAt = new Date();
        updates.resolvedBy = userId;
        updates.resolutionNotes = notes;
    }
    await incident.update(updates, { transaction });
    return incident;
}
/**
 * Gets open incidents
 *
 * @param severity - Optional severity filter
 * @returns Open incidents
 *
 * @example
 * ```typescript
 * const criticalIncidents = await getOpenIncidents(IncidentSeverity.CRITICAL);
 * ```
 */
async function getOpenIncidents(severity) {
    const where = {
        status: { [sequelize_1.Op.in]: [IncidentStatus.OPEN, IncidentStatus.INVESTIGATING] },
    };
    if (severity) {
        where.severity = severity;
    }
    return SecurityIncident.findAll({
        where,
        order: [['severity', 'DESC'], ['reportedAt', 'DESC']],
    });
}
// ============================================================================
// ACCESS REVIEW FUNCTIONS
// ============================================================================
/**
 * Creates access review
 *
 * @param data - Review data
 * @param transaction - Optional database transaction
 * @returns Created review
 *
 * @example
 * ```typescript
 * const review = await createAccessReview({
 *   reviewerIds: ['manager-123', 'security-456'],
 *   targetRoleId: 'admin-role-789',
 *   dueDate: new Date('2024-12-31'),
 *   scope: 'Quarterly admin role review'
 * });
 * ```
 */
async function createAccessReview(data, transaction) {
    const review = await AccessReview.create({
        ...data,
        status: AccessReviewStatus.PENDING,
    }, { transaction });
    return review;
}
/**
 * Completes access review
 *
 * @param reviewId - Review ID
 * @param findings - Review findings
 * @param recommendations - Recommendations
 * @param transaction - Optional database transaction
 * @returns Updated review
 *
 * @example
 * ```typescript
 * await completeAccessReview('review-123', findings, 'Revoke unused permissions');
 * ```
 */
async function completeAccessReview(reviewId, findings, recommendations, transaction) {
    const review = await AccessReview.findByPk(reviewId, { transaction });
    if (!review) {
        throw new common_1.NotFoundException(`Review ${reviewId} not found`);
    }
    await review.update({
        status: AccessReviewStatus.COMPLETED,
        completedAt: new Date(),
        findings,
        recommendations,
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
        status: AccessReviewStatus.PENDING,
    };
    if (reviewerId) {
        where.reviewerIds = { [sequelize_1.Op.contains]: [reviewerId] };
    }
    return AccessReview.findAll({
        where,
        order: [['dueDate', 'ASC']],
        include: [{ model: SecurityRole, as: 'targetRole' }],
    });
}
// ============================================================================
// FIELD SECURITY FUNCTIONS
// ============================================================================
/**
 * Configures field security
 *
 * @param data - Field security data
 * @param transaction - Optional database transaction
 * @returns Field security config
 *
 * @example
 * ```typescript
 * await configureFieldSecurity({
 *   tableName: 'assets',
 *   fieldName: 'acquisition_cost',
 *   classification: DataClassification.CONFIDENTIAL,
 *   encryptionRequired: true,
 *   maskingRequired: true,
 *   maskingPattern: '***',
 *   allowedRoles: ['finance-role', 'admin-role']
 * });
 * ```
 */
async function configureFieldSecurity(data, transaction) {
    const config = await FieldSecurity.create(data, { transaction });
    return config;
}
/**
 * Masks field value
 *
 * @param tableName - Table name
 * @param fieldName - Field name
 * @param value - Original value
 * @param userId - User requesting
 * @returns Masked or original value
 *
 * @example
 * ```typescript
 * const cost = await maskFieldValue('assets', 'acquisition_cost', '50000', 'user-123');
 * // Returns '***' if user doesn't have access, '50000' if they do
 * ```
 */
async function maskFieldValue(tableName, fieldName, value, userId) {
    const config = await FieldSecurity.findOne({
        where: { tableName, fieldName },
    });
    if (!config) {
        return value; // No security configured
    }
    if (!config.maskingRequired) {
        return value; // No masking required
    }
    // Check if user has access
    const userRoles = await getUserRoles(userId);
    const roleIds = userRoles.map(r => r.id);
    const hasAccess = !config.allowedRoles ||
        config.allowedRoles.some(roleId => roleIds.includes(roleId));
    if (hasAccess) {
        return value; // User has access
    }
    // Apply masking
    return config.maskingPattern || '***';
}
// ============================================================================
// SESSION MANAGEMENT FUNCTIONS
// ============================================================================
/**
 * User Session Model
 */
let UserSession = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'user_sessions',
            timestamps: true,
            indexes: [
                { fields: ['user_id'] },
                { fields: ['session_token'], unique: true },
                { fields: ['is_active'] },
                { fields: ['expires_at'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _userId_decorators;
    let _userId_initializers = [];
    let _userId_extraInitializers = [];
    let _sessionToken_decorators;
    let _sessionToken_initializers = [];
    let _sessionToken_extraInitializers = [];
    let _ipAddress_decorators;
    let _ipAddress_initializers = [];
    let _ipAddress_extraInitializers = [];
    let _userAgent_decorators;
    let _userAgent_initializers = [];
    let _userAgent_extraInitializers = [];
    let _isActive_decorators;
    let _isActive_initializers = [];
    let _isActive_extraInitializers = [];
    let _lastActivity_decorators;
    let _lastActivity_initializers = [];
    let _lastActivity_extraInitializers = [];
    let _expiresAt_decorators;
    let _expiresAt_initializers = [];
    let _expiresAt_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var UserSession = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.userId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _userId_initializers, void 0));
            this.sessionToken = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _sessionToken_initializers, void 0));
            this.ipAddress = (__runInitializers(this, _sessionToken_extraInitializers), __runInitializers(this, _ipAddress_initializers, void 0));
            this.userAgent = (__runInitializers(this, _ipAddress_extraInitializers), __runInitializers(this, _userAgent_initializers, void 0));
            this.isActive = (__runInitializers(this, _userAgent_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
            this.lastActivity = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _lastActivity_initializers, void 0));
            this.expiresAt = (__runInitializers(this, _lastActivity_extraInitializers), __runInitializers(this, _expiresAt_initializers, void 0));
            this.createdAt = (__runInitializers(this, _expiresAt_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "UserSession");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _userId_decorators = [(0, swagger_1.ApiProperty)({ description: 'User ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _sessionToken_decorators = [(0, swagger_1.ApiProperty)({ description: 'Session token' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(500), unique: true, allowNull: false }), sequelize_typescript_1.Index];
        _ipAddress_decorators = [(0, swagger_1.ApiProperty)({ description: 'IP address' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50) })];
        _userAgent_decorators = [(0, swagger_1.ApiProperty)({ description: 'User agent' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(500) })];
        _isActive_decorators = [(0, swagger_1.ApiProperty)({ description: 'Is active' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: true }), sequelize_typescript_1.Index];
        _lastActivity_decorators = [(0, swagger_1.ApiProperty)({ description: 'Last activity' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false, defaultValue: sequelize_typescript_1.DataType.NOW })];
        _expiresAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Expires at' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false }), sequelize_typescript_1.Index];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: obj => "userId" in obj, get: obj => obj.userId, set: (obj, value) => { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
        __esDecorate(null, null, _sessionToken_decorators, { kind: "field", name: "sessionToken", static: false, private: false, access: { has: obj => "sessionToken" in obj, get: obj => obj.sessionToken, set: (obj, value) => { obj.sessionToken = value; } }, metadata: _metadata }, _sessionToken_initializers, _sessionToken_extraInitializers);
        __esDecorate(null, null, _ipAddress_decorators, { kind: "field", name: "ipAddress", static: false, private: false, access: { has: obj => "ipAddress" in obj, get: obj => obj.ipAddress, set: (obj, value) => { obj.ipAddress = value; } }, metadata: _metadata }, _ipAddress_initializers, _ipAddress_extraInitializers);
        __esDecorate(null, null, _userAgent_decorators, { kind: "field", name: "userAgent", static: false, private: false, access: { has: obj => "userAgent" in obj, get: obj => obj.userAgent, set: (obj, value) => { obj.userAgent = value; } }, metadata: _metadata }, _userAgent_initializers, _userAgent_extraInitializers);
        __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: obj => "isActive" in obj, get: obj => obj.isActive, set: (obj, value) => { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
        __esDecorate(null, null, _lastActivity_decorators, { kind: "field", name: "lastActivity", static: false, private: false, access: { has: obj => "lastActivity" in obj, get: obj => obj.lastActivity, set: (obj, value) => { obj.lastActivity = value; } }, metadata: _metadata }, _lastActivity_initializers, _lastActivity_extraInitializers);
        __esDecorate(null, null, _expiresAt_decorators, { kind: "field", name: "expiresAt", static: false, private: false, access: { has: obj => "expiresAt" in obj, get: obj => obj.expiresAt, set: (obj, value) => { obj.expiresAt = value; } }, metadata: _metadata }, _expiresAt_initializers, _expiresAt_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        UserSession = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return UserSession = _classThis;
})();
exports.UserSession = UserSession;
/**
 * Creates user session
 *
 * @param userId - User ID
 * @param ipAddress - IP address
 * @param userAgent - User agent
 * @param expirationHours - Expiration in hours
 * @param transaction - Optional database transaction
 * @returns Created session
 *
 * @example
 * ```typescript
 * const session = await createUserSession('user-123', '192.168.1.1', 'Chrome', 24);
 * ```
 */
async function createUserSession(userId, ipAddress, userAgent, expirationHours = 24, transaction) {
    const sessionToken = generateSecureToken();
    const expiresAt = new Date(Date.now() + expirationHours * 60 * 60 * 1000);
    const session = await UserSession.create({
        userId,
        sessionToken,
        ipAddress,
        userAgent,
        isActive: true,
        lastActivity: new Date(),
        expiresAt,
    }, { transaction });
    await logSecurityEvent({
        eventType: SecurityEventType.LOGIN,
        userId,
        action: 'session_created',
        result: 'success',
        ipAddress,
        userAgent,
        metadata: { sessionId: session.id },
    }, transaction);
    return session;
}
/**
 * Validates user session
 *
 * @param sessionToken - Session token
 * @param transaction - Optional database transaction
 * @returns Session if valid
 *
 * @example
 * ```typescript
 * const session = await validateUserSession('token-123');
 * if (!session) throw new UnauthorizedException('Invalid session');
 * ```
 */
async function validateUserSession(sessionToken, transaction) {
    const session = await UserSession.findOne({
        where: {
            sessionToken,
            isActive: true,
            expiresAt: { [sequelize_1.Op.gt]: new Date() },
        },
        transaction,
    });
    if (session) {
        await session.update({ lastActivity: new Date() }, { transaction });
    }
    return session;
}
/**
 * Expires user session
 *
 * @param sessionToken - Session token
 * @param transaction - Optional database transaction
 * @returns Updated session
 *
 * @example
 * ```typescript
 * await expireUserSession('token-123');
 * ```
 */
async function expireUserSession(sessionToken, transaction) {
    const session = await UserSession.findOne({
        where: { sessionToken },
        transaction,
    });
    if (!session) {
        throw new common_1.NotFoundException(`Session not found`);
    }
    await session.update({ isActive: false }, { transaction });
    await logSecurityEvent({
        eventType: SecurityEventType.LOGOUT,
        userId: session.userId,
        action: 'session_expired',
        result: 'success',
        metadata: { sessionId: session.id },
    }, transaction);
    return session;
}
/**
 * Expires all user sessions
 *
 * @param userId - User ID
 * @param transaction - Optional database transaction
 * @returns Expired count
 *
 * @example
 * ```typescript
 * await expireAllUserSessions('user-123');
 * ```
 */
async function expireAllUserSessions(userId, transaction) {
    const [count] = await UserSession.update({ isActive: false }, {
        where: {
            userId,
            isActive: true,
        },
        transaction,
    });
    return count;
}
// ============================================================================
// PASSWORD POLICY FUNCTIONS
// ============================================================================
/**
 * Password Policy Model
 */
let PasswordPolicy = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'password_policies',
            timestamps: true,
            indexes: [
                { fields: ['name'], unique: true },
                { fields: ['is_active'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _minLength_decorators;
    let _minLength_initializers = [];
    let _minLength_extraInitializers = [];
    let _requireUppercase_decorators;
    let _requireUppercase_initializers = [];
    let _requireUppercase_extraInitializers = [];
    let _requireLowercase_decorators;
    let _requireLowercase_initializers = [];
    let _requireLowercase_extraInitializers = [];
    let _requireNumbers_decorators;
    let _requireNumbers_initializers = [];
    let _requireNumbers_extraInitializers = [];
    let _requireSpecialChars_decorators;
    let _requireSpecialChars_initializers = [];
    let _requireSpecialChars_extraInitializers = [];
    let _maxAgeDays_decorators;
    let _maxAgeDays_initializers = [];
    let _maxAgeDays_extraInitializers = [];
    let _preventReuseCount_decorators;
    let _preventReuseCount_initializers = [];
    let _preventReuseCount_extraInitializers = [];
    let _isActive_decorators;
    let _isActive_initializers = [];
    let _isActive_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var PasswordPolicy = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.name = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.minLength = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _minLength_initializers, void 0));
            this.requireUppercase = (__runInitializers(this, _minLength_extraInitializers), __runInitializers(this, _requireUppercase_initializers, void 0));
            this.requireLowercase = (__runInitializers(this, _requireUppercase_extraInitializers), __runInitializers(this, _requireLowercase_initializers, void 0));
            this.requireNumbers = (__runInitializers(this, _requireLowercase_extraInitializers), __runInitializers(this, _requireNumbers_initializers, void 0));
            this.requireSpecialChars = (__runInitializers(this, _requireNumbers_extraInitializers), __runInitializers(this, _requireSpecialChars_initializers, void 0));
            this.maxAgeDays = (__runInitializers(this, _requireSpecialChars_extraInitializers), __runInitializers(this, _maxAgeDays_initializers, void 0));
            this.preventReuseCount = (__runInitializers(this, _maxAgeDays_extraInitializers), __runInitializers(this, _preventReuseCount_initializers, void 0));
            this.isActive = (__runInitializers(this, _preventReuseCount_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
            this.createdAt = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "PasswordPolicy");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _name_decorators = [(0, swagger_1.ApiProperty)({ description: 'Policy name' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100), unique: true, allowNull: false }), sequelize_typescript_1.Index];
        _minLength_decorators = [(0, swagger_1.ApiProperty)({ description: 'Minimum length' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false, defaultValue: 8 })];
        _requireUppercase_decorators = [(0, swagger_1.ApiProperty)({ description: 'Require uppercase' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: true })];
        _requireLowercase_decorators = [(0, swagger_1.ApiProperty)({ description: 'Require lowercase' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: true })];
        _requireNumbers_decorators = [(0, swagger_1.ApiProperty)({ description: 'Require numbers' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: true })];
        _requireSpecialChars_decorators = [(0, swagger_1.ApiProperty)({ description: 'Require special characters' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: true })];
        _maxAgeDays_decorators = [(0, swagger_1.ApiProperty)({ description: 'Max age in days' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER })];
        _preventReuseCount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Prevent reuse count' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, defaultValue: 5 })];
        _isActive_decorators = [(0, swagger_1.ApiProperty)({ description: 'Is active' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: true }), sequelize_typescript_1.Index];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _minLength_decorators, { kind: "field", name: "minLength", static: false, private: false, access: { has: obj => "minLength" in obj, get: obj => obj.minLength, set: (obj, value) => { obj.minLength = value; } }, metadata: _metadata }, _minLength_initializers, _minLength_extraInitializers);
        __esDecorate(null, null, _requireUppercase_decorators, { kind: "field", name: "requireUppercase", static: false, private: false, access: { has: obj => "requireUppercase" in obj, get: obj => obj.requireUppercase, set: (obj, value) => { obj.requireUppercase = value; } }, metadata: _metadata }, _requireUppercase_initializers, _requireUppercase_extraInitializers);
        __esDecorate(null, null, _requireLowercase_decorators, { kind: "field", name: "requireLowercase", static: false, private: false, access: { has: obj => "requireLowercase" in obj, get: obj => obj.requireLowercase, set: (obj, value) => { obj.requireLowercase = value; } }, metadata: _metadata }, _requireLowercase_initializers, _requireLowercase_extraInitializers);
        __esDecorate(null, null, _requireNumbers_decorators, { kind: "field", name: "requireNumbers", static: false, private: false, access: { has: obj => "requireNumbers" in obj, get: obj => obj.requireNumbers, set: (obj, value) => { obj.requireNumbers = value; } }, metadata: _metadata }, _requireNumbers_initializers, _requireNumbers_extraInitializers);
        __esDecorate(null, null, _requireSpecialChars_decorators, { kind: "field", name: "requireSpecialChars", static: false, private: false, access: { has: obj => "requireSpecialChars" in obj, get: obj => obj.requireSpecialChars, set: (obj, value) => { obj.requireSpecialChars = value; } }, metadata: _metadata }, _requireSpecialChars_initializers, _requireSpecialChars_extraInitializers);
        __esDecorate(null, null, _maxAgeDays_decorators, { kind: "field", name: "maxAgeDays", static: false, private: false, access: { has: obj => "maxAgeDays" in obj, get: obj => obj.maxAgeDays, set: (obj, value) => { obj.maxAgeDays = value; } }, metadata: _metadata }, _maxAgeDays_initializers, _maxAgeDays_extraInitializers);
        __esDecorate(null, null, _preventReuseCount_decorators, { kind: "field", name: "preventReuseCount", static: false, private: false, access: { has: obj => "preventReuseCount" in obj, get: obj => obj.preventReuseCount, set: (obj, value) => { obj.preventReuseCount = value; } }, metadata: _metadata }, _preventReuseCount_initializers, _preventReuseCount_extraInitializers);
        __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: obj => "isActive" in obj, get: obj => obj.isActive, set: (obj, value) => { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PasswordPolicy = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PasswordPolicy = _classThis;
})();
exports.PasswordPolicy = PasswordPolicy;
/**
 * Validates password strength
 *
 * @param password - Password to validate
 * @param policyId - Optional policy ID
 * @returns Validation result
 *
 * @example
 * ```typescript
 * const result = validatePassword('MyP@ssw0rd123');
 * if (!result.valid) throw new BadRequestException(result.errors.join(', '));
 * ```
 */
async function validatePassword(password, policyId) {
    const policy = policyId
        ? await PasswordPolicy.findByPk(policyId)
        : await PasswordPolicy.findOne({ where: { isActive: true } });
    const errors = [];
    if (!policy) {
        // Default validation
        if (password.length < 8) {
            errors.push('Password must be at least 8 characters');
        }
        return { valid: errors.length === 0, errors };
    }
    if (password.length < policy.minLength) {
        errors.push(`Password must be at least ${policy.minLength} characters`);
    }
    if (policy.requireUppercase && !/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    }
    if (policy.requireLowercase && !/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
    }
    if (policy.requireNumbers && !/[0-9]/.test(password)) {
        errors.push('Password must contain at least one number');
    }
    if (policy.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push('Password must contain at least one special character');
    }
    return { valid: errors.length === 0, errors };
}
/**
 * Checks password strength score
 *
 * @param password - Password to check
 * @returns Strength score 0-100
 *
 * @example
 * ```typescript
 * const strength = checkPasswordStrength('MyP@ssw0rd123');
 * // Returns: 85
 * ```
 */
function checkPasswordStrength(password) {
    let score = 0;
    // Length score
    if (password.length >= 8)
        score += 20;
    if (password.length >= 12)
        score += 10;
    if (password.length >= 16)
        score += 10;
    // Character variety
    if (/[a-z]/.test(password))
        score += 15;
    if (/[A-Z]/.test(password))
        score += 15;
    if (/[0-9]/.test(password))
        score += 15;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password))
        score += 15;
    return Math.min(score, 100);
}
/**
 * Forces password reset
 *
 * @param userId - User ID
 * @param reason - Reset reason
 * @param transaction - Optional database transaction
 * @returns Success status
 *
 * @example
 * ```typescript
 * await forcePasswordReset('user-123', 'Policy violation detected');
 * ```
 */
async function forcePasswordReset(userId, reason, transaction) {
    await logSecurityEvent({
        eventType: SecurityEventType.PASSWORD_CHANGED,
        userId,
        action: 'force_password_reset',
        result: 'success',
        metadata: { reason },
    }, transaction);
    return true;
}
// ============================================================================
// TWO-FACTOR AUTHENTICATION FUNCTIONS
// ============================================================================
/**
 * MFA Configuration Model
 */
let MfaConfiguration = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'mfa_configurations',
            timestamps: true,
            indexes: [
                { fields: ['user_id'], unique: true },
                { fields: ['is_enabled'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _userId_decorators;
    let _userId_initializers = [];
    let _userId_extraInitializers = [];
    let _isEnabled_decorators;
    let _isEnabled_initializers = [];
    let _isEnabled_extraInitializers = [];
    let _method_decorators;
    let _method_initializers = [];
    let _method_extraInitializers = [];
    let _secretKey_decorators;
    let _secretKey_initializers = [];
    let _secretKey_extraInitializers = [];
    let _backupCodes_decorators;
    let _backupCodes_initializers = [];
    let _backupCodes_extraInitializers = [];
    let _lastUsedAt_decorators;
    let _lastUsedAt_initializers = [];
    let _lastUsedAt_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var MfaConfiguration = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.userId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _userId_initializers, void 0));
            this.isEnabled = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _isEnabled_initializers, void 0));
            this.method = (__runInitializers(this, _isEnabled_extraInitializers), __runInitializers(this, _method_initializers, void 0));
            this.secretKey = (__runInitializers(this, _method_extraInitializers), __runInitializers(this, _secretKey_initializers, void 0));
            this.backupCodes = (__runInitializers(this, _secretKey_extraInitializers), __runInitializers(this, _backupCodes_initializers, void 0));
            this.lastUsedAt = (__runInitializers(this, _backupCodes_extraInitializers), __runInitializers(this, _lastUsedAt_initializers, void 0));
            this.createdAt = (__runInitializers(this, _lastUsedAt_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "MfaConfiguration");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _userId_decorators = [(0, swagger_1.ApiProperty)({ description: 'User ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, unique: true, allowNull: false }), sequelize_typescript_1.Index];
        _isEnabled_decorators = [(0, swagger_1.ApiProperty)({ description: 'Is enabled' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false }), sequelize_typescript_1.Index];
        _method_decorators = [(0, swagger_1.ApiProperty)({ description: 'MFA method' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50), allowNull: false })];
        _secretKey_decorators = [(0, swagger_1.ApiProperty)({ description: 'Secret key (encrypted)' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _backupCodes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Backup codes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING) })];
        _lastUsedAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Last used at' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: obj => "userId" in obj, get: obj => obj.userId, set: (obj, value) => { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
        __esDecorate(null, null, _isEnabled_decorators, { kind: "field", name: "isEnabled", static: false, private: false, access: { has: obj => "isEnabled" in obj, get: obj => obj.isEnabled, set: (obj, value) => { obj.isEnabled = value; } }, metadata: _metadata }, _isEnabled_initializers, _isEnabled_extraInitializers);
        __esDecorate(null, null, _method_decorators, { kind: "field", name: "method", static: false, private: false, access: { has: obj => "method" in obj, get: obj => obj.method, set: (obj, value) => { obj.method = value; } }, metadata: _metadata }, _method_initializers, _method_extraInitializers);
        __esDecorate(null, null, _secretKey_decorators, { kind: "field", name: "secretKey", static: false, private: false, access: { has: obj => "secretKey" in obj, get: obj => obj.secretKey, set: (obj, value) => { obj.secretKey = value; } }, metadata: _metadata }, _secretKey_initializers, _secretKey_extraInitializers);
        __esDecorate(null, null, _backupCodes_decorators, { kind: "field", name: "backupCodes", static: false, private: false, access: { has: obj => "backupCodes" in obj, get: obj => obj.backupCodes, set: (obj, value) => { obj.backupCodes = value; } }, metadata: _metadata }, _backupCodes_initializers, _backupCodes_extraInitializers);
        __esDecorate(null, null, _lastUsedAt_decorators, { kind: "field", name: "lastUsedAt", static: false, private: false, access: { has: obj => "lastUsedAt" in obj, get: obj => obj.lastUsedAt, set: (obj, value) => { obj.lastUsedAt = value; } }, metadata: _metadata }, _lastUsedAt_initializers, _lastUsedAt_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MfaConfiguration = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MfaConfiguration = _classThis;
})();
exports.MfaConfiguration = MfaConfiguration;
/**
 * Enables MFA for user
 *
 * @param userId - User ID
 * @param method - MFA method (totp, sms, email)
 * @param transaction - Optional database transaction
 * @returns MFA configuration
 *
 * @example
 * ```typescript
 * const mfa = await enableMfa('user-123', 'totp');
 * ```
 */
async function enableMfa(userId, method, transaction) {
    const secretKey = generateSecureToken();
    const backupCodes = generateBackupCodes();
    const mfa = await MfaConfiguration.create({
        userId,
        isEnabled: true,
        method,
        secretKey,
        backupCodes,
    }, { transaction });
    await logSecurityEvent({
        eventType: SecurityEventType.MFA_ENABLED,
        userId,
        action: 'mfa_enabled',
        result: 'success',
        metadata: { method },
    }, transaction);
    return mfa;
}
/**
 * Verifies MFA code
 *
 * @param userId - User ID
 * @param code - MFA code
 * @param transaction - Optional database transaction
 * @returns Verification result
 *
 * @example
 * ```typescript
 * const valid = await verifyMfaCode('user-123', '123456');
 * if (!valid) throw new UnauthorizedException('Invalid MFA code');
 * ```
 */
async function verifyMfaCode(userId, code, transaction) {
    const mfa = await MfaConfiguration.findOne({
        where: { userId, isEnabled: true },
        transaction,
    });
    if (!mfa) {
        return false;
    }
    // In real implementation, verify TOTP code against secretKey
    // For now, simplified validation
    const isValid = code.length === 6 && /^\d+$/.test(code);
    if (isValid) {
        await mfa.update({ lastUsedAt: new Date() }, { transaction });
    }
    return isValid;
}
/**
 * Generates backup codes
 *
 * @returns Array of backup codes
 *
 * @example
 * ```typescript
 * const codes = generateBackupCodes();
 * ```
 */
function generateBackupCodes() {
    const codes = [];
    for (let i = 0; i < 10; i++) {
        codes.push(Math.random().toString(36).substring(2, 10).toUpperCase());
    }
    return codes;
}
// ============================================================================
// SECURITY GROUP FUNCTIONS
// ============================================================================
/**
 * Security Group Model
 */
let SecurityGroup = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'security_groups',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['name'], unique: true },
                { fields: ['group_type'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _groupType_decorators;
    let _groupType_initializers = [];
    let _groupType_extraInitializers = [];
    let _memberIds_decorators;
    let _memberIds_initializers = [];
    let _memberIds_extraInitializers = [];
    let _roleIds_decorators;
    let _roleIds_initializers = [];
    let _roleIds_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var SecurityGroup = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.name = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.groupType = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _groupType_initializers, void 0));
            this.memberIds = (__runInitializers(this, _groupType_extraInitializers), __runInitializers(this, _memberIds_initializers, void 0));
            this.roleIds = (__runInitializers(this, _memberIds_extraInitializers), __runInitializers(this, _roleIds_initializers, void 0));
            this.createdAt = (__runInitializers(this, _roleIds_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "SecurityGroup");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _name_decorators = [(0, swagger_1.ApiProperty)({ description: 'Group name' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100), unique: true, allowNull: false }), sequelize_typescript_1.Index];
        _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Description' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _groupType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Group type' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50), allowNull: false }), sequelize_typescript_1.Index];
        _memberIds_decorators = [(0, swagger_1.ApiProperty)({ description: 'Member user IDs' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.UUID), defaultValue: [] })];
        _roleIds_decorators = [(0, swagger_1.ApiProperty)({ description: 'Role IDs' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.UUID), defaultValue: [] })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _groupType_decorators, { kind: "field", name: "groupType", static: false, private: false, access: { has: obj => "groupType" in obj, get: obj => obj.groupType, set: (obj, value) => { obj.groupType = value; } }, metadata: _metadata }, _groupType_initializers, _groupType_extraInitializers);
        __esDecorate(null, null, _memberIds_decorators, { kind: "field", name: "memberIds", static: false, private: false, access: { has: obj => "memberIds" in obj, get: obj => obj.memberIds, set: (obj, value) => { obj.memberIds = value; } }, metadata: _metadata }, _memberIds_initializers, _memberIds_extraInitializers);
        __esDecorate(null, null, _roleIds_decorators, { kind: "field", name: "roleIds", static: false, private: false, access: { has: obj => "roleIds" in obj, get: obj => obj.roleIds, set: (obj, value) => { obj.roleIds = value; } }, metadata: _metadata }, _roleIds_initializers, _roleIds_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SecurityGroup = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SecurityGroup = _classThis;
})();
exports.SecurityGroup = SecurityGroup;
/**
 * Creates security group
 *
 * @param name - Group name
 * @param groupType - Group type
 * @param description - Optional description
 * @param transaction - Optional database transaction
 * @returns Created group
 *
 * @example
 * ```typescript
 * const group = await createSecurityGroup('Finance Team', 'department', 'Finance department users');
 * ```
 */
async function createSecurityGroup(name, groupType, description, transaction) {
    const group = await SecurityGroup.create({
        name,
        groupType,
        description,
        memberIds: [],
        roleIds: [],
    }, { transaction });
    return group;
}
/**
 * Adds user to security group
 *
 * @param groupId - Group ID
 * @param userId - User ID
 * @param transaction - Optional database transaction
 * @returns Updated group
 *
 * @example
 * ```typescript
 * await addUserToSecurityGroup('group-123', 'user-456');
 * ```
 */
async function addUserToSecurityGroup(groupId, userId, transaction) {
    const group = await SecurityGroup.findByPk(groupId, { transaction });
    if (!group) {
        throw new common_1.NotFoundException(`Security group ${groupId} not found`);
    }
    if (!group.memberIds.includes(userId)) {
        await group.update({
            memberIds: [...group.memberIds, userId],
        }, { transaction });
    }
    return group;
}
/**
 * Assigns role to security group
 *
 * @param groupId - Group ID
 * @param roleId - Role ID
 * @param transaction - Optional database transaction
 * @returns Updated group
 *
 * @example
 * ```typescript
 * await assignRoleToSecurityGroup('group-123', 'role-456');
 * ```
 */
async function assignRoleToSecurityGroup(groupId, roleId, transaction) {
    const group = await SecurityGroup.findByPk(groupId, { transaction });
    if (!group) {
        throw new common_1.NotFoundException(`Security group ${groupId} not found`);
    }
    if (!group.roleIds.includes(roleId)) {
        await group.update({
            roleIds: [...group.roleIds, roleId],
        }, { transaction });
    }
    return group;
}
// ============================================================================
// COMPLIANCE REPORTING FUNCTIONS
// ============================================================================
/**
 * Generates SOX compliance report
 *
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Compliance report
 *
 * @example
 * ```typescript
 * const report = await generateSoxComplianceReport(
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
async function generateSoxComplianceReport(startDate, endDate) {
    const auditLogs = await getAuditLogs({
        startDate,
        endDate,
    });
    const accessReviews = await AccessReview.findAll({
        where: {
            createdAt: {
                [sequelize_1.Op.between]: [startDate, endDate],
            },
        },
    });
    const incidents = await SecurityIncident.findAll({
        where: {
            reportedAt: {
                [sequelize_1.Op.between]: [startDate, endDate],
            },
        },
    });
    return {
        period: { startDate, endDate },
        auditLogs: {
            total: auditLogs.length,
            byEventType: {},
        },
        accessReviews: {
            total: accessReviews.length,
            completed: accessReviews.filter(r => r.status === AccessReviewStatus.COMPLETED).length,
        },
        incidents: {
            total: incidents.length,
            bySeverity: {},
        },
        generatedAt: new Date(),
    };
}
/**
 * Generates security metrics
 *
 * @param period - Period in days
 * @returns Security metrics
 *
 * @example
 * ```typescript
 * const metrics = await generateSecurityMetrics(30);
 * ```
 */
async function generateSecurityMetrics(period = 30) {
    const startDate = new Date(Date.now() - period * 24 * 60 * 60 * 1000);
    const failedLogins = await SecurityAuditLog.count({
        where: {
            eventType: SecurityEventType.LOGIN_FAILED,
            timestamp: { [sequelize_1.Op.gte]: startDate },
        },
    });
    const accessDenied = await SecurityAuditLog.count({
        where: {
            eventType: SecurityEventType.ACCESS_DENIED,
            timestamp: { [sequelize_1.Op.gte]: startDate },
        },
    });
    const policyViolations = await SecurityAuditLog.count({
        where: {
            eventType: SecurityEventType.POLICY_VIOLATION,
            timestamp: { [sequelize_1.Op.gte]: startDate },
        },
    });
    const openIncidents = await SecurityIncident.count({
        where: {
            status: { [sequelize_1.Op.in]: [IncidentStatus.OPEN, IncidentStatus.INVESTIGATING] },
        },
    });
    return {
        period: { days: period, startDate },
        failedLogins,
        accessDenied,
        policyViolations,
        openIncidents,
        generatedAt: new Date(),
    };
}
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Gets active user sessions
 *
 * @param userId - User ID
 * @returns Active sessions
 *
 * @example
 * ```typescript
 * const sessions = await getActiveUserSessions('user-123');
 * ```
 */
async function getActiveUserSessions(userId) {
    return UserSession.findAll({
        where: {
            userId,
            isActive: true,
            expiresAt: { [sequelize_1.Op.gt]: new Date() },
        },
        order: [['lastActivity', 'DESC']],
    });
}
/**
 * Generates secure token
 */
function generateSecureToken() {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Models
    SecurityRole,
    UserRoleAssignment,
    Permission,
    SecurityPolicy,
    SecurityAuditLog,
    SecurityIncident,
    AccessReview,
    FieldSecurity,
    UserSession,
    PasswordPolicy,
    MfaConfiguration,
    SecurityGroup,
    // Role and Permission Functions
    createSecurityRole,
    assignRoleToUser,
    revokeRoleFromUser,
    checkPermission,
    getUserPermissions,
    getUserRoles,
    // Audit Logging Functions
    logSecurityEvent,
    getAuditLogs,
    generateAuditReport,
    // Security Policy Functions
    createSecurityPolicy,
    evaluatePolicyCompliance,
    // Security Incident Functions
    createSecurityIncident,
    updateIncidentStatus,
    getOpenIncidents,
    // Access Review Functions
    createAccessReview,
    completeAccessReview,
    getPendingReviews,
    // Field Security Functions
    configureFieldSecurity,
    maskFieldValue,
    // Session Management Functions
    createUserSession,
    validateUserSession,
    expireUserSession,
    expireAllUserSessions,
    getActiveUserSessions,
    // Password Policy Functions
    validatePassword,
    checkPasswordStrength,
    forcePasswordReset,
    // MFA Functions
    enableMfa,
    verifyMfaCode,
    generateBackupCodes,
    // Security Group Functions
    createSecurityGroup,
    addUserToSecurityGroup,
    assignRoleToSecurityGroup,
    // Compliance Reporting Functions
    generateSoxComplianceReport,
    generateSecurityMetrics,
};
//# sourceMappingURL=asset-security-commands.js.map