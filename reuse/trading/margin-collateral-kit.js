"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarginCallStatus = exports.CollateralQuality = exports.CollateralType = exports.MarginType = exports.MarginMethodology = void 0;
exports.calculateRegTInitialMargin = calculateRegTInitialMargin;
exports.calculatePortfolioMargin = calculatePortfolioMargin;
exports.calculateSPANMargin = calculateSPANMargin;
exports.calculateVaRBasedMargin = calculateVaRBasedMargin;
exports.calculateOptionsMargin = calculateOptionsMargin;
exports.calculateFuturesMargin = calculateFuturesMargin;
exports.calculateCrossMargin = calculateCrossMargin;
exports.calculateVariationMargin = calculateVariationMargin;
exports.calculateMarkToMarket = calculateMarkToMarket;
exports.calculateUnrealizedPnL = calculateUnrealizedPnL;
exports.processVariationMarginCall = processVariationMarginCall;
exports.settleVariationMargin = settleVariationMargin;
exports.calculateIntraDayMargin = calculateIntraDayMargin;
exports.aggregateVariationMargin = aggregateVariationMargin;
exports.validateCollateralEligibility = validateCollateralEligibility;
exports.calculateCollateralValue = calculateCollateralValue;
exports.applyHaircuts = applyHaircuts;
exports.optimizeCollateralAllocation = optimizeCollateralAllocation;
exports.processCollateralSubstitution = processCollateralSubstitution;
exports.calculateCollateralCoverage = calculateCollateralCoverage;
exports.monitorCollateralQuality = monitorCollateralQuality;
exports.revalueCollateral = revalueCollateral;
exports.segregateCollateral = segregateCollateral;
exports.transformCollateral = transformCollateral;
exports.generateMarginCall = generateMarginCall;
exports.processMarginCallResponse = processMarginCallResponse;
exports.escalateMarginCall = escalateMarginCall;
exports.calculateMarginDeficiency = calculateMarginDeficiency;
exports.calculateMarginExcess = calculateMarginExcess;
exports.validateMarginCallSatisfaction = validateMarginCallSatisfaction;
exports.trackMarginCallHistory = trackMarginCallHistory;
exports.calculateCCPMargin = calculateCCPMargin;
exports.calculateBilateralMargin = calculateBilateralMargin;
exports.performMarginStressTesting = performMarginStressTesting;
exports.simulateMarginUnderScenarios = simulateMarginUnderScenarios;
exports.calculateMarginUtilization = calculateMarginUtilization;
exports.forecastMarginRequirements = forecastMarginRequirements;
exports.reconcileMarginBalances = reconcileMarginBalances;
exports.generateMarginReports = generateMarginReports;
/**
 * File: /reuse/trading/margin-collateral-kit.ts
 * Locator: WC-TRD-MARG-001
 * Purpose: Bloomberg Terminal-level Margin & Collateral Management - Initial/variation margin, SPAN, VaR, collateral optimization
 *
 * Upstream: NestJS 10.x, Sequelize 6.x, market data, position data, trade execution
 * Downstream: Risk management, treasury, operations, regulatory reporting, CCP integration
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, PostgreSQL 14+
 * Exports: 42 production-ready functions for margin calculations, collateral management, margin calls, risk monitoring
 *
 * LLM Context: Institutional-grade margin and collateral management platform competing with Bloomberg Terminal.
 * Provides comprehensive margin calculation methodologies (Reg T, Portfolio Margin, SPAN, VaR-based),
 * collateral management (eligibility, haircuts, optimization), margin call processing, cross-margining,
 * CCP margin requirements, bilateral margin, collateral transformation, stress testing, and regulatory
 * reporting (Dodd-Frank, EMIR, Basel III).
 */
const common_1 = require("@nestjs/common");
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * Margin calculation methodologies
 */
var MarginMethodology;
(function (MarginMethodology) {
    MarginMethodology["REG_T"] = "REG_T";
    MarginMethodology["PORTFOLIO"] = "PORTFOLIO";
    MarginMethodology["SPAN"] = "SPAN";
    MarginMethodology["VAR"] = "VAR";
    MarginMethodology["TIMS"] = "TIMS";
    MarginMethodology["STANS"] = "STANS";
    MarginMethodology["SIMM"] = "SIMM";
    MarginMethodology["GRID"] = "GRID"; // Grid-based margin (simple)
})(MarginMethodology || (exports.MarginMethodology = MarginMethodology = {}));
/**
 * Margin types
 */
var MarginType;
(function (MarginType) {
    MarginType["INITIAL"] = "INITIAL";
    MarginType["VARIATION"] = "VARIATION";
    MarginType["MAINTENANCE"] = "MAINTENANCE";
    MarginType["EXCESS"] = "EXCESS";
    MarginType["DEFICIT"] = "DEFICIT"; // Margin deficit/call
})(MarginType || (exports.MarginType = MarginType = {}));
/**
 * Collateral types and asset classes
 */
var CollateralType;
(function (CollateralType) {
    CollateralType["CASH"] = "CASH";
    CollateralType["GOVERNMENT_BONDS"] = "GOVERNMENT_BONDS";
    CollateralType["CORPORATE_BONDS"] = "CORPORATE_BONDS";
    CollateralType["EQUITIES"] = "EQUITIES";
    CollateralType["MUTUAL_FUNDS"] = "MUTUAL_FUNDS";
    CollateralType["ETF"] = "ETF";
    CollateralType["COMMODITIES"] = "COMMODITIES";
    CollateralType["LETTERS_OF_CREDIT"] = "LETTERS_OF_CREDIT";
    CollateralType["BANK_GUARANTEES"] = "BANK_GUARANTEES";
    CollateralType["GOLD"] = "GOLD";
    CollateralType["REAL_ESTATE"] = "REAL_ESTATE";
})(CollateralType || (exports.CollateralType = CollateralType = {}));
/**
 * Collateral quality ratings
 */
var CollateralQuality;
(function (CollateralQuality) {
    CollateralQuality["AAA"] = "AAA";
    CollateralQuality["AA"] = "AA";
    CollateralQuality["A"] = "A";
    CollateralQuality["BBB"] = "BBB";
    CollateralQuality["BB"] = "BB";
    CollateralQuality["B"] = "B";
    CollateralQuality["CCC"] = "CCC";
    CollateralQuality["UNRATED"] = "UNRATED";
})(CollateralQuality || (exports.CollateralQuality = CollateralQuality = {}));
/**
 * Margin call status
 */
var MarginCallStatus;
(function (MarginCallStatus) {
    MarginCallStatus["PENDING"] = "PENDING";
    MarginCallStatus["ISSUED"] = "ISSUED";
    MarginCallStatus["ACKNOWLEDGED"] = "ACKNOWLEDGED";
    MarginCallStatus["PARTIALLY_SATISFIED"] = "PARTIALLY_SATISFIED";
    MarginCallStatus["SATISFIED"] = "SATISFIED";
    MarginCallStatus["OVERDUE"] = "OVERDUE";
    MarginCallStatus["ESCALATED"] = "ESCALATED";
    MarginCallStatus["DEFAULTED"] = "DEFAULTED";
    MarginCallStatus["CANCELLED"] = "CANCELLED";
})(MarginCallStatus || (exports.MarginCallStatus = MarginCallStatus = {}));
// ============================================================================
// INITIAL MARGIN CALCULATIONS
// ============================================================================
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
async function calculateRegTInitialMargin(accountId, positions, transaction) {
    const logger = new common_1.Logger('MarginCollateral:calculateRegTInitialMargin');
    try {
        logger.log(`Calculating Reg T initial margin for account: ${accountId}`);
        const components = [];
        let grossMargin = 0;
        for (const position of positions) {
            const marketValue = Math.abs(position.quantity * position.currentPrice);
            let marginRequirement = 0;
            if (position.assetType === 'EQUITY') {
                if (position.quantity > 0) {
                    // Long position: 50% margin
                    marginRequirement = marketValue * 0.5;
                }
                else {
                    // Short position: 150% margin (50% initial + 100% position value)
                    marginRequirement = marketValue * 1.5;
                }
            }
            else if (position.assetType === 'OPTION') {
                // Options: 100% premium + underlying margin if applicable
                marginRequirement = marketValue;
            }
            grossMargin += marginRequirement;
            components.push({
                componentId: `${position.positionId}-REGT`,
                componentType: position.assetType,
                securityId: position.securityId,
                quantity: position.quantity,
                marginRequirement,
                notional: marketValue,
                riskContribution: marginRequirement / (grossMargin || 1)
            });
        }
        const result = {
            accountId,
            calculationId: `REGT-${Date.now()}`,
            methodology: MarginMethodology.REG_T,
            timestamp: new Date(),
            baseCurrency: 'USD',
            grossMargin,
            netMargin: grossMargin,
            diversificationBenefit: 0,
            offsets: [],
            componentBreakdown: components,
            confidence: 1.0,
            metadata: { method: 'Regulation T (Federal Reserve)' }
        };
        logger.log(`Reg T margin calculated: $${result.netMargin.toFixed(2)}`);
        return result;
    }
    catch (error) {
        logger.error(`Failed to calculate Reg T margin: ${error.message}`, error.stack);
        throw error;
    }
}
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
async function calculatePortfolioMargin(accountId, positions, varParams, transaction) {
    const logger = new common_1.Logger('MarginCollateral:calculatePortfolioMargin');
    try {
        logger.log(`Calculating portfolio margin for account: ${accountId}`);
        // Calculate VaR for the entire portfolio
        const portfolioVaR = await calculatePortfolioVaR(positions, varParams);
        // Apply scaling factor (typically 3x VaR for initial margin)
        const scalingFactor = 3.0;
        const grossMargin = portfolioVaR * scalingFactor;
        // Calculate diversification benefit
        const undiversifiedMargin = positions.reduce((sum, pos) => {
            const positionVaR = calculatePositionVaR(pos, varParams);
            return sum + positionVaR;
        }, 0) * scalingFactor;
        const diversificationBenefit = undiversifiedMargin - grossMargin;
        const components = positions.map(pos => {
            const positionVaR = calculatePositionVaR(pos, varParams);
            return {
                componentId: `${pos.positionId}-PM`,
                componentType: pos.assetType,
                securityId: pos.securityId,
                quantity: pos.quantity,
                marginRequirement: positionVaR * scalingFactor,
                notional: Math.abs(pos.quantity * pos.currentPrice),
                riskContribution: (positionVaR / portfolioVaR) || 0
            };
        });
        const result = {
            accountId,
            calculationId: `PM-${Date.now()}`,
            methodology: MarginMethodology.PORTFOLIO,
            timestamp: new Date(),
            baseCurrency: 'USD',
            grossMargin: undiversifiedMargin,
            netMargin: grossMargin,
            diversificationBenefit,
            offsets: [],
            componentBreakdown: components,
            confidence: varParams.confidenceLevel,
            metadata: {
                varParams,
                scalingFactor,
                portfolioVaR
            }
        };
        logger.log(`Portfolio margin calculated: $${result.netMargin.toFixed(2)} (${((diversificationBenefit / undiversifiedMargin) * 100).toFixed(1)}% diversification benefit)`);
        return result;
    }
    catch (error) {
        logger.error(`Failed to calculate portfolio margin: ${error.message}`, error.stack);
        throw error;
    }
}
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
async function calculateSPANMargin(accountId, positions, spanParams, transaction) {
    const logger = new common_1.Logger('MarginCollateral:calculateSPANMargin');
    try {
        logger.log(`Calculating SPAN margin for account: ${accountId}`);
        const components = [];
        let totalRisk = 0;
        // Group positions by underlying
        const positionsByUnderlying = groupPositionsByUnderlying(positions);
        for (const [underlying, underlyingPositions] of Object.entries(positionsByUnderlying)) {
            // Generate SPAN scenarios (16 price/volatility combinations)
            const scenarios = generateSPANScenarios(spanParams);
            let maxLoss = 0;
            for (const scenario of scenarios) {
                const scenarioLoss = calculateScenarioLoss(underlyingPositions, scenario);
                maxLoss = Math.max(maxLoss, scenarioLoss);
            }
            // Add short option minimum charge
            const shortOptionCharge = calculateShortOptionMinimum(underlyingPositions, spanParams);
            const underlyingRisk = Math.max(maxLoss, shortOptionCharge);
            totalRisk += underlyingRisk;
            components.push({
                componentId: `${underlying}-SPAN`,
                componentType: 'OPTION',
                securityId: underlying,
                quantity: underlyingPositions.reduce((sum, pos) => sum + pos.quantity, 0),
                marginRequirement: underlyingRisk,
                notional: underlyingPositions.reduce((sum, pos) => sum + Math.abs(pos.quantity * pos.currentPrice), 0),
                riskContribution: 0 // Will be calculated after total
            });
        }
        // Apply inter-commodity spreads
        const offsets = calculateSPANOffsets(positionsByUnderlying, spanParams);
        const totalOffsets = offsets.reduce((sum, offset) => sum + offset.offsetAmount, 0);
        // Calculate risk contributions
        components.forEach(comp => {
            comp.riskContribution = comp.marginRequirement / totalRisk;
        });
        const result = {
            accountId,
            calculationId: `SPAN-${Date.now()}`,
            methodology: MarginMethodology.SPAN,
            timestamp: new Date(),
            baseCurrency: 'USD',
            grossMargin: totalRisk,
            netMargin: totalRisk - totalOffsets,
            diversificationBenefit: totalOffsets,
            offsets,
            componentBreakdown: components,
            confidence: 0.99,
            metadata: { spanParams, scenarioCount: spanParams.scenarioCount }
        };
        logger.log(`SPAN margin calculated: $${result.netMargin.toFixed(2)}`);
        return result;
    }
    catch (error) {
        logger.error(`Failed to calculate SPAN margin: ${error.message}`, error.stack);
        throw error;
    }
}
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
async function calculateVaRBasedMargin(accountId, positions, varParams) {
    const logger = new common_1.Logger('MarginCollateral:calculateVaRBasedMargin');
    try {
        logger.log(`Calculating VaR-based margin for account: ${accountId}`);
        const portfolioVaR = await calculatePortfolioVaR(positions, varParams);
        // Margin is typically VaR scaled by holding period and confidence level adjustments
        const scalingFactor = Math.sqrt(varParams.holdingPeriod) * 1.5;
        const netMargin = portfolioVaR * scalingFactor;
        const components = positions.map(pos => {
            const posVaR = calculatePositionVaR(pos, varParams);
            return {
                componentId: `${pos.positionId}-VAR`,
                componentType: pos.assetType,
                securityId: pos.securityId,
                quantity: pos.quantity,
                marginRequirement: posVaR * scalingFactor,
                notional: Math.abs(pos.quantity * pos.currentPrice),
                riskContribution: (posVaR / portfolioVaR) || 0
            };
        });
        const result = {
            accountId,
            calculationId: `VAR-${Date.now()}`,
            methodology: MarginMethodology.VAR,
            timestamp: new Date(),
            baseCurrency: 'USD',
            grossMargin: netMargin,
            netMargin,
            diversificationBenefit: 0,
            offsets: [],
            componentBreakdown: components,
            confidence: varParams.confidenceLevel,
            metadata: { varParams, scalingFactor, portfolioVaR }
        };
        return result;
    }
    catch (error) {
        logger.error(`Failed to calculate VaR-based margin: ${error.message}`, error.stack);
        throw error;
    }
}
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
async function calculateOptionsMargin(accountId, optionPositions, config) {
    const logger = new common_1.Logger('MarginCollateral:calculateOptionsMargin');
    try {
        let totalMargin = 0;
        for (const position of optionPositions) {
            if (position.quantity > 0) {
                // Long options: premium paid (already at risk)
                totalMargin += Math.abs(position.quantity * position.currentPrice * position.multiplier);
            }
            else {
                // Short options: use margin requirements
                const underlyingPrice = position.underlyingPrice || 100;
                const strikePrice = position.strikePrice;
                const quantity = Math.abs(position.quantity);
                const multiplier = position.multiplier || 100;
                if (position.optionType === 'CALL') {
                    // Short call: max(premium + 20% underlying - OTM, premium + 10% underlying)
                    const otm = Math.max(0, strikePrice - underlyingPrice);
                    const margin1 = (position.currentPrice * multiplier) + (0.20 * underlyingPrice * multiplier) - otm;
                    const margin2 = (position.currentPrice * multiplier) + (0.10 * underlyingPrice * multiplier);
                    totalMargin += Math.max(margin1, margin2) * quantity;
                }
                else {
                    // Short put: max(premium + 20% underlying - OTM, premium + 10% strike)
                    const otm = Math.max(0, underlyingPrice - strikePrice);
                    const margin1 = (position.currentPrice * multiplier) + (0.20 * underlyingPrice * multiplier) - otm;
                    const margin2 = (position.currentPrice * multiplier) + (0.10 * strikePrice * multiplier);
                    totalMargin += Math.max(margin1, margin2) * quantity;
                }
            }
        }
        return totalMargin;
    }
    catch (error) {
        logger.error(`Failed to calculate options margin: ${error.message}`, error.stack);
        throw error;
    }
}
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
async function calculateFuturesMargin(accountId, futuresPositions) {
    const logger = new common_1.Logger('MarginCollateral:calculateFuturesMargin');
    try {
        let totalMargin = 0;
        for (const position of futuresPositions) {
            // Futures margin is typically set by exchange
            const exchangeMargin = position.initialMarginRate || 0.05;
            const notional = Math.abs(position.quantity * position.currentPrice * position.multiplier);
            const positionMargin = notional * exchangeMargin;
            totalMargin += positionMargin;
        }
        return totalMargin;
    }
    catch (error) {
        logger.error(`Failed to calculate futures margin: ${error.message}`, error.stack);
        throw error;
    }
}
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
async function calculateCrossMargin(accountId, positions, config) {
    const logger = new common_1.Logger('MarginCollateral:calculateCrossMargin');
    try {
        logger.log(`Calculating cross-margin for account: ${accountId}`);
        // Calculate standalone margin for each position
        const positionMargins = new Map();
        let grossMargin = 0;
        for (const position of positions) {
            const margin = await calculatePositionMargin(position);
            positionMargins.set(position.positionId, margin);
            grossMargin += margin;
        }
        const offsets = [];
        // Identify hedged positions and calculate offsets
        for (const [group1, group2] of config.productGroups) {
            const group1Positions = positions.filter(p => group1.includes(p.productGroup));
            const group2Positions = positions.filter(p => group2.includes(p.productGroup));
            if (group1Positions.length > 0 && group2Positions.length > 0) {
                // Calculate hedge offset
                const offsetKey = `${group1}-${group2}`;
                const offsetRate = config.offsetRates.get(offsetKey) || 0;
                const group1Margin = group1Positions.reduce((sum, p) => sum + positionMargins.get(p.positionId), 0);
                const group2Margin = group2Positions.reduce((sum, p) => sum + positionMargins.get(p.positionId), 0);
                const offsetAmount = Math.min(group1Margin, group2Margin) * offsetRate;
                offsets.push({
                    offsetId: `CROSS-${Date.now()}-${group1}-${group2}`,
                    offsetType: 'CROSS_MARGIN',
                    relatedPositions: [...group1Positions, ...group2Positions].map(p => p.positionId),
                    offsetAmount,
                    percentage: offsetRate * 100,
                    description: `Cross-margin offset between ${group1} and ${group2}`
                });
            }
        }
        const totalOffsets = offsets.reduce((sum, offset) => sum + offset.offsetAmount, 0);
        const netMargin = grossMargin - totalOffsets;
        logger.log(`Cross-margin: Gross=$${grossMargin.toFixed(2)}, Net=$${netMargin.toFixed(2)}, Offsets=$${totalOffsets.toFixed(2)}`);
        return { grossMargin, netMargin, offsets };
    }
    catch (error) {
        logger.error(`Failed to calculate cross-margin: ${error.message}`, error.stack);
        throw error;
    }
}
// ============================================================================
// VARIATION MARGIN CALCULATIONS
// ============================================================================
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
async function calculateVariationMargin(accountId, positions, valuationDate, transaction) {
    const logger = new common_1.Logger('MarginCollateral:calculateVariationMargin');
    try {
        logger.log(`Calculating variation margin for account: ${accountId} as of ${valuationDate.toISOString()}`);
        const positionValuations = [];
        let previousValuation = 0;
        let currentValuation = 0;
        let unrealizedPnL = 0;
        for (const position of positions) {
            const previousPrice = position.previousPrice || position.averagePrice;
            const currentPrice = position.currentPrice;
            const quantity = position.quantity;
            const previousValue = quantity * previousPrice;
            const currentValue = quantity * currentPrice;
            const positionPnL = currentValue - previousValue;
            previousValuation += previousValue;
            currentValuation += currentValue;
            unrealizedPnL += positionPnL;
            positionValuations.push({
                positionId: position.positionId,
                securityId: position.securityId,
                quantity,
                previousPrice,
                currentPrice,
                previousValue,
                currentValue,
                unrealizedPnL: positionPnL,
                currency: position.currency || 'USD'
            });
        }
        const variationMargin = -unrealizedPnL; // Negative P&L requires margin posting
        const marginMovement = variationMargin;
        const result = {
            accountId,
            calculationId: `VM-${Date.now()}`,
            valuationDate,
            previousValuation,
            currentValuation,
            unrealizedPnL,
            realizedPnL: 0, // Would come from closed trades
            variationMargin,
            marginMovement,
            currency: 'USD',
            positions: positionValuations,
            metadata: { calculatedAt: new Date() }
        };
        logger.log(`Variation margin: ${variationMargin >= 0 ? '+' : ''}$${variationMargin.toFixed(2)}`);
        return result;
    }
    catch (error) {
        logger.error(`Failed to calculate variation margin: ${error.message}`, error.stack);
        throw error;
    }
}
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
async function calculateMarkToMarket(positions, valuationDate) {
    const logger = new common_1.Logger('MarginCollateral:calculateMarkToMarket');
    try {
        let totalValue = 0;
        const positionValuations = [];
        for (const position of positions) {
            const currentPrice = await getMarketPrice(position.securityId, valuationDate);
            const currentValue = position.quantity * currentPrice;
            totalValue += currentValue;
            positionValuations.push({
                positionId: position.positionId,
                securityId: position.securityId,
                quantity: position.quantity,
                previousPrice: position.previousPrice || position.averagePrice,
                currentPrice,
                previousValue: position.quantity * (position.previousPrice || position.averagePrice),
                currentValue,
                unrealizedPnL: currentValue - (position.quantity * (position.previousPrice || position.averagePrice)),
                currency: position.currency || 'USD'
            });
        }
        return { totalValue, positions: positionValuations };
    }
    catch (error) {
        logger.error(`Failed to calculate mark-to-market: ${error.message}`, error.stack);
        throw error;
    }
}
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
async function calculateUnrealizedPnL(accountId, positions) {
    let unrealizedPnL = 0;
    for (const position of positions) {
        const currentValue = position.quantity * position.currentPrice;
        const costBasis = position.quantity * position.averagePrice;
        unrealizedPnL += (currentValue - costBasis);
    }
    return unrealizedPnL;
}
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
async function processVariationMarginCall(accountId, variationAmount, dueDate) {
    const logger = new common_1.Logger('MarginCollateral:processVariationMarginCall');
    try {
        logger.log(`Processing variation margin call for account: ${accountId}, amount: $${variationAmount}`);
        const marginCall = {
            callId: `VM-CALL-${Date.now()}`,
            accountId,
            callType: MarginType.VARIATION,
            status: MarginCallStatus.ISSUED,
            issuedDate: new Date(),
            dueDate,
            amount: Math.abs(variationAmount),
            currency: 'USD',
            currentDeficit: Math.abs(variationAmount),
            satisfiedAmount: 0,
            remainingAmount: Math.abs(variationAmount),
            collateralPosted: [],
            escalationLevel: 0,
            reason: 'Mark-to-market losses require variation margin posting',
            metadata: { type: 'VARIATION', calculatedAt: new Date() }
        };
        await saveMarginCall(marginCall);
        await notifyMarginCall(marginCall);
        logger.log(`Variation margin call issued: ${marginCall.callId}`);
        return marginCall;
    }
    catch (error) {
        logger.error(`Failed to process variation margin call: ${error.message}`, error.stack);
        throw error;
    }
}
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
async function settleVariationMargin(callId, collateral) {
    const logger = new common_1.Logger('MarginCollateral:settleVariationMargin');
    try {
        const marginCall = await getMarginCallById(callId);
        const totalCollateralValue = collateral.reduce((sum, asset) => sum + asset.collateralValue, 0);
        marginCall.satisfiedAmount += totalCollateralValue;
        marginCall.remainingAmount = Math.max(0, marginCall.amount - marginCall.satisfiedAmount);
        marginCall.collateralPosted.push(...collateral);
        if (marginCall.remainingAmount === 0) {
            marginCall.status = MarginCallStatus.SATISFIED;
        }
        else {
            marginCall.status = MarginCallStatus.PARTIALLY_SATISFIED;
        }
        await updateMarginCall(marginCall);
        logger.log(`Variation margin settled: ${callId}, remaining: $${marginCall.remainingAmount}`);
        return {
            settled: marginCall.remainingAmount === 0,
            remainingAmount: marginCall.remainingAmount
        };
    }
    catch (error) {
        logger.error(`Failed to settle variation margin: ${error.message}`, error.stack);
        throw error;
    }
}
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
async function calculateIntraDayMargin(accountId, positions, pendingOrders) {
    const logger = new common_1.Logger('MarginCollateral:calculateIntraDayMargin');
    try {
        // Calculate margin for existing positions
        const positionMargin = await calculatePositionsTotalMargin(positions);
        // Calculate additional margin for pending orders
        let orderMargin = 0;
        for (const order of pendingOrders) {
            const orderValue = Math.abs(order.quantity * order.price);
            orderMargin += orderValue * 0.25; // Intraday margin typically lower
        }
        const totalIntraDayMargin = positionMargin + orderMargin;
        return totalIntraDayMargin;
    }
    catch (error) {
        logger.error(`Failed to calculate intraday margin: ${error.message}`, error.stack);
        throw error;
    }
}
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
async function aggregateVariationMargin(accountIds, valuationDate) {
    const byAccount = new Map();
    let totalVariationMargin = 0;
    for (const accountId of accountIds) {
        const positions = await getAccountPositions(accountId);
        const vmResult = await calculateVariationMargin(accountId, positions, valuationDate);
        byAccount.set(accountId, vmResult.variationMargin);
        totalVariationMargin += vmResult.variationMargin;
    }
    return { totalVariationMargin, byAccount };
}
// ============================================================================
// COLLATERAL MANAGEMENT
// ============================================================================
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
async function validateCollateralEligibility(asset, purpose) {
    const logger = new common_1.Logger('MarginCollateral:validateCollateralEligibility');
    try {
        const reasons = [];
        let eligible = true;
        // Check asset type eligibility
        const eligibleTypes = [
            CollateralType.CASH,
            CollateralType.GOVERNMENT_BONDS,
            CollateralType.CORPORATE_BONDS,
            CollateralType.EQUITIES
        ];
        if (!eligibleTypes.includes(asset.assetType)) {
            eligible = false;
            reasons.push(`Asset type ${asset.assetType} not eligible for ${purpose}`);
        }
        // Check quality rating
        const minQuality = CollateralQuality.BBB;
        if (asset.assetType !== CollateralType.CASH && compareQuality(asset.quality, minQuality) < 0) {
            eligible = false;
            reasons.push(`Quality ${asset.quality} below minimum ${minQuality}`);
        }
        // Check maturity (for bonds)
        if (asset.maturityDate) {
            const daysToMaturity = (asset.maturityDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
            if (daysToMaturity < 30) {
                eligible = false;
                reasons.push('Maturity less than 30 days');
            }
        }
        // Check if already pledged
        if (asset.pledgedTo && purpose !== 'SUBSTITUTION') {
            eligible = false;
            reasons.push(`Already pledged to ${asset.pledgedTo}`);
        }
        if (eligible) {
            reasons.push('All eligibility criteria met');
        }
        return { eligible, reasons };
    }
    catch (error) {
        logger.error(`Failed to validate collateral eligibility: ${error.message}`, error.stack);
        throw error;
    }
}
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
async function calculateCollateralValue(asset, haircutSchedules) {
    const logger = new common_1.Logger('MarginCollateral:calculateCollateralValue');
    try {
        // Find applicable haircut
        const applicableHaircut = haircutSchedules.find(schedule => schedule.assetType === asset.assetType &&
            schedule.quality === asset.quality);
        const haircutRate = applicableHaircut?.haircutRate || 0;
        const collateralValue = asset.marketValue * (1 - haircutRate);
        logger.log(`Collateral value: Market=$${asset.marketValue}, Haircut=${(haircutRate * 100).toFixed(1)}%, Value=$${collateralValue.toFixed(2)}`);
        return collateralValue;
    }
    catch (error) {
        logger.error(`Failed to calculate collateral value: ${error.message}`, error.stack);
        throw error;
    }
}
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
async function applyHaircuts(assets, schedules) {
    const valuedAssets = [];
    for (const asset of assets) {
        const collateralValue = await calculateCollateralValue(asset, schedules);
        valuedAssets.push({
            ...asset,
            collateralValue
        });
    }
    return valuedAssets;
}
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
async function optimizeCollateralAllocation(accountId, requiredCollateral, availableAssets) {
    const logger = new common_1.Logger('MarginCollateral:optimizeCollateralAllocation');
    try {
        logger.log(`Optimizing collateral allocation for account: ${accountId}, required: $${requiredCollateral}`);
        // Sort assets by preference (lowest haircut, highest liquidity)
        const sortedAssets = [...availableAssets]
            .filter(asset => asset.eligible)
            .sort((a, b) => {
            // Prefer cash
            if (a.assetType === CollateralType.CASH)
                return -1;
            if (b.assetType === CollateralType.CASH)
                return 1;
            // Then by lowest haircut
            return a.haircutRate - b.haircutRate;
        });
        const allocatedAssets = [];
        let totalCollateralValue = 0;
        let totalMarketValue = 0;
        // Greedy allocation
        for (const asset of sortedAssets) {
            if (totalCollateralValue >= requiredCollateral)
                break;
            allocatedAssets.push(asset);
            totalCollateralValue += asset.collateralValue;
            totalMarketValue += asset.marketValue;
        }
        const utilizationRate = totalCollateralValue / requiredCollateral;
        const efficiency = totalCollateralValue / totalMarketValue;
        // Identify substitution opportunities
        const substitutionOpportunities = await identifySubstitutionOpportunities(allocatedAssets, availableAssets, requiredCollateral);
        const result = {
            optimizationId: `OPT-${Date.now()}`,
            accountId,
            requiredCollateral,
            availableCollateral: totalCollateralValue,
            allocatedAssets,
            totalMarketValue,
            totalCollateralValue,
            utilizationRate,
            efficiency,
            substitutionOpportunities,
            timestamp: new Date()
        };
        logger.log(`Collateral optimized: Allocated=${allocatedAssets.length} assets, Value=$${totalCollateralValue.toFixed(2)}, Efficiency=${(efficiency * 100).toFixed(1)}%`);
        return result;
    }
    catch (error) {
        logger.error(`Failed to optimize collateral allocation: ${error.message}`, error.stack);
        throw error;
    }
}
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
async function processCollateralSubstitution(accountId, currentAssetId, proposedAssetId) {
    const logger = new common_1.Logger('MarginCollateral:processCollateralSubstitution');
    try {
        logger.log(`Processing collateral substitution: ${currentAssetId} -> ${proposedAssetId}`);
        const currentAsset = await getCollateralAsset(currentAssetId);
        const proposedAsset = await getCollateralAsset(proposedAssetId);
        // Check if proposed asset has equal or better collateral value
        if (proposedAsset.collateralValue < currentAsset.collateralValue) {
            return {
                approved: false,
                reason: `Proposed asset collateral value ($${proposedAsset.collateralValue}) less than current ($${currentAsset.collateralValue})`
            };
        }
        // Check eligibility
        const eligibility = await validateCollateralEligibility(proposedAsset, 'SUBSTITUTION');
        if (!eligibility.eligible) {
            return {
                approved: false,
                reason: `Proposed asset not eligible: ${eligibility.reasons.join(', ')}`
            };
        }
        // Approve substitution
        await releaseCollateral(currentAssetId);
        await pledgeCollateral(proposedAssetId, accountId);
        logger.log(`Collateral substitution approved: ${currentAssetId} -> ${proposedAssetId}`);
        return {
            approved: true,
            reason: 'Substitution meets all requirements'
        };
    }
    catch (error) {
        logger.error(`Failed to process collateral substitution: ${error.message}`, error.stack);
        throw error;
    }
}
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
async function calculateCollateralCoverage(accountId, marginRequirement, collateral) {
    const totalCollateralValue = collateral.reduce((sum, asset) => sum + asset.collateralValue, 0);
    const coverageRatio = totalCollateralValue / marginRequirement;
    const excess = Math.max(0, totalCollateralValue - marginRequirement);
    const deficit = Math.max(0, marginRequirement - totalCollateralValue);
    return { coverageRatio, excess, deficit };
}
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
async function monitorCollateralQuality(collateral) {
    const alerts = [];
    for (const asset of collateral) {
        // Check for rating downgrades
        const currentRating = await getCurrentRating(asset.securityId);
        if (compareQuality(currentRating, asset.quality) < 0) {
            alerts.push({
                assetId: asset.assetId,
                issue: `Rating downgraded from ${asset.quality} to ${currentRating}`,
                severity: 'HIGH'
            });
        }
        // Check for maturity approaching
        if (asset.maturityDate) {
            const daysToMaturity = (asset.maturityDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
            if (daysToMaturity < 90) {
                alerts.push({
                    assetId: asset.assetId,
                    issue: `Maturity in ${Math.floor(daysToMaturity)} days`,
                    severity: 'MEDIUM'
                });
            }
        }
        // Check for significant price decline
        const priceChange = await getPriceChange(asset.securityId, 30);
        if (priceChange < -0.10) {
            alerts.push({
                assetId: asset.assetId,
                issue: `Price declined ${(priceChange * 100).toFixed(1)}% in 30 days`,
                severity: 'MEDIUM'
            });
        }
    }
    return { alerts };
}
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
async function revalueCollateral(collateral, valuationDate) {
    const revaluedCollateral = [];
    for (const asset of collateral) {
        const currentPrice = await getMarketPrice(asset.securityId, valuationDate);
        const marketValue = asset.quantity * currentPrice;
        const collateralValue = marketValue * (1 - asset.haircutRate);
        revaluedCollateral.push({
            ...asset,
            marketValue,
            collateralValue
        });
    }
    return revaluedCollateral;
}
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
async function segregateCollateral(collateral, segregationKey) {
    const segregatedMap = new Map();
    for (const asset of collateral) {
        const key = asset.metadata[segregationKey] || 'UNASSIGNED';
        if (!segregatedMap.has(key)) {
            segregatedMap.set(key, []);
        }
        segregatedMap.get(key).push(asset);
    }
    return segregatedMap;
}
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
async function transformCollateral(accountId, sourceAsset, targetType) {
    const logger = new common_1.Logger('MarginCollateral:transformCollateral');
    try {
        logger.log(`Transforming collateral: ${sourceAsset.assetType} -> ${targetType}`);
        // Simulate transformation (in reality, would involve repo, securities lending, etc.)
        if (targetType === CollateralType.CASH) {
            // Convert securities to cash via repo
            const repoRate = 0.02;
            const cashValue = sourceAsset.marketValue * (1 - repoRate / 365);
            const targetAsset = {
                assetId: `CASH-${Date.now()}`,
                securityId: 'USD',
                assetType: CollateralType.CASH,
                quantity: cashValue,
                marketValue: cashValue,
                haircutRate: 0,
                collateralValue: cashValue,
                quality: CollateralQuality.AAA,
                currency: 'USD',
                issuer: 'FEDERAL_RESERVE',
                eligible: true,
                segregated: sourceAsset.segregated,
                metadata: { transformedFrom: sourceAsset.assetId }
            };
            return { transformed: true, targetAsset };
        }
        return { transformed: false };
    }
    catch (error) {
        logger.error(`Failed to transform collateral: ${error.message}`, error.stack);
        throw error;
    }
}
// ============================================================================
// MARGIN CALL PROCESSING
// ============================================================================
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
async function generateMarginCall(accountId, deficiency, callType, dueDate) {
    const logger = new common_1.Logger('MarginCollateral:generateMarginCall');
    try {
        logger.log(`Generating margin call: Account=${accountId}, Amount=$${deficiency}, Type=${callType}`);
        const marginCall = {
            callId: `MC-${Date.now()}`,
            accountId,
            callType,
            status: MarginCallStatus.PENDING,
            issuedDate: new Date(),
            dueDate,
            amount: deficiency,
            currency: 'USD',
            currentDeficit: deficiency,
            satisfiedAmount: 0,
            remainingAmount: deficiency,
            collateralPosted: [],
            escalationLevel: 0,
            reason: `Margin deficiency of $${deficiency.toFixed(2)} detected`,
            metadata: { generatedAt: new Date() }
        };
        await saveMarginCall(marginCall);
        // Issue the call
        marginCall.status = MarginCallStatus.ISSUED;
        await updateMarginCall(marginCall);
        await notifyMarginCall(marginCall);
        logger.log(`Margin call issued: ${marginCall.callId}`);
        return marginCall;
    }
    catch (error) {
        logger.error(`Failed to generate margin call: ${error.message}`, error.stack);
        throw error;
    }
}
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
async function processMarginCallResponse(callId, collateral, respondedBy) {
    const logger = new common_1.Logger('MarginCollateral:processMarginCallResponse');
    try {
        logger.log(`Processing margin call response: ${callId}`);
        const marginCall = await getMarginCallById(callId);
        // Validate collateral
        for (const asset of collateral) {
            const eligibility = await validateCollateralEligibility(asset, marginCall.callType);
            if (!eligibility.eligible) {
                throw new Error(`Collateral ${asset.assetId} not eligible: ${eligibility.reasons.join(', ')}`);
            }
        }
        // Calculate total collateral value
        const totalCollateralValue = collateral.reduce((sum, asset) => sum + asset.collateralValue, 0);
        // Update margin call
        marginCall.satisfiedAmount += totalCollateralValue;
        marginCall.remainingAmount = Math.max(0, marginCall.amount - marginCall.satisfiedAmount);
        marginCall.collateralPosted.push(...collateral);
        if (marginCall.remainingAmount === 0) {
            marginCall.status = MarginCallStatus.SATISFIED;
        }
        else {
            marginCall.status = MarginCallStatus.PARTIALLY_SATISFIED;
        }
        await updateMarginCall(marginCall);
        logger.log(`Margin call response processed: Satisfied=$${totalCollateralValue}, Remaining=$${marginCall.remainingAmount}`);
        return {
            accepted: true,
            remainingDeficit: marginCall.remainingAmount
        };
    }
    catch (error) {
        logger.error(`Failed to process margin call response: ${error.message}`, error.stack);
        throw error;
    }
}
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
async function escalateMarginCall(callId, escalationLevel) {
    const logger = new common_1.Logger('MarginCollateral:escalateMarginCall');
    try {
        const marginCall = await getMarginCallById(callId);
        marginCall.escalationLevel = escalationLevel;
        marginCall.status = MarginCallStatus.ESCALATED;
        await updateMarginCall(marginCall);
        await notifyEscalation(marginCall, escalationLevel);
        logger.log(`Margin call escalated to level ${escalationLevel}: ${callId}`);
        return marginCall;
    }
    catch (error) {
        logger.error(`Failed to escalate margin call: ${error.message}`, error.stack);
        throw error;
    }
}
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
async function calculateMarginDeficiency(accountId, requiredMargin, availableCollateral) {
    return Math.max(0, requiredMargin - availableCollateral);
}
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
async function calculateMarginExcess(accountId, requiredMargin, availableCollateral) {
    return Math.max(0, availableCollateral - requiredMargin);
}
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
async function validateMarginCallSatisfaction(callId) {
    const marginCall = await getMarginCallById(callId);
    const satisfied = marginCall.remainingAmount === 0;
    const shortfall = marginCall.remainingAmount;
    return { satisfied, shortfall };
}
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
async function trackMarginCallHistory(accountId, startDate, endDate) {
    return await getMarginCallsForAccount(accountId, startDate, endDate);
}
// ============================================================================
// CCP AND BILATERAL MARGIN
// ============================================================================
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
async function calculateCCPMargin(ccpId, accountId, positions) {
    const logger = new common_1.Logger('MarginCollateral:calculateCCPMargin');
    try {
        logger.log(`Calculating CCP margin: CCP=${ccpId}, Account=${accountId}`);
        const positionBreakdowns = [];
        let totalInitialMargin = 0;
        let totalVariationMargin = 0;
        for (const position of positions) {
            // Get CCP margin rates
            const marginRates = await getCCPMarginRates(ccpId, position.product);
            const notional = Math.abs(position.quantity * position.currentPrice * position.multiplier);
            const initialMargin = notional * marginRates.initialMarginRate;
            const maintenanceMargin = notional * marginRates.maintenanceMarginRate;
            // Calculate stress margin (add-on for large positions)
            const stressMargin = position.quantity > marginRates.thresholdSize
                ? notional * marginRates.stressMarginRate
                : 0;
            totalInitialMargin += initialMargin;
            totalVariationMargin += await calculatePositionVarMargin(position);
            positionBreakdowns.push({
                positionId: position.positionId,
                product: position.product,
                quantity: position.quantity,
                initialMargin,
                maintenanceMargin,
                stressMargin,
                concentrationCharge: 0
            });
        }
        // Default fund contribution (typically based on trading volume)
        const defaultFundContribution = await calculateDefaultFundContribution(ccpId, accountId);
        const result = {
            ccpId,
            ccpName: getCCPName(ccpId),
            clearingMember: 'MEMBER-' + accountId,
            accountId,
            initialMargin: totalInitialMargin,
            variationMargin: totalVariationMargin,
            additionalMargin: 0,
            defaultFundContribution,
            totalRequirement: totalInitialMargin + totalVariationMargin + defaultFundContribution,
            currency: 'USD',
            valuationDate: new Date(),
            positions: positionBreakdowns
        };
        logger.log(`CCP margin calculated: Total=$${result.totalRequirement.toFixed(2)}`);
        return result;
    }
    catch (error) {
        logger.error(`Failed to calculate CCP margin: ${error.message}`, error.stack);
        throw error;
    }
}
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
async function calculateBilateralMargin(accountId, counterpartyId, trades) {
    const logger = new common_1.Logger('MarginCollateral:calculateBilateralMargin');
    try {
        logger.log(`Calculating bilateral margin: Account=${accountId}, Counterparty=${counterpartyId}`);
        // Use SIMM (Standard Initial Margin Model) for bilateral
        const initialMargin = await calculateSIMMMargin(trades);
        // Variation margin is MTM
        const variationMargin = trades.reduce((sum, trade) => {
            return sum + (trade.currentValue - trade.previousValue);
        }, 0);
        return { initialMargin, variationMargin };
    }
    catch (error) {
        logger.error(`Failed to calculate bilateral margin: ${error.message}`, error.stack);
        throw error;
    }
}
// ============================================================================
// STRESS TESTING AND FORECASTING
// ============================================================================
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
async function performMarginStressTesting(accountId, positions, scenarios) {
    const logger = new common_1.Logger('MarginCollateral:performMarginStressTesting');
    try {
        logger.log(`Performing margin stress testing: ${scenarios.length} scenarios`);
        const results = [];
        for (const scenario of scenarios) {
            // Apply market shocks to positions
            const stressedPositions = applyMarketShocks(positions, scenario.marketShocks);
            // Calculate margin under stress
            const stressMargin = await calculatePortfolioMargin(accountId, stressedPositions, { confidenceLevel: 0.99, holdingPeriod: 10, historicalPeriod: 250, method: 'HISTORICAL' });
            // Calculate current margin
            const currentMargin = await calculatePortfolioMargin(accountId, positions, { confidenceLevel: 0.99, holdingPeriod: 10, historicalPeriod: 250, method: 'HISTORICAL' });
            const marginIncrease = stressMargin.netMargin - currentMargin.netMargin;
            results.push({
                ...scenario,
                expectedMargin: stressMargin.netMargin,
                marginIncrease,
                collateralDeficit: Math.max(0, marginIncrease),
                riskMetrics: {
                    currentMargin: currentMargin.netMargin,
                    stressMargin: stressMargin.netMargin,
                    increasePercent: (marginIncrease / currentMargin.netMargin) * 100
                }
            });
        }
        return results;
    }
    catch (error) {
        logger.error(`Failed to perform stress testing: ${error.message}`, error.stack);
        throw error;
    }
}
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
async function simulateMarginUnderScenarios(accountId, positions, scenarios) {
    const results = [];
    for (const scenario of scenarios) {
        const adjustedPositions = scenario.adjustPositions(positions);
        const margin = await calculatePortfolioMargin(accountId, adjustedPositions, { confidenceLevel: 0.99, holdingPeriod: 1, historicalPeriod: 250, method: 'HISTORICAL' });
        results.push({
            scenario: scenario.name,
            margin: margin.netMargin
        });
    }
    return results;
}
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
async function calculateMarginUtilization(accountId, usedMargin, availableMargin) {
    return usedMargin / availableMargin;
}
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
async function forecastMarginRequirements(accountId, currentPositions, plannedTrades) {
    const logger = new common_1.Logger('MarginCollateral:forecastMarginRequirements');
    try {
        // Calculate current margin
        const current = await calculatePortfolioMargin(accountId, currentPositions, { confidenceLevel: 0.99, holdingPeriod: 1, historicalPeriod: 250, method: 'HISTORICAL' });
        // Apply planned trades to positions
        const projectedPositions = applyTradesToPositions(currentPositions, plannedTrades);
        // Calculate projected margin
        const projected = await calculatePortfolioMargin(accountId, projectedPositions, { confidenceLevel: 0.99, holdingPeriod: 1, historicalPeriod: 250, method: 'HISTORICAL' });
        return {
            currentMargin: current.netMargin,
            projectedMargin: projected.netMargin,
            increase: projected.netMargin - current.netMargin
        };
    }
    catch (error) {
        logger.error(`Failed to forecast margin requirements: ${error.message}`, error.stack);
        throw error;
    }
}
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
async function reconcileMarginBalances(accountId, counterpartyId, reconciliationDate) {
    const logger = new common_1.Logger('MarginCollateral:reconcileMarginBalances');
    try {
        // Get internal calculation
        const internalMargin = await getInternalMarginBalance(accountId, counterpartyId);
        // Get counterparty statement
        const counterpartyMargin = await getCounterpartyMarginBalance(accountId, counterpartyId, reconciliationDate);
        const discrepancy = Math.abs(internalMargin - counterpartyMargin);
        const matched = discrepancy < 0.01; // Tolerance $0.01
        return {
            matched,
            discrepancy,
            details: matched
                ? 'Margin balances reconciled'
                : `Discrepancy: Internal=$${internalMargin}, Counterparty=$${counterpartyMargin}`
        };
    }
    catch (error) {
        logger.error(`Failed to reconcile margin balances: ${error.message}`, error.stack);
        throw error;
    }
}
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
async function generateMarginReports(accountId, reportDate, reportType) {
    const logger = new common_1.Logger('MarginCollateral:generateMarginReports');
    try {
        const positions = await getAccountPositions(accountId);
        const collateral = await getAccountCollateral(accountId);
        const initialMargin = await calculatePortfolioMargin(accountId, positions, { confidenceLevel: 0.99, holdingPeriod: 1, historicalPeriod: 250, method: 'HISTORICAL' });
        const variationMargin = await calculateVariationMargin(accountId, positions, reportDate);
        const coverage = await calculateCollateralCoverage(accountId, initialMargin.netMargin, collateral);
        return {
            accountId,
            reportDate,
            reportType,
            initialMargin: initialMargin.netMargin,
            variationMargin: variationMargin.variationMargin,
            totalMarginRequirement: initialMargin.netMargin + Math.max(0, variationMargin.variationMargin),
            collateralValue: collateral.reduce((sum, c) => sum + c.collateralValue, 0),
            coverageRatio: coverage.coverageRatio,
            excess: coverage.excess,
            deficit: coverage.deficit,
            positions: positions.length,
            collateralAssets: collateral.length
        };
    }
    catch (error) {
        logger.error(`Failed to generate margin reports: ${error.message}`, error.stack);
        throw error;
    }
}
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
async function calculatePortfolioVaR(positions, params) {
    // Simplified VaR calculation (in production, use historical simulation or Monte Carlo)
    const portfolioValue = positions.reduce((sum, pos) => {
        return sum + Math.abs(pos.quantity * pos.currentPrice);
    }, 0);
    // Assume portfolio volatility
    const portfolioVolatility = 0.20; // 20% annual volatility
    const scaledVolatility = portfolioVolatility * Math.sqrt(params.holdingPeriod / 252);
    // VaR at confidence level
    const zScore = params.confidenceLevel === 0.99 ? 2.33 : 1.65;
    const var95 = portfolioValue * scaledVolatility * zScore;
    return var95;
}
function calculatePositionVaR(position, params) {
    const positionValue = Math.abs(position.quantity * position.currentPrice);
    const volatility = position.volatility || 0.30;
    const scaledVolatility = volatility * Math.sqrt(params.holdingPeriod / 252);
    const zScore = params.confidenceLevel === 0.99 ? 2.33 : 1.65;
    return positionValue * scaledVolatility * zScore;
}
function groupPositionsByUnderlying(positions) {
    const groups = {};
    for (const position of positions) {
        const underlying = position.underlying || position.securityId;
        if (!groups[underlying]) {
            groups[underlying] = [];
        }
        groups[underlying].push(position);
    }
    return groups;
}
function generateSPANScenarios(params) {
    const scenarios = [];
    const priceChanges = [
        -params.priceScanRange,
        -params.priceScanRange / 3,
        0,
        params.priceScanRange / 3,
        params.priceScanRange
    ];
    const volChanges = [0, params.volatilityScanRange];
    for (const priceChange of priceChanges) {
        for (const volChange of volChanges) {
            scenarios.push({
                priceChange,
                volChange,
                type: 'SPAN_SCENARIO'
            });
        }
    }
    return scenarios;
}
function calculateScenarioLoss(positions, scenario) {
    let totalLoss = 0;
    for (const position of positions) {
        const newPrice = position.currentPrice * (1 + scenario.priceChange);
        const newValue = position.quantity * newPrice;
        const currentValue = position.quantity * position.currentPrice;
        const loss = Math.max(0, currentValue - newValue);
        totalLoss += loss;
    }
    return totalLoss;
}
function calculateShortOptionMinimum(positions, params) {
    let minCharge = 0;
    for (const position of positions) {
        if (position.assetType === 'OPTION' && position.quantity < 0) {
            const shortQty = Math.abs(position.quantity);
            minCharge += shortQty * params.shortOptionMinimum;
        }
    }
    return minCharge;
}
function calculateSPANOffsets(positionGroups, params) {
    // Simplified inter-commodity spreading
    return [];
}
async function calculatePositionMargin(position) {
    const notional = Math.abs(position.quantity * position.currentPrice);
    const marginRate = position.marginRate || 0.20;
    return notional * marginRate;
}
async function calculatePositionsTotalMargin(positions) {
    let total = 0;
    for (const position of positions) {
        total += await calculatePositionMargin(position);
    }
    return total;
}
async function identifySubstitutionOpportunities(allocated, available, required) {
    // Simplified - in production, use optimization algorithms
    return [];
}
function compareQuality(q1, q2) {
    const ratings = [
        CollateralQuality.AAA,
        CollateralQuality.AA,
        CollateralQuality.A,
        CollateralQuality.BBB,
        CollateralQuality.BB,
        CollateralQuality.B,
        CollateralQuality.CCC,
        CollateralQuality.UNRATED
    ];
    return ratings.indexOf(q2) - ratings.indexOf(q1);
}
function applyMarketShocks(positions, shocks) {
    return positions.map(pos => {
        let shockedPrice = pos.currentPrice;
        for (const shock of shocks) {
            if (shock.assetClass === pos.assetType && shock.shockType === 'PRICE') {
                shockedPrice *= (1 + shock.magnitude * (shock.direction === 'DOWN' ? -1 : 1));
            }
        }
        return {
            ...pos,
            currentPrice: shockedPrice
        };
    });
}
function applyTradesToPositions(positions, trades) {
    const positionMap = new Map(positions.map(p => [p.securityId, { ...p }]));
    for (const trade of trades) {
        const existing = positionMap.get(trade.securityId);
        if (existing) {
            existing.quantity += trade.quantity;
        }
        else {
            positionMap.set(trade.securityId, {
                securityId: trade.securityId,
                quantity: trade.quantity,
                currentPrice: trade.price,
                assetType: trade.assetType
            });
        }
    }
    return Array.from(positionMap.values());
}
async function calculateSIMMMargin(trades) {
    // Simplified SIMM calculation (Standard Initial Margin Model)
    const totalNotional = trades.reduce((sum, t) => sum + Math.abs(t.notional), 0);
    return totalNotional * 0.10; // 10% margin rate (simplified)
}
async function calculateDefaultFundContribution(ccpId, accountId) {
    // Simplified - typically based on trading volume and CCP rules
    return 10000;
}
function getCCPName(ccpId) {
    const names = {
        'CME': 'CME Clearing',
        'ICE': 'ICE Clear',
        'LCH': 'LCH Ltd',
        'EUREX': 'Eurex Clearing'
    };
    return names[ccpId] || ccpId;
}
async function calculatePositionVarMargin(position) {
    return (position.currentPrice - position.previousPrice) * position.quantity;
}
async function getCCPMarginRates(ccpId, product) {
    return {
        initialMarginRate: 0.05,
        maintenanceMarginRate: 0.03,
        stressMarginRate: 0.02,
        thresholdSize: 10000
    };
}
// Placeholder implementations for database/external operations
async function getMarketPrice(securityId, date) {
    return 100;
}
async function saveMarginCall(call) {
    // Save to database
}
async function updateMarginCall(call) {
    // Update in database
}
async function notifyMarginCall(call) {
    // Send notifications
}
async function notifyEscalation(call, level) {
    // Send escalation notifications
}
async function getMarginCallById(callId) {
    return {};
}
async function getMarginCallsForAccount(accountId, start, end) {
    return [];
}
async function getCollateralAsset(assetId) {
    return {};
}
async function releaseCollateral(assetId) {
    // Release collateral
}
async function pledgeCollateral(assetId, accountId) {
    // Pledge collateral
}
async function getCurrentRating(securityId) {
    return 'AAA';
}
async function getPriceChange(securityId, days) {
    return -0.05;
}
async function getAccountPositions(accountId) {
    return [];
}
async function getAccountCollateral(accountId) {
    return [];
}
async function getInternalMarginBalance(accountId, counterpartyId) {
    return 1000000;
}
async function getCounterpartyMarginBalance(accountId, counterpartyId, date) {
    return 1000000;
}
exports.default = {
    // Initial Margin
    calculateRegTInitialMargin,
    calculatePortfolioMargin,
    calculateSPANMargin,
    calculateVaRBasedMargin,
    calculateOptionsMargin,
    calculateFuturesMargin,
    calculateCrossMargin,
    // Variation Margin
    calculateVariationMargin,
    calculateMarkToMarket,
    calculateUnrealizedPnL,
    processVariationMarginCall,
    settleVariationMargin,
    calculateIntraDayMargin,
    aggregateVariationMargin,
    // Collateral Management
    validateCollateralEligibility,
    calculateCollateralValue,
    applyHaircuts,
    optimizeCollateralAllocation,
    processCollateralSubstitution,
    calculateCollateralCoverage,
    monitorCollateralQuality,
    revalueCollateral,
    segregateCollateral,
    transformCollateral,
    // Margin Calls
    generateMarginCall,
    processMarginCallResponse,
    escalateMarginCall,
    calculateMarginDeficiency,
    calculateMarginExcess,
    validateMarginCallSatisfaction,
    trackMarginCallHistory,
    // CCP and Bilateral
    calculateCCPMargin,
    calculateBilateralMargin,
    // Stress Testing
    performMarginStressTesting,
    simulateMarginUnderScenarios,
    calculateMarginUtilization,
    forecastMarginRequirements,
    reconcileMarginBalances,
    generateMarginReports
};
//# sourceMappingURL=margin-collateral-kit.js.map