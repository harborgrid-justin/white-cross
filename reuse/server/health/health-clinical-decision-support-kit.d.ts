/**
 * LOC: CLINKIT001
 * File: /reuse/server/health/health-clinical-decision-support-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize
 *   - sequelize/types
 *   - ../../../src/models (Patient, Medication, Clinical*, Order, Provider)
 *   - ../../../src/config/database
 *   - lodash
 *   - date-fns
 *
 * DOWNSTREAM (imported by):
 *   - Clinical decision support services
 *   - Provider order entry systems
 *   - Electronic health record interfaces
 *   - Alert management services
 *   - Care coordination modules
 */
import { ClinicalAlert } from '../../../src/models';
/**
 * Drug interaction result
 */
export interface DrugInteraction {
    medication1: string;
    medication2: string;
    severity: 'contraindicated' | 'major' | 'moderate' | 'minor';
    interaction: string;
    recommendation: string;
    effectOnset?: string;
}
/**
 * Clinical decision result
 */
export interface ClinicalDecision {
    ruleId: string;
    triggered: boolean;
    severity: 'info' | 'warning' | 'critical';
    message: string;
    recommendations: string[];
    evidence?: string[];
}
/**
 * Risk score calculation result
 */
export interface RiskScoreResult {
    score: number;
    severity: 'low' | 'moderate' | 'high' | 'critical';
    components: Record<string, number>;
    recommendations: string[];
}
/**
 * Patient allergy record
 */
export interface PatientAllergyCheck {
    medicationName: string;
    hasAllergy: boolean;
    allergyReaction?: string;
    severity?: 'mild' | 'moderate' | 'severe';
}
/**
 * Clinical pathway recommendation
 */
export interface PathwayRecommendation {
    pathwayId: string;
    name: string;
    estimatedDuration: number;
    keyMilestones: string[];
    expectedOutcome: string;
    evidenceLevel: string;
}
/**
 * Protocol adherence assessment
 */
export interface ProtocolAdherence {
    protocolId: string;
    patientId: string;
    compliancePercentage: number;
    deviations: string[];
    recommendations: string[];
}
/**
 * Duplicate therapy detection result
 */
export interface DuplicateTherapyAlert {
    foundDuplicates: boolean;
    duplicatePairs: Array<{
        medication1: string;
        medication2: string;
        therapeuticClass: string;
        recommendation: string;
    }>;
}
/**
 * Sepsis risk prediction
 */
export interface SepsisRiskPrediction {
    riskScore: number;
    riskLevel: 'low' | 'moderate' | 'high' | 'critical';
    qSOFA: number;
    lactate: number;
    recommendation: string;
    urgency: 'routine' | 'urgent' | 'emergent';
}
/**
 * Fall risk assessment
 */
export interface FallRiskAssessment {
    score: number;
    riskLevel: 'low' | 'moderate' | 'high';
    riskFactors: string[];
    interventions: string[];
}
/**
 * Evidence-based order set
 */
export interface EvidenceOrderSet {
    setId: string;
    name: string;
    orders: Array<{
        medicationName: string;
        dose: string;
        frequency: string;
        route: string;
        duration: string;
    }>;
    indication: string;
    evidence: string;
}
/**
 * 1. Comprehensive drug interaction check - screens current medications for interactions
 *
 * @param {string} patientId - Patient identifier
 * @param {string} proposedMedicationId - New medication to check
 * @returns {Promise<DrugInteraction[]>} Array of identified interactions
 *
 * @example
 * ```typescript
 * const interactions = await checkDrugInteractions('patient-456', 'med-789');
 * interactions.forEach(int => {
 *   if (int.severity === 'contraindicated') {
 *     console.log('ALERT:', int.recommendation);
 *   }
 * });
 * ```
 */
export declare function checkDrugInteractions(patientId: string, proposedMedicationId: string): Promise<DrugInteraction[]>;
/**
 * 2. Checks patient allergies against proposed medication
 *
 * @param {string} patientId - Patient identifier
 * @param {string} medicationId - Medication to check
 * @returns {Promise<PatientAllergyCheck>} Allergy check result
 *
 * @example
 * ```typescript
 * const allergyCheck = await checkMedicationAllergy('patient-456', 'med-789');
 * if (allergyCheck.hasAllergy && allergyCheck.severity === 'severe') {
 *   throw new Error('Contraindicated medication');
 * }
 * ```
 */
export declare function checkMedicationAllergy(patientId: string, medicationId: string): Promise<PatientAllergyCheck>;
/**
 * 3. Batch screening for drug interactions and allergies with detailed results
 *
 * @param {string} patientId - Patient identifier
 * @param {string[]} medicationIds - Array of medications to screen
 * @returns {Promise<Map<string, any>>} Screening results mapped by medication
 *
 * @example
 * ```typescript
 * const screenResults = await batchMedicationScreening('patient-456', ['med-1', 'med-2', 'med-3']);
 * const med1Results = screenResults.get('med-1');
 * ```
 */
export declare function batchMedicationScreening(patientId: string, medicationIds: string[]): Promise<Map<string, any>>;
/**
 * 4. Detects contraindications between medication and patient conditions
 *
 * @param {string} patientId - Patient identifier
 * @param {string} medicationId - Medication to check
 * @returns {Promise<ClinicalDecision>} Contraindication check result
 *
 * @example
 * ```typescript
 * const contraCheck = await checkContraindications('patient-456', 'med-789');
 * if (!contraCheck.triggered) {
 *   console.log('Safe to prescribe');
 * } else {
 *   console.log('Contraindication:', contraCheck.message);
 * }
 * ```
 */
export declare function checkContraindications(patientId: string, medicationId: string): Promise<ClinicalDecision>;
/**
 * 5. Checks for duplicate medication therapy (same therapeutic class)
 *
 * @param {string} patientId - Patient identifier
 * @param {string} proposedMedicationId - Proposed medication
 * @returns {Promise<DuplicateTherapyAlert>} Duplicate therapy detection
 *
 * @example
 * ```typescript
 * const dupCheck = await detectDuplicateTherapy('patient-456', 'med-789');
 * if (dupCheck.foundDuplicates) {
 *   dupCheck.duplicatePairs.forEach(pair => {
 *     console.log(`Remove ${pair.medication1} or ${pair.medication2}`);
 *   });
 * }
 * ```
 */
export declare function detectDuplicateTherapy(patientId: string, proposedMedicationId: string): Promise<DuplicateTherapyAlert>;
/**
 * 6. Severity-based allergy screening with cross-sensitivity checking
 *
 * @param {string} patientId - Patient identifier
 * @param {string} medicationId - Medication to check
 * @returns {Promise<boolean>} True if allergic
 *
 * @example
 * ```typescript
 * const isSevereAllergy = await checkSevereAllergy('patient-456', 'med-789');
 * if (isSevereAllergy) {
 *   console.log('CRITICAL: Do not prescribe');
 * }
 * ```
 */
export declare function checkSevereAllergy(patientId: string, medicationId: string): Promise<boolean>;
/**
 * 7. Cross-sensitivity allergy checking across medication classes
 *
 * @param {string} patientId - Patient identifier
 * @param {string[]} medicationIds - Medications to check
 * @returns {Promise<Map<string, boolean>>} Cross-sensitivity results
 *
 * @example
 * ```typescript
 * const crossSensitivity = await checkCrossSensitivity('patient-456', ['med-1', 'med-2']);
 * crossSensitivity.forEach((isCrossSensitive, medId) => {
 *   if (isCrossSensitive) console.log(`Cross-sensitivity risk for ${medId}`);
 * });
 * ```
 */
export declare function checkCrossSensitivity(patientId: string, medicationIds: string[]): Promise<Map<string, boolean>>;
/**
 * 8. Detailed allergy history with temporal tracking
 *
 * @param {string} patientId - Patient identifier
 * @returns {Promise<Array<any>>} Complete allergy history
 *
 * @example
 * ```typescript
 * const allergyHistory = await getAllergyHistory('patient-456');
 * allergyHistory.forEach(allergy => {
 *   console.log(`${allergy.medicationName}: ${allergy.reaction} (reported ${allergy.reportedDate})`);
 * });
 * ```
 */
export declare function getAllergyHistory(patientId: string): Promise<Array<any>>;
/**
 * 9. Executes comprehensive clinical decision rules for patient
 *
 * @param {string} patientId - Patient identifier
 * @param {string[]} ruleIds - Optional specific rules to execute
 * @returns {Promise<ClinicalDecision[]>} Triggered rules
 *
 * @example
 * ```typescript
 * const decisions = await executeClinicalRules('patient-456');
 * const criticalAlerts = decisions.filter(d => d.severity === 'critical');
 * ```
 */
export declare function executeClinicalRules(patientId: string, ruleIds?: string[]): Promise<ClinicalDecision[]>;
/**
 * 10. Evaluates clinical rule logic against patient data
 *
 * @param {string} patientId - Patient identifier
 * @param {any} rule - Rule definition
 * @returns {Promise<boolean>} True if rule triggered
 *
 * @example
 * ```typescript
 * const triggered = await evaluateRule('patient-456', rule);
 * ```
 */
export declare function evaluateRule(patientId: string, rule: any): Promise<boolean>;
/**
 * 11. Generates best practice alerts based on clinical guidelines
 *
 * @param {string} patientId - Patient identifier
 * @returns {Promise<ClinicalAlert[]>} Active best practice alerts
 *
 * @example
 * ```typescript
 * const alerts = await getBestPracticeAlerts('patient-456');
 * alerts.forEach(alert => console.log(alert.message));
 * ```
 */
export declare function getBestPracticeAlerts(patientId: string): Promise<ClinicalAlert[]>;
/**
 * 12. Screening for medication-renal function interactions
 *
 * @param {string} patientId - Patient identifier
 * @param {string} medicationId - Medication to check
 * @returns {Promise<ClinicalDecision>} Renal adjustment recommendation
 *
 * @example
 * ```typescript
 * const renalCheck = await checkRenalFunctionInteraction('patient-456', 'med-789');
 * if (renalCheck.triggered) {
 *   console.log('Dose adjustment needed:', renalCheck.recommendations[0]);
 * }
 * ```
 */
export declare function checkRenalFunctionInteraction(patientId: string, medicationId: string): Promise<ClinicalDecision>;
/**
 * 13. Screens for medication-hepatic function interactions
 *
 * @param {string} patientId - Patient identifier
 * @param {string} medicationId - Medication to check
 * @returns {Promise<ClinicalDecision>} Hepatic adjustment recommendation
 *
 * @example
 * ```typescript
 * const hepaticCheck = await checkHepaticFunctionInteraction('patient-456', 'med-789');
 * ```
 */
export declare function checkHepaticFunctionInteraction(patientId: string, medicationId: string): Promise<ClinicalDecision>;
/**
 * 14. Checks for age-related dosing adjustments (pediatric/geriatric)
 *
 * @param {string} patientId - Patient identifier
 * @param {string} medicationId - Medication to check
 * @returns {Promise<ClinicalDecision>} Age-specific dosing recommendation
 *
 * @example
 * ```typescript
 * const ageCheck = await checkAgeDependentDosing('patient-456', 'med-789');
 * ```
 */
export declare function checkAgeDependentDosing(patientId: string, medicationId: string): Promise<ClinicalDecision>;
/**
 * 15. Pregnancy status checking for medication safety
 *
 * @param {string} patientId - Patient identifier
 * @param {string} medicationId - Medication to check
 * @returns {Promise<ClinicalDecision>} Pregnancy-related recommendation
 *
 * @example
 * ```typescript
 * const pregCheck = await checkPregnancyMedicationSafety('patient-456', 'med-789');
 * ```
 */
export declare function checkPregnancyMedicationSafety(patientId: string, medicationId: string): Promise<ClinicalDecision>;
/**
 * 16. Screens for medication-nutrient interactions
 *
 * @param {string} patientId - Patient identifier
 * @param {string[]} medicationIds - Medications to check
 * @returns {Promise<Array<any>>} Nutrient interaction details
 *
 * @example
 * ```typescript
 * const nutrientInteractions = await checkNutrientInteractions('patient-456', ['med-1', 'med-2']);
 * ```
 */
export declare function checkNutrientInteractions(patientId: string, medicationIds: string[]): Promise<Array<any>>;
/**
 * 17. Calculates APACHE IV score (critical care mortality prediction)
 *
 * @param {string} patientId - Patient identifier
 * @returns {Promise<RiskScoreResult>} APACHE IV score and interpretation
 *
 * @example
 * ```typescript
 * const apacheScore = await calculateAPACHEIV('patient-456');
 * console.log(`APACHE IV Score: ${apacheScore.score}, Risk: ${apacheScore.severity}`);
 * ```
 */
export declare function calculateAPACHEIV(patientId: string): Promise<RiskScoreResult>;
/**
 * 18. Calculates MEWS (Modified Early Warning Score)
 *
 * @param {string} patientId - Patient identifier
 * @returns {Promise<RiskScoreResult>} MEWS score and severity
 *
 * @example
 * ```typescript
 * const mewsScore = await calculateMEWS('patient-456');
 * ```
 */
export declare function calculateMEWS(patientId: string): Promise<RiskScoreResult>;
/**
 * 19. Sepsis risk prediction using qSOFA and lactate
 *
 * @param {string} patientId - Patient identifier
 * @returns {Promise<SepsisRiskPrediction>} Sepsis risk assessment
 *
 * @example
 * ```typescript
 * const sepsisRisk = await predictSepsisRisk('patient-456');
 * if (sepsisRisk.riskLevel === 'critical') {
 *   console.log('SEPSIS ALERT - Initiate sepsis protocol');
 * }
 * ```
 */
export declare function predictSepsisRisk(patientId: string): Promise<SepsisRiskPrediction>;
/**
 * 20. Fall risk assessment using validated scoring systems
 *
 * @param {string} patientId - Patient identifier
 * @returns {Promise<FallRiskAssessment>} Fall risk score and interventions
 *
 * @example
 * ```typescript
 * const fallRisk = await assessFallRisk('patient-456');
 * if (fallRisk.riskLevel === 'high') {
 *   console.log('Fall prevention interventions:', fallRisk.interventions);
 * }
 * ```
 */
export declare function assessFallRisk(patientId: string): Promise<FallRiskAssessment>;
/**
 * 21. Hospital-acquired infection risk prediction
 *
 * @param {string} patientId - Patient identifier
 * @returns {Promise<RiskScoreResult>} HAI risk score
 *
 * @example
 * ```typescript
 * const haiRisk = await predictHAIRisk('patient-456');
 * ```
 */
export declare function predictHAIRisk(patientId: string): Promise<RiskScoreResult>;
/**
 * 22. Mortality risk prediction (in-hospital)
 *
 * @param {string} patientId - Patient identifier
 * @returns {Promise<RiskScoreResult>} Mortality risk assessment
 *
 * @example
 * ```typescript
 * const mortalityRisk = await predictMortalityRisk('patient-456');
 * ```
 */
export declare function predictMortalityRisk(patientId: string): Promise<RiskScoreResult>;
/**
 * 23. Readmission risk stratification
 *
 * @param {string} patientId - Patient identifier
 * @returns {Promise<RiskScoreResult>} 30-day readmission risk
 *
 * @example
 * ```typescript
 * const readmissionRisk = await predictReadmissionRisk('patient-456');
 * ```
 */
export declare function predictReadmissionRisk(patientId: string): Promise<RiskScoreResult>;
/**
 * 24. Length of stay prediction
 *
 * @param {string} patientId - Patient identifier
 * @param {string[]} primaryDiagnoses - Primary diagnosis codes
 * @returns {Promise<any>} Expected LOS and risk factors
 *
 * @example
 * ```typescript
 * const losPredict = await predictLengthOfStay('patient-456', ['sepsis']);
 * ```
 */
export declare function predictLengthOfStay(patientId: string, primaryDiagnoses: string[]): Promise<any>;
/**
 * 25. Delirium risk assessment
 *
 * @param {string} patientId - Patient identifier
 * @returns {Promise<RiskScoreResult>} Delirium risk score
 *
 * @example
 * ```typescript
 * const deliriumRisk = await assessDeliriumRisk('patient-456');
 * ```
 */
export declare function assessDeliriumRisk(patientId: string): Promise<RiskScoreResult>;
/**
 * 26. Retrieves evidence-based order sets for patient diagnosis
 *
 * @param {string} diagnosisCode - ICD-10 diagnosis code
 * @returns {Promise<EvidenceOrderSet[]>} Applicable order sets
 *
 * @example
 * ```typescript
 * const orderSets = await getEvidenceBasedOrderSets('J16.9');
 * orderSets.forEach(set => {
 *   console.log(`${set.name}: ${set.orders.length} orders`);
 * });
 * ```
 */
export declare function getEvidenceBasedOrderSets(diagnosisCode: string): Promise<EvidenceOrderSet[]>;
/**
 * 27. Recommends clinical pathways for patient condition
 *
 * @param {string} patientId - Patient identifier
 * @param {string} primaryDiagnosis - Primary diagnosis code
 * @returns {Promise<PathwayRecommendation[]>} Recommended pathways
 *
 * @example
 * ```typescript
 * const pathways = await recommendClinicalPathways('patient-456', 'I50.9');
 * pathways.forEach(pw => {
 *   console.log(`${pw.name}: ${pw.estimatedDuration} days`);
 * });
 * ```
 */
export declare function recommendClinicalPathways(patientId: string, primaryDiagnosis: string): Promise<PathwayRecommendation[]>;
/**
 * 28. Tracks protocol adherence for patient
 *
 * @param {string} patientId - Patient identifier
 * @param {string} protocolId - Clinical protocol ID
 * @returns {Promise<ProtocolAdherence>} Adherence assessment
 *
 * @example
 * ```typescript
 * const adherence = await assessProtocolAdherence('patient-456', 'sepsis-protocol');
 * console.log(`Compliance: ${adherence.compliancePercentage}%`);
 * ```
 */
export declare function assessProtocolAdherence(patientId: string, protocolId: string): Promise<ProtocolAdherence>;
/**
 * 29. Integrates clinical guidelines for decision support
 *
 * @param {string} condition - Clinical condition
 * @param {string[]} parameters - Patient parameters for guideline matching
 * @returns {Promise<any>} Guideline recommendations
 *
 * @example
 * ```typescript
 * const guidelines = await getGuidelineRecommendations('hypertension', ['age:65', 'diabetes:yes']);
 * ```
 */
export declare function getGuidelineRecommendations(condition: string, parameters: string[]): Promise<any>;
/**
 * 30. Alerts on guideline deviations in treatment
 *
 * @param {string} patientId - Patient identifier
 * @returns {Promise<ClinicalAlert[]>} Guideline deviation alerts
 *
 * @example
 * ```typescript
 * const guidelineAlerts = await getGuidelineDeviationAlerts('patient-456');
 * ```
 */
export declare function getGuidelineDeviationAlerts(patientId: string): Promise<ClinicalAlert[]>;
/**
 * 31. Checks vaccination status against guidelines
 *
 * @param {string} patientId - Patient identifier
 * @param {number} age - Patient age
 * @returns {Promise<any>} Vaccination recommendations
 *
 * @example
 * ```typescript
 * const vaccRecs = await checkVaccinationStatus('patient-456', 65);
 * ```
 */
export declare function checkVaccinationStatus(patientId: string, age: number): Promise<any>;
/**
 * 32. Cancer screening recommendations based on guidelines
 *
 * @param {string} patientId - Patient identifier
 * @param {string} gender - Patient gender
 * @param {number} age - Patient age
 * @returns {Promise<any>} Cancer screening recommendations
 *
 * @example
 * ```typescript
 * const screeningRecs = await getCancerScreeningRecommendations('patient-456', 'F', 50);
 * ```
 */
export declare function getCancerScreeningRecommendations(patientId: string, gender: string, age: number): Promise<any>;
/**
 * 33. Preventive care recommendations based on USPSTF guidelines
 *
 * @param {string} patientId - Patient identifier
 * @param {number} age - Patient age
 * @param {string} gender - Patient gender
 * @returns {Promise<any>} USPSTF preventive care recommendations
 *
 * @example
 * ```typescript
 * const preventiveRecs = await getPreventiveCareRecommendations('patient-456', 55, 'M');
 * ```
 */
export declare function getPreventiveCareRecommendations(patientId: string, age: number, gender: string): Promise<any>;
/**
 * 34. Monitors antibiotic appropriateness and stewardship
 *
 * @param {string} patientId - Patient identifier
 * @param {string} antibioticId - Antibiotic medication ID
 * @returns {Promise<ClinicalDecision>} Appropriateness assessment
 *
 * @example
 * ```typescript
 * const appropCheck = await checkAntibioticAppropriateness('patient-456', 'med-789');
 * ```
 */
export declare function checkAntibioticAppropriateness(patientId: string, antibioticId: string): Promise<ClinicalDecision>;
/**
 * 35. Blood culture and organism reporting for infection management
 *
 * @param {string} patientId - Patient identifier
 * @returns {Promise<any>> Recent culture results with sensitivities
 *
 * @example
 * ```typescript
 * const cultures = await getBloodCultureResults('patient-456');
 * ```
 */
export declare function getBloodCultureResults(patientId: string): Promise<any>;
/**
 * 36. Monitors anticoagulation therapy (warfarin/DOAC) efficacy
 *
 * @param {string} patientId - Patient identifier
 * @returns {Promise<any>} Anticoagulation monitoring data
 *
 * @example
 * ```typescript
 * const anticoagCheck = await monitorAnticoagulation('patient-456');
 * ```
 */
export declare function monitorAnticoagulation(patientId: string): Promise<any>;
/**
 * 37. Monitors pain management and opioid therapy
 *
 * @param {string} patientId - Patient identifier
 * @returns {Promise<any>} Pain management assessment
 *
 * @example
 * ```typescript
 * const painCheck = await monitorPainManagement('patient-456');
 * ```
 */
export declare function monitorPainManagement(patientId: string): Promise<any>;
/**
 * 38. Monitors glucose control in diabetic patients
 *
 * @param {string} patientId - Patient identifier
 * @returns {Promise<any>} Glucose monitoring data
 *
 * @example
 * ```typescript
 * const glucoseControl = await monitorGlucoseControl('patient-456');
 * ```
 */
export declare function monitorGlucoseControl(patientId: string): Promise<any>;
/**
 * 39. Monitors blood pressure control and antihypertensive therapy
 *
 * @param {string} patientId - Patient identifier
 * @returns {Promise<any>} Blood pressure monitoring
 *
 * @example
 * ```typescript
 * const bpControl = await monitorBloodPressure('patient-456');
 * ```
 */
export declare function monitorBloodPressure(patientId: string): Promise<any>;
/**
 * 40. Identifies medication side effects and adverse reactions
 *
 * @param {string} patientId - Patient identifier
 * @returns {Promise<any>> Reported adverse drug events
 *
 * @example
 * ```typescript
 * const adverseEvents = await identifyMedicationSideEffects('patient-456');
 * ```
 */
export declare function identifyMedicationSideEffects(patientId: string): Promise<any>;
/**
 * 41. Monitors disease-modifying antirheumatic drug (DMARD) efficacy
 *
 * @param {string} patientId - Patient identifier
 * @returns {Promise<any>} DMARD monitoring labs
 *
 * @example
 * ```typescript
 * const dmardMonitor = await monitorDMARDTherapy('patient-456');
 * ```
 */
export declare function monitorDMARDTherapy(patientId: string): Promise<any>;
/**
 * 42. Assesses medication adherence and compliance
 *
 * @param {string} patientId - Patient identifier
 * @returns {Promise<any>} Medication adherence metrics
 *
 * @example
 * ```typescript
 * const adherence = await assessMedicationAdherence('patient-456');
 * ```
 */
export declare function assessMedicationAdherence(patientId: string): Promise<any>;
/**
 * 43. Summarizes overall clinical decision support for patient encounter
 *
 * @param {string} patientId - Patient identifier
 * @returns {Promise<any>} Comprehensive CDS summary
 *
 * @example
 * ```typescript
 * const cdsSummary = await generateCDSSummary('patient-456');
 * console.log('Active Alerts:', cdsSummary.activeAlerts.length);
 * ```
 */
export declare function generateCDSSummary(patientId: string): Promise<any>;
//# sourceMappingURL=health-clinical-decision-support-kit.d.ts.map