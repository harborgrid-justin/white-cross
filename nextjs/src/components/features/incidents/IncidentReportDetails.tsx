/**
 * @fileoverview Incident Report Details - View comprehensive incident information
 * @module components/features/incidents/IncidentReportDetails
 * @version 1.0.0
 */

'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, Calendar, MapPin, User, FileText, MessageSquare, Clock } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface IncidentReportDetailsProps {
  incidentId: string
}

export default function IncidentReportDetails({ incidentId }: IncidentReportDetailsProps) {
  const [incident, setIncident] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchIncident = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/proxy/v1/incidents/${incidentId}`)
        if (!response.ok) throw new Error('Failed to load incident')

        const data = await response.json()
        setIncident(data.report)
      } catch (error) {
        console.error('Error loading incident:', error)
        toast.error('Failed to load incident details')
      } finally {
        setLoading(false)
      }
    }

    fetchIncident()
  }, [incidentId])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!incident) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
          <h3 className="text-lg font-medium text-red-800">Incident Not Found</h3>
        </div>
        <p className="mt-2 text-sm text-red-700">
          The incident report you're looking for could not be found.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Incident Report Details</h1>
          <p className="mt-1 text-gray-600">
            Report #{incident.id}
          </p>
        </div>
        <Link
          href={`/incidents/${incidentId}/witnesses`}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Witness Statements
        </Link>
      </div>

      {/* Main Details */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4">Incident Overview</h2>

        <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <dt className="text-sm font-medium text-gray-500 mb-1">Type</dt>
            <dd className="text-sm text-gray-900">{incident.type}</dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500 mb-1">Severity</dt>
            <dd className="text-sm text-gray-900">{incident.severity}</dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500 mb-1">Location</dt>
            <dd className="text-sm text-gray-900 flex items-center">
              <MapPin className="h-4 w-4 mr-1 text-gray-400" />
              {incident.location}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500 mb-1">Date & Time</dt>
            <dd className="text-sm text-gray-900 flex items-center">
              <Calendar className="h-4 w-4 mr-1 text-gray-400" />
              {new Date(incident.occurredAt).toLocaleString()}
            </dd>
          </div>

          <div className="md:col-span-2">
            <dt className="text-sm font-medium text-gray-500 mb-1">Description</dt>
            <dd className="text-sm text-gray-900 whitespace-pre-wrap">{incident.description}</dd>
          </div>
        </dl>
      </div>

      {/* Additional Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Follow-up Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Follow-up Required:</span>
              <span className={`text-sm font-medium ${incident.followUpRequired ? 'text-orange-600' : 'text-gray-900'}`}>
                {incident.followUpRequired ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Parent Notified:</span>
              <span className={`text-sm font-medium ${incident.parentNotified ? 'text-green-600' : 'text-gray-900'}`}>
                {incident.parentNotified ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Attachments</h3>
          <p className="text-sm text-gray-500">
            No attachments available
          </p>
        </div>
      </div>
    </div>
  )
}
