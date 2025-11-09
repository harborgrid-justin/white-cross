/**
 * Integration Services Architecture
 *
 * Production-ready NestJS microservices for external system integrations.
 * Implements event-driven integration patterns, message queues (RabbitMQ, Kafka),
 * adapter patterns, and distributed integration coordination for CAD systems, RMS,
 * 911 centers, radio systems, AVL, weather services, third-party APIs, and legacy systems.
 *
 * Features:
 * - Enterprise integration patterns (EIP)
 * - Message transformation and routing
 * - Adapter pattern for legacy systems
 * - Event-driven integration architecture
 * - API gateway and service mesh integration
 * - Protocol translation (SOAP, REST, gRPC, etc.)
 * - Data synchronization and ETL
 * - Real-time data streaming
 * - Fault-tolerant integration with retry logic
 * - Dead letter queue handling
 * - Integration monitoring and alerting
 *
 * Integration Services Covered:
 * - CAD System Integration
 * - RMS (Records Management System) Integration
 * - 911 Center Integration
 * - Radio System Integration
 * - AVL (Automatic Vehicle Location) Integration
 * - Weather Service Integration
 * - Third-Party API Integration
 * - Legacy System Adapters
 *
 * @module IntegrationServices
 * @category Integration Architecture
 * @version 1.0.0
 */
import { Observable } from 'rxjs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { HttpService } from '@nestjs/axios';
/**
 * CAD System Integration Service
 *
 * Integrates with Computer-Aided Dispatch (CAD) systems for incident management,
 * unit dispatching, and real-time status updates.
 */
export declare class CADSystemIntegrationService {
    private readonly cadIncidentModel;
    private readonly cadUnitModel;
    private readonly eventEmitter;
    private readonly httpService;
    private readonly logger;
    private kafkaClient;
    private rabbitMQClient;
    constructor(cadIncidentModel: any, cadUnitModel: any, eventEmitter: EventEmitter2, httpService: HttpService);
    /**
     * Initialize message queue clients
     */
    private initializeClients;
    /**
     * Sync incident from CAD system
     */
    syncIncidentFromCAD(data: any): Promise<any>;
    /**
     * Fetch incident from CAD system
     */
    private fetchCADIncident;
    /**
     * Transform CAD incident to internal format
     */
    private transformCADIncident;
    /**
     * Map CAD incident type to internal type
     */
    private mapCADIncidentType;
    /**
     * Map CAD priority to internal priority
     */
    private mapCADPriority;
    /**
     * Map CAD status to internal status
     */
    private mapCADStatus;
    /**
     * Push incident update to CAD system
     */
    pushIncidentUpdateToCAD(data: any): Promise<any>;
    /**
     * Transform internal incident to CAD format
     */
    private transformToCADFormat;
    /**
     * Reverse map status to CAD format
     */
    private reverseMapStatus;
    /**
     * Reverse map priority to CAD format
     */
    private reverseMapPriority;
    /**
     * Sync unit status from CAD
     */
    syncUnitStatusFromCAD(data: any): Promise<any>;
    /**
     * Handle CAD system webhook events
     */
    handleCADWebhookEvent(data: any): Promise<void>;
    /**
     * Stream real-time CAD updates
     */
    streamCADUpdates(data: any): Observable<any>;
    /**
     * Fetch recent CAD updates
     */
    private fetchRecentCADUpdates;
}
/**
 * RMS Integration Service
 *
 * Integrates with Records Management System (RMS) for case management,
 * report filing, and evidence tracking.
 */
export declare class RMSIntegrationService {
    private readonly rmsCaseModel;
    private readonly rmsReportModel;
    private readonly eventEmitter;
    private readonly httpService;
    private readonly logger;
    private rabbitMQClient;
    constructor(rmsCaseModel: any, rmsReportModel: any, eventEmitter: EventEmitter2, httpService: HttpService);
    /**
     * Initialize RabbitMQ client
     */
    private initializeClients;
    /**
     * Create case in RMS
     */
    createCaseInRMS(data: any): Promise<any>;
    /**
     * Submit report to RMS
     */
    submitReportToRMS(data: any): Promise<any>;
    /**
     * Sync case status from RMS
     */
    syncCaseStatusFromRMS(data: any): Promise<any>;
    /**
     * Retrieve case details from RMS
     */
    getCaseDetailsFromRMS(data: any): Promise<any>;
    /**
     * Link evidence to RMS case
     */
    linkEvidenceToCase(data: any): Promise<any>;
    /**
     * Search RMS cases
     */
    searchRMSCases(data: any): Promise<any>;
}
/**
 * 911 Center Integration Service
 *
 * Integrates with 911 call centers for emergency call handling,
 * ANI/ALI data retrieval, and call routing.
 */
export declare class Emergency911IntegrationService {
    private readonly emergencyCallModel;
    private readonly eventEmitter;
    private readonly httpService;
    private readonly logger;
    private kafkaClient;
    constructor(emergencyCallModel: any, eventEmitter: EventEmitter2, httpService: HttpService);
    /**
     * Initialize Kafka client
     */
    private initializeClients;
    /**
     * Process incoming 911 call
     */
    processIncoming911Call(data: any): Promise<any>;
    /**
     * Retrieve ANI/ALI data
     */
    private retrieveANIALI;
    /**
     * Transfer 911 call
     */
    transfer911Call(data: any): Promise<any>;
    /**
     * Update 911 call status
     */
    update911CallStatus(data: any): Promise<any>;
    /**
     * Retrieve 911 call recording
     */
    get911CallRecording(data: any): Promise<any>;
    /**
     * Handle 911 text-to-911
     */
    processTextTo911(data: any): Promise<any>;
    /**
     * Rebid 911 call (automated callback)
     */
    rebid911Call(data: any): Promise<any>;
}
/**
 * Radio System Integration Service
 *
 * Integrates with radio dispatch systems for voice communications,
 * channel management, and unit radio tracking.
 */
export declare class RadioSystemIntegrationService {
    private readonly radioChannelModel;
    private readonly radioTransmissionModel;
    private readonly eventEmitter;
    private readonly logger;
    private kafkaClient;
    constructor(radioChannelModel: any, radioTransmissionModel: any, eventEmitter: EventEmitter2);
    /**
     * Initialize Kafka client
     */
    private initializeClients;
    /**
     * Assign radio channel to incident
     */
    assignRadioChannel(data: any): Promise<any>;
    /**
     * Log radio transmission
     */
    logRadioTransmission(data: any): Promise<any>;
    /**
     * Monitor radio channel activity
     */
    monitorRadioChannel(data: any): Observable<any>;
    /**
     * Request emergency radio alert
     */
    triggerEmergencyRadioAlert(data: any): Promise<any>;
    /**
     * Broadcast emergency alert to all units
     */
    private broadcastEmergencyAlert;
    /**
     * Change radio talk group
     */
    changeRadioTalkGroup(data: any): Promise<any>;
    /**
     * Retrieve radio recording
     */
    getRadioRecording(data: any): Promise<any>;
}
/**
 * AVL Integration Service
 *
 * Integrates with Automatic Vehicle Location (AVL) systems for real-time
 * vehicle tracking, geofencing, and route optimization.
 */
export declare class AVLIntegrationService {
    private readonly vehicleLocationModel;
    private readonly vehicleModel;
    private readonly eventEmitter;
    private readonly httpService;
    private readonly logger;
    private kafkaClient;
    constructor(vehicleLocationModel: any, vehicleModel: any, eventEmitter: EventEmitter2, httpService: HttpService);
    /**
     * Initialize Kafka client
     */
    private initializeClients;
    /**
     * Process AVL position update
     */
    processAVLPositionUpdate(data: any): Promise<any>;
    /**
     * Stream real-time vehicle positions
     */
    streamVehiclePositions(data: any): Observable<any>;
    /**
     * Get vehicle location history
     */
    getVehicleLocationHistory(data: any): Promise<any>;
    /**
     * Calculate vehicle ETA
     */
    calculateVehicleETA(data: any): Promise<any>;
    /**
     * Calculate distance using Haversine formula
     */
    private calculateDistance;
    /**
     * Convert degrees to radians
     */
    private toRadians;
    /**
     * Check vehicle geofence status
     */
    checkVehicleGeofence(data: any): Promise<any>;
    /**
     * Check if point is within polygon
     */
    private isPointInPolygon;
    /**
     * Generate vehicle breadcrumb trail
     */
    generateBreadcrumbTrail(data: any): Promise<any>;
}
/**
 * Weather Service Integration
 *
 * Integrates with weather service APIs for weather alerts, forecasts,
 * and incident impact analysis.
 */
export declare class WeatherServiceIntegration {
    private readonly weatherAlertModel;
    private readonly eventEmitter;
    private readonly httpService;
    private readonly logger;
    private kafkaClient;
    constructor(weatherAlertModel: any, eventEmitter: EventEmitter2, httpService: HttpService);
    /**
     * Initialize Kafka client
     */
    private initializeClients;
    /**
     * Get current weather for location
     */
    getCurrentWeather(data: any): Promise<any>;
    /**
     * Get weather forecast
     */
    getWeatherForecast(data: any): Promise<any>;
    /**
     * Monitor weather alerts
     */
    monitorWeatherAlerts(data: any): Promise<any>;
    /**
     * Process weather alert
     */
    private processWeatherAlert;
    /**
     * Assess weather impact on incident
     */
    assessWeatherImpactOnIncident(data: any): Promise<any>;
    /**
     * Subscribe to severe weather alerts
     */
    handleSevereWeatherAlert(data: any): Promise<void>;
}
/**
 * Third-Party API Integration Service
 *
 * Manages integrations with third-party APIs for enhanced functionality.
 */
export declare class ThirdPartyAPIIntegrationService {
    private readonly apiRequestModel;
    private readonly eventEmitter;
    private readonly httpService;
    private readonly logger;
    private rabbitMQClient;
    constructor(apiRequestModel: any, eventEmitter: EventEmitter2, httpService: HttpService);
    /**
     * Initialize RabbitMQ client
     */
    private initializeClients;
    /**
     * Execute third-party API request
     */
    executeAPIRequest(data: any): Promise<any>;
    /**
     * Make HTTP API request
     */
    private makeAPIRequest;
    /**
     * Geocode address using third-party service
     */
    geocodeAddress(data: any): Promise<any>;
    /**
     * Reverse geocode coordinates
     */
    reverseGeocode(data: any): Promise<any>;
    /**
     * Validate phone number
     */
    validatePhoneNumber(data: any): Promise<any>;
    /**
     * Enrich contact information
     */
    enrichContactInformation(data: any): Promise<any>;
}
/**
 * Legacy System Adapter Service
 *
 * Provides adapters for integrating with legacy systems using various protocols.
 */
export declare class LegacySystemAdapterService {
    private readonly legacyTransactionModel;
    private readonly eventEmitter;
    private readonly httpService;
    private readonly logger;
    private rabbitMQClient;
    constructor(legacyTransactionModel: any, eventEmitter: EventEmitter2, httpService: HttpService);
    /**
     * Initialize RabbitMQ client
     */
    private initializeClients;
    /**
     * Execute SOAP request to legacy system
     */
    executeLegacySOAPRequest(data: any): Promise<any>;
    /**
     * Build SOAP envelope
     */
    private buildSOAPEnvelope;
    /**
     * Build SOAP parameters
     */
    private buildSOAPParams;
    /**
     * Parse SOAP response
     */
    private parseSOAPResponse;
    /**
     * Execute FTP file transfer
     */
    executeFTPTransfer(data: any): Promise<any>;
    /**
     * Execute database direct connection query
     */
    executeLegacyDatabaseQuery(data: any): Promise<any>;
    /**
     * Parse fixed-width file format
     */
    parseFixedWidthFile(data: any): Promise<any>;
    /**
     * Transform CSV data to JSON
     */
    transformCSVToJSON(data: any): Promise<any>;
    /**
     * Execute mainframe transaction (CICS/IMS)
     */
    executeMainframeTransaction(data: any): Promise<any>;
}
/**
 * Message Transformation Service
 *
 * Handles message transformation and routing for enterprise integration patterns.
 */
export declare class MessageTransformationService {
    private readonly logger;
    /**
     * Transform message format
     */
    transformMessage(data: any): Promise<any>;
    /**
     * Transform to JSON
     */
    private transformToJSON;
    /**
     * Transform to XML
     */
    private transformToXML;
    /**
     * Transform to CSV
     */
    private transformToCSV;
    /**
     * Route message based on content
     */
    routeMessage(data: any): Promise<any>;
    /**
     * Determine message route
     */
    private determineRoute;
    /**
     * Evaluate routing rule
     */
    private evaluateRule;
}
export { CADSystemIntegrationService, RMSIntegrationService, Emergency911IntegrationService, RadioSystemIntegrationService, AVLIntegrationService, WeatherServiceIntegration, ThirdPartyAPIIntegrationService, LegacySystemAdapterService, MessageTransformationService, };
//# sourceMappingURL=integration-services.d.ts.map