"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptimizationStrategy = exports.OperationType = exports.WorkCenterType = exports.OperationStatus = exports.RoutingStatus = void 0;
exports.createRouting = createRouting;
exports.addOperation = addOperation;
exports.removeOperation = removeOperation;
exports.updateOperation = updateOperation;
exports.cloneRouting = cloneRouting;
exports.activateRouting = activateRouting;
exports.recalculateRouting = recalculateRouting;
exports.reorderOperation = reorderOperation;
exports.addOperationDependency = addOperationDependency;
exports.removeOperationDependency = removeOperationDependency;
exports.setParallelOperations = setParallelOperations;
exports.buildDependencyGraph = buildDependencyGraph;
exports.findCriticalPath = findCriticalPath;
exports.validateOperationSequence = validateOperationSequence;
exports.autoSequenceOperations = autoSequenceOperations;
exports.assignWorkCenter = assignWorkCenter;
exports.addAlternativeWorkCenter = addAlternativeWorkCenter;
exports.createWorkCenterAssignment = createWorkCenterAssignment;
exports.findAvailableWorkCenters = findAvailableWorkCenters;
exports.calculateWorkCenterCapacity = calculateWorkCenterCapacity;
exports.analyzeCapacityConstraints = analyzeCapacityConstraints;
exports.balanceWorkLoad = balanceWorkLoad;
exports.findBestWorkCenter = findBestWorkCenter;
exports.createRoutingVersion = createRoutingVersion;
exports.compareRoutingVersions = compareRoutingVersions;
exports.rollbackRoutingVersion = rollbackRoutingVersion;
exports.mergeRoutingChanges = mergeRoutingChanges;
exports.getRoutingVersionHistory = getRoutingVersionHistory;
exports.approveRouting = approveRouting;
exports.archiveRouting = archiveRouting;
exports.optimizeRouting = optimizeRouting;
exports.calculateLeadTime = calculateLeadTime;
exports.calculateCostBreakdown = calculateCostBreakdown;
exports.validateRouting = validateRouting;
exports.identifyBottlenecks = identifyBottlenecks;
exports.suggestRoutingImprovements = suggestRoutingImprovements;
exports.exportRouting = exportRouting;
/**
 * File: /reuse/logistics/work-order-routing-kit.ts
 * Locator: WC-LOGISTICS-WO-ROUTE-001
 * Purpose: Comprehensive Work Order Routing & Workflow Management - Complete routing lifecycle for manufacturing operations
 *
 * Upstream: Independent utility module for work order routing operations
 * Downstream: ../backend/manufacturing/*, Production modules, Shop floor systems, MES integration
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/config, sequelize-typescript
 * Exports: 37 utility functions for routing definitions, operation sequencing, work center assignments, version management, route optimization
 *
 * LLM Context: Enterprise-grade work order routing utilities for manufacturing operations to compete with JD Edwards EnterpriseOne.
 * Provides comprehensive routing definition, operation sequencing, work center assignment, parallel operations,
 * routing versions, alternative routes, capacity planning, lead time calculations, cost routing, quality checkpoints,
 * route optimization, and real-time shop floor integration with configurable validation schemas.
 */
const crypto = __importStar(require("crypto"));
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * Routing status enumeration
 */
var RoutingStatus;
(function (RoutingStatus) {
    RoutingStatus["DRAFT"] = "DRAFT";
    RoutingStatus["ACTIVE"] = "ACTIVE";
    RoutingStatus["INACTIVE"] = "INACTIVE";
    RoutingStatus["OBSOLETE"] = "OBSOLETE";
    RoutingStatus["PENDING_APPROVAL"] = "PENDING_APPROVAL";
    RoutingStatus["APPROVED"] = "APPROVED";
    RoutingStatus["SUSPENDED"] = "SUSPENDED";
})(RoutingStatus || (exports.RoutingStatus = RoutingStatus = {}));
/**
 * Operation status enumeration
 */
var OperationStatus;
(function (OperationStatus) {
    OperationStatus["NOT_STARTED"] = "NOT_STARTED";
    OperationStatus["IN_QUEUE"] = "IN_QUEUE";
    OperationStatus["IN_PROGRESS"] = "IN_PROGRESS";
    OperationStatus["COMPLETED"] = "COMPLETED";
    OperationStatus["ON_HOLD"] = "ON_HOLD";
    OperationStatus["CANCELLED"] = "CANCELLED";
    OperationStatus["SKIPPED"] = "SKIPPED";
})(OperationStatus || (exports.OperationStatus = OperationStatus = {}));
/**
 * Work center type enumeration
 */
var WorkCenterType;
(function (WorkCenterType) {
    WorkCenterType["MACHINE"] = "MACHINE";
    WorkCenterType["ASSEMBLY"] = "ASSEMBLY";
    WorkCenterType["INSPECTION"] = "INSPECTION";
    WorkCenterType["PACKAGING"] = "PACKAGING";
    WorkCenterType["SUBASSEMBLY"] = "SUBASSEMBLY";
    WorkCenterType["TESTING"] = "TESTING";
    WorkCenterType["MANUAL"] = "MANUAL";
})(WorkCenterType || (exports.WorkCenterType = WorkCenterType = {}));
/**
 * Operation type enumeration
 */
var OperationType;
(function (OperationType) {
    OperationType["SETUP"] = "SETUP";
    OperationType["RUN"] = "RUN";
    OperationType["INSPECTION"] = "INSPECTION";
    OperationType["ASSEMBLY"] = "ASSEMBLY";
    OperationType["TEARDOWN"] = "TEARDOWN";
    OperationType["QUALITY_CHECK"] = "QUALITY_CHECK";
    OperationType["REWORK"] = "REWORK";
})(OperationType || (exports.OperationType = OperationType = {}));
/**
 * Route optimization strategy
 */
var OptimizationStrategy;
(function (OptimizationStrategy) {
    OptimizationStrategy["MINIMIZE_TIME"] = "MINIMIZE_TIME";
    OptimizationStrategy["MINIMIZE_COST"] = "MINIMIZE_COST";
    OptimizationStrategy["BALANCE_WORKLOAD"] = "BALANCE_WORKLOAD";
    OptimizationStrategy["MAXIMIZE_THROUGHPUT"] = "MAXIMIZE_THROUGHPUT";
    OptimizationStrategy["MINIMIZE_SETUP"] = "MINIMIZE_SETUP";
})(OptimizationStrategy || (exports.OptimizationStrategy = OptimizationStrategy = {}));
// ============================================================================
// SECTION 1: ROUTING DEFINITION (Functions 1-7)
// ============================================================================
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
function createRouting(config) {
    const routingId = generateRoutingId();
    const routingCode = generateRoutingCode(config.itemCode);
    return {
        routingId,
        routingCode,
        version: 1,
        itemId: config.itemId,
        itemCode: config.itemCode,
        description: config.description,
        status: RoutingStatus.DRAFT,
        effectiveDate: new Date(),
        operations: [],
        totalSetupTime: 0,
        totalRunTime: 0,
        totalLeadTime: 0,
        totalCost: 0,
        lotSize: config.lotSize,
        isDefault: true,
        isPrimary: true,
        createdBy: config.createdBy,
        createdAt: new Date(),
    };
}
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
function addOperation(routing, operation) {
    const operationId = crypto.randomUUID();
    const sequence = routing.operations.length + 1;
    const newOperation = {
        operationId,
        operationNumber: operation.operationNumber || sequence * 10,
        sequence,
        description: operation.description || '',
        type: operation.type || OperationType.RUN,
        workCenterId: operation.workCenterId || '',
        setupTime: operation.setupTime || 0,
        runTime: operation.runTime || 0,
        queueTime: operation.queueTime || 0,
        moveTime: operation.moveTime || 0,
        laborHours: operation.laborHours || 0,
        machineHours: operation.machineHours || 0,
        toolingCost: operation.toolingCost || 0,
        laborCost: operation.laborCost || 0,
        overheadCost: operation.overheadCost || 0,
        totalCost: 0,
        qualityCheckRequired: operation.qualityCheckRequired || false,
        criticalOperation: operation.criticalOperation || false,
        parallelOperations: operation.parallelOperations,
        prerequisites: operation.prerequisites,
        alternativeWorkCenters: operation.alternativeWorkCenters,
        instructions: operation.instructions,
        skillsRequired: operation.skillsRequired,
        toolsRequired: operation.toolsRequired,
        status: OperationStatus.NOT_STARTED,
        metadata: operation.metadata,
    };
    // Calculate operation cost
    newOperation.totalCost = calculateOperationCost(newOperation);
    const updatedRouting = {
        ...routing,
        operations: [...routing.operations, newOperation],
    };
    return recalculateRouting(updatedRouting);
}
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
function removeOperation(routing, operationId) {
    const updatedRouting = {
        ...routing,
        operations: routing.operations
            .filter(op => op.operationId !== operationId)
            .map((op, index) => ({ ...op, sequence: index + 1 })),
    };
    return recalculateRouting(updatedRouting);
}
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
function updateOperation(routing, operationId, updates) {
    const updatedRouting = {
        ...routing,
        operations: routing.operations.map(op => {
            if (op.operationId === operationId) {
                const updated = { ...op, ...updates };
                updated.totalCost = calculateOperationCost(updated);
                return updated;
            }
            return op;
        }),
    };
    return recalculateRouting(updatedRouting);
}
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
function cloneRouting(routing, description, clonedBy) {
    const newRouting = {
        ...routing,
        routingId: generateRoutingId(),
        version: routing.version + 1,
        status: RoutingStatus.DRAFT,
        effectiveDate: new Date(),
        isDefault: false,
        isPrimary: false,
        alternativeRoutingId: routing.routingId,
        createdBy: clonedBy,
        createdAt: new Date(),
        updatedAt: new Date(),
        operations: routing.operations.map(op => ({
            ...op,
            operationId: crypto.randomUUID(),
            status: OperationStatus.NOT_STARTED,
        })),
        metadata: {
            ...routing.metadata,
            clonedFrom: routing.routingId,
            cloneReason: description,
        },
    };
    return newRouting;
}
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
function activateRouting(routing, approvedBy) {
    if (routing.status === RoutingStatus.ACTIVE) {
        throw new Error('Routing is already active');
    }
    const validation = validateRouting(routing);
    if (!validation.valid) {
        throw new Error(`Cannot activate routing: ${validation.errors.join(', ')}`);
    }
    return {
        ...routing,
        status: RoutingStatus.ACTIVE,
        approvedBy,
        approvedAt: new Date(),
        effectiveDate: new Date(),
        updatedAt: new Date(),
    };
}
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
function recalculateRouting(routing) {
    const totalSetupTime = routing.operations.reduce((sum, op) => sum + op.setupTime, 0);
    const totalRunTime = routing.operations.reduce((sum, op) => sum + op.runTime * (routing.lotSize || 1), 0);
    const totalCost = routing.operations.reduce((sum, op) => sum + op.totalCost, 0);
    // Calculate lead time including queue and move times
    const leadTimeBreakdown = calculateLeadTime(routing);
    return {
        ...routing,
        totalSetupTime,
        totalRunTime,
        totalLeadTime: leadTimeBreakdown.totalLeadTime,
        totalCost,
        updatedAt: new Date(),
    };
}
// ============================================================================
// SECTION 2: OPERATION SEQUENCING (Functions 8-15)
// ============================================================================
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
function reorderOperation(routing, operationId, newSequence) {
    const operation = routing.operations.find(op => op.operationId === operationId);
    if (!operation) {
        throw new Error(`Operation ${operationId} not found`);
    }
    const otherOperations = routing.operations.filter(op => op.operationId !== operationId);
    const reordered = [...otherOperations];
    reordered.splice(newSequence - 1, 0, operation);
    const updatedRouting = {
        ...routing,
        operations: reordered.map((op, index) => ({
            ...op,
            sequence: index + 1,
        })),
    };
    return recalculateRouting(updatedRouting);
}
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
function addOperationDependency(routing, operationId, prerequisiteId) {
    if (operationId === prerequisiteId) {
        throw new Error('Operation cannot depend on itself');
    }
    // Check for circular dependencies
    if (hasCircularDependency(routing, operationId, prerequisiteId)) {
        throw new Error('Circular dependency detected');
    }
    return {
        ...routing,
        operations: routing.operations.map(op => {
            if (op.operationId === operationId) {
                const prerequisites = op.prerequisites || [];
                if (!prerequisites.includes(prerequisiteId)) {
                    return {
                        ...op,
                        prerequisites: [...prerequisites, prerequisiteId],
                    };
                }
            }
            return op;
        }),
    };
}
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
function removeOperationDependency(routing, operationId, prerequisiteId) {
    return {
        ...routing,
        operations: routing.operations.map(op => {
            if (op.operationId === operationId && op.prerequisites) {
                return {
                    ...op,
                    prerequisites: op.prerequisites.filter(id => id !== prerequisiteId),
                };
            }
            return op;
        }),
    };
}
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
function setParallelOperations(routing, operationIds) {
    return {
        ...routing,
        operations: routing.operations.map(op => {
            if (operationIds.includes(op.operationId)) {
                return {
                    ...op,
                    parallelOperations: operationIds.filter(id => id !== op.operationId),
                };
            }
            return op;
        }),
    };
}
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
function buildDependencyGraph(routing) {
    return routing.operations.map(op => {
        const dependsOn = op.prerequisites || [];
        const blockedBy = [];
        const canRunInParallelWith = op.parallelOperations || [];
        // Find operations that depend on this one
        routing.operations.forEach(other => {
            if (other.prerequisites?.includes(op.operationId)) {
                blockedBy.push(other.operationId);
            }
        });
        return {
            operationId: op.operationId,
            dependsOn,
            blockedBy,
            canRunInParallelWith,
        };
    });
}
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
function findCriticalPath(routing) {
    const graph = buildDependencyGraph(routing);
    const operationMap = new Map(routing.operations.map(op => [op.operationId, op]));
    // Simple critical path: longest sequential path
    let longestPath = [];
    let longestTime = 0;
    function findPath(opId, visited, currentPath, currentTime) {
        const op = operationMap.get(opId);
        if (!op)
            return;
        const newPath = [...currentPath, opId];
        const newTime = currentTime + op.setupTime + op.runTime;
        if (newTime > longestTime) {
            longestTime = newTime;
            longestPath = newPath;
        }
        const deps = graph.find(d => d.operationId === opId);
        if (deps) {
            for (const nextId of deps.blockedBy) {
                if (!visited.has(nextId)) {
                    visited.add(nextId);
                    findPath(nextId, visited, newPath, newTime);
                    visited.delete(nextId);
                }
            }
        }
    }
    // Start from operations with no prerequisites
    for (const op of routing.operations) {
        if (!op.prerequisites || op.prerequisites.length === 0) {
            const visited = new Set([op.operationId]);
            findPath(op.operationId, visited, [], 0);
        }
    }
    // Find bottleneck (operation with longest time)
    let bottleneck;
    let maxOpTime = 0;
    for (const opId of longestPath) {
        const op = operationMap.get(opId);
        if (op) {
            const opTime = op.setupTime + op.runTime;
            if (opTime > maxOpTime) {
                maxOpTime = opTime;
                bottleneck = opId;
            }
        }
    }
    return {
        operations: longestPath,
        totalTime: longestTime,
        bottleneck,
    };
}
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
function validateOperationSequence(routing) {
    const errors = [];
    const warnings = [];
    const operationIds = new Set(routing.operations.map(op => op.operationId));
    // Check prerequisites exist and come before dependent operations
    for (const op of routing.operations) {
        if (op.prerequisites) {
            for (const prereqId of op.prerequisites) {
                if (!operationIds.has(prereqId)) {
                    errors.push(`Operation ${op.operationNumber}: prerequisite ${prereqId} not found`);
                }
                else {
                    const prereqOp = routing.operations.find(o => o.operationId === prereqId);
                    if (prereqOp && prereqOp.sequence >= op.sequence) {
                        warnings.push(`Operation ${op.operationNumber}: prerequisite ${prereqOp.operationNumber} comes after in sequence`);
                    }
                }
            }
        }
        // Check parallel operations exist
        if (op.parallelOperations) {
            for (const parallelId of op.parallelOperations) {
                if (!operationIds.has(parallelId)) {
                    errors.push(`Operation ${op.operationNumber}: parallel operation ${parallelId} not found`);
                }
            }
        }
    }
    // Check for circular dependencies
    for (const op of routing.operations) {
        if (hasCircularDependency(routing, op.operationId, op.operationId)) {
            errors.push(`Circular dependency detected involving operation ${op.operationNumber}`);
        }
    }
    return {
        valid: errors.length === 0,
        errors,
        warnings,
    };
}
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
function autoSequenceOperations(routing) {
    const graph = buildDependencyGraph(routing);
    const sequenced = [];
    const processed = new Set();
    const operationMap = new Map(routing.operations.map(op => [op.operationId, op]));
    function canProcess(opId) {
        const deps = graph.find(d => d.operationId === opId);
        if (!deps || !deps.dependsOn.length)
            return true;
        return deps.dependsOn.every(depId => processed.has(depId));
    }
    // Process operations in dependency order
    while (sequenced.length < routing.operations.length) {
        const candidates = routing.operations.filter(op => !processed.has(op.operationId) && canProcess(op.operationId));
        if (candidates.length === 0) {
            throw new Error('Cannot auto-sequence: circular dependency detected');
        }
        // Add candidates in original operation number order
        candidates.sort((a, b) => a.operationNumber - b.operationNumber);
        for (const candidate of candidates) {
            sequenced.push(candidate);
            processed.add(candidate.operationId);
        }
    }
    return {
        ...routing,
        operations: sequenced.map((op, index) => ({
            ...op,
            sequence: index + 1,
        })),
    };
}
// ============================================================================
// SECTION 3: WORK CENTER ASSIGNMENT (Functions 16-23)
// ============================================================================
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
function assignWorkCenter(routing, operationId, workCenterId, workCenter) {
    return {
        ...routing,
        operations: routing.operations.map(op => {
            if (op.operationId === operationId) {
                return {
                    ...op,
                    workCenterId,
                    workCenter,
                };
            }
            return op;
        }),
    };
}
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
function addAlternativeWorkCenter(routing, operationId, alternativeWorkCenterId) {
    return {
        ...routing,
        operations: routing.operations.map(op => {
            if (op.operationId === operationId) {
                const alternatives = op.alternativeWorkCenters || [];
                if (!alternatives.includes(alternativeWorkCenterId)) {
                    return {
                        ...op,
                        alternativeWorkCenters: [...alternatives, alternativeWorkCenterId],
                    };
                }
            }
            return op;
        }),
    };
}
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
function createWorkCenterAssignment(operationId, workCenter, isPrimary = true) {
    return {
        assignmentId: crypto.randomUUID(),
        operationId,
        workCenterId: workCenter.workCenterId,
        workCenter,
        priority: isPrimary ? 1 : 2,
        isPrimary,
        isAlternative: !isPrimary,
        capacityRequired: 1,
        assignedDate: new Date(),
    };
}
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
function findAvailableWorkCenters(workCenters, operationType, scheduledTime) {
    // Map operation types to work center types
    const typeMapping = {
        [OperationType.SETUP]: [WorkCenterType.MACHINE, WorkCenterType.MANUAL],
        [OperationType.RUN]: [WorkCenterType.MACHINE, WorkCenterType.MANUAL],
        [OperationType.INSPECTION]: [WorkCenterType.INSPECTION, WorkCenterType.TESTING],
        [OperationType.ASSEMBLY]: [WorkCenterType.ASSEMBLY, WorkCenterType.SUBASSEMBLY],
        [OperationType.TEARDOWN]: [WorkCenterType.MANUAL],
        [OperationType.QUALITY_CHECK]: [WorkCenterType.INSPECTION, WorkCenterType.TESTING],
        [OperationType.REWORK]: [WorkCenterType.MANUAL, WorkCenterType.MACHINE],
    };
    const compatibleTypes = typeMapping[operationType] || [];
    return workCenters.filter(wc => wc.isActive &&
        compatibleTypes.includes(wc.type) &&
        (wc.availableHours || 0) > 0);
}
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
function calculateWorkCenterCapacity(routing, quantity) {
    const capacity = {};
    for (const op of routing.operations) {
        if (op.workCenterId) {
            const totalTime = op.setupTime + op.runTime * quantity;
            const hoursRequired = totalTime / 60; // Convert minutes to hours
            if (!capacity[op.workCenterId]) {
                capacity[op.workCenterId] = 0;
            }
            capacity[op.workCenterId] += hoursRequired;
        }
    }
    return capacity;
}
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
function analyzeCapacityConstraints(routing, workCenters, quantity) {
    const capacityRequired = calculateWorkCenterCapacity(routing, quantity);
    const workCenterMap = new Map(workCenters.map(wc => [wc.workCenterId, wc]));
    const analysis = [];
    for (const [workCenterId, required] of Object.entries(capacityRequired)) {
        const workCenter = workCenterMap.get(workCenterId);
        if (!workCenter)
            continue;
        const available = (workCenter.availableHours || 0) * workCenter.efficiency;
        const utilization = available > 0 ? required / available : 0;
        const overloaded = utilization > 1.0;
        const recommendations = [];
        if (overloaded) {
            recommendations.push(`Add ${Math.ceil(required - available)} additional hours or use alternative work center`);
        }
        if (utilization > 0.8 && utilization <= 1.0) {
            recommendations.push('Near capacity - consider scheduling overtime');
        }
        analysis.push({
            workCenterId,
            workCenter,
            totalCapacityRequired: required,
            availableCapacity: available,
            utilizationRate: utilization,
            overloaded,
            bottleneck: utilization > 0.9,
            recommendations,
        });
    }
    // Sort by utilization (bottlenecks first)
    return analysis.sort((a, b) => b.utilizationRate - a.utilizationRate);
}
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
function balanceWorkLoad(routing, workCenters) {
    const workCenterMap = new Map(workCenters.map(wc => [wc.workCenterId, wc]));
    const workLoad = new Map();
    // Initialize work load tracking
    for (const wc of workCenters) {
        workLoad.set(wc.workCenterId, 0);
    }
    let updated = { ...routing };
    // Reassign operations to balance load
    for (const op of routing.operations) {
        if (op.alternativeWorkCenters && op.alternativeWorkCenters.length > 0) {
            const candidates = [op.workCenterId, ...op.alternativeWorkCenters]
                .filter(id => workCenterMap.has(id))
                .map(id => ({
                id,
                load: workLoad.get(id) || 0,
                capacity: (workCenterMap.get(id)?.availableHours || 0) *
                    (workCenterMap.get(id)?.efficiency || 1),
            }))
                .filter(c => c.capacity > 0);
            if (candidates.length > 0) {
                // Choose work center with lowest utilization
                candidates.sort((a, b) => a.load / a.capacity - b.load / b.capacity);
                const best = candidates[0];
                const opTime = op.setupTime + op.runTime;
                workLoad.set(best.id, (workLoad.get(best.id) || 0) + opTime);
                if (best.id !== op.workCenterId) {
                    const workCenter = workCenterMap.get(best.id);
                    updated = assignWorkCenter(updated, op.operationId, best.id, workCenter);
                }
            }
        }
        else {
            const opTime = op.setupTime + op.runTime;
            workLoad.set(op.workCenterId, (workLoad.get(op.workCenterId) || 0) + opTime);
        }
    }
    return updated;
}
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
function findBestWorkCenter(operation, workCenters, strategy = OptimizationStrategy.MINIMIZE_COST) {
    const available = findAvailableWorkCenters(workCenters, operation.type, new Date());
    if (available.length === 0)
        return null;
    switch (strategy) {
        case OptimizationStrategy.MINIMIZE_COST:
            return available.reduce((best, wc) => wc.costPerHour < best.costPerHour ? wc : best);
        case OptimizationStrategy.MINIMIZE_TIME:
            return available.reduce((best, wc) => wc.efficiency > best.efficiency ? wc : best);
        case OptimizationStrategy.BALANCE_WORKLOAD:
            return available.reduce((best, wc) => {
                const bestUtil = (best.availableHours || 0) > 0
                    ? 1 - best.availableHours / (best.availableHours || 1)
                    : 1;
                const wcUtil = (wc.availableHours || 0) > 0
                    ? 1 - wc.availableHours / (wc.availableHours || 1)
                    : 1;
                return wcUtil < bestUtil ? wc : best;
            });
        default:
            return available[0];
    }
}
// ============================================================================
// SECTION 4: VERSION MANAGEMENT (Functions 24-30)
// ============================================================================
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
function createRoutingVersion(routing, changeDescription, changedBy) {
    return {
        versionId: crypto.randomUUID(),
        routingId: routing.routingId,
        version: routing.version,
        changeDescription,
        changedBy,
        changedAt: new Date(),
        previousVersion: routing.version - 1,
        changes: [],
    };
}
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
function compareRoutingVersions(oldRouting, newRouting) {
    const changes = [];
    const oldOpIds = new Set(oldRouting.operations.map(op => op.operationId));
    const newOpIds = new Set(newRouting.operations.map(op => op.operationId));
    const oldOpMap = new Map(oldRouting.operations.map(op => [op.operationId, op]));
    const newOpMap = new Map(newRouting.operations.map(op => [op.operationId, op]));
    // Find added operations
    for (const opId of newOpIds) {
        if (!oldOpIds.has(opId)) {
            changes.push({
                changeId: crypto.randomUUID(),
                changeType: 'OPERATION_ADDED',
                operationId: opId,
                newValue: newOpMap.get(opId),
            });
        }
    }
    // Find removed operations
    for (const opId of oldOpIds) {
        if (!newOpIds.has(opId)) {
            changes.push({
                changeId: crypto.randomUUID(),
                changeType: 'OPERATION_REMOVED',
                operationId: opId,
                oldValue: oldOpMap.get(opId),
            });
        }
    }
    // Find modified operations
    for (const opId of newOpIds) {
        if (oldOpIds.has(opId)) {
            const oldOp = oldOpMap.get(opId);
            const newOp = newOpMap.get(opId);
            // Check sequence change
            if (oldOp.sequence !== newOp.sequence) {
                changes.push({
                    changeId: crypto.randomUUID(),
                    changeType: 'SEQUENCE_CHANGED',
                    operationId: opId,
                    field: 'sequence',
                    oldValue: oldOp.sequence,
                    newValue: newOp.sequence,
                });
            }
            // Check work center change
            if (oldOp.workCenterId !== newOp.workCenterId) {
                changes.push({
                    changeId: crypto.randomUUID(),
                    changeType: 'WORK_CENTER_CHANGED',
                    operationId: opId,
                    field: 'workCenterId',
                    oldValue: oldOp.workCenterId,
                    newValue: newOp.workCenterId,
                });
            }
            // Check time changes
            if (oldOp.setupTime !== newOp.setupTime || oldOp.runTime !== newOp.runTime) {
                changes.push({
                    changeId: crypto.randomUUID(),
                    changeType: 'OPERATION_MODIFIED',
                    operationId: opId,
                    field: 'times',
                    oldValue: { setupTime: oldOp.setupTime, runTime: oldOp.runTime },
                    newValue: { setupTime: newOp.setupTime, runTime: newOp.runTime },
                });
            }
        }
    }
    return changes;
}
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
function rollbackRoutingVersion(currentRouting, previousRouting, rolledBackBy) {
    return {
        ...previousRouting,
        routingId: generateRoutingId(),
        version: currentRouting.version + 1,
        status: RoutingStatus.DRAFT,
        createdBy: rolledBackBy,
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: {
            ...previousRouting.metadata,
            rolledBackFrom: currentRouting.routingId,
            rollbackReason: 'Version rollback',
        },
    };
}
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
function mergeRoutingChanges(baseRouting, alternativeRouting, operationIdsToMerge) {
    const alternativeOpMap = new Map(alternativeRouting.operations.map(op => [op.operationId, op]));
    const merged = {
        ...baseRouting,
        operations: baseRouting.operations.map(op => {
            if (operationIdsToMerge.includes(op.operationId)) {
                const altOp = alternativeOpMap.get(op.operationId);
                return altOp || op;
            }
            return op;
        }),
        version: baseRouting.version + 1,
        updatedAt: new Date(),
    };
    return recalculateRouting(merged);
}
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
function getRoutingVersionHistory(allRoutings, routingCode) {
    return allRoutings
        .filter(r => r.routingCode === routingCode)
        .sort((a, b) => b.version - a.version);
}
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
function approveRouting(routing, approvedBy, approvalNotes) {
    const validation = validateRouting(routing);
    if (!validation.valid) {
        throw new Error(`Cannot approve routing: ${validation.errors.join(', ')}`);
    }
    return {
        ...routing,
        status: RoutingStatus.APPROVED,
        approvedBy,
        approvedAt: new Date(),
        metadata: {
            ...routing.metadata,
            approvalNotes,
        },
    };
}
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
function archiveRouting(routing, reason) {
    return {
        ...routing,
        status: RoutingStatus.OBSOLETE,
        expirationDate: new Date(),
        metadata: {
            ...routing.metadata,
            archivalReason: reason,
            archivedAt: new Date(),
        },
    };
}
// ============================================================================
// SECTION 5: ROUTE OPTIMIZATION (Functions 31-37)
// ============================================================================
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
function optimizeRouting(routing, workCenters, config) {
    let optimized = { ...routing };
    const originalCost = routing.totalCost;
    const originalTime = routing.totalLeadTime;
    // Apply optimization based on strategy
    switch (config.strategy) {
        case OptimizationStrategy.MINIMIZE_COST:
            optimized = optimizeForCost(optimized, workCenters);
            break;
        case OptimizationStrategy.MINIMIZE_TIME:
            optimized = optimizeForTime(optimized, workCenters);
            break;
        case OptimizationStrategy.BALANCE_WORKLOAD:
            optimized = balanceWorkLoad(optimized, workCenters);
            break;
        case OptimizationStrategy.MINIMIZE_SETUP:
            optimized = minimizeSetupChanges(optimized);
            break;
        case OptimizationStrategy.MAXIMIZE_THROUGHPUT:
            optimized = maximizeThroughput(optimized, workCenters);
            break;
    }
    // Recalculate totals
    optimized = recalculateRouting(optimized);
    const improvements = {
        timeSaved: originalTime - optimized.totalLeadTime,
        costSaved: originalCost - optimized.totalCost,
        efficiencyGain: calculateEfficiencyGain(routing, optimized),
    };
    const recommendations = generateOptimizationRecommendations(routing, optimized, config);
    const warnings = validateOptimizationConstraints(optimized, config);
    return {
        optimizedRouting: optimized,
        improvements,
        recommendations,
        warnings,
    };
}
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
function calculateLeadTime(routing) {
    const criticalPath = findCriticalPath(routing);
    const operationMap = new Map(routing.operations.map(op => [op.operationId, op]));
    let setupTime = 0;
    let runTime = 0;
    let queueTime = 0;
    let moveTime = 0;
    let waitTime = 0;
    for (const op of routing.operations) {
        setupTime += op.setupTime;
        runTime += op.runTime * (routing.lotSize || 1);
        queueTime += op.queueTime;
        moveTime += op.moveTime;
    }
    // Add wait time based on dependencies
    for (const opId of criticalPath.operations) {
        const op = operationMap.get(opId);
        if (op?.prerequisites && op.prerequisites.length > 0) {
            waitTime += 15; // Average wait time between operations
        }
    }
    return {
        setupTime,
        runTime,
        queueTime,
        moveTime,
        waitTime,
        totalLeadTime: setupTime + runTime + queueTime + moveTime + waitTime,
        criticalPath: criticalPath.operations,
    };
}
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
function calculateCostBreakdown(routing, workCenters) {
    const workCenterMap = new Map(workCenters.map(wc => [wc.workCenterId, wc]));
    let laborCost = 0;
    let machineCost = 0;
    let toolingCost = 0;
    let overheadCost = 0;
    const operationCosts = [];
    for (const op of routing.operations) {
        const wc = workCenterMap.get(op.workCenterId);
        if (wc) {
            const setupCost = (op.setupTime / 60) * (wc.setupCostPerHour || wc.costPerHour);
            const runCost = (op.runTime / 60) * wc.costPerHour * (routing.lotSize || 1);
            machineCost += setupCost + runCost;
        }
        laborCost += op.laborCost;
        toolingCost += op.toolingCost;
        overheadCost += op.overheadCost;
        operationCosts.push({
            operationId: op.operationId,
            operationNumber: op.operationNumber,
            cost: op.totalCost,
        });
    }
    const totalCost = laborCost + machineCost + toolingCost + overheadCost;
    const costPerUnit = routing.lotSize ? totalCost / routing.lotSize : totalCost;
    return {
        laborCost,
        machineCost,
        toolingCost,
        overheadCost,
        materialCost: 0, // Would be added from BOM
        totalCost,
        costPerUnit,
        operationCosts,
    };
}
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
function validateRouting(routing) {
    const errors = [];
    const warnings = [];
    const recommendations = [];
    // Check basic requirements
    if (!routing.operations || routing.operations.length === 0) {
        errors.push('Routing must have at least one operation');
    }
    // Check operation numbers are unique
    const opNumbers = new Set();
    for (const op of routing.operations) {
        if (opNumbers.has(op.operationNumber)) {
            errors.push(`Duplicate operation number: ${op.operationNumber}`);
        }
        opNumbers.add(op.operationNumber);
        // Check work center assigned
        if (!op.workCenterId) {
            errors.push(`Operation ${op.operationNumber} missing work center assignment`);
        }
        // Check times are positive
        if (op.setupTime < 0 || op.runTime < 0) {
            errors.push(`Operation ${op.operationNumber} has negative time values`);
        }
        // Warn about long setup times
        if (op.setupTime > 480) {
            // > 8 hours
            warnings.push(`Operation ${op.operationNumber} has unusually long setup time (${op.setupTime} min)`);
        }
    }
    // Validate sequence
    const seqValidation = validateOperationSequence(routing);
    errors.push(...seqValidation.errors);
    warnings.push(...seqValidation.warnings);
    // Check for quality operations
    const hasQualityCheck = routing.operations.some(op => op.type === OperationType.QUALITY_CHECK || op.qualityCheckRequired);
    if (!hasQualityCheck) {
        recommendations.push('Consider adding quality check operations');
    }
    // Check for parallel operations opportunities
    if (routing.operations.length >= 5) {
        const hasParallel = routing.operations.some(op => op.parallelOperations && op.parallelOperations.length > 0);
        if (!hasParallel) {
            recommendations.push('Consider identifying parallel operation opportunities');
        }
    }
    return {
        valid: errors.length === 0,
        errors,
        warnings,
        recommendations,
    };
}
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
function identifyBottlenecks(routing, workCenters) {
    const workCenterMap = new Map(workCenters.map(wc => [wc.workCenterId, wc]));
    const bottlenecks = [];
    for (const op of routing.operations) {
        let score = 0;
        const reasons = [];
        const recommendations = [];
        // Long operation time
        const totalTime = op.setupTime + op.runTime * (routing.lotSize || 1);
        if (totalTime > 240) {
            // > 4 hours
            score += 3;
            reasons.push(`Long operation time: ${totalTime} minutes`);
            recommendations.push('Consider splitting into multiple operations');
        }
        // Work center capacity
        const wc = workCenterMap.get(op.workCenterId);
        if (wc && wc.efficiency < 0.8) {
            score += 2;
            reasons.push(`Low work center efficiency: ${(wc.efficiency * 100).toFixed(0)}%`);
            recommendations.push('Investigate work center efficiency issues');
        }
        // No alternative work centers
        if (!op.alternativeWorkCenters || op.alternativeWorkCenters.length === 0) {
            score += 1;
            reasons.push('No alternative work centers defined');
            recommendations.push('Define alternative work centers for flexibility');
        }
        // Critical operation
        if (op.criticalOperation) {
            score += 2;
            reasons.push('Marked as critical operation');
        }
        // Many dependencies
        if (op.prerequisites && op.prerequisites.length > 2) {
            score += 1;
            reasons.push(`Multiple prerequisites: ${op.prerequisites.length}`);
            recommendations.push('Review operation dependencies');
        }
        if (score >= 3) {
            bottlenecks.push({
                operationId: op.operationId,
                operationNumber: op.operationNumber,
                bottleneckScore: score,
                reason: reasons.join('; '),
                recommendations,
            });
        }
    }
    return bottlenecks.sort((a, b) => b.bottleneckScore - a.bottleneckScore);
}
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
function suggestRoutingImprovements(routing, workCenters) {
    const suggestions = [];
    // Check for optimization opportunities
    const bottlenecks = identifyBottlenecks(routing, workCenters);
    if (bottlenecks.length > 0) {
        suggestions.push(`${bottlenecks.length} potential bottleneck(s) identified - review critical path`);
    }
    // Check capacity
    const capacity = analyzeCapacityConstraints(routing, workCenters, routing.lotSize || 1);
    const overloaded = capacity.filter(c => c.overloaded);
    if (overloaded.length > 0) {
        suggestions.push(`${overloaded.length} work center(s) overloaded - consider alternatives or additional capacity`);
    }
    // Check for setup reduction opportunities
    const totalSetup = routing.totalSetupTime;
    const totalRun = routing.totalRunTime;
    if (totalSetup > totalRun * 0.5) {
        suggestions.push('High setup time ratio - consider setup reduction initiatives or larger lot sizes');
    }
    // Check operation count
    if (routing.operations.length > 20) {
        suggestions.push('Large number of operations - consider consolidation opportunities');
    }
    // Check for parallel opportunities
    const sequential = routing.operations.filter(op => !op.parallelOperations || op.parallelOperations.length === 0);
    if (sequential.length === routing.operations.length && routing.operations.length > 3) {
        suggestions.push('All operations are sequential - evaluate parallel processing opportunities');
    }
    // Check lead time
    const leadTime = calculateLeadTime(routing);
    if (leadTime.queueTime > leadTime.runTime) {
        suggestions.push('Queue time exceeds run time - review scheduling and capacity planning');
    }
    return suggestions;
}
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
function exportRouting(routing, format = 'JSON') {
    if (format === 'JSON') {
        return {
            routing: {
                routingId: routing.routingId,
                routingCode: routing.routingCode,
                version: routing.version,
                itemCode: routing.itemCode,
                description: routing.description,
                status: routing.status,
                effectiveDate: routing.effectiveDate.toISOString(),
                totalLeadTime: routing.totalLeadTime,
                totalCost: routing.totalCost,
            },
            operations: routing.operations.map(op => ({
                operationNumber: op.operationNumber,
                sequence: op.sequence,
                description: op.description,
                type: op.type,
                workCenterId: op.workCenterId,
                setupTime: op.setupTime,
                runTime: op.runTime,
                totalCost: op.totalCost,
                qualityCheckRequired: op.qualityCheckRequired,
                prerequisites: op.prerequisites,
                parallelOperations: op.parallelOperations,
            })),
        };
    }
    if (format === 'CSV') {
        const headers = [
            'Operation Number',
            'Sequence',
            'Description',
            'Type',
            'Work Center',
            'Setup Time (min)',
            'Run Time (min)',
            'Labor Hours',
            'Total Cost',
            'Quality Check',
        ];
        let csv = headers.join(',') + '\n';
        for (const op of routing.operations) {
            const row = [
                op.operationNumber,
                op.sequence,
                `"${op.description}"`,
                op.type,
                op.workCenterId,
                op.setupTime,
                op.runTime,
                op.laborHours,
                op.totalCost.toFixed(2),
                op.qualityCheckRequired ? 'Yes' : 'No',
            ];
            csv += row.join(',') + '\n';
        }
        return csv;
    }
    // PDF format would require additional library
    return 'PDF export not implemented';
}
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Helper: Generates unique routing ID.
 */
function generateRoutingId() {
    return `RT-${crypto.randomUUID()}`;
}
/**
 * Helper: Generates routing code from item code.
 */
function generateRoutingCode(itemCode) {
    const timestamp = Date.now().toString().slice(-6);
    return `RT-${itemCode}-${timestamp}`;
}
/**
 * Helper: Calculates operation cost.
 */
function calculateOperationCost(operation) {
    return (operation.laborCost +
        operation.toolingCost +
        operation.overheadCost);
}
/**
 * Helper: Checks for circular dependencies.
 */
function hasCircularDependency(routing, operationId, prerequisiteId, visited = new Set()) {
    if (operationId === prerequisiteId)
        return true;
    if (visited.has(prerequisiteId))
        return false;
    visited.add(prerequisiteId);
    const prereqOp = routing.operations.find(op => op.operationId === prerequisiteId);
    if (!prereqOp || !prereqOp.prerequisites)
        return false;
    for (const nextPrereq of prereqOp.prerequisites) {
        if (hasCircularDependency(routing, operationId, nextPrereq, visited)) {
            return true;
        }
    }
    return false;
}
/**
 * Helper: Optimizes routing for minimum cost.
 */
function optimizeForCost(routing, workCenters) {
    let optimized = { ...routing };
    for (const op of routing.operations) {
        const bestWC = findBestWorkCenter(op, workCenters, OptimizationStrategy.MINIMIZE_COST);
        if (bestWC && bestWC.workCenterId !== op.workCenterId) {
            optimized = assignWorkCenter(optimized, op.operationId, bestWC.workCenterId, bestWC);
        }
    }
    return optimized;
}
/**
 * Helper: Optimizes routing for minimum time.
 */
function optimizeForTime(routing, workCenters) {
    let optimized = { ...routing };
    // Assign to fastest work centers
    for (const op of routing.operations) {
        const bestWC = findBestWorkCenter(op, workCenters, OptimizationStrategy.MINIMIZE_TIME);
        if (bestWC && bestWC.workCenterId !== op.workCenterId) {
            optimized = assignWorkCenter(optimized, op.operationId, bestWC.workCenterId, bestWC);
        }
    }
    // Identify parallel operation opportunities
    const graph = buildDependencyGraph(optimized);
    const parallelGroups = [];
    for (let i = 0; i < optimized.operations.length; i++) {
        const op1 = optimized.operations[i];
        const deps1 = graph.find(d => d.operationId === op1.operationId);
        for (let j = i + 1; j < optimized.operations.length; j++) {
            const op2 = optimized.operations[j];
            const deps2 = graph.find(d => d.operationId === op2.operationId);
            // Can run in parallel if no mutual dependencies
            if (deps1 &&
                deps2 &&
                !deps1.dependsOn.includes(op2.operationId) &&
                !deps2.dependsOn.includes(op1.operationId) &&
                !deps1.blockedBy.includes(op2.operationId) &&
                !deps2.blockedBy.includes(op1.operationId)) {
                let added = false;
                for (const group of parallelGroups) {
                    if (group.includes(op1.operationId)) {
                        group.push(op2.operationId);
                        added = true;
                        break;
                    }
                }
                if (!added) {
                    parallelGroups.push([op1.operationId, op2.operationId]);
                }
            }
        }
    }
    // Apply parallel groupings
    for (const group of parallelGroups) {
        if (group.length > 1) {
            optimized = setParallelOperations(optimized, group);
        }
    }
    return optimized;
}
/**
 * Helper: Minimizes setup changes by grouping similar operations.
 */
function minimizeSetupChanges(routing) {
    // Group operations by work center
    const grouped = [...routing.operations].sort((a, b) => {
        if (a.workCenterId === b.workCenterId) {
            return a.sequence - b.sequence;
        }
        return a.workCenterId.localeCompare(b.workCenterId);
    });
    return {
        ...routing,
        operations: grouped.map((op, index) => ({
            ...op,
            sequence: index + 1,
        })),
    };
}
/**
 * Helper: Maximizes throughput by optimizing for highest capacity.
 */
function maximizeThroughput(routing, workCenters) {
    let optimized = { ...routing };
    for (const op of routing.operations) {
        const available = findAvailableWorkCenters(workCenters, op.type, new Date());
        if (available.length > 0) {
            // Choose work center with highest capacity
            const highest = available.reduce((best, wc) => wc.capacity > best.capacity ? wc : best);
            if (highest.workCenterId !== op.workCenterId) {
                optimized = assignWorkCenter(optimized, op.operationId, highest.workCenterId, highest);
            }
        }
    }
    return optimized;
}
/**
 * Helper: Calculates efficiency gain between routings.
 */
function calculateEfficiencyGain(oldRouting, newRouting) {
    const oldEfficiency = oldRouting.totalRunTime / oldRouting.totalLeadTime;
    const newEfficiency = newRouting.totalRunTime / newRouting.totalLeadTime;
    return newEfficiency - oldEfficiency;
}
/**
 * Helper: Generates optimization recommendations.
 */
function generateOptimizationRecommendations(original, optimized, config) {
    const recommendations = [];
    if (optimized.totalCost < original.totalCost) {
        const savings = original.totalCost - optimized.totalCost;
        recommendations.push(`Cost reduced by $${savings.toFixed(2)}`);
    }
    if (optimized.totalLeadTime < original.totalLeadTime) {
        const timeSaved = original.totalLeadTime - optimized.totalLeadTime;
        recommendations.push(`Lead time reduced by ${timeSaved.toFixed(0)} minutes`);
    }
    const originalParallel = original.operations.filter(op => op.parallelOperations && op.parallelOperations.length > 0).length;
    const optimizedParallel = optimized.operations.filter(op => op.parallelOperations && op.parallelOperations.length > 0).length;
    if (optimizedParallel > originalParallel) {
        recommendations.push(`${optimizedParallel - originalParallel} additional parallel operation(s) identified`);
    }
    return recommendations;
}
/**
 * Helper: Validates optimization constraints.
 */
function validateOptimizationConstraints(routing, config) {
    const warnings = [];
    if (config.constraints.maxLeadTime && routing.totalLeadTime > config.constraints.maxLeadTime) {
        warnings.push(`Lead time ${routing.totalLeadTime} exceeds constraint ${config.constraints.maxLeadTime}`);
    }
    if (config.constraints.maxCost && routing.totalCost > config.constraints.maxCost) {
        warnings.push(`Cost ${routing.totalCost.toFixed(2)} exceeds constraint ${config.constraints.maxCost.toFixed(2)}`);
    }
    if (config.constraints.requiredWorkCenters) {
        for (const required of config.constraints.requiredWorkCenters) {
            if (!routing.operations.some(op => op.workCenterId === required)) {
                warnings.push(`Required work center ${required} not used`);
            }
        }
    }
    if (config.constraints.excludedWorkCenters) {
        for (const excluded of config.constraints.excludedWorkCenters) {
            if (routing.operations.some(op => op.workCenterId === excluded)) {
                warnings.push(`Excluded work center ${excluded} is still used`);
            }
        }
    }
    return warnings;
}
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Routing Definition
    createRouting,
    addOperation,
    removeOperation,
    updateOperation,
    cloneRouting,
    activateRouting,
    recalculateRouting,
    // Operation Sequencing
    reorderOperation,
    addOperationDependency,
    removeOperationDependency,
    setParallelOperations,
    buildDependencyGraph,
    findCriticalPath,
    validateOperationSequence,
    autoSequenceOperations,
    // Work Center Assignment
    assignWorkCenter,
    addAlternativeWorkCenter,
    createWorkCenterAssignment,
    findAvailableWorkCenters,
    calculateWorkCenterCapacity,
    analyzeCapacityConstraints,
    balanceWorkLoad,
    findBestWorkCenter,
    // Version Management
    createRoutingVersion,
    compareRoutingVersions,
    rollbackRoutingVersion,
    mergeRoutingChanges,
    getRoutingVersionHistory,
    approveRouting,
    archiveRouting,
    // Route Optimization
    optimizeRouting,
    calculateLeadTime,
    calculateCostBreakdown,
    validateRouting,
    identifyBottlenecks,
    suggestRoutingImprovements,
    exportRouting,
};
//# sourceMappingURL=work-order-routing-kit.js.map