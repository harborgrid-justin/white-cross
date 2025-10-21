/**
 * Communication Page - White Cross Healthcare Platform
 * Message center and communication tools
 * 
 * @fileoverview Communication management page component
 * @module pages/communication/Communication
 * @version 1.0.0
 */

import React, { useState } from 'react'
import { 
  MessageSquare, 
  Send, 
  Users, 
  Filter,
  Search,
  Plus
} from 'lucide-react'

/**
 * Communication Page Component
 * 
 * Features:
 * - Message composition
 * - Message history
 * - Contact management
 * - Template management
 */
const Communication: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'compose' | 'history' | 'templates'>('compose')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Communication</h1>
          <p className="mt-1 text-gray-600">
            Send messages and manage communications
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('compose')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'compose'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <MessageSquare className="h-4 w-4 inline mr-2" />
            Compose Message
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'history'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Users className="h-4 w-4 inline mr-2" />
            Message History
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'templates'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Templates
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {activeTab === 'compose' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Compose New Message</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipients
                </label>
                <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                  <option value="">Select recipients...</option>
                  <option value="all_parents">All Parents</option>
                  <option value="grade_9">Grade 9 Parents</option>
                  <option value="medical_alert">Medical Alert Contacts</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message Type
                </label>
                <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                  <option value="general">General Information</option>
                  <option value="health">Health Update</option>
                  <option value="incident">Incident Report</option>
                  <option value="appointment">Appointment Reminder</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input 
                type="text" 
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Enter message subject..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea 
                rows={6}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Enter your message..."
              />
            </div>
            <div className="flex justify-end">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center">
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </button>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Message History</h2>
            <div className="text-gray-500 text-center py-8">
              Message history will be displayed here
            </div>
          </div>
        )}

        {activeTab === 'templates' && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Message Templates</h2>
            <div className="text-gray-500 text-center py-8">
              Message templates will be displayed here
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Communication
