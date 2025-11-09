"use strict";
/**
 * LOC: IAM-SWG-001
 * File: /reuse/iam-swagger-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - IAM API documentation modules
 *   - Authentication/Authorization controllers
 *   - Security endpoint decorators
 *   - OpenAPI specification builders
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOAuth2Scopes = exports.createRateLimitHeaders = exports.createRateLimitSchema = exports.createIPWhitelistSchema = exports.createTokenIntrospectionSchema = exports.createEmailVerificationSchema = exports.createPasswordResetConfirmSchema = exports.createPasswordResetRequestSchema = exports.createAssignRoleEndpointDoc = exports.createUpdateRoleEndpointDoc = exports.createListRolesEndpointDoc = exports.createLogoutEndpointDoc = exports.createIAMComponents = exports.createCommonResponses = exports.createOpenAPIDocumentConfig = exports.createSwaggerUIConfig = exports.createPaginatedResponseSchema = exports.createValidationErrorResponseSchema = exports.createErrorResponseSchema = exports.createVerifyMFAEndpointDoc = exports.createEnrollMFAEndpointDoc = exports.createCheckPermissionEndpointDoc = exports.createListUsersEndpointDoc = exports.createCreateUserEndpointDoc = exports.createGetCurrentUserEndpointDoc = exports.createLoginEndpointDoc = exports.createOAuth2SecurityRequirement = exports.createApiKeySecurityRequirement = exports.createBearerSecurityRequirement = exports.createOAuth2SecurityScheme = exports.createApiKeySecurityScheme = exports.createBearerSecurityScheme = exports.createSessionSchema = exports.createAuditLogQueryParams = exports.createAuditLogSchema = exports.createMFAVerificationSchema = exports.createMFAEnrollmentSchema = exports.createTokenRefreshSchema = exports.createLoginResponseSchema = exports.createLoginRequestSchema = exports.createPolicyStatementSchema = exports.createPolicyDocumentSchema = exports.createPermissionCheckResponseSchema = exports.createPermissionCheckSchema = exports.createPermissionSchema = exports.createRoleCreateSchema = exports.createRoleSchema = exports.createUserUpdateSchema = exports.createUserCreateSchema = exports.createUserSchema = void 0;
// ============================================================================
// IAM USER SCHEMA DEFINITIONS
// ============================================================================
/**
 * Creates OpenAPI schema for User object.
 *
 * @param {boolean} [includePassword] - Whether to include password field (for create/update)
 * @returns {object} OpenAPI User schema
 *
 * @example
 * ```typescript
 * const userSchema = createUserSchema(false);
 * // Result: Complete user schema without password field
 * ```
 */
const createUserSchema = (includePassword = false) => {
    const properties = {
        id: {
            type: 'string',
            format: 'uuid',
            description: 'Unique user identifier',
            example: '123e4567-e89b-12d3-a456-426614174000',
        },
        email: {
            type: 'string',
            format: 'email',
            description: 'User email address',
            example: 'user@whitecross.com',
        },
        username: {
            type: 'string',
            minLength: 3,
            maxLength: 50,
            description: 'Unique username',
            example: 'jdoe',
        },
        firstName: {
            type: 'string',
            description: 'User first name',
            example: 'John',
        },
        lastName: {
            type: 'string',
            description: 'User last name',
            example: 'Doe',
        },
        status: {
            type: 'string',
            enum: ['active', 'inactive', 'suspended', 'pending'],
            description: 'User account status',
            example: 'active',
        },
        roles: {
            type: 'array',
            items: { $ref: '#/components/schemas/Role' },
            description: 'User assigned roles',
        },
        permissions: {
            type: 'array',
            items: { type: 'string' },
            description: 'User direct permissions',
            example: ['user:read', 'user:update'],
        },
        createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'User creation timestamp',
            example: '2024-01-01T12:00:00Z',
        },
        updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Last update timestamp',
            example: '2024-01-15T14:30:00Z',
        },
        lastLoginAt: {
            type: 'string',
            format: 'date-time',
            nullable: true,
            description: 'Last successful login timestamp',
            example: '2024-01-20T09:15:00Z',
        },
        mfaEnabled: {
            type: 'boolean',
            description: 'Multi-factor authentication status',
            example: true,
        },
    };
    if (includePassword) {
        properties.password = {
            type: 'string',
            format: 'password',
            minLength: 8,
            description: 'User password (required for creation)',
            example: 'SecureP@ssw0rd!',
        };
    }
    const required = includePassword
        ? ['email', 'password']
        : ['id', 'email', 'status', 'createdAt'];
    return {
        type: 'object',
        properties,
        required,
        description: 'User account representation',
    };
};
exports.createUserSchema = createUserSchema;
/**
 * Creates OpenAPI schema for CreateUser request.
 *
 * @returns {object} OpenAPI CreateUser request schema
 *
 * @example
 * ```typescript
 * const createUserSchema = createUserCreateSchema();
 * // Use in POST /users request body
 * ```
 */
const createUserCreateSchema = () => {
    return {
        type: 'object',
        properties: {
            email: {
                type: 'string',
                format: 'email',
                description: 'User email address',
                example: 'newuser@whitecross.com',
            },
            username: {
                type: 'string',
                minLength: 3,
                maxLength: 50,
                description: 'Desired username',
                example: 'newuser',
            },
            password: {
                type: 'string',
                format: 'password',
                minLength: 8,
                description: 'User password',
                example: 'SecureP@ssw0rd!',
            },
            firstName: {
                type: 'string',
                description: 'First name',
                example: 'Jane',
            },
            lastName: {
                type: 'string',
                description: 'Last name',
                example: 'Smith',
            },
            roles: {
                type: 'array',
                items: { type: 'string', format: 'uuid' },
                description: 'Role IDs to assign',
                example: ['role-uuid-1', 'role-uuid-2'],
            },
        },
        required: ['email', 'password'],
        description: 'User creation request',
    };
};
exports.createUserCreateSchema = createUserCreateSchema;
/**
 * Creates OpenAPI schema for UpdateUser request.
 *
 * @returns {object} OpenAPI UpdateUser request schema
 *
 * @example
 * ```typescript
 * const updateUserSchema = createUserUpdateSchema();
 * // Use in PATCH /users/:id request body
 * ```
 */
const createUserUpdateSchema = () => {
    return {
        type: 'object',
        properties: {
            email: {
                type: 'string',
                format: 'email',
                description: 'Updated email address',
            },
            firstName: {
                type: 'string',
                description: 'Updated first name',
            },
            lastName: {
                type: 'string',
                description: 'Updated last name',
            },
            status: {
                type: 'string',
                enum: ['active', 'inactive', 'suspended'],
                description: 'Updated account status',
            },
        },
        description: 'User update request (all fields optional)',
    };
};
exports.createUserUpdateSchema = createUserUpdateSchema;
// ============================================================================
// IAM ROLE SCHEMA DEFINITIONS
// ============================================================================
/**
 * Creates OpenAPI schema for Role object.
 *
 * @returns {object} OpenAPI Role schema
 *
 * @example
 * ```typescript
 * const roleSchema = createRoleSchema();
 * // Result: Complete role schema with permissions
 * ```
 */
const createRoleSchema = () => {
    return {
        type: 'object',
        properties: {
            id: {
                type: 'string',
                format: 'uuid',
                description: 'Unique role identifier',
                example: '550e8400-e29b-41d4-a716-446655440000',
            },
            name: {
                type: 'string',
                description: 'Role name',
                example: 'Healthcare Provider',
            },
            description: {
                type: 'string',
                description: 'Role description',
                example: 'Access for healthcare providers to patient data',
            },
            permissions: {
                type: 'array',
                items: { $ref: '#/components/schemas/Permission' },
                description: 'Permissions granted by this role',
            },
            isSystem: {
                type: 'boolean',
                description: 'Whether this is a system-defined role (cannot be deleted)',
                example: false,
            },
            createdAt: {
                type: 'string',
                format: 'date-time',
                description: 'Role creation timestamp',
            },
            updatedAt: {
                type: 'string',
                format: 'date-time',
                description: 'Last update timestamp',
            },
        },
        required: ['id', 'name', 'permissions', 'createdAt'],
        description: 'Role definition with associated permissions',
    };
};
exports.createRoleSchema = createRoleSchema;
/**
 * Creates OpenAPI schema for CreateRole request.
 *
 * @returns {object} OpenAPI CreateRole request schema
 *
 * @example
 * ```typescript
 * const createRoleSchema = createRoleCreateSchema();
 * // Use in POST /roles request body
 * ```
 */
const createRoleCreateSchema = () => {
    return {
        type: 'object',
        properties: {
            name: {
                type: 'string',
                minLength: 3,
                maxLength: 100,
                description: 'Role name',
                example: 'Custom Role',
            },
            description: {
                type: 'string',
                maxLength: 500,
                description: 'Role description',
                example: 'Custom role for specific department',
            },
            permissions: {
                type: 'array',
                items: { type: 'string' },
                description: 'Permission identifiers to grant',
                example: ['patient:read', 'appointment:create'],
            },
        },
        required: ['name', 'permissions'],
        description: 'Role creation request',
    };
};
exports.createRoleCreateSchema = createRoleCreateSchema;
// ============================================================================
// IAM PERMISSION SCHEMA DEFINITIONS
// ============================================================================
/**
 * Creates OpenAPI schema for Permission object.
 *
 * @returns {object} OpenAPI Permission schema
 *
 * @example
 * ```typescript
 * const permissionSchema = createPermissionSchema();
 * // Result: Permission schema with resource and action
 * ```
 */
const createPermissionSchema = () => {
    return {
        type: 'object',
        properties: {
            id: {
                type: 'string',
                format: 'uuid',
                description: 'Unique permission identifier',
                example: 'perm-uuid-123',
            },
            resource: {
                type: 'string',
                description: 'Resource type this permission applies to',
                example: 'patient',
            },
            action: {
                type: 'string',
                enum: ['create', 'read', 'update', 'delete', 'list', 'execute'],
                description: 'Action allowed on the resource',
                example: 'read',
            },
            scope: {
                type: 'string',
                nullable: true,
                description: 'Optional scope restriction (e.g., department, organization)',
                example: 'department:cardiology',
            },
            description: {
                type: 'string',
                description: 'Human-readable permission description',
                example: 'Allows reading patient records in cardiology department',
            },
        },
        required: ['id', 'resource', 'action'],
        description: 'Permission definition',
    };
};
exports.createPermissionSchema = createPermissionSchema;
/**
 * Creates OpenAPI schema for permission check request.
 *
 * @returns {object} OpenAPI permission check schema
 *
 * @example
 * ```typescript
 * const checkSchema = createPermissionCheckSchema();
 * // Use in POST /auth/check-permission request body
 * ```
 */
const createPermissionCheckSchema = () => {
    return {
        type: 'object',
        properties: {
            userId: {
                type: 'string',
                format: 'uuid',
                description: 'User ID to check permissions for',
            },
            resource: {
                type: 'string',
                description: 'Resource to check access for',
                example: 'patient',
            },
            action: {
                type: 'string',
                description: 'Action to check',
                example: 'read',
            },
            resourceId: {
                type: 'string',
                nullable: true,
                description: 'Specific resource instance ID',
                example: 'patient-123',
            },
        },
        required: ['userId', 'resource', 'action'],
        description: 'Permission check request',
    };
};
exports.createPermissionCheckSchema = createPermissionCheckSchema;
/**
 * Creates OpenAPI schema for permission check response.
 *
 * @returns {object} OpenAPI permission check response schema
 *
 * @example
 * ```typescript
 * const responseSchema = createPermissionCheckResponseSchema();
 * ```
 */
const createPermissionCheckResponseSchema = () => {
    return {
        type: 'object',
        properties: {
            allowed: {
                type: 'boolean',
                description: 'Whether the action is allowed',
                example: true,
            },
            reason: {
                type: 'string',
                nullable: true,
                description: 'Explanation if denied',
                example: 'User lacks required permission: patient:read',
            },
            grantedBy: {
                type: 'array',
                items: { type: 'string' },
                description: 'Roles or permissions that granted access',
                example: ['role:healthcare-provider', 'permission:patient:read'],
            },
        },
        required: ['allowed'],
        description: 'Permission check result',
    };
};
exports.createPermissionCheckResponseSchema = createPermissionCheckResponseSchema;
// ============================================================================
// IAM POLICY DOCUMENT SCHEMAS
// ============================================================================
/**
 * Creates OpenAPI schema for Policy Document.
 *
 * @returns {object} OpenAPI PolicyDocument schema
 *
 * @example
 * ```typescript
 * const policySchema = createPolicyDocumentSchema();
 * // Result: IAM policy document schema similar to AWS IAM policies
 * ```
 */
const createPolicyDocumentSchema = () => {
    return {
        type: 'object',
        properties: {
            version: {
                type: 'string',
                description: 'Policy document version',
                example: '2024-01-01',
            },
            statements: {
                type: 'array',
                items: { $ref: '#/components/schemas/PolicyStatement' },
                description: 'Policy statements',
            },
        },
        required: ['version', 'statements'],
        description: 'IAM policy document',
    };
};
exports.createPolicyDocumentSchema = createPolicyDocumentSchema;
/**
 * Creates OpenAPI schema for Policy Statement.
 *
 * @returns {object} OpenAPI PolicyStatement schema
 *
 * @example
 * ```typescript
 * const statementSchema = createPolicyStatementSchema();
 * // Result: Individual policy statement schema
 * ```
 */
const createPolicyStatementSchema = () => {
    return {
        type: 'object',
        properties: {
            effect: {
                type: 'string',
                enum: ['Allow', 'Deny'],
                description: 'Statement effect',
                example: 'Allow',
            },
            actions: {
                type: 'array',
                items: { type: 'string' },
                description: 'Allowed or denied actions',
                example: ['patient:read', 'patient:update'],
            },
            resources: {
                type: 'array',
                items: { type: 'string' },
                description: 'Resources this statement applies to',
                example: ['patient/*', 'appointment/*'],
            },
            conditions: {
                type: 'object',
                additionalProperties: true,
                nullable: true,
                description: 'Optional conditions for the policy',
                example: { ipAddress: '10.0.0.0/8', timeOfDay: 'business-hours' },
            },
        },
        required: ['effect', 'actions', 'resources'],
        description: 'Policy statement within a policy document',
    };
};
exports.createPolicyStatementSchema = createPolicyStatementSchema;
// ============================================================================
// AUTHENTICATION SCHEMAS
// ============================================================================
/**
 * Creates OpenAPI schema for Login request.
 *
 * @returns {object} OpenAPI Login request schema
 *
 * @example
 * ```typescript
 * const loginSchema = createLoginRequestSchema();
 * // Use in POST /auth/login request body
 * ```
 */
const createLoginRequestSchema = () => {
    return {
        type: 'object',
        properties: {
            email: {
                type: 'string',
                format: 'email',
                description: 'User email address',
                example: 'user@whitecross.com',
            },
            password: {
                type: 'string',
                format: 'password',
                description: 'User password',
                example: 'SecureP@ssw0rd!',
            },
            mfaCode: {
                type: 'string',
                pattern: '^[0-9]{6}$',
                nullable: true,
                description: 'Optional MFA code if enabled',
                example: '123456',
            },
        },
        required: ['email', 'password'],
        description: 'User login credentials',
    };
};
exports.createLoginRequestSchema = createLoginRequestSchema;
/**
 * Creates OpenAPI schema for Login response.
 *
 * @returns {object} OpenAPI Login response schema
 *
 * @example
 * ```typescript
 * const loginResponseSchema = createLoginResponseSchema();
 * // Use in POST /auth/login 200 response
 * ```
 */
const createLoginResponseSchema = () => {
    return {
        type: 'object',
        properties: {
            accessToken: {
                type: 'string',
                description: 'JWT access token',
                example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
            refreshToken: {
                type: 'string',
                description: 'Refresh token for obtaining new access tokens',
                example: 'refresh-token-abc123...',
            },
            tokenType: {
                type: 'string',
                description: 'Token type',
                example: 'Bearer',
            },
            expiresIn: {
                type: 'integer',
                description: 'Access token expiration time in seconds',
                example: 900,
            },
            user: {
                $ref: '#/components/schemas/User',
                description: 'Authenticated user information',
            },
        },
        required: ['accessToken', 'tokenType', 'expiresIn', 'user'],
        description: 'Successful authentication response',
    };
};
exports.createLoginResponseSchema = createLoginResponseSchema;
/**
 * Creates OpenAPI schema for Token Refresh request.
 *
 * @returns {object} OpenAPI Token Refresh request schema
 *
 * @example
 * ```typescript
 * const refreshSchema = createTokenRefreshSchema();
 * // Use in POST /auth/refresh request body
 * ```
 */
const createTokenRefreshSchema = () => {
    return {
        type: 'object',
        properties: {
            refreshToken: {
                type: 'string',
                description: 'Refresh token',
                example: 'refresh-token-abc123...',
            },
        },
        required: ['refreshToken'],
        description: 'Token refresh request',
    };
};
exports.createTokenRefreshSchema = createTokenRefreshSchema;
// ============================================================================
// MFA SCHEMAS
// ============================================================================
/**
 * Creates OpenAPI schema for MFA Enrollment request.
 *
 * @returns {object} OpenAPI MFA enrollment schema
 *
 * @example
 * ```typescript
 * const mfaEnrollSchema = createMFAEnrollmentSchema();
 * // Use in POST /auth/mfa/enroll request/response
 * ```
 */
const createMFAEnrollmentSchema = () => {
    return {
        type: 'object',
        properties: {
            method: {
                type: 'string',
                enum: ['totp', 'sms', 'email', 'biometric'],
                description: 'MFA method to enroll',
                example: 'totp',
            },
            secret: {
                type: 'string',
                nullable: true,
                description: 'TOTP secret (for totp method)',
                example: 'JBSWY3DPEHPK3PXP',
            },
            qrCode: {
                type: 'string',
                nullable: true,
                description: 'Base64 encoded QR code for TOTP setup',
                example: 'data:image/png;base64,iVBORw0KGgoAAAA...',
            },
            backupCodes: {
                type: 'array',
                items: { type: 'string' },
                nullable: true,
                description: 'One-time backup codes',
                example: ['A1B2-C3D4', 'E5F6-G7H8'],
            },
            phoneNumber: {
                type: 'string',
                nullable: true,
                description: 'Phone number (for sms method)',
                example: '+1234567890',
            },
        },
        required: ['method'],
        description: 'MFA enrollment data',
    };
};
exports.createMFAEnrollmentSchema = createMFAEnrollmentSchema;
/**
 * Creates OpenAPI schema for MFA Verification request.
 *
 * @returns {object} OpenAPI MFA verification schema
 *
 * @example
 * ```typescript
 * const mfaVerifySchema = createMFAVerificationSchema();
 * // Use in POST /auth/mfa/verify request body
 * ```
 */
const createMFAVerificationSchema = () => {
    return {
        type: 'object',
        properties: {
            code: {
                type: 'string',
                pattern: '^[0-9]{6}$',
                description: '6-digit MFA code',
                example: '123456',
            },
            method: {
                type: 'string',
                enum: ['totp', 'sms', 'email', 'backup'],
                description: 'MFA method used',
                example: 'totp',
            },
        },
        required: ['code', 'method'],
        description: 'MFA verification request',
    };
};
exports.createMFAVerificationSchema = createMFAVerificationSchema;
// ============================================================================
// AUDIT LOG SCHEMAS
// ============================================================================
/**
 * Creates OpenAPI schema for Audit Log entry.
 *
 * @returns {object} OpenAPI AuditLog schema
 *
 * @example
 * ```typescript
 * const auditLogSchema = createAuditLogSchema();
 * // Result: Comprehensive audit log entry schema
 * ```
 */
const createAuditLogSchema = () => {
    return {
        type: 'object',
        properties: {
            id: {
                type: 'string',
                format: 'uuid',
                description: 'Unique audit log entry ID',
            },
            userId: {
                type: 'string',
                format: 'uuid',
                description: 'User who performed the action',
            },
            action: {
                type: 'string',
                description: 'Action performed',
                example: 'user:login',
            },
            resource: {
                type: 'string',
                description: 'Resource type affected',
                example: 'user',
            },
            resourceId: {
                type: 'string',
                nullable: true,
                description: 'Specific resource ID',
                example: 'user-uuid-123',
            },
            result: {
                type: 'string',
                enum: ['success', 'failure'],
                description: 'Action result',
                example: 'success',
            },
            ipAddress: {
                type: 'string',
                format: 'ipv4',
                description: 'Client IP address',
                example: '192.168.1.100',
            },
            userAgent: {
                type: 'string',
                description: 'Client user agent',
                example: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)...',
            },
            timestamp: {
                type: 'string',
                format: 'date-time',
                description: 'When the action occurred',
                example: '2024-01-20T10:30:00Z',
            },
            metadata: {
                type: 'object',
                additionalProperties: true,
                nullable: true,
                description: 'Additional contextual data',
                example: { previousStatus: 'inactive', newStatus: 'active' },
            },
        },
        required: ['id', 'userId', 'action', 'resource', 'result', 'timestamp'],
        description: 'Audit log entry for security and compliance',
    };
};
exports.createAuditLogSchema = createAuditLogSchema;
/**
 * Creates OpenAPI schema for Audit Log query parameters.
 *
 * @returns {object[]} OpenAPI query parameters for audit log filtering
 *
 * @example
 * ```typescript
 * const auditParams = createAuditLogQueryParams();
 * // Use in GET /audit-logs endpoint
 * ```
 */
const createAuditLogQueryParams = () => {
    return [
        {
            name: 'userId',
            in: 'query',
            schema: { type: 'string', format: 'uuid' },
            description: 'Filter by user ID',
        },
        {
            name: 'action',
            in: 'query',
            schema: { type: 'string' },
            description: 'Filter by action type',
        },
        {
            name: 'resource',
            in: 'query',
            schema: { type: 'string' },
            description: 'Filter by resource type',
        },
        {
            name: 'result',
            in: 'query',
            schema: { type: 'string', enum: ['success', 'failure'] },
            description: 'Filter by result',
        },
        {
            name: 'startDate',
            in: 'query',
            schema: { type: 'string', format: 'date-time' },
            description: 'Filter logs after this timestamp',
        },
        {
            name: 'endDate',
            in: 'query',
            schema: { type: 'string', format: 'date-time' },
            description: 'Filter logs before this timestamp',
        },
        {
            name: 'page',
            in: 'query',
            schema: { type: 'integer', minimum: 1, default: 1 },
            description: 'Page number',
        },
        {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
            description: 'Items per page',
        },
    ];
};
exports.createAuditLogQueryParams = createAuditLogQueryParams;
// ============================================================================
// SESSION SCHEMAS
// ============================================================================
/**
 * Creates OpenAPI schema for Session object.
 *
 * @returns {object} OpenAPI Session schema
 *
 * @example
 * ```typescript
 * const sessionSchema = createSessionSchema();
 * // Result: User session schema
 * ```
 */
const createSessionSchema = () => {
    return {
        type: 'object',
        properties: {
            id: {
                type: 'string',
                format: 'uuid',
                description: 'Session identifier',
            },
            userId: {
                type: 'string',
                format: 'uuid',
                description: 'Associated user ID',
            },
            token: {
                type: 'string',
                description: 'Session token',
            },
            expiresAt: {
                type: 'string',
                format: 'date-time',
                description: 'Session expiration timestamp',
            },
            createdAt: {
                type: 'string',
                format: 'date-time',
                description: 'Session creation timestamp',
            },
            ipAddress: {
                type: 'string',
                format: 'ipv4',
                description: 'Client IP address',
            },
            userAgent: {
                type: 'string',
                description: 'Client user agent',
            },
            isActive: {
                type: 'boolean',
                description: 'Whether session is currently active',
            },
        },
        required: ['id', 'userId', 'expiresAt', 'isActive'],
        description: 'User session information',
    };
};
exports.createSessionSchema = createSessionSchema;
// ============================================================================
// SECURITY SCHEME DEFINITIONS
// ============================================================================
/**
 * Creates Bearer (JWT) authentication security scheme.
 *
 * @param {string} [description] - Custom description
 * @returns {object} OpenAPI security scheme
 *
 * @example
 * ```typescript
 * const bearerScheme = createBearerSecurityScheme();
 * // Add to components.securitySchemes in OpenAPI spec
 * ```
 */
const createBearerSecurityScheme = (description) => {
    return {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: description ||
            'JWT authentication token. Obtain from /auth/login endpoint. Include in Authorization header as "Bearer <token>".',
    };
};
exports.createBearerSecurityScheme = createBearerSecurityScheme;
/**
 * Creates API Key authentication security scheme.
 *
 * @param {string} [headerName] - Header name (default: 'X-API-Key')
 * @param {string} [description] - Custom description
 * @returns {object} OpenAPI security scheme
 *
 * @example
 * ```typescript
 * const apiKeyScheme = createApiKeySecurityScheme('X-API-Key');
 * // Add to components.securitySchemes
 * ```
 */
const createApiKeySecurityScheme = (headerName = 'X-API-Key', description) => {
    return {
        type: 'apiKey',
        in: 'header',
        name: headerName,
        description: description ||
            'API key for authentication. Contact administrator to obtain an API key.',
    };
};
exports.createApiKeySecurityScheme = createApiKeySecurityScheme;
/**
 * Creates OAuth2 authentication security scheme.
 *
 * @param {string} authUrl - Authorization endpoint URL
 * @param {string} tokenUrl - Token endpoint URL
 * @param {Record<string, string>} scopes - Available OAuth scopes
 * @returns {object} OpenAPI security scheme
 *
 * @example
 * ```typescript
 * const oauth2Scheme = createOAuth2SecurityScheme(
 *   'https://api.whitecross.com/oauth/authorize',
 *   'https://api.whitecross.com/oauth/token',
 *   { 'user:read': 'Read user data', 'user:write': 'Modify user data' }
 * );
 * ```
 */
const createOAuth2SecurityScheme = (authUrl, tokenUrl, scopes) => {
    return {
        type: 'oauth2',
        flows: {
            authorizationCode: {
                authorizationUrl: authUrl,
                tokenUrl: tokenUrl,
                scopes: scopes,
            },
        },
        description: 'OAuth 2.0 authorization code flow',
    };
};
exports.createOAuth2SecurityScheme = createOAuth2SecurityScheme;
/**
 * Creates security requirement for Bearer token.
 *
 * @param {string[]} [scopes] - Required scopes
 * @returns {object} OpenAPI security requirement
 *
 * @example
 * ```typescript
 * const securityReq = createBearerSecurityRequirement();
 * // Add to operation security array
 * ```
 */
const createBearerSecurityRequirement = (scopes = []) => {
    return { bearerAuth: scopes };
};
exports.createBearerSecurityRequirement = createBearerSecurityRequirement;
/**
 * Creates security requirement for API Key.
 *
 * @returns {object} OpenAPI security requirement
 *
 * @example
 * ```typescript
 * const securityReq = createApiKeySecurityRequirement();
 * // Add to operation security array
 * ```
 */
const createApiKeySecurityRequirement = () => {
    return { apiKey: [] };
};
exports.createApiKeySecurityRequirement = createApiKeySecurityRequirement;
/**
 * Creates security requirement for OAuth2.
 *
 * @param {string[]} requiredScopes - Required OAuth scopes
 * @returns {object} OpenAPI security requirement
 *
 * @example
 * ```typescript
 * const securityReq = createOAuth2SecurityRequirement(['user:read', 'user:write']);
 * // Add to operation security array
 * ```
 */
const createOAuth2SecurityRequirement = (requiredScopes) => {
    return { oauth2: requiredScopes };
};
exports.createOAuth2SecurityRequirement = createOAuth2SecurityRequirement;
// ============================================================================
// IAM ENDPOINT DOCUMENTATION
// ============================================================================
/**
 * Creates OpenAPI operation documentation for Login endpoint.
 *
 * @returns {object} OpenAPI operation object
 *
 * @example
 * ```typescript
 * const loginOp = createLoginEndpointDoc();
 * // Use for POST /auth/login operation
 * ```
 */
const createLoginEndpointDoc = () => {
    return {
        summary: 'User login',
        description: 'Authenticates a user with email and password. Returns JWT access token and refresh token.',
        tags: ['Authentication'],
        requestBody: {
            required: true,
            content: {
                'application/json': {
                    schema: (0, exports.createLoginRequestSchema)(),
                    examples: {
                        standard: {
                            summary: 'Standard login',
                            value: {
                                email: 'user@whitecross.com',
                                password: 'SecureP@ssw0rd!',
                            },
                        },
                        withMFA: {
                            summary: 'Login with MFA',
                            value: {
                                email: 'user@whitecross.com',
                                password: 'SecureP@ssw0rd!',
                                mfaCode: '123456',
                            },
                        },
                    },
                },
            },
        },
        responses: {
            200: {
                description: 'Login successful',
                content: {
                    'application/json': {
                        schema: (0, exports.createLoginResponseSchema)(),
                    },
                },
            },
            401: {
                description: 'Invalid credentials',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                statusCode: { type: 'integer', example: 401 },
                                message: { type: 'string', example: 'Invalid email or password' },
                                error: { type: 'string', example: 'Unauthorized' },
                            },
                        },
                    },
                },
            },
            403: {
                description: 'MFA required',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                statusCode: { type: 'integer', example: 403 },
                                message: { type: 'string', example: 'MFA code required' },
                                error: { type: 'string', example: 'Forbidden' },
                                mfaRequired: { type: 'boolean', example: true },
                            },
                        },
                    },
                },
            },
        },
    };
};
exports.createLoginEndpointDoc = createLoginEndpointDoc;
/**
 * Creates OpenAPI operation documentation for Get Current User endpoint.
 *
 * @returns {object} OpenAPI operation object
 *
 * @example
 * ```typescript
 * const getCurrentUserOp = createGetCurrentUserEndpointDoc();
 * // Use for GET /auth/me operation
 * ```
 */
const createGetCurrentUserEndpointDoc = () => {
    return {
        summary: 'Get current user',
        description: 'Retrieves the currently authenticated user information',
        tags: ['Authentication', 'Users'],
        security: [(0, exports.createBearerSecurityRequirement)()],
        responses: {
            200: {
                description: 'Current user data',
                content: {
                    'application/json': {
                        schema: (0, exports.createUserSchema)(false),
                    },
                },
            },
            401: {
                description: 'Unauthorized - invalid or expired token',
            },
        },
    };
};
exports.createGetCurrentUserEndpointDoc = createGetCurrentUserEndpointDoc;
/**
 * Creates OpenAPI operation documentation for Create User endpoint.
 *
 * @returns {object} OpenAPI operation object
 *
 * @example
 * ```typescript
 * const createUserOp = createCreateUserEndpointDoc();
 * // Use for POST /users operation
 * ```
 */
const createCreateUserEndpointDoc = () => {
    return {
        summary: 'Create new user',
        description: 'Creates a new user account. Requires admin privileges.',
        tags: ['Users'],
        security: [(0, exports.createBearerSecurityRequirement)(['admin'])],
        requestBody: {
            required: true,
            content: {
                'application/json': {
                    schema: (0, exports.createUserCreateSchema)(),
                },
            },
        },
        responses: {
            201: {
                description: 'User created successfully',
                content: {
                    'application/json': {
                        schema: (0, exports.createUserSchema)(false),
                    },
                },
            },
            400: {
                description: 'Validation error',
            },
            409: {
                description: 'Email or username already exists',
            },
        },
    };
};
exports.createCreateUserEndpointDoc = createCreateUserEndpointDoc;
/**
 * Creates OpenAPI operation documentation for List Users endpoint.
 *
 * @returns {object} OpenAPI operation object
 *
 * @example
 * ```typescript
 * const listUsersOp = createListUsersEndpointDoc();
 * // Use for GET /users operation
 * ```
 */
const createListUsersEndpointDoc = () => {
    return {
        summary: 'List users',
        description: 'Retrieves paginated list of users with optional filtering',
        tags: ['Users'],
        security: [(0, exports.createBearerSecurityRequirement)(['admin'])],
        parameters: [
            {
                name: 'page',
                in: 'query',
                schema: { type: 'integer', minimum: 1, default: 1 },
                description: 'Page number',
            },
            {
                name: 'limit',
                in: 'query',
                schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
                description: 'Items per page',
            },
            {
                name: 'status',
                in: 'query',
                schema: { type: 'string', enum: ['active', 'inactive', 'suspended', 'pending'] },
                description: 'Filter by user status',
            },
            {
                name: 'role',
                in: 'query',
                schema: { type: 'string' },
                description: 'Filter by role ID',
            },
            {
                name: 'search',
                in: 'query',
                schema: { type: 'string' },
                description: 'Search by name or email',
            },
        ],
        responses: {
            200: {
                description: 'List of users',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                data: {
                                    type: 'array',
                                    items: (0, exports.createUserSchema)(false),
                                },
                                page: { type: 'integer' },
                                limit: { type: 'integer' },
                                total: { type: 'integer' },
                                totalPages: { type: 'integer' },
                            },
                        },
                    },
                },
            },
        },
    };
};
exports.createListUsersEndpointDoc = createListUsersEndpointDoc;
/**
 * Creates OpenAPI operation documentation for Check Permission endpoint.
 *
 * @returns {object} OpenAPI operation object
 *
 * @example
 * ```typescript
 * const checkPermOp = createCheckPermissionEndpointDoc();
 * // Use for POST /auth/check-permission operation
 * ```
 */
const createCheckPermissionEndpointDoc = () => {
    return {
        summary: 'Check user permission',
        description: 'Verifies if a user has permission to perform an action on a resource',
        tags: ['Authorization', 'Permissions'],
        security: [(0, exports.createBearerSecurityRequirement)()],
        requestBody: {
            required: true,
            content: {
                'application/json': {
                    schema: (0, exports.createPermissionCheckSchema)(),
                },
            },
        },
        responses: {
            200: {
                description: 'Permission check result',
                content: {
                    'application/json': {
                        schema: (0, exports.createPermissionCheckResponseSchema)(),
                    },
                },
            },
        },
    };
};
exports.createCheckPermissionEndpointDoc = createCheckPermissionEndpointDoc;
/**
 * Creates OpenAPI operation documentation for Enroll MFA endpoint.
 *
 * @returns {object} OpenAPI operation object
 *
 * @example
 * ```typescript
 * const enrollMFAOp = createEnrollMFAEndpointDoc();
 * // Use for POST /auth/mfa/enroll operation
 * ```
 */
const createEnrollMFAEndpointDoc = () => {
    return {
        summary: 'Enroll in multi-factor authentication',
        description: 'Initiates MFA enrollment for the authenticated user. Returns setup information including QR code for TOTP.',
        tags: ['Authentication', 'MFA'],
        security: [(0, exports.createBearerSecurityRequirement)()],
        requestBody: {
            required: true,
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            method: {
                                type: 'string',
                                enum: ['totp', 'sms', 'email'],
                                description: 'MFA method to enroll',
                            },
                            phoneNumber: {
                                type: 'string',
                                nullable: true,
                                description: 'Phone number for SMS (required if method=sms)',
                            },
                        },
                        required: ['method'],
                    },
                },
            },
        },
        responses: {
            200: {
                description: 'MFA enrollment initiated',
                content: {
                    'application/json': {
                        schema: (0, exports.createMFAEnrollmentSchema)(),
                    },
                },
            },
        },
    };
};
exports.createEnrollMFAEndpointDoc = createEnrollMFAEndpointDoc;
/**
 * Creates OpenAPI operation documentation for Verify MFA endpoint.
 *
 * @returns {object} OpenAPI operation object
 *
 * @example
 * ```typescript
 * const verifyMFAOp = createVerifyMFAEndpointDoc();
 * // Use for POST /auth/mfa/verify operation
 * ```
 */
const createVerifyMFAEndpointDoc = () => {
    return {
        summary: 'Verify MFA code',
        description: 'Completes MFA verification with the provided code',
        tags: ['Authentication', 'MFA'],
        security: [(0, exports.createBearerSecurityRequirement)()],
        requestBody: {
            required: true,
            content: {
                'application/json': {
                    schema: (0, exports.createMFAVerificationSchema)(),
                },
            },
        },
        responses: {
            200: {
                description: 'MFA verification successful',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                verified: { type: 'boolean', example: true },
                                message: { type: 'string', example: 'MFA verification successful' },
                            },
                        },
                    },
                },
            },
            401: {
                description: 'Invalid MFA code',
            },
        },
    };
};
exports.createVerifyMFAEndpointDoc = createVerifyMFAEndpointDoc;
// ============================================================================
// RESPONSE SCHEMA GENERATORS
// ============================================================================
/**
 * Creates standard error response schema.
 *
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @param {string} [error] - Error type
 * @returns {object} OpenAPI error response schema
 *
 * @example
 * ```typescript
 * const errorSchema = createErrorResponseSchema(404, 'User not found', 'NotFound');
 * ```
 */
const createErrorResponseSchema = (statusCode, message, error) => {
    return {
        type: 'object',
        properties: {
            statusCode: {
                type: 'integer',
                example: statusCode,
            },
            message: {
                type: 'string',
                example: message,
            },
            error: {
                type: 'string',
                example: error || 'Error',
            },
            timestamp: {
                type: 'string',
                format: 'date-time',
                description: 'When the error occurred',
            },
        },
        required: ['statusCode', 'message'],
    };
};
exports.createErrorResponseSchema = createErrorResponseSchema;
/**
 * Creates validation error response schema.
 *
 * @returns {object} OpenAPI validation error response schema
 *
 * @example
 * ```typescript
 * const validationErrorSchema = createValidationErrorResponseSchema();
 * // Use for 400 Bad Request with validation errors
 * ```
 */
const createValidationErrorResponseSchema = () => {
    return {
        type: 'object',
        properties: {
            statusCode: {
                type: 'integer',
                example: 400,
            },
            message: {
                type: 'string',
                example: 'Validation failed',
            },
            error: {
                type: 'string',
                example: 'Bad Request',
            },
            errors: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        field: { type: 'string', example: 'email' },
                        message: { type: 'string', example: 'Invalid email format' },
                        value: { type: 'string', nullable: true },
                    },
                },
            },
        },
    };
};
exports.createValidationErrorResponseSchema = createValidationErrorResponseSchema;
/**
 * Creates paginated response wrapper schema.
 *
 * @param {object} itemSchema - Schema for individual items
 * @param {string} [description] - Response description
 * @returns {object} OpenAPI paginated response schema
 *
 * @example
 * ```typescript
 * const paginatedUsers = createPaginatedResponseSchema(
 *   createUserSchema(false),
 *   'Paginated list of users'
 * );
 * ```
 */
const createPaginatedResponseSchema = (itemSchema, description) => {
    return {
        type: 'object',
        properties: {
            data: {
                type: 'array',
                items: itemSchema,
                description: 'Array of items',
            },
            page: {
                type: 'integer',
                description: 'Current page number',
                example: 1,
            },
            limit: {
                type: 'integer',
                description: 'Items per page',
                example: 20,
            },
            total: {
                type: 'integer',
                description: 'Total number of items',
                example: 150,
            },
            totalPages: {
                type: 'integer',
                description: 'Total number of pages',
                example: 8,
            },
        },
        required: ['data', 'page', 'limit', 'total', 'totalPages'],
        description: description || 'Paginated response',
    };
};
exports.createPaginatedResponseSchema = createPaginatedResponseSchema;
// ============================================================================
// SWAGGER UI CUSTOMIZATION
// ============================================================================
/**
 * Creates Swagger UI configuration options.
 *
 * @param {object} [customOptions] - Custom options to override defaults
 * @returns {object} Swagger UI options
 *
 * @example
 * ```typescript
 * const swaggerConfig = createSwaggerUIConfig({
 *   customSiteTitle: 'White Cross IAM API',
 * });
 * ```
 */
const createSwaggerUIConfig = (customOptions) => {
    return {
        customSiteTitle: customOptions?.customSiteTitle || 'IAM API Documentation',
        customCss: customOptions?.customCss || '.swagger-ui .topbar { display: none }',
        customfavIcon: customOptions?.customfavIcon || '/favicon.ico',
        swaggerOptions: {
            persistAuthorization: true,
            displayRequestDuration: true,
            filter: true,
            tryItOutEnabled: true,
            ...customOptions?.swaggerOptions,
        },
    };
};
exports.createSwaggerUIConfig = createSwaggerUIConfig;
/**
 * Creates OpenAPI document configuration.
 *
 * @param {string} title - API title
 * @param {string} version - API version
 * @param {string} description - API description
 * @returns {object} OpenAPI document config
 *
 * @example
 * ```typescript
 * const docConfig = createOpenAPIDocumentConfig(
 *   'White Cross IAM API',
 *   '1.0.0',
 *   'Identity and Access Management API'
 * );
 * ```
 */
const createOpenAPIDocumentConfig = (title, version, description) => {
    return {
        openapi: '3.0.0',
        info: {
            title,
            version,
            description,
            contact: {
                name: 'API Support',
                email: 'api-support@whitecross.com',
            },
            license: {
                name: 'Proprietary',
            },
        },
        servers: [
            {
                url: 'https://api.whitecross.com/v1',
                description: 'Production server',
            },
            {
                url: 'https://staging-api.whitecross.com/v1',
                description: 'Staging server',
            },
            {
                url: 'http://localhost:3000',
                description: 'Local development server',
            },
        ],
        tags: [
            {
                name: 'Authentication',
                description: 'Authentication endpoints (login, logout, token refresh)',
            },
            {
                name: 'Users',
                description: 'User management operations',
            },
            {
                name: 'Roles',
                description: 'Role management operations',
            },
            {
                name: 'Permissions',
                description: 'Permission management operations',
            },
            {
                name: 'Authorization',
                description: 'Authorization and access control endpoints',
            },
            {
                name: 'MFA',
                description: 'Multi-factor authentication operations',
            },
            {
                name: 'Audit',
                description: 'Audit log and security monitoring',
            },
            {
                name: 'Sessions',
                description: 'Session management',
            },
        ],
    };
};
exports.createOpenAPIDocumentConfig = createOpenAPIDocumentConfig;
/**
 * Creates common response references for OpenAPI components.
 *
 * @returns {object} Common response definitions
 *
 * @example
 * ```typescript
 * const commonResponses = createCommonResponses();
 * // Add to components.responses in OpenAPI spec
 * ```
 */
const createCommonResponses = () => {
    return {
        Unauthorized: {
            description: 'Unauthorized - invalid or missing authentication token',
            content: {
                'application/json': {
                    schema: (0, exports.createErrorResponseSchema)(401, 'Unauthorized', 'Unauthorized'),
                },
            },
        },
        Forbidden: {
            description: 'Forbidden - insufficient permissions',
            content: {
                'application/json': {
                    schema: (0, exports.createErrorResponseSchema)(403, 'Insufficient permissions', 'Forbidden'),
                },
            },
        },
        NotFound: {
            description: 'Resource not found',
            content: {
                'application/json': {
                    schema: (0, exports.createErrorResponseSchema)(404, 'Resource not found', 'NotFound'),
                },
            },
        },
        ValidationError: {
            description: 'Validation error',
            content: {
                'application/json': {
                    schema: (0, exports.createValidationErrorResponseSchema)(),
                },
            },
        },
        InternalServerError: {
            description: 'Internal server error',
            content: {
                'application/json': {
                    schema: (0, exports.createErrorResponseSchema)(500, 'Internal server error', 'InternalServerError'),
                },
            },
        },
    };
};
exports.createCommonResponses = createCommonResponses;
/**
 * Creates complete IAM components for OpenAPI specification.
 *
 * @returns {object} Complete components object
 *
 * @example
 * ```typescript
 * const components = createIAMComponents();
 * // Use in OpenAPI spec components section
 * ```
 */
const createIAMComponents = () => {
    return {
        schemas: {
            User: (0, exports.createUserSchema)(false),
            UserCreate: (0, exports.createUserCreateSchema)(),
            UserUpdate: (0, exports.createUserUpdateSchema)(),
            Role: (0, exports.createRoleSchema)(),
            RoleCreate: (0, exports.createRoleCreateSchema)(),
            Permission: (0, exports.createPermissionSchema)(),
            PermissionCheck: (0, exports.createPermissionCheckSchema)(),
            PermissionCheckResponse: (0, exports.createPermissionCheckResponseSchema)(),
            PolicyDocument: (0, exports.createPolicyDocumentSchema)(),
            PolicyStatement: (0, exports.createPolicyStatementSchema)(),
            LoginRequest: (0, exports.createLoginRequestSchema)(),
            LoginResponse: (0, exports.createLoginResponseSchema)(),
            TokenRefresh: (0, exports.createTokenRefreshSchema)(),
            MFAEnrollment: (0, exports.createMFAEnrollmentSchema)(),
            MFAVerification: (0, exports.createMFAVerificationSchema)(),
            AuditLog: (0, exports.createAuditLogSchema)(),
            Session: (0, exports.createSessionSchema)(),
            Error: (0, exports.createErrorResponseSchema)(500, 'Error occurred', 'Error'),
            ValidationError: (0, exports.createValidationErrorResponseSchema)(),
        },
        responses: (0, exports.createCommonResponses)(),
        securitySchemes: {
            bearerAuth: (0, exports.createBearerSecurityScheme)(),
            apiKey: (0, exports.createApiKeySecurityScheme)(),
        },
    };
};
exports.createIAMComponents = createIAMComponents;
// ============================================================================
// ADDITIONAL IAM ENDPOINT DOCUMENTATION
// ============================================================================
/**
 * Creates OpenAPI operation documentation for Logout endpoint.
 *
 * @returns {object} OpenAPI operation object
 *
 * @example
 * ```typescript
 * const logoutOp = createLogoutEndpointDoc();
 * // Use for POST /auth/logout operation
 * ```
 */
const createLogoutEndpointDoc = () => {
    return {
        summary: 'User logout',
        description: 'Invalidates the current access token and refresh token',
        tags: ['Authentication'],
        security: [(0, exports.createBearerSecurityRequirement)()],
        responses: {
            200: {
                description: 'Logout successful',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                message: { type: 'string', example: 'Logout successful' },
                            },
                        },
                    },
                },
            },
            401: {
                description: 'Unauthorized',
            },
        },
    };
};
exports.createLogoutEndpointDoc = createLogoutEndpointDoc;
/**
 * Creates OpenAPI operation documentation for List Roles endpoint.
 *
 * @returns {object} OpenAPI operation object
 *
 * @example
 * ```typescript
 * const listRolesOp = createListRolesEndpointDoc();
 * // Use for GET /roles operation
 * ```
 */
const createListRolesEndpointDoc = () => {
    return {
        summary: 'List roles',
        description: 'Retrieves all available roles in the system',
        tags: ['Roles'],
        security: [(0, exports.createBearerSecurityRequirement)(['admin'])],
        parameters: [
            {
                name: 'includePermissions',
                in: 'query',
                schema: { type: 'boolean', default: false },
                description: 'Include permission details',
            },
        ],
        responses: {
            200: {
                description: 'List of roles',
                content: {
                    'application/json': {
                        schema: {
                            type: 'array',
                            items: (0, exports.createRoleSchema)(),
                        },
                    },
                },
            },
        },
    };
};
exports.createListRolesEndpointDoc = createListRolesEndpointDoc;
/**
 * Creates OpenAPI operation documentation for Update Role endpoint.
 *
 * @returns {object} OpenAPI operation object
 *
 * @example
 * ```typescript
 * const updateRoleOp = createUpdateRoleEndpointDoc();
 * // Use for PATCH /roles/:id operation
 * ```
 */
const createUpdateRoleEndpointDoc = () => {
    return {
        summary: 'Update role',
        description: 'Updates an existing role definition',
        tags: ['Roles'],
        security: [(0, exports.createBearerSecurityRequirement)(['admin'])],
        parameters: [
            {
                name: 'id',
                in: 'path',
                required: true,
                schema: { type: 'string', format: 'uuid' },
                description: 'Role ID',
            },
        ],
        requestBody: {
            required: true,
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            name: { type: 'string' },
                            description: { type: 'string' },
                            permissions: { type: 'array', items: { type: 'string' } },
                        },
                    },
                },
            },
        },
        responses: {
            200: {
                description: 'Role updated successfully',
                content: {
                    'application/json': {
                        schema: (0, exports.createRoleSchema)(),
                    },
                },
            },
            404: {
                description: 'Role not found',
            },
        },
    };
};
exports.createUpdateRoleEndpointDoc = createUpdateRoleEndpointDoc;
/**
 * Creates OpenAPI operation documentation for Assign Role endpoint.
 *
 * @returns {object} OpenAPI operation object
 *
 * @example
 * ```typescript
 * const assignRoleOp = createAssignRoleEndpointDoc();
 * // Use for POST /users/:userId/roles operation
 * ```
 */
const createAssignRoleEndpointDoc = () => {
    return {
        summary: 'Assign role to user',
        description: 'Assigns one or more roles to a user',
        tags: ['Users', 'Roles'],
        security: [(0, exports.createBearerSecurityRequirement)(['admin'])],
        parameters: [
            {
                name: 'userId',
                in: 'path',
                required: true,
                schema: { type: 'string', format: 'uuid' },
                description: 'User ID',
            },
        ],
        requestBody: {
            required: true,
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            roleIds: {
                                type: 'array',
                                items: { type: 'string', format: 'uuid' },
                                description: 'Role IDs to assign',
                            },
                        },
                        required: ['roleIds'],
                    },
                },
            },
        },
        responses: {
            200: {
                description: 'Roles assigned successfully',
                content: {
                    'application/json': {
                        schema: (0, exports.createUserSchema)(false),
                    },
                },
            },
        },
    };
};
exports.createAssignRoleEndpointDoc = createAssignRoleEndpointDoc;
/**
 * Creates OpenAPI schema for Password Reset Request.
 *
 * @returns {object} OpenAPI password reset request schema
 *
 * @example
 * ```typescript
 * const resetSchema = createPasswordResetRequestSchema();
 * // Use in POST /auth/password-reset/request
 * ```
 */
const createPasswordResetRequestSchema = () => {
    return {
        type: 'object',
        properties: {
            email: {
                type: 'string',
                format: 'email',
                description: 'Email address of the account',
                example: 'user@whitecross.com',
            },
        },
        required: ['email'],
        description: 'Password reset request',
    };
};
exports.createPasswordResetRequestSchema = createPasswordResetRequestSchema;
/**
 * Creates OpenAPI schema for Password Reset Confirmation.
 *
 * @returns {object} OpenAPI password reset confirmation schema
 *
 * @example
 * ```typescript
 * const confirmSchema = createPasswordResetConfirmSchema();
 * // Use in POST /auth/password-reset/confirm
 * ```
 */
const createPasswordResetConfirmSchema = () => {
    return {
        type: 'object',
        properties: {
            token: {
                type: 'string',
                description: 'Password reset token from email',
                example: 'reset-token-abc123',
            },
            newPassword: {
                type: 'string',
                format: 'password',
                minLength: 8,
                description: 'New password',
                example: 'NewSecureP@ssw0rd!',
            },
        },
        required: ['token', 'newPassword'],
        description: 'Password reset confirmation',
    };
};
exports.createPasswordResetConfirmSchema = createPasswordResetConfirmSchema;
/**
 * Creates OpenAPI schema for Email Verification.
 *
 * @returns {object} OpenAPI email verification schema
 *
 * @example
 * ```typescript
 * const verifySchema = createEmailVerificationSchema();
 * // Use in POST /auth/verify-email
 * ```
 */
const createEmailVerificationSchema = () => {
    return {
        type: 'object',
        properties: {
            token: {
                type: 'string',
                description: 'Email verification token',
                example: 'verify-token-xyz789',
            },
        },
        required: ['token'],
        description: 'Email verification request',
    };
};
exports.createEmailVerificationSchema = createEmailVerificationSchema;
/**
 * Creates OpenAPI schema for Token Introspection response.
 *
 * @returns {object} OpenAPI token introspection schema
 *
 * @example
 * ```typescript
 * const introspectSchema = createTokenIntrospectionSchema();
 * // Use in POST /auth/introspect response
 * ```
 */
const createTokenIntrospectionSchema = () => {
    return {
        type: 'object',
        properties: {
            active: {
                type: 'boolean',
                description: 'Whether the token is currently active',
                example: true,
            },
            scope: {
                type: 'string',
                nullable: true,
                description: 'Space-separated list of scopes',
                example: 'user:read user:write',
            },
            clientId: {
                type: 'string',
                nullable: true,
                description: 'Client identifier',
            },
            username: {
                type: 'string',
                nullable: true,
                description: 'Username of the token owner',
                example: 'jdoe',
            },
            tokenType: {
                type: 'string',
                nullable: true,
                description: 'Type of token',
                example: 'Bearer',
            },
            exp: {
                type: 'integer',
                nullable: true,
                description: 'Token expiration timestamp',
                example: 1704067200,
            },
            iat: {
                type: 'integer',
                nullable: true,
                description: 'Token issued at timestamp',
                example: 1704063600,
            },
            sub: {
                type: 'string',
                nullable: true,
                description: 'Subject (user ID)',
                example: 'user-uuid-123',
            },
        },
        required: ['active'],
        description: 'Token introspection result (RFC 7662)',
    };
};
exports.createTokenIntrospectionSchema = createTokenIntrospectionSchema;
/**
 * Creates OpenAPI schema for IP Whitelist entry.
 *
 * @returns {object} OpenAPI IP whitelist schema
 *
 * @example
 * ```typescript
 * const ipWhitelistSchema = createIPWhitelistSchema();
 * // Use for IP-based access control documentation
 * ```
 */
const createIPWhitelistSchema = () => {
    return {
        type: 'object',
        properties: {
            id: {
                type: 'string',
                format: 'uuid',
                description: 'Whitelist entry ID',
            },
            ipAddress: {
                type: 'string',
                description: 'IP address or CIDR range',
                example: '192.168.1.0/24',
            },
            description: {
                type: 'string',
                nullable: true,
                description: 'Description of this whitelist entry',
                example: 'Office network',
            },
            userId: {
                type: 'string',
                format: 'uuid',
                nullable: true,
                description: 'User this whitelist applies to (null for global)',
            },
            createdAt: {
                type: 'string',
                format: 'date-time',
                description: 'When the entry was created',
            },
            expiresAt: {
                type: 'string',
                format: 'date-time',
                nullable: true,
                description: 'Optional expiration timestamp',
            },
        },
        required: ['id', 'ipAddress', 'createdAt'],
        description: 'IP whitelist entry for access control',
    };
};
exports.createIPWhitelistSchema = createIPWhitelistSchema;
/**
 * Creates OpenAPI schema for Rate Limit information.
 *
 * @returns {object} OpenAPI rate limit schema
 *
 * @example
 * ```typescript
 * const rateLimitSchema = createRateLimitSchema();
 * // Use in response headers documentation
 * ```
 */
const createRateLimitSchema = () => {
    return {
        type: 'object',
        properties: {
            limit: {
                type: 'integer',
                description: 'Maximum requests allowed in the time window',
                example: 100,
            },
            remaining: {
                type: 'integer',
                description: 'Remaining requests in current window',
                example: 75,
            },
            reset: {
                type: 'integer',
                description: 'Unix timestamp when the limit resets',
                example: 1704067200,
            },
            retryAfter: {
                type: 'integer',
                nullable: true,
                description: 'Seconds to wait before retrying (when rate limited)',
                example: 60,
            },
        },
        description: 'Rate limiting information',
    };
};
exports.createRateLimitSchema = createRateLimitSchema;
/**
 * Creates rate limit response headers for OpenAPI documentation.
 *
 * @returns {object} OpenAPI headers object
 *
 * @example
 * ```typescript
 * const rateLimitHeaders = createRateLimitHeaders();
 * // Add to response headers in endpoint documentation
 * ```
 */
const createRateLimitHeaders = () => {
    return {
        'X-RateLimit-Limit': {
            schema: { type: 'integer' },
            description: 'Request limit per time window',
            example: 100,
        },
        'X-RateLimit-Remaining': {
            schema: { type: 'integer' },
            description: 'Remaining requests in current window',
            example: 75,
        },
        'X-RateLimit-Reset': {
            schema: { type: 'integer' },
            description: 'Unix timestamp when limit resets',
            example: 1704067200,
        },
        'Retry-After': {
            schema: { type: 'integer' },
            description: 'Seconds to wait before retrying (429 responses)',
            example: 60,
        },
    };
};
exports.createRateLimitHeaders = createRateLimitHeaders;
/**
 * Creates OpenAPI schema for OAuth2 scope definition.
 *
 * @param {Record<string, string>} scopes - Scope identifiers and descriptions
 * @returns {object} OAuth2 scopes object
 *
 * @example
 * ```typescript
 * const scopes = createOAuth2Scopes({
 *   'user:read': 'Read user information',
 *   'user:write': 'Modify user information',
 *   'admin': 'Full administrative access'
 * });
 * ```
 */
const createOAuth2Scopes = (scopes) => {
    return scopes;
};
exports.createOAuth2Scopes = createOAuth2Scopes;
// ============================================================================
// EXPORT DEFAULT
// ============================================================================
exports.default = {
    // User schemas
    createUserSchema: exports.createUserSchema,
    createUserCreateSchema: exports.createUserCreateSchema,
    createUserUpdateSchema: exports.createUserUpdateSchema,
    // Role schemas
    createRoleSchema: exports.createRoleSchema,
    createRoleCreateSchema: exports.createRoleCreateSchema,
    // Permission schemas
    createPermissionSchema: exports.createPermissionSchema,
    createPermissionCheckSchema: exports.createPermissionCheckSchema,
    createPermissionCheckResponseSchema: exports.createPermissionCheckResponseSchema,
    // Policy schemas
    createPolicyDocumentSchema: exports.createPolicyDocumentSchema,
    createPolicyStatementSchema: exports.createPolicyStatementSchema,
    // Authentication schemas
    createLoginRequestSchema: exports.createLoginRequestSchema,
    createLoginResponseSchema: exports.createLoginResponseSchema,
    createTokenRefreshSchema: exports.createTokenRefreshSchema,
    // MFA schemas
    createMFAEnrollmentSchema: exports.createMFAEnrollmentSchema,
    createMFAVerificationSchema: exports.createMFAVerificationSchema,
    // Audit log schemas
    createAuditLogSchema: exports.createAuditLogSchema,
    createAuditLogQueryParams: exports.createAuditLogQueryParams,
    // Session schemas
    createSessionSchema: exports.createSessionSchema,
    // Security schemes
    createBearerSecurityScheme: exports.createBearerSecurityScheme,
    createApiKeySecurityScheme: exports.createApiKeySecurityScheme,
    createOAuth2SecurityScheme: exports.createOAuth2SecurityScheme,
    // Security requirements
    createBearerSecurityRequirement: exports.createBearerSecurityRequirement,
    createApiKeySecurityRequirement: exports.createApiKeySecurityRequirement,
    createOAuth2SecurityRequirement: exports.createOAuth2SecurityRequirement,
    // Endpoint documentation
    createLoginEndpointDoc: exports.createLoginEndpointDoc,
    createGetCurrentUserEndpointDoc: exports.createGetCurrentUserEndpointDoc,
    createCreateUserEndpointDoc: exports.createCreateUserEndpointDoc,
    createListUsersEndpointDoc: exports.createListUsersEndpointDoc,
    createCheckPermissionEndpointDoc: exports.createCheckPermissionEndpointDoc,
    createEnrollMFAEndpointDoc: exports.createEnrollMFAEndpointDoc,
    createVerifyMFAEndpointDoc: exports.createVerifyMFAEndpointDoc,
    // Response schemas
    createErrorResponseSchema: exports.createErrorResponseSchema,
    createValidationErrorResponseSchema: exports.createValidationErrorResponseSchema,
    createPaginatedResponseSchema: exports.createPaginatedResponseSchema,
    // Swagger UI configuration
    createSwaggerUIConfig: exports.createSwaggerUIConfig,
    createOpenAPIDocumentConfig: exports.createOpenAPIDocumentConfig,
    createCommonResponses: exports.createCommonResponses,
    createIAMComponents: exports.createIAMComponents,
    // Additional endpoint documentation
    createLogoutEndpointDoc: exports.createLogoutEndpointDoc,
    createListRolesEndpointDoc: exports.createListRolesEndpointDoc,
    createUpdateRoleEndpointDoc: exports.createUpdateRoleEndpointDoc,
    createAssignRoleEndpointDoc: exports.createAssignRoleEndpointDoc,
    // Additional schemas
    createPasswordResetRequestSchema: exports.createPasswordResetRequestSchema,
    createPasswordResetConfirmSchema: exports.createPasswordResetConfirmSchema,
    createEmailVerificationSchema: exports.createEmailVerificationSchema,
    createTokenIntrospectionSchema: exports.createTokenIntrospectionSchema,
    createIPWhitelistSchema: exports.createIPWhitelistSchema,
    createRateLimitSchema: exports.createRateLimitSchema,
    createRateLimitHeaders: exports.createRateLimitHeaders,
    createOAuth2Scopes: exports.createOAuth2Scopes,
};
//# sourceMappingURL=iam-swagger-kit.js.map