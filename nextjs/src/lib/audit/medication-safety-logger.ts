/**
 * WF-AUDIT-001 | medication-safety-logger.ts - Medication Safety Audit Logging
 * Purpose: Log medication safety verifications for HIPAA compliance
 * Upstream: Safety components | Dependencies: Audit API
 * Downstream: Audit trail, compliance reports
 * Related: FiveRightsChecklist, AllergyAlertBanner
 * Exports: Medication safety logging functions
 * Last Updated: 2025-10-27 | File Type: .ts
 */

export interface FiveRightsAuditLog {
  timestamp: string;
  userId: string;
  studentId: string;
  medicationId: string;
  verification: {
    rightPatient: boolean;
    rightDrug: boolean;
    rightDose: boolean;
    rightRoute: boolean;
    rightTime: boolean;
  };
  studentName: string;
  medicationName: string;
  dosage: string;
  route: string;
  scheduledTime?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface AllergyCheckAuditLog {
  timestamp: string;
  userId: string;
  studentId: string;
  medicationId: string;
  allergiesChecked: boolean;
  allergiesPresent: boolean;
  allergyCount: number;
  severeAllergies?: string[];
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Log Five Rights verification to audit trail
 */
export const logFiveRightsVerification = async (
  auditData: FiveRightsAuditLog
): Promise<void> => {
  try {
    // In production, this would send to a HIPAA-compliant audit logging service
    // For now, we'll send to the internal audit API
    await fetch('/api/audit/medication-safety/five-rights', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...auditData,
        timestamp: new Date().toISOString(),
        eventType: 'FIVE_RIGHTS_VERIFICATION',
      }),
    });

    // Also log to browser console in development (no PHI)
    if (process.env.NODE_ENV === 'development') {
      console.log('[Audit] Five Rights Verification:', {
        timestamp: auditData.timestamp,
        userId: auditData.userId,
        allVerified: Object.values(auditData.verification).every(Boolean),
      });
    }
  } catch (error) {
    // Log errors but don't block the workflow
    console.error('[Audit] Failed to log Five Rights verification:', error);
    // In production, this would be sent to error monitoring (Sentry, DataDog)
  }
};

/**
 * Log allergy check to audit trail
 */
export const logAllergyCheck = async (
  auditData: AllergyCheckAuditLog
): Promise<void> => {
  try {
    // Send to audit API
    await fetch('/api/audit/medication-safety/allergy-check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...auditData,
        timestamp: new Date().toISOString(),
        eventType: 'ALLERGY_CHECK',
      }),
    });

    // Log to browser console in development (no PHI)
    if (process.env.NODE_ENV === 'development') {
      console.log('[Audit] Allergy Check:', {
        timestamp: auditData.timestamp,
        userId: auditData.userId,
        allergiesPresent: auditData.allergiesPresent,
        allergyCount: auditData.allergyCount,
      });
    }
  } catch (error) {
    console.error('[Audit] Failed to log allergy check:', error);
  }
};

/**
 * Log medication administration with all safety checks
 */
export const logMedicationAdministration = async (data: {
  userId: string;
  studentId: string;
  medicationId: string;
  fiveRightsVerified: boolean;
  allergiesChecked: boolean;
  photoVerified: boolean;
}): Promise<void> => {
  try {
    await fetch('/api/audit/medication-safety/administration', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        timestamp: new Date().toISOString(),
        eventType: 'MEDICATION_ADMINISTRATION',
      }),
    });

    if (process.env.NODE_ENV === 'development') {
      console.log('[Audit] Medication Administration:', {
        timestamp: new Date().toISOString(),
        allSafetyChecksPassed:
          data.fiveRightsVerified && data.allergiesChecked && data.photoVerified,
      });
    }
  } catch (error) {
    console.error('[Audit] Failed to log medication administration:', error);
  }
};

/**
 * Get user's IP address for audit logging
 */
export const getClientIpAddress = async (): Promise<string> => {
  try {
    const response = await fetch('/api/client-ip');
    const data = await response.json();
    return data.ip || 'unknown';
  } catch {
    return 'unknown';
  }
};

/**
 * Get user agent for audit logging
 */
export const getUserAgent = (): string => {
  return typeof window !== 'undefined' ? window.navigator.userAgent : 'server';
};

export default {
  logFiveRightsVerification,
  logAllergyCheck,
  logMedicationAdministration,
  getClientIpAddress,
  getUserAgent,
};
