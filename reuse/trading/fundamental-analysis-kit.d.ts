/**
 * Fundamental Analysis Kit - Bloomberg Terminal-Level Analytics
 *
 * A comprehensive library of production-ready fundamental analysis functions
 * for financial statement analysis, valuation, and investment research.
 * All calculations implement institutional-grade methodologies with strict
 * type safety, comprehensive error handling, and professional accuracy.
 *
 * @module fundamental-analysis-kit
 * @author TypeScript Architect
 * @version 1.0.0
 */
/**
 * Balance sheet data structure
 */
export interface BalanceSheet {
    /** Current assets */
    currentAssets: number;
    /** Total assets */
    totalAssets: number;
    /** Current liabilities */
    currentLiabilities: number;
    /** Total liabilities */
    totalLiabilities: number;
    /** Long-term debt */
    longTermDebt: number;
    /** Shareholders' equity */
    shareholdersEquity: number;
    /** Cash and cash equivalents */
    cash: number;
    /** Inventory */
    inventory: number;
    /** Accounts receivable */
    accountsReceivable: number;
    /** Accounts payable */
    accountsPayable: number;
    /** Intangible assets */
    intangibleAssets?: number;
    /** Goodwill */
    goodwill?: number;
}
/**
 * Income statement data structure
 */
export interface IncomeStatement {
    /** Total revenue */
    revenue: number;
    /** Cost of goods sold */
    costOfGoodsSold: number;
    /** Operating expenses */
    operatingExpenses: number;
    /** Operating income (EBIT) */
    operatingIncome: number;
    /** Interest expense */
    interestExpense: number;
    /** Tax expense */
    taxExpense: number;
    /** Net income */
    netIncome: number;
    /** Depreciation and amortization */
    depreciationAmortization?: number;
    /** Research and development */
    rdExpense?: number;
    /** Selling, general & administrative */
    sgaExpense?: number;
}
/**
 * Cash flow statement data structure
 */
export interface CashFlowStatement {
    /** Operating cash flow */
    operatingCashFlow: number;
    /** Investing cash flow */
    investingCashFlow: number;
    /** Financing cash flow */
    financingCashFlow: number;
    /** Capital expenditures */
    capitalExpenditures: number;
    /** Dividends paid */
    dividendsPaid?: number;
    /** Stock buybacks */
    stockBuybacks?: number;
}
/**
 * Market data structure
 */
export interface MarketData {
    /** Current stock price */
    stockPrice: number;
    /** Shares outstanding */
    sharesOutstanding: number;
    /** Market capitalization */
    marketCap?: number;
    /** Enterprise value */
    enterpriseValue?: number;
    /** Beta coefficient */
    beta?: number;
}
/**
 * DCF model parameters
 */
export interface DCFParameters {
    /** Free cash flows for projection period */
    projectedFCF: number[];
    /** Terminal growth rate (as decimal, e.g., 0.03 for 3%) */
    terminalGrowthRate: number;
    /** Weighted average cost of capital (as decimal) */
    wacc: number;
    /** Cash and equivalents */
    cash: number;
    /** Total debt */
    totalDebt: number;
    /** Shares outstanding */
    sharesOutstanding: number;
}
/**
 * Valuation result with sensitivity analysis
 */
export interface ValuationResult {
    /** Base case valuation */
    baseValue: number;
    /** Per share value */
    valuePerShare: number;
    /** Upside/downside percentage */
    upsideDownside?: number;
    /** Confidence level */
    confidence?: 'high' | 'medium' | 'low';
}
/**
 * Financial health score
 */
export interface FinancialHealthScore {
    /** Overall score (0-100) */
    score: number;
    /** Liquidity score */
    liquidity: number;
    /** Solvency score */
    solvency: number;
    /** Profitability score */
    profitability: number;
    /** Efficiency score */
    efficiency: number;
    /** Rating */
    rating: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Critical';
}
/**
 * Peer comparison data
 */
export interface PeerMetrics {
    /** Company name or ticker */
    company: string;
    /** Price-to-earnings ratio */
    peRatio: number;
    /** Price-to-book ratio */
    pbRatio: number;
    /** EV/EBITDA multiple */
    evEbitda: number;
    /** Revenue */
    revenue: number;
    /** Market cap */
    marketCap: number;
    /** Custom metrics */
    [key: string]: string | number;
}
/**
 * Calculates Current Ratio
 *
 * Measures ability to pay short-term obligations.
 * Ratio > 1 indicates good short-term financial strength.
 *
 * @param balanceSheet - Balance sheet data
 * @returns Current ratio
 * @throws Error if current liabilities is zero or negative
 *
 * @example
 * const bs = { currentAssets: 150000, currentLiabilities: 100000, ... };
 * const ratio = calculateCurrentRatio(bs);
 * // Returns: 1.5
 */
export declare function calculateCurrentRatio(balanceSheet: BalanceSheet): number;
/**
 * Calculates Quick Ratio (Acid-Test Ratio)
 *
 * Measures ability to meet short-term obligations with most liquid assets.
 * More conservative than current ratio.
 *
 * @param balanceSheet - Balance sheet data
 * @returns Quick ratio
 * @throws Error if current liabilities is zero or negative
 *
 * @example
 * const bs = { currentAssets: 150000, inventory: 30000, currentLiabilities: 100000, ... };
 * const ratio = calculateQuickRatio(bs);
 * // Returns: 1.2
 */
export declare function calculateQuickRatio(balanceSheet: BalanceSheet): number;
/**
 * Calculates Cash Ratio
 *
 * Most conservative liquidity ratio - only cash and equivalents.
 *
 * @param balanceSheet - Balance sheet data
 * @returns Cash ratio
 * @throws Error if current liabilities is zero or negative
 *
 * @example
 * const bs = { cash: 50000, currentLiabilities: 100000, ... };
 * const ratio = calculateCashRatio(bs);
 * // Returns: 0.5
 */
export declare function calculateCashRatio(balanceSheet: BalanceSheet): number;
/**
 * Calculates Working Capital
 *
 * Difference between current assets and current liabilities.
 * Positive working capital indicates ability to fund operations.
 *
 * @param balanceSheet - Balance sheet data
 * @returns Working capital amount
 *
 * @example
 * const bs = { currentAssets: 150000, currentLiabilities: 100000, ... };
 * const wc = calculateWorkingCapital(bs);
 * // Returns: 50000
 */
export declare function calculateWorkingCapital(balanceSheet: BalanceSheet): number;
/**
 * Calculates Debt-to-Equity Ratio
 *
 * Measures financial leverage by comparing total debt to shareholders' equity.
 * Higher ratio indicates more aggressive financing with debt.
 *
 * @param balanceSheet - Balance sheet data
 * @returns Debt-to-equity ratio
 * @throws Error if equity is zero or negative
 *
 * @example
 * const bs = { totalLiabilities: 500000, shareholdersEquity: 1000000, ... };
 * const ratio = calculateDebtToEquity(bs);
 * // Returns: 0.5
 */
export declare function calculateDebtToEquity(balanceSheet: BalanceSheet): number;
/**
 * Calculates Debt Ratio
 *
 * Proportion of total assets financed by debt.
 *
 * @param balanceSheet - Balance sheet data
 * @returns Debt ratio (0 to 1)
 * @throws Error if total assets is zero or negative
 *
 * @example
 * const bs = { totalLiabilities: 400000, totalAssets: 1000000, ... };
 * const ratio = calculateDebtRatio(bs);
 * // Returns: 0.4
 */
export declare function calculateDebtRatio(balanceSheet: BalanceSheet): number;
/**
 * Calculates Equity Multiplier
 *
 * Measures financial leverage - portion of assets financed by equity.
 * Higher multiplier indicates more leverage.
 *
 * @param balanceSheet - Balance sheet data
 * @returns Equity multiplier
 * @throws Error if equity is zero or negative
 *
 * @example
 * const bs = { totalAssets: 1000000, shareholdersEquity: 600000, ... };
 * const multiplier = calculateEquityMultiplier(bs);
 * // Returns: 1.67
 */
export declare function calculateEquityMultiplier(balanceSheet: BalanceSheet): number;
/**
 * Calculates Interest Coverage Ratio
 *
 * Measures ability to pay interest on outstanding debt.
 * Ratio > 2.5 generally indicates healthy coverage.
 *
 * @param incomeStatement - Income statement data
 * @returns Interest coverage ratio
 * @throws Error if interest expense is zero or negative
 *
 * @example
 * const is = { operatingIncome: 500000, interestExpense: 50000, ... };
 * const coverage = calculateInterestCoverage(is);
 * // Returns: 10
 */
export declare function calculateInterestCoverage(incomeStatement: IncomeStatement): number;
/**
 * Calculates Debt Service Coverage Ratio
 *
 * Measures ability to service all debt obligations.
 *
 * @param operatingIncome - Operating income (EBIT)
 * @param totalDebtService - Total debt service (principal + interest)
 * @returns Debt service coverage ratio
 * @throws Error if debt service is zero or negative
 *
 * @example
 * const dscr = calculateDebtServiceCoverage(500000, 200000);
 * // Returns: 2.5
 */
export declare function calculateDebtServiceCoverage(operatingIncome: number, totalDebtService: number): number;
/**
 * Calculates Gross Profit Margin
 *
 * Percentage of revenue retained after cost of goods sold.
 * Higher margin indicates better pricing power and efficiency.
 *
 * @param incomeStatement - Income statement data
 * @returns Gross profit margin (as decimal)
 * @throws Error if revenue is zero or negative
 *
 * @example
 * const is = { revenue: 1000000, costOfGoodsSold: 600000, ... };
 * const margin = calculateGrossProfitMargin(is);
 * // Returns: 0.40 (40%)
 */
export declare function calculateGrossProfitMargin(incomeStatement: IncomeStatement): number;
/**
 * Calculates Operating Profit Margin
 *
 * Percentage of revenue remaining after operating expenses.
 *
 * @param incomeStatement - Income statement data
 * @returns Operating profit margin (as decimal)
 * @throws Error if revenue is zero or negative
 *
 * @example
 * const is = { operatingIncome: 200000, revenue: 1000000, ... };
 * const margin = calculateOperatingMargin(is);
 * // Returns: 0.20 (20%)
 */
export declare function calculateOperatingMargin(incomeStatement: IncomeStatement): number;
/**
 * Calculates Net Profit Margin
 *
 * Percentage of revenue that becomes profit.
 * Key indicator of overall profitability.
 *
 * @param incomeStatement - Income statement data
 * @returns Net profit margin (as decimal)
 * @throws Error if revenue is zero or negative
 *
 * @example
 * const is = { netIncome: 150000, revenue: 1000000, ... };
 * const margin = calculateNetProfitMargin(is);
 * // Returns: 0.15 (15%)
 */
export declare function calculateNetProfitMargin(incomeStatement: IncomeStatement): number;
/**
 * Calculates EBITDA Margin
 *
 * EBITDA as percentage of revenue.
 * Measures operating profitability before accounting decisions.
 *
 * @param incomeStatement - Income statement data
 * @returns EBITDA margin (as decimal)
 * @throws Error if revenue is zero or negative
 *
 * @example
 * const is = { operatingIncome: 200000, depreciationAmortization: 50000, revenue: 1000000, ... };
 * const margin = calculateEBITDAMargin(is);
 * // Returns: 0.25 (25%)
 */
export declare function calculateEBITDAMargin(incomeStatement: IncomeStatement): number;
/**
 * Calculates Return on Assets (ROA)
 *
 * Measures how efficiently assets generate profit.
 * Higher ROA indicates better asset utilization.
 *
 * @param incomeStatement - Income statement data
 * @param balanceSheet - Balance sheet data
 * @returns ROA (as decimal)
 * @throws Error if total assets is zero or negative
 *
 * @example
 * const is = { netIncome: 150000, ... };
 * const bs = { totalAssets: 1000000, ... };
 * const roa = calculateROA(is, bs);
 * // Returns: 0.15 (15%)
 */
export declare function calculateROA(incomeStatement: IncomeStatement, balanceSheet: BalanceSheet): number;
/**
 * Calculates Return on Equity (ROE)
 *
 * Measures profitability relative to shareholders' equity.
 * Key metric for equity investors.
 *
 * @param incomeStatement - Income statement data
 * @param balanceSheet - Balance sheet data
 * @returns ROE (as decimal)
 * @throws Error if equity is zero or negative
 *
 * @example
 * const is = { netIncome: 150000, ... };
 * const bs = { shareholdersEquity: 600000, ... };
 * const roe = calculateROE(is, bs);
 * // Returns: 0.25 (25%)
 */
export declare function calculateROE(incomeStatement: IncomeStatement, balanceSheet: BalanceSheet): number;
/**
 * Calculates Return on Invested Capital (ROIC)
 *
 * Measures return generated on all capital invested (debt + equity).
 * Superior to ROE as it accounts for all capital sources.
 *
 * @param incomeStatement - Income statement data
 * @param balanceSheet - Balance sheet data
 * @param taxRate - Effective tax rate (as decimal)
 * @returns ROIC (as decimal)
 * @throws Error if invested capital is zero or negative
 *
 * @example
 * const is = { operatingIncome: 200000, ... };
 * const bs = { shareholdersEquity: 600000, longTermDebt: 300000, ... };
 * const roic = calculateROIC(is, bs, 0.25);
 * // Returns: ~0.167 (16.7%)
 */
export declare function calculateROIC(incomeStatement: IncomeStatement, balanceSheet: BalanceSheet, taxRate: number): number;
/**
 * Calculates Asset Turnover Ratio
 *
 * Measures how efficiently assets generate revenue.
 *
 * @param incomeStatement - Income statement data
 * @param balanceSheet - Balance sheet data
 * @returns Asset turnover ratio
 * @throws Error if total assets is zero or negative
 *
 * @example
 * const is = { revenue: 2000000, ... };
 * const bs = { totalAssets: 1000000, ... };
 * const turnover = calculateAssetTurnover(is, bs);
 * // Returns: 2.0
 */
export declare function calculateAssetTurnover(incomeStatement: IncomeStatement, balanceSheet: BalanceSheet): number;
/**
 * Calculates Inventory Turnover Ratio
 *
 * Measures how quickly inventory is sold and replaced.
 * Higher ratio indicates efficient inventory management.
 *
 * @param incomeStatement - Income statement data
 * @param balanceSheet - Balance sheet data
 * @returns Inventory turnover ratio
 * @throws Error if inventory is zero or negative
 *
 * @example
 * const is = { costOfGoodsSold: 600000, ... };
 * const bs = { inventory: 100000, ... };
 * const turnover = calculateInventoryTurnover(is, bs);
 * // Returns: 6.0
 */
export declare function calculateInventoryTurnover(incomeStatement: IncomeStatement, balanceSheet: BalanceSheet): number;
/**
 * Calculates Days Sales Outstanding (DSO)
 *
 * Average number of days to collect payment after a sale.
 * Lower DSO indicates faster collection.
 *
 * @param balanceSheet - Balance sheet data
 * @param revenue - Annual revenue
 * @param daysInPeriod - Days in period (typically 365)
 * @returns Days sales outstanding
 * @throws Error if revenue is zero or negative
 *
 * @example
 * const bs = { accountsReceivable: 150000, ... };
 * const dso = calculateDSO(bs, 1000000, 365);
 * // Returns: ~54.75 days
 */
export declare function calculateDSO(balanceSheet: BalanceSheet, revenue: number, daysInPeriod?: number): number;
/**
 * Calculates Days Payable Outstanding (DPO)
 *
 * Average number of days to pay suppliers.
 * Higher DPO may indicate better cash management but could strain relationships.
 *
 * @param balanceSheet - Balance sheet data
 * @param costOfGoodsSold - Annual COGS
 * @param daysInPeriod - Days in period (typically 365)
 * @returns Days payable outstanding
 * @throws Error if COGS is zero or negative
 *
 * @example
 * const bs = { accountsPayable: 80000, ... };
 * const dpo = calculateDPO(bs, 600000, 365);
 * // Returns: ~48.67 days
 */
export declare function calculateDPO(balanceSheet: BalanceSheet, costOfGoodsSold: number, daysInPeriod?: number): number;
/**
 * Calculates Cash Conversion Cycle (CCC)
 *
 * Number of days between paying suppliers and collecting from customers.
 * Lower CCC indicates better working capital efficiency.
 *
 * @param incomeStatement - Income statement data
 * @param balanceSheet - Balance sheet data
 * @param daysInPeriod - Days in period (typically 365)
 * @returns Cash conversion cycle in days
 *
 * @example
 * const is = { revenue: 1000000, costOfGoodsSold: 600000, ... };
 * const bs = { inventory: 100000, accountsReceivable: 150000, accountsPayable: 80000, ... };
 * const ccc = calculateCashConversionCycle(is, bs, 365);
 */
export declare function calculateCashConversionCycle(incomeStatement: IncomeStatement, balanceSheet: BalanceSheet, daysInPeriod?: number): number;
/**
 * Calculates Free Cash Flow (FCF)
 *
 * Cash available after capital expenditures.
 * Key metric for valuation and financial health.
 *
 * @param cashFlowStatement - Cash flow statement data
 * @returns Free cash flow
 *
 * @example
 * const cf = { operatingCashFlow: 500000, capitalExpenditures: 150000, ... };
 * const fcf = calculateFreeCashFlow(cf);
 * // Returns: 350000
 */
export declare function calculateFreeCashFlow(cashFlowStatement: CashFlowStatement): number;
/**
 * Calculates Free Cash Flow to Equity (FCFE)
 *
 * Cash available to equity holders after all obligations.
 *
 * @param cashFlowStatement - Cash flow statement data
 * @param netBorrowing - Net new debt issued (debt issued - debt repaid)
 * @returns Free cash flow to equity
 *
 * @example
 * const cf = { operatingCashFlow: 500000, capitalExpenditures: 150000, ... };
 * const fcfe = calculateFCFE(cf, 50000);
 * // Returns: 400000
 */
export declare function calculateFCFE(cashFlowStatement: CashFlowStatement, netBorrowing: number): number;
/**
 * Calculates Operating Cash Flow Ratio
 *
 * Measures ability to cover current liabilities with operating cash flow.
 *
 * @param cashFlowStatement - Cash flow statement data
 * @param currentLiabilities - Current liabilities
 * @returns Operating cash flow ratio
 * @throws Error if current liabilities is zero or negative
 *
 * @example
 * const cf = { operatingCashFlow: 400000, ... };
 * const ratio = calculateOCFRatio(cf, 200000);
 * // Returns: 2.0
 */
export declare function calculateOCFRatio(cashFlowStatement: CashFlowStatement, currentLiabilities: number): number;
/**
 * Calculates Cash Flow to Debt Ratio
 *
 * Measures ability to cover total debt with operating cash flow.
 *
 * @param cashFlowStatement - Cash flow statement data
 * @param totalDebt - Total debt
 * @returns Cash flow to debt ratio
 * @throws Error if total debt is zero or negative
 *
 * @example
 * const cf = { operatingCashFlow: 400000, ... };
 * const ratio = calculateCashFlowToDebt(cf, 1000000);
 * // Returns: 0.4
 */
export declare function calculateCashFlowToDebt(cashFlowStatement: CashFlowStatement, totalDebt: number): number;
/**
 * Calculates Cash Burn Rate
 *
 * Monthly cash consumption rate for companies with negative cash flow.
 * Important for startups and growth companies.
 *
 * @param beginningCash - Cash at period start
 * @param endingCash - Cash at period end
 * @param numberOfMonths - Number of months in period
 * @returns Monthly cash burn rate (positive number)
 *
 * @example
 * const burnRate = calculateCashBurnRate(1000000, 400000, 6);
 * // Returns: 100000 (burning $100k/month)
 */
export declare function calculateCashBurnRate(beginningCash: number, endingCash: number, numberOfMonths: number): number;
/**
 * Calculates Runway
 *
 * Number of months until cash runs out at current burn rate.
 *
 * @param currentCash - Current cash balance
 * @param monthlyBurnRate - Monthly cash burn rate
 * @returns Months of runway remaining
 * @throws Error if burn rate is zero or negative
 *
 * @example
 * const runway = calculateRunway(600000, 100000);
 * // Returns: 6 (months)
 */
export declare function calculateRunway(currentCash: number, monthlyBurnRate: number): number;
/**
 * Calculates Price-to-Earnings (P/E) Ratio
 *
 * Most common valuation multiple.
 * Higher P/E may indicate growth expectations or overvaluation.
 *
 * @param stockPrice - Current stock price
 * @param earningsPerShare - EPS (annual)
 * @returns P/E ratio
 * @throws Error if EPS is zero or negative
 *
 * @example
 * const pe = calculatePERatio(50, 2.50);
 * // Returns: 20
 */
export declare function calculatePERatio(stockPrice: number, earningsPerShare: number): number;
/**
 * Calculates Price-to-Book (P/B) Ratio
 *
 * Compares market value to book value.
 * Useful for asset-heavy companies.
 *
 * @param stockPrice - Current stock price
 * @param bookValuePerShare - Book value per share
 * @returns P/B ratio
 * @throws Error if book value is zero or negative
 *
 * @example
 * const pb = calculatePBRatio(50, 30);
 * // Returns: 1.67
 */
export declare function calculatePBRatio(stockPrice: number, bookValuePerShare: number): number;
/**
 * Calculates Enterprise Value to EBITDA (EV/EBITDA)
 *
 * Key valuation multiple used in M&A and comparable company analysis.
 * Accounts for capital structure differences.
 *
 * @param marketData - Market data
 * @param incomeStatement - Income statement data
 * @param totalDebt - Total debt
 * @returns EV/EBITDA multiple
 * @throws Error if EBITDA is zero or negative
 *
 * @example
 * const market = { marketCap: 5000000, ... };
 * const is = { operatingIncome: 500000, depreciationAmortization: 100000, ... };
 * const evEbitda = calculateEVtoEBITDA(market, is, 1000000, 200000);
 * // Returns: ~10
 */
export declare function calculateEVtoEBITDA(marketData: MarketData, incomeStatement: IncomeStatement, totalDebt: number, cash: number): number;
/**
 * Calculates Price-to-Sales (P/S) Ratio
 *
 * Useful for valuing companies with negative earnings.
 *
 * @param marketCap - Market capitalization
 * @param revenue - Total revenue
 * @returns P/S ratio
 * @throws Error if revenue is zero or negative
 *
 * @example
 * const ps = calculatePSRatio(5000000, 10000000);
 * // Returns: 0.5
 */
export declare function calculatePSRatio(marketCap: number, revenue: number): number;
/**
 * Calculates PEG Ratio
 *
 * P/E ratio adjusted for growth rate.
 * PEG < 1 may indicate undervaluation relative to growth.
 *
 * @param peRatio - P/E ratio
 * @param earningsGrowthRate - Annual earnings growth rate (as percentage, e.g., 20 for 20%)
 * @returns PEG ratio
 * @throws Error if growth rate is zero or negative
 *
 * @example
 * const peg = calculatePEGRatio(20, 25);
 * // Returns: 0.8
 */
export declare function calculatePEGRatio(peRatio: number, earningsGrowthRate: number): number;
/**
 * Calculates Price-to-Cash Flow Ratio
 *
 * Valuation based on cash generation ability.
 *
 * @param marketCap - Market capitalization
 * @param operatingCashFlow - Operating cash flow
 * @returns Price-to-cash flow ratio
 * @throws Error if OCF is zero or negative
 *
 * @example
 * const pcf = calculatePriceToCashFlow(5000000, 750000);
 * // Returns: 6.67
 */
export declare function calculatePriceToCashFlow(marketCap: number, operatingCashFlow: number): number;
/**
 * Calculates Basic Earnings Per Share (EPS)
 *
 * Net income divided by shares outstanding.
 *
 * @param netIncome - Net income
 * @param sharesOutstanding - Shares outstanding
 * @returns Basic EPS
 * @throws Error if shares outstanding is zero or negative
 *
 * @example
 * const eps = calculateBasicEPS(1000000, 400000);
 * // Returns: 2.50
 */
export declare function calculateBasicEPS(netIncome: number, sharesOutstanding: number): number;
/**
 * Calculates Diluted Earnings Per Share
 *
 * EPS accounting for potential dilution from options, warrants, convertibles.
 *
 * @param netIncome - Net income
 * @param sharesOutstanding - Basic shares outstanding
 * @param dilutiveShares - Additional shares from dilutive securities
 * @returns Diluted EPS
 * @throws Error if total shares is zero or negative
 *
 * @example
 * const dilutedEPS = calculateDilutedEPS(1000000, 400000, 20000);
 * // Returns: 2.38
 */
export declare function calculateDilutedEPS(netIncome: number, sharesOutstanding: number, dilutiveShares: number): number;
/**
 * Calculates Earnings Quality Score
 *
 * Assesses quality of earnings based on cash flow conversion.
 * Score > 1 indicates high quality (earnings backed by cash).
 *
 * @param netIncome - Net income
 * @param operatingCashFlow - Operating cash flow
 * @returns Earnings quality score
 * @throws Error if net income is zero or negative
 *
 * @example
 * const quality = calculateEarningsQuality(1000000, 1200000);
 * // Returns: 1.2 (high quality)
 */
export declare function calculateEarningsQuality(netIncome: number, operatingCashFlow: number): number;
/**
 * Calculates Earnings Surprise
 *
 * Percentage difference between actual and expected earnings.
 *
 * @param actualEPS - Actual reported EPS
 * @param expectedEPS - Analyst consensus EPS estimate
 * @returns Earnings surprise as percentage
 * @throws Error if expected EPS is zero
 *
 * @example
 * const surprise = calculateEarningsSurprise(2.50, 2.30);
 * // Returns: 8.7% (beat estimates by 8.7%)
 */
export declare function calculateEarningsSurprise(actualEPS: number, expectedEPS: number): number;
/**
 * Calculates Normalized Earnings
 *
 * Adjusts earnings for one-time items to show sustainable earning power.
 *
 * @param reportedEarnings - Reported net income
 * @param oneTimeItems - Array of one-time items (gains positive, losses negative)
 * @returns Normalized earnings
 *
 * @example
 * const normalized = calculateNormalizedEarnings(1000000, [150000, -50000]);
 * // Returns: 900000
 */
export declare function calculateNormalizedEarnings(reportedEarnings: number, oneTimeItems: number[]): number;
/**
 * Calculates Core Earnings
 *
 * Earnings from core operations, excluding financial engineering.
 * More conservative measure than reported earnings.
 *
 * @param operatingIncome - Operating income
 * @param interestExpense - Interest expense
 * @param taxRate - Effective tax rate (as decimal)
 * @returns Core earnings (after-tax operating income)
 *
 * @example
 * const core = calculateCoreEarnings(500000, 50000, 0.25);
 * // Returns: 337500
 */
export declare function calculateCoreEarnings(operatingIncome: number, interestExpense: number, taxRate: number): number;
/**
 * Calculates Revenue Growth Rate
 *
 * Year-over-year revenue growth percentage.
 *
 * @param currentRevenue - Current period revenue
 * @param previousRevenue - Previous period revenue
 * @returns Growth rate as percentage
 * @throws Error if previous revenue is zero or negative
 *
 * @example
 * const growth = calculateRevenueGrowth(1200000, 1000000);
 * // Returns: 20%
 */
export declare function calculateRevenueGrowth(currentRevenue: number, previousRevenue: number): number;
/**
 * Calculates Earnings Growth Rate
 *
 * Year-over-year earnings growth percentage.
 *
 * @param currentEarnings - Current period earnings
 * @param previousEarnings - Previous period earnings
 * @returns Growth rate as percentage
 * @throws Error if previous earnings is zero or negative
 *
 * @example
 * const growth = calculateEarningsGrowth(150000, 120000);
 * // Returns: 25%
 */
export declare function calculateEarningsGrowth(currentEarnings: number, previousEarnings: number): number;
/**
 * Calculates Sustainable Growth Rate
 *
 * Maximum growth rate achievable without external financing.
 * Based on ROE and retention ratio.
 *
 * @param roe - Return on equity (as decimal)
 * @param retentionRatio - Earnings retention ratio (as decimal, 1 - payout ratio)
 * @returns Sustainable growth rate (as percentage)
 *
 * @example
 * const sgr = calculateSustainableGrowthRate(0.15, 0.60);
 * // Returns: 9% (company can grow at 9% without external financing)
 */
export declare function calculateSustainableGrowthRate(roe: number, retentionRatio: number): number;
/**
 * Calculates Compound Annual Growth Rate (CAGR)
 *
 * Annualized growth rate over multiple periods.
 *
 * @param beginningValue - Starting value
 * @param endingValue - Ending value
 * @param numberOfYears - Number of years
 * @returns CAGR as percentage
 * @throws Error if inputs are invalid
 *
 * @example
 * const cagr = calculateCAGR(1000000, 1610510, 5);
 * // Returns: 10%
 */
export declare function calculateCAGR(beginningValue: number, endingValue: number, numberOfYears: number): number;
/**
 * Projects Future Growth
 *
 * Estimates future value based on growth rate.
 *
 * @param currentValue - Current value
 * @param growthRate - Annual growth rate (as decimal)
 * @param numberOfYears - Projection period in years
 * @returns Projected future value
 *
 * @example
 * const future = projectFutureGrowth(1000000, 0.08, 5);
 * // Returns: ~1469328
 */
export declare function projectFutureGrowth(currentValue: number, growthRate: number, numberOfYears: number): number;
/**
 * Calculates Discounted Cash Flow (DCF) Valuation
 *
 * Intrinsic value based on present value of future cash flows.
 * Core valuation methodology for fundamental analysis.
 *
 * @param params - DCF model parameters
 * @returns Valuation result with per-share value
 * @throws Error if parameters are invalid
 *
 * @example
 * const params = {
 *   projectedFCF: [100000, 110000, 120000, 130000, 140000],
 *   terminalGrowthRate: 0.03,
 *   wacc: 0.10,
 *   cash: 500000,
 *   totalDebt: 1000000,
 *   sharesOutstanding: 1000000
 * };
 * const valuation = calculateDCF(params);
 */
export declare function calculateDCF(params: DCFParameters): ValuationResult;
/**
 * Calculates Dividend Discount Model (DDM) - Gordon Growth Model
 *
 * Values stock based on present value of future dividends.
 * Suitable for dividend-paying companies with stable growth.
 *
 * @param nextYearDividend - Expected dividend next year
 * @param requiredReturn - Required rate of return (as decimal)
 * @param growthRate - Perpetual dividend growth rate (as decimal)
 * @returns Intrinsic value per share
 * @throws Error if required return <= growth rate
 *
 * @example
 * const value = calculateGordonGrowthModel(2.50, 0.10, 0.05);
 * // Returns: 50 (intrinsic value per share)
 */
export declare function calculateGordonGrowthModel(nextYearDividend: number, requiredReturn: number, growthRate: number): number;
/**
 * Calculates Graham Number
 *
 * Conservative intrinsic value estimate by Benjamin Graham.
 * Combines earnings and book value.
 *
 * @param eps - Earnings per share
 * @param bookValuePerShare - Book value per share
 * @returns Graham number (intrinsic value estimate)
 * @throws Error if inputs are zero or negative
 *
 * @example
 * const grahamNumber = calculateGrahamNumber(5, 40);
 * // Returns: ~28.28
 */
export declare function calculateGrahamNumber(eps: number, bookValuePerShare: number): number;
/**
 * Calculates Intrinsic Value (Benjamin Graham Formula)
 *
 * Graham's formula incorporating earnings and growth.
 *
 * @param eps - Current earnings per share
 * @param growthRate - Expected annual growth rate (as percentage, e.g., 7 for 7%)
 * @param bondYield - Current AAA corporate bond yield (as percentage)
 * @returns Intrinsic value per share
 *
 * @example
 * const intrinsic = calculateBenjaminGrahamIntrinsicValue(5, 7, 4.5);
 */
export declare function calculateBenjaminGrahamIntrinsicValue(eps: number, growthRate: number, bondYield?: number): number;
/**
 * Calculates Residual Income Model Valuation
 *
 * Values equity based on book value plus present value of excess returns.
 *
 * @param bookValue - Current book value
 * @param projectedRI - Array of projected residual income
 * @param requiredReturn - Required return on equity (as decimal)
 * @returns Intrinsic value
 *
 * @example
 * const value = calculateResidualIncomeModel(1000000, [50000, 55000, 60000], 0.12);
 */
export declare function calculateResidualIncomeModel(bookValue: number, projectedRI: number[], requiredReturn: number): number;
/**
 * Calculates Asset-Based Valuation
 *
 * Values company based on liquidation value of assets.
 * Conservative approach suitable for asset-heavy companies.
 *
 * @param totalAssets - Total assets
 * @param totalLiabilities - Total liabilities
 * @param assetRecoveryRate - Expected recovery rate on assets (as decimal, typically 0.5-0.8)
 * @returns Liquidation value
 *
 * @example
 * const liquidationValue = calculateAssetBasedValuation(5000000, 2000000, 0.70);
 * // Returns: 1500000
 */
export declare function calculateAssetBasedValuation(totalAssets: number, totalLiabilities: number, assetRecoveryRate?: number): number;
/**
 * Calculates Industry Average Multiple
 *
 * Computes average valuation multiple across peer companies.
 *
 * @param peers - Array of peer company metrics
 * @param multiple - Which multiple to average ('peRatio' | 'pbRatio' | 'evEbitda')
 * @returns Average multiple
 * @throws Error if peers array is empty
 *
 * @example
 * const peers = [
 *   { company: 'A', peRatio: 20, pbRatio: 3, evEbitda: 12, revenue: 1000000, marketCap: 5000000 },
 *   { company: 'B', peRatio: 25, pbRatio: 4, evEbitda: 15, revenue: 1200000, marketCap: 6000000 }
 * ];
 * const avgPE = calculateIndustryAverage(peers, 'peRatio');
 * // Returns: 22.5
 */
export declare function calculateIndustryAverage(peers: readonly PeerMetrics[], multiple: keyof PeerMetrics): number;
/**
 * Calculates Relative Valuation
 *
 * Values company based on peer multiple and company metric.
 *
 * @param companyMetric - Company's metric (e.g., earnings, book value)
 * @param peerMultiple - Average peer multiple
 * @returns Estimated valuation
 *
 * @example
 * const earnings = 1000000;
 * const peerPE = 22.5;
 * const valuation = calculateRelativeValuation(earnings, peerPE);
 * // Returns: 22500000
 */
export declare function calculateRelativeValuation(companyMetric: number, peerMultiple: number): number;
/**
 * Performs Peer Comparison Analysis
 *
 * Compares company metrics against peer group statistics.
 *
 * @param companyMetric - Company's metric value
 * @param peerMetrics - Array of peer metric values
 * @returns Percentile rank and comparison statistics
 *
 * @example
 * const peers = [15, 18, 20, 22, 25, 28, 30];
 * const analysis = analyzePeerComparison(24, peers);
 * // Returns: { percentile: 71.4, aboveAverage: true, ... }
 */
export declare function analyzePeerComparison(companyMetric: number, peerMetrics: readonly number[]): {
    percentile: number;
    aboveAverage: boolean;
    aboveMedian: boolean;
    peerAverage: number;
    peerMedian: number;
};
/**
 * Calculates Market Cap Weighted Average
 *
 * Computes weighted average of peer multiples by market cap.
 *
 * @param peers - Array of peer company metrics
 * @param multiple - Which multiple to average
 * @returns Market cap weighted average
 *
 * @example
 * const peers = [
 *   { company: 'A', peRatio: 20, marketCap: 5000000, ... },
 *   { company: 'B', peRatio: 25, marketCap: 10000000, ... }
 * ];
 * const weightedPE = calculateMarketCapWeightedAverage(peers, 'peRatio');
 */
export declare function calculateMarketCapWeightedAverage(peers: readonly PeerMetrics[], multiple: keyof PeerMetrics): number;
/**
 * Calculates Real GDP Growth
 *
 * Adjusts nominal GDP growth for inflation.
 *
 * @param nominalGDPGrowth - Nominal GDP growth rate (as percentage)
 * @param inflationRate - Inflation rate (as percentage)
 * @returns Real GDP growth rate
 *
 * @example
 * const realGrowth = calculateRealGDPGrowth(5.5, 2.0);
 * // Returns: ~3.43%
 */
export declare function calculateRealGDPGrowth(nominalGDPGrowth: number, inflationRate: number): number;
/**
 * Adjusts Value for Inflation
 *
 * Converts nominal value to real value using inflation rate.
 *
 * @param nominalValue - Nominal (current dollar) value
 * @param inflationRate - Inflation rate (as decimal)
 * @param years - Number of years
 * @returns Real (inflation-adjusted) value
 *
 * @example
 * const realValue = adjustForInflation(100000, 0.03, 5);
 * // Returns: ~86260.88
 */
export declare function adjustForInflation(nominalValue: number, inflationRate: number, years: number): number;
/**
 * Calculates Real Interest Rate
 *
 * Adjusts nominal interest rate for inflation (Fisher equation).
 *
 * @param nominalRate - Nominal interest rate (as percentage)
 * @param inflationRate - Inflation rate (as percentage)
 * @returns Real interest rate
 *
 * @example
 * const realRate = calculateRealInterestRate(5.0, 2.0);
 * // Returns: ~2.94%
 */
export declare function calculateRealInterestRate(nominalRate: number, inflationRate: number): number;
/**
 * Analyzes Currency Impact on Revenue
 *
 * Calculates impact of currency movements on foreign revenue.
 *
 * @param foreignRevenue - Revenue in foreign currency
 * @param previousExchangeRate - Previous period exchange rate
 * @param currentExchangeRate - Current period exchange rate
 * @returns Currency impact on revenue
 *
 * @example
 * const impact = analyzeCurrencyImpact(1000000, 1.20, 1.15);
 * // Returns: ~43478.26 (negative impact from currency appreciation)
 */
export declare function analyzeCurrencyImpact(foreignRevenue: number, previousExchangeRate: number, currentExchangeRate: number): number;
/**
 * Calculates Employment Cost Impact
 *
 * Estimates labor cost changes based on employment metrics.
 *
 * @param currentEmployees - Current employee count
 * @param averageSalary - Average salary per employee
 * @param salaryGrowthRate - Expected salary growth (as decimal)
 * @param headcountGrowth - Expected headcount growth (as decimal)
 * @returns Projected increase in employment costs
 *
 * @example
 * const costIncrease = calculateEmploymentCostImpact(1000, 75000, 0.03, 0.05);
 * // Returns: 6075000
 */
export declare function calculateEmploymentCostImpact(currentEmployees: number, averageSalary: number, salaryGrowthRate: number, headcountGrowth: number): number;
/**
 * Analyzes Interest Rate Sensitivity
 *
 * Estimates impact of interest rate changes on debt service.
 *
 * @param variableRateDebt - Amount of variable rate debt
 * @param rateChange - Change in interest rate (as decimal, e.g., 0.01 for 1%)
 * @returns Annual impact on interest expense
 *
 * @example
 * const impact = analyzeInterestRateSensitivity(10000000, 0.01);
 * // Returns: 100000 (additional annual interest expense)
 */
export declare function analyzeInterestRateSensitivity(variableRateDebt: number, rateChange: number): number;
/**
 * Calculates Financial Health Score
 *
 * Comprehensive assessment of financial health across multiple dimensions.
 *
 * @param balanceSheet - Balance sheet data
 * @param incomeStatement - Income statement data
 * @param cashFlowStatement - Cash flow statement data
 * @returns Financial health score and rating
 *
 * @example
 * const health = calculateFinancialHealthScore(bs, is, cf);
 * // Returns: { score: 75, liquidity: 80, solvency: 70, profitability: 75, efficiency: 75, rating: 'Good' }
 */
export declare function calculateFinancialHealthScore(balanceSheet: BalanceSheet, incomeStatement: IncomeStatement, cashFlowStatement: CashFlowStatement): FinancialHealthScore;
/**
 * Performs DuPont Analysis
 *
 * Decomposes ROE into its component drivers.
 * Critical for understanding sources of profitability.
 *
 * @param incomeStatement - Income statement data
 * @param balanceSheet - Balance sheet data
 * @returns DuPont analysis components
 *
 * @example
 * const dupont = performDuPontAnalysis(is, bs);
 * // Returns: { roe: 0.15, netMargin: 0.10, assetTurnover: 1.5, equityMultiplier: 1.0 }
 */
export declare function performDuPontAnalysis(incomeStatement: IncomeStatement, balanceSheet: BalanceSheet): {
    roe: number;
    netMargin: number;
    assetTurnover: number;
    equityMultiplier: number;
};
//# sourceMappingURL=fundamental-analysis-kit.d.ts.map