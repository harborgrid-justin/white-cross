/**
 * WF-COMP-161 | CommunicationFeatureCards.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: react, lucide-react
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants | Key Features: functional component
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Communication Feature Cards Component
 *
 * Displays feature highlights and capabilities
 * @module pages/Communication/components
 */

import React from 'react'
import { Globe, Users, MessageSquare } from 'lucide-react'

export const CommunicationFeatureCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="card p-6">
        <Globe className="h-8 w-8 text-blue-600 mb-4" />
        <h3 className="text-lg font-semibold mb-2">Language Translation</h3>
        <p className="text-sm text-gray-600">
          Automatic translation support for multi-language communication with families.
        </p>
      </div>

      <div className="card p-6">
        <Users className="h-8 w-8 text-green-600 mb-4" />
        <h3 className="text-lg font-semibold mb-2">Parent Portal Integration</h3>
        <p className="text-sm text-gray-600">
          Seamless integration with parent portal for direct communication and updates.
        </p>
      </div>

      <div className="card p-6">
        <MessageSquare className="h-8 w-8 text-purple-600 mb-4" />
        <h3 className="text-lg font-semibold mb-2">Staff Collaboration</h3>
        <p className="text-sm text-gray-600">
          Internal messaging and collaboration tools for school staff coordination.
        </p>
      </div>
    </div>
  )
}
