/**
 * Command Microservices Architecture
 *
 * Production-ready NestJS microservices for emergency command and control operations.
 * Implements event-driven architecture, CQRS patterns, message queues (RabbitMQ, Kafka),
 * and distributed service coordination for incident processing, dispatch, resource management,
 * notifications, analytics, GIS, reporting, and archival operations.
 *
 * Features:
 * - Event-driven microservices architecture with RabbitMQ and Kafka
 * - CQRS (Command Query Responsibility Segregation) implementation
 * - Event sourcing for audit trails and state reconstruction
 * - Distributed transaction coordination with Saga pattern
 * - Circuit breaker and retry patterns for resilience
 * - Service discovery and health monitoring
 * - Real-time event streaming and processing
 * - Message-based inter-service communication
 * - Asynchronous command processing
 * - Event store and replay capabilities
 *
 * Microservices Covered:
 * - Incident Processing Service
 * - Dispatch Coordination Service
 * - Resource Management Service
 * - Notification Service
 * - Analytics Processing Service
 * - GIS Service
 * - Reporting Service
 * - Archive Service
 *
 * @module CommandMicroservices
 * @category Microservices Architecture
 * @version 1.0.0
 */
import { RmqContext } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { EventEmitter2 } from '@nestjs/event-emitter';
/**
 * Incident Processing Microservice
 *
 * Handles all incident-related commands and events through message queues.
 * Processes incident creation, updates, status changes, and lifecycle management.
 */
export declare class IncidentProcessingService {
    private readonly incidentModel;
    private readonly eventEmitter;
    private readonly logger;
    private kafkaClient;
    private rabbitMQClient;
    constructor(incidentModel: any, eventEmitter: EventEmitter2);
    /**
     * Initialize message queue clients
     */
    private initializeClients;
    /**
     * Process create incident command
     */
    processCreateIncidentCommand(data: any, context: RmqContext): Promise<any>;
    /**
     * Publish incident created event to event stream
     */
    publishIncidentCreatedEvent(incident: any): Promise<void>;
    /**
     * Process update incident command
     */
    processUpdateIncidentCommand(data: any): Promise<any>;
    /**
     * Publish incident updated event
     */
    publishIncidentUpdatedEvent(incident: any, updates: any): Promise<void>;
    /**
     * Process close incident command
     */
    processCloseIncidentCommand(data: any): Promise<any>;
    /**
     * Publish incident closed event
     */
    publishIncidentClosedEvent(incident: any): Promise<void>;
    /**
     * Handle incident escalation
     */
    handleIncidentEscalation(data: any): Promise<any>;
    /**
     * Calculate escalated priority level
     */
    private calculateEscalatedPriority;
}
/**
 * Dispatch Coordination Microservice
 *
 * Coordinates unit dispatching, resource allocation, and response coordination
 * through distributed message-based architecture.
 */
export declare class DispatchCoordinationService {
    private readonly dispatchModel;
    private readonly unitModel;
    private readonly eventEmitter;
    private readonly logger;
    private rabbitMQClient;
    private kafkaClient;
    constructor(dispatchModel: any, unitModel: any, eventEmitter: EventEmitter2);
    /**
     * Initialize message clients
     */
    private initializeClients;
    /**
     * Process dispatch unit command
     */
    processDispatchUnitCommand(data: any): Promise<any>;
    /**
     * Publish unit dispatched event
     */
    publishUnitDispatchedEvent(dispatch: any, unit: any): Promise<void>;
    /**
     * Process unit enroute command
     */
    processUnitEnrouteCommand(data: any): Promise<any>;
    /**
     * Process unit on-scene command
     */
    processUnitOnSceneCommand(data: any): Promise<any>;
    /**
     * Process unit available command
     */
    processUnitAvailableCommand(data: any): Promise<any>;
    /**
     * Request mutual aid from neighboring jurisdiction
     */
    requestMutualAid(data: any): Promise<any>;
    /**
     * Generate unique mutual aid request ID
     */
    private generateRequestId;
    /**
     * Coordinate multi-unit response
     */
    coordinateMultiUnitResponse(data: any): Promise<any>;
}
/**
 * Resource Management Microservice
 *
 * Manages resource allocation, availability tracking, and capacity planning
 * through event-driven architecture.
 */
export declare class ResourceManagementService {
    private readonly resourceModel;
    private readonly unitModel;
    private readonly eventEmitter;
    private readonly logger;
    private kafkaClient;
    constructor(resourceModel: any, unitModel: any, eventEmitter: EventEmitter2);
    /**
     * Initialize Kafka client
     */
    private initializeClients;
    /**
     * Process allocate resource command
     */
    processAllocateResourceCommand(data: any): Promise<any>;
    /**
     * Process release resource command
     */
    processReleaseResourceCommand(data: any): Promise<any>;
    /**
     * Check resource availability
     */
    checkResourceAvailability(data: any): Promise<any>;
    /**
     * Reserve resource for future use
     */
    reserveResource(data: any): Promise<any>;
    /**
     * Track resource utilization metrics
     */
    trackResourceUtilization(data: any): Promise<any>;
}
/**
 * Notification Microservice
 *
 * Handles multi-channel notification delivery through event-driven messaging.
 * Supports SMS, email, push notifications, and webhook notifications.
 */
export declare class NotificationMicroservice {
    private readonly notificationModel;
    private readonly eventEmitter;
    private readonly logger;
    private rabbitMQClient;
    constructor(notificationModel: any, eventEmitter: EventEmitter2);
    /**
     * Initialize RabbitMQ client
     */
    private initializeClients;
    /**
     * Send notification through message queue
     */
    processSendNotificationCommand(data: any): Promise<any>;
    /**
     * Handle SMS notification
     */
    handleSMSNotification(data: any): Promise<void>;
    /**
     * Handle email notification
     */
    handleEmailNotification(data: any): Promise<void>;
    /**
     * Handle push notification
     */
    handlePushNotification(data: any): Promise<void>;
    /**
     * Send mass notification to multiple recipients
     */
    sendMassNotification(data: any): Promise<any>;
    /**
     * Schedule delayed notification
     */
    scheduleNotification(data: any): Promise<any>;
    /**
     * Simulate SMS sending
     */
    private sendSMS;
    /**
     * Simulate email sending
     */
    private sendEmail;
    /**
     * Simulate push notification sending
     */
    private sendPushNotification;
}
/**
 * Analytics Processing Microservice
 *
 * Processes analytics events and metrics through stream processing.
 * Handles real-time analytics, aggregations, and reporting metrics.
 */
export declare class AnalyticsProcessingService {
    private readonly analyticsEventModel;
    private readonly metricModel;
    private readonly eventEmitter;
    private readonly logger;
    private kafkaClient;
    constructor(analyticsEventModel: any, metricModel: any, eventEmitter: EventEmitter2);
    /**
     * Initialize Kafka client for stream processing
     */
    private initializeClients;
    /**
     * Process analytics event
     */
    processAnalyticsEvent(data: any): Promise<void>;
    /**
     * Update aggregated metrics
     */
    private updateMetrics;
    /**
     * Increment metric counter
     */
    private incrementMetric;
    /**
     * Calculate response time metrics
     */
    calculateResponseTimes(data: any): Promise<any>;
    /**
     * Calculate median value
     */
    private calculateMedian;
    /**
     * Generate incident statistics
     */
    generateIncidentStatistics(data: any): Promise<any>;
    /**
     * Group array by property
     */
    private groupBy;
    /**
     * Process real-time dashboard metrics
     */
    getRealtimeMetrics(data: any): Promise<any>;
    /**
     * Stream analytics events
     */
    streamAnalytics(data: any): Observable<any>;
}
/**
 * GIS Microservice
 *
 * Handles geographic information system operations, location-based queries,
 * and spatial analysis through microservices architecture.
 */
export declare class GISMicroservice {
    private readonly locationModel;
    private readonly geoFenceModel;
    private readonly eventEmitter;
    private readonly logger;
    private kafkaClient;
    constructor(locationModel: any, geoFenceModel: any, eventEmitter: EventEmitter2);
    /**
     * Initialize Kafka client
     */
    private initializeClients;
    /**
     * Find nearest units to location
     */
    findNearestUnits(data: any): Promise<any>;
    /**
     * Calculate distance between two points using Haversine formula
     */
    private calculateDistance;
    /**
     * Convert degrees to radians
     */
    private toRadians;
    /**
     * Check if location is within geofence
     */
    checkGeofence(data: any): Promise<any>;
    /**
     * Check if point is within polygon
     */
    private isPointInPolygon;
    /**
     * Calculate optimal route
     */
    calculateRoute(data: any): Promise<any>;
    /**
     * Update unit location
     */
    updateUnitLocation(data: any): Promise<any>;
    /**
     * Create geofence
     */
    createGeofence(data: any): Promise<any>;
}
/**
 * Reporting Microservice
 *
 * Generates and manages operational reports through asynchronous processing.
 */
export declare class ReportingMicroservice {
    private readonly reportModel;
    private readonly eventEmitter;
    private readonly logger;
    private rabbitMQClient;
    constructor(reportModel: any, eventEmitter: EventEmitter2);
    /**
     * Initialize RabbitMQ client
     */
    private initializeClients;
    /**
     * Generate incident report
     */
    generateIncidentReport(data: any): Promise<any>;
    /**
     * Process report generation
     */
    processReportGeneration(data: any): Promise<void>;
    /**
     * Generate report data
     */
    private generateReportData;
    /**
     * Schedule recurring report
     */
    scheduleRecurringReport(data: any): Promise<any>;
    /**
     * Get report status
     */
    getReportStatus(data: any): Promise<any>;
    /**
     * Export report to format
     */
    exportReport(data: any): Promise<any>;
    /**
     * Export report to specified format
     */
    private exportToFormat;
    /**
     * Delay helper
     */
    private delay;
}
/**
 * Archive Microservice
 *
 * Manages data archival and retrieval through asynchronous processing.
 */
export declare class ArchiveMicroservice {
    private readonly archiveModel;
    private readonly incidentModel;
    private readonly eventEmitter;
    private readonly logger;
    private rabbitMQClient;
    constructor(archiveModel: any, incidentModel: any, eventEmitter: EventEmitter2);
    /**
     * Initialize RabbitMQ client
     */
    private initializeClients;
    /**
     * Archive incident data
     */
    archiveIncident(data: any): Promise<any>;
    /**
     * Retrieve archived incident
     */
    retrieveArchivedIncident(data: any): Promise<any>;
    /**
     * Process bulk archival
     */
    processBulkArchive(data: any): Promise<any>;
    /**
     * Get entities for archival based on criteria
     */
    private getEntitiesForArchival;
    /**
     * Delete archived data past retention period
     */
    purgeExpiredArchives(data: any): Promise<any>;
    /**
     * Restore archived incident
     */
    restoreArchivedIncident(data: any): Promise<any>;
}
/**
 * Event Store Service
 *
 * Manages event sourcing and event store operations for the microservices architecture.
 */
export declare class EventStoreService {
    private readonly eventModel;
    private readonly eventEmitter;
    private readonly logger;
    private kafkaClient;
    constructor(eventModel: any, eventEmitter: EventEmitter2);
    /**
     * Initialize Kafka client
     */
    private initializeClients;
    /**
     * Store event in event store
     */
    storeEvent(data: any): Promise<any>;
    /**
     * Replay events for aggregate
     */
    replayEvents(data: any): Promise<any>;
    /**
     * Get aggregate current state from events
     */
    getAggregateState(data: any): Promise<any>;
    /**
     * Reconstruct aggregate state from event stream
     */
    private reconstructStateFromEvents;
    /**
     * Apply event to state
     */
    private applyEvent;
    /**
     * Create snapshot of aggregate state
     */
    createSnapshot(data: any): Promise<any>;
}
/**
 * Saga Orchestration Service
 *
 * Manages distributed transactions using the Saga pattern.
 */
export declare class SagaOrchestrationService {
    private readonly sagaModel;
    private readonly eventEmitter;
    private readonly logger;
    private kafkaClient;
    constructor(sagaModel: any, eventEmitter: EventEmitter2);
    /**
     * Initialize Kafka client
     */
    private initializeClients;
    /**
     * Start saga execution
     */
    startSaga(data: any): Promise<any>;
    /**
     * Execute saga step
     */
    private executeSagaStep;
    /**
     * Handle saga step completion
     */
    handleSagaStepCompleted(data: any): Promise<void>;
    /**
     * Complete saga
     */
    private completeSaga;
    /**
     * Compensate saga on failure
     */
    private compensateSaga;
    /**
     * Get saga status
     */
    getSagaStatus(data: any): Promise<any>;
}
/**
 * Circuit Breaker Service
 *
 * Implements circuit breaker pattern for resilient microservices communication.
 */
export declare class CircuitBreakerService {
    private readonly logger;
    private circuitStates;
    /**
     * Execute operation with circuit breaker
     */
    execute<T>(serviceKey: string, operation: () => Promise<T>): Promise<T>;
    /**
     * Get circuit state for service
     */
    private getCircuitState;
    /**
     * Handle successful operation
     */
    private onSuccess;
    /**
     * Handle failed operation
     */
    private onFailure;
    /**
     * Get circuit breaker status
     */
    getCircuitStatus(data: any): any;
    /**
     * Reset circuit breaker
     */
    resetCircuit(data: any): any;
}
/**
 * Service Health Monitor
 *
 * Monitors health and availability of microservices.
 */
export declare class ServiceHealthMonitor {
    private readonly logger;
    private healthChecks;
    /**
     * Register service for health monitoring
     */
    registerService(data: any): any;
    /**
     * Perform health check
     */
    performHealthCheck(data: any): Promise<any>;
    /**
     * Check service health
     */
    private checkServiceHealth;
    /**
     * Get all service health statuses
     */
    getAllHealthStatus(): any;
}
export { IncidentProcessingService, DispatchCoordinationService, ResourceManagementService, NotificationMicroservice, AnalyticsProcessingService, GISMicroservice, ReportingMicroservice, ArchiveMicroservice, EventStoreService, SagaOrchestrationService, CircuitBreakerService, ServiceHealthMonitor, };
//# sourceMappingURL=command-microservices.d.ts.map