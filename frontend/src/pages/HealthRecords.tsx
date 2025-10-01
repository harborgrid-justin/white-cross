import React from 'react'
import { FileText, Heart, Shield, TrendingUp } from 'lucide-react'

export default function HealthRecords() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Health Records Management</h1>
          <p className="text-gray-600">Electronic health records, medical examinations, and health tracking</p>
        </div>
        <button className="btn-primary flex items-center">
          <FileText className="h-4 w-4 mr-2" />
          New Record
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <FileText className="h-8 w-8 text-blue-600 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Electronic Records</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Digital health records</li>
            <li>• Medical examination logs</li>
            <li>• Treatment history</li>
            <li>• Document scanning</li>
          </ul>
        </div>

        <div className="card p-6">
          <Shield className="h-8 w-8 text-green-600 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Vaccination Tracking</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Immunization records</li>
            <li>• Compliance monitoring</li>
            <li>• Reminder notifications</li>
            <li>• State reporting</li>
          </ul>
        </div>

        <div className="card p-6">
          <Heart className="h-8 w-8 text-red-600 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Health Monitoring</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Chronic condition tracking</li>
            <li>• Allergy management</li>
            <li>• Vital signs logging</li>
            <li>• Growth charts</li>
          </ul>
        </div>

        <div className="card p-6">
          <TrendingUp className="h-8 w-8 text-purple-600 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Health Analytics</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Health trend analysis</li>
            <li>• Risk assessment</li>
            <li>• Population health insights</li>
            <li>• Preventive care alerts</li>
          </ul>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">Health Records System (Under Development)</h3>
        <div className="text-center py-12 text-gray-500">
          <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>Comprehensive health records management system in development.</p>
        </div>
      </div>
    </div>
  )
}