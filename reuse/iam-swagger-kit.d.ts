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
export declare const createUserSchema: (includePassword?: boolean) => {
    type: string;
    properties: Record<string, any>;
    required: string[];
    description: string;
};
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
export declare const createUserCreateSchema: () => {
    type: string;
    properties: {
        email: {
            type: string;
            format: string;
            description: string;
            example: string;
        };
        username: {
            type: string;
            minLength: number;
            maxLength: number;
            description: string;
            example: string;
        };
        password: {
            type: string;
            format: string;
            minLength: number;
            description: string;
            example: string;
        };
        firstName: {
            type: string;
            description: string;
            example: string;
        };
        lastName: {
            type: string;
            description: string;
            example: string;
        };
        roles: {
            type: string;
            items: {
                type: string;
                format: string;
            };
            description: string;
            example: string[];
        };
    };
    required: string[];
    description: string;
};
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
export declare const createUserUpdateSchema: () => {
    type: string;
    properties: {
        email: {
            type: string;
            format: string;
            description: string;
        };
        firstName: {
            type: string;
            description: string;
        };
        lastName: {
            type: string;
            description: string;
        };
        status: {
            type: string;
            enum: string[];
            description: string;
        };
    };
    description: string;
};
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
export declare const createRoleSchema: () => {
    type: string;
    properties: {
        id: {
            type: string;
            format: string;
            description: string;
            example: string;
        };
        name: {
            type: string;
            description: string;
            example: string;
        };
        description: {
            type: string;
            description: string;
            example: string;
        };
        permissions: {
            type: string;
            items: {
                $ref: string;
            };
            description: string;
        };
        isSystem: {
            type: string;
            description: string;
            example: boolean;
        };
        createdAt: {
            type: string;
            format: string;
            description: string;
        };
        updatedAt: {
            type: string;
            format: string;
            description: string;
        };
    };
    required: string[];
    description: string;
};
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
export declare const createRoleCreateSchema: () => {
    type: string;
    properties: {
        name: {
            type: string;
            minLength: number;
            maxLength: number;
            description: string;
            example: string;
        };
        description: {
            type: string;
            maxLength: number;
            description: string;
            example: string;
        };
        permissions: {
            type: string;
            items: {
                type: string;
            };
            description: string;
            example: string[];
        };
    };
    required: string[];
    description: string;
};
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
export declare const createPermissionSchema: () => {
    type: string;
    properties: {
        id: {
            type: string;
            format: string;
            description: string;
            example: string;
        };
        resource: {
            type: string;
            description: string;
            example: string;
        };
        action: {
            type: string;
            enum: string[];
            description: string;
            example: string;
        };
        scope: {
            type: string;
            nullable: boolean;
            description: string;
            example: string;
        };
        description: {
            type: string;
            description: string;
            example: string;
        };
    };
    required: string[];
    description: string;
};
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
export declare const createPermissionCheckSchema: () => {
    type: string;
    properties: {
        userId: {
            type: string;
            format: string;
            description: string;
        };
        resource: {
            type: string;
            description: string;
            example: string;
        };
        action: {
            type: string;
            description: string;
            example: string;
        };
        resourceId: {
            type: string;
            nullable: boolean;
            description: string;
            example: string;
        };
    };
    required: string[];
    description: string;
};
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
export declare const createPermissionCheckResponseSchema: () => {
    type: string;
    properties: {
        allowed: {
            type: string;
            description: string;
            example: boolean;
        };
        reason: {
            type: string;
            nullable: boolean;
            description: string;
            example: string;
        };
        grantedBy: {
            type: string;
            items: {
                type: string;
            };
            description: string;
            example: string[];
        };
    };
    required: string[];
    description: string;
};
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
export declare const createPolicyDocumentSchema: () => {
    type: string;
    properties: {
        version: {
            type: string;
            description: string;
            example: string;
        };
        statements: {
            type: string;
            items: {
                $ref: string;
            };
            description: string;
        };
    };
    required: string[];
    description: string;
};
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
export declare const createPolicyStatementSchema: () => {
    type: string;
    properties: {
        effect: {
            type: string;
            enum: string[];
            description: string;
            example: string;
        };
        actions: {
            type: string;
            items: {
                type: string;
            };
            description: string;
            example: string[];
        };
        resources: {
            type: string;
            items: {
                type: string;
            };
            description: string;
            example: string[];
        };
        conditions: {
            type: string;
            additionalProperties: boolean;
            nullable: boolean;
            description: string;
            example: {
                ipAddress: string;
                timeOfDay: string;
            };
        };
    };
    required: string[];
    description: string;
};
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
export declare const createLoginRequestSchema: () => {
    type: string;
    properties: {
        email: {
            type: string;
            format: string;
            description: string;
            example: string;
        };
        password: {
            type: string;
            format: string;
            description: string;
            example: string;
        };
        mfaCode: {
            type: string;
            pattern: string;
            nullable: boolean;
            description: string;
            example: string;
        };
    };
    required: string[];
    description: string;
};
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
export declare const createLoginResponseSchema: () => {
    type: string;
    properties: {
        accessToken: {
            type: string;
            description: string;
            example: string;
        };
        refreshToken: {
            type: string;
            description: string;
            example: string;
        };
        tokenType: {
            type: string;
            description: string;
            example: string;
        };
        expiresIn: {
            type: string;
            description: string;
            example: number;
        };
        user: {
            $ref: string;
            description: string;
        };
    };
    required: string[];
    description: string;
};
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
export declare const createTokenRefreshSchema: () => {
    type: string;
    properties: {
        refreshToken: {
            type: string;
            description: string;
            example: string;
        };
    };
    required: string[];
    description: string;
};
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
export declare const createMFAEnrollmentSchema: () => {
    type: string;
    properties: {
        method: {
            type: string;
            enum: string[];
            description: string;
            example: string;
        };
        secret: {
            type: string;
            nullable: boolean;
            description: string;
            example: string;
        };
        qrCode: {
            type: string;
            nullable: boolean;
            description: string;
            example: string;
        };
        backupCodes: {
            type: string;
            items: {
                type: string;
            };
            nullable: boolean;
            description: string;
            example: string[];
        };
        phoneNumber: {
            type: string;
            nullable: boolean;
            description: string;
            example: string;
        };
    };
    required: string[];
    description: string;
};
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
export declare const createMFAVerificationSchema: () => {
    type: string;
    properties: {
        code: {
            type: string;
            pattern: string;
            description: string;
            example: string;
        };
        method: {
            type: string;
            enum: string[];
            description: string;
            example: string;
        };
    };
    required: string[];
    description: string;
};
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
export declare const createAuditLogSchema: () => {
    type: string;
    properties: {
        id: {
            type: string;
            format: string;
            description: string;
        };
        userId: {
            type: string;
            format: string;
            description: string;
        };
        action: {
            type: string;
            description: string;
            example: string;
        };
        resource: {
            type: string;
            description: string;
            example: string;
        };
        resourceId: {
            type: string;
            nullable: boolean;
            description: string;
            example: string;
        };
        result: {
            type: string;
            enum: string[];
            description: string;
            example: string;
        };
        ipAddress: {
            type: string;
            format: string;
            description: string;
            example: string;
        };
        userAgent: {
            type: string;
            description: string;
            example: string;
        };
        timestamp: {
            type: string;
            format: string;
            description: string;
            example: string;
        };
        metadata: {
            type: string;
            additionalProperties: boolean;
            nullable: boolean;
            description: string;
            example: {
                previousStatus: string;
                newStatus: string;
            };
        };
    };
    required: string[];
    description: string;
};
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
export declare const createAuditLogQueryParams: () => ({
    name: string;
    in: string;
    schema: {
        type: string;
        format: string;
        enum?: undefined;
        minimum?: undefined;
        default?: undefined;
        maximum?: undefined;
    };
    description: string;
} | {
    name: string;
    in: string;
    schema: {
        type: string;
        format?: undefined;
        enum?: undefined;
        minimum?: undefined;
        default?: undefined;
        maximum?: undefined;
    };
    description: string;
} | {
    name: string;
    in: string;
    schema: {
        type: string;
        enum: string[];
        format?: undefined;
        minimum?: undefined;
        default?: undefined;
        maximum?: undefined;
    };
    description: string;
} | {
    name: string;
    in: string;
    schema: {
        type: string;
        minimum: number;
        default: number;
        format?: undefined;
        enum?: undefined;
        maximum?: undefined;
    };
    description: string;
} | {
    name: string;
    in: string;
    schema: {
        type: string;
        minimum: number;
        maximum: number;
        default: number;
        format?: undefined;
        enum?: undefined;
    };
    description: string;
})[];
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
export declare const createSessionSchema: () => {
    type: string;
    properties: {
        id: {
            type: string;
            format: string;
            description: string;
        };
        userId: {
            type: string;
            format: string;
            description: string;
        };
        token: {
            type: string;
            description: string;
        };
        expiresAt: {
            type: string;
            format: string;
            description: string;
        };
        createdAt: {
            type: string;
            format: string;
            description: string;
        };
        ipAddress: {
            type: string;
            format: string;
            description: string;
        };
        userAgent: {
            type: string;
            description: string;
        };
        isActive: {
            type: string;
            description: string;
        };
    };
    required: string[];
    description: string;
};
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
export declare const createBearerSecurityScheme: (description?: string) => {
    type: string;
    scheme: string;
    bearerFormat: string;
    description: string;
};
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
export declare const createApiKeySecurityScheme: (headerName?: string, description?: string) => {
    type: string;
    in: string;
    name: string;
    description: string;
};
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
export declare const createOAuth2SecurityScheme: (authUrl: string, tokenUrl: string, scopes: Record<string, string>) => {
    type: string;
    flows: {
        authorizationCode: {
            authorizationUrl: string;
            tokenUrl: string;
            scopes: Record<string, string>;
        };
    };
    description: string;
};
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
export declare const createBearerSecurityRequirement: (scopes?: string[]) => {
    bearerAuth: string[];
};
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
export declare const createApiKeySecurityRequirement: () => {
    apiKey: never[];
};
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
export declare const createOAuth2SecurityRequirement: (requiredScopes: string[]) => {
    oauth2: string[];
};
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
export declare const createLoginEndpointDoc: () => {
    summary: string;
    description: string;
    tags: string[];
    requestBody: {
        required: boolean;
        content: {
            'application/json': {
                schema: {
                    type: string;
                    properties: {
                        email: {
                            type: string;
                            format: string;
                            description: string;
                            example: string;
                        };
                        password: {
                            type: string;
                            format: string;
                            description: string;
                            example: string;
                        };
                        mfaCode: {
                            type: string;
                            pattern: string;
                            nullable: boolean;
                            description: string;
                            example: string;
                        };
                    };
                    required: string[];
                    description: string;
                };
                examples: {
                    standard: {
                        summary: string;
                        value: {
                            email: string;
                            password: string;
                        };
                    };
                    withMFA: {
                        summary: string;
                        value: {
                            email: string;
                            password: string;
                            mfaCode: string;
                        };
                    };
                };
            };
        };
    };
    responses: {
        200: {
            description: string;
            content: {
                'application/json': {
                    schema: {
                        type: string;
                        properties: {
                            accessToken: {
                                type: string;
                                description: string;
                                example: string;
                            };
                            refreshToken: {
                                type: string;
                                description: string;
                                example: string;
                            };
                            tokenType: {
                                type: string;
                                description: string;
                                example: string;
                            };
                            expiresIn: {
                                type: string;
                                description: string;
                                example: number;
                            };
                            user: {
                                $ref: string;
                                description: string;
                            };
                        };
                        required: string[];
                        description: string;
                    };
                };
            };
        };
        401: {
            description: string;
            content: {
                'application/json': {
                    schema: {
                        type: string;
                        properties: {
                            statusCode: {
                                type: string;
                                example: number;
                            };
                            message: {
                                type: string;
                                example: string;
                            };
                            error: {
                                type: string;
                                example: string;
                            };
                        };
                    };
                };
            };
        };
        403: {
            description: string;
            content: {
                'application/json': {
                    schema: {
                        type: string;
                        properties: {
                            statusCode: {
                                type: string;
                                example: number;
                            };
                            message: {
                                type: string;
                                example: string;
                            };
                            error: {
                                type: string;
                                example: string;
                            };
                            mfaRequired: {
                                type: string;
                                example: boolean;
                            };
                        };
                    };
                };
            };
        };
    };
};
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
export declare const createGetCurrentUserEndpointDoc: () => {
    summary: string;
    description: string;
    tags: string[];
    security: {
        bearerAuth: string[];
    }[];
    responses: {
        200: {
            description: string;
            content: {
                'application/json': {
                    schema: {
                        type: string;
                        properties: Record<string, any>;
                        required: string[];
                        description: string;
                    };
                };
            };
        };
        401: {
            description: string;
        };
    };
};
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
export declare const createCreateUserEndpointDoc: () => {
    summary: string;
    description: string;
    tags: string[];
    security: {
        bearerAuth: string[];
    }[];
    requestBody: {
        required: boolean;
        content: {
            'application/json': {
                schema: {
                    type: string;
                    properties: {
                        email: {
                            type: string;
                            format: string;
                            description: string;
                            example: string;
                        };
                        username: {
                            type: string;
                            minLength: number;
                            maxLength: number;
                            description: string;
                            example: string;
                        };
                        password: {
                            type: string;
                            format: string;
                            minLength: number;
                            description: string;
                            example: string;
                        };
                        firstName: {
                            type: string;
                            description: string;
                            example: string;
                        };
                        lastName: {
                            type: string;
                            description: string;
                            example: string;
                        };
                        roles: {
                            type: string;
                            items: {
                                type: string;
                                format: string;
                            };
                            description: string;
                            example: string[];
                        };
                    };
                    required: string[];
                    description: string;
                };
            };
        };
    };
    responses: {
        201: {
            description: string;
            content: {
                'application/json': {
                    schema: {
                        type: string;
                        properties: Record<string, any>;
                        required: string[];
                        description: string;
                    };
                };
            };
        };
        400: {
            description: string;
        };
        409: {
            description: string;
        };
    };
};
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
export declare const createListUsersEndpointDoc: () => {
    summary: string;
    description: string;
    tags: string[];
    security: {
        bearerAuth: string[];
    }[];
    parameters: ({
        name: string;
        in: string;
        schema: {
            type: string;
            minimum: number;
            default: number;
            maximum?: undefined;
            enum?: undefined;
        };
        description: string;
    } | {
        name: string;
        in: string;
        schema: {
            type: string;
            minimum: number;
            maximum: number;
            default: number;
            enum?: undefined;
        };
        description: string;
    } | {
        name: string;
        in: string;
        schema: {
            type: string;
            enum: string[];
            minimum?: undefined;
            default?: undefined;
            maximum?: undefined;
        };
        description: string;
    } | {
        name: string;
        in: string;
        schema: {
            type: string;
            minimum?: undefined;
            default?: undefined;
            maximum?: undefined;
            enum?: undefined;
        };
        description: string;
    })[];
    responses: {
        200: {
            description: string;
            content: {
                'application/json': {
                    schema: {
                        type: string;
                        properties: {
                            data: {
                                type: string;
                                items: {
                                    type: string;
                                    properties: Record<string, any>;
                                    required: string[];
                                    description: string;
                                };
                            };
                            page: {
                                type: string;
                            };
                            limit: {
                                type: string;
                            };
                            total: {
                                type: string;
                            };
                            totalPages: {
                                type: string;
                            };
                        };
                    };
                };
            };
        };
    };
};
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
export declare const createCheckPermissionEndpointDoc: () => {
    summary: string;
    description: string;
    tags: string[];
    security: {
        bearerAuth: string[];
    }[];
    requestBody: {
        required: boolean;
        content: {
            'application/json': {
                schema: {
                    type: string;
                    properties: {
                        userId: {
                            type: string;
                            format: string;
                            description: string;
                        };
                        resource: {
                            type: string;
                            description: string;
                            example: string;
                        };
                        action: {
                            type: string;
                            description: string;
                            example: string;
                        };
                        resourceId: {
                            type: string;
                            nullable: boolean;
                            description: string;
                            example: string;
                        };
                    };
                    required: string[];
                    description: string;
                };
            };
        };
    };
    responses: {
        200: {
            description: string;
            content: {
                'application/json': {
                    schema: {
                        type: string;
                        properties: {
                            allowed: {
                                type: string;
                                description: string;
                                example: boolean;
                            };
                            reason: {
                                type: string;
                                nullable: boolean;
                                description: string;
                                example: string;
                            };
                            grantedBy: {
                                type: string;
                                items: {
                                    type: string;
                                };
                                description: string;
                                example: string[];
                            };
                        };
                        required: string[];
                        description: string;
                    };
                };
            };
        };
    };
};
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
export declare const createEnrollMFAEndpointDoc: () => {
    summary: string;
    description: string;
    tags: string[];
    security: {
        bearerAuth: string[];
    }[];
    requestBody: {
        required: boolean;
        content: {
            'application/json': {
                schema: {
                    type: string;
                    properties: {
                        method: {
                            type: string;
                            enum: string[];
                            description: string;
                        };
                        phoneNumber: {
                            type: string;
                            nullable: boolean;
                            description: string;
                        };
                    };
                    required: string[];
                };
            };
        };
    };
    responses: {
        200: {
            description: string;
            content: {
                'application/json': {
                    schema: {
                        type: string;
                        properties: {
                            method: {
                                type: string;
                                enum: string[];
                                description: string;
                                example: string;
                            };
                            secret: {
                                type: string;
                                nullable: boolean;
                                description: string;
                                example: string;
                            };
                            qrCode: {
                                type: string;
                                nullable: boolean;
                                description: string;
                                example: string;
                            };
                            backupCodes: {
                                type: string;
                                items: {
                                    type: string;
                                };
                                nullable: boolean;
                                description: string;
                                example: string[];
                            };
                            phoneNumber: {
                                type: string;
                                nullable: boolean;
                                description: string;
                                example: string;
                            };
                        };
                        required: string[];
                        description: string;
                    };
                };
            };
        };
    };
};
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
export declare const createVerifyMFAEndpointDoc: () => {
    summary: string;
    description: string;
    tags: string[];
    security: {
        bearerAuth: string[];
    }[];
    requestBody: {
        required: boolean;
        content: {
            'application/json': {
                schema: {
                    type: string;
                    properties: {
                        code: {
                            type: string;
                            pattern: string;
                            description: string;
                            example: string;
                        };
                        method: {
                            type: string;
                            enum: string[];
                            description: string;
                            example: string;
                        };
                    };
                    required: string[];
                    description: string;
                };
            };
        };
    };
    responses: {
        200: {
            description: string;
            content: {
                'application/json': {
                    schema: {
                        type: string;
                        properties: {
                            verified: {
                                type: string;
                                example: boolean;
                            };
                            message: {
                                type: string;
                                example: string;
                            };
                        };
                    };
                };
            };
        };
        401: {
            description: string;
        };
    };
};
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
export declare const createErrorResponseSchema: (statusCode: number, message: string, error?: string) => {
    type: string;
    properties: {
        statusCode: {
            type: string;
            example: number;
        };
        message: {
            type: string;
            example: string;
        };
        error: {
            type: string;
            example: string;
        };
        timestamp: {
            type: string;
            format: string;
            description: string;
        };
    };
    required: string[];
};
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
export declare const createValidationErrorResponseSchema: () => {
    type: string;
    properties: {
        statusCode: {
            type: string;
            example: number;
        };
        message: {
            type: string;
            example: string;
        };
        error: {
            type: string;
            example: string;
        };
        errors: {
            type: string;
            items: {
                type: string;
                properties: {
                    field: {
                        type: string;
                        example: string;
                    };
                    message: {
                        type: string;
                        example: string;
                    };
                    value: {
                        type: string;
                        nullable: boolean;
                    };
                };
            };
        };
    };
};
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
export declare const createPaginatedResponseSchema: (itemSchema: object, description?: string) => {
    type: string;
    properties: {
        data: {
            type: string;
            items: object;
            description: string;
        };
        page: {
            type: string;
            description: string;
            example: number;
        };
        limit: {
            type: string;
            description: string;
            example: number;
        };
        total: {
            type: string;
            description: string;
            example: number;
        };
        totalPages: {
            type: string;
            description: string;
            example: number;
        };
    };
    required: string[];
    description: string;
};
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
export declare const createSwaggerUIConfig: (customOptions?: Record<string, unknown>) => {
    customSiteTitle: {};
    customCss: {};
    customfavIcon: {};
    swaggerOptions: any;
};
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
export declare const createOpenAPIDocumentConfig: (title: string, version: string, description: string) => {
    openapi: string;
    info: {
        title: string;
        version: string;
        description: string;
        contact: {
            name: string;
            email: string;
        };
        license: {
            name: string;
        };
    };
    servers: {
        url: string;
        description: string;
    }[];
    tags: {
        name: string;
        description: string;
    }[];
};
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
export declare const createCommonResponses: () => {
    Unauthorized: {
        description: string;
        content: {
            'application/json': {
                schema: {
                    type: string;
                    properties: {
                        statusCode: {
                            type: string;
                            example: number;
                        };
                        message: {
                            type: string;
                            example: string;
                        };
                        error: {
                            type: string;
                            example: string;
                        };
                        timestamp: {
                            type: string;
                            format: string;
                            description: string;
                        };
                    };
                    required: string[];
                };
            };
        };
    };
    Forbidden: {
        description: string;
        content: {
            'application/json': {
                schema: {
                    type: string;
                    properties: {
                        statusCode: {
                            type: string;
                            example: number;
                        };
                        message: {
                            type: string;
                            example: string;
                        };
                        error: {
                            type: string;
                            example: string;
                        };
                        timestamp: {
                            type: string;
                            format: string;
                            description: string;
                        };
                    };
                    required: string[];
                };
            };
        };
    };
    NotFound: {
        description: string;
        content: {
            'application/json': {
                schema: {
                    type: string;
                    properties: {
                        statusCode: {
                            type: string;
                            example: number;
                        };
                        message: {
                            type: string;
                            example: string;
                        };
                        error: {
                            type: string;
                            example: string;
                        };
                        timestamp: {
                            type: string;
                            format: string;
                            description: string;
                        };
                    };
                    required: string[];
                };
            };
        };
    };
    ValidationError: {
        description: string;
        content: {
            'application/json': {
                schema: {
                    type: string;
                    properties: {
                        statusCode: {
                            type: string;
                            example: number;
                        };
                        message: {
                            type: string;
                            example: string;
                        };
                        error: {
                            type: string;
                            example: string;
                        };
                        errors: {
                            type: string;
                            items: {
                                type: string;
                                properties: {
                                    field: {
                                        type: string;
                                        example: string;
                                    };
                                    message: {
                                        type: string;
                                        example: string;
                                    };
                                    value: {
                                        type: string;
                                        nullable: boolean;
                                    };
                                };
                            };
                        };
                    };
                };
            };
        };
    };
    InternalServerError: {
        description: string;
        content: {
            'application/json': {
                schema: {
                    type: string;
                    properties: {
                        statusCode: {
                            type: string;
                            example: number;
                        };
                        message: {
                            type: string;
                            example: string;
                        };
                        error: {
                            type: string;
                            example: string;
                        };
                        timestamp: {
                            type: string;
                            format: string;
                            description: string;
                        };
                    };
                    required: string[];
                };
            };
        };
    };
};
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
export declare const createIAMComponents: () => {
    schemas: {
        User: {
            type: string;
            properties: Record<string, any>;
            required: string[];
            description: string;
        };
        UserCreate: {
            type: string;
            properties: {
                email: {
                    type: string;
                    format: string;
                    description: string;
                    example: string;
                };
                username: {
                    type: string;
                    minLength: number;
                    maxLength: number;
                    description: string;
                    example: string;
                };
                password: {
                    type: string;
                    format: string;
                    minLength: number;
                    description: string;
                    example: string;
                };
                firstName: {
                    type: string;
                    description: string;
                    example: string;
                };
                lastName: {
                    type: string;
                    description: string;
                    example: string;
                };
                roles: {
                    type: string;
                    items: {
                        type: string;
                        format: string;
                    };
                    description: string;
                    example: string[];
                };
            };
            required: string[];
            description: string;
        };
        UserUpdate: {
            type: string;
            properties: {
                email: {
                    type: string;
                    format: string;
                    description: string;
                };
                firstName: {
                    type: string;
                    description: string;
                };
                lastName: {
                    type: string;
                    description: string;
                };
                status: {
                    type: string;
                    enum: string[];
                    description: string;
                };
            };
            description: string;
        };
        Role: {
            type: string;
            properties: {
                id: {
                    type: string;
                    format: string;
                    description: string;
                    example: string;
                };
                name: {
                    type: string;
                    description: string;
                    example: string;
                };
                description: {
                    type: string;
                    description: string;
                    example: string;
                };
                permissions: {
                    type: string;
                    items: {
                        $ref: string;
                    };
                    description: string;
                };
                isSystem: {
                    type: string;
                    description: string;
                    example: boolean;
                };
                createdAt: {
                    type: string;
                    format: string;
                    description: string;
                };
                updatedAt: {
                    type: string;
                    format: string;
                    description: string;
                };
            };
            required: string[];
            description: string;
        };
        RoleCreate: {
            type: string;
            properties: {
                name: {
                    type: string;
                    minLength: number;
                    maxLength: number;
                    description: string;
                    example: string;
                };
                description: {
                    type: string;
                    maxLength: number;
                    description: string;
                    example: string;
                };
                permissions: {
                    type: string;
                    items: {
                        type: string;
                    };
                    description: string;
                    example: string[];
                };
            };
            required: string[];
            description: string;
        };
        Permission: {
            type: string;
            properties: {
                id: {
                    type: string;
                    format: string;
                    description: string;
                    example: string;
                };
                resource: {
                    type: string;
                    description: string;
                    example: string;
                };
                action: {
                    type: string;
                    enum: string[];
                    description: string;
                    example: string;
                };
                scope: {
                    type: string;
                    nullable: boolean;
                    description: string;
                    example: string;
                };
                description: {
                    type: string;
                    description: string;
                    example: string;
                };
            };
            required: string[];
            description: string;
        };
        PermissionCheck: {
            type: string;
            properties: {
                userId: {
                    type: string;
                    format: string;
                    description: string;
                };
                resource: {
                    type: string;
                    description: string;
                    example: string;
                };
                action: {
                    type: string;
                    description: string;
                    example: string;
                };
                resourceId: {
                    type: string;
                    nullable: boolean;
                    description: string;
                    example: string;
                };
            };
            required: string[];
            description: string;
        };
        PermissionCheckResponse: {
            type: string;
            properties: {
                allowed: {
                    type: string;
                    description: string;
                    example: boolean;
                };
                reason: {
                    type: string;
                    nullable: boolean;
                    description: string;
                    example: string;
                };
                grantedBy: {
                    type: string;
                    items: {
                        type: string;
                    };
                    description: string;
                    example: string[];
                };
            };
            required: string[];
            description: string;
        };
        PolicyDocument: {
            type: string;
            properties: {
                version: {
                    type: string;
                    description: string;
                    example: string;
                };
                statements: {
                    type: string;
                    items: {
                        $ref: string;
                    };
                    description: string;
                };
            };
            required: string[];
            description: string;
        };
        PolicyStatement: {
            type: string;
            properties: {
                effect: {
                    type: string;
                    enum: string[];
                    description: string;
                    example: string;
                };
                actions: {
                    type: string;
                    items: {
                        type: string;
                    };
                    description: string;
                    example: string[];
                };
                resources: {
                    type: string;
                    items: {
                        type: string;
                    };
                    description: string;
                    example: string[];
                };
                conditions: {
                    type: string;
                    additionalProperties: boolean;
                    nullable: boolean;
                    description: string;
                    example: {
                        ipAddress: string;
                        timeOfDay: string;
                    };
                };
            };
            required: string[];
            description: string;
        };
        LoginRequest: {
            type: string;
            properties: {
                email: {
                    type: string;
                    format: string;
                    description: string;
                    example: string;
                };
                password: {
                    type: string;
                    format: string;
                    description: string;
                    example: string;
                };
                mfaCode: {
                    type: string;
                    pattern: string;
                    nullable: boolean;
                    description: string;
                    example: string;
                };
            };
            required: string[];
            description: string;
        };
        LoginResponse: {
            type: string;
            properties: {
                accessToken: {
                    type: string;
                    description: string;
                    example: string;
                };
                refreshToken: {
                    type: string;
                    description: string;
                    example: string;
                };
                tokenType: {
                    type: string;
                    description: string;
                    example: string;
                };
                expiresIn: {
                    type: string;
                    description: string;
                    example: number;
                };
                user: {
                    $ref: string;
                    description: string;
                };
            };
            required: string[];
            description: string;
        };
        TokenRefresh: {
            type: string;
            properties: {
                refreshToken: {
                    type: string;
                    description: string;
                    example: string;
                };
            };
            required: string[];
            description: string;
        };
        MFAEnrollment: {
            type: string;
            properties: {
                method: {
                    type: string;
                    enum: string[];
                    description: string;
                    example: string;
                };
                secret: {
                    type: string;
                    nullable: boolean;
                    description: string;
                    example: string;
                };
                qrCode: {
                    type: string;
                    nullable: boolean;
                    description: string;
                    example: string;
                };
                backupCodes: {
                    type: string;
                    items: {
                        type: string;
                    };
                    nullable: boolean;
                    description: string;
                    example: string[];
                };
                phoneNumber: {
                    type: string;
                    nullable: boolean;
                    description: string;
                    example: string;
                };
            };
            required: string[];
            description: string;
        };
        MFAVerification: {
            type: string;
            properties: {
                code: {
                    type: string;
                    pattern: string;
                    description: string;
                    example: string;
                };
                method: {
                    type: string;
                    enum: string[];
                    description: string;
                    example: string;
                };
            };
            required: string[];
            description: string;
        };
        AuditLog: {
            type: string;
            properties: {
                id: {
                    type: string;
                    format: string;
                    description: string;
                };
                userId: {
                    type: string;
                    format: string;
                    description: string;
                };
                action: {
                    type: string;
                    description: string;
                    example: string;
                };
                resource: {
                    type: string;
                    description: string;
                    example: string;
                };
                resourceId: {
                    type: string;
                    nullable: boolean;
                    description: string;
                    example: string;
                };
                result: {
                    type: string;
                    enum: string[];
                    description: string;
                    example: string;
                };
                ipAddress: {
                    type: string;
                    format: string;
                    description: string;
                    example: string;
                };
                userAgent: {
                    type: string;
                    description: string;
                    example: string;
                };
                timestamp: {
                    type: string;
                    format: string;
                    description: string;
                    example: string;
                };
                metadata: {
                    type: string;
                    additionalProperties: boolean;
                    nullable: boolean;
                    description: string;
                    example: {
                        previousStatus: string;
                        newStatus: string;
                    };
                };
            };
            required: string[];
            description: string;
        };
        Session: {
            type: string;
            properties: {
                id: {
                    type: string;
                    format: string;
                    description: string;
                };
                userId: {
                    type: string;
                    format: string;
                    description: string;
                };
                token: {
                    type: string;
                    description: string;
                };
                expiresAt: {
                    type: string;
                    format: string;
                    description: string;
                };
                createdAt: {
                    type: string;
                    format: string;
                    description: string;
                };
                ipAddress: {
                    type: string;
                    format: string;
                    description: string;
                };
                userAgent: {
                    type: string;
                    description: string;
                };
                isActive: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
            description: string;
        };
        Error: {
            type: string;
            properties: {
                statusCode: {
                    type: string;
                    example: number;
                };
                message: {
                    type: string;
                    example: string;
                };
                error: {
                    type: string;
                    example: string;
                };
                timestamp: {
                    type: string;
                    format: string;
                    description: string;
                };
            };
            required: string[];
        };
        ValidationError: {
            type: string;
            properties: {
                statusCode: {
                    type: string;
                    example: number;
                };
                message: {
                    type: string;
                    example: string;
                };
                error: {
                    type: string;
                    example: string;
                };
                errors: {
                    type: string;
                    items: {
                        type: string;
                        properties: {
                            field: {
                                type: string;
                                example: string;
                            };
                            message: {
                                type: string;
                                example: string;
                            };
                            value: {
                                type: string;
                                nullable: boolean;
                            };
                        };
                    };
                };
            };
        };
    };
    responses: {
        Unauthorized: {
            description: string;
            content: {
                'application/json': {
                    schema: {
                        type: string;
                        properties: {
                            statusCode: {
                                type: string;
                                example: number;
                            };
                            message: {
                                type: string;
                                example: string;
                            };
                            error: {
                                type: string;
                                example: string;
                            };
                            timestamp: {
                                type: string;
                                format: string;
                                description: string;
                            };
                        };
                        required: string[];
                    };
                };
            };
        };
        Forbidden: {
            description: string;
            content: {
                'application/json': {
                    schema: {
                        type: string;
                        properties: {
                            statusCode: {
                                type: string;
                                example: number;
                            };
                            message: {
                                type: string;
                                example: string;
                            };
                            error: {
                                type: string;
                                example: string;
                            };
                            timestamp: {
                                type: string;
                                format: string;
                                description: string;
                            };
                        };
                        required: string[];
                    };
                };
            };
        };
        NotFound: {
            description: string;
            content: {
                'application/json': {
                    schema: {
                        type: string;
                        properties: {
                            statusCode: {
                                type: string;
                                example: number;
                            };
                            message: {
                                type: string;
                                example: string;
                            };
                            error: {
                                type: string;
                                example: string;
                            };
                            timestamp: {
                                type: string;
                                format: string;
                                description: string;
                            };
                        };
                        required: string[];
                    };
                };
            };
        };
        ValidationError: {
            description: string;
            content: {
                'application/json': {
                    schema: {
                        type: string;
                        properties: {
                            statusCode: {
                                type: string;
                                example: number;
                            };
                            message: {
                                type: string;
                                example: string;
                            };
                            error: {
                                type: string;
                                example: string;
                            };
                            errors: {
                                type: string;
                                items: {
                                    type: string;
                                    properties: {
                                        field: {
                                            type: string;
                                            example: string;
                                        };
                                        message: {
                                            type: string;
                                            example: string;
                                        };
                                        value: {
                                            type: string;
                                            nullable: boolean;
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
        };
        InternalServerError: {
            description: string;
            content: {
                'application/json': {
                    schema: {
                        type: string;
                        properties: {
                            statusCode: {
                                type: string;
                                example: number;
                            };
                            message: {
                                type: string;
                                example: string;
                            };
                            error: {
                                type: string;
                                example: string;
                            };
                            timestamp: {
                                type: string;
                                format: string;
                                description: string;
                            };
                        };
                        required: string[];
                    };
                };
            };
        };
    };
    securitySchemes: {
        bearerAuth: {
            type: string;
            scheme: string;
            bearerFormat: string;
            description: string;
        };
        apiKey: {
            type: string;
            in: string;
            name: string;
            description: string;
        };
    };
};
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
export declare const createLogoutEndpointDoc: () => {
    summary: string;
    description: string;
    tags: string[];
    security: {
        bearerAuth: string[];
    }[];
    responses: {
        200: {
            description: string;
            content: {
                'application/json': {
                    schema: {
                        type: string;
                        properties: {
                            message: {
                                type: string;
                                example: string;
                            };
                        };
                    };
                };
            };
        };
        401: {
            description: string;
        };
    };
};
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
export declare const createListRolesEndpointDoc: () => {
    summary: string;
    description: string;
    tags: string[];
    security: {
        bearerAuth: string[];
    }[];
    parameters: {
        name: string;
        in: string;
        schema: {
            type: string;
            default: boolean;
        };
        description: string;
    }[];
    responses: {
        200: {
            description: string;
            content: {
                'application/json': {
                    schema: {
                        type: string;
                        items: {
                            type: string;
                            properties: {
                                id: {
                                    type: string;
                                    format: string;
                                    description: string;
                                    example: string;
                                };
                                name: {
                                    type: string;
                                    description: string;
                                    example: string;
                                };
                                description: {
                                    type: string;
                                    description: string;
                                    example: string;
                                };
                                permissions: {
                                    type: string;
                                    items: {
                                        $ref: string;
                                    };
                                    description: string;
                                };
                                isSystem: {
                                    type: string;
                                    description: string;
                                    example: boolean;
                                };
                                createdAt: {
                                    type: string;
                                    format: string;
                                    description: string;
                                };
                                updatedAt: {
                                    type: string;
                                    format: string;
                                    description: string;
                                };
                            };
                            required: string[];
                            description: string;
                        };
                    };
                };
            };
        };
    };
};
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
export declare const createUpdateRoleEndpointDoc: () => {
    summary: string;
    description: string;
    tags: string[];
    security: {
        bearerAuth: string[];
    }[];
    parameters: {
        name: string;
        in: string;
        required: boolean;
        schema: {
            type: string;
            format: string;
        };
        description: string;
    }[];
    requestBody: {
        required: boolean;
        content: {
            'application/json': {
                schema: {
                    type: string;
                    properties: {
                        name: {
                            type: string;
                        };
                        description: {
                            type: string;
                        };
                        permissions: {
                            type: string;
                            items: {
                                type: string;
                            };
                        };
                    };
                };
            };
        };
    };
    responses: {
        200: {
            description: string;
            content: {
                'application/json': {
                    schema: {
                        type: string;
                        properties: {
                            id: {
                                type: string;
                                format: string;
                                description: string;
                                example: string;
                            };
                            name: {
                                type: string;
                                description: string;
                                example: string;
                            };
                            description: {
                                type: string;
                                description: string;
                                example: string;
                            };
                            permissions: {
                                type: string;
                                items: {
                                    $ref: string;
                                };
                                description: string;
                            };
                            isSystem: {
                                type: string;
                                description: string;
                                example: boolean;
                            };
                            createdAt: {
                                type: string;
                                format: string;
                                description: string;
                            };
                            updatedAt: {
                                type: string;
                                format: string;
                                description: string;
                            };
                        };
                        required: string[];
                        description: string;
                    };
                };
            };
        };
        404: {
            description: string;
        };
    };
};
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
export declare const createAssignRoleEndpointDoc: () => {
    summary: string;
    description: string;
    tags: string[];
    security: {
        bearerAuth: string[];
    }[];
    parameters: {
        name: string;
        in: string;
        required: boolean;
        schema: {
            type: string;
            format: string;
        };
        description: string;
    }[];
    requestBody: {
        required: boolean;
        content: {
            'application/json': {
                schema: {
                    type: string;
                    properties: {
                        roleIds: {
                            type: string;
                            items: {
                                type: string;
                                format: string;
                            };
                            description: string;
                        };
                    };
                    required: string[];
                };
            };
        };
    };
    responses: {
        200: {
            description: string;
            content: {
                'application/json': {
                    schema: {
                        type: string;
                        properties: Record<string, any>;
                        required: string[];
                        description: string;
                    };
                };
            };
        };
    };
};
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
export declare const createPasswordResetRequestSchema: () => {
    type: string;
    properties: {
        email: {
            type: string;
            format: string;
            description: string;
            example: string;
        };
    };
    required: string[];
    description: string;
};
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
export declare const createPasswordResetConfirmSchema: () => {
    type: string;
    properties: {
        token: {
            type: string;
            description: string;
            example: string;
        };
        newPassword: {
            type: string;
            format: string;
            minLength: number;
            description: string;
            example: string;
        };
    };
    required: string[];
    description: string;
};
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
export declare const createEmailVerificationSchema: () => {
    type: string;
    properties: {
        token: {
            type: string;
            description: string;
            example: string;
        };
    };
    required: string[];
    description: string;
};
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
export declare const createTokenIntrospectionSchema: () => {
    type: string;
    properties: {
        active: {
            type: string;
            description: string;
            example: boolean;
        };
        scope: {
            type: string;
            nullable: boolean;
            description: string;
            example: string;
        };
        clientId: {
            type: string;
            nullable: boolean;
            description: string;
        };
        username: {
            type: string;
            nullable: boolean;
            description: string;
            example: string;
        };
        tokenType: {
            type: string;
            nullable: boolean;
            description: string;
            example: string;
        };
        exp: {
            type: string;
            nullable: boolean;
            description: string;
            example: number;
        };
        iat: {
            type: string;
            nullable: boolean;
            description: string;
            example: number;
        };
        sub: {
            type: string;
            nullable: boolean;
            description: string;
            example: string;
        };
    };
    required: string[];
    description: string;
};
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
export declare const createIPWhitelistSchema: () => {
    type: string;
    properties: {
        id: {
            type: string;
            format: string;
            description: string;
        };
        ipAddress: {
            type: string;
            description: string;
            example: string;
        };
        description: {
            type: string;
            nullable: boolean;
            description: string;
            example: string;
        };
        userId: {
            type: string;
            format: string;
            nullable: boolean;
            description: string;
        };
        createdAt: {
            type: string;
            format: string;
            description: string;
        };
        expiresAt: {
            type: string;
            format: string;
            nullable: boolean;
            description: string;
        };
    };
    required: string[];
    description: string;
};
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
export declare const createRateLimitSchema: () => {
    type: string;
    properties: {
        limit: {
            type: string;
            description: string;
            example: number;
        };
        remaining: {
            type: string;
            description: string;
            example: number;
        };
        reset: {
            type: string;
            description: string;
            example: number;
        };
        retryAfter: {
            type: string;
            nullable: boolean;
            description: string;
            example: number;
        };
    };
    description: string;
};
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
export declare const createRateLimitHeaders: () => {
    'X-RateLimit-Limit': {
        schema: {
            type: string;
        };
        description: string;
        example: number;
    };
    'X-RateLimit-Remaining': {
        schema: {
            type: string;
        };
        description: string;
        example: number;
    };
    'X-RateLimit-Reset': {
        schema: {
            type: string;
        };
        description: string;
        example: number;
    };
    'Retry-After': {
        schema: {
            type: string;
        };
        description: string;
        example: number;
    };
};
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
export declare const createOAuth2Scopes: (scopes: Record<string, string>) => Record<string, string>;
declare const _default: {
    createUserSchema: (includePassword?: boolean) => {
        type: string;
        properties: Record<string, any>;
        required: string[];
        description: string;
    };
    createUserCreateSchema: () => {
        type: string;
        properties: {
            email: {
                type: string;
                format: string;
                description: string;
                example: string;
            };
            username: {
                type: string;
                minLength: number;
                maxLength: number;
                description: string;
                example: string;
            };
            password: {
                type: string;
                format: string;
                minLength: number;
                description: string;
                example: string;
            };
            firstName: {
                type: string;
                description: string;
                example: string;
            };
            lastName: {
                type: string;
                description: string;
                example: string;
            };
            roles: {
                type: string;
                items: {
                    type: string;
                    format: string;
                };
                description: string;
                example: string[];
            };
        };
        required: string[];
        description: string;
    };
    createUserUpdateSchema: () => {
        type: string;
        properties: {
            email: {
                type: string;
                format: string;
                description: string;
            };
            firstName: {
                type: string;
                description: string;
            };
            lastName: {
                type: string;
                description: string;
            };
            status: {
                type: string;
                enum: string[];
                description: string;
            };
        };
        description: string;
    };
    createRoleSchema: () => {
        type: string;
        properties: {
            id: {
                type: string;
                format: string;
                description: string;
                example: string;
            };
            name: {
                type: string;
                description: string;
                example: string;
            };
            description: {
                type: string;
                description: string;
                example: string;
            };
            permissions: {
                type: string;
                items: {
                    $ref: string;
                };
                description: string;
            };
            isSystem: {
                type: string;
                description: string;
                example: boolean;
            };
            createdAt: {
                type: string;
                format: string;
                description: string;
            };
            updatedAt: {
                type: string;
                format: string;
                description: string;
            };
        };
        required: string[];
        description: string;
    };
    createRoleCreateSchema: () => {
        type: string;
        properties: {
            name: {
                type: string;
                minLength: number;
                maxLength: number;
                description: string;
                example: string;
            };
            description: {
                type: string;
                maxLength: number;
                description: string;
                example: string;
            };
            permissions: {
                type: string;
                items: {
                    type: string;
                };
                description: string;
                example: string[];
            };
        };
        required: string[];
        description: string;
    };
    createPermissionSchema: () => {
        type: string;
        properties: {
            id: {
                type: string;
                format: string;
                description: string;
                example: string;
            };
            resource: {
                type: string;
                description: string;
                example: string;
            };
            action: {
                type: string;
                enum: string[];
                description: string;
                example: string;
            };
            scope: {
                type: string;
                nullable: boolean;
                description: string;
                example: string;
            };
            description: {
                type: string;
                description: string;
                example: string;
            };
        };
        required: string[];
        description: string;
    };
    createPermissionCheckSchema: () => {
        type: string;
        properties: {
            userId: {
                type: string;
                format: string;
                description: string;
            };
            resource: {
                type: string;
                description: string;
                example: string;
            };
            action: {
                type: string;
                description: string;
                example: string;
            };
            resourceId: {
                type: string;
                nullable: boolean;
                description: string;
                example: string;
            };
        };
        required: string[];
        description: string;
    };
    createPermissionCheckResponseSchema: () => {
        type: string;
        properties: {
            allowed: {
                type: string;
                description: string;
                example: boolean;
            };
            reason: {
                type: string;
                nullable: boolean;
                description: string;
                example: string;
            };
            grantedBy: {
                type: string;
                items: {
                    type: string;
                };
                description: string;
                example: string[];
            };
        };
        required: string[];
        description: string;
    };
    createPolicyDocumentSchema: () => {
        type: string;
        properties: {
            version: {
                type: string;
                description: string;
                example: string;
            };
            statements: {
                type: string;
                items: {
                    $ref: string;
                };
                description: string;
            };
        };
        required: string[];
        description: string;
    };
    createPolicyStatementSchema: () => {
        type: string;
        properties: {
            effect: {
                type: string;
                enum: string[];
                description: string;
                example: string;
            };
            actions: {
                type: string;
                items: {
                    type: string;
                };
                description: string;
                example: string[];
            };
            resources: {
                type: string;
                items: {
                    type: string;
                };
                description: string;
                example: string[];
            };
            conditions: {
                type: string;
                additionalProperties: boolean;
                nullable: boolean;
                description: string;
                example: {
                    ipAddress: string;
                    timeOfDay: string;
                };
            };
        };
        required: string[];
        description: string;
    };
    createLoginRequestSchema: () => {
        type: string;
        properties: {
            email: {
                type: string;
                format: string;
                description: string;
                example: string;
            };
            password: {
                type: string;
                format: string;
                description: string;
                example: string;
            };
            mfaCode: {
                type: string;
                pattern: string;
                nullable: boolean;
                description: string;
                example: string;
            };
        };
        required: string[];
        description: string;
    };
    createLoginResponseSchema: () => {
        type: string;
        properties: {
            accessToken: {
                type: string;
                description: string;
                example: string;
            };
            refreshToken: {
                type: string;
                description: string;
                example: string;
            };
            tokenType: {
                type: string;
                description: string;
                example: string;
            };
            expiresIn: {
                type: string;
                description: string;
                example: number;
            };
            user: {
                $ref: string;
                description: string;
            };
        };
        required: string[];
        description: string;
    };
    createTokenRefreshSchema: () => {
        type: string;
        properties: {
            refreshToken: {
                type: string;
                description: string;
                example: string;
            };
        };
        required: string[];
        description: string;
    };
    createMFAEnrollmentSchema: () => {
        type: string;
        properties: {
            method: {
                type: string;
                enum: string[];
                description: string;
                example: string;
            };
            secret: {
                type: string;
                nullable: boolean;
                description: string;
                example: string;
            };
            qrCode: {
                type: string;
                nullable: boolean;
                description: string;
                example: string;
            };
            backupCodes: {
                type: string;
                items: {
                    type: string;
                };
                nullable: boolean;
                description: string;
                example: string[];
            };
            phoneNumber: {
                type: string;
                nullable: boolean;
                description: string;
                example: string;
            };
        };
        required: string[];
        description: string;
    };
    createMFAVerificationSchema: () => {
        type: string;
        properties: {
            code: {
                type: string;
                pattern: string;
                description: string;
                example: string;
            };
            method: {
                type: string;
                enum: string[];
                description: string;
                example: string;
            };
        };
        required: string[];
        description: string;
    };
    createAuditLogSchema: () => {
        type: string;
        properties: {
            id: {
                type: string;
                format: string;
                description: string;
            };
            userId: {
                type: string;
                format: string;
                description: string;
            };
            action: {
                type: string;
                description: string;
                example: string;
            };
            resource: {
                type: string;
                description: string;
                example: string;
            };
            resourceId: {
                type: string;
                nullable: boolean;
                description: string;
                example: string;
            };
            result: {
                type: string;
                enum: string[];
                description: string;
                example: string;
            };
            ipAddress: {
                type: string;
                format: string;
                description: string;
                example: string;
            };
            userAgent: {
                type: string;
                description: string;
                example: string;
            };
            timestamp: {
                type: string;
                format: string;
                description: string;
                example: string;
            };
            metadata: {
                type: string;
                additionalProperties: boolean;
                nullable: boolean;
                description: string;
                example: {
                    previousStatus: string;
                    newStatus: string;
                };
            };
        };
        required: string[];
        description: string;
    };
    createAuditLogQueryParams: () => ({
        name: string;
        in: string;
        schema: {
            type: string;
            format: string;
            enum?: undefined;
            minimum?: undefined;
            default?: undefined;
            maximum?: undefined;
        };
        description: string;
    } | {
        name: string;
        in: string;
        schema: {
            type: string;
            format?: undefined;
            enum?: undefined;
            minimum?: undefined;
            default?: undefined;
            maximum?: undefined;
        };
        description: string;
    } | {
        name: string;
        in: string;
        schema: {
            type: string;
            enum: string[];
            format?: undefined;
            minimum?: undefined;
            default?: undefined;
            maximum?: undefined;
        };
        description: string;
    } | {
        name: string;
        in: string;
        schema: {
            type: string;
            minimum: number;
            default: number;
            format?: undefined;
            enum?: undefined;
            maximum?: undefined;
        };
        description: string;
    } | {
        name: string;
        in: string;
        schema: {
            type: string;
            minimum: number;
            maximum: number;
            default: number;
            format?: undefined;
            enum?: undefined;
        };
        description: string;
    })[];
    createSessionSchema: () => {
        type: string;
        properties: {
            id: {
                type: string;
                format: string;
                description: string;
            };
            userId: {
                type: string;
                format: string;
                description: string;
            };
            token: {
                type: string;
                description: string;
            };
            expiresAt: {
                type: string;
                format: string;
                description: string;
            };
            createdAt: {
                type: string;
                format: string;
                description: string;
            };
            ipAddress: {
                type: string;
                format: string;
                description: string;
            };
            userAgent: {
                type: string;
                description: string;
            };
            isActive: {
                type: string;
                description: string;
            };
        };
        required: string[];
        description: string;
    };
    createBearerSecurityScheme: (description?: string) => {
        type: string;
        scheme: string;
        bearerFormat: string;
        description: string;
    };
    createApiKeySecurityScheme: (headerName?: string, description?: string) => {
        type: string;
        in: string;
        name: string;
        description: string;
    };
    createOAuth2SecurityScheme: (authUrl: string, tokenUrl: string, scopes: Record<string, string>) => {
        type: string;
        flows: {
            authorizationCode: {
                authorizationUrl: string;
                tokenUrl: string;
                scopes: Record<string, string>;
            };
        };
        description: string;
    };
    createBearerSecurityRequirement: (scopes?: string[]) => {
        bearerAuth: string[];
    };
    createApiKeySecurityRequirement: () => {
        apiKey: never[];
    };
    createOAuth2SecurityRequirement: (requiredScopes: string[]) => {
        oauth2: string[];
    };
    createLoginEndpointDoc: () => {
        summary: string;
        description: string;
        tags: string[];
        requestBody: {
            required: boolean;
            content: {
                'application/json': {
                    schema: {
                        type: string;
                        properties: {
                            email: {
                                type: string;
                                format: string;
                                description: string;
                                example: string;
                            };
                            password: {
                                type: string;
                                format: string;
                                description: string;
                                example: string;
                            };
                            mfaCode: {
                                type: string;
                                pattern: string;
                                nullable: boolean;
                                description: string;
                                example: string;
                            };
                        };
                        required: string[];
                        description: string;
                    };
                    examples: {
                        standard: {
                            summary: string;
                            value: {
                                email: string;
                                password: string;
                            };
                        };
                        withMFA: {
                            summary: string;
                            value: {
                                email: string;
                                password: string;
                                mfaCode: string;
                            };
                        };
                    };
                };
            };
        };
        responses: {
            200: {
                description: string;
                content: {
                    'application/json': {
                        schema: {
                            type: string;
                            properties: {
                                accessToken: {
                                    type: string;
                                    description: string;
                                    example: string;
                                };
                                refreshToken: {
                                    type: string;
                                    description: string;
                                    example: string;
                                };
                                tokenType: {
                                    type: string;
                                    description: string;
                                    example: string;
                                };
                                expiresIn: {
                                    type: string;
                                    description: string;
                                    example: number;
                                };
                                user: {
                                    $ref: string;
                                    description: string;
                                };
                            };
                            required: string[];
                            description: string;
                        };
                    };
                };
            };
            401: {
                description: string;
                content: {
                    'application/json': {
                        schema: {
                            type: string;
                            properties: {
                                statusCode: {
                                    type: string;
                                    example: number;
                                };
                                message: {
                                    type: string;
                                    example: string;
                                };
                                error: {
                                    type: string;
                                    example: string;
                                };
                            };
                        };
                    };
                };
            };
            403: {
                description: string;
                content: {
                    'application/json': {
                        schema: {
                            type: string;
                            properties: {
                                statusCode: {
                                    type: string;
                                    example: number;
                                };
                                message: {
                                    type: string;
                                    example: string;
                                };
                                error: {
                                    type: string;
                                    example: string;
                                };
                                mfaRequired: {
                                    type: string;
                                    example: boolean;
                                };
                            };
                        };
                    };
                };
            };
        };
    };
    createGetCurrentUserEndpointDoc: () => {
        summary: string;
        description: string;
        tags: string[];
        security: {
            bearerAuth: string[];
        }[];
        responses: {
            200: {
                description: string;
                content: {
                    'application/json': {
                        schema: {
                            type: string;
                            properties: Record<string, any>;
                            required: string[];
                            description: string;
                        };
                    };
                };
            };
            401: {
                description: string;
            };
        };
    };
    createCreateUserEndpointDoc: () => {
        summary: string;
        description: string;
        tags: string[];
        security: {
            bearerAuth: string[];
        }[];
        requestBody: {
            required: boolean;
            content: {
                'application/json': {
                    schema: {
                        type: string;
                        properties: {
                            email: {
                                type: string;
                                format: string;
                                description: string;
                                example: string;
                            };
                            username: {
                                type: string;
                                minLength: number;
                                maxLength: number;
                                description: string;
                                example: string;
                            };
                            password: {
                                type: string;
                                format: string;
                                minLength: number;
                                description: string;
                                example: string;
                            };
                            firstName: {
                                type: string;
                                description: string;
                                example: string;
                            };
                            lastName: {
                                type: string;
                                description: string;
                                example: string;
                            };
                            roles: {
                                type: string;
                                items: {
                                    type: string;
                                    format: string;
                                };
                                description: string;
                                example: string[];
                            };
                        };
                        required: string[];
                        description: string;
                    };
                };
            };
        };
        responses: {
            201: {
                description: string;
                content: {
                    'application/json': {
                        schema: {
                            type: string;
                            properties: Record<string, any>;
                            required: string[];
                            description: string;
                        };
                    };
                };
            };
            400: {
                description: string;
            };
            409: {
                description: string;
            };
        };
    };
    createListUsersEndpointDoc: () => {
        summary: string;
        description: string;
        tags: string[];
        security: {
            bearerAuth: string[];
        }[];
        parameters: ({
            name: string;
            in: string;
            schema: {
                type: string;
                minimum: number;
                default: number;
                maximum?: undefined;
                enum?: undefined;
            };
            description: string;
        } | {
            name: string;
            in: string;
            schema: {
                type: string;
                minimum: number;
                maximum: number;
                default: number;
                enum?: undefined;
            };
            description: string;
        } | {
            name: string;
            in: string;
            schema: {
                type: string;
                enum: string[];
                minimum?: undefined;
                default?: undefined;
                maximum?: undefined;
            };
            description: string;
        } | {
            name: string;
            in: string;
            schema: {
                type: string;
                minimum?: undefined;
                default?: undefined;
                maximum?: undefined;
                enum?: undefined;
            };
            description: string;
        })[];
        responses: {
            200: {
                description: string;
                content: {
                    'application/json': {
                        schema: {
                            type: string;
                            properties: {
                                data: {
                                    type: string;
                                    items: {
                                        type: string;
                                        properties: Record<string, any>;
                                        required: string[];
                                        description: string;
                                    };
                                };
                                page: {
                                    type: string;
                                };
                                limit: {
                                    type: string;
                                };
                                total: {
                                    type: string;
                                };
                                totalPages: {
                                    type: string;
                                };
                            };
                        };
                    };
                };
            };
        };
    };
    createCheckPermissionEndpointDoc: () => {
        summary: string;
        description: string;
        tags: string[];
        security: {
            bearerAuth: string[];
        }[];
        requestBody: {
            required: boolean;
            content: {
                'application/json': {
                    schema: {
                        type: string;
                        properties: {
                            userId: {
                                type: string;
                                format: string;
                                description: string;
                            };
                            resource: {
                                type: string;
                                description: string;
                                example: string;
                            };
                            action: {
                                type: string;
                                description: string;
                                example: string;
                            };
                            resourceId: {
                                type: string;
                                nullable: boolean;
                                description: string;
                                example: string;
                            };
                        };
                        required: string[];
                        description: string;
                    };
                };
            };
        };
        responses: {
            200: {
                description: string;
                content: {
                    'application/json': {
                        schema: {
                            type: string;
                            properties: {
                                allowed: {
                                    type: string;
                                    description: string;
                                    example: boolean;
                                };
                                reason: {
                                    type: string;
                                    nullable: boolean;
                                    description: string;
                                    example: string;
                                };
                                grantedBy: {
                                    type: string;
                                    items: {
                                        type: string;
                                    };
                                    description: string;
                                    example: string[];
                                };
                            };
                            required: string[];
                            description: string;
                        };
                    };
                };
            };
        };
    };
    createEnrollMFAEndpointDoc: () => {
        summary: string;
        description: string;
        tags: string[];
        security: {
            bearerAuth: string[];
        }[];
        requestBody: {
            required: boolean;
            content: {
                'application/json': {
                    schema: {
                        type: string;
                        properties: {
                            method: {
                                type: string;
                                enum: string[];
                                description: string;
                            };
                            phoneNumber: {
                                type: string;
                                nullable: boolean;
                                description: string;
                            };
                        };
                        required: string[];
                    };
                };
            };
        };
        responses: {
            200: {
                description: string;
                content: {
                    'application/json': {
                        schema: {
                            type: string;
                            properties: {
                                method: {
                                    type: string;
                                    enum: string[];
                                    description: string;
                                    example: string;
                                };
                                secret: {
                                    type: string;
                                    nullable: boolean;
                                    description: string;
                                    example: string;
                                };
                                qrCode: {
                                    type: string;
                                    nullable: boolean;
                                    description: string;
                                    example: string;
                                };
                                backupCodes: {
                                    type: string;
                                    items: {
                                        type: string;
                                    };
                                    nullable: boolean;
                                    description: string;
                                    example: string[];
                                };
                                phoneNumber: {
                                    type: string;
                                    nullable: boolean;
                                    description: string;
                                    example: string;
                                };
                            };
                            required: string[];
                            description: string;
                        };
                    };
                };
            };
        };
    };
    createVerifyMFAEndpointDoc: () => {
        summary: string;
        description: string;
        tags: string[];
        security: {
            bearerAuth: string[];
        }[];
        requestBody: {
            required: boolean;
            content: {
                'application/json': {
                    schema: {
                        type: string;
                        properties: {
                            code: {
                                type: string;
                                pattern: string;
                                description: string;
                                example: string;
                            };
                            method: {
                                type: string;
                                enum: string[];
                                description: string;
                                example: string;
                            };
                        };
                        required: string[];
                        description: string;
                    };
                };
            };
        };
        responses: {
            200: {
                description: string;
                content: {
                    'application/json': {
                        schema: {
                            type: string;
                            properties: {
                                verified: {
                                    type: string;
                                    example: boolean;
                                };
                                message: {
                                    type: string;
                                    example: string;
                                };
                            };
                        };
                    };
                };
            };
            401: {
                description: string;
            };
        };
    };
    createErrorResponseSchema: (statusCode: number, message: string, error?: string) => {
        type: string;
        properties: {
            statusCode: {
                type: string;
                example: number;
            };
            message: {
                type: string;
                example: string;
            };
            error: {
                type: string;
                example: string;
            };
            timestamp: {
                type: string;
                format: string;
                description: string;
            };
        };
        required: string[];
    };
    createValidationErrorResponseSchema: () => {
        type: string;
        properties: {
            statusCode: {
                type: string;
                example: number;
            };
            message: {
                type: string;
                example: string;
            };
            error: {
                type: string;
                example: string;
            };
            errors: {
                type: string;
                items: {
                    type: string;
                    properties: {
                        field: {
                            type: string;
                            example: string;
                        };
                        message: {
                            type: string;
                            example: string;
                        };
                        value: {
                            type: string;
                            nullable: boolean;
                        };
                    };
                };
            };
        };
    };
    createPaginatedResponseSchema: (itemSchema: object, description?: string) => {
        type: string;
        properties: {
            data: {
                type: string;
                items: object;
                description: string;
            };
            page: {
                type: string;
                description: string;
                example: number;
            };
            limit: {
                type: string;
                description: string;
                example: number;
            };
            total: {
                type: string;
                description: string;
                example: number;
            };
            totalPages: {
                type: string;
                description: string;
                example: number;
            };
        };
        required: string[];
        description: string;
    };
    createSwaggerUIConfig: (customOptions?: Record<string, unknown>) => {
        customSiteTitle: {};
        customCss: {};
        customfavIcon: {};
        swaggerOptions: any;
    };
    createOpenAPIDocumentConfig: (title: string, version: string, description: string) => {
        openapi: string;
        info: {
            title: string;
            version: string;
            description: string;
            contact: {
                name: string;
                email: string;
            };
            license: {
                name: string;
            };
        };
        servers: {
            url: string;
            description: string;
        }[];
        tags: {
            name: string;
            description: string;
        }[];
    };
    createCommonResponses: () => {
        Unauthorized: {
            description: string;
            content: {
                'application/json': {
                    schema: {
                        type: string;
                        properties: {
                            statusCode: {
                                type: string;
                                example: number;
                            };
                            message: {
                                type: string;
                                example: string;
                            };
                            error: {
                                type: string;
                                example: string;
                            };
                            timestamp: {
                                type: string;
                                format: string;
                                description: string;
                            };
                        };
                        required: string[];
                    };
                };
            };
        };
        Forbidden: {
            description: string;
            content: {
                'application/json': {
                    schema: {
                        type: string;
                        properties: {
                            statusCode: {
                                type: string;
                                example: number;
                            };
                            message: {
                                type: string;
                                example: string;
                            };
                            error: {
                                type: string;
                                example: string;
                            };
                            timestamp: {
                                type: string;
                                format: string;
                                description: string;
                            };
                        };
                        required: string[];
                    };
                };
            };
        };
        NotFound: {
            description: string;
            content: {
                'application/json': {
                    schema: {
                        type: string;
                        properties: {
                            statusCode: {
                                type: string;
                                example: number;
                            };
                            message: {
                                type: string;
                                example: string;
                            };
                            error: {
                                type: string;
                                example: string;
                            };
                            timestamp: {
                                type: string;
                                format: string;
                                description: string;
                            };
                        };
                        required: string[];
                    };
                };
            };
        };
        ValidationError: {
            description: string;
            content: {
                'application/json': {
                    schema: {
                        type: string;
                        properties: {
                            statusCode: {
                                type: string;
                                example: number;
                            };
                            message: {
                                type: string;
                                example: string;
                            };
                            error: {
                                type: string;
                                example: string;
                            };
                            errors: {
                                type: string;
                                items: {
                                    type: string;
                                    properties: {
                                        field: {
                                            type: string;
                                            example: string;
                                        };
                                        message: {
                                            type: string;
                                            example: string;
                                        };
                                        value: {
                                            type: string;
                                            nullable: boolean;
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
        };
        InternalServerError: {
            description: string;
            content: {
                'application/json': {
                    schema: {
                        type: string;
                        properties: {
                            statusCode: {
                                type: string;
                                example: number;
                            };
                            message: {
                                type: string;
                                example: string;
                            };
                            error: {
                                type: string;
                                example: string;
                            };
                            timestamp: {
                                type: string;
                                format: string;
                                description: string;
                            };
                        };
                        required: string[];
                    };
                };
            };
        };
    };
    createIAMComponents: () => {
        schemas: {
            User: {
                type: string;
                properties: Record<string, any>;
                required: string[];
                description: string;
            };
            UserCreate: {
                type: string;
                properties: {
                    email: {
                        type: string;
                        format: string;
                        description: string;
                        example: string;
                    };
                    username: {
                        type: string;
                        minLength: number;
                        maxLength: number;
                        description: string;
                        example: string;
                    };
                    password: {
                        type: string;
                        format: string;
                        minLength: number;
                        description: string;
                        example: string;
                    };
                    firstName: {
                        type: string;
                        description: string;
                        example: string;
                    };
                    lastName: {
                        type: string;
                        description: string;
                        example: string;
                    };
                    roles: {
                        type: string;
                        items: {
                            type: string;
                            format: string;
                        };
                        description: string;
                        example: string[];
                    };
                };
                required: string[];
                description: string;
            };
            UserUpdate: {
                type: string;
                properties: {
                    email: {
                        type: string;
                        format: string;
                        description: string;
                    };
                    firstName: {
                        type: string;
                        description: string;
                    };
                    lastName: {
                        type: string;
                        description: string;
                    };
                    status: {
                        type: string;
                        enum: string[];
                        description: string;
                    };
                };
                description: string;
            };
            Role: {
                type: string;
                properties: {
                    id: {
                        type: string;
                        format: string;
                        description: string;
                        example: string;
                    };
                    name: {
                        type: string;
                        description: string;
                        example: string;
                    };
                    description: {
                        type: string;
                        description: string;
                        example: string;
                    };
                    permissions: {
                        type: string;
                        items: {
                            $ref: string;
                        };
                        description: string;
                    };
                    isSystem: {
                        type: string;
                        description: string;
                        example: boolean;
                    };
                    createdAt: {
                        type: string;
                        format: string;
                        description: string;
                    };
                    updatedAt: {
                        type: string;
                        format: string;
                        description: string;
                    };
                };
                required: string[];
                description: string;
            };
            RoleCreate: {
                type: string;
                properties: {
                    name: {
                        type: string;
                        minLength: number;
                        maxLength: number;
                        description: string;
                        example: string;
                    };
                    description: {
                        type: string;
                        maxLength: number;
                        description: string;
                        example: string;
                    };
                    permissions: {
                        type: string;
                        items: {
                            type: string;
                        };
                        description: string;
                        example: string[];
                    };
                };
                required: string[];
                description: string;
            };
            Permission: {
                type: string;
                properties: {
                    id: {
                        type: string;
                        format: string;
                        description: string;
                        example: string;
                    };
                    resource: {
                        type: string;
                        description: string;
                        example: string;
                    };
                    action: {
                        type: string;
                        enum: string[];
                        description: string;
                        example: string;
                    };
                    scope: {
                        type: string;
                        nullable: boolean;
                        description: string;
                        example: string;
                    };
                    description: {
                        type: string;
                        description: string;
                        example: string;
                    };
                };
                required: string[];
                description: string;
            };
            PermissionCheck: {
                type: string;
                properties: {
                    userId: {
                        type: string;
                        format: string;
                        description: string;
                    };
                    resource: {
                        type: string;
                        description: string;
                        example: string;
                    };
                    action: {
                        type: string;
                        description: string;
                        example: string;
                    };
                    resourceId: {
                        type: string;
                        nullable: boolean;
                        description: string;
                        example: string;
                    };
                };
                required: string[];
                description: string;
            };
            PermissionCheckResponse: {
                type: string;
                properties: {
                    allowed: {
                        type: string;
                        description: string;
                        example: boolean;
                    };
                    reason: {
                        type: string;
                        nullable: boolean;
                        description: string;
                        example: string;
                    };
                    grantedBy: {
                        type: string;
                        items: {
                            type: string;
                        };
                        description: string;
                        example: string[];
                    };
                };
                required: string[];
                description: string;
            };
            PolicyDocument: {
                type: string;
                properties: {
                    version: {
                        type: string;
                        description: string;
                        example: string;
                    };
                    statements: {
                        type: string;
                        items: {
                            $ref: string;
                        };
                        description: string;
                    };
                };
                required: string[];
                description: string;
            };
            PolicyStatement: {
                type: string;
                properties: {
                    effect: {
                        type: string;
                        enum: string[];
                        description: string;
                        example: string;
                    };
                    actions: {
                        type: string;
                        items: {
                            type: string;
                        };
                        description: string;
                        example: string[];
                    };
                    resources: {
                        type: string;
                        items: {
                            type: string;
                        };
                        description: string;
                        example: string[];
                    };
                    conditions: {
                        type: string;
                        additionalProperties: boolean;
                        nullable: boolean;
                        description: string;
                        example: {
                            ipAddress: string;
                            timeOfDay: string;
                        };
                    };
                };
                required: string[];
                description: string;
            };
            LoginRequest: {
                type: string;
                properties: {
                    email: {
                        type: string;
                        format: string;
                        description: string;
                        example: string;
                    };
                    password: {
                        type: string;
                        format: string;
                        description: string;
                        example: string;
                    };
                    mfaCode: {
                        type: string;
                        pattern: string;
                        nullable: boolean;
                        description: string;
                        example: string;
                    };
                };
                required: string[];
                description: string;
            };
            LoginResponse: {
                type: string;
                properties: {
                    accessToken: {
                        type: string;
                        description: string;
                        example: string;
                    };
                    refreshToken: {
                        type: string;
                        description: string;
                        example: string;
                    };
                    tokenType: {
                        type: string;
                        description: string;
                        example: string;
                    };
                    expiresIn: {
                        type: string;
                        description: string;
                        example: number;
                    };
                    user: {
                        $ref: string;
                        description: string;
                    };
                };
                required: string[];
                description: string;
            };
            TokenRefresh: {
                type: string;
                properties: {
                    refreshToken: {
                        type: string;
                        description: string;
                        example: string;
                    };
                };
                required: string[];
                description: string;
            };
            MFAEnrollment: {
                type: string;
                properties: {
                    method: {
                        type: string;
                        enum: string[];
                        description: string;
                        example: string;
                    };
                    secret: {
                        type: string;
                        nullable: boolean;
                        description: string;
                        example: string;
                    };
                    qrCode: {
                        type: string;
                        nullable: boolean;
                        description: string;
                        example: string;
                    };
                    backupCodes: {
                        type: string;
                        items: {
                            type: string;
                        };
                        nullable: boolean;
                        description: string;
                        example: string[];
                    };
                    phoneNumber: {
                        type: string;
                        nullable: boolean;
                        description: string;
                        example: string;
                    };
                };
                required: string[];
                description: string;
            };
            MFAVerification: {
                type: string;
                properties: {
                    code: {
                        type: string;
                        pattern: string;
                        description: string;
                        example: string;
                    };
                    method: {
                        type: string;
                        enum: string[];
                        description: string;
                        example: string;
                    };
                };
                required: string[];
                description: string;
            };
            AuditLog: {
                type: string;
                properties: {
                    id: {
                        type: string;
                        format: string;
                        description: string;
                    };
                    userId: {
                        type: string;
                        format: string;
                        description: string;
                    };
                    action: {
                        type: string;
                        description: string;
                        example: string;
                    };
                    resource: {
                        type: string;
                        description: string;
                        example: string;
                    };
                    resourceId: {
                        type: string;
                        nullable: boolean;
                        description: string;
                        example: string;
                    };
                    result: {
                        type: string;
                        enum: string[];
                        description: string;
                        example: string;
                    };
                    ipAddress: {
                        type: string;
                        format: string;
                        description: string;
                        example: string;
                    };
                    userAgent: {
                        type: string;
                        description: string;
                        example: string;
                    };
                    timestamp: {
                        type: string;
                        format: string;
                        description: string;
                        example: string;
                    };
                    metadata: {
                        type: string;
                        additionalProperties: boolean;
                        nullable: boolean;
                        description: string;
                        example: {
                            previousStatus: string;
                            newStatus: string;
                        };
                    };
                };
                required: string[];
                description: string;
            };
            Session: {
                type: string;
                properties: {
                    id: {
                        type: string;
                        format: string;
                        description: string;
                    };
                    userId: {
                        type: string;
                        format: string;
                        description: string;
                    };
                    token: {
                        type: string;
                        description: string;
                    };
                    expiresAt: {
                        type: string;
                        format: string;
                        description: string;
                    };
                    createdAt: {
                        type: string;
                        format: string;
                        description: string;
                    };
                    ipAddress: {
                        type: string;
                        format: string;
                        description: string;
                    };
                    userAgent: {
                        type: string;
                        description: string;
                    };
                    isActive: {
                        type: string;
                        description: string;
                    };
                };
                required: string[];
                description: string;
            };
            Error: {
                type: string;
                properties: {
                    statusCode: {
                        type: string;
                        example: number;
                    };
                    message: {
                        type: string;
                        example: string;
                    };
                    error: {
                        type: string;
                        example: string;
                    };
                    timestamp: {
                        type: string;
                        format: string;
                        description: string;
                    };
                };
                required: string[];
            };
            ValidationError: {
                type: string;
                properties: {
                    statusCode: {
                        type: string;
                        example: number;
                    };
                    message: {
                        type: string;
                        example: string;
                    };
                    error: {
                        type: string;
                        example: string;
                    };
                    errors: {
                        type: string;
                        items: {
                            type: string;
                            properties: {
                                field: {
                                    type: string;
                                    example: string;
                                };
                                message: {
                                    type: string;
                                    example: string;
                                };
                                value: {
                                    type: string;
                                    nullable: boolean;
                                };
                            };
                        };
                    };
                };
            };
        };
        responses: {
            Unauthorized: {
                description: string;
                content: {
                    'application/json': {
                        schema: {
                            type: string;
                            properties: {
                                statusCode: {
                                    type: string;
                                    example: number;
                                };
                                message: {
                                    type: string;
                                    example: string;
                                };
                                error: {
                                    type: string;
                                    example: string;
                                };
                                timestamp: {
                                    type: string;
                                    format: string;
                                    description: string;
                                };
                            };
                            required: string[];
                        };
                    };
                };
            };
            Forbidden: {
                description: string;
                content: {
                    'application/json': {
                        schema: {
                            type: string;
                            properties: {
                                statusCode: {
                                    type: string;
                                    example: number;
                                };
                                message: {
                                    type: string;
                                    example: string;
                                };
                                error: {
                                    type: string;
                                    example: string;
                                };
                                timestamp: {
                                    type: string;
                                    format: string;
                                    description: string;
                                };
                            };
                            required: string[];
                        };
                    };
                };
            };
            NotFound: {
                description: string;
                content: {
                    'application/json': {
                        schema: {
                            type: string;
                            properties: {
                                statusCode: {
                                    type: string;
                                    example: number;
                                };
                                message: {
                                    type: string;
                                    example: string;
                                };
                                error: {
                                    type: string;
                                    example: string;
                                };
                                timestamp: {
                                    type: string;
                                    format: string;
                                    description: string;
                                };
                            };
                            required: string[];
                        };
                    };
                };
            };
            ValidationError: {
                description: string;
                content: {
                    'application/json': {
                        schema: {
                            type: string;
                            properties: {
                                statusCode: {
                                    type: string;
                                    example: number;
                                };
                                message: {
                                    type: string;
                                    example: string;
                                };
                                error: {
                                    type: string;
                                    example: string;
                                };
                                errors: {
                                    type: string;
                                    items: {
                                        type: string;
                                        properties: {
                                            field: {
                                                type: string;
                                                example: string;
                                            };
                                            message: {
                                                type: string;
                                                example: string;
                                            };
                                            value: {
                                                type: string;
                                                nullable: boolean;
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
            InternalServerError: {
                description: string;
                content: {
                    'application/json': {
                        schema: {
                            type: string;
                            properties: {
                                statusCode: {
                                    type: string;
                                    example: number;
                                };
                                message: {
                                    type: string;
                                    example: string;
                                };
                                error: {
                                    type: string;
                                    example: string;
                                };
                                timestamp: {
                                    type: string;
                                    format: string;
                                    description: string;
                                };
                            };
                            required: string[];
                        };
                    };
                };
            };
        };
        securitySchemes: {
            bearerAuth: {
                type: string;
                scheme: string;
                bearerFormat: string;
                description: string;
            };
            apiKey: {
                type: string;
                in: string;
                name: string;
                description: string;
            };
        };
    };
    createLogoutEndpointDoc: () => {
        summary: string;
        description: string;
        tags: string[];
        security: {
            bearerAuth: string[];
        }[];
        responses: {
            200: {
                description: string;
                content: {
                    'application/json': {
                        schema: {
                            type: string;
                            properties: {
                                message: {
                                    type: string;
                                    example: string;
                                };
                            };
                        };
                    };
                };
            };
            401: {
                description: string;
            };
        };
    };
    createListRolesEndpointDoc: () => {
        summary: string;
        description: string;
        tags: string[];
        security: {
            bearerAuth: string[];
        }[];
        parameters: {
            name: string;
            in: string;
            schema: {
                type: string;
                default: boolean;
            };
            description: string;
        }[];
        responses: {
            200: {
                description: string;
                content: {
                    'application/json': {
                        schema: {
                            type: string;
                            items: {
                                type: string;
                                properties: {
                                    id: {
                                        type: string;
                                        format: string;
                                        description: string;
                                        example: string;
                                    };
                                    name: {
                                        type: string;
                                        description: string;
                                        example: string;
                                    };
                                    description: {
                                        type: string;
                                        description: string;
                                        example: string;
                                    };
                                    permissions: {
                                        type: string;
                                        items: {
                                            $ref: string;
                                        };
                                        description: string;
                                    };
                                    isSystem: {
                                        type: string;
                                        description: string;
                                        example: boolean;
                                    };
                                    createdAt: {
                                        type: string;
                                        format: string;
                                        description: string;
                                    };
                                    updatedAt: {
                                        type: string;
                                        format: string;
                                        description: string;
                                    };
                                };
                                required: string[];
                                description: string;
                            };
                        };
                    };
                };
            };
        };
    };
    createUpdateRoleEndpointDoc: () => {
        summary: string;
        description: string;
        tags: string[];
        security: {
            bearerAuth: string[];
        }[];
        parameters: {
            name: string;
            in: string;
            required: boolean;
            schema: {
                type: string;
                format: string;
            };
            description: string;
        }[];
        requestBody: {
            required: boolean;
            content: {
                'application/json': {
                    schema: {
                        type: string;
                        properties: {
                            name: {
                                type: string;
                            };
                            description: {
                                type: string;
                            };
                            permissions: {
                                type: string;
                                items: {
                                    type: string;
                                };
                            };
                        };
                    };
                };
            };
        };
        responses: {
            200: {
                description: string;
                content: {
                    'application/json': {
                        schema: {
                            type: string;
                            properties: {
                                id: {
                                    type: string;
                                    format: string;
                                    description: string;
                                    example: string;
                                };
                                name: {
                                    type: string;
                                    description: string;
                                    example: string;
                                };
                                description: {
                                    type: string;
                                    description: string;
                                    example: string;
                                };
                                permissions: {
                                    type: string;
                                    items: {
                                        $ref: string;
                                    };
                                    description: string;
                                };
                                isSystem: {
                                    type: string;
                                    description: string;
                                    example: boolean;
                                };
                                createdAt: {
                                    type: string;
                                    format: string;
                                    description: string;
                                };
                                updatedAt: {
                                    type: string;
                                    format: string;
                                    description: string;
                                };
                            };
                            required: string[];
                            description: string;
                        };
                    };
                };
            };
            404: {
                description: string;
            };
        };
    };
    createAssignRoleEndpointDoc: () => {
        summary: string;
        description: string;
        tags: string[];
        security: {
            bearerAuth: string[];
        }[];
        parameters: {
            name: string;
            in: string;
            required: boolean;
            schema: {
                type: string;
                format: string;
            };
            description: string;
        }[];
        requestBody: {
            required: boolean;
            content: {
                'application/json': {
                    schema: {
                        type: string;
                        properties: {
                            roleIds: {
                                type: string;
                                items: {
                                    type: string;
                                    format: string;
                                };
                                description: string;
                            };
                        };
                        required: string[];
                    };
                };
            };
        };
        responses: {
            200: {
                description: string;
                content: {
                    'application/json': {
                        schema: {
                            type: string;
                            properties: Record<string, any>;
                            required: string[];
                            description: string;
                        };
                    };
                };
            };
        };
    };
    createPasswordResetRequestSchema: () => {
        type: string;
        properties: {
            email: {
                type: string;
                format: string;
                description: string;
                example: string;
            };
        };
        required: string[];
        description: string;
    };
    createPasswordResetConfirmSchema: () => {
        type: string;
        properties: {
            token: {
                type: string;
                description: string;
                example: string;
            };
            newPassword: {
                type: string;
                format: string;
                minLength: number;
                description: string;
                example: string;
            };
        };
        required: string[];
        description: string;
    };
    createEmailVerificationSchema: () => {
        type: string;
        properties: {
            token: {
                type: string;
                description: string;
                example: string;
            };
        };
        required: string[];
        description: string;
    };
    createTokenIntrospectionSchema: () => {
        type: string;
        properties: {
            active: {
                type: string;
                description: string;
                example: boolean;
            };
            scope: {
                type: string;
                nullable: boolean;
                description: string;
                example: string;
            };
            clientId: {
                type: string;
                nullable: boolean;
                description: string;
            };
            username: {
                type: string;
                nullable: boolean;
                description: string;
                example: string;
            };
            tokenType: {
                type: string;
                nullable: boolean;
                description: string;
                example: string;
            };
            exp: {
                type: string;
                nullable: boolean;
                description: string;
                example: number;
            };
            iat: {
                type: string;
                nullable: boolean;
                description: string;
                example: number;
            };
            sub: {
                type: string;
                nullable: boolean;
                description: string;
                example: string;
            };
        };
        required: string[];
        description: string;
    };
    createIPWhitelistSchema: () => {
        type: string;
        properties: {
            id: {
                type: string;
                format: string;
                description: string;
            };
            ipAddress: {
                type: string;
                description: string;
                example: string;
            };
            description: {
                type: string;
                nullable: boolean;
                description: string;
                example: string;
            };
            userId: {
                type: string;
                format: string;
                nullable: boolean;
                description: string;
            };
            createdAt: {
                type: string;
                format: string;
                description: string;
            };
            expiresAt: {
                type: string;
                format: string;
                nullable: boolean;
                description: string;
            };
        };
        required: string[];
        description: string;
    };
    createRateLimitSchema: () => {
        type: string;
        properties: {
            limit: {
                type: string;
                description: string;
                example: number;
            };
            remaining: {
                type: string;
                description: string;
                example: number;
            };
            reset: {
                type: string;
                description: string;
                example: number;
            };
            retryAfter: {
                type: string;
                nullable: boolean;
                description: string;
                example: number;
            };
        };
        description: string;
    };
    createRateLimitHeaders: () => {
        'X-RateLimit-Limit': {
            schema: {
                type: string;
            };
            description: string;
            example: number;
        };
        'X-RateLimit-Remaining': {
            schema: {
                type: string;
            };
            description: string;
            example: number;
        };
        'X-RateLimit-Reset': {
            schema: {
                type: string;
            };
            description: string;
            example: number;
        };
        'Retry-After': {
            schema: {
                type: string;
            };
            description: string;
            example: number;
        };
    };
    createOAuth2Scopes: (scopes: Record<string, string>) => Record<string, string>;
};
export default _default;
//# sourceMappingURL=iam-swagger-kit.d.ts.map