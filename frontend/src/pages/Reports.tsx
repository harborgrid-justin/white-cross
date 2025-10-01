import React from 'react'
import { BarChart3, TrendingUp, FileText, Download } from 'lucide-react'

export default function Reports() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Health trends, compliance reports, and performance dashboards</p>
        </div>
        <button className="btn-primary flex items-center">
          <FileText className="h-4 w-4 mr-2" />
          Generate Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <TrendingUp className="h-8 w-8 text-blue-600 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Health Analytics</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Health trend analysis</li>
            <li>• Medication usage reports</li>
            <li>• Incident statistics</li>
            <li>• Attendance correlation</li>
          </ul>
        </div>

        <div className="card p-6">
          <BarChart3 className="h-8 w-8 text-green-600 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Performance Dashboards</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Real-time metrics</li>
            <li>• KPI tracking</li>
            <li>• Visual analytics</li>
            <li>• Custom dashboards</li>
          </ul>
        </div>

        <div className="card p-6">
          <FileText className="h-8 w-8 text-purple-600 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Compliance Reports</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Regulatory compliance</li>
            <li>• State health reports</li>
            <li>• HIPAA documentation</li>
            <li>• Audit reports</li>
          </ul>
        </div>

        <div className="card p-6">
          <Download className="h-8 w-8 text-red-600 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Data Export</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Custom report builder</li>
            <li>• Multiple export formats</li>
            <li>• Scheduled reports</li>
            <li>• API data access</li>
          </ul>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">Reporting & Analytics System (Under Development)</h3>
        <div className="text-center py-12 text-gray-500">
          <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>Advanced reporting and analytics platform in development.</p>
        </div>
      </div>
    </div>
  )
}