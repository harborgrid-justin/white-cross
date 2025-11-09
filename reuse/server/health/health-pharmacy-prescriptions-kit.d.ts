/**
 * LOC: HPHARMKIT001
 * File: /reuse/server/health/health-pharmacy-prescriptions-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - TypeScript 5.x
 *   - NCPDP SCRIPT libraries
 *   - FHIR R4 libraries
 *
 * DOWNSTREAM (imported by):
 *   - E-prescribing services
 *   - Medication services
 *   - Pharmacy integration services
 *   - Clinical decision support
 *   - Controlled substance monitoring
 */
/**
 * Prescription status enumeration
 */
export declare enum PrescriptionStatus {
    DRAFT = "draft",
    ACTIVE = "active",
    SUSPENDED = "suspended",
    COMPLETED = "completed",
    CANCELLED = "cancelled",
    ENTERED_IN_ERROR = "entered_in_error",
    STOPPED = "stopped"
}
/**
 * Prescription priority
 */
export declare enum PrescriptionPriority {
    ROUTINE = "routine",
    URGENT = "urgent",
    STAT = "stat"
}
/**
 * Drug form enumeration
 */
export declare enum DrugForm {
    TABLET = "tablet",
    CAPSULE = "capsule",
    LIQUID = "liquid",
    INJECTION = "injection",
    TOPICAL = "topical",
    INHALER = "inhaler",
    PATCH = "patch",
    SUPPOSITORY = "suppository",
    CREAM = "cream",
    OINTMENT = "ointment"
}
/**
 * Route of administration
 */
export declare enum RouteOfAdministration {
    ORAL = "oral",
    IV = "intravenous",
    IM = "intramuscular",
    SC = "subcutaneous",
    TOPICAL = "topical",
    RECTAL = "rectal",
    INHALED = "inhaled",
    SUBLINGUAL = "sublingual",
    TRANSDERMAL = "transdermal",
    OPHTHALMIC = "ophthalmic",
    OTIC = "otic",
    NASAL = "nasal"
}
/**
 * DEA schedule for controlled substances
 */
export declare enum DEASchedule {
    SCHEDULE_I = "I",
    SCHEDULE_II = "II",
    SCHEDULE_III = "III",
    SCHEDULE_IV = "IV",
    SCHEDULE_V = "V",
    NON_CONTROLLED = "NC"
}
/**
 * Drug interaction severity
 */
export declare enum InteractionSeverity {
    CONTRAINDICATED = "contraindicated",
    MAJOR = "major",
    MODERATE = "moderate",
    MINOR = "minor",
    UNKNOWN = "unknown"
}
/**
 * Prescription creation data
 */
export interface CreatePrescriptionDto {
    patientId: string;
    prescriberId: string;
    medicationId: string;
    medicationName: string;
    dosage: string;
    route: RouteOfAdministration;
    frequency: string;
    quantity: number;
    quantityUnit: string;
    refills: number;
    daysSupply: number;
    instructions: string;
    indication?: string;
    priority?: PrescriptionPriority;
    substituteAllowed?: boolean;
    pharmacyId?: string;
    startDate?: Date;
    endDate?: Date;
}
/**
 * Prescription data
 */
export interface Prescription {
    prescriptionId: string;
    rxNumber: string;
    patientId: string;
    prescriberId: string;
    prescriberName?: string;
    medicationId: string;
    medicationName: string;
    genericName?: string;
    ndcCode?: string;
    dosage: string;
    strength?: string;
    form: DrugForm;
    route: RouteOfAdministration;
    frequency: string;
    quantity: number;
    quantityUnit: string;
    refills: number;
    refillsRemaining: number;
    daysSupply: number;
    instructions: string;
    indication?: string;
    status: PrescriptionStatus;
    priority: PrescriptionPriority;
    substituteAllowed: boolean;
    prescribedDate: Date;
    startDate?: Date;
    endDate?: Date;
    lastFilledDate?: Date;
    pharmacyId?: string;
    deaSchedule?: DEASchedule;
    isPRN?: boolean;
    metadata?: Record<string, any>;
}
/**
 * Medication information
 */
export interface MedicationInfo {
    medicationId: string;
    brandName: string;
    genericName: string;
    ndcCode: string;
    rxcui?: string;
    strength: string;
    form: DrugForm;
    route: RouteOfAdministration[];
    deaSchedule: DEASchedule;
    manufacturer?: string;
    activeIngredients: string[];
    warnings?: string[];
    contraindications?: string[];
    blackBoxWarning?: string;
}
/**
 * Drug interaction
 */
export interface DrugInteraction {
    drugA: string;
    drugB: string;
    severity: InteractionSeverity;
    description: string;
    clinicalEffects?: string;
    management?: string;
    references?: string[];
}
/**
 * Drug allergy
 */
export interface DrugAllergy {
    allergyId: string;
    patientId: string;
    allergen: string;
    allergenType: 'medication' | 'food' | 'environmental';
    reaction: string;
    severity: 'mild' | 'moderate' | 'severe' | 'life-threatening';
    onsetDate?: Date;
    verifiedBy?: string;
    verifiedDate?: Date;
    status: 'active' | 'inactive' | 'resolved';
    notes?: string;
}
/**
 * Allergy cross-sensitivity
 */
export interface AllergyCrossSensitivity {
    allergen: string;
    crossSensitiveMedications: string[];
    likelihood: 'high' | 'moderate' | 'low';
    description: string;
}
/**
 * Formulary entry
 */
export interface FormularyEntry {
    medicationId: string;
    medicationName: string;
    genericName: string;
    ndcCode: string;
    tier: number;
    preferred: boolean;
    requiresPriorAuth: boolean;
    quantityLimit?: number;
    quantityLimitPeriod?: string;
    stepTherapyRequired?: boolean;
    alternatives?: FormularyAlternative[];
    copay?: number;
    coinsurance?: number;
    restrictions?: string[];
}
/**
 * Formulary alternative
 */
export interface FormularyAlternative {
    medicationId: string;
    medicationName: string;
    genericName: string;
    tier: number;
    costSavings?: number;
    reason: string;
}
/**
 * Prior authorization request
 */
export interface PriorAuthorizationRequest {
    paRequestId: string;
    prescriptionId: string;
    patientId: string;
    medicationId: string;
    medicationName: string;
    requestedQuantity: number;
    requestedDaysSupply: number;
    diagnosis: string[];
    icdCodes: string[];
    clinicalJustification: string;
    triedAndFailed?: string[];
    contraindicationsToAlternatives?: string[];
    supportingDocuments?: string[];
    requestedBy: string;
    requestedDate: Date;
    status: 'pending' | 'approved' | 'denied' | 'more_info_needed';
    reviewedBy?: string;
    reviewedDate?: Date;
    approvalNumber?: string;
    denialReason?: string;
    validUntil?: Date;
}
/**
 * Prescription renewal request
 */
export interface PrescriptionRenewalRequest {
    renewalRequestId: string;
    prescriptionId: string;
    rxNumber: string;
    patientId: string;
    medicationName: string;
    requestedBy: 'patient' | 'pharmacy' | 'provider';
    requestedDate: Date;
    requestedRefills: number;
    pharmacyId?: string;
    pharmacyName?: string;
    pharmacyPhone?: string;
    status: 'pending' | 'approved' | 'denied' | 'requires_appointment';
    reviewedBy?: string;
    reviewedDate?: Date;
    denialReason?: string;
    notes?: string;
}
/**
 * PDMP (Prescription Drug Monitoring Program) query
 */
export interface PDMPQuery {
    queryId: string;
    patientId: string;
    patientName: string;
    dateOfBirth: Date;
    state: string;
    queryDate: Date;
    queriedBy: string;
    purpose: 'prescribing' | 'dispensing' | 'review';
    results?: PDMPResult[];
}
/**
 * PDMP result
 */
export interface PDMPResult {
    prescriptionId: string;
    medicationName: string;
    deaSchedule: DEASchedule;
    prescribedDate: Date;
    filledDate: Date;
    quantity: number;
    daysSupply: number;
    prescriberName: string;
    prescriberDEA?: string;
    pharmacyName: string;
    pharmacyDEA?: string;
}
/**
 * Medication reconciliation
 */
export interface MedicationReconciliation {
    reconciliationId: string;
    patientId: string;
    reconciliationType: 'admission' | 'transfer' | 'discharge';
    reconciliationDate: Date;
    performedBy: string;
    homeMedications: ReconciliationMedication[];
    facilityMedications: ReconciliationMedication[];
    discrepancies: MedicationDiscrepancy[];
    resolved: boolean;
    resolvedBy?: string;
    resolvedDate?: Date;
    notes?: string;
}
/**
 * Reconciliation medication
 */
export interface ReconciliationMedication {
    medicationName: string;
    dosage: string;
    route: RouteOfAdministration;
    frequency: string;
    lastTaken?: Date;
    source: 'patient_reported' | 'pharmacy_records' | 'provider_list' | 'ehr';
    verified: boolean;
}
/**
 * Medication discrepancy
 */
export interface MedicationDiscrepancy {
    discrepancyType: 'omission' | 'commission' | 'dose_change' | 'frequency_change' | 'route_change';
    medication: string;
    homeDose?: string;
    facilityDose?: string;
    clinicalSignificance: 'high' | 'medium' | 'low';
    action: 'continue' | 'discontinue' | 'modify' | 'investigate';
    reason?: string;
}
/**
 * Medication administration record (MAR)
 */
export interface MedicationAdministrationRecord {
    marId: string;
    patientId: string;
    prescriptionId: string;
    medicationName: string;
    scheduledTime: Date;
    administeredTime?: Date;
    dosageAdministered?: string;
    route: RouteOfAdministration;
    administeredBy?: string;
    status: 'scheduled' | 'administered' | 'missed' | 'refused' | 'held' | 'not_available';
    refusalReason?: string;
    holdReason?: string;
    barcodeScanned?: boolean;
    witnessedBy?: string;
    site?: string;
    notes?: string;
}
/**
 * IV fluid order
 */
export interface IVFluidOrder {
    ivOrderId: string;
    patientId: string;
    prescriberId: string;
    fluidType: string;
    additives?: IVAdditive[];
    totalVolume: number;
    volumeUnit: 'mL' | 'L';
    rate: number;
    rateUnit: 'mL/hr' | 'mL/min' | 'drops/min';
    route: 'peripheral_iv' | 'central_line' | 'picc';
    duration?: number;
    startTime?: Date;
    expectedEndTime?: Date;
    status: 'active' | 'completed' | 'stopped' | 'paused';
    indications?: string;
    specialInstructions?: string;
}
/**
 * IV additive
 */
export interface IVAdditive {
    medicationName: string;
    dose: number;
    doseUnit: string;
    concentration?: string;
}
/**
 * Medication barcode verification
 */
export interface MedicationBarcodeVerification {
    verificationId: string;
    patientBarcode: string;
    medicationBarcode: string;
    ndcCode: string;
    lotNumber?: string;
    expirationDate?: Date;
    verifiedAt: Date;
    verifiedBy: string;
    matches: boolean;
    errors?: string[];
    warnings?: string[];
}
/**
 * Pharmacy inventory item
 */
export interface PharmacyInventoryItem {
    inventoryId: string;
    medicationId: string;
    medicationName: string;
    ndcCode: string;
    lotNumber: string;
    expirationDate: Date;
    quantityOnHand: number;
    quantityUnit: string;
    location: string;
    reorderLevel: number;
    reorderQuantity: number;
    cost?: number;
    lastRestocked?: Date;
    deaSchedule?: DEASchedule;
}
/**
 * Compounding instructions
 */
export interface CompoundingInstructions {
    compoundId: string;
    formulaName: string;
    ingredients: CompoundIngredient[];
    finalVolume?: number;
    finalVolumeUnit?: string;
    preparationMethod: string;
    equipment?: string[];
    stability?: string;
    storage?: string;
    beyondUseDate?: Date;
    preparedBy?: string;
    verifiedBy?: string;
    specialInstructions?: string;
}
/**
 * Compound ingredient
 */
export interface CompoundIngredient {
    ingredientName: string;
    quantity: number;
    quantityUnit: string;
    form?: string;
    source?: string;
    lotNumber?: string;
}
/**
 * NCPDP SCRIPT message
 */
export interface NCPDPScriptMessage {
    messageId: string;
    messageType: 'NewRx' | 'RefillRequest' | 'RxChangeRequest' | 'CancelRx' | 'Status';
    version: string;
    sender: NCPDPParticipant;
    receiver: NCPDPParticipant;
    patient: NCPDPPatient;
    prescription?: NCPDPPrescription;
    sentAt: Date;
    rawMessage?: string;
}
/**
 * NCPDP participant
 */
export interface NCPDPParticipant {
    npi?: string;
    ncpdpId?: string;
    name: string;
    address?: string;
    phone?: string;
    fax?: string;
}
/**
 * NCPDP patient
 */
export interface NCPDPPatient {
    patientId: string;
    name: {
        first: string;
        last: string;
        middle?: string;
    };
    dateOfBirth: Date;
    sex: 'M' | 'F' | 'U';
    address?: string;
    phone?: string;
}
/**
 * NCPDP prescription
 */
export interface NCPDPPrescription {
    rxNumber: string;
    medicationName: string;
    strength: string;
    form: string;
    quantity: number;
    quantityUnit: string;
    daysSupply: number;
    refills: number;
    substitutionsAllowed: boolean;
    sig: string;
    notes?: string;
    daw?: boolean;
}
/**
 * 1. Creates NCPDP SCRIPT NewRx message for electronic prescribing.
 *
 * @param {Prescription} prescription - Prescription data
 * @param {Object} participants - Sender and receiver information
 * @returns {NCPDPScriptMessage} NCPDP SCRIPT message
 *
 * @example
 * ```typescript
 * const scriptMessage = createNCPDPNewRxMessage(prescription, {
 *   sender: {
 *     npi: '1234567890',
 *     name: 'Dr. John Smith',
 *     phone: '555-0100'
 *   },
 *   receiver: {
 *     ncpdpId: '1234567',
 *     name: 'Community Pharmacy',
 *     phone: '555-0200'
 *   },
 *   patient: {
 *     patientId: 'PAT-123',
 *     name: { first: 'Jane', last: 'Doe' },
 *     dateOfBirth: new Date('1980-05-15'),
 *     sex: 'F'
 *   }
 * });
 * ```
 */
export declare function createNCPDPNewRxMessage(prescription: Prescription, participants: {
    sender: NCPDPParticipant;
    receiver: NCPDPParticipant;
    patient: NCPDPPatient;
}): NCPDPScriptMessage;
/**
 * 2. Creates NCPDP SCRIPT RefillRequest message.
 *
 * @param {PrescriptionRenewalRequest} renewalRequest - Renewal request
 * @param {Object} participants - Pharmacy and prescriber information
 * @returns {NCPDPScriptMessage} NCPDP SCRIPT message
 *
 * @example
 * ```typescript
 * const refillRequest = createNCPDPRefillRequest(renewalRequest, {
 *   pharmacy: { ncpdpId: '1234567', name: 'Community Pharmacy' },
 *   prescriber: { npi: '1234567890', name: 'Dr. Smith' },
 *   patient: patientInfo
 * });
 * ```
 */
export declare function createNCPDPRefillRequest(renewalRequest: PrescriptionRenewalRequest, participants: {
    pharmacy: NCPDPParticipant;
    prescriber: NCPDPParticipant;
    patient: NCPDPPatient;
}): NCPDPScriptMessage;
/**
 * 3. Validates NCPDP SCRIPT message structure and content.
 *
 * @param {NCPDPScriptMessage} message - NCPDP message
 * @returns {Object} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateNCPDPScriptMessage(message);
 * if (!validation.valid) {
 *   console.error('NCPDP errors:', validation.errors);
 * }
 * ```
 */
export declare function validateNCPDPScriptMessage(message: NCPDPScriptMessage): {
    valid: boolean;
    errors: string[];
    warnings: string[];
};
/**
 * 4. Parses received NCPDP SCRIPT message.
 *
 * @param {string} rawMessage - Raw NCPDP message
 * @returns {NCPDPScriptMessage} Parsed message
 *
 * @example
 * ```typescript
 * const message = parseNCPDPScriptMessage(rawXML);
 * console.log(`Received ${message.messageType} for patient ${message.patient.name.last}`);
 * ```
 */
export declare function parseNCPDPScriptMessage(rawMessage: string): NCPDPScriptMessage;
/**
 * 5. Sends NCPDP SCRIPT message to pharmacy via secure gateway.
 *
 * @param {NCPDPScriptMessage} message - Message to send
 * @returns {Promise<Object>} Send result
 *
 * @example
 * ```typescript
 * const result = await sendNCPDPScriptMessage(newRxMessage);
 * if (result.success) {
 *   console.log('Prescription sent successfully');
 * }
 * ```
 */
export declare function sendNCPDPScriptMessage(message: NCPDPScriptMessage): Promise<{
    success: boolean;
    messageId: string;
    confirmationNumber?: string;
    error?: string;
}>;
/**
 * 6. Processes NCPDP SCRIPT response/acknowledgment.
 *
 * @param {NCPDPScriptMessage} originalMessage - Original message
 * @param {string} response - Response from pharmacy
 * @returns {Object} Processing result
 *
 * @example
 * ```typescript
 * const result = processNCPDPScriptResponse(originalMessage, responseXML);
 * if (result.accepted) {
 *   console.log('Prescription accepted by pharmacy');
 * }
 * ```
 */
export declare function processNCPDPScriptResponse(originalMessage: NCPDPScriptMessage, response: string): {
    accepted: boolean;
    status: string;
    pharmacyRxNumber?: string;
    message?: string;
    errors?: string[];
};
/**
 * 7. Creates new prescription with comprehensive validation.
 *
 * @param {CreatePrescriptionDto} prescriptionData - Prescription data
 * @returns {Prescription} Created prescription
 *
 * @example
 * ```typescript
 * const prescription = createPrescription({
 *   patientId: 'PAT-123',
 *   prescriberId: 'PROV-456',
 *   medicationId: 'MED-789',
 *   medicationName: 'Lisinopril 10mg Tablet',
 *   dosage: '10mg',
 *   route: RouteOfAdministration.ORAL,
 *   frequency: 'Once daily',
 *   quantity: 90,
 *   quantityUnit: 'tablets',
 *   refills: 3,
 *   daysSupply: 90,
 *   instructions: 'Take one tablet by mouth daily for blood pressure',
 *   indication: 'Hypertension'
 * });
 * ```
 */
export declare function createPrescription(prescriptionData: CreatePrescriptionDto): Prescription;
/**
 * 8. Generates unique prescription (Rx) number.
 *
 * @returns {string} Prescription number
 *
 * @example
 * ```typescript
 * const rxNumber = generateRxNumber();
 * // Returns: 'RX-20240115-001234'
 * ```
 */
export declare function generateRxNumber(): string;
/**
 * 9. Validates prescription for completeness and safety.
 *
 * @param {CreatePrescriptionDto} prescriptionData - Prescription to validate
 * @returns {Object} Validation result
 *
 * @example
 * ```typescript
 * const validation = validatePrescription(prescriptionData);
 * if (!validation.valid) {
 *   console.error('Prescription errors:', validation.errors);
 * }
 * ```
 */
export declare function validatePrescription(prescriptionData: CreatePrescriptionDto): {
    valid: boolean;
    errors: string[];
    warnings: string[];
};
/**
 * 10. Calculates appropriate days supply based on dosing.
 *
 * @param {Object} dosingInfo - Dosing information
 * @returns {number} Calculated days supply
 *
 * @example
 * ```typescript
 * const daysSupply = calculateDaysSupply({
 *   quantity: 90,
 *   quantityUnit: 'tablets',
 *   frequency: 'TID', // Three times daily
 *   dosesPerAdministration: 1
 * });
 * // Returns: 30
 * ```
 */
export declare function calculateDaysSupply(dosingInfo: {
    quantity: number;
    quantityUnit: string;
    frequency: string;
    dosesPerAdministration: number;
}): number;
/**
 * 11. Updates prescription status with validation.
 *
 * @param {Prescription} prescription - Prescription to update
 * @param {PrescriptionStatus} newStatus - New status
 * @param {string} updatedBy - User performing update
 * @returns {Prescription} Updated prescription
 *
 * @example
 * ```typescript
 * const updated = updatePrescriptionStatus(prescription, PrescriptionStatus.COMPLETED, 'PHARM-123');
 * ```
 */
export declare function updatePrescriptionStatus(prescription: Prescription, newStatus: PrescriptionStatus, updatedBy: string): Prescription;
/**
 * 12. Records prescription fill and updates refills remaining.
 *
 * @param {Prescription} prescription - Prescription to fill
 * @param {Object} fillData - Fill information
 * @returns {Prescription} Updated prescription
 *
 * @example
 * ```typescript
 * const filled = recordPrescriptionFill(prescription, {
 *   pharmacyId: 'PHARM-123',
 *   filledBy: 'PHARMACIST-456',
 *   quantityDispensed: 90,
 *   daysSupply: 90
 * });
 * ```
 */
export declare function recordPrescriptionFill(prescription: Prescription, fillData: {
    pharmacyId: string;
    filledBy: string;
    quantityDispensed: number;
    daysSupply: number;
}): Prescription;
/**
 * 13. Creates medication reconciliation record.
 *
 * @param {Object} reconciliationData - Reconciliation data
 * @returns {MedicationReconciliation} Reconciliation record
 *
 * @example
 * ```typescript
 * const reconciliation = createMedicationReconciliation({
 *   patientId: 'PAT-123',
 *   reconciliationType: 'admission',
 *   performedBy: 'NURSE-456',
 *   homeMedications: [...],
 *   facilityMedications: [...]
 * });
 * ```
 */
export declare function createMedicationReconciliation(reconciliationData: {
    patientId: string;
    reconciliationType: 'admission' | 'transfer' | 'discharge';
    performedBy: string;
    homeMedications: ReconciliationMedication[];
    facilityMedications: ReconciliationMedication[];
}): MedicationReconciliation;
/**
 * 14. Identifies discrepancies between home and facility medications.
 *
 * @param {ReconciliationMedication[]} homeMeds - Home medications
 * @param {ReconciliationMedication[]} facilityMeds - Facility medications
 * @returns {MedicationDiscrepancy[]} Identified discrepancies
 *
 * @example
 * ```typescript
 * const discrepancies = identifyMedicationDiscrepancies(homeMeds, facilityMeds);
 * console.log(`Found ${discrepancies.length} discrepancies`);
 * ```
 */
export declare function identifyMedicationDiscrepancies(homeMeds: ReconciliationMedication[], facilityMeds: ReconciliationMedication[]): MedicationDiscrepancy[];
/**
 * 15. Resolves medication reconciliation discrepancies.
 *
 * @param {MedicationReconciliation} reconciliation - Reconciliation record
 * @param {string} resolvedBy - User resolving
 * @param {string} notes - Resolution notes
 * @returns {MedicationReconciliation} Resolved reconciliation
 *
 * @example
 * ```typescript
 * const resolved = resolveMedicationReconciliation(reconciliation, 'DR-SMITH',
 *   'All discrepancies reviewed and addressed with patient and pharmacy');
 * ```
 */
export declare function resolveMedicationReconciliation(reconciliation: MedicationReconciliation, resolvedBy: string, notes: string): MedicationReconciliation;
/**
 * 16. Checks for drug-drug interactions.
 *
 * @param {string[]} medicationIds - List of medication IDs
 * @returns {DrugInteraction[]} Identified interactions
 *
 * @example
 * ```typescript
 * const interactions = checkDrugInteractions(['MED-123', 'MED-456', 'MED-789']);
 * const major = interactions.filter(i => i.severity === InteractionSeverity.MAJOR);
 * ```
 */
export declare function checkDrugInteractions(medicationIds: string[]): DrugInteraction[];
/**
 * 17. Checks specific interaction between two medications.
 *
 * @param {string} medicationA - First medication ID
 * @param {string} medicationB - Second medication ID
 * @returns {DrugInteraction | null} Interaction if exists
 *
 * @example
 * ```typescript
 * const interaction = checkDrugDrugInteraction('WARFARIN', 'ASPIRIN');
 * if (interaction && interaction.severity === InteractionSeverity.MAJOR) {
 *   console.warn('Major interaction detected:', interaction.description);
 * }
 * ```
 */
export declare function checkDrugDrugInteraction(medicationA: string, medicationB: string): DrugInteraction | null;
/**
 * 18. Assesses interaction severity and provides recommendations.
 *
 * @param {DrugInteraction} interaction - Drug interaction
 * @returns {Object} Assessment and recommendations
 *
 * @example
 * ```typescript
 * const assessment = assessInteractionSeverity(interaction);
 * if (assessment.requiresIntervention) {
 *   console.log('Action required:', assessment.recommendation);
 * }
 * ```
 */
export declare function assessInteractionSeverity(interaction: DrugInteraction): {
    severity: InteractionSeverity;
    requiresIntervention: boolean;
    allowPrescribing: boolean;
    recommendation: string;
};
/**
 * 19. Checks for therapeutic duplication.
 *
 * @param {string[]} medicationIds - List of medication IDs
 * @returns {Object[]} Identified duplications
 *
 * @example
 * ```typescript
 * const duplications = checkTherapeuticDuplication(['LISINOPRIL', 'ENALAPRIL']);
 * // Both are ACE inhibitors - duplication detected
 * ```
 */
export declare function checkTherapeuticDuplication(medicationIds: string[]): Array<{
    medications: string[];
    therapeuticClass: string;
    severity: 'high' | 'medium' | 'low';
    recommendation: string;
}>;
/**
 * 20. Checks for drug allergies and cross-sensitivities.
 *
 * @param {string} medicationId - Medication to check
 * @param {DrugAllergy[]} patientAllergies - Patient's allergies
 * @returns {Object} Allergy check result
 *
 * @example
 * ```typescript
 * const allergyCheck = checkDrugAllergies('PENICILLIN-VK', patientAllergies);
 * if (allergyCheck.hasAllergy) {
 *   console.error('ALLERGY ALERT:', allergyCheck.matchedAllergies);
 * }
 * ```
 */
export declare function checkDrugAllergies(medicationId: string, patientAllergies: DrugAllergy[]): {
    hasAllergy: boolean;
    hasCrossSensitivity: boolean;
    matchedAllergies: DrugAllergy[];
    crossSensitivities: AllergyCrossSensitivity[];
    severity: 'life-threatening' | 'severe' | 'moderate' | 'mild' | 'none';
    recommendation: string;
};
/**
 * 21. Checks for cross-sensitivity to related medications.
 *
 * @param {string} medicationId - Medication to check
 * @param {DrugAllergy[]} allergies - Patient allergies
 * @returns {AllergyCrossSensitivity[]} Cross-sensitivities
 *
 * @example
 * ```typescript
 * const crossSens = checkCrossSensitivities('CEPHALEXIN', allergies);
 * // May detect cross-sensitivity if patient allergic to penicillin
 * ```
 */
export declare function checkCrossSensitivities(medicationId: string, allergies: DrugAllergy[]): AllergyCrossSensitivity[];
/**
 * 22. Records new drug allergy for patient.
 *
 * @param {Object} allergyData - Allergy information
 * @returns {DrugAllergy} Created allergy record
 *
 * @example
 * ```typescript
 * const allergy = recordDrugAllergy({
 *   patientId: 'PAT-123',
 *   allergen: 'Penicillin',
 *   allergenType: 'medication',
 *   reaction: 'Hives and facial swelling',
 *   severity: 'severe',
 *   verifiedBy: 'DR-SMITH'
 * });
 * ```
 */
export declare function recordDrugAllergy(allergyData: {
    patientId: string;
    allergen: string;
    allergenType: 'medication' | 'food' | 'environmental';
    reaction: string;
    severity: 'mild' | 'moderate' | 'severe' | 'life-threatening';
    onsetDate?: Date;
    verifiedBy?: string;
    notes?: string;
}): DrugAllergy;
/**
 * 23. Checks if medication is on formulary.
 *
 * @param {string} medicationId - Medication to check
 * @param {string} insurancePlanId - Insurance plan
 * @returns {FormularyEntry | null} Formulary entry if covered
 *
 * @example
 * ```typescript
 * const formulary = checkFormulary('MED-123', 'INS-PLAN-456');
 * if (formulary?.requiresPriorAuth) {
 *   console.log('Prior authorization required');
 * }
 * ```
 */
export declare function checkFormulary(medicationId: string, insurancePlanId: string): FormularyEntry | null;
/**
 * 24. Finds formulary alternatives for non-covered medication.
 *
 * @param {string} medicationId - Original medication
 * @param {string} insurancePlanId - Insurance plan
 * @returns {FormularyAlternative[]} Alternative medications
 *
 * @example
 * ```typescript
 * const alternatives = findFormularyAlternatives('BRAND-MED-123', 'INS-456');
 * alternatives.forEach(alt => {
 *   console.log(`${alt.medicationName} - Tier ${alt.tier} - Save $${alt.costSavings}`);
 * });
 * ```
 */
export declare function findFormularyAlternatives(medicationId: string, insurancePlanId: string): FormularyAlternative[];
/**
 * 25. Calculates estimated patient cost based on formulary tier.
 *
 * @param {FormularyEntry} formularyEntry - Formulary entry
 * @param {number} quantity - Quantity prescribed
 * @returns {Object} Cost estimate
 *
 * @example
 * ```typescript
 * const cost = calculatePatientCost(formularyEntry, 90);
 * console.log(`Estimated copay: $${cost.estimatedCopay}`);
 * ```
 */
export declare function calculatePatientCost(formularyEntry: FormularyEntry, quantity: number): {
    tier: number;
    estimatedCopay?: number;
    coinsuranceAmount?: number;
    totalEstimatedCost?: number;
};
/**
 * 26. Creates prior authorization request.
 *
 * @param {Object} paData - Prior authorization data
 * @returns {PriorAuthorizationRequest} PA request
 *
 * @example
 * ```typescript
 * const paRequest = createPriorAuthorizationRequest({
 *   prescriptionId: 'RX-123',
 *   patientId: 'PAT-456',
 *   medicationId: 'MED-789',
 *   medicationName: 'Humira 40mg Injection',
 *   requestedQuantity: 2,
 *   requestedDaysSupply: 30,
 *   diagnosis: ['Rheumatoid Arthritis'],
 *   icdCodes: ['M05.79'],
 *   clinicalJustification: 'Patient failed methotrexate and sulfasalazine...',
 *   triedAndFailed: ['Methotrexate', 'Sulfasalazine'],
 *   requestedBy: 'DR-SMITH'
 * });
 * ```
 */
export declare function createPriorAuthorizationRequest(paData: {
    prescriptionId: string;
    patientId: string;
    medicationId: string;
    medicationName: string;
    requestedQuantity: number;
    requestedDaysSupply: number;
    diagnosis: string[];
    icdCodes: string[];
    clinicalJustification: string;
    triedAndFailed?: string[];
    contraindicationsToAlternatives?: string[];
    supportingDocuments?: string[];
    requestedBy: string;
}): PriorAuthorizationRequest;
/**
 * 27. Processes prior authorization response from payer.
 *
 * @param {PriorAuthorizationRequest} paRequest - PA request
 * @param {Object} response - Payer response
 * @returns {PriorAuthorizationRequest} Updated PA request
 *
 * @example
 * ```typescript
 * const updated = processPriorAuthorizationResponse(paRequest, {
 *   status: 'approved',
 *   reviewedBy: 'PAYER-REVIEWER-123',
 *   approvalNumber: 'PA-APPROVAL-789',
 *   validUntil: new Date('2024-12-31')
 * });
 * ```
 */
export declare function processPriorAuthorizationResponse(paRequest: PriorAuthorizationRequest, response: {
    status: 'approved' | 'denied' | 'more_info_needed';
    reviewedBy: string;
    approvalNumber?: string;
    denialReason?: string;
    validUntil?: Date;
}): PriorAuthorizationRequest;
/**
 * 28. Validates if prior authorization is still valid.
 *
 * @param {PriorAuthorizationRequest} paRequest - PA request
 * @returns {Object} Validation result
 *
 * @example
 * ```typescript
 * const validation = validatePriorAuthorizationValidity(paRequest);
 * if (!validation.isValid) {
 *   console.log('PA expired - need new authorization');
 * }
 * ```
 */
export declare function validatePriorAuthorizationValidity(paRequest: PriorAuthorizationRequest): {
    isValid: boolean;
    reason?: string;
    daysRemaining?: number;
};
/**
 * 29. Creates prescription renewal request.
 *
 * @param {Object} renewalData - Renewal request data
 * @returns {PrescriptionRenewalRequest} Renewal request
 *
 * @example
 * ```typescript
 * const renewalRequest = createPrescriptionRenewalRequest({
 *   prescriptionId: 'RX-123',
 *   rxNumber: 'RX-20240115-001234',
 *   patientId: 'PAT-456',
 *   medicationName: 'Lisinopril 10mg',
 *   requestedBy: 'patient',
 *   requestedRefills: 3
 * });
 * ```
 */
export declare function createPrescriptionRenewalRequest(renewalData: {
    prescriptionId: string;
    rxNumber: string;
    patientId: string;
    medicationName: string;
    requestedBy: 'patient' | 'pharmacy' | 'provider';
    requestedRefills: number;
    pharmacyId?: string;
    pharmacyName?: string;
    pharmacyPhone?: string;
}): PrescriptionRenewalRequest;
/**
 * 30. Processes renewal request (approve/deny).
 *
 * @param {PrescriptionRenewalRequest} request - Renewal request
 * @param {Object} decision - Approval decision
 * @returns {PrescriptionRenewalRequest} Updated request
 *
 * @example
 * ```typescript
 * const approved = processRenewalRequest(renewalRequest, {
 *   status: 'approved',
 *   reviewedBy: 'DR-SMITH',
 *   notes: 'Renewed for 3 additional refills'
 * });
 * ```
 */
export declare function processRenewalRequest(request: PrescriptionRenewalRequest, decision: {
    status: 'approved' | 'denied' | 'requires_appointment';
    reviewedBy: string;
    denialReason?: string;
    notes?: string;
}): PrescriptionRenewalRequest;
/**
 * 31. Determines if renewal requires provider appointment.
 *
 * @param {Prescription} prescription - Original prescription
 * @param {Date} lastVisitDate - Last provider visit
 * @returns {Object} Renewal eligibility
 *
 * @example
 * ```typescript
 * const eligibility = checkRenewalEligibility(prescription, lastVisitDate);
 * if (!eligibility.eligible) {
 *   console.log('Reason:', eligibility.reason);
 * }
 * ```
 */
export declare function checkRenewalEligibility(prescription: Prescription, lastVisitDate?: Date): {
    eligible: boolean;
    reason?: string;
    requiresAppointment: boolean;
};
/**
 * 32. Queries PDMP (Prescription Drug Monitoring Program).
 *
 * @param {Object} queryData - PDMP query data
 * @returns {Promise<PDMPQuery>} PDMP query result
 *
 * @example
 * ```typescript
 * const pdmpData = await queryPDMP({
 *   patientId: 'PAT-123',
 *   patientName: 'John Doe',
 *   dateOfBirth: new Date('1980-05-15'),
 *   state: 'CA',
 *   queriedBy: 'DR-SMITH',
 *   purpose: 'prescribing'
 * });
 * ```
 */
export declare function queryPDMP(queryData: {
    patientId: string;
    patientName: string;
    dateOfBirth: Date;
    state: string;
    queriedBy: string;
    purpose: 'prescribing' | 'dispensing' | 'review';
}): Promise<PDMPQuery>;
/**
 * 33. Validates DEA number for controlled substance prescribing.
 *
 * @param {string} deaNumber - DEA number to validate
 * @returns {Object} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateDEANumber('AB1234563');
 * if (!validation.valid) {
 *   console.error('Invalid DEA number');
 * }
 * ```
 */
export declare function validateDEANumber(deaNumber: string): {
    valid: boolean;
    registrantType?: string;
    error?: string;
};
/**
 * 34. Checks if controlled substance prescription limits are exceeded.
 *
 * @param {Prescription} prescription - Prescription to check
 * @param {PDMPResult[]} pdmpResults - Recent PDMP results
 * @returns {Object} Limit check result
 *
 * @example
 * ```typescript
 * const limitCheck = checkControlledSubstanceLimits(prescription, pdmpResults);
 * if (limitCheck.exceedsLimits) {
 *   console.warn('Patient exceeds controlled substance limits:', limitCheck.warnings);
 * }
 * ```
 */
export declare function checkControlledSubstanceLimits(prescription: Prescription, pdmpResults: PDMPResult[]): {
    exceedsLimits: boolean;
    warnings: string[];
    morphineEquivalentDose?: number;
    multiplePrescriberAlert?: boolean;
    multiplePharmacyAlert?: boolean;
};
/**
 * 35. Creates medication administration record entry.
 *
 * @param {Object} marData - MAR entry data
 * @returns {MedicationAdministrationRecord} MAR entry
 *
 * @example
 * ```typescript
 * const marEntry = createMAREntry({
 *   patientId: 'PAT-123',
 *   prescriptionId: 'RX-456',
 *   medicationName: 'Lisinopril 10mg',
 *   scheduledTime: new Date('2024-01-15T09:00:00'),
 *   route: RouteOfAdministration.ORAL
 * });
 * ```
 */
export declare function createMAREntry(marData: {
    patientId: string;
    prescriptionId: string;
    medicationName: string;
    scheduledTime: Date;
    route: RouteOfAdministration;
}): MedicationAdministrationRecord;
/**
 * 36. Records medication administration with barcode verification.
 *
 * @param {MedicationAdministrationRecord} marEntry - MAR entry
 * @param {Object} administrationData - Administration details
 * @returns {MedicationAdministrationRecord} Updated MAR entry
 *
 * @example
 * ```typescript
 * const administered = recordMedicationAdministration(marEntry, {
 *   administeredBy: 'NURSE-789',
 *   dosageAdministered: '10mg',
 *   barcodeScanned: true,
 *   site: 'Left deltoid',
 *   witnessedBy: 'NURSE-012'
 * });
 * ```
 */
export declare function recordMedicationAdministration(marEntry: MedicationAdministrationRecord, administrationData: {
    administeredBy: string;
    dosageAdministered: string;
    barcodeScanned?: boolean;
    site?: string;
    witnessedBy?: string;
    notes?: string;
}): MedicationAdministrationRecord;
/**
 * 37. Records medication not given (held, refused, unavailable).
 *
 * @param {MedicationAdministrationRecord} marEntry - MAR entry
 * @param {Object} notGivenData - Not given details
 * @returns {MedicationAdministrationRecord} Updated MAR entry
 *
 * @example
 * ```typescript
 * const notGiven = recordMedicationNotGiven(marEntry, {
 *   status: 'refused',
 *   refusalReason: 'Patient stated feeling nauseous',
 *   recordedBy: 'NURSE-789'
 * });
 * ```
 */
export declare function recordMedicationNotGiven(marEntry: MedicationAdministrationRecord, notGivenData: {
    status: 'missed' | 'refused' | 'held' | 'not_available';
    refusalReason?: string;
    holdReason?: string;
    recordedBy: string;
    notes?: string;
}): MedicationAdministrationRecord;
/**
 * 38. Creates IV fluid order with rate calculations.
 *
 * @param {Object} ivData - IV fluid order data
 * @returns {IVFluidOrder} IV fluid order
 *
 * @example
 * ```typescript
 * const ivOrder = createIVFluidOrder({
 *   patientId: 'PAT-123',
 *   prescriberId: 'DR-456',
 *   fluidType: 'Normal Saline 0.9%',
 *   additives: [
 *     { medicationName: 'Potassium Chloride', dose: 20, doseUnit: 'mEq' }
 *   ],
 *   totalVolume: 1000,
 *   volumeUnit: 'mL',
 *   rate: 125,
 *   rateUnit: 'mL/hr',
 *   route: 'peripheral_iv'
 * });
 * ```
 */
export declare function createIVFluidOrder(ivData: {
    patientId: string;
    prescriberId: string;
    fluidType: string;
    additives?: IVAdditive[];
    totalVolume: number;
    volumeUnit: 'mL' | 'L';
    rate: number;
    rateUnit: 'mL/hr' | 'mL/min' | 'drops/min';
    route: 'peripheral_iv' | 'central_line' | 'picc';
    indications?: string;
    specialInstructions?: string;
}): IVFluidOrder;
/**
 * 39. Calculates IV drip rate in drops per minute.
 *
 * @param {Object} ivParams - IV parameters
 * @returns {number} Drip rate in drops/min
 *
 * @example
 * ```typescript
 * const dripRate = calculateIVDripRate({
 *   volumeML: 1000,
 *   durationHours: 8,
 *   dropFactor: 15
 * });
 * // Returns: 31 drops/min
 * ```
 */
export declare function calculateIVDripRate(ivParams: {
    volumeML: number;
    durationHours: number;
    dropFactor: number;
}): number;
/**
 * 40. Verifies medication barcode matches prescription.
 *
 * @param {Object} barcodeData - Barcode verification data
 * @returns {MedicationBarcodeVerification} Verification result
 *
 * @example
 * ```typescript
 * const verification = verifyMedicationBarcode({
 *   patientBarcode: 'PAT-123-WRISTBAND',
 *   medicationBarcode: 'NDC-12345-678-90',
 *   ndcCode: '12345-678-90',
 *   lotNumber: 'LOT123456',
 *   expirationDate: new Date('2025-12-31'),
 *   verifiedBy: 'NURSE-789',
 *   expectedMedicationId: 'MED-123'
 * });
 * ```
 */
export declare function verifyMedicationBarcode(barcodeData: {
    patientBarcode: string;
    medicationBarcode: string;
    ndcCode: string;
    lotNumber?: string;
    expirationDate?: Date;
    verifiedBy: string;
    expectedMedicationId: string;
}): MedicationBarcodeVerification;
/**
 * 41. Parses NDC (National Drug Code) barcode.
 *
 * @param {string} barcode - NDC barcode
 * @returns {Object} Parsed NDC components
 *
 * @example
 * ```typescript
 * const ndc = parseNDCBarcode('12345-678-90');
 * // Returns: { labelerCode: '12345', productCode: '678', packageCode: '90' }
 * ```
 */
export declare function parseNDCBarcode(barcode: string): {
    ndcCode: string;
    labelerCode: string;
    productCode: string;
    packageCode: string;
    valid: boolean;
};
/**
 * 42. Checks pharmacy inventory for medication availability.
 *
 * @param {string} medicationId - Medication to check
 * @param {number} quantityNeeded - Quantity needed
 * @param {string} pharmacyId - Pharmacy identifier
 * @returns {Object} Inventory check result
 *
 * @example
 * ```typescript
 * const inventory = checkPharmacyInventory('MED-123', 90, 'PHARM-456');
 * if (!inventory.available) {
 *   console.log(`Only ${inventory.quantityAvailable} available`);
 * }
 * ```
 */
export declare function checkPharmacyInventory(medicationId: string, quantityNeeded: number, pharmacyId: string): {
    available: boolean;
    quantityAvailable: number;
    location?: string;
    estimatedRestockDate?: Date;
};
/**
 * 43. Creates inventory reorder alert when below threshold.
 *
 * @param {PharmacyInventoryItem} inventoryItem - Inventory item
 * @returns {Object | null} Reorder alert if needed
 *
 * @example
 * ```typescript
 * const alert = createInventoryReorderAlert(inventoryItem);
 * if (alert) {
 *   console.log(`Reorder ${alert.reorderQuantity} units of ${alert.medicationName}`);
 * }
 * ```
 */
export declare function createInventoryReorderAlert(inventoryItem: PharmacyInventoryItem): {
    alertId: string;
    medicationId: string;
    medicationName: string;
    currentQuantity: number;
    reorderLevel: number;
    reorderQuantity: number;
    priority: 'high' | 'medium' | 'low';
} | null;
/**
 * 44. Generates compounding instructions for custom formulations.
 *
 * @param {Object} compoundData - Compound formulation data
 * @returns {CompoundingInstructions} Compounding instructions
 *
 * @example
 * ```typescript
 * const instructions = generateCompoundingInstructions({
 *   formulaName: 'Hydrocortisone 2.5% Cream',
 *   ingredients: [
 *     { ingredientName: 'Hydrocortisone powder', quantity: 2.5, quantityUnit: 'g' },
 *     { ingredientName: 'Aquaphor base', quantity: 97.5, quantityUnit: 'g' }
 *   ],
 *   finalVolume: 100,
 *   finalVolumeUnit: 'g',
 *   preparationMethod: 'Geometric dilution',
 *   stability: '90 days',
 *   storage: 'Room temperature',
 *   preparedBy: 'PHARM-123'
 * });
 * ```
 */
export declare function generateCompoundingInstructions(compoundData: {
    formulaName: string;
    ingredients: CompoundIngredient[];
    finalVolume?: number;
    finalVolumeUnit?: string;
    preparationMethod: string;
    equipment?: string[];
    stability?: string;
    storage?: string;
    preparedBy?: string;
    specialInstructions?: string;
}): CompoundingInstructions;
/**
 * 45. Calculates beyond-use date for compounded medication.
 *
 * @param {string} stability - Stability period (e.g., "90 days", "6 months")
 * @returns {Date} Beyond-use date
 *
 * @example
 * ```typescript
 * const bud = calculateBeyondUseDate('90 days');
 * // Returns date 90 days from now
 * ```
 */
export declare function calculateBeyondUseDate(stability: string): Date;
/**
 * 46. Calculates medication adherence rate (Medication Possession Ratio).
 *
 * @param {Object} adherenceData - Adherence calculation data
 * @returns {Object} Adherence metrics
 *
 * @example
 * ```typescript
 * const adherence = calculateMedicationAdherence({
 *   prescriptionDate: new Date('2024-01-01'),
 *   daysSupply: 90,
 *   fillDates: [
 *     new Date('2024-01-01'),
 *     new Date('2024-03-25'),
 *     new Date('2024-06-20')
 *   ],
 *   evaluationDate: new Date('2024-09-15')
 * });
 * console.log(`Adherence rate: ${adherence.adherenceRate}%`);
 * ```
 */
export declare function calculateMedicationAdherence(adherenceData: {
    prescriptionDate: Date;
    daysSupply: number;
    fillDates: Date[];
    evaluationDate: Date;
}): {
    adherenceRate: number;
    medicationPossessionRatio: number;
    totalDaysCovered: number;
    totalDaysInPeriod: number;
    classification: 'excellent' | 'good' | 'fair' | 'poor';
    missedDays: number;
};
/**
 * 47. Generates patient-friendly medication instructions.
 *
 * @param {Prescription} prescription - Prescription data
 * @param {Object} options - Instruction generation options
 * @returns {Object} Patient instructions
 *
 * @example
 * ```typescript
 * const instructions = generatePatientMedicationInstructions(prescription, {
 *   language: 'en',
 *   readingLevel: 'grade-6',
 *   includeWarnings: true,
 *   includeFoodInteractions: true
 * });
 * console.log(instructions.simpleInstructions);
 * // "Take 1 tablet by mouth once daily in the morning with or without food"
 * ```
 */
export declare function generatePatientMedicationInstructions(prescription: Prescription, options?: {
    language?: 'en' | 'es';
    readingLevel?: 'grade-6' | 'grade-9' | 'grade-12';
    includeWarnings?: boolean;
    includeFoodInteractions?: boolean;
    includeStorage?: boolean;
}): {
    simpleInstructions: string;
    detailedInstructions: string[];
    warnings: string[];
    foodInteractions?: string;
    storageInstructions?: string;
    missedDoseInstructions?: string;
};
//# sourceMappingURL=health-pharmacy-prescriptions-kit.d.ts.map