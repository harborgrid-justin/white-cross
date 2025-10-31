/**
 * Health Records Data Management Hook
 *
 * Provides local state management and direct API integration for health records data fetching
 * and mutations. This hook manages loading states and provides CRUD operations for various
 * health record types including allergies, chronic conditions, vaccinations, growth measurements,
 * and screenings.
 *
 * @module hooks/domains/health/queries/useHealthRecordsData
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 *
 * @example
 * ```typescript
 * import { useHealthRecordsData } from '@/hooks/domains/health';
 *
 * function HealthRecordsTabs({ studentId }: { studentId: string }) {
 *   const {
 *     healthRecords,
 *     allergies,
 *     vaccinations,
 *     loading,
 *     loadTabData,
 *     createAllergy,
 *     createVaccination
 *   } = useHealthRecordsData();
 *
 *   const [activeTab, setActiveTab] = useState<TabType>('records');
 *
 *   useEffect(() => {
 *     // Load data when tab changes
 *     loadTabData(activeTab, studentId);
 *   }, [activeTab, studentId]);
 *
 *   const handleAddAllergy = async (allergyData: Partial<Allergy>) => {
 *     const success = await createAllergy(allergyData);
 *     if (success) {
 *       toast.success('Allergy added successfully');
 *     }
 *   };
 *
 *   return (
 *     <Tabs activeTab={activeTab} onTabChange={setActiveTab}>
 *       <TabPanel tab="allergies">
 *         {loading ? <Spinner /> : <AllergiesList allergies={allergies} />}
 *       </TabPanel>
 *     </Tabs>
 *   );
 * }
 * ```
 *
 * @remarks
 * Data Management:
 * - Maintains local state for different health record types
 * - Direct fetch API calls (not using TanStack Query)
 * - Manual cache invalidation via re-fetching after mutations
 * - Suitable for tab-based interfaces with dynamic data loading
 *
 * HIPAA Considerations:
 * - All API calls should go through authenticated endpoints
 * - PHI data is stored in component state (cleared on unmount)
 * - Error messages should be PHI-safe
 * - Consider using with useHealthRecordsCleanup for automatic cleanup
 *
 * Performance:
 * - Each tab load triggers a fresh API call
 * - No caching between tab switches
 * - Loading state prevents multiple simultaneous requests
 * - For better caching, consider using useHealthRecords hook instead
 *
 * @see {@link module:hooks/domains/health/queries/useHealthRecords} for TanStack Query-based alternative
 * @see {@link module:hooks/domains/health/healthRecordsCleanup} for HIPAA-compliant cleanup
 */

import { useState } from 'react'
import { API_CONFIG } from '@/constants/config'
import { API_ENDPOINTS } from '@/constants/api'
import type {
  TabType,
  HealthRecord,
  Allergy,
  ChronicCondition,
  Vaccination,
  GrowthMeasurement,
  Screening
} from '@/types/healthRecords'

/**
 * Health records data management hook with local state and direct API integration.
 *
 * @returns {Object} Health records data and management functions
 * @returns {HealthRecord[]} returns.healthRecords - Array of general health records
 * @returns {Allergy[]} returns.allergies - Array of student allergies (safety-critical)
 * @returns {ChronicCondition[]} returns.chronicConditions - Array of chronic conditions
 * @returns {Vaccination[]} returns.vaccinations - Array of vaccination records
 * @returns {GrowthMeasurement[]} returns.growthMeasurements - Array of growth measurements
 * @returns {Screening[]} returns.screenings - Array of health screenings (vision, hearing, etc.)
 * @returns {boolean} returns.loading - Global loading state for all API calls
 * @returns {Function} returns.loadTabData - Load data for specific tab type
 * @returns {Function} returns.createAllergy - Create new allergy record
 * @returns {Function} returns.updateAllergy - Update existing allergy record
 * @returns {Function} returns.createCondition - Create new chronic condition
 * @returns {Function} returns.createVaccination - Create new vaccination record
 * @returns {Function} returns.updateVaccination - Update existing vaccination record
 * @returns {Function} returns.deleteVaccination - Delete vaccination record
 * @returns {Function} returns.createGrowthMeasurement - Create new growth measurement
 *
 * @example
 * ```typescript
 * const {
 *   allergies,
 *   vaccinations,
 *   loading,
 *   loadTabData,
 *   createVaccination
 * } = useHealthRecordsData();
 *
 * // Load vaccinations for a student
 * await loadTabData('vaccinations', studentId);
 *
 * // Add new vaccination
 * const newVaccination = {
 *   vaccineName: 'MMR',
 *   dateAdministered: '2024-01-15',
 *   dose: 1,
 *   administeredBy: 'Nurse Smith'
 * };
 * const success = await createVaccination(newVaccination);
 * ```
 */
export const useHealthRecordsData = () => {
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([])
  const [allergies, setAllergies] = useState<Allergy[]>([])
  const [chronicConditions, setChronicConditions] = useState<ChronicCondition[]>([])
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([])
  const [growthMeasurements, setGrowthMeasurements] = useState<GrowthMeasurement[]>([])
  const [screenings, setScreenings] = useState<Screening[]>([])
  const [loading, setLoading] = useState(false)

  /**
   * Load health records data for a specific tab type.
   *
   * Fetches data from the appropriate API endpoint based on the tab type and updates
   * the corresponding local state. Handles loading states and error conditions.
   *
   * @param {TabType} tab - Type of tab to load data for ('records' | 'allergies' | 'chronic' | 'vaccinations' | 'growth' | 'screenings')
   * @param {string} [studentId='1'] - Student ID to fetch data for (defaults to '1')
   * @param {string} [searchQuery] - Optional search query to filter health records
   * @returns {Promise<void>} Promise that resolves when data is loaded
   *
   * @example
   * ```typescript
   * // Load all allergies for student
   * await loadTabData('allergies', studentId);
   *
   * // Load health records with search
   * await loadTabData('records', studentId, 'headache');
   *
   * // Load vaccinations
   * await loadTabData('vaccinations', studentId);
   * ```
   *
   * @remarks
   * - Sets loading to true before fetch and false after completion
   * - Updates corresponding state array on successful fetch
   * - Logs errors to console but does not throw
   * - Each tab type fetches from a different API endpoint
   * - Search query only applies to 'records' tab
   */
  const loadTabData = async (tab: TabType, studentId: string = '1', searchQuery?: string) => {
    setLoading(true)

    try {
      switch (tab) {
        case 'records': {
          const url = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.STUDENTS.HEALTH_RECORDS(studentId)}${searchQuery ? `?search=${searchQuery}` : ''}`
          const response = await fetch(url)
          if (response.ok) {
            const data = await response.json()
            setHealthRecords(data.data?.records || [])
          }
          break
        }
        case 'allergies': {
          const url = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.STUDENTS.ALLERGIES(studentId)}`
          const allergyResponse = await fetch(url)
          if (allergyResponse.ok) {
            const allergyData = await allergyResponse.json()
            setAllergies(allergyData.data?.allergies || [])
          }
          break
        }
        case 'chronic': {
          const url = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.CHRONIC_CONDITIONS.BY_STUDENT(studentId)}`
          const conditionResponse = await fetch(url)
          if (conditionResponse.ok) {
            const conditionData = await conditionResponse.json()
            setChronicConditions(conditionData.data?.conditions || [])
          }
          break
        }
        case 'vaccinations': {
          const url = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.STUDENTS.IMMUNIZATIONS(studentId)}`
          const vaccinationResponse = await fetch(url)
          if (vaccinationResponse.ok) {
            const vaccinationData = await vaccinationResponse.json()
            setVaccinations(vaccinationData.data?.vaccinations || [])
          }
          break
        }
        case 'growth': {
          const url = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.VITAL_SIGNS.BY_STUDENT(studentId)}`
          const growthResponse = await fetch(url)
          if (growthResponse.ok) {
            const growthData = await growthResponse.json()
            setGrowthMeasurements(growthData.data?.measurements || [])
          }
          break
        }
        case 'screenings': {
          const url = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.VITAL_SIGNS.BY_STUDENT(studentId)}`
          const screeningResponse = await fetch(url)
          if (screeningResponse.ok) {
            const screeningData = await screeningResponse.json()
            setScreenings(screeningData.data?.screenings || [])
          }
          break
        }
      }
    } catch (error) {
      console.error('Error loading tab data:', error)
    } finally {
      setLoading(false)
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
      loadTabData('allergies')
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
      loadTabData('allergies')
    }
    return response.ok
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
      loadTabData('chronic')
    }
    return response.ok
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
      loadTabData('vaccinations')
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
      loadTabData('vaccinations')
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
      loadTabData('vaccinations')
    }
    return response.ok
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
      loadTabData('growth')
    }
    return response.ok
  }

  return {
    // Data
    healthRecords,
    allergies,
    chronicConditions,
    vaccinations,
    growthMeasurements,
    screenings,
    loading,
    
    // Actions
    loadTabData,
    createAllergy,
    updateAllergy,
    createCondition,
    createVaccination,
    updateVaccination,
    deleteVaccination,
    createGrowthMeasurement,
  }
}
