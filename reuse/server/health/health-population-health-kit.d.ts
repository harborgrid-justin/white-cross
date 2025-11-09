/**
 * LOC: H2P3O4P5H6
 * File: /reuse/server/health/health-population-health-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (v6.x)
 *   - @types/node (v18.x)
 *   - date-fns (v2.x)
 *
 * DOWNSTREAM (imported by):
 *   - Population health services
 *   - Quality measure APIs
 *   - Value-based care reporting
 *   - Population analytics
 */
/**
 * File: /reuse/server/health/health-population-health-kit.ts
 * Locator: WC-HEALTH-POP-KIT-001
 * Purpose: Population Health Kit - Comprehensive population health management and quality measures
 *
 * Upstream: sequelize v6.x, date-fns, @types/node
 * Downstream: Population health services, quality reporting, value-based care analytics
 * Dependencies: Sequelize v6.x, Node 18+, TypeScript 5.x, PostgreSQL 14+
 * Exports: 44 population health functions for registries, risk stratification, quality measures, preventive care
 *
 * LLM Context: Production-grade population health kit for White Cross healthcare platform.
 * Epic Healthy Planet-level functionality including patient registry management, multi-factor risk
 * stratification, disease registry tracking, HEDIS/ACO/MIPS quality measure calculation, preventive care
 * gap analysis, population segmentation, outreach campaigns, panel management, chronic disease management,
 * immunization forecasting, cancer screening, and value-based care reporting. HIPAA-compliant with
 * comprehensive audit trails and performance optimization for large patient populations.
 */
import { Model, ModelStatic, Transaction } from 'sequelize';
/**
 * Attribution method for panel management
 */
export type AttributionMethod = 'claims' | 'roster' | 'visit_based' | 'hybrid' | 'pcp_assignment';
/**
 * Panel status
 */
export type PanelStatus = 'active' | 'inactive' | 'disenrolled' | 'pending';
/**
 * Risk tier categories
 */
export type RiskTier = 'low' | 'medium' | 'high' | 'very_high' | 'catastrophic';
/**
 * Risk model types
 */
export type RiskModel = 'hcc' | 'cms_hcc' | 'rxhcc' | 'dcg' | 'commercial' | 'custom';
/**
 * Quality measure set
 */
export type MeasureSet = 'hedis' | 'aco' | 'mips' | 'pcmh' | 'uds' | 'stars' | 'custom';
/**
 * Measure calculation status
 */
export type MeasureCalculationStatus = 'pending' | 'calculating' | 'completed' | 'failed' | 'needs_recalc';
/**
 * Preventive care gap category
 */
export type PreventiveCareCategory = 'cancer_screening' | 'immunization' | 'wellness_visit' | 'lab_screening' | 'behavioral_health_screening';
/**
 * Immunization status
 */
export type ImmunizationStatus = 'due' | 'overdue' | 'up_to_date' | 'refused' | 'contraindicated';
/**
 * Outreach campaign status
 */
export type CampaignStatus = 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
/**
 * Outreach channel
 */
export type OutreachChannel = 'phone' | 'email' | 'sms' | 'mail' | 'patient_portal' | 'in_person';
/**
 * Chronic disease program
 */
export type ChronicDiseaseProgram = 'diabetes_management' | 'hypertension_control' | 'heart_failure' | 'copd_asthma' | 'ckd' | 'obesity_weight_management' | 'behavioral_health';
/**
 * Patient registry enrollment
 */
export interface RegistryEnrollmentConfig {
    patientId: string;
    attributedProviderId: string;
    attributionDate: Date;
    attributionMethod: AttributionMethod;
    enrollmentDate: Date;
    panelStatus?: PanelStatus;
    metadata?: Record<string, any>;
}
/**
 * Risk score calculation config
 */
export interface RiskScoreConfig {
    patientId: string;
    model: RiskModel;
    calculationDate: Date;
    factors: Array<{
        type: string;
        code: string;
        weight: number;
        description?: string;
    }>;
    adjustments?: Array<{
        type: string;
        value: number;
        reason: string;
    }>;
}
/**
 * Disease registry entry
 */
export interface DiseaseRegistryConfig {
    patientId: string;
    diseaseCode: string;
    diseaseName: string;
    diagnosisDate: Date;
    severity?: string;
    status?: 'active' | 'resolved' | 'in_remission';
    diagnosedBy?: string;
    metadata?: Record<string, any>;
}
/**
 * Quality measure configuration
 */
export interface QualityMeasureConfig {
    patientId: string;
    measureId: string;
    measureSet: MeasureSet;
    measurementPeriodStart: Date;
    measurementPeriodEnd: Date;
    denominatorEligible: boolean;
    denominatorExclusion?: boolean;
    denominatorException?: boolean;
    numeratorCompliant: boolean;
    measureValue?: number;
    calculationDetails?: Record<string, any>;
}
/**
 * Preventive care gap
 */
export interface PreventiveCareGapConfig {
    patientId: string;
    category: PreventiveCareCategory;
    serviceType: string;
    dueDate: Date;
    overdueDays?: number;
    lastCompletedDate?: Date;
    frequency: string;
    guideline: string;
    priority: 'low' | 'medium' | 'high';
}
/**
 * Population segment
 */
export interface PopulationSegmentConfig {
    segmentName: string;
    description: string;
    criteria: {
        ageMin?: number;
        ageMax?: number;
        gender?: string;
        conditions?: string[];
        riskTier?: RiskTier[];
        attributedProvider?: string[];
        customCriteria?: Record<string, any>;
    };
    createdBy: string;
}
/**
 * Outreach campaign
 */
export interface OutreachCampaignConfig {
    campaignName: string;
    description: string;
    targetSegmentId?: string;
    channels: OutreachChannel[];
    startDate: Date;
    endDate?: Date;
    messageTemplate: string;
    goalMetric?: string;
    targetValue?: number;
    createdBy: string;
}
/**
 * Immunization forecast
 */
export interface ImmunizationForecastConfig {
    patientId: string;
    vaccineName: string;
    vaccineCode: string;
    dueDate: Date;
    status: ImmunizationStatus;
    dose: number;
    series: string;
    schedule: string;
    lastAdministeredDate?: Date;
}
/**
 * Panel analytics
 */
export interface PanelAnalytics {
    providerId: string;
    panelSize: number;
    activePatients: number;
    averageAge: number;
    genderDistribution: Record<string, number>;
    riskDistribution: Record<RiskTier, number>;
    topConditions: Array<{
        condition: string;
        count: number;
    }>;
    qualityMeasurePerformance: Record<string, number>;
}
/**
 * Value-based care metrics
 */
export interface ValueBasedMetrics {
    period: {
        start: Date;
        end: Date;
    };
    providerId?: string;
    totalAttributedPatients: number;
    totalCostOfCare: number;
    costPerMemberPerMonth: number;
    qualityScoreComposite: number;
    utilizationMetrics: {
        admissions: number;
        readmissions: number;
        edVisits: number;
        primaryCareVisits: number;
    };
    qualityMetrics: {
        hedisCompositeScore: number;
        acoQualityScore: number;
        mipsQualityScore: number;
    };
    financialMetrics: {
        sharedSavings: number;
        sharedLosses: number;
        netRevenue: number;
    };
}
/**
 * Enrolls a patient in the population health registry.
 * Establishes provider attribution and panel assignment.
 *
 * @param {ModelStatic<Model>} PatientRegistry - Patient registry model
 * @param {RegistryEnrollmentConfig} config - Enrollment configuration
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<Model>} Created registry entry
 *
 * Database optimization: Indexed by patient_id (unique), attributed_provider_id, attribution_date
 * Partitioned by attribution_date for large populations
 * HIPAA: Audit trail for registry enrollment
 *
 * @example
 * ```typescript
 * const enrollment = await addPatientToRegistry(PatientRegistry, {
 *   patientId: 'patient-uuid',
 *   attributedProviderId: 'provider-uuid',
 *   attributionDate: new Date('2025-01-01'),
 *   attributionMethod: 'visit_based',
 *   enrollmentDate: new Date(),
 *   panelStatus: 'active'
 * });
 * ```
 */
export declare function addPatientToRegistry<T extends Model>(PatientRegistry: ModelStatic<T>, config: RegistryEnrollmentConfig, transaction?: Transaction): Promise<T>;
/**
 * Removes patient from registry with reason documentation.
 * Disenrollment preserves historical data.
 *
 * @param {ModelStatic<Model>} PatientRegistry - Patient registry model
 * @param {string} patientId - Patient ID
 * @param {Date} disenrollmentDate - Effective disenrollment date
 * @param {string} reason - Disenrollment reason
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<Model>} Updated registry entry
 *
 * Database optimization: Single-row update with disenrollment metadata
 * HIPAA: Audit trail for disenrollment
 *
 * @example
 * ```typescript
 * await removePatientFromRegistry(PatientRegistry, 'patient-uuid',
 *   new Date(), 'Patient transferred to different health system');
 * ```
 */
export declare function removePatientFromRegistry<T extends Model>(PatientRegistry: ModelStatic<T>, patientId: string, disenrollmentDate: Date, reason: string, transaction?: Transaction): Promise<T>;
/**
 * Updates provider attribution for a patient.
 * Tracks attribution changes over time.
 *
 * @param {ModelStatic<Model>} PatientRegistry - Patient registry model
 * @param {string} patientId - Patient ID
 * @param {string} newProviderId - New attributed provider ID
 * @param {Date} effectiveDate - Effective attribution date
 * @param {AttributionMethod} method - Attribution method
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<Model>} Updated registry entry
 *
 * Database optimization: Single-row update with attribution history
 * HIPAA: Audit trail for attribution changes
 *
 * @example
 * ```typescript
 * await updateRegistryAttribution(PatientRegistry, 'patient-uuid',
 *   'new-provider-uuid', new Date(), 'claims');
 * ```
 */
export declare function updateRegistryAttribution<T extends Model>(PatientRegistry: ModelStatic<T>, patientId: string, newProviderId: string, effectiveDate: Date, method: AttributionMethod, transaction?: Transaction): Promise<T>;
/**
 * Retrieves registry patients with filtering and pagination.
 * Supports provider panel queries, risk tier filters, status filters.
 *
 * @param {ModelStatic<Model>} PatientRegistry - Patient registry model
 * @param {Object} options - Query options
 * @returns {Promise<{data: Model[], total: number}>} Registry patients
 *
 * Database optimization: Composite indexes (attributed_provider_id, panel_status),
 * (risk_tier, panel_status), partitioning by attribution_date
 * Performance: Use pagination, read replicas for analytics
 *
 * @example
 * ```typescript
 * const patients = await getRegistryPatients(PatientRegistry, {
 *   attributedProviderId: 'provider-uuid',
 *   panelStatus: 'active',
 *   riskTier: ['high', 'very_high'],
 *   limit: 100,
 *   offset: 0
 * });
 * ```
 */
export declare function getRegistryPatients<T extends Model>(PatientRegistry: ModelStatic<T>, options?: {
    attributedProviderId?: string;
    panelStatus?: PanelStatus | PanelStatus[];
    riskTier?: RiskTier | RiskTier[];
    attributionDateStart?: Date;
    attributionDateEnd?: Date;
    limit?: number;
    offset?: number;
    includePatient?: boolean;
    transaction?: Transaction;
}): Promise<{
    data: T[];
    total: number;
}>;
/**
 * Synchronizes registry data with external sources.
 * Batch updates for attribution, risk scores, quality measures.
 *
 * @param {ModelStatic<Model>} PatientRegistry - Patient registry model
 * @param {Array} updates - Array of registry updates
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<{successful: number, failed: number}>} Sync results
 *
 * Database optimization: Bulk update operation, batched transactions
 * Performance: Process in batches of 1000, use upsert pattern
 *
 * @example
 * ```typescript
 * const result = await syncRegistryData(PatientRegistry, [
 *   { patientId: 'patient-1', riskScore: 85.5, riskTier: 'high' },
 *   { patientId: 'patient-2', riskScore: 42.3, riskTier: 'medium' }
 * ]);
 * // Returns: { successful: 2, failed: 0 }
 * ```
 */
export declare function syncRegistryData<T extends Model>(PatientRegistry: ModelStatic<T>, updates: Array<{
    patientId: string;
    riskScore?: number;
    riskTier?: RiskTier;
    lastVisitDate?: Date;
    nextScheduledVisit?: Date;
    metadata?: Record<string, any>;
}>, transaction?: Transaction): Promise<{
    successful: number;
    failed: number;
    errors: Array<{
        patientId: string;
        error: string;
    }>;
}>;
/**
 * Calculates comprehensive risk score for a patient.
 * Multi-factor risk calculation using HCC, claims, clinical data.
 *
 * @param {ModelStatic<Model>} RiskScore - Risk score model
 * @param {RiskScoreConfig} config - Risk calculation configuration
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<{score: number, tier: RiskTier, model: Model}>} Risk calculation result
 *
 * Database optimization: Indexed by patient_id, calculation_date, model
 * Performance: Cache risk scores for 24 hours
 *
 * @example
 * ```typescript
 * const result = await calculateRiskScore(RiskScore, {
 *   patientId: 'patient-uuid',
 *   model: 'cms_hcc',
 *   calculationDate: new Date(),
 *   factors: [
 *     { type: 'HCC', code: 'HCC18', weight: 0.318, description: 'Diabetes with chronic complications' },
 *     { type: 'HCC', code: 'HCC85', weight: 0.302, description: 'CHF' },
 *     { type: 'DEMOGRAPHIC', code: 'AGE_75_79_M', weight: 0.451 }
 *   ],
 *   adjustments: [
 *     { type: 'DISEASE_INTERACTION', value: 0.154, reason: 'Diabetes + CHF interaction' }
 *   ]
 * });
 * // Returns: { score: 2.225, tier: 'high', model: RiskScore }
 * ```
 */
export declare function calculateRiskScore<T extends Model>(RiskScore: ModelStatic<T>, config: RiskScoreConfig, transaction?: Transaction): Promise<{
    score: number;
    tier: RiskTier;
    model: T;
}>;
/**
 * Stratifies patient into risk tier based on multiple factors.
 * Assigns risk category for care management prioritization.
 *
 * @param {ModelStatic<Model>} PatientRegistry - Patient registry model
 * @param {string} patientId - Patient ID
 * @param {RiskTier} tier - Risk tier to assign
 * @param {number} score - Risk score
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<Model>} Updated registry entry
 *
 * Database optimization: Single-row update, indexed by risk_tier
 * HIPAA: Audit trail for risk tier assignments
 *
 * @example
 * ```typescript
 * await stratifyPatientRisk(PatientRegistry, 'patient-uuid', 'high', 2.8);
 * ```
 */
export declare function stratifyPatientRisk<T extends Model>(PatientRegistry: ModelStatic<T>, patientId: string, tier: RiskTier, score: number, transaction?: Transaction): Promise<T>;
/**
 * Retrieves risk score history for trending analysis.
 * Tracks risk score changes over time.
 *
 * @param {ModelStatic<Model>} RiskScore - Risk score model
 * @param {string} patientId - Patient ID
 * @param {Object} options - Query options
 * @returns {Promise<Model[]>} Risk score history
 *
 * Database optimization: Composite index (patient_id, calculation_date DESC)
 * Performance: Limit to last 24 calculations by default
 *
 * @example
 * ```typescript
 * const history = await getRiskScoreHistory(RiskScore, 'patient-uuid', {
 *   model: 'cms_hcc',
 *   limit: 12 // Last 12 months
 * });
 * ```
 */
export declare function getRiskScoreHistory<T extends Model>(RiskScore: ModelStatic<T>, patientId: string, options?: {
    model?: RiskModel;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    transaction?: Transaction;
}): Promise<T[]>;
/**
 * Retrieves high-risk patients for proactive outreach.
 * Identifies patients requiring intensive care management.
 *
 * @param {ModelStatic<Model>} PatientRegistry - Patient registry model
 * @param {Object} options - Query options
 * @returns {Promise<Model[]>} High-risk patients
 *
 * Database optimization: Partial index on (risk_tier IN ('high', 'very_high', 'catastrophic'))
 * AND panel_status = 'active'
 * Performance: Use read replica for analytics
 *
 * @example
 * ```typescript
 * const highRisk = await getHighRiskPatients(PatientRegistry, {
 *   attributedProviderId: 'provider-uuid',
 *   riskTier: ['very_high', 'catastrophic'],
 *   limit: 50
 * });
 * ```
 */
export declare function getHighRiskPatients<T extends Model>(PatientRegistry: ModelStatic<T>, options?: {
    attributedProviderId?: string;
    riskTier?: RiskTier[];
    minRiskScore?: number;
    includePatient?: boolean;
    limit?: number;
    offset?: number;
    transaction?: Transaction;
}): Promise<T[]>;
/**
 * Updates risk factors for a patient.
 * Modifies contributing factors for risk calculation.
 *
 * @param {ModelStatic<Model>} RiskScore - Risk score model
 * @param {string} scoreId - Risk score ID
 * @param {Array} newFactors - Updated risk factors
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<Model>} Updated risk score
 *
 * Database optimization: Single-row update with recalculation
 * HIPAA: Audit trail for risk factor changes
 *
 * @example
 * ```typescript
 * await updateRiskFactors(RiskScore, 'score-uuid', [
 *   { type: 'HCC', code: 'HCC18', weight: 0.318, description: 'Diabetes with chronic complications' },
 *   { type: 'HCC', code: 'HCC111', weight: 0.223, description: 'Cancer' }
 * ]);
 * ```
 */
export declare function updateRiskFactors<T extends Model>(RiskScore: ModelStatic<T>, scoreId: string, newFactors: Array<{
    type: string;
    code: string;
    weight: number;
    description?: string;
}>, transaction?: Transaction): Promise<T>;
/**
 * Predicts future risk trend using historical data.
 * Machine learning-based risk trajectory forecasting.
 *
 * @param {ModelStatic<Model>} RiskScore - Risk score model
 * @param {string} patientId - Patient ID
 * @param {number} monthsAhead - Months to forecast
 * @returns {Promise<Object>} Risk prediction
 *
 * Database optimization: Query historical scores, use analytics replica
 * Performance: Cache predictions for 7 days
 *
 * @example
 * ```typescript
 * const prediction = await predictRiskTrend(RiskScore, 'patient-uuid', 6);
 * // Returns: { currentScore: 2.5, predictedScore: 2.8, trend: 'increasing', confidence: 0.78 }
 * ```
 */
export declare function predictRiskTrend(RiskScore: ModelStatic<Model>, patientId: string, monthsAhead?: number): Promise<{
    currentScore: number;
    predictedScore: number;
    predictedTier: RiskTier;
    trend: 'increasing' | 'stable' | 'decreasing';
    confidence: number;
    projectedDate: Date;
}>;
/**
 * Adds patient to disease-specific registry.
 * Enrolls in condition management programs.
 *
 * @param {ModelStatic<Model>} DiseaseRegistry - Disease registry model
 * @param {DiseaseRegistryConfig} config - Disease registry configuration
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<Model>} Created registry entry
 *
 * Database optimization: Composite index (patient_id, disease_code), disease_code for rollup
 * HIPAA: Audit trail for disease registry enrollment
 *
 * @example
 * ```typescript
 * const entry = await addToDiseaseRegistry(DiseaseRegistry, {
 *   patientId: 'patient-uuid',
 *   diseaseCode: 'E11.9',
 *   diseaseName: 'Type 2 Diabetes Mellitus',
 *   diagnosisDate: new Date('2023-05-15'),
 *   severity: 'moderate',
 *   status: 'active',
 *   diagnosedBy: 'provider-uuid'
 * });
 * ```
 */
export declare function addToDiseaseRegistry<T extends Model>(DiseaseRegistry: ModelStatic<T>, config: DiseaseRegistryConfig, transaction?: Transaction): Promise<T>;
/**
 * Updates disease status (active, resolved, in remission).
 * Tracks condition progression over time.
 *
 * @param {ModelStatic<Model>} DiseaseRegistry - Disease registry model
 * @param {string} entryId - Registry entry ID
 * @param {string} status - New disease status
 * @param {Object} metadata - Additional status metadata
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<Model>} Updated registry entry
 *
 * Database optimization: Single-row update with status history
 * HIPAA: Audit trail for disease status changes
 *
 * @example
 * ```typescript
 * await updateDiseaseStatus(DiseaseRegistry, 'entry-uuid', 'in_remission', {
 *   remissionDate: new Date(),
 *   notes: 'HbA1c normalized after lifestyle intervention'
 * });
 * ```
 */
export declare function updateDiseaseStatus<T extends Model>(DiseaseRegistry: ModelStatic<T>, entryId: string, status: 'active' | 'resolved' | 'in_remission', metadata?: {
    resolutionDate?: Date;
    remissionDate?: Date;
    notes?: string;
}, transaction?: Transaction): Promise<T>;
/**
 * Retrieves patients in a specific disease registry.
 * Queries by condition, status, severity.
 *
 * @param {ModelStatic<Model>} DiseaseRegistry - Disease registry model
 * @param {string} diseaseCode - Disease ICD-10 code or category
 * @param {Object} options - Query options
 * @returns {Promise<Model[]>} Disease registry patients
 *
 * Database optimization: Index on disease_code, status
 * Performance: Pagination for large registries
 *
 * @example
 * ```typescript
 * const diabetesPatients = await getDiseaseRegistryPatients(DiseaseRegistry, 'E11', {
 *   status: 'active',
 *   severity: ['moderate', 'severe'],
 *   includePatient: true,
 *   limit: 100
 * });
 * ```
 */
export declare function getDiseaseRegistryPatients<T extends Model>(DiseaseRegistry: ModelStatic<T>, diseaseCode: string, options?: {
    status?: string | string[];
    severity?: string | string[];
    diagnosisDateStart?: Date;
    diagnosisDateEnd?: Date;
    includePatient?: boolean;
    limit?: number;
    offset?: number;
    transaction?: Transaction;
}): Promise<T[]>;
/**
 * Removes patient from disease registry.
 * Disenrolls from condition management program.
 *
 * @param {ModelStatic<Model>} DiseaseRegistry - Disease registry model
 * @param {string} entryId - Registry entry ID
 * @param {string} reason - Removal reason
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<boolean>} Success status
 *
 * Database optimization: Single-row delete with soft delete preservation
 * HIPAA: Audit trail for registry removal
 *
 * @example
 * ```typescript
 * await removeDiseaseRegistryEntry(DiseaseRegistry, 'entry-uuid',
 *   'Condition resolved, patient no longer requires monitoring');
 * ```
 */
export declare function removeDiseaseRegistryEntry<T extends Model>(DiseaseRegistry: ModelStatic<T>, entryId: string, reason: string, transaction?: Transaction): Promise<boolean>;
/**
 * Generates disease registry analytics report.
 * Aggregate statistics for condition prevalence, outcomes.
 *
 * @param {ModelStatic<Model>} DiseaseRegistry - Disease registry model
 * @param {Object} options - Report options
 * @returns {Promise<Object>} Disease registry report
 *
 * Database optimization: Aggregation query with GROUP BY
 * Performance: Use read replica, cache for 1 hour
 *
 * @example
 * ```typescript
 * const report = await generateDiseaseRegistryReport(DiseaseRegistry, {
 *   diseaseCode: 'E11',
 *   period: { start: new Date('2025-01-01'), end: new Date('2025-12-31') }
 * });
 * ```
 */
export declare function generateDiseaseRegistryReport(DiseaseRegistry: ModelStatic<Model>, options?: {
    diseaseCode?: string;
    period?: {
        start: Date;
        end: Date;
    };
}): Promise<{
    totalPatients: number;
    byStatus: Record<string, number>;
    bySeverity: Record<string, number>;
    avgTimeSinceDiagnosis: number;
    newEnrollments: number;
    resolutions: number;
}>;
/**
 * Calculates HEDIS quality measure for a patient.
 * Healthcare Effectiveness Data and Information Set measures.
 *
 * @param {ModelStatic<Model>} QualityMeasure - Quality measure model
 * @param {QualityMeasureConfig} config - Measure configuration
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<Model>} Created quality measure
 *
 * Database optimization: Composite index (patient_id, measure_id, measurement_period_end)
 * Materialized view for measure aggregations
 * Performance: Batch calculation for multiple patients
 *
 * @example
 * ```typescript
 * const measure = await calculateHedisMeasure(QualityMeasure, {
 *   patientId: 'patient-uuid',
 *   measureId: 'CDC-H7', // HbA1c test for diabetes
 *   measureSet: 'hedis',
 *   measurementPeriodStart: new Date('2025-01-01'),
 *   measurementPeriodEnd: new Date('2025-12-31'),
 *   denominatorEligible: true,
 *   numeratorCompliant: true,
 *   calculationDetails: { lastA1cDate: '2025-09-15', a1cValue: 6.8 }
 * });
 * ```
 */
export declare function calculateHedisMeasure<T extends Model>(QualityMeasure: ModelStatic<T>, config: QualityMeasureConfig, transaction?: Transaction): Promise<T>;
/**
 * Calculates ACO quality measure for a patient.
 * Accountable Care Organization MSSP quality measures.
 *
 * @param {ModelStatic<Model>} QualityMeasure - Quality measure model
 * @param {QualityMeasureConfig} config - Measure configuration
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<Model>} Created quality measure
 *
 * Database optimization: Same as HEDIS measures
 * Performance: Batch calculation recommended
 *
 * @example
 * ```typescript
 * const acoMeasure = await calculateAcoMeasure(QualityMeasure, {
 *   patientId: 'patient-uuid',
 *   measureId: 'ACO-13', // Falls screening
 *   measureSet: 'aco',
 *   measurementPeriodStart: new Date('2025-01-01'),
 *   measurementPeriodEnd: new Date('2025-12-31'),
 *   denominatorEligible: true,
 *   numeratorCompliant: true
 * });
 * ```
 */
export declare function calculateAcoMeasure<T extends Model>(QualityMeasure: ModelStatic<T>, config: QualityMeasureConfig, transaction?: Transaction): Promise<T>;
/**
 * Calculates MIPS quality measure for a patient.
 * Merit-based Incentive Payment System measures.
 *
 * @param {ModelStatic<Model>} QualityMeasure - Quality measure model
 * @param {QualityMeasureConfig} config - Measure configuration
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<Model>} Created quality measure
 *
 * Database optimization: Same as HEDIS measures
 * Performance: Batch calculation recommended
 *
 * @example
 * ```typescript
 * const mipsMeasure = await calculateMipsMeasure(QualityMeasure, {
 *   patientId: 'patient-uuid',
 *   measureId: 'MIPS236', // Controlling high blood pressure
 *   measureSet: 'mips',
 *   measurementPeriodStart: new Date('2025-01-01'),
 *   measurementPeriodEnd: new Date('2025-12-31'),
 *   denominatorEligible: true,
 *   numeratorCompliant: true,
 *   measureValue: 128/78
 * });
 * ```
 */
export declare function calculateMipsMeasure<T extends Model>(QualityMeasure: ModelStatic<T>, config: QualityMeasureConfig, transaction?: Transaction): Promise<T>;
/**
 * Retrieves quality measures for a patient.
 * Returns patient-level measure performance.
 *
 * @param {ModelStatic<Model>} QualityMeasure - Quality measure model
 * @param {string} patientId - Patient ID
 * @param {Object} options - Query options
 * @returns {Promise<Model[]>} Patient quality measures
 *
 * Database optimization: Composite index (patient_id, measurement_period_end, measure_set)
 * Performance: Filter by measurement period
 *
 * @example
 * ```typescript
 * const measures = await getQualityMeasuresByPatient(QualityMeasure, 'patient-uuid', {
 *   measureSet: 'hedis',
 *   measurementPeriodEnd: new Date('2025-12-31')
 * });
 * ```
 */
export declare function getQualityMeasuresByPatient<T extends Model>(QualityMeasure: ModelStatic<T>, patientId: string, options?: {
    measureSet?: MeasureSet | MeasureSet[];
    measureId?: string | string[];
    measurementPeriodStart?: Date;
    measurementPeriodEnd?: Date;
    transaction?: Transaction;
}): Promise<T[]>;
/**
 * Aggregates quality measures for a population.
 * Calculates measure performance rates across patient panel.
 *
 * @param {ModelStatic<Model>} QualityMeasure - Quality measure model
 * @param {Object} options - Aggregation options
 * @returns {Promise<Object>} Population measure performance
 *
 * Database optimization: Materialized view for aggregations, refresh nightly
 * Performance: Use read replica, cache for 1 hour
 *
 * @example
 * ```typescript
 * const popPerformance = await getQualityMeasuresByPopulation(QualityMeasure, {
 *   patientIds: providerPanel,
 *   measureSet: 'hedis',
 *   measurementPeriodEnd: new Date('2025-12-31')
 * });
 * // Returns: { CDC-H7: { rate: 85.5, numerator: 342, denominator: 400 }, ... }
 * ```
 */
export declare function getQualityMeasuresByPopulation(QualityMeasure: ModelStatic<Model>, options: {
    patientIds?: string[];
    providerId?: string;
    measureSet?: MeasureSet;
    measurementPeriodEnd: Date;
}): Promise<Record<string, {
    rate: number;
    numerator: number;
    denominator: number;
    exclusions: number;
}>>;
/**
 * Batch recalculates quality measures for patients.
 * Refreshes measures needing recalculation.
 *
 * @param {ModelStatic<Model>} QualityMeasure - Quality measure model
 * @param {Object} options - Recalculation options
 * @returns {Promise<{processed: number, updated: number}>} Recalculation results
 *
 * Database optimization: Batch update operations, indexed by recalculate_needed flag
 * Performance: Process in batches of 1000 patients
 *
 * @example
 * ```typescript
 * const result = await refreshQualityMeasures(QualityMeasure, {
 *   measureSet: 'hedis',
 *   measurementPeriodEnd: new Date('2025-12-31'),
 *   limit: 5000
 * });
 * // Returns: { processed: 5000, updated: 4235 }
 * ```
 */
export declare function refreshQualityMeasures(QualityMeasure: ModelStatic<Model>, options?: {
    measureSet?: MeasureSet;
    measureId?: string;
    measurementPeriodEnd?: Date;
    limit?: number;
}): Promise<{
    processed: number;
    updated: number;
}>;
/**
 * Generates comprehensive quality report.
 * Multi-measure performance dashboard.
 *
 * @param {ModelStatic<Model>} QualityMeasure - Quality measure model
 * @param {Object} options - Report options
 * @returns {Promise<Object>} Quality report
 *
 * Database optimization: Use materialized views, read replica
 * Performance: Cache for 1 hour
 *
 * @example
 * ```typescript
 * const report = await generateQualityReport(QualityMeasure, {
 *   providerId: 'provider-uuid',
 *   measureSet: 'hedis',
 *   period: { start: new Date('2025-01-01'), end: new Date('2025-12-31') }
 * });
 * ```
 */
export declare function generateQualityReport(QualityMeasure: ModelStatic<Model>, options: {
    providerId?: string;
    patientIds?: string[];
    measureSet?: MeasureSet;
    period: {
        start: Date;
        end: Date;
    };
}): Promise<{
    period: {
        start: Date;
        end: Date;
    };
    totalMeasures: number;
    overallComplianceRate: number;
    byMeasure: Record<string, {
        rate: number;
        numerator: number;
        denominator: number;
    }>;
    benchmark?: Record<string, number>;
}>;
export declare function identifyPreventiveCareGaps<T extends Model>(PreventiveCareGap: ModelStatic<T>, patientId: string, patientData: {
    age: number;
    gender: string;
    lastScreenings: Record<string, Date>;
    immunizations: string[];
}, transaction?: Transaction): Promise<T[]>;
export declare function getPreventiveCareGapsByPatient<T extends Model>(PreventiveCareGap: ModelStatic<T>, patientId: string, options?: {
    category?: PreventiveCareCategory;
    status?: string;
    transaction?: Transaction;
}): Promise<T[]>;
export declare function getPreventiveCareGapsByPopulation(PreventiveCareGap: ModelStatic<Model>, options: {
    patientIds?: string[];
    category?: PreventiveCareCategory;
}): Promise<Record<string, number>>;
export declare function closePreventiveCareGap<T extends Model>(PreventiveCareGap: ModelStatic<T>, gapId: string, completionInfo: {
    completedDate: Date;
    servicePerformed: string;
}, transaction?: Transaction): Promise<T>;
export declare function generatePreventiveCareDashboard(PreventiveCareGap: ModelStatic<Model>, options: {
    providerId?: string;
    period: {
        start: Date;
        end: Date;
    };
}): Promise<{
    openGaps: number;
    closedGaps: number;
    byCategory: Record<string, number>;
}>;
export declare function createPopulationSegment<T extends Model>(PopulationSegment: ModelStatic<T>, config: PopulationSegmentConfig, transaction?: Transaction): Promise<T>;
export declare function addPatientsToSegment(SegmentMembership: ModelStatic<Model>, segmentId: string, patientIds: string[], transaction?: Transaction): Promise<number>;
export declare function getSegmentPatients<T extends Model>(SegmentMembership: ModelStatic<T>, segmentId: string, options?: {
    includePatient?: boolean;
    limit?: number;
    offset?: number;
}): Promise<T[]>;
export declare function analyzeSegmentCharacteristics(SegmentMembership: ModelStatic<Model>, segmentId: string): Promise<{
    size: number;
    avgAge: number;
    genderDist: Record<string, number>;
    riskDist: Record<string, number>;
}>;
export declare function createOutreachCampaign<T extends Model>(OutreachCampaign: ModelStatic<T>, config: OutreachCampaignConfig, transaction?: Transaction): Promise<T>;
export declare function addPatientsToOutreach(OutreachEnrollment: ModelStatic<Model>, campaignId: string, patientIds: string[], transaction?: Transaction): Promise<number>;
export declare function trackOutreachResponse<T extends Model>(OutreachEnrollment: ModelStatic<T>, enrollmentId: string, response: {
    responseDate: Date;
    responseType: string;
    outcome?: string;
}, transaction?: Transaction): Promise<T>;
export declare function generateOutreachReport(OutreachEnrollment: ModelStatic<Model>, campaignId: string): Promise<{
    totalEnrolled: number;
    responded: number;
    responseRate: number;
    outcomes: Record<string, number>;
}>;
export declare function getProviderPanel<T extends Model>(PatientRegistry: ModelStatic<T>, providerId: string, options?: {
    panelStatus?: PanelStatus;
    includePatient?: boolean;
}): Promise<T[]>;
export declare function updatePanelSize(ProviderPanel: ModelStatic<Model>, providerId: string, maxPanelSize: number, transaction?: Transaction): Promise<void>;
export declare function analyzePanelCharacteristics(PatientRegistry: ModelStatic<Model>, providerId: string): Promise<PanelAnalytics>;
export declare function enrollChronicDiseaseProgram<T extends Model>(ChronicDiseaseEnrollment: ModelStatic<T>, patientId: string, program: ChronicDiseaseProgram, enrollmentDate: Date, transaction?: Transaction): Promise<T>;
export declare function trackChronicDiseaseMetrics<T extends Model>(ChronicDiseaseMetric: ModelStatic<T>, patientId: string, program: ChronicDiseaseProgram, metrics: Record<string, number>, measurementDate: Date, transaction?: Transaction): Promise<T>;
export declare function generateChronicDiseaseReport(ChronicDiseaseEnrollment: ModelStatic<Model>, program: ChronicDiseaseProgram, options: {
    providerId?: string;
    period: {
        start: Date;
        end: Date;
    };
}): Promise<{
    totalEnrolled: number;
    activelyManaged: number;
    outcomes: Record<string, number>;
}>;
export declare function calculateValueBasedMetrics(models: {
    PatientRegistry: ModelStatic<Model>;
    QualityMeasure: ModelStatic<Model>;
    Claims: ModelStatic<Model>;
}, options: {
    providerId: string;
    period: {
        start: Date;
        end: Date;
    };
}): Promise<ValueBasedMetrics>;
export declare function generateValueBasedReport(models: {
    PatientRegistry: ModelStatic<Model>;
    QualityMeasure: ModelStatic<Model>;
    Claims: ModelStatic<Model>;
}, options: {
    providerId?: string;
    period: {
        start: Date;
        end: Date;
    };
}): Promise<{
    summary: ValueBasedMetrics;
    qualityPerformance: Record<string, number>;
    costTrends: Array<{
        month: string;
        pmpm: number;
    }>;
    utilizationTrends: Array<{
        month: string;
        admissions: number;
        edVisits: number;
    }>;
}>;
//# sourceMappingURL=health-population-health-kit.d.ts.map