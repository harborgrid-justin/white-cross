/**
 * LOC: EXECTHREP001
 * File: /reuse/threat/executive-threat-reporting-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Executive dashboard services
 *   - Board reporting modules
 *   - Risk management platforms
 *   - Security metrics services
 *   - Compliance reporting systems
 *   - C-level communication tools
 */
/**
 * Executive threat summary
 */
export interface ExecutiveThreatSummary {
    id: string;
    periodStart: Date;
    periodEnd: Date;
    generatedAt: Date;
    executiveLevel: 'ceo' | 'ciso' | 'cto' | 'board' | 'executive_team';
    overallRiskScore: number;
    riskTrend: 'increasing' | 'decreasing' | 'stable';
    keyThreats: Array<{
        threatId: string;
        threatName: string;
        severity: 'critical' | 'high' | 'medium' | 'low';
        likelihood: number;
        impact: number;
        riskScore: number;
        status: string;
        businessImpact: string;
        recommendation: string;
    }>;
    securityPosture: {
        currentMaturity: number;
        targetMaturity: number;
        gapAnalysis: string[];
        strengths: string[];
        weaknesses: string[];
    };
    incidentSummary: {
        totalIncidents: number;
        criticalIncidents: number;
        resolvedIncidents: number;
        averageResolutionTime: number;
        financialImpact: number;
    };
    complianceStatus: {
        overallCompliance: number;
        frameworks: Array<{
            framework: string;
            complianceScore: number;
            status: 'compliant' | 'partial' | 'non_compliant';
        }>;
    };
    investmentRecommendations: Array<{
        category: string;
        estimatedCost: number;
        expectedROI: number;
        priority: 'critical' | 'high' | 'medium' | 'low';
        justification: string;
    }>;
    executiveActions: string[];
    metadata?: Record<string, any>;
}
/**
 * Risk posture report
 */
export interface RiskPostureReport {
    id: string;
    reportDate: Date;
    reportingPeriod: {
        start: Date;
        end: Date;
    };
    overallRiskLevel: 'critical' | 'high' | 'medium' | 'low';
    riskScore: number;
    riskVelocity: number;
    riskCategories: Array<{
        category: 'cybersecurity' | 'compliance' | 'operational' | 'strategic' | 'financial';
        currentRisk: number;
        previousRisk: number;
        trend: 'increasing' | 'decreasing' | 'stable';
        contributors: Array<{
            factor: string;
            impact: number;
            mitigationStatus: string;
        }>;
    }>;
    threatLandscape: {
        activeThreatActors: number;
        activeCampaigns: number;
        emergingThreats: Array<{
            threat: string;
            firstSeen: Date;
            relevance: number;
            preparedness: number;
        }>;
    };
    vulnerabilityExposure: {
        totalVulnerabilities: number;
        criticalVulnerabilities: number;
        exploitableVulnerabilities: number;
        patchingEfficiency: number;
        meanTimeToRemediate: number;
    };
    attackSurface: {
        exposedAssets: number;
        internetFacingServices: number;
        cloudExposure: number;
        thirdPartyRisks: number;
    };
    controlEffectiveness: {
        preventiveControls: number;
        detectiveControls: number;
        correctiveControls: number;
        overallEffectiveness: number;
    };
    riskAppetite: {
        defined: number;
        current: number;
        variance: number;
        withinTolerance: boolean;
    };
    recommendations: Array<{
        priority: number;
        recommendation: string;
        expectedImpact: string;
        timeframe: string;
    }>;
    metadata?: Record<string, any>;
}
/**
 * Security trend analysis
 */
export interface SecurityTrendAnalysis {
    id: string;
    analysisDate: Date;
    timeframe: string;
    trendPeriods: Array<{
        period: string;
        startDate: Date;
        endDate: Date;
        metrics: Record<string, number>;
    }>;
    incidentTrends: {
        volumeTrend: 'increasing' | 'decreasing' | 'stable';
        severityTrend: 'worsening' | 'improving' | 'stable';
        typeTrends: Array<{
            type: string;
            count: number;
            changePercent: number;
        }>;
        seasonalPatterns: Array<{
            pattern: string;
            description: string;
        }>;
    };
    threatTrends: {
        emergingThreatVectors: string[];
        decliningThreatTypes: string[];
        persistentThreats: string[];
        threatActorActivity: Array<{
            actor: string;
            activityLevel: 'high' | 'medium' | 'low';
            trend: string;
        }>;
    };
    detectionTrends: {
        detectionRateTrend: number;
        falsePositiveTrend: number;
        meanTimeToDetectTrend: number;
        alertVolumeTrend: number;
    };
    complianceTrends: {
        overallComplianceTrend: number;
        frameworkTrends: Record<string, number>;
        auditFindingsTrend: number;
    };
    investmentTrends: {
        securitySpendingTrend: number;
        costPerIncidentTrend: number;
        roiTrend: number;
        budgetUtilization: number;
    };
    predictions: Array<{
        metric: string;
        predictedValue: number;
        confidence: number;
        timeframe: string;
        methodology: string;
    }>;
    recommendations: string[];
    metadata?: Record<string, any>;
}
/**
 * KPI dashboard configuration
 */
export interface KPIDashboard {
    id: string;
    name: string;
    description: string;
    audience: 'ceo' | 'ciso' | 'cto' | 'board' | 'executive_team' | 'security_team';
    refreshInterval: number;
    lastUpdated: Date;
    kpis: Array<{
        kpiId: string;
        name: string;
        category: string;
        currentValue: number;
        targetValue: number;
        unit: string;
        trend: 'up' | 'down' | 'stable';
        status: 'on_track' | 'at_risk' | 'off_track';
        changePercent: number;
        historicalData: Array<{
            timestamp: Date;
            value: number;
        }>;
        thresholds: {
            critical: number;
            warning: number;
            target: number;
            excellent: number;
        };
        visualization: 'gauge' | 'line' | 'bar' | 'pie' | 'number';
    }>;
    customMetrics: Array<{
        metricId: string;
        name: string;
        formula: string;
        value: number;
        visualization: string;
    }>;
    alerts: Array<{
        kpiId: string;
        severity: 'critical' | 'warning' | 'info';
        message: string;
        triggeredAt: Date;
    }>;
    layout: {
        sections: Array<{
            sectionId: string;
            title: string;
            kpis: string[];
            order: number;
        }>;
    };
    metadata?: Record<string, any>;
}
/**
 * Board-level security report
 */
export interface BoardSecurityReport {
    id: string;
    reportDate: Date;
    reportingPeriod: {
        start: Date;
        end: Date;
    };
    fiscalQuarter: string;
    executiveSummary: {
        overallSecurityPosture: string;
        keyAchievements: string[];
        criticalConcerns: string[];
        actionItems: string[];
    };
    riskOverview: {
        enterpriseRiskScore: number;
        topRisks: Array<{
            risk: string;
            likelihood: number;
            impact: number;
            mitigationStatus: string;
        }>;
        riskHeatmap: Array<{
            category: string;
            risks: Array<{
                name: string;
                likelihood: number;
                impact: number;
            }>;
        }>;
    };
    threatEnvironment: {
        threatLevel: 'critical' | 'high' | 'medium' | 'low';
        industryTrends: string[];
        targetedAttacks: number;
        successfulAttacks: number;
        preventedAttacks: number;
    };
    incidentReport: {
        totalIncidents: number;
        criticalIncidents: Array<{
            date: Date;
            type: string;
            impact: string;
            resolution: string;
            lessonsLearned: string;
        }>;
        financialImpact: {
            directCosts: number;
            indirectCosts: number;
            potentialLossesPrevented: number;
        };
    };
    complianceStatus: {
        regulatoryCompliance: Array<{
            regulation: string;
            status: 'compliant' | 'partial' | 'non_compliant';
            lastAudit: Date;
            nextAudit: Date;
            findings: number;
        }>;
        certifications: Array<{
            certification: string;
            status: 'current' | 'expiring' | 'expired';
            expiryDate: Date;
        }>;
    };
    investmentOverview: {
        currentBudget: number;
        actualSpending: number;
        budgetUtilization: number;
        roi: number;
        costAvoidance: number;
        proposedInvestments: Array<{
            initiative: string;
            estimatedCost: number;
            expectedBenefit: string;
            priority: 'critical' | 'high' | 'medium' | 'low';
        }>;
    };
    benchmarking: {
        industryComparison: Array<{
            metric: string;
            ourValue: number;
            industryAverage: number;
            percentile: number;
        }>;
    };
    strategicInitiatives: Array<{
        initiative: string;
        status: 'completed' | 'on_track' | 'delayed' | 'planned';
        progress: number;
        impact: string;
    }>;
    recommendations: Array<{
        priority: 'critical' | 'high' | 'medium' | 'low';
        recommendation: string;
        rationale: string;
        requiredInvestment: number;
        expectedOutcome: string;
        timeline: string;
    }>;
    appendices: Array<{
        title: string;
        content: string;
    }>;
    metadata?: Record<string, any>;
}
/**
 * Compliance reporting configuration
 */
export interface ComplianceReport {
    id: string;
    reportType: 'hipaa' | 'pci_dss' | 'sox' | 'gdpr' | 'nist' | 'iso27001' | 'custom';
    reportDate: Date;
    reportingPeriod: {
        start: Date;
        end: Date;
    };
    overallComplianceScore: number;
    complianceStatus: 'compliant' | 'partially_compliant' | 'non_compliant';
    requirements: Array<{
        requirementId: string;
        requirement: string;
        status: 'met' | 'partial' | 'not_met' | 'not_applicable';
        evidence: string[];
        gaps: string[];
        remediationPlan?: string;
        dueDate?: Date;
    }>;
    controls: Array<{
        controlId: string;
        controlName: string;
        effectiveness: number;
        testResults: Array<{
            testDate: Date;
            result: 'pass' | 'fail';
            notes: string;
        }>;
        deficiencies: string[];
    }>;
    auditFindings: Array<{
        findingId: string;
        severity: 'critical' | 'high' | 'medium' | 'low';
        finding: string;
        affectedSystems: string[];
        remediationStatus: 'open' | 'in_progress' | 'remediated';
        remediationDeadline: Date;
    }>;
    riskAssessment: {
        identifiedRisks: number;
        mitigatedRisks: number;
        residualRisks: number;
        riskTreatmentPlan: string;
    };
    certificationStatus?: {
        certified: boolean;
        certificationBody: string;
        certificationDate?: Date;
        expiryDate?: Date;
    };
    executiveSummary: string;
    recommendations: string[];
    metadata?: Record<string, any>;
}
/**
 * Security ROI analysis
 */
export interface SecurityROIAnalysis {
    id: string;
    analysisDate: Date;
    analysisPeriod: {
        start: Date;
        end: Date;
    };
    totalInvestment: {
        capitalExpenditure: number;
        operationalExpenditure: number;
        personnelCosts: number;
        toolsAndServices: number;
        trainingAndAwareness: number;
        totalCost: number;
    };
    valueRealized: {
        incidentsPrevented: number;
        estimatedLossesPrevented: number;
        downTimePrevented: number;
        complianceFinesAvoided: number;
        reputationProtectionValue: number;
        totalValue: number;
    };
    roi: {
        roiPercentage: number;
        paybackPeriod: number;
        netPresentValue: number;
        costBenefitRatio: number;
    };
    costBreakdown: Array<{
        category: string;
        amount: number;
        percentage: number;
    }>;
    benefitBreakdown: Array<{
        category: string;
        value: number;
        percentage: number;
    }>;
    investmentEfficiency: {
        costPerIncidentPrevented: number;
        costPerUserProtected: number;
        costPerAssetProtected: number;
    };
    benchmarking: {
        industryAverageCost: number;
        industryAverageROI: number;
        comparisonRating: 'above_average' | 'average' | 'below_average';
    };
    projections: Array<{
        year: number;
        projectedInvestment: number;
        projectedReturn: number;
        projectedROI: number;
    }>;
    recommendations: Array<{
        area: string;
        currentSpend: number;
        recommendedSpend: number;
        expectedImprovement: string;
    }>;
    metadata?: Record<string, any>;
}
/**
 * Custom report template
 */
export interface CustomReportTemplate {
    id: string;
    name: string;
    description: string;
    templateType: 'executive' | 'technical' | 'compliance' | 'board' | 'custom';
    category: string;
    sections: Array<{
        sectionId: string;
        title: string;
        order: number;
        type: 'text' | 'metrics' | 'chart' | 'table' | 'custom';
        dataSource: string;
        visualization?: {
            type: 'bar' | 'line' | 'pie' | 'heatmap' | 'gauge' | 'table';
            configuration: Record<string, any>;
        };
        filters?: Record<string, any>;
        aggregations?: Record<string, any>;
    }>;
    parameters: Array<{
        parameterId: string;
        name: string;
        type: 'string' | 'number' | 'date' | 'boolean' | 'select';
        required: boolean;
        defaultValue?: any;
        options?: any[];
    }>;
    schedule?: {
        frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually' | 'on_demand';
        cronExpression?: string;
        recipients: string[];
        format: 'pdf' | 'html' | 'excel' | 'json';
    };
    branding: {
        logo?: string;
        colorScheme: Record<string, string>;
        headerText?: string;
        footerText?: string;
    };
    createdBy: string;
    createdAt: Date;
    lastModified: Date;
    metadata?: Record<string, any>;
}
/**
 * Security metrics snapshot
 */
export interface SecurityMetricsSnapshot {
    id: string;
    snapshotDate: Date;
    periodStart: Date;
    periodEnd: Date;
    operationalMetrics: {
        incidentsDetected: number;
        incidentsResolved: number;
        meanTimeToDetect: number;
        meanTimeToRespond: number;
        meanTimeToResolve: number;
        alertVolume: number;
        falsePositiveRate: number;
    };
    threatMetrics: {
        threatsIdentified: number;
        threatsBlocked: number;
        activeThreatActors: number;
        activeCampaigns: number;
        iocCount: number;
    };
    vulnerabilityMetrics: {
        vulnerabilitiesDiscovered: number;
        vulnerabilitiesRemediated: number;
        criticalVulnerabilities: number;
        meanTimeToRemediate: number;
        patchComplianceRate: number;
    };
    complianceMetrics: {
        overallComplianceScore: number;
        controlsCovered: number;
        auditFindings: number;
        openFindings: number;
        remediationRate: number;
    };
    performanceMetrics: {
        systemUptime: number;
        securityToolAvailability: number;
        coveragePercentage: number;
        detectionAccuracy: number;
    };
    costMetrics: {
        securitySpending: number;
        costPerIncident: number;
        costPerUser: number;
        budgetUtilization: number;
    };
    metadata?: Record<string, any>;
}
/**
 * Threat forecast
 */
export interface ThreatForecast {
    id: string;
    forecastDate: Date;
    forecastPeriod: {
        start: Date;
        end: Date;
    };
    methodology: string;
    confidenceLevel: number;
    predictions: Array<{
        threat: string;
        category: string;
        likelihood: number;
        potentialImpact: number;
        timeframe: string;
        indicators: string[];
        preparednessLevel: number;
        recommendedActions: string[];
    }>;
    emergingTrends: Array<{
        trend: string;
        description: string;
        relevance: number;
        timeline: string;
    }>;
    industryIntelligence: {
        healthcareThreatLevel: 'critical' | 'high' | 'medium' | 'low';
        recentAttacks: Array<{
            target: string;
            attackType: string;
            impact: string;
            date: Date;
        }>;
        regulatoryChanges: Array<{
            regulation: string;
            change: string;
            effectiveDate: Date;
            impact: string;
        }>;
    };
    riskProjections: Array<{
        riskCategory: string;
        currentLevel: number;
        projectedLevel: number;
        changePercent: number;
    }>;
    recommendations: string[];
    metadata?: Record<string, any>;
}
/**
 * Microservices report request message
 */
export interface ReportRequestMessage {
    requestId: string;
    reportType: string;
    requestedBy: string;
    parameters: Record<string, any>;
    priority: 'immediate' | 'high' | 'normal' | 'low';
    timestamp: Date;
    deliveryMethod: 'email' | 'dashboard' | 'api' | 'file';
    recipients?: string[];
}
/**
 * Report generation event
 */
export interface ReportGenerationEvent {
    eventId: string;
    eventType: 'report_requested' | 'report_generating' | 'report_completed' | 'report_failed';
    reportId: string;
    requestId: string;
    timestamp: Date;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    progress?: number;
    data?: Record<string, any>;
    error?: string;
}
export declare const ExecutiveThreatSummaryModel: {
    tableName: string;
    timestamps: boolean;
    paranoid: boolean;
    attributes: {
        id: {
            type: string;
            primaryKey: boolean;
            defaultValue: string;
        };
        periodStart: {
            type: string;
            allowNull: boolean;
        };
        periodEnd: {
            type: string;
            allowNull: boolean;
        };
        generatedAt: {
            type: string;
            defaultValue: string;
        };
        executiveLevel: {
            type: string;
            allowNull: boolean;
        };
        overallRiskScore: {
            type: string;
            allowNull: boolean;
        };
        riskTrend: {
            type: string;
            allowNull: boolean;
        };
        keyThreats: {
            type: string;
            allowNull: boolean;
        };
        securityPosture: {
            type: string;
            allowNull: boolean;
        };
        incidentSummary: {
            type: string;
            allowNull: boolean;
        };
        complianceStatus: {
            type: string;
            allowNull: boolean;
        };
        investmentRecommendations: {
            type: string;
            allowNull: boolean;
        };
        executiveActions: {
            type: string;
            allowNull: boolean;
        };
        metadata: {
            type: string;
            allowNull: boolean;
        };
    };
    indexes: {
        fields: string[];
    }[];
};
export declare const RiskPostureReportModel: {
    tableName: string;
    timestamps: boolean;
    paranoid: boolean;
    attributes: {
        id: {
            type: string;
            primaryKey: boolean;
            defaultValue: string;
        };
        reportDate: {
            type: string;
            allowNull: boolean;
        };
        reportingPeriod: {
            type: string;
            allowNull: boolean;
        };
        overallRiskLevel: {
            type: string;
            allowNull: boolean;
        };
        riskScore: {
            type: string;
            allowNull: boolean;
        };
        riskVelocity: {
            type: string;
            allowNull: boolean;
        };
        riskCategories: {
            type: string;
            allowNull: boolean;
        };
        threatLandscape: {
            type: string;
            allowNull: boolean;
        };
        vulnerabilityExposure: {
            type: string;
            allowNull: boolean;
        };
        attackSurface: {
            type: string;
            allowNull: boolean;
        };
        controlEffectiveness: {
            type: string;
            allowNull: boolean;
        };
        riskAppetite: {
            type: string;
            allowNull: boolean;
        };
        recommendations: {
            type: string;
            allowNull: boolean;
        };
        metadata: {
            type: string;
            allowNull: boolean;
        };
    };
    indexes: {
        fields: string[];
    }[];
};
export declare const KPIDashboardModel: {
    tableName: string;
    timestamps: boolean;
    paranoid: boolean;
    attributes: {
        id: {
            type: string;
            primaryKey: boolean;
            defaultValue: string;
        };
        name: {
            type: string;
            allowNull: boolean;
        };
        description: {
            type: string;
            allowNull: boolean;
        };
        audience: {
            type: string;
            allowNull: boolean;
        };
        refreshInterval: {
            type: string;
            defaultValue: number;
        };
        lastUpdated: {
            type: string;
            defaultValue: string;
        };
        kpis: {
            type: string;
            allowNull: boolean;
        };
        customMetrics: {
            type: string;
            allowNull: boolean;
        };
        alerts: {
            type: string;
            allowNull: boolean;
        };
        layout: {
            type: string;
            allowNull: boolean;
        };
        metadata: {
            type: string;
            allowNull: boolean;
        };
    };
    indexes: {
        fields: string[];
    }[];
};
export declare const BoardSecurityReportModel: {
    tableName: string;
    timestamps: boolean;
    paranoid: boolean;
    attributes: {
        id: {
            type: string;
            primaryKey: boolean;
            defaultValue: string;
        };
        reportDate: {
            type: string;
            allowNull: boolean;
        };
        reportingPeriod: {
            type: string;
            allowNull: boolean;
        };
        fiscalQuarter: {
            type: string;
            allowNull: boolean;
        };
        executiveSummary: {
            type: string;
            allowNull: boolean;
        };
        riskOverview: {
            type: string;
            allowNull: boolean;
        };
        threatEnvironment: {
            type: string;
            allowNull: boolean;
        };
        incidentReport: {
            type: string;
            allowNull: boolean;
        };
        complianceStatus: {
            type: string;
            allowNull: boolean;
        };
        investmentOverview: {
            type: string;
            allowNull: boolean;
        };
        benchmarking: {
            type: string;
            allowNull: boolean;
        };
        strategicInitiatives: {
            type: string;
            allowNull: boolean;
        };
        recommendations: {
            type: string;
            allowNull: boolean;
        };
        appendices: {
            type: string;
            allowNull: boolean;
        };
        metadata: {
            type: string;
            allowNull: boolean;
        };
    };
    indexes: {
        fields: string[];
    }[];
};
export declare const ComplianceReportModel: {
    tableName: string;
    timestamps: boolean;
    paranoid: boolean;
    attributes: {
        id: {
            type: string;
            primaryKey: boolean;
            defaultValue: string;
        };
        reportType: {
            type: string;
            allowNull: boolean;
        };
        reportDate: {
            type: string;
            allowNull: boolean;
        };
        reportingPeriod: {
            type: string;
            allowNull: boolean;
        };
        overallComplianceScore: {
            type: string;
            allowNull: boolean;
        };
        complianceStatus: {
            type: string;
            allowNull: boolean;
        };
        requirements: {
            type: string;
            allowNull: boolean;
        };
        controls: {
            type: string;
            allowNull: boolean;
        };
        auditFindings: {
            type: string;
            allowNull: boolean;
        };
        riskAssessment: {
            type: string;
            allowNull: boolean;
        };
        certificationStatus: {
            type: string;
            allowNull: boolean;
        };
        executiveSummary: {
            type: string;
            allowNull: boolean;
        };
        recommendations: {
            type: string;
            allowNull: boolean;
        };
        metadata: {
            type: string;
            allowNull: boolean;
        };
    };
    indexes: {
        fields: string[];
    }[];
};
export declare const SecurityROIAnalysisModel: {
    tableName: string;
    timestamps: boolean;
    paranoid: boolean;
    attributes: {
        id: {
            type: string;
            primaryKey: boolean;
            defaultValue: string;
        };
        analysisDate: {
            type: string;
            allowNull: boolean;
        };
        analysisPeriod: {
            type: string;
            allowNull: boolean;
        };
        totalInvestment: {
            type: string;
            allowNull: boolean;
        };
        valueRealized: {
            type: string;
            allowNull: boolean;
        };
        roi: {
            type: string;
            allowNull: boolean;
        };
        costBreakdown: {
            type: string;
            allowNull: boolean;
        };
        benefitBreakdown: {
            type: string;
            allowNull: boolean;
        };
        investmentEfficiency: {
            type: string;
            allowNull: boolean;
        };
        benchmarking: {
            type: string;
            allowNull: boolean;
        };
        projections: {
            type: string;
            allowNull: boolean;
        };
        recommendations: {
            type: string;
            allowNull: boolean;
        };
        metadata: {
            type: string;
            allowNull: boolean;
        };
    };
    indexes: {
        fields: string[];
    }[];
};
/**
 * Generates executive threat summary
 * @param period - Reporting period
 * @param level - Executive level
 * @returns Executive threat summary
 */
export declare function generateExecutiveThreatSummary(period: {
    start: Date;
    end: Date;
}, level?: 'ceo' | 'ciso' | 'cto' | 'board' | 'executive_team'): ExecutiveThreatSummary;
/**
 * Creates customized executive summary for specific audience
 * @param summary - Base threat summary
 * @param audience - Target audience
 * @returns Customized summary
 */
export declare function customizeExecutiveSummary(summary: ExecutiveThreatSummary, audience: 'ceo' | 'board' | 'technical'): {
    title: string;
    highlights: string[];
    metrics: Array<{
        name: string;
        value: string;
        trend: string;
    }>;
    recommendations: string[];
};
/**
 * Generates executive KPI snapshot
 * @param summary - Threat summary
 * @returns KPI snapshot
 */
export declare function generateExecutiveKPISnapshot(summary: ExecutiveThreatSummary): {
    kpis: Array<{
        name: string;
        value: number;
        target: number;
        status: string;
    }>;
};
/**
 * Formats executive summary for different output formats
 * @param summary - Threat summary
 * @param format - Output format
 * @returns Formatted summary
 */
export declare function formatExecutiveSummary(summary: ExecutiveThreatSummary, format: 'email' | 'pdf' | 'dashboard' | 'presentation'): {
    format: string;
    content: string;
    metadata: Record<string, any>;
};
/**
 * Generates comprehensive risk posture report
 * @param period - Reporting period
 * @returns Risk posture report
 */
export declare function generateRiskPostureReport(period: {
    start: Date;
    end: Date;
}): RiskPostureReport;
/**
 * Calculates risk velocity and trends
 * @param historicalRisks - Array of historical risk scores
 * @returns Risk velocity analysis
 */
export declare function calculateRiskVelocity(historicalRisks: Array<{
    date: Date;
    score: number;
}>): {
    velocity: number;
    trend: 'accelerating' | 'decelerating' | 'stable';
    projection: number;
};
/**
 * Generates risk heatmap data
 * @param report - Risk posture report
 * @returns Heatmap visualization data
 */
export declare function generateRiskHeatmap(report: RiskPostureReport): {
    categories: string[];
    data: Array<{
        category: string;
        likelihood: number;
        impact: number;
        risk: number;
    }>;
};
/**
 * Compares risk posture against industry benchmarks
 * @param report - Risk posture report
 * @returns Benchmark comparison
 */
export declare function compareRiskToBenchmarks(report: RiskPostureReport): {
    industryAverage: number;
    ourScore: number;
    percentile: number;
    comparison: 'above_average' | 'average' | 'below_average';
    insights: string[];
};
/**
 * Generates comprehensive security trend analysis
 * @param timeframe - Analysis timeframe
 * @returns Trend analysis
 */
export declare function generateSecurityTrendAnalysis(timeframe: '30d' | '90d' | '6m' | '1y'): SecurityTrendAnalysis;
/**
 * Forecasts future threat landscape
 * @param historicalData - Historical threat data
 * @param forecastPeriod - Period to forecast
 * @returns Threat forecast
 */
export declare function forecastThreatLandscape(historicalData: Array<{
    date: Date;
    metrics: Record<string, number>;
}>, forecastPeriod: {
    start: Date;
    end: Date;
}): ThreatForecast;
/**
 * Identifies security metric trends
 * @param metrics - Array of metric snapshots
 * @param metricName - Specific metric to analyze
 * @returns Trend analysis for metric
 */
export declare function identifyMetricTrends(metrics: Array<{
    timestamp: Date;
    value: number;
}>, metricName: string): {
    trend: 'improving' | 'declining' | 'stable';
    changeRate: number;
    volatility: number;
    forecast: number;
};
/**
 * Generates predictive analytics for security metrics
 * @param historicalData - Historical metric data
 * @param predictionWindow - Days to predict ahead
 * @returns Predictions
 */
export declare function generatePredictiveAnalytics(historicalData: Array<{
    date: Date;
    metrics: Record<string, number>;
}>, predictionWindow?: number): Array<{
    metric: string;
    predictions: Array<{
        date: Date;
        predictedValue: number;
        confidence: number;
    }>;
}>;
/**
 * Creates KPI dashboard configuration
 * @param audience - Target audience
 * @param kpiSelection - Selected KPIs
 * @returns Dashboard configuration
 */
export declare function createKPIDashboard(audience: 'ceo' | 'ciso' | 'cto' | 'board' | 'executive_team' | 'security_team', kpiSelection?: string[]): KPIDashboard;
/**
 * Updates KPI dashboard with real-time data
 * @param dashboardId - Dashboard ID
 * @param updates - KPI updates
 * @returns Updated dashboard
 */
export declare function updateKPIDashboard(dashboardId: string, updates: Array<{
    kpiId: string;
    newValue: number;
}>): {
    dashboardId: string;
    updatedKPIs: number;
    timestamp: Date;
    alerts: Array<{
        kpiId: string;
        severity: string;
        message: string;
    }>;
};
/**
 * Generates KPI comparison across time periods
 * @param kpiId - KPI identifier
 * @param periods - Time periods to compare
 * @returns Comparison data
 */
export declare function compareKPIAcrossPeriods(kpiId: string, periods: Array<{
    name: string;
    start: Date;
    end: Date;
}>): Array<{
    period: string;
    value: number;
    change: number;
}>;
/**
 * Calculates composite security score
 * @param metrics - Individual metrics
 * @param weights - Metric weights
 * @returns Composite score
 */
export declare function calculateCompositeSecurityScore(metrics: Record<string, number>, weights: Record<string, number>): {
    score: number;
    breakdown: Array<{
        metric: string;
        value: number;
        weight: number;
        contribution: number;
    }>;
};
/**
 * Generates comprehensive board security report
 * @param period - Reporting period
 * @param fiscalQuarter - Fiscal quarter
 * @returns Board report
 */
export declare function generateBoardSecurityReport(period: {
    start: Date;
    end: Date;
}, fiscalQuarter: string): BoardSecurityReport;
/**
 * Creates executive presentation slides
 * @param report - Board report
 * @returns Presentation slides
 */
export declare function createExecutivePresentation(report: BoardSecurityReport): Array<{
    slideNumber: number;
    title: string;
    content: string[];
    visualization?: string;
}>;
/**
 * Generates board-level risk summary
 * @param report - Board report
 * @returns Risk summary for board
 */
export declare function generateBoardRiskSummary(report: BoardSecurityReport): {
    summary: string;
    keyRisks: string[];
    mitigationStatus: string;
    boardActions: string[];
};
/**
 * Generates compliance report for specific framework
 * @param framework - Compliance framework
 * @param period - Reporting period
 * @returns Compliance report
 */
export declare function generateComplianceReport(framework: 'hipaa' | 'pci_dss' | 'sox' | 'gdpr' | 'nist' | 'iso27001', period: {
    start: Date;
    end: Date;
}): ComplianceReport;
/**
 * Tracks compliance status over time
 * @param framework - Compliance framework
 * @param historicalReports - Historical compliance reports
 * @returns Compliance trend
 */
export declare function trackComplianceStatus(framework: string, historicalReports: ComplianceReport[]): {
    trend: 'improving' | 'declining' | 'stable';
    scoreHistory: Array<{
        date: Date;
        score: number;
    }>;
    findingsTrend: 'increasing' | 'decreasing' | 'stable';
};
/**
 * Generates compliance gap analysis
 * @param report - Compliance report
 * @returns Gap analysis
 */
export declare function generateComplianceGapAnalysis(report: ComplianceReport): {
    totalRequirements: number;
    metRequirements: number;
    gaps: Array<{
        requirement: string;
        severity: string;
        remediationEffort: string;
    }>;
    estimatedRemediationCost: number;
};
/**
 * Generates comprehensive security ROI analysis
 * @param period - Analysis period
 * @returns ROI analysis
 */
export declare function generateSecurityROIAnalysis(period: {
    start: Date;
    end: Date;
}): SecurityROIAnalysis;
/**
 * Calculates security investment ROI
 * @param investment - Total investment
 * @param benefits - Realized benefits
 * @returns ROI metrics
 */
export declare function calculateSecurityROI(investment: number, benefits: number): {
    roi: number;
    netBenefit: number;
    costBenefitRatio: number;
    paybackPeriod: number;
};
/**
 * Analyzes cost avoidance from security investments
 * @param investments - Security investments
 * @param incidents - Prevented incidents
 * @returns Cost avoidance analysis
 */
export declare function analyzeCostAvoidance(investments: Array<{
    name: string;
    cost: number;
}>, incidents: Array<{
    type: string;
    potentialCost: number;
    prevented: boolean;
}>): {
    totalInvestment: number;
    totalCostAvoidance: number;
    netSavings: number;
    topContributors: Array<{
        investment: string;
        avoidance: number;
    }>;
};
/**
 * Creates custom report template
 * @param config - Template configuration
 * @returns Custom template
 */
export declare function createCustomReportTemplate(config: Partial<CustomReportTemplate>): CustomReportTemplate;
/**
 * Generates report from custom template
 * @param template - Report template
 * @param parameters - Template parameters
 * @returns Generated report
 */
export declare function generateReportFromTemplate(template: CustomReportTemplate, parameters: Record<string, any>): Promise<{
    reportId: string;
    content: string;
    format: string;
    generatedAt: Date;
}>;
/**
 * Schedules automated report generation
 * @param template - Report template
 * @param schedule - Schedule configuration
 * @returns Schedule confirmation
 */
export declare function scheduleReportGeneration(template: CustomReportTemplate, schedule: {
    frequency: string;
    recipients: string[];
    startDate: Date;
}): {
    scheduleId: string;
    nextRun: Date;
    status: string;
};
/**
 * Publishes report request to message queue
 * @param request - Report request
 * @param queue - Target queue
 * @returns Publish result
 */
export declare function publishReportRequest(request: ReportRequestMessage, queue?: 'redis' | 'rabbitmq' | 'kafka'): {
    messageId: string;
    queue: string;
    published: boolean;
    timestamp: Date;
};
/**
 * Subscribes to report generation events
 * @param eventTypes - Event types to subscribe to
 * @param handler - Event handler
 * @returns Subscription ID
 */
export declare function subscribeToReportEvents(eventTypes: string[], handler: (event: ReportGenerationEvent) => void): {
    subscriptionId: string;
    eventTypes: string[];
    active: boolean;
};
/**
 * Orchestrates distributed report generation
 * @param reportType - Type of report
 * @param dataPartitions - Data partitions for parallel processing
 * @returns Orchestration result
 */
export declare function orchestrateDistributedReporting(reportType: string, dataPartitions: Array<{
    partitionId: string;
    dataSource: string;
    dateRange: {
        start: Date;
        end: Date;
    };
}>): {
    orchestrationId: string;
    workers: Array<{
        workerId: string;
        partition: string;
        status: string;
    }>;
    estimatedCompletion: Date;
};
/**
 * Aggregates distributed report results
 * @param workerResults - Results from workers
 * @returns Aggregated report
 */
export declare function aggregateDistributedReportResults(workerResults: Array<{
    workerId: string;
    data: Record<string, any>;
}>): {
    aggregatedData: Record<string, any>;
    processingTime: number;
    dataPoints: number;
};
/**
 * @swagger
 * /api/reports/executive/summary:
 *   post:
 *     summary: Generate executive threat summary
 *     tags: [Executive Reports]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               periodStart:
 *                 type: string
 *                 format: date
 *               periodEnd:
 *                 type: string
 *                 format: date
 *               executiveLevel:
 *                 type: string
 *                 enum: [ceo, ciso, cto, board]
 *     responses:
 *       200:
 *         description: Executive summary generated
 */
/**
 * @swagger
 * /api/reports/risk-posture:
 *   get:
 *     summary: Get risk posture report
 *     tags: [Risk Reports]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Risk posture report
 */
/**
 * @swagger
 * /api/dashboards/kpi:
 *   post:
 *     summary: Create KPI dashboard
 *     tags: [Dashboards]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/KPIDashboard'
 *     responses:
 *       201:
 *         description: Dashboard created
 */
declare const _default: {
    generateExecutiveThreatSummary: typeof generateExecutiveThreatSummary;
    customizeExecutiveSummary: typeof customizeExecutiveSummary;
    generateExecutiveKPISnapshot: typeof generateExecutiveKPISnapshot;
    formatExecutiveSummary: typeof formatExecutiveSummary;
    generateRiskPostureReport: typeof generateRiskPostureReport;
    calculateRiskVelocity: typeof calculateRiskVelocity;
    generateRiskHeatmap: typeof generateRiskHeatmap;
    compareRiskToBenchmarks: typeof compareRiskToBenchmarks;
    generateSecurityTrendAnalysis: typeof generateSecurityTrendAnalysis;
    forecastThreatLandscape: typeof forecastThreatLandscape;
    identifyMetricTrends: typeof identifyMetricTrends;
    generatePredictiveAnalytics: typeof generatePredictiveAnalytics;
    createKPIDashboard: typeof createKPIDashboard;
    updateKPIDashboard: typeof updateKPIDashboard;
    compareKPIAcrossPeriods: typeof compareKPIAcrossPeriods;
    calculateCompositeSecurityScore: typeof calculateCompositeSecurityScore;
    generateBoardSecurityReport: typeof generateBoardSecurityReport;
    createExecutivePresentation: typeof createExecutivePresentation;
    generateBoardRiskSummary: typeof generateBoardRiskSummary;
    generateComplianceReport: typeof generateComplianceReport;
    trackComplianceStatus: typeof trackComplianceStatus;
    generateComplianceGapAnalysis: typeof generateComplianceGapAnalysis;
    generateSecurityROIAnalysis: typeof generateSecurityROIAnalysis;
    calculateSecurityROI: typeof calculateSecurityROI;
    analyzeCostAvoidance: typeof analyzeCostAvoidance;
    createCustomReportTemplate: typeof createCustomReportTemplate;
    generateReportFromTemplate: typeof generateReportFromTemplate;
    scheduleReportGeneration: typeof scheduleReportGeneration;
    publishReportRequest: typeof publishReportRequest;
    subscribeToReportEvents: typeof subscribeToReportEvents;
    orchestrateDistributedReporting: typeof orchestrateDistributedReporting;
    aggregateDistributedReportResults: typeof aggregateDistributedReportResults;
};
export default _default;
//# sourceMappingURL=executive-threat-reporting-kit.d.ts.map