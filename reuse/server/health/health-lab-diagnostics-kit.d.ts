/**
 * LOC: HLABKIT001
 * File: /reuse/server/health/health-lab-diagnostics-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - TypeScript 5.x
 *   - HL7 v2.x libraries
 *   - FHIR R4 libraries
 *
 * DOWNSTREAM (imported by):
 *   - Lab order services
 *   - Diagnostic result services
 *   - Laboratory information systems (LIS)
 *   - Clinical decision support
 *   - Result reporting services
 */
/**
 * Lab order status enumeration
 */
export declare enum LabOrderStatus {
    DRAFT = "draft",
    ORDERED = "ordered",
    COLLECTED = "collected",
    IN_TRANSIT = "in_transit",
    RECEIVED = "received",
    IN_PROGRESS = "in_progress",
    PRELIMINARY = "preliminary",
    FINAL = "final",
    CORRECTED = "corrected",
    CANCELLED = "cancelled",
    ENTERED_IN_ERROR = "entered_in_error"
}
/**
 * Lab order priority levels
 */
export declare enum LabOrderPriority {
    ROUTINE = "routine",
    URGENT = "urgent",
    STAT = "stat",
    ASAP = "asap",
    TIMED = "timed"
}
/**
 * Specimen types
 */
export declare enum SpecimenType {
    BLOOD = "blood",
    SERUM = "serum",
    PLASMA = "plasma",
    URINE = "urine",
    STOOL = "stool",
    SPUTUM = "sputum",
    CSF = "csf",
    TISSUE = "tissue",
    SWAB = "swab",
    OTHER = "other"
}
/**
 * Result abnormal flags
 */
export declare enum AbnormalFlag {
    NORMAL = "N",
    HIGH = "H",
    LOW = "L",
    CRITICAL_HIGH = "HH",
    CRITICAL_LOW = "LL",
    ABNORMAL = "A"
}
/**
 * Lab order creation data
 */
export interface CreateLabOrderDto {
    patientId: string;
    orderingProviderId: string;
    tests: LabTestRequest[];
    priority: LabOrderPriority;
    clinicalInfo?: string;
    diagnosis?: string[];
    scheduledCollectionTime?: Date;
    collectionLocation?: string;
    orderingFacilityId: string;
    performingLabId?: string;
    icdCodes?: string[];
    requestedBy?: string;
    urgentContact?: string;
}
/**
 * Lab test request
 */
export interface LabTestRequest {
    testCode: string;
    testName: string;
    loincCode?: string;
    specimenType: SpecimenType;
    specimenSource?: string;
    fasting?: boolean;
    instructions?: string;
}
/**
 * Lab order data
 */
export interface LabOrder {
    orderId: string;
    accessionNumber: string;
    patientId: string;
    orderingProviderId: string;
    tests: LabTestRequest[];
    status: LabOrderStatus;
    priority: LabOrderPriority;
    orderDate: Date;
    collectionDate?: Date;
    receivedDate?: Date;
    completedDate?: Date;
    clinicalInfo?: string;
    diagnosis?: string[];
    icdCodes?: string[];
    specimens: SpecimenData[];
    results: LabResult[];
    orderingFacilityId: string;
    performingLabId?: string;
    metadata?: Record<string, any>;
}
/**
 * Specimen data
 */
export interface SpecimenData {
    specimenId: string;
    barcode: string;
    type: SpecimenType;
    source?: string;
    collectedDate?: Date;
    collectedBy?: string;
    collectionMethod?: string;
    containerType?: string;
    volume?: number;
    volumeUnit?: string;
    quality?: 'adequate' | 'suboptimal' | 'rejected';
    rejectionReason?: string;
    receivedDate?: Date;
    receivedBy?: string;
    chainOfCustody: ChainOfCustodyEntry[];
}
/**
 * Chain of custody entry
 */
export interface ChainOfCustodyEntry {
    timestamp: Date;
    action: 'collected' | 'transferred' | 'received' | 'stored' | 'discarded';
    performedBy: string;
    location?: string;
    temperature?: number;
    notes?: string;
}
/**
 * Lab result data
 */
export interface LabResult {
    resultId: string;
    testCode: string;
    testName: string;
    loincCode?: string;
    value: string | number;
    unit?: string;
    referenceRange?: string;
    abnormalFlag?: AbnormalFlag;
    status: 'preliminary' | 'final' | 'corrected' | 'cancelled';
    resultDate: Date;
    performedBy?: string;
    verifiedBy?: string;
    verifiedDate?: Date;
    notes?: string;
    interpretation?: string;
    isCritical?: boolean;
    criticaNotifiedAt?: Date;
    criticaNotifiedTo?: string;
    method?: string;
    instrument?: string;
}
/**
 * Lab test catalog entry
 */
export interface LabTestCatalog {
    testCode: string;
    testName: string;
    commonName?: string;
    loincCode?: string;
    category: string;
    specimenTypes: SpecimenType[];
    turnaroundTime: number;
    price?: number;
    requiresFasting?: boolean;
    requiresSpecialPrep?: boolean;
    prepInstructions?: string;
    referenceRanges: ReferenceRange[];
    criticalLowValue?: number;
    criticalHighValue?: number;
    methodology?: string;
    performingLab?: string;
    active: boolean;
    metadata?: Record<string, any>;
}
/**
 * Reference range definition
 */
export interface ReferenceRange {
    ageMin?: number;
    ageMax?: number;
    ageUnit?: 'years' | 'months' | 'days';
    sex?: 'M' | 'F' | 'U';
    lowValue?: number;
    highValue?: number;
    unit?: string;
    textRange?: string;
    condition?: string;
}
/**
 * HL7 ORU message (Observation Result)
 */
export interface HL7ORUMessage {
    messageType: 'ORU^R01';
    messageControlId: string;
    sendingApplication: string;
    sendingFacility: string;
    receivingApplication: string;
    receivingFacility: string;
    messageDateTime: Date;
    patient: HL7PatientInfo;
    visit?: HL7VisitInfo;
    orders: HL7OrderResult[];
    rawMessage?: string;
}
/**
 * HL7 patient info
 */
export interface HL7PatientInfo {
    patientId: string;
    alternatePatientId?: string;
    patientName: string;
    dateOfBirth?: Date;
    sex?: string;
    race?: string;
    address?: string;
    phoneNumber?: string;
}
/**
 * HL7 visit info
 */
export interface HL7VisitInfo {
    visitNumber?: string;
    patientClass?: string;
    location?: string;
    attendingDoctor?: string;
    admitDateTime?: Date;
}
/**
 * HL7 order result
 */
export interface HL7OrderResult {
    placerOrderNumber: string;
    fillerOrderNumber: string;
    universalServiceId: string;
    observations: HL7Observation[];
    orderStatus?: string;
    resultStatus?: 'P' | 'F' | 'C' | 'X';
    observationDateTime?: Date;
}
/**
 * HL7 observation
 */
export interface HL7Observation {
    setId: string;
    observationId: string;
    observationText: string;
    value: string;
    units?: string;
    referenceRange?: string;
    abnormalFlags?: string[];
    observationStatus: string;
    observationDateTime?: Date;
    producerId?: string;
    method?: string;
}
/**
 * Critical value alert configuration
 */
export interface CriticalValueAlert {
    resultId: string;
    patientId: string;
    testName: string;
    testCode: string;
    value: string | number;
    unit?: string;
    criticalThreshold: number | string;
    alertSeverity: 'critical' | 'panic';
    createdAt: Date;
    notificationAttempts: CriticalValueNotification[];
    acknowledged?: boolean;
    acknowledgedBy?: string;
    acknowledgedAt?: Date;
}
/**
 * Critical value notification attempt
 */
export interface CriticalValueNotification {
    attemptNumber: number;
    notifiedAt: Date;
    notifiedTo: string;
    method: 'phone' | 'page' | 'sms' | 'email' | 'system';
    success: boolean;
    responseReceived?: boolean;
    notes?: string;
}
/**
 * Lab result review workflow
 */
export interface LabResultReview {
    reviewId: string;
    resultId: string;
    orderId: string;
    patientId: string;
    reviewLevel: 'tech' | 'pathologist' | 'clinician';
    reviewedBy: string;
    reviewedAt: Date;
    action: 'approved' | 'rejected' | 'amended' | 'requires_consultation';
    comments?: string;
    nextReviewer?: string;
    status: 'pending' | 'completed';
}
/**
 * Microbiology culture data
 */
export interface MicrobiologyCulture {
    cultureId: string;
    specimenId: string;
    orderId: string;
    patientId: string;
    cultureType: string;
    inoculationDate: Date;
    preliminaryResults: CulturePreliminaryResult[];
    finalResults?: CultureFinalResult;
    growthDetected: boolean;
    daysToPositivity?: number;
    status: 'pending' | 'preliminary' | 'final';
    performedBy?: string;
}
/**
 * Culture preliminary result
 */
export interface CulturePreliminaryResult {
    reportedAt: Date;
    gramStain?: string;
    morphology?: string;
    growthDensity?: 'none' | 'rare' | 'few' | 'moderate' | 'heavy';
    preliminaryOrganism?: string;
    notes?: string;
}
/**
 * Culture final result
 */
export interface CultureFinalResult {
    reportedAt: Date;
    organisms: OrganismIdentification[];
    noGrowthDays?: number;
    finalNotes?: string;
    verifiedBy?: string;
}
/**
 * Organism identification
 */
export interface OrganismIdentification {
    organismName: string;
    organismCode?: string;
    quantity?: string;
    susceptibilities?: AntibioticSusceptibility[];
}
/**
 * Antibiotic susceptibility
 */
export interface AntibioticSusceptibility {
    antibiotic: string;
    result: 'S' | 'I' | 'R';
    mic?: number;
    method?: string;
}
/**
 * Pathology report
 */
export interface PathologyReport {
    reportId: string;
    accessionNumber: string;
    patientId: string;
    specimenId: string;
    reportType: 'surgical' | 'cytology' | 'autopsy' | 'frozen_section';
    grossDescription?: string;
    microscopicDescription?: string;
    diagnosis: string[];
    diagnosisCodes?: string[];
    snomedCodes?: string[];
    stagingInfo?: TumorStaging;
    additionalStudies?: AdditionalStudy[];
    reportDate: Date;
    pathologistId: string;
    pathologistName: string;
    status: 'preliminary' | 'final' | 'addendum';
    signedAt?: Date;
    additionalComments?: string;
}
/**
 * Tumor staging (TNM)
 */
export interface TumorStaging {
    tStage?: string;
    nStage?: string;
    mStage?: string;
    overallStage?: string;
    gradingSystem?: string;
    tumorGrade?: string;
}
/**
 * Additional pathology study
 */
export interface AdditionalStudy {
    studyType: 'immunohistochemistry' | 'flow_cytometry' | 'molecular' | 'special_stain';
    studyName: string;
    results: string;
    interpretation?: string;
    performedAt?: Date;
}
/**
 * Quality control measurement
 */
export interface QCMeasurement {
    qcId: string;
    instrumentId: string;
    testCode: string;
    qcLevel: 'L1' | 'L2' | 'L3';
    measurementDate: Date;
    measuredValue: number;
    expectedValue: number;
    expectedSD: number;
    unit?: string;
    inControl: boolean;
    violatedRules?: WestgardRule[];
    performedBy?: string;
    action?: string;
}
/**
 * Westgard quality control rules
 */
export type WestgardRule = '1-2s' | '1-3s' | '2-2s' | 'R-4s' | '4-1s' | '10-x';
/**
 * Lab requisition print data
 */
export interface LabRequisition {
    requisitionId: string;
    orderId: string;
    accessionNumber: string;
    barcodes: string[];
    patientInfo: {
        name: string;
        mrn: string;
        dob: Date;
        sex: string;
    };
    providerInfo: {
        name: string;
        npi?: string;
        phone?: string;
    };
    tests: {
        testName: string;
        testCode: string;
        specimenType: string;
        fasting?: boolean;
    }[];
    priority: LabOrderPriority;
    clinicalInfo?: string;
    diagnosis?: string[];
    collectionInstructions?: string;
    generatedAt: Date;
}
/**
 * Result trending data point
 */
export interface ResultTrendPoint {
    date: Date;
    value: number;
    unit: string;
    abnormalFlag?: AbnormalFlag;
    referenceRangeLow?: number;
    referenceRangeHigh?: number;
}
/**
 * Result trend analysis
 */
export interface ResultTrendAnalysis {
    testCode: string;
    testName: string;
    patientId: string;
    dataPoints: ResultTrendPoint[];
    trend: 'increasing' | 'decreasing' | 'stable' | 'fluctuating';
    averageValue: number;
    minValue: number;
    maxValue: number;
    standardDeviation: number;
    outOfRangeCount: number;
    criticalCount: number;
    dateRange: {
        start: Date;
        end: Date;
    };
}
/**
 * Lab interface message
 */
export interface LabInterfaceMessage {
    messageId: string;
    direction: 'inbound' | 'outbound';
    messageType: string;
    protocol: 'HL7' | 'FHIR' | 'ASTM';
    sendingSystem: string;
    receivingSystem: string;
    sentAt: Date;
    receivedAt?: Date;
    processedAt?: Date;
    status: 'pending' | 'sent' | 'received' | 'processed' | 'error';
    rawMessage: string;
    parsedData?: any;
    errorMessage?: string;
    retryCount?: number;
}
/**
 * 1. Creates a new lab order with comprehensive validation and tracking.
 *
 * @param {CreateLabOrderDto} orderData - Lab order creation data
 * @returns {LabOrder} Created lab order with accession number
 *
 * @example
 * ```typescript
 * const order = createLabOrder({
 *   patientId: 'PAT-12345',
 *   orderingProviderId: 'PROV-789',
 *   tests: [
 *     { testCode: 'CBC', testName: 'Complete Blood Count', specimenType: SpecimenType.BLOOD },
 *     { testCode: 'CMP', testName: 'Comprehensive Metabolic Panel', specimenType: SpecimenType.SERUM, fasting: true }
 *   ],
 *   priority: LabOrderPriority.ROUTINE,
 *   clinicalInfo: 'Annual physical exam',
 *   diagnosis: ['Z00.00'],
 *   orderingFacilityId: 'FAC-001'
 * });
 * ```
 */
export declare function createLabOrder(orderData: CreateLabOrderDto): LabOrder;
/**
 * 2. Generates a unique accession number for lab orders.
 *
 * @returns {string} Formatted accession number
 *
 * @example
 * ```typescript
 * const accessionNumber = generateAccessionNumber();
 * // Returns: 'ACC-20240115-001234'
 * ```
 */
export declare function generateAccessionNumber(): string;
/**
 * 3. Updates lab order status with validation and audit trail.
 *
 * @param {LabOrder} order - Lab order to update
 * @param {LabOrderStatus} newStatus - New status
 * @param {string} updatedBy - User performing the update
 * @returns {LabOrder} Updated lab order
 *
 * @example
 * ```typescript
 * const updated = updateLabOrderStatus(order, LabOrderStatus.COLLECTED, 'PHLEBOTOMIST-123');
 * ```
 */
export declare function updateLabOrderStatus(order: LabOrder, newStatus: LabOrderStatus, updatedBy: string): LabOrder;
/**
 * 4. Cancels a lab order with reason tracking.
 *
 * @param {LabOrder} order - Lab order to cancel
 * @param {string} reason - Cancellation reason
 * @param {string} cancelledBy - User cancelling the order
 * @returns {LabOrder} Cancelled lab order
 *
 * @example
 * ```typescript
 * const cancelled = cancelLabOrder(order, 'Patient refused procedure', 'NURSE-456');
 * ```
 */
export declare function cancelLabOrder(order: LabOrder, reason: string, cancelledBy: string): LabOrder;
/**
 * 5. Retrieves lab orders by patient with filtering and sorting.
 *
 * @param {string} patientId - Patient identifier
 * @param {Object} filters - Optional filters
 * @returns {LabOrder[]} Filtered lab orders
 *
 * @example
 * ```typescript
 * const orders = getLabOrdersByPatient('PAT-12345', {
 *   status: [LabOrderStatus.FINAL],
 *   dateFrom: new Date('2024-01-01'),
 *   dateTo: new Date('2024-12-31')
 * });
 * ```
 */
export declare function getLabOrdersByPatient(patientId: string, filters?: {
    status?: LabOrderStatus[];
    dateFrom?: Date;
    dateTo?: Date;
    testCode?: string;
}): LabOrder[];
/**
 * 6. Validates lab order for completeness and business rules.
 *
 * @param {CreateLabOrderDto} orderData - Order data to validate
 * @returns {Object} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateLabOrder(orderData);
 * if (!validation.valid) {
 *   console.error('Validation errors:', validation.errors);
 * }
 * ```
 */
export declare function validateLabOrder(orderData: CreateLabOrderDto): {
    valid: boolean;
    errors: string[];
    warnings: string[];
};
/**
 * 7. Adds a test to an existing lab order.
 *
 * @param {LabOrder} order - Existing lab order
 * @param {LabTestRequest} test - Test to add
 * @returns {LabOrder} Updated lab order
 *
 * @example
 * ```typescript
 * const updated = addTestToLabOrder(order, {
 *   testCode: 'TSH',
 *   testName: 'Thyroid Stimulating Hormone',
 *   specimenType: SpecimenType.SERUM
 * });
 * ```
 */
export declare function addTestToLabOrder(order: LabOrder, test: LabTestRequest): LabOrder;
/**
 * 8. Removes a test from an existing lab order.
 *
 * @param {LabOrder} order - Existing lab order
 * @param {string} testCode - Test code to remove
 * @returns {LabOrder} Updated lab order
 *
 * @example
 * ```typescript
 * const updated = removeTestFromLabOrder(order, 'CBC');
 * ```
 */
export declare function removeTestFromLabOrder(order: LabOrder, testCode: string): LabOrder;
/**
 * 9. Searches lab test catalog by multiple criteria.
 *
 * @param {Object} searchCriteria - Search parameters
 * @returns {LabTestCatalog[]} Matching tests
 *
 * @example
 * ```typescript
 * const tests = searchLabTestCatalog({
 *   category: 'Chemistry',
 *   specimenType: SpecimenType.SERUM,
 *   searchTerm: 'glucose'
 * });
 * ```
 */
export declare function searchLabTestCatalog(searchCriteria: {
    category?: string;
    specimenType?: SpecimenType;
    searchTerm?: string;
    active?: boolean;
}): LabTestCatalog[];
/**
 * 10. Retrieves detailed test information including reference ranges.
 *
 * @param {string} testCode - Test code
 * @returns {LabTestCatalog | null} Test details
 *
 * @example
 * ```typescript
 * const testInfo = getLabTestDetails('CBC');
 * if (testInfo) {
 *   console.log(`TAT: ${testInfo.turnaroundTime} minutes`);
 * }
 * ```
 */
export declare function getLabTestDetails(testCode: string): LabTestCatalog | null;
/**
 * 11. Retrieves applicable reference range for patient demographics.
 *
 * @param {string} testCode - Test code
 * @param {Object} demographics - Patient demographics
 * @returns {ReferenceRange | null} Applicable reference range
 *
 * @example
 * ```typescript
 * const range = getReferenceRangeForPatient('HGB', {
 *   age: 45,
 *   ageUnit: 'years',
 *   sex: 'M'
 * });
 * ```
 */
export declare function getReferenceRangeForPatient(testCode: string, demographics: {
    age: number;
    ageUnit: 'years' | 'months' | 'days';
    sex: 'M' | 'F' | 'U';
}): ReferenceRange | null;
/**
 * 12. Validates if a test requires special specimen handling.
 *
 * @param {string} testCode - Test code
 * @returns {Object} Special handling requirements
 *
 * @example
 * ```typescript
 * const handling = getSpecialHandlingRequirements('AMMONIA');
 * if (handling.requiresIce) {
 *   console.log('Keep specimen on ice');
 * }
 * ```
 */
export declare function getSpecialHandlingRequirements(testCode: string): {
    requiresIce: boolean;
    lightSensitive: boolean;
    timeLimit?: number;
    temperature?: string;
    specialInstructions?: string;
};
/**
 * 13. Retrieves test turnaround time by priority.
 *
 * @param {string} testCode - Test code
 * @param {LabOrderPriority} priority - Order priority
 * @returns {number} Estimated TAT in minutes
 *
 * @example
 * ```typescript
 * const statTAT = getTestTurnaroundTime('TROP', LabOrderPriority.STAT);
 * // Returns: 60 (1 hour for STAT troponin)
 * ```
 */
export declare function getTestTurnaroundTime(testCode: string, priority: LabOrderPriority): number;
/**
 * 14. Generates unique specimen barcode with check digit.
 *
 * @returns {string} Specimen barcode
 *
 * @example
 * ```typescript
 * const barcode = generateSpecimenBarcode();
 * // Returns: 'SPEC20240115001234567'
 * ```
 */
export declare function generateSpecimenBarcode(): string;
/**
 * 15. Records specimen collection with chain of custody.
 *
 * @param {string} specimenId - Specimen identifier
 * @param {Object} collectionData - Collection details
 * @returns {SpecimenData} Updated specimen
 *
 * @example
 * ```typescript
 * const specimen = recordSpecimenCollection('SPEC-123', {
 *   collectedBy: 'PHLEB-789',
 *   collectionMethod: 'venipuncture',
 *   location: 'Main Lab',
 *   volume: 10,
 *   volumeUnit: 'mL'
 * });
 * ```
 */
export declare function recordSpecimenCollection(specimenId: string, collectionData: {
    collectedBy: string;
    collectionMethod?: string;
    location?: string;
    volume?: number;
    volumeUnit?: string;
    containerType?: string;
}): SpecimenData;
/**
 * 16. Updates specimen chain of custody with new entry.
 *
 * @param {SpecimenData} specimen - Specimen to update
 * @param {ChainOfCustodyEntry} entry - New custody entry
 * @returns {SpecimenData} Updated specimen
 *
 * @example
 * ```typescript
 * const updated = updateChainOfCustody(specimen, {
 *   timestamp: new Date(),
 *   action: 'transferred',
 *   performedBy: 'COURIER-456',
 *   location: 'Reference Lab',
 *   temperature: 4
 * });
 * ```
 */
export declare function updateChainOfCustody(specimen: SpecimenData, entry: ChainOfCustodyEntry): SpecimenData;
/**
 * 17. Validates specimen quality and acceptance criteria.
 *
 * @param {SpecimenData} specimen - Specimen to validate
 * @param {string} testCode - Test being performed
 * @returns {Object} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateSpecimenQuality(specimen, 'CBC');
 * if (!validation.acceptable) {
 *   console.log('Rejection reason:', validation.rejectionReason);
 * }
 * ```
 */
export declare function validateSpecimenQuality(specimen: SpecimenData, testCode: string): {
    acceptable: boolean;
    rejectionReason?: string;
    warnings?: string[];
};
/**
 * 18. Tracks specimen location and storage conditions.
 *
 * @param {string} specimenId - Specimen identifier
 * @param {string} location - Current location
 * @param {Object} conditions - Storage conditions
 * @returns {Object} Location tracking record
 *
 * @example
 * ```typescript
 * const tracking = trackSpecimenLocation('SPEC-123', 'Refrigerator-2A', {
 *   temperature: 4,
 *   temperatureUnit: 'C',
 *   humidity: 50
 * });
 * ```
 */
export declare function trackSpecimenLocation(specimenId: string, location: string, conditions?: {
    temperature?: number;
    temperatureUnit?: 'C' | 'F';
    humidity?: number;
}): {
    specimenId: string;
    location: string;
    timestamp: Date;
    conditions?: any;
};
/**
 * 19. Parses HL7 ORU^R01 message into structured format.
 *
 * @param {string} rawMessage - Raw HL7 message
 * @returns {HL7ORUMessage} Parsed message
 *
 * @example
 * ```typescript
 * const message = parseHL7ORUMessage(rawHL7);
 * console.log(`Received ${message.orders.length} orders`);
 * ```
 */
export declare function parseHL7ORUMessage(rawMessage: string): HL7ORUMessage;
/**
 * 20. Validates HL7 ORU message structure and content.
 *
 * @param {HL7ORUMessage} message - Parsed HL7 message
 * @returns {Object} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateHL7ORUMessage(message);
 * if (!validation.valid) {
 *   console.error('HL7 errors:', validation.errors);
 * }
 * ```
 */
export declare function validateHL7ORUMessage(message: HL7ORUMessage): {
    valid: boolean;
    errors: string[];
    warnings: string[];
};
/**
 * 21. Maps HL7 observations to lab results.
 *
 * @param {HL7OrderResult} orderResult - HL7 order result
 * @returns {LabResult[]} Mapped lab results
 *
 * @example
 * ```typescript
 * const results = mapHL7ObservationsToResults(orderResult);
 * ```
 */
export declare function mapHL7ObservationsToResults(orderResult: HL7OrderResult): LabResult[];
/**
 * 22. Processes received HL7 result message end-to-end.
 *
 * @param {string} rawMessage - Raw HL7 message
 * @returns {Object} Processing result
 *
 * @example
 * ```typescript
 * const result = processHL7ResultMessage(rawHL7);
 * if (result.success) {
 *   console.log(`Processed ${result.resultsCount} results`);
 * }
 * ```
 */
export declare function processHL7ResultMessage(rawMessage: string): {
    success: boolean;
    messageId: string;
    ordersProcessed: number;
    resultsCount: number;
    criticalResults: number;
    errors?: string[];
};
/**
 * 23. Generates HL7 acknowledgment (ACK) message.
 *
 * @param {HL7ORUMessage} originalMessage - Original HL7 message
 * @param {boolean} success - Acknowledgment status
 * @param {string} errorMessage - Error message if failed
 * @returns {string} HL7 ACK message
 *
 * @example
 * ```typescript
 * const ack = generateHL7Acknowledgment(message, true);
 * ```
 */
export declare function generateHL7Acknowledgment(originalMessage: HL7ORUMessage, success: boolean, errorMessage?: string): string;
/**
 * 24. Interprets lab result and determines abnormal flags.
 *
 * @param {number} value - Result value
 * @param {ReferenceRange} referenceRange - Applicable reference range
 * @returns {AbnormalFlag} Abnormal flag
 *
 * @example
 * ```typescript
 * const flag = interpretLabResult(180, {
 *   lowValue: 70,
 *   highValue: 100,
 *   unit: 'mg/dL'
 * });
 * // Returns: AbnormalFlag.HIGH
 * ```
 */
export declare function interpretLabResult(value: number, referenceRange: ReferenceRange): AbnormalFlag;
/**
 * 25. Determines if result is critical and requires immediate notification.
 *
 * @param {LabResult} result - Lab result
 * @param {LabTestCatalog} testInfo - Test information
 * @returns {boolean} Whether result is critical
 *
 * @example
 * ```typescript
 * const isCritical = isCriticalResult(result, testInfo);
 * if (isCritical) {
 *   // Trigger critical value alert
 * }
 * ```
 */
export declare function isCriticalResult(result: LabResult, testInfo: LabTestCatalog): boolean;
/**
 * 26. Generates automated result interpretation text.
 *
 * @param {LabResult} result - Lab result
 * @param {ReferenceRange} referenceRange - Reference range
 * @returns {string} Interpretation text
 *
 * @example
 * ```typescript
 * const interpretation = generateResultInterpretation(result, range);
 * // Returns: "Glucose elevated at 180 mg/dL (normal: 70-100 mg/dL). Consistent with hyperglycemia."
 * ```
 */
export declare function generateResultInterpretation(result: LabResult, referenceRange: ReferenceRange): string;
/**
 * 27. Detects delta check violations (significant changes from previous results).
 *
 * @param {LabResult} currentResult - Current result
 * @param {LabResult} previousResult - Previous result
 * @returns {Object} Delta check result
 *
 * @example
 * ```typescript
 * const deltaCheck = detectDeltaCheckViolation(currentResult, previousResult);
 * if (deltaCheck.violation) {
 *   console.log(`Alert: ${deltaCheck.percentChange}% change detected`);
 * }
 * ```
 */
export declare function detectDeltaCheckViolation(currentResult: LabResult, previousResult: LabResult): {
    violation: boolean;
    percentChange?: number;
    absoluteChange?: number;
    message?: string;
};
/**
 * 28. Auto-verifies results based on defined rules (non-critical, in-range).
 *
 * @param {LabResult} result - Lab result to verify
 * @param {LabTestCatalog} testInfo - Test information
 * @returns {Object} Auto-verification result
 *
 * @example
 * ```typescript
 * const autoVerify = canAutoVerifyResult(result, testInfo);
 * if (autoVerify.canAutoVerify) {
 *   result.verifiedBy = 'AUTO-VERIFY';
 *   result.verifiedDate = new Date();
 * }
 * ```
 */
export declare function canAutoVerifyResult(result: LabResult, testInfo: LabTestCatalog): {
    canAutoVerify: boolean;
    reason?: string;
};
/**
 * 29. Creates critical value alert with escalation tracking.
 *
 * @param {LabResult} result - Critical lab result
 * @param {string} patientId - Patient identifier
 * @returns {CriticalValueAlert} Critical value alert
 *
 * @example
 * ```typescript
 * const alert = createCriticalValueAlert(criticalResult, 'PAT-12345');
 * ```
 */
export declare function createCriticalValueAlert(result: LabResult, patientId: string): CriticalValueAlert;
/**
 * 30. Records critical value notification attempt.
 *
 * @param {CriticalValueAlert} alert - Critical value alert
 * @param {Object} notificationData - Notification details
 * @returns {CriticalValueAlert} Updated alert
 *
 * @example
 * ```typescript
 * const updated = recordCriticalValueNotification(alert, {
 *   notifiedTo: 'DR-SMITH',
 *   method: 'phone',
 *   success: true,
 *   responseReceived: true,
 *   notes: 'Provider acknowledged and will see patient'
 * });
 * ```
 */
export declare function recordCriticalValueNotification(alert: CriticalValueAlert, notificationData: {
    notifiedTo: string;
    method: 'phone' | 'page' | 'sms' | 'email' | 'system';
    success: boolean;
    responseReceived?: boolean;
    notes?: string;
}): CriticalValueAlert;
/**
 * 31. Acknowledges critical value alert.
 *
 * @param {CriticalValueAlert} alert - Critical value alert
 * @param {string} acknowledgedBy - User acknowledging
 * @returns {CriticalValueAlert} Acknowledged alert
 *
 * @example
 * ```typescript
 * const acknowledged = acknowledgeCriticalValueAlert(alert, 'DR-JONES');
 * ```
 */
export declare function acknowledgeCriticalValueAlert(alert: CriticalValueAlert, acknowledgedBy: string): CriticalValueAlert;
/**
 * 32. Determines if critical value alert requires escalation.
 *
 * @param {CriticalValueAlert} alert - Critical value alert
 * @param {number} maxAttempts - Maximum notification attempts before escalation
 * @returns {Object} Escalation determination
 *
 * @example
 * ```typescript
 * const escalation = shouldEscalateCriticalAlert(alert, 3);
 * if (escalation.shouldEscalate) {
 *   // Notify supervisor or medical director
 * }
 * ```
 */
export declare function shouldEscalateCriticalAlert(alert: CriticalValueAlert, maxAttempts?: number): {
    shouldEscalate: boolean;
    reason?: string;
    minutesSinceCreation: number;
};
/**
 * 33. Creates lab result review workflow entry.
 *
 * @param {LabResult} result - Lab result to review
 * @param {string} orderId - Order identifier
 * @param {Object} reviewData - Review details
 * @returns {LabResultReview} Review workflow entry
 *
 * @example
 * ```typescript
 * const review = createResultReviewWorkflow(result, 'ORD-123', {
 *   reviewLevel: 'pathologist',
 *   reviewedBy: 'PATH-456',
 *   action: 'approved'
 * });
 * ```
 */
export declare function createResultReviewWorkflow(result: LabResult, orderId: string, reviewData: {
    reviewLevel: 'tech' | 'pathologist' | 'clinician';
    reviewedBy: string;
    action: 'approved' | 'rejected' | 'amended' | 'requires_consultation';
    comments?: string;
    nextReviewer?: string;
}): LabResultReview;
/**
 * 34. Routes result to appropriate reviewer based on complexity.
 *
 * @param {LabResult} result - Lab result
 * @param {LabTestCatalog} testInfo - Test information
 * @returns {Object} Routing decision
 *
 * @example
 * ```typescript
 * const routing = routeResultForReview(result, testInfo);
 * // Returns: { reviewLevel: 'pathologist', reason: 'Critical result requires pathologist review' }
 * ```
 */
export declare function routeResultForReview(result: LabResult, testInfo: LabTestCatalog): {
    reviewLevel: 'tech' | 'pathologist' | 'clinician';
    reason: string;
    urgent: boolean;
};
/**
 * 35. Validates result review completeness for release.
 *
 * @param {LabResult} result - Lab result
 * @param {LabResultReview[]} reviews - Review history
 * @returns {Object} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateResultReviewCompleteness(result, reviews);
 * if (validation.canRelease) {
 *   // Release result to provider
 * }
 * ```
 */
export declare function validateResultReviewCompleteness(result: LabResult, reviews: LabResultReview[]): {
    canRelease: boolean;
    missingReviews?: string[];
    pendingReviews?: string[];
};
/**
 * 36. Creates microbiology culture tracking record.
 *
 * @param {string} specimenId - Specimen identifier
 * @param {string} orderId - Order identifier
 * @param {Object} cultureData - Culture details
 * @returns {MicrobiologyCulture} Culture tracking record
 *
 * @example
 * ```typescript
 * const culture = createMicrobiologyCulture('SPEC-789', 'ORD-456', {
 *   patientId: 'PAT-123',
 *   cultureType: 'Blood Culture',
 *   performedBy: 'MICRO-TECH-789'
 * });
 * ```
 */
export declare function createMicrobiologyCulture(specimenId: string, orderId: string, cultureData: {
    patientId: string;
    cultureType: string;
    performedBy?: string;
}): MicrobiologyCulture;
/**
 * 37. Records preliminary culture result (gram stain, preliminary growth).
 *
 * @param {MicrobiologyCulture} culture - Culture record
 * @param {CulturePreliminaryResult} prelimResult - Preliminary findings
 * @returns {MicrobiologyCulture} Updated culture
 *
 * @example
 * ```typescript
 * const updated = recordPreliminaryCultureResult(culture, {
 *   reportedAt: new Date(),
 *   gramStain: 'Gram positive cocci in clusters',
 *   growthDensity: 'moderate',
 *   preliminaryOrganism: 'Staphylococcus species',
 *   notes: 'Awaiting final identification and susceptibilities'
 * });
 * ```
 */
export declare function recordPreliminaryCultureResult(culture: MicrobiologyCulture, prelimResult: CulturePreliminaryResult): MicrobiologyCulture;
/**
 * 38. Records final culture result with organism identification and susceptibilities.
 *
 * @param {MicrobiologyCulture} culture - Culture record
 * @param {CultureFinalResult} finalResult - Final findings
 * @returns {MicrobiologyCulture} Completed culture
 *
 * @example
 * ```typescript
 * const final = recordFinalCultureResult(culture, {
 *   reportedAt: new Date(),
 *   organisms: [{
 *     organismName: 'Staphylococcus aureus',
 *     quantity: 'moderate',
 *     susceptibilities: [
 *       { antibiotic: 'Oxacillin', result: 'R', mic: 8 },
 *       { antibiotic: 'Vancomycin', result: 'S', mic: 1 }
 *     ]
 *   }],
 *   finalNotes: 'MRSA isolated. Contact precautions recommended.',
 *   verifiedBy: 'MICRO-PATH-123'
 * });
 * ```
 */
export declare function recordFinalCultureResult(culture: MicrobiologyCulture, finalResult: CultureFinalResult): MicrobiologyCulture;
/**
 * 39. Creates comprehensive pathology report.
 *
 * @param {Object} reportData - Pathology report data
 * @returns {PathologyReport} Pathology report
 *
 * @example
 * ```typescript
 * const report = createPathologyReport({
 *   patientId: 'PAT-123',
 *   specimenId: 'SPEC-456',
 *   reportType: 'surgical',
 *   grossDescription: 'Skin ellipse measuring 2.5 x 1.2 x 0.4 cm',
 *   microscopicDescription: 'Sections show melanocytic proliferation...',
 *   diagnosis: ['Malignant melanoma', 'Clark level IV', 'Breslow depth 2.1 mm'],
 *   pathologistId: 'PATH-789',
 *   pathologistName: 'Dr. Sarah Johnson'
 * });
 * ```
 */
export declare function createPathologyReport(reportData: {
    patientId: string;
    specimenId: string;
    reportType: 'surgical' | 'cytology' | 'autopsy' | 'frozen_section';
    grossDescription?: string;
    microscopicDescription?: string;
    diagnosis: string[];
    diagnosisCodes?: string[];
    snomedCodes?: string[];
    stagingInfo?: TumorStaging;
    additionalStudies?: AdditionalStudy[];
    pathologistId: string;
    pathologistName: string;
    additionalComments?: string;
}): PathologyReport;
/**
 * 40. Signs and finalizes pathology report.
 *
 * @param {PathologyReport} report - Pathology report
 * @param {string} pathologistId - Signing pathologist
 * @returns {PathologyReport} Signed report
 *
 * @example
 * ```typescript
 * const signed = signPathologyReport(report, 'PATH-789');
 * ```
 */
export declare function signPathologyReport(report: PathologyReport, pathologistId: string): PathologyReport;
/**
 * 41. Records quality control measurement with Westgard rule evaluation.
 *
 * @param {Object} qcData - QC measurement data
 * @returns {QCMeasurement} QC measurement record
 *
 * @example
 * ```typescript
 * const qc = recordQCMeasurement({
 *   instrumentId: 'CHEM-ANALYZER-01',
 *   testCode: 'GLUC',
 *   qcLevel: 'L2',
 *   measuredValue: 105,
 *   expectedValue: 100,
 *   expectedSD: 3,
 *   unit: 'mg/dL',
 *   performedBy: 'TECH-123'
 * });
 * ```
 */
export declare function recordQCMeasurement(qcData: {
    instrumentId: string;
    testCode: string;
    qcLevel: 'L1' | 'L2' | 'L3';
    measuredValue: number;
    expectedValue: number;
    expectedSD: number;
    unit?: string;
    performedBy?: string;
}): QCMeasurement;
/**
 * 42. Evaluates Westgard quality control rules.
 *
 * @param {number} value - Measured value
 * @param {number} mean - Expected mean
 * @param {number} sd - Standard deviation
 * @param {number[]} previousValues - Previous QC values
 * @returns {WestgardRule[]} Violated rules
 *
 * @example
 * ```typescript
 * const violations = evaluateWestgardRules(110, 100, 3, [99, 101, 102, 98]);
 * // Returns: ['1-3s'] if value is beyond 3 SD
 * ```
 */
export declare function evaluateWestgardRules(value: number, mean: number, sd: number, previousValues: number[]): WestgardRule[];
/**
 * 43. Generates lab requisition for printing with barcodes.
 *
 * @param {LabOrder} order - Lab order
 * @returns {LabRequisition} Printable requisition
 *
 * @example
 * ```typescript
 * const requisition = generateLabRequisition(order);
 * // Send to printer or generate PDF
 * ```
 */
export declare function generateLabRequisition(order: LabOrder): LabRequisition;
/**
 * 44. Creates result trending analysis for clinical decision support.
 *
 * @param {string} patientId - Patient identifier
 * @param {string} testCode - Test code
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {ResultTrendAnalysis} Trend analysis
 *
 * @example
 * ```typescript
 * const trends = analyzeResultTrends('PAT-123', 'HBA1C',
 *   new Date('2024-01-01'), new Date('2024-12-31'));
 * console.log(`Trend: ${trends.trend}, Avg: ${trends.averageValue}`);
 * ```
 */
export declare function analyzeResultTrends(patientId: string, testCode: string, startDate: Date, endDate: Date): ResultTrendAnalysis;
/**
 * 45. Validates lab interface message for processing.
 *
 * @param {LabInterfaceMessage} message - Interface message
 * @returns {Object} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateLabInterfaceMessage(message);
 * if (validation.valid) {
 *   // Process message
 * }
 * ```
 */
export declare function validateLabInterfaceMessage(message: LabInterfaceMessage): {
    valid: boolean;
    errors: string[];
};
/**
 * 46. Logs lab interface message for audit and troubleshooting.
 *
 * @param {LabInterfaceMessage} message - Interface message
 * @returns {string} Log entry ID
 *
 * @example
 * ```typescript
 * const logId = logLabInterfaceMessage(message);
 * ```
 */
export declare function logLabInterfaceMessage(message: LabInterfaceMessage): string;
//# sourceMappingURL=health-lab-diagnostics-kit.d.ts.map