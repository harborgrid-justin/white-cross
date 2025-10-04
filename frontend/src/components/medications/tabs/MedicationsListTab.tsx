import React from 'react'
import { Search, Pill } from 'lucide-react'

interface Medication {
  id: string
  name: string
  genericName?: string
  dosageForm: string
  strength: string
  manufacturer?: string
  isControlled: boolean
  inventory?: Array<{
    quantity: number
    reorderLevel: number
  }>
  _count?: {
    studentMedications?: number
  }
}

interface MedicationsListTabProps {
  medications: Medication[]
  searchTerm: string
  onSearchChange: (term: string) => void
  onMedicationSelect: (medication: Medication) => void
  loading: boolean
}

export default function MedicationsListTab({
  medications,
  searchTerm,
  onSearchChange,
  onMedicationSelect,
  loading
}: MedicationsListTabProps) {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div data-testid="loading-spinner" className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p data-testid="loading-text" className="mt-4 text-gray-600">Loading medications...</p>
      </div>
    )
  }

  if (!medications?.length) {
    return searchTerm ? (
      <div data-testid="no-results" className="text-center py-12">
        <Pill className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No medications match your search</p>
        <p className="text-sm text-gray-400 mt-2">Try adjusting your search terms</p>
      </div>
    ) : (
      <div data-testid="empty-state" className="text-center py-12">
        <Pill className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No medications found</p>
        <p className="text-sm text-gray-400 mt-2">Add your first medication to get started</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            data-testid="medications-search"
            type="text"
            placeholder="Search medications by name, generic name, or manufacturer..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="card overflow-hidden">
        <table data-testid="medications-table" className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th data-testid="medication-name-column" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medication</th>
              <th data-testid="dosage-form-column" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dosage Form</th>
              <th data-testid="strength-column" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Strength</th>
              <th data-testid="stock-column" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th data-testid="status-column" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th data-testid="prescriptions-column" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active Prescriptions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {medications.map((med) => {
              const totalStock = med.inventory?.reduce((sum, inv) => sum + inv.quantity, 0) || 0
              const hasLowStock = med.inventory?.some((inv) => inv.quantity <= inv.reorderLevel)

              return (
                <tr
                  key={med.id}
                  data-testid="medication-row"
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => onMedicationSelect(med)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div>
                        <div data-testid="medication-name" className="text-sm font-medium text-gray-900">{med.name}</div>
                        {med.genericName && (
                          <div data-testid="medication-generic" className="text-sm text-gray-500">{med.genericName}</div>
                        )}
                        {med.manufacturer && (
                          <div className="text-xs text-gray-400">{med.manufacturer}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td data-testid="dosage-form" className="px-6 py-4 text-sm text-gray-900">{med.dosageForm}</td>
                  <td data-testid="strength" className="px-6 py-4 text-sm text-gray-900">{med.strength}</td>
                  <td className="px-6 py-4">
                    <span data-testid={hasLowStock ? "low-stock-indicator" : "stock-amount"} className={`text-sm ${hasLowStock ? 'text-red-600 font-semibold' : 'text-gray-900'}`}>
                      {totalStock} units
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      data-testid="medication-status"
                      className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    >
                      <span
                        data-testid={med.isControlled ? "controlled-badge" : "standard-badge"}
                        className={med.isControlled
                          ? 'bg-red-100 text-red-800'
                          : 'bg-green-100 text-green-800'}
                      >
                        {med.isControlled ? 'Controlled' : 'Standard'}
                      </span>
                    </span>
                  </td>
                  <td data-testid="active-prescriptions" className="px-6 py-4 text-sm text-gray-900">
                    {med._count?.studentMedications || 0}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
