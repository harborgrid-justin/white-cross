/**
 * LOC: TRDMARG0001234
 * File: /reuse/trading/margin-collateral-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (Injectable, Logger, Inject)
 *   - sequelize (Model, DataTypes, Transaction, Op)
 *   - ../error-handling-kit.ts (exception classes, error handling)
 *   - ../validation-kit.ts (validation utilities)
 *   - ./market-data-models-kit.ts (market data, pricing)
 *   - ./trading-execution-service-kit.ts (position data, trade data)
 *
 * DOWNSTREAM (imported by):
 *   - backend/risk/*
 *   - backend/controllers/margin.controller.ts
 *   - backend/services/margin.service.ts
 *   - backend/services/collateral.service.ts
 */
import { Transaction } from 'sequelize';
/**
 * Margin calculation methodologies
 */
export declare enum MarginMethodology {
    REG_T = "REG_T",// Regulation T (Federal Reserve)
    PORTFOLIO = "PORTFOLIO",// Portfolio Margining (PM)
    SPAN = "SPAN",// Standard Portfolio Analysis of Risk
    VAR = "VAR",// Value at Risk based
    TIMS = "TIMS",// Theoretical Intermarket Margin System
    STANS = "STANS",// Standard-based approach (Europe)
    SIMM = "SIMM",// Standard Initial Margin Model
    GRID = "GRID"
}
/**
 * Margin types
 */
export declare enum MarginType {
    INITIAL = "INITIAL",// Initial margin (upfront)
    VARIATION = "VARIATION",// Variation margin (mark-to-market)
    MAINTENANCE = "MAINTENANCE",// Maintenance margin requirement
    EXCESS = "EXCESS",// Excess margin available
    DEFICIT = "DEFICIT"
}
/**
 * Collateral types and asset classes
 */
export declare enum CollateralType {
    CASH = "CASH",
    GOVERNMENT_BONDS = "GOVERNMENT_BONDS",
    CORPORATE_BONDS = "CORPORATE_BONDS",
    EQUITIES = "EQUITIES",
    MUTUAL_FUNDS = "MUTUAL_FUNDS",
    ETF = "ETF",
    COMMODITIES = "COMMODITIES",
    LETTERS_OF_CREDIT = "LETTERS_OF_CREDIT",
    BANK_GUARANTEES = "BANK_GUARANTEES",
    GOLD = "GOLD",
    REAL_ESTATE = "REAL_ESTATE"
}
/**
 * Collateral quality ratings
 */
export declare enum CollateralQuality {
    AAA = "AAA",
    AA = "AA",
    A = "A",
    BBB = "BBB",
    BB = "BB",
    B = "B",
    CCC = "CCC",
    UNRATED = "UNRATED"
}
/**
 * Margin call status
 */
export declare enum MarginCallStatus {
    PENDING = "PENDING",
    ISSUED = "ISSUED",
    ACKNOWLEDGED = "ACKNOWLEDGED",
    PARTIALLY_SATISFIED = "PARTIALLY_SATISFIED",
    SATISFIED = "SATISFIED",
    OVERDUE = "OVERDUE",
    ESCALATED = "ESCALATED",
    DEFAULTED = "DEFAULTED",
    CANCELLED = "CANCELLED"
}
/**
 * Margin account configuration
 */
export interface MarginAccount {
    accountId: string;
    accountName: string;
    accountType: 'CASH' | 'MARGIN' | 'PORTFOLIO_MARGIN' | 'FUTURES' | 'OPTIONS';
    methodology: MarginMethodology;
    baseCurrency: string;
    counterparty?: string;
    clearingMember?: string;
    segregated: boolean;
    active: boolean;
    limits: {
        maxLeverage: number;
        concentrationLimit: number;
        positionLimit: Record<string, number>;
    };
    metadata: Record<string, any>;
}
/**
 * Initial margin calculation result
 */
export interface InitialMarginResult {
    accountId: string;
    calculationId: string;
    methodology: MarginMethodology;
    timestamp: Date;
    baseCurrency: string;
    grossMargin: number;
    netMargin: number;
    diversificationBenefit: number;
    offsets: MarginOffset[];
    componentBreakdown: MarginComponent[];
    confidence: number;
    metadata: Record<string, any>;
}
/**
 * Margin component breakdown
 */
export interface MarginComponent {
    componentId: string;
    componentType: 'EQUITY' | 'OPTION' | 'FUTURE' | 'BOND' | 'FX' | 'COMMODITY';
    securityId: string;
    quantity: number;
    marginRequirement: number;
    notional: number;
    riskContribution: number;
    haircut?: number;
}
/**
 * Margin offset (cross-margining, hedges)
 */
export interface MarginOffset {
    offsetId: string;
    offsetType: 'HEDGE' | 'SPREAD' | 'CROSS_MARGIN' | 'PORTFOLIO_EFFECT';
    relatedPositions: string[];
    offsetAmount: number;
    percentage: number;
    description: string;
}
/**
 * Variation margin calculation result
 */
export interface VariationMarginResult {
    accountId: string;
    calculationId: string;
    valuationDate: Date;
    previousValuation: number;
    currentValuation: number;
    unrealizedPnL: number;
    realizedPnL: number;
    variationMargin: number;
    marginMovement: number;
    currency: string;
    positions: PositionValuation[];
    metadata: Record<string, any>;
}
/**
 * Position valuation for variation margin
 */
export interface PositionValuation {
    positionId: string;
    securityId: string;
    quantity: number;
    previousPrice: number;
    currentPrice: number;
    previousValue: number;
    currentValue: number;
    unrealizedPnL: number;
    currency: string;
}
/**
 * SPAN margin calculation parameters
 */
export interface SPANParameters {
    priceScanRange: number;
    volatilityScanRange: number;
    intraDayCharge: number;
    shortOptionMinimum: number;
    scenarioCount: number;
    correlationMatrix?: number[][];
}
/**
 * VaR-based margin parameters
 */
export interface VaRParameters {
    confidenceLevel: number;
    holdingPeriod: number;
    historicalPeriod: number;
    method: 'HISTORICAL' | 'PARAMETRIC' | 'MONTE_CARLO';
    simulations?: number;
    lambda?: number;
}
/**
 * Collateral asset details
 */
export interface CollateralAsset {
    assetId: string;
    securityId: string;
    assetType: CollateralType;
    quantity: number;
    marketValue: number;
    haircutRate: number;
    collateralValue: number;
    quality: CollateralQuality;
    currency: string;
    issuer: string;
    maturityDate?: Date;
    eligible: boolean;
    pledgedTo?: string;
    segregated: boolean;
    metadata: Record<string, any>;
}
/**
 * Haircut schedule by asset type and quality
 */
export interface HaircutSchedule {
    assetType: CollateralType;
    quality: CollateralQuality;
    maturityBucket?: string;
    haircutRate: number;
    effectiveDate: Date;
    source: 'REGULATORY' | 'CCP' | 'BILATERAL' | 'INTERNAL';
    jurisdiction?: string;
}
/**
 * Collateral optimization result
 */
export interface CollateralOptimization {
    optimizationId: string;
    accountId: string;
    requiredCollateral: number;
    availableCollateral: number;
    allocatedAssets: CollateralAsset[];
    totalMarketValue: number;
    totalCollateralValue: number;
    utilizationRate: number;
    efficiency: number;
    substitutionOpportunities: SubstitutionOpportunity[];
    timestamp: Date;
}
/**
 * Collateral substitution opportunity
 */
export interface SubstitutionOpportunity {
    currentAssetId: string;
    proposedAssetId: string;
    currentCollateralValue: number;
    proposedCollateralValue: number;
    benefit: number;
    reason: string;
}
/**
 * Margin call details
 */
export interface MarginCall {
    callId: string;
    accountId: string;
    callType: MarginType;
    status: MarginCallStatus;
    issuedDate: Date;
    dueDate: Date;
    amount: number;
    currency: string;
    currentDeficit: number;
    satisfiedAmount: number;
    remainingAmount: number;
    collateralPosted: CollateralAsset[];
    escalationLevel: number;
    counterparty?: string;
    reason: string;
    metadata: Record<string, any>;
}
/**
 * Cross-margin configuration
 */
export interface CrossMarginConfig {
    configId: string;
    productGroups: string[][];
    offsetRates: Map<string, number>;
    methodology: MarginMethodology;
    enabled: boolean;
}
/**
 * CCP margin requirements
 */
export interface CCPMarginRequirement {
    ccpId: string;
    ccpName: string;
    clearingMember: string;
    accountId: string;
    initialMargin: number;
    variationMargin: number;
    additionalMargin: number;
    defaultFundContribution: number;
    totalRequirement: number;
    currency: string;
    valuationDate: Date;
    positions: PositionMarginBreakdown[];
}
/**
 * Position margin breakdown for CCP
 */
export interface PositionMarginBreakdown {
    positionId: string;
    product: string;
    quantity: number;
    initialMargin: number;
    maintenanceMargin: number;
    stressMargin: number;
    concentrationCharge: number;
}
/**
 * Margin stress test scenario
 */
export interface StressTestScenario {
    scenarioId: string;
    scenarioName: string;
    description: string;
    marketShocks: MarketShock[];
    expectedMargin: number;
    marginIncrease: number;
    collateralDeficit: number;
    riskMetrics: Record<string, number>;
}
/**
 * Market shock for stress testing
 */
export interface MarketShock {
    assetClass: string;
    shockType: 'PRICE' | 'VOLATILITY' | 'CORRELATION' | 'LIQUIDITY';
    magnitude: number;
    direction: 'UP' | 'DOWN' | 'BOTH';
}
/**
 * Calculates Regulation T initial margin requirement.
 * Reg T requires 50% margin for long equity positions, 150% for short positions.
 *
 * @param {string} accountId - Account identifier
 * @param {any[]} positions - Account positions
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<InitialMarginResult>} Initial margin calculation
 *
 * @example
 * ```typescript
 * const margin = await calculateRegTInitialMargin('ACC-123', positions);
 * console.log(`Reg T margin required: $${margin.netMargin}`);
 * ```
 */
export declare function calculateRegTInitialMargin(accountId: string, positions: any[], transaction?: Transaction): Promise<InitialMarginResult>;
/**
 * Calculates portfolio margin using risk-based approach.
 * Portfolio margin uses VaR-based methodology for more capital-efficient margining.
 *
 * @param {string} accountId - Account identifier
 * @param {any[]} positions - Account positions
 * @param {VaRParameters} varParams - VaR calculation parameters
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<InitialMarginResult>} Portfolio margin calculation
 *
 * @example
 * ```typescript
 * const margin = await calculatePortfolioMargin('ACC-123', positions, { confidenceLevel: 0.99, holdingPeriod: 1 });
 * ```
 */
export declare function calculatePortfolioMargin(accountId: string, positions: any[], varParams: VaRParameters, transaction?: Transaction): Promise<InitialMarginResult>;
/**
 * Calculates SPAN (Standard Portfolio Analysis of Risk) margin.
 * SPAN is widely used for futures and options margining.
 *
 * @param {string} accountId - Account identifier
 * @param {any[]} positions - Account positions
 * @param {SPANParameters} spanParams - SPAN calculation parameters
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<InitialMarginResult>} SPAN margin calculation
 *
 * @example
 * ```typescript
 * const margin = await calculateSPANMargin('ACC-123', positions, { priceScanRange: 0.15, volatilityScanRange: 0.10 });
 * ```
 */
export declare function calculateSPANMargin(accountId: string, positions: any[], spanParams: SPANParameters, transaction?: Transaction): Promise<InitialMarginResult>;
/**
 * Calculates VaR-based initial margin.
 *
 * @param {string} accountId - Account identifier
 * @param {any[]} positions - Account positions
 * @param {VaRParameters} varParams - VaR parameters
 * @returns {Promise<InitialMarginResult>} VaR-based margin
 *
 * @example
 * ```typescript
 * const margin = await calculateVaRBasedMargin('ACC-123', positions, { confidenceLevel: 0.99, holdingPeriod: 10 });
 * ```
 */
export declare function calculateVaRBasedMargin(accountId: string, positions: any[], varParams: VaRParameters): Promise<InitialMarginResult>;
/**
 * Calculates margin for options positions using various models.
 *
 * @param {string} accountId - Account identifier
 * @param {any[]} optionPositions - Option positions
 * @param {object} [config] - Calculation configuration
 * @returns {Promise<number>} Options margin requirement
 *
 * @example
 * ```typescript
 * const margin = await calculateOptionsMargin('ACC-123', options);
 * ```
 */
export declare function calculateOptionsMargin(accountId: string, optionPositions: any[], config?: any): Promise<number>;
/**
 * Calculates margin for futures positions.
 *
 * @param {string} accountId - Account identifier
 * @param {any[]} futuresPositions - Futures positions
 * @returns {Promise<number>} Futures margin requirement
 *
 * @example
 * ```typescript
 * const margin = await calculateFuturesMargin('ACC-123', futures);
 * ```
 */
export declare function calculateFuturesMargin(accountId: string, futuresPositions: any[]): Promise<number>;
/**
 * Calculates cross-margin benefits for related positions.
 *
 * @param {string} accountId - Account identifier
 * @param {any[]} positions - All positions
 * @param {CrossMarginConfig} config - Cross-margin configuration
 * @returns {Promise<{ grossMargin: number; netMargin: number; offsets: MarginOffset[] }>} Cross-margin result
 *
 * @example
 * ```typescript
 * const result = await calculateCrossMargin('ACC-123', positions, crossMarginConfig);
 * console.log(`Cross-margin benefit: $${result.grossMargin - result.netMargin}`);
 * ```
 */
export declare function calculateCrossMargin(accountId: string, positions: any[], config: CrossMarginConfig): Promise<{
    grossMargin: number;
    netMargin: number;
    offsets: MarginOffset[];
}>;
/**
 * Calculates variation margin based on mark-to-market changes.
 *
 * @param {string} accountId - Account identifier
 * @param {any[]} positions - Current positions
 * @param {Date} valuationDate - Valuation date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<VariationMarginResult>} Variation margin calculation
 *
 * @example
 * ```typescript
 * const varMargin = await calculateVariationMargin('ACC-123', positions, new Date());
 * ```
 */
export declare function calculateVariationMargin(accountId: string, positions: any[], valuationDate: Date, transaction?: Transaction): Promise<VariationMarginResult>;
/**
 * Calculates mark-to-market valuation for positions.
 *
 * @param {any[]} positions - Positions to value
 * @param {Date} valuationDate - Valuation date
 * @returns {Promise<{ totalValue: number; positions: PositionValuation[] }>} MTM valuation
 *
 * @example
 * ```typescript
 * const mtm = await calculateMarkToMarket(positions, new Date());
 * ```
 */
export declare function calculateMarkToMarket(positions: any[], valuationDate: Date): Promise<{
    totalValue: number;
    positions: PositionValuation[];
}>;
/**
 * Calculates unrealized profit and loss.
 *
 * @param {string} accountId - Account identifier
 * @param {any[]} positions - Positions
 * @returns {Promise<number>} Unrealized P&L
 *
 * @example
 * ```typescript
 * const pnl = await calculateUnrealizedPnL('ACC-123', positions);
 * ```
 */
export declare function calculateUnrealizedPnL(accountId: string, positions: any[]): Promise<number>;
/**
 * Processes variation margin call when losses exceed thresholds.
 *
 * @param {string} accountId - Account identifier
 * @param {number} variationAmount - Variation margin amount
 * @param {Date} dueDate - Due date for margin posting
 * @returns {Promise<MarginCall>} Variation margin call
 *
 * @example
 * ```typescript
 * const call = await processVariationMarginCall('ACC-123', -50000, tomorrow);
 * ```
 */
export declare function processVariationMarginCall(accountId: string, variationAmount: number, dueDate: Date): Promise<MarginCall>;
/**
 * Settles variation margin with collateral or cash transfer.
 *
 * @param {string} callId - Margin call identifier
 * @param {CollateralAsset[]} collateral - Collateral posted
 * @returns {Promise<{ settled: boolean; remainingAmount: number }>} Settlement result
 *
 * @example
 * ```typescript
 * const result = await settleVariationMargin('VM-CALL-123', collateralAssets);
 * ```
 */
export declare function settleVariationMargin(callId: string, collateral: CollateralAsset[]): Promise<{
    settled: boolean;
    remainingAmount: number;
}>;
/**
 * Calculates intraday margin requirements for active trading.
 *
 * @param {string} accountId - Account identifier
 * @param {any[]} positions - Current positions
 * @param {any[]} pendingOrders - Pending orders
 * @returns {Promise<number>} Intraday margin requirement
 *
 * @example
 * ```typescript
 * const intraDayMargin = await calculateIntraDayMargin('ACC-123', positions, orders);
 * ```
 */
export declare function calculateIntraDayMargin(accountId: string, positions: any[], pendingOrders: any[]): Promise<number>;
/**
 * Aggregates variation margin across multiple accounts or portfolios.
 *
 * @param {string[]} accountIds - Account identifiers
 * @param {Date} valuationDate - Valuation date
 * @returns {Promise<{ totalVariationMargin: number; byAccount: Map<string, number> }>} Aggregated variation margin
 *
 * @example
 * ```typescript
 * const aggregate = await aggregateVariationMargin(['ACC-1', 'ACC-2'], new Date());
 * ```
 */
export declare function aggregateVariationMargin(accountIds: string[], valuationDate: Date): Promise<{
    totalVariationMargin: number;
    byAccount: Map<string, number>;
}>;
/**
 * Validates collateral eligibility based on type, quality, and rules.
 *
 * @param {CollateralAsset} asset - Collateral asset
 * @param {string} purpose - Purpose (INITIAL_MARGIN, VARIATION_MARGIN, CLEARING)
 * @returns {Promise<{ eligible: boolean; reasons: string[] }>} Eligibility result
 *
 * @example
 * ```typescript
 * const check = await validateCollateralEligibility(asset, 'INITIAL_MARGIN');
 * ```
 */
export declare function validateCollateralEligibility(asset: CollateralAsset, purpose: string): Promise<{
    eligible: boolean;
    reasons: string[];
}>;
/**
 * Calculates collateral value after applying haircuts.
 *
 * @param {CollateralAsset} asset - Collateral asset
 * @param {HaircutSchedule[]} haircutSchedules - Applicable haircut schedules
 * @returns {Promise<number>} Collateral value post-haircut
 *
 * @example
 * ```typescript
 * const value = await calculateCollateralValue(asset, haircutSchedules);
 * ```
 */
export declare function calculateCollateralValue(asset: CollateralAsset, haircutSchedules: HaircutSchedule[]): Promise<number>;
/**
 * Applies haircut rates to collateral based on asset type and quality.
 *
 * @param {CollateralAsset[]} assets - Collateral assets
 * @param {HaircutSchedule[]} schedules - Haircut schedules
 * @returns {Promise<CollateralAsset[]>} Assets with haircuts applied
 *
 * @example
 * ```typescript
 * const valued = await applyHaircuts(assets, haircutSchedules);
 * ```
 */
export declare function applyHaircuts(assets: CollateralAsset[], schedules: HaircutSchedule[]): Promise<CollateralAsset[]>;
/**
 * Optimizes collateral allocation to minimize cost and maximize efficiency.
 *
 * @param {string} accountId - Account identifier
 * @param {number} requiredCollateral - Required collateral amount
 * @param {CollateralAsset[]} availableAssets - Available collateral assets
 * @returns {Promise<CollateralOptimization>} Optimization result
 *
 * @example
 * ```typescript
 * const optimization = await optimizeCollateralAllocation('ACC-123', 1000000, availableAssets);
 * ```
 */
export declare function optimizeCollateralAllocation(accountId: string, requiredCollateral: number, availableAssets: CollateralAsset[]): Promise<CollateralOptimization>;
/**
 * Processes collateral substitution request.
 *
 * @param {string} accountId - Account identifier
 * @param {string} currentAssetId - Current collateral asset ID
 * @param {string} proposedAssetId - Proposed replacement asset ID
 * @returns {Promise<{ approved: boolean; reason: string }>} Substitution result
 *
 * @example
 * ```typescript
 * const result = await processCollateralSubstitution('ACC-123', 'OLD-ASSET', 'NEW-ASSET');
 * ```
 */
export declare function processCollateralSubstitution(accountId: string, currentAssetId: string, proposedAssetId: string): Promise<{
    approved: boolean;
    reason: string;
}>;
/**
 * Calculates collateral coverage ratio.
 *
 * @param {string} accountId - Account identifier
 * @param {number} marginRequirement - Total margin requirement
 * @param {CollateralAsset[]} collateral - Pledged collateral
 * @returns {Promise<{ coverageRatio: number; excess: number; deficit: number }>} Coverage metrics
 *
 * @example
 * ```typescript
 * const coverage = await calculateCollateralCoverage('ACC-123', 500000, collateral);
 * ```
 */
export declare function calculateCollateralCoverage(accountId: string, marginRequirement: number, collateral: CollateralAsset[]): Promise<{
    coverageRatio: number;
    excess: number;
    deficit: number;
}>;
/**
 * Monitors collateral quality and triggers alerts on downgrades.
 *
 * @param {CollateralAsset[]} collateral - Collateral to monitor
 * @returns {Promise<{ alerts: Array<{ assetId: string; issue: string; severity: string }> }>} Monitoring result
 *
 * @example
 * ```typescript
 * const monitoring = await monitorCollateralQuality(collateral);
 * ```
 */
export declare function monitorCollateralQuality(collateral: CollateralAsset[]): Promise<{
    alerts: Array<{
        assetId: string;
        issue: string;
        severity: string;
    }>;
}>;
/**
 * Revalues collateral at market prices.
 *
 * @param {CollateralAsset[]} collateral - Collateral to revalue
 * @param {Date} valuationDate - Valuation date
 * @returns {Promise<CollateralAsset[]>} Revalued collateral
 *
 * @example
 * ```typescript
 * const revalued = await revalueCollateral(collateral, new Date());
 * ```
 */
export declare function revalueCollateral(collateral: CollateralAsset[], valuationDate: Date): Promise<CollateralAsset[]>;
/**
 * Segregates collateral by client or purpose.
 *
 * @param {CollateralAsset[]} collateral - Collateral to segregate
 * @param {string} segregationKey - Segregation key (client, purpose, etc.)
 * @returns {Promise<Map<string, CollateralAsset[]>>} Segregated collateral
 *
 * @example
 * ```typescript
 * const segregated = await segregateCollateral(collateral, 'client');
 * ```
 */
export declare function segregateCollateral(collateral: CollateralAsset[], segregationKey: string): Promise<Map<string, CollateralAsset[]>>;
/**
 * Transforms collateral type (e.g., securities to cash via repo).
 *
 * @param {string} accountId - Account identifier
 * @param {CollateralAsset} sourceAsset - Source collateral
 * @param {CollateralType} targetType - Target collateral type
 * @returns {Promise<{ transformed: boolean; targetAsset?: CollateralAsset }>} Transformation result
 *
 * @example
 * ```typescript
 * const result = await transformCollateral('ACC-123', bondAsset, CollateralType.CASH);
 * ```
 */
export declare function transformCollateral(accountId: string, sourceAsset: CollateralAsset, targetType: CollateralType): Promise<{
    transformed: boolean;
    targetAsset?: CollateralAsset;
}>;
/**
 * Generates margin call when deficiency detected.
 *
 * @param {string} accountId - Account identifier
 * @param {number} deficiency - Margin deficiency amount
 * @param {MarginType} callType - Type of margin call
 * @param {Date} dueDate - Due date
 * @returns {Promise<MarginCall>} Generated margin call
 *
 * @example
 * ```typescript
 * const call = await generateMarginCall('ACC-123', 100000, MarginType.INITIAL, tomorrow);
 * ```
 */
export declare function generateMarginCall(accountId: string, deficiency: number, callType: MarginType, dueDate: Date): Promise<MarginCall>;
/**
 * Processes margin call response with collateral posting.
 *
 * @param {string} callId - Margin call identifier
 * @param {CollateralAsset[]} collateral - Collateral posted
 * @param {string} respondedBy - Responder identifier
 * @returns {Promise<{ accepted: boolean; remainingDeficit: number }>} Response result
 *
 * @example
 * ```typescript
 * const result = await processMarginCallResponse('MC-123', collateralAssets, 'USER-456');
 * ```
 */
export declare function processMarginCallResponse(callId: string, collateral: CollateralAsset[], respondedBy: string): Promise<{
    accepted: boolean;
    remainingDeficit: number;
}>;
/**
 * Escalates overdue margin calls.
 *
 * @param {string} callId - Margin call identifier
 * @param {number} escalationLevel - New escalation level
 * @returns {Promise<MarginCall>} Escalated margin call
 *
 * @example
 * ```typescript
 * const escalated = await escalateMarginCall('MC-123', 2);
 * ```
 */
export declare function escalateMarginCall(callId: string, escalationLevel: number): Promise<MarginCall>;
/**
 * Calculates margin deficiency (shortfall).
 *
 * @param {string} accountId - Account identifier
 * @param {number} requiredMargin - Required margin
 * @param {number} availableCollateral - Available collateral
 * @returns {Promise<number>} Margin deficiency
 *
 * @example
 * ```typescript
 * const deficiency = await calculateMarginDeficiency('ACC-123', 500000, 450000);
 * ```
 */
export declare function calculateMarginDeficiency(accountId: string, requiredMargin: number, availableCollateral: number): Promise<number>;
/**
 * Calculates margin excess (surplus).
 *
 * @param {string} accountId - Account identifier
 * @param {number} requiredMargin - Required margin
 * @param {number} availableCollateral - Available collateral
 * @returns {Promise<number>} Margin excess
 *
 * @example
 * ```typescript
 * const excess = await calculateMarginExcess('ACC-123', 400000, 500000);
 * ```
 */
export declare function calculateMarginExcess(accountId: string, requiredMargin: number, availableCollateral: number): Promise<number>;
/**
 * Validates margin call satisfaction.
 *
 * @param {string} callId - Margin call identifier
 * @returns {Promise<{ satisfied: boolean; shortfall: number }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateMarginCallSatisfaction('MC-123');
 * ```
 */
export declare function validateMarginCallSatisfaction(callId: string): Promise<{
    satisfied: boolean;
    shortfall: number;
}>;
/**
 * Tracks margin call history for an account.
 *
 * @param {string} accountId - Account identifier
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<MarginCall[]>} Margin call history
 *
 * @example
 * ```typescript
 * const history = await trackMarginCallHistory('ACC-123', startDate, endDate);
 * ```
 */
export declare function trackMarginCallHistory(accountId: string, startDate: Date, endDate: Date): Promise<MarginCall[]>;
/**
 * Calculates CCP (Central Counterparty) margin requirements.
 *
 * @param {string} ccpId - CCP identifier
 * @param {string} accountId - Account identifier
 * @param {any[]} positions - Cleared positions
 * @returns {Promise<CCPMarginRequirement>} CCP margin requirement
 *
 * @example
 * ```typescript
 * const ccpMargin = await calculateCCPMargin('CME', 'ACC-123', positions);
 * ```
 */
export declare function calculateCCPMargin(ccpId: string, accountId: string, positions: any[]): Promise<CCPMarginRequirement>;
/**
 * Calculates bilateral margin for OTC derivatives.
 *
 * @param {string} accountId - Account identifier
 * @param {string} counterpartyId - Counterparty identifier
 * @param {any[]} trades - OTC trades
 * @returns {Promise<{ initialMargin: number; variationMargin: number }>} Bilateral margin
 *
 * @example
 * ```typescript
 * const margin = await calculateBilateralMargin('ACC-123', 'CP-456', otcTrades);
 * ```
 */
export declare function calculateBilateralMargin(accountId: string, counterpartyId: string, trades: any[]): Promise<{
    initialMargin: number;
    variationMargin: number;
}>;
/**
 * Performs margin stress testing under various scenarios.
 *
 * @param {string} accountId - Account identifier
 * @param {any[]} positions - Positions to stress
 * @param {StressTestScenario[]} scenarios - Stress scenarios
 * @returns {Promise<StressTestScenario[]>} Stress test results
 *
 * @example
 * ```typescript
 * const results = await performMarginStressTesting('ACC-123', positions, scenarios);
 * ```
 */
export declare function performMarginStressTesting(accountId: string, positions: any[], scenarios: StressTestScenario[]): Promise<StressTestScenario[]>;
/**
 * Simulates margin requirements under hypothetical scenarios.
 *
 * @param {string} accountId - Account identifier
 * @param {any[]} positions - Positions
 * @param {any[]} scenarios - Simulation scenarios
 * @returns {Promise<Array<{ scenario: string; margin: number }>>} Simulation results
 *
 * @example
 * ```typescript
 * const sims = await simulateMarginUnderScenarios('ACC-123', positions, scenarios);
 * ```
 */
export declare function simulateMarginUnderScenarios(accountId: string, positions: any[], scenarios: any[]): Promise<Array<{
    scenario: string;
    margin: number;
}>>;
/**
 * Calculates margin utilization rate.
 *
 * @param {string} accountId - Account identifier
 * @param {number} usedMargin - Used margin
 * @param {number} availableMargin - Available margin
 * @returns {Promise<number>} Utilization rate (0-1)
 *
 * @example
 * ```typescript
 * const utilization = await calculateMarginUtilization('ACC-123', 800000, 1000000);
 * ```
 */
export declare function calculateMarginUtilization(accountId: string, usedMargin: number, availableMargin: number): Promise<number>;
/**
 * Forecasts future margin requirements based on planned trades.
 *
 * @param {string} accountId - Account identifier
 * @param {any[]} currentPositions - Current positions
 * @param {any[]} plannedTrades - Planned trades
 * @returns {Promise<{ currentMargin: number; projectedMargin: number; increase: number }>} Forecast
 *
 * @example
 * ```typescript
 * const forecast = await forecastMarginRequirements('ACC-123', positions, plannedTrades);
 * ```
 */
export declare function forecastMarginRequirements(accountId: string, currentPositions: any[], plannedTrades: any[]): Promise<{
    currentMargin: number;
    projectedMargin: number;
    increase: number;
}>;
/**
 * Reconciles margin balances with counterparties/CCPs.
 *
 * @param {string} accountId - Account identifier
 * @param {string} counterpartyId - Counterparty/CCP identifier
 * @param {Date} reconciliationDate - Reconciliation date
 * @returns {Promise<{ matched: boolean; discrepancy: number; details: string }>} Reconciliation result
 *
 * @example
 * ```typescript
 * const recon = await reconcileMarginBalances('ACC-123', 'CME', new Date());
 * ```
 */
export declare function reconcileMarginBalances(accountId: string, counterpartyId: string, reconciliationDate: Date): Promise<{
    matched: boolean;
    discrepancy: number;
    details: string;
}>;
/**
 * Generates comprehensive margin and collateral reports.
 *
 * @param {string} accountId - Account identifier
 * @param {Date} reportDate - Report date
 * @param {string} reportType - Report type
 * @returns {Promise<object>} Margin report
 *
 * @example
 * ```typescript
 * const report = await generateMarginReports('ACC-123', new Date(), 'SUMMARY');
 * ```
 */
export declare function generateMarginReports(accountId: string, reportDate: Date, reportType: string): Promise<any>;
declare const _default: {
    calculateRegTInitialMargin: typeof calculateRegTInitialMargin;
    calculatePortfolioMargin: typeof calculatePortfolioMargin;
    calculateSPANMargin: typeof calculateSPANMargin;
    calculateVaRBasedMargin: typeof calculateVaRBasedMargin;
    calculateOptionsMargin: typeof calculateOptionsMargin;
    calculateFuturesMargin: typeof calculateFuturesMargin;
    calculateCrossMargin: typeof calculateCrossMargin;
    calculateVariationMargin: typeof calculateVariationMargin;
    calculateMarkToMarket: typeof calculateMarkToMarket;
    calculateUnrealizedPnL: typeof calculateUnrealizedPnL;
    processVariationMarginCall: typeof processVariationMarginCall;
    settleVariationMargin: typeof settleVariationMargin;
    calculateIntraDayMargin: typeof calculateIntraDayMargin;
    aggregateVariationMargin: typeof aggregateVariationMargin;
    validateCollateralEligibility: typeof validateCollateralEligibility;
    calculateCollateralValue: typeof calculateCollateralValue;
    applyHaircuts: typeof applyHaircuts;
    optimizeCollateralAllocation: typeof optimizeCollateralAllocation;
    processCollateralSubstitution: typeof processCollateralSubstitution;
    calculateCollateralCoverage: typeof calculateCollateralCoverage;
    monitorCollateralQuality: typeof monitorCollateralQuality;
    revalueCollateral: typeof revalueCollateral;
    segregateCollateral: typeof segregateCollateral;
    transformCollateral: typeof transformCollateral;
    generateMarginCall: typeof generateMarginCall;
    processMarginCallResponse: typeof processMarginCallResponse;
    escalateMarginCall: typeof escalateMarginCall;
    calculateMarginDeficiency: typeof calculateMarginDeficiency;
    calculateMarginExcess: typeof calculateMarginExcess;
    validateMarginCallSatisfaction: typeof validateMarginCallSatisfaction;
    trackMarginCallHistory: typeof trackMarginCallHistory;
    calculateCCPMargin: typeof calculateCCPMargin;
    calculateBilateralMargin: typeof calculateBilateralMargin;
    performMarginStressTesting: typeof performMarginStressTesting;
    simulateMarginUnderScenarios: typeof simulateMarginUnderScenarios;
    calculateMarginUtilization: typeof calculateMarginUtilization;
    forecastMarginRequirements: typeof forecastMarginRequirements;
    reconcileMarginBalances: typeof reconcileMarginBalances;
    generateMarginReports: typeof generateMarginReports;
};
export default _default;
//# sourceMappingURL=margin-collateral-kit.d.ts.map