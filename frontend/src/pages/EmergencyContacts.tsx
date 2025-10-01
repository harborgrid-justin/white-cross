import React from 'react'
import { Phone, MessageCircle, Mail, Users } from 'lucide-react'

export default function EmergencyContacts() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Emergency Contact System</h1>
          <p className="text-gray-600">Manage emergency contacts and multi-channel communication</p>
        </div>
        <button className="btn-primary flex items-center">
          <Users className="h-4 w-4 mr-2" />
          Add Contact
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <Users className="h-8 w-8 text-blue-600 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Contact Management</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Primary/secondary contacts</li>
            <li>• Relationship tracking</li>
            <li>• Priority management</li>
            <li>• Contact verification</li>
          </ul>
        </div>

        <div className="card p-6">
          <MessageCircle className="h-8 w-8 text-green-600 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Multi-Channel Communication</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• SMS notifications</li>
            <li>• Email alerts</li>
            <li>• Voice calls</li>
            <li>• Mobile app push</li>
          </ul>
        </div>

        <div className="card p-6">
          <Phone className="h-8 w-8 text-red-600 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Emergency Protocols</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Emergency notifications</li>
            <li>• Escalation procedures</li>
            <li>• Backup contact protocols</li>
            <li>• Response tracking</li>
          </ul>
        </div>

        <div className="card p-6">
          <Mail className="h-8 w-8 text-purple-600 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Communication History</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Message logging</li>
            <li>• Delivery confirmation</li>
            <li>• Response tracking</li>
            <li>• Communication audit</li>
          </ul>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">Emergency Contact System (Under Development)</h3>
        <div className="text-center py-12 text-gray-500">
          <Phone className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>Advanced emergency contact and communication system in development.</p>
        </div>
      </div>
    </div>
  )
}