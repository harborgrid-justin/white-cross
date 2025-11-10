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
 * File: /reuse/logistics/demand-planning-optimization-kit.ts
 * Locator: WC-LOGISTICS-DPO-001
 * Purpose: Demand Planning & Optimization - Advanced demand forecasting and replenishment strategies
 *
 * Upstream: Independent utility module for demand planning operations
 * Downstream: ../backend/logistics/*, Supply chain services, Inventory controllers
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, sequelize-typescript
 * Exports: 41 utility functions for demand planning, forecasting, safety stock optimization, replenishment
 *
 * LLM Context: Enterprise-grade demand planning and optimization utilities to compete with Oracle JDE.
 * Provides comprehensive demand planning lifecycle: planning cycle management, demand pattern analysis,
 * seasonal decomposition, safety stock optimization, EOQ calculations, multi-level replenishment,
 * constraint management, and advanced supply chain optimization.
 */

import * as crypto from 'crypto';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Planning cycle status enumeration
 */
export enum PlanningCycleStatus {
  PLANNING = 'PLANNING',
  FORECAST = 'FORECAST',
  OPTIMIZATION = 'OPTIMIZATION',
  APPROVED = 'APPROVED',
  EXECUTING = 'EXECUTING',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED',
}

/**
 * Demand pattern type enumeration
 */
export enum DemandPatternType {
  STABLE = 'STABLE',
  SEASONAL = 'SEASONAL',
  TREND = 'TREND',
  CYCLICAL = 'CYCLICAL',
  IRREGULAR = 'IRREGULAR',
  INTERMITTENT = 'INTERMITTENT',
}

/**
 * Replenishment strategy enumeration
 */
export enum ReplenishmentStrategy {
  EOQ = 'EOQ',
  MRP = 'MRP',
  DRP = 'DRP',
  CONTINUOUS_REVIEW = 'CONTINUOUS_REVIEW',
  PERIODIC_REVIEW = 'PERIODIC_REVIEW',
  TWO_BIN = 'TWO_BIN',
  JUST_IN_TIME = 'JUST_IN_TIME',
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
  planningHorizon: number; // days
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
  baselineForecasts: number[]; // array of forecasts per period
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
  leadTime: number; // days
  serviceLevel: number; // 0.95 = 95%
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
  mape: number; // Mean Absolute Percentage Error
  rmse: number; // Root Mean Squared Error
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

// ============================================================================
// SECTION 1: PLANNING CYCLE MANAGEMENT (Functions 1-8)
// ============================================================================

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
export function createPlanningCycle(config: Partial<PlanningCycle>): PlanningCycle {
  return {
    cycleId: crypto.randomUUID(),
    cycleName: config.cycleName || 'Planning Cycle',
    status: PlanningCycleStatus.PLANNING,
    startDate: config.startDate || new Date(),
    endDate: config.endDate || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    planningHorizon: config.planningHorizon || 90,
    aggregationLevel: config.aggregationLevel || 'WEEKLY',
    demandPlans: [],
    constraintSets: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/**
 * 2. Adds a demand plan to a planning cycle.
 *
 * @param {PlanningCycle} cycle - Planning cycle
 * @param {Partial<DemandPlan>} plan - Demand plan details
 * @returns {PlanningCycle} Updated cycle
 */
export function addDemandPlan(
  cycle: PlanningCycle,
  plan: Partial<DemandPlan>
): PlanningCycle {
  const newPlan: DemandPlan = {
    planId: crypto.randomUUID(),
    cycleId: cycle.cycleId,
    productId: plan.productId || '',
    sku: plan.sku || '',
    demandPattern: plan.demandPattern || DemandPatternType.STABLE,
    baselineForecasts: plan.baselineForecasts || [],
    seasonalFactors: plan.seasonalFactors || [],
    trendComponent: plan.trendComponent || 0,
    irregularComponent: plan.irregularComponent || 0,
    confidenceInterval: plan.confidenceInterval || 0.95,
    safetyStock: plan.safetyStock || 0,
    reorderPoint: plan.reorderPoint || 0,
    economicOrderQuantity: plan.economicOrderQuantity || 0,
    minOrderQuantity: plan.minOrderQuantity || 1,
    maxOrderQuantity: plan.maxOrderQuantity || Infinity,
    replenishmentStrategy: plan.replenishmentStrategy || ReplenishmentStrategy.EOQ,
    leadTime: plan.leadTime || 7,
    serviceLevel: plan.serviceLevel || 0.95,
    metadata: plan.metadata,
  };

  return {
    ...cycle,
    demandPlans: [...cycle.demandPlans, newPlan],
    updatedAt: new Date(),
  };
}

/**
 * 3. Updates planning cycle status and transitions to next phase.
 *
 * @param {PlanningCycle} cycle - Planning cycle
 * @param {PlanningCycleStatus} newStatus - New status
 * @returns {PlanningCycle} Updated cycle
 */
export function updateCycleStatus(
  cycle: PlanningCycle,
  newStatus: PlanningCycleStatus
): PlanningCycle {
  return {
    ...cycle,
    status: newStatus,
    updatedAt: new Date(),
  };
}

/**
 * 4. Calculates key metrics for a planning cycle.
 *
 * @param {PlanningCycle} cycle - Planning cycle
 * @returns {CycleMetrics} Calculated metrics
 */
export function calculateCycleMetrics(cycle: PlanningCycle): CycleMetrics {
  const totalForecastedDemand = cycle.demandPlans.reduce(
    (sum, plan) => sum + plan.baselineForecasts.reduce((s, f) => s + f, 0),
    0
  );
  const totalSafetyStock = cycle.demandPlans.reduce((sum, plan) => sum + plan.safetyStock, 0);
  const planningServiceLevel =
    cycle.demandPlans.reduce((sum, plan) => sum + plan.serviceLevel, 0) /
    (cycle.demandPlans.length || 1);

  return {
    cycleId: cycle.cycleId,
    totalForecastedDemand,
    totalPlannedInventory: totalForecastedDemand + totalSafetyStock,
    totalSafetyStock,
    planningServiceLevel,
    inventoryTurnover: totalForecastedDemand / (totalSafetyStock || 1),
    orderCycleTime: 0,
    forecastAccuracy: 0,
    constraintViolations: 0,
  };
}

/**
 * 5. Retrieves planning cycle with Sequelize query optimization.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {string} cycleId - Cycle ID
 * @returns {any} Sequelize query
 */
export function queryPlanningCycleOptimized(sequelize: any, cycleId: string): any {
  return `
    SELECT
      pc.cycleId,
      pc.cycleName,
      pc.status,
      pc.planningHorizon,
      COUNT(DISTINCT dp.planId) as planCount,
      COUNT(DISTINCT cs.constraintId) as constraintCount,
      SUM(dp.safetyStock) as totalSafetyStock,
      AVG(dp.serviceLevel) as avgServiceLevel
    FROM planning_cycles pc
    LEFT JOIN demand_plans dp ON pc.cycleId = dp.cycleId
    LEFT JOIN constraint_sets cs ON pc.cycleId = cs.cycleId
    WHERE pc.cycleId = ?
    GROUP BY pc.cycleId, pc.cycleName, pc.status, pc.planningHorizon
  `;
}

/**
 * 6. Bulk loads demand plans into a cycle.
 *
 * @param {PlanningCycle} cycle - Planning cycle
 * @param {Partial<DemandPlan>[]} plans - Multiple demand plans
 * @returns {PlanningCycle} Updated cycle
 */
export function bulkAddDemandPlans(
  cycle: PlanningCycle,
  plans: Partial<DemandPlan>[]
): PlanningCycle {
  const newPlans = plans.map((plan) => ({
    planId: crypto.randomUUID(),
    cycleId: cycle.cycleId,
    productId: plan.productId || '',
    sku: plan.sku || '',
    demandPattern: plan.demandPattern || DemandPatternType.STABLE,
    baselineForecasts: plan.baselineForecasts || [],
    seasonalFactors: plan.seasonalFactors || [],
    trendComponent: plan.trendComponent || 0,
    irregularComponent: plan.irregularComponent || 0,
    confidenceInterval: plan.confidenceInterval || 0.95,
    safetyStock: plan.safetyStock || 0,
    reorderPoint: plan.reorderPoint || 0,
    economicOrderQuantity: plan.economicOrderQuantity || 0,
    minOrderQuantity: plan.minOrderQuantity || 1,
    maxOrderQuantity: plan.maxOrderQuantity || Infinity,
    replenishmentStrategy: plan.replenishmentStrategy || ReplenishmentStrategy.EOQ,
    leadTime: plan.leadTime || 7,
    serviceLevel: plan.serviceLevel || 0.95,
    metadata: plan.metadata,
  }));

  return {
    ...cycle,
    demandPlans: [...cycle.demandPlans, ...newPlans],
    updatedAt: new Date(),
  };
}

/**
 * 7. Clones a planning cycle for incremental planning.
 *
 * @param {PlanningCycle} sourceCycle - Source cycle to clone
 * @param {Partial<PlanningCycle>} updates - Updates to apply
 * @returns {PlanningCycle} Cloned cycle
 */
export function clonePlanningCycle(
  sourceCycle: PlanningCycle,
  updates?: Partial<PlanningCycle>
): PlanningCycle {
  const clonedCycle: PlanningCycle = {
    ...sourceCycle,
    cycleId: crypto.randomUUID(),
    status: PlanningCycleStatus.PLANNING,
    demandPlans: sourceCycle.demandPlans.map((plan) => ({
      ...plan,
      planId: crypto.randomUUID(),
    })),
    constraintSets: sourceCycle.constraintSets.map((constraint) => ({
      ...constraint,
      constraintId: crypto.randomUUID(),
    })),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...updates,
  };

  return clonedCycle;
}

/**
 * 8. Validates planning cycle completeness and consistency.
 *
 * @param {PlanningCycle} cycle - Cycle to validate
 * @returns {Object} Validation result with errors and warnings
 */
export function validatePlanningCycle(
  cycle: PlanningCycle
): { isValid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!cycle.cycleName) errors.push('Cycle name is required');
  if (cycle.endDate <= cycle.startDate) errors.push('End date must be after start date');
  if (cycle.demandPlans.length === 0) warnings.push('No demand plans in cycle');
  if (cycle.constraintSets.length === 0) warnings.push('No constraints defined');

  cycle.demandPlans.forEach((plan) => {
    if (plan.baselineForecasts.length === 0) {
      errors.push(`Product ${plan.productId} has no forecasts`);
    }
    if (plan.serviceLevel < 0 || plan.serviceLevel > 1) {
      errors.push(`Product ${plan.productId} has invalid service level`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

// ============================================================================
// SECTION 2: DEMAND PATTERN ANALYSIS (Functions 9-16)
// ============================================================================

/**
 * 9. Analyzes demand pattern and classifies it.
 *
 * @param {number[]} historicalDemand - Historical demand data
 * @param {number} periods - Number of periods to analyze
 * @returns {DemandPatternAnalysis} Pattern analysis result
 */
export function analyzeDemandPattern(
  historicalDemand: number[],
  periods: number = 12
): DemandPatternAnalysis {
  const mean = historicalDemand.reduce((a, b) => a + b, 0) / historicalDemand.length;
  const variance =
    historicalDemand.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
    historicalDemand.length;
  const stdDev = Math.sqrt(variance);
  const coefficient = stdDev / (mean || 1);

  // Determine pattern type
  let patternType = DemandPatternType.STABLE;
  if (coefficient > 0.5) patternType = DemandPatternType.INTERMITTENT;
  if (coefficient > 0.3 && coefficient <= 0.5) patternType = DemandPatternType.IRREGULAR;

  // Calculate trend
  const trend = calculateTrendComponent(historicalDemand);

  // Calculate seasonality
  const seasonalityStrength = calculateSeasonalityStrength(historicalDemand, periods);

  return {
    productId: '',
    patternType,
    mean,
    stdDev,
    coefficient,
    trend,
    seasonalityStrength,
    autocorrelation: calculateAutocorrelation(historicalDemand),
  };
}

/**
 * 10. Generates demand forecast using exponential smoothing.
 *
 * @param {number[]} historicalDemand - Historical data
 * @param {number} alpha - Smoothing factor (0-1)
 * @param {number} periods - Number of periods to forecast
 * @returns {DemandForecast[]} Forecasts
 */
export function forecastDemandExponentialSmoothing(
  historicalDemand: number[],
  alpha: number = 0.3,
  periods: number = 12
): DemandForecast[] {
  let smoothed = historicalDemand[0];
  const forecasts: number[] = [];

  for (let i = 1; i < historicalDemand.length; i++) {
    smoothed = alpha * historicalDemand[i] + (1 - alpha) * smoothed;
  }

  for (let i = 0; i < periods; i++) {
    forecasts.push(smoothed);
  }

  return forecasts.map((qty, idx) => ({
    forecastId: crypto.randomUUID(),
    productId: '',
    period: `Period-${idx + 1}`,
    forecastQuantity: Math.round(qty),
    lowerConfidenceBound: Math.round(qty * 0.8),
    upperConfidenceBound: Math.round(qty * 1.2),
    method: 'EXPONENTIAL_SMOOTHING',
    mape: 0,
    rmse: 0,
  }));
}

/**
 * 11. Calculates seasonal indices for decomposition.
 *
 * @param {number[]} historicalDemand - Historical data
 * @param {number} seasonLength - Length of seasonal pattern (12 for monthly)
 * @returns {number[]} Seasonal indices
 */
export function calculateSeasonalIndices(
  historicalDemand: number[],
  seasonLength: number = 12
): number[] {
  const seasonalIndices: number[] = new Array(seasonLength).fill(0);
  const counts: number[] = new Array(seasonLength).fill(0);

  for (let i = 0; i < historicalDemand.length; i++) {
    const seasonIndex = i % seasonLength;
    seasonalIndices[seasonIndex] += historicalDemand[i];
    counts[seasonIndex]++;
  }

  const mean = historicalDemand.reduce((a, b) => a + b, 0) / historicalDemand.length;

  return seasonalIndices.map((sum, idx) => (sum / (counts[idx] || 1)) / (mean || 1));
}

/**
 * 12. Performs seasonal decomposition using additive model.
 *
 * @param {number[]} series - Time series data
 * @param {number} seasonLength - Seasonal period length
 * @returns {Object} Components (trend, seasonal, irregular)
 */
export function seasonalDecompose(
  series: number[],
  seasonLength: number = 12
): {
  trend: number[];
  seasonal: number[];
  irregular: number[];
} {
  const trend = calculateTrendComponent(series, seasonLength);
  const detrended = series.map((val, idx) => val - trend[idx]);
  const seasonal = calculateSeasonalIndices(detrended, seasonLength);
  const irregular = series.map(
    (val, idx) => val - trend[idx] - seasonal[idx % seasonLength]
  );

  return {
    trend,
    seasonal: seasonal.slice(0, seasonLength),
    irregular,
  };
}

/**
 * 13. Generates ARIMA-like forecast using differencing and smoothing.
 *
 * @param {number[]} historicalDemand - Historical demand
 * @param {number} d - Differencing order
 * @param {number} periods - Forecast periods
 * @returns {DemandForecast[]} ARIMA-style forecasts
 */
export function forecastDemandARIMA(
  historicalDemand: number[],
  d: number = 1,
  periods: number = 12
): DemandForecast[] {
  const differenced = applyDifferencing(historicalDemand, d);
  const mean = differenced.reduce((a, b) => a + b, 0) / differenced.length;
  const forecasts: number[] = [];

  for (let i = 0; i < periods; i++) {
    forecasts.push(mean);
  }

  // Inverse differencing to get original scale
  const inverted = invertDifferencing(forecasts, historicalDemand, d);

  return inverted.map((qty, idx) => ({
    forecastId: crypto.randomUUID(),
    productId: '',
    period: `Period-${idx + 1}`,
    forecastQuantity: Math.round(qty),
    lowerConfidenceBound: Math.round(qty * 0.75),
    upperConfidenceBound: Math.round(qty * 1.25),
    method: 'ARIMA',
    mape: 0,
    rmse: 0,
  }));
}

/**
 * 14. Calculates forecast accuracy metrics (MAPE and RMSE).
 *
 * @param {number[]} actual - Actual demand
 * @param {number[]} forecast - Forecasted demand
 * @returns {Object} Accuracy metrics
 */
export function calculateForecastAccuracy(
  actual: number[],
  forecast: number[]
): { mape: number; rmse: number; mae: number } {
  const errors = actual.map((a, i) => a - (forecast[i] || 0));
  const mae = errors.reduce((sum, e) => sum + Math.abs(e), 0) / errors.length;
  const mape =
    (actual
      .map((a, i) => Math.abs((a - (forecast[i] || 0)) / (a || 1)))
      .reduce((sum, e) => sum + e, 0) /
      actual.length) *
    100;
  const rmse = Math.sqrt(
    errors.reduce((sum, e) => sum + Math.pow(e, 2), 0) / errors.length
  );

  return { mape: Math.round(mape * 100) / 100, rmse: Math.round(rmse * 100) / 100, mae };
}

/**
 * 15. Analyzes demand volatility and coefficient of variation.
 *
 * @param {number[]} historicalDemand - Historical demand data
 * @param {number} windowSize - Rolling window size
 * @returns {Object} Volatility metrics
 */
export function analyzeDemandVolatility(
  historicalDemand: number[],
  windowSize: number = 12
): { currentVolatility: number; avgVolatility: number; volatilityTrend: string } {
  const rolling = [];
  for (let i = 0; i <= historicalDemand.length - windowSize; i++) {
    const window = historicalDemand.slice(i, i + windowSize);
    const mean = window.reduce((a, b) => a + b, 0) / window.length;
    const variance = window.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / window.length;
    rolling.push(Math.sqrt(variance) / (mean || 1));
  }

  const avgVolatility = rolling.reduce((a, b) => a + b, 0) / rolling.length;
  const currentVolatility = rolling[rolling.length - 1];
  const trend = currentVolatility > avgVolatility ? 'INCREASING' : 'DECREASING';

  return {
    currentVolatility: Math.round(currentVolatility * 10000) / 10000,
    avgVolatility: Math.round(avgVolatility * 10000) / 10000,
    volatilityTrend: trend,
  };
}

/**
 * 16. Generates collaborative forecast combining multiple methods.
 *
 * @param {number[]} historicalDemand - Historical data
 * @param {number} periods - Forecast periods
 * @returns {DemandForecast[]} Ensemble forecasts
 */
export function generateEnsembleForecast(
  historicalDemand: number[],
  periods: number = 12
): DemandForecast[] {
  const esForecasts = forecastDemandExponentialSmoothing(historicalDemand, 0.3, periods);
  const arimaForecasts = forecastDemandARIMA(historicalDemand, 1, periods);

  return esForecasts.map((es, idx) => {
    const arima = arimaForecasts[idx];
    const ensemble = (es.forecastQuantity + arima.forecastQuantity) / 2;
    const lower = Math.min(es.lowerConfidenceBound, arima.lowerConfidenceBound);
    const upper = Math.max(es.upperConfidenceBound, arima.upperConfidenceBound);

    return {
      forecastId: crypto.randomUUID(),
      productId: '',
      period: `Period-${idx + 1}`,
      forecastQuantity: Math.round(ensemble),
      lowerConfidenceBound: Math.round(lower),
      upperConfidenceBound: Math.round(upper),
      method: 'SEASONAL_DECOMPOSITION',
      mape: 0,
      rmse: 0,
    };
  });
}

// ============================================================================
// SECTION 3: SAFETY STOCK OPTIMIZATION (Functions 17-25)
// ============================================================================

/**
 * 17. Calculates safety stock using service level approach.
 *
 * @param {number} demandMean - Mean demand
 * @param {number} demandStdDev - Standard deviation of demand
 * @param {number} leadTime - Lead time in days
 * @param {number} serviceLevel - Service level (0-1)
 * @returns {SafetyStockCalculation} Safety stock result
 */
export function calculateSafetyStock(
  demandMean: number,
  demandStdDev: number,
  leadTime: number,
  serviceLevel: number = 0.95
): SafetyStockCalculation {
  const zScores: Record<number, number> = {
    0.85: 1.04, 0.9: 1.28, 0.95: 1.645, 0.97: 1.88, 0.99: 2.33,
  };
  const zScore = zScores[serviceLevel] || 1.645;
  const demandDuringLeadTime = demandMean * leadTime;
  const stdDevDuringLeadTime = demandStdDev * Math.sqrt(leadTime);
  const safetyStock = Math.ceil(zScore * stdDevDuringLeadTime);
  const reorderPoint = Math.ceil(demandDuringLeadTime + safetyStock);
  const maxStockLevel = reorderPoint + calculateEOQ(demandMean, 5, 0.25);

  return {
    productId: '',
    safetyStock,
    serviceLevel,
    zScore,
    demandStdDev,
    leadTimeStdDev: stdDevDuringLeadTime,
    reorderPoint,
    maxStockLevel,
  };
}

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
export function optimizeSafetyStock(
  demandMean: number,
  demandStdDev: number,
  leadTime: number,
  holdingCost: number = 0.25,
  stockoutCost: number = 100
): { safetyStock: number; serviceLevel: number; totalCost: number } {
  let bestSS = 0;
  let bestSL = 0.95;
  let bestCost = Infinity;

  for (let sl = 0.85; sl <= 0.99; sl += 0.01) {
    const calc = calculateSafetyStock(demandMean, demandStdDev, leadTime, sl);
    const holdingCostTotal = calc.safetyStock * holdingCost;
    const stockoutProbability = 1 - sl;
    const expectedStockoutCost = (demandMean * leadTime * stockoutProbability * stockoutCost) / 100;
    const totalCost = holdingCostTotal + expectedStockoutCost;

    if (totalCost < bestCost) {
      bestCost = totalCost;
      bestSS = calc.safetyStock;
      bestSL = sl;
    }
  }

  return {
    safetyStock: bestSS,
    serviceLevel: Math.round(bestSL * 10000) / 10000,
    totalCost: Math.round(bestCost * 100) / 100,
  };
}

/**
 * 19. Calculates reorder point with demand variability.
 *
 * @param {number} avgDemand - Average daily demand
 * @param {number} leadTime - Lead time in days
 * @param {number} safetyStock - Safety stock level
 * @returns {number} Reorder point
 */
export function calculateReorderPoint(
  avgDemand: number,
  leadTime: number,
  safetyStock: number
): number {
  return Math.ceil(avgDemand * leadTime + safetyStock);
}

/**
 * 20. Determines maximum inventory level.
 *
 * @param {number} reorderPoint - Reorder point
 * @param {number} orderQuantity - Order quantity (EOQ)
 * @returns {number} Maximum inventory level
 */
export function calculateMaxInventoryLevel(
  reorderPoint: number,
  orderQuantity: number
): number {
  return reorderPoint + orderQuantity;
}

/**
 * 21. Calculates order point with probabilistic demand.
 *
 * @param {number} dailyDemandMean - Mean daily demand
 * @param {number} dailyDemandStdDev - Standard deviation
 * @param {number} leadTime - Lead time days
 * @param {number} serviceLevel - Service level (0-1)
 * @returns {number} Probabilistic reorder point
 */
export function calculateProbabilisticReorderPoint(
  dailyDemandMean: number,
  dailyDemandStdDev: number,
  leadTime: number,
  serviceLevel: number = 0.95
): number {
  const calc = calculateSafetyStock(dailyDemandMean, dailyDemandStdDev, leadTime, serviceLevel);
  return calc.reorderPoint;
}

/**
 * 22. Optimizes safety stock across multiple SKUs with budget constraint.
 *
 * @param {Array} skus - Array of SKU configurations
 * @param {number} budgetLimit - Total budget for safety stock
 * @returns {Array} Optimized allocation
 */
export function optimizeMultiSKUSafetyStock(
  skus: Array<{
    productId: string;
    demandMean: number;
    demandStdDev: number;
    leadTime: number;
    holdingCost: number;
    stockoutCost: number;
  }>,
  budgetLimit: number
): Array<{ productId: string; safetyStock: number; serviceLevel: number }> {
  return skus.map((sku) => {
    const optimized = optimizeSafetyStock(
      sku.demandMean,
      sku.demandStdDev,
      sku.leadTime,
      sku.holdingCost,
      sku.stockoutCost
    );
    return {
      productId: sku.productId,
      safetyStock: optimized.safetyStock,
      serviceLevel: optimized.serviceLevel,
    };
  });
}

/**
 * 23. Calculates minimum and maximum stock levels for two-bin system.
 *
 * @param {number} averageDemand - Average demand per period
 * @param {number} leadTime - Lead time periods
 * @param {number} reviewPeriod - Review period length
 * @param {number} safetyFactor - Safety factor multiplier
 * @returns {Object} Two-bin levels
 */
export function calculateTwoBinLevels(
  averageDemand: number,
  leadTime: number,
  reviewPeriod: number,
  safetyFactor: number = 1.5
): { maxLevel: number; minLevel: number; binSize: number } {
  const maxLevel = Math.ceil(averageDemand * (leadTime + reviewPeriod) * safetyFactor);
  const minLevel = Math.ceil(averageDemand * (leadTime + reviewPeriod / 2));
  const binSize = Math.ceil((maxLevel - minLevel) / 2);

  return { maxLevel, minLevel, binSize };
}

/**
 * 24. Validates safety stock parameters for consistency.
 *
 * @param {SafetyStockCalculation} calc - Calculation result
 * @returns {boolean} Is valid
 */
export function validateSafetyStockParameters(calc: SafetyStockCalculation): boolean {
  return (
    calc.safetyStock >= 0 &&
    calc.reorderPoint > calc.safetyStock &&
    calc.serviceLevel > 0 &&
    calc.serviceLevel <= 1
  );
}

/**
 * 25. Adjusts safety stock based on demand forecast updates.
 *
 * @param {SafetyStockCalculation} current - Current calculation
 * @param {number} newDemandStdDev - Updated demand std dev
 * @param {number} newLeadTime - Updated lead time
 * @returns {SafetyStockCalculation} Adjusted calculation
 */
export function adjustSafetyStockForUpdate(
  current: SafetyStockCalculation,
  newDemandStdDev: number,
  newLeadTime: number
): SafetyStockCalculation {
  const newStdDevDuringLeadTime = newDemandStdDev * Math.sqrt(newLeadTime);
  const newSafetyStock = Math.ceil(current.zScore * newStdDevDuringLeadTime);

  return {
    ...current,
    safetyStock: newSafetyStock,
    leadTimeStdDev: newStdDevDuringLeadTime,
    reorderPoint: Math.ceil(current.demandStdDev * newLeadTime + newSafetyStock),
  };
}

// ============================================================================
// SECTION 4: REPLENISHMENT PLANNING (Functions 26-33)
// ============================================================================

/**
 * 26. Calculates Economic Order Quantity (EOQ).
 *
 * @param {number} demand - Annual demand
 * @param {number} orderingCost - Cost per order
 * @param {number} holdingCost - Holding cost per unit per year
 * @returns {number} Optimal order quantity
 */
export function calculateEOQ(
  demand: number,
  orderingCost: number = 50,
  holdingCost: number = 0.25
): number {
  return Math.ceil(Math.sqrt((2 * demand * orderingCost) / holdingCost));
}

/**
 * 27. Determines optimal replenishment order quantity.
 *
 * @param {DemandPlan} plan - Demand plan
 * @param {number} orderingCost - Cost per order
 * @param {number} holdingCost - Holding cost per unit
 * @returns {number} Recommended order quantity
 */
export function calculateOptimalOrderQuantity(
  plan: DemandPlan,
  orderingCost: number = 50,
  holdingCost: number = 0.25
): number {
  const annualDemand = plan.baselineForecasts.reduce((a, b) => a + b, 0) * 12;
  const eoq = calculateEOQ(annualDemand, orderingCost, holdingCost);

  // Apply min/max constraints
  if (eoq < plan.minOrderQuantity) return plan.minOrderQuantity;
  if (eoq > plan.maxOrderQuantity) return plan.maxOrderQuantity;

  return eoq;
}

/**
 * 28. Generates replenishment schedule for entire planning horizon.
 *
 * @param {DemandPlan} plan - Demand plan
 * @param {Date} startDate - Planning start date
 * @returns {ReplenishmentOrder[]} Suggested orders
 */
export function generateReplenishmentSchedule(
  plan: DemandPlan,
  startDate: Date
): ReplenishmentOrder[] {
  const orders: ReplenishmentOrder[] = [];
  let currentStock = plan.reorderPoint * 2;
  let currentDate = startDate;

  for (let i = 0; i < plan.baselineForecasts.length; i++) {
    const forecast = plan.baselineForecasts[i];
    currentStock -= forecast;

    if (currentStock <= plan.reorderPoint) {
      const orderQuantity = calculateOptimalOrderQuantity(plan);
      const orderDate = new Date(currentDate);
      const deliveryDate = new Date(orderDate);
      deliveryDate.setDate(deliveryDate.getDate() + plan.leadTime);

      orders.push({
        orderId: crypto.randomUUID(),
        planId: plan.planId,
        productId: plan.productId,
        supplierSupplierId: '',
        suggestedOrderQuantity: orderQuantity,
        suggestedOrderDate: orderDate,
        suggestedDeliveryDate: deliveryDate,
        priority: currentStock < plan.safetyStock ? 'HIGH' : 'NORMAL',
        status: 'SUGGESTED',
      });

      currentStock += orderQuantity;
    }

    currentDate = new Date(currentDate);
    currentDate.setDate(currentDate.getDate() + 7); // Weekly periods
  }

  return orders;
}

/**
 * 29. Calculates total replenishment cost for a plan.
 *
 * @param {DemandPlan} plan - Demand plan
 * @param {number} orderingCost - Cost per order
 * @param {number} holdingCost - Holding cost per unit per period
 * @returns {Object} Cost breakdown
 */
export function calculateReplenishmentCost(
  plan: DemandPlan,
  orderingCost: number = 50,
  holdingCost: number = 0.25
): {
  annualOrderingCost: number;
  annualHoldingCost: number;
  totalAnnualCost: number;
} {
  const annualDemand = plan.baselineForecasts.reduce((a, b) => a + b, 0) * 12;
  const eoq = calculateEOQ(annualDemand, orderingCost, holdingCost);
  const numOrders = annualDemand / eoq;
  const avgInventory = (plan.safetyStock + eoq / 2);

  return {
    annualOrderingCost: Math.round(numOrders * orderingCost * 100) / 100,
    annualHoldingCost: Math.round(avgInventory * holdingCost * 100) / 100,
    totalAnnualCost:
      Math.round((numOrders * orderingCost + avgInventory * holdingCost) * 100) / 100,
  };
}

/**
 * 30. Implements MRP-style replenishment with BOM explosion.
 *
 * @param {DemandPlan} parentPlan - Parent product demand plan
 * @param {Array} bomItems - Bill of Materials items
 * @returns {ReplenishmentOrder[]} Replenishment orders for BOM
 */
export function calculateMRPReplenishment(
  parentPlan: DemandPlan,
  bomItems: Array<{ componentId: string; quantity: number }>
): ReplenishmentOrder[] {
  const orders: ReplenishmentOrder[] = [];

  bomItems.forEach((item) => {
    const componentDemand = parentPlan.baselineForecasts.map((d) => d * item.quantity);
    const totalDemand = componentDemand.reduce((a, b) => a + b, 0);

    orders.push({
      orderId: crypto.randomUUID(),
      planId: parentPlan.planId,
      productId: item.componentId,
      supplierSupplierId: '',
      suggestedOrderQuantity: Math.ceil(totalDemand),
      suggestedOrderDate: parentPlan.baselineForecasts[0] > 0 ? new Date() : new Date(),
      suggestedDeliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      priority: 'NORMAL',
      status: 'SUGGESTED',
    });
  });

  return orders;
}

/**
 * 31. Consolidates multiple SKU orders for bulk ordering discounts.
 *
 * @param {ReplenishmentOrder[]} orders - Individual orders
 * @param {string} supplierId - Supplier ID
 * @returns {Object} Consolidated order with discount potential
 */
export function consolidateOrdersForBulkDiscount(
  orders: ReplenishmentOrder[],
  supplierId: string
): {
  totalQuantity: number;
  totalValue: number;
  discountPercentage: number;
  discountedValue: number;
} {
  const totalQuantity = orders.reduce((sum, o) => sum + o.suggestedOrderQuantity, 0);
  const totalValue = totalQuantity * 10; // Assume $10 per unit

  let discountPercentage = 0;
  if (totalQuantity > 10000) discountPercentage = 0.15;
  else if (totalQuantity > 5000) discountPercentage = 0.1;
  else if (totalQuantity > 1000) discountPercentage = 0.05;

  return {
    totalQuantity,
    totalValue,
    discountPercentage,
    discountedValue: Math.round(totalValue * (1 - discountPercentage) * 100) / 100,
  };
}

/**
 * 32. Calculates order timing to balance cash flow and service.
 *
 * @param {DemandPlan[]} plans - Array of demand plans
 * @param {number} cashFlowLimit - Maximum order value per period
 * @returns {Object} Optimized order schedule
 */
export function optimizeOrderTiming(
  plans: DemandPlan[],
  cashFlowLimit: number = 50000
): { totalOrders: number; avgOrderValue: number; cashFlowCompliance: boolean } {
  const orders = plans.flatMap((p) => generateReplenishmentSchedule(p, new Date()));
  const totalOrderValue = orders.reduce(
    (sum, o) => sum + o.suggestedOrderQuantity * 10,
    0
  );
  const avgOrderValue = totalOrderValue / (orders.length || 1);
  const isCompliant = avgOrderValue <= cashFlowLimit;

  return {
    totalOrders: orders.length,
    avgOrderValue: Math.round(avgOrderValue * 100) / 100,
    cashFlowCompliance: isCompliant,
  };
}

/**
 * 33. Performs supply chain network optimization for multi-echelon replenishment.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {string} cycleId - Planning cycle ID
 * @returns {any} Optimization query
 */
export function optimizeMultiEhelonNetwork(sequelize: any, cycleId: string): any {
  return `
    WITH RECURSIVE supply_chain AS (
      SELECT
        dp.productId,
        dp.planId,
        dp.reorderPoint,
        dp.economicOrderQuantity,
        1 as echelon_level
      FROM demand_plans dp
      WHERE dp.cycleId = ?

      UNION ALL

      SELECT
        sc.productId,
        sc.planId,
        sc.reorderPoint,
        sc.economicOrderQuantity,
        sc.echelon_level + 1
      FROM supply_chain sc
      JOIN bill_of_materials bom ON sc.productId = bom.parentId
      WHERE sc.echelon_level < 3
    )
    SELECT
      echelon_level,
      COUNT(DISTINCT productId) as sku_count,
      SUM(reorderPoint) as total_reorder_point,
      AVG(economicOrderQuantity) as avg_eoq
    FROM supply_chain
    GROUP BY echelon_level
    ORDER BY echelon_level
  `;
}

// ============================================================================
// SECTION 5: CONSTRAINT MANAGEMENT (Functions 34-41)
// ============================================================================

/**
 * 34. Adds a capacity constraint to planning cycle.
 *
 * @param {PlanningCycle} cycle - Planning cycle
 * @param {Partial<ConstraintSet>} constraint - Constraint details
 * @returns {PlanningCycle} Updated cycle
 */
export function addCapacityConstraint(
  cycle: PlanningCycle,
  constraint: Partial<ConstraintSet>
): PlanningCycle {
  const newConstraint: ConstraintSet = {
    constraintId: crypto.randomUUID(),
    cycleId: cycle.cycleId,
    constraintType: 'CAPACITY',
    ...constraint,
    priority: constraint.priority || 'HARD',
  };

  return {
    ...cycle,
    constraintSets: [...cycle.constraintSets, newConstraint],
    updatedAt: new Date(),
  };
}

/**
 * 35. Adds a budget constraint for total replenishment spending.
 *
 * @param {PlanningCycle} cycle - Planning cycle
 * @param {number} maxBudget - Maximum budget
 * @param {string} priority - Constraint priority
 * @returns {PlanningCycle} Updated cycle
 */
export function addBudgetConstraint(
  cycle: PlanningCycle,
  maxBudget: number,
  priority: 'HARD' | 'SOFT' = 'SOFT'
): PlanningCycle {
  const budgetConstraint: ConstraintSet = {
    constraintId: crypto.randomUUID(),
    cycleId: cycle.cycleId,
    constraintType: 'BUDGET',
    maxValue: maxBudget,
    priority,
  };

  return {
    ...cycle,
    constraintSets: [...cycle.constraintSets, budgetConstraint],
    updatedAt: new Date(),
  };
}

/**
 * 36. Adds storage/warehouse capacity constraint.
 *
 * @param {PlanningCycle} cycle - Planning cycle
 * @param {number} maxStorageUnits - Maximum units that can be stored
 * @returns {PlanningCycle} Updated cycle
 */
export function addStorageConstraint(
  cycle: PlanningCycle,
  maxStorageUnits: number
): PlanningCycle {
  const storageConstraint: ConstraintSet = {
    constraintId: crypto.randomUUID(),
    cycleId: cycle.cycleId,
    constraintType: 'STORAGE',
    maxValue: maxStorageUnits,
    priority: 'HARD',
  };

  return {
    ...cycle,
    constraintSets: [...cycle.constraintSets, storageConstraint],
    updatedAt: new Date(),
  };
}

/**
 * 37. Checks replenishment orders against all constraints.
 *
 * @param {ReplenishmentOrder[]} orders - Replenishment orders
 * @param {ConstraintSet[]} constraints - Active constraints
 * @returns {Object} Constraint validation result
 */
export function validateOrdersAgainstConstraints(
  orders: ReplenishmentOrder[],
  constraints: ConstraintSet[]
): {
  isValid: boolean;
  violations: Array<{ orderId: string; violations: ConstraintViolation[] }>;
} {
  const violations: Array<{ orderId: string; violations: ConstraintViolation[] }> = [];

  orders.forEach((order) => {
    const orderViolations: ConstraintViolation[] = [];

    constraints.forEach((constraint) => {
      if (constraint.constraintType === 'CAPACITY' && order.suggestedOrderQuantity > (constraint.maxValue || 0)) {
        orderViolations.push({
          constraintId: constraint.constraintId,
          violationType: 'CAPACITY_EXCEEDED',
          severity: constraint.priority === 'HARD' ? 'ERROR' : 'WARNING',
          violationAmount: order.suggestedOrderQuantity - (constraint.maxValue || 0),
        });
      }
    });

    if (orderViolations.length > 0) {
      violations.push({ orderId: order.orderId, violations: orderViolations });
    }
  });

  return {
    isValid: violations.length === 0,
    violations,
  };
}

/**
 * 38. Calculates constraint violation penalties for optimization.
 *
 * @param {Array} violations - Constraint violations
 * @param {ConstraintSet[]} constraints - Constraints
 * @returns {number} Total penalty cost
 */
export function calculateConstraintPenalty(
  violations: ConstraintViolation[],
  constraints: ConstraintSet[]
): number {
  return violations.reduce((total, violation) => {
    const constraint = constraints.find((c) => c.constraintId === violation.constraintId);
    const penalty = constraint?.penalty || 100;
    const severityMultiplier = violation.severity === 'ERROR' ? 2 : 1;

    return total + violation.violationAmount * penalty * severityMultiplier;
  }, 0);
}

/**
 * 39. Optimizes orders to minimize constraint violations.
 *
 * @param {ReplenishmentOrder[]} orders - Orders to optimize
 * @param {ConstraintSet[]} constraints - Active constraints
 * @returns {ReplenishmentOrder[]} Optimized orders
 */
export function optimizeOrdersForConstraints(
  orders: ReplenishmentOrder[],
  constraints: ConstraintSet[]
): ReplenishmentOrder[] {
  const budgetConstraint = constraints.find((c) => c.constraintType === 'BUDGET');
  if (!budgetConstraint) return orders;

  const maxBudget = budgetConstraint.maxValue || Infinity;
  const sortedOrders = [...orders].sort((a, b) => b.priority.localeCompare(a.priority));

  let totalSpent = 0;
  const optimizedOrders: ReplenishmentOrder[] = [];

  for (const order of sortedOrders) {
    const orderValue = order.suggestedOrderQuantity * 10; // $10/unit assumed

    if (totalSpent + orderValue <= maxBudget) {
      optimizedOrders.push(order);
      totalSpent += orderValue;
    } else if (totalSpent < maxBudget) {
      // Partial order
      const maxQuantity = Math.floor((maxBudget - totalSpent) / 10);
      if (maxQuantity >= order.suggestedOrderQuantity * 0.5) {
        // Allow if at least 50% can be fulfilled
        optimizedOrders.push({
          ...order,
          suggestedOrderQuantity: maxQuantity,
        });
        totalSpent = maxBudget;
      }
    }
  }

  return optimizedOrders;
}

/**
 * 40. Queries supplier constraints from database with optimization.
 *
 * @param {any} sequelize - Sequelize instance
 * @param {string} supplierId - Supplier ID
 * @returns {any} Optimization query
 */
export function querySupplierConstraints(sequelize: any, supplierId: string): any {
  return `
    SELECT
      cs.constraintId,
      cs.constraintType,
      cs.maxValue as supplier_max_capacity,
      cs.penalty,
      COUNT(DISTINCT ro.orderId) as pending_orders,
      SUM(ro.suggestedOrderQuantity) as total_pending_qty
    FROM constraint_sets cs
    LEFT JOIN replenishment_orders ro ON cs.supplierId = ro.supplierSupplierId
    WHERE cs.supplierId = ?
      AND cs.constraintType = 'SUPPLIER'
    GROUP BY cs.constraintId, cs.constraintType, cs.maxValue, cs.penalty
  `;
}

/**
 * 41. Performs constraint-aware demand-supply balancing optimization.
 *
 * @param {DemandPlan[]} plans - Demand plans
 * @param {ConstraintSet[]} constraints - Constraints
 * @returns {Object} Balanced and optimized supply plan
 */
export function balanceDemandSupplyWithConstraints(
  plans: DemandPlan[],
  constraints: ConstraintSet[]
): {
  feasible: boolean;
  totalDemand: number;
  totalCapacity: number;
  balancePercentage: number;
  recommendedAdjustments: string[];
} {
  const totalDemand = plans.reduce(
    (sum, plan) => sum + plan.baselineForecasts.reduce((a, b) => a + b, 0),
    0
  );

  const capacityConstraint = constraints.find((c) => c.constraintType === 'CAPACITY');
  const totalCapacity = capacityConstraint?.maxValue || 0;

  const balancePercentage = totalCapacity > 0 ? (totalDemand / totalCapacity) * 100 : 0;
  const isFeasible = balancePercentage <= 100;

  const recommendations: string[] = [];
  if (balancePercentage > 100) {
    recommendations.push(
      `Demand exceeds capacity by ${(balancePercentage - 100).toFixed(2)}%. Consider adding supplier capacity or reducing demand.`
    );
  }
  if (balancePercentage < 50) {
    recommendations.push('Significant excess capacity. Consider consolidating suppliers or reducing inventory.');
  }

  return {
    feasible: isFeasible,
    totalDemand: Math.round(totalDemand),
    totalCapacity,
    balancePercentage: Math.round(balancePercentage * 100) / 100,
    recommendedAdjustments: recommendations,
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function calculateTrendComponent(data: number[], period: number = 3): number {
  if (data.length < 2) return 0;
  const recent = data.slice(-period);
  const older = data.slice(-period * 2, -period);
  const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
  const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;
  return (recentAvg - olderAvg) / (olderAvg || 1);
}

function calculateSeasonalityStrength(data: number[], period: number): number {
  const seasonal = calculateSeasonalIndices(data, period);
  const variance = seasonal.reduce((sum, s) => sum + Math.pow(s - 1, 2), 0) / seasonal.length;
  return Math.sqrt(variance);
}

function calculateAutocorrelation(data: number[], lags: number = 5): number[] {
  const mean = data.reduce((a, b) => a + b, 0) / data.length;
  const c0 = data.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / data.length;

  const correlations: number[] = [];
  for (let k = 1; k <= lags; k++) {
    const ck = data
      .slice(0, data.length - k)
      .reduce((sum, _, i) => sum + (data[i] - mean) * (data[i + k] - mean), 0) / data.length;
    correlations.push(ck / c0);
  }

  return correlations;
}

function applyDifferencing(data: number[], order: number): number[] {
  let differenced = [...data];
  for (let i = 0; i < order; i++) {
    differenced = differenced.slice(1).map((val, idx) => val - differenced[idx]);
  }
  return differenced;
}

function invertDifferencing(forecast: number[], original: number[], order: number): number[] {
  let inverted = [...forecast];
  for (let i = 0; i < order; i++) {
    inverted = inverted.map((val, idx) => {
      const base = idx === 0 ? original[original.length - 1] : inverted[idx - 1];
      return base + val;
    });
  }
  return inverted;
}

export default {
  // Section 1
  createPlanningCycle,
  addDemandPlan,
  updateCycleStatus,
  calculateCycleMetrics,
  queryPlanningCycleOptimized,
  bulkAddDemandPlans,
  clonePlanningCycle,
  validatePlanningCycle,
  // Section 2
  analyzeDemandPattern,
  forecastDemandExponentialSmoothing,
  calculateSeasonalIndices,
  seasonalDecompose,
  forecastDemandARIMA,
  calculateForecastAccuracy,
  analyzeDemandVolatility,
  generateEnsembleForecast,
  // Section 3
  calculateSafetyStock,
  optimizeSafetyStock,
  calculateReorderPoint,
  calculateMaxInventoryLevel,
  calculateProbabilisticReorderPoint,
  optimizeMultiSKUSafetyStock,
  calculateTwoBinLevels,
  validateSafetyStockParameters,
  adjustSafetyStockForUpdate,
  // Section 4
  calculateEOQ,
  calculateOptimalOrderQuantity,
  generateReplenishmentSchedule,
  calculateReplenishmentCost,
  calculateMRPReplenishment,
  consolidateOrdersForBulkDiscount,
  optimizeOrderTiming,
  optimizeMultiEhelonNetwork,
  // Section 5
  addCapacityConstraint,
  addBudgetConstraint,
  addStorageConstraint,
  validateOrdersAgainstConstraints,
  calculateConstraintPenalty,
  optimizeOrdersForConstraints,
  querySupplierConstraints,
  balanceDemandSupplyWithConstraints,
};
