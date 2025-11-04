/**
 * @fileoverview Channel Performance Component - Display communication channel metrics
 * @module app/(dashboard)/communications/_components/ChannelPerformance
 * @category Communications - Components
 */

'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, Bell } from 'lucide-react';

export function ChannelPerformance() {
  return (
    <Card>
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Bell className="h-5 w-5 mr-2 text-blue-600" />
          Channel Performance
        </h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {/* Email Channel */}
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-900">Email</p>
                <p className="text-xs text-blue-700">98.5% delivery rate</p>
              </div>
            </div>
            <Badge variant="default" className="text-xs bg-green-100 text-green-800">
              Active
            </Badge>
          </div>

          {/* SMS Channel */}
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-900">SMS</p>
                <p className="text-xs text-green-700">95.2% delivery rate</p>
              </div>
            </div>
            <Badge variant="default" className="text-xs bg-green-100 text-green-800">
              Active
            </Badge>
          </div>

          {/* Push Notifications Channel */}
          <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-purple-900">Push Notifications</p>
                <p className="text-xs text-purple-700">92.8% delivery rate</p>
              </div>
            </div>
            <Badge variant="default" className="text-xs bg-green-100 text-green-800">
              Active
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  );
}
