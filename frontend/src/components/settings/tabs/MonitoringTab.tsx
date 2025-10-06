import React from 'react'

export default function MonitoringTab({ health, loading }: { health: any; loading: boolean }) {
  if (loading) {
    return <div className="card p-6">Loading system health...</div>
  }

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">System Health</h3>
        {health ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Total Users</div>
              <div className="text-2xl font-bold text-blue-600">{health.statistics?.totalUsers || 0}</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Active Users</div>
              <div className="text-2xl font-bold text-green-600">{health.statistics?.activeUsers || 0}</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Total Districts</div>
              <div className="text-2xl font-bold text-purple-600">{health.statistics?.totalDistricts || 0}</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Total Schools</div>
              <div className="text-2xl font-bold text-orange-600">{health.statistics?.totalSchools || 0}</div>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">No system health data available</p>
        )}
      </div>
    </div>
  )
}
