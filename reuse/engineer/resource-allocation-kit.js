"use strict";
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
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UtilizationTrackingService = exports.ResourceAllocationService = exports.findAvailableTimeSlots = exports.generateAvailabilityCalendar = exports.findResourcesBySkillCombination = exports.calculateSkillMatch = exports.matchResourcesBySkills = exports.manageSharedResourcePools = exports.createResourcePool = exports.optimizePortfolioAllocation = exports.balanceMultiProjectResources = exports.planFutureCapacity = exports.identifySkillGaps = exports.forecastResourceDemand = exports.trackAllocationVsActual = exports.identifyUnderutilizedResources = exports.generateUtilizationReport = exports.calculateUtilizationMetrics = exports.validateAllocationFeasibility = exports.resolveAllocationConflicts = exports.detectAllocationConflicts = exports.loadBalancingAlgorithm = exports.optimalAllocationAlgorithm = exports.greedyAllocationAlgorithm = exports.calculateTeamCapacity = exports.identifyCapacityBottlenecks = exports.generateCapacityForecast = exports.calculateResourceCapacity = void 0;
/**
 * File: /reuse/engineer/resource-allocation-kit.ts
 * Locator: WC-ENG-RA-001
 * Purpose: Resource Allocation Kit - Comprehensive resource planning, allocation, and optimization
 *
 * Upstream: Independent utility module for resource management operations
 * Downstream: ../backend/*, ../frontend/*, Engineering and project management services
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 45 utility functions for resource allocation, capacity planning, and optimization
 *
 * LLM Context: Enterprise-grade resource allocation utilities for engineering and project management.
 * Provides capacity planning, allocation algorithms (greedy, optimal), conflict detection and resolution,
 * utilization tracking, forecasting, multi-project balancing, resource pool management, skill-based
 * matching, and availability calendars. Essential for optimizing resource usage, reducing conflicts,
 * improving project delivery, and ensuring balanced workload distribution across teams.
 */
const common_1 = require("@nestjs/common");
const date_fns_1 = require("date-fns");
// ============================================================================
// RESOURCE CAPACITY PLANNING
// ============================================================================
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
const calculateResourceCapacity = (resource, period, allocations = []) => {
    const weeks = Math.ceil((0, date_fns_1.differenceInDays)(period.end, period.start) / 7);
    const totalCapacity = resource.capacity * weeks;
    // Calculate allocated capacity
    const allocatedCapacity = allocations
        .filter(a => a.resourceId === resource.id)
        .filter(a => isOverlapping({ start: a.startDate, end: a.endDate }, period))
        .reduce((sum, a) => {
        const allocWeeks = Math.ceil((0, date_fns_1.differenceInDays)(a.endDate, a.startDate) / 7);
        return sum + (a.allocatedHours * allocWeeks);
    }, 0);
    const availableCapacity = totalCapacity - allocatedCapacity;
    const utilizationRate = (allocatedCapacity / totalCapacity) * 100;
    return {
        resourceId: resource.id,
        resourceName: resource.name,
        period,
        totalCapacity,
        allocatedCapacity,
        availableCapacity,
        utilizationRate: Math.round(utilizationRate * 100) / 100,
        allocations: allocations.filter(a => a.resourceId === resource.id),
        forecast: (0, exports.generateCapacityForecast)(resource, period, allocations),
    };
};
exports.calculateResourceCapacity = calculateResourceCapacity;
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
const generateCapacityForecast = (resource, period, existingAllocations) => {
    const forecasts = [];
    let currentDate = new Date(period.start);
    while (currentDate < period.end) {
        const weekEnd = (0, date_fns_1.addWeeks)(currentDate, 1);
        const weekPeriod = { start: currentDate, end: weekEnd };
        // Calculate demand for this week
        const demandHours = existingAllocations
            .filter(a => a.resourceId === resource.id)
            .filter(a => isOverlapping({ start: a.startDate, end: a.endDate }, weekPeriod))
            .reduce((sum, a) => sum + a.allocatedHours, 0);
        const availableHours = resource.capacity;
        const gap = availableHours - demandHours;
        forecasts.push({
            period: (0, date_fns_1.format)(currentDate, 'yyyy-\'W\'II'),
            demandHours,
            availableHours,
            gap,
            confidence: 85, // Could be based on historical accuracy
        });
        currentDate = weekEnd;
    }
    return forecasts;
};
exports.generateCapacityForecast = generateCapacityForecast;
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
const identifyCapacityBottlenecks = (capacityPlans, threshold = 90) => {
    return capacityPlans.filter(plan => plan.utilizationRate > threshold);
};
exports.identifyCapacityBottlenecks = identifyCapacityBottlenecks;
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
const calculateTeamCapacity = (resources, period, allocations) => {
    const capacityPlans = resources.map(r => (0, exports.calculateResourceCapacity)(r, period, allocations));
    const totalCapacity = capacityPlans.reduce((sum, p) => sum + p.totalCapacity, 0);
    const totalAllocated = capacityPlans.reduce((sum, p) => sum + p.allocatedCapacity, 0);
    const totalAvailable = capacityPlans.reduce((sum, p) => sum + p.availableCapacity, 0);
    const averageUtilization = (totalAllocated / totalCapacity) * 100;
    return {
        totalCapacity,
        totalAllocated,
        totalAvailable,
        averageUtilization: Math.round(averageUtilization * 100) / 100,
        resourceCount: resources.length,
        bottlenecks: (0, exports.identifyCapacityBottlenecks)(capacityPlans),
        underutilized: capacityPlans.filter(p => p.utilizationRate < 60),
    };
};
exports.calculateTeamCapacity = calculateTeamCapacity;
// ============================================================================
// RESOURCE ALLOCATION ALGORITHMS
// ============================================================================
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
const greedyAllocationAlgorithm = (request, availableResources) => {
    const matches = availableResources.map(resource => {
        const skillMatchScore = (0, exports.calculateSkillMatch)(resource, request.requiredSkills);
        const availabilityScore = calculateAvailabilityScore(resource, { start: request.startDate, end: request.endDate }, request.hoursPerWeek || request.hoursRequired);
        const costScore = calculateCostScore(resource.costPerHour, request.budget);
        // Weighted average
        const matchScore = (skillMatchScore * 0.5) + (availabilityScore * 0.3) + (costScore * 0.2);
        return {
            resource,
            matchScore: Math.round(matchScore * 100) / 100,
            skillMatchScore: Math.round(skillMatchScore * 100) / 100,
            availabilityScore: Math.round(availabilityScore * 100) / 100,
            costScore: Math.round(costScore * 100) / 100,
            conflicts: [],
            recommendation: matchScore >= 80 ? 'Highly recommended' :
                matchScore >= 60 ? 'Good match' :
                    'Consider alternatives',
        };
    });
    return matches.sort((a, b) => b.matchScore - a.matchScore);
};
exports.greedyAllocationAlgorithm = greedyAllocationAlgorithm;
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
const optimalAllocationAlgorithm = (request, resources, existingAllocations) => {
    // Score and filter resources
    const matches = (0, exports.greedyAllocationAlgorithm)(request, resources);
    const topMatches = matches.filter(m => m.matchScore >= 50).slice(0, 10);
    // Generate allocation combinations
    const combinations = [];
    // Single resource allocation
    for (const match of topMatches) {
        const conflicts = (0, exports.detectAllocationConflicts)(match.resource, {
            resourceId: match.resource.id,
            projectId: request.projectId,
            projectName: request.projectName,
            startDate: request.startDate,
            endDate: request.endDate,
            allocatedHours: request.hoursPerWeek || 40,
            allocationPercentage: 100,
            role: 'Engineer',
            priority: request.priority,
            status: 'proposed',
            billable: true,
            assignedBy: request.requestedBy,
            assignedAt: new Date(),
        }, existingAllocations);
        if (conflicts.filter(c => c.severity === 'critical').length === 0) {
            combinations.push([{
                    resource: match.resource,
                    hoursAllocated: request.hoursRequired,
                    allocationPercentage: 100,
                    cost: request.hoursRequired * match.resource.costPerHour,
                    skillMatch: match.skillMatchScore,
                    conflicts,
                }]);
        }
    }
    // Multi-resource allocation (split work)
    if (request.hoursRequired > 160) { // More than 1 month for 1 person
        for (let i = 0; i < topMatches.length - 1; i++) {
            for (let j = i + 1; j < topMatches.length; j++) {
                const split1 = request.hoursRequired * 0.6;
                const split2 = request.hoursRequired * 0.4;
                combinations.push([
                    {
                        resource: topMatches[i].resource,
                        hoursAllocated: split1,
                        allocationPercentage: 60,
                        cost: split1 * topMatches[i].resource.costPerHour,
                        skillMatch: topMatches[i].skillMatchScore,
                        conflicts: [],
                    },
                    {
                        resource: topMatches[j].resource,
                        hoursAllocated: split2,
                        allocationPercentage: 40,
                        cost: split2 * topMatches[j].resource.costPerHour,
                        skillMatch: topMatches[j].skillMatchScore,
                        conflicts: [],
                    },
                ]);
            }
        }
    }
    // Evaluate combinations
    const evaluatedCombinations = combinations.map(combo => ({
        allocations: combo,
        totalCost: combo.reduce((sum, a) => sum + a.cost, 0),
        averageSkillMatch: combo.reduce((sum, a) => sum + a.skillMatch, 0) / combo.length,
        conflictCount: combo.reduce((sum, a) => sum + a.conflicts.length, 0),
    }));
    // Sort by: skill match (desc), cost (asc), conflicts (asc)
    evaluatedCombinations.sort((a, b) => {
        if (Math.abs(a.averageSkillMatch - b.averageSkillMatch) > 5) {
            return b.averageSkillMatch - a.averageSkillMatch;
        }
        if (Math.abs(a.totalCost - b.totalCost) > 1000) {
            return a.totalCost - b.totalCost;
        }
        return a.conflictCount - b.conflictCount;
    });
    const best = evaluatedCombinations[0] || { allocations: [], totalCost: 0, averageSkillMatch: 0 };
    return {
        request,
        recommendedAllocations: best.allocations,
        totalCost: best.totalCost,
        averageSkillMatch: best.averageSkillMatch,
        riskFactors: identifyRiskFactors(best.allocations, request),
        alternativeOptions: evaluatedCombinations.slice(1, 4).map((combo, idx) => ({
            description: `Alternative ${idx + 1}: ${combo.allocations.map(a => a.resource.name).join(', ')}`,
            allocations: combo.allocations,
            totalCost: combo.totalCost,
            pros: generatePros(combo),
            cons: generateCons(combo),
        })),
    };
};
exports.optimalAllocationAlgorithm = optimalAllocationAlgorithm;
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
const loadBalancingAlgorithm = (requests, resources) => {
    const allocations = new Map();
    // Initialize
    resources.forEach(r => allocations.set(r.id, []));
    // Sort requests by priority
    const sortedRequests = [...requests].sort((a, b) => {
        const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
    // Allocate to least loaded resource
    for (const request of sortedRequests) {
        const matches = (0, exports.greedyAllocationAlgorithm)(request, resources);
        // Find resource with lowest current load
        let bestResource = null;
        let lowestLoad = Infinity;
        for (const match of matches) {
            if (match.matchScore < 50)
                continue;
            const currentLoad = allocations.get(match.resource.id)?.length || 0;
            if (currentLoad < lowestLoad) {
                lowestLoad = currentLoad;
                bestResource = match.resource;
            }
        }
        if (bestResource) {
            const allocation = {
                id: `ALLOC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                resourceId: bestResource.id,
                projectId: request.projectId,
                projectName: request.projectName,
                startDate: request.startDate,
                endDate: request.endDate,
                allocatedHours: request.hoursPerWeek || 40,
                allocationPercentage: ((request.hoursPerWeek || 40) / bestResource.capacity) * 100,
                role: 'Engineer',
                priority: request.priority,
                status: 'proposed',
                billable: true,
                assignedBy: request.requestedBy,
                assignedAt: new Date(),
            };
            allocations.get(bestResource.id).push(allocation);
        }
    }
    return allocations;
};
exports.loadBalancingAlgorithm = loadBalancingAlgorithm;
// ============================================================================
// CONFLICT DETECTION AND RESOLUTION
// ============================================================================
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
const detectAllocationConflicts = (resource, newAllocation, existingAllocations) => {
    const conflicts = [];
    const resourceAllocations = existingAllocations.filter(a => a.resourceId === resource.id && a.status !== 'cancelled');
    // Check time overlaps
    for (const existing of resourceAllocations) {
        if (isOverlapping({ start: existing.startDate, end: existing.endDate }, { start: newAllocation.startDate, end: newAllocation.endDate })) {
            const totalHours = existing.allocatedHours + newAllocation.allocatedHours;
            const totalPercentage = (totalHours / resource.capacity) * 100;
            if (totalPercentage > resource.maxUtilization) {
                conflicts.push({
                    type: 'over_allocation',
                    severity: totalPercentage > 120 ? 'critical' : 'high',
                    description: `Resource over-allocated: ${Math.round(totalPercentage)}% (max ${resource.maxUtilization}%)`,
                    conflictingAllocation: existing,
                    affectedPeriod: {
                        start: new Date(Math.max(existing.startDate.getTime(), newAllocation.startDate.getTime())),
                        end: new Date(Math.min(existing.endDate.getTime(), newAllocation.endDate.getTime())),
                    },
                    resolution: 'Reduce allocation percentage or find alternative resource',
                });
            }
            conflicts.push({
                type: 'time_overlap',
                severity: 'medium',
                description: `Time overlap with project: ${existing.projectName}`,
                conflictingAllocation: existing,
                affectedPeriod: {
                    start: new Date(Math.max(existing.startDate.getTime(), newAllocation.startDate.getTime())),
                    end: new Date(Math.min(existing.endDate.getTime(), newAllocation.endDate.getTime())),
                },
            });
        }
    }
    // Check availability
    const availability = resource.availability.find(slot => (0, date_fns_1.isWithinInterval)(newAllocation.startDate, { start: slot.startDate, end: slot.endDate }) &&
        (0, date_fns_1.isWithinInterval)(newAllocation.endDate, { start: slot.startDate, end: slot.endDate }));
    if (!availability || availability.type === 'unavailable') {
        conflicts.push({
            type: 'availability_mismatch',
            severity: 'critical',
            description: `Resource unavailable during allocation period: ${availability?.reason || 'Unknown'}`,
            affectedPeriod: { start: newAllocation.startDate, end: newAllocation.endDate },
            resolution: 'Adjust dates or find alternative resource',
        });
    }
    return conflicts;
};
exports.detectAllocationConflicts = detectAllocationConflicts;
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
const resolveAllocationConflicts = (conflicts, resource, allocation) => {
    const criticalConflicts = conflicts.filter(c => c.severity === 'critical');
    if (criticalConflicts.length > 0) {
        return {
            resolvable: false,
            strategy: 'manual_intervention',
            recommendations: [
                'Find alternative resource',
                'Adjust project timeline',
                'Reduce allocation percentage',
            ],
            conflicts: criticalConflicts,
        };
    }
    // Auto-resolve over-allocation by reducing percentage
    const overAllocationConflicts = conflicts.filter(c => c.type === 'over_allocation');
    if (overAllocationConflicts.length > 0) {
        const targetUtilization = resource.maxUtilization - 10; // 10% buffer
        const adjustedPercentage = targetUtilization / 2; // Split evenly
        return {
            resolvable: true,
            strategy: 'reduce_allocation',
            adjustedAllocation: {
                ...allocation,
                allocationPercentage: adjustedPercentage,
                allocatedHours: (resource.capacity * adjustedPercentage) / 100,
            },
            recommendations: [
                `Reduce allocation to ${adjustedPercentage}%`,
                'Consider adding second resource for remaining capacity',
            ],
        };
    }
    return {
        resolvable: true,
        strategy: 'accept_with_monitoring',
        recommendations: ['Monitor utilization closely', 'Plan for potential adjustments'],
    };
};
exports.resolveAllocationConflicts = resolveAllocationConflicts;
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
const validateAllocationFeasibility = (allocation, resource, existingAllocations) => {
    const errors = [];
    const warnings = [];
    // Check resource status
    if (resource.status === 'inactive') {
        errors.push('Resource is inactive');
    }
    if (resource.status === 'on_leave') {
        errors.push('Resource is on leave');
    }
    // Check dates
    if (allocation.startDate >= allocation.endDate) {
        errors.push('End date must be after start date');
    }
    // Check allocation percentage
    if (allocation.allocationPercentage > 100) {
        errors.push('Allocation percentage cannot exceed 100%');
    }
    if (allocation.allocationPercentage > resource.maxUtilization) {
        warnings.push(`Allocation exceeds max utilization (${resource.maxUtilization}%)`);
    }
    // Check conflicts
    const conflicts = (0, exports.detectAllocationConflicts)(resource, allocation, existingAllocations);
    const criticalConflicts = conflicts.filter(c => c.severity === 'critical');
    if (criticalConflicts.length > 0) {
        errors.push(...criticalConflicts.map(c => c.description));
    }
    return {
        isValid: errors.length === 0,
        errors,
        warnings,
        conflicts,
        recommendation: errors.length === 0
            ? warnings.length === 0 ? 'Approved' : 'Approved with caution'
            : 'Rejected',
    };
};
exports.validateAllocationFeasibility = validateAllocationFeasibility;
// ============================================================================
// UTILIZATION TRACKING
// ============================================================================
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
const calculateUtilizationMetrics = (resource, period, allocations) => {
    const weeks = Math.ceil((0, date_fns_1.differenceInDays)(period.end, period.start) / 7);
    const totalHours = resource.capacity * weeks;
    const resourceAllocations = allocations.filter(a => a.resourceId === resource.id &&
        isOverlapping({ start: a.startDate, end: a.endDate }, period));
    const billableHours = resourceAllocations
        .filter(a => a.billable)
        .reduce((sum, a) => {
        const allocWeeks = Math.ceil((0, date_fns_1.differenceInDays)(a.endDate, a.startDate) / 7);
        return sum + (a.allocatedHours * allocWeeks);
    }, 0);
    const nonBillableHours = resourceAllocations
        .filter(a => !a.billable)
        .reduce((sum, a) => {
        const allocWeeks = Math.ceil((0, date_fns_1.differenceInDays)(a.endDate, a.startDate) / 7);
        return sum + (a.allocatedHours * allocWeeks);
    }, 0);
    const allocatedHours = billableHours + nonBillableHours;
    const idleTime = totalHours - allocatedHours;
    const utilizationRate = (allocatedHours / totalHours) * 100;
    const billableRate = (billableHours / totalHours) * 100;
    const revenue = billableHours * resource.costPerHour;
    return {
        resourceId: resource.id,
        resourceName: resource.name,
        period,
        totalHours,
        billableHours,
        nonBillableHours,
        utilizationRate: Math.round(utilizationRate * 100) / 100,
        billableRate: Math.round(billableRate * 100) / 100,
        idleTime,
        projectCount: new Set(resourceAllocations.map(a => a.projectId)).size,
        revenue: Math.round(revenue * 100) / 100,
    };
};
exports.calculateUtilizationMetrics = calculateUtilizationMetrics;
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
const generateUtilizationReport = (resources, period, allocations) => {
    return resources.map(r => (0, exports.calculateUtilizationMetrics)(r, period, allocations));
};
exports.generateUtilizationReport = generateUtilizationReport;
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
const identifyUnderutilizedResources = (metrics, threshold = 60) => {
    return metrics.filter(m => m.utilizationRate < threshold);
};
exports.identifyUnderutilizedResources = identifyUnderutilizedResources;
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
const trackAllocationVsActual = (allocation, actualHours) => {
    const plannedHours = allocation.allocatedHours;
    const variance = actualHours - plannedHours;
    const variancePercentage = (variance / plannedHours) * 100;
    return {
        allocation,
        plannedHours,
        actualHours,
        variance,
        variancePercentage: Math.round(variancePercentage * 100) / 100,
        status: Math.abs(variancePercentage) <= 10 ? 'on_track' :
            variancePercentage > 10 ? 'over_budget' : 'under_budget',
        recommendation: Math.abs(variancePercentage) > 20
            ? 'Investigate and adjust future allocations'
            : 'Continue monitoring',
    };
};
exports.trackAllocationVsActual = trackAllocationVsActual;
// ============================================================================
// FORECASTING AND DEMAND PLANNING
// ============================================================================
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
const forecastResourceDemand = (historicalAllocations, forecastMonths = 3) => {
    // Group by month
    const monthlyDemand = new Map();
    historicalAllocations.forEach(allocation => {
        const month = (0, date_fns_1.format)(allocation.startDate, 'yyyy-MM');
        const current = monthlyDemand.get(month) || 0;
        monthlyDemand.set(month, current + allocation.allocatedHours);
    });
    const demands = Array.from(monthlyDemand.values());
    const averageMonthlyDemand = demands.reduce((sum, d) => sum + d, 0) / demands.length;
    const stdDev = Math.sqrt(demands.reduce((sum, d) => sum + Math.pow(d - averageMonthlyDemand, 2), 0) / demands.length);
    // Generate forecast
    const forecast = [];
    let currentDate = new Date();
    for (let i = 0; i < forecastMonths; i++) {
        const forecastDate = (0, date_fns_1.addMonths)(currentDate, i);
        const month = (0, date_fns_1.format)(forecastDate, 'yyyy-MM');
        // Simple forecast with confidence interval
        forecast.push({
            month,
            expectedDemand: Math.round(averageMonthlyDemand),
            lowEstimate: Math.round(averageMonthlyDemand - stdDev),
            highEstimate: Math.round(averageMonthlyDemand + stdDev),
            confidence: 70 - (i * 5), // Confidence decreases over time
        });
    }
    return {
        averageMonthlyDemand: Math.round(averageMonthlyDemand),
        standardDeviation: Math.round(stdDev),
        forecast,
        trend: calculateTrend(Array.from(monthlyDemand.values())),
    };
};
exports.forecastResourceDemand = forecastResourceDemand;
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
const identifySkillGaps = (upcomingRequests, availableResources) => {
    const skillDemands = new Map();
    // Calculate demand
    upcomingRequests.forEach(request => {
        request.requiredSkills.forEach(skillReq => {
            const current = skillDemands.get(skillReq.skill) || {
                skill: skillReq.skill,
                requiredCount: 0,
                currentCount: 0,
                gap: 0,
                urgency: 'future',
                projects: [],
            };
            current.requiredCount += 1;
            if (!current.projects.includes(request.projectId)) {
                current.projects.push(request.projectId);
            }
            // Determine urgency
            const daysUntilStart = (0, date_fns_1.differenceInDays)(request.startDate, new Date());
            if (daysUntilStart < 30) {
                current.urgency = 'immediate';
            }
            else if (daysUntilStart < 90) {
                current.urgency = 'near_term';
            }
            skillDemands.set(skillReq.skill, current);
        });
    });
    // Calculate supply
    availableResources.forEach(resource => {
        resource.skills.forEach(skill => {
            const demand = skillDemands.get(skill.name);
            if (demand) {
                demand.currentCount += 1;
            }
        });
    });
    // Calculate gaps
    skillDemands.forEach(demand => {
        demand.gap = demand.requiredCount - demand.currentCount;
    });
    return Array.from(skillDemands.values())
        .filter(d => d.gap > 0)
        .sort((a, b) => {
        const urgencyOrder = { immediate: 0, near_term: 1, future: 2 };
        if (urgencyOrder[a.urgency] !== urgencyOrder[b.urgency]) {
            return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
        }
        return b.gap - a.gap;
    });
};
exports.identifySkillGaps = identifySkillGaps;
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
const planFutureCapacity = (pipeline, currentResources, planningHorizon) => {
    const skillGaps = (0, exports.identifySkillGaps)(pipeline, currentResources);
    const demandForecast = (0, exports.forecastResourceDemand)([], 6);
    // Calculate total capacity needed
    const totalDemandHours = pipeline
        .filter(p => (0, date_fns_1.isWithinInterval)(p.startDate, { start: planningHorizon.start, end: planningHorizon.end }))
        .reduce((sum, p) => sum + p.hoursRequired, 0);
    const currentCapacity = currentResources.reduce((sum, r) => {
        const weeks = Math.ceil((0, date_fns_1.differenceInDays)(planningHorizon.end, planningHorizon.start) / 7);
        return sum + (r.capacity * weeks);
    }, 0);
    const capacityGap = totalDemandHours - currentCapacity;
    return {
        totalDemand: totalDemandHours,
        currentCapacity,
        capacityGap,
        skillGaps,
        hiringRecommendations: generateHiringRecommendations(skillGaps, capacityGap),
        trainingRecommendations: generateTrainingRecommendations(skillGaps, currentResources),
        contractorRecommendations: capacityGap > 0 && capacityGap < 2000
            ? ['Consider contractors for short-term capacity needs']
            : [],
    };
};
exports.planFutureCapacity = planFutureCapacity;
// ============================================================================
// MULTI-PROJECT RESOURCE BALANCING
// ============================================================================
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
const balanceMultiProjectResources = (requests, resources, strategy = 'priority_based') => {
    if (strategy === 'equal_distribution') {
        return (0, exports.loadBalancingAlgorithm)(requests, resources);
    }
    if (strategy === 'priority_based') {
        const allocations = new Map();
        resources.forEach(r => allocations.set(r.id, []));
        const sortedRequests = [...requests].sort((a, b) => {
            const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        });
        for (const request of sortedRequests) {
            const optimal = (0, exports.optimalAllocationAlgorithm)(request, resources, []);
            optimal.recommendedAllocations.forEach(alloc => {
                const resourceAllocs = allocations.get(alloc.resource.id) || [];
                resourceAllocs.push({
                    id: `ALLOC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    resourceId: alloc.resource.id,
                    projectId: request.projectId,
                    projectName: request.projectName,
                    startDate: request.startDate,
                    endDate: request.endDate,
                    allocatedHours: alloc.hoursAllocated / Math.ceil((0, date_fns_1.differenceInDays)(request.endDate, request.startDate) / 7),
                    allocationPercentage: alloc.allocationPercentage,
                    role: 'Engineer',
                    priority: request.priority,
                    status: 'proposed',
                    billable: true,
                    assignedBy: request.requestedBy,
                    assignedAt: new Date(),
                });
                allocations.set(alloc.resource.id, resourceAllocs);
            });
        }
        return allocations;
    }
    // skill_optimized strategy
    return (0, exports.loadBalancingAlgorithm)(requests, resources);
};
exports.balanceMultiProjectResources = balanceMultiProjectResources;
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
const optimizePortfolioAllocation = (portfolio, resources) => {
    const balanced = (0, exports.balanceMultiProjectResources)(portfolio, resources, 'skill_optimized');
    let totalCost = 0;
    let totalAllocations = 0;
    const projectAllocations = new Map();
    balanced.forEach((allocations, resourceId) => {
        const resource = resources.find(r => r.id === resourceId);
        if (!resource)
            return;
        allocations.forEach(alloc => {
            const weeks = Math.ceil((0, date_fns_1.differenceInDays)(alloc.endDate, alloc.startDate) / 7);
            const cost = alloc.allocatedHours * weeks * resource.costPerHour;
            totalCost += cost;
            totalAllocations++;
            const projectCost = projectAllocations.get(alloc.projectId) || 0;
            projectAllocations.set(alloc.projectId, projectCost + cost);
        });
    });
    return {
        totalCost: Math.round(totalCost * 100) / 100,
        totalAllocations,
        projectCount: projectAllocations.size,
        averageCostPerProject: Math.round((totalCost / projectAllocations.size) * 100) / 100,
        allocations: balanced,
        utilizationRate: calculateAverageUtilization(resources, balanced),
    };
};
exports.optimizePortfolioAllocation = optimizePortfolioAllocation;
// ============================================================================
// RESOURCE POOL MANAGEMENT
// ============================================================================
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
const createResourcePool = (name, resources, description = '') => {
    const totalCapacity = resources.reduce((sum, r) => sum + r.capacity, 0);
    const totalAllocated = resources.reduce((sum, r) => sum + r.currentAllocation, 0);
    const averageUtilization = (totalAllocated / totalCapacity) * 100;
    const costPerHour = resources.reduce((sum, r) => sum + r.costPerHour, 0) / resources.length;
    // Extract unique skills
    const skillSet = new Set();
    resources.forEach(r => r.skills.forEach(s => skillSet.add(s.name)));
    return {
        id: `POOL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name,
        description,
        department: resources[0]?.department || 'Engineering',
        resources,
        totalCapacity,
        totalAllocated,
        averageUtilization: Math.round(averageUtilization * 100) / 100,
        costPerHour: Math.round(costPerHour * 100) / 100,
        skills: Array.from(skillSet),
    };
};
exports.createResourcePool = createResourcePool;
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
const manageSharedResourcePools = (pools, request) => {
    const allResources = pools.flatMap(p => p.resources);
    return (0, exports.greedyAllocationAlgorithm)(request, allResources);
};
exports.manageSharedResourcePools = manageSharedResourcePools;
// ============================================================================
// SKILL-BASED RESOURCE MATCHING
// ============================================================================
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
const matchResourcesBySkills = (resources, requirements) => {
    return resources.map(resource => {
        const skillMatchScore = (0, exports.calculateSkillMatch)(resource, requirements);
        return {
            resource,
            matchScore: skillMatchScore,
            skillMatchScore,
            availabilityScore: 100, // Assume available for skill matching
            costScore: 50,
            conflicts: [],
            recommendation: skillMatchScore >= 80 ? 'Excellent match' :
                skillMatchScore >= 60 ? 'Good match' :
                    skillMatchScore >= 40 ? 'Acceptable match' : 'Poor match',
        };
    }).sort((a, b) => b.matchScore - a.matchScore);
};
exports.matchResourcesBySkills = matchResourcesBySkills;
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
const calculateSkillMatch = (resource, requirements) => {
    if (requirements.length === 0)
        return 100;
    let totalWeight = 0;
    let matchedWeight = 0;
    requirements.forEach(req => {
        totalWeight += req.weight;
        const resourceSkill = resource.skills.find(s => s.name.toLowerCase() === req.skill.toLowerCase());
        if (resourceSkill) {
            const proficiencyScore = calculateProficiencyScore(resourceSkill.proficiency, req.proficiency);
            matchedWeight += req.weight * proficiencyScore;
        }
        else if (!req.required) {
            matchedWeight += req.weight * 0.3; // Partial credit for optional skills
        }
    });
    return totalWeight > 0 ? (matchedWeight / totalWeight) * 100 : 0;
};
exports.calculateSkillMatch = calculateSkillMatch;
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
const findResourcesBySkillCombination = (resources, skills, minProficiency = 'intermediate') => {
    const proficiencyOrder = { beginner: 0, intermediate: 1, advanced: 2, expert: 3 };
    const minLevel = proficiencyOrder[minProficiency];
    return resources.filter(resource => {
        return skills.every(requiredSkill => {
            const resourceSkill = resource.skills.find(s => s.name.toLowerCase() === requiredSkill.toLowerCase());
            return resourceSkill && proficiencyOrder[resourceSkill.proficiency] >= minLevel;
        });
    });
};
exports.findResourcesBySkillCombination = findResourcesBySkillCombination;
// ============================================================================
// AVAILABILITY CALENDARS
// ============================================================================
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
const generateAvailabilityCalendar = (resource, period, allocations) => {
    const calendar = [];
    let currentDate = new Date(period.start);
    while (currentDate <= period.end) {
        const dayOfWeek = currentDate.getDay();
        const dailyCapacity = resource.capacity / 5; // Assuming 5-day work week
        // Check allocations for this day
        const dayAllocations = allocations.filter(a => a.resourceId === resource.id &&
            currentDate >= a.startDate &&
            currentDate <= a.endDate);
        const allocatedHours = dayAllocations.reduce((sum, a) => sum + (a.allocatedHours / 5), 0);
        calendar.push({
            date: (0, date_fns_1.format)(currentDate, 'yyyy-MM-dd'),
            dayOfWeek,
            totalCapacity: dailyCapacity,
            allocatedHours: Math.round(allocatedHours * 100) / 100,
            availableHours: Math.round((dailyCapacity - allocatedHours) * 100) / 100,
            utilizationRate: Math.round((allocatedHours / dailyCapacity) * 100),
            allocations: dayAllocations,
        });
        currentDate = (0, date_fns_1.addDays)(currentDate, 1);
    }
    return calendar;
};
exports.generateAvailabilityCalendar = generateAvailabilityCalendar;
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
const findAvailableTimeSlots = (resource, hoursNeeded, searchPeriod, allocations) => {
    const calendar = (0, exports.generateAvailabilityCalendar)(resource, searchPeriod, allocations);
    const availableSlots = [];
    let currentSlot = null;
    calendar.forEach(day => {
        if (day.availableHours >= (hoursNeeded / 5)) {
            if (!currentSlot) {
                currentSlot = {
                    start: new Date(day.date),
                    hours: day.availableHours,
                };
            }
            else {
                currentSlot.hours += day.availableHours;
            }
            if (currentSlot.hours >= hoursNeeded) {
                const daysNeeded = Math.ceil(hoursNeeded / (resource.capacity / 5));
                availableSlots.push({
                    start: currentSlot.start,
                    end: (0, date_fns_1.addDays)(currentSlot.start, daysNeeded),
                });
                currentSlot = null;
            }
        }
        else {
            currentSlot = null;
        }
    });
    return availableSlots;
};
exports.findAvailableTimeSlots = findAvailableTimeSlots;
// ============================================================================
// NESTJS SERVICE IMPLEMENTATIONS
// ============================================================================
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
let ResourceAllocationService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ResourceAllocationService = _classThis = class {
        constructor(resourceModel, allocationModel) {
            this.resourceModel = resourceModel;
            this.allocationModel = allocationModel;
            this.logger = new common_1.Logger(ResourceAllocationService.name);
        }
        /**
         * Allocates resources to a project using optimal algorithm.
         */
        async allocateResourceToProject(request) {
            this.logger.log(`Allocating resources for project: ${request.projectName}`);
            try {
                // Fetch available resources
                const resources = await this.resourceModel.findAll({
                    where: { status: 'available' },
                });
                // Fetch existing allocations
                const allocations = await this.allocationModel.findAll();
                // Run optimization algorithm
                const optimization = (0, exports.optimalAllocationAlgorithm)(request, resources, allocations);
                this.logger.log(`Found ${optimization.recommendedAllocations.length} recommended allocations`);
                return optimization;
            }
            catch (error) {
                this.logger.error(`Failed to allocate resources: ${error.message}`, error.stack);
                throw error;
            }
        }
        /**
         * Detects and resolves allocation conflicts.
         */
        async detectAndResolveConflicts(resourceId, proposedAllocation) {
            const resource = await this.resourceModel.findByPk(resourceId);
            const existingAllocations = await this.allocationModel.findAll({
                where: { resourceId },
            });
            const conflicts = (0, exports.detectAllocationConflicts)(resource, proposedAllocation, existingAllocations);
            const resolution = (0, exports.resolveAllocationConflicts)(conflicts, resource, proposedAllocation);
            return { conflicts, resolution };
        }
        /**
         * Generates capacity planning report.
         */
        async generateCapacityReport(period) {
            const resources = await this.resourceModel.findAll();
            const allocations = await this.allocationModel.findAll();
            const plans = resources.map(r => (0, exports.calculateResourceCapacity)(r, period, allocations));
            const summary = (0, exports.calculateTeamCapacity)(resources, period, allocations);
            return { plans, summary };
        }
    };
    __setFunctionName(_classThis, "ResourceAllocationService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ResourceAllocationService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ResourceAllocationService = _classThis;
})();
exports.ResourceAllocationService = ResourceAllocationService;
/**
 * NestJS service for utilization tracking and analytics.
 */
let UtilizationTrackingService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var UtilizationTrackingService = _classThis = class {
        constructor(resourceModel, allocationModel) {
            this.resourceModel = resourceModel;
            this.allocationModel = allocationModel;
            this.logger = new common_1.Logger(UtilizationTrackingService.name);
        }
        /**
         * Generates comprehensive utilization report.
         */
        async generateUtilizationReport(period, departmentFilter) {
            const where = {};
            if (departmentFilter) {
                where.department = departmentFilter;
            }
            const resources = await this.resourceModel.findAll({ where });
            const allocations = await this.allocationModel.findAll();
            return (0, exports.generateUtilizationReport)(resources, period, allocations);
        }
        /**
         * Identifies and alerts on underutilized resources.
         */
        async identifyUnderutilizedResources(threshold = 60) {
            const period = {
                start: (0, date_fns_1.addMonths)(new Date(), -1),
                end: new Date(),
            };
            const metrics = await this.generateUtilizationReport(period);
            return (0, exports.identifyUnderutilizedResources)(metrics, threshold);
        }
    };
    __setFunctionName(_classThis, "UtilizationTrackingService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        UtilizationTrackingService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return UtilizationTrackingService = _classThis;
})();
exports.UtilizationTrackingService = UtilizationTrackingService;
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
function isOverlapping(range1, range2) {
    return range1.start <= range2.end && range1.end >= range2.start;
}
function calculateAvailabilityScore(resource, period, hoursNeeded) {
    const weeks = Math.ceil((0, date_fns_1.differenceInDays)(period.end, period.start) / 7);
    const totalAvailable = resource.capacity * weeks;
    const currentlyAllocated = resource.currentAllocation * weeks;
    const available = totalAvailable - currentlyAllocated;
    if (available >= hoursNeeded)
        return 100;
    if (available <= 0)
        return 0;
    return (available / hoursNeeded) * 100;
}
function calculateCostScore(costPerHour, budget) {
    if (!budget)
        return 50; // Neutral score if no budget
    const totalCost = costPerHour * 160; // Assume 1 month
    if (totalCost <= budget)
        return 100;
    if (totalCost > budget * 1.5)
        return 0;
    return ((budget * 1.5 - totalCost) / (budget * 0.5)) * 100;
}
function calculateProficiencyScore(resourceProficiency, requiredProficiency) {
    const levels = { beginner: 1, intermediate: 2, advanced: 3, expert: 4 };
    const resourceLevel = levels[resourceProficiency];
    const requiredLevel = levels[requiredProficiency];
    if (resourceLevel >= requiredLevel)
        return 1.0;
    return resourceLevel / requiredLevel;
}
function identifyRiskFactors(allocations, request) {
    const risks = [];
    if (allocations.length === 0) {
        risks.push('No suitable resources found');
    }
    const avgSkillMatch = allocations.reduce((sum, a) => sum + a.skillMatch, 0) / allocations.length;
    if (avgSkillMatch < 60) {
        risks.push('Low skill match - consider training or alternative resources');
    }
    const conflictCount = allocations.reduce((sum, a) => sum + a.conflicts.length, 0);
    if (conflictCount > 0) {
        risks.push(`${conflictCount} allocation conflicts detected`);
    }
    if (allocations.length > 1) {
        risks.push('Multiple resources required - coordination overhead');
    }
    return risks;
}
function generatePros(combo) {
    const pros = [];
    if (combo.averageSkillMatch > 80) {
        pros.push('Excellent skill match');
    }
    if (combo.totalCost < 50000) {
        pros.push('Cost-effective');
    }
    if (combo.conflictCount === 0) {
        pros.push('No conflicts');
    }
    return pros;
}
function generateCons(combo) {
    const cons = [];
    if (combo.averageSkillMatch < 60) {
        cons.push('Skill gap present');
    }
    if (combo.totalCost > 100000) {
        cons.push('High cost');
    }
    if (combo.conflictCount > 0) {
        cons.push(`${combo.conflictCount} conflicts`);
    }
    return cons;
}
function calculateTrend(values) {
    if (values.length < 2)
        return 'stable';
    const first = values.slice(0, Math.floor(values.length / 2));
    const second = values.slice(Math.floor(values.length / 2));
    const avgFirst = first.reduce((a, b) => a + b, 0) / first.length;
    const avgSecond = second.reduce((a, b) => a + b, 0) / second.length;
    if (avgSecond > avgFirst * 1.1)
        return 'increasing';
    if (avgSecond < avgFirst * 0.9)
        return 'decreasing';
    return 'stable';
}
function generateHiringRecommendations(gaps, capacityGap) {
    const recommendations = [];
    if (capacityGap > 0) {
        const ftes = Math.ceil(capacityGap / 2080); // 2080 hours per year per FTE
        recommendations.push(`Hire ${ftes} FTE(s) to cover ${capacityGap} hour gap`);
    }
    gaps.filter(g => g.urgency === 'immediate').forEach(gap => {
        recommendations.push(`Urgent: Hire ${gap.gap} ${gap.skill} specialist(s)`);
    });
    return recommendations;
}
function generateTrainingRecommendations(gaps, resources) {
    const recommendations = [];
    gaps.forEach(gap => {
        const candidates = resources.filter(r => r.skills.some(s => s.name === gap.skill && s.proficiency === 'intermediate'));
        if (candidates.length > 0) {
            recommendations.push(`Train ${candidates.length} intermediate ${gap.skill} resources to advanced level`);
        }
    });
    return recommendations;
}
function calculateAverageUtilization(resources, allocations) {
    let totalUtilization = 0;
    resources.forEach(r => {
        const resourceAllocations = allocations.get(r.id) || [];
        const allocated = resourceAllocations.reduce((sum, a) => sum + a.allocatedHours, 0);
        totalUtilization += (allocated / r.capacity) * 100;
    });
    return Math.round((totalUtilization / resources.length) * 100) / 100;
}
//# sourceMappingURL=resource-allocation-kit.js.map