import React, { useState } from 'react'
import { Search, Pill, Filter, Plus, Edit, Trash2, Activity } from 'lucide-react'
import { useMedicationAdministration } from '../../../hooks/useMedicationAdministration'
import { useStudents } from '../../../hooks/useStudents'

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
  const [showAdministrationModal, setShowAdministrationModal] = useState(false)
  const [selectedMedicationForAdmin, setSelectedMedicationForAdmin] = useState<Medication | null>(null)
  const [administrationForm, setAdministrationForm] = useState({
    studentId: '',
    dosage: '',
    notes: '',
    administrationTime: new Date().toISOString().slice(0, 16)
  })
  const [administrationErrors, setAdministrationErrors] = useState<Record<string, string>>({})

  const { administerMedication, isAdministering, validateAdministration } = useMedicationAdministration()
  const { students, isLoading: studentsLoading } = useStudents({ isActive: true })

  const handleAdministerMedication = (medication: Medication, event: React.MouseEvent) => {
    event.stopPropagation()
    setSelectedMedicationForAdmin(medication)
    setShowAdministrationModal(true)
  }

  const handleAdministrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedMedicationForAdmin) return

    const adminData = {
      studentId: administrationForm.studentId,
      medicationId: selectedMedicationForAdmin.id,
      dosage: administrationForm.dosage,
      administrationTime: administrationForm.administrationTime,
      notes: administrationForm.notes,
    }

    const validation = validateAdministration(adminData)

    if (!validation.isValid) {
      setAdministrationErrors(validation.errors)
      return
    }

    try {
      await administerMedication(adminData)

      setShowAdministrationModal(false)
      setAdministrationForm({
        studentId: '',
        dosage: '',
        notes: '',
        administrationTime: new Date().toISOString().slice(0, 16)
      })
      setAdministrationErrors({})
    } catch (error) {
      // Error is handled by the hook with toast notification
      console.error('Failed to administer medication:', error)
    }
  }
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
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        data-testid="administer-button"
                        onClick={(e) => handleAdministerMedication(med, e)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded"
                        title="Administer Medication"
                      >
                        <Activity className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Administration Modal */}
      {showAdministrationModal && selectedMedicationForAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div data-testid="administration-modal" className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              Administer {selectedMedicationForAdmin.name}
            </h3>
            
            <form onSubmit={handleAdministrationSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Student *</label>
                  <select
                    data-testid="student-select"
                    value={administrationForm.studentId}
                    onChange={(e) => setAdministrationForm({ ...administrationForm, studentId: e.target.value })}
                    disabled={studentsLoading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                  >
                    <option value="">
                      {studentsLoading ? 'Loading students...' : 'Select a student'}
                    </option>
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.firstName} {student.lastName} ({student.id})
                      </option>
                    ))}
                  </select>
                  {administrationErrors.student || administrationErrors.studentId ? (
                    <p data-testid="student-error" className="text-red-600 text-sm mt-1">
                      {administrationErrors.student || administrationErrors.studentId}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dosage *</label>
                  <input
                    data-testid="dosage-input"
                    type="text"
                    placeholder="e.g., 1 tablet, 5mg, 2 puffs"
                    value={administrationForm.dosage}
                    onChange={(e) => setAdministrationForm({ ...administrationForm, dosage: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {administrationErrors.dosage && (
                    <p data-testid="dosage-error" className="text-red-600 text-sm mt-1">{administrationErrors.dosage}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Administration Time</label>
                  <input
                    data-testid="administration-time"
                    type="datetime-local"
                    value={administrationForm.administrationTime}
                    onChange={(e) => setAdministrationForm({ ...administrationForm, administrationTime: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    data-testid="administration-notes"
                    placeholder="Any additional notes..."
                    value={administrationForm.notes}
                    onChange={(e) => setAdministrationForm({ ...administrationForm, notes: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowAdministrationModal(false)
                    setAdministrationForm({ studentId: '', dosage: '', notes: '', administrationTime: new Date().toISOString().slice(0, 16) })
                    setAdministrationErrors({})
                  }}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  data-testid="confirm-administration-button"
                  disabled={isAdministering}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAdministering ? 'Administering...' : 'Administer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
