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
import type { TabType } from '@/types/healthRecords'
import { useAllergiesOperations } from './useHealthRecordsData.allergies'
import { useChronicConditionsOperations } from './useHealthRecordsData.chronicConditions'
import { useVaccinationsOperations } from './useHealthRecordsData.vaccinations'
import { useGrowthMeasurementsOperations } from './useHealthRecordsData.growthMeasurements'
import { useHealthRecordsOperations } from './useHealthRecordsData.healthRecords'

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
  const [loading, setLoading] = useState(false)

  // Import operations from specialized modules
  const {
    healthRecords,
    screenings,
    loadHealthRecords,
    loadScreenings,
  } = useHealthRecordsOperations()

  const {
    allergies,
    loadAllergies,
    createAllergy,
    updateAllergy,
  } = useAllergiesOperations()

  const {
    chronicConditions,
    loadChronicConditions,
    createCondition,
  } = useChronicConditionsOperations()

  const {
    vaccinations,
    loadVaccinations,
    createVaccination,
    updateVaccination,
    deleteVaccination,
  } = useVaccinationsOperations()

  const {
    growthMeasurements,
    loadGrowthMeasurements,
    createGrowthMeasurement,
  } = useGrowthMeasurementsOperations()

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
        case 'records':
          await loadHealthRecords(studentId, searchQuery)
          break
        case 'allergies':
          await loadAllergies(studentId)
          break
        case 'chronic':
          await loadChronicConditions(studentId)
          break
        case 'vaccinations':
          await loadVaccinations(studentId)
          break
        case 'growth':
          await loadGrowthMeasurements(studentId)
          break
        case 'screenings':
          await loadScreenings(studentId)
          break
      }
    } catch (error) {
      console.error('Error loading tab data:', error)
    } finally {
      setLoading(false)
    }
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
