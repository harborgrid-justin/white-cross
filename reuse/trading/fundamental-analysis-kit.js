"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateCurrentRatio = calculateCurrentRatio;
exports.calculateQuickRatio = calculateQuickRatio;
exports.calculateCashRatio = calculateCashRatio;
exports.calculateWorkingCapital = calculateWorkingCapital;
exports.calculateDebtToEquity = calculateDebtToEquity;
exports.calculateDebtRatio = calculateDebtRatio;
exports.calculateEquityMultiplier = calculateEquityMultiplier;
exports.calculateInterestCoverage = calculateInterestCoverage;
exports.calculateDebtServiceCoverage = calculateDebtServiceCoverage;
exports.calculateGrossProfitMargin = calculateGrossProfitMargin;
exports.calculateOperatingMargin = calculateOperatingMargin;
exports.calculateNetProfitMargin = calculateNetProfitMargin;
exports.calculateEBITDAMargin = calculateEBITDAMargin;
exports.calculateROA = calculateROA;
exports.calculateROE = calculateROE;
exports.calculateROIC = calculateROIC;
exports.calculateAssetTurnover = calculateAssetTurnover;
exports.calculateInventoryTurnover = calculateInventoryTurnover;
exports.calculateDSO = calculateDSO;
exports.calculateDPO = calculateDPO;
exports.calculateCashConversionCycle = calculateCashConversionCycle;
exports.calculateFreeCashFlow = calculateFreeCashFlow;
exports.calculateFCFE = calculateFCFE;
exports.calculateOCFRatio = calculateOCFRatio;
exports.calculateCashFlowToDebt = calculateCashFlowToDebt;
exports.calculateCashBurnRate = calculateCashBurnRate;
exports.calculateRunway = calculateRunway;
exports.calculatePERatio = calculatePERatio;
exports.calculatePBRatio = calculatePBRatio;
exports.calculateEVtoEBITDA = calculateEVtoEBITDA;
exports.calculatePSRatio = calculatePSRatio;
exports.calculatePEGRatio = calculatePEGRatio;
exports.calculatePriceToCashFlow = calculatePriceToCashFlow;
exports.calculateBasicEPS = calculateBasicEPS;
exports.calculateDilutedEPS = calculateDilutedEPS;
exports.calculateEarningsQuality = calculateEarningsQuality;
exports.calculateEarningsSurprise = calculateEarningsSurprise;
exports.calculateNormalizedEarnings = calculateNormalizedEarnings;
exports.calculateCoreEarnings = calculateCoreEarnings;
exports.calculateRevenueGrowth = calculateRevenueGrowth;
exports.calculateEarningsGrowth = calculateEarningsGrowth;
exports.calculateSustainableGrowthRate = calculateSustainableGrowthRate;
exports.calculateCAGR = calculateCAGR;
exports.projectFutureGrowth = projectFutureGrowth;
exports.calculateDCF = calculateDCF;
exports.calculateGordonGrowthModel = calculateGordonGrowthModel;
exports.calculateGrahamNumber = calculateGrahamNumber;
exports.calculateBenjaminGrahamIntrinsicValue = calculateBenjaminGrahamIntrinsicValue;
exports.calculateResidualIncomeModel = calculateResidualIncomeModel;
exports.calculateAssetBasedValuation = calculateAssetBasedValuation;
exports.calculateIndustryAverage = calculateIndustryAverage;
exports.calculateRelativeValuation = calculateRelativeValuation;
exports.analyzePeerComparison = analyzePeerComparison;
exports.calculateMarketCapWeightedAverage = calculateMarketCapWeightedAverage;
exports.calculateRealGDPGrowth = calculateRealGDPGrowth;
exports.adjustForInflation = adjustForInflation;
exports.calculateRealInterestRate = calculateRealInterestRate;
exports.analyzeCurrencyImpact = analyzeCurrencyImpact;
exports.calculateEmploymentCostImpact = calculateEmploymentCostImpact;
exports.analyzeInterestRateSensitivity = analyzeInterestRateSensitivity;
exports.calculateFinancialHealthScore = calculateFinancialHealthScore;
exports.performDuPontAnalysis = performDuPontAnalysis;
// ============================================================================
// Liquidity Ratios
// ============================================================================
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
function calculateCurrentRatio(balanceSheet) {
    if (balanceSheet.currentLiabilities <= 0) {
        throw new Error('Current liabilities must be positive');
    }
    return balanceSheet.currentAssets / balanceSheet.currentLiabilities;
}
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
function calculateQuickRatio(balanceSheet) {
    if (balanceSheet.currentLiabilities <= 0) {
        throw new Error('Current liabilities must be positive');
    }
    const quickAssets = balanceSheet.currentAssets - balanceSheet.inventory;
    return quickAssets / balanceSheet.currentLiabilities;
}
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
function calculateCashRatio(balanceSheet) {
    if (balanceSheet.currentLiabilities <= 0) {
        throw new Error('Current liabilities must be positive');
    }
    return balanceSheet.cash / balanceSheet.currentLiabilities;
}
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
function calculateWorkingCapital(balanceSheet) {
    return balanceSheet.currentAssets - balanceSheet.currentLiabilities;
}
// ============================================================================
// Leverage/Solvency Ratios
// ============================================================================
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
function calculateDebtToEquity(balanceSheet) {
    if (balanceSheet.shareholdersEquity <= 0) {
        throw new Error('Shareholders equity must be positive');
    }
    return balanceSheet.totalLiabilities / balanceSheet.shareholdersEquity;
}
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
function calculateDebtRatio(balanceSheet) {
    if (balanceSheet.totalAssets <= 0) {
        throw new Error('Total assets must be positive');
    }
    return balanceSheet.totalLiabilities / balanceSheet.totalAssets;
}
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
function calculateEquityMultiplier(balanceSheet) {
    if (balanceSheet.shareholdersEquity <= 0) {
        throw new Error('Shareholders equity must be positive');
    }
    return balanceSheet.totalAssets / balanceSheet.shareholdersEquity;
}
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
function calculateInterestCoverage(incomeStatement) {
    if (incomeStatement.interestExpense <= 0) {
        throw new Error('Interest expense must be positive');
    }
    return incomeStatement.operatingIncome / incomeStatement.interestExpense;
}
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
function calculateDebtServiceCoverage(operatingIncome, totalDebtService) {
    if (totalDebtService <= 0) {
        throw new Error('Total debt service must be positive');
    }
    return operatingIncome / totalDebtService;
}
// ============================================================================
// Profitability Ratios
// ============================================================================
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
function calculateGrossProfitMargin(incomeStatement) {
    if (incomeStatement.revenue <= 0) {
        throw new Error('Revenue must be positive');
    }
    const grossProfit = incomeStatement.revenue - incomeStatement.costOfGoodsSold;
    return grossProfit / incomeStatement.revenue;
}
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
function calculateOperatingMargin(incomeStatement) {
    if (incomeStatement.revenue <= 0) {
        throw new Error('Revenue must be positive');
    }
    return incomeStatement.operatingIncome / incomeStatement.revenue;
}
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
function calculateNetProfitMargin(incomeStatement) {
    if (incomeStatement.revenue <= 0) {
        throw new Error('Revenue must be positive');
    }
    return incomeStatement.netIncome / incomeStatement.revenue;
}
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
function calculateEBITDAMargin(incomeStatement) {
    if (incomeStatement.revenue <= 0) {
        throw new Error('Revenue must be positive');
    }
    const ebitda = incomeStatement.operatingIncome +
        (incomeStatement.depreciationAmortization || 0);
    return ebitda / incomeStatement.revenue;
}
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
function calculateROA(incomeStatement, balanceSheet) {
    if (balanceSheet.totalAssets <= 0) {
        throw new Error('Total assets must be positive');
    }
    return incomeStatement.netIncome / balanceSheet.totalAssets;
}
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
function calculateROE(incomeStatement, balanceSheet) {
    if (balanceSheet.shareholdersEquity <= 0) {
        throw new Error('Shareholders equity must be positive');
    }
    return incomeStatement.netIncome / balanceSheet.shareholdersEquity;
}
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
function calculateROIC(incomeStatement, balanceSheet, taxRate) {
    const nopat = incomeStatement.operatingIncome * (1 - taxRate);
    const investedCapital = balanceSheet.shareholdersEquity + balanceSheet.longTermDebt;
    if (investedCapital <= 0) {
        throw new Error('Invested capital must be positive');
    }
    return nopat / investedCapital;
}
// ============================================================================
// Efficiency Ratios
// ============================================================================
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
function calculateAssetTurnover(incomeStatement, balanceSheet) {
    if (balanceSheet.totalAssets <= 0) {
        throw new Error('Total assets must be positive');
    }
    return incomeStatement.revenue / balanceSheet.totalAssets;
}
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
function calculateInventoryTurnover(incomeStatement, balanceSheet) {
    if (balanceSheet.inventory <= 0) {
        throw new Error('Inventory must be positive');
    }
    return incomeStatement.costOfGoodsSold / balanceSheet.inventory;
}
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
function calculateDSO(balanceSheet, revenue, daysInPeriod = 365) {
    if (revenue <= 0) {
        throw new Error('Revenue must be positive');
    }
    const dailyRevenue = revenue / daysInPeriod;
    return balanceSheet.accountsReceivable / dailyRevenue;
}
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
function calculateDPO(balanceSheet, costOfGoodsSold, daysInPeriod = 365) {
    if (costOfGoodsSold <= 0) {
        throw new Error('Cost of goods sold must be positive');
    }
    const dailyCOGS = costOfGoodsSold / daysInPeriod;
    return balanceSheet.accountsPayable / dailyCOGS;
}
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
function calculateCashConversionCycle(incomeStatement, balanceSheet, daysInPeriod = 365) {
    const dso = calculateDSO(balanceSheet, incomeStatement.revenue, daysInPeriod);
    const dio = (balanceSheet.inventory / incomeStatement.costOfGoodsSold) * daysInPeriod;
    const dpo = calculateDPO(balanceSheet, incomeStatement.costOfGoodsSold, daysInPeriod);
    return dso + dio - dpo;
}
// ============================================================================
// Cash Flow Analysis
// ============================================================================
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
function calculateFreeCashFlow(cashFlowStatement) {
    return cashFlowStatement.operatingCashFlow - cashFlowStatement.capitalExpenditures;
}
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
function calculateFCFE(cashFlowStatement, netBorrowing) {
    const fcf = calculateFreeCashFlow(cashFlowStatement);
    return fcf + netBorrowing;
}
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
function calculateOCFRatio(cashFlowStatement, currentLiabilities) {
    if (currentLiabilities <= 0) {
        throw new Error('Current liabilities must be positive');
    }
    return cashFlowStatement.operatingCashFlow / currentLiabilities;
}
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
function calculateCashFlowToDebt(cashFlowStatement, totalDebt) {
    if (totalDebt <= 0) {
        throw new Error('Total debt must be positive');
    }
    return cashFlowStatement.operatingCashFlow / totalDebt;
}
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
function calculateCashBurnRate(beginningCash, endingCash, numberOfMonths) {
    if (numberOfMonths <= 0) {
        throw new Error('Number of months must be positive');
    }
    return Math.abs(endingCash - beginningCash) / numberOfMonths;
}
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
function calculateRunway(currentCash, monthlyBurnRate) {
    if (monthlyBurnRate <= 0) {
        throw new Error('Monthly burn rate must be positive');
    }
    return currentCash / monthlyBurnRate;
}
// ============================================================================
// Valuation Multiples
// ============================================================================
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
function calculatePERatio(stockPrice, earningsPerShare) {
    if (earningsPerShare <= 0) {
        throw new Error('Earnings per share must be positive');
    }
    return stockPrice / earningsPerShare;
}
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
function calculatePBRatio(stockPrice, bookValuePerShare) {
    if (bookValuePerShare <= 0) {
        throw new Error('Book value per share must be positive');
    }
    return stockPrice / bookValuePerShare;
}
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
function calculateEVtoEBITDA(marketData, incomeStatement, totalDebt, cash) {
    const marketCap = marketData.marketCap ||
        (marketData.stockPrice * marketData.sharesOutstanding);
    const enterpriseValue = marketCap + totalDebt - cash;
    const ebitda = incomeStatement.operatingIncome +
        (incomeStatement.depreciationAmortization || 0);
    if (ebitda <= 0) {
        throw new Error('EBITDA must be positive');
    }
    return enterpriseValue / ebitda;
}
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
function calculatePSRatio(marketCap, revenue) {
    if (revenue <= 0) {
        throw new Error('Revenue must be positive');
    }
    return marketCap / revenue;
}
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
function calculatePEGRatio(peRatio, earningsGrowthRate) {
    if (earningsGrowthRate <= 0) {
        throw new Error('Earnings growth rate must be positive');
    }
    return peRatio / earningsGrowthRate;
}
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
function calculatePriceToCashFlow(marketCap, operatingCashFlow) {
    if (operatingCashFlow <= 0) {
        throw new Error('Operating cash flow must be positive');
    }
    return marketCap / operatingCashFlow;
}
// ============================================================================
// Earnings Analysis
// ============================================================================
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
function calculateBasicEPS(netIncome, sharesOutstanding) {
    if (sharesOutstanding <= 0) {
        throw new Error('Shares outstanding must be positive');
    }
    return netIncome / sharesOutstanding;
}
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
function calculateDilutedEPS(netIncome, sharesOutstanding, dilutiveShares) {
    const totalShares = sharesOutstanding + dilutiveShares;
    if (totalShares <= 0) {
        throw new Error('Total shares must be positive');
    }
    return netIncome / totalShares;
}
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
function calculateEarningsQuality(netIncome, operatingCashFlow) {
    if (netIncome <= 0) {
        throw new Error('Net income must be positive for quality calculation');
    }
    return operatingCashFlow / netIncome;
}
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
function calculateEarningsSurprise(actualEPS, expectedEPS) {
    if (expectedEPS === 0) {
        throw new Error('Expected EPS cannot be zero');
    }
    return ((actualEPS - expectedEPS) / Math.abs(expectedEPS)) * 100;
}
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
function calculateNormalizedEarnings(reportedEarnings, oneTimeItems) {
    const totalOneTimeItems = oneTimeItems.reduce((sum, item) => sum + item, 0);
    return reportedEarnings - totalOneTimeItems;
}
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
function calculateCoreEarnings(operatingIncome, interestExpense, taxRate) {
    const ebt = operatingIncome - interestExpense;
    return ebt * (1 - taxRate);
}
// ============================================================================
// Growth Analysis
// ============================================================================
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
function calculateRevenueGrowth(currentRevenue, previousRevenue) {
    if (previousRevenue <= 0) {
        throw new Error('Previous revenue must be positive');
    }
    return ((currentRevenue - previousRevenue) / previousRevenue) * 100;
}
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
function calculateEarningsGrowth(currentEarnings, previousEarnings) {
    if (previousEarnings <= 0) {
        throw new Error('Previous earnings must be positive');
    }
    return ((currentEarnings - previousEarnings) / previousEarnings) * 100;
}
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
function calculateSustainableGrowthRate(roe, retentionRatio) {
    if (retentionRatio < 0 || retentionRatio > 1) {
        throw new Error('Retention ratio must be between 0 and 1');
    }
    return (roe * retentionRatio) * 100;
}
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
function calculateCAGR(beginningValue, endingValue, numberOfYears) {
    if (beginningValue <= 0) {
        throw new Error('Beginning value must be positive');
    }
    if (endingValue <= 0) {
        throw new Error('Ending value must be positive');
    }
    if (numberOfYears <= 0) {
        throw new Error('Number of years must be positive');
    }
    return (Math.pow(endingValue / beginningValue, 1 / numberOfYears) - 1) * 100;
}
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
function projectFutureGrowth(currentValue, growthRate, numberOfYears) {
    if (numberOfYears < 0) {
        throw new Error('Number of years cannot be negative');
    }
    return currentValue * Math.pow(1 + growthRate, numberOfYears);
}
// ============================================================================
// Valuation Models
// ============================================================================
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
function calculateDCF(params) {
    if (params.wacc <= params.terminalGrowthRate) {
        throw new Error('WACC must be greater than terminal growth rate');
    }
    if (params.projectedFCF.length === 0) {
        throw new Error('Projected FCF array cannot be empty');
    }
    if (params.sharesOutstanding <= 0) {
        throw new Error('Shares outstanding must be positive');
    }
    // Calculate present value of projected cash flows
    let pvProjectedCashFlows = 0;
    for (let i = 0; i < params.projectedFCF.length; i++) {
        const discountFactor = Math.pow(1 + params.wacc, i + 1);
        pvProjectedCashFlows += params.projectedFCF[i] / discountFactor;
    }
    // Calculate terminal value
    const finalYearFCF = params.projectedFCF[params.projectedFCF.length - 1];
    const terminalFCF = finalYearFCF * (1 + params.terminalGrowthRate);
    const terminalValue = terminalFCF / (params.wacc - params.terminalGrowthRate);
    // Discount terminal value to present
    const terminalDiscountFactor = Math.pow(1 + params.wacc, params.projectedFCF.length);
    const pvTerminalValue = terminalValue / terminalDiscountFactor;
    // Calculate enterprise value and equity value
    const enterpriseValue = pvProjectedCashFlows + pvTerminalValue;
    const equityValue = enterpriseValue + params.cash - params.totalDebt;
    const valuePerShare = equityValue / params.sharesOutstanding;
    return {
        baseValue: equityValue,
        valuePerShare: valuePerShare,
        confidence: 'medium'
    };
}
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
function calculateGordonGrowthModel(nextYearDividend, requiredReturn, growthRate) {
    if (requiredReturn <= growthRate) {
        throw new Error('Required return must be greater than growth rate');
    }
    if (nextYearDividend < 0) {
        throw new Error('Dividend cannot be negative');
    }
    return nextYearDividend / (requiredReturn - growthRate);
}
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
function calculateGrahamNumber(eps, bookValuePerShare) {
    if (eps <= 0) {
        throw new Error('EPS must be positive');
    }
    if (bookValuePerShare <= 0) {
        throw new Error('Book value per share must be positive');
    }
    return Math.sqrt(22.5 * eps * bookValuePerShare);
}
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
function calculateBenjaminGrahamIntrinsicValue(eps, growthRate, bondYield = 4.4) {
    if (eps <= 0) {
        throw new Error('EPS must be positive');
    }
    if (bondYield <= 0) {
        throw new Error('Bond yield must be positive');
    }
    return (eps * (8.5 + 2 * growthRate) * 4.4) / bondYield;
}
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
function calculateResidualIncomeModel(bookValue, projectedRI, requiredReturn) {
    if (requiredReturn <= 0) {
        throw new Error('Required return must be positive');
    }
    let pvResidualIncome = 0;
    for (let i = 0; i < projectedRI.length; i++) {
        const discountFactor = Math.pow(1 + requiredReturn, i + 1);
        pvResidualIncome += projectedRI[i] / discountFactor;
    }
    return bookValue + pvResidualIncome;
}
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
function calculateAssetBasedValuation(totalAssets, totalLiabilities, assetRecoveryRate = 0.70) {
    if (assetRecoveryRate < 0 || assetRecoveryRate > 1) {
        throw new Error('Asset recovery rate must be between 0 and 1');
    }
    const recoveredAssets = totalAssets * assetRecoveryRate;
    return Math.max(0, recoveredAssets - totalLiabilities);
}
// ============================================================================
// Comparable Company Analysis
// ============================================================================
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
function calculateIndustryAverage(peers, multiple) {
    if (peers.length === 0) {
        throw new Error('Peers array cannot be empty');
    }
    const values = peers.map(p => p[multiple]).filter(v => typeof v === 'number');
    if (values.length === 0) {
        throw new Error(`No valid ${String(multiple)} values found in peers`);
    }
    const sum = values.reduce((acc, val) => acc + val, 0);
    return sum / values.length;
}
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
function calculateRelativeValuation(companyMetric, peerMultiple) {
    if (companyMetric < 0) {
        throw new Error('Company metric cannot be negative');
    }
    if (peerMultiple < 0) {
        throw new Error('Peer multiple cannot be negative');
    }
    return companyMetric * peerMultiple;
}
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
function analyzePeerComparison(companyMetric, peerMetrics) {
    if (peerMetrics.length === 0) {
        throw new Error('Peer metrics array cannot be empty');
    }
    const sorted = [...peerMetrics].sort((a, b) => a - b);
    const average = peerMetrics.reduce((sum, val) => sum + val, 0) / peerMetrics.length;
    const medianIndex = Math.floor(sorted.length / 2);
    const median = sorted.length % 2 === 0
        ? (sorted[medianIndex - 1] + sorted[medianIndex]) / 2
        : sorted[medianIndex];
    const belowCount = sorted.filter(v => v < companyMetric).length;
    const percentile = (belowCount / sorted.length) * 100;
    return {
        percentile,
        aboveAverage: companyMetric > average,
        aboveMedian: companyMetric > median,
        peerAverage: average,
        peerMedian: median
    };
}
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
function calculateMarketCapWeightedAverage(peers, multiple) {
    if (peers.length === 0) {
        throw new Error('Peers array cannot be empty');
    }
    let weightedSum = 0;
    let totalWeight = 0;
    for (const peer of peers) {
        const multipleValue = peer[multiple];
        if (typeof multipleValue === 'number' && typeof peer.marketCap === 'number') {
            weightedSum += multipleValue * peer.marketCap;
            totalWeight += peer.marketCap;
        }
    }
    if (totalWeight === 0) {
        throw new Error('Total market cap weight is zero');
    }
    return weightedSum / totalWeight;
}
// ============================================================================
// Economic Indicators
// ============================================================================
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
function calculateRealGDPGrowth(nominalGDPGrowth, inflationRate) {
    return ((1 + nominalGDPGrowth / 100) / (1 + inflationRate / 100) - 1) * 100;
}
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
function adjustForInflation(nominalValue, inflationRate, years) {
    return nominalValue / Math.pow(1 + inflationRate, years);
}
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
function calculateRealInterestRate(nominalRate, inflationRate) {
    return ((1 + nominalRate / 100) / (1 + inflationRate / 100) - 1) * 100;
}
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
function analyzeCurrencyImpact(foreignRevenue, previousExchangeRate, currentExchangeRate) {
    if (previousExchangeRate <= 0 || currentExchangeRate <= 0) {
        throw new Error('Exchange rates must be positive');
    }
    const previousValue = foreignRevenue / previousExchangeRate;
    const currentValue = foreignRevenue / currentExchangeRate;
    return currentValue - previousValue;
}
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
function calculateEmploymentCostImpact(currentEmployees, averageSalary, salaryGrowthRate, headcountGrowth) {
    const newEmployees = currentEmployees * (1 + headcountGrowth);
    const newSalary = averageSalary * (1 + salaryGrowthRate);
    const currentCost = currentEmployees * averageSalary;
    const newCost = newEmployees * newSalary;
    return newCost - currentCost;
}
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
function analyzeInterestRateSensitivity(variableRateDebt, rateChange) {
    return variableRateDebt * rateChange;
}
// ============================================================================
// Comprehensive Analysis
// ============================================================================
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
function calculateFinancialHealthScore(balanceSheet, incomeStatement, cashFlowStatement) {
    // Liquidity score (0-100)
    const currentRatio = calculateCurrentRatio(balanceSheet);
    const quickRatio = calculateQuickRatio(balanceSheet);
    const liquidityScore = Math.min(100, (currentRatio * 30 + quickRatio * 20));
    // Solvency score (0-100)
    const debtToEquity = calculateDebtToEquity(balanceSheet);
    const interestCoverage = calculateInterestCoverage(incomeStatement);
    const solvencyScore = Math.min(100, Math.max(0, 100 - debtToEquity * 20 + interestCoverage * 5));
    // Profitability score (0-100)
    const netMargin = calculateNetProfitMargin(incomeStatement);
    const roe = calculateROE(incomeStatement, balanceSheet);
    const profitabilityScore = Math.min(100, (netMargin * 200 + roe * 200));
    // Efficiency score (0-100)
    const assetTurnover = calculateAssetTurnover(incomeStatement, balanceSheet);
    const efficiencyScore = Math.min(100, assetTurnover * 50);
    // Overall score
    const overallScore = (liquidityScore + solvencyScore + profitabilityScore + efficiencyScore) / 4;
    // Determine rating
    let rating;
    if (overallScore >= 80)
        rating = 'Excellent';
    else if (overallScore >= 60)
        rating = 'Good';
    else if (overallScore >= 40)
        rating = 'Fair';
    else if (overallScore >= 20)
        rating = 'Poor';
    else
        rating = 'Critical';
    return {
        score: Math.round(overallScore),
        liquidity: Math.round(liquidityScore),
        solvency: Math.round(solvencyScore),
        profitability: Math.round(profitabilityScore),
        efficiency: Math.round(efficiencyScore),
        rating
    };
}
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
function performDuPontAnalysis(incomeStatement, balanceSheet) {
    const netMargin = calculateNetProfitMargin(incomeStatement);
    const assetTurnover = calculateAssetTurnover(incomeStatement, balanceSheet);
    const equityMultiplier = calculateEquityMultiplier(balanceSheet);
    const roe = netMargin * assetTurnover * equityMultiplier;
    return {
        roe,
        netMargin,
        assetTurnover,
        equityMultiplier
    };
}
//# sourceMappingURL=fundamental-analysis-kit.js.map