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
import {
  ApiProperty,
  ApiPropertyOptions,
  ApiResponseOptions,
  ApiOperationOptions,
  ApiParamOptions,
  ApiQueryOptions,
  ApiBodyOptions,
} from '@nestjs/swagger';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface IncidentSchema {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'assigned' | 'responding' | 'resolved' | 'closed';
  location: LocationSchema;
  reportedAt: string;
  respondingUnits?: string[];
}

interface LocationSchema {
  latitude: number;
  longitude: number;
  address?: string;
  jurisdiction?: string;
}

interface ResourceSchema {
  id: string;
  type: 'personnel' | 'vehicle' | 'equipment' | 'facility';
  status: 'available' | 'assigned' | 'unavailable' | 'maintenance';
  assignedIncident?: string;
  location?: LocationSchema;
}

interface CommandHierarchySchema {
  commanderId: string;
  role: string;
  level: number;
  subordinates: string[];
  authority: string[];
}

interface SituationReportSchema {
  timestamp: string;
  incidentId: string;
  status: string;
  resources: ResourceStatusSummary;
  updates: string[];
}

interface ResourceStatusSummary {
  total: number;
  available: number;
  assigned: number;
  unavailable: number;
}

interface MultiAgencyCoordinationSchema {
  agencyId: string;
  agencyName: string;
  contactPerson: string;
  sharedResources: string[];
  coordinationLevel: 'mutual-aid' | 'unified-command' | 'joint-operations';
}

interface DecisionSupportSchema {
  recommendationId: string;
  incidentId: string;
  recommendation: string;
  confidence: number;
  factors: string[];
  timestamp: string;
}

interface AnalyticsQuerySchema {
  startDate: string;
  endDate: string;
  metrics: string[];
  groupBy?: string;
  filters?: Record<string, any>;
}

// ============================================================================
// 1. INCIDENT MANAGEMENT API SCHEMAS
// ============================================================================

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
export const createIncidentCreationSchema = (
  includeLocation: boolean = true,
): Record<string, any> => {
  const properties: Record<string, any> = {
    type: {
      type: 'string',
      description: 'Type of incident',
      enum: ['fire', 'medical', 'accident', 'hazmat', 'rescue', 'other'],
      example: 'fire',
    },
    severity: {
      type: 'string',
      description: 'Incident severity level',
      enum: ['low', 'medium', 'high', 'critical'],
      example: 'high',
    },
    description: {
      type: 'string',
      description: 'Detailed incident description',
      minLength: 10,
      maxLength: 2000,
      example: 'Structure fire at commercial building with possible occupants',
    },
    reportedBy: {
      type: 'string',
      description: 'Person or system reporting the incident',
      example: 'Dispatcher-123',
    },
  };

  if (includeLocation) {
    properties.location = {
      type: 'object',
      required: ['latitude', 'longitude'],
      properties: {
        latitude: { type: 'number', minimum: -90, maximum: 90, example: 40.7128 },
        longitude: { type: 'number', minimum: -180, maximum: 180, example: -74.006 },
        address: { type: 'string', example: '123 Main St, New York, NY 10001' },
        jurisdiction: { type: 'string', example: 'District 5' },
      },
    };
  }

  return {
    type: 'object',
    properties,
    required: ['type', 'severity', 'description', 'reportedBy'],
  };
};

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
export const createIncidentResponseSchema = (
  includeResources: boolean = true,
): Record<string, any> => {
  const properties: Record<string, any> = {
    id: { type: 'string', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' },
    type: { type: 'string', example: 'fire' },
    severity: { type: 'string', enum: ['low', 'medium', 'high', 'critical'], example: 'high' },
    status: {
      type: 'string',
      enum: ['open', 'assigned', 'responding', 'resolved', 'closed'],
      example: 'responding',
    },
    description: { type: 'string', example: 'Structure fire at commercial building' },
    location: {
      type: 'object',
      properties: {
        latitude: { type: 'number', example: 40.7128 },
        longitude: { type: 'number', example: -74.006 },
        address: { type: 'string', example: '123 Main St, New York, NY 10001' },
        jurisdiction: { type: 'string', example: 'District 5' },
      },
    },
    reportedAt: { type: 'string', format: 'date-time', example: '2024-01-15T10:30:00Z' },
    reportedBy: { type: 'string', example: 'Dispatcher-123' },
    updatedAt: { type: 'string', format: 'date-time', example: '2024-01-15T10:45:00Z' },
  };

  if (includeResources) {
    properties.respondingUnits = {
      type: 'array',
      items: { type: 'string' },
      example: ['Engine-5', 'Ladder-12', 'Rescue-1'],
    };
    properties.assignedPersonnel = {
      type: 'array',
      items: { type: 'string' },
      example: ['FF-101', 'FF-202', 'CAPT-303'],
    };
  }

  return {
    type: 'object',
    properties,
    required: ['id', 'type', 'severity', 'status', 'description', 'location', 'reportedAt'],
  };
};

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
export const createIncidentUpdateSchema = (): Record<string, any> => {
  return {
    type: 'object',
    properties: {
      status: {
        type: 'string',
        enum: ['open', 'assigned', 'responding', 'resolved', 'closed'],
        description: 'New incident status',
      },
      severity: {
        type: 'string',
        enum: ['low', 'medium', 'high', 'critical'],
        description: 'Updated severity level',
      },
      notes: {
        type: 'string',
        description: 'Update notes or additional information',
        maxLength: 1000,
      },
      updatedBy: {
        type: 'string',
        description: 'User making the update',
        example: 'Commander-456',
      },
    },
  };
};

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
export const createIncidentFilterQueryDocs = (): ApiQueryOptions[] => {
  return [
    {
      name: 'status',
      required: false,
      description: 'Filter by incident status',
      enum: ['open', 'assigned', 'responding', 'resolved', 'closed'],
    },
    {
      name: 'severity',
      required: false,
      description: 'Filter by severity level',
      enum: ['low', 'medium', 'high', 'critical'],
    },
    {
      name: 'type',
      required: false,
      description: 'Filter by incident type',
      enum: ['fire', 'medical', 'accident', 'hazmat', 'rescue', 'other'],
    },
    {
      name: 'jurisdiction',
      required: false,
      description: 'Filter by jurisdiction',
      type: String,
      example: 'District 5',
    },
    {
      name: 'startDate',
      required: false,
      description: 'Filter incidents from this date (ISO 8601)',
      type: String,
      example: '2024-01-01T00:00:00Z',
    },
    {
      name: 'endDate',
      required: false,
      description: 'Filter incidents until this date (ISO 8601)',
      type: String,
      example: '2024-12-31T23:59:59Z',
    },
  ];
};

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
export const createIncidentOperationDoc = (operation: string): ApiOperationOptions => {
  const operations: Record<string, ApiOperationOptions> = {
    create: {
      summary: 'Create new incident',
      description:
        'Creates a new incident in the command center system with location, severity, and initial details',
      tags: ['Incidents'],
    },
    update: {
      summary: 'Update incident status',
      description: 'Updates incident status, severity, or adds notes to an existing incident',
      tags: ['Incidents'],
    },
    list: {
      summary: 'List incidents',
      description:
        'Retrieves a paginated list of incidents with optional filtering by status, severity, type, and date range',
      tags: ['Incidents'],
    },
    get: {
      summary: 'Get incident details',
      description: 'Retrieves complete details for a specific incident including responding units',
      tags: ['Incidents'],
    },
    close: {
      summary: 'Close incident',
      description: 'Marks an incident as closed with final notes and resolution details',
      tags: ['Incidents'],
    },
  };

  return operations[operation] || { summary: operation, tags: ['Incidents'] };
};

// ============================================================================
// 2. RESOURCE ALLOCATION API SCHEMAS
// ============================================================================

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
export const createResourceAllocationSchema = (): Record<string, any> => {
  return {
    type: 'object',
    properties: {
      incidentId: {
        type: 'string',
        format: 'uuid',
        description: 'Incident to allocate resources to',
        example: '123e4567-e89b-12d3-a456-426614174000',
      },
      resourceIds: {
        type: 'array',
        items: { type: 'string' },
        description: 'Array of resource IDs to allocate',
        example: ['Engine-5', 'Ladder-12', 'Rescue-1'],
        minItems: 1,
      },
      priority: {
        type: 'string',
        enum: ['normal', 'high', 'urgent'],
        description: 'Allocation priority level',
        example: 'high',
      },
      estimatedDuration: {
        type: 'integer',
        description: 'Estimated duration in minutes',
        minimum: 1,
        example: 120,
      },
      notes: {
        type: 'string',
        description: 'Additional allocation notes',
        maxLength: 500,
      },
    },
    required: ['incidentId', 'resourceIds', 'priority'],
  };
};

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
export const createResourceStatusSchema = (): Record<string, any> => {
  return {
    type: 'object',
    properties: {
      id: { type: 'string', example: 'Engine-5' },
      type: {
        type: 'string',
        enum: ['personnel', 'vehicle', 'equipment', 'facility'],
        example: 'vehicle',
      },
      status: {
        type: 'string',
        enum: ['available', 'assigned', 'unavailable', 'maintenance'],
        example: 'assigned',
      },
      assignedIncident: {
        type: 'string',
        format: 'uuid',
        nullable: true,
        example: '123e4567-e89b-12d3-a456-426614174000',
      },
      location: {
        type: 'object',
        properties: {
          latitude: { type: 'number', example: 40.7128 },
          longitude: { type: 'number', example: -74.006 },
          address: { type: 'string', example: 'Fire Station 5, Main St' },
        },
      },
      capabilities: {
        type: 'array',
        items: { type: 'string' },
        example: ['fire-suppression', 'rescue', 'hazmat-basic'],
      },
      personnelCount: {
        type: 'integer',
        description: 'Number of personnel in this resource',
        example: 4,
      },
      lastUpdate: {
        type: 'string',
        format: 'date-time',
        example: '2024-01-15T10:45:00Z',
      },
    },
    required: ['id', 'type', 'status', 'location', 'lastUpdate'],
  };
};

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
export const createResourceAvailabilityQueryDocs = (): ApiQueryOptions[] => {
  return [
    {
      name: 'type',
      required: false,
      description: 'Filter by resource type',
      enum: ['personnel', 'vehicle', 'equipment', 'facility'],
    },
    {
      name: 'status',
      required: false,
      description: 'Filter by resource status',
      enum: ['available', 'assigned', 'unavailable', 'maintenance'],
    },
    {
      name: 'capability',
      required: false,
      description: 'Filter by required capability',
      type: String,
      example: 'fire-suppression',
    },
    {
      name: 'latitude',
      required: false,
      description: 'Center latitude for proximity search',
      type: Number,
      example: 40.7128,
    },
    {
      name: 'longitude',
      required: false,
      description: 'Center longitude for proximity search',
      type: Number,
      example: -74.006,
    },
    {
      name: 'radius',
      required: false,
      description: 'Search radius in kilometers',
      type: Number,
      example: 10,
    },
  ];
};

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
export const createResourceReallocationSchema = (): Record<string, any> => {
  return {
    type: 'object',
    properties: {
      resourceId: {
        type: 'string',
        description: 'Resource to reallocate',
        example: 'Engine-5',
      },
      fromIncidentId: {
        type: 'string',
        format: 'uuid',
        description: 'Current incident assignment',
        example: '123e4567-e89b-12d3-a456-426614174000',
      },
      toIncidentId: {
        type: 'string',
        format: 'uuid',
        description: 'New incident assignment',
        example: '987e6543-e21b-98d7-b654-123456789abc',
      },
      reason: {
        type: 'string',
        description: 'Reason for reallocation',
        example: 'Higher priority incident requires specialized equipment',
      },
      authorizedBy: {
        type: 'string',
        description: 'Commander authorizing reallocation',
        example: 'Commander-789',
      },
    },
    required: ['resourceId', 'fromIncidentId', 'toIncidentId', 'reason', 'authorizedBy'],
  };
};

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
export const createResourceOperationDoc = (operation: string): ApiOperationOptions => {
  const operations: Record<string, ApiOperationOptions> = {
    allocate: {
      summary: 'Allocate resources to incident',
      description: 'Assigns one or more resources to an incident with priority and duration',
      tags: ['Resources'],
    },
    deallocate: {
      summary: 'Deallocate resources',
      description: 'Removes resource assignments from an incident',
      tags: ['Resources'],
    },
    status: {
      summary: 'Get resource status',
      description: 'Retrieves current status and location of a resource',
      tags: ['Resources'],
    },
    available: {
      summary: 'List available resources',
      description: 'Finds available resources by type, capability, or proximity',
      tags: ['Resources'],
    },
    reallocate: {
      summary: 'Reallocate resource',
      description: 'Moves a resource from one incident to another',
      tags: ['Resources'],
    },
  };

  return operations[operation] || { summary: operation, tags: ['Resources'] };
};

// ============================================================================
// 3. REAL-TIME STATUS API SCHEMAS
// ============================================================================

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
export const createRealTimeStatusSchema = (): Record<string, any> => {
  return {
    type: 'object',
    properties: {
      entityType: {
        type: 'string',
        enum: ['incident', 'resource', 'personnel', 'facility'],
        description: 'Type of entity being updated',
      },
      entityId: {
        type: 'string',
        description: 'Unique identifier of the entity',
      },
      status: {
        type: 'string',
        description: 'New status value',
      },
      location: {
        type: 'object',
        nullable: true,
        properties: {
          latitude: { type: 'number' },
          longitude: { type: 'number' },
        },
      },
      metadata: {
        type: 'object',
        description: 'Additional status metadata',
        additionalProperties: true,
      },
      timestamp: {
        type: 'string',
        format: 'date-time',
        description: 'Timestamp of status update',
      },
    },
    required: ['entityType', 'entityId', 'status', 'timestamp'],
  };
};

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
export const createDashboardDataSchema = (): Record<string, any> => {
  return {
    type: 'object',
    properties: {
      timestamp: { type: 'string', format: 'date-time', example: '2024-01-15T10:45:00Z' },
      activeIncidents: {
        type: 'object',
        properties: {
          total: { type: 'integer', example: 15 },
          critical: { type: 'integer', example: 2 },
          high: { type: 'integer', example: 5 },
          medium: { type: 'integer', example: 6 },
          low: { type: 'integer', example: 2 },
        },
      },
      resources: {
        type: 'object',
        properties: {
          total: { type: 'integer', example: 50 },
          available: { type: 'integer', example: 30 },
          assigned: { type: 'integer', example: 18 },
          unavailable: { type: 'integer', example: 2 },
        },
      },
      personnel: {
        type: 'object',
        properties: {
          onDuty: { type: 'integer', example: 120 },
          deployed: { type: 'integer', example: 45 },
          available: { type: 'integer', example: 75 },
        },
      },
      recentIncidents: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            type: { type: 'string' },
            severity: { type: 'string' },
            status: { type: 'string' },
            reportedAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
    required: ['timestamp', 'activeIncidents', 'resources', 'personnel'],
  };
};

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
export const createWebSocketEventSchema = (eventType: string): Record<string, any> => {
  return {
    type: 'object',
    properties: {
      event: {
        type: 'string',
        description: 'Event type identifier',
        example: eventType,
      },
      data: {
        type: 'object',
        description: 'Event payload data',
        additionalProperties: true,
      },
      timestamp: {
        type: 'string',
        format: 'date-time',
        description: 'Event timestamp',
      },
      sequenceId: {
        type: 'integer',
        description: 'Sequence number for ordering',
      },
    },
    required: ['event', 'data', 'timestamp'],
  };
};

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
export const createRealTimeOperationDoc = (operation: string): ApiOperationOptions => {
  const operations: Record<string, ApiOperationOptions> = {
    dashboard: {
      summary: 'Get command center dashboard',
      description:
        'Retrieves real-time dashboard data including active incidents, resource status, and personnel availability',
      tags: ['Real-Time Status'],
    },
    subscribe: {
      summary: 'Subscribe to real-time updates',
      description: 'Establishes WebSocket connection for real-time status updates',
      tags: ['Real-Time Status'],
    },
    status: {
      summary: 'Update entity status',
      description: 'Updates real-time status for incidents, resources, or personnel',
      tags: ['Real-Time Status'],
    },
  };

  return operations[operation] || { summary: operation, tags: ['Real-Time Status'] };
};

// ============================================================================
// 4. REPORTING AND ANALYTICS API SCHEMAS
// ============================================================================

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
export const createAnalyticsQuerySchema = (): Record<string, any> => {
  return {
    type: 'object',
    properties: {
      reportType: {
        type: 'string',
        enum: ['incident-summary', 'resource-utilization', 'response-times', 'performance'],
        description: 'Type of analytics report',
      },
      startDate: {
        type: 'string',
        format: 'date-time',
        description: 'Start date for analytics period',
        example: '2024-01-01T00:00:00Z',
      },
      endDate: {
        type: 'string',
        format: 'date-time',
        description: 'End date for analytics period',
        example: '2024-12-31T23:59:59Z',
      },
      groupBy: {
        type: 'string',
        enum: ['day', 'week', 'month', 'incident-type', 'jurisdiction'],
        description: 'Grouping dimension for analytics',
      },
      metrics: {
        type: 'array',
        items: { type: 'string' },
        description: 'Metrics to include in report',
        example: ['total-incidents', 'average-response-time', 'resource-utilization'],
      },
      filters: {
        type: 'object',
        description: 'Additional filters for analytics',
        additionalProperties: true,
      },
    },
    required: ['reportType', 'startDate', 'endDate'],
  };
};

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
export const createIncidentStatisticsSchema = (): Record<string, any> => {
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
      totalIncidents: { type: 'integer', example: 250 },
      byType: {
        type: 'object',
        additionalProperties: { type: 'integer' },
        example: { fire: 50, medical: 120, accident: 60, hazmat: 10, rescue: 10 },
      },
      bySeverity: {
        type: 'object',
        properties: {
          critical: { type: 'integer', example: 15 },
          high: { type: 'integer', example: 80 },
          medium: { type: 'integer', example: 100 },
          low: { type: 'integer', example: 55 },
        },
      },
      averageResponseTime: {
        type: 'number',
        description: 'Average response time in minutes',
        example: 6.5,
      },
      averageResolutionTime: {
        type: 'number',
        description: 'Average resolution time in minutes',
        example: 45.3,
      },
      trends: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            date: { type: 'string', format: 'date' },
            count: { type: 'integer' },
          },
        },
      },
    },
    required: ['period', 'totalIncidents', 'byType', 'bySeverity'],
  };
};

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
export const createResourceUtilizationSchema = (): Record<string, any> => {
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
      totalResources: { type: 'integer', example: 50 },
      utilizationRate: {
        type: 'number',
        description: 'Overall utilization rate percentage',
        minimum: 0,
        maximum: 100,
        example: 68.5,
      },
      byType: {
        type: 'object',
        additionalProperties: {
          type: 'object',
          properties: {
            total: { type: 'integer' },
            utilized: { type: 'integer' },
            utilizationRate: { type: 'number' },
          },
        },
      },
      peakUtilization: {
        type: 'object',
        properties: {
          timestamp: { type: 'string', format: 'date-time' },
          rate: { type: 'number', example: 92.5 },
        },
      },
      averageDeploymentDuration: {
        type: 'number',
        description: 'Average deployment duration in minutes',
        example: 78.3,
      },
    },
    required: ['period', 'totalResources', 'utilizationRate'],
  };
};

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
export const createReportingQueryDocs = (): ApiQueryOptions[] => {
  return [
    {
      name: 'reportType',
      required: true,
      description: 'Type of report to generate',
      enum: ['incident-summary', 'resource-utilization', 'response-times', 'performance'],
    },
    {
      name: 'startDate',
      required: true,
      description: 'Report start date (ISO 8601)',
      type: String,
      example: '2024-01-01T00:00:00Z',
    },
    {
      name: 'endDate',
      required: true,
      description: 'Report end date (ISO 8601)',
      type: String,
      example: '2024-12-31T23:59:59Z',
    },
    {
      name: 'format',
      required: false,
      description: 'Report output format',
      enum: ['json', 'pdf', 'csv', 'excel'],
    },
    {
      name: 'groupBy',
      required: false,
      description: 'Grouping dimension',
      enum: ['day', 'week', 'month', 'incident-type', 'jurisdiction'],
    },
  ];
};

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
export const createReportingOperationDoc = (operation: string): ApiOperationOptions => {
  const operations: Record<string, ApiOperationOptions> = {
    statistics: {
      summary: 'Get incident statistics',
      description:
        'Generates statistical analysis of incidents for a specified period with breakdown by type and severity',
      tags: ['Reporting & Analytics'],
    },
    utilization: {
      summary: 'Get resource utilization report',
      description: 'Analyzes resource utilization rates, peak times, and deployment patterns',
      tags: ['Reporting & Analytics'],
    },
    performance: {
      summary: 'Get performance metrics',
      description: 'Retrieves performance metrics including response times and resolution rates',
      tags: ['Reporting & Analytics'],
    },
    export: {
      summary: 'Export report',
      description: 'Exports analytics report in specified format (PDF, CSV, Excel)',
      tags: ['Reporting & Analytics'],
    },
  };

  return operations[operation] || { summary: operation, tags: ['Reporting & Analytics'] };
};

// ============================================================================
// 5. MULTI-AGENCY COORDINATION API SCHEMAS
// ============================================================================

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
export const createMultiAgencyCoordinationSchema = (): Record<string, any> => {
  return {
    type: 'object',
    properties: {
      incidentId: {
        type: 'string',
        format: 'uuid',
        description: 'Incident requiring multi-agency coordination',
      },
      agencyIds: {
        type: 'array',
        items: { type: 'string' },
        description: 'List of agency IDs to coordinate with',
        example: ['FD-CITY', 'PD-COUNTY', 'EMS-REGIONAL'],
      },
      coordinationType: {
        type: 'string',
        enum: ['mutual-aid', 'unified-command', 'joint-operations'],
        description: 'Type of multi-agency coordination',
      },
      requestedResources: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            resourceType: { type: 'string' },
            quantity: { type: 'integer' },
            capabilities: { type: 'array', items: { type: 'string' } },
          },
        },
      },
      priority: {
        type: 'string',
        enum: ['routine', 'urgent', 'emergency'],
        description: 'Priority level for coordination request',
      },
      notes: {
        type: 'string',
        maxLength: 1000,
        description: 'Additional coordination notes',
      },
    },
    required: ['incidentId', 'agencyIds', 'coordinationType', 'priority'],
  };
};

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
export const createAgencyInformationSchema = (): Record<string, any> => {
  return {
    type: 'object',
    properties: {
      agencyId: { type: 'string', example: 'FD-CITY' },
      agencyName: { type: 'string', example: 'City Fire Department' },
      agencyType: {
        type: 'string',
        enum: ['fire', 'police', 'ems', 'hazmat', 'rescue', 'emergency-management'],
      },
      jurisdiction: { type: 'string', example: 'City of Springfield' },
      contactPerson: { type: 'string', example: 'Chief John Smith' },
      contactPhone: { type: 'string', example: '+1-555-0100' },
      contactEmail: { type: 'string', format: 'email', example: 'chief@cityfd.gov' },
      availableResources: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            resourceType: { type: 'string' },
            quantity: { type: 'integer' },
            capabilities: { type: 'array', items: { type: 'string' } },
          },
        },
      },
      mutualAidAgreements: {
        type: 'array',
        items: { type: 'string' },
        description: 'List of agencies with mutual aid agreements',
      },
      status: {
        type: 'string',
        enum: ['active', 'on-standby', 'unavailable'],
        description: 'Current agency availability status',
      },
    },
    required: ['agencyId', 'agencyName', 'agencyType', 'jurisdiction', 'contactPerson'],
  };
};

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
export const createSharedResourceSchema = (): Record<string, any> => {
  return {
    type: 'object',
    properties: {
      resourceId: { type: 'string', example: 'HAZMAT-12' },
      owningAgency: { type: 'string', example: 'FD-COUNTY' },
      borrowingAgency: { type: 'string', example: 'FD-CITY' },
      incidentId: { type: 'string', format: 'uuid' },
      sharedAt: { type: 'string', format: 'date-time' },
      expectedReturn: {
        type: 'string',
        format: 'date-time',
        nullable: true,
        description: 'Expected return timestamp',
      },
      actualReturn: {
        type: 'string',
        format: 'date-time',
        nullable: true,
        description: 'Actual return timestamp',
      },
      status: {
        type: 'string',
        enum: ['active', 'returned', 'extended'],
        description: 'Current sharing status',
      },
      notes: { type: 'string', maxLength: 500 },
    },
    required: ['resourceId', 'owningAgency', 'borrowingAgency', 'incidentId', 'sharedAt'],
  };
};

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
export const createMultiAgencyOperationDoc = (operation: string): ApiOperationOptions => {
  const operations: Record<string, ApiOperationOptions> = {
    coordinate: {
      summary: 'Request multi-agency coordination',
      description:
        'Initiates multi-agency coordination for an incident with mutual aid or unified command',
      tags: ['Multi-Agency Coordination'],
    },
    agencies: {
      summary: 'List coordinating agencies',
      description: 'Retrieves list of agencies available for coordination',
      tags: ['Multi-Agency Coordination'],
    },
    shareResource: {
      summary: 'Share resource with agency',
      description: 'Shares a resource with another agency through mutual aid',
      tags: ['Multi-Agency Coordination'],
    },
    returnResource: {
      summary: 'Return shared resource',
      description: 'Returns a shared resource to its owning agency',
      tags: ['Multi-Agency Coordination'],
    },
  };

  return operations[operation] || { summary: operation, tags: ['Multi-Agency Coordination'] };
};

// ============================================================================
// 6. COMMAND HIERARCHY API SCHEMAS
// ============================================================================

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
export const createCommandStructureSchema = (): Record<string, any> => {
  return {
    type: 'object',
    properties: {
      incidentId: { type: 'string', format: 'uuid' },
      commandStructure: {
        type: 'object',
        properties: {
          incidentCommander: {
            type: 'object',
            properties: {
              userId: { type: 'string', example: 'CMD-789' },
              name: { type: 'string', example: 'Battalion Chief Smith' },
              rank: { type: 'string', example: 'Battalion Chief' },
              assignedAt: { type: 'string', format: 'date-time' },
            },
          },
          sections: {
            type: 'object',
            properties: {
              operations: {
                type: 'object',
                properties: {
                  chief: { type: 'string', example: 'OPS-101' },
                  divisions: { type: 'array', items: { type: 'object' } },
                },
              },
              planning: {
                type: 'object',
                properties: {
                  chief: { type: 'string', example: 'PLN-102' },
                  units: { type: 'array', items: { type: 'object' } },
                },
              },
              logistics: {
                type: 'object',
                properties: {
                  chief: { type: 'string', example: 'LOG-103' },
                  branches: { type: 'array', items: { type: 'object' } },
                },
              },
              finance: {
                type: 'object',
                properties: {
                  chief: { type: 'string', example: 'FIN-104' },
                  units: { type: 'array', items: { type: 'object' } },
                },
              },
            },
          },
        },
      },
      chainOfCommand: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            level: { type: 'integer' },
            role: { type: 'string' },
            userId: { type: 'string' },
            name: { type: 'string' },
          },
        },
      },
      updatedAt: { type: 'string', format: 'date-time' },
    },
    required: ['incidentId', 'commandStructure', 'chainOfCommand'],
  };
};

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
export const createCommandAssignmentSchema = (): Record<string, any> => {
  return {
    type: 'object',
    properties: {
      incidentId: { type: 'string', format: 'uuid' },
      role: {
        type: 'string',
        enum: [
          'incident-commander',
          'operations-chief',
          'planning-chief',
          'logistics-chief',
          'finance-chief',
        ],
        description: 'Command role to assign',
      },
      userId: {
        type: 'string',
        description: 'User ID to assign to role',
        example: 'CMD-789',
      },
      assignedBy: {
        type: 'string',
        description: 'User ID of assigning authority',
        example: 'CMD-001',
      },
      notes: {
        type: 'string',
        maxLength: 500,
        description: 'Assignment notes',
      },
    },
    required: ['incidentId', 'role', 'userId', 'assignedBy'],
  };
};

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
export const createAuthorityDelegationSchema = (): Record<string, any> => {
  return {
    type: 'object',
    properties: {
      fromUserId: { type: 'string', description: 'User delegating authority' },
      toUserId: { type: 'string', description: 'User receiving authority' },
      authorityScope: {
        type: 'array',
        items: { type: 'string' },
        description: 'List of authorities being delegated',
        example: ['resource-allocation', 'tactical-decisions', 'multi-agency-coordination'],
      },
      incidentId: {
        type: 'string',
        format: 'uuid',
        nullable: true,
        description: 'Specific incident (null for general delegation)',
      },
      validFrom: { type: 'string', format: 'date-time' },
      validUntil: {
        type: 'string',
        format: 'date-time',
        nullable: true,
        description: 'Expiration time (null for indefinite)',
      },
      reason: { type: 'string', description: 'Reason for delegation' },
    },
    required: ['fromUserId', 'toUserId', 'authorityScope', 'validFrom', 'reason'],
  };
};

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
export const createCommandHierarchyOperationDoc = (operation: string): ApiOperationOptions => {
  const operations: Record<string, ApiOperationOptions> = {
    structure: {
      summary: 'Get command structure',
      description: 'Retrieves the incident command structure and chain of command',
      tags: ['Command Hierarchy'],
    },
    assign: {
      summary: 'Assign command role',
      description: 'Assigns a user to a command role in the incident structure',
      tags: ['Command Hierarchy'],
    },
    delegate: {
      summary: 'Delegate authority',
      description: 'Delegates specific authorities from one commander to another',
      tags: ['Command Hierarchy'],
    },
    transfer: {
      summary: 'Transfer command',
      description: 'Transfers incident command from one commander to another',
      tags: ['Command Hierarchy'],
    },
  };

  return operations[operation] || { summary: operation, tags: ['Command Hierarchy'] };
};

// ============================================================================
// 7. SITUATION AWARENESS API SCHEMAS
// ============================================================================

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
export const createSituationReportSchema = (): Record<string, any> => {
  return {
    type: 'object',
    properties: {
      reportId: { type: 'string', format: 'uuid' },
      incidentId: { type: 'string', format: 'uuid' },
      timestamp: { type: 'string', format: 'date-time' },
      reportType: {
        type: 'string',
        enum: ['initial', 'progress', 'final'],
        description: 'Type of situation report',
      },
      situation: {
        type: 'object',
        properties: {
          summary: { type: 'string', description: 'Brief situation summary' },
          conditions: { type: 'string', description: 'Current conditions' },
          hazards: { type: 'array', items: { type: 'string' }, description: 'Identified hazards' },
          weatherImpact: { type: 'string', nullable: true },
        },
      },
      resources: {
        type: 'object',
        properties: {
          deployed: { type: 'integer', description: 'Number of deployed resources' },
          enRoute: { type: 'integer', description: 'Resources en route' },
          requested: { type: 'integer', description: 'Additional resources requested' },
        },
      },
      actionsTaken: {
        type: 'array',
        items: { type: 'string' },
        description: 'Actions taken since last report',
      },
      plannedActions: {
        type: 'array',
        items: { type: 'string' },
        description: 'Planned next actions',
      },
      anticipatedNeeds: {
        type: 'array',
        items: { type: 'string' },
        description: 'Anticipated resource or support needs',
      },
      submittedBy: { type: 'string', description: 'User submitting report' },
    },
    required: ['incidentId', 'timestamp', 'reportType', 'situation', 'submittedBy'],
  };
};

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
export const createTacticalMapSchema = (): Record<string, any> => {
  return {
    type: 'object',
    properties: {
      incidentId: { type: 'string', format: 'uuid' },
      mapLayers: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            layerId: { type: 'string' },
            layerType: {
              type: 'string',
              enum: ['incident-perimeter', 'resources', 'hazards', 'zones', 'infrastructure'],
            },
            visible: { type: 'boolean' },
            features: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  type: { type: 'string' },
                  geometry: { type: 'object' },
                  properties: { type: 'object' },
                },
              },
            },
          },
        },
      },
      centerPoint: {
        type: 'object',
        properties: {
          latitude: { type: 'number' },
          longitude: { type: 'number' },
        },
      },
      zoomLevel: { type: 'integer', minimum: 1, maximum: 20 },
      lastUpdate: { type: 'string', format: 'date-time' },
    },
    required: ['incidentId', 'mapLayers', 'centerPoint'],
  };
};

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
export const createHazardAssessmentSchema = (): Record<string, any> => {
  return {
    type: 'object',
    properties: {
      assessmentId: { type: 'string', format: 'uuid' },
      incidentId: { type: 'string', format: 'uuid' },
      timestamp: { type: 'string', format: 'date-time' },
      hazards: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            hazardType: {
              type: 'string',
              enum: ['fire', 'structural-collapse', 'hazmat', 'electrical', 'environmental'],
            },
            severity: { type: 'string', enum: ['low', 'moderate', 'high', 'extreme'] },
            location: {
              type: 'object',
              properties: { latitude: { type: 'number' }, longitude: { type: 'number' } },
            },
            description: { type: 'string' },
            mitigationActions: { type: 'array', items: { type: 'string' } },
          },
        },
      },
      overallRiskLevel: { type: 'string', enum: ['low', 'moderate', 'high', 'extreme'] },
      recommendations: { type: 'array', items: { type: 'string' } },
      assessedBy: { type: 'string', description: 'User who performed assessment' },
    },
    required: ['incidentId', 'timestamp', 'hazards', 'overallRiskLevel', 'assessedBy'],
  };
};

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
export const createSituationAwarenessOperationDoc = (operation: string): ApiOperationOptions => {
  const operations: Record<string, ApiOperationOptions> = {
    report: {
      summary: 'Submit situation report',
      description:
        'Submits a situation report with current status, actions taken, and planned actions',
      tags: ['Situation Awareness'],
    },
    tacticalMap: {
      summary: 'Get tactical map',
      description: 'Retrieves tactical map data with incident perimeter, resources, and hazards',
      tags: ['Situation Awareness'],
    },
    hazardAssessment: {
      summary: 'Submit hazard assessment',
      description: 'Submits hazard assessment with identified risks and mitigation actions',
      tags: ['Situation Awareness'],
    },
    timeline: {
      summary: 'Get incident timeline',
      description: 'Retrieves chronological timeline of incident events and actions',
      tags: ['Situation Awareness'],
    },
  };

  return operations[operation] || { summary: operation, tags: ['Situation Awareness'] };
};

// ============================================================================
// 8. DECISION SUPPORT API SCHEMAS
// ============================================================================

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
export const createDecisionRecommendationSchema = (): Record<string, any> => {
  return {
    type: 'object',
    properties: {
      recommendationId: { type: 'string', format: 'uuid' },
      incidentId: { type: 'string', format: 'uuid' },
      timestamp: { type: 'string', format: 'date-time' },
      category: {
        type: 'string',
        enum: ['resource-allocation', 'tactical-approach', 'evacuation', 'containment', 'mutual-aid'],
        description: 'Category of decision',
      },
      recommendation: {
        type: 'string',
        description: 'Detailed recommendation text',
      },
      rationale: {
        type: 'string',
        description: 'Reasoning behind recommendation',
      },
      confidence: {
        type: 'number',
        minimum: 0,
        maximum: 1,
        description: 'Confidence score (0-1)',
        example: 0.85,
      },
      factors: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            factor: { type: 'string' },
            weight: { type: 'number' },
            value: { type: 'string' },
          },
        },
        description: 'Factors considered in recommendation',
      },
      alternatives: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            option: { type: 'string' },
            pros: { type: 'array', items: { type: 'string' } },
            cons: { type: 'array', items: { type: 'string' } },
          },
        },
      },
      priority: { type: 'string', enum: ['low', 'medium', 'high', 'critical'] },
    },
    required: ['incidentId', 'timestamp', 'category', 'recommendation', 'confidence'],
  };
};

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
export const createDecisionQuerySchema = (): Record<string, any> => {
  return {
    type: 'object',
    properties: {
      incidentId: { type: 'string', format: 'uuid' },
      decisionCategory: {
        type: 'string',
        enum: ['resource-allocation', 'tactical-approach', 'evacuation', 'containment', 'mutual-aid'],
      },
      currentSituation: {
        type: 'object',
        properties: {
          incidentType: { type: 'string' },
          severity: { type: 'string' },
          availableResources: { type: 'array', items: { type: 'string' } },
          constraints: { type: 'array', items: { type: 'string' } },
          objectives: { type: 'array', items: { type: 'string' } },
        },
      },
      preferredOutcomes: {
        type: 'array',
        items: { type: 'string' },
        description: 'Desired outcomes in order of priority',
      },
    },
    required: ['incidentId', 'decisionCategory', 'currentSituation'],
  };
};

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
export const createPredictiveAnalysisSchema = (): Record<string, any> => {
  return {
    type: 'object',
    properties: {
      analysisId: { type: 'string', format: 'uuid' },
      incidentId: { type: 'string', format: 'uuid' },
      timestamp: { type: 'string', format: 'date-time' },
      predictionType: {
        type: 'string',
        enum: ['spread-rate', 'resource-demand', 'duration', 'escalation-risk'],
      },
      predictions: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            timeHorizon: { type: 'string', description: 'Prediction time (e.g., "30 minutes")' },
            prediction: { type: 'string', description: 'Predicted outcome' },
            probability: { type: 'number', minimum: 0, maximum: 1 },
            confidence: { type: 'number', minimum: 0, maximum: 1 },
          },
        },
      },
      basedOn: {
        type: 'array',
        items: { type: 'string' },
        description: 'Data sources used for prediction',
      },
      warnings: {
        type: 'array',
        items: { type: 'string' },
        description: 'Warnings or caveats about predictions',
      },
    },
    required: ['incidentId', 'timestamp', 'predictionType', 'predictions'],
  };
};

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
export const createDecisionSupportOperationDoc = (operation: string): ApiOperationOptions => {
  const operations: Record<string, ApiOperationOptions> = {
    recommend: {
      summary: 'Get decision recommendation',
      description:
        'Provides AI-powered decision recommendations based on current situation and objectives',
      tags: ['Decision Support'],
    },
    predict: {
      summary: 'Get predictive analysis',
      description: 'Generates predictive analysis for incident progression and resource needs',
      tags: ['Decision Support'],
    },
    alternatives: {
      summary: 'Analyze alternatives',
      description: 'Analyzes multiple decision alternatives with pros, cons, and risk assessment',
      tags: ['Decision Support'],
    },
    similar: {
      summary: 'Find similar incidents',
      description: 'Finds historically similar incidents and their outcomes for reference',
      tags: ['Decision Support'],
    },
  };

  return operations[operation] || { summary: operation, tags: ['Decision Support'] };
};

// ============================================================================
// 9. COMMON RESPONSE HELPERS
// ============================================================================

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
export const createCommandSuccessResponse = (
  type: Type<any>,
  description: string,
): ApiResponseOptions => {
  return {
    status: 200,
    description,
    type,
  };
};

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
export const createCommandErrorResponse = (statusCode: number): ApiResponseOptions => {
  const errorMessages: Record<number, string> = {
    400: 'Bad Request - Invalid command center operation parameters',
    401: 'Unauthorized - Authentication required for command operations',
    403: 'Forbidden - Insufficient command authority',
    404: 'Not Found - Incident, resource, or entity not found',
    409: 'Conflict - Resource already allocated or command conflict',
    422: 'Unprocessable Entity - Validation failed for command operation',
    503: 'Service Unavailable - Command center temporarily unavailable',
  };

  return {
    status: statusCode,
    description: errorMessages[statusCode] || 'Error',
  };
};

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
export const createBatchOperationResponse = (operationType: string): Record<string, any> => {
  return {
    type: 'object',
    properties: {
      operationType: { type: 'string', example: operationType },
      totalRequested: { type: 'integer', description: 'Total operations requested' },
      successful: { type: 'integer', description: 'Successfully completed operations' },
      failed: { type: 'integer', description: 'Failed operations' },
      results: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            status: { type: 'string', enum: ['success', 'failure'] },
            message: { type: 'string' },
            data: { type: 'object', nullable: true },
          },
        },
      },
      timestamp: { type: 'string', format: 'date-time' },
    },
    required: ['operationType', 'totalRequested', 'successful', 'failed', 'results', 'timestamp'],
  };
};

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
export const createAuditTrailSchema = (): Record<string, any> => {
  return {
    type: 'object',
    properties: {
      auditId: { type: 'string', format: 'uuid' },
      timestamp: { type: 'string', format: 'date-time' },
      userId: { type: 'string', description: 'User who performed action' },
      action: { type: 'string', description: 'Action performed' },
      entityType: { type: 'string', description: 'Type of entity affected' },
      entityId: { type: 'string', description: 'ID of affected entity' },
      changes: {
        type: 'object',
        properties: {
          before: { type: 'object', nullable: true },
          after: { type: 'object', nullable: true },
        },
      },
      ipAddress: { type: 'string', nullable: true },
      userAgent: { type: 'string', nullable: true },
    },
    required: ['auditId', 'timestamp', 'userId', 'action', 'entityType', 'entityId'],
  };
};

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
export const createNotificationSchema = (notificationType: string): Record<string, any> => {
  return {
    type: 'object',
    properties: {
      notificationId: { type: 'string', format: 'uuid' },
      type: { type: 'string', example: notificationType },
      priority: { type: 'string', enum: ['low', 'medium', 'high', 'urgent'] },
      title: { type: 'string', description: 'Notification title' },
      message: { type: 'string', description: 'Notification message' },
      relatedEntity: {
        type: 'object',
        properties: {
          entityType: { type: 'string' },
          entityId: { type: 'string' },
        },
      },
      recipients: {
        type: 'array',
        items: { type: 'string' },
        description: 'User IDs of notification recipients',
      },
      timestamp: { type: 'string', format: 'date-time' },
      expiresAt: { type: 'string', format: 'date-time', nullable: true },
      actionRequired: { type: 'boolean', description: 'Whether action is required' },
      actionUrl: { type: 'string', nullable: true, description: 'URL for action' },
    },
    required: ['notificationId', 'type', 'priority', 'title', 'message', 'timestamp'],
  };
};

// ============================================================================
// 10. SECURITY AND AUTHENTICATION SCHEMAS
// ============================================================================

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
export const createCommandJWTScheme = (): Record<string, any> => {
  return {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
    description:
      'JWT token obtained from authentication endpoint. Must include command center permissions.',
  };
};

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
export const createRoleRequirementDoc = (requiredRoles: string[]): string => {
  return `**Required Roles:** ${requiredRoles.join(', ')}\n\nThis operation requires one of the listed command center roles with appropriate authority level.`;
};

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
export const createPermissionDoc = (permissions: string[]): string => {
  return `**Required Permissions:**\n${permissions.map((p) => `- ${p}`).join('\n')}\n\nUser must have all listed permissions to perform this operation.`;
};

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
export const createCommandTag = (name: string, description: string): Record<string, any> => {
  return {
    name,
    description,
  };
};

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
export const createCommandExternalDocs = (topic: string): Record<string, string> => {
  return {
    url: `https://docs.whitecross.emergency/command/${topic}`,
    description: `Comprehensive documentation for ${topic}`,
  };
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Incident Management
  createIncidentCreationSchema,
  createIncidentResponseSchema,
  createIncidentUpdateSchema,
  createIncidentFilterQueryDocs,
  createIncidentOperationDoc,

  // Resource Allocation
  createResourceAllocationSchema,
  createResourceStatusSchema,
  createResourceAvailabilityQueryDocs,
  createResourceReallocationSchema,
  createResourceOperationDoc,

  // Real-Time Status
  createRealTimeStatusSchema,
  createDashboardDataSchema,
  createWebSocketEventSchema,
  createRealTimeOperationDoc,

  // Reporting & Analytics
  createAnalyticsQuerySchema,
  createIncidentStatisticsSchema,
  createResourceUtilizationSchema,
  createReportingQueryDocs,
  createReportingOperationDoc,

  // Multi-Agency Coordination
  createMultiAgencyCoordinationSchema,
  createAgencyInformationSchema,
  createSharedResourceSchema,
  createMultiAgencyOperationDoc,

  // Command Hierarchy
  createCommandStructureSchema,
  createCommandAssignmentSchema,
  createAuthorityDelegationSchema,
  createCommandHierarchyOperationDoc,

  // Situation Awareness
  createSituationReportSchema,
  createTacticalMapSchema,
  createHazardAssessmentSchema,
  createSituationAwarenessOperationDoc,

  // Decision Support
  createDecisionRecommendationSchema,
  createDecisionQuerySchema,
  createPredictiveAnalysisSchema,
  createDecisionSupportOperationDoc,

  // Common Responses
  createCommandSuccessResponse,
  createCommandErrorResponse,
  createBatchOperationResponse,
  createAuditTrailSchema,
  createNotificationSchema,

  // Security & Auth
  createCommandJWTScheme,
  createRoleRequirementDoc,
  createPermissionDoc,
  createCommandTag,
  createCommandExternalDocs,
};
