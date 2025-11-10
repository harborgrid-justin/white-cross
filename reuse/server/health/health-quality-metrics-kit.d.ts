/**
 * LOC: QMKIT001
 * File: /reuse/server/health/health-quality-metrics-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize
 *   - sequelize/types
 *   - ../../../src/models (Patient, Admission, Order, Diagnosis, Medication, Infection)
 *   - ../../../src/config/database
 *   - date-fns
 *   - lodash
 *
 * DOWNSTREAM (imported by):
 *   - Quality improvement services
 *   - Performance dashboard systems
 *   - CMS/HEDIS reporting modules
 *   - Clinical governance interfaces
 *   - Benchmarking and analytics modules
 */
/**
 * HEDIS measure result
 */
export interface HEDISMeasure {
    measureId: string;
    name: string;
    denominator: number;
    numerator: number;
    rate: number;
    performanceGoal: number;
    status: 'passing' | 'failing' | 'insufficient_data';
    lastUpdated: Date;
}
/**
 * Core measure result
 */
export interface CoreMeasure {
    measureId: string;
    name: string;
    eligible: number;
    compliant: number;
    complianceRate: number;
    benchmark: number;
    variance: number;
}
/**
 * Patient safety indicator result
 */
export interface PatientSafetyIndicator {
    indicatorId: string;
    name: string;
    incidents: number;
    riskAdjustedRate: number;
    benchmarkRate: number;
    flagged: boolean;
}
/**
 * Hospital-acquired condition detection
 */
export interface HospitalAcquiredCondition {
    hacCode: string;
    name: string;
    patientId: string;
    admissionId: string;
    detectedDate: Date;
    preventable: boolean;
    complicationCost: number;
    paymentImpact: string;
}
/**
 * Readmission analysis result
 */
export interface ReadmissionAnalysis {
    patientId: string;
    readmitted: boolean;
    daysSinceDischarge: number;
    principalDiagnosis: string;
    readmissionDiagnosis: string;
    unplanned: boolean;
    preventable: boolean;
    riskFactors: string[];
}
/**
 * Mortality rate calculation
 */
export interface MortalityMetric {
    cohort: string;
    totalDischarges: number;
    deaths: number;
    mortalityRate: number;
    expectedRate: number;
    standardizedMortalityRatio: number;
    variance: number;
}
/**
 * Length of stay analysis
 */
export interface LengthOfStayAnalysis {
    caseType: string;
    avgLOS: number;
    medianLOS: number;
    p25LOS: number;
    p75LOS: number;
    benchmark: number;
    varianceFromBenchmark: number;
    outlierPercentage: number;
}
/**
 * Infection surveillance result
 */
export interface InfectionSurveillance {
    infectionType: string;
    totalExposures: number;
    infectionCount: number;
    rate: number;
    benchmarkRate: number;
    flagged: boolean;
    trend: 'improving' | 'stable' | 'worsening';
}
/**
 * Medication error report
 */
export interface MedicationError {
    errorId: string;
    patientId: string;
    medicationName: string;
    errorType: string;
    severity: 'minor' | 'moderate' | 'serious';
    harmCategory: 'no_harm' | 'potential_harm' | 'temporary_harm' | 'permanent_harm' | 'death';
    preventable: boolean;
    rootCause: string;
    reportDate: Date;
}
/**
 * Adverse event report
 */
export interface AdverseEventReport {
    eventId: string;
    patientId: string;
    eventType: string;
    severity: 'minor' | 'moderate' | 'serious' | 'sentinel';
    preventable: boolean;
    reportedBy: string;
    reportDate: Date;
    investigationStatus: string;
}
/**
 * Quality improvement initiative
 */
export interface QualityImprovementInitiative {
    initiativeId: string;
    name: string;
    targetMetric: string;
    baselinePerformance: number;
    currentPerformance: number;
    targetPerformance: number;
    timeframe: string;
    status: 'planning' | 'active' | 'completed' | 'paused';
    investmentRequired: number;
}
/**
 * Benchmark comparison result
 */
export interface BenchmarkComparison {
    metric: string;
    ourcPerformance: number;
    regionalBenchmark: number;
    nationalBenchmark: number;
    percentile: number;
    trend: 'improving' | 'stable' | 'declining';
}
/**
 * 1. Calculates colorectal cancer screening HEDIS measure
 *
 * @param {Date} startDate - Measurement start date
 * @param {Date} endDate - Measurement end date
 * @returns {Promise<HEDISMeasure>} HEDIS colorectal screening measure
 *
 * @example
 * ```typescript
 * const crcScreening = await calculateCRCScreeningHEDIS(
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * console.log(`Screening Rate: ${crcScreening.rate}%`);
 * ```
 */
export declare function calculateCRCScreeningHEDIS(startDate: Date, endDate: Date): Promise<HEDISMeasure>;
/**
 * 2. Calculates breast cancer screening HEDIS measure (mammography)
 *
 * @param {Date} startDate - Measurement start date
 * @param {Date} endDate - Measurement end date
 * @returns {Promise<HEDISMeasure>} HEDIS breast screening measure
 *
 * @example
 * ```typescript
 * const bcsScreening = await calculateBreastCancerScreeningHEDIS(
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
export declare function calculateBreastCancerScreeningHEDIS(startDate: Date, endDate: Date): Promise<HEDISMeasure>;
/**
 * 3. Calculates diabetes care HEDIS measure (HbA1c testing and control)
 *
 * @param {Date} startDate - Measurement start date
 * @param {Date} endDate - Measurement end date
 * @returns {Promise<HEDISMeasure>} HEDIS diabetes care measure
 *
 * @example
 * ```typescript
 * const diabetesCare = await calculateDiabetesCareHEDIS(
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
export declare function calculateDiabetesCareHEDIS(startDate: Date, endDate: Date): Promise<HEDISMeasure>;
/**
 * 4. Calculates blood pressure control HEDIS measure
 *
 * @param {Date} startDate - Measurement start date
 * @param {Date} endDate - Measurement end date
 * @returns {Promise<HEDISMeasure>} HEDIS blood pressure control measure
 *
 * @example
 * ```typescript
 * const bpControl = await calculateBloodPressureControlHEDIS(
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
export declare function calculateBloodPressureControlHEDIS(startDate: Date, endDate: Date): Promise<HEDISMeasure>;
/**
 * 5. Calculates asthma controller medication use HEDIS measure
 *
 * @param {Date} startDate - Measurement start date
 * @param {Date} endDate - Measurement end date
 * @returns {Promise<HEDISMeasure>} HEDIS asthma medication measure
 *
 * @example
 * ```typescript
 * const asthmaControl = await calculateAsthmaControlHEDIS(
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
export declare function calculateAsthmaControlHEDIS(startDate: Date, endDate: Date): Promise<HEDISMeasure>;
/**
 * 6. Calculates depression screening and follow-up HEDIS measure
 *
 * @param {Date} startDate - Measurement start date
 * @param {Date} endDate - Measurement end date
 * @returns {Promise<HEDISMeasure>} HEDIS depression screening measure
 *
 * @example
 * ```typescript
 * const depressionScreen = await calculateDepressionScreeningHEDIS(
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
export declare function calculateDepressionScreeningHEDIS(startDate: Date, endDate: Date): Promise<HEDISMeasure>;
/**
 * 7. Calculates immunization rates (flu, pneumococcal) HEDIS measure
 *
 * @param {Date} startDate - Measurement start date
 * @param {Date} endDate - Measurement end date
 * @returns {Promise<HEDISMeasure>} HEDIS immunization measure
 *
 * @example
 * ```typescript
 * const immunization = await calculateImmunizationRatesHEDIS(
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
export declare function calculateImmunizationRatesHEDIS(startDate: Date, endDate: Date): Promise<HEDISMeasure>;
/**
 * 8. Calculates medication adherence for chronic conditions HEDIS measure
 *
 * @param {Date} startDate - Measurement start date
 * @param {Date} endDate - Measurement end date
 * @returns {Promise<HEDISMeasure>} HEDIS medication adherence measure
 *
 * @example
 * ```typescript
 * const medAdherence = await calculateMedicationAdherenceHEDIS(
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
export declare function calculateMedicationAdherenceHEDIS(startDate: Date, endDate: Date): Promise<HEDISMeasure>;
/**
 * 9. Calculates acute myocardial infarction (AMI) mortality core measure
 *
 * @param {Date} startDate - Measurement start date
 * @param {Date} endDate - Measurement end date
 * @returns {Promise<CoreMeasure>} AMI mortality core measure
 *
 * @example
 * ```typescript
 * const amiMortality = await calculateAMIMortality(
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
export declare function calculateAMIMortality(startDate: Date, endDate: Date): Promise<CoreMeasure>;
/**
 * 10. Calculates heart failure mortality core measure
 *
 * @param {Date} startDate - Measurement start date
 * @param {Date} endDate - Measurement end date
 * @returns {Promise<CoreMeasure>} Heart failure mortality measure
 *
 * @example
 * ```typescript
 * const hfMortality = await calculateHeartFailureMortality(
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
export declare function calculateHeartFailureMortality(startDate: Date, endDate: Date): Promise<CoreMeasure>;
/**
 * 11. Calculates pneumonia mortality core measure
 *
 * @param {Date} startDate - Measurement start date
 * @param {Date} endDate - Measurement end date
 * @returns {Promise<CoreMeasure>} Pneumonia mortality measure
 *
 * @example
 * ```typescript
 * const pneuMortality = await calculatePneumoniaMortality(
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
export declare function calculatePneumoniaMortality(startDate: Date, endDate: Date): Promise<CoreMeasure>;
/**
 * 12. Calculates sepsis mortality core measure
 *
 * @param {Date} startDate - Measurement start date
 * @param {Date} endDate - Measurement end date
 * @returns {Promise<CoreMeasure>} Sepsis mortality measure
 *
 * @example
 * ```typescript
 * const sepsisMort = await calculateSepsisMortality(
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
export declare function calculateSepsisMortality(startDate: Date, endDate: Date): Promise<CoreMeasure>;
/**
 * 13. Calculates stroke mortality core measure
 *
 * @param {Date} startDate - Measurement start date
 * @param {Date} endDate - Measurement end date
 * @returns {Promise<CoreMeasure>} Stroke mortality measure
 *
 * @example
 * ```typescript
 * const strokeMort = await calculateStrokeMortality(
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
export declare function calculateStrokeMortality(startDate: Date, endDate: Date): Promise<CoreMeasure>;
/**
 * 14. Calculates ACEI/ARB for heart failure measure
 *
 * @param {Date} startDate - Measurement start date
 * @param {Date} endDate - Measurement end date
 * @returns {Promise<CoreMeasure>} ACEI/ARB therapy measure
 *
 * @example
 * ```typescript
 * const aceArb = await calculateACEARBHeartFailure(
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
export declare function calculateACEARBHeartFailure(startDate: Date, endDate: Date): Promise<CoreMeasure>;
/**
 * 15. Calculates beta-blocker for heart failure measure
 *
 * @param {Date} startDate - Measurement start date
 * @param {Date} endDate - Measurement end date
 * @returns {Promise<CoreMeasure>} Beta-blocker therapy measure
 *
 * @example
 * ```typescript
 * const betaBlocker = await calculateBetaBlockerHeartFailure(
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
export declare function calculateBetaBlockerHeartFailure(startDate: Date, endDate: Date): Promise<CoreMeasure>;
/**
 * 16. Calculates aspirin for AMI measure
 *
 * @param {Date} startDate - Measurement start date
 * @param {Date} endDate - Measurement end date
 * @returns {Promise<CoreMeasure>} Aspirin therapy measure
 *
 * @example
 * ```typescript
 * const aspirinAMI = await calculateAspirinAMI(
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
export declare function calculateAspirinAMI(startDate: Date, endDate: Date): Promise<CoreMeasure>;
/**
 * 17. Detects postoperative deep vein thrombosis (DVT) incidents
 *
 * @param {Date} startDate - Measurement start date
 * @param {Date} endDate - Measurement end date
 * @returns {Promise<PatientSafetyIndicator>} DVT safety indicator
 *
 * @example
 * ```typescript
 * const dvtIndicator = await detectPostopDVT(
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
export declare function detectPostopDVT(startDate: Date, endDate: Date): Promise<PatientSafetyIndicator>;
/**
 * 18. Detects postoperative pulmonary embolism (PE) incidents
 *
 * @param {Date} startDate - Measurement start date
 * @param {Date} endDate - Measurement end date
 * @returns {Promise<PatientSafetyIndicator>} PE safety indicator
 *
 * @example
 * ```typescript
 * const peIndicator = await detectPostopPE(
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
export declare function detectPostopPE(startDate: Date, endDate: Date): Promise<PatientSafetyIndicator>;
/**
 * 19. Detects postoperative sepsis incidents
 *
 * @param {Date} startDate - Measurement start date
 * @param {Date} endDate - Measurement end date
 * @returns {Promise<PatientSafetyIndicator>} Sepsis safety indicator
 *
 * @example
 * ```typescript
 * const sepsisIndicator = await detectPostopSepsis(
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
export declare function detectPostopSepsis(startDate: Date, endDate: Date): Promise<PatientSafetyIndicator>;
/**
 * 20. Detects accidental puncture/laceration incidents
 *
 * @param {Date} startDate - Measurement start date
 * @param {Date} endDate - Measurement end date
 * @returns {Promise<PatientSafetyIndicator>} Puncture/laceration indicator
 *
 * @example
 * ```typescript
 * const punctureIndicator = await detectAccidentalPuncture(
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
export declare function detectAccidentalPuncture(startDate: Date, endDate: Date): Promise<PatientSafetyIndicator>;
/**
 * 21. Detects hospital-acquired infection (HAI) incidents
 *
 * @param {Date} startDate - Measurement start date
 * @param {Date} endDate - Measurement end date
 * @returns {Promise<PatientSafetyIndicator>} HAI safety indicator
 *
 * @example
 * ```typescript
 * const haiIndicator = await detectHospitalAcquiredInfection(
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
export declare function detectHospitalAcquiredInfection(startDate: Date, endDate: Date): Promise<PatientSafetyIndicator>;
/**
 * 22. Detects death from low mortality diagnosis group (PSI-02)
 *
 * @param {Date} startDate - Measurement start date
 * @param {Date} endDate - Measurement end date
 * @returns {Promise<PatientSafetyIndicator>} Low mortality diagnosis mortality indicator
 *
 * @example
 * ```typescript
 * const lowMortIndicator = await detectUnexpectedDeathLowMortDx(
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
export declare function detectUnexpectedDeathLowMortDx(startDate: Date, endDate: Date): Promise<PatientSafetyIndicator>;
/**
 * 23. Detects decubitus ulcer (pressure ulcer) PSI-03
 *
 * @param {Date} startDate - Measurement start date
 * @param {Date} endDate - Measurement end date
 * @returns {Promise<PatientSafetyIndicator>} Pressure ulcer indicator
 *
 * @example
 * ```typescript
 * const decubitusIndicator = await detectDecubitusUlcer(
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
export declare function detectDecubitusUlcer(startDate: Date, endDate: Date): Promise<PatientSafetyIndicator>;
/**
 * 24. Detects iatrogenic pneumothorax PSI-06
 *
 * @param {Date} startDate - Measurement start date
 * @param {Date} endDate - Measurement end date
 * @returns {Promise<PatientSafetyIndicator>} Pneumothorax indicator
 *
 * @example
 * ```typescript
 * const pneumoIndicator = await detectIatrognicPneumothorax(
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
export declare function detectIatrognicPneumothorax(startDate: Date, endDate: Date): Promise<PatientSafetyIndicator>;
/**
 * 25. Detects CLABSI (Central Line-Associated Bloodstream Infection)
 *
 * @param {Date} startDate - Measurement start date
 * @param {Date} endDate - Measurement end date
 * @returns {Promise<HospitalAcquiredCondition[]>} CLABSI detections
 *
 * @example
 * ```typescript
 * const clabsiCases = await detectCLABSI(
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
export declare function detectCLABSI(startDate: Date, endDate: Date): Promise<HospitalAcquiredCondition[]>;
/**
 * 26. Detects CAUTI (Catheter-Associated Urinary Tract Infection)
 *
 * @param {Date} startDate - Measurement start date
 * @param {Date} endDate - Measurement end date
 * @returns {Promise<HospitalAcquiredCondition[]>} CAUTI detections
 *
 * @example
 * ```typescript
 * const cautiCases = await detectCAUTI(
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
export declare function detectCAUTI(startDate: Date, endDate: Date): Promise<HospitalAcquiredCondition[]>;
/**
 * 27. Detects SSI (Surgical Site Infection)
 *
 * @param {Date} startDate - Measurement start date
 * @param {Date} endDate - Measurement end date
 * @returns {Promise<HospitalAcquiredCondition[]>} SSI detections
 *
 * @example
 * ```typescript
 * const ssiCases = await detectSSI(
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
export declare function detectSSI(startDate: Date, endDate: Date): Promise<HospitalAcquiredCondition[]>;
/**
 * 28. Detects VAP (Ventilator-Associated Pneumonia)
 *
 * @param {Date} startDate - Measurement start date
 * @param {Date} endDate - Measurement end date
 * @returns {Promise<HospitalAcquiredCondition[]>} VAP detections
 *
 * @example
 * ```typescript
 * const vapCases = await detectVAP(
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
export declare function detectVAP(startDate: Date, endDate: Date): Promise<HospitalAcquiredCondition[]>;
/**
 * 29. Detects healthcare-associated C. difficile infection
 *
 * @param {Date} startDate - Measurement start date
 * @param {Date} endDate - Measurement end date
 * @returns {Promise<HospitalAcquiredCondition[]>} C. diff detections
 *
 * @example
 * ```typescript
 * const cdiffCases = await detectClostridiumDifficile(
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
export declare function detectClostridiumDifficile(startDate: Date, endDate: Date): Promise<HospitalAcquiredCondition[]>;
/**
 * 30. Detects MRSA infections
 *
 * @param {Date} startDate - Measurement start date
 * @param {Date} endDate - Measurement end date
 * @returns {Promise<HospitalAcquiredCondition[]>} MRSA detections
 *
 * @example
 * ```typescript
 * const mrsaCases = await detectMRSA(
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
export declare function detectMRSA(startDate: Date, endDate: Date): Promise<HospitalAcquiredCondition[]>;
/**
 * 31. Analyzes 30-day readmissions by condition
 *
 * @param {string} diagnosisCode - Primary diagnosis code
 * @param {Date} startDate - Measurement start date
 * @param {Date} endDate - Measurement end date
 * @returns {Promise<ReadmissionAnalysis[]>} Readmission cases
 *
 * @example
 * ```typescript
 * const readmissions = await analyze30DayReadmissions(
 *   'I50.9',
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
export declare function analyze30DayReadmissions(diagnosisCode: string, startDate: Date, endDate: Date): Promise<ReadmissionAnalysis[]>;
/**
 * 32. Calculates condition-specific mortality rates
 *
 * @param {string} diagnosisCode - Primary diagnosis code
 * @param {Date} startDate - Measurement start date
 * @param {Date} endDate - Measurement end date
 * @returns {Promise<MortalityMetric>} Mortality metric
 *
 * @example
 * ```typescript
 * const amMortality = await calculateConditionMortalityRate(
 *   'I21.9',
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
export declare function calculateConditionMortalityRate(diagnosisCode: string, startDate: Date, endDate: Date): Promise<MortalityMetric>;
/**
 * 33. Analyzes length of stay by diagnosis
 *
 * @param {string} diagnosisCode - Primary diagnosis code
 * @param {Date} startDate - Measurement start date
 * @param {Date} endDate - Measurement end date
 * @returns {Promise<LengthOfStayAnalysis>} LOS analysis
 *
 * @example
 * ```typescript
 * const losAnalysis = await analyzeLengthOfStayByDiagnosis(
 *   'I50.9',
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
export declare function analyzeLengthOfStayByDiagnosis(diagnosisCode: string, startDate: Date, endDate: Date): Promise<LengthOfStayAnalysis>;
/**
 * 34. Tracks infection surveillance metrics (rate per 1000 patient days)
 *
 * @param {Date} startDate - Measurement start date
 * @param {Date} endDate - Measurement end date
 * @returns {Promise<InfectionSurveillance[]>} Infection surveillance data
 *
 * @example
 * ```typescript
 * const infectionSurveillance = await trackInfectionSurveillance(
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
export declare function trackInfectionSurveillance(startDate: Date, endDate: Date): Promise<InfectionSurveillance[]>;
/**
 * 35. Tracks medication error incidents
 *
 * @param {Date} startDate - Measurement start date
 * @param {Date} endDate - Measurement end date
 * @returns {Promise<MedicationError[]>} Medication error incidents
 *
 * @example
 * ```typescript
 * const medErrors = await trackMedicationErrors(
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
export declare function trackMedicationErrors(startDate: Date, endDate: Date): Promise<MedicationError[]>;
/**
 * 36. Tracks adverse event reporting and trends
 *
 * @param {Date} startDate - Measurement start date
 * @param {Date} endDate - Measurement end date
 * @returns {Promise<AdverseEventReport[]>} Adverse event reports
 *
 * @example
 * ```typescript
 * const adverseEvents = await trackAdverseEvents(
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
export declare function trackAdverseEvents(startDate: Date, endDate: Date): Promise<AdverseEventReport[]>;
/**
 * 37. Summarizes quality improvement initiative progress
 *
 * @param {string} initiativeId - Initiative identifier
 * @returns {Promise<QualityImprovementInitiative>} Initiative details
 *
 * @example
 * ```typescript
 * const qiProgress = await getQualityImprovementProgress('qi-sepsis-001');
 * ```
 */
export declare function getQualityImprovementProgress(initiativeId: string): Promise<QualityImprovementInitiative>;
/**
 * 38. Benchmarks organizational performance against regional/national standards
 *
 * @param {string} metric - Quality metric name
 * @returns {Promise<BenchmarkComparison>} Benchmark comparison
 *
 * @example
 * ```typescript
 * const benchmarkComparison = await getBenchmarkComparison('30-day_readmission_heart_failure');
 * ```
 */
export declare function getBenchmarkComparison(metric: string): Promise<BenchmarkComparison>;
/**
 * 39. Generates comprehensive quality dashboard summary
 *
 * @returns {Promise<any>} Dashboard summary with all key metrics
 *
 * @example
 * ```typescript
 * const qiDashboard = await generateQualityDashboard();
 * ```
 */
export declare function generateQualityDashboard(): Promise<any>;
/**
 * 40. Analyzes sentinel events for investigation
 *
 * @param {Date} startDate - Measurement start date
 * @param {Date} endDate - Measurement end date
 * @returns {Promise<any>} Sentinel events requiring investigation
 *
 * @example
 * ```typescript
 * const sentinelEvents = await analyzeSentinelEvents(
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
export declare function analyzeSentinelEvents(startDate: Date, endDate: Date): Promise<any>;
/**
 * 41. Generates preventable complications analysis
 *
 * @param {Date} startDate - Measurement start date
 * @param {Date} endDate - Measurement end date
 * @returns {Promise<any>} Preventable complications summary
 *
 * @example
 * ```typescript
 * const preventableComps = await analyzePreventableComplications(
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
export declare function analyzePreventableComplications(startDate: Date, endDate: Date): Promise<any>;
/**
 * 42. Generates quality scorecard for leadership reporting
 *
 * @returns {Promise<any>} Quality scorecard
 *
 * @example
 * ```typescript
 * const qualityScorecard = await generateQualityScorecard();
 * ```
 */
export declare function generateQualityScorecard(): Promise<any>;
//# sourceMappingURL=health-quality-metrics-kit.d.ts.map