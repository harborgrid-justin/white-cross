/**
 * Emergency Dispatch Services
 *
 * Production-ready NestJS service providers for comprehensive emergency dispatch operations.
 * Handles call intake, triage, unit recommendation, automatic dispatch, priority queuing,
 * geographic routing, pre-arrival instructions, call transfers, and multi-jurisdiction coordination.
 *
 * Features:
 * - Advanced call intake and triage processing
 * - AI-powered unit recommendation engine
 * - Automatic dispatch algorithms with load balancing
 * - Dynamic priority queue management
 * - Geographic routing and closest unit selection
 * - Medical pre-arrival instruction delivery
 * - Seamless call transfer and escalation
 * - Multi-jurisdiction coordination and mutual aid
 * - Real-time resource tracking and availability
 * - HIPAA-compliant audit logging
 *
 * @module EmergencyDispatchServices
 * @category Emergency Operations
 * @version 1.0.0
 */
/**
 * Emergency Call Intake Service
 *
 * Manages initial emergency call reception, caller information collection,
 * and basic incident classification.
 */
export declare class EmergencyCallIntakeService {
    private readonly emergencyCallModel;
    private readonly callerModel;
    private readonly auditService;
    private readonly logger;
    constructor(emergencyCallModel: any, callerModel: any, auditService: any);
    /**
     * Initialize new emergency call intake
     */
    initiateEmergencyCall(callData: {
        phoneNumber: string;
        location?: string;
        callerName?: string;
        ani?: string;
        ali?: string;
    }): Promise<any>;
    /**
     * Collect caller demographic information
     */
    collectCallerInformation(callId: string, callerInfo: {
        name?: string;
        age?: number;
        gender?: string;
        language?: string;
        medicalHistory?: string[];
        medications?: string[];
        allergies?: string[];
    }): Promise<any>;
    /**
     * Verify and geocode incident location
     */
    verifyIncidentLocation(callId: string, locationData: {
        address?: string;
        latitude?: number;
        longitude?: number;
        landmarks?: string[];
        crossStreets?: string[];
        buildingInfo?: string;
    }): Promise<any>;
    /**
     * Perform initial incident classification
     */
    classifyIncident(callId: string, classification: {
        type: string;
        subType?: string;
        severity?: string;
        keywords?: string[];
        chiefComplaint?: string;
    }): Promise<any>;
    /**
     * Validate caller authentication for callback
     */
    validateCallerAuthentication(callId: string, validationData: {
        phoneNumber: string;
        verificationCode?: string;
        callbackNumber?: string;
    }): Promise<boolean>;
    /**
     * Private helper: Geocode address to coordinates
     */
    private geocodeAddress;
}
/**
 * Medical Triage Service
 *
 * Provides systematic patient assessment, symptom evaluation,
 * and priority determination using standardized protocols.
 */
export declare class MedicalTriageService {
    private readonly emergencyCallModel;
    private readonly triageProtocolModel;
    private readonly logger;
    constructor(emergencyCallModel: any, triageProtocolModel: any);
    /**
     * Perform systematic patient assessment
     */
    performPatientAssessment(callId: string, assessment: {
        consciousness?: string;
        breathing?: string;
        circulation?: string;
        disability?: string;
        exposure?: string;
        vitalSigns?: any;
    }): Promise<any>;
    /**
     * Evaluate patient symptoms using protocol
     */
    evaluateSymptoms(callId: string, symptoms: {
        chiefComplaint: string;
        symptoms: string[];
        duration?: string;
        severity?: number;
        onset?: string;
    }): Promise<any>;
    /**
     * Determine dispatch priority using standardized criteria
     */
    determinePriority(callId: string, criteria: {
        responseTimeNeeded?: string;
        patientCondition?: string;
        riskFactors?: string[];
        ageFactor?: boolean;
    }): Promise<string>;
    /**
     * Apply Medical Priority Dispatch System (MPDS) protocols
     */
    applyMPDSProtocol(callId: string, mpdsCode: string): Promise<any>;
    /**
     * Conduct rapid triage for mass casualty incidents
     */
    conductRapidTriage(callId: string, patients: Array<{
        patientId: string;
        startCategory: string;
        canWalk?: boolean;
        respiratoryRate?: number;
        perfusionStatus?: string;
        mentalStatus?: string;
    }>): Promise<any>;
    /**
     * Private helper: Calculate START triage category
     */
    private calculateStartCategory;
}
/**
 * Unit Recommendation Engine Service
 *
 * AI-powered service for recommending optimal emergency response units
 * based on incident type, location, availability, and capabilities.
 */
export declare class UnitRecommendationEngineService {
    private readonly responseUnitModel;
    private readonly emergencyCallModel;
    private readonly logger;
    constructor(responseUnitModel: any, emergencyCallModel: any);
    /**
     * Recommend optimal units for incident response
     */
    recommendUnitsForIncident(callId: string, requirements: {
        incidentType: string;
        requiredCapabilities?: string[];
        minimumUnits?: number;
        maximumUnits?: number;
    }): Promise<any[]>;
    /**
     * Calculate unit fitness score based on multiple factors
     */
    calculateUnitFitnessScore(unitId: string, callId: string, factors: {
        distanceWeight?: number;
        capabilityWeight?: number;
        availabilityWeight?: number;
        performanceWeight?: number;
    }): Promise<number>;
    /**
     * Match unit capabilities to incident requirements
     */
    matchUnitCapabilities(unitId: string, requirements: {
        medicalLevel?: string;
        specialEquipment?: string[];
        personnelCertifications?: string[];
        minimumStaffing?: number;
    }): Promise<{
        matched: boolean;
        score: number;
        gaps: string[];
    }>;
    /**
     * Optimize unit selection for multiple concurrent incidents
     */
    optimizeMultiIncidentUnitSelection(incidents: Array<{
        callId: string;
        priority: string;
        requirements: any;
    }>): Promise<Map<string, string[]>>;
    /**
     * Predict unit availability based on historical patterns
     */
    predictUnitAvailability(unitId: string, timeWindow: {
        start: Date;
        end: Date;
    }): Promise<{
        probability: number;
        expectedStatus: string;
    }>;
    /**
     * Private helper: Rank units by fitness score
     */
    private rankUnitsByFitness;
    /**
     * Private helper: Calculate distance score
     */
    private calculateDistanceScore;
    /**
     * Private helper: Calculate capability score
     */
    private calculateCapabilityScore;
    /**
     * Private helper: Calculate availability score
     */
    private calculateAvailabilityScore;
    /**
     * Private helper: Get priority weight for sorting
     */
    private getPriorityWeight;
}
/**
 * Automatic Dispatch Service
 *
 * Handles automated dispatch decisions, unit assignment,
 * and dispatch notifications.
 */
export declare class AutomaticDispatchService {
    private readonly emergencyCallModel;
    private readonly dispatchModel;
    private readonly responseUnitModel;
    private readonly unitRecommendationService;
    private readonly notificationService;
    private readonly logger;
    constructor(emergencyCallModel: any, dispatchModel: any, responseUnitModel: any, unitRecommendationService: UnitRecommendationEngineService, notificationService: any);
    /**
     * Execute automatic dispatch algorithm
     */
    executeAutomaticDispatch(callId: string, options: {
        bypassManualReview?: boolean;
        notifyBackup?: boolean;
        assignMultipleUnits?: boolean;
    }): Promise<any>;
    /**
     * Assign specific units to emergency call
     */
    assignUnitsToCall(callId: string, unitIds: string[]): Promise<any>;
    /**
     * Send dispatch notification to assigned units
     */
    sendDispatchNotifications(dispatchId: string): Promise<void>;
    /**
     * Update dispatch status throughout response lifecycle
     */
    updateDispatchStatus(dispatchId: string, status: string, metadata?: any): Promise<any>;
    /**
     * Handle dispatch acknowledgment from units
     */
    acknowledgeDispatch(dispatchId: string, unitId: string, acknowledgment: {
        acknowledgedAt: Date;
        estimatedArrival?: Date;
        crewMembers?: string[];
    }): Promise<any>;
}
/**
 * Priority Queue Management Service
 *
 * Manages emergency call priority queues with dynamic reordering
 * and escalation capabilities.
 */
export declare class PriorityQueueManagementService {
    private readonly emergencyCallModel;
    private readonly dispatchQueueModel;
    private readonly logger;
    constructor(emergencyCallModel: any, dispatchQueueModel: any);
    /**
     * Add call to appropriate priority queue
     */
    addToQueue(callId: string, priority: string): Promise<any>;
    /**
     * Reorder queue based on changing priorities
     */
    reorderQueue(priority: string, criteria: {
        sortBy?: string;
        ascending?: boolean;
    }): Promise<any[]>;
    /**
     * Escalate call priority based on wait time
     */
    escalateCallPriority(callId: string, reason: string): Promise<any>;
    /**
     * Monitor queue wait times and trigger alerts
     */
    monitorQueueWaitTimes(thresholds: {
        emergency?: number;
        urgent?: number;
        priority?: number;
        routine?: number;
    }): Promise<any[]>;
    /**
     * Get next call from queue for dispatch
     */
    getNextCallFromQueue(priority?: string): Promise<any>;
    /**
     * Private helper: Calculate queue position
     */
    private calculateQueuePosition;
    /**
     * Private helper: Get escalated priority level
     */
    private getEscalatedPriority;
}
/**
 * Geographic Routing Service
 *
 * Provides geographic analysis, route optimization, and
 * location-based unit selection for emergency dispatch.
 */
export declare class GeographicRoutingService {
    private readonly responseUnitModel;
    private readonly emergencyCallModel;
    private readonly logger;
    constructor(responseUnitModel: any, emergencyCallModel: any);
    /**
     * Calculate optimal route from unit to incident
     */
    calculateOptimalRoute(unitId: string, callId: string, options: {
        avoidTolls?: boolean;
        avoidHighways?: boolean;
        considerTraffic?: boolean;
    }): Promise<any>;
    /**
     * Find closest available units to incident location
     */
    findClosestUnits(callId: string, count?: number): Promise<any[]>;
    /**
     * Determine jurisdiction boundaries for incident
     */
    determineJurisdiction(callId: string): Promise<any>;
    /**
     * Calculate estimated time of arrival for units
     */
    calculateETA(unitId: string, callId: string, factors: {
        currentTraffic?: boolean;
        weatherConditions?: boolean;
        roadConditions?: boolean;
    }): Promise<{
        eta: Date;
        confidence: number;
    }>;
    /**
     * Identify coverage gaps in service areas
     */
    identifyCoverageGaps(serviceArea: string): Promise<any[]>;
    /**
     * Private helper: Calculate distance between coordinates
     */
    private calculateDistance;
}
/**
 * Pre-Arrival Instructions Service
 *
 * Delivers structured pre-arrival medical instructions to callers
 * while emergency units are en route.
 */
export declare class PreArrivalInstructionsService {
    private readonly emergencyCallModel;
    private readonly instructionProtocolModel;
    private readonly logger;
    constructor(emergencyCallModel: any, instructionProtocolModel: any);
    /**
     * Deliver CPR instructions to caller
     */
    deliverCPRInstructions(callId: string, patientAge: number): Promise<any>;
    /**
     * Provide bleeding control guidance
     */
    provideBleedingControlGuidance(callId: string, severity: string): Promise<any>;
    /**
     * Guide airway management procedures
     */
    guideAirwayManagement(callId: string, obstruction: boolean): Promise<any>;
    /**
     * Instruct caller on patient positioning
     */
    instructPatientPositioning(callId: string, condition: string): Promise<any>;
    /**
     * Confirm caller compliance with instructions
     */
    confirmInstructionCompliance(callId: string, compliance: {
        stepCompleted: number;
        successful: boolean;
        notes?: string;
    }): Promise<any>;
    /**
     * Private helper: Get age group for protocol selection
     */
    private getAgeGroup;
    /**
     * Private helper: Get positioning instructions
     */
    private getPositioningInstructions;
}
/**
 * Call Transfer Service
 *
 * Manages seamless transfer of emergency calls between dispatchers,
 * jurisdictions, and specialized centers.
 */
export declare class CallTransferService {
    private readonly emergencyCallModel;
    private readonly callTransferModel;
    private readonly notificationService;
    private readonly logger;
    constructor(emergencyCallModel: any, callTransferModel: any, notificationService: any);
    /**
     * Transfer call to specialized center
     */
    transferToSpecializedCenter(callId: string, transferData: {
        destinationCenter: string;
        reason: string;
        specialization: string;
        urgency: string;
    }): Promise<any>;
    /**
     * Hand off call to another dispatcher
     */
    handoffToDispatcher(callId: string, targetDispatcherId: string, notes?: string): Promise<any>;
    /**
     * Escalate call to supervisor
     */
    escalateToSupervisor(callId: string, escalationReason: string): Promise<any>;
    /**
     * Route call to appropriate jurisdiction
     */
    routeToJurisdiction(callId: string, jurisdictionData: {
        targetJurisdiction: string;
        reason: string;
        contactNumber?: string;
    }): Promise<any>;
    /**
     * Complete transfer and update call ownership
     */
    completeTransfer(transferId: string, completionData: {
        acceptedBy?: string;
        completedAt: Date;
        notes?: string;
    }): Promise<any>;
}
/**
 * Multi-Jurisdiction Coordination Service
 *
 * Coordinates emergency response across multiple jurisdictions,
 * manages mutual aid requests, and facilitates inter-agency communication.
 */
export declare class MultiJurisdictionCoordinationService {
    private readonly emergencyCallModel;
    private readonly mutualAidRequestModel;
    private readonly jurisdictionModel;
    private readonly notificationService;
    private readonly logger;
    constructor(emergencyCallModel: any, mutualAidRequestModel: any, jurisdictionModel: any, notificationService: any);
    /**
     * Request mutual aid from neighboring jurisdictions
     */
    requestMutualAid(callId: string, requestData: {
        requestingJurisdiction: string;
        targetJurisdictions: string[];
        resourcesNeeded: string[];
        urgency: string;
        reason: string;
    }): Promise<any>;
    /**
     * Coordinate cross-jurisdictional incident response
     */
    coordinateCrossJurisdictionalResponse(callId: string, coordination: {
        participatingJurisdictions: string[];
        commandStructure: string;
        communicationPlan: any;
        resourceAllocation: Map<string, string[]>;
    }): Promise<any>;
    /**
     * Establish unified command for major incidents
     */
    establishUnifiedCommand(callId: string, commandData: {
        incidentCommander: string;
        participatingAgencies: string[];
        commandPost: any;
        objectives: string[];
    }): Promise<any>;
    /**
     * Share incident information between agencies
     */
    shareIncidentInformation(callId: string, sharingData: {
        recipientAgencies: string[];
        informationType: string;
        data: any;
        classification: string;
    }): Promise<any>;
    /**
     * Process mutual aid response from assisting jurisdiction
     */
    processMutualAidResponse(requestId: string, response: {
        accepted: boolean;
        resourcesProvided?: string[];
        estimatedArrival?: Date;
        restrictions?: string[];
        notes?: string;
    }): Promise<any>;
}
export declare const EmergencyDispatchServices: (typeof EmergencyCallIntakeService | typeof MedicalTriageService | typeof UnitRecommendationEngineService | typeof AutomaticDispatchService | typeof PriorityQueueManagementService | typeof GeographicRoutingService | typeof PreArrivalInstructionsService | typeof CallTransferService | typeof MultiJurisdictionCoordinationService)[];
//# sourceMappingURL=emergency-dispatch-services.d.ts.map