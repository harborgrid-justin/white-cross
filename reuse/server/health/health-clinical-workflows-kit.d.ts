/**
 * LOC: HEALTHCLINWFKIT001
 * File: /reuse/server/health/health-clinical-workflows-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - date-fns
 *   - hl7-standard (HL7 message formatting)
 *   - fhir-kit-client (FHIR resource management)
 *   - rxnorm-api (medication verification)
 *
 * DOWNSTREAM (imported by):
 *   - Clinical workflow services
 *   - EHR integration services
 *   - Order management services
 *   - Clinical documentation services
 *   - E-prescribing services
 *   - Task management services
 */
/**
 * Workflow status enumeration
 */
export declare enum WorkflowStatus {
    PENDING = "pending",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    CANCELLED = "cancelled",
    ON_HOLD = "on_hold",
    FAILED = "failed"
}
/**
 * Clinical task priority levels
 */
export declare enum TaskPriority {
    STAT = "stat",// Immediate
    URGENT = "urgent",// Within 1 hour
    ROUTINE = "routine",// Normal workflow
    LOW = "low"
}
/**
 * Order types
 */
export declare enum OrderType {
    LAB = "lab",
    IMAGING = "imaging",
    PROCEDURE = "procedure",
    MEDICATION = "medication",
    REFERRAL = "referral",
    CONSULT = "consult",
    DME = "durable_medical_equipment"
}
/**
 * Order status
 */
export declare enum OrderStatus {
    DRAFT = "draft",
    PENDING = "pending",
    SCHEDULED = "scheduled",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    RESULTED = "resulted",
    CANCELLED = "cancelled",
    DISCONTINUED = "discontinued"
}
/**
 * Prescription status
 */
export declare enum PrescriptionStatus {
    DRAFT = "draft",
    PENDING_APPROVAL = "pending_approval",
    APPROVED = "approved",
    SENT = "sent",
    IN_PROGRESS = "in_progress",
    DISPENSED = "dispensed",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
/**
 * Alert severity levels
 */
export declare enum AlertSeverity {
    CRITICAL = "critical",
    HIGH = "high",
    MEDIUM = "medium",
    LOW = "low",
    INFO = "info"
}
/**
 * Patient check-in data
 */
export interface CheckInWorkflow {
    id: string;
    appointmentId: string;
    patientId: string;
    facilityId: string;
    checkInTime: Date;
    checkInMethod: 'kiosk' | 'front_desk' | 'mobile' | 'tablet';
    insuranceVerified: boolean;
    copayCollected: boolean;
    copayAmount?: number;
    formsCompleted: string[];
    vitalSignsRequired: boolean;
    specialInstructions?: string;
    completedBy: string;
    metadata?: Record<string, any>;
}
/**
 * Patient check-out data
 */
export interface CheckOutWorkflow {
    id: string;
    appointmentId: string;
    patientId: string;
    checkOutTime: Date;
    followUpScheduled: boolean;
    followUpAppointmentId?: string;
    prescriptionsProvided: string[];
    instructionsGiven: string[];
    referralsProvided: string[];
    paymentCollected: boolean;
    balanceDue?: number;
    completedBy: string;
    metadata?: Record<string, any>;
}
/**
 * Rooming workflow data
 */
export interface RoomingWorkflow {
    id: string;
    appointmentId: string;
    patientId: string;
    roomId: string;
    roomedTime: Date;
    roomedBy: string;
    vitalSigns?: VitalSigns;
    chiefComplaint: string;
    allergiesReviewed: boolean;
    medicationsReviewed: boolean;
    medicalHistoryReviewed: boolean;
    patientEducationProvided?: string[];
    status: WorkflowStatus;
    completedAt?: Date;
    metadata?: Record<string, any>;
}
/**
 * Vital signs measurement
 */
export interface VitalSigns {
    id: string;
    patientId: string;
    encounterId: string;
    measuredAt: Date;
    measuredBy: string;
    temperature?: {
        value: number;
        unit: 'F' | 'C';
        method: string;
    };
    bloodPressure?: {
        systolic: number;
        diastolic: number;
        position: string;
    };
    heartRate?: {
        value: number;
        rhythm: string;
    };
    respiratoryRate?: number;
    oxygenSaturation?: {
        value: number;
        onOxygen: boolean;
        flowRate?: number;
    };
    weight?: {
        value: number;
        unit: 'lbs' | 'kg';
    };
    height?: {
        value: number;
        unit: 'in' | 'cm';
    };
    bmi?: number;
    painScore?: number;
    glucose?: {
        value: number;
        timing: string;
    };
    notes?: string;
    abnormalFlags?: string[];
}
/**
 * Clinical note template
 */
export interface ClinicalNoteTemplate {
    id: string;
    name: string;
    specialty: string;
    noteType: 'soap' | 'progress' | 'procedure' | 'discharge' | 'consult';
    sections: NoteSection[];
    requiredFields: string[];
    smartPhrases: SmartPhrase[];
    active: boolean;
    createdBy: string;
    createdAt: Date;
}
/**
 * Clinical note section
 */
export interface NoteSection {
    id: string;
    title: string;
    order: number;
    content?: string;
    required: boolean;
    fieldType: 'text' | 'structured' | 'checkbox' | 'select';
    options?: string[];
}
/**
 * Smart phrase for clinical documentation
 */
export interface SmartPhrase {
    id: string;
    shortcut: string;
    expansion: string;
    category: string;
    specialty?: string;
}
/**
 * Clinical note (documentation)
 */
export interface ClinicalNote {
    id: string;
    encounterId: string;
    patientId: string;
    providerId: string;
    templateId?: string;
    noteType: string;
    sections: Record<string, string>;
    status: 'draft' | 'pending_review' | 'signed' | 'amended' | 'addended';
    createdAt: Date;
    signedAt?: Date;
    signedBy?: string;
    amendments?: Amendment[];
    addendums?: Addendum[];
    metadata?: Record<string, any>;
}
/**
 * Note amendment
 */
export interface Amendment {
    id: string;
    reason: string;
    changedBy: string;
    changedAt: Date;
    originalContent: string;
    newContent: string;
}
/**
 * Note addendum
 */
export interface Addendum {
    id: string;
    content: string;
    addedBy: string;
    addedAt: Date;
    reason: string;
}
/**
 * Clinical order
 */
export interface ClinicalOrder {
    id: string;
    encounterId: string;
    patientId: string;
    orderingProviderId: string;
    orderType: OrderType;
    status: OrderStatus;
    priority: TaskPriority;
    orderDetails: any;
    indication: string;
    icd10Codes?: string[];
    scheduledDate?: Date;
    completedDate?: Date;
    results?: OrderResult[];
    alerts?: ClinicalAlert[];
    createdAt: Date;
    updatedAt: Date;
    metadata?: Record<string, any>;
}
/**
 * Lab order details
 */
export interface LabOrderDetails {
    labTests: LabTest[];
    specimenType: string;
    collectionMethod: string;
    fasting: boolean;
    urgency: 'stat' | 'urgent' | 'routine';
    labFacility?: string;
}
/**
 * Lab test
 */
export interface LabTest {
    id: string;
    name: string;
    loincCode: string;
    cptCode?: string;
    specimenType: string;
}
/**
 * Imaging order details
 */
export interface ImagingOrderDetails {
    modality: 'xray' | 'ct' | 'mri' | 'ultrasound' | 'mammogram' | 'pet' | 'nuclear';
    bodyPart: string;
    laterality?: 'left' | 'right' | 'bilateral';
    contrast: boolean;
    contrastType?: string;
    priorStudies?: string[];
    clinicalHistory: string;
    cptCode?: string;
}
/**
 * Order result
 */
export interface OrderResult {
    id: string;
    orderId: string;
    resultType: string;
    resultValue: any;
    resultUnit?: string;
    referenceRange?: string;
    abnormalFlag?: 'low' | 'high' | 'critical_low' | 'critical_high' | 'abnormal';
    resultedAt: Date;
    resultedBy: string;
    notes?: string;
}
/**
 * Referral workflow
 */
export interface Referral {
    id: string;
    patientId: string;
    referringProviderId: string;
    referralDate: Date;
    specialtyNeeded: string;
    referredToProviderId?: string;
    referredToFacilityId?: string;
    urgency: TaskPriority;
    reason: string;
    clinicalSummary: string;
    icd10Codes: string[];
    authorizationRequired: boolean;
    authorizationNumber?: string;
    status: 'pending' | 'authorized' | 'scheduled' | 'completed' | 'cancelled';
    appointmentId?: string;
    completedDate?: Date;
    feedback?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Prescription (e-prescribing)
 */
export interface Prescription {
    id: string;
    patientId: string;
    providerId: string;
    encounterId?: string;
    medicationName: string;
    rxNormCode?: string;
    ndcCode?: string;
    dosage: string;
    route: string;
    frequency: string;
    duration: string;
    quantity: number;
    refills: number;
    substitutionAllowed: boolean;
    pharmacyId?: string;
    status: PrescriptionStatus;
    prescribedDate: Date;
    startDate?: Date;
    endDate?: Date;
    indication?: string;
    instructions: string;
    alerts?: DrugAlert[];
    controlledSubstance: boolean;
    controlledSubstanceSchedule?: number;
    signature?: string;
    signedAt?: Date;
    sentToPharmacyAt?: Date;
    dispensedAt?: Date;
    metadata?: Record<string, any>;
}
/**
 * Drug alert (interactions, allergies, contraindications)
 */
export interface DrugAlert {
    id: string;
    alertType: 'allergy' | 'interaction' | 'contraindication' | 'duplicate' | 'pregnancy' | 'renal' | 'hepatic';
    severity: AlertSeverity;
    message: string;
    source: string;
    overridden: boolean;
    overrideReason?: string;
    overriddenBy?: string;
    overriddenAt?: Date;
}
/**
 * Clinical task
 */
export interface ClinicalTask {
    id: string;
    title: string;
    description: string;
    taskType: 'phone_call' | 'follow_up' | 'lab_review' | 'imaging_review' | 'medication_refill' | 'authorization' | 'other';
    patientId?: string;
    encounterId?: string;
    assignedTo: string;
    assignedBy: string;
    priority: TaskPriority;
    dueDate: Date;
    status: WorkflowStatus;
    completedAt?: Date;
    completedBy?: string;
    notes?: string;
    relatedOrders?: string[];
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Clinical pathway
 */
export interface ClinicalPathway {
    id: string;
    name: string;
    condition: string;
    icd10Codes: string[];
    steps: PathwayStep[];
    active: boolean;
    evidenceLevel: 'A' | 'B' | 'C' | 'D';
    lastReviewed: Date;
    createdBy: string;
}
/**
 * Clinical pathway step
 */
export interface PathwayStep {
    id: string;
    order: number;
    title: string;
    description: string;
    triggerCondition?: string;
    actions: PathwayAction[];
    required: boolean;
    timeframe?: {
        value: number;
        unit: 'minutes' | 'hours' | 'days' | 'weeks';
    };
}
/**
 * Pathway action
 */
export interface PathwayAction {
    actionType: 'order' | 'medication' | 'education' | 'task' | 'alert';
    actionDetails: any;
    mandatory: boolean;
}
/**
 * Handoff protocol
 */
export interface HandoffProtocol {
    id: string;
    fromProviderId: string;
    toProviderId: string;
    patientId: string;
    encounterId?: string;
    handoffType: 'shift_change' | 'transfer' | 'consult' | 'discharge';
    iPassComponents: {
        illness_severity: string;
        patient_summary: string;
        action_list: string[];
        situation_awareness: string;
        synthesis: string;
    };
    criticalInformation: string[];
    pendingTasks: string[];
    handoffTime: Date;
    acknowledged: boolean;
    acknowledgedBy?: string;
    acknowledgedAt?: Date;
    readBack?: string;
    metadata?: Record<string, any>;
}
/**
 * Time-out safety checklist
 */
export interface TimeOutChecklist {
    id: string;
    procedureId: string;
    patientId: string;
    performedAt: Date;
    performedBy: string;
    items: TimeOutItem[];
    allItemsVerified: boolean;
    teamMembers: string[];
    signedBy: string[];
    metadata?: Record<string, any>;
}
/**
 * Time-out checklist item
 */
export interface TimeOutItem {
    id: string;
    item: string;
    verified: boolean;
    verifiedBy: string;
    verifiedAt: Date;
    notes?: string;
}
/**
 * Clinical alert
 */
export interface ClinicalAlert {
    id: string;
    alertType: string;
    severity: AlertSeverity;
    patientId: string;
    encounterId?: string;
    message: string;
    details: any;
    triggeredAt: Date;
    triggeredBy: string;
    routedTo: string[];
    acknowledged: boolean;
    acknowledgedBy?: string;
    acknowledgedAt?: Date;
    actionTaken?: string;
    resolved: boolean;
    resolvedAt?: Date;
    metadata?: Record<string, any>;
}
/**
 * Workflow automation rule
 */
export interface WorkflowAutomation {
    id: string;
    name: string;
    description: string;
    triggerType: 'order_resulted' | 'vital_abnormal' | 'lab_critical' | 'medication_due' | 'time_based' | 'event';
    triggerConditions: any;
    actions: AutomationAction[];
    active: boolean;
    priority: number;
    createdBy: string;
    createdAt: Date;
    lastTriggered?: Date;
}
/**
 * Automation action
 */
export interface AutomationAction {
    actionType: 'create_task' | 'send_alert' | 'create_order' | 'update_status' | 'send_notification';
    actionConfig: any;
    delay?: {
        value: number;
        unit: 'minutes' | 'hours' | 'days';
    };
}
/**
 * 1. Processes patient check-in workflow.
 *
 * @param {string} appointmentId - Appointment ID
 * @param {object} checkInData - Check-in details
 * @returns {Promise<CheckInWorkflow>} Completed check-in workflow
 *
 * @example
 * ```typescript
 * const checkIn = await processPatientCheckIn('appt-789', {
 *   checkInMethod: 'kiosk',
 *   insuranceVerified: true,
 *   copayCollected: true,
 *   copayAmount: 25,
 *   formsCompleted: ['consent-001', 'hipaa-002'],
 *   vitalSignsRequired: true,
 *   completedBy: 'staff-456'
 * });
 *
 * console.log('Check-in completed at:', checkIn.checkInTime);
 * ```
 */
export declare function processPatientCheckIn(appointmentId: string, checkInData: Partial<CheckInWorkflow>): Promise<CheckInWorkflow>;
/**
 * 2. Processes patient check-out workflow.
 *
 * @param {string} appointmentId - Appointment ID
 * @param {object} checkOutData - Check-out details
 * @returns {Promise<CheckOutWorkflow>} Completed check-out workflow
 *
 * @example
 * ```typescript
 * const checkOut = await processPatientCheckOut('appt-789', {
 *   followUpScheduled: true,
 *   followUpAppointmentId: 'appt-790',
 *   prescriptionsProvided: ['rx-123', 'rx-124'],
 *   instructionsGiven: ['wound_care', 'medication_schedule'],
 *   referralsProvided: ['referral-456'],
 *   paymentCollected: true,
 *   completedBy: 'staff-456'
 * });
 * ```
 */
export declare function processPatientCheckOut(appointmentId: string, checkOutData: Partial<CheckOutWorkflow>): Promise<CheckOutWorkflow>;
/**
 * 3. Validates insurance eligibility during check-in.
 *
 * @param {string} patientId - Patient ID
 * @param {string} insuranceId - Insurance plan ID
 * @returns {Promise<object>} Eligibility verification result
 *
 * @example
 * ```typescript
 * const eligibility = await verifyInsuranceEligibility('patient-123', 'ins-789');
 *
 * if (!eligibility.eligible) {
 *   console.log('Issues:', eligibility.issues);
 *   // Alert front desk staff
 * }
 * ```
 */
export declare function verifyInsuranceEligibility(patientId: string, insuranceId: string): Promise<{
    eligible: boolean;
    copay?: number;
    deductible?: number;
    deductibleMet?: number;
    issues?: string[];
}>;
/**
 * 4. Collects required patient forms during check-in.
 *
 * @param {string} patientId - Patient ID
 * @param {string[]} formIds - Form IDs to collect
 * @returns {Promise<object>} Form collection status
 *
 * @example
 * ```typescript
 * const forms = await collectPatientForms('patient-123', [
 *   'consent-general',
 *   'hipaa-authorization',
 *   'medical-history'
 * ]);
 *
 * console.log('Forms completed:', forms.completed);
 * console.log('Forms pending:', forms.pending);
 * ```
 */
export declare function collectPatientForms(patientId: string, formIds: string[]): Promise<{
    completed: string[];
    pending: string[];
    signatures: Record<string, string>;
}>;
/**
 * 5. Processes copay collection.
 *
 * @param {string} patientId - Patient ID
 * @param {number} amount - Copay amount
 * @param {string} paymentMethod - Payment method
 * @returns {Promise<object>} Payment receipt
 *
 * @example
 * ```typescript
 * const receipt = await collectCopayment('patient-123', 25, 'credit_card');
 * console.log('Payment confirmation:', receipt.confirmationNumber);
 * ```
 */
export declare function collectCopayment(patientId: string, amount: number, paymentMethod: 'cash' | 'credit_card' | 'debit_card' | 'check'): Promise<{
    confirmationNumber: string;
    amount: number;
    timestamp: Date;
    receiptUrl: string;
}>;
/**
 * 6. Sends check-in notification to clinical staff.
 *
 * @param {string} appointmentId - Appointment ID
 * @param {string[]} staffIds - Staff member IDs to notify
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await notifyStaffOfCheckIn('appt-789', ['provider-456', 'ma-123']);
 * console.log('Clinical staff notified of patient arrival');
 * ```
 */
export declare function notifyStaffOfCheckIn(appointmentId: string, staffIds: string[]): Promise<void>;
/**
 * 7. Initiates rooming workflow for patient.
 *
 * @param {string} appointmentId - Appointment ID
 * @param {string} roomId - Room ID
 * @param {string} staffId - Staff member performing rooming
 * @returns {Promise<RoomingWorkflow>} Rooming workflow instance
 *
 * @example
 * ```typescript
 * const rooming = await initiateRoomingWorkflow('appt-789', 'room-12', 'ma-123');
 * console.log('Patient roomed at:', rooming.roomedTime);
 * ```
 */
export declare function initiateRoomingWorkflow(appointmentId: string, roomId: string, staffId: string): Promise<RoomingWorkflow>;
/**
 * 8. Captures and validates vital signs.
 *
 * @param {string} patientId - Patient ID
 * @param {string} encounterId - Encounter ID
 * @param {Partial<VitalSigns>} vitals - Vital signs measurements
 * @returns {Promise<VitalSigns>} Recorded vital signs with alerts
 *
 * @example
 * ```typescript
 * const vitals = await captureVitalSigns('patient-123', 'encounter-456', {
 *   temperature: { value: 98.6, unit: 'F', method: 'oral' },
 *   bloodPressure: { systolic: 120, diastolic: 80, position: 'sitting' },
 *   heartRate: { value: 72, rhythm: 'regular' },
 *   respiratoryRate: 16,
 *   oxygenSaturation: { value: 98, onOxygen: false },
 *   weight: { value: 165, unit: 'lbs' },
 *   height: { value: 68, unit: 'in' },
 *   painScore: 0,
 *   measuredBy: 'ma-123'
 * });
 *
 * if (vitals.abnormalFlags && vitals.abnormalFlags.length > 0) {
 *   console.log('Abnormal vitals detected:', vitals.abnormalFlags);
 * }
 * ```
 */
export declare function captureVitalSigns(patientId: string, encounterId: string, vitals: Partial<VitalSigns>): Promise<VitalSigns>;
/**
 * 9. Checks vital signs for abnormal values.
 *
 * @param {VitalSigns} vitals - Vital signs to check
 * @returns {string[]} Array of abnormal findings
 *
 * @example
 * ```typescript
 * const abnormalities = checkVitalAbnormalities(vitals);
 * // Returns: ['hypertension_stage2', 'tachycardia', 'low_oxygen']
 * ```
 */
export declare function checkVitalAbnormalities(vitals: VitalSigns): string[];
/**
 * 10. Updates chief complaint and history during rooming.
 *
 * @param {string} roomingId - Rooming workflow ID
 * @param {object} updates - Updates to rooming workflow
 * @returns {Promise<RoomingWorkflow>} Updated workflow
 *
 * @example
 * ```typescript
 * const updated = await updateRoomingWorkflow('rooming-123', {
 *   chiefComplaint: 'Chest pain x 2 hours, radiating to left arm',
 *   allergiesReviewed: true,
 *   medicationsReviewed: true,
 *   medicalHistoryReviewed: true,
 *   patientEducationProvided: ['vital_signs_importance']
 * });
 * ```
 */
export declare function updateRoomingWorkflow(roomingId: string, updates: Partial<RoomingWorkflow>): Promise<RoomingWorkflow>;
/**
 * 11. Calculates BMI from height and weight.
 *
 * @param {object} weight - Weight measurement
 * @param {object} height - Height measurement
 * @returns {number} BMI value
 *
 * @example
 * ```typescript
 * const bmi = calculateBMI(
 *   { value: 165, unit: 'lbs' },
 *   { value: 68, unit: 'in' }
 * );
 * console.log('BMI:', bmi.toFixed(1)); // Output: BMI: 25.1
 * ```
 */
export declare function calculateBMI(weight: {
    value: number;
    unit: 'lbs' | 'kg';
}, height: {
    value: number;
    unit: 'in' | 'cm';
}): number;
/**
 * 12. Creates clinical note from template.
 *
 * @param {string} templateId - Template ID
 * @param {string} encounterId - Encounter ID
 * @param {string} providerId - Provider ID
 * @returns {Promise<ClinicalNote>} Created note
 *
 * @example
 * ```typescript
 * const note = await createNoteFromTemplate('soap-primary-care', 'enc-789', 'provider-456');
 * console.log('Note sections:', Object.keys(note.sections));
 * ```
 */
export declare function createNoteFromTemplate(templateId: string, encounterId: string, providerId: string): Promise<ClinicalNote>;
/**
 * 13. Updates clinical note section with content.
 *
 * @param {string} noteId - Note ID
 * @param {string} sectionId - Section ID
 * @param {string} content - Section content
 * @returns {Promise<ClinicalNote>} Updated note
 *
 * @example
 * ```typescript
 * const note = await updateNoteSection('note-123', 'subjective', `
 *   Patient presents with chief complaint of chest pain x 2 hours.
 *   Pain is described as pressure-like, 7/10 severity, radiating to left arm.
 *   Associated with shortness of breath and diaphoresis.
 *   Denies nausea, vomiting, or radiation to jaw.
 * `);
 * ```
 */
export declare function updateNoteSection(noteId: string, sectionId: string, content: string): Promise<ClinicalNote>;
/**
 * 14. Expands smart phrases in clinical documentation.
 *
 * @param {string} text - Text with smart phrase shortcuts
 * @param {string} specialty - Provider specialty for context
 * @returns {Promise<string>} Expanded text
 *
 * @example
 * ```typescript
 * const expanded = await expandSmartPhrases(
 *   'Patient advised .dcins for diabetes management',
 *   'primary_care'
 * );
 * // Output: "Patient advised diet, exercise, check blood sugar 3x daily,
 * //          take medications as prescribed for diabetes management"
 * ```
 */
export declare function expandSmartPhrases(text: string, specialty: string): Promise<string>;
/**
 * 15. Signs clinical note and locks content.
 *
 * @param {string} noteId - Note ID
 * @param {string} providerId - Provider ID signing
 * @param {string} signature - Electronic signature
 * @returns {Promise<ClinicalNote>} Signed note
 *
 * @example
 * ```typescript
 * const signed = await signClinicalNote('note-123', 'provider-456', electronicSignature);
 * console.log('Note signed at:', signed.signedAt);
 * console.log('Signed by:', signed.signedBy);
 * ```
 */
export declare function signClinicalNote(noteId: string, providerId: string, signature: string): Promise<ClinicalNote>;
/**
 * 16. Adds amendment to signed clinical note.
 *
 * @param {string} noteId - Note ID
 * @param {string} sectionId - Section to amend
 * @param {string} newContent - New content
 * @param {string} reason - Reason for amendment
 * @param {string} providerId - Provider making amendment
 * @returns {Promise<ClinicalNote>} Amended note
 *
 * @example
 * ```typescript
 * const amended = await amendClinicalNote(
 *   'note-123',
 *   'assessment',
 *   'Updated diagnosis: Acute myocardial infarction (changed from chest pain)',
 *   'Additional lab results received showing troponin elevation',
 *   'provider-456'
 * );
 * ```
 */
export declare function amendClinicalNote(noteId: string, sectionId: string, newContent: string, reason: string, providerId: string): Promise<ClinicalNote>;
/**
 * 17. Adds addendum to clinical note.
 *
 * @param {string} noteId - Note ID
 * @param {string} content - Addendum content
 * @param {string} reason - Reason for addendum
 * @param {string} providerId - Provider adding addendum
 * @returns {Promise<ClinicalNote>} Note with addendum
 *
 * @example
 * ```typescript
 * const withAddendum = await addNoteAddendum(
 *   'note-123',
 *   'Patient called with follow-up question. Advised to continue current medication regimen.',
 *   'Post-visit phone call documentation',
 *   'provider-456'
 * );
 * ```
 */
export declare function addNoteAddendum(noteId: string, content: string, reason: string, providerId: string): Promise<ClinicalNote>;
/**
 * 18. Creates lab order with required tests.
 *
 * @param {string} encounterId - Encounter ID
 * @param {string} providerId - Ordering provider ID
 * @param {LabOrderDetails} labDetails - Lab order details
 * @returns {Promise<ClinicalOrder>} Created lab order
 *
 * @example
 * ```typescript
 * const labOrder = await createLabOrder('enc-789', 'provider-456', {
 *   labTests: [
 *     { id: 'cbc', name: 'Complete Blood Count', loincCode: '58410-2', specimenType: 'blood' },
 *     { id: 'cmp', name: 'Comprehensive Metabolic Panel', loincCode: '24323-8', specimenType: 'blood' }
 *   ],
 *   specimenType: 'venous_blood',
 *   collectionMethod: 'venipuncture',
 *   fasting: true,
 *   urgency: 'routine',
 *   labFacility: 'lab-facility-001'
 * });
 * ```
 */
export declare function createLabOrder(encounterId: string, providerId: string, labDetails: LabOrderDetails): Promise<ClinicalOrder>;
/**
 * 19. Creates imaging order with clinical indication.
 *
 * @param {string} encounterId - Encounter ID
 * @param {string} providerId - Ordering provider ID
 * @param {ImagingOrderDetails} imagingDetails - Imaging order details
 * @returns {Promise<ClinicalOrder>} Created imaging order
 *
 * @example
 * ```typescript
 * const imagingOrder = await createImagingOrder('enc-789', 'provider-456', {
 *   modality: 'ct',
 *   bodyPart: 'chest',
 *   contrast: true,
 *   contrastType: 'IV contrast',
 *   clinicalHistory: 'Chest pain, rule out pulmonary embolism',
 *   cptCode: '71260'
 * });
 * ```
 */
export declare function createImagingOrder(encounterId: string, providerId: string, imagingDetails: ImagingOrderDetails): Promise<ClinicalOrder>;
/**
 * 20. Updates order status and tracks workflow.
 *
 * @param {string} orderId - Order ID
 * @param {OrderStatus} status - New status
 * @param {object} metadata - Additional status metadata
 * @returns {Promise<ClinicalOrder>} Updated order
 *
 * @example
 * ```typescript
 * const updated = await updateOrderStatus('order-123', OrderStatus.SCHEDULED, {
 *   scheduledDate: new Date('2025-01-20T14:00:00'),
 *   scheduledLocation: 'imaging-dept-ct1',
 *   estimatedDuration: 30
 * });
 * ```
 */
export declare function updateOrderStatus(orderId: string, status: OrderStatus, metadata?: any): Promise<ClinicalOrder>;
/**
 * 21. Records order results and creates alerts if critical.
 *
 * @param {string} orderId - Order ID
 * @param {OrderResult[]} results - Order results
 * @returns {Promise<ClinicalOrder>} Order with results
 *
 * @example
 * ```typescript
 * const withResults = await recordOrderResults('order-123', [
 *   {
 *     id: 'result-1',
 *     orderId: 'order-123',
 *     resultType: 'Troponin I',
 *     resultValue: 0.04,
 *     resultUnit: 'ng/mL',
 *     referenceRange: '0.00-0.04',
 *     abnormalFlag: undefined,
 *     resultedAt: new Date(),
 *     resultedBy: 'lab-tech-789'
 *   }
 * ]);
 * ```
 */
export declare function recordOrderResults(orderId: string, results: OrderResult[]): Promise<ClinicalOrder>;
/**
 * 22. Discontinues active order.
 *
 * @param {string} orderId - Order ID
 * @param {string} reason - Discontinuation reason
 * @param {string} providerId - Provider discontinuing order
 * @returns {Promise<ClinicalOrder>} Discontinued order
 *
 * @example
 * ```typescript
 * const discontinued = await discontinueOrder(
 *   'order-123',
 *   'Patient declined procedure after counseling',
 *   'provider-456'
 * );
 * ```
 */
export declare function discontinueOrder(orderId: string, reason: string, providerId: string): Promise<ClinicalOrder>;
/**
 * 23. Validates order against clinical decision support rules.
 *
 * @param {ClinicalOrder} order - Order to validate
 * @returns {Promise<object>} Validation result with alerts
 *
 * @example
 * ```typescript
 * const validation = await validateOrderAgainstCDS(labOrder);
 *
 * if (!validation.approved) {
 *   console.log('Warnings:', validation.warnings);
 *   console.log('Recommendations:', validation.recommendations);
 * }
 * ```
 */
export declare function validateOrderAgainstCDS(order: ClinicalOrder): Promise<{
    approved: boolean;
    warnings: string[];
    recommendations: string[];
    requiresOverride: boolean;
}>;
/**
 * 24. Creates specialist referral.
 *
 * @param {string} patientId - Patient ID
 * @param {string} referringProviderId - Referring provider ID
 * @param {object} referralDetails - Referral details
 * @returns {Promise<Referral>} Created referral
 *
 * @example
 * ```typescript
 * const referral = await createReferral('patient-123', 'provider-456', {
 *   specialtyNeeded: 'Cardiology',
 *   urgency: TaskPriority.URGENT,
 *   reason: 'Abnormal stress test, evaluate for coronary artery disease',
 *   clinicalSummary: 'Patient with chest pain and positive stress test...',
 *   icd10Codes: ['I25.10', 'R07.9'],
 *   authorizationRequired: true
 * });
 * ```
 */
export declare function createReferral(patientId: string, referringProviderId: string, referralDetails: Partial<Referral>): Promise<Referral>;
/**
 * 25. Tracks referral status and appointment scheduling.
 *
 * @param {string} referralId - Referral ID
 * @param {object} update - Status update
 * @returns {Promise<Referral>} Updated referral
 *
 * @example
 * ```typescript
 * const updated = await updateReferralStatus('referral-123', {
 *   status: 'authorized',
 *   authorizationNumber: 'AUTH-789456',
 *   referredToProviderId: 'cardio-provider-789',
 *   appointmentId: 'appt-scheduled-123'
 * });
 * ```
 */
export declare function updateReferralStatus(referralId: string, update: Partial<Referral>): Promise<Referral>;
/**
 * 26. Requests authorization for referral.
 *
 * @param {string} referralId - Referral ID
 * @returns {Promise<object>} Authorization request result
 *
 * @example
 * ```typescript
 * const authResult = await requestReferralAuthorization('referral-123');
 *
 * if (authResult.approved) {
 *   console.log('Authorization number:', authResult.authorizationNumber);
 * }
 * ```
 */
export declare function requestReferralAuthorization(referralId: string): Promise<{
    approved: boolean;
    authorizationNumber?: string;
    expirationDate?: Date;
    denialReason?: string;
}>;
/**
 * 27. Records referral completion with specialist feedback.
 *
 * @param {string} referralId - Referral ID
 * @param {string} feedback - Specialist feedback/consultation note
 * @returns {Promise<Referral>} Completed referral
 *
 * @example
 * ```typescript
 * const completed = await completeReferral('referral-123', `
 *   Patient evaluated on 1/15/2025. Diagnosis: Stable angina.
 *   Recommendation: Continue medical management with beta blocker.
 *   Follow up with PCP in 3 months. No invasive intervention needed at this time.
 * `);
 * ```
 */
export declare function completeReferral(referralId: string, feedback: string): Promise<Referral>;
/**
 * 28. Creates electronic prescription with safety checks.
 *
 * @param {string} patientId - Patient ID
 * @param {string} providerId - Prescribing provider ID
 * @param {Partial<Prescription>} prescriptionData - Prescription details
 * @returns {Promise<Prescription>} Created prescription with alerts
 *
 * @example
 * ```typescript
 * const rx = await createPrescription('patient-123', 'provider-456', {
 *   medicationName: 'Lisinopril',
 *   rxNormCode: '314076',
 *   dosage: '10 mg',
 *   route: 'oral',
 *   frequency: 'once daily',
 *   duration: '30 days',
 *   quantity: 30,
 *   refills: 3,
 *   substitutionAllowed: true,
 *   indication: 'Hypertension',
 *   instructions: 'Take one tablet by mouth once daily'
 * });
 *
 * if (rx.alerts && rx.alerts.length > 0) {
 *   console.log('Drug alerts:', rx.alerts);
 * }
 * ```
 */
export declare function createPrescription(patientId: string, providerId: string, prescriptionData: Partial<Prescription>): Promise<Prescription>;
/**
 * 29. Performs comprehensive drug safety checks.
 *
 * @param {string} patientId - Patient ID
 * @param {Prescription} prescription - Prescription to check
 * @returns {Promise<DrugAlert[]>} Array of drug alerts
 *
 * @example
 * ```typescript
 * const alerts = await performDrugSafetyChecks('patient-123', prescription);
 * // Returns alerts for drug-drug interactions, allergies, contraindications
 * ```
 */
export declare function performDrugSafetyChecks(patientId: string, prescription: Prescription): Promise<DrugAlert[]>;
/**
 * 30. Sends prescription to pharmacy electronically.
 *
 * @param {string} prescriptionId - Prescription ID
 * @param {string} pharmacyId - Pharmacy ID
 * @returns {Promise<Prescription>} Updated prescription
 *
 * @example
 * ```typescript
 * const sent = await sendPrescriptionToPharmacy('rx-123', 'pharmacy-789');
 * console.log('Sent to pharmacy at:', sent.sentToPharmacyAt);
 * ```
 */
export declare function sendPrescriptionToPharmacy(prescriptionId: string, pharmacyId: string): Promise<Prescription>;
/**
 * 31. Handles controlled substance prescribing with EPCS.
 *
 * @param {Prescription} prescription - Controlled substance prescription
 * @param {string} providerSignature - Two-factor authenticated signature
 * @returns {Promise<Prescription>} Signed controlled substance prescription
 *
 * @example
 * ```typescript
 * const controlled = await prescribeControlledSubstance(prescription, epcsSignature);
 * console.log('Schedule:', controlled.controlledSubstanceSchedule);
 * console.log('Signed with EPCS at:', controlled.signedAt);
 * ```
 */
export declare function prescribeControlledSubstance(prescription: Prescription, providerSignature: string): Promise<Prescription>;
/**
 * 32. Creates clinical task with assignment.
 *
 * @param {Partial<ClinicalTask>} taskData - Task details
 * @returns {Promise<ClinicalTask>} Created task
 *
 * @example
 * ```typescript
 * const task = await createClinicalTask({
 *   title: 'Follow up on abnormal lab',
 *   description: 'Patient troponin elevated, contact for cardiology referral',
 *   taskType: 'follow_up',
 *   patientId: 'patient-123',
 *   encounterId: 'enc-789',
 *   assignedTo: 'provider-456',
 *   assignedBy: 'system',
 *   priority: TaskPriority.URGENT,
 *   dueDate: new Date(),
 *   status: WorkflowStatus.PENDING
 * });
 * ```
 */
export declare function createClinicalTask(taskData: Partial<ClinicalTask>): Promise<ClinicalTask>;
/**
 * 33. Assigns task to different user.
 *
 * @param {string} taskId - Task ID
 * @param {string} newAssignee - New assignee user ID
 * @param {string} assignedBy - User making the reassignment
 * @returns {Promise<ClinicalTask>} Updated task
 *
 * @example
 * ```typescript
 * const reassigned = await reassignTask('task-123', 'provider-789', 'supervisor-456');
 * console.log('Task reassigned to:', reassigned.assignedTo);
 * ```
 */
export declare function reassignTask(taskId: string, newAssignee: string, assignedBy: string): Promise<ClinicalTask>;
/**
 * 34. Completes clinical task with outcome notes.
 *
 * @param {string} taskId - Task ID
 * @param {string} completedBy - User completing task
 * @param {string} notes - Completion notes
 * @returns {Promise<ClinicalTask>} Completed task
 *
 * @example
 * ```typescript
 * const completed = await completeTask(
 *   'task-123',
 *   'provider-456',
 *   'Patient contacted, scheduled for cardiology follow-up next week'
 * );
 * ```
 */
export declare function completeTask(taskId: string, completedBy: string, notes?: string): Promise<ClinicalTask>;
/**
 * 35. Gets overdue tasks for provider/team.
 *
 * @param {string} userId - User ID
 * @returns {Promise<ClinicalTask[]>} Overdue tasks
 *
 * @example
 * ```typescript
 * const overdue = await getOverdueTasks('provider-456');
 * console.log(`${overdue.length} overdue tasks`);
 * ```
 */
export declare function getOverdueTasks(userId: string): Promise<ClinicalTask[]>;
/**
 * 36. Activates clinical pathway for patient condition.
 *
 * @param {string} patientId - Patient ID
 * @param {string} pathwayId - Clinical pathway ID
 * @param {string} encounterId - Encounter ID
 * @returns {Promise<object>} Activated pathway instance
 *
 * @example
 * ```typescript
 * const pathway = await activateClinicalPathway(
 *   'patient-123',
 *   'sepsis-pathway',
 *   'enc-789'
 * );
 *
 * console.log('Pathway steps:', pathway.steps.length);
 * console.log('Required actions:', pathway.requiredActions);
 * ```
 */
export declare function activateClinicalPathway(patientId: string, pathwayId: string, encounterId: string): Promise<any>;
/**
 * 37. Advances pathway to next step.
 *
 * @param {string} pathwayInstanceId - Pathway instance ID
 * @param {boolean} stepCompleted - Whether current step completed
 * @returns {Promise<object>} Updated pathway instance
 *
 * @example
 * ```typescript
 * const advanced = await advancePathwayStep('pathway-inst-123', true);
 * console.log('Current step:', advanced.currentStep);
 * console.log('Next actions:', advanced.nextActions);
 * ```
 */
export declare function advancePathwayStep(pathwayInstanceId: string, stepCompleted: boolean): Promise<any>;
/**
 * 38. Validates pathway compliance and completion.
 *
 * @param {string} pathwayInstanceId - Pathway instance ID
 * @returns {Promise<object>} Compliance report
 *
 * @example
 * ```typescript
 * const compliance = await validatePathwayCompliance('pathway-inst-123');
 * console.log('Compliance rate:', compliance.complianceRate);
 * console.log('Missed steps:', compliance.missedSteps);
 * ```
 */
export declare function validatePathwayCompliance(pathwayInstanceId: string): Promise<any>;
/**
 * 39. Initiates patient handoff using I-PASS protocol.
 *
 * @param {string} patientId - Patient ID
 * @param {string} fromProviderId - Current provider ID
 * @param {string} toProviderId - Receiving provider ID
 * @param {object} handoffData - I-PASS components
 * @returns {Promise<HandoffProtocol>} Handoff protocol instance
 *
 * @example
 * ```typescript
 * const handoff = await initiatePatientHandoff('patient-123', 'provider-day', 'provider-night', {
 *   handoffType: 'shift_change',
 *   illness_severity: 'Moderate - stable but requires monitoring',
 *   patient_summary: '65yo M admitted for chest pain, ruled out for MI...',
 *   action_list: ['Recheck troponin at 2200', 'Monitor telemetry overnight'],
 *   situation_awareness: 'If chest pain recurs, obtain ECG and notify cardiology',
 *   synthesis: '' // Filled by receiving provider
 * });
 * ```
 */
export declare function initiatePatientHandoff(patientId: string, fromProviderId: string, toProviderId: string, handoffData: Partial<HandoffProtocol>): Promise<HandoffProtocol>;
/**
 * 40. Acknowledges handoff with read-back.
 *
 * @param {string} handoffId - Handoff ID
 * @param {string} providerId - Acknowledging provider ID
 * @param {string} synthesis - Provider's synthesis of information
 * @returns {Promise<HandoffProtocol>} Acknowledged handoff
 *
 * @example
 * ```typescript
 * const acknowledged = await acknowledgeHandoff('handoff-123', 'provider-night', `
 *   Understood: 65yo male, chest pain ruled out for MI, stable.
 *   Will recheck troponin at 2200, monitor telemetry.
 *   If chest pain recurs, will obtain ECG and contact cardiology.
 * `);
 * ```
 */
export declare function acknowledgeHandoff(handoffId: string, providerId: string, synthesis: string): Promise<HandoffProtocol>;
/**
 * 41. Performs pre-procedure time-out checklist.
 *
 * @param {string} procedureId - Procedure ID
 * @param {string} patientId - Patient ID
 * @param {string[]} teamMembers - Team member IDs
 * @returns {Promise<TimeOutChecklist>} Time-out checklist
 *
 * @example
 * ```typescript
 * const timeout = await performTimeOutChecklist('proc-123', 'patient-123', [
 *   'surgeon-456',
 *   'anesthesia-789',
 *   'nurse-012'
 * ]);
 *
 * // Each team member verifies checklist items
 * await verifyTimeOutItem(timeout.id, 'correct_patient', 'surgeon-456');
 * await verifyTimeOutItem(timeout.id, 'correct_procedure', 'surgeon-456');
 * ```
 */
export declare function performTimeOutChecklist(procedureId: string, patientId: string, teamMembers: string[]): Promise<TimeOutChecklist>;
/**
 * 42. Routes clinical alert to appropriate team members.
 *
 * @param {Partial<ClinicalAlert>} alertData - Alert details
 * @returns {Promise<ClinicalAlert>} Created and routed alert
 *
 * @example
 * ```typescript
 * const alert = await routeClinicalAlert({
 *   alertType: 'critical_lab',
 *   severity: AlertSeverity.CRITICAL,
 *   patientId: 'patient-123',
 *   encounterId: 'enc-789',
 *   message: 'Critical potassium: 6.8 mEq/L (normal 3.5-5.0)',
 *   details: { labName: 'Potassium', value: 6.8, critical: true },
 *   triggeredBy: 'system'
 * });
 *
 * console.log('Alert routed to:', alert.routedTo);
 * ```
 */
export declare function routeClinicalAlert(alertData: Partial<ClinicalAlert>): Promise<ClinicalAlert>;
declare const _default: {
    processPatientCheckIn: typeof processPatientCheckIn;
    processPatientCheckOut: typeof processPatientCheckOut;
    verifyInsuranceEligibility: typeof verifyInsuranceEligibility;
    collectPatientForms: typeof collectPatientForms;
    collectCopayment: typeof collectCopayment;
    notifyStaffOfCheckIn: typeof notifyStaffOfCheckIn;
    initiateRoomingWorkflow: typeof initiateRoomingWorkflow;
    captureVitalSigns: typeof captureVitalSigns;
    checkVitalAbnormalities: typeof checkVitalAbnormalities;
    updateRoomingWorkflow: typeof updateRoomingWorkflow;
    calculateBMI: typeof calculateBMI;
    createNoteFromTemplate: typeof createNoteFromTemplate;
    updateNoteSection: typeof updateNoteSection;
    expandSmartPhrases: typeof expandSmartPhrases;
    signClinicalNote: typeof signClinicalNote;
    amendClinicalNote: typeof amendClinicalNote;
    addNoteAddendum: typeof addNoteAddendum;
    createLabOrder: typeof createLabOrder;
    createImagingOrder: typeof createImagingOrder;
    updateOrderStatus: typeof updateOrderStatus;
    recordOrderResults: typeof recordOrderResults;
    discontinueOrder: typeof discontinueOrder;
    validateOrderAgainstCDS: typeof validateOrderAgainstCDS;
    createReferral: typeof createReferral;
    updateReferralStatus: typeof updateReferralStatus;
    requestReferralAuthorization: typeof requestReferralAuthorization;
    completeReferral: typeof completeReferral;
    createPrescription: typeof createPrescription;
    performDrugSafetyChecks: typeof performDrugSafetyChecks;
    sendPrescriptionToPharmacy: typeof sendPrescriptionToPharmacy;
    prescribeControlledSubstance: typeof prescribeControlledSubstance;
    createClinicalTask: typeof createClinicalTask;
    reassignTask: typeof reassignTask;
    completeTask: typeof completeTask;
    getOverdueTasks: typeof getOverdueTasks;
    activateClinicalPathway: typeof activateClinicalPathway;
    advancePathwayStep: typeof advancePathwayStep;
    validatePathwayCompliance: typeof validatePathwayCompliance;
    initiatePatientHandoff: typeof initiatePatientHandoff;
    acknowledgeHandoff: typeof acknowledgeHandoff;
    performTimeOutChecklist: typeof performTimeOutChecklist;
    routeClinicalAlert: typeof routeClinicalAlert;
};
export default _default;
//# sourceMappingURL=health-clinical-workflows-kit.d.ts.map