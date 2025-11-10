/**
 * @file Cash Flow Management Kit
 * @description Enterprise-grade cash flow analysis, forecasting, and treasury operations
 * @version 1.0.0
 * @location FIN-CASH-001
 * @targets Kyriba, GTreasury, SAP Treasury & Risk Management
 * @compliance GASB 34, IFRS 16, ASC 842
 * @integrations NestJS 10.x, Sequelize 6.x, decimal.js
 * @author FinTech Architects
 *
 * ## Features
 * - Cash flow statement generation (operating, investing, financing)
 * - Direct and indirect method calculations
 * - Daily/weekly/monthly cash position analysis
 * - Rolling forecasts and scenario analysis
 * - Working capital optimization
 * - Liquidity ratio calculations
 * - Cash conversion cycle analysis
 * - Bank reconciliation workflows
 * - Treasury operations (pooling, sweeps, concentration)
 *
 * ## Type Safety
 * - Decimal.js for precise financial calculations
 * - Discriminated unions for cash flow methods
 * - Strict type parameters for domain boundaries
 */
import Decimal from 'decimal.js';
/**
 * Cash flow statement structure with operating, investing, and financing sections
 */
interface CashFlowStatement {
    id: string;
    period: {
        start: Date;
        end: Date;
    };
    operating: OperatingCashFlow;
    investing: InvestingCashFlow;
    financing: FinancingCashFlow;
    netChange: Decimal;
    endingBalance: Decimal;
    generatedAt: Date;
}
/**
 * Operating cash flow details
 */
interface OperatingCashFlow {
    method: 'direct' | 'indirect';
    netIncome?: Decimal;
    depreciation?: Decimal;
    amortization?: Decimal;
    workingCapitalChange?: Decimal;
    receipts?: Decimal;
    payments?: Decimal;
    total: Decimal;
}
/**
 * Investing cash flow details
 */
interface InvestingCashFlow {
    capitalExpenditures: Decimal;
    assetSales: Decimal;
    investmentPurchases: Decimal;
    loanIssuances: Decimal;
    total: Decimal;
}
/**
 * Financing cash flow details
 */
interface FinancingCashFlow {
    debtIssuance: Decimal;
    debtRepayment: Decimal;
    equityIssuance: Decimal;
    dividendPayments: Decimal;
    total: Decimal;
}
/**
 * Cash position snapshot for daily/weekly/monthly analysis
 */
interface CashPositionData {
    date: Date;
    openingBalance: Decimal;
    inflows: Decimal;
    outflows: Decimal;
    closingBalance: Decimal;
    reserveBalance: Decimal;
    availableBalance: Decimal;
}
/**
 * Individual forecast period
 */
interface ForecastPeriod {
    date: Date;
    projectedInflow: Decimal;
    projectedOutflow: Decimal;
    projectedBalance: Decimal;
    variance?: Decimal;
}
/**
 * Bank reconciliation details
 */
interface BankReconciliation {
    accountId: string;
    bankBalance: Decimal;
    bookBalance: Decimal;
    reconciledBalance: Decimal;
    outstandingItems: OutstandingItem[];
    variance: Decimal;
    reconciledDate: Date;
}
/**
 * Treasury operation configuration
 */
interface TreasuryOperation {
    type: 'pooling' | 'sweep' | 'concentration' | 'notional';
    participants: string[];
    masterAccount: string;
    rules: Record<string, unknown>;
    status: 'active' | 'inactive';
}
interface OutstandingItem {
    id: string;
    amount: Decimal;
    daysOutstanding: number;
    type: 'check' | 'deposit' | 'transfer';
}
interface ScenarioResult {
    scenario: string;
    bestCase: Decimal;
    baseCase: Decimal;
    worstCase: Decimal;
    probability: number;
}
/**
 * 1. Generate operating cash flow statement section
 */
export declare function generateOperatingCashFlowStatement(netIncome: Decimal, depreciation: Decimal, amortization: Decimal, workingCapitalChange: Decimal, otherAdjustments?: Decimal): OperatingCashFlow;
/**
 * 2. Generate investing cash flow statement section
 */
export declare function generateInvestingCashFlowStatement(capex: Decimal, assetSales: Decimal, investmentPurchases: Decimal, loanIssuances: Decimal): InvestingCashFlow;
/**
 * 3. Generate financing cash flow statement section
 */
export declare function generateFinancingCashFlowStatement(debtIssuance: Decimal, debtRepayment: Decimal, equityIssuance: Decimal, dividendPayments: Decimal): FinancingCashFlow;
/**
 * 4. Generate combined cash flow statement
 */
export declare function generateCombinedCashFlowStatement(operating: OperatingCashFlow, investing: InvestingCashFlow, financing: FinancingCashFlow, beginningBalance: Decimal): CashFlowStatement;
/**
 * 5. Calculate operating receipts (direct method)
 */
export declare function calculateOperatingReceiptsDirectMethod(salesRevenue: Decimal, changeInAccountsReceivable: Decimal, otherOperatingReceipts?: Decimal): Decimal;
/**
 * 6. Calculate operating payments (direct method)
 */
export declare function calculateOperatingPaymentsDirectMethod(costOfGoods: Decimal, operatingExpenses: Decimal, changeInInventory: Decimal, changeInPayables: Decimal, taxPayments?: Decimal): Decimal;
/**
 * 7. Calculate net cash from operations (direct method)
 */
export declare function calculateNetCashFromOperationsDirectMethod(receipts: Decimal, payments: Decimal): Decimal;
/**
 * 8. Reconcile direct with indirect method
 */
export declare function reconcileDirectWithIndirectMethod(directMethod: Decimal, indirectMethod: Decimal, tolerance?: Decimal): boolean;
/**
 * 9. Adjust net income for indirect method
 */
export declare function adjustNetIncomeForIndirectMethod(netIncome: Decimal, depreciation: Decimal, amortization: Decimal, impairment?: Decimal, stockCompensation?: Decimal): Decimal;
/**
 * 10. Adjust non-cash items for indirect method
 */
export declare function adjustNonCashItemsIndirectMethod(gainOnSale: Decimal, lossOnSale: Decimal, deferredTaxes: Decimal, unrealizedGains?: Decimal): Decimal;
/**
 * 11. Calculate working capital changes
 */
export declare function calculateWorkingCapitalChanges(changeAR: Decimal, changeInventory: Decimal, changeAP: Decimal, changeAccruals?: Decimal): Decimal;
/**
 * 12. Finalize indirect method cash flow
 */
export declare function finalizeIndirectMethodCashFlow(netIncome: Decimal, nonCashAdjustments: Decimal, workingCapitalChanges: Decimal): Decimal;
/**
 * 13. Get daily cash position
 */
export declare function getDailyCashPosition(openBalance: Decimal, inflows: Decimal, outflows: Decimal, minimumReserve: Decimal): CashPositionData;
/**
 * 14. Get weekly cash summary
 */
export declare function getWeeklyCashSummary(dailyPositions: CashPositionData[]): {
    weekStartDate: Date;
    averageBalance: Decimal;
    minBalance: Decimal;
    maxBalance: Decimal;
    totalInflows: Decimal;
    totalOutflows: Decimal;
};
/**
 * 15. Get monthly cash projection
 */
export declare function getMonthlyProjection(weeklyData: Array<{
    weekStartDate: Date;
    totalInflows: Decimal;
    totalOutflows: Decimal;
}>, projectionWeeks?: number): Decimal;
/**
 * 16. Generate cash position alerts
 */
export declare function generateCashPositionAlerts(currentBalance: Decimal, minimumThreshold: Decimal, targetBalance: Decimal): Array<{
    level: string;
    message: string;
}>;
/**
 * 17. Forecast cash flow
 */
export declare function forecastCashFlow(historicalData: CashPositionData[], periods: number, method?: 'simple' | 'weighted' | 'exponential'): ForecastPeriod[];
/**
 * 18. Calculate rolling forecast
 */
export declare function calculateRollingForecast(baselineForecast: ForecastPeriod[], actualResults: CashPositionData[], rollingWindow?: number): ForecastPeriod[];
/**
 * 19. Perform scenario analysis
 */
export declare function performScenarioAnalysis(baseCase: Decimal, bestCaseMultiplier?: Decimal, worstCaseMultiplier?: Decimal, probability?: number): ScenarioResult;
/**
 * 20. Perform sensitivity analysis
 */
export declare function performSensitivityAnalysis(baseValue: Decimal, variable: string, ranges: Decimal[]): Array<{
    value: Decimal;
    impact: Decimal;
}>;
/**
 * 21. Calculate working capital
 */
export declare function calculateWorkingCapital(currentAssets: Decimal, currentLiabilities: Decimal): Decimal;
/**
 * 22. Analyze working capital changes
 */
export declare function analyzeWorkingCapitalChanges(currentWC: Decimal, previousWC: Decimal): {
    change: Decimal;
    percentChange: Decimal;
    trend: 'improving' | 'declining';
};
/**
 * 23. Optimize working capital
 */
export declare function optimizeWorkingCapital(accountsReceivable: Decimal, inventory: Decimal, accountsPayable: Decimal, dso: Decimal, dio: Decimal, dpo: Decimal): {
    optimizedAR: Decimal;
    optimizedInventory: Decimal;
    optimizedAP: Decimal;
    potentialCashRelease: Decimal;
};
/**
 * 24. Generate working capital report
 */
export declare function generateWorkingCapitalReport(assets: Decimal, liabilities: Decimal, prior: Decimal): {
    currentWC: Decimal;
    wcRatio: Decimal;
    wcChange: Decimal;
    summary: string;
};
/**
 * 25. Calculate current ratio
 */
export declare function calculateCurrentRatio(currentAssets: Decimal, currentLiabilities: Decimal): Decimal;
/**
 * 26. Calculate quick ratio
 */
export declare function calculateQuickRatio(currentAssets: Decimal, inventory: Decimal, currentLiabilities: Decimal): Decimal;
/**
 * 27. Calculate cash ratio
 */
export declare function calculateCashRatio(cash: Decimal, equivalents: Decimal, currentLiabilities: Decimal): Decimal;
/**
 * 28. Calculate operating cash flow ratio
 */
export declare function calculateOperatingCashFlowRatio(operatingCashFlow: Decimal, currentLiabilities: Decimal): Decimal;
/**
 * 29. Calculate cash conversion cycle
 */
export declare function calculateCashConversionCycle(dso: Decimal, dio: Decimal, dpo: Decimal): {
    cycle: Decimal;
    trend: 'improving' | 'declining' | 'stable';
};
/**
 * 30. Analyze days sales outstanding
 */
export declare function analyzeDaysSalesOutstanding(accountsReceivable: Decimal, dailySales: Decimal): Decimal;
/**
 * 31. Analyze days inventory outstanding
 */
export declare function analyzeDaysInventoryOutstanding(inventory: Decimal, dailyCOGS: Decimal): Decimal;
/**
 * 32. Analyze days payable outstanding
 */
export declare function analyzeDaysPayableOutstanding(accountsPayable: Decimal, dailyCOGS: Decimal): Decimal;
/**
 * 33. Reconcile bank accounts
 */
export declare function reconcileBankAccounts(bankBalance: Decimal, bookBalance: Decimal, outstandingItems?: OutstandingItem[]): BankReconciliation;
/**
 * 34. Match bank transactions
 */
export declare function matchBankTransactions(bankTxns: Array<{
    id: string;
    amount: Decimal;
    date: Date;
}>, bookTxns: Array<{
    id: string;
    amount: Decimal;
    date: Date;
}>, timingThreshold?: number): Array<{
    bankTxn: string;
    bookTxn: string;
    matched: boolean;
}>;
/**
 * 35. Investigate variance
 */
export declare function investigateVariance(variance: Decimal, tolerance: Decimal): {
    requiresInvestigation: boolean;
    severity: 'low' | 'medium' | 'high';
};
/**
 * 36. Finalize bank reconciliation
 */
export declare function finalizeBankReconciliation(recon: BankReconciliation): {
    status: 'reconciled' | 'unreconciled';
    message: string;
};
/**
 * 37. Perform cash pooling
 */
export declare function performCashPooling(accounts: Array<{
    id: string;
    balance: Decimal;
}>, masterAccount: string, poolingThreshold: Decimal): {
    pooledAmount: Decimal;
    remainingBalances: Record<string, Decimal>;
};
/**
 * 38. Perform cash concentration
 */
export declare function performCashConcentration(sourceAccounts: Map<string, Decimal>, concentrationTarget: Decimal, retentionAmount: Decimal): {
    amountToConcentrate: Decimal;
    concentrationDetails: Array<{
        account: string;
        amount: Decimal;
    }>;
};
/**
 * 39. Execute cash sweep
 */
export declare function executeCashSweep(parentAccount: string, childAccounts: Map<string, Decimal>, minimumBalance: Decimal, maximumBalance: Decimal): {
    sweepAmount: Decimal;
    sweptAccounts: Array<{
        account: string;
        sweepAmount: Decimal;
    }>;
};
/**
 * 40. Setup notional pooling
 */
export declare function setupNotionalPooling(poolMembers: Array<{
    entityId: string;
    targetBalance: Decimal;
}>, dailySettlementRate?: Decimal): TreasuryOperation;
export {};
/**
 * Summary of exported functions:
 * - Category 1: Cash flow statements (4 functions)
 * - Category 2: Direct method (4 functions)
 * - Category 3: Indirect method (4 functions)
 * - Category 4: Cash position (4 functions)
 * - Category 5: Forecasting (4 functions)
 * - Category 6: Working capital (4 functions)
 * - Category 7: Liquidity ratios (4 functions)
 * - Category 8: Cash conversion cycle (4 functions)
 * - Category 9: Bank reconciliation (4 functions)
 * - Category 10: Treasury operations (4 functions)
 *
 * Total: 40 functions, 10 types, production-grade financial calculations
 */
//# sourceMappingURL=cash-flow-management-kit.d.ts.map