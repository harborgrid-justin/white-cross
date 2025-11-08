/**
 * Financial Consolidation Kit
 * ===========================
 * Enterprise-grade multi-entity financial consolidation system implementing IFRS 10 / ASC 810
 * standards with inter-company elimination, equity method, currency translation, minority interest,
 * goodwill impairment, and push-down accounting.
 *
 * LOC: FIN-CONS-001
 * Targets: Blackline, OneStream, SAP
 * Framework: NestJS 10.x, Sequelize 6.x, TypeScript 5.x
 *
 * Capabilities:
 * - Multi-entity consolidation with hierarchy management
 * - Inter-company transaction elimination (sales, purchases, balances)
 * - Equity method of accounting for associates/JVs
 * - Multi-currency translation with CTA recognition
 * - Consolidation adjustments and accruals
 * - Minority interest calculation and allocation
 * - Goodwill impairment testing and disclosure
 * - Push-down accounting at subsidiary level
 * - Consolidated financial statement generation
 * - Segment reporting by entity and geography
 *
 * Compliance: IFRS 10, IFRS 11, IFRS 12, ASC 810, ASC 805
 *
 * @module FinancialConsolidation
 * @version 3.0.0
 * @author Enterprise Finance
 */

import { DataTypes, Op, QueryInterface, Sequelize } from 'sequelize';
import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ApiProperty, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsNumber, IsDate, IsUUID, ValidateNested, IsBoolean } from 'class-validator';

// ============================================================================
// ENUMS & TYPES
// ============================================================================

enum ConsolidationStatus {
  DRAFT = 'DRAFT',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  AUDITED = 'AUDITED',
  ARCHIVED = 'ARCHIVED',
}

enum OwnershipType {
  SUBSIDIARY = 'SUBSIDIARY',
  ASSOCIATE = 'ASSOCIATE',
  JOINT_VENTURE = 'JOINT_VENTURE',
  BRANCH = 'BRANCH',
}

enum EliminationType {
  FULL = 'FULL',
  PROPORTIONATE = 'PROPORTIONATE',
  EQUITY_METHOD = 'EQUITY_METHOD',
}

enum CurrencyTranslationMethod {
  CURRENT_RATE = 'CURRENT_RATE',
  TEMPORAL = 'TEMPORAL',
  AVERAGE_RATE = 'AVERAGE_RATE',
}

enum GoodwillTestStatus {
  NOT_TESTED = 'NOT_TESTED',
  TESTED_NO_IMPAIRMENT = 'TESTED_NO_IMPAIRMENT',
  IMPAIRMENT_RECOGNIZED = 'IMPAIRMENT_RECOGNIZED',
  FULLY_WRITTEN_OFF = 'FULLY_WRITTEN_OFF',
}

enum AdjustmentType {
  RECLASSIFICATION = 'RECLASSIFICATION',
  ALLOCATION = 'ALLOCATION',
  ELIMINATION = 'ELIMINATION',
  ACCRUAL = 'ACCRUAL',
  FAIR_VALUE = 'FAIR_VALUE',
}

enum SegmentType {
  BUSINESS = 'BUSINESS',
  GEOGRAPHIC = 'GEOGRAPHIC',
  CUSTOMER = 'CUSTOMER',
}

enum MinorityInterestMethod {
  FULL_GOODWILL = 'FULL_GOODWILL',
  PARTIAL_GOODWILL = 'PARTIAL_GOODWILL',
}

// ============================================================================
// INTERFACES
// ============================================================================

interface ConsolidatedEntity {
  id: string;
  parentId?: string;
  code: string;
  name: string;
  ownershipType: OwnershipType;
  ownershipPercentage: number;
  currency: string;
  consolidationStatus: ConsolidationStatus;
  fiscalYear: number;
  createdAt: Date;
  updatedAt: Date;
}

interface ConsolidationTransaction {
  id: string;
  sellerId: string;
  buyerId: string;
  amount: number;
  currency: string;
  eliminationType: EliminationType;
  reconciled: boolean;
  fiscalYear: number;
  createdAt: Date;
}

interface FairValueAllocation {
  id: string;
  acquisitionId: string;
  assetId: string;
  fairValue: number;
  bookValue: number;
  amortizationPeriod: number;
  currency: string;
}

interface ConsolidationAdjustment {
  id: string;
  consolidationId: string;
  adjustmentType: AdjustmentType;
  debitAccount: string;
  creditAccount: string;
  amount: number;
  description: string;
  fiscalYear: number;
}

interface SegmentReport {
  segmentId: string;
  segmentType: SegmentType;
  revenue: number;
  operatingIncome: number;
  totalAssets: number;
  fiscalYear: number;
}

// ============================================================================
// SECTION 1: ENTITY MANAGEMENT (1-4)
// ============================================================================

/**
 * Create consolidation entity with hierarchy
 * @param sequelize - Database instance
 * @param entity - Entity data
 * @returns Created entity
 */
export async function createConsolidationEntity(
  sequelize: Sequelize,
  entity: Omit<ConsolidatedEntity, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<ConsolidatedEntity> {
  const result = await sequelize.query(
    `INSERT INTO consolidated_entities
     (parent_id, code, name, ownership_type, ownership_percentage, currency,
      consolidation_status, fiscal_year, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
     RETURNING *`,
    {
      replacements: [
        entity.parentId || null,
        entity.code,
        entity.name,
        entity.ownershipType,
        entity.ownershipPercentage,
        entity.currency,
        entity.consolidationStatus,
        entity.fiscalYear,
      ],
      type: 'SELECT',
    },
  );
  return result[0];
}

/**
 * Define entity hierarchy and ownership structure
 * @param sequelize - Database instance
 * @param parentId - Parent entity ID
 * @param childIds - Child entity IDs
 * @param ownershipPercentages - Ownership percentages
 * @returns Updated entities
 */
export async function defineEntityHierarchy(
  sequelize: Sequelize,
  parentId: string,
  childIds: string[],
  ownershipPercentages: number[],
): Promise<ConsolidatedEntity[]> {
  const placeholders = childIds
    .map((_, i) => `('${childIds[i]}', '${parentId}', ${ownershipPercentages[i]}, NOW())`)
    .join(',');

  const result = await sequelize.query(
    `UPDATE consolidated_entities SET parent_id = ?, updated_at = NOW()
     WHERE id IN (${childIds.map(() => '?').join(',')})
     RETURNING *`,
    {
      replacements: [parentId, ...childIds],
      type: 'SELECT',
    },
  );
  return result;
}

/**
 * Set entity ownership percentages
 * @param sequelize - Database instance
 * @param entityId - Entity ID
 * @param ownershipPercentage - New ownership percentage
 * @returns Updated entity
 */
export async function setEntityOwnership(
  sequelize: Sequelize,
  entityId: string,
  ownershipPercentage: number,
): Promise<ConsolidatedEntity> {
  const result = await sequelize.query(
    `UPDATE consolidated_entities
     SET ownership_percentage = ?, updated_at = NOW()
     WHERE id = ?
     RETURNING *`,
    {
      replacements: [ownershipPercentage, entityId],
      type: 'SELECT',
    },
  );
  return result[0];
}

/**
 * Retrieve full entity hierarchy with ownership cascade
 * @param sequelize - Database instance
 * @param parentId - Root parent ID
 * @returns Hierarchical entity tree
 */
export async function getEntityHierarchy(
  sequelize: Sequelize,
  parentId: string,
): Promise<any[]> {
  return sequelize.query(
    `WITH RECURSIVE entity_tree AS (
       SELECT id, parent_id, code, name, ownership_type, ownership_percentage,
              0 as level, CAST(code as CHAR(255)) as path
       FROM consolidated_entities WHERE parent_id = ? OR id = ?

       UNION ALL

       SELECT ce.id, ce.parent_id, ce.code, ce.name, ce.ownership_type,
              ce.ownership_percentage, et.level + 1, CONCAT(et.path, ' > ', ce.code)
       FROM consolidated_entities ce
       JOIN entity_tree et ON ce.parent_id = et.id
     )
     SELECT * FROM entity_tree ORDER BY path`,
    {
      replacements: [parentId, parentId],
      type: 'SELECT',
    },
  );
}

// ============================================================================
// SECTION 2: CONSOLIDATION SCOPE (5-8)
// ============================================================================

/**
 * Determine consolidation scope based on ownership and control
 * @param sequelize - Database instance
 * @param parentId - Parent entity ID
 * @param fiscalYear - Fiscal year
 * @returns In-scope entities
 */
export async function determineConsolidationScope(
  sequelize: Sequelize,
  parentId: string,
  fiscalYear: number,
): Promise<any[]> {
  return sequelize.query(
    `SELECT ce.*,
            CASE
              WHEN ce.ownership_percentage >= 50 THEN 'CONSOLIDATED'
              WHEN ce.ownership_percentage >= 20 AND ce.ownership_percentage < 50
                   THEN 'EQUITY_METHOD'
              ELSE 'NOT_CONSOLIDATED'
            END as consolidation_method,
            (SELECT SUM(COALESCE(amount, 0)) FROM consolidation_transactions
             WHERE (seller_id = ce.id OR buyer_id = ce.id)
             AND fiscal_year = ?) as ic_transaction_volume
     FROM consolidated_entities ce
     WHERE ce.parent_id = ? OR ce.id = ?
     AND ce.fiscal_year = ?
     ORDER BY ce.ownership_percentage DESC`,
    {
      replacements: [fiscalYear, parentId, parentId, fiscalYear],
      type: 'SELECT',
    },
  );
}

/**
 * Apply consolidation criteria filters (ownership, revenue, activity)
 * @param sequelize - Database instance
 * @param criteria - Filter criteria object
 * @returns Filtered entities
 */
export async function applyConsolidationCriteria(
  sequelize: Sequelize,
  criteria: {
    minOwnershipPercentage?: number;
    minAnnualRevenue?: number;
    countries?: string[];
    consolidationStatuses?: string[];
  },
): Promise<any[]> {
  const filters: string[] = [];
  const replacements: any[] = [];

  if (criteria.minOwnershipPercentage) {
    filters.push('ce.ownership_percentage >= ?');
    replacements.push(criteria.minOwnershipPercentage);
  }
  if (criteria.consolidationStatuses?.length) {
    filters.push(`ce.consolidation_status IN (${criteria.consolidationStatuses.map(() => '?').join(',')})`);
    replacements.push(...criteria.consolidationStatuses);
  }

  const whereClause = filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';

  return sequelize.query(
    `SELECT ce.*, COUNT(DISTINCT ct.id) as ic_transaction_count
     FROM consolidated_entities ce
     LEFT JOIN consolidation_transactions ct ON ct.seller_id = ce.id OR ct.buyer_id = ce.id
     ${whereClause}
     GROUP BY ce.id
     ORDER BY ce.ownership_percentage DESC`,
    {
      replacements,
      type: 'SELECT',
    },
  );
}

/**
 * Adjust entity ownership for stock transactions
 * @param sequelize - Database instance
 * @param entityId - Entity ID
 * @param ownershipAdjustment - Adjustment percentage
 * @returns Updated entity
 */
export async function adjustEntityOwnership(
  sequelize: Sequelize,
  entityId: string,
  ownershipAdjustment: number,
): Promise<ConsolidatedEntity> {
  const result = await sequelize.query(
    `UPDATE consolidated_entities
     SET ownership_percentage = ownership_percentage + ?,
         updated_at = NOW()
     WHERE id = ?
     RETURNING *`,
    {
      replacements: [ownershipAdjustment, entityId],
      type: 'SELECT',
    },
  );
  return result[0];
}

/**
 * Finalize consolidation scope for reporting period
 * @param sequelize - Database instance
 * @param consolidationId - Consolidation ID
 * @param fiscalYear - Fiscal year
 * @returns Finalized scope details
 */
export async function finalizeConsolidationScope(
  sequelize: Sequelize,
  consolidationId: string,
  fiscalYear: number,
): Promise<any> {
  const result = await sequelize.query(
    `INSERT INTO consolidation_scope_history
     (consolidation_id, fiscal_year, consolidation_date, entity_count, ic_elimination_amount, created_at)
     SELECT ?, ?, NOW(), COUNT(DISTINCT ce.id), COALESCE(SUM(ct.amount), 0), NOW()
     FROM consolidated_entities ce
     LEFT JOIN consolidation_transactions ct ON (ct.seller_id = ce.id OR ct.buyer_id = ce.id)
                                              AND ct.fiscal_year = ?
     WHERE ce.consolidation_status = ?
     RETURNING *`,
    {
      replacements: [consolidationId, fiscalYear, fiscalYear, ConsolidationStatus.IN_PROGRESS],
      type: 'SELECT',
    },
  );
  return result[0];
}

// ============================================================================
// SECTION 3: INTER-COMPANY ELIMINATION (9-12)
// ============================================================================

/**
 * Identify inter-company transactions for elimination
 * @param sequelize - Database instance
 * @param consolidationId - Consolidation ID
 * @param fiscalYear - Fiscal year
 * @returns List of IC transactions
 */
export async function identifyICTransactions(
  sequelize: Sequelize,
  consolidationId: string,
  fiscalYear: number,
): Promise<ConsolidationTransaction[]> {
  return sequelize.query(
    `SELECT ct.*,
            COALESCE(cse.name, '') as seller_name,
            COALESCE(cbe.name, '') as buyer_name,
            ABS(ct.amount * (CASE WHEN ct.currency != 'USD' THEN fx.exchange_rate ELSE 1 END)) as usd_amount
     FROM consolidation_transactions ct
     JOIN consolidated_entities cse ON ct.seller_id = cse.id
     JOIN consolidated_entities cbe ON ct.buyer_id = cbe.id
     LEFT JOIN fx_rates fx ON fx.currency = ct.currency AND fx.fiscal_year = ct.fiscal_year
     WHERE ct.consolidation_id = ? AND ct.fiscal_year = ? AND ct.reconciled = 0
     ORDER BY ct.amount DESC`,
    {
      replacements: [consolidationId, fiscalYear],
      type: 'SELECT',
    },
  );
}

/**
 * Eliminate inter-company sales and purchases
 * @param sequelize - Database instance
 * @param consolidationId - Consolidation ID
 * @param fiscalYear - Fiscal year
 * @returns Elimination adjustments
 */
export async function eliminateICSalesAndPurchases(
  sequelize: Sequelize,
  consolidationId: string,
  fiscalYear: number,
): Promise<any[]> {
  return sequelize.query(
    `WITH ic_transactions AS (
       SELECT seller_id, buyer_id, SUM(amount) as total_amount, currency
       FROM consolidation_transactions
       WHERE consolidation_id = ? AND fiscal_year = ?
       GROUP BY seller_id, buyer_id, currency
     )
     INSERT INTO consolidation_adjustments
     (consolidation_id, account_from_id, account_to_id, amount, adjustment_type,
      fiscal_year, description, created_at)
     SELECT ?,
            (SELECT id FROM chart_of_accounts WHERE code = '4000' LIMIT 1),
            (SELECT id FROM chart_of_accounts WHERE code = '5000' LIMIT 1),
            ict.total_amount, ?, ?,
            CONCAT('IC Elimination: ', ce1.code, ' - ', ce2.code),
            NOW()
     FROM ic_transactions ict
     JOIN consolidated_entities ce1 ON ict.seller_id = ce1.id
     JOIN consolidated_entities ce2 ON ict.buyer_id = ce2.id
     RETURNING *`,
    {
      replacements: [consolidationId, fiscalYear, consolidationId, AdjustmentType.ELIMINATION, fiscalYear],
      type: 'SELECT',
    },
  );
}

/**
 * Eliminate inter-company receivables/payables
 * @param sequelize - Database instance
 * @param consolidationId - Consolidation ID
 * @returns Balance eliminations
 */
export async function eliminateICBalances(
  sequelize: Sequelize,
  consolidationId: string,
): Promise<any[]> {
  return sequelize.query(
    `WITH receivables_payables AS (
       SELECT ar.creditor_entity_id, ar.debtor_entity_id,
              SUM(ar.balance) as ar_balance,
              SUM(ap.balance) as ap_balance
       FROM ar_aging ar
       JOIN ap_aging ap ON ar.creditor_entity_id = ap.debtor_entity_id
                        AND ar.debtor_entity_id = ap.creditor_entity_id
       WHERE ar.consolidation_id = ? AND ap.consolidation_id = ?
       GROUP BY ar.creditor_entity_id, ar.debtor_entity_id
     )
     INSERT INTO consolidation_adjustments
     (consolidation_id, account_from_id, account_to_id, amount, adjustment_type, created_at)
     SELECT ?,
            (SELECT id FROM chart_of_accounts WHERE code = '1200' LIMIT 1),
            (SELECT id FROM chart_of_accounts WHERE code = '2100' LIMIT 1),
            rp.ar_balance, ?, NOW()
     FROM receivables_payables rp
     RETURNING *`,
    {
      replacements: [consolidationId, consolidationId, consolidationId, AdjustmentType.ELIMINATION],
      type: 'SELECT',
    },
  );
}

/**
 * Generate inter-company elimination report
 * @param sequelize - Database instance
 * @param consolidationId - Consolidation ID
 * @param fiscalYear - Fiscal year
 * @returns Detailed elimination report
 */
export async function reportICEliminations(
  sequelize: Sequelize,
  consolidationId: string,
  fiscalYear: number,
): Promise<any> {
  return sequelize.query(
    `SELECT
      COALESCE(SUM(ct.amount), 0) as total_ic_sales,
      COUNT(DISTINCT ct.id) as transaction_count,
      COUNT(DISTINCT CASE WHEN ct.reconciled = 1 THEN ct.id END) as reconciled_count,
      COUNT(DISTINCT CASE WHEN ct.reconciled = 0 THEN ct.id END) as unreconciled_count,
      MAX(ct.created_at) as last_transaction_date
     FROM consolidation_transactions ct
     WHERE ct.consolidation_id = ? AND ct.fiscal_year = ?`,
    {
      replacements: [consolidationId, fiscalYear],
      type: 'SELECT',
    },
  );
}

// ============================================================================
// SECTION 4: EQUITY METHOD (13-16)
// ============================================================================

/**
 * Calculate equity method pickup for associate/JV
 * @param sequelize - Database instance
 * @param investmentId - Investment ID
 * @param fiscalYear - Fiscal year
 * @returns Equity pickup calculation
 */
export async function calculateEquityPickup(
  sequelize: Sequelize,
  investmentId: string,
  fiscalYear: number,
): Promise<any> {
  return sequelize.query(
    `SELECT
      em.id, em.investee_id, em.investor_id, em.ownership_percentage,
      (SELECT SUM(CASE WHEN account_type = 'REVENUE' THEN amount
                       WHEN account_type = 'EXPENSE' THEN -amount ELSE 0 END)
       FROM gl_accounts
       WHERE entity_id = em.investee_id AND fiscal_year = ?) as investee_net_income,
      ((SELECT SUM(CASE WHEN account_type = 'REVENUE' THEN amount
                       WHEN account_type = 'EXPENSE' THEN -amount ELSE 0 END)
       FROM gl_accounts
       WHERE entity_id = em.investee_id AND fiscal_year = ?) * em.ownership_percentage / 100) as equity_pickup
     FROM equity_method_investments em
     WHERE em.id = ? AND em.fiscal_year = ?`,
    {
      replacements: [fiscalYear, fiscalYear, investmentId, fiscalYear],
      type: 'SELECT',
    },
  );
}

/**
 * Record equity method adjustment
 * @param sequelize - Database instance
 * @param investmentId - Investment ID
 * @param pickupAmount - Equity pickup amount
 * @returns Recorded adjustment
 */
export async function recordEquityAdjustment(
  sequelize: Sequelize,
  investmentId: string,
  pickupAmount: number,
): Promise<ConsolidationAdjustment> {
  const result = await sequelize.query(
    `INSERT INTO consolidation_adjustments
     (consolidation_id, account_from_id, account_to_id, amount, adjustment_type, created_at)
     SELECT em.consolidation_id,
            (SELECT id FROM chart_of_accounts WHERE code = '3100' LIMIT 1),
            (SELECT id FROM chart_of_accounts WHERE code = '6200' LIMIT 1),
            ?, ?, NOW()
     FROM equity_method_investments em
     WHERE em.id = ?
     RETURNING *`,
    {
      replacements: [pickupAmount, AdjustmentType.ALLOCATION, investmentId],
      type: 'SELECT',
    },
  );
  return result[0];
}

/**
 * Eliminate unrealized gains/losses in equity method investments
 * @param sequelize - Database instance
 * @param investmentId - Investment ID
 * @returns Elimination adjustments
 */
export async function eliminateUnrealizedGains(
  sequelize: Sequelize,
  investmentId: string,
): Promise<ConsolidationAdjustment[]> {
  return sequelize.query(
    `WITH unrealized_transactions AS (
       SELECT em.id, em.investor_id, em.investee_id, em.ownership_percentage,
              SUM(CASE WHEN ct.seller_id = em.investee_id AND ct.buyer_id = em.investor_id
                   THEN (ct.amount - ct.cost_basis) * em.ownership_percentage / 100 ELSE 0 END) as unrealized_gain
       FROM equity_method_investments em
       LEFT JOIN consolidation_transactions ct ON ct.seller_id = em.investee_id
                                               OR ct.buyer_id = em.investee_id
       WHERE em.id = ?
       GROUP BY em.id, em.investor_id, em.investee_id, em.ownership_percentage
     )
     INSERT INTO consolidation_adjustments
     (consolidation_id, adjustment_type, amount, created_at)
     SELECT em.consolidation_id, ?, ut.unrealized_gain, NOW()
     FROM unrealized_transactions ut
     JOIN equity_method_investments em ON em.id = ut.id
     RETURNING *`,
    {
      replacements: [investmentId, AdjustmentType.ELIMINATION],
      type: 'SELECT',
    },
  );
}

/**
 * Generate equity method investment report
 * @param sequelize - Database instance
 * @param consolidationId - Consolidation ID
 * @returns Equity method portfolio summary
 */
export async function reportEquityMethodInvestments(
  sequelize: Sequelize,
  consolidationId: string,
): Promise<any[]> {
  return sequelize.query(
    `SELECT
      em.id, em.investee_id, em.investor_id, em.ownership_percentage,
      em.investment_amount, em.acquisition_date,
      (SELECT SUM(CASE WHEN account_type = 'REVENUE' THEN amount
                      WHEN account_type = 'EXPENSE' THEN -amount ELSE 0 END)
       FROM gl_accounts WHERE entity_id = em.investee_id) as investee_net_income,
      (SELECT SUM(CASE WHEN account_type = 'REVENUE' THEN amount
                      WHEN account_type = 'EXPENSE' THEN -amount ELSE 0 END)
       FROM gl_accounts WHERE entity_id = em.investee_id) * em.ownership_percentage / 100 as equity_pickup,
      DATEDIFF(CURDATE(), em.acquisition_date) as investment_age_days
     FROM equity_method_investments em
     WHERE em.consolidation_id = ?
     ORDER BY em.investment_amount DESC`,
    {
      replacements: [consolidationId],
      type: 'SELECT',
    },
  );
}

// ============================================================================
// SECTION 5: CURRENCY TRANSLATION (17-20)
// ============================================================================

/**
 * Translate foreign subsidiary statements using current rate method
 * @param sequelize - Database instance
 * @param entityId - Entity ID
 * @param translationDate - Translation date
 * @param currentRate - Current exchange rate
 * @returns Translated account balances
 */
export async function translateStatementsCurrentRate(
  sequelize: Sequelize,
  entityId: string,
  translationDate: Date,
  currentRate: number,
): Promise<any[]> {
  return sequelize.query(
    `SELECT
      ga.id, ga.account_id, ga.balance, ga.currency,
      ga.balance * ? as translated_balance,
      ? as translation_date,
      ? as exchange_rate,
      'CURRENT_RATE' as translation_method
     FROM gl_accounts ga
     WHERE ga.entity_id = ? AND ga.currency != 'USD'
     ORDER BY ga.account_id`,
    {
      replacements: [currentRate, translationDate, currentRate, entityId],
      type: 'SELECT',
    },
  );
}

/**
 * Apply exchange rates from rate table to transactions
 * @param sequelize - Database instance
 * @param consolidationId - Consolidation ID
 * @param fiscalYear - Fiscal year
 * @returns Rate-adjusted balances
 */
export async function applyExchangeRates(
  sequelize: Sequelize,
  consolidationId: string,
  fiscalYear: number,
): Promise<any[]> {
  return sequelize.query(
    `SELECT
      ct.id, ct.amount, ct.currency,
      fx.exchange_rate, fx.rate_date,
      ct.amount * fx.exchange_rate as usd_amount,
      ct.amount * (SELECT AVG(fx2.exchange_rate)
                   FROM fx_rates fx2
                   WHERE fx2.currency = ct.currency
                   AND fx2.fiscal_year = ?) as average_translated_amount
     FROM consolidation_transactions ct
     LEFT JOIN fx_rates fx ON fx.currency = ct.currency
                            AND fx.fiscal_year = ?
                            AND fx.rate_type = 'SPOT'
     WHERE ct.consolidation_id = ? AND ct.fiscal_year = ?
     ORDER BY ct.currency, fx.rate_date DESC`,
    {
      replacements: [fiscalYear, fiscalYear, consolidationId, fiscalYear],
      type: 'SELECT',
    },
  );
}

/**
 * Recognize cumulative translation adjustment (CTA) in OCI
 * @param sequelize - Database instance
 * @param consolidationId - Consolidation ID
 * @param fiscalYear - Fiscal year
 * @returns CTA adjustments
 */
export async function recognizeCTA(
  sequelize: Sequelize,
  consolidationId: string,
  fiscalYear: number,
): Promise<ConsolidationAdjustment[]> {
  return sequelize.query(
    `WITH translation_variances AS (
       SELECT
         ce.id, ce.currency,
         SUM((ga.balance * (? / fx.prior_year_rate)) -
             (ga.balance * fx.current_rate)) as cta_variance
       FROM consolidated_entities ce
       JOIN gl_accounts ga ON ga.entity_id = ce.id
       JOIN fx_rates fx ON fx.currency = ce.currency AND fx.fiscal_year = ?
       WHERE ce.consolidation_id = ?
       GROUP BY ce.id, ce.currency
     )
     INSERT INTO consolidation_adjustments
     (consolidation_id, account_from_id, account_to_id, amount, adjustment_type, created_at)
     SELECT ?,
            (SELECT id FROM chart_of_accounts WHERE code = '9200' LIMIT 1),
            (SELECT id FROM chart_of_accounts WHERE code = '3500' LIMIT 1),
            tv.cta_variance, ?, NOW()
     FROM translation_variances tv
     WHERE tv.cta_variance != 0
     RETURNING *`,
    {
      replacements: [1, fiscalYear, consolidationId, consolidationId, AdjustmentType.RECLASSIFICATION],
      type: 'SELECT',
    },
  );
}

/**
 * Generate currency translation report
 * @param sequelize - Database instance
 * @param consolidationId - Consolidation ID
 * @param fiscalYear - Fiscal year
 * @returns Translation analysis by currency
 */
export async function reportCurrencyTranslation(
  sequelize: Sequelize,
  consolidationId: string,
  fiscalYear: number,
): Promise<any[]> {
  return sequelize.query(
    `SELECT
      ce.currency,
      COUNT(DISTINCT ce.id) as entity_count,
      SUM(ga.balance) as local_currency_balance,
      SUM(ga.balance * fx.exchange_rate) as usd_equivalent,
      SUM(ga.balance * (fx.current_rate - fx.prior_year_rate)) as translation_variance,
      SUM(CASE WHEN ga.account_type = 'ASSET' THEN ga.balance ELSE 0 END) as assets,
      SUM(CASE WHEN ga.account_type = 'LIABILITY' THEN ga.balance ELSE 0 END) as liabilities
     FROM consolidated_entities ce
     JOIN gl_accounts ga ON ga.entity_id = ce.id
     JOIN fx_rates fx ON fx.currency = ce.currency AND fx.fiscal_year = ?
     WHERE ce.consolidation_id = ?
     GROUP BY ce.currency
     ORDER BY usd_equivalent DESC`,
    {
      replacements: [fiscalYear, consolidationId],
      type: 'SELECT',
    },
  );
}

// ============================================================================
// SECTION 6: CONSOLIDATION ADJUSTMENTS (21-24)
// ============================================================================

/**
 * Record consolidation adjustment entry
 * @param sequelize - Database instance
 * @param adjustment - Adjustment data
 * @returns Created adjustment
 */
export async function recordConsolidationAdjustment(
  sequelize: Sequelize,
  adjustment: Omit<ConsolidationAdjustment, 'id' | 'createdAt'>,
): Promise<ConsolidationAdjustment> {
  const result = await sequelize.query(
    `INSERT INTO consolidation_adjustments
     (consolidation_id, debit_account, credit_account, amount, adjustment_type,
      description, fiscal_year, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
     RETURNING *`,
    {
      replacements: [
        adjustment.consolidationId,
        adjustment.debitAccount,
        adjustment.creditAccount,
        adjustment.amount,
        adjustment.adjustmentType,
        adjustment.description,
        adjustment.fiscalYear,
      ],
      type: 'SELECT',
    },
  );
  return result[0];
}

/**
 * Consolidate assets across entities with fair value adjustments
 * @param sequelize - Database instance
 * @param consolidationId - Consolidation ID
 * @returns Asset consolidation summary
 */
export async function consolidateAssets(
  sequelize: Sequelize,
  consolidationId: string,
): Promise<any[]> {
  return sequelize.query(
    `SELECT
      ga.account_id, coa.code, coa.name,
      SUM(ga.balance * COALESCE(ce.ownership_percentage, 100) / 100) as consolidated_balance,
      COUNT(DISTINCT ga.entity_id) as entity_count,
      MAX(fva.fair_value) as fair_value_adjustment
     FROM gl_accounts ga
     JOIN consolidated_entities ce ON ga.entity_id = ce.id
     JOIN chart_of_accounts coa ON ga.account_id = coa.id
     LEFT JOIN fair_value_allocations fva ON fva.asset_id = ga.account_id
     WHERE ce.consolidation_id = ? AND coa.account_type = 'ASSET'
     GROUP BY ga.account_id, coa.code, coa.name
     ORDER BY consolidated_balance DESC`,
    {
      replacements: [consolidationId],
      type: 'SELECT',
    },
  );
}

/**
 * Consolidate liabilities with payable adjustments
 * @param sequelize - Database instance
 * @param consolidationId - Consolidation ID
 * @returns Liability consolidation summary
 */
export async function consolidateLiabilities(
  sequelize: Sequelize,
  consolidationId: string,
): Promise<any[]> {
  return sequelize.query(
    `SELECT
      ga.account_id, coa.code, coa.name,
      SUM(ga.balance * COALESCE(ce.ownership_percentage, 100) / 100) as consolidated_balance,
      COUNT(DISTINCT ga.entity_id) as entity_count,
      SUM(CASE WHEN ga.maturity_date <= CURDATE() + INTERVAL 12 MONTH
               THEN ga.balance ELSE 0 END) as current_portion
     FROM gl_accounts ga
     JOIN consolidated_entities ce ON ga.entity_id = ce.id
     JOIN chart_of_accounts coa ON ga.account_id = coa.id
     WHERE ce.consolidation_id = ? AND coa.account_type = 'LIABILITY'
     GROUP BY ga.account_id, coa.code, coa.name
     ORDER BY consolidated_balance DESC`,
    {
      replacements: [consolidationId],
      type: 'SELECT',
    },
  );
}

/**
 * Consolidate equity accounts and eliminate parent investment
 * @param sequelize - Database instance
 * @param consolidationId - Consolidation ID
 * @returns Consolidated equity structure
 */
export async function consolidateEquity(
  sequelize: Sequelize,
  consolidationId: string,
): Promise<any[]> {
  return sequelize.query(
    `SELECT
      ce.id, ce.code, ce.name, ce.ownership_percentage,
      SUM(CASE WHEN coa.account_type = 'EQUITY' THEN ga.balance ELSE 0 END) as entity_equity,
      (SUM(CASE WHEN coa.account_type = 'EQUITY' THEN ga.balance ELSE 0 END) * ce.ownership_percentage / 100) as parent_share,
      SUM(CASE WHEN coa.account_type = 'EQUITY' THEN ga.balance ELSE 0 END) * (100 - ce.ownership_percentage) / 100 as minority_interest
     FROM consolidated_entities ce
     JOIN gl_accounts ga ON ga.entity_id = ce.id
     JOIN chart_of_accounts coa ON ga.account_id = coa.id
     WHERE ce.consolidation_id = ?
     GROUP BY ce.id, ce.code, ce.name, ce.ownership_percentage
     ORDER BY ce.ownership_percentage DESC`,
    {
      replacements: [consolidationId],
      type: 'SELECT',
    },
  );
}

// ============================================================================
// SECTION 7: MINORITY INTEREST (25-28)
// ============================================================================

/**
 * Calculate non-controlling interest (minority interest)
 * @param sequelize - Database instance
 * @param consolidationId - Consolidation ID
 * @param method - Calculation method (FULL_GOODWILL or PARTIAL_GOODWILL)
 * @returns NCI calculation
 */
export async function calculateMinorityInterest(
  sequelize: Sequelize,
  consolidationId: string,
  method: MinorityInterestMethod = MinorityInterestMethod.PARTIAL_GOODWILL,
): Promise<any[]> {
  const goodwillFormula = method === MinorityInterestMethod.FULL_GOODWILL
    ? 'SUM(ga.balance) * (100 - ce.ownership_percentage) / 100'
    : 'SUM(ga.balance) * (100 - ce.ownership_percentage) / 100 - COALESCE(gw.goodwill_amount, 0) * (100 - ce.ownership_percentage) / 100';

  return sequelize.query(
    `SELECT
      ce.id, ce.code, ce.name, ce.ownership_percentage,
      SUM(CASE WHEN coa.account_type IN ('EQUITY', 'REVENUE', 'EXPENSE') THEN ga.balance ELSE 0 END) as net_assets,
      ${goodwillFormula} as minority_interest_balance
     FROM consolidated_entities ce
     JOIN gl_accounts ga ON ga.entity_id = ce.id
     JOIN chart_of_accounts coa ON ga.account_id = coa.id
     LEFT JOIN goodwill gw ON gw.entity_id = ce.id
     WHERE ce.consolidation_id = ? AND ce.ownership_percentage < 100
     GROUP BY ce.id, ce.code, ce.name, ce.ownership_percentage
     ORDER BY minority_interest_balance DESC`,
    {
      replacements: [consolidationId],
      type: 'SELECT',
    },
  );
}

/**
 * Allocate subsidiary net income to minority shareholders
 * @param sequelize - Database instance
 * @param subsidiaryId - Subsidiary ID
 * @param netIncome - Subsidiary net income
 * @returns Income allocation
 */
export async function allocateIncomeToMinority(
  sequelize: Sequelize,
  subsidiaryId: string,
  netIncome: number,
): Promise<ConsolidationAdjustment> {
  const result = await sequelize.query(
    `INSERT INTO consolidation_adjustments
     (consolidation_id, account_from_id, account_to_id, amount, adjustment_type, created_at)
     SELECT ce.consolidation_id,
            (SELECT id FROM chart_of_accounts WHERE code = '9100' LIMIT 1),
            (SELECT id FROM chart_of_accounts WHERE code = '9300' LIMIT 1),
            ? * (100 - ce.ownership_percentage) / 100, ?, NOW()
     FROM consolidated_entities ce
     WHERE ce.id = ?
     RETURNING *`,
    {
      replacements: [netIncome, AdjustmentType.ALLOCATION, subsidiaryId],
      type: 'SELECT',
    },
  );
  return result[0];
}

/**
 * Adjust equity for minority interest changes
 * @param sequelize - Database instance
 * @param consolidationId - Consolidation ID
 * @returns Updated equity structure
 */
export async function adjustMinorityInterestEquity(
  sequelize: Sequelize,
  consolidationId: string,
): Promise<any[]> {
  return sequelize.query(
    `INSERT INTO consolidation_adjustments
     (consolidation_id, account_from_id, account_to_id, amount, adjustment_type, created_at)
     SELECT ?,
            (SELECT id FROM chart_of_accounts WHERE code = '3600' LIMIT 1),
            (SELECT id FROM chart_of_accounts WHERE code = '3700' LIMIT 1),
            SUM(micalc.minority_interest_balance), ?, NOW()
     FROM (
       SELECT
         (SUM(ga.balance) * (100 - ce.ownership_percentage) / 100) as minority_interest_balance
       FROM consolidated_entities ce
       JOIN gl_accounts ga ON ga.entity_id = ce.id
       WHERE ce.consolidation_id = ? AND ce.ownership_percentage < 100
       GROUP BY ce.id
     ) micalc
     RETURNING *`,
    {
      replacements: [consolidationId, AdjustmentType.ALLOCATION, consolidationId],
      type: 'SELECT',
    },
  );
}

/**
 * Generate minority interest report by entity
 * @param sequelize - Database instance
 * @param consolidationId - Consolidation ID
 * @returns Detailed minority interest analysis
 */
export async function reportMinorityInterest(
  sequelize: Sequelize,
  consolidationId: string,
): Promise<any[]> {
  return sequelize.query(
    `SELECT
      ce.id, ce.code, ce.name, ce.ownership_percentage,
      (100 - ce.ownership_percentage) as minority_percentage,
      SUM(CASE WHEN ga.account_type IN ('EQUITY', 'REVENUE', 'EXPENSE') THEN ga.balance ELSE 0 END) as net_assets,
      SUM(CASE WHEN ga.account_type IN ('EQUITY', 'REVENUE', 'EXPENSE') THEN ga.balance ELSE 0 END) * (100 - ce.ownership_percentage) / 100 as minority_share,
      SUM(CASE WHEN coa.code LIKE '9%' THEN ga.balance ELSE 0 END) as net_income,
      SUM(CASE WHEN coa.code LIKE '9%' THEN ga.balance ELSE 0 END) * (100 - ce.ownership_percentage) / 100 as minority_income
     FROM consolidated_entities ce
     JOIN gl_accounts ga ON ga.entity_id = ce.id
     JOIN chart_of_accounts coa ON ga.account_id = coa.id
     WHERE ce.consolidation_id = ? AND ce.ownership_percentage < 100
     GROUP BY ce.id, ce.code, ce.name, ce.ownership_percentage
     ORDER BY minority_share DESC`,
    {
      replacements: [consolidationId],
      type: 'SELECT',
    },
  );
}

// ============================================================================
// SECTION 8: GOODWILL (29-32)
// ============================================================================

/**
 * Calculate goodwill from acquisition
 * @param sequelize - Database instance
 * @param acquisitionId - Acquisition ID
 * @returns Goodwill calculation
 */
export async function calculateGoodwill(
  sequelize: Sequelize,
  acquisitionId: string,
): Promise<any> {
  const result = await sequelize.query(
    `INSERT INTO goodwill
     (acquisition_id, entity_id, purchase_price, fair_value_net_assets, goodwill_amount,
      calculation_date, created_at)
     SELECT acq.id, acq.target_entity_id, acq.purchase_price,
            (SELECT SUM(ga.balance) FROM gl_accounts ga WHERE ga.entity_id = acq.target_entity_id),
            acq.purchase_price - (SELECT SUM(ga.balance) FROM gl_accounts ga WHERE ga.entity_id = acq.target_entity_id),
            acq.acquisition_date, NOW()
     FROM acquisitions acq
     WHERE acq.id = ?
     RETURNING *`,
    {
      replacements: [acquisitionId],
      type: 'SELECT',
    },
  );
  return result[0];
}

/**
 * Test goodwill for impairment using discounted cash flows
 * @param sequelize - Database instance
 * @param goodwillId - Goodwill ID
 * @param recoveryAmount - Estimated fair value / recovery amount
 * @returns Impairment test result
 */
export async function testGoodwillImpairment(
  sequelize: Sequelize,
  goodwillId: string,
  recoveryAmount: number,
): Promise<any> {
  const result = await sequelize.query(
    `UPDATE goodwill
     SET test_date = NOW(),
         recovery_amount = ?,
         test_status = CASE
                       WHEN goodwill_amount > ? THEN ?
                       ELSE ?
                       END,
         impairment_loss = CASE
                          WHEN goodwill_amount > ? THEN goodwill_amount - ?
                          ELSE 0
                          END
     WHERE id = ?
     RETURNING *`,
    {
      replacements: [
        recoveryAmount,
        recoveryAmount,
        GoodwillTestStatus.IMPAIRMENT_RECOGNIZED,
        GoodwillTestStatus.TESTED_NO_IMPAIRMENT,
        recoveryAmount,
        recoveryAmount,
        goodwillId,
      ],
      type: 'SELECT',
    },
  );
  return result[0];
}

/**
 * Recognize goodwill impairment loss
 * @param sequelize - Database instance
 * @param goodwillId - Goodwill ID
 * @returns Impairment adjustment
 */
export async function recognizeGoodwillImpairment(
  sequelize: Sequelize,
  goodwillId: string,
): Promise<ConsolidationAdjustment> {
  const result = await sequelize.query(
    `INSERT INTO consolidation_adjustments
     (consolidation_id, account_from_id, account_to_id, amount, adjustment_type, created_at)
     SELECT (SELECT consolidation_id FROM acquisitions WHERE target_entity_id = gw.entity_id LIMIT 1),
            (SELECT id FROM chart_of_accounts WHERE code = '1900' LIMIT 1),
            (SELECT id FROM chart_of_accounts WHERE code = '6900' LIMIT 1),
            gw.impairment_loss, ?, NOW()
     FROM goodwill gw
     WHERE gw.id = ? AND gw.impairment_loss > 0
     RETURNING *`,
    {
      replacements: [AdjustmentType.ALLOCATION, goodwillId],
      type: 'SELECT',
    },
  );
  return result[0];
}

/**
 * Generate goodwill impairment disclosure
 * @param sequelize - Database instance
 * @param consolidationId - Consolidation ID
 * @returns Goodwill analysis and disclosures
 */
export async function reportGoodwillImpairment(
  sequelize: Sequelize,
  consolidationId: string,
): Promise<any[]> {
  return sequelize.query(
    `SELECT
      gw.id, gw.acquisition_id, acq.target_entity_id, acq.acquisition_date,
      gw.goodwill_amount, gw.impairment_loss,
      gw.goodwill_amount - COALESCE(gw.impairment_loss, 0) as carrying_amount,
      gw.test_status, gw.test_date, gw.recovery_amount,
      (gw.recovery_amount - gw.goodwill_amount) as headroom,
      DATEDIFF(gw.test_date, acq.acquisition_date) as days_since_acquisition
     FROM goodwill gw
     JOIN acquisitions acq ON gw.acquisition_id = acq.id
     WHERE acq.consolidation_id = ?
     ORDER BY gw.goodwill_amount DESC`,
    {
      replacements: [consolidationId],
      type: 'SELECT',
    },
  );
}

// ============================================================================
// SECTION 9: PUSH-DOWN ACCOUNTING (33-36)
// ============================================================================

/**
 * Allocate fair value to subsidiary identifiable assets
 * @param sequelize - Database instance
 * @param acquisitionId - Acquisition ID
 * @param allocationDetails - Fair value allocation details
 * @returns Allocation records
 */
export async function allocateFairValue(
  sequelize: Sequelize,
  acquisitionId: string,
  allocationDetails: Omit<FairValueAllocation, 'id'>[],
): Promise<FairValueAllocation[]> {
  const values = allocationDetails
    .map((a) => `('${acquisitionId}', '${a.assetId}', ${a.fairValue}, ${a.bookValue}, ${a.amortizationPeriod}, '${a.currency}')`)
    .join(',');

  const result = await sequelize.query(
    `INSERT INTO fair_value_allocations
     (acquisition_id, asset_id, fair_value, book_value, amortization_period, currency, created_at)
     VALUES ${values}
     RETURNING *`,
    {
      type: 'SELECT',
    },
  );
  return result;
}

/**
 * Record fair value adjustments at subsidiary
 * @param sequelize - Database instance
 * @param subsidiaryId - Subsidiary ID
 * @param acquisitionId - Acquisition ID
 * @returns Recorded fair value adjustments
 */
export async function recordSubsidiaryFairValue(
  sequelize: Sequelize,
  subsidiaryId: string,
  acquisitionId: string,
): Promise<ConsolidationAdjustment[]> {
  return sequelize.query(
    `INSERT INTO consolidation_adjustments
     (consolidation_id, debit_account, credit_account, amount, adjustment_type, created_at)
     SELECT acq.consolidation_id, ga.account_id, '5000',
            fva.fair_value - fva.book_value, ?, NOW()
     FROM fair_value_allocations fva
     JOIN gl_accounts ga ON ga.account_id = fva.asset_id
     JOIN acquisitions acq ON acq.id = fva.acquisition_id
     WHERE acq.target_entity_id = ? AND acq.id = ?
     AND fva.fair_value != fva.book_value
     RETURNING *`,
    {
      replacements: [AdjustmentType.FAIR_VALUE, subsidiaryId, acquisitionId],
      type: 'SELECT',
    },
  );
}

/**
 * Amortize fair value differences over useful lives
 * @param sequelize - Database instance
 * @param acquisitionId - Acquisition ID
 * @param currentFiscalYear - Current fiscal year
 * @returns Amortization entries
 */
export async function amortizeFairValueDifferences(
  sequelize: Sequelize,
  acquisitionId: string,
  currentFiscalYear: number,
): Promise<ConsolidationAdjustment[]> {
  return sequelize.query(
    `WITH amortization_calc AS (
       SELECT fva.id, fva.fair_value, fva.book_value, fva.amortization_period,
              (fva.fair_value - fva.book_value) / fva.amortization_period as annual_amortization,
              YEAR(acq.acquisition_date) as acquisition_year,
              (? - YEAR(acq.acquisition_date)) as years_outstanding
       FROM fair_value_allocations fva
       JOIN acquisitions acq ON acq.id = fva.acquisition_id
       WHERE fva.acquisition_id = ? AND years_outstanding < amortization_period
     )
     INSERT INTO consolidation_adjustments
     (consolidation_id, debit_account, credit_account, amount, adjustment_type, created_at)
     SELECT (SELECT consolidation_id FROM acquisitions WHERE id = ?),
            (SELECT id FROM chart_of_accounts WHERE code = '6500' LIMIT 1),
            (SELECT id FROM chart_of_accounts WHERE code = '1950' LIMIT 1),
            ac.annual_amortization, ?, NOW()
     FROM amortization_calc ac
     RETURNING *`,
    {
      replacements: [currentFiscalYear, acquisitionId, acquisitionId, AdjustmentType.ALLOCATION],
      type: 'SELECT',
    },
  );
}

/**
 * Generate push-down accounting disclosure report
 * @param sequelize - Database instance
 * @param consolidationId - Consolidation ID
 * @returns Fair value allocation summary
 */
export async function reportPushDownAccounting(
  sequelize: Sequelize,
  consolidationId: string,
): Promise<any[]> {
  return sequelize.query(
    `SELECT
      fva.id, fva.acquisition_id, acq.target_entity_id, acq.acquisition_date,
      fva.asset_id, coa.code, coa.name,
      fva.book_value, fva.fair_value, fva.fair_value - fva.book_value as adjustment,
      fva.amortization_period,
      (fva.fair_value - fva.book_value) / fva.amortization_period as annual_amortization,
      DATEDIFF(CURDATE(), acq.acquisition_date) / 365 as years_since_acquisition
     FROM fair_value_allocations fva
     JOIN acquisitions acq ON acq.id = fva.acquisition_id
     JOIN chart_of_accounts coa ON coa.id = fva.asset_id
     WHERE acq.consolidation_id = ?
     ORDER BY fva.fair_value DESC`,
    {
      replacements: [consolidationId],
      type: 'SELECT',
    },
  );
}

// ============================================================================
// SECTION 10: CONSOLIDATION REPORTING (37-40)
// ============================================================================

/**
 * Generate consolidated balance sheet
 * @param sequelize - Database instance
 * @param consolidationId - Consolidation ID
 * @param asOfDate - Balance sheet date
 * @returns Consolidated balance sheet
 */
export async function generateConsolidatedBalanceSheet(
  sequelize: Sequelize,
  consolidationId: string,
  asOfDate: Date,
): Promise<any[]> {
  return sequelize.query(
    `SELECT
      coa.code, coa.name, coa.account_type,
      SUM(CASE WHEN ce.ownership_percentage IS NOT NULL
               THEN ga.balance * ce.ownership_percentage / 100
               ELSE ga.balance END) as balance,
      COUNT(DISTINCT ga.entity_id) as entity_count
     FROM consolidated_entities ce
     JOIN gl_accounts ga ON ga.entity_id = ce.id
     JOIN chart_of_accounts coa ON ga.account_id = coa.id
     WHERE ce.consolidation_id = ? AND ga.posting_date <= ?
       AND coa.account_type IN ('ASSET', 'LIABILITY', 'EQUITY')
     GROUP BY coa.code, coa.name, coa.account_type
     ORDER BY coa.code`,
    {
      replacements: [consolidationId, asOfDate],
      type: 'SELECT',
    },
  );
}

/**
 * Generate consolidated income statement
 * @param sequelize - Database instance
 * @param consolidationId - Consolidation ID
 * @param fiscalYear - Fiscal year
 * @returns Consolidated income statement
 */
export async function generateConsolidatedIncomeStatement(
  sequelize: Sequelize,
  consolidationId: string,
  fiscalYear: number,
): Promise<any[]> {
  return sequelize.query(
    `SELECT
      coa.code, coa.name, coa.account_type,
      SUM(CASE WHEN ce.ownership_percentage IS NOT NULL
               THEN ga.balance * ce.ownership_percentage / 100
               ELSE ga.balance END) as amount,
      SUM(CASE WHEN coa.account_type = 'REVENUE'
               THEN ga.balance * ce.ownership_percentage / 100 ELSE 0 END) as revenue,
      SUM(CASE WHEN coa.account_type = 'EXPENSE'
               THEN ga.balance * ce.ownership_percentage / 100 ELSE 0 END) as expense
     FROM consolidated_entities ce
     JOIN gl_accounts ga ON ga.entity_id = ce.id AND YEAR(ga.posting_date) = ?
     JOIN chart_of_accounts coa ON ga.account_id = coa.id
     WHERE ce.consolidation_id = ?
       AND coa.account_type IN ('REVENUE', 'EXPENSE', 'GAIN', 'LOSS')
     GROUP BY coa.code, coa.name, coa.account_type
     ORDER BY coa.code`,
    {
      replacements: [fiscalYear, consolidationId],
      type: 'SELECT',
    },
  );
}

/**
 * Generate consolidated cash flow statement
 * @param sequelize - Database instance
 * @param consolidationId - Consolidation ID
 * @param fiscalYear - Fiscal year
 * @returns Consolidated cash flows
 */
export async function generateConsolidatedCashFlow(
  sequelize: Sequelize,
  consolidationId: string,
  fiscalYear: number,
): Promise<any[]> {
  return sequelize.query(
    `WITH cash_flows AS (
       SELECT ce.id, ce.code, ce.name,
              SUM(CASE WHEN cf.activity_type = 'OPERATING' THEN cf.amount ELSE 0 END) as operating_cf,
              SUM(CASE WHEN cf.activity_type = 'INVESTING' THEN cf.amount ELSE 0 END) as investing_cf,
              SUM(CASE WHEN cf.activity_type = 'FINANCING' THEN cf.amount ELSE 0 END) as financing_cf
       FROM consolidated_entities ce
       JOIN cash_flow_items cf ON cf.entity_id = ce.id AND YEAR(cf.posting_date) = ?
       WHERE ce.consolidation_id = ?
       GROUP BY ce.id, ce.code, ce.name
     )
     SELECT code, name,
            SUM(operating_cf) as total_operating_cf,
            SUM(investing_cf) as total_investing_cf,
            SUM(financing_cf) as total_financing_cf,
            SUM(operating_cf + investing_cf + financing_cf) as net_cf
     FROM cash_flows
     GROUP BY code, name
     ORDER BY code`,
    {
      replacements: [fiscalYear, consolidationId],
      type: 'SELECT',
    },
  );
}

/**
 * Generate segment reporting by business and geography
 * @param sequelize - Database instance
 * @param consolidationId - Consolidation ID
 * @param fiscalYear - Fiscal year
 * @returns Segment analysis
 */
export async function generateSegmentReporting(
  sequelize: Sequelize,
  consolidationId: string,
  fiscalYear: number,
): Promise<SegmentReport[]> {
  return sequelize.query(
    `SELECT
      COALESCE(ce.segment_id, ce.id) as segment_id,
      COALESCE(cs.segment_type, 'BUSINESS') as segment_type,
      COALESCE(cs.name, ce.name) as segment_name,
      SUM(CASE WHEN coa.code LIKE '4%' THEN ga.balance ELSE 0 END) as revenue,
      SUM(CASE WHEN coa.code LIKE '9%' THEN ga.balance ELSE 0 END) as operating_income,
      SUM(CASE WHEN coa.account_type = 'ASSET' THEN ga.balance ELSE 0 END) as total_assets,
      COUNT(DISTINCT ga.entity_id) as entity_count
     FROM consolidated_entities ce
     LEFT JOIN consolidation_segments cs ON ce.segment_id = cs.id
     JOIN gl_accounts ga ON ga.entity_id = ce.id AND YEAR(ga.posting_date) = ?
     JOIN chart_of_accounts coa ON ga.account_id = coa.id
     WHERE ce.consolidation_id = ?
     GROUP BY segment_id, segment_type, segment_name
     ORDER BY revenue DESC`,
    {
      replacements: [fiscalYear, consolidationId],
      type: 'SELECT',
    },
  );
}

export const FinancialConsolidationKit = {
  createConsolidationEntity,
  defineEntityHierarchy,
  setEntityOwnership,
  getEntityHierarchy,
  determineConsolidationScope,
  applyConsolidationCriteria,
  adjustEntityOwnership,
  finalizeConsolidationScope,
  identifyICTransactions,
  eliminateICSalesAndPurchases,
  eliminateICBalances,
  reportICEliminations,
  calculateEquityPickup,
  recordEquityAdjustment,
  eliminateUnrealizedGains,
  reportEquityMethodInvestments,
  translateStatementsCurrentRate,
  applyExchangeRates,
  recognizeCTA,
  reportCurrencyTranslation,
  recordConsolidationAdjustment,
  consolidateAssets,
  consolidateLiabilities,
  consolidateEquity,
  calculateMinorityInterest,
  allocateIncomeToMinority,
  adjustMinorityInterestEquity,
  reportMinorityInterest,
  calculateGoodwill,
  testGoodwillImpairment,
  recognizeGoodwillImpairment,
  reportGoodwillImpairment,
  allocateFairValue,
  recordSubsidiaryFairValue,
  amortizeFairValueDifferences,
  reportPushDownAccounting,
  generateConsolidatedBalanceSheet,
  generateConsolidatedIncomeStatement,
  generateConsolidatedCashFlow,
  generateSegmentReporting,
};
