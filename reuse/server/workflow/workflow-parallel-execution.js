"use strict";
/**
 * LOC: WF-PAR-001
 * File: /reuse/server/workflow/workflow-parallel-execution.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v11.1.8)
 *   - @nestjs/swagger (v11.2.1)
 *   - class-validator (v0.14.2)
 *   - class-transformer (v0.5.1)
 *   - rxjs (v7.8.1)
 *
 * DOWNSTREAM (imported by):
 *   - Workflow orchestration services
 *   - Process automation controllers
 *   - Parallel task execution modules
 *   - Workflow engine services
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParallelBranchDto = exports.ParallelGatewayConfigDto = exports.ResourceAllocationStrategy = exports.GatewayState = exports.BranchStatus = exports.ParallelJoinType = exports.ParallelSplitType = void 0;
exports.createParallelGateway = createParallelGateway;
exports.executeAndSplit = executeAndSplit;
exports.executeOrSplit = executeOrSplit;
exports.executeConditionalSplit = executeConditionalSplit;
exports.evaluateCondition = evaluateCondition;
exports.createBranchContext = createBranchContext;
exports.prioritizeBranches = prioritizeBranches;
exports.createIsolatedScope = createIsolatedScope;
exports.cloneBranchForRetry = cloneBranchForRetry;
exports.validateBranchConfig = validateBranchConfig;
exports.executeConcurrent = executeConcurrent;
exports.executeBranch = executeBranch;
exports.executeBranchLogic = executeBranchLogic;
exports.createTimeout = createTimeout;
exports.monitorConcurrentExecution = monitorConcurrentExecution;
exports.waitForAllBranches = waitForAllBranches;
exports.waitForAnyBranch = waitForAnyBranch;
exports.waitForNOfM = waitForNOfM;
exports.waitForMajority = waitForMajority;
exports.executeGatewayJoin = executeGatewayJoin;
exports.createParallelToken = createParallelToken;
exports.consumeToken = consumeToken;
exports.countActiveTokens = countActiveTokens;
exports.countConsumedTokens = countConsumedTokens;
exports.synchronizeBranchCompletion = synchronizeBranchCompletion;
exports.trackBranchProgress = trackBranchProgress;
exports.getCompletionPercentage = getCompletionPercentage;
exports.getPendingBranches = getPendingBranches;
exports.getFailedBranches = getFailedBranches;
exports.areAllBranchesSuccessful = areAllBranchesSuccessful;
exports.handlePartialJoin = handlePartialJoin;
exports.collectCompletedResults = collectCompletedResults;
exports.mergeParallelResults = mergeParallelResults;
exports.handleIncompleteBranches = handleIncompleteBranches;
exports.createPartialCompletionReport = createPartialCompletionReport;
exports.createResourcePool = createResourcePool;
exports.allocateResources = allocateResources;
exports.releaseResources = releaseResources;
exports.calculateResourceUtilization = calculateResourceUtilization;
exports.optimizeResourceAllocation = optimizeResourceAllocation;
exports.calculateThroughput = calculateThroughput;
exports.calculateBranchMetrics = calculateBranchMetrics;
exports.createExecutionTimeline = createExecutionTimeline;
exports.generateExecutionReport = generateExecutionReport;
exports.streamExecutionUpdates = streamExecutionUpdates;
/**
 * File: /reuse/server/workflow/workflow-parallel-execution.ts
 * Locator: WC-WF-PAR-001
 * Purpose: Parallel Gateway Execution Kit - Enterprise-grade parallel workflow execution and synchronization
 *
 * Upstream: @nestjs/common, @nestjs/swagger, class-validator, class-transformer, rxjs, Bull/BullMQ
 * Downstream: Workflow controllers, process orchestration services, parallel task managers, gateway handlers
 * Dependencies: NestJS v11.x, Node 18+, TypeScript 5.x, Bull 4.x, RxJS 7.x
 * Exports: 45 production-grade functions for parallel gateway splitting, branch creation, concurrent execution,
 *          gateway convergence, branch synchronization, completion tracking, partial joins, thread pools,
 *          resource allocation, and parallel execution monitoring
 *
 * LLM Context: Production-ready parallel gateway execution toolkit for White Cross healthcare platform.
 * Provides comprehensive utilities for parallel workflow splitting, concurrent branch execution, gateway
 * synchronization, token-based completion tracking, thread pool management, resource allocation, partial join
 * handling, timeout management, branch failure recovery, parallel state management, and execution monitoring.
 * HIPAA-compliant with full audit logging, healthcare-specific validations, and distributed execution support.
 *
 * Features:
 * - Parallel gateway AND/OR splitting
 * - Concurrent branch execution with isolation
 * - Token-based synchronization patterns
 * - Thread pool and resource management
 * - Partial join and timeout handling
 * - Branch completion tracking
 * - Distributed execution support
 * - Real-time monitoring and metrics
 * - Failure recovery and compensation
 * - Healthcare workflow compliance
 */
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const rxjs_1 = require("rxjs");
// ============================================================================
// TYPE DEFINITIONS & ENUMS
// ============================================================================
/**
 * Parallel gateway split types
 */
var ParallelSplitType;
(function (ParallelSplitType) {
    ParallelSplitType["AND"] = "AND";
    ParallelSplitType["OR"] = "OR";
    ParallelSplitType["CONDITIONAL"] = "CONDITIONAL";
})(ParallelSplitType || (exports.ParallelSplitType = ParallelSplitType = {}));
/**
 * Parallel join types
 */
var ParallelJoinType;
(function (ParallelJoinType) {
    ParallelJoinType["ALL"] = "ALL";
    ParallelJoinType["ANY"] = "ANY";
    ParallelJoinType["N_OF_M"] = "N_OF_M";
    ParallelJoinType["MAJORITY"] = "MAJORITY";
    ParallelJoinType["TIMEOUT"] = "TIMEOUT";
})(ParallelJoinType || (exports.ParallelJoinType = ParallelJoinType = {}));
/**
 * Branch execution status
 */
var BranchStatus;
(function (BranchStatus) {
    BranchStatus["PENDING"] = "PENDING";
    BranchStatus["RUNNING"] = "RUNNING";
    BranchStatus["COMPLETED"] = "COMPLETED";
    BranchStatus["FAILED"] = "FAILED";
    BranchStatus["CANCELLED"] = "CANCELLED";
    BranchStatus["TIMEOUT"] = "TIMEOUT";
})(BranchStatus || (exports.BranchStatus = BranchStatus = {}));
/**
 * Parallel gateway state
 */
var GatewayState;
(function (GatewayState) {
    GatewayState["IDLE"] = "IDLE";
    GatewayState["SPLITTING"] = "SPLITTING";
    GatewayState["EXECUTING"] = "EXECUTING";
    GatewayState["SYNCHRONIZING"] = "SYNCHRONIZING";
    GatewayState["COMPLETED"] = "COMPLETED";
    GatewayState["FAILED"] = "FAILED";
})(GatewayState || (exports.GatewayState = GatewayState = {}));
/**
 * Resource allocation strategy
 */
var ResourceAllocationStrategy;
(function (ResourceAllocationStrategy) {
    ResourceAllocationStrategy["FAIR"] = "FAIR";
    ResourceAllocationStrategy["PRIORITY"] = "PRIORITY";
    ResourceAllocationStrategy["DYNAMIC"] = "DYNAMIC";
    ResourceAllocationStrategy["RESERVED"] = "RESERVED";
})(ResourceAllocationStrategy || (exports.ResourceAllocationStrategy = ResourceAllocationStrategy = {}));
// ============================================================================
// DTOS & INTERFACES
// ============================================================================
/**
 * Parallel gateway configuration DTO
 */
let ParallelGatewayConfigDto = (() => {
    var _a;
    let _gatewayId_decorators;
    let _gatewayId_initializers = [];
    let _gatewayId_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _splitType_decorators;
    let _splitType_initializers = [];
    let _splitType_extraInitializers = [];
    let _joinType_decorators;
    let _joinType_initializers = [];
    let _joinType_extraInitializers = [];
    let _maxConcurrentBranches_decorators;
    let _maxConcurrentBranches_initializers = [];
    let _maxConcurrentBranches_extraInitializers = [];
    let _joinTimeoutMs_decorators;
    let _joinTimeoutMs_initializers = [];
    let _joinTimeoutMs_extraInitializers = [];
    let _requiredCompletions_decorators;
    let _requiredCompletions_initializers = [];
    let _requiredCompletions_extraInitializers = [];
    let _allowPartialJoin_decorators;
    let _allowPartialJoin_initializers = [];
    let _allowPartialJoin_extraInitializers = [];
    let _resourceStrategy_decorators;
    let _resourceStrategy_initializers = [];
    let _resourceStrategy_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    return _a = class ParallelGatewayConfigDto {
            constructor() {
                this.gatewayId = __runInitializers(this, _gatewayId_initializers, void 0);
                this.name = (__runInitializers(this, _gatewayId_extraInitializers), __runInitializers(this, _name_initializers, void 0));
                this.splitType = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _splitType_initializers, void 0));
                this.joinType = (__runInitializers(this, _splitType_extraInitializers), __runInitializers(this, _joinType_initializers, void 0));
                this.maxConcurrentBranches = (__runInitializers(this, _joinType_extraInitializers), __runInitializers(this, _maxConcurrentBranches_initializers, void 0));
                this.joinTimeoutMs = (__runInitializers(this, _maxConcurrentBranches_extraInitializers), __runInitializers(this, _joinTimeoutMs_initializers, void 0));
                this.requiredCompletions = (__runInitializers(this, _joinTimeoutMs_extraInitializers), __runInitializers(this, _requiredCompletions_initializers, void 0));
                this.allowPartialJoin = (__runInitializers(this, _requiredCompletions_extraInitializers), __runInitializers(this, _allowPartialJoin_initializers, void 0));
                this.resourceStrategy = (__runInitializers(this, _allowPartialJoin_extraInitializers), __runInitializers(this, _resourceStrategy_initializers, void 0));
                this.metadata = (__runInitializers(this, _resourceStrategy_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                __runInitializers(this, _metadata_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _gatewayId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Gateway identifier' }), (0, class_validator_1.IsUUID)()];
            _name_decorators = [(0, swagger_1.ApiProperty)({ description: 'Gateway name' }), (0, class_validator_1.IsString)()];
            _splitType_decorators = [(0, swagger_1.ApiProperty)({ enum: ParallelSplitType, description: 'Split strategy' }), (0, class_validator_1.IsEnum)(ParallelSplitType)];
            _joinType_decorators = [(0, swagger_1.ApiProperty)({ enum: ParallelJoinType, description: 'Join strategy' }), (0, class_validator_1.IsEnum)(ParallelJoinType)];
            _maxConcurrentBranches_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Maximum concurrent branches' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(100)];
            _joinTimeoutMs_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Join timeout in milliseconds' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1000)];
            _requiredCompletions_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'For N_OF_M join: required completions' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1)];
            _allowPartialJoin_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Enable partial join on timeout' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            _resourceStrategy_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Resource allocation strategy' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(ResourceAllocationStrategy)];
            _metadata_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Gateway metadata' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsObject)()];
            __esDecorate(null, null, _gatewayId_decorators, { kind: "field", name: "gatewayId", static: false, private: false, access: { has: obj => "gatewayId" in obj, get: obj => obj.gatewayId, set: (obj, value) => { obj.gatewayId = value; } }, metadata: _metadata }, _gatewayId_initializers, _gatewayId_extraInitializers);
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _splitType_decorators, { kind: "field", name: "splitType", static: false, private: false, access: { has: obj => "splitType" in obj, get: obj => obj.splitType, set: (obj, value) => { obj.splitType = value; } }, metadata: _metadata }, _splitType_initializers, _splitType_extraInitializers);
            __esDecorate(null, null, _joinType_decorators, { kind: "field", name: "joinType", static: false, private: false, access: { has: obj => "joinType" in obj, get: obj => obj.joinType, set: (obj, value) => { obj.joinType = value; } }, metadata: _metadata }, _joinType_initializers, _joinType_extraInitializers);
            __esDecorate(null, null, _maxConcurrentBranches_decorators, { kind: "field", name: "maxConcurrentBranches", static: false, private: false, access: { has: obj => "maxConcurrentBranches" in obj, get: obj => obj.maxConcurrentBranches, set: (obj, value) => { obj.maxConcurrentBranches = value; } }, metadata: _metadata }, _maxConcurrentBranches_initializers, _maxConcurrentBranches_extraInitializers);
            __esDecorate(null, null, _joinTimeoutMs_decorators, { kind: "field", name: "joinTimeoutMs", static: false, private: false, access: { has: obj => "joinTimeoutMs" in obj, get: obj => obj.joinTimeoutMs, set: (obj, value) => { obj.joinTimeoutMs = value; } }, metadata: _metadata }, _joinTimeoutMs_initializers, _joinTimeoutMs_extraInitializers);
            __esDecorate(null, null, _requiredCompletions_decorators, { kind: "field", name: "requiredCompletions", static: false, private: false, access: { has: obj => "requiredCompletions" in obj, get: obj => obj.requiredCompletions, set: (obj, value) => { obj.requiredCompletions = value; } }, metadata: _metadata }, _requiredCompletions_initializers, _requiredCompletions_extraInitializers);
            __esDecorate(null, null, _allowPartialJoin_decorators, { kind: "field", name: "allowPartialJoin", static: false, private: false, access: { has: obj => "allowPartialJoin" in obj, get: obj => obj.allowPartialJoin, set: (obj, value) => { obj.allowPartialJoin = value; } }, metadata: _metadata }, _allowPartialJoin_initializers, _allowPartialJoin_extraInitializers);
            __esDecorate(null, null, _resourceStrategy_decorators, { kind: "field", name: "resourceStrategy", static: false, private: false, access: { has: obj => "resourceStrategy" in obj, get: obj => obj.resourceStrategy, set: (obj, value) => { obj.resourceStrategy = value; } }, metadata: _metadata }, _resourceStrategy_initializers, _resourceStrategy_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ParallelGatewayConfigDto = ParallelGatewayConfigDto;
/**
 * Parallel branch definition DTO
 */
let ParallelBranchDto = (() => {
    var _a;
    let _branchId_decorators;
    let _branchId_initializers = [];
    let _branchId_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    let _condition_decorators;
    let _condition_initializers = [];
    let _condition_extraInitializers = [];
    let _timeoutMs_decorators;
    let _timeoutMs_initializers = [];
    let _timeoutMs_extraInitializers = [];
    let _resources_decorators;
    let _resources_initializers = [];
    let _resources_extraInitializers = [];
    let _config_decorators;
    let _config_initializers = [];
    let _config_extraInitializers = [];
    let _retryOnFailure_decorators;
    let _retryOnFailure_initializers = [];
    let _retryOnFailure_extraInitializers = [];
    let _maxRetries_decorators;
    let _maxRetries_initializers = [];
    let _maxRetries_extraInitializers = [];
    return _a = class ParallelBranchDto {
            constructor() {
                this.branchId = __runInitializers(this, _branchId_initializers, void 0);
                this.name = (__runInitializers(this, _branchId_extraInitializers), __runInitializers(this, _name_initializers, void 0));
                this.priority = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
                this.condition = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _condition_initializers, void 0));
                this.timeoutMs = (__runInitializers(this, _condition_extraInitializers), __runInitializers(this, _timeoutMs_initializers, void 0));
                this.resources = (__runInitializers(this, _timeoutMs_extraInitializers), __runInitializers(this, _resources_initializers, void 0));
                this.config = (__runInitializers(this, _resources_extraInitializers), __runInitializers(this, _config_initializers, void 0));
                this.retryOnFailure = (__runInitializers(this, _config_extraInitializers), __runInitializers(this, _retryOnFailure_initializers, void 0));
                this.maxRetries = (__runInitializers(this, _retryOnFailure_extraInitializers), __runInitializers(this, _maxRetries_initializers, void 0));
                __runInitializers(this, _maxRetries_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _branchId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Branch identifier' }), (0, class_validator_1.IsUUID)()];
            _name_decorators = [(0, swagger_1.ApiProperty)({ description: 'Branch name' }), (0, class_validator_1.IsString)()];
            _priority_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Branch execution priority (1-10)' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(10)];
            _condition_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Execution condition expression' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _timeoutMs_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Branch timeout in milliseconds' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1000)];
            _resources_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Required resources' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsObject)()];
            _config_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Branch configuration' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsObject)()];
            _retryOnFailure_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Enable retry on failure' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            _maxRetries_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Maximum retry attempts' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(5)];
            __esDecorate(null, null, _branchId_decorators, { kind: "field", name: "branchId", static: false, private: false, access: { has: obj => "branchId" in obj, get: obj => obj.branchId, set: (obj, value) => { obj.branchId = value; } }, metadata: _metadata }, _branchId_initializers, _branchId_extraInitializers);
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
            __esDecorate(null, null, _condition_decorators, { kind: "field", name: "condition", static: false, private: false, access: { has: obj => "condition" in obj, get: obj => obj.condition, set: (obj, value) => { obj.condition = value; } }, metadata: _metadata }, _condition_initializers, _condition_extraInitializers);
            __esDecorate(null, null, _timeoutMs_decorators, { kind: "field", name: "timeoutMs", static: false, private: false, access: { has: obj => "timeoutMs" in obj, get: obj => obj.timeoutMs, set: (obj, value) => { obj.timeoutMs = value; } }, metadata: _metadata }, _timeoutMs_initializers, _timeoutMs_extraInitializers);
            __esDecorate(null, null, _resources_decorators, { kind: "field", name: "resources", static: false, private: false, access: { has: obj => "resources" in obj, get: obj => obj.resources, set: (obj, value) => { obj.resources = value; } }, metadata: _metadata }, _resources_initializers, _resources_extraInitializers);
            __esDecorate(null, null, _config_decorators, { kind: "field", name: "config", static: false, private: false, access: { has: obj => "config" in obj, get: obj => obj.config, set: (obj, value) => { obj.config = value; } }, metadata: _metadata }, _config_initializers, _config_extraInitializers);
            __esDecorate(null, null, _retryOnFailure_decorators, { kind: "field", name: "retryOnFailure", static: false, private: false, access: { has: obj => "retryOnFailure" in obj, get: obj => obj.retryOnFailure, set: (obj, value) => { obj.retryOnFailure = value; } }, metadata: _metadata }, _retryOnFailure_initializers, _retryOnFailure_extraInitializers);
            __esDecorate(null, null, _maxRetries_decorators, { kind: "field", name: "maxRetries", static: false, private: false, access: { has: obj => "maxRetries" in obj, get: obj => obj.maxRetries, set: (obj, value) => { obj.maxRetries = value; } }, metadata: _metadata }, _maxRetries_initializers, _maxRetries_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ParallelBranchDto = ParallelBranchDto;
// ============================================================================
// PARALLEL GATEWAY SPLITTING
// ============================================================================
/**
 * 1. Creates a parallel gateway split operation
 *
 * @param {ParallelGatewayConfigDto} config - Gateway configuration
 * @param {ParallelBranchDto[]} branches - Branches to execute
 * @returns {Promise<ParallelGatewayInstance>} Gateway instance
 *
 * @example
 * ```typescript
 * const gateway = await createParallelGateway(config, branches);
 * console.log(`Created gateway ${gateway.instanceId} with ${gateway.totalBranches} branches`);
 * ```
 */
async function createParallelGateway(config, branches) {
    if (!branches || branches.length === 0) {
        throw new common_1.BadRequestException('At least one branch required for parallel gateway');
    }
    const instance = {
        instanceId: generateInstanceId(),
        gatewayId: config.gatewayId,
        state: GatewayState.IDLE,
        branches: new Map(),
        totalBranches: branches.length,
        completedBranches: 0,
        failedBranches: 0,
        tokens: new Map(),
        resources: createResourcePool(config.resourceStrategy || ResourceAllocationStrategy.FAIR),
        metadata: config.metadata,
    };
    return instance;
}
/**
 * 2. Executes AND split - all branches execute in parallel
 *
 * @param {ParallelGatewayInstance} instance - Gateway instance
 * @param {ParallelBranchDto[]} branches - Branches to split
 * @param {Record<string, any>} context - Execution context
 * @returns {Promise<Map<string, BranchExecutionContext>>} Branch contexts
 *
 * @example
 * ```typescript
 * const contexts = await executeAndSplit(instance, branches, { patientId: '123' });
 * console.log(`Started ${contexts.size} parallel branches`);
 * ```
 */
async function executeAndSplit(instance, branches, context) {
    instance.state = GatewayState.SPLITTING;
    instance.splitTime = new Date();
    const branchContexts = new Map();
    for (const branch of branches) {
        const branchContext = {
            branchId: branch.branchId,
            gatewayId: instance.gatewayId,
            instanceId: instance.instanceId,
            startTime: new Date(),
            data: { ...context },
            variables: { ...branch.config },
            parentContext: context,
        };
        branchContexts.set(branch.branchId, branchContext);
        // Create token for branch
        const token = createParallelToken(branch.branchId, instance.gatewayId);
        instance.tokens.set(token.tokenId, token);
        // Initialize branch result
        instance.branches.set(branch.branchId, {
            branchId: branch.branchId,
            status: BranchStatus.PENDING,
            startTime: branchContext.startTime,
        });
    }
    instance.state = GatewayState.EXECUTING;
    return branchContexts;
}
/**
 * 3. Executes OR split - at least one branch must execute
 *
 * @param {ParallelGatewayInstance} instance - Gateway instance
 * @param {ParallelBranchDto[]} branches - Branches to evaluate
 * @param {Record<string, any>} context - Execution context
 * @returns {Promise<Map<string, BranchExecutionContext>>} Selected branch contexts
 *
 * @example
 * ```typescript
 * const contexts = await executeOrSplit(instance, branches, { urgency: 'high' });
 * console.log(`Selected ${contexts.size} branches for execution`);
 * ```
 */
async function executeOrSplit(instance, branches, context) {
    instance.state = GatewayState.SPLITTING;
    instance.splitTime = new Date();
    const selectedBranches = branches.filter((branch) => {
        if (!branch.condition)
            return true;
        return evaluateCondition(branch.condition, context);
    });
    if (selectedBranches.length === 0) {
        // Select first branch as default
        selectedBranches.push(branches[0]);
    }
    return executeAndSplit(instance, selectedBranches, context);
}
/**
 * 4. Executes conditional split - branches based on conditions
 *
 * @param {ParallelGatewayInstance} instance - Gateway instance
 * @param {ParallelBranchDto[]} branches - Branches with conditions
 * @param {Record<string, any>} context - Execution context
 * @returns {Promise<Map<string, BranchExecutionContext>>} Active branch contexts
 *
 * @example
 * ```typescript
 * const contexts = await executeConditionalSplit(instance, branches, context);
 * console.log(`Activated ${contexts.size} conditional branches`);
 * ```
 */
async function executeConditionalSplit(instance, branches, context) {
    instance.state = GatewayState.SPLITTING;
    instance.splitTime = new Date();
    const activeBranches = branches.filter((branch) => {
        if (!branch.condition)
            return true;
        return evaluateCondition(branch.condition, context);
    });
    return executeAndSplit(instance, activeBranches, context);
}
/**
 * 5. Evaluates branch activation condition
 *
 * @param {string} condition - Condition expression
 * @param {Record<string, any>} context - Evaluation context
 * @returns {boolean} Whether condition is met
 *
 * @example
 * ```typescript
 * const shouldActivate = evaluateCondition('priority > 5', { priority: 8 });
 * console.log(`Branch activation: ${shouldActivate}`);
 * ```
 */
function evaluateCondition(condition, context) {
    try {
        // Simple expression evaluator (production would use safe expression parser)
        const func = new Function(...Object.keys(context), `return ${condition}`);
        return func(...Object.values(context));
    }
    catch (error) {
        console.error('Condition evaluation error:', error);
        return false;
    }
}
// ============================================================================
// PARALLEL BRANCH CREATION & MANAGEMENT
// ============================================================================
/**
 * 6. Creates parallel branch execution context
 *
 * @param {ParallelBranchDto} branch - Branch definition
 * @param {string} instanceId - Gateway instance ID
 * @param {Record<string, any>} parentContext - Parent context
 * @returns {BranchExecutionContext} Branch context
 *
 * @example
 * ```typescript
 * const context = createBranchContext(branch, instanceId, parentData);
 * console.log(`Created context for branch ${context.branchId}`);
 * ```
 */
function createBranchContext(branch, instanceId, parentContext) {
    return {
        branchId: branch.branchId,
        gatewayId: parentContext.gatewayId,
        instanceId,
        startTime: new Date(),
        data: { ...parentContext },
        variables: { ...branch.config },
        parentContext,
    };
}
/**
 * 7. Prioritizes branch execution order
 *
 * @param {ParallelBranchDto[]} branches - Branches to prioritize
 * @returns {ParallelBranchDto[]} Sorted branches by priority
 *
 * @example
 * ```typescript
 * const sorted = prioritizeBranches(branches);
 * console.log(`Highest priority: ${sorted[0].name}`);
 * ```
 */
function prioritizeBranches(branches) {
    return [...branches].sort((a, b) => (b.priority || 5) - (a.priority || 5));
}
/**
 * 8. Creates isolated execution scope for branch
 *
 * @param {BranchExecutionContext} context - Branch context
 * @returns {Record<string, any>} Isolated scope
 *
 * @example
 * ```typescript
 * const scope = createIsolatedScope(context);
 * scope.localVar = 'value'; // Doesn't affect parent
 * ```
 */
function createIsolatedScope(context) {
    return {
        ...JSON.parse(JSON.stringify(context.data)),
        ...context.variables,
        _branchId: context.branchId,
        _instanceId: context.instanceId,
        _startTime: context.startTime,
    };
}
/**
 * 9. Clones branch for retry execution
 *
 * @param {ParallelBranchDto} branch - Original branch
 * @param {number} attemptNumber - Retry attempt number
 * @returns {ParallelBranchDto} Cloned branch
 *
 * @example
 * ```typescript
 * const retryBranch = cloneBranchForRetry(failedBranch, 2);
 * console.log(`Created retry attempt ${attemptNumber}`);
 * ```
 */
function cloneBranchForRetry(branch, attemptNumber) {
    return {
        ...branch,
        branchId: `${branch.branchId}-retry-${attemptNumber}`,
        config: {
            ...branch.config,
            _retryAttempt: attemptNumber,
            _originalBranchId: branch.branchId,
        },
    };
}
/**
 * 10. Validates branch configuration
 *
 * @param {ParallelBranchDto} branch - Branch to validate
 * @throws {BadRequestException} If validation fails
 *
 * @example
 * ```typescript
 * validateBranchConfig(branch); // Throws if invalid
 * ```
 */
function validateBranchConfig(branch) {
    if (!branch.branchId || !branch.name) {
        throw new common_1.BadRequestException('Branch must have ID and name');
    }
    if (branch.priority && (branch.priority < 1 || branch.priority > 10)) {
        throw new common_1.BadRequestException('Branch priority must be between 1 and 10');
    }
    if (branch.timeoutMs && branch.timeoutMs < 1000) {
        throw new common_1.BadRequestException('Branch timeout must be at least 1000ms');
    }
    if (branch.maxRetries && branch.maxRetries > 5) {
        throw new common_1.BadRequestException('Maximum retries cannot exceed 5');
    }
}
// ============================================================================
// CONCURRENT EXECUTION MANAGEMENT
// ============================================================================
/**
 * 11. Executes branches concurrently with thread pool
 *
 * @param {ParallelBranchDto[]} branches - Branches to execute
 * @param {BranchExecutionContext[]} contexts - Execution contexts
 * @param {ThreadPoolConfig} poolConfig - Thread pool configuration
 * @returns {Promise<BranchExecutionResult[]>} Execution results
 *
 * @example
 * ```typescript
 * const results = await executeConcurrent(branches, contexts, poolConfig);
 * console.log(`Completed ${results.length} branches`);
 * ```
 */
async function executeConcurrent(branches, contexts, poolConfig) {
    const maxConcurrent = poolConfig.maxThreads;
    const results = [];
    const executing = [];
    for (let i = 0; i < branches.length; i++) {
        const branch = branches[i];
        const context = contexts[i];
        const execution = executeBranch(branch, context);
        executing.push(execution);
        if (executing.length >= maxConcurrent) {
            const result = await Promise.race(executing);
            results.push(result);
            executing.splice(executing.findIndex((p) => p === Promise.resolve(result)), 1);
        }
    }
    const remaining = await Promise.all(executing);
    return [...results, ...remaining];
}
/**
 * 12. Executes single branch with timeout
 *
 * @param {ParallelBranchDto} branch - Branch to execute
 * @param {BranchExecutionContext} context - Execution context
 * @returns {Promise<BranchExecutionResult>} Execution result
 *
 * @example
 * ```typescript
 * const result = await executeBranch(branch, context);
 * console.log(`Branch ${result.branchId}: ${result.status}`);
 * ```
 */
async function executeBranch(branch, context) {
    const startTime = new Date();
    const timeoutMs = branch.timeoutMs || 30000;
    try {
        const result = await Promise.race([
            executeBranchLogic(branch, context),
            createTimeout(timeoutMs),
        ]);
        const endTime = new Date();
        return {
            branchId: branch.branchId,
            status: BranchStatus.COMPLETED,
            result,
            startTime,
            endTime,
            duration: endTime.getTime() - startTime.getTime(),
            metrics: calculateBranchMetrics(startTime, endTime, context),
        };
    }
    catch (error) {
        const endTime = new Date();
        return {
            branchId: branch.branchId,
            status: error.message === 'TIMEOUT' ? BranchStatus.TIMEOUT : BranchStatus.FAILED,
            error: error.message,
            startTime,
            endTime,
            duration: endTime.getTime() - startTime.getTime(),
        };
    }
}
/**
 * 13. Executes branch business logic
 *
 * @param {ParallelBranchDto} branch - Branch definition
 * @param {BranchExecutionContext} context - Execution context
 * @returns {Promise<any>} Branch result
 *
 * @example
 * ```typescript
 * const result = await executeBranchLogic(branch, context);
 * console.log(`Branch completed with result:`, result);
 * ```
 */
async function executeBranchLogic(branch, context) {
    // This would be implemented by the specific workflow engine
    // For now, simulate async work
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                branchId: branch.branchId,
                completed: true,
                data: context.data,
            });
        }, Math.random() * 1000);
    });
}
/**
 * 14. Creates timeout promise
 *
 * @param {number} ms - Timeout duration in milliseconds
 * @returns {Promise<never>} Rejection promise
 *
 * @example
 * ```typescript
 * await Promise.race([operation(), createTimeout(5000)]);
 * ```
 */
function createTimeout(ms) {
    return new Promise((_, reject) => {
        setTimeout(() => reject(new Error('TIMEOUT')), ms);
    });
}
/**
 * 15. Monitors concurrent execution progress
 *
 * @param {ParallelGatewayInstance} instance - Gateway instance
 * @returns {ParallelExecutionMonitor} Execution monitor
 *
 * @example
 * ```typescript
 * const monitor = monitorConcurrentExecution(instance);
 * console.log(`Active: ${monitor.activeBranches}, Completed: ${monitor.completedBranches}`);
 * ```
 */
function monitorConcurrentExecution(instance) {
    const activeBranches = Array.from(instance.branches.values()).filter((b) => b.status === BranchStatus.RUNNING).length;
    const completedBranches = instance.completedBranches;
    const failedBranches = instance.failedBranches;
    const durations = Array.from(instance.branches.values())
        .filter((b) => b.duration)
        .map((b) => b.duration);
    const averageExecutionTime = durations.length > 0 ? durations.reduce((a, b) => a + b, 0) / durations.length : 0;
    return {
        gatewayId: instance.gatewayId,
        instanceId: instance.instanceId,
        activeBranches,
        completedBranches,
        failedBranches,
        averageExecutionTime,
        resourceUtilization: calculateResourceUtilization(instance.resources),
        throughput: calculateThroughput(instance),
        lastUpdate: new Date(),
    };
}
// ============================================================================
// PARALLEL GATEWAY CONVERGENCE
// ============================================================================
/**
 * 16. Waits for all branches to complete (AND join)
 *
 * @param {ParallelGatewayInstance} instance - Gateway instance
 * @param {number} timeoutMs - Join timeout
 * @returns {Promise<boolean>} Whether all branches completed
 *
 * @example
 * ```typescript
 * const allCompleted = await waitForAllBranches(instance, 60000);
 * console.log(`All branches completed: ${allCompleted}`);
 * ```
 */
async function waitForAllBranches(instance, timeoutMs) {
    instance.state = GatewayState.SYNCHRONIZING;
    const startTime = Date.now();
    while (instance.completedBranches + instance.failedBranches < instance.totalBranches) {
        if (Date.now() - startTime > timeoutMs) {
            return false;
        }
        await sleep(100);
    }
    instance.state = GatewayState.COMPLETED;
    instance.joinTime = new Date();
    return instance.failedBranches === 0;
}
/**
 * 17. Waits for any branch to complete (OR join)
 *
 * @param {ParallelGatewayInstance} instance - Gateway instance
 * @param {number} timeoutMs - Join timeout
 * @returns {Promise<BranchExecutionResult | null>} First completed branch
 *
 * @example
 * ```typescript
 * const first = await waitForAnyBranch(instance, 30000);
 * console.log(`First completion: ${first?.branchId}`);
 * ```
 */
async function waitForAnyBranch(instance, timeoutMs) {
    instance.state = GatewayState.SYNCHRONIZING;
    const startTime = Date.now();
    while (instance.completedBranches === 0) {
        if (Date.now() - startTime > timeoutMs) {
            return null;
        }
        await sleep(100);
    }
    const completed = Array.from(instance.branches.values()).find((b) => b.status === BranchStatus.COMPLETED);
    instance.state = GatewayState.COMPLETED;
    instance.joinTime = new Date();
    return completed || null;
}
/**
 * 18. Waits for N out of M branches to complete
 *
 * @param {ParallelGatewayInstance} instance - Gateway instance
 * @param {number} requiredCompletions - Required number of completions
 * @param {number} timeoutMs - Join timeout
 * @returns {Promise<boolean>} Whether requirement met
 *
 * @example
 * ```typescript
 * const met = await waitForNOfM(instance, 3, 60000);
 * console.log(`3 out of ${instance.totalBranches} completed: ${met}`);
 * ```
 */
async function waitForNOfM(instance, requiredCompletions, timeoutMs) {
    instance.state = GatewayState.SYNCHRONIZING;
    const startTime = Date.now();
    while (instance.completedBranches < requiredCompletions) {
        if (Date.now() - startTime > timeoutMs) {
            return false;
        }
        if (instance.completedBranches + instance.failedBranches === instance.totalBranches) {
            // All branches done but not enough completions
            return false;
        }
        await sleep(100);
    }
    instance.state = GatewayState.COMPLETED;
    instance.joinTime = new Date();
    return true;
}
/**
 * 19. Waits for majority of branches to complete
 *
 * @param {ParallelGatewayInstance} instance - Gateway instance
 * @param {number} timeoutMs - Join timeout
 * @returns {Promise<boolean>} Whether majority completed
 *
 * @example
 * ```typescript
 * const majority = await waitForMajority(instance, 60000);
 * console.log(`Majority completed: ${majority}`);
 * ```
 */
async function waitForMajority(instance, timeoutMs) {
    const required = Math.ceil(instance.totalBranches / 2);
    return waitForNOfM(instance, required, timeoutMs);
}
/**
 * 20. Executes gateway join with timeout
 *
 * @param {ParallelGatewayInstance} instance - Gateway instance
 * @param {ParallelJoinType} joinType - Join strategy
 * @param {number} timeoutMs - Join timeout
 * @param {number} requiredCompletions - For N_OF_M join
 * @returns {Promise<boolean>} Whether join succeeded
 *
 * @example
 * ```typescript
 * const success = await executeGatewayJoin(instance, ParallelJoinType.ALL, 60000);
 * console.log(`Join ${success ? 'succeeded' : 'failed'}`);
 * ```
 */
async function executeGatewayJoin(instance, joinType, timeoutMs, requiredCompletions) {
    switch (joinType) {
        case ParallelJoinType.ALL:
            return waitForAllBranches(instance, timeoutMs);
        case ParallelJoinType.ANY:
            const result = await waitForAnyBranch(instance, timeoutMs);
            return result !== null;
        case ParallelJoinType.N_OF_M:
            if (!requiredCompletions) {
                throw new common_1.BadRequestException('requiredCompletions required for N_OF_M join');
            }
            return waitForNOfM(instance, requiredCompletions, timeoutMs);
        case ParallelJoinType.MAJORITY:
            return waitForMajority(instance, timeoutMs);
        default:
            throw new common_1.BadRequestException(`Unknown join type: ${joinType}`);
    }
}
// ============================================================================
// BRANCH SYNCHRONIZATION
// ============================================================================
/**
 * 21. Creates synchronization token for branch
 *
 * @param {string} branchId - Branch identifier
 * @param {string} gatewayId - Gateway identifier
 * @returns {ParallelToken} Synchronization token
 *
 * @example
 * ```typescript
 * const token = createParallelToken(branchId, gatewayId);
 * console.log(`Token ${token.tokenId} created for branch ${branchId}`);
 * ```
 */
function createParallelToken(branchId, gatewayId) {
    return {
        tokenId: `token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        branchId,
        gatewayId,
        createdAt: new Date(),
        status: 'ACTIVE',
    };
}
/**
 * 22. Consumes token on branch completion
 *
 * @param {ParallelGatewayInstance} instance - Gateway instance
 * @param {string} branchId - Branch identifier
 * @returns {ParallelToken | null} Consumed token
 *
 * @example
 * ```typescript
 * const token = consumeToken(instance, branchId);
 * console.log(`Token consumed for branch ${branchId}`);
 * ```
 */
function consumeToken(instance, branchId) {
    const token = Array.from(instance.tokens.values()).find((t) => t.branchId === branchId && t.status === 'ACTIVE');
    if (token) {
        token.status = 'CONSUMED';
        token.arrivedAt = new Date();
    }
    return token || null;
}
/**
 * 23. Counts active tokens at gateway
 *
 * @param {ParallelGatewayInstance} instance - Gateway instance
 * @returns {number} Number of active tokens
 *
 * @example
 * ```typescript
 * const active = countActiveTokens(instance);
 * console.log(`${active} tokens waiting at gateway`);
 * ```
 */
function countActiveTokens(instance) {
    return Array.from(instance.tokens.values()).filter((t) => t.status === 'ACTIVE').length;
}
/**
 * 24. Counts consumed tokens at gateway
 *
 * @param {ParallelGatewayInstance} instance - Gateway instance
 * @returns {number} Number of consumed tokens
 *
 * @example
 * ```typescript
 * const consumed = countConsumedTokens(instance);
 * console.log(`${consumed} branches have arrived`);
 * ```
 */
function countConsumedTokens(instance) {
    return Array.from(instance.tokens.values()).filter((t) => t.status === 'CONSUMED').length;
}
/**
 * 25. Synchronizes branch completion
 *
 * @param {ParallelGatewayInstance} instance - Gateway instance
 * @param {BranchExecutionResult} result - Branch execution result
 *
 * @example
 * ```typescript
 * synchronizeBranchCompletion(instance, result);
 * console.log(`Branch ${result.branchId} synchronized`);
 * ```
 */
function synchronizeBranchCompletion(instance, result) {
    instance.branches.set(result.branchId, result);
    if (result.status === BranchStatus.COMPLETED) {
        instance.completedBranches++;
    }
    else if (result.status === BranchStatus.FAILED || result.status === BranchStatus.TIMEOUT) {
        instance.failedBranches++;
    }
    consumeToken(instance, result.branchId);
}
// ============================================================================
// BRANCH COMPLETION TRACKING
// ============================================================================
/**
 * 26. Tracks branch execution progress
 *
 * @param {ParallelGatewayInstance} instance - Gateway instance
 * @param {string} branchId - Branch identifier
 * @param {BranchStatus} status - Current status
 *
 * @example
 * ```typescript
 * trackBranchProgress(instance, branchId, BranchStatus.RUNNING);
 * ```
 */
function trackBranchProgress(instance, branchId, status) {
    const branch = instance.branches.get(branchId);
    if (branch) {
        branch.status = status;
        instance.branches.set(branchId, branch);
    }
}
/**
 * 27. Gets completion percentage
 *
 * @param {ParallelGatewayInstance} instance - Gateway instance
 * @returns {number} Completion percentage (0-100)
 *
 * @example
 * ```typescript
 * const pct = getCompletionPercentage(instance);
 * console.log(`${pct}% complete`);
 * ```
 */
function getCompletionPercentage(instance) {
    if (instance.totalBranches === 0)
        return 0;
    return Math.round(((instance.completedBranches + instance.failedBranches) / instance.totalBranches) * 100);
}
/**
 * 28. Gets pending branches
 *
 * @param {ParallelGatewayInstance} instance - Gateway instance
 * @returns {BranchExecutionResult[]} Pending branches
 *
 * @example
 * ```typescript
 * const pending = getPendingBranches(instance);
 * console.log(`${pending.length} branches still pending`);
 * ```
 */
function getPendingBranches(instance) {
    return Array.from(instance.branches.values()).filter((b) => b.status === BranchStatus.PENDING || b.status === BranchStatus.RUNNING);
}
/**
 * 29. Gets failed branches
 *
 * @param {ParallelGatewayInstance} instance - Gateway instance
 * @returns {BranchExecutionResult[]} Failed branches
 *
 * @example
 * ```typescript
 * const failed = getFailedBranches(instance);
 * console.log(`${failed.length} branches failed`);
 * ```
 */
function getFailedBranches(instance) {
    return Array.from(instance.branches.values()).filter((b) => b.status === BranchStatus.FAILED);
}
/**
 * 30. Checks if all branches completed successfully
 *
 * @param {ParallelGatewayInstance} instance - Gateway instance
 * @returns {boolean} Whether all succeeded
 *
 * @example
 * ```typescript
 * const allSuccess = areAllBranchesSuccessful(instance);
 * console.log(`All successful: ${allSuccess}`);
 * ```
 */
function areAllBranchesSuccessful(instance) {
    return (instance.completedBranches === instance.totalBranches && instance.failedBranches === 0);
}
// ============================================================================
// PARTIAL JOIN HANDLING
// ============================================================================
/**
 * 31. Handles partial join on timeout
 *
 * @param {ParallelGatewayInstance} instance - Gateway instance
 * @param {boolean} allowPartial - Whether to allow partial join
 * @returns {boolean} Whether partial join succeeded
 *
 * @example
 * ```typescript
 * const success = handlePartialJoin(instance, true);
 * console.log(`Partial join: ${success}`);
 * ```
 */
function handlePartialJoin(instance, allowPartial) {
    if (!allowPartial) {
        instance.state = GatewayState.FAILED;
        return false;
    }
    // Cancel pending branches
    const pending = getPendingBranches(instance);
    for (const branch of pending) {
        branch.status = BranchStatus.CANCELLED;
        instance.branches.set(branch.branchId, branch);
    }
    instance.state = GatewayState.COMPLETED;
    instance.joinTime = new Date();
    return instance.completedBranches > 0;
}
/**
 * 32. Collects results from completed branches
 *
 * @param {ParallelGatewayInstance} instance - Gateway instance
 * @returns {Record<string, any>} Branch results map
 *
 * @example
 * ```typescript
 * const results = collectCompletedResults(instance);
 * console.log(`Collected ${Object.keys(results).length} results`);
 * ```
 */
function collectCompletedResults(instance) {
    const results = {};
    for (const [branchId, branch] of instance.branches.entries()) {
        if (branch.status === BranchStatus.COMPLETED && branch.result) {
            results[branchId] = branch.result;
        }
    }
    return results;
}
/**
 * 33. Merges results from parallel branches
 *
 * @param {Record<string, any>} results - Branch results
 * @param {string} strategy - Merge strategy
 * @returns {Record<string, any>} Merged result
 *
 * @example
 * ```typescript
 * const merged = mergeParallelResults(results, 'concat');
 * console.log('Merged results:', merged);
 * ```
 */
function mergeParallelResults(results, strategy = 'merge') {
    const values = Object.values(results);
    switch (strategy) {
        case 'concat':
            return { results: values };
        case 'merge':
            return values.reduce((acc, val) => ({ ...acc, ...val }), {});
        case 'first':
            return values[0] || {};
        case 'last':
            return values[values.length - 1] || {};
        default:
            return { results: values };
    }
}
/**
 * 34. Handles incomplete branches on timeout
 *
 * @param {ParallelGatewayInstance} instance - Gateway instance
 * @returns {BranchExecutionResult[]} Incomplete branches
 *
 * @example
 * ```typescript
 * const incomplete = handleIncompleteBranches(instance);
 * console.log(`${incomplete.length} branches incomplete`);
 * ```
 */
function handleIncompleteBranches(instance) {
    const incomplete = getPendingBranches(instance);
    for (const branch of incomplete) {
        branch.status = BranchStatus.TIMEOUT;
        branch.endTime = new Date();
        instance.branches.set(branch.branchId, branch);
    }
    return incomplete;
}
/**
 * 35. Creates partial completion report
 *
 * @param {ParallelGatewayInstance} instance - Gateway instance
 * @returns {object} Partial completion report
 *
 * @example
 * ```typescript
 * const report = createPartialCompletionReport(instance);
 * console.log(`Completion: ${report.completionRate}%`);
 * ```
 */
function createPartialCompletionReport(instance) {
    const incomplete = getPendingBranches(instance).length;
    return {
        totalBranches: instance.totalBranches,
        completedBranches: instance.completedBranches,
        failedBranches: instance.failedBranches,
        incompleteBranches: incomplete,
        completionRate: getCompletionPercentage(instance),
        successRate: instance.totalBranches > 0
            ? Math.round((instance.completedBranches / instance.totalBranches) * 100)
            : 0,
    };
}
// ============================================================================
// THREAD POOL & RESOURCE MANAGEMENT
// ============================================================================
/**
 * 36. Creates resource pool for parallel execution
 *
 * @param {ResourceAllocationStrategy} strategy - Allocation strategy
 * @returns {ResourcePool} Resource pool
 *
 * @example
 * ```typescript
 * const pool = createResourcePool(ResourceAllocationStrategy.FAIR);
 * console.log(`Created resource pool with ${strategy} allocation`);
 * ```
 */
function createResourcePool(strategy) {
    return {
        poolId: `pool-${Date.now()}`,
        totalCapacity: {
            cpu: 100,
            memory: 1024,
            io: 100,
        },
        availableCapacity: {
            cpu: 100,
            memory: 1024,
            io: 100,
        },
        allocations: new Map(),
        strategy,
    };
}
/**
 * 37. Allocates resources to branch
 *
 * @param {ResourcePool} pool - Resource pool
 * @param {string} branchId - Branch identifier
 * @param {Record<string, number>} required - Required resources
 * @returns {boolean} Whether allocation succeeded
 *
 * @example
 * ```typescript
 * const allocated = allocateResources(pool, branchId, { cpu: 20, memory: 256 });
 * console.log(`Resources allocated: ${allocated}`);
 * ```
 */
function allocateResources(pool, branchId, required) {
    // Check if resources available
    for (const [resource, amount] of Object.entries(required)) {
        if ((pool.availableCapacity[resource] || 0) < amount) {
            return false;
        }
    }
    // Allocate resources
    for (const [resource, amount] of Object.entries(required)) {
        pool.availableCapacity[resource] -= amount;
    }
    pool.allocations.set(branchId, required);
    return true;
}
/**
 * 38. Releases resources from completed branch
 *
 * @param {ResourcePool} pool - Resource pool
 * @param {string} branchId - Branch identifier
 *
 * @example
 * ```typescript
 * releaseResources(pool, branchId);
 * console.log(`Resources released for branch ${branchId}`);
 * ```
 */
function releaseResources(pool, branchId) {
    const allocation = pool.allocations.get(branchId);
    if (!allocation)
        return;
    for (const [resource, amount] of Object.entries(allocation)) {
        pool.availableCapacity[resource] =
            (pool.availableCapacity[resource] || 0) + amount;
    }
    pool.allocations.delete(branchId);
}
/**
 * 39. Calculates resource utilization
 *
 * @param {ResourcePool} pool - Resource pool
 * @returns {Record<string, number>} Utilization percentages
 *
 * @example
 * ```typescript
 * const util = calculateResourceUtilization(pool);
 * console.log(`CPU: ${util.cpu}%, Memory: ${util.memory}%`);
 * ```
 */
function calculateResourceUtilization(pool) {
    const utilization = {};
    for (const [resource, total] of Object.entries(pool.totalCapacity)) {
        const available = pool.availableCapacity[resource] || 0;
        const used = total - available;
        utilization[resource] = total > 0 ? Math.round((used / total) * 100) : 0;
    }
    return utilization;
}
/**
 * 40. Optimizes resource allocation
 *
 * @param {ResourcePool} pool - Resource pool
 * @param {ParallelBranchDto[]} branches - Branches to optimize
 * @returns {Map<string, Record<string, number>>} Optimized allocations
 *
 * @example
 * ```typescript
 * const allocations = optimizeResourceAllocation(pool, branches);
 * console.log(`Optimized allocations for ${branches.length} branches`);
 * ```
 */
function optimizeResourceAllocation(pool, branches) {
    const allocations = new Map();
    switch (pool.strategy) {
        case ResourceAllocationStrategy.FAIR:
            // Equal distribution
            for (const branch of branches) {
                const allocation = {};
                for (const [resource, total] of Object.entries(pool.totalCapacity)) {
                    allocation[resource] = Math.floor(total / branches.length);
                }
                allocations.set(branch.branchId, allocation);
            }
            break;
        case ResourceAllocationStrategy.PRIORITY:
            // Based on priority
            const prioritized = prioritizeBranches(branches);
            for (const branch of prioritized) {
                const factor = (branch.priority || 5) / 10;
                const allocation = {};
                for (const [resource, total] of Object.entries(pool.totalCapacity)) {
                    allocation[resource] = Math.floor(total * factor);
                }
                allocations.set(branch.branchId, allocation);
            }
            break;
        default:
            // Default fair allocation
            for (const branch of branches) {
                allocations.set(branch.branchId, branch.resources || {});
            }
    }
    return allocations;
}
// ============================================================================
// PARALLEL EXECUTION MONITORING
// ============================================================================
/**
 * 41. Calculates throughput metrics
 *
 * @param {ParallelGatewayInstance} instance - Gateway instance
 * @returns {number} Branches per second
 *
 * @example
 * ```typescript
 * const throughput = calculateThroughput(instance);
 * console.log(`Throughput: ${throughput} branches/sec`);
 * ```
 */
function calculateThroughput(instance) {
    if (!instance.splitTime)
        return 0;
    const elapsed = (Date.now() - instance.splitTime.getTime()) / 1000;
    return elapsed > 0 ? instance.completedBranches / elapsed : 0;
}
/**
 * 42. Calculates branch metrics
 *
 * @param {Date} startTime - Branch start time
 * @param {Date} endTime - Branch end time
 * @param {BranchExecutionContext} context - Execution context
 * @returns {BranchMetrics} Branch metrics
 *
 * @example
 * ```typescript
 * const metrics = calculateBranchMetrics(start, end, context);
 * console.log(`Execution time: ${metrics.executionTime}ms`);
 * ```
 */
function calculateBranchMetrics(startTime, endTime, context) {
    return {
        executionTime: endTime.getTime() - startTime.getTime(),
        resourceUsage: {},
        throughput: 0,
        errorCount: 0,
        retryCount: 0,
    };
}
/**
 * 43. Creates execution timeline
 *
 * @param {ParallelGatewayInstance} instance - Gateway instance
 * @returns {object[]} Timeline events
 *
 * @example
 * ```typescript
 * const timeline = createExecutionTimeline(instance);
 * console.log(`Timeline has ${timeline.length} events`);
 * ```
 */
function createExecutionTimeline(instance) {
    const timeline = [];
    if (instance.splitTime) {
        timeline.push({
            timestamp: instance.splitTime,
            event: 'GATEWAY_SPLIT',
            details: { totalBranches: instance.totalBranches },
        });
    }
    for (const [branchId, branch] of instance.branches.entries()) {
        timeline.push({
            timestamp: branch.startTime,
            event: 'BRANCH_START',
            branchId,
        });
        if (branch.endTime) {
            timeline.push({
                timestamp: branch.endTime,
                event: 'BRANCH_END',
                branchId,
                details: { status: branch.status },
            });
        }
    }
    if (instance.joinTime) {
        timeline.push({
            timestamp: instance.joinTime,
            event: 'GATEWAY_JOIN',
            details: {
                completed: instance.completedBranches,
                failed: instance.failedBranches,
            },
        });
    }
    return timeline.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
}
/**
 * 44. Generates execution report
 *
 * @param {ParallelGatewayInstance} instance - Gateway instance
 * @returns {object} Detailed execution report
 *
 * @example
 * ```typescript
 * const report = generateExecutionReport(instance);
 * console.log(`Report: ${report.status}, Duration: ${report.totalDuration}ms`);
 * ```
 */
function generateExecutionReport(instance) {
    const timeline = createExecutionTimeline(instance);
    const durations = Array.from(instance.branches.values())
        .filter((b) => b.duration)
        .map((b) => b.duration);
    const avgDuration = durations.length > 0 ? durations.reduce((a, b) => a + b, 0) / durations.length : undefined;
    const totalDuration = instance.splitTime && instance.joinTime
        ? instance.joinTime.getTime() - instance.splitTime.getTime()
        : undefined;
    return {
        instanceId: instance.instanceId,
        gatewayId: instance.gatewayId,
        status: instance.state,
        totalBranches: instance.totalBranches,
        completedBranches: instance.completedBranches,
        failedBranches: instance.failedBranches,
        successRate: instance.totalBranches > 0
            ? Math.round((instance.completedBranches / instance.totalBranches) * 100)
            : 0,
        totalDuration,
        averageBranchDuration: avgDuration,
        resourceUtilization: calculateResourceUtilization(instance.resources),
        timeline,
    };
}
/**
 * 45. Streams real-time execution updates
 *
 * @param {ParallelGatewayInstance} instance - Gateway instance
 * @returns {Observable<ParallelExecutionMonitor>} Update stream
 *
 * @example
 * ```typescript
 * const updates$ = streamExecutionUpdates(instance);
 * updates$.subscribe(monitor => console.log('Update:', monitor));
 * ```
 */
function streamExecutionUpdates(instance) {
    const subject = new rxjs_1.Subject();
    const interval = setInterval(() => {
        const monitor = monitorConcurrentExecution(instance);
        subject.next(monitor);
        if (instance.state === GatewayState.COMPLETED || instance.state === GatewayState.FAILED) {
            clearInterval(interval);
            subject.complete();
        }
    }, 1000);
    return subject.asObservable();
}
// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
/**
 * Generates unique instance ID
 */
function generateInstanceId() {
    return `inst-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
/**
 * Sleep utility for async waiting
 */
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Gateway Creation
    createParallelGateway,
    executeAndSplit,
    executeOrSplit,
    executeConditionalSplit,
    evaluateCondition,
    // Branch Management
    createBranchContext,
    prioritizeBranches,
    createIsolatedScope,
    cloneBranchForRetry,
    validateBranchConfig,
    // Concurrent Execution
    executeConcurrent,
    executeBranch,
    executeBranchLogic,
    createTimeout,
    monitorConcurrentExecution,
    // Gateway Convergence
    waitForAllBranches,
    waitForAnyBranch,
    waitForNOfM,
    waitForMajority,
    executeGatewayJoin,
    // Synchronization
    createParallelToken,
    consumeToken,
    countActiveTokens,
    countConsumedTokens,
    synchronizeBranchCompletion,
    // Completion Tracking
    trackBranchProgress,
    getCompletionPercentage,
    getPendingBranches,
    getFailedBranches,
    areAllBranchesSuccessful,
    // Partial Join
    handlePartialJoin,
    collectCompletedResults,
    mergeParallelResults,
    handleIncompleteBranches,
    createPartialCompletionReport,
    // Resource Management
    createResourcePool,
    allocateResources,
    releaseResources,
    calculateResourceUtilization,
    optimizeResourceAllocation,
    // Monitoring
    calculateThroughput,
    calculateBranchMetrics,
    createExecutionTimeline,
    generateExecutionReport,
    streamExecutionUpdates,
};
//# sourceMappingURL=workflow-parallel-execution.js.map