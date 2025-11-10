/**
 * LOC: HLTH-NURS-WF-001
 * File: /reuse/server/health/health-nursing-workflows-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - class-validator
 *   - fhir/r4 (HL7 FHIR R4)
 *   - crypto (Node.js)
 *
 * DOWNSTREAM (imported by):
 *   - Nursing services
 *   - Care planning engines
 *   - MAR (Medication Administration Record) modules
 *   - Patient charting systems
 *   - Quality/metrics dashboards
 */
/**
 * Comprehensive nursing assessment data
 */
export interface NursingAssessmentData {
    patientMRN: string;
    assessmentDate: Date;
    rn: string;
    functionalStatus: 'independent' | 'modified-independent' | 'modified-dependent' | 'dependent' | 'total-dependent';
    mentalStatus: 'alert-oriented' | 'confused' | 'lethargic' | 'comatose';
    continence: 'continent' | 'occasionally-incontinent' | 'frequently-incontinent' | 'incontinent';
    mobility: 'ambulates-independent' | 'ambulates-with-device' | 'transferred-assisted' | 'bedbound';
    communicationAbility: string;
    visionHearing: string;
}
/**
 * NANDA nursing diagnosis
 */
export interface NANDADiagnosis {
    code: string;
    label: string;
    relatedFactors: string[];
    definingCharacteristics: string[];
    priority: 1 | 2 | 3;
}
/**
 * Nursing care plan intervention
 */
export interface CareplanIntervention {
    id: string;
    intervention: string;
    rationale: string;
    frequency: string;
    assignedTo: string;
    status: 'active' | 'on-hold' | 'completed' | 'discontinued';
    evidenceBase?: string;
}
/**
 * Care plan goal/outcome
 */
export interface CareplanGoal {
    id: string;
    goal: string;
    targetDate: Date;
    criteria: string[];
    status: 'active' | 'achieved' | 'not-achieved' | 'discontinued';
}
/**
 * Medication Administration Record entry
 */
export interface MAREntry {
    marId: string;
    patientMRN: string;
    medicationCode: string;
    medicationName: string;
    dose: string;
    route: 'IV' | 'PO' | 'IM' | 'SQ' | 'topical' | 'inhalation' | 'rectal' | 'other';
    frequency: string;
    scheduledTime: Date;
    administeredTime?: Date;
    administeredBy?: string;
    status: 'pending' | 'administered' | 'refused' | 'held' | 'missed';
    reason?: string;
    barcodeVerified?: boolean;
}
/**
 * IV therapy infusion setup
 */
export interface IVTherapySetup {
    ivId: string;
    patientMRN: string;
    siteLocation: string;
    startDate: Date;
    solutionType: string;
    infusionRate: number;
    infusionUnit: 'mL/hr' | 'mL/min' | 'drops/min';
    salineFlushSchedule?: string;
    gaugeSize?: string;
    catheterType?: string;
    assessmentFrequency: string;
}
/**
 * Intake/Output charting record
 */
export interface IntakeOutputRecord {
    recordId: string;
    patientMRN: string;
    shiftStart: Date;
    shiftEnd: Date;
    intakes: Array<{
        type: string;
        volume: number;
        unit: 'mL' | 'oz';
        time: Date;
    }>;
    outputs: Array<{
        type: string;
        volume: number;
        unit: 'mL' | 'oz';
        time: Date;
    }>;
    totalIntake: number;
    totalOutput: number;
    fluidBalance: number;
    status: 'in-progress' | 'completed';
}
/**
 * Wound assessment and care data
 */
export interface WoundAssessmentData {
    woundId: string;
    patientMRN: string;
    location: string;
    date: Date;
    type: 'surgical' | 'pressure-ulcer' | 'diabetic' | 'venous' | 'traumatic' | 'other';
    stage?: '1' | '2' | '3' | '4' | 'unstageable';
    length: number;
    width: number;
    depth: number;
    measurementUnit: 'cm' | 'mm' | 'inches';
    drainageType: 'none' | 'serous' | 'serosanguinous' | 'sanguinous' | 'purulent';
    drainageAmount: 'scant' | 'small' | 'moderate' | 'large';
    odor: 'absent' | 'faint' | 'moderate' | 'strong';
    skinColor: string;
    skinTemp: 'normal' | 'warm' | 'cool';
    undermining?: number;
    tunneling?: number;
    dressing: string;
    nextDressingChange: Date;
}
/**
 * Fall risk assessment result
 */
export interface FallRiskAssessment {
    assessmentId: string;
    patientMRN: string;
    tool: 'morse' | 'hendrich';
    score: number;
    riskLevel: 'low' | 'medium' | 'high';
    riskFactors: string[];
    interventionsRecommended: string[];
    assessmentDate: Date;
}
/**
 * Pressure ulcer risk assessment (Braden Scale)
 */
export interface BradenScoreAssessment {
    assessmentId: string;
    patientMRN: string;
    sensoryPerception: 1 | 2 | 3 | 4;
    moisture: 1 | 2 | 3 | 4;
    activity: 1 | 2 | 3 | 4;
    mobility: 1 | 2 | 3 | 4;
    nutrition: 1 | 2 | 3 | 4;
    frictionShear: 1 | 2 | 3;
    totalScore: number;
    riskLevel: 'no-risk' | 'at-risk' | 'high-risk' | 'very-high-risk';
    assessmentDate: Date;
}
/**
 * Pain assessment and management
 */
export interface PainAssessment {
    painId: string;
    patientMRN: string;
    assessmentDate: Date;
    painScore: number;
    painScale: 'nrs' | 'faces' | 'verbal';
    location: string;
    character: string;
    onset: string;
    duration: string;
    relievingFactors?: string[];
    exacerbatingFactors?: string[];
    impactOnFunctioning: string;
}
/**
 * Restraint documentation
 */
export interface RestraintDocumentation {
    restraintId: string;
    patientMRN: string;
    type: 'wrist' | 'ankle' | 'belt' | 'cloth' | 'chemical' | 'other';
    indication: string;
    startDate: Date;
    endDate?: Date;
    frequency: string;
    duration: string;
    physiciansOrder: boolean;
    physiciansOrderTime?: Date;
    monitoringFrequency: string;
    lastMonitoringTime?: Date;
    skinIntegrity: string;
    circulations: string;
}
/**
 * Nursing handoff/report data
 */
export interface NursingHandoffData {
    handoffId: string;
    giverRN: string;
    receiverRN: string;
    shift: 'night' | 'day' | 'evening';
    handoffTime: Date;
    patients: Array<{
        mrn: string;
        name: string;
        roomNumber: string;
        acuity: 'critical' | 'high' | 'medium' | 'low';
        diagnosis: string;
        situation: string;
        background: string;
        assessment: string;
        recommendation: string;
    }>;
}
/**
 * Nursing task assignment
 */
export interface NursingTaskAssignment {
    taskId: string;
    patientMRN: string;
    task: string;
    assignedTo: string;
    dueTime: Date;
    priority: 1 | 2 | 3 | 4 | 5;
    delegation: boolean;
    delegatedBy?: string;
    status: 'assigned' | 'in-progress' | 'completed' | 'cancelled';
    completionTime?: Date;
}
/**
 * Nursing acuity score for staffing
 */
export interface NursingAcuityScore {
    patientMRN: string;
    assessmentDate: Date;
    acuityScore: number;
    acuityLevel: 'low' | 'medium' | 'high' | 'critical';
    staffingRatioNeeded: number;
    justification: string[];
}
/**
 * 1. Performs comprehensive nursing admission assessment with NANDA integration.
 *
 * @param {NursingAssessmentData} assessmentData - Patient assessment information
 * @returns {Promise<{assessmentId: string, completedAt: Date, nandaDiagnoses: NANDADiagnosis[]}>} Assessment result
 *
 * @example
 * ```typescript
 * const assessment = await performNursingAdmissionAssessment({
 *   patientMRN: 'MRN123',
 *   assessmentDate: new Date(),
 *   rn: 'RN-001',
 *   functionalStatus: 'modified-independent',
 *   mentalStatus: 'alert-oriented',
 *   mobility: 'ambulates-with-device'
 * });
 * ```
 */
export declare function performNursingAdmissionAssessment(assessmentData: NursingAssessmentData): Promise<{
    assessmentId: string;
    completedAt: Date;
    nandaDiagnoses: NANDADiagnosis[];
}>;
/**
 * 2. Generates evidence-based NANDA nursing diagnoses from assessment.
 *
 * @param {NursingAssessmentData} assessmentData - Patient assessment
 * @returns {Promise<NANDADiagnosis[]>} NANDA diagnoses with priority
 */
export declare function generateNANDADiagnoses(assessmentData: NursingAssessmentData): Promise<NANDADiagnosis[]>;
/**
 * 3. Creates evidence-based nursing care plan with interventions and goals.
 *
 * @param {string} patientMRN - Patient identifier
 * @param {NANDADiagnosis[]} diagnoses - NANDA diagnoses
 * @returns {Promise<{careplanId: string, goals: CareplanGoal[], interventions: CareplanIntervention[]}>} Care plan
 */
export declare function createNursingCareplan(patientMRN: string, diagnoses: NANDADiagnosis[]): Promise<{
    careplanId: string;
    goals: CareplanGoal[];
    interventions: CareplanIntervention[];
}>;
/**
 * 4. Updates care plan interventions with completion documentation.
 *
 * @param {string} careplanId - Care plan identifier
 * @param {string} interventionId - Intervention to update
 * @param {string} newStatus - Intervention status
 * @returns {Promise<{updated: boolean, updateTime: Date}>} Update confirmation
 */
export declare function updateCareplanIntervention(careplanId: string, interventionId: string, newStatus: string): Promise<{
    updated: boolean;
    updateTime: Date;
}>;
/**
 * 5. Evaluates care plan goals achievement and updates outcomes.
 *
 * @param {string} careplanId - Care plan identifier
 * @param {string} goalId - Goal to evaluate
 * @param {string} evaluationNotes - Nurse's evaluation notes
 * @returns {Promise<{evaluated: boolean, goalStatus: string}>} Evaluation result
 */
export declare function evaluateCareplanGoal(careplanId: string, goalId: string, evaluationNotes: string): Promise<{
    evaluated: boolean;
    goalStatus: string;
}>;
/**
 * 6. Discontinues care plan with rationale and recommendation for next shift.
 *
 * @param {string} careplanId - Care plan to discontinue
 * @param {string} discontinuationReason - Reason for discontinuation
 * @returns {Promise<{discontinued: boolean, discontinuationTime: Date}>} Discontinuation confirmation
 */
export declare function discontinueNursingCareplan(careplanId: string, discontinuationReason: string): Promise<{
    discontinued: boolean;
    discontinuationTime: Date;
}>;
/**
 * 7. Retrieves active care plan for shift handoff or review.
 *
 * @param {string} patientMRN - Patient identifier
 * @returns {Promise<any>} Complete active care plan
 */
export declare function getActiveCareplan(patientMRN: string): Promise<any>;
/**
 * 8. Generates care plan report for multidisciplinary team review.
 *
 * @param {string} careplanId - Care plan identifier
 * @returns {Promise<{reportId: string, generated: boolean, pdfUrl?: string}>} Report generation
 */
export declare function generateCareplanReport(careplanId: string): Promise<{
    reportId: string;
    generated: boolean;
    pdfUrl?: string;
}>;
/**
 * 9. Initializes MAR for patient with medication list from EHR orders.
 *
 * @param {string} patientMRN - Patient identifier
 * @param {object[]} activeOrders - Medication orders from pharmacy
 * @returns {Promise<{marId: string, entryCount: number}>} MAR initialization
 *
 * @example
 * ```typescript
 * const mar = await initializeMedicationAdministrationRecord('MRN123', activeOrders);
 * ```
 */
export declare function initializeMedicationAdministrationRecord(patientMRN: string, activeOrders: any[]): Promise<{
    marId: string;
    entryCount: number;
}>;
/**
 * 10. Verifies medication barcode (patient, med, dose) before administration.
 *
 * @param {string} patientBarcode - Patient ID barcode
 * @param {string} medicationBarcode - Medication barcode
 * @param {string} doseBarcode - Dose/vial barcode
 * @returns {Promise<{verified: boolean, warningMessages: string[]}>} Barcode verification
 */
export declare function performMedicationBarcodeVerification(patientBarcode: string, medicationBarcode: string, doseBarcode: string): Promise<{
    verified: boolean;
    warningMessages: string[];
}>;
/**
 * 11. Records medication administration with site, route, and vital sign context.
 *
 * @param {string} marId - MAR identifier
 * @param {string} marEntryId - Specific MAR entry
 * @param {string} administeredBy - RN identifier
 * @param {object} adminContext - Route, site, vital signs if applicable
 * @returns {Promise<{recorded: boolean, administrationTime: Date, rnSignature: string}>} Administration record
 */
export declare function recordMedicationAdministration(marId: string, marEntryId: string, administeredBy: string, adminContext: any): Promise<{
    recorded: boolean;
    administrationTime: Date;
    rnSignature: string;
}>;
/**
 * 12. Records medication refusal with patient reason and education provided.
 *
 * @param {string} marEntryId - MAR entry for refused medication
 * @param {string} refusalReason - Patient's reason
 * @param {string} educationProvided - Education offered to patient
 * @returns {Promise<{recorded: boolean, physicianNotified?: boolean}>} Refusal documentation
 */
export declare function recordMedicationRefusal(marEntryId: string, refusalReason: string, educationProvided: string): Promise<{
    recorded: boolean;
    physicianNotified?: boolean;
}>;
/**
 * 13. Holds medication with clinical rationale (e.g., NPO, vitals unstable).
 *
 * @param {string} marEntryId - MAR entry to hold
 * @param {string} holdReason - Clinical reason for hold
 * @param {string} expectedHoldDuration - When to resume
 * @returns {Promise<{onHold: boolean, holdTime: Date}>} Hold confirmation
 */
export declare function holdMedication(marEntryId: string, holdReason: string, expectedHoldDuration: string): Promise<{
    onHold: boolean;
    holdTime: Date;
}>;
/**
 * 14. Retrieves complete MAR for shift with pending/due medications highlighted.
 *
 * @param {string} patientMRN - Patient identifier
 * @returns {Promise<MAREntry[]>} Complete MAR entries for patient
 */
export declare function getPatientMAR(patientMRN: string): Promise<MAREntry[]>;
/**
 * 15. Generates MAR exception report for missed/refused/held medications.
 *
 * @param {string} patientMRN - Patient identifier
 * @param {Date} shiftDate - Shift date to report
 * @returns {Promise<{reportId: string, exceptionCount: number, exceptions: Array<{med: string, status: string, reason: string}>}>} Exception report
 */
export declare function generateMARExceptionReport(patientMRN: string, shiftDate: Date): Promise<{
    reportId: string;
    exceptionCount: number;
    exceptions: Array<{
        med: string;
        status: string;
        reason: string;
    }>;
}>;
/**
 * 16. Establishes IV line with initial assessment and documentation.
 *
 * @param {string} patientMRN - Patient identifier
 * @param {object} ivSetupData - IV site, solution, rate information
 * @returns {Promise<{ivId: string, insertTime: Date, insertedBy: string}>} IV establishment
 *
 * @example
 * ```typescript
 * const iv = await establishIVLine('MRN123', {
 *   siteLocation: 'Left AC',
 *   solutionType: 'NS',
 *   infusionRate: 100,
 *   infusionUnit: 'mL/hr'
 * });
 * ```
 */
export declare function establishIVLine(patientMRN: string, ivSetupData: any): Promise<{
    ivId: string;
    insertTime: Date;
    insertedBy: string;
}>;
/**
 * 17. Documents routine IV site assessment (circulation, integrity, pain, infection signs).
 *
 * @param {string} ivId - IV identifier
 * @param {object} assessmentData - Site assessment findings
 * @returns {Promise<{assessmentId: string, siteIntegrity: string, actionRequired: boolean}>} Assessment documentation
 */
export declare function documentIVSiteAssessment(ivId: string, assessmentData: any): Promise<{
    assessmentId: string;
    siteIntegrity: string;
    actionRequired: boolean;
}>;
/**
 * 18. Changes IV dressing with sterile technique documentation and new dressing type.
 *
 * @param {string} ivId - IV identifier
 * @param {string} newDressingType - New dressing applied
 * @param {string} performedBy - RN performing change
 * @returns {Promise<{changed: boolean, changeTime: Date, nextChangeDate: Date}>} Dressing change confirmation
 */
export declare function changeIVDressing(ivId: string, newDressingType: string, performedBy: string): Promise<{
    changed: boolean;
    changeTime: Date;
    nextChangeDate: Date;
}>;
/**
 * 19. Records IV medication/fluid bolus or infusion start with rate verification.
 *
 * @param {string} ivId - IV identifier
 * @param {string} infusionType - 'bolus' | 'drip' | 'piggyback'
 * @param {object} infusionData - Solution, rate, volume information
 * @returns {Promise<{infusionId: string, startTime: Date, estimatedCompletion: Date}>} Infusion documentation
 */
export declare function startIVInfusion(ivId: string, infusionType: string, infusionData: any): Promise<{
    infusionId: string;
    startTime: Date;
    estimatedCompletion: Date;
}>;
/**
 * 20. Removes/discontinues IV line with post-removal assessment and dressing.
 *
 * @param {string} ivId - IV identifier
 * @param {string} removalReason - Reason for removal
 * @param {string} removedBy - RN performing removal
 * @returns {Promise<{removed: boolean, removalTime: Date, siteAssessment: string}>} Removal documentation
 */
export declare function removeIVLine(ivId: string, removalReason: string, removedBy: string): Promise<{
    removed: boolean;
    removalTime: Date;
    siteAssessment: string;
}>;
/**
 * 21. Initializes shift-based intake and output charting record.
 *
 * @param {string} patientMRN - Patient identifier
 * @param {Date} shiftStart - Shift start time
 * @returns {Promise<{ioRecordId: string, startTime: Date}>} I/O record creation
 *
 * @example
 * ```typescript
 * const io = await initializeIntakeOutputCharting('MRN123', new Date());
 * ```
 */
export declare function initializeIntakeOutputCharting(patientMRN: string, shiftStart: Date): Promise<{
    ioRecordId: string;
    startTime: Date;
}>;
/**
 * 22. Records intake (PO fluids, IV, tube feeds) with time and volume.
 *
 * @param {string} ioRecordId - I/O record identifier
 * @param {string} intakeType - Type of intake (water, juice, IV, etc.)
 * @param {number} volume - Volume in mL or oz
 * @param {Date} intakeTime - Time of intake
 * @returns {Promise<{recorded: boolean, totalIntakeUpdated: number}>} Intake documentation
 */
export declare function recordIntake(ioRecordId: string, intakeType: string, volume: number, intakeTime: Date): Promise<{
    recorded: boolean;
    totalIntakeUpdated: number;
}>;
/**
 * 23. Records output (urine, stool, drainage, vomitus) with characteristics.
 *
 * @param {string} ioRecordId - I/O record identifier
 * @param {string} outputType - Type of output
 * @param {number} volume - Volume in mL or oz
 * @param {Date} outputTime - Time of output
 * @param {string} characteristics - Color, consistency, presence of blood, etc.
 * @returns {Promise<{recorded: boolean, totalOutputUpdated: number}>} Output documentation
 */
export declare function recordOutput(ioRecordId: string, outputType: string, volume: number, outputTime: Date, characteristics: string): Promise<{
    recorded: boolean;
    totalOutputUpdated: number;
}>;
/**
 * 24. Calculates and analyzes fluid balance (intake minus output).
 *
 * @param {string} ioRecordId - I/O record identifier
 * @returns {Promise<{fluidBalance: number, status: 'balanced' | 'positive' | 'negative', actionRequired: boolean}>} Balance analysis
 */
export declare function analyzeFluidBalance(ioRecordId: string): Promise<{
    fluidBalance: number;
    status: 'balanced' | 'positive' | 'negative';
    actionRequired: boolean;
}>;
/**
 * 25. Performs comprehensive wound assessment (size, depth, drainage, healing).
 *
 * @param {string} patientMRN - Patient identifier
 * @param {WoundAssessmentData} woundData - Wound assessment findings
 * @returns {Promise<{assessmentId: string, healingProgress: string, interventionsNeeded: string[]}>} Wound assessment
 *
 * @example
 * ```typescript
 * const wound = await assessWound('MRN123', {
 *   woundId: 'W-001',
 *   location: 'Sacrum',
 *   type: 'pressure-ulcer',
 *   stage: '2',
 *   length: 3.5,
 *   width: 2.1,
 *   depth: 0.5
 * });
 * ```
 */
export declare function assessWound(patientMRN: string, woundData: WoundAssessmentData): Promise<{
    assessmentId: string;
    healingProgress: string;
    interventionsNeeded: string[];
}>;
/**
 * 26. Documents wound dressing change with dressing type and product used.
 *
 * @param {string} woundId - Wound identifier
 * @param {string} dressingType - Type of dressing applied
 * @param {object} dressingProducts - Products used with quantities
 * @param {string} performedBy - RN performing dressing change
 * @returns {Promise<{changeDated: boolean, changeTime: Date, nextChangeDate: Date}>} Dressing change documentation
 */
export declare function changeWoundDressing(woundId: string, dressingType: string, dressingProducts: any, performedBy: string): Promise<{
    changeDated: boolean;
    changeTime: Date;
    nextChangeDate: Date;
}>;
/**
 * 27. Tracks wound healing progression with measurement trend analysis.
 *
 * @param {string} woundId - Wound identifier
 * @returns {Promise<Array<{assessmentDate: Date, length: number, width: number, depth: number, healingRate: number}>>} Healing trend
 */
export declare function getWoundHealingTrend(woundId: string): Promise<Array<{
    assessmentDate: Date;
    length: number;
    width: number;
    depth: number;
    healingRate: number;
}>>;
/**
 * 28. Closes/heals wound with final assessment and post-closure instructions.
 *
 * @param {string} woundId - Wound identifier
 * @param {string} closureMethod - Method of closure
 * @param {string} healingStatus - Reason for closure (healed, transferred, other)
 * @returns {Promise<{closed: boolean, closureTime: Date, homeCarInstructions: string[]}>} Closure documentation
 */
export declare function closeWound(woundId: string, closureMethod: string, healingStatus: string): Promise<{
    closed: boolean;
    closureTime: Date;
    homeCarInstructions: string[];
}>;
/**
 * 29. Performs fall risk assessment using Morse Scale or Hendrich II tool.
 *
 * @param {string} patientMRN - Patient identifier
 * @param {object} fallRiskFactors - Clinical factors (history, meds, mobility, etc.)
 * @returns {Promise<FallRiskAssessment>} Fall risk determination with interventions
 *
 * @example
 * ```typescript
 * const fallRisk = await assessFallRisk('MRN123', {
 *   historyOfFalls: true,
 *   mobilityStatus: 'unsteady',
 *   psychotropicMeds: true,
 *   eliminationProblems: true
 * });
 * ```
 */
export declare function assessFallRisk(patientMRN: string, fallRiskFactors: any): Promise<FallRiskAssessment>;
/**
 * 30. Assesses pressure ulcer risk using Braden Scale (sensory, moisture, activity, mobility, nutrition, friction).
 *
 * @param {string} patientMRN - Patient identifier
 * @param {object} bradenFactors - Braden scale component scores
 * @returns {Promise<BradenScoreAssessment>} Braden score with risk categorization
 */
export declare function assessPressureUlcerRisk(patientMRN: string, bradenFactors: any): Promise<BradenScoreAssessment>;
/**
 * 31. Documents skin protection and pressure relief interventions (turns, positioning, mattress).
 *
 * @param {string} patientMRN - Patient identifier
 * @param {string} interventionType - 'turning' | 'positioning' | 'mattress' | 'elevation'
 * @param {string} details - Specific intervention details
 * @returns {Promise<{documentedId: string, nextAction: string, nextScheduledTime: Date}>} Intervention documentation
 */
export declare function documentPressureReliefIntervention(patientMRN: string, interventionType: string, details: string): Promise<{
    documentedId: string;
    nextAction: string;
    nextScheduledTime: Date;
}>;
/**
 * 32. Performs pain assessment using NRS (0-10), faces, or verbal scale.
 *
 * @param {string} patientMRN - Patient identifier
 * @param {number} painScore - Pain score on chosen scale
 * @param {object} painDetails - Location, character, factors
 * @returns {Promise<PainAssessment>} Pain assessment documentation
 */
export declare function assessPatientPain(patientMRN: string, painScore: number, painDetails: any): Promise<PainAssessment>;
/**
 * 33. Documents PRN pain medication administration with effectiveness reassessment.
 *
 * @param {string} patientMRN - Patient identifier
 * @param {string} prnMedicationId - PRN medication identifier
 * @param {number} painScoreBefore - Pre-medication pain score
 * @returns {Promise<{dosed: boolean, reassessmentTime: Date, expectedReassessmentInterval: number}>} PRN administration
 */
export declare function administerprnPainMedication(patientMRN: string, prnMedicationId: string, painScoreBefore: number): Promise<{
    dosed: boolean;
    reassessmentTime: Date;
    expectedReassessmentInterval: number;
}>;
/**
 * 34. Documents restraint application with physician order and clinical justification.
 *
 * @param {string} patientMRN - Patient identifier
 * @param {object} restraintData - Type, indication, duration
 * @returns {Promise<{restraintId: string, documented: boolean, physicianOrderRequired: boolean}>} Restraint documentation
 *
 * @example
 * ```typescript
 * const restraint = await documentRestraintApplication('MRN123', {
 *   type: 'wrist',
 *   indication: 'Prevent self-extubation',
 *   duration: '4 hours',
 *   frequency: 'Continuous'
 * });
 * ```
 */
export declare function documentRestraintApplication(patientMRN: string, restraintData: any): Promise<{
    restraintId: string;
    documented: boolean;
    physicianOrderRequired: boolean;
}>;
/**
 * 35. Records periodic restraint monitoring (circulation, skin integrity, behavior).
 *
 * @param {string} restraintId - Restraint identifier
 * @param {object} monitoringData - Circulation, skin integrity, patient response
 * @returns {Promise<{monitoringId: string, nextCheckDue: Date, concerns: string[]}>} Monitoring documentation
 */
export declare function monitorRestraint(restraintId: string, monitoringData: any): Promise<{
    monitoringId: string;
    nextCheckDue: Date;
    concerns: string[];
}>;
/**
 * 36. Removes restraint with reassessment of need and post-removal monitoring.
 *
 * @param {string} restraintId - Restraint identifier
 * @param {string} removalReason - Reason for removal
 * @returns {Promise<{removed: boolean, removalTime: Date, postRemovalMonitoringPlan: string}>} Removal documentation
 */
export declare function removeRestraint(restraintId: string, removalReason: string): Promise<{
    removed: boolean;
    removalTime: Date;
    postRemovalMonitoringPlan: string;
}>;
/**
 * 37. Performs structured nursing handoff (SBAR format) between shifts.
 *
 * @param {string} giverRN - Outgoing nurse identifier
 * @param {string} receiverRN - Incoming nurse identifier
 * @param {string[]} patientMRNs - Patient MRNs to handoff
 * @returns {Promise<{handoffId: string, completed: boolean, handoffTime: Date}>} Handoff documentation
 *
 * @example
 * ```typescript
 * const handoff = await performShiftNursingHandoff('RN-001', 'RN-002', ['MRN123', 'MRN456']);
 * ```
 */
export declare function performShiftNursingHandoff(giverRN: string, receiverRN: string, patientMRNs: string[]): Promise<{
    handoffId: string;
    completed: boolean;
    handoffTime: Date;
}>;
/**
 * 38. Generates SBAR report for individual patient handoff with situation, background, assessment, recommendation.
 *
 * @param {string} patientMRN - Patient identifier
 * @returns {Promise<{sbarId: string, situation: string, background: string, assessment: string, recommendation: string}>} SBAR report
 */
export declare function generateSBARReport(patientMRN: string): Promise<{
    sbarId: string;
    situation: string;
    background: string;
    assessment: string;
    recommendation: string;
}>;
/**
 * 39. Documents handoff readiness checklist (tasks completed, outstanding issues).
 *
 * @param {string} handoffId - Handoff identifier
 * @param {object[]} checklist - Tasks completed, outstanding items
 * @returns {Promise<{readyForHandoff: boolean, outstandingItems: string[]}>} Readiness assessment
 */
export declare function completeHandoffReadinessChecklist(handoffId: string, checklist: any[]): Promise<{
    readyForHandoff: boolean;
    outstandingItems: string[];
}>;
/**
 * 40. Assigns nursing tasks with priority, delegation option, and tracking.
 *
 * @param {string} patientMRN - Patient identifier
 * @param {string} taskDescription - Task to perform
 * @param {string} assignedTo - RN/delegate identifier
 * @param {1 | 2 | 3 | 4 | 5} priority - Task priority (1=highest)
 * @returns {Promise<{taskId: string, assigned: boolean, dueTime: Date}>} Task assignment
 *
 * @example
 * ```typescript
 * const task = await assignNursingTask('MRN123', 'Ambulate patient', 'RN-001', 2);
 * ```
 */
export declare function assignNursingTask(patientMRN: string, taskDescription: string, assignedTo: string, priority: 1 | 2 | 3 | 4 | 5): Promise<{
    taskId: string;
    assigned: boolean;
    dueTime: Date;
}>;
/**
 * 41. Computes nursing acuity score for staffing ratio assessment.
 *
 * @param {string} patientMRN - Patient identifier
 * @returns {Promise<NursingAcuityScore>} Acuity score with staffing recommendation
 */
export declare function computeNursingAcuityScore(patientMRN: string): Promise<NursingAcuityScore>;
/**
 * 42. Generates nursing quality metrics report (turn frequency, ambulation, skin checks, compliance).
 *
 * @param {string} unitId - Nursing unit identifier
 * @param {Date} startDate - Reporting period start
 * @param {Date} endDate - Reporting period end
 * @returns {Promise<{reportId: string, metrics: {turnFrequency: number, ambulationRate: number, skinCheckCompliance: number, fallPreventionScore: number}}>} Quality report
 */
export declare function generateNursingQualityMetricsReport(unitId: string, startDate: Date, endDate: Date): Promise<{
    reportId: string;
    metrics: {
        turnFrequency: number;
        ambulationRate: number;
        skinCheckCompliance: number;
        fallPreventionScore: number;
    };
}>;
//# sourceMappingURL=health-nursing-workflows-kit.d.ts.map