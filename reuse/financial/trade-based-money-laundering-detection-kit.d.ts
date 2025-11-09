/**
 * Trade-Based Money Laundering (TBML) Detection Kit
 * Comprehensive detection engine for trade-based illicit financial flows
 * Covers 15+ risk categories with 40 detection functions
 * TypeScript + Sequelize + NestJS
 *
 * Risk Categories:
 * 1. Over/Under Invoicing (4 functions)
 * 2. Multiple Invoicing IDs (3 functions)
 * 3. Phantom Shipments (3 functions)
 * 4. Over/Under Shipping (3 functions)
 * 5. Commodity Price Variance (3 functions)
 * 6. Trade Route Anomalies (3 functions)
 * 7. Free Trade Zone Monitoring (3 functions)
 * 8. Dual-Use Goods Tracking (3 functions)
 * 9. HTSUS Code Analysis (3 functions)
 * 10. Counterparty Verification (3 functions)
 * 11. Trade Finance Red Flags (3 functions)
 * 12. Letter of Credit Scrutiny (3 functions)
 * 13. Bill of Lading Validation (3 functions)
 * 14. Value Transfer Schemes (3 functions)
 * 15. Cross-Border Trade Patterns (3 functions)
 */
interface TradeTransaction {
    id: string;
    exporterId: string;
    importerId: string;
    invoiceAmount: number;
    invoiceDate: Date;
    invoiceId: string;
    shipmentDate: Date;
    estimatedPrice: number;
    marketPrice: number;
    quantity: number;
    unit: string;
    commodity: string;
    htsCode: string;
    originCountry: string;
    destinationCountry: string;
    ftzCode?: string;
    lcNumber?: string;
    bolNumber?: string;
    route: string;
    paymentTerms: string;
    currency: string;
}
interface RiskFlag {
    category: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    riskScore: number;
    riskIndicators: string[];
    recommendation: string;
    timestamp: Date;
}
interface DetectionResult {
    transactionId: string;
    flagged: boolean;
    riskFlags: RiskFlag[];
    overallRiskScore: number;
    requiresInvestigation: boolean;
    reviewLevel: 'AUTOMATED' | 'MANUAL' | 'INVESTIGATION';
}
interface MarketComparison {
    commodity: string;
    expectedPrice: number;
    reportedPrice: number;
    variance: number;
    variancePercent: number;
    historicalAvg: number;
    marketData: Map<string, number>;
}
interface CounterpartyProfile {
    entityId: string;
    entityName: string;
    sanctionsStatus: boolean;
    pepsStatus: boolean;
    historicalCompliance: number;
    riskRating: string;
    previousViolations: number;
}
interface TradePatternMetrics {
    entityId: string;
    averageInvoiceAmount: number;
    standardDeviation: number;
    anomalousTransactions: number;
    frequencyPattern: string;
    geographicDiversity: number;
}
export declare class TradeBasedMoneyLaunderingDetectionKit {
    /**
     * Detects significant price deviations between invoice and market prices
     * Threshold: >15% variance considered suspicious
     */
    detectInvoicePriceAnomaly(invoiceAmount: number, marketPrice: number, quantity: number): RiskFlag | null;
    /**
     * Identifies systematic under-invoicing patterns (profit extraction indicator)
     * Flags transactions consistently below market rates
     */
    detectSystematicUnderInvoicing(transactions: TradeTransaction[], historyWindowDays?: number): DetectionResult;
    /**
     * Detects over-invoicing patterns (money injection indicators)
     * Flags transactions significantly above market value
     */
    detectOverInvoicing(invoiceAmount: number, quantity: number, historicalAvgPrice: number, commodityType: string): RiskFlag | null;
    /**
     * Cross-references invoice amounts across multiple documents (invoice, BOL, LC)
     * Detects discrepancies indicating potential fraud
     */
    validateInvoiceAmountConsistency(invoiceAmount: number, bolAmount: number, lcAmount: number, tolerance?: number): RiskFlag | null;
    /**
     * Detects multiple invoices for same shipment (splitting/layering indicator)
     */
    detectMultipleInvoicesPerShipment(transactions: TradeTransaction[], shipmentId: string): RiskFlag | null;
    /**
     * Identifies sequential/suspicious invoice ID patterns
     */
    detectSuspiciousInvoiceIdPatterns(invoiceIds: string[]): RiskFlag | null;
    /**
     * Detects duplicate invoice IDs across multiple transactions
     */
    detectDuplicateInvoiceIds(transactions: TradeTransaction[]): RiskFlag | null;
    /**
     * Identifies shipments with no matching bill of lading
     */
    detectPhantomShipments(invoices: TradeTransaction[], bolNumbers: Set<string>): RiskFlag | null;
    /**
     * Verifies shipment dates align with invoice and payment dates
     */
    validateShipmentDateChronology(invoiceDate: Date, shipmentDate: Date, paymentDate: Date): RiskFlag | null;
    /**
     * Cross-validates shipment quantity with invoice quantity
     */
    validateShipmentQuantityMatch(invoiceQuantity: number, shipmentQuantity: number, tolerance?: number): RiskFlag | null;
    /**
     * Identifies shipments significantly over/under contract quantities
     */
    detectShippingQuantityAnomalies(contractQuantity: number, shippedQuantity: number, commodityType: string): RiskFlag | null;
    /**
     * Analyzes shipping weight vs expected weight for commodity
     */
    validateShippingWeight(commodityType: string, declaredWeight: number, expectedWeightPerUnit: number, unitCount: number): RiskFlag | null;
    /**
     * Detects suspicious shipping routes and transshipment patterns
     */
    detectAnomalousShippingRoutes(origin: string, destination: string, actualRoute: string[], directRoute: string[]): RiskFlag | null;
    /**
     * Compares invoice price against market price databases
     */
    analyzeCommodityPriceVariance(commodity: string, reportedPrice: number, marketPrice: number, date: Date): MarketComparison;
    /**
     * Flags unusual price volatility for commodity
     */
    detectCommodityPriceVolatility(transactions: TradeTransaction[], commodityType: string): RiskFlag | null;
    /**
     * Identifies price manipulation using high-value, low-demand commodities
     */
    detectPriceManipulationUsingNicheCommodities(commodityType: string, marketLiquidity: number, transactionVolume: number, priceDeviation: number): RiskFlag | null;
    /**
     * Identifies unusual trade routes (high-risk corridors)
     */
    detectHighRiskTradeRoutes(originCountry: string, destinationCountry: string, highRiskCountries: Set<string>): RiskFlag | null;
    /**
     * Detects unusual route re-invoicing (goods sent back and forth)
     */
    detectCircularTradeRoutes(transactions: TradeTransaction[]): RiskFlag | null;
    /**
     * Identifies transshipment point anomalies (unusual routing patterns)
     */
    detectAnomalousTransshipmentPatterns(standardRoutes: Map<string, string[]>, actualRoute: string, transshipmentPoints: string[]): RiskFlag | null;
    /**
     * Detects suspicious free trade zone activity
     */
    detectSuspiciousFtzActivity(transactionCount: number, ftzDwellTime: number, // days
    totalValue: number): RiskFlag | null;
    /**
     * Monitors goods held in FTZ beyond normal commercial periods
     */
    detectAbnormalFtzDwellTime(commodity: string, daysInFtz: number, normalDwellRange: {
        min: number;
        max: number;
    }): RiskFlag | null;
    /**
     * Identifies value modifications within FTZ (repackaging, assembly)
     */
    detectValueModificationInFtz(entryValue: number, exitValue: number, commodityType: string): RiskFlag | null;
    /**
     * Identifies dual-use goods (items with civilian and military applications)
     */
    detectDualUseGoodsExport(commodity: string, destination: string, dualUseRegistry: Map<string, string[]>, sanctionedDestinations: Set<string>): RiskFlag | null;
    /**
     * Analyzes end-use statements for credibility
     */
    validateEndUseStatement(commodity: string, declaredEndUse: string, importerProfile: string): RiskFlag | null;
    /**
     * Tracks re-export patterns of dual-use items
     */
    detectDualUseReExportPatterns(transactions: TradeTransaction[], dualUseCommodities: Set<string>): RiskFlag | null;
    /**
     * Detects misclassification of commodities using HTSUS codes
     */
    detectHtsusCodeMisclassification(declaredHtsCode: string, declaredCommodity: string, validCodesForCommodity: Set<string>): RiskFlag | null;
    /**
     * Identifies tariff arbitrage through code switching
     */
    detectTariffArbitrageCodeSwitching(transactions: TradeTransaction[], commodity: string): RiskFlag | null;
    /**
     * Flags suspicious origin declarations for tariff preference claims
     */
    validateOriginDeclarationForTariffPreference(declaredOrigin: string, productionCountries: string[], freeTradeAgreements: Set<string>): RiskFlag | null;
    /**
     * Performs enhanced due diligence on counterparties
     */
    conductCounterpartyDueDiligence(counterpartyId: string, sanctionsDatabase: Map<string, boolean>, pepsDatabase: Map<string, boolean>, previousViolations: number): CounterpartyProfile;
    /**
     * Detects sudden new counterparties replacing established ones
     */
    detectCounterpartySubstitution(previousCounterparties: Set<string>, currentCounterparties: Set<string>, replacementThreshold?: number): RiskFlag | null;
    /**
     * Identifies counterparties with weak compliance controls
     */
    detectWeakComplianceCounterparties(counterpartyProfiles: CounterpartyProfile[], complianceScoreThreshold?: number): RiskFlag | null;
    /**
     * Detects unusual payment methods and terms
     */
    detectUnusualPaymentTerms(paymentMethod: string, paymentTerms: string, commodityValue: number): RiskFlag | null;
    /**
     * Identifies advance payment requests (funding layering indicator)
     */
    detectAdvancePaymentRequests(paymentTerms: string, paymentPercentage: number, transactionValue: number): RiskFlag | null;
    /**
     * Monitors for patterns indicating over-reliance on trade finance
     */
    detectExcessiveTradeFinanceDependence(transactions: TradeTransaction[], lcBackedThreshold?: number): RiskFlag | null;
    /**
     * Validates letter of credit consistency with trade documents
     */
    validateLetterOfCreditConsistency(lcAmount: number, invoiceAmount: number, lcTerms: string): RiskFlag | null;
    /**
     * Detects LC discrepancies and amendments (fraud indicator)
     */
    detectLcDiscrepanciesAndAmendments(lcAmendmentCount: number, discrepancyCount: number): RiskFlag | null;
    /**
     * Validates LC issuing bank and conditions
     */
    validateLetterOfCreditIssuer(issuingBankCountry: string, applicantCountry: string, lcConditions: string[], highRiskCountries: Set<string>): RiskFlag | null;
    /**
     * Validates bill of lading against shipment records
     */
    validateBillOfLadingAuthenticity(bolNumber: string, issuer: string, shipmentDate: Date, carrierDatabase: Map<string, string>): RiskFlag | null;
    /**
     * Detects duplicate or reused bill of lading numbers
     */
    detectDuplicateBillOfLading(transactions: TradeTransaction[]): RiskFlag | null;
    /**
     * Validates BOL terms and conditions match trade agreement
     */
    validateBolTermsConsistency(bolTerms: string, contractTerms: string, shipmentTerms: string): RiskFlag | null;
    /**
     * Identifies possible trade-based value transfer mechanisms
     */
    detectValueTransferSchemes(invoiceAmount: number, marketPrice: number, quantity: number, paymentTerms: string): RiskFlag | null;
    /**
     * Detects over-insurance patterns (value overstatement)
     */
    detectOverInsurancePatterns(commodityValue: number, insuranceAmount: number, commodityType: string): RiskFlag | null;
    /**
     * Identifies manipulation through refund/credit mechanisms
     */
    detectRefundManipulation(originalValue: number, refundedValue: number, refundReason: string): RiskFlag | null;
    /**
     * Analyzes entity trade pattern for anomalies
     */
    analyzeEntityTradePatterns(transactions: TradeTransaction[], entityId: string): TradePatternMetrics;
    /**
     * Detects sudden spikes in trade activity
     */
    detectTradeActivitySpikes(transactions: TradeTransaction[], windowDays?: number): RiskFlag | null;
    /**
     * Identifies suspicious geographic patterns in trade (beneficial ownership masking)
     */
    detectGeographicTradeAnomaly(transactions: TradeTransaction[], entityHQCountry: string): RiskFlag | null;
}
export {};
//# sourceMappingURL=trade-based-money-laundering-detection-kit.d.ts.map