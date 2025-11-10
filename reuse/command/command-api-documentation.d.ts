/**
 * LOC: CMDAPI789
 * File: /reuse/command/command-api-documentation.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/swagger (decorators and types)
 *   - @nestjs/common (Type utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Command center API controllers
 *   - Incident management modules
 *   - Resource allocation services
 *   - Multi-agency coordination controllers
 */
/**
 * File: /reuse/command/command-api-documentation.ts
 * Locator: WC-UTL-CMDAPI-001
 * Purpose: Command Center API Documentation Utilities - OpenAPI schemas for incident management, resource allocation, real-time status, multi-agency coordination
 *
 * Upstream: Independent utility module for command center OpenAPI/Swagger documentation
 * Downstream: ../backend/command/*, incident controllers, resource allocation services, situation awareness modules
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, @nestjs/swagger 7.x, OpenAPI 3.0+
 * Exports: 45 utility functions for command center API documentation, incident schemas, resource allocation, real-time status, reporting
 *
 * LLM Context: Comprehensive command center API documentation utilities for implementing production-ready OpenAPI/Swagger documentation
 * in White Cross emergency management system. Provides specialized schemas for incident management, resource coordination, command hierarchy,
 * situation awareness, decision support, analytics, and multi-agency operations. Essential for building well-documented command center APIs.
 */
import { Type } from '@nestjs/common';
import { ApiResponseOptions, ApiOperationOptions, ApiQueryOptions } from '@nestjs/swagger';
/**
 * 1. Creates OpenAPI schema for incident creation request.
 *
 * @param {boolean} [includeLocation] - Whether to include location fields
 * @returns {Record<string, any>} Incident creation schema
 *
 * @example
 * ```typescript
 * const schema = createIncidentCreationSchema(true);
 * // Used in @ApiBody decorator for POST /incidents
 * ```
 */
export declare const createIncidentCreationSchema: (includeLocation?: boolean) => Record<string, any>;
/**
 * 2. Creates OpenAPI schema for incident response with full details.
 *
 * @param {boolean} [includeResources] - Include responding resources
 * @returns {Record<string, any>} Incident response schema
 *
 * @example
 * ```typescript
 * const schema = createIncidentResponseSchema(true);
 * // Used in @ApiResponse for GET /incidents/:id
 * ```
 */
export declare const createIncidentResponseSchema: (includeResources?: boolean) => Record<string, any>;
/**
 * 3. Creates OpenAPI schema for incident status update.
 *
 * @returns {Record<string, any>} Incident update schema
 *
 * @example
 * ```typescript
 * const schema = createIncidentUpdateSchema();
 * // Used in @ApiBody for PATCH /incidents/:id
 * ```
 */
export declare const createIncidentUpdateSchema: () => Record<string, any>;
/**
 * 4. Creates query parameters for incident filtering.
 *
 * @returns {ApiQueryOptions[]} Array of incident filter query parameters
 *
 * @example
 * ```typescript
 * createIncidentFilterQueryDocs().forEach(doc => @ApiQuery(doc))
 * ```
 */
export declare const createIncidentFilterQueryDocs: () => ApiQueryOptions[];
/**
 * 5. Creates operation documentation for incident endpoints.
 *
 * @param {string} operation - Operation type (create, update, list, get, close)
 * @returns {ApiOperationOptions} Operation documentation
 *
 * @example
 * ```typescript
 * @ApiOperation(createIncidentOperationDoc('create'))
 * ```
 */
export declare const createIncidentOperationDoc: (operation: string) => ApiOperationOptions;
/**
 * 6. Creates OpenAPI schema for resource allocation request.
 *
 * @returns {Record<string, any>} Resource allocation schema
 *
 * @example
 * ```typescript
 * const schema = createResourceAllocationSchema();
 * // Used in @ApiBody for POST /resources/allocate
 * ```
 */
export declare const createResourceAllocationSchema: () => Record<string, any>;
/**
 * 7. Creates OpenAPI schema for resource status response.
 *
 * @returns {Record<string, any>} Resource status schema
 *
 * @example
 * ```typescript
 * const schema = createResourceStatusSchema();
 * // Used in @ApiResponse for GET /resources/:id
 * ```
 */
export declare const createResourceStatusSchema: () => Record<string, any>;
/**
 * 8. Creates query parameters for resource availability search.
 *
 * @returns {ApiQueryOptions[]} Resource availability query parameters
 *
 * @example
 * ```typescript
 * createResourceAvailabilityQueryDocs().forEach(doc => @ApiQuery(doc))
 * ```
 */
export declare const createResourceAvailabilityQueryDocs: () => ApiQueryOptions[];
/**
 * 9. Creates OpenAPI schema for resource reallocation.
 *
 * @returns {Record<string, any>} Resource reallocation schema
 *
 * @example
 * ```typescript
 * const schema = createResourceReallocationSchema();
 * ```
 */
export declare const createResourceReallocationSchema: () => Record<string, any>;
/**
 * 10. Creates operation documentation for resource endpoints.
 *
 * @param {string} operation - Operation type
 * @returns {ApiOperationOptions} Operation documentation
 *
 * @example
 * ```typescript
 * @ApiOperation(createResourceOperationDoc('allocate'))
 * ```
 */
export declare const createResourceOperationDoc: (operation: string) => ApiOperationOptions;
/**
 * 11. Creates OpenAPI schema for real-time status update.
 *
 * @returns {Record<string, any>} Status update schema
 *
 * @example
 * ```typescript
 * const schema = createRealTimeStatusSchema();
 * ```
 */
export declare const createRealTimeStatusSchema: () => Record<string, any>;
/**
 * 12. Creates OpenAPI schema for command center dashboard data.
 *
 * @returns {Record<string, any>} Dashboard data schema
 *
 * @example
 * ```typescript
 * const schema = createDashboardDataSchema();
 * ```
 */
export declare const createDashboardDataSchema: () => Record<string, any>;
/**
 * 13. Creates WebSocket event schema for real-time updates.
 *
 * @param {string} eventType - Type of WebSocket event
 * @returns {Record<string, any>} WebSocket event schema
 *
 * @example
 * ```typescript
 * const schema = createWebSocketEventSchema('incident.updated');
 * ```
 */
export declare const createWebSocketEventSchema: (eventType: string) => Record<string, any>;
/**
 * 14. Creates operation documentation for real-time status endpoints.
 *
 * @param {string} operation - Operation type
 * @returns {ApiOperationOptions} Operation documentation
 *
 * @example
 * ```typescript
 * @ApiOperation(createRealTimeOperationDoc('dashboard'))
 * ```
 */
export declare const createRealTimeOperationDoc: (operation: string) => ApiOperationOptions;
/**
 * 15. Creates OpenAPI schema for analytics query request.
 *
 * @returns {Record<string, any>} Analytics query schema
 *
 * @example
 * ```typescript
 * const schema = createAnalyticsQuerySchema();
 * ```
 */
export declare const createAnalyticsQuerySchema: () => Record<string, any>;
/**
 * 16. Creates OpenAPI schema for incident statistics response.
 *
 * @returns {Record<string, any>} Incident statistics schema
 *
 * @example
 * ```typescript
 * const schema = createIncidentStatisticsSchema();
 * ```
 */
export declare const createIncidentStatisticsSchema: () => Record<string, any>;
/**
 * 17. Creates OpenAPI schema for resource utilization report.
 *
 * @returns {Record<string, any>} Resource utilization schema
 *
 * @example
 * ```typescript
 * const schema = createResourceUtilizationSchema();
 * ```
 */
export declare const createResourceUtilizationSchema: () => Record<string, any>;
/**
 * 18. Creates query parameters for reporting endpoints.
 *
 * @returns {ApiQueryOptions[]} Reporting query parameters
 *
 * @example
 * ```typescript
 * createReportingQueryDocs().forEach(doc => @ApiQuery(doc))
 * ```
 */
export declare const createReportingQueryDocs: () => ApiQueryOptions[];
/**
 * 19. Creates operation documentation for reporting endpoints.
 *
 * @param {string} operation - Operation type
 * @returns {ApiOperationOptions} Operation documentation
 *
 * @example
 * ```typescript
 * @ApiOperation(createReportingOperationDoc('statistics'))
 * ```
 */
export declare const createReportingOperationDoc: (operation: string) => ApiOperationOptions;
/**
 * 20. Creates OpenAPI schema for multi-agency coordination request.
 *
 * @returns {Record<string, any>} Multi-agency coordination schema
 *
 * @example
 * ```typescript
 * const schema = createMultiAgencyCoordinationSchema();
 * ```
 */
export declare const createMultiAgencyCoordinationSchema: () => Record<string, any>;
/**
 * 21. Creates OpenAPI schema for agency information response.
 *
 * @returns {Record<string, any>} Agency information schema
 *
 * @example
 * ```typescript
 * const schema = createAgencyInformationSchema();
 * ```
 */
export declare const createAgencyInformationSchema: () => Record<string, any>;
/**
 * 22. Creates OpenAPI schema for shared resource tracking.
 *
 * @returns {Record<string, any>} Shared resource schema
 *
 * @example
 * ```typescript
 * const schema = createSharedResourceSchema();
 * ```
 */
export declare const createSharedResourceSchema: () => Record<string, any>;
/**
 * 23. Creates operation documentation for multi-agency endpoints.
 *
 * @param {string} operation - Operation type
 * @returns {ApiOperationOptions} Operation documentation
 *
 * @example
 * ```typescript
 * @ApiOperation(createMultiAgencyOperationDoc('coordinate'))
 * ```
 */
export declare const createMultiAgencyOperationDoc: (operation: string) => ApiOperationOptions;
/**
 * 24. Creates OpenAPI schema for command structure response.
 *
 * @returns {Record<string, any>} Command structure schema
 *
 * @example
 * ```typescript
 * const schema = createCommandStructureSchema();
 * ```
 */
export declare const createCommandStructureSchema: () => Record<string, any>;
/**
 * 25. Creates OpenAPI schema for command assignment request.
 *
 * @returns {Record<string, any>} Command assignment schema
 *
 * @example
 * ```typescript
 * const schema = createCommandAssignmentSchema();
 * ```
 */
export declare const createCommandAssignmentSchema: () => Record<string, any>;
/**
 * 26. Creates OpenAPI schema for authority delegation.
 *
 * @returns {Record<string, any>} Authority delegation schema
 *
 * @example
 * ```typescript
 * const schema = createAuthorityDelegationSchema();
 * ```
 */
export declare const createAuthorityDelegationSchema: () => Record<string, any>;
/**
 * 27. Creates operation documentation for command hierarchy endpoints.
 *
 * @param {string} operation - Operation type
 * @returns {ApiOperationOptions} Operation documentation
 *
 * @example
 * ```typescript
 * @ApiOperation(createCommandHierarchyOperationDoc('structure'))
 * ```
 */
export declare const createCommandHierarchyOperationDoc: (operation: string) => ApiOperationOptions;
/**
 * 28. Creates OpenAPI schema for situation report.
 *
 * @returns {Record<string, any>} Situation report schema
 *
 * @example
 * ```typescript
 * const schema = createSituationReportSchema();
 * ```
 */
export declare const createSituationReportSchema: () => Record<string, any>;
/**
 * 29. Creates OpenAPI schema for tactical map data.
 *
 * @returns {Record<string, any>} Tactical map schema
 *
 * @example
 * ```typescript
 * const schema = createTacticalMapSchema();
 * ```
 */
export declare const createTacticalMapSchema: () => Record<string, any>;
/**
 * 30. Creates OpenAPI schema for hazard assessment.
 *
 * @returns {Record<string, any>} Hazard assessment schema
 *
 * @example
 * ```typescript
 * const schema = createHazardAssessmentSchema();
 * ```
 */
export declare const createHazardAssessmentSchema: () => Record<string, any>;
/**
 * 31. Creates operation documentation for situation awareness endpoints.
 *
 * @param {string} operation - Operation type
 * @returns {ApiOperationOptions} Operation documentation
 *
 * @example
 * ```typescript
 * @ApiOperation(createSituationAwarenessOperationDoc('report'))
 * ```
 */
export declare const createSituationAwarenessOperationDoc: (operation: string) => ApiOperationOptions;
/**
 * 32. Creates OpenAPI schema for decision support recommendation.
 *
 * @returns {Record<string, any>} Decision recommendation schema
 *
 * @example
 * ```typescript
 * const schema = createDecisionRecommendationSchema();
 * ```
 */
export declare const createDecisionRecommendationSchema: () => Record<string, any>;
/**
 * 33. Creates OpenAPI schema for decision support query.
 *
 * @returns {Record<string, any>} Decision query schema
 *
 * @example
 * ```typescript
 * const schema = createDecisionQuerySchema();
 * ```
 */
export declare const createDecisionQuerySchema: () => Record<string, any>;
/**
 * 34. Creates OpenAPI schema for predictive analysis.
 *
 * @returns {Record<string, any>} Predictive analysis schema
 *
 * @example
 * ```typescript
 * const schema = createPredictiveAnalysisSchema();
 * ```
 */
export declare const createPredictiveAnalysisSchema: () => Record<string, any>;
/**
 * 35. Creates operation documentation for decision support endpoints.
 *
 * @param {string} operation - Operation type
 * @returns {ApiOperationOptions} Operation documentation
 *
 * @example
 * ```typescript
 * @ApiOperation(createDecisionSupportOperationDoc('recommend'))
 * ```
 */
export declare const createDecisionSupportOperationDoc: (operation: string) => ApiOperationOptions;
/**
 * 36. Creates standard success response for command center operations.
 *
 * @param {Type<any>} type - Response DTO type
 * @param {string} description - Response description
 * @returns {ApiResponseOptions} Success response options
 *
 * @example
 * ```typescript
 * @ApiResponse(createCommandSuccessResponse(IncidentDto, 'Incident created successfully'))
 * ```
 */
export declare const createCommandSuccessResponse: (type: Type<any>, description: string) => ApiResponseOptions;
/**
 * 37. Creates command center specific error responses.
 *
 * @param {number} statusCode - HTTP status code
 * @returns {ApiResponseOptions} Error response options
 *
 * @example
 * ```typescript
 * @ApiResponse(createCommandErrorResponse(404))
 * ```
 */
export declare const createCommandErrorResponse: (statusCode: number) => ApiResponseOptions;
/**
 * 38. Creates batch operation response schema.
 *
 * @param {string} operationType - Type of batch operation
 * @returns {Record<string, any>} Batch operation response schema
 *
 * @example
 * ```typescript
 * const schema = createBatchOperationResponse('resource-allocation');
 * ```
 */
export declare const createBatchOperationResponse: (operationType: string) => Record<string, any>;
/**
 * 39. Creates audit trail entry schema for command operations.
 *
 * @returns {Record<string, any>} Audit trail schema
 *
 * @example
 * ```typescript
 * const schema = createAuditTrailSchema();
 * ```
 */
export declare const createAuditTrailSchema: () => Record<string, any>;
/**
 * 40. Creates notification schema for command center events.
 *
 * @param {string} notificationType - Type of notification
 * @returns {Record<string, any>} Notification schema
 *
 * @example
 * ```typescript
 * const schema = createNotificationSchema('incident-escalation');
 * ```
 */
export declare const createNotificationSchema: (notificationType: string) => Record<string, any>;
/**
 * 41. Creates security scheme for command center JWT authentication.
 *
 * @returns {Record<string, any>} JWT security scheme
 *
 * @example
 * ```typescript
 * const scheme = createCommandJWTScheme();
 * ```
 */
export declare const createCommandJWTScheme: () => Record<string, any>;
/**
 * 42. Creates role-based access documentation for command operations.
 *
 * @param {string[]} requiredRoles - Required roles for operation
 * @returns {string} Role requirement description
 *
 * @example
 * ```typescript
 * const roleDoc = createRoleRequirementDoc(['incident-commander', 'operations-chief']);
 * ```
 */
export declare const createRoleRequirementDoc: (requiredRoles: string[]) => string;
/**
 * 43. Creates permission documentation for command center operations.
 *
 * @param {string[]} permissions - Required permissions
 * @returns {string} Permission description
 *
 * @example
 * ```typescript
 * const permDoc = createPermissionDoc(['resource.allocate', 'incident.update']);
 * ```
 */
export declare const createPermissionDoc: (permissions: string[]) => string;
/**
 * 44. Creates API tag for command center endpoints.
 *
 * @param {string} name - Tag name
 * @param {string} description - Tag description
 * @returns {Record<string, any>} API tag object
 *
 * @example
 * ```typescript
 * const tag = createCommandTag('Incidents', 'Incident management operations');
 * ```
 */
export declare const createCommandTag: (name: string, description: string) => Record<string, any>;
/**
 * 45. Creates external documentation reference for command center APIs.
 *
 * @param {string} topic - Documentation topic
 * @returns {Record<string, string>} External docs object
 *
 * @example
 * ```typescript
 * const externalDocs = createCommandExternalDocs('incident-management');
 * ```
 */
export declare const createCommandExternalDocs: (topic: string) => Record<string, string>;
declare const _default: {
    createIncidentCreationSchema: (includeLocation?: boolean) => Record<string, any>;
    createIncidentResponseSchema: (includeResources?: boolean) => Record<string, any>;
    createIncidentUpdateSchema: () => Record<string, any>;
    createIncidentFilterQueryDocs: () => ApiQueryOptions[];
    createIncidentOperationDoc: (operation: string) => ApiOperationOptions;
    createResourceAllocationSchema: () => Record<string, any>;
    createResourceStatusSchema: () => Record<string, any>;
    createResourceAvailabilityQueryDocs: () => ApiQueryOptions[];
    createResourceReallocationSchema: () => Record<string, any>;
    createResourceOperationDoc: (operation: string) => ApiOperationOptions;
    createRealTimeStatusSchema: () => Record<string, any>;
    createDashboardDataSchema: () => Record<string, any>;
    createWebSocketEventSchema: (eventType: string) => Record<string, any>;
    createRealTimeOperationDoc: (operation: string) => ApiOperationOptions;
    createAnalyticsQuerySchema: () => Record<string, any>;
    createIncidentStatisticsSchema: () => Record<string, any>;
    createResourceUtilizationSchema: () => Record<string, any>;
    createReportingQueryDocs: () => ApiQueryOptions[];
    createReportingOperationDoc: (operation: string) => ApiOperationOptions;
    createMultiAgencyCoordinationSchema: () => Record<string, any>;
    createAgencyInformationSchema: () => Record<string, any>;
    createSharedResourceSchema: () => Record<string, any>;
    createMultiAgencyOperationDoc: (operation: string) => ApiOperationOptions;
    createCommandStructureSchema: () => Record<string, any>;
    createCommandAssignmentSchema: () => Record<string, any>;
    createAuthorityDelegationSchema: () => Record<string, any>;
    createCommandHierarchyOperationDoc: (operation: string) => ApiOperationOptions;
    createSituationReportSchema: () => Record<string, any>;
    createTacticalMapSchema: () => Record<string, any>;
    createHazardAssessmentSchema: () => Record<string, any>;
    createSituationAwarenessOperationDoc: (operation: string) => ApiOperationOptions;
    createDecisionRecommendationSchema: () => Record<string, any>;
    createDecisionQuerySchema: () => Record<string, any>;
    createPredictiveAnalysisSchema: () => Record<string, any>;
    createDecisionSupportOperationDoc: (operation: string) => ApiOperationOptions;
    createCommandSuccessResponse: (type: Type<any>, description: string) => ApiResponseOptions;
    createCommandErrorResponse: (statusCode: number) => ApiResponseOptions;
    createBatchOperationResponse: (operationType: string) => Record<string, any>;
    createAuditTrailSchema: () => Record<string, any>;
    createNotificationSchema: (notificationType: string) => Record<string, any>;
    createCommandJWTScheme: () => Record<string, any>;
    createRoleRequirementDoc: (requiredRoles: string[]) => string;
    createPermissionDoc: (permissions: string[]) => string;
    createCommandTag: (name: string, description: string) => Record<string, any>;
    createCommandExternalDocs: (topic: string) => Record<string, string>;
};
export default _default;
//# sourceMappingURL=command-api-documentation.d.ts.map