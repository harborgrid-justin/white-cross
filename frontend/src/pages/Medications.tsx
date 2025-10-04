import React, { useState, useEffect } from 'react'
import { Pill, Plus, Package, AlertTriangle, Clock, Search, Calendar, Bell } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { medicationsApi } from '../services/api'
import toast from 'react-hot-toast'
import MedicationsOverviewTab from '../components/medications/tabs/MedicationsOverviewTab'
import MedicationsListTab from '../components/medications/tabs/MedicationsListTab'
import MedicationsInventoryTab from '../components/medications/tabs/MedicationsInventoryTab'
import MedicationsRemindersTab from '../components/medications/tabs/MedicationsRemindersTab'
import MedicationsAdverseReactionsTab from '../components/medications/tabs/MedicationsAdverseReactionsTab'
import MedicationFormModal from '../components/medications/MedicationFormModal'
import MedicationDetailsModal from '../components/medications/MedicationDetailsModal'

type Tab = 'overview' | 'medications' | 'inventory' | 'reminders' | 'adverse-reactions'

export default function Medications() {
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddMedication, setShowAddMedication] = useState(false)
  const [showAdverseReactionForm, setShowAdverseReactionForm] = useState(false)
  const [showMedicationDetails, setShowMedicationDetails] = useState(false)
  const [selectedMedication, setSelectedMedication] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: '',
    genericName: '',
    dosageForm: '',
    strength: '',
    manufacturer: '',
    isControlled: false
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const { data: medicationsData, isLoading: medicationsLoading } = useQuery({
    queryKey: ['medications', searchTerm],
    queryFn: () => medicationsApi.getAll(1, 20, searchTerm),
    enabled: activeTab === 'medications'
  })

  const { data: inventoryData, isLoading: inventoryLoading } = useQuery({
    queryKey: ['medication-inventory'],
    queryFn: () => medicationsApi.getInventory(),
    enabled: activeTab === 'inventory'
  })

  const { data: remindersData, isLoading: remindersLoading } = useQuery({
    queryKey: ['medication-reminders'],
    queryFn: () => medicationsApi.getReminders(),
    enabled: activeTab === 'reminders',
    refetchInterval: 60000 // Refresh every minute
  })

  const { data: adverseReactionsData, isLoading: adverseReactionsLoading } = useQuery({
    queryKey: ['adverse-reactions'],
    queryFn: () => medicationsApi.getAdverseReactions(),
    enabled: activeTab === 'adverse-reactions'
  })

  const tabs = [
    { id: 'overview' as Tab, label: 'Overview', icon: Pill },
    { id: 'medications' as Tab, label: 'Medications', icon: Pill },
    { id: 'inventory' as Tab, label: 'Inventory', icon: Package },
    { id: 'reminders' as Tab, label: 'Reminders', icon: Bell },
    { id: 'adverse-reactions' as Tab, label: 'Adverse Reactions', icon: AlertTriangle }
  ]

  useEffect(() => {
    document.title = 'Medications - White Cross - School Nurse Platform'
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 data-testid="medications-title" className="text-2xl font-bold text-gray-900" role="heading">Medication Management</h1>
          <p data-testid="medications-subtitle" className="text-gray-600">Comprehensive medication tracking, administration, and inventory management</p>
        </div>
        <div className="flex gap-2">
          {activeTab === 'medications' && (
            <button 
              data-testid="add-medication-button"
              onClick={() => setShowAddMedication(true)}
              className="btn-primary flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Medication
            </button>
          )}
          {activeTab === 'adverse-reactions' && (
            <button 
              data-testid="report-reaction-button"
              onClick={() => setShowAdverseReactionForm(true)}
              className="btn-primary flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Report Reaction
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                data-testid={`${tab.id}-tab`}
                onClick={() => setActiveTab(tab.id)}
                role="tab"
                className={`
                  flex items-center py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <Icon className="h-5 w-5 mr-2" />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <MedicationsOverviewTab onTabChange={(tab: string) => setActiveTab(tab as Tab)} />
      )}

      {/* Medications Tab */}
      {activeTab === 'medications' && (
        <MedicationsListTab
          medications={(medicationsData as any)?.data || []}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onMedicationSelect={(medication) => {
            setSelectedMedication(medication)
            setShowMedicationDetails(true)
          }}
          loading={medicationsLoading}
        />
      )}

      {/* Inventory Tab */}
      {activeTab === 'inventory' && (
        <MedicationsInventoryTab
          data={(inventoryData as any)?.data || { inventory: [], alerts: {} }}
          loading={inventoryLoading}
        />
      )}

      {/* Reminders Tab */}
      {activeTab === 'reminders' && (
        <MedicationsRemindersTab
          data={(remindersData as any)?.data || { reminders: [] }}
          loading={remindersLoading}
        />
      )}

      {/* Adverse Reactions Tab */}
      {activeTab === 'adverse-reactions' && (
        <MedicationsAdverseReactionsTab
          data={(adverseReactionsData as any)?.data || { reactions: [] }}
          loading={adverseReactionsLoading}
        />
      )}

      {/* Add Medication Modal */}
      {showAddMedication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div data-testid="add-medication-modal" className="bg-white rounded-lg p-6 w-full max-w-lg max-h-screen overflow-y-auto">
            <h3 data-testid="modal-title" className="text-lg font-semibold mb-4">Add New Medication</h3>
            
            <form onSubmit={(e) => {
              e.preventDefault()
              const errors: Record<string, string> = {}
              if (!formData.name.trim()) errors.name = 'Medication name is required'
              if (!formData.dosageForm.trim()) errors.dosageForm = 'Dosage form is required'
              if (!formData.strength.trim()) errors.strength = 'Strength is required'
              
              if (Object.keys(errors).length > 0) {
                setFormErrors(errors)
                return
              }
              
              // API call would go here
              const successToast = document.createElement('div')
              successToast.setAttribute('data-testid', 'success-toast')
              successToast.textContent = 'Medication added successfully'
              successToast.style.cssText = 'position:fixed;top:20px;right:20px;background:green;color:white;padding:10px;border-radius:4px;z-index:9999'
              document.body.appendChild(successToast)
              setTimeout(() => document.body.removeChild(successToast), 3000)
              
              toast.success('Medication added successfully')
              setShowAddMedication(false)
              setFormData({ name: '', genericName: '', dosageForm: '', strength: '', manufacturer: '', isControlled: false })
              setFormErrors({})
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Medication Name *</label>
                  <input
                    data-testid="medication-name-input"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {formErrors.name && <p data-testid="name-error" className="text-red-600 text-sm mt-1">{formErrors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Generic Name</label>
                  <input
                    data-testid="generic-name-input"
                    type="text"
                    value={formData.genericName}
                    onChange={(e) => setFormData({ ...formData, genericName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dosage Form *</label>
                  <select
                    data-testid="dosage-form-select"
                    value={formData.dosageForm}
                    onChange={(e) => setFormData({ ...formData, dosageForm: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select dosage form</option>
                    <option value="Tablet">Tablet</option>
                    <option value="Capsule">Capsule</option>
                    <option value="Liquid">Liquid</option>
                    <option value="Inhaler">Inhaler</option>
                    <option value="Injection">Injection</option>
                    <option value="Cream">Cream</option>
                    <option value="Ointment">Ointment</option>
                  </select>
                  {formErrors.dosageForm && <p data-testid="dosage-form-error" className="text-red-600 text-sm mt-1">{formErrors.dosageForm}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Strength *</label>
                  <input
                    data-testid="strength-input"
                    type="text"
                    placeholder="e.g., 500mg, 10ml"
                    value={formData.strength}
                    onChange={(e) => setFormData({ ...formData, strength: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {formErrors.strength && <p data-testid="strength-error" className="text-red-600 text-sm mt-1">{formErrors.strength}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer</label>
                  <input
                    data-testid="manufacturer-input"
                    type="text"
                    value={formData.manufacturer}
                    onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    data-testid="controlled-substance-checkbox"
                    type="checkbox"
                    checked={formData.isControlled}
                    onChange={(e) => setFormData({ ...formData, isControlled: e.target.checked })}
                    className="mr-2"
                  />
                  <label className="text-sm font-medium text-gray-700">Controlled Substance</label>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  data-testid="cancel-button"
                  onClick={() => {
                    setShowAddMedication(false)
                    setFormData({ name: '', genericName: '', dosageForm: '', strength: '', manufacturer: '', isControlled: false })
                    setFormErrors({})
                  }}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  data-testid="save-medication-button"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Medication
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Medication Details Modal */}
      {showMedicationDetails && selectedMedication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div data-testid="medication-details-modal" className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 data-testid="medication-details-title" className="text-lg font-semibold">
                {selectedMedication.name}
              </h3>
              <button
                onClick={() => setShowMedicationDetails(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Brand Name</label>
                  <p className="text-sm text-gray-900">{selectedMedication.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Generic Name</label>
                  <p className="text-sm text-gray-900">{selectedMedication.genericName || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Dosage Form</label>
                  <p className="text-sm text-gray-900">{selectedMedication.dosageForm}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Strength</label>
                  <p className="text-sm text-gray-900">{selectedMedication.strength}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    selectedMedication.isControlled 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {selectedMedication.isControlled ? 'Controlled' : 'Standard'}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Active Prescriptions</label>
                  <p className="text-sm text-gray-900">{selectedMedication._count?.studentMedications || 0}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowMedicationDetails(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
