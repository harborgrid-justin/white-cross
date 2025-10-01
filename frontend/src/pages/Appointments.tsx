import React from 'react'
import { Calendar, Clock, Users, Plus } from 'lucide-react'

export default function Appointments() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointment Scheduling</h1>
          <p className="text-gray-600">Manage nurse availability, student bookings, and automated reminders</p>
        </div>
        <button className="btn-primary flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Schedule Appointment
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <Calendar className="h-8 w-8 text-blue-600 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Smart Scheduling</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Nurse availability management</li>
            <li>• Conflict detection</li>
            <li>• Recurring appointments</li>
            <li>• Calendar integration</li>
          </ul>
        </div>

        <div className="card p-6">
          <Clock className="h-8 w-8 text-green-600 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Automated Reminders</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• SMS notifications</li>
            <li>• Email reminders</li>
            <li>• Parent portal alerts</li>
            <li>• Staff notifications</li>
          </ul>
        </div>

        <div className="card p-6">
          <Users className="h-8 w-8 text-purple-600 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Waitlist Management</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Priority queuing</li>
            <li>• Automatic slot filling</li>
            <li>• No-show tracking</li>
            <li>• Cancellation handling</li>
          </ul>
        </div>

        <div className="card p-6">
          <Calendar className="h-8 w-8 text-red-600 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Appointment Types</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Routine checkups</li>
            <li>• Medication administration</li>
            <li>• Emergency assessments</li>
            <li>• Follow-up visits</li>
          </ul>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">Appointment System (Under Development)</h3>
        <div className="text-center py-12 text-gray-500">
          <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>Advanced appointment scheduling system in development.</p>
        </div>
      </div>
    </div>
  )
}