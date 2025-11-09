/**
 * LOC: SAN-SWG-DOC-001
 * File: /reuse/san/san-swagger-documentation-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - SAN API controllers and documentation
 *   - Storage management endpoints
 *   - Volume, LUN, snapshot, replication controllers
 *   - OpenAPI specification generation
 */
/**
 * File: /reuse/san/san-swagger-documentation-kit.ts
 * Locator: WC-SAN-SWG-DOC-001
 * Purpose: SAN Swagger/OpenAPI Documentation Kit - Comprehensive API documentation for Storage Area Network operations
 *
 * Upstream: Independent utility module for SAN API documentation
 * Downstream: ../backend/*, SAN controllers, Storage services, API documentation generation
 * Dependencies: TypeScript 5.x, Node 18+, OpenAPI 3.0+ compatible, @nestjs/swagger
 * Exports: 38 utility functions for SAN-specific Swagger/OpenAPI documentation
 *
 * LLM Context: Enterprise-grade SAN documentation utilities for OpenAPI/Swagger specifications.
 * Provides schema builders for Volumes, LUNs, Snapshots, Replication, Fibre Channel, iSCSI,
 * storage pools, performance metrics, QoS policies, and healthcare-specific storage operations.
 * Essential for maintaining consistent, production-ready API documentation for storage area
 * network management in the White Cross healthcare platform with HIPAA compliance.
 *
 * Key Features:
 * - Volume, LUN, snapshot, and replication schema definitions
 * - Healthcare-specific examples (DICOM, PACS, medical imaging)
 * - Storage performance and capacity documentation
 * - Security scheme definitions (iSCSI CHAP, Fibre Channel zoning)
 * - Error response schemas with detailed troubleshooting
 * - Pagination, filtering, and sorting for large datasets
 * - HIPAA-compliant audit trail documentation
 * - Multi-tenancy and isolation schemas
 * - Real-time monitoring and metrics endpoints
 * - Storage pool and capacity planning documentation
 */
interface OpenAPISpec {
    openapi: string;
    info: InfoObject;
    servers?: ServerObject[];
    paths: PathsObject;
    components?: ComponentsObject;
    security?: SecurityRequirementObject[];
    tags?: TagObject[];
    externalDocs?: ExternalDocumentationObject;
}
interface InfoObject {
    title: string;
    description?: string;
    version: string;
    contact?: ContactObject;
    license?: LicenseObject;
}
interface ContactObject {
    name?: string;
    url?: string;
    email?: string;
}
interface LicenseObject {
    name: string;
    url?: string;
}
interface ServerObject {
    url: string;
    description?: string;
    variables?: Record<string, ServerVariableObject>;
}
interface ServerVariableObject {
    enum?: string[];
    default: string;
    description?: string;
}
interface ComponentsObject {
    schemas?: Record<string, SchemaObject>;
    responses?: Record<string, ResponseObject>;
    parameters?: Record<string, ParameterObject>;
    examples?: Record<string, ExampleObject>;
    requestBodies?: Record<string, RequestBodyObject>;
    headers?: Record<string, HeaderObject>;
    securitySchemes?: Record<string, SecuritySchemeObject>;
    links?: Record<string, LinkObject>;
    callbacks?: Record<string, CallbackObject>;
}
interface SchemaObject {
    type?: string;
    format?: string;
    title?: string;
    description?: string;
    default?: any;
    multipleOf?: number;
    maximum?: number;
    exclusiveMaximum?: boolean;
    minimum?: number;
    exclusiveMinimum?: boolean;
    maxLength?: number;
    minLength?: number;
    pattern?: string;
    maxItems?: number;
    minItems?: number;
    uniqueItems?: boolean;
    maxProperties?: number;
    minProperties?: number;
    required?: string[];
    enum?: any[];
    properties?: Record<string, SchemaObject>;
    items?: SchemaObject;
    allOf?: SchemaObject[];
    oneOf?: SchemaObject[];
    anyOf?: SchemaObject[];
    not?: SchemaObject;
    discriminator?: DiscriminatorObject;
    nullable?: boolean;
    readOnly?: boolean;
    writeOnly?: boolean;
    example?: any;
    examples?: any[];
    deprecated?: boolean;
    $ref?: string;
}
interface DiscriminatorObject {
    propertyName: string;
    mapping?: Record<string, string>;
}
interface ResponseObject {
    description: string;
    headers?: Record<string, HeaderObject>;
    content?: Record<string, MediaTypeObject>;
    links?: Record<string, LinkObject>;
}
interface MediaTypeObject {
    schema?: SchemaObject;
    example?: any;
    examples?: Record<string, ExampleObject>;
    encoding?: Record<string, EncodingObject>;
}
interface EncodingObject {
    contentType?: string;
    headers?: Record<string, HeaderObject>;
    style?: string;
    explode?: boolean;
    allowReserved?: boolean;
}
interface ParameterObject {
    name: string;
    in: 'query' | 'header' | 'path' | 'cookie';
    description?: string;
    required?: boolean;
    deprecated?: boolean;
    allowEmptyValue?: boolean;
    schema?: SchemaObject;
    example?: any;
    examples?: Record<string, ExampleObject>;
}
interface HeaderObject {
    description?: string;
    required?: boolean;
    deprecated?: boolean;
    schema?: SchemaObject;
    example?: any;
}
interface ExampleObject {
    summary?: string;
    description?: string;
    value?: any;
    externalValue?: string;
}
interface RequestBodyObject {
    description?: string;
    content: Record<string, MediaTypeObject>;
    required?: boolean;
}
interface SecuritySchemeObject {
    type: 'apiKey' | 'http' | 'oauth2' | 'openIdConnect';
    description?: string;
    name?: string;
    in?: 'query' | 'header' | 'cookie';
    scheme?: string;
    bearerFormat?: string;
    flows?: OAuthFlowsObject;
    openIdConnectUrl?: string;
}
interface OAuthFlowsObject {
    implicit?: OAuthFlowObject;
    password?: OAuthFlowObject;
    clientCredentials?: OAuthFlowObject;
    authorizationCode?: OAuthFlowObject;
}
interface OAuthFlowObject {
    authorizationUrl?: string;
    tokenUrl?: string;
    refreshUrl?: string;
    scopes: Record<string, string>;
}
interface LinkObject {
    operationRef?: string;
    operationId?: string;
    parameters?: Record<string, any>;
    requestBody?: any;
    description?: string;
    server?: ServerObject;
}
interface CallbackObject {
    [expression: string]: PathItemObject;
}
interface PathItemObject {
    summary?: string;
    description?: string;
    get?: OperationObject;
    put?: OperationObject;
    post?: OperationObject;
    delete?: OperationObject;
    options?: OperationObject;
    head?: OperationObject;
    patch?: OperationObject;
    trace?: OperationObject;
    servers?: ServerObject[];
    parameters?: ParameterObject[];
}
interface OperationObject {
    tags?: string[];
    summary?: string;
    description?: string;
    externalDocs?: ExternalDocumentationObject;
    operationId?: string;
    parameters?: ParameterObject[];
    requestBody?: RequestBodyObject;
    responses: Record<string, ResponseObject>;
    callbacks?: Record<string, CallbackObject>;
    deprecated?: boolean;
    security?: SecurityRequirementObject[];
    servers?: ServerObject[];
}
interface ExternalDocumentationObject {
    description?: string;
    url: string;
}
interface TagObject {
    name: string;
    description?: string;
    externalDocs?: ExternalDocumentationObject;
}
interface SecurityRequirementObject {
    [name: string]: string[];
}
interface PathsObject {
    [path: string]: PathItemObject;
}
/**
 * 1. Creates OpenAPI schema for SAN Volume object.
 *
 * @param {boolean} [includeMetrics] - Whether to include performance metrics
 * @returns {SchemaObject} OpenAPI Volume schema
 *
 * @example
 * ```typescript
 * const volumeSchema = createVolumeSchema(true);
 * // Complete volume schema with performance metrics
 * ```
 */
export declare const createVolumeSchema: (includeMetrics?: boolean) => SchemaObject;
/**
 * 2. Creates OpenAPI schema for LUN (Logical Unit Number) object.
 *
 * @param {boolean} [includeHostDetails] - Whether to include detailed host mapping information
 * @returns {SchemaObject} OpenAPI LUN schema
 *
 * @example
 * ```typescript
 * const lunSchema = createLUNSchema(true);
 * ```
 */
export declare const createLUNSchema: (includeHostDetails?: boolean) => SchemaObject;
/**
 * 3. Creates OpenAPI schema for Snapshot object.
 *
 * @param {boolean} [includeRelationships] - Whether to include parent/child snapshot relationships
 * @returns {SchemaObject} OpenAPI Snapshot schema
 *
 * @example
 * ```typescript
 * const snapshotSchema = createSnapshotSchema(true);
 * ```
 */
export declare const createSnapshotSchema: (includeRelationships?: boolean) => SchemaObject;
/**
 * 4. Creates OpenAPI schema for Replication object.
 *
 * @param {boolean} [includeDetailedMetrics] - Whether to include detailed replication metrics
 * @returns {SchemaObject} OpenAPI Replication schema
 *
 * @example
 * ```typescript
 * const replicationSchema = createReplicationSchema(true);
 * ```
 */
export declare const createReplicationSchema: (includeDetailedMetrics?: boolean) => SchemaObject;
/**
 * 5. Creates OpenAPI schema for Storage Pool object.
 *
 * @returns {SchemaObject} OpenAPI Storage Pool schema
 *
 * @example
 * ```typescript
 * const poolSchema = createStoragePoolSchema();
 * ```
 */
export declare const createStoragePoolSchema: () => SchemaObject;
/**
 * 6. Creates OpenAPI schema for Performance Metrics object.
 *
 * @returns {SchemaObject} OpenAPI Performance Metrics schema
 *
 * @example
 * ```typescript
 * const metricsSchema = createPerformanceMetricsSchema();
 * ```
 */
export declare const createPerformanceMetricsSchema: () => SchemaObject;
/**
 * 7. Creates OpenAPI schema for QoS Policy object.
 *
 * @returns {SchemaObject} OpenAPI QoS Policy schema
 *
 * @example
 * ```typescript
 * const qosSchema = createQoSPolicySchema();
 * ```
 */
export declare const createQoSPolicySchema: () => SchemaObject;
/**
 * 8. Creates volume creation request schema.
 *
 * @returns {SchemaObject} Volume creation request schema
 *
 * @example
 * ```typescript
 * const createVolumeRequest = createVolumeCreateRequestSchema();
 * ```
 */
export declare const createVolumeCreateRequestSchema: () => SchemaObject;
/**
 * 9. Creates volume update request schema.
 *
 * @returns {SchemaObject} Volume update request schema
 *
 * @example
 * ```typescript
 * const updateVolumeRequest = createVolumeUpdateRequestSchema();
 * ```
 */
export declare const createVolumeUpdateRequestSchema: () => SchemaObject;
/**
 * 10. Creates snapshot creation request schema.
 *
 * @returns {SchemaObject} Snapshot creation request schema
 *
 * @example
 * ```typescript
 * const createSnapshotRequest = createSnapshotCreateRequestSchema();
 * ```
 */
export declare const createSnapshotCreateRequestSchema: () => SchemaObject;
/**
 * 11. Creates replication configuration request schema.
 *
 * @returns {SchemaObject} Replication configuration request schema
 *
 * @example
 * ```typescript
 * const replicationRequest = createReplicationConfigRequestSchema();
 * ```
 */
export declare const createReplicationConfigRequestSchema: () => SchemaObject;
/**
 * 12. Creates standard error response schema.
 *
 * @returns {SchemaObject} Error response schema
 *
 * @example
 * ```typescript
 * const errorSchema = createErrorResponseSchema();
 * ```
 */
export declare const createErrorResponseSchema: () => SchemaObject;
/**
 * 13. Creates validation error response schema.
 *
 * @returns {SchemaObject} Validation error response schema
 *
 * @example
 * ```typescript
 * const validationErrorSchema = createValidationErrorResponseSchema();
 * ```
 */
export declare const createValidationErrorResponseSchema: () => SchemaObject;
/**
 * 14. Creates pagination metadata schema.
 *
 * @returns {SchemaObject} Pagination metadata schema
 *
 * @example
 * ```typescript
 * const paginationSchema = createPaginationMetadataSchema();
 * ```
 */
export declare const createPaginationMetadataSchema: () => SchemaObject;
/**
 * 15. Creates paginated volume list response schema.
 *
 * @returns {SchemaObject} Paginated volume list response schema
 *
 * @example
 * ```typescript
 * const volumeListSchema = createPaginatedVolumeListResponseSchema();
 * ```
 */
export declare const createPaginatedVolumeListResponseSchema: () => SchemaObject;
/**
 * 16. Creates volume ID path parameter.
 *
 * @returns {ParameterObject} Volume ID parameter
 *
 * @example
 * ```typescript
 * const volumeIdParam = createVolumeIdPathParameter();
 * ```
 */
export declare const createVolumeIdPathParameter: () => ParameterObject;
/**
 * 17. Creates pagination query parameters.
 *
 * @returns {ParameterObject[]} Array of pagination parameters
 *
 * @example
 * ```typescript
 * const paginationParams = createPaginationQueryParameters();
 * ```
 */
export declare const createPaginationQueryParameters: () => ParameterObject[];
/**
 * 18. Creates volume filtering query parameters.
 *
 * @returns {ParameterObject[]} Array of volume filter parameters
 *
 * @example
 * ```typescript
 * const filterParams = createVolumeFilterQueryParameters();
 * ```
 */
export declare const createVolumeFilterQueryParameters: () => ParameterObject[];
/**
 * 19. Creates Bearer JWT security scheme.
 *
 * @returns {SecuritySchemeObject} Bearer JWT security scheme
 *
 * @example
 * ```typescript
 * const bearerScheme = createBearerJWTSecurityScheme();
 * ```
 */
export declare const createBearerJWTSecurityScheme: () => SecuritySchemeObject;
/**
 * 20. Creates API Key security scheme.
 *
 * @returns {SecuritySchemeObject} API Key security scheme
 *
 * @example
 * ```typescript
 * const apiKeyScheme = createAPIKeySecurityScheme();
 * ```
 */
export declare const createAPIKeySecurityScheme: () => SecuritySchemeObject;
/**
 * 21. Creates OAuth2 security scheme for SAN operations.
 *
 * @returns {SecuritySchemeObject} OAuth2 security scheme
 *
 * @example
 * ```typescript
 * const oauth2Scheme = createOAuth2SecurityScheme();
 * ```
 */
export declare const createOAuth2SecurityScheme: () => SecuritySchemeObject;
/**
 * 22. Creates volume example for DICOM PACS storage.
 *
 * @returns {ExampleObject} DICOM PACS volume example
 *
 * @example
 * ```typescript
 * const pacsExample = createDICOMPACSVolumeExample();
 * ```
 */
export declare const createDICOMPACSVolumeExample: () => ExampleObject;
/**
 * 23. Creates volume example for electronic health records.
 *
 * @returns {ExampleObject} EHR volume example
 *
 * @example
 * ```typescript
 * const ehrExample = createEHRVolumeExample();
 * ```
 */
export declare const createEHRVolumeExample: () => ExampleObject;
/**
 * 24. Creates snapshot example for scheduled backup.
 *
 * @returns {ExampleObject} Scheduled backup snapshot example
 *
 * @example
 * ```typescript
 * const backupExample = createScheduledBackupSnapshotExample();
 * ```
 */
export declare const createScheduledBackupSnapshotExample: () => ExampleObject;
/**
 * 25. Creates replication example for disaster recovery.
 *
 * @returns {ExampleObject} Disaster recovery replication example
 *
 * @example
 * ```typescript
 * const drExample = createDisasterRecoveryReplicationExample();
 * ```
 */
export declare const createDisasterRecoveryReplicationExample: () => ExampleObject;
/**
 * 26. Creates operation object for listing volumes.
 *
 * @returns {OperationObject} List volumes operation
 *
 * @example
 * ```typescript
 * const listOp = createListVolumesOperation();
 * ```
 */
export declare const createListVolumesOperation: () => OperationObject;
/**
 * 27. Creates operation object for creating a volume.
 *
 * @returns {OperationObject} Create volume operation
 *
 * @example
 * ```typescript
 * const createOp = createCreateVolumeOperation();
 * ```
 */
export declare const createCreateVolumeOperation: () => OperationObject;
/**
 * 28. Creates operation object for getting a volume by ID.
 *
 * @returns {OperationObject} Get volume operation
 *
 * @example
 * ```typescript
 * const getOp = createGetVolumeOperation();
 * ```
 */
export declare const createGetVolumeOperation: () => OperationObject;
/**
 * 29. Creates operation object for updating a volume.
 *
 * @returns {OperationObject} Update volume operation
 *
 * @example
 * ```typescript
 * const updateOp = createUpdateVolumeOperation();
 * ```
 */
export declare const createUpdateVolumeOperation: () => OperationObject;
/**
 * 30. Creates operation object for deleting a volume.
 *
 * @returns {OperationObject} Delete volume operation
 *
 * @example
 * ```typescript
 * const deleteOp = createDeleteVolumeOperation();
 * ```
 */
export declare const createDeleteVolumeOperation: () => OperationObject;
/**
 * 31. Creates operation object for creating a snapshot.
 *
 * @returns {OperationObject} Create snapshot operation
 *
 * @example
 * ```typescript
 * const snapshotOp = createCreateSnapshotOperation();
 * ```
 */
export declare const createCreateSnapshotOperation: () => OperationObject;
/**
 * 32. Creates operation object for configuring replication.
 *
 * @returns {OperationObject} Configure replication operation
 *
 * @example
 * ```typescript
 * const replicationOp = createConfigureReplicationOperation();
 * ```
 */
export declare const createConfigureReplicationOperation: () => OperationObject;
/**
 * 33. Creates SAN API tag definitions.
 *
 * @returns {TagObject[]} Array of tag objects
 *
 * @example
 * ```typescript
 * const tags = createSANAPITags();
 * ```
 */
export declare const createSANAPITags: () => TagObject[];
/**
 * 34. Creates complete SAN API components object.
 *
 * @returns {ComponentsObject} Complete components object with all schemas
 *
 * @example
 * ```typescript
 * const components = createSANAPIComponents();
 * ```
 */
export declare const createSANAPIComponents: () => ComponentsObject;
/**
 * 35. Creates complete SAN API OpenAPI specification.
 *
 * @param {string} version - API version
 * @param {string} baseUrl - Base server URL
 * @returns {OpenAPISpec} Complete OpenAPI specification
 *
 * @example
 * ```typescript
 * const spec = createSANAPISpecification('1.0.0', 'https://api.whitecross.com');
 * ```
 */
export declare const createSANAPISpecification: (version: string, baseUrl: string) => OpenAPISpec;
/**
 * 36. Creates NestJS Swagger DocumentBuilder configuration for SAN API.
 *
 * @param {string} version - API version
 * @param {string} baseUrl - Base server URL
 * @returns {object} NestJS DocumentBuilder configuration
 *
 * @example
 * ```typescript
 * const config = createNestJSSANSwaggerConfig('1.0.0', 'https://api.whitecross.com');
 * ```
 */
export declare const createNestJSSANSwaggerConfig: (version: string, baseUrl: string) => object;
/**
 * 37. Creates Swagger UI customization options for SAN API.
 *
 * @returns {object} Swagger UI options
 *
 * @example
 * ```typescript
 * const uiOptions = createSANSwaggerUIOptions();
 * ```
 */
export declare const createSANSwaggerUIOptions: () => object;
/**
 * 38. Creates healthcare compliance documentation notes for SAN API.
 *
 * @returns {object} Compliance documentation object
 *
 * @example
 * ```typescript
 * const compliance = createHealthcareComplianceDocumentation();
 * ```
 */
export declare const createHealthcareComplianceDocumentation: () => object;
declare const _default: {
    createVolumeSchema: (includeMetrics?: boolean) => SchemaObject;
    createLUNSchema: (includeHostDetails?: boolean) => SchemaObject;
    createSnapshotSchema: (includeRelationships?: boolean) => SchemaObject;
    createReplicationSchema: (includeDetailedMetrics?: boolean) => SchemaObject;
    createStoragePoolSchema: () => SchemaObject;
    createPerformanceMetricsSchema: () => SchemaObject;
    createQoSPolicySchema: () => SchemaObject;
    createVolumeCreateRequestSchema: () => SchemaObject;
    createVolumeUpdateRequestSchema: () => SchemaObject;
    createSnapshotCreateRequestSchema: () => SchemaObject;
    createReplicationConfigRequestSchema: () => SchemaObject;
    createErrorResponseSchema: () => SchemaObject;
    createValidationErrorResponseSchema: () => SchemaObject;
    createPaginationMetadataSchema: () => SchemaObject;
    createPaginatedVolumeListResponseSchema: () => SchemaObject;
    createVolumeIdPathParameter: () => ParameterObject;
    createPaginationQueryParameters: () => ParameterObject[];
    createVolumeFilterQueryParameters: () => ParameterObject[];
    createBearerJWTSecurityScheme: () => SecuritySchemeObject;
    createAPIKeySecurityScheme: () => SecuritySchemeObject;
    createOAuth2SecurityScheme: () => SecuritySchemeObject;
    createDICOMPACSVolumeExample: () => ExampleObject;
    createEHRVolumeExample: () => ExampleObject;
    createScheduledBackupSnapshotExample: () => ExampleObject;
    createDisasterRecoveryReplicationExample: () => ExampleObject;
    createListVolumesOperation: () => OperationObject;
    createCreateVolumeOperation: () => OperationObject;
    createGetVolumeOperation: () => OperationObject;
    createUpdateVolumeOperation: () => OperationObject;
    createDeleteVolumeOperation: () => OperationObject;
    createCreateSnapshotOperation: () => OperationObject;
    createConfigureReplicationOperation: () => OperationObject;
    createSANAPITags: () => TagObject[];
    createSANAPIComponents: () => ComponentsObject;
    createSANAPISpecification: (version: string, baseUrl: string) => OpenAPISpec;
    createNestJSSANSwaggerConfig: (version: string, baseUrl: string) => object;
    createSANSwaggerUIOptions: () => object;
    createHealthcareComplianceDocumentation: () => object;
};
export default _default;
//# sourceMappingURL=san-swagger-documentation-kit.d.ts.map