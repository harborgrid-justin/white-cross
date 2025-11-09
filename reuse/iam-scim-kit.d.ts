/**
 * @fileoverview SCIM 2.0 Protocol Implementation Utilities
 * @module reuse/iam-scim-kit
 * @description Comprehensive SCIM (System for Cross-domain Identity Management) 2.0 protocol
 * implementation for NestJS applications covering user/group provisioning, filtering, pagination,
 * bulk operations, patch operations, schema extensions, and service provider configuration.
 *
 * Key Features:
 * - SCIM 2.0 protocol compliance (RFC 7643, RFC 7644)
 * - User and Group resource schemas
 * - SCIM filtering and query parsing
 * - Pagination and sorting utilities
 * - Bulk operations support
 * - JSON Patch operations (RFC 6902)
 * - SCIM Patch operations (RFC 7644 Section 3.5.2)
 * - Schema extensions (Enterprise User, Healthcare extensions)
 * - Resource type definitions
 * - SCIM authentication (Bearer, Basic)
 * - SCIM error responses
 * - Service provider configuration
 * - Resource versioning (ETags)
 * - SCIM discovery endpoints
 * - Custom attribute support
 * - Healthcare-specific SCIM extensions (HIPAA-compliant)
 *
 * @target NestJS v11.x, Node 18+, TypeScript 5.x
 *
 * @security
 * - SCIM authentication support
 * - PII data filtering
 * - HIPAA-compliant resource handling
 * - Audit logging for SCIM operations
 * - Rate limiting support
 * - Secure default configurations
 *
 * @example Basic usage
 * ```typescript
 * import { createSCIMUser, parseSCIMFilter, applySCIMPatch } from './iam-scim-kit';
 *
 * // Create SCIM user resource
 * const user = createSCIMUser({
 *   userName: 'jdoe@example.com',
 *   name: { givenName: 'John', familyName: 'Doe' },
 *   emails: [{ value: 'jdoe@example.com', primary: true }]
 * });
 *
 * // Parse filter
 * const filter = parseSCIMFilter('userName eq "jdoe@example.com"');
 *
 * // Apply patch
 * const patched = applySCIMPatch(user, patchOps);
 * ```
 *
 * @example Advanced usage
 * ```typescript
 * import {
 *   createSCIMGroup,
 *   executeBulkOperation,
 *   createServiceProviderConfig,
 *   validateSCIMResource
 * } from './iam-scim-kit';
 *
 * // Create group with members
 * const group = createSCIMGroup({
 *   displayName: 'Doctors',
 *   members: [{ value: 'user123', display: 'John Doe' }]
 * });
 *
 * // Execute bulk operation
 * const result = await executeBulkOperation({
 *   Operations: [
 *     { method: 'POST', path: '/Users', data: userData },
 *     { method: 'PUT', path: '/Users/123', data: updatedData }
 *   ]
 * });
 * ```
 *
 * LOC: SCIM-IAM-2025
 * UPSTREAM: @nestjs/common, class-validator, jsonpath, fast-json-patch
 * DOWNSTREAM: IAM modules, user management, group management, provisioning
 *
 * @version 1.0.0
 * @since 2025-11-08
 */
/**
 * @interface SCIMResource
 * @description Base SCIM resource with common attributes
 */
export interface SCIMResource {
    /** Resource schemas */
    schemas: string[];
    /** Unique identifier */
    id?: string;
    /** External identifier */
    externalId?: string;
    /** Resource metadata */
    meta?: SCIMResourceMeta;
}
/**
 * @interface SCIMResourceMeta
 * @description SCIM resource metadata
 */
export interface SCIMResourceMeta {
    /** Resource type */
    resourceType: string;
    /** Creation timestamp */
    created?: string;
    /** Last modified timestamp */
    lastModified?: string;
    /** Resource location URI */
    location?: string;
    /** Version identifier (ETag) */
    version?: string;
}
/**
 * @interface SCIMUser
 * @description SCIM User resource (RFC 7643 Section 4.1)
 */
export interface SCIMUser extends SCIMResource {
    /** Unique identifier for the user */
    userName: string;
    /** User's name components */
    name?: SCIMName;
    /** Display name */
    displayName?: string;
    /** Nickname */
    nickName?: string;
    /** Profile URL */
    profileUrl?: string;
    /** User title */
    title?: string;
    /** User type */
    userType?: string;
    /** Preferred language */
    preferredLanguage?: string;
    /** Locale */
    locale?: string;
    /** Timezone */
    timezone?: string;
    /** Active status */
    active?: boolean;
    /** Password */
    password?: string;
    /** Email addresses */
    emails?: SCIMEmail[];
    /** Phone numbers */
    phoneNumbers?: SCIMPhoneNumber[];
    /** Instant messaging addresses */
    ims?: SCIMIm[];
    /** Photos */
    photos?: SCIMPhoto[];
    /** Addresses */
    addresses?: SCIMAddress[];
    /** Groups */
    groups?: SCIMGroupMembership[];
    /** Entitlements */
    entitlements?: SCIMMultiValuedAttribute[];
    /** Roles */
    roles?: SCIMMultiValuedAttribute[];
    /** X509 Certificates */
    x509Certificates?: SCIMMultiValuedAttribute[];
    /** Enterprise extension */
    'urn:ietf:params:scim:schemas:extension:enterprise:2.0:User'?: SCIMEnterpriseUser;
    /** Healthcare extension */
    'urn:white-cross:scim:schemas:extension:healthcare:1.0:User'?: SCIMHealthcareUser;
}
/**
 * @interface SCIMName
 * @description User's name components
 */
export interface SCIMName {
    /** Formatted full name */
    formatted?: string;
    /** Family name */
    familyName?: string;
    /** Given name */
    givenName?: string;
    /** Middle name */
    middleName?: string;
    /** Honorific prefix */
    honorificPrefix?: string;
    /** Honorific suffix */
    honorificSuffix?: string;
}
/**
 * @interface SCIMEmail
 * @description Email address with metadata
 */
export interface SCIMEmail {
    /** Email value */
    value: string;
    /** Email display */
    display?: string;
    /** Email type */
    type?: 'work' | 'home' | 'other';
    /** Primary flag */
    primary?: boolean;
}
/**
 * @interface SCIMPhoneNumber
 * @description Phone number with metadata
 */
export interface SCIMPhoneNumber {
    /** Phone value */
    value: string;
    /** Phone display */
    display?: string;
    /** Phone type */
    type?: 'work' | 'home' | 'mobile' | 'fax' | 'pager' | 'other';
    /** Primary flag */
    primary?: boolean;
}
/**
 * @interface SCIMIm
 * @description Instant messaging address
 */
export interface SCIMIm {
    /** IM value */
    value: string;
    /** IM display */
    display?: string;
    /** IM type */
    type?: 'aim' | 'gtalk' | 'icq' | 'xmpp' | 'msn' | 'skype' | 'qq' | 'yahoo';
    /** Primary flag */
    primary?: boolean;
}
/**
 * @interface SCIMPhoto
 * @description Photo URL with metadata
 */
export interface SCIMPhoto {
    /** Photo URL */
    value: string;
    /** Photo display */
    display?: string;
    /** Photo type */
    type?: 'photo' | 'thumbnail';
    /** Primary flag */
    primary?: boolean;
}
/**
 * @interface SCIMAddress
 * @description Physical mailing address
 */
export interface SCIMAddress {
    /** Formatted address */
    formatted?: string;
    /** Street address */
    streetAddress?: string;
    /** Locality (city) */
    locality?: string;
    /** Region (state) */
    region?: string;
    /** Postal code */
    postalCode?: string;
    /** Country */
    country?: string;
    /** Address type */
    type?: 'work' | 'home' | 'other';
    /** Primary flag */
    primary?: boolean;
}
/**
 * @interface SCIMGroupMembership
 * @description Group membership reference
 */
export interface SCIMGroupMembership {
    /** Group ID */
    value: string;
    /** Group reference URI */
    $ref?: string;
    /** Group display name */
    display?: string;
    /** Membership type */
    type?: 'direct' | 'indirect';
}
/**
 * @interface SCIMMultiValuedAttribute
 * @description Generic multi-valued attribute
 */
export interface SCIMMultiValuedAttribute {
    /** Attribute value */
    value: string;
    /** Display value */
    display?: string;
    /** Attribute type */
    type?: string;
    /** Primary flag */
    primary?: boolean;
}
/**
 * @interface SCIMEnterpriseUser
 * @description Enterprise User extension (RFC 7643 Section 4.3)
 */
export interface SCIMEnterpriseUser {
    /** Employee number */
    employeeNumber?: string;
    /** Cost center */
    costCenter?: string;
    /** Organization */
    organization?: string;
    /** Division */
    division?: string;
    /** Department */
    department?: string;
    /** Manager reference */
    manager?: {
        value?: string;
        $ref?: string;
        displayName?: string;
    };
}
/**
 * @interface SCIMHealthcareUser
 * @description Healthcare-specific user extension
 */
export interface SCIMHealthcareUser {
    /** Healthcare provider ID (NPI) */
    npi?: string;
    /** Medical license number */
    licenseNumber?: string;
    /** License state */
    licenseState?: string;
    /** Specialty */
    specialty?: string;
    /** Board certification */
    boardCertification?: string[];
    /** DEA number */
    deaNumber?: string;
    /** HIPAA training completion date */
    hipaaTrainingDate?: string;
    /** Background check date */
    backgroundCheckDate?: string;
}
/**
 * @interface SCIMGroup
 * @description SCIM Group resource (RFC 7643 Section 4.2)
 */
export interface SCIMGroup extends SCIMResource {
    /** Group display name */
    displayName: string;
    /** Group members */
    members?: SCIMGroupMember[];
}
/**
 * @interface SCIMGroupMember
 * @description Group member reference
 */
export interface SCIMGroupMember {
    /** Member ID */
    value: string;
    /** Member reference URI */
    $ref?: string;
    /** Member display name */
    display?: string;
    /** Member type */
    type?: 'User' | 'Group';
}
/**
 * @interface SCIMListResponse
 * @description SCIM list response with pagination
 */
export interface SCIMListResponse<T = any> {
    /** Response schemas */
    schemas: string[];
    /** Total results */
    totalResults: number;
    /** Resources */
    Resources: T[];
    /** Start index (1-based) */
    startIndex?: number;
    /** Items per page */
    itemsPerPage?: number;
}
/**
 * @interface SCIMError
 * @description SCIM error response (RFC 7644 Section 3.12)
 */
export interface SCIMError {
    /** Error schemas */
    schemas: string[];
    /** Error detail */
    detail?: string;
    /** HTTP status */
    status: number;
    /** SCIM error type */
    scimType?: string;
}
/**
 * @interface SCIMPatchOperation
 * @description SCIM Patch operation (RFC 7644 Section 3.5.2)
 */
export interface SCIMPatchOperation {
    /** Operation type */
    op: 'add' | 'remove' | 'replace';
    /** Attribute path */
    path?: string;
    /** Operation value */
    value?: any;
}
/**
 * @interface SCIMPatchRequest
 * @description SCIM Patch request
 */
export interface SCIMPatchRequest {
    /** Request schemas */
    schemas: string[];
    /** Patch operations */
    Operations: SCIMPatchOperation[];
}
/**
 * @interface SCIMBulkOperation
 * @description SCIM Bulk operation
 */
export interface SCIMBulkOperation {
    /** HTTP method */
    method: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    /** Bulk operation ID */
    bulkId?: string;
    /** Resource path */
    path: string;
    /** Request data */
    data?: any;
    /** Version (ETag) */
    version?: string;
}
/**
 * @interface SCIMBulkRequest
 * @description SCIM Bulk request
 */
export interface SCIMBulkRequest {
    /** Request schemas */
    schemas: string[];
    /** Fail on errors */
    failOnErrors?: number;
    /** Bulk operations */
    Operations: SCIMBulkOperation[];
}
/**
 * @interface SCIMBulkResponse
 * @description SCIM Bulk response
 */
export interface SCIMBulkResponse {
    /** Response schemas */
    schemas: string[];
    /** Bulk operation results */
    Operations: Array<{
        bulkId?: string;
        method: string;
        location?: string;
        status: number;
        response?: any;
    }>;
}
/**
 * @interface SCIMServiceProviderConfig
 * @description SCIM Service Provider configuration (RFC 7643 Section 5)
 */
export interface SCIMServiceProviderConfig {
    /** Config schemas */
    schemas: string[];
    /** Documentation URI */
    documentationUri?: string;
    /** Patch support */
    patch: {
        supported: boolean;
    };
    /** Bulk support */
    bulk: {
        supported: boolean;
        maxOperations?: number;
        maxPayloadSize?: number;
    };
    /** Filter support */
    filter: {
        supported: boolean;
        maxResults?: number;
    };
    /** Change password support */
    changePassword: {
        supported: boolean;
    };
    /** Sort support */
    sort: {
        supported: boolean;
    };
    /** ETag support */
    etag: {
        supported: boolean;
    };
    /** Authentication schemes */
    authenticationSchemes: Array<{
        type: string;
        name: string;
        description: string;
        specUri?: string;
        documentationUri?: string;
        primary?: boolean;
    }>;
}
/**
 * @interface SCIMResourceType
 * @description SCIM Resource Type definition
 */
export interface SCIMResourceType {
    /** Schemas */
    schemas: string[];
    /** Resource type ID */
    id: string;
    /** Resource type name */
    name: string;
    /** Description */
    description?: string;
    /** Endpoint */
    endpoint: string;
    /** Core schema */
    schema: string;
    /** Schema extensions */
    schemaExtensions?: Array<{
        schema: string;
        required: boolean;
    }>;
}
/**
 * @interface SCIMFilterOptions
 * @description SCIM filter parsing options
 */
export interface SCIMFilterOptions {
    /** Filter string */
    filter?: string;
    /** Sort by attribute */
    sortBy?: string;
    /** Sort order */
    sortOrder?: 'ascending' | 'descending';
    /** Start index (1-based) */
    startIndex?: number;
    /** Count */
    count?: number;
    /** Attributes to return */
    attributes?: string[];
    /** Attributes to exclude */
    excludedAttributes?: string[];
}
/**
 * Creates a SCIM User resource.
 *
 * @param {Partial<SCIMUser>} userData - User data
 * @returns {SCIMUser} SCIM User resource
 *
 * @example
 * ```typescript
 * const user = createSCIMUser({
 *   userName: 'jdoe@example.com',
 *   name: { givenName: 'John', familyName: 'Doe' },
 *   emails: [{ value: 'jdoe@example.com', primary: true }]
 * });
 * ```
 */
export declare const createSCIMUser: (userData: Partial<SCIMUser>) => SCIMUser;
/**
 * Creates a SCIM Group resource.
 *
 * @param {Partial<SCIMGroup>} groupData - Group data
 * @returns {SCIMGroup} SCIM Group resource
 *
 * @example
 * ```typescript
 * const group = createSCIMGroup({
 *   displayName: 'Doctors',
 *   members: [{ value: 'user123', display: 'John Doe' }]
 * });
 * ```
 */
export declare const createSCIMGroup: (groupData: Partial<SCIMGroup>) => SCIMGroup;
/**
 * Creates a SCIM list response.
 *
 * @param {T[]} resources - Resources array
 * @param {number} totalResults - Total results count
 * @param {number} startIndex - Start index (1-based)
 * @param {number} count - Items per page
 * @returns {SCIMListResponse<T>} SCIM list response
 *
 * @example
 * ```typescript
 * const response = createSCIMListResponse(users, 100, 1, 10);
 * ```
 */
export declare const createSCIMListResponse: <T = any>(resources: T[], totalResults: number, startIndex?: number, count?: number) => SCIMListResponse<T>;
/**
 * Creates a SCIM error response.
 *
 * @param {number} status - HTTP status code
 * @param {string} detail - Error detail
 * @param {string} scimType - SCIM error type
 * @returns {SCIMError} SCIM error
 *
 * @example
 * ```typescript
 * const error = createSCIMError(404, 'User not found', 'notFound');
 * ```
 */
export declare const createSCIMError: (status: number, detail?: string, scimType?: string) => SCIMError;
/**
 * Parses SCIM filter string.
 *
 * @param {string} filter - SCIM filter string
 * @returns {any} Parsed filter object
 *
 * @example
 * ```typescript
 * const filter = parseSCIMFilter('userName eq "jdoe@example.com"');
 * ```
 */
export declare const parseSCIMFilter: (filter: string) => any;
/**
 * Applies SCIM filter to resources.
 *
 * @param {T[]} resources - Resources to filter
 * @param {string} filter - Filter string
 * @returns {T[]} Filtered resources
 *
 * @example
 * ```typescript
 * const filtered = applySCIMFilter(users, 'active eq true');
 * ```
 */
export declare const applySCIMFilter: <T = any>(resources: T[], filter: string) => T[];
/**
 * Sorts SCIM resources.
 *
 * @param {T[]} resources - Resources to sort
 * @param {string} sortBy - Attribute to sort by
 * @param {string} sortOrder - Sort order
 * @returns {T[]} Sorted resources
 *
 * @example
 * ```typescript
 * const sorted = sortSCIMResources(users, 'userName', 'ascending');
 * ```
 */
export declare const sortSCIMResources: <T = any>(resources: T[], sortBy: string, sortOrder?: "ascending" | "descending") => T[];
/**
 * Paginates SCIM resources.
 *
 * @param {T[]} resources - Resources to paginate
 * @param {number} startIndex - Start index (1-based)
 * @param {number} count - Items per page
 * @returns {T[]} Paginated resources
 *
 * @example
 * ```typescript
 * const page = paginateSCIMResources(users, 1, 10);
 * ```
 */
export declare const paginateSCIMResources: <T = any>(resources: T[], startIndex?: number, count?: number) => T[];
/**
 * Applies SCIM query options to resources.
 *
 * @param {T[]} resources - Resources
 * @param {SCIMFilterOptions} options - Query options
 * @returns {SCIMListResponse<T>} Filtered and paginated response
 *
 * @example
 * ```typescript
 * const result = applySCIMQuery(users, {
 *   filter: 'active eq true',
 *   sortBy: 'userName',
 *   startIndex: 1,
 *   count: 10
 * });
 * ```
 */
export declare const applySCIMQuery: <T = any>(resources: T[], options?: SCIMFilterOptions) => SCIMListResponse<T>;
/**
 * Applies SCIM patch operations to a resource.
 *
 * @param {T} resource - Resource to patch
 * @param {SCIMPatchOperation[]} operations - Patch operations
 * @returns {T} Patched resource
 *
 * @example
 * ```typescript
 * const patched = applySCIMPatch(user, [
 *   { op: 'replace', path: 'active', value: false }
 * ]);
 * ```
 */
export declare const applySCIMPatch: <T = any>(resource: T, operations: SCIMPatchOperation[]) => T;
/**
 * Applies SCIM add operation.
 *
 * @param {T} resource - Resource
 * @param {string} path - Attribute path
 * @param {any} value - Value to add
 * @returns {T} Modified resource
 *
 * @example
 * ```typescript
 * const updated = applySCIMAdd(user, 'emails', { value: 'new@example.com' });
 * ```
 */
export declare const applySCIMAdd: <T = any>(resource: T, path: string | undefined, value: any) => T;
/**
 * Applies SCIM remove operation.
 *
 * @param {T} resource - Resource
 * @param {string} path - Attribute path
 * @returns {T} Modified resource
 *
 * @example
 * ```typescript
 * const updated = applySCIMRemove(user, 'phoneNumbers[type eq "mobile"]');
 * ```
 */
export declare const applySCIMRemove: <T = any>(resource: T, path: string | undefined) => T;
/**
 * Applies SCIM replace operation.
 *
 * @param {T} resource - Resource
 * @param {string} path - Attribute path
 * @param {any} value - New value
 * @returns {T} Modified resource
 *
 * @example
 * ```typescript
 * const updated = applySCIMReplace(user, 'active', false);
 * ```
 */
export declare const applySCIMReplace: <T = any>(resource: T, path: string | undefined, value: any) => T;
/**
 * Validates SCIM patch request.
 *
 * @param {SCIMPatchRequest} patchRequest - Patch request
 * @returns {boolean} Validation result
 *
 * @example
 * ```typescript
 * const isValid = validateSCIMPatchRequest(request);
 * ```
 */
export declare const validateSCIMPatchRequest: (patchRequest: SCIMPatchRequest) => boolean;
/**
 * Executes SCIM bulk operations.
 *
 * @param {SCIMBulkRequest} bulkRequest - Bulk request
 * @returns {Promise<SCIMBulkResponse>} Bulk response
 *
 * @example
 * ```typescript
 * const result = await executeBulkOperation({
 *   schemas: ['urn:ietf:params:scim:api:messages:2.0:BulkRequest'],
 *   Operations: [
 *     { method: 'POST', path: '/Users', data: userData }
 *   ]
 * });
 * ```
 */
export declare const executeBulkOperation: (bulkRequest: SCIMBulkRequest) => Promise<SCIMBulkResponse>;
/**
 * Executes a single bulk operation.
 *
 * @param {SCIMBulkOperation} operation - Bulk operation
 * @returns {Promise<any>} Operation result
 *
 * @example
 * ```typescript
 * const result = await executeSingleBulkOperation({
 *   method: 'POST',
 *   path: '/Users',
 *   data: userData
 * });
 * ```
 */
export declare const executeSingleBulkOperation: (operation: SCIMBulkOperation) => Promise<any>;
/**
 * Validates SCIM bulk request.
 *
 * @param {SCIMBulkRequest} bulkRequest - Bulk request
 * @param {number} maxOperations - Maximum operations allowed
 * @param {number} maxPayloadSize - Maximum payload size in bytes
 * @returns {boolean} Validation result
 *
 * @example
 * ```typescript
 * const isValid = validateBulkRequest(request, 1000, 1048576);
 * ```
 */
export declare const validateBulkRequest: (bulkRequest: SCIMBulkRequest, maxOperations?: number, maxPayloadSize?: number) => boolean;
/**
 * Adds enterprise extension to user.
 *
 * @param {SCIMUser} user - User resource
 * @param {SCIMEnterpriseUser} extension - Enterprise extension
 * @returns {SCIMUser} Extended user
 *
 * @example
 * ```typescript
 * const user = addEnterpriseExtension(baseUser, {
 *   employeeNumber: 'EMP001',
 *   department: 'Engineering'
 * });
 * ```
 */
export declare const addEnterpriseExtension: (user: SCIMUser, extension: SCIMEnterpriseUser) => SCIMUser;
/**
 * Adds healthcare extension to user.
 *
 * @param {SCIMUser} user - User resource
 * @param {SCIMHealthcareUser} extension - Healthcare extension
 * @returns {SCIMUser} Extended user
 *
 * @example
 * ```typescript
 * const user = addHealthcareExtension(baseUser, {
 *   npi: '1234567890',
 *   specialty: 'Cardiology'
 * });
 * ```
 */
export declare const addHealthcareExtension: (user: SCIMUser, extension: SCIMHealthcareUser) => SCIMUser;
/**
 * Gets extension from user.
 *
 * @param {SCIMUser} user - User resource
 * @param {string} schema - Extension schema URI
 * @returns {any} Extension data
 *
 * @example
 * ```typescript
 * const enterprise = getExtension(user, 'urn:ietf:params:scim:schemas:extension:enterprise:2.0:User');
 * ```
 */
export declare const getExtension: (user: SCIMUser, schema: string) => any;
/**
 * Removes extension from user.
 *
 * @param {SCIMUser} user - User resource
 * @param {string} schema - Extension schema URI
 * @returns {SCIMUser} User without extension
 *
 * @example
 * ```typescript
 * const user = removeExtension(extendedUser, 'urn:ietf:params:scim:schemas:extension:enterprise:2.0:User');
 * ```
 */
export declare const removeExtension: (user: SCIMUser, schema: string) => SCIMUser;
/**
 * Creates SCIM Service Provider configuration.
 *
 * @param {Partial<SCIMServiceProviderConfig>} options - Configuration options
 * @returns {SCIMServiceProviderConfig} Service provider config
 *
 * @example
 * ```typescript
 * const config = createServiceProviderConfig({
 *   documentationUri: 'https://docs.example.com/scim'
 * });
 * ```
 */
export declare const createServiceProviderConfig: (options?: Partial<SCIMServiceProviderConfig>) => SCIMServiceProviderConfig;
/**
 * Creates User resource type definition.
 *
 * @returns {SCIMResourceType} User resource type
 *
 * @example
 * ```typescript
 * const userType = createUserResourceType();
 * ```
 */
export declare const createUserResourceType: () => SCIMResourceType;
/**
 * Creates Group resource type definition.
 *
 * @returns {SCIMResourceType} Group resource type
 *
 * @example
 * ```typescript
 * const groupType = createGroupResourceType();
 * ```
 */
export declare const createGroupResourceType: () => SCIMResourceType;
/**
 * Validates SCIM User resource.
 *
 * @param {SCIMUser} user - User to validate
 * @returns {boolean} Validation result
 *
 * @example
 * ```typescript
 * const isValid = validateSCIMUser(user);
 * ```
 */
export declare const validateSCIMUser: (user: SCIMUser) => boolean;
/**
 * Validates SCIM Group resource.
 *
 * @param {SCIMGroup} group - Group to validate
 * @returns {boolean} Validation result
 *
 * @example
 * ```typescript
 * const isValid = validateSCIMGroup(group);
 * ```
 */
export declare const validateSCIMGroup: (group: SCIMGroup) => boolean;
/**
 * Validates SCIM resource against schema.
 *
 * @param {SCIMResource} resource - Resource to validate
 * @param {string} schema - Schema URI
 * @returns {boolean} Validation result
 *
 * @example
 * ```typescript
 * const isValid = validateSCIMResource(user, 'urn:ietf:params:scim:schemas:core:2.0:User');
 * ```
 */
export declare const validateSCIMResource: (resource: SCIMResource, schema: string) => boolean;
/**
 * Generates SCIM resource ID.
 *
 * @returns {string} Resource ID
 *
 * @example
 * ```typescript
 * const id = generateSCIMId();
 * ```
 */
export declare const generateSCIMId: () => string;
/**
 * Generates ETag version string.
 *
 * @returns {string} ETag
 *
 * @example
 * ```typescript
 * const etag = generateETag();
 * ```
 */
export declare const generateETag: () => string;
/**
 * Gets nested value from object.
 *
 * @param {any} obj - Object
 * @param {string} path - Path (e.g., 'name.givenName')
 * @returns {any} Value
 *
 * @example
 * ```typescript
 * const value = getNestedValue(user, 'name.givenName');
 * ```
 */
export declare const getNestedValue: (obj: any, path: string) => any;
/**
 * Sets nested value in object.
 *
 * @param {any} obj - Object
 * @param {string} path - Path
 * @param {any} value - Value to set
 *
 * @example
 * ```typescript
 * setNestedValue(user, 'name.givenName', 'John');
 * ```
 */
export declare const setNestedValue: (obj: any, path: string, value: any) => void;
/**
 * Deletes nested value from object.
 *
 * @param {any} obj - Object
 * @param {string} path - Path
 *
 * @example
 * ```typescript
 * deleteNestedValue(user, 'name.middleName');
 * ```
 */
export declare const deleteNestedValue: (obj: any, path: string) => void;
/**
 * Filters resource attributes.
 *
 * @param {any} resource - Resource
 * @param {SCIMFilterOptions} options - Filter options
 * @returns {any} Filtered resource
 *
 * @example
 * ```typescript
 * const filtered = filterAttributes(user, { attributes: ['userName', 'name'] });
 * ```
 */
export declare const filterAttributes: (resource: any, options: SCIMFilterOptions) => any;
/**
 * Converts internal user to SCIM User.
 *
 * @param {any} internalUser - Internal user object
 * @returns {SCIMUser} SCIM User
 *
 * @example
 * ```typescript
 * const scimUser = toSCIMUser(dbUser);
 * ```
 */
export declare const toSCIMUser: (internalUser: any) => SCIMUser;
/**
 * Converts SCIM User to internal user format.
 *
 * @param {SCIMUser} scimUser - SCIM User
 * @returns {any} Internal user object
 *
 * @example
 * ```typescript
 * const dbUser = fromSCIMUser(scimUser);
 * ```
 */
export declare const fromSCIMUser: (scimUser: SCIMUser) => any;
/**
 * Converts internal group to SCIM Group.
 *
 * @param {any} internalGroup - Internal group object
 * @returns {SCIMGroup} SCIM Group
 *
 * @example
 * ```typescript
 * const scimGroup = toSCIMGroup(dbGroup);
 * ```
 */
export declare const toSCIMGroup: (internalGroup: any) => SCIMGroup;
/**
 * Converts SCIM Group to internal group format.
 *
 * @param {SCIMGroup} scimGroup - SCIM Group
 * @returns {any} Internal group object
 *
 * @example
 * ```typescript
 * const dbGroup = fromSCIMGroup(scimGroup);
 * ```
 */
export declare const fromSCIMGroup: (scimGroup: SCIMGroup) => any;
/**
 * Checks if ETag matches resource version.
 *
 * @param {SCIMResource} resource - SCIM resource
 * @param {string} etag - ETag to compare
 * @returns {boolean} Match result
 *
 * @example
 * ```typescript
 * const matches = matchETag(user, 'W/"abc123"');
 * ```
 */
export declare const matchETag: (resource: SCIMResource, etag: string) => boolean;
/**
 * Creates SCIM search request from query parameters.
 *
 * @param {any} query - Query parameters
 * @returns {SCIMFilterOptions} SCIM filter options
 *
 * @example
 * ```typescript
 * const options = parseSCIMSearchRequest({
 *   filter: 'userName eq "jdoe"',
 *   startIndex: '1',
 *   count: '10'
 * });
 * ```
 */
export declare const parseSCIMSearchRequest: (query: any) => SCIMFilterOptions;
/**
 * Creates SCIM response headers with pagination links.
 *
 * @param {string} baseUrl - Base URL
 * @param {SCIMListResponse} response - List response
 * @returns {Record<string, string>} Response headers
 *
 * @example
 * ```typescript
 * const headers = createSCIMResponseHeaders('https://api.example.com/scim/v2/Users', response);
 * ```
 */
export declare const createSCIMResponseHeaders: (baseUrl: string, response: SCIMListResponse) => Record<string, string>;
/**
 * Validates SCIM filter syntax.
 *
 * @param {string} filter - Filter string
 * @returns {boolean} Validation result
 *
 * @example
 * ```typescript
 * const isValid = validateSCIMFilterSyntax('userName eq "jdoe"');
 * ```
 */
export declare const validateSCIMFilterSyntax: (filter: string) => boolean;
/**
 * Creates SCIM schema definition.
 *
 * @param {string} id - Schema ID
 * @param {string} name - Schema name
 * @param {any[]} attributes - Schema attributes
 * @returns {any} Schema definition
 *
 * @example
 * ```typescript
 * const schema = createSCIMSchema(
 *   'urn:ietf:params:scim:schemas:core:2.0:User',
 *   'User',
 *   [{ name: 'userName', type: 'string', required: true }]
 * );
 * ```
 */
export declare const createSCIMSchema: (id: string, name: string, attributes: any[]) => any;
/**
 * Normalizes SCIM attribute path.
 *
 * @param {string} path - Attribute path
 * @returns {string} Normalized path
 *
 * @example
 * ```typescript
 * const normalized = normalizeSCIMPath('emails[type eq "work"].value');
 * ```
 */
export declare const normalizeSCIMPath: (path: string) => string;
/**
 * Checks if user has required SCIM attributes.
 *
 * @param {SCIMUser} user - SCIM user
 * @param {string[]} required - Required attributes
 * @returns {boolean} Validation result
 *
 * @example
 * ```typescript
 * const hasRequired = hasRequiredAttributes(user, ['userName', 'emails']);
 * ```
 */
export declare const hasRequiredAttributes: (user: SCIMUser, required: string[]) => boolean;
/**
 * Creates SCIM discovery response with all endpoints.
 *
 * @param {string} baseUrl - Base URL
 * @returns {any} Discovery response
 *
 * @example
 * ```typescript
 * const discovery = createSCIMDiscoveryResponse('https://api.example.com/scim/v2');
 * ```
 */
export declare const createSCIMDiscoveryResponse: (baseUrl: string) => any;
//# sourceMappingURL=iam-scim-kit.d.ts.map