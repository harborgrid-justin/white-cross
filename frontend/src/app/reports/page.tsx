/**
 * Reports Dashboard - Overview of system reports and analytics
 *
 * @module app/reports/page
 * @since 2025-10-26
 */

'use client'

import { useState, useEffect } from 'react'
import { BarChart3, Download, FileText, Users, Activity } from 'lucide-react'
import { exportData } from '@/lib/admin-utils'
import toast from 'react-hot-toast'

export default function ReportsDashboard() {
  const [loading, setLoading] = useState(false)

  const reportCategories = [
    {
      id: 'student-health',
      title: 'Student Health Records',
      description: 'Comprehensive health record reports',
      icon: FileText,
      color: 'blue',
    },
    {
      id: 'medications',
      title: 'Medication Administration',
      description: 'Medication tracking and compliance',
      icon: Activity,
      color: 'green',
    },
    {
      id: 'compliance',
      title: 'HIPAA Compliance',
      description: 'Audit logs and compliance tracking',
      icon: BarChart3,
      color: 'purple',
    },
    {
      id: 'usage',
      title: 'System Usage',
      description: 'User activity and system analytics',
      icon: Users,
      color: 'orange',
    },
  ]

  const handleGenerateReport = async (reportType: string) => {
    setLoading(true)
    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch(`/api/reports/${reportType}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      })
      const data = await response.json()

      await exportData(data.records || [], {
        format: 'csv',
        filename: `${reportType}-report-${new Date().toISOString().split('T')[0]}`,
      })

      toast.success('Report generated successfully')
    } catch (error) {
      console.error('Error generating report:', error)
      toast.error('Failed to generate report')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Reports Dashboard</h2>
        <p className="text-sm text-gray-600 mt-1">
          Generate and export reports for various system categories
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportCategories.map((category) => {
          const Icon = category.icon
          const colorClasses = {
            blue: 'bg-blue-100 text-blue-600',
            green: 'bg-green-100 text-green-600',
            purple: 'bg-purple-100 text-purple-600',
            orange: 'bg-orange-100 text-orange-600',
          }

          return (
            <div
              key={category.id}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${colorClasses[category.color as keyof typeof colorClasses]}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{category.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{category.description}</p>
                  <button
                    onClick={() => handleGenerateReport(category.id)}
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 disabled:opacity-50"
                  >
                    <Download className="h-4 w-4" />
                    Generate Report
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Stats */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-600">Reports Generated (This Month)</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">24</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Compliance Reports</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">8</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Scheduled Reports</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">5</p>
          </div>
        </div>
      </div>
    </div>
  )
}
