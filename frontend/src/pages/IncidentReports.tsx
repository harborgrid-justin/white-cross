import React from 'react'
import { AlertTriangle, Camera, FileText, Bell } from 'lucide-react'

export default function IncidentReports() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Incident Reporting</h1>
          <p className="text-gray-600">Document incidents, manage follow-ups, and ensure compliance</p>
        </div>
        <button className="btn-primary flex items-center">
          <AlertTriangle className="h-4 w-4 mr-2" />
          Report Incident
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <FileText className="h-8 w-8 text-red-600 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Documentation</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Incident documentation</li>
            <li>• Injury report generation</li>
            <li>• Witness statements</li>
            <li>• Timeline tracking</li>
          </ul>
        </div>

        <div className="card p-6">
          <Camera className="h-8 w-8 text-blue-600 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Evidence Collection</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Photo/video capture</li>
            <li>• Document scanning</li>
            <li>• Evidence timestamping</li>
            <li>• Secure storage</li>
          </ul>
        </div>

        <div className="card p-6">
          <Bell className="h-8 w-8 text-green-600 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Notifications</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Parent notification</li>
            <li>• Staff alerts</li>
            <li>• Follow-up reminders</li>
            <li>• Legal notifications</li>
          </ul>
        </div>

        <div className="card p-6">
          <AlertTriangle className="h-8 w-8 text-purple-600 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Compliance</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Legal compliance</li>
            <li>• Insurance integration</li>
            <li>• Regulatory reporting</li>
            <li>• Audit trail</li>
          </ul>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">Incident Reporting System (Under Development)</h3>
        <div className="text-center py-12 text-gray-500">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>Advanced incident reporting and management system in development.</p>
        </div>
      </div>
    </div>
  )
}