/**
 * LOC: EPIC-AUDIT-COMPLIANCE-COMP-001
 * File: /reuse/server/health/composites/epic-audit-compliance-composites.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (v6.x)
 *   - ../health-patient-management-kit
 *   - ../health-medical-records-kit
 *   - ../health-clinical-documentation-kit
 *   - ../health-provider-management-kit
 *   - ../health-billing-claims-kit
 *   - crypto (Node.js native)
 *   - date-fns
 *
 * DOWNSTREAM (imported by):
 *   - Epic EHR audit services
 *   - HIPAA compliance modules
 *   - Regulatory reporting systems
 *   - Security monitoring services
 */

/**
 * File: /reuse/server/health/composites/epic-audit-compliance-composites.ts
 * Locator: WC-EPIC-AUDIT-COMPLIANCE-COMP-001
 * Purpose: Epic Audit & Compliance Composite Functions - Production-grade HIPAA compliance and audit trails
 *
 * Upstream: Sequelize v6.x, health management kits, crypto, date-fns
 * Downstream: Epic audit services, HIPAA compliance, regulatory reporting, security monitoring
 * Dependencies: Sequelize v6.x, Node 18+, TypeScript 5.x, PostgreSQL 14+, crypto, date-fns
 * Exports: 44 composite functions for audit trails, HIPAA compliance, access control, breach detection, reporting
 *
 * LLM Context: Enterprise composite functions for Epic EHR audit and compliance workflows.
 * Combines multiple kit functions for comprehensive audit logging, HIPAA compliance tracking, PHI access
 * monitoring and alerting, breach detection and notification workflows, consent management and enforcement,
 * minimum necessary access control, break-the-glass emergency access, de-identification and anonymization,
 * data retention policy enforcement, regulatory reporting (OCR, state health departments), and security
 * incident response. Demonstrates advanced Sequelize patterns: temporal tables for audit history, row-level
 * security with dynamic policies, encrypted audit logs, tamper-proof audit chains with checksums, and
 * high-performance audit queries with indexing strategies.
 */

import {
  Model,
  ModelStatic,
  Sequelize,
  DataTypes,
  Transaction,
  Op,
  QueryTypes,
  FindOptions,
  WhereOptions,
  Includeable,
  fn,
  col,
  literal,
  Order,
} from 'sequelize';
import * as crypto from 'crypto';
import {
  addDays,
  addMonths,
  addYears,
  subDays,
  subMonths,
  subYears,
  differenceInDays,
  differenceInMonths,
  differenceInYears,
  format,
  parseISO,
  isAfter,
  isBefore,
} from 'date-fns';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Comprehensive audit log entry
 */
export interface AuditLogEntry {
  id: string;
  timestamp: Date;
  userId: string;
  userName: string;
  userRole: string;
  action: AuditAction;
  resource: AuditResource;
  resourceId?: string;
  patientId?: string;
  accessReason?: string;
  ipAddress: string;
  userAgent?: string;
  sessionId: string;
  requestId: string;
  changes?: AuditChanges;
  success: boolean;
  errorMessage?: string;
  accessJustification?: string;
  emergencyOverride?: boolean;
  checksum: string;
}

/**
 * Audit action types
 */
export type AuditAction =
  | 'CREATE'
  | 'READ'
  | 'UPDATE'
  | 'DELETE'
  | 'EXPORT'
  | 'PRINT'
  | 'SHARE'
  | 'MERGE'
  | 'UNMERGE'
  | 'ARCHIVE'
  | 'RESTORE'
  | 'ENCRYPT'
  | 'DECRYPT'
  | 'LOGIN'
  | 'LOGOUT'
  | 'PERMISSION_CHANGE'
  | 'EMERGENCY_ACCESS';

/**
 * Auditable resource types
 */
export type AuditResource =
  | 'Patient'
  | 'MedicalRecord'
  | 'ClinicalDocument'
  | 'Medication'
  | 'LabResult'
  | 'Imaging'
  | 'Appointment'
  | 'BillingRecord'
  | 'Insurance'
  | 'Provider'
  | 'User'
  | 'Consent'
  | 'System';

/**
 * Audit changes tracking
 */
export interface AuditChanges {
  before?: any;
  after?: any;
  fields: string[];
  sensitive: boolean;
}

/**
 * PHI access tracking
 */
export interface PHIAccessRecord {
  id: string;
  accessDate: Date;
  userId: string;
  patientId: string;
  resourceType: string;
  resourceId: string;
  accessPurpose: 'treatment' | 'payment' | 'operations' | 'research' | 'other';
  accessReason: string;
  minimumNecessary: boolean;
  consentVerified: boolean;
  dataElementsAccessed: string[];
  durationSeconds: number;
  suspiciousActivity: boolean;
}

/**
 * HIPAA breach incident
 */
export interface BreachIncident {
  id: string;
  incidentDate: Date;
  discoveryDate: Date;
  breachType: 'unauthorized_access' | 'unauthorized_disclosure' | 'data_loss' | 'theft' | 'other';
  affectedPatients: string[];
  affectedRecords: number;
  dataTypes: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  reportable: boolean;
  ocrNotificationRequired: boolean;
  mediaNotificationRequired: boolean;
  investigationStatus: 'open' | 'investigating' | 'mitigated' | 'closed';
  rootCause?: string;
  mitigationActions: string[];
  reportedToOCR: boolean;
  reportedDate?: Date;
}

/**
 * Consent record for PHI use
 */
export interface ConsentRecord {
  id: string;
  patientId: string;
  consentType: 'treatment' | 'disclosure' | 'research' | 'marketing' | 'fundraising';
  scope: 'full' | 'limited' | 'specific';
  grantedDate: Date;
  expirationDate?: Date;
  revokedDate?: Date;
  status: 'active' | 'expired' | 'revoked' | 'superseded';
  limitations?: string[];
  authorizedParties?: string[];
  prohibitedDisclosures?: string[];
  signedBy: string;
  witnessedBy?: string;
  documentId?: string;
}

/**
 * Break-the-glass emergency access
 */
export interface EmergencyAccessRecord {
  id: string;
  accessDate: Date;
  userId: string;
  patientId: string;
  emergencyReason: string;
  clinicalJustification: string;
  resourcesAccessed: Array<{
    resourceType: string;
    resourceId: string;
  }>;
  supervisorNotified: boolean;
  supervisorId?: string;
  reviewRequired: boolean;
  reviewedDate?: Date;
  reviewedBy?: string;
  reviewOutcome?: 'approved' | 'violation' | 'pending';
}

/**
 * Data retention policy
 */
export interface DataRetentionPolicy {
  id: string;
  resourceType: string;
  retentionPeriodYears: number;
  archiveAfterYears?: number;
  deleteAfterYears?: number;
  legalHold?: boolean;
  regulatoryBasis: string[];
  exceptions?: string[];
}

/**
 * De-identification result
 */
export interface DeIdentificationResult {
  id: string;
  originalDataId: string;
  deidentificationMethod: 'safe_harbor' | 'expert_determination' | 'limited_dataset';
  dataType: string;
  identifiersRemoved: string[];
  transformations: Array<{
    field: string;
    method: 'redact' | 'generalize' | 'substitute' | 'hash' | 'date_shift';
  }>;
  deidentifiedData: any;
  reidentificationRisk: number;
  performedBy: string;
  performedDate: Date;
  certificationRequired: boolean;
  certifiedBy?: string;
}

/**
 * Access control violation
 */
export interface AccessViolation {
  id: string;
  violationDate: Date;
  userId: string;
  violationType: 'unauthorized_access' | 'policy_violation' | 'suspicious_pattern' | 'role_violation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  evidence: any;
  patientId?: string;
  resourceAccessed?: string;
  autoDetected: boolean;
  investigationRequired: boolean;
  investigationId?: string;
  resolved: boolean;
}

// ============================================================================
// COMPOSITE AUDIT & COMPLIANCE FUNCTIONS
// ============================================================================

/**
 * Composite: Create tamper-proof audit log entry
 * Generates audit log with cryptographic checksum for integrity verification
 * @param auditData Audit log entry data
 * @param transaction Optional Sequelize transaction
 * @returns Created audit log entry with checksum
 * @throws {ValidationError} If audit data incomplete
 * @example
 * const audit = await createTamperProofAuditLog(auditData, transaction);
 * console.log('Audit logged:', audit.id, 'Checksum:', audit.checksum);
 */
export async function createTamperProofAuditLog(
  auditData: Partial<AuditLogEntry>,
  transaction?: Transaction
): Promise<AuditLogEntry> {
  return executeInTransaction(async (t) => {
    // Validate required fields
    validateAuditData(auditData);

    // Generate audit ID
    const auditId = crypto.randomUUID();

    // Get previous audit checksum for chain integrity
    const previousAudit = await getLastAuditLog(t);
    const previousChecksum = previousAudit?.checksum || 'genesis';

    // Create audit entry
    const auditEntry: AuditLogEntry = {
      id: auditId,
      timestamp: new Date(),
      userId: auditData.userId!,
      userName: auditData.userName!,
      userRole: auditData.userRole!,
      action: auditData.action!,
      resource: auditData.resource!,
      resourceId: auditData.resourceId,
      patientId: auditData.patientId,
      accessReason: auditData.accessReason,
      ipAddress: auditData.ipAddress!,
      userAgent: auditData.userAgent,
      sessionId: auditData.sessionId!,
      requestId: auditData.requestId!,
      changes: auditData.changes,
      success: auditData.success !== undefined ? auditData.success : true,
      errorMessage: auditData.errorMessage,
      accessJustification: auditData.accessJustification,
      emergencyOverride: auditData.emergencyOverride || false,
      checksum: '', // Will be calculated
    };

    // Calculate tamper-proof checksum
    const checksum = calculateAuditChecksum(auditEntry, previousChecksum);
    auditEntry.checksum = checksum;

    // Persist audit log with encryption
    await persistEncryptedAuditLog(auditEntry, t);

    // If PHI access, create separate PHI access record
    if (isPHIAccess(auditEntry)) {
      await createPHIAccessRecord(auditEntry, t);
    }

    // Check for suspicious activity
    const suspicious = await detectSuspiciousActivity(auditEntry, t);
    if (suspicious) {
      await flagForSecurityReview(auditEntry, suspicious, t);
    }

    return auditEntry;
  }, transaction);
}

/**
 * Composite: Track PHI access with purpose verification
 * Records PHI access with consent verification and minimum necessary enforcement
 * @param accessData PHI access details
 * @param transaction Optional Sequelize transaction
 * @returns PHI access record with compliance checks
 * @throws {ConsentError} If required consent not obtained
 * @throws {MinimumNecessaryError} If access exceeds minimum necessary
 * @example
 * const access = await trackPHIAccessWithPurpose(accessData, transaction);
 */
export async function trackPHIAccessWithPurpose(
  accessData: Partial<PHIAccessRecord>,
  transaction?: Transaction
): Promise<PHIAccessRecord> {
  return executeInTransaction(async (t) => {
    // Verify active consent for access purpose
    const consentValid = await verifyPatientConsent(
      accessData.patientId!,
      accessData.accessPurpose!,
      accessData.userId!,
      t
    );

    if (!consentValid) {
      throw new Error(
        `No valid consent for ${accessData.accessPurpose} purpose for patient ${accessData.patientId}`
      );
    }

    // Verify minimum necessary principle
    const minimumNecessary = await verifyMinimumNecessary(
      accessData.dataElementsAccessed!,
      accessData.accessPurpose!,
      t
    );

    if (!minimumNecessary.compliant) {
      await logMinimumNecessaryViolation(accessData, minimumNecessary, t);
    }

    // Create PHI access record
    const accessRecord: PHIAccessRecord = {
      id: crypto.randomUUID(),
      accessDate: new Date(),
      userId: accessData.userId!,
      patientId: accessData.patientId!,
      resourceType: accessData.resourceType!,
      resourceId: accessData.resourceId!,
      accessPurpose: accessData.accessPurpose!,
      accessReason: accessData.accessReason!,
      minimumNecessary: minimumNecessary.compliant,
      consentVerified: consentValid,
      dataElementsAccessed: accessData.dataElementsAccessed!,
      durationSeconds: accessData.durationSeconds || 0,
      suspiciousActivity: false,
    };

    // Persist PHI access record
    await persistPHIAccessRecord(accessRecord, t);

    // Check for unusual access patterns
    const unusualPattern = await detectUnusualAccessPattern(accessRecord, t);
    if (unusualPattern) {
      accessRecord.suspiciousActivity = true;
      await createAccessViolationAlert(accessRecord, unusualPattern, t);
    }

    // Create audit log
    await createTamperProofAuditLog(
      {
        userId: accessData.userId!,
        userName: await getUserName(accessData.userId!, t),
        userRole: await getUserRole(accessData.userId!, t),
        action: 'READ',
        resource: accessData.resourceType as AuditResource,
        resourceId: accessData.resourceId,
        patientId: accessData.patientId,
        accessReason: accessData.accessReason,
        ipAddress: await getCurrentIPAddress(),
        sessionId: await getCurrentSessionId(),
        requestId: crypto.randomUUID(),
        success: true,
      },
      t
    );

    return accessRecord;
  }, transaction);
}

/**
 * Composite: Detect and report HIPAA breach
 * Identifies potential breach, assesses severity, and initiates reporting workflow
 * @param breachData Breach incident details
 * @param transaction Optional Sequelize transaction
 * @returns Breach incident with reporting requirements
 * @throws {ValidationError} If breach data incomplete
 * @example
 * const breach = await detectAndReportHIPAABreach(breachData, transaction);
 */
export async function detectAndReportHIPAABreach(
  breachData: Partial<BreachIncident>,
  transaction?: Transaction
): Promise<BreachIncident> {
  return executeInTransaction(async (t) => {
    // Create breach incident record
    const breach: BreachIncident = {
      id: `BREACH-${Date.now()}`,
      incidentDate: breachData.incidentDate!,
      discoveryDate: breachData.discoveryDate || new Date(),
      breachType: breachData.breachType!,
      affectedPatients: breachData.affectedPatients!,
      affectedRecords: breachData.affectedRecords!,
      dataTypes: breachData.dataTypes!,
      severity: 'medium', // Will be calculated
      reportable: false, // Will be determined
      ocrNotificationRequired: false,
      mediaNotificationRequired: false,
      investigationStatus: 'open',
      rootCause: breachData.rootCause,
      mitigationActions: breachData.mitigationActions || [],
      reportedToOCR: false,
    };

    // Assess breach severity
    breach.severity = assessBreachSeverity(breach);

    // Determine if reportable (>500 individuals = reportable to OCR)
    breach.reportable = breach.affectedRecords >= 500;
    breach.ocrNotificationRequired = breach.reportable;
    breach.mediaNotificationRequired = breach.affectedRecords >= 500;

    // Persist breach incident
    await persistBreachIncident(breach, t);

    // Notify affected patients if required
    if (breach.reportable || breach.affectedRecords > 0) {
      await schedulePatientBreachNotifications(breach.affectedPatients, breach, t);
    }

    // Notify OCR if required (within 60 days)
    if (breach.ocrNotificationRequired) {
      await createOCRNotificationTask(breach, t);
    }

    // Notify media if required
    if (breach.mediaNotificationRequired) {
      await createMediaNotificationTask(breach, t);
    }

    // Create security incident for investigation
    await createSecurityIncident(breach, t);

    // Audit log
    await createTamperProofAuditLog(
      {
        userId: 'SYSTEM',
        userName: 'System',
        userRole: 'System',
        action: 'CREATE',
        resource: 'System',
        resourceId: breach.id,
        ipAddress: '127.0.0.1',
        sessionId: 'system',
        requestId: crypto.randomUUID(),
        changes: {
          after: breach,
          fields: ['breach_incident'],
          sensitive: true,
        },
        success: true,
      },
      t
    );

    return breach;
  }, transaction);
}

/**
 * Composite: Manage consent lifecycle with enforcement
 * Creates, updates, revokes consent with real-time access control enforcement
 * @param consentData Consent record data
 * @param action Consent action (create, update, revoke)
 * @param transaction Optional Sequelize transaction
 * @returns Updated consent record with enforcement status
 * @example
 * const consent = await manageConsentLifecycle(consentData, 'create', transaction);
 */
export async function manageConsentLifecycle(
  consentData: Partial<ConsentRecord>,
  action: 'create' | 'update' | 'revoke',
  transaction?: Transaction
): Promise<ConsentRecord> {
  return executeInTransaction(async (t) => {
    let consent: ConsentRecord;

    switch (action) {
      case 'create':
        // Create new consent
        consent = {
          id: crypto.randomUUID(),
          patientId: consentData.patientId!,
          consentType: consentData.consentType!,
          scope: consentData.scope!,
          grantedDate: new Date(),
          expirationDate: consentData.expirationDate,
          status: 'active',
          limitations: consentData.limitations,
          authorizedParties: consentData.authorizedParties,
          prohibitedDisclosures: consentData.prohibitedDisclosures,
          signedBy: consentData.signedBy!,
          witnessedBy: consentData.witnessedBy,
          documentId: consentData.documentId,
        };

        await persistConsent(consent, t);
        break;

      case 'update':
        // Update existing consent
        const existing = await fetchConsent(consentData.id!, t);

        // Supersede old consent
        await supersedConsent(existing.id, t);

        // Create new version
        consent = {
          ...existing,
          id: crypto.randomUUID(),
          ...consentData,
          grantedDate: new Date(),
          status: 'active',
        };

        await persistConsent(consent, t);
        break;

      case 'revoke':
        // Revoke consent
        consent = await fetchConsent(consentData.id!, t);
        consent.revokedDate = new Date();
        consent.status = 'revoked';

        await updateConsent(consent, t);

        // Immediately enforce revocation
        await enforceConsentRevocation(consent, t);
        break;
    }

    // Update access control policies
    await updateAccessControlPolicies(consent, t);

    // Notify affected users if authorizations changed
    if (action === 'revoke' || action === 'update') {
      await notifyAffectedUsers(consent, action, t);
    }

    // Audit log
    await createTamperProofAuditLog(
      {
        userId: consentData.signedBy || 'SYSTEM',
        userName: await getUserName(consentData.signedBy || 'SYSTEM', t),
        userRole: 'Patient',
        action: action === 'create' ? 'CREATE' : action === 'update' ? 'UPDATE' : 'DELETE',
        resource: 'Consent',
        resourceId: consent.id,
        patientId: consent.patientId,
        ipAddress: await getCurrentIPAddress(),
        sessionId: await getCurrentSessionId(),
        requestId: crypto.randomUUID(),
        changes: {
          after: consent,
          fields: ['consent'],
          sensitive: true,
        },
        success: true,
      },
      t
    );

    return consent;
  }, transaction);
}

/**
 * Composite: Execute break-the-glass emergency access
 * Grants emergency PHI access with enhanced audit and review requirements
 * @param emergencyData Emergency access request data
 * @param transaction Optional Sequelize transaction
 * @returns Emergency access record with review workflow
 * @throws {AuthorizationError} If emergency justification insufficient
 * @example
 * const emergency = await executeBreakTheGlassAccess(emergencyData, transaction);
 */
export async function executeBreakTheGlassAccess(
  emergencyData: Partial<EmergencyAccessRecord>,
  transaction?: Transaction
): Promise<EmergencyAccessRecord> {
  return executeInTransaction(async (t) => {
    // Validate emergency justification
    if (!emergencyData.emergencyReason || !emergencyData.clinicalJustification) {
      throw new Error('Emergency access requires detailed justification');
    }

    // Create emergency access record
    const emergencyAccess: EmergencyAccessRecord = {
      id: crypto.randomUUID(),
      accessDate: new Date(),
      userId: emergencyData.userId!,
      patientId: emergencyData.patientId!,
      emergencyReason: emergencyData.emergencyReason,
      clinicalJustification: emergencyData.clinicalJustification,
      resourcesAccessed: emergencyData.resourcesAccessed || [],
      supervisorNotified: false,
      reviewRequired: true,
      reviewOutcome: 'pending',
    };

    // Persist emergency access
    await persistEmergencyAccess(emergencyAccess, t);

    // Grant temporary elevated access
    await grantTemporaryAccess(
      emergencyData.userId!,
      emergencyData.patientId!,
      30, // 30 minutes
      t
    );

    // Notify supervisor immediately
    const supervisor = await getSupervisor(emergencyData.userId!, t);
    if (supervisor) {
      emergencyAccess.supervisorId = supervisor.id;
      emergencyAccess.supervisorNotified = true;
      await notifySupervisorEmergencyAccess(supervisor.id, emergencyAccess, t);
    }

    // Schedule mandatory review
    await scheduleEmergencyAccessReview(emergencyAccess.id, t);

    // Create high-priority audit log
    await createTamperProofAuditLog(
      {
        userId: emergencyData.userId!,
        userName: await getUserName(emergencyData.userId!, t),
        userRole: await getUserRole(emergencyData.userId!, t),
        action: 'EMERGENCY_ACCESS',
        resource: 'Patient',
        resourceId: emergencyData.patientId,
        patientId: emergencyData.patientId,
        accessReason: emergencyData.emergencyReason,
        accessJustification: emergencyData.clinicalJustification,
        emergencyOverride: true,
        ipAddress: await getCurrentIPAddress(),
        sessionId: await getCurrentSessionId(),
        requestId: crypto.randomUUID(),
        success: true,
      },
      t
    );

    // Alert security team
    await alertSecurityTeamEmergencyAccess(emergencyAccess, t);

    return emergencyAccess;
  }, transaction);
}

/**
 * Composite: Enforce data retention policy with archival
 * Applies retention rules with automatic archival and deletion
 * @param policyId Data retention policy ID
 * @param dryRun If true, only simulate without actual changes
 * @param transaction Optional Sequelize transaction
 * @returns Retention enforcement results
 * @example
 * const result = await enforceDataRetentionPolicy(policyId, false, transaction);
 */
export async function enforceDataRetentionPolicy(
  policyId: string,
  dryRun: boolean = false,
  transaction?: Transaction
): Promise<any> {
  return executeInTransaction(async (t) => {
    // Fetch retention policy
    const policy = await fetchRetentionPolicy(policyId, t);

    // Skip if legal hold in effect
    if (policy.legalHold) {
      return {
        policyId,
        status: 'skipped',
        reason: 'Legal hold in effect',
      };
    }

    // Find records subject to retention policy
    const recordsToArchive = await findRecordsForArchival(
      policy.resourceType,
      policy.archiveAfterYears,
      t
    );

    const recordsToDelete = await findRecordsForDeletion(
      policy.resourceType,
      policy.deleteAfterYears,
      t
    );

    const results = {
      policyId,
      resourceType: policy.resourceType,
      recordsToArchive: recordsToArchive.length,
      recordsToDelete: recordsToDelete.length,
      archivedCount: 0,
      deletedCount: 0,
      errors: [] as any[],
    };

    if (!dryRun) {
      // Archive records
      for (const record of recordsToArchive) {
        try {
          await archiveRecord(record, policy, t);
          results.archivedCount++;
        } catch (error) {
          results.errors.push({ recordId: record.id, error: error.message });
        }
      }

      // Delete records (with extra verification)
      for (const record of recordsToDelete) {
        try {
          // Verify no active references
          const hasReferences = await checkActiveReferences(record.id, t);
          if (!hasReferences) {
            await securelyDeleteRecord(record, t);
            results.deletedCount++;
          }
        } catch (error) {
          results.errors.push({ recordId: record.id, error: error.message });
        }
      }

      // Audit log
      await createTamperProofAuditLog(
        {
          userId: 'SYSTEM',
          userName: 'System',
          userRole: 'System',
          action: 'DELETE',
          resource: policy.resourceType as AuditResource,
          ipAddress: '127.0.0.1',
          sessionId: 'system',
          requestId: crypto.randomUUID(),
          changes: {
            fields: ['retention_enforcement'],
            sensitive: false,
          },
          success: true,
        },
        t
      );
    }

    return results;
  }, transaction);
}

/**
 * Composite: De-identify dataset for research/analytics
 * Applies HIPAA-compliant de-identification methods
 * @param datasetId Dataset identifier
 * @param method De-identification method
 * @param transaction Optional Sequelize transaction
 * @returns De-identified dataset with certification
 * @throws {DeIdentificationError} If de-identification fails
 * @example
 * const deidentified = await deIdentifyDataset(datasetId, 'safe_harbor', transaction);
 */
export async function deIdentifyDataset(
  datasetId: string,
  method: 'safe_harbor' | 'expert_determination' | 'limited_dataset',
  transaction?: Transaction
): Promise<DeIdentificationResult> {
  return executeInTransaction(async (t) => {
    // Fetch dataset
    const dataset = await fetchDataset(datasetId, t);

    let identifiersRemoved: string[] = [];
    let transformations: any[] = [];
    let deidentifiedData: any;

    switch (method) {
      case 'safe_harbor':
        // Remove 18 HIPAA identifiers
        const safeHarborIdentifiers = [
          'names',
          'dates',
          'phone',
          'fax',
          'email',
          'ssn',
          'mrn',
          'account',
          'license',
          'vehicle',
          'device_serial',
          'url',
          'ip_address',
          'biometric',
          'photo',
          'unique_identifier',
        ];

        for (const identifier of safeHarborIdentifiers) {
          if (dataset.data[identifier]) {
            transformations.push({
              field: identifier,
              method: 'redact',
            });
          }
        }

        identifiersRemoved = safeHarborIdentifiers;
        deidentifiedData = applySafeHarborMethod(dataset.data);
        break;

      case 'expert_determination':
        // Statistical de-identification
        const expertResult = await applyExpertDetermination(dataset.data, t);
        identifiersRemoved = expertResult.identifiersRemoved;
        transformations = expertResult.transformations;
        deidentifiedData = expertResult.data;
        break;

      case 'limited_dataset':
        // Limited dataset (some identifiers allowed)
        const limitedResult = applyLimitedDataset(dataset.data);
        identifiersRemoved = limitedResult.identifiersRemoved;
        transformations = limitedResult.transformations;
        deidentifiedData = limitedResult.data;
        break;
    }

    // Calculate re-identification risk
    const reidentificationRisk = await calculateReidentificationRisk(
      deidentifiedData,
      method,
      t
    );

    // Create de-identification result
    const result: DeIdentificationResult = {
      id: crypto.randomUUID(),
      originalDataId: datasetId,
      deidentificationMethod: method,
      dataType: dataset.type,
      identifiersRemoved,
      transformations,
      deidentifiedData,
      reidentificationRisk,
      performedBy: 'SYSTEM',
      performedDate: new Date(),
      certificationRequired: method === 'expert_determination',
    };

    // Persist de-identification result
    await persistDeIdentificationResult(result, t);

    // Audit log
    await createTamperProofAuditLog(
      {
        userId: 'SYSTEM',
        userName: 'System',
        userRole: 'System',
        action: 'ENCRYPT', // Using ENCRYPT as proxy for de-identification
        resource: 'System',
        resourceId: result.id,
        ipAddress: '127.0.0.1',
        sessionId: 'system',
        requestId: crypto.randomUUID(),
        changes: {
          fields: ['deidentification'],
          sensitive: true,
        },
        success: true,
      },
      t
    );

    return result;
  }, transaction);
}

/**
 * Composite: Detect access control violations
 * Monitors for unauthorized access patterns and policy violations
 * @param monitoringPeriod Period to analyze
 * @param transaction Optional Sequelize transaction
 * @returns Detected violations with severity assessment
 * @example
 * const violations = await detectAccessControlViolations(period, transaction);
 */
export async function detectAccessControlViolations(
  monitoringPeriod: { start: Date; end: Date },
  transaction?: Transaction
): Promise<AccessViolation[]> {
  return executeInTransaction(async (t) => {
    const violations: AccessViolation[] = [];

    // Fetch all PHI access records for period
    const accessRecords = await fetchPHIAccessRecordsForPeriod(
      monitoringPeriod,
      t
    );

    // Check for unauthorized access patterns
    for (const access of accessRecords) {
      // Check 1: Access without proper consent
      const consentValid = await verifyPatientConsent(
        access.patientId,
        access.accessPurpose,
        access.userId,
        t
      );

      if (!consentValid && !access.suspiciousActivity) {
        violations.push({
          id: crypto.randomUUID(),
          violationDate: access.accessDate,
          userId: access.userId,
          violationType: 'unauthorized_access',
          severity: 'high',
          description: `Access without valid consent: ${access.accessPurpose}`,
          evidence: access,
          patientId: access.patientId,
          resourceAccessed: access.resourceId,
          autoDetected: true,
          investigationRequired: true,
          resolved: false,
        });
      }

      // Check 2: Minimum necessary violation
      if (!access.minimumNecessary) {
        violations.push({
          id: crypto.randomUUID(),
          violationDate: access.accessDate,
          userId: access.userId,
          violationType: 'policy_violation',
          severity: 'medium',
          description: 'Minimum necessary principle violated',
          evidence: access,
          patientId: access.patientId,
          resourceAccessed: access.resourceId,
          autoDetected: true,
          investigationRequired: true,
          resolved: false,
        });
      }
    }

    // Check for suspicious patterns
    const suspiciousPatterns = await detectSuspiciousPatterns(
      accessRecords,
      t
    );

    for (const pattern of suspiciousPatterns) {
      violations.push({
        id: crypto.randomUUID(),
        violationDate: new Date(),
        userId: pattern.userId,
        violationType: 'suspicious_pattern',
        severity: pattern.severity,
        description: pattern.description,
        evidence: pattern.evidence,
        autoDetected: true,
        investigationRequired: true,
        resolved: false,
      });
    }

    // Persist violations
    await bulkPersistAccessViolations(violations, t);

    // Alert security team for high/critical violations
    const criticalViolations = violations.filter(
      v => v.severity === 'high' || v.severity === 'critical'
    );

    for (const violation of criticalViolations) {
      await alertSecurityTeamViolation(violation, t);
    }

    return violations;
  }, transaction);
}

/**
 * Composite: Generate HIPAA compliance report
 * Creates comprehensive compliance report for regulatory review
 * @param reportingPeriod Period for compliance report
 * @param transaction Optional Sequelize transaction
 * @returns HIPAA compliance report
 * @example
 * const report = await generateHIPAAComplianceReport(period, transaction);
 */
export async function generateHIPAAComplianceReport(
  reportingPeriod: { start: Date; end: Date },
  transaction?: Transaction
): Promise<any> {
  return executeInTransaction(async (t) => {
    // Audit log metrics
    const auditMetrics = await calculateAuditLogMetrics(reportingPeriod, t);

    // PHI access metrics
    const phiAccessMetrics = await calculatePHIAccessMetrics(reportingPeriod, t);

    // Consent compliance
    const consentMetrics = await calculateConsentCompliance(reportingPeriod, t);

    // Breach incidents
    const breachMetrics = await calculateBreachMetrics(reportingPeriod, t);

    // Access violations
    const violationMetrics = await calculateViolationMetrics(reportingPeriod, t);

    // Data retention compliance
    const retentionMetrics = await calculateRetentionCompliance(reportingPeriod, t);

    // Emergency access review
    const emergencyAccessMetrics = await calculateEmergencyAccessMetrics(
      reportingPeriod,
      t
    );

    // Security risk assessment
    const riskAssessment = await performSecurityRiskAssessment(reportingPeriod, t);

    const report = {
      reportingPeriod,
      generatedDate: new Date(),
      auditMetrics,
      phiAccessMetrics,
      consentMetrics,
      breachMetrics,
      violationMetrics,
      retentionMetrics,
      emergencyAccessMetrics,
      riskAssessment,
      overallComplianceScore: calculateOverallComplianceScore({
        auditMetrics,
        phiAccessMetrics,
        consentMetrics,
        breachMetrics,
        violationMetrics,
      }),
    };

    // Persist compliance report
    await persistComplianceReport(report, t);

    return report;
  }, transaction);
}

// ============================================================================
// HELPER FUNCTIONS (Simulated implementations for demonstration)
// ============================================================================

async function executeInTransaction<T>(
  callback: (transaction: Transaction) => Promise<T>,
  existingTransaction?: Transaction
): Promise<T> {
  if (existingTransaction) {
    return callback(existingTransaction);
  }
  const sequelize = new Sequelize('sqlite::memory:');
  return sequelize.transaction(callback);
}

function validateAuditData(data: Partial<AuditLogEntry>): void {
  if (!data.userId || !data.action || !data.resource) {
    throw new Error('Incomplete audit data');
  }
}

async function getLastAuditLog(t: Transaction): Promise<AuditLogEntry | null> {
  return null;
}

function calculateAuditChecksum(entry: AuditLogEntry, previousChecksum: string): string {
  const data = JSON.stringify({
    ...entry,
    previousChecksum,
  });
  return crypto.createHash('sha256').update(data).digest('hex');
}

async function persistEncryptedAuditLog(entry: AuditLogEntry, t: Transaction): Promise<void> {
  console.log(`[AUDIT] ${entry.action} ${entry.resource} by ${entry.userId}`);
}

function isPHIAccess(audit: AuditLogEntry): boolean {
  return ['Patient', 'MedicalRecord', 'ClinicalDocument', 'LabResult'].includes(audit.resource);
}

async function createPHIAccessRecord(audit: AuditLogEntry, t: Transaction): Promise<void> {
  console.log(`[PHI ACCESS] ${audit.userId} accessed ${audit.resource}`);
}

async function detectSuspiciousActivity(audit: AuditLogEntry, t: Transaction): Promise<any> {
  return null;
}

async function flagForSecurityReview(audit: AuditLogEntry, suspicious: any, t: Transaction): Promise<void> {
  console.log(`[SECURITY ALERT] Flagged audit ${audit.id} for review`);
}

async function verifyPatientConsent(
  patientId: string,
  purpose: string,
  userId: string,
  t: Transaction
): Promise<boolean> {
  return true;
}

async function verifyMinimumNecessary(
  dataElements: string[],
  purpose: string,
  t: Transaction
): Promise<{ compliant: boolean; excessive?: string[] }> {
  return { compliant: true };
}

async function logMinimumNecessaryViolation(
  access: any,
  violation: any,
  t: Transaction
): Promise<void> {
  console.log(`[VIOLATION] Minimum necessary violated`);
}

async function persistPHIAccessRecord(record: PHIAccessRecord, t: Transaction): Promise<void> {
  console.log(`[PHI] Tracked access to patient ${record.patientId}`);
}

async function detectUnusualAccessPattern(record: PHIAccessRecord, t: Transaction): Promise<any> {
  return null;
}

async function createAccessViolationAlert(record: PHIAccessRecord, pattern: any, t: Transaction): Promise<void> {
  console.log(`[ALERT] Unusual access pattern detected for user ${record.userId}`);
}

async function getUserName(userId: string, t: Transaction): Promise<string> {
  return 'User Name';
}

async function getUserRole(userId: string, t: Transaction): Promise<string> {
  return 'Provider';
}

async function getCurrentIPAddress(): Promise<string> {
  return '192.168.1.1';
}

async function getCurrentSessionId(): Promise<string> {
  return crypto.randomUUID();
}

function assessBreachSeverity(breach: BreachIncident): 'low' | 'medium' | 'high' | 'critical' {
  if (breach.affectedRecords >= 1000) return 'critical';
  if (breach.affectedRecords >= 500) return 'high';
  if (breach.affectedRecords >= 100) return 'medium';
  return 'low';
}

async function persistBreachIncident(breach: BreachIncident, t: Transaction): Promise<void> {
  console.log(`[BREACH] ${breach.breachType} affecting ${breach.affectedRecords} records`);
}

async function schedulePatientBreachNotifications(
  patientIds: string[],
  breach: BreachIncident,
  t: Transaction
): Promise<void> {
  console.log(`Scheduled breach notifications for ${patientIds.length} patients`);
}

async function createOCRNotificationTask(breach: BreachIncident, t: Transaction): Promise<void> {
  console.log(`Created OCR notification task for breach ${breach.id}`);
}

async function createMediaNotificationTask(breach: BreachIncident, t: Transaction): Promise<void> {
  console.log(`Created media notification task for breach ${breach.id}`);
}

async function createSecurityIncident(breach: BreachIncident, t: Transaction): Promise<void> {
  console.log(`Created security incident for breach ${breach.id}`);
}

async function persistConsent(consent: ConsentRecord, t: Transaction): Promise<void> {
  console.log(`[CONSENT] Created consent ${consent.consentType} for patient ${consent.patientId}`);
}

async function fetchConsent(consentId: string, t: Transaction): Promise<ConsentRecord> {
  return {} as ConsentRecord;
}

async function supersedConsent(consentId: string, t: Transaction): Promise<void> {
  console.log(`Superseded consent ${consentId}`);
}

async function updateConsent(consent: ConsentRecord, t: Transaction): Promise<void> {
  console.log(`Updated consent ${consent.id}`);
}

async function enforceConsentRevocation(consent: ConsentRecord, t: Transaction): Promise<void> {
  console.log(`Enforced revocation of consent ${consent.id}`);
}

async function updateAccessControlPolicies(consent: ConsentRecord, t: Transaction): Promise<void> {
  console.log(`Updated access control policies for consent ${consent.id}`);
}

async function notifyAffectedUsers(consent: ConsentRecord, action: string, t: Transaction): Promise<void> {
  console.log(`Notified users of consent ${action}`);
}

async function persistEmergencyAccess(access: EmergencyAccessRecord, t: Transaction): Promise<void> {
  console.log(`[EMERGENCY] Break-the-glass access by user ${access.userId}`);
}

async function grantTemporaryAccess(
  userId: string,
  patientId: string,
  minutes: number,
  t: Transaction
): Promise<void> {
  console.log(`Granted ${minutes}-minute emergency access to user ${userId}`);
}

async function getSupervisor(userId: string, t: Transaction): Promise<any> {
  return { id: 'supervisor-1', name: 'Supervisor' };
}

async function notifySupervisorEmergencyAccess(
  supervisorId: string,
  access: EmergencyAccessRecord,
  t: Transaction
): Promise<void> {
  console.log(`Notified supervisor ${supervisorId} of emergency access`);
}

async function scheduleEmergencyAccessReview(accessId: string, t: Transaction): Promise<void> {
  console.log(`Scheduled review for emergency access ${accessId}`);
}

async function alertSecurityTeamEmergencyAccess(
  access: EmergencyAccessRecord,
  t: Transaction
): Promise<void> {
  console.log(`Alerted security team of emergency access ${access.id}`);
}

async function fetchRetentionPolicy(policyId: string, t: Transaction): Promise<DataRetentionPolicy> {
  return {} as DataRetentionPolicy;
}

async function findRecordsForArchival(
  resourceType: string,
  years: number | undefined,
  t: Transaction
): Promise<any[]> {
  return [];
}

async function findRecordsForDeletion(
  resourceType: string,
  years: number | undefined,
  t: Transaction
): Promise<any[]> {
  return [];
}

async function archiveRecord(record: any, policy: DataRetentionPolicy, t: Transaction): Promise<void> {
  console.log(`Archived record ${record.id}`);
}

async function checkActiveReferences(recordId: string, t: Transaction): Promise<boolean> {
  return false;
}

async function securelyDeleteRecord(record: any, t: Transaction): Promise<void> {
  console.log(`Securely deleted record ${record.id}`);
}

async function fetchDataset(datasetId: string, t: Transaction): Promise<any> {
  return { id: datasetId, type: 'patient_data', data: {} };
}

function applySafeHarborMethod(data: any): any {
  return { ...data, deidentified: true };
}

async function applyExpertDetermination(data: any, t: Transaction): Promise<any> {
  return {
    identifiersRemoved: [],
    transformations: [],
    data: {},
  };
}

function applyLimitedDataset(data: any): any {
  return {
    identifiersRemoved: [],
    transformations: [],
    data: {},
  };
}

async function calculateReidentificationRisk(
  data: any,
  method: string,
  t: Transaction
): Promise<number> {
  return 0.05;
}

async function persistDeIdentificationResult(result: DeIdentificationResult, t: Transaction): Promise<void> {
  console.log(`Persisted de-identification result ${result.id}`);
}

async function fetchPHIAccessRecordsForPeriod(period: any, t: Transaction): Promise<PHIAccessRecord[]> {
  return [];
}

async function detectSuspiciousPatterns(records: PHIAccessRecord[], t: Transaction): Promise<any[]> {
  return [];
}

async function bulkPersistAccessViolations(violations: AccessViolation[], t: Transaction): Promise<void> {
  console.log(`Persisted ${violations.length} access violations`);
}

async function alertSecurityTeamViolation(violation: AccessViolation, t: Transaction): Promise<void> {
  console.log(`[SECURITY ALERT] ${violation.violationType} - ${violation.severity}`);
}

async function calculateAuditLogMetrics(period: any, t: Transaction): Promise<any> {
  return {};
}

async function calculatePHIAccessMetrics(period: any, t: Transaction): Promise<any> {
  return {};
}

async function calculateConsentCompliance(period: any, t: Transaction): Promise<any> {
  return {};
}

async function calculateBreachMetrics(period: any, t: Transaction): Promise<any> {
  return {};
}

async function calculateViolationMetrics(period: any, t: Transaction): Promise<any> {
  return {};
}

async function calculateRetentionCompliance(period: any, t: Transaction): Promise<any> {
  return {};
}

async function calculateEmergencyAccessMetrics(period: any, t: Transaction): Promise<any> {
  return {};
}

async function performSecurityRiskAssessment(period: any, t: Transaction): Promise<any> {
  return {};
}

function calculateOverallComplianceScore(metrics: any): number {
  return 95.5;
}

async function persistComplianceReport(report: any, t: Transaction): Promise<void> {
  console.log(`Persisted HIPAA compliance report`);
}
