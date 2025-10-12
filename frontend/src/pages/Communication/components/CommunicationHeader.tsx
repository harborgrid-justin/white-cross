/**
 * Communication Header Component
 *
 * Displays the page header with title and description
 * @module pages/Communication/components
 */

import React from 'react'

export const CommunicationHeader: React.FC = () => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Communication Center</h1>
        <p className="text-gray-600 mt-1">
          Multi-channel messaging and communication management
        </p>
      </div>
    </div>
  )
}
