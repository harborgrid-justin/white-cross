/**
 * Compliance Reports - HIPAA and regulatory compliance tracking
 *
 * @module app/reports/compliance/page
 * @since 2025-10-26
 */

'use client'

import { useState, useEffect } from 'react'
import { Shield, Download, AlertTriangle, CheckCircle } from 'lucide-react'
import { exportData } from '@/lib/admin-utils'
import toast from 'react-hot-toast'

interface ComplianceMetric {
  id: string
  category: string
  metric: string
  status: 'compliant' | 'warning' | 'non-compliant'
  details: string
  lastChecked: Date
}

export default function ComplianceReportsPage() {
  const [metrics, setMetrics] = useState<ComplianceMetric[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const token = localStorage.getItem('auth_token')
        const response = await fetch('/api/reports/compliance/metrics', {
          headers: { 'Authorization': `Bearer ${token}` },
        })
        const data = await response.json()
        setMetrics(data.metrics || [])
      } catch (error) {
        console.error('Error fetching compliance metrics:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchMetrics()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case 'non-compliant':
        return <AlertTriangle className="h-5 w-5 text-red-600" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'bg-green-100 text-green-800'
      case 'warning':
        return 'bg-yellow-100 text-yellow-800'
      case 'non-compliant':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleExport = async () => {
    await exportData(metrics, {
      format: 'csv',
      filename: `compliance-report-${new Date().toISOString().split('T')[0]}`,
    })
    toast.success('Compliance report exported')
  }

  const complianceScore = metrics.length > 0
    ? Math.round((metrics.filter(m => m.status === 'compliant').length / metrics.length) * 100)
    : 0

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">HIPAA Compliance</h2>
          <p className="text-sm text-gray-600 mt-1">
            Track regulatory compliance metrics and audit requirements
          </p>
        </div>
        <button
          onClick={handleExport}
          className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <Download className="h-4 w-4" />
          Export Report
        </button>
      </div>

      {/* Compliance Score */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Overall Compliance Score</h3>
            <p className="text-sm text-gray-600 mt-1">Based on {metrics.length} metrics</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600">{complianceScore}%</div>
            <p className="text-sm text-gray-600 mt-1">Compliant</p>
          </div>
        </div>
      </div>

      {/* Metrics Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Metric</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Checked</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {metrics.map((metric) => (
                <tr key={metric.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{metric.category}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{metric.metric}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(metric.status)}
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(metric.status)}`}>
                        {metric.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{metric.details}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(metric.lastChecked).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
