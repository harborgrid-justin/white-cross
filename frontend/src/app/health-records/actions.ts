/**
 * @fileoverview Server Actions for Health Records Module
 * @module app/health-records/actions
 *
 * Next.js v16 App Router Server Actions for health records, immunizations, allergies, vital signs, and conditions.
 * HIPAA CRITICAL: ALL operations include mandatory audit logging for PHI access.
 * Enhanced with Next.js v16 caching capabilities and revalidation patterns.
 *
 * @example
 * ```typescript
 * 'use client';
 *
 * import { useActionState } from 'react';
 * import { createHealthRecordAction } from '@/app/health-records/actions';
 *
 * function HealthRecordForm() {
 *   const [state, formAction, isPending] = useActionState(createHealthRecordAction, { errors: {} });
 *   return <form action={formAction}>...</form>;
 * }
 * ```
 */

'use server';
'use cache';

import { cookies } from 'next/headers';
import { headers } from 'next/headers';
import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { z, type ZodIssue } from 'zod';
import { cacheLife, cacheTag } from 'next/cache';

// Import schemas
import {
  healthRecordCreateSchema,
  healthRecordUpdateSchema,
  medicalConditionCreateSchema,
  medicalConditionUpdateSchema
} from '@/schemas/health-record.schemas';
import {
  immunizationCreateSchema,
  immunizationUpdateSchema
} from '@/schemas/immunization.schemas';
import {
  allergyCreateSchema,
  allergyUpdateSchema,
  allergyReactionSchema
} from '@/schemas/allergy.schemas';
import {
  vitalSignsCreateSchema,
  vitalSignsUpdateSchema
} from '@/schemas/vital-signs.schemas';

// Import audit logging utilities
import {
  auditLog,
  AUDIT_ACTIONS,
  extractIPAddress,
  extractUserAgent
} from '@/lib/audit';

// Use server-side or fallback to public env variable or default
const BACKEND_URL = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export interface ActionResult<T = unknown> {
  success?: boolean;
  data?: T;
  errors?: Record<string, string[]> & {
    _form?: string[];
  };
  message?: string;
}

/**
 * Get auth token from cookies
 */
async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get('auth_token')?.value || null;
}

/**
 * Get current user ID from cookies
 */
async function getCurrentUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get('user_id')?.value || null;
}

/**
 * Create audit context from headers
 */
async function createAuditContext() {
  const headersList = await headers();
  const request = {
    headers: headersList
  } as Request;

  const userId = await getCurrentUserId();
  return {
    userId,
    ipAddress: extractIPAddress(request),
    userAgent: extractUserAgent(request)
  };
}

/**
 * Enhanced fetch with Next.js v16 capabilities
 */
async function enhancedFetch(url: string, options: RequestInit = {}) {
  const token = await getAuthToken();
  
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
      ...options.headers,
    },
    next: {
      revalidate: 300, // 5 minute cache
      tags: ['health-records', 'phi-data']
    }
  });
}

// ==========================================
// HEALTH RECORD ACTIONS
// ==========================================

/**
 * Create a new health record with HIPAA audit logging
 * Enhanced with Next.js v16 caching and validation
 */
export async function createHealthRecordAction(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const token = await getAuthToken();
  const auditContext = await createAuditContext();

  if (!token) {
    return {
      errors: {
        _form: ['Authentication required']
      }
    };
  }

  try {
    // Parse and validate form data
    const rawData = {
      studentId: formData.get('studentId'),
      recordType: formData.get('recordType'),
      title: formData.get('title'),
      description: formData.get('description'),
      recordDate: formData.get('recordDate'),
      provider: formData.get('provider') || undefined,
      providerNpi: formData.get('providerNpi') || '',
      facility: formData.get('facility') || undefined,
      facilityNpi: formData.get('facilityNpi') || '',
      diagnosis: formData.get('diagnosis') || undefined,
      diagnosisCode: formData.get('diagnosisCode') || '',
      treatment: formData.get('treatment') || undefined,
      followUpRequired: formData.get('followUpRequired') === 'true',
      followUpDate: formData.get('followUpDate') || undefined,
      followUpCompleted: formData.get('followUpCompleted') === 'true',
      isConfidential: formData.get('isConfidential') === 'true',
      notes: formData.get('notes') || undefined,
      attachments: []
    };

    const validatedData = healthRecordCreateSchema.parse(rawData);

    // Create health record via backend API with enhanced fetch
    const response = await enhancedFetch(`${BACKEND_URL}/health-records`, {
      method: 'POST',
      body: JSON.stringify(validatedData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create health record');
    }

    const result = await response.json();

    // HIPAA AUDIT LOG - Mandatory for PHI creation
    await auditLog({
      ...auditContext,
      action: AUDIT_ACTIONS.CREATE_HEALTH_RECORD,
      resource: 'HealthRecord',
      resourceId: result.data.id,
      details: `Created ${validatedData.recordType} health record for student ${validatedData.studentId}`,
      success: true
    });

    // Enhanced cache invalidation with Next.js v16
    revalidateTag('health-records');
    revalidateTag(`student-${validatedData.studentId}-health-records`);
    revalidateTag('phi-data');
    revalidatePath(`/students/${validatedData.studentId}/health-records`);
    revalidatePath('/health-records');

    return {
      success: true,
      data: result.data,
      message: 'Health record created successfully'
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors: Record<string, string[]> = {};
      error.issues.forEach((err: ZodIssue) => {
        const path = err.path.join('.');
        if (!fieldErrors[path]) {
          fieldErrors[path] = [];
        }
        fieldErrors[path].push(err.message);
      });

      return {
        errors: fieldErrors
      };
    }

    // HIPAA AUDIT LOG - Log failed attempt
    await auditLog({
      ...auditContext,
      action: AUDIT_ACTIONS.CREATE_HEALTH_RECORD,
      resource: 'HealthRecord',
      details: 'Failed to create health record',
      success: false,
      errorMessage: error instanceof Error ? error.message : 'Unknown error'
    });

    return {
      errors: {
        _form: [error instanceof Error ? error.message : 'Failed to create health record']
      }
    };
  }
}

/**
 * Get health records with enhanced caching
 */
export async function getHealthRecordsAction(studentId?: string, recordType?: string) {
  cacheLife('max');
  cacheTag('health-records', studentId ? `student-${studentId}-health-records` : '', 'phi-data');

  try {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const params = new URLSearchParams();
    if (studentId) params.append('studentId', studentId);
    if (recordType) params.append('recordType', recordType);

    const response = await enhancedFetch(`${BACKEND_URL}/health-records?${params.toString()}`, {
      method: 'GET'
    });

    if (!response.ok) {
      throw new Error('Failed to fetch health records');
    }

    const result = await response.json();

    // HIPAA AUDIT LOG - PHI access
    const auditContext = await createAuditContext();
    await auditLog({
      ...auditContext,
      action: AUDIT_ACTIONS.VIEW_HEALTH_RECORD,
      resource: 'HealthRecord',
      details: `Accessed health records${studentId ? ` for student ${studentId}` : ''}`,
      success: true
    });

    return {
      success: true,
      data: result.data || result
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch health records'
    };
  }
}

/**
 * Update health record with HIPAA audit logging
 */
export async function updateHealthRecordAction(
  id: string,
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const token = await getAuthToken();
  const auditContext = await createAuditContext();

  if (!token) {
    return {
      errors: {
        _form: ['Authentication required']
      }
    };
  }

  try {
    const rawData = {
      recordType: formData.get('recordType') || undefined,
      title: formData.get('title') || undefined,
      description: formData.get('description') || undefined,
      recordDate: formData.get('recordDate') || undefined,
      provider: formData.get('provider') || undefined,
      providerNpi: formData.get('providerNpi') || '',
      facility: formData.get('facility') || undefined,
      facilityNpi: formData.get('facilityNpi') || '',
      diagnosis: formData.get('diagnosis') || undefined,
      diagnosisCode: formData.get('diagnosisCode') || '',
      treatment: formData.get('treatment') || undefined,
      followUpRequired: formData.get('followUpRequired') ? formData.get('followUpRequired') === 'true' : undefined,
      followUpDate: formData.get('followUpDate') || undefined,
      followUpCompleted: formData.get('followUpCompleted') ? formData.get('followUpCompleted') === 'true' : undefined,
      isConfidential: formData.get('isConfidential') ? formData.get('isConfidential') === 'true' : undefined,
      notes: formData.get('notes') || undefined
    };

    const validatedData = healthRecordUpdateSchema.parse(rawData);

    const response = await enhancedFetch(`${BACKEND_URL}/health-records/${id}`, {
      method: 'PUT',
      body: JSON.stringify(validatedData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update health record');
    }

    const result = await response.json();

    // HIPAA AUDIT LOG - Mandatory for PHI modification
    await auditLog({
      ...auditContext,
      action: AUDIT_ACTIONS.UPDATE_HEALTH_RECORD,
      resource: 'HealthRecord',
      resourceId: id,
      details: `Updated health record ${id}`,
      changes: validatedData,
      success: true
    });

    // Enhanced cache invalidation
    revalidateTag('health-records');
    revalidateTag(`health-record-${id}`);
    revalidateTag('phi-data');
    revalidatePath(`/health-records/${id}`);
    revalidatePath('/health-records');

    return {
      success: true,
      data: result.data,
      message: 'Health record updated successfully'
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors: Record<string, string[]> = {};
      error.issues.forEach((err: ZodIssue) => {
        const path = err.path.join('.');
        if (!fieldErrors[path]) {
          fieldErrors[path] = [];
        }
        fieldErrors[path].push(err.message);
      });

      return {
        errors: fieldErrors
      };
    }

    // HIPAA AUDIT LOG - Log failed update attempt
    await auditLog({
      ...auditContext,
      action: AUDIT_ACTIONS.UPDATE_HEALTH_RECORD,
      resource: 'HealthRecord',
      resourceId: id,
      details: `Failed to update health record ${id}`,
      success: false,
      errorMessage: error instanceof Error ? error.message : 'Unknown error'
    });

    return {
      errors: {
        _form: [error instanceof Error ? error.message : 'Failed to update health record']
      }
    };
  }
}

/**
 * Delete health record with HIPAA audit logging
 */
export async function deleteHealthRecordAction(id: string): Promise<ActionResult> {
  const token = await getAuthToken();
  const auditContext = await createAuditContext();

  if (!token) {
    return {
      errors: {
        _form: ['Authentication required']
      }
    };
  }

  try {
    const response = await enhancedFetch(`${BACKEND_URL}/health-records/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete health record');
    }

    // HIPAA AUDIT LOG - Mandatory for PHI deletion
    await auditLog({
      ...auditContext,
      action: AUDIT_ACTIONS.DELETE_HEALTH_RECORD,
      resource: 'HealthRecord',
      resourceId: id,
      details: `Deleted health record ${id}`,
      success: true
    });

    // Enhanced cache invalidation
    revalidateTag('health-records');
    revalidateTag(`health-record-${id}`);
    revalidateTag('phi-data');
    revalidatePath('/health-records');

    return {
      success: true,
      message: 'Health record deleted successfully'
    };
  } catch (error) {
    // HIPAA AUDIT LOG - Log failed delete attempt
    await auditLog({
      ...auditContext,
      action: AUDIT_ACTIONS.DELETE_HEALTH_RECORD,
      resource: 'HealthRecord',
      resourceId: id,
      details: `Failed to delete health record ${id}`,
      success: false,
      errorMessage: error instanceof Error ? error.message : 'Unknown error'
    });

    return {
      errors: {
        _form: [error instanceof Error ? error.message : 'Failed to delete health record']
      }
    };
  }
}

// ==========================================
// IMMUNIZATION ACTIONS
// ==========================================

/**
 * Create immunization record with HIPAA audit logging
 */
export async function createImmunizationAction(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const token = await getAuthToken();
  const auditContext = await createAuditContext();

  if (!token) {
    return {
      errors: {
        _form: ['Authentication required']
      }
    };
  }

  try {
    const rawData = {
      studentId: formData.get('studentId'),
      vaccineName: formData.get('vaccineName'),
      vaccineType: formData.get('vaccineType') || undefined,
      manufacturer: formData.get('manufacturer') || undefined,
      lotNumber: formData.get('lotNumber') || undefined,
      cvxCode: formData.get('cvxCode') || '',
      ndcCode: formData.get('ndcCode') || '',
      doseNumber: formData.get('doseNumber') ? Number(formData.get('doseNumber')) : undefined,
      totalDoses: formData.get('totalDoses') ? Number(formData.get('totalDoses')) : undefined,
      seriesComplete: formData.get('seriesComplete') === 'true',
      administrationDate: formData.get('administrationDate'),
      administeredBy: formData.get('administeredBy'),
      administeredByRole: formData.get('administeredByRole') || undefined,
      facility: formData.get('facility') || undefined,
      siteOfAdministration: formData.get('siteOfAdministration') || undefined,
      routeOfAdministration: formData.get('routeOfAdministration') || undefined,
      dosageAmount: formData.get('dosageAmount') || undefined,
      expirationDate: formData.get('expirationDate') || undefined,
      nextDueDate: formData.get('nextDueDate') || undefined,
      reactions: formData.get('reactions') || undefined,
      exemptionStatus: formData.get('exemptionStatus') === 'true',
      exemptionReason: formData.get('exemptionReason') || undefined,
      exemptionDocument: formData.get('exemptionDocument') || undefined,
      complianceStatus: formData.get('complianceStatus') || 'COMPLIANT',
      vfcEligibility: formData.get('vfcEligibility') === 'true',
      visProvided: formData.get('visProvided') === 'true',
      visDate: formData.get('visDate') || undefined,
      consentObtained: formData.get('consentObtained') === 'true',
      consentBy: formData.get('consentBy') || undefined,
      notes: formData.get('notes') || undefined
    };

    const validatedData = immunizationCreateSchema.parse(rawData);

    const response = await enhancedFetch(`${BACKEND_URL}/vaccinations`, {
      method: 'POST',
      body: JSON.stringify(validatedData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create immunization record');
    }

    const result = await response.json();

    // HIPAA AUDIT LOG - Mandatory for immunization PHI
    await auditLog({
      ...auditContext,
      action: AUDIT_ACTIONS.CREATE_HEALTH_RECORD,
      resource: 'Vaccination',
      resourceId: result.data.id,
      details: `Created ${validatedData.vaccineName} immunization for student ${validatedData.studentId}`,
      success: true
    });

    // Enhanced cache invalidation
    revalidateTag('health-records');
    revalidateTag('immunizations');
    revalidateTag(`student-${validatedData.studentId}-health-records`);
    revalidateTag('phi-data');
    revalidatePath(`/students/${validatedData.studentId}/health-records/immunizations`);
    revalidatePath('/health-records');

    return {
      success: true,
      data: result.data,
      message: 'Immunization record created successfully'
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors: Record<string, string[]> = {};
      error.issues.forEach((err: ZodIssue) => {
        const path = err.path.join('.');
        if (!fieldErrors[path]) {
          fieldErrors[path] = [];
        }
        fieldErrors[path].push(err.message);
      });

      return {
        errors: fieldErrors
      };
    }

    await auditLog({
      ...auditContext,
      action: AUDIT_ACTIONS.CREATE_HEALTH_RECORD,
      resource: 'Vaccination',
      details: 'Failed to create immunization record',
      success: false,
      errorMessage: error instanceof Error ? error.message : 'Unknown error'
    });

    return {
      errors: {
        _form: [error instanceof Error ? error.message : 'Failed to create immunization record']
      }
    };
  }
}

// ==========================================
// ALLERGY ACTIONS
// ==========================================

/**
 * Create allergy record with HIPAA audit logging
 * CRITICAL: Allergies are emergency-critical PHI
 */
export async function createAllergyAction(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const token = await getAuthToken();
  const auditContext = await createAuditContext();

  if (!token) {
    return {
      errors: {
        _form: ['Authentication required']
      }
    };
  }

  try {
    const rawData = {
      studentId: formData.get('studentId'),
      allergen: formData.get('allergen'),
      allergyType: formData.get('allergyType'),
      severity: formData.get('severity'),
      symptoms: formData.get('symptoms') || undefined,
      treatment: formData.get('treatment') || undefined,
      emergencyProtocol: formData.get('emergencyProtocol') || undefined,
      onsetDate: formData.get('onsetDate') || undefined,
      diagnosedDate: formData.get('diagnosedDate') || undefined,
      diagnosedBy: formData.get('diagnosedBy') || undefined,
      verified: formData.get('verified') === 'true',
      verifiedBy: formData.get('verifiedBy') || undefined,
      verificationDate: formData.get('verificationDate') || undefined,
      active: formData.get('active') === 'true',
      epiPenRequired: formData.get('epiPenRequired') === 'true',
      epiPenLocation: formData.get('epiPenLocation') || undefined,
      epiPenExpiration: formData.get('epiPenExpiration') || undefined,
      notes: formData.get('notes') || undefined
    };

    const validatedData = allergyCreateSchema.parse(rawData);

    const response = await enhancedFetch(`${BACKEND_URL}/allergies`, {
      method: 'POST',
      body: JSON.stringify(validatedData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create allergy record');
    }

    const result = await response.json();

    // HIPAA AUDIT LOG - CRITICAL: Emergency information
    await auditLog({
      ...auditContext,
      action: AUDIT_ACTIONS.CREATE_HEALTH_RECORD,
      resource: 'Allergy',
      resourceId: result.data.id,
      details: `Created ${validatedData.severity} ${validatedData.allergyType} allergy (${validatedData.allergen}) for student ${validatedData.studentId}`,
      success: true
    });

    // Enhanced cache invalidation with immediate revalidation for emergency data
    revalidateTag('health-records');
    revalidateTag('allergies');
    revalidateTag(`student-${validatedData.studentId}-allergies`);
    revalidateTag(`student-${validatedData.studentId}-health-records`);
    revalidateTag('emergency-phi-data');
    revalidateTag('phi-data');
    revalidatePath(`/students/${validatedData.studentId}/health-records/allergies`);
    revalidatePath('/health-records');

    return {
      success: true,
      data: result.data,
      message: 'Allergy record created successfully'
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors: Record<string, string[]> = {};
      error.issues.forEach((err: ZodIssue) => {
        const path = err.path.join('.');
        if (!fieldErrors[path]) {
          fieldErrors[path] = [];
        }
        fieldErrors[path].push(err.message);
      });

      return {
        errors: fieldErrors
      };
    }

    await auditLog({
      ...auditContext,
      action: AUDIT_ACTIONS.CREATE_HEALTH_RECORD,
      resource: 'Allergy',
      details: 'Failed to create allergy record',
      success: false,
      errorMessage: error instanceof Error ? error.message : 'Unknown error'
    });

    return {
      errors: {
        _form: [error instanceof Error ? error.message : 'Failed to create allergy record']
      }
    };
  }
}

/**
 * Get student allergies with enhanced caching for emergency access
 */
export async function getStudentAllergiesAction(studentId: string) {
  cacheLife('max'); // Cache indefinitely until explicitly invalidated
  cacheTag('allergies', `student-${studentId}-allergies`, 'emergency-phi-data', 'phi-data');

  try {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await enhancedFetch(`${BACKEND_URL}/allergies?studentId=${studentId}`, {
      method: 'GET',
      next: {
        revalidate: 60, // 1-minute cache for emergency data
        tags: ['allergies', `student-${studentId}-allergies`, 'emergency-phi-data']
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch student allergies');
    }

    const result = await response.json();

    // HIPAA AUDIT LOG - Emergency PHI access
    const auditContext = await createAuditContext();
    await auditLog({
      ...auditContext,
      action: AUDIT_ACTIONS.VIEW_HEALTH_RECORD,
      resource: 'Allergy',
      details: `Accessed emergency allergy information for student ${studentId}`,
      success: true
    });

    return {
      success: true,
      data: result.data || result
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch student allergies'
    };
  }
}

/**
 * Health Records Statistics Interface
 * Dashboard metrics for health records overview
 */
export interface HealthRecordsStats {
  totalRecords: number;
  activeConditions: number;
  criticalAllergies: number;
  pendingImmunizations: number;
  recentUpdates: number;
  compliance: number;
  urgentFollowUps: number;
  recordTypes: {
    immunizations: number;
    allergies: number;
    conditions: number;
    vitalSigns: number;
    medications: number;
  };
}

/**
 * Get Health Records Statistics
 * Dashboard overview of health records metrics
 * 
 * @returns Promise<HealthRecordsStats>
 */
export async function getHealthRecordsStats(): Promise<HealthRecordsStats> {
  'use cache';
  cacheLife('medium');
  cacheTag('health-records-stats');

  try {
    console.log('[Health Records] Loading health records statistics');

    // In production, this would aggregate data from database
    const stats: HealthRecordsStats = {
      totalRecords: 2847,
      activeConditions: 156,
      criticalAllergies: 28,
      pendingImmunizations: 42,
      recentUpdates: 89,
      compliance: 94.2,
      urgentFollowUps: 12,
      recordTypes: {
        immunizations: 1250,
        allergies: 287,
        conditions: 456,
        vitalSigns: 534,
        medications: 320
      }
    };

    console.log('[Health Records] Health records statistics loaded successfully');
    return stats;

  } catch (error) {
    console.error('[Health Records] Failed to load health records statistics:', error);
    
    // Return safe defaults on error
    return {
      totalRecords: 0,
      activeConditions: 0,
      criticalAllergies: 0,
      pendingImmunizations: 0,
      recentUpdates: 0,
      compliance: 0,
      urgentFollowUps: 0,
      recordTypes: {
        immunizations: 0,
        allergies: 0,
        conditions: 0,
        vitalSigns: 0,
        medications: 0
      }
    };
  }
}

/**
 * Get Health Records Dashboard Data
 * Combined dashboard data for health records overview
 * 
 * @returns Promise<{stats: HealthRecordsStats}>
 */
export async function getHealthRecordsDashboardData() {
  'use cache';
  cacheLife('medium');
  cacheTag('health-records-dashboard');

  try {
    console.log('[Health Records] Loading dashboard data');

    const stats = await getHealthRecordsStats();

    console.log('[Health Records] Dashboard data loaded successfully');
    return { stats };

  } catch (error) {
    console.error('[Health Records] Failed to load dashboard data:', error);
    
    return {
      stats: await getHealthRecordsStats() // Will return safe defaults
    };
  }
}
