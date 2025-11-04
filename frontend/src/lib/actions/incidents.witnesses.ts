/**
 * Incident Witness Statements
 * Management of witness statements for incidents
 */

'use server';

import { revalidatePath } from 'next/cache';
import { serverGet, serverPost, serverPatch, serverDelete } from '@/lib/api/nextjs-client';
import type { WitnessStatement } from './incidents.types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// ==========================================
// WITNESS STATEMENT CRUD
// ==========================================

export async function getWitnessStatements(incidentId: string): Promise<WitnessStatement[]> {
  try {
    const url = `${API_BASE}/api/incident-report/${incidentId}/witness-statements`;
    const response = await serverGet<WitnessStatement[]>(url, {
      cache: 'no-store'
    });
    return response;
  } catch (error) {
    console.error(`Error fetching witness statements for incident ${incidentId}:`, error);
    return [];
  }
}

export async function addWitnessStatement(
  incidentId: string,
  data: Partial<WitnessStatement>
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const url = `${API_BASE}/api/incident-report/${incidentId}/witness-statement`;
    const response = await serverPost<WitnessStatement>(url, data, { cache: 'no-store' });
    revalidatePath(`/incidents/${incidentId}`);
    revalidatePath(`/incidents/${incidentId}/witnesses`);
    return { success: true, id: response.id };
  } catch (error) {
    const err = error as Error;
    console.error('Error adding witness statement:', err);
    return { success: false, error: err.message };
  }
}

export async function updateWitnessStatement(
  statementId: string,
  data: Partial<WitnessStatement>
): Promise<{ success: boolean; error?: string }> {
  try {
    const url = `${API_BASE}/api/incident-report/witness-statement/${statementId}`;
    await serverPatch(url, data, { cache: 'no-store' });
    revalidatePath('/incidents');
    return { success: true };
  } catch (error) {
    const err = error as Error;
    console.error(`Error updating witness statement ${statementId}:`, err);
    return { success: false, error: err.message };
  }
}

export async function deleteWitnessStatement(statementId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const url = `${API_BASE}/api/incident-report/witness-statement/${statementId}`;
    await serverDelete(url, { cache: 'no-store' });
    revalidatePath('/incidents');
    return { success: true };
  } catch (error) {
    const err = error as Error;
    console.error(`Error deleting witness statement ${statementId}:`, err);
    return { success: false, error: err.message };
  }
}

// ==========================================
// WITNESS STATEMENT VERIFICATION
// ==========================================

export async function verifyWitnessStatement(
  statementId: string,
  verifiedBy: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const url = `${API_BASE}/api/incident-report/witness-statement/${statementId}/verify`;
    await serverPost(url, { verifiedBy }, { cache: 'no-store' });
    revalidatePath('/incidents');
    return { success: true };
  } catch (error) {
    const err = error as Error;
    console.error(`Error verifying witness statement ${statementId}:`, err);
    return { success: false, error: err.message };
  }
}

export async function getUnverifiedStatements(): Promise<WitnessStatement[]> {
  try {
    const url = `${API_BASE}/api/incident-report/witness-statements/unverified`;
    const response = await serverGet<WitnessStatement[]>(url, {
      cache: 'no-store'
    });
    return response;
  } catch (error) {
    console.error('Error fetching unverified statements:', error);
    return [];
  }
}

// ==========================================
// CONVENIENCE WRAPPERS
// ==========================================

/**
 * Submit a witness statement
 * Wrapper function for addWitnessStatement to match component expectations
 */
export async function submitWitnessStatement(
  data: { incidentId: string } & Partial<WitnessStatement>
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const { incidentId, ...statementData } = data;
    return await addWitnessStatement(incidentId, statementData);
  } catch (error) {
    const err = error as Error;
    console.error('Error submitting witness statement:', err);
    return { success: false, error: err.message };
  }
}
