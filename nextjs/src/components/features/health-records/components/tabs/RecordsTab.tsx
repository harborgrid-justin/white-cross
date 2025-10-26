'use client';

/**
 * RecordsTab Component - Health Records List View
 *
 * Displays searchable list of health records with role-based data masking
 * for PHI protection. Includes confidential record indicators and provider information.
 *
 * @module components/features/health-records/tabs/RecordsTab
 *
 * HIPAA Compliance:
 * - Implements role-based PHI data masking (READ_ONLY users see masked data)
 * - Confidential records marked with shield icon
 * - Search functionality filters without exposing masked PHI
 * - All PHI access should trigger audit logging on backend
 *
 * @component
 * @since 2025-10-17
 */

import React from 'react'
import { FileText, Stethoscope, Shield } from 'lucide-react'
import { SearchAndFilter } from '../shared/SearchAndFilter'
import { useAuthContext } from '../../../../../hooks/utilities/AuthContext'
import type { HealthRecord } from '@/services/modules/healthRecordsApi'

/**
 * Props for RecordsTab component
 *
 * @interface RecordsTabProps
 * @property {string} searchQuery - Current search query for filtering records
 * @property {(query: string) => void} onSearchChange - Callback when search query changes
 * @property {HealthRecord[]} healthRecords - Array of health records to display
 * @property {() => void} onViewDetails - Callback when viewing record details
 *
 * @example
 * ```tsx
 * <RecordsTab
 *   searchQuery={searchText}
 *   onSearchChange={setSearchText}
 *   healthRecords={studentHealthRecords}
 *   onViewDetails={() => openDetailsModal()}
 * />
 * ```
 */
interface RecordsTabProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  healthRecords: HealthRecord[]
  onViewDetails: () => void
}

export const RecordsTab: React.FC<RecordsTabProps> = ({
  searchQuery,
  onSearchChange,
  healthRecords,
  onViewDetails
}) => {
  const { user } = useAuthContext()
  
  const maskSensitiveData = (data: string, userRole: string, dataType?: string) => {
    if (userRole === 'ADMIN') return data
    if (userRole === 'READ_ONLY') {
      // Specific masking based on data type
      if (dataType === 'ssn') return '***-**-****'
      if (dataType === 'insurance') return '****'
      if (dataType === 'diagnosis') return '[RESTRICTED]'
      return '***'
    }
    return data
  }

  // Filter records based on search query
  const displayRecords = React.useMemo(() => {
    if (!searchQuery) return healthRecords

    const lowerQuery = searchQuery.toLowerCase()
    return healthRecords.filter(record =>
      record.type?.toLowerCase().includes(lowerQuery) ||
      record.provider?.toLowerCase().includes(lowerQuery) ||
      record.description?.toLowerCase().includes(lowerQuery)
    )
  }, [healthRecords, searchQuery])

  return (
    <div className="space-y-4" data-testid="records-content">
      {/* Search and Filter */}
      <SearchAndFilter
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        searchPlaceholder="Search health records..."
        showFilter={false}
        showSort={false}
        testIds={{ search: 'search-records-input' }}
      />

      {/* Records List */}
      <div className="space-y-3" data-testid="health-records-list">
        {displayRecords.length === 0 ? (
          <div className="text-center py-8" data-testid="no-records-message">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No health records found matching your search.</p>
          </div>
        ) : (
          displayRecords.map((record) => (
            <div key={record.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50" data-testid="health-record-item">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-3">
                  {record.isConfidential ? (
                    <Shield className="h-5 w-5 text-red-600 mt-1" data-testid="record-type-icon" />
                  ) : (
                    <Stethoscope className="h-5 w-5 text-blue-600 mt-1" data-testid="record-type-icon" />
                  )}
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold" data-testid="record-title">{record.type}</h4>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded" data-testid="record-type">
                        {new Date(record.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600" data-testid="record-provider">
                      {record.provider || 'Provider not specified'}
                    </p>
                    <p className="text-sm text-gray-600" data-testid="record-date">
                      {record.date || 'Date not specified'}
                    </p>
                    <p className="text-sm text-gray-500 mt-1" data-testid="record-content">
                      {record.description}
                    </p>

                    {/* Diagnosis and Notes - Protected Health Information */}
                    {(record.diagnosis || record.notes) && (
                      <div className="mt-2 space-y-1 text-xs text-gray-600">
                        {record.diagnosis && (
                          <div>
                            <span className="font-medium">Diagnosis: </span>
                            <span data-testid="diagnosis-details">
                              {maskSensitiveData(record.diagnosis, user?.role || 'VIEWER', 'diagnosis')}
                            </span>
                          </div>
                        )}
                        {record.notes && user?.role !== 'READ_ONLY' && (
                          <div>
                            <span className="font-medium">Notes: </span>
                            <span data-testid="record-notes">
                              {record.notes}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium" 
                    data-testid="view-details-button"
                    onClick={onViewDetails}
                  >
                    View Details
                  </button>
                  {user?.role !== 'READ_ONLY' && (
                    <>
                      <button 
                        className="text-green-600 hover:text-green-700 text-sm font-medium" 
                        data-testid="edit-record-button"
                        onClick={() => {}}
                      >
                        Edit
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-700 text-sm font-medium" 
                        data-testid="delete-record-button"
                        onClick={() => {}}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}