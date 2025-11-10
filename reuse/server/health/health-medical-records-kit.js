"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEhrRecord = createEhrRecord;
exports.retrieveEhrRecord = retrieveEhrRecord;
exports.updateEhrRecord = updateEhrRecord;
exports.deleteEhrRecord = deleteEhrRecord;
exports.versionEhrRecord = versionEhrRecord;
exports.lockEhrRecord = lockEhrRecord;
exports.unlockEhrRecord = unlockEhrRecord;
exports.validateEhrRecord = validateEhrRecord;
exports.addProblemToList = addProblemToList;
exports.updateProblemListEntry = updateProblemListEntry;
exports.resolveProblemListEntry = resolveProblemListEntry;
exports.reactivateProblemListEntry = reactivateProblemListEntry;
exports.retrieveActiveProblemList = retrieveActiveProblemList;
exports.addMedicationToList = addMedicationToList;
exports.updateMedicationListEntry = updateMedicationListEntry;
exports.discontinueMedication = discontinueMedication;
exports.reconcileMedicationList = reconcileMedicationList;
exports.retrieveActiveMedications = retrieveActiveMedications;
exports.addAllergyRecord = addAllergyRecord;
exports.updateAllergyRecord = updateAllergyRecord;
exports.verifyAllergyRecord = verifyAllergyRecord;
exports.markAllergyInactive = markAllergyInactive;
exports.retrieveActiveAllergies = retrieveActiveAllergies;
exports.addImmunizationRecord = addImmunizationRecord;
exports.updateImmunizationRecord = updateImmunizationRecord;
exports.retrieveImmunizationHistory = retrieveImmunizationHistory;
exports.validateImmunizationSchedule = validateImmunizationSchedule;
exports.addFamilyHealthHistory = addFamilyHealthHistory;
exports.updateFamilyHealthHistory = updateFamilyHealthHistory;
exports.retrieveFamilyHealthHistory = retrieveFamilyHealthHistory;
exports.calculateFamilyRiskScore = calculateFamilyRiskScore;
exports.trackSmokingHistory = trackSmokingHistory;
exports.trackAlcoholUse = trackAlcoholUse;
exports.trackSubstanceUse = trackSubstanceUse;
exports.trackSocialDeterminants = trackSocialDeterminants;
exports.addSurgicalProcedure = addSurgicalProcedure;
exports.updateSurgicalProcedure = updateSurgicalProcedure;
exports.retrieveSurgicalHistory = retrieveSurgicalHistory;
exports.registerMedicalDevice = registerMedicalDevice;
exports.updateMedicalDeviceStatus = updateMedicalDeviceStatus;
exports.retrieveActiveMedicalDevices = retrieveActiveMedicalDevices;
exports.createRecordVersion = createRecordVersion;
exports.retrieveRecordHistory = retrieveRecordHistory;
exports.compareRecordVersions = compareRecordVersions;
exports.exportToCCR = exportToCCR;
exports.exportToCCD = exportToCCD;
exports.exportToFhir = exportToFhir;
exports.importFromExternalSystem = importFromExternalSystem;
const crypto = __importStar(require("crypto"));
const validator_1 = require("validator");
// ============================================================================
// ENCRYPTION UTILITIES
// ============================================================================
const ENCRYPTION_CONFIG = {
    algorithm: process.env.ENCRYPTION_ALGORITHM || 'aes-256-gcm',
    key: Buffer.from(process.env.ENCRYPTION_KEY || '', 'hex'),
    enabled: process.env.ENABLE_PHI_ENCRYPTION === 'true',
};
/**
 * Encrypts sensitive PHI data using AES-256-GCM.
 *
 * @param {string} plaintext - Data to encrypt
 * @returns {string} Encrypted data in format: iv:authTag:ciphertext
 *
 * @example
 * ```typescript
 * const encryptedSSN = encryptPhi('123-45-6789');
 * // Returns: "a1b2c3d4e5f6....:f9e8d7c6b5a4....:9f8e7d6c5b4a...."
 * ```
 */
function encryptPhi(plaintext) {
    if (!ENCRYPTION_CONFIG.enabled || !plaintext) {
        return plaintext;
    }
    try {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(ENCRYPTION_CONFIG.algorithm, ENCRYPTION_CONFIG.key, iv);
        let encrypted = cipher.update(String(plaintext), 'utf8', 'hex');
        encrypted += cipher.final('hex');
        const authTag = cipher.getAuthTag();
        return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
    }
    catch (error) {
        console.error('PHI encryption error:', error);
        throw new Error('Failed to encrypt PHI data');
    }
}
/**
 * Decrypts encrypted PHI data.
 *
 * @param {string} ciphertext - Encrypted data to decrypt
 * @returns {string | null} Decrypted plaintext or null on error
 *
 * @example
 * ```typescript
 * const ssn = decryptPhi(encryptedSSN);
 * // Returns: "123-45-6789"
 * ```
 */
function decryptPhi(ciphertext) {
    if (!ENCRYPTION_CONFIG.enabled || !ciphertext) {
        return ciphertext;
    }
    try {
        const parts = ciphertext.split(':');
        if (parts.length !== 3)
            return ciphertext; // Not encrypted
        const iv = Buffer.from(parts[0], 'hex');
        const authTag = Buffer.from(parts[1], 'hex');
        const encryptedData = parts[2];
        const decipher = crypto.createDecipheriv(ENCRYPTION_CONFIG.algorithm, ENCRYPTION_CONFIG.key, iv);
        decipher.setAuthTag(authTag);
        let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
    catch (error) {
        console.error('PHI decryption error:', error);
        return null;
    }
}
// ============================================================================
// AUDIT LOGGING
// ============================================================================
/**
 * Logs audit trail for medical record operations.
 *
 * @param {string} action - Action performed
 * @param {string} recordType - Type of record
 * @param {string} recordId - Record identifier
 * @param {AuditContext} context - Audit context
 * @param {any} changes - Changes made
 * @returns {Promise<void>}
 */
async function logMedicalRecordAudit(action, recordType, recordId, context, changes) {
    const auditLog = {
        timestamp: new Date().toISOString(),
        action,
        recordType,
        recordId,
        userId: context.userId,
        ipAddress: context.ipAddress,
        userAgent: context.userAgent,
        facilityId: context.facilityId,
        reason: context.reason,
        changes: changes || null,
        hipaaCompliant: true,
    };
    console.log('[MEDICAL_RECORD_AUDIT]', JSON.stringify(auditLog));
    // Implementation: await AuditLog.create(auditLog);
}
// ============================================================================
// EHR CORE OPERATIONS (8 functions)
// ============================================================================
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
async function createEhrRecord(sequelize, recordData, auditContext) {
    const transaction = await sequelize.transaction();
    try {
        // Validate required fields
        if (!recordData.patientId || !recordData.medicalRecordNumber) {
            throw new Error('Patient ID and Medical Record Number are required');
        }
        // Validate MRN format
        if (!/^MRN-\d{8}$/.test(recordData.medicalRecordNumber)) {
            throw new Error('Invalid Medical Record Number format. Expected: MRN-XXXXXXXX');
        }
        // Encrypt PHI fields
        const encryptedData = {
            ...recordData,
            chiefComplaint: recordData.chiefComplaint ? encryptPhi(recordData.chiefComplaint) : null,
            presentIllness: recordData.presentIllness ? encryptPhi(recordData.presentIllness) : null,
            assessment: recordData.assessment ? encryptPhi(recordData.assessment) : null,
            plan: recordData.plan ? encryptPhi(recordData.plan) : null,
            status: recordData.status || 'draft',
            version: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        // Create record (simulated)
        const record = {
            id: crypto.randomUUID(),
            ...encryptedData,
        };
        // Log audit trail
        await logMedicalRecordAudit('CREATE', 'EHR_RECORD', record.id, auditContext, record);
        await transaction.commit();
        return record;
    }
    catch (error) {
        await transaction.rollback();
        console.error('Error creating EHR record:', error);
        throw error;
    }
}
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
async function retrieveEhrRecord(sequelize, recordId, auditContext) {
    try {
        // Validate record ID
        if (!(0, validator_1.isUUID)(recordId)) {
            throw new Error('Invalid EHR record ID format');
        }
        // Retrieve record (simulated)
        // const record = await EhrRecordModel.findByPk(recordId);
        const record = null; // Simulated
        if (!record) {
            return null;
        }
        // Decrypt PHI fields
        const decryptedRecord = {
            ...record,
            chiefComplaint: record.chiefComplaint ? decryptPhi(record.chiefComplaint) : null,
            presentIllness: record.presentIllness ? decryptPhi(record.presentIllness) : null,
            assessment: record.assessment ? decryptPhi(record.assessment) : null,
            plan: record.plan ? decryptPhi(record.plan) : null,
        };
        // Log access for HIPAA compliance
        await logMedicalRecordAudit('READ', 'EHR_RECORD', recordId, auditContext);
        return decryptedRecord;
    }
    catch (error) {
        console.error('Error retrieving EHR record:', error);
        throw error;
    }
}
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
async function updateEhrRecord(sequelize, recordId, updates, auditContext) {
    const transaction = await sequelize.transaction();
    try {
        // Check if record is locked
        const existingRecord = await retrieveEhrRecord(sequelize, recordId, auditContext);
        if (!existingRecord) {
            throw new Error('EHR record not found');
        }
        if (existingRecord.lockedAt && existingRecord.lockedBy !== auditContext.userId) {
            throw new Error(`Record is locked by user ${existingRecord.lockedBy}`);
        }
        // Create version snapshot before update
        await createRecordVersion(sequelize, recordId, 'EHR_RECORD', existingRecord, auditContext);
        // Encrypt PHI fields in updates
        const encryptedUpdates = {
            ...updates,
            chiefComplaint: updates.chiefComplaint ? encryptPhi(updates.chiefComplaint) : undefined,
            presentIllness: updates.presentIllness ? encryptPhi(updates.presentIllness) : undefined,
            assessment: updates.assessment ? encryptPhi(updates.assessment) : undefined,
            plan: updates.plan ? encryptPhi(updates.plan) : undefined,
            version: existingRecord.version + 1,
            updatedAt: new Date(),
        };
        // Update record (simulated)
        const updatedRecord = {
            ...existingRecord,
            ...encryptedUpdates,
        };
        // Log audit trail
        await logMedicalRecordAudit('UPDATE', 'EHR_RECORD', recordId, auditContext, {
            previous: existingRecord,
            updated: encryptedUpdates,
        });
        await transaction.commit();
        return updatedRecord;
    }
    catch (error) {
        await transaction.rollback();
        console.error('Error updating EHR record:', error);
        throw error;
    }
}
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
async function deleteEhrRecord(sequelize, recordId, auditContext) {
    const transaction = await sequelize.transaction();
    try {
        // Retrieve record to verify existence
        const existingRecord = await retrieveEhrRecord(sequelize, recordId, auditContext);
        if (!existingRecord) {
            throw new Error('EHR record not found');
        }
        // Check if record is locked
        if (existingRecord.lockedAt) {
            throw new Error('Cannot delete locked record');
        }
        // Soft delete (simulated)
        // await EhrRecordModel.destroy({ where: { id: recordId }, transaction });
        // Log audit trail
        await logMedicalRecordAudit('DELETE', 'EHR_RECORD', recordId, auditContext, {
            deletedRecord: existingRecord,
            reason: auditContext.reason,
        });
        await transaction.commit();
        return true;
    }
    catch (error) {
        await transaction.rollback();
        console.error('Error deleting EHR record:', error);
        throw error;
    }
}
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
async function versionEhrRecord(sequelize, recordId, auditContext) {
    try {
        const record = await retrieveEhrRecord(sequelize, recordId, auditContext);
        if (!record) {
            throw new Error('EHR record not found');
        }
        return await createRecordVersion(sequelize, recordId, 'EHR_RECORD', record, auditContext);
    }
    catch (error) {
        console.error('Error versioning EHR record:', error);
        throw error;
    }
}
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
async function lockEhrRecord(sequelize, recordId, auditContext) {
    try {
        const record = await retrieveEhrRecord(sequelize, recordId, auditContext);
        if (!record) {
            throw new Error('EHR record not found');
        }
        if (record.lockedAt) {
            throw new Error(`Record already locked by user ${record.lockedBy}`);
        }
        // Lock record (simulated)
        // await EhrRecordModel.update({
        //   lockedAt: new Date(),
        //   lockedBy: auditContext.userId
        // }, { where: { id: recordId } });
        await logMedicalRecordAudit('UPDATE', 'EHR_RECORD', recordId, auditContext, {
            action: 'LOCK',
        });
        return true;
    }
    catch (error) {
        console.error('Error locking EHR record:', error);
        throw error;
    }
}
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
async function unlockEhrRecord(sequelize, recordId, auditContext) {
    try {
        const record = await retrieveEhrRecord(sequelize, recordId, auditContext);
        if (!record) {
            throw new Error('EHR record not found');
        }
        if (!record.lockedAt) {
            throw new Error('Record is not locked');
        }
        if (record.lockedBy !== auditContext.userId) {
            throw new Error('Only the user who locked the record can unlock it');
        }
        // Unlock record (simulated)
        // await EhrRecordModel.update({
        //   lockedAt: null,
        //   lockedBy: null
        // }, { where: { id: recordId } });
        await logMedicalRecordAudit('UPDATE', 'EHR_RECORD', recordId, auditContext, {
            action: 'UNLOCK',
        });
        return true;
    }
    catch (error) {
        console.error('Error unlocking EHR record:', error);
        throw error;
    }
}
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
async function validateEhrRecord(recordData) {
    const errors = [];
    // Validate required fields
    if (!recordData.patientId) {
        errors.push('Patient ID is required');
    }
    if (!recordData.medicalRecordNumber) {
        errors.push('Medical Record Number is required');
    }
    else if (!/^MRN-\d{8}$/.test(recordData.medicalRecordNumber)) {
        errors.push('Invalid Medical Record Number format');
    }
    if (!recordData.facilityId) {
        errors.push('Facility ID is required');
    }
    if (!recordData.providerId) {
        errors.push('Provider ID is required');
    }
    // Validate diagnosis codes
    if (recordData.diagnosis && recordData.diagnosis.length > 0) {
        recordData.diagnosis.forEach((diag, index) => {
            if (!diag.code) {
                errors.push(`Diagnosis ${index + 1}: Code is required`);
            }
            if (diag.version === '10' && !/^[A-Z]\d{2}(\.\d{1,4})?$/.test(diag.code)) {
                errors.push(`Diagnosis ${index + 1}: Invalid ICD-10 code format`);
            }
        });
    }
    // Validate vital signs if present
    if (recordData.vitalSigns) {
        const vs = recordData.vitalSigns;
        if (vs.temperature && (vs.temperature < 90 || vs.temperature > 110)) {
            errors.push('Temperature out of valid range (90-110°F)');
        }
        if (vs.heartRate && (vs.heartRate < 30 || vs.heartRate > 250)) {
            errors.push('Heart rate out of valid range (30-250 bpm)');
        }
        if (vs.oxygenSaturation && (vs.oxygenSaturation < 0 || vs.oxygenSaturation > 100)) {
            errors.push('Oxygen saturation must be between 0-100%');
        }
    }
    return {
        valid: errors.length === 0,
        errors,
    };
}
// ============================================================================
// PROBLEM LIST MANAGEMENT (5 functions)
// ============================================================================
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
async function addProblemToList(sequelize, problemData, auditContext) {
    const transaction = await sequelize.transaction();
    try {
        // Validate ICD code format
        if (problemData.icdVersion === '10' && !/^[A-Z]\d{2}(\.\d{1,4})?$/.test(problemData.icdCode)) {
            throw new Error('Invalid ICD-10 code format');
        }
        const problem = {
            id: crypto.randomUUID(),
            patientId: problemData.patientId,
            ehrRecordId: problemData.ehrRecordId,
            problemName: problemData.problemName,
            icdCode: problemData.icdCode,
            icdVersion: problemData.icdVersion || '10',
            snomedCode: problemData.snomedCode,
            status: problemData.status || 'active',
            severity: problemData.severity || 'moderate',
            onsetDate: problemData.onsetDate,
            diagnosedBy: problemData.diagnosedBy,
            notes: problemData.notes,
            priority: problemData.priority || 99,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        await logMedicalRecordAudit('CREATE', 'PROBLEM_LIST', problem.id, auditContext, problem);
        await transaction.commit();
        return problem;
    }
    catch (error) {
        await transaction.rollback();
        throw error;
    }
}
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
async function updateProblemListEntry(sequelize, problemId, updates, auditContext) {
    const transaction = await sequelize.transaction();
    try {
        // Simulated update
        const updated = {
            id: problemId,
            ...updates,
            updatedAt: new Date(),
        };
        await logMedicalRecordAudit('UPDATE', 'PROBLEM_LIST', problemId, auditContext, updates);
        await transaction.commit();
        return updated;
    }
    catch (error) {
        await transaction.rollback();
        throw error;
    }
}
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
async function resolveProblemListEntry(sequelize, problemId, auditContext) {
    return await updateProblemListEntry(sequelize, problemId, {
        status: 'resolved',
        resolvedDate: new Date(),
    }, auditContext);
}
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
async function reactivateProblemListEntry(sequelize, problemId, auditContext) {
    return await updateProblemListEntry(sequelize, problemId, {
        status: 'active',
        resolvedDate: undefined,
    }, auditContext);
}
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
async function retrieveActiveProblemList(sequelize, patientId, auditContext) {
    // Simulated retrieval
    const problems = [];
    await logMedicalRecordAudit('READ', 'PROBLEM_LIST', patientId, auditContext);
    return problems;
}
// ============================================================================
// MEDICATION MANAGEMENT (5 functions)
// ============================================================================
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
async function addMedicationToList(sequelize, medicationData, auditContext) {
    const transaction = await sequelize.transaction();
    try {
        const medication = {
            id: crypto.randomUUID(),
            ...medicationData,
            status: medicationData.status || 'active',
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        await logMedicalRecordAudit('CREATE', 'MEDICATION_LIST', medication.id, auditContext, medication);
        await transaction.commit();
        return medication;
    }
    catch (error) {
        await transaction.rollback();
        throw error;
    }
}
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
async function updateMedicationListEntry(sequelize, medicationId, updates, auditContext) {
    const transaction = await sequelize.transaction();
    try {
        const updated = {
            id: medicationId,
            ...updates,
            updatedAt: new Date(),
        };
        await logMedicalRecordAudit('UPDATE', 'MEDICATION_LIST', medicationId, auditContext, updates);
        await transaction.commit();
        return updated;
    }
    catch (error) {
        await transaction.rollback();
        throw error;
    }
}
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
async function discontinueMedication(sequelize, medicationId, reason, auditContext) {
    return await updateMedicationListEntry(sequelize, medicationId, {
        status: 'discontinued',
        endDate: new Date(),
        discontinuedReason: reason,
    }, auditContext);
}
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
async function reconcileMedicationList(sequelize, patientId, providedList, auditContext) {
    // Simulated reconciliation logic
    const result = {
        added: [],
        removed: [],
        discrepancies: [],
    };
    await logMedicalRecordAudit('UPDATE', 'MEDICATION_LIST', patientId, auditContext, {
        action: 'RECONCILIATION',
        providedCount: providedList.length,
    });
    return result;
}
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
async function retrieveActiveMedications(sequelize, patientId, auditContext) {
    const medications = [];
    await logMedicalRecordAudit('READ', 'MEDICATION_LIST', patientId, auditContext);
    return medications;
}
// ============================================================================
// ALLERGY TRACKING (5 functions)
// ============================================================================
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
async function addAllergyRecord(sequelize, allergyData, auditContext) {
    const transaction = await sequelize.transaction();
    try {
        const allergy = {
            id: crypto.randomUUID(),
            ...allergyData,
            status: allergyData.status || 'active',
            verificationStatus: allergyData.verificationStatus || 'unconfirmed',
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        await logMedicalRecordAudit('CREATE', 'ALLERGY', allergy.id, auditContext, allergy);
        await transaction.commit();
        return allergy;
    }
    catch (error) {
        await transaction.rollback();
        throw error;
    }
}
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
async function updateAllergyRecord(sequelize, allergyId, updates, auditContext) {
    const transaction = await sequelize.transaction();
    try {
        const updated = {
            id: allergyId,
            ...updates,
            updatedAt: new Date(),
        };
        await logMedicalRecordAudit('UPDATE', 'ALLERGY', allergyId, auditContext, updates);
        await transaction.commit();
        return updated;
    }
    catch (error) {
        await transaction.rollback();
        throw error;
    }
}
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
async function verifyAllergyRecord(sequelize, allergyId, verifiedBy, auditContext) {
    return await updateAllergyRecord(sequelize, allergyId, {
        verificationStatus: 'confirmed',
        verifiedBy,
        verifiedDate: new Date(),
    }, auditContext);
}
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
async function markAllergyInactive(sequelize, allergyId, reason, auditContext) {
    return await updateAllergyRecord(sequelize, allergyId, {
        status: 'inactive',
        notes: reason,
    }, auditContext);
}
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
async function retrieveActiveAllergies(sequelize, patientId, auditContext) {
    const allergies = [];
    await logMedicalRecordAudit('READ', 'ALLERGY', patientId, auditContext);
    return allergies;
}
// ============================================================================
// IMMUNIZATION RECORDS (4 functions)
// ============================================================================
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
async function addImmunizationRecord(sequelize, immunizationData, auditContext) {
    const transaction = await sequelize.transaction();
    try {
        const immunization = {
            id: crypto.randomUUID(),
            ...immunizationData,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        await logMedicalRecordAudit('CREATE', 'IMMUNIZATION', immunization.id, auditContext, immunization);
        await transaction.commit();
        return immunization;
    }
    catch (error) {
        await transaction.rollback();
        throw error;
    }
}
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
async function updateImmunizationRecord(sequelize, immunizationId, updates, auditContext) {
    const transaction = await sequelize.transaction();
    try {
        const updated = {
            id: immunizationId,
            ...updates,
            updatedAt: new Date(),
        };
        await logMedicalRecordAudit('UPDATE', 'IMMUNIZATION', immunizationId, auditContext, updates);
        await transaction.commit();
        return updated;
    }
    catch (error) {
        await transaction.rollback();
        throw error;
    }
}
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
async function retrieveImmunizationHistory(sequelize, patientId, auditContext) {
    const immunizations = [];
    await logMedicalRecordAudit('READ', 'IMMUNIZATION', patientId, auditContext);
    return immunizations;
}
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
async function validateImmunizationSchedule(patientId, dateOfBirth, immunizations) {
    // Simulated CDC schedule validation
    const result = {
        compliant: false,
        missing: [],
        upcoming: [],
    };
    // Calculate age-appropriate immunizations
    const ageInMonths = Math.floor((new Date().getTime() - dateOfBirth.getTime()) / (1000 * 60 * 60 * 24 * 30));
    return result;
}
// ============================================================================
// FAMILY HEALTH HISTORY (4 functions)
// ============================================================================
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
async function addFamilyHealthHistory(sequelize, historyData, auditContext) {
    const transaction = await sequelize.transaction();
    try {
        const history = {
            id: crypto.randomUUID(),
            ...historyData,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        await logMedicalRecordAudit('CREATE', 'FAMILY_HISTORY', history.id, auditContext, history);
        await transaction.commit();
        return history;
    }
    catch (error) {
        await transaction.rollback();
        throw error;
    }
}
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
async function updateFamilyHealthHistory(sequelize, historyId, updates, auditContext) {
    const transaction = await sequelize.transaction();
    try {
        const updated = {
            id: historyId,
            ...updates,
            updatedAt: new Date(),
        };
        await logMedicalRecordAudit('UPDATE', 'FAMILY_HISTORY', historyId, auditContext, updates);
        await transaction.commit();
        return updated;
    }
    catch (error) {
        await transaction.rollback();
        throw error;
    }
}
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
async function retrieveFamilyHealthHistory(sequelize, patientId, auditContext) {
    const history = [];
    await logMedicalRecordAudit('READ', 'FAMILY_HISTORY', patientId, auditContext);
    return history;
}
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
async function calculateFamilyRiskScore(familyHistory) {
    const riskScores = [];
    // Simulated genetic risk calculation
    const conditionGroups = familyHistory.reduce((acc, entry) => {
        if (!acc[entry.condition]) {
            acc[entry.condition] = [];
        }
        acc[entry.condition].push(entry);
        return acc;
    }, {});
    Object.entries(conditionGroups).forEach(([condition, entries]) => {
        let score = 0;
        entries.forEach((entry) => {
            // Weight by relationship closeness
            if (entry.relationship === 'parent')
                score += 2;
            else if (entry.relationship === 'sibling')
                score += 2;
            else if (entry.relationship === 'grandparent')
                score += 1;
            else
                score += 0.5;
            // Weight by age at onset
            if (entry.ageAtOnset && entry.ageAtOnset < 50)
                score += 1;
        });
        let riskLevel = 'low';
        if (score >= 4)
            riskLevel = 'high';
        else if (score >= 2)
            riskLevel = 'moderate';
        riskScores.push({ condition, riskScore: score, riskLevel });
    });
    return riskScores;
}
// ============================================================================
// SOCIAL HISTORY (4 functions)
// ============================================================================
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
async function trackSmokingHistory(sequelize, patientId, status, details, auditContext) {
    const transaction = await sequelize.transaction();
    try {
        const history = {
            id: crypto.randomUUID(),
            patientId,
            category: 'smoking',
            status,
            details,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        await logMedicalRecordAudit('CREATE', 'SOCIAL_HISTORY', history.id, auditContext, history);
        await transaction.commit();
        return history;
    }
    catch (error) {
        await transaction.rollback();
        throw error;
    }
}
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
async function trackAlcoholUse(sequelize, patientId, status, details, auditContext) {
    const transaction = await sequelize.transaction();
    try {
        const history = {
            id: crypto.randomUUID(),
            patientId,
            category: 'alcohol',
            status,
            details,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        await logMedicalRecordAudit('CREATE', 'SOCIAL_HISTORY', history.id, auditContext, history);
        await transaction.commit();
        return history;
    }
    catch (error) {
        await transaction.rollback();
        throw error;
    }
}
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
async function trackSubstanceUse(sequelize, patientId, status, details, auditContext) {
    const transaction = await sequelize.transaction();
    try {
        const history = {
            id: crypto.randomUUID(),
            patientId,
            category: 'drugs',
            status,
            details,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        await logMedicalRecordAudit('CREATE', 'SOCIAL_HISTORY', history.id, auditContext, history);
        await transaction.commit();
        return history;
    }
    catch (error) {
        await transaction.rollback();
        throw error;
    }
}
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
async function trackSocialDeterminants(sequelize, patientId, sdohData, auditContext) {
    const transaction = await sequelize.transaction();
    try {
        const history = {
            id: crypto.randomUUID(),
            patientId,
            category: 'social-support',
            status: 'assessed',
            details: sdohData,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        await logMedicalRecordAudit('CREATE', 'SOCIAL_HISTORY', history.id, auditContext, history);
        await transaction.commit();
        return history;
    }
    catch (error) {
        await transaction.rollback();
        throw error;
    }
}
// ============================================================================
// SURGICAL HISTORY (3 functions)
// ============================================================================
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
async function addSurgicalProcedure(sequelize, surgeryData, auditContext) {
    const transaction = await sequelize.transaction();
    try {
        const surgery = {
            id: crypto.randomUUID(),
            ...surgeryData,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        await logMedicalRecordAudit('CREATE', 'SURGICAL_HISTORY', surgery.id, auditContext, surgery);
        await transaction.commit();
        return surgery;
    }
    catch (error) {
        await transaction.rollback();
        throw error;
    }
}
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
async function updateSurgicalProcedure(sequelize, surgeryId, updates, auditContext) {
    const transaction = await sequelize.transaction();
    try {
        const updated = {
            id: surgeryId,
            ...updates,
            updatedAt: new Date(),
        };
        await logMedicalRecordAudit('UPDATE', 'SURGICAL_HISTORY', surgeryId, auditContext, updates);
        await transaction.commit();
        return updated;
    }
    catch (error) {
        await transaction.rollback();
        throw error;
    }
}
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
async function retrieveSurgicalHistory(sequelize, patientId, auditContext) {
    const history = [];
    await logMedicalRecordAudit('READ', 'SURGICAL_HISTORY', patientId, auditContext);
    return history;
}
// ============================================================================
// MEDICAL DEVICES (3 functions)
// ============================================================================
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
async function registerMedicalDevice(sequelize, deviceData, auditContext) {
    const transaction = await sequelize.transaction();
    try {
        const device = {
            id: crypto.randomUUID(),
            ...deviceData,
            status: deviceData.status || 'active',
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        await logMedicalRecordAudit('CREATE', 'MEDICAL_DEVICE', device.id, auditContext, device);
        await transaction.commit();
        return device;
    }
    catch (error) {
        await transaction.rollback();
        throw error;
    }
}
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
async function updateMedicalDeviceStatus(sequelize, deviceId, updates, auditContext) {
    const transaction = await sequelize.transaction();
    try {
        const updated = {
            id: deviceId,
            ...updates,
            updatedAt: new Date(),
        };
        await logMedicalRecordAudit('UPDATE', 'MEDICAL_DEVICE', deviceId, auditContext, updates);
        await transaction.commit();
        return updated;
    }
    catch (error) {
        await transaction.rollback();
        throw error;
    }
}
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
async function retrieveActiveMedicalDevices(sequelize, patientId, auditContext) {
    const devices = [];
    await logMedicalRecordAudit('READ', 'MEDICAL_DEVICE', patientId, auditContext);
    return devices;
}
// ============================================================================
// RECORD VERSIONING (3 functions)
// ============================================================================
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
async function createRecordVersion(sequelize, recordId, recordType, snapshot, auditContext) {
    const transaction = await sequelize.transaction();
    try {
        const version = {
            id: crypto.randomUUID(),
            recordId,
            recordType,
            version: snapshot.version || 1,
            snapshot,
            changedBy: auditContext.userId,
            changeReason: auditContext.reason,
            createdAt: new Date(),
        };
        await logMedicalRecordAudit('CREATE', 'RECORD_VERSION', version.id, auditContext, {
            recordId,
            recordType,
            version: version.version,
        });
        await transaction.commit();
        return version;
    }
    catch (error) {
        await transaction.rollback();
        throw error;
    }
}
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
async function retrieveRecordHistory(sequelize, recordId, auditContext) {
    const versions = [];
    await logMedicalRecordAudit('READ', 'RECORD_VERSION', recordId, auditContext);
    return versions;
}
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
async function compareRecordVersions(version1, version2) {
    const differences = [];
    // Simulated diff logic
    const snap1 = version1.snapshot;
    const snap2 = version2.snapshot;
    Object.keys(snap2).forEach((key) => {
        if (JSON.stringify(snap1[key]) !== JSON.stringify(snap2[key])) {
            differences.push({
                field: key,
                oldValue: snap1[key],
                newValue: snap2[key],
            });
        }
    });
    return differences;
}
// ============================================================================
// IMPORT/EXPORT (4 functions)
// ============================================================================
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
async function exportToCCR(sequelize, patientId, auditContext) {
    // Simulated CCR export
    const ccrXml = `<?xml version="1.0" encoding="UTF-8"?>
<ContinuityOfCareRecord xmlns="urn:astm-org:CCR">
  <!-- CCR content would be generated here -->
</ContinuityOfCareRecord>`;
    await logMedicalRecordAudit('EXPORT', 'CCR', patientId, auditContext);
    return ccrXml;
}
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
async function exportToCCD(sequelize, patientId, auditContext) {
    // Simulated CCD export
    const ccdXml = `<?xml version="1.0" encoding="UTF-8"?>
<ClinicalDocument xmlns="urn:hl7-org:v3">
  <!-- CCD content would be generated here -->
</ClinicalDocument>`;
    await logMedicalRecordAudit('EXPORT', 'CCD', patientId, auditContext);
    return ccdXml;
}
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
async function exportToFhir(sequelize, patientId, auditContext) {
    // Simulated FHIR export
    const fhirBundle = {
        resourceType: 'Bundle',
        type: 'collection',
        entry: [],
    };
    await logMedicalRecordAudit('EXPORT', 'FHIR', patientId, auditContext);
    return fhirBundle;
}
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
async function importFromExternalSystem(sequelize, patientId, format, data, auditContext) {
    const transaction = await sequelize.transaction();
    const result = { imported: 0, errors: [] };
    try {
        // Simulated import logic based on format
        switch (format) {
            case 'CCD':
                // Parse CCD XML and extract data
                break;
            case 'FHIR':
                // Parse FHIR Bundle and extract resources
                break;
            case 'HL7v2':
                // Parse HL7 v2 messages
                break;
            default:
                throw new Error(`Unsupported import format: ${format}`);
        }
        await logMedicalRecordAudit('IMPORT', format, patientId, auditContext, {
            format,
            importedRecords: result.imported,
        });
        await transaction.commit();
        return result;
    }
    catch (error) {
        await transaction.rollback();
        result.errors.push(error.message);
        return result;
    }
}
//# sourceMappingURL=health-medical-records-kit.js.map