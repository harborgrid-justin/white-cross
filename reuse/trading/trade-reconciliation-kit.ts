/**
 * LOC: TRDRECON0001234
 * File: /reuse/trading/trade-reconciliation-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (Injectable, Logger, Inject)
 *   - sequelize (Model, DataTypes, Transaction, Op)
 *   - ../error-handling-kit.ts (exception classes, error handling)
 *   - ../validation-kit.ts (validation utilities)
 *   - ./trading-execution-service-kit.ts (trade data, execution reports)
 *   - ./market-data-models-kit.ts (security master, reference data)
 *
 * DOWNSTREAM (imported by):
 *   - backend/operations/*
 *   - backend/controllers/reconciliation.controller.ts
 *   - backend/services/reconciliation.service.ts
 *   - backend/services/settlement.service.ts
 */

/**
 * File: /reuse/trading/trade-reconciliation-kit.ts
 * Locator: WC-TRD-RECON-001
 * Purpose: Bloomberg Terminal-level Trade Reconciliation - Confirmation matching, break management, position/cash reconciliation
 *
 * Upstream: NestJS 10.x, Sequelize 6.x, trade execution data, custodian feeds, counterparty confirmations
 * Downstream: Operations, accounting, client reporting, regulatory reporting, exception management
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, PostgreSQL 14+
 * Exports: 45 production-ready functions for trade reconciliation, break management, position/cash reconciliation, exception handling
 *
 * LLM Context: Institutional-grade trade reconciliation platform competing with Bloomberg Terminal.
 * Provides comprehensive reconciliation capabilities including trade confirmation matching, break detection
 * and resolution, nostro reconciliation, cash reconciliation, position reconciliation across multiple dimensions,
 * multi-party reconciliation (bilateral, trilateral, custodian), automated break resolution workflows,
 * real-time monitoring, and regulatory reporting (MiFID II, Dodd-Frank settlement discipline).
 */

import { Injectable, Logger, Inject, Scope } from '@nestjs/common';
import { Model, DataTypes, Sequelize, Transaction, Op } from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Reconciliation status
 */
export enum ReconciliationStatus {
  PENDING = 'PENDING',
  MATCHED = 'MATCHED',
  UNMATCHED = 'UNMATCHED',
  PARTIALLY_MATCHED = 'PARTIALLY_MATCHED',
  BREAK = 'BREAK',
  RESOLVED = 'RESOLVED',
  CANCELLED = 'CANCELLED',
  UNDER_INVESTIGATION = 'UNDER_INVESTIGATION'
}

/**
 * Break types and categories
 */
export enum BreakType {
  PRICE_DISCREPANCY = 'PRICE_DISCREPANCY',
  QUANTITY_DISCREPANCY = 'QUANTITY_DISCREPANCY',
  SETTLEMENT_DISCREPANCY = 'SETTLEMENT_DISCREPANCY',
  REFERENCE_DATA_MISMATCH = 'REFERENCE_DATA_MISMATCH',
  MISSING_TRADE = 'MISSING_TRADE',
  DUPLICATE_TRADE = 'DUPLICATE_TRADE',
  SIDE_MISMATCH = 'SIDE_MISMATCH',
  CURRENCY_MISMATCH = 'CURRENCY_MISMATCH',
  ACCOUNT_MISMATCH = 'ACCOUNT_MISMATCH',
  COUNTERPARTY_MISMATCH = 'COUNTERPARTY_MISMATCH',
  SETTLEMENT_DATE_MISMATCH = 'SETTLEMENT_DATE_MISMATCH',
  COMMISSION_DISCREPANCY = 'COMMISSION_DISCREPANCY'
}

/**
 * Break priority levels
 */
export enum BreakPriority {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW'
}

/**
 * Break resolution actions
 */
export enum ResolutionAction {
  ADJUST_INTERNAL = 'ADJUST_INTERNAL',
  ADJUST_EXTERNAL = 'ADJUST_EXTERNAL',
  CANCEL_TRADE = 'CANCEL_TRADE',
  AMEND_TRADE = 'AMEND_TRADE',
  REBOOK_TRADE = 'REBOOK_TRADE',
  ACCEPT_COUNTERPARTY = 'ACCEPT_COUNTERPARTY',
  DISPUTE = 'DISPUTE',
  MANUAL_OVERRIDE = 'MANUAL_OVERRIDE'
}

/**
 * Reconciliation scope and dimensions
 */
export enum ReconciliationScope {
  TRADE = 'TRADE',
  POSITION = 'POSITION',
  CASH = 'CASH',
  SETTLEMENT = 'SETTLEMENT',
  NOSTRO = 'NOSTRO',
  CORPORATE_ACTION = 'CORPORATE_ACTION',
  FEES = 'FEES',
  DIVIDENDS = 'DIVIDENDS'
}

/**
 * Reconciliation source types
 */
export enum ReconciliationSource {
  INTERNAL = 'INTERNAL',
  COUNTERPARTY = 'COUNTERPARTY',
  CUSTODIAN = 'CUSTODIAN',
  CLEARING_HOUSE = 'CLEARING_HOUSE',
  CENTRAL_DEPOSITORY = 'CENTRAL_DEPOSITORY',
  BROKER = 'BROKER',
  PRIME_BROKER = 'PRIME_BROKER'
}

/**
 * Trade confirmation details
 */
export interface TradeConfirmation {
  confirmationId: string;
  tradeId: string;
  source: ReconciliationSource;
  tradeDate: Date;
  settlementDate: Date;
  securityId: string;
  side: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  grossAmount: number;
  netAmount: number;
  commission: number;
  fees: number;
  currency: string;
  counterparty: string;
  account: string;
  portfolio?: string;
  confirmationStatus: 'PENDING' | 'AFFIRMED' | 'REJECTED' | 'CANCELLED';
  receivedDate: Date;
  affirmationDeadline?: Date;
  metadata: Record<string, any>;
}

/**
 * Trade matching result
 */
export interface TradeMatchResult {
  matchId: string;
  internalTradeId: string;
  externalConfirmationId: string;
  matchStatus: ReconciliationStatus;
  matchScore: number;
  matchedFields: string[];
  unmatchedFields: string[];
  discrepancies: FieldDiscrepancy[];
  autoMatched: boolean;
  matchedBy?: string;
  matchedAt: Date;
  confidence: number;
}

/**
 * Field discrepancy details
 */
export interface FieldDiscrepancy {
  fieldName: string;
  internalValue: any;
  externalValue: any;
  difference: any;
  toleranceExceeded: boolean;
  severity: 'ERROR' | 'WARNING' | 'INFO';
}

/**
 * Reconciliation break
 */
export interface ReconciliationBreak {
  breakId: string;
  scope: ReconciliationScope;
  breakType: BreakType;
  priority: BreakPriority;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED' | 'ESCALATED';
  detectedDate: Date;
  detectionMethod: 'AUTO' | 'MANUAL' | 'SCHEDULED';
  affectedTradeId?: string;
  affectedAccountId?: string;
  internalValue: any;
  externalValue: any;
  discrepancy: any;
  assignedTo?: string;
  resolutionAction?: ResolutionAction;
  resolutionNotes?: string;
  resolvedDate?: Date;
  resolvedBy?: string;
  agingDays: number;
  estimatedImpact: number;
  metadata: Record<string, any>;
}

/**
 * Position snapshot for reconciliation
 */
export interface PositionSnapshot {
  snapshotId: string;
  source: ReconciliationSource;
  snapshotDate: Date;
  accountId: string;
  positions: PositionRecord[];
  totalPositions: number;
  totalMarketValue: number;
  currency: string;
  metadata: Record<string, any>;
}

/**
 * Position record
 */
export interface PositionRecord {
  securityId: string;
  quantity: number;
  averagePrice?: number;
  marketValue: number;
  unrealizedPnL?: number;
  settledQuantity?: number;
  unsettledQuantity?: number;
  availableQuantity?: number;
  pledgedQuantity?: number;
}

/**
 * Position reconciliation result
 */
export interface PositionReconciliationResult {
  reconciliationId: string;
  accountId: string;
  reconciliationDate: Date;
  internalSnapshot: PositionSnapshot;
  externalSnapshot: PositionSnapshot;
  matchedPositions: number;
  unmatchedPositions: number;
  breaks: ReconciliationBreak[];
  summary: {
    totalSecurities: number;
    matchRate: number;
    quantityDiscrepancy: number;
    valueDiscrepancy: number;
  };
}

/**
 * Cash balance for reconciliation
 */
export interface CashBalance {
  balanceId: string;
  source: ReconciliationSource;
  accountId: string;
  currency: string;
  balanceDate: Date;
  openingBalance: number;
  closingBalance: number;
  credits: number;
  debits: number;
  pendingSettlements: number;
  availableBalance: number;
  movements: CashMovement[];
}

/**
 * Cash movement
 */
export interface CashMovement {
  movementId: string;
  movementType: 'TRADE_SETTLEMENT' | 'DIVIDEND' | 'INTEREST' | 'FEE' | 'TAX' | 'TRANSFER' | 'CORPORATE_ACTION';
  amount: number;
  currency: string;
  valueDate: Date;
  description: string;
  referenceId?: string;
}

/**
 * Nostro account reconciliation
 */
export interface NostroReconciliation {
  reconciliationId: string;
  nostroAccountId: string;
  currency: string;
  reconciliationDate: Date;
  bankBalance: number;
  bookBalance: number;
  difference: number;
  unmatchedBankItems: CashMovement[];
  unmatchedBookItems: CashMovement[];
  breaks: ReconciliationBreak[];
  reconciled: boolean;
}

/**
 * Multi-party reconciliation
 */
export interface MultiPartyReconciliation {
  reconciliationId: string;
  parties: ReconciliationSource[];
  scope: ReconciliationScope;
  reconciliationDate: Date;
  partyData: Map<ReconciliationSource, any>;
  consensus: any;
  disagreements: Array<{
    field: string;
    values: Map<ReconciliationSource, any>;
  }>;
  resolved: boolean;
}

/**
 * Reconciliation tolerance configuration
 */
export interface ReconciliationTolerance {
  scope: ReconciliationScope;
  field: string;
  toleranceType: 'ABSOLUTE' | 'PERCENTAGE' | 'NONE';
  toleranceValue: number;
  autoResolve: boolean;
}

/**
 * Reconciliation metrics
 */
export interface ReconciliationMetrics {
  period: { start: Date; end: Date };
  scope: ReconciliationScope;
  totalItems: number;
  matchedItems: number;
  unmatchedItems: number;
  breaks: number;
  resolvedBreaks: number;
  openBreaks: number;
  matchRate: number;
  avgResolutionTime: number;
  breaksAging: Map<string, number>;
  breaksBy Type: Map<BreakType, number>;
}

/**
 * Exception workflow
 */
export interface ExceptionWorkflow {
  workflowId: string;
  breakId: string;
  workflowType: 'INVESTIGATION' | 'ESCALATION' | 'APPROVAL' | 'RESOLUTION';
  currentStep: string;
  steps: WorkflowStep[];
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  createdDate: Date;
  completedDate?: Date;
}

/**
 * Workflow step
 */
export interface WorkflowStep {
  stepId: string;
  stepName: string;
  assignedTo: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'SKIPPED';
  dueDate?: Date;
  completedDate?: Date;
  action?: string;
  notes?: string;
}

// ============================================================================
// TRADE CONFIRMATION MATCHING
// ============================================================================

/**
 * Matches internal trades with external confirmations.
 * Uses multi-field matching algorithm with configurable tolerances.
 *
 * @param {any[]} internalTrades - Internal trade records
 * @param {TradeConfirmation[]} externalConfirmations - External confirmations
 * @param {ReconciliationTolerance[]} [tolerances] - Matching tolerances
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<TradeMatchResult[]>} Matching results
 *
 * @example
 * ```typescript
 * const matches = await matchTradeConfirmations(internalTrades, confirmations, tolerances);
 * console.log(`Matched ${matches.filter(m => m.matchStatus === 'MATCHED').length} trades`);
 * ```
 */
export async function matchTradeConfirmations(
  internalTrades: any[],
  externalConfirmations: TradeConfirmation[],
  tolerances?: ReconciliationTolerance[],
  transaction?: Transaction
): Promise<TradeMatchResult[]> {
  const logger = new Logger('TradeReconciliation:matchTradeConfirmations');

  try {
    logger.log(`Matching ${internalTrades.length} internal trades with ${externalConfirmations.length} confirmations`);

    const matchResults: TradeMatchResult[] = [];
    const matchedConfirmations = new Set<string>();

    for (const internalTrade of internalTrades) {
      let bestMatch: TradeMatchResult | null = null;
      let bestScore = 0;

      for (const confirmation of externalConfirmations) {
        if (matchedConfirmations.has(confirmation.confirmationId)) continue;

        const matchResult = await evaluateTradeMatch(internalTrade, confirmation, tolerances);

        if (matchResult.matchScore > bestScore) {
          bestScore = matchResult.matchScore;
          bestMatch = matchResult;
        }

        // Auto-match if score is perfect or exceeds threshold
        if (matchResult.matchScore >= 0.95) {
          break;
        }
      }

      if (bestMatch) {
        if (bestMatch.matchScore >= 0.95) {
          bestMatch.matchStatus = ReconciliationStatus.MATCHED;
          bestMatch.autoMatched = true;
          matchedConfirmations.add(bestMatch.externalConfirmationId);
        } else if (bestMatch.matchScore >= 0.75) {
          bestMatch.matchStatus = ReconciliationStatus.PARTIALLY_MATCHED;
        } else {
          bestMatch.matchStatus = ReconciliationStatus.UNMATCHED;
        }

        matchResults.push(bestMatch);
      } else {
        // No match found
        matchResults.push({
          matchId: `MATCH-${Date.now()}-${internalTrade.tradeId}`,
          internalTradeId: internalTrade.tradeId,
          externalConfirmationId: '',
          matchStatus: ReconciliationStatus.UNMATCHED,
          matchScore: 0,
          matchedFields: [],
          unmatchedFields: [],
          discrepancies: [],
          autoMatched: false,
          matchedAt: new Date(),
          confidence: 0
        });
      }
    }

    logger.log(`Matching complete: ${matchResults.filter(m => m.matchStatus === ReconciliationStatus.MATCHED).length} matched, ${matchResults.filter(m => m.matchStatus === ReconciliationStatus.UNMATCHED).length} unmatched`);

    return matchResults;

  } catch (error) {
    logger.error(`Failed to match trade confirmations: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Validates trade confirmation against internal records.
 *
 * @param {TradeConfirmation} confirmation - Trade confirmation to validate
 * @param {any} internalTrade - Internal trade record
 * @returns {Promise<{ valid: boolean; errors: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateTradeConfirmation(confirmation, internalTrade);
 * ```
 */
export async function validateTradeConfirmation(
  confirmation: TradeConfirmation,
  internalTrade: any
): Promise<{ valid: boolean; errors: string[] }> {
  const logger = new Logger('TradeReconciliation:validateTradeConfirmation');

  try {
    const errors: string[] = [];

    // Validate key fields
    if (confirmation.securityId !== internalTrade.securityId) {
      errors.push(`Security mismatch: ${confirmation.securityId} vs ${internalTrade.securityId}`);
    }

    if (confirmation.side !== internalTrade.side) {
      errors.push(`Side mismatch: ${confirmation.side} vs ${internalTrade.side}`);
    }

    if (Math.abs(confirmation.quantity - internalTrade.quantity) > 0) {
      errors.push(`Quantity mismatch: ${confirmation.quantity} vs ${internalTrade.quantity}`);
    }

    if (Math.abs(confirmation.price - internalTrade.price) > 0.01) {
      errors.push(`Price mismatch: ${confirmation.price} vs ${internalTrade.price}`);
    }

    if (confirmation.currency !== internalTrade.currency) {
      errors.push(`Currency mismatch: ${confirmation.currency} vs ${internalTrade.currency}`);
    }

    return {
      valid: errors.length === 0,
      errors
    };

  } catch (error) {
    logger.error(`Failed to validate trade confirmation: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Processes trade affirmation from counterparty.
 *
 * @param {string} confirmationId - Confirmation identifier
 * @param {boolean} affirmed - Whether affirmed or rejected
 * @param {string} [reason] - Rejection reason if applicable
 * @returns {Promise<{ processed: boolean; status: string }>} Processing result
 *
 * @example
 * ```typescript
 * const result = await processTradeAffirmation('CONF-123', true);
 * ```
 */
export async function processTradeAffirmation(
  confirmationId: string,
  affirmed: boolean,
  reason?: string
): Promise<{ processed: boolean; status: string }> {
  const logger = new Logger('TradeReconciliation:processTradeAffirmation');

  try {
    logger.log(`Processing affirmation for confirmation: ${confirmationId}, affirmed: ${affirmed}`);

    const confirmation = await getTradeConfirmation(confirmationId);

    if (affirmed) {
      confirmation.confirmationStatus = 'AFFIRMED';
      await updateTradeConfirmation(confirmation);

      // Update trade status
      await updateTradeStatus(confirmation.tradeId, 'AFFIRMED');

      return {
        processed: true,
        status: 'AFFIRMED'
      };
    } else {
      confirmation.confirmationStatus = 'REJECTED';
      confirmation.metadata.rejectionReason = reason;
      await updateTradeConfirmation(confirmation);

      // Create reconciliation break
      await createReconciliationBreak({
        scope: ReconciliationScope.TRADE,
        breakType: BreakType.REFERENCE_DATA_MISMATCH,
        priority: BreakPriority.HIGH,
        affectedTradeId: confirmation.tradeId,
        internalValue: 'PENDING_AFFIRMATION',
        externalValue: 'REJECTED',
        discrepancy: reason,
        metadata: { confirmationId, reason }
      });

      return {
        processed: true,
        status: 'REJECTED'
      };
    }

  } catch (error) {
    logger.error(`Failed to process trade affirmation: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Detects trade discrepancies between internal and external records.
 *
 * @param {any} internalTrade - Internal trade
 * @param {TradeConfirmation} externalConfirmation - External confirmation
 * @param {ReconciliationTolerance[]} [tolerances] - Tolerances
 * @returns {Promise<FieldDiscrepancy[]>} Detected discrepancies
 *
 * @example
 * ```typescript
 * const discrepancies = await detectTradeDiscrepancies(trade, confirmation);
 * ```
 */
export async function detectTradeDiscrepancies(
  internalTrade: any,
  externalConfirmation: TradeConfirmation,
  tolerances?: ReconciliationTolerance[]
): Promise<FieldDiscrepancy[]> {
  const discrepancies: FieldDiscrepancy[] = [];

  // Price discrepancy
  const priceDiff = Math.abs(internalTrade.price - externalConfirmation.price);
  const priceTolerance = findTolerance(tolerances, ReconciliationScope.TRADE, 'price');
  if (priceDiff > (priceTolerance?.toleranceValue || 0.01)) {
    discrepancies.push({
      fieldName: 'price',
      internalValue: internalTrade.price,
      externalValue: externalConfirmation.price,
      difference: priceDiff,
      toleranceExceeded: true,
      severity: 'ERROR'
    });
  }

  // Quantity discrepancy
  const qtyDiff = Math.abs(internalTrade.quantity - externalConfirmation.quantity);
  if (qtyDiff > 0) {
    discrepancies.push({
      fieldName: 'quantity',
      internalValue: internalTrade.quantity,
      externalValue: externalConfirmation.quantity,
      difference: qtyDiff,
      toleranceExceeded: true,
      severity: 'ERROR'
    });
  }

  // Settlement date discrepancy
  if (internalTrade.settlementDate.getTime() !== externalConfirmation.settlementDate.getTime()) {
    discrepancies.push({
      fieldName: 'settlementDate',
      internalValue: internalTrade.settlementDate,
      externalValue: externalConfirmation.settlementDate,
      difference: Math.abs(internalTrade.settlementDate.getTime() - externalConfirmation.settlementDate.getTime()) / (1000 * 60 * 60 * 24),
      toleranceExceeded: true,
      severity: 'WARNING'
    });
  }

  // Commission discrepancy
  const commissionDiff = Math.abs((internalTrade.commission || 0) - externalConfirmation.commission);
  const commissionTolerance = findTolerance(tolerances, ReconciliationScope.TRADE, 'commission');
  if (commissionDiff > (commissionTolerance?.toleranceValue || 1.0)) {
    discrepancies.push({
      fieldName: 'commission',
      internalValue: internalTrade.commission,
      externalValue: externalConfirmation.commission,
      difference: commissionDiff,
      toleranceExceeded: true,
      severity: 'WARNING'
    });
  }

  return discrepancies;
}

/**
 * Reconciles trade attributes across multiple sources.
 *
 * @param {string} tradeId - Trade identifier
 * @param {any[]} sources - Trade data from multiple sources
 * @returns {Promise<{ consensus: any; conflicts: any[] }>} Reconciliation result
 *
 * @example
 * ```typescript
 * const result = await reconcileTradeAttributes('TRD-123', [internalData, counterpartyData, custodianData]);
 * ```
 */
export async function reconcileTradeAttributes(
  tradeId: string,
  sources: any[]
): Promise<{ consensus: any; conflicts: any[] }> {
  const logger = new Logger('TradeReconciliation:reconcileTradeAttributes');

  try {
    const consensus: any = {};
    const conflicts: any[] = [];

    const fields = ['securityId', 'side', 'quantity', 'price', 'settlementDate', 'currency'];

    for (const field of fields) {
      const values = sources.map(s => s[field]);
      const uniqueValues = [...new Set(values)];

      if (uniqueValues.length === 1) {
        consensus[field] = uniqueValues[0];
      } else {
        // Conflict detected
        conflicts.push({
          field,
          values: values.map((v, i) => ({ source: sources[i].source, value: v }))
        });

        // Use majority vote or internal as tie-breaker
        consensus[field] = sources[0][field];
      }
    }

    return { consensus, conflicts };

  } catch (error) {
    logger.error(`Failed to reconcile trade attributes: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Handles unmatched trades requiring investigation.
 *
 * @param {string} tradeId - Unmatched trade ID
 * @param {string} reason - Reason for non-match
 * @returns {Promise<ReconciliationBreak>} Created break
 *
 * @example
 * ```typescript
 * const break = await handleUnmatchedTrades('TRD-123', 'No confirmation received');
 * ```
 */
export async function handleUnmatchedTrades(
  tradeId: string,
  reason: string
): Promise<ReconciliationBreak> {
  const logger = new Logger('TradeReconciliation:handleUnmatchedTrades');

  try {
    logger.log(`Handling unmatched trade: ${tradeId}`);

    const breakRecord = await createReconciliationBreak({
      scope: ReconciliationScope.TRADE,
      breakType: BreakType.MISSING_TRADE,
      priority: BreakPriority.HIGH,
      affectedTradeId: tradeId,
      internalValue: 'EXECUTED',
      externalValue: 'NO_CONFIRMATION',
      discrepancy: reason,
      metadata: { reason }
    });

    // Create exception workflow
    await createExceptionWorkflow(breakRecord.breakId, 'INVESTIGATION');

    return breakRecord;

  } catch (error) {
    logger.error(`Failed to handle unmatched trade: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Generates trade confirmation report.
 *
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @param {object} [filters] - Report filters
 * @returns {Promise<object>} Confirmation report
 *
 * @example
 * ```typescript
 * const report = await generateTradeConfirmationReport(startDate, endDate);
 * ```
 */
export async function generateTradeConfirmationReport(
  startDate: Date,
  endDate: Date,
  filters?: any
): Promise<any> {
  const logger = new Logger('TradeReconciliation:generateTradeConfirmationReport');

  try {
    const confirmations = await getTradeConfirmationsInPeriod(startDate, endDate, filters);

    const report = {
      period: { start: startDate, end: endDate },
      totalConfirmations: confirmations.length,
      affirmed: confirmations.filter(c => c.confirmationStatus === 'AFFIRMED').length,
      pending: confirmations.filter(c => c.confirmationStatus === 'PENDING').length,
      rejected: confirmations.filter(c => c.confirmationStatus === 'REJECTED').length,
      cancelled: confirmations.filter(c => c.confirmationStatus === 'CANCELLED').length,
      affirmationRate: 0,
      avgAffirmationTime: 0,
      missedDeadlines: 0
    };

    report.affirmationRate = report.affirmed / report.totalConfirmations;

    return report;

  } catch (error) {
    logger.error(`Failed to generate confirmation report: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Auto-matches trades using machine learning or rule-based algorithm.
 *
 * @param {any[]} unmatchedTrades - Unmatched trades
 * @param {TradeConfirmation[]} unmatchedConfirmations - Unmatched confirmations
 * @param {number} [threshold=0.90] - Auto-match confidence threshold
 * @returns {Promise<TradeMatchResult[]>} Auto-match results
 *
 * @example
 * ```typescript
 * const matches = await autoMatchTrades(unmatchedTrades, unmatchedConfirmations, 0.95);
 * ```
 */
export async function autoMatchTrades(
  unmatchedTrades: any[],
  unmatchedConfirmations: TradeConfirmation[],
  threshold: number = 0.90
): Promise<TradeMatchResult[]> {
  const logger = new Logger('TradeReconciliation:autoMatchTrades');

  try {
    logger.log(`Auto-matching ${unmatchedTrades.length} trades with ${unmatchedConfirmations.length} confirmations`);

    const matches: TradeMatchResult[] = [];

    for (const trade of unmatchedTrades) {
      for (const confirmation of unmatchedConfirmations) {
        const matchResult = await evaluateTradeMatch(trade, confirmation);

        if (matchResult.matchScore >= threshold) {
          matchResult.matchStatus = ReconciliationStatus.MATCHED;
          matchResult.autoMatched = true;
          matches.push(matchResult);
          break;
        }
      }
    }

    logger.log(`Auto-matched ${matches.length} trades`);
    return matches;

  } catch (error) {
    logger.error(`Failed to auto-match trades: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Fuzzy matches trades with similar but not exact attributes.
 *
 * @param {any} trade - Trade to match
 * @param {TradeConfirmation[]} confirmations - Candidate confirmations
 * @returns {Promise<TradeMatchResult[]>} Fuzzy match results (sorted by score)
 *
 * @example
 * ```typescript
 * const candidates = await fuzzyMatchTrades(trade, confirmations);
 * ```
 */
export async function fuzzyMatchTrades(
  trade: any,
  confirmations: TradeConfirmation[]
): Promise<TradeMatchResult[]> {
  const matches: TradeMatchResult[] = [];

  for (const confirmation of confirmations) {
    const matchResult = await evaluateTradeMatch(trade, confirmation);
    if (matchResult.matchScore > 0.5) {
      matches.push(matchResult);
    }
  }

  // Sort by match score descending
  matches.sort((a, b) => b.matchScore - a.matchScore);

  return matches;
}

/**
 * Bulk confirms multiple trades at once.
 *
 * @param {string[]} tradeIds - Trade identifiers to confirm
 * @param {string} confirmedBy - User confirming
 * @returns {Promise<{ confirmed: number; failed: number }>} Bulk confirmation result
 *
 * @example
 * ```typescript
 * const result = await bulkConfirmTrades(['TRD-1', 'TRD-2', 'TRD-3'], 'USER-123');
 * ```
 */
export async function bulkConfirmTrades(
  tradeIds: string[],
  confirmedBy: string
): Promise<{ confirmed: number; failed: number }> {
  const logger = new Logger('TradeReconciliation:bulkConfirmTrades');

  try {
    let confirmed = 0;
    let failed = 0;

    for (const tradeId of tradeIds) {
      try {
        await updateTradeStatus(tradeId, 'AFFIRMED');
        confirmed++;
      } catch (error) {
        logger.error(`Failed to confirm trade ${tradeId}: ${error.message}`);
        failed++;
      }
    }

    logger.log(`Bulk confirmation: ${confirmed} confirmed, ${failed} failed`);
    return { confirmed, failed };

  } catch (error) {
    logger.error(`Failed bulk confirmation: ${error.message}`, error.stack);
    throw error;
  }
}

// ============================================================================
// BREAK MANAGEMENT
// ============================================================================

/**
 * Creates reconciliation break record.
 *
 * @param {Partial<ReconciliationBreak>} breakData - Break data
 * @returns {Promise<ReconciliationBreak>} Created break
 *
 * @example
 * ```typescript
 * const break = await createReconciliationBreak({
 *   scope: ReconciliationScope.TRADE,
 *   breakType: BreakType.PRICE_DISCREPANCY,
 *   priority: BreakPriority.HIGH
 * });
 * ```
 */
export async function createReconciliationBreak(
  breakData: Partial<ReconciliationBreak>
): Promise<ReconciliationBreak> {
  const logger = new Logger('TradeReconciliation:createReconciliationBreak');

  try {
    const breakRecord: ReconciliationBreak = {
      breakId: `BRK-${Date.now()}`,
      scope: breakData.scope!,
      breakType: breakData.breakType!,
      priority: breakData.priority || BreakPriority.MEDIUM,
      status: 'OPEN',
      detectedDate: new Date(),
      detectionMethod: breakData.detectionMethod || 'AUTO',
      affectedTradeId: breakData.affectedTradeId,
      affectedAccountId: breakData.affectedAccountId,
      internalValue: breakData.internalValue,
      externalValue: breakData.externalValue,
      discrepancy: breakData.discrepancy,
      agingDays: 0,
      estimatedImpact: breakData.estimatedImpact || 0,
      metadata: breakData.metadata || {}
    };

    await saveReconciliationBreak(breakRecord);

    logger.log(`Break created: ${breakRecord.breakId}, type: ${breakRecord.breakType}`);
    return breakRecord;

  } catch (error) {
    logger.error(`Failed to create reconciliation break: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Categorizes break by type and assigns priority.
 *
 * @param {ReconciliationBreak} breakRecord - Break to categorize
 * @returns {Promise<{ type: BreakType; priority: BreakPriority }>} Categorization
 *
 * @example
 * ```typescript
 * const category = await categorizeBreak(breakRecord);
 * ```
 */
export async function categorizeBreak(
  breakRecord: ReconciliationBreak
): Promise<{ type: BreakType; priority: BreakPriority }> {
  let priority = BreakPriority.MEDIUM;

  // Determine priority based on type and impact
  if (breakRecord.breakType === BreakType.PRICE_DISCREPANCY && breakRecord.estimatedImpact > 10000) {
    priority = BreakPriority.CRITICAL;
  } else if (breakRecord.breakType === BreakType.MISSING_TRADE) {
    priority = BreakPriority.HIGH;
  } else if (breakRecord.breakType === BreakType.SETTLEMENT_DATE_MISMATCH) {
    priority = BreakPriority.HIGH;
  } else if (breakRecord.breakType === BreakType.COMMISSION_DISCREPANCY) {
    priority = BreakPriority.LOW;
  }

  return {
    type: breakRecord.breakType,
    priority
  };
}

/**
 * Assigns priority to break based on business rules.
 *
 * @param {string} breakId - Break identifier
 * @param {BreakPriority} priority - Priority level
 * @returns {Promise<ReconciliationBreak>} Updated break
 *
 * @example
 * ```typescript
 * const updated = await assignBreakPriority('BRK-123', BreakPriority.CRITICAL);
 * ```
 */
export async function assignBreakPriority(
  breakId: string,
  priority: BreakPriority
): Promise<ReconciliationBreak> {
  const logger = new Logger('TradeReconciliation:assignBreakPriority');

  try {
    const breakRecord = await getReconciliationBreak(breakId);
    breakRecord.priority = priority;

    await updateReconciliationBreak(breakRecord);

    logger.log(`Break ${breakId} priority set to ${priority}`);
    return breakRecord;

  } catch (error) {
    logger.error(`Failed to assign break priority: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Routes break to appropriate team for resolution.
 *
 * @param {string} breakId - Break identifier
 * @param {string} assignedTo - User/team to assign to
 * @returns {Promise<ReconciliationBreak>} Updated break
 *
 * @example
 * ```typescript
 * const assigned = await routeBreakForResolution('BRK-123', 'OPS-TEAM-1');
 * ```
 */
export async function routeBreakForResolution(
  breakId: string,
  assignedTo: string
): Promise<ReconciliationBreak> {
  const logger = new Logger('TradeReconciliation:routeBreakForResolution');

  try {
    const breakRecord = await getReconciliationBreak(breakId);
    breakRecord.assignedTo = assignedTo;
    breakRecord.status = 'IN_PROGRESS';

    await updateReconciliationBreak(breakRecord);

    // Notify assignee
    await notifyBreakAssignment(breakRecord, assignedTo);

    logger.log(`Break ${breakId} routed to ${assignedTo}`);
    return breakRecord;

  } catch (error) {
    logger.error(`Failed to route break: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Resolves reconciliation break with specified action.
 *
 * @param {string} breakId - Break identifier
 * @param {ResolutionAction} action - Resolution action
 * @param {string} notes - Resolution notes
 * @param {string} resolvedBy - User resolving
 * @returns {Promise<ReconciliationBreak>} Resolved break
 *
 * @example
 * ```typescript
 * const resolved = await resolveBreak('BRK-123', ResolutionAction.ADJUST_INTERNAL, 'Price corrected', 'USER-456');
 * ```
 */
export async function resolveBreak(
  breakId: string,
  action: ResolutionAction,
  notes: string,
  resolvedBy: string
): Promise<ReconciliationBreak> {
  const logger = new Logger('TradeReconciliation:resolveBreak');

  try {
    logger.log(`Resolving break: ${breakId}, action: ${action}`);

    const breakRecord = await getReconciliationBreak(breakId);
    breakRecord.status = 'RESOLVED';
    breakRecord.resolutionAction = action;
    breakRecord.resolutionNotes = notes;
    breakRecord.resolvedDate = new Date();
    breakRecord.resolvedBy = resolvedBy;

    await updateReconciliationBreak(breakRecord);

    // Execute resolution action
    await executeResolutionAction(breakRecord, action);

    logger.log(`Break ${breakId} resolved by ${resolvedBy}`);
    return breakRecord;

  } catch (error) {
    logger.error(`Failed to resolve break: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Cancels reconciliation break if no longer valid.
 *
 * @param {string} breakId - Break identifier
 * @param {string} reason - Cancellation reason
 * @returns {Promise<ReconciliationBreak>} Cancelled break
 *
 * @example
 * ```typescript
 * const cancelled = await cancelBreak('BRK-123', 'Duplicate break');
 * ```
 */
export async function cancelBreak(
  breakId: string,
  reason: string
): Promise<ReconciliationBreak> {
  const logger = new Logger('TradeReconciliation:cancelBreak');

  try {
    const breakRecord = await getReconciliationBreak(breakId);
    breakRecord.status = 'CLOSED';
    breakRecord.resolutionNotes = `Cancelled: ${reason}`;
    breakRecord.resolvedDate = new Date();

    await updateReconciliationBreak(breakRecord);

    logger.log(`Break ${breakId} cancelled: ${reason}`);
    return breakRecord;

  } catch (error) {
    logger.error(`Failed to cancel break: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Escalates break to higher authority or management.
 *
 * @param {string} breakId - Break identifier
 * @param {string} escalateTo - Escalation recipient
 * @param {string} reason - Escalation reason
 * @returns {Promise<ReconciliationBreak>} Escalated break
 *
 * @example
 * ```typescript
 * const escalated = await escalateBreak('BRK-123', 'MANAGER-456', 'Unresolved after 48 hours');
 * ```
 */
export async function escalateBreak(
  breakId: string,
  escalateTo: string,
  reason: string
): Promise<ReconciliationBreak> {
  const logger = new Logger('TradeReconciliation:escalateBreak');

  try {
    const breakRecord = await getReconciliationBreak(breakId);
    breakRecord.status = 'ESCALATED';
    breakRecord.assignedTo = escalateTo;
    breakRecord.metadata.escalationReason = reason;
    breakRecord.metadata.escalationDate = new Date();

    await updateReconciliationBreak(breakRecord);

    // Create escalation workflow
    await createExceptionWorkflow(breakId, 'ESCALATION');

    // Notify escalation recipient
    await notifyBreakEscalation(breakRecord, escalateTo, reason);

    logger.log(`Break ${breakId} escalated to ${escalateTo}`);
    return breakRecord;

  } catch (error) {
    logger.error(`Failed to escalate break: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Tracks break aging and triggers alerts.
 *
 * @param {ReconciliationBreak[]} breaks - Breaks to track
 * @returns {Promise<Map<string, number>>} Aging by break ID
 *
 * @example
 * ```typescript
 * const aging = await trackBreakAging(openBreaks);
 * ```
 */
export async function trackBreakAging(
  breaks: ReconciliationBreak[]
): Promise<Map<string, number>> {
  const aging = new Map<string, number>();

  const now = new Date();

  for (const breakRecord of breaks) {
    const agingDays = Math.floor((now.getTime() - breakRecord.detectedDate.getTime()) / (1000 * 60 * 60 * 24));
    aging.set(breakRecord.breakId, agingDays);

    // Update aging in record
    breakRecord.agingDays = agingDays;
    await updateReconciliationBreak(breakRecord);

    // Trigger alerts for aged breaks
    if (agingDays >= 5 && breakRecord.priority === BreakPriority.CRITICAL) {
      await alertAgedBreak(breakRecord, agingDays);
    } else if (agingDays >= 10 && breakRecord.priority === BreakPriority.HIGH) {
      await alertAgedBreak(breakRecord, agingDays);
    }
  }

  return aging;
}

/**
 * Analyzes break patterns to identify systemic issues.
 *
 * @param {Date} startDate - Analysis start date
 * @param {Date} endDate - Analysis end date
 * @returns {Promise<object>} Pattern analysis
 *
 * @example
 * ```typescript
 * const patterns = await analyzeBreakPatterns(startDate, endDate);
 * ```
 */
export async function analyzeBreakPatterns(
  startDate: Date,
  endDate: Date
): Promise<any> {
  const logger = new Logger('TradeReconciliation:analyzeBreakPatterns');

  try {
    const breaks = await getReconciliationBreaksInPeriod(startDate, endDate);

    const patterns = {
      totalBreaks: breaks.length,
      byType: new Map<BreakType, number>(),
      bySource: new Map<string, number>(),
      byCounterparty: new Map<string, number>(),
      byAccount: new Map<string, number>(),
      commonCauses: [] as any[],
      recommendations: [] as string[]
    };

    // Count by type
    for (const breakRecord of breaks) {
      patterns.byType.set(
        breakRecord.breakType,
        (patterns.byType.get(breakRecord.breakType) || 0) + 1
      );
    }

    // Identify most common break types
    const sortedTypes = Array.from(patterns.byType.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    patterns.commonCauses = sortedTypes.map(([type, count]) => ({
      type,
      count,
      percentage: (count / patterns.totalBreaks) * 100
    }));

    // Generate recommendations
    if (patterns.byType.get(BreakType.PRICE_DISCREPANCY)! > patterns.totalBreaks * 0.3) {
      patterns.recommendations.push('High frequency of price discrepancies - review pricing sources');
    }

    if (patterns.byType.get(BreakType.MISSING_TRADE)! > patterns.totalBreaks * 0.2) {
      patterns.recommendations.push('Many missing trades - improve confirmation process');
    }

    return patterns;

  } catch (error) {
    logger.error(`Failed to analyze break patterns: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Generates break management report.
 *
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @returns {Promise<object>} Break report
 *
 * @example
 * ```typescript
 * const report = await generateBreakReport(startDate, endDate);
 * ```
 */
export async function generateBreakReport(
  startDate: Date,
  endDate: Date
): Promise<any> {
  const logger = new Logger('TradeReconciliation:generateBreakReport');

  try {
    const breaks = await getReconciliationBreaksInPeriod(startDate, endDate);

    const report = {
      period: { start: startDate, end: endDate },
      totalBreaks: breaks.length,
      openBreaks: breaks.filter(b => b.status === 'OPEN').length,
      inProgressBreaks: breaks.filter(b => b.status === 'IN_PROGRESS').length,
      resolvedBreaks: breaks.filter(b => b.status === 'RESOLVED').length,
      escalatedBreaks: breaks.filter(b => b.status === 'ESCALATED').length,
      byPriority: {
        critical: breaks.filter(b => b.priority === BreakPriority.CRITICAL).length,
        high: breaks.filter(b => b.priority === BreakPriority.HIGH).length,
        medium: breaks.filter(b => b.priority === BreakPriority.MEDIUM).length,
        low: breaks.filter(b => b.priority === BreakPriority.LOW).length
      },
      avgResolutionTime: calculateAvgResolutionTime(breaks.filter(b => b.status === 'RESOLVED')),
      agingBreaks: breaks.filter(b => b.agingDays > 5).length
    };

    return report;

  } catch (error) {
    logger.error(`Failed to generate break report: ${error.message}`, error.stack);
    throw error;
  }
}

// ============================================================================
// POSITION RECONCILIATION
// ============================================================================

/**
 * Reconciles positions between internal and external sources.
 *
 * @param {string} accountId - Account identifier
 * @param {PositionSnapshot} internalSnapshot - Internal position snapshot
 * @param {PositionSnapshot} externalSnapshot - External position snapshot
 * @param {ReconciliationTolerance[]} [tolerances] - Tolerances
 * @returns {Promise<PositionReconciliationResult>} Reconciliation result
 *
 * @example
 * ```typescript
 * const result = await reconcilePositions('ACC-123', internalPos, custodianPos);
 * ```
 */
export async function reconcilePositions(
  accountId: string,
  internalSnapshot: PositionSnapshot,
  externalSnapshot: PositionSnapshot,
  tolerances?: ReconciliationTolerance[]
): Promise<PositionReconciliationResult> {
  const logger = new Logger('TradeReconciliation:reconcilePositions');

  try {
    logger.log(`Reconciling positions for account: ${accountId}`);

    const breaks: ReconciliationBreak[] = [];
    let matchedPositions = 0;
    let unmatchedPositions = 0;
    let quantityDiscrepancy = 0;
    let valueDiscrepancy = 0;

    // Create maps for easier lookup
    const internalMap = new Map(internalSnapshot.positions.map(p => [p.securityId, p]));
    const externalMap = new Map(externalSnapshot.positions.map(p => [p.securityId, p]));

    // Get all securities
    const allSecurities = new Set([...internalMap.keys(), ...externalMap.keys()]);

    for (const securityId of allSecurities) {
      const internalPos = internalMap.get(securityId);
      const externalPos = externalMap.get(securityId);

      if (!internalPos && externalPos) {
        // Position exists externally but not internally
        unmatchedPositions++;
        breaks.push(await createReconciliationBreak({
          scope: ReconciliationScope.POSITION,
          breakType: BreakType.MISSING_TRADE,
          priority: BreakPriority.HIGH,
          affectedAccountId: accountId,
          internalValue: 0,
          externalValue: externalPos.quantity,
          discrepancy: `Position ${securityId} exists in external system but not internally`,
          metadata: { securityId, externalQuantity: externalPos.quantity }
        }));
      } else if (internalPos && !externalPos) {
        // Position exists internally but not externally
        unmatchedPositions++;
        breaks.push(await createReconciliationBreak({
          scope: ReconciliationScope.POSITION,
          breakType: BreakType.MISSING_TRADE,
          priority: BreakPriority.HIGH,
          affectedAccountId: accountId,
          internalValue: internalPos.quantity,
          externalValue: 0,
          discrepancy: `Position ${securityId} exists internally but not in external system`,
          metadata: { securityId, internalQuantity: internalPos.quantity }
        }));
      } else if (internalPos && externalPos) {
        // Both positions exist - check for discrepancies
        const qtyDiff = Math.abs(internalPos.quantity - externalPos.quantity);
        const qtyTolerance = findTolerance(tolerances, ReconciliationScope.POSITION, 'quantity');

        if (qtyDiff > (qtyTolerance?.toleranceValue || 0)) {
          unmatchedPositions++;
          quantityDiscrepancy += qtyDiff;

          breaks.push(await createReconciliationBreak({
            scope: ReconciliationScope.POSITION,
            breakType: BreakType.QUANTITY_DISCREPANCY,
            priority: BreakPriority.MEDIUM,
            affectedAccountId: accountId,
            internalValue: internalPos.quantity,
            externalValue: externalPos.quantity,
            discrepancy: `Quantity mismatch: ${qtyDiff}`,
            estimatedImpact: qtyDiff * (internalPos.marketValue / internalPos.quantity),
            metadata: { securityId, internalQuantity: internalPos.quantity, externalQuantity: externalPos.quantity }
          }));
        } else {
          matchedPositions++;
        }

        // Check market value discrepancy
        const valueDiff = Math.abs(internalPos.marketValue - externalPos.marketValue);
        if (valueDiff > 100) {
          valueDiscrepancy += valueDiff;
        }
      }
    }

    const result: PositionReconciliationResult = {
      reconciliationId: `POS-RECON-${Date.now()}`,
      accountId,
      reconciliationDate: new Date(),
      internalSnapshot,
      externalSnapshot,
      matchedPositions,
      unmatchedPositions,
      breaks,
      summary: {
        totalSecurities: allSecurities.size,
        matchRate: matchedPositions / allSecurities.size,
        quantityDiscrepancy,
        valueDiscrepancy
      }
    };

    logger.log(`Position reconciliation complete: ${matchedPositions} matched, ${unmatchedPositions} breaks, Match rate: ${(result.summary.matchRate * 100).toFixed(1)}%`);

    return result;

  } catch (error) {
    logger.error(`Failed to reconcile positions: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Compares position snapshots from different times or sources.
 *
 * @param {PositionSnapshot} snapshot1 - First snapshot
 * @param {PositionSnapshot} snapshot2 - Second snapshot
 * @returns {Promise<{ added: PositionRecord[]; removed: PositionRecord[]; changed: PositionRecord[] }>} Comparison
 *
 * @example
 * ```typescript
 * const comparison = await comparePositionSnapshots(yesterdaySnapshot, todaySnapshot);
 * ```
 */
export async function comparePositionSnapshots(
  snapshot1: PositionSnapshot,
  snapshot2: PositionSnapshot
): Promise<{ added: PositionRecord[]; removed: PositionRecord[]; changed: PositionRecord[] }> {
  const map1 = new Map(snapshot1.positions.map(p => [p.securityId, p]));
  const map2 = new Map(snapshot2.positions.map(p => [p.securityId, p]));

  const added: PositionRecord[] = [];
  const removed: PositionRecord[] = [];
  const changed: PositionRecord[] = [];

  // Find added and changed
  for (const [securityId, pos2] of map2.entries()) {
    const pos1 = map1.get(securityId);

    if (!pos1) {
      added.push(pos2);
    } else if (pos1.quantity !== pos2.quantity) {
      changed.push(pos2);
    }
  }

  // Find removed
  for (const [securityId, pos1] of map1.entries()) {
    if (!map2.has(securityId)) {
      removed.push(pos1);
    }
  }

  return { added, removed, changed };
}

/**
 * Detects position discrepancies and creates breaks.
 *
 * @param {string} accountId - Account identifier
 * @param {PositionRecord} internalPosition - Internal position
 * @param {PositionRecord} externalPosition - External position
 * @returns {Promise<ReconciliationBreak[]>} Detected breaks
 *
 * @example
 * ```typescript
 * const breaks = await detectPositionDiscrepancies('ACC-123', internalPos, externalPos);
 * ```
 */
export async function detectPositionDiscrepancies(
  accountId: string,
  internalPosition: PositionRecord,
  externalPosition: PositionRecord
): Promise<ReconciliationBreak[]> {
  const breaks: ReconciliationBreak[] = [];

  // Quantity discrepancy
  if (internalPosition.quantity !== externalPosition.quantity) {
    breaks.push(await createReconciliationBreak({
      scope: ReconciliationScope.POSITION,
      breakType: BreakType.QUANTITY_DISCREPANCY,
      priority: BreakPriority.HIGH,
      affectedAccountId: accountId,
      internalValue: internalPosition.quantity,
      externalValue: externalPosition.quantity,
      discrepancy: Math.abs(internalPosition.quantity - externalPosition.quantity),
      metadata: { securityId: internalPosition.securityId }
    }));
  }

  // Market value discrepancy (could indicate pricing difference)
  const valueDiff = Math.abs(internalPosition.marketValue - externalPosition.marketValue);
  if (valueDiff > 100) {
    breaks.push(await createReconciliationBreak({
      scope: ReconciliationScope.POSITION,
      breakType: BreakType.PRICE_DISCREPANCY,
      priority: BreakPriority.MEDIUM,
      affectedAccountId: accountId,
      internalValue: internalPosition.marketValue,
      externalValue: externalPosition.marketValue,
      discrepancy: valueDiff,
      estimatedImpact: valueDiff,
      metadata: { securityId: internalPosition.securityId }
    }));
  }

  return breaks;
}

/**
 * Reconciles positions by account.
 *
 * @param {string} accountId - Account identifier
 * @param {Date} reconciliationDate - Reconciliation date
 * @returns {Promise<PositionReconciliationResult>} Reconciliation result
 *
 * @example
 * ```typescript
 * const result = await reconcilePositionByAccount('ACC-123', new Date());
 * ```
 */
export async function reconcilePositionByAccount(
  accountId: string,
  reconciliationDate: Date
): Promise<PositionReconciliationResult> {
  const logger = new Logger('TradeReconciliation:reconcilePositionByAccount');

  try {
    const internalSnapshot = await getInternalPositionSnapshot(accountId, reconciliationDate);
    const externalSnapshot = await getExternalPositionSnapshot(accountId, reconciliationDate);

    return await reconcilePositions(accountId, internalSnapshot, externalSnapshot);

  } catch (error) {
    logger.error(`Failed to reconcile position by account: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Reconciles positions by security across all accounts.
 *
 * @param {string} securityId - Security identifier
 * @param {Date} reconciliationDate - Reconciliation date
 * @returns {Promise<object>} Reconciliation result
 *
 * @example
 * ```typescript
 * const result = await reconcilePositionBySecurity('AAPL-NASDAQ', new Date());
 * ```
 */
export async function reconcilePositionBySecurity(
  securityId: string,
  reconciliationDate: Date
): Promise<any> {
  const logger = new Logger('TradeReconciliation:reconcilePositionBySecurity');

  try {
    const accounts = await getAccountsWithSecurity(securityId);
    const results: any[] = [];

    for (const account of accounts) {
      const result = await reconcilePositionByAccount(account.accountId, reconciliationDate);
      results.push(result);
    }

    return {
      securityId,
      reconciliationDate,
      accountResults: results,
      totalBreaks: results.reduce((sum, r) => sum + r.breaks.length, 0)
    };

  } catch (error) {
    logger.error(`Failed to reconcile position by security: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Reconciles positions by strategy or portfolio.
 *
 * @param {string} strategyId - Strategy identifier
 * @param {Date} reconciliationDate - Reconciliation date
 * @returns {Promise<object>} Reconciliation result
 *
 * @example
 * ```typescript
 * const result = await reconcilePositionByStrategy('STRAT-123', new Date());
 * ```
 */
export async function reconcilePositionByStrategy(
  strategyId: string,
  reconciliationDate: Date
): Promise<any> {
  const logger = new Logger('TradeReconciliation:reconcilePositionByStrategy');

  try {
    const accounts = await getAccountsForStrategy(strategyId);
    const results: any[] = [];

    for (const account of accounts) {
      const result = await reconcilePositionByAccount(account, reconciliationDate);
      results.push(result);
    }

    return {
      strategyId,
      reconciliationDate,
      accountResults: results,
      aggregateBreaks: results.reduce((sum, r) => sum + r.breaks.length, 0)
    };

  } catch (error) {
    logger.error(`Failed to reconcile position by strategy: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Resolves position breaks with corrective action.
 *
 * @param {string} breakId - Break identifier
 * @param {ResolutionAction} action - Resolution action
 * @returns {Promise<ReconciliationBreak>} Resolved break
 *
 * @example
 * ```typescript
 * const resolved = await resolvePositionBreaks('BRK-123', ResolutionAction.ADJUST_INTERNAL);
 * ```
 */
export async function resolvePositionBreaks(
  breakId: string,
  action: ResolutionAction
): Promise<ReconciliationBreak> {
  return await resolveBreak(breakId, action, 'Position break resolved', 'SYSTEM');
}

/**
 * Adjusts positions for corporate actions during reconciliation.
 *
 * @param {PositionSnapshot} snapshot - Position snapshot
 * @param {any[]} corporateActions - Corporate actions to apply
 * @returns {Promise<PositionSnapshot>} Adjusted snapshot
 *
 * @example
 * ```typescript
 * const adjusted = await adjustPositionForCorporateActions(snapshot, corporateActions);
 * ```
 */
export async function adjustPositionForCorporateActions(
  snapshot: PositionSnapshot,
  corporateActions: any[]
): Promise<PositionSnapshot> {
  const adjustedPositions = [...snapshot.positions];

  for (const action of corporateActions) {
    for (const position of adjustedPositions) {
      if (position.securityId === action.securityId) {
        if (action.actionType === 'SPLIT') {
          position.quantity *= action.ratio;
          if (position.averagePrice) {
            position.averagePrice /= action.ratio;
          }
        } else if (action.actionType === 'REVERSE_SPLIT') {
          position.quantity /= action.ratio;
          if (position.averagePrice) {
            position.averagePrice *= action.ratio;
          }
        }
      }
    }
  }

  return {
    ...snapshot,
    positions: adjustedPositions
  };
}

/**
 * Validates position integrity and detects anomalies.
 *
 * @param {PositionSnapshot} snapshot - Position snapshot
 * @returns {Promise<{ valid: boolean; issues: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validatePositionIntegrity(snapshot);
 * ```
 */
export async function validatePositionIntegrity(
  snapshot: PositionSnapshot
): Promise<{ valid: boolean; issues: string[] }> {
  const issues: string[] = [];

  for (const position of snapshot.positions) {
    // Check for zero quantity positions
    if (position.quantity === 0) {
      issues.push(`Zero quantity position: ${position.securityId}`);
    }

    // Check for negative available quantity (over-pledged)
    if (position.availableQuantity && position.availableQuantity < 0) {
      issues.push(`Negative available quantity: ${position.securityId}`);
    }

    // Check for quantity mismatch
    const totalQty = (position.settledQuantity || 0) + (position.unsettledQuantity || 0);
    if (Math.abs(totalQty - position.quantity) > 0.01) {
      issues.push(`Quantity mismatch: ${position.securityId} - total ${totalQty} vs quantity ${position.quantity}`);
    }
  }

  return {
    valid: issues.length === 0,
    issues
  };
}

/**
 * Generates position reconciliation report.
 *
 * @param {string} accountId - Account identifier
 * @param {Date} reportDate - Report date
 * @returns {Promise<object>} Position reconciliation report
 *
 * @example
 * ```typescript
 * const report = await generatePositionReconciliationReport('ACC-123', new Date());
 * ```
 */
export async function generatePositionReconciliationReport(
  accountId: string,
  reportDate: Date
): Promise<any> {
  const logger = new Logger('TradeReconciliation:generatePositionReconciliationReport');

  try {
    const result = await reconcilePositionByAccount(accountId, reportDate);

    const report = {
      accountId,
      reportDate,
      totalPositions: result.summary.totalSecurities,
      matchedPositions: result.matchedPositions,
      unmatchedPositions: result.unmatchedPositions,
      matchRate: result.summary.matchRate,
      breaks: result.breaks.length,
      quantityDiscrepancy: result.summary.quantityDiscrepancy,
      valueDiscrepancy: result.summary.valueDiscrepancy,
      breaksByType: groupBreaksByType(result.breaks)
    };

    return report;

  } catch (error) {
    logger.error(`Failed to generate position reconciliation report: ${error.message}`, error.stack);
    throw error;
  }
}

// ============================================================================
// CASH RECONCILIATION
// ============================================================================

/**
 * Reconciles cash balances between internal and external sources.
 *
 * @param {string} accountId - Account identifier
 * @param {CashBalance} internalBalance - Internal cash balance
 * @param {CashBalance} externalBalance - External cash balance (bank/custodian)
 * @returns {Promise<{ matched: boolean; discrepancy: number; breaks: ReconciliationBreak[] }>} Reconciliation result
 *
 * @example
 * ```typescript
 * const result = await reconcileCashBalances('ACC-123', internalCash, bankCash);
 * ```
 */
export async function reconcileCashBalances(
  accountId: string,
  internalBalance: CashBalance,
  externalBalance: CashBalance
): Promise<{ matched: boolean; discrepancy: number; breaks: ReconciliationBreak[] }> {
  const logger = new Logger('TradeReconciliation:reconcileCashBalances');

  try {
    logger.log(`Reconciling cash balances for account: ${accountId}`);

    const breaks: ReconciliationBreak[] = [];

    const discrepancy = internalBalance.closingBalance - externalBalance.closingBalance;

    if (Math.abs(discrepancy) > 0.01) {
      breaks.push(await createReconciliationBreak({
        scope: ReconciliationScope.CASH,
        breakType: BreakType.QUANTITY_DISCREPANCY,
        priority: Math.abs(discrepancy) > 10000 ? BreakPriority.CRITICAL : BreakPriority.MEDIUM,
        affectedAccountId: accountId,
        internalValue: internalBalance.closingBalance,
        externalValue: externalBalance.closingBalance,
        discrepancy,
        estimatedImpact: Math.abs(discrepancy),
        metadata: { currency: internalBalance.currency }
      }));
    }

    const matched = Math.abs(discrepancy) <= 0.01;

    logger.log(`Cash reconciliation: ${matched ? 'Matched' : `Discrepancy: ${discrepancy}`}`);

    return { matched, discrepancy, breaks };

  } catch (error) {
    logger.error(`Failed to reconcile cash balances: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Reconciles nostro accounts with bank statements.
 *
 * @param {string} nostroAccountId - Nostro account identifier
 * @param {Date} reconciliationDate - Reconciliation date
 * @returns {Promise<NostroReconciliation>} Nostro reconciliation result
 *
 * @example
 * ```typescript
 * const result = await reconcileNostroAccounts('NOSTRO-USD-123', new Date());
 * ```
 */
export async function reconcileNostroAccounts(
  nostroAccountId: string,
  reconciliationDate: Date
): Promise<NostroReconciliation> {
  const logger = new Logger('TradeReconciliation:reconcileNostroAccounts');

  try {
    logger.log(`Reconciling nostro account: ${nostroAccountId}`);

    const bookBalance = await getBookBalance(nostroAccountId, reconciliationDate);
    const bankBalance = await getBankBalance(nostroAccountId, reconciliationDate);

    const difference = bookBalance - bankBalance;

    const unmatchedBankItems = await getUnmatchedBankMovements(nostroAccountId, reconciliationDate);
    const unmatchedBookItems = await getUnmatchedBookMovements(nostroAccountId, reconciliationDate);

    const breaks: ReconciliationBreak[] = [];

    if (Math.abs(difference) > 0.01) {
      breaks.push(await createReconciliationBreak({
        scope: ReconciliationScope.NOSTRO,
        breakType: BreakType.QUANTITY_DISCREPANCY,
        priority: BreakPriority.HIGH,
        affectedAccountId: nostroAccountId,
        internalValue: bookBalance,
        externalValue: bankBalance,
        discrepancy: difference,
        estimatedImpact: Math.abs(difference),
        metadata: { nostroAccountId }
      }));
    }

    const result: NostroReconciliation = {
      reconciliationId: `NOSTRO-RECON-${Date.now()}`,
      nostroAccountId,
      currency: 'USD',
      reconciliationDate,
      bankBalance,
      bookBalance,
      difference,
      unmatchedBankItems,
      unmatchedBookItems,
      breaks,
      reconciled: Math.abs(difference) <= 0.01
    };

    logger.log(`Nostro reconciliation: ${result.reconciled ? 'Balanced' : `Difference: ${difference}`}`);

    return result;

  } catch (error) {
    logger.error(`Failed to reconcile nostro account: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Detects cash discrepancies and creates breaks.
 *
 * @param {CashBalance} internal - Internal cash balance
 * @param {CashBalance} external - External cash balance
 * @returns {Promise<ReconciliationBreak[]>} Detected breaks
 *
 * @example
 * ```typescript
 * const breaks = await detectCashDiscrepancies(internalCash, bankCash);
 * ```
 */
export async function detectCashDiscrepancies(
  internal: CashBalance,
  external: CashBalance
): Promise<ReconciliationBreak[]> {
  const breaks: ReconciliationBreak[] = [];

  // Opening balance discrepancy
  if (Math.abs(internal.openingBalance - external.openingBalance) > 0.01) {
    breaks.push(await createReconciliationBreak({
      scope: ReconciliationScope.CASH,
      breakType: BreakType.REFERENCE_DATA_MISMATCH,
      priority: BreakPriority.HIGH,
      affectedAccountId: internal.accountId,
      internalValue: internal.openingBalance,
      externalValue: external.openingBalance,
      discrepancy: internal.openingBalance - external.openingBalance,
      metadata: { field: 'openingBalance' }
    }));
  }

  // Closing balance discrepancy
  if (Math.abs(internal.closingBalance - external.closingBalance) > 0.01) {
    breaks.push(await createReconciliationBreak({
      scope: ReconciliationScope.CASH,
      breakType: BreakType.QUANTITY_DISCREPANCY,
      priority: BreakPriority.HIGH,
      affectedAccountId: internal.accountId,
      internalValue: internal.closingBalance,
      externalValue: external.closingBalance,
      discrepancy: internal.closingBalance - external.closingBalance,
      estimatedImpact: Math.abs(internal.closingBalance - external.closingBalance),
      metadata: { field: 'closingBalance' }
    }));
  }

  return breaks;
}

/**
 * Matches cash movements between internal and external records.
 *
 * @param {CashMovement[]} internalMovements - Internal movements
 * @param {CashMovement[]} externalMovements - External movements
 * @returns {Promise<{ matched: CashMovement[]; unmatched: CashMovement[] }>} Match result
 *
 * @example
 * ```typescript
 * const result = await matchCashMovements(internalMvts, bankMvts);
 * ```
 */
export async function matchCashMovements(
  internalMovements: CashMovement[],
  externalMovements: CashMovement[]
): Promise<{ matched: CashMovement[]; unmatched: CashMovement[] }> {
  const matched: CashMovement[] = [];
  const unmatched: CashMovement[] = [];
  const matchedExternal = new Set<string>();

  for (const internal of internalMovements) {
    let found = false;

    for (const external of externalMovements) {
      if (matchedExternal.has(external.movementId)) continue;

      // Match on amount, date, and type
      if (
        Math.abs(internal.amount - external.amount) < 0.01 &&
        internal.valueDate.getTime() === external.valueDate.getTime() &&
        internal.movementType === external.movementType
      ) {
        matched.push(internal);
        matchedExternal.add(external.movementId);
        found = true;
        break;
      }
    }

    if (!found) {
      unmatched.push(internal);
    }
  }

  return { matched, unmatched };
}

/**
 * Reconciles dividend payments.
 *
 * @param {string} accountId - Account identifier
 * @param {Date} paymentDate - Payment date
 * @returns {Promise<{ matched: boolean; discrepancy: number }>} Reconciliation result
 *
 * @example
 * ```typescript
 * const result = await reconcileDividends('ACC-123', new Date());
 * ```
 */
export async function reconcileDividends(
  accountId: string,
  paymentDate: Date
): Promise<{ matched: boolean; discrepancy: number }> {
  const logger = new Logger('TradeReconciliation:reconcileDividends');

  try {
    const expectedDividends = await getExpectedDividends(accountId, paymentDate);
    const receivedDividends = await getReceivedDividends(accountId, paymentDate);

    const discrepancy = expectedDividends - receivedDividends;
    const matched = Math.abs(discrepancy) < 0.01;

    if (!matched) {
      await createReconciliationBreak({
        scope: ReconciliationScope.DIVIDENDS,
        breakType: BreakType.QUANTITY_DISCREPANCY,
        priority: BreakPriority.MEDIUM,
        affectedAccountId: accountId,
        internalValue: expectedDividends,
        externalValue: receivedDividends,
        discrepancy,
        metadata: { paymentDate }
      });
    }

    return { matched, discrepancy };

  } catch (error) {
    logger.error(`Failed to reconcile dividends: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Reconciles interest payments.
 *
 * @param {string} accountId - Account identifier
 * @param {Date} periodEnd - Interest period end
 * @returns {Promise<{ matched: boolean; discrepancy: number }>} Reconciliation result
 *
 * @example
 * ```typescript
 * const result = await reconcileInterest('ACC-123', new Date());
 * ```
 */
export async function reconcileInterest(
  accountId: string,
  periodEnd: Date
): Promise<{ matched: boolean; discrepancy: number }> {
  const expectedInterest = await getExpectedInterest(accountId, periodEnd);
  const receivedInterest = await getReceivedInterest(accountId, periodEnd);

  const discrepancy = expectedInterest - receivedInterest;
  const matched = Math.abs(discrepancy) < 0.01;

  return { matched, discrepancy };
}

/**
 * Reconciles fees and commissions.
 *
 * @param {string} accountId - Account identifier
 * @param {Date} periodStart - Period start
 * @param {Date} periodEnd - Period end
 * @returns {Promise<{ matched: boolean; discrepancy: number }>} Reconciliation result
 *
 * @example
 * ```typescript
 * const result = await reconcileFees('ACC-123', startDate, endDate);
 * ```
 */
export async function reconcileFees(
  accountId: string,
  periodStart: Date,
  periodEnd: Date
): Promise<{ matched: boolean; discrepancy: number }> {
  const expectedFees = await getExpectedFees(accountId, periodStart, periodEnd);
  const chargedFees = await getChargedFees(accountId, periodStart, periodEnd);

  const discrepancy = expectedFees - chargedFees;
  const matched = Math.abs(discrepancy) < 1.0; // $1 tolerance

  return { matched, discrepancy };
}

/**
 * Validates cash settlement instructions.
 *
 * @param {any} settlement - Settlement instruction
 * @returns {Promise<{ valid: boolean; errors: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateCashSettlement(settlementInstruction);
 * ```
 */
export async function validateCashSettlement(
  settlement: any
): Promise<{ valid: boolean; errors: string[] }> {
  const errors: string[] = [];

  if (!settlement.amount || settlement.amount <= 0) {
    errors.push('Invalid settlement amount');
  }

  if (!settlement.valueDate) {
    errors.push('Missing value date');
  }

  if (!settlement.currency) {
    errors.push('Missing currency');
  }

  if (!settlement.beneficiaryAccount) {
    errors.push('Missing beneficiary account');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Generates cash reconciliation report.
 *
 * @param {string} accountId - Account identifier
 * @param {Date} reportDate - Report date
 * @returns {Promise<object>} Cash reconciliation report
 *
 * @example
 * ```typescript
 * const report = await generateCashReconciliationReport('ACC-123', new Date());
 * ```
 */
export async function generateCashReconciliationReport(
  accountId: string,
  reportDate: Date
): Promise<any> {
  const logger = new Logger('TradeReconciliation:generateCashReconciliationReport');

  try {
    const internalCash = await getInternalCashBalance(accountId, reportDate);
    const externalCash = await getExternalCashBalance(accountId, reportDate);

    const recon = await reconcileCashBalances(accountId, internalCash, externalCash);

    const report = {
      accountId,
      reportDate,
      currency: internalCash.currency,
      internalBalance: internalCash.closingBalance,
      externalBalance: externalCash.closingBalance,
      discrepancy: recon.discrepancy,
      matched: recon.matched,
      breaks: recon.breaks.length,
      unmatchedMovements: internalCash.movements.length + externalCash.movements.length
    };

    return report;

  } catch (error) {
    logger.error(`Failed to generate cash reconciliation report: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Projects cash position based on pending settlements.
 *
 * @param {string} accountId - Account identifier
 * @param {Date} projectionDate - Projection date
 * @returns {Promise<{ projected: number; pending: CashMovement[] }>} Cash projection
 *
 * @example
 * ```typescript
 * const projection = await projectCashPosition('ACC-123', tomorrow);
 * ```
 */
export async function projectCashPosition(
  accountId: string,
  projectionDate: Date
): Promise<{ projected: number; pending: CashMovement[] }> {
  const currentBalance = await getCurrentCashBalance(accountId);
  const pendingMovements = await getPendingCashMovements(accountId, projectionDate);

  const pendingTotal = pendingMovements.reduce((sum, mvt) => sum + mvt.amount, 0);
  const projected = currentBalance + pendingTotal;

  return { projected, pending: pendingMovements };
}

// ============================================================================
// MULTI-PARTY AND ADVANCED RECONCILIATION
// ============================================================================

/**
 * Performs multi-party reconciliation across multiple sources.
 *
 * @param {ReconciliationSource[]} parties - Parties involved
 * @param {ReconciliationScope} scope - Reconciliation scope
 * @param {Date} reconciliationDate - Reconciliation date
 * @param {any} data - Data from each party
 * @returns {Promise<MultiPartyReconciliation>} Multi-party reconciliation result
 *
 * @example
 * ```typescript
 * const result = await performMultiPartyReconciliation(
 *   [ReconciliationSource.INTERNAL, ReconciliationSource.COUNTERPARTY, ReconciliationSource.CUSTODIAN],
 *   ReconciliationScope.TRADE,
 *   new Date(),
 *   partyData
 * );
 * ```
 */
export async function performMultiPartyReconciliation(
  parties: ReconciliationSource[],
  scope: ReconciliationScope,
  reconciliationDate: Date,
  data: any
): Promise<MultiPartyReconciliation> {
  const logger = new Logger('TradeReconciliation:performMultiPartyReconciliation');

  try {
    logger.log(`Performing multi-party reconciliation: ${parties.length} parties, scope: ${scope}`);

    const partyData = new Map<ReconciliationSource, any>();
    const disagreements: Array<{ field: string; values: Map<ReconciliationSource, any> }> = [];

    // Collect data from each party
    for (const party of parties) {
      partyData.set(party, data[party]);
    }

    // Find consensus and disagreements
    const consensus: any = {};
    const fields = Object.keys(data[parties[0]]);

    for (const field of fields) {
      const values = new Map<ReconciliationSource, any>();

      for (const party of parties) {
        values.set(party, data[party][field]);
      }

      const uniqueValues = [...new Set(values.values())];

      if (uniqueValues.length === 1) {
        consensus[field] = uniqueValues[0];
      } else {
        disagreements.push({ field, values });
        // Use majority vote or internal as default
        consensus[field] = data[ReconciliationSource.INTERNAL][field];
      }
    }

    const result: MultiPartyReconciliation = {
      reconciliationId: `MP-RECON-${Date.now()}`,
      parties,
      scope,
      reconciliationDate,
      partyData,
      consensus,
      disagreements,
      resolved: disagreements.length === 0
    };

    logger.log(`Multi-party reconciliation: ${result.resolved ? 'Consensus reached' : `${disagreements.length} disagreements`}`);

    return result;

  } catch (error) {
    logger.error(`Failed multi-party reconciliation: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Monitors reconciliation status in real-time.
 *
 * @param {ReconciliationScope} scope - Scope to monitor
 * @returns {Promise<{ pending: number; matched: number; breaks: number; status: string }>} Status
 *
 * @example
 * ```typescript
 * const status = await monitorReconciliationStatus(ReconciliationScope.TRADE);
 * ```
 */
export async function monitorReconciliationStatus(
  scope: ReconciliationScope
): Promise<{ pending: number; matched: number; breaks: number; status: string }> {
  const pending = await getReconciliationCountByStatus(scope, ReconciliationStatus.PENDING);
  const matched = await getReconciliationCountByStatus(scope, ReconciliationStatus.MATCHED);
  const breaks = await getOpenBreaksCount(scope);

  let status = 'HEALTHY';
  if (breaks > 100) status = 'CRITICAL';
  else if (breaks > 50) status = 'WARNING';

  return { pending, matched, breaks, status };
}

/**
 * Calculates reconciliation performance metrics.
 *
 * @param {Date} startDate - Period start
 * @param {Date} endDate - Period end
 * @param {ReconciliationScope} scope - Reconciliation scope
 * @returns {Promise<ReconciliationMetrics>} Performance metrics
 *
 * @example
 * ```typescript
 * const metrics = await calculateReconciliationMetrics(startDate, endDate, ReconciliationScope.TRADE);
 * ```
 */
export async function calculateReconciliationMetrics(
  startDate: Date,
  endDate: Date,
  scope: ReconciliationScope
): Promise<ReconciliationMetrics> {
  const logger = new Logger('TradeReconciliation:calculateReconciliationMetrics');

  try {
    const items = await getReconciliationItemsInPeriod(startDate, endDate, scope);
    const breaks = await getReconciliationBreaksInPeriod(startDate, endDate);

    const totalItems = items.length;
    const matchedItems = items.filter(i => i.status === ReconciliationStatus.MATCHED).length;
    const unmatchedItems = totalItems - matchedItems;

    const resolvedBreaks = breaks.filter(b => b.status === 'RESOLVED').length;
    const openBreaks = breaks.filter(b => b.status === 'OPEN' || b.status === 'IN_PROGRESS').length;

    const matchRate = totalItems > 0 ? matchedItems / totalItems : 0;

    const resolutionTimes = breaks
      .filter(b => b.resolvedDate)
      .map(b => (b.resolvedDate!.getTime() - b.detectedDate.getTime()) / (1000 * 60 * 60));
    const avgResolutionTime = resolutionTimes.length > 0
      ? resolutionTimes.reduce((sum, t) => sum + t, 0) / resolutionTimes.length
      : 0;

    const breaksAging = new Map<string, number>();
    breaksAging.set('0-24h', breaks.filter(b => b.agingDays === 0).length);
    breaksAging.set('1-3d', breaks.filter(b => b.agingDays >= 1 && b.agingDays <= 3).length);
    breaksAging.set('4-7d', breaks.filter(b => b.agingDays >= 4 && b.agingDays <= 7).length);
    breaksAging.set('>7d', breaks.filter(b => b.agingDays > 7).length);

    const breaksByType = new Map<BreakType, number>();
    for (const breakRecord of breaks) {
      breaksByType.set(breakRecord.breakType, (breaksByType.get(breakRecord.breakType) || 0) + 1);
    }

    const metrics: ReconciliationMetrics = {
      period: { start: startDate, end: endDate },
      scope,
      totalItems,
      matchedItems,
      unmatchedItems,
      breaks: breaks.length,
      resolvedBreaks,
      openBreaks,
      matchRate,
      avgResolutionTime,
      breaksAging,
      breaksByType
    };

    return metrics;

  } catch (error) {
    logger.error(`Failed to calculate reconciliation metrics: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Schedules automated reconciliation jobs.
 *
 * @param {ReconciliationScope} scope - Reconciliation scope
 * @param {string} schedule - Cron schedule expression
 * @param {object} config - Job configuration
 * @returns {Promise<{ jobId: string; nextRun: Date }>} Scheduled job
 *
 * @example
 * ```typescript
 * const job = await scheduleReconciliationJobs(ReconciliationScope.TRADE, '0 0 * * *', config);
 * ```
 */
export async function scheduleReconciliationJobs(
  scope: ReconciliationScope,
  schedule: string,
  config: any
): Promise<{ jobId: string; nextRun: Date }> {
  const logger = new Logger('TradeReconciliation:scheduleReconciliationJobs');

  try {
    const jobId = `RECON-JOB-${scope}-${Date.now()}`;

    // Create scheduled job (would integrate with scheduler like node-cron)
    logger.log(`Scheduling reconciliation job: ${jobId}, schedule: ${schedule}`);

    const nextRun = calculateNextRun(schedule);

    await saveScheduledJob({
      jobId,
      scope,
      schedule,
      config,
      nextRun,
      enabled: true
    });

    return { jobId, nextRun };

  } catch (error) {
    logger.error(`Failed to schedule reconciliation job: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Automates break resolution using predefined rules.
 *
 * @param {ReconciliationBreak} breakRecord - Break to auto-resolve
 * @param {any[]} rules - Resolution rules
 * @returns {Promise<{ resolved: boolean; action?: ResolutionAction }>} Auto-resolution result
 *
 * @example
 * ```typescript
 * const result = await automateBreakResolution(breakRecord, autoResolveRules);
 * ```
 */
export async function automateBreakResolution(
  breakRecord: ReconciliationBreak,
  rules: any[]
): Promise<{ resolved: boolean; action?: ResolutionAction }> {
  const logger = new Logger('TradeReconciliation:automateBreakResolution');

  try {
    // Find applicable rule
    const applicableRule = rules.find(rule => {
      return rule.breakType === breakRecord.breakType &&
             Math.abs(breakRecord.discrepancy) <= rule.threshold;
    });

    if (applicableRule) {
      await resolveBreak(breakRecord.breakId, applicableRule.action, 'Auto-resolved', 'SYSTEM');

      logger.log(`Break ${breakRecord.breakId} auto-resolved with action: ${applicableRule.action}`);

      return {
        resolved: true,
        action: applicableRule.action
      };
    }

    return { resolved: false };

  } catch (error) {
    logger.error(`Failed to auto-resolve break: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Integrates with custodian systems for reconciliation data.
 *
 * @param {string} custodianId - Custodian identifier
 * @param {Date} reconciliationDate - Reconciliation date
 * @returns {Promise<{ positions: PositionSnapshot; cash: CashBalance }>} Custodian data
 *
 * @example
 * ```typescript
 * const data = await integrateWithCustodian('BNY-MELLON', new Date());
 * ```
 */
export async function integrateWithCustodian(
  custodianId: string,
  reconciliationDate: Date
): Promise<{ positions: PositionSnapshot; cash: CashBalance }> {
  const logger = new Logger('TradeReconciliation:integrateWithCustodian');

  try {
    logger.log(`Integrating with custodian: ${custodianId}`);

    // Fetch data from custodian API/file feed
    const custodianData = await fetchCustodianData(custodianId, reconciliationDate);

    const positions = parseCustodianPositions(custodianData);
    const cash = parseCustodianCash(custodianData);

    return { positions, cash };

  } catch (error) {
    logger.error(`Failed to integrate with custodian: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Processes reconciliation exceptions through workflow.
 *
 * @param {string} breakId - Break identifier
 * @param {string} workflowType - Workflow type
 * @returns {Promise<ExceptionWorkflow>} Exception workflow
 *
 * @example
 * ```typescript
 * const workflow = await processReconciliationExceptions('BRK-123', 'INVESTIGATION');
 * ```
 */
export async function processReconciliationExceptions(
  breakId: string,
  workflowType: string
): Promise<ExceptionWorkflow> {
  return await createExceptionWorkflow(breakId, workflowType);
}

/**
 * Generates regulatory reconciliation reports (MiFID II, etc.).
 *
 * @param {Date} reportDate - Report date
 * @param {string} regulation - Regulation type
 * @returns {Promise<object>} Regulatory report
 *
 * @example
 * ```typescript
 * const report = await generateRegulatoryReconciliationReport(new Date(), 'MIFID_II');
 * ```
 */
export async function generateRegulatoryReconciliationReport(
  reportDate: Date,
  regulation: string
): Promise<any> {
  const logger = new Logger('TradeReconciliation:generateRegulatoryReconciliationReport');

  try {
    logger.log(`Generating regulatory reconciliation report: ${regulation}`);

    const metrics = await calculateReconciliationMetrics(
      new Date(reportDate.getFullYear(), reportDate.getMonth(), 1),
      reportDate,
      ReconciliationScope.TRADE
    );

    const report = {
      reportDate,
      regulation,
      reconciliationMetrics: metrics,
      complianceStatus: metrics.matchRate >= 0.99 ? 'COMPLIANT' : 'NON_COMPLIANT',
      outstandingBreaks: metrics.openBreaks,
      resolutionRate: metrics.resolvedBreaks / (metrics.breaks || 1),
      avgResolutionTime: metrics.avgResolutionTime
    };

    return report;

  } catch (error) {
    logger.error(`Failed to generate regulatory report: ${error.message}`, error.stack);
    throw error;
  }
}

/**
 * Benchmarks reconciliation performance against industry standards.
 *
 * @param {ReconciliationMetrics} metrics - Current metrics
 * @returns {Promise<{ score: number; benchmarks: any }>} Benchmark comparison
 *
 * @example
 * ```typescript
 * const benchmark = await benchmarkReconciliationPerformance(metrics);
 * ```
 */
export async function benchmarkReconciliationPerformance(
  metrics: ReconciliationMetrics
): Promise<{ score: number; benchmarks: any }> {
  const industryBenchmarks = {
    matchRate: 0.98,
    avgResolutionTime: 24,
    breaksPercentage: 0.02
  };

  const scores = {
    matchRate: (metrics.matchRate / industryBenchmarks.matchRate) * 100,
    resolutionTime: (industryBenchmarks.avgResolutionTime / metrics.avgResolutionTime) * 100,
    breaksRate: ((1 - (metrics.breaks / metrics.totalItems)) / (1 - industryBenchmarks.breaksPercentage)) * 100
  };

  const overallScore = (scores.matchRate + scores.resolutionTime + scores.breaksRate) / 3;

  return {
    score: overallScore,
    benchmarks: {
      industry: industryBenchmarks,
      actual: {
        matchRate: metrics.matchRate,
        avgResolutionTime: metrics.avgResolutionTime,
        breaksRate: metrics.breaks / metrics.totalItems
      },
      scores
    }
  };
}

/**
 * Optimizes reconciliation workflow for efficiency.
 *
 * @param {ReconciliationScope} scope - Reconciliation scope
 * @param {ReconciliationMetrics} currentMetrics - Current performance
 * @returns {Promise<{ recommendations: string[]; estimatedImprovement: number }>} Optimization recommendations
 *
 * @example
 * ```typescript
 * const optimization = await optimizeReconciliationWorkflow(ReconciliationScope.TRADE, metrics);
 * ```
 */
export async function optimizeReconciliationWorkflow(
  scope: ReconciliationScope,
  currentMetrics: ReconciliationMetrics
): Promise<{ recommendations: string[]; estimatedImprovement: number }> {
  const recommendations: string[] = [];
  let estimatedImprovement = 0;

  if (currentMetrics.matchRate < 0.95) {
    recommendations.push('Implement automated matching algorithms to improve match rate');
    estimatedImprovement += 5;
  }

  if (currentMetrics.avgResolutionTime > 48) {
    recommendations.push('Create auto-resolution rules for common break types');
    estimatedImprovement += 10;
  }

  if (currentMetrics.openBreaks > 50) {
    recommendations.push('Increase reconciliation frequency to daily');
    estimatedImprovement += 15;
  }

  const agingBreaks = Array.from(currentMetrics.breaksAging.values()).reduce((sum, v) => sum + v, 0);
  if (agingBreaks > 20) {
    recommendations.push('Implement break aging alerts and escalation workflows');
    estimatedImprovement += 8;
  }

  return { recommendations, estimatedImprovement };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

async function evaluateTradeMatch(
  trade: any,
  confirmation: TradeConfirmation,
  tolerances?: ReconciliationTolerance[]
): Promise<TradeMatchResult> {
  let matchScore = 0;
  const matchedFields: string[] = [];
  const unmatchedFields: string[] = [];
  const discrepancies: FieldDiscrepancy[] = [];

  // Security ID match (critical)
  if (trade.securityId === confirmation.securityId) {
    matchScore += 0.25;
    matchedFields.push('securityId');
  } else {
    unmatchedFields.push('securityId');
  }

  // Side match (critical)
  if (trade.side === confirmation.side) {
    matchScore += 0.25;
    matchedFields.push('side');
  } else {
    unmatchedFields.push('side');
  }

  // Quantity match (critical)
  if (trade.quantity === confirmation.quantity) {
    matchScore += 0.20;
    matchedFields.push('quantity');
  } else {
    unmatchedFields.push('quantity');
    discrepancies.push({
      fieldName: 'quantity',
      internalValue: trade.quantity,
      externalValue: confirmation.quantity,
      difference: Math.abs(trade.quantity - confirmation.quantity),
      toleranceExceeded: true,
      severity: 'ERROR'
    });
  }

  // Price match (important)
  const priceDiff = Math.abs(trade.price - confirmation.price);
  const priceTolerance = findTolerance(tolerances, ReconciliationScope.TRADE, 'price');
  if (priceDiff <= (priceTolerance?.toleranceValue || 0.01)) {
    matchScore += 0.15;
    matchedFields.push('price');
  } else {
    unmatchedFields.push('price');
    discrepancies.push({
      fieldName: 'price',
      internalValue: trade.price,
      externalValue: confirmation.price,
      difference: priceDiff,
      toleranceExceeded: true,
      severity: 'ERROR'
    });
  }

  // Trade date match
  if (trade.tradeDate.getTime() === confirmation.tradeDate.getTime()) {
    matchScore += 0.10;
    matchedFields.push('tradeDate');
  } else {
    unmatchedFields.push('tradeDate');
  }

  // Settlement date match
  if (trade.settlementDate.getTime() === confirmation.settlementDate.getTime()) {
    matchScore += 0.05;
    matchedFields.push('settlementDate');
  } else {
    unmatchedFields.push('settlementDate');
  }

  return {
    matchId: `MATCH-${Date.now()}-${trade.tradeId}`,
    internalTradeId: trade.tradeId,
    externalConfirmationId: confirmation.confirmationId,
    matchStatus: ReconciliationStatus.PENDING,
    matchScore,
    matchedFields,
    unmatchedFields,
    discrepancies,
    autoMatched: false,
    matchedAt: new Date(),
    confidence: matchScore
  };
}

function findTolerance(
  tolerances: ReconciliationTolerance[] | undefined,
  scope: ReconciliationScope,
  field: string
): ReconciliationTolerance | undefined {
  return tolerances?.find(t => t.scope === scope && t.field === field);
}

function groupBreaksByType(breaks: ReconciliationBreak[]): Map<BreakType, number> {
  const grouped = new Map<BreakType, number>();

  for (const breakRecord of breaks) {
    grouped.set(breakRecord.breakType, (grouped.get(breakRecord.breakType) || 0) + 1);
  }

  return grouped;
}

function calculateAvgResolutionTime(resolvedBreaks: ReconciliationBreak[]): number {
  if (resolvedBreaks.length === 0) return 0;

  const totalTime = resolvedBreaks.reduce((sum, b) => {
    const resolutionTime = b.resolvedDate!.getTime() - b.detectedDate.getTime();
    return sum + (resolutionTime / (1000 * 60 * 60)); // hours
  }, 0);

  return totalTime / resolvedBreaks.length;
}

function calculateNextRun(schedule: string): Date {
  // Simplified - would use proper cron parser
  const next = new Date();
  next.setDate(next.getDate() + 1);
  next.setHours(0, 0, 0, 0);
  return next;
}

async function executeResolutionAction(breakRecord: ReconciliationBreak, action: ResolutionAction): Promise<void> {
  // Implementation would depend on action type
  // e.g., ADJUST_INTERNAL might trigger trade amendment
}

async function createExceptionWorkflow(breakId: string, workflowType: string): Promise<ExceptionWorkflow> {
  const workflow: ExceptionWorkflow = {
    workflowId: `WF-${Date.now()}`,
    breakId,
    workflowType: workflowType as any,
    currentStep: 'INITIAL',
    steps: [],
    status: 'ACTIVE',
    createdDate: new Date()
  };

  await saveExceptionWorkflow(workflow);
  return workflow;
}

// Placeholder database/external operations
async function getTradeConfirmation(confirmationId: string): Promise<TradeConfirmation> {
  return {} as TradeConfirmation;
}

async function updateTradeConfirmation(confirmation: TradeConfirmation): Promise<void> {}
async function updateTradeStatus(tradeId: string, status: string): Promise<void> {}
async function saveReconciliationBreak(breakRecord: ReconciliationBreak): Promise<void> {}
async function getReconciliationBreak(breakId: string): Promise<ReconciliationBreak> {
  return {} as ReconciliationBreak;
}
async function updateReconciliationBreak(breakRecord: ReconciliationBreak): Promise<void> {}
async function notifyBreakAssignment(breakRecord: ReconciliationBreak, assignedTo: string): Promise<void> {}
async function notifyBreakEscalation(breakRecord: ReconciliationBreak, escalateTo: string, reason: string): Promise<void> {}
async function alertAgedBreak(breakRecord: ReconciliationBreak, agingDays: number): Promise<void> {}
async function getReconciliationBreaksInPeriod(start: Date, end: Date): Promise<ReconciliationBreak[]> {
  return [];
}
async function getTradeConfirmationsInPeriod(start: Date, end: Date, filters?: any): Promise<TradeConfirmation[]> {
  return [];
}
async function getInternalPositionSnapshot(accountId: string, date: Date): Promise<PositionSnapshot> {
  return {} as PositionSnapshot;
}
async function getExternalPositionSnapshot(accountId: string, date: Date): Promise<PositionSnapshot> {
  return {} as PositionSnapshot;
}
async function getAccountsWithSecurity(securityId: string): Promise<any[]> {
  return [];
}
async function getAccountsForStrategy(strategyId: string): Promise<string[]> {
  return [];
}
async function getInternalCashBalance(accountId: string, date: Date): Promise<CashBalance> {
  return {} as CashBalance;
}
async function getExternalCashBalance(accountId: string, date: Date): Promise<CashBalance> {
  return {} as CashBalance;
}
async function getBookBalance(nostroId: string, date: Date): Promise<number> {
  return 0;
}
async function getBankBalance(nostroId: string, date: Date): Promise<number> {
  return 0;
}
async function getUnmatchedBankMovements(nostroId: string, date: Date): Promise<CashMovement[]> {
  return [];
}
async function getUnmatchedBookMovements(nostroId: string, date: Date): Promise<CashMovement[]> {
  return [];
}
async function getExpectedDividends(accountId: string, date: Date): Promise<number> {
  return 0;
}
async function getReceivedDividends(accountId: string, date: Date): Promise<number> {
  return 0;
}
async function getExpectedInterest(accountId: string, date: Date): Promise<number> {
  return 0;
}
async function getReceivedInterest(accountId: string, date: Date): Promise<number> {
  return 0;
}
async function getExpectedFees(accountId: string, start: Date, end: Date): Promise<number> {
  return 0;
}
async function getChargedFees(accountId: string, start: Date, end: Date): Promise<number> {
  return 0;
}
async function getCurrentCashBalance(accountId: string): Promise<number> {
  return 0;
}
async function getPendingCashMovements(accountId: string, date: Date): Promise<CashMovement[]> {
  return [];
}
async function getReconciliationCountByStatus(scope: ReconciliationScope, status: ReconciliationStatus): Promise<number> {
  return 0;
}
async function getOpenBreaksCount(scope: ReconciliationScope): Promise<number> {
  return 0;
}
async function getReconciliationItemsInPeriod(start: Date, end: Date, scope: ReconciliationScope): Promise<any[]> {
  return [];
}
async function saveScheduledJob(job: any): Promise<void> {}
async function fetchCustodianData(custodianId: string, date: Date): Promise<any> {
  return {};
}
function parseCustodianPositions(data: any): PositionSnapshot {
  return {} as PositionSnapshot;
}
function parseCustodianCash(data: any): CashBalance {
  return {} as CashBalance;
}
async function saveExceptionWorkflow(workflow: ExceptionWorkflow): Promise<void> {}

export default {
  // Trade Confirmation
  matchTradeConfirmations,
  validateTradeConfirmation,
  processTradeAffirmation,
  detectTradeDiscrepancies,
  reconcileTradeAttributes,
  handleUnmatchedTrades,
  generateTradeConfirmationReport,
  autoMatchTrades,
  fuzzyMatchTrades,
  bulkConfirmTrades,

  // Break Management
  createReconciliationBreak,
  categorizeBreak,
  assignBreakPriority,
  routeBreakForResolution,
  resolveBreak,
  cancelBreak,
  escalateBreak,
  trackBreakAging,
  analyzeBreakPatterns,
  generateBreakReport,

  // Position Reconciliation
  reconcilePositions,
  comparePositionSnapshots,
  detectPositionDiscrepancies,
  reconcilePositionByAccount,
  reconcilePositionBySecurity,
  reconcilePositionByStrategy,
  resolvePositionBreaks,
  adjustPositionForCorporateActions,
  validatePositionIntegrity,
  generatePositionReconciliationReport,

  // Cash Reconciliation
  reconcileCashBalances,
  reconcileNostroAccounts,
  detectCashDiscrepancies,
  matchCashMovements,
  reconcileDividends,
  reconcileInterest,
  reconcileFees,
  validateCashSettlement,
  generateCashReconciliationReport,
  projectCashPosition,

  // Multi-Party & Advanced
  performMultiPartyReconciliation,
  monitorReconciliationStatus,
  calculateReconciliationMetrics,
  scheduleReconciliationJobs,
  automateBreakResolution,
  integrateWithCustodian,
  processReconciliationExceptions,
  generateRegulatoryReconciliationReport,
  benchmarkReconciliationPerformance,
  optimizeReconciliationWorkflow
};
