/**
 * Growth Measurements Operations Module
 *
 * Handles growth measurement state management and CRUD operations.
 * Measurements should be plotted against CDC/WHO growth charts.
 *
 * @module hooks/domains/health/queries/useHealthRecordsData.growthMeasurements
 */

import { useState } from 'react'
import { API_CONFIG } from '@/constants/config'
import { API_ENDPOINTS } from '@/constants/api'
import type { GrowthMeasurement } from '@/types/healthRecords'

export const useGrowthMeasurementsOperations = () => {
  const [growthMeasurements, setGrowthMeasurements] = useState<GrowthMeasurement[]>([])

  /**
   * Load growth measurements for a student.
   *
   * @param {string} studentId - Student ID to fetch growth measurements for
   * @returns {Promise<void>}
   */
  const loadGrowthMeasurements = async (studentId: string = '1') => {
    const url = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.VITAL_SIGNS.BY_STUDENT(studentId)}`
    const growthResponse = await fetch(url)
    if (growthResponse.ok) {
      const growthData = await growthResponse.json()
      setGrowthMeasurements(growthData.data?.measurements || [])
    }
  }

  /**
   * Create a new growth measurement record for a student.
   *
   * @param {Partial<GrowthMeasurement>} measurementData - Growth measurement data (requires height, weight, date)
   * @returns {Promise<boolean>} Promise resolving to true if creation succeeded, false otherwise
   *
   * @example
   * ```typescript
   * const measurement = {
   *   date: '2024-10-15',
   *   height: '152.4', // cm
   *   weight: '45.5',  // kg
   *   bmi: '19.6',
   *   headCircumference: '54.0', // cm (for younger students)
   *   measuredBy: 'Nurse Smith'
   * };
   * const success = await createGrowthMeasurement(measurement);
   * ```
   *
   * @remarks
   * - Automatically reloads growth tab on success
   * - Measurements should be plotted against CDC/WHO growth charts
   * - BMI percentile calculations should be age and sex-specific
   * - studentId is hardcoded to '1' (consider parameterizing)
   */
  const createGrowthMeasurement = async (measurementData: Partial<GrowthMeasurement>) => {
    const url = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.HEALTH_RECORDS.BASE}/growth`
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId: '1', ...measurementData })
    })
    if (response.ok) {
      loadGrowthMeasurements()
    }
    return response.ok
  }

  return {
    growthMeasurements,
    loadGrowthMeasurements,
    createGrowthMeasurement,
  }
}
