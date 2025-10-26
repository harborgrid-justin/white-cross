/**
 * @fileoverview Message Templates Component - Full-page templates management
 * @module components/features/communication/MessageTemplates
 * @version 1.0.0
 */

'use client'

import React from 'react'
import CommunicationTemplatesTab from './tabs/CommunicationTemplatesTab'

export default function MessageTemplates() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Message Templates</h1>
        <p className="mt-1 text-gray-600">
          Create and manage reusable message templates
        </p>
      </div>

      <CommunicationTemplatesTab />
    </div>
  )
}
