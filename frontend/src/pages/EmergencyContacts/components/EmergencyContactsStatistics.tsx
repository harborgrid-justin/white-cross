/**
 * WF-COMP-181 | EmergencyContactsStatistics.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: react, lucide-react
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: default export | Key Features: component
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Emergency Contacts Statistics Component
 *
 * Displays statistics cards for emergency contacts
 *
 * @module components/EmergencyContactsStatistics
 */

import React from 'react';
import { Users, CheckCircle, Phone, MessageCircle } from 'lucide-react';
import type { EmergencyContactStatistics } from '../types';

interface EmergencyContactsStatisticsProps {
  statistics?: EmergencyContactStatistics;
}

/**
 * Statistics cards component
 */
export default function EmergencyContactsStatistics({
  statistics,
}: EmergencyContactsStatisticsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="card p-6">
        <Users className="h-8 w-8 text-blue-600 mb-4" />
        <h3 className="text-2xl font-bold text-gray-900">
          {statistics?.totalContacts || 0}
        </h3>
        <p className="text-sm text-gray-600">Total Contacts</p>
      </div>

      <div className="card p-6">
        <CheckCircle className="h-8 w-8 text-green-600 mb-4" />
        <h3 className="text-2xl font-bold text-gray-900">
          {statistics?.verifiedContacts || 0}
        </h3>
        <p className="text-sm text-gray-600">Verified Contacts</p>
      </div>

      <div className="card p-6">
        <Phone className="h-8 w-8 text-red-600 mb-4" />
        <h3 className="text-2xl font-bold text-gray-900">
          {statistics?.primaryContacts || 0}
        </h3>
        <p className="text-sm text-gray-600">Primary Contacts</p>
      </div>

      <div className="card p-6">
        <MessageCircle className="h-8 w-8 text-purple-600 mb-4" />
        <h3 className="text-2xl font-bold text-gray-900">
          {statistics?.notificationsSent || 0}
        </h3>
        <p className="text-sm text-gray-600">Notifications Sent</p>
      </div>
    </div>
  );
}
