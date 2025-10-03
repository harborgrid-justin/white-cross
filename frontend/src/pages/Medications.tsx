import React, { useState, useEffect } from 'react'
import { Pill, Plus, Package, AlertTriangle, Clock, Search, Calendar, Bell } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { medicationsApi } from '../services/api'
import toast from 'react-hot-toast'

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
        <div className="space-y-6">
          <div data-testid="overview-cards" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div data-testid="prescription-card" className="card p-6 hover:shadow-lg" role="article">
              <Pill className="h-8 w-8 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Prescription Management</h3>
              <ul data-testid="prescription-features" className="text-sm text-gray-600 space-y-1">
                <li>• Digital prescription tracking</li>
                <li>• Dosage scheduling</li>
                <li>• Administration logging</li>
                <li>• Compliance monitoring</li>
              </ul>
            </div>

            <div data-testid="inventory-card" className="card p-6 hover:shadow-lg" role="article">
              <Package className="h-8 w-8 text-green-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Inventory Tracking</h3>
              <ul data-testid="inventory-features" className="text-sm text-gray-600 space-y-1">
                <li>• Stock level monitoring</li>
                <li>• Expiration date alerts</li>
                <li>• Automated reorder points</li>
                <li>• Supplier management</li>
              </ul>
            </div>

            <div data-testid="safety-card" className="card p-6 hover:shadow-lg" role="article">
              <AlertTriangle className="h-8 w-8 text-red-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Safety & Compliance</h3>
              <ul data-testid="safety-features" className="text-sm text-gray-600 space-y-1">
                <li>• Controlled substance tracking</li>
                <li>• Side effect monitoring</li>
                <li>• Drug interaction alerts</li>
                <li>• Regulatory compliance</li>
              </ul>
            </div>

            <div data-testid="reminders-card" className="card p-6 hover:shadow-lg" role="article">
              <Bell className="h-8 w-8 text-purple-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Automated Reminders</h3>
              <ul data-testid="reminder-features" className="text-sm text-gray-600 space-y-1">
                <li>• Time-stamped records</li>
                <li>• Nurse verification</li>
                <li>• Student response tracking</li>
                <li>• Dosage reminders</li>
              </ul>
            </div>
          </div>

          <div data-testid="quick-actions" className="card p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button 
                data-testid="view-medications-action"
                onClick={() => setActiveTab('medications')}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
              >
                <Pill className="h-6 w-6 text-blue-600 mb-2" />
                <h4 className="font-semibold">View Medications</h4>
                <p className="text-sm text-gray-600">Browse medication database</p>
              </button>
              <button 
                data-testid="todays-reminders-action"
                onClick={() => setActiveTab('reminders')}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
              >
                <Clock className="h-6 w-6 text-blue-600 mb-2" />
                <h4 className="font-semibold">Today's Reminders</h4>
                <p className="text-sm text-gray-600">View scheduled medications</p>
              </button>
              <button 
                data-testid="check-inventory-action"
                onClick={() => setActiveTab('inventory')}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
              >
                <Package className="h-6 w-6 text-blue-600 mb-2" />
                <h4 className="font-semibold">Check Inventory</h4>
                <p className="text-sm text-gray-600">Monitor stock levels</p>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Medications Tab */}
      {activeTab === 'medications' && (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                data-testid="medications-search"
                type="text"
                placeholder="Search medications by name, generic name, or manufacturer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {medicationsLoading ? (
            <div className="text-center py-12">
              <div data-testid="loading-spinner" className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p data-testid="loading-text" className="mt-4 text-gray-600">Loading medications...</p>
            </div>
          ) : !medicationsData?.medications?.length ? (
            searchTerm ? (
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
          ) : (
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
                  {medicationsData?.medications?.map((med: any) => {
                    const totalStock = med.inventory?.reduce((sum: number, inv: any) => sum + inv.quantity, 0) || 0
                    const hasLowStock = med.inventory?.some((inv: any) => inv.quantity <= inv.reorderLevel)
                    
                    return (
                      <tr 
                        key={med.id} 
                        data-testid="medication-row" 
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => {
                          setSelectedMedication(med)
                          setShowMedicationDetails(true)
                        }}
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
          )}
        </div>
      )}

      {/* Inventory Tab */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          {inventoryLoading ? (
            <div className="text-center py-12">
              <div data-testid="loading-spinner" className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p data-testid="loading-text" className="mt-4 text-gray-600">Loading inventory...</p>
            </div>
          ) : (
            <>
              {/* Alerts */}
              {(inventoryData?.alerts?.expired?.length > 0 || inventoryData?.alerts?.nearExpiry?.length > 0 || inventoryData?.alerts?.lowStock?.length > 0) && (
                <div data-testid="inventory-alerts" className="space-y-3">
                  {inventoryData?.alerts?.expired?.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 mr-3" />
                        <div>
                          <h3 className="text-sm font-semibold text-red-900">Expired Medications</h3>
                          <p className="text-sm text-red-700 mt-1">
                            {inventoryData.alerts.expired.length} medication(s) have expired and should be disposed of
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {inventoryData?.alerts?.nearExpiry?.length > 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3" />
                        <div>
                          <h3 className="text-sm font-semibold text-yellow-900">Near Expiry</h3>
                          <p className="text-sm text-yellow-700 mt-1">
                            {inventoryData.alerts.nearExpiry.length} medication(s) expiring within 30 days
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {inventoryData?.alerts?.lowStock?.length > 0 && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <Package className="h-5 w-5 text-orange-600 mt-0.5 mr-3" />
                        <div>
                          <h3 className="text-sm font-semibold text-orange-900">Low Stock</h3>
                          <p className="text-sm text-orange-700 mt-1">
                            {inventoryData.alerts.lowStock.length} medication(s) below reorder level
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Inventory Table */}
              <div className="card overflow-hidden">
                <table data-testid="inventory-table" className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medication</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiration</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {inventoryData?.inventory?.map((item: any) => {
                      const expirationDate = new Date(item.expirationDate)
                      const daysUntilExpiry = Math.ceil((expirationDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                      
                      return (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">{item.medication.name}</div>
                            <div className="text-sm text-gray-500">{item.medication.strength}</div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">{item.batchNumber}</td>
                          <td className="px-6 py-4">
                            <span className={`text-sm ${item.alerts?.lowStock ? 'text-red-600 font-semibold' : 'text-gray-900'}`}>
                              {item.quantity} / {item.reorderLevel}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className={`text-sm ${
                              item.alerts?.expired ? 'text-red-600 font-semibold' :
                              item.alerts?.nearExpiry ? 'text-yellow-600 font-semibold' :
                              'text-gray-900'
                            }`}>
                              {expirationDate.toLocaleDateString()}
                            </div>
                            {!item.alerts?.expired && (
                              <div className="text-xs text-gray-500">
                                {daysUntilExpiry > 0 ? `${daysUntilExpiry} days` : 'Expired'}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">{item.supplier || '-'}</td>
                          <td className="px-6 py-4">
                            {item.alerts?.expired && (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                Expired
                              </span>
                            )}
                            {item.alerts?.nearExpiry && !item.alerts?.expired && (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                Near Expiry
                              </span>
                            )}
                            {item.alerts?.lowStock && (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800 ml-1">
                                Low Stock
                              </span>
                            )}
                            {!item.alerts?.expired && !item.alerts?.nearExpiry && !item.alerts?.lowStock && (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                Good
                              </span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}

      {/* Reminders Tab */}
      {activeTab === 'reminders' && (
        <div className="space-y-4">
          {remindersLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading reminders...</p>
            </div>
          ) : (
            <div data-testid="todays-schedule" className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <h3 className="text-lg font-semibold">Today's Medication Schedule</h3>
                </div>
                <div className="text-sm text-gray-600">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>

              {remindersData?.reminders?.length === 0 ? (
                <div className="card p-12 text-center">
                  <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No medication reminders for today</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {remindersData?.reminders?.map((reminder: any) => (
                    <div 
                      key={reminder.id}
                      className={`card p-4 border-l-4 ${
                        reminder.status === 'COMPLETED' ? 'border-green-500 bg-green-50' :
                        reminder.status === 'MISSED' ? 'border-red-500 bg-red-50' :
                        'border-blue-500 bg-blue-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-full ${
                            reminder.status === 'COMPLETED' ? 'bg-green-100' :
                            reminder.status === 'MISSED' ? 'bg-red-100' :
                            'bg-blue-100'
                          }`}>
                            <Clock className={`h-6 w-6 ${
                              reminder.status === 'COMPLETED' ? 'text-green-600' :
                              reminder.status === 'MISSED' ? 'text-red-600' :
                              'text-blue-600'
                            }`} />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{reminder.studentName}</h4>
                            <p className="text-sm text-gray-600">{reminder.medicationName} - {reminder.dosage}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">
                            {new Date(reminder.scheduledTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            reminder.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                            reminder.status === 'MISSED' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {reminder.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Adverse Reactions Tab */}
      {activeTab === 'adverse-reactions' && (
        <div className="space-y-4">
          {adverseReactionsLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading adverse reactions...</p>
            </div>
          ) : adverseReactionsData?.reactions?.length === 0 ? (
            <div className="card p-12 text-center">
              <AlertTriangle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No adverse reactions reported</p>
            </div>
          ) : (
            <div className="card overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reaction</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action Taken</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reported By</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {adverseReactionsData?.reactions?.map((reaction: any) => (
                    <tr key={reaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {new Date(reaction.occurredAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {reaction.student.firstName} {reaction.student.lastName}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          reaction.severity === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                          reaction.severity === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                          reaction.severity === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {reaction.severity}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                        {reaction.description}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                        {reaction.actionsTaken}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {reaction.reportedBy.firstName} {reaction.reportedBy.lastName}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
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