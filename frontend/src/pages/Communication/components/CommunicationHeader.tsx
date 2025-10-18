/**
 * WF-COMP-162 | CommunicationHeader.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: react
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants | Key Features: functional component
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

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
