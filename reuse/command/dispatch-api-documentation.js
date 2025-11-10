"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDispatchExternalDocs = exports.createDispatchJWTScheme = exports.createDispatchTag = exports.createDispatchMetricsSchema = exports.createEventNotificationSchema = exports.createDispatchErrorResponse = exports.createDispatchSuccessResponse = exports.createGeographicOperationDoc = exports.createGeographicQueryDocs = exports.createCoverageAnalysisSchema = exports.createClosestUnitSchema = exports.createGeographicZoneSchema = exports.createPriorityOperationDoc = exports.createQueueManagementSchema = exports.createPriorityOverrideSchema = exports.createPriorityMatrixSchema = exports.createRoutingOperationDoc = exports.createRoutingRulesSchema = exports.createPSAPDirectorySchema = exports.createCallRoutingSchema = exports.createRadioOperationDoc = exports.createRadioQueryDocs = exports.createRadioPatchSchema = exports.createRadioChannelSchema = exports.createRadioTransmissionSchema = exports.createAVLOperationDoc = exports.createAVLQueryDocs = exports.createGeofenceSchema = exports.createAVLBreadcrumbSchema = exports.createAVLPositionSchema = exports.createCADOperationDoc = exports.createCADStatusCodeSchema = exports.createCADUnitAssignmentSchema = exports.createCADIncidentSyncSchema = exports.createCADEventSchema = exports.createUnitDispatchOperationDoc = exports.createUnitAvailabilityQueryDocs = exports.createUnitStatusUpdateSchema = exports.createUnitStatusSchema = exports.createUnitDispatchSchema = exports.createCallOperationDoc = exports.createCallFilterQueryDocs = exports.createCallUpdateSchema = exports.createEmergencyCallResponseSchema = exports.createEmergencyCallIntakeSchema = void 0;
// ============================================================================
// 1. EMERGENCY CALL API SCHEMAS
// ============================================================================
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
const createEmergencyCallIntakeSchema = (includeCallerDetails = true) => {
    const properties = {
        callerPhone: {
            type: 'string',
            description: 'Caller phone number',
            pattern: '^\\+?[1-9]\\d{1,14}$',
            example: '+15551234567',
        },
        callType: {
            type: 'string',
            enum: ['911', 'admin', 'non-emergency', 'test'],
            description: 'Type of incoming call',
            example: '911',
        },
        callSource: {
            type: 'string',
            enum: ['wireline', 'wireless', 'voip', 'text-to-911', 'third-party'],
            description: 'Source of the emergency call',
        },
        emergencyType: {
            type: 'string',
            enum: ['fire', 'medical', 'police', 'multi-agency', 'unknown'],
            description: 'Type of emergency reported',
        },
        priority: {
            type: 'integer',
            minimum: 1,
            maximum: 5,
            description: 'Call priority (1=highest, 5=lowest)',
            example: 1,
        },
        location: {
            type: 'object',
            properties: {
                latitude: { type: 'number', minimum: -90, maximum: 90, example: 40.7128 },
                longitude: { type: 'number', minimum: -180, maximum: 180, example: -74.006 },
                address: { type: 'string', example: '123 Main St, New York, NY 10001' },
                gridLocation: { type: 'string', example: 'A-5-3', description: 'Grid map location' },
                accuracy: { type: 'number', description: 'Location accuracy in meters', example: 50 },
                locationType: {
                    type: 'string',
                    enum: ['gps', 'tower', 'wifi', 'manual', 'ali-database'],
                },
            },
            required: ['latitude', 'longitude'],
        },
        description: {
            type: 'string',
            description: 'Initial call description',
            maxLength: 2000,
        },
    };
    if (includeCallerDetails) {
        properties.callerName = { type: 'string', nullable: true };
        properties.callerLanguage = { type: 'string', example: 'en', nullable: true };
        properties.callbackNumber = { type: 'string', nullable: true };
        properties.specialNeeds = {
            type: 'array',
            items: { type: 'string' },
            description: 'Special needs or accessibility requirements',
            nullable: true,
        };
    }
    return {
        type: 'object',
        properties,
        required: ['callerPhone', 'callType', 'emergencyType', 'priority', 'location'],
    };
};
exports.createEmergencyCallIntakeSchema = createEmergencyCallIntakeSchema;
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
const createEmergencyCallResponseSchema = (includeDispatchInfo = true) => {
    const properties = {
        callId: { type: 'string', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' },
        callerPhone: { type: 'string', example: '+15551234567' },
        callType: { type: 'string', example: '911' },
        emergencyType: { type: 'string', example: 'medical' },
        priority: { type: 'integer', example: 1 },
        status: {
            type: 'string',
            enum: ['active', 'dispatched', 'closed', 'transferred', 'abandoned'],
            example: 'active',
        },
        location: {
            type: 'object',
            properties: {
                latitude: { type: 'number' },
                longitude: { type: 'number' },
                address: { type: 'string' },
                gridLocation: { type: 'string' },
                accuracy: { type: 'number' },
            },
        },
        receivedAt: { type: 'string', format: 'date-time', example: '2024-01-15T10:30:00Z' },
        dispatcherId: { type: 'string', example: 'DISP-123', nullable: true },
        duration: { type: 'integer', description: 'Call duration in seconds', nullable: true },
        notes: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    timestamp: { type: 'string', format: 'date-time' },
                    text: { type: 'string' },
                    userId: { type: 'string' },
                },
            },
        },
    };
    if (includeDispatchInfo) {
        properties.dispatchedUnits = {
            type: 'array',
            items: { type: 'string' },
            description: 'Units dispatched to this call',
            example: ['AMB-5', 'ENG-12'],
        };
        properties.incidentId = {
            type: 'string',
            format: 'uuid',
            nullable: true,
            description: 'Associated incident ID if created',
        };
    }
    return {
        type: 'object',
        properties,
        required: ['callId', 'callerPhone', 'callType', 'emergencyType', 'priority', 'status', 'receivedAt'],
    };
};
exports.createEmergencyCallResponseSchema = createEmergencyCallResponseSchema;
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
const createCallUpdateSchema = () => {
    return {
        type: 'object',
        properties: {
            priority: {
                type: 'integer',
                minimum: 1,
                maximum: 5,
                description: 'Updated priority level',
            },
            emergencyType: {
                type: 'string',
                enum: ['fire', 'medical', 'police', 'multi-agency', 'unknown'],
                description: 'Updated emergency type',
            },
            status: {
                type: 'string',
                enum: ['active', 'dispatched', 'closed', 'transferred', 'abandoned'],
                description: 'Updated call status',
            },
            additionalInfo: {
                type: 'string',
                description: 'Additional information from call triage',
                maxLength: 2000,
            },
            medicalProtocol: {
                type: 'string',
                description: 'Medical dispatch protocol used (e.g., MPDS)',
                nullable: true,
            },
            determinantCode: {
                type: 'string',
                description: 'Protocol determinant code',
                nullable: true,
                example: '29-D-1',
            },
            updatedBy: {
                type: 'string',
                description: 'Dispatcher making the update',
            },
        },
    };
};
exports.createCallUpdateSchema = createCallUpdateSchema;
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
const createCallFilterQueryDocs = () => {
    return [
        {
            name: 'status',
            required: false,
            description: 'Filter by call status',
            enum: ['active', 'dispatched', 'closed', 'transferred', 'abandoned'],
        },
        {
            name: 'emergencyType',
            required: false,
            description: 'Filter by emergency type',
            enum: ['fire', 'medical', 'police', 'multi-agency', 'unknown'],
        },
        {
            name: 'priority',
            required: false,
            description: 'Filter by priority level',
            type: Number,
            example: 1,
        },
        {
            name: 'dispatcherId',
            required: false,
            description: 'Filter by assigned dispatcher',
            type: String,
        },
        {
            name: 'startTime',
            required: false,
            description: 'Filter calls from this time (ISO 8601)',
            type: String,
            example: '2024-01-15T00:00:00Z',
        },
        {
            name: 'endTime',
            required: false,
            description: 'Filter calls until this time (ISO 8601)',
            type: String,
            example: '2024-01-15T23:59:59Z',
        },
        {
            name: 'callerPhone',
            required: false,
            description: 'Search by caller phone number',
            type: String,
        },
    ];
};
exports.createCallFilterQueryDocs = createCallFilterQueryDocs;
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
const createCallOperationDoc = (operation) => {
    const operations = {
        intake: {
            summary: 'Receive emergency call',
            description: 'Receives and processes incoming emergency call with location, caller information, and initial triage',
            tags: ['Emergency Calls'],
        },
        update: {
            summary: 'Update call details',
            description: 'Updates call priority, type, or adds additional information from triage',
            tags: ['Emergency Calls'],
        },
        list: {
            summary: 'List emergency calls',
            description: 'Retrieves list of emergency calls with filtering by status, type, and time',
            tags: ['Emergency Calls'],
        },
        get: {
            summary: 'Get call details',
            description: 'Retrieves complete details for a specific emergency call',
            tags: ['Emergency Calls'],
        },
        transfer: {
            summary: 'Transfer call',
            description: 'Transfers emergency call to another PSAP or agency',
            tags: ['Emergency Calls'],
        },
        close: {
            summary: 'Close call',
            description: 'Marks emergency call as closed with disposition',
            tags: ['Emergency Calls'],
        },
    };
    return operations[operation] || { summary: operation, tags: ['Emergency Calls'] };
};
exports.createCallOperationDoc = createCallOperationDoc;
// ============================================================================
// 2. UNIT DISPATCH API SCHEMAS
// ============================================================================
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
const createUnitDispatchSchema = () => {
    return {
        type: 'object',
        properties: {
            callId: {
                type: 'string',
                format: 'uuid',
                description: 'Emergency call to dispatch units for',
            },
            unitIds: {
                type: 'array',
                items: { type: 'string' },
                description: 'List of unit IDs to dispatch',
                minItems: 1,
                example: ['ENG-5', 'LAD-12', 'AMB-3'],
            },
            dispatchPriority: {
                type: 'string',
                enum: ['routine', 'urgent', 'emergency', 'code-3'],
                description: 'Dispatch priority level',
            },
            responseMode: {
                type: 'string',
                enum: ['cold', 'hot', 'code-3'],
                description: 'Response mode (lights and sirens)',
            },
            assignmentType: {
                type: 'string',
                enum: ['primary', 'backup', 'mutual-aid', 'investigation'],
                description: 'Type of unit assignment',
            },
            instructions: {
                type: 'string',
                description: 'Special instructions for responding units',
                maxLength: 1000,
            },
            estimatedArrivalOverride: {
                type: 'string',
                format: 'date-time',
                nullable: true,
                description: 'Manual ETA override',
            },
            dispatchedBy: {
                type: 'string',
                description: 'Dispatcher initiating dispatch',
            },
        },
        required: ['callId', 'unitIds', 'dispatchPriority', 'responseMode', 'dispatchedBy'],
    };
};
exports.createUnitDispatchSchema = createUnitDispatchSchema;
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
const createUnitStatusSchema = () => {
    return {
        type: 'object',
        properties: {
            unitId: { type: 'string', example: 'ENG-5' },
            unitType: {
                type: 'string',
                enum: ['engine', 'ladder', 'ambulance', 'rescue', 'chief', 'police', 'utility'],
            },
            status: {
                type: 'string',
                enum: [
                    'available',
                    'dispatched',
                    'en-route',
                    'on-scene',
                    'transporting',
                    'at-hospital',
                    'returning',
                    'out-of-service',
                ],
                example: 'available',
            },
            assignedCall: {
                type: 'string',
                format: 'uuid',
                nullable: true,
                description: 'Currently assigned call ID',
            },
            currentLocation: {
                type: 'object',
                nullable: true,
                properties: {
                    latitude: { type: 'number' },
                    longitude: { type: 'number' },
                    heading: { type: 'number', description: 'Heading in degrees (0-359)' },
                    speed: { type: 'number', description: 'Speed in km/h' },
                    accuracy: { type: 'number', description: 'GPS accuracy in meters' },
                },
            },
            station: {
                type: 'string',
                description: 'Home station/precinct',
                example: 'Station 5',
            },
            crew: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        personnelId: { type: 'string' },
                        name: { type: 'string' },
                        role: { type: 'string' },
                        certification: { type: 'string' },
                    },
                },
            },
            capabilities: {
                type: 'array',
                items: { type: 'string' },
                example: ['fire-suppression', 'hazmat-basic', 'ems-basic'],
            },
            lastUpdate: { type: 'string', format: 'date-time' },
        },
        required: ['unitId', 'unitType', 'status', 'station', 'lastUpdate'],
    };
};
exports.createUnitStatusSchema = createUnitStatusSchema;
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
const createUnitStatusUpdateSchema = () => {
    return {
        type: 'object',
        properties: {
            unitId: { type: 'string', description: 'Unit identifier' },
            newStatus: {
                type: 'string',
                enum: [
                    'available',
                    'dispatched',
                    'en-route',
                    'on-scene',
                    'transporting',
                    'at-hospital',
                    'returning',
                    'out-of-service',
                ],
                description: 'New unit status',
            },
            location: {
                type: 'object',
                nullable: true,
                properties: {
                    latitude: { type: 'number' },
                    longitude: { type: 'number' },
                    heading: { type: 'number' },
                    speed: { type: 'number' },
                },
            },
            notes: {
                type: 'string',
                description: 'Status change notes',
                maxLength: 500,
            },
            timestamp: {
                type: 'string',
                format: 'date-time',
                description: 'Status change timestamp',
            },
        },
        required: ['unitId', 'newStatus', 'timestamp'],
    };
};
exports.createUnitStatusUpdateSchema = createUnitStatusUpdateSchema;
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
const createUnitAvailabilityQueryDocs = () => {
    return [
        {
            name: 'unitType',
            required: false,
            description: 'Filter by unit type',
            enum: ['engine', 'ladder', 'ambulance', 'rescue', 'chief', 'police', 'utility'],
        },
        {
            name: 'status',
            required: false,
            description: 'Filter by unit status',
            enum: ['available', 'dispatched', 'en-route', 'on-scene', 'out-of-service'],
        },
        {
            name: 'capability',
            required: false,
            description: 'Required capability',
            type: String,
            example: 'fire-suppression',
        },
        {
            name: 'latitude',
            required: false,
            description: 'Center latitude for proximity search',
            type: Number,
        },
        {
            name: 'longitude',
            required: false,
            description: 'Center longitude for proximity search',
            type: Number,
        },
        {
            name: 'radiusKm',
            required: false,
            description: 'Search radius in kilometers',
            type: Number,
            example: 10,
        },
        {
            name: 'station',
            required: false,
            description: 'Filter by home station',
            type: String,
        },
    ];
};
exports.createUnitAvailabilityQueryDocs = createUnitAvailabilityQueryDocs;
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
const createUnitDispatchOperationDoc = (operation) => {
    const operations = {
        dispatch: {
            summary: 'Dispatch units to call',
            description: 'Dispatches one or more units to an emergency call with priority and instructions',
            tags: ['Unit Dispatch'],
        },
        status: {
            summary: 'Get unit status',
            description: 'Retrieves current status, location, and assignment for a unit',
            tags: ['Unit Dispatch'],
        },
        updateStatus: {
            summary: 'Update unit status',
            description: 'Updates unit status (en-route, on-scene, available, etc.)',
            tags: ['Unit Dispatch'],
        },
        available: {
            summary: 'Find available units',
            description: 'Searches for available units by type, capability, and proximity',
            tags: ['Unit Dispatch'],
        },
        recall: {
            summary: 'Recall unit',
            description: 'Recalls a dispatched unit before arrival',
            tags: ['Unit Dispatch'],
        },
    };
    return operations[operation] || { summary: operation, tags: ['Unit Dispatch'] };
};
exports.createUnitDispatchOperationDoc = createUnitDispatchOperationDoc;
// ============================================================================
// 3. CAD INTEGRATION API SCHEMAS
// ============================================================================
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
const createCADEventSchema = (eventType) => {
    return {
        type: 'object',
        properties: {
            eventId: { type: 'string', format: 'uuid' },
            eventType: { type: 'string', example: eventType },
            timestamp: { type: 'string', format: 'date-time' },
            source: {
                type: 'string',
                description: 'CAD system source',
                example: 'CAD-PRIMARY',
            },
            priority: { type: 'integer', minimum: 1, maximum: 5 },
            data: {
                type: 'object',
                description: 'Event-specific data payload',
                additionalProperties: true,
            },
            relatedEntities: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        entityType: { type: 'string' },
                        entityId: { type: 'string' },
                    },
                },
            },
            sequenceNumber: {
                type: 'integer',
                description: 'Sequence number for event ordering',
            },
        },
        required: ['eventId', 'eventType', 'timestamp', 'source', 'data'],
    };
};
exports.createCADEventSchema = createCADEventSchema;
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
const createCADIncidentSyncSchema = () => {
    return {
        type: 'object',
        properties: {
            cadIncidentId: {
                type: 'string',
                description: 'CAD system incident ID',
            },
            localIncidentId: {
                type: 'string',
                format: 'uuid',
                nullable: true,
                description: 'Local system incident ID',
            },
            syncAction: {
                type: 'string',
                enum: ['create', 'update', 'close', 'link'],
                description: 'Synchronization action to perform',
            },
            incidentData: {
                type: 'object',
                properties: {
                    type: { type: 'string' },
                    severity: { type: 'string' },
                    location: { type: 'object' },
                    description: { type: 'string' },
                    status: { type: 'string' },
                    units: { type: 'array', items: { type: 'string' } },
                },
            },
            syncTimestamp: { type: 'string', format: 'date-time' },
            conflictResolution: {
                type: 'string',
                enum: ['prefer-cad', 'prefer-local', 'manual-review'],
                nullable: true,
            },
        },
        required: ['cadIncidentId', 'syncAction', 'incidentData', 'syncTimestamp'],
    };
};
exports.createCADIncidentSyncSchema = createCADIncidentSyncSchema;
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
const createCADUnitAssignmentSchema = () => {
    return {
        type: 'object',
        properties: {
            assignmentId: { type: 'string', format: 'uuid' },
            cadIncidentId: { type: 'string' },
            unitId: { type: 'string' },
            assignmentType: {
                type: 'string',
                enum: ['primary', 'backup', 'staged', 'cancelled'],
            },
            dispatchTime: { type: 'string', format: 'date-time' },
            acknowledgeTime: {
                type: 'string',
                format: 'date-time',
                nullable: true,
            },
            enRouteTime: {
                type: 'string',
                format: 'date-time',
                nullable: true,
            },
            onSceneTime: {
                type: 'string',
                format: 'date-time',
                nullable: true,
            },
            clearTime: {
                type: 'string',
                format: 'date-time',
                nullable: true,
            },
            status: {
                type: 'string',
                enum: ['dispatched', 'acknowledged', 'en-route', 'on-scene', 'cleared', 'cancelled'],
            },
        },
        required: ['assignmentId', 'cadIncidentId', 'unitId', 'assignmentType', 'dispatchTime', 'status'],
    };
};
exports.createCADUnitAssignmentSchema = createCADUnitAssignmentSchema;
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
const createCADStatusCodeSchema = () => {
    return {
        type: 'object',
        properties: {
            cadStatusCode: { type: 'string', description: 'CAD system status code' },
            standardStatus: {
                type: 'string',
                description: 'Standardized status mapping',
            },
            description: { type: 'string' },
            category: {
                type: 'string',
                enum: ['unit-status', 'incident-status', 'call-status'],
            },
            allowsDispatch: { type: 'boolean', description: 'Whether unit can be dispatched in this status' },
            timeTracking: { type: 'boolean', description: 'Whether to track time in this status' },
        },
        required: ['cadStatusCode', 'standardStatus', 'description', 'category'],
    };
};
exports.createCADStatusCodeSchema = createCADStatusCodeSchema;
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
const createCADOperationDoc = (operation) => {
    const operations = {
        sync: {
            summary: 'Sync CAD incident',
            description: 'Synchronizes incident data between CAD system and local database',
            tags: ['CAD Integration'],
        },
        event: {
            summary: 'Process CAD event',
            description: 'Processes incoming CAD event notification',
            tags: ['CAD Integration'],
        },
        assignment: {
            summary: 'Update CAD assignment',
            description: 'Updates unit assignment status in CAD system',
            tags: ['CAD Integration'],
        },
        statusCodes: {
            summary: 'Get CAD status codes',
            description: 'Retrieves CAD status code mappings',
            tags: ['CAD Integration'],
        },
        heartbeat: {
            summary: 'CAD heartbeat',
            description: 'Maintains connection heartbeat with CAD system',
            tags: ['CAD Integration'],
        },
    };
    return operations[operation] || { summary: operation, tags: ['CAD Integration'] };
};
exports.createCADOperationDoc = createCADOperationDoc;
// ============================================================================
// 4. AVL (AUTOMATIC VEHICLE LOCATION) API SCHEMAS
// ============================================================================
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
const createAVLPositionSchema = () => {
    return {
        type: 'object',
        properties: {
            unitId: { type: 'string', description: 'Unit identifier', example: 'ENG-5' },
            latitude: { type: 'number', minimum: -90, maximum: 90, example: 40.7128 },
            longitude: { type: 'number', minimum: -180, maximum: 180, example: -74.006 },
            altitude: { type: 'number', nullable: true, description: 'Altitude in meters' },
            heading: {
                type: 'number',
                minimum: 0,
                maximum: 359,
                nullable: true,
                description: 'Heading in degrees',
            },
            speed: {
                type: 'number',
                minimum: 0,
                nullable: true,
                description: 'Speed in km/h',
            },
            accuracy: {
                type: 'number',
                description: 'GPS accuracy in meters',
                example: 10,
            },
            timestamp: {
                type: 'string',
                format: 'date-time',
                description: 'Position timestamp',
            },
            source: {
                type: 'string',
                enum: ['gps', 'cell-tower', 'wifi', 'manual'],
                description: 'Position source',
            },
            batteryLevel: {
                type: 'integer',
                minimum: 0,
                maximum: 100,
                nullable: true,
                description: 'Device battery percentage',
            },
        },
        required: ['unitId', 'latitude', 'longitude', 'accuracy', 'timestamp', 'source'],
    };
};
exports.createAVLPositionSchema = createAVLPositionSchema;
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
const createAVLBreadcrumbSchema = () => {
    return {
        type: 'object',
        properties: {
            unitId: { type: 'string', example: 'ENG-5' },
            startTime: { type: 'string', format: 'date-time' },
            endTime: { type: 'string', format: 'date-time' },
            positions: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        latitude: { type: 'number' },
                        longitude: { type: 'number' },
                        timestamp: { type: 'string', format: 'date-time' },
                        speed: { type: 'number', nullable: true },
                        heading: { type: 'number', nullable: true },
                    },
                },
            },
            totalDistance: {
                type: 'number',
                description: 'Total distance traveled in kilometers',
            },
            averageSpeed: {
                type: 'number',
                description: 'Average speed in km/h',
            },
        },
        required: ['unitId', 'startTime', 'endTime', 'positions'],
    };
};
exports.createAVLBreadcrumbSchema = createAVLBreadcrumbSchema;
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
const createGeofenceSchema = () => {
    return {
        type: 'object',
        properties: {
            geofenceId: { type: 'string', format: 'uuid' },
            name: { type: 'string', example: 'Station 5 Response Zone' },
            type: {
                type: 'string',
                enum: ['circle', 'polygon', 'response-zone', 'exclusion-zone'],
            },
            geometry: {
                type: 'object',
                description: 'GeoJSON geometry',
                properties: {
                    type: { type: 'string', enum: ['Point', 'Polygon', 'Circle'] },
                    coordinates: {
                        type: 'array',
                        description: 'GeoJSON coordinates',
                    },
                    radius: {
                        type: 'number',
                        nullable: true,
                        description: 'Radius in meters (for circles)',
                    },
                },
            },
            monitoredUnits: {
                type: 'array',
                items: { type: 'string' },
                description: 'Units to monitor in this geofence',
            },
            alertOnEntry: { type: 'boolean', description: 'Alert when unit enters geofence' },
            alertOnExit: { type: 'boolean', description: 'Alert when unit exits geofence' },
            active: { type: 'boolean', description: 'Whether geofence is active' },
        },
        required: ['geofenceId', 'name', 'type', 'geometry'],
    };
};
exports.createGeofenceSchema = createGeofenceSchema;
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
const createAVLQueryDocs = () => {
    return [
        {
            name: 'unitId',
            required: false,
            description: 'Filter by specific unit ID',
            type: String,
        },
        {
            name: 'startTime',
            required: false,
            description: 'Start time for breadcrumb trail (ISO 8601)',
            type: String,
        },
        {
            name: 'endTime',
            required: false,
            description: 'End time for breadcrumb trail (ISO 8601)',
            type: String,
        },
        {
            name: 'includeStationary',
            required: false,
            description: 'Include positions where unit was stationary',
            type: Boolean,
        },
        {
            name: 'minSpeed',
            required: false,
            description: 'Minimum speed filter (km/h)',
            type: Number,
        },
        {
            name: 'geofenceId',
            required: false,
            description: 'Filter positions within geofence',
            type: String,
        },
    ];
};
exports.createAVLQueryDocs = createAVLQueryDocs;
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
const createAVLOperationDoc = (operation) => {
    const operations = {
        position: {
            summary: 'Update unit position',
            description: 'Updates AVL position for a unit with GPS coordinates and metadata',
            tags: ['AVL (Vehicle Location)'],
        },
        track: {
            summary: 'Get position tracking',
            description: 'Retrieves real-time or historical position tracking for units',
            tags: ['AVL (Vehicle Location)'],
        },
        breadcrumb: {
            summary: 'Get breadcrumb trail',
            description: 'Retrieves breadcrumb trail showing unit movement over time',
            tags: ['AVL (Vehicle Location)'],
        },
        geofence: {
            summary: 'Manage geofences',
            description: 'Creates or updates geofence definitions for zone monitoring',
            tags: ['AVL (Vehicle Location)'],
        },
        proximity: {
            summary: 'Find nearby units',
            description: 'Finds units within specified proximity to a location',
            tags: ['AVL (Vehicle Location)'],
        },
    };
    return operations[operation] || { summary: operation, tags: ['AVL (Vehicle Location)'] };
};
exports.createAVLOperationDoc = createAVLOperationDoc;
// ============================================================================
// 5. RADIO COMMUNICATION API SCHEMAS
// ============================================================================
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
const createRadioTransmissionSchema = () => {
    return {
        type: 'object',
        properties: {
            transmissionId: { type: 'string', format: 'uuid' },
            channel: { type: 'string', description: 'Radio channel/talkgroup', example: 'FIRE-OPS-1' },
            unitId: {
                type: 'string',
                nullable: true,
                description: 'Transmitting unit ID',
                example: 'ENG-5',
            },
            userId: {
                type: 'string',
                nullable: true,
                description: 'Transmitting user ID (if identifiable)',
            },
            timestamp: { type: 'string', format: 'date-time' },
            duration: { type: 'integer', description: 'Transmission duration in seconds' },
            callId: {
                type: 'string',
                format: 'uuid',
                nullable: true,
                description: 'Associated emergency call ID',
            },
            incidentId: {
                type: 'string',
                format: 'uuid',
                nullable: true,
                description: 'Associated incident ID',
            },
            transcription: {
                type: 'string',
                nullable: true,
                description: 'Automatic transcription if available',
            },
            audioUrl: {
                type: 'string',
                nullable: true,
                description: 'URL to audio recording',
            },
            priority: {
                type: 'string',
                enum: ['routine', 'urgent', 'emergency'],
            },
        },
        required: ['transmissionId', 'channel', 'timestamp', 'duration'],
    };
};
exports.createRadioTransmissionSchema = createRadioTransmissionSchema;
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
const createRadioChannelSchema = () => {
    return {
        type: 'object',
        properties: {
            channelId: { type: 'string', example: 'FIRE-OPS-1' },
            channelName: { type: 'string', example: 'Fire Operations Channel 1' },
            frequency: { type: 'string', nullable: true, description: 'Radio frequency' },
            talkgroupId: { type: 'string', nullable: true, description: 'Digital talkgroup ID' },
            type: {
                type: 'string',
                enum: ['tactical', 'command', 'mutual-aid', 'dispatch', 'admin'],
            },
            agencies: {
                type: 'array',
                items: { type: 'string' },
                description: 'Agencies with access to this channel',
            },
            encryption: { type: 'boolean', description: 'Whether channel is encrypted' },
            recordingEnabled: { type: 'boolean', description: 'Whether transmissions are recorded' },
            priority: {
                type: 'integer',
                minimum: 1,
                maximum: 10,
                description: 'Channel priority for scanning',
            },
            active: { type: 'boolean', description: 'Whether channel is currently active' },
        },
        required: ['channelId', 'channelName', 'type', 'active'],
    };
};
exports.createRadioChannelSchema = createRadioChannelSchema;
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
const createRadioPatchSchema = () => {
    return {
        type: 'object',
        properties: {
            patchId: { type: 'string', format: 'uuid' },
            name: { type: 'string', description: 'Patch name', example: 'Fire-Police Interop' },
            channels: {
                type: 'array',
                items: { type: 'string' },
                description: 'Channels included in patch',
                minItems: 2,
            },
            createdBy: { type: 'string', description: 'User who created the patch' },
            createdAt: { type: 'string', format: 'date-time' },
            expiresAt: {
                type: 'string',
                format: 'date-time',
                nullable: true,
                description: 'Auto-expire time',
            },
            incidentId: {
                type: 'string',
                format: 'uuid',
                nullable: true,
                description: 'Associated incident',
            },
            active: { type: 'boolean', description: 'Whether patch is active' },
        },
        required: ['patchId', 'name', 'channels', 'createdBy', 'createdAt', 'active'],
    };
};
exports.createRadioPatchSchema = createRadioPatchSchema;
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
const createRadioQueryDocs = () => {
    return [
        {
            name: 'channel',
            required: false,
            description: 'Filter by radio channel',
            type: String,
        },
        {
            name: 'unitId',
            required: false,
            description: 'Filter by transmitting unit',
            type: String,
        },
        {
            name: 'startTime',
            required: false,
            description: 'Start time for log search (ISO 8601)',
            type: String,
        },
        {
            name: 'endTime',
            required: false,
            description: 'End time for log search (ISO 8601)',
            type: String,
        },
        {
            name: 'callId',
            required: false,
            description: 'Filter by associated call ID',
            type: String,
        },
        {
            name: 'includeTranscriptions',
            required: false,
            description: 'Include automatic transcriptions',
            type: Boolean,
        },
    ];
};
exports.createRadioQueryDocs = createRadioQueryDocs;
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
const createRadioOperationDoc = (operation) => {
    const operations = {
        log: {
            summary: 'Log radio transmission',
            description: 'Records radio transmission metadata with optional transcription',
            tags: ['Radio Communication'],
        },
        channels: {
            summary: 'List radio channels',
            description: 'Retrieves configured radio channels and talkgroups',
            tags: ['Radio Communication'],
        },
        patch: {
            summary: 'Create radio patch',
            description: 'Creates radio patch for multi-channel interoperability',
            tags: ['Radio Communication'],
        },
        unpatch: {
            summary: 'Remove radio patch',
            description: 'Removes an active radio patch',
            tags: ['Radio Communication'],
        },
        playback: {
            summary: 'Playback recording',
            description: 'Retrieves audio playback for recorded transmission',
            tags: ['Radio Communication'],
        },
    };
    return operations[operation] || { summary: operation, tags: ['Radio Communication'] };
};
exports.createRadioOperationDoc = createRadioOperationDoc;
// ============================================================================
// 6. CALL ROUTING API SCHEMAS
// ============================================================================
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
const createCallRoutingSchema = () => {
    return {
        type: 'object',
        properties: {
            callId: { type: 'string', format: 'uuid', description: 'Call to route' },
            targetPSAP: { type: 'string', description: 'Target PSAP identifier', example: 'PSAP-COUNTY-5' },
            routingReason: {
                type: 'string',
                enum: [
                    'jurisdiction',
                    'overload',
                    'specialized-service',
                    'caller-request',
                    'technical',
                    'backup',
                ],
                description: 'Reason for routing',
            },
            transferType: {
                type: 'string',
                enum: ['cold-transfer', 'warm-transfer', 'conference'],
                description: 'Type of transfer',
            },
            retainAudio: {
                type: 'boolean',
                description: 'Whether originating PSAP retains audio',
            },
            callbackNumber: {
                type: 'string',
                nullable: true,
                description: 'Callback number for caller',
            },
            callerInformed: {
                type: 'boolean',
                description: 'Whether caller was informed of transfer',
            },
            transferNotes: {
                type: 'string',
                description: 'Notes for receiving dispatcher',
                maxLength: 1000,
            },
            initiatedBy: { type: 'string', description: 'Dispatcher initiating transfer' },
        },
        required: ['callId', 'targetPSAP', 'routingReason', 'transferType', 'initiatedBy'],
    };
};
exports.createCallRoutingSchema = createCallRoutingSchema;
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
const createPSAPDirectorySchema = () => {
    return {
        type: 'object',
        properties: {
            psapId: { type: 'string', example: 'PSAP-COUNTY-5' },
            psapName: { type: 'string', example: 'County Emergency Communications' },
            jurisdiction: { type: 'string', example: 'County 5' },
            serviceArea: {
                type: 'object',
                description: 'GeoJSON polygon of service area',
            },
            capabilities: {
                type: 'array',
                items: { type: 'string' },
                example: ['text-to-911', 'video-calling', 'ng911'],
            },
            primaryPhone: { type: 'string', example: '+15551234567' },
            adminPhone: { type: 'string', example: '+15551234568' },
            transferPhone: { type: 'string', example: '+15551234569', description: 'Direct transfer line' },
            emailContact: { type: 'string', format: 'email' },
            operatingHours: { type: 'string', example: '24/7' },
            backupPSAP: {
                type: 'string',
                nullable: true,
                description: 'Backup PSAP for overflow',
            },
            active: { type: 'boolean', description: 'Whether PSAP is currently operational' },
        },
        required: ['psapId', 'psapName', 'jurisdiction', 'primaryPhone', 'active'],
    };
};
exports.createPSAPDirectorySchema = createPSAPDirectorySchema;
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
const createRoutingRulesSchema = () => {
    return {
        type: 'object',
        properties: {
            ruleId: { type: 'string', format: 'uuid' },
            ruleName: { type: 'string', example: 'Highway calls to State Police' },
            priority: {
                type: 'integer',
                description: 'Rule priority (higher = evaluated first)',
            },
            conditions: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        field: { type: 'string', example: 'location.address' },
                        operator: { type: 'string', enum: ['contains', 'equals', 'matches', 'in-area'] },
                        value: { type: 'string' },
                    },
                },
            },
            action: {
                type: 'object',
                properties: {
                    type: { type: 'string', enum: ['route', 'alert', 'tag', 'escalate'] },
                    targetPSAP: { type: 'string', nullable: true },
                    additionalActions: { type: 'array', items: { type: 'string' } },
                },
            },
            active: { type: 'boolean' },
            effectiveFrom: { type: 'string', format: 'date-time' },
            effectiveUntil: { type: 'string', format: 'date-time', nullable: true },
        },
        required: ['ruleId', 'ruleName', 'priority', 'conditions', 'action', 'active'],
    };
};
exports.createRoutingRulesSchema = createRoutingRulesSchema;
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
const createRoutingOperationDoc = (operation) => {
    const operations = {
        route: {
            summary: 'Route call to PSAP',
            description: 'Routes or transfers emergency call to another PSAP',
            tags: ['Call Routing'],
        },
        psaps: {
            summary: 'List PSAPs',
            description: 'Retrieves directory of available PSAPs with contact information',
            tags: ['Call Routing'],
        },
        rules: {
            summary: 'Manage routing rules',
            description: 'Creates or updates automatic routing rules',
            tags: ['Call Routing'],
        },
        evaluate: {
            summary: 'Evaluate routing',
            description: 'Evaluates routing rules for a call without executing transfer',
            tags: ['Call Routing'],
        },
    };
    return operations[operation] || { summary: operation, tags: ['Call Routing'] };
};
exports.createRoutingOperationDoc = createRoutingOperationDoc;
// ============================================================================
// 7. PRIORITY MANAGEMENT API SCHEMAS
// ============================================================================
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
const createPriorityMatrixSchema = () => {
    return {
        type: 'object',
        properties: {
            matrixId: { type: 'string', format: 'uuid' },
            name: { type: 'string', example: 'Fire Priority Matrix' },
            emergencyType: { type: 'string', example: 'fire' },
            priorityLevels: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        level: { type: 'integer', minimum: 1, maximum: 5 },
                        name: { type: 'string', example: 'Priority 1 - Life Threatening' },
                        description: { type: 'string' },
                        targetResponseTime: {
                            type: 'integer',
                            description: 'Target response time in seconds',
                        },
                        dispatchPriority: { type: 'string', enum: ['code-3', 'urgent', 'routine'] },
                        requiredUnits: {
                            type: 'object',
                            description: 'Minimum required units by type',
                            additionalProperties: { type: 'integer' },
                        },
                    },
                },
            },
            active: { type: 'boolean' },
            effectiveDate: { type: 'string', format: 'date-time' },
        },
        required: ['matrixId', 'name', 'emergencyType', 'priorityLevels', 'active'],
    };
};
exports.createPriorityMatrixSchema = createPriorityMatrixSchema;
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
const createPriorityOverrideSchema = () => {
    return {
        type: 'object',
        properties: {
            callId: { type: 'string', format: 'uuid' },
            originalPriority: { type: 'integer', minimum: 1, maximum: 5 },
            newPriority: { type: 'integer', minimum: 1, maximum: 5 },
            reason: {
                type: 'string',
                description: 'Reason for priority override',
                maxLength: 500,
            },
            overriddenBy: { type: 'string', description: 'Dispatcher making override' },
            supervisorApproval: {
                type: 'boolean',
                description: 'Whether supervisor approval obtained',
            },
            approvedBy: { type: 'string', nullable: true, description: 'Approving supervisor' },
            timestamp: { type: 'string', format: 'date-time' },
        },
        required: ['callId', 'originalPriority', 'newPriority', 'reason', 'overriddenBy', 'timestamp'],
    };
};
exports.createPriorityOverrideSchema = createPriorityOverrideSchema;
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
const createQueueManagementSchema = () => {
    return {
        type: 'object',
        properties: {
            queueId: { type: 'string', example: 'DISPATCH-QUEUE-FIRE' },
            queueName: { type: 'string', example: 'Fire Dispatch Queue' },
            calls: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        callId: { type: 'string', format: 'uuid' },
                        priority: { type: 'integer' },
                        emergencyType: { type: 'string' },
                        waitTime: { type: 'integer', description: 'Wait time in seconds' },
                        queuePosition: { type: 'integer' },
                    },
                },
            },
            totalCalls: { type: 'integer', description: 'Total calls in queue' },
            averageWaitTime: { type: 'integer', description: 'Average wait time in seconds' },
            longestWaitTime: { type: 'integer', description: 'Longest wait time in seconds' },
            thresholdExceeded: {
                type: 'boolean',
                description: 'Whether queue threshold exceeded',
            },
            lastUpdate: { type: 'string', format: 'date-time' },
        },
        required: ['queueId', 'queueName', 'calls', 'totalCalls', 'lastUpdate'],
    };
};
exports.createQueueManagementSchema = createQueueManagementSchema;
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
const createPriorityOperationDoc = (operation) => {
    const operations = {
        override: {
            summary: 'Override call priority',
            description: 'Manually overrides call priority with supervisor approval',
            tags: ['Priority Management'],
        },
        matrix: {
            summary: 'Get priority matrix',
            description: 'Retrieves priority matrix configuration for emergency type',
            tags: ['Priority Management'],
        },
        queue: {
            summary: 'Get dispatch queue',
            description: 'Retrieves current dispatch queue with priority ordering',
            tags: ['Priority Management'],
        },
        reorder: {
            summary: 'Reorder queue',
            description: 'Manually reorders dispatch queue',
            tags: ['Priority Management'],
        },
    };
    return operations[operation] || { summary: operation, tags: ['Priority Management'] };
};
exports.createPriorityOperationDoc = createPriorityOperationDoc;
// ============================================================================
// 8. GEOGRAPHIC ROUTING API SCHEMAS
// ============================================================================
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
const createGeographicZoneSchema = () => {
    return {
        type: 'object',
        properties: {
            zoneId: { type: 'string', format: 'uuid' },
            zoneName: { type: 'string', example: 'Fire District 5' },
            zoneType: {
                type: 'string',
                enum: ['fire-district', 'police-beat', 'ems-zone', 'jurisdiction', 'coverage-area'],
            },
            geometry: {
                type: 'object',
                description: 'GeoJSON polygon defining zone boundaries',
            },
            primaryUnits: {
                type: 'array',
                items: { type: 'string' },
                description: 'Primary units assigned to zone',
            },
            backupUnits: {
                type: 'array',
                items: { type: 'string' },
                description: 'Backup units for zone',
            },
            priority: {
                type: 'integer',
                description: 'Zone priority for routing decisions',
            },
            population: { type: 'integer', nullable: true, description: 'Zone population' },
            area: { type: 'number', nullable: true, description: 'Zone area in square kilometers' },
            active: { type: 'boolean', description: 'Whether zone is active' },
        },
        required: ['zoneId', 'zoneName', 'zoneType', 'geometry', 'active'],
    };
};
exports.createGeographicZoneSchema = createGeographicZoneSchema;
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
const createClosestUnitSchema = () => {
    return {
        type: 'object',
        properties: {
            targetLocation: {
                type: 'object',
                properties: {
                    latitude: { type: 'number' },
                    longitude: { type: 'number' },
                },
            },
            unitType: { type: 'string', nullable: true, description: 'Filter by unit type' },
            maxResults: { type: 'integer', minimum: 1, maximum: 20, description: 'Maximum results to return' },
            requireCapability: {
                type: 'string',
                nullable: true,
                description: 'Required unit capability',
            },
            results: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        unitId: { type: 'string' },
                        unitType: { type: 'string' },
                        status: { type: 'string' },
                        distance: { type: 'number', description: 'Distance in kilometers' },
                        estimatedTravelTime: { type: 'integer', description: 'ETA in seconds' },
                        currentLocation: {
                            type: 'object',
                            properties: {
                                latitude: { type: 'number' },
                                longitude: { type: 'number' },
                            },
                        },
                    },
                },
            },
        },
        required: ['targetLocation', 'results'],
    };
};
exports.createClosestUnitSchema = createClosestUnitSchema;
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
const createCoverageAnalysisSchema = () => {
    return {
        type: 'object',
        properties: {
            analysisId: { type: 'string', format: 'uuid' },
            timestamp: { type: 'string', format: 'date-time' },
            coverageType: {
                type: 'string',
                enum: ['current', 'projected', 'historical'],
            },
            zones: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        zoneId: { type: 'string' },
                        zoneName: { type: 'string' },
                        coveragePercentage: {
                            type: 'number',
                            minimum: 0,
                            maximum: 100,
                            description: 'Coverage percentage',
                        },
                        availableUnits: { type: 'integer' },
                        averageResponseTime: { type: 'number', description: 'Average response time in seconds' },
                        gapAreas: {
                            type: 'array',
                            items: { type: 'object', description: 'GeoJSON polygons of coverage gaps' },
                        },
                    },
                },
            },
            overallCoverage: { type: 'number', minimum: 0, maximum: 100 },
            recommendations: {
                type: 'array',
                items: { type: 'string' },
                description: 'Coverage improvement recommendations',
            },
        },
        required: ['analysisId', 'timestamp', 'coverageType', 'zones', 'overallCoverage'],
    };
};
exports.createCoverageAnalysisSchema = createCoverageAnalysisSchema;
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
const createGeographicQueryDocs = () => {
    return [
        {
            name: 'latitude',
            required: true,
            description: 'Target latitude',
            type: Number,
        },
        {
            name: 'longitude',
            required: true,
            description: 'Target longitude',
            type: Number,
        },
        {
            name: 'unitType',
            required: false,
            description: 'Filter by unit type',
            enum: ['engine', 'ladder', 'ambulance', 'rescue', 'police'],
        },
        {
            name: 'maxDistance',
            required: false,
            description: 'Maximum distance in kilometers',
            type: Number,
        },
        {
            name: 'maxResults',
            required: false,
            description: 'Maximum number of results',
            type: Number,
        },
        {
            name: 'includeUnavailable',
            required: false,
            description: 'Include unavailable units in results',
            type: Boolean,
        },
    ];
};
exports.createGeographicQueryDocs = createGeographicQueryDocs;
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
const createGeographicOperationDoc = (operation) => {
    const operations = {
        closest: {
            summary: 'Find closest units',
            description: 'Finds closest available units to a location with travel time estimates',
            tags: ['Geographic Routing'],
        },
        zones: {
            summary: 'Get geographic zones',
            description: 'Retrieves geographic zone definitions and assignments',
            tags: ['Geographic Routing'],
        },
        coverage: {
            summary: 'Analyze coverage',
            description: 'Analyzes current coverage by zone with gap identification',
            tags: ['Geographic Routing'],
        },
        optimize: {
            summary: 'Optimize unit placement',
            description: 'Provides recommendations for optimal unit placement',
            tags: ['Geographic Routing'],
        },
    };
    return operations[operation] || { summary: operation, tags: ['Geographic Routing'] };
};
exports.createGeographicOperationDoc = createGeographicOperationDoc;
// ============================================================================
// 9. COMMON RESPONSE HELPERS
// ============================================================================
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
const createDispatchSuccessResponse = (type, description) => {
    return {
        status: 200,
        description,
        type,
    };
};
exports.createDispatchSuccessResponse = createDispatchSuccessResponse;
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
const createDispatchErrorResponse = (statusCode) => {
    const errorMessages = {
        400: 'Bad Request - Invalid dispatch operation parameters',
        401: 'Unauthorized - Authentication required for dispatch operations',
        403: 'Forbidden - Insufficient dispatch authority',
        404: 'Not Found - Call, unit, or entity not found',
        409: 'Conflict - Unit already dispatched or operation conflict',
        422: 'Unprocessable Entity - Validation failed for dispatch operation',
        503: 'Service Unavailable - Dispatch system temporarily unavailable',
    };
    return {
        status: statusCode,
        description: errorMessages[statusCode] || 'Error',
    };
};
exports.createDispatchErrorResponse = createDispatchErrorResponse;
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
const createEventNotificationSchema = (eventType) => {
    return {
        type: 'object',
        properties: {
            eventId: { type: 'string', format: 'uuid' },
            eventType: { type: 'string', example: eventType },
            timestamp: { type: 'string', format: 'date-time' },
            source: { type: 'string', description: 'Event source system' },
            payload: {
                type: 'object',
                description: 'Event-specific payload',
                additionalProperties: true,
            },
            priority: { type: 'string', enum: ['low', 'medium', 'high', 'critical'] },
            subscriberIds: {
                type: 'array',
                items: { type: 'string' },
                description: 'Intended subscriber IDs',
            },
        },
        required: ['eventId', 'eventType', 'timestamp', 'payload'],
    };
};
exports.createEventNotificationSchema = createEventNotificationSchema;
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
const createDispatchMetricsSchema = () => {
    return {
        type: 'object',
        properties: {
            period: {
                type: 'object',
                properties: {
                    start: { type: 'string', format: 'date-time' },
                    end: { type: 'string', format: 'date-time' },
                },
            },
            callMetrics: {
                type: 'object',
                properties: {
                    totalCalls: { type: 'integer' },
                    averageCallDuration: { type: 'number', description: 'Average in seconds' },
                    abandonedCalls: { type: 'integer' },
                    averageAnswerTime: { type: 'number', description: 'Average in seconds' },
                },
            },
            dispatchMetrics: {
                type: 'object',
                properties: {
                    totalDispatches: { type: 'integer' },
                    averageDispatchTime: { type: 'number', description: 'Average in seconds' },
                    averageResponseTime: { type: 'number', description: 'Average in seconds' },
                    code3Dispatches: { type: 'integer' },
                },
            },
            unitMetrics: {
                type: 'object',
                properties: {
                    averageUtilization: { type: 'number', description: 'Percentage 0-100' },
                    totalAvailableHours: { type: 'number' },
                    totalDeployedHours: { type: 'number' },
                },
            },
        },
        required: ['period', 'callMetrics', 'dispatchMetrics', 'unitMetrics'],
    };
};
exports.createDispatchMetricsSchema = createDispatchMetricsSchema;
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
const createDispatchTag = (name, description) => {
    return {
        name,
        description,
    };
};
exports.createDispatchTag = createDispatchTag;
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
const createDispatchJWTScheme = () => {
    return {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT token obtained from authentication endpoint. Must include dispatch center permissions.',
    };
};
exports.createDispatchJWTScheme = createDispatchJWTScheme;
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
const createDispatchExternalDocs = (topic) => {
    return {
        url: `https://docs.whitecross.emergency/dispatch/${topic}`,
        description: `Comprehensive documentation for ${topic}`,
    };
};
exports.createDispatchExternalDocs = createDispatchExternalDocs;
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Emergency Calls
    createEmergencyCallIntakeSchema: exports.createEmergencyCallIntakeSchema,
    createEmergencyCallResponseSchema: exports.createEmergencyCallResponseSchema,
    createCallUpdateSchema: exports.createCallUpdateSchema,
    createCallFilterQueryDocs: exports.createCallFilterQueryDocs,
    createCallOperationDoc: exports.createCallOperationDoc,
    // Unit Dispatch
    createUnitDispatchSchema: exports.createUnitDispatchSchema,
    createUnitStatusSchema: exports.createUnitStatusSchema,
    createUnitStatusUpdateSchema: exports.createUnitStatusUpdateSchema,
    createUnitAvailabilityQueryDocs: exports.createUnitAvailabilityQueryDocs,
    createUnitDispatchOperationDoc: exports.createUnitDispatchOperationDoc,
    // CAD Integration
    createCADEventSchema: exports.createCADEventSchema,
    createCADIncidentSyncSchema: exports.createCADIncidentSyncSchema,
    createCADUnitAssignmentSchema: exports.createCADUnitAssignmentSchema,
    createCADStatusCodeSchema: exports.createCADStatusCodeSchema,
    createCADOperationDoc: exports.createCADOperationDoc,
    // AVL (Vehicle Location)
    createAVLPositionSchema: exports.createAVLPositionSchema,
    createAVLBreadcrumbSchema: exports.createAVLBreadcrumbSchema,
    createGeofenceSchema: exports.createGeofenceSchema,
    createAVLQueryDocs: exports.createAVLQueryDocs,
    createAVLOperationDoc: exports.createAVLOperationDoc,
    // Radio Communication
    createRadioTransmissionSchema: exports.createRadioTransmissionSchema,
    createRadioChannelSchema: exports.createRadioChannelSchema,
    createRadioPatchSchema: exports.createRadioPatchSchema,
    createRadioQueryDocs: exports.createRadioQueryDocs,
    createRadioOperationDoc: exports.createRadioOperationDoc,
    // Call Routing
    createCallRoutingSchema: exports.createCallRoutingSchema,
    createPSAPDirectorySchema: exports.createPSAPDirectorySchema,
    createRoutingRulesSchema: exports.createRoutingRulesSchema,
    createRoutingOperationDoc: exports.createRoutingOperationDoc,
    // Priority Management
    createPriorityMatrixSchema: exports.createPriorityMatrixSchema,
    createPriorityOverrideSchema: exports.createPriorityOverrideSchema,
    createQueueManagementSchema: exports.createQueueManagementSchema,
    createPriorityOperationDoc: exports.createPriorityOperationDoc,
    // Geographic Routing
    createGeographicZoneSchema: exports.createGeographicZoneSchema,
    createClosestUnitSchema: exports.createClosestUnitSchema,
    createCoverageAnalysisSchema: exports.createCoverageAnalysisSchema,
    createGeographicQueryDocs: exports.createGeographicQueryDocs,
    createGeographicOperationDoc: exports.createGeographicOperationDoc,
    // Common Responses & Utilities
    createDispatchSuccessResponse: exports.createDispatchSuccessResponse,
    createDispatchErrorResponse: exports.createDispatchErrorResponse,
    createEventNotificationSchema: exports.createEventNotificationSchema,
    createDispatchMetricsSchema: exports.createDispatchMetricsSchema,
    createDispatchTag: exports.createDispatchTag,
    createDispatchJWTScheme: exports.createDispatchJWTScheme,
    createDispatchExternalDocs: exports.createDispatchExternalDocs,
};
//# sourceMappingURL=dispatch-api-documentation.js.map