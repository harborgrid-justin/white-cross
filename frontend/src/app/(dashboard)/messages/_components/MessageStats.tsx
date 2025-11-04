/**
 * MessageStats Component
 * Displays healthcare message statistics in card format
 */

'use client';

import React from 'react';
import { Inbox, AlertTriangle, Stethoscope, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { MessageStats as MessageStatsType } from './types/message.types';

interface MessageStatsProps {
  stats: MessageStatsType;
}

/**
 * Message statistics display component
 * Shows unread, emergency, medical, and parent communication counts
 */
export const MessageStats: React.FC<MessageStatsProps> = ({ stats }) => {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      {/* Unread Messages Card */}
      <Card className="hover:shadow-md transition-shadow">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Unread Messages</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.unread}</p>
              {stats.requiresAcknowledgment > 0 && (
                <p className="text-xs text-red-600 mt-1">
                  {stats.requiresAcknowledgment} need acknowledgment
                </p>
              )}
            </div>
            <div className="relative">
              <Inbox className="h-8 w-8 text-blue-500" />
              {stats.unread > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {stats.unread > 9 ? '9+' : stats.unread}
                </span>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Emergency Alerts Card */}
      <Card className="hover:shadow-md transition-shadow">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Emergency Alerts</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{stats.emergency}</p>
              <p className="text-xs text-gray-500 mt-1">Active emergency messages</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
        </div>
      </Card>

      {/* Medical Messages Card */}
      <Card className="hover:shadow-md transition-shadow">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Medical Messages</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">{stats.medical}</p>
              <p className="text-xs text-gray-500 mt-1">Health-related communications</p>
            </div>
            <Stethoscope className="h-8 w-8 text-blue-500" />
          </div>
        </div>
      </Card>

      {/* Parent Communications Card */}
      <Card className="hover:shadow-md transition-shadow">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Parent Communications</p>
              <p className="text-2xl font-bold text-indigo-600 mt-1">
                {stats.parentCommunications}
              </p>
              <p className="text-xs text-gray-500 mt-1">Family correspondence</p>
            </div>
            <Users className="h-8 w-8 text-indigo-500" />
          </div>
        </div>
      </Card>
    </div>
  );
};
