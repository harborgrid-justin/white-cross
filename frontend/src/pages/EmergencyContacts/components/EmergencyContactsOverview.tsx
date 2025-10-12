/**
 * Emergency Contacts Overview Component
 *
 * Displays feature highlights and information cards
 *
 * @module components/EmergencyContactsOverview
 */

import React from 'react';
import { Users, MessageCircle, Phone, Mail } from 'lucide-react';

/**
 * Overview tab component with feature highlights
 */
export default function EmergencyContactsOverview() {
  return (
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
  );
}
