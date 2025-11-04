/**
 * Health Records and Screenings Operations Module
 *
 * Handles general health records and screening data state management.
 *
 * @module hooks/domains/health/queries/useHealthRecordsData.healthRecords
 */

import { useState } from 'react'
import { API_CONFIG } from '@/constants/config'
import { API_ENDPOINTS } from '@/constants/api'
import type { HealthRecord, Screening } from '@/types/healthRecords'

export const useHealthRecordsOperations = () => {
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([])
  const [screenings, setScreenings] = useState<Screening[]>([])

  /**
   * Load health records for a student with optional search.
   *
   * @param {string} studentId - Student ID to fetch health records for
   * @param {string} [searchQuery] - Optional search query to filter health records
   * @returns {Promise<void>}
   */
  const loadHealthRecords = async (studentId: string = '1', searchQuery?: string) => {
    const url = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.STUDENTS.HEALTH_RECORDS(studentId)}${searchQuery ? `?search=${searchQuery}` : ''}`
    const response = await fetch(url)
    if (response.ok) {
      const data = await response.json()
      setHealthRecords(data.data?.records || [])
    }
  }

  /**
   * Load screenings for a student.
   *
   * @param {string} studentId - Student ID to fetch screenings for
   * @returns {Promise<void>}
   */
  const loadScreenings = async (studentId: string = '1') => {
    const url = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.VITAL_SIGNS.BY_STUDENT(studentId)}`
    const screeningResponse = await fetch(url)
    if (screeningResponse.ok) {
      const screeningData = await screeningResponse.json()
      setScreenings(screeningData.data?.screenings || [])
    }
  }

  return {
    healthRecords,
    screenings,
    loadHealthRecords,
    loadScreenings,
  }
}
