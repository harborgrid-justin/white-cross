/**
 * WF-COMP-012 | CommunicationHistoryTab.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: react
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: default export | Key Features: component
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

import React from 'react'

interface Message {
  id: string
  subject?: string
  content: string
  priority: string
  category: string
  recipientCount: number
  createdAt: string
}

interface CommunicationHistoryTabProps {
  messages: Message[]
  getPriorityColor: (priority: string) => string
}

export default function CommunicationHistoryTab({
  messages,
  getPriorityColor
}: CommunicationHistoryTabProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Message History</h2>
      <div className="space-y-3">
        {messages.map((message) => (
          <div key={message.id} className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-gray-900">{message.subject || 'No Subject'}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(message.priority)}`}>
                    {message.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{message.content}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-xs text-gray-500">
                    Category: {message.category}
                  </span>
                  <span className="text-xs text-gray-500">
                    Recipients: {message.recipientCount}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(message.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
