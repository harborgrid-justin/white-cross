/**
 * @fileoverview Scheduled Messages Component - Display scheduled and recurring messages
 * @module app/(dashboard)/communications/_components/ScheduledMessages
 * @category Communications - Components
 */

'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';

export function ScheduledMessages() {
  return (
    <Card>
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Clock className="h-5 w-5 mr-2 text-green-600" />
          Scheduled Messages
        </h3>
      </div>
      <div className="p-6">
        <div className="space-y-3">
          {/* Scheduled Message 1 */}
          <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-yellow-900">Flu Season Tips</p>
              <p className="text-xs text-yellow-700">Scheduled for tomorrow 8:00 AM</p>
            </div>
            <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-800">
              Pending
            </Badge>
          </div>

          {/* Scheduled Message 2 */}
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-blue-900">Weekly Health Report</p>
              <p className="text-xs text-blue-700">Scheduled for Friday 3:00 PM</p>
            </div>
            <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
              Scheduled
            </Badge>
          </div>

          {/* Recurring Message */}
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-green-900">Medication Reminders</p>
              <p className="text-xs text-green-700">Daily at 11:45 AM</p>
            </div>
            <Badge variant="default" className="text-xs bg-green-100 text-green-800">
              Recurring
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  );
}
