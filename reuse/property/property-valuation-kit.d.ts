/**
 * LOC: P0R1V2A3L4
 * File: /reuse/property/property-valuation-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v11.1.8)
 *   - @nestjs/swagger (v8.0.5)
 *   - sequelize-typescript (v2.1.6)
 *   - sequelize (v6.37.1)
 *   - rxjs (v7.8.1)
 *   - decimal.js (v10.4.3)
 *
 * DOWNSTREAM (imported by):
 *   - Property appraisal services
 *   - Real estate valuation modules
 *   - Investment analysis dashboards
 *   - Asset management services
 *   - Financial reporting systems
 */
import Decimal from 'decimal.js';
/**
 * Property valuation method enumeration
 */
export declare enum ValuationMethod {
    SALES_COMPARISON = "sales_comparison",
    INCOME_APPROACH = "income_approach",
    COST_APPROACH = "cost_approach",
    DISCOUNTED_CASH_FLOW = "discounted_cash_flow",
    AUTOMATED_VALUATION = "automated_valuation",
    HYBRID = "hybrid"
}
/**
 * Property condition rating
 */
export declare enum PropertyCondition {
    EXCELLENT = "excellent",
    VERY_GOOD = "very_good",
    GOOD = "good",
    FAIR = "fair",
    POOR = "poor",
    VERY_POOR = "very_poor"
}
/**
 * Appraisal purpose enumeration
 */
export declare enum AppraisalPurpose {
    PURCHASE = "purchase",
    SALE = "sale",
    FINANCING = "financing",
    INSURANCE = "insurance",
    TAXATION = "taxation",
    PORTFOLIO_REVIEW = "portfolio_review",
    LITIGATION = "litigation",
    PARTNERSHIP_DISSOLUTION = "partnership_dissolution"
}
/**
 * Market condition enumeration
 */
export declare enum MarketCondition {
    SELLERS_MARKET = "sellers_market",
    BUYERS_MARKET = "buyers_market",
    BALANCED = "balanced",
    DECLINING = "declining",
    APPRECIATING = "appreciating"
}
/**
 * Depreciation type enumeration
 */
export declare enum DepreciationType {
    PHYSICAL = "physical",
    FUNCTIONAL = "functional",
    EXTERNAL = "external",
    ECONOMIC = "economic"
}
/**
 * Property valuation data
 */
export interface PropertyValuation {
    valuationId: string;
    propertyId: string;
    tenantId: string;
    valuationDate: Date;
    effectiveDate: Date;
    method: ValuationMethod;
    purpose: AppraisalPurpose;
    estimatedValue: Decimal;
    lowValue?: Decimal;
    highValue?: Decimal;
    confidenceLevel: number;
    appraiserId: string;
    appraiserLicense?: string;
    inspectionDate?: Date;
    reportDate: Date;
    expirationDate?: Date;
    assumptions?: string[];
    limitingConditions?: string[];
    metadata?: Record<string, any>;
}
/**
 * Comparable property data
 */
export interface ComparableProperty {
    comparableId: string;
    propertyId: string;
    address: string;
    propertyType: string;
    squareFeet: number;
    yearBuilt: number;
    saleDate: Date;
    salePrice: Decimal;
    condition: PropertyCondition;
    location: {
        latitude: number;
        longitude: number;
        zipCode: string;
        neighborhood: string;
    };
    features: {
        bedrooms?: number;
        bathrooms?: number;
        parkingSpaces?: number;
        stories?: number;
        lotSize?: number;
        [key: string]: any;
    };
    pricePerSquareFoot: Decimal;
    distanceFromSubject?: number;
    similarityScore?: number;
}
/**
 * Valuation adjustments
 */
export interface ValuationAdjustment {
    adjustmentId: string;
    category: string;
    description: string;
    type: 'percentage' | 'dollar_amount';
    value: Decimal;
    rationale: string;
    source?: string;
    confidence: number;
}
/**
 * Sales comparison approach data
 */
export interface SalesComparisonApproach {
    subjectPropertyId: string;
    comparables: ComparableProperty[];
    adjustments: {
        comparableId: string;
        adjustments: ValuationAdjustment[];
        totalAdjustment: Decimal;
        adjustedPrice: Decimal;
        adjustedPricePerSF: Decimal;
    }[];
    indicatedValue: Decimal;
    valueRange: {
        low: Decimal;
        high: Decimal;
    };
    reconciliation: string;
}
/**
 * Income approach data
 */
export interface IncomeApproach {
    propertyId: string;
    grossScheduledIncome: Decimal;
    vacancyRate: number;
    effectiveGrossIncome: Decimal;
    operatingExpenses: {
        category: string;
        amount: Decimal;
    }[];
    totalOperatingExpenses: Decimal;
    netOperatingIncome: Decimal;
    capitalizationRate: Decimal;
    indicatedValue: Decimal;
    grossIncomeMultiplier?: Decimal;
    cashOnCashReturn?: Decimal;
}
/**
 * Cost approach data
 */
export interface CostApproach {
    propertyId: string;
    landValue: Decimal;
    improvementCosts: {
        category: string;
        description: string;
        unitCost: Decimal;
        quantity: number;
        totalCost: Decimal;
    }[];
    totalImprovementCost: Decimal;
    depreciation: {
        type: DepreciationType;
        amount: Decimal;
        percentage: number;
        rationale: string;
    }[];
    totalDepreciation: Decimal;
    depreciatedImprovementValue: Decimal;
    indicatedValue: Decimal;
    effectiveAge: number;
    economicLife: number;
}
/**
 * Automated valuation model (AVM) result
 */
export interface AVMResult {
    valuationId: string;
    propertyId: string;
    modelName: string;
    modelVersion: string;
    estimatedValue: Decimal;
    confidenceScore: number;
    forecastStandardDeviation: Decimal;
    valueRange: {
        low: Decimal;
        high: Decimal;
    };
    comparableCount: number;
    dataQualityScore: number;
    lastUpdated: Date;
    factors: {
        factor: string;
        weight: number;
        contribution: Decimal;
    }[];
}
/**
 * Market trend analysis
 */
export interface MarketTrendAnalysis {
    market: string;
    propertyType: string;
    period: {
        start: Date;
        end: Date;
    };
    medianPrice: Decimal;
    averagePrice: Decimal;
    pricePerSquareFoot: Decimal;
    salesVolume: number;
    averageDaysOnMarket: number;
    inventoryLevels: number;
    absorptionRate: number;
    priceAppreciation: number;
    marketCondition: MarketCondition;
    forecast: {
        period: string;
        projectedMedianPrice: Decimal;
        projectedAppreciation: number;
        confidence: number;
    }[];
}
/**
 * Appraisal report data
 */
export interface AppraisalReport {
    reportId: string;
    propertyId: string;
    tenantId: string;
    reportDate: Date;
    effectiveDate: Date;
    purpose: AppraisalPurpose;
    appraiser: {
        name: string;
        license: string;
        company: string;
        contact: string;
    };
    propertyDescription: {
        address: string;
        legalDescription: string;
        propertyType: string;
        squareFeet: number;
        yearBuilt: number;
        condition: PropertyCondition;
        zoning: string;
    };
    valuations: {
        method: ValuationMethod;
        indicatedValue: Decimal;
        weight: number;
    }[];
    finalReconciliation: {
        finalValue: Decimal;
        reconciliationRationale: string;
        effectiveDate: Date;
        expirationDate: Date;
    };
    attachments?: {
        type: string;
        filename: string;
        url: string;
    }[];
    certification: string;
    assumptions: string[];
    limitingConditions: string[];
}
/**
 * Valuation history record
 */
export interface ValuationHistory {
    propertyId: string;
    valuations: {
        valuationId: string;
        valuationDate: Date;
        effectiveDate: Date;
        method: ValuationMethod;
        estimatedValue: Decimal;
        appraiserId: string;
        purpose: AppraisalPurpose;
    }[];
    trends: {
        period: string;
        averageValue: Decimal;
        changePercentage: number;
        volatility: number;
    }[];
}
/**
 * Regression analysis data
 */
export interface RegressionAnalysis {
    modelId: string;
    dependentVariable: string;
    independentVariables: string[];
    sampleSize: number;
    rSquared: number;
    adjustedRSquared: number;
    standardError: Decimal;
    coefficients: {
        variable: string;
        coefficient: Decimal;
        standardError: Decimal;
        tStatistic: number;
        pValue: number;
        significance: boolean;
    }[];
    prediction: {
        value: Decimal;
        confidenceInterval: {
            lower: Decimal;
            upper: Decimal;
            level: number;
        };
    };
}
/**
 * Conducts comprehensive property appraisal using multiple methods.
 *
 * @param {string} propertyId - Property identifier
 * @param {AppraisalPurpose} purpose - Appraisal purpose
 * @param {Date} effectiveDate - Effective date of valuation
 * @returns {Promise<PropertyValuation>} Comprehensive valuation result
 *
 * @example
 * ```typescript
 * const valuation = await conductPropertyAppraisal(
 *   'prop-123',
 *   AppraisalPurpose.PURCHASE,
 *   new Date()
 * );
 * console.log('Estimated value:', valuation.estimatedValue.toString());
 * ```
 */
export declare function conductPropertyAppraisal(propertyId: string, purpose: AppraisalPurpose, effectiveDate: Date): Promise<PropertyValuation>;
/**
 * Performs sales comparison approach valuation.
 *
 * @param {string} propertyId - Property identifier
 * @param {Date} effectiveDate - Effective date of valuation
 * @returns {Promise<SalesComparisonApproach>} Sales comparison analysis
 *
 * @example
 * ```typescript
 * const analysis = await performSalesComparisonApproach('prop-123', new Date());
 * console.log('Indicated value:', analysis.indicatedValue.toString());
 * ```
 */
export declare function performSalesComparisonApproach(propertyId: string, effectiveDate: Date): Promise<SalesComparisonApproach>;
/**
 * Performs income approach valuation with cap rate analysis.
 *
 * @param {string} propertyId - Property identifier
 * @param {Date} effectiveDate - Effective date of valuation
 * @returns {Promise<IncomeApproach>} Income approach analysis
 *
 * @example
 * ```typescript
 * const analysis = await performIncomeApproach('prop-123', new Date());
 * console.log('NOI:', analysis.netOperatingIncome.toString());
 * console.log('Cap rate:', analysis.capitalizationRate.toString());
 * ```
 */
export declare function performIncomeApproach(propertyId: string, effectiveDate: Date): Promise<IncomeApproach>;
/**
 * Performs cost approach valuation with depreciation analysis.
 *
 * @param {string} propertyId - Property identifier
 * @param {Date} effectiveDate - Effective date of valuation
 * @returns {Promise<CostApproach>} Cost approach analysis
 *
 * @example
 * ```typescript
 * const analysis = await performCostApproach('prop-123', new Date());
 * console.log('Replacement cost:', analysis.totalImprovementCost.toString());
 * console.log('Depreciation:', analysis.totalDepreciation.toString());
 * ```
 */
export declare function performCostApproach(propertyId: string, effectiveDate: Date): Promise<CostApproach>;
/**
 * Calculates property depreciation using multiple methods.
 *
 * @param {object} propertyData - Property data
 * @param {number} effectiveAge - Effective age in years
 * @param {number} economicLife - Economic life in years
 * @param {Decimal} replacementCost - Total replacement cost
 * @returns {Array<object>} Depreciation breakdown by type
 *
 * @example
 * ```typescript
 * const depreciation = calculateDepreciation(property, 15, 50, new Decimal(5000000));
 * console.log('Total depreciation:', depreciation.reduce((s, d) => s.plus(d.amount), new Decimal(0)));
 * ```
 */
export declare function calculateDepreciation(propertyData: any, effectiveAge: number, economicLife: number, replacementCost: Decimal): Array<{
    type: DepreciationType;
    amount: Decimal;
    percentage: number;
    rationale: string;
}>;
/**
 * Finds comparable properties for sales comparison approach.
 *
 * @param {string} propertyId - Subject property identifier
 * @param {Date} effectiveDate - Effective date of valuation
 * @param {number} maxComparables - Maximum number of comparables to return
 * @returns {Promise<ComparableProperty[]>} List of comparable properties
 *
 * @example
 * ```typescript
 * const comparables = await findComparableProperties('prop-123', new Date(), 5);
 * console.log(`Found ${comparables.length} comparable properties`);
 * ```
 */
export declare function findComparableProperties(propertyId: string, effectiveDate: Date, maxComparables?: number): Promise<ComparableProperty[]>;
/**
 * Calculates similarity score between subject and comparable property.
 *
 * @param {object} subjectProperty - Subject property data
 * @param {ComparableProperty} comparable - Comparable property data
 * @returns {number} Similarity score (0-100)
 *
 * @example
 * ```typescript
 * const score = calculateSimilarityScore(subject, comparable);
 * console.log(`Similarity score: ${score}`);
 * ```
 */
export declare function calculateSimilarityScore(subjectProperty: any, comparable: ComparableProperty): number;
/**
 * Calculates adjustments for comparable property differences.
 *
 * @param {object} subjectProperty - Subject property data
 * @param {ComparableProperty} comparable - Comparable property data
 * @returns {ValuationAdjustment[]} List of adjustments
 *
 * @example
 * ```typescript
 * const adjustments = calculatePropertyAdjustments(subject, comparable);
 * const totalAdj = adjustments.reduce((sum, adj) => sum.plus(adj.value), new Decimal(0));
 * ```
 */
export declare function calculatePropertyAdjustments(subjectProperty: any, comparable: ComparableProperty): ValuationAdjustment[];
/**
 * Analyzes comparable sales trends over time.
 *
 * @param {string} propertyType - Property type
 * @param {string} location - Location identifier
 * @param {number} months - Number of months to analyze
 * @returns {Promise<object>} Sales trend analysis
 *
 * @example
 * ```typescript
 * const trends = await analyzeComparableSalesTrends('hospital', 'zip-12345', 12);
 * console.log('Price trend:', trends.priceTrend);
 * ```
 */
export declare function analyzeComparableSalesTrends(propertyType: string, location: string, months?: number): Promise<object>;
/**
 * Calculates net operating income (NOI) for income-producing property.
 *
 * @param {string} propertyId - Property identifier
 * @param {number} year - Fiscal year
 * @returns {Promise<Decimal>} Net operating income
 *
 * @example
 * ```typescript
 * const noi = await calculateNetOperatingIncome('prop-123', 2024);
 * console.log('NOI:', noi.toString());
 * ```
 */
export declare function calculateNetOperatingIncome(propertyId: string, year: number): Promise<Decimal>;
/**
 * Calculates market capitalization rate for property type and location.
 *
 * @param {string} propertyType - Property type
 * @param {object} location - Location data
 * @returns {Promise<Decimal>} Market cap rate
 *
 * @example
 * ```typescript
 * const capRate = await calculateMarketCapRate('medical_office', { zipCode: '12345' });
 * console.log('Cap rate:', capRate.mul(100).toFixed(2) + '%');
 * ```
 */
export declare function calculateMarketCapRate(propertyType: string, location: any): Promise<Decimal>;
/**
 * Performs discounted cash flow (DCF) analysis for property valuation.
 *
 * @param {string} propertyId - Property identifier
 * @param {number} holdingPeriod - Holding period in years
 * @param {Decimal} discountRate - Discount rate (IRR target)
 * @returns {Promise<object>} DCF analysis results
 *
 * @example
 * ```typescript
 * const dcf = await performDCFAnalysis('prop-123', 10, new Decimal(0.12));
 * console.log('Present value:', dcf.presentValue.toString());
 * ```
 */
export declare function performDCFAnalysis(propertyId: string, holdingPeriod?: number, discountRate?: Decimal): Promise<object>;
/**
 * Calculates gross income multiplier (GIM) for property.
 *
 * @param {Decimal} propertyValue - Property value
 * @param {Decimal} grossIncome - Annual gross income
 * @returns {Decimal} Gross income multiplier
 *
 * @example
 * ```typescript
 * const gim = calculateGrossIncomeMultiplier(new Decimal(5000000), new Decimal(500000));
 * console.log('GIM:', gim.toFixed(2));
 * ```
 */
export declare function calculateGrossIncomeMultiplier(propertyValue: Decimal, grossIncome: Decimal): Decimal;
/**
 * Calculates debt service coverage ratio (DSCR).
 *
 * @param {Decimal} netOperatingIncome - Annual NOI
 * @param {Decimal} annualDebtService - Annual debt service
 * @returns {Decimal} Debt service coverage ratio
 *
 * @example
 * ```typescript
 * const dscr = calculateDebtServiceCoverageRatio(new Decimal(500000), new Decimal(400000));
 * console.log('DSCR:', dscr.toFixed(2)); // 1.25
 * ```
 */
export declare function calculateDebtServiceCoverageRatio(netOperatingIncome: Decimal, annualDebtService: Decimal): Decimal;
/**
 * Estimates land value using comparable land sales.
 *
 * @param {string} propertyId - Property identifier
 * @param {Date} effectiveDate - Effective date of valuation
 * @returns {Promise<Decimal>} Estimated land value
 *
 * @example
 * ```typescript
 * const landValue = await estimateLandValue('prop-123', new Date());
 * console.log('Land value:', landValue.toString());
 * ```
 */
export declare function estimateLandValue(propertyId: string, effectiveDate: Date): Promise<Decimal>;
/**
 * Calculates replacement cost for property improvements.
 *
 * @param {object} propertyData - Property data
 * @returns {Promise<Array<object>>} Detailed cost breakdown
 *
 * @example
 * ```typescript
 * const costs = await calculateReplacementCost(propertyData);
 * const total = costs.reduce((sum, c) => sum.plus(c.totalCost), new Decimal(0));
 * ```
 */
export declare function calculateReplacementCost(propertyData: any): Promise<Array<{
    category: string;
    description: string;
    unitCost: Decimal;
    quantity: number;
    totalCost: Decimal;
}>>;
/**
 * Calculates accrued depreciation using all applicable methods.
 *
 * @param {string} propertyId - Property identifier
 * @param {Decimal} replacementCost - Total replacement cost
 * @returns {Promise<object>} Comprehensive depreciation analysis
 *
 * @example
 * ```typescript
 * const depreciation = await calculateAccruedDepreciation('prop-123', new Decimal(5000000));
 * console.log('Total depreciation:', depreciation.total.toString());
 * ```
 */
export declare function calculateAccruedDepreciation(propertyId: string, replacementCost: Decimal): Promise<object>;
/**
 * Performs regression analysis for property value estimation.
 *
 * @param {string} propertyType - Property type
 * @param {object} location - Location data
 * @param {object} propertyCharacteristics - Property characteristics
 * @returns {Promise<RegressionAnalysis>} Regression analysis results
 *
 * @example
 * ```typescript
 * const analysis = await performRegressionAnalysis('hospital', location, characteristics);
 * console.log('Predicted value:', analysis.prediction.value.toString());
 * ```
 */
export declare function performRegressionAnalysis(propertyType: string, location: any, propertyCharacteristics: any): Promise<RegressionAnalysis>;
/**
 * Estimates market value using weighted average of multiple approaches.
 *
 * @param {string} propertyId - Property identifier
 * @param {Date} effectiveDate - Effective date of valuation
 * @returns {Promise<Decimal>} Estimated market value
 *
 * @example
 * ```typescript
 * const marketValue = await estimateMarketValue('prop-123', new Date());
 * console.log('Market value:', marketValue.toString());
 * ```
 */
export declare function estimateMarketValue(propertyId: string, effectiveDate: Date): Promise<Decimal>;
/**
 * Calculates property value confidence interval.
 *
 * @param {Decimal} estimatedValue - Estimated property value
 * @param {number} standardError - Standard error of estimate
 * @param {number} confidenceLevel - Confidence level (e.g., 95)
 * @returns {object} Confidence interval
 *
 * @example
 * ```typescript
 * const interval = calculateValueConfidenceInterval(
 *   new Decimal(5000000),
 *   50000,
 *   95
 * );
 * console.log('Range:', interval.lower, '-', interval.upper);
 * ```
 */
export declare function calculateValueConfidenceInterval(estimatedValue: Decimal, standardError: number, confidenceLevel?: number): {
    lower: Decimal;
    upper: Decimal;
    level: number;
};
/**
 * Performs automated valuation using AVM algorithms.
 *
 * @param {string} propertyId - Property identifier
 * @param {string} modelName - AVM model name
 * @returns {Promise<AVMResult>} AVM valuation result
 *
 * @example
 * ```typescript
 * const avm = await performAutomatedValuation('prop-123', 'hedonic_pricing');
 * console.log('AVM value:', avm.estimatedValue.toString());
 * console.log('Confidence:', avm.confidenceScore);
 * ```
 */
export declare function performAutomatedValuation(propertyId: string, modelName?: string): Promise<AVMResult>;
/**
 * Performs hedonic pricing model valuation.
 *
 * @param {object} propertyData - Property data
 * @param {ComparableProperty[]} comparables - Comparable properties
 * @returns {object} Hedonic pricing result
 *
 * @example
 * ```typescript
 * const result = performHedonicPricing(property, comparables);
 * console.log('Value:', result.estimatedValue.toString());
 * ```
 */
export declare function performHedonicPricing(propertyData: any, comparables: ComparableProperty[]): {
    estimatedValue: Decimal;
    factors: Array<{
        factor: string;
        weight: number;
        contribution: Decimal;
    }>;
};
/**
 * Calculates AVM confidence score based on data availability and quality.
 *
 * @param {object} propertyData - Property data
 * @param {number} comparableCount - Number of comparables used
 * @returns {number} Confidence score (0-100)
 *
 * @example
 * ```typescript
 * const confidence = calculateAVMConfidence(property, 8);
 * console.log('Confidence score:', confidence);
 * ```
 */
export declare function calculateAVMConfidence(propertyData: any, comparableCount: number): number;
/**
 * Applies market conditions adjustment to property value.
 *
 * @param {Decimal} baseValue - Base property value
 * @param {MarketCondition} marketCondition - Current market condition
 * @param {number} monthsSinceComparable - Months since comparable sale
 * @returns {Decimal} Adjusted value
 *
 * @example
 * ```typescript
 * const adjusted = applyMarketConditionsAdjustment(
 *   new Decimal(5000000),
 *   MarketCondition.APPRECIATING,
 *   6
 * );
 * ```
 */
export declare function applyMarketConditionsAdjustment(baseValue: Decimal, marketCondition: MarketCondition, monthsSinceComparable: number): Decimal;
/**
 * Calculates location adjustment for property valuation.
 *
 * @param {object} subjectLocation - Subject property location
 * @param {object} comparableLocation - Comparable property location
 * @param {Decimal} comparableValue - Comparable property value
 * @returns {ValuationAdjustment} Location adjustment
 *
 * @example
 * ```typescript
 * const adjustment = calculateLocationAdjustment(
 *   subjectLocation,
 *   compLocation,
 *   new Decimal(5000000)
 * );
 * ```
 */
export declare function calculateLocationAdjustment(subjectLocation: any, comparableLocation: any, comparableValue: Decimal): ValuationAdjustment;
/**
 * Applies functional obsolescence adjustment.
 *
 * @param {object} propertyData - Property data
 * @param {Decimal} replacementCost - Replacement cost
 * @returns {ValuationAdjustment} Functional obsolescence adjustment
 *
 * @example
 * ```typescript
 * const adjustment = applyFunctionalObsolescenceAdjustment(
 *   property,
 *   new Decimal(5000000)
 * );
 * ```
 */
export declare function applyFunctionalObsolescenceAdjustment(propertyData: any, replacementCost: Decimal): ValuationAdjustment;
/**
 * Generates comprehensive appraisal report.
 *
 * @param {string} propertyId - Property identifier
 * @param {AppraisalPurpose} purpose - Appraisal purpose
 * @param {Date} effectiveDate - Effective date of appraisal
 * @returns {Promise<AppraisalReport>} Complete appraisal report
 *
 * @example
 * ```typescript
 * const report = await generateAppraisalReport(
 *   'prop-123',
 *   AppraisalPurpose.FINANCING,
 *   new Date()
 * );
 * console.log('Final value:', report.finalReconciliation.finalValue.toString());
 * ```
 */
export declare function generateAppraisalReport(propertyId: string, purpose: AppraisalPurpose, effectiveDate: Date): Promise<AppraisalReport>;
/**
 * Exports appraisal report to PDF format.
 *
 * @param {string} reportId - Report identifier
 * @returns {Promise<Buffer>} PDF report buffer
 *
 * @example
 * ```typescript
 * const pdf = await exportAppraisalReportToPDF('rpt-123');
 * await fs.writeFile('appraisal.pdf', pdf);
 * ```
 */
export declare function exportAppraisalReportToPDF(reportId: string): Promise<Buffer>;
/**
 * Retrieves complete valuation history for property.
 *
 * @param {string} propertyId - Property identifier
 * @returns {Promise<ValuationHistory>} Complete valuation history
 *
 * @example
 * ```typescript
 * const history = await getPropertyValuationHistory('prop-123');
 * console.log(`${history.valuations.length} valuations on record`);
 * ```
 */
export declare function getPropertyValuationHistory(propertyId: string): Promise<ValuationHistory>;
/**
 * Tracks property value changes over time.
 *
 * @param {string} propertyId - Property identifier
 * @param {number} years - Number of years to analyze
 * @returns {Promise<object>} Value change analysis
 *
 * @example
 * ```typescript
 * const changes = await trackPropertyValueChanges('prop-123', 5);
 * console.log('Total appreciation:', changes.totalAppreciation);
 * ```
 */
export declare function trackPropertyValueChanges(propertyId: string, years?: number): Promise<object>;
/**
 * Compares current valuation to historical values.
 *
 * @param {string} propertyId - Property identifier
 * @param {Decimal} currentValue - Current estimated value
 * @returns {Promise<object>} Historical comparison
 *
 * @example
 * ```typescript
 * const comparison = await compareToHistoricalValues('prop-123', new Decimal(5000000));
 * console.log('vs. historical average:', comparison.vsAverage);
 * ```
 */
export declare function compareToHistoricalValues(propertyId: string, currentValue: Decimal): Promise<object>;
/**
 * Analyzes market trends for property type and location.
 *
 * @param {string} propertyType - Property type
 * @param {string} market - Market identifier (zip, city, region)
 * @param {number} months - Number of months to analyze
 * @returns {Promise<MarketTrendAnalysis>} Market trend analysis
 *
 * @example
 * ```typescript
 * const trends = await analyzeMarketTrends('hospital', 'zip-12345', 24);
 * console.log('Price appreciation:', trends.priceAppreciation);
 * ```
 */
export declare function analyzeMarketTrends(propertyType: string, market: string, months?: number): Promise<MarketTrendAnalysis>;
/**
 * Forecasts future property values based on trends.
 *
 * @param {string} propertyId - Property identifier
 * @param {number} months - Number of months to forecast
 * @returns {Promise<Array<object>>} Value forecasts
 *
 * @example
 * ```typescript
 * const forecasts = await forecastPropertyValue('prop-123', 24);
 * console.log('24-month forecast:', forecasts[forecasts.length - 1].value);
 * ```
 */
export declare function forecastPropertyValue(propertyId: string, months?: number): Promise<Array<{
    month: Date;
    value: Decimal;
    confidence: number;
}>>;
/**
 * Identifies comparable market areas for benchmarking.
 *
 * @param {string} market - Market identifier
 * @param {string} propertyType - Property type
 * @returns {Promise<Array<object>>} Comparable markets
 *
 * @example
 * ```typescript
 * const markets = await identifyComparableMarkets('zip-12345', 'hospital');
 * console.log(`Found ${markets.length} comparable markets`);
 * ```
 */
export declare function identifyComparableMarkets(market: string, propertyType: string): Promise<Array<{
    market: string;
    similarityScore: number;
    medianPrice: Decimal;
    priceAppreciation: number;
}>>;
//# sourceMappingURL=property-valuation-kit.d.ts.map