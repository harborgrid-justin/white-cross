/**
 * LOC: C1L2I3N4D5
 * File: /reuse/server/health/health-clinical-documentation-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (v6.x)
 *   - crypto (Node.js native)
 *   - @types/validator (v13.x)
 *
 * DOWNSTREAM (imported by):
 *   - Clinical documentation services
 *   - Provider documentation workflows
 *   - CDI (Clinical Documentation Improvement) systems
 *   - Medical transcription services
 */
/**
 * File: /reuse/server/health/health-clinical-documentation-kit.ts
 * Locator: WC-HLTH-CLIN-DOC-001
 * Purpose: Clinical Documentation Management - Comprehensive clinical note and documentation utilities
 *
 * Upstream: sequelize v6.x, crypto, @types/validator
 * Downstream: Clinical documentation services, provider workflows, CDI systems, transcription services
 * Dependencies: Sequelize v6.x, Node 18+, TypeScript 5.x, PostgreSQL 14+
 * Exports: 40 clinical documentation functions for SOAP notes, progress notes, consultation notes, discharge summaries, operative reports, clinical templates, voice-to-text, CDI workflows, addendums, amendments, co-signatures, and attestation
 *
 * LLM Context: Production-grade clinical documentation utilities for White Cross healthcare platform.
 * Provides comprehensive Epic EHR-level functionality including SOAP note builders, specialized clinical
 * note types (progress, consultation, discharge, operative), clinical template and macro systems,
 * voice-to-text dictation integration, clinical documentation improvement (CDI) workflows, addendum
 * and amendment tracking, co-signature workflows, and provider attestation. HIPAA-compliant with
 * field-level encryption for all clinical content, comprehensive audit trails, documentation compliance
 * checks, and regulatory requirement tracking for Joint Commission, CMS, and meaningful use.
 */
import { Sequelize } from 'sequelize';
/**
 * SOAP Note interface (Subjective, Objective, Assessment, Plan)
 */
export interface SoapNote {
    id: string;
    patientId: string;
    encounterId: string;
    providerId: string;
    facilityId: string;
    encounterDate: Date;
    subjective?: {
        chiefComplaint?: string;
        historyOfPresentIllness?: string;
        reviewOfSystems?: any;
        pastMedicalHistory?: string[];
        medications?: string[];
        allergies?: string[];
        socialHistory?: any;
        familyHistory?: string[];
    };
    objective?: {
        vitalSigns?: any;
        physicalExam?: any;
        labResults?: any[];
        imagingResults?: any[];
        otherFindings?: any;
    };
    assessment?: {
        diagnoses?: Array<{
            code: string;
            description: string;
            type: 'primary' | 'secondary';
        }>;
        clinicalImpression?: string;
        differentialDiagnoses?: string[];
    };
    plan?: {
        treatments?: string[];
        medications?: any[];
        procedures?: string[];
        referrals?: string[];
        patientEducation?: string;
        followUp?: string;
        disposition?: string;
    };
    status: 'draft' | 'in-progress' | 'completed' | 'signed' | 'amended';
    completedAt?: Date;
    signedAt?: Date;
    signedBy?: string;
    metadata?: any;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Progress Note interface
 */
export interface ProgressNote {
    id: string;
    patientId: string;
    encounterId: string;
    providerId: string;
    noteDate: Date;
    noteType: 'admission' | 'daily' | 'interim' | 'discharge' | 'other';
    content: {
        interval?: string;
        events?: string;
        currentStatus?: string;
        assessment?: string;
        plan?: string;
    };
    status: 'draft' | 'final' | 'amended';
    signedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Consultation Note interface
 */
export interface ConsultationNote {
    id: string;
    patientId: string;
    encounterId: string;
    requestingProviderId: string;
    consultingProviderId: string;
    specialty: string;
    consultDate: Date;
    reason: string;
    findings: string;
    recommendations: string[];
    urgency: 'routine' | 'urgent' | 'stat';
    status: 'requested' | 'in-progress' | 'completed' | 'signed';
    completedAt?: Date;
    signedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Discharge Summary interface
 */
export interface DischargeSummary {
    id: string;
    patientId: string;
    encounterId: string;
    providerId: string;
    admissionDate: Date;
    dischargeDate: Date;
    lengthOfStay: number;
    admissionDiagnosis: string;
    dischargeDiagnosis: string[];
    hospitalCourse: string;
    proceduresPerformed?: string[];
    complications?: string[];
    dischargeMedications?: any[];
    dischargeDisposition: string;
    dischargeInstructions: string;
    followUpCare: string;
    status: 'draft' | 'final' | 'signed';
    signedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Operative Report interface
 */
export interface OperativeReport {
    id: string;
    patientId: string;
    encounterId: string;
    surgeonId: string;
    assistantIds?: string[];
    anesthesiologistId?: string;
    procedureDate: Date;
    preoperativeDiagnosis: string;
    postoperativeDiagnosis: string;
    procedurePerformed: string[];
    cptCodes?: string[];
    anesthesiaType: string;
    findings: string;
    description: string;
    specimens?: string[];
    complications?: string[];
    estimatedBloodLoss?: number;
    disposition: string;
    status: 'draft' | 'preliminary' | 'final' | 'signed';
    signedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Clinical Template interface
 */
export interface ClinicalTemplate {
    id: string;
    name: string;
    description?: string;
    specialty?: string;
    category: 'soap' | 'progress' | 'consultation' | 'discharge' | 'operative' | 'other';
    structure: any;
    macros?: Record<string, string>;
    active: boolean;
    createdBy: string;
    version: number;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Dictation Session interface
 */
export interface DictationSession {
    id: string;
    providerId: string;
    patientId: string;
    noteType: string;
    status: 'recording' | 'processing' | 'completed' | 'error';
    audioUrl?: string;
    transcription?: string;
    confidence?: number;
    startedAt: Date;
    completedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * CDI Query interface
 */
export interface CdiQuery {
    id: string;
    patientId: string;
    encounterId: string;
    noteId: string;
    cdiSpecialistId: string;
    providerId: string;
    queryType: 'diagnosis' | 'procedure' | 'severity' | 'complication' | 'other';
    question: string;
    context: string;
    response?: string;
    responseDate?: Date;
    status: 'open' | 'responded' | 'agreed' | 'disagreed' | 'clarified';
    impact?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Note Addendum interface
 */
export interface NoteAddendum {
    id: string;
    originalNoteId: string;
    noteType: string;
    addendumText: string;
    reason: string;
    addedBy: string;
    addedAt: Date;
    createdAt: Date;
}
/**
 * Note Amendment interface
 */
export interface NoteAmendment {
    id: string;
    originalNoteId: string;
    noteType: string;
    amendmentText: string;
    reason: string;
    originalText?: string;
    amendedBy: string;
    amendedAt: Date;
    approvedBy?: string;
    approvedAt?: Date;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Co-signature Request interface
 */
export interface CoSignatureRequest {
    id: string;
    noteId: string;
    noteType: string;
    requestingProviderId: string;
    coSignerProviderId: string;
    requestReason?: string;
    status: 'pending' | 'signed' | 'declined';
    requestedAt: Date;
    signedAt?: Date;
    comments?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Attestation interface
 */
export interface Attestation {
    id: string;
    noteId: string;
    noteType: string;
    providerId: string;
    attestationType: 'authorship' | 'review' | 'accuracy' | 'billing';
    attestationText: string;
    attestedAt: Date;
    signature?: string;
    metadata?: any;
    createdAt: Date;
}
/**
 * Audit context for operations
 */
export interface AuditContext {
    userId: string;
    ipAddress?: string;
    userAgent?: string;
    facilityId?: string;
    reason?: string;
}
/**
 * Documentation compliance check result
 */
export interface ComplianceCheckResult {
    compliant: boolean;
    score: number;
    issues: Array<{
        category: string;
        severity: 'critical' | 'warning' | 'info';
        message: string;
        field?: string;
    }>;
    recommendations: string[];
}
/**
 * Creates a structured SOAP note with sections for Subjective, Objective, Assessment, and Plan.
 * Implements comprehensive clinical documentation standards.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Partial<SoapNote>} noteData - SOAP note data
 * @param {AuditContext} auditContext - Audit context
 * @returns {Promise<SoapNote>} Created SOAP note
 *
 * @example
 * ```typescript
 * const soapNote = await createSoapNote(sequelize, {
 *   patientId: 'patient-uuid',
 *   encounterId: 'encounter-uuid',
 *   providerId: 'provider-uuid',
 *   facilityId: 'facility-uuid',
 *   encounterDate: new Date(),
 *   subjective: {
 *     chiefComplaint: 'Chest pain for 2 hours',
 *     historyOfPresentIllness: 'Patient reports substernal chest pressure...',
 *     reviewOfSystems: { cardiovascular: 'chest pain, no palpitations', respiratory: 'no SOB' }
 *   },
 *   objective: {
 *     vitalSigns: { bp: '140/90', hr: 88, temp: 98.6, rr: 16, o2sat: 98 },
 *     physicalExam: { cardiovascular: 'Regular rate and rhythm, no murmurs' }
 *   },
 *   assessment: {
 *     diagnoses: [{ code: 'I20.0', description: 'Unstable angina', type: 'primary' }],
 *     clinicalImpression: 'Likely acute coronary syndrome'
 *   },
 *   plan: {
 *     treatments: ['Aspirin 325mg PO', 'Nitroglycerin SL PRN'],
 *     followUp: 'Cardiology consult, stress test'
 *   }
 * }, auditContext);
 * ```
 */
export declare function createSoapNote(sequelize: Sequelize, noteData: Partial<SoapNote>, auditContext: AuditContext): Promise<SoapNote>;
/**
 * Updates SOAP note sections with validation and audit trail.
 * Supports partial updates to individual SOAP sections.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} noteId - SOAP note ID
 * @param {Partial<SoapNote>} updates - Fields to update
 * @param {AuditContext} auditContext - Audit context
 * @returns {Promise<SoapNote>} Updated SOAP note
 *
 * @example
 * ```typescript
 * const updated = await updateSoapNote(sequelize, 'soap-note-uuid', {
 *   assessment: {
 *     diagnoses: [
 *       { code: 'I20.0', description: 'Unstable angina', type: 'primary' },
 *       { code: 'E11.9', description: 'Type 2 diabetes', type: 'secondary' }
 *     ],
 *     clinicalImpression: 'ACS with comorbid diabetes'
 *   },
 *   plan: {
 *     treatments: ['Aspirin 325mg PO', 'Nitroglycerin SL PRN', 'Metformin 500mg BID'],
 *     procedures: ['Cardiac catheterization'],
 *     followUp: 'Cardiology admission'
 *   }
 * }, auditContext);
 * ```
 */
export declare function updateSoapNote(sequelize: Sequelize, noteId: string, updates: Partial<SoapNote>, auditContext: AuditContext): Promise<SoapNote>;
/**
 * Validates SOAP note for completeness and documentation standards.
 * Checks required fields, clinical logic, and compliance requirements.
 *
 * @param {Partial<SoapNote>} noteData - SOAP note to validate
 * @returns {Promise<ComplianceCheckResult>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateSoapNote(soapNote);
 * if (!validation.compliant) {
 *   validation.issues.forEach(issue => {
 *     console.error(`${issue.severity}: ${issue.message}`);
 *   });
 * }
 * ```
 */
export declare function validateSoapNote(noteData: Partial<SoapNote>): Promise<ComplianceCheckResult>;
/**
 * Finalizes and locks a SOAP note for signature.
 * Validates completeness and marks note as ready for provider signature.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} noteId - SOAP note ID
 * @param {AuditContext} auditContext - Audit context
 * @returns {Promise<SoapNote>} Finalized SOAP note
 *
 * @example
 * ```typescript
 * const finalized = await finalizeSoapNote(sequelize, 'soap-note-uuid', {
 *   userId: 'provider-uuid',
 *   ipAddress: '192.168.1.100'
 * });
 * ```
 */
export declare function finalizeSoapNote(sequelize: Sequelize, noteId: string, auditContext: AuditContext): Promise<SoapNote>;
/**
 * Retrieves a SOAP note with automatic content decryption.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} noteId - SOAP note ID
 * @param {AuditContext} auditContext - Audit context
 * @returns {Promise<SoapNote | null>} SOAP note
 *
 * @example
 * ```typescript
 * const note = await retrieveSoapNote(sequelize, 'soap-note-uuid', auditContext);
 * console.log(note.subjective.chiefComplaint);
 * ```
 */
export declare function retrieveSoapNote(sequelize: Sequelize, noteId: string, auditContext: AuditContext): Promise<SoapNote | null>;
/**
 * Searches SOAP notes by criteria with full-text search support.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {any} searchCriteria - Search parameters
 * @param {AuditContext} auditContext - Audit context
 * @returns {Promise<SoapNote[]>} Matching SOAP notes
 *
 * @example
 * ```typescript
 * const notes = await searchSoapNotes(sequelize, {
 *   patientId: 'patient-uuid',
 *   dateRange: { start: '2024-01-01', end: '2024-12-31' },
 *   diagnosisCode: 'I20.0',
 *   providerId: 'provider-uuid'
 * }, auditContext);
 * ```
 */
export declare function searchSoapNotes(sequelize: Sequelize, searchCriteria: any, auditContext: AuditContext): Promise<SoapNote[]>;
/**
 * Creates a progress note for inpatient or ongoing care documentation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Partial<ProgressNote>} noteData - Progress note data
 * @param {AuditContext} auditContext - Audit context
 * @returns {Promise<ProgressNote>} Created progress note
 *
 * @example
 * ```typescript
 * const progressNote = await createProgressNote(sequelize, {
 *   patientId: 'patient-uuid',
 *   encounterId: 'encounter-uuid',
 *   providerId: 'provider-uuid',
 *   noteDate: new Date(),
 *   noteType: 'daily',
 *   content: {
 *     interval: 'Past 24 hours',
 *     events: 'Patient stable overnight, tolerating PO intake',
 *     currentStatus: 'Afebrile, vital signs stable',
 *     assessment: 'Improving post-operative course',
 *     plan: 'Continue antibiotics, advance diet, PT consult'
 *   }
 * }, auditContext);
 * ```
 */
export declare function createProgressNote(sequelize: Sequelize, noteData: Partial<ProgressNote>, auditContext: AuditContext): Promise<ProgressNote>;
/**
 * Updates progress note with amendments.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} noteId - Progress note ID
 * @param {Partial<ProgressNote>} updates - Fields to update
 * @param {AuditContext} auditContext - Audit context
 * @returns {Promise<ProgressNote>} Updated progress note
 *
 * @example
 * ```typescript
 * const updated = await updateProgressNote(sequelize, 'progress-note-uuid', {
 *   content: {
 *     assessment: 'Patient showing signs of infection - fever 101.5°F',
 *     plan: 'Blood cultures obtained, broaden antibiotics to vancomycin + zosyn'
 *   }
 * }, auditContext);
 * ```
 */
export declare function updateProgressNote(sequelize: Sequelize, noteId: string, updates: Partial<ProgressNote>, auditContext: AuditContext): Promise<ProgressNote>;
/**
 * Finalizes and signs a progress note.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} noteId - Progress note ID
 * @param {AuditContext} auditContext - Audit context
 * @returns {Promise<ProgressNote>} Finalized progress note
 *
 * @example
 * ```typescript
 * const finalized = await finalizeProgressNote(sequelize, 'progress-note-uuid', auditContext);
 * ```
 */
export declare function finalizeProgressNote(sequelize: Sequelize, noteId: string, auditContext: AuditContext): Promise<ProgressNote>;
/**
 * Retrieves progress notes for a patient encounter.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} patientId - Patient ID
 * @param {string} encounterId - Encounter ID
 * @param {AuditContext} auditContext - Audit context
 * @returns {Promise<ProgressNote[]>} Progress notes
 *
 * @example
 * ```typescript
 * const notes = await retrieveProgressNotes(sequelize, 'patient-uuid', 'encounter-uuid', auditContext);
 * ```
 */
export declare function retrieveProgressNotes(sequelize: Sequelize, patientId: string, encounterId: string, auditContext: AuditContext): Promise<ProgressNote[]>;
/**
 * Creates a consultation note for specialist consultations.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Partial<ConsultationNote>} noteData - Consultation note data
 * @param {AuditContext} auditContext - Audit context
 * @returns {Promise<ConsultationNote>} Created consultation note
 *
 * @example
 * ```typescript
 * const consultNote = await createConsultationNote(sequelize, {
 *   patientId: 'patient-uuid',
 *   encounterId: 'encounter-uuid',
 *   requestingProviderId: 'provider-uuid',
 *   consultingProviderId: 'cardiologist-uuid',
 *   specialty: 'Cardiology',
 *   consultDate: new Date(),
 *   reason: 'Evaluation of chest pain and abnormal EKG',
 *   findings: 'EKG shows ST elevation in leads V2-V4...',
 *   recommendations: [
 *     'Emergent cardiac catheterization',
 *     'Aspirin 325mg PO',
 *     'Heparin drip',
 *     'CCU admission'
 *   ],
 *   urgency: 'stat'
 * }, auditContext);
 * ```
 */
export declare function createConsultationNote(sequelize: Sequelize, noteData: Partial<ConsultationNote>, auditContext: AuditContext): Promise<ConsultationNote>;
/**
 * Updates consultation note with recommendations.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} noteId - Consultation note ID
 * @param {Partial<ConsultationNote>} updates - Fields to update
 * @param {AuditContext} auditContext - Audit context
 * @returns {Promise<ConsultationNote>} Updated consultation note
 *
 * @example
 * ```typescript
 * const updated = await updateConsultationNote(sequelize, 'consult-note-uuid', {
 *   findings: 'Cardiac catheterization completed - 95% LAD stenosis',
 *   recommendations: [
 *     'STEMI protocol initiated',
 *     'PCI with stent placement completed',
 *     'Dual antiplatelet therapy',
 *     'Cardiac rehab referral'
 *   ],
 *   status: 'completed'
 * }, auditContext);
 * ```
 */
export declare function updateConsultationNote(sequelize: Sequelize, noteId: string, updates: Partial<ConsultationNote>, auditContext: AuditContext): Promise<ConsultationNote>;
/**
 * Finalizes consultation note with signature.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} noteId - Consultation note ID
 * @param {AuditContext} auditContext - Audit context
 * @returns {Promise<ConsultationNote>} Finalized consultation note
 *
 * @example
 * ```typescript
 * const finalized = await finalizeConsultationNote(sequelize, 'consult-note-uuid', auditContext);
 * ```
 */
export declare function finalizeConsultationNote(sequelize: Sequelize, noteId: string, auditContext: AuditContext): Promise<ConsultationNote>;
/**
 * Retrieves consultation notes by specialty.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} patientId - Patient ID
 * @param {string} specialty - Medical specialty
 * @param {AuditContext} auditContext - Audit context
 * @returns {Promise<ConsultationNote[]>} Consultation notes
 *
 * @example
 * ```typescript
 * const consultNotes = await retrieveConsultationNotes(
 *   sequelize,
 *   'patient-uuid',
 *   'Cardiology',
 *   auditContext
 * );
 * ```
 */
export declare function retrieveConsultationNotes(sequelize: Sequelize, patientId: string, specialty: string, auditContext: AuditContext): Promise<ConsultationNote[]>;
/**
 * Creates a discharge summary for hospital stays.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Partial<DischargeSummary>} summaryData - Discharge summary data
 * @param {AuditContext} auditContext - Audit context
 * @returns {Promise<DischargeSummary>} Created discharge summary
 *
 * @example
 * ```typescript
 * const dischargeSummary = await createDischargeSummary(sequelize, {
 *   patientId: 'patient-uuid',
 *   encounterId: 'encounter-uuid',
 *   providerId: 'provider-uuid',
 *   admissionDate: new Date('2024-01-15'),
 *   dischargeDate: new Date('2024-01-20'),
 *   lengthOfStay: 5,
 *   admissionDiagnosis: 'Chest pain, rule out MI',
 *   dischargeDiagnosis: ['NSTEMI', 'Type 2 diabetes', 'Hypertension'],
 *   hospitalCourse: 'Patient admitted with chest pain...',
 *   proceduresPerformed: ['Cardiac catheterization', 'PCI with stent'],
 *   dischargeMedications: [...],
 *   dischargeDisposition: 'Home with home health',
 *   dischargeInstructions: 'Patient to follow up with cardiology in 1 week...',
 *   followUpCare: 'Cardiology appointment scheduled for 1/27/2024'
 * }, auditContext);
 * ```
 */
export declare function createDischargeSummary(sequelize: Sequelize, summaryData: Partial<DischargeSummary>, auditContext: AuditContext): Promise<DischargeSummary>;
/**
 * Updates discharge summary with disposition and follow-up.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} summaryId - Discharge summary ID
 * @param {Partial<DischargeSummary>} updates - Fields to update
 * @param {AuditContext} auditContext - Audit context
 * @returns {Promise<DischargeSummary>} Updated discharge summary
 *
 * @example
 * ```typescript
 * const updated = await updateDischargeSummary(sequelize, 'summary-uuid', {
 *   dischargeDisposition: 'Skilled nursing facility',
 *   followUpCare: 'Wound care clinic in 3 days, PCP in 2 weeks'
 * }, auditContext);
 * ```
 */
export declare function updateDischargeSummary(sequelize: Sequelize, summaryId: string, updates: Partial<DischargeSummary>, auditContext: AuditContext): Promise<DischargeSummary>;
/**
 * Finalizes discharge summary for patient release.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} summaryId - Discharge summary ID
 * @param {AuditContext} auditContext - Audit context
 * @returns {Promise<DischargeSummary>} Finalized discharge summary
 *
 * @example
 * ```typescript
 * const finalized = await finalizeDischargeSummary(sequelize, 'summary-uuid', auditContext);
 * ```
 */
export declare function finalizeDischargeSummary(sequelize: Sequelize, summaryId: string, auditContext: AuditContext): Promise<DischargeSummary>;
/**
 * Retrieves discharge summaries by encounter.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} encounterId - Encounter ID
 * @param {AuditContext} auditContext - Audit context
 * @returns {Promise<DischargeSummary[]>} Discharge summaries
 *
 * @example
 * ```typescript
 * const summaries = await retrieveDischargeSummaries(sequelize, 'encounter-uuid', auditContext);
 * ```
 */
export declare function retrieveDischargeSummaries(sequelize: Sequelize, encounterId: string, auditContext: AuditContext): Promise<DischargeSummary[]>;
/**
 * Creates an operative report for surgical procedures.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Partial<OperativeReport>} reportData - Operative report data
 * @param {AuditContext} auditContext - Audit context
 * @returns {Promise<OperativeReport>} Created operative report
 *
 * @example
 * ```typescript
 * const opReport = await createOperativeReport(sequelize, {
 *   patientId: 'patient-uuid',
 *   encounterId: 'encounter-uuid',
 *   surgeonId: 'surgeon-uuid',
 *   assistantIds: ['assistant1-uuid', 'assistant2-uuid'],
 *   anesthesiologistId: 'anesthesiologist-uuid',
 *   procedureDate: new Date(),
 *   preoperativeDiagnosis: 'Acute appendicitis',
 *   postoperativeDiagnosis: 'Acute gangrenous appendicitis with perforation',
 *   procedurePerformed: ['Laparoscopic appendectomy'],
 *   cptCodes: ['44970'],
 *   anesthesiaType: 'General endotracheal',
 *   findings: 'Gangrenous appendix with perforation and localized peritonitis',
 *   description: 'Detailed procedural description...',
 *   specimens: ['Appendix'],
 *   estimatedBloodLoss: 50,
 *   disposition: 'To PACU in stable condition'
 * }, auditContext);
 * ```
 */
export declare function createOperativeReport(sequelize: Sequelize, reportData: Partial<OperativeReport>, auditContext: AuditContext): Promise<OperativeReport>;
/**
 * Updates operative report with findings and complications.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} reportId - Operative report ID
 * @param {Partial<OperativeReport>} updates - Fields to update
 * @param {AuditContext} auditContext - Audit context
 * @returns {Promise<OperativeReport>} Updated operative report
 *
 * @example
 * ```typescript
 * const updated = await updateOperativeReport(sequelize, 'op-report-uuid', {
 *   complications: ['Intraoperative bleeding requiring transfusion'],
 *   estimatedBloodLoss: 500,
 *   disposition: 'To ICU for monitoring'
 * }, auditContext);
 * ```
 */
export declare function updateOperativeReport(sequelize: Sequelize, reportId: string, updates: Partial<OperativeReport>, auditContext: AuditContext): Promise<OperativeReport>;
/**
 * Finalizes operative report with surgeon attestation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} reportId - Operative report ID
 * @param {AuditContext} auditContext - Audit context
 * @returns {Promise<OperativeReport>} Finalized operative report
 *
 * @example
 * ```typescript
 * const finalized = await finalizeOperativeReport(sequelize, 'op-report-uuid', {
 *   userId: 'surgeon-uuid',
 *   ipAddress: '192.168.1.100'
 * });
 * ```
 */
export declare function finalizeOperativeReport(sequelize: Sequelize, reportId: string, auditContext: AuditContext): Promise<OperativeReport>;
/**
 * Retrieves operative reports by procedure type.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} patientId - Patient ID
 * @param {string} procedureType - Procedure type
 * @param {AuditContext} auditContext - Audit context
 * @returns {Promise<OperativeReport[]>} Operative reports
 *
 * @example
 * ```typescript
 * const reports = await retrieveOperativeReports(
 *   sequelize,
 *   'patient-uuid',
 *   'Laparoscopic',
 *   auditContext
 * );
 * ```
 */
export declare function retrieveOperativeReports(sequelize: Sequelize, patientId: string, procedureType: string, auditContext: AuditContext): Promise<OperativeReport[]>;
/**
 * Creates a reusable clinical template for standardized documentation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Partial<ClinicalTemplate>} templateData - Template data
 * @param {AuditContext} auditContext - Audit context
 * @returns {Promise<ClinicalTemplate>} Created template
 *
 * @example
 * ```typescript
 * const template = await createClinicalTemplate(sequelize, {
 *   name: 'Chest Pain SOAP Note',
 *   description: 'Standardized template for chest pain evaluation',
 *   specialty: 'Cardiology',
 *   category: 'soap',
 *   structure: {
 *     subjective: {
 *       chiefComplaint: '[TEMPLATE: Chest pain characteristics]',
 *       hpi: '[TEMPLATE: Onset, duration, quality, radiation, etc.]'
 *     },
 *     objective: {
 *       vitalSigns: '[TEMPLATE: BP, HR, RR, O2Sat]',
 *       cardiacExam: '[TEMPLATE: Heart sounds, rhythm]'
 *     }
 *   },
 *   macros: {
 *     'cp-stable': 'Chest pain resolved with nitroglycerin',
 *     'cp-unstable': 'Persistent chest pain despite intervention'
 *   },
 *   active: true
 * }, auditContext);
 * ```
 */
export declare function createClinicalTemplate(sequelize: Sequelize, templateData: Partial<ClinicalTemplate>, auditContext: AuditContext): Promise<ClinicalTemplate>;
/**
 * Retrieves clinical templates by specialty and category.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} specialty - Medical specialty
 * @param {string} category - Template category
 * @param {AuditContext} auditContext - Audit context
 * @returns {Promise<ClinicalTemplate[]>} Clinical templates
 *
 * @example
 * ```typescript
 * const templates = await retrieveClinicalTemplates(
 *   sequelize,
 *   'Cardiology',
 *   'soap',
 *   auditContext
 * );
 * ```
 */
export declare function retrieveClinicalTemplates(sequelize: Sequelize, specialty: string, category: string, auditContext: AuditContext): Promise<ClinicalTemplate[]>;
//# sourceMappingURL=health-clinical-documentation-kit.d.ts.map