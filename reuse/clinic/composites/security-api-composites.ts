/**
 * LOC: CLINIC-COMP-SECURITY-API-001
 * File: /reuse/clinic/composites/security-api-composites.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v10.x)
 *   - @nestjs/swagger (v7.x)
 *   - class-validator (v0.14.x)
 *   - ../../data/composites/swagger-schema-generators
 *   - ../../data/composites/swagger-response-builders
 *   - ../../data/composites/swagger-security-schemes
 *   - ../../data/composites/swagger-parameter-decorators
 *   - ../../server/health/health-hipaa-compliance-kit
 *   - ../../data/security-audit-logging
 *   - ../../data/rbac-authorization
 *
 * DOWNSTREAM (imported by):
 *   - Authentication controllers
 *   - Authorization middleware
 *   - Security monitoring services
 *   - HIPAA compliance modules
 *   - Audit logging services
 */

/**
 * File: /reuse/clinic/composites/security-api-composites.ts
 * Locator: WC-CLINIC-SECURITY-API-001
 * Purpose: Security API Composites - Comprehensive security and compliance APIs
 *
 * Upstream: @nestjs/swagger, swagger composites, security/compliance kits
 * Downstream: Auth controllers, RBAC middleware, audit services, compliance modules
 * Dependencies: NestJS 10.x, Swagger 7.x, TypeScript 5.x, class-validator 0.14.x
 * Exports: 45 composed functions for comprehensive security API documentation
 *
 * LLM Context: Production-grade security API composite for White Cross security operations.
 * Composes Swagger/OpenAPI utilities with security functions providing complete API documentation
 * for security endpoints including JWT authentication with RS256/HS256 algorithms, OAuth2 authorization
 * code and client credentials flows, multi-factor authentication (TOTP, SMS, email), password policy
 * enforcement with bcrypt hashing, session management with secure cookies, RBAC (Role-Based Access
 * Control) with hierarchical permissions, ABAC (Attribute-Based Access Control), HIPAA compliance
 * validation and audit trails, PHI (Protected Health Information) access logging, data encryption
 * at rest and in transit, security headers (CSP, HSTS, X-Frame-Options), API rate limiting per user,
 * intrusion detection and prevention, security event monitoring with SIEM integration, vulnerability
 * scanning APIs, penetration testing endpoints, security incident response workflows, and compliance
 * reporting for HIPAA/FERPA. Essential for healthcare data security and regulatory compliance.
 */

import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiProperty,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiSecurity,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiHeader,
  ApiExtension,
} from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsDate,
  IsEnum,
  IsNumber,
  IsArray,
  IsBoolean,
  IsUUID,
  IsEmail,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

// Swagger utilities imports
import {
  generateStringSchema,
  generateNumericSchema,
  generateBooleanSchema,
  generateArraySchema,
  generateObjectSchema,
  generateEnumSchema,
  generateFormatValidationSchema,
} from '../../data/composites/swagger-schema-generators';

import {
  createSuccessResponse,
  createCreatedResponse,
  createNoContentResponse,
  createBadRequestError,
  createUnauthorizedError,
  createForbiddenError,
  createNotFoundError,
  createConflictError,
} from '../../data/composites/swagger-response-builders';

import {
  createJwtAuthentication,
  createJwtWithRefreshToken,
  createJwtClaimsValidation,
  createJwtAudienceValidation,
  createJwtIssuerValidation,
  createJwtSignatureValidation,
  createOAuth2AuthorizationCodeFlow,
  createOAuth2ClientCredentialsFlow,
  createOAuth2PkceFlow,
  createOAuth2ScopeValidation,
  createRoleBasedSecurity,
  createPermissionBasedSecurity,
  createTenantBasedSecurity,
  createRateLimitSecurity,
  createIpBasedSecurity,
  createTimeBasedSecurity,
  createDeviceBasedSecurity,
  createConditionalSecurity,
  createTotpAuthentication,
  createBasicAuthentication,
  createSessionCookieAuth,
  createApiKeyHeader,
  createApiKeyWithIpWhitelist,
  createRotatingApiKey,
  createHmacAuthentication,
  createMutualTlsAuthentication,
} from '../../data/composites/swagger-security-schemes';

import {
  createPaginationQueryParams,
  createSortingQueryParams,
  createDateRangeQueryParams,
  createUuidPathParam,
  createFilterQueryParams,
  createRequestIdHeader,
} from '../../data/composites/swagger-parameter-decorators';

// ============================================================================
// JWT AUTHENTICATION (7 functions)
// ============================================================================

/**
 * Creates JWT authentication endpoint schema.
 * Complete JWT authentication flow with token generation.
 *
 * @returns JWT authentication schema
 */
export function createJWTAuthenticationSchema() {
  return generateObjectSchema(
    'JWT authentication',
    {
      accessToken: generateStringSchema('JWT access token'),
      refreshToken: generateStringSchema('JWT refresh token'),
      tokenType: generateStringSchema('Token type', { example: 'Bearer' }),
      expiresIn: generateNumericSchema('Token expiration (seconds)', {
        type: 'integer',
        minimum: 60,
        example: 3600,
      }),
      refreshExpiresIn: generateNumericSchema('Refresh token expiration (seconds)', {
        type: 'integer',
        example: 604800,
      }),
      scope: generateArraySchema(
        'Granted scopes',
        generateStringSchema('Scope'),
        {}
      ),
      claims: generateObjectSchema('JWT claims', {
        sub: generateStringSchema('Subject (user ID)', { format: 'uuid' }),
        iss: generateStringSchema('Issuer'),
        aud: generateArraySchema('Audience', generateStringSchema('Audience'), {}),
        exp: generateNumericSchema('Expiration timestamp', { type: 'integer' }),
        iat: generateNumericSchema('Issued at timestamp', { type: 'integer' }),
        jti: generateStringSchema('JWT ID', { format: 'uuid' }),
        role: generateStringSchema('User role'),
        permissions: generateArraySchema('User permissions', generateStringSchema('Permission'), {}),
      }, ['sub', 'iss', 'aud', 'exp', 'iat']),
    },
    ['accessToken', 'tokenType', 'expiresIn', 'claims']
  );
}

/**
 * Creates JWT login endpoint decorator.
 * POST endpoint for JWT-based authentication.
 *
 * @returns Decorator for JWT login
 */
export function createJWTLoginEndpoint() {
  return applyDecorators(
    ApiTags('JWT Authentication'),
    ApiOperation({
      summary: 'JWT login',
      description: 'Authenticate user and issue JWT access and refresh tokens',
    }),
    ApiBody({
      description: 'Login credentials',
      schema: generateObjectSchema('Login request', {
        username: generateStringSchema('Username or email', {
          example: 'nurse@school.edu',
        }),
        password: generateStringSchema('Password', { format: 'password' }),
        mfaCode: generateStringSchema('MFA code (if enabled)', {
          pattern: '^[0-9]{6}$',
        }),
      }, ['username', 'password']),
    }),
    createSuccessResponse(Object as any, 'Authentication successful'),
    createUnauthorizedError('Invalid credentials or MFA code'),
  );
}

/**
 * Creates JWT refresh token schema.
 * Schema for token refresh operations.
 *
 * @returns Refresh token schema
 */
export function createJWTRefreshSchema() {
  return generateObjectSchema(
    'JWT token refresh',
    {
      refreshToken: generateStringSchema('Refresh token'),
      grantType: generateStringSchema('Grant type', { example: 'refresh_token' }),
    },
    ['refreshToken', 'grantType']
  );
}

/**
 * Creates JWT token validation schema.
 * Schema for validating JWT tokens.
 *
 * @returns Token validation schema
 */
export function createJWTValidationSchema() {
  return generateObjectSchema(
    'JWT validation result',
    {
      valid: generateBooleanSchema('Token valid'),
      claims: generateObjectSchema('Decoded claims', {}, []),
      expiresAt: generateFormatValidationSchema('date-time', 'Token expiration'),
      issuedAt: generateFormatValidationSchema('date-time', 'Token issued at'),
      audience: generateArraySchema('Audience', generateStringSchema('Aud'), {}),
      issuer: generateStringSchema('Token issuer'),
      subject: generateStringSchema('Token subject'),
    },
    ['valid']
  );
}

/**
 * Creates JWT revocation schema.
 * Schema for revoking JWT tokens.
 *
 * @returns Revocation schema
 */
export function createJWTRevocationSchema() {
  return generateObjectSchema(
    'JWT token revocation',
    {
      token: generateStringSchema('Token to revoke'),
      tokenType: generateEnumSchema(['access', 'refresh'], 'Token type', 'string'),
      revocationReason: generateStringSchema('Revocation reason'),
      revokedAt: generateFormatValidationSchema('date-time', 'Revocation timestamp'),
      revokedBy: generateStringSchema('User who revoked token'),
    },
    ['token', 'tokenType', 'revocationReason']
  );
}

/**
 * Creates JWT claims customization schema.
 * Schema for custom JWT claims.
 *
 * @returns Claims customization schema
 */
export function createJWTClaimsSchema() {
  return generateObjectSchema(
    'Custom JWT claims',
    {
      standardClaims: generateObjectSchema('Standard claims', {
        sub: generateStringSchema('Subject'),
        iss: generateStringSchema('Issuer'),
        aud: generateArraySchema('Audience', generateStringSchema('Aud'), {}),
        exp: generateNumericSchema('Expiration', { type: 'integer' }),
        nbf: generateNumericSchema('Not before', { type: 'integer' }),
        iat: generateNumericSchema('Issued at', { type: 'integer' }),
        jti: generateStringSchema('JWT ID'),
      }, []),
      customClaims: generateObjectSchema('Custom claims', {
        role: generateStringSchema('User role'),
        permissions: generateArraySchema('Permissions', generateStringSchema('Permission'), {}),
        tenantId: generateStringSchema('Tenant ID'),
        schoolId: generateStringSchema('School ID'),
        licenseNumber: generateStringSchema('Nursing license'),
        departmentId: generateStringSchema('Department ID'),
      }, []),
    },
    ['standardClaims', 'customClaims']
  );
}

/**
 * Creates JWT signing algorithm configuration schema.
 * Schema for JWT algorithm and key configuration.
 *
 * @returns Signing algorithm schema
 */
export function createJWTSigningConfigSchema() {
  return generateObjectSchema(
    'JWT signing configuration',
    {
      algorithm: generateEnumSchema(
        ['HS256', 'HS384', 'HS512', 'RS256', 'RS384', 'RS512', 'ES256', 'ES384', 'ES512'],
        'Signing algorithm',
        'string'
      ),
      keyId: generateStringSchema('Key ID (for key rotation)'),
      publicKeyUrl: generateStringSchema('Public key URL (for RS*/ES*)'),
      symmetricKey: generateStringSchema('Symmetric key (for HS*, base64)'),
      keyRotationPeriod: generateNumericSchema('Key rotation period (days)', {
        type: 'integer',
        minimum: 1,
        maximum: 365,
      }),
    },
    ['algorithm']
  );
}

// ============================================================================
// OAUTH2 FLOWS (8 functions)
// ============================================================================

/**
 * Creates OAuth2 authorization request schema.
 * Schema for OAuth2 authorization code flow initiation.
 *
 * @returns Authorization request schema
 */
export function createOAuth2AuthorizationRequestSchema() {
  return generateObjectSchema(
    'OAuth2 authorization request',
    {
      responseType: generateStringSchema('Response type', { example: 'code' }),
      clientId: generateStringSchema('Client ID'),
      redirectUri: generateFormatValidationSchema('uri', 'Redirect URI'),
      scope: generateStringSchema('Requested scopes (space-separated)', {
        example: 'patient/*.read user/*.write',
      }),
      state: generateStringSchema('State parameter'),
      codeChallenge: generateStringSchema('PKCE code challenge'),
      codeChallengeMethod: generateEnumSchema(['S256', 'plain'], 'PKCE method', 'string'),
    },
    ['responseType', 'clientId', 'redirectUri', 'scope', 'state']
  );
}

/**
 * Creates OAuth2 token exchange schema.
 * Schema for exchanging authorization code for access token.
 *
 * @returns Token exchange schema
 */
export function createOAuth2TokenExchangeSchema() {
  return generateObjectSchema(
    'OAuth2 token exchange',
    {
      grantType: generateEnumSchema(
        ['authorization_code', 'client_credentials', 'refresh_token', 'password'],
        'Grant type',
        'string'
      ),
      code: generateStringSchema('Authorization code'),
      redirectUri: generateFormatValidationSchema('uri', 'Redirect URI'),
      clientId: generateStringSchema('Client ID'),
      clientSecret: generateStringSchema('Client secret'),
      codeVerifier: generateStringSchema('PKCE code verifier'),
      refreshToken: generateStringSchema('Refresh token'),
      scope: generateStringSchema('Requested scopes'),
    },
    ['grantType', 'clientId']
  );
}

/**
 * Creates OAuth2 consent screen schema.
 * Schema for OAuth2 user consent.
 *
 * @returns Consent schema
 */
export function createOAuth2ConsentSchema() {
  return generateObjectSchema(
    'OAuth2 consent',
    {
      consentId: generateStringSchema('Consent ID', { format: 'uuid' }),
      userId: generateStringSchema('User ID', { format: 'uuid' }),
      clientId: generateStringSchema('Client ID'),
      clientName: generateStringSchema('Client application name'),
      requestedScopes: generateArraySchema(
        'Requested scopes',
        generateObjectSchema('Scope', {
          scope: generateStringSchema('Scope name'),
          description: generateStringSchema('Scope description'),
          required: generateBooleanSchema('Required scope'),
        }, ['scope', 'description']),
        { minItems: 1 }
      ),
      consentGiven: generateBooleanSchema('Consent given'),
      consentDate: generateFormatValidationSchema('date-time', 'Consent date'),
      expiresAt: generateFormatValidationSchema('date-time', 'Consent expiration'),
    },
    ['consentId', 'userId', 'clientId', 'requestedScopes', 'consentGiven']
  );
}

/**
 * Creates OAuth2 client credentials endpoint decorator.
 * POST endpoint for client credentials flow.
 *
 * @returns Decorator for client credentials
 */
export function createOAuth2ClientCredentialsEndpoint() {
  return applyDecorators(
    ApiTags('OAuth2'),
    ApiOperation({
      summary: 'OAuth2 client credentials',
      description: 'Machine-to-machine authentication via client credentials',
    }),
    createBasicAuthentication('OAuth2 Client Credentials'),
    ApiBody({
      description: 'Token request',
      schema: generateObjectSchema('Client credentials request', {
        grantType: generateStringSchema('Grant type', { example: 'client_credentials' }),
        scope: generateStringSchema('Requested scopes'),
      }, ['grantType']),
    }),
    createSuccessResponse(Object as any, 'Access token issued'),
    createUnauthorizedError('Invalid client credentials'),
  );
}

/**
 * Creates OAuth2 scope definition schema.
 * Schema for defining OAuth2 scopes.
 *
 * @returns Scope definition schema
 */
export function createOAuth2ScopeDefinitionSchema() {
  return generateObjectSchema(
    'OAuth2 scope definition',
    {
      scope: generateStringSchema('Scope identifier', { example: 'patient/*.read' }),
      displayName: generateStringSchema('Display name', { example: 'Read Patient Data' }),
      description: generateStringSchema('Detailed description'),
      category: generateEnumSchema(['patient', 'user', 'system', 'admin'], 'Scope category', 'string'),
      sensitivityLevel: generateEnumSchema(['public', 'protected', 'confidential'], 'Data sensitivity', 'string'),
      requiredClaims: generateArraySchema('Required JWT claims', generateStringSchema('Claim'), {}),
      defaultGranted: generateBooleanSchema('Granted by default', false),
    },
    ['scope', 'displayName', 'description', 'category', 'sensitivityLevel']
  );
}

/**
 * Creates OAuth2 token introspection schema.
 * Schema for OAuth2 token introspection.
 *
 * @returns Introspection schema
 */
export function createOAuth2IntrospectionSchema() {
  return generateObjectSchema(
    'OAuth2 token introspection',
    {
      active: generateBooleanSchema('Token active'),
      scope: generateStringSchema('Token scopes'),
      clientId: generateStringSchema('Client ID'),
      username: generateStringSchema('Username'),
      tokenType: generateStringSchema('Token type', { example: 'Bearer' }),
      exp: generateNumericSchema('Expiration timestamp', { type: 'integer' }),
      iat: generateNumericSchema('Issued at timestamp', { type: 'integer' }),
      nbf: generateNumericSchema('Not before timestamp', { type: 'integer' }),
      sub: generateStringSchema('Subject'),
      aud: generateArraySchema('Audience', generateStringSchema('Aud'), {}),
      iss: generateStringSchema('Issuer'),
      jti: generateStringSchema('Token ID'),
    },
    ['active']
  );
}

/**
 * Creates OAuth2 device authorization schema.
 * Schema for device authorization flow (IoT devices).
 *
 * @returns Device authorization schema
 */
export function createOAuth2DeviceAuthorizationSchema() {
  return generateObjectSchema(
    'OAuth2 device authorization',
    {
      deviceCode: generateStringSchema('Device code'),
      userCode: generateStringSchema('User code for verification', {
        pattern: '^[A-Z0-9]{6,10}$',
        example: 'ABCD-1234',
      }),
      verificationUri: generateFormatValidationSchema('uri', 'Verification URL', {
        example: 'https://example.com/device',
      }),
      verificationUriComplete: generateFormatValidationSchema('uri', 'Complete verification URL'),
      expiresIn: generateNumericSchema('Code expiration (seconds)', {
        type: 'integer',
        example: 1800,
      }),
      interval: generateNumericSchema('Polling interval (seconds)', {
        type: 'integer',
        example: 5,
      }),
    },
    ['deviceCode', 'userCode', 'verificationUri', 'expiresIn', 'interval']
  );
}

/**
 * Creates OAuth2 authorization endpoint decorator.
 * GET endpoint for OAuth2 authorization code flow.
 *
 * @returns Decorator for authorization endpoint
 */
export function createOAuth2AuthorizationEndpoint() {
  return applyDecorators(
    ApiTags('OAuth2'),
    ApiOperation({
      summary: 'OAuth2 authorization',
      description: 'Initiate OAuth2 authorization code flow with PKCE support',
    }),
    ApiQuery({
      name: 'response_type',
      required: true,
      schema: { type: 'string', enum: ['code'] },
    }),
    ApiQuery({ name: 'client_id', required: true, type: String }),
    ApiQuery({ name: 'redirect_uri', required: true, type: String }),
    ApiQuery({ name: 'scope', required: false, type: String }),
    ApiQuery({ name: 'state', required: true, type: String }),
    ApiQuery({ name: 'code_challenge', required: false, type: String }),
    ApiQuery({
      name: 'code_challenge_method',
      required: false,
      schema: { type: 'string', enum: ['S256', 'plain'] },
    }),
    createSuccessResponse(Object as any, 'Authorization code issued'),
    createBadRequestError('Invalid authorization request'),
  );
}

// ============================================================================
// RBAC (ROLE-BASED ACCESS CONTROL) (8 functions)
// ============================================================================

/**
 * Creates RBAC role definition schema.
 * Schema for defining roles in RBAC system.
 *
 * @returns Role definition schema
 */
export function createRBACRoleSchema() {
  return generateObjectSchema(
    'RBAC role definition',
    {
      roleId: generateStringSchema('Role ID', { format: 'uuid' }),
      roleName: generateStringSchema('Role name', { example: 'school-nurse' }),
      displayName: generateStringSchema('Display name', { example: 'School Nurse' }),
      description: generateStringSchema('Role description'),
      permissions: generateArraySchema(
        'Role permissions',
        generateStringSchema('Permission', { example: 'patient:read' }),
        { minItems: 0 }
      ),
      parentRoles: generateArraySchema(
        'Parent roles (for inheritance)',
        generateStringSchema('Parent role ID', { format: 'uuid' }),
        { minItems: 0 }
      ),
      priority: generateNumericSchema('Role priority (for conflict resolution)', {
        type: 'integer',
        minimum: 1,
        maximum: 100,
      }),
      active: generateBooleanSchema('Role active', true),
      systemRole: generateBooleanSchema('System-defined role (cannot be deleted)', false),
      createdAt: generateFormatValidationSchema('date-time', 'Creation date'),
    },
    ['roleId', 'roleName', 'displayName', 'permissions']
  );
}

/**
 * Creates RBAC permission definition schema.
 * Schema for defining permissions.
 *
 * @returns Permission schema
 */
export function createRBACPermissionSchema() {
  return generateObjectSchema(
    'RBAC permission definition',
    {
      permissionId: generateStringSchema('Permission ID', { format: 'uuid' }),
      permissionName: generateStringSchema('Permission name', {
        pattern: '^[a-z-]+:[a-z-]+$',
        example: 'patient:read',
      }),
      resource: generateStringSchema('Resource type', { example: 'patient' }),
      action: generateEnumSchema(
        ['create', 'read', 'update', 'delete', 'execute', 'approve'],
        'Action',
        'string'
      ),
      description: generateStringSchema('Permission description'),
      category: generateEnumSchema(['clinical', 'administrative', 'system'], 'Category', 'string'),
      riskLevel: generateEnumSchema(['low', 'medium', 'high', 'critical'], 'Risk level', 'string'),
      requiresApproval: generateBooleanSchema('Requires approval to grant', false),
      auditRequired: generateBooleanSchema('Audit trail required', true),
    },
    ['permissionId', 'permissionName', 'resource', 'action', 'description', 'category', 'riskLevel']
  );
}

/**
 * Creates role assignment schema.
 * Schema for assigning roles to users.
 *
 * @returns Role assignment schema
 */
export function createRoleAssignmentSchema() {
  return generateObjectSchema(
    'Role assignment',
    {
      assignmentId: generateStringSchema('Assignment ID', { format: 'uuid' }),
      userId: generateStringSchema('User ID', { format: 'uuid' }),
      roleId: generateStringSchema('Role ID', { format: 'uuid' }),
      assignedBy: generateStringSchema('Assigned by user ID', { format: 'uuid' }),
      assignedAt: generateFormatValidationSchema('date-time', 'Assignment date'),
      expiresAt: generateFormatValidationSchema('date-time', 'Expiration date'),
      scope: generateObjectSchema('Assignment scope', {
        organizationId: generateStringSchema('Organization ID'),
        schoolIds: generateArraySchema('School IDs', generateStringSchema('School ID'), {}),
        departmentIds: generateArraySchema('Department IDs', generateStringSchema('Dept ID'), {}),
      }, []),
      conditions: generateArraySchema(
        'Assignment conditions',
        generateObjectSchema('Condition', {
          type: generateEnumSchema(['time-based', 'location-based', 'device-based'], 'Condition type', 'string'),
          value: generateStringSchema('Condition value'),
        }, ['type', 'value']),
        {}
      ),
      active: generateBooleanSchema('Assignment active', true),
    },
    ['assignmentId', 'userId', 'roleId', 'assignedBy', 'assignedAt']
  );
}

/**
 * Creates permission check endpoint decorator.
 * POST endpoint for checking user permissions.
 *
 * @returns Decorator for permission check
 */
export function createPermissionCheckEndpoint() {
  return applyDecorators(
    ApiTags('RBAC'),
    ApiOperation({
      summary: 'Check permissions',
      description: 'Verify if user has specified permissions',
    }),
    createJwtAuthentication(),
    ApiBody({
      description: 'Permission check request',
      schema: generateObjectSchema('Permission check', {
        userId: generateStringSchema('User ID', { format: 'uuid' }),
        permissions: generateArraySchema(
          'Permissions to check',
          generateStringSchema('Permission'),
          { minItems: 1 }
        ),
        resource: generateStringSchema('Resource being accessed'),
        context: generateObjectSchema('Request context', {
          ip: generateStringSchema('IP address'),
          time: generateFormatValidationSchema('date-time', 'Request time'),
          location: generateStringSchema('Location'),
        }, []),
      }, ['userId', 'permissions']),
    }),
    createSuccessResponse(Object as any, 'Permission check result'),
  );
}

/**
 * Creates hierarchical role schema.
 * Schema for role hierarchy and inheritance.
 *
 * @returns Role hierarchy schema
 */
export function createRoleHierarchySchema() {
  return generateObjectSchema(
    'Role hierarchy',
    {
      roleId: generateStringSchema('Role ID', { format: 'uuid' }),
      roleName: generateStringSchema('Role name'),
      level: generateNumericSchema('Hierarchy level', {
        type: 'integer',
        minimum: 0,
        maximum: 10,
      }),
      parentRole: generateStringSchema('Parent role ID', { format: 'uuid' }),
      childRoles: generateArraySchema(
        'Child roles',
        generateStringSchema('Child role ID', { format: 'uuid' }),
        {}
      ),
      inheritedPermissions: generateArraySchema(
        'Permissions inherited from parents',
        generateStringSchema('Permission'),
        {}
      ),
      directPermissions: generateArraySchema(
        'Permissions directly assigned',
        generateStringSchema('Permission'),
        {}
      ),
      effectivePermissions: generateArraySchema(
        'All effective permissions',
        generateStringSchema('Permission'),
        {}
      ),
    },
    ['roleId', 'roleName', 'level', 'effectivePermissions']
  );
}

/**
 * Creates dynamic permission evaluation schema.
 * Schema for context-aware permission evaluation.
 *
 * @returns Dynamic evaluation schema
 */
export function createDynamicPermissionEvaluationSchema() {
  return generateObjectSchema(
    'Dynamic permission evaluation',
    {
      evaluationId: generateStringSchema('Evaluation ID', { format: 'uuid' }),
      userId: generateStringSchema('User ID', { format: 'uuid' }),
      permission: generateStringSchema('Permission being evaluated'),
      resource: generateStringSchema('Resource'),
      context: generateObjectSchema('Evaluation context', {
        time: generateFormatValidationSchema('date-time', 'Current time'),
        location: generateStringSchema('User location'),
        device: generateStringSchema('Device type'),
        ipAddress: generateStringSchema('IP address'),
        tenantId: generateStringSchema('Tenant ID'),
      }, []),
      rules: generateArraySchema(
        'Evaluation rules',
        generateObjectSchema('Rule', {
          ruleId: generateStringSchema('Rule ID'),
          condition: generateStringSchema('Rule condition'),
          effect: generateEnumSchema(['allow', 'deny'], 'Effect', 'string'),
        }, ['ruleId', 'condition', 'effect']),
        {}
      ),
      result: generateEnumSchema(['allow', 'deny', 'abstain'], 'Evaluation result', 'string'),
      reason: generateStringSchema('Evaluation reason'),
    },
    ['evaluationId', 'userId', 'permission', 'resource', 'context', 'result']
  );
}

/**
 * Creates role creation endpoint decorator.
 * POST endpoint for creating new roles.
 *
 * @returns Decorator for role creation
 */
export function createRoleCreationEndpoint() {
  return applyDecorators(
    ApiTags('RBAC'),
    ApiOperation({
      summary: 'Create role',
      description: 'Create new RBAC role with permissions',
    }),
    createJwtAuthentication({ scopes: ['admin:roles'] }),
    createPermissionBasedSecurity(['rbac:create'], 'roles'),
    ApiBody({
      description: 'Role definition',
      schema: createRBACRoleSchema(),
    }),
    createCreatedResponse(Object as any, 'Role created'),
    createBadRequestError('Invalid role definition'),
    createConflictError('Role name already exists'),
  );
}

/**
 * Creates permission matrix schema.
 * Schema for role-permission matrix visualization.
 *
 * @returns Permission matrix schema
 */
export function createPermissionMatrixSchema() {
  return generateObjectSchema(
    'Permission matrix',
    {
      roles: generateArraySchema(
        'Roles in matrix',
        generateObjectSchema('Role', {
          roleId: generateStringSchema('Role ID'),
          roleName: generateStringSchema('Role name'),
        }, ['roleId', 'roleName']),
        {}
      ),
      permissions: generateArraySchema(
        'Permissions in matrix',
        generateObjectSchema('Permission', {
          permissionId: generateStringSchema('Permission ID'),
          permissionName: generateStringSchema('Permission name'),
        }, ['permissionId', 'permissionName']),
        {}
      ),
      matrix: generateArraySchema(
        'Permission assignments',
        generateObjectSchema('Assignment', {
          roleId: generateStringSchema('Role ID'),
          permissionId: generateStringSchema('Permission ID'),
          granted: generateBooleanSchema('Permission granted'),
          source: generateEnumSchema(['direct', 'inherited'], 'Source', 'string'),
        }, ['roleId', 'permissionId', 'granted']),
        {}
      ),
    },
    ['roles', 'permissions', 'matrix']
  );
}

// ============================================================================
// HIPAA COMPLIANCE (6 functions)
// ============================================================================

/**
 * Creates HIPAA access log schema.
 * Schema for PHI (Protected Health Information) access logging.
 *
 * @returns PHI access log schema
 */
export function createHIPAAAccessLogSchema() {
  return generateObjectSchema(
    'HIPAA PHI access log',
    {
      logId: generateStringSchema('Log entry ID', { format: 'uuid' }),
      timestamp: generateFormatValidationSchema('date-time', 'Access timestamp'),
      userId: generateStringSchema('User ID', { format: 'uuid' }),
      username: generateStringSchema('Username'),
      userRole: generateStringSchema('User role'),
      patientMRN: generateStringSchema('Patient MRN'),
      accessType: generateEnumSchema(
        ['view', 'create', 'update', 'delete', 'print', 'export'],
        'Access type',
        'string'
      ),
      dataType: generateEnumSchema(
        ['demographics', 'clinical-notes', 'lab-results', 'medications', 'immunizations'],
        'PHI data type',
        'string'
      ),
      purpose: generateEnumSchema(
        ['treatment', 'payment', 'operations', 'research', 'audit'],
        'Access purpose',
        'string'
      ),
      justification: generateStringSchema('Access justification'),
      ipAddress: generateStringSchema('IP address'),
      location: generateStringSchema('Physical location'),
      deviceId: generateStringSchema('Device identifier'),
      sessionId: generateStringSchema('Session ID', { format: 'uuid' }),
      dataAccessed: generateArraySchema(
        'Specific data accessed',
        generateStringSchema('Field name'),
        {}
      ),
      minimumNecessary: generateBooleanSchema('Minimum necessary standard met', true),
    },
    ['logId', 'timestamp', 'userId', 'patientMRN', 'accessType', 'dataType', 'purpose']
  );
}

/**
 * Creates HIPAA consent schema.
 * Schema for patient consent and authorization.
 *
 * @returns HIPAA consent schema
 */
export function createHIPAAConsentSchema() {
  return generateObjectSchema(
    'HIPAA consent and authorization',
    {
      consentId: generateStringSchema('Consent ID', { format: 'uuid' }),
      patientMRN: generateStringSchema('Patient MRN'),
      consentType: generateEnumSchema(
        ['general-consent', 'specific-authorization', 'research-authorization', 'disclosure-authorization'],
        'Consent type',
        'string'
      ),
      purpose: generateStringSchema('Purpose of disclosure', {
        example: 'Share immunization records with school district',
      }),
      disclosingParty: generateStringSchema('Disclosing party'),
      receivingParty: generateStringSchema('Receiving party'),
      informationCovered: generateArraySchema(
        'Types of information covered',
        generateStringSchema('Info type'),
        { minItems: 1 }
      ),
      expirationDate: generateFormatValidationSchema('date', 'Consent expiration'),
      signedBy: generateStringSchema('Person signing consent'),
      relationship: generateEnumSchema(
        ['self', 'parent', 'guardian', 'personal-representative'],
        'Relationship to patient',
        'string'
      ),
      signatureData: generateStringSchema('Electronic signature (base64)'),
      signedAt: generateFormatValidationSchema('date-time', 'Signature date'),
      witnessed: generateBooleanSchema('Consent witnessed'),
      witnessName: generateStringSchema('Witness name'),
      rightToRevoke: generateBooleanSchema('Right to revoke explained', true),
      revoked: generateBooleanSchema('Consent revoked', false),
      revokedAt: generateFormatValidationSchema('date-time', 'Revocation date'),
    },
    ['consentId', 'patientMRN', 'consentType', 'purpose', 'disclosingParty', 'receivingParty', 'informationCovered', 'signedBy', 'relationship', 'signedAt']
  );
}

/**
 * Creates HIPAA breach notification schema.
 * Schema for security breach notifications.
 *
 * @returns Breach notification schema
 */
export function createHIPAABreachNotificationSchema() {
  return generateObjectSchema(
    'HIPAA breach notification',
    {
      breachId: generateStringSchema('Breach ID', { format: 'uuid' }),
      discoveredAt: generateFormatValidationSchema('date-time', 'Discovery date'),
      breachType: generateEnumSchema(
        ['unauthorized-access', 'unauthorized-disclosure', 'loss', 'theft', 'hacking'],
        'Breach type',
        'string'
      ),
      affectedPatients: generateNumericSchema('Number of affected patients', {
        type: 'integer',
        minimum: 0,
      }),
      dataCompromised: generateArraySchema(
        'Types of data compromised',
        generateStringSchema('Data type'),
        { minItems: 1 }
      ),
      severity: generateEnumSchema(['low', 'medium', 'high', 'critical'], 'Breach severity', 'string'),
      causeOfBreach: generateStringSchema('Root cause analysis'),
      mitigation: generateStringSchema('Mitigation steps taken'),
      notificationRequired: generateBooleanSchema('Notification required', true),
      notifiedIndividuals: generateBooleanSchema('Individuals notified'),
      notifiedHHS: generateBooleanSchema('HHS notified'),
      notifiedMedia: generateBooleanSchema('Media notification (500+ affected)'),
      investigationStatus: generateEnumSchema(
        ['ongoing', 'completed', 'closed'],
        'Investigation status',
        'string'
      ),
      reportedBy: generateStringSchema('Reported by user'),
    },
    ['breachId', 'discoveredAt', 'breachType', 'affectedPatients', 'dataCompromised', 'severity', 'notificationRequired']
  );
}

/**
 * Creates HIPAA audit report schema.
 * Schema for compliance audit reports.
 *
 * @returns Audit report schema
 */
export function createHIPAAAuditReportSchema() {
  return generateObjectSchema(
    'HIPAA compliance audit report',
    {
      reportId: generateStringSchema('Report ID', { format: 'uuid' }),
      auditPeriod: generateObjectSchema('Audit period', {
        startDate: generateFormatValidationSchema('date', 'Period start'),
        endDate: generateFormatValidationSchema('date', 'Period end'),
      }, ['startDate', 'endDate']),
      auditedBy: generateStringSchema('Auditor'),
      complianceAreas: generateArraySchema(
        'Compliance areas assessed',
        generateObjectSchema('Area', {
          area: generateEnumSchema(
            ['privacy-rule', 'security-rule', 'breach-notification', 'enforcement'],
            'HIPAA area',
            'string'
          ),
          compliant: generateBooleanSchema('Area compliant'),
          findings: generateArraySchema('Findings', generateStringSchema('Finding'), {}),
          recommendations: generateArraySchema('Recommendations', generateStringSchema('Recommendation'), {}),
        }, ['area', 'compliant']),
        {}
      ),
      totalAccessLogs: generateNumericSchema('Total PHI access logs', {
        type: 'integer',
        minimum: 0,
      }),
      unauthorizedAccess: generateNumericSchema('Unauthorized access attempts', {
        type: 'integer',
        minimum: 0,
      }),
      dataBreaches: generateNumericSchema('Data breaches', {
        type: 'integer',
        minimum: 0,
      }),
      overallCompliance: generateNumericSchema('Overall compliance score (%)', {
        type: 'number',
        minimum: 0,
        maximum: 100,
      }),
      certificationStatus: generateEnumSchema(
        ['certified', 'conditional', 'non-compliant'],
        'Certification status',
        'string'
      ),
    },
    ['reportId', 'auditPeriod', 'auditedBy', 'complianceAreas', 'overallCompliance', 'certificationStatus']
  );
}

/**
 * Creates PHI encryption schema.
 * Schema for PHI encryption at rest and in transit.
 *
 * @returns Encryption schema
 */
export function createPHIEncryptionSchema() {
  return generateObjectSchema(
    'PHI encryption configuration',
    {
      encryptionId: generateStringSchema('Encryption config ID', { format: 'uuid' }),
      algorithm: generateEnumSchema(
        ['AES-256-GCM', 'AES-256-CBC', 'ChaCha20-Poly1305'],
        'Encryption algorithm',
        'string'
      ),
      keyManagement: generateEnumSchema(
        ['HSM', 'KMS', 'vault'],
        'Key management system',
        'string'
      ),
      keyRotationPeriod: generateNumericSchema('Key rotation period (days)', {
        type: 'integer',
        minimum: 1,
        maximum: 365,
      }),
      encryptionAtRest: generateBooleanSchema('Encryption at rest enabled', true),
      encryptionInTransit: generateBooleanSchema('Encryption in transit enabled', true),
      tlsVersion: generateEnumSchema(['TLS 1.2', 'TLS 1.3'], 'TLS version', 'string'),
      certificateExpiry: generateFormatValidationSchema('date', 'TLS certificate expiration'),
      lastKeyRotation: generateFormatValidationSchema('date-time', 'Last key rotation'),
    },
    ['encryptionId', 'algorithm', 'keyManagement', 'encryptionAtRest', 'encryptionInTransit', 'tlsVersion']
  );
}

/**
 * Creates minimum necessary access schema.
 * Schema for HIPAA minimum necessary standard enforcement.
 *
 * @returns Minimum necessary schema
 */
export function createMinimumNecessarySchema() {
  return generateObjectSchema(
    'Minimum necessary access control',
    {
      policyId: generateStringSchema('Policy ID', { format: 'uuid' }),
      userRole: generateStringSchema('User role'),
      accessPurpose: generateEnumSchema(['treatment', 'payment', 'operations'], 'Access purpose', 'string'),
      allowedDataElements: generateArraySchema(
        'Data elements accessible under minimum necessary',
        generateObjectSchema('Data element', {
          element: generateStringSchema('Data element name'),
          justification: generateStringSchema('Justification'),
        }, ['element', 'justification']),
        { minItems: 1 }
      ),
      prohibitedData: generateArraySchema(
        'Prohibited data elements',
        generateStringSchema('Prohibited element'),
        {}
      ),
      reviewRequired: generateBooleanSchema('Supervisor review required', false),
      lastReviewed: generateFormatValidationSchema('date', 'Last policy review'),
    },
    ['policyId', 'userRole', 'accessPurpose', 'allowedDataElements']
  );
}

// ============================================================================
// AUDIT TRAILS (6 functions)
// ============================================================================

/**
 * Creates comprehensive audit log schema.
 * Schema for detailed audit trail entries.
 *
 * @returns Audit log schema
 */
export function createAuditLogEntrySchema() {
  return generateObjectSchema(
    'Comprehensive audit log entry',
    {
      auditId: generateStringSchema('Audit entry ID', { format: 'uuid' }),
      timestamp: generateFormatValidationSchema('date-time', 'Event timestamp'),
      eventType: generateEnumSchema(
        ['authentication', 'authorization', 'data-access', 'data-modification', 'configuration-change', 'security-event'],
        'Event type',
        'string'
      ),
      actor: generateObjectSchema('Event actor', {
        userId: generateStringSchema('User ID', { format: 'uuid' }),
        username: generateStringSchema('Username'),
        role: generateStringSchema('User role'),
        ipAddress: generateStringSchema('IP address'),
        userAgent: generateStringSchema('User agent'),
      }, ['userId', 'username']),
      action: generateStringSchema('Action performed', {
        example: 'UPDATE_PATIENT_RECORD',
      }),
      resource: generateObjectSchema('Affected resource', {
        resourceType: generateStringSchema('Resource type'),
        resourceId: generateStringSchema('Resource ID'),
        resourceName: generateStringSchema('Resource name'),
      }, ['resourceType', 'resourceId']),
      outcome: generateEnumSchema(['success', 'failure', 'partial'], 'Event outcome', 'string'),
      severity: generateEnumSchema(['info', 'warning', 'error', 'critical'], 'Event severity', 'string'),
      changeDetails: generateObjectSchema('Change details', {
        beforeState: generateObjectSchema('State before', {}, []),
        afterState: generateObjectSchema('State after', {}, []),
        changedFields: generateArraySchema('Changed fields', generateStringSchema('Field'), {}),
      }, []),
      securityContext: generateObjectSchema('Security context', {
        sessionId: generateStringSchema('Session ID'),
        authMethod: generateStringSchema('Authentication method'),
        permissions: generateArraySchema('Permissions used', generateStringSchema('Permission'), {}),
      }, []),
      correlationId: generateStringSchema('Correlation ID for related events', { format: 'uuid' }),
      retentionPeriod: generateNumericSchema('Retention period (days)', {
        type: 'integer',
        minimum: 90,
        maximum: 2555,
      }),
    },
    ['auditId', 'timestamp', 'eventType', 'actor', 'action', 'resource', 'outcome', 'severity']
  );
}

/**
 * Creates audit trail query endpoint decorator.
 * POST endpoint for querying audit logs.
 *
 * @returns Decorator for audit query
 */
export function createAuditTrailQueryEndpoint() {
  return applyDecorators(
    ApiTags('Audit Trails'),
    ApiOperation({
      summary: 'Query audit trails',
      description: 'Search audit logs with advanced filtering',
    }),
    createJwtAuthentication({ scopes: ['audit:read'] }),
    createPermissionBasedSecurity(['audit:query'], 'audit-logs'),
    ApiBody({
      description: 'Audit query',
      schema: generateObjectSchema('Audit query', {
        filters: generateObjectSchema('Query filters', {
          userId: generateStringSchema('User ID'),
          eventType: generateArraySchema('Event types', generateStringSchema('Type'), {}),
          dateRange: generateObjectSchema('Date range', {
            startDate: generateFormatValidationSchema('date-time', 'Start'),
            endDate: generateFormatValidationSchema('date-time', 'End'),
          }, ['startDate', 'endDate']),
          resourceType: generateStringSchema('Resource type'),
          outcome: generateArraySchema('Outcomes', generateStringSchema('Outcome'), {}),
        }, []),
        page: generateNumericSchema('Page number', { type: 'integer', minimum: 1 }),
        limit: generateNumericSchema('Page size', { type: 'integer', minimum: 1, maximum: 1000 }),
      }, ['filters']),
    }),
    createSuccessResponse(Object as any, 'Audit log results'),
  );
}

/**
 * Creates tamper-evident log schema.
 * Schema for immutable, tamper-evident audit logs.
 *
 * @returns Tamper-evident schema
 */
export function createTamperEvidentLogSchema() {
  return generateObjectSchema(
    'Tamper-evident audit log',
    {
      logId: generateStringSchema('Log entry ID', { format: 'uuid' }),
      sequenceNumber: generateNumericSchema('Sequence number', {
        type: 'integer',
        minimum: 1,
      }),
      previousHash: generateStringSchema('Hash of previous log entry'),
      currentHash: generateStringSchema('Hash of current entry'),
      hashAlgorithm: generateEnumSchema(['SHA-256', 'SHA-512'], 'Hash algorithm', 'string'),
      logEntry: createAuditLogEntrySchema(),
      digitalSignature: generateStringSchema('Digital signature'),
      signatureAlgorithm: generateStringSchema('Signature algorithm'),
      timestamp: generateFormatValidationSchema('date-time', 'Entry timestamp'),
      blockchainReference: generateStringSchema('Blockchain reference (if applicable)'),
      verified: generateBooleanSchema('Integrity verified'),
    },
    ['logId', 'sequenceNumber', 'previousHash', 'currentHash', 'hashAlgorithm', 'logEntry', 'timestamp']
  );
}

/**
 * Creates audit log retention schema.
 * Schema for audit log retention policies.
 *
 * @returns Retention policy schema
 */
export function createAuditRetentionPolicySchema() {
  return generateObjectSchema(
    'Audit log retention policy',
    {
      policyId: generateStringSchema('Policy ID', { format: 'uuid' }),
      logType: generateEnumSchema(
        ['phi-access', 'authentication', 'configuration', 'security-event'],
        'Log type',
        'string'
      ),
      retentionPeriod: generateNumericSchema('Retention period (days)', {
        type: 'integer',
        minimum: 90,
        maximum: 7300,
      }),
      archivalStrategy: generateEnumSchema(
        ['hot-storage', 'warm-storage', 'cold-storage', 'glacier'],
        'Archival strategy',
        'string'
      ),
      compressionEnabled: generateBooleanSchema('Compression enabled', true),
      encryptionRequired: generateBooleanSchema('Encryption required', true),
      automaticDeletion: generateBooleanSchema('Automatic deletion enabled', false),
      legalHold: generateBooleanSchema('Legal hold applied', false),
      complianceFramework: generateArraySchema(
        'Compliance frameworks',
        generateEnumSchema(['HIPAA', 'FERPA', 'SOC2', 'PCI-DSS'], 'Framework', 'string'),
        {}
      ),
    },
    ['policyId', 'logType', 'retentionPeriod', 'archivalStrategy']
  );
}

/**
 * Creates log integrity verification schema.
 * Schema for verifying audit log integrity.
 *
 * @returns Integrity verification schema
 */
export function createLogIntegrityVerificationSchema() {
  return generateObjectSchema(
    'Audit log integrity verification',
    {
      verificationId: generateStringSchema('Verification ID', { format: 'uuid' }),
      verifiedAt: generateFormatValidationSchema('date-time', 'Verification timestamp'),
      logRange: generateObjectSchema('Log range verified', {
        startSequence: generateNumericSchema('Start sequence', { type: 'integer' }),
        endSequence: generateNumericSchema('End sequence', { type: 'integer' }),
        totalLogs: generateNumericSchema('Total logs verified', { type: 'integer' }),
      }, ['startSequence', 'endSequence', 'totalLogs']),
      integrityStatus: generateEnumSchema(['intact', 'compromised', 'inconclusive'], 'Integrity status', 'string'),
      violations: generateArraySchema(
        'Integrity violations',
        generateObjectSchema('Violation', {
          logId: generateStringSchema('Log ID'),
          violationType: generateEnumSchema(['hash-mismatch', 'missing-entry', 'sequence-gap'], 'Type', 'string'),
          description: generateStringSchema('Violation description'),
        }, ['logId', 'violationType', 'description']),
        {}
      ),
      verificationMethod: generateEnumSchema(
        ['hash-chain', 'digital-signature', 'blockchain'],
        'Verification method',
        'string'
      ),
      verifiedBy: generateStringSchema('Verification performed by'),
    },
    ['verificationId', 'verifiedAt', 'logRange', 'integrityStatus', 'verificationMethod']
  );
}

/**
 * Creates security event correlation schema.
 * Schema for correlating related security events.
 *
 * @returns Event correlation schema
 */
export function createSecurityEventCorrelationSchema() {
  return generateObjectSchema(
    'Security event correlation',
    {
      correlationId: generateStringSchema('Correlation ID', { format: 'uuid' }),
      correlatedEvents: generateArraySchema(
        'Correlated events',
        generateStringSchema('Event ID', { format: 'uuid' }),
        { minItems: 2 }
      ),
      pattern: generateEnumSchema(
        ['brute-force-attack', 'privilege-escalation', 'data-exfiltration', 'anomalous-access'],
        'Attack pattern',
        'string'
      ),
      severity: generateEnumSchema(['low', 'medium', 'high', 'critical'], 'Correlation severity', 'string'),
      confidence: generateNumericSchema('Correlation confidence (%)', {
        type: 'number',
        minimum: 0,
        maximum: 100,
      }),
      firstEventAt: generateFormatValidationSchema('date-time', 'First event timestamp'),
      lastEventAt: generateFormatValidationSchema('date-time', 'Last event timestamp'),
      affectedUsers: generateArraySchema('Affected users', generateStringSchema('User ID'), {}),
      affectedResources: generateArraySchema('Affected resources', generateStringSchema('Resource ID'), {}),
      recommendedAction: generateStringSchema('Recommended remediation action'),
      acknowledged: generateBooleanSchema('Correlation acknowledged', false),
    },
    ['correlationId', 'correlatedEvents', 'pattern', 'severity', 'confidence', 'firstEventAt', 'lastEventAt']
  );
}

// ============================================================================
// SECURITY HEADERS & SESSION MANAGEMENT (10 functions)
// ============================================================================

/**
 * Creates security headers configuration schema.
 * Schema for HTTP security headers.
 *
 * @returns Security headers schema
 */
export function createSecurityHeadersSchema() {
  return generateObjectSchema(
    'HTTP security headers configuration',
    {
      contentSecurityPolicy: generateStringSchema('Content-Security-Policy', {
        example: "default-src 'self'; script-src 'self' 'unsafe-inline'",
      }),
      strictTransportSecurity: generateStringSchema('Strict-Transport-Security', {
        example: 'max-age=31536000; includeSubDomains; preload',
      }),
      xFrameOptions: generateEnumSchema(['DENY', 'SAMEORIGIN'], 'X-Frame-Options', 'string'),
      xContentTypeOptions: generateStringSchema('X-Content-Type-Options', {
        example: 'nosniff',
      }),
      xXSSProtection: generateStringSchema('X-XSS-Protection', {
        example: '1; mode=block',
      }),
      referrerPolicy: generateEnumSchema(
        ['no-referrer', 'no-referrer-when-downgrade', 'origin', 'strict-origin', 'strict-origin-when-cross-origin'],
        'Referrer-Policy',
        'string'
      ),
      permissionsPolicy: generateStringSchema('Permissions-Policy', {
        example: 'geolocation=(), microphone=()',
      }),
    },
    ['contentSecurityPolicy', 'strictTransportSecurity', 'xFrameOptions']
  );
}

/**
 * Creates session management schema.
 * Schema for secure session management.
 *
 * @returns Session schema
 */
export function createSessionManagementSchema() {
  return generateObjectSchema(
    'Session management',
    {
      sessionId: generateStringSchema('Session ID', { format: 'uuid' }),
      userId: generateStringSchema('User ID', { format: 'uuid' }),
      createdAt: generateFormatValidationSchema('date-time', 'Session creation'),
      expiresAt: generateFormatValidationSchema('date-time', 'Session expiration'),
      lastActivityAt: generateFormatValidationSchema('date-time', 'Last activity'),
      ipAddress: generateStringSchema('IP address'),
      userAgent: generateStringSchema('User agent'),
      deviceFingerprint: generateStringSchema('Device fingerprint'),
      sessionData: generateObjectSchema('Session data', {}, []),
      secure: generateBooleanSchema('Secure session (HTTPS)', true),
      httpOnly: generateBooleanSchema('HTTP-only cookie', true),
      sameSite: generateEnumSchema(['strict', 'lax', 'none'], 'SameSite attribute', 'string'),
      concurrent: generateBooleanSchema('Concurrent session allowed', false),
      maxIdleTime: generateNumericSchema('Max idle time (seconds)', {
        type: 'integer',
        minimum: 60,
        maximum: 86400,
      }),
    },
    ['sessionId', 'userId', 'createdAt', 'expiresAt', 'secure', 'httpOnly', 'sameSite']
  );
}

/**
 * Creates password policy schema.
 * Schema for password complexity and rotation policies.
 *
 * @returns Password policy schema
 */
export function createPasswordPolicySchema() {
  return generateObjectSchema(
    'Password policy',
    {
      policyId: generateStringSchema('Policy ID', { format: 'uuid' }),
      minLength: generateNumericSchema('Minimum length', {
        type: 'integer',
        minimum: 8,
        maximum: 128,
      }),
      maxLength: generateNumericSchema('Maximum length', {
        type: 'integer',
        minimum: 8,
        maximum: 128,
      }),
      requireUppercase: generateBooleanSchema('Require uppercase letters', true),
      requireLowercase: generateBooleanSchema('Require lowercase letters', true),
      requireNumbers: generateBooleanSchema('Require numbers', true),
      requireSpecialChars: generateBooleanSchema('Require special characters', true),
      prohibitCommonPasswords: generateBooleanSchema('Prohibit common passwords', true),
      prohibitUserInfo: generateBooleanSchema('Prohibit user information', true),
      expirationDays: generateNumericSchema('Password expiration (days)', {
        type: 'integer',
        minimum: 30,
        maximum: 365,
      }),
      passwordHistory: generateNumericSchema('Password history', {
        type: 'integer',
        minimum: 0,
        maximum: 24,
      }),
      maxFailedAttempts: generateNumericSchema('Max failed attempts', {
        type: 'integer',
        minimum: 3,
        maximum: 10,
      }),
      lockoutDuration: generateNumericSchema('Lockout duration (minutes)', {
        type: 'integer',
        minimum: 5,
        maximum: 1440,
      }),
    },
    ['policyId', 'minLength', 'requireUppercase', 'requireLowercase', 'requireNumbers']
  );
}

/**
 * Creates API rate limiting endpoint decorator.
 * Endpoint for configuring rate limits.
 *
 * @returns Decorator for rate limit configuration
 */
export function createRateLimitConfigEndpoint() {
  return applyDecorators(
    ApiTags('Security Configuration'),
    ApiOperation({
      summary: 'Configure rate limits',
      description: 'Set API rate limiting rules per user/client',
    }),
    createJwtAuthentication({ scopes: ['admin:security'] }),
    ApiBody({
      description: 'Rate limit configuration',
      schema: generateObjectSchema('Rate limit config', {
        userId: generateStringSchema('User ID (optional)'),
        clientId: generateStringSchema('Client ID (optional)'),
        limits: generateObjectSchema('Limits', {
          requestsPerSecond: generateNumericSchema('Requests per second', { type: 'integer' }),
          requestsPerMinute: generateNumericSchema('Requests per minute', { type: 'integer' }),
          requestsPerHour: generateNumericSchema('Requests per hour', { type: 'integer' }),
          requestsPerDay: generateNumericSchema('Requests per day', { type: 'integer' }),
        }, []),
      }, ['limits']),
    }),
    createCreatedResponse(Object as any, 'Rate limit configured'),
  );
}

/**
 * Creates intrusion detection schema.
 * Schema for intrusion detection and prevention.
 *
 * @returns IDS/IPS schema
 */
export function createIntrusionDetectionSchema() {
  return generateObjectSchema(
    'Intrusion detection event',
    {
      eventId: generateStringSchema('Event ID', { format: 'uuid' }),
      detectedAt: generateFormatValidationSchema('date-time', 'Detection timestamp'),
      attackType: generateEnumSchema(
        ['sql-injection', 'xss', 'csrf', 'path-traversal', 'command-injection', 'brute-force'],
        'Attack type',
        'string'
      ),
      severity: generateEnumSchema(['low', 'medium', 'high', 'critical'], 'Severity', 'string'),
      sourceIp: generateStringSchema('Source IP address'),
      targetEndpoint: generateStringSchema('Target endpoint'),
      payload: generateStringSchema('Attack payload'),
      blocked: generateBooleanSchema('Attack blocked', true),
      confidence: generateNumericSchema('Detection confidence (%)', {
        type: 'number',
        minimum: 0,
        maximum: 100,
      }),
      mitigationAction: generateEnumSchema(
        ['blocked', 'logged', 'rate-limited', 'captcha-challenged'],
        'Mitigation',
        'string'
      ),
    },
    ['eventId', 'detectedAt', 'attackType', 'severity', 'sourceIp', 'targetEndpoint', 'blocked']
  );
}

/**
 * Creates multi-factor authentication setup schema.
 * Schema for MFA configuration.
 *
 * @returns MFA setup schema
 */
export function createMFASetupSchema() {
  return generateObjectSchema(
    'Multi-factor authentication setup',
    {
      userId: generateStringSchema('User ID', { format: 'uuid' }),
      mfaMethods: generateArraySchema(
        'Enabled MFA methods',
        generateEnumSchema(['totp', 'sms', 'email', 'hardware-token'], 'MFA method', 'string'),
        { minItems: 1 }
      ),
      totpSecret: generateStringSchema('TOTP secret (base32)'),
      qrCodeUrl: generateStringSchema('QR code URL'),
      backupCodes: generateArraySchema(
        'Backup codes',
        generateStringSchema('Code', { pattern: '^[0-9]{8}$' }),
        { minItems: 10, maxItems: 10 }
      ),
      phoneNumber: generateStringSchema('Phone number for SMS'),
      enabled: generateBooleanSchema('MFA enabled', true),
      enforced: generateBooleanSchema('MFA enforced (mandatory)', false),
    },
    ['userId', 'mfaMethods']
  );
}

/**
 * Creates device trust schema.
 * Schema for trusted device management.
 *
 * @returns Device trust schema
 */
export function createDeviceTrustSchema() {
  return generateObjectSchema(
    'Trusted device',
    {
      deviceId: generateStringSchema('Device ID', { format: 'uuid' }),
      userId: generateStringSchema('User ID', { format: 'uuid' }),
      deviceFingerprint: generateStringSchema('Device fingerprint'),
      deviceName: generateStringSchema('Device name', { example: 'iPhone 14 Pro' }),
      deviceType: generateEnumSchema(['desktop', 'mobile', 'tablet'], 'Device type', 'string'),
      operatingSystem: generateStringSchema('Operating system'),
      browser: generateStringSchema('Browser'),
      lastSeen: generateFormatValidationSchema('date-time', 'Last seen'),
      trusted: generateBooleanSchema('Device trusted', true),
      trustedAt: generateFormatValidationSchema('date-time', 'Trust established'),
      riskScore: generateNumericSchema('Risk score', {
        type: 'number',
        minimum: 0,
        maximum: 100,
      }),
    },
    ['deviceId', 'userId', 'deviceFingerprint', 'deviceName', 'deviceType', 'trusted']
  );
}

/**
 * Creates security incident response schema.
 * Schema for security incident workflows.
 *
 * @returns Incident response schema
 */
export function createSecurityIncidentResponseSchema() {
  return generateObjectSchema(
    'Security incident response',
    {
      incidentId: generateStringSchema('Incident ID', { format: 'uuid' }),
      reportedAt: generateFormatValidationSchema('date-time', 'Report timestamp'),
      reportedBy: generateStringSchema('Reporter user ID', { format: 'uuid' }),
      incidentType: generateEnumSchema(
        ['data-breach', 'unauthorized-access', 'malware', 'phishing', 'dos-attack'],
        'Incident type',
        'string'
      ),
      severity: generateEnumSchema(['low', 'medium', 'high', 'critical'], 'Severity', 'string'),
      status: generateEnumSchema(
        ['reported', 'investigating', 'contained', 'eradicated', 'recovered', 'closed'],
        'Incident status',
        'string'
      ),
      affectedSystems: generateArraySchema('Affected systems', generateStringSchema('System'), {}),
      affectedUsers: generateArraySchema('Affected users', generateStringSchema('User ID'), {}),
      timeline: generateArraySchema(
        'Incident timeline',
        generateObjectSchema('Timeline event', {
          timestamp: generateFormatValidationSchema('date-time', 'Event time'),
          event: generateStringSchema('Event description'),
          actor: generateStringSchema('Actor'),
        }, ['timestamp', 'event']),
        {}
      ),
      containmentActions: generateArraySchema('Containment actions', generateStringSchema('Action'), {}),
      rootCause: generateStringSchema('Root cause analysis'),
      lessonsLearned: generateStringSchema('Lessons learned'),
    },
    ['incidentId', 'reportedAt', 'reportedBy', 'incidentType', 'severity', 'status']
  );
}

/**
 * Creates vulnerability assessment schema.
 * Schema for security vulnerability assessments.
 *
 * @returns Vulnerability assessment schema
 */
export function createVulnerabilityAssessmentSchema() {
  return generateObjectSchema(
    'Vulnerability assessment',
    {
      assessmentId: generateStringSchema('Assessment ID', { format: 'uuid' }),
      assessmentDate: generateFormatValidationSchema('date-time', 'Assessment date'),
      assessmentType: generateEnumSchema(
        ['automated-scan', 'manual-review', 'penetration-test'],
        'Assessment type',
        'string'
      ),
      vulnerabilities: generateArraySchema(
        'Identified vulnerabilities',
        generateObjectSchema('Vulnerability', {
          cveId: generateStringSchema('CVE ID', { example: 'CVE-2024-12345' }),
          severity: generateEnumSchema(['low', 'medium', 'high', 'critical'], 'CVSS severity', 'string'),
          cvssScore: generateNumericSchema('CVSS score', {
            type: 'number',
            minimum: 0,
            maximum: 10,
          }),
          affectedComponent: generateStringSchema('Affected component'),
          description: generateStringSchema('Vulnerability description'),
          remediation: generateStringSchema('Remediation steps'),
          status: generateEnumSchema(['open', 'in-progress', 'resolved', 'accepted'], 'Status', 'string'),
        }, ['severity', 'affectedComponent', 'description', 'status']),
        {}
      ),
      overallRiskScore: generateNumericSchema('Overall risk score', {
        type: 'number',
        minimum: 0,
        maximum: 100,
      }),
    },
    ['assessmentId', 'assessmentDate', 'assessmentType', 'vulnerabilities', 'overallRiskScore']
  );
}

/**
 * Creates compliance reporting endpoint decorator.
 * GET endpoint for security compliance reports.
 *
 * @returns Decorator for compliance reporting
 */
export function createComplianceReportingEndpoint() {
  return applyDecorators(
    ApiTags('Security Compliance'),
    ApiOperation({
      summary: 'Generate compliance report',
      description: 'Generate security compliance report for HIPAA/FERPA/SOC2',
    }),
    createJwtAuthentication({ scopes: ['admin:compliance'] }),
    ApiQuery({
      name: 'framework',
      required: true,
      enum: ['HIPAA', 'FERPA', 'SOC2', 'PCI-DSS'],
      description: 'Compliance framework',
    }),
    createDateRangeQueryParams('startDate', 'endDate', 'date'),
    createSuccessResponse(Object as any, 'Compliance report'),
  );
}
