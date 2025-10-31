/**
 * @fileoverview Server Actions for Health Records Module
 * @module actions/health-records
 *
 * Next.js Server Actions for health records, immunizations, allergies, vital signs, and conditions.
 * HIPAA CRITICAL: ALL operations include mandatory audit logging for PHI access.
 *
 * @example
 * ```typescript
 * 'use client';
 *
 * import { useFormState } from 'react-dom';
 * import { createHealthRecordAction } from '@/actions/health-records.actions';
 *
 * function HealthRecordForm() {
 *   const [state, formAction] = useFormState(createHealthRecordAction, { errors: {} });
 *   return <form action={formAction}>...</form>;
 * }
 * ```
 */

'use server';

import { cookies } from 'next/headers';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z, type ZodIssue } from 'zod';

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

export interface ActionResult<T = any> {
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

// ==========================================
// HEALTH RECORD ACTIONS
// ==========================================

/**
 * Create a new health record with HIPAA audit logging
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

    // Create health record via backend API
    const response = await fetch(`${BACKEND_URL}/health-records`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
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

    // Revalidate relevant paths
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
      error.errors.forEach((err: ZodIssue) => {
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

    const response = await fetch(`${BACKEND_URL}/health-records/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
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
      error.errors.forEach((err: ZodIssue) => {
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
    const response = await fetch(`${BACKEND_URL}/health-records/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
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

    const response = await fetch(`${BACKEND_URL}/vaccinations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
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
      error.errors.forEach((err: ZodIssue) => {
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

/**
 * Update immunization record with HIPAA audit logging
 */
export async function updateImmunizationAction(
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
      vaccineName: formData.get('vaccineName') || undefined,
      vaccineType: formData.get('vaccineType') || undefined,
      manufacturer: formData.get('manufacturer') || undefined,
      lotNumber: formData.get('lotNumber') || undefined,
      cvxCode: formData.get('cvxCode') || '',
      ndcCode: formData.get('ndcCode') || '',
      doseNumber: formData.get('doseNumber') ? Number(formData.get('doseNumber')) : undefined,
      totalDoses: formData.get('totalDoses') ? Number(formData.get('totalDoses')) : undefined,
      seriesComplete: formData.get('seriesComplete') ? formData.get('seriesComplete') === 'true' : undefined,
      administrationDate: formData.get('administrationDate') || undefined,
      administeredBy: formData.get('administeredBy') || undefined,
      administeredByRole: formData.get('administeredByRole') || undefined,
      facility: formData.get('facility') || undefined,
      siteOfAdministration: formData.get('siteOfAdministration') || undefined,
      routeOfAdministration: formData.get('routeOfAdministration') || undefined,
      dosageAmount: formData.get('dosageAmount') || undefined,
      expirationDate: formData.get('expirationDate') || undefined,
      nextDueDate: formData.get('nextDueDate') || undefined,
      reactions: formData.get('reactions') || undefined,
      exemptionStatus: formData.get('exemptionStatus') ? formData.get('exemptionStatus') === 'true' : undefined,
      exemptionReason: formData.get('exemptionReason') || undefined,
      exemptionDocument: formData.get('exemptionDocument') || undefined,
      complianceStatus: formData.get('complianceStatus') || undefined,
      vfcEligibility: formData.get('vfcEligibility') ? formData.get('vfcEligibility') === 'true' : undefined,
      visProvided: formData.get('visProvided') ? formData.get('visProvided') === 'true' : undefined,
      visDate: formData.get('visDate') || undefined,
      consentObtained: formData.get('consentObtained') ? formData.get('consentObtained') === 'true' : undefined,
      consentBy: formData.get('consentBy') || undefined,
      notes: formData.get('notes') || undefined
    };

    const validatedData = immunizationUpdateSchema.parse(rawData);

    const response = await fetch(`${BACKEND_URL}/vaccinations/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(validatedData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update immunization record');
    }

    const result = await response.json();

    // HIPAA AUDIT LOG
    await auditLog({
      ...auditContext,
      action: AUDIT_ACTIONS.UPDATE_HEALTH_RECORD,
      resource: 'Vaccination',
      resourceId: id,
      details: `Updated immunization record ${id}`,
      changes: validatedData,
      success: true
    });

    revalidatePath(`/health-records/immunizations/${id}`);
    revalidatePath('/health-records');

    return {
      success: true,
      data: result.data,
      message: 'Immunization record updated successfully'
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors: Record<string, string[]> = {};
      error.errors.forEach((err: ZodIssue) => {
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
      action: AUDIT_ACTIONS.UPDATE_HEALTH_RECORD,
      resource: 'Vaccination',
      resourceId: id,
      details: `Failed to update immunization record ${id}`,
      success: false,
      errorMessage: error instanceof Error ? error.message : 'Unknown error'
    });

    return {
      errors: {
        _form: [error instanceof Error ? error.message : 'Failed to update immunization record']
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

    const response = await fetch(`${BACKEND_URL}/allergies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
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
      error.errors.forEach((err: ZodIssue) => {
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
 * Update allergy record with HIPAA audit logging
 */
export async function updateAllergyAction(
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
      allergen: formData.get('allergen') || undefined,
      allergyType: formData.get('allergyType') || undefined,
      severity: formData.get('severity') || undefined,
      symptoms: formData.get('symptoms') || undefined,
      treatment: formData.get('treatment') || undefined,
      emergencyProtocol: formData.get('emergencyProtocol') || undefined,
      onsetDate: formData.get('onsetDate') || undefined,
      diagnosedDate: formData.get('diagnosedDate') || undefined,
      diagnosedBy: formData.get('diagnosedBy') || undefined,
      verified: formData.get('verified') ? formData.get('verified') === 'true' : undefined,
      verifiedBy: formData.get('verifiedBy') || undefined,
      verificationDate: formData.get('verificationDate') || undefined,
      active: formData.get('active') ? formData.get('active') === 'true' : undefined,
      epiPenRequired: formData.get('epiPenRequired') ? formData.get('epiPenRequired') === 'true' : undefined,
      epiPenLocation: formData.get('epiPenLocation') || undefined,
      epiPenExpiration: formData.get('epiPenExpiration') || undefined,
      notes: formData.get('notes') || undefined
    };

    const validatedData = allergyUpdateSchema.parse(rawData);

    const response = await fetch(`${BACKEND_URL}/allergies/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(validatedData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update allergy record');
    }

    const result = await response.json();

    // HIPAA AUDIT LOG
    await auditLog({
      ...auditContext,
      action: AUDIT_ACTIONS.UPDATE_HEALTH_RECORD,
      resource: 'Allergy',
      resourceId: id,
      details: `Updated allergy record ${id}`,
      changes: validatedData,
      success: true
    });

    revalidatePath(`/health-records/allergies/${id}`);
    revalidatePath('/health-records');

    return {
      success: true,
      data: result.data,
      message: 'Allergy record updated successfully'
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors: Record<string, string[]> = {};
      error.errors.forEach((err: ZodIssue) => {
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
      action: AUDIT_ACTIONS.UPDATE_HEALTH_RECORD,
      resource: 'Allergy',
      resourceId: id,
      details: `Failed to update allergy record ${id}`,
      success: false,
      errorMessage: error instanceof Error ? error.message : 'Unknown error'
    });

    return {
      errors: {
        _form: [error instanceof Error ? error.message : 'Failed to update allergy record']
      }
    };
  }
}

/**
 * Delete allergy record with HIPAA audit logging
 */
export async function deleteAllergyAction(id: string): Promise<ActionResult> {
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
    const response = await fetch(`${BACKEND_URL}/allergies/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete allergy record');
    }

    // HIPAA AUDIT LOG
    await auditLog({
      ...auditContext,
      action: AUDIT_ACTIONS.DELETE_HEALTH_RECORD,
      resource: 'Allergy',
      resourceId: id,
      details: `Deleted allergy record ${id}`,
      success: true
    });

    revalidatePath('/health-records');

    return {
      success: true,
      message: 'Allergy record deleted successfully'
    };
  } catch (error) {
    await auditLog({
      ...auditContext,
      action: AUDIT_ACTIONS.DELETE_HEALTH_RECORD,
      resource: 'Allergy',
      resourceId: id,
      details: `Failed to delete allergy record ${id}`,
      success: false,
      errorMessage: error instanceof Error ? error.message : 'Unknown error'
    });

    return {
      errors: {
        _form: [error instanceof Error ? error.message : 'Failed to delete allergy record']
      }
    };
  }
}

// ==========================================
// VITAL SIGNS ACTIONS
// ==========================================

/**
 * Create vital signs record with HIPAA audit logging
 */
export async function createVitalSignsAction(
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
      healthRecordId: formData.get('healthRecordId') || undefined,
      appointmentId: formData.get('appointmentId') || undefined,
      measurementDate: formData.get('measurementDate'),
      measuredBy: formData.get('measuredBy'),
      measuredByRole: formData.get('measuredByRole') || undefined,
      temperature: formData.get('temperature') ? Number(formData.get('temperature')) : undefined,
      temperatureUnit: formData.get('temperatureUnit') || 'F',
      temperatureSite: formData.get('temperatureSite') || undefined,
      bloodPressureSystolic: formData.get('bloodPressureSystolic') ? Number(formData.get('bloodPressureSystolic')) : undefined,
      bloodPressureDiastolic: formData.get('bloodPressureDiastolic') ? Number(formData.get('bloodPressureDiastolic')) : undefined,
      bloodPressurePosition: formData.get('bloodPressurePosition') || undefined,
      heartRate: formData.get('heartRate') ? Number(formData.get('heartRate')) : undefined,
      heartRhythm: formData.get('heartRhythm') || undefined,
      respiratoryRate: formData.get('respiratoryRate') ? Number(formData.get('respiratoryRate')) : undefined,
      oxygenSaturation: formData.get('oxygenSaturation') ? Number(formData.get('oxygenSaturation')) : undefined,
      oxygenSupplemental: formData.get('oxygenSupplemental') === 'true',
      painLevel: formData.get('painLevel') ? Number(formData.get('painLevel')) : undefined,
      painLocation: formData.get('painLocation') || undefined,
      consciousness: formData.get('consciousness') || undefined,
      glucoseLevel: formData.get('glucoseLevel') ? Number(formData.get('glucoseLevel')) : undefined,
      peakFlow: formData.get('peakFlow') ? Number(formData.get('peakFlow')) : undefined,
      notes: formData.get('notes') || undefined
    };

    const validatedData = vitalSignsCreateSchema.parse(rawData);

    const response = await fetch(`${BACKEND_URL}/vital-signs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(validatedData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create vital signs record');
    }

    const result = await response.json();

    // HIPAA AUDIT LOG
    await auditLog({
      ...auditContext,
      action: AUDIT_ACTIONS.CREATE_HEALTH_RECORD,
      resource: 'VitalSigns',
      resourceId: result.data.id,
      details: `Created vital signs record for student ${validatedData.studentId}`,
      success: true
    });

    revalidatePath(`/students/${validatedData.studentId}/health-records/vital-signs`);
    revalidatePath('/health-records');

    return {
      success: true,
      data: result.data,
      message: 'Vital signs recorded successfully'
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors: Record<string, string[]> = {};
      error.errors.forEach((err: ZodIssue) => {
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
      resource: 'VitalSigns',
      details: 'Failed to create vital signs record',
      success: false,
      errorMessage: error instanceof Error ? error.message : 'Unknown error'
    });

    return {
      errors: {
        _form: [error instanceof Error ? error.message : 'Failed to record vital signs']
      }
    };
  }
}

/**
 * Update vital signs record with HIPAA audit logging
 */
export async function updateVitalSignsAction(
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
      measurementDate: formData.get('measurementDate') || undefined,
      measuredBy: formData.get('measuredBy') || undefined,
      measuredByRole: formData.get('measuredByRole') || undefined,
      temperature: formData.get('temperature') ? Number(formData.get('temperature')) : undefined,
      temperatureUnit: formData.get('temperatureUnit') || undefined,
      temperatureSite: formData.get('temperatureSite') || undefined,
      bloodPressureSystolic: formData.get('bloodPressureSystolic') ? Number(formData.get('bloodPressureSystolic')) : undefined,
      bloodPressureDiastolic: formData.get('bloodPressureDiastolic') ? Number(formData.get('bloodPressureDiastolic')) : undefined,
      bloodPressurePosition: formData.get('bloodPressurePosition') || undefined,
      heartRate: formData.get('heartRate') ? Number(formData.get('heartRate')) : undefined,
      heartRhythm: formData.get('heartRhythm') || undefined,
      respiratoryRate: formData.get('respiratoryRate') ? Number(formData.get('respiratoryRate')) : undefined,
      oxygenSaturation: formData.get('oxygenSaturation') ? Number(formData.get('oxygenSaturation')) : undefined,
      oxygenSupplemental: formData.get('oxygenSupplemental') ? formData.get('oxygenSupplemental') === 'true' : undefined,
      painLevel: formData.get('painLevel') ? Number(formData.get('painLevel')) : undefined,
      painLocation: formData.get('painLocation') || undefined,
      consciousness: formData.get('consciousness') || undefined,
      glucoseLevel: formData.get('glucoseLevel') ? Number(formData.get('glucoseLevel')) : undefined,
      peakFlow: formData.get('peakFlow') ? Number(formData.get('peakFlow')) : undefined,
      notes: formData.get('notes') || undefined
    };

    const validatedData = vitalSignsUpdateSchema.parse(rawData);

    const response = await fetch(`${BACKEND_URL}/vital-signs/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(validatedData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update vital signs record');
    }

    const result = await response.json();

    // HIPAA AUDIT LOG
    await auditLog({
      ...auditContext,
      action: AUDIT_ACTIONS.UPDATE_HEALTH_RECORD,
      resource: 'VitalSigns',
      resourceId: id,
      details: `Updated vital signs record ${id}`,
      changes: validatedData,
      success: true
    });

    revalidatePath(`/health-records/vital-signs/${id}`);
    revalidatePath('/health-records');

    return {
      success: true,
      data: result.data,
      message: 'Vital signs updated successfully'
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors: Record<string, string[]> = {};
      error.errors.forEach((err: ZodIssue) => {
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
      action: AUDIT_ACTIONS.UPDATE_HEALTH_RECORD,
      resource: 'VitalSigns',
      resourceId: id,
      details: `Failed to update vital signs record ${id}`,
      success: false,
      errorMessage: error instanceof Error ? error.message : 'Unknown error'
    });

    return {
      errors: {
        _form: [error instanceof Error ? error.message : 'Failed to update vital signs']
      }
    };
  }
}

// ==========================================
// MEDICAL CONDITION ACTIONS
// ==========================================

/**
 * Create medical condition record with HIPAA audit logging
 */
export async function createMedicalConditionAction(
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
      condition: formData.get('condition'),
      icdCode: formData.get('icdCode') || '',
      diagnosisDate: formData.get('diagnosisDate'),
      diagnosedBy: formData.get('diagnosedBy') || undefined,
      severity: formData.get('severity'),
      status: formData.get('status'),
      treatments: formData.get('treatments') || undefined,
      accommodationsRequired: formData.get('accommodationsRequired') === 'true',
      accommodationDetails: formData.get('accommodationDetails') || undefined,
      emergencyProtocol: formData.get('emergencyProtocol') || undefined,
      actionPlan: formData.get('actionPlan') || undefined,
      nextReviewDate: formData.get('nextReviewDate') || undefined,
      reviewFrequency: formData.get('reviewFrequency') || undefined,
      triggers: formData.get('triggers') ? JSON.parse(formData.get('triggers') as string) : [],
      notes: formData.get('notes') || undefined,
      carePlan: formData.get('carePlan') || undefined
    };

    const validatedData = medicalConditionCreateSchema.parse(rawData);

    const response = await fetch(`${BACKEND_URL}/chronic-conditions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(validatedData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create medical condition record');
    }

    const result = await response.json();

    // HIPAA AUDIT LOG
    await auditLog({
      ...auditContext,
      action: AUDIT_ACTIONS.CREATE_HEALTH_RECORD,
      resource: 'ChronicCondition',
      resourceId: result.data.id,
      details: `Created ${validatedData.severity} ${validatedData.condition} condition for student ${validatedData.studentId}`,
      success: true
    });

    revalidatePath(`/students/${validatedData.studentId}/health-records/conditions`);
    revalidatePath('/health-records');

    return {
      success: true,
      data: result.data,
      message: 'Medical condition record created successfully'
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors: Record<string, string[]> = {};
      error.errors.forEach((err: ZodIssue) => {
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
      resource: 'ChronicCondition',
      details: 'Failed to create medical condition record',
      success: false,
      errorMessage: error instanceof Error ? error.message : 'Unknown error'
    });

    return {
      errors: {
        _form: [error instanceof Error ? error.message : 'Failed to create medical condition record']
      }
    };
  }
}

/**
 * Update medical condition record with HIPAA audit logging
 */
export async function updateMedicalConditionAction(
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
      condition: formData.get('condition') || undefined,
      icdCode: formData.get('icdCode') || '',
      diagnosisDate: formData.get('diagnosisDate') || undefined,
      diagnosedBy: formData.get('diagnosedBy') || undefined,
      severity: formData.get('severity') || undefined,
      status: formData.get('status') || undefined,
      treatments: formData.get('treatments') || undefined,
      accommodationsRequired: formData.get('accommodationsRequired') ? formData.get('accommodationsRequired') === 'true' : undefined,
      accommodationDetails: formData.get('accommodationDetails') || undefined,
      emergencyProtocol: formData.get('emergencyProtocol') || undefined,
      actionPlan: formData.get('actionPlan') || undefined,
      nextReviewDate: formData.get('nextReviewDate') || undefined,
      reviewFrequency: formData.get('reviewFrequency') || undefined,
      triggers: formData.get('triggers') ? JSON.parse(formData.get('triggers') as string) : undefined,
      notes: formData.get('notes') || undefined,
      carePlan: formData.get('carePlan') || undefined,
      lastReviewDate: formData.get('lastReviewDate') || undefined
    };

    const validatedData = medicalConditionUpdateSchema.parse(rawData);

    const response = await fetch(`${BACKEND_URL}/chronic-conditions/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(validatedData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update medical condition record');
    }

    const result = await response.json();

    // HIPAA AUDIT LOG
    await auditLog({
      ...auditContext,
      action: AUDIT_ACTIONS.UPDATE_HEALTH_RECORD,
      resource: 'ChronicCondition',
      resourceId: id,
      details: `Updated medical condition record ${id}`,
      changes: validatedData,
      success: true
    });

    revalidatePath(`/health-records/conditions/${id}`);
    revalidatePath('/health-records');

    return {
      success: true,
      data: result.data,
      message: 'Medical condition record updated successfully'
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors: Record<string, string[]> = {};
      error.errors.forEach((err: ZodIssue) => {
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
      action: AUDIT_ACTIONS.UPDATE_HEALTH_RECORD,
      resource: 'ChronicCondition',
      resourceId: id,
      details: `Failed to update medical condition record ${id}`,
      success: false,
      errorMessage: error instanceof Error ? error.message : 'Unknown error'
    });

    return {
      errors: {
        _form: [error instanceof Error ? error.message : 'Failed to update medical condition record']
      }
    };
  }
}
