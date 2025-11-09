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
import { Sequelize } from 'sequelize';
import { Logger } from '@nestjs/common';
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
export declare class TreasuryManagementKit {
    private sequelize;
    private logger;
    constructor(sequelize: Sequelize, logger: Logger);
    /** 1. Create bank account with initial setup */
    createBankAccount(bankCode: string, accountNumber: string, currency: string, accountType: string): Promise<BankAccount>;
    /** 2. Update bank account details */
    updateBankAccount(accountId: string, updates: Partial<BankAccount>): Promise<void>;
    /** 3. Reconcile bank account against statement */
    reconcileBankAccount(accountId: string, statementBalance: Decimal, statementDate: Date): Promise<Decimal>;
    /** 4. Close bank account and archive history */
    closeBankAccount(accountId: string, reason: string): Promise<void>;
    /** 5. Calculate current cash position across all accounts */
    calculateCashPosition(): Promise<CashPosition>;
    /** 6. Forecast cash position for N days */
    forecastCashPosition(days: number): Promise<Decimal[]>;
    /** 7. Optimize cash placement across accounts and investments */
    optimizeCashPlacement(minYield: Decimal): Promise<void>;
    /** 8. Report cash positioning metrics */
    reportCashPosition(): Promise<Record<string, any>>;
    /** 9. Sweep surplus funds to master account */
    sweepToMasterAccount(masterAccountId: string, threshold: Decimal): Promise<Decimal>;
    /** 10. Distribute funds from master to operating accounts */
    distributeFromMaster(masterAccountId: string, distribution: Map<string, Decimal>): Promise<void>;
    /** 11. Implement notional pooling virtual master account */
    setupNotionalPooling(poolId: string, memberAccounts: string[], masterCurrency: string): Promise<void>;
    /** 12. Report cash concentration metrics */
    reportConcentration(): Promise<Record<string, any>>;
    /** 13. Invest surplus cash in income-generating instruments */
    investSurplus(instrumentId: string, amount: Decimal): Promise<Investment>;
    /** 14. Liquidate investment position */
    liquidateInvestment(investmentId: string, proceedsAmount: Decimal): Promise<Decimal>;
    /** 15. Revalue investment portfolio to fair value */
    revaluePortfolio(asOfDate: Date): Promise<Decimal>;
    /** 16. Track investment portfolio performance */
    trackPerformance(): Promise<Record<string, Decimal>>;
    /** 17. Initiate borrowing facility */
    initiateBorrowingFacility(facilityCode: string, totalCommitment: Decimal, interestRate: Decimal, maturityDate: Date): Promise<BorrowingFacility>;
    /** 18. Draw funds from borrowing facility */
    drawFunds(facilityId: string, drawAmount: Decimal): Promise<void>;
    /** 19. Repay borrowing facility principal and interest */
    repayFacility(facilityId: string, principalAmount: Decimal, interestAmount: Decimal): Promise<void>;
    /** 20. Track debt portfolio metrics */
    trackDebtPortfolio(): Promise<Record<string, any>>;
    /** 21. Execute FX spot trade */
    executeFXTrade(baseCurrency: string, quoteCurrency: string, spotRate: Decimal, notional: Decimal, settlementDate: Date): Promise<FXTrade>;
    /** 22. Hedge FX exposure with forward contracts */
    hedgeFXExposure(baseCurrency: string, exposureAmount: Decimal, forwardRate: Decimal): Promise<void>;
    /** 23. Revalue FX positions and compute mark-to-market P&L */
    revalueFXPositions(asOfDate: Date, spotRates: Map<string, Decimal>): Promise<Decimal>;
    /** 24. Realize FX gains/losses on settlement */
    realizeFXGainsLosses(tradeId: string, settlementRate: Decimal): Promise<Decimal>;
    /** 25. Initiate payment instruction */
    initiatePayment(payeeId: string, amount: Decimal, currency: string, valueDate: Date, purpose: string): Promise<PaymentInstruction>;
    /** 26. Approve payment instruction through approval chain */
    approvePayment(paymentId: string, approverId: string, comment?: string): Promise<void>;
    /** 27. Execute approved payment and settle */
    executePayment(paymentId: string, executionReference: string): Promise<void>;
    /** 28. Track payment execution status and reconcile */
    trackPaymentStatus(paymentId: string): Promise<Record<string, any>>;
    /** 29. Identify netting opportunities between counterparties */
    identifyNettingOpportunities(nettingGroupId: string): Promise<Decimal>;
    /** 30. Execute netting transaction */
    executeNetting(nettingGroupId: string): Promise<NettingRun>;
    /** 31. Settle netting results */
    settleNetting(nettingRunId: string): Promise<void>;
    /** 32. Report netting activity and savings */
    reportNetting(): Promise<Record<string, any>>;
    /** 33. Fund operational needs from available liquidity */
    fundOperations(operationId: string, requiredAmount: Decimal): Promise<Decimal>;
    /** 34. Optimize overall liquidity across all portfolios */
    optimizeLiquidity(): Promise<void>;
    /** 35. Manage working capital across the organization */
    manageWorkingCapital(payablesTarget: Decimal, receivablesTarget: Decimal): Promise<Record<string, any>>;
    /** 36. Report treasury operational metrics */
    reportTreasuryOps(): Promise<Record<string, any>>;
    /** 37. Measure FX, interest rate, credit exposures */
    measureRiskExposures(): Promise<RiskExposure[]>;
    /** 38. Hedge identified risks with derivatives or insurance */
    hedgeRisk(exposureId: string, hedgeInstrumentId: string, hedgeRatio: Decimal): Promise<void>;
    /** 39. Provide treasury dashboard with KPIs */
    treasuryDashboard(): Promise<TreasuryDashboard>;
    /** 40. Compliance reporting: regulatory filings, audit trails */
    complianceReport(): Promise<Record<string, any>>;
}
export {};
//# sourceMappingURL=treasury-management-kit.d.ts.map