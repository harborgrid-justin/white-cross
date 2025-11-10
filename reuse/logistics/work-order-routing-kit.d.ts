/**
 * LOC: WO-ROUTE-001
 * File: /reuse/logistics/work-order-routing-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/config
 *   - sequelize
 *   - sequelize-typescript
 *
 * DOWNSTREAM (imported by):
 *   - Manufacturing controllers
 *   - Work order services
 *   - Production planning modules
 *   - Shop floor control systems
 */
/**
 * Routing status enumeration
 */
export declare enum RoutingStatus {
    DRAFT = "DRAFT",
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    OBSOLETE = "OBSOLETE",
    PENDING_APPROVAL = "PENDING_APPROVAL",
    APPROVED = "APPROVED",
    SUSPENDED = "SUSPENDED"
}
/**
 * Operation status enumeration
 */
export declare enum OperationStatus {
    NOT_STARTED = "NOT_STARTED",
    IN_QUEUE = "IN_QUEUE",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    ON_HOLD = "ON_HOLD",
    CANCELLED = "CANCELLED",
    SKIPPED = "SKIPPED"
}
/**
 * Work center type enumeration
 */
export declare enum WorkCenterType {
    MACHINE = "MACHINE",
    ASSEMBLY = "ASSEMBLY",
    INSPECTION = "INSPECTION",
    PACKAGING = "PACKAGING",
    SUBASSEMBLY = "SUBASSEMBLY",
    TESTING = "TESTING",
    MANUAL = "MANUAL"
}
/**
 * Operation type enumeration
 */
export declare enum OperationType {
    SETUP = "SETUP",
    RUN = "RUN",
    INSPECTION = "INSPECTION",
    ASSEMBLY = "ASSEMBLY",
    TEARDOWN = "TEARDOWN",
    QUALITY_CHECK = "QUALITY_CHECK",
    REWORK = "REWORK"
}
/**
 * Route optimization strategy
 */
export declare enum OptimizationStrategy {
    MINIMIZE_TIME = "MINIMIZE_TIME",
    MINIMIZE_COST = "MINIMIZE_COST",
    BALANCE_WORKLOAD = "BALANCE_WORKLOAD",
    MAXIMIZE_THROUGHPUT = "MAXIMIZE_THROUGHPUT",
    MINIMIZE_SETUP = "MINIMIZE_SETUP"
}
/**
 * Work center resource
 */
export interface WorkCenter {
    workCenterId: string;
    code: string;
    name: string;
    type: WorkCenterType;
    department: string;
    capacity: number;
    efficiency: number;
    costPerHour: number;
    setupCostPerHour?: number;
    isActive: boolean;
    shift?: string;
    availableHours?: number;
    metadata?: Record<string, any>;
}
/**
 * Routing operation
 */
export interface RoutingOperation {
    operationId: string;
    operationNumber: number;
    sequence: number;
    description: string;
    type: OperationType;
    workCenterId: string;
    workCenter?: WorkCenter;
    setupTime: number;
    runTime: number;
    queueTime: number;
    moveTime: number;
    laborHours: number;
    machineHours: number;
    toolingCost: number;
    laborCost: number;
    overheadCost: number;
    totalCost: number;
    qualityCheckRequired: boolean;
    criticalOperation: boolean;
    parallelOperations?: string[];
    prerequisites?: string[];
    alternativeWorkCenters?: string[];
    instructions?: string;
    skillsRequired?: string[];
    toolsRequired?: string[];
    status: OperationStatus;
    metadata?: Record<string, any>;
}
/**
 * Complete routing definition
 */
export interface Routing {
    routingId: string;
    routingCode: string;
    version: number;
    itemId: string;
    itemCode: string;
    description: string;
    status: RoutingStatus;
    effectiveDate: Date;
    expirationDate?: Date;
    operations: RoutingOperation[];
    totalSetupTime: number;
    totalRunTime: number;
    totalLeadTime: number;
    totalCost: number;
    lotSize?: number;
    isDefault: boolean;
    isPrimary: boolean;
    alternativeRoutingId?: string;
    approvedBy?: string;
    approvedAt?: Date;
    createdBy: string;
    createdAt: Date;
    updatedAt?: Date;
    metadata?: Record<string, any>;
}
/**
 * Routing builder configuration
 */
export interface RoutingBuilderConfig {
    itemId: string;
    itemCode: string;
    description: string;
    createdBy: string;
    lotSize?: number;
    autoCalculateCosts?: boolean;
    autoCalculateTimes?: boolean;
}
/**
 * Operation dependency graph
 */
export interface OperationDependency {
    operationId: string;
    dependsOn: string[];
    blockedBy: string[];
    canRunInParallelWith: string[];
}
/**
 * Work center assignment
 */
export interface WorkCenterAssignment {
    assignmentId: string;
    operationId: string;
    workCenterId: string;
    workCenter: WorkCenter;
    priority: number;
    isPrimary: boolean;
    isAlternative: boolean;
    capacityRequired: number;
    assignedDate: Date;
    scheduledStartTime?: Date;
    scheduledEndTime?: Date;
    actualStartTime?: Date;
    actualEndTime?: Date;
}
/**
 * Routing version history
 */
export interface RoutingVersion {
    versionId: string;
    routingId: string;
    version: number;
    changeDescription: string;
    changedBy: string;
    changedAt: Date;
    previousVersion?: number;
    changes: RoutingChange[];
}
/**
 * Routing change record
 */
export interface RoutingChange {
    changeId: string;
    changeType: 'OPERATION_ADDED' | 'OPERATION_REMOVED' | 'OPERATION_MODIFIED' | 'SEQUENCE_CHANGED' | 'WORK_CENTER_CHANGED';
    operationId?: string;
    field?: string;
    oldValue?: any;
    newValue?: any;
    reason?: string;
}
/**
 * Route optimization configuration
 */
export interface OptimizationConfig {
    strategy: OptimizationStrategy;
    constraints: {
        maxLeadTime?: number;
        maxCost?: number;
        requiredWorkCenters?: string[];
        excludedWorkCenters?: string[];
        maxParallelOperations?: number;
    };
    weights: {
        time: number;
        cost: number;
        quality: number;
    };
}
/**
 * Route optimization result
 */
export interface OptimizationResult {
    optimizedRouting: Routing;
    improvements: {
        timeSaved: number;
        costSaved: number;
        efficiencyGain: number;
    };
    recommendations: string[];
    warnings?: string[];
}
/**
 * Capacity planning result
 */
export interface CapacityAnalysis {
    workCenterId: string;
    workCenter: WorkCenter;
    totalCapacityRequired: number;
    availableCapacity: number;
    utilizationRate: number;
    overloaded: boolean;
    bottleneck: boolean;
    recommendations: string[];
}
/**
 * Lead time calculation result
 */
export interface LeadTimeBreakdown {
    setupTime: number;
    runTime: number;
    queueTime: number;
    moveTime: number;
    waitTime: number;
    totalLeadTime: number;
    criticalPath: string[];
}
/**
 * Cost breakdown
 */
export interface CostBreakdown {
    laborCost: number;
    machineCost: number;
    toolingCost: number;
    overheadCost: number;
    materialCost: number;
    totalCost: number;
    costPerUnit: number;
    operationCosts: Array<{
        operationId: string;
        operationNumber: number;
        cost: number;
    }>;
}
/**
 * Routing validation result
 */
export interface RoutingValidationResult {
    valid: boolean;
    errors: string[];
    warnings: string[];
    recommendations: string[];
}
/**
 * NestJS Configuration Schema for Work Order Routing
 */
export interface RoutingConfigSchema {
    routing: {
        defaultLotSize: number;
        maxOperationsPerRouting: number;
        maxRoutingVersions: number;
        autoApprovalEnabled: boolean;
        requireQualityChecks: boolean;
        parallelOperationsEnabled: boolean;
        capacityThreshold: number;
    };
    workCenter: {
        defaultEfficiency: number;
        defaultCapacity: number;
        shiftHours: number;
        overtimeAllowed: boolean;
    };
    optimization: {
        enabled: boolean;
        strategy: OptimizationStrategy;
        timeCostRatio: number;
        maxOptimizationIterations: number;
    };
    validation: {
        strictMode: boolean;
        allowSkippedOperations: boolean;
        requireApproval: boolean;
    };
}
/**
 * 1. Creates a new routing definition.
 *
 * @param {RoutingBuilderConfig} config - Routing configuration
 * @returns {Routing} New routing object
 *
 * @example
 * ```typescript
 * const routing = createRouting({
 *   itemId: 'ITEM-001',
 *   itemCode: 'PUMP-100',
 *   description: 'Centrifugal Pump Assembly',
 *   createdBy: 'engineer-123',
 *   lotSize: 100
 * });
 * ```
 */
export declare function createRouting(config: RoutingBuilderConfig): Routing;
/**
 * 2. Adds an operation to the routing.
 *
 * @param {Routing} routing - Routing to update
 * @param {Partial<RoutingOperation>} operation - Operation details
 * @returns {Routing} Updated routing
 *
 * @example
 * ```typescript
 * const updated = addOperation(routing, {
 *   operationNumber: 10,
 *   description: 'Machine shaft',
 *   type: OperationType.RUN,
 *   workCenterId: 'WC-LATHE-01',
 *   setupTime: 30,
 *   runTime: 5,
 *   laborHours: 0.5
 * });
 * ```
 */
export declare function addOperation(routing: Routing, operation: Partial<RoutingOperation>): Routing;
/**
 * 3. Removes an operation from the routing.
 *
 * @param {Routing} routing - Routing to update
 * @param {string} operationId - Operation ID to remove
 * @returns {Routing} Updated routing
 *
 * @example
 * ```typescript
 * const updated = removeOperation(routing, 'op-123');
 * ```
 */
export declare function removeOperation(routing: Routing, operationId: string): Routing;
/**
 * 4. Updates an existing operation.
 *
 * @param {Routing} routing - Routing to update
 * @param {string} operationId - Operation ID
 * @param {Partial<RoutingOperation>} updates - Operation updates
 * @returns {Routing} Updated routing
 *
 * @example
 * ```typescript
 * const updated = updateOperation(routing, 'op-123', {
 *   runTime: 4.5,
 *   setupTime: 25
 * });
 * ```
 */
export declare function updateOperation(routing: Routing, operationId: string, updates: Partial<RoutingOperation>): Routing;
/**
 * 5. Clones an existing routing with a new version.
 *
 * @param {Routing} routing - Routing to clone
 * @param {string} description - Change description
 * @param {string} clonedBy - User ID
 * @returns {Routing} Cloned routing
 *
 * @example
 * ```typescript
 * const newVersion = cloneRouting(routing, 'Updated for new equipment', 'engineer-456');
 * ```
 */
export declare function cloneRouting(routing: Routing, description: string, clonedBy: string): Routing;
/**
 * 6. Activates a routing definition.
 *
 * @param {Routing} routing - Routing to activate
 * @param {string} approvedBy - User ID who approved
 * @returns {Routing} Activated routing
 *
 * @example
 * ```typescript
 * const active = activateRouting(routing, 'supervisor-789');
 * ```
 */
export declare function activateRouting(routing: Routing, approvedBy: string): Routing;
/**
 * 7. Recalculates all routing totals and lead times.
 *
 * @param {Routing} routing - Routing to recalculate
 * @returns {Routing} Updated routing
 *
 * @example
 * ```typescript
 * const updated = recalculateRouting(routing);
 * ```
 */
export declare function recalculateRouting(routing: Routing): Routing;
/**
 * 8. Reorders operation sequence.
 *
 * @param {Routing} routing - Routing to update
 * @param {string} operationId - Operation to move
 * @param {number} newSequence - New sequence number
 * @returns {Routing} Updated routing
 *
 * @example
 * ```typescript
 * const updated = reorderOperation(routing, 'op-123', 3);
 * ```
 */
export declare function reorderOperation(routing: Routing, operationId: string, newSequence: number): Routing;
/**
 * 9. Adds operation dependency (prerequisite).
 *
 * @param {Routing} routing - Routing to update
 * @param {string} operationId - Operation ID
 * @param {string} prerequisiteId - Prerequisite operation ID
 * @returns {Routing} Updated routing
 *
 * @example
 * ```typescript
 * const updated = addOperationDependency(routing, 'op-20', 'op-10');
 * ```
 */
export declare function addOperationDependency(routing: Routing, operationId: string, prerequisiteId: string): Routing;
/**
 * 10. Removes operation dependency.
 *
 * @param {Routing} routing - Routing to update
 * @param {string} operationId - Operation ID
 * @param {string} prerequisiteId - Prerequisite to remove
 * @returns {Routing} Updated routing
 *
 * @example
 * ```typescript
 * const updated = removeOperationDependency(routing, 'op-20', 'op-10');
 * ```
 */
export declare function removeOperationDependency(routing: Routing, operationId: string, prerequisiteId: string): Routing;
/**
 * 11. Marks operations that can run in parallel.
 *
 * @param {Routing} routing - Routing to update
 * @param {string[]} operationIds - Operation IDs that can run in parallel
 * @returns {Routing} Updated routing
 *
 * @example
 * ```typescript
 * const updated = setParallelOperations(routing, ['op-20', 'op-30', 'op-40']);
 * ```
 */
export declare function setParallelOperations(routing: Routing, operationIds: string[]): Routing;
/**
 * 12. Builds operation dependency graph.
 *
 * @param {Routing} routing - Routing to analyze
 * @returns {OperationDependency[]} Dependency graph
 *
 * @example
 * ```typescript
 * const graph = buildDependencyGraph(routing);
 * ```
 */
export declare function buildDependencyGraph(routing: Routing): OperationDependency[];
/**
 * 13. Finds critical path through routing.
 *
 * @param {Routing} routing - Routing to analyze
 * @returns {object} Critical path analysis
 *
 * @example
 * ```typescript
 * const criticalPath = findCriticalPath(routing);
 * console.log('Critical operations:', criticalPath.operations);
 * ```
 */
export declare function findCriticalPath(routing: Routing): {
    operations: string[];
    totalTime: number;
    bottleneck?: string;
};
/**
 * 14. Validates operation sequence for dependencies.
 *
 * @param {Routing} routing - Routing to validate
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const result = validateOperationSequence(routing);
 * if (!result.valid) {
 *   console.error('Sequence errors:', result.errors);
 * }
 * ```
 */
export declare function validateOperationSequence(routing: Routing): {
    valid: boolean;
    errors: string[];
    warnings: string[];
};
/**
 * 15. Auto-sequences operations based on dependencies.
 *
 * @param {Routing} routing - Routing to optimize
 * @returns {Routing} Optimized routing
 *
 * @example
 * ```typescript
 * const optimized = autoSequenceOperations(routing);
 * ```
 */
export declare function autoSequenceOperations(routing: Routing): Routing;
/**
 * 16. Assigns work center to operation.
 *
 * @param {Routing} routing - Routing to update
 * @param {string} operationId - Operation ID
 * @param {string} workCenterId - Work center ID
 * @param {WorkCenter} workCenter - Work center details
 * @returns {Routing} Updated routing
 *
 * @example
 * ```typescript
 * const updated = assignWorkCenter(routing, 'op-10', 'WC-LATHE-01', workCenterData);
 * ```
 */
export declare function assignWorkCenter(routing: Routing, operationId: string, workCenterId: string, workCenter: WorkCenter): Routing;
/**
 * 17. Adds alternative work center to operation.
 *
 * @param {Routing} routing - Routing to update
 * @param {string} operationId - Operation ID
 * @param {string} alternativeWorkCenterId - Alternative work center ID
 * @returns {Routing} Updated routing
 *
 * @example
 * ```typescript
 * const updated = addAlternativeWorkCenter(routing, 'op-10', 'WC-LATHE-02');
 * ```
 */
export declare function addAlternativeWorkCenter(routing: Routing, operationId: string, alternativeWorkCenterId: string): Routing;
/**
 * 18. Creates work center assignment record.
 *
 * @param {string} operationId - Operation ID
 * @param {WorkCenter} workCenter - Work center details
 * @param {boolean} isPrimary - Is primary assignment
 * @returns {WorkCenterAssignment} Assignment record
 *
 * @example
 * ```typescript
 * const assignment = createWorkCenterAssignment('op-10', workCenter, true);
 * ```
 */
export declare function createWorkCenterAssignment(operationId: string, workCenter: WorkCenter, isPrimary?: boolean): WorkCenterAssignment;
/**
 * 19. Finds available work centers for operation type.
 *
 * @param {WorkCenter[]} workCenters - All work centers
 * @param {OperationType} operationType - Operation type
 * @param {Date} scheduledTime - Scheduled time
 * @returns {WorkCenter[]} Available work centers
 *
 * @example
 * ```typescript
 * const available = findAvailableWorkCenters(
 *   allWorkCenters,
 *   OperationType.RUN,
 *   new Date()
 * );
 * ```
 */
export declare function findAvailableWorkCenters(workCenters: WorkCenter[], operationType: OperationType, scheduledTime: Date): WorkCenter[];
/**
 * 20. Calculates work center capacity requirements.
 *
 * @param {Routing} routing - Routing to analyze
 * @param {number} quantity - Production quantity
 * @returns {Record<string, number>} Capacity required by work center
 *
 * @example
 * ```typescript
 * const capacity = calculateWorkCenterCapacity(routing, 1000);
 * // Returns: { 'WC-LATHE-01': 50, 'WC-MILL-01': 75 }
 * ```
 */
export declare function calculateWorkCenterCapacity(routing: Routing, quantity: number): Record<string, number>;
/**
 * 21. Analyzes capacity constraints for routing.
 *
 * @param {Routing} routing - Routing to analyze
 * @param {WorkCenter[]} workCenters - Available work centers
 * @param {number} quantity - Production quantity
 * @returns {CapacityAnalysis[]} Capacity analysis per work center
 *
 * @example
 * ```typescript
 * const analysis = analyzeCapacityConstraints(routing, workCenters, 1000);
 * ```
 */
export declare function analyzeCapacityConstraints(routing: Routing, workCenters: WorkCenter[], quantity: number): CapacityAnalysis[];
/**
 * 22. Balances work load across work centers.
 *
 * @param {Routing} routing - Routing to optimize
 * @param {WorkCenter[]} workCenters - Available work centers
 * @returns {Routing} Optimized routing
 *
 * @example
 * ```typescript
 * const balanced = balanceWorkLoad(routing, workCenters);
 * ```
 */
export declare function balanceWorkLoad(routing: Routing, workCenters: WorkCenter[]): Routing;
/**
 * 23. Finds best work center match for operation.
 *
 * @param {RoutingOperation} operation - Operation
 * @param {WorkCenter[]} workCenters - Available work centers
 * @param {OptimizationStrategy} strategy - Optimization strategy
 * @returns {WorkCenter | null} Best matching work center
 *
 * @example
 * ```typescript
 * const best = findBestWorkCenter(operation, workCenters, OptimizationStrategy.MINIMIZE_COST);
 * ```
 */
export declare function findBestWorkCenter(operation: RoutingOperation, workCenters: WorkCenter[], strategy?: OptimizationStrategy): WorkCenter | null;
/**
 * 24. Creates new routing version.
 *
 * @param {Routing} routing - Base routing
 * @param {string} changeDescription - Description of changes
 * @param {string} changedBy - User ID
 * @returns {RoutingVersion} Version record
 *
 * @example
 * ```typescript
 * const version = createRoutingVersion(routing, 'Updated work centers', 'engineer-123');
 * ```
 */
export declare function createRoutingVersion(routing: Routing, changeDescription: string, changedBy: string): RoutingVersion;
/**
 * 25. Compares two routing versions.
 *
 * @param {Routing} oldRouting - Old version
 * @param {Routing} newRouting - New version
 * @returns {RoutingChange[]} List of changes
 *
 * @example
 * ```typescript
 * const changes = compareRoutingVersions(v1, v2);
 * ```
 */
export declare function compareRoutingVersions(oldRouting: Routing, newRouting: Routing): RoutingChange[];
/**
 * 26. Rolls back routing to previous version.
 *
 * @param {Routing} currentRouting - Current routing
 * @param {Routing} previousRouting - Previous version
 * @param {string} rolledBackBy - User ID
 * @returns {Routing} Rolled back routing
 *
 * @example
 * ```typescript
 * const rolled = rollbackRoutingVersion(current, previous, 'supervisor-456');
 * ```
 */
export declare function rollbackRoutingVersion(currentRouting: Routing, previousRouting: Routing, rolledBackBy: string): Routing;
/**
 * 27. Merges changes from alternative routing.
 *
 * @param {Routing} baseRouting - Base routing
 * @param {Routing} alternativeRouting - Alternative routing
 * @param {string[]} operationIdsToMerge - Operation IDs to merge
 * @returns {Routing} Merged routing
 *
 * @example
 * ```typescript
 * const merged = mergeRoutingChanges(base, alternative, ['op-10', 'op-20']);
 * ```
 */
export declare function mergeRoutingChanges(baseRouting: Routing, alternativeRouting: Routing, operationIdsToMerge: string[]): Routing;
/**
 * 28. Gets routing version history.
 *
 * @param {Routing[]} allRoutings - All routing versions
 * @param {string} routingCode - Routing code
 * @returns {Routing[]} Sorted version history
 *
 * @example
 * ```typescript
 * const history = getRoutingVersionHistory(allRoutings, 'RT-PUMP-100');
 * ```
 */
export declare function getRoutingVersionHistory(allRoutings: Routing[], routingCode: string): Routing[];
/**
 * 29. Approves routing for production use.
 *
 * @param {Routing} routing - Routing to approve
 * @param {string} approvedBy - User ID
 * @param {string} approvalNotes - Approval notes
 * @returns {Routing} Approved routing
 *
 * @example
 * ```typescript
 * const approved = approveRouting(routing, 'supervisor-789', 'Verified all work centers');
 * ```
 */
export declare function approveRouting(routing: Routing, approvedBy: string, approvalNotes?: string): Routing;
/**
 * 30. Archives obsolete routing version.
 *
 * @param {Routing} routing - Routing to archive
 * @param {string} reason - Archival reason
 * @returns {Routing} Archived routing
 *
 * @example
 * ```typescript
 * const archived = archiveRouting(routing, 'Replaced by new equipment routing');
 * ```
 */
export declare function archiveRouting(routing: Routing, reason: string): Routing;
/**
 * 31. Optimizes routing based on strategy.
 *
 * @param {Routing} routing - Routing to optimize
 * @param {WorkCenter[]} workCenters - Available work centers
 * @param {OptimizationConfig} config - Optimization configuration
 * @returns {OptimizationResult} Optimization result
 *
 * @example
 * ```typescript
 * const result = optimizeRouting(routing, workCenters, {
 *   strategy: OptimizationStrategy.MINIMIZE_COST,
 *   constraints: { maxCost: 1000 },
 *   weights: { time: 0.3, cost: 0.7, quality: 0.0 }
 * });
 * ```
 */
export declare function optimizeRouting(routing: Routing, workCenters: WorkCenter[], config: OptimizationConfig): OptimizationResult;
/**
 * 32. Calculates routing lead time breakdown.
 *
 * @param {Routing} routing - Routing to analyze
 * @returns {LeadTimeBreakdown} Lead time breakdown
 *
 * @example
 * ```typescript
 * const breakdown = calculateLeadTime(routing);
 * console.log('Total lead time:', breakdown.totalLeadTime);
 * ```
 */
export declare function calculateLeadTime(routing: Routing): LeadTimeBreakdown;
/**
 * 33. Calculates detailed cost breakdown.
 *
 * @param {Routing} routing - Routing to analyze
 * @param {WorkCenter[]} workCenters - Work center details
 * @returns {CostBreakdown} Cost breakdown
 *
 * @example
 * ```typescript
 * const costs = calculateCostBreakdown(routing, workCenters);
 * console.log('Total cost:', costs.totalCost);
 * ```
 */
export declare function calculateCostBreakdown(routing: Routing, workCenters: WorkCenter[]): CostBreakdown;
/**
 * 34. Validates routing completeness and correctness.
 *
 * @param {Routing} routing - Routing to validate
 * @returns {RoutingValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validateRouting(routing);
 * if (!result.valid) {
 *   console.error('Errors:', result.errors);
 * }
 * ```
 */
export declare function validateRouting(routing: Routing): RoutingValidationResult;
/**
 * 35. Identifies bottleneck operations.
 *
 * @param {Routing} routing - Routing to analyze
 * @param {WorkCenter[]} workCenters - Work center details
 * @returns {object[]} Bottleneck analysis
 *
 * @example
 * ```typescript
 * const bottlenecks = identifyBottlenecks(routing, workCenters);
 * ```
 */
export declare function identifyBottlenecks(routing: Routing, workCenters: WorkCenter[]): Array<{
    operationId: string;
    operationNumber: number;
    bottleneckScore: number;
    reason: string;
    recommendations: string[];
}>;
/**
 * 36. Suggests routing improvements.
 *
 * @param {Routing} routing - Routing to analyze
 * @param {WorkCenter[]} workCenters - Available work centers
 * @returns {string[]} Improvement suggestions
 *
 * @example
 * ```typescript
 * const suggestions = suggestRoutingImprovements(routing, workCenters);
 * suggestions.forEach(s => console.log(s));
 * ```
 */
export declare function suggestRoutingImprovements(routing: Routing, workCenters: WorkCenter[]): string[];
/**
 * 37. Exports routing to production format.
 *
 * @param {Routing} routing - Routing to export
 * @param {string} format - Export format ('JSON' | 'CSV' | 'PDF')
 * @returns {string | object} Exported data
 *
 * @example
 * ```typescript
 * const jsonExport = exportRouting(routing, 'JSON');
 * const csvExport = exportRouting(routing, 'CSV');
 * ```
 */
export declare function exportRouting(routing: Routing, format?: 'JSON' | 'CSV' | 'PDF'): string | object;
declare const _default: {
    createRouting: typeof createRouting;
    addOperation: typeof addOperation;
    removeOperation: typeof removeOperation;
    updateOperation: typeof updateOperation;
    cloneRouting: typeof cloneRouting;
    activateRouting: typeof activateRouting;
    recalculateRouting: typeof recalculateRouting;
    reorderOperation: typeof reorderOperation;
    addOperationDependency: typeof addOperationDependency;
    removeOperationDependency: typeof removeOperationDependency;
    setParallelOperations: typeof setParallelOperations;
    buildDependencyGraph: typeof buildDependencyGraph;
    findCriticalPath: typeof findCriticalPath;
    validateOperationSequence: typeof validateOperationSequence;
    autoSequenceOperations: typeof autoSequenceOperations;
    assignWorkCenter: typeof assignWorkCenter;
    addAlternativeWorkCenter: typeof addAlternativeWorkCenter;
    createWorkCenterAssignment: typeof createWorkCenterAssignment;
    findAvailableWorkCenters: typeof findAvailableWorkCenters;
    calculateWorkCenterCapacity: typeof calculateWorkCenterCapacity;
    analyzeCapacityConstraints: typeof analyzeCapacityConstraints;
    balanceWorkLoad: typeof balanceWorkLoad;
    findBestWorkCenter: typeof findBestWorkCenter;
    createRoutingVersion: typeof createRoutingVersion;
    compareRoutingVersions: typeof compareRoutingVersions;
    rollbackRoutingVersion: typeof rollbackRoutingVersion;
    mergeRoutingChanges: typeof mergeRoutingChanges;
    getRoutingVersionHistory: typeof getRoutingVersionHistory;
    approveRouting: typeof approveRouting;
    archiveRouting: typeof archiveRouting;
    optimizeRouting: typeof optimizeRouting;
    calculateLeadTime: typeof calculateLeadTime;
    calculateCostBreakdown: typeof calculateCostBreakdown;
    validateRouting: typeof validateRouting;
    identifyBottlenecks: typeof identifyBottlenecks;
    suggestRoutingImprovements: typeof suggestRoutingImprovements;
    exportRouting: typeof exportRouting;
};
export default _default;
//# sourceMappingURL=work-order-routing-kit.d.ts.map