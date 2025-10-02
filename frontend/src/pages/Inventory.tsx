import React, { useState, useEffect } from 'react'
import { 
  Package, 
  TrendingDown, 
  AlertCircle, 
  DollarSign, 
  Plus,
  Search,
  Filter,
  ShoppingCart,
  Wrench,
  TrendingUp,
  Calendar,
  Bell
} from 'lucide-react'
import { inventoryApi, vendorApi, purchaseOrderApi, budgetApi } from '../services/api'
import { InventoryItem, InventoryAlert, Vendor, PurchaseOrder, BudgetCategory } from '../types'
import toast from 'react-hot-toast'

export default function Inventory() {
  const [activeTab, setActiveTab] = useState<'items' | 'vendors' | 'orders' | 'budget' | 'analytics'>('items')
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([])
  const [alerts, setAlerts] = useState<InventoryAlert[]>([])
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([])
  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  useEffect(() => {
    loadData()
  }, [activeTab])

  const loadData = async () => {
    setLoading(true)
    try {
      switch (activeTab) {
        case 'items':
          const [itemsData, alertsData] = await Promise.all([
            inventoryApi.getItems(1, 50),
            inventoryApi.getAlerts()
          ])
          setInventoryItems(itemsData.items || [])
          setAlerts(alertsData.alerts || [])
          break
        case 'vendors':
          const vendorsData = await vendorApi.getAll(1, 50)
          setVendors(vendorsData.vendors || [])
          break
        case 'orders':
          const ordersData = await purchaseOrderApi.getAll(1, 50)
          setPurchaseOrders(ordersData.orders || [])
          break
        case 'budget':
          const budgetData = await budgetApi.getCategories()
          setBudgetCategories(budgetData.categories || [])
          break
      }
    } catch (error) {
      console.error('Error loading data:', error)
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = Array.from(new Set(inventoryItems.map(item => item.category)))

  const getAlertBadgeColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'bg-red-100 text-red-800'
      case 'HIGH': return 'bg-orange-100 text-orange-800'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-blue-100 text-blue-800'
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-100 text-green-800'
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'RECEIVED': return 'bg-blue-100 text-blue-800'
      case 'CANCELLED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600">Track medical supplies, equipment, and automated reordering</p>
        </div>
        <button 
          className="btn-primary flex items-center"
          onClick={() => setShowAddModal(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{inventoryItems.length}</p>
            </div>
            <Package className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Alerts</p>
              <p className="text-2xl font-bold text-gray-900">{alerts.length}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Vendors</p>
              <p className="text-2xl font-bold text-gray-900">{vendors.length}</p>
            </div>
            <TrendingDown className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Orders</p>
              <p className="text-2xl font-bold text-gray-900">
                {purchaseOrders.filter(po => po.status === 'PENDING').length}
              </p>
            </div>
            <ShoppingCart className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <div className="card p-6">
          <div className="flex items-center mb-4">
            <Bell className="h-5 w-5 text-red-600 mr-2" />
            <h3 className="text-lg font-semibold">Active Alerts ({alerts.length})</h3>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {alerts.slice(0, 10).map((alert) => (
              <div 
                key={alert.id} 
                className={`p-3 rounded-lg border ${
                  alert.severity === 'CRITICAL' ? 'border-red-200 bg-red-50' :
                  alert.severity === 'HIGH' ? 'border-orange-200 bg-orange-50' :
                  'border-yellow-200 bg-yellow-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getAlertBadgeColor(alert.severity)}`}>
                        {alert.severity}
                      </span>
                      <span className="text-xs text-gray-500">{alert.type.replace(/_/g, ' ')}</span>
                    </div>
                    <p className="mt-1 text-sm font-medium text-gray-900">{alert.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'items', label: 'Inventory Items', icon: Package },
            { id: 'vendors', label: 'Vendors', icon: TrendingDown },
            { id: 'orders', label: 'Purchase Orders', icon: ShoppingCart },
            { id: 'budget', label: 'Budget', icon: DollarSign },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                flex items-center py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <tab.icon className="h-5 w-5 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content Area */}
      <div className="card p-6">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Inventory Items Tab */}
            {activeTab === 'items' && (
              <div className="space-y-4">
                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search items..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Items Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reorder Level</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Cost</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredItems.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{item.name}</div>
                            {item.sku && <div className="text-xs text-gray-500">SKU: {item.sku}</div>}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`text-sm font-medium ${
                              (item.currentStock || 0) <= item.reorderLevel ? 'text-red-600' : 'text-green-600'
                            }`}>
                              {item.currentStock || 0}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.reorderLevel}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ${item.unitCost?.toFixed(2) || '0.00'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.location || 'N/A'}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              item.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {item.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Vendors Tab */}
            {activeTab === 'vendors' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Vendor Management</h3>
                  <button className="btn-primary flex items-center text-sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Vendor
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {vendors.map((vendor) => (
                    <div key={vendor.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-semibold text-gray-900">{vendor.name}</h4>
                        {vendor.rating && (
                          <div className="flex items-center">
                            <span className="text-yellow-500">★</span>
                            <span className="ml-1 text-sm text-gray-600">{vendor.rating}/5</span>
                          </div>
                        )}
                      </div>
                      {vendor.contactName && (
                        <p className="text-sm text-gray-600 mb-1">Contact: {vendor.contactName}</p>
                      )}
                      {vendor.email && (
                        <p className="text-sm text-gray-600 mb-1">{vendor.email}</p>
                      )}
                      {vendor.phone && (
                        <p className="text-sm text-gray-600 mb-1">{vendor.phone}</p>
                      )}
                      {vendor.paymentTerms && (
                        <p className="text-sm text-gray-500 mt-2">Terms: {vendor.paymentTerms}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Purchase Orders Tab */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Purchase Orders</h3>
                  <button className="btn-primary flex items-center text-sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Order
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order #</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {purchaseOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {order.orderNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {order.vendor.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(order.orderDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                            ${order.total.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(order.status)}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {order.items.length} items
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Budget Tab */}
            {activeTab === 'budget' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Budget Management</h3>
                  <button className="btn-primary flex items-center text-sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Category
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {budgetCategories.map((category) => (
                    <div key={category.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{category.name}</h4>
                          {category.description && (
                            <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">FY{category.fiscalYear}</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Allocated:</span>
                          <span className="font-medium">${category.allocatedAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Spent:</span>
                          <span className="font-medium text-red-600">${category.spentAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Remaining:</span>
                          <span className="font-medium text-green-600">
                            ${(category.allocatedAmount - category.spentAmount).toFixed(2)}
                          </span>
                        </div>
                        <div className="mt-3">
                          <div className="flex justify-between text-xs text-gray-600 mb-1">
                            <span>Utilization</span>
                            <span>{category.utilizationPercentage?.toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                (category.utilizationPercentage || 0) > 90 ? 'bg-red-600' :
                                (category.utilizationPercentage || 0) > 75 ? 'bg-yellow-600' :
                                'bg-green-600'
                              }`}
                              style={{ width: `${Math.min(category.utilizationPercentage || 0, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Usage Analytics & Optimization</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="border rounded-lg p-4">
                    <Wrench className="h-8 w-8 text-blue-600 mb-3" />
                    <h4 className="font-semibold mb-2">Maintenance Schedule</h4>
                    <p className="text-sm text-gray-600">View and manage equipment maintenance schedules</p>
                    <button className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium">
                      View Schedule →
                    </button>
                  </div>
                  <div className="border rounded-lg p-4">
                    <Calendar className="h-8 w-8 text-green-600 mb-3" />
                    <h4 className="font-semibold mb-2">Expiration Tracking</h4>
                    <p className="text-sm text-gray-600">Monitor items approaching expiration dates</p>
                    <button className="mt-3 text-sm text-green-600 hover:text-green-700 font-medium">
                      View Expirations →
                    </button>
                  </div>
                  <div className="border rounded-lg p-4">
                    <TrendingUp className="h-8 w-8 text-purple-600 mb-3" />
                    <h4 className="font-semibold mb-2">Usage Trends</h4>
                    <p className="text-sm text-gray-600">Analyze consumption patterns and optimize stock</p>
                    <button className="mt-3 text-sm text-purple-600 hover:text-purple-700 font-medium">
                      View Analytics →
                    </button>
                  </div>
                </div>
                <div className="text-center py-12 text-gray-500">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Advanced analytics dashboards coming soon</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}