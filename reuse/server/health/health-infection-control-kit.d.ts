/**
 * LOC: HLTH-INF-CTL-001
 * File: /reuse/server/health/health-infection-control-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - class-validator
 *   - class-transformer
 *   - crypto (Node.js)
 *
 * DOWNSTREAM (imported by):
 *   - Infection prevention services
 *   - Environmental services modules
 *   - Quality management services
 *   - Public health reporting
 *   - Clinical surveillance systems
 */
/**
 * Healthcare-Associated Infection (HAI) types
 */
export type HAIType = 'CLABSI' | 'CAUTI' | 'SSI' | 'VAP' | 'VAE' | 'CDI' | 'MRSA' | 'VRE' | 'CRE' | 'MDRO';
/**
 * Infection surveillance event
 */
export interface InfectionSurveillanceEvent {
    id?: string;
    patientId: string;
    encounterId?: string;
    eventDate: Date;
    infectionType: HAIType;
    pathogen?: string;
    site?: string;
    deviceAssociated?: boolean;
    deviceType?: 'central-line' | 'urinary-catheter' | 'ventilator' | 'other';
    deviceInsertionDate?: Date;
    deviceRemovalDate?: Date;
    onsetDate: Date;
    reportedDate: Date;
    reportedBy: string;
    facilityId: string;
    unitId?: string;
    nhsnReported?: boolean;
    nhsnEventId?: string;
    outcome?: 'resolved' | 'ongoing' | 'deceased' | 'transferred';
    notes?: string;
    riskFactors?: string[];
    preventable?: boolean;
    rootCauseAnalysis?: boolean;
    interventions?: string[];
}
/**
 * Isolation precaution types
 */
export type IsolationType = 'standard' | 'contact' | 'droplet' | 'airborne' | 'contact-plus' | 'protective';
/**
 * Isolation order
 */
export interface IsolationOrder {
    id?: string;
    patientId: string;
    encounterId: string;
    isolationType: IsolationType;
    reason: string;
    pathogen?: string;
    orderDate: Date;
    orderedBy: string;
    startDate: Date;
    endDate?: Date;
    status: 'active' | 'discontinued' | 'expired';
    signRequired?: boolean;
    roomRequirements?: {
        privateRoom: boolean;
        negativePressure?: boolean;
        anteRoom?: boolean;
        hepaFilter?: boolean;
    };
    ppeRequirements?: {
        gloves: boolean;
        gown: boolean;
        mask: boolean;
        n95: boolean;
        faceShield: boolean;
        eyeProtection: boolean;
    };
    specialInstructions?: string;
    discontinuedBy?: string;
    discontinuedReason?: string;
    complianceChecks?: Array<{
        timestamp: Date;
        checker: string;
        compliant: boolean;
        issues?: string[];
    }>;
}
/**
 * Outbreak detection data
 */
export interface OutbreakDetection {
    id?: string;
    facilityId: string;
    unitId?: string;
    pathogen: string;
    startDate: Date;
    endDate?: Date;
    status: 'suspected' | 'confirmed' | 'controlled' | 'resolved';
    caseCount: number;
    affectedPatients: string[];
    affectedStaff?: string[];
    commonSource?: string;
    transmissionMode?: 'contact' | 'droplet' | 'airborne' | 'foodborne' | 'waterborne' | 'vectorborne';
    investigationLead?: string;
    interventions?: string[];
    publicHealthNotified?: boolean;
    publicHealthAgency?: string;
    notificationDate?: Date;
    rootCause?: string;
    preventativeMeasures?: string[];
    notes?: string;
}
/**
 * Contact tracing record
 */
export interface ContactTrace {
    id?: string;
    indexCaseId: string;
    indexPatientId: string;
    contactType: 'patient' | 'staff' | 'visitor';
    contactId: string;
    contactName?: string;
    contactRole?: string;
    exposureDate: Date;
    exposureDuration?: number;
    exposureLocation?: string;
    exposureType: 'direct' | 'indirect' | 'environmental';
    riskLevel: 'high' | 'medium' | 'low';
    notified: boolean;
    notificationDate?: Date;
    tested: boolean;
    testDate?: Date;
    testResult?: 'positive' | 'negative' | 'pending';
    quarantined: boolean;
    quarantineStartDate?: Date;
    quarantineEndDate?: Date;
    symptomatic: boolean;
    symptomOnsetDate?: Date;
    followUpRequired: boolean;
    followUpDate?: Date;
    notes?: string;
}
/**
 * Hand hygiene observation
 */
export interface HandHygieneObservation {
    id?: string;
    observationDate: Date;
    observer: string;
    facilityId: string;
    unitId: string;
    staffMember?: string;
    staffRole?: string;
    moment: '1-before-patient' | '2-before-aseptic' | '3-after-body-fluid' | '4-after-patient' | '5-after-surroundings';
    action: 'hand-wash' | 'alcohol-rub' | 'none';
    compliant: boolean;
    technique?: 'adequate' | 'inadequate';
    duration?: number;
    productUsed?: string;
    notes?: string;
}
/**
 * Hand hygiene compliance report
 */
export interface HandHygieneComplianceReport {
    facilityId: string;
    unitId?: string;
    startDate: Date;
    endDate: Date;
    totalObservations: number;
    compliantObservations: number;
    complianceRate: number;
    byMoment: Record<string, {
        total: number;
        compliant: number;
        rate: number;
    }>;
    byRole: Record<string, {
        total: number;
        compliant: number;
        rate: number;
    }>;
    byProduct: Record<string, number>;
    trend: 'improving' | 'declining' | 'stable';
    benchmarkComparison?: {
        facilityAverage: number;
        nationalAverage: number;
    };
}
/**
 * Antibiotic prescription tracking
 */
export interface AntibioticPrescription {
    id?: string;
    patientId: string;
    encounterId: string;
    antibioticName: string;
    antibioticClass: string;
    dose: string;
    route: string;
    frequency: string;
    indication: string;
    cultureOrdered: boolean;
    cultureDate?: Date;
    pathogen?: string;
    sensitivity?: Record<string, 'susceptible' | 'intermediate' | 'resistant'>;
    prescribedBy: string;
    prescribedDate: Date;
    startDate: Date;
    plannedDuration?: number;
    endDate?: Date;
    status: 'active' | 'completed' | 'discontinued';
    reviewRequired: boolean;
    reviewDate?: Date;
    reviewedBy?: string;
    appropriateness?: 'appropriate' | 'inappropriate' | 'questionable';
    interventionRequired?: boolean;
    intervention?: string;
    stewardshipAlert?: boolean;
    notes?: string;
}
/**
 * Culture and sensitivity result
 */
export interface CultureResult {
    id?: string;
    patientId: string;
    encounterId?: string;
    orderDate: Date;
    collectionDate: Date;
    receivedDate?: Date;
    resultDate?: Date;
    specimenType: string;
    specimenSource: string;
    orderedBy: string;
    resultedBy?: string;
    status: 'pending' | 'preliminary' | 'final' | 'corrected';
    organisms: Array<{
        name: string;
        quantity?: string;
        gramStain?: string;
        morphology?: string;
        sensitivities?: Array<{
            antibiotic: string;
            interpretation: 'susceptible' | 'intermediate' | 'resistant';
            mic?: string;
            method?: string;
        }>;
    }>;
    criticalValue: boolean;
    criticalValueNotified?: boolean;
    notificationDate?: Date;
    notifiedTo?: string;
    comments?: string;
}
/**
 * Environmental services cleaning task
 */
export interface CleaningTask {
    id?: string;
    facilityId: string;
    location: string;
    locationType: 'patient-room' | 'operating-room' | 'procedure-room' | 'common-area' | 'isolation-room';
    cleaningType: 'routine' | 'terminal' | 'discharge' | 'isolation' | 'outbreak';
    priority: 'routine' | 'urgent' | 'stat';
    assignedTo?: string;
    assignedDate?: Date;
    scheduledDate: Date;
    startTime?: Date;
    completionTime?: Date;
    status: 'pending' | 'in-progress' | 'completed' | 'verified' | 'failed';
    checklist?: Array<{
        item: string;
        completed: boolean;
        notes?: string;
    }>;
    disinfectantUsed?: string;
    contactTime?: number;
    verifiedBy?: string;
    verificationMethod?: 'visual' | 'atp' | 'fluorescent-marker' | 'culture';
    atpReading?: number;
    passedVerification?: boolean;
    deficiencies?: string[];
    notes?: string;
}
/**
 * PPE usage tracking
 */
export interface PPEUsage {
    id?: string;
    facilityId: string;
    unitId: string;
    date: Date;
    ppeType: 'gloves' | 'gown' | 'mask-surgical' | 'n95' | 'face-shield' | 'eye-protection' | 'shoe-covers';
    quantity: number;
    reason?: string;
    patientEncounter?: boolean;
    isolationRelated?: boolean;
    procedureRelated?: boolean;
    recordedBy?: string;
    cost?: number;
}
/**
 * PPE inventory
 */
export interface PPEInventory {
    facilityId: string;
    unitId?: string;
    ppeType: string;
    currentStock: number;
    minimumStock: number;
    reorderPoint: number;
    lastRestocked?: Date;
    expirationDate?: Date;
    manufacturer?: string;
    lotNumber?: string;
    cost?: number;
    burnRate?: number;
    daysOfSupply?: number;
    lowStockAlert: boolean;
}
/**
 * Infection prevention protocol
 */
export interface InfectionPreventionProtocol {
    id?: string;
    name: string;
    category: 'hand-hygiene' | 'isolation' | 'device-management' | 'environmental' | 'antibiotic-stewardship' | 'outbreak';
    version: string;
    effectiveDate: Date;
    reviewDate?: Date;
    status: 'active' | 'draft' | 'retired';
    description: string;
    indication: string;
    steps: Array<{
        order: number;
        description: string;
        criticalStep: boolean;
        evidenceLevel?: string;
    }>;
    ppeRequired?: string[];
    supplies?: string[];
    frequency?: string;
    documentation?: string[];
    references?: string[];
    owner?: string;
    approvedBy?: string;
    approvalDate?: Date;
}
/**
 * NHSN reporting data
 */
export interface NHSNReport {
    id?: string;
    facilityId: string;
    reportingPeriod: {
        month: number;
        year: number;
    };
    reportType: 'HAI' | 'device-utilization' | 'mdro' | 'laboratory-id';
    submittedDate?: Date;
    submittedBy?: string;
    status: 'draft' | 'submitted' | 'accepted' | 'rejected';
    data: {
        clabsi?: {
            events: number;
            centralLineDays: number;
            sir?: number;
        };
        cauti?: {
            events: number;
            urinaryCatheterDays: number;
            sir?: number;
        };
        ssi?: {
            procedures: number;
            infections: number;
            sir?: number;
        };
        vae?: {
            events: number;
            ventilatorDays: number;
            sir?: number;
        };
        cdi?: {
            healthcareOnset: number;
            communityOnset: number;
            sir?: number;
        };
        mdro?: {
            mrsa: number;
            vre: number;
            cre: number;
            other: number;
        };
    };
    validationErrors?: string[];
    nhsnResponse?: string;
}
/**
 * 1. Records healthcare-associated infection (HAI) event.
 *
 * @param {InfectionSurveillanceEvent} event - Infection event details
 * @returns {InfectionSurveillanceEvent} Created event with ID
 *
 * @example
 * ```typescript
 * const clabsiEvent = recordInfectionEvent({
 *   patientId: 'patient-123',
 *   eventDate: new Date(),
 *   infectionType: 'CLABSI',
 *   deviceAssociated: true,
 *   deviceType: 'central-line',
 *   deviceInsertionDate: new Date('2024-01-15'),
 *   onsetDate: new Date('2024-01-20'),
 *   reportedDate: new Date(),
 *   reportedBy: 'nurse-456',
 *   facilityId: 'facility-789'
 * });
 * ```
 */
export declare function recordInfectionEvent(event: InfectionSurveillanceEvent): InfectionSurveillanceEvent;
/**
 * 2. Calculates device utilization ratio for HAI surveillance.
 *
 * @param {number} deviceDays - Total device days
 * @param {number} patientDays - Total patient days
 * @returns {number} Device utilization ratio
 *
 * @example
 * ```typescript
 * const centralLineDays = 450;
 * const patientDays = 900;
 * const utilizationRatio = calculateDeviceUtilizationRatio(centralLineDays, patientDays);
 * // Result: 0.50 (50% of patients had central lines)
 * ```
 */
export declare function calculateDeviceUtilizationRatio(deviceDays: number, patientDays: number): number;
/**
 * 3. Calculates Standardized Infection Ratio (SIR) for NHSN reporting.
 *
 * @param {number} observedInfections - Observed infection count
 * @param {number} predictedInfections - Predicted infection count (NHSN baseline)
 * @returns {number} SIR value
 *
 * @example
 * ```typescript
 * const sir = calculateSIR(5, 8.2);
 * // Result: 0.61 (39% fewer infections than predicted)
 * // SIR < 1.0 indicates better than baseline performance
 * ```
 */
export declare function calculateSIR(observedInfections: number, predictedInfections: number): number;
/**
 * 4. Identifies patients at high risk for HAI.
 *
 * @param {string} patientId - Patient identifier
 * @param {object} riskFactors - Risk factor data
 * @returns {object} Risk assessment
 *
 * @example
 * ```typescript
 * const riskAssessment = assessHAIRisk('patient-123', {
 *   centralLine: true,
 *   urinaryCatheter: true,
 *   ventilator: false,
 *   immunosuppressed: true,
 *   recentSurgery: true,
 *   lengthOfStay: 12
 * });
 *
 * if (riskAssessment.riskLevel === 'high') {
 *   // Implement enhanced surveillance
 * }
 * ```
 */
export declare function assessHAIRisk(patientId: string, riskFactors: {
    centralLine?: boolean;
    urinaryCatheter?: boolean;
    ventilator?: boolean;
    immunosuppressed?: boolean;
    recentSurgery?: boolean;
    lengthOfStay?: number;
    age?: number;
    comorbidities?: number;
}): {
    patientId: string;
    riskScore: number;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    riskFactors: string[];
    recommendations: string[];
};
/**
 * 5. Detects trends in infection rates using statistical process control.
 *
 * @param {number[]} monthlyRates - Monthly infection rates
 * @param {number} baseline - Baseline rate
 * @returns {object} Trend analysis
 *
 * @example
 * ```typescript
 * const rates = [2.1, 2.3, 2.8, 3.5, 3.9, 4.2, 3.8];
 * const trend = detectInfectionTrend(rates, 2.5);
 *
 * if (trend.alert) {
 *   console.log(`Infection rate trending ${trend.direction}`);
 *   // Investigate and implement interventions
 * }
 * ```
 */
export declare function detectInfectionTrend(monthlyRates: number[], baseline: number): {
    direction: 'increasing' | 'decreasing' | 'stable';
    alert: boolean;
    controlLimitExceeded: boolean;
    consecutiveIncreases: number;
    averageRate: number;
    percentChange: number;
};
/**
 * 6. Creates isolation precaution order.
 *
 * @param {Partial<IsolationOrder>} order - Isolation order details
 * @returns {IsolationOrder} Complete isolation order
 *
 * @example
 * ```typescript
 * const isolationOrder = createIsolationOrder({
 *   patientId: 'patient-123',
 *   encounterId: 'encounter-456',
 *   isolationType: 'contact',
 *   reason: 'MRSA colonization',
 *   pathogen: 'MRSA',
 *   orderDate: new Date(),
 *   orderedBy: 'dr-789',
 *   startDate: new Date(),
 *   status: 'active'
 * });
 * ```
 */
export declare function createIsolationOrder(order: Partial<IsolationOrder>): IsolationOrder;
/**
 * 7. Validates isolation precaution compliance.
 *
 * @param {IsolationOrder} order - Active isolation order
 * @param {object} observedPractice - Observed compliance data
 * @returns {object} Compliance validation result
 *
 * @example
 * ```typescript
 * const compliance = validateIsolationCompliance(isolationOrder, {
 *   glovesWorn: true,
 *   gownWorn: true,
 *   maskWorn: false,
 *   handHygieneBefore: true,
 *   handHygieneAfter: true
 * });
 *
 * if (!compliance.compliant) {
 *   console.error('Isolation precautions not followed:', compliance.violations);
 * }
 * ```
 */
export declare function validateIsolationCompliance(order: IsolationOrder, observedPractice: {
    glovesWorn?: boolean;
    gownWorn?: boolean;
    maskWorn?: boolean;
    n95Worn?: boolean;
    faceShieldWorn?: boolean;
    handHygieneBefore?: boolean;
    handHygieneAfter?: boolean;
}): {
    compliant: boolean;
    violations: string[];
    warnings: string[];
};
/**
 * 8. Generates isolation signage for patient room.
 *
 * @param {IsolationOrder} order - Isolation order
 * @returns {string} HTML signage
 *
 * @example
 * ```typescript
 * const signage = generateIsolationSignage(isolationOrder);
 * // Display signage outside patient room
 * await printService.print(signage);
 * ```
 */
export declare function generateIsolationSignage(order: IsolationOrder): string;
/**
 * 9. Discontinues isolation order.
 *
 * @param {string} orderId - Isolation order ID
 * @param {string} discontinuedBy - User discontinuing order
 * @param {string} reason - Reason for discontinuation
 * @returns {Partial<IsolationOrder>} Updated order
 *
 * @example
 * ```typescript
 * const discontinued = discontinueIsolation(
 *   'order-123',
 *   'dr-456',
 *   'Negative culture results x3'
 * );
 * ```
 */
export declare function discontinueIsolation(orderId: string, discontinuedBy: string, reason: string): Partial<IsolationOrder>;
/**
 * 10. Calculates isolation days for reporting.
 *
 * @param {IsolationOrder[]} orders - Isolation orders
 * @param {Date} startDate - Reporting period start
 * @param {Date} endDate - Reporting period end
 * @returns {object} Isolation statistics
 *
 * @example
 * ```typescript
 * const stats = calculateIsolationDays(
 *   isolationOrders,
 *   new Date('2024-01-01'),
 *   new Date('2024-01-31')
 * );
 * console.log(`Total isolation days: ${stats.totalIsolationDays}`);
 * ```
 */
export declare function calculateIsolationDays(orders: IsolationOrder[], startDate: Date, endDate: Date): {
    totalIsolationDays: number;
    byType: Record<string, number>;
    averageDuration: number;
};
/**
 * 11. Detects potential outbreak using statistical algorithms.
 *
 * @param {InfectionSurveillanceEvent[]} events - Recent infection events
 * @param {object} parameters - Detection parameters
 * @returns {OutbreakDetection | null} Detected outbreak or null
 *
 * @example
 * ```typescript
 * const outbreak = detectOutbreak(recentInfections, {
 *   facilityId: 'facility-123',
 *   unitId: 'icu-2',
 *   pathogen: 'C. difficile',
 *   timeWindow: 30, // days
 *   threshold: 3
 * });
 *
 * if (outbreak) {
 *   await notifyInfectionControl(outbreak);
 * }
 * ```
 */
export declare function detectOutbreak(events: InfectionSurveillanceEvent[], parameters: {
    facilityId: string;
    unitId?: string;
    pathogen?: string;
    timeWindow: number;
    threshold: number;
}): OutbreakDetection | null;
/**
 * 12. Initiates contact tracing for outbreak investigation.
 *
 * @param {string} indexCaseId - Index case event ID
 * @param {string} indexPatientId - Index patient ID
 * @param {object[]} potentialContacts - Potential contact list
 * @returns {ContactTrace[]} Contact trace records
 *
 * @example
 * ```typescript
 * const contacts = initiateContactTracing(
 *   'event-123',
 *   'patient-456',
 *   [
 *     { type: 'patient', id: 'patient-789', exposureDate: new Date() },
 *     { type: 'staff', id: 'nurse-012', exposureDate: new Date() }
 *   ]
 * );
 * ```
 */
export declare function initiateContactTracing(indexCaseId: string, indexPatientId: string, potentialContacts: Array<{
    type: 'patient' | 'staff' | 'visitor';
    id: string;
    name?: string;
    role?: string;
    exposureDate: Date;
    exposureDuration?: number;
    exposureLocation?: string;
    exposureType?: 'direct' | 'indirect' | 'environmental';
}>): ContactTrace[];
/**
 * 13. Generates outbreak investigation report.
 *
 * @param {OutbreakDetection} outbreak - Outbreak data
 * @param {InfectionSurveillanceEvent[]} events - Associated events
 * @param {ContactTrace[]} contacts - Contact traces
 * @returns {string} Investigation report
 *
 * @example
 * ```typescript
 * const report = generateOutbreakReport(outbreak, events, contacts);
 * await reportingService.submit(report, 'public-health');
 * ```
 */
export declare function generateOutbreakReport(outbreak: OutbreakDetection, events: InfectionSurveillanceEvent[], contacts: ContactTrace[]): string;
/**
 * 14. Calculates attack rate for outbreak analysis.
 *
 * @param {number} cases - Number of cases
 * @param {number} population - Population at risk
 * @returns {number} Attack rate percentage
 *
 * @example
 * ```typescript
 * const attackRate = calculateAttackRate(12, 150);
 * // Result: 8.0 (8% of population affected)
 * ```
 */
export declare function calculateAttackRate(cases: number, population: number): number;
/**
 * 15. Determines if public health notification is required.
 *
 * @param {OutbreakDetection} outbreak - Outbreak data
 * @param {object} criteria - Notification criteria
 * @returns {boolean} True if notification required
 *
 * @example
 * ```typescript
 * const requiresNotification = requiresPublicHealthNotification(outbreak, {
 *   reportablePathogens: ['E. coli O157', 'Salmonella', 'Legionella'],
 *   caseThreshold: 2,
 *   immunocompromisedPopulation: false
 * });
 * ```
 */
export declare function requiresPublicHealthNotification(outbreak: OutbreakDetection, criteria: {
    reportablePathogens: string[];
    caseThreshold: number;
    immunocompromisedPopulation?: boolean;
    foodborne?: boolean;
    waterborne?: boolean;
}): boolean;
/**
 * 16. Records hand hygiene observation.
 *
 * @param {HandHygieneObservation} observation - Observation data
 * @returns {HandHygieneObservation} Created observation with ID
 *
 * @example
 * ```typescript
 * const observation = recordHandHygieneObservation({
 *   observationDate: new Date(),
 *   observer: 'nurse-manager-123',
 *   facilityId: 'facility-456',
 *   unitId: 'med-surg-3',
 *   staffMember: 'nurse-789',
 *   staffRole: 'RN',
 *   moment: '1-before-patient',
 *   action: 'alcohol-rub',
 *   compliant: true,
 *   technique: 'adequate',
 *   duration: 25
 * });
 * ```
 */
export declare function recordHandHygieneObservation(observation: HandHygieneObservation): HandHygieneObservation;
/**
 * 17. Calculates hand hygiene compliance rate.
 *
 * @param {HandHygieneObservation[]} observations - Observations
 * @param {Date} startDate - Period start
 * @param {Date} endDate - Period end
 * @returns {HandHygieneComplianceReport} Compliance report
 *
 * @example
 * ```typescript
 * const report = calculateHandHygieneCompliance(
 *   observations,
 *   new Date('2024-01-01'),
 *   new Date('2024-01-31')
 * );
 * console.log(`Compliance rate: ${report.complianceRate}%`);
 * ```
 */
export declare function calculateHandHygieneCompliance(observations: HandHygieneObservation[], startDate: Date, endDate: Date): HandHygieneComplianceReport;
/**
 * 18. Validates hand hygiene technique.
 *
 * @param {object} technique - Technique parameters
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateHandHygieneTechnique({
 *   method: 'alcohol-rub',
 *   duration: 15,
 *   steps: ['palms', 'backs', 'fingers', 'thumbs', 'fingertips', 'wrists']
 * });
 * ```
 */
export declare function validateHandHygieneTechnique(technique: {
    method: 'hand-wash' | 'alcohol-rub';
    duration: number;
    steps?: string[];
}): {
    adequate: boolean;
    issues: string[];
    recommendations: string[];
};
/**
 * 19. Generates hand hygiene compliance dashboard data.
 *
 * @param {HandHygieneComplianceReport[]} monthlyReports - Monthly reports
 * @returns {object} Dashboard metrics
 *
 * @example
 * ```typescript
 * const dashboard = generateHandHygieneDashboard(last12MonthsReports);
 * // Display dashboard in UI
 * ```
 */
export declare function generateHandHygieneDashboard(monthlyReports: HandHygieneComplianceReport[]): {
    currentRate: number;
    trend: 'improving' | 'declining' | 'stable';
    monthlyTrend: number[];
    comparisonToGoal: number;
    topPerformingUnits: string[];
    needsImprovementUnits: string[];
};
/**
 * 20. Creates hand hygiene improvement action plan.
 *
 * @param {HandHygieneComplianceReport} report - Compliance report
 * @returns {string[]} Action items
 *
 * @example
 * ```typescript
 * const actionPlan = createHandHygieneActionPlan(complianceReport);
 * actionPlan.forEach(action => {
 *   console.log(`- ${action}`);
 * });
 * ```
 */
export declare function createHandHygieneActionPlan(report: HandHygieneComplianceReport): string[];
/**
 * 21. Tracks antibiotic prescription for stewardship review.
 *
 * @param {AntibioticPrescription} prescription - Prescription details
 * @returns {AntibioticPrescription} Created prescription with ID
 *
 * @example
 * ```typescript
 * const prescription = trackAntibioticPrescription({
 *   patientId: 'patient-123',
 *   encounterId: 'encounter-456',
 *   antibioticName: 'Vancomycin',
 *   antibioticClass: 'Glycopeptide',
 *   dose: '1g',
 *   route: 'IV',
 *   frequency: 'Q12H',
 *   indication: 'Suspected MRSA pneumonia',
 *   cultureOrdered: true,
 *   prescribedBy: 'dr-789',
 *   prescribedDate: new Date(),
 *   startDate: new Date(),
 *   status: 'active',
 *   reviewRequired: true
 * });
 * ```
 */
export declare function trackAntibioticPrescription(prescription: AntibioticPrescription): AntibioticPrescription;
/**
 * 22. Generates antibiotic stewardship alerts.
 *
 * @param {AntibioticPrescription} prescription - Antibiotic prescription
 * @param {CultureResult} cultureResult - Culture and sensitivity result
 * @returns {object} Stewardship alert
 *
 * @example
 * ```typescript
 * const alert = generateStewardshipAlert(prescription, cultureResult);
 * if (alert.requiresIntervention) {
 *   await notifyPharmacist(alert);
 * }
 * ```
 */
export declare function generateStewardshipAlert(prescription: AntibioticPrescription, cultureResult?: CultureResult): {
    alertType: 'de-escalation' | 'duration' | 'inappropriate' | 'no-culture' | 'resistance' | 'none';
    severity: 'high' | 'medium' | 'low';
    requiresIntervention: boolean;
    recommendations: string[];
    message: string;
};
/**
 * 23. Calculates antibiotic days of therapy (DOT).
 *
 * @param {AntibioticPrescription[]} prescriptions - Antibiotic prescriptions
 * @param {Date} startDate - Period start
 * @param {Date} endDate - Period end
 * @returns {object} DOT statistics
 *
 * @example
 * ```typescript
 * const stats = calculateDaysOfTherapy(
 *   prescriptions,
 *   new Date('2024-01-01'),
 *   new Date('2024-01-31')
 * );
 * console.log(`Total DOT: ${stats.totalDOT}`);
 * ```
 */
export declare function calculateDaysOfTherapy(prescriptions: AntibioticPrescription[], startDate: Date, endDate: Date): {
    totalDOT: number;
    byClass: Record<string, number>;
    byIndication: Record<string, number>;
    averageDuration: number;
};
/**
 * 24. Monitors antibiotic resistance patterns.
 *
 * @param {CultureResult[]} cultureResults - Culture results
 * @param {string} organism - Organism name
 * @returns {object} Resistance data
 *
 * @example
 * ```typescript
 * const resistance = monitorAntibioticResistance(
 *   cultureResults,
 *   'Staphylococcus aureus'
 * );
 * console.log(`MRSA rate: ${resistance.resistanceRates['Methicillin']}%`);
 * ```
 */
export declare function monitorAntibioticResistance(cultureResults: CultureResult[], organism: string): {
    organism: string;
    totalIsolates: number;
    resistanceRates: Record<string, number>;
    multiDrugResistant: number;
    trend: 'increasing' | 'decreasing' | 'stable';
};
/**
 * 25. Generates antibiotic stewardship metrics report.
 *
 * @param {AntibioticPrescription[]} prescriptions - Prescriptions
 * @param {CultureResult[]} cultures - Culture results
 * @param {Date} startDate - Period start
 * @param {Date} endDate - Period end
 * @returns {object} Stewardship metrics
 *
 * @example
 * ```typescript
 * const metrics = generateStewardshipMetrics(
 *   prescriptions,
 *   cultures,
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
export declare function generateStewardshipMetrics(prescriptions: AntibioticPrescription[], cultures: CultureResult[], startDate: Date, endDate: Date): {
    totalPrescriptions: number;
    cultureOrderedRate: number;
    appropriateTherapyRate: number;
    deEscalationRate: number;
    averageDuration: number;
    interventionRate: number;
};
/**
 * 26. Creates environmental cleaning task.
 *
 * @param {Partial<CleaningTask>} task - Cleaning task details
 * @returns {CleaningTask} Complete cleaning task
 *
 * @example
 * ```typescript
 * const task = createCleaningTask({
 *   facilityId: 'facility-123',
 *   location: 'Room 405',
 *   locationType: 'isolation-room',
 *   cleaningType: 'terminal',
 *   priority: 'urgent',
 *   scheduledDate: new Date(),
 *   status: 'pending'
 * });
 * ```
 */
export declare function createCleaningTask(task: Partial<CleaningTask>): CleaningTask;
/**
 * 27. Verifies cleaning quality using ATP bioluminescence.
 *
 * @param {number} atpReading - ATP reading in RLU
 * @param {string} surfaceType - Type of surface tested
 * @returns {object} Verification result
 *
 * @example
 * ```typescript
 * const verification = verifyCleaningQuality(150, 'high-touch-surface');
 * if (!verification.passed) {
 *   console.log('Re-cleaning required');
 * }
 * ```
 */
export declare function verifyCleaningQuality(atpReading: number, surfaceType: 'high-touch-surface' | 'patient-care-area' | 'food-surface' | 'general-surface'): {
    passed: boolean;
    grade: 'excellent' | 'good' | 'acceptable' | 'fail';
    threshold: number;
    action: string;
};
/**
 * 28. Tracks PPE usage and consumption.
 *
 * @param {PPEUsage} usage - PPE usage data
 * @returns {PPEUsage} Created usage record with ID
 *
 * @example
 * ```typescript
 * const usage = trackPPEUsage({
 *   facilityId: 'facility-123',
 *   unitId: 'icu-2',
 *   date: new Date(),
 *   ppeType: 'n95',
 *   quantity: 25,
 *   isolationRelated: true,
 *   recordedBy: 'charge-nurse-456'
 * });
 * ```
 */
export declare function trackPPEUsage(usage: PPEUsage): PPEUsage;
/**
 * 29. Monitors PPE inventory levels and alerts for low stock.
 *
 * @param {PPEInventory} inventory - Current inventory
 * @returns {object} Inventory alert
 *
 * @example
 * ```typescript
 * const alert = monitorPPEInventory(currentInventory);
 * if (alert.alertLevel === 'critical') {
 *   await notifySupplyChain(alert);
 * }
 * ```
 */
export declare function monitorPPEInventory(inventory: PPEInventory): {
    alertLevel: 'normal' | 'low' | 'critical' | 'depleted';
    daysUntilDepletion: number;
    reorderRequired: boolean;
    message: string;
};
/**
 * 30. Calculates PPE burn rate and forecasts needs.
 *
 * @param {PPEUsage[]} usageHistory - Historical usage data
 * @param {number} forecastDays - Days to forecast
 * @returns {object} Burn rate and forecast
 *
 * @example
 * ```typescript
 * const forecast = calculatePPEBurnRate(usageHistory, 30);
 * console.log(`Forecast need: ${forecast.forecastedQuantity} units in 30 days`);
 * ```
 */
export declare function calculatePPEBurnRate(usageHistory: PPEUsage[], forecastDays?: number): {
    dailyBurnRate: number;
    weeklyBurnRate: number;
    forecastedQuantity: number;
    trend: 'increasing' | 'decreasing' | 'stable';
};
/**
 * 31. Records culture and sensitivity result.
 *
 * @param {CultureResult} result - Culture result
 * @returns {CultureResult} Created result with ID
 *
 * @example
 * ```typescript
 * const culture = recordCultureResult({
 *   patientId: 'patient-123',
 *   orderDate: new Date('2024-01-15'),
 *   collectionDate: new Date('2024-01-15'),
 *   resultDate: new Date('2024-01-18'),
 *   specimenType: 'Blood',
 *   specimenSource: 'Venipuncture',
 *   orderedBy: 'dr-456',
 *   status: 'final',
 *   organisms: [{
 *     name: 'Staphylococcus aureus',
 *     quantity: 'Heavy growth',
 *     sensitivities: [
 *       { antibiotic: 'Methicillin', interpretation: 'resistant' },
 *       { antibiotic: 'Vancomycin', interpretation: 'susceptible' }
 *     ]
 *   }],
 *   criticalValue: true
 * });
 * ```
 */
export declare function recordCultureResult(result: CultureResult): CultureResult;
/**
 * 32. Identifies critical culture results requiring immediate notification.
 *
 * @param {CultureResult} result - Culture result
 * @returns {object} Critical value assessment
 *
 * @example
 * ```typescript
 * const assessment = assessCriticalCulture(cultureResult);
 * if (assessment.isCritical) {
 *   await notifyProvider(assessment);
 * }
 * ```
 */
export declare function assessCriticalCulture(result: CultureResult): {
    isCritical: boolean;
    reason: string[];
    notificationPriority: 'stat' | 'urgent' | 'routine';
    recommendedActions: string[];
};
/**
 * 33. Generates culture result notification.
 *
 * @param {CultureResult} result - Culture result
 * @param {object} assessment - Critical value assessment
 * @returns {string} Notification message
 *
 * @example
 * ```typescript
 * const notification = generateCultureNotification(result, assessment);
 * await smsService.send(provider.phone, notification);
 * ```
 */
export declare function generateCultureNotification(result: CultureResult, assessment: {
    isCritical: boolean;
    reason: string[];
    notificationPriority: string;
}): string;
/**
 * 34. Prepares NHSN monthly surveillance report.
 *
 * @param {InfectionSurveillanceEvent[]} events - HAI events
 * @param {object} deviceDays - Device utilization data
 * @param {number} month - Report month (1-12)
 * @param {number} year - Report year
 * @returns {NHSNReport} NHSN report data
 *
 * @example
 * ```typescript
 * const report = prepareNHSNReport(
 *   haiEvents,
 *   { centralLineDays: 450, urinaryCatheterDays: 320, ventilatorDays: 180 },
 *   1,
 *   2024
 * );
 * ```
 */
export declare function prepareNHSNReport(events: InfectionSurveillanceEvent[], deviceDays: {
    centralLineDays?: number;
    urinaryCatheterDays?: number;
    ventilatorDays?: number;
    patientDays?: number;
}, month: number, year: number): NHSNReport;
/**
 * 35. Validates NHSN report data completeness.
 *
 * @param {NHSNReport} report - NHSN report
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateNHSNReport(report);
 * if (!validation.valid) {
 *   console.error('Report errors:', validation.errors);
 * }
 * ```
 */
export declare function validateNHSNReport(report: NHSNReport): {
    valid: boolean;
    errors: string[];
    warnings: string[];
};
/**
 * 36. Calculates infection rates for NHSN reporting.
 *
 * @param {number} events - Number of infection events
 * @param {number} deviceDays - Device days or patient days
 * @returns {number} Infection rate per 1000 device/patient days
 *
 * @example
 * ```typescript
 * const clabsiRate = calculateInfectionRate(5, 450);
 * // Result: 11.1 infections per 1000 central line days
 * ```
 */
export declare function calculateInfectionRate(events: number, deviceDays: number): number;
/**
 * 37. Generates infection control summary dashboard.
 *
 * @param {InfectionSurveillanceEvent[]} events - HAI events
 * @param {IsolationOrder[]} isolations - Active isolations
 * @param {HandHygieneComplianceReport} hhCompliance - Hand hygiene data
 * @returns {object} Dashboard metrics
 *
 * @example
 * ```typescript
 * const dashboard = generateInfectionControlDashboard(
 *   haiEvents,
 *   activeIsolations,
 *   handHygieneReport
 * );
 * ```
 */
export declare function generateInfectionControlDashboard(events: InfectionSurveillanceEvent[], isolations: IsolationOrder[], hhCompliance?: HandHygieneComplianceReport): {
    totalHAIs: number;
    haiByType: Record<string, number>;
    activeIsolations: number;
    isolationByType: Record<string, number>;
    handHygieneCompliance?: number;
    alerts: string[];
};
/**
 * 38. Creates infection prevention protocol.
 *
 * @param {Partial<InfectionPreventionProtocol>} protocol - Protocol details
 * @returns {InfectionPreventionProtocol} Complete protocol
 *
 * @example
 * ```typescript
 * const protocol = createInfectionPreventionProtocol({
 *   name: 'Central Line Bundle',
 *   category: 'device-management',
 *   version: '2.0',
 *   effectiveDate: new Date(),
 *   status: 'active',
 *   description: 'CLABSI prevention bundle',
 *   indication: 'All central line insertions and maintenance'
 * });
 * ```
 */
export declare function createInfectionPreventionProtocol(protocol: Partial<InfectionPreventionProtocol>): InfectionPreventionProtocol;
/**
 * 39. Validates protocol compliance checklist.
 *
 * @param {string} protocolId - Protocol ID
 * @param {object} checklist - Completed checklist
 * @returns {object} Compliance result
 *
 * @example
 * ```typescript
 * const compliance = validateProtocolCompliance('clabsi-bundle', {
 *   handHygiene: true,
 *   maximalBarrierPrecautions: true,
 *   chlorhexidineSkinPrep: true,
 *   optimalCatheterSite: true,
 *   dailyReviewNecessity: false
 * });
 * ```
 */
export declare function validateProtocolCompliance(protocolId: string, checklist: Record<string, boolean>): {
    compliant: boolean;
    completionRate: number;
    missedSteps: string[];
    criticalViolations: string[];
};
/**
 * 40. Generates infection prevention training materials.
 *
 * @param {InfectionPreventionProtocol} protocol - Protocol
 * @returns {string} Training content
 *
 * @example
 * ```typescript
 * const training = generateTrainingMaterials(clabsiProtocol);
 * await lmsService.publish(training);
 * ```
 */
export declare function generateTrainingMaterials(protocol: InfectionPreventionProtocol): string;
declare const _default: {
    recordInfectionEvent: typeof recordInfectionEvent;
    calculateDeviceUtilizationRatio: typeof calculateDeviceUtilizationRatio;
    calculateSIR: typeof calculateSIR;
    assessHAIRisk: typeof assessHAIRisk;
    detectInfectionTrend: typeof detectInfectionTrend;
    createIsolationOrder: typeof createIsolationOrder;
    validateIsolationCompliance: typeof validateIsolationCompliance;
    generateIsolationSignage: typeof generateIsolationSignage;
    discontinueIsolation: typeof discontinueIsolation;
    calculateIsolationDays: typeof calculateIsolationDays;
    detectOutbreak: typeof detectOutbreak;
    initiateContactTracing: typeof initiateContactTracing;
    generateOutbreakReport: typeof generateOutbreakReport;
    calculateAttackRate: typeof calculateAttackRate;
    requiresPublicHealthNotification: typeof requiresPublicHealthNotification;
    recordHandHygieneObservation: typeof recordHandHygieneObservation;
    calculateHandHygieneCompliance: typeof calculateHandHygieneCompliance;
    validateHandHygieneTechnique: typeof validateHandHygieneTechnique;
    generateHandHygieneDashboard: typeof generateHandHygieneDashboard;
    createHandHygieneActionPlan: typeof createHandHygieneActionPlan;
    trackAntibioticPrescription: typeof trackAntibioticPrescription;
    generateStewardshipAlert: typeof generateStewardshipAlert;
    calculateDaysOfTherapy: typeof calculateDaysOfTherapy;
    monitorAntibioticResistance: typeof monitorAntibioticResistance;
    generateStewardshipMetrics: typeof generateStewardshipMetrics;
    createCleaningTask: typeof createCleaningTask;
    verifyCleaningQuality: typeof verifyCleaningQuality;
    trackPPEUsage: typeof trackPPEUsage;
    monitorPPEInventory: typeof monitorPPEInventory;
    calculatePPEBurnRate: typeof calculatePPEBurnRate;
    recordCultureResult: typeof recordCultureResult;
    assessCriticalCulture: typeof assessCriticalCulture;
    generateCultureNotification: typeof generateCultureNotification;
    prepareNHSNReport: typeof prepareNHSNReport;
    validateNHSNReport: typeof validateNHSNReport;
    calculateInfectionRate: typeof calculateInfectionRate;
    generateInfectionControlDashboard: typeof generateInfectionControlDashboard;
    createInfectionPreventionProtocol: typeof createInfectionPreventionProtocol;
    validateProtocolCompliance: typeof validateProtocolCompliance;
    generateTrainingMaterials: typeof generateTrainingMaterials;
};
export default _default;
//# sourceMappingURL=health-infection-control-kit.d.ts.map