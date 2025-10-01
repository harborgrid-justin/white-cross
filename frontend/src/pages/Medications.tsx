import React from 'react'
import { Pill, Plus, Package, AlertTriangle } from 'lucide-react'

export default function Medications() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Medication Management</h1>
          <p className="text-gray-600">Comprehensive medication tracking, administration, and inventory management</p>
        </div>
        <button className="btn-primary flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Add Medication
        </button>
      </div>

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
          <Pill className="h-8 w-8 text-purple-600 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Administration Log</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Time-stamped records</li>
            <li>• Nurse verification</li>
            <li>• Student response tracking</li>
            <li>• Parent notifications</li>
          </ul>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">Medication Features (Under Development)</h3>
        <div className="text-center py-12 text-gray-500">
          <Pill className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>Advanced medication management system coming soon.</p>
        </div>
      </div>
    </div>
  )
}