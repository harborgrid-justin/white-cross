/**
 * LOC: DPO-001
 * File: /reuse/logistics/demand-planning-optimization-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - sequelize
 *   - sequelize-typescript
 *
 * DOWNSTREAM (imported by):
 *   - Demand planning services
 *   - Replenishment schedulers
 *   - Inventory optimization engines
 *   - Supply chain controllers
 */
/**
 * Planning cycle status enumeration
 */
export declare enum PlanningCycleStatus {
    PLANNING = "PLANNING",
    FORECAST = "FORECAST",
    OPTIMIZATION = "OPTIMIZATION",
    APPROVED = "APPROVED",
    EXECUTING = "EXECUTING",
    COMPLETED = "COMPLETED",
    ARCHIVED = "ARCHIVED"
}
/**
 * Demand pattern type enumeration
 */
export declare enum DemandPatternType {
    STABLE = "STABLE",
    SEASONAL = "SEASONAL",
    TREND = "TREND",
    CYCLICAL = "CYCLICAL",
    IRREGULAR = "IRREGULAR",
    INTERMITTENT = "INTERMITTENT"
}
/**
 * Replenishment strategy enumeration
 */
export declare enum ReplenishmentStrategy {
    EOQ = "EOQ",
    MRP = "MRP",
    DRP = "DRP",
    CONTINUOUS_REVIEW = "CONTINUOUS_REVIEW",
    PERIODIC_REVIEW = "PERIODIC_REVIEW",
    TWO_BIN = "TWO_BIN",
    JUST_IN_TIME = "JUST_IN_TIME"
}
/**
 * Planning cycle configuration
 */
export interface PlanningCycle {
    cycleId: string;
    cycleName: string;
    status: PlanningCycleStatus;
    startDate: Date;
    endDate: Date;
    planningHorizon: number;
    aggregationLevel: 'DAILY' | 'WEEKLY' | 'MONTHLY';
    demandPlans: DemandPlan[];
    constraintSets: ConstraintSet[];
    metrics?: CycleMetrics;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Demand plan for a specific product
 */
export interface DemandPlan {
    planId: string;
    cycleId: string;
    productId: string;
    sku: string;
    demandPattern: DemandPatternType;
    baselineForecasts: number[];
    seasonalFactors: number[];
    trendComponent: number;
    irregularComponent: number;
    confidenceInterval: number;
    safetyStock: number;
    reorderPoint: number;
    economicOrderQuantity: number;
    minOrderQuantity: number;
    maxOrderQuantity: number;
    replenishmentStrategy: ReplenishmentStrategy;
    leadTime: number;
    serviceLevel: number;
    metadata?: Record<string, any>;
}
/**
 * Demand forecast with details
 */
export interface DemandForecast {
    forecastId: string;
    productId: string;
    period: string;
    forecastQuantity: number;
    lowerConfidenceBound: number;
    upperConfidenceBound: number;
    method: 'EXPONENTIAL_SMOOTHING' | 'ARIMA' | 'REGRESSION' | 'SEASONAL_DECOMPOSITION';
    mape: number;
    rmse: number;
}
/**
 * Safety stock calculation result
 */
export interface SafetyStockCalculation {
    productId: string;
    safetyStock: number;
    serviceLevel: number;
    zScore: number;
    demandStdDev: number;
    leadTimeStdDev: number;
    reorderPoint: number;
    maxStockLevel: number;
}
/**
 * Replenishment order plan
 */
export interface ReplenishmentOrder {
    orderId: string;
    planId: string;
    productId: string;
    supplierSupplierId: string;
    suggestedOrderQuantity: number;
    suggestedOrderDate: Date;
    suggestedDeliveryDate: Date;
    priority: 'HIGH' | 'NORMAL' | 'LOW';
    status: 'SUGGESTED' | 'APPROVED' | 'RELEASED' | 'RECEIVED';
    constraints?: ConstraintViolation[];
}
/**
 * Constraint definition
 */
export interface ConstraintSet {
    constraintId: string;
    cycleId: string;
    constraintType: 'CAPACITY' | 'BUDGET' | 'STORAGE' | 'SUPPLIER' | 'LEAD_TIME';
    productId?: string;
    supplierId?: string;
    minValue?: number;
    maxValue?: number;
    penalty?: number;
    priority: 'HARD' | 'SOFT';
    metadata?: Record<string, any>;
}
/**
 * Constraint violation
 */
export interface ConstraintViolation {
    constraintId: string;
    violationType: string;
    severity: 'WARNING' | 'ERROR';
    violationAmount: number;
    suggestedAdjustment?: number;
}
/**
 * Cycle metrics and KPIs
 */
export interface CycleMetrics {
    cycleId: string;
    totalForecastedDemand: number;
    totalPlannedInventory: number;
    totalSafetyStock: number;
    planningServiceLevel: number;
    inventoryTurnover: number;
    orderCycleTime: number;
    forecastAccuracy: number;
    constraintViolations: number;
}
/**
 * Demand pattern analysis result
 */
export interface DemandPatternAnalysis {
    productId: string;
    patternType: DemandPatternType;
    mean: number;
    stdDev: number;
    coefficient: number;
    trend: number;
    seasonalityStrength: number;
    autocorrelation: number[];
}
/**
 * 1. Creates a new planning cycle for demand planning.
 *
 * @param {Partial<PlanningCycle>} config - Cycle configuration
 * @returns {PlanningCycle} New planning cycle
 *
 * @example
 * ```typescript
 * const cycle = createPlanningCycle({
 *   cycleName: 'Q1-2024-Planning',
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-03-31'),
 *   planningHorizon: 90,
 *   aggregationLevel: 'WEEKLY'
 * });
 * ```
 */
export declare function createPlanningCycle(config: Partial<PlanningCycle>): PlanningCycle;
/**
 * 2. Adds a demand plan to a planning cycle.
 *
 * @param {PlanningCycle} cycle - Planning cycle
 * @param {Partial<DemandPlan>} plan - Demand plan details
 * @returns {PlanningCycle} Updated cycle
 */
export declare function addDemandPlan(cycle: PlanningCycle, plan: Partial<DemandPlan>): PlanningCycle;
/**
 * 3. Updates planning cycle status and transitions to next phase.
 *
 * @param {PlanningCycle} cycle - Planning cycle
 * @param {PlanningCycleStatus} newStatus - New status
 * @returns {PlanningCycle} Updated cycle
 */
export declare function updateCycleStatus(cycle: PlanningCycle, newStatus: PlanningCycleStatus): PlanningCycle;
/**
 * 4. Calculates key metrics for a planning cycle.
 *
 * @param {PlanningCycle} cycle - Planning cycle
 * @returns {CycleMetrics} Calculated metrics
 */
export declare function calculateCycleMetrics(cycle: PlanningCycle): CycleMetrics;
/**
 * 5. Retrieves planning cycle with Sequelize query optimization.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {string} cycleId - Cycle ID
 * @returns {any} Sequelize query
 */
export declare function queryPlanningCycleOptimized(sequelize: any, cycleId: string): any;
/**
 * 6. Bulk loads demand plans into a cycle.
 *
 * @param {PlanningCycle} cycle - Planning cycle
 * @param {Partial<DemandPlan>[]} plans - Multiple demand plans
 * @returns {PlanningCycle} Updated cycle
 */
export declare function bulkAddDemandPlans(cycle: PlanningCycle, plans: Partial<DemandPlan>[]): PlanningCycle;
/**
 * 7. Clones a planning cycle for incremental planning.
 *
 * @param {PlanningCycle} sourceCycle - Source cycle to clone
 * @param {Partial<PlanningCycle>} updates - Updates to apply
 * @returns {PlanningCycle} Cloned cycle
 */
export declare function clonePlanningCycle(sourceCycle: PlanningCycle, updates?: Partial<PlanningCycle>): PlanningCycle;
/**
 * 8. Validates planning cycle completeness and consistency.
 *
 * @param {PlanningCycle} cycle - Cycle to validate
 * @returns {Object} Validation result with errors and warnings
 */
export declare function validatePlanningCycle(cycle: PlanningCycle): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
};
/**
 * 9. Analyzes demand pattern and classifies it.
 *
 * @param {number[]} historicalDemand - Historical demand data
 * @param {number} periods - Number of periods to analyze
 * @returns {DemandPatternAnalysis} Pattern analysis result
 */
export declare function analyzeDemandPattern(historicalDemand: number[], periods?: number): DemandPatternAnalysis;
/**
 * 10. Generates demand forecast using exponential smoothing.
 *
 * @param {number[]} historicalDemand - Historical data
 * @param {number} alpha - Smoothing factor (0-1)
 * @param {number} periods - Number of periods to forecast
 * @returns {DemandForecast[]} Forecasts
 */
export declare function forecastDemandExponentialSmoothing(historicalDemand: number[], alpha?: number, periods?: number): DemandForecast[];
/**
 * 11. Calculates seasonal indices for decomposition.
 *
 * @param {number[]} historicalDemand - Historical data
 * @param {number} seasonLength - Length of seasonal pattern (12 for monthly)
 * @returns {number[]} Seasonal indices
 */
export declare function calculateSeasonalIndices(historicalDemand: number[], seasonLength?: number): number[];
/**
 * 12. Performs seasonal decomposition using additive model.
 *
 * @param {number[]} series - Time series data
 * @param {number} seasonLength - Seasonal period length
 * @returns {Object} Components (trend, seasonal, irregular)
 */
export declare function seasonalDecompose(series: number[], seasonLength?: number): {
    trend: number[];
    seasonal: number[];
    irregular: number[];
};
/**
 * 13. Generates ARIMA-like forecast using differencing and smoothing.
 *
 * @param {number[]} historicalDemand - Historical demand
 * @param {number} d - Differencing order
 * @param {number} periods - Forecast periods
 * @returns {DemandForecast[]} ARIMA-style forecasts
 */
export declare function forecastDemandARIMA(historicalDemand: number[], d?: number, periods?: number): DemandForecast[];
/**
 * 14. Calculates forecast accuracy metrics (MAPE and RMSE).
 *
 * @param {number[]} actual - Actual demand
 * @param {number[]} forecast - Forecasted demand
 * @returns {Object} Accuracy metrics
 */
export declare function calculateForecastAccuracy(actual: number[], forecast: number[]): {
    mape: number;
    rmse: number;
    mae: number;
};
/**
 * 15. Analyzes demand volatility and coefficient of variation.
 *
 * @param {number[]} historicalDemand - Historical demand data
 * @param {number} windowSize - Rolling window size
 * @returns {Object} Volatility metrics
 */
export declare function analyzeDemandVolatility(historicalDemand: number[], windowSize?: number): {
    currentVolatility: number;
    avgVolatility: number;
    volatilityTrend: string;
};
/**
 * 16. Generates collaborative forecast combining multiple methods.
 *
 * @param {number[]} historicalDemand - Historical data
 * @param {number} periods - Forecast periods
 * @returns {DemandForecast[]} Ensemble forecasts
 */
export declare function generateEnsembleForecast(historicalDemand: number[], periods?: number): DemandForecast[];
/**
 * 17. Calculates safety stock using service level approach.
 *
 * @param {number} demandMean - Mean demand
 * @param {number} demandStdDev - Standard deviation of demand
 * @param {number} leadTime - Lead time in days
 * @param {number} serviceLevel - Service level (0-1)
 * @returns {SafetyStockCalculation} Safety stock result
 */
export declare function calculateSafetyStock(demandMean: number, demandStdDev: number, leadTime: number, serviceLevel?: number): SafetyStockCalculation;
/**
 * 18. Optimizes safety stock level balancing service and cost.
 *
 * @param {number} demandMean - Mean demand
 * @param {number} demandStdDev - Standard deviation
 * @param {number} leadTime - Lead time days
 * @param {number} holdingCost - Annual holding cost per unit
 * @param {number} stockoutCost - Cost per stockout event
 * @returns {Object} Optimized safety stock
 */
export declare function optimizeSafetyStock(demandMean: number, demandStdDev: number, leadTime: number, holdingCost?: number, stockoutCost?: number): {
    safetyStock: number;
    serviceLevel: number;
    totalCost: number;
};
/**
 * 19. Calculates reorder point with demand variability.
 *
 * @param {number} avgDemand - Average daily demand
 * @param {number} leadTime - Lead time in days
 * @param {number} safetyStock - Safety stock level
 * @returns {number} Reorder point
 */
export declare function calculateReorderPoint(avgDemand: number, leadTime: number, safetyStock: number): number;
/**
 * 20. Determines maximum inventory level.
 *
 * @param {number} reorderPoint - Reorder point
 * @param {number} orderQuantity - Order quantity (EOQ)
 * @returns {number} Maximum inventory level
 */
export declare function calculateMaxInventoryLevel(reorderPoint: number, orderQuantity: number): number;
/**
 * 21. Calculates order point with probabilistic demand.
 *
 * @param {number} dailyDemandMean - Mean daily demand
 * @param {number} dailyDemandStdDev - Standard deviation
 * @param {number} leadTime - Lead time days
 * @param {number} serviceLevel - Service level (0-1)
 * @returns {number} Probabilistic reorder point
 */
export declare function calculateProbabilisticReorderPoint(dailyDemandMean: number, dailyDemandStdDev: number, leadTime: number, serviceLevel?: number): number;
/**
 * 22. Optimizes safety stock across multiple SKUs with budget constraint.
 *
 * @param {Array} skus - Array of SKU configurations
 * @param {number} budgetLimit - Total budget for safety stock
 * @returns {Array} Optimized allocation
 */
export declare function optimizeMultiSKUSafetyStock(skus: Array<{
    productId: string;
    demandMean: number;
    demandStdDev: number;
    leadTime: number;
    holdingCost: number;
    stockoutCost: number;
}>, budgetLimit: number): Array<{
    productId: string;
    safetyStock: number;
    serviceLevel: number;
}>;
/**
 * 23. Calculates minimum and maximum stock levels for two-bin system.
 *
 * @param {number} averageDemand - Average demand per period
 * @param {number} leadTime - Lead time periods
 * @param {number} reviewPeriod - Review period length
 * @param {number} safetyFactor - Safety factor multiplier
 * @returns {Object} Two-bin levels
 */
export declare function calculateTwoBinLevels(averageDemand: number, leadTime: number, reviewPeriod: number, safetyFactor?: number): {
    maxLevel: number;
    minLevel: number;
    binSize: number;
};
/**
 * 24. Validates safety stock parameters for consistency.
 *
 * @param {SafetyStockCalculation} calc - Calculation result
 * @returns {boolean} Is valid
 */
export declare function validateSafetyStockParameters(calc: SafetyStockCalculation): boolean;
/**
 * 25. Adjusts safety stock based on demand forecast updates.
 *
 * @param {SafetyStockCalculation} current - Current calculation
 * @param {number} newDemandStdDev - Updated demand std dev
 * @param {number} newLeadTime - Updated lead time
 * @returns {SafetyStockCalculation} Adjusted calculation
 */
export declare function adjustSafetyStockForUpdate(current: SafetyStockCalculation, newDemandStdDev: number, newLeadTime: number): SafetyStockCalculation;
/**
 * 26. Calculates Economic Order Quantity (EOQ).
 *
 * @param {number} demand - Annual demand
 * @param {number} orderingCost - Cost per order
 * @param {number} holdingCost - Holding cost per unit per year
 * @returns {number} Optimal order quantity
 */
export declare function calculateEOQ(demand: number, orderingCost?: number, holdingCost?: number): number;
/**
 * 27. Determines optimal replenishment order quantity.
 *
 * @param {DemandPlan} plan - Demand plan
 * @param {number} orderingCost - Cost per order
 * @param {number} holdingCost - Holding cost per unit
 * @returns {number} Recommended order quantity
 */
export declare function calculateOptimalOrderQuantity(plan: DemandPlan, orderingCost?: number, holdingCost?: number): number;
/**
 * 28. Generates replenishment schedule for entire planning horizon.
 *
 * @param {DemandPlan} plan - Demand plan
 * @param {Date} startDate - Planning start date
 * @returns {ReplenishmentOrder[]} Suggested orders
 */
export declare function generateReplenishmentSchedule(plan: DemandPlan, startDate: Date): ReplenishmentOrder[];
/**
 * 29. Calculates total replenishment cost for a plan.
 *
 * @param {DemandPlan} plan - Demand plan
 * @param {number} orderingCost - Cost per order
 * @param {number} holdingCost - Holding cost per unit per period
 * @returns {Object} Cost breakdown
 */
export declare function calculateReplenishmentCost(plan: DemandPlan, orderingCost?: number, holdingCost?: number): {
    annualOrderingCost: number;
    annualHoldingCost: number;
    totalAnnualCost: number;
};
/**
 * 30. Implements MRP-style replenishment with BOM explosion.
 *
 * @param {DemandPlan} parentPlan - Parent product demand plan
 * @param {Array} bomItems - Bill of Materials items
 * @returns {ReplenishmentOrder[]} Replenishment orders for BOM
 */
export declare function calculateMRPReplenishment(parentPlan: DemandPlan, bomItems: Array<{
    componentId: string;
    quantity: number;
}>): ReplenishmentOrder[];
/**
 * 31. Consolidates multiple SKU orders for bulk ordering discounts.
 *
 * @param {ReplenishmentOrder[]} orders - Individual orders
 * @param {string} supplierId - Supplier ID
 * @returns {Object} Consolidated order with discount potential
 */
export declare function consolidateOrdersForBulkDiscount(orders: ReplenishmentOrder[], supplierId: string): {
    totalQuantity: number;
    totalValue: number;
    discountPercentage: number;
    discountedValue: number;
};
/**
 * 32. Calculates order timing to balance cash flow and service.
 *
 * @param {DemandPlan[]} plans - Array of demand plans
 * @param {number} cashFlowLimit - Maximum order value per period
 * @returns {Object} Optimized order schedule
 */
export declare function optimizeOrderTiming(plans: DemandPlan[], cashFlowLimit?: number): {
    totalOrders: number;
    avgOrderValue: number;
    cashFlowCompliance: boolean;
};
/**
 * 33. Performs supply chain network optimization for multi-echelon replenishment.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {string} cycleId - Planning cycle ID
 * @returns {any} Optimization query
 */
export declare function optimizeMultiEhelonNetwork(sequelize: any, cycleId: string): any;
/**
 * 34. Adds a capacity constraint to planning cycle.
 *
 * @param {PlanningCycle} cycle - Planning cycle
 * @param {Partial<ConstraintSet>} constraint - Constraint details
 * @returns {PlanningCycle} Updated cycle
 */
export declare function addCapacityConstraint(cycle: PlanningCycle, constraint: Partial<ConstraintSet>): PlanningCycle;
/**
 * 35. Adds a budget constraint for total replenishment spending.
 *
 * @param {PlanningCycle} cycle - Planning cycle
 * @param {number} maxBudget - Maximum budget
 * @param {string} priority - Constraint priority
 * @returns {PlanningCycle} Updated cycle
 */
export declare function addBudgetConstraint(cycle: PlanningCycle, maxBudget: number, priority?: 'HARD' | 'SOFT'): PlanningCycle;
/**
 * 36. Adds storage/warehouse capacity constraint.
 *
 * @param {PlanningCycle} cycle - Planning cycle
 * @param {number} maxStorageUnits - Maximum units that can be stored
 * @returns {PlanningCycle} Updated cycle
 */
export declare function addStorageConstraint(cycle: PlanningCycle, maxStorageUnits: number): PlanningCycle;
/**
 * 37. Checks replenishment orders against all constraints.
 *
 * @param {ReplenishmentOrder[]} orders - Replenishment orders
 * @param {ConstraintSet[]} constraints - Active constraints
 * @returns {Object} Constraint validation result
 */
export declare function validateOrdersAgainstConstraints(orders: ReplenishmentOrder[], constraints: ConstraintSet[]): {
    isValid: boolean;
    violations: Array<{
        orderId: string;
        violations: ConstraintViolation[];
    }>;
};
/**
 * 38. Calculates constraint violation penalties for optimization.
 *
 * @param {Array} violations - Constraint violations
 * @param {ConstraintSet[]} constraints - Constraints
 * @returns {number} Total penalty cost
 */
export declare function calculateConstraintPenalty(violations: ConstraintViolation[], constraints: ConstraintSet[]): number;
/**
 * 39. Optimizes orders to minimize constraint violations.
 *
 * @param {ReplenishmentOrder[]} orders - Orders to optimize
 * @param {ConstraintSet[]} constraints - Active constraints
 * @returns {ReplenishmentOrder[]} Optimized orders
 */
export declare function optimizeOrdersForConstraints(orders: ReplenishmentOrder[], constraints: ConstraintSet[]): ReplenishmentOrder[];
/**
 * 40. Queries supplier constraints from database with optimization.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {string} supplierId - Supplier ID
 * @returns {any} Optimization query
 */
export declare function querySupplierConstraints(sequelize: any, supplierId: string): any;
/**
 * 41. Performs constraint-aware demand-supply balancing optimization.
 *
 * @param {DemandPlan[]} plans - Demand plans
 * @param {ConstraintSet[]} constraints - Constraints
 * @returns {Object} Balanced and optimized supply plan
 */
export declare function balanceDemandSupplyWithConstraints(plans: DemandPlan[], constraints: ConstraintSet[]): {
    feasible: boolean;
    totalDemand: number;
    totalCapacity: number;
    balancePercentage: number;
    recommendedAdjustments: string[];
};
declare const _default: {
    createPlanningCycle: typeof createPlanningCycle;
    addDemandPlan: typeof addDemandPlan;
    updateCycleStatus: typeof updateCycleStatus;
    calculateCycleMetrics: typeof calculateCycleMetrics;
    queryPlanningCycleOptimized: typeof queryPlanningCycleOptimized;
    bulkAddDemandPlans: typeof bulkAddDemandPlans;
    clonePlanningCycle: typeof clonePlanningCycle;
    validatePlanningCycle: typeof validatePlanningCycle;
    analyzeDemandPattern: typeof analyzeDemandPattern;
    forecastDemandExponentialSmoothing: typeof forecastDemandExponentialSmoothing;
    calculateSeasonalIndices: typeof calculateSeasonalIndices;
    seasonalDecompose: typeof seasonalDecompose;
    forecastDemandARIMA: typeof forecastDemandARIMA;
    calculateForecastAccuracy: typeof calculateForecastAccuracy;
    analyzeDemandVolatility: typeof analyzeDemandVolatility;
    generateEnsembleForecast: typeof generateEnsembleForecast;
    calculateSafetyStock: typeof calculateSafetyStock;
    optimizeSafetyStock: typeof optimizeSafetyStock;
    calculateReorderPoint: typeof calculateReorderPoint;
    calculateMaxInventoryLevel: typeof calculateMaxInventoryLevel;
    calculateProbabilisticReorderPoint: typeof calculateProbabilisticReorderPoint;
    optimizeMultiSKUSafetyStock: typeof optimizeMultiSKUSafetyStock;
    calculateTwoBinLevels: typeof calculateTwoBinLevels;
    validateSafetyStockParameters: typeof validateSafetyStockParameters;
    adjustSafetyStockForUpdate: typeof adjustSafetyStockForUpdate;
    calculateEOQ: typeof calculateEOQ;
    calculateOptimalOrderQuantity: typeof calculateOptimalOrderQuantity;
    generateReplenishmentSchedule: typeof generateReplenishmentSchedule;
    calculateReplenishmentCost: typeof calculateReplenishmentCost;
    calculateMRPReplenishment: typeof calculateMRPReplenishment;
    consolidateOrdersForBulkDiscount: typeof consolidateOrdersForBulkDiscount;
    optimizeOrderTiming: typeof optimizeOrderTiming;
    optimizeMultiEhelonNetwork: typeof optimizeMultiEhelonNetwork;
    addCapacityConstraint: typeof addCapacityConstraint;
    addBudgetConstraint: typeof addBudgetConstraint;
    addStorageConstraint: typeof addStorageConstraint;
    validateOrdersAgainstConstraints: typeof validateOrdersAgainstConstraints;
    calculateConstraintPenalty: typeof calculateConstraintPenalty;
    optimizeOrdersForConstraints: typeof optimizeOrdersForConstraints;
    querySupplierConstraints: typeof querySupplierConstraints;
    balanceDemandSupplyWithConstraints: typeof balanceDemandSupplyWithConstraints;
};
export default _default;
//# sourceMappingURL=demand-planning-optimization-kit.d.ts.map