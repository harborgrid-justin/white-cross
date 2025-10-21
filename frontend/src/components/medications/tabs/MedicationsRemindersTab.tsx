/**
 * WF-COMP-058 | MedicationsRemindersTab.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: react, lucide-react
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: default export | Key Features: component
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

import React from 'react'
import { Bell, Clock, Calendar } from 'lucide-react'

interface Reminder {
  id: string
  studentName: string
  medicationName: string
  dosage: string
  scheduledTime: string
  status: 'PENDING' | 'COMPLETED' | 'MISSED'
}

interface RemindersData {
  reminders?: Reminder[]
}

interface MedicationsRemindersTabProps {
  data: RemindersData | undefined
  loading: boolean
}

export default function MedicationsRemindersTab({ data, loading }: MedicationsRemindersTabProps) {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div data-testid="loading-spinner" className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p data-testid="loading-text" className="mt-4 text-gray-600">Loading reminders...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div data-testid="todays-schedule" className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-gray-500" />
            <h3 className="text-lg font-semibold">Today's Medication Schedule</h3>
          </div>
          <div className="text-sm text-gray-600">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {!data?.reminders || data.reminders.length === 0 ? (
          <div data-testid="no-reminders-message" className="card p-12 text-center">
            <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No medication reminders for today</p>
          </div>
        ) : (
          <div data-testid="reminders-list" className="grid gap-4">
            {data.reminders.map((reminder) => (
              <div
                key={reminder.id}
                data-testid="reminder-card"
                className={`card p-4 border-l-4 ${
                  reminder.status === 'COMPLETED' ? 'border-green-500 bg-green-50' :
                  reminder.status === 'MISSED' ? 'border-red-500 bg-red-50' :
                  'border-blue-500 bg-blue-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${
                      reminder.status === 'COMPLETED' ? 'bg-green-100' :
                      reminder.status === 'MISSED' ? 'bg-red-100' :
                      'bg-blue-100'
                    }`}>
                      <Clock className={`h-6 w-6 ${
                        reminder.status === 'COMPLETED' ? 'text-green-600' :
                        reminder.status === 'MISSED' ? 'text-red-600' :
                        'text-blue-600'
                      }`} />
                    </div>
                    <div>
                      <h4 data-testid="student-name" className="font-semibold text-gray-900">{reminder.studentName}</h4>
                      <p data-testid="medication-info" className="text-sm text-gray-600">{reminder.medicationName} - {reminder.dosage}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div data-testid="scheduled-time" className="text-sm font-medium text-gray-900">
                      {new Date(reminder.scheduledTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <span data-testid="reminder-status" className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      reminder.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                      reminder.status === 'MISSED' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {reminder.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
