import React, { useState } from 'react'
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Medication Management</h1>
          <p className="text-gray-600">Comprehensive medication tracking, administration, and inventory management</p>
        </div>
        <div className="flex gap-2">
          {activeTab === 'medications' && (
            <button 
              onClick={() => setShowAddMedication(true)}
              className="btn-primary flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Medication
            </button>
          )}
          {activeTab === 'adverse-reactions' && (
            <button 
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
                onClick={() => setActiveTab(tab.id)}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card p-6">
              <Pill className="h-8 w-8 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Prescription Management</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Digital prescription tracking</li>
                <li>• Dosage scheduling</li>
                <li>• Administration logging</li>
                <li>• Compliance monitoring</li>
              </ul>
            </div>

            <div className="card p-6">
              <Package className="h-8 w-8 text-green-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Inventory Tracking</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Stock level monitoring</li>
                <li>• Expiration date alerts</li>
                <li>• Automated reorder points</li>
                <li>• Supplier management</li>
              </ul>
            </div>

            <div className="card p-6">
              <AlertTriangle className="h-8 w-8 text-red-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Safety & Compliance</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Controlled substance tracking</li>
                <li>• Side effect monitoring</li>
                <li>• Drug interaction alerts</li>
                <li>• Regulatory compliance</li>
              </ul>
            </div>

            <div className="card p-6">
              <Bell className="h-8 w-8 text-purple-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Automated Reminders</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Time-stamped records</li>
                <li>• Nurse verification</li>
                <li>• Student response tracking</li>
                <li>• Dosage reminders</li>
              </ul>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button 
                onClick={() => setActiveTab('medications')}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
              >
                <Pill className="h-6 w-6 text-blue-600 mb-2" />
                <h4 className="font-semibold">View Medications</h4>
                <p className="text-sm text-gray-600">Browse medication database</p>
              </button>
              <button 
                onClick={() => setActiveTab('reminders')}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
              >
                <Clock className="h-6 w-6 text-blue-600 mb-2" />
                <h4 className="font-semibold">Today's Reminders</h4>
                <p className="text-sm text-gray-600">View scheduled medications</p>
              </button>
              <button 
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
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading medications...</p>
            </div>
          ) : (
            <div className="card overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medication</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dosage Form</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Strength</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active Prescriptions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {medicationsData?.medications?.map((med: any) => {
                    const totalStock = med.inventory?.reduce((sum: number, inv: any) => sum + inv.quantity, 0) || 0
                    const hasLowStock = med.inventory?.some((inv: any) => inv.quantity <= inv.reorderLevel)
                    
                    return (
                      <tr key={med.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{med.name}</div>
                              {med.genericName && (
                                <div className="text-sm text-gray-500">{med.genericName}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{med.dosageForm}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{med.strength}</td>
                        <td className="px-6 py-4">
                          <span className={`text-sm ${hasLowStock ? 'text-red-600 font-semibold' : 'text-gray-900'}`}>
                            {totalStock} units
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            med.isControlled 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {med.isControlled ? 'Controlled' : 'Standard'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
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
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading inventory...</p>
            </div>
          ) : (
            <>
              {/* Alerts */}
              {(inventoryData?.alerts?.expired?.length > 0 || inventoryData?.alerts?.nearExpiry?.length > 0 || inventoryData?.alerts?.lowStock?.length > 0) && (
                <div className="space-y-3">
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
                <table className="min-w-full divide-y divide-gray-200">
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
            <div className="space-y-4">
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
    </div>
  )
}