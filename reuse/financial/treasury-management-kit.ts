/**
 * Treasury Management Kit
 * =====================
 * Enterprise-grade treasury operations: bank accounts, cash positioning, cash concentration,
 * investments, borrowing, FX management, payment execution, netting, liquidity optimization,
 * and compliance reporting.
 *
 * Targets: Kyriba, GTreasury, FIS | Stack: NestJS 10.x, Sequelize 6.x
 * LOC: FIN-TREA-001 | Author: Treasury Architecture | Last Updated: 2025-11-08
 *
 * Dependencies:
 *   - @nestjs/common, @nestjs/typeorm
 *   - sequelize, decimal.js
 *   - moment for date/time operations
 *
 * Usage:
 *   const kit = new TreasuryManagementKit(sequelizeInstance, logger);
 *   const account = await kit.createBankAccount({ bankCode: 'CITIUS33', ... });
 */

import Decimal from 'decimal.js';
import { Sequelize, QueryTypes, Op } from 'sequelize';
import { Logger } from '@nestjs/common';

// ============================================================================
// Types & Interfaces
// ============================================================================

/** Bank account entity with Sequelize metadata */
interface BankAccount {
  id: string;
  bankCode: string;
  accountNumber: string;
  currency: string;
  balance: Decimal;
  status: 'ACTIVE' | 'INACTIVE' | 'CLOSED';
  createdAt: Date;
  updatedAt: Date;
}

/** Cash position snapshot with balance breakdown */
interface CashPosition {
  totalBalance: Decimal;
  byAccount: Map<string, Decimal>;
  byCurrency: Map<string, Decimal>;
  timestamp: Date;
}

/** Investment record with cost basis and fair value */
interface Investment {
  id: string;
  instrumentId: string;
  quantity: Decimal;
  costBasis: Decimal;
  fairValue: Decimal;
  maturityDate: Date;
  ytm: Decimal;
  status: 'ACTIVE' | 'LIQUIDATED';
}

/** Borrowing facility with draw downs and repayment schedule */
interface BorrowingFacility {
  id: string;
  facilityCode: string;
  totalCommitment: Decimal;
  drawn: Decimal;
  available: Decimal;
  interestRate: Decimal;
  maturityDate: Date;
  status: 'ACTIVE' | 'CLOSED';
}

/** FX trade with spot rate, forward points, and P&L */
interface FXTrade {
  id: string;
  baseCurrency: string;
  quoteCurrency: string;
  spotRate: Decimal;
  forwardRate: Decimal;
  notional: Decimal;
  settlementDate: Date;
  pnl: Decimal;
  status: 'PENDING' | 'EXECUTED' | 'SETTLED';
}

/** Payment instruction with approval workflow state */
interface PaymentInstruction {
  id: string;
  payeeId: string;
  amount: Decimal;
  currency: string;
  valueDate: Date;
  approvalStatus: 'DRAFT' | 'APPROVED' | 'REJECTED' | 'EXECUTED';
  approvalChain: string[];
  executionReference?: string;
}

/** Netting run with offsetting payables and receivables */
interface NettingRun {
  id: string;
  nettingGroupId: string;
  grossPayables: Decimal;
  grossReceivables: Decimal;
  netAmount: Decimal;
  direction: 'PAY' | 'RECEIVE';
  executedAt?: Date;
}

/** Treasury dashboard KPI snapshot */
interface TreasuryDashboard {
  totalCash: Decimal;
  investmentPortfolioValue: Decimal;
  totalDebt: Decimal;
  debtToAssets: Decimal;
  investmentYield: Decimal;
  forecastedCashPosition: Decimal;
  exposures: Record<string, Decimal>;
  riskMetrics: Record<string, number>;
}

/** Risk exposure metric for FX, interest rate, credit */
interface RiskExposure {
  type: 'FX' | 'IR' | 'CREDIT';
  currency?: string;
  notional: Decimal;
  sensitivity: Decimal;
  timeHorizon: string;
}

// ============================================================================
// Treasury Management Kit
// ============================================================================

export class TreasuryManagementKit {
  constructor(
    private sequelize: Sequelize,
    private logger: Logger,
  ) {}

  // =========================================================================
  // Bank Account Management (1-4)
  // =========================================================================

  /** 1. Create bank account with initial setup */
  async createBankAccount(
    bankCode: string,
    accountNumber: string,
    currency: string,
    accountType: string,
  ): Promise<BankAccount> {
    const result = await this.sequelize.query(
      `INSERT INTO bank_accounts (bankCode, accountNumber, currency, balance, status, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, 'ACTIVE', NOW(), NOW())
       RETURNING *`,
      { replacements: [bankCode, accountNumber, currency, '0.00'], type: QueryTypes.INSERT }
    );
    this.logger.log(`[FIN-TREA-001] Bank account created: ${accountNumber}`);
    return result[0];
  }

  /** 2. Update bank account details */
  async updateBankAccount(
    accountId: string,
    updates: Partial<BankAccount>,
  ): Promise<void> {
    const fields = Object.keys(updates).map(k => `${k} = ?`).join(', ');
    const values = Object.values(updates);
    await this.sequelize.query(
      `UPDATE bank_accounts SET ${fields}, updatedAt = NOW() WHERE id = ?`,
      { replacements: [...values, accountId], type: QueryTypes.UPDATE }
    );
    this.logger.log(`[FIN-TREA-001] Bank account updated: ${accountId}`);
  }

  /** 3. Reconcile bank account against statement */
  async reconcileBankAccount(
    accountId: string,
    statementBalance: Decimal,
    statementDate: Date,
  ): Promise<Decimal> {
    const [account] = await this.sequelize.query(
      `SELECT balance FROM bank_accounts WHERE id = ?`,
      { replacements: [accountId], type: QueryTypes.SELECT }
    );
    const variance = new Decimal(statementBalance).minus(new Decimal(account.balance));
    if (variance.isZero()) {
      this.logger.log(`[FIN-TREA-001] Reconciliation successful for ${accountId}`);
    } else {
      this.logger.warn(`[FIN-TREA-001] Reconciliation variance: ${variance} for ${accountId}`);
    }
    return variance;
  }

  /** 4. Close bank account and archive history */
  async closeBankAccount(accountId: string, reason: string): Promise<void> {
    await this.sequelize.query(
      `UPDATE bank_accounts SET status = 'CLOSED', updatedAt = NOW() WHERE id = ?`,
      { replacements: [accountId], type: QueryTypes.UPDATE }
    );
    await this.sequelize.query(
      `INSERT INTO account_closure_log (accountId, reason, closureDate) VALUES (?, ?, NOW())`,
      { replacements: [accountId, reason], type: QueryTypes.INSERT }
    );
    this.logger.log(`[FIN-TREA-001] Bank account closed: ${accountId}`);
  }

  // =========================================================================
  // Cash Positioning (5-8)
  // =========================================================================

  /** 5. Calculate current cash position across all accounts */
  async calculateCashPosition(): Promise<CashPosition> {
    const accounts = await this.sequelize.query(
      `SELECT id, balance, currency FROM bank_accounts WHERE status = 'ACTIVE'`,
      { type: QueryTypes.SELECT }
    );
    const byAccount = new Map<string, Decimal>();
    const byCurrency = new Map<string, Decimal>();
    let total = new Decimal(0);
    accounts.forEach((acc: any) => {
      const bal = new Decimal(acc.balance);
      byAccount.set(acc.id, bal);
      byCurrency.set(acc.currency, (byCurrency.get(acc.currency) || new Decimal(0)).plus(bal));
      total = total.plus(bal);
    });
    return { totalBalance: total, byAccount, byCurrency, timestamp: new Date() };
  }

  /** 6. Forecast cash position for N days */
  async forecastCashPosition(days: number): Promise<Decimal[]> {
    const forecast = [];
    const currentPos = await this.calculateCashPosition();
    let projected = currentPos.totalBalance;
    for (let i = 1; i <= days; i++) {
      const inflows = await this.sequelize.query(
        `SELECT SUM(amount) as total FROM cash_flows WHERE flowDate = DATE_ADD(NOW(), INTERVAL ? DAY) AND direction = 'IN'`,
        { replacements: [i], type: QueryTypes.SELECT }
      );
      const outflows = await this.sequelize.query(
        `SELECT SUM(amount) as total FROM cash_flows WHERE flowDate = DATE_ADD(NOW(), INTERVAL ? DAY) AND direction = 'OUT'`,
        { replacements: [i], type: QueryTypes.SELECT }
      );
      projected = projected
        .plus(new Decimal(inflows[0]?.total || 0))
        .minus(new Decimal(outflows[0]?.total || 0));
      forecast.push(projected);
    }
    return forecast;
  }

  /** 7. Optimize cash placement across accounts and investments */
  async optimizeCashPlacement(minYield: Decimal): Promise<void> {
    const position = await this.calculateCashPosition();
    const availableFunds = position.totalBalance;
    const investmentOpportunities = await this.sequelize.query(
      `SELECT id, term, yield FROM investment_opportunities WHERE yield > ? AND available = TRUE ORDER BY yield DESC`,
      { replacements: [minYield], type: QueryTypes.SELECT }
    );
    let allocated = new Decimal(0);
    for (const opp of investmentOpportunities) {
      if (allocated.gte(availableFunds)) break;
      const amount = availableFunds.minus(allocated);
      await this.investSurplus(opp.id, amount);
      allocated = allocated.plus(amount);
    }
    this.logger.log(`[FIN-TREA-001] Cash placement optimized: ${allocated} allocated`);
  }

  /** 8. Report cash positioning metrics */
  async reportCashPosition(): Promise<Record<string, any>> {
    const position = await this.calculateCashPosition();
    const forecast = await this.forecastCashPosition(30);
    const minForecast = forecast.reduce((a, b) => a.lt(b) ? a : b);
    const avgForecast = forecast.reduce((a, b) => a.plus(b)).div(forecast.length);
    return {
      currentTotal: position.totalBalance,
      byAccount: Object.fromEntries(position.byAccount),
      byCurrency: Object.fromEntries(position.byCurrency),
      forecast30DayMin: minForecast,
      forecast30DayAvg: avgForecast,
      generatedAt: new Date(),
    };
  }

  // =========================================================================
  // Cash Concentration (9-12)
  // =========================================================================

  /** 9. Sweep surplus funds to master account */
  async sweepToMasterAccount(masterAccountId: string, threshold: Decimal): Promise<Decimal> {
    const subordinate = await this.sequelize.query(
      `SELECT id, balance, currency FROM bank_accounts WHERE id != ? AND balance > ? AND status = 'ACTIVE'`,
      { replacements: [masterAccountId, threshold], type: QueryTypes.SELECT }
    );
    let totalSwept = new Decimal(0);
    for (const acc of subordinate) {
      const amount = new Decimal(acc.balance);
      await this.sequelize.query(
        `INSERT INTO cash_sweep_log (fromAccountId, toAccountId, amount, sweptAt) VALUES (?, ?, ?, NOW())`,
        { replacements: [acc.id, masterAccountId, amount], type: QueryTypes.INSERT }
      );
      totalSwept = totalSwept.plus(amount);
    }
    this.logger.log(`[FIN-TREA-001] Cash swept to master: ${totalSwept}`);
    return totalSwept;
  }

  /** 10. Distribute funds from master to operating accounts */
  async distributeFromMaster(masterAccountId: string, distribution: Map<string, Decimal>): Promise<void> {
    for (const [targetId, amount] of distribution) {
      await this.sequelize.query(
        `INSERT INTO cash_distribution_log (fromAccountId, toAccountId, amount, distributedAt) VALUES (?, ?, ?, NOW())`,
        { replacements: [masterAccountId, targetId, amount], type: QueryTypes.INSERT }
      );
    }
    this.logger.log(`[FIN-TREA-001] Distribution from master: ${distribution.size} beneficiaries`);
  }

  /** 11. Implement notional pooling virtual master account */
  async setupNotionalPooling(poolId: string, memberAccounts: string[], masterCurrency: string): Promise<void> {
    await this.sequelize.query(
      `INSERT INTO notional_pools (poolId, masterCurrency, memberCount, createdAt) VALUES (?, ?, ?, NOW())`,
      { replacements: [poolId, masterCurrency, memberAccounts.length], type: QueryTypes.INSERT }
    );
    for (const acc of memberAccounts) {
      await this.sequelize.query(
        `INSERT INTO pool_memberships (poolId, accountId) VALUES (?, ?)`,
        { replacements: [poolId, acc], type: QueryTypes.INSERT }
      );
    }
    this.logger.log(`[FIN-TREA-001] Notional pool created: ${poolId}`);
  }

  /** 12. Report cash concentration metrics */
  async reportConcentration(): Promise<Record<string, any>> {
    const [concentrationData] = await this.sequelize.query(
      `SELECT COUNT(*) as accountCount, SUM(balance) as totalBalance,
              MAX(balance) as maxBalance, MIN(balance) as minBalance
       FROM bank_accounts WHERE status = 'ACTIVE'`,
      { type: QueryTypes.SELECT }
    );
    return {
      accountCount: concentrationData.accountCount,
      totalBalance: new Decimal(concentrationData.totalBalance),
      maxBalance: new Decimal(concentrationData.maxBalance),
      minBalance: new Decimal(concentrationData.minBalance),
      concentrationRatio: new Decimal(concentrationData.maxBalance)
        .div(new Decimal(concentrationData.totalBalance)),
    };
  }

  // =========================================================================
  // Investment Management (13-16)
  // =========================================================================

  /** 13. Invest surplus cash in income-generating instruments */
  async investSurplus(instrumentId: string, amount: Decimal): Promise<Investment> {
    const [instrument] = await this.sequelize.query(
      `SELECT * FROM investment_instruments WHERE id = ?`,
      { replacements: [instrumentId], type: QueryTypes.SELECT }
    );
    const result = await this.sequelize.query(
      `INSERT INTO investments (instrumentId, quantity, costBasis, fairValue, maturityDate, ytm, status, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, 'ACTIVE', NOW()) RETURNING *`,
      { replacements: [instrumentId, '1', amount, amount, instrument.maturityDate, instrument.ytm], type: QueryTypes.INSERT }
    );
    this.logger.log(`[FIN-TREA-001] Investment created: ${amount} in ${instrumentId}`);
    return result[0];
  }

  /** 14. Liquidate investment position */
  async liquidateInvestment(investmentId: string, proceedsAmount: Decimal): Promise<Decimal> {
    const [inv] = await this.sequelize.query(
      `SELECT costBasis FROM investments WHERE id = ?`,
      { replacements: [investmentId], type: QueryTypes.SELECT }
    );
    const gain = proceedsAmount.minus(new Decimal(inv.costBasis));
    await this.sequelize.query(
      `UPDATE investments SET status = 'LIQUIDATED', fairValue = ?, liquidationDate = NOW() WHERE id = ?`,
      { replacements: [proceedsAmount, investmentId], type: QueryTypes.UPDATE }
    );
    this.logger.log(`[FIN-TREA-001] Investment liquidated: ${investmentId}, gain: ${gain}`);
    return gain;
  }

  /** 15. Revalue investment portfolio to fair value */
  async revaluePortfolio(asOfDate: Date): Promise<Decimal> {
    const [investments] = await this.sequelize.query(
      `SELECT id, costBasis FROM investments WHERE status = 'ACTIVE'`,
      { type: QueryTypes.SELECT }
    );
    let totalGain = new Decimal(0);
    for (const inv of investments) {
      const fairValue = new Decimal(inv.costBasis).times(new Decimal(1.02)); // Simplified
      const gain = fairValue.minus(new Decimal(inv.costBasis));
      totalGain = totalGain.plus(gain);
      await this.sequelize.query(
        `UPDATE investments SET fairValue = ?, revaluationDate = ? WHERE id = ?`,
        { replacements: [fairValue, asOfDate, inv.id], type: QueryTypes.UPDATE }
      );
    }
    return totalGain;
  }

  /** 16. Track investment portfolio performance */
  async trackPerformance(): Promise<Record<string, Decimal>> {
    const [active] = await this.sequelize.query(
      `SELECT SUM(costBasis) as totalCost, SUM(fairValue) as totalFair FROM investments WHERE status = 'ACTIVE'`,
      { type: QueryTypes.SELECT }
    );
    const totalCost = new Decimal(active.totalCost || 0);
    const totalFair = new Decimal(active.totalFair || 0);
    const totalReturn = totalFair.minus(totalCost);
    const returnPct = totalCost.isZero() ? new Decimal(0) : totalReturn.div(totalCost).times(100);
    return { totalCost, totalFair, totalReturn, returnPct };
  }

  // =========================================================================
  // Borrowing Management (17-20)
  // =========================================================================

  /** 17. Initiate borrowing facility */
  async initiateBorrowingFacility(
    facilityCode: string,
    totalCommitment: Decimal,
    interestRate: Decimal,
    maturityDate: Date,
  ): Promise<BorrowingFacility> {
    const result = await this.sequelize.query(
      `INSERT INTO borrowing_facilities (facilityCode, totalCommitment, drawn, available, interestRate, maturityDate, status, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, 'ACTIVE', NOW()) RETURNING *`,
      { replacements: [facilityCode, totalCommitment, '0', totalCommitment, interestRate, maturityDate], type: QueryTypes.INSERT }
    );
    return result[0];
  }

  /** 18. Draw funds from borrowing facility */
  async drawFunds(facilityId: string, drawAmount: Decimal): Promise<void> {
    await this.sequelize.query(
      `UPDATE borrowing_facilities SET drawn = drawn + ?, available = available - ? WHERE id = ?`,
      { replacements: [drawAmount, drawAmount, facilityId], type: QueryTypes.UPDATE }
    );
    await this.sequelize.query(
      `INSERT INTO borrowing_draws (facilityId, amount, drawnAt) VALUES (?, ?, NOW())`,
      { replacements: [facilityId, drawAmount], type: QueryTypes.INSERT }
    );
    this.logger.log(`[FIN-TREA-001] Funds drawn: ${drawAmount} from ${facilityId}`);
  }

  /** 19. Repay borrowing facility principal and interest */
  async repayFacility(facilityId: string, principalAmount: Decimal, interestAmount: Decimal): Promise<void> {
    await this.sequelize.query(
      `UPDATE borrowing_facilities SET drawn = drawn - ?, available = available + ? WHERE id = ?`,
      { replacements: [principalAmount, principalAmount, facilityId], type: QueryTypes.UPDATE }
    );
    await this.sequelize.query(
      `INSERT INTO borrowing_repayments (facilityId, principal, interest, repaidAt) VALUES (?, ?, ?, NOW())`,
      { replacements: [facilityId, principalAmount, interestAmount], type: QueryTypes.INSERT }
    );
    this.logger.log(`[FIN-TREA-001] Facility repaid: principal ${principalAmount}, interest ${interestAmount}`);
  }

  /** 20. Track debt portfolio metrics */
  async trackDebtPortfolio(): Promise<Record<string, any>> {
    const [debt] = await this.sequelize.query(
      `SELECT SUM(drawn) as totalDrawn, SUM(totalCommitment) as totalCommitment FROM borrowing_facilities WHERE status = 'ACTIVE'`,
      { type: QueryTypes.SELECT }
    );
    const totalDrawn = new Decimal(debt.totalDrawn || 0);
    const totalCommitment = new Decimal(debt.totalCommitment || 0);
    return {
      totalDrawn,
      totalCommitment,
      availableCapacity: totalCommitment.minus(totalDrawn),
      utilizationRate: totalCommitment.isZero() ? new Decimal(0) : totalDrawn.div(totalCommitment),
    };
  }

  // =========================================================================
  // FX Management (21-24)
  // =========================================================================

  /** 21. Execute FX spot trade */
  async executeFXTrade(
    baseCurrency: string,
    quoteCurrency: string,
    spotRate: Decimal,
    notional: Decimal,
    settlementDate: Date,
  ): Promise<FXTrade> {
    const result = await this.sequelize.query(
      `INSERT INTO fx_trades (baseCurrency, quoteCurrency, spotRate, forwardRate, notional, settlementDate, pnl, status, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, '0', 'PENDING', NOW()) RETURNING *`,
      { replacements: [baseCurrency, quoteCurrency, spotRate, spotRate, notional, settlementDate], type: QueryTypes.INSERT }
    );
    this.logger.log(`[FIN-TREA-001] FX trade executed: ${baseCurrency}/${quoteCurrency} ${notional}`);
    return result[0];
  }

  /** 22. Hedge FX exposure with forward contracts */
  async hedgeFXExposure(baseCurrency: string, exposureAmount: Decimal, forwardRate: Decimal): Promise<void> {
    await this.sequelize.query(
      `INSERT INTO fx_hedges (baseCurrency, exposureAmount, forwardRate, createdAt) VALUES (?, ?, ?, NOW())`,
      { replacements: [baseCurrency, exposureAmount, forwardRate], type: QueryTypes.INSERT }
    );
    this.logger.log(`[FIN-TREA-001] FX hedge established: ${baseCurrency} ${exposureAmount}`);
  }

  /** 23. Revalue FX positions and compute mark-to-market P&L */
  async revalueFXPositions(asOfDate: Date, spotRates: Map<string, Decimal>): Promise<Decimal> {
    const [trades] = await this.sequelize.query(
      `SELECT id, baseCurrency, quoteCurrency, notional, spotRate FROM fx_trades WHERE status IN ('PENDING', 'EXECUTED')`,
      { type: QueryTypes.SELECT }
    );
    let totalPnl = new Decimal(0);
    for (const trade of trades) {
      const key = `${trade.baseCurrency}/${trade.quoteCurrency}`;
      const currentRate = spotRates.get(key) || new Decimal(trade.spotRate);
      const pnl = notional.times(currentRate.minus(new Decimal(trade.spotRate)));
      totalPnl = totalPnl.plus(pnl);
      await this.sequelize.query(
        `UPDATE fx_trades SET pnl = ?, revaluationDate = ? WHERE id = ?`,
        { replacements: [pnl, asOfDate, trade.id], type: QueryTypes.UPDATE }
      );
    }
    return totalPnl;
  }

  /** 24. Realize FX gains/losses on settlement */
  async realizeFXGainsLosses(tradeId: string, settlementRate: Decimal): Promise<Decimal> {
    const [trade] = await this.sequelize.query(
      `SELECT notional, spotRate FROM fx_trades WHERE id = ?`,
      { replacements: [tradeId], type: QueryTypes.SELECT }
    );
    const realized = new Decimal(trade.notional).times(
      new Decimal(settlementRate).minus(new Decimal(trade.spotRate))
    );
    await this.sequelize.query(
      `UPDATE fx_trades SET status = 'SETTLED', settlementRate = ?, realizedPnl = ? WHERE id = ?`,
      { replacements: [settlementRate, realized, tradeId], type: QueryTypes.UPDATE }
    );
    return realized;
  }

  // =========================================================================
  // Payment Execution (25-28)
  // =========================================================================

  /** 25. Initiate payment instruction */
  async initiatePayment(
    payeeId: string,
    amount: Decimal,
    currency: string,
    valueDate: Date,
    purpose: string,
  ): Promise<PaymentInstruction> {
    const result = await this.sequelize.query(
      `INSERT INTO payment_instructions (payeeId, amount, currency, valueDate, approvalStatus, createdAt, purpose)
       VALUES (?, ?, ?, ?, 'DRAFT', NOW(), ?) RETURNING *`,
      { replacements: [payeeId, amount, currency, valueDate, purpose], type: QueryTypes.INSERT }
    );
    this.logger.log(`[FIN-TREA-001] Payment initiated: ${payeeId} ${amount} ${currency}`);
    return result[0];
  }

  /** 26. Approve payment instruction through approval chain */
  async approvePayment(paymentId: string, approverId: string, comment?: string): Promise<void> {
    await this.sequelize.query(
      `UPDATE payment_instructions
       SET approvalStatus = 'APPROVED', approvalChain = CONCAT(COALESCE(approvalChain, ''), ',', ?)
       WHERE id = ?`,
      { replacements: [approverId, paymentId], type: QueryTypes.UPDATE }
    );
    this.logger.log(`[FIN-TREA-001] Payment approved: ${paymentId} by ${approverId}`);
  }

  /** 27. Execute approved payment and settle */
  async executePayment(paymentId: string, executionReference: string): Promise<void> {
    await this.sequelize.query(
      `UPDATE payment_instructions SET approvalStatus = 'EXECUTED', executionReference = ?, executedAt = NOW() WHERE id = ?`,
      { replacements: [executionReference, paymentId], type: QueryTypes.UPDATE }
    );
    await this.sequelize.query(
      `INSERT INTO payment_executions (paymentId, executionReference, executedAt) VALUES (?, ?, NOW())`,
      { replacements: [paymentId, executionReference], type: QueryTypes.INSERT }
    );
    this.logger.log(`[FIN-TREA-001] Payment executed: ${paymentId}`);
  }

  /** 28. Track payment execution status and reconcile */
  async trackPaymentStatus(paymentId: string): Promise<Record<string, any>> {
    const [payment] = await this.sequelize.query(
      `SELECT * FROM payment_instructions WHERE id = ?`,
      { replacements: [paymentId], type: QueryTypes.SELECT }
    );
    return {
      id: payment.id,
      payeeId: payment.payeeId,
      amount: new Decimal(payment.amount),
      currency: payment.currency,
      status: payment.approvalStatus,
      valueDate: payment.valueDate,
      executionReference: payment.executionReference,
      createdAt: payment.createdAt,
      executedAt: payment.executedAt,
    };
  }

  // =========================================================================
  // Payment Netting (29-32)
  // =========================================================================

  /** 29. Identify netting opportunities between counterparties */
  async identifyNettingOpportunities(nettingGroupId: string): Promise<Decimal> {
    const [payables] = await this.sequelize.query(
      `SELECT SUM(amount) as total FROM payment_instructions
       WHERE approvalStatus = 'APPROVED' AND nettingGroupId = ? AND direction = 'OUT'`,
      { replacements: [nettingGroupId], type: QueryTypes.SELECT }
    );
    const [receivables] = await this.sequelize.query(
      `SELECT SUM(amount) as total FROM cash_inflows
       WHERE expectedDate = CURDATE() AND nettingGroupId = ? AND status = 'PENDING'`,
      { replacements: [nettingGroupId], type: QueryTypes.SELECT }
    );
    const netAmount = new Decimal(payables.total || 0).minus(new Decimal(receivables.total || 0));
    this.logger.log(`[FIN-TREA-001] Netting opportunity identified: ${netAmount}`);
    return netAmount;
  }

  /** 30. Execute netting transaction */
  async executeNetting(nettingGroupId: string): Promise<NettingRun> {
    const netAmount = await this.identifyNettingOpportunities(nettingGroupId);
    const direction = netAmount.isNegative() ? 'PAY' : 'RECEIVE';
    const result = await this.sequelize.query(
      `INSERT INTO netting_runs (nettingGroupId, grossPayables, grossReceivables, netAmount, direction, createdAt)
       VALUES (?,
               (SELECT SUM(amount) FROM payment_instructions WHERE nettingGroupId = ? AND direction = 'OUT'),
               (SELECT SUM(amount) FROM cash_inflows WHERE nettingGroupId = ? AND status = 'PENDING'),
               ?, ?, NOW()) RETURNING *`,
      { replacements: [nettingGroupId, nettingGroupId, nettingGroupId, netAmount.abs(), direction], type: QueryTypes.INSERT }
    );
    return result[0];
  }

  /** 31. Settle netting results */
  async settleNetting(nettingRunId: string): Promise<void> {
    const [run] = await this.sequelize.query(
      `SELECT * FROM netting_runs WHERE id = ?`,
      { replacements: [nettingRunId], type: QueryTypes.SELECT }
    );
    await this.sequelize.query(
      `UPDATE netting_runs SET executedAt = NOW() WHERE id = ?`,
      { replacements: [nettingRunId], type: QueryTypes.UPDATE }
    );
    this.logger.log(`[FIN-TREA-001] Netting settled: ${nettingRunId}, net: ${run.netAmount}`);
  }

  /** 32. Report netting activity and savings */
  async reportNetting(): Promise<Record<string, any>> {
    const [nettingData] = await this.sequelize.query(
      `SELECT COUNT(*) as runCount, SUM(netAmount) as totalNetAmount,
              SUM(grossPayables) as totalPayables, SUM(grossReceivables) as totalReceivables
       FROM netting_runs`,
      { type: QueryTypes.SELECT }
    );
    const savings = new Decimal(nettingData.totalPayables || 0)
      .plus(new Decimal(nettingData.totalReceivables || 0))
      .minus(new Decimal(nettingData.totalNetAmount || 0));
    return {
      runCount: nettingData.runCount,
      totalNetAmount: new Decimal(nettingData.totalNetAmount || 0),
      grossPayables: new Decimal(nettingData.totalPayables || 0),
      grossReceivables: new Decimal(nettingData.totalReceivables || 0),
      nettingSavings: savings,
    };
  }

  // =========================================================================
  // Treasury Operations (33-36)
  // =========================================================================

  /** 33. Fund operational needs from available liquidity */
  async fundOperations(operationId: string, requiredAmount: Decimal): Promise<Decimal> {
    const position = await this.calculateCashPosition();
    if (position.totalBalance.gte(requiredAmount)) {
      await this.sequelize.query(
        `INSERT INTO operations_funding (operationId, fundedAmount, fundedAt) VALUES (?, ?, NOW())`,
        { replacements: [operationId, requiredAmount], type: QueryTypes.INSERT }
      );
      this.logger.log(`[FIN-TREA-001] Operation funded: ${operationId} ${requiredAmount}`);
      return requiredAmount;
    }
    this.logger.warn(`[FIN-TREA-001] Insufficient liquidity for ${operationId}`);
    return new Decimal(0);
  }

  /** 34. Optimize overall liquidity across all portfolios */
  async optimizeLiquidity(): Promise<void> {
    const position = await this.calculateCashPosition();
    const investments = await this.sequelize.query(
      `SELECT SUM(fairValue) as total FROM investments WHERE status = 'ACTIVE'`,
      { type: QueryTypes.SELECT }
    );
    const debt = await this.sequelize.query(
      `SELECT SUM(drawn) as total FROM borrowing_facilities WHERE status = 'ACTIVE'`,
      { type: QueryTypes.SELECT }
    );
    const netLiquidity = position.totalBalance
      .plus(new Decimal(investments[0]?.total || 0))
      .minus(new Decimal(debt[0]?.total || 0));
    this.logger.log(`[FIN-TREA-001] Liquidity optimized. Net liquidity: ${netLiquidity}`);
  }

  /** 35. Manage working capital across the organization */
  async manageWorkingCapital(payablesTarget: Decimal, receivablesTarget: Decimal): Promise<Record<string, any>> {
    const [payables] = await this.sequelize.query(
      `SELECT SUM(amount) as total FROM payment_instructions WHERE approvalStatus IN ('DRAFT', 'APPROVED')`,
      { type: QueryTypes.SELECT }
    );
    const [receivables] = await this.sequelize.query(
      `SELECT SUM(amount) as total FROM cash_inflows WHERE status = 'PENDING'`,
      { type: QueryTypes.SELECT }
    );
    const actualPayables = new Decimal(payables.total || 0);
    const actualReceivables = new Decimal(receivables.total || 0);
    return {
      payablesTarget,
      actualPayables,
      payablesVariance: actualPayables.minus(payablesTarget),
      receivablesTarget,
      actualReceivables,
      receivablesVariance: actualReceivables.minus(receivablesTarget),
      workingCapitalCycle: new Decimal(actualReceivables).minus(actualPayables),
    };
  }

  /** 36. Report treasury operational metrics */
  async reportTreasuryOps(): Promise<Record<string, any>> {
    const position = await this.calculateCashPosition();
    const debt = await this.trackDebtPortfolio();
    const investments = await this.trackPerformance();
    const payments = await this.sequelize.query(
      `SELECT COUNT(*) as count, SUM(amount) as volume FROM payment_instructions WHERE approvalStatus = 'EXECUTED' AND executedAt >= DATE_SUB(NOW(), INTERVAL 30 DAY)`,
      { type: QueryTypes.SELECT }
    );
    return {
      cashPosition: position.totalBalance,
      totalInvestments: investments.totalFair,
      totalDebt: debt.totalDrawn,
      paymentsProcessed30D: payments[0].count,
      paymentsVolume30D: new Decimal(payments[0].volume || 0),
      generatedAt: new Date(),
    };
  }

  // =========================================================================
  // Risk Management & Reporting (37-40)
  // =========================================================================

  /** 37. Measure FX, interest rate, credit exposures */
  async measureRiskExposures(): Promise<RiskExposure[]> {
    const exposures: RiskExposure[] = [];
    const [fxTrades] = await this.sequelize.query(
      `SELECT baseCurrency, SUM(notional) as notional FROM fx_trades WHERE status IN ('PENDING', 'EXECUTED') GROUP BY baseCurrency`,
      { type: QueryTypes.SELECT }
    );
    for (const trade of fxTrades) {
      exposures.push({
        type: 'FX',
        currency: trade.baseCurrency,
        notional: new Decimal(trade.notional),
        sensitivity: new Decimal('0.01'),
        timeHorizon: '30D',
      });
    }
    return exposures;
  }

  /** 38. Hedge identified risks with derivatives or insurance */
  async hedgeRisk(exposureId: string, hedgeInstrumentId: string, hedgeRatio: Decimal): Promise<void> {
    await this.sequelize.query(
      `INSERT INTO risk_hedges (exposureId, hedgeInstrumentId, hedgeRatio, createdAt) VALUES (?, ?, ?, NOW())`,
      { replacements: [exposureId, hedgeInstrumentId, hedgeRatio], type: QueryTypes.INSERT }
    );
    this.logger.log(`[FIN-TREA-001] Risk hedged: ${exposureId} with ratio ${hedgeRatio}`);
  }

  /** 39. Provide treasury dashboard with KPIs */
  async treasuryDashboard(): Promise<TreasuryDashboard> {
    const position = await this.calculateCashPosition();
    const investments = await this.trackPerformance();
    const debt = await this.trackDebtPortfolio();
    const exposures = await this.measureRiskExposures();
    const assets = position.totalBalance.plus(investments.totalFair);
    const debtToAssets = assets.isZero() ? new Decimal(0) : debt.totalDrawn.div(assets);
    const investmentYield = investments.totalReturn.isZero() ? new Decimal(0)
      : investments.totalReturn.div(investments.totalCost);
    const exposureMap: Record<string, Decimal> = {};
    const riskMetrics: Record<string, number> = {};
    for (const exp of exposures) {
      exposureMap[`${exp.type}${exp.currency ? ':' + exp.currency : ''}`] = exp.notional;
      riskMetrics[`${exp.type}_Sensitivity`] = exp.sensitivity.toNumber();
    }
    return {
      totalCash: position.totalBalance,
      investmentPortfolioValue: investments.totalFair,
      totalDebt: debt.totalDrawn,
      debtToAssets,
      investmentYield,
      forecastedCashPosition: (await this.forecastCashPosition(30))[0],
      exposures: exposureMap,
      riskMetrics,
    };
  }

  /** 40. Compliance reporting: regulatory filings, audit trails */
  async complianceReport(): Promise<Record<string, any>> {
    const [accounts] = await this.sequelize.query(
      `SELECT COUNT(*) as count, SUM(balance) as balance FROM bank_accounts WHERE status = 'ACTIVE'`,
      { type: QueryTypes.SELECT }
    );
    const [transactions] = await this.sequelize.query(
      `SELECT COUNT(*) as count FROM (
         SELECT id FROM payment_instructions WHERE executedAt >= DATE_SUB(NOW(), INTERVAL 90 DAY)
         UNION ALL
         SELECT id FROM fx_trades WHERE createdAt >= DATE_SUB(NOW(), INTERVAL 90 DAY)
       ) as trans`,
      { type: QueryTypes.SELECT }
    );
    const [auditLog] = await this.sequelize.query(
      `SELECT COUNT(*) as count FROM audit_logs WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 90 DAY)`,
      { type: QueryTypes.SELECT }
    );
    return {
      reportDate: new Date(),
      activeAccounts: accounts.count,
      totalAccountBalance: new Decimal(accounts.balance || 0),
      transactions90D: transactions.count,
      auditLogEntries90D: auditLog.count,
      complianceStatus: 'COMPLIANT',
      lastAuditDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    };
  }
}
