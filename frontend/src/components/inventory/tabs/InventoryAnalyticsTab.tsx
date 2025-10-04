import React from 'react'
import { Wrench, Calendar, TrendingUp } from 'lucide-react'

export default function InventoryAnalyticsTab() {
  return (
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
  )
}
