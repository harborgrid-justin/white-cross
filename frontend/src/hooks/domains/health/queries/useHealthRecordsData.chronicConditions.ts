/**
 * Chronic Conditions Operations Module
 *
 * Handles chronic condition state management and CRUD operations.
 *
 * @module hooks/domains/health/queries/useHealthRecordsData.chronicConditions
 */

import { useState } from 'react'
import { API_CONFIG } from '@/constants/config'
import { API_ENDPOINTS } from '@/constants/api'
import type { ChronicCondition } from '@/types/healthRecords'

export const useChronicConditionsOperations = () => {
  const [chronicConditions, setChronicConditions] = useState<ChronicCondition[]>([])

  /**
   * Load chronic conditions for a student.
   *
   * @param {string} studentId - Student ID to fetch chronic conditions for
   * @returns {Promise<void>}
   */
  const loadChronicConditions = async (studentId: string = '1') => {
    const url = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.CHRONIC_CONDITIONS.BY_STUDENT(studentId)}`
    const conditionResponse = await fetch(url)
    if (conditionResponse.ok) {
      const conditionData = await conditionResponse.json()
      setChronicConditions(conditionData.data?.conditions || [])
    }
  }

  /**
   * Create a new chronic condition record for a student.
   *
   * @param {Partial<ChronicCondition>} conditionData - Chronic condition data (requires name, diagnosedDate, status)
   * @returns {Promise<boolean>} Promise resolving to true if creation succeeded, false otherwise
   *
   * @example
   * ```typescript
   * const condition = {
   *   name: 'Type 1 Diabetes',
   *   icdCode: 'E10',
   *   diagnosedDate: '2023-05-10',
   *   status: 'ACTIVE',
   *   managementPlan: 'Insulin therapy, blood glucose monitoring'
   * };
   * const success = await createCondition(condition);
   * ```
   *
   * @remarks
   * - Automatically reloads chronic conditions tab on success
   * - studentId is hardcoded to '1' (consider parameterizing)
   */
  const createCondition = async (conditionData: Partial<ChronicCondition>) => {
    const url = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.HEALTH_RECORDS.BASE}/chronic-conditions`
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId: '1', ...conditionData })
    })
    if (response.ok) {
      loadChronicConditions()
    }
    return response.ok
  }

  return {
    chronicConditions,
    loadChronicConditions,
    createCondition,
  }
}
