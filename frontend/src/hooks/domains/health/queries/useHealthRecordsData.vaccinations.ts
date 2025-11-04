/**
 * Vaccinations Operations Module
 *
 * Handles vaccination state management and CRUD operations.
 * Follows CDC/ACIP guidelines for vaccination records.
 *
 * @module hooks/domains/health/queries/useHealthRecordsData.vaccinations
 */

import { useState } from 'react'
import { API_CONFIG } from '@/constants/config'
import { API_ENDPOINTS } from '@/constants/api'
import type { Vaccination } from '@/types/healthRecords'

export const useVaccinationsOperations = () => {
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([])

  /**
   * Load vaccinations for a student.
   *
   * @param {string} studentId - Student ID to fetch vaccinations for
   * @returns {Promise<void>}
   */
  const loadVaccinations = async (studentId: string = '1') => {
    const url = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.STUDENTS.IMMUNIZATIONS(studentId)}`
    const vaccinationResponse = await fetch(url)
    if (vaccinationResponse.ok) {
      const vaccinationData = await vaccinationResponse.json()
      setVaccinations(vaccinationData.data?.vaccinations || [])
    }
  }

  /**
   * Create a new vaccination record for a student.
   *
   * @param {Partial<Vaccination>} vaccinationData - Vaccination data (requires vaccineName, dateAdministered, dose)
   * @returns {Promise<boolean>} Promise resolving to true if creation succeeded, false otherwise
   *
   * @example
   * ```typescript
   * const vaccination = {
   *   vaccineName: 'Tdap',
   *   dateAdministered: '2024-09-15',
   *   dose: 1,
   *   manufacturer: 'Sanofi Pasteur',
   *   lotNumber: 'U3458A',
   *   administeredBy: 'Nurse Johnson',
   *   site: 'Left deltoid'
   * };
   * const success = await createVaccination(vaccination);
   * ```
   *
   * @remarks
   * - Automatically reloads vaccinations tab on success
   * - Vaccination records should follow CDC/ACIP guidelines
   * - Consider checking for duplicate vaccinations
   */
  const createVaccination = async (vaccinationData: Partial<Vaccination>) => {
    const url = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.STUDENTS.BASE}/1/vaccinations`
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vaccinationData)
    })
    if (response.ok) {
      loadVaccinations()
    }
    return response.ok
  }

  /**
   * Update an existing vaccination record.
   *
   * @param {string} id - Vaccination record ID to update
   * @param {Partial<Vaccination>} vaccinationData - Partial vaccination data to update
   * @returns {Promise<boolean>} Promise resolving to true if update succeeded, false otherwise
   *
   * @example
   * ```typescript
   * const updates = {
   *   notes: 'Patient tolerated vaccine well, no adverse reactions'
   * };
   * const success = await updateVaccination(vaccineId, updates);
   * ```
   */
  const updateVaccination = async (id: string, vaccinationData: Partial<Vaccination>) => {
    const url = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.STUDENTS.BASE}/1/vaccinations/${id}`
    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vaccinationData)
    })
    if (response.ok) {
      loadVaccinations()
    }
    return response.ok
  }

  /**
   * Delete a vaccination record.
   *
   * @param {string} id - Vaccination record ID to delete
   * @returns {Promise<boolean>} Promise resolving to true if deletion succeeded, false otherwise
   *
   * @example
   * ```typescript
   * const success = await deleteVaccination(vaccineId);
   * if (success) {
   *   toast.success('Vaccination record deleted');
   * }
   * ```
   *
   * @remarks
   * - Automatically reloads vaccinations tab on success
   * - Consider soft delete with audit trail instead of hard delete
   * - Deletion should require appropriate permissions
   */
  const deleteVaccination = async (id: string) => {
    const url = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.STUDENTS.BASE}/1/vaccinations/${id}`
    const response = await fetch(url, {
      method: 'DELETE'
    })
    if (response.ok) {
      loadVaccinations()
    }
    return response.ok
  }

  return {
    vaccinations,
    loadVaccinations,
    createVaccination,
    updateVaccination,
    deleteVaccination,
  }
}
