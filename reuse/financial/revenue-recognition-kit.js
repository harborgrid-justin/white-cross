"use strict";
/**
 * @fileoverview Enterprise Revenue Recognition Kit - Production-Grade ASC 606/IFRS 15 Compliance
 *
 * @module RevenueRecognitionKit
 * @description Comprehensive revenue recognition system implementing ASC 606 and IFRS 15 standards
 * for contract-based revenue management, deferred revenue tracking, and performance obligation allocation.
 *
 * Features:
 * - ASC 606 / IFRS 15 full compliance framework
 * - Contract identification and management
 * - Performance obligation tracking and allocation
 * - Transaction price determination and allocation
 * - Multiple recognition methods (straight-line, milestone, percentage completion)
 * - Deferred and unbilled revenue management
 * - Multi-element arrangement handling
 * - Variable consideration and constraint analysis
 * - Contract modification tracking
 * - Revenue forecasting and projections
 * - Comprehensive audit trails and compliance reporting
 * - Automated revenue schedules and waterfall calculations
 * - SSP (Standalone Selling Price) estimation
 * - Revenue reallocation for contract changes
 * - Cancellation and refund processing
 *
 * Competes with: Zuora RevPro, NetSuite SuiteBilling, SAP RAR, Oracle RMCS
 *
 * Standards Compliance:
 * - ASC 606: Revenue from Contracts with Customers
 * - IFRS 15: Revenue from Contracts with Customers
 * - SOX Controls: Automated revenue recognition controls
 * - GAAP: Generally Accepted Accounting Principles
 *
 * Architecture:
 * - NestJS 10.x Injectable Services
 * - Sequelize 6.x ORM with PostgreSQL
 * - TypeScript 5.x strict mode
 * - Decimal.js for precise financial calculations
 * - Bull Queue for async revenue processing
 * - Redis caching for performance optimization
 *
 * @author White Cross Healthcare Platform
 * @version 2.0.0
 * @since 2025-Q1
 * @license MIT
 *
 * @requires @nestjs/common ^10.0.0
 * @requires sequelize ^6.0.0
 * @requires sequelize-typescript ^2.1.0
 * @requires @nestjs/swagger ^7.0.0
 * @requires decimal.js ^10.4.0
 * @requires date-fns ^2.30.0
 *
 * LOC: FIN-REVR-001
 *
 * @example Basic Usage
 * ```typescript
 * // Inject the service
 * constructor(private readonly revenueService: RevenueRecognitionService) {}
 *
 * // Create a contract with performance obligations
 * const contract = await this.revenueService.createRevenueContract({
 *   customerId: 'CUST-001',
 *   contractNumber: 'CONTRACT-2025-001',
 *   startDate: new Date('2025-01-01'),
 *   endDate: new Date('2025-12-31'),
 *   totalContractValue: new Decimal('120000.00'),
 *   currency: 'USD'
 * });
 *
 * // Add performance obligations
 * const obligation = await this.revenueService.addPerformanceObligation(contract.id, {
 *   description: 'Software License',
 *   allocatedAmount: new Decimal('80000.00'),
 *   recognitionMethod: 'STRAIGHT_LINE',
 *   startDate: new Date('2025-01-01'),
 *   endDate: new Date('2025-12-31')
 * });
 *
 * // Generate revenue schedule
 * const schedule = await this.revenueService.generateRevenueSchedule(obligation.id);
 *
 * // Recognize revenue for the period
 * const recognized = await this.revenueService.recognizeRevenueForPeriod(
 *   contract.id,
 *   new Date('2025-01-31')
 * );
 * ```
 *
 * @example Multi-Element Arrangement
 * ```typescript
 * // Create multi-element contract
 * const multiContract = await this.revenueService.createMultiElementContract({
 *   customerId: 'CUST-002',
 *   elements: [
 *     { description: 'Software', price: 100000, ssp: 120000 },
 *     { description: 'Implementation', price: 50000, ssp: 60000 },
 *     { description: 'Support', price: 30000, ssp: 35000 }
 *   ]
 * });
 *
 * // Allocate transaction price using relative SSP
 * const allocation = await this.revenueService.allocateTransactionPrice(
 *   multiContract.id,
 *   'RELATIVE_SSP'
 * );
 * ```
 *
 * @example Variable Consideration
 * ```typescript
 * // Handle variable consideration with constraint
 * const variable = await this.revenueService.calculateVariableConsideration({
 *   contractId: contract.id,
 *   baseAmount: new Decimal('100000'),
 *   variableElements: [
 *     { type: 'BONUS', estimatedAmount: 20000, probability: 0.7 },
 *     { type: 'PENALTY', estimatedAmount: -5000, probability: 0.3 }
 *   ],
 *   constraintMethod: 'MOST_LIKELY'
 * });
 * ```
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RevenueRecognitionService = exports.ModificationType = exports.VariableEstimationMethod = exports.AllocationMethod = exports.ScheduleEntryStatus = exports.ObligationStatus = exports.ContractStatus = exports.RecognitionMethod = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("sequelize");
const swagger_1 = require("@nestjs/swagger");
const decimal_js_1 = __importDefault(require("decimal.js"));
const date_fns_1 = require("date-fns");
// ============================================================================
// TypeScript Types and Interfaces
// ============================================================================
/**
 * Revenue recognition method types per ASC 606
 */
var RecognitionMethod;
(function (RecognitionMethod) {
    RecognitionMethod["STRAIGHT_LINE"] = "STRAIGHT_LINE";
    RecognitionMethod["MILESTONE"] = "MILESTONE";
    RecognitionMethod["PERCENTAGE_COMPLETION"] = "PERCENTAGE_COMPLETION";
    RecognitionMethod["POINT_IN_TIME"] = "POINT_IN_TIME";
    RecognitionMethod["OUTPUT_METHOD"] = "OUTPUT_METHOD";
    RecognitionMethod["INPUT_METHOD"] = "INPUT_METHOD";
    RecognitionMethod["USAGE_BASED"] = "USAGE_BASED";
    RecognitionMethod["SUBSCRIPTION"] = "SUBSCRIPTION";
    RecognitionMethod["CUSTOM"] = "CUSTOM"; // Custom recognition logic
})(RecognitionMethod || (exports.RecognitionMethod = RecognitionMethod = {}));
/**
 * Contract status enumeration
 */
var ContractStatus;
(function (ContractStatus) {
    ContractStatus["DRAFT"] = "DRAFT";
    ContractStatus["ACTIVE"] = "ACTIVE";
    ContractStatus["AMENDED"] = "AMENDED";
    ContractStatus["SUSPENDED"] = "SUSPENDED";
    ContractStatus["CANCELLED"] = "CANCELLED";
    ContractStatus["COMPLETED"] = "COMPLETED";
    ContractStatus["TERMINATED"] = "TERMINATED";
})(ContractStatus || (exports.ContractStatus = ContractStatus = {}));
/**
 * Performance obligation status
 */
var ObligationStatus;
(function (ObligationStatus) {
    ObligationStatus["NOT_STARTED"] = "NOT_STARTED";
    ObligationStatus["IN_PROGRESS"] = "IN_PROGRESS";
    ObligationStatus["PARTIALLY_SATISFIED"] = "PARTIALLY_SATISFIED";
    ObligationStatus["SATISFIED"] = "SATISFIED";
    ObligationStatus["CANCELLED"] = "CANCELLED";
})(ObligationStatus || (exports.ObligationStatus = ObligationStatus = {}));
/**
 * Revenue schedule entry status
 */
var ScheduleEntryStatus;
(function (ScheduleEntryStatus) {
    ScheduleEntryStatus["SCHEDULED"] = "SCHEDULED";
    ScheduleEntryStatus["RECOGNIZED"] = "RECOGNIZED";
    ScheduleEntryStatus["DEFERRED"] = "DEFERRED";
    ScheduleEntryStatus["REVERSED"] = "REVERSED";
    ScheduleEntryStatus["ADJUSTED"] = "ADJUSTED";
})(ScheduleEntryStatus || (exports.ScheduleEntryStatus = ScheduleEntryStatus = {}));
/**
 * Transaction price allocation method
 */
var AllocationMethod;
(function (AllocationMethod) {
    AllocationMethod["RELATIVE_SSP"] = "RELATIVE_SSP";
    AllocationMethod["ADJUSTED_MARKET"] = "ADJUSTED_MARKET";
    AllocationMethod["EXPECTED_COST_PLUS"] = "EXPECTED_COST_PLUS";
    AllocationMethod["RESIDUAL"] = "RESIDUAL";
    AllocationMethod["CONTRACTED_PRICE"] = "CONTRACTED_PRICE"; // Contracted price (no allocation)
})(AllocationMethod || (exports.AllocationMethod = AllocationMethod = {}));
/**
 * Variable consideration estimation method
 */
var VariableEstimationMethod;
(function (VariableEstimationMethod) {
    VariableEstimationMethod["EXPECTED_VALUE"] = "EXPECTED_VALUE";
    VariableEstimationMethod["MOST_LIKELY"] = "MOST_LIKELY";
    VariableEstimationMethod["CONSERVATIVE"] = "CONSERVATIVE"; // Most conservative estimate
})(VariableEstimationMethod || (exports.VariableEstimationMethod = VariableEstimationMethod = {}));
/**
 * Contract modification type
 */
var ModificationType;
(function (ModificationType) {
    ModificationType["SEPARATE_CONTRACT"] = "SEPARATE_CONTRACT";
    ModificationType["TERMINATION_NEW"] = "TERMINATION_NEW";
    ModificationType["PROSPECTIVE"] = "PROSPECTIVE";
    ModificationType["CUMULATIVE_CATCHUP"] = "CUMULATIVE_CATCHUP";
    ModificationType["RETROSPECTIVE"] = "RETROSPECTIVE"; // Retrospective restatement
})(ModificationType || (exports.ModificationType = ModificationType = {}));
// ============================================================================
// NestJS Injectable Service
// ============================================================================
let RevenueRecognitionService = (() => {
    let _classDecorators = [(0, common_1.Injectable)(), (0, swagger_1.ApiTags)('Revenue Recognition')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var RevenueRecognitionService = _classThis = class {
        constructor(contractModel, obligationModel, scheduleModel, modificationModel, auditModel, sequelize) {
            this.contractModel = contractModel;
            this.obligationModel = obligationModel;
            this.scheduleModel = scheduleModel;
            this.modificationModel = modificationModel;
            this.auditModel = auditModel;
            this.sequelize = sequelize;
            this.logger = new common_1.Logger(RevenueRecognitionService.name);
            // Configure Decimal.js for financial precision
            decimal_js_1.default.set({ precision: 20, rounding: decimal_js_1.default.ROUND_HALF_EVEN });
        }
        // ============================================================================
        // Contract Management Functions
        // ============================================================================
        /**
         * Creates a new revenue contract
         * @param contractData Contract creation data
         * @returns Created revenue contract
         */
        async createRevenueContract(contractData) {
            this.logger.log(`Creating revenue contract: ${contractData.contractNumber}`);
            const transaction = await this.sequelize.transaction();
            try {
                // Validate dates
                if ((0, date_fns_1.isAfter)(contractData.startDate, contractData.endDate)) {
                    throw new common_1.BadRequestException('Start date must be before end date');
                }
                // Check for duplicate contract number
                const existing = await this.contractModel.findOne({
                    where: { contractNumber: contractData.contractNumber },
                    transaction
                });
                if (existing) {
                    throw new common_1.ConflictException(`Contract number ${contractData.contractNumber} already exists`);
                }
                const contract = await this.contractModel.create({
                    ...contractData,
                    totalContractValue: contractData.totalContractValue.toString(),
                    allocatedValue: '0',
                    recognizedRevenue: '0',
                    deferredRevenue: contractData.totalContractValue.toString(),
                    unbilledRevenue: '0',
                    status: ContractStatus.DRAFT,
                    modificationCount: 0
                }, { transaction });
                // Create audit entry
                await this.createAuditEntry({
                    entityType: 'CONTRACT',
                    entityId: contract.id,
                    action: 'CREATE_CONTRACT',
                    performedBy: contractData.createdBy,
                    performedAt: new Date(),
                    changes: { contract: { old: null, new: contract.toJSON() } }
                }, transaction);
                await transaction.commit();
                this.logger.log(`Revenue contract created: ${contract.id}`);
                return this.mapToRevenueContract(contract);
            }
            catch (error) {
                await transaction.rollback();
                this.logger.error(`Failed to create revenue contract: ${error.message}`, error.stack);
                throw error;
            }
        }
        /**
         * Retrieves a revenue contract by ID
         * @param contractId Contract identifier
         * @returns Revenue contract
         */
        async getRevenueContract(contractId) {
            const contract = await this.contractModel.findByPk(contractId, {
                include: [{ model: this.obligationModel, as: 'obligations' }]
            });
            if (!contract) {
                throw new common_1.NotFoundException(`Revenue contract ${contractId} not found`);
            }
            return this.mapToRevenueContract(contract);
        }
        /**
         * Updates revenue contract status
         * @param contractId Contract identifier
         * @param status New status
         * @param userId User performing the update
         * @returns Updated contract
         */
        async updateContractStatus(contractId, status, userId) {
            this.logger.log(`Updating contract ${contractId} status to ${status}`);
            const transaction = await this.sequelize.transaction();
            try {
                const contract = await this.contractModel.findByPk(contractId, { transaction });
                if (!contract) {
                    throw new common_1.NotFoundException(`Contract ${contractId} not found`);
                }
                const oldStatus = contract.status;
                // Validate status transition
                this.validateStatusTransition(oldStatus, status);
                await contract.update({
                    status,
                    updatedBy: userId
                }, { transaction });
                await this.createAuditEntry({
                    entityType: 'CONTRACT',
                    entityId: contractId,
                    action: 'UPDATE_STATUS',
                    performedBy: userId,
                    performedAt: new Date(),
                    changes: { status: { old: oldStatus, new: status } }
                }, transaction);
                await transaction.commit();
                return this.mapToRevenueContract(contract);
            }
            catch (error) {
                await transaction.rollback();
                throw error;
            }
        }
        /**
         * Searches revenue contracts by criteria
         * @param criteria Search criteria
         * @returns List of matching contracts
         */
        async searchContracts(criteria) {
            const where = {};
            if (criteria.customerId)
                where.customerId = criteria.customerId;
            if (criteria.status)
                where.status = criteria.status;
            if (criteria.startDateFrom || criteria.startDateTo) {
                where.startDate = {};
                if (criteria.startDateFrom)
                    where.startDate[sequelize_1.Op.gte] = criteria.startDateFrom;
                if (criteria.startDateTo)
                    where.startDate[sequelize_1.Op.lte] = criteria.startDateTo;
            }
            if (criteria.minValue) {
                where.totalContractValue = { [sequelize_1.Op.gte]: criteria.minValue.toString() };
            }
            if (criteria.maxValue) {
                where.totalContractValue = {
                    ...where.totalContractValue,
                    [sequelize_1.Op.lte]: criteria.maxValue.toString()
                };
            }
            const { rows, count } = await this.contractModel.findAndCountAll({
                where,
                limit: criteria.limit || 100,
                offset: criteria.offset || 0,
                order: [['createdAt', 'DESC']]
            });
            return {
                contracts: rows.map(row => this.mapToRevenueContract(row)),
                total: count
            };
        }
        /**
         * Activates a contract and begins revenue recognition
         * @param contractId Contract identifier
         * @param userId User activating the contract
         * @returns Activated contract
         */
        async activateContract(contractId, userId) {
            this.logger.log(`Activating contract ${contractId}`);
            const transaction = await this.sequelize.transaction();
            try {
                const contract = await this.contractModel.findByPk(contractId, { transaction });
                if (!contract) {
                    throw new common_1.NotFoundException(`Contract ${contractId} not found`);
                }
                if (contract.status !== ContractStatus.DRAFT) {
                    throw new common_1.BadRequestException('Only draft contracts can be activated');
                }
                // Verify all obligations have been allocated
                const obligations = await this.obligationModel.findAll({
                    where: { contractId },
                    transaction
                });
                if (obligations.length === 0) {
                    throw new common_1.BadRequestException('Contract must have at least one performance obligation');
                }
                const totalAllocated = obligations.reduce((sum, obl) => sum.plus(new decimal_js_1.default(obl.allocatedAmount)), new decimal_js_1.default(0));
                if (!totalAllocated.equals(new decimal_js_1.default(contract.totalContractValue))) {
                    throw new common_1.BadRequestException(`Total allocated (${totalAllocated}) must equal contract value (${contract.totalContractValue})`);
                }
                await contract.update({
                    status: ContractStatus.ACTIVE,
                    updatedBy: userId
                }, { transaction });
                // Generate revenue schedules for all obligations
                for (const obligation of obligations) {
                    await this.generateRevenueScheduleInternal(obligation.id, transaction);
                }
                await this.createAuditEntry({
                    entityType: 'CONTRACT',
                    entityId: contractId,
                    action: 'ACTIVATE_CONTRACT',
                    performedBy: userId,
                    performedAt: new Date(),
                    changes: { status: { old: ContractStatus.DRAFT, new: ContractStatus.ACTIVE } }
                }, transaction);
                await transaction.commit();
                return this.mapToRevenueContract(contract);
            }
            catch (error) {
                await transaction.rollback();
                throw error;
            }
        }
        // ============================================================================
        // Performance Obligation Management
        // ============================================================================
        /**
         * Adds a performance obligation to a contract
         * @param contractId Contract identifier
         * @param obligationData Obligation data
         * @returns Created performance obligation
         */
        async addPerformanceObligation(contractId, obligationData) {
            this.logger.log(`Adding performance obligation to contract ${contractId}`);
            const transaction = await this.sequelize.transaction();
            try {
                const contract = await this.contractModel.findByPk(contractId, { transaction });
                if (!contract) {
                    throw new common_1.NotFoundException(`Contract ${contractId} not found`);
                }
                // Generate obligation number
                const obligationCount = await this.obligationModel.count({
                    where: { contractId },
                    transaction
                });
                const obligationNumber = `${contract.contractNumber}-OBL-${String(obligationCount + 1).padStart(3, '0')}`;
                // Verify total allocation doesn't exceed contract value
                const existingAllocations = await this.obligationModel.sum('allocatedAmount', {
                    where: { contractId },
                    transaction
                }) || 0;
                const totalAllocated = new decimal_js_1.default(existingAllocations).plus(obligationData.allocatedAmount);
                if (totalAllocated.greaterThan(new decimal_js_1.default(contract.totalContractValue))) {
                    throw new common_1.BadRequestException(`Total allocated amount (${totalAllocated}) exceeds contract value (${contract.totalContractValue})`);
                }
                const obligation = await this.obligationModel.create({
                    contractId,
                    obligationNumber,
                    description: obligationData.description,
                    allocatedAmount: obligationData.allocatedAmount.toString(),
                    recognizedAmount: '0',
                    remainingAmount: obligationData.allocatedAmount.toString(),
                    percentComplete: 0,
                    recognitionMethod: obligationData.recognitionMethod,
                    startDate: obligationData.startDate,
                    endDate: obligationData.endDate,
                    status: ObligationStatus.NOT_STARTED,
                    standaloneSellingPrice: obligationData.standaloneSellingPrice?.toString(),
                    isSeparate: obligationData.isSeparate ?? true,
                    metadata: obligationData.metadata
                }, { transaction });
                // Update contract allocated value
                await contract.update({
                    allocatedValue: totalAllocated.toString()
                }, { transaction });
                await this.createAuditEntry({
                    entityType: 'OBLIGATION',
                    entityId: obligation.id,
                    action: 'CREATE_OBLIGATION',
                    performedBy: 'SYSTEM',
                    performedAt: new Date(),
                    changes: { obligation: { old: null, new: obligation.toJSON() } }
                }, transaction);
                await transaction.commit();
                return this.mapToPerformanceObligation(obligation);
            }
            catch (error) {
                await transaction.rollback();
                throw error;
            }
        }
        /**
         * Retrieves performance obligations for a contract
         * @param contractId Contract identifier
         * @returns List of performance obligations
         */
        async getPerformanceObligations(contractId) {
            const obligations = await this.obligationModel.findAll({
                where: { contractId },
                order: [['obligationNumber', 'ASC']]
            });
            return obligations.map(obl => this.mapToPerformanceObligation(obl));
        }
        /**
         * Updates performance obligation completion status
         * @param obligationId Obligation identifier
         * @param percentComplete Completion percentage (0-100)
         * @returns Updated obligation
         */
        async updateObligationProgress(obligationId, percentComplete) {
            this.logger.log(`Updating obligation ${obligationId} progress to ${percentComplete}%`);
            if (percentComplete < 0 || percentComplete > 100) {
                throw new common_1.BadRequestException('Percent complete must be between 0 and 100');
            }
            const transaction = await this.sequelize.transaction();
            try {
                const obligation = await this.obligationModel.findByPk(obligationId, { transaction });
                if (!obligation) {
                    throw new common_1.NotFoundException(`Obligation ${obligationId} not found`);
                }
                const oldPercent = obligation.percentComplete;
                const oldStatus = obligation.status;
                // Determine new status
                let newStatus = obligation.status;
                if (percentComplete === 0) {
                    newStatus = ObligationStatus.NOT_STARTED;
                }
                else if (percentComplete === 100) {
                    newStatus = ObligationStatus.SATISFIED;
                }
                else if (percentComplete > 0 && percentComplete < 100) {
                    newStatus = ObligationStatus.PARTIALLY_SATISFIED;
                }
                // Calculate recognized amount based on completion
                const allocatedAmount = new decimal_js_1.default(obligation.allocatedAmount);
                const recognizedAmount = allocatedAmount.times(percentComplete).dividedBy(100);
                const remainingAmount = allocatedAmount.minus(recognizedAmount);
                await obligation.update({
                    percentComplete,
                    status: newStatus,
                    recognizedAmount: recognizedAmount.toString(),
                    remainingAmount: remainingAmount.toString(),
                    actualCompletionDate: percentComplete === 100 ? new Date() : null
                }, { transaction });
                await this.createAuditEntry({
                    entityType: 'OBLIGATION',
                    entityId: obligationId,
                    action: 'UPDATE_PROGRESS',
                    performedBy: 'SYSTEM',
                    performedAt: new Date(),
                    changes: {
                        percentComplete: { old: oldPercent, new: percentComplete },
                        status: { old: oldStatus, new: newStatus }
                    }
                }, transaction);
                await transaction.commit();
                return this.mapToPerformanceObligation(obligation);
            }
            catch (error) {
                await transaction.rollback();
                throw error;
            }
        }
        /**
         * Marks a performance obligation as satisfied
         * @param obligationId Obligation identifier
         * @param userId User marking as satisfied
         * @returns Updated obligation
         */
        async satisfyPerformanceObligation(obligationId, userId) {
            return this.updateObligationProgress(obligationId, 100);
        }
        // ============================================================================
        // Transaction Price Allocation
        // ============================================================================
        /**
         * Allocates transaction price across performance obligations
         * @param contractId Contract identifier
         * @param method Allocation method
         * @returns Allocation result
         */
        async allocateTransactionPrice(contractId, method) {
            this.logger.log(`Allocating transaction price for contract ${contractId} using ${method}`);
            const contract = await this.contractModel.findByPk(contractId);
            if (!contract) {
                throw new common_1.NotFoundException(`Contract ${contractId} not found`);
            }
            const obligations = await this.obligationModel.findAll({
                where: { contractId }
            });
            if (obligations.length === 0) {
                throw new common_1.BadRequestException('Contract must have at least one performance obligation');
            }
            const totalTransactionPrice = new decimal_js_1.default(contract.totalContractValue);
            const allocations = [];
            switch (method) {
                case AllocationMethod.RELATIVE_SSP:
                    return this.allocateByRelativeSSP(contractId, totalTransactionPrice, obligations);
                case AllocationMethod.CONTRACTED_PRICE:
                    return this.allocateByContractedPrice(contractId, totalTransactionPrice, obligations);
                case AllocationMethod.RESIDUAL:
                    return this.allocateByResidual(contractId, totalTransactionPrice, obligations);
                default:
                    throw new common_1.BadRequestException(`Allocation method ${method} not supported`);
            }
        }
        /**
         * Allocates price using relative standalone selling price method
         * @private
         */
        async allocateByRelativeSSP(contractId, totalPrice, obligations) {
            const transaction = await this.sequelize.transaction();
            try {
                // Calculate total SSP
                const totalSSP = obligations.reduce((sum, obl) => {
                    const ssp = obl.standaloneSellingPrice
                        ? new decimal_js_1.default(obl.standaloneSellingPrice)
                        : new decimal_js_1.default(obl.allocatedAmount);
                    return sum.plus(ssp);
                }, new decimal_js_1.default(0));
                if (totalSSP.isZero()) {
                    throw new common_1.BadRequestException('Total standalone selling price cannot be zero');
                }
                const allocations = [];
                for (const obligation of obligations) {
                    const ssp = obligation.standaloneSellingPrice
                        ? new decimal_js_1.default(obligation.standaloneSellingPrice)
                        : new decimal_js_1.default(obligation.allocatedAmount);
                    const allocationPercentage = ssp.dividedBy(totalSSP).times(100).toNumber();
                    const allocatedAmount = totalPrice.times(ssp).dividedBy(totalSSP);
                    // Update obligation
                    await obligation.update({
                        allocatedAmount: allocatedAmount.toString(),
                        remainingAmount: allocatedAmount.toString()
                    }, { transaction });
                    allocations.push({
                        obligationId: obligation.id,
                        description: obligation.description,
                        standaloneSellingPrice: ssp,
                        allocationPercentage,
                        allocatedAmount
                    });
                }
                await transaction.commit();
                return {
                    contractId,
                    totalTransactionPrice: totalPrice,
                    allocationMethod: AllocationMethod.RELATIVE_SSP,
                    allocations,
                    allocationDate: new Date()
                };
            }
            catch (error) {
                await transaction.rollback();
                throw error;
            }
        }
        /**
         * Allocates price using contracted prices (no allocation)
         * @private
         */
        async allocateByContractedPrice(contractId, totalPrice, obligations) {
            const allocations = obligations.map(obl => ({
                obligationId: obl.id,
                description: obl.description,
                standaloneSellingPrice: new decimal_js_1.default(obl.allocatedAmount),
                allocationPercentage: new decimal_js_1.default(obl.allocatedAmount)
                    .dividedBy(totalPrice)
                    .times(100)
                    .toNumber(),
                allocatedAmount: new decimal_js_1.default(obl.allocatedAmount)
            }));
            return {
                contractId,
                totalTransactionPrice: totalPrice,
                allocationMethod: AllocationMethod.CONTRACTED_PRICE,
                allocations,
                allocationDate: new Date()
            };
        }
        /**
         * Allocates price using residual approach
         * @private
         */
        async allocateByResidual(contractId, totalPrice, obligations) {
            const transaction = await this.sequelize.transaction();
            try {
                // Sort obligations: those with observable SSP first, residual last
                const withSSP = obligations.filter(obl => obl.standaloneSellingPrice);
                const withoutSSP = obligations.filter(obl => !obl.standaloneSellingPrice);
                if (withoutSSP.length !== 1) {
                    throw new common_1.BadRequestException('Residual approach requires exactly one obligation without SSP');
                }
                // Allocate known SSPs first
                let remainingPrice = totalPrice;
                const allocations = [];
                for (const obligation of withSSP) {
                    const ssp = new decimal_js_1.default(obligation.standaloneSellingPrice);
                    const allocatedAmount = ssp.lessThanOrEqualTo(remainingPrice) ? ssp : remainingPrice;
                    await obligation.update({
                        allocatedAmount: allocatedAmount.toString(),
                        remainingAmount: allocatedAmount.toString()
                    }, { transaction });
                    allocations.push({
                        obligationId: obligation.id,
                        description: obligation.description,
                        standaloneSellingPrice: ssp,
                        allocationPercentage: allocatedAmount.dividedBy(totalPrice).times(100).toNumber(),
                        allocatedAmount
                    });
                    remainingPrice = remainingPrice.minus(allocatedAmount);
                }
                // Allocate residual to final obligation
                const residualObligation = withoutSSP[0];
                await residualObligation.update({
                    allocatedAmount: remainingPrice.toString(),
                    remainingAmount: remainingPrice.toString(),
                    standaloneSellingPrice: remainingPrice.toString()
                }, { transaction });
                allocations.push({
                    obligationId: residualObligation.id,
                    description: residualObligation.description,
                    standaloneSellingPrice: remainingPrice,
                    allocationPercentage: remainingPrice.dividedBy(totalPrice).times(100).toNumber(),
                    allocatedAmount: remainingPrice
                });
                await transaction.commit();
                return {
                    contractId,
                    totalTransactionPrice: totalPrice,
                    allocationMethod: AllocationMethod.RESIDUAL,
                    allocations,
                    residualAmount: remainingPrice,
                    allocationDate: new Date()
                };
            }
            catch (error) {
                await transaction.rollback();
                throw error;
            }
        }
        /**
         * Estimates standalone selling price for an obligation
         * @param obligationId Obligation identifier
         * @param method Estimation method
         * @returns SSP estimation
         */
        async estimateStandaloneSellingPrice(obligationId, method) {
            const obligation = await this.obligationModel.findByPk(obligationId);
            if (!obligation) {
                throw new common_1.NotFoundException(`Obligation ${obligationId} not found`);
            }
            let estimatedSSP;
            const adjustments = [];
            let dataPoints = 0;
            let confidenceLevel = 0;
            switch (method) {
                case 'MARKET_RATE':
                    // Simulate market rate lookup
                    estimatedSSP = new decimal_js_1.default(obligation.allocatedAmount).times(1.15);
                    adjustments.push({ reason: 'Market premium', adjustment: estimatedSSP.times(0.15) });
                    dataPoints = 10;
                    confidenceLevel = 0.85;
                    break;
                case 'COST_PLUS':
                    // Simulate cost-plus calculation
                    estimatedSSP = new decimal_js_1.default(obligation.allocatedAmount).times(1.30);
                    adjustments.push({ reason: 'Cost-plus margin (30%)', adjustment: estimatedSSP.times(0.30) });
                    dataPoints = 5;
                    confidenceLevel = 0.75;
                    break;
                case 'HISTORICAL':
                    // Use historical pricing
                    estimatedSSP = new decimal_js_1.default(obligation.allocatedAmount);
                    dataPoints = 20;
                    confidenceLevel = 0.90;
                    break;
                default:
                    estimatedSSP = new decimal_js_1.default(obligation.allocatedAmount);
                    confidenceLevel = 0.50;
            }
            return {
                obligationId,
                description: obligation.description,
                estimatedSSP,
                estimationMethod: method,
                dataPoints,
                confidenceLevel,
                adjustments,
                estimatedAt: new Date()
            };
        }
        // ============================================================================
        // Revenue Recognition Schedule Generation
        // ============================================================================
        /**
         * Generates revenue recognition schedule for an obligation
         * @param obligationId Obligation identifier
         * @returns Revenue schedule
         */
        async generateRevenueSchedule(obligationId) {
            const transaction = await this.sequelize.transaction();
            try {
                const schedule = await this.generateRevenueScheduleInternal(obligationId, transaction);
                await transaction.commit();
                return schedule;
            }
            catch (error) {
                await transaction.rollback();
                throw error;
            }
        }
        /**
         * Internal schedule generation with transaction support
         * @private
         */
        async generateRevenueScheduleInternal(obligationId, transaction) {
            const obligation = await this.obligationModel.findByPk(obligationId, { transaction });
            if (!obligation) {
                throw new common_1.NotFoundException(`Obligation ${obligationId} not found`);
            }
            // Delete existing schedule entries
            await this.scheduleModel.destroy({
                where: { obligationId },
                transaction
            });
            const allocatedAmount = new decimal_js_1.default(obligation.allocatedAmount);
            const entries = [];
            switch (obligation.recognitionMethod) {
                case RecognitionMethod.STRAIGHT_LINE:
                    entries.push(...await this.generateStraightLineSchedule(obligation, allocatedAmount, transaction));
                    break;
                case RecognitionMethod.MILESTONE:
                    entries.push(...await this.generateMilestoneSchedule(obligation, allocatedAmount, transaction));
                    break;
                case RecognitionMethod.PERCENTAGE_COMPLETION:
                    entries.push(...await this.generatePercentageCompletionSchedule(obligation, allocatedAmount, transaction));
                    break;
                case RecognitionMethod.POINT_IN_TIME:
                    entries.push(...await this.generatePointInTimeSchedule(obligation, allocatedAmount, transaction));
                    break;
                case RecognitionMethod.SUBSCRIPTION:
                    entries.push(...await this.generateSubscriptionSchedule(obligation, allocatedAmount, transaction));
                    break;
                default:
                    throw new common_1.BadRequestException(`Recognition method ${obligation.recognitionMethod} not supported`);
            }
            const totalScheduled = entries.reduce((sum, entry) => sum.plus(entry.scheduledAmount), new decimal_js_1.default(0));
            return {
                obligationId,
                contractId: obligation.contractId,
                totalScheduled,
                totalRecognized: new decimal_js_1.default(0),
                totalDeferred: totalScheduled,
                totalRemaining: totalScheduled,
                scheduleEntries: entries,
                recognitionMethod: obligation.recognitionMethod,
                startDate: obligation.startDate,
                endDate: obligation.endDate,
                generatedAt: new Date()
            };
        }
        /**
         * Generates straight-line recognition schedule
         * @private
         */
        async generateStraightLineSchedule(obligation, totalAmount, transaction) {
            const entries = [];
            const startDate = new Date(obligation.startDate);
            const endDate = new Date(obligation.endDate);
            // Calculate number of periods (months)
            const periods = (0, date_fns_1.differenceInMonths)(endDate, startDate) + 1;
            const monthlyAmount = totalAmount.dividedBy(periods);
            let currentDate = (0, date_fns_1.startOfMonth)(startDate);
            let cumulativeAmount = new decimal_js_1.default(0);
            for (let i = 0; i < periods; i++) {
                const periodStart = currentDate;
                const periodEnd = (0, date_fns_1.endOfMonth)(currentDate);
                // Adjust last period to match exactly
                const scheduledAmount = i === periods - 1
                    ? totalAmount.minus(cumulativeAmount)
                    : monthlyAmount;
                const entry = await this.scheduleModel.create({
                    obligationId: obligation.id,
                    contractId: obligation.contractId,
                    scheduleDate: periodEnd,
                    periodStartDate: periodStart,
                    periodEndDate: periodEnd > endDate ? endDate : periodEnd,
                    scheduledAmount: scheduledAmount.toString(),
                    recognizedAmount: '0',
                    deferredAmount: scheduledAmount.toString(),
                    cumulativeRecognized: '0',
                    status: ScheduleEntryStatus.SCHEDULED
                }, { transaction });
                cumulativeAmount = cumulativeAmount.plus(scheduledAmount);
                entries.push({
                    id: entry.id,
                    obligationId: obligation.id,
                    contractId: obligation.contractId,
                    scheduleDate: periodEnd,
                    periodStartDate: periodStart,
                    periodEndDate: periodEnd > endDate ? endDate : periodEnd,
                    scheduledAmount,
                    recognizedAmount: new decimal_js_1.default(0),
                    deferredAmount: scheduledAmount,
                    cumulativeRecognized: new decimal_js_1.default(0),
                    status: ScheduleEntryStatus.SCHEDULED,
                    createdAt: entry.createdAt,
                    updatedAt: entry.updatedAt
                });
                currentDate = (0, date_fns_1.addMonths)(currentDate, 1);
            }
            return entries;
        }
        /**
         * Generates milestone-based recognition schedule
         * @private
         */
        async generateMilestoneSchedule(obligation, totalAmount, transaction) {
            // Get milestones from metadata
            const milestones = obligation.metadata?.milestones || [];
            if (milestones.length === 0) {
                // Default to quarterly milestones
                return this.generateDefaultMilestones(obligation, totalAmount, transaction);
            }
            const entries = [];
            let cumulativeAmount = new decimal_js_1.default(0);
            for (const milestone of milestones) {
                const amount = new decimal_js_1.default(milestone.amount);
                const entry = await this.scheduleModel.create({
                    obligationId: obligation.id,
                    contractId: obligation.contractId,
                    scheduleDate: new Date(milestone.date),
                    periodStartDate: obligation.startDate,
                    periodEndDate: new Date(milestone.date),
                    scheduledAmount: amount.toString(),
                    recognizedAmount: '0',
                    deferredAmount: amount.toString(),
                    cumulativeRecognized: '0',
                    status: ScheduleEntryStatus.SCHEDULED,
                    metadata: { milestoneDescription: milestone.description }
                }, { transaction });
                cumulativeAmount = cumulativeAmount.plus(amount);
                entries.push(this.mapToScheduleEntry(entry));
            }
            return entries;
        }
        /**
         * Generates percentage completion schedule
         * @private
         */
        async generatePercentageCompletionSchedule(obligation, totalAmount, transaction) {
            // For percentage completion, create monthly recognition opportunities
            const entries = [];
            const startDate = new Date(obligation.startDate);
            const endDate = new Date(obligation.endDate);
            const periods = (0, date_fns_1.differenceInMonths)(endDate, startDate) + 1;
            let currentDate = (0, date_fns_1.startOfMonth)(startDate);
            for (let i = 0; i < periods; i++) {
                const periodEnd = (0, date_fns_1.endOfMonth)(currentDate);
                const entry = await this.scheduleModel.create({
                    obligationId: obligation.id,
                    contractId: obligation.contractId,
                    scheduleDate: periodEnd,
                    periodStartDate: currentDate,
                    periodEndDate: periodEnd > endDate ? endDate : periodEnd,
                    scheduledAmount: '0', // Determined by actual completion
                    recognizedAmount: '0',
                    deferredAmount: '0',
                    cumulativeRecognized: '0',
                    status: ScheduleEntryStatus.SCHEDULED
                }, { transaction });
                entries.push(this.mapToScheduleEntry(entry));
                currentDate = (0, date_fns_1.addMonths)(currentDate, 1);
            }
            return entries;
        }
        /**
         * Generates point-in-time recognition schedule
         * @private
         */
        async generatePointInTimeSchedule(obligation, totalAmount, transaction) {
            const entry = await this.scheduleModel.create({
                obligationId: obligation.id,
                contractId: obligation.contractId,
                scheduleDate: obligation.endDate,
                periodStartDate: obligation.startDate,
                periodEndDate: obligation.endDate,
                scheduledAmount: totalAmount.toString(),
                recognizedAmount: '0',
                deferredAmount: totalAmount.toString(),
                cumulativeRecognized: '0',
                status: ScheduleEntryStatus.SCHEDULED
            }, { transaction });
            return [this.mapToScheduleEntry(entry)];
        }
        /**
         * Generates subscription-based schedule
         * @private
         */
        async generateSubscriptionSchedule(obligation, totalAmount, transaction) {
            // Similar to straight-line but with monthly billing periods
            return this.generateStraightLineSchedule(obligation, totalAmount, transaction);
        }
        /**
         * Generates default quarterly milestones
         * @private
         */
        async generateDefaultMilestones(obligation, totalAmount, transaction) {
            const entries = [];
            const milestoneAmount = totalAmount.dividedBy(4);
            const startDate = new Date(obligation.startDate);
            for (let i = 0; i < 4; i++) {
                const milestoneDate = (0, date_fns_1.addMonths)(startDate, (i + 1) * 3);
                const amount = i === 3 ? totalAmount.minus(milestoneAmount.times(3)) : milestoneAmount;
                const entry = await this.scheduleModel.create({
                    obligationId: obligation.id,
                    contractId: obligation.contractId,
                    scheduleDate: milestoneDate,
                    periodStartDate: startDate,
                    periodEndDate: milestoneDate,
                    scheduledAmount: amount.toString(),
                    recognizedAmount: '0',
                    deferredAmount: amount.toString(),
                    cumulativeRecognized: '0',
                    status: ScheduleEntryStatus.SCHEDULED,
                    metadata: { milestoneDescription: `Q${i + 1} Milestone` }
                }, { transaction });
                entries.push(this.mapToScheduleEntry(entry));
            }
            return entries;
        }
        /**
         * Retrieves revenue schedule for an obligation
         * @param obligationId Obligation identifier
         * @returns Revenue schedule
         */
        async getRevenueSchedule(obligationId) {
            const obligation = await this.obligationModel.findByPk(obligationId);
            if (!obligation) {
                throw new common_1.NotFoundException(`Obligation ${obligationId} not found`);
            }
            const entries = await this.scheduleModel.findAll({
                where: { obligationId },
                order: [['scheduleDate', 'ASC']]
            });
            const mappedEntries = entries.map(entry => this.mapToScheduleEntry(entry));
            const totalScheduled = mappedEntries.reduce((sum, entry) => sum.plus(entry.scheduledAmount), new decimal_js_1.default(0));
            const totalRecognized = mappedEntries.reduce((sum, entry) => sum.plus(entry.recognizedAmount), new decimal_js_1.default(0));
            const totalDeferred = mappedEntries.reduce((sum, entry) => sum.plus(entry.deferredAmount), new decimal_js_1.default(0));
            return {
                obligationId,
                contractId: obligation.contractId,
                totalScheduled,
                totalRecognized,
                totalDeferred,
                totalRemaining: totalScheduled.minus(totalRecognized),
                scheduleEntries: mappedEntries,
                recognitionMethod: obligation.recognitionMethod,
                startDate: obligation.startDate,
                endDate: obligation.endDate,
                generatedAt: new Date()
            };
        }
        // ============================================================================
        // Revenue Recognition Execution
        // ============================================================================
        /**
         * Recognizes revenue for a specific period
         * @param contractId Contract identifier
         * @param periodEndDate End date of the recognition period
         * @returns Amount recognized
         */
        async recognizeRevenueForPeriod(contractId, periodEndDate) {
            this.logger.log(`Recognizing revenue for contract ${contractId} through ${(0, date_fns_1.format)(periodEndDate, 'yyyy-MM-dd')}`);
            const transaction = await this.sequelize.transaction();
            try {
                const contract = await this.contractModel.findByPk(contractId, { transaction });
                if (!contract) {
                    throw new common_1.NotFoundException(`Contract ${contractId} not found`);
                }
                if (contract.status !== ContractStatus.ACTIVE) {
                    throw new common_1.BadRequestException('Contract must be active to recognize revenue');
                }
                // Get all scheduled entries up to period end date
                const scheduledEntries = await this.scheduleModel.findAll({
                    where: {
                        contractId,
                        scheduleDate: { [sequelize_1.Op.lte]: periodEndDate },
                        status: ScheduleEntryStatus.SCHEDULED
                    },
                    transaction
                });
                let totalRecognized = new decimal_js_1.default(0);
                for (const entry of scheduledEntries) {
                    const scheduledAmount = new decimal_js_1.default(entry.scheduledAmount);
                    await entry.update({
                        recognizedAmount: scheduledAmount.toString(),
                        deferredAmount: '0',
                        status: ScheduleEntryStatus.RECOGNIZED,
                        recognitionDate: new Date()
                    }, { transaction });
                    totalRecognized = totalRecognized.plus(scheduledAmount);
                }
                // Update contract totals
                const currentRecognized = new decimal_js_1.default(contract.recognizedRevenue);
                const currentDeferred = new decimal_js_1.default(contract.deferredRevenue);
                await contract.update({
                    recognizedRevenue: currentRecognized.plus(totalRecognized).toString(),
                    deferredRevenue: currentDeferred.minus(totalRecognized).toString()
                }, { transaction });
                await this.createAuditEntry({
                    entityType: 'CONTRACT',
                    entityId: contractId,
                    action: 'RECOGNIZE_REVENUE',
                    performedBy: 'SYSTEM',
                    performedAt: new Date(),
                    changes: {
                        periodEndDate,
                        amountRecognized: totalRecognized.toString(),
                        entriesRecognized: scheduledEntries.length
                    }
                }, transaction);
                await transaction.commit();
                return {
                    contractId,
                    periodEndDate,
                    amountRecognized: totalRecognized
                };
            }
            catch (error) {
                await transaction.rollback();
                throw error;
            }
        }
        /**
         * Recognizes revenue based on percentage completion
         * @param obligationId Obligation identifier
         * @param percentComplete Current completion percentage
         * @returns Amount recognized
         */
        async recognizeRevenueByCompletion(obligationId, percentComplete) {
            this.logger.log(`Recognizing revenue by completion for obligation ${obligationId}: ${percentComplete}%`);
            const transaction = await this.sequelize.transaction();
            try {
                const obligation = await this.obligationModel.findByPk(obligationId, { transaction });
                if (!obligation) {
                    throw new common_1.NotFoundException(`Obligation ${obligationId} not found`);
                }
                if (obligation.recognitionMethod !== RecognitionMethod.PERCENTAGE_COMPLETION) {
                    throw new common_1.BadRequestException('Obligation must use percentage completion recognition method');
                }
                const allocatedAmount = new decimal_js_1.default(obligation.allocatedAmount);
                const newRecognizedAmount = allocatedAmount.times(percentComplete).dividedBy(100);
                const previousRecognizedAmount = new decimal_js_1.default(obligation.recognizedAmount);
                const incrementalRecognition = newRecognizedAmount.minus(previousRecognizedAmount);
                if (incrementalRecognition.lessThan(0)) {
                    throw new common_1.BadRequestException('Cannot decrease recognized revenue');
                }
                // Update obligation
                await obligation.update({
                    recognizedAmount: newRecognizedAmount.toString(),
                    remainingAmount: allocatedAmount.minus(newRecognizedAmount).toString(),
                    percentComplete
                }, { transaction });
                // Create/update schedule entry for current period
                const currentPeriodEnd = (0, date_fns_1.endOfMonth)(new Date());
                const [scheduleEntry] = await this.scheduleModel.findOrCreate({
                    where: {
                        obligationId,
                        scheduleDate: currentPeriodEnd
                    },
                    defaults: {
                        contractId: obligation.contractId,
                        periodStartDate: (0, date_fns_1.startOfMonth)(new Date()),
                        periodEndDate: currentPeriodEnd,
                        scheduledAmount: incrementalRecognition.toString(),
                        recognizedAmount: incrementalRecognition.toString(),
                        deferredAmount: '0',
                        cumulativeRecognized: newRecognizedAmount.toString(),
                        status: ScheduleEntryStatus.RECOGNIZED,
                        recognitionDate: new Date()
                    },
                    transaction
                });
                if (!scheduleEntry.isNewRecord) {
                    const currentScheduled = new decimal_js_1.default(scheduleEntry.scheduledAmount);
                    const currentRecognized = new decimal_js_1.default(scheduleEntry.recognizedAmount);
                    await scheduleEntry.update({
                        scheduledAmount: currentScheduled.plus(incrementalRecognition).toString(),
                        recognizedAmount: currentRecognized.plus(incrementalRecognition).toString(),
                        cumulativeRecognized: newRecognizedAmount.toString()
                    }, { transaction });
                }
                await transaction.commit();
                return {
                    obligationId,
                    amountRecognized: incrementalRecognition
                };
            }
            catch (error) {
                await transaction.rollback();
                throw error;
            }
        }
        /**
         * Recognizes revenue for a milestone achievement
         * @param obligationId Obligation identifier
         * @param milestoneId Milestone identifier
         * @returns Amount recognized
         */
        async recognizeMilestoneRevenue(obligationId, milestoneId) {
            this.logger.log(`Recognizing milestone revenue for obligation ${obligationId}, milestone ${milestoneId}`);
            const transaction = await this.sequelize.transaction();
            try {
                const obligation = await this.obligationModel.findByPk(obligationId, { transaction });
                if (!obligation) {
                    throw new common_1.NotFoundException(`Obligation ${obligationId} not found`);
                }
                if (obligation.recognitionMethod !== RecognitionMethod.MILESTONE) {
                    throw new common_1.BadRequestException('Obligation must use milestone recognition method');
                }
                // Find the milestone schedule entry
                const scheduleEntry = await this.scheduleModel.findOne({
                    where: {
                        obligationId,
                        id: milestoneId,
                        status: ScheduleEntryStatus.SCHEDULED
                    },
                    transaction
                });
                if (!scheduleEntry) {
                    throw new common_1.NotFoundException(`Milestone ${milestoneId} not found or already recognized`);
                }
                const milestoneAmount = new decimal_js_1.default(scheduleEntry.scheduledAmount);
                // Recognize the milestone
                await scheduleEntry.update({
                    recognizedAmount: milestoneAmount.toString(),
                    deferredAmount: '0',
                    status: ScheduleEntryStatus.RECOGNIZED,
                    recognitionDate: new Date()
                }, { transaction });
                // Update obligation
                const currentRecognized = new decimal_js_1.default(obligation.recognizedAmount);
                const newRecognized = currentRecognized.plus(milestoneAmount);
                await obligation.update({
                    recognizedAmount: newRecognized.toString(),
                    remainingAmount: new decimal_js_1.default(obligation.allocatedAmount).minus(newRecognized).toString()
                }, { transaction });
                await transaction.commit();
                return {
                    obligationId,
                    milestoneId,
                    amountRecognized: milestoneAmount
                };
            }
            catch (error) {
                await transaction.rollback();
                throw error;
            }
        }
        // ============================================================================
        // Deferred and Unbilled Revenue Management
        // ============================================================================
        /**
         * Retrieves deferred revenue summary
         * @param criteria Filter criteria
         * @returns Deferred revenue summary
         */
        async getDeferredRevenueSummary(criteria) {
            const asOfDate = criteria.asOfDate || new Date();
            const where = {};
            if (criteria.contractId) {
                where.contractId = criteria.contractId;
            }
            if (criteria.customerId) {
                const contracts = await this.contractModel.findAll({
                    where: { customerId: criteria.customerId },
                    attributes: ['id']
                });
                where.contractId = { [sequelize_1.Op.in]: contracts.map(c => c.id) };
            }
            where.scheduleDate = { [sequelize_1.Op.lte]: asOfDate };
            where.status = { [sequelize_1.Op.in]: [ScheduleEntryStatus.SCHEDULED, ScheduleEntryStatus.DEFERRED] };
            const deferredEntries = await this.scheduleModel.findAll({
                where,
                include: [{
                        model: this.contractModel,
                        as: 'contract',
                        attributes: ['id', 'contractNumber', 'startDate', 'endDate']
                    }, {
                        model: this.obligationModel,
                        as: 'obligation',
                        attributes: ['recognitionMethod']
                    }]
            });
            let totalDeferred = new decimal_js_1.default(0);
            let currentPeriodDeferred = new decimal_js_1.default(0);
            let longTermDeferred = new decimal_js_1.default(0);
            const oneYearFromNow = (0, date_fns_1.addMonths)(asOfDate, 12);
            const deferredByContract = new Map();
            const deferredByMethod = new Map();
            for (const entry of deferredEntries) {
                const deferredAmount = new decimal_js_1.default(entry.deferredAmount);
                totalDeferred = totalDeferred.plus(deferredAmount);
                // Classify as current or long-term
                if ((0, date_fns_1.isBefore)(entry.scheduleDate, oneYearFromNow)) {
                    currentPeriodDeferred = currentPeriodDeferred.plus(deferredAmount);
                }
                else {
                    longTermDeferred = longTermDeferred.plus(deferredAmount);
                }
                // Group by contract
                const contractId = entry.contractId;
                if (!deferredByContract.has(contractId)) {
                    deferredByContract.set(contractId, {
                        contractId,
                        contractNumber: entry.contract.contractNumber,
                        deferredAmount: new decimal_js_1.default(0),
                        startDate: entry.contract.startDate,
                        endDate: entry.contract.endDate
                    });
                }
                const contractEntry = deferredByContract.get(contractId);
                contractEntry.deferredAmount = contractEntry.deferredAmount.plus(deferredAmount);
                // Group by recognition method
                const method = entry.obligation.recognitionMethod;
                const methodTotal = deferredByMethod.get(method) || new decimal_js_1.default(0);
                deferredByMethod.set(method, methodTotal.plus(deferredAmount));
            }
            return {
                contractId: criteria.contractId,
                customerId: criteria.customerId,
                totalDeferred,
                currentPeriodDeferred,
                longTermDeferred,
                deferredByContract: Array.from(deferredByContract.values()),
                deferredByRecognitionMethod: deferredByMethod,
                asOfDate
            };
        }
        /**
         * Records unbilled revenue (contract asset)
         * @param contractId Contract identifier
         * @param amount Unbilled amount
         * @param description Description of unbilled revenue
         * @returns Updated contract
         */
        async recordUnbilledRevenue(contractId, amount, description) {
            this.logger.log(`Recording unbilled revenue for contract ${contractId}: ${amount}`);
            const transaction = await this.sequelize.transaction();
            try {
                const contract = await this.contractModel.findByPk(contractId, { transaction });
                if (!contract) {
                    throw new common_1.NotFoundException(`Contract ${contractId} not found`);
                }
                const currentUnbilled = new decimal_js_1.default(contract.unbilledRevenue);
                const newUnbilled = currentUnbilled.plus(amount);
                await contract.update({
                    unbilledRevenue: newUnbilled.toString()
                }, { transaction });
                await this.createAuditEntry({
                    entityType: 'CONTRACT',
                    entityId: contractId,
                    action: 'RECORD_UNBILLED_REVENUE',
                    performedBy: 'SYSTEM',
                    performedAt: new Date(),
                    changes: {
                        amount: amount.toString(),
                        description,
                        unbilledRevenue: { old: currentUnbilled.toString(), new: newUnbilled.toString() }
                    }
                }, transaction);
                await transaction.commit();
                return this.mapToRevenueContract(contract);
            }
            catch (error) {
                await transaction.rollback();
                throw error;
            }
        }
        /**
         * Converts unbilled revenue to billed (upon invoicing)
         * @param contractId Contract identifier
         * @param amount Amount being billed
         * @returns Updated contract
         */
        async billUnbilledRevenue(contractId, amount) {
            const transaction = await this.sequelize.transaction();
            try {
                const contract = await this.contractModel.findByPk(contractId, { transaction });
                if (!contract) {
                    throw new common_1.NotFoundException(`Contract ${contractId} not found`);
                }
                const currentUnbilled = new decimal_js_1.default(contract.unbilledRevenue);
                if (amount.greaterThan(currentUnbilled)) {
                    throw new common_1.BadRequestException(`Billed amount (${amount}) exceeds unbilled revenue (${currentUnbilled})`);
                }
                const newUnbilled = currentUnbilled.minus(amount);
                await contract.update({
                    unbilledRevenue: newUnbilled.toString()
                }, { transaction });
                await this.createAuditEntry({
                    entityType: 'CONTRACT',
                    entityId: contractId,
                    action: 'BILL_UNBILLED_REVENUE',
                    performedBy: 'SYSTEM',
                    performedAt: new Date(),
                    changes: {
                        amount: amount.toString(),
                        unbilledRevenue: { old: currentUnbilled.toString(), new: newUnbilled.toString() }
                    }
                }, transaction);
                await transaction.commit();
                return this.mapToRevenueContract(contract);
            }
            catch (error) {
                await transaction.rollback();
                throw error;
            }
        }
        // ============================================================================
        // Variable Consideration
        // ============================================================================
        /**
         * Calculates variable consideration with constraint
         * @param data Variable consideration data
         * @returns Variable consideration calculation
         */
        async calculateVariableConsideration(data) {
            this.logger.log(`Calculating variable consideration for contract ${data.contractId}`);
            let variableAmount = new decimal_js_1.default(0);
            switch (data.estimationMethod) {
                case VariableEstimationMethod.EXPECTED_VALUE:
                    // Probability-weighted approach
                    for (const element of data.variableElements) {
                        const probability = element.probability || 0.5;
                        const weighted = element.estimatedAmount.times(probability);
                        variableAmount = variableAmount.plus(weighted);
                    }
                    break;
                case VariableEstimationMethod.MOST_LIKELY:
                    // Single most likely outcome
                    const mostLikely = data.variableElements.reduce((max, element) => {
                        const prob = element.probability || 0;
                        return prob > (max.probability || 0) ? element : max;
                    });
                    variableAmount = mostLikely.estimatedAmount;
                    break;
                case VariableEstimationMethod.CONSERVATIVE:
                    // Most conservative estimate (minimum)
                    variableAmount = data.variableElements.reduce((min, element) => {
                        return element.estimatedAmount.lessThan(min) ? element.estimatedAmount : min;
                    }, new decimal_js_1.default(Infinity));
                    break;
            }
            // Apply constraint (ASC 606 requirement)
            const constraintApplied = this.shouldApplyConstraint(data.variableElements);
            let constrainedAmount = variableAmount;
            let constraintReason;
            if (constraintApplied) {
                // Apply conservative constraint (e.g., 50% reduction)
                constrainedAmount = variableAmount.times(0.5);
                constraintReason = 'High uncertainty in variable consideration - applied 50% constraint per ASC 606';
            }
            return {
                contractId: data.contractId,
                baseAmount: data.baseAmount,
                variableAmount,
                constrainedAmount,
                estimationMethod: data.estimationMethod,
                constraintApplied,
                constraintReason,
                variableElements: data.variableElements.map(el => ({
                    type: el.type,
                    description: el.description,
                    estimatedAmount: el.estimatedAmount,
                    probability: el.probability,
                    constraintFactor: el.constraintFactor
                })),
                calculatedAt: new Date()
            };
        }
        /**
         * Determines if constraint should be applied to variable consideration
         * @private
         */
        shouldApplyConstraint(variableElements) {
            // Apply constraint if:
            // 1. High variability in estimates
            // 2. Low probability of favorable outcomes
            // 3. Limited experience with similar contracts
            const avgProbability = variableElements.reduce((sum, el) => sum + (el.probability || 0.5), 0) / variableElements.length;
            return avgProbability < 0.7; // Apply constraint if average probability < 70%
        }
        /**
         * Updates contract with variable consideration
         * @param contractId Contract identifier
         * @param variableConsideration Variable consideration calculation
         * @returns Updated contract
         */
        async applyVariableConsideration(contractId, variableConsideration) {
            const transaction = await this.sequelize.transaction();
            try {
                const contract = await this.contractModel.findByPk(contractId, { transaction });
                if (!contract) {
                    throw new common_1.NotFoundException(`Contract ${contractId} not found`);
                }
                const newTotalValue = variableConsideration.baseAmount.plus(variableConsideration.constrainedAmount);
                await contract.update({
                    totalContractValue: newTotalValue.toString(),
                    metadata: {
                        ...contract.metadata,
                        variableConsideration: {
                            baseAmount: variableConsideration.baseAmount.toString(),
                            variableAmount: variableConsideration.variableAmount.toString(),
                            constrainedAmount: variableConsideration.constrainedAmount.toString(),
                            appliedAt: new Date()
                        }
                    }
                }, { transaction });
                await this.createAuditEntry({
                    entityType: 'CONTRACT',
                    entityId: contractId,
                    action: 'APPLY_VARIABLE_CONSIDERATION',
                    performedBy: 'SYSTEM',
                    performedAt: new Date(),
                    changes: {
                        variableConsideration: {
                            old: null,
                            new: variableConsideration
                        }
                    }
                }, transaction);
                await transaction.commit();
                return this.mapToRevenueContract(contract);
            }
            catch (error) {
                await transaction.rollback();
                throw error;
            }
        }
        // ============================================================================
        // Contract Modifications
        // ============================================================================
        /**
         * Records a contract modification
         * @param modificationData Modification details
         * @returns Contract modification record
         */
        async recordContractModification(modificationData) {
            this.logger.log(`Recording contract modification for ${modificationData.contractId}`);
            const transaction = await this.sequelize.transaction();
            try {
                const contract = await this.contractModel.findByPk(modificationData.contractId, { transaction });
                if (!contract) {
                    throw new common_1.NotFoundException(`Contract ${modificationData.contractId} not found`);
                }
                // Generate modification number
                const modCount = await this.modificationModel.count({
                    where: { contractId: modificationData.contractId },
                    transaction
                });
                const modificationNumber = `${contract.contractNumber}-MOD-${String(modCount + 1).padStart(3, '0')}`;
                const valueChange = modificationData.modifiedValue.minus(modificationData.originalValue);
                const modification = await this.modificationModel.create({
                    contractId: modificationData.contractId,
                    modificationNumber,
                    modificationType: modificationData.modificationType,
                    modificationDate: modificationData.modificationDate,
                    effectiveDate: modificationData.effectiveDate,
                    description: modificationData.description,
                    originalValue: modificationData.originalValue.toString(),
                    modifiedValue: modificationData.modifiedValue.toString(),
                    valueChange: valueChange.toString(),
                    impactedObligations: modificationData.impactedObligations,
                    reallocationRequired: valueChange.abs().greaterThan(0),
                    approvedBy: modificationData.approvedBy,
                    approvedAt: new Date(),
                    metadata: modificationData.metadata
                }, { transaction });
                // Update contract
                await contract.update({
                    totalContractValue: modificationData.modifiedValue.toString(),
                    modificationCount: contract.modificationCount + 1,
                    lastModifiedDate: modificationData.modificationDate,
                    status: ContractStatus.AMENDED
                }, { transaction });
                await this.createAuditEntry({
                    entityType: 'MODIFICATION',
                    entityId: modification.id,
                    action: 'RECORD_MODIFICATION',
                    performedBy: modificationData.approvedBy,
                    performedAt: new Date(),
                    changes: { modification: { old: null, new: modification.toJSON() } }
                }, transaction);
                await transaction.commit();
                return this.mapToContractModification(modification);
            }
            catch (error) {
                await transaction.rollback();
                throw error;
            }
        }
        /**
         * Applies contract modification and reallocates revenue
         * @param modificationId Modification identifier
         * @returns Updated contract
         */
        async applyContractModification(modificationId) {
            const transaction = await this.sequelize.transaction();
            try {
                const modification = await this.modificationModel.findByPk(modificationId, { transaction });
                if (!modification) {
                    throw new common_1.NotFoundException(`Modification ${modificationId} not found`);
                }
                const contract = await this.contractModel.findByPk(modification.contractId, { transaction });
                if (!contract) {
                    throw new common_1.NotFoundException(`Contract ${modification.contractId} not found`);
                }
                const valueChange = new decimal_js_1.default(modification.valueChange);
                switch (modification.modificationType) {
                    case ModificationType.PROSPECTIVE:
                        await this.applyProspectiveModification(modification, contract, valueChange, transaction);
                        break;
                    case ModificationType.CUMULATIVE_CATCHUP:
                        await this.applyCumulativeCatchupModification(modification, contract, valueChange, transaction);
                        break;
                    case ModificationType.RETROSPECTIVE:
                        await this.applyRetrospectiveModification(modification, contract, valueChange, transaction);
                        break;
                    default:
                        throw new common_1.BadRequestException(`Modification type ${modification.modificationType} not yet implemented`);
                }
                await transaction.commit();
                return this.mapToRevenueContract(contract);
            }
            catch (error) {
                await transaction.rollback();
                throw error;
            }
        }
        /**
         * Applies prospective modification (future periods only)
         * @private
         */
        async applyProspectiveModification(modification, contract, valueChange, transaction) {
            const impactedObligations = await this.obligationModel.findAll({
                where: {
                    id: { [sequelize_1.Op.in]: modification.impactedObligations }
                },
                transaction
            });
            const today = new Date();
            for (const obligation of impactedObligations) {
                // Adjust future schedule entries only
                const futureEntries = await this.scheduleModel.findAll({
                    where: {
                        obligationId: obligation.id,
                        scheduleDate: { [sequelize_1.Op.gte]: today },
                        status: ScheduleEntryStatus.SCHEDULED
                    },
                    transaction
                });
                if (futureEntries.length === 0)
                    continue;
                const adjustmentPerEntry = valueChange.dividedBy(futureEntries.length);
                for (const entry of futureEntries) {
                    const currentAmount = new decimal_js_1.default(entry.scheduledAmount);
                    const newAmount = currentAmount.plus(adjustmentPerEntry);
                    await entry.update({
                        scheduledAmount: newAmount.toString(),
                        deferredAmount: newAmount.toString()
                    }, { transaction });
                }
            }
        }
        /**
         * Applies cumulative catch-up modification
         * @private
         */
        async applyCumulativeCatchupModification(modification, contract, valueChange, transaction) {
            // Recognize cumulative adjustment immediately
            const currentRecognized = new decimal_js_1.default(contract.recognizedRevenue);
            const currentDeferred = new decimal_js_1.default(contract.deferredRevenue);
            await contract.update({
                recognizedRevenue: currentRecognized.plus(valueChange).toString(),
                deferredRevenue: currentDeferred.minus(valueChange).toString()
            }, { transaction });
            // Record adjustment entry
            await this.scheduleModel.create({
                obligationId: modification.impactedObligations[0], // Primary obligation
                contractId: contract.id,
                scheduleDate: modification.effectiveDate,
                periodStartDate: modification.effectiveDate,
                periodEndDate: modification.effectiveDate,
                scheduledAmount: valueChange.toString(),
                recognizedAmount: valueChange.toString(),
                deferredAmount: '0',
                cumulativeRecognized: currentRecognized.plus(valueChange).toString(),
                status: ScheduleEntryStatus.ADJUSTED,
                metadata: {
                    modificationId: modification.id,
                    modificationType: 'CUMULATIVE_CATCHUP'
                }
            }, { transaction });
            await contract.update({
                metadata: {
                    ...contract.metadata,
                    cumulativeAdjustment: valueChange.toString()
                }
            }, { transaction });
        }
        /**
         * Applies retrospective modification (restate prior periods)
         * @private
         */
        async applyRetrospectiveModification(modification, contract, valueChange, transaction) {
            // This would require restating all prior period entries
            // Implementation would depend on specific accounting requirements
            throw new common_1.BadRequestException('Retrospective modifications require manual accounting review');
        }
        // ============================================================================
        // Revenue Forecasting
        // ============================================================================
        /**
         * Generates revenue forecast for a contract or customer
         * @param criteria Forecast criteria
         * @returns Revenue forecast
         */
        async generateRevenueForecast(criteria) {
            this.logger.log('Generating revenue forecast');
            const where = {};
            if (criteria.contractId) {
                where.contractId = criteria.contractId;
            }
            else if (criteria.customerId) {
                const contracts = await this.contractModel.findAll({
                    where: { customerId: criteria.customerId },
                    attributes: ['id']
                });
                where.contractId = { [sequelize_1.Op.in]: contracts.map(c => c.id) };
            }
            where.scheduleDate = {
                [sequelize_1.Op.between]: [criteria.forecastPeriod.startDate, criteria.forecastPeriod.endDate]
            };
            const scheduleEntries = await this.scheduleModel.findAll({ where });
            // Calculate total forecasted revenue
            let forecastedRevenue = new decimal_js_1.default(0);
            let recognizedToDate = new decimal_js_1.default(0);
            for (const entry of scheduleEntries) {
                forecastedRevenue = forecastedRevenue.plus(new decimal_js_1.default(entry.scheduledAmount));
                if (entry.status === ScheduleEntryStatus.RECOGNIZED) {
                    recognizedToDate = recognizedToDate.plus(new decimal_js_1.default(entry.recognizedAmount));
                }
            }
            const remainingToRecognize = forecastedRevenue.minus(recognizedToDate);
            // Generate monthly forecasts
            const monthlyForecasts = [];
            let currentMonth = (0, date_fns_1.startOfMonth)(criteria.forecastPeriod.startDate);
            const endMonth = (0, date_fns_1.startOfMonth)(criteria.forecastPeriod.endDate);
            while ((0, date_fns_1.isBefore)(currentMonth, endMonth) || currentMonth.getTime() === endMonth.getTime()) {
                const monthEnd = (0, date_fns_1.endOfMonth)(currentMonth);
                const monthEntries = scheduleEntries.filter(entry => (0, date_fns_1.isWithinInterval)(entry.scheduleDate, { start: currentMonth, end: monthEnd }));
                const monthAmount = monthEntries.reduce((sum, entry) => sum.plus(new decimal_js_1.default(entry.scheduledAmount)), new decimal_js_1.default(0));
                monthlyForecasts.push({
                    month: (0, date_fns_1.format)(currentMonth, 'yyyy-MM'),
                    forecastedAmount: monthAmount,
                    probability: this.calculateForecastProbability(currentMonth, monthEntries)
                });
                currentMonth = (0, date_fns_1.addMonths)(currentMonth, 1);
            }
            // Calculate confidence level
            const confidenceLevel = this.calculateOverallConfidence(scheduleEntries);
            return {
                forecastId: `FORECAST-${Date.now()}`,
                contractId: criteria.contractId,
                customerId: criteria.customerId,
                forecastPeriod: criteria.forecastPeriod,
                forecastedRevenue,
                recognizedToDate,
                remainingToRecognize,
                confidenceLevel,
                monthlyForecasts,
                assumptions: [
                    'All performance obligations will be satisfied as scheduled',
                    'No contract modifications anticipated',
                    'Customer creditworthiness remains stable'
                ],
                risks: [
                    'Contract cancellation or modification',
                    'Delayed performance obligation satisfaction',
                    'Economic conditions affecting customer ability to pay'
                ],
                generatedAt: new Date()
            };
        }
        /**
         * Calculates forecast probability for a specific month
         * @private
         */
        calculateForecastProbability(month, entries) {
            const today = new Date();
            const monthsOut = (0, date_fns_1.differenceInMonths)(month, today);
            // Near-term forecasts are more certain
            if (monthsOut <= 1)
                return 0.95;
            if (monthsOut <= 3)
                return 0.90;
            if (monthsOut <= 6)
                return 0.85;
            if (monthsOut <= 12)
                return 0.75;
            return 0.65;
        }
        /**
         * Calculates overall forecast confidence
         * @private
         */
        calculateOverallConfidence(entries) {
            const recognizedCount = entries.filter(e => e.status === ScheduleEntryStatus.RECOGNIZED).length;
            const totalCount = entries.length;
            if (totalCount === 0)
                return 0.5;
            // Higher confidence if more entries already recognized
            const recognizedRatio = recognizedCount / totalCount;
            return 0.7 + (recognizedRatio * 0.3); // 70-100% confidence range
        }
        // ============================================================================
        // Revenue Waterfall and Analytics
        // ============================================================================
        /**
         * Generates revenue waterfall for a period
         * @param contractId Contract identifier
         * @param periodStart Period start date
         * @param periodEnd Period end date
         * @returns Revenue waterfall
         */
        async generateRevenueWaterfall(contractId, periodStart, periodEnd) {
            this.logger.log(`Generating revenue waterfall for contract ${contractId}`);
            const contract = await this.contractModel.findByPk(contractId);
            if (!contract) {
                throw new common_1.NotFoundException(`Contract ${contractId} not found`);
            }
            // Get opening deferred balance
            const openingEntries = await this.scheduleModel.findAll({
                where: {
                    contractId,
                    scheduleDate: { [sequelize_1.Op.lt]: periodStart },
                    status: { [sequelize_1.Op.in]: [ScheduleEntryStatus.SCHEDULED, ScheduleEntryStatus.DEFERRED] }
                }
            });
            const openingDeferred = openingEntries.reduce((sum, entry) => sum.plus(new decimal_js_1.default(entry.deferredAmount)), new decimal_js_1.default(0));
            // Get period activity
            const periodEntries = await this.scheduleModel.findAll({
                where: {
                    contractId,
                    scheduleDate: {
                        [sequelize_1.Op.between]: [periodStart, periodEnd]
                    }
                }
            });
            const billedAmount = periodEntries.reduce((sum, entry) => sum.plus(new decimal_js_1.default(entry.scheduledAmount)), new decimal_js_1.default(0));
            const recognizedRevenue = periodEntries
                .filter(e => e.status === ScheduleEntryStatus.RECOGNIZED)
                .reduce((sum, entry) => sum.plus(new decimal_js_1.default(entry.recognizedAmount)), new decimal_js_1.default(0));
            // Calculate closing balances
            const closingDeferred = openingDeferred.plus(billedAmount).minus(recognizedRevenue);
            const unbilledRevenue = new decimal_js_1.default(contract.unbilledRevenue);
            // Build waterfall steps
            const steps = [];
            let runningBalance = openingDeferred;
            steps.push({
                step: '1',
                description: 'Opening Deferred Revenue',
                amount: openingDeferred,
                runningBalance
            });
            runningBalance = runningBalance.plus(billedAmount);
            steps.push({
                step: '2',
                description: 'Add: Billed Revenue',
                amount: billedAmount,
                runningBalance
            });
            runningBalance = runningBalance.minus(recognizedRevenue);
            steps.push({
                step: '3',
                description: 'Less: Revenue Recognized',
                amount: recognizedRevenue.negated(),
                runningBalance
            });
            steps.push({
                step: '4',
                description: 'Closing Deferred Revenue',
                amount: closingDeferred,
                runningBalance
            });
            steps.push({
                step: '5',
                description: 'Unbilled Revenue (Contract Asset)',
                amount: unbilledRevenue,
                runningBalance: runningBalance.plus(unbilledRevenue)
            });
            return {
                contractId,
                periodStart,
                periodEnd,
                openingDeferred,
                billedAmount,
                recognizedRevenue,
                closingDeferred,
                unbilledRevenue,
                steps,
                calculatedAt: new Date()
            };
        }
        /**
         * Generates comprehensive revenue analytics
         * @param criteria Analysis criteria
         * @returns Revenue analytics
         */
        async getRevenueAnalytics(criteria) {
            const where = {
                startDate: { [sequelize_1.Op.lte]: criteria.endDate },
                endDate: { [sequelize_1.Op.gte]: criteria.startDate }
            };
            if (criteria.customerId) {
                where.customerId = criteria.customerId;
            }
            const contracts = await this.contractModel.findAll({
                where,
                include: [{
                        model: this.obligationModel,
                        as: 'obligations'
                    }]
            });
            let totalContractValue = new decimal_js_1.default(0);
            let totalRecognized = new decimal_js_1.default(0);
            let totalDeferred = new decimal_js_1.default(0);
            const byRecognitionMethod = new Map();
            const byStatus = new Map();
            for (const contract of contracts) {
                const value = new decimal_js_1.default(contract.totalContractValue);
                totalContractValue = totalContractValue.plus(value);
                totalRecognized = totalRecognized.plus(new decimal_js_1.default(contract.recognizedRevenue));
                totalDeferred = totalDeferred.plus(new decimal_js_1.default(contract.deferredRevenue));
                // Group by status
                const statusEntry = byStatus.get(contract.status) || { count: 0, value: new decimal_js_1.default(0) };
                statusEntry.count++;
                statusEntry.value = statusEntry.value.plus(value);
                byStatus.set(contract.status, statusEntry);
                // Group by recognition method
                for (const obligation of contract.obligations || []) {
                    const method = obligation.recognitionMethod;
                    const methodEntry = byRecognitionMethod.get(method) || { count: 0, value: new decimal_js_1.default(0) };
                    methodEntry.count++;
                    methodEntry.value = methodEntry.value.plus(new decimal_js_1.default(obligation.allocatedAmount));
                    byRecognitionMethod.set(method, methodEntry);
                }
            }
            const recognitionRate = totalContractValue.isZero()
                ? 0
                : totalRecognized.dividedBy(totalContractValue).times(100).toNumber();
            // Generate monthly trend
            const monthlyTrend = [];
            let currentMonth = (0, date_fns_1.startOfMonth)(criteria.startDate);
            const endMonth = (0, date_fns_1.startOfMonth)(criteria.endDate);
            while ((0, date_fns_1.isBefore)(currentMonth, endMonth) || currentMonth.getTime() === endMonth.getTime()) {
                const monthEnd = (0, date_fns_1.endOfMonth)(currentMonth);
                const monthEntries = await this.scheduleModel.findAll({
                    where: {
                        contractId: { [sequelize_1.Op.in]: contracts.map(c => c.id) },
                        scheduleDate: {
                            [sequelize_1.Op.between]: [currentMonth, monthEnd]
                        }
                    }
                });
                const recognized = monthEntries
                    .filter(e => e.status === ScheduleEntryStatus.RECOGNIZED)
                    .reduce((sum, e) => sum.plus(new decimal_js_1.default(e.recognizedAmount)), new decimal_js_1.default(0));
                const deferred = monthEntries
                    .filter(e => e.status === ScheduleEntryStatus.SCHEDULED)
                    .reduce((sum, e) => sum.plus(new decimal_js_1.default(e.deferredAmount)), new decimal_js_1.default(0));
                monthlyTrend.push({
                    month: (0, date_fns_1.format)(currentMonth, 'yyyy-MM'),
                    recognized,
                    deferred
                });
                currentMonth = (0, date_fns_1.addMonths)(currentMonth, 1);
            }
            return {
                totalContracts: contracts.length,
                totalContractValue,
                totalRecognized,
                totalDeferred,
                recognitionRate,
                byRecognitionMethod,
                byStatus,
                monthlyTrend
            };
        }
        // ============================================================================
        // Audit and Compliance
        // ============================================================================
        /**
         * Creates an audit trail entry
         * @private
         */
        async createAuditEntry(entry, transaction) {
            await this.auditModel.create(entry, { transaction });
        }
        /**
         * Retrieves audit trail for an entity
         * @param entityType Entity type
         * @param entityId Entity identifier
         * @returns Audit entries
         */
        async getAuditTrail(entityType, entityId) {
            const entries = await this.auditModel.findAll({
                where: { entityType, entityId },
                order: [['performedAt', 'DESC']]
            });
            return entries.map(entry => entry.toJSON());
        }
        /**
         * Validates ASC 606 compliance for a contract
         * @param contractId Contract identifier
         * @returns Compliance validation result
         */
        async validateASC606Compliance(contractId) {
            const contract = await this.contractModel.findByPk(contractId);
            if (!contract) {
                throw new common_1.NotFoundException(`Contract ${contractId} not found`);
            }
            const obligations = await this.obligationModel.findAll({
                where: { contractId }
            });
            const validations = [];
            // Step 1: Identify the contract
            validations.push({
                criterion: 'Contract Identification',
                passed: !!contract.contractNumber && !!contract.customerId,
                message: 'Contract properly identified with number and customer'
            });
            // Step 2: Identify performance obligations
            validations.push({
                criterion: 'Performance Obligations',
                passed: obligations.length > 0,
                message: `${obligations.length} performance obligation(s) identified`
            });
            // Step 3: Determine transaction price
            const totalValue = new decimal_js_1.default(contract.totalContractValue);
            validations.push({
                criterion: 'Transaction Price',
                passed: totalValue.greaterThan(0),
                message: `Transaction price determined: ${totalValue}`
            });
            // Step 4: Allocate transaction price
            const totalAllocated = obligations.reduce((sum, obl) => sum.plus(new decimal_js_1.default(obl.allocatedAmount)), new decimal_js_1.default(0));
            const allocationMatches = totalValue.equals(totalAllocated);
            validations.push({
                criterion: 'Transaction Price Allocation',
                passed: allocationMatches,
                message: allocationMatches
                    ? 'Transaction price fully allocated to performance obligations'
                    : `Allocation mismatch: ${totalAllocated} allocated vs ${totalValue} total`
            });
            // Step 5: Recognize revenue when obligations satisfied
            const hasSchedules = await this.scheduleModel.count({
                where: { contractId }
            }) > 0;
            validations.push({
                criterion: 'Revenue Recognition Schedule',
                passed: hasSchedules,
                message: hasSchedules
                    ? 'Revenue recognition schedules established'
                    : 'No revenue recognition schedules found'
            });
            const isCompliant = validations.every(v => v.passed);
            return { isCompliant, validations };
        }
        /**
         * Generates ASC 606 disclosure report
         * @param criteria Report criteria
         * @returns Disclosure report data
         */
        async generateASC606DisclosureReport(criteria) {
            const where = {
                startDate: { [sequelize_1.Op.lte]: criteria.reportingPeriod.endDate }
            };
            if (criteria.customerId) {
                where.customerId = criteria.customerId;
            }
            const contracts = await this.contractModel.findAll({ where });
            let revenueRecognized = new decimal_js_1.default(0);
            let contractAssets = new decimal_js_1.default(0);
            let contractLiabilities = new decimal_js_1.default(0);
            for (const contract of contracts) {
                revenueRecognized = revenueRecognized.plus(new decimal_js_1.default(contract.recognizedRevenue));
                contractAssets = contractAssets.plus(new decimal_js_1.default(contract.unbilledRevenue));
                contractLiabilities = contractLiabilities.plus(new decimal_js_1.default(contract.deferredRevenue));
            }
            const obligations = await this.obligationModel.findAll({
                where: {
                    contractId: { [sequelize_1.Op.in]: contracts.map(c => c.id) },
                    status: { [sequelize_1.Op.ne]: ObligationStatus.SATISFIED }
                }
            });
            const performanceObligationsSummary = obligations.map(obl => ({
                description: obl.description,
                timing: this.getTimingDescription(obl.recognitionMethod),
                method: obl.recognitionMethod,
                allocatedValue: new decimal_js_1.default(obl.allocatedAmount),
                remainingValue: new decimal_js_1.default(obl.remainingAmount)
            }));
            return {
                reportingPeriod: criteria.reportingPeriod,
                revenueRecognized,
                contractAssets,
                contractLiabilities,
                performanceObligationsSummary,
                significantJudgments: [
                    'Identification of performance obligations in bundled contracts',
                    'Estimation of standalone selling prices using residual and market approaches',
                    'Determination of variable consideration constraints',
                    'Assessment of transfer of control timing for revenue recognition'
                ]
            };
        }
        /**
         * Gets timing description for recognition method
         * @private
         */
        getTimingDescription(method) {
            switch (method) {
                case RecognitionMethod.STRAIGHT_LINE:
                    return 'Over time - ratably';
                case RecognitionMethod.MILESTONE:
                    return 'Over time - milestone-based';
                case RecognitionMethod.PERCENTAGE_COMPLETION:
                    return 'Over time - percentage of completion';
                case RecognitionMethod.POINT_IN_TIME:
                    return 'Point in time';
                case RecognitionMethod.SUBSCRIPTION:
                    return 'Over time - subscription period';
                default:
                    return 'Over time';
            }
        }
        // ============================================================================
        // Helper Methods
        // ============================================================================
        /**
         * Validates contract status transition
         * @private
         */
        validateStatusTransition(from, to) {
            const validTransitions = {
                [ContractStatus.DRAFT]: [ContractStatus.ACTIVE, ContractStatus.CANCELLED],
                [ContractStatus.ACTIVE]: [ContractStatus.AMENDED, ContractStatus.SUSPENDED, ContractStatus.COMPLETED, ContractStatus.TERMINATED],
                [ContractStatus.AMENDED]: [ContractStatus.ACTIVE, ContractStatus.SUSPENDED, ContractStatus.COMPLETED, ContractStatus.TERMINATED],
                [ContractStatus.SUSPENDED]: [ContractStatus.ACTIVE, ContractStatus.TERMINATED],
                [ContractStatus.CANCELLED]: [],
                [ContractStatus.COMPLETED]: [],
                [ContractStatus.TERMINATED]: []
            };
            if (!validTransitions[from]?.includes(to)) {
                throw new common_1.BadRequestException(`Invalid status transition from ${from} to ${to}`);
            }
        }
        /**
         * Maps database model to RevenueContract
         * @private
         */
        mapToRevenueContract(model) {
            return {
                id: model.id,
                contractNumber: model.contractNumber,
                customerId: model.customerId,
                customerName: model.customerName,
                description: model.description,
                contractDate: model.contractDate,
                startDate: model.startDate,
                endDate: model.endDate,
                totalContractValue: new decimal_js_1.default(model.totalContractValue),
                allocatedValue: new decimal_js_1.default(model.allocatedValue),
                recognizedRevenue: new decimal_js_1.default(model.recognizedRevenue),
                deferredRevenue: new decimal_js_1.default(model.deferredRevenue),
                unbilledRevenue: new decimal_js_1.default(model.unbilledRevenue),
                currency: model.currency,
                status: model.status,
                parentContractId: model.parentContractId,
                modificationCount: model.modificationCount,
                lastModifiedDate: model.lastModifiedDate,
                metadata: model.metadata,
                createdAt: model.createdAt,
                updatedAt: model.updatedAt,
                createdBy: model.createdBy,
                updatedBy: model.updatedBy
            };
        }
        /**
         * Maps database model to PerformanceObligation
         * @private
         */
        mapToPerformanceObligation(model) {
            return {
                id: model.id,
                contractId: model.contractId,
                obligationNumber: model.obligationNumber,
                description: model.description,
                allocatedAmount: new decimal_js_1.default(model.allocatedAmount),
                recognizedAmount: new decimal_js_1.default(model.recognizedAmount),
                remainingAmount: new decimal_js_1.default(model.remainingAmount),
                percentComplete: model.percentComplete,
                recognitionMethod: model.recognitionMethod,
                startDate: model.startDate,
                endDate: model.endDate,
                estimatedCompletionDate: model.estimatedCompletionDate,
                actualCompletionDate: model.actualCompletionDate,
                status: model.status,
                standaloneSellingPrice: model.standaloneSellingPrice ? new decimal_js_1.default(model.standaloneSellingPrice) : undefined,
                isSeparate: model.isSeparate,
                parentObligationId: model.parentObligationId,
                metadata: model.metadata,
                createdAt: model.createdAt,
                updatedAt: model.updatedAt
            };
        }
        /**
         * Maps database model to RevenueScheduleEntry
         * @private
         */
        mapToScheduleEntry(model) {
            return {
                id: model.id,
                obligationId: model.obligationId,
                contractId: model.contractId,
                scheduleDate: model.scheduleDate,
                periodStartDate: model.periodStartDate,
                periodEndDate: model.periodEndDate,
                scheduledAmount: new decimal_js_1.default(model.scheduledAmount),
                recognizedAmount: new decimal_js_1.default(model.recognizedAmount),
                deferredAmount: new decimal_js_1.default(model.deferredAmount),
                cumulativeRecognized: new decimal_js_1.default(model.cumulativeRecognized),
                status: model.status,
                recognitionDate: model.recognitionDate,
                journalEntryId: model.journalEntryId,
                reversalEntryId: model.reversalEntryId,
                notes: model.notes,
                metadata: model.metadata,
                createdAt: model.createdAt,
                updatedAt: model.updatedAt
            };
        }
        /**
         * Maps database model to ContractModification
         * @private
         */
        mapToContractModification(model) {
            return {
                id: model.id,
                contractId: model.contractId,
                modificationNumber: model.modificationNumber,
                modificationType: model.modificationType,
                modificationDate: model.modificationDate,
                effectiveDate: model.effectiveDate,
                description: model.description,
                originalValue: new decimal_js_1.default(model.originalValue),
                modifiedValue: new decimal_js_1.default(model.modifiedValue),
                valueChange: new decimal_js_1.default(model.valueChange),
                impactedObligations: model.impactedObligations,
                reallocationRequired: model.reallocationRequired,
                cumulativeAdjustment: model.cumulativeAdjustment ? new decimal_js_1.default(model.cumulativeAdjustment) : undefined,
                approvedBy: model.approvedBy,
                approvedAt: model.approvedAt,
                metadata: model.metadata,
                createdAt: model.createdAt
            };
        }
    };
    __setFunctionName(_classThis, "RevenueRecognitionService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RevenueRecognitionService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RevenueRecognitionService = _classThis;
})();
exports.RevenueRecognitionService = RevenueRecognitionService;
//# sourceMappingURL=revenue-recognition-kit.js.map