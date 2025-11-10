/**
 * LOC: HLTH-ED-MGT-001
 * File: /reuse/server/health/health-emergency-department-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - class-validator
 *   - fhir/r4 (HL7 FHIR R4)
 *   - crypto (Node.js)
 *
 * DOWNSTREAM (imported by):
 *   - ED registration services
 *   - Triage workflow engines
 *   - Track board management systems
 *   - Capacity planning modules
 *   - ED metrics/analytics services
 */
/**
 * ED QuickReg minimal patient registration
 */
export interface EDQuickRegData {
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    gender: 'male' | 'female' | 'other' | 'unknown';
    phone?: string;
    ssn?: string;
    knownPatient?: boolean;
    existingMRN?: string;
    reason?: string;
    severity?: 'life-threatening' | 'severe' | 'moderate' | 'minor';
}
/**
 * ESI Triage Level (1-5)
 */
export type ESILevel = 1 | 2 | 3 | 4 | 5;
/**
 * ESI triage decision matrix
 */
export interface ESITriageData {
    isHighRiskCondition?: boolean;
    requiresImmediateLifeSupport?: boolean;
    requiresHighRiskSituation?: boolean;
    vitalsUnstable?: boolean;
    confusedDisorientedLethargy?: boolean;
    painSeverity?: number;
    acuteDisease?: boolean;
}
/**
 * ESI triage result
 */
export interface ESITriageResult {
    level: ESILevel;
    reasoning: string;
    timestamp: Date;
    triageNurseId?: string;
    highRiskFactors: string[];
}
/**
 * ED track board entry
 */
export interface EDTrackBoardEntry {
    registrationId: string;
    patientName: string;
    mrn: string;
    esiLevel: ESILevel;
    arrivedAt: Date;
    currentLocation: string;
    assignedBedId?: string;
    statusCode: 'waiting' | 'triage' | 'waiting-room' | 'exam' | 'procedure' | 'results' | 'discharge' | 'admit';
    provider?: string;
    nextAction?: string;
}
/**
 * ED bed configuration
 */
export interface EDBedConfig {
    bedId: string;
    areaCode: string;
    bedType: 'trauma' | 'resus' | 'acute' | 'fast-track' | 'pediatric' | 'psychiatric';
    status: 'available' | 'occupied' | 'cleaning' | 'maintenance' | 'reserved';
    currentPatientMRN?: string;
    acuityLevel?: 'low' | 'medium' | 'high' | 'critical';
    isolation?: boolean;
    lastCleaned?: Date;
}
/**
 * ED bed assignment algorithm input
 */
export interface EDBeAssignmentInput {
    patientMRN: string;
    esiLevel: ESILevel;
    patientAge: number;
    requiresIsolation: boolean;
    specialNeeds?: string[];
    preferredArea?: string;
}
/**
 * ED fast track workflow
 */
export interface EDFastTrackCriteria {
    esiLevel: 4 | 5;
    expectedLOS: number;
    noComplications: boolean;
    independentAmbulation: boolean;
    noSuturing: boolean;
    noImagingRequired: boolean;
}
/**
 * Trauma activation parameters
 */
export interface TraumaActivationParams {
    patientMRN: string;
    mechanismOfInjury: string;
    injurySeverityScore?: number;
    procedures: string[];
    specialistTeams: string[];
    estimatedArrival?: Date;
    location?: string;
}
/**
 * ED disposition plan
 */
export interface EDDispositionPlan {
    patientMRN: string;
    recommendedDisposition: 'discharge' | 'admit' | 'observation' | 'transfer';
    admittingService?: string;
    dischargeInstructions?: string;
    followUpAppointment?: Date;
    prescriptions?: string[];
    boardingLocation?: string;
}
/**
 * LWBS (Leave-Without-Being-Seen) incident
 */
export interface LWBSIncident {
    registrationId: string;
    patientMRN: string;
    arrivedAt: Date;
    leftAt: Date;
    timeWaiting: number;
    esiLevel: ESILevel;
    lastKnownLocation: string;
    reason?: string;
    staffAlerted: boolean;
    followUpAttempted: boolean;
}
/**
 * ED metrics calculation payload
 */
export interface EDMetricsPayload {
    doorToDoctorTime: number;
    doorToEKGTime?: number;
    doorToLabTime?: number;
    doorToImagingTime?: number;
    lengthOfStay: number;
    registrationToDischargeTime: number;
    bedTurnoverTime?: number;
}
/**
 * ED capacity status
 */
export interface EDCapacityStatus {
    totalBeds: number;
    availableBeds: number;
    occupiedBeds: number;
    cleaningBeds: number;
    utilizationRate: number;
    averageWaitTime: number;
    estimatedWaitForESI3: number;
    surgeLevel: 'normal' | 'elevated' | 'surge' | 'critical';
}
/**
 * ED order set template
 */
export interface EDOrderSetTemplate {
    templateId: string;
    name: string;
    chiefComplaint: string;
    orders: Array<{
        orderType: 'lab' | 'imaging' | 'medication' | 'procedure';
        code: string;
        description: string;
        urgency: 'stat' | 'urgent' | 'routine';
    }>;
    approvalStatus: 'draft' | 'approved' | 'active' | 'inactive';
}
/**
 * 1. Performs rapid ED QuickReg registration for emergency walk-ins.
 *
 * @param {EDQuickRegData} registrationData - Minimal patient data for quick registration
 * @returns {Promise<{registrationId: string, tempMRN: string, timestamp: Date}>} Temporary registration
 *
 * @example
 * ```typescript
 * const quickReg = await performEDQuickReg({
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   dateOfBirth: new Date('1970-01-01'),
 *   gender: 'male',
 *   severity: 'severe'
 * });
 * ```
 */
export declare function performEDQuickReg(registrationData: EDQuickRegData): Promise<{
    registrationId: string;
    tempMRN: string;
    timestamp: Date;
}>;
/**
 * 2. Updates QuickReg with full demographics after initial triage.
 *
 * @param {string} registrationId - QuickReg registration ID
 * @param {object} fullDemographics - Complete demographic information
 * @returns {Promise<{updated: boolean, mrnAssigned: string}>} Update confirmation
 */
export declare function updateQuickRegWithFullDemographics(registrationId: string, fullDemographics: any): Promise<{
    updated: boolean;
    mrnAssigned: string;
}>;
/**
 * 3. Handles duplicate patient detection during ED registration.
 *
 * @param {string} firstName - Patient first name
 * @param {string} lastName - Patient last name
 * @param {Date} dateOfBirth - Patient date of birth
 * @returns {Promise<Array<{mrnId: string, matchScore: number, reason: string}>>} Potential matches
 */
export declare function detectDuplicatePatientsInED(firstName: string, lastName: string, dateOfBirth: Date): Promise<Array<{
    mrnId: string;
    matchScore: number;
    reason: string;
}>>;
/**
 * 4. Merges duplicate ED registrations with audit trail.
 *
 * @param {string} primaryMRN - Primary/master MRN
 * @param {string} duplicateMRN - Duplicate MRN to merge
 * @param {string} auditUserId - User performing merge
 * @returns {Promise<{mergeId: string, success: boolean, auditTrailId: string}>} Merge confirmation
 */
export declare function mergeEDDuplicateRegistrations(primaryMRN: string, duplicateMRN: string, auditUserId: string): Promise<{
    mergeId: string;
    success: boolean;
    auditTrailId: string;
}>;
/**
 * 5. Retrieves full ED registration record with visit history.
 *
 * @param {string} registrationId - ED registration ID
 * @returns {Promise<any>} Complete registration record
 */
export declare function getEDRegistrationRecord(registrationId: string): Promise<any>;
/**
 * 6. Validates patient arrival and triggers triage workflow.
 *
 * @param {string} registrationId - Registration to validate
 * @param {object} arrivalData - EHR check-in data
 * @returns {Promise<{validated: boolean, triageStartTime: Date, assignedTriageNurse?: string}>} Validation result
 */
export declare function validatePatientArrivalAndStartTriage(registrationId: string, arrivalData: any): Promise<{
    validated: boolean;
    triageStartTime: Date;
    assignedTriageNurse?: string;
}>;
/**
 * 7. Implements comprehensive ESI triage algorithm with decision tree.
 *
 * @param {ESITriageData} triageData - Clinical data for ESI decision
 * @param {string} chiefComplaint - Patient's chief complaint
 * @returns {ESITriageResult} ESI level determination with reasoning
 *
 * @example
 * ```typescript
 * const triageResult = performESITriage({
 *   isHighRiskCondition: true,
 *   requiresImmediateLifeSupport: false,
 *   painSeverity: 8
 * }, 'Chest pain');
 * ```
 */
export declare function performESITriage(triageData: ESITriageData, chiefComplaint: string): ESITriageResult;
/**
 * 8. Determines ESI-1 (Immediate Life Support) conditions.
 *
 * @param {object} vitalSigns - Current vital signs
 * @param {string} presentingProblem - Chief complaint
 * @returns {boolean} True if ESI-1 criteria met
 */
export declare function isESI1Condition(vitalSigns: any, presentingProblem: string): boolean;
/**
 * 9. Evaluates ESI-2 (High Risk Situation/Condition) criteria.
 *
 * @param {string[]} riskFactors - Array of clinical risk factors
 * @param {boolean} immunocompromised - Immune status
 * @returns {{isESI2: boolean, riskSummary: string}} ESI-2 determination
 */
export declare function evaluateESI2HighRiskCriteria(riskFactors: string[], immunocompromised: boolean): {
    isESI2: boolean;
    riskSummary: string;
};
/**
 * 10. Computes pain-severity based ESI-3 assignment.
 *
 * @param {number} painScore - NRS pain scale (0-10)
 * @param {string} painCharacter - Description of pain
 * @returns {ESILevel} ESI level for pain presentation
 */
export declare function assessPainBasedESI(painScore: number, painCharacter: string): ESILevel;
/**
 * 11. Determines ESI-3 vs ESI-4 for stable patients with single complaint.
 *
 * @param {string} complaint - Chief complaint
 * @param {number} painScore - Pain severity
 * @param {boolean} chronicCondition - Has chronic underlying condition
 * @returns {ESILevel} ESI-3 or ESI-4 determination
 */
export declare function differentiateESI3FromESI4(complaint: string, painScore: number, chronicCondition: boolean): ESILevel;
/**
 * 12. Stores ESI triage result with multi-user validation capability.
 *
 * @param {string} registrationId - ED registration
 * @param {ESITriageResult} triageResult - ESI determination
 * @param {string} triageNurseId - Assigning nurse
 * @returns {Promise<{storedId: string, validated: boolean}>} Storage confirmation
 */
export declare function storeESITriageResult(registrationId: string, triageResult: ESITriageResult, triageNurseId: string): Promise<{
    storedId: string;
    validated: boolean;
}>;
/**
 * 13. Retrieves triage history for re-triage decisions.
 *
 * @param {string} registrationId - ED registration
 * @returns {Promise<Array<{triageLevel: ESILevel, timestamp: Date, triageNurse: string}>>} Triage history
 */
export declare function getTriageHistory(registrationId: string): Promise<Array<{
    triageLevel: ESILevel;
    timestamp: Date;
    triageNurse: string;
}>>;
/**
 * 14. Performs automatic re-triage based on clinical deterioration.
 *
 * @param {string} registrationId - Current ED visit
 * @param {object} updatedVitals - New vital signs
 * @returns {Promise<{requiresRetriage: boolean, newESILevel?: ESILevel}>} Re-triage decision
 */
export declare function evaluateForAutomaticRetriage(registrationId: string, updatedVitals: any): Promise<{
    requiresRetriage: boolean;
    newESILevel?: ESILevel;
}>;
/**
 * 15. Initializes real-time ED track board display.
 *
 * @param {string} edDepartmentId - Department identifier
 * @returns {Promise<{trackBoardId: string, activePatientCount: number}>} Track board initialization
 *
 * @example
 * ```typescript
 * const trackBoard = await initializeEDTrackBoard('ED-MAIN-01');
 * ```
 */
export declare function initializeEDTrackBoard(edDepartmentId: string): Promise<{
    trackBoardId: string;
    activePatientCount: number;
}>;
/**
 * 16. Adds patient to ED track board with real-time position.
 *
 * @param {string} trackBoardId - Track board identifier
 * @param {EDTrackBoardEntry} entry - Track board entry data
 * @returns {Promise<{added: boolean, displayPosition: number}>} Addition confirmation
 */
export declare function addPatientToTrackBoard(trackBoardId: string, entry: EDTrackBoardEntry): Promise<{
    added: boolean;
    displayPosition: number;
}>;
/**
 * 17. Updates patient status on track board in real-time.
 *
 * @param {string} trackBoardId - Track board identifier
 * @param {string} patientMRN - Patient identifier
 * @param {string} newStatus - New status code
 * @returns {Promise<{updated: boolean, updateTimestamp: Date}>} Update confirmation
 */
export declare function updateTrackBoardStatus(trackBoardId: string, patientMRN: string, newStatus: string): Promise<{
    updated: boolean;
    updateTimestamp: Date;
}>;
/**
 * 18. Retrieves full ED track board snapshot for staff visualization.
 *
 * @param {string} trackBoardId - Track board identifier
 * @returns {Promise<EDTrackBoardEntry[]>} Current track board entries
 */
export declare function getFullTrackBoardSnapshot(trackBoardId: string): Promise<EDTrackBoardEntry[]>;
/**
 * 19. Filters track board by area, ESI level, or provider assignment.
 *
 * @param {string} trackBoardId - Track board identifier
 * @param {object} filterCriteria - Filter parameters
 * @returns {Promise<EDTrackBoardEntry[]>} Filtered entries
 */
export declare function filterTrackBoard(trackBoardId: string, filterCriteria: {
    area?: string;
    esiLevel?: ESILevel;
    provider?: string;
}): Promise<EDTrackBoardEntry[]>;
/**
 * 20. Generates ED track board alert for critical patient movement/status change.
 *
 * @param {string} patientMRN - Patient identifier
 * @param {string} alertType - 'critical-change' | 'awaiting-provider' | 'disposition-pending'
 * @returns {Promise<{alertId: string, notificationSent: boolean}>} Alert confirmation
 */
export declare function sendTrackBoardAlert(patientMRN: string, alertType: string): Promise<{
    alertId: string;
    notificationSent: boolean;
}>;
/**
 * 21. Determines optimal ED bed assignment using acuity balancing algorithm.
 *
 * @param {EDBeAssignmentInput} assignmentInput - Patient acuity and preferences
 * @param {EDBedConfig[]} availableBeds - Available bed inventory
 * @returns {Promise<{assignedBedId: string, area: string, rationale: string}>} Bed assignment
 *
 * @example
 * ```typescript
 * const bedAssignment = await assignOptimalEDBed({
 *   patientMRN: 'MRN123',
 *   esiLevel: 2,
 *   patientAge: 65,
 *   requiresIsolation: false
 * }, availableBeds);
 * ```
 */
export declare function assignOptimalEDBed(assignmentInput: EDBeAssignmentInput, availableBeds: EDBedConfig[]): Promise<{
    assignedBedId: string;
    area: string;
    rationale: string;
}>;
/**
 * 22. Retrieves all ED bed statuses with real-time utilization metrics.
 *
 * @param {string} edDepartmentId - Department identifier
 * @returns {Promise<{beds: EDBedConfig[], utilizationRate: number}>} Bed status report
 */
export declare function getEDBedInventoryAndStatus(edDepartmentId: string): Promise<{
    beds: EDBedConfig[];
    utilizationRate: number;
}>;
/**
 * 23. Marks ED bed for cleaning and maintenance scheduling.
 *
 * @param {string} bedId - Bed identifier
 * @param {string} cleaningType - 'standard' | 'terminal' | 'isolation'
 * @returns {Promise<{bedId: string, cleaningScheduled: boolean}>} Cleaning status
 */
export declare function scheduleEDBedCleaning(bedId: string, cleaningType: string): Promise<{
    bedId: string;
    cleaningScheduled: boolean;
}>;
/**
 * 24. Performs patient bed transfer within ED with workflow continuity.
 *
 * @param {string} patientMRN - Patient identifier
 * @param {string} currentBedId - Current bed
 * @param {string} newBedId - Destination bed
 * @param {string} transferReason - Reason for transfer
 * @returns {Promise<{transferId: string, completed: boolean, transferTime: Date}>} Transfer confirmation
 */
export declare function performEDBedTransfer(patientMRN: string, currentBedId: string, newBedId: string, transferReason: string): Promise<{
    transferId: string;
    completed: boolean;
    transferTime: Date;
}>;
/**
 * 25. Computes optimal bed turnover order based on cleaning priority.
 *
 * @param {EDBedConfig[]} bedsNeedingCleaning - Dirty beds
 * @returns {string[]} Ordered list of bed IDs for cleaning sequence
 */
export declare function calculateBedTurnoverSequence(bedsNeedingCleaning: EDBedConfig[]): string[];
/**
 * 26. Monitors bed occupancy and alerts on extended stays.
 *
 * @param {string} bedId - Bed identifier
 * @param {number} timeInBedMinutes - Duration in bed
 * @returns {Promise<{extendedStay: boolean, recommendedAction?: string}>} Extended stay assessment
 */
export declare function checkBedOccupancyDuration(bedId: string, timeInBedMinutes: number): Promise<{
    extendedStay: boolean;
    recommendedAction?: string;
}>;
/**
 * 27. Reserves beds for incoming trauma activations with surge protection.
 *
 * @param {string} traumaLevel - 'level-1' | 'level-2' | 'level-3'
 * @param {number} bedsToReserve - Number of beds needed
 * @returns {Promise<{reserved: boolean, reservedBedIds: string[]}>} Reservation confirmation
 */
export declare function reserveBedsForTraumaActivation(traumaLevel: string, bedsToReserve: number): Promise<{
    reserved: boolean;
    reservedBedIds: string[];
}>;
/**
 * 28. Evaluates patient eligibility for ED fast track segregation.
 *
 * @param {EDFastTrackCriteria} criteria - Clinical criteria for fast track
 * @returns {Promise<{eligible: boolean, condition: string}>} Fast track eligibility
 *
 * @example
 * ```typescript
 * const ftEligible = await assessFastTrackEligibility({
 *   esiLevel: 5,
 *   expectedLOS: 30,
 *   noComplications: true,
 *   independentAmbulation: true,
 *   noSuturing: true,
 *   noImagingRequired: true
 * });
 * ```
 */
export declare function assessFastTrackEligibility(criteria: EDFastTrackCriteria): Promise<{
    eligible: boolean;
    condition: string;
}>;
/**
 * 29. Routes eligible patients to fast track area for expedited care.
 *
 * @param {string} registrationId - ED registration
 * @returns {Promise<{routed: boolean, fastTrackAreaId: string}>} Routing confirmation
 */
export declare function routePatientToFastTrack(registrationId: string): Promise<{
    routed: boolean;
    fastTrackAreaId: string;
}>;
/**
 * 30. Creates ED disposition plan with admit/discharge/observation routing.
 *
 * @param {string} patientMRN - Patient identifier
 * @param {object} clinicalSummary - ED visit summary
 * @returns {Promise<EDDispositionPlan>} Disposition recommendation
 */
export declare function createEDDispositionPlan(patientMRN: string, clinicalSummary: any): Promise<EDDispositionPlan>;
/**
 * 31. Manages ED observation admissions (23-hour holds) with billing codes.
 *
 * @param {string} registrationId - ED registration
 * @param {number} observationHours - Observation window
 * @returns {Promise<{observationId: string, billingCode: string, expectedDischargeTime: Date}>} Observation setup
 */
export declare function setupEDObservationAdmission(registrationId: string, observationHours: number): Promise<{
    observationId: string;
    billingCode: string;
    expectedDischargeTime: Date;
}>;
/**
 * 32. Handles ED-to-inpatient admission workflow with boarding management.
 *
 * @param {string} registrationId - ED registration
 * @param {string} admittingService - Destination service (medicine, surgery, etc.)
 * @returns {Promise<{admissionOrderId: string, boardingBedId?: string, estimatedBedAvailability: Date}>} Admission workflow
 */
export declare function executeEDToInpatientAdmission(registrationId: string, admittingService: string): Promise<{
    admissionOrderId: string;
    boardingBedId?: string;
    estimatedBedAvailability: Date;
}>;
/**
 * 33. Manages against-medical-advice (AMA) patient discharge documentation.
 *
 * @param {string} registrationId - ED registration
 * @param {object} amaDetails - AMA-specific information
 * @returns {Promise<{amaDocumentId: string, signed: boolean}>} AMA documentation
 */
export declare function documentAMADischarge(registrationId: string, amaDetails: any): Promise<{
    amaDocumentId: string;
    signed: boolean;
}>;
/**
 * 34. Initiates transfer to higher level of care (STEMI, sepsis, etc.).
 *
 * @param {string} patientMRN - Patient identifier
 * @param {string} transferReason - Clinical justification
 * @param {string} destinationFacility - Receiving facility
 * @returns {Promise<{transferId: string, activated: boolean, acceptanceTime?: Date}>} Transfer activation
 */
export declare function initiateHighLevelCareTransfer(patientMRN: string, transferReason: string, destinationFacility: string): Promise<{
    transferId: string;
    activated: boolean;
    acceptanceTime?: Date;
}>;
/**
 * 35. Processes ED discharge with instructions, follow-up, and reconciliation.
 *
 * @param {string} registrationId - ED registration
 * @param {object} dischargeData - Discharge summary and instructions
 * @returns {Promise<{dischargeId: string, instructionsGenerated: boolean}>} Discharge confirmation
 */
export declare function executeEDDischarge(registrationId: string, dischargeData: any): Promise<{
    dischargeId: string;
    instructionsGenerated: boolean;
}>;
/**
 * 36. Triggers trauma activation protocol with automated page/notify to teams.
 *
 * @param {TraumaActivationParams} activationParams - Trauma details
 * @returns {Promise<{activationId: string, teamsNotified: string[], activationTime: Date}>} Activation confirmation
 *
 * @example
 * ```typescript
 * const trauma = await activateTraumaProtocol({
 *   patientMRN: 'MRN456',
 *   mechanismOfInjury: 'MVA - rollover',
 *   injurySeverityScore: 25,
 *   procedures: ['CT trauma protocol', 'Trauma labs'],
 *   specialistTeams: ['Trauma Surgery', 'Anesthesia', 'ICU']
 * });
 * ```
 */
export declare function activateTraumaProtocol(activationParams: TraumaActivationParams): Promise<{
    activationId: string;
    teamsNotified: string[];
    activationTime: Date;
}>;
/**
 * 37. Manages trauma team assembly and OR scheduling coordination.
 *
 * @param {string} activationId - Trauma activation ID
 * @returns {Promise<{teamsAssembled: boolean, orScheduled: boolean, estimatedReadiness: Date}>} Team assembly status
 */
export declare function orchestrateTraumaTeamAssembly(activationId: string): Promise<{
    teamsAssembled: boolean;
    orScheduled: boolean;
    estimatedReadiness: Date;
}>;
/**
 * 38. Deactivates trauma protocol when activation criteria no longer met.
 *
 * @param {string} activationId - Trauma activation ID
 * @param {string} deactivationReason - Reason for deactivation
 * @returns {Promise<{deactivated: boolean, finalOutcome: string}>} Deactivation confirmation
 */
export declare function deactivateTraumaProtocol(activationId: string, deactivationReason: string): Promise<{
    deactivated: boolean;
    finalOutcome: string;
}>;
/**
 * 39. Documents trauma resuscitation procedures and massive transfusion protocol (MTP).
 *
 * @param {string} activationId - Trauma activation ID
 * @param {object} resusData - Resuscitation procedures and blood products used
 * @returns {Promise<{documentedId: string, mtpActivated: boolean}>} Documentation completion
 */
export declare function documentTraumaResuscitation(activationId: string, resusData: any): Promise<{
    documentedId: string;
    mtpActivated: boolean;
}>;
/**
 * 40. Computes comprehensive ED key performance indicators (door-to-doc, LOS, etc.).
 *
 * @param {EDMetricsPayload} metricsData - Clinical timeline data
 * @returns {{doorToDoctorMinutes: number, lengthOfStayMinutes: number, performanceScore: number}} KPI results
 *
 * @example
 * ```typescript
 * const kpi = computeEDMetrics({
 *   doorToDoctorTime: 45,
 *   doorToEKGTime: 15,
 *   lengthOfStay: 240,
 *   registrationToDischargeTime: 240
 * });
 * ```
 */
export declare function computeEDMetrics(metricsData: EDMetricsPayload): {
    doorToDoctorMinutes: number;
    lengthOfStayMinutes: number;
    performanceScore: number;
};
/**
 * 41. Retrieves real-time ED capacity status with surge level assessment.
 *
 * @param {string} edDepartmentId - Department identifier
 * @returns {Promise<EDCapacityStatus>} Current capacity metrics
 */
export declare function getEDCapacityStatus(edDepartmentId: string): Promise<EDCapacityStatus>;
/**
 * 42. Initiates surge protocol (expanded capacity, call-back staff) based on current volume.
 *
 * @param {string} edDepartmentId - Department identifier
 * @param {string} surgeLevel - 'elevated' | 'surge' | 'critical'
 * @returns {Promise<{surgeActivated: boolean, staffCallbackInitiated: boolean}>} Surge activation
 */
export declare function activateEDSurgeProtocol(edDepartmentId: string, surgeLevel: string): Promise<{
    surgeActivated: boolean;
    staffCallbackInitiated: boolean;
}>;
/**
 * 43. Loads and expands ED order set templates with medication/lab selection.
 *
 * @param {string} chiefComplaint - Chief complaint to match order set
 * @returns {Promise<EDOrderSetTemplate>} Matched order set with expansion
 */
export declare function loadAndExpandEDOrderSet(chiefComplaint: string): Promise<EDOrderSetTemplate>;
//# sourceMappingURL=health-emergency-department-kit.d.ts.map