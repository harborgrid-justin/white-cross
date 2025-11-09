/**
 * LOC: H1E2A3L4T5
 * File: /reuse/server/health/health-medical-records-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (v6.x)
 *   - crypto (Node.js native)
 *   - @types/validator (v13.x)
 *   - fhir (v4.x)
 *
 * DOWNSTREAM (imported by):
 *   - Medical record services
 *   - EHR integration modules
 *   - Patient portal APIs
 *   - Clinical data exchange services
 */
/**
 * File: /reuse/server/health/health-medical-records-kit.ts
 * Locator: WC-HLTH-MED-REC-001
 * Purpose: Medical Records Management - Comprehensive EHR and medical record utilities
 *
 * Upstream: sequelize v6.x, crypto, fhir v4.x, @types/validator
 * Downstream: Medical record services, EHR systems, patient portals, clinical data exchange
 * Dependencies: Sequelize v6.x, Node 18+, TypeScript 5.x, PostgreSQL 14+
 * Exports: 48 medical record functions for EHR management, problem lists, medications, allergies, immunizations, family history, social history, surgical history, medical devices, versioning, and import/export
 *
 * LLM Context: Production-grade medical records management utilities for White Cross healthcare platform.
 * Provides comprehensive Epic EHR-level functionality including electronic health record CRUD operations,
 * problem list management, medication tracking, allergy documentation, immunization records, family health
 * history, social history tracking, surgical procedure documentation, medical device registry, record
 * versioning with history, and interoperability through CCR/CCD/FHIR import/export. HIPAA-compliant with
 * field-level encryption for all PHI, comprehensive audit trails, medical code validation (ICD-10, CPT,
 * CVX, NDC, RxNorm, LOINC, SNOMED CT), and concurrent access management.
 */
import { Sequelize } from 'sequelize';
/**
 * Electronic Health Record interface
 */
export interface EhrRecord {
    id: string;
    patientId: string;
    medicalRecordNumber: string;
    facilityId: string;
    providerId: string;
    recordType: 'inpatient' | 'outpatient' | 'emergency' | 'telehealth';
    encounterDate: Date;
    chiefComplaint?: string;
    presentIllness?: string;
    reviewOfSystems?: any;
    physicalExam?: any;
    assessment?: string;
    plan?: string;
    diagnosis?: DiagnosisCode[];
    procedures?: ProcedureCode[];
    vitalSigns?: VitalSigns;
    status: 'draft' | 'in-progress' | 'completed' | 'amended' | 'corrected';
    lockedAt?: Date;
    lockedBy?: string;
    version: number;
    metadata?: any;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
/**
 * Problem List Entry interface
 */
export interface ProblemListEntry {
    id: string;
    patientId: string;
    ehrRecordId?: string;
    problemName: string;
    icdCode: string;
    icdVersion: '10' | '11';
    snomedCode?: string;
    status: 'active' | 'inactive' | 'resolved' | 'chronic';
    severity: 'mild' | 'moderate' | 'severe' | 'critical';
    onsetDate?: Date;
    resolvedDate?: Date;
    diagnosedBy: string;
    notes?: string;
    priority: number;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Medication List Entry interface
 */
export interface MedicationListEntry {
    id: string;
    patientId: string;
    ehrRecordId?: string;
    medicationName: string;
    genericName?: string;
    ndcCode?: string;
    rxNormCode?: string;
    dosage: string;
    dosageForm: string;
    route: string;
    frequency: string;
    startDate: Date;
    endDate?: Date;
    prescribedBy: string;
    prescriptionNumber?: string;
    quantity?: number;
    refills?: number;
    status: 'active' | 'discontinued' | 'completed' | 'on-hold';
    discontinuedReason?: string;
    instructions?: string;
    indications?: string[];
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Allergy Record interface
 */
export interface AllergyRecord {
    id: string;
    patientId: string;
    allergen: string;
    allergenType: 'medication' | 'food' | 'environmental' | 'other';
    allergenCode?: string;
    reactionType: string[];
    severity: 'mild' | 'moderate' | 'severe' | 'life-threatening';
    status: 'active' | 'inactive' | 'resolved';
    onsetDate?: Date;
    verificationStatus: 'unconfirmed' | 'confirmed' | 'refuted' | 'entered-in-error';
    verifiedBy?: string;
    verifiedDate?: Date;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Immunization Record interface
 */
export interface ImmunizationRecord {
    id: string;
    patientId: string;
    ehrRecordId?: string;
    vaccineName: string;
    cvxCode: string;
    lotNumber?: string;
    manufacturer?: string;
    expirationDate?: Date;
    administrationDate: Date;
    administeredBy: string;
    site: string;
    route: string;
    dosage: string;
    doseNumber?: number;
    seriesStatus?: 'complete' | 'incomplete' | 'not-applicable';
    notes?: string;
    adverseReaction?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Family Health History interface
 */
export interface FamilyHealthHistory {
    id: string;
    patientId: string;
    relativeName?: string;
    relationship: 'parent' | 'sibling' | 'child' | 'grandparent' | 'aunt-uncle' | 'cousin' | 'other';
    gender?: 'male' | 'female' | 'other';
    condition: string;
    icdCode?: string;
    ageAtOnset?: number;
    ageAtDeath?: number;
    causeOfDeath?: string;
    livingStatus: 'alive' | 'deceased' | 'unknown';
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Social History interface
 */
export interface SocialHistory {
    id: string;
    patientId: string;
    category: 'smoking' | 'alcohol' | 'drugs' | 'sexual' | 'occupational' | 'social-support' | 'other';
    status: string;
    details?: any;
    startDate?: Date;
    endDate?: Date;
    frequency?: string;
    amount?: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Surgical History interface
 */
export interface SurgicalHistory {
    id: string;
    patientId: string;
    ehrRecordId?: string;
    procedureName: string;
    cptCode?: string;
    icdProcedureCode?: string;
    surgeryDate: Date;
    surgeon: string;
    facilityId: string;
    outcome: 'successful' | 'complicated' | 'failed';
    complications?: string[];
    anesthesiaType?: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Medical Device interface
 */
export interface MedicalDevice {
    id: string;
    patientId: string;
    ehrRecordId?: string;
    deviceName: string;
    deviceType: string;
    udiCode?: string;
    manufacturer?: string;
    modelNumber?: string;
    serialNumber?: string;
    implantDate: Date;
    expirationDate?: Date;
    removalDate?: Date;
    status: 'active' | 'removed' | 'malfunctioned' | 'explanted';
    location?: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Record Version interface
 */
export interface RecordVersion {
    id: string;
    recordId: string;
    recordType: string;
    version: number;
    snapshot: any;
    changedBy: string;
    changeReason?: string;
    changesSummary?: any;
    createdAt: Date;
}
/**
 * Diagnosis Code interface
 */
export interface DiagnosisCode {
    code: string;
    version: '10' | '11';
    description: string;
    type: 'primary' | 'secondary' | 'admitting' | 'discharge';
}
/**
 * Procedure Code interface
 */
export interface ProcedureCode {
    code: string;
    codeSystem: 'CPT' | 'HCPCS' | 'ICD-10-PCS';
    description: string;
    performedDate?: Date;
}
/**
 * Vital Signs interface
 */
export interface VitalSigns {
    temperature?: number;
    temperatureUnit?: 'F' | 'C';
    heartRate?: number;
    respiratoryRate?: number;
    bloodPressureSystolic?: number;
    bloodPressureDiastolic?: number;
    oxygenSaturation?: number;
    height?: number;
    heightUnit?: 'in' | 'cm';
    weight?: number;
    weightUnit?: 'lb' | 'kg';
    bmi?: number;
    painLevel?: number;
    recordedAt: Date;
    recordedBy: string;
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
 * Encryption configuration
 */
export interface EncryptionConfig {
    algorithm: string;
    key: Buffer;
    enabled: boolean;
}
/**
 * Import/Export format types
 */
export type ExportFormat = 'CCR' | 'CCD' | 'FHIR' | 'HL7v2' | 'HL7v3';
/**
 * Creates a new electronic health record with field-level encryption for PHI.
 * Implements comprehensive validation, audit trail, and HIPAA compliance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Partial<EhrRecord>} recordData - EHR record data
 * @param {AuditContext} auditContext - Audit context
 * @returns {Promise<EhrRecord>} Created EHR record
 *
 * @example
 * ```typescript
 * const ehrRecord = await createEhrRecord(sequelize, {
 *   patientId: 'patient-uuid',
 *   medicalRecordNumber: 'MRN-12345678',
 *   facilityId: 'facility-uuid',
 *   providerId: 'provider-uuid',
 *   recordType: 'outpatient',
 *   encounterDate: new Date(),
 *   chiefComplaint: 'Chest pain',
 *   diagnosis: [{ code: 'I20.0', version: '10', description: 'Unstable angina', type: 'primary' }]
 * }, {
 *   userId: 'provider-uuid',
 *   ipAddress: '192.168.1.100',
 *   facilityId: 'facility-uuid'
 * });
 * ```
 */
export declare function createEhrRecord(sequelize: Sequelize, recordData: Partial<EhrRecord>, auditContext: AuditContext): Promise<EhrRecord>;
/**
 * Retrieves an electronic health record with automatic PHI decryption and access logging.
 * Implements HIPAA-compliant audit trail for all record access.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} recordId - EHR record ID
 * @param {AuditContext} auditContext - Audit context
 * @returns {Promise<EhrRecord | null>} EHR record with decrypted PHI
 *
 * @example
 * ```typescript
 * const ehrRecord = await retrieveEhrRecord(sequelize, 'ehr-record-uuid', {
 *   userId: 'provider-uuid',
 *   ipAddress: '192.168.1.100',
 *   reason: 'Patient care - scheduled appointment'
 * });
 *
 * console.log(ehrRecord.chiefComplaint); // Automatically decrypted
 * ```
 */
export declare function retrieveEhrRecord(sequelize: Sequelize, recordId: string, auditContext: AuditContext): Promise<EhrRecord | null>;
/**
 * Updates an electronic health record with versioning and audit trail.
 * Automatically creates a version snapshot before applying changes.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} recordId - EHR record ID
 * @param {Partial<EhrRecord>} updates - Fields to update
 * @param {AuditContext} auditContext - Audit context
 * @returns {Promise<EhrRecord>} Updated EHR record
 *
 * @example
 * ```typescript
 * const updatedRecord = await updateEhrRecord(sequelize, 'ehr-record-uuid', {
 *   assessment: 'Updated assessment with new findings',
 *   diagnosis: [
 *     { code: 'I20.0', version: '10', description: 'Unstable angina', type: 'primary' },
 *     { code: 'E11.9', version: '10', description: 'Type 2 diabetes', type: 'secondary' }
 *   ],
 *   status: 'completed'
 * }, {
 *   userId: 'provider-uuid',
 *   ipAddress: '192.168.1.100',
 *   reason: 'Clinical documentation update'
 * });
 * ```
 */
export declare function updateEhrRecord(sequelize: Sequelize, recordId: string, updates: Partial<EhrRecord>, auditContext: AuditContext): Promise<EhrRecord>;
/**
 * Soft deletes an electronic health record with comprehensive audit trail.
 * Implements paranoid deletion to maintain data integrity and compliance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} recordId - EHR record ID
 * @param {AuditContext} auditContext - Audit context
 * @returns {Promise<boolean>} Deletion success status
 *
 * @example
 * ```typescript
 * const deleted = await deleteEhrRecord(sequelize, 'ehr-record-uuid', {
 *   userId: 'admin-uuid',
 *   ipAddress: '192.168.1.100',
 *   reason: 'Duplicate record - patient request'
 * });
 *
 * console.log(deleted); // true
 * ```
 */
export declare function deleteEhrRecord(sequelize: Sequelize, recordId: string, auditContext: AuditContext): Promise<boolean>;
/**
 * Creates a version snapshot of an EHR record for change tracking.
 * Maintains complete audit trail of all record modifications.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} recordId - EHR record ID
 * @param {AuditContext} auditContext - Audit context
 * @returns {Promise<RecordVersion>} Version record
 *
 * @example
 * ```typescript
 * const version = await versionEhrRecord(sequelize, 'ehr-record-uuid', {
 *   userId: 'provider-uuid',
 *   ipAddress: '192.168.1.100',
 *   reason: 'Before major update'
 * });
 * ```
 */
export declare function versionEhrRecord(sequelize: Sequelize, recordId: string, auditContext: AuditContext): Promise<RecordVersion>;
/**
 * Locks an EHR record to prevent concurrent modifications.
 * Implements pessimistic locking for data consistency.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} recordId - EHR record ID
 * @param {AuditContext} auditContext - Audit context
 * @returns {Promise<boolean>} Lock success status
 *
 * @example
 * ```typescript
 * const locked = await lockEhrRecord(sequelize, 'ehr-record-uuid', {
 *   userId: 'provider-uuid',
 *   ipAddress: '192.168.1.100'
 * });
 *
 * if (locked) {
 *   // Perform updates
 *   await updateEhrRecord(sequelize, 'ehr-record-uuid', updates, auditContext);
 *   await unlockEhrRecord(sequelize, 'ehr-record-uuid', auditContext);
 * }
 * ```
 */
export declare function lockEhrRecord(sequelize: Sequelize, recordId: string, auditContext: AuditContext): Promise<boolean>;
/**
 * Unlocks an EHR record to allow modifications by other users.
 * Releases pessimistic lock after updates are complete.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} recordId - EHR record ID
 * @param {AuditContext} auditContext - Audit context
 * @returns {Promise<boolean>} Unlock success status
 *
 * @example
 * ```typescript
 * const unlocked = await unlockEhrRecord(sequelize, 'ehr-record-uuid', {
 *   userId: 'provider-uuid',
 *   ipAddress: '192.168.1.100'
 * });
 * ```
 */
export declare function unlockEhrRecord(sequelize: Sequelize, recordId: string, auditContext: AuditContext): Promise<boolean>;
/**
 * Validates an EHR record for completeness and clinical accuracy.
 * Checks required fields, medical codes, and clinical logic.
 *
 * @param {Partial<EhrRecord>} recordData - EHR record to validate
 * @returns {Promise<{ valid: boolean; errors: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateEhrRecord({
 *   patientId: 'patient-uuid',
 *   medicalRecordNumber: 'MRN-12345678',
 *   diagnosis: [{ code: 'I20.0', version: '10', description: 'Unstable angina', type: 'primary' }]
 * });
 *
 * if (!validation.valid) {
 *   console.error('Validation errors:', validation.errors);
 * }
 * ```
 */
export declare function validateEhrRecord(recordData: Partial<EhrRecord>): Promise<{
    valid: boolean;
    errors: string[];
}>;
/**
 * Adds a problem to patient's problem list with ICD-10/11 coding.
 * Supports clinical decision support and care coordination.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Partial<ProblemListEntry>} problemData - Problem data
 * @param {AuditContext} auditContext - Audit context
 * @returns {Promise<ProblemListEntry>} Created problem entry
 *
 * @example
 * ```typescript
 * const problem = await addProblemToList(sequelize, {
 *   patientId: 'patient-uuid',
 *   problemName: 'Type 2 Diabetes Mellitus',
 *   icdCode: 'E11.9',
 *   icdVersion: '10',
 *   snomedCode: '44054006',
 *   status: 'active',
 *   severity: 'moderate',
 *   onsetDate: new Date('2020-01-15'),
 *   diagnosedBy: 'provider-uuid',
 *   priority: 1
 * }, auditContext);
 * ```
 */
export declare function addProblemToList(sequelize: Sequelize, problemData: Partial<ProblemListEntry>, auditContext: AuditContext): Promise<ProblemListEntry>;
/**
 * Updates a problem list entry with status, severity, or clinical information changes.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} problemId - Problem entry ID
 * @param {Partial<ProblemListEntry>} updates - Fields to update
 * @param {AuditContext} auditContext - Audit context
 * @returns {Promise<ProblemListEntry>} Updated problem entry
 *
 * @example
 * ```typescript
 * const updated = await updateProblemListEntry(sequelize, 'problem-uuid', {
 *   severity: 'severe',
 *   status: 'chronic',
 *   notes: 'Patient experiencing increased symptoms'
 * }, auditContext);
 * ```
 */
export declare function updateProblemListEntry(sequelize: Sequelize, problemId: string, updates: Partial<ProblemListEntry>, auditContext: AuditContext): Promise<ProblemListEntry>;
/**
 * Resolves a problem list entry with resolution date and outcome.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} problemId - Problem entry ID
 * @param {AuditContext} auditContext - Audit context
 * @returns {Promise<ProblemListEntry>} Resolved problem entry
 *
 * @example
 * ```typescript
 * const resolved = await resolveProblemListEntry(sequelize, 'problem-uuid', {
 *   userId: 'provider-uuid',
 *   ipAddress: '192.168.1.100',
 *   reason: 'Condition successfully treated and resolved'
 * });
 * ```
 */
export declare function resolveProblemListEntry(sequelize: Sequelize, problemId: string, auditContext: AuditContext): Promise<ProblemListEntry>;
/**
 * Reactivates a resolved problem that has recurred.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} problemId - Problem entry ID
 * @param {AuditContext} auditContext - Audit context
 * @returns {Promise<ProblemListEntry>} Reactivated problem entry
 *
 * @example
 * ```typescript
 * const reactivated = await reactivateProblemListEntry(sequelize, 'problem-uuid', {
 *   userId: 'provider-uuid',
 *   ipAddress: '192.168.1.100',
 *   reason: 'Condition has recurred'
 * });
 * ```
 */
export declare function reactivateProblemListEntry(sequelize: Sequelize, problemId: string, auditContext: AuditContext): Promise<ProblemListEntry>;
/**
 * Retrieves active problem list for a patient.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} patientId - Patient ID
 * @param {AuditContext} auditContext - Audit context
 * @returns {Promise<ProblemListEntry[]>} Active problems
 *
 * @example
 * ```typescript
 * const problems = await retrieveActiveProblemList(sequelize, 'patient-uuid', auditContext);
 * problems.forEach(p => console.log(`${p.problemName} (${p.icdCode}) - ${p.severity}`));
 * ```
 */
export declare function retrieveActiveProblemList(sequelize: Sequelize, patientId: string, auditContext: AuditContext): Promise<ProblemListEntry[]>;
/**
 * Adds a medication to patient's medication list with NDC/RxNorm coding.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Partial<MedicationListEntry>} medicationData - Medication data
 * @param {AuditContext} auditContext - Audit context
 * @returns {Promise<MedicationListEntry>} Created medication entry
 *
 * @example
 * ```typescript
 * const medication = await addMedicationToList(sequelize, {
 *   patientId: 'patient-uuid',
 *   medicationName: 'Metformin 500mg Tablet',
 *   genericName: 'Metformin Hydrochloride',
 *   rxNormCode: '860975',
 *   dosage: '500mg',
 *   dosageForm: 'Tablet',
 *   route: 'Oral',
 *   frequency: 'BID (twice daily)',
 *   startDate: new Date(),
 *   prescribedBy: 'provider-uuid',
 *   prescriptionNumber: 'RX-123456',
 *   quantity: 60,
 *   refills: 3,
 *   status: 'active'
 * }, auditContext);
 * ```
 */
export declare function addMedicationToList(sequelize: Sequelize, medicationData: Partial<MedicationListEntry>, auditContext: AuditContext): Promise<MedicationListEntry>;
/**
 * Updates medication list entry with dosage, frequency, or status changes.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} medicationId - Medication entry ID
 * @param {Partial<MedicationListEntry>} updates - Fields to update
 * @param {AuditContext} auditContext - Audit context
 * @returns {Promise<MedicationListEntry>} Updated medication entry
 *
 * @example
 * ```typescript
 * const updated = await updateMedicationListEntry(sequelize, 'medication-uuid', {
 *   dosage: '1000mg',
 *   frequency: 'TID (three times daily)',
 *   instructions: 'Take with meals to reduce GI upset'
 * }, auditContext);
 * ```
 */
export declare function updateMedicationListEntry(sequelize: Sequelize, medicationId: string, updates: Partial<MedicationListEntry>, auditContext: AuditContext): Promise<MedicationListEntry>;
/**
 * Discontinues a medication with reason and date.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} medicationId - Medication entry ID
 * @param {string} reason - Discontinuation reason
 * @param {AuditContext} auditContext - Audit context
 * @returns {Promise<MedicationListEntry>} Discontinued medication entry
 *
 * @example
 * ```typescript
 * const discontinued = await discontinueMedication(
 *   sequelize,
 *   'medication-uuid',
 *   'Adverse reaction - rash developed',
 *   auditContext
 * );
 * ```
 */
export declare function discontinueMedication(sequelize: Sequelize, medicationId: string, reason: string, auditContext: AuditContext): Promise<MedicationListEntry>;
/**
 * Performs medication reconciliation comparing current list with provided list.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} patientId - Patient ID
 * @param {Partial<MedicationListEntry>[]} providedList - Patient-reported medications
 * @param {AuditContext} auditContext - Audit context
 * @returns {Promise<{ added: MedicationListEntry[]; removed: string[]; discrepancies: any[] }>} Reconciliation results
 *
 * @example
 * ```typescript
 * const reconciliation = await reconcileMedicationList(sequelize, 'patient-uuid', [
 *   { medicationName: 'Aspirin 81mg', dosage: '81mg', frequency: 'Daily' },
 *   { medicationName: 'Lisinopril 10mg', dosage: '10mg', frequency: 'Daily' }
 * ], auditContext);
 *
 * console.log(`Added: ${reconciliation.added.length}`);
 * console.log(`Removed: ${reconciliation.removed.length}`);
 * console.log(`Discrepancies: ${reconciliation.discrepancies.length}`);
 * ```
 */
export declare function reconcileMedicationList(sequelize: Sequelize, patientId: string, providedList: Partial<MedicationListEntry>[], auditContext: AuditContext): Promise<{
    added: MedicationListEntry[];
    removed: string[];
    discrepancies: any[];
}>;
/**
 * Retrieves active medications for a patient.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} patientId - Patient ID
 * @param {AuditContext} auditContext - Audit context
 * @returns {Promise<MedicationListEntry[]>} Active medications
 *
 * @example
 * ```typescript
 * const medications = await retrieveActiveMedications(sequelize, 'patient-uuid', auditContext);
 * medications.forEach(m => console.log(`${m.medicationName} - ${m.dosage} ${m.frequency}`));
 * ```
 */
export declare function retrieveActiveMedications(sequelize: Sequelize, patientId: string, auditContext: AuditContext): Promise<MedicationListEntry[]>;
/**
 * Adds an allergy record with reaction type and severity.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Partial<AllergyRecord>} allergyData - Allergy data
 * @param {AuditContext} auditContext - Audit context
 * @returns {Promise<AllergyRecord>} Created allergy record
 *
 * @example
 * ```typescript
 * const allergy = await addAllergyRecord(sequelize, {
 *   patientId: 'patient-uuid',
 *   allergen: 'Penicillin',
 *   allergenType: 'medication',
 *   allergenCode: 'RxNorm:7984',
 *   reactionType: ['Rash', 'Hives', 'Itching'],
 *   severity: 'moderate',
 *   status: 'active',
 *   verificationStatus: 'confirmed',
 *   onsetDate: new Date('2015-03-20'),
 *   notes: 'Patient reports reaction occurred during childhood'
 * }, auditContext);
 * ```
 */
export declare function addAllergyRecord(sequelize: Sequelize, allergyData: Partial<AllergyRecord>, auditContext: AuditContext): Promise<AllergyRecord>;
/**
 * Updates allergy record with severity or verification status changes.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} allergyId - Allergy record ID
 * @param {Partial<AllergyRecord>} updates - Fields to update
 * @param {AuditContext} auditContext - Audit context
 * @returns {Promise<AllergyRecord>} Updated allergy record
 *
 * @example
 * ```typescript
 * const updated = await updateAllergyRecord(sequelize, 'allergy-uuid', {
 *   severity: 'severe',
 *   reactionType: ['Anaphylaxis', 'Difficulty breathing', 'Angioedema'],
 *   notes: 'Recent reaction was more severe - updated classification'
 * }, auditContext);
 * ```
 */
export declare function updateAllergyRecord(sequelize: Sequelize, allergyId: string, updates: Partial<AllergyRecord>, auditContext: AuditContext): Promise<AllergyRecord>;
/**
 * Clinically verifies an allergy record.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} allergyId - Allergy record ID
 * @param {string} verifiedBy - Verifying provider ID
 * @param {AuditContext} auditContext - Audit context
 * @returns {Promise<AllergyRecord>} Verified allergy record
 *
 * @example
 * ```typescript
 * const verified = await verifyAllergyRecord(
 *   sequelize,
 *   'allergy-uuid',
 *   'provider-uuid',
 *   auditContext
 * );
 * ```
 */
export declare function verifyAllergyRecord(sequelize: Sequelize, allergyId: string, verifiedBy: string, auditContext: AuditContext): Promise<AllergyRecord>;
/**
 * Marks an allergy as inactive with reason.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} allergyId - Allergy record ID
 * @param {string} reason - Inactivation reason
 * @param {AuditContext} auditContext - Audit context
 * @returns {Promise<AllergyRecord>} Updated allergy record
 *
 * @example
 * ```typescript
 * const inactive = await markAllergyInactive(
 *   sequelize,
 *   'allergy-uuid',
 *   'Patient underwent desensitization therapy',
 *   auditContext
 * );
 * ```
 */
export declare function markAllergyInactive(sequelize: Sequelize, allergyId: string, reason: string, auditContext: AuditContext): Promise<AllergyRecord>;
/**
 * Retrieves active allergies for a patient.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} patientId - Patient ID
 * @param {AuditContext} auditContext - Audit context
 * @returns {Promise<AllergyRecord[]>} Active allergies
 *
 * @example
 * ```typescript
 * const allergies = await retrieveActiveAllergies(sequelize, 'patient-uuid', auditContext);
 * allergies.forEach(a => console.log(`${a.allergen} - ${a.severity} (${a.reactionType.join(', ')})`));
 * ```
 */
export declare function retrieveActiveAllergies(sequelize: Sequelize, patientId: string, auditContext: AuditContext): Promise<AllergyRecord[]>;
/**
 * Adds an immunization record with CVX code and lot number.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Partial<ImmunizationRecord>} immunizationData - Immunization data
 * @param {AuditContext} auditContext - Audit context
 * @returns {Promise<ImmunizationRecord>} Created immunization record
 *
 * @example
 * ```typescript
 * const immunization = await addImmunizationRecord(sequelize, {
 *   patientId: 'patient-uuid',
 *   vaccineName: 'Influenza, seasonal, injectable',
 *   cvxCode: '141',
 *   lotNumber: 'LOT123456',
 *   manufacturer: 'Sanofi Pasteur',
 *   expirationDate: new Date('2025-12-31'),
 *   administrationDate: new Date(),
 *   administeredBy: 'nurse-uuid',
 *   site: 'Left deltoid',
 *   route: 'Intramuscular',
 *   dosage: '0.5 mL',
 *   doseNumber: 1,
 *   seriesStatus: 'complete'
 * }, auditContext);
 * ```
 */
export declare function addImmunizationRecord(sequelize: Sequelize, immunizationData: Partial<ImmunizationRecord>, auditContext: AuditContext): Promise<ImmunizationRecord>;
/**
 * Updates immunization record.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} immunizationId - Immunization record ID
 * @param {Partial<ImmunizationRecord>} updates - Fields to update
 * @param {AuditContext} auditContext - Audit context
 * @returns {Promise<ImmunizationRecord>} Updated immunization record
 *
 * @example
 * ```typescript
 * const updated = await updateImmunizationRecord(sequelize, 'immunization-uuid', {
 *   adverseReaction: 'Mild soreness at injection site',
 *   notes: 'Patient tolerated well, no significant adverse events'
 * }, auditContext);
 * ```
 */
export declare function updateImmunizationRecord(sequelize: Sequelize, immunizationId: string, updates: Partial<ImmunizationRecord>, auditContext: AuditContext): Promise<ImmunizationRecord>;
/**
 * Retrieves complete immunization history for a patient.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} patientId - Patient ID
 * @param {AuditContext} auditContext - Audit context
 * @returns {Promise<ImmunizationRecord[]>} Immunization history
 *
 * @example
 * ```typescript
 * const history = await retrieveImmunizationHistory(sequelize, 'patient-uuid', auditContext);
 * history.forEach(i => console.log(`${i.vaccineName} - ${i.administrationDate.toLocaleDateString()}`));
 * ```
 */
export declare function retrieveImmunizationHistory(sequelize: Sequelize, patientId: string, auditContext: AuditContext): Promise<ImmunizationRecord[]>;
/**
 * Validates immunization schedule against CDC recommendations.
 *
 * @param {string} patientId - Patient ID
 * @param {Date} dateOfBirth - Patient date of birth
 * @param {ImmunizationRecord[]} immunizations - Patient immunization records
 * @returns {Promise<{ compliant: boolean; missing: string[]; upcoming: string[] }>} Schedule validation
 *
 * @example
 * ```typescript
 * const validation = await validateImmunizationSchedule(
 *   'patient-uuid',
 *   new Date('2020-01-15'),
 *   immunizations
 * );
 *
 * if (!validation.compliant) {
 *   console.log('Missing immunizations:', validation.missing);
 *   console.log('Upcoming immunizations:', validation.upcoming);
 * }
 * ```
 */
export declare function validateImmunizationSchedule(patientId: string, dateOfBirth: Date, immunizations: ImmunizationRecord[]): Promise<{
    compliant: boolean;
    missing: string[];
    upcoming: string[];
}>;
/**
 * Adds family health history entry.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Partial<FamilyHealthHistory>} historyData - Family history data
 * @param {AuditContext} auditContext - Audit context
 * @returns {Promise<FamilyHealthHistory>} Created family history entry
 *
 * @example
 * ```typescript
 * const history = await addFamilyHealthHistory(sequelize, {
 *   patientId: 'patient-uuid',
 *   relativeName: 'John Doe Sr.',
 *   relationship: 'parent',
 *   gender: 'male',
 *   condition: 'Coronary artery disease',
 *   icdCode: 'I25.10',
 *   ageAtOnset: 55,
 *   livingStatus: 'alive'
 * }, auditContext);
 * ```
 */
export declare function addFamilyHealthHistory(sequelize: Sequelize, historyData: Partial<FamilyHealthHistory>, auditContext: AuditContext): Promise<FamilyHealthHistory>;
/**
 * Updates family health history entry.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} historyId - Family history entry ID
 * @param {Partial<FamilyHealthHistory>} updates - Fields to update
 * @param {AuditContext} auditContext - Audit context
 * @returns {Promise<FamilyHealthHistory>} Updated family history entry
 *
 * @example
 * ```typescript
 * const updated = await updateFamilyHealthHistory(sequelize, 'history-uuid', {
 *   livingStatus: 'deceased',
 *   ageAtDeath: 68,
 *   causeOfDeath: 'Myocardial infarction'
 * }, auditContext);
 * ```
 */
export declare function updateFamilyHealthHistory(sequelize: Sequelize, historyId: string, updates: Partial<FamilyHealthHistory>, auditContext: AuditContext): Promise<FamilyHealthHistory>;
/**
 * Retrieves family health history for a patient.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} patientId - Patient ID
 * @param {AuditContext} auditContext - Audit context
 * @returns {Promise<FamilyHealthHistory[]>} Family health history
 *
 * @example
 * ```typescript
 * const history = await retrieveFamilyHealthHistory(sequelize, 'patient-uuid', auditContext);
 * history.forEach(h => console.log(`${h.relationship}: ${h.condition} (onset: ${h.ageAtOnset})`));
 * ```
 */
export declare function retrieveFamilyHealthHistory(sequelize: Sequelize, patientId: string, auditContext: AuditContext): Promise<FamilyHealthHistory[]>;
/**
 * Calculates genetic risk score based on family history.
 *
 * @param {FamilyHealthHistory[]} familyHistory - Family health history
 * @returns {Promise<{ condition: string; riskScore: number; riskLevel: string }[]>} Risk assessment
 *
 * @example
 * ```typescript
 * const risks = await calculateFamilyRiskScore(familyHistory);
 * risks.forEach(r => console.log(`${r.condition}: ${r.riskLevel} risk (score: ${r.riskScore})`));
 * ```
 */
export declare function calculateFamilyRiskScore(familyHistory: FamilyHealthHistory[]): Promise<{
    condition: string;
    riskScore: number;
    riskLevel: string;
}[]>;
/**
 * Tracks smoking history with pack-years calculation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} patientId - Patient ID
 * @param {string} status - Smoking status
 * @param {any} details - Smoking details (packsPerDay, years, quitDate)
 * @param {AuditContext} auditContext - Audit context
 * @returns {Promise<SocialHistory>} Smoking history record
 *
 * @example
 * ```typescript
 * const smokingHistory = await trackSmokingHistory(sequelize, 'patient-uuid', 'former', {
 *   packsPerDay: 1,
 *   yearsSmoked: 20,
 *   packYears: 20,
 *   quitDate: new Date('2020-01-01')
 * }, auditContext);
 * ```
 */
export declare function trackSmokingHistory(sequelize: Sequelize, patientId: string, status: string, details: any, auditContext: AuditContext): Promise<SocialHistory>;
/**
 * Tracks alcohol use history.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} patientId - Patient ID
 * @param {string} status - Alcohol use status
 * @param {any} details - Alcohol use details
 * @param {AuditContext} auditContext - Audit context
 * @returns {Promise<SocialHistory>} Alcohol use history record
 *
 * @example
 * ```typescript
 * const alcoholHistory = await trackAlcoholUse(sequelize, 'patient-uuid', 'current', {
 *   drinksPerWeek: 7,
 *   type: 'beer and wine',
 *   frequency: '3-4 times per week'
 * }, auditContext);
 * ```
 */
export declare function trackAlcoholUse(sequelize: Sequelize, patientId: string, status: string, details: any, auditContext: AuditContext): Promise<SocialHistory>;
/**
 * Tracks substance use screening results.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} patientId - Patient ID
 * @param {string} status - Substance use status
 * @param {any} details - Substance use details
 * @param {AuditContext} auditContext - Audit context
 * @returns {Promise<SocialHistory>} Substance use history record
 *
 * @example
 * ```typescript
 * const substanceHistory = await trackSubstanceUse(sequelize, 'patient-uuid', 'none', {
 *   screeningDate: new Date(),
 *   screeningTool: 'DAST-10',
 *   score: 0,
 *   interpretation: 'No drug abuse'
 * }, auditContext);
 * ```
 */
export declare function trackSubstanceUse(sequelize: Sequelize, patientId: string, status: string, details: any, auditContext: AuditContext): Promise<SocialHistory>;
/**
 * Tracks social determinants of health (SDOH).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} patientId - Patient ID
 * @param {any} sdohData - SDOH assessment data
 * @param {AuditContext} auditContext - Audit context
 * @returns {Promise<SocialHistory>} SDOH history record
 *
 * @example
 * ```typescript
 * const sdoh = await trackSocialDeterminants(sequelize, 'patient-uuid', {
 *   housingStability: 'stable',
 *   foodSecurity: 'secure',
 *   transportation: 'reliable',
 *   employment: 'employed',
 *   education: 'college degree',
 *   socialSupport: 'strong'
 * }, auditContext);
 * ```
 */
export declare function trackSocialDeterminants(sequelize: Sequelize, patientId: string, sdohData: any, auditContext: AuditContext): Promise<SocialHistory>;
/**
 * Adds surgical procedure to patient history.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Partial<SurgicalHistory>} surgeryData - Surgery data
 * @param {AuditContext} auditContext - Audit context
 * @returns {Promise<SurgicalHistory>} Created surgical history entry
 *
 * @example
 * ```typescript
 * const surgery = await addSurgicalProcedure(sequelize, {
 *   patientId: 'patient-uuid',
 *   procedureName: 'Laparoscopic Cholecystectomy',
 *   cptCode: '47562',
 *   surgeryDate: new Date('2023-05-15'),
 *   surgeon: 'surgeon-uuid',
 *   facilityId: 'facility-uuid',
 *   outcome: 'successful',
 *   anesthesiaType: 'General',
 *   notes: 'Uncomplicated procedure, patient recovered well'
 * }, auditContext);
 * ```
 */
export declare function addSurgicalProcedure(sequelize: Sequelize, surgeryData: Partial<SurgicalHistory>, auditContext: AuditContext): Promise<SurgicalHistory>;
/**
 * Updates surgical procedure record.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} surgeryId - Surgery record ID
 * @param {Partial<SurgicalHistory>} updates - Fields to update
 * @param {AuditContext} auditContext - Audit context
 * @returns {Promise<SurgicalHistory>} Updated surgical history entry
 *
 * @example
 * ```typescript
 * const updated = await updateSurgicalProcedure(sequelize, 'surgery-uuid', {
 *   outcome: 'complicated',
 *   complications: ['Post-operative infection', 'Wound dehiscence'],
 *   notes: 'Patient developed SSI, treated with antibiotics'
 * }, auditContext);
 * ```
 */
export declare function updateSurgicalProcedure(sequelize: Sequelize, surgeryId: string, updates: Partial<SurgicalHistory>, auditContext: AuditContext): Promise<SurgicalHistory>;
/**
 * Retrieves surgical history for a patient.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} patientId - Patient ID
 * @param {AuditContext} auditContext - Audit context
 * @returns {Promise<SurgicalHistory[]>} Surgical history
 *
 * @example
 * ```typescript
 * const history = await retrieveSurgicalHistory(sequelize, 'patient-uuid', auditContext);
 * history.forEach(s => console.log(`${s.procedureName} - ${s.surgeryDate.toLocaleDateString()}`));
 * ```
 */
export declare function retrieveSurgicalHistory(sequelize: Sequelize, patientId: string, auditContext: AuditContext): Promise<SurgicalHistory[]>;
/**
 * Registers medical device implant with UDI.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Partial<MedicalDevice>} deviceData - Device data
 * @param {AuditContext} auditContext - Audit context
 * @returns {Promise<MedicalDevice>} Created medical device record
 *
 * @example
 * ```typescript
 * const device = await registerMedicalDevice(sequelize, {
 *   patientId: 'patient-uuid',
 *   deviceName: 'Cardiac Pacemaker',
 *   deviceType: 'Cardiac rhythm management device',
 *   udiCode: '(01)12345678901234(21)SERIAL123',
 *   manufacturer: 'Medtronic',
 *   modelNumber: 'Advisa DR MRI',
 *   serialNumber: 'SERIAL123',
 *   implantDate: new Date(),
 *   status: 'active',
 *   location: 'Left pectoral region'
 * }, auditContext);
 * ```
 */
export declare function registerMedicalDevice(sequelize: Sequelize, deviceData: Partial<MedicalDevice>, auditContext: AuditContext): Promise<MedicalDevice>;
/**
 * Updates medical device status.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} deviceId - Device record ID
 * @param {Partial<MedicalDevice>} updates - Fields to update
 * @param {AuditContext} auditContext - Audit context
 * @returns {Promise<MedicalDevice>} Updated medical device record
 *
 * @example
 * ```typescript
 * const updated = await updateMedicalDeviceStatus(sequelize, 'device-uuid', {
 *   status: 'removed',
 *   removalDate: new Date(),
 *   notes: 'Device replaced due to battery depletion'
 * }, auditContext);
 * ```
 */
export declare function updateMedicalDeviceStatus(sequelize: Sequelize, deviceId: string, updates: Partial<MedicalDevice>, auditContext: AuditContext): Promise<MedicalDevice>;
/**
 * Retrieves active medical devices for a patient.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} patientId - Patient ID
 * @param {AuditContext} auditContext - Audit context
 * @returns {Promise<MedicalDevice[]>} Active medical devices
 *
 * @example
 * ```typescript
 * const devices = await retrieveActiveMedicalDevices(sequelize, 'patient-uuid', auditContext);
 * devices.forEach(d => console.log(`${d.deviceName} - ${d.implantDate.toLocaleDateString()}`));
 * ```
 */
export declare function retrieveActiveMedicalDevices(sequelize: Sequelize, patientId: string, auditContext: AuditContext): Promise<MedicalDevice[]>;
/**
 * Creates a version snapshot of any record type.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} recordId - Record ID
 * @param {string} recordType - Record type
 * @param {any} snapshot - Record snapshot data
 * @param {AuditContext} auditContext - Audit context
 * @returns {Promise<RecordVersion>} Created version record
 *
 * @example
 * ```typescript
 * const version = await createRecordVersion(
 *   sequelize,
 *   'record-uuid',
 *   'EHR_RECORD',
 *   currentRecordData,
 *   auditContext
 * );
 * ```
 */
export declare function createRecordVersion(sequelize: Sequelize, recordId: string, recordType: string, snapshot: any, auditContext: AuditContext): Promise<RecordVersion>;
/**
 * Retrieves complete version history for a record.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} recordId - Record ID
 * @param {AuditContext} auditContext - Audit context
 * @returns {Promise<RecordVersion[]>} Version history
 *
 * @example
 * ```typescript
 * const history = await retrieveRecordHistory(sequelize, 'record-uuid', auditContext);
 * history.forEach(v => console.log(`Version ${v.version} by ${v.changedBy} at ${v.createdAt}`));
 * ```
 */
export declare function retrieveRecordHistory(sequelize: Sequelize, recordId: string, auditContext: AuditContext): Promise<RecordVersion[]>;
/**
 * Compares two versions of a record and returns differences.
 *
 * @param {RecordVersion} version1 - First version
 * @param {RecordVersion} version2 - Second version
 * @returns {Promise<{ field: string; oldValue: any; newValue: any }[]>} Differences
 *
 * @example
 * ```typescript
 * const differences = await compareRecordVersions(versionHistory[0], versionHistory[1]);
 * differences.forEach(diff => {
 *   console.log(`${diff.field}: ${diff.oldValue} → ${diff.newValue}`);
 * });
 * ```
 */
export declare function compareRecordVersions(version1: RecordVersion, version2: RecordVersion): Promise<{
    field: string;
    oldValue: any;
    newValue: any;
}[]>;
/**
 * Exports patient medical records to CCR (Continuity of Care Record) format.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} patientId - Patient ID
 * @param {AuditContext} auditContext - Audit context
 * @returns {Promise<string>} CCR XML document
 *
 * @example
 * ```typescript
 * const ccrXml = await exportToCCR(sequelize, 'patient-uuid', auditContext);
 * // Save to file or transmit to external system
 * fs.writeFileSync('patient-ccr.xml', ccrXml);
 * ```
 */
export declare function exportToCCR(sequelize: Sequelize, patientId: string, auditContext: AuditContext): Promise<string>;
/**
 * Exports patient medical records to CCD (Continuity of Care Document) format.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} patientId - Patient ID
 * @param {AuditContext} auditContext - Audit context
 * @returns {Promise<string>} CCD XML document
 *
 * @example
 * ```typescript
 * const ccdXml = await exportToCCD(sequelize, 'patient-uuid', auditContext);
 * // Transmit via Direct messaging or HISP
 * await sendDirectMessage(recipientAddress, ccdXml);
 * ```
 */
export declare function exportToCCD(sequelize: Sequelize, patientId: string, auditContext: AuditContext): Promise<string>;
/**
 * Exports patient medical records to FHIR R4 Bundle format.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} patientId - Patient ID
 * @param {AuditContext} auditContext - Audit context
 * @returns {Promise<any>} FHIR Bundle JSON
 *
 * @example
 * ```typescript
 * const fhirBundle = await exportToFhir(sequelize, 'patient-uuid', auditContext);
 * // POST to FHIR server
 * await fetch('https://fhir.example.com/Bundle', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/fhir+json' },
 *   body: JSON.stringify(fhirBundle)
 * });
 * ```
 */
export declare function exportToFhir(sequelize: Sequelize, patientId: string, auditContext: AuditContext): Promise<any>;
/**
 * Imports medical records from external systems (HL7, CCD, FHIR).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} patientId - Patient ID
 * @param {ExportFormat} format - Source format
 * @param {string | any} data - Import data
 * @param {AuditContext} auditContext - Audit context
 * @returns {Promise<{ imported: number; errors: string[] }>} Import results
 *
 * @example
 * ```typescript
 * const ccdXml = fs.readFileSync('external-ccd.xml', 'utf8');
 * const result = await importFromExternalSystem(
 *   sequelize,
 *   'patient-uuid',
 *   'CCD',
 *   ccdXml,
 *   auditContext
 * );
 *
 * console.log(`Imported ${result.imported} records`);
 * if (result.errors.length > 0) {
 *   console.error('Import errors:', result.errors);
 * }
 * ```
 */
export declare function importFromExternalSystem(sequelize: Sequelize, patientId: string, format: ExportFormat, data: string | any, auditContext: AuditContext): Promise<{
    imported: number;
    errors: string[];
}>;
//# sourceMappingURL=health-medical-records-kit.d.ts.map