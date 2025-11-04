/**
 * Allergies Operations Module
 *
 * Handles allergy-related state management and CRUD operations.
 * Safety-critical: Allergies must be verified by healthcare professionals.
 *
 * @module hooks/domains/health/queries/useHealthRecordsData.allergies
 */

import { useState } from 'react'
import { API_CONFIG } from '@/constants/config'
import { API_ENDPOINTS } from '@/constants/api'
import type { Allergy } from '@/types/healthRecords'

export const useAllergiesOperations = () => {
  const [allergies, setAllergies] = useState<Allergy[]>([])

  /**
   * Load allergies for a student.
   *
   * @param {string} studentId - Student ID to fetch allergies for
   * @returns {Promise<void>}
   */
  const loadAllergies = async (studentId: string = '1') => {
    const url = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.STUDENTS.ALLERGIES(studentId)}`
    const allergyResponse = await fetch(url)
    if (allergyResponse.ok) {
      const allergyData = await allergyResponse.json()
      setAllergies(allergyData.data?.allergies || [])
    }
  }

  /**
   * Create a new allergy record for a student.
   *
   * @param {Partial<Allergy>} allergyData - Allergy data to create (requires allergen, type, severity, reaction)
   * @returns {Promise<boolean>} Promise resolving to true if creation succeeded, false otherwise
   *
   * @example
   * ```typescript
   * const newAllergy = {
   *   allergen: 'Penicillin',
   *   type: 'DRUG',
   *   severity: 'SEVERE',
   *   reaction: 'Anaphylaxis',
   *   notes: 'Carry EpiPen at all times'
   * };
   * const success = await createAllergy(newAllergy);
   * ```
   *
   * @remarks
   * - Automatically reloads allergies tab on success
   * - studentId is hardcoded to '1' (consider parameterizing)
   * - Safety-critical: Allergies should be verified by healthcare professional
   */
  const createAllergy = async (allergyData: Partial<Allergy>) => {
    const url = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.HEALTH_RECORDS.BASE}/allergies`
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId: '1', ...allergyData })
    })
    if (response.ok) {
      loadAllergies()
    }
    return response.ok
  }

  /**
   * Update an existing allergy record.
   *
   * @param {string} id - Allergy record ID to update
   * @param {Partial<Allergy>} allergyData - Partial allergy data to update
   * @returns {Promise<boolean>} Promise resolving to true if update succeeded, false otherwise
   *
   * @example
   * ```typescript
   * const updates = {
   *   severity: 'MODERATE',
   *   notes: 'Severity downgraded after consultation'
   * };
   * const success = await updateAllergy(allergyId, updates);
   * ```
   *
   * @remarks
   * - Automatically reloads allergies tab on success
   * - Consider audit logging for allergy modifications
   */
  const updateAllergy = async (id: string, allergyData: Partial<Allergy>) => {
    const url = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.HEALTH_RECORDS.BASE}/allergies/${id}`
    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(allergyData)
    })
    if (response.ok) {
      loadAllergies()
    }
    return response.ok
  }

  return {
    allergies,
    loadAllergies,
    createAllergy,
    updateAllergy,
  }
}
