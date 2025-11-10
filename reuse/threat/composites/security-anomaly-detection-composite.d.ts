/**
 * LOC: SECANOMAL001
 * File: /reuse/threat/composites/security-anomaly-detection-composite.ts
 *
 * UPSTREAM (imports from):
 *   - ../threat-prediction-forecasting-kit
 *   - ../threat-intelligence-ml-models-kit
 *   - ../behavioral-threat-analytics-kit
 *   - ../endpoint-threat-detection-kit
 *   - ../advanced-threat-hunting-kit
 *   - @nestjs/common
 *   - @nestjs/swagger
 *
 * DOWNSTREAM (imported by):
 *   - Security anomaly detection services
 *   - Healthcare threat monitoring systems
 *   - SIEM integrations
 *   - Real-time threat detection engines
 *   - Compliance monitoring dashboards
 */
/**
 * Security anomaly detection configuration
 */
export interface SecurityAnomalyConfig {
    id: string;
    name: string;
    description: string;
    detectionMethods: ('statistical' | 'ml' | 'behavioral' | 'hybrid')[];
    sensitivity: 'low' | 'medium' | 'high' | 'critical';
    baselineWindow: number;
    confidenceThreshold: number;
    falsePositiveReduction: boolean;
    realTimeMonitoring: boolean;
    alertingEnabled: boolean;
    autoResponse: boolean;
    hipaaCompliant: boolean;
}
/**
 * Comprehensive anomaly detection result
 */
export interface AnomalyDetectionResult {
    id: string;
    anomalyType: string;
    severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
    confidenceScore: number;
    detectionMethod: string;
    detectedAt: Date;
    affectedEntities: string[];
    indicators: Array<{
        type: string;
        value: any;
        deviation: number;
    }>;
    baselineComparison: {
        baseline: number;
        observed: number;
        standardDeviations: number;
    };
    riskScore: number;
    falsePositiveProbability: number;
    recommendedActions: string[];
    relatedAnomalies?: string[];
    mlExplanation?: any;
    metadata: Record<string, any>;
}
/**
 * Healthcare-specific anomaly context
 */
export interface HealthcareAnomalyContext {
    facilityId: string;
    departmentId?: string;
    patientDataAccessed?: boolean;
    phiExposed?: boolean;
    hipaaViolation?: boolean;
    medicalDeviceInvolved?: boolean;
    ehr_SystemAccessed?: boolean;
    complianceRisk: 'critical' | 'high' | 'medium' | 'low';
}
/**
 * Anomaly detection metrics
 */
export interface AnomalyDetectionMetrics {
    totalAnomaliesDetected: number;
    criticalAnomalies: number;
    highSeverityAnomalies: number;
    falsePositiveRate: number;
    detectionAccuracy: number;
    averageDetectionTime: number;
    baselinesCurrent: number;
    baselinesStale: number;
    modelsActive: number;
    lastModelUpdate: Date;
}
/**
 * Establishes comprehensive security baseline for an entity
 * Combines behavioral, statistical, and ML-based baselines
 *
 * @param entityId - Entity identifier
 * @param data - Historical data for baseline
 * @param options - Configuration options
 * @returns Baseline establishment result
 */
export declare const establishComprehensiveSecurityBaseline: (entityId: string, data: any[], options?: {
    methods?: ("statistical" | "ml" | "behavioral")[];
    duration?: number;
    adaptiveLearning?: boolean;
    peerComparison?: boolean;
}) => Promise<{
    baselineId: string;
    entityId: string;
    baselines: {
        statistical?: any;
        behavioral?: any;
        ml?: any;
        peer?: any;
    };
    metrics: any;
    validFrom: Date;
    nextUpdate: Date;
}>;
/**
 * Performs multi-method anomaly detection
 * Combines statistical, ML, and behavioral detection methods
 *
 * @param entityId - Entity to analyze
 * @param currentData - Current observation data
 * @param baselineId - Baseline reference
 * @returns Comprehensive anomaly detection results
 */
export declare const detectSecurityAnomaliesMultiMethod: (entityId: string, currentData: any, baselineId: string, config?: SecurityAnomalyConfig) => Promise<AnomalyDetectionResult[]>;
/**
 * Analyzes behavioral anomalies in healthcare context
 * Specialized for healthcare security monitoring with HIPAA compliance
 *
 * @param userId - User or entity ID
 * @param activities - Recent activities
 * @param context - Healthcare context
 * @returns Behavioral anomaly analysis results
 */
export declare const analyzeHealthcareBehavioralAnomalies: (userId: string, activities: any[], context: HealthcareAnomalyContext) => Promise<{
    anomalies: AnomalyDetectionResult[];
    riskScore: number;
    complianceViolations: string[];
    hipaaRisk: "critical" | "high" | "medium" | "low" | "none";
    recommendedActions: string[];
}>;
/**
 * Detects endpoint security anomalies
 * Monitors endpoint telemetry for suspicious activities
 *
 * @param endpointId - Endpoint identifier
 * @param telemetry - Current telemetry data
 * @returns Endpoint anomaly detection results
 */
export declare const detectEndpointSecurityAnomalies: (endpointId: string, telemetry: any) => Promise<{
    anomalies: AnomalyDetectionResult[];
    endpointHealth: "healthy" | "degraded" | "compromised" | "critical";
    threats: string[];
    recommendations: string[];
}>;
/**
 * Correlates anomalies across multiple entities
 * Identifies coordinated attacks or systematic issues
 *
 * @param anomalies - Anomalies from multiple sources
 * @returns Correlated anomaly groups
 */
export declare const correlateAnomaliesAcrossEntities: (anomalies: AnomalyDetectionResult[]) => Promise<{
    correlationGroups: Array<{
        id: string;
        anomalies: AnomalyDetectionResult[];
        correlationScore: number;
        attackPattern?: string;
        affectedEntities: string[];
        severity: "critical" | "high" | "medium" | "low";
    }>;
    attackChains: any[];
    recommendations: string[];
}>;
/**
 * Performs real-time anomaly monitoring
 * Continuously monitors for security anomalies with alerting
 *
 * @param stream - Data stream to monitor
 * @param config - Monitoring configuration
 * @returns Monitoring session handle
 */
export declare const monitorSecurityAnomaliesRealTime: (stream: AsyncIterable<any>, config: SecurityAnomalyConfig) => Promise<{
    sessionId: string;
    start: () => Promise<void>;
    stop: () => Promise<void>;
    getMetrics: () => AnomalyDetectionMetrics;
    onAnomaly: (callback: (anomaly: AnomalyDetectionResult) => void) => void;
}>;
declare const _default: {
    establishComprehensiveSecurityBaseline: (entityId: string, data: any[], options?: {
        methods?: ("statistical" | "ml" | "behavioral")[];
        duration?: number;
        adaptiveLearning?: boolean;
        peerComparison?: boolean;
    }) => Promise<{
        baselineId: string;
        entityId: string;
        baselines: {
            statistical?: any;
            behavioral?: any;
            ml?: any;
            peer?: any;
        };
        metrics: any;
        validFrom: Date;
        nextUpdate: Date;
    }>;
    detectSecurityAnomaliesMultiMethod: (entityId: string, currentData: any, baselineId: string, config?: SecurityAnomalyConfig) => Promise<AnomalyDetectionResult[]>;
    analyzeHealthcareBehavioralAnomalies: (userId: string, activities: any[], context: HealthcareAnomalyContext) => Promise<{
        anomalies: AnomalyDetectionResult[];
        riskScore: number;
        complianceViolations: string[];
        hipaaRisk: "critical" | "high" | "medium" | "low" | "none";
        recommendedActions: string[];
    }>;
    detectEndpointSecurityAnomalies: (endpointId: string, telemetry: any) => Promise<{
        anomalies: AnomalyDetectionResult[];
        endpointHealth: "healthy" | "degraded" | "compromised" | "critical";
        threats: string[];
        recommendations: string[];
    }>;
    correlateAnomaliesAcrossEntities: (anomalies: AnomalyDetectionResult[]) => Promise<{
        correlationGroups: Array<{
            id: string;
            anomalies: AnomalyDetectionResult[];
            correlationScore: number;
            attackPattern?: string;
            affectedEntities: string[];
            severity: "critical" | "high" | "medium" | "low";
        }>;
        attackChains: any[];
        recommendations: string[];
    }>;
    monitorSecurityAnomaliesRealTime: (stream: AsyncIterable<any>, config: SecurityAnomalyConfig) => Promise<{
        sessionId: string;
        start: () => Promise<void>;
        stop: () => Promise<void>;
        getMetrics: () => AnomalyDetectionMetrics;
        onAnomaly: (callback: (anomaly: AnomalyDetectionResult) => void) => void;
    }>;
};
export default _default;
//# sourceMappingURL=security-anomaly-detection-composite.d.ts.map