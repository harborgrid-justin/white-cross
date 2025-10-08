import React, { useState, useEffect, useCallback } from 'react'
import {
  Package,
  TrendingDown,
  AlertCircle,
  DollarSign,
  Plus,
  ShoppingCart,
  TrendingUp,
  Bell,
  Search,
  Wrench,
  Calendar
} from 'lucide-react'
import { inventoryApi, vendorApi, purchaseOrderApi, budgetApi } from '../services/api'
import toast from 'react-hot-toast'
import InventoryStats from '../components/inventory/InventoryStats'
import InventoryItemsTab from '../components/inventory/tabs/InventoryItemsTab'
import InventoryVendorsTab from '../components/inventory/tabs/InventoryVendorsTab'
import InventoryOrdersTab from '../components/inventory/tabs/InventoryOrdersTab'
import InventoryBudgetTab from '../components/inventory/tabs/InventoryBudgetTab'
import InventoryAnalyticsTab from '../components/inventory/tabs/InventoryAnalyticsTab'

// Using any types for now since these don't exist in the types file
type InventoryItem = any
type InventoryAlert = any
type Vendor = any
type PurchaseOrder = any
type BudgetCategory = any

export default function Inventory() {
  const [activeTab, setActiveTab] = useState<'items' | 'vendors' | 'orders' | 'budget' | 'analytics'>('items')
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([])
  const [alerts, setAlerts] = useState<InventoryAlert[]>([])
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([])
  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showAddModal, setShowAddModal] = useState(false)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      switch (activeTab) {
        case 'items': {
          const [itemsData, alertsData] = await Promise.all([
            inventoryApi.getAll(),
            inventoryApi.getAll() // Using getAll for alerts as well since getAlerts doesn't exist
          ])
          setInventoryItems(itemsData.data || [])
          setAlerts([]) // Placeholder for alerts
          break
        }
        case 'vendors': {
          const vendorsData = await vendorApi.getAll()
          setVendors(vendorsData.data || [])
          break
        }
        case 'orders': {
          const ordersData = await purchaseOrderApi.getAll()
          setPurchaseOrders(ordersData.data || [])
          break
        }
        case 'budget': {
          const budgetData = await budgetApi.getBudget()
          setBudgetCategories(budgetData.data?.categories || [])
          break
        }
      }
    } catch (error) {
      console.error('Error loading data:', error)
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }, [activeTab])

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
            {activeTab === 'items' && (
              <InventoryItemsTab
                items={inventoryItems}
                categories={categories}
                searchQuery={searchQuery}
                selectedCategory={selectedCategory}
                onSearchChange={setSearchQuery}
                onCategoryChange={setSelectedCategory}
              />
            )}

            {activeTab === 'vendors' && (
              <InventoryVendorsTab vendors={vendors} />
            )}

            {activeTab === 'orders' && (
              <InventoryOrdersTab
                orders={purchaseOrders}
                getStatusBadgeColor={getStatusBadgeColor}
              />
            )}

            {activeTab === 'budget' && (
              <InventoryBudgetTab categories={budgetCategories} />
            )}

            {activeTab === 'analytics' && (
              <InventoryAnalyticsTab />
            )}
          </>
        )}
      </div>
    </div>
  )
}
