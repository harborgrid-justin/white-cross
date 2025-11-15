/**
 * Incident Operations
 * Incident-specific operations like notifications, evidence, insurance, and compliance
 */

'use server';

import { revalidatePath } from 'next/cache';
import { serverPost, serverPatch } from '@/lib/api/server';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// ==========================================
// PARENT NOTIFICATION
// ==========================================

export async function markParentNotified(
  incidentId: string,
  method: string,
  notifiedBy: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const url = `${API_BASE}/api/incident-report/${incidentId}/parent-notified`;
    await serverPost(url, { method, notifiedBy }, { cache: 'no-store' });
    revalidatePath(`/incidents/${incidentId}`);
    return { success: true };
  } catch (error) {
    const err = error as Error;
    console.error('Error marking parent notified:', err);
    return { success: false, error: err.message };
  }
}

export async function notifyParent(
  incidentId: string,
  method: string,
  notifiedBy: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const url = `${API_BASE}/api/incident-report/${incidentId}/notify-parent`;
    await serverPost(url, { method, notifiedBy }, { cache: 'no-store' });
    revalidatePath(`/incidents/${incidentId}`);
    return { success: true };
  } catch (error) {
    const err = error as Error;
    console.error('Error notifying parent:', err);
    return { success: false, error: err.message };
  }
}

// ==========================================
// EVIDENCE MANAGEMENT
// ==========================================

export async function addEvidence(
  incidentId: string,
  evidenceType: 'photo' | 'video' | 'attachment',
  evidenceUrls: string[]
): Promise<{ success: boolean; error?: string }> {
  try {
    const url = `${API_BASE}/api/incident-report/${incidentId}/evidence`;
    await serverPost(url, { evidenceType, evidenceUrls }, { cache: 'no-store' });
    revalidatePath(`/incidents/${incidentId}`);
    return { success: true };
  } catch (error) {
    const err = error as Error;
    console.error('Error adding evidence:', err);
    return { success: false, error: err.message };
  }
}

// ==========================================
// INSURANCE CLAIMS
// ==========================================

export async function updateInsuranceClaim(
  incidentId: string,
  claimNumber: string,
  status: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const url = `${API_BASE}/api/incident-report/${incidentId}/insurance`;
    await serverPatch(url, { claimNumber, status }, { cache: 'no-store' });
    revalidatePath(`/incidents/${incidentId}`);
    return { success: true };
  } catch (error) {
    const err = error as Error;
    console.error('Error updating insurance claim:', err);
    return { success: false, error: err.message };
  }
}

// ==========================================
// COMPLIANCE STATUS
// ==========================================

export async function updateComplianceStatus(
  incidentId: string,
  status: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const url = `${API_BASE}/api/incident-report/${incidentId}/compliance`;
    await serverPatch(url, { status }, { cache: 'no-store' });
    revalidatePath(`/incidents/${incidentId}`);
    return { success: true };
  } catch (error) {
    const err = error as Error;
    console.error('Error updating compliance status:', err);
    return { success: false, error: err.message };
  }
}

// ==========================================
// EMERGENCY NOTIFICATIONS
// ==========================================

export async function notifyEmergencyContacts(incidentId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const url = `${API_BASE}/api/incident-report/${incidentId}/notify-emergency`;
    await serverPost(url, {}, { cache: 'no-store' });
    revalidatePath(`/incidents/${incidentId}`);
    return { success: true };
  } catch (error) {
    const err = error as Error;
    console.error('Error notifying emergency contacts:', err);
    return { success: false, error: err.message };
  }
}
