/**
 * Resource Allocation Services
 *
 * Production-ready NestJS service providers for intelligent resource allocation and optimization.
 * Handles dynamic resource allocation, predictive deployment, mutual aid coordination,
 * surge capacity management, resource pooling, coverage optimization, workload balancing,
 * and strategic equipment staging.
 *
 * Features:
 * - AI-powered dynamic resource allocation
 * - Predictive deployment using historical data
 * - Automated mutual aid coordination
 * - Surge capacity planning and activation
 * - Multi-agency resource pooling
 * - Real-time coverage gap analysis
 * - Intelligent workload distribution
 * - Strategic equipment pre-positioning
 * - Resource utilization optimization
 * - Performance-based resource management
 *
 * @module ResourceAllocationServices
 * @category Emergency Operations
 * @version 1.0.0
 */
/**
 * Dynamic Resource Allocation Service
 *
 * Intelligently allocates emergency response resources in real-time
 * based on demand, availability, and predictive analytics.
 */
export declare class DynamicResourceAllocationService {
    private readonly responseUnitModel;
    private readonly resourcePoolModel;
    private readonly allocationStrategyModel;
    private readonly analyticsService;
    private readonly logger;
    constructor(responseUnitModel: any, resourcePoolModel: any, allocationStrategyModel: any, analyticsService: any);
    /**
     * Allocate resources based on current demand patterns
     */
    allocateResourcesByDemand(demandData: {
        timeWindow: {
            start: Date;
            end: Date;
        };
        serviceArea: string;
        priority: string;
        minimumCoverage: number;
    }): Promise<any>;
    /**
     * Rebalance resource distribution across service areas
     */
    rebalanceResourceDistribution(criteria: {
        targetAreas: string[];
        rebalanceReason: string;
        considerActiveIncidents?: boolean;
    }): Promise<any>;
    /**
     * Optimize unit placement for maximum coverage
     */
    optimizeUnitPlacement(serviceArea: string, objectives: {
        minimizeResponseTime?: boolean;
        maximizeCoverage?: boolean;
        balanceWorkload?: boolean;
        weights?: {
            responseTime: number;
            coverage: number;
            workload: number;
        };
    }): Promise<any>;
    /**
     * Allocate specialized resources for specific incident types
     */
    allocateSpecializedResources(incidentType: string, requirements: {
        capabilities: string[];
        certifications: string[];
        equipment: string[];
        personnelCount?: number;
        responseTimeTarget?: number;
    }): Promise<any[]>;
    /**
     * Manage resource reservations for scheduled events
     */
    manageResourceReservations(reservation: {
        eventId: string;
        eventType: string;
        startTime: Date;
        endTime: Date;
        resourceRequirements: any;
        location: any;
    }): Promise<any>;
    /**
     * Private helper: Optimize allocation strategy
     */
    private optimizeAllocation;
    /**
     * Private helper: Get current distribution
     */
    private getCurrentDistribution;
    /**
     * Private helper: Calculate optimal distribution
     */
    private calculateOptimalDistribution;
    /**
     * Private helper: Execute rebalancing moves
     */
    private executeRebalancing;
    /**
     * Private helper: Calculate optimal placements
     */
    private calculateOptimalPlacements;
    /**
     * Private helper: Calculate improvement score
     */
    private calculateImprovementScore;
    /**
     * Private helper: Generate placement recommendations
     */
    private generatePlacementRecommendations;
    /**
     * Private helper: Calculate match score
     */
    private calculateMatchScore;
}
/**
 * Predictive Deployment Service
 *
 * Uses historical data and machine learning to predict resource needs
 * and proactively deploy units to high-probability areas.
 */
export declare class PredictiveDeploymentService {
    private readonly responseUnitModel;
    private readonly predictiveModelModel;
    private readonly deploymentPlanModel;
    private readonly analyticsService;
    private readonly logger;
    constructor(responseUnitModel: any, predictiveModelModel: any, deploymentPlanModel: any, analyticsService: any);
    /**
     * Forecast resource demand based on historical patterns
     */
    forecastResourceDemand(forecastParams: {
        serviceArea: string;
        timeWindow: {
            start: Date;
            end: Date;
        };
        granularity: string;
        includeWeather?: boolean;
        includeEvents?: boolean;
    }): Promise<any>;
    /**
     * Generate proactive deployment plan based on predictions
     */
    generateProactiveDeploymentPlan(planParams: {
        serviceArea: string;
        targetDate: Date;
        shift: string;
        optimizationGoals: string[];
    }): Promise<any>;
    /**
     * Identify high-probability incident zones
     */
    identifyHighProbabilityZones(analysisParams: {
        serviceArea: string;
        timeWindow: {
            start: Date;
            end: Date;
        };
        incidentTypes?: string[];
        confidenceThreshold?: number;
    }): Promise<any[]>;
    /**
     * Pre-position units in strategic locations
     */
    prepositionUnitsStrategically(strategy: {
        unitIds: string[];
        targetLocations: Array<{
            lat: number;
            lng: number;
            zoneId: string;
        }>;
        duration: number;
        reason: string;
    }): Promise<any>;
    /**
     * Analyze deployment effectiveness and adjust models
     */
    analyzeDeploymentEffectiveness(deploymentId: string, metrics: {
        actualDemand: any;
        responseMetrics: any;
        costMetrics: any;
    }): Promise<any>;
    /**
     * Private helper: Generate forecast
     */
    private generateForecast;
    /**
     * Private helper: Plan unit deployments
     */
    private planUnitDeployments;
    /**
     * Private helper: Identify staging locations
     */
    private identifyStagingLocations;
    /**
     * Private helper: Analyze incident clusters
     */
    private analyzeIncidentClusters;
    /**
     * Private helper: Calculate accuracy score
     */
    private calculateAccuracyScore;
    /**
     * Private helper: Calculate response time improvement
     */
    private calculateResponseTimeImprovement;
    /**
     * Private helper: Calculate cost efficiency
     */
    private calculateCostEfficiency;
    /**
     * Private helper: Update predictive model
     */
    private updatePredictiveModel;
}
/**
 * Mutual Aid Coordination Service
 *
 * Manages mutual aid agreements, resource sharing between agencies,
 * and automated mutual aid request processing.
 */
export declare class MutualAidCoordinationService {
    private readonly mutualAidAgreementModel;
    private readonly mutualAidRequestModel;
    private readonly responseUnitModel;
    private readonly notificationService;
    private readonly logger;
    constructor(mutualAidAgreementModel: any, mutualAidRequestModel: any, responseUnitModel: any, notificationService: any);
    /**
     * Manage mutual aid agreements between agencies
     */
    manageMutualAidAgreement(agreement: {
        agencyId: string;
        partnerAgencyId: string;
        agreementType: string;
        resourceTypes: string[];
        responseTimeCommitment?: number;
        costRecovery?: any;
        restrictions?: string[];
        effectiveDate: Date;
        expirationDate: Date;
    }): Promise<any>;
    /**
     * Automate mutual aid resource request processing
     */
    processAutomatedMutualAidRequest(request: {
        requestingAgency: string;
        incidentId: string;
        resourcesNeeded: any[];
        urgency: string;
        duration?: number;
        preferredAgencies?: string[];
    }): Promise<any>;
    /**
     * Track shared resource availability across agencies
     */
    trackSharedResourceAvailability(params: {
        agencyIds: string[];
        resourceTypes?: string[];
        includeReserved?: boolean;
    }): Promise<any>;
    /**
     * Calculate mutual aid cost reimbursement
     */
    calculateMutualAidReimbursement(requestId: string, usage: {
        resourceId: string;
        hoursUsed: number;
        milesDriven?: number;
        equipmentUsed?: string[];
        personnelCount?: number;
    }): Promise<any>;
    /**
     * Coordinate resource return after mutual aid deployment
     */
    coordinateResourceReturn(requestId: string, returnData: {
        resourceIds: string[];
        actualReturnTime: Date;
        condition: string;
        incidentReport?: string;
        fuelLevel?: number;
    }): Promise<any>;
}
/**
 * Surge Capacity Management Service
 *
 * Manages surge capacity planning, activation, and scaling
 * for mass casualty incidents and major emergencies.
 */
export declare class SurgeCapacityManagementService {
    private readonly surgePlanModel;
    private readonly responseUnitModel;
    private readonly staffRosterModel;
    private readonly notificationService;
    private readonly logger;
    constructor(surgePlanModel: any, responseUnitModel: any, staffRosterModel: any, notificationService: any);
    /**
     * Activate surge capacity plans for major incidents
     */
    activateSurgeCapacityPlan(activation: {
        incidentId: string;
        surgeLevelation: string;
        reasonSurgeActivation: string;
        estimatedDuration: number;
        resourceMultiplier: number;
    }): Promise<any>;
    /**
     * Scale emergency response capacity dynamically
     */
    scaleResponseCapacity(scaling: {
        currentLevel: string;
        targetLevel: string;
        scalingReason: string;
        timeToTarget?: number;
    }): Promise<any>;
    /**
     * Manage off-duty staff callback procedures
     */
    manageStaffCallback(callback: {
        incidentId: string;
        urgency: string;
        requiredSkills?: string[];
        targetCount: number;
        shiftPreference?: string;
    }): Promise<any>;
    /**
     * Coordinate reserve unit activation
     */
    coordinateReserveUnitActivation(activation: {
        reserveType: string;
        quantity: number;
        deploymentLocation: any;
        activationReason: string;
        duration?: number;
    }): Promise<any>;
    /**
     * Monitor surge capacity utilization and efficiency
     */
    monitorSurgeUtilization(incidentId: string): Promise<any>;
    /**
     * Private helper: Generate scaling steps
     */
    private generateScalingSteps;
    /**
     * Private helper: Calculate surge efficiency
     */
    private calculateSurgeEfficiency;
}
/**
 * Resource Pooling Service
 *
 * Manages shared resource pools, fleet management,
 * and multi-agency resource sharing strategies.
 */
export declare class ResourcePoolingService {
    private readonly resourcePoolModel;
    private readonly responseUnitModel;
    private readonly poolAssignmentModel;
    private readonly logger;
    constructor(resourcePoolModel: any, responseUnitModel: any, poolAssignmentModel: any);
    /**
     * Create and manage shared resource pools
     */
    createSharedResourcePool(pool: {
        name: string;
        participatingAgencies: string[];
        resourceTypes: string[];
        allocationRules: any;
        costSharingModel: any;
        governanceStructure: any;
    }): Promise<any>;
    /**
     * Allocate pooled resources to requesting agencies
     */
    allocatePooledResources(allocation: {
        poolId: string;
        requestingAgency: string;
        resourceType: string;
        quantity: number;
        duration: number;
        priority: string;
        justification: string;
    }): Promise<any>;
    /**
     * Manage fleet rotation and maintenance schedules
     */
    manageFleetRotation(rotation: {
        poolId: string;
        rotationType: string;
        schedule: any;
        maintenanceCriteria: any;
    }): Promise<any>;
    /**
     * Optimize resource sharing across agencies
     */
    optimizeResourceSharing(optimization: {
        poolId: string;
        optimizationGoals: string[];
        constraints: any;
        timeHorizon: number;
    }): Promise<any>;
    /**
     * Track pool utilization metrics
     */
    trackPoolUtilization(poolId: string, period: {
        start: Date;
        end: Date;
    }): Promise<any>;
    /**
     * Private helper: Evaluate maintenance need
     */
    private evaluateMaintenanceNeed;
    /**
     * Private helper: Schedule next maintenance
     */
    private scheduleNextMaintenance;
    /**
     * Private helper: Calculate next rotation
     */
    private calculateNextRotation;
    /**
     * Private helper: Forecast agency demand
     */
    private forecastAgencyDemand;
    /**
     * Private helper: Calculate optimal allocation
     */
    private calculateOptimalAllocation;
    /**
     * Private helper: Calculate average utilization
     */
    private calculateAverageUtilization;
    /**
     * Private helper: Calculate peak utilization
     */
    private calculatePeakUtilization;
    /**
     * Private helper: Calculate agency utilization
     */
    private calculateAgencyUtilization;
    /**
     * Private helper: Calculate cost sharing
     */
    private calculateCostSharing;
}
/**
 * Coverage Optimization Service
 *
 * Analyzes and optimizes emergency service coverage,
 * identifies gaps, and recommends deployment strategies.
 */
export declare class CoverageOptimizationService {
    private readonly serviceAreaModel;
    private readonly responseUnitModel;
    private readonly coverageAnalysisModel;
    private readonly analyticsService;
    private readonly logger;
    constructor(serviceAreaModel: any, responseUnitModel: any, coverageAnalysisModel: any, analyticsService: any);
    /**
     * Analyze current emergency service coverage
     */
    analyzeServiceCoverage(analysis: {
        serviceAreaId: string;
        responseTimeTargets: {
            emergency: number;
            urgent: number;
            routine: number;
        };
        populationDensity?: boolean;
        riskFactors?: boolean;
    }): Promise<any>;
    /**
     * Identify and prioritize coverage gaps
     */
    identifyServiceGaps(serviceArea: any, deployedUnits: any[]): Promise<any[]>;
    /**
     * Recommend optimal station locations
     */
    recommendStationLocations(serviceAreaId: string, criteria: {
        numberOfStations?: number;
        responseTimeTarget: number;
        budgetConstraint?: number;
        populationWeight?: number;
        incidentWeight?: number;
    }): Promise<any[]>;
    /**
     * Calculate response time isochrones for coverage visualization
     */
    calculateResponseTimeIsochrones(unitId: string, timeIntervals: number[]): Promise<any>;
    /**
     * Optimize deployment patterns for maximum coverage
     */
    optimizeDeploymentPatterns(optimization: {
        serviceAreaId: string;
        availableUnits: number;
        objectives: string[];
        constraints: any;
    }): Promise<any>;
    /**
     * Monitor real-time coverage metrics
     */
    monitorRealTimeCoverage(serviceAreaId: string): Promise<any>;
    /**
     * Private helper: Calculate average response time
     */
    private calculateAverageResponseTime;
    /**
     * Private helper: Calculate coverage percentage
     */
    private calculateCoveragePercentage;
    /**
     * Private helper: Divide into zones
     */
    private divideIntoZones;
    /**
     * Private helper: Find nearest unit
     */
    private findNearestUnit;
    /**
     * Private helper: Estimate response time
     */
    private estimateResponseTime;
    /**
     * Private helper: Calculate gap priority
     */
    private calculateGapPriority;
    /**
     * Private helper: Generate location candidates
     */
    private generateLocationCandidates;
    /**
     * Private helper: Optimize location selection
     */
    private optimizeLocationSelection;
    /**
     * Private helper: Calculate coverage area
     */
    private calculateCoverageArea;
    /**
     * Private helper: Calculate fixed deployments
     */
    private calculateFixedDeployments;
    /**
     * Private helper: Calculate dynamic deployments
     */
    private calculateDynamicDeployments;
    /**
     * Private helper: Calculate hybrid deployments
     */
    private calculateHybridDeployments;
    /**
     * Private helper: Select optimal pattern
     */
    private selectOptimalPattern;
    /**
     * Private helper: Generate coverage recommendations
     */
    private generateCoverageRecommendations;
    /**
     * Private helper: Calculate coverage score
     */
    private calculateCoverageScore;
    /**
     * Private helper: Identify vulnerable zones
     */
    private identifyVulnerableZones;
}
/**
 * Workload Balancing Service
 *
 * Manages workload distribution across units and personnel,
 * prevents burnout, and optimizes resource utilization.
 */
export declare class WorkloadBalancingService {
    private readonly responseUnitModel;
    private readonly workloadMetricsModel;
    private readonly staffRosterModel;
    private readonly logger;
    constructor(responseUnitModel: any, workloadMetricsModel: any, staffRosterModel: any);
    /**
     * Distribute calls evenly across available units
     */
    distributeCallsEvenly(distribution: {
        serviceArea: string;
        availableUnits: string[];
        queuedCalls: string[];
        balancingStrategy: string;
    }): Promise<any>;
    /**
     * Monitor unit fatigue levels and rest requirements
     */
    monitorUnitFatigue(unitId: string): Promise<any>;
    /**
     * Balance workload across shifts
     */
    balanceShiftWorkload(balancing: {
        serviceArea: string;
        shifts: string[];
        targetBalance: number;
        considerSkillMix?: boolean;
    }): Promise<any>;
    /**
     * Implement automated workload rebalancing
     */
    implementAutomatedRebalancing(rebalancing: {
        serviceArea: string;
        trigger: string;
        thresholds: any;
    }): Promise<any>;
    /**
     * Track personnel overtime and compliance
     */
    trackPersonnelOvertime(tracking: {
        personnelId?: string;
        serviceArea?: string;
        period: {
            start: Date;
            end: Date;
        };
    }): Promise<any>;
    /**
     * Private helper: Calculate balanced assignments
     */
    private calculateBalancedAssignments;
    /**
     * Private helper: Calculate fairness score
     */
    private calculateFairnessScore;
    /**
     * Private helper: Calculate fatigue score
     */
    private calculateFatigueScore;
    /**
     * Private helper: Generate shift recommendations
     */
    private generateShiftRecommendations;
    /**
     * Private helper: Calculate shift balance score
     */
    private calculateShiftBalanceScore;
    /**
     * Private helper: Evaluate rebalancing need
     */
    private evaluateRebalancingNeed;
    /**
     * Private helper: Generate rebalancing actions
     */
    private generateRebalancingActions;
}
/**
 * Equipment Staging Service
 *
 * Manages strategic pre-positioning of specialized equipment,
 * cache management, and logistics coordination.
 */
export declare class EquipmentStagingService {
    private readonly equipmentModel;
    private readonly stagingLocationModel;
    private readonly equipmentDeploymentModel;
    private readonly logger;
    constructor(equipmentModel: any, stagingLocationModel: any, equipmentDeploymentModel: any);
    /**
     * Position specialized equipment strategically
     */
    positionSpecializedEquipment(positioning: {
        equipmentIds: string[];
        targetLocation: any;
        positioningReason: string;
        duration?: number;
        eventId?: string;
    }): Promise<any>;
    /**
     * Manage equipment caches for rapid deployment
     */
    manageEquipmentCaches(cache: {
        name: string;
        location: any;
        cacheType: string;
        equipment: Array<{
            type: string;
            quantity: number;
        }>;
        accessRestrictions?: string[];
        maintenanceSchedule?: any;
    }): Promise<any>;
    /**
     * Coordinate equipment logistics and transport
     */
    coordinateEquipmentLogistics(logistics: {
        equipmentIds: string[];
        fromLocation: any;
        toLocation: any;
        transportMode: string;
        priority: string;
        requiredBy?: Date;
    }): Promise<any>;
    /**
     * Track equipment inventory and readiness
     */
    trackEquipmentInventory(locationId: string): Promise<any>;
    /**
     * Implement automated equipment positioning based on forecasts
     */
    implementAutomatedPositioning(automation: {
        serviceArea: string;
        equipmentTypes: string[];
        forecastPeriod: {
            start: Date;
            end: Date;
        };
        repositionThreshold: number;
    }): Promise<any>;
    /**
     * Private helper: Calculate arrival time
     */
    private calculateArrivalTime;
    /**
     * Private helper: Group by type
     */
    private groupByType;
    /**
     * Private helper: Group by status
     */
    private groupByStatus;
    /**
     * Private helper: Generate repositioning plan
     */
    private generateRepositioningPlan;
}
export declare const ResourceAllocationServices: (typeof DynamicResourceAllocationService | typeof PredictiveDeploymentService | typeof MutualAidCoordinationService | typeof SurgeCapacityManagementService | typeof ResourcePoolingService | typeof CoverageOptimizationService | typeof WorkloadBalancingService | typeof EquipmentStagingService)[];
//# sourceMappingURL=resource-allocation-services.d.ts.map