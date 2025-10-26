/**
 * WF-COMP-051 | MedicationsTab.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ../shared, ../../hooks/useMedicationsData, ../../utils/medications | Dependencies: lucide-react, ../shared, ../../hooks/useMedicationsData
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants | Key Features: functional component
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

import { Pill } from 'lucide-react'
import { SearchInput, LoadingSpinner, EmptyState } from '@/components'
import { useMedicationsData } from '@/hooks/domains/medications'
import { formatMedicationForDisplay } from '@/utils/medications'
import type { LegacyMedicationWithCount } from '@/types'

interface MedicationsTabProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  onMedicationSelect: (medication: LegacyMedicationWithCount) => void
  className?: string
  testId?: string
}

export const MedicationsTab: React.FC<MedicationsTabProps> = ({
  searchTerm,
  onSearchChange,
  onMedicationSelect,
  className = '',
  testId
}) => {
  const { medications, isLoading: medicationsLoading } = useMedicationsData()

  // Filter medications based on search term
  const filteredMedications = medications?.filter(med => 
    med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.genericName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.manufacturer?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  if (medicationsLoading) {
    return (
      <LoadingSpinner 
        size="large" 
        message="Loading medications..." 
        testId="medications-loading"
        className="py-12"
      />
    )
  }

  const renderEmptyState = () => {
    if (searchTerm) {
      return (
        <EmptyState
          icon={<Pill className="h-12 w-12" />}
          title="No medications match your search"
          description="Try adjusting your search terms"
          testId="no-results"
        />
      )
    }

    return (
      <EmptyState
        icon={<Pill className="h-12 w-12" />}
        title="No medications found"
        description="Add your first medication to get started"
        testId="empty-state"
      />
    )
  }

  return (
    <div data-testid={testId} className={`space-y-4 ${className}`}>
      {/* Search */}
      <div className="flex items-center gap-4">
        <SearchInput
          value={searchTerm}
          onChange={onSearchChange}
          placeholder="Search medications by name, generic name, or manufacturer..."
          testId="medications-search"
          className="flex-1"
        />
      </div>

      {/* Content */}
      {filteredMedications.length === 0 ? (
        renderEmptyState()
      ) : (
        <div className="card overflow-hidden">
          <table data-testid="medications-table" className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  data-testid="medication-name-column" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Medication
                </th>
                <th 
                  data-testid="dosage-form-column" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Dosage Form
                </th>
                <th 
                  data-testid="strength-column" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Strength
                </th>
                <th 
                  data-testid="stock-column" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Stock
                </th>
                <th 
                  data-testid="status-column" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th 
                  data-testid="prescriptions-column" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Active Prescriptions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMedications.map((medication: LegacyMedicationWithCount) => {
                const inventoryStats = formatMedicationForDisplay(medication)._display.inventory
                const totalStock = inventoryStats.totalQuantity
                const hasLowStock = inventoryStats.lowStock > 0
                
                return (
                  <tr 
                    key={medication.id} 
                    data-testid="medication-row" 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => onMedicationSelect(medication)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div>
                          <div 
                            data-testid="medication-name" 
                            className="text-sm font-medium text-gray-900"
                          >
                            {medication.name}
                          </div>
                          {medication.genericName && (
                            <div 
                              data-testid="medication-generic" 
                              className="text-sm text-gray-500"
                            >
                              {medication.genericName}
                            </div>
                          )}
                          {medication.manufacturer && (
                            <div className="text-xs text-gray-400">
                              {medication.manufacturer}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td 
                      data-testid="dosage-form" 
                      className="px-6 py-4 text-sm text-gray-900"
                    >
                      {medication.dosageForm}
                    </td>
                    <td 
                      data-testid="strength" 
                      className="px-6 py-4 text-sm text-gray-900"
                    >
                      {medication.strength}
                    </td>
                    <td className="px-6 py-4">
                      <span 
                        data-testid={hasLowStock ? "low-stock-indicator" : "stock-amount"} 
                        className={`text-sm ${hasLowStock ? 'text-red-600 font-semibold' : 'text-gray-900'}`}
                      >
                        {totalStock} units
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span 
                        data-testid="medication-status"
                        className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                      >
                        <span 
                          data-testid={medication.isControlled ? "controlled-badge" : "standard-badge"}
                          className={medication.isControlled 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-green-100 text-green-800'}
                        >
                          {medication.isControlled ? 'Controlled' : 'Standard'}
                        </span>
                      </span>
                    </td>
                    <td 
                      data-testid="active-prescriptions" 
                      className="px-6 py-4 text-sm text-gray-900"
                    >
                      {medication._count?.studentMedications || 0}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default MedicationsTab
