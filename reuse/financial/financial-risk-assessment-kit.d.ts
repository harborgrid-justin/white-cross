/**
 * Financial Risk Assessment Kit - NestJS Provider
 *
 * Comprehensive risk management framework providing:
 * - Credit risk evaluation and customer credit assessment
 * - Market risk analysis with Value at Risk (VaR) calculations
 * - Operational risk identification and impact assessment
 * - Liquidity risk management and stress testing
 * - Integrated risk scoring, aggregation, and classification
 * - Scenario analysis with stress testing and optimization
 * - Early warning systems with Key Risk Indicators (KRI)
 * - Risk mitigation, controls, and effectiveness monitoring
 * - Risk reporting, dashboards, heat maps, and executive summaries
 *
 * Targets: Moody's Analytics | SAS Risk Analytics
 * Tech Stack: NestJS 10.x | Sequelize 6.x | LOC: FIN-RISK-001
 */
interface CreditRiskAssessment {
    customerId: string;
    creditScore: number;
    defaultProbability: number;
    creditLimit: number;
    exposureAmount: number;
    riskRating: string;
}
interface MarketRiskAssessment {
    portfolioId: string;
    valueAtRisk: number;
    expectedShortfall: number;
    confidence: number;
    stressTestResult: number;
    hedgeRatio: number;
}
interface OperationalRiskAssessment {
    riskId: string;
    riskCategory: string;
    probability: number;
    impact: number;
    riskExposure: number;
    mitigationStrategy: string;
}
interface LiquidityRiskAssessment {
    assetId: string;
    liquidityRatio: number;
    currentRatio: number;
    quickRatio: number;
    stressTestResult: number;
    contingencyPlan: string;
}
interface RiskScore {
    entityId: string;
    creditRiskScore: number;
    marketRiskScore: number;
    operationalRiskScore: number;
    liquidityRiskScore: number;
    aggregateScore: number;
    riskClassification: string;
}
interface ScenarioAnalysis {
    scenarioId: string;
    scenarioName: string;
    marketConditions: Record<string, number>;
    projectedLoss: number;
    probability: number;
    recommendation: string;
}
interface KeyRiskIndicator {
    indicatorId: string;
    indicatorName: string;
    threshold: number;
    currentValue: number;
    status: 'green' | 'yellow' | 'red';
    lastUpdated: Date;
}
interface RiskMitigation {
    controlId: string;
    riskId: string;
    controlType: string;
    effectiveness: number;
    implementationStatus: string;
    reviewDate: Date;
}
export declare class FinancialRiskAssessmentKit {
    private readonly logger;
    /**
     * 1. Assess customer credit profile and determine risk metrics
     */
    assessCustomerCredit(customerId: string): Promise<CreditRiskAssessment>;
    /**
     * 2. Calculate credit risk score using weighted factors
     */
    calculateCreditScore(creditData: Record<string, any>): Promise<number>;
    /**
     * 3. Set dynamic credit limits based on assessment
     */
    setCreditLimits(customerId: string, assessment: CreditRiskAssessment): Promise<number>;
    /**
     * 4. Monitor credit portfolio for changes and deterioration
     */
    monitorCreditPortfolio(portfolioId: string): Promise<CreditRiskAssessment[]>;
    /**
     * 5. Assess overall market risk exposure
     */
    assessMarketRisk(portfolioId: string): Promise<MarketRiskAssessment>;
    /**
     * 6. Calculate Value at Risk (VaR) using historical simulation
     */
    calculateValueAtRisk(positions: any[], confidence: number): Promise<number>;
    /**
     * 7. Perform market stress testing with scenarios
     */
    performMarketStress(positions: any[]): Promise<number>;
    /**
     * 8. Calculate optimal hedge ratio
     */
    calculateHedgeRatio(valueAtRisk: number, expectedShortfall: number): number;
    /**
     * 9. Identify operational risks in department
     */
    identifyOperationalRisks(departmentId: string): Promise<OperationalRiskAssessment[]>;
    /**
     * 10. Assess risk probability and likelihood for process
     */
    assessOperationalRisk(processId: string): Promise<OperationalRiskAssessment>;
    /**
     * 11. Calculate operational impact with weighted factors
     */
    estimateImpact(process: Record<string, any>): number;
    /**
     * 12. Implement risk mitigation for identified risks
     */
    mitigateOperationalRisk(riskId: string): Promise<RiskMitigation>;
    /**
     * 13. Assess liquidity risk for asset
     */
    assessLiquidityRisk(assetId: string): Promise<LiquidityRiskAssessment>;
    /**
     * 14. Monitor liquidity ratios for portfolio
     */
    monitorLiquidityRatios(portfolioId: string): Promise<Record<string, number>>;
    /**
     * 15. Stress test liquidity under adverse scenarios
     */
    performLiquidityStress(asset: any): Promise<number>;
    /**
     * 16. Generate contingency plan for asset
     */
    generateContingencyPlan(assetId: string, liquidityScore: number): string;
    /**
     * 17. Calculate aggregate risk score for entity
     */
    calculateRiskScore(entityId: string): Promise<RiskScore>;
    /**
     * 18. Aggregate risks with custom weightings
     */
    aggregateRisks(entityId: string, weights: Record<string, number>): Promise<number>;
    /**
     * 19. Normalize and validate risk factor weights
     */
    normalizeWeights(weights: Record<string, number>): Record<string, number>;
    /**
     * 20. Classify risk level based on score
     */
    classifyRisk(score: number): string;
    /**
     * 21. Create risk scenario with market conditions
     */
    createScenario(scenarioName: string, conditions: Record<string, number>): Promise<ScenarioAnalysis>;
    /**
     * 22. Run scenario analysis for multiple scenarios
     */
    runScenarioAnalysis(entityId: string, scenarios: ScenarioAnalysis[]): Promise<ScenarioAnalysis[]>;
    /**
     * 23. Compare scenarios and identify worst/best cases
     */
    compareScenarios(scenarios: ScenarioAnalysis[]): Promise<Record<string, any>>;
    /**
     * 24. Optimize portfolio allocation for scenario
     */
    optimizeForScenario(entityId: string, targetScenario: ScenarioAnalysis): Promise<Record<string, any>>;
    /**
     * 25. Define key risk indicators for entity
     */
    defineKeyRiskIndicators(entityId: string): Promise<KeyRiskIndicator[]>;
    /**
     * 26. Monitor KRIs and update status
     */
    monitorKRIs(kris: KeyRiskIndicator[]): Promise<KeyRiskIndicator[]>;
    /**
     * 27. Trigger alerts for breached KRIs
     */
    triggerEarlyWarnings(kris: KeyRiskIndicator[]): Promise<string[]>;
    /**
     * 28. Escalate high-severity alerts
     */
    escalateAlerts(alerts: string[]): Promise<void>;
    /**
     * 29. Identify applicable risk controls
     */
    identifyControls(riskId: string): Promise<RiskMitigation[]>;
    /**
     * 30. Implement mitigation controls
     */
    implementMitigation(controlId: string, mitigation: Record<string, any>): Promise<RiskMitigation>;
    /**
     * 31. Monitor mitigation effectiveness over time
     */
    monitorMitigationEffectiveness(controlId: string): Promise<number>;
    /**
     * 32. Generate risk dashboard with key metrics
     */
    generateRiskDashboard(portfolioId: string): Promise<Record<string, any>>;
    /**
     * 33. Generate risk heat map visualization
     */
    generateHeatMap(entityId: string): Promise<Record<string, any>>;
    /**
     * 34. Generate executive risk report
     */
    generateExecutiveReport(portfolioId: string): Promise<string>;
    /**
     * 35. Export risk data in multiple formats
     */
    exportRiskData(portfolioId: string, format: 'json' | 'csv' | 'pdf'): Promise<string | Buffer>;
    private fetchCreditData;
    private getCustomerExposure;
    private getPortfolioCustomers;
    private getPortfolioPositions;
    private simulatePortfolioReturns;
    private simulateStress;
    private getDepartmentProcesses;
    private getProcessData;
    private estimateProbability;
    private getRiskAssessment;
    private getAsset;
    private calculateLiquidityRatio;
    private calculateCurrentRatio;
    private calculateQuickRatio;
    private getPortfolioAssets;
    private projectScenarioLoss;
    private estimateScenarioProbability;
    private getCurrentAllocation;
    private rebalanceAllocation;
    private calculateConcentration;
    private calculateDefaultRate;
    private calculateLCR;
    private calculateTotalExposure;
    private identifyTopRisks;
    private checkRegulatoryCompliance;
    private analyzeRiskDistribution;
    private mapExposureColor;
    private testControlEffectiveness;
    private getControlIncidents;
    private convertToCSV;
}
export {};
//# sourceMappingURL=financial-risk-assessment-kit.d.ts.map