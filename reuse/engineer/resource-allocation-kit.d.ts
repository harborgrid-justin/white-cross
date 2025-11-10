/**
 * LOC: ENG-RA-001
 * File: /reuse/engineer/resource-allocation-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - sequelize-typescript
 *   - date-fns
 *
 * DOWNSTREAM (imported by):
 *   - Project management services
 *   - Resource planning systems
 *   - Engineering workflow modules
 */
import { Model } from 'sequelize';
interface Resource {
    id: string;
    name: string;
    type: ResourceType;
    department: string;
    email: string;
    phone?: string;
    status: ResourceStatus;
    skills: Skill[];
    capacity: number;
    costPerHour: number;
    location: string;
    manager?: string;
    seniority: SeniorityLevel;
    availability: AvailabilitySlot[];
    currentAllocation: number;
    maxUtilization: number;
}
type ResourceType = 'engineer' | 'designer' | 'architect' | 'project_manager' | 'qa_engineer' | 'devops' | 'technical_writer' | 'business_analyst';
type ResourceStatus = 'available' | 'allocated' | 'on_leave' | 'inactive';
type SeniorityLevel = 'junior' | 'mid' | 'senior' | 'lead' | 'principal';
interface Skill {
    name: string;
    category: string;
    proficiency: SkillProficiency;
    yearsOfExperience: number;
    certifications?: string[];
    lastUsed?: Date;
}
type SkillProficiency = 'beginner' | 'intermediate' | 'advanced' | 'expert';
interface AvailabilitySlot {
    startDate: Date;
    endDate: Date;
    availableHours: number;
    type: 'available' | 'partial' | 'unavailable';
    reason?: string;
}
interface ResourceAllocation {
    id: string;
    resourceId: string;
    projectId: string;
    projectName: string;
    startDate: Date;
    endDate: Date;
    allocatedHours: number;
    allocationPercentage: number;
    role: string;
    priority: AllocationPriority;
    status: AllocationStatus;
    billable: boolean;
    assignedBy: string;
    assignedAt: Date;
    notes?: string;
}
type AllocationPriority = 'critical' | 'high' | 'medium' | 'low';
type AllocationStatus = 'proposed' | 'confirmed' | 'active' | 'completed' | 'cancelled' | 'on_hold';
interface AllocationRequest {
    projectId: string;
    projectName: string;
    requiredSkills: SkillRequirement[];
    startDate: Date;
    endDate: Date;
    hoursRequired: number;
    hoursPerWeek?: number;
    priority: AllocationPriority;
    requestedBy: string;
    budget?: number;
    mustHaveSkills?: string[];
    niceToHaveSkills?: string[];
}
interface SkillRequirement {
    skill: string;
    proficiency: SkillProficiency;
    required: boolean;
    weight: number;
}
interface ResourceMatch {
    resource: Resource;
    matchScore: number;
    availabilityScore: number;
    skillMatchScore: number;
    costScore: number;
    conflicts: AllocationConflict[];
    recommendation: string;
}
interface AllocationConflict {
    type: ConflictType;
    severity: 'critical' | 'high' | 'medium' | 'low';
    description: string;
    conflictingAllocation?: ResourceAllocation;
    affectedPeriod: DateRange;
    resolution?: string;
}
type ConflictType = 'over_allocation' | 'time_overlap' | 'availability_mismatch' | 'skill_mismatch' | 'budget_exceeded' | 'priority_conflict';
interface DateRange {
    start: Date;
    end: Date;
}
interface CapacityPlan {
    resourceId: string;
    resourceName: string;
    period: DateRange;
    totalCapacity: number;
    allocatedCapacity: number;
    availableCapacity: number;
    utilizationRate: number;
    allocations: ResourceAllocation[];
    forecast: CapacityForecast[];
}
interface CapacityForecast {
    period: string;
    demandHours: number;
    availableHours: number;
    gap: number;
    confidence: number;
}
interface ResourcePool {
    id: string;
    name: string;
    description: string;
    department: string;
    resources: Resource[];
    totalCapacity: number;
    totalAllocated: number;
    averageUtilization: number;
    costPerHour: number;
    skills: string[];
}
interface AllocationOptimization {
    request: AllocationRequest;
    recommendedAllocations: OptimalAllocation[];
    totalCost: number;
    averageSkillMatch: number;
    riskFactors: string[];
    alternativeOptions: AlternativeAllocation[];
}
interface OptimalAllocation {
    resource: Resource;
    hoursAllocated: number;
    allocationPercentage: number;
    cost: number;
    skillMatch: number;
    conflicts: AllocationConflict[];
}
interface AlternativeAllocation {
    description: string;
    allocations: OptimalAllocation[];
    totalCost: number;
    pros: string[];
    cons: string[];
}
interface UtilizationMetrics {
    resourceId: string;
    resourceName: string;
    period: DateRange;
    totalHours: number;
    billableHours: number;
    nonBillableHours: number;
    utilizationRate: number;
    billableRate: number;
    idleTime: number;
    projectCount: number;
    revenue: number;
}
interface ResourceDemand {
    skill: string;
    requiredCount: number;
    currentCount: number;
    gap: number;
    urgency: 'immediate' | 'near_term' | 'future';
    projects: string[];
}
/**
 * Calculates resource capacity for a given period.
 *
 * @param {Resource} resource - Resource to analyze
 * @param {DateRange} period - Time period
 * @returns {CapacityPlan} Capacity plan with allocations and forecasts
 *
 * @example
 * ```typescript
 * const capacity = calculateResourceCapacity(engineer, {
 *   start: new Date('2024-01-01'),
 *   end: new Date('2024-12-31')
 * });
 * console.log(`Utilization: ${capacity.utilizationRate}%`);
 * ```
 */
export declare const calculateResourceCapacity: (resource: Resource, period: DateRange, allocations?: ResourceAllocation[]) => CapacityPlan;
/**
 * Generates capacity forecast for future periods.
 *
 * @param {Resource} resource - Resource to forecast
 * @param {DateRange} period - Forecast period
 * @param {ResourceAllocation[]} existingAllocations - Current allocations
 * @returns {CapacityForecast[]} Weekly capacity forecasts
 *
 * @example
 * ```typescript
 * const forecast = generateCapacityForecast(resource, period, allocations);
 * forecast.forEach(f => console.log(`${f.period}: Gap ${f.gap} hours`));
 * ```
 */
export declare const generateCapacityForecast: (resource: Resource, period: DateRange, existingAllocations: ResourceAllocation[]) => CapacityForecast[];
/**
 * Identifies resource capacity bottlenecks.
 *
 * @param {CapacityPlan[]} capacityPlans - Capacity plans to analyze
 * @param {number} threshold - Utilization threshold (percentage)
 * @returns {Resource[]} Over-utilized resources
 *
 * @example
 * ```typescript
 * const bottlenecks = identifyCapacityBottlenecks(plans, 85);
 * bottlenecks.forEach(r => console.log(`${r.name} is over-utilized`));
 * ```
 */
export declare const identifyCapacityBottlenecks: (capacityPlans: CapacityPlan[], threshold?: number) => CapacityPlan[];
/**
 * Calculates team-wide capacity metrics.
 *
 * @param {Resource[]} resources - Team resources
 * @param {DateRange} period - Analysis period
 * @param {ResourceAllocation[]} allocations - Current allocations
 * @returns {Object} Team capacity metrics
 *
 * @example
 * ```typescript
 * const teamMetrics = calculateTeamCapacity(engineers, period, allocations);
 * console.log(`Team utilization: ${teamMetrics.averageUtilization}%`);
 * ```
 */
export declare const calculateTeamCapacity: (resources: Resource[], period: DateRange, allocations: ResourceAllocation[]) => {
    totalCapacity: number;
    totalAllocated: number;
    totalAvailable: number;
    averageUtilization: number;
    resourceCount: number;
    bottlenecks: CapacityPlan[];
    underutilized: CapacityPlan[];
};
/**
 * Greedy allocation algorithm - assigns resources based on best immediate match.
 *
 * @param {AllocationRequest} request - Allocation request
 * @param {Resource[]} availableResources - Available resources
 * @returns {ResourceMatch[]} Matched resources sorted by score
 *
 * @example
 * ```typescript
 * const matches = greedyAllocationAlgorithm(request, resources);
 * const best = matches[0];
 * console.log(`Best match: ${best.resource.name} (${best.matchScore}%)`);
 * ```
 */
export declare const greedyAllocationAlgorithm: (request: AllocationRequest, availableResources: Resource[]) => ResourceMatch[];
/**
 * Optimal allocation algorithm - finds best resource combination for request.
 *
 * @param {AllocationRequest} request - Allocation request
 * @param {Resource[]} resources - Available resources
 * @param {ResourceAllocation[]} existingAllocations - Current allocations
 * @returns {AllocationOptimization} Optimal allocation plan
 *
 * @example
 * ```typescript
 * const optimal = optimalAllocationAlgorithm(request, resources, allocations);
 * optimal.recommendedAllocations.forEach(a => {
 *   console.log(`${a.resource.name}: ${a.hoursAllocated}h`);
 * });
 * ```
 */
export declare const optimalAllocationAlgorithm: (request: AllocationRequest, resources: Resource[], existingAllocations: ResourceAllocation[]) => AllocationOptimization;
/**
 * Load balancing algorithm - distributes work evenly across resources.
 *
 * @param {AllocationRequest[]} requests - Multiple allocation requests
 * @param {Resource[]} resources - Available resources
 * @returns {Map<string, ResourceAllocation[]>} Balanced allocations per resource
 *
 * @example
 * ```typescript
 * const balanced = loadBalancingAlgorithm(requests, team);
 * balanced.forEach((allocations, resourceId) => {
 *   console.log(`${resourceId}: ${allocations.length} projects`);
 * });
 * ```
 */
export declare const loadBalancingAlgorithm: (requests: AllocationRequest[], resources: Resource[]) => Map<string, ResourceAllocation[]>;
/**
 * Detects allocation conflicts for a resource.
 *
 * @param {Resource} resource - Resource to check
 * @param {ResourceAllocation} newAllocation - Proposed allocation
 * @param {ResourceAllocation[]} existingAllocations - Current allocations
 * @returns {AllocationConflict[]} Detected conflicts
 *
 * @example
 * ```typescript
 * const conflicts = detectAllocationConflicts(engineer, allocation, existing);
 * if (conflicts.length > 0) {
 *   console.log('Conflicts detected:', conflicts.map(c => c.description));
 * }
 * ```
 */
export declare const detectAllocationConflicts: (resource: Resource, newAllocation: ResourceAllocation, existingAllocations: ResourceAllocation[]) => AllocationConflict[];
/**
 * Resolves allocation conflicts automatically where possible.
 *
 * @param {AllocationConflict[]} conflicts - Conflicts to resolve
 * @param {Resource} resource - Affected resource
 * @param {ResourceAllocation} allocation - Proposed allocation
 * @returns {Object} Resolution plan
 *
 * @example
 * ```typescript
 * const resolution = resolveAllocationConflicts(conflicts, resource, allocation);
 * console.log(`Strategy: ${resolution.strategy}`);
 * ```
 */
export declare const resolveAllocationConflicts: (conflicts: AllocationConflict[], resource: Resource, allocation: ResourceAllocation) => {
    resolvable: boolean;
    strategy: string;
    recommendations: string[];
    conflicts: AllocationConflict[];
    adjustedAllocation?: undefined;
} | {
    resolvable: boolean;
    strategy: string;
    adjustedAllocation: {
        allocationPercentage: number;
        allocatedHours: number;
        id: string;
        resourceId: string;
        projectId: string;
        projectName: string;
        startDate: Date;
        endDate: Date;
        role: string;
        priority: AllocationPriority;
        status: AllocationStatus;
        billable: boolean;
        assignedBy: string;
        assignedAt: Date;
        notes?: string;
    };
    recommendations: string[];
    conflicts?: undefined;
} | {
    resolvable: boolean;
    strategy: string;
    recommendations: string[];
    conflicts?: undefined;
    adjustedAllocation?: undefined;
};
/**
 * Validates allocation feasibility.
 *
 * @param {ResourceAllocation} allocation - Allocation to validate
 * @param {Resource} resource - Resource being allocated
 * @param {ResourceAllocation[]} existingAllocations - Current allocations
 * @returns {Object} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateAllocationFeasibility(allocation, resource, existing);
 * if (!validation.isValid) {
 *   console.log('Validation failed:', validation.errors);
 * }
 * ```
 */
export declare const validateAllocationFeasibility: (allocation: ResourceAllocation, resource: Resource, existingAllocations: ResourceAllocation[]) => {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    conflicts: AllocationConflict[];
    recommendation: string;
};
/**
 * Calculates resource utilization metrics.
 *
 * @param {Resource} resource - Resource to analyze
 * @param {DateRange} period - Analysis period
 * @param {ResourceAllocation[]} allocations - Resource allocations
 * @returns {UtilizationMetrics} Utilization metrics
 *
 * @example
 * ```typescript
 * const metrics = calculateUtilizationMetrics(engineer, period, allocations);
 * console.log(`Billable rate: ${metrics.billableRate}%`);
 * ```
 */
export declare const calculateUtilizationMetrics: (resource: Resource, period: DateRange, allocations: ResourceAllocation[]) => UtilizationMetrics;
/**
 * Generates utilization report for multiple resources.
 *
 * @param {Resource[]} resources - Resources to analyze
 * @param {DateRange} period - Analysis period
 * @param {ResourceAllocation[]} allocations - All allocations
 * @returns {UtilizationMetrics[]} Utilization metrics for all resources
 *
 * @example
 * ```typescript
 * const report = generateUtilizationReport(team, period, allocations);
 * report.forEach(m => console.log(`${m.resourceName}: ${m.utilizationRate}%`));
 * ```
 */
export declare const generateUtilizationReport: (resources: Resource[], period: DateRange, allocations: ResourceAllocation[]) => UtilizationMetrics[];
/**
 * Identifies underutilized resources.
 *
 * @param {UtilizationMetrics[]} metrics - Utilization metrics
 * @param {number} threshold - Underutilization threshold (percentage)
 * @returns {UtilizationMetrics[]} Underutilized resources
 *
 * @example
 * ```typescript
 * const underutilized = identifyUnderutilizedResources(metrics, 60);
 * console.log(`Found ${underutilized.length} underutilized resources`);
 * ```
 */
export declare const identifyUnderutilizedResources: (metrics: UtilizationMetrics[], threshold?: number) => UtilizationMetrics[];
/**
 * Tracks allocation vs actual hours.
 *
 * @param {ResourceAllocation} allocation - Allocation to track
 * @param {number} actualHours - Actual hours worked
 * @returns {Object} Variance analysis
 *
 * @example
 * ```typescript
 * const variance = trackAllocationVsActual(allocation, 160);
 * if (variance.variancePercentage > 10) {
 *   console.log('Significant variance detected');
 * }
 * ```
 */
export declare const trackAllocationVsActual: (allocation: ResourceAllocation, actualHours: number) => {
    allocation: ResourceAllocation;
    plannedHours: number;
    actualHours: number;
    variance: number;
    variancePercentage: number;
    status: string;
    recommendation: string;
};
/**
 * Forecasts resource demand based on historical data.
 *
 * @param {ResourceAllocation[]} historicalAllocations - Past allocations
 * @param {number} forecastMonths - Months to forecast
 * @returns {Object} Demand forecast
 *
 * @example
 * ```typescript
 * const forecast = forecastResourceDemand(historical, 6);
 * console.log(`Expected demand: ${forecast.averageMonthlyDemand} hours/month`);
 * ```
 */
export declare const forecastResourceDemand: (historicalAllocations: ResourceAllocation[], forecastMonths?: number) => {
    averageMonthlyDemand: number;
    standardDeviation: number;
    forecast: {
        month: any;
        expectedDemand: number;
        lowEstimate: number;
        highEstimate: number;
        confidence: number;
    }[];
    trend: "stable" | "increasing" | "decreasing";
};
/**
 * Identifies skill gaps in resource pool.
 *
 * @param {AllocationRequest[]} upcomingRequests - Future requests
 * @param {Resource[]} availableResources - Current resources
 * @returns {ResourceDemand[]} Skill gap analysis
 *
 * @example
 * ```typescript
 * const gaps = identifySkillGaps(requests, resources);
 * gaps.forEach(gap => {
 *   console.log(`Need ${gap.gap} more ${gap.skill} resources`);
 * });
 * ```
 */
export declare const identifySkillGaps: (upcomingRequests: AllocationRequest[], availableResources: Resource[]) => ResourceDemand[];
/**
 * Plans for future capacity needs.
 *
 * @param {AllocationRequest[]} pipeline - Project pipeline
 * @param {Resource[]} currentResources - Current team
 * @param {DateRange} planningHorizon - Planning period
 * @returns {Object} Capacity plan recommendations
 *
 * @example
 * ```typescript
 * const plan = planFutureCapacity(pipeline, team, { start, end });
 * console.log(`Hiring needs: ${plan.hiringRecommendations.length}`);
 * ```
 */
export declare const planFutureCapacity: (pipeline: AllocationRequest[], currentResources: Resource[], planningHorizon: DateRange) => {
    totalDemand: number;
    currentCapacity: number;
    capacityGap: number;
    skillGaps: ResourceDemand[];
    hiringRecommendations: string[];
    trainingRecommendations: string[];
    contractorRecommendations: string[];
};
/**
 * Balances resources across multiple projects.
 *
 * @param {AllocationRequest[]} requests - Project requests
 * @param {Resource[]} resources - Available resources
 * @param {string} strategy - Balancing strategy
 * @returns {Map<string, ResourceAllocation[]>} Balanced allocations
 *
 * @example
 * ```typescript
 * const balanced = balanceMultiProjectResources(requests, team, 'equal_distribution');
 * ```
 */
export declare const balanceMultiProjectResources: (requests: AllocationRequest[], resources: Resource[], strategy?: "equal_distribution" | "priority_based" | "skill_optimized") => Map<string, ResourceAllocation[]>;
/**
 * Optimizes resource allocation across portfolio.
 *
 * @param {AllocationRequest[]} portfolio - All projects
 * @param {Resource[]} resources - All resources
 * @returns {Object} Portfolio optimization results
 *
 * @example
 * ```typescript
 * const optimized = optimizePortfolioAllocation(portfolio, resources);
 * console.log(`Total cost: $${optimized.totalCost}`);
 * ```
 */
export declare const optimizePortfolioAllocation: (portfolio: AllocationRequest[], resources: Resource[]) => {
    totalCost: number;
    totalAllocations: number;
    projectCount: number;
    averageCostPerProject: number;
    allocations: Map<string, ResourceAllocation[]>;
    utilizationRate: number;
};
/**
 * Creates and manages resource pools.
 *
 * @param {string} name - Pool name
 * @param {Resource[]} resources - Pool resources
 * @returns {ResourcePool} Created resource pool
 *
 * @example
 * ```typescript
 * const engineeringPool = createResourcePool('Engineering', engineers);
 * console.log(`Pool capacity: ${engineeringPool.totalCapacity} hours/week`);
 * ```
 */
export declare const createResourcePool: (name: string, resources: Resource[], description?: string) => ResourcePool;
/**
 * Manages shared resource pools across departments.
 *
 * @param {ResourcePool[]} pools - Department pools
 * @param {AllocationRequest} request - Cross-department request
 * @returns {ResourceMatch[]} Matches from all pools
 *
 * @example
 * ```typescript
 * const matches = manageSharedResourcePools([engPool, designPool], request);
 * ```
 */
export declare const manageSharedResourcePools: (pools: ResourcePool[], request: AllocationRequest) => ResourceMatch[];
/**
 * Matches resources based on skill requirements.
 *
 * @param {Resource[]} resources - Available resources
 * @param {SkillRequirement[]} requirements - Required skills
 * @returns {ResourceMatch[]} Ranked matches
 *
 * @example
 * ```typescript
 * const matches = matchResourcesBySkills(team, requirements);
 * console.log(`Best match: ${matches[0].resource.name}`);
 * ```
 */
export declare const matchResourcesBySkills: (resources: Resource[], requirements: SkillRequirement[]) => ResourceMatch[];
/**
 * Calculates skill match percentage.
 *
 * @param {Resource} resource - Resource to evaluate
 * @param {SkillRequirement[]} requirements - Required skills
 * @returns {number} Match percentage (0-100)
 *
 * @example
 * ```typescript
 * const match = calculateSkillMatch(engineer, requirements);
 * console.log(`Skill match: ${match}%`);
 * ```
 */
export declare const calculateSkillMatch: (resource: Resource, requirements: SkillRequirement[]) => number;
/**
 * Finds resources with specific skill combinations.
 *
 * @param {Resource[]} resources - All resources
 * @param {string[]} skills - Required skill combination
 * @param {SkillProficiency} minProficiency - Minimum proficiency
 * @returns {Resource[]} Matching resources
 *
 * @example
 * ```typescript
 * const fullStack = findResourcesBySkillCombination(
 *   team,
 *   ['React', 'Node.js', 'PostgreSQL'],
 *   'intermediate'
 * );
 * ```
 */
export declare const findResourcesBySkillCombination: (resources: Resource[], skills: string[], minProficiency?: SkillProficiency) => Resource[];
/**
 * Generates availability calendar for resource.
 *
 * @param {Resource} resource - Resource to analyze
 * @param {DateRange} period - Calendar period
 * @param {ResourceAllocation[]} allocations - Current allocations
 * @returns {Object[]} Daily availability slots
 *
 * @example
 * ```typescript
 * const calendar = generateAvailabilityCalendar(engineer, period, allocations);
 * calendar.forEach(day => console.log(`${day.date}: ${day.availableHours}h`));
 * ```
 */
export declare const generateAvailabilityCalendar: (resource: Resource, period: DateRange, allocations: ResourceAllocation[]) => {
    date: any;
    dayOfWeek: number;
    totalCapacity: number;
    allocatedHours: number;
    availableHours: number;
    utilizationRate: number;
    allocations: ResourceAllocation[];
}[];
/**
 * Finds available time slots for resource.
 *
 * @param {Resource} resource - Resource to check
 * @param {number} hoursNeeded - Hours required
 * @param {DateRange} searchPeriod - Period to search
 * @param {ResourceAllocation[]} allocations - Current allocations
 * @returns {DateRange[]} Available slots
 *
 * @example
 * ```typescript
 * const slots = findAvailableTimeSlots(engineer, 40, period, allocations);
 * console.log(`Found ${slots.length} available slots`);
 * ```
 */
export declare const findAvailableTimeSlots: (resource: Resource, hoursNeeded: number, searchPeriod: DateRange, allocations: ResourceAllocation[]) => DateRange[];
/**
 * NestJS service for resource allocation management.
 * Provides comprehensive resource allocation operations with dependency injection.
 *
 * @example
 * ```typescript
 * @Module({
 *   providers: [ResourceAllocationService],
 *   exports: [ResourceAllocationService],
 * })
 * export class ResourceModule {}
 * ```
 */
export declare class ResourceAllocationService {
    private readonly resourceModel;
    private readonly allocationModel;
    private readonly logger;
    constructor(resourceModel: typeof Model, allocationModel: typeof Model);
    /**
     * Allocates resources to a project using optimal algorithm.
     */
    allocateResourceToProject(request: AllocationRequest): Promise<AllocationOptimization>;
    /**
     * Detects and resolves allocation conflicts.
     */
    detectAndResolveConflicts(resourceId: string, proposedAllocation: ResourceAllocation): Promise<{
        conflicts: AllocationConflict[];
        resolution: any;
    }>;
    /**
     * Generates capacity planning report.
     */
    generateCapacityReport(period: DateRange): Promise<{
        plans: CapacityPlan[];
        summary: any;
    }>;
}
/**
 * NestJS service for utilization tracking and analytics.
 */
export declare class UtilizationTrackingService {
    private readonly resourceModel;
    private readonly allocationModel;
    private readonly logger;
    constructor(resourceModel: typeof Model, allocationModel: typeof Model);
    /**
     * Generates comprehensive utilization report.
     */
    generateUtilizationReport(period: DateRange, departmentFilter?: string): Promise<UtilizationMetrics[]>;
    /**
     * Identifies and alerts on underutilized resources.
     */
    identifyUnderutilizedResources(threshold?: number): Promise<UtilizationMetrics[]>;
}
export {};
//# sourceMappingURL=resource-allocation-kit.d.ts.map