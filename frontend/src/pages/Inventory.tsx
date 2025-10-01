import React from 'react'
import { Package, TrendingDown, AlertCircle, DollarSign } from 'lucide-react'

export default function Inventory() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600">Track medical supplies, equipment, and automated reordering</p>
        </div>
        <button className="btn-primary flex items-center">
          <Package className="h-4 w-4 mr-2" />
          Add Item
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <Package className="h-8 w-8 text-blue-600 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Supply Tracking</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Medical supply inventory</li>
            <li>• Equipment tracking</li>
            <li>• Batch number logging</li>
            <li>• Location management</li>
          </ul>
        </div>

        <div className="card p-6">
          <TrendingDown className="h-8 w-8 text-green-600 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Automated Reordering</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Reorder point alerts</li>
            <li>• Vendor management</li>
            <li>• Purchase order automation</li>
            <li>• Delivery tracking</li>
          </ul>
        </div>

        <div className="card p-6">
          <AlertCircle className="h-8 w-8 text-red-600 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Expiration Monitoring</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Expiration date tracking</li>
            <li>• Early warning alerts</li>
            <li>• Rotation management</li>
            <li>• Disposal protocols</li>
          </ul>
        </div>

        <div className="card p-6">
          <DollarSign className="h-8 w-8 text-purple-600 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Cost Management</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Budget tracking</li>
            <li>• Cost per unit analysis</li>
            <li>• Usage analytics</li>
            <li>• Vendor comparison</li>
          </ul>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">Inventory Management System (Under Development)</h3>
        <div className="text-center py-12 text-gray-500">
          <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>Comprehensive inventory management system in development.</p>
        </div>
      </div>
    </div>
  )
}