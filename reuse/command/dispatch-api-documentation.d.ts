/**
 * LOC: DSPAPI456
 * File: /reuse/command/dispatch-api-documentation.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/swagger (decorators and types)
 *   - @nestjs/common (Type utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Dispatch API controllers
 *   - Emergency call handling modules
 *   - CAD integration services
 *   - Unit dispatch controllers
 */
/**
 * File: /reuse/command/dispatch-api-documentation.ts
 * Locator: WC-UTL-DSPAPI-001
 * Purpose: Dispatch Center API Documentation Utilities - OpenAPI schemas for emergency calls, unit dispatch, CAD integration, AVL, radio communication
 *
 * Upstream: Independent utility module for dispatch center OpenAPI/Swagger documentation
 * Downstream: ../backend/dispatch/*, call handling controllers, CAD services, AVL modules, radio integration
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, @nestjs/swagger 7.x, OpenAPI 3.0+
 * Exports: 45 utility functions for dispatch center API documentation, emergency call schemas, unit dispatch, CAD integration, AVL tracking
 *
 * LLM Context: Comprehensive dispatch center API documentation utilities for implementing production-ready OpenAPI/Swagger documentation
 * in White Cross emergency dispatch system. Provides specialized schemas for emergency call handling, unit dispatch, CAD integration,
 * automatic vehicle location (AVL), radio communication, call routing, priority management, and geographic routing. Essential for
 * building well-documented dispatch center APIs.
 */
import { Type } from '@nestjs/common';
import { ApiResponseOptions, ApiOperationOptions, ApiQueryOptions } from '@nestjs/swagger';
/**
 * 1. Creates OpenAPI schema for emergency call intake request.
 *
 * @param {boolean} [includeCallerDetails] - Include detailed caller information
 * @returns {Record<string, any>} Emergency call intake schema
 *
 * @example
 * ```typescript
 * const schema = createEmergencyCallIntakeSchema(true);
 * // Used in @ApiBody for POST /calls
 * ```
 */
export declare const createEmergencyCallIntakeSchema: (includeCallerDetails?: boolean) => Record<string, any>;
/**
 * 2. Creates OpenAPI schema for emergency call response.
 *
 * @param {boolean} [includeDispatchInfo] - Include dispatch information
 * @returns {Record<string, any>} Emergency call response schema
 *
 * @example
 * ```typescript
 * const schema = createEmergencyCallResponseSchema(true);
 * ```
 */
export declare const createEmergencyCallResponseSchema: (includeDispatchInfo?: boolean) => Record<string, any>;
/**
 * 3. Creates OpenAPI schema for call update/triage.
 *
 * @returns {Record<string, any>} Call update schema
 *
 * @example
 * ```typescript
 * const schema = createCallUpdateSchema();
 * ```
 */
export declare const createCallUpdateSchema: () => Record<string, any>;
/**
 * 4. Creates query parameters for call filtering and search.
 *
 * @returns {ApiQueryOptions[]} Call filter query parameters
 *
 * @example
 * ```typescript
 * createCallFilterQueryDocs().forEach(doc => @ApiQuery(doc))
 * ```
 */
export declare const createCallFilterQueryDocs: () => ApiQueryOptions[];
/**
 * 5. Creates operation documentation for emergency call endpoints.
 *
 * @param {string} operation - Operation type
 * @returns {ApiOperationOptions} Operation documentation
 *
 * @example
 * ```typescript
 * @ApiOperation(createCallOperationDoc('intake'))
 * ```
 */
export declare const createCallOperationDoc: (operation: string) => ApiOperationOptions;
/**
 * 6. Creates OpenAPI schema for unit dispatch request.
 *
 * @returns {Record<string, any>} Unit dispatch schema
 *
 * @example
 * ```typescript
 * const schema = createUnitDispatchSchema();
 * ```
 */
export declare const createUnitDispatchSchema: () => Record<string, any>;
/**
 * 7. Creates OpenAPI schema for unit status response.
 *
 * @returns {Record<string, any>} Unit status schema
 *
 * @example
 * ```typescript
 * const schema = createUnitStatusSchema();
 * ```
 */
export declare const createUnitStatusSchema: () => Record<string, any>;
/**
 * 8. Creates OpenAPI schema for unit status update.
 *
 * @returns {Record<string, any>} Unit status update schema
 *
 * @example
 * ```typescript
 * const schema = createUnitStatusUpdateSchema();
 * ```
 */
export declare const createUnitStatusUpdateSchema: () => Record<string, any>;
/**
 * 9. Creates query parameters for unit availability search.
 *
 * @returns {ApiQueryOptions[]} Unit availability query parameters
 *
 * @example
 * ```typescript
 * createUnitAvailabilityQueryDocs().forEach(doc => @ApiQuery(doc))
 * ```
 */
export declare const createUnitAvailabilityQueryDocs: () => ApiQueryOptions[];
/**
 * 10. Creates operation documentation for unit dispatch endpoints.
 *
 * @param {string} operation - Operation type
 * @returns {ApiOperationOptions} Operation documentation
 *
 * @example
 * ```typescript
 * @ApiOperation(createUnitDispatchOperationDoc('dispatch'))
 * ```
 */
export declare const createUnitDispatchOperationDoc: (operation: string) => ApiOperationOptions;
/**
 * 11. Creates OpenAPI schema for CAD event notification.
 *
 * @param {string} eventType - Type of CAD event
 * @returns {Record<string, any>} CAD event schema
 *
 * @example
 * ```typescript
 * const schema = createCADEventSchema('call.received');
 * ```
 */
export declare const createCADEventSchema: (eventType: string) => Record<string, any>;
/**
 * 12. Creates OpenAPI schema for CAD incident synchronization.
 *
 * @returns {Record<string, any>} CAD incident sync schema
 *
 * @example
 * ```typescript
 * const schema = createCADIncidentSyncSchema();
 * ```
 */
export declare const createCADIncidentSyncSchema: () => Record<string, any>;
/**
 * 13. Creates OpenAPI schema for CAD unit assignment.
 *
 * @returns {Record<string, any>} CAD unit assignment schema
 *
 * @example
 * ```typescript
 * const schema = createCADUnitAssignmentSchema();
 * ```
 */
export declare const createCADUnitAssignmentSchema: () => Record<string, any>;
/**
 * 14. Creates OpenAPI schema for CAD status code mapping.
 *
 * @returns {Record<string, any>} CAD status code schema
 *
 * @example
 * ```typescript
 * const schema = createCADStatusCodeSchema();
 * ```
 */
export declare const createCADStatusCodeSchema: () => Record<string, any>;
/**
 * 15. Creates operation documentation for CAD integration endpoints.
 *
 * @param {string} operation - Operation type
 * @returns {ApiOperationOptions} Operation documentation
 *
 * @example
 * ```typescript
 * @ApiOperation(createCADOperationDoc('sync'))
 * ```
 */
export declare const createCADOperationDoc: (operation: string) => ApiOperationOptions;
/**
 * 16. Creates OpenAPI schema for AVL position update.
 *
 * @returns {Record<string, any>} AVL position schema
 *
 * @example
 * ```typescript
 * const schema = createAVLPositionSchema();
 * ```
 */
export declare const createAVLPositionSchema: () => Record<string, any>;
/**
 * 17. Creates OpenAPI schema for AVL breadcrumb trail.
 *
 * @returns {Record<string, any>} AVL breadcrumb trail schema
 *
 * @example
 * ```typescript
 * const schema = createAVLBreadcrumbSchema();
 * ```
 */
export declare const createAVLBreadcrumbSchema: () => Record<string, any>;
/**
 * 18. Creates OpenAPI schema for geofence definition.
 *
 * @returns {Record<string, any>} Geofence schema
 *
 * @example
 * ```typescript
 * const schema = createGeofenceSchema();
 * ```
 */
export declare const createGeofenceSchema: () => Record<string, any>;
/**
 * 19. Creates query parameters for AVL tracking queries.
 *
 * @returns {ApiQueryOptions[]} AVL query parameters
 *
 * @example
 * ```typescript
 * createAVLQueryDocs().forEach(doc => @ApiQuery(doc))
 * ```
 */
export declare const createAVLQueryDocs: () => ApiQueryOptions[];
/**
 * 20. Creates operation documentation for AVL endpoints.
 *
 * @param {string} operation - Operation type
 * @returns {ApiOperationOptions} Operation documentation
 *
 * @example
 * ```typescript
 * @ApiOperation(createAVLOperationDoc('position'))
 * ```
 */
export declare const createAVLOperationDoc: (operation: string) => ApiOperationOptions;
/**
 * 21. Creates OpenAPI schema for radio transmission log.
 *
 * @returns {Record<string, any>} Radio transmission schema
 *
 * @example
 * ```typescript
 * const schema = createRadioTransmissionSchema();
 * ```
 */
export declare const createRadioTransmissionSchema: () => Record<string, any>;
/**
 * 22. Creates OpenAPI schema for radio channel configuration.
 *
 * @returns {Record<string, any>} Radio channel schema
 *
 * @example
 * ```typescript
 * const schema = createRadioChannelSchema();
 * ```
 */
export declare const createRadioChannelSchema: () => Record<string, any>;
/**
 * 23. Creates OpenAPI schema for radio patch/interop.
 *
 * @returns {Record<string, any>} Radio patch schema
 *
 * @example
 * ```typescript
 * const schema = createRadioPatchSchema();
 * ```
 */
export declare const createRadioPatchSchema: () => Record<string, any>;
/**
 * 24. Creates query parameters for radio transmission logs.
 *
 * @returns {ApiQueryOptions[]} Radio log query parameters
 *
 * @example
 * ```typescript
 * createRadioQueryDocs().forEach(doc => @ApiQuery(doc))
 * ```
 */
export declare const createRadioQueryDocs: () => ApiQueryOptions[];
/**
 * 25. Creates operation documentation for radio communication endpoints.
 *
 * @param {string} operation - Operation type
 * @returns {ApiOperationOptions} Operation documentation
 *
 * @example
 * ```typescript
 * @ApiOperation(createRadioOperationDoc('log'))
 * ```
 */
export declare const createRadioOperationDoc: (operation: string) => ApiOperationOptions;
/**
 * 26. Creates OpenAPI schema for call routing/transfer.
 *
 * @returns {Record<string, any>} Call routing schema
 *
 * @example
 * ```typescript
 * const schema = createCallRoutingSchema();
 * ```
 */
export declare const createCallRoutingSchema: () => Record<string, any>;
/**
 * 27. Creates OpenAPI schema for PSAP directory.
 *
 * @returns {Record<string, any>} PSAP directory schema
 *
 * @example
 * ```typescript
 * const schema = createPSAPDirectorySchema();
 * ```
 */
export declare const createPSAPDirectorySchema: () => Record<string, any>;
/**
 * 28. Creates OpenAPI schema for routing rules.
 *
 * @returns {Record<string, any>} Routing rules schema
 *
 * @example
 * ```typescript
 * const schema = createRoutingRulesSchema();
 * ```
 */
export declare const createRoutingRulesSchema: () => Record<string, any>;
/**
 * 29. Creates operation documentation for call routing endpoints.
 *
 * @param {string} operation - Operation type
 * @returns {ApiOperationOptions} Operation documentation
 *
 * @example
 * ```typescript
 * @ApiOperation(createRoutingOperationDoc('route'))
 * ```
 */
export declare const createRoutingOperationDoc: (operation: string) => ApiOperationOptions;
/**
 * 30. Creates OpenAPI schema for priority matrix configuration.
 *
 * @returns {Record<string, any>} Priority matrix schema
 *
 * @example
 * ```typescript
 * const schema = createPriorityMatrixSchema();
 * ```
 */
export declare const createPriorityMatrixSchema: () => Record<string, any>;
/**
 * 31. Creates OpenAPI schema for priority override.
 *
 * @returns {Record<string, any>} Priority override schema
 *
 * @example
 * ```typescript
 * const schema = createPriorityOverrideSchema();
 * ```
 */
export declare const createPriorityOverrideSchema: () => Record<string, any>;
/**
 * 32. Creates OpenAPI schema for queue management.
 *
 * @returns {Record<string, any>} Queue management schema
 *
 * @example
 * ```typescript
 * const schema = createQueueManagementSchema();
 * ```
 */
export declare const createQueueManagementSchema: () => Record<string, any>;
/**
 * 33. Creates operation documentation for priority management endpoints.
 *
 * @param {string} operation - Operation type
 * @returns {ApiOperationOptions} Operation documentation
 *
 * @example
 * ```typescript
 * @ApiOperation(createPriorityOperationDoc('override'))
 * ```
 */
export declare const createPriorityOperationDoc: (operation: string) => ApiOperationOptions;
/**
 * 34. Creates OpenAPI schema for geographic zone definition.
 *
 * @returns {Record<string, any>} Geographic zone schema
 *
 * @example
 * ```typescript
 * const schema = createGeographicZoneSchema();
 * ```
 */
export declare const createGeographicZoneSchema: () => Record<string, any>;
/**
 * 35. Creates OpenAPI schema for closest unit calculation.
 *
 * @returns {Record<string, any>} Closest unit schema
 *
 * @example
 * ```typescript
 * const schema = createClosestUnitSchema();
 * ```
 */
export declare const createClosestUnitSchema: () => Record<string, any>;
/**
 * 36. Creates OpenAPI schema for coverage analysis.
 *
 * @returns {Record<string, any>} Coverage analysis schema
 *
 * @example
 * ```typescript
 * const schema = createCoverageAnalysisSchema();
 * ```
 */
export declare const createCoverageAnalysisSchema: () => Record<string, any>;
/**
 * 37. Creates query parameters for geographic routing queries.
 *
 * @returns {ApiQueryOptions[]} Geographic routing query parameters
 *
 * @example
 * ```typescript
 * createGeographicQueryDocs().forEach(doc => @ApiQuery(doc))
 * ```
 */
export declare const createGeographicQueryDocs: () => ApiQueryOptions[];
/**
 * 38. Creates operation documentation for geographic routing endpoints.
 *
 * @param {string} operation - Operation type
 * @returns {ApiOperationOptions} Operation documentation
 *
 * @example
 * ```typescript
 * @ApiOperation(createGeographicOperationDoc('closest'))
 * ```
 */
export declare const createGeographicOperationDoc: (operation: string) => ApiOperationOptions;
/**
 * 39. Creates standard success response for dispatch operations.
 *
 * @param {Type<any>} type - Response DTO type
 * @param {string} description - Response description
 * @returns {ApiResponseOptions} Success response options
 *
 * @example
 * ```typescript
 * @ApiResponse(createDispatchSuccessResponse(CallDto, 'Call received successfully'))
 * ```
 */
export declare const createDispatchSuccessResponse: (type: Type<any>, description: string) => ApiResponseOptions;
/**
 * 40. Creates dispatch-specific error responses.
 *
 * @param {number} statusCode - HTTP status code
 * @returns {ApiResponseOptions} Error response options
 *
 * @example
 * ```typescript
 * @ApiResponse(createDispatchErrorResponse(404))
 * ```
 */
export declare const createDispatchErrorResponse: (statusCode: number) => ApiResponseOptions;
/**
 * 41. Creates real-time event notification schema.
 *
 * @param {string} eventType - Type of event
 * @returns {Record<string, any>} Event notification schema
 *
 * @example
 * ```typescript
 * const schema = createEventNotificationSchema('unit.dispatched');
 * ```
 */
export declare const createEventNotificationSchema: (eventType: string) => Record<string, any>;
/**
 * 42. Creates performance metrics schema for dispatch operations.
 *
 * @returns {Record<string, any>} Performance metrics schema
 *
 * @example
 * ```typescript
 * const schema = createDispatchMetricsSchema();
 * ```
 */
export declare const createDispatchMetricsSchema: () => Record<string, any>;
/**
 * 43. Creates API tag for dispatch center endpoints.
 *
 * @param {string} name - Tag name
 * @param {string} description - Tag description
 * @returns {Record<string, any>} API tag object
 *
 * @example
 * ```typescript
 * const tag = createDispatchTag('Emergency Calls', 'Emergency call intake and management');
 * ```
 */
export declare const createDispatchTag: (name: string, description: string) => Record<string, any>;
/**
 * 44. Creates security scheme for dispatch center JWT authentication.
 *
 * @returns {Record<string, any>} JWT security scheme
 *
 * @example
 * ```typescript
 * const scheme = createDispatchJWTScheme();
 * ```
 */
export declare const createDispatchJWTScheme: () => Record<string, any>;
/**
 * 45. Creates external documentation reference for dispatch APIs.
 *
 * @param {string} topic - Documentation topic
 * @returns {Record<string, string>} External docs object
 *
 * @example
 * ```typescript
 * const externalDocs = createDispatchExternalDocs('emergency-calls');
 * ```
 */
export declare const createDispatchExternalDocs: (topic: string) => Record<string, string>;
declare const _default: {
    createEmergencyCallIntakeSchema: (includeCallerDetails?: boolean) => Record<string, any>;
    createEmergencyCallResponseSchema: (includeDispatchInfo?: boolean) => Record<string, any>;
    createCallUpdateSchema: () => Record<string, any>;
    createCallFilterQueryDocs: () => ApiQueryOptions[];
    createCallOperationDoc: (operation: string) => ApiOperationOptions;
    createUnitDispatchSchema: () => Record<string, any>;
    createUnitStatusSchema: () => Record<string, any>;
    createUnitStatusUpdateSchema: () => Record<string, any>;
    createUnitAvailabilityQueryDocs: () => ApiQueryOptions[];
    createUnitDispatchOperationDoc: (operation: string) => ApiOperationOptions;
    createCADEventSchema: (eventType: string) => Record<string, any>;
    createCADIncidentSyncSchema: () => Record<string, any>;
    createCADUnitAssignmentSchema: () => Record<string, any>;
    createCADStatusCodeSchema: () => Record<string, any>;
    createCADOperationDoc: (operation: string) => ApiOperationOptions;
    createAVLPositionSchema: () => Record<string, any>;
    createAVLBreadcrumbSchema: () => Record<string, any>;
    createGeofenceSchema: () => Record<string, any>;
    createAVLQueryDocs: () => ApiQueryOptions[];
    createAVLOperationDoc: (operation: string) => ApiOperationOptions;
    createRadioTransmissionSchema: () => Record<string, any>;
    createRadioChannelSchema: () => Record<string, any>;
    createRadioPatchSchema: () => Record<string, any>;
    createRadioQueryDocs: () => ApiQueryOptions[];
    createRadioOperationDoc: (operation: string) => ApiOperationOptions;
    createCallRoutingSchema: () => Record<string, any>;
    createPSAPDirectorySchema: () => Record<string, any>;
    createRoutingRulesSchema: () => Record<string, any>;
    createRoutingOperationDoc: (operation: string) => ApiOperationOptions;
    createPriorityMatrixSchema: () => Record<string, any>;
    createPriorityOverrideSchema: () => Record<string, any>;
    createQueueManagementSchema: () => Record<string, any>;
    createPriorityOperationDoc: (operation: string) => ApiOperationOptions;
    createGeographicZoneSchema: () => Record<string, any>;
    createClosestUnitSchema: () => Record<string, any>;
    createCoverageAnalysisSchema: () => Record<string, any>;
    createGeographicQueryDocs: () => ApiQueryOptions[];
    createGeographicOperationDoc: (operation: string) => ApiOperationOptions;
    createDispatchSuccessResponse: (type: Type<any>, description: string) => ApiResponseOptions;
    createDispatchErrorResponse: (statusCode: number) => ApiResponseOptions;
    createEventNotificationSchema: (eventType: string) => Record<string, any>;
    createDispatchMetricsSchema: () => Record<string, any>;
    createDispatchTag: (name: string, description: string) => Record<string, any>;
    createDispatchJWTScheme: () => Record<string, any>;
    createDispatchExternalDocs: (topic: string) => Record<string, string>;
};
export default _default;
//# sourceMappingURL=dispatch-api-documentation.d.ts.map