"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertSeverity = exports.PrescriptionStatus = exports.OrderStatus = exports.OrderType = exports.TaskPriority = exports.WorkflowStatus = void 0;
exports.processPatientCheckIn = processPatientCheckIn;
exports.processPatientCheckOut = processPatientCheckOut;
exports.verifyInsuranceEligibility = verifyInsuranceEligibility;
exports.collectPatientForms = collectPatientForms;
exports.collectCopayment = collectCopayment;
exports.notifyStaffOfCheckIn = notifyStaffOfCheckIn;
exports.initiateRoomingWorkflow = initiateRoomingWorkflow;
exports.captureVitalSigns = captureVitalSigns;
exports.checkVitalAbnormalities = checkVitalAbnormalities;
exports.updateRoomingWorkflow = updateRoomingWorkflow;
exports.calculateBMI = calculateBMI;
exports.createNoteFromTemplate = createNoteFromTemplate;
exports.updateNoteSection = updateNoteSection;
exports.expandSmartPhrases = expandSmartPhrases;
exports.signClinicalNote = signClinicalNote;
exports.amendClinicalNote = amendClinicalNote;
exports.addNoteAddendum = addNoteAddendum;
exports.createLabOrder = createLabOrder;
exports.createImagingOrder = createImagingOrder;
exports.updateOrderStatus = updateOrderStatus;
exports.recordOrderResults = recordOrderResults;
exports.discontinueOrder = discontinueOrder;
exports.validateOrderAgainstCDS = validateOrderAgainstCDS;
exports.createReferral = createReferral;
exports.updateReferralStatus = updateReferralStatus;
exports.requestReferralAuthorization = requestReferralAuthorization;
exports.completeReferral = completeReferral;
exports.createPrescription = createPrescription;
exports.performDrugSafetyChecks = performDrugSafetyChecks;
exports.sendPrescriptionToPharmacy = sendPrescriptionToPharmacy;
exports.prescribeControlledSubstance = prescribeControlledSubstance;
exports.createClinicalTask = createClinicalTask;
exports.reassignTask = reassignTask;
exports.completeTask = completeTask;
exports.getOverdueTasks = getOverdueTasks;
exports.activateClinicalPathway = activateClinicalPathway;
exports.advancePathwayStep = advancePathwayStep;
exports.validatePathwayCompliance = validatePathwayCompliance;
exports.initiatePatientHandoff = initiatePatientHandoff;
exports.acknowledgeHandoff = acknowledgeHandoff;
exports.performTimeOutChecklist = performTimeOutChecklist;
exports.routeClinicalAlert = routeClinicalAlert;
const date_fns_1 = require("date-fns");
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * Workflow status enumeration
 */
var WorkflowStatus;
(function (WorkflowStatus) {
    WorkflowStatus["PENDING"] = "pending";
    WorkflowStatus["IN_PROGRESS"] = "in_progress";
    WorkflowStatus["COMPLETED"] = "completed";
    WorkflowStatus["CANCELLED"] = "cancelled";
    WorkflowStatus["ON_HOLD"] = "on_hold";
    WorkflowStatus["FAILED"] = "failed";
})(WorkflowStatus || (exports.WorkflowStatus = WorkflowStatus = {}));
/**
 * Clinical task priority levels
 */
var TaskPriority;
(function (TaskPriority) {
    TaskPriority["STAT"] = "stat";
    TaskPriority["URGENT"] = "urgent";
    TaskPriority["ROUTINE"] = "routine";
    TaskPriority["LOW"] = "low";
})(TaskPriority || (exports.TaskPriority = TaskPriority = {}));
/**
 * Order types
 */
var OrderType;
(function (OrderType) {
    OrderType["LAB"] = "lab";
    OrderType["IMAGING"] = "imaging";
    OrderType["PROCEDURE"] = "procedure";
    OrderType["MEDICATION"] = "medication";
    OrderType["REFERRAL"] = "referral";
    OrderType["CONSULT"] = "consult";
    OrderType["DME"] = "durable_medical_equipment";
})(OrderType || (exports.OrderType = OrderType = {}));
/**
 * Order status
 */
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["DRAFT"] = "draft";
    OrderStatus["PENDING"] = "pending";
    OrderStatus["SCHEDULED"] = "scheduled";
    OrderStatus["IN_PROGRESS"] = "in_progress";
    OrderStatus["COMPLETED"] = "completed";
    OrderStatus["RESULTED"] = "resulted";
    OrderStatus["CANCELLED"] = "cancelled";
    OrderStatus["DISCONTINUED"] = "discontinued";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
/**
 * Prescription status
 */
var PrescriptionStatus;
(function (PrescriptionStatus) {
    PrescriptionStatus["DRAFT"] = "draft";
    PrescriptionStatus["PENDING_APPROVAL"] = "pending_approval";
    PrescriptionStatus["APPROVED"] = "approved";
    PrescriptionStatus["SENT"] = "sent";
    PrescriptionStatus["IN_PROGRESS"] = "in_progress";
    PrescriptionStatus["DISPENSED"] = "dispensed";
    PrescriptionStatus["COMPLETED"] = "completed";
    PrescriptionStatus["CANCELLED"] = "cancelled";
})(PrescriptionStatus || (exports.PrescriptionStatus = PrescriptionStatus = {}));
/**
 * Alert severity levels
 */
var AlertSeverity;
(function (AlertSeverity) {
    AlertSeverity["CRITICAL"] = "critical";
    AlertSeverity["HIGH"] = "high";
    AlertSeverity["MEDIUM"] = "medium";
    AlertSeverity["LOW"] = "low";
    AlertSeverity["INFO"] = "info";
})(AlertSeverity || (exports.AlertSeverity = AlertSeverity = {}));
// ============================================================================
// SECTION 1: CHECK-IN AND CHECK-OUT WORKFLOWS (Functions 1-6)
// ============================================================================
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
async function processPatientCheckIn(appointmentId, checkInData) {
    const appointment = await getAppointment(appointmentId);
    const checkIn = {
        id: generateCheckInId(),
        appointmentId,
        patientId: appointment.patientId,
        facilityId: appointment.facilityId,
        checkInTime: new Date(),
        checkInMethod: checkInData.checkInMethod || 'front_desk',
        insuranceVerified: checkInData.insuranceVerified || false,
        copayCollected: checkInData.copayCollected || false,
        copayAmount: checkInData.copayAmount,
        formsCompleted: checkInData.formsCompleted || [],
        vitalSignsRequired: checkInData.vitalSignsRequired || false,
        specialInstructions: checkInData.specialInstructions,
        completedBy: checkInData.completedBy,
        metadata: {
            appointmentTime: appointment.startTime,
            checkInDuration: 0, // Will be calculated
        },
    };
    // Update appointment status to checked-in
    await updateAppointmentStatus(appointmentId, 'checked_in');
    // Trigger rooming workflow if vitals required
    if (checkIn.vitalSignsRequired) {
        await triggerRoomingWorkflow(appointmentId);
    }
    return checkIn;
}
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
async function processPatientCheckOut(appointmentId, checkOutData) {
    const appointment = await getAppointment(appointmentId);
    const checkOut = {
        id: generateCheckOutId(),
        appointmentId,
        patientId: appointment.patientId,
        checkOutTime: new Date(),
        followUpScheduled: checkOutData.followUpScheduled || false,
        followUpAppointmentId: checkOutData.followUpAppointmentId,
        prescriptionsProvided: checkOutData.prescriptionsProvided || [],
        instructionsGiven: checkOutData.instructionsGiven || [],
        referralsProvided: checkOutData.referralsProvided || [],
        paymentCollected: checkOutData.paymentCollected || false,
        balanceDue: checkOutData.balanceDue,
        completedBy: checkOutData.completedBy,
    };
    // Update appointment status to completed
    await updateAppointmentStatus(appointmentId, 'completed');
    // Send post-visit survey
    await sendPostVisitSurvey(appointment.patientId, appointmentId);
    return checkOut;
}
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
async function verifyInsuranceEligibility(patientId, insuranceId) {
    // Integration with insurance verification service
    // This would make real-time eligibility check via X12 270/271 transaction
    return {
        eligible: true,
        copay: 25,
        deductible: 1000,
        deductibleMet: 500,
    };
}
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
async function collectPatientForms(patientId, formIds) {
    const completed = [];
    const pending = [];
    const signatures = {};
    for (const formId of formIds) {
        const formStatus = await getFormStatus(patientId, formId);
        if (formStatus.signed) {
            completed.push(formId);
            signatures[formId] = formStatus.signature;
        }
        else {
            pending.push(formId);
        }
    }
    return { completed, pending, signatures };
}
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
async function collectCopayment(patientId, amount, paymentMethod) {
    // Process payment through payment gateway
    const confirmationNumber = generatePaymentConfirmation();
    return {
        confirmationNumber,
        amount,
        timestamp: new Date(),
        receiptUrl: `/receipts/${confirmationNumber}`,
    };
}
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
async function notifyStaffOfCheckIn(appointmentId, staffIds) {
    const appointment = await getAppointment(appointmentId);
    for (const staffId of staffIds) {
        await sendNotification(staffId, {
            type: 'patient_checked_in',
            title: 'Patient Checked In',
            message: `Patient for ${appointment.startTime} appointment has checked in`,
            appointmentId,
            priority: 'normal',
        });
    }
}
// ============================================================================
// SECTION 2: ROOMING AND VITAL SIGNS (Functions 7-11)
// ============================================================================
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
async function initiateRoomingWorkflow(appointmentId, roomId, staffId) {
    const appointment = await getAppointment(appointmentId);
    const workflow = {
        id: generateRoomingId(),
        appointmentId,
        patientId: appointment.patientId,
        roomId,
        roomedTime: new Date(),
        roomedBy: staffId,
        chiefComplaint: '',
        allergiesReviewed: false,
        medicationsReviewed: false,
        medicalHistoryReviewed: false,
        status: WorkflowStatus.IN_PROGRESS,
    };
    // Update appointment status
    await updateAppointmentStatus(appointmentId, 'in_room');
    return workflow;
}
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
async function captureVitalSigns(patientId, encounterId, vitals) {
    const vitalSigns = {
        id: generateVitalsId(),
        patientId,
        encounterId,
        measuredAt: new Date(),
        measuredBy: vitals.measuredBy,
        temperature: vitals.temperature,
        bloodPressure: vitals.bloodPressure,
        heartRate: vitals.heartRate,
        respiratoryRate: vitals.respiratoryRate,
        oxygenSaturation: vitals.oxygenSaturation,
        weight: vitals.weight,
        height: vitals.height,
        painScore: vitals.painScore,
        glucose: vitals.glucose,
        notes: vitals.notes,
        abnormalFlags: [],
    };
    // Calculate BMI if height and weight available
    if (vitals.weight && vitals.height) {
        vitalSigns.bmi = calculateBMI(vitals.weight, vitals.height);
    }
    // Check for abnormal values
    const abnormalities = checkVitalAbnormalities(vitalSigns);
    vitalSigns.abnormalFlags = abnormalities;
    // Create alerts for critical abnormalities
    if (abnormalities.length > 0) {
        await createVitalSignsAlerts(patientId, encounterId, vitalSigns, abnormalities);
    }
    return vitalSigns;
}
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
function checkVitalAbnormalities(vitals) {
    const abnormalities = [];
    // Blood pressure
    if (vitals.bloodPressure) {
        const { systolic, diastolic } = vitals.bloodPressure;
        if (systolic >= 180 || diastolic >= 120) {
            abnormalities.push('hypertensive_crisis');
        }
        else if (systolic >= 140 || diastolic >= 90) {
            abnormalities.push('hypertension_stage2');
        }
        else if (systolic >= 130 || diastolic >= 80) {
            abnormalities.push('hypertension_stage1');
        }
        else if (systolic < 90 || diastolic < 60) {
            abnormalities.push('hypotension');
        }
    }
    // Heart rate
    if (vitals.heartRate && vitals.heartRate.value) {
        if (vitals.heartRate.value > 100) {
            abnormalities.push('tachycardia');
        }
        else if (vitals.heartRate.value < 60) {
            abnormalities.push('bradycardia');
        }
    }
    // Temperature
    if (vitals.temperature) {
        const tempF = vitals.temperature.unit === 'F'
            ? vitals.temperature.value
            : (vitals.temperature.value * 9 / 5) + 32;
        if (tempF >= 100.4) {
            abnormalities.push('fever');
        }
        else if (tempF < 95) {
            abnormalities.push('hypothermia');
        }
    }
    // Oxygen saturation
    if (vitals.oxygenSaturation && vitals.oxygenSaturation.value < 90) {
        abnormalities.push('hypoxemia');
    }
    // Respiratory rate
    if (vitals.respiratoryRate) {
        if (vitals.respiratoryRate > 20) {
            abnormalities.push('tachypnea');
        }
        else if (vitals.respiratoryRate < 12) {
            abnormalities.push('bradypnea');
        }
    }
    return abnormalities;
}
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
async function updateRoomingWorkflow(roomingId, updates) {
    const workflow = await getRoomingWorkflow(roomingId);
    const updated = {
        ...workflow,
        ...updates,
    };
    // Check if all required items completed
    if (updated.vitalSigns &&
        updated.chiefComplaint &&
        updated.allergiesReviewed &&
        updated.medicationsReviewed &&
        updated.medicalHistoryReviewed) {
        updated.status = WorkflowStatus.COMPLETED;
        updated.completedAt = new Date();
        // Notify provider that patient is ready
        await notifyProviderPatientReady(workflow.appointmentId);
    }
    return updated;
}
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
function calculateBMI(weight, height) {
    // Convert to metric
    const weightKg = weight.unit === 'lbs' ? weight.value * 0.453592 : weight.value;
    const heightM = height.unit === 'in' ? height.value * 0.0254 : height.value / 100;
    return weightKg / (heightM * heightM);
}
// ============================================================================
// SECTION 3: CLINICAL NOTE TEMPLATES AND DOCUMENTATION (Functions 12-17)
// ============================================================================
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
async function createNoteFromTemplate(templateId, encounterId, providerId) {
    const template = await getNoteTemplate(templateId);
    const encounter = await getEncounter(encounterId);
    const sections = {};
    template.sections.forEach(section => {
        sections[section.id] = section.content || '';
    });
    const note = {
        id: generateNoteId(),
        encounterId,
        patientId: encounter.patientId,
        providerId,
        templateId,
        noteType: template.noteType,
        sections,
        status: 'draft',
        createdAt: new Date(),
    };
    return note;
}
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
async function updateNoteSection(noteId, sectionId, content) {
    const note = await getClinicalNote(noteId);
    note.sections[sectionId] = content;
    note.updatedAt = new Date();
    return note;
}
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
async function expandSmartPhrases(text, specialty) {
    const smartPhrases = await getSmartPhrases(specialty);
    let expandedText = text;
    for (const phrase of smartPhrases) {
        const regex = new RegExp(`\\${phrase.shortcut}\\b`, 'g');
        expandedText = expandedText.replace(regex, phrase.expansion);
    }
    return expandedText;
}
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
async function signClinicalNote(noteId, providerId, signature) {
    const note = await getClinicalNote(noteId);
    // Validate note is complete
    if (note.status !== 'draft' && note.status !== 'pending_review') {
        throw new Error('Note cannot be signed in current status');
    }
    note.status = 'signed';
    note.signedAt = new Date();
    note.signedBy = providerId;
    note.metadata = {
        ...note.metadata,
        signature,
        signatureMethod: 'electronic',
    };
    // Note is now locked and cannot be edited
    // Any changes require amendment or addendum
    return note;
}
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
async function amendClinicalNote(noteId, sectionId, newContent, reason, providerId) {
    const note = await getClinicalNote(noteId);
    if (note.status !== 'signed') {
        throw new Error('Only signed notes can be amended');
    }
    const amendment = {
        id: generateAmendmentId(),
        reason,
        changedBy: providerId,
        changedAt: new Date(),
        originalContent: note.sections[sectionId],
        newContent,
    };
    note.amendments = note.amendments || [];
    note.amendments.push(amendment);
    note.sections[sectionId] = newContent;
    note.status = 'amended';
    return note;
}
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
async function addNoteAddendum(noteId, content, reason, providerId) {
    const note = await getClinicalNote(noteId);
    const addendum = {
        id: generateAddendumId(),
        content,
        addedBy: providerId,
        addedAt: new Date(),
        reason,
    };
    note.addendums = note.addendums || [];
    note.addendums.push(addendum);
    note.status = 'addended';
    return note;
}
// ============================================================================
// SECTION 4: ORDER ENTRY WORKFLOWS (Functions 18-23)
// ============================================================================
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
async function createLabOrder(encounterId, providerId, labDetails) {
    const encounter = await getEncounter(encounterId);
    const order = {
        id: generateOrderId(),
        encounterId,
        patientId: encounter.patientId,
        orderingProviderId: providerId,
        orderType: OrderType.LAB,
        status: OrderStatus.PENDING,
        priority: labDetails.urgency === 'stat' ? TaskPriority.STAT : TaskPriority.ROUTINE,
        orderDetails: labDetails,
        indication: '',
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    // Create task for specimen collection
    await createClinicalTask({
        title: 'Collect lab specimen',
        description: `Collect ${labDetails.specimenType} for ${labDetails.labTests.length} tests`,
        taskType: 'other',
        patientId: encounter.patientId,
        encounterId,
        assignedTo: 'phlebotomy_team',
        assignedBy: providerId,
        priority: order.priority,
        dueDate: labDetails.urgency === 'stat' ? new Date() : (0, date_fns_1.addDays)(new Date(), 1),
        status: WorkflowStatus.PENDING,
    });
    return order;
}
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
async function createImagingOrder(encounterId, providerId, imagingDetails) {
    const encounter = await getEncounter(encounterId);
    const order = {
        id: generateOrderId(),
        encounterId,
        patientId: encounter.patientId,
        orderingProviderId: providerId,
        orderType: OrderType.IMAGING,
        status: OrderStatus.PENDING,
        priority: TaskPriority.ROUTINE,
        orderDetails: imagingDetails,
        indication: imagingDetails.clinicalHistory,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    // Check for contrast allergy if contrast ordered
    if (imagingDetails.contrast) {
        const allergies = await getPatientAllergies(encounter.patientId);
        const contrastAllergy = allergies.find(a => a.allergen.toLowerCase().includes('contrast'));
        if (contrastAllergy) {
            order.alerts = [{
                    id: generateAlertId(),
                    alertType: 'contrast_allergy',
                    severity: AlertSeverity.CRITICAL,
                    patientId: encounter.patientId,
                    message: `Patient has documented contrast allergy: ${contrastAllergy.reaction}`,
                    details: contrastAllergy,
                    triggeredAt: new Date(),
                    triggeredBy: 'system',
                    routedTo: [providerId],
                    acknowledged: false,
                    resolved: false,
                }];
        }
    }
    return order;
}
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
async function updateOrderStatus(orderId, status, metadata) {
    const order = await getClinicalOrder(orderId);
    order.status = status;
    order.updatedAt = new Date();
    order.metadata = { ...order.metadata, ...metadata };
    // If completed, check for critical results
    if (status === OrderStatus.COMPLETED || status === OrderStatus.RESULTED) {
        await checkOrderForCriticalResults(order);
    }
    return order;
}
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
async function recordOrderResults(orderId, results) {
    const order = await getClinicalOrder(orderId);
    order.results = results;
    order.status = OrderStatus.RESULTED;
    order.completedDate = new Date();
    // Check for critical results
    const criticalResults = results.filter(r => r.abnormalFlag === 'critical_low' || r.abnormalFlag === 'critical_high');
    if (criticalResults.length > 0) {
        await createCriticalResultAlerts(order, criticalResults);
    }
    // Create task for provider to review
    await createClinicalTask({
        title: 'Review order results',
        description: `Results available for ${order.orderType} order`,
        taskType: 'lab_review',
        patientId: order.patientId,
        encounterId: order.encounterId,
        assignedTo: order.orderingProviderId,
        assignedBy: 'system',
        priority: criticalResults.length > 0 ? TaskPriority.STAT : TaskPriority.ROUTINE,
        dueDate: criticalResults.length > 0 ? new Date() : (0, date_fns_1.addDays)(new Date(), 1),
        status: WorkflowStatus.PENDING,
        relatedOrders: [orderId],
    });
    return order;
}
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
async function discontinueOrder(orderId, reason, providerId) {
    const order = await getClinicalOrder(orderId);
    order.status = OrderStatus.DISCONTINUED;
    order.updatedAt = new Date();
    order.metadata = {
        ...order.metadata,
        discontinuedBy: providerId,
        discontinuedAt: new Date(),
        discontinuationReason: reason,
    };
    return order;
}
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
async function validateOrderAgainstCDS(order) {
    const warnings = [];
    const recommendations = [];
    let requiresOverride = false;
    // Check for duplicate orders
    const recentOrders = await getRecentOrders(order.patientId, order.orderType);
    const duplicates = recentOrders.filter(o => JSON.stringify(o.orderDetails) === JSON.stringify(order.orderDetails));
    if (duplicates.length > 0) {
        warnings.push('Duplicate order detected within last 30 days');
        recommendations.push('Consider reviewing recent results before proceeding');
    }
    // Check appropriateness criteria for imaging
    if (order.orderType === OrderType.IMAGING) {
        const appropriateness = await checkImagingAppropriatenessCriteria(order);
        if (!appropriateness.appropriate) {
            warnings.push(`Imaging may not be appropriate: ${appropriateness.reason}`);
            recommendations.push(appropriateness.alternativeRecommendation);
            requiresOverride = true;
        }
    }
    return {
        approved: !requiresOverride,
        warnings,
        recommendations,
        requiresOverride,
    };
}
// ============================================================================
// SECTION 5: REFERRAL WORKFLOWS (Functions 24-27)
// ============================================================================
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
async function createReferral(patientId, referringProviderId, referralDetails) {
    const referral = {
        id: generateReferralId(),
        patientId,
        referringProviderId,
        referralDate: new Date(),
        specialtyNeeded: referralDetails.specialtyNeeded,
        urgency: referralDetails.urgency || TaskPriority.ROUTINE,
        reason: referralDetails.reason,
        clinicalSummary: referralDetails.clinicalSummary,
        icd10Codes: referralDetails.icd10Codes || [],
        authorizationRequired: referralDetails.authorizationRequired || false,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    // Create task to obtain authorization if required
    if (referral.authorizationRequired) {
        await createClinicalTask({
            title: 'Obtain referral authorization',
            description: `Authorization needed for ${referral.specialtyNeeded} referral`,
            taskType: 'authorization',
            patientId,
            assignedTo: 'authorization_team',
            assignedBy: referringProviderId,
            priority: referral.urgency,
            dueDate: referral.urgency === TaskPriority.STAT ? new Date() : (0, date_fns_1.addDays)(new Date(), 3),
            status: WorkflowStatus.PENDING,
        });
    }
    return referral;
}
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
async function updateReferralStatus(referralId, update) {
    const referral = await getReferral(referralId);
    const updated = {
        ...referral,
        ...update,
        updatedAt: new Date(),
    };
    // Notify referring provider of status change
    if (update.status === 'scheduled' || update.status === 'completed') {
        await notifyProviderOfReferralUpdate(referral.referringProviderId, updated);
    }
    return updated;
}
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
async function requestReferralAuthorization(referralId) {
    const referral = await getReferral(referralId);
    // Integration with insurance authorization system
    // This would make real-time authorization request via X12 278 transaction
    return {
        approved: true,
        authorizationNumber: `AUTH-${Date.now()}`,
        expirationDate: (0, date_fns_1.addDays)(new Date(), 90),
    };
}
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
async function completeReferral(referralId, feedback) {
    const referral = await getReferral(referralId);
    referral.status = 'completed';
    referral.completedDate = new Date();
    referral.feedback = feedback;
    referral.updatedAt = new Date();
    // Create task for referring provider to review feedback
    await createClinicalTask({
        title: 'Review referral feedback',
        description: `Specialist feedback received for ${referral.specialtyNeeded} referral`,
        taskType: 'follow_up',
        patientId: referral.patientId,
        assignedTo: referral.referringProviderId,
        assignedBy: 'system',
        priority: TaskPriority.ROUTINE,
        dueDate: (0, date_fns_1.addDays)(new Date(), 2),
        status: WorkflowStatus.PENDING,
    });
    return referral;
}
// ============================================================================
// SECTION 6: E-PRESCRIBING WORKFLOWS (Functions 28-31)
// ============================================================================
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
async function createPrescription(patientId, providerId, prescriptionData) {
    const prescription = {
        id: generatePrescriptionId(),
        patientId,
        providerId,
        medicationName: prescriptionData.medicationName,
        rxNormCode: prescriptionData.rxNormCode,
        ndcCode: prescriptionData.ndcCode,
        dosage: prescriptionData.dosage,
        route: prescriptionData.route,
        frequency: prescriptionData.frequency,
        duration: prescriptionData.duration,
        quantity: prescriptionData.quantity,
        refills: prescriptionData.refills,
        substitutionAllowed: prescriptionData.substitutionAllowed !== false,
        status: PrescriptionStatus.DRAFT,
        prescribedDate: new Date(),
        indication: prescriptionData.indication,
        instructions: prescriptionData.instructions,
        controlledSubstance: prescriptionData.controlledSubstance || false,
        controlledSubstanceSchedule: prescriptionData.controlledSubstanceSchedule,
        alerts: [],
    };
    // Perform drug safety checks
    const safetyChecks = await performDrugSafetyChecks(patientId, prescription);
    prescription.alerts = safetyChecks;
    return prescription;
}
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
async function performDrugSafetyChecks(patientId, prescription) {
    const alerts = [];
    // Check for drug allergies
    const allergies = await getPatientAllergies(patientId);
    const allergyMatch = allergies.find(a => a.allergen.toLowerCase().includes(prescription.medicationName.toLowerCase()));
    if (allergyMatch) {
        alerts.push({
            id: generateAlertId(),
            alertType: 'allergy',
            severity: AlertSeverity.CRITICAL,
            message: `Patient allergic to ${allergyMatch.allergen}: ${allergyMatch.reaction}`,
            source: 'patient_allergies',
            overridden: false,
        });
    }
    // Check for drug-drug interactions
    const activeMedications = await getPatientActiveMedications(patientId);
    for (const med of activeMedications) {
        const interaction = await checkDrugInteraction(prescription.medicationName, med.medicationName);
        if (interaction) {
            alerts.push({
                id: generateAlertId(),
                alertType: 'interaction',
                severity: interaction.severity,
                message: `Interaction with ${med.medicationName}: ${interaction.description}`,
                source: 'drug_interaction_database',
                overridden: false,
            });
        }
    }
    // Check for duplicate therapy
    const duplicate = activeMedications.find(m => m.medicationName.toLowerCase() === prescription.medicationName.toLowerCase());
    if (duplicate) {
        alerts.push({
            id: generateAlertId(),
            alertType: 'duplicate',
            severity: AlertSeverity.HIGH,
            message: `Patient already taking ${duplicate.medicationName}`,
            source: 'active_medications',
            overridden: false,
        });
    }
    return alerts;
}
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
async function sendPrescriptionToPharmacy(prescriptionId, pharmacyId) {
    const prescription = await getPrescription(prescriptionId);
    if (prescription.status !== PrescriptionStatus.APPROVED) {
        throw new Error('Prescription must be approved before sending');
    }
    // Send via NCPDP SCRIPT standard to pharmacy
    prescription.pharmacyId = pharmacyId;
    prescription.status = PrescriptionStatus.SENT;
    prescription.sentToPharmacyAt = new Date();
    // Notify patient
    await notifyPatientPrescriptionSent(prescription.patientId, pharmacyId);
    return prescription;
}
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
async function prescribeControlledSubstance(prescription, providerSignature) {
    if (!prescription.controlledSubstance) {
        throw new Error('Not a controlled substance prescription');
    }
    // Verify EPCS two-factor authentication
    const epcsVerified = await verifyEPCSSignature(providerSignature);
    if (!epcsVerified) {
        throw new Error('EPCS signature verification failed');
    }
    prescription.signature = providerSignature;
    prescription.signedAt = new Date();
    prescription.status = PrescriptionStatus.APPROVED;
    // Check PDMP (Prescription Drug Monitoring Program)
    const pdmpData = await checkPDMP(prescription.patientId);
    prescription.metadata = {
        ...prescription.metadata,
        pdmpChecked: true,
        pdmpCheckDate: new Date(),
        pdmpData,
    };
    return prescription;
}
// ============================================================================
// SECTION 7: CLINICAL TASK MANAGEMENT (Functions 32-35)
// ============================================================================
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
async function createClinicalTask(taskData) {
    const task = {
        id: generateTaskId(),
        title: taskData.title,
        description: taskData.description,
        taskType: taskData.taskType,
        patientId: taskData.patientId,
        encounterId: taskData.encounterId,
        assignedTo: taskData.assignedTo,
        assignedBy: taskData.assignedBy,
        priority: taskData.priority || TaskPriority.ROUTINE,
        dueDate: taskData.dueDate,
        status: WorkflowStatus.PENDING,
        relatedOrders: taskData.relatedOrders,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    // Send notification to assignee
    await sendNotification(task.assignedTo, {
        type: 'task_assigned',
        title: 'New Clinical Task',
        message: task.title,
        taskId: task.id,
        priority: task.priority,
    });
    return task;
}
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
async function reassignTask(taskId, newAssignee, assignedBy) {
    const task = await getClinicalTask(taskId);
    const previousAssignee = task.assignedTo;
    task.assignedTo = newAssignee;
    task.assignedBy = assignedBy;
    task.updatedAt = new Date();
    // Notify new assignee
    await sendNotification(newAssignee, {
        type: 'task_assigned',
        title: 'Task Reassigned to You',
        message: task.title,
        taskId: task.id,
        priority: task.priority,
    });
    // Notify previous assignee
    await sendNotification(previousAssignee, {
        type: 'task_reassigned',
        title: 'Task Reassigned',
        message: `${task.title} reassigned to ${newAssignee}`,
        taskId: task.id,
        priority: 'normal',
    });
    return task;
}
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
async function completeTask(taskId, completedBy, notes) {
    const task = await getClinicalTask(taskId);
    task.status = WorkflowStatus.COMPLETED;
    task.completedAt = new Date();
    task.completedBy = completedBy;
    task.notes = notes;
    task.updatedAt = new Date();
    return task;
}
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
async function getOverdueTasks(userId) {
    const now = new Date();
    const tasks = await getTasksAssignedTo(userId);
    return tasks.filter(task => task.status !== WorkflowStatus.COMPLETED &&
        task.status !== WorkflowStatus.CANCELLED &&
        task.dueDate < now);
}
// ============================================================================
// SECTION 8: CLINICAL PATHWAYS AND PROTOCOLS (Functions 36-38)
// ============================================================================
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
async function activateClinicalPathway(patientId, pathwayId, encounterId) {
    const pathway = await getClinicalPathway(pathwayId);
    const instance = {
        id: generatePathwayInstanceId(),
        pathwayId,
        patientId,
        encounterId,
        activatedAt: new Date(),
        currentStep: 0,
        completedSteps: [],
        status: 'active',
    };
    // Create initial tasks/orders based on pathway
    for (const step of pathway.steps) {
        if (step.required && step.triggerCondition === 'immediate') {
            await executePathwayActions(step.actions, patientId, encounterId);
        }
    }
    return instance;
}
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
async function advancePathwayStep(pathwayInstanceId, stepCompleted) {
    const instance = await getPathwayInstance(pathwayInstanceId);
    if (stepCompleted) {
        instance.completedSteps.push(instance.currentStep);
        instance.currentStep++;
        // Execute next step actions
        const pathway = await getClinicalPathway(instance.pathwayId);
        const nextStep = pathway.steps[instance.currentStep];
        if (nextStep) {
            await executePathwayActions(nextStep.actions, instance.patientId, instance.encounterId);
        }
        else {
            instance.status = 'completed';
            instance.completedAt = new Date();
        }
    }
    return instance;
}
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
async function validatePathwayCompliance(pathwayInstanceId) {
    const instance = await getPathwayInstance(pathwayInstanceId);
    const pathway = await getClinicalPathway(instance.pathwayId);
    const requiredSteps = pathway.steps.filter(s => s.required);
    const completedRequiredSteps = instance.completedSteps.filter((stepIndex) => pathway.steps[stepIndex].required);
    return {
        complianceRate: (completedRequiredSteps.length / requiredSteps.length) * 100,
        totalSteps: pathway.steps.length,
        completedSteps: instance.completedSteps.length,
        requiredSteps: requiredSteps.length,
        completedRequiredSteps: completedRequiredSteps.length,
        missedSteps: requiredSteps.filter((_, index) => !instance.completedSteps.includes(index)),
    };
}
// ============================================================================
// SECTION 9: HANDOFF AND SAFETY PROTOCOLS (Functions 39-42)
// ============================================================================
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
async function initiatePatientHandoff(patientId, fromProviderId, toProviderId, handoffData) {
    const handoff = {
        id: generateHandoffId(),
        fromProviderId,
        toProviderId,
        patientId,
        encounterId: handoffData.encounterId,
        handoffType: handoffData.handoffType,
        iPassComponents: {
            illness_severity: handoffData.iPassComponents?.illness_severity || '',
            patient_summary: handoffData.iPassComponents?.patient_summary || '',
            action_list: handoffData.iPassComponents?.action_list || [],
            situation_awareness: handoffData.iPassComponents?.situation_awareness || '',
            synthesis: '',
        },
        criticalInformation: handoffData.criticalInformation || [],
        pendingTasks: handoffData.pendingTasks || [],
        handoffTime: new Date(),
        acknowledged: false,
    };
    // Notify receiving provider
    await sendNotification(toProviderId, {
        type: 'handoff_pending',
        title: 'Patient Handoff Pending',
        message: `Handoff from ${fromProviderId} requires acknowledgment`,
        priority: 'high',
    });
    return handoff;
}
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
async function acknowledgeHandoff(handoffId, providerId, synthesis) {
    const handoff = await getHandoffProtocol(handoffId);
    if (handoff.toProviderId !== providerId) {
        throw new Error('Only receiving provider can acknowledge handoff');
    }
    handoff.acknowledged = true;
    handoff.acknowledgedBy = providerId;
    handoff.acknowledgedAt = new Date();
    handoff.iPassComponents.synthesis = synthesis;
    return handoff;
}
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
async function performTimeOutChecklist(procedureId, patientId, teamMembers) {
    const checklist = {
        id: generateTimeOutId(),
        procedureId,
        patientId,
        performedAt: new Date(),
        performedBy: teamMembers[0], // Lead surgeon typically
        items: [
            { id: '1', item: 'Correct patient identity verified', verified: false, verifiedBy: '', verifiedAt: new Date() },
            { id: '2', item: 'Correct procedure verified', verified: false, verifiedBy: '', verifiedAt: new Date() },
            { id: '3', item: 'Correct site/laterality marked', verified: false, verifiedBy: '', verifiedAt: new Date() },
            { id: '4', item: 'All team members introduced', verified: false, verifiedBy: '', verifiedAt: new Date() },
            { id: '5', item: 'Antibiotics administered if indicated', verified: false, verifiedBy: '', verifiedAt: new Date() },
            { id: '6', item: 'Essential imaging reviewed', verified: false, verifiedBy: '', verifiedAt: new Date() },
            { id: '7', item: 'Anesthesia safety check complete', verified: false, verifiedBy: '', verifiedAt: new Date() },
            { id: '8', item: 'Equipment and implants available', verified: false, verifiedBy: '', verifiedAt: new Date() },
        ],
        allItemsVerified: false,
        teamMembers,
        signedBy: [],
    };
    return checklist;
}
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
async function routeClinicalAlert(alertData) {
    const alert = {
        id: generateAlertId(),
        alertType: alertData.alertType,
        severity: alertData.severity,
        patientId: alertData.patientId,
        encounterId: alertData.encounterId,
        message: alertData.message,
        details: alertData.details,
        triggeredAt: new Date(),
        triggeredBy: alertData.triggeredBy || 'system',
        routedTo: [],
        acknowledged: false,
        resolved: false,
    };
    // Determine routing based on alert type and severity
    const routing = await determineAlertRouting(alert);
    alert.routedTo = routing;
    // Send notifications
    for (const recipient of routing) {
        await sendNotification(recipient, {
            type: 'clinical_alert',
            title: `${alert.severity.toUpperCase()} Alert`,
            message: alert.message,
            alertId: alert.id,
            priority: alert.severity === AlertSeverity.CRITICAL ? 'urgent' : 'high',
        });
    }
    return alert;
}
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
function generateCheckInId() { return `checkin-${Date.now()}`; }
function generateCheckOutId() { return `checkout-${Date.now()}`; }
function generateRoomingId() { return `rooming-${Date.now()}`; }
function generateVitalsId() { return `vitals-${Date.now()}`; }
function generateNoteId() { return `note-${Date.now()}`; }
function generateAmendmentId() { return `amend-${Date.now()}`; }
function generateAddendumId() { return `addendum-${Date.now()}`; }
function generateOrderId() { return `order-${Date.now()}`; }
function generateReferralId() { return `referral-${Date.now()}`; }
function generatePrescriptionId() { return `rx-${Date.now()}`; }
function generateTaskId() { return `task-${Date.now()}`; }
function generatePathwayInstanceId() { return `pathway-inst-${Date.now()}`; }
function generateHandoffId() { return `handoff-${Date.now()}`; }
function generateTimeOutId() { return `timeout-${Date.now()}`; }
function generateAlertId() { return `alert-${Date.now()}`; }
function generatePaymentConfirmation() { return `PAY-${Date.now()}`; }
// Placeholder async functions
async function getAppointment(id) { return {}; }
async function updateAppointmentStatus(id, status) { }
async function triggerRoomingWorkflow(appointmentId) { }
async function sendPostVisitSurvey(patientId, appointmentId) { }
async function getFormStatus(patientId, formId) { return {}; }
async function sendNotification(userId, notification) { }
async function getRoomingWorkflow(id) { return {}; }
async function notifyProviderPatientReady(appointmentId) { }
async function createVitalSignsAlerts(patientId, encounterId, vitals, abnormalities) { }
async function getNoteTemplate(id) { return {}; }
async function getEncounter(id) { return {}; }
async function getClinicalNote(id) { return {}; }
async function getSmartPhrases(specialty) { return []; }
async function getClinicalOrder(id) { return {}; }
async function checkOrderForCriticalResults(order) { }
async function createCriticalResultAlerts(order, results) { }
async function getRecentOrders(patientId, orderType) { return []; }
async function checkImagingAppropriatenessCriteria(order) { return {}; }
async function getPatientAllergies(patientId) { return []; }
async function getReferral(id) { return {}; }
async function notifyProviderOfReferralUpdate(providerId, referral) { }
async function getPrescription(id) { return {}; }
async function getPatientActiveMedications(patientId) { return []; }
async function checkDrugInteraction(drug1, drug2) { return null; }
async function verifyEPCSSignature(signature) { return true; }
async function checkPDMP(patientId) { return {}; }
async function notifyPatientPrescriptionSent(patientId, pharmacyId) { }
async function getClinicalTask(id) { return {}; }
async function getTasksAssignedTo(userId) { return []; }
async function getClinicalPathway(id) { return {}; }
async function executePathwayActions(actions, patientId, encounterId) { }
async function getPathwayInstance(id) { return {}; }
async function getHandoffProtocol(id) { return {}; }
async function determineAlertRouting(alert) { return []; }
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Check-in and Check-out
    processPatientCheckIn,
    processPatientCheckOut,
    verifyInsuranceEligibility,
    collectPatientForms,
    collectCopayment,
    notifyStaffOfCheckIn,
    // Rooming and Vital Signs
    initiateRoomingWorkflow,
    captureVitalSigns,
    checkVitalAbnormalities,
    updateRoomingWorkflow,
    calculateBMI,
    // Clinical Documentation
    createNoteFromTemplate,
    updateNoteSection,
    expandSmartPhrases,
    signClinicalNote,
    amendClinicalNote,
    addNoteAddendum,
    // Order Entry
    createLabOrder,
    createImagingOrder,
    updateOrderStatus,
    recordOrderResults,
    discontinueOrder,
    validateOrderAgainstCDS,
    // Referrals
    createReferral,
    updateReferralStatus,
    requestReferralAuthorization,
    completeReferral,
    // E-Prescribing
    createPrescription,
    performDrugSafetyChecks,
    sendPrescriptionToPharmacy,
    prescribeControlledSubstance,
    // Task Management
    createClinicalTask,
    reassignTask,
    completeTask,
    getOverdueTasks,
    // Clinical Pathways
    activateClinicalPathway,
    advancePathwayStep,
    validatePathwayCompliance,
    // Handoff and Safety
    initiatePatientHandoff,
    acknowledgeHandoff,
    performTimeOutChecklist,
    routeClinicalAlert,
};
//# sourceMappingURL=health-clinical-workflows-kit.js.map