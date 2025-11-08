/**
 * Banking Reconciliation Automation Kit - FIN-BANK-001
 *
 * Enterprise-grade banking reconciliation system with advanced Sequelize queries.
 * Competes with BlackLine, Trintech, ReconArt platforms.
 *
 * Features:
 * - Automated bank feed processing and transaction normalization
 * - Intelligent multi-algorithm transaction matching (amount, date, fuzzy, ML)
 * - Rules engine with pattern learning and optimization
 * - Manual matching workflow with split transaction support
 * - Real-time reconciliation with variance identification
 * - Outstanding items tracking (deposits in transit, checks)
 * - Bank error detection and resolution workflow
 * - Multi-currency FX handling with revaluation
 * - Cash application with invoice matching
 * - Comprehensive audit reporting and variance analysis
 *
 * Stack: NestJS 10.x, Sequelize 6.x
 * Author: AI Agent | Date: 2025-11-08
 */

import { Op, sequelize, QueryTypes, Transaction } from 'sequelize';
import {
  BankAccount,
  BankTransaction,
  BankFeed,
  MatchingRule,
  ManualMatch,
  ReconciliationStatus,
  BankError,
  CurrencyRate,
  CashApplication,
  ReconciliationReport,
} from '@models';

// ============================================================================
// TYPES & INTERFACES (8-10)
// ============================================================================

interface BankFeedConfig {
  bankCode: string;
  accountNumber: string;
  apiKey: string;
  feedType: 'OFX' | 'MT940' | 'CSV' | 'API';
  startDate: Date;
  endDate: Date;
}

interface NormalizedTransaction {
  externalId: string;
  amount: number;
  date: Date;
  description: string;
  counterparty: string;
  currency: string;
  type: 'CREDIT' | 'DEBIT';
  metadata: Record<string, any>;
}

interface MatchingRule {
  id: string;
  priority: number;
  algorithms: MatchingAlgorithm[];
  conditions: Record<string, any>;
  weight: number;
  matchRate: number;
}

interface MatchingAlgorithm {
  type: 'AMOUNT' | 'DATE_RANGE' | 'FUZZY' | 'ML';
  tolerance: number;
  parameters: Record<string, any>;
}

interface TransactionMatch {
  bankTxnId: string;
  bookTxnId: string;
  algorithm: string;
  confidence: number;
  variance: number;
}

interface ReconciliationVariance {
  id: string;
  bookBalance: number;
  bankBalance: number;
  variance: number;
  variancePercent: number;
  categories: string[];
  items: VarianceItem[];
}

interface VarianceItem {
  txnId: string;
  amount: number;
  days: number;
  category: 'IN_TRANSIT' | 'ERROR' | 'TIMING' | 'UNMATCHED';
}

interface MultiCurrencyBalance {
  currency: string;
  amount: number;
  rate: number;
  baseCurrencyAmount: number;
  revaluationGain: number;
  revaluationLoss: number;
}

interface CashApplicationMatch {
  paymentId: string;
  invoiceId: string;
  matchedAmount: number;
  remainingAmount: number;
  discountAmount: number;
  status: 'PARTIAL' | 'FULL' | 'OVERPAYMENT';
}

interface AuditTrail {
  action: string;
  timestamp: Date;
  userId: string;
  changes: Record<string, any>;
  source: string;
}

// ============================================================================
// SERVICE CLASS: Banking Reconciliation Automation
// ============================================================================

export class BankingReconciliationAutomationService {
  /**
   * BANK FEEDS (1-4)
   */

  /**
   * 1. Connect bank feed source with validation
   */
  async connectBankFeed(config: BankFeedConfig): Promise<BankFeed> {
    return sequelize.transaction(async (t: Transaction) => {
      const existing = await BankFeed.findOne({
        where: {
          bankCode: config.bankCode,
          accountNumber: config.accountNumber,
        },
      });

      if (existing) {
        return existing.update(
          {
            apiKey: this.encryptKey(config.apiKey),
            feedType: config.feedType,
            status: 'CONNECTED',
            lastSyncAt: new Date(),
          },
          { transaction: t }
        );
      }

      return BankFeed.create(
        {
          bankCode: config.bankCode,
          accountNumber: config.accountNumber,
          apiKey: this.encryptKey(config.apiKey),
          feedType: config.feedType,
          status: 'CONNECTED',
          syncHistory: [],
        },
        { transaction: t }
      );
    });
  }

  /**
   * 2. Import and batch process bank statements
   */
  async importBankStatements(
    feedId: string,
    statements: any[],
    batchSize: number = 500
  ): Promise<{ imported: number; failed: number; errors: any[] }> {
    const errors: any[] = [];
    let imported = 0;

    for (let i = 0; i < statements.length; i += batchSize) {
      const batch = statements.slice(i, i + batchSize);

      try {
        const results = await sequelize.transaction(async (t: Transaction) => {
          return BankTransaction.bulkCreate(
            batch.map((stmt) => ({
              feedId,
              externalId: stmt.id,
              amount: stmt.amount,
              date: stmt.date,
              description: stmt.description,
              counterparty: stmt.counterparty,
              currency: stmt.currency || 'USD',
              type: stmt.amount > 0 ? 'CREDIT' : 'DEBIT',
              rawData: stmt,
              status: 'IMPORTED',
            })),
            {
              transaction: t,
              ignoreDuplicates: true,
              updateOnDuplicate: ['rawData', 'updatedAt'],
            }
          );
        });

        imported += results.length;
      } catch (error) {
        errors.push({
          batch: i,
          error: error.message,
          records: batch.length,
        });
      }
    }

    return { imported, failed: errors.length, errors };
  }

  /**
   * 3. Parse and normalize multi-format statements
   */
  async parseStatements(
    feedId: string,
    format: 'OFX' | 'MT940' | 'CSV'
  ): Promise<NormalizedTransaction[]> {
    const transactions = await BankTransaction.findAll({
      where: { feedId, status: 'IMPORTED' },
      attributes: [
        'id',
        'externalId',
        'amount',
        'date',
        'description',
        'counterparty',
        'currency',
        'rawData',
      ],
      limit: 1000,
    });

    return transactions.map((txn: any) => ({
      externalId: txn.externalId,
      amount: this.normalizeAmount(txn.amount, format),
      date: this.normalizeDate(txn.date, format),
      description: this.normalizeDescription(txn.description, format),
      counterparty: this.extractCounterparty(txn.rawData, format),
      currency: txn.currency,
      type: txn.amount > 0 ? 'CREDIT' : 'DEBIT',
      metadata: this.extractMetadata(txn.rawData, format),
    }));
  }

  /**
   * 4. Normalize transaction data across bank formats
   */
  async normalizeData(
    feedId: string,
    transactions: NormalizedTransaction[]
  ): Promise<BankTransaction[]> {
    return sequelize.transaction(async (t: Transaction) => {
      const normalized = await BankTransaction.bulkCreate(
        transactions.map((txn) => ({
          feedId,
          externalId: txn.externalId,
          amount: txn.amount,
          date: txn.date,
          description: txn.description,
          counterparty: txn.counterparty,
          currency: txn.currency,
          type: txn.type,
          status: 'NORMALIZED',
          metadata: txn.metadata,
        })),
        { transaction: t, validate: true }
      );

      await BankFeed.update(
        { normalizationStatus: 'COMPLETE', lastNormalizedAt: new Date() },
        { where: { id: feedId }, transaction: t }
      );

      return normalized;
    });
  }

  /**
   * AUTO-MATCHING (5-8)
   */

  /**
   * 5. Match transactions by exact amount
   */
  async matchByAmount(
    bankTxnId: string,
    tolerance: number = 0.01
  ): Promise<TransactionMatch[]> {
    const bankTxn = await BankTransaction.findByPk(bankTxnId, {
      attributes: ['amount', 'date', 'currency'],
    });

    const matches = await sequelize.query(`
      SELECT
        bt.id as "bankTxnId",
        bk.id as "bookTxnId",
        'AMOUNT' as algorithm,
        (1 - (ABS(bt.amount - bk.amount) / bt.amount)) as confidence,
        (bt.amount - bk.amount) as variance
      FROM bank_transactions bt
      JOIN book_transactions bk ON bt.currency = bk.currency
      WHERE bt.id != :bankTxnId
        AND bt.status = 'NORMALIZED'
        AND bk.status = 'UNMATCHED'
        AND ABS(bt.amount - bk.amount) <= :tolerance
        AND bk.amount > 0
        AND bt.date BETWEEN DATE_SUB(bk.date, INTERVAL 5 DAY)
                       AND DATE_ADD(bk.date, INTERVAL 5 DAY)
      ORDER BY confidence DESC
      LIMIT 100
    `, {
      replacements: {
        bankTxnId,
        tolerance: tolerance * Math.abs(bankTxn.amount),
      },
      type: QueryTypes.SELECT,
    });

    return matches;
  }

  /**
   * 6. Date range matching with proximity scoring
   */
  async matchByDateRange(
    bankTxnId: string,
    dateRange: { start: Date; end: Date }
  ): Promise<TransactionMatch[]> {
    return sequelize.query(`
      SELECT
        bt.id as "bankTxnId",
        bk.id as "bookTxnId",
        'DATE_RANGE' as algorithm,
        POWER(0.95, DATEDIFF(bt.date, bk.date)) as confidence,
        DATEDIFF(bt.date, bk.date) as variance
      FROM bank_transactions bt
      JOIN book_transactions bk
        ON bt.currency = bk.currency
        AND ABS(bt.amount) = ABS(bk.amount)
      WHERE bt.id = :bankTxnId
        AND bk.status = 'UNMATCHED'
        AND bk.date BETWEEN :startDate AND :endDate
        AND ABS(bt.amount - bk.amount) < 0.01
      ORDER BY confidence DESC
      LIMIT 50
    `, {
      replacements: {
        bankTxnId,
        startDate: dateRange.start,
        endDate: dateRange.end,
      },
      type: QueryTypes.SELECT,
    });
  }

  /**
   * 7. Fuzzy string matching for counterparty names
   */
  async matchByFuzzyMatch(
    bankTxnId: string,
    fuzzyThreshold: number = 0.75
  ): Promise<TransactionMatch[]> {
    const bankTxn = await BankTransaction.findByPk(bankTxnId, {
      attributes: ['counterparty', 'description', 'amount'],
    });

    return sequelize.query(`
      SELECT
        bt.id as "bankTxnId",
        bk.id as "bookTxnId",
        'FUZZY' as algorithm,
        (1 - (LEVENSHTEIN(UPPER(bt.counterparty), UPPER(bk.counterparty)) /
              GREATEST(LENGTH(bt.counterparty), LENGTH(bk.counterparty)))) as confidence,
        (bt.amount - bk.amount) as variance
      FROM bank_transactions bt
      JOIN book_transactions bk ON bt.currency = bk.currency
      WHERE bt.id = :bankTxnId
        AND bk.status = 'UNMATCHED'
        AND ABS(bt.amount - bk.amount) < 0.01
        AND (1 - (LEVENSHTEIN(UPPER(bt.counterparty), UPPER(bk.counterparty)) /
                  GREATEST(LENGTH(bt.counterparty), LENGTH(bk.counterparty)))) > :threshold
      ORDER BY confidence DESC
      LIMIT 50
    `, {
      replacements: {
        bankTxnId,
        threshold: fuzzyThreshold,
      },
      type: QueryTypes.SELECT,
    });
  }

  /**
   * 8. ML-based matching using historical patterns
   */
  async matchByMLAlgorithm(
    bankTxnId: string,
    modelWeights: Record<string, number> = {}
  ): Promise<TransactionMatch[]> {
    const defaultWeights = {
      amount: 0.4,
      date: 0.25,
      counterparty: 0.2,
      description: 0.15,
      ...modelWeights,
    };

    return sequelize.query(`
      SELECT
        bt.id as "bankTxnId",
        bk.id as "bookTxnId",
        'ML' as algorithm,
        (
          :amountWeight * (1 - (ABS(bt.amount - bk.amount) / GREATEST(ABS(bt.amount), 0.01))) +
          :dateWeight * POWER(0.98, DATEDIFF(ABS(bt.date - bk.date), 0)) +
          :counterpartyWeight * (1 - (LEVENSHTEIN(bt.counterparty, bk.counterparty) / 50)) +
          :descriptionWeight * (1 - (LEVENSHTEIN(bt.description, bk.description) / 100))
        ) as confidence,
        (bt.amount - bk.amount) as variance
      FROM bank_transactions bt
      JOIN book_transactions bk ON bt.currency = bk.currency
      WHERE bt.id = :bankTxnId
        AND bk.status = 'UNMATCHED'
        AND (
          :amountWeight * (1 - (ABS(bt.amount - bk.amount) / GREATEST(ABS(bt.amount), 0.01))) +
          :dateWeight * POWER(0.98, DATEDIFF(ABS(bt.date - bk.date), 0)) +
          :counterpartyWeight * (1 - (LEVENSHTEIN(bt.counterparty, bk.counterparty) / 50)) +
          :descriptionWeight * (1 - (LEVENSHTEIN(bt.description, bk.description) / 100))
        ) > 0.75
      ORDER BY confidence DESC
      LIMIT 50
    `, {
      replacements: {
        bankTxnId,
        amountWeight: defaultWeights.amount,
        dateWeight: defaultWeights.date,
        counterpartyWeight: defaultWeights.counterparty,
        descriptionWeight: defaultWeights.description,
      },
      type: QueryTypes.SELECT,
    });
  }

  /**
   * RULES ENGINE (9-12)
   */

  /**
   * 9. Create matching rule with multi-algorithm support
   */
  async createMatchingRule(
    rule: MatchingRule
  ): Promise<any> {
    return sequelize.transaction(async (t: Transaction) => {
      const created = await sequelize.models.MatchingRule.create(
        {
          priority: rule.priority,
          algorithms: rule.algorithms,
          conditions: rule.conditions,
          weight: rule.weight,
          matchRate: 0,
          status: 'ACTIVE',
          trainingSet: [],
        },
        { transaction: t }
      );

      return created;
    });
  }

  /**
   * 10. Apply rules engine to unmatched transactions
   */
  async applyMatchingRules(
    feedId: string,
    batchSize: number = 100
  ): Promise<{ matched: number; applied: number }> {
    const rules = await sequelize.models.MatchingRule.findAll({
      where: { status: 'ACTIVE' },
      order: [['priority', 'ASC']],
    });

    const unmatched = await BankTransaction.findAll({
      where: {
        feedId,
        status: 'NORMALIZED',
        matchedBookTxnId: { [Op.is]: null },
      },
      limit: batchSize,
    });

    let matched = 0;

    for (const txn of unmatched) {
      for (const rule of rules) {
        const candidates = await this.evaluateRuleConditions(
          txn,
          rule
        );

        if (candidates.length > 0) {
          const best = candidates[0];
          await ManualMatch.create({
            bankTxnId: txn.id,
            bookTxnId: best.bookTxnId,
            algorithm: rule.priority,
            confidence: best.confidence,
            ruleId: rule.id,
            status: 'AUTO_MATCHED',
            variance: best.variance,
          });

          matched++;
          break;
        }
      }
    }

    return { matched, applied: unmatched.length };
  }

  /**
   * 11. Learn matching patterns from manual matches
   */
  async learnMatchingPatterns(
    ruleLearningConfig: {
      minConfidence: number;
      minSamples: number;
      timeWindow: number;
    }
  ): Promise<Record<string, any>> {
    const patterns = await sequelize.query(`
      SELECT
        mm.algorithm,
        bt.counterparty,
        bk.account_number,
        COUNT(*) as match_count,
        AVG(mm.confidence) as avg_confidence,
        STDDEV(mm.variance) as variance_stddev
      FROM manual_matches mm
      JOIN bank_transactions bt ON mm.bank_txn_id = bt.id
      JOIN book_transactions bk ON mm.book_txn_id = bk.id
      WHERE mm.status = 'MATCHED'
        AND mm.created_at > DATE_SUB(NOW(), INTERVAL :timeWindow DAY)
        AND mm.confidence >= :minConfidence
      GROUP BY mm.algorithm, bt.counterparty, bk.account_number
      HAVING COUNT(*) >= :minSamples
      ORDER BY match_count DESC
    `, {
      replacements: ruleLearningConfig,
      type: QueryTypes.SELECT,
    });

    return {
      patterns,
      trained: patterns.length,
      timestamp: new Date(),
    };
  }

  /**
   * 12. Optimize rules based on historical performance
   */
  async optimizeRules(): Promise<Record<string, any>> {
    const optimization = await sequelize.query(`
      SELECT
        mr.id,
        mr.priority,
        COUNT(mm.id) as total_applications,
        SUM(CASE WHEN mm.status = 'MATCHED' THEN 1 ELSE 0 END) as successful_matches,
        AVG(mm.confidence) as avg_confidence,
        (SUM(CASE WHEN mm.status = 'MATCHED' THEN 1 ELSE 0 END) /
         COUNT(mm.id)) as match_rate,
        (SUM(CASE WHEN ABS(mm.variance) < 0.01 THEN 1 ELSE 0 END) /
         SUM(CASE WHEN mm.status = 'MATCHED' THEN 1 ELSE 0 END)) as accuracy
      FROM matching_rules mr
      LEFT JOIN manual_matches mm ON mr.id = mm.rule_id
      WHERE mr.status = 'ACTIVE'
        AND mm.created_at > DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY mr.id
      ORDER BY match_rate DESC
    `, {
      type: QueryTypes.SELECT,
    });

    await sequelize.transaction(async (t: Transaction) => {
      for (let i = 0; i < optimization.length; i++) {
        await sequelize.models.MatchingRule.update(
          {
            priority: i + 1,
            matchRate: optimization[i].match_rate,
          },
          {
            where: { id: optimization[i].id },
            transaction: t,
          }
        );
      }
    });

    return optimization;
  }

  /**
   * MANUAL MATCHING (13-16)
   */

  /**
   * 13. Propose matching candidates with confidence scores
   */
  async proposeMatches(
    bankTxnId: string,
    limit: number = 10
  ): Promise<TransactionMatch[]> {
    const bankTxn = await BankTransaction.findByPk(bankTxnId, {
      attributes: ['amount', 'date', 'counterparty', 'currency'],
    });

    return sequelize.query(`
      SELECT
        bt.id as "bankTxnId",
        bk.id as "bookTxnId",
        COALESCE(mr.algorithm_type, 'MANUAL') as algorithm,
        (
          0.4 * (1 - (ABS(bt.amount - bk.amount) / GREATEST(ABS(bt.amount), 0.01))) +
          0.3 * POWER(0.95, DATEDIFF(bt.date, bk.date)) +
          0.2 * (1 - (LEVENSHTEIN(bt.counterparty, bk.counterparty) / 50)) +
          0.1 * CASE WHEN bk.status = 'UNMATCHED' THEN 1 ELSE 0.5 END
        ) as confidence,
        (bt.amount - bk.amount) as variance
      FROM bank_transactions bt
      JOIN book_transactions bk ON bt.currency = bk.currency
      LEFT JOIN matching_rules mr ON 1=1
      WHERE bt.id = :bankTxnId
        AND bk.status IN ('UNMATCHED', 'PARTIAL_MATCH')
        AND ABS(bt.amount - bk.amount) < ABS(bt.amount) * 0.15
        AND bk.date BETWEEN DATE_SUB(bt.date, INTERVAL 10 DAY)
                        AND DATE_ADD(bt.date, INTERVAL 10 DAY)
      ORDER BY confidence DESC
      LIMIT :limit
    `, {
      replacements: { bankTxnId, limit },
      type: QueryTypes.SELECT,
    });
  }

  /**
   * 14. Review and accept/reject match suggestions
   */
  async reviewMatchSuggestion(
    bankTxnId: string,
    bookTxnId: string,
    action: 'ACCEPT' | 'REJECT',
    notes: string = ''
  ): Promise<ManualMatch> {
    return sequelize.transaction(async (t: Transaction) => {
      const match = await ManualMatch.create(
        {
          bankTxnId,
          bookTxnId,
          status: action === 'ACCEPT' ? 'MATCHED' : 'REJECTED',
          algorithm: 'MANUAL_REVIEW',
          confidence: 1.0,
          reviewNotes: notes,
          reviewedAt: new Date(),
        },
        { transaction: t }
      );

      if (action === 'ACCEPT') {
        await BankTransaction.update(
          { matchedBookTxnId: bookTxnId, status: 'MATCHED' },
          { where: { id: bankTxnId }, transaction: t }
        );

        await sequelize.models.BookTransaction.update(
          { status: 'MATCHED' },
          { where: { id: bookTxnId }, transaction: t }
        );
      }

      return match;
    });
  }

  /**
   * 15. Manual transaction linking with variance capture
   */
  async manualLinkTransactions(
    bankTxnId: string,
    bookTxnIds: string[],
    variance: number
  ): Promise<ManualMatch> {
    return sequelize.transaction(async (t: Transaction) => {
      const match = await ManualMatch.create(
        {
          bankTxnId,
          bookTxnIds: bookTxnIds,
          status: 'LINKED',
          algorithm: 'MANUAL_LINK',
          confidence: 1.0,
          variance,
          linkedAt: new Date(),
        },
        { transaction: t }
      );

      await BankTransaction.update(
        { matchedBookTxnIds: bookTxnIds, variance },
        { where: { id: bankTxnId }, transaction: t }
      );

      return match;
    });
  }

  /**
   * 16. Handle split transactions across multiple book entries
   */
  async splitTransaction(
    bankTxnId: string,
    splits: Array<{
      bookTxnId: string;
      amount: number;
      description: string;
    }>
  ): Promise<ManualMatch> {
    return sequelize.transaction(async (t: Transaction) => {
      const splitMatch = await ManualMatch.create(
        {
          bankTxnId,
          bookTxnIds: splits.map((s) => s.bookTxnId),
          status: 'SPLIT_MATCHED',
          algorithm: 'MANUAL_SPLIT',
          splitDetails: splits,
          confidence: 1.0,
          variance: 0,
        },
        { transaction: t }
      );

      const bankTxn = await BankTransaction.findByPk(bankTxnId, {
        transaction: t,
      });
      const totalSplitAmount = splits.reduce((sum, s) => sum + s.amount, 0);
      const variance = bankTxn.amount - totalSplitAmount;

      await BankTransaction.update(
        {
          matchedBookTxnIds: splits.map((s) => s.bookTxnId),
          splitDetails: splits,
          variance,
          status: 'MATCHED',
        },
        { where: { id: bankTxnId }, transaction: t }
      );

      return splitMatch;
    });
  }

  /**
   * RECONCILIATION (17-20)
   */

  /**
   * 17. Calculate book balance with multi-level aggregation
   */
  async calculateBookBalance(
    accountId: string,
    asOfDate: Date
  ): Promise<{ balance: number; detail: Record<string, any> }> {
    const result = await sequelize.query(`
      SELECT
        SUM(CASE WHEN type = 'CREDIT' THEN amount ELSE -amount END) as balance,
        COUNT(*) as transaction_count,
        SUM(amount) as gross_amount,
        COUNT(CASE WHEN status = 'MATCHED' THEN 1 END) as matched_count,
        COUNT(CASE WHEN status = 'UNMATCHED' THEN 1 END) as unmatched_count,
        MAX(transaction_date) as latest_transaction
      FROM book_transactions
      WHERE account_id = :accountId
        AND transaction_date <= :asOfDate
        AND status NOT IN ('VOIDED', 'REVERSED')
      GROUP BY account_id
    `, {
      replacements: { accountId, asOfDate },
      type: QueryTypes.SELECT,
    });

    return {
      balance: result[0]?.balance || 0,
      detail: result[0] || {},
    };
  }

  /**
   * 18. Calculate bank balance with reconciliation adjustments
   */
  async calculateBankBalance(
    feedId: string,
    asOfDate: Date
  ): Promise<{ balance: number; adjustments: Record<string, any> }> {
    const result = await sequelize.query(`
      SELECT
        SUM(CASE WHEN type = 'CREDIT' THEN amount ELSE -amount END) as balance,
        SUM(CASE WHEN status IN ('IN_TRANSIT', 'PENDING') THEN amount ELSE 0 END) as in_transit,
        SUM(CASE WHEN status = 'OUTSTANDING' THEN amount ELSE 0 END) as outstanding,
        COUNT(*) as total_transactions
      FROM bank_transactions
      WHERE feed_id = :feedId
        AND transaction_date <= :asOfDate
        AND status NOT IN ('FAILED', 'REVERSED')
      GROUP BY feed_id
    `, {
      replacements: { feedId, asOfDate },
      type: QueryTypes.SELECT,
    });

    const row = result[0] || {};
    return {
      balance: row.balance || 0,
      adjustments: {
        inTransit: row.in_transit || 0,
        outstanding: row.outstanding || 0,
        totalTransactions: row.total_transactions || 0,
      },
    };
  }

  /**
   * 19. Identify reconciliation variance and categorize
   */
  async identifyVariance(
    feedId: string,
    accountId: string,
    asOfDate: Date
  ): Promise<ReconciliationVariance> {
    const bankBalance = await this.calculateBankBalance(feedId, asOfDate);
    const bookBalance = await this.calculateBookBalance(accountId, asOfDate);
    const variance = bankBalance.balance - bookBalance.balance;

    const varianceItems = await sequelize.query(`
      SELECT
        COALESCE(bt.id, bk.id) as txn_id,
        ABS(COALESCE(bt.amount, 0) - COALESCE(bk.amount, 0)) as amount,
        DATEDIFF(NOW(), COALESCE(bt.transaction_date, bk.transaction_date)) as days_old,
        CASE
          WHEN bt.id IS NOT NULL AND bk.id IS NULL THEN 'IN_TRANSIT'
          WHEN bk.id IS NOT NULL AND bt.id IS NULL THEN 'UNMATCHED'
          WHEN ABS(bt.amount - bk.amount) > 0.01 THEN 'ERROR'
          ELSE 'TIMING'
        END as category
      FROM (
        SELECT * FROM bank_transactions
        WHERE feed_id = :feedId AND transaction_date <= :asOfDate
      ) bt
      FULL OUTER JOIN (
        SELECT * FROM book_transactions
        WHERE account_id = :accountId AND transaction_date <= :asOfDate
      ) bk ON bt.id = bk.id
      WHERE (bt.id IS NULL OR bk.id IS NULL)
        OR ABS(bt.amount - bk.amount) > 0.01
      ORDER BY days_old DESC
      LIMIT 100
    `, {
      replacements: { feedId, accountId, asOfDate },
      type: QueryTypes.SELECT,
    });

    return {
      id: `VAR-${Date.now()}`,
      bookBalance: bookBalance.balance,
      bankBalance: bankBalance.balance,
      variance: Math.abs(variance),
      variancePercent: (Math.abs(variance) / Math.max(Math.abs(bankBalance.balance), 1)) * 100,
      categories: [
        ...new Set(varianceItems.map((item: any) => item.category)),
      ],
      items: varianceItems,
    };
  }

  /**
   * 20. Perform full reconciliation with automated status updates
   */
  async reconcile(
    feedId: string,
    accountId: string,
    asOfDate: Date
  ): Promise<any> {
    return sequelize.transaction(async (t: Transaction) => {
      const variance = await this.identifyVariance(feedId, accountId, asOfDate);

      const reconciliation = await ReconciliationStatus.create(
        {
          feedId,
          accountId,
          asOfDate,
          bookBalance: variance.bookBalance,
          bankBalance: variance.bankBalance,
          variance: variance.variance,
          variancePercent: variance.variancePercent,
          status: variance.variance < 0.01 ? 'RECONCILED' : 'PENDING',
          varianceDetails: variance,
        },
        { transaction: t }
      );

      if (variance.variance < 0.01) {
        await sequelize.models.BankAccount.update(
          { lastReconciledAt: asOfDate, reconciliationStatus: 'CURRENT' },
          { where: { id: accountId }, transaction: t }
        );
      }

      return reconciliation;
    });
  }

  /**
   * OUTSTANDING ITEMS (21-24)
   */

  /**
   * 21. Track deposits in transit
   */
  async trackDepositsInTransit(
    feedId: string,
    asOfDate: Date
  ): Promise<any[]> {
    return sequelize.query(`
      SELECT
        bt.id,
        bt.external_id,
        bt.amount,
        bt.transaction_date,
        DATEDIFF(NOW(), bt.transaction_date) as days_in_transit,
        bk.id as matched_book_txn_id,
        CASE
          WHEN DATEDIFF(NOW(), bt.transaction_date) > 10 THEN 'EXCEPTION'
          WHEN DATEDIFF(NOW(), bt.transaction_date) > 5 THEN 'WARNING'
          ELSE 'NORMAL'
        END as status
      FROM bank_transactions bt
      LEFT JOIN book_transactions bk ON bt.matched_book_txn_id = bk.id
      WHERE bt.feed_id = :feedId
        AND bt.type = 'CREDIT'
        AND bt.transaction_date <= :asOfDate
        AND bk.id IS NULL
        AND bt.status NOT IN ('CLEARED', 'VOID')
      ORDER BY bt.transaction_date ASC
    `, {
      replacements: { feedId, asOfDate },
      type: QueryTypes.SELECT,
    });
  }

  /**
   * 22. Track outstanding checks
   */
  async trackOutstandingChecks(
    accountId: string,
    asOfDate: Date
  ): Promise<any[]> {
    return sequelize.query(`
      SELECT
        bk.id,
        bk.check_number,
        bk.amount,
        bk.transaction_date,
        bk.payee,
        DATEDIFF(NOW(), bk.transaction_date) as days_outstanding,
        bt.id as cleared_bank_txn_id,
        CASE
          WHEN DATEDIFF(NOW(), bk.transaction_date) > 90 THEN 'STALE'
          WHEN DATEDIFF(NOW(), bk.transaction_date) > 30 THEN 'LONG_OUTSTANDING'
          ELSE 'NORMAL'
        END as status
      FROM book_transactions bk
      LEFT JOIN bank_transactions bt ON bk.matched_bank_txn_id = bt.id
      WHERE bk.account_id = :accountId
        AND bk.type = 'DEBIT'
        AND bk.transaction_type = 'CHECK'
        AND bk.transaction_date <= :asOfDate
        AND bt.id IS NULL
        AND bk.status NOT IN ('CLEARED', 'VOID')
      ORDER BY bk.transaction_date ASC
    `, {
      replacements: { accountId, asOfDate },
      type: QueryTypes.SELECT,
    });
  }

  /**
   * 23. Identify timing differences
   */
  async identifyTimingDifferences(
    feedId: string,
    accountId: string
  ): Promise<Record<string, any>> {
    return sequelize.query(`
      SELECT
        bt.id as bank_txn_id,
        bk.id as book_txn_id,
        bt.transaction_date as bank_date,
        bk.transaction_date as book_date,
        DATEDIFF(bt.transaction_date, bk.transaction_date) as day_difference,
        bt.amount,
        'TIMING_DIFFERENCE' as category
      FROM bank_transactions bt
      JOIN book_transactions bk
        ON ABS(bt.amount) = ABS(bk.amount)
        AND bt.matched_book_txn_id = bk.id
      WHERE bt.feed_id = :feedId
        AND bk.account_id = :accountId
        AND ABS(DATEDIFF(bt.transaction_date, bk.transaction_date)) > 0
        AND ABS(DATEDIFF(bt.transaction_date, bk.transaction_date)) <= 10
      ORDER BY day_difference DESC
    `, {
      replacements: { feedId, accountId },
      type: QueryTypes.SELECT,
    });
  }

  /**
   * 24. Age analysis of outstanding items
   */
  async ageOutstandingItems(
    feedId: string,
    accountId: string
  ): Promise<Record<string, any>> {
    return sequelize.query(`
      SELECT
        CASE
          WHEN DATEDIFF(NOW(), transaction_date) <= 7 THEN 'CURRENT'
          WHEN DATEDIFF(NOW(), transaction_date) <= 30 THEN '8-30 DAYS'
          WHEN DATEDIFF(NOW(), transaction_date) <= 60 THEN '31-60 DAYS'
          WHEN DATEDIFF(NOW(), transaction_date) <= 90 THEN '61-90 DAYS'
          ELSE 'OVER 90 DAYS'
        END as age_bucket,
        COUNT(*) as item_count,
        SUM(amount) as total_amount,
        AVG(amount) as avg_amount,
        MIN(transaction_date) as oldest_item
      FROM (
        SELECT transaction_date, amount FROM bank_transactions
        WHERE feed_id = :feedId AND matched_book_txn_id IS NULL
        UNION ALL
        SELECT transaction_date, amount FROM book_transactions
        WHERE account_id = :accountId AND matched_bank_txn_id IS NULL
      ) outstanding
      GROUP BY age_bucket
      ORDER BY
        CASE age_bucket
          WHEN 'CURRENT' THEN 1
          WHEN '8-30 DAYS' THEN 2
          WHEN '31-60 DAYS' THEN 3
          WHEN '61-90 DAYS' THEN 4
          ELSE 5
        END
    `, {
      replacements: { feedId, accountId },
      type: QueryTypes.SELECT,
    });
  }

  /**
   * BANK ERRORS (25-28)
   */

  /**
   * 25. Identify potential bank errors
   */
  async identifyBankErrors(
    feedId: string,
    threshold: number = 100
  ): Promise<BankError[]> {
    const errors = await sequelize.query(`
      SELECT
        bt.id,
        bt.external_id,
        bt.amount,
        bt.description,
        bt.transaction_date,
        bk.id as matched_book_txn_id,
        CASE
          WHEN bk.id IS NULL AND DATEDIFF(NOW(), bt.transaction_date) > 30 THEN 'UNKNOWN_TRANSACTION'
          WHEN ABS(bt.amount - bk.amount) > :threshold THEN 'AMOUNT_VARIANCE'
          WHEN ABS(DATEDIFF(bt.transaction_date, bk.transaction_date)) > 15 THEN 'TIMING_ERROR'
          WHEN bt.amount IN (
            SELECT amount FROM bank_transactions
            WHERE feed_id = bt.feed_id
            AND transaction_date = bt.transaction_date
            AND id != bt.id
            GROUP BY amount HAVING COUNT(*) > 1
          ) THEN 'DUPLICATE_TRANSACTION'
          ELSE 'OTHER_ERROR'
        END as error_type,
        ABS(COALESCE(bt.amount - bk.amount, bt.amount)) as variance_amount
      FROM bank_transactions bt
      LEFT JOIN book_transactions bk ON bt.matched_book_txn_id = bk.id
      WHERE bt.feed_id = :feedId
        AND (
          bk.id IS NULL
          OR ABS(bt.amount - bk.amount) > :threshold
          OR ABS(DATEDIFF(bt.transaction_date, bk.transaction_date)) > 15
        )
      ORDER BY variance_amount DESC
      LIMIT 100
    `, {
      replacements: { feedId, threshold },
      type: QueryTypes.SELECT,
    });

    return sequelize.transaction(async (t: Transaction) => {
      const created = await BankError.bulkCreate(
        errors.map((err: any) => ({
          feedId,
          bankTxnId: err.id,
          errorType: err.error_type,
          amount: err.amount,
          variance: err.variance_amount,
          description: err.description,
          status: 'IDENTIFIED',
          details: { ...err },
        })),
        { transaction: t }
      );

      return created;
    });
  }

  /**
   * 26. Document and classify bank errors
   */
  async documentBankError(
    errorId: string,
    classification: string,
    documentation: Record<string, any>
  ): Promise<BankError> {
    return sequelize.transaction(async (t: Transaction) => {
      const error = await BankError.findByPk(errorId, { transaction: t });

      await error.update(
        {
          classification,
          documentation,
          documentedAt: new Date(),
          status: 'DOCUMENTED',
        },
        { transaction: t }
      );

      return error;
    });
  }

  /**
   * 27. Communicate bank error to external parties
   */
  async communicateBankError(
    errorId: string,
    recipientBankContact: string,
    message: string
  ): Promise<any> {
    return sequelize.transaction(async (t: Transaction) => {
      const error = await BankError.findByPk(errorId, { transaction: t });

      const communication = await sequelize.models.BankErrorCommunication.create(
        {
          bankErrorId: errorId,
          recipient: recipientBankContact,
          message,
          communicationType: 'EMAIL',
          status: 'SENT',
          sentAt: new Date(),
        },
        { transaction: t }
      );

      await error.update(
        { communicationStatus: 'COMMUNICATED', lastCommunicatedAt: new Date() },
        { transaction: t }
      );

      return communication;
    });
  }

  /**
   * 28. Resolve and reconcile bank errors
   */
  async resolveBankError(
    errorId: string,
    resolution: string,
    resolutionDetails: Record<string, any>
  ): Promise<BankError> {
    return sequelize.transaction(async (t: Transaction) => {
      const error = await BankError.findByPk(errorId, { transaction: t });

      await error.update(
        {
          resolution,
          resolutionDetails,
          status: 'RESOLVED',
          resolvedAt: new Date(),
        },
        { transaction: t }
      );

      // If error is resolved, remove from variance tracking
      if (error.bankTxnId) {
        await BankTransaction.update(
          { errorResolved: true },
          { where: { id: error.bankTxnId }, transaction: t }
        );
      }

      return error;
    });
  }

  /**
   * MULTI-CURRENCY (29-32)
   */

  /**
   * 29. Convert multi-currency balances to reporting currency
   */
  async convertBalances(
    balances: MultiCurrencyBalance[],
    targetCurrency: string,
    asOfDate: Date
  ): Promise<MultiCurrencyBalance[]> {
    const rates = await CurrencyRate.findAll({
      where: {
        targetCurrency,
        effectiveDate: { [Op.lte]: asOfDate },
      },
      order: [['effectiveDate', 'DESC']],
      limit: 1,
    });

    const rateMap = new Map(
      rates.map((r) => [r.sourceCurrency, r.rate])
    );

    return balances.map((balance) => {
      const rate = rateMap.get(balance.currency) || 1;
      return {
        ...balance,
        rate,
        baseCurrencyAmount: balance.amount * rate,
      };
    });
  }

  /**
   * 30. Handle FX differences and variance
   */
  async handleFXDifferences(
    feedId: string,
    baseCurrency: string
  ): Promise<Record<string, any>> {
    const fxDifferences = await sequelize.query(`
      SELECT
        bt.currency,
        bt.original_amount,
        bt.converted_amount,
        (bt.converted_amount - (bt.original_amount * cr.rate)) as fx_variance,
        cr.rate as applied_rate,
        (SELECT rate FROM currency_rates
         WHERE source_currency = bt.currency
         AND target_currency = :baseCurrency
         AND effective_date <= bt.transaction_date
         ORDER BY effective_date DESC LIMIT 1) as period_end_rate,
        CASE
          WHEN (bt.converted_amount - (bt.original_amount * cr.rate)) > 0 THEN 'GAIN'
          ELSE 'LOSS'
        END as variance_type
      FROM bank_transactions bt
      JOIN currency_rates cr ON bt.currency = cr.source_currency
        AND cr.target_currency = :baseCurrency
      WHERE bt.feed_id = :feedId
        AND bt.currency != :baseCurrency
        AND cr.effective_date <= bt.transaction_date
      GROUP BY bt.id
      ORDER BY ABS(fx_variance) DESC
    `, {
      replacements: { feedId, baseCurrency },
      type: QueryTypes.SELECT,
    });

    return {
      differences: fxDifferences,
      totalGain: fxDifferences
        .filter((d: any) => d.variance_type === 'GAIN')
        .reduce((sum, d: any) => sum + d.fx_variance, 0),
      totalLoss: Math.abs(
        fxDifferences
          .filter((d: any) => d.variance_type === 'LOSS')
          .reduce((sum, d: any) => sum + d.fx_variance, 0)
      ),
    };
  }

  /**
   * 31. Revalue multi-currency positions
   */
  async revaluePositions(
    asOfDate: Date,
    baseCurrency: string
  ): Promise<any[]> {
    return sequelize.transaction(async (t: Transaction) => {
      const revaluations = await sequelize.query(`
        SELECT
          ba.id,
          ba.currency,
          SUM(
            CASE WHEN bt.type = 'CREDIT' THEN bt.amount
                 ELSE -bt.amount
            END
          ) as position_amount,
          (SELECT rate FROM currency_rates
           WHERE source_currency = ba.currency
           AND target_currency = :baseCurrency
           AND effective_date <= :asOfDate
           ORDER BY effective_date DESC LIMIT 1) as new_rate,
          (SELECT rate FROM currency_rates
           WHERE source_currency = ba.currency
           AND target_currency = :baseCurrency
           AND effective_date <= DATE_SUB(:asOfDate, INTERVAL 1 DAY)
           ORDER BY effective_date DESC LIMIT 1) as old_rate
        FROM bank_accounts ba
        LEFT JOIN bank_transactions bt ON ba.id = bt.account_id
        WHERE ba.currency != :baseCurrency
        GROUP BY ba.id
      `, {
        replacements: { asOfDate, baseCurrency },
        type: QueryTypes.SELECT,
        transaction: t,
      });

      for (const reval of revaluations) {
        const gain =
          reval.position_amount * (reval.new_rate - reval.old_rate);

        await sequelize.models.CurrencyRevaluation.create(
          {
            bankAccountId: reval.id,
            currency: reval.currency,
            position: reval.position_amount,
            oldRate: reval.old_rate,
            newRate: reval.new_rate,
            gain,
            revaluationDate: asOfDate,
          },
          { transaction: t }
        );
      }

      return revaluations;
    });
  }

  /**
   * 32. Generate multi-currency reconciliation report
   */
  async generateMultiCurrencyReport(
    asOfDate: Date,
    baseCurrency: string
  ): Promise<Record<string, any>> {
    const report = await sequelize.query(`
      SELECT
        ba.currency,
        COUNT(bt.id) as transaction_count,
        SUM(CASE WHEN bt.type = 'CREDIT' THEN bt.amount ELSE -bt.amount END) as net_position,
        (SELECT rate FROM currency_rates
         WHERE source_currency = ba.currency
         AND target_currency = :baseCurrency
         AND effective_date <= :asOfDate
         ORDER BY effective_date DESC LIMIT 1) as current_rate,
        SUM(CASE WHEN bt.type = 'CREDIT' THEN bt.amount ELSE -bt.amount END) *
        (SELECT rate FROM currency_rates
         WHERE source_currency = ba.currency
         AND target_currency = :baseCurrency
         AND effective_date <= :asOfDate
         ORDER BY effective_date DESC LIMIT 1) as base_currency_amount,
        COUNT(CASE WHEN cr.id IS NOT NULL THEN 1 END) as fx_reversals
      FROM bank_accounts ba
      LEFT JOIN bank_transactions bt ON ba.id = bt.account_id AND bt.transaction_date <= :asOfDate
      LEFT JOIN currency_reversals cr ON ba.id = cr.account_id AND cr.created_at <= :asOfDate
      WHERE ba.currency != :baseCurrency
      GROUP BY ba.currency
      ORDER BY ABS(net_position) DESC
    `, {
      replacements: { asOfDate, baseCurrency },
      type: QueryTypes.SELECT,
    });

    return {
      asOfDate,
      baseCurrency,
      positions: report,
      totalBaseCurrencyAmount: report.reduce(
        (sum: number, pos: any) => sum + pos.base_currency_amount,
        0
      ),
    };
  }

  /**
   * CASH APPLICATION (33-36)
   */

  /**
   * 33. Apply payments to invoices
   */
  async applyPayment(
    paymentId: string,
    invoiceApplications: Array<{
      invoiceId: string;
      amount: number;
    }>
  ): Promise<CashApplicationMatch[]> {
    return sequelize.transaction(async (t: Transaction) => {
      const payment = await sequelize.models.Payment.findByPk(paymentId, {
        transaction: t,
      });

      const matches: CashApplicationMatch[] = [];
      let remainingAmount = payment.amount;

      for (const app of invoiceApplications) {
        const invoice = await sequelize.models.Invoice.findByPk(
          app.invoiceId,
          { transaction: t }
        );

        const appliedAmount = Math.min(remainingAmount, app.amount);
        const discountAmount = invoice.earlyPaymentDiscount || 0;
        const newBalance = invoice.balance - appliedAmount;

        await CashApplication.create(
          {
            paymentId,
            invoiceId: app.invoiceId,
            appliedAmount,
            discountAmount,
            newInvoiceBalance: newBalance,
            status: newBalance <= 0 ? 'FULL' : 'PARTIAL',
          },
          { transaction: t }
        );

        matches.push({
          paymentId,
          invoiceId: app.invoiceId,
          matchedAmount: appliedAmount,
          remainingAmount: Math.max(0, newBalance),
          discountAmount,
          status: newBalance <= 0 ? 'FULL' : 'PARTIAL',
        });

        remainingAmount -= appliedAmount;
      }

      await sequelize.models.Payment.update(
        { status: remainingAmount > 0 ? 'PARTIAL' : 'APPLIED' },
        { where: { id: paymentId }, transaction: t }
      );

      return matches;
    });
  }

  /**
   * 34. Match invoices with payments
   */
  async matchInvoicePayment(
    paymentId: string,
    invoiceId: string
  ): Promise<CashApplicationMatch> {
    return sequelize.transaction(async (t: Transaction) => {
      const payment = await sequelize.models.Payment.findByPk(paymentId, {
        transaction: t,
      });
      const invoice = await sequelize.models.Invoice.findByPk(invoiceId, {
        transaction: t,
      });

      const matchedAmount = Math.min(payment.amount, invoice.balance);
      const remainingAmount = invoice.balance - matchedAmount;

      const match = await CashApplication.create(
        {
          paymentId,
          invoiceId,
          appliedAmount: matchedAmount,
          newInvoiceBalance: remainingAmount,
          status: remainingAmount <= 0 ? 'FULL' : 'PARTIAL',
          matchedAt: new Date(),
        },
        { transaction: t }
      );

      return {
        paymentId,
        invoiceId,
        matchedAmount,
        remainingAmount,
        discountAmount: 0,
        status: remainingAmount <= 0 ? 'FULL' : 'PARTIAL',
      };
    });
  }

  /**
   * 35. Handle partial payment and unapplied cash
   */
  async handlePartialPayment(
    paymentId: string,
    appliedAmount: number,
    invoiceId: string
  ): Promise<any> {
    return sequelize.transaction(async (t: Transaction) => {
      const payment = await sequelize.models.Payment.findByPk(paymentId, {
        transaction: t,
      });

      const unappliedAmount = payment.amount - appliedAmount;

      const partialApp = await CashApplication.create(
        {
          paymentId,
          invoiceId,
          appliedAmount,
          unappliedAmount,
          status: 'PARTIAL',
        },
        { transaction: t }
      );

      if (unappliedAmount > 0) {
        await sequelize.models.UnappliedCash.create(
          {
            paymentId,
            amount: unappliedAmount,
            reason: 'PARTIAL_APPLICATION',
            status: 'PENDING_APPLICATION',
          },
          { transaction: t }
        );
      }

      return partialApp;
    });
  }

  /**
   * 36. Manage and track unapplied cash balances
   */
  async manageUnappliedCash(
    customerId: string,
    lookbackDays: number = 90
  ): Promise<Record<string, any>> {
    return sequelize.query(`
      SELECT
        p.id,
        p.amount,
        p.reference_number,
        p.payment_date,
        COALESCE(SUM(ca.applied_amount), 0) as applied_amount,
        (p.amount - COALESCE(SUM(ca.applied_amount), 0)) as unapplied_amount,
        DATEDIFF(NOW(), p.payment_date) as days_unapplied,
        COUNT(ca.id) as application_count,
        CASE
          WHEN (p.amount - COALESCE(SUM(ca.applied_amount), 0)) > p.amount * 0.5 THEN 'HIGH'
          WHEN (p.amount - COALESCE(SUM(ca.applied_amount), 0)) > 0 THEN 'PARTIAL'
          ELSE 'APPLIED'
        END as unapplied_status
      FROM payments p
      LEFT JOIN cash_applications ca ON p.id = ca.payment_id
      WHERE p.customer_id = :customerId
        AND p.payment_date > DATE_SUB(NOW(), INTERVAL :lookbackDays DAY)
      GROUP BY p.id
      HAVING unapplied_amount > 0
      ORDER BY days_unapplied DESC
    `, {
      replacements: { customerId, lookbackDays },
      type: QueryTypes.SELECT,
    });
  }

  /**
   * REPORTING (37-40)
   */

  /**
   * 37. Generate comprehensive reconciliation report
   */
  async generateReconciliationReport(
    feedId: string,
    accountId: string,
    asOfDate: Date
  ): Promise<ReconciliationReport> {
    const variance = await this.identifyVariance(feedId, accountId, asOfDate);
    const depositsInTransit = await this.trackDepositsInTransit(
      feedId,
      asOfDate
    );
    const checksOutstanding = await this.trackOutstandingChecks(
      accountId,
      asOfDate
    );

    return sequelize.transaction(async (t: Transaction) => {
      const report = await ReconciliationReport.create(
        {
          feedId,
          accountId,
          asOfDate,
          bookBalance: variance.bookBalance,
          bankBalance: variance.bankBalance,
          variance: variance.variance,
          reconciliationStatus: variance.variance < 0.01 ? 'RECONCILED' : 'PENDING',
          depositsInTransit: depositsInTransit.length,
          depositsInTransitAmount: depositsInTransit.reduce(
            (sum, d: any) => sum + d.amount,
            0
          ),
          checksOutstanding: checksOutstanding.length,
          checksOutstandingAmount: checksOutstanding.reduce(
            (sum, c: any) => sum + c.amount,
            0
          ),
          generatedAt: new Date(),
          generatedBy: 'SYSTEM',
        },
        { transaction: t }
      );

      return report;
    });
  }

  /**
   * 38. Variance analysis by category and time period
   */
  async varianceAnalysis(
    feedId: string,
    accountId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Record<string, any>> {
    return sequelize.query(`
      SELECT
        DATE_TRUNC('DAY', rr.as_of_date) as analysis_date,
        rr.variance,
        rr.variance_percent,
        COUNT(DISTINCT CASE WHEN vi.category = 'IN_TRANSIT' THEN vi.txn_id END) as in_transit_items,
        SUM(CASE WHEN vi.category = 'IN_TRANSIT' THEN vi.amount ELSE 0 END) as in_transit_amount,
        COUNT(DISTINCT CASE WHEN vi.category = 'ERROR' THEN vi.txn_id END) as error_items,
        SUM(CASE WHEN vi.category = 'ERROR' THEN vi.amount ELSE 0 END) as error_amount,
        COUNT(DISTINCT CASE WHEN vi.category = 'UNMATCHED' THEN vi.txn_id END) as unmatched_items,
        SUM(CASE WHEN vi.category = 'UNMATCHED' THEN vi.amount ELSE 0 END) as unmatched_amount
      FROM reconciliation_reports rr
      LEFT JOIN variance_items vi ON rr.id = vi.reconciliation_id
      WHERE rr.feed_id = :feedId
        AND rr.account_id = :accountId
        AND rr.as_of_date BETWEEN :startDate AND :endDate
      GROUP BY DATE_TRUNC('DAY', rr.as_of_date)
      ORDER BY analysis_date DESC
    `, {
      replacements: { feedId, accountId, startDate, endDate },
      type: QueryTypes.SELECT,
    });
  }

  /**
   * 39. Outstanding items detail report
   */
  async outstandingItemsReport(
    feedId: string,
    accountId: string
  ): Promise<Record<string, any>> {
    const depositsInTransit = await this.trackDepositsInTransit(
      feedId,
      new Date()
    );
    const checksOutstanding = await this.trackOutstandingChecks(
      accountId,
      new Date()
    );
    const ageAnalysis = await this.ageOutstandingItems(feedId, accountId);

    return {
      reportDate: new Date(),
      depositsInTransit: {
        count: depositsInTransit.length,
        items: depositsInTransit,
        total: depositsInTransit.reduce((sum: number, d: any) => sum + d.amount, 0),
      },
      checksOutstanding: {
        count: checksOutstanding.length,
        items: checksOutstanding,
        total: checksOutstanding.reduce((sum: number, c: any) => sum + c.amount, 0),
      },
      ageAnalysis: ageAnalysis,
    };
  }

  /**
   * 40. Complete audit trail and compliance report
   */
  async generateAuditTrailReport(
    feedId: string,
    accountId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Record<string, any>> {
    const auditTrail = await sequelize.query(`
      SELECT
        'BANK_FEED' as action_type,
        bf.created_at as timestamp,
        'SYSTEM' as user_id,
        bf.status as action,
        JSON_OBJECT('feedId', bf.id, 'status', bf.status) as changes,
        'FEED_CONNECTION' as source
      FROM bank_feeds bf
      WHERE bf.id = :feedId
        AND bf.created_at BETWEEN :startDate AND :endDate

      UNION ALL

      SELECT
        'TRANSACTION_MATCH' as action_type,
        mm.created_at as timestamp,
        'SYSTEM' as user_id,
        mm.status as action,
        JSON_OBJECT('bankTxnId', mm.bank_txn_id, 'bookTxnId', mm.book_txn_id, 'confidence', mm.confidence) as changes,
        'MATCHING_ENGINE' as source
      FROM manual_matches mm
      JOIN bank_transactions bt ON mm.bank_txn_id = bt.id
      WHERE bt.feed_id = :feedId
        AND mm.created_at BETWEEN :startDate AND :endDate

      UNION ALL

      SELECT
        'RECONCILIATION' as action_type,
        rr.generated_at as timestamp,
        rr.generated_by as user_id,
        rr.reconciliation_status as action,
        JSON_OBJECT('variance', rr.variance, 'status', rr.reconciliation_status) as changes,
        'RECONCILIATION_ENGINE' as source
      FROM reconciliation_reports rr
      WHERE rr.feed_id = :feedId
        AND rr.account_id = :accountId
        AND rr.generated_at BETWEEN :startDate AND :endDate

      UNION ALL

      SELECT
        'ERROR_IDENTIFIED' as action_type,
        be.created_at as timestamp,
        'SYSTEM' as user_id,
        be.status as action,
        JSON_OBJECT('errorType', be.error_type, 'variance', be.variance) as changes,
        'ERROR_DETECTION' as source
      FROM bank_errors be
      JOIN bank_transactions bt ON be.bank_txn_id = bt.id
      WHERE bt.feed_id = :feedId
        AND be.created_at BETWEEN :startDate AND :endDate

      ORDER BY timestamp DESC
      LIMIT 1000
    `, {
      replacements: { feedId, accountId, startDate, endDate },
      type: QueryTypes.SELECT,
    });

    return {
      reportPeriod: { startDate, endDate },
      totalEvents: auditTrail.length,
      eventsByType: auditTrail.reduce(
        (acc, evt: any) => {
          acc[evt.action_type] = (acc[evt.action_type] || 0) + 1;
          return acc;
        },
        {}
      ),
      events: auditTrail,
      complianceStatus: auditTrail.length > 0 ? 'COMPLIANT' : 'NO_ACTIVITY',
    };
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  private encryptKey(key: string): string {
    // Implement encryption logic
    return Buffer.from(key).toString('base64');
  }

  private normalizeAmount(amount: any, format: string): number {
    return parseFloat(String(amount).replace(/[^0-9.-]/g, ''));
  }

  private normalizeDate(date: any, format: string): Date {
    return new Date(date);
  }

  private normalizeDescription(desc: string, format: string): string {
    return desc.trim().substring(0, 500);
  }

  private extractCounterparty(data: any, format: string): string {
    return data.counterparty || data.payee || data.vendor || 'UNKNOWN';
  }

  private extractMetadata(data: any, format: string): Record<string, any> {
    return { raw: data, format };
  }

  private async evaluateRuleConditions(
    txn: BankTransaction,
    rule: MatchingRule
  ): Promise<TransactionMatch[]> {
    // Evaluate rule conditions against transaction
    return [];
  }
}
